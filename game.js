// ============================================================
//  PIXEL QUEST RPG
// ============================================================

// ── SPRITES ─────────────────────────────────────────────────
const SPRITES = {
  player: {
    p: ['#c8a882','#4a2e00','#3a5a9a','#8ab4d8','#c0c0c0','#888888','#e8c96b','#e05252'],
    d: [
      ['.','.',1,1,1,1,'.','.'],
      ['.',1,0,0,0,0,1,'.'],
      ['.','.', 0, 0, 0, 0,'.','.'],
      ['.',2,2,6,6,2,2,'.'],
      [2,3,2,2,2,2,3,2],
      ['.',2,2,2,2,2,2,'.'],
      ['.',5,'.',4,4,'.',5,'.'],
      [5,5,'.','.','.','.', 5,5],
    ]
  },
  slime: {
    p: ['#52c07a','#2a8050','#a0ffc0'],
    d: [
      ['.','.','.','.','.','.','.','.'],
      ['.','.', 0, 0, 0, 0,'.','.'],
      ['.',0,2,0,0,2,0,'.'],
      ['.', 0, 0, 0, 0, 0, 0,'.'],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0,1,0,0,0,0,1,0],
      ['.',0,1,1,1,1,0,'.'],
      ['.','.','.','.','.','.','.','.'],
    ]
  },
  goblin: {
    p: ['#6aab3c','#3a6b1c','#c8a882','#cc3333','#888888'],
    d: [
      ['.','.', 0, 0, 0, 0, '.', '.'],
      ['.',0,2,3,3,2,0,'.'],
      ['.','.', 2, 2, 2, 2,'.','.'],
      ['.',0,0,0,0,0,0,'.'],
      ['.', 4, 0, 0, 0, 0, 4,'.'],
      ['.','.', 0, 0, 0, 0,'.','.'],
      ['.','.',1,'.','.', 1,'.','.'],
      ['.','.', 1, 1, 1, 1,'.','.'],
    ]
  },
  skeleton: {
    p: ['#e8e8d0','#c0baa0','#888878','#333323','#cc3333'],
    d: [
      ['.','.', 0, 0, 0, 0,'.','.'],
      ['.',0,3,0,3,0,0,'.'],
      ['.','.', 0,1,1,0,'.','.'],
      ['.','.', 0, 0, 0, 0,'.','.'],
      ['.', 2, 0, 0, 0, 0, 2,'.'],
      ['.','.', 0, 0, 0, 0,'.','.'],
      ['.','.',2,'.','.',2,'.','.'],
      ['.','.', 2, 2, 2, 2,'.','.'],
    ]
  },
  wolf: {
    p: ['#888888','#555555','#cccccc','#333333'],
    d: [
      ['.','.', 0, 0, '.','.', 0, 0],
      ['.',0, 0, 0, 0, 0, 0, 0],
      ['.',0,2,0,0,2,0,'.'],
      ['.','.', 0, 0, 0, 0,'.','.'],
      [0, 0, 0, 0, 0, 0, 0, 0],
      ['.', 1, 0, 0, 0, 0, 1,'.'],
      ['.',1,'.','.','.','.',1,'.'],
      ['.','.','.','.','.','.','.','.'],
    ]
  },
  dragon: {
    p: ['#8b0000','#cc3333','#ffd700','#ff6600','#2a0000'],
    d: [
      [0,'.','.',0,0,'.','.', 0],
      [0, 0,2, 0, 0, 2, 0, 0],
      ['.',0,1,0,0,1,0,'.'],
      ['.','.', 0, 0, 0, 0,'.','.'],
      [0,0,0,0,0,0,0,0],
      [0,3,0,2,2,0,3,0],
      [0,0,'.', 0, 0,'.',0,0],
      ['.',0,'.','.','.','.',0,'.'],
    ]
  },
  rat: {
    p: ['#997766','#664433','#ccbbaa','#333333'],
    d: [
      ['.','.','.','.','.','.','.',0],
      ['.','.',0,0,0,'.',0,0],
      ['.',0,0,2,2,0,0,'.'],
      ['.', 0, 0, 0, 0, 0, 0,'.'],
      [0, 0, 0, 0, 0, 0, 0, 0],
      ['.',0,0,0,0,0,0,'.'],
      ['.','.',1,'.','.','.','.','.'],
      ['.','.','.','.','.','.','.','.'],
    ]
  },
  bat: {
    p: ['#4a2878','#7744aa','#220033','#cc88ff'],
    d: [
      [0,'.','.','.','.','.','.', 0],
      [0, 0,'.','.','.','.', 0, 0],
      [0, 0, 0,1,1, 0, 0, 0],
      [0,3,0,1,1,0,3,0],
      ['.', 0, 0, 0, 0, 0, 0,'.'],
      ['.','.', 0, 2, 2, 0,'.','.'],
      ['.','.','.', 0, 0,'.','.', '.'],
      ['.','.','.','.','.','.','.','.'],
    ]
  },
  troll: {
    p: ['#4a7a3c','#2a5a1c','#c8b082','#8aaa6a','#333333'],
    d: [
      ['.','.', 0, 0, 0, 0,'.','.'],
      ['.', 0, 2, 0, 0, 2, 0,'.'],
      [0, 0, 2, 2, 2, 2, 0, 0],
      [0,3,0,0,0,0,3,0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, '.', '.', 0, 1, 0],
      ['.', 1, 1, '.', '.', 1, 1,'.'],
    ]
  },
  zombie: {
    p: ['#6a8a5a','#3a5a2a','#c8a882','#4a8a4a','#cc3333'],
    d: [
      ['.','.', 0, 0, 0, 0,'.','.'],
      ['.',0,2,4,4,2,0,'.'],
      ['.','.', 2, 2, 2, 2,'.','.'],
      ['.',3,3,3,3,3,3,'.'],
      [3, 0, 3, 3, 3, 3, 0, 3],
      ['.',3,3,3,3,3,3,'.'],
      ['.','.', 1, '.', '.', 1,'.','.'],
      ['.','.', 1, 1, 1, 1,'.','.'],
    ]
  },
  ghost: {
    p: ['#aaaaee','#7777cc','#ffffff','#4444aa','#ccccff'],
    d: [
      ['.','.', 0, 0, 0, 0,'.','.'],
      ['.',0,0,0,0,0,0,'.'],
      ['.',0,2,0,0,2,0,'.'],
      ['.',0,0,0,0,0,0,'.'],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,'.', 0,'.','.', 0,'.',0],
      ['.','.','.','.','.','.','.','.'],
    ]
  },
  demon: {
    p: ['#aa1111','#660000','#ff4400','#ffaa00','#330000'],
    d: [
      [0,'.',2,'.','.', 2,'.',0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      ['.',0,3,0,0,3,0,'.'],
      ['.',0,0,0,0,0,0,'.'],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 2, 0, 0, 2, 0, 0],
      ['.', 0, 0, 0, 0, 0, 0,'.'],
      ['.',0,'.','.','.','.', 0,'.'],
    ]
  },
};

