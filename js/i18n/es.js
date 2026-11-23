/* GameVault i18n: Español. Registers itself in window.GVI18N.locales. */
(function () {
  var G = window.GVI18N || (window.GVI18N = { locales: {} });
  G.locales.es = {
    code: 'es',
    name: 'Español',
    'app.tagline': 'COLECCIÓN • BACKLOG • HORAS',
    'lang.label': 'Idioma',
    'lang.aria': 'Idioma',
    'btn.random': 'Elegir al azar',
    'btn.backup': 'Copia de seguridad',
    'btn.add': 'Añadir juego',
    'stats.aria': 'Resumen de la colección',
    'stat.games': 'Juegos',
    'stat.hours': 'Horas jugadas',
    'stat.completed': 'Completado',
    'stat.favoritePlatform': 'Plataforma favorita',
    'panel.collection': 'Estado de la colección',
    'panel.platforms': 'Por plataforma',
    'tabs.all': 'Todos',
    'tabs.aria': 'Filtrar por estado',
    'search.placeholder': 'Buscar por título  ( / )',
    'filter.platform': 'Todas las plataformas',
    'filter.genre': 'Todos los géneros',
    'sort.aria': 'Ordenar',
    'sort.recent': 'Más recientes',
    'sort.name': 'Nombre A–Z',
    'sort.hours': 'Más horas',
    'sort.score': 'Mejor nota',
    'sort.year': 'Año de lanzamiento',
    'filter.platformAria': 'Plataforma',
    'filter.genreAria': 'Género',
    'status.jugando': 'Jugando',
    'status.pendiente': 'Pendiente',
    'status.completado': 'Completado',
    'status.platino': 'Platino 100%',
    'status.abandonado': 'Abandonado',
    'platform.pc': 'PC',
    'platform.steamDeck': 'Steam Deck',
    'platform.ps5': 'PS5',
    'platform.ps4': 'PS4',
    'platform.ps2': 'PS2',
    'platform.xbox': 'Xbox Series X|S',
    'platform.switch': 'Nintendo Switch',
    'platform.gba': 'Game Boy Advance (GBA)',
    'platform.emulator': 'Emulador',
    'platform.retro': 'Retro',
    'genre.action': 'Acción',
    'genre.adventure': 'Aventura',
    'genre.rpg': 'RPG',
    'genre.platformer': 'Plataformas',
    'genre.shooter': 'Shooter',
    'genre.strategy': 'Estrategia',
    'genre.sports': 'Deportes',
    'genre.racing': 'Carreras',
    'genre.horror': 'Terror',
    'genre.puzzle': 'Puzzle',
    'genre.indie': 'Indie',
    'genre.fighting': 'Lucha',
    'genre.simulation': 'Simulación',
    'genre.survival': 'Supervivencia',
    'genre.sandbox': 'Sandbox',
    'genre.open_world': 'Mundo abierto',
    'genre.metroidvania': 'Metroidvania',
    'genre.roguelike': 'Roguelike / Roguelite',
    'genre.soulslike': 'Soulslike',
    'genre.stealth': 'Sigilo',
    'genre.visual_novel': 'Novela visual',
    'genre.rhythm': 'Ritmo / Musical',
    'genre.mmo': 'MMO',
    'genre.survival_horror': 'Terror y supervivencia',
    'genre.action_adventure': 'Acción y aventura',
    'genre.action_rpg': 'RPG de acción',
    'genre.tactical_rpg': 'RPG táctico',
    'genre.puzzle_platformer': 'Puzzle-plataformas',
    'genre.beat_em_up': 'Beat \'em up',
    'genre.hack_and_slash': 'Hack and slash',
    'genre.shoot_em_up': 'Shoot \'em up',
    'genre.point_and_click': 'Point & Click',
    'genre.tower_defense': 'Tower Defense',
    'genre.management': 'Gestión y construcción',
    'genre.card_battler': 'Cartas / Deckbuilder',
    'genre.party': 'Party / Multijugador local',
    'genre.other': 'Otro',
    'stats.pendingInProgress': '{pend} pendientes · {play} en curso',
    'stats.avgHours': 'Promedio {hours} h por juego',
    'stats.noHours': 'Aún sin horas',
    'stats.platinumPart': ' · {n} al 100%',
    'stats.avgScorePart': ' · nota media {score}',
    'stats.platformDetail': '{n} juegos · {h} h',
    'stats.addFirst': 'Añade tu primer juego',
    'stats.noData': 'Sin datos todavía.',
    'card.noGenre': 'Sin género',
    'card.noPlatform': 'Sin plataforma',
    'editor.coverInvalidUrl': 'Escribe una URL de imagen http(s) válida.',
    'card.editAria': 'Editar {title}',
    'card.addHourAria': 'Sumar una hora a {title}',
    'card.example': 'Ejemplo',
    'empty.libraryTitle': 'Tu biblioteca está vacía',
    'empty.libraryText': 'Añade tu primer juego para empezar a llevar el control.',
    'empty.addButton': 'Añadir juego',
    'empty.filterTitle': 'Nada con esos filtros',
    'empty.filterText': 'Prueba con otro estado, plataforma o búsqueda.',
    'empty.clearButton': 'Quitar filtros',
    'note.examplesTitle': 'Estás viendo juegos de ejemplo.',
    'note.examplesText': 'Edítalos, añade los tuyos o bórralos todos de una vez.',
    'note.clearExamples': 'Borrar ejemplos',
    'note.storageTitle': 'Este navegador no está guardando los datos.',
    'note.storageText': 'Puede ser una ventana privada. Usa Copia de seguridad para no perder nada.',
    'editor.addTitle': 'Añadir juego',
    'editor.editTitle': 'Editar juego',
    'editor.title': 'Título',
    'editor.autofill': 'Autocompletar ficha',
    'editor.autofillSearching': 'Buscando ficha en {lang}…',
    'editor.autofillDone': 'Completado: {list}',
    'editor.autofillNothing': 'No se encontraron datos en {lang} para este título.',
    'editor.autofillError': 'No se pudo completar la ficha. Comprueba tu conexión.',
    'meta.cover': 'Portada',
    'meta.summary': 'Sinopsis',
    'editor.cover': 'Portada',
    'editor.platform': 'Plataforma',
    'editor.genre': 'Género',
    'editor.releaseDate': 'Año / Fecha de lanzamiento',
    'editor.releasePlaceholder': '2017 o 2022-02-25',
    'editor.developer': 'Desarrollador / Estudio',
    'editor.developerPlaceholder': 'Team Cherry, FromSoftware...',
    'editor.summary': 'Sinopsis',
    'editor.summaryPlaceholder': 'Descripción breve (1-2 líneas)...',
    'editor.status': 'Estado',
    'editor.hours': 'Horas jugadas',
    'editor.score': 'Mi puntuación',
    'editor.notes': 'Notas',
    'editor.platformPlaceholder': 'Selecciona una plataforma...',
    'editor.genrePlaceholder': 'RPG, Acción...',
    'editor.coverFetch': 'Buscar portada',
    'editor.coverUpload': 'Subir imagen',
    'editor.coverRemove': 'Quitar',
    'editor.coverUrlPlaceholder': 'https://... URL de imagen',
    'editor.coverUrlApply': 'Usar URL',
    'editor.coverNone': 'Sin portada: se mostrarán iniciales y degradado.',
    'editor.coverWiki': 'Portada obtenida automáticamente.',
    'editor.coverFile': 'Imagen local cargada.',
    'editor.coverUrl': 'URL de portada aplicada.',
    'editor.coverManual': 'Portada establecida.',
    'editor.coverSearching': 'Buscando portada…',
    'editor.coverFound': 'Portada encontrada.',
    'editor.coverNotFound': 'No se encontró portada para este título.',
    'editor.coverError': 'No se pudo buscar la portada. Comprueba tu conexión.',
    'editor.scoreAria': 'Puntuación del 1 al 10',
    'editor.notesPlaceholder': 'Capítulo, misión pendiente, por qué lo dejé...',
    'editor.delete': 'Eliminar',
    'editor.deleteConfirm': 'Confirmar: se borra el juego',
    'editor.cancel': 'Cancelar',
    'editor.save': 'Guardar',
    'editor.errTitle': 'Escribe el título del juego.',
    'roulette.title': '¿A qué juego hoy?',
    'roulette.label': 'Elegir entre los pendientes de',
    'roulette.allPlatforms': 'Todas las plataformas',
    'roulette.close': 'Cerrar',
    'roulette.again': 'Otro',
    'roulette.start': 'Empezar a jugar',
    'roulette.shuffling': 'Eligiendo…',
    'roulette.empty': 'No hay juegos pendientes con estos filtros.',
    'roulette.pendingCount': '{n} pendientes',
    'roulette.score': 'Nota: {n}/10',
    'roulette.noGenre': 'Sin género',
    'backup.title': 'Copia de seguridad',
    'backup.description': 'Tus datos viven en este navegador. Copia este texto y guárdalo en un lugar seguro. Para pasar tu biblioteca a otro dispositivo, pégalo allá y pulsa Reemplazar.',
    'backup.close': 'Cerrar',
    'backup.exportJson': 'Exportar JSON',
    'backup.exportCsv': 'Exportar CSV',
    'backup.copy': 'Copiar',
    'backup.copyFallback': 'Texto seleccionado. Cópialo con Ctrl+C o con el menú del teléfono.',
    'backup.copied': 'Copiado.',
    'backup.import': 'Reemplazar mi biblioteca con este texto',
    'backup.importConfirm': 'Confirmar: se pierde lo actual',
    'backup.jsonExported': 'JSON exportado.',
    'backup.csvExported': 'CSV exportado.',
    'backup.imported': 'Biblioteca restaurada.',
    'backup.importError': 'El texto no es una copia válida. No se cambió nada.',
    'game.untitled': 'Sin título',
    'sample.summary1': 'Un caballero solitario explora un vasto reino subterráneo de insectos, descubriendo secretos y enfrentando a antiguos guardianes.',
    'sample.summary2': 'Un desterrado recorre las Tierras Intermedias para reparar el Anillo de Elden y convertirse en Señor de Elden.',
    'sample.summary3': 'Zagreus lucha por salir del Inframundo con la ayuda de los dioses y de sus excéntricos habitantes.',
    'sample.summary4': 'Un detective amnésico investiga un asesinato en una ciudad en decadencia mientras reconstruye su mente fracturada.',
    'sample.summary5': 'Un estudiante transferido lleva una doble vida como ladrón fantasma, robando corazones para cambiar a los adultos corruptos.',
    'sample.summary6': 'Samus Aran regresa a SR388 cuando una infección del parásito X amenaza la galaxia desde dentro.',
    'sample.summary7': 'Deja la ciudad atrás y comienza una nueva vida cultivando, pescando y conociendo a la gente de Pelican Town.',
    'sample.summary8': 'Cloud Strife se une a un grupo de resistencia para detener a una poderosa corporación que agota la vida del planeta.',
    'sample.note1': 'Voy por la Ciudad de las Lágrimas.',
    'sample.note2': 'Recomendado, empezar con calma.',
    'sample.note5': 'Lo dejé en el tercer palacio.',
    'sample.note6': 'Vía emulador.'
    ,'btn.recommend': 'Recomiéndame un juego'
    ,'btn.owned': 'Mis consolas'
    ,'filter.ownedOnly': 'Solo mis consolas'
    ,'filter.ownedOnlyTitle': 'Mostrando juegos para: {list}'
    ,'owned.title': 'Mis consolas'
    ,'owned.description': 'Marca las consolas o dispositivos que tienes. Si no configuras ninguna, se asumen todas disponibles.'
    ,'owned.aria': 'Mis consolas'
    ,'owned.close': 'Cerrar'
    ,'owned.all': 'Todas'
    ,'owned.save': 'Guardar'
    ,'owned.selected': '{n} seleccionadas'
    ,'owned.noneSelected': 'Ninguna consola seleccionada — se asumirán todas disponibles.'
    ,'owned.allAssumed': 'Sin consolas configuradas: se asumen todas disponibles.'
    ,'owned.pcSteam': 'PC / Steam'
    ,'owned.ps5': 'PS5'
    ,'owned.ps4': 'PS4'
    ,'owned.ps3': 'PS3'
    ,'owned.xboxSeries': 'Xbox Series X|S'
    ,'owned.xboxOne': 'Xbox One'
    ,'owned.switch': 'Nintendo Switch'
    ,'owned.gba': 'Game Boy Advance (GBA)'
    ,'owned.retroEmulator': 'Retro / Emulador'
    ,'platform.retroEmulator': 'Retro / Emulador'
    ,'owned.mobile': 'Móvil (iOS / Android)'
    ,'platform.ps3': 'PS3'
    ,'platform.xboxSeries': 'Xbox Series X|S'
    ,'platform.xboxOne': 'Xbox One'
    ,'platform.mobile': 'Móvil (iOS / Android)'
    ,'editor.genres': 'Géneros'
    ,'editor.genresAria': 'Géneros'
    ,'editor.editAllGenres': '+ Editar todos los géneros'
    ,'editor.viewAllGenres': 'Ver todos los géneros'
    ,'editor.collapseGenres': 'Contraer géneros'
    ,'editor.genresHelp': 'Selecciona uno o varios géneros.'
    ,'recommend.title': 'Juego recomendado para ti'
    ,'recommend.reason': 'Basado en tu interés por {genres}'
    ,'recommend.reasonOwned': 'Basado en {genres} para {platforms}'
    ,'recommend.reasonEmpty': 'Añade juegos completados, al 100% o pendientes con géneros para recibir recomendaciones.'
    ,'recommend.genres': 'Géneros'
    ,'recommend.platform': 'Plataforma recomendada'
    ,'recommend.developer': 'Desarrollador'
    ,'recommend.year': 'Año'
    ,'recommend.summary': 'Sinopsis'
    ,'recommend.unknown': 'Desconocido'
    ,'recommend.noSummary': 'Sin sinopsis disponible.'
    ,'recommend.anyPlatform': 'Cualquier plataforma'
    ,'recommend.searching': 'Buscando una recomendación…'
    ,'recommend.noCandidates': 'No encontramos candidatos nuevos para esos géneros y consolas. Prueba a añadir más juegos o cambiar tus consolas.'
    ,'recommend.error': 'No se pudo obtener una recomendación. Comprueba tu conexión e inténtalo de nuevo.'
    ,'recommend.addPending': '+ Añadir a Pendientes'
    ,'recommend.again': 'Otra recomendación'
    ,'recommend.close': 'Cerrar'
    ,'recommend.added': 'Recomendación añadida a Pendientes'
    /* Catálogo completo de consolas, portátiles y retro (ampliado en v1.0.7). */
    ,'platform.ps1': 'PS1'
    ,'platform.psp': 'PSP'
    ,'platform.psVita': 'PS Vita'
    ,'platform.switch2': 'Nintendo Switch 2'
    ,'platform.wiiU': 'Wii U'
    ,'platform.wii': 'Wii'
    ,'platform.gamecube': 'GameCube'
    ,'platform.n64': 'Nintendo 64'
    ,'platform.snes': 'SNES'
    ,'platform.nes': 'NES'
    ,'platform.n3ds': 'Nintendo 3DS'
    ,'platform.nds': 'Nintendo DS'
    ,'platform.gameboy': 'Game Boy / Color'
    ,'platform.xbox360': 'Xbox 360'
    ,'platform.genesis': 'Sega Genesis / Mega Drive'
    ,'platform.dreamcast': 'Dreamcast'
    ,'owned.steamDeck': 'Steam Deck'
    ,'owned.ps2': 'PS2'
    ,'owned.ps1': 'PS1'
    ,'owned.psp': 'PSP'
    ,'owned.psVita': 'PS Vita'
    ,'owned.switch2': 'Nintendo Switch 2'
    ,'owned.wiiU': 'Wii U'
    ,'owned.wii': 'Wii'
    ,'owned.gamecube': 'GameCube'
    ,'owned.n64': 'Nintendo 64'
    ,'owned.snes': 'SNES'
    ,'owned.nes': 'NES'
    ,'owned.n3ds': 'Nintendo 3DS'
    ,'owned.nds': 'Nintendo DS'
    ,'owned.gameboy': 'Game Boy / Color'
    ,'owned.xbox360': 'Xbox 360'
    ,'owned.genesis': 'Sega Genesis / Mega Drive'
    ,'owned.dreamcast': 'Dreamcast'
    ,'owned.group.pc': 'PC y portátiles PC'
    ,'owned.group.playstation': 'PlayStation'
    ,'owned.group.nintendoHome': 'Nintendo sobremesa e híbridas'
    ,'owned.group.nintendoPortable': 'Nintendo portátiles'
    ,'owned.group.xboxRetro': 'Xbox, Sega y retro'
    /* v1.0.8: vistas principales, juegos agrupados, variantes "/ Emulador" y launchers de PC. */
    ,'view.aria': 'Vistas principales'
    ,'view.collection': 'Colección'
    ,'view.consoles': 'Mis Consolas'
    ,'console.gamesTitle': 'Juegos por consola'
    ,'console.description': 'Tu biblioteca agrupada por máquina o sistema.'
    ,'console.empty': 'Aún no hay juegos para agrupar por consola.'
    ,'platform.pcSteam': 'PC / Steam'
    ,'platform.pcEmulator': 'PC / Emulador'
    ,'platform.ps4Emulator': 'PS4 / Emulador'
    ,'platform.ps3Emulator': 'PS3 / Emulador'
    ,'platform.switchEmulator': 'Switch / Emulador'
    ,'owned.pcEmulator': 'PC / Emulador'
    ,'owned.ps4Emulator': 'PS4 / Emulador'
    ,'owned.ps3Emulator': 'PS3 / Emulador'
    ,'owned.switchEmulator': 'Switch / Emulador'
    /* v1.0.8: clientes/launchers de PC (mismo catálogo en platform.* y owned.*). */
    ,'platform.pcEpic': 'PC / Epic Games'
    ,'platform.pcEa': 'PC / EA App'
    ,'platform.pcBattleNet': 'PC / Battle.net (Blizzard)'
    ,'platform.pcUbisoft': 'PC / Ubisoft Connect'
    ,'platform.pcGog': 'PC / GOG'
    ,'platform.pcXboxApp': 'PC / Xbox App (Game Pass)'
    ,'platform.pcRiot': 'PC / Riot Client'
    ,'platform.pcOtherLauncher': 'PC / Otro launcher'
    ,'owned.pcEpic': 'PC / Epic Games'
    ,'owned.pcEa': 'PC / EA App'
    ,'owned.pcBattleNet': 'PC / Battle.net (Blizzard)'
    ,'owned.pcUbisoft': 'PC / Ubisoft Connect'
    ,'owned.pcGog': 'PC / GOG'
    ,'owned.pcXboxApp': 'PC / Xbox App (Game Pass)'
    ,'owned.pcRiot': 'PC / Riot Client'
    ,'owned.pcOtherLauncher': 'PC / Otro launcher'
    /* v1.1.2: selector inteligente de plataformas en el editor. */
    ,'editor.showAllPlatforms': 'Ver todas las plataformas del juego'
    ,'editor.showAllGamePlatforms': 'Ver todas las plataformas del juego'
    ,'editor.platformFiltered': 'Filtrado según tus consolas y disponibilidad del juego'
    ,'editor.platformNoMatch': 'Ninguna de tus consolas coincide con el juego: se muestran todas las plataformas'
    ,'editor.platformAllShown': 'Mostrando todas las plataformas'
    ,'editor.platformGameAllShown': 'Mostrando todas las plataformas del juego'
    ,'meta.platforms': 'Plataformas'
  };
})();
