// ============================================================
//  PIXEL QUEST RPG
// ============================================================

// ── PIXEL SPRITES ──────────────────────────────────────────
// Each sprite: 8×8 grid, values = palette index or '.' (transparent)
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
    p: ['#52c07a','#2a8050','#a0ffc0','#1a5030'],
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
  }
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

// ── GAME DATA ────────────────────────────────────────────────
const AREAS = [
  { id:'forest',  name:'Enchanted Forest', icon:'🌲', min:1,  max:5,  foes:['slime','goblin','rat','wolf'] },
  { id:'dungeon', name:'Dark Dungeon',      icon:'⛏',  min:4,  max:10, foes:['skeleton','goblin','wolf'] },
  { id:'castle',  name:'Shadow Castle',     icon:'🏰', min:9,  max:20, foes:['skeleton','dragon'] },
];

const FOES = {
  rat:      { name:'Rat',      sprite:'rat',      hp:8,  atk:2,  def:0, xp:5,  gold:[1,3] },
  slime:    { name:'Slime',    sprite:'slime',    hp:14, atk:4,  def:1, xp:10, gold:[1,5] },
  goblin:   { name:'Goblin',   sprite:'goblin',   hp:22, atk:7,  def:2, xp:18, gold:[3,10] },
  wolf:     { name:'Wolf',     sprite:'wolf',     hp:28, atk:9,  def:2, xp:24, gold:[2,8] },
  skeleton: { name:'Skeleton', sprite:'skeleton', hp:38, atk:11, def:4, xp:35, gold:[5,15] },
  dragon:   { name:'Dragon',   sprite:'dragon',   hp:90, atk:20, def:8, xp:120,gold:[25,70] },
};

const DROPS = {
  rat:      [{ id:'potion',        p:0.2 }],
  slime:    [{ id:'potion',        p:0.18 }],
  goblin:   [{ id:'potion',        p:0.22 }, { id:'wood_sword', p:0.06 }],
  wolf:     [{ id:'potion',        p:0.2  }, { id:'leather',    p:0.07 }],
  skeleton: [{ id:'potion',        p:0.28 }, { id:'iron_sword', p:0.08 }, { id:'iron_shield', p:0.07 }],
  dragon:   [{ id:'dragon_blade',  p:0.35 }, { id:'elixir',     p:0.6  }, { id:'magic_ring',  p:0.3  }],
};

const ITEMS = {
  wood_sword:  { name:'Wood Sword',   icon:'🗡', slot:'weapon', atk:4,  def:0,              value:10 },
  iron_sword:  { name:'Iron Sword',   icon:'⚔', slot:'weapon', atk:10, def:0,              value:55 },
  magic_staff: { name:'Magic Staff',  icon:'🪄', slot:'weapon', atk:7,  def:0,  maxMp:10,  value:65 },
  dragon_blade:{ name:'Dragon Blade', icon:'🔥', slot:'weapon', atk:22, def:0,              value:350 },
  leather:     { name:'Leather',      icon:'🥋', slot:'armor',  atk:0,  def:4,              value:30 },
  iron_shield: { name:'Iron Shield',  icon:'🛡', slot:'armor',  atk:0,  def:9,              value:85 },
  health_ring: { name:'HP Ring',      icon:'💍', slot:'acc',    atk:0,  def:0,  maxHp:20,  value:40 },
  magic_ring:  { name:'Magic Ring',   icon:'🔮', slot:'acc',    atk:0,  def:0,  maxMp:15,  value:45 },
  potion:      { name:'HP Potion',    icon:'🧪', slot:null,     hp:40,                      value:20 },
  elixir:      { name:'Elixir',       icon:'✨', slot:null,     hp:80,  mp:20,              value:65 },
};

// ── STATE ────────────────────────────────────────────────────
const G = {
  p: {
    name:'Hero', level:1, xp:0, xpNext:100,
    hp:100, maxHp:100, mp:30, maxMp:30,
    baseAtk:8, baseDef:3, gold:0, kills:0,
    eq:{ weapon:null, armor:null, acc:null },
    inv:[],
  },
  area: AREAS[0],
  combat: null,
  steps: 0,
  busy: false,
};

function stats() {
  const p = G.p;
  let atk=p.baseAtk, def=p.baseDef, maxHp=p.maxHp, maxMp=p.maxMp;
  for (const slot of ['weapon','armor','acc']) {
    const eq = p.eq[slot];
    if (eq) { atk+=eq.atk||0; def+=eq.def||0; maxHp+=eq.maxHp||0; maxMp+=eq.maxMp||0; }
  }
  return { atk, def, maxHp, maxMp };
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
    p.baseAtk += 2; p.baseDef += 1;
    p.maxHp += 15;  p.maxMp += 5;
    p.hp = stats().maxHp; p.mp = stats().maxMp;
    showOverlay(`⭐ LEVEL UP!\nLV ${p.level}\n+2 ATK  +1 DEF\n+15 HP`);
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
  { t:'combat',  w:55 },
  { t:'gold',    w:22 },
  { t:'heal',    w:12 },
  { t:'nothing', w:11 },
];

