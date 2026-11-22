/* GameVault i18n controller: detection, persistence, translation and DOM binding. */
(function () {
  /* Normaliza el namespace aunque un diccionario lo haya creado a medias. */
  var G = window.GVI18N;
  if (!G || typeof G !== 'object') G = window.GVI18N = {};
  if (!G.locales || typeof G.locales !== 'object') G.locales = {};
  var KEY = 'gamevault-lang';
  var FALLBACK = 'en';
  var EVENT = 'gv:languagechange';
  var ORDER = ['en', 'es', 'pt', 'fr', 'it', 'de', 'ru', 'ja'];
  var current = FALLBACK;

  function supported(code) {
    return !!code && ORDER.indexOf(code) !== -1 && !!G.locales[code];
  }
  function fromNavigator(tag) {
    var s = String(tag || '').toLowerCase().replace(/_/g, '-');
    if (!s) return '';
    if (s.indexOf('pt') === 0) return 'pt';
    var base = s.split('-')[0];
    return ORDER.indexOf(base) !== -1 ? base : '';
  }
  function detect() {
    try {
      var saved = localStorage.getItem(KEY);
      if (supported(saved)) return saved;
    } catch (e) {}
    try {
      var nav = navigator.language || navigator.userLanguage || '';
      var guessed = fromNavigator(nav);
      if (guessed) return guessed;
      var all = navigator.languages || [];
      for (var i = 0; i < all.length; i++) {
        guessed = fromNavigator(all[i]);
        if (guessed) return guessed;
      }
    } catch (e) {}
    return FALLBACK;
  }
  function raw(code, key) {
    var dict = G.locales && G.locales[code];
    return dict && typeof dict[key] === 'string' ? dict[key] : null;
  }
  function tIn(code, key, vars) {
    var text = raw(code, key);
    if (text === null) text = raw(FALLBACK, key);
    if (text === null) text = key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.split('{' + k + '}').join(String(vars[k]));
      });
    }
    return text;
  }
  function t(key, vars) { return tIn(current, key, vars); }
  function set(code) {
    if (!supported(code)) return false;
    var changed = code !== current;
    current = code;
    try { document.documentElement.lang = code; } catch (e) {}
    try { localStorage.setItem(KEY, code); } catch (e) {}
    if (changed) {
      var detail = { language: code };
      try {
        document.dispatchEvent(new CustomEvent(EVENT, { detail: detail }));
        window.dispatchEvent(new CustomEvent(EVENT, { detail: detail }));
      } catch (e) {
        document.dispatchEvent(new Event(EVENT));
      }
    }
    return true;
  }
  function apply(root) {
    var scope = root || document;
    var attrs = [
      ['data-i18n', 'textContent'],
      ['data-i18n-html', 'innerHTML'],
      ['data-i18n-placeholder', 'placeholder'],
      ['data-i18n-aria', 'aria-label'],
      ['data-i18n-title', 'title']
    ];
    attrs.forEach(function (pair) {
      var nodes = scope.querySelectorAll('[' + pair[0] + ']');
      if (scope.hasAttribute && scope.hasAttribute(pair[0])) {
        nodes = [scope].concat(Array.prototype.slice.call(nodes));
      }
      Array.prototype.forEach.call(nodes, function (el) {
        if (!el || !el.getAttribute) return;
        var key = el.getAttribute(pair[0]);
        if (!key) return;
        try {
          var value = t(key);
          if (pair[1] === 'textContent') el.textContent = value;
          else if (pair[1] === 'innerHTML') el.innerHTML = value;
          else el.setAttribute(pair[1], value);
        } catch (e) {
          /* Un nodo o clave problematica nunca debe frenar el resto del DOM. */
        }
      });
    });
  }
  function init() {
    current = detect();
    if (!supported(current)) current = FALLBACK;
    if (!G.locales || !G.locales[current]) G.locales = G.locales || {};
    try { document.documentElement.lang = current; } catch (e) {}
    try { localStorage.setItem(KEY, current); } catch (e) {}
  }

  G.KEY = KEY;
  G.FALLBACK = FALLBACK;
  G.EVENT = EVENT;
  G.ORDER = ORDER;
  G.current = function () { return current; };
  /* Utilidades usadas por el scraper multilingue (codigo Wikipedia/Wikidata y nombre visible). */
  G.lang = function () { return current; };
  G.langTag = function (code) {
    code = code || current;
    return ORDER.indexOf(code) !== -1 ? code : FALLBACK;
  };
  G.languageName = function (code) {
    code = code || current;
    var dict = G.locales && G.locales[code];
    return dict && dict.name ? dict.name : code;
  };
  G.supported = supported;
  G.detect = detect;
  G.t = t;
  G.tIn = tIn;
  G.set = set;
  G.apply = apply;
  /* Alias publico usado por el arranque: aplica traducciones a todo el documento. */
  G.applyTranslations = apply;
  G.init = init;
  init();
  /* Los 8 diccionarios ya estan cargados (scripts anteriores): traducimos el HTML
     estatico de inmediato, incluso si el modulo de la aplicacion llegara a fallar. */
  try { G.applyTranslations(document); } catch (e) {}
})();
