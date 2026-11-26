/* GameVault scraper auxiliar (v1.3.1): total de logros/trofeos.
   Sin API key y sin tocar el scraper principal de app.js: se limita a intentar
   varias fuentes y devolver un número fiable (o 0 si ninguna aporta el dato).
   Wikipedia/Wikidata funcionan con CORS (origin=*); Steam se intenta cuando
   Wikidata da el appid (P1733) y el navegador/entorno permite la petición. */
(function () {
  var MAX = 100000;
  var TIMEOUT = 9000;
  var WD_API = 'https://www.wikidata.org/w/api.php';
  var STEAM_DETAILS = 'https://store.steampowered.com/api/appdetails?appids=';
  var STEAM_GLOBAL = 'https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=';

  function count(value) {
    var n = Math.round(Number(value));
    return isFinite(n) && n > 0 && n <= MAX ? n : 0;
  }

  function fetchJson(url) {
    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, TIMEOUT) : null;
    function done() { if (timer) clearTimeout(timer); }
    return fetch(url, ctl ? { signal: ctl.signal } : undefined).then(function (r) {
      done();
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).catch(function (e) { done(); throw e; });
  }

  /* P1733 = Steam application ID. Solo se aceptan IDs numéricos y vigentes. */
  function steamAppIds(claims) {
    var arr = (claims && claims.P1733) || [], out = [];
    arr.forEach(function (c) {
      if (!c || c.rank === 'deprecated') return;
      var v = c.mainsnak && c.mainsnak.datavalue && c.mainsnak.datavalue.value;
      var s = typeof v === 'string' ? v : (v && (v.id || v.text || v.amount));
      s = String(s || '').trim();
      if (/^\d{1,10}$/.test(s) && out.indexOf(s) === -1) out.push(s);
    });
    return out.slice(0, 3);
  }

  function fromSteamStore(appid) {
    var id = String(appid);
    return fetchJson(STEAM_DETAILS + encodeURIComponent(id) + '&l=en&cc=us')
      .then(function (data) {
        var entry = data && data[id];
        var details = entry && entry.success === true && entry.data;
        return count(details && details.achievements && details.achievements.total);
      }).catch(function () { return 0; });
  }

  /* Sin clave: el schema global devuelve una entrada por logro publicado. */
  function fromSteamCommunity(appid) {
    return fetchJson(STEAM_GLOBAL + encodeURIComponent(appid) + '&format=json')
      .then(function (data) {
        var list = data && data.achievementpercentages && data.achievementpercentages.achievements;
        return Array.isArray(list) ? count(list.length) : 0;
      }).catch(function () { return 0; });
  }

  function fromSteam(appid) {
    return fromSteamStore(appid).then(function (n) {
      return n || fromSteamCommunity(appid);
    });
  }

  /* Palabras que acompañan al número en los idiomas de la app. Se exigía que
     estén pegadas al número para no confundir años ni otras cifras. */
  var WORDS = 'achievements?|trophies|trophy|logros?|trofeos?|' +
    'succ[èe]s|trof[ée]us?|conquistas?|traguardi|trofei|erfolge|troph[äa]en|' +
    'достижен(?:ий|ия)|трофеев|実績|トロフィー';
  var NUM = '(\\d{1,4})';
  /* Se evita \b alrededor de Cyrílico/Japonés: en JS \b solo reconoce ASCII. */
  var EDGE_L = '(?:^|[^\\p{L}\\p{N}])';
  var EDGE_R = '(?=[^\\p{L}\\p{N}]|$)';
  var PATTERNS = [
    // Parámetro del Infobox: "| achievements = 49", "| trofeos = 49"...
    new RegExp('\\|\\s*(?:' + WORDS + ')\\s*=\\s*' + NUM + EDGE_R, 'giu'),
    // "has/contains/... 49 achievements", "tiene 49 trofeos", "comporte 40 succès"...
    new RegExp(EDGE_L + '(?:has|have|features|contains|includes|offers|boasts|with|there\\s+are|' +
      'tiene|cuenta\\s+con|incluye|ofrece|poss(?:ède|ui)|comporte|' +
      'hat|contiene|include|tem|possui|име(?:ет|ют)|含む)' +
      '(?:\\s+(?:a\\s+total\\s+of|un\\s+total\\s+de|total\\s+de|una|a|un|an))?' +
      '\\s+' + NUM + '\\s+(?:' + WORDS + ')' + EDGE_R, 'giu'),
    // "49 achievements in total", "40 trofeos en total"...
    new RegExp(EDGE_L + NUM + '\\s+(?:' + WORDS + ')\\s+(?:in\\s+total|total|' +
      'en\\s+total|totales?|disponibles?|to\\s+unlock|para\\s+desbloquear)' + EDGE_R, 'giu'),
    // Japonés: "42個のトロフィー", "38の実績" (partícula delante del número).
    new RegExp('(?:^|[^0-9])' + NUM + '\\s*(?:個|つ)?\\s*の\\s*(?:' + WORDS + ')(?=$|[^0-9])', 'giu'),
    // "There are 51 achievements to unlock", "hay 49 logros por desbloquear".
    new RegExp(EDGE_L + '(?:hay|sont|son|there\\s+are)\\s+' + NUM + '\\s+(?:' + WORDS + ')' + EDGE_R, 'giu')
  ];

  function fromWikiText(text) {
    var s = String(text || '').replace(/<ref[^>]*\/?>[\s\S]*?(?:<\/ref>|$)/gi, ' ');
    for (var i = 0; i < PATTERNS.length; i++) {
      var re = PATTERNS[i];
      re.lastIndex = 0;
      var m;
      while ((m = re.exec(s)) !== null) {
        /* Solo se mira la propia coincidencia: incluir texto anterior haría
           descartar un total válido por mencionar un DLC en la frase previa. */
        var before = m[0];
        var isExtra = /\b(?:new|added|additional|extra|nuev[oa]s?|adicional(?:es)?|nouveaux?|nuov[oi]|neue[ns]?|nov[oa]s?|новые)\b/i.test(before);
        var isTotalWord = /\b(?:total|totales?|in total|en total|all)\b/i.test(before);
        if (!isExtra || isTotalWord) return count(m[1]);
        re.lastIndex = m.index + m[0].length;
      }
    }
    return 0;
  }

  /* Prioridad: Steam (cuando Wikidata da el appid) y después Wikipedia.
     Ninguna fuente sobrescribe el campo si no aporta un número positivo. */
  function totalAchievements(options) {
    var o = options || {};
    var wiki = fromWikiText([o.wikiText, o.wikiExtract, o.summary, o.categories]
      .filter(Boolean).join('\n'));
    var ids = steamAppIds(o.wikidataClaims);
    var given = count(o.steamAppId);
    if (given && ids.indexOf(String(given)) === -1) ids.unshift(String(given));
    if (!ids.length) return Promise.resolve(wiki);
    return Promise.all(ids.slice(0, 2).map(function (id) {
      return fromSteam(id).then(function (n) { return n; }, function () { return 0; });
    })).then(function (results) {
      for (var i = 0; i < results.length; i++) {
        if (count(results[i])) return count(results[i]);
      }
      return wiki;
    });
  }

  /* Pequeña API para depuración y pruebas. */
  window.GVScraper = {
    totalAchievements: totalAchievements,
    fromWikiText: fromWikiText,
    fromSteam: fromSteam,
    count: count
  };
})();
