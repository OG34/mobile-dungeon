const AREAS = [
  { id:'forest',    name:'Verzauberter Wald', icon:'🌲', min:1,  max:4,  foes:['slime','rat','goblin','wolf','mushroom_man','giant_spider'] },
  { id:'cave',      name:'Goblin-Höhlen',    icon:'🦇', min:3,  max:7,  foes:['goblin','bat','troll','rat','lizardman','dire_wolf'] },
  { id:'dungeon',   name:'Dunkler Kerker',   icon:'⛏',  min:6,  max:11, foes:['skeleton','goblin','wolf','bat','dark_mage'] },
  { id:'graveyard', name:'Verfluchter Friedhof',icon:'💀', min:9,  max:15, foes:['skeleton','zombie','ghost','vampire','wraith'] },
  { id:'castle',    name:'Schattenburg',     icon:'🏰', min:13, max:20, foes:['ghost','demon','dragon','corrupted_knight','dark_sorcerer'] },
  { id:'volcanic',  name:'Vulkanruinen',     icon:'🌋', min:21, max:28, foes:['fire_elemental','lava_golem','phoenix','magma_titan'] },
  { id:'void',      name:'Leererreich',      icon:'🌀', min:29, max:50, foes:['void_shade','shadow_spider','chaos_dragon','void_lich'] },
  { id:'underwater',name:'Abyssales Königreich',icon:'🌊', min:51, max:65, foes:['sea_serpent','coral_crab','deep_kraken'] },
  { id:'sky',       name:'Himmelsfestung',   icon:'⛅', min:66, max:80, foes:['storm_hawk','wind_giant','thunder_wyrm'] },
  { id:'ice',       name:'Eistundra',        icon:'❄',  min:81, max:99, foes:['ice_golem','frost_troll','blizzard_dragon','glacial_spirit'] },
  { id:'void_rift', name:'Dimensionsriss', icon:'🌀', min:1, max:50, foes:['void_lich','chaos_dragon','void_shade','shadow_spider','void_shade'], secret:true },
];

const FOES = {
  rat:      { name:'Ratte',    icon:'🐀', sprite:'rat',      hp:8,  atk:2,  def:0,  xp:5,   gold:[1,3],   status:null },
  slime:    { name:'Schleim', icon:'🫧', sprite:'slime',    hp:14, atk:4,  def:1,  xp:10,  gold:[1,5],   status:null },
  goblin:   { name:'Goblin',   icon:'👺', sprite:'goblin',   hp:22, atk:7,  def:2,  xp:18,  gold:[3,10],  status:{type:'stun',   chance:.25,turns:1,value:0} },
  bat:      { name:'Fledermaus',icon:'🦇', sprite:'bat',     hp:18, atk:8,  def:1,  xp:16,  gold:[2,7],   status:null },
  wolf:     { name:'Wolf',     icon:'🐺', sprite:'wolf',     hp:28, atk:9,  def:2,  xp:24,  gold:[2,8],   status:null },
  troll:    { name:'Troll',    icon:'👹', sprite:'troll',    hp:45, atk:12, def:5,  xp:40,  gold:[8,18],  status:null },
  skeleton: { name:'Skelett',  icon:'💀', sprite:'skeleton', hp:38, atk:11, def:4,  xp:35,  gold:[5,15],  status:null,                                          element:'undead', weakTo:'light' },
  zombie:   { name:'Zombie',   icon:'🧟', sprite:'zombie',   hp:50, atk:13, def:3,  xp:45,  gold:[6,16],  status:{type:'poison', chance:.35,turns:3,value:6},   element:'undead', weakTo:'light' },
  ghost:    { name:'Geist',    icon:'👻', sprite:'ghost',    hp:42, atk:15, def:6,  xp:55,  gold:[8,20],  status:{type:'stun',   chance:.20,turns:1,value:0},   element:'undead', weakTo:'light' },
  demon:    { name:'Dämon',    icon:'😈', sprite:'demon',    hp:70, atk:18, def:7,  xp:90,  gold:[15,40], status:{type:'burn',   chance:.30,turns:2,value:10},  element:'fire',   weakTo:'ice'   },
  dragon:         { name:'Drache',          icon:'🐉', sprite:'dragon',         hp:90,  atk:20, def:8,  xp:120, gold:[25,70],  status:{type:'burn',chance:.40,turns:3,value:12},  element:'fire', weakTo:'ice' },
  fire_elemental: { name:'Feuer-Elementar', icon:'🔥', sprite:'fire_elemental', hp:130, atk:28, def:10, xp:170, gold:[22,55],  status:{type:'burn',chance:.50,turns:2,value:12},  element:'fire', weakTo:'ice' },
  lava_golem:     { name:'Lava-Golem',      icon:'🌋', sprite:'lava_golem',     hp:180, atk:32, def:15, xp:230, gold:[32,80],  status:{type:'burn',chance:.40,turns:3,value:15},  element:'fire', weakTo:'ice' },
  phoenix:        { name:'Phönix',          icon:'🦅', sprite:'phoenix',        hp:145, atk:35, def:8,  xp:210, gold:[28,68],  status:{type:'burn',chance:.45,turns:2,value:14},  element:'fire', weakTo:'ice' },
  void_shade:     { name:'Leerenschatten',  icon:'🌑', sprite:'void_shade',     hp:165, atk:42, def:12, xp:290, gold:[42,105], status:{type:'stun',chance:.30,turns:1,value:0},   element:'void', weakTo:'light' },
  shadow_spider:  { name:'Schattenspinne',  icon:'🕷', sprite:'shadow_spider',  hp:195, atk:48, def:14, xp:340, gold:[55,130], status:{type:'poison',chance:.50,turns:4,value:18}, element:'void', weakTo:'light' },
  chaos_dragon:   { name:'Chaos-Drache',    icon:'🐲', sprite:'chaos_dragon',   hp:260, atk:58, def:18, xp:480, gold:[85,210], status:{type:'burn',chance:.50,turns:3,value:22},  element:'void', weakTo:'light' },
  sea_serpent:    { name:'Seeschlange',      icon:'🐍', sprite:'sea_serpent',    hp:320, atk:68, def:22, xp:600, gold:[100,260],status:{type:'poison',chance:.40,turns:3,value:25}, element:'water',weakTo:'lightning' },
  coral_crab:     { name:'Korallen-Krabbe', icon:'🦀', sprite:'coral_crab',     hp:380, atk:72, def:28, xp:680, gold:[115,290],status:{type:'stun',chance:.25,turns:1,value:0},   element:'water',weakTo:'lightning' },
  deep_kraken:    { name:'Tiefen-Kraken',   icon:'🦑', sprite:'deep_kraken',    hp:460, atk:82, def:24, xp:820, gold:[145,380],status:{type:'stun',chance:.35,turns:2,value:0},   element:'water',weakTo:'lightning' },
  storm_hawk:     { name:'Sturmfalke',       icon:'🦅', sprite:'storm_hawk',     hp:440, atk:90, def:20, xp:850, gold:[140,360],status:{type:'stun',chance:.30,turns:1,value:0},   element:'air',  weakTo:'earth' },
  wind_giant:     { name:'Windriese',        icon:'💨', sprite:'wind_giant',     hp:540, atk:98, def:30, xp:1000,gold:[180,460],status:null,                                        element:'air',  weakTo:'earth' },
  thunder_wyrm:   { name:'Donnerwurm',       icon:'⚡', sprite:'thunder_wyrm',   hp:620, atk:110,def:26, xp:1200,gold:[220,580],status:{type:'burn',chance:.45,turns:3,value:30},  element:'lightning',weakTo:'earth' },
  ice_golem:      { name:'Eis-Golem',        icon:'🧊', sprite:'ice_golem',      hp:700, atk:120,def:40, xp:1400,gold:[280,720],status:{type:'stun',chance:.30,turns:1,value:0},   element:'ice',  weakTo:'fire' },
  frost_troll:    { name:'Frost-Troll',      icon:'❄', sprite:'frost_troll',    hp:820, atk:130,def:35, xp:1600,gold:[320,850],status:{type:'poison',chance:.35,turns:3,value:40}, element:'ice',  weakTo:'fire' },
  blizzard_dragon:{ name:'Blizzard-Drache',  icon:'🌨', sprite:'blizzard_dragon',hp:1000,atk:150,def:45, xp:2000,gold:[450,1200],status:{type:'burn',chance:.50,turns:4,value:45},  element:'ice',  weakTo:'fire' },
  // NEW ENEMIES
  mushroom_man: { name:'Pilzmann',    icon:'🍄', sprite:'mushroom_man', hp:20, atk:5,  def:1,  xp:14,  gold:[2,7],   status:{type:'poison',chance:.30,turns:2,value:4},  element:'nature' },
  dire_wolf:    { name:'Fürchterlicher Wolf',icon:'🐺', sprite:'wolf', palette:['#555555','#222222','#888888','#111111','#dd2222','#cccccc'], hp:38, atk:13, def:3,  xp:30,  gold:[4,12],  status:null },
  giant_spider: { name:'Riesenspinne',icon:'🕷', sprite:'shadow_spider', palette:['#226600','#113300','#449922','#111111','#88ff44','#aabbaa'], hp:30, atk:10, def:2,  xp:28,  gold:[3,10],  status:{type:'poison',chance:.40,turns:2,value:5}, element:'nature' },
  lizardman:    { name:'Eidechsenmann',icon:'🦎', sprite:'goblin', palette:['#336633','#224422','#aabb88','#cc5522','#888844','#556633','#ddcc66','#111111'], hp:35, atk:11, def:4,  xp:32,  gold:[5,14],  status:null },
  dark_mage:    { name:'Dunkler Magier',icon:'🧙', sprite:'dark_mage', hp:48, atk:16, def:2,  xp:55,  gold:[10,28],  status:{type:'burn',chance:.35,turns:2,value:8},   element:'void' },
  vampire:      { name:'Vampir',      icon:'🧛', sprite:'vampire', hp:55, atk:17, def:5,  xp:65,  gold:[12,32],  status:{type:'poison',chance:.25,turns:3,value:7},  element:'undead', weakTo:'light' },
  wraith:       { name:'Schatten-Wraith',icon:'👻', sprite:'ghost', palette:['#8855cc','#5522aa','#bb88ff','#222222','#cc44ff','#ffffff'], hp:58, atk:20, def:8,  xp:75,  gold:[14,38],  status:{type:'stun',chance:.30,turns:1,value:0}, element:'undead', weakTo:'light' },
  corrupted_knight:{ name:'Verderbter Ritter',icon:'⚔', sprite:'skeleton', palette:['#444466','#2222aa','#6666cc','#111133','#8888dd'], hp:80, atk:22, def:12, xp:100, gold:[20,60],  status:{type:'stun',chance:.20,turns:1,value:0} },
  dark_sorcerer:{ name:'Dunkler Zauberer',icon:'🔮', sprite:'dark_mage', palette:['#c8b0a0','#111111','#1a0030','#3a0060','#ffaa00','#ff44aa','#2a0a00'], hp:72, atk:25, def:6,  xp:110, gold:[22,55],  status:{type:'burn',chance:.45,turns:2,value:12}, element:'void' },
  magma_titan:  { name:'Magma-Titan', icon:'🌋', sprite:'lava_golem', palette:['#cc2200','#881100','#ff6600','#ffaa00','#ff4400','#440000'], hp:220, atk:38, def:18, xp:280, gold:[40,100], status:{type:'burn',chance:.50,turns:3,value:18}, element:'fire', weakTo:'ice' },
  void_lich:    { name:'Leeren-Lich', icon:'💀', sprite:'void_lich', hp:200, atk:55, def:14, xp:380, gold:[65,160], status:{type:'poison',chance:.45,turns:3,value:22}, element:'void', weakTo:'light' },
  glacial_spirit:{ name:'Eisgeist',   icon:'❄', sprite:'ghost', palette:['#aaddff','#6699cc','#ddeeff','#222244','#aaccff','#ffffff'], hp:780, atk:125,def:36, xp:1450,gold:[290,740], status:{type:'stun',chance:.35,turns:1,value:0}, element:'ice', weakTo:'fire' },
};

