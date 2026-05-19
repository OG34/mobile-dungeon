const STRINGS = {
  en: {
    // Nav
    nav_explore: 'Explore', nav_quests: 'Quests', nav_char: 'Character', nav_shop: 'Shop',
    // HUD
    hud_gold: 'Gold',
    // Explore screen
    step_counter: 'Explorations',
    day: '☀ Day', night: '🌙 Night',
    btn_explore: '⚔ EXPLORE',
    btn_boss: '💀 SHADOW KING — FINAL BOSS',
    // Combat buttons
    btn_attack: '⚔ Attack', btn_skills: '✨ Skills', btn_items: '🎒 Items', btn_flee: '🏃 Flee',
    btn_auto_off: '⚡ Auto: OFF', btn_auto_on: '⚡ Auto: ON',
    // Character screen
    char_title: 'Character', char_equip: 'Equipment', char_inv: 'Inventory',
    char_lv: 'Level', char_xp: 'XP', char_hp: 'HP', char_mp: 'MP',
    char_atk: 'ATK', char_def: 'DEF', char_maxhp: 'MaxHP', char_maxmp: 'MaxMP',
    char_kills: 'Kills', char_class: 'Class', char_mode: 'Mode',
    char_normal: 'Normal', char_hardcore: 'Hardcore',
    equip_empty: 'Empty',
    inv_tip: 'Tap to equip · Long press to sell',
    // Shop
    shop_title: 'Shop', shop_buy: 'Buy', shop_sell: 'Sell',
    // Quests
    quest_title: 'Quests', quest_daily: '⭐ Daily Quests', quest_hint: 'Complete quests for rewards!',
    quest_claim: '⭐ CLAIM DAILY BONUS',
    // Settings lang toggle
    lang_label: 'Language', lang_en: 'English', lang_de: 'Deutsch',
    // Common overlays
    close: '✖ Close', yes: '✔ Yes', no: '✖ No',
    err_gold: '❌ Not enough gold!', err_level: '❌ Level too low!',
    // Intro
    intro_name: 'Enter hero name:', intro_confirm: '▶ Start Adventure',
    // Welcome overlay
    welcome_title: 'WELCOME',
    welcome_body: '→ Tap EXPLORE to find your first monster\n→ Fight, collect items, level up\n→ Defeat the Shadow King to become legend',
    welcome_btn: "Let's go!",
    // Stat alloc
    stat_points: 'Stat Points available!',
    // More menu
    more_combat: '⚔ COMBAT', more_dungeons: '🏰 DUNGEONS', more_char: '👤 CHARACTER',
    more_info: '📊 INFO', more_system: '⚙ SYSTEM',
    // Log first message
    log_start: '⚔ Welcome! Tap EXPLORE to start your adventure!',
    // Area names
    area_forest:'Enchanted Forest', area_cave:'Goblin Caves', area_dungeon:'Dark Dungeon', area_graveyard:'Cursed Graveyard', area_castle:'Shadow Castle', area_volcanic:'Volcanic Ruins', area_void:'Void Realm', area_underwater:'Abyssal Kingdom', area_sky:'Sky Fortress', area_ice:'Ice Tundra', area_void_rift:'Dimensional Rift',
    // Log actions
    log_found:'found', log_bought:'purchased', log_sold:'sold', log_crafted:'crafted', log_defeated:'defeated',
    // Milestones
    ms_pick_class:'Choose your class', ms_reach_lv5:'Reach Level 5', ms_explore_cave:'Explore the Caves (LV 10)',
    ms_reach_lv15:'Reach Level 15', ms_dungeon:'Conquer the Dungeon (LV 20)', ms_pick_subclass:'Choose a Subclass',
    ms_graveyard:'Reach the Graveyard (LV 30)', ms_castle:'Storm the Castle (LV 40)', ms_reach_lv50:'Reach Level 50',
    ms_shadow_king:'Defeat the Shadow King', ms_prestige:'Prestige for eternal power', ms_legend:'Become a Legend',
  },
  de: {
    nav_explore: 'Erkunden', nav_quests: 'Quests', nav_char: 'Charakter', nav_shop: 'Shop',
    hud_gold: 'Gold',
    step_counter: 'Erkundungen',
    day: '☀️ Tag', night: '🌙 Nacht',
    btn_explore: '⚔ ERKUNDEN',
    btn_boss: '💀 SHADOW KING — ENDBOSS',
    btn_attack: '⚔ Angriff', btn_skills: '✨ Skills', btn_items: '🎒 Items', btn_flee: '🏃 Fliehen',
    btn_auto_off: '⚡ Auto: AUS', btn_auto_on: '⚡ Auto: AN',
    char_title: 'Charakter', char_equip: 'Ausrüstung', char_inv: 'Inventar',
    char_lv: 'Level', char_xp: 'XP', char_hp: 'HP', char_mp: 'MP',
    char_atk: 'ATK', char_def: 'DEF', char_maxhp: 'MaxHP', char_maxmp: 'MaxMP',
    char_kills: 'Kills', char_class: 'Klasse', char_mode: 'Modus',
    char_normal: 'Normal', char_hardcore: 'Hardcore',
    equip_empty: 'Leer',
    inv_tip: 'Antippen zum Ausrüsten · Lang drücken zum Verkaufen',
    shop_title: 'Shop', shop_buy: 'Kaufen', shop_sell: 'Verkaufen',
    quest_title: 'Quests', quest_daily: '⭐ Tagesquests', quest_hint: 'Schließe Quests ab für Belohnungen!',
    quest_claim: '⭐ TAGESBONUS HOLEN',
    lang_label: 'Sprache', lang_en: 'English', lang_de: 'Deutsch',
    close: '✖ Schließen', yes: '✔ Ja', no: '✖ Nein',
    err_gold: '❌ Kein Gold!', err_level: '❌ Level zu niedrig!',
    intro_name: 'Heldenname eingeben:', intro_confirm: '▶ Abenteuer starten',
    welcome_title: 'WILLKOMMEN',
    welcome_body: '→ Tippe ERKUNDEN für dein erstes Monster\n→ Kämpfe, sammle Items, steige auf\n→ Besiege den Shadow King um die Legende zu werden',
    welcome_btn: 'Los geht\'s!',
    stat_points: 'Stat-Punkte verfügbar!',
    more_combat: '⚔ KAMPF', more_dungeons: '🏰 DUNGEONS', more_char: '👤 CHARAKTER',
    more_info: '📊 INFO', more_system: '⚙ SYSTEM',
    log_start: '⚔ Willkommen! Drücke ERKUNDEN um dein Abenteuer zu starten!',
    // Area names
    area_forest:'Verzauberter Wald', area_cave:'Goblin-Höhlen', area_dungeon:'Dunkler Kerker', area_graveyard:'Verfluchter Friedhof', area_castle:'Schattenburg', area_volcanic:'Vulkanruinen', area_void:'Leererreich', area_underwater:'Abyssales Königreich', area_sky:'Himmelsfestung', area_ice:'Eistundra', area_void_rift:'Dimensionsriss',
    // Log actions
    log_found:'gefunden', log_bought:'gekauft', log_sold:'verkauft', log_crafted:'gecraftet', log_defeated:'besiegt',
    // Milestones
    ms_pick_class:'Wähle deine Klasse', ms_reach_lv5:'Erreiche Level 5', ms_explore_cave:'Erkunde die Höhlen (LV 10)',
    ms_reach_lv15:'Erreiche Level 15', ms_dungeon:'Bezwinge den Kerker (LV 20)', ms_pick_subclass:'Wähle eine Unterklasse',
    ms_graveyard:'Erreiche den Friedhof (LV 30)', ms_castle:'Stürme die Burg (LV 40)', ms_reach_lv50:'Erreiche Level 50',
    ms_shadow_king:'Besiege den Shadow King', ms_prestige:'Prestige für ewige Macht', ms_legend:'Werde zur Legende',
  }
};

function t(key) {
  const lang = (typeof G !== 'undefined' && G.lang) || 'en';
  return (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || key;
}
