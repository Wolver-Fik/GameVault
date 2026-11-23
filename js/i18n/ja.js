/* GameVault i18n: 日本語. Registers itself in window.GVI18N.locales. */
(function () {
  var G = window.GVI18N || (window.GVI18N = { locales: {} });
  G.locales.ja = {
    code: 'ja',
    name: '日本語',
    'app.tagline': 'コレクション • プレイ予定 • プレイ時間',
    'lang.label': '言語',
    'lang.aria': '言語',
    'btn.random': 'ランダムに選ぶ',
    'btn.backup': 'バックアップ',
    'btn.add': 'ゲームを追加',
    'stats.aria': 'コレクションの概要',
    'stat.games': 'ゲーム数',
    'stat.hours': 'プレイ時間',
    'stat.completed': 'クリア済み',
    'stat.favoritePlatform': 'お気に入りの機種',
    'panel.collection': 'コレクションの状態',
    'panel.platforms': '機種別',
    'tabs.all': 'すべて',
    'tabs.aria': '状態で絞り込む',
    'search.placeholder': 'タイトルで検索  ( / )',
    'filter.platform': 'すべての機種',
    'filter.genre': 'すべてのジャンル',
    'sort.aria': '並び替え',
    'sort.recent': '新しい順',
    'sort.name': '名前 A–Z',
    'sort.hours': 'プレイ時間が長い順',
    'sort.score': '評価が高い順',
    'sort.year': '発売年順',
    'filter.platformAria': '機種',
    'filter.genreAria': 'ジャンル',
    'status.jugando': 'プレイ中',
    'status.pendiente': 'プレイ予定',
    'status.completado': 'クリア済み',
    'status.platino': 'プラチナ 100%',
    'status.abandonado': '中断',
    'platform.pc': 'PC',
    'platform.steamDeck': 'Steam Deck',
    'platform.ps5': 'PS5',
    'platform.ps4': 'PS4',
    'platform.ps2': 'PS2',
    'platform.xbox': 'Xbox Series X|S',
    'platform.switch': 'Nintendo Switch',
    'platform.gba': 'Game Boy Advance (GBA)',
    'platform.emulator': 'エミュレーター',
    'platform.retro': 'レトロ',
    'genre.action': 'アクション',
    'genre.adventure': 'アドベンチャー',
    'genre.rpg': 'RPG',
    'genre.platformer': 'プラットフォーマー',
    'genre.shooter': 'シューティング',
    'genre.strategy': 'ストラテジー',
    'genre.sports': 'スポーツ',
    'genre.racing': 'レース',
    'genre.horror': 'ホラー',
    'genre.puzzle': 'パズル',
    'genre.indie': 'インディー',
    'genre.fighting': '格闘',
    'genre.simulation': 'シミュレーション',
    'genre.survival': 'サバイバル',
    'genre.sandbox': 'サンドボックス',
    'genre.open_world': 'オープンワールド',
    'genre.metroidvania': 'メトロイドヴァニア',
    'genre.roguelike': 'ローグライク / ローグライト',
    'genre.soulslike': 'ソウルズライク',
    'genre.stealth': 'ステルス',
    'genre.visual_novel': 'ビジュアルノベル',
    'genre.rhythm': 'リズム / 音楽',
    'genre.mmo': 'MMO',
    'genre.survival_horror': 'サバイバルホラー',
    'genre.action_adventure': 'アクションアドベンチャー',
    'genre.action_rpg': 'アクションRPG',
    'genre.tactical_rpg': 'タクティカルRPG',
    'genre.puzzle_platformer': 'パズルプラットフォーマー',
    'genre.beat_em_up': 'Beat \'em up',
    'genre.hack_and_slash': 'Hack and slash',
    'genre.shoot_em_up': 'Shoot \'em up',
    'genre.point_and_click': 'Point & Click',
    'genre.tower_defense': 'Tower Defense',
    'genre.management': '経営・街づくり',
    'genre.card_battler': 'カード / デッキビルダー',
    'genre.party': 'パーティー / ローカルマルチ',
    'genre.other': 'その他',
    'stats.pendingInProgress': '予定 {pend} 件 · 進行中 {play} 件',
    'stats.avgHours': '1 ゲームあたり平均 {hours} 時間',
    'stats.noHours': 'まだ時間が記録されていません',
    'stats.platinumPart': ' · {n} 件が 100%',
    'stats.avgScorePart': ' · 平均評価 {score}',
    'stats.platformDetail': '{n} ゲーム · {h} 時間',
    'stats.addFirst': '最初のゲームを追加しましょう',
    'stats.noData': 'まだデータがありません。',
    'card.noGenre': 'ジャンルなし',
    'card.noPlatform': '機種なし',
    'editor.coverInvalidUrl': '有効な http(s) 画像URLを入力してください。',
    'card.editAria': '{title} を編集',
    'card.addHourAria': '{title} に 1 時間追加',
    'card.example': 'サンプル',
    'empty.libraryTitle': 'ライブラリは空です',
    'empty.libraryText': '最初のゲームを追加して管理を始めましょう。',
    'empty.addButton': 'ゲームを追加',
    'empty.filterTitle': '条件に一致するゲームがありません',
    'empty.filterText': '別の状態・機種・検索語を試してください。',
    'empty.clearButton': 'フィルターを解除',
    'note.examplesTitle': 'サンプルのゲームを表示しています。',
    'note.examplesText': '編集、追加、またはまとめて削除できます。',
    'note.clearExamples': 'サンプルを削除',
    'note.storageTitle': 'このブラウザーはデータを保存していません。',
    'note.storageText': 'プライベートウィンドウの可能性があります。バックアップを使用してデータを守りましょう。',
    'editor.addTitle': 'ゲームを追加',
    'editor.editTitle': 'ゲームを編集',
    'editor.title': 'タイトル',
    'editor.autofill': '情報を自動入力',
    'editor.autofillSearching': '{lang}で情報を検索中…',
    'editor.autofillDone': '完了: {list}',
    'editor.autofillNothing': '{lang}でこのタイトルの情報が見つかりませんでした。',
    'editor.autofillError': '情報を入力できませんでした。接続を確認してください。',
    'meta.cover': 'カバー',
    'meta.summary': 'あらすじ',
    'editor.cover': 'カバー',
    'editor.platform': '機種',
    'editor.genre': 'ジャンル',
    'editor.releaseDate': '発売年 / 発売日',
    'editor.releasePlaceholder': '2017 または 2022-02-25',
    'editor.developer': '開発元 / スタジオ',
    'editor.developerPlaceholder': 'Team Cherry、FromSoftware...',
    'editor.summary': 'あらすじ',
    'editor.summaryPlaceholder': '短い説明（1〜2行）...',
    'editor.status': '状態',
    'editor.hours': 'プレイ時間',
    'editor.score': '自分の評価',
    'editor.notes': 'メモ',
    'editor.platformPlaceholder': 'プラットフォームを選択...',
    'editor.platformManual': '別のプラットフォームを手入力...',
    'editor.platformManualPlaceholder': 'プラットフォームを入力...',
    'editor.genrePlaceholder': 'RPG、アクション...',
    'editor.coverFetch': 'カバーを検索',
    'editor.coverUpload': '画像をアップロード',
    'editor.coverRemove': '削除',
    'editor.coverUrlPlaceholder': 'https://... 画像URL',
    'editor.coverUrlApply': 'URLを使用',
    'editor.coverNone': 'カバーなし：イニシャルとグラデーションを表示します。',
    'editor.coverWiki': 'カバーを自動取得しました。',
    'editor.coverFile': 'ローカル画像を読み込みました。',
    'editor.coverUrl': 'カバーURLを適用しました。',
    'editor.coverManual': 'カバーを設定しました。',
    'editor.coverSearching': 'カバーを検索中…',
    'editor.coverFound': 'カバーが見つかりました。',
    'editor.coverNotFound': 'このタイトルのカバーは見つかりませんでした。',
    'editor.coverError': 'カバーを検索できませんでした。接続を確認してください。',
    'editor.scoreAria': '1 から 10 の評価',
    'editor.notesPlaceholder': '章、未クリアのクエスト、やめた理由...',
    'editor.delete': '削除',
    'editor.deleteConfirm': '確認：ゲームを削除します',
    'editor.cancel': 'キャンセル',
    'editor.save': '保存',
    'editor.errTitle': 'ゲームのタイトルを入力してください。',
    'roulette.title': '今日は何をプレイ？',
    'roulette.label': 'プレイ予定から選ぶ（機種）：',
    'roulette.allPlatforms': 'すべての機種',
    'roulette.close': '閉じる',
    'roulette.again': 'もう一度',
    'roulette.start': 'プレイを開始',
    'roulette.shuffling': '選択中…',
    'roulette.empty': '条件に合うプレイ予定のゲームがありません。',
    'roulette.pendingCount': '予定 {n} 件',
    'roulette.score': '評価：{n}/10',
    'roulette.noGenre': 'ジャンルなし',
    'backup.title': 'バックアップ',
    'backup.description': 'データはこのブラウザー内にあります。このテキストをコピーして安全な場所に保存してください。別の端末に移す場合は、そこに貼り付けて「置き換える」を押してください。',
    'backup.close': '閉じる',
    'backup.exportJson': 'JSONを書き出す',
    'backup.exportCsv': 'CSVを書き出す',
    'backup.copy': 'コピー',
    'backup.copyFallback': 'テキストを選択しました。Ctrl+C または端末のメニューでコピーしてください。',
    'backup.copied': 'コピーしました。',
    'backup.import': 'このテキストでライブラリを置き換える',
    'backup.importConfirm': '確認：現在のデータは失われます',
    'backup.jsonExported': 'JSONを書き出しました。',
    'backup.csvExported': 'CSVを書き出しました。',
    'backup.imported': 'ライブラリを復元しました。',
    'backup.importError': '有効なバックアップではありません。変更はありません。',
    'game.untitled': '無題',
    'sample.summary1': '孤独な騎士が昆虫の広大な地下王国を探索し、秘密を発見しながら古の守護者たちと戦う。',
    'sample.summary2': '追放された旅人がエルデンの環を修復し、エルデンロードになるため広大な地を巡る。',
    'sample.summary3': 'ザグレウスが神々の加護と個性的な住人たちの助けを借りて、冥界から脱出しようと戦う。',
    'sample.summary4': '記憶を失った探偵が衰退する街で殺人事件を追いながら、砕けた心を少しずつ取り戻していく。',
    'sample.summary5': '転校生の少年が怪盗としての二重生活を送り、汚れた大人たちの心を盗んで変えようとする。',
    'sample.summary6': 'サムス・アランはX寄生虫の感染が銀河を内側から脅かすため、SR388へ戻る。',
    'sample.summary7': '街を離れ、農作業や釣りをしながらペリカンタウンの人々と交流する新しい生活を始めよう。',
    'sample.summary8': 'クラウド・ストライフは抵抗組織に加わり、惑星の生命を吸い尽くす巨大企業を止めようとする。',
    'sample.note1': '涙の街へ向かっています。',
    'sample.note2': 'おすすめ。ゆっくり進めましょう。',
    'sample.note5': '第三の宮殿でやめました。',
    'sample.note6': 'エミュレーター経由。'
    ,'btn.recommend': 'ゲームを提案'
    ,'btn.owned': '自分のゲーム機'
    ,'filter.ownedOnly': '自分のゲーム機のみ'
    ,'filter.ownedOnlyTitle': '表示中: {list}'
    ,'owned.title': '自分のゲーム機'
    ,'owned.description': '持っているゲーム機やデバイスを選択してください。未設定の場合はすべて利用可能とみなします。'
    ,'owned.aria': '自分のゲーム機'
    ,'owned.close': '閉じる'
    ,'owned.all': 'すべて'
    ,'owned.save': '保存'
    ,'owned.selected': '{n} 件選択'
    ,'owned.noneSelected': '未選択 — すべて利用可能とみなします。'
    ,'owned.allAssumed': '未設定: すべて利用可能とみなします。'
    ,'owned.pcSteam': 'PC / Steam'
    ,'owned.ps5': 'PS5'
    ,'owned.ps4': 'PS4'
    ,'owned.ps3': 'PS3'
    ,'owned.xboxSeries': 'Xbox Series X|S'
    ,'owned.xboxOne': 'Xbox One'
    ,'owned.switch': 'Nintendo Switch'
    ,'owned.gba': 'Game Boy Advance (GBA)'
    ,'owned.retroEmulator': 'レトロ / エミュレーター'
    ,'platform.retroEmulator': 'レトロ / エミュレーター'
    ,'owned.mobile': 'モバイル (iOS / Android)'
    ,'platform.ps3': 'PS3'
    ,'platform.xboxSeries': 'Xbox Series X|S'
    ,'platform.xboxOne': 'Xbox One'
    ,'platform.mobile': 'モバイル (iOS / Android)'
    ,'editor.genres': 'ジャンル'
    ,'editor.genresAria': 'ジャンル'
    ,'editor.editAllGenres': '+ すべてのジャンルを編集'
    ,'editor.viewAllGenres': 'すべてのジャンルを表示'
    ,'editor.collapseGenres': 'ジャンルを折りたたむ'
    ,'editor.genresHelp': 'ジャンルを1つ以上選択してください。'
    ,'recommend.title': 'おすすめのゲーム'
    ,'recommend.reason': '{genres} への興味に基づくおすすめです'
    ,'recommend.reasonOwned': '{platforms} 向けの {genres} に基づくおすすめです'
    ,'recommend.reasonEmpty': 'ジャンルが設定されたクリア済み・100%・未プレイのゲームを追加するとおすすめが表示されます。'
    ,'recommend.genres': 'ジャンル'
    ,'recommend.platform': 'おすすめのプラットフォーム'
    ,'recommend.developer': '開発元'
    ,'recommend.year': '年'
    ,'recommend.summary': 'あらすじ'
    ,'recommend.unknown': '不明'
    ,'recommend.noSummary': 'あらすじはありません。'
    ,'recommend.anyPlatform': '任意のプラットフォーム'
    ,'recommend.searching': 'おすすめを検索中…'
    ,'recommend.noCandidates': 'これらのジャンルとゲーム機に合う新しい候補が見つかりませんでした。ゲームを追加するか、ゲーム機の設定を変更してください。'
    ,'recommend.error': 'おすすめを取得できませんでした。接続を確認してもう一度お試しください。'
    ,'recommend.addPending': '+ 未プレイに追加'
    ,'recommend.again': '別のおすすめ'
    ,'recommend.close': '閉じる'
    ,'recommend.added': 'おすすめを未プレイに追加しました'
    /* コンソール・携帯機・レトロの完全カタログ (v1.0.7 で拡張)。 */
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
    ,'owned.group.pc': 'PC・PC携帯機'
    ,'owned.group.playstation': 'PlayStation'
    ,'owned.group.nintendoHome': 'Nintendo 据え置き・ハイブリッド'
    ,'owned.group.nintendoPortable': 'Nintendo 携帯機'
    ,'owned.group.xboxRetro': 'Xbox・セガ・レトロ'
    /* v1.0.8: メインビュー、コンソール別のゲーム、"/ エミュレーター"、PC ランチャー。 */
    ,'view.aria': 'メインビュー'
    ,'view.collection': 'コレクション'
    ,'view.consoles': 'マイコンソール'
    ,'console.gamesTitle': 'コンソール別のゲーム'
    ,'console.description': '機種またはシステム別に整理したライブラリです。'
    ,'console.empty': 'コンソール別に表示できるゲームはまだありません。'
    ,'platform.pcSteam': 'PC / Steam'
    ,'platform.pcEmulator': 'PC / エミュレーター'
    ,'platform.ps4Emulator': 'PS4 / エミュレーター'
    ,'platform.ps3Emulator': 'PS3 / エミュレーター'
    ,'platform.switchEmulator': 'Switch / エミュレーター'
    ,'owned.pcEmulator': 'PC / エミュレーター'
    ,'owned.ps4Emulator': 'PS4 / エミュレーター'
    ,'owned.ps3Emulator': 'PS3 / エミュレーター'
    ,'owned.switchEmulator': 'Switch / エミュレーター'
    /* v1.0.8: PC クライアント/ランチャー (platform.* と owned.* は同じ一覧). */
    ,'platform.pcEpic': 'PC / Epic Games'
    ,'platform.pcEa': 'PC / EA App'
    ,'platform.pcBattleNet': 'PC / Battle.net (Blizzard)'
    ,'platform.pcUbisoft': 'PC / Ubisoft Connect'
    ,'platform.pcGog': 'PC / GOG'
    ,'platform.pcXboxApp': 'PC / Xbox App (Game Pass)'
    ,'platform.pcRiot': 'PC / Riot Client'
    ,'platform.pcOtherLauncher': 'PC / その他のランチャー'
    ,'owned.pcEpic': 'PC / Epic Games'
    ,'owned.pcEa': 'PC / EA App'
    ,'owned.pcBattleNet': 'PC / Battle.net (Blizzard)'
    ,'owned.pcUbisoft': 'PC / Ubisoft Connect'
    ,'owned.pcGog': 'PC / GOG'
    ,'owned.pcXboxApp': 'PC / Xbox App (Game Pass)'
    ,'owned.pcRiot': 'PC / Riot Client'
    ,'owned.pcOtherLauncher': 'PC / その他のランチャー'
    /* v1.1.2: 編集画面のスマートなプラットフォーム選択。 */
    ,'editor.showAllPlatforms': 'このゲームのすべてのプラットフォームを表示'
    ,'editor.showAllGamePlatforms': 'このゲームのすべてのプラットフォームを表示'
    ,'editor.platformFiltered': 'お持ちの本体とゲームの対応状況で絞り込み中'
    ,'editor.platformNoMatch': 'お持ちの本体と一致しませんでした。すべてのプラットフォームを表示します'
    ,'editor.platformAllShown': 'すべてのプラットフォームを表示中'
    ,'editor.platformGameAllShown': 'このゲームのすべてのプラットフォームを表示しています'
    ,'meta.platforms': 'プラットフォーム'
  };
})();