const DROPS = {
  rat:      [{id:'potion',       p:.20}],
  slime:    [{id:'potion',       p:.18}],
  bat:      [{id:'potion',       p:.15}],
  goblin:   [{id:'potion',       p:.22},{id:'wood_sword', p:.06}],
  wolf:     [{id:'potion',       p:.20},{id:'leather',    p:.07}],
  troll:    [{id:'potion',       p:.30},{id:'iron_shield',p:.10},{id:'elixir',p:.12}],
  skeleton: [{id:'potion',       p:.28},{id:'iron_sword', p:.08},{id:'iron_shield',p:.07}],
  zombie:   [{id:'potion',       p:.25},{id:'leather',    p:.10},{id:'elixir',p:.10}],
  ghost:    [{id:'magic_staff',  p:.12},{id:'magic_ring',  p:.12},{id:'elixir',p:.20}],
  demon:    [{id:'demon_armor',  p:.15},{id:'elixir',     p:.40},{id:'magic_ring',p:.18},{id:'shadow_blade',p:.08}],
  dragon:         [{id:'dragon_blade',  p:.35},{id:'elixir',       p:.60},{id:'magic_ring',  p:.30},{id:'thorn_shield', p:.20}],
  troll:          [{id:'potion',        p:.30},{id:'iron_shield',  p:.10},{id:'elixir',       p:.12},{id:'thorn_shield', p:.06}],
  fire_elemental: [{id:'elixir',p:.30},{id:'battle_brew',p:.20},{id:'thorn_shield',p:.08},{id:'crit_rune',p:.08}],
  lava_golem:     [{id:'elixir',p:.40},{id:'iron_shield',p:.15},{id:'dragon_blade',p:.05},{id:'atk_rune', p:.10}],
  phoenix:        [{id:'elixir',p:.35},{id:'magic_ring', p:.20},{id:'chaos_blade', p:.04},{id:'crit_rune',p:.10}],
  void_shade:     [{id:'elixir',p:.40},{id:'void_robe',  p:.10},{id:'void_pendant',p:.06},{id:'void_rune',p:.05}],
  shadow_spider:  [{id:'elixir',p:.45},{id:'void_scythe',p:.05},{id:'chaos_crystal',p:.10},{id:'void_rune',p:.08}],
  chaos_dragon:   [{id:'chaos_blade',p:.40},{id:'void_robe',p:.35},{id:'void_scythe',p:.08},{id:'elixir',p:.80},{id:'void_pendant',p:.10}],
  sea_serpent:    [{id:'elixir',p:.50},{id:'id_scroll',p:.30},{id:'storm_mail',p:.08},{id:'frost_spear',p:.06}],
  coral_crab:     [{id:'elixir',p:.55},{id:'id_scroll',p:.25},{id:'frost_cloak',p:.07},{id:'frost_heart',p:.10}],
  deep_kraken:    [{id:'elixir',p:.70},{id:'id_scroll',p:.40},{id:'abyssal_plate',p:.05},{id:'void_pendant',p:.06}],
  storm_hawk:     [{id:'elixir',p:.55},{id:'id_scroll',p:.30},{id:'storm_lance',p:.07},{id:'storm_ring',p:.10}],
  wind_giant:     [{id:'elixir',p:.65},{id:'id_scroll',p:.35},{id:'storm_mail',p:.08},{id:'storm_ring',p:.12}],
  thunder_wyrm:   [{id:'elixir',p:.75},{id:'id_scroll',p:.40},{id:'storm_lance',p:.09},{id:'abyssal_blade',p:.05}],
  ice_golem:      [{id:'elixir',p:.75},{id:'id_scroll',p:.45},{id:'frost_cloak',p:.08},{id:'frost_heart',p:.10}],
  frost_troll:    [{id:'elixir',p:.80},{id:'id_scroll',p:.50},{id:'frost_spear',p:.07},{id:'frost_cloak',p:.09}],
  blizzard_dragon:[{id:'abyssal_blade',p:.12},{id:'abyssal_plate',p:.10},{id:'void_scythe',p:.06},{id:'elixir',p:.90},{id:'id_scroll',p:.60},{id:'frost_heart',p:.20}],
  // new enemy drops
  mushroom_man:   [{id:'herbs',p:.55},{id:'potion',p:.15}],
  dire_wolf:      [{id:'potion',p:.22},{id:'leather',p:.10}],
  giant_spider:   [{id:'potion',p:.20},{id:'poison_fang',p:.10}],
  lizardman:      [{id:'potion',p:.20},{id:'iron_sword',p:.06},{id:'leather',p:.08}],
  dark_mage:      [{id:'mp_rune',p:.12},{id:'magic_staff',p:.08},{id:'elixir',p:.25},{id:'mp_potion',p:.20}],
  vampire:        [{id:'elixir',p:.30},{id:'blood_pendant',p:.10},{id:'magic_ring',p:.15}],
  wraith:         [{id:'elixir',p:.25},{id:'void_rune',p:.06},{id:'magic_ring',p:.12}],
  corrupted_knight:[{id:'elixir',p:.35},{id:'runed_sword',p:.08},{id:'iron_shield',p:.12},{id:'chain_mail',p:.10}],
  dark_sorcerer:  [{id:'elixir',p:.40},{id:'cursed_blade',p:.05},{id:'crit_rune',p:.12},{id:'mage_robe',p:.10}],
  magma_titan:    [{id:'elixir',p:.45},{id:'berserker_axe',p:.06},{id:'atk_rune',p:.12},{id:'berserker_plate',p:.05}],
  void_lich:      [{id:'elixir',p:.50},{id:'void_gloves',p:.08},{id:'void_rune',p:.10},{id:'chaos_crystal',p:.06},{id:'crystal_crown',p:.04}],
  glacial_spirit: [{id:'elixir',p:.50},{id:'crystal_crown',p:.06},{id:'def_rune',p:.15},{id:'shadow_boots',p:.08}],
};