function pick(arr) {
  const total = arr.reduce((s,e)=>s+(e.w||e.p),0);
  let r = Math.random()*total;
  for (const e of arr) { r -= (e.w||e.p); if (r<=0) return e; }
  return arr[arr.length-1];
}

function doStep() {
  if (G.busy || G.combat) return;
  const p = G.p;
  if (p.hp <= 0) { addLog('❌ Du bist tot! Benutze einen Trank.'); return; }

  G.steps++;
  document.getElementById('step-val').textContent = G.steps;

  setBusy(true);
  setTimeout(() => setBusy(false), 700);

  const ev = pick(EVENTS);

  if (ev.t === 'combat') {
    const foeId = G.area.foes[Math.floor(Math.random()*G.area.foes.length)];
    startCombat(foeId);
  } else if (ev.t === 'gold') {
    const g = Math.floor((Math.random()*8+2) * p.level);
    p.gold += g;
    addLog(`💰 Du findest ${g} Gold!`);
    refresh();
  } else if (ev.t === 'heal') {
    const amt = Math.floor(Math.random()*15+8);
    const s = stats();
    p.hp = Math.min(s.maxHp, p.hp+amt);
    addLog(`🌿 Ein Heilkraut! +${amt} HP`);
    refresh();
  } else {
    const msgs = [
      '🌲 Nichts passiert. Du wanderst weiter.',
      '🌫️ Ein seltsamer Nebel zieht vorbei...',
      '🍄 Du siehst bunte Pilze. Besser nicht anfassen.',
      '🐦 Vögel zwitschern in der Ferne.',
      '💨 Der Wind flüstert deinen Namen.',
    ];
    addLog(msgs[Math.floor(Math.random()*msgs.length)]);
  }
}

function setBusy(v) {
  G.busy = v;
  document.getElementById('explore-btn').disabled = v;
}

// ── COMBAT ───────────────────────────────────────────────────
function startCombat(foeId) {
  const base = FOES[foeId];
  const m = 1 + (G.p.level-1)*0.15;
  G.combat = {
    id: foeId,
    name: base.name,
    sprite: base.sprite,
    hp: Math.floor(base.hp*m),
    maxHp: Math.floor(base.hp*m),
    atk: Math.floor(base.atk*m),
    def: Math.floor(base.def*m),
    xp: Math.floor(base.xp*m),
    gold: base.gold,
    drops: DROPS[foeId]||[],
    playerTurn: true,
  };
  addLog(`⚔ Ein ${base.name} erscheint!`);
  showScreen('combat', null);
  drawSprite(document.getElementById('enemy-canvas'), base.sprite);
  drawSprite(document.getElementById('player-combat-canvas'), 'player');
  updateCombatUI();
  setCombatBtns(true);
}

function combatAction(act) {
  if (!G.combat || !G.combat.playerTurn) return;
  const p = G.p; const e = G.combat; const s = stats();
  setCombatBtns(false);
  e.playerTurn = false;

  if (act === 'flee') {
    if (Math.random() < 0.45) {
      combatLog('🏃 Du bist geflohen!');
      setTimeout(() => endCombat(false), 800);
    } else {
      combatLog('😱 Flucht fehlgeschlagen!');
      setTimeout(() => enemyTurn(), 700);
    }
    return;
  }

  let dmg;
  if (act === 'skill') {
    if (p.mp < 10) { combatLog('❌ Kein MP!'); e.playerTurn=true; setCombatBtns(true); return; }
    p.mp -= 10;
    dmg = Math.max(1, Math.floor(s.atk*1.8 - e.def + rand(-2,2)));
    combatLog(`✨ Skill! ${dmg} Schaden!`);
  } else {
    dmg = Math.max(1, s.atk - e.def + rand(-2,3));
    combatLog(`⚔ Du schlägst für ${dmg} Schaden!`);
  }

  e.hp -= dmg;
  shake(document.getElementById('enemy-canvas'));
  updateCombatUI();

  if (e.hp <= 0) { setTimeout(combatWin, 700); return; }
  setTimeout(enemyTurn, 800);
}

function enemyTurn() {
  const p = G.p; const e = G.combat; const s = stats();
  const dmg = Math.max(1, e.atk - s.def + rand(-2,2));
  p.hp -= dmg;
  combatLog(`💢 ${e.name} trifft für ${dmg} Schaden!`);
  shake(document.getElementById('player-combat-canvas'));
  updateCombatUI();
  updateHUD();

  if (p.hp <= 0) {
    p.hp = 0;
    combatLog('💀 Du wurdest besiegt...');
    setTimeout(() => {
      const lost = Math.floor(p.gold*0.1);
      p.gold = Math.max(0, p.gold-lost);
      p.hp = Math.max(1, Math.floor(stats().maxHp*0.3));
      endCombat(false);
      addLog(`💀 Respawn. Verloren: ${lost} Gold.`);
    }, 1400);
    return;
  }
  e.playerTurn = true;
  setCombatBtns(true);
}

