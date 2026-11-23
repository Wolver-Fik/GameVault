/* GameVault i18n: Português. Registers itself in window.GVI18N.locales. */
(function () {
  var G = window.GVI18N || (window.GVI18N = { locales: {} });
  G.locales.pt = {
    code: 'pt',
    name: 'Português',
    'app.tagline': 'COLEÇÃO • LISTA • HORAS',
    'lang.label': 'Idioma',
    'lang.aria': 'Idioma',
    'btn.random': 'Escolher aleatoriamente',
    'btn.backup': 'Backup',
    'btn.add': 'Adicionar jogo',
    'stats.aria': 'Resumo da coleção',
    'stat.games': 'Jogos',
    'stat.hours': 'Horas jogadas',
    'stat.completed': 'Concluído',
    'stat.favoritePlatform': 'Plataforma favorita',
    'panel.collection': 'Estado da coleção',
    'panel.platforms': 'Por plataforma',
    'tabs.all': 'Todos',
    'tabs.aria': 'Filtrar por estado',
    'search.placeholder': 'Buscar por título  ( / )',
    'filter.platform': 'Todas as plataformas',
    'filter.genre': 'Todos os gêneros',
    'sort.aria': 'Ordenar',
    'sort.recent': 'Mais recentes',
    'sort.name': 'Nome A–Z',
    'sort.hours': 'Mais horas',
    'sort.score': 'Melhor nota',
    'sort.year': 'Ano de lançamento',
    'filter.platformAria': 'Plataforma',
    'filter.genreAria': 'Gênero',
    'status.jugando': 'Jogando',
    'status.pendiente': 'Pendente',
    'status.completado': 'Concluído',
    'status.platino': 'Platina 100%',
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
    'platform.retro': 'Retrô',
    'genre.action': 'Ação',
    'genre.adventure': 'Aventura',
    'genre.rpg': 'RPG',
    'genre.platformer': 'Plataforma',
    'genre.shooter': 'Tiro',
    'genre.strategy': 'Estratégia',
    'genre.sports': 'Esportes',
    'genre.racing': 'Corrida',
    'genre.horror': 'Terror',
    'genre.puzzle': 'Quebra-cabeça',
    'genre.indie': 'Indie',
    'genre.fighting': 'Luta',
    'genre.simulation': 'Simulação',
    'genre.survival': 'Sobrevivência',
    'genre.sandbox': 'Sandbox',
    'genre.open_world': 'Mundo aberto',
    'genre.metroidvania': 'Metroidvania',
    'genre.roguelike': 'Roguelike / Roguelite',
    'genre.soulslike': 'Soulslike',
    'genre.stealth': 'Furtivo',
    'genre.visual_novel': 'Novela visual',
    'genre.rhythm': 'Ritmo / Musical',
    'genre.mmo': 'MMO',
    'genre.survival_horror': 'Terror e sobrevivência',
    'genre.action_adventure': 'Ação e aventura',
    'genre.action_rpg': 'RPG de ação',
    'genre.tactical_rpg': 'RPG tático',
    'genre.puzzle_platformer': 'Puzzle-plataforma',
    'genre.beat_em_up': 'Beat \'em up',
    'genre.hack_and_slash': 'Hack and slash',
    'genre.shoot_em_up': 'Shoot \'em up',
    'genre.point_and_click': 'Point & Click',
    'genre.tower_defense': 'Tower Defense',
    'genre.management': 'Gestão e construção',
    'genre.card_battler': 'Cartas / Deckbuilder',
    'genre.party': 'Party / Multijogador local',
    'genre.other': 'Outro',
    'stats.pendingInProgress': '{pend} pendentes · {play} em andamento',
    'stats.avgHours': 'Média de {hours} h por jogo',
    'stats.noHours': 'Ainda sem horas',
    'stats.platinumPart': ' · {n} a 100%',
    'stats.avgScorePart': ' · nota média {score}',
    'stats.platformDetail': '{n} jogos · {h} h',
    'stats.addFirst': 'Adicione seu primeiro jogo',
    'stats.noData': 'Ainda sem dados.',
    'card.noGenre': 'Sem gênero',
    'card.noPlatform': 'Sem plataforma',
    'editor.coverInvalidUrl': 'Informe uma URL de imagem http(s) válida.',
    'card.editAria': 'Editar {title}',
    'card.addHourAria': 'Adicionar uma hora a {title}',
    'card.example': 'Exemplo',
    'empty.libraryTitle': 'Sua biblioteca está vazia',
    'empty.libraryText': 'Adicione seu primeiro jogo para começar a acompanhar.',
    'empty.addButton': 'Adicionar jogo',
    'empty.filterTitle': 'Nada corresponde a esses filtros',
    'empty.filterText': 'Tente outro estado, plataforma ou busca.',
    'empty.clearButton': 'Limpar filtros',
    'note.examplesTitle': 'Você está vendo jogos de exemplo.',
    'note.examplesText': 'Edite-os, adicione os seus ou exclua todos de uma vez.',
    'note.clearExamples': 'Excluir exemplos',
    'note.storageTitle': 'Este navegador não está salvando seus dados.',
    'note.storageText': 'Pode ser uma janela privada. Use o Backup para não perder nada.',
    'editor.addTitle': 'Adicionar jogo',
    'editor.editTitle': 'Editar jogo',
    'editor.title': 'Título',
    'editor.autofill': 'Preencher ficha',
    'editor.autofillSearching': 'A procurar dados em {lang}…',
    'editor.autofillDone': 'Concluído: {list}',
    'editor.autofillNothing': 'Nenhum dado encontrado em {lang} para este título.',
    'editor.autofillError': 'Não foi possível preencher a ficha. Verifique sua conexão.',
    'meta.cover': 'Capa',
    'meta.summary': 'Sinopse',
    'editor.cover': 'Capa',
    'editor.platform': 'Plataforma',
    'editor.genre': 'Gênero',
    'editor.releaseDate': 'Ano / Data de lançamento',
    'editor.releasePlaceholder': '2017 ou 2022-02-25',
    'editor.developer': 'Desenvolvedor / Estúdio',
    'editor.developerPlaceholder': 'Team Cherry, FromSoftware...',
    'editor.summary': 'Sinopse',
    'editor.summaryPlaceholder': 'Descrição curta (1-2 linhas)...',
    'editor.status': 'Estado',
    'editor.hours': 'Horas jogadas',
    'editor.score': 'Minha nota',
    'editor.notes': 'Notas',
    'editor.platformPlaceholder': 'Seleciona uma plataforma...',
    'editor.platformManual': 'Digitar outra manualmente...',
    'editor.platformManualPlaceholder': 'Escreva uma plataforma...',
    'editor.genrePlaceholder': 'RPG, Ação...',
    'editor.coverFetch': 'Buscar capa',
    'editor.coverUpload': 'Enviar imagem',
    'editor.coverRemove': 'Remover',
    'editor.coverUrlPlaceholder': 'https://... URL da imagem',
    'editor.coverUrlApply': 'Usar URL',
    'editor.coverNone': 'Sem capa: iniciais e degradê serão exibidos.',
    'editor.coverWiki': 'Capa obtida automaticamente.',
    'editor.coverFile': 'Imagem local carregada.',
    'editor.coverUrl': 'URL da capa aplicada.',
    'editor.coverManual': 'Capa definida.',
    'editor.coverSearching': 'Buscando capa…',
    'editor.coverFound': 'Capa encontrada.',
    'editor.coverNotFound': 'Nenhuma capa encontrada para este título.',
    'editor.coverError': 'Não foi possível buscar a capa. Verifique sua conexão.',
    'editor.scoreAria': 'Nota de 1 a 10',
    'editor.notesPlaceholder': 'Capítulo, missão pendente, por que parei...',
    'editor.delete': 'Excluir',
    'editor.deleteConfirm': 'Confirmar: o jogo será excluído',
    'editor.cancel': 'Cancelar',
    'editor.save': 'Salvar',
    'editor.errTitle': 'Digite o título do jogo.',
    'roulette.title': 'O que jogar hoje?',
    'roulette.label': 'Escolher entre os pendentes de',
    'roulette.allPlatforms': 'Todas as plataformas',
    'roulette.close': 'Fechar',
    'roulette.again': 'Outro',
    'roulette.start': 'Começar a jogar',
    'roulette.shuffling': 'Escolhendo…',
    'roulette.empty': 'Não há jogos pendentes com esses filtros.',
    'roulette.pendingCount': '{n} pendentes',
    'roulette.score': 'Nota: {n}/10',
    'roulette.noGenre': 'Sem gênero',
    'backup.title': 'Backup',
    'backup.description': 'Seus dados ficam neste navegador. Copie este texto e guarde-o em local seguro. Para levar sua biblioteca a outro dispositivo, cole-o lá e pressione Substituir.',
    'backup.close': 'Fechar',
    'backup.exportJson': 'Exportar JSON',
    'backup.exportCsv': 'Exportar CSV',
    'backup.copy': 'Copiar',
    'backup.copyFallback': 'Texto selecionado. Copie com Ctrl+C ou pelo menu do celular.',
    'backup.copied': 'Copiado.',
    'backup.import': 'Substituir minha biblioteca por este texto',
    'backup.importConfirm': 'Confirmar: os dados atuais serão perdidos',
    'backup.jsonExported': 'JSON exportado.',
    'backup.csvExported': 'CSV exportado.',
    'backup.imported': 'Biblioteca restaurada.',
    'backup.importError': 'Este texto não é um backup válido. Nada foi alterado.',
    'game.untitled': 'Sem título',
    'sample.summary1': 'Um cavaleiro solitário explora um vasto reino subterrâneo de insetos, descobrindo segredos e enfrentando guardiões antigos.',
    'sample.summary2': 'Um exilado atravessa as Terras Intermediárias para reparar o Anel de Elden e tornar-se Senhor de Elden.',
    'sample.summary3': 'Zagreus luta para escapar do Submundo com a ajuda dos deuses e dos seus excêntricos habitantes.',
    'sample.summary4': 'Um detetive amnésico investiga um assassinato numa cidade em decadência enquanto reconstrói a mente fragmentada.',
    'sample.summary5': 'Um estudante transferido leva uma vida dupla como ladrão fantasma, roubando corações para mudar adultos corruptos.',
    'sample.summary6': 'Samus Aran regressa a SR388 quando uma infeção pelo parasita X ameaça a galáxia a partir de dentro.',
    'sample.summary7': 'Deixe a cidade para trás e comece uma nova vida cultivando, pescando e conhecendo a gente de Pelican Town.',
    'sample.summary8': 'Cloud Strife junta-se a um grupo de resistência para impedir que uma corporação poderosa esgote a vida do planeta.',
    'sample.note1': 'Vou para a Cidade das Lágrimas.',
    'sample.note2': 'Recomendado, começar com calma.',
    'sample.note5': 'Parei no terceiro palácio.',
    'sample.note6': 'Via emulador.'
    ,'btn.recommend': 'Recomende um jogo'
    ,'btn.owned': 'Meus consoles'
    ,'filter.ownedOnly': 'Somente meus consoles'
    ,'filter.ownedOnlyTitle': 'Mostrando jogos para: {list}'
    ,'owned.title': 'Meus consoles'
    ,'owned.description': 'Marque os consoles ou dispositivos que você possui. Se não configurar nenhum, todos serão assumidos como disponíveis.'
    ,'owned.aria': 'Meus consoles'
    ,'owned.close': 'Fechar'
    ,'owned.all': 'Todos'
    ,'owned.save': 'Salvar'
    ,'owned.selected': '{n} selecionados'
    ,'owned.noneSelected': 'Nenhum console selecionado — todos serão assumidos como disponíveis.'
    ,'owned.allAssumed': 'Sem consoles configurados: todos assumidos como disponíveis.'
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
    ,'owned.mobile': 'Celular (iOS / Android)'
    ,'platform.ps3': 'PS3'
    ,'platform.xboxSeries': 'Xbox Series X|S'
    ,'platform.xboxOne': 'Xbox One'
    ,'platform.mobile': 'Celular (iOS / Android)'
    ,'editor.genres': 'Gêneros'
    ,'editor.genresAria': 'Gêneros'
    ,'editor.editAllGenres': '+ Editar todos os gêneros'
    ,'editor.viewAllGenres': 'Ver todos os gêneros'
    ,'editor.collapseGenres': 'Recolher gêneros'
    ,'editor.genresHelp': 'Selecione um ou vários gêneros.'
    ,'recommend.title': 'Um jogo recomendado para você'
    ,'recommend.reason': 'Com base no seu interesse por {genres}'
    ,'recommend.reasonOwned': 'Com base em {genres} para {platforms}'
    ,'recommend.reasonEmpty': 'Adicione jogos concluídos, com 100% ou pendentes com gêneros para receber recomendações.'
    ,'recommend.genres': 'Gêneros'
    ,'recommend.platform': 'Plataforma recomendada'
    ,'recommend.developer': 'Desenvolvedor'
    ,'recommend.year': 'Ano'
    ,'recommend.summary': 'Sinopse'
    ,'recommend.unknown': 'Desconhecido'
    ,'recommend.noSummary': 'Sem sinopse disponível.'
    ,'recommend.anyPlatform': 'Qualquer plataforma'
    ,'recommend.searching': 'Procurando uma recomendação…'
    ,'recommend.noCandidates': 'Não encontramos novos candidatos para esses gêneros e consoles. Tente adicionar mais jogos ou mudar seus consoles.'
    ,'recommend.error': 'Não foi possível obter uma recomendação. Verifique sua conexão e tente novamente.'
    ,'recommend.addPending': '+ Adicionar a Pendentes'
    ,'recommend.again': 'Outra recomendação'
    ,'recommend.close': 'Fechar'
    ,'recommend.added': 'Recomendação adicionada a Pendentes'
    /* Catálogo completo de consoles, portáteis e retrô (ampliado em v1.0.7). */
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
    ,'owned.group.pc': 'PC e portáteis PC'
    ,'owned.group.playstation': 'PlayStation'
    ,'owned.group.nintendoHome': 'Nintendo de mesa e híbridos'
    ,'owned.group.nintendoPortable': 'Portáteis Nintendo'
    ,'owned.group.xboxRetro': 'Xbox, Sega e retrô'
    /* v1.0.8: visualizações principais, jogos agrupados, variantes "/ Emulador" e launchers de PC. */
    ,'view.aria': 'Visualizações principais'
    ,'view.collection': 'Coleção'
    ,'view.consoles': 'Meus Consoles'
    ,'console.gamesTitle': 'Jogos por console'
    ,'console.description': 'Sua biblioteca agrupada por máquina ou sistema.'
    ,'console.empty': 'Ainda não há jogos para agrupar por console.'
    ,'platform.pcSteam': 'PC / Steam'
    ,'platform.pcEmulator': 'PC / Emulador'
    ,'platform.ps4Emulator': 'PS4 / Emulador'
    ,'platform.ps3Emulator': 'PS3 / Emulador'
    ,'platform.switchEmulator': 'Switch / Emulador'
    ,'owned.pcEmulator': 'PC / Emulador'
    ,'owned.ps4Emulator': 'PS4 / Emulador'
    ,'owned.ps3Emulator': 'PS3 / Emulador'
    ,'owned.switchEmulator': 'Switch / Emulador'
    /* v1.0.8: clientes/launchers de PC (mesmo catálogo em platform.* e owned.*). */
    ,'platform.pcEpic': 'PC / Epic Games'
    ,'platform.pcEa': 'PC / EA App'
    ,'platform.pcBattleNet': 'PC / Battle.net (Blizzard)'
    ,'platform.pcUbisoft': 'PC / Ubisoft Connect'
    ,'platform.pcGog': 'PC / GOG'
    ,'platform.pcXboxApp': 'PC / Xbox App (Game Pass)'
    ,'platform.pcRiot': 'PC / Riot Client'
    ,'platform.pcOtherLauncher': 'PC / Outro launcher'
    ,'owned.pcEpic': 'PC / Epic Games'
    ,'owned.pcEa': 'PC / EA App'
    ,'owned.pcBattleNet': 'PC / Battle.net (Blizzard)'
    ,'owned.pcUbisoft': 'PC / Ubisoft Connect'
    ,'owned.pcGog': 'PC / GOG'
    ,'owned.pcXboxApp': 'PC / Xbox App (Game Pass)'
    ,'owned.pcRiot': 'PC / Riot Client'
    ,'owned.pcOtherLauncher': 'PC / Outro launcher'
    /* v1.1.2: seletor inteligente de plataformas no editor. */
    ,'editor.showAllPlatforms': 'Ver todas as plataformas deste jogo'
    ,'editor.showAllGamePlatforms': 'Ver todas as plataformas deste jogo'
    ,'editor.platformFiltered': 'Filtrado pelas suas consolas e pela disponibilidade do jogo'
    ,'editor.platformNoMatch': 'Nenhuma das suas consolas corresponde ao jogo: a mostrar todas as plataformas'
    ,'editor.platformAllShown': 'A mostrar todas as plataformas'
    ,'editor.platformGameAllShown': 'A mostrar todas as plataformas deste jogo'
    ,'meta.platforms': 'Plataformas'
  };
})();