const ITEMS = {
  wood_sword:  { name:'Wood Sword',   icon:'🗡', slot:'weapon', atk:4,  def:0,             value:10,  buyable:true,  rarity:'common'    },
  iron_sword:  { name:'Iron Sword',   icon:'⚔', slot:'weapon', atk:10, def:0,             value:55,  buyable:true,  rarity:'uncommon'  },
  magic_staff: { name:'Magic Staff',  icon:'🪄', slot:'weapon', atk:7,  def:0,  maxMp:10,  value:65,  buyable:true,  rarity:'rare'      },
  dragon_blade:{ name:'Dragon Blade', icon:'🔥', slot:'weapon', atk:22, def:0,             value:350, buyable:false, rarity:'legendary' },
  leather:     { name:'Leather',      icon:'🥋', slot:'armor',  atk:0,  def:4,             value:30,  buyable:true,  rarity:'common'    },
  iron_shield: { name:'Iron Shield',  icon:'🛡', slot:'armor',  atk:0,  def:9,             value:85,  buyable:true,  rarity:'uncommon'  },
  demon_armor: { name:'Demon Armor',  icon:'🔴', slot:'armor',  atk:2,  def:14,            value:220, buyable:false, rarity:'epic'      },
  health_ring: { name:'HP Ring',      icon:'💍', slot:'acc',    atk:0,  def:0,  maxHp:20,  value:40,  buyable:true,  rarity:'uncommon'  },
  magic_ring:  { name:'Magic Ring',   icon:'🔮', slot:'acc',    atk:0,  def:0,  maxMp:15,  value:45,  buyable:true,  rarity:'rare'      },
  potion:      { name:'HP Potion',    icon:'🧪', slot:null,     hp:40,                     value:20,  buyable:true,  rarity:'common'    },
  elixir:      { name:'Elixir',       icon:'✨', slot:null,     hp:80,  mp:20,             value:65,  buyable:true,  rarity:'rare'      },
  battle_brew: { name:'Battle Brew',  icon:'⚗', slot:null,     buffAtk:10, buffLeft:3,    value:45,  buyable:true,  rarity:'uncommon'  },
  shadow_blade:{ name:'Shadow Blade', icon:'🌑', slot:'weapon', atk:18, def:0,             value:280, buyable:false, rarity:'epic'      },
  thorn_shield: { name:'Thorn Shield',  icon:'🌵', slot:'armor',  atk:3,  def:12,                       value:150, buyable:false, rarity:'rare'      },
  chaos_blade:  { name:'Chaos Blade',  icon:'⚡', slot:'weapon', atk:40, def:0,                        value:900, buyable:false, rarity:'legendary' },
  void_robe:    { name:'Void Robe',    icon:'🌀', slot:'armor',  atk:0,  def:25, maxMp:20,             value:800, buyable:false, rarity:'legendary' },
  chaos_crystal:{ name:'Chaos Crystal',icon:'💎', slot:'acc',    atk:6,  def:6,  maxHp:35, maxMp:15,  value:1000,buyable:false, rarity:'legendary' },
  pixie_pet:    { name:'Pixie',        icon:'🧚', slot:'pet',    xpBonus:0.20,                         value:400, buyable:true,  rarity:'rare'      },
  golem_pet:    { name:'Stone Golem',  icon:'🗿', slot:'pet',    def:6,                                value:450, buyable:true,  rarity:'rare'      },
  fox_pet:      { name:'Lucky Fox',    icon:'🦊', slot:'pet',    goldBonus:0.20,                       value:400, buyable:true,  rarity:'rare'      },
  atk_rune:     { name:'ATK-Rune',    icon:'🔴', slot:'rune',   atk:8,                                value:100, buyable:true,  rarity:'uncommon'  },
  def_rune:     { name:'DEF-Rune',    icon:'🔵', slot:'rune',   def:8,                                value:100, buyable:true,  rarity:'uncommon'  },
  crit_rune:    { name:'Krit-Rune',   icon:'🟡', slot:'rune',   critBonus:0.08,                       value:130, buyable:true,  rarity:'rare'      },
  mp_rune:      { name:'MP-Rune',     icon:'🟣', slot:'rune',   maxMp:18,                             value:90,  buyable:true,  rarity:'uncommon'  },
  void_rune:    { name:'Void-Rune',   icon:'⚫', slot:'rune',   atk:12, critBonus:0.05,               value:200, buyable:false, rarity:'epic'      },
  wind_rune:    { name:'Wind-Rune',   icon:'🌀', slot:'rune',   atk:6,  def:6,                        value:180, buyable:false, rarity:'epic'      },
  // Helm
  leather_helm: { name:'Leder-Helm',      icon:'🪖', slot:'helm',   def:4,           value:50,  buyable:true,  rarity:'common'    },
  iron_helm:    { name:'Eisen-Helm',       icon:'⛑',  slot:'helm',   def:8,  atk:2,   value:140, buyable:true,  rarity:'uncommon'  },
  shadow_helm:  { name:'Schatten-Helm',    icon:'🎭', slot:'helm',   def:12, atk:5,   value:420, buyable:false, rarity:'rare'      },
  // Gloves
  iron_gloves:  { name:'Eisen-Handschuhe',icon:'🧤', slot:'gloves', atk:5,           value:60,  buyable:true,  rarity:'common'    },
  magic_gloves: { name:'Magie-Handschuhe',icon:'✋',  slot:'gloves', atk:7,  maxMp:12,value:160, buyable:true,  rarity:'uncommon'  },
  void_gloves:  { name:'Void-Handschuhe', icon:'🖐',  slot:'gloves', atk:14, critBonus:0.10, value:900, buyable:false, rarity:'legendary' },
  // Boots
  leather_boots:{ name:'Leder-Stiefel',   icon:'👢', slot:'boots',  def:3,           value:55,  buyable:true,  rarity:'common'    },
  swift_boots:  { name:'Schnelle Stiefel', icon:'👟', slot:'boots',  def:5,  maxMp:8, value:150, buyable:true,  rarity:'uncommon'  },
  void_boots:   { name:'Void-Stiefel',     icon:'🥾', slot:'boots',  def:10, atk:6,   value:750, buyable:false, rarity:'epic'      },
  // New weapons
  iron_axe:     { name:'Eisen-Axt',        icon:'🪓', slot:'weapon', wType:'axe',   atk:14, def:2,         value:180, buyable:true,  rarity:'uncommon'  },
  hunter_bow:   { name:'Jäger-Bogen',       icon:'🏹', slot:'weapon', wType:'bow',   atk:12,                value:200, buyable:true,  rarity:'uncommon'  },
  mystic_staff: { name:'Mystischer Stab',   icon:'🪄', slot:'weapon', wType:'staff', atk:10, maxMp:25, mpRegen:5, value:320, buyable:true, rarity:'rare' },
  // Resistance & utility
  resist_ring:  { name:'Widerstandsring',   icon:'💠', slot:'acc',    def:4, resist:0.30,            value:380, buyable:true,  rarity:'rare'      },
  // Resources (consumable-like, tracked in G.resources)
  wood:         { name:'Holz',              icon:'🪵', slot:null, qty:0,                             value:5,   buyable:false, rarity:'common'    },
  ore:          { name:'Erz',               icon:'🪨', slot:null, qty:0,                             value:8,   buyable:false, rarity:'common'    },
  herbs:        { name:'Kräuter',           icon:'🌿', slot:null, qty:0,                             value:6,   buyable:false, rarity:'common'    },
  // Scroll
  id_scroll:    { name:'Identifizierungs-Schriftrolle', icon:'📜', slot:null, hp:0,                  value:50,  buyable:true,  rarity:'uncommon'  },
  // Cooking results
  strength_brew: { name:'Stärke-Sud', icon:'🍵', slot:null, buffAtk:15, buffLeft:5, value:60, buyable:false, rarity:'uncommon' },
  big_potion:    { name:'Großer Heiltrank', icon:'🧴', slot:null, hp:80, value:45, buyable:false, rarity:'uncommon' },
  roasted_herb:  { name:'Gebratenes Kraut', icon:'🍃', slot:null, buffDef:8, buffLeft:4, value:35, buyable:false, rarity:'common' },
  // Fishing
  fish:          { name:'Fisch',          icon:'🐟', slot:null, hp:30, value:15, buyable:false, rarity:'common' },
  rare_fish:     { name:'Seltener Fisch', icon:'🐠', slot:null, hp:0,  value:90, buyable:false, rarity:'rare'   },
  // Artifact
  soul_gem: { name:'Seelen-Stein', icon:'💎', slot:'acc', atk:2, def:2, artifact:true, value:600, buyable:false, rarity:'legendary' },
  // ── NEW WEAPONS ─────────────────────────────────────────────
  bone_dagger:    { name:'Knochendolch',      icon:'🗡', slot:'weapon', wType:'dagger', atk:8,  critBonus:0.12,               value:90,   buyable:false, rarity:'uncommon'  },
  runed_sword:    { name:'Runenschwert',       icon:'⚔', slot:'weapon', atk:16, critBonus:0.08,                               value:260,  buyable:true,  rarity:'rare'      },
  berserker_axe:  { name:'Berserker-Axt',      icon:'🪓', slot:'weapon', wType:'axe',  atk:26, def:-3,                       value:480,  buyable:false, rarity:'epic'      },
  plague_scythe:  { name:'Pest-Sense',         icon:'⚔', slot:'weapon', atk:20,                                              value:520,  buyable:false, rarity:'epic'      },
  cursed_blade:   { name:'Verfluchte Klinge',  icon:'🌑', slot:'weapon', atk:22, lifesteal:0.18,                              value:580,  buyable:false, rarity:'epic'      },
  celestial_bow:  { name:'Himmels-Bogen',      icon:'🏹', slot:'weapon', wType:'bow',  atk:35,                               value:1200, buyable:false, rarity:'legendary' },
  poison_fang:    { name:'Giftfang',           icon:'🦷', slot:'weapon', atk:6,                                              value:120,  buyable:false, rarity:'uncommon'  },
  // ── NEW ARMOR ───────────────────────────────────────────────
  chain_mail:     { name:'Kettenhemd',         icon:'🔗', slot:'armor',  atk:0,  def:7,                                      value:110,  buyable:true,  rarity:'uncommon'  },
  mage_robe:      { name:'Magiermantel',       icon:'👘', slot:'armor',  atk:0,  def:5,  maxMp:20,                           value:140,  buyable:true,  rarity:'uncommon'  },
  dragon_scale:   { name:'Drachenschuppe',     icon:'🔴', slot:'armor',  atk:0,  def:30, maxHp:20,                           value:1100, buyable:false, rarity:'legendary' },
  berserker_plate:{ name:'Berserker-Platte',   icon:'⚫', slot:'armor',  atk:8,  def:16,                                    value:600,  buyable:false, rarity:'epic'      },
  // ── NEW ACCESSORIES ─────────────────────────────────────────
  speed_ring:     { name:'Schnelligkeitsring', icon:'💠', slot:'acc',   evasion:0.12,                                        value:220,  buyable:true,  rarity:'rare'      },
  mana_crystal:   { name:'Mana-Kristall',      icon:'🔷', slot:'acc',   maxMp:40,                                            value:280,  buyable:true,  rarity:'rare'      },
  blood_pendant:  { name:'Blut-Amulett',       icon:'🔴', slot:'acc',   lifesteal:0.12,                                      value:450,  buyable:false, rarity:'epic'      },
  battle_medallion:{ name:'Kampf-Medaillon',   icon:'🏅', slot:'acc',   atk:8,  critBonus:0.05,                              value:380,  buyable:true,  rarity:'rare'      },
  // ── NEW HELMETS ─────────────────────────────────────────────
  horned_helm:    { name:'Gehörnter Helm',     icon:'🪖', slot:'helm',  atk:6,  def:6,                                       value:280,  buyable:false, rarity:'rare'      },
  crystal_crown:  { name:'Kristallkrone',      icon:'👑', slot:'helm',  def:10, maxMp:30, critBonus:0.07,                    value:750,  buyable:false, rarity:'legendary' },
  // ── NEW GLOVES ──────────────────────────────────────────────
  claw_gauntlets: { name:'Klauenhandschuhe',   icon:'🧤', slot:'gloves',atk:8,  critBonus:0.12,                              value:320,  buyable:false, rarity:'rare'      },
  battle_gauntlets:{ name:'Kampfhandschuhe',   icon:'🥊', slot:'gloves',atk:10, def:3,                                      value:200,  buyable:true,  rarity:'uncommon'  },
  // ── NEW BOOTS ───────────────────────────────────────────────
  shadow_boots:   { name:'Schattenstiefel',    icon:'👟', slot:'boots', def:6,  evasion:0.10,                               value:280,  buyable:false, rarity:'rare'      },
  storm_boots:    { name:'Sturmstiefel',       icon:'⚡', slot:'boots', def:4,  maxMp:15,                                   value:160,  buyable:true,  rarity:'uncommon'  },
  // ── NEW CONSUMABLES ─────────────────────────────────────────
  mega_potion:    { name:'Mega-Trank',         icon:'🧪', slot:null,    hp:150,                                              value:120,  buyable:false, rarity:'rare'      },
  mp_potion:      { name:'Mana-Trank',         icon:'💧', slot:null,    mp:50,                                               value:60,   buyable:true,  rarity:'uncommon'  },
  revive_gem:     { name:'Wiederbelebungsstein',icon:'💎', slot:null,   hp:999, mp:999,                                      value:200,  buyable:true,  rarity:'rare'      },
  // ── HIGH-LEVEL WEAPONS (level 50+) ──────────────────────────
  abyssal_blade:  { name:'Abyssale Klinge',    icon:'⚔', slot:'weapon', atk:45, critBonus:0.12,                              value:1800, buyable:false, rarity:'legendary' },
  storm_lance:    { name:'Sturmlanze',          icon:'⚡', slot:'weapon', atk:40, def:5,                                      value:1400, buyable:true,  rarity:'epic'      },
  frost_spear:    { name:'Frostspeer',          icon:'❄', slot:'weapon', atk:38, def:0,                                      value:1300, buyable:true,  rarity:'epic'      },
  void_scythe:    { name:'Leeren-Sense',        icon:'🌀', slot:'weapon', atk:52, lifesteal:0.15,                             value:2200, buyable:false, rarity:'legendary' },
  // ── HIGH-LEVEL ARMOR (level 50+) ────────────────────────────
  abyssal_plate:  { name:'Abyssale Platte',     icon:'🔵', slot:'armor',  atk:0,  def:35, maxHp:30,                          value:1600, buyable:false, rarity:'legendary' },
  storm_mail:     { name:'Sturmrüstung',         icon:'⛅', slot:'armor',  atk:0,  def:28, maxMp:20,                          value:1200, buyable:true,  rarity:'epic'      },
  frost_cloak:    { name:'Frostmantel',          icon:'🧊', slot:'armor',  atk:0,  def:30, resist:0.20,                       value:1350, buyable:true,  rarity:'epic'      },
  // ── HIGH-LEVEL ACCESSORIES (level 50+) ──────────────────────
  void_pendant:   { name:'Leeren-Amulett',      icon:'🌑', slot:'acc',    atk:12, critBonus:0.10, maxMp:25,                  value:1500, buyable:false, rarity:'legendary' },
  storm_ring:     { name:'Sturmring',            icon:'⚡', slot:'acc',    atk:10, evasion:0.10,                              value:950,  buyable:true,  rarity:'epic'      },
  frost_heart:    { name:'Frostherz',            icon:'💙', slot:'acc',    def:10, maxHp:50, resist:0.15,                     value:1100, buyable:true,  rarity:'epic'      },
};