function drawSprite(canvas, key, scale=8) {
  const s = SPRITES[key];
  if (!s) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.imageSmoothingEnabled = false;
  s.d.forEach((row,r) => row.forEach((v,c) => {
    if (v === '.') return;
    ctx.fillStyle = s.p[v];
    ctx.fillRect(c*scale, r*scale, scale, scale);
  }));
}

// ── AREAS ───────────────────────────────────────────────────
const AREAS = [
  { id:'forest',    name:'Enchanted Forest', icon:'🌲', min:1,  max:4,  foes:['slime','rat','goblin','wolf'] },
  { id:'cave',      name:'Goblin Caves',     icon:'🦇', min:3,  max:7,  foes:['goblin','bat','troll','rat'] },
  { id:'dungeon',   name:'Dark Dungeon',     icon:'⛏',  min:6,  max:11, foes:['skeleton','goblin','wolf','bat'] },
  { id:'graveyard', name:'Cursed Graveyard', icon:'💀', min:9,  max:15, foes:['skeleton','zombie','ghost'] },
  { id:'castle',    name:'Shadow Castle',    icon:'🏰', min:13, max:30, foes:['ghost','demon','dragon'] },
];

// ── ENEMIES ─────────────────────────────────────────────────
const FOES = {
  rat:      { name:'Rat',      sprite:'rat',      hp:8,  atk:2,  def:0,  xp:5,   gold:[1,3],   status:null },
  slime:    { name:'Slime',    sprite:'slime',    hp:14, atk:4,  def:1,  xp:10,  gold:[1,5],   status:null },
  goblin:   { name:'Goblin',   sprite:'goblin',   hp:22, atk:7,  def:2,  xp:18,  gold:[3,10],  status:{type:'stun',   chance:.25, turns:1, value:0} },
  bat:      { name:'Bat',      sprite:'bat',      hp:18, atk:8,  def:1,  xp:16,  gold:[2,7],   status:null },
  wolf:     { name:'Wolf',     sprite:'wolf',     hp:28, atk:9,  def:2,  xp:24,  gold:[2,8],   status:null },
  troll:    { name:'Troll',    sprite:'troll',    hp:45, atk:12, def:5,  xp:40,  gold:[8,18],  status:null },
  skeleton: { name:'Skeleton', sprite:'skeleton', hp:38, atk:11, def:4,  xp:35,  gold:[5,15],  status:null },
  zombie:   { name:'Zombie',   sprite:'zombie',   hp:50, atk:13, def:3,  xp:45,  gold:[6,16],  status:{type:'poison', chance:.35, turns:3, value:6} },
  ghost:    { name:'Ghost',    sprite:'ghost',    hp:42, atk:15, def:6,  xp:55,  gold:[8,20],  status:{type:'stun',   chance:.20, turns:1, value:0} },
  demon:    { name:'Demon',    sprite:'demon',    hp:70, atk:18, def:7,  xp:90,  gold:[15,40], status:{type:'burn',   chance:.30, turns:2, value:10} },
  dragon:   { name:'Dragon',   sprite:'dragon',   hp:90, atk:20, def:8,  xp:120, gold:[25,70], status:{type:'burn',   chance:.40, turns:3, value:12} },
};

const DROPS = {
  rat:      [{ id:'potion',       p:.20 }],
  slime:    [{ id:'potion',       p:.18 }],
  bat:      [{ id:'potion',       p:.15 }],
  goblin:   [{ id:'potion',       p:.22 }, { id:'wood_sword',  p:.06 }],
  wolf:     [{ id:'potion',       p:.20 }, { id:'leather',     p:.07 }],
  troll:    [{ id:'potion',       p:.30 }, { id:'iron_shield', p:.10 }, { id:'elixir', p:.12 }],
  skeleton: [{ id:'potion',       p:.28 }, { id:'iron_sword',  p:.08 }, { id:'iron_shield', p:.07 }],
  zombie:   [{ id:'potion',       p:.25 }, { id:'leather',     p:.10 }, { id:'elixir', p:.10 }],
  ghost:    [{ id:'magic_staff',  p:.12 }, { id:'magic_ring',  p:.12 }, { id:'elixir', p:.20 }],
  demon:    [{ id:'demon_armor',  p:.15 }, { id:'elixir',      p:.40 }, { id:'magic_ring', p:.18 }],
  dragon:   [{ id:'dragon_blade', p:.35 }, { id:'elixir',      p:.60 }, { id:'magic_ring', p:.30 }],
};

// ── ITEMS ───────────────────────────────────────────────────
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
};

// ── SKILLS ──────────────────────────────────────────────────
const SKILLS = [
  { id:'power',   name:'Power Strike', icon:'💥', mp:15, unlockLv:1,  dmgMult:2.2, desc:'2.2x ATK' },
  { id:'heal',    name:'Heal',         icon:'💚', mp:20, unlockLv:6,  healAmt:50,  desc:'Heilt 50 HP' },
  { id:'thunder', name:'Thunder',      icon:'⚡', mp:30, unlockLv:10, dmgMult:3.5, burn:true, desc:'3.5x + Burn' },
  { id:'drain',   name:'Drain Life',   icon:'🩸', mp:25, unlockLv:15, dmgMult:1.8, drain:true, desc:'1.8x + Lifesteal' },
];

function unlockedSkills() {
  return SKILLS.filter(s => G.p.level >= s.unlockLv);
}

