/* GameVault storage: localStorage, demo data, backup/import helpers. */
(function () {
  var KEY = 'biblioteca-juegos-v1';
  var OWNED_KEY = 'gamevault-owned-platforms-v1';
  var VIEW_KEY = 'gamevault-active-view-v1';
  var COLLECTIONS_KEY = 'gamevault-collections-v1';

  /* ---------- Capa IndexedDB (Etapa 1) ----------
     Espejo de todas las claves de la app en IndexedDB y store 'files' para
     caratulas/imagenes grandes, sin el limite de 5 MB de localStorage. */
  var DB_NAME = 'gamevault_db';
  var DB_VERSION = 1;
  var SCHEMA_VERSION = 2;
  var STORE_STATE = 'state';
  var STORE_FILES = 'files';
  var STATE_KEY = 'main';
  var MIRROR_KEYS = [KEY, OWNED_KEY, VIEW_KEY, COLLECTIONS_KEY, 'gamevault-lang'];
  var dbPromise = null, idbReady = false, idbFailed = false;
  var initPromise = null, writeChain = Promise.resolve(), memoryBackup = null;

  function idbOpen() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      if (!('indexedDB' in window)) { reject(new Error('IndexedDB no disponible')); return; }
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(STORE_STATE)) db.createObjectStore(STORE_STATE);
        if (!db.objectStoreNames.contains(STORE_FILES)) db.createObjectStore(STORE_FILES, { keyPath: 'id' });
      };
      req.onsuccess = function () { idbReady = true; resolve(req.result); };
      req.onerror = function () { idbFailed = true; reject(req.error || new Error('No se pudo abrir IndexedDB')); };
      req.onblocked = function () { idbFailed = true; reject(new Error('IndexedDB bloqueada')); };
    });
    return dbPromise;
  }
  function idbRequest(db, store, mode, run) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(store, mode), os = tx.objectStore(store), result;
      try { result = run(os); } catch (e) { reject(e); return; }
      tx.oncomplete = function () { resolve(result && result.result !== undefined ? result.result : undefined); };
      tx.onerror = function () { reject(tx.error || new Error('Error de IndexedDB')); };
      tx.onabort = function () { reject(tx.error || new Error('Transaccion abortada')); };
    });
  }
  function idbGet(store, key) {
    return idbOpen().then(function (db) { return idbRequest(db, store, 'readonly', function (os) { return os.get(key); }) });
  }
  function idbGetAll(store) {
    return idbOpen().then(function (db) { return idbRequest(db, store, 'readonly', function (os) { return os.getAll(); }) });
  }
  function idbPut(store, key, value) {
    return idbOpen().then(function (db) {
      return idbRequest(db, store, 'readwrite', function (os) { return key === undefined ? os.put(value) : os.put(value, key) });
    });
  }
  function idbDelete(store, key) {
    return idbOpen().then(function (db) { return idbRequest(db, store, 'readwrite', function (os) { return os.delete(key); }) });
  }
  function dumpLocal() {
    var dump = {};
    try { MIRROR_KEYS.forEach(function (k) { var v = localStorage.getItem(k); if (v !== null) dump[k] = v; }); } catch (e) {}
    return dump;
  }
  function restoreLocal(dump) {
    try {
      MIRROR_KEYS.forEach(function (k) {
        if (Object.prototype.hasOwnProperty.call(dump, k)) localStorage.setItem(k, dump[k]);
        else localStorage.removeItem(k);
      });
    } catch (e) {}
  }
  function writeIDB(dump) {
    writeChain = writeChain.then(function () {
      return idbPut(STORE_STATE, STATE_KEY, {
        schemaVersion: SCHEMA_VERSION, app: 'gamevault', localStorage: dump,
        updatedAt: new Date().toISOString()
      });
    }).catch(function () { idbFailed = true; });
    return writeChain;
  }
  function initIDB() {
    if (initPromise) return initPromise;
    initPromise = idbOpen().then(function () { return idbGet(STORE_STATE, STATE_KEY); })
      .then(function (rec) {
        var local = dumpLocal();
        if (!rec) { writeIDB(local); return; }
        var remote = (rec.localStorage && typeof rec.localStorage === 'object') ? rec.localStorage : {};
        var merged = {}, k;
        for (k in remote) if (Object.prototype.hasOwnProperty.call(remote, k)) merged[k] = remote[k];
        for (k in local) if (Object.prototype.hasOwnProperty.call(local, k)) merged[k] = local[k];
        restoreLocal(merged);
        writeIDB(merged);
      }).catch(function () { idbFailed = true; });
    return initPromise;
  }
  function whenReady() { return initIDB(); }
  function putFile(id, data, meta) {
    var rec = {
      id: String(id), data: data, type: (meta && meta.type) || '', name: (meta && meta.name) || '',
      size: typeof data === 'string' ? data.length : ((data && data.size) || 0),
      schemaVersion: SCHEMA_VERSION, createdAt: new Date().toISOString()
    };
    return idbPut(STORE_FILES, undefined, rec);
  }
  function getFile(id) { return idbGet(STORE_FILES, String(id)); }
  function listFiles() { return idbGetAll(STORE_FILES); }
  function deleteFile(id) { return idbDelete(STORE_FILES, String(id)); }

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

  /* ---------- sesiones de juego, logros y colecciones (v1.3.0) ----------
     Todo se guarda dentro del propio juego (sesiones/logros/ids de coleccion)
     o en una clave propia (definiciones de coleccion), sin servidores. */
  function validDate(value) {
    var s = String(value || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return '';
    var d = new Date(s + 'T00:00:00Z');
    return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s ? s : '';
  }
  function normMinutes(value) {
    var n = Math.round(Number(value) || 0);
    return n > 0 ? Math.min(n, 100000) : 0;
  }
  function normalizeSession(s) {
    if (!s || typeof s !== 'object') return null;
    var date = validDate(s.date);
    var minutes = normMinutes(s.minutes != null ? s.minutes : ((Number(s.hours) || 0) * 60));
    if (!date || !minutes) return null;
    return {
      id: String(s.id || uid()).slice(0, 40),
      date: date,
      minutes: minutes,
      note: String(s.note || '').slice(0, 160)
    };
  }
  function normalizeSessions(value) {
    var out = [];
    if (!Array.isArray(value)) return out;
    value.forEach(function (s) {
      var one = normalizeSession(s);
      if (one && out.length < 500) out.push(one);
    });
    return out;
  }
  function normalizeAchievements(value) {
    var total = Math.max(0, Math.round(Number(value && value.total) || 0));
    var unlocked = Math.max(0, Math.round(Number(value && value.unlocked) || 0));
    total = Math.min(total, 100000);
    return { unlocked: Math.min(unlocked, total), total: total };
  }
  /* Sincronización directa: "Platino 100%" implica todos los trofeos abiertos.
     Se aplica al normalizar (carga, importación y ejemplos) para que ningún juego
     pueda quedar en platino con unlocked < total. La dirección inversa se hace
     en la ficha, para no reclasificar juegos completados al abrir la app. */
  function syncPlatinumAchievements(ach, status) {
    if (status === 'platino' && ach.total > 0) ach.unlocked = ach.total;
    return ach;
  }
  /* Totales canónicos de los juegos de ejemplo. Fuente única para el generador
     del Modo Demo y para migrate(): la demo guardada se repara sin borrar
     localStorage y sin tener las cifras duplicadas en dos sitios. */
  var DEMO_TROPHIES = [
    { title: 'Hollow Knight', total: 63, unlocked: 32 },
    { title: 'Elden Ring', total: 42, unlocked: 42 },
    { title: 'Hades', total: 49, unlocked: 49 },
    { title: 'Disco Elysium', total: 45, unlocked: 0 },
    { title: 'Persona 5 Royal', total: 53, unlocked: 0 },
    { title: 'Stardew Valley', total: 49, unlocked: 49 }
  ];
  function demoTrophies(title) {
    var key = String(title || '').trim().toLowerCase();
    for (var i = 0; i < DEMO_TROPHIES.length; i++) {
      if (DEMO_TROPHIES[i].title.toLowerCase() === key) return DEMO_TROPHIES[i];
    }
    return null;
  }
  function demoAchievements(title) {
    var d = demoTrophies(title);
    return d ? { unlocked: d.unlocked, total: d.total } : { unlocked: 0, total: 0 };
  }
  /* Repara los juegos de ejemplo guardados antes de que existieran los trofeos
     (0 / 0). Solo rellena datos vacíos: nunca pisa cifras que el usuario editó. */
  function migrate(games) {
    var changed = false;
    (Array.isArray(games) ? games : []).forEach(function (g) {
      if (!g || !g.achievements) return;
      var d = demoTrophies(g.title);
      if (!d) return;
      var a = g.achievements;
      if (Number(a.total) === 0 && Number(a.unlocked) === 0) {
        a.total = d.total;
        a.unlocked = d.unlocked;
        changed = true;
      }
      /* Un "Platino 100%" nunca queda con desbloqueados por debajo del total. */
      if (g.status === 'platino' && a.total > 0 && a.unlocked !== a.total) {
        a.unlocked = a.total;
        changed = true;
      }
    });
    return changed;
  }
  function normalizeCollectionIds(value) {
    var out = [];
    if (!Array.isArray(value)) return out;
    value.forEach(function (v) {
      var s = String(v == null ? '' : v).trim().slice(0, 60);
      if (s && out.indexOf(s) === -1) out.push(s);
    });
    return out.slice(0, 50);
  }
  function normalizeCollection(c) {
    return {
      id: String(c && c.id || uid()).slice(0, 60),
      name: String(c && c.name || '').trim().slice(0, 40)
    };
  }

  function normalize(g) {
    var rel = splitRelease(g.releaseDate || g.releaseYear || '');
    var genres = genreList(g.genres);
    if (!genres.length) genres = genreList(g.genre);
    var status = ['jugando', 'pendiente', 'completado', 'platino', 'abandonado'].indexOf(g.status) >= 0 ? g.status : 'pendiente';
    var ach = syncPlatinumAchievements(normalizeAchievements(g.achievements || {
      unlocked: g.achUnlocked, total: g.achTotal
    }), status);
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
      status: status,
      hours: Math.max(0, Number(g.hours) || 0),
      score: (g.score >= 1 && g.score <= 10) ? Math.round(g.score) : null,
      notes: String(g.notes || '').slice(0, 600),
      cover: typeof g.cover === 'string' ? g.cover.slice(0, 500000) : '',
      coverSource: typeof g.coverSource === 'string' ? g.coverSource.slice(0, 40) : '',
      added: Number(g.added) || Date.now(),
      updated: Number(g.updated) || Date.now(),
      /* v1.3.0: horas jugadas = horas base + sesiones registradas. `hours` sigue
         siendo el total visible; las sesiones se suman al guardar cada una. */
      sessions: normalizeSessions(g.sessions),
      achievements: ach,
      collections: normalizeCollectionIds(g.collections),
      completedAt: validDate(g.completedAt),
      /* Los juegos guardados antes de esta version simplemente reciben campos vacios. */
      example: !!g.example
    };
  }

  function save(games) {
    try { localStorage.setItem(KEY, JSON.stringify(games)); storageOk = true; }
    catch (e) { storageOk = false; }
    writeIDB(dumpLocal());
    return storageOk;
  }

  function load() {
    /* Migracion automatica localStorage -> IndexedDB. */
    initIDB();
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
          if (games.length) {
            /* Migración en sitio: rellena los trofeos de la demo ya guardada. */
            if (migrate(games)) save(games);
            return { games: games, storageOk: storageOk, seeded: false };
          }
        }
      } catch (e) {}
    }
    /* La demo NO se persiste aqui: si IndexedDB conserva una biblioteca real
       y localStorage estaba vacio, escribirla ahora haria ganar a la demo en
       la migracion. app.js la guarda solo cuando whenReady confirma que no
       habia datos. */
    return { games: sample(), storageOk: storageOk, seeded: true };
  }

  function sample() {
    var now = Date.now();
    var year = new Date(now).getFullYear();
    function iso(y, m, d) {
      return y + '-' + ('0' + m).slice(-2) + '-' + ('0' + d).slice(-2);
    }
    function sess(y, m, d, minutes, note) {
      return { id: uid(), date: iso(y, m, d), minutes: minutes, note: note || '' };
    }
    function g(i, t, p, ge, s, h, sc, n, rel, dev, sumKey, extra) {
      var x = extra || {};
      var done = s === 'completado' || s === 'platino';
      return normalize({
        id: uid(), title: t, platform: p,
        genres: Array.isArray(ge) ? ge : [ge], genre: Array.isArray(ge) ? ge[0] : ge,
        status: s, hours: h, score: sc,
        notes: n || '', releaseDate: rel || '', developer: dev || '',
        summary: sumKey ? tr(sumKey, '') : '', sampleSummaryKey: sumKey || '',
        added: now - i * 86400000, updated: now - i * 86400000,
        sessions: x.sessions || [],
        achievements: x.achievements || demoAchievements(t),
        completedAt: done ? iso(year - (i % 2 ? 1 : 0), 3 + (i % 8), 12) : '',
        example: true, cover: '', coverSource: ''
      });
    }
    return [
      g(1, 'Hollow Knight', 'pc', ['metroidvania', 'platformer', 'action'], 'jugando', 18.5, null, tr('sample.note1', ''), '2017', 'Team Cherry', 'sample.summary1', {
        sessions: [sess(year, 2, 14, 150, ''), sess(year - 1, 11, 3, 90, '')]
      }),
      g(2, 'Elden Ring', 'ps5', ['soulslike', 'rpg', 'open_world'], 'completado', 96, 10, '', '2022-02-25', 'FromSoftware', 'sample.summary2', {
        sessions: [sess(year - 1, 6, 12, 240, '')]
      }),
      g(3, 'Hades', 'switch', ['roguelike', 'action'], 'platino', 61, 9, '', '2020-09-17', 'Supergiant Games', 'sample.summary3', {
        sessions: [sess(year, 3, 8, 120, '')]
      }),
      g(4, 'Disco Elysium', 'pc', ['rpg', 'adventure'], 'pendiente', 0, null, tr('sample.note2', ''), '2019-10-15', 'ZA/UM', 'sample.summary4'),
      g(5, 'Persona 5 Royal', 'ps4', ['rpg'], 'abandonado', 34, 7, tr('sample.note5', ''), '2019-10-31', 'Atlus', 'sample.summary5'),
      g(6, 'Metroid Fusion', 'gba', ['adventure', 'action'], 'pendiente', 0, null, tr('sample.note6', ''), '2002-11-18', 'Nintendo EPD', 'sample.summary6'),
      g(7, 'Stardew Valley', 'pc', ['simulation', 'indie'], 'completado', 72, 9, '', '2016-02-26', 'ConcernedApe', 'sample.summary7'),
      g(8, 'Final Fantasy VII', 'retro', ['rpg', 'adventure'], 'pendiente', 3, null, '', '1997-01-31', 'Square', 'sample.summary8')
    ];
  }

  /* El sobre JSON conserva las colecciones; se aceptan backups planos (v1.2.x). */
  function exportJSON(games, collections) {
    return JSON.stringify({
      app: 'GameVault', schemaVersion: SCHEMA_VERSION, version: 2,
      exportedAt: new Date().toISOString(),
      games: games,
      collections: Array.isArray(collections) ? collections : []
    }, null, 1);
  }

  /* Validacion de origen/estructura antes de reemplazar la biblioteca. */
  function validateBackup(data) {
    if (data === null || data === undefined) return { ok: false, msgText: 'El archivo no contiene un respaldo válido.' };
    if (!Array.isArray(data) && (typeof data !== 'object' || Array.isArray(data))) {
      return { ok: false, msgText: 'El archivo no contiene un respaldo válido.' };
    }
    var envelope = !Array.isArray(data);
    if (envelope && data.app && String(data.app).toLowerCase() !== 'gamevault') {
      return { ok: false, msgText: 'Este respaldo pertenece a otra aplicación y no se importará.' };
    }
    if (envelope) {
      var sv = data.schemaVersion == null ? (typeof data.version === 'number' ? data.version : 1) : Number(data.schemaVersion);
      if (!isFinite(sv) || sv < 1 || sv > SCHEMA_VERSION) {
        return { ok: false, msgText: 'La versión de esquema del respaldo no es compatible.' };
      }
    }
    var arr = Array.isArray(data) ? data : data.games;
    if (!Array.isArray(arr)) return { ok: false, msgText: 'El respaldo está dañado: no contiene juegos válidos.' };
    /* Los backups planos (v1.2.x) no llevan marca de app: exige al menos un
       juego reconocible para no reemplazar la biblioteca con un JSON ajeno. */
    if (Array.isArray(data) && arr.length && !arr.some(function (g) {
      return g && typeof g === 'object' && (g.title || g.platform || g.name);
    })) return { ok: false, msgText: 'El respaldo no contiene juegos reconocibles de GameVault.' };
    if (envelope && data.collections !== undefined && !Array.isArray(data.collections)) {
      return { ok: false, msgText: 'El respaldo está incompleto: las colecciones no son válidas.' };
    }
    return { ok: true, version: envelope ? (data.schemaVersion || 1) : 1 };
  }

  function clearMemoryBackup() { memoryBackup = null; }
  function restoreMemoryBackup() {
    if (!memoryBackup) return false;
    restoreLocal(memoryBackup);
    writeIDB(memoryBackup);
    memoryBackup = null;
    return true;
  }

  function importJSON(text) {
    var data = JSON.parse(text);
    /* Copia de seguridad en memoria del estado actual antes de importar. */
    memoryBackup = dumpLocal();
    var check = validateBackup(data);
    if (!check.ok) { var err = new Error(check.msgText); err.msgText = check.msgText; throw err; }
    var arr = Array.isArray(data) ? data : (data && data.games);
    if (!Array.isArray(arr)) throw new Error('formato');
    var cols = Array.isArray(data.collections) ? data.collections.map(normalizeCollection) : [];
    /* En backups planos las colecciones se reconstruyen desde los juegos. */
    if (!cols.length) {
      var names = {};
      arr.forEach(function (g) {
        normalizeCollectionIds(g && g.collections).forEach(function (id) {
          if (!names[id]) names[id] = normalizeCollection({ id: id, name: id });
        });
      });
      Object.keys(names).forEach(function (k) { cols.push(names[k]); });
    }
    /* Se mantiene hasta que app.js termina de aplicar la importacion. */
    return { games: arr.map(normalize), collections: cols };
  }

  /* CSV con una fila por juego: las sesiones viajan como JSON en su celda y las
     colecciones como nombres separados por "|" (portables entre dispositivos). */
  var CSV_COLS = ['id', 'title', 'platform', 'genres', 'genre', 'releaseDate', 'releaseYear',
    'developer', 'summary', 'status', 'hours', 'score', 'notes', 'cover', 'added', 'updated',
    'sessions', 'achUnlocked', 'achTotal', 'collections', 'completedAt'];

  function csvCell(v) {
    var s = v == null ? '' : String(v);
    if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  }
  function toCSV(games, collections) {
    var names = {};
    (Array.isArray(collections) ? collections : []).forEach(function (c) { names[c.id] = c.name; });
    var lines = [CSV_COLS.join(',')];
    games.forEach(function (g) {
      lines.push(CSV_COLS.map(function (c) {
        if (c === 'genres') return csvCell((g.genres || []).join('|'));
        if (c === 'sessions') return csvCell(JSON.stringify(g.sessions || []));
        if (c === 'achUnlocked') return csvCell(g.achievements ? g.achievements.unlocked : 0);
        if (c === 'achTotal') return csvCell(g.achievements ? g.achievements.total : 0);
        if (c === 'collections') return csvCell((g.collections || []).map(function (id) {
          return names[id] || id;
        }).join('|'));
        if (c === 'completedAt') return csvCell(g.completedAt || '');
        return csvCell(g[c]);
      }).join(','));
    });
    return '\ufeff' + lines.join('\r\n');
  }

  /* Parser CSV minimalista pero con comillas dobles, saltos de linea y BOM. */
  function parseCSV(text) {
    var s = String(text || '').replace(/^\ufeff/, '');
    var rows = [], row = [], field = '', quoted = false;
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      if (quoted) {
        if (ch === '"') {
          if (s.charAt(i + 1) === '"') { field += '"'; i++; }
          else quoted = false;
        } else field += ch;
      } else if (ch === '"') quoted = true;
      else if (ch === ',') { row.push(field); field = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && s.charAt(i + 1) === '\n') i++;
        row.push(field); rows.push(row); row = []; field = '';
      } else field += ch;
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (v) { return String(v).trim(); }); });
  }

  function importCSV(text) {
    var rows = parseCSV(text);
    if (rows.length < 2) throw new Error('formato');
    var head = rows[0].map(function (h) { return h.trim(); });
    if (head.indexOf('title') === -1) throw new Error('formato');
    var collections = [];
    function collectionId(name) {
      var n = String(name || '').trim().slice(0, 40);
      if (!n) return '';
      for (var i = 0; i < collections.length; i++) {
        if (collections[i].name.toLowerCase() === n.toLowerCase()) return collections[i].id;
      }
      var c = normalizeCollection({ name: n });
      collections.push(c);
      return c.id;
    }
    var games = rows.slice(1).map(function (r) {
      var g = {};
      head.forEach(function (h, i) { g[h] = r[i] == null ? '' : r[i]; });
      var sessions = [];
      try { sessions = JSON.parse(g.sessions || '[]'); } catch (e) { sessions = []; }
      return normalize({
        id: g.id, title: g.title, platform: g.platform, genres: (g.genres || '').split('|'),
        releaseDate: g.releaseDate, developer: g.developer, summary: g.summary,
        status: g.status, hours: g.hours, score: g.score, notes: g.notes, cover: g.cover,
        added: g.added, updated: g.updated, sessions: sessions,
        achievements: { unlocked: g.achUnlocked, total: g.achTotal },
        collections: String(g.collections || '').split('|').map(collectionId).filter(Boolean),
        completedAt: g.completedAt
      });
    });
    return { games: games, collections: collections };
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
    writeIDB(dumpLocal());
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

  /* Colecciones personalizadas: solo guardamos id + nombre; la pertenencia vive
     en game.collections para que no haya dos fuentes de verdad. */
  function loadCollections() {
    try {
      var raw = localStorage.getItem(COLLECTIONS_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      var out = [], seen = {};
      arr.forEach(function (c) {
        var one = normalizeCollection(c);
        var key = one.name.toLowerCase();
        if (one.name && !seen[key]) { seen[key] = true; out.push(one); }
      });
      return out.slice(0, 40);
    } catch (e) { return []; }
  }
  function saveCollections(list) {
    try {
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(Array.isArray(list) ? list.map(normalizeCollection) : []));
      storageOk = true;
    } catch (e) { storageOk = false; }
    writeIDB(dumpLocal());
    return storageOk;
  }
  /* Reinicio completo: borra juegos/sesiones/logros/colecciones/consolas/vista. */
  function resetAll() {
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem(OWNED_KEY);
      localStorage.removeItem(VIEW_KEY);
      localStorage.removeItem(COLLECTIONS_KEY);
    } catch (e) {}
    var seeded = sample();
    save(seeded);
    saveCollections([]);
    return { games: seeded, collections: [] };
  }

  window.GVStorage = {
    KEY: KEY,
    OWNED_KEY: OWNED_KEY,
    VIEW_KEY: VIEW_KEY,
    COLLECTIONS_KEY: COLLECTIONS_KEY,
    CONSOLE_GROUPS: CONSOLE_GROUPS,
    CONSOLE_KEYS: CONSOLE_KEYS,
    PC_LAUNCHER_KEYS: PC_LAUNCHER_KEYS,
    PLATFORM_KEYS: PLATFORM_KEYS,
    GENRE_KEYS: GENRE_KEYS,
    uid: uid,
    splitRelease: splitRelease,
    genreList: genreList,
    normalize: normalize,
    migrate: migrate,
    save: save,
    load: load,
    sample: sample,
    exportJSON: exportJSON,
    importJSON: importJSON,
    validateBackup: validateBackup,
    restoreMemoryBackup: restoreMemoryBackup,
    clearMemoryBackup: clearMemoryBackup,
    importCSV: importCSV,
    toCSV: toCSV,
    download: download,
    loadCollections: loadCollections,
    saveCollections: saveCollections,
    resetAll: resetAll,
    normalizeSession: normalizeSession,
    syncPlatinumAchievements: syncPlatinumAchievements,
    validDate: validDate,
    loadOwnedPlatforms: loadOwnedPlatforms,
    saveOwnedPlatforms: saveOwnedPlatforms,
    isOwnedConfigured: isOwnedConfigured,
    groupGamesByPlatform: groupGamesByPlatform,
    getStorageOk: function () { return storageOk; },
    setStorageOk: function (v) { storageOk = !!v; },
    /* Etapa 1: almacenamiento durable y sin limite de 5 MB */
    DB_NAME: DB_NAME,
    SCHEMA_VERSION: SCHEMA_VERSION,
    whenReady: whenReady,
    isIndexedDBReady: function () { return idbReady && !idbFailed; },
    putFile: putFile,
    getFile: getFile,
    listFiles: listFiles,
    deleteFile: deleteFile
  };
})();