const SKILLS = [
  { id:'power',      name:'Power Strike',  icon:'💥', mp:15, unlockLv:1,  dmgMult:2.2,                         desc:'2.2× ATK' },
  { id:'bash',       name:'Shield Bash',   icon:'🛡', mp:12, unlockLv:3,  dmgMult:0.6, stun:true,              desc:'0.6× + Stun' },
  { id:'heal',       name:'Heal',          icon:'💚', mp:20, unlockLv:6,  healAmt:50,                          desc:'Heilt 50 HP' },
  { id:'thunder',    name:'Thunder',       icon:'⚡', mp:30, unlockLv:10, dmgMult:3.5, burn:true,  element:'light', desc:'3.5× Licht + Burn' },
  { id:'blizzard',   name:'Blizzard',      icon:'❄', mp:35, unlockLv:12, dmgMult:1.8, multiHit:2, element:'ice',   desc:'2× 1.8× Eis' },
  { id:'drain',      name:'Drain Life',    icon:'🩸', mp:25, unlockLv:15, dmgMult:1.8, drain:true,              desc:'1.8× + Lifesteal' },
  { id:'meteor',     name:'Meteor',        icon:'☄', mp:50, unlockLv:18, dmgMult:4.5, burn:true,  element:'fire',  desc:'4.5× Feuer + Burn' },
  { id:'void_blast', name:'Void Blast',    icon:'🌀', mp:55, unlockLv:25, dmgMult:4.0,             element:'void',  desc:'4.0× Void-Schaden' },
  { id:'lava_strike',name:'Lava Strike',   icon:'🌋', mp:60, unlockLv:30, dmgMult:3.5, multiHit:2, element:'fire',  desc:'2× 3.5× Lava' },
  { id:'holy_nova',  name:'Holy Nova',     icon:'✨', mp:65, unlockLv:35, dmgMult:5.5,             element:'light', desc:'5.5× Licht-Nova' },
  // ── Krieger-Skills ─────────────────────────────────────────
  { id:'war_cry',    name:'Kriegsschrei',  icon:'📢', mp:15, unlockLv:5,  reqClass:'warrior', atkBuff:18, buffTurns:3, desc:'+18 ATK für 3 Runden' },
  { id:'shield_wall',name:'Schildwall',    icon:'🛡', mp:18, unlockLv:8,  reqClass:'warrior', defBuff:25, buffTurns:3, desc:'+25 DEF für 3 Runden' },
  { id:'whirlwind',  name:'Wirbelwind',    icon:'🌪', mp:35, unlockLv:14, reqClass:'warrior', dmgMult:1.6, multiHit:3, desc:'3× 1.6× Wirbelwind' },
  // ── Magier-Skills ──────────────────────────────────────────
  { id:'arcane',     name:'Arkaner Blitz', icon:'🌟', mp:20, unlockLv:4,  reqClass:'mage',    dmgMult:3.0, element:'arcane', desc:'3.0× Arkaner Schaden' },
  { id:'mana_surge', name:'Mana-Schwall',  icon:'💫', mp:35, unlockLv:9,  reqClass:'mage',    dmgMult:2.2, multiHit:3, element:'arcane', desc:'3× 2.2× Arkaner Burst' },
  { id:'time_stop',  name:'Zeitstillstand',icon:'⏳', mp:45, unlockLv:16, reqClass:'mage',    dmgMult:0,  stun:true, healAmt:30, desc:'Stun + 30 HP Erholung' },
  // ── Schurken-Skills ────────────────────────────────────────
  { id:'backstab',   name:'Hinterhalt',    icon:'🗡', mp:12, unlockLv:4,  reqClass:'rogue',   dmgMult:1.5, critMult:3.0, desc:'1.5× + 3× Krit-Schaden' },
  { id:'smoke_bomb', name:'Rauchbombe',    icon:'💨', mp:20, unlockLv:7,  reqClass:'rogue',   fleeSkill:true, desc:'Garantierte Flucht' },
  { id:'poison_strike',name:'Giftstoß',   icon:'🐍', mp:25, unlockLv:12, reqClass:'rogue',   dmgMult:1.2, poisonSkill:true, desc:'1.2× + starkes Gift' },
];