// ── QUESTS ──────────────────────────────────────────────────
const QUEST_POOL = [
  { type:'kill', target:'rat',      qty:5,  label:'Töte 5 Ratten',       xpR:40,  goldR:25  },
  { type:'kill', target:'slime',    qty:5,  label:'Töte 5 Slimes',       xpR:50,  goldR:30  },
  { type:'kill', target:'goblin',   qty:5,  label:'Töte 5 Goblins',      xpR:80,  goldR:50  },
  { type:'kill', target:'bat',      qty:5,  label:'Töte 5 Fledermäuse',  xpR:70,  goldR:45  },
  { type:'kill', target:'wolf',     qty:3,  label:'Töte 3 Wölfe',        xpR:80,  goldR:55  },
  { type:'kill', target:'troll',    qty:3,  label:'Töte 3 Trolle',       xpR:130, goldR:90  },
  { type:'kill', target:'skeleton', qty:3,  label:'Töte 3 Skelette',     xpR:120, goldR:80  },
  { type:'kill', target:'zombie',   qty:3,  label:'Töte 3 Zombies',      xpR:140, goldR:90  },
  { type:'kill', target:'ghost',    qty:3,  label:'Töte 3 Geister',      xpR:160, goldR:100 },
  { type:'kill', target:'demon',    qty:2,  label:'Töte 2 Dämonen',      xpR:200, goldR:150 },
  { type:'kill', target:'dragon',   qty:1,  label:'Besiege den Drachen', xpR:350, goldR:250 },
  { type:'step', qty:15,  label:'Gehe 15 Schritte',  xpR:35,  goldR:20 },
  { type:'step', qty:30,  label:'Gehe 30 Schritte',  xpR:70,  goldR:40 },
  { type:'step', qty:60,  label:'Gehe 60 Schritte',  xpR:130, goldR:75 },
  { type:'step', qty:100, label:'Gehe 100 Schritte', xpR:200, goldR:120, itemR:'potion' },
  { type:'gold', qty:80,  label:'Verdiene 80 Gold',  xpR:55,  goldR:0,  itemR:'potion' },
  { type:'gold', qty:200, label:'Verdiene 200 Gold', xpR:120, goldR:0,  itemR:'elixir' },
];

// ── STATE ────────────────────────────────────────────────────
const G = {
  p: {
    name:'Hero', level:1, xp:0, xpNext:100,
    hp:100, maxHp:100, mp:30, maxMp:30,
    baseAtk:8, baseDef:3, gold:0, kills:0,
    totalGoldEarned:0, statPoints:0,
    eq:{ weapon:null, armor:null, acc:null },
    inv:[],
  },
  area: AREAS[0],
  combat: null,
  steps: 0,
  busy: false,
  quests: [],
  shopMode: 'buy',
};

// ── STATS ────────────────────────────────────────────────────
function stats() {
  const p = G.p;
  let atk=p.baseAtk, def=p.baseDef, maxHp=p.maxHp, maxMp=p.maxMp;
  for (const slot of ['weapon','armor','acc']) {
    const eq = p.eq[slot];
    if (eq) { atk+=eq.atk||0; def+=eq.def||0; maxHp+=eq.maxHp||0; maxMp+=eq.maxMp||0; }
  }
  return { atk, def, maxHp, maxMp };
}

// ── STAT ALLOCATION ──────────────────────────────────────────
function allocateStat(type) {
  const p = G.p;
  if (p.statPoints <= 0) return;
  p.statPoints--;
  if (type==='str') { p.baseAtk += 2; addLog('💪 STR: +2 ATK'); }
  if (type==='def') { p.baseDef += 2; addLog('🛡 DEF: +2 DEF'); }
  if (type==='vit') { p.maxHp  += 15; p.hp += 15; addLog('❤️ VIT: +15 MaxHP'); }
  if (type==='wis') { p.maxMp  += 8;  p.mp += 8;  addLog('🔮 WIS: +8 MaxMP');  }
  refresh();
}

// ── LEVELING ─────────────────────────────────────────────────
function xpFor(lvl) { return Math.floor(100 * Math.pow(1.4, lvl-1)); }

function gainXP(amount) {
  const p = G.p;
  p.xp += amount;
  while (p.xp >= p.xpNext) {
    p.xp -= p.xpNext;
    p.level++;
    p.xpNext = xpFor(p.level);
    // small auto-gains + 2 stat points for manual allocation
    p.baseAtk += 1; p.baseDef += 1;
    p.maxHp += 10;  p.maxMp += 3;
    p.hp = Math.min(p.hp + 10, stats().maxHp);
    p.mp = Math.min(p.mp + 3,  stats().maxMp);
    p.statPoints += 2;
    const newSkill = SKILLS.find(s => s.unlockLv === p.level);
    const extra = newSkill ? `\n${newSkill.icon} ${newSkill.name}\nfreigeschaltet!` : '';
    showOverlay(`⭐ LEVEL UP!\nLV ${p.level}\n+2 Stat-Punkte${extra}`);
    updateArea();
  }
  refresh();
}

// ── AREA ─────────────────────────────────────────────────────
function updateArea() {
  const lvl = G.p.level;
  G.area = AREAS.find(a => lvl >= a.min && lvl <= a.max) || AREAS[AREAS.length-1];
  document.getElementById('area-name').textContent = G.area.name;
  document.getElementById('area-icon').textContent = G.area.icon;
}

// ── EXPLORE ──────────────────────────────────────────────────
const EVENTS = [
  { t:'combat',  w:48 },
  { t:'gold',    w:18 },
  { t:'heal',    w:10 },
  { t:'chest',   w:8  },
  { t:'shrine',  w:6  },
  { t:'boss',    w:4  },
  { t:'nothing', w:6  },
];

const CHEST_LOOT = ['potion','potion','potion','elixir','iron_sword','leather','iron_shield','health_ring','magic_ring'];

function pick(arr) {
  const total = arr.reduce((s,e)=>s+(e.w||e.p||0),0);
  let r = Math.random()*total;
  for (const e of arr) { r -= (e.w||e.p||0); if (r<=0) return e; }
  return arr[arr.length-1];
}