function combatWin() {
  const p = G.p; const e = G.combat;
  const g = rand(e.gold[0], e.gold[1]);
  p.gold += g; p.kills++;
  combatLog(`🎉 Sieg! +${e.xp} XP  +${g} Gold`);

  for (const drop of e.drops) {
    if (Math.random() < drop.p) {
      addInv(drop.id);
      combatLog(`📦 ${ITEMS[drop.id].name} gefunden!`);
    }
  }
  const xp = e.xp;
  setTimeout(() => { endCombat(true); gainXP(xp); addLog(`✅ ${e.name} besiegt! +${xp} XP`); }, 1100);
}

function endCombat(won) {
  G.combat = null;
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
}

function setCombatBtns(on) {
  document.querySelectorAll('.cbtn').forEach(b => b.disabled = !on);
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
  updateInvScreen();
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
      slot.equipped = false;
      p.eq[eqSlot] = null;
    } else {
      const prev = p.inv.find(i=>i.id===p.eq[eqSlot]?.id && i.equipped);
      if (prev) prev.equipped = false;
      slot.equipped = true;
      p.eq[eqSlot] = item;
    }
  }
  refresh();
}

function updateInvScreen() {
  document.getElementById('inv-gold-val').textContent = G.p.gold;
  const grid = document.getElementById('inv-grid');
  grid.innerHTML = '';
  G.p.inv.forEach((slot,idx) => {
    const item = ITEMS[slot.id];
    if (!item) return;
    const div = document.createElement('div');
    div.className = 'inv-item'+(slot.equipped?' equipped':'');
    div.innerHTML = `${item.icon}<small>${item.name.slice(0,10)}</small>${slot.qty>1?`<small>x${slot.qty}</small>`:''}`;
    div.onclick = () => useItem(idx);
    grid.appendChild(div);
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
  document.getElementById('s-atk').textContent   = s.atk;
  document.getElementById('s-def').textContent   = s.def;
  document.getElementById('s-kills').textContent = p.kills;
  const icons = {weapon:'🗡',armor:'🛡',acc:'💍'};
  for (const sl of ['weapon','armor','acc']) {
    const eq = p.eq[sl];
    document.getElementById(`eq-${sl}`).innerHTML = `${icons[sl]} <span>${eq?eq.name:'Empty'}</span>`;
  }
}

function refresh() {
  updateHUD();
  updateCharScreen();
  updateInvScreen();
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
  if (log.children.length > 12) log.removeChild(log.lastChild);
}

// ── SCREEN NAV ───────────────────────────────────────────────
function showScreen(name, btn) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(`screen-${name}`).classList.add('active');
  if (btn) { btn.classList.add('active'); }
  else {
    const order=['explore','char','inventory'];
    const nb=document.querySelectorAll('.nav-btn');
    const i=order.indexOf(name);
    if (i>=0 && nb[i]) nb[i].classList.add('active');
  }
  if (name==='char') { updateCharScreen(); drawSprite(document.getElementById('char-canvas'),'player'); }
  if (name==='explore') drawSprite(document.getElementById('player-canvas'),'player');
}

// ── OVERLAY (level up, etc.) ─────────────────────────────────
function showOverlay(msg) {
  const wrap = document.createElement('div');
  wrap.id = 'overlay';
  wrap.innerHTML = `<div id="overlay-box">${msg.replace(/\n/g,'<br>')}</div>`;
  wrap.onclick = () => wrap.remove();
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 2600);
}

// ── SAVE / LOAD ──────────────────────────────────────────────
function save() {
  try { localStorage.setItem('pq_save', JSON.stringify({ p:G.p, steps:G.steps })); } catch(_){}
}

function load() {
  try {
    const raw = localStorage.getItem('pq_save');
    if (!raw) return;
    const d = JSON.parse(raw);
    Object.assign(G.p, d.p);
    G.steps = d.steps || 0;
    document.getElementById('step-val').textContent = G.steps;
  } catch(_){}
}

setInterval(save, 15000);

// ── UTILS ────────────────────────────────────────────────────
function pct(v, max) { return `${Math.min(100, Math.max(0, (v/max)*100))}%`; }
function rand(a,b) { return Math.floor(Math.random()*(b-a+1))+a; }

function shake(el) {
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
}

// ── INIT ─────────────────────────────────────────────────────
function init() {
  load();
  updateArea();
  refresh();
  drawSprite(document.getElementById('player-canvas'), 'player');
  addLog('🌟 Willkommen bei Pixel Quest RPG!');
  addLog('🗺 Drücke EXPLORE um dein Abenteuer zu beginnen.');
  if (!G.p.inv.length) {
    addInv('potion');
    addInv('wood_sword');
  }
}

init();