// ── AREA BOSSES ──────────────────────────────────────────────
const AREA_BOSSES = {
  forest:    { name:'👑 Goblin-König',       foeId:'goblin',      hpMult:5,   atkMult:2.5, xpMult:4,  goldMult:4,  drops:[{id:'runed_sword',p:.6},{id:'elixir',p:1}] },
  cave:      { name:'💀 Uralt-Troll',         foeId:'troll',       hpMult:4.5, atkMult:2.2, xpMult:4,  goldMult:4,  drops:[{id:'chain_mail',p:.7},{id:'elixir',p:1}] },
  dungeon:   { name:'🔮 Dungeon-Herr',        foeId:'dark_mage',   hpMult:4,   atkMult:2.3, xpMult:4.5,goldMult:4.5,drops:[{id:'shadow_helm',p:.5},{id:'elixir',p:1}] },
  graveyard: { name:'💀 Lich-Lord',           foeId:'wraith',      hpMult:5,   atkMult:2.5, xpMult:5,  goldMult:5,  drops:[{id:'magic_ring',p:.7},{id:'mana_crystal',p:.4},{id:'elixir',p:1}] },
  castle:    { name:'😈 Schattenfürst',       foeId:'dark_sorcerer',hpMult:4,  atkMult:2.3, xpMult:5,  goldMult:5,  drops:[{id:'demon_armor',p:.5},{id:'cursed_blade',p:.3},{id:'elixir',p:1}] },
  volcanic:  { name:'🌋 Magma-Overlord',      foeId:'magma_titan', hpMult:3.5, atkMult:2.0, xpMult:5,  goldMult:5,  drops:[{id:'berserker_axe',p:.5},{id:'berserker_plate',p:.3},{id:'elixir',p:1}] },
  void:      { name:'🌀 Void-Kaiser',         foeId:'void_lich',   hpMult:4,   atkMult:2.5, xpMult:6,  goldMult:6,  drops:[{id:'void_robe',p:.5},{id:'void_gloves',p:.4},{id:'elixir',p:1}] },
  underwater:{ name:'🦑 Kraken-König',        foeId:'deep_kraken', hpMult:3.5, atkMult:2.0, xpMult:6,  goldMult:6,  drops:[{id:'chaos_crystal',p:.4},{id:'celestial_bow',p:.2},{id:'elixir',p:1}] },
  sky:       { name:'⚡ Donner-Imperator',    foeId:'thunder_wyrm',hpMult:3.5, atkMult:2.0, xpMult:6,  goldMult:6,  drops:[{id:'crystal_crown',p:.3},{id:'chaos_blade',p:.2},{id:'elixir',p:1}] },
  ice:       { name:'❄ Gletscher-Titan',      foeId:'blizzard_dragon',hpMult:3.5,atkMult:2.0,xpMult:6, goldMult:6,  drops:[{id:'dragon_scale',p:.3},{id:'crystal_crown',p:.3},{id:'elixir',p:1}] },
  void_rift: { name:'👑 Dimensionsherrscher', foeId:'void_lich', hpMult:6, atkMult:3, xpMult:8, goldMult:8, drops:[{id:'chaos_crystal',p:.5},{id:'void_robe',p:.4},{id:'chaos_blade',p:.2},{id:'elixir',p:1}] },
};

// ── MONSTER AFFIXES ──────────────────────────────────────────
const MONSTER_AFFIXES = [
  { id:'fortress', name:'Festung',  icon:'🛡', apply: e => { e.def = Math.floor(e.def*1.8); } },
  { id:'berserk',  name:'Rasend',   icon:'🔥', apply: e => { e.atk = Math.floor(e.atk*1.5); } },
  { id:'toxic',    name:'Giftig',   icon:'☠',  apply: e => { e.statusDef={type:'poison',chance:.55,turns:3,value:Math.max(6,Math.floor(e.atk*0.2))}; } },
  { id:'giant',    name:'Riesig',   icon:'⬆',  apply: e => { e.hp=Math.floor(e.hp*2); e.maxHp=e.hp; } },
  { id:'swift',    name:'Flink',    icon:'💨', apply: e => { e._evasion=0.28; } },
  { id:'enraged',  name:'Raserei',  icon:'💢', apply: e => { e._multiAtk=2; e.atk=Math.floor(e.atk*0.75); } },
  { id:'vampiric', name:'Blutsauger',icon:'🩸', apply: e => { e._lifesteal=0.3; } },
];

// ── SHADOW KING ──────────────────────────────────────────────
const SHADOW_KING = {
  id:'shadow_king', name:'👑 Shadow King', sprite:'shadow_king',
  hp:500, maxHp:500, atk:30, def:14, xp:1000,
  gold:[300,600],
  drops:[{id:'dragon_blade',p:1},{id:'demon_armor',p:1},{id:'elixir',p:1}],
  statusDef:{type:'burn',chance:.5,turns:3,value:15},
  playerTurn:true, playerStatus:[], enemyStatus:[],
  isBoss:false, isKing:true,
};

// ── ACHIEVEMENTS ────────────────────────────────────────────
const ACHIEVEMENTS = [
  { id:'first_blood', icon:'⚔', label:'Erster Kill',       desc:'Ersten Gegner besiegt',          check:G=>G.p.kills>=1 },
  { id:'warrior10',   icon:'⚔', label:'Krieger',           desc:'10 Kills',                       check:G=>G.p.kills>=10 },
  { id:'slayer50',    icon:'💀', label:'Schlächter',        desc:'50 Kills',                       check:G=>G.p.kills>=50 },
  { id:'legend100',   icon:'🏆', label:'Legende',           desc:'100 Kills',                      check:G=>G.p.kills>=100 },
  { id:'level5',      icon:'⭐', label:'Apprentice LV5',    desc:'Level 5 erreicht',               check:G=>G.p.level>=5 },
  { id:'level10',     icon:'⭐', label:'Veteran LV10',      desc:'Level 10 erreicht',              check:G=>G.p.level>=10 },
  { id:'level20',     icon:'👑', label:'Champion LV20',     desc:'Level 20 erreicht',              check:G=>G.p.level>=20 },
  { id:'level30',     icon:'🌀', label:'Void Walker LV30',  desc:'Level 30 erreicht',              check:G=>G.p.level>=30 },
  { id:'rich',        icon:'🪙', label:'Wohlhabend',        desc:'500 Gold verdient',              check:G=>G.p.totalGoldEarned>=500 },
  { id:'wealthy',     icon:'💰', label:'Reich',             desc:'5000 Gold verdient',             check:G=>G.p.totalGoldEarned>=5000 },
  { id:'traveler',    icon:'🗺', label:'Reisender',         desc:'50 Schritte',                    check:G=>G.steps>=50 },
  { id:'explorer',    icon:'🌍', label:'Entdecker',         desc:'200 Schritte',                   check:G=>G.steps>=200 },
  { id:'kingslayer',  icon:'💜', label:'Königsmörder',      desc:'Shadow King besiegt',            check:G=>G.kingDefeated },
  { id:'dungeoneer',  icon:'⛏', label:'Gauntlet Läufer',   desc:'Dungeon Gauntlet abgeschlossen', check:G=>(G.dungeonClears||0)>=1 },
  { id:'arena_win',   icon:'🏟', label:'Arena Champion',    desc:'Arena-Modus gewonnen',           check:G=>G.achievements.includes('arena_win_flag') },
  { id:'subclass',    icon:'⚡', label:'Spezialist',        desc:'Spezialisierung gewählt',        check:G=>!!G.p.subclass },
  { id:'enchanter',   icon:'✨', label:'Verzauberer',       desc:'Item verzaubert',                check:G=>G.p.inv.some(s=>s._enchant) },
  { id:'runesmith',   icon:'💎', label:'Runenschmied',      desc:'Rune eingesetzt',                check:G=>G.p.inv.some(s=>s._rune) },
  { id:'set_bonus',   icon:'🔥', label:'Set-Träger',        desc:'Set-Bonus aktiv',                check:G=>{const ids=Object.values(G.p.eq).filter(Boolean).map(e=>e.id);return ITEM_SETS.some(s=>s.pieces.every(id=>ids.includes(id)));} },
];

