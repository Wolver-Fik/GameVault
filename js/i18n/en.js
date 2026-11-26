/* GameVault i18n: English (base locale). Registers itself in window.GVI18N.locales. */
(function () {
  var G = window.GVI18N || (window.GVI18N = { locales: {} });
  G.locales.en = {
    code: 'en',
    name: 'English',
    'app.tagline': 'COLLECTION • BACKLOG • HOURS',
    'lang.label': 'Language',
    'lang.aria': 'Language',
    'btn.random': 'Pick at random',
    'btn.backup': 'Backup',
    'btn.add': 'Add game',
    'stats.aria': 'Collection summary',
    'stat.games': 'Games',
    'stat.hours': 'Hours played',
    'stat.completed': 'Completed',
    'stat.favoritePlatform': 'Favorite platform',
    'panel.collection': 'Collection status',
    'panel.platforms': 'By platform',
    'tabs.all': 'All',
    'tabs.aria': 'Filter by status',
    'search.placeholder': 'Search by title  ( / )',
    'filter.platform': 'All platforms',
    'filter.genre': 'All genres',
    'sort.aria': 'Sort by',
    'sort.recent': 'Newest first',
    'sort.name': 'Name A–Z',
    'sort.hours': 'Most hours',
    'sort.score': 'Top rated',
    'sort.year': 'Release year',
    'filter.platformAria': 'Platform',
    'filter.genreAria': 'Genre',
    'status.jugando': 'Playing',
    'status.pendiente': 'Pending',
    'status.completado': 'Completed',
    'status.platino': 'Platinum 100%',
    'status.abandonado': 'Abandoned',
    'platform.pc': 'PC',
    'platform.steamDeck': 'Steam Deck',
    'platform.ps5': 'PS5',
    'platform.ps4': 'PS4',
    'platform.ps2': 'PS2',
    'platform.xbox': 'Xbox Series X|S',
    'platform.switch': 'Nintendo Switch',
    'platform.gba': 'Game Boy Advance (GBA)',
    'platform.emulator': 'Emulator',
    'platform.retro': 'Retro',
    'genre.action': 'Action',
    'genre.adventure': 'Adventure',
    'genre.rpg': 'RPG',
    'genre.platformer': 'Platformer',
    'genre.shooter': 'Shooter',
    'genre.strategy': 'Strategy',
    'genre.sports': 'Sports',
    'genre.racing': 'Racing',
    'genre.horror': 'Horror',
    'genre.puzzle': 'Puzzle',
    'genre.indie': 'Indie',
    'genre.fighting': 'Fighting',
    'genre.simulation': 'Simulation',
    'genre.survival': 'Survival',
    'genre.sandbox': 'Sandbox',
    'genre.open_world': 'Open world',
    'genre.metroidvania': 'Metroidvania',
    'genre.roguelike': 'Roguelike / Roguelite',
    'genre.soulslike': 'Soulslike',
    'genre.stealth': 'Stealth',
    'genre.visual_novel': 'Visual novel',
    'genre.rhythm': 'Rhythm / Music',
    'genre.mmo': 'MMO',
    'genre.survival_horror': 'Survival Horror',
    'genre.action_adventure': 'Action-Adventure',
    'genre.action_rpg': 'Action RPG',
    'genre.tactical_rpg': 'Tactical RPG',
    'genre.puzzle_platformer': 'Puzzle-Platformer',
    'genre.beat_em_up': 'Beat \'em up',
    'genre.hack_and_slash': 'Hack and slash',
    'genre.shoot_em_up': 'Shoot \'em up',
    'genre.point_and_click': 'Point & Click',
    'genre.tower_defense': 'Tower Defense',
    'genre.management': 'Management & City Builder',
    'genre.card_battler': 'Card battler / Deckbuilder',
    'genre.party': 'Party / Local multiplayer',
    'genre.other': 'Other',
    'stats.pendingInProgress': '{pend} pending · {play} in progress',
    'stats.avgHours': 'Average {hours} h per game',
    'stats.noHours': 'No hours yet',
    'stats.platinumPart': ' · {n} at 100%',
    'stats.avgScorePart': ' · avg score {score}',
    'stats.platformDetail': '{n} games · {h} h',
    'stats.addFirst': 'Add your first game',
    'stats.noData': 'No data yet.',
    'card.noGenre': 'No genre',
    'card.noPlatform': 'No platform',
    'editor.coverInvalidUrl': 'Enter a valid http(s) image URL.',
    'card.editAria': 'Edit {title}',
    'card.addHourAria': 'Add one hour to {title}',
    'card.example': 'Example',
    'empty.libraryTitle': 'Your library is empty',
    'empty.libraryText': 'Add your first game to start tracking it.',
    'empty.addButton': 'Add game',
    'empty.filterTitle': 'Nothing matches those filters',
    'empty.filterText': 'Try another status, platform or search.',
    'empty.clearButton': 'Clear filters',
    'note.examplesTitle': 'You are viewing sample games.',
    'note.examplesText': 'Edit them, add your own or delete them all at once.',
    'note.clearExamples': 'Delete samples',
    'note.storageTitle': 'This browser is not saving your data.',
    'note.storageText': 'It may be a private window. Use Backup so you do not lose anything.',
    'editor.addTitle': 'Add game',
    'editor.editTitle': 'Edit game',
    'editor.title': 'Title',
    'editor.autofill': 'Autofill details',
    'editor.autofillSearching': 'Looking up details in {lang}…',
    'editor.autofillDone': 'Completed: {list}',
    'editor.autofillNothing': 'No details found in {lang} for this title.',
    'editor.autofillError': 'Could not complete the details. Check your connection.',
    'meta.cover': 'Cover',
    'meta.summary': 'Summary',
    'editor.cover': 'Cover',
    'editor.platform': 'Platform',
    'editor.genre': 'Genre',
    'editor.releaseDate': 'Release year / date',
    'editor.releasePlaceholder': '2017 or 2022-02-25',
    'editor.developer': 'Developer / Studio',
    'editor.developerPlaceholder': 'Team Cherry, FromSoftware...',
    'editor.summary': 'Summary',
    'editor.summaryPlaceholder': 'Short description (1-2 lines)...',
    'editor.status': 'Status',
    'editor.hours': 'Hours played',
    'editor.score': 'My rating',
    'editor.notes': 'Notes',
    'editor.platformPlaceholder': 'Select a platform...',
    'editor.platformManual': 'Enter one manually...',
    'editor.platformManualPlaceholder': 'Type a platform...',
    'editor.genrePlaceholder': 'RPG, Action...',
    'editor.coverFetch': 'Search cover',
    'editor.coverUpload': 'Upload image',
    'editor.coverRemove': 'Remove',
    'editor.coverUrlPlaceholder': 'https://... image URL',
    'editor.coverUrlApply': 'Use URL',
    'editor.coverNone': 'No cover: initials and a gradient will be shown.',
    'editor.coverWiki': 'Cover fetched automatically.',
    'editor.coverFile': 'Local image loaded.',
    'editor.coverUrl': 'Cover URL applied.',
    'editor.coverManual': 'Cover set.',
    'editor.coverSearching': 'Searching for a cover…',
    'editor.coverFound': 'Cover found.',
    'editor.coverNotFound': 'No cover found for this title.',
    'editor.coverError': 'Could not search for a cover. Check your connection.',
    'editor.scoreAria': 'Rating from 1 to 10',
    'editor.notesPlaceholder': 'Chapter, pending quest, why you dropped it...',
    'editor.delete': 'Delete',
    'editor.deleteConfirm': 'Confirm delete',
    'editor.cancel': 'Cancel',
    'editor.save': 'Save',
    'editor.errTitle': 'Enter the game title.',
    'roulette.title': 'What to play today?',
    'roulette.label': 'Choose from pending games on',
    'roulette.allPlatforms': 'All platforms',
    'roulette.close': 'Close',
    'roulette.again': 'Another',
    'roulette.start': 'Start playing',
    'roulette.shuffling': 'Choosing…',
    'roulette.empty': 'No pending games with these filters.',
    'roulette.pendingCount': '{n} pending',
    'roulette.score': 'Rating: {n}/10',
    'roulette.noGenre': 'No genre',
    'backup.title': 'Backup',
    'backup.description': 'Your data lives in this browser. Copy this text and store it somewhere safe. To move your library to another device, paste it there and press Replace.',
    'backup.close': 'Close',
    'backup.exportJson': 'Export JSON',
    'backup.exportCsv': 'Export CSV',
    'backup.copy': 'Copy',
    'backup.copyFallback': 'Text selected. Copy it with Ctrl+C or your phone menu.',
    'backup.copied': 'Copied.',
    'backup.import': 'Replace my library with this text',
    'backup.importConfirm': 'Confirm: current data will be lost',
    'backup.jsonExported': 'JSON exported.',
    'backup.csvExported': 'CSV exported.',
    'backup.imported': 'Library restored.',
    'backup.importError': 'This text is not a valid backup. Nothing was changed.',
    'game.untitled': 'Untitled',
    'sample.summary1': 'A lone knight explores a vast underground kingdom of insects, uncovering secrets and facing ancient guardians.',
    'sample.summary2': 'An exile journeys across the Lands Between to mend the shattered Elden Ring and claim the title of Elden Lord.',
    'sample.summary3': 'Zagreus fights his way out of the Underworld, armed with divine boons and the help of its eccentric residents.',
    'sample.summary4': 'An amnesiac detective investigates a murder in a decaying city while piecing together a fractured mind.',
    'sample.summary5': 'A quiet transfer student leads a double life as a Phantom Thief, stealing hearts to change corrupt adults.',
    'sample.summary6': 'Samus Aran returns to SR388 after an X parasite infection threatens the galaxy from within.',
    'sample.summary7': 'Leave the city behind and build a new life farming, fishing and befriending the people of Pelican Town.',
    'sample.summary8': 'Cloud Strife joins a resistance group to stop a powerful corporation from draining the planet of its life.',
    'sample.note1': 'Heading to the City of Tears.',
    'sample.note2': 'Recommended: take it slow.',
    'sample.note5': 'Stopped at the third palace.',
    'sample.note6': 'Played through an emulator.'
    ,'btn.recommend': 'Recommend a game'
    ,'btn.owned': 'My consoles'
    ,'filter.ownedOnly': 'My consoles only'
    ,'filter.ownedOnlyTitle': 'Showing games for: {list}'
    ,'owned.title': 'My consoles'
    ,'owned.description': 'Select the consoles or devices you own. If you don\'t configure any, all are assumed available.'
    ,'owned.aria': 'My consoles'
    ,'owned.close': 'Close'
    ,'owned.all': 'All'
    ,'owned.save': 'Save'
    ,'owned.selected': '{n} selected'
    ,'owned.noneSelected': 'No consoles selected — all will be assumed available.'
    ,'owned.allAssumed': 'No consoles configured: all assumed available.'
    ,'owned.pcSteam': 'PC / Steam'
    ,'owned.ps5': 'PS5'
    ,'owned.ps4': 'PS4'
    ,'owned.ps3': 'PS3'
    ,'owned.xboxSeries': 'Xbox Series X|S'
    ,'owned.xboxOne': 'Xbox One'
    ,'owned.switch': 'Nintendo Switch'
    ,'owned.gba': 'Game Boy Advance (GBA)'
    ,'owned.retroEmulator': 'Retro / Emulator'
    ,'platform.retroEmulator': 'Retro / Emulator'
    ,'owned.mobile': 'Mobile (iOS / Android)'
    ,'platform.ps3': 'PS3'
    ,'platform.xboxSeries': 'Xbox Series X|S'
    ,'platform.xboxOne': 'Xbox One'
    ,'platform.mobile': 'Mobile (iOS / Android)'
    ,'editor.genres': 'Genres'
    ,'editor.genresAria': 'Genres'
    ,'editor.editAllGenres': '+ Edit all genres'
    ,'editor.viewAllGenres': 'View all genres'
    ,'editor.collapseGenres': 'Collapse genres'
    ,'editor.genresHelp': 'Select one or several genres.'
    ,'recommend.title': 'A game recommended for you'
    ,'recommend.reason': 'Based on your interest in {genres}'
    ,'recommend.reasonOwned': 'Based on {genres} for {platforms}'
    ,'recommend.reasonEmpty': 'Add completed, 100% or pending games with genres to get recommendations.'
    ,'recommend.genres': 'Genres'
    ,'recommend.platform': 'Recommended platform'
    ,'recommend.developer': 'Developer'
    ,'recommend.year': 'Year'
    ,'recommend.summary': 'Summary'
    ,'recommend.unknown': 'Unknown'
    ,'recommend.noSummary': 'No summary available.'
    ,'recommend.anyPlatform': 'Any platform'
    ,'recommend.searching': 'Looking for a recommendation…'
    ,'recommend.noCandidates': 'No new candidates found for those genres and consoles. Try adding more games or changing your consoles.'
    ,'recommend.error': 'Could not get a recommendation. Check your connection and try again.'
    ,'recommend.addPending': '+ Add to Pending'
    ,'recommend.again': 'Another recommendation'
    ,'recommend.close': 'Close'
    ,'recommend.added': 'Recommendation added to Pending'
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
    ,'owned.group.pc': 'PC & PC handhelds'
    ,'owned.group.playstation': 'PlayStation'
    ,'owned.group.nintendoHome': 'Nintendo consoles & hybrids'
    ,'owned.group.nintendoPortable': 'Nintendo handhelds'
    ,'owned.group.xboxRetro': 'Xbox, Sega & retro'
    /* v1.0.8: vistas principales, juegos agrupados, variantes "/ Emulador" y launchers de PC. */
    ,'view.aria': 'Main views'
    ,'view.collection': 'Collection'
    ,'view.consoles': 'My Consoles'
    ,'console.gamesTitle': 'Games by console'
    ,'console.description': 'Your library grouped by machine or system.'
    ,'console.empty': 'No games to group by console yet.'
    ,'platform.pcSteam': 'PC / Steam'
    ,'platform.pcEmulator': 'PC / Emulator'
    ,'platform.ps4Emulator': 'PS4 / Emulator'
    ,'platform.ps3Emulator': 'PS3 / Emulator'
    ,'platform.switchEmulator': 'Switch / Emulator'
    ,'owned.pcEmulator': 'PC / Emulator'
    ,'owned.ps4Emulator': 'PS4 / Emulator'
    ,'owned.ps3Emulator': 'PS3 / Emulator'
    ,'owned.switchEmulator': 'Switch / Emulator'
    /* v1.0.8: clientes/launchers de PC (mismo catalogo en platform.* y owned.*). */
    ,'platform.pcEpic': 'PC / Epic Games'
    ,'platform.pcEa': 'PC / EA App'
    ,'platform.pcBattleNet': 'PC / Battle.net (Blizzard)'
    ,'platform.pcUbisoft': 'PC / Ubisoft Connect'
    ,'platform.pcGog': 'PC / GOG'
    ,'platform.pcXboxApp': 'PC / Xbox App (Game Pass)'
    ,'platform.pcRiot': 'PC / Riot Client'
    ,'platform.pcOtherLauncher': 'PC / Other launcher'
    ,'owned.pcEpic': 'PC / Epic Games'
    ,'owned.pcEa': 'PC / EA App'
    ,'owned.pcBattleNet': 'PC / Battle.net (Blizzard)'
    ,'owned.pcUbisoft': 'PC / Ubisoft Connect'
    ,'owned.pcGog': 'PC / GOG'
    ,'owned.pcXboxApp': 'PC / Xbox App (Game Pass)'
    ,'owned.pcRiot': 'PC / Riot Client'
    ,'owned.pcOtherLauncher': 'PC / Other launcher'
    /* v1.1.2: selector inteligente de plataformas en el editor. */
    ,'editor.showAllPlatforms': 'Show all platforms for this game'
    ,'editor.showAllGamePlatforms': 'Show all platforms for this game'
    ,'editor.platformFiltered': 'Filtered by your consoles and game availability'
    ,'editor.platformNoMatch': 'None of your consoles match this game — showing all platforms'
    ,'editor.platformAllShown': 'Showing all platforms'
    ,'editor.platformGameAllShown': 'Showing all platforms for this game'
    ,'meta.platforms': 'Platforms'
    /* v1.3.0: sessions, achievements, collections and yearly wrapped. */
    ,'view.wrapped': 'Wrapped'
    ,'wrapped.title': 'Gaming Wrapped'
    ,'wrapped.desc': 'Playtime, finishes and records by year.'
    ,'wrapped.year': 'Year'
    ,'wrapped.yearAria': 'Year'
    ,'wrapped.aria': 'Yearly summary'
    ,'wrapped.hoursYear': 'Hours played'
    ,'wrapped.finishedYear': 'Games finished'
    ,'wrapped.sessionsYear': 'Sessions'
    ,'wrapped.perfectYear': '100% complete'
    ,'wrapped.byYear': 'By year'
    ,'wrapped.topGames': 'Most played'
    ,'wrapped.byGenre': 'By genre'
    ,'wrapped.byPlatform': 'By platform'
    ,'wrapped.allYears': 'All years'
    ,'wrapped.sessionTotal': '{n} sessions logged'
    ,'wrapped.perfectTotal': '{n} at 100%'
    ,'wrapped.minutesTotal': '{n} min logged'
    ,'wrapped.achievementsDone': 'Achievements complete'
    ,'wrapped.finishedShort': '{n} done'
    ,'wrapped.noSessions': 'Log sessions to see your summary.'
    ,'wrapped.noYears': 'No yearly data yet.'
    ,'session.title': 'Game sessions'
    ,'session.hint': 'Each session adds hours to the game and your yearly summary.'
    ,'session.date': 'Date'
    ,'session.hours': 'Hours'
    ,'session.minutes': 'Min'
    ,'session.note': 'Note (optional)'
    ,'session.add': '+ Session'
    ,'session.empty': 'No sessions yet.'
    ,'session.delete': 'Delete session'
    ,'session.count': '{n} sessions · {h} h'
    ,'session.added': 'Session logged'
    ,'session.deleted': 'Session deleted'
    ,'session.errDate': 'Pick a valid date.'
    ,'session.errDuration': 'Duration must be over 0.'
    ,'ach.title': 'Achievements / trophies'
    ,'ach.unlocked': 'Unlocked'
    ,'ach.total': 'Total'
    ,'ach.progress': '{p}% complete'
    ,'ach.badge': '100%'
    ,'ach.platinum': 'Platinum / 100%'
    ,'ach.hint': 'Set total to 0 if not applicable.'
    ,'coll.manage': 'Collections'
    ,'coll.title': 'Collections'
    ,'coll.description': 'Create custom lists and assign them to games from their detail page.'
    ,'coll.namePlaceholder': 'E.g. Local co-op'
    ,'coll.create': 'Create'
    ,'coll.aria': 'Collections'
    ,'coll.selected': '{n} selected'
    ,'coll.empty': 'No collections yet.'
    ,'coll.name': 'Name'
    ,'coll.delete': 'Delete'
    ,'coll.deleteConfirm': 'Confirm delete'
    ,'coll.errName': 'Enter a name.'
    ,'coll.errDuplicate': 'That name already exists.'
    ,'coll.created': 'Collection created'
    ,'coll.removed': 'Collection deleted'
    ,'filter.collection': 'All collections'
    ,'filter.collectionAria': 'Collection'
    ,'stats.achPart': ' · {n} at 100%'
    ,'backup.reset': 'Reset data'
    ,'backup.resetConfirm': 'Confirm reset'
    ,'backup.resetDone': 'Data reset'
    ,'backup.csvImported': 'Library imported from CSV'
  };
})();