function doStep() {
  if (G.busy || G.combat) return;
  const p = G.p;
  if (p.hp <= 0) { addLog('❌ Du bist tot! Benutze einen Trank.'); return; }

  G.steps++;
  document.getElementById('step-val').textContent = G.steps;
  tickQuestStep();
  setBusy(true);
  setTimeout(() => setBusy(false), 700);

  const ev = pick(EVENTS);

  if (ev.t === 'combat' || ev.t === 'boss') {
    const foeId = G.area.foes[Math.floor(Math.random()*G.area.foes.length)];
    startCombat(foeId, ev.t === 'boss');
  } else if (ev.t === 'gold') {
    const g = Math.floor((Math.random()*8+2) * p.level);
    earnGold(g);
    addLog(`💰 Du findest ${g} Gold!`);
    refresh();
  } else if (ev.t === 'heal') {
    const amt = Math.floor(Math.random()*15+8);
    p.hp = Math.min(stats().maxHp, p.hp+amt);
    addLog(`🌿 Ein Heilkraut! +${amt} HP`);
    refresh();
  } else if (ev.t === 'chest') {
    const itemId = CHEST_LOOT[Math.floor(Math.random()*CHEST_LOOT.length)];
    addInv(itemId);
    addLog(`📦 Schatzkiste! ${ITEMS[itemId].icon} ${ITEMS[itemId].name} gefunden!`);
    refresh();
  } else if (ev.t === 'shrine') {
    const opts = [
      () => { p.hp = stats().maxHp; addLog('⛩️ Heilschrein! HP vollständig geheilt.'); },
      () => { p.mp = stats().maxMp; addLog('⛩️ Zauberschrein! MP vollständig aufgefüllt.'); },
      () => { const xpa=15*p.level; gainXP(xpa); addLog(`⛩️ Weisheitsschrein! +${xpa} XP.`); },
      () => { const g=10*p.level; earnGold(g); addLog(`⛩️ Glücksschrein! +${g} Gold.`); },
    ];
    opts[Math.floor(Math.random()*opts.length)]();
    refresh();
  } else {
    const msgs = [
      '🌲 Nichts passiert. Du wanderst weiter.',
      '🌫️ Ein seltsamer Nebel zieht vorbei...',
      '🍄 Du siehst bunte Pilze. Besser nicht anfassen.',
      '🐦 Vögel zwitschern in der Ferne.',
      '💨 Der Wind flüstert deinen Namen.',
      '🕸️ Spinnweben überall. Ungemütlich.',
      '🌙 Der Mond steht tief am Himmel.',
    ];
    addLog(msgs[Math.floor(Math.random()*msgs.length)]);
  }
}

function earnGold(g) {
  G.p.gold += g;
  G.p.totalGoldEarned += g;
  tickQuestGold(g);
}

function setBusy(v) {
  G.busy = v;
  document.getElementById('explore-btn').disabled = v;
}

// ── STATUS EFFECTS ───────────────────────────────────────────
const STATUS_ICONS = { poison:'☠️', stun:'💫', burn:'🔥' };
const STATUS_LABELS = { poison:'Vergiftet', stun:'Betäubt', burn:'Brennt' };

function applyStatus(target, type, turns, value) {
  const list = target === 'player' ? G.combat.playerStatus : G.combat.enemyStatus;
  const existing = list.find(s=>s.type===type);
  if (existing) { existing.turns = Math.max(existing.turns, turns); return; }
  list.push({ type, turns, value });
  const who = target==='player' ? G.p.name : G.combat.name;
  combatLog(`${STATUS_ICONS[type]} ${who} ist ${STATUS_LABELS[type]}!`);
}

// Returns true if the turn should be skipped due to stun
function processStatuses(target) {
  const list = target==='player' ? G.combat.playerStatus : G.combat.enemyStatus;
  let stunned = false;
  for (let i = list.length-1; i >= 0; i--) {
    const s = list[i];
    if (s.type === 'stun') {
      stunned = true;
      combatLog(`💫 ${target==='player'? G.p.name : G.combat.name} ist betäubt!`);
    } else if (s.type === 'poison') {
      if (target==='player') {
        G.p.hp -= s.value;
        floatDmg(document.getElementById('player-combat-canvas'), '☠️'+s.value, '#52c07a');
        combatLog(`☠️ Vergiftung: -${s.value} HP`);
      } else {
        G.combat.hp -= s.value;
        floatDmg(document.getElementById('enemy-canvas'), '☠️'+s.value, '#52c07a');
        combatLog(`☠️ ${G.combat.name} vergiftet: -${s.value} HP`);
      }
    } else if (s.type === 'burn') {
      if (target==='player') {
        G.p.hp -= s.value;
        floatDmg(document.getElementById('player-combat-canvas'), '🔥'+s.value, '#ff6600');
        combatLog(`🔥 Verbrennung: -${s.value} HP`);
      } else {
        G.combat.hp -= s.value;
        floatDmg(document.getElementById('enemy-canvas'), '🔥'+s.value, '#ff6600');
        combatLog(`🔥 ${G.combat.name} brennt: -${s.value} HP`);
      }
    }
    s.turns--;
    if (s.turns <= 0) list.splice(i,1);
  }
  return stunned;
}

function renderStatusRow(elId, list) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = list.map(s=>`<span class="sbadge" title="${STATUS_LABELS[s.type]} (${s.turns})">${STATUS_ICONS[s.type]}${s.turns}</span>`).join('');
}

// ── COMBAT ───────────────────────────────────────────────────
function startCombat(foeId, isBoss) {
  const base = FOES[foeId];
  const m = (1 + (G.p.level-1)*0.15) * (isBoss ? 2 : 1);
  const drops = (DROPS[foeId]||[]).map(d => isBoss ? { ...d, p: Math.min(1, d.p*3) } : d);
  G.combat = {
    id: foeId, isBoss,
    name: (isBoss ? '⭐ ' : '') + base.name,
    sprite: base.sprite,
    hp: Math.floor(base.hp*m), maxHp: Math.floor(base.hp*m),
    atk: Math.floor(base.atk*m), def: Math.floor(base.def*m),
    xp: Math.floor(base.xp*m*(isBoss?1.5:1)),
    gold: [base.gold[0]*(isBoss?3:1), base.gold[1]*(isBoss?3:1)],
    drops, playerTurn: true,
    playerStatus: [], enemyStatus: [],
    statusDef: base.status,
  };
  addLog(isBoss ? `🌟 Mächtiger ${base.name}! BOSS!` : `⚔ Ein ${base.name} erscheint!`);
  showScreen('combat', null);
  const eLbl = document.getElementById('enemy-name-lbl');
  eLbl.className = 'cname'+(isBoss?' boss-name':'');
  drawSprite(document.getElementById('enemy-canvas'), base.sprite);
  drawSprite(document.getElementById('player-combat-canvas'), 'player');
  updateCombatUI();
  setCombatBtns(true);
  hideSkillPicker();
  hideCombatItems();
}

function combatAction(act) {
  if (!G.combat || !G.combat.playerTurn) return;
  const p = G.p; const e = G.combat; const s = stats();
  setCombatBtns(false);
  hideSkillPicker();
  hideCombatItems();
  e.playerTurn = false;

  // Process player statuses first
  const stunned = processStatuses('player');
  updateCombatUI(); updateHUD();
  if (p.hp <= 0) { setTimeout(() => { p.hp=0; defeatPlayer(); }, 400); return; }
  if (e.hp <= 0) { setTimeout(combatWin, 400); return; }

  if (act === 'flee') {
    if (Math.random() < 0.45) {
      combatLog('🏃 Du bist geflohen!');
      setTimeout(endCombat, 800);
    } else {
      combatLog('😱 Flucht fehlgeschlagen!');
      setTimeout(enemyTurn, 700);
    }
    return;
  }

  if (stunned) {
    combatLog('💫 Betäubt! Zug übersprungen.');
    setTimeout(enemyTurn, 700);
    return;
  }

  const crit = Math.random() < 0.15;
  const dmg = Math.max(1, Math.floor((s.atk - e.def + rand(-2,3)) * (crit ? 2 : 1)));
  if (crit) combatLog(`💥 KRITISCH! ${dmg} Schaden!`);
  else      combatLog(`⚔ Du schlägst für ${dmg} Schaden!`);
  e.hp -= dmg;
  floatDmg(document.getElementById('enemy-canvas'), (crit?'💥':'')+dmg, crit?'#ffd700':'#e05252');
  shake(document.getElementById('enemy-canvas'));
  updateCombatUI(); updateHUD();

  if (e.hp <= 0) { setTimeout(combatWin, 700); return; }
  setTimeout(enemyTurn, 800);
}

