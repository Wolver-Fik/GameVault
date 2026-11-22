# GameVault

[![Live demo / Demo en vivo](https://img.shields.io/badge/GitHub%20Pages-GameVault-6366F1?style=flat-square)](https://wolver-fik.github.io/GameVault/)

**English** · [Español](#español)

Your game collection, backlog and played hours in one place. GameVault is a free, offline-friendly Progressive Web App: no account, no server, your data stays in your browser.

**Live app / Aplicación en vivo:** <https://wolver-fik.github.io/GameVault/>

## Features

- **8 languages:** English, Español, Português, Français, Italiano, Deutsch, Русский and 日本語. Automatic detection from `navigator.language`, saved in `localStorage`, switchable from the header.
- **Collection management:** add, edit and delete games; status (Playing, Pending, Completed, Platinum 100%, Abandoned), platform, genre, hours, score and notes.
- **Covers:** automatic lookup through Wikipedia, image upload (compressed locally) or direct image URL.
- **Insights:** collection status, per-platform bars, totals, average rating and favorite platform.
- **Random picker:** pick a pending game at random, optionally filtered by platform, and start playing with one tap.
- **Backups:** copy/export JSON or CSV and replace the library from a previously saved backup.
- **PWA:** installable on iOS and Android with real PNG icons (180/192/512), web manifest, standalone display and a service worker (Network-First for HTML, offline cache for assets).
- **GitHub Pages ready:** every path is relative, so it works from a repository subfolder.

## Install / Instalar

1. Open <https://wolver-fik.github.io/GameVault/> in your browser.
2. **Android (Chrome):** menu → *Install app* / *Add to Home screen*.
3. **iOS (Safari):** Share button → *Add to Home Screen*.
4. Launch GameVault from the home screen; it works standalone and keeps the UI available offline.

## Project layout

```text
index.html              App shell + header language selector
manifest.webmanifest    PWA manifest (relative start_url and scope)
sw.js                   Service worker (Network-First HTML, Cache-First assets)
css/styles.css          Dark responsive UI
js/i18n.js              Detection, persistence, t() and DOM translation
js/i18n/*.js            One modular dictionary per language
js/storage.js           localStorage, demo data, import/export helpers
js/app.js               App logic + service worker registration
icons/icon.svg          Vector source artwork
icons/generate_icons.py Pillow generator for the PNG icons
icons/icon-*.png        180/192/512 px PNG icons (any + maskable)
```

## License

[MIT](./LICENSE) © 2026 Wolver-Fik.

---

<a id="español"></a>

## Español

Tu colección de videojuegos, tu backlog y las horas jugadas en un único lugar. GameVault es una PWA gratuita y amigable con el modo sin conexión: sin cuentas ni servidores, tus datos se quedan en tu navegador.

**Aplicación en vivo:** <https://wolver-fik.github.io/GameVault/>

### Características

- **8 idiomas:** English, Español, Português, Français, Italiano, Deutsch, Русский y 日本語. Detección automática desde `navigator.language`, persistencia en `localStorage` y selector en el encabezado.
- **Gestión de la colección:** añade, edita y elimina juegos con estado (Jugando, Pendiente, Completado, Platino 100%, Abandonado), plataforma, género, horas, nota y notas.
- **Portadas:** búsqueda automática en Wikipedia, subida de imagen (comprimida localmente) o URL directa.
- **Estadísticas:** estado de la colección, barras por plataforma, totales, nota media y plataforma favorita.
- **Ruleta aleatoria:** elige un juego pendiente al azar, con filtro opcional por plataforma, y empieza a jugar con un toque.
- **Copias de seguridad:** copia/exporta JSON o CSV y reemplaza la biblioteca desde una copia guardada.
- **PWA:** instalable en iOS y Android con iconos PNG reales (180/192/512), manifiesto web, modo independiente y service worker (Network-First para HTML, caché sin conexión para recursos).
- **Lista para GitHub Pages:** todas las rutas son relativas, funciona incluso en una subcarpeta del repositorio.

### Instalación

1. Abre <https://wolver-fik.github.io/GameVault/> en tu navegador.
2. **Android (Chrome):** menú → *Instalar aplicación* / *Añadir a la pantalla de inicio*.
3. **iOS (Safari):** botón Compartir → *Añadir a la pantalla de inicio*.
4. Abre GameVault desde la pantalla de inicio: funciona de forma independiente y mantiene la interfaz disponible sin conexión.

### Estructura

```text
index.html              Estructura + selector de idioma en el encabezado
manifest.webmanifest    Manifiesto PWA (start_url y scope relativos)
sw.js                   Service worker (HTML Network-First, recursos Cache-First)
css/styles.css          Interfaz oscura y adaptable
js/i18n.js              Detección, persistencia, t() y traducción del DOM
js/i18n/*.js            Un diccionario modular por idioma
js/storage.js           localStorage, datos de ejemplo, importación/exportación
js/app.js               Lógica de la app + registro del service worker
icons/icon.svg          Arte vectorial original
icons/generate_icons.py Generador de iconos PNG con Pillow
icons/icon-*.png        Iconos PNG de 180/192/512 px (any + maskable)
```

### Licencia

[MIT](./LICENSE) © 2026 Wolver-Fik.
