/* GameVault i18n: Русский. Registers itself in window.GVI18N.locales. */
(function () {
  var G = window.GVI18N || (window.GVI18N = { locales: {} });
  G.locales.ru = {
    code: 'ru',
    name: 'Русский',
    'app.tagline': 'КОЛЛЕКЦИЯ • СПИСОК • ЧАСЫ',
    'lang.label': 'Язык',
    'lang.aria': 'Язык',
    'btn.random': 'Выбрать случайно',
    'btn.backup': 'Резервная копия',
    'btn.add': 'Добавить игру',
    'stats.aria': 'Сводка коллекции',
    'stat.games': 'Игры',
    'stat.hours': 'Часы игры',
    'stat.completed': 'Пройдено',
    'stat.favoritePlatform': 'Любимая платформа',
    'panel.collection': 'Состояние коллекции',
    'panel.platforms': 'По платформам',
    'tabs.all': 'Все',
    'tabs.aria': 'Фильтр по статусу',
    'search.placeholder': 'Поиск по названию  ( / )',
    'filter.platform': 'Все платформы',
    'filter.genre': 'Все жанры',
    'sort.aria': 'Сортировка',
    'sort.recent': 'Сначала новые',
    'sort.name': 'Название А–Я',
    'sort.hours': 'Больше часов',
    'sort.score': 'Высокая оценка',
    'sort.year': 'Год выпуска',
    'filter.platformAria': 'Платформа',
    'filter.genreAria': 'Жанр',
    'status.jugando': 'Играю',
    'status.pendiente': 'В планах',
    'status.completado': 'Пройдено',
    'status.platino': 'Платина 100%',
    'status.abandonado': 'Брошено',
    'platform.pc': 'ПК',
    'platform.steamDeck': 'Steam Deck',
    'platform.ps5': 'PS5',
    'platform.ps4': 'PS4',
    'platform.ps2': 'PS2',
    'platform.xbox': 'Xbox Series X|S',
    'platform.switch': 'Nintendo Switch',
    'platform.gba': 'Game Boy Advance (GBA)',
    'platform.emulator': 'Эмулятор',
    'platform.retro': 'Ретро',
    'genre.action': 'Экшен',
    'genre.adventure': 'Приключения',
    'genre.rpg': 'RPG',
    'genre.platformer': 'Платформер',
    'genre.shooter': 'Шутер',
    'genre.strategy': 'Стратегия',
    'genre.sports': 'Спорт',
    'genre.racing': 'Гонки',
    'genre.horror': 'Хоррор',
    'genre.puzzle': 'Головоломка',
    'genre.indie': 'Инди',
    'genre.fighting': 'Файтинг',
    'genre.simulation': 'Симулятор',
    'genre.survival': 'Выживание',
    'genre.sandbox': 'Песочница',
    'genre.open_world': 'Открытый мир',
    'genre.metroidvania': 'Метроидвания',
    'genre.roguelike': 'Рогалик / Роглит',
    'genre.soulslike': 'Соулслайк',
    'genre.stealth': 'Стелс',
    'genre.visual_novel': 'Визуальная новелла',
    'genre.rhythm': 'Ритм / Музыка',
    'genre.mmo': 'MMO',
    'genre.survival_horror': 'Хоррор выживания',
    'genre.action_adventure': 'Экшен-приключение',
    'genre.action_rpg': 'Action-RPG',
    'genre.tactical_rpg': 'Тактическая RPG',
    'genre.puzzle_platformer': 'Платформер-головоломка',
    'genre.beat_em_up': 'Beat \'em up',
    'genre.hack_and_slash': 'Hack and slash',
    'genre.shoot_em_up': 'Shoot \'em up',
    'genre.point_and_click': 'Point & Click',
    'genre.tower_defense': 'Tower Defense',
    'genre.management': 'Управление и строительство',
    'genre.card_battler': 'Карты / Deckbuilder',
    'genre.party': 'Party / Локальный мультиплеер',
    'genre.other': 'Другое',
    'stats.pendingInProgress': '{pend} в планах · {play} в процессе',
    'stats.avgHours': 'В среднем {hours} ч на игру',
    'stats.noHours': 'Пока без часов',
    'stats.platinumPart': ' · {n} на 100%',
    'stats.avgScorePart': ' · средняя оценка {score}',
    'stats.platformDetail': '{n} игр · {h} ч',
    'stats.addFirst': 'Добавьте первую игру',
    'stats.noData': 'Пока нет данных.',
    'card.noGenre': 'Без жанра',
    'card.noPlatform': 'Без платформы',
    'editor.coverInvalidUrl': 'Введите корректный URL изображения http(s).',
    'card.editAria': 'Изменить {title}',
    'card.addHourAria': 'Добавить час к {title}',
    'card.example': 'Пример',
    'empty.libraryTitle': 'Ваша библиотека пуста',
    'empty.libraryText': 'Добавьте первую игру, чтобы начать учёт.',
    'empty.addButton': 'Добавить игру',
    'empty.filterTitle': 'Ничего не найдено по фильтрам',
    'empty.filterText': 'Попробуйте другой статус, платформу или запрос.',
    'empty.clearButton': 'Сбросить фильтры',
    'note.examplesTitle': 'Вы видите примеры игр.',
    'note.examplesText': 'Отредактируйте их, добавьте свои или удалите все сразу.',
    'note.clearExamples': 'Удалить примеры',
    'note.storageTitle': 'Этот браузер не сохраняет ваши данные.',
    'note.storageText': 'Возможно, это приватное окно. Используйте резервную копию, чтобы ничего не потерять.',
    'editor.addTitle': 'Добавить игру',
    'editor.editTitle': 'Изменить игру',
    'editor.title': 'Название',
    'editor.autofill': 'Заполнить данные',
    'editor.autofillSearching': 'Ищем данные на {lang}…',
    'editor.autofillDone': 'Заполнено: {list}',
    'editor.autofillNothing': 'На {lang} не найдено данных для этого названия.',
    'editor.autofillError': 'Не удалось заполнить данные. Проверьте соединение.',
    'meta.cover': 'Обложка',
    'meta.summary': 'Описание',
    'editor.cover': 'Обложка',
    'editor.platform': 'Платформа',
    'editor.genre': 'Жанр',
    'editor.releaseDate': 'Год / Дата выпуска',
    'editor.releasePlaceholder': '2017 или 2022-02-25',
    'editor.developer': 'Разработчик / Студия',
    'editor.developerPlaceholder': 'Team Cherry, FromSoftware...',
    'editor.summary': 'Описание',
    'editor.summaryPlaceholder': 'Краткое описание (1-2 строки)...',
    'editor.status': 'Статус',
    'editor.hours': 'Часы игры',
    'editor.score': 'Моя оценка',
    'editor.notes': 'Заметки',
    'editor.platformPlaceholder': 'Выберите платформу...',
    'editor.platformManual': 'Ввести другую вручную...',
    'editor.platformManualPlaceholder': 'Введите платформу...',
    'editor.genrePlaceholder': 'RPG, Экшен...',
    'editor.coverFetch': 'Найти обложку',
    'editor.coverUpload': 'Загрузить изображение',
    'editor.coverRemove': 'Убрать',
    'editor.coverUrlPlaceholder': 'https://... URL изображения',
    'editor.coverUrlApply': 'Использовать URL',
    'editor.coverNone': 'Без обложки: будут показаны инициалы и градиент.',
    'editor.coverWiki': 'Обложка найдена автоматически.',
    'editor.coverFile': 'Локальное изображение загружено.',
    'editor.coverUrl': 'URL обложки применён.',
    'editor.coverManual': 'Обложка установлена.',
    'editor.coverSearching': 'Поиск обложки…',
    'editor.coverFound': 'Обложка найдена.',
    'editor.coverNotFound': 'Для этого названия обложка не найдена.',
    'editor.coverError': 'Не удалось найти обложку. Проверьте соединение.',
    'editor.scoreAria': 'Оценка от 1 до 10',
    'editor.notesPlaceholder': 'Глава, незавершённый квест, почему бросил...',
    'editor.delete': 'Удалить',
    'editor.deleteConfirm': 'Подтвердить: игра будет удалена',
    'editor.cancel': 'Отмена',
    'editor.save': 'Сохранить',
    'editor.errTitle': 'Введите название игры.',
    'roulette.title': 'Во что поиграем сегодня?',
    'roulette.label': 'Выбрать из запланированных на',
    'roulette.allPlatforms': 'Все платформы',
    'roulette.close': 'Закрыть',
    'roulette.again': 'Ещё',
    'roulette.start': 'Начать игру',
    'roulette.shuffling': 'Выбираем…',
    'roulette.empty': 'Нет запланированных игр с такими фильтрами.',
    'roulette.pendingCount': '{n} в планах',
    'roulette.score': 'Оценка: {n}/10',
    'roulette.noGenre': 'Без жанра',
    'backup.title': 'Резервная копия',
    'backup.description': 'Ваши данные хранятся в этом браузере. Скопируйте этот текст и сохраните его в безопасном месте. Чтобы перенести библиотеку на другое устройство, вставьте текст там и нажмите «Заменить».',
    'backup.close': 'Закрыть',
    'backup.exportJson': 'Экспорт JSON',
    'backup.exportCsv': 'Экспорт CSV',
    'backup.copy': 'Копировать',
    'backup.copyFallback': 'Текст выделен. Скопируйте его через Ctrl+C или меню телефона.',
    'backup.copied': 'Скопировано.',
    'backup.import': 'Заменить мою библиотеку этим текстом',
    'backup.importConfirm': 'Подтвердить: текущие данные будут потеряны',
    'backup.jsonExported': 'JSON экспортирован.',
    'backup.csvExported': 'CSV экспортирован.',
    'backup.imported': 'Библиотека восстановлена.',
    'backup.importError': 'Этот текст не является корректной копией. Ничего не изменено.',
    'game.untitled': 'Без названия',
    'sample.summary1': 'Одинокий рыцарь исследует огромное подземное королевство насекомых, раскрывая тайны и сражаясь с древними стражами.',
    'sample.summary2': 'Изгнанник странствует по Землям Между, чтобы починить кольцо Эльдена и стать лордом Эльдена.',
    'sample.summary3': 'Загрей пробивается из подземного мира с помощью богов и его эксцентричных жителей.',
    'sample.summary4': 'Детектив с амнезией расследует убийство в угасающем городе, собирая по кускам свою разбитую память.',
    'sample.summary5': 'Ученик-переводчик ведёт двойную жизнь вора-призрака, крадя сердца, чтобы изменить коррумпированных взрослых.',
    'sample.summary6': 'Самус Аран возвращается на SR388, когда заражение паразитом X угрожает галактике изнутри.',
    'sample.summary7': 'Оставьте город и начните новую жизнь: занимайтесь фермой, рыбалкой и знакомьтесь с жителями Pelican Town.',
    'sample.summary8': 'Клауд Страйф присоединяется к сопротивлению, чтобы помешать могущественной корпорации выкачать жизнь из планеты.',
    'sample.note1': 'Иду в Город слёз.',
    'sample.note2': 'Рекомендую проходить не спеша.',
    'sample.note5': 'Оставил в третьем дворце.',
    'sample.note6': 'Через эмулятор.'
    ,'btn.recommend': 'Посоветовать игру'
    ,'btn.owned': 'Мои консоли'
    ,'filter.ownedOnly': 'Только мои консоли'
    ,'filter.ownedOnlyTitle': 'Показаны игры для: {list}'
    ,'owned.title': 'Мои консоли'
    ,'owned.description': 'Отметьте консоли или устройства, которые у вас есть. Если ничего не настроено, считаются доступными все.'
    ,'owned.aria': 'Мои консоли'
    ,'owned.close': 'Закрыть'
    ,'owned.all': 'Все'
    ,'owned.save': 'Сохранить'
    ,'owned.selected': 'Выбрано: {n}'
    ,'owned.noneSelected': 'Консоли не выбраны — будут считаться доступными все.'
    ,'owned.allAssumed': 'Консоли не настроены: считаются доступными все.'
    ,'owned.pcSteam': 'PC / Steam'
    ,'owned.ps5': 'PS5'
    ,'owned.ps4': 'PS4'
    ,'owned.ps3': 'PS3'
    ,'owned.xboxSeries': 'Xbox Series X|S'
    ,'owned.xboxOne': 'Xbox One'
    ,'owned.switch': 'Nintendo Switch'
    ,'owned.gba': 'Game Boy Advance (GBA)'
    ,'owned.retroEmulator': 'Ретро / Эмулятор'
    ,'platform.retroEmulator': 'Ретро / Эмулятор'
    ,'owned.mobile': 'Мобильные (iOS / Android)'
    ,'platform.ps3': 'PS3'
    ,'platform.xboxSeries': 'Xbox Series X|S'
    ,'platform.xboxOne': 'Xbox One'
    ,'platform.mobile': 'Мобильные (iOS / Android)'
    ,'editor.genres': 'Жанры'
    ,'editor.genresAria': 'Жанры'
    ,'editor.editAllGenres': '+ Изменить все жанры'
    ,'editor.viewAllGenres': 'Показать все жанры'
    ,'editor.collapseGenres': 'Свернуть жанры'
    ,'editor.genresHelp': 'Выберите один или несколько жанров.'
    ,'recommend.title': 'Игра, рекомендованная для вас'
    ,'recommend.reason': 'На основе вашего интереса к {genres}'
    ,'recommend.reasonOwned': 'На основе {genres} для {platforms}'
    ,'recommend.reasonEmpty': 'Добавьте пройденные, завершённые на 100% или отложенные игры с жанрами для рекомендаций.'
    ,'recommend.genres': 'Жанры'
    ,'recommend.platform': 'Рекомендуемая платформа'
    ,'recommend.developer': 'Разработчик'
    ,'recommend.year': 'Год'
    ,'recommend.summary': 'Описание'
    ,'recommend.unknown': 'Неизвестно'
    ,'recommend.noSummary': 'Описание недоступно.'
    ,'recommend.anyPlatform': 'Любая платформа'
    ,'recommend.searching': 'Поиск рекомендации…'
    ,'recommend.noCandidates': 'Не найдено новых кандидатов для этих жанров и консолей. Добавьте больше игр или измените список консолей.'
    ,'recommend.error': 'Не удалось получить рекомендацию. Проверьте соединение и попробуйте снова.'
    ,'recommend.addPending': '+ Добавить в отложенные'
    ,'recommend.again': 'Другая рекомендация'
    ,'recommend.close': 'Закрыть'
    ,'recommend.added': 'Рекомендация добавлена в отложенные'
    /* Полный каталог консолей, портативных систем и ретро (расширен в v1.0.7). */
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
    ,'owned.group.pc': 'ПК и карманные ПК'
    ,'owned.group.playstation': 'PlayStation'
    ,'owned.group.nintendoHome': 'Nintendo: стационарные и гибридные'
    ,'owned.group.nintendoPortable': 'Nintendo: портативные'
    ,'owned.group.xboxRetro': 'Xbox, Sega и ретро'
    /* v1.0.8: основные вкладки, игры по консоли, варианты "/ Эмулятор" и лаунчеры ПК. */
    ,'view.aria': 'Основные вкладки'
    ,'view.collection': 'Коллекция'
    ,'view.consoles': 'Мои консоли'
    ,'console.gamesTitle': 'Игры по консоли'
    ,'console.description': 'Ваша библиотека, сгруппированная по устройству или системе.'
    ,'console.empty': 'Пока нет игр для группировки по консоли.'
    ,'platform.pcSteam': 'PC / Steam'
    ,'platform.pcEmulator': 'PC / Эмулятор'
    ,'platform.ps4Emulator': 'PS4 / Эмулятор'
    ,'platform.ps3Emulator': 'PS3 / Эмулятор'
    ,'platform.switchEmulator': 'Switch / Эмулятор'
    ,'owned.pcEmulator': 'PC / Эмулятор'
    ,'owned.ps4Emulator': 'PS4 / Эмулятор'
    ,'owned.ps3Emulator': 'PS3 / Эмулятор'
    ,'owned.switchEmulator': 'Switch / Эмулятор'
    /* v1.0.8: клиенты/лаунчеры ПК (одинаковый каталог в platform.* и owned.*). */
    ,'platform.pcEpic': 'PC / Epic Games'
    ,'platform.pcEa': 'PC / EA App'
    ,'platform.pcBattleNet': 'PC / Battle.net (Blizzard)'
    ,'platform.pcUbisoft': 'PC / Ubisoft Connect'
    ,'platform.pcGog': 'PC / GOG'
    ,'platform.pcXboxApp': 'PC / Xbox App (Game Pass)'
    ,'platform.pcRiot': 'PC / Riot Client'
    ,'platform.pcOtherLauncher': 'PC / Другой лаунчер'
    ,'owned.pcEpic': 'PC / Epic Games'
    ,'owned.pcEa': 'PC / EA App'
    ,'owned.pcBattleNet': 'PC / Battle.net (Blizzard)'
    ,'owned.pcUbisoft': 'PC / Ubisoft Connect'
    ,'owned.pcGog': 'PC / GOG'
    ,'owned.pcXboxApp': 'PC / Xbox App (Game Pass)'
    ,'owned.pcRiot': 'PC / Riot Client'
    ,'owned.pcOtherLauncher': 'PC / Другой лаунчер'
    /* v1.1.2: умный выбор платформы в редакторе. */
    ,'editor.showAllPlatforms': 'Показать все платформы этой игры'
    ,'editor.showAllGamePlatforms': 'Показать все платформы этой игры'
    ,'editor.platformFiltered': 'Фильтр по вашим консолям и доступности игры'
    ,'editor.platformNoMatch': 'Ни одна из ваших консолей не подходит — показаны все платформы'
    ,'editor.platformAllShown': 'Показаны все платформы'
    ,'editor.platformGameAllShown': 'Показаны все платформы этой игры'
    ,'meta.platforms': 'Платформы'
    /* v1.3.0: сессии, достижения, подборки и годовой обзор. */
    ,'view.wrapped': 'Итоги'
    ,'wrapped.title': 'Годовой обзор'
    ,'wrapped.desc': 'Часы, пройденные игры и рекорды по годам.'
    ,'wrapped.year': 'Год'
    ,'wrapped.yearAria': 'Год'
    ,'wrapped.aria': 'Годовой обзор'
    ,'wrapped.hoursYear': 'Часов сыграно'
    ,'wrapped.finishedYear': 'Игр пройдено'
    ,'wrapped.sessionsYear': 'Сессии'
    ,'wrapped.perfectYear': '100% пройдено'
    ,'wrapped.byYear': 'По годам'
    ,'wrapped.topGames': 'Чаще всего играли'
    ,'wrapped.byGenre': 'По жанрам'
    ,'wrapped.byPlatform': 'По платформам'
    ,'wrapped.allYears': 'Все годы'
    ,'wrapped.sessionTotal': '{n} сессий записано'
    ,'wrapped.perfectTotal': '{n} на 100%'
    ,'wrapped.minutesTotal': '{n} мин записано'
    ,'wrapped.achievementsDone': 'Достижения завершены'
    ,'wrapped.finishedShort': '{n} пройдено'
    ,'wrapped.noSessions': 'Запишите сессии, чтобы увидеть обзор.'
    ,'wrapped.noYears': 'Пока нет данных по годам.'
    ,'session.title': 'Игровые сессии'
    ,'session.hint': 'Каждая сессия добавляет часы игре и в годовой обзор.'
    ,'session.date': 'Дата'
    ,'session.hours': 'Часы'
    ,'session.minutes': 'Минуты'
    ,'session.note': 'Заметка (необязательно)'
    ,'session.add': '+ Сессия'
    ,'session.empty': 'Сессий пока нет.'
    ,'session.delete': 'Удалить сессию'
    ,'session.count': '{n} сессий · {h} ч'
    ,'session.added': 'Сессия записана'
    ,'session.deleted': 'Сессия удалена'
    ,'session.errDate': 'Выберите корректную дату.'
    ,'session.errDuration': 'Длительность должна быть больше 0.'
    ,'ach.title': 'Достижения / трофеи'
    ,'ach.unlocked': 'Получено'
    ,'ach.total': 'Всего'
    ,'ach.progress': '{p}% завершено'
    ,'ach.badge': '100%'
    ,'ach.platinum': 'Платина / 100%'
    ,'ach.hint': 'Оставьте 0, если достижений нет.'
    ,'coll.manage': 'Подборки'
    ,'coll.title': 'Подборки'
    ,'coll.description': 'Создайте свои списки и назначайте их играм в карточке.'
    ,'coll.namePlaceholder': 'Напр. Локальный кооп'
    ,'coll.create': 'Создать'
    ,'coll.aria': 'Подборки'
    ,'coll.selected': '{n} выбрано'
    ,'coll.empty': 'Подборок пока нет.'
    ,'coll.name': 'Название'
    ,'coll.delete': 'Удалить'
    ,'coll.deleteConfirm': 'Подтвердить'
    ,'coll.errName': 'Введите название.'
    ,'coll.errDuplicate': 'Такое название уже есть.'
    ,'coll.created': 'Подборка создана'
    ,'coll.removed': 'Подборка удалена'
    ,'filter.collection': 'Все подборки'
    ,'filter.collectionAria': 'Подборка'
    ,'stats.achPart': ' · {n} на 100%'
    ,'backup.reset': 'Сбросить данные'
    ,'backup.resetConfirm': 'Подтвердить сброс'
    ,'backup.resetDone': 'Данные сброшены'
    ,'backup.csvImported': 'Библиотека импортирована из CSV'
    ,'editor.price': 'Цена / стоимость покупки'
    ,'editor.pricePlaceholder': '0.00'
    ,'editor.currencyAria': 'Валюта'
    ,'editor.freeLabel': 'Стоимость'
    ,'editor.free': 'Бесплатно / подписка (0)'
    ,'editor.priceHint': 'Оставьте 0, если игра была бесплатной или по подписке.'
    ,'dlc.title': 'DLC и дополнения'
    ,'dlc.hint': 'Добавьте дополнения этой игры. Их часы входят в общую статистику, а цены — в инвестиции.'
    ,'dlc.name': 'Название дополнения'
    ,'dlc.namePlaceholder': 'Например, Shadow of the Erdtree'
    ,'dlc.statusLabel': 'Статус'
    ,'dlc.hoursLabel': 'Часов сыграно'
    ,'dlc.add': '+ Добавить DLC'
    ,'dlc.update': 'Обновить DLC'
    ,'dlc.empty': 'Пока нет дополнений.'
    ,'dlc.countHours': '{n} DLC · {h} ч'
    ,'dlc.free': 'Бесплатно'
    ,'dlc.editAria': 'Изменить {title}'
    ,'dlc.delete': 'Удалить DLC'
    ,'dlc.limit': 'Максимум 40 дополнений на игру.'
    ,'dlc.status.pendiente': 'В ожидании'
    ,'dlc.status.jugando': 'В процессе'
    ,'dlc.status.completado': 'Завершено'
    ,'dlc.status.platino': 'Платина 100%'
    ,'card.dlcCount': '{n} дополнений включено'
    ,'card.dlcShort': '{n} DLC'
    ,'invest.title': 'Инвестиции и ценность'
    ,'invest.desc': 'Общие расходы, разбивка по платформам и стоимость часа со всеми DLC.'
    ,'invest.mainCurrency': 'Основная валюта'
    ,'invest.total': 'Общие расходы'
    ,'invest.gamesWithPrice': '{n} платных · {free} бесплатных / по подписке'
    ,'invest.avgPrice': 'Средняя цена игры'
    ,'invest.avgHint': 'Учитываются только платные игры.'
    ,'invest.costHour': 'Стоимость часа игры'
    ,'invest.hourHint': 'За {hours} ч игры'
    ,'invest.byPlatform': 'Расходы по платформам'
    ,'invest.bestValue': 'Самые выгодные игры (часы за деньги)'
    ,'invest.rateHint': 'Приблизительный курс валют; задайте основную валюту, чтобы увидеть сводку.'
    ,'invest.hoursPerMoney': 'ч / {cur}'
    ,'invest.noRentable': 'Пока нет платных игр с часами.'
  };
})();
