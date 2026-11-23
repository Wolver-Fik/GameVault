/* GameVault i18n: Français. Registers itself in window.GVI18N.locales. */
(function () {
  var G = window.GVI18N || (window.GVI18N = { locales: {} });
  G.locales.fr = {
    code: 'fr',
    name: 'Français',
    'app.tagline': 'COLLECTION • À JOUER • HEURES',
    'lang.label': 'Langue',
    'lang.aria': 'Langue',
    'btn.random': 'Choisir au hasard',
    'btn.backup': 'Sauvegarde',
    'btn.add': 'Ajouter un jeu',
    'stats.aria': 'Résumé de la collection',
    'stat.games': 'Jeux',
    'stat.hours': 'Heures jouées',
    'stat.completed': 'Terminés',
    'stat.favoritePlatform': 'Plateforme préférée',
    'panel.collection': 'État de la collection',
    'panel.platforms': 'Par plateforme',
    'tabs.all': 'Tous',
    'tabs.aria': 'Filtrer par état',
    'search.placeholder': 'Rechercher par titre  ( / )',
    'filter.platform': 'Toutes les plateformes',
    'filter.genre': 'Tous les genres',
    'sort.aria': 'Trier',
    'sort.recent': 'Plus récents',
    'sort.name': 'Nom A–Z',
    'sort.hours': 'Le plus d’heures',
    'sort.score': 'Mieux notés',
    'sort.year': 'Année de sortie',
    'filter.platformAria': 'Plateforme',
    'filter.genreAria': 'Genre',
    'status.jugando': 'En cours',
    'status.pendiente': 'À jouer',
    'status.completado': 'Terminé',
    'status.platino': 'Platine 100 %',
    'status.abandonado': 'Abandonné',
    'platform.pc': 'PC',
    'platform.steamDeck': 'Steam Deck',
    'platform.ps5': 'PS5',
    'platform.ps4': 'PS4',
    'platform.ps2': 'PS2',
    'platform.xbox': 'Xbox Series X|S',
    'platform.switch': 'Nintendo Switch',
    'platform.gba': 'Game Boy Advance (GBA)',
    'platform.emulator': 'Émulateur',
    'platform.retro': 'Rétro',
    'genre.action': 'Action',
    'genre.adventure': 'Aventure',
    'genre.rpg': 'RPG',
    'genre.platformer': 'Plateforme',
    'genre.shooter': 'Tir',
    'genre.strategy': 'Stratégie',
    'genre.sports': 'Sport',
    'genre.racing': 'Course',
    'genre.horror': 'Horreur',
    'genre.puzzle': 'Réflexion',
    'genre.indie': 'Indié',
    'genre.fighting': 'Combat',
    'genre.simulation': 'Simulation',
    'genre.survival': 'Survie',
    'genre.sandbox': 'Bac à sable',
    'genre.open_world': 'Monde ouvert',
    'genre.metroidvania': 'Metroidvania',
    'genre.roguelike': 'Roguelike / Roguelite',
    'genre.soulslike': 'Soulslike',
    'genre.stealth': 'Infiltration',
    'genre.visual_novel': 'Roman visuel',
    'genre.rhythm': 'Rythme / Musical',
    'genre.mmo': 'MMO',
    'genre.survival_horror': 'Horreur de survie',
    'genre.action_adventure': 'Action-aventure',
    'genre.action_rpg': 'RPG d’action',
    'genre.tactical_rpg': 'RPG tactique',
    'genre.puzzle_platformer': 'Puzzle-plateforme',
    'genre.beat_em_up': 'Beat \'em up',
    'genre.hack_and_slash': 'Hack and slash',
    'genre.shoot_em_up': 'Shoot \'em up',
    'genre.point_and_click': 'Point & Click',
    'genre.tower_defense': 'Tower Defense',
    'genre.management': 'Gestion et construction',
    'genre.card_battler': 'Cartes / Deckbuilder',
    'genre.party': 'Party / Multijoueur local',
    'genre.other': 'Autre',
    'stats.pendingInProgress': '{pend} à jouer · {play} en cours',
    'stats.avgHours': 'Moyenne de {hours} h par jeu',
    'stats.noHours': 'Aucune heure pour l’instant',
    'stats.platinumPart': ' · {n} à 100 %',
    'stats.avgScorePart': ' · note moyenne {score}',
    'stats.platformDetail': '{n} jeux · {h} h',
    'stats.addFirst': 'Ajoutez votre premier jeu',
    'stats.noData': 'Pas encore de données.',
    'card.noGenre': 'Sans genre',
    'card.noPlatform': 'Sans plateforme',
    'editor.coverInvalidUrl': 'Saisissez une URL d’image http(s) valide.',
    'card.editAria': 'Modifier {title}',
    'card.addHourAria': 'Ajouter une heure à {title}',
    'card.example': 'Exemple',
    'empty.libraryTitle': 'Votre bibliothèque est vide',
    'empty.libraryText': 'Ajoutez votre premier jeu pour commencer le suivi.',
    'empty.addButton': 'Ajouter un jeu',
    'empty.filterTitle': 'Aucun résultat avec ces filtres',
    'empty.filterText': 'Essayez un autre état, une autre plateforme ou une autre recherche.',
    'empty.clearButton': 'Effacer les filtres',
    'note.examplesTitle': 'Vous voyez des jeux d’exemple.',
    'note.examplesText': 'Modifiez-les, ajoutez les vôtres ou supprimez-les tous.',
    'note.clearExamples': 'Supprimer les exemples',
    'note.storageTitle': 'Ce navigateur n’enregistre pas vos données.',
    'note.storageText': 'Il s’agit peut-être d’une fenêtre privée. Utilisez la sauvegarde pour ne rien perdre.',
    'editor.addTitle': 'Ajouter un jeu',
    'editor.editTitle': 'Modifier le jeu',
    'editor.title': 'Titre',
    'editor.autofill': 'Compléter la fiche',
    'editor.autofillSearching': 'Recherche des infos en {lang}…',
    'editor.autofillDone': 'Complété : {list}',
    'editor.autofillNothing': 'Aucune donnée trouvée en {lang} pour ce titre.',
    'editor.autofillError': 'Impossible de compléter la fiche. Vérifiez votre connexion.',
    'meta.cover': 'Jaquette',
    'meta.summary': 'Résumé',
    'editor.cover': 'Jaquette',
    'editor.platform': 'Plateforme',
    'editor.genre': 'Genre',
    'editor.releaseDate': 'Année / Date de sortie',
    'editor.releasePlaceholder': '2017 ou 2022-02-25',
    'editor.developer': 'Développeur / Studio',
    'editor.developerPlaceholder': 'Team Cherry, FromSoftware...',
    'editor.summary': 'Résumé',
    'editor.summaryPlaceholder': 'Description courte (1-2 lignes)...',
    'editor.status': 'État',
    'editor.hours': 'Heures jouées',
    'editor.score': 'Ma note',
    'editor.notes': 'Notes',
    'editor.platformPlaceholder': 'Sélectionne une plateforme...',
    'editor.genrePlaceholder': 'RPG, Action...',
    'editor.coverFetch': 'Chercher une jaquette',
    'editor.coverUpload': 'Importer une image',
    'editor.coverRemove': 'Retirer',
    'editor.coverUrlPlaceholder': 'https://... URL de l’image',
    'editor.coverUrlApply': 'Utiliser l’URL',
    'editor.coverNone': 'Sans jaquette : initiales et dégradé seront affichés.',
    'editor.coverWiki': 'Jaquette récupérée automatiquement.',
    'editor.coverFile': 'Image locale chargée.',
    'editor.coverUrl': 'URL de la jaquette appliquée.',
    'editor.coverManual': 'Jaquette définie.',
    'editor.coverSearching': 'Recherche de la jaquette…',
    'editor.coverFound': 'Jaquette trouvée.',
    'editor.coverNotFound': 'Aucune jaquette trouvée pour ce titre.',
    'editor.coverError': 'Impossible de chercher la jaquette. Vérifiez votre connexion.',
    'editor.scoreAria': 'Note de 1 à 10',
    'editor.notesPlaceholder': 'Chapitre, quête en attente, pourquoi vous avez arrêté...',
    'editor.delete': 'Supprimer',
    'editor.deleteConfirm': 'Confirmer : le jeu sera supprimé',
    'editor.cancel': 'Annuler',
    'editor.save': 'Enregistrer',
    'editor.errTitle': 'Saisissez le titre du jeu.',
    'roulette.title': 'Quel jeu aujourd’hui ?',
    'roulette.label': 'Choisir parmi les jeux à jouer sur',
    'roulette.allPlatforms': 'Toutes les plateformes',
    'roulette.close': 'Fermer',
    'roulette.again': 'Encore',
    'roulette.start': 'Commencer à jouer',
    'roulette.shuffling': 'Choix en cours…',
    'roulette.empty': 'Aucun jeu à jouer avec ces filtres.',
    'roulette.pendingCount': '{n} à jouer',
    'roulette.score': 'Note : {n}/10',
    'roulette.noGenre': 'Sans genre',
    'backup.title': 'Sauvegarde',
    'backup.description': 'Vos données vivent dans ce navigateur. Copiez ce texte et conservez-le en lieu sûr. Pour transférer votre bibliothèque sur un autre appareil, collez-le et appuyez sur Remplacer.',
    'backup.close': 'Fermer',
    'backup.exportJson': 'Exporter JSON',
    'backup.exportCsv': 'Exporter CSV',
    'backup.copy': 'Copier',
    'backup.copyFallback': 'Texte sélectionné. Copiez-le avec Ctrl+C ou le menu du téléphone.',
    'backup.copied': 'Copié.',
    'backup.import': 'Remplacer ma bibliothèque par ce texte',
    'backup.importConfirm': 'Confirmer : les données actuelles seront perdues',
    'backup.jsonExported': 'JSON exporté.',
    'backup.csvExported': 'CSV exporté.',
    'backup.imported': 'Bibliothèque restaurée.',
    'backup.importError': 'Ce texte n’est pas une sauvegarde valide. Rien n’a été modifié.',
    'game.untitled': 'Sans titre',
    'sample.summary1': 'Un chevalier solitaire explore un vaste royaume souterrain d’insectes, découvrant des secrets et affrontant d’anciens gardiens.',
    'sample.summary2': 'Un exilé traverse les Terres Entre-deux pour réparer l’Anneau d’Elden et devenir Seigneur d’Elden.',
    'sample.summary3': 'Zagreus se bat pour s’échapper des Enfers, aidé par les dieux et les habitants excentriques des lieux.',
    'sample.summary4': 'Un détective amnésique enquête sur un meurtre dans une ville en déclin tout en reconstituant son esprit brisé.',
    'sample.summary5': 'Un lycéen transféré mène une double vie de voleur fantôme, volant des cœurs pour changer les adultes corrompus.',
    'sample.summary6': 'Samus Aran retourne sur SR388 lorsqu’une infection par le parasite X menace la galaxie de l’intérieur.',
    'sample.summary7': 'Quittez la ville et commencez une nouvelle vie : cultivez, pêchez et liez connaissance avec les habitants de Pelican Town.',
    'sample.summary8': 'Cloud Strife rejoint un groupe de résistance pour empêcher une puissante société de vider la planète de sa vie.',
    'sample.note1': 'Je vais vers la Cité des Larmes.',
    'sample.note2': 'Recommandé, y aller doucement.',
    'sample.note5': 'Abandonné au troisième palais.',
    'sample.note6': 'Via un émulateur.'
    ,'btn.recommend': 'Recommandez-moi un jeu'
    ,'btn.owned': 'Mes consoles'
    ,'filter.ownedOnly': 'Seulement mes consoles'
    ,'filter.ownedOnlyTitle': 'Affichage des jeux pour : {list}'
    ,'owned.title': 'Mes consoles'
    ,'owned.description': 'Cochez les consoles ou appareils que vous possédez. Si vous n’en configurez aucune, toutes sont considérées disponibles.'
    ,'owned.aria': 'Mes consoles'
    ,'owned.close': 'Fermer'
    ,'owned.all': 'Toutes'
    ,'owned.save': 'Enregistrer'
    ,'owned.selected': '{n} sélectionnées'
    ,'owned.noneSelected': 'Aucune console sélectionnée — toutes seront considérées disponibles.'
    ,'owned.allAssumed': 'Aucune console configurée : toutes considérées disponibles.'
    ,'owned.pcSteam': 'PC / Steam'
    ,'owned.ps5': 'PS5'
    ,'owned.ps4': 'PS4'
    ,'owned.ps3': 'PS3'
    ,'owned.xboxSeries': 'Xbox Series X|S'
    ,'owned.xboxOne': 'Xbox One'
    ,'owned.switch': 'Nintendo Switch'
    ,'owned.gba': 'Game Boy Advance (GBA)'
    ,'owned.retroEmulator': 'Rétro / Émulateur'
    ,'platform.retroEmulator': 'Rétro / Émulateur'
    ,'owned.mobile': 'Mobile (iOS / Android)'
    ,'platform.ps3': 'PS3'
    ,'platform.xboxSeries': 'Xbox Series X|S'
    ,'platform.xboxOne': 'Xbox One'
    ,'platform.mobile': 'Mobile (iOS / Android)'
    ,'editor.genres': 'Genres'
    ,'editor.genresAria': 'Genres'
    ,'editor.editAllGenres': '+ Modifier tous les genres'
    ,'editor.viewAllGenres': 'Voir tous les genres'
    ,'editor.collapseGenres': 'Réduire les genres'
    ,'editor.genresHelp': 'Sélectionnez un ou plusieurs genres.'
    ,'recommend.title': 'Un jeu recommandé pour vous'
    ,'recommend.reason': 'Basé sur votre intérêt pour {genres}'
    ,'recommend.reasonOwned': 'Basé sur {genres} pour {platforms}'
    ,'recommend.reasonEmpty': 'Ajoutez des jeux terminés, à 100 % ou en attente avec des genres pour recevoir des recommandations.'
    ,'recommend.genres': 'Genres'
    ,'recommend.platform': 'Plateforme recommandée'
    ,'recommend.developer': 'Développeur'
    ,'recommend.year': 'Année'
    ,'recommend.summary': 'Synopsis'
    ,'recommend.unknown': 'Inconnu'
    ,'recommend.noSummary': 'Aucun synopsis disponible.'
    ,'recommend.anyPlatform': 'Toute plateforme'
    ,'recommend.searching': 'Recherche d’une recommandation…'
    ,'recommend.noCandidates': 'Aucun nouveau candidat trouvé pour ces genres et consoles. Essayez d’ajouter d’autres jeux ou de modifier vos consoles.'
    ,'recommend.error': 'Impossible d’obtenir une recommandation. Vérifiez votre connexion et réessayez.'
    ,'recommend.addPending': '+ Ajouter aux en attente'
    ,'recommend.again': 'Une autre recommandation'
    ,'recommend.close': 'Fermer'
    ,'recommend.added': 'Recommandation ajoutée aux en attente'
    /* Catalogue complet des consoles, portables et rétro (étendu en v1.0.7). */
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
    ,'owned.group.pc': 'PC et portables PC'
    ,'owned.group.playstation': 'PlayStation'
    ,'owned.group.nintendoHome': 'Consoles et hybrides Nintendo'
    ,'owned.group.nintendoPortable': 'Consoles portables Nintendo'
    ,'owned.group.xboxRetro': 'Xbox, Sega et rétro'
    /* v1.0.8: vues principales, jeux regroupés, variantes "/ Émulateur" et lanceurs PC. */
    ,'view.aria': 'Vues principales'
    ,'view.collection': 'Collection'
    ,'view.consoles': 'Mes consoles'
    ,'console.gamesTitle': 'Jeux par console'
    ,'console.description': 'Votre bibliothèque regroupée par machine ou système.'
    ,'console.empty': 'Aucun jeu à regrouper par console pour le moment.'
    ,'platform.pcSteam': 'PC / Steam'
    ,'platform.pcEmulator': 'PC / Émulateur'
    ,'platform.ps4Emulator': 'PS4 / Émulateur'
    ,'platform.ps3Emulator': 'PS3 / Émulateur'
    ,'platform.switchEmulator': 'Switch / Émulateur'
    ,'owned.pcEmulator': 'PC / Émulateur'
    ,'owned.ps4Emulator': 'PS4 / Émulateur'
    ,'owned.ps3Emulator': 'PS3 / Émulateur'
    ,'owned.switchEmulator': 'Switch / Émulateur'
    /* v1.0.8: clients/lanceurs PC (même catalogue dans platform.* et owned.*). */
    ,'platform.pcEpic': 'PC / Epic Games'
    ,'platform.pcEa': 'PC / EA App'
    ,'platform.pcBattleNet': 'PC / Battle.net (Blizzard)'
    ,'platform.pcUbisoft': 'PC / Ubisoft Connect'
    ,'platform.pcGog': 'PC / GOG'
    ,'platform.pcXboxApp': 'PC / Xbox App (Game Pass)'
    ,'platform.pcRiot': 'PC / Riot Client'
    ,'platform.pcOtherLauncher': 'PC / Autre lanceur'
    ,'owned.pcEpic': 'PC / Epic Games'
    ,'owned.pcEa': 'PC / EA App'
    ,'owned.pcBattleNet': 'PC / Battle.net (Blizzard)'
    ,'owned.pcUbisoft': 'PC / Ubisoft Connect'
    ,'owned.pcGog': 'PC / GOG'
    ,'owned.pcXboxApp': 'PC / Xbox App (Game Pass)'
    ,'owned.pcRiot': 'PC / Riot Client'
    ,'owned.pcOtherLauncher': 'PC / Autre lanceur'
    /* v1.1.2: sélecteur intelligent des plateformes dans l'éditeur. */
    ,'editor.showAllPlatforms': 'Voir toutes les plateformes de ce jeu'
    ,'editor.showAllGamePlatforms': 'Voir toutes les plateformes de ce jeu'
    ,'editor.platformFiltered': 'Filtré selon vos consoles et la disponibilité du jeu'
    ,'editor.platformNoMatch': 'Aucune de vos consoles ne correspond au jeu : toutes les plateformes sont affichées'
    ,'editor.platformAllShown': 'Affichage de toutes les plateformes'
    ,'editor.platformGameAllShown': 'Affichage de toutes les plateformes de ce jeu'
    ,'meta.platforms': 'Plateformes'
  };
})();