// ── CLASSES ──────────────────────────────────────────────────
const CLASSES = {
  warrior: { name:'Krieger',   icon:'⚔', desc:'+15 ATK, +10 DEF, +40 HP',  bonusAtk:15, bonusDef:10, bonusHp:40, bonusMp:0  },
  mage:    { name:'Magier',    icon:'🔮', desc:'+5 ATK, +5 DEF, +60 MP',   bonusAtk:5,  bonusDef:5,  bonusHp:0,  bonusMp:60 },
  rogue:   { name:'Schurke',   icon:'🗡', desc:'+20 ATK, +3 DEF, +15% Krit',bonusAtk:20, bonusDef:3,  bonusHp:0,  bonusMp:0, bonusCrit:0.15 },
};

// ── SUBCLASSES (LV15) ─────────────────────────────────────────
const SUBCLASSES = {
  berserker:    { base:'warrior', name:'Berserker',    icon:'🪓', desc:'+30 ATK, -5 DEF, Krit×2',        bonusAtk:30, bonusDef:-5, bonusHp:0, bonusMp:0, bonusCrit:0,   berserker:true },
  paladin:      { base:'warrior', name:'Paladin',      icon:'🛡', desc:'+5 ATK, +20 DEF, +80 HP',        bonusAtk:5,  bonusDef:20, bonusHp:80,bonusMp:0, bonusCrit:0,   healOnKill:true },
  necromancer:  { base:'mage',    name:'Nekromant',    icon:'💀', desc:'+10 ATK, +40 MP, Drain immer',   bonusAtk:10, bonusDef:0,  bonusHp:0, bonusMp:40,bonusCrit:0,   alwaysDrain:true },
  elementalist: { base:'mage',    name:'Elementalist', icon:'🌊', desc:'+15 ATK, +30 MP, Skill+30%',     bonusAtk:15, bonusDef:0,  bonusHp:0, bonusMp:30,bonusCrit:0,   skillBonus:0.30 },
  assassin:     { base:'rogue',   name:'Assassin',     icon:'🔪', desc:'+35 ATK, +25% Krit',             bonusAtk:35, bonusDef:0,  bonusHp:0, bonusMp:0, bonusCrit:0.25 },
  ranger:       { base:'rogue',   name:'Ranger',       icon:'🏹', desc:'+20 ATK, Multi-Hit auto',         bonusAtk:20, bonusDef:0,  bonusHp:0, bonusMp:0, bonusCrit:0.1, autoMulti:true },
};

// ── ITEM SETS ─────────────────────────────────────────────────
const ITEM_SETS = [
  { id:'dragon', label:'🔥 Dragon Set', pieces:['dragon_blade','demon_armor'],   bonus:{atk:15, def:10} },
  { id:'void',   label:'🌀 Void Set',   pieces:['chaos_blade','void_robe'],       bonus:{atk:20, def:20} },
  { id:'shadow', label:'🌑 Shadow Set', pieces:['shadow_blade','thorn_shield'],   bonus:{atk:10, def:8}  },
];

// ── PRESTIGE PALETTES ──────────────────────────────────────────
const PRESTIGE_PALETTES = {
  1: ['#c8a882','#4a2e00','#e8c96b','#c8a020','#e8c96b','#ffe066','#cc4444','#ffffff','#e8c96b'],
  2: ['#c8a882','#4a2e00','#9933ff','#4400aa','#cc88ff','#cc88ff','#cc4444','#ffffff','#7766aa'],
  3: ['#c8a882','#4a2e00','#ff4400','#aa00ff','#ffcc00','#00ccff','#cc4444','#ffffff','#ff0088'],
};

// ── TALENT NODES ─────────────────────────────────────────────
const TALENT_NODES = [
  { id:'crit',      name:'Präzision',   icon:'🎯', desc:'+5% Krit pro Stufe',      cost:1, maxLv:5 },
  { id:'atk_pct',   name:'Stärke+',     icon:'💪', desc:'+10% ATK pro Stufe',      cost:1, maxLv:5 },
  { id:'def_pct',   name:'Panzer+',     icon:'🛡', desc:'+10% DEF pro Stufe',      cost:1, maxLv:5 },
  { id:'hp_pct',    name:'Ausdauer+',   icon:'❤',  desc:'+8% MaxHP pro Stufe',     cost:1, maxLv:5 },
  { id:'lifesteal', name:'Lebensdraub', icon:'🩸', desc:'5% Lifesteal pro Stufe',  cost:2, maxLv:3 },
  { id:'evasion',   name:'Ausweichen',  icon:'💨', desc:'8% Ausweich pro Stufe',   cost:2, maxLv:3 },
  { id:'mp_regen',  name:'MP-Fluss',    icon:'🔮', desc:'+2 MP/Runde pro Stufe',   cost:2, maxLv:3 },
  { id:'gold_find', name:'Goldnase',    icon:'🪙', desc:'+20% Gold pro Stufe',     cost:1, maxLv:5 },
  { id:'xp_boost',  name:'Lernend',     icon:'⭐', desc:'+15% XP pro Stufe',       cost:1, maxLv:5 },
  { id:'crit_dmg',  name:'Tödlich',     icon:'💥', desc:'+15% Krit-Schaden/Stufe', cost:2, maxLv:3 },
];

// ── COMPANIONS ───────────────────────────────────────────────
const COMPANIONS = {
  squire:   { name:'Knappe',       icon:'⚔', hp:80,  maxHp:80,  atk:10, goldCost:150 },
  archer:   { name:'Bogenschütze', icon:'🏹', hp:60,  maxHp:60,  atk:16, goldCost:280 },
  healer:   { name:'Heiler',       icon:'💚', hp:100, maxHp:100, atk:5,  goldCost:350, heals:true },
  berserkerC:{ name:'Berserker',   icon:'🪓', hp:120, maxHp:120, atk:22, goldCost:600 },
};

// ── BOSS RUSH ────────────────────────────────────────────────
const BOSS_RUSH_SEQ = ['dragon','demon','ghost','troll','skeleton','chaos_dragon'];

// ── AREA STORIES ─────────────────────────────────────────────
const AREA_STORIES = {
  forest:     '🌲 Das Verzauberte Waldgebiet\nUralte Geister flüstern\nzwischen den Bäumen...',
  cave:       '🦇 Die Goblin-Höhlen\nHungrige Augen glühen\nim Dunkel vor dir...',
  dungeon:    '⛏ Das dunkle Verlies\nFäulnis und Moder\nerfüllen die Gänge...',
  graveyard:  '💀 Der verfluchte Friedhof\nDie Toten ruhen nicht.\nLauf, wenn du kannst...',
  castle:     '🏰 Das Schattenschloss\nEine dunkle Festung\nerwartet dich...',
  volcanic:   '🌋 Die Vulkanruinen\nDie Erde bebt.\nDrachen kreisen oben...',
  void:       '🌀 Das Void-Reich\nDie Realität bricht hier.\nNur Starke überleben...',
  underwater: '🌊 Das Abyssale Königreich\nDruck steigt. Seltsame\nLichter führen dich...',
  sky:        '⛅ Die Himmelsfestung\nWolken unter dir.\nDonneriesen bewachen...',
  ice:        '❄ Die Eistundra\nFrost beißt. Blizzards toben.\nLegenden enden hier...',
};

