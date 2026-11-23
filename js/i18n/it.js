/* GameVault i18n: Italiano. Registers itself in window.GVI18N.locales. */
(function () {
  var G = window.GVI18N || (window.GVI18N = { locales: {} });
  G.locales.it = {
    code: 'it',
    name: 'Italiano',
    'app.tagline': 'COLLEZIONE • DA GIOCARE • ORE',
    'lang.label': 'Lingua',
    'lang.aria': 'Lingua',
    'btn.random': 'Scegli a caso',
    'btn.backup': 'Backup',
    'btn.add': 'Aggiungi gioco',
    'stats.aria': 'Riepilogo della collezione',
    'stat.games': 'Giochi',
    'stat.hours': 'Ore giocate',
    'stat.completed': 'Completati',
    'stat.favoritePlatform': 'Piattaforma preferita',
    'panel.collection': 'Stato della collezione',
    'panel.platforms': 'Per piattaforma',
    'tabs.all': 'Tutti',
    'tabs.aria': 'Filtra per stato',
    'search.placeholder': 'Cerca per titolo  ( / )',
    'filter.platform': 'Tutte le piattaforme',
    'filter.genre': 'Tutti i generi',
    'sort.aria': 'Ordina',
    'sort.recent': 'Più recenti',
    'sort.name': 'Nome A–Z',
    'sort.hours': 'Più ore',
    'sort.score': 'Migliori voti',
    'sort.year': 'Anno di uscita',
    'filter.platformAria': 'Piattaforma',
    'filter.genreAria': 'Genere',
    'status.jugando': 'In corso',
    'status.pendiente': 'In attesa',
    'status.completado': 'Completato',
    'status.platino': 'Platino 100%',
    'status.abandonado': 'Abbandonato',
    'platform.pc': 'PC',
    'platform.steamDeck': 'Steam Deck',
    'platform.ps5': 'PlayStation 5',
    'platform.ps4': 'PlayStation 4',
    'platform.ps2': 'PlayStation 2',
    'platform.xbox': 'Xbox Series X|S',
    'platform.switch': 'Nintendo Switch',
    'platform.gba': 'Game Boy Advance',
    'platform.emulator': 'Emulatore',
    'platform.retro': 'Retro',
    'genre.action': 'Azione',
    'genre.adventure': 'Avventura',
    'genre.rpg': 'RPG',
    'genre.platformer': 'Piattaforme',
    'genre.shooter': 'Sparatutto',
    'genre.strategy': 'Strategia',
    'genre.sports': 'Sport',
    'genre.racing': 'Corse',
    'genre.horror': 'Horror',
    'genre.puzzle': 'Rompicapo',
    'genre.indie': 'Indie',
    'genre.fighting': 'Picchiaduro',
    'genre.simulation': 'Simulazione',
    'stats.pendingInProgress': '{pend} in attesa · {play} in corso',
    'stats.avgHours': 'Media di {hours} h per gioco',
    'stats.noHours': 'Ancora nessuna ora',
    'stats.platinumPart': ' · {n} al 100%',
    'stats.avgScorePart': ' · voto medio {score}',
    'stats.platformDetail': '{n} giochi · {h} h',
    'stats.addFirst': 'Aggiungi il tuo primo gioco',
    'stats.noData': 'Ancora nessun dato.',
    'card.noGenre': 'Senza genere',
    'card.noPlatform': 'Senza piattaforma',
    'editor.coverInvalidUrl': 'Inserisci un URL immagine http(s) valido.',
    'card.editAria': 'Modifica {title}',
    'card.addHourAria': 'Aggiungi un’ora a {title}',
    'card.example': 'Esempio',
    'empty.libraryTitle': 'La tua libreria è vuota',
    'empty.libraryText': 'Aggiungi il tuo primo gioco per iniziare a tenerne traccia.',
    'empty.addButton': 'Aggiungi gioco',
    'empty.filterTitle': 'Nessun risultato con questi filtri',
    'empty.filterText': 'Prova un altro stato, piattaforma o ricerca.',
    'empty.clearButton': 'Rimuovi filtri',
    'note.examplesTitle': 'Stai vedendo giochi di esempio.',
    'note.examplesText': 'Modificali, aggiungi i tuoi o eliminateli tutti insieme.',
    'note.clearExamples': 'Elimina esempi',
    'note.storageTitle': 'Questo browser non sta salvando i tuoi dati.',
    'note.storageText': 'Potrebbe essere una finestra privata. Usa il Backup per non perdere nulla.',
    'editor.addTitle': 'Aggiungi gioco',
    'editor.editTitle': 'Modifica gioco',
    'editor.title': 'Titolo',
    'editor.autofill': 'Compila scheda',
    'editor.autofillSearching': 'Ricerca dati in {lang}…',
    'editor.autofillDone': 'Completato: {list}',
    'editor.autofillNothing': 'Nessun dato trovato in {lang} per questo titolo.',
    'editor.autofillError': 'Impossibile compilare la scheda. Controlla la connessione.',
    'meta.cover': 'Copertina',
    'meta.summary': 'Trama',
    'editor.cover': 'Copertina',
    'editor.platform': 'Piattaforma',
    'editor.genre': 'Genere',
    'editor.releaseDate': 'Anno / Data di uscita',
    'editor.releasePlaceholder': '2017 o 2022-02-25',
    'editor.developer': 'Sviluppatore / Studio',
    'editor.developerPlaceholder': 'Team Cherry, FromSoftware...',
    'editor.summary': 'Trama',
    'editor.summaryPlaceholder': 'Breve descrizione (1-2 righe)...',
    'editor.status': 'Stato',
    'editor.hours': 'Ore giocate',
    'editor.score': 'Il mio voto',
    'editor.notes': 'Note',
    'editor.platformPlaceholder': 'PC, PS5, Switch...',
    'editor.genrePlaceholder': 'RPG, Azione...',
    'editor.coverFetch': 'Cerca copertina',
    'editor.coverUpload': 'Carica immagine',
    'editor.coverRemove': 'Rimuovi',
    'editor.coverUrlPlaceholder': 'https://... URL immagine',
    'editor.coverUrlApply': 'Usa URL',
    'editor.coverNone': 'Senza copertina: mostreremo iniziali e sfumatura.',
    'editor.coverWiki': 'Copertina recuperata automaticamente.',
    'editor.coverFile': 'Immagine locale caricata.',
    'editor.coverUrl': 'URL della copertina applicato.',
    'editor.coverManual': 'Copertina impostata.',
    'editor.coverSearching': 'Ricerca della copertina…',
    'editor.coverFound': 'Copertina trovata.',
    'editor.coverNotFound': 'Nessuna copertina trovata per questo titolo.',
    'editor.coverError': 'Impossibile cercare la copertina. Controlla la connessione.',
    'editor.scoreAria': 'Voto da 1 a 10',
    'editor.notesPlaceholder': 'Capitolo, missione in sospeso, perché hai smesso...',
    'editor.delete': 'Elimina',
    'editor.deleteConfirm': 'Conferma: il gioco verrà eliminato',
    'editor.cancel': 'Annulla',
    'editor.save': 'Salva',
    'editor.errTitle': 'Inserisci il titolo del gioco.',
    'roulette.title': 'Cosa giochi oggi?',
    'roulette.label': 'Scegli tra i giochi in attesa su',
    'roulette.allPlatforms': 'Tutte le piattaforme',
    'roulette.close': 'Chiudi',
    'roulette.again': 'Un altro',
    'roulette.start': 'Inizia a giocare',
    'roulette.shuffling': 'Scelgo…',
    'roulette.empty': 'Nessun gioco in attesa con questi filtri.',
    'roulette.pendingCount': '{n} in attesa',
    'roulette.score': 'Voto: {n}/10',
    'roulette.noGenre': 'Senza genere',
    'backup.title': 'Backup',
    'backup.description': 'I tuoi dati risiedono in questo browser. Copia questo testo e conservalo in un posto sicuro. Per portare la libreria su un altro dispositivo, incollalo lì e premi Sostituisci.',
    'backup.close': 'Chiudi',
    'backup.exportJson': 'Esporta JSON',
    'backup.exportCsv': 'Esporta CSV',
    'backup.copy': 'Copia',
    'backup.copyFallback': 'Testo selezionato. Copialo con Ctrl+C o dal menu del telefono.',
    'backup.copied': 'Copiato.',
    'backup.import': 'Sostituisci la mia libreria con questo testo',
    'backup.importConfirm': 'Conferma: i dati attuali andranno persi',
    'backup.jsonExported': 'JSON esportato.',
    'backup.csvExported': 'CSV esportato.',
    'backup.imported': 'Libreria ripristinata.',
    'backup.importError': 'Questo testo non è un backup valido. Non è stato cambiato nulla.',
    'game.untitled': 'Senza titolo',
    'sample.summary1': 'Un cavaliere solitario esplora un vasto regno sotterraneo di insetti, scoprendo segreti e affrontando antichi guardiani.',
    'sample.summary2': 'Un esiliato attraversa le Terre di Mezzo per riparare l’Anello di Elden e diventare Signore di Elden.',
    'sample.summary3': 'Zagreus combatte per uscire dall’Ade, aiutato dagli dèi e dagli eccentrici abitanti del luogo.',
    'sample.summary4': 'Un detective smemorato indaga su un omicidio in una città in declino mentre ricompone la mente frammentata.',
    'sample.summary5': 'Uno studente trasferito conduce una doppia vita da ladro fantasma, rubando i cuori per cambiare gli adulti corrotti.',
    'sample.summary6': 'Samus Aran torna su SR388 quando un’infezione da parassita X minaccia la galassia dall’interno.',
    'sample.summary7': 'Lascia la città e inizia una nuova vita coltivando, pescando e conoscendo la gente di Pelican Town.',
    'sample.summary8': 'Cloud Strife si unisce a un gruppo di resistenza per fermare una potente corporazione che svuota il pianeta della sua vita.',
    'sample.note1': 'Vado verso la Città delle Lacrime.',
    'sample.note2': 'Consigliato, iniziare con calma.',
    'sample.note5': 'Lasciato al terzo palazzo.',
    'sample.note6': 'Tramite emulatore.'
    ,'btn.recommend': 'Consigliami un gioco'
    ,'btn.owned': 'Le mie console'
    ,'filter.ownedOnly': 'Solo le mie console'
    ,'filter.ownedOnlyTitle': 'Mostrando giochi per: {list}'
    ,'owned.title': 'Le mie console'
    ,'owned.description': 'Seleziona le console o i dispositivi che possiedi. Se non ne configuri nessuna, tutte saranno considerate disponibili.'
    ,'owned.aria': 'Le mie console'
    ,'owned.close': 'Chiudi'
    ,'owned.all': 'Tutte'
    ,'owned.save': 'Salva'
    ,'owned.selected': '{n} selezionate'
    ,'owned.noneSelected': 'Nessuna console selezionata — tutte saranno considerate disponibili.'
    ,'owned.allAssumed': 'Nessuna console configurata: tutte considerate disponibili.'
    ,'owned.pcSteam': 'PC / Steam'
    ,'owned.ps5': 'PS5'
    ,'owned.ps4': 'PS4'
    ,'owned.ps3': 'PS3'
    ,'owned.xboxSeries': 'Xbox Series X|S'
    ,'owned.xboxOne': 'Xbox One'
    ,'owned.switch': 'Nintendo Switch'
    ,'owned.gba': 'GBA'
    ,'owned.retroEmulator': 'Retro / Emulatore'
    ,'owned.mobile': 'Mobile (iOS / Android)'
    ,'platform.ps3': 'PlayStation 3'
    ,'platform.xboxSeries': 'Xbox Series X|S'
    ,'platform.xboxOne': 'Xbox One'
    ,'platform.mobile': 'Mobile (iOS / Android)'
    ,'editor.genres': 'Generi'
    ,'editor.genresAria': 'Generi'
    ,'editor.genresHelp': 'Seleziona uno o più generi.'
    ,'recommend.title': 'Un gioco consigliato per te'
    ,'recommend.reason': 'Basato sul tuo interesse per {genres}'
    ,'recommend.reasonOwned': 'Basato su {genres} per {platforms}'
    ,'recommend.reasonEmpty': 'Aggiungi giochi completati, al 100% o in attesa con generi per ricevere consigli.'
    ,'recommend.genres': 'Generi'
    ,'recommend.platform': 'Piattaforma consigliata'
    ,'recommend.developer': 'Sviluppatore'
    ,'recommend.year': 'Anno'
    ,'recommend.summary': 'Trama'
    ,'recommend.unknown': 'Sconosciuto'
    ,'recommend.noSummary': 'Nessuna trama disponibile.'
    ,'recommend.anyPlatform': 'Qualsiasi piattaforma'
    ,'recommend.searching': 'Ricerca di un consiglio…'
    ,'recommend.noCandidates': 'Nessun nuovo candidato trovato per questi generi e console. Prova ad aggiungere altri giochi o a cambiare console.'
    ,'recommend.error': 'Impossibile ottenere un consiglio. Controlla la connessione e riprova.'
    ,'recommend.addPending': '+ Aggiungi ai pendenti'
    ,'recommend.again': 'Un altro consiglio'
    ,'recommend.close': 'Chiudi'
    ,'recommend.added': 'Consiglio aggiunto ai pendenti'
    /* Catalogo completo di console, portatili e retrò (ampliato in v1.0.7). */
    ,'platform.ps1': 'PlayStation 1'
    ,'platform.psp': 'PlayStation Portable (PSP)'
    ,'platform.psVita': 'PlayStation Vita'
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
    ,'owned.group.pc': 'PC e portatili PC'
    ,'owned.group.playstation': 'PlayStation'
    ,'owned.group.nintendoHome': 'Console e ibride Nintendo'
    ,'owned.group.nintendoPortable': 'Portatili Nintendo'
    ,'owned.group.xboxRetro': 'Xbox, Sega e retrò'
    /* v1.0.8: viste principali, giochi raggruppati, varianti "/ Emulatore" e launcher PC. */
    ,'view.aria': 'Viste principali'
    ,'view.collection': 'Collezione'
    ,'view.consoles': 'Le mie console'
    ,'console.gamesTitle': 'Giochi per console'
    ,'console.description': 'La tua libreria raggruppata per macchina o sistema.'
    ,'console.empty': 'Non ci sono ancora giochi da raggruppare per console.'
    ,'platform.pcSteam': 'PC / Steam'
    ,'platform.pcEmulator': 'PC / Emulatore'
    ,'platform.ps4Emulator': 'PS4 / Emulatore'
    ,'platform.ps3Emulator': 'PS3 / Emulatore'
    ,'platform.switchEmulator': 'Switch / Emulatore'
    ,'owned.pcEmulator': 'PC / Emulatore'
    ,'owned.ps4Emulator': 'PS4 / Emulatore'
    ,'owned.ps3Emulator': 'PS3 / Emulatore'
    ,'owned.switchEmulator': 'Switch / Emulatore'
    /* v1.0.8: client/launcher PC (stesso catalogo in platform.* e owned.*). */
    ,'platform.pcEpic': 'PC / Epic Games'
    ,'platform.pcEa': 'PC / EA App'
    ,'platform.pcBattleNet': 'PC / Battle.net (Blizzard)'
    ,'platform.pcUbisoft': 'PC / Ubisoft Connect'
    ,'platform.pcGog': 'PC / GOG'
    ,'platform.pcXboxApp': 'PC / Xbox App (Game Pass)'
    ,'platform.pcRiot': 'PC / Riot Client'
    ,'platform.pcOtherLauncher': 'PC / Altro launcher'
    ,'owned.pcEpic': 'PC / Epic Games'
    ,'owned.pcEa': 'PC / EA App'
    ,'owned.pcBattleNet': 'PC / Battle.net (Blizzard)'
    ,'owned.pcUbisoft': 'PC / Ubisoft Connect'
    ,'owned.pcGog': 'PC / GOG'
    ,'owned.pcXboxApp': 'PC / Xbox App (Game Pass)'
    ,'owned.pcRiot': 'PC / Riot Client'
    ,'owned.pcOtherLauncher': 'PC / Altro launcher'
  };
})();
