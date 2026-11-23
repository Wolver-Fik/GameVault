/* GameVault storage: localStorage, demo data, backup/import helpers. */
(function () {
  var KEY = 'biblioteca-juegos-v1';
  var OWNED_KEY = 'gamevault-owned-platforms-v1';
  var VIEW_KEY = 'gamevault-active-view-v1';
  var storageOk = true;
  var I = window.GVI18N;

  function tr(key, fallback) {
    try {
      return I && typeof I.t === 'function' ? I.t(key) : fallback;
    } catch (e) { return fallback; }
  }
  function uid() { return 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  /* Catálogo canónico de hardware (v1.0.8): cinco familias con sus variantes de
     emulador. App.js consume estas listas para los chips, el filtro, el datalist
     del editor y el recomendador, así que no hay dos fuentes de verdad. */
  /* Todos estos clientes comparten la misma máquina: un PC con Windows. */
  var PC_LAUNCHER_KEYS = ['pcSteam', 'pcEpic', 'pcEa', 'pcBattleNet', 'pcUbisoft',
    'pcGog', 'pcXboxApp', 'pcRiot', 'pcOtherLauncher'];
  var CONSOLE_GROUPS = [
    { id: 'pc', label: 'owned.group.pc', keys: PC_LAUNCHER_KEYS.concat(['pcEmulator', 'steamDeck', 'mobile']) },
    { id: 'playstation', label: 'owned.group.playstation', keys: ['ps5', 'ps4', 'ps4Emulator', 'ps3', 'ps3Emulator', 'ps2', 'ps1', 'psp', 'psVita'] },
    { id: 'nintendoHome', label: 'owned.group.nintendoHome', keys: ['switch2', 'switch', 'switchEmulator', 'wiiU', 'wii', 'gamecube', 'n64', 'snes', 'nes'] },
    { id: 'nintendoPortable', label: 'owned.group.nintendoPortable', keys: ['n3ds', 'nds', 'gba', 'gameboy'] },
    { id: 'xboxRetro', label: 'owned.group.xboxRetro', keys: ['xboxSeries', 'xboxOne', 'xbox360', 'genesis', 'dreamcast', 'retroEmulator'] }
  ];
  var CONSOLE_KEYS = [];
  CONSOLE_GROUPS.forEach(function (group) {
    group.keys.forEach(function (k) { if (CONSOLE_KEYS.indexOf(k) === -1) CONSOLE_KEYS.push(k); });
  });
  /* 'pc' es un alias histórico de pcSteam (se mantiene en buildAliases de app.js);
     'emulator' y 'retro' son las plataformas genéricas de las bibliotecas antiguas.
     Los launchers de PC son claves propias para que cada juego recuerde su cliente. */
  var PLATFORM_KEYS = CONSOLE_KEYS.concat(['emulator', 'retro']);

  /* Catálogo canónico de géneros (v1.2.2). App.js lo consume para los chips del
     editor, el filtro superior, el datalist, el scraper y el recomendador, así
     que no hay dos fuentes de verdad. Los subgéneros híbridos evitan etiquetas
     duplicadas: survival_horror sustituye a survival + horror, etc. 'other' se
     deja al final a propósito: el orden visual se calcula por etiqueta traducida. */
  var GENRE_KEYS = ['action', 'adventure', 'action_adventure', 'rpg', 'action_rpg',
    'tactical_rpg', 'platformer', 'puzzle', 'puzzle_platformer', 'shooter', 'strategy',
    'sports', 'racing', 'horror', 'survival', 'survival_horror', 'indie', 'fighting',
    'simulation', 'sandbox', 'open_world', 'metroidvania', 'roguelike', 'soulslike',
    'stealth', 'visual_novel', 'rhythm', 'mmo', 'beat_em_up', 'hack_and_slash',
    'shoot_em_up', 'point_and_click', 'tower_defense', 'management', 'card_battler',
    'party', 'other'];

  /* Acepta un array de generos o el genre:string de las versiones anteriores. */
  function genreList(value) {
    var out = [];
    function add(v) {
      var s = String(v == null ? '' : v).trim().slice(0, 40);
      if (!s) return;
      for (var i = 0; i < out.length; i++) {
        if (out[i].toLowerCase() === s.toLowerCase()) return;
      }
      out.push(s);
    }
    if (Array.isArray(value)) value.forEach(add);
    else add(value);
    return out.slice(0, 8);
  }

  /* Acepta "2017" o "2022-02-25" y deriva el anio para ordenar/filtrar. */
  function splitRelease(value) {
    var s = String(value || '').trim().slice(0, 30);
    if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(s)) return { releaseDate: s, releaseYear: s.slice(0, 4) };
    var m = /\b(1[5-9]\d{2}|20\d{2}|21\d{2})\b/.exec(s);
    return { releaseDate: s, releaseYear: m ? m[1] : '' };
  }

  function normalize(g) {
    var rel = splitRelease(g.releaseDate || g.releaseYear || '');
    var genres = genreList(g.genres);
    if (!genres.length) genres = genreList(g.genre);
    return {
      id: g.id || uid(),
      title: String(g.title || '').trim().slice(0, 120) || tr('game.untitled', 'Untitled'),
      platform: String(g.platform || '').trim().slice(0, 40),
      /* genres es la fuente de verdad; genre se conserva por retrocompatibilidad. */
      genres: genres,
      genre: genres[0] || '',
      releaseDate: rel.releaseDate,
      releaseYear: rel.releaseYear,
      developer: String(g.developer || '').trim().slice(0, 80),
      summary: String(g.summary || '').trim().slice(0, 300),
      sampleSummaryKey: typeof g.sampleSummaryKey === 'string' ? g.sampleSummaryKey.slice(0, 40) : '',
      status: ['jugando', 'pendiente', 'completado', 'platino', 'abandonado'].indexOf(g.status) >= 0 ? g.status : 'pendiente',
      hours: Math.max(0, Number(g.hours) || 0),
      score: (g.score >= 1 && g.score <= 10) ? Math.round(g.score) : null,
      notes: String(g.notes || '').slice(0, 600),
      cover: typeof g.cover === 'string' ? g.cover.slice(0, 500000) : '',
      coverSource: typeof g.coverSource === 'string' ? g.coverSource.slice(0, 40) : '',
      added: Number(g.added) || Date.now(),
      updated: Number(g.updated) || Date.now(),
      /* Los juegos guardados antes de esta version simplemente reciben campos vacios. */
      example: !!g.example
    };
  }

  function save(games) {
    try { localStorage.setItem(KEY, JSON.stringify(games)); storageOk = true; }
    catch (e) { storageOk = false; }
    return storageOk;
  }

  function load() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { storageOk = false; }
    if (raw) {
      try {
        var arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          var games = [];
          arr.forEach(function (item) {
            try { games.push(normalize(item)); } catch (e) { /* descarta entradas corruptas */ }
          });
          if (games.length) return { games: games, storageOk: storageOk, seeded: false };
        }
      } catch (e) {}
    }
    var seeded = sample();
    save(seeded);
    return { games: seeded, storageOk: storageOk, seeded: true };
  }

  function sample() {
    var now = Date.now();
    function g(i, t, p, ge, s, h, sc, n, rel, dev, sumKey) {
      return normalize({
        id: uid(), title: t, platform: p,
        genres: Array.isArray(ge) ? ge : [ge], genre: Array.isArray(ge) ? ge[0] : ge,
        status: s, hours: h, score: sc,
        notes: n || '', releaseDate: rel || '', developer: dev || '',
        summary: sumKey ? tr(sumKey, '') : '', sampleSummaryKey: sumKey || '',
        added: now - i * 86400000, updated: now - i * 86400000,
        example: true, cover: '', coverSource: ''
      });
    }
    return [
      g(1, 'Hollow Knight', 'pc', ['metroidvania', 'platformer', 'action'], 'jugando', 18.5, null, tr('sample.note1', ''), '2017', 'Team Cherry', 'sample.summary1'),
      g(2, 'Elden Ring', 'ps5', ['soulslike', 'rpg', 'open_world'], 'completado', 96, 10, '', '2022-02-25', 'FromSoftware', 'sample.summary2'),
      g(3, 'Hades', 'switch', ['roguelike', 'action'], 'platino', 61, 9, '', '2020-09-17', 'Supergiant Games', 'sample.summary3'),
      g(4, 'Disco Elysium', 'pc', ['rpg', 'adventure'], 'pendiente', 0, null, tr('sample.note2', ''), '2019-10-15', 'ZA/UM', 'sample.summary4'),
      g(5, 'Persona 5 Royal', 'ps4', ['rpg'], 'abandonado', 34, 7, tr('sample.note5', ''), '2019-10-31', 'Atlus', 'sample.summary5'),
      g(6, 'Metroid Fusion', 'gba', ['adventure', 'action'], 'pendiente', 0, null, tr('sample.note6', ''), '2002-11-18', 'Nintendo EPD', 'sample.summary6'),
      g(7, 'Stardew Valley', 'pc', ['simulation', 'indie'], 'completado', 72, 9, '', '2016-02-26', 'ConcernedApe', 'sample.summary7'),
      g(8, 'Final Fantasy VII', 'retro', ['rpg', 'adventure'], 'pendiente', 3, null, '', '1997-01-31', 'Square', 'sample.summary8')
    ];
  }

  function exportJSON(games) {
    return JSON.stringify(games, null, 1);
  }

  function importJSON(text) {
    var arr = JSON.parse(text);
    if (!Array.isArray(arr)) throw new Error('formato');
    return arr.map(normalize);
  }

  function toCSV(games) {
    var cols = ['id', 'title', 'platform', 'genres', 'genre', 'releaseDate', 'releaseYear', 'developer', 'summary', 'status', 'hours', 'score', 'notes', 'cover', 'added', 'updated'];
    function cell(v) {
      if (Array.isArray(v)) v = v.join('|');
      var s = v == null ? '' : String(v);
      if (/[",\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
      return s;
    }
    var lines = [cols.join(',')];
    games.forEach(function (g) { lines.push(cols.map(function (c) { return cell(g[c]); }).join(',')); });
    return lines.join('\n');
  }

  function download(filename, content, type) {
    var blob = new Blob([content], { type: type });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }

  /* Plataformas/dispositivos del usuario. null = aun no configuro (se asumen todas). */
  function loadOwnedPlatforms() {
    try {
      var raw = localStorage.getItem(OWNED_KEY);
      if (raw == null) return null;
      var arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return null;
      var out = [];
      arr.forEach(function (v) {
        var s = String(v == null ? '' : v).trim().slice(0, 60);
        if (s && out.indexOf(s) === -1) out.push(s);
      });
      return out;
    } catch (e) { return null; }
  }
  function saveOwnedPlatforms(list) {
    try {
      if (list === null) localStorage.removeItem(OWNED_KEY);
      else localStorage.setItem(OWNED_KEY, JSON.stringify(Array.isArray(list) ? list : []));
      storageOk = true;
    } catch (e) { storageOk = false; }
    return storageOk;
  }
  function isOwnedConfigured() { return loadOwnedPlatforms() !== null; }

  /* Agrupa la biblioteca por plataforma/consola para la vista "Mis Consolas".
     Las funciones passed por app.js resuelven claves y etiquetas traducidas. */
  function groupGamesByPlatform(games, keyOfPlatform, labelOfPlatform) {
    var map = {};
    var order = [];
    (Array.isArray(games) ? games : []).forEach(function (g) {
      var key = '';
      try { key = keyOfPlatform ? keyOfPlatform(g.platform) : String(g.platform || ''); }
      catch (e) { key = String(g.platform || ''); }
      key = String(key || '');
      var label = '';
      try { label = labelOfPlatform ? labelOfPlatform(key) : key; }
      catch (e) { label = key; }
      if (!map[key]) {
        map[key] = {
          key: key,
          label: label || key || tr('card.noPlatform', 'No platform'),
          games: [],
          hours: 0
        };
        order.push(key);
      }
      map[key].games.push(g);
      map[key].hours += Math.max(0, Number(g.hours) || 0);
    });
    return order.map(function (k) { return map[k]; }).sort(function (a, b) {
      return b.games.length - a.games.length || b.hours - a.hours ||
        String(a.label).localeCompare(String(b.label));
    });
  }

  window.GVStorage = {
    KEY: KEY,
    OWNED_KEY: OWNED_KEY,
    VIEW_KEY: VIEW_KEY,
    CONSOLE_GROUPS: CONSOLE_GROUPS,
    CONSOLE_KEYS: CONSOLE_KEYS,
    PC_LAUNCHER_KEYS: PC_LAUNCHER_KEYS,
    PLATFORM_KEYS: PLATFORM_KEYS,
    GENRE_KEYS: GENRE_KEYS,
    uid: uid,
    splitRelease: splitRelease,
    genreList: genreList,
    normalize: normalize,
    save: save,
    load: load,
    sample: sample,
    exportJSON: exportJSON,
    importJSON: importJSON,
    toCSV: toCSV,
    download: download,
    loadOwnedPlatforms: loadOwnedPlatforms,
    saveOwnedPlatforms: saveOwnedPlatforms,
    isOwnedConfigured: isOwnedConfigured,
    groupGamesByPlatform: groupGamesByPlatform,
    getStorageOk: function () { return storageOk; },
    setStorageOk: function (v) { storageOk = !!v; }
  };
})();
