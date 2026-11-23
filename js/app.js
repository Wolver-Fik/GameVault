/* GameVault app: collection, covers, stats, filters, roulette, backups, i18n and PWA. */
(function () {
  var STORAGE = window.GVStorage;
  var I = window.GVI18N;
  var CACHE_NAME = 'gamevault-v1.1.8';
  var RELOAD_FLAG = 'gv-cache-reload-v1.1.8';

  function t(key, vars) {
    if (!I || typeof I.t !== 'function') return String(key);
    try { return I.t(key, vars); } catch (e) { return String(key); }
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  /* El autocompletado espera a TODAS las fuentes antes de tocar el formulario.
     allSettled evita que una API lenta cancele el resto de peticiones. */
  if (typeof Promise.allSettled !== 'function') {
    Promise.allSettled = function (items) {
      return Promise.all(Array.prototype.map.call(items || [], function (p) {
        return Promise.resolve(p).then(
          function (value) { return { status: 'fulfilled', value: value }; },
          function (reason) { return { status: 'rejected', reason: reason }; }
        );
      }));
    };
  }

  var LOCALE_TAG = {
    en: 'en-US', es: 'es-UY', pt: 'pt-BR', fr: 'fr-FR',
    it: 'it-IT', de: 'de-DE', ru: 'ru-RU', ja: 'ja-JP'
  };
  function localeTag() { return LOCALE_TAG[I.current()] || I.current(); }

  var STATUS = [
    { id: 'jugando',    color: 'var(--s-play)' },
    { id: 'pendiente',  color: 'var(--s-pend)' },
    { id: 'completado', color: 'var(--s-done)' },
    { id: 'platino',    color: 'var(--s-plat)' },
    { id: 'abandonado', color: 'var(--s-aband)' }
  ];
  var SMAP = {};
  STATUS.forEach(function (s) { SMAP[s.id] = s; });
  function statusLabel(s) { return t('status.' + s.id); }

  /* Catálogo único (v1.0.8) definido en storage.js: cinco bloques con sus
     variantes "/ Emulador" y los clientes de PC. El fallback permite seguir
     funcionando si storage.js no se cargara, pero la fuente de verdad es GVStorage. */
  var FALLBACK_PC_LAUNCHER_KEYS = ['pcSteam', 'pcEpic', 'pcEa', 'pcBattleNet', 'pcUbisoft',
    'pcGog', 'pcXboxApp', 'pcRiot', 'pcOtherLauncher'];
  var PC_LAUNCHER_KEYS = (STORAGE && Array.isArray(STORAGE.PC_LAUNCHER_KEYS))
    ? STORAGE.PC_LAUNCHER_KEYS.slice() : FALLBACK_PC_LAUNCHER_KEYS.slice();
  var PC_RUNTIME_KEYS = PC_LAUNCHER_KEYS.concat(['pcEmulator']);
  /* Clientes abiertos: son los unicos que pueden representar un lanzamiento en
     PC cuando Wikidata/Infobox no nombra una tienda concreta. EA, Battle.net,
     Ubisoft, Xbox App y Riot jamas se infieren de un publisher/distributor. */
  var PC_OPEN_LAUNCHER_KEYS = ['pcSteam', 'pcGog', 'pcOtherLauncher'];
  var FALLBACK_GROUPS = [
    { id: 'pc', label: 'owned.group.pc', keys: FALLBACK_PC_LAUNCHER_KEYS.concat(['pcEmulator', 'steamDeck', 'mobile']) },
    { id: 'playstation', label: 'owned.group.playstation', keys: ['ps5', 'ps4', 'ps4Emulator', 'ps3', 'ps3Emulator', 'ps2', 'ps1', 'psp', 'psVita'] },
    { id: 'nintendoHome', label: 'owned.group.nintendoHome', keys: ['switch2', 'switch', 'switchEmulator', 'wiiU', 'wii', 'gamecube', 'n64', 'snes', 'nes'] },
    { id: 'nintendoPortable', label: 'owned.group.nintendoPortable', keys: ['n3ds', 'nds', 'gba', 'gameboy'] },
    { id: 'xboxRetro', label: 'owned.group.xboxRetro', keys: ['xboxSeries', 'xboxOne', 'xbox360', 'genesis', 'dreamcast', 'retroEmulator'] }
  ];
  var CONSOLE_GROUPS = (STORAGE && Array.isArray(STORAGE.CONSOLE_GROUPS)) ? STORAGE.CONSOLE_GROUPS : FALLBACK_GROUPS;
  var OWNED_PLATFORM_KEYS = (STORAGE && Array.isArray(STORAGE.CONSOLE_KEYS)) ? STORAGE.CONSOLE_KEYS.slice() :
    [].concat(FALLBACK_GROUPS[0].keys, FALLBACK_GROUPS[1].keys, FALLBACK_GROUPS[2].keys,
      FALLBACK_GROUPS[3].keys, FALLBACK_GROUPS[4].keys);
  /* 'pc' ya no es una opcion separada: alias historico de pcSteam en buildAliases(). */
  var PLATFORM_KEYS = (STORAGE && Array.isArray(STORAGE.PLATFORM_KEYS)) ? STORAGE.PLATFORM_KEYS.slice() :
    OWNED_PLATFORM_KEYS.concat(['emulator', 'retro']);
  /* Plataformas donde un juego puede PUBLICARSE. Excluye emuladores y las
     variantes de launcher: un QID de Windows solo acredita un lanzamiento en PC,
     no todos los clientes ni todas las maquinas emuladoras del usuario. */
  var EMULATOR_PLATFORM_KEYS = ['pcEmulator', 'ps4Emulator', 'ps3Emulator', 'switchEmulator',
    'emulator', 'retro', 'retroEmulator'];
  var RELEASE_PLATFORM_KEYS = PLATFORM_KEYS.filter(function (k) {
    return k === 'pcSteam' ||
      (PC_RUNTIME_KEYS.indexOf(k) === -1 && EMULATOR_PLATFORM_KEYS.indexOf(k) === -1);
  });
  var VIEW_KEY = (STORAGE && STORAGE.VIEW_KEY) ? STORAGE.VIEW_KEY : 'gamevault-active-view-v1';
  /* Catálogo único de géneros definido en storage.js (v1.1.1), con fallback por si
     storage.js no se cargara; la fuente de verdad es GVStorage.GENRE_KEYS. */
  var FALLBACK_GENRE_KEYS = ['action', 'adventure', 'action_adventure', 'rpg', 'action_rpg',
    'tactical_rpg', 'platformer', 'puzzle', 'puzzle_platformer', 'shooter', 'strategy',
    'sports', 'racing', 'horror', 'survival', 'survival_horror', 'indie', 'fighting',
    'simulation', 'sandbox', 'open_world', 'metroidvania', 'roguelike', 'soulslike',
    'stealth', 'visual_novel', 'rhythm', 'mmo'];
  var GENRE_KEYS = (STORAGE && Array.isArray(STORAGE.GENRE_KEYS))
    ? STORAGE.GENRE_KEYS.slice() : FALLBACK_GENRE_KEYS.slice();

  var state = { games: [], f: { status: 'todos', plat: '', genre: '', sort: 'reciente', q: '', ownedOnly: false } };
  var currentView = 'collection';
  var storageOk = true;
  var ownedPlatforms = null; /* null = no configurado, se asumen todas */
  var editingId = null;
  var editScore = null;
  var editCover = '';
  var editCoverSource = '';
  var coverMsg = '';
  var coverSearchId = 0;
  var metaSearchId = 0;
  var delArmed = false;
  var pickId = null;
  var rollToken = 0;
  var editGenres = [];
  /* Selector de plataforma del editor: null = catálogo completo sin filtrar. */
  var platformOptions = null;
  var platformHelpKey = '';
  var platformShowAll = false;
  /* null = el usuario todavia no ha usado "Autocompletar ficha": no hay datos
     de disponibilidad y el selector se comporta como en versiones anteriores. */
  var gamePlatformKeys = null;
  var recommendToken = 0;
  var recommendSeen = {};
  var recommendCurrent = null;
  var recommendGenres = [];
  var recommendPlatforms = [];
  var flashNote = '';
  var flashTimer = null;

  var $ = function (id) { return document.getElementById(id); };
  /* El overlay y su modal se ocultan/show juntos; el atributo hidden va en el HTML. */
  function setOverlay(id, open) {
    var ov = $(id);
    if (!ov) return;
    ov.hidden = !open;
    var modal = ov.querySelector ? ov.querySelector('.modal, .modal-backdrop') : null;
    if (modal) modal.hidden = !open;
  }
  function closest(node, selector) {
    while (node && node.nodeType === 1) {
      if (node.matches && node.matches(selector)) return node;
      node = node.parentNode;
    }
    return null;
  }
  function fmtNum(n) {
    var r = Math.round(n * 10) / 10;
    return r.toLocaleString(localeTag(), { maximumFractionDigits: 1 });
  }
  function uid() {
    if (STORAGE && typeof STORAGE.uid === 'function') return STORAGE.uid();
    return 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function splitRelease(value) {
    if (STORAGE && typeof STORAGE.splitRelease === 'function') return STORAGE.splitRelease(value);
    var s = String(value || '').trim().slice(0, 30);
    var m = /(\d{4})/.exec(s);
    return { releaseDate: s, releaseYear: m ? m[1] : '' };
  }

  /* ---------- plataformas y géneros multilingües ---------- */
  var aliasCache = null;
  function buildAliases() {
    var map = {};
    function add(value, prefixed) {
      var s = String(value || '').trim().toLowerCase();
      if (!s) return;
      if (!map[s]) map[s] = [];
      if (map[s].indexOf(prefixed) === -1) map[s].push(prefixed);
    }
    I.ORDER.forEach(function (code) {
      PLATFORM_KEYS.forEach(function (k) { add(I.tIn(code, 'platform.' + k), 'p:' + k); });
      GENRE_KEYS.forEach(function (k) { add(I.tIn(code, 'genre.' + k), 'g:' + k); });
      OWNED_PLATFORM_KEYS.forEach(function (k) { add(I.tIn(code, 'owned.' + k), 'o:' + k); });
    });
    PLATFORM_KEYS.forEach(function (k) { add(k, 'p:' + k); });
    GENRE_KEYS.forEach(function (k) { add(k, 'g:' + k); });
    OWNED_PLATFORM_KEYS.forEach(function (k) { add(k, 'o:' + k); });
    /* aliases comunes para matchear hardware del usuario con juegos */
    /* PC / Steam absorbe el "PC" historico; las variantes / Emulador son claves propias. */
    add('pc', 'p:pcSteam'); add('pc', 'o:pcSteam');
    add('pc / steam', 'p:pcSteam'); add('pc/steam', 'p:pcSteam');
    add('pc / emulator', 'p:pcEmulator'); add('pc emulator', 'p:pcEmulator');
    add('pc / emulador', 'p:pcEmulator'); add('pc emulador', 'p:pcEmulator');
    add('steam', 'p:pcSteam'); add('steam', 'o:pcSteam');
    add('pc/steam', 'p:pcSteam'); add('pc/steam', 'o:pcSteam');
    add('windows', 'p:pcSteam'); add('windows', 'o:pcSteam');
    /* Etiquetas exactas que devuelven P400 y el Infobox de Wikipedia. */
    add('microsoft windows', 'p:pcSteam'); add('microsoft windows', 'o:pcSteam');
    add('ms windows', 'p:pcSteam'); add('ms windows', 'o:pcSteam');
    /* Clientes de PC: alias cortos ademas de las etiquetas traducidas de cada idiom. */
    add('epic', 'p:pcEpic'); add('epic', 'o:pcEpic');
    add('epic games', 'p:pcEpic'); add('epic games', 'o:pcEpic');
    add('epic launcher', 'p:pcEpic'); add('epic games launcher', 'p:pcEpic');
    add('ea', 'p:pcEa'); add('ea', 'o:pcEa');
    add('ea app', 'p:pcEa'); add('ea app', 'o:pcEa');
    add('origin', 'p:pcEa'); add('origin', 'o:pcEa');
    add('battle.net', 'p:pcBattleNet'); add('battle.net', 'o:pcBattleNet');
    add('battlenet', 'p:pcBattleNet'); add('battle net', 'p:pcBattleNet');
    add('blizzard', 'p:pcBattleNet'); add('blizzard', 'o:pcBattleNet');
    add('ubisoft', 'p:pcUbisoft'); add('ubisoft', 'o:pcUbisoft');
    add('ubisoft connect', 'p:pcUbisoft'); add('uplay', 'p:pcUbisoft');
    add('gog', 'p:pcGog'); add('gog', 'o:pcGog');
    add('gog galaxy', 'p:pcGog'); add('good old games', 'p:pcGog');
    add('xbox app', 'p:pcXboxApp'); add('xbox app', 'o:pcXboxApp');
    add('xbox game pass', 'p:pcXboxApp'); add('pc game pass', 'p:pcXboxApp');
    add('game pass', 'p:pcXboxApp'); add('game pass', 'o:pcXboxApp');
    add('riot', 'p:pcRiot'); add('riot', 'o:pcRiot');
    add('riot client', 'p:pcRiot'); add('riot games', 'p:pcRiot');
    add('other launcher', 'o:pcOtherLauncher'); add('otro launcher', 'o:pcOtherLauncher');
    add('outro launcher', 'o:pcOtherLauncher'); add('autre lanceur', 'o:pcOtherLauncher');
    add('altro launcher', 'o:pcOtherLauncher'); add('anderer launcher', 'o:pcOtherLauncher');
    add('другой лаунчер', 'o:pcOtherLauncher'); add('その他のランチャー', 'o:pcOtherLauncher');
    add('steam deck', 'p:steamDeck'); add('steam deck', 'o:steamDeck'); add('deck', 'o:steamDeck');
    add('ps4 / emulator', 'p:ps4Emulator'); add('ps4 emulator', 'p:ps4Emulator');
    add('ps4 / emulador', 'p:ps4Emulator'); add('ps4 emulador', 'p:ps4Emulator');
    add('ps3 / emulator', 'p:ps3Emulator'); add('ps3 emulator', 'p:ps3Emulator');
    add('ps3 / emulador', 'p:ps3Emulator'); add('ps3 emulador', 'p:ps3Emulator');
    add('switch / emulator', 'p:switchEmulator'); add('switch emulator', 'p:switchEmulator');
    add('switch / emulador', 'p:switchEmulator'); add('switch emulador', 'p:switchEmulator');
    /* Consolas: la etiqueta completa de P400/Infobox y la corta de Mis Consolas
       apuntan a la MISMA clave, asi el cruce con ownedPlatforms es exacto. */
    add('playstation 5', 'p:ps5'); add('playstation 5', 'o:ps5');
    add('playstation 4', 'p:ps4'); add('playstation 4', 'o:ps4');
    add('playstation 3', 'p:ps3'); add('playstation 3', 'o:ps3');
    add('playstation 2', 'p:ps2'); add('playstation 2', 'o:ps2');
    add('playstation 1', 'p:ps1'); add('playstation 1', 'o:ps1'); add('playstation', 'o:ps1');
    add('ps one', 'o:ps1'); add('psx', 'o:ps1');
    add('playstation portable', 'o:psp'); add('ps portable', 'o:psp');
    add('playstation vita', 'o:psVita'); add('ps vita', 'o:psVita'); add('vita', 'o:psVita');
    add('xbox series x|s', 'o:xboxSeries'); add('xbox series', 'o:xboxSeries'); add('xbox', 'o:xboxSeries');
    add('xbox one', 'o:xboxOne'); add('xbox 360', 'o:xbox360');
    add('nintendo switch 2', 'o:switch2'); add('switch 2', 'o:switch2');
    add('nintendo switch', 'p:switch'); add('nintendo switch', 'o:switch');
    add('wii u', 'p:wiiU'); add('wii u', 'o:wiiU'); add('wii', 'p:wii'); add('wii', 'o:wii');
    add('gamecube', 'p:gamecube'); add('gamecube', 'o:gamecube');
    add('nintendo gamecube', 'p:gamecube'); add('nintendo gamecube', 'o:gamecube');
    add('nintendo 64', 'o:n64'); add('n64', 'o:n64');
    add('super nintendo', 'o:snes'); add('super nintendo entertainment system', 'o:snes');
    add('nintendo entertainment system', 'o:nes'); add('famicom', 'o:nes');
    add('nintendo 3ds', 'o:n3ds'); add('3ds', 'o:n3ds');
    add('nintendo ds', 'o:nds'); add('ds', 'o:nds');
    add('game boy advance', 'o:gba'); add('gameboy advance', 'o:gba');
    add('game boy color', 'o:gameboy'); add('gameboy color', 'o:gameboy'); add('game boy', 'o:gameboy');
    add('gameboy', 'o:gameboy'); add('gb', 'o:gameboy'); add('gbc', 'o:gameboy');
    add('sega genesis', 'o:genesis'); add('mega drive', 'o:genesis'); add('sega mega drive', 'o:genesis'); add('genesis', 'o:genesis');
    add('dreamcast', 'o:dreamcast'); add('sega dreamcast', 'o:dreamcast');
    add('emulador', 'o:retroEmulator'); add('emulator', 'o:retroEmulator');
    add('retro / emulator', 'o:retroEmulator'); add('retro / emulador', 'o:retroEmulator');
    add('movil', 'o:mobile'); add('móvil', 'o:mobile'); add('mobile', 'o:mobile'); add('android', 'o:mobile'); add('ios', 'o:mobile');
    /* Alias de los generos nuevos para el tooltip de portada, el datalist y el
       autocompletado: aceptan tanto la clave como el texto que devuelve el scraper. */
    add('survival', 'g:survival'); add('survival game', 'g:survival');
    add('sandbox', 'g:sandbox'); add('sandbox game', 'g:sandbox');
    add('open world', 'g:open_world'); add('open-world', 'g:open_world');
    add('metroidvania', 'g:metroidvania'); add('metroid vania', 'g:metroidvania');
    add('roguelike', 'g:roguelike'); add('roguelite', 'g:roguelike');
    add('rogue-like', 'g:roguelike'); add('rogue-lite', 'g:roguelike');
    add('soulslike', 'g:soulslike'); add('souls-like', 'g:soulslike');
    add('stealth', 'g:stealth'); add('stealth game', 'g:stealth');
    add('visual novel', 'g:visual_novel'); add('visual-novel', 'g:visual_novel');
    add('rhythm', 'g:rhythm'); add('rhythm game', 'g:rhythm'); add('music game', 'g:rhythm');
    add('mmo', 'g:mmo'); add('mmorpg', 'g:mmo'); add('massively multiplayer', 'g:mmo');
    /* Subgéneros híbridos: alias en inglés y español para el scraper, el datalist
       y los juegos importados que todavía guardaban el texto sin normalizar. */
    add('survival horror', 'g:survival_horror'); add('survival horror game', 'g:survival_horror');
    add('terror y supervivencia', 'g:survival_horror'); add('horror de supervivencia', 'g:survival_horror');
    add('action adventure', 'g:action_adventure'); add('action-adventure', 'g:action_adventure');
    add('action & adventure', 'g:action_adventure'); add('accion y aventura', 'g:action_adventure');
    add('acción y aventura', 'g:action_adventure');
    add('action rpg', 'g:action_rpg'); add('action role-playing game', 'g:action_rpg');
    add('action role playing game', 'g:action_rpg'); add('rpg de accion', 'g:action_rpg');
    add('rpg de acción', 'g:action_rpg');
    add('tactical rpg', 'g:tactical_rpg'); add('strategy rpg', 'g:tactical_rpg');
    add('tactical role-playing game', 'g:tactical_rpg'); add('strategy role-playing game', 'g:tactical_rpg');
    add('rpg tactico', 'g:tactical_rpg'); add('rpg táctico', 'g:tactical_rpg');
    add('rol táctico', 'g:tactical_rpg');
    add('puzzle platformer', 'g:puzzle_platformer'); add('puzzle-platformer', 'g:puzzle_platformer');
    add('puzzle plataformas', 'g:puzzle_platformer'); add('puzzle-plataformas', 'g:puzzle_platformer');
    return map;
  }
  function keyOf(kind, value) {
    var raw = String(value || '').trim();
    if (!raw) return '';
    if (!aliasCache) aliasCache = buildAliases();
    var list = kind === 'p' ? PLATFORM_KEYS : kind === 'g' ? GENRE_KEYS : OWNED_PLATFORM_KEYS;
    var candidates = aliasCache[raw.toLowerCase()] || [];
    var i, k;
    /* Un mismo texto puede ser valido como plataforma y como consola (p. ej. "PS5"). */
    for (i = 0; i < candidates.length; i++) {
      if (candidates[i].indexOf(kind + ':') === 0) return candidates[i].slice(2);
    }
    for (i = 0; i < candidates.length; i++) {
      k = candidates[i].slice(2);
      if (list.indexOf(k) !== -1) return k;
    }
    return raw;
  }
  function displayValue(kind, value) {
    var key = keyOf(kind, value);
    var list = kind === 'p' ? PLATFORM_KEYS : kind === 'g' ? GENRE_KEYS : OWNED_PLATFORM_KEYS;
    if (list.indexOf(key) === -1) return String(value || '');
    var prefix = kind === 'p' ? 'platform.' : kind === 'g' ? 'genre.' : 'owned.';
    var label = t(prefix + key);
    /* "Mis Consolas" es la fuente de verdad: las plataformas compartidas deben
       mostrar exactamente la misma etiqueta. Si falta en platform.* se reutiliza
       owned.* para no dejar nunca una clave sin traducir. */
    if (label === prefix + key && kind === 'p' && OWNED_PLATFORM_KEYS.indexOf(key) !== -1) {
      var owned = t('owned.' + key);
      if (owned !== 'owned.' + key) return owned;
    }
    return label;
  }

  /* Un híbrido absorbe siempre a sus componentes: no queremos
     "Survival Horror · Supervivencia · Terror" en la misma ficha. */
  var HYBRID_COMPONENTS = {
    survival_horror: ['survival', 'horror'],
    action_adventure: ['action', 'adventure'],
    action_rpg: ['action', 'rpg'],
    tactical_rpg: ['rpg', 'strategy'],
    puzzle_platformer: ['puzzle', 'platformer']
  };
  function compactGenres(list) {
    var out = [];
    (list || []).forEach(function (v) {
      var k = keyOf('g', v);
      if (k && out.indexOf(k) === -1) out.push(k);
    });
    /* Un juego importado que ya traía survival + horror también se compacta. */
    var inferred = [];
    Object.keys(HYBRID_COMPONENTS).forEach(function (hybrid) {
      var parts = HYBRID_COMPONENTS[hybrid];
      if (out.indexOf(hybrid) !== -1) return;
      var complete = parts.every(function (part) { return out.indexOf(part) !== -1; });
      if (complete) inferred.push(hybrid);
    });
    inferred.forEach(function (hybrid) { out.push(hybrid); });
    Object.keys(HYBRID_COMPONENTS).forEach(function (hybrid) {
      if (out.indexOf(hybrid) === -1) return;
      HYBRID_COMPONENTS[hybrid].forEach(function (part) {
        var i = out.indexOf(part);
        if (i !== -1) out.splice(i, 1);
      });
    });
    /* Una sola clave = un solo chip, aunque dos fuentes hayan traído el mismo
       híbrido (p. ej. "Terror y supervivencia" desde ES y desde P136). */
    return out.filter(function (k, i) { return !!k && out.indexOf(k) === i; });
  }

  /* Un juego puede tener varios generos; los juegos antiguos solo tenian genre. */
  function genresOf(g) {
    if (!g) return [];
    var raw = Array.isArray(g.genres) ? g.genres : (g.genre ? [g.genre] : []);
    return compactGenres(raw.map(function (v) { return keyOf('g', v); }));
  }
  function primaryGenre(g) { return genresOf(g)[0] || ''; }
  function genreTagsHtml(g, emptyText) {
    var list = genresOf(g);
    if (!list.length) return '<span class="g">' + esc(emptyText || t('card.noGenre')) + '</span>';
    return '<span class="g" title="' + esc(list.map(function (k) { return displayValue('g', k); }).join(' · ')) + '">' +
      list.map(function (k, i) {
        return (i ? '<span class="gsep">·</span>' : '') + '<span class="gtag">' + esc(displayValue('g', k)) + '</span>';
      }).join('') + '</span>';
  }

  /* ---------- Mis consolas / dispositivos disponibles ---------- */
  var RETRO_OWNED_KEYS = ['retroEmulator', 'ps2', 'ps1', 'psp', 'n64', 'snes', 'nes',
    'gba', 'gameboy', 'genesis', 'dreamcast', 'gamecube', 'wii'];
  /* Que hardware sirve para cada plataforma de juego (retrocompatibilidad incluida).
     Las variantes "/ Emulador" cuentan como maquina valida para su consola base. */
  var PLATFORM_TO_OWNED = {
    steamDeck: ['steamDeck', 'pcSteam', 'pcEmulator'],
    mobile: ['mobile'],
    ps5: ['ps5'],
    ps4: ['ps4', 'ps4Emulator'],
    ps4Emulator: ['ps4Emulator', 'ps4'],
    ps3: ['ps3', 'ps3Emulator'],
    ps3Emulator: ['ps3Emulator', 'ps3'],
    ps2: ['ps2', 'retroEmulator'],
    ps1: ['ps1', 'retroEmulator'],
    psp: ['psp', 'retroEmulator'],
    psVita: ['psVita'],
    switch2: ['switch2', 'switchEmulator'],
    switch: ['switch', 'switch2', 'switchEmulator'],
    switchEmulator: ['switchEmulator', 'switch', 'switch2'],
    wiiU: ['wiiU', 'retroEmulator'],
    wii: ['wii', 'wiiU', 'retroEmulator'],
    gamecube: ['gamecube', 'wii', 'retroEmulator'],
    n64: ['n64', 'retroEmulator'],
    snes: ['snes', 'retroEmulator'],
    nes: ['nes', 'retroEmulator'],
    n3ds: ['n3ds'],
    nds: ['nds', 'n3ds'],
    gba: ['gba', 'retroEmulator'],
    gameboy: ['gameboy', 'retroEmulator'],
    xboxSeries: ['xboxSeries'],
    xboxOne: ['xboxOne', 'xboxSeries'],
    xbox360: ['xbox360'],
    genesis: ['genesis', 'retroEmulator'],
    dreamcast: ['dreamcast', 'retroEmulator'],
    emulator: ['retroEmulator', 'pcEmulator', 'ps4Emulator', 'ps3Emulator', 'switchEmulator',
      'ps2', 'ps1', 'psp', 'n64', 'snes', 'nes', 'gba', 'gameboy', 'genesis', 'dreamcast'],
    retro: RETRO_OWNED_KEYS,
    xbox: ['xboxSeries']
  };
  /* Cada cliente de PC es una maquina distinta: detectar "EA App" no habilita
     los demas launchers. Steam Deck se anade aparte en platformKeysMatchingOwned. */
  PC_RUNTIME_KEYS.concat(['pc']).forEach(function (k) {
    PLATFORM_TO_OWNED[k] = [k === 'pc' ? 'pcSteam' : k];
  });
  /* Si el usuario posee una variante "/ Emulador", también puede elegir la
     consola base (y la categoría retro/genérica); y al revés, al marcar una
     consola retro se le ofrece "Retro / Emulador". */
  var OWNED_TO_PLATFORM_EXTRA = {
    pcEmulator: ['emulator'],
    retroEmulator: ['retro'],
    ps4Emulator: ['ps4'],
    ps3Emulator: ['ps3'],
    switchEmulator: ['switch', 'switch2'],
    switch2: ['switch']
  };
  /* Consolas base que un emulador marcado puede ejecutar sin estar marcadas
     fisicamente. El resto de extras (emulator/retro) exige estar en Mis Consolas. */
  var EMULATOR_BASE_EXTRAS = ['ps4', 'ps3', 'switch', 'switch2'];
  function addPlatformOption(list, key) {
    if (!key || PLATFORM_KEYS.indexOf(key) === -1 || list.indexOf(key) !== -1) return;
    list.push(key);
  }
  /* Opciones del datalist al abrir el editor: solo el hardware del usuario. */
  function platformOptionsForOwned() {
    if (!ownedConfigured()) return PLATFORM_KEYS.slice();
    var owned = effectiveOwnedKeys();
    if (!owned.length) return PLATFORM_KEYS.slice();
    var out = [];
    owned.forEach(function (k) {
      addPlatformOption(out, k);
      (OWNED_TO_PLATFORM_EXTRA[k] || []).forEach(function (extra) { addPlatformOption(out, extra); });
    });
    return out;
  }
  /* Cruce inverso: de las plataformas del juego a las que puede ejecutar el
     usuario. Primero el hardware marcado en "Mis Consolas" para que la primera
     coincidencia autoseleccionada sea realmente una máquina que posee. */
  function platformKeysMatchingOwned(candidates, owned) {
    var out = [];
    function add(k) {
      if (PLATFORM_KEYS.indexOf(k) === -1) return;
      if (out.indexOf(k) === -1) out.push(k);
    }
    (candidates || []).forEach(function (key) {
      var capable = PLATFORM_TO_OWNED[key] || [key];
      /* Un lanzamiento generico en PC solo habilita los clientes abiertos (y
         Steam Deck), nunca EA/Battle.net/Ubisoft/Xbox/Riot marcados por el
         usuario: esos no acreditan que el juego saliera en esa tienda. */
      if (key === 'pcSteam') capable = PC_OPEN_LAUNCHER_KEYS.concat(['pcEmulator', 'steamDeck']);
      /* Un launcher detectado explicitamente solo habilita ese cliente (y Steam
         Deck, que ejecuta el mismo catalogo), nunca todos los marcados. */
      else if (PC_LAUNCHER_KEYS.indexOf(key) !== -1) capable = [key, 'steamDeck'];
      var hits = capable.filter(function (k) { return owned.indexOf(k) !== -1; });
      if (!hits.length) return;
      /* Solo el hardware realmente marcado (y sus equivalentes). Añadir la
         plataforma detectada tal cual colaría "PS4 / Emulador" o todos los
         launchers de PC cuando el usuario no los tiene marcados. */
      hits.forEach(function (k) {
        add(k);
        /* Solo equivalentes marcados por el usuario o la consola base de un
           emulador que si posee: nunca "Emulator"/"Retro" genericos. */
        (OWNED_TO_PLATFORM_EXTRA[k] || []).forEach(function (extra) {
          if (owned.indexOf(extra) !== -1 || EMULATOR_BASE_EXTRAS.indexOf(extra) !== -1) add(extra);
        });
      });
      /* Un emulador retro también habilita la consola física del juego. */
      if (hits.indexOf('retroEmulator') !== -1 && RETRO_OWNED_KEYS.indexOf(key) !== -1) add(key);
    });
    return out;
  }
  function ownedConfigured() { return Array.isArray(ownedPlatforms); }
  function effectiveOwnedKeys() {
    if (!ownedConfigured()) return OWNED_PLATFORM_KEYS.slice();
    var out = [];
    ownedPlatforms.map(function (v) { return keyOf('o', v); }).forEach(function (k) {
      if (OWNED_PLATFORM_KEYS.indexOf(k) !== -1 && out.indexOf(k) === -1) out.push(k);
    });
    return out;
  }
  function gameMatchesOwned(g) {
    if (!ownedConfigured()) return true;
    var owned = effectiveOwnedKeys();
    if (!owned.length) return false;
    var pk = keyOf('p', g.platform);
    var capable = PLATFORM_TO_OWNED[pk];
    if (!capable) {
      /* Plataforma personalizada: intenta matchear por alias de consola. */
      var ok = keyOf('o', g.platform);
      if (ok && OWNED_PLATFORM_KEYS.indexOf(ok) !== -1) capable = [ok];
      else if (/pc|steam|windows|epic|ea app|battle\.net|battlenet|blizzard|ubisoft|gog|game pass|riot|launcher/i.test(String(g.platform || ''))) capable = PC_RUNTIME_KEYS;
      else return false;
    }
    return capable.some(function (k) { return owned.indexOf(k) !== -1; });
  }
  function ownedLabelList(keys) {
    return (keys || []).map(function (k) { return displayValue('o', k); });
  }
  function renderOwnedBadge(keysOverride, configuredOverride) {
    var badge = $('owned-badge');
    if (!badge) return;
    var configured = configuredOverride === undefined ? ownedConfigured() : !!configuredOverride;
    var keys = keysOverride || effectiveOwnedKeys();
    badge.textContent = String(keys.length);
    badge.title = configured ? ownedLabelList(keys).join(', ') : t('owned.allAssumed');
    var btn = $('btn-owned');
    if (btn) btn.classList.toggle('configured', configured);
  }
  function renderOwnedChips() {
    var box = $('ow-chips');
    if (!box) return;
    var keys = effectiveOwnedKeys();
    box.innerHTML = CONSOLE_GROUPS.map(function (group) {
      var chips = group.keys.map(function (k) {
        var on = keys.indexOf(k) !== -1;
        return '<button class="genre-chip" type="button" data-owned-toggle="' + esc(k) + '" aria-pressed="' + on + '">' + esc(displayValue('o', k)) + '</button>';
      }).join('');
      return '<div class="owned-group" role="group" aria-label="' + esc(t(group.label)) + '">' +
        '<h4 class="owned-group-title">' + esc(t(group.label)) + '</h4>' +
        '<div class="owned-group-chips">' + chips + '</div></div>';
    }).join('');
    var msg = $('ow-msg');
    if (msg) msg.textContent = keys.length ? t('owned.selected', { n: keys.length }) : t('owned.noneSelected');
  }
  /* La seleccion se guarda en el momento: ya no hay modal con boton Guardar. */
  function saveOwnedKeys(keys) {
    var clean = OWNED_PLATFORM_KEYS.filter(function (k) { return keys.indexOf(k) !== -1; });
    /* Dejar todas marcadas equivale a no configurar nada (se asumen todas). */
    ownedPlatforms = (clean.length && clean.length < OWNED_PLATFORM_KEYS.length) ? clean : null;
    try { if (STORAGE.saveOwnedPlatforms) STORAGE.saveOwnedPlatforms(ownedPlatforms); } catch (e) {}
    renderAll();
  }
  function toggleOwnedKey(k) {
    var keys = effectiveOwnedKeys();
    var i = keys.indexOf(k);
    if (i === -1) keys.push(k); else keys.splice(i, 1);
    saveOwnedKeys(keys);
  }
  function selectAllOwned() { saveOwnedKeys(OWNED_PLATFORM_KEYS.slice()); }

  /* ---------- vistas principales ---------- */
  function setView(view) {
    currentView = view === 'consoles' ? 'consoles' : 'collection';
    ['collection', 'consoles'].forEach(function (name) {
      var panel = $('view-' + name);
      if (panel) panel.hidden = name !== currentView;
    });
    var tabs = $('view-tabs');
    if (tabs) {
      Array.prototype.forEach.call(tabs.querySelectorAll('[data-view]'), function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-view') === currentView));
      });
    }
    try { localStorage.setItem(VIEW_KEY, currentView); } catch (e) {}
  }
  function initView() {
    var saved = null;
    try { saved = localStorage.getItem(VIEW_KEY); } catch (e) {}
    setView(saved === 'consoles' ? 'consoles' : 'collection');
  }

  /* ---------- almacenamiento ---------- */
  function save() {
    if (!STORAGE || typeof STORAGE.save !== 'function') { storageOk = false; return false; }
    storageOk = STORAGE.save(state.games);
    return storageOk;
  }
  function load() {
    if (!STORAGE || typeof STORAGE.load !== 'function') throw new Error('storage no disponible');
    var res = STORAGE.load();
    state.games = res && Array.isArray(res.games) ? res.games : [];
    storageOk = !!(res && res.storageOk);
    try { ownedPlatforms = STORAGE.loadOwnedPlatforms ? STORAGE.loadOwnedPlatforms() : null; }
    catch (e) { ownedPlatforms = null; }
  }

  /* ---------- portadas y metadatos: Wikipedia / Wikidata (CORS con origin=*) ---------- */
  var coverCache = {};
  var WIKI_LANGS = ['en', 'es', 'pt', 'fr', 'it', 'de', 'ru', 'ja'];
  var WD_API = 'https://www.wikidata.org/w/api.php';
  function wikiLang(code) { return WIKI_LANGS.indexOf(code) !== -1 ? code : 'en'; }
  function wikiApi(lang) { return 'https://' + wikiLang(lang) + '.wikipedia.org/w/api.php'; }
  function coverKey(title) { return String(title || '').trim().toLowerCase(); }

  /* Toda peticion a MediaWiki lleva format=json y origin=* (obligatorio para CORS). */
  function wikiSearchUrl(lang, search) {
    var q = encodeURIComponent(String(search || '').trim()).replace(/%20/g, '+');
    /* Sin pilicense=any MediaWiki oculta las caratulas fair use (casi todos los videojuegos). */
    return wikiApi(lang) +
      '?action=query' +
      '&generator=search' +
      '&gsrsearch=' + q +
      '&gsrlimit=3' +
      '&prop=pageimages' +
      '&piprop=thumbnail' +
      '&pithumbsize=500' +
      '&pilicense=any' +
      '&format=json' +
      '&origin=*';
  }

  /* Timeout de seguridad, NUNCA por debajo de 8s: una consulta lenta de
     Wikidata (P577/P178/P136/P400) no debe cortarse a mitad del primer clic. */
  function fetchJson(url, timeout) {
    var ms = Math.max(8000, Number(timeout) || 15000);
    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, ms) : null;
    var init = ctl ? { signal: ctl.signal } : undefined;
    function done() { if (timer) clearTimeout(timer); }
    return fetch(url, init).then(function (r) {
      done();
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).catch(function (e) { done(); throw e; });
  }
  /* Todas las fuentes del autocompletado usan el mismo margen amplio. */
  function fetchMetaJson(url) { return fetchJson(url, 20000); }

  function normTitle(s) {
    return String(s || '').toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .replace(/\s+/g, ' ').trim();
  }
  function titleBase(s) { return normTitle(String(s || '').replace(/\([^)]*\)/g, ' ')); }
  function hasQualifier(s) { return /\([^)]*\)/.test(String(s || '')); }

  /* Prioriza la pagina que realmente corresponde al juego, no solo la primera con imagen. */
  function titleScore(pageTitle, wanted) {
    var p = titleBase(pageTitle), w = titleBase(wanted);
    if (!p || !w) return 0;
    if (p === w) return hasQualifier(pageTitle) ? 3 : 4;
    if (p.indexOf(w + ' ') === 0 || w.indexOf(p + ' ') === 0) return 2;
    var pw = p.split(' '), ww = w.split(' '), common = 0;
    ww.forEach(function (word) { if (pw.indexOf(word) !== -1) common++; });
    return common / Math.max(pw.length, ww.length) >= 0.6 ? 1 : 0;
  }

  /* MediaWiki devuelve un mapa de paginas: elegimos la que mejor coincide con el titulo. */
  function pickBestPage(data, wanted, requireThumb) {
    var pages = data && data.query && data.query.pages ? data.query.pages : null;
    if (!pages) return null;
    var list = Object.keys(pages).map(function (k) { return pages[k]; }).filter(function (p) {
      if (!p || !p.title || p.missing !== undefined) return false;
      if (requireThumb && !(p.thumbnail && p.thumbnail.source)) return false;
      return true;
    });
    if (!list.length) return null;
    list.sort(function (a, b) {
      var sa = titleScore(a.title, wanted), sb = titleScore(b.title, wanted);
      if (sa !== sb) return sb - sa;
      var ca = (a.thumbnail ? 1 : 0) + (a.extract ? 1 : 0) + (a.pageprops ? 1 : 0);
      var cb = (b.thumbnail ? 1 : 0) + (b.extract ? 1 : 0) + (b.pageprops ? 1 : 0);
      if (ca !== cb) return cb - ca;
      return (a.index || 0) - (b.index || 0);
    });
    return list[0];
  }
  function firstThumbnail(data, wanted) {
    var p = pickBestPage(data, wanted, true);
    return p && p.thumbnail && p.thumbnail.source ? p.thumbnail.source : '';
  }

  function wikiSearch(lang, search, wanted) {
    return fetchJson(wikiSearchUrl(lang, search)).then(function (data) {
      return firstThumbnail(data, wanted);
    });
  }

  function fetchCoverRaw(title) {
    var key = coverKey(title);
    if (!key) return Promise.resolve('');
    if (coverCache[key]) return Promise.resolve(coverCache[key]);
    var clean = String(title).trim();

    /* Cascada: 1) EN "titulo video game"  2) EN "titulo"  3) ES "titulo video game". */
    var attempts = [
      { lang: 'en', search: clean + ' video game' },
      { lang: 'en', search: clean },
      { lang: 'es', search: clean + ' video game' }
    ];

    function tryNext(i) {
      if (i >= attempts.length) {
        coverCache[key] = '';
        return Promise.resolve('');
      }
      var attempt = attempts[i];
      return wikiSearch(attempt.lang, attempt.search, clean).then(function (src) {
        if (src) { coverCache[key] = src; return src; }
        return tryNext(i + 1);
      }).catch(function () {
        return tryNext(i + 1);
      });
    }

    return tryNext(0);
  }
  function fetchCover(title) { return fetchCoverRaw(title).catch(function () { return ''; }); }
  function resolveGameCover(game, force) {
    if (!game || !game.title) return Promise.resolve('');
    if (game.cover && !force) return Promise.resolve(game.cover);
    return fetchCover(game.title).then(function (src) {
      if (!src) return '';
      var current = state.games.filter(function (g) { return g.id === game.id; })[0];
      if (!current) return '';
      if (current.cover && !force) return current.cover;
      if (coverKey(current.title) !== coverKey(game.title)) return current.cover || '';
      current.cover = src; current.coverSource = 'wiki'; save(); renderAll(); return src;
    });
  }
  function autoResolveMissingCovers() {
    if (!navigator.onLine) return;
    var missing = state.games.filter(function (g) { return !g.cover && g.title; }).slice(0, 12);
    if (!missing.length) return;
    missing.reduce(function (p, g) { return p.then(function () { return resolveGameCover(g, false); }); }, Promise.resolve());
  }
  function compressImageFile(file, cb) {
    var reader = new FileReader();
    reader.onerror = function () { cb(''); };
    reader.onload = function () {
      var img = new Image();
      img.onerror = function () { cb(''); };
      img.onload = function () {
        var maxW = 600, maxH = 800, w = img.width, h = img.height;
        var ratio = Math.min(maxW / w, maxH / h, 1), cw = Math.round(w * ratio), ch = Math.round(h * ratio);
        var c = document.createElement('canvas'); c.width = cw; c.height = ch;
        var ctx = c.getContext('2d'); ctx.fillStyle = '#111'; ctx.fillRect(0, 0, cw, ch); ctx.drawImage(img, 0, 0, cw, ch);
        var out = ''; try { out = c.toDataURL('image/jpeg', 0.82); } catch (e) { out = ''; } cb(out);
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  }

  /* ---------- scraper de metadatos: Wikipedia + Wikidata, sin API key ---------- */

  function encodeQ(s) { return encodeURIComponent(String(s || '').trim()).replace(/%20/g, '+'); }

  /* Busqueda en Wikipedia EN: extracto, TODAS las categorias, seccion 0 del
     Infobox video game (campo "| genre = ..."), portada y entity-id de Wikidata. */
  function wikiMetadataUrl(title, suffix) {
    var search = String(title).trim() + (suffix === undefined ? ' video game' : (suffix || ''));
    return wikiApi('en') +
      '?action=query' +
      '&generator=search' +
      '&gsrsearch=' + encodeQ(search) +
      '&gsrlimit=3' +
      '&prop=extracts|categories|revisions|pageimages|pageprops' +
      '&exintro=1' +
      '&explaintext=1' +
      '&exsentences=3' +
      '&cllimit=max' +
      '&rvprop=content' +
      '&rvslots=main' +
      '&rvsection=0' +
      '&piprop=thumbnail' +
      '&pithumbsize=500' +
      '&pilicense=any' +
      '&format=json' +
      '&origin=*';
  }
  function wikiExtractUrl(lang, title) {
    return wikiApi(lang) +
      '?action=query' +
      '&titles=' + encodeQ(title) +
      '&prop=extracts' +
      '&exintro=1' +
      '&explaintext=1' +
      '&exsentences=2' +
      '&format=json' +
      '&origin=*';
  }
  function wikiExtractSearchUrl(lang, title) {
    return wikiApi(lang) +
      '?action=query' +
      '&generator=search' +
      '&gsrsearch=' + encodeQ(title) +
      '&gsrlimit=2' +
      '&prop=extracts' +
      '&exintro=1' +
      '&explaintext=1' +
      '&exsentences=2' +
      '&format=json' +
      '&origin=*';
  }
  function wikidataUrl(id, lang, full) {
    var code = wikiLang(lang);
    return WD_API +
      '?action=wbgetentities' +
      '&ids=' + encodeURIComponent(id) +
      '&props=' + (full ? 'claims|labels|descriptions|sitelinks' : 'labels') +
      '&languages=' + (code === 'en' ? 'en' : code + '|en') +
      '&format=json' +
      '&origin=*';
  }
  function wikidataClaimIds(claims, prop, includeDeprecated) {
    var arr = claims && claims[prop];
    if (!arr || !arr.length) return [];
    var ids = [];
    /* P136 se lee completo (incluye todos los elementos del array); P400 solo
       usa claims vigentes para no arrastrar plataformas obsoletas. */
    arr.forEach(function (c) {
      if (!c || (!includeDeprecated && c.rank === 'deprecated')) return;
      var v = c.mainsnak && c.mainsnak.datavalue && c.mainsnak.datavalue.value;
      if (v && v.id && /^Q\d+$/.test(v.id) && ids.indexOf(v.id) === -1) ids.push(v.id);
    });
    return ids;
  }

  /* Etiquetas de TODOS los QIDs de P136 / P178 / P400 en una sola tanda:
     primero el idioma activo y después inglés como reserva. */
  function wikidataLabelsUrl(ids, lang) {
    var code = wikiLang(lang);
    return WD_API +
      '?action=wbgetentities' +
      '&ids=' + encodeURIComponent((ids || []).join('|')) +
      '&props=labels' +
      '&languages=' + (code === 'en' ? 'en' : code + '|en') +
      '&format=json' +
      '&origin=*';
  }
  function fetchWikidataLabels(ids, lang) {
    var chunks = [], i;
    for (i = 0; i < (ids || []).length; i += 50) chunks.push(ids.slice(i, i + 50));
    if (!chunks.length) return Promise.resolve({});
    return Promise.allSettled(chunks.map(function (chunk) {
      return fetchMetaJson(wikidataLabelsUrl(chunk, lang)).then(function (payload) {
        var entities = (payload && payload.entities) || {}, map = {};
        chunk.forEach(function (id) {
          var labels = entities[id] && entities[id].labels;
          var local = labels && labels[wikiLang(lang)] && labels[wikiLang(lang)].value;
          var en = labels && labels.en && labels.en.value;
          if (local || en) map[id] = { preferred: String(local || en), en: String(en || local || '') };
        });
        return map;
      });
    })).then(function (results) {
      var out = {};
      results.forEach(function (res) {
        if (res.status !== 'fulfilled') return;
        Object.keys(res.value).forEach(function (id) { out[id] = res.value[id]; });
      });
      return out;
    });
  }
  function labelFromMap(map, id) {
    var v = map && id && map[id];
    return (v && (v.preferred || v.en)) || '';
  }
  /* Artículo en el idioma activo: sección 0 + extracto para reforzar la detección
     de géneros y la sinopsis sin esperar a la rama de Wikidata. */
  function wikiLocalSectionUrl(lang, title) {
    return wikiApi(lang) +
      '?action=query' +
      '&generator=search' +
      '&gsrsearch=' + encodeQ(String(title).trim()) +
      '&gsrlimit=2' +
      '&prop=extracts|revisions' +
      '&exintro=1' +
      '&explaintext=1' +
      '&exsentences=3' +
      '&rvprop=content' +
      '&rvslots=main' +
      '&rvsection=0' +
      '&redirects=1' +
      '&format=json' +
      '&origin=*';
  }
  /* Una sola peticion local aporta genero y, ademas, el texto de tienda del
     Infobox/Categorias para confirmar que launcher de PC usa realmente el juego. */
  function fetchLocalWikiInfo(title, lang) {
    var code = wikiLang(lang || 'en');
    var empty = { genre: '', platform: '', store: '' };
    if (!String(title || '').trim() || code === 'en') return Promise.resolve(empty);
    return fetchMetaJson(wikiLocalSectionUrl(code, title)).then(function (data) {
      var page = pickBestPage(data, title, false);
      if (!page) return empty;
      var content = pageSectionContent(page);
      var localGenre = extractInfoboxParam(content, ['genre', 'genero', 'género']);
      var localPlatform = extractInfoboxParam(content, ['platform', 'platforms', 'plataforma', 'plataformas']);
      var localStore = extractInfoboxParam(content, ['publisher', 'publishers', 'distributor',
        'distributors', 'developer', 'desarrollador', 'distribuidora', 'editorial', 'editor']);
      return {
        genre: stripWikiMarkup([page.extract || '', localGenre].join(' · ')),
        platform: stripWikiMarkup(localPlatform),
        store: stripWikiMarkup([page.extract || '', localStore].join(' · '))
      };
    }).catch(function () { return empty; });
  }
  function fetchLocalSummary(title, lang) {
    var code = wikiLang(lang || 'en');
    if (code === 'en' || !String(title || '').trim()) return Promise.resolve('');
    return fetchMetaJson(wikiExtractSearchUrl(code, title)).then(function (data) {
      return cleanSummary(firstExtract(data, title), 2);
    }).catch(function () { return ''; });
  }

  /* El contenido de rvsection=0 puede venir en slots.main (MediaWiki actual) o
     en revisions[0]['*'] (formatos antiguos). */
  function pageSectionContent(page) {
    var rev = page && page.revisions && page.revisions[0];
    if (!rev) return '';
    if (rev.slots && rev.slots.main) return String(rev.slots.main['*'] || rev.slots.main.content || '');
    return String(rev['*'] || rev.content || '');
  }
  function stripWikiMarkup(value) {
    var s = String(value || '');
    for (var pass = 0; pass < 3; pass++) {
      s = s.replace(/<ref[^>]*\/>|<ref[^>]*>[\s\S]*?<\/ref>/gi, ' ')
        .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1')
        .replace(/\{\{\s*(?:nowrap|small|nbsp|nolink)\s*\|([^{}]*)\}\}/gi, '$1')
        .replace(/\{\{[^{}]*\}\}/g, ' ')
        .replace(/\[https?:\/\/[^\s\]]+\s+([^\]]*)\]/g, '$1');
    }
    return s.replace(/'''?/g, '').replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ').replace(/[\r\n]+/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }
  function infoboxBody(content) {
    var s = String(content || '');
    var m = /\{\{\s*(?:Infobox\s+video\s+game|Infobox\s+VG)\b/i.exec(s);
    if (!m) return s;
    var start = m.index + m[0].length, depth = 0, i;
    for (i = start; i < s.length - 1; i++) {
      var a = s.charAt(i), b = s.charAt(i + 1);
      if (a === '{' && b === '{') { depth++; i++; }
      else if (a === '}' && b === '}') {
        if (depth === 0) return s.slice(start, i);
        depth--; i++;
      }
    }
    return s.slice(start);
  }
  function deaccent(s) {
    return String(s || '').toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
  /* Lee el parámetro exacto del Infobox (en: "genre", es: "género"/"genero").
     Los `|` de nivel superior se separan en líneas para soportar infoboxes
     escritos en una sola línea sin confundir los `|` de plantillas anidadas. */
  function extractInfoboxParam(content, names) {
    var body = infoboxBody(content), normalized = '', depth = 0, i;
    for (i = 0; i < body.length; i++) {
      var pair = body.substr(i, 2);
      if (pair === '{{') { depth++; normalized += pair; i++; }
      else if (pair === '}}') { depth = Math.max(0, depth - 1); normalized += pair; i++; }
      else if (body.charAt(i) === '|' && depth === 0) normalized += '\n|';
      else normalized += body.charAt(i);
    }
    var lines = normalized.split(/\r?\n/);
    var wanted = (names || []).map(function (n) { return deaccent(n); });
    for (var i = 0; i < lines.length; i++) {
      var m = /^\s*\|\s*([^=|]+?)\s*=\s*([\s\S]*)$/.exec(lines[i]);
      if (!m) continue;
      var name = deaccent(stripWikiMarkup(m[1])).replace(/\s+/g, '');
      if (wanted.indexOf(name) === -1) continue;
      var value = m[2], j = i + 1;
      while (j < lines.length && !/^\s*(?:\||\}\})/.test(lines[j])) {
        value += ' ' + lines[j].trim(); j++;
      }
      return stripWikiMarkup(value);
    }
    return '';
  }
  function categoriesText(categories) {
    return (categories || []).map(function (c) {
      var s = typeof c === 'string' ? c : ((c && c.title) || '');
      return String(s).replace(/^(?:Category|Categoría):/i, '').replace(/_/g, ' ');
    }).join(' · ');
  }

  function firstExtract(data, wanted) {
    var pages = data && data.query && data.query.pages ? data.query.pages : null;
    if (!pages) return '';
    var list = Object.keys(pages).map(function (k) { return pages[k]; }).filter(function (p) {
      return p && p.missing === undefined && typeof p.extract === 'string' && p.extract.trim();
    });
    if (!list.length) return '';
    list.sort(function (a, b) {
      var sa = titleScore(a.title, wanted || ''), sb = titleScore(b.title, wanted || '');
      if (sa !== sb) return sb - sa;
      return (a.index || 0) - (b.index || 0);
    });
    return list[0].extract;
  }

  /* Recorta el extracto a 1-2 frases limpias sin romper abreviaturas habituales. */
  function cleanSummary(text, maxSentences) {
    var s = String(text || '').replace(/\s+/g, ' ').trim();
    if (!s) return '';
    var chunks = s.match(/[^.!?]+(?:[.!?]+|$)/g) || [s];
    var parts = [], i = 0;
    while (i < chunks.length && parts.length < (maxSentences || 2)) {
      var piece = chunks[i].trim();
      if (!piece) { i++; continue; }
      if (/\b(?:Dr|Mr|Mrs|Ms|St|Prof|Sr|Sra|etc|e\.g|i\.e)\.$/i.test(piece) && i + 1 < chunks.length) {
        piece += ' ' + chunks[++i].trim();
      }
      parts.push(piece);
      i++;
    }
    return parts.join(' ').slice(0, 300).trim();
  }

  /* PRIORIDAD 1: los subgéneros híbridos se detectan ANTES y se enmascaran en el
     texto. Así "survival horror" no añade también survival + horror, pero un
     "third-person shooter" o una "action" mención independiente sí se conserva. */
  var HYBRID_HINTS = [
    { key: 'survival_horror', re: /\bsurvival[\s-]+horror\b|\bterror[\s-]+y[\s-]+supervivencia\b|\bsupervivencia[\s-]+y[\s-]+terror\b|\bhorror[\s-]+de[\s-]+supervivencia\b/gi },
    { key: 'action_adventure', re: /\baction[\s-]*(?:&|and|y)?[\s-]*adventure\b|\badventure[\s-]*(?:&|and|y)?[\s-]*action\b|\bacci[oó]n[\s-]+y[\s-]+aventura\b|\baventura[\s-]+y[\s-]+acci[oó]n\b/gi },
    { key: 'action_rpg', re: /\baction[\s-]+(?:role[\s-]*playing|rpg)\b|\b(?:role[\s-]*playing|rpg)[\s-]+action\b|\brpg[\s-]+de[\s-]+acci[oó]n\b|\bacci[oó]n[\s-]+rpg\b/gi },
    { key: 'tactical_rpg', re: /\b(?:tactical|strategy)[\s-]+(?:role[\s-]*playing|rpg)\b|\b(?:role[\s-]*playing|rpg)[\s-]+(?:tactical|strategy)\b|\brol[\s-]+t[aá]ctico\b|\brpg[\s-]+t[aá]ctico\b/gi },
    { key: 'puzzle_platformer', re: /\bpuzzle[\s-]+platform(?:er|ers|ing)?\b|\bplatform[\s-]+puzzle\b|\bpuzzle[\s-]+plataformas\b|\bplataformas[\s-]+de[\s-]+puzzle\b/gi }
  ];

  /* Generos complementarios en ingles y español. Se aplican al texto ya sin
     híbridos para capturar también Shooter y Accion en un Survival Horror. */
  var GENRE_HINTS = [
    { key: 'survival', re: /survival (?:video )?games?|supervivencia/i },
    { key: 'sandbox', re: /\bsandbox\b|sandbox games?/i },
    { key: 'open_world', re: /open[- ]world(?:\s+games?)?|mundo abierto/i },
    { key: 'metroidvania', re: /metroid[- ]?vania/i },
    { key: 'roguelike', re: /rogue[- ]?(?:likes?|lites?)/i },
    { key: 'soulslike', re: /souls[- ]?likes?/i },
    { key: 'stealth', re: /stealth games?|\bstealth\b|sigilo/i },
    { key: 'visual_novel', re: /visual novels?|novela[ss]? visuales?/i },
    { key: 'rhythm', re: /rhythm games?|\brhythm\b|music(?:al)? games?|\bmusical\b/i },
    { key: 'mmo', re: /massively multiplayer|mmorpgs?|\bmmos?\b/i },
    { key: 'rpg', re: /\brpgs?\b|\bjrpgs?\b|role[- ]playing|turn[- ]based|juegos? de rol/i },
    { key: 'horror', re: /horror|terror|psychological thriller/i },
    { key: 'fighting', re: /fighting games?|\bfighters?\b|beat ['’]em up|hack and slash|peleas/i },
    { key: 'racing', re: /racing|motorsport|driving games?|carreras/i },
    { key: 'shooter', re: /shooters?|\bfps\b|bullet hell|first[- ]person shooter|third[- ]person shooter|disparos|tiro(?:s)?/i },
    { key: 'platformer', re: /platformers?|platform games?|side[- ]scrolling|jump[- ]and[- ]run|plataformas/i },
    { key: 'puzzle', re: /puzzles?|logic games?|brain teaser|match[- ]three|rompecabezas/i },
    { key: 'strategy', re: /strategy|tactical|\brts\b|real[- ]time strategy|4x\b|estrategia/i },
    { key: 'sports', re: /sports? games?|association football|football|basketball|soccer|baseball|tennis|golf|deportes/i },
    { key: 'simulation', re: /simulation|simulator|farming sim|life sim|simulaci[oó]n/i },
    { key: 'adventure', re: /adventure games?|interactive fiction|point[- ]and[- ]click|narrative|aventura/i },
    { key: 'action', re: /\baction\b|\bacci[oó]n\b/i },
    { key: 'indie', re: /\bindie\b|independent games?/i }
  ];

  /* Recopila TODOS los géneros de todas las fuentes (infobox, categorías,
     extracto EN, etiquetas P136 y artículo ES), aplicando compactación híbrida. */
  function detectGenres(sources) {
    var text = (sources || []).map(function (s) { return String(s || ''); }).join(' \n ');
    if (!text.trim()) return [];
    var out = [];
    HYBRID_HINTS.forEach(function (hint) {
      hint.re.lastIndex = 0;
      var found = false;
      text = text.replace(hint.re, function () { found = true; return ' '; });
      if (found && out.indexOf(hint.key) === -1) out.push(hint.key);
    });
    GENRE_HINTS.forEach(function (hint) {
      if (hint.re.test(text) && out.indexOf(hint.key) === -1) out.push(hint.key);
    });
    return compactGenres(out);
  }
  function bestClaim(claims, prop) {
    var arr = claims && claims[prop];
    if (!arr || !arr.length) return null;
    var pref = arr.filter(function (c) { return c && c.rank === 'preferred'; });
    var live = arr.filter(function (c) { return c && c.rank !== 'deprecated'; });
    var pool = pref.length ? pref : (live.length ? live : arr);
    return pool[0] || null;
  }
  function claimValue(claims, prop) {
    var c = bestClaim(claims, prop);
    return c && c.mainsnak && c.mainsnak.datavalue ? c.mainsnak.datavalue.value : null;
  }
  function parseWikidate(time) {
    var m = /^[+-](\d{1,4})-(\d{2})-(\d{2})T/.exec(String(time || ''));
    if (!m) return '';
    if (m[2] === '00' || m[3] === '00') return m[1];
    return m[1] + '-' + m[2] + '-' + m[3];
  }
  function pickLabel(entity, lang) {
    var labels = entity && entity.labels;
    if (!labels) return '';
    var a = labels[wikiLang(lang)], b = labels.en;
    return (a && a.value) || (b && b.value) || '';
  }
  function pickDescription(entity, lang) {
    var d = entity && entity.descriptions;
    if (!d) return '';
    var a = d[wikiLang(lang)], b = d.en;
    return (a && a.value) || (b && b.value) || '';
  }

  /* ---------- plataformas del juego: P400 + Infobox/intro + remasterizaciones ---------- */

  /* Los alias de buildAliases reconocen "PlayStation 4", "Windows", "Switch"...
     en texto libre. Se excluyen términos demasiado genéricos para no inventar
     plataformas que el texto no está nombrando realmente. */
  var PLATFORM_ALIAS_SKIP = {
    playstation: 1, xbox: 1, ds: 1, gb: 1, vita: 1, deck: 1,
    emulator: 1, emulador: 1, retro: 1, ea: 1,
    'other launcher': 1, 'otro launcher': 1, 'outro launcher': 1,
    'autre lanceur': 1, 'altro launcher': 1, 'anderer launcher': 1,
    'другой лаунчер': 1, 'その他のランチャー': 1
  };
  var platformTextCache = {};
  function platformTextEntries(allowed) {
    var list = allowed || PLATFORM_KEYS;
    var cacheKey = list.join('|');
    if (platformTextCache[cacheKey]) return platformTextCache[cacheKey];
    if (!aliasCache) aliasCache = buildAliases();
    var map = {};
    Object.keys(aliasCache).forEach(function (alias) {
      if (alias.length < 2 || PLATFORM_ALIAS_SKIP[alias]) return;
      var key = null;
      (aliasCache[alias] || []).forEach(function (v) {
        if (key) return;
        var k = v.slice(2);
        if ((v.indexOf('p:') === 0 || v.indexOf('o:') === 0) && list.indexOf(k) !== -1) key = k;
      });
      if (!key) return;
      var phrase = normTitle(alias);
      if (phrase.length < 2) return;
      if (!map[phrase]) map[phrase] = [];
      if (map[phrase].indexOf(key) === -1) map[phrase].push(key);
    });
    platformTextCache[cacheKey] = Object.keys(map).sort(function (a, b) { return b.length - a.length; })
      .map(function (phrase) { return { phrase: ' ' + phrase + ' ', keys: map[phrase] }; });
    return platformTextCache[cacheKey];
  }
  function platformKeysFromText(sources, allowed) {
    var text = ' ' + normTitle((sources || []).join(' ')) + ' ';
    var found = [];
    platformTextEntries(allowed).forEach(function (entry) {
      var pos = text.indexOf(entry.phrase);
      if (pos === -1) return;
      entry.keys.forEach(function (k) {
        var hit = null, i;
        for (i = 0; i < found.length; i++) if (found[i].key === k) { hit = found[i]; break; }
        if (!hit) found.push({ key: k, pos: pos });
        else if (pos < hit.pos) hit.pos = pos;
      });
    });
    /* El orden de aparición en el texto respeta "lanzamiento original, ports". */
    found.sort(function (a, b) { return a.pos - b.pos; });
    return found.map(function (f) { return f.key; });
  }
  function platformKeysFromQids(qids, allowedKeys) {
    var out = [], list = allowedKeys || PLATFORM_KEYS;
    (qids || []).forEach(function (qid) {
      list.forEach(function (k) {
        var allowed = WIKIDATA_PLATFORM_QIDS[k] || [];
        if (allowed.indexOf(qid) !== -1 && out.indexOf(k) === -1) out.push(k);
      });
    });
    return out;
  }
  function wikidataSearchUrl(search) {
    return WD_API +
      '?action=wbsearchentities' +
      '&search=' + encodeQ(search) +
      '&language=en' +
      '&uselang=en' +
      '&type=item' +
      '&limit=5' +
      '&format=json' +
      '&origin=*';
  }
  /* Solo ediciones "Remastered"/"HD" del MISMO título: "Remake" y
     "Reimagined" se descartan estrictamente en título y descripción. */
  function isRemasterCandidate(title, base) {
    var s = String(title || '');
    if (!/\bremaster(?:ed|ing)?\b|\bhd\b/i.test(s)) return false;
    if (/\b(?:remake|remakes|reimagined|reimagining)\b/i.test(s)) return false;
    var b = titleBase(base), t = titleBase(s);
    if (!b || !t || t.indexOf(b) !== 0) return false;
    var suffix = t.slice(b.length).trim();
    return /^(?:remaster(?:ed|ing)?|hd)(?:\s+(?:edition|version))?$/.test(suffix);
  }
  function mergeRemaster(list) {
    var qids = [], text = [];
    (list || []).forEach(function (r) {
      if (!r) return;
      (r.qids || []).forEach(function (q) { if (qids.indexOf(q) === -1) qids.push(q); });
      if (r.text) text.push(r.text);
    });
    return { qids: qids, text: text.join(' · ') };
  }
  function remasterFromWikiPages(data, base, lang) {
    var pages = data && data.query && data.query.pages ? data.query.pages : {};
    var list = Object.keys(pages).map(function (k) { return pages[k]; }).filter(function (p) {
      return p && p.title && p.missing === undefined && isRemasterCandidate(p.title, base);
    }).slice(0, 2);
    return Promise.all(list.map(function (p) {
      var qid = p.pageprops && p.pageprops.wikibase_item;
      var text = [p.extract || '', extractInfoboxParam(pageSectionContent(p), ['platform', 'platforms'])].join(' ').trim();
      if (!/^Q\d+$/.test(qid || '')) return Promise.resolve({ qids: [], text: text });
      return fetchMetaJson(wikidataUrl(qid, lang, true)).then(function (payload) {
        var entity = payload && payload.entities && payload.entities[qid];
        if (/\b(?:remake|reimagined)\b/i.test(pickDescription(entity, lang))) return { qids: [], text: '' };
        return { qids: entity ? wikidataClaimIds(entity.claims, 'P400') : [], text: text };
      }).catch(function () { return { qids: [], text: text }; });
    })).then(mergeRemaster);
  }
  /* Wikipedia y Wikidata se consultan en paralelo para encontrar la edición
     remasterizada; cualquier fallo de red simplemente aporta cero plataformas. */
  function fetchRemasterPlatforms(title, lang) {
    var base = String(title || '').trim();
    if (!base) return Promise.resolve({ qids: [], text: '' });
    function wiki(suffix) {
      return fetchMetaJson(wikiMetadataUrl(base + suffix, ''))
        .then(function (data) { return remasterFromWikiPages(data, base, lang); })
        .catch(function () { return { qids: [], text: '' }; });
    }
    var wd = fetchMetaJson(wikidataSearchUrl(base + ' Remastered')).then(function (data) {
      var items = (data && data.search || []).filter(function (it) {
        return it && isRemasterCandidate(it.label, base) &&
          !/\b(?:remake|reimagined)\b/i.test(it.description || '');
      }).slice(0, 2);
      return Promise.all(items.map(function (it) {
        return fetchMetaJson(wikidataUrl(it.id, lang, true)).then(function (payload) {
          var entity = payload && payload.entities && payload.entities[it.id];
          if (!entity || /\b(?:remake|reimagined)\b/i.test(pickDescription(entity, lang))) {
            return { qids: [], text: '' };
          }
          return { qids: wikidataClaimIds(entity.claims, 'P400'), text: '' };
        }).catch(function () { return { qids: [], text: '' }; });
      })).then(mergeRemaster);
    }).catch(function () { return { qids: [], text: '' }; });
    return Promise.all([wiki(' Remastered'), wiki(' HD'), wd]).then(mergeRemaster);
  }
  /* ---------- clientes de PC: solo la tienda realmente confirmada ----------
     P750/P123 de Wikidata y el Infobox/texto de Wikipedia se convierten en
     etiquetas; cada etiqueta apunta a UN unico launcher. Sin señal de tienda
     solo se ofrecen las opciones abiertas (Steam, GOG y Otro launcher). Los
     clientes propietarios (EA, Battle.net, Ubisoft, Xbox y Riot) exigen una
     confirmacion explicita. */
  var PC_LAUNCHER_FALLBACK_KEYS = PC_OPEN_LAUNCHER_KEYS.slice();
  var PC_STORE_MARKERS = [
    { key: 'pcSteam', re: /\bsteam\b|\bsteamworks\b|\bvalve corporation\b/i },
    { key: 'pcEpic', re: /\bepic games(?: store| launcher)?\b|\bepic store\b/i },
    { key: 'pcGog', re: /\bgog\.?com\b|\bgog\b|\bgood old games\b|\bgog galaxy\b/i },
    { key: 'pcEa', re: /\bea app\b|\borigin\b|\belectronic arts\b|\bea games\b|\bea studios\b/i },
    { key: 'pcBattleNet', re: /\bbattle\.?\s?net\b|\bblizzard(?: entertainment| north)?\b/i },
    { key: 'pcUbisoft', re: /\bubisoft(?: connect| entertainment)?\b|\buplay\b/i },
    { key: 'pcXboxApp', re: /\bmicrosoft store\b|\bmicrosoft games store\b|\bxbox game pass\b|\bpc game pass\b|\bgame pass\b|\bxbox app\b|\bxbox game studios\b|\bmicrosoft studios\b/i },
    { key: 'pcRiot', re: /\briot games\b|\briot client\b/i }
  ];
  var EMULABLE_PLATFORM_KEYS = ['ps3', 'ps2', 'ps1', 'psp', 'switch', 'wiiU', 'wii',
    'gamecube', 'n64', 'snes', 'n3ds', 'nds', 'gba', 'ps3Emulator', 'switchEmulator',
    'retroEmulator', 'emulator', 'retro'];
  function pcLaunchersFromEvidence(sources) {
    var text = ' ' + String((sources || []).join(' · ')).replace(/[|]/g, ' ') + ' ';
    var out = [];
    PC_STORE_MARKERS.forEach(function (m) {
      if (m.re.test(text) && out.indexOf(m.key) === -1) out.push(m.key);
    });
    return out;
  }
  function hasPcPlatformSignal(result) {
    var qids = (result && (result.allPlatformQids || result.platformQids)) || [];
    if (qids.some(function (q) { return PC_PLATFORM_QIDS.indexOf(q) !== -1; })) return true;
    /* Solo P400 o el campo "platform" del Infobox acreditan PC/Windows: una
       mencion a "Electronic Arts" o "Steam" en el texto no las inventa. */
    var text = ' ' + String(((result && result.pcPlatformTextSources) || []).join(' · ')) + ' ';
    return /\b(?:windows|microsoft windows|pc)\b/i.test(text);
  }
  /* Plataformas REALES donde salió el juego, segun P400 y el campo "platform"
     del Infobox (mas su equivalente local/remaster). No intervienen aqui las
     consolas del usuario: esta lista es la fuente de ambos niveles del selector.
     Las tiendas cerradas solo se admiten si el TEXTO DE PLATAFORMA las nombra;
     un publisher/distributor (P123/P750) no acredita un lanzamiento en EA App,
     Riot Client ni ningun otro launcher propietario. */
  function detectRealGamePlatforms(result) {
    var qids = result.allPlatformQids || result.platformQids || [];
    var keys = platformKeysFromQids(qids, RELEASE_PLATFORM_KEYS);
    /* Solo fuentes de plataforma: nunca el extracto completo ni P123/P750. */
    var releaseText = result.releasePlatformSources || [];
    platformKeysFromText(releaseText, RELEASE_PLATFORM_KEYS).forEach(function (k) {
      if (keys.indexOf(k) === -1) keys.push(k);
    });
    if (!hasPcPlatformSignal(result)) {
      keys = keys.filter(function (k) { return PC_RUNTIME_KEYS.indexOf(k) === -1; });
      return keys;
    }
    /* Sustituye el representante de PC en su posicion original para conservar
       el orden P400/Infobox (original, ports y remasterizaciones). */
    var stores = pcLaunchersFromEvidence(releaseText);
    var pcKeys = (stores.length ? stores : PC_LAUNCHER_FALLBACK_KEYS.slice(0, 1))
      .filter(function (k) { return RELEASE_PLATFORM_KEYS.indexOf(k) !== -1; });
    var ordered = [], pcPlaced = false;
    function add(k) { if (ordered.indexOf(k) === -1) ordered.push(k); }
    keys.forEach(function (k) {
      if (k === 'pcSteam') {
        if (!pcPlaced) { pcKeys.forEach(add); pcPlaced = true; }
      } else add(k);
    });
    if (!pcPlaced) pcKeys.forEach(add);
    return ordered;
  }
  /* Nivel 1: Mis Consolas INTERSECCION plataformas reales del juego. */
  function detectGamePlatforms(result, owned, realKeys) {
    var real = realKeys || detectRealGamePlatforms(result);
    if (owned.length) {
      var matched = platformKeysMatchingOwned(real, owned);
      /* PC / Emulador solo si el usuario lo marco y el juego tiene version
         emulable (consola retro soportada o PC). */
      if (owned.indexOf('pcEmulator') !== -1 &&
          (real.indexOf('pcSteam') !== -1 ||
           real.some(function (k) { return EMULABLE_PLATFORM_KEYS.indexOf(k) !== -1; }))) {
        addPlatformOption(matched, 'pcEmulator');
      }
      return matched;
    }
    /* Sin consolas configuradas se asuman todas: el nivel 1 ya son todas las
       plataformas reales, sin variantes de emulador ni launchers de mas. */
    return real.slice();
  }

  /* Rama Wikidata: resuelve el QID (prioriza el pageprops de Wikipedia EN), lee
     la entidad y obtiene las etiquetas de P178/P123/P750/P136/P400 de una sola
     tanda. Todo vive en una única promesa para que el allSettled final espere. */
  function fetchWikidataBranch(title, lang, qidFromEn) {
    var bySearch = fetchMetaJson(wikidataSearchUrl(title)).then(function (data) {
      var items = (data && data.search) || [];
      var exact = items.filter(function (it) {
        return it && it.id && (normTitle(it.label) === normTitle(title) ||
          titleBase(it.label) === titleBase(title));
      })[0] || items[0];
      return exact && /^Q\d+$/.test(exact.id) ? exact.id : '';
    }).catch(function () { return ''; });
    return Promise.allSettled([bySearch, qidFromEn]).then(function (found) {
      var qid = (found[1].status === 'fulfilled' && /^Q\d+$/.test(found[1].value || ''))
        ? found[1].value
        : ((found[0].status === 'fulfilled' && /^Q\d+$/.test(found[0].value || '')) ? found[0].value : '');
      if (!qid) return null;
      return fetchMetaJson(wikidataUrl(qid, lang, true)).then(function (payload) {
        var entity = payload && payload.entities && payload.entities[qid];
        if (!entity) return null;
        var branch = {
          qid: qid,
          entity: entity,
          wikidataDescription: cleanSummary(pickDescription(entity, lang), 2),
          platformQids: wikidataClaimIds(entity.claims, 'P400'),
          genreQids: wikidataClaimIds(entity.claims, 'P136', true),
          /* P750 "distributed by" y P123 "publisher" confirman la tienda real. */
          distributorQids: wikidataClaimIds(entity.claims, 'P750'),
          publisherQids: wikidataClaimIds(entity.claims, 'P123')
        };
        var dateValue = claimValue(entity.claims, 'P577');
        branch.releaseDate = parseWikidate(dateValue && dateValue.time ? dateValue.time : dateValue);
        var devValue = claimValue(entity.claims, 'P178');
        branch.developerQid = (devValue && devValue.id && /^Q\d+$/.test(devValue.id)) ? devValue.id : '';
        var ids = branch.genreQids.concat(branch.platformQids, branch.distributorQids, branch.publisherQids);
        if (branch.developerQid) ids.push(branch.developerQid);
        ids = ids.filter(function (v, i) { return ids.indexOf(v) === i; });
        if (!ids.length) { branch.labels = {}; return branch; }
        return fetchWikidataLabels(ids, lang).then(function (labels) {
          function addLabel(list, value) { if (value && list.indexOf(value) === -1) list.push(value); }
          branch.labels = labels;
          branch.developer = labelFromMap(labels, branch.developerQid).slice(0, 80);
          branch.genreLabels = [];
          branch.platformLabels = [];
          branch.genreQids.forEach(function (id) {
            var v = labels[id];
            if (!v) return;
            addLabel(branch.genreLabels, v.preferred);
            addLabel(branch.genreLabels, v.en);
          });
          branch.platformQids.forEach(function (id) {
            var v = labels[id];
            if (!v) return;
            addLabel(branch.platformLabels, v.preferred);
            addLabel(branch.platformLabels, v.en);
          });
          branch.distributorLabels = [];
          branch.publisherLabels = [];
          branch.distributorQids.forEach(function (id) {
            var v = labels[id];
            if (!v) return;
            addLabel(branch.distributorLabels, v.preferred);
            addLabel(branch.distributorLabels, v.en);
          });
          branch.publisherQids.forEach(function (id) {
            var v = labels[id];
            if (!v) return;
            addLabel(branch.publisherLabels, v.preferred);
            addLabel(branch.publisherLabels, v.en);
          });
          return branch;
        });
      });
    }).catch(function () { return null; });
  }

  /* Un solo clic = todas las fuentes lanzadas a la vez y un único allSettled.
     El formulario no se toca hasta que todas han terminado (o han fallado). */
  function collectMetadata(title, lang, withRemasters) {
    var result = { genreSources: [], platformTextSources: [], pcPlatformTextSources: [],
      releasePlatformSources: [], storeEvidenceSources: [], platformQids: [], allPlatformQids: [] };
    var enBranch = fetchMetaJson(wikiMetadataUrl(title)).catch(function () { return null; });
    var qidFromEn = enBranch.then(function (data) {
      var page = pickBestPage(data, title, false);
      var qid = page && page.pageprops && page.pageprops.wikibase_item;
      return (qid && /^Q\d+$/.test(qid)) ? qid : '';
    });
    var branches = [
      enBranch,                                                              // Wikipedia EN
      fetchWikidataBranch(title, lang, qidFromEn),                            // Wikidata + P577/P178/P136/P400
      fetchLocalSummary(title, lang),                                        // Sinopsis en el idioma activo
      fetchLocalWikiInfo(title, lang),                                       // Genero + tienda del Infobox local
      withRemasters !== false ? fetchRemasterPlatforms(title, lang) : Promise.resolve({ qids: [], text: '' }),
      fetchCoverRaw(title).catch(function () { return ''; })                  // Portada (sin segunda fase)
    ];
    return Promise.allSettled(branches).then(function (settled) {
      var enPage = settled[0].status === 'fulfilled' ? settled[0].value : null;
      var wd = settled[1].status === 'fulfilled' ? settled[1].value : null;
      var localSummary = settled[2].status === 'fulfilled' ? settled[2].value : '';
      var localInfo = settled[3].status === 'fulfilled' ? settled[3].value : null;
      var remaster = settled[4].status === 'fulfilled' ? settled[4].value : { qids: [], text: '' };
      var cover = settled[5].status === 'fulfilled' ? settled[5].value : '';

      if (enPage) {
        if (enPage.thumbnail && enPage.thumbnail.source) result.cover = enPage.thumbnail.source;
        result.enSummary = cleanSummary(enPage.extract, 2);
        var pageContent = pageSectionContent(enPage);
        var infoboxPlatforms = extractInfoboxParam(pageContent, ['platform', 'platforms', 'plataforma', 'plataformas']);
        if (enPage.extract) result.platformTextSources.push(enPage.extract);
        if (infoboxPlatforms) {
          result.platformTextSources.push(infoboxPlatforms);
          result.pcPlatformTextSources.push(infoboxPlatforms);
          result.releasePlatformSources.push(infoboxPlatforms);
        }
        result.genreSources.push(enPage.extract || '', categoriesText(enPage.categories));
        var infoboxGenre = extractInfoboxParam(pageContent, ['genre']);
        if (infoboxGenre) result.genreSources.push(infoboxGenre);
        /* La tienda/confirmadora puede venir en el Infobox, el texto o las
           categorias de Wikipedia ("Steam games", "Xbox Game Pass games"...). */
        var infoboxStores = extractInfoboxParam(pageContent, ['publisher', 'publishers',
          'distributor', 'distributors', 'developer', 'developed by']);
        if (infoboxStores) result.storeEvidenceSources.push(infoboxStores);
        if (enPage.extract) result.storeEvidenceSources.push(enPage.extract);
        if (enPage.categories) result.storeEvidenceSources.push(categoriesText(enPage.categories));
      }
      if (cover && !result.cover) result.cover = cover;
      if (localInfo) {
        if (localInfo.genre) result.genreSources.push(localInfo.genre);
        if (localInfo.platform) {
          result.platformTextSources.push(localInfo.platform);
          result.pcPlatformTextSources.push(localInfo.platform);
          result.releasePlatformSources.push(localInfo.platform);
        }
        if (localInfo.store) result.storeEvidenceSources.push(localInfo.store);
      }

      if (wd) {
        result.wikidata = wd.entity;
        result.wikidataDescription = wd.wikidataDescription;
        result.releaseDate = wd.releaseDate || '';
        result.developer = wd.developer || '';
        result.platformQids = (wd.platformQids || []).slice();
        result.allPlatformQids = result.platformQids.slice();
        result.wikidataGenreQids = wd.genreQids || [];
        result.wikidataGenreLabels = wd.genreLabels || [];
        if (wd.genreLabels && wd.genreLabels.length) result.genreSources.push(wd.genreLabels.join(' · '));
        if (wd.platformLabels && wd.platformLabels.length) {
          result.platformTextSources.push(wd.platformLabels.join(' · '));
          result.pcPlatformTextSources.push(wd.platformLabels.join(' · '));
          result.releasePlatformSources.push(wd.platformLabels.join(' · '));
        }
        if (wd.distributorLabels && wd.distributorLabels.length) result.storeEvidenceSources.push(wd.distributorLabels.join(' · '));
        if (wd.publisherLabels && wd.publisherLabels.length) result.storeEvidenceSources.push(wd.publisherLabels.join(' · '));
        if (wd.developer) result.storeEvidenceSources.push(wd.developer);
      }
      (remaster.qids || []).forEach(function (q) {
        if (result.allPlatformQids.indexOf(q) === -1) result.allPlatformQids.push(q);
      });
      if (remaster.text) result.platformTextSources.push(remaster.text);
      result.genres = detectGenres(result.genreSources);
      result.genre = result.genres[0] || '';
      result.summary = cleanSummary(localSummary, 2) || result.wikidataDescription || result.enSummary || '';
      return result;
    });
  }

  function showAutofillMsg(text, kind) {
    var el = $('e-autofill-msg');
    if (!el) return;
    el.className = 'help autofill-msg' + (kind ? ' is-' + kind : '');
    el.textContent = text || '';
    el.hidden = !text;
  }
  function setAutofillBusy(busy) {
    var btn = $('e-autofill'), spin = $('e-autofill-spin');
    if (!btn) return;
    btn.disabled = !!busy;
    btn.setAttribute('aria-busy', busy ? 'true' : 'false');
    if (spin) spin.hidden = !busy;
    var label = btn.querySelector('[data-i18n]');
    if (label) label.textContent = t(busy ? 'editor.autofillSearching' : 'editor.autofill');
  }
  function resetAutofillMsg() {
    metaSearchId++;
    setAutofillBusy(false);
    showAutofillMsg('', '');
  }
  function applyMetadata(result, lang) {
    var done = [];
    if (result.cover) {
      editCover = result.cover; editCoverSource = 'wiki'; coverMsg = t('editor.coverWiki');
      renderCoverPreview();
      done.push(t('meta.cover'));
    }
    var foundGenres = compactGenres((result.genres && result.genres.length) ? result.genres : (result.genre ? [result.genre] : []));
    if (foundGenres.length) {
      /* Compacta también lo que ya había en el editor: si llega Survival Horror,
         retira un Supervivencia/Terror seleccionados previamente. */
      editGenres = compactGenres(editGenres.concat(foundGenres));
      renderGenreChips();
      done.push(foundGenres.map(function (k) { return displayValue('g', k); }).join(', '));
    }
    if (result.releaseDate) { $('e-release').value = result.releaseDate; done.push(result.releaseDate); }
    if (result.developer) { $('e-dev').value = result.developer; done.push(result.developer); }
    if (result.summary) { $('e-summary').value = result.summary; done.push(t('meta.summary')); }
    /* Selector inteligente: original + ports/remasterizaciones ∩ Mis Consolas.
       El scraper SOLO filtra las opciones: nunca preselecciona ni rellena el
       campo, que queda vacío (con su placeholder) para que el usuario elija. */
    if (result.allPlatformQids || (result.platformTextSources && result.platformTextSources.length)) {
      var real = detectRealGamePlatforms(result);
      gamePlatformKeys = real.length ? real : null;
      if (gamePlatformKeys) {
        var owned = ownedConfigured() ? effectiveOwnedKeys() : [];
        var matched = detectGamePlatforms(result, owned, real);
        /* La plataforma ya guardada se anade despues para no perder el valor
           del formulario; los dos niveles quedan disponibles tras el scraper. */
        var currentKey = keyOf('p', $('e-plat').value.trim());
        if (PLATFORM_KEYS.indexOf(currentKey) !== -1 && matched.indexOf(currentKey) === -1) matched.push(currentKey);
        /* Nivel 1 por defecto: Mis Consolas ∩ plataformas reales del juego. */
        setPlatformOptions(matched, 'editor.platformFiltered', true);
        done.push(t('meta.platforms') + ': ' + matched.map(function (k) { return displayValue('p', k); }).join(', '));
      } else {
        setPlatformOptions(null, 'editor.platformNoMatch', false);
      }
    }
    if (done.length) showAutofillMsg(t('editor.autofillDone', { list: done.join(', ') }), 'ok');
    else showAutofillMsg(t('editor.autofillNothing', { lang: I.languageName ? I.languageName(lang) : lang }), 'warn');
  }
  function autofillMetadata() {
    var title = $('e-title').value.trim();
    if (!title) { $('e-err').textContent = t('editor.errTitle'); $('e-title').focus(); return; }
    /* Un clic: mientras están todas las consultas en vuelo, el botón sigue
       deshabilitado y no se acumulan búsquedas parciales. */
    if ($('e-autofill') && $('e-autofill').disabled) return;
    var token = ++metaSearchId;
    var lang = I.lang ? I.lang() : I.current();
    setAutofillBusy(true);
    showAutofillMsg(t('editor.autofillSearching', { lang: I.languageName ? I.languageName(lang) : lang }), 'searching');
    $('e-err').textContent = '';
    /* collectMetadata ya ha esperado a Wikipedia, Wikidata, idioma activo,
       remasterizaciones y portada. Aplicamos todo de una sola vez. */
    collectMetadata(title, lang).then(function (result) {
      if (result && token === metaSearchId) applyMetadata(result, lang);
    }).catch(function () {
      if (token === metaSearchId) showAutofillMsg(t('editor.autofillError'), 'error');
    }).then(function () {
      if (token === metaSearchId) setAutofillBusy(false);
    });
  }

  /* ---------- portada generada ---------- */
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; } return Math.abs(h); }
  function coverStyle(txt) {
    var h = hash(txt) % 360;
    return 'background:linear-gradient(155deg,hsl(' + h + ' 52% 36%),hsl(' + ((h + 45) % 360) + ' 58% 15%))';
  }
  function initials(txt) {
    var w = txt.replace(/[^\p{L}\p{N}\s]/gu, ' ').trim().split(/\s+/).filter(Boolean);
    if (!w.length) return '?';
    return (w.length === 1 ? w[0].slice(0, 2) : w[0][0] + w[1][0]).toUpperCase();
  }

  /* ---------- filtrado ---------- */
  function matchesBase(g) {
    if (state.f.plat && keyOf('p', g.platform) !== state.f.plat) return false;
    if (state.f.genre && genresOf(g).indexOf(state.f.genre) === -1) return false;
    if (state.f.q && g.title.toLowerCase().indexOf(state.f.q.toLowerCase()) === -1) return false;
    if (state.f.ownedOnly && !gameMatchesOwned(g)) return false;
    return true;
  }
  function visible() {
    var list = state.games.filter(function (g) {
      return matchesBase(g) && (state.f.status === 'todos' || g.status === state.f.status);
    });
    var s = state.f.sort;
    list.sort(function (a, b) {
      if (s === 'nombre') return a.title.localeCompare(b.title, localeTag());
      if (s === 'anio') {
        var ya = Number(a.releaseYear) || 0, yb = Number(b.releaseYear) || 0;
        return yb - ya || a.title.localeCompare(b.title, localeTag());
      }
      if (s === 'horas') return b.hours - a.hours;
      if (s === 'nota') return (b.score || 0) - (a.score || 0) || a.title.localeCompare(b.title, localeTag());
      return b.updated - a.updated;
    });
    return list;
  }
  function uniqValues(kind) {
    var m = {};
    state.games.forEach(function (g) {
      var values = kind === 'p' ? [g.platform] : genresOf(g);
      values.forEach(function (v) { var k = keyOf(kind, v); if (k) m[k] = true; });
    });
    return Object.keys(m).sort(function (a, b) { return displayValue(kind, a).localeCompare(displayValue(kind, b), localeTag()); });
  }

  /* ---------- render ---------- */
  function renderStats() {
    var G = state.games, n = G.length;
    var hours = G.reduce(function (a, g) { return a + g.hours; }, 0);
    var done = G.filter(function (g) { return g.status === 'completado' || g.status === 'platino'; }).length;
    var plat = G.filter(function (g) { return g.status === 'platino'; }).length;
    var pend = G.filter(function (g) { return g.status === 'pendiente'; }).length;
    var play = G.filter(function (g) { return g.status === 'jugando'; }).length;
    var scored = G.filter(function (g) { return g.score; });
    var avg = scored.length ? scored.reduce(function (a, g) { return a + g.score; }, 0) / scored.length : null;

    $('st-total').textContent = n;
    $('st-total-s').textContent = t('stats.pendingInProgress', { pend: pend, play: play });
    $('st-hours').innerHTML = esc(fmtNum(hours)) + '<small>h</small>';
    $('st-hours-s').textContent = n ? t('stats.avgHours', { hours: fmtNum(hours / n) }) : t('stats.noHours');
    $('st-pct').textContent = (n ? Math.round(done / n * 100) : 0) + '%';
    $('st-pct-s').textContent = done + ' / ' + n + (plat ? t('stats.platinumPart', { n: plat }) : '') + (avg ? t('stats.avgScorePart', { score: fmtNum(avg) }) : '');

    var P = {};
    G.forEach(function (g) {
      var k = keyOf('p', g.platform) || '';
      var name = k ? displayValue('p', k) : t('card.noPlatform');
      if (!P[name]) P[name] = { n: 0, h: 0 };
      P[name].n++; P[name].h += g.hours;
    });
    var arr = Object.keys(P).map(function (k) { return { name: k, n: P[k].n, h: P[k].h }; })
      .sort(function (a, b) { return b.n - a.n || b.h - a.h; });
    if (arr.length) {
      $('st-plat').textContent = arr[0].name;
      $('st-plat-s').textContent = t('stats.platformDetail', { n: arr[0].n, h: fmtNum(arr[0].h) });
    } else {
      $('st-plat').textContent = '—';
      $('st-plat-s').textContent = t('stats.addFirst');
    }

    var counts = {};
    STATUS.forEach(function (s) { counts[s.id] = G.filter(function (g) { return g.status === s.id; }).length; });
    $('stack').innerHTML = n ? STATUS.filter(function (s) { return counts[s.id]; }).map(function (s) {
      return '<i title="' + esc(statusLabel(s) + ': ' + counts[s.id]) + '" style="flex:' + counts[s.id] + ';background:' + s.color + '"></i>';
    }).join('') : '';
    $('legend').innerHTML = STATUS.map(function (s) {
      return '<span><em style="background:' + s.color + '"></em>' + esc(statusLabel(s)) + ' <b class="num">' + counts[s.id] + '</b></span>';
    }).join('');

    var max = arr.length ? arr[0].n : 1;
    $('bars').innerHTML = arr.length ? arr.slice(0, 6).map(function (p) {
      return '<div class="bar"><span class="n" title="' + esc(p.name) + '">' + esc(p.name) + '</span><span class="t"><i style="width:' + (p.n / max * 100) + '%"></i></span><span class="c">' + p.n + ' · ' + fmtNum(p.h) + ' h</span></div>';
    }).join('') : '<span class="msg">' + esc(t('stats.noData')) + '</span>';
  }

  function renderTabs() {
    var base = state.games.filter(matchesBase);
    var html = '<button class="tab" type="button" data-st="todos" aria-pressed="' + (state.f.status === 'todos') + '">' + esc(t('tabs.all')) + ' <span class="c">' + base.length + '</span></button>';
    STATUS.forEach(function (s) {
      var c = base.filter(function (g) { return g.status === s.id; }).length;
      html += '<button class="tab" type="button" data-st="' + s.id + '" aria-pressed="' + (state.f.status === s.id) + '">' + esc(statusLabel(s)) + ' <span class="c">' + c + '</span></button>';
    });
    $('tabs').innerHTML = html;
  }

  function fillSelect(el, kind, first, values, current) {
    var h = '<option value="">' + esc(first) + '</option>' + values.map(function (v) {
      return '<option value="' + esc(v) + '"' + (v === current ? ' selected' : '') + '>' + esc(displayValue(kind, v)) + '</option>';
    }).join('');
    el.innerHTML = h;
    el.value = current;
    if (el.value !== current) el.value = '';
  }
  function renderFilters() {
    /* Los filtros ofrecen el catalogo completo, no solo lo que haya en la biblioteca. */
    var pl = PLATFORM_KEYS.slice(), ge = GENRE_KEYS.slice();
    uniqValues('g').forEach(function (k) { if (ge.indexOf(k) === -1) ge.push(k); });
    if (state.f.plat && pl.indexOf(state.f.plat) === -1) state.f.plat = '';
    if (state.f.genre && ge.indexOf(state.f.genre) === -1) state.f.genre = '';
    fillSelect($('f-plat'), 'p', t('filter.platform'), pl, state.f.plat);
    fillSelect($('f-genre'), 'g', t('filter.genre'), ge, state.f.genre);
    var own = $('f-owned');
    if (own) own.checked = !!state.f.ownedOnly;
    var wrap = $('owned-toggle-wrap');
    if (wrap) wrap.title = ownedConfigured() ? t('filter.ownedOnlyTitle', { list: ownedLabelList(effectiveOwnedKeys()).join(', ') }) : t('owned.allAssumed');
  }
  function fillDataLists() {
    /* Respeta el filtro activo del editor; fuera de él se muestra el catálogo. */
    var plats = platformOptions || PLATFORM_KEYS;
    $('dl-plat').innerHTML = plats.map(function (k) {
      return '<option value="' + esc(displayValue('p', k)) + '"></option>';
    }).join('');
    $('dl-genre').innerHTML = GENRE_KEYS.map(function (k) {
      return '<option value="' + esc(t('genre.' + k)) + '"></option>';
    }).join('');
  }
  /* Pinta el datalist, la ayuda y el enlace secundario. Antes del scraper el
     enlace destaca el catalogo general; despues, solo las plataformas reales. */
  function setPlatformOptions(keys, helpKey, showAll) {
    platformOptions = (keys && keys.length) ? keys.slice() : null;
    platformHelpKey = helpKey || '';
    platformShowAll = !!showAll;
    fillDataLists();
    var help = $('e-plat-help');
    if (help) {
      help.textContent = platformHelpKey ? t(platformHelpKey) : '';
      help.hidden = !platformHelpKey;
    }
    var link = $('e-plat-show-all');
    if (link) {
      link.textContent = t('editor.showAllGamePlatforms');
      link.hidden = !platformShowAll;
    }
  }

  function coverHtml(g, cls) {
    var has = !!g.cover;
    return '<div class="' + (cls || 'cover') + (has ? ' has-img' : '') + '" style="' + coverStyle(g.title) + '">' +
      (has ? '<img class="cover-img" src="' + esc(g.cover) + '" alt="" loading="lazy" onerror="this.style.display=\'none\';this.parentNode.classList.remove(\'has-img\')">' : '') +
      '<span class="ini" aria-hidden="true">' + esc(initials(g.title)) + '</span>' +
      (g.example ? '<span class="ex">' + esc(t('card.example')) + '</span>' : '') +
      (g.score ? '<span class="score">' + g.score + '<small>/10</small></span>' : '') +
      (g.platform ? '<span class="plat">' + esc(displayValue('p', g.platform)) + '</span>' : '') +
    '</div>';
  }

  function cardHtml(g) {
    var st = SMAP[g.status];
    var detail = [g.developer, g.releaseYear].filter(Boolean).join(' · ');
    return '<div class="card" data-id="' + g.id + '">' +
      '<button class="card" type="button" data-open="' + g.id + '" style="width:100%" aria-label="' + esc(t('card.editAria', { title: g.title })) + '">' +
        coverHtml(g, 'cover') +
        '<div class="meta"><span class="t" title="' + esc(g.title) + '">' + esc(g.title) + '</span>' +
        genreTagsHtml(g) +
        (detail ? '<span class="d" title="' + esc(detail) + '">' + esc(detail) + '</span>' : '') + '</div>' +
      '</button>' +
      '<div class="row"><span class="pill" style="--c:' + st.color + '">' + esc(statusLabel(st)) + '</span>' +
      '<span class="row" style="gap:6px"><span class="hrs">' + fmtNum(g.hours) + ' h</span>' +
      '<button class="plus" type="button" data-hour="' + g.id + '" aria-label="' + esc(t('card.addHourAria', { title: g.title })) + '">+1h</button></span></div>' +
    '</div>';
  }

  function renderGrid() {
    var list = visible();
    if (!state.games.length) {
      $('grid').innerHTML = '';
      $('grid').insertAdjacentHTML('beforeend', '<div class="empty" style="grid-column:1/-1"><b>' + esc(t('empty.libraryTitle')) + '</b><span>' + esc(t('empty.libraryText')) + '</span><button class="btn primary" type="button" data-add>' + esc(t('empty.addButton')) + '</button></div>');
      return;
    }
    if (!list.length) {
      $('grid').innerHTML = '<div class="empty" style="grid-column:1/-1"><b>' + esc(t('empty.filterTitle')) + '</b><span>' + esc(t('empty.filterText')) + '</span><button class="btn" type="button" data-clear>' + esc(t('empty.clearButton')) + '</button></div>';
      return;
    }
    $('grid').innerHTML = list.map(cardHtml).join('');
  }

  /* Coleccion agrupada por consola dentro de la pestana "Mis Consolas". */
  function renderConsoleGames() {
    var box = $('console-game-groups');
    if (!box) return;
    var groups = (STORAGE && typeof STORAGE.groupGamesByPlatform === 'function')
      ? STORAGE.groupGamesByPlatform(state.games,
          function (value) { return keyOf('p', value); },
          function (k) { return displayValue('p', k); })
      : [];
    if (!groups.length) {
      box.innerHTML = '<p class="msg">' + esc(t('console.empty')) + '</p>';
      return;
    }
    box.innerHTML = groups.map(function (grp) {
      var summary = esc(t('stats.platformDetail', { n: grp.games.length, h: fmtNum(grp.hours) }));
      var items = grp.games.map(function (g) {
        var st = SMAP[g.status] || SMAP.pendiente;
        return '<button class="console-game-item" type="button" data-open="' + esc(g.id) + '"' +
          ' aria-label="' + esc(t('card.editAria', { title: g.title })) + '">' +
          '<span class="dot" style="--c:' + st.color + '"></span>' +
          '<span class="t">' + esc(g.title) + '</span>' +
          '<span class="h num">' + fmtNum(g.hours) + ' h</span></button>';
      }).join('');
      return '<div class="console-game-group">' +
        '<h3>' + esc(grp.label) + ' <span class="num">(' + summary + ')</span></h3>' +
        '<div class="console-game-list">' + items + '</div></div>';
    }).join('');
  }

  function showFlash(text) {
    flashNote = text || '';
    renderNotes();
    if (flashTimer) clearTimeout(flashTimer);
    if (flashNote) flashTimer = setTimeout(function () { flashNote = ''; renderNotes(); }, 6000);
  }
  function renderNotes() {
    var h = '';
    if (flashNote) h += '<div class="note"><span><b>' + esc(flashNote) + '</b></span></div>';
    var ex = state.games.filter(function (g) { return g.example; }).length;
    if (ex) h += '<div class="note"><span><b>' + esc(t('note.examplesTitle')) + '</b> ' + esc(t('note.examplesText')) + '</span><button class="btn" type="button" data-clear-ex>' + esc(t('note.clearExamples')) + '</button></div>';
    if (!storageOk) h += '<div class="note"><span><b>' + esc(t('note.storageTitle')) + '</b> ' + esc(t('note.storageText')) + '</span></div>';
    $('notes').innerHTML = h;
  }

  function renderAll() {
    renderOwnedBadge();
    renderOwnedChips();
    renderFilters();
    renderStats();
    renderTabs();
    renderGrid();
    renderConsoleGames();
    renderNotes();
  }
  /* Alias publico de renderizado para el arranque y para depuracion. */
  function render() { renderAll(); }

  /* ---------- editor ---------- */
  function buildScores() {
    var h = '';
    for (var i = 1; i <= 10; i++) h += '<button type="button" data-sc="' + i + '" aria-pressed="' + (editScore === i) + '">' + i + '</button>';
    $('e-scores').innerHTML = h;
  }
  function renderGenreChips() {
    var box = $('e-genres');
    if (!box) return;
    var keys = GENRE_KEYS.filter(function (k, i) { return GENRE_KEYS.indexOf(k) === i; });
    box.innerHTML = keys.map(function (k) {
      var on = editGenres.indexOf(k) !== -1;
      return '<button class="genre-chip" type="button" data-genre-toggle="' + k + '" aria-pressed="' + on + '">' + esc(t('genre.' + k)) + '</button>';
    }).join('');
  }
  function setEditGenres(list) {
    editGenres = compactGenres(list);
    renderGenreChips();
  }
  function toggleGenre(key) {
    var i = editGenres.indexOf(key);
    if (i === -1) editGenres.push(key);
    else editGenres.splice(i, 1);
    renderGenreChips();
  }
  function renderCoverPreview() {
    var txt = $('e-title').value.trim() || t('game.untitled');
    var has = !!editCover;
    $('e-cover-preview').className = 'cover-preview' + (has ? ' has-img' : '');
    $('e-cover-preview').style.cssText = coverStyle(txt);
    $('e-cover-preview').innerHTML = (has ? '<img src="' + esc(editCover) + '" alt="" onerror="this.style.display=\'none\';this.parentNode.classList.remove(\'has-img\')">' : '') +
      '<span class="ini" aria-hidden="true">' + esc(initials(txt)) + '</span>';
    var msg = coverMsg;
    if (!msg) {
      if (!has) msg = t('editor.coverNone');
      else if (editCoverSource === 'wiki') msg = t('editor.coverWiki');
      else if (editCoverSource === 'file') msg = t('editor.coverFile');
      else if (editCoverSource === 'url') msg = t('editor.coverUrl');
      else msg = t('editor.coverManual');
    }
    $('e-cover-msg').textContent = msg;
  }
  function statusOptions() {
    return STATUS.map(function (st) {
      return '<option value="' + st.id + '">' + esc(statusLabel(st)) + '</option>';
    }).join('');
  }
  function resetDeleteButton() {
    delArmed = false;
    var del = $('e-del');
    del.classList.remove('armed');
    del.textContent = t('editor.delete');
  }
  /* Estado inicial (sin scraper): primero Mis Consolas; el enlace muestra el
     catalogo general. Tambien se usa al cambiar el titulo para descartar datos
     de disponibilidad que ya no pertenecen a la ficha que se esta editando. */
  function resetEditorPlatformOptions() {
    gamePlatformKeys = null;
    var platKeys = platformOptionsForOwned();
    var currentKey = keyOf('p', $('e-plat').value.trim());
    if (PLATFORM_KEYS.indexOf(currentKey) !== -1 && platKeys.indexOf(currentKey) === -1) platKeys.push(currentKey);
    var hasOwned = ownedConfigured() && effectiveOwnedKeys().length > 0;
    setPlatformOptions(platKeys, hasOwned ? 'editor.platformFiltered' : '', hasOwned);
  }
  function openEditor(id) {
    editingId = id || null;
    var g = id ? state.games.filter(function (x) { return x.id === id; })[0] : null;
    $('ed-title').textContent = t(g ? 'editor.editTitle' : 'editor.addTitle');
    $('e-title').value = g ? g.title : '';
    $('e-plat').value = g ? displayValue('p', g.platform) : (state.f.plat ? displayValue('p', state.f.plat) : '');
    setEditGenres(g ? genresOf(g) : (state.f.genre ? [state.f.genre] : []));
    $('e-status').innerHTML = statusOptions();
    $('e-status').value = g ? g.status : (state.f.status !== 'todos' ? state.f.status : 'pendiente');
    $('e-hours').value = g ? g.hours : 0;
    $('e-notes').value = g ? g.notes : '';
    $('e-release').value = g ? (g.releaseDate || g.releaseYear || '') : '';
    $('e-dev').value = g ? (g.developer || '') : '';
    $('e-summary').value = g ? (g.summary || '') : '';
    $('e-cover-url').value = g && g.cover && /^https?:/i.test(g.cover) ? g.cover : '';
    $('e-cover-file').value = '';
    editScore = g ? g.score : null;
    editCover = g ? (g.cover || '') : '';
    editCoverSource = g ? (g.coverSource || '') : '';
    coverMsg = '';
    coverSearchId++;
    buildScores();
    renderCoverPreview();
    $('e-err').textContent = '';
    resetAutofillMsg();
    var del = $('e-del');
    del.hidden = !g;
    resetDeleteButton();
    resetEditorPlatformOptions();
    setOverlay('ov-edit', true);
    setTimeout(function () { $('e-title').focus(); }, 0);
  }
  function closeEditor() { coverSearchId++; resetAutofillMsg(); setOverlay('ov-edit', false); }
  function saveEditor() {
    var title = $('e-title').value.trim();
    if (!title) { $('e-err').textContent = t('editor.errTitle'); $('e-title').focus(); return; }
    var rel = splitRelease($('e-release').value);
    var data = {
      title: title,
      platform: keyOf('p', $('e-plat').value.trim()),
      genres: editGenres.slice(),
      genre: editGenres[0] || '',
      releaseDate: rel.releaseDate,
      releaseYear: rel.releaseYear,
      developer: $('e-dev').value.trim().slice(0, 80),
      summary: $('e-summary').value.trim().slice(0, 300),
      status: $('e-status').value,
      hours: Math.max(0, parseFloat($('e-hours').value) || 0),
      score: editScore,
      notes: $('e-notes').value,
      cover: editCover || '',
      coverSource: editCover ? (editCoverSource || 'manual') : ''
    };
    var shouldAutoCover = !data.cover;
    var savedId = editingId;
    if (editingId) {
      state.games.forEach(function (g) {
        if (g.id === editingId) {
          Object.keys(data).forEach(function (k) { g[k] = data[k]; });
          g.updated = Date.now(); g.example = false;
        }
      });
    } else {
      var ng = STORAGE.normalize(data);
      ng.id = uid(); ng.added = Date.now(); ng.updated = Date.now();
      state.games.unshift(ng);
      savedId = ng.id;
    }
    save(); closeEditor(); renderAll();
    if (shouldAutoCover && navigator.onLine) {
      var g2 = state.games.filter(function (x) { return x.id === savedId; })[0];
      if (g2) resolveGameCover(g2, false);
    }
  }
  function deleteEditorGame() {
    if (!editingId) return;
    if (!delArmed) {
      delArmed = true;
      $('e-del').classList.add('armed');
      $('e-del').textContent = t('editor.deleteConfirm');
      return;
    }
    var id = editingId;
    state.games = state.games.filter(function (g) { return g.id !== id; });
    save(); closeEditor(); renderAll();
  }
  function searchCover() {
    var title = $('e-title').value.trim();
    if (!title) { $('e-err').textContent = t('editor.errTitle'); $('e-title').focus(); return; }
    var mySearch = ++coverSearchId;
    coverMsg = t('editor.coverSearching');
    renderCoverPreview();
    fetchCoverRaw(title).then(function (src) {
      if (mySearch !== coverSearchId) return;
      if (src) { editCover = src; editCoverSource = 'wiki'; coverMsg = t('editor.coverFound'); }
      else coverMsg = t('editor.coverNotFound');
      renderCoverPreview();
    }).catch(function () {
      if (mySearch !== coverSearchId) return;
      coverMsg = t('editor.coverError');
      renderCoverPreview();
    });
  }

  /* ---------- ruleta ---------- */
  function pendingPlatforms() {
    var m = {};
    state.games.forEach(function (g) {
      if (g.status === 'pendiente') {
        var k = keyOf('p', g.platform);
        m[k] = true;
      }
    });
    return Object.keys(m).sort(function (a, b) {
      return displayValue('p', a).localeCompare(displayValue('p', b), localeTag());
    });
  }
  function fillRoulettePlatforms() {
    var sel = $('r-plat');
    var current = sel.value;
    var plats = pendingPlatforms();
    var h = '<option value="">' + esc(t('roulette.allPlatforms')) + '</option>' + plats.map(function (k) {
      return '<option value="' + esc(k) + '">' + esc(k ? displayValue('p', k) : t('card.noPlatform')) + '</option>';
    }).join('');
    sel.innerHTML = h;
    sel.value = (current && plats.indexOf(current) !== -1) ? current : '';
  }
  function renderPick(g) {
    var pending = state.games.filter(function (x) { return x.status === 'pendiente'; }).length;
    $('r-body').innerHTML = '<div class="pick">' + coverHtml(g, 'cover') +
      '<div class="info"><h4>' + esc(g.title) + '</h4>' +
      '<p>' + genreTagsHtml(g, t('roulette.noGenre')) + '</p>' +
      '<p>' + esc(t('roulette.pendingCount', { n: pending })) + '</p>' +
      (g.score ? '<p>' + esc(t('roulette.score', { n: g.score })) + '</p>' : '') +
      '</div></div>';
    $('r-start').disabled = false;
  }
  function roll() {
    fillRoulettePlatforms();
    var chosenPlatform = $('r-plat').value;
    var pool = state.games.filter(function (g) {
      return g.status === 'pendiente' && (!chosenPlatform || keyOf('p', g.platform) === chosenPlatform);
    });
    var token = ++rollToken;
    pickId = null;
    $('r-start').disabled = true;
    if (!pool.length) {
      $('r-body').innerHTML = '<p class="empty" style="grid-column:1/-1">' + esc(t('roulette.empty')) + '</p>';
      return;
    }
    $('r-body').innerHTML = '<div class="pick shuffling"><div class="cover" style="' + coverStyle(t('roulette.shuffling')) + '"><span class="ini">?</span></div>' +
      '<div class="info"><h4>' + esc(t('roulette.shuffling')) + '</h4></div></div>';
    var ticks = 0;
    var timer = setInterval(function () {
      if (token !== rollToken) { clearInterval(timer); return; }
      ticks++;
      if (ticks < 7) {
        var preview = pool[Math.floor(Math.random() * pool.length)];
        $('r-body').querySelector('h4').textContent = preview.title;
        return;
      }
      clearInterval(timer);
      var picked = pool[Math.floor(Math.random() * pool.length)];
      pickId = picked.id;
      renderPick(picked);
    }, 65);
  }
  function openRoulette() {
    setOverlay('ov-random', true);
    $('r-plat').value = '';
    roll();
  }
  function closeRoulette() { rollToken++; setOverlay('ov-random', false); }

  /* ---------- recomendaciones: generos favoritos + consolas disponibles, Wikipedia + Wikidata, sin API key ---------- */
  var RECOMMEND_STATUSES = ['completado', 'platino', 'pendiente'];
  var RECOMMEND_CATEGORIES = {
    action: ['Category:Action video games'],
    adventure: ['Category:Adventure games'],
    rpg: ['Category:Role-playing video games', 'Category:Action role-playing video games'],
    platformer: ['Category:Platformers', 'Category:Platform games'],
    shooter: ['Category:Shooter games'],
    strategy: ['Category:Strategy video games'],
    sports: ['Category:Sports video games', 'Category:Association football video games'],
    racing: ['Category:Racing video games'],
    horror: ['Category:Survival horror games', 'Category:Horror video games'],
    puzzle: ['Category:Puzzle video games'],
    indie: ['Category:Indie games'],
    fighting: ['Category:Fighting games'],
    simulation: ['Category:Simulation video games'],
    survival: ['Category:Survival video games', 'Category:Survival games'],
    survival_horror: ['Category:Survival horror video games', 'Category:Survival horror games'],
    action_adventure: ['Category:Action-adventure games', 'Category:Action-adventure video games'],
    action_rpg: ['Category:Action role-playing video games', 'Category:Action role-playing games'],
    tactical_rpg: ['Category:Tactical role-playing video games', 'Category:Strategy role-playing video games'],
    puzzle_platformer: ['Category:Puzzle platformers', 'Category:Puzzle platform video games'],
    sandbox: ['Category:Sandbox games'],
    open_world: ['Category:Open-world video games', 'Category:Open world video games'],
    metroidvania: ['Category:Metroidvania games', 'Category:Metroidvania video games'],
    roguelike: ['Category:Roguelike video games', 'Category:Roguelike games'],
    soulslike: ['Category:Soulslike video games', 'Category:Soulslike games'],
    stealth: ['Category:Stealth video games', 'Category:Stealth games'],
    visual_novel: ['Category:Visual novels', 'Category:Visual novel games'],
    rhythm: ['Category:Rhythm games', 'Category:Music video games'],
    mmo: ['Category:Massively multiplayer online games', 'Category:MMORPGs']
  };
  var RECOMMEND_PLATFORM_CATEGORIES = {
    pcSteam: ['Category:Windows games', 'Category:PC games'],
    pcEmulator: ['Category:Windows games', 'Category:PC games'],
    steamDeck: ['Category:Steam Deck games', 'Category:Windows games'],
    mobile: ['Category:IOS games', 'Category:Android (operating system) games'],
    ps5: ['Category:PlayStation 5 games'],
    ps4: ['Category:PlayStation 4 games'],
    ps4Emulator: ['Category:PlayStation 4 games'],
    ps3: ['Category:PlayStation 3 games'],
    ps3Emulator: ['Category:PlayStation 3 games'],
    ps2: ['Category:PlayStation 2 games'],
    ps1: ['Category:PlayStation (console) games'],
    psp: ['Category:PlayStation Portable games'],
    psVita: ['Category:PlayStation Vita games'],
    switch2: ['Category:Nintendo Switch 2 games'],
    switch: ['Category:Nintendo Switch games'],
    switchEmulator: ['Category:Nintendo Switch games'],
    wiiU: ['Category:Wii U games'],
    wii: ['Category:Wii games'],
    gamecube: ['Category:GameCube games'],
    n64: ['Category:Nintendo 64 games'],
    snes: ['Category:Super Nintendo Entertainment System games'],
    nes: ['Category:Nintendo Entertainment System games'],
    n3ds: ['Category:Nintendo 3DS games'],
    nds: ['Category:Nintendo DS games'],
    gba: ['Category:Game Boy Advance games'],
    gameboy: ['Category:Game Boy games', 'Category:Game Boy Color games'],
    xboxSeries: ['Category:Xbox Series X and Series S games'],
    xboxOne: ['Category:Xbox One games'],
    xbox360: ['Category:Xbox 360 games'],
    genesis: ['Category:Sega Genesis games', 'Category:Mega Drive games'],
    dreamcast: ['Category:Dreamcast games'],
    retroEmulator: ['Category:PlayStation 2 games', 'Category:PlayStation (console) games',
      'Category:Super Nintendo Entertainment System games', 'Category:Nintendo Entertainment System games',
      'Category:Game Boy Advance games', 'Category:Sega Genesis games']
  };
  /* Todos los clientes de PC buscan el mismo catalogo que PC / Steam. */
  PC_RUNTIME_KEYS.forEach(function (k) {
    RECOMMEND_PLATFORM_CATEGORIES[k] = ['Category:Windows games', 'Category:PC games'];
  });
  /* QIDs verificados en Wikidata (entidades de hardware usadas en P400 "platform"). */
  var WIKIDATA_PLATFORM_QIDS = {
    pcSteam: ['Q1406', 'Q1074923'],
    pcEmulator: ['Q1406', 'Q1074923'],
    steamDeck: ['Q107542665'],
    mobile: ['Q48493', 'Q94'],
    ps5: ['Q63184502'],
    ps4: ['Q5014725'],
    ps4Emulator: ['Q5014725'],
    ps3: ['Q10683'],
    ps3Emulator: ['Q10683'],
    ps2: ['Q10680'],
    ps1: ['Q10677'],
    psp: ['Q170325'],
    psVita: ['Q188808'],
    switch2: ['Q122761124'],
    switch: ['Q19610114'],
    switchEmulator: ['Q19610114'],
    wiiU: ['Q56942'],
    wii: ['Q8079'],
    gamecube: ['Q182172'],
    n64: ['Q184839'],
    snes: ['Q183259'],
    nes: ['Q172742'],
    n3ds: ['Q203597'],
    nds: ['Q170323'],
    gba: ['Q188642'],
    gameboy: ['Q186437', 'Q203992'],
    xboxSeries: ['Q98973368', 'Q98973369'],
    xboxOne: ['Q13361286'],
    xbox360: ['Q48263'],
    genesis: ['Q10676'],
    dreamcast: ['Q184198'],
    retroEmulator: ['Q10680', 'Q10677', 'Q170325', 'Q188642', 'Q186437', 'Q203992',
      'Q184839', 'Q183259', 'Q172742', 'Q170323', 'Q203597', 'Q10676', 'Q184198',
      'Q182172', 'Q8079']
  };
  /* Microsoft Windows (Q1406), PC (Q1074923) y Steam Deck (Q107542665):
     mismo criterio P400 que PC / Steam para TODOS los clientes de PC. */
  var PC_PLATFORM_QIDS = ['Q1406', 'Q1074923', 'Q107542665'];
  PC_RUNTIME_KEYS.forEach(function (k) {
    WIKIDATA_PLATFORM_QIDS[k] = PC_PLATFORM_QIDS.slice();
  });

  /* Los generos favoritos salen de completados/platino/pendientes; la nota personal pesa mas. */
  function favoriteGenres() {
    var weights = {};
    state.games.forEach(function (g) {
      if (RECOMMEND_STATUSES.indexOf(g.status) === -1) return;
      var weight = 1 + (g.score ? g.score / 2 : 0);
      genresOf(g).forEach(function (k) { weights[k] = (weights[k] || 0) + weight; });
    });
    return Object.keys(weights).sort(function (a, b) {
      return weights[b] - weights[a] || GENRE_KEYS.indexOf(a) - GENRE_KEYS.indexOf(b);
    }).slice(0, 3);
  }
  function recommendReason() {
    if (!recommendGenres.length) return t('recommend.reasonEmpty');
    var genres = recommendGenres.map(function (k) { return displayValue('g', k); }).join(', ');
    var platforms = recommendPlatforms.map(function (k) { return displayValue('o', k); }).join(', ');
    if (platforms) return t('recommend.reasonOwned', { genres: genres, platforms: platforms });
    return t('recommend.reason', { genres: genres });
  }
  function compatibleOwnedPlatforms(result) {
    var qids = result && result.platformQids ? result.platformQids : [];
    var wanted = recommendPlatforms.length ? recommendPlatforms : OWNED_PLATFORM_KEYS.slice();
    var out = [];
    wanted.forEach(function (k) {
      var allowed = WIKIDATA_PLATFORM_QIDS[k] || [];
      for (var i = 0; i < qids.length; i++) {
        if (allowed.indexOf(qids[i]) !== -1) { out.push(k); return; }
      }
    });
    return out;
  }
  function recommendPlatformCompatible(result) {
    if (!recommendPlatforms.length) return true;
    var qids = result && result.platformQids ? result.platformQids : [];
    if (!qids.length) return true; /* sin datos P400, no descartamos por falta de señal */
    return compatibleOwnedPlatforms(result).length > 0;
  }
  function recommendPlatformLabel(rec) {
    var keys = rec && rec.compatiblePlatforms ? rec.compatiblePlatforms : [];
    if (keys.length) return keys.map(function (k) { return displayValue('o', k); }).join(' / ');
    if (recommendPlatforms.length) return recommendPlatforms.map(function (k) { return displayValue('o', k); }).join(' / ');
    return t('recommend.anyPlatform');
  }
  function inCollection(title) {
    var n = normTitle(title), b = titleBase(title);
    if (!n) return false;
    return state.games.some(function (g) {
      return normTitle(g.title) === n || titleBase(g.title) === n || titleBase(g.title) === b;
    });
  }
  function markSeen(title) {
    var n = normTitle(title);
    if (n) recommendSeen[n] = true;
  }
  function isSeen(title) { return !!recommendSeen[normTitle(title)]; }
  function categoryMembersUrl(cat) {
    return wikiApi('en') +
      '?action=query' +
      '&list=categorymembers' +
      '&cmtitle=' + encodeURIComponent(String(cat).replace(/ /g, '_')) +
      '&cmnamespace=0' +
      '&cmtype=page' +
      '&cmlimit=50' +
      '&format=json' +
      '&origin=*';
  }
  function candidateOk(title) {
    var s = String(title || '').trim();
    if (s.length < 3) return false;
    if (/^(Category|Wikipedia|File|Template|List):/i.test(s)) return false;
    if (/\b(list of|video game series|series|franchise|genre|industry|development of|games developed)\b/i.test(s)) return false;
    var n = normTitle(s);
    if (GENRE_KEYS.some(function (k) { return normTitle(k) === n || normTitle(t('genre.' + k)) === n; })) return false;
    return true;
  }
  function shuffle(list) {
    var out = list.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = out[i]; out[i] = out[j]; out[j] = tmp;
    }
    return out;
  }
  function fetchCandidates(genres, platforms) {
    var cats = [];
    (genres || []).slice(0, 3).forEach(function (k) {
      (RECOMMEND_CATEGORIES[k] || []).forEach(function (c) { if (cats.indexOf(c) === -1) cats.push(c); });
    });
    var hasPlatforms = platforms && platforms.length;
    if (hasPlatforms) {
      (platforms || []).slice(0, 4).forEach(function (k) {
        (RECOMMEND_PLATFORM_CATEGORIES[k] || []).slice(0, 2).forEach(function (c) { if (cats.indexOf(c) === -1) cats.push(c); });
      });
    }
    if (!cats.length) cats = ['Category:Video games'];
    return Promise.all(cats.map(function (cat) {
      return fetchJson(categoryMembersUrl(cat), 10000).then(function (data) {
        var members = data && data.query && data.query.categorymembers ? data.query.categorymembers : [];
        return members.map(function (m) { return m && m.title ? m.title : ''; }).filter(candidateOk);
      }).catch(function () { return []; });
    })).then(function (lists) {
      var out = {}, seen = {};
      lists.forEach(function (list) {
        list.forEach(function (title) {
          var n = normTitle(title);
          if (!n || seen[n]) return;
          seen[n] = true;
          out[n] = title;
        });
      });
      return shuffle(Object.keys(out).map(function (n) { return out[n]; }));
    });
  }
  function showRecommendStatus(text, kind) {
    var el = $('rc-status');
    if (!el) return;
    el.className = 'help autofill-msg' + (kind ? ' is-' + kind : '');
    el.textContent = text || '';
    el.hidden = !text;
  }
  function setRecommendBusy(busy) {
    var again = $('rc-again'), add = $('rc-add');
    if (again) again.disabled = !!busy;
    if (add) add.disabled = !!busy || !recommendCurrent;
  }
  function renderRecommendReason() {
    var el = $('rc-reason');
    if (el) el.textContent = recommendReason();
  }
  function renderRecommendCard(rec) {
    var list = genresOf(rec);
    var genresHtml = list.length
      ? '<div class="rec-tags">' + list.map(function (k) { return '<span class="gtag">' + esc(displayValue('g', k)) + '</span>'; }).join('') + '</div>'
      : esc(t('card.noGenre'));
    $('rc-body').innerHTML = '<div class="pick rec-pick">' +
      coverHtml({ title: rec.title, cover: rec.cover }, 'cover') +
      '<div class="info"><h4>' + esc(rec.title) + '</h4>' +
      '<dl class="facts">' +
        '<div class="fact"><dt>' + esc(t('recommend.genres')) + '</dt><dd>' + genresHtml + '</dd></div>' +
        '<div class="fact"><dt>' + esc(t('recommend.platform')) + '</dt><dd>' + esc(recommendPlatformLabel(rec)) + '</dd></div>' +
        '<div class="fact"><dt>' + esc(t('recommend.developer')) + '</dt><dd>' + esc(rec.developer || t('recommend.unknown')) + '</dd></div>' +
        '<div class="fact"><dt>' + esc(t('recommend.year')) + '</dt><dd>' + esc(rec.releaseDate || t('recommend.unknown')) + '</dd></div>' +
      '</dl>' +
      '<p class="rec-summary">' + esc(rec.summary || t('recommend.noSummary')) + '</p>' +
      '</div></div>';
  }
  function finishRecommendation(result, title, token) {
    if (token !== recommendToken || $('ov-recommend').hidden) return null;
    var rel = splitRelease(result.releaseDate || '');
    var rawGenres = (result.genres && result.genres.length) ? result.genres : (result.genre ? [result.genre] : []);
    var rec = {
      title: String(title).trim(),
      cover: result.cover || '',
      genres: compactGenres(rawGenres),
      releaseDate: rel.releaseDate,
      releaseYear: rel.releaseYear,
      developer: result.developer || '',
      summary: result.summary || '',
      compatiblePlatforms: compatibleOwnedPlatforms(result),
      platformQids: result.platformQids || []
    };
    recommendCurrent = rec;
    markSeen(title);
    renderRecommendCard(rec);
    showRecommendStatus('', '');
    setRecommendBusy(false);
    return rec;
  }
  function tryRecommendCandidate(list, i, token, lang) {
    if (token !== recommendToken) return Promise.resolve(null);
    if (i >= Math.min(list.length, 10)) return Promise.resolve(null);
    var title = list[i];
    if (isSeen(title) || inCollection(title)) return tryRecommendCandidate(list, i + 1, token, lang);
    return collectMetadata(title, lang, false).then(function (result) {
      if (token !== recommendToken) return null;
      var useful = result && (result.cover || result.summary || result.releaseDate || result.developer ||
        (result.genres && result.genres.length));
      if (!useful || inCollection(title)) {
        markSeen(title);
        return tryRecommendCandidate(list, i + 1, token, lang);
      }
      if (!recommendPlatformCompatible(result)) {
        markSeen(title);
        return tryRecommendCandidate(list, i + 1, token, lang);
      }
      if (result.cover) return finishRecommendation(result, title, token);
      return fetchCoverRaw(title).then(function (src) {
        if (src) result.cover = src;
        return finishRecommendation(result, title, token);
      }).catch(function () { return finishRecommendation(result, title, token); });
    }).catch(function () {
      if (token !== recommendToken) return null;
      markSeen(title);
      return tryRecommendCandidate(list, i + 1, token, lang);
    });
  }
  function loadRecommendation(forceTitle) {
    if ($('ov-recommend').hidden) return;
    var token = ++recommendToken;
    var lang = I.lang ? I.lang() : I.current();
    recommendCurrent = null;
    setRecommendBusy(true);
    showRecommendStatus(t('recommend.searching'), 'searching');
    $('rc-body').innerHTML = '<div class="pick shuffling"><div class="cover" style="' + coverStyle(t('recommend.searching')) + '"><span class="ini">?</span></div>' +
      '<div class="info"><h4>' + esc(t('recommend.searching')) + '</h4></div></div>';
    var source = forceTitle
      ? Promise.resolve([forceTitle])
      : fetchCandidates(recommendGenres, recommendPlatforms);
    source.then(function (candidates) {
      if (token !== recommendToken) return null;
      var pool = forceTitle
        ? [forceTitle]
        : candidates.filter(function (title) { return !isSeen(title) && !inCollection(title); });
      if (!pool.length) {
        $('rc-body').innerHTML = '<p class="msg">' + esc(t('recommend.noCandidates')) + '</p>';
        showRecommendStatus(t('recommend.noCandidates'), 'warn');
        setRecommendBusy(false);
        return { noCandidates: true };
      }
      return tryRecommendCandidate(pool, 0, token, lang);
    }).then(function (rec) {
      if (token !== recommendToken || (rec && rec.noCandidates)) return;
      if (!rec) {
        $('rc-body').innerHTML = '<p class="msg">' + esc(t('recommend.error')) + '</p>';
        showRecommendStatus(t('recommend.error'), 'error');
        setRecommendBusy(false);
      }
    }).catch(function () {
      if (token !== recommendToken) return;
      $('rc-body').innerHTML = '<p class="msg">' + esc(t('recommend.error')) + '</p>';
      showRecommendStatus(t('recommend.error'), 'error');
      setRecommendBusy(false);
    });
  }
  function openRecommend() {
    recommendGenres = favoriteGenres();
    recommendPlatforms = ownedConfigured() ? effectiveOwnedKeys() : [];
    recommendCurrent = null;
    setOverlay('ov-recommend', true);
    renderRecommendReason();
    if (!recommendGenres.length) {
      $('rc-body').innerHTML = '<p class="msg">' + esc(t('recommend.reasonEmpty')) + '</p>';
      showRecommendStatus(t('recommend.reasonEmpty'), 'warn');
      setRecommendBusy(false);
      return;
    }
    loadRecommendation();
  }
  function closeRecommend() {
    recommendToken++;
    recommendCurrent = null;
    setOverlay('ov-recommend', false);
  }
  function recommendPlatformForGame(rec) {
    var keys = rec && rec.compatiblePlatforms ? rec.compatiblePlatforms : [];
    if (!keys.length) keys = recommendPlatforms.length ? recommendPlatforms : [];
    if (!keys.length) return '';
    var k = keys[0];
    /* pcSteam conserva el alias historico; los demas launchers guardan su clave. */
    if (k === 'pcSteam') return 'pc';
    if (k === 'retroEmulator') return 'retro';
    return PLATFORM_KEYS.indexOf(k) !== -1 ? k : '';
  }
  function addRecommended() {
    if (!recommendCurrent || inCollection(recommendCurrent.title)) return;
    var rec = recommendCurrent;
    var platform = recommendPlatformForGame(rec);
    var data = {
      title: rec.title,
      platform: platform,
      genres: rec.genres.slice(),
      genre: rec.genres[0] || '',
      releaseDate: rec.releaseDate,
      releaseYear: rec.releaseYear,
      developer: rec.developer,
      summary: rec.summary.slice(0, 300),
      status: 'pendiente',
      hours: 0,
      score: null,
      notes: '',
      cover: rec.cover,
      coverSource: rec.cover ? 'wiki' : ''
    };
    var ng = STORAGE.normalize(data);
    ng.id = uid(); ng.added = Date.now(); ng.updated = Date.now();
    state.games.unshift(ng);
    save(); renderAll(); closeRecommend();
    showFlash(t('recommend.added') + ': ' + rec.title);
  }

  /* ---------- copia de seguridad ---------- */
  function resetBackupButton() {
    var b = $('b-import');
    b.classList.remove('armed');
    b.textContent = t('backup.import');
  }
  function openBackup() {
    $('b-text').value = STORAGE.exportJSON(state.games);
    $('b-msg').textContent = '';
    resetBackupButton();
    setOverlay('ov-backup', true);
  }
  function closeBackup() { setOverlay('ov-backup', false); }

  /* ---------- idioma ---------- */
  function initLanguage() {
    var sel = $('lang-select');
    Array.prototype.forEach.call(sel.options, function (o) {
      var d = I.locales[o.value];
      if (d) o.title = d.name;
    });
    sel.value = I.current();
    sel.addEventListener('change', function () { I.set(this.value); });
    document.addEventListener(I.EVENT, onLanguageChange);
    I.apply(document);
  }
  function onLanguageChange() {
    I.apply(document);
    /* Las sinopsis de ejemplo siguen al idioma activo (los juegos del usuario no se tocan). */
    var examplesChanged = false;
    state.games.forEach(function (g) {
      if (g.example && g.sampleSummaryKey) { g.summary = t(g.sampleSummaryKey); examplesChanged = true; }
    });
    if (examplesChanged) save();
    /* Repinta el datalist con el filtro vigente y sus textos en el nuevo idioma. */
    setPlatformOptions(platformOptions, platformHelpKey, platformShowAll);
    renderGenreChips();
    renderAll();
    if (!$('ov-recommend').hidden) {
      renderRecommendReason();
      if (recommendCurrent) loadRecommendation(recommendCurrent.title);
    }
    if (!$('ov-edit').hidden) {
      $('ed-title').textContent = t(editingId ? 'editor.editTitle' : 'editor.addTitle');
      var currentStatus = $('e-status').value;
      $('e-status').innerHTML = statusOptions();
      $('e-status').value = currentStatus;
      var del = $('e-del');
      del.classList.toggle('armed', delArmed);
      del.textContent = t(delArmed ? 'editor.deleteConfirm' : 'editor.delete');
      coverMsg = '';
      renderCoverPreview();
      setAutofillBusy($('e-autofill').disabled);
    }
    if (!$('ov-random').hidden) roll();
    if (!$('ov-backup').hidden) resetBackupButton();
  }

  /* ---------- eventos ---------- */
  function on(id, event, handler) {
    var el = $(id);
    if (el && typeof el.addEventListener === 'function') el.addEventListener(event, handler);
  }
  function addHour(id) {
    state.games.forEach(function (g) {
      if (g.id === id) { g.hours = Math.max(0, g.hours + 1); g.updated = Date.now(); }
    });
    save(); renderAll();
  }
  function clearFilters() {
    state.f.status = 'todos';
    state.f.plat = ''; state.f.genre = ''; state.f.q = ''; state.f.ownedOnly = false;
    $('q').value = '';
    var own = $('f-owned'); if (own) own.checked = false;
    renderAll();
  }

  function bindEvents() {
  on('btn-add', 'click', function () { openEditor(); });
  on('btn-backup', 'click', openBackup);
  on('btn-random', 'click', openRoulette);
  on('btn-recommend', 'click', openRecommend);
  on('ow-all', 'click', selectAllOwned);
  on('rc-close', 'click', closeRecommend);
  on('rc-again', 'click', function () {
    if (recommendCurrent) markSeen(recommendCurrent.title);
    loadRecommendation();
  });
  on('rc-add', 'click', addRecommended);
  on('e-cancel', 'click', closeEditor);
  on('e-save', 'click', saveEditor);
  on('e-del', 'click', deleteEditorGame);
  on('e-cover-fetch', 'click', searchCover);
  on('e-autofill', 'click', autofillMetadata);
  on('e-plat-show-all', 'click', function () {
    if (gamePlatformKeys && gamePlatformKeys.length) {
      /* Nivel 2: todas las plataformas publicadas por el juego, sin catalogo
         generico ni consolas donde nunca existio. */
      setPlatformOptions(gamePlatformKeys.slice(), 'editor.platformGameAllShown', false);
    } else {
      /* Juego manual: aun no hay datos de disponibilidad, catalogo general. */
      setPlatformOptions(PLATFORM_KEYS.slice(), 'editor.platformAllShown', false);
    }
    $('e-plat').focus();
  });
  on('e-cover-clear', 'click', function () {
    editCover = ''; editCoverSource = ''; coverMsg = '';
    $('e-cover-url').value = '';
    renderCoverPreview();
  });
  on('e-cover-url-apply', 'click', function () {
    var url = $('e-cover-url').value.trim();
    if (!/^https?:\/\/[^\s]+$/i.test(url)) {
      coverMsg = t('editor.coverInvalidUrl');
      renderCoverPreview();
      return;
    }
    editCover = url; editCoverSource = 'url'; coverMsg = '';
    renderCoverPreview();
  });
  on('e-cover-file', 'change', function () {
    var file = this.files && this.files[0];
    if (!file) return;
    compressImageFile(file, function (dataUrl) {
      if (!dataUrl) return;
      editCover = dataUrl; editCoverSource = 'file'; coverMsg = '';
      renderCoverPreview();
    });
  });
  on('e-title', 'input', function () {
    coverMsg = ''; resetAutofillMsg(); renderCoverPreview();
    /* Un titulo distinto invalida la disponibilidad del scraper anterior. */
    resetEditorPlatformOptions();
  });

  on('r-plat', 'change', function () { pickId = null; roll(); });
  on('r-again', 'click', roll);
  on('r-close', 'click', closeRoulette);
  on('r-start', 'click', function () {
    if (!pickId) return;
    state.games.forEach(function (g) { if (g.id === pickId) { g.status = 'jugando'; g.updated = Date.now(); } });
    save(); closeRoulette(); renderAll();
  });

  on('b-close', 'click', closeBackup);
  on('b-copy', 'click', function () {
    var ta = $('b-text');
    function fallback() {
      ta.focus(); ta.select();
      $('b-msg').textContent = t('backup.copyFallback');
    }
    try {
      navigator.clipboard.writeText(ta.value).then(function () {
        $('b-msg').textContent = t('backup.copied');
      }, fallback);
    } catch (e) { fallback(); }
  });
  on('b-export-json', 'click', function () {
    STORAGE.download('gamevault-backup.json', STORAGE.exportJSON(state.games), 'application/json');
    $('b-msg').textContent = t('backup.jsonExported');
  });
  on('b-export-csv', 'click', function () {
    STORAGE.download('gamevault-backup.csv', STORAGE.toCSV(state.games), 'text/csv;charset=utf-8');
    $('b-msg').textContent = t('backup.csvExported');
  });
  on('b-import', 'click', function () {
    var b = $('b-import');
    if (!b.classList.contains('armed')) {
      b.classList.add('armed');
      b.textContent = t('backup.importConfirm');
      return;
    }
    try {
      state.games = STORAGE.importJSON($('b-text').value);
      save(); closeBackup(); renderAll(); autoResolveMissingCovers();
      $('b-msg').textContent = t('backup.imported');
    } catch (e) {
      b.classList.remove('armed');
      b.textContent = t('backup.import');
      $('b-msg').textContent = t('backup.importError');
    }
  });

  on('q', 'input', function () { state.f.q = this.value.trim(); renderAll(); });
  on('f-plat', 'change', function () { state.f.plat = this.value; renderAll(); });
  on('f-genre', 'change', function () { state.f.genre = this.value; renderAll(); });
  on('f-sort', 'change', function () { state.f.sort = this.value; renderAll(); });
  on('f-owned', 'change', function () { state.f.ownedOnly = !!this.checked; renderAll(); });

  document.addEventListener('click', function (e) {
    var el;
    if ((el = closest(e.target, '[data-view]'))) { setView(el.getAttribute('data-view')); return; }
    if ((el = closest(e.target, '[data-st]'))) { state.f.status = el.getAttribute('data-st'); renderAll(); return; }
    if ((el = closest(e.target, '[data-hour]'))) { addHour(el.getAttribute('data-hour')); return; }
    if ((el = closest(e.target, '[data-open]'))) { openEditor(el.getAttribute('data-open')); return; }
    if (closest(e.target, '[data-add]')) { openEditor(); return; }
    if (closest(e.target, '[data-clear]')) { clearFilters(); return; }
    if (closest(e.target, '[data-clear-ex]')) {
      state.games = state.games.filter(function (g) { return !g.example; });
      save(); renderAll(); return;
    }
    if ((el = closest(e.target, '[data-genre-toggle]'))) { toggleGenre(el.getAttribute('data-genre-toggle')); return; }
    if ((el = closest(e.target, '[data-owned-toggle]'))) {
      toggleOwnedKey(el.getAttribute('data-owned-toggle')); return;
    }
    if ((el = closest(e.target, '[data-sc]'))) { editScore = Number(el.getAttribute('data-sc')); buildScores(); return; }
    if ((el = closest(e.target, '[data-addh]'))) {
      var field = $('e-hours');
      field.value = Math.max(0, (parseFloat(field.value) || 0) + Number(el.getAttribute('data-addh')));
      return;
    }
    if (e.target === $('ov-edit')) closeEditor();
    if (e.target === $('ov-random')) closeRoulette();
    if (e.target === $('ov-recommend')) closeRecommend();
    if (e.target === $('ov-backup')) closeBackup();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!$('ov-edit').hidden) closeEditor();
      if (!$('ov-random').hidden) closeRoulette();
      if (!$('ov-recommend').hidden) closeRecommend();
      if (!$('ov-backup').hidden) closeBackup();
      return;
    }
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(tag)) {
      e.preventDefault();
      var q = $('q');
      if (q) q.focus();
    }
  });
  }

  /* ---------- PWA: service worker y purga de cache ---------- */
  function purgeOldCaches() {
    if (!('caches' in window)) return Promise.resolve(false);
    try {
      return caches.keys().then(function (keys) {
        var old = keys.filter(function (key) {
          return /^gamevault-/.test(key) && key !== CACHE_NAME;
        });
        if (!old.length) return false;
        return Promise.all(old.map(function (key) { return caches.delete(key); }))
          .then(function () { return true; });
      }).catch(function () { return false; });
    } catch (e) { return Promise.resolve(false); }
  }
  /* Una sola recarga limpia por version, incluso si el SW toma el control antes. */
  function reloadClean() {
    try {
      if (sessionStorage.getItem(RELOAD_FLAG)) return;
      sessionStorage.setItem(RELOAD_FLAG, '1');
    } catch (e) {}
    window.location.reload();
  }
  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;
    navigator.serviceWorker.addEventListener('controllerchange', reloadClean);
    purgeOldCaches().then(function (purged) {
      /* La query fuerza al navegador a descargar el SW nuevo sin usar su HTTP cache. */
      return navigator.serviceWorker.register('./sw.js?v=1.1.8', { scope: './' })
        .then(function (registration) {
          if (purged) setTimeout(reloadClean, 200);
          return registration.update();
        });
    }).catch(function () {});
  }

  /* ---------- arranque garantizado ---------- */
  window.GVApp = {
    state: state,
    render: render,
    renderAll: renderAll,
    setView: setView,
    applyTranslations: function () {
      try {
        if (I && typeof I.applyTranslations === 'function') I.applyTranslations(document);
        else if (I && typeof I.apply === 'function') I.apply(document);
      } catch (e) {}
    }
  };

  function sampleGames() {
    try {
      if (STORAGE && typeof STORAGE.sample === 'function') return STORAGE.sample();
    } catch (e) {}
    return [];
  }

  function forceHiddenModals() {
    ['ov-edit', 'ov-random', 'ov-recommend', 'ov-backup'].forEach(function (id) { setOverlay(id, false); });
  }

  function boot() {
    forceHiddenModals();
    try { load(); }
    catch (e) {
      storageOk = false;
      state.games = sampleGames();
    }
    /* Traducir SIEMPRE, antes que cualquier otra operacion que pueda fallar. */
    window.GVApp.applyTranslations();
    try { initLanguage(); }
    catch (e) {
      window.GVApp.applyTranslations();
    }
    try { initView(); } catch (e) {}
    try { fillDataLists(); } catch (e) {}
    try { renderGenreChips(); } catch (e) {}
    try { render(); }
    catch (e) {
      /* Ultimo recurso: repintar con los juegos de ejemplo sin depender del estado. */
      if (!state.games.length) state.games = sampleGames();
      try { render(); } catch (e2) {}
    }
    try { bindEvents(); } catch (e) {}
    try { autoResolveMissingCovers(); } catch (e) {}
    try { registerServiceWorker(); } catch (e) {}
  }
  boot();
})();