// ── NPC DIALOGUE LINES ───────────────────────────────────────
const NPC_MERCHANT_LINES = [
  '🧙 "Nur heute! Alles muss weg!"',
  '🧙 "Frischer Loot direkt aus dem Dungeon!"',
  '🧙 "Ps-st... ich hab was Besonderes für dich."',
  '🧙 "Kaufst du oder schaust du nur?"',
  '🧙 "Das Schwert? Er braucht es nicht mehr."',
  '🧙 "Zehn Helden waren hier. Du bist der einzige, der noch lebt."',
  '🧙 "Das Amulett ist ein bisschen verflucht. ...Aber günstig!"',
  '🧙 "Eile dich, die Preise steigen bald!"',
  '🧙 "Dieses Item ist unbezahlbar... Für dich: 50% Rabatt."',
  '🧙 "Den letzten Käufer hab ich nie wiedergesehen. Ich frag lieber nicht."',
  '🧙 "Frisch gestohlen, äh, gefunden im Wald!"',
  '🧙 "Ich schwöre, diese Klinge singt bei Vollmond."',
  '🧙 "Wer nicht kauft, bereut es. Wer kauft, bereut es vielleicht auch – aber mit besseren Items!"',
  '🧙 "Der Drache? Toter Drache. Sehr gute Ware."',
  '🧙 "Ich hab nichts geklaut. Alles... ehm... gefunden. Ja."',
];
const NPC_STRANGER_LINES = [
  '🤫 "Hüte dich vor dem Schatten..."',
  '🤫 "Dieser Wald birgt dunkle Geheimnisse."',
  '🤫 "Der König wird dich töten. Sei vorsichtig."',
  '🤫 "Folge dem Mondlicht... und du findest deinen Weg."',
  '🤫 "Ich habe tausend Helden gesehen. Keiner kehrte zurück."',
  '🤫 "Das Schwert tötet den Mann, nicht der Mann das Schwert."',
  '🤫 "Die Stille vor dem Kampf ist lauter als der Kampf selbst."',
  '🤫 "Im Grab liegt mehr Gold als im Schatz. Und mehr Skelette."',
  '🤫 "Trau keinem, der im Dunkeln lächelt."',
  '🤫 "Drachen sammeln Gold. Helden sammeln Drachen. Ich sammle Weisheiten."',
  '🤫 "Wer Angst hat, lebt länger. Aber langweiliger."',
  '🤫 "Die Dunkelheit hat Augen. Und Hunger."',
  '🤫 "Jedes Monster war einmal ein Held, der zu weit gegangen ist."',
  '🤫 "Der Shadow King war ein Kind, das nie aufgehört hat zu weinen."',
  '🤫 "Manche Dungeons verlassen dich nie – auch wenn du sie verlässt."',
];
const NPC_ELDER_LINES = [
  '🧓 "Stärke wächst nicht mit dem Level. Stärke wächst mit den Narben."',
  '🧓 "In meiner Jugend war der Shadow King noch ein freundlicher Bäcker."',
  '🧓 "Vergiss das Gold nicht. Es ist die einzige Sprache, die alle verstehen."',
  '🧓 "Die größten Helden gaben sich nie zufrieden. Das war ihr Untergang – und ihr Ruhm."',
  '🧓 "Kämpf nicht, weil du stark bist. Kämpf, weil du aufgehört hast, Angst zu haben."',
  '🧓 "Ein Held ohne Narben hat nie wirklich gekämpft."',
  '🧓 "Ich kannte deinen Vorgänger. Er sagte auch \'kein Problem\'."',
  '🧓 "Manchmal ist fliehen der mutigste Zug."',
  '🧓 "Dieser Wald ist alt. Älter als die Götter. Respektiere ihn."',
  '🧓 "Das beste Schwert ist das, das du nicht ziehen musstest."',
];
const NPC_GUARD_LINES = [
  '💂 "Halt! ...Ach, du bist\'s. Weiter."',
  '💂 "Heute Nacht keine Ruhe. Die Monster werden mutiger."',
  '💂 "Ich stehe hier seit drei Tagen. Bitte bring mir ein Brot."',
  '💂 "Jenseits dieser Grenze ist das Land des Shadow Kings. Viel Glück."',
  '💂 "Kein Durchgang ohne... na, für einen Helden machen wir eine Ausnahme."',
  '💂 "Die letzte Patrouille ist nicht zurückgekehrt. Die davor auch nicht."',
  '💂 "Wenn du überlebst, sag mir wie."',
  '💂 "Mein Schwert ist rostig aber mein Mut ist... auch etwas angerostet."',
];
const NPC_FLAVOR_LINES = [
  '🌿 Ein Schmetterling folgt dir eine Weile.',
  '🍄 Seltsame Pilze leuchten im Dunkeln.',
  '💀 Ein altes Skelett lehnt friedlich an einem Baum. Kein Feind.',
  '🌙 Der Mond wirft lange Schatten auf den Weg.',
  '🪨 Ein merkwürdig geformter Stein – er fühlt sich warm an.',
  '🌊 Das Rauschen von fernem Wasser ist zu hören.',
  '🦋 Goldene Schmetterlinge tanzen um dich herum.',
  '⚡ Statische Elektrizität liegt in der Luft.',
  '🌸 Der Geruch von Blumen – ungewöhnlich für diesen Ort.',
  '🔮 Eine vergessene Laterne brennt noch, niemand weiß warum.',
  '🐦 Ein Rabenschrei in der Ferne.',
  '💨 Ein kalter Wind flüstert deinen Namen.',
  '🗿 Eine alte Statue blinzelt. ...Oder war das Einbildung?',
  '🌑 Für einen Moment wird die Welt absolut still.',
  '✨ Glitzernder Staub fällt aus dem Nichts.',
  '🌲 Die Bäume raunen leise. Oder ist es der Wind?',
  '🕸 Spinnweben glitzern im Mondlicht.',
  '🦗 Das Zirpen der Grillen verstummt plötzlich.',
  '🌫️ Dichter Nebel zieht auf – und verschwindet wieder.',
  '🪶 Eine schwarze Feder liegt auf dem Weg.',
];

// ── BESTIARY MILESTONES ───────────────────────────────────────
const BESTIARY_MILESTONES = [10, 25, 50];

// ── RUNE COMBINATION ─────────────────────────────────────────
const RUNE_COMBINE = {
  atk_rune:  { needs:3, result:'void_rune' },
  def_rune:  { needs:3, result:'void_rune' },
  crit_rune: { needs:3, result:'wind_rune' },
  mp_rune:   { needs:3, result:'wind_rune' },
};

// ── WORLD BOSS ───────────────────────────────────────────────
const WORLD_BOSS_DATA = { id:'world_boss', name:'⚡ WELTENBEZWINGER', sprite:'chaos_dragon', hp:5000, atk:220, def:100, xp:8000, gold:[3000,6000], status:{type:'burn',chance:0.6,turns:3,value:50}, drops:[{id:'chaos_crystal',p:0.8},{id:'chaos_blade',p:0.5},{id:'soul_gem',p:1.0}] };

// ── HERO PALETTES ─────────────────────────────────────────────
const HERO_PALETTES = [
  { id:'warrior', name:'Krieger', p:null },
  { id:'mage',    name:'Magier',  p:['#c8a882','#4a2e00','#7b52cc','#3a1a6a','#cc77ff','#ddccff','#4488ff','#ffffff','#666688'] },
  { id:'ranger',  name:'Jäger',   p:['#c8a882','#2e1a00','#5a8a3a','#2a4a1a','#88cc44','#aaccaa','#886622','#ffffff','#556633'] },
  { id:'rogue',   name:'Schurke', p:['#c8a882','#1a1a1a','#333333','#111111','#666666','#444444','#cc4444','#ffffff','#333333'] },
];

// ── WEATHER ELEMENT MAP ───────────────────────────────────────
const WEATHER_ELEMENT = { underwater:'water', sky:'lightning', ice:'ice', cave:'earth', forest:'nature', castle:'fire' };

// ── CRAFTING ─────────────────────────────────────────────────
const CRAFTING = [
  { id:'c_elixir',  label:'Elixier brauen',   requires:[{id:'potion',qty:3}],                                  result:'elixir',       resultQty:1 },
  { id:'c_brew',    label:'Battle Brew ×2',    requires:[{id:'elixir',qty:2}],                                  result:'battle_brew',  resultQty:2 },
  { id:'c_crystal', label:'Chaos-Kristall',    requires:[{id:'magic_ring',qty:1},{id:'health_ring',qty:1}],     result:'chaos_crystal',resultQty:1 },
  { id:'c_chaos',   label:'Chaos-Klinge',      requires:[{id:'dragon_blade',qty:1},{id:'shadow_blade',qty:1}],  result:'chaos_blade',  resultQty:1 },
  { id:'c_void',    label:'Void-Robe',         requires:[{id:'demon_armor',qty:1},{id:'thorn_shield',qty:1}],   result:'void_robe',    resultQty:1 },
  { id:'c_herb_pot',label:'Heiltrank ×2 (Kräuter)', requires:[{id:'herbs',qty:3,res:true}],                    result:'potion',       resultQty:2, resReq:true },
  { id:'c_ore_shld',label:'Erz-Schild (Erz)',  requires:[{id:'ore',qty:5,res:true}],                           result:'iron_shield',  resultQty:1, resReq:true },
  { id:'c_wood_bow',label:'Holzbogen (Holz)',   requires:[{id:'wood',qty:6,res:true}],                          result:'hunter_bow',   resultQty:1, resReq:true },
  { id:'ck_strength', label:'🍵 Stärke-Sud (Kräuter+Erz)', requires:[{id:'herbs',qty:2,res:true},{id:'ore',qty:1,res:true}], result:'strength_brew', resultQty:1, resReq:true },
  { id:'ck_bigpot',   label:'🧴 Großer Trank (Kräuter+Holz)', requires:[{id:'herbs',qty:3,res:true},{id:'wood',qty:2,res:true}], result:'big_potion', resultQty:1, resReq:true },
  { id:'ck_roast',    label:'🍃 Geröstetes Kraut (Kräuter×4)', requires:[{id:'herbs',qty:4,res:true}], result:'roasted_herb', resultQty:2, resReq:true },
  { id:'ck_mpotion',  label:'💧 Mana-Trank ×2 (Kräuter×2)',  requires:[{id:'herbs',qty:2,res:true}], result:'mp_potion', resultQty:2, resReq:true },
  { id:'ck_mega',     label:'🧪 Mega-Trank (Trank×3+Kräuter)',requires:[{id:'potion',qty:3},{id:'herbs',qty:2,res:true}], result:'mega_potion', resultQty:1, resReq:true },
  { id:'c_revive',    label:'💎 Wiederbelebungsstein (Kristall+Elixier)', requires:[{id:'chaos_crystal',qty:1},{id:'elixir',qty:2}], result:'revive_gem', resultQty:1 },
  { id:'c_steel_sword', label:'⚔ Stahl-Schwert (Erz×8)',           requires:[{id:'ore',qty:8,res:true}],                                              result:'iron_sword',  resultQty:1, resReq:true },
  { id:'c_chain',       label:'🛡 Kettenrüstung (Erz×6+Holz×3)',   requires:[{id:'ore',qty:6,res:true},{id:'wood',qty:3,res:true}],                   result:'chain_mail',  resultQty:1, resReq:true },
  { id:'c_atk_rune',    label:'💎 ATK-Rune (Erz×4+Kräuter×2)',     requires:[{id:'ore',qty:4,res:true},{id:'herbs',qty:2,res:true}],                  result:'atk_rune',    resultQty:1, resReq:true },
  { id:'c_def_rune',    label:'🛡 DEF-Rune (Erz×3+Holz×3)',        requires:[{id:'ore',qty:3,res:true},{id:'wood',qty:3,res:true}],                   result:'def_rune',    resultQty:1, resReq:true },
  { id:'c_storm_boots', label:'👢 Sturm-Stiefel (Erz×5+Holz×4)',   requires:[{id:'ore',qty:5,res:true},{id:'wood',qty:4,res:true}],                   result:'storm_boots', resultQty:1, resReq:true },
  { id:'c_battle_helm', label:'🪖 Kampf-Helm (Erz×6+Kräuter×3)',   requires:[{id:'ore',qty:6,res:true},{id:'herbs',qty:3,res:true}],                  result:'shadow_helm', resultQty:1, resReq:true },
  { id:'c_mana_pot',    label:'💧 Mana-Kristall (Kräuter×5+Erz×2)',requires:[{id:'herbs',qty:5,res:true},{id:'ore',qty:2,res:true}],                  result:'mana_crystal',resultQty:1, resReq:true },
];