function useSkill(skillId) {
  if (!G.combat || !G.combat.playerTurn) return;
  const skill = SKILLS.find(s=>s.id===skillId);
  if (!skill) return;
  const p = G.p; const e = G.combat; const s = stats();
  if (p.mp < skill.mp) { combatLog('❌ Kein MP!'); return; }

  setCombatBtns(false);
  hideSkillPicker();
  e.playerTurn = false;
  p.mp -= skill.mp;

  const stunned = processStatuses('player');
  updateCombatUI(); updateHUD();
  if (p.hp <= 0) { setTimeout(() => { p.hp=0; defeatPlayer(); }, 400); return; }
  if (e.hp <= 0) { setTimeout(combatWin, 400); return; }

  if (stunned) {
    combatLog('💫 Betäubt! Skill fehlgeschlagen.');
    p.mp += skill.mp; // refund
    setTimeout(enemyTurn, 700);
    return;
  }

  if (skill.healAmt) {
    const healed = Math.min(s.maxHp - p.hp, skill.healAmt);
    p.hp = Math.min(s.maxHp, p.hp + skill.healAmt);
    combatLog(`💚 Heilung! +${healed} HP`);
    floatDmg(document.getElementById('player-combat-canvas'), '+'+healed, '#52c07a');
    updateHUD();
    e.playerTurn = true;
    setCombatBtns(true);
    updateCombatUI();
    return;
  }

  const crit = Math.random() < 0.15;
  const dmg = Math.max(1, Math.floor(s.atk * skill.dmgMult - e.def + rand(-1,2)) * (crit?2:1));
  combatLog(`${skill.icon} ${skill.name}! ${dmg} Schaden!${crit?' KRIT!':''}`);
  e.hp -= dmg;
  floatDmg(document.getElementById('enemy-canvas'), skill.icon+dmg, '#e8c96b');
  shake(document.getElementById('enemy-canvas'));

  if (skill.burn)  applyStatus('enemy', 'burn',   2, 8);
  if (skill.drain) {
    const drained = Math.floor(dmg * 0.4);
    p.hp = Math.min(s.maxHp, p.hp + drained);
    combatLog(`🩸 Lebensraub: +${drained} HP`);
    floatDmg(document.getElementById('player-combat-canvas'), '+'+drained, '#cc44aa');
  }

  updateCombatUI(); updateHUD();
  if (e.hp <= 0) { setTimeout(combatWin, 700); return; }
  setTimeout(enemyTurn, 800);
}

function useItemInCombat(idx) {
  if (!G.combat || !G.combat.playerTurn) return;
  const slot = G.p.inv[idx];
  if (!slot) return;
  const item = ITEMS[slot.id];
  if (!item || item.slot) return;

  const p = G.p; const s = stats();
  if (item.hp) { p.hp = Math.min(s.maxHp, p.hp+(item.hp||0)); floatDmg(document.getElementById('player-combat-canvas'), '+'+item.hp+'HP', '#52c07a'); }
  if (item.mp) { p.mp = Math.min(s.maxMp, p.mp+(item.mp||0)); }
  slot.qty = (slot.qty||1)-1;
  if (slot.qty <= 0) p.inv.splice(idx,1);
  combatLog(`🧪 ${item.name} benutzt!`);
  hideCombatItems();
  setCombatBtns(false);
  G.combat.playerTurn = false;
  updateHUD();
  setTimeout(enemyTurn, 800);
}

// ── SKILL PICKER ─────────────────────────────────────────────
function toggleSkillPicker() {
  const p = document.getElementById('skill-picker');
  if (p.classList.contains('open')) hideSkillPicker();
  else { hideCombatItems(); showSkillPicker(); }
}

function showSkillPicker() {
  const picker = document.getElementById('skill-picker');
  const available = unlockedSkills();
  picker.innerHTML = '';
  available.forEach(skill => {
    const hasMP = G.p.mp >= skill.mp;
    const btn = document.createElement('button');
    btn.className = 'skill-btn'+(hasMP?'':' no-mp');
    btn.innerHTML = `<span>${skill.icon} ${skill.name}</span><span class="skill-unlock">${skill.mp}MP · ${skill.desc}</span>`;
    if (hasMP) btn.onclick = () => useSkill(skill.id);
    picker.appendChild(btn);
  });
  if (!available.length) {
    picker.innerHTML = '<div style="font-size:7px;color:var(--dim);padding:8px;text-align:center">Noch keine Skills. Erreiche LV 1.</div>';
  }
  picker.classList.add('open');
  document.getElementById('btn-skills').textContent = '✨ Skills ▼';
}

function hideSkillPicker() {
  document.getElementById('skill-picker').classList.remove('open');
  const b = document.getElementById('btn-skills');
  if (b) b.textContent = '✨ Skills';
}

// ── COMBAT ITEM PICKER ───────────────────────────────────────
function toggleCombatItems() {
  const p = document.getElementById('combat-item-picker');
  if (p.classList.contains('open')) hideCombatItems();
  else { hideSkillPicker(); showCombatItems(); }
}

function showCombatItems() {
  const picker = document.getElementById('combat-item-picker');
  const consumables = G.p.inv.filter(s => ITEMS[s.id] && !ITEMS[s.id].slot);
  picker.innerHTML = '';
  if (!consumables.length) {
    picker.innerHTML = '<div style="font-size:7px;color:var(--dim);padding:8px;text-align:center">Keine Tränke im Inventar.</div>';
  } else {
    G.p.inv.forEach((slot, idx) => {
      const item = ITEMS[slot.id];
      if (!item || item.slot) return;
      const btn = document.createElement('button');
      btn.className = 'skill-btn';
      btn.innerHTML = `<span>${item.icon} ${item.name}${slot.qty>1?` x${slot.qty}`:''}</span><span class="skill-unlock">${item.hp?'+'+item.hp+'HP':''} ${item.mp?'+'+item.mp+'MP':''}</span>`;
      btn.onclick = () => useItemInCombat(idx);
      picker.appendChild(btn);
    });
  }
  picker.classList.add('open');
  document.getElementById('btn-items').textContent = '🎒 Items ▼';
}

