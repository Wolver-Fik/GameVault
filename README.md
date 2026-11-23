# GameVault

[![Live demo / Demo en vivo](https://img.shields.io/badge/GitHub%20Pages-GameVault-6366F1?style=flat-square)](https://wolver-fik.github.io/GameVault/)

[English](#english) Â· [EspaÃ±ol](#espaÃ±ol)

---

## English

Your game collection, backlog and played hours in one place. GameVault is a free, offline-friendly Progressive Web App: no account, no server, your data stays in your browser.

**Live app / AplicaciÃ³n en vivo:** <https://wolver-fik.github.io/GameVault/>

## Features

- **8 languages:** English, EspaÃ±ol, PortuguÃªs, FranÃ§ais, Italiano, Deutsch, Ð ÑƒÑÑÐºÐ¸Ð¹ and æ—¥æœ¬èªž. Automatic detection from `navigator.language`, saved in `localStorage`, switchable from the header.
- **Collection management:** add, edit and delete games; status (Playing, Pending, Completed, Platinum 100%, Abandoned), platform, genre, hours, score and notes.
- **Metadata scraper & covers:** one-click auto-fill via Wikipedia & Wikidata for official cover art, localized synopsis (in your active language), release date, developer studio, and hybrid subgenres (*Survival Horror*, *Action-Adventure*, *Action RPG*, etc.), plus local image upload or custom URL.
- **Smart game recommender:** suggests new titles outside your library based strictly on your favorite genres and owned hardware, ready to add to your backlog with full metadata.
- **My Consoles & platform filtering:** manage your owned consoles (including *Nintendo Switch 2*, handhelds, retro systems, per-family emulators, and PC clients like *Steam, Epic, EA App, Battle.net, GOG*), view games grouped by console, and auto-filter compatible platforms when adding games.
- **Multi-genre tagging:** assign and filter multiple genres or hybrid subgenres per game.
- **Insights:** collection status, per-platform bars, totals, average rating and favorite platform.
- **Random picker:** pick a pending game at random, optionally filtered by platform, and start playing with one tap.
- **Backups:** copy/export JSON or CSV and replace the library from a previously saved backup.
- **PWA:** installable on iOS and Android with real PNG icons (180/192/512), web manifest, standalone display and a service worker (Network-First for HTML, offline cache for assets).

## Install / Instalar

1. Open <https://wolver-fik.github.io/GameVault/> in your browser.
2. **Android (Chrome):** menu â†’ *Install app* / *Add to Home screen*.
3. **iOS (Safari):** Share button â†’ *Add to Home Screen*.
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

[PolyForm Noncommercial License 1.0.0](./LICENSE) Â© 2026 Wolver-Fik.

---

<a id="espaÃ±ol"></a>

## EspaÃ±ol

Tu colecciÃ³n de videojuegos, tu backlog y las horas jugadas en un Ãºnico lugar. GameVault es una PWA gratuita y amigable con el modo sin conexiÃ³n: sin cuentas ni servidores, tus datos se quedan en tu navegador.

**AplicaciÃ³n en vivo:** <https://wolver-fik.github.io/GameVault/>

### CaracterÃ­sticas

- **8 idiomas:** English, EspaÃ±ol, PortuguÃªs, FranÃ§ais, Italiano, Deutsch, Ð ÑƒÑÑÐºÐ¸Ð¹ y æ—¥æœ¬èªž. DetecciÃ³n automÃ¡tica desde `navigator.language`, persistencia en `localStorage` y selector en el encabezado.
- **GestiÃ³n de la colecciÃ³n:** aÃ±ade, edita y elimina juegos con estado (Jugando, Pendiente, Completado, Platino 100%, Abandonado), plataforma, gÃ©nero, horas, nota y notas.
- **Scraper de metadatos y portadas:** autocompletado en un clic mediante Wikipedia y Wikidata con carÃ¡tula oficial, sinopsis localizada en el idioma activo de la app, fecha de lanzamiento, estudio desarrollador y subgÃ©neros hÃ­bridos (*Survival Horror*, *AcciÃ³n y aventura*, *Action RPG*, etc.), ademÃ¡s de subida local o URL personalizada.
- **Recomendador inteligente de juegos:** sugiere tÃ­tulos nuevos fuera de tu colecciÃ³n basÃ¡ndose exclusivamente en tus gÃ©neros favoritos y consolas disponibles, listos para aÃ±adir a pendientes con ficha completa.
- **Mis Consolas y filtro cruzado de plataformas:** configura tus consolas (incluyendo *Nintendo Switch 2*, portÃ¡tiles, sistemas retro, emuladores por familia y clientes de PC como *Steam, Epic, EA App, Battle.net, GOG*), agrupa tu biblioteca por consola y filtra automÃ¡ticamente en quÃ© plataformas de las que posees saliÃ³ cada tÃ­tulo.
- **MÃºltiples gÃ©neros por juego:** asigna y filtra varios gÃ©neros o subgÃ©neros hÃ­bridos simultÃ¡neamente por tÃ­tulo.
- **EstadÃ­sticas:** estado de la colecciÃ³n, barras por plataforma, totales, nota media y plataforma favorita.
- **Ruleta aleatoria:** elige un juego pendiente al azar, con filtro opcional por plataforma, y empieza a jugar con un toque.
- **Copias de seguridad:** copia/exporta JSON o CSV y reemplaza la biblioteca desde una copia guardada.
- **PWA:** instalable en iOS y Android con iconos PNG reales (180/192/512), manifiesto web, modo independiente y service worker (Network-First para HTML, cachÃ© sin conexiÃ³n para recursos).

### InstalaciÃ³n

1. Abre <https://wolver-fik.github.io/GameVault/> en tu navegador.
2. **Android (Chrome):** menÃº â†’ *Instalar aplicaciÃ³n* / *AÃ±adir a la pantalla de inicio*.
3. **iOS (Safari):** botÃ³n Compartir â†’ *AÃ±adir a la pantalla de inicio*.
4. Abre GameVault desde la pantalla de inicio: funciona de forma independiente y mantiene la interfaz disponible sin conexiÃ³n.

### Estructura

```text
index.html              Estructura + selector de idioma en el encabezado
manifest.webmanifest    Manifiesto PWA (start_url y scope relativos)
sw.js                   Service worker (HTML Network-First, recursos Cache-First)
css/styles.css          Interfaz oscura y adaptable
js/i18n.js              DetecciÃ³n, persistencia, t() y traducciÃ³n del DOM
js/i18n/*.js            Un diccionario modular por idioma
js/storage.js           localStorage, datos de ejemplo, importaciÃ³n/exportaciÃ³n
js/app.js               LÃ³gica de la app + registro del service worker
icons/icon.svg          Arte vectorial original
icons/generate_icons.py Generador de iconos PNG con Pillow
icons/icon-*.png        Iconos PNG de 180/192/512 px (any + maskable)
```

### Licencia

[PolyForm Noncommercial License 1.0.0](./LICENSE) Â© 2026 Wolver-Fik.