// ── PRESTIGE SHOP ────────────────────────────────────────────
const PRESTIGE_SHOP = [
  { id:'atk_up',     label:'⚔ +10 Basis-ATK',        cost:1, max:5, desc:'Permanent +10 ATK nach Prestige' },
  { id:'hp_up',      label:'❤ +50 Basis-HP',          cost:1, max:5, desc:'Permanent +50 MaxHP nach Prestige' },
  { id:'def_up',     label:'🛡 +5 Basis-DEF',         cost:1, max:5, desc:'Permanent +5 DEF nach Prestige' },
  { id:'mp_up',      label:'💙 +20 Basis-MP',         cost:1, max:3, desc:'Permanent +20 MaxMP nach Prestige' },
  { id:'gold_keep',  label:'🪙 Mehr Gold behalten',   cost:2, max:3, desc:'50%→60%→70% Gold behalten' },
  { id:'start_item', label:'🎒 Start-Item +1',         cost:2, max:2, desc:'Behalte +1 extra Item nach Prestige' },
  { id:'xp_boost',   label:'⭐ +15% XP dauerhaft',   cost:3, max:2, desc:'Permanent +15% XP' },
];

// ── QUESTS ──────────────────────────────────────────────────
const QUEST_POOL = [
  {type:'kill',target:'rat',      qty:5,  label:'Töte 5 Ratten',       xpR:40,  goldR:25},
  {type:'kill',target:'slime',    qty:5,  label:'Töte 5 Slimes',       xpR:50,  goldR:30},
  {type:'kill',target:'goblin',   qty:5,  label:'Töte 5 Goblins',      xpR:80,  goldR:50},
  {type:'kill',target:'bat',      qty:5,  label:'Töte 5 Fledermäuse',  xpR:70,  goldR:45},
  {type:'kill',target:'wolf',     qty:3,  label:'Töte 3 Wölfe',        xpR:80,  goldR:55},
  {type:'kill',target:'troll',    qty:3,  label:'Töte 3 Trolle',       xpR:130, goldR:90},
  {type:'kill',target:'skeleton', qty:3,  label:'Töte 3 Skelette',     xpR:120, goldR:80},
  {type:'kill',target:'zombie',   qty:3,  label:'Töte 3 Zombies',      xpR:140, goldR:90},
  {type:'kill',target:'ghost',    qty:3,  label:'Töte 3 Geister',      xpR:160, goldR:100},
  {type:'kill',target:'demon',    qty:2,  label:'Töte 2 Dämonen',      xpR:200, goldR:150},
  {type:'kill',target:'dragon',   qty:1,  label:'Besiege den Drachen', xpR:350, goldR:250},
  {type:'step',qty:15,  label:'Gehe 15 Schritte',  xpR:35,  goldR:20},
  {type:'step',qty:30,  label:'Gehe 30 Schritte',  xpR:70,  goldR:40},
  {type:'step',qty:60,  label:'Gehe 60 Schritte',  xpR:130, goldR:75},
  {type:'step',qty:100, label:'Gehe 100 Schritte', xpR:200, goldR:120, itemR:'potion'},
  {type:'gold',qty:80,  label:'Verdiene 80 Gold',  xpR:55,  goldR:0,   itemR:'potion'},
  {type:'gold',qty:200, label:'Verdiene 200 Gold', xpR:120, goldR:0,   itemR:'elixir'},
  {type:'craft',qty:3,  label:'Stelle 3 Items her', xpR:90,  goldR:60},
  {type:'craft',qty:5,  label:'Stelle 5 Items her', xpR:150, goldR:100, itemR:'potion'},
  {type:'survive',qty:10, label:'Überlebe 10 Kampfrunden', xpR:80,  goldR:50},
  {type:'survive',qty:25, label:'Überlebe 25 Kampfrunden', xpR:160, goldR:100, itemR:'elixir'},
];

const DAILY_POOL = [
  {type:'kill',target:'any',qty:8,  label:'Besiege 8 Gegner',      xpR:120, goldR:80},
  {type:'kill',target:'any',qty:15, label:'Besiege 15 Gegner',     xpR:200, goldR:140},
  {type:'step',qty:20,              label:'Gehe 20 Schritte',       xpR:80,  goldR:60},
  {type:'step',qty:40,              label:'Gehe 40 Schritte',       xpR:160, goldR:100},
  {type:'gold',qty:100,             label:'Verdiene 100 Gold',      xpR:100, goldR:0, itemR:'elixir'},
  {type:'gold',qty:300,             label:'Verdiene 300 Gold',      xpR:180, goldR:0, itemR:'elixir'},
  {type:'kill',target:'goblin',qty:3,label:'Töte 3 Goblins',       xpR:90,  goldR:70},
  {type:'kill',target:'skeleton',qty:2,label:'Töte 2 Skelette',    xpR:100, goldR:80},
];

// ── STORY QUEST CHAINS ───────────────────────────────────────
const STORY_CHAINS = [
  {
    id: 'chain_forest',
    title: 'Der verlorene Ritter',
    steps: [
      { label:'Töte 3 Goblins im Wald',    type:'kill', target:'goblin', qty:3,  story:'Ein Ritter wurde im Wald zuletzt gesehen. Goblins haben die Gegend überrannt!' },
      { label:'Töte den Goblin-König',      type:'kill', target:'goblin', qty:1,  boss:true, story:'Der Goblin-König hält den Ritter gefangen. Befreie ihn!' },
      { label:'Töte 2 Trolle in den Höhlen',type:'kill',target:'troll',  qty:2,  story:'Der Ritter ist befreit! Aber Trolle blockieren den Rückweg.' },
    ],
    rewards: ['runed_sword','elixir','elixir','elixir'],
    xpBonus: 500,
    goldBonus: 300,
    finalText: '🎉 Der Ritter ist gerettet! Er übergibt dir sein Schwert als Dank.',
  },
  {
    id: 'chain_undead',
    title: 'Die Fluch-Quelle',
    steps: [
      { label:'Töte 5 Skelette',       type:'kill', target:'skeleton', qty:5, story:'Eine dunkle Energie korrumpiert den Friedhof. Skelette erheben sich!' },
      { label:'Töte 3 Zombies',        type:'kill', target:'zombie',   qty:3, story:'Zombies beschützen den Fluch-Altar. Räume sie weg!' },
      { label:'Besiege den Lich-Lord', type:'kill', target:'wraith',   qty:1, boss:true, story:'Der Lich-Lord selbst steht hinter dem Fluch. Ende ihn!' },
    ],
    rewards: ['shadow_helm','magic_ring','elixir','mana_crystal'],
    xpBonus: 800,
    goldBonus: 500,
    finalText: '💀 Der Fluch ist gebrochen! Die Toten ruhen wieder in Frieden.',
  },
  {
    id: 'chain_dragon',
    title: 'Drachenherz',
    steps: [
      { label:'Töte 2 Feuer-Elementare',  type:'kill', target:'fire_elemental', qty:2, story:'Ein Drache terrorisiert die Vulkanregion. Sein Nest muss zerstört werden.' },
      { label:'Töte 3 Lavagolems',        type:'kill', target:'lava_golem',     qty:3, story:'Die Lavagolems bewachen das Drachenei. Vernichte sie!' },
      { label:'Besiege den Drachen',      type:'kill', target:'dragon',         qty:1, boss:true, story:'Der Drache selbst erscheint! Dein Schicksal entscheidet sich hier.' },
    ],
    rewards: ['dragon_scale','berserker_axe','elixir','chaos_crystal'],
    xpBonus: 1200,
    goldBonus: 800,
    finalText: '🐉 Der Drache ist gefallen! Du nimmst sein Herzschuppe als Trophäe.',
  },
];