function hideCombatItems() {
  document.getElementById('combat-item-picker').classList.remove('open');
  const b = document.getElementById('btn-items');
  if (b) b.textContent = '🎒 Items';
}

function enemyTurn() {
  if (!G.combat) return;
  const p = G.p; const e = G.combat; const s = stats();

  // Process enemy statuses
  const stunned = processStatuses('enemy');
  updateCombatUI();
  if (e.hp <= 0) { setTimeout(combatWin, 400); return; }

  if (!stunned) {
    const crit = Math.random() < 0.1;
    const dmg = Math.max(1, Math.floor((e.atk - s.def + rand(-2,2)) * (crit?1.8:1)));
    p.hp -= dmg;
    combatLog(`💢 ${e.name} trifft für ${dmg}!${crit?' Krit!':''}`);
    floatDmg(document.getElementById('player-combat-canvas'), '-'+dmg, '#e05252');
    shake(document.getElementById('player-combat-canvas'));

    // Enemy may inflict status
    if (e.statusDef && Math.random() < e.statusDef.chance) {
      applyStatus('player', e.statusDef.type, e.statusDef.turns, e.statusDef.value);
    }
  }

  updateCombatUI(); updateHUD();

  if (p.hp <= 0) { p.hp=0; defeatPlayer(); return; }
  e.playerTurn = true;
  setCombatBtns(true);
}

function defeatPlayer() {
  combatLog('💀 Du wurdest besiegt...');
  setCombatBtns(false);
  setTimeout(() => {
    const p = G.p;
    const lost = Math.floor(p.gold*0.1);
    p.gold = Math.max(0, p.gold-lost);
    p.hp = Math.max(1, Math.floor(stats().maxHp*0.3));
    endCombat();
    addLog(`💀 Respawn. Verloren: ${lost} Gold.`);
  }, 1400);
}

function combatWin() {
  const p = G.p; const e = G.combat;
  const g = rand(e.gold[0], e.gold[1]);
  earnGold(g); p.kills++;
  combatLog(`🎉 Sieg! +${e.xp} XP  +${g} Gold`);
  tickQuestKill(e.id);
  for (const drop of e.drops) {
    if (Math.random() < drop.p) {
      addInv(drop.id);
      const it = ITEMS[drop.id];
      combatLog(`📦 ${it.rarity==='legendary'?'🌟':it.rarity==='epic'?'💜':''} ${it.name}!`);
    }
  }
  const xp = e.xp;
  setTimeout(() => { endCombat(); gainXP(xp); addLog(`✅ ${e.name} besiegt! +${xp} XP`); }, 1100);
}

function endCombat() {
  G.combat = null;
  hideSkillPicker(); hideCombatItems();
  showScreen('explore', document.querySelector('.nav-btn'));
  refresh();
}

function updateCombatUI() {
  const e = G.combat; const p = G.p; const s = stats();
  if (!e) return;
  document.getElementById('enemy-name-lbl').textContent  = e.name;
  document.getElementById('enemy-hp-text').textContent   = `${Math.max(0,e.hp)}/${e.maxHp}`;
  document.getElementById('enemy-hp-bar').style.width    = pct(Math.max(0,e.hp), e.maxHp);
  document.getElementById('pcombat-hp-text').textContent = `${Math.max(0,p.hp)}/${s.maxHp}`;
  document.getElementById('pcombat-hp-bar').style.width  = pct(Math.max(0,p.hp), s.maxHp);
  renderStatusRow('enemy-status', e.enemyStatus);
  renderStatusRow('player-status', e.playerStatus);
}

function setCombatBtns(on) {
  document.querySelectorAll('.cbtn').forEach(b => b.disabled = !on);
}

// ── FLOATING DAMAGE NUMBERS ──────────────────────────────────
function floatDmg(el, text, color='#e05252') {
  const rect = el.getBoundingClientRect();
  const d = document.createElement('div');
  d.className = 'dmg-num';
  d.textContent = text;
  d.style.cssText = `left:${Math.round(rect.left+rect.width/2-20)}px;top:${Math.round(rect.top+4)}px;color:${color}`;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 950);
}

// ── INVENTORY ────────────────────────────────────────────────
function addInv(id) {
  const item = ITEMS[id];
  if (!item) return;
  if (!item.slot) {
    const ex = G.p.inv.find(i=>i.id===id);
    if (ex) ex.qty=(ex.qty||1)+1;
    else G.p.inv.push({ id, qty:1 });
  } else {
    G.p.inv.push({ id, equipped:false });
  }
}

function useItem(idx) {
  const p = G.p;
  const slot = p.inv[idx];
  if (!slot) return;
  const item = ITEMS[slot.id];
  if (!item) return;
  if (!item.slot) {
    const s = stats();
    if (item.hp) p.hp = Math.min(s.maxHp, p.hp+(item.hp||0));
    if (item.mp) p.mp = Math.min(s.maxMp, p.mp+(item.mp||0));
    slot.qty = (slot.qty||1)-1;
    if (slot.qty <= 0) p.inv.splice(idx,1);
    addLog(`🧪 ${item.name} benutzt!`);
  } else {
    const eqSlot = item.slot;
    if (slot.equipped) {
      slot.equipped = false; p.eq[eqSlot] = null;
    } else {
      const prev = p.inv.find(i=>i.id===p.eq[eqSlot]?.id && i.equipped);
      if (prev) prev.equipped = false;
      slot.equipped = true; p.eq[eqSlot] = item;
    }
  }
  refresh();
}

function sellItem(idx) {
  const p = G.p;
  const slot = p.inv[idx];
  if (!slot || slot.equipped) return;
  const item = ITEMS[slot.id];
  if (!item) return;
  const price = Math.floor(item.value * 0.5);
  if (slot.qty > 1) slot.qty--;
  else p.inv.splice(idx, 1);
  earnGold(price);
  addLog(`💱 ${item.name} für ${price} Gold verkauft.`);
  refresh();
}

