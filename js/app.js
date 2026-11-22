/* GameVault app: collection, covers, stats, filters, roulette, backups, i18n and PWA. */
(function () {
  var STORAGE = window.GVStorage;
  var I = window.GVI18N;

  function t(key, vars) {
    if (!I || typeof I.t !== 'function') return String(key);
    try { return I.t(key, vars); } catch (e) { return String(key); }
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
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

  var PLATFORM_KEYS = ['pc', 'steamDeck', 'ps5', 'ps4', 'ps2', 'xbox', 'switch', 'gba', 'emulator', 'retro'];
  var GENRE_KEYS = ['action', 'adventure', 'rpg', 'platformer', 'shooter', 'strategy', 'sports', 'racing', 'horror', 'puzzle', 'indie', 'fighting', 'simulation'];

  var state = { games: [], f: { status: 'todos', plat: '', genre: '', sort: 'reciente', q: '' } };
  var storageOk = true;
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
      if (s) map[s] = prefixed;
    }
    I.ORDER.forEach(function (code) {
      PLATFORM_KEYS.forEach(function (k) { add(I.tIn(code, 'platform.' + k), 'p:' + k); });
      GENRE_KEYS.forEach(function (k) { add(I.tIn(code, 'genre.' + k), 'g:' + k); });
    });
    PLATFORM_KEYS.forEach(function (k) { add(k, 'p:' + k); });
    GENRE_KEYS.forEach(function (k) { add(k, 'g:' + k); });
    return map;
  }
  function keyOf(kind, value) {
    var raw = String(value || '').trim();
    if (!raw) return '';
    if (!aliasCache) aliasCache = buildAliases();
    var found = aliasCache[raw.toLowerCase()];
    if (found && found.indexOf(kind + ':') === 0) return found.slice(2);
    return raw;
  }
  function displayValue(kind, value) {
    var key = keyOf(kind, value);
    var list = kind === 'p' ? PLATFORM_KEYS : GENRE_KEYS;
    var prefix = kind === 'p' ? 'platform.' : 'genre.';
    return list.indexOf(key) !== -1 ? t(prefix + key) : String(value || '');
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

  /* Peticion comun con timeout: una API lenta no debe dejar el modal esperando para siempre. */
  function fetchJson(url, timeout) {
    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, timeout || 12000) : null;
    var init = ctl ? { signal: ctl.signal } : undefined;
    function done() { if (timer) clearTimeout(timer); }
    return fetch(url, init).then(function (r) {
      done();
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).catch(function (e) { done(); throw e; });
  }

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

  /* Busqueda en Wikipedia EN: extracto, categorias, portada y entity-id de Wikidata. */
  function wikiMetadataUrl(title) {
    return wikiApi('en') +
      '?action=query' +
      '&generator=search' +
      '&gsrsearch=' + encodeQ(String(title).trim() + ' video game') +
      '&gsrlimit=3' +
      '&prop=extracts|categories|pageimages|pageprops' +
      '&exintro=1' +
      '&explaintext=1' +
      '&exsentences=3' +
      '&cllimit=20' +
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

  /* Palabras clave del extracto/categorias en ingles mapeadas al selector de generos. */
  var GENRE_HINTS = [
    { key: 'rpg', re: /\brpg\b|\bjrpgs?\b|role[- ]playing|turn[- ]based|soulslike/i },
    { key: 'horror', re: /horror|psychological thriller/i },
    { key: 'fighting', re: /fighting game|\bfighters?\b|beat ['’]em up|hack and slash/i },
    { key: 'racing', re: /racing|motorsport|driving game/i },
    { key: 'shooter', re: /shooter|\bfps\b|bullet hell|first[- ]person|third[- ]person/i },
    { key: 'platformer', re: /platformer|platform game|metroidvania|side[- ]scrolling|jump[- ]and[- ]run/i },
    { key: 'puzzle', re: /puzzle|logic game|brain teaser|match[- ]three/i },
    { key: 'strategy', re: /strategy|tactical|\brts\b|real[- ]time strategy|4x\b/i },
    { key: 'sports', re: /sports? game|football|basketball|soccer|baseball|tennis|golf/i },
    { key: 'simulation', re: /simulation|simulator|sandbox|farming sim|life sim/i },
    { key: 'adventure', re: /adventure|visual novel|interactive fiction|point[- ]and[- ]click|narrative/i },
    { key: 'action', re: /\baction\b/ },
    { key: 'indie', re: /\bindie\b|independent game/i }
  ];
  function detectGenre(extract, categories) {
    var cats = (categories || []).map(function (c) {
      return typeof c === 'string' ? c : ((c && c.title) || '');
    }).join(' ');
    var text = String(extract || '') + ' ' + cats;
    if (!text.trim()) return '';
    for (var i = 0; i < GENRE_HINTS.length; i++) {
      if (GENRE_HINTS[i].re.test(text)) return GENRE_HINTS[i].key;
    }
    return '';
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

  /* Sinopsis en el idioma activo: sitelink -> busqueda local -> Wikidata -> extracto EN. */
  function localizedSummary(result, lang, title) {
    var code = wikiLang(lang);
    var wd = result.wikidata;
    var fallback = result.wikidataDescription || result.enSummary || '';
    if (code === 'en') return Promise.resolve(result.enSummary || fallback);
    var sitelink = wd && wd.sitelinks && wd.sitelinks[code + 'wiki'];
    var stitle = sitelink && sitelink.title;
    if (stitle) {
      return fetchJson(wikiExtractUrl(code, stitle)).then(function (data) {
        return cleanSummary(firstExtract(data, stitle), 2) || fallback;
      }).catch(function () { return fallback; });
    }
    return fetchJson(wikiExtractSearchUrl(code, title)).then(function (data) {
      return cleanSummary(firstExtract(data, title), 2) || fallback;
    }).catch(function () { return fallback; });
  }

  function collectMetadata(title, lang) {
    var result = {};
    return fetchJson(wikiMetadataUrl(title)).then(function (data) {
      var page = pickBestPage(data, title, false);
      if (!page) return result;
      if (page.thumbnail && page.thumbnail.source) result.cover = page.thumbnail.source;
      result.genre = detectGenre(page.extract, page.categories);
      result.enSummary = cleanSummary(page.extract, 2);
      var qid = page.pageprops && page.pageprops.wikibase_item;
      if (!qid || !/^Q\d+$/.test(qid)) return result;
      return fetchJson(wikidataUrl(qid, lang, true)).then(function (payload) {
        var entity = payload && payload.entities && payload.entities[qid];
        if (!entity) return result;
        result.wikidata = entity;
        result.wikidataDescription = cleanSummary(pickDescription(entity, lang), 2);
        var dateValue = claimValue(entity.claims, 'P577');
        var rel = parseWikidate(dateValue && dateValue.time ? dateValue.time : dateValue);
        if (rel) result.releaseDate = rel;
        var dev = claimValue(entity.claims, 'P178');
        var devId = dev && dev.id ? dev.id : '';
        if (!/^Q\d+$/.test(devId)) return result;
        return fetchJson(wikidataUrl(devId, lang, false)).then(function (devPayload) {
          var studio = devPayload && devPayload.entities && devPayload.entities[devId];
          var name = pickLabel(studio, lang);
          if (name) result.developer = name.slice(0, 80);
          return result;
        }).catch(function () { return result; });
      }).catch(function () { return result; });
    }).then(function () {
      return localizedSummary(result, lang, title).then(function (s) {
        result.summary = s;
        return result;
      });
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
    if (result.genre) {
      var glabel = displayValue('g', result.genre);
      $('e-genre').value = glabel;
      done.push(glabel);
    }
    if (result.releaseDate) { $('e-release').value = result.releaseDate; done.push(result.releaseDate); }
    if (result.developer) { $('e-dev').value = result.developer; done.push(result.developer); }
    if (result.summary) { $('e-summary').value = result.summary; done.push(t('meta.summary')); }
    if (done.length) showAutofillMsg(t('editor.autofillDone', { list: done.join(', ') }), 'ok');
    else showAutofillMsg(t('editor.autofillNothing', { lang: I.languageName ? I.languageName(lang) : lang }), 'warn');
  }
  function autofillMetadata() {
    var title = $('e-title').value.trim();
    if (!title) { $('e-err').textContent = t('editor.errTitle'); $('e-title').focus(); return; }
    var token = ++metaSearchId;
    var lang = I.lang ? I.lang() : I.current();
    setAutofillBusy(true);
    showAutofillMsg(t('editor.autofillSearching', { lang: I.languageName ? I.languageName(lang) : lang }), 'searching');
    $('e-err').textContent = '';
    collectMetadata(title, lang).then(function (result) {
      if (token !== metaSearchId) return null;
      if (result.cover) return result;
      return fetchCoverRaw(title).then(function (src) {
        if (src) result.cover = src;
        return result;
      }).catch(function () { return result; });
    }).then(function (result) {
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
    if (state.f.genre && keyOf('g', g.genre) !== state.f.genre) return false;
    if (state.f.q && g.title.toLowerCase().indexOf(state.f.q.toLowerCase()) === -1) return false;
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
    state.games.forEach(function (g) { var k = keyOf(kind, g[kind === 'p' ? 'platform' : 'genre']); if (k) m[k] = true; });
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
    var pl = uniqValues('p'), ge = uniqValues('g');
    if (state.f.plat && pl.indexOf(state.f.plat) === -1) state.f.plat = '';
    if (state.f.genre && ge.indexOf(state.f.genre) === -1) state.f.genre = '';
    fillSelect($('f-plat'), 'p', t('filter.platform'), pl, state.f.plat);
    fillSelect($('f-genre'), 'g', t('filter.genre'), ge, state.f.genre);
  }
  function fillDataLists() {
    $('dl-plat').innerHTML = PLATFORM_KEYS.map(function (k) {
      return '<option value="' + esc(t('platform.' + k)) + '"></option>';
    }).join('');
    $('dl-genre').innerHTML = GENRE_KEYS.map(function (k) {
      return '<option value="' + esc(t('genre.' + k)) + '"></option>';
    }).join('');
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
        '<span class="g">' + esc(g.genre ? displayValue('g', g.genre) : t('card.noGenre')) + '</span>' +
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

  function renderNotes() {
    var h = '';
    var ex = state.games.filter(function (g) { return g.example; }).length;
    if (ex) h += '<div class="note"><span><b>' + esc(t('note.examplesTitle')) + '</b> ' + esc(t('note.examplesText')) + '</span><button class="btn" type="button" data-clear-ex>' + esc(t('note.clearExamples')) + '</button></div>';
    if (!storageOk) h += '<div class="note"><span><b>' + esc(t('note.storageTitle')) + '</b> ' + esc(t('note.storageText')) + '</span></div>';
    $('notes').innerHTML = h;
  }

  function renderAll() { renderFilters(); renderStats(); renderTabs(); renderGrid(); renderNotes(); }
  /* Alias publico de renderizado para el arranque y para depuracion. */
  function render() { renderAll(); }

  /* ---------- editor ---------- */
  function buildScores() {
    var h = '';
    for (var i = 1; i <= 10; i++) h += '<button type="button" data-sc="' + i + '" aria-pressed="' + (editScore === i) + '">' + i + '</button>';
    $('e-scores').innerHTML = h;
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
  function openEditor(id) {
    editingId = id || null;
    var g = id ? state.games.filter(function (x) { return x.id === id; })[0] : null;
    $('ed-title').textContent = t(g ? 'editor.editTitle' : 'editor.addTitle');
    $('e-title').value = g ? g.title : '';
    $('e-plat').value = g ? displayValue('p', g.platform) : (state.f.plat ? displayValue('p', state.f.plat) : '');
    $('e-genre').value = g ? displayValue('g', g.genre) : (state.f.genre ? displayValue('g', state.f.genre) : '');
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
      genre: keyOf('g', $('e-genre').value.trim()),
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
      '<p>' + esc(g.genre ? displayValue('g', g.genre) : t('roulette.noGenre')) + ' · ' + esc(t('roulette.pendingCount', { n: pending })) + '</p>' +
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
    fillDataLists();
    renderAll();
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
    state.f.plat = ''; state.f.genre = ''; state.f.q = '';
    $('q').value = '';
    renderAll();
  }

  function bindEvents() {
  on('btn-add', 'click', function () { openEditor(); });
  on('btn-backup', 'click', openBackup);
  on('btn-random', 'click', openRoulette);
  on('e-cancel', 'click', closeEditor);
  on('e-save', 'click', saveEditor);
  on('e-del', 'click', deleteEditorGame);
  on('e-cover-fetch', 'click', searchCover);
  on('e-autofill', 'click', autofillMetadata);
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
  on('e-title', 'input', function () { coverMsg = ''; resetAutofillMsg(); renderCoverPreview(); });

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

  document.addEventListener('click', function (e) {
    var el;
    if ((el = closest(e.target, '[data-st]'))) { state.f.status = el.getAttribute('data-st'); renderAll(); return; }
    if ((el = closest(e.target, '[data-hour]'))) { addHour(el.getAttribute('data-hour')); return; }
    if ((el = closest(e.target, '[data-open]'))) { openEditor(el.getAttribute('data-open')); return; }
    if (closest(e.target, '[data-add]')) { openEditor(); return; }
    if (closest(e.target, '[data-clear]')) { clearFilters(); return; }
    if (closest(e.target, '[data-clear-ex]')) {
      state.games = state.games.filter(function (g) { return !g.example; });
      save(); renderAll(); return;
    }
    if ((el = closest(e.target, '[data-sc]'))) { editScore = Number(el.getAttribute('data-sc')); buildScores(); return; }
    if ((el = closest(e.target, '[data-addh]'))) {
      var field = $('e-hours');
      field.value = Math.max(0, (parseFloat(field.value) || 0) + Number(el.getAttribute('data-addh')));
      return;
    }
    if (e.target === $('ov-edit')) closeEditor();
    if (e.target === $('ov-random')) closeRoulette();
    if (e.target === $('ov-backup')) closeBackup();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!$('ov-edit').hidden) closeEditor();
      if (!$('ov-random').hidden) closeRoulette();
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

  /* ---------- PWA: service worker ---------- */
  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;
    var reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    });
    navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(function () {});
  }

  /* ---------- arranque garantizado ---------- */
  window.GVApp = {
    state: state,
    render: render,
    renderAll: renderAll,
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
    ['ov-edit', 'ov-random', 'ov-backup'].forEach(function (id) { setOverlay(id, false); });
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
    try { fillDataLists(); } catch (e) {}
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
