/* GameVault storage: localStorage, demo data, backup/import helpers. */
(function () {
  var KEY = 'biblioteca-juegos-v1';
  var storageOk = true;
  var I = window.GVI18N;

  function tr(key, fallback) {
    try {
      return I && typeof I.t === 'function' ? I.t(key) : fallback;
    } catch (e) { return fallback; }
  }
  function uid() { return 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  /* Acepta "2017" o "2022-02-25" y deriva el anio para ordenar/filtrar. */
  function splitRelease(value) {
    var s = String(value || '').trim().slice(0, 30);
    if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(s)) return { releaseDate: s, releaseYear: s.slice(0, 4) };
    var m = /\b(1[5-9]\d{2}|20\d{2}|21\d{2})\b/.exec(s);
    return { releaseDate: s, releaseYear: m ? m[1] : '' };
  }

  function normalize(g) {
    var rel = splitRelease(g.releaseDate || g.releaseYear || '');
    return {
      id: g.id || uid(),
      title: String(g.title || '').trim().slice(0, 120) || tr('game.untitled', 'Untitled'),
      platform: String(g.platform || '').trim().slice(0, 40),
      genre: String(g.genre || '').trim().slice(0, 40),
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
        id: uid(), title: t, platform: p, genre: ge, status: s, hours: h, score: sc,
        notes: n || '', releaseDate: rel || '', developer: dev || '',
        summary: sumKey ? tr(sumKey, '') : '', sampleSummaryKey: sumKey || '',
        added: now - i * 86400000, updated: now - i * 86400000,
        example: true, cover: '', coverSource: ''
      });
    }
    return [
      g(1, 'Hollow Knight', 'pc', 'platformer', 'jugando', 18.5, null, tr('sample.note1', ''), '2017', 'Team Cherry', 'sample.summary1'),
      g(2, 'Elden Ring', 'ps5', 'rpg', 'completado', 96, 10, '', '2022-02-25', 'FromSoftware', 'sample.summary2'),
      g(3, 'Hades', 'switch', 'action', 'platino', 61, 9, '', '2020-09-17', 'Supergiant Games', 'sample.summary3'),
      g(4, 'Disco Elysium', 'pc', 'rpg', 'pendiente', 0, null, tr('sample.note2', ''), '2019-10-15', 'ZA/UM', 'sample.summary4'),
      g(5, 'Persona 5 Royal', 'ps4', 'rpg', 'abandonado', 34, 7, tr('sample.note5', ''), '2019-10-31', 'Atlus', 'sample.summary5'),
      g(6, 'Metroid Fusion', 'gba', 'adventure', 'pendiente', 0, null, tr('sample.note6', ''), '2002-11-18', 'Nintendo EPD', 'sample.summary6'),
      g(7, 'Stardew Valley', 'pc', 'simulation', 'completado', 72, 9, '', '2016-02-26', 'ConcernedApe', 'sample.summary7'),
      g(8, 'Final Fantasy VII', 'retro', 'rpg', 'pendiente', 3, null, '', '1997-01-31', 'Square', 'sample.summary8')
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
    var cols = ['id', 'title', 'platform', 'genre', 'releaseDate', 'releaseYear', 'developer', 'summary', 'status', 'hours', 'score', 'notes', 'cover', 'added', 'updated'];
    function cell(v) {
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

  window.GVStorage = {
    KEY: KEY,
    uid: uid,
    splitRelease: splitRelease,
    normalize: normalize,
    save: save,
    load: load,
    sample: sample,
    exportJSON: exportJSON,
    importJSON: importJSON,
    toCSV: toCSV,
    download: download,
    getStorageOk: function () { return storageOk; },
    setStorageOk: function (v) { storageOk = !!v; }
  };
})();