function updateInvScreen() {
  document.getElementById('inv-gold-lbl').textContent = `🪙 ${G.p.gold}`;
  const grid = document.getElementById('inv-grid');
  grid.innerHTML = '';
  G.p.inv.forEach((slot, idx) => {
    const item = ITEMS[slot.id];
    if (!item) return;
    const div = document.createElement('div');
    div.className = `inv-item${slot.equipped?' equipped':''} ${item.rarity||''}`;
    div.innerHTML = `${item.icon}<small>${item.name.slice(0,10)}</small>${slot.qty>1?`<small>x${slot.qty}</small>`:''}`;
    div.onclick = () => useItem(idx);
    let t;
    div.addEventListener('touchstart', () => { t = setTimeout(() => sellItem(idx), 600); }, {passive:true});
    div.addEventListener('touchend',   () => clearTimeout(t), {passive:true});
    div.addEventListener('touchmove',  () => clearTimeout(t), {passive:true});
    grid.appendChild(div);
  });
}

// ── SHOP ─────────────────────────────────────────────────────
function shopTab(mode, btn) {
  G.shopMode = mode;
  document.querySelectorAll('.stab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('shop-buy-list').style.display  = mode==='buy'  ? 'flex' : 'none';
  document.getElementById('shop-sell-list').style.display = mode==='sell' ? 'flex' : 'none';
  if (mode === 'sell') renderShopSell();
}

function buyItem(id) {
  const item = ITEMS[id];
  if (!item) return;
  const price = Math.ceil(item.value * 1.5);
  if (G.p.gold < price) { showOverlay('❌ Kein Gold!'); return; }
  G.p.gold -= price;
  addInv(id);
  addLog(`🛒 ${item.name} gekauft!`);
  refresh(); updateShopScreen();
}

function renderShopSell() {
  const list = document.getElementById('shop-sell-list');
  list.innerHTML = '';
  if (!G.p.inv.length) { list.innerHTML = '<div style="font-size:7px;color:var(--dim);padding:12px">Inventar leer.</div>'; return; }
  G.p.inv.forEach((slot, idx) => {
    const item = ITEMS[slot.id];
    if (!item) return;
    const price = Math.floor(item.value * 0.5);
    const row = document.createElement('div');
    row.className = 'shop-row';
    row.innerHTML = `
      <div class="shop-icon">${item.icon}</div>
      <div class="shop-info"><div class="shop-name">${item.name}${slot.qty>1?` x${slot.qty}`:''}</div><div class="shop-stat">${slot.equipped?'[equipped]':''}</div></div>
      <div class="shop-price">${price}🪙</div>
      <button class="shop-btn" ${slot.equipped?'disabled':''} onclick="sellItem(${idx});updateShopScreen()">Sell</button>`;
    list.appendChild(row);
  });
}

function updateShopScreen() {
  document.getElementById('shop-gold-val').textContent = G.p.gold;
  const buy = document.getElementById('shop-buy-list');
  buy.innerHTML = '';
  Object.entries(ITEMS).filter(([,it])=>it.buyable).forEach(([id,item]) => {
    const price = Math.ceil(item.value * 1.5);
    const parts = [];
    if (item.atk)   parts.push(`ATK+${item.atk}`);
    if (item.def)   parts.push(`DEF+${item.def}`);
    if (item.maxHp) parts.push(`HP+${item.maxHp}`);
    if (item.maxMp) parts.push(`MP+${item.maxMp}`);
    if (item.hp)    parts.push(`Heilt ${item.hp}`);
    if (item.mp)    parts.push(`+${item.mp}MP`);
    const row = document.createElement('div');
    row.className = 'shop-row';
    row.innerHTML = `
      <div class="shop-icon">${item.icon}</div>
      <div class="shop-info"><div class="shop-name">${item.name}</div><div class="shop-stat">${parts.join('  ')}</div></div>
      <div class="shop-price">${price}🪙</div>
      <button class="shop-btn" ${G.p.gold<price?'disabled':''} onclick="buyItem('${id}')">Buy</button>`;
    buy.appendChild(row);
  });
  if (G.shopMode === 'sell') renderShopSell();
}

// ── QUESTS ───────────────────────────────────────────────────
function generateQuests() {
  while (G.quests.length < 3) {
    const used = new Set(G.quests.map(q=>q.label));
    const available = QUEST_POOL.filter(q => !used.has(q.label));
    if (!available.length) break;
    const tmpl = available[Math.floor(Math.random()*available.length)];
    G.quests.push({ ...tmpl, progress:0 });
  }
}

function tickQuestKill(foeId) {
  let changed = false;
  G.quests.forEach(q => {
    if (q.type==='kill' && q.target===foeId && q.progress<q.qty) {
      q.progress++; changed = true;
      if (q.progress >= q.qty) addLog(`📜 Quest fertig: ${q.label}!`);
    }
  });
  if (changed) updateQuestScreen();
}

function tickQuestStep() {
  let changed = false;
  G.quests.forEach(q => {
    if (q.type==='step' && q.progress<q.qty) {
      q.progress++; changed = true;
      if (q.progress >= q.qty) addLog(`📜 Quest fertig: ${q.label}!`);
    }
  });
  if (changed) updateQuestScreen();
}

function tickQuestGold(amount) {
  let changed = false;
  G.quests.forEach(q => {
    if (q.type==='gold' && q.progress<q.qty) {
      q.progress = Math.min(q.qty, q.progress+amount); changed = true;
      if (q.progress >= q.qty) addLog(`📜 Quest fertig: ${q.label}!`);
    }
  });
  if (changed) updateQuestScreen();
}

function claimQuest(idx) {
  const q = G.quests[idx];
  if (!q || q.progress < q.qty) return;
  G.p.gold += q.goldR;
  if (q.itemR) addInv(q.itemR);
  const xpAmt = q.xpR;
  G.quests.splice(idx, 1);
  generateQuests();
  showOverlay(`📜 Quest!\n+${xpAmt} XP\n+${q.goldR} Gold${q.itemR?'\n+'+ITEMS[q.itemR]?.name:''}`);
  gainXP(xpAmt);
  updateQuestScreen(); refresh();
}

function updateQuestScreen() {
  const list = document.getElementById('quest-list');
  if (!list) return;
  list.innerHTML = '';
  G.quests.forEach((q, idx) => {
    const done = q.progress >= q.qty;
    const card = document.createElement('div');
    card.className = 'quest-card'+(done?' done':'');
    const rew = [`+${q.xpR} XP`, `+${q.goldR}🪙`];
    if (q.itemR) rew.push(ITEMS[q.itemR]?.icon||'');
    card.innerHTML = `
      <div class="quest-title">${q.label}</div>
      <div class="quest-prog-wrap"><div class="quest-prog${done?' done':''}" style="width:${pct(q.progress,q.qty)}"></div></div>
      <div class="quest-info"><span>${q.progress}/${q.qty}</span><span class="quest-reward">${rew.join('  ')}</span></div>
      ${done?`<button class="quest-claim" onclick="claimQuest(${idx})">✅ CLAIM</button>`:''}`;
    list.appendChild(card);
  });
}

// ── HUD + CHAR ───────────────────────────────────────────────
function updateHUD() {
  const p = G.p; const s = stats();
  document.getElementById('hud-level').textContent = `LV ${p.level}`;
  document.getElementById('hp-text').textContent   = `${Math.max(0,p.hp)}`;
  document.getElementById('mp-text').textContent   = `${p.mp}`;
  document.getElementById('hp-bar').style.width    = pct(Math.max(0,p.hp), s.maxHp);
  document.getElementById('mp-bar').style.width    = pct(p.mp, s.maxMp);
  document.getElementById('xp-bar').style.width    = pct(p.xp, p.xpNext);
  document.getElementById('gold-val').textContent  = p.gold;
}

function updateCharScreen() {
  const p = G.p; const s = stats();
  document.getElementById('s-level').textContent = p.level;
  document.getElementById('s-xp').textContent    = `${p.xp} / ${p.xpNext}`;
  document.getElementById('s-hp').textContent    = `${Math.max(0,p.hp)} / ${s.maxHp}`;
  document.getElementById('s-mp').textContent    = `${p.mp} / ${s.maxMp}`;
  document.getElementById('s-maxhp').textContent = s.maxHp;
  document.getElementById('s-maxmp').textContent = s.maxMp;
  document.getElementById('s-atk').textContent   = s.atk;
  document.getElementById('s-def').textContent   = s.def;
  document.getElementById('s-kills').textContent = p.kills;

  const hasPts = p.statPoints > 0;
  document.getElementById('stat-points-banner').style.display = hasPts ? 'block' : 'none';
  document.getElementById('sp-count').textContent = p.statPoints;
  document.querySelectorAll('.salloc').forEach(b => b.disabled = !hasPts);

  const icons = {weapon:'🗡',armor:'🛡',acc:'💍'};
  for (const sl of ['weapon','armor','acc']) {
    const eq = p.eq[sl];
    document.getElementById(`eq-${sl}`).innerHTML = `${icons[sl]} <span>${eq?eq.name:'Empty'}</span>`;
  }
  updateInvScreen();
}

function refresh() {
  updateHUD();
  updateCharScreen();
  updateQuestScreen();
  if (G.combat) updateCombatUI();
}

// ── LOG ──────────────────────────────────────────────────────
function addLog(msg) {
  const log = document.getElementById('log');
  const d = document.createElement('div');
  d.textContent = msg;
  log.insertBefore(d, log.firstChild);
  if (log.children.length > 25) log.removeChild(log.lastChild);
}

function combatLog(msg) {
  const log = document.getElementById('combat-log');
  const d = document.createElement('div');
  d.textContent = msg;
  log.insertBefore(d, log.firstChild);
  if (log.children.length > 14) log.removeChild(log.lastChild);
}

// ── SCREEN NAV ───────────────────────────────────────────────
function showScreen(name, btn) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(`screen-${name}`).classList.add('active');
  if (btn) { btn.classList.add('active'); }
  else {
    const order=['explore','quests','char','shop'];
    const nb=document.querySelectorAll('.nav-btn');
    const i=order.indexOf(name);
    if (i>=0 && nb[i]) nb[i].classList.add('active');
  }
  if (name==='char')    { updateCharScreen(); drawSprite(document.getElementById('char-canvas'),'player'); }
  if (name==='explore') drawSprite(document.getElementById('player-canvas'),'player');
  if (name==='quests')  updateQuestScreen();
  if (name==='shop')    updateShopScreen();
}

// ── OVERLAY ──────────────────────────────────────────────────
function showOverlay(msg) {
  const wrap = document.createElement('div');
  wrap.id = 'overlay';
  wrap.innerHTML = `<div id="overlay-box">${msg.replace(/\n/g,'<br>')}</div>`;
  wrap.onclick = () => wrap.remove();
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 2800);
}

// ── NAME PROMPT ──────────────────────────────────────────────
function promptName(onDone) {
  const wrap = document.createElement('div');
  wrap.id = 'name-overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.85);z-index:100';
  wrap.innerHTML = `
    <div id="overlay-box" style="min-width:260px;max-width:88vw">
      ⚔ PIXEL QUEST RPG<br><br>
      <span style="font-size:7px;color:var(--dim)">Dein Heldenname:</span><br>
      <input id="name-inp" type="text" maxlength="10" value="Hero" autocomplete="off">
      <button id="name-start-btn" onclick="confirmName()">▶ START</button>
    </div>`;
  document.body.appendChild(wrap);
  document.getElementById('name-inp').focus();
  document.getElementById('name-inp').select();
  document.getElementById('name-inp').addEventListener('keydown', e => { if (e.key==='Enter') confirmName(); });
  window._onNameDone = onDone;
}

function confirmName() {
  const inp = document.getElementById('name-inp');
  G.p.name = (inp?.value.trim() || 'Hero').slice(0,10) || 'Hero';
  document.getElementById('name-overlay')?.remove();
  document.getElementById('pcombat-name').textContent = G.p.name;
  if (window._onNameDone) window._onNameDone();
}

// ── SAVE / LOAD ──────────────────────────────────────────────
function save() {
  try { localStorage.setItem('pq_save', JSON.stringify({ p:G.p, steps:G.steps, quests:G.quests })); } catch(_){}
}

function load() {
  try {
    const raw = localStorage.getItem('pq_save');
    if (!raw) return false;
    const d = JSON.parse(raw);
    Object.assign(G.p, d.p);
    G.steps = d.steps || 0;
    G.quests = d.quests || [];
    document.getElementById('step-val').textContent = G.steps;
    return true;
  } catch(_){ return false; }
}

setInterval(save, 15000);

// ── UTILS ────────────────────────────────────────────────────
function pct(v, max) { return `${Math.min(100,Math.max(0,(v/max)*100))}%`; }
function rand(a,b) { return Math.floor(Math.random()*(b-a+1))+a; }
function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

// ── INIT ─────────────────────────────────────────────────────
function init() {
  const hasSave = load();
  generateQuests();
  updateArea();
  refresh();
  drawSprite(document.getElementById('player-canvas'), 'player');
  addLog('🌟 Willkommen bei Pixel Quest RPG!');
  addLog('🗺 Drücke EXPLORE um dein Abenteuer zu beginnen.');
  if (!G.p.inv.length) { addInv('potion'); addInv('wood_sword'); }
  if (!hasSave) promptName(() => save());
}

init();
