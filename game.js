// ============================================================
//  PIXEL QUEST RPG
// ============================================================

// ── SPRITES ─────────────────────────────────────────────────
const SPRITES = {
  player: {
    p: ['#c8a882','#4a2e00','#3a5a9a','#8ab4d8','#c0c0c0','#888888','#e8c96b','#e05252'],
    d: [['.','.',1,1,1,1,'.','.'],['.',1,0,0,0,0,1,'.'],['.','.',0,0,0,0,'.','.'],['.', 2,2,6,6,2,2,'.'],[2,3,2,2,2,2,3,2],['.', 2,2,2,2,2,2,'.'],['.', 5,'.',4,4,'.',5,'.'],[5,5,'.','.','.','.', 5,5]]
  },
  slime:    { p:['#52c07a','#2a8050','#a0ffc0'],     d:[['.','.','.','.','.','.','.','.'],['.','.',0,0,0,0,'.','.'],['.',0,2,0,0,2,0,'.'],['.', 0,0,0,0,0,0,'.'],[0,0,0,0,0,0,0,0],[0,1,0,0,0,0,1,0],['.',0,1,1,1,1,0,'.'],['.','.','.','.','.','.','.','.']] },
  goblin:   { p:['#6aab3c','#3a6b1c','#c8a882','#cc3333','#888888'], d:[['.','.', 0,0,0,0,'.','.'],['.',0,2,3,3,2,0,'.'],['.','.',2,2,2,2,'.','.'],['.',0,0,0,0,0,0,'.'],['.',4,0,0,0,0,4,'.'],['.','.',0,0,0,0,'.','.'],['.','.', 1,'.','.', 1,'.','.'],['.','.', 1,1,1,1,'.','.'] ] },
  skeleton: { p:['#e8e8d0','#c0baa0','#888878','#333323','#cc3333'], d:[['.','.', 0,0,0,0,'.','.'],['.',0,3,0,3,0,0,'.'],['.','.',0,1,1,0,'.','.'],['.','.', 0,0,0,0,'.','.'],['.',2,0,0,0,0,2,'.'],['.','.',0,0,0,0,'.','.'],['.','.', 2,'.','.', 2,'.','.'],['.','.', 2,2,2,2,'.','.'] ] },
  wolf:     { p:['#888888','#555555','#cccccc','#333333'],            d:[['.','.', 0,0,'.','.', 0,0],['.',0,0,0,0,0,0,0],['.',0,2,0,0,2,0,'.'],['.','.',0,0,0,0,'.','.'], [0,0,0,0,0,0,0,0],['.',1,0,0,0,0,1,'.'],['.',1,'.','.','.','.', 1,'.'],['.','.','.','.','.','.','.','.'] ] },
  dragon:   { p:['#8b0000','#cc3333','#ffd700','#ff6600','#2a0000'],  d:[[0,'.','.', 0,0,'.','.', 0],[0,0,2,0,0,2,0,0],['.',0,1,0,0,1,0,'.'],['.','.',0,0,0,0,'.','.'], [0,0,0,0,0,0,0,0],[0,3,0,2,2,0,3,0],[0,0,'.',0,0,'.',0,0],['.',0,'.','.','.','.', 0,'.'] ] },
  rat:      { p:['#997766','#664433','#ccbbaa','#333333'],            d:[['.','.','.','.','.','.','.',0],['.','.',0,0,0,'.',0,0],['.',0,0,2,2,0,0,'.'],['.', 0,0,0,0,0,0,'.'],[0,0,0,0,0,0,0,0],['.',0,0,0,0,0,0,'.'],['.','.',1,'.','.','.','.','.'],['.','.','.','.','.','.','.','.']] },
  bat:      { p:['#4a2878','#7744aa','#220033','#cc88ff'],            d:[[0,'.','.','.','.','.','.', 0],[0,0,'.','.','.','.', 0,0],[0,0,0,1,1,0,0,0],[0,3,0,1,1,0,3,0],['.',0,0,0,0,0,0,'.'],['.','.',0,2,2,0,'.','.'],['.','.','.', 0,0,'.','.', '.'],['.','.','.','.','.','.','.','.']] },
  troll:    { p:['#4a7a3c','#2a5a1c','#c8b082','#8aaa6a','#333333'], d:[['.','.', 0,0,0,0,'.','.'],['.',0,2,0,0,2,0,'.'],[0,0,2,2,2,2,0,0],[0,3,0,0,0,0,3,0],[0,0,0,0,0,0,0,0],[0,1,0,0,0,0,1,0],[0,1,'.','.','.','.',1,0],['.',1,1,'.','.', 1,1,'.'] ] },
  zombie:   { p:['#6a8a5a','#3a5a2a','#c8a882','#4a8a4a','#cc3333'], d:[['.','.', 0,0,0,0,'.','.'],['.',0,2,4,4,2,0,'.'],['.','.',2,2,2,2,'.','.'],['.',3,3,3,3,3,3,'.'],[3,0,3,3,3,3,0,3],['.',3,3,3,3,3,3,'.'],['.','.',1,'.','.', 1,'.','.'],['.','.', 1,1,1,1,'.','.'] ] },
  ghost:    { p:['#aaaaee','#7777cc','#ffffff','#4444aa','#ccccff'],  d:[['.','.', 0,0,0,0,'.','.'],['.',0,0,0,0,0,0,'.'],['.',0,2,0,0,2,0,'.'],['.',0,0,0,0,0,0,'.'],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,'.',0,'.','.', 0,'.',0],['.','.','.','.','.','.','.','.']] },
  demon:    { p:['#aa1111','#660000','#ff4400','#ffaa00','#330000'],  d:[[0,'.',2,'.','.', 2,'.',0],[0,0,0,0,0,0,0,0],['.',0,3,0,0,3,0,'.'],['.', 0,0,0,0,0,0,'.'],[0,1,0,0,0,0,1,0],[0,0,2,0,0,2,0,0],['.',0,0,0,0,0,0,'.'],['.',0,'.','.','.','.', 0,'.'] ] },
  shadow_king: {
    p: ['#1a0033','#4400aa','#9933ff','#ffffff','#ff44ff','#220044','#cc88ff'],
    d: [
      ['.',1,'.',2,2,'.',1,'.'],
      [1, 2, 2, 2, 2, 2, 2, 1],
      ['.', 5, 5, 5, 5, 5, 5,'.'],
      ['.', 5, 3, 5, 5, 3, 5,'.'],
      ['.', 5, 5, 4, 4, 5, 5,'.'],
      [0, 0, 2, 0, 0, 2, 0, 0],
      [2, 0, 5, 0, 0, 5, 0, 2],
      ['.', 2, 0, 0, 0, 0, 2,'.'],
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

// ── SOUND ENGINE ────────────────────────────────────────────
const SFX = (function() {
  let ctx = null; let muted = false;
  function getCtx() { if (!ctx) ctx = new (window.AudioContext||window.webkitAudioContext)(); return ctx; }
  function tone(freq, type, dur, vol=0.15) {
    if (muted) return;
    try {
      const c=getCtx(), o=c.createOscillator(), g=c.createGain();
      o.connect(g); g.connect(c.destination); o.type=type; o.frequency.value=freq;
      g.gain.setValueAtTime(vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime+dur);
      o.start(c.currentTime); o.stop(c.currentTime+dur+0.01);
    } catch(_) {}
  }
  function seq(notes) {
    if (muted) return;
    try {
      const c=getCtx(); const t=c.currentTime;
      notes.forEach(([f,d,del,vol=0.15])=>{
        const o=c.createOscillator(),g=c.createGain();
        o.connect(g); g.connect(c.destination); o.type='square'; o.frequency.value=f;
        g.gain.setValueAtTime(vol, t+del);
        g.gain.exponentialRampToValueAtTime(0.001, t+del+d);
        o.start(t+del); o.stop(t+del+d+0.01);
      });
    } catch(_) {}
  }
  return {
    toggleMute() { muted=!muted; return muted; },
    isMuted() { return muted; },
    hit()        { tone(200,'square',0.08,0.2); tone(130,'square',0.1,0.12); },
    crit()       { seq([[440,'square',0,0.2],[880,'square',0.05,0.25]].map(([f,t,d,v])=>[f,0.12,d,v])); tone(440,'square',0.05,0.2); tone(880,'square',0.1,0.25); },
    dmgTake()    { tone(110,'sawtooth',0.15,0.3); },
    flee()       { seq([[300,0.07,0],[200,0.07,0.07],[150,0.1,0.14]]); },
    goldPickup() { tone(660,'square',0.06,0.12); tone(880,'square',0.09,0.1); },
    itemGet()    { seq([[440,0.06,0],[550,0.06,0.07],[660,0.1,0.14]]); },
    levelUp()    { seq([[262,0.15,0],[330,0.15,0.09],[392,0.15,0.18],[523,0.18,0.27],[659,0.2,0.36],[784,0.3,0.45,0.2]]); },
    victory()    { seq([[392,0.2,0],[523,0.2,0.18],[659,0.2,0.36],[784,0.2,0.54],[1047,0.4,0.72,0.25]]); },
    status()     { tone(180,'sawtooth',0.2,0.25); },
    heal()       { tone(660,'sine',0.1,0.12); tone(880,'sine',0.14,0.1); },
    step()       { tone(180,'square',0.03,0.04); },
    chest()      { seq([[440,0.08,0],[554,0.08,0.09],[659,0.15,0.18,0.2]]); },
    boss()       { seq([[110,0.3,0,0.3],[87,0.4,0.2,0.35],[73,0.5,0.45,0.4]]); },
  };
})();

// ── BACKGROUNDS ─────────────────────────────────────────────
function drawBackground(areaId) {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W=240, H=100;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0,0,W,H);
  const r = (c,x,y,w,h) => { ctx.fillStyle=c; ctx.fillRect(x,y,w,h); };

  if (areaId === 'forest') {
    r('#0a1535',0,0,W,H*0.65); r('#0d1f47',0,H*0.3,W,H*0.35);
    ctx.fillStyle='#ffffff';
    [[20,8],[60,15],[100,5],[140,18],[180,10],[220,6],[45,25],[85,30],[160,22],[200,28]].forEach(([x,y])=>ctx.fillRect(x,y,2,2));
    bgMoon(ctx, 200, 18, 10, '#e8e8c0');
    r('#081a08',0,H*0.6,W,H*0.4); r('#0a2a0a',0,H*0.6,W,4);
    for(let x=0;x<W;x+=22){ const bh=8+(x%3)*3; r('#092209',x,H*0.6-bh,22,bh); }
    bgTree(ctx,10,H*0.64); bgTree(ctx,55,H*0.61); bgTree(ctx,172,H*0.62); bgTree(ctx,212,H*0.60);
    r('#061406',0,H*0.7,W,H*0.3);
  } else if (areaId === 'cave') {
    r('#05040c',0,0,W,H);
    for(let x=0;x<W;x+=18) for(let y=0;y<H;y+=14) { if((x+y)%3===0) r('#0d0c1a',x,y,16,12); }
    [0,22,46,68,92,116,140,162,186,212].forEach((x,i)=>{ const h=14+(i*7)%22; r('#221a38',x+2,0,6,h); r('#1a1430',x,0,8,h-5); });
    [[40,50,'#0028ff'],[82,62,'#4400aa'],[120,44,'#0044aa'],[162,56,'#aa00ff'],[202,48,'#0033cc']].forEach(([x,y,c])=>{
      ctx.globalAlpha=0.55; r(c,x,y,6,6); ctx.globalAlpha=0.25; r(c,x-3,y-3,12,12); ctx.globalAlpha=1;
    });
    [12,38,62,88,112,138,158,178,202,228].forEach((x,i)=>{ const h=8+(i*5)%14; r('#221a38',x+1,H-h,6,h); });
    r('#0e0c18',0,H-8,W,8);
  } else if (areaId === 'dungeon') {
    r('#18181e',0,0,W,H);
    for(let y=0;y<H;y+=10){ const off=(y/10)%2===0?0:18; for(let x=-off;x<W;x+=36){ r('#101018',x+1,y+1,34,8); r('#0a0a12',x,y,36,1); } }
    bgTorch(ctx, 25, H*0.3); bgTorch(ctx, W-34, H*0.3);
    r('#101014',0,H*0.78,W,H*0.22); r('#0a0a10',0,H*0.78,W,2);
  } else if (areaId === 'graveyard') {
    r('#110820',0,0,W,H);
    ctx.fillStyle='#9999aa';
    [[14,7],[36,19],[66,5],[96,21],[126,11],[156,16],[186,6],[216,23],[232,14]].forEach(([x,y])=>ctx.fillRect(x,y,2,2));
    bgMoon(ctx, 182, 20, 13, '#c0c090');
    ctx.globalAlpha=0.12; r('#8888aa',0,H*0.65,W,12); r('#6666aa',28,H*0.60,W*0.7,9); ctx.globalAlpha=1;
    r('#08100a',0,H*0.72,W,H*0.28); r('#181818',0,H*0.72,W,2);
    [[18,H*0.68],[60,H*0.64],[104,H*0.70],[148,H*0.62],[188,H*0.67],[218,H*0.70]].forEach(([x,y])=>{
      const gx=Math.floor(x), gy=Math.floor(y);
      r('#282828',gx,gy,12,16); r('#323232',gx+2,gy-4,8,6); r('#181818',gx+5,gy+4,2,8); r('#181818',gx+2,gy+6,8,2);
    });
    bgDeadTree(ctx, 0, H*0.72); bgDeadTree(ctx, W-16, H*0.72);
  } else if (areaId === 'castle') {
    r('#04010c',0,0,W,H);
    ctx.globalAlpha=0.08; r('#6600aa',70,0,100,H*0.55); ctx.globalAlpha=1;
    ctx.fillStyle='#7777aa';
    [[8,4],[32,16],[72,7],[112,21],[150,5],[188,19],[226,11]].forEach(([x,y])=>ctx.fillRect(x,y,2,2));
    r('#0c0420',0,H*0.38,W,H*0.62);
    for(let x=0;x<W;x+=18){ r('#07021a',x,H*(x%36===0?0.28:0.33),12,H*0.1+6); }
    r('#0a0318',95,H*0.06,50,H*0.94); r('#060114',84,H*0.02,72,14);
    ctx.globalAlpha=0.9; r('#ff7700',106,H*0.22,10,12); r('#ff5500',122,H*0.22,10,12); ctx.globalAlpha=0.25; r('#ff8800',100,H*0.18,22,22); ctx.globalAlpha=1;
    [[38,28],[162,24],[194,40]].forEach(([x,y])=>bgBat(ctx,x,y));
    r('#040010',0,H*0.84,W,H*0.16);
  }
}

function bgMoon(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  for(let dy=-r;dy<=r;dy++) for(let dx=-r;dx<=r;dx++) { if(dx*dx+dy*dy<=r*r) ctx.fillRect(cx+dx,cy+dy,1,1); }
}
function bgTree(ctx, x, groundY) {
  ctx.fillStyle='#4a2800'; ctx.fillRect(x+7,groundY-18,4,18);
  ctx.fillStyle='#0a3a0a'; ctx.fillRect(x+2,groundY-38,14,8); ctx.fillRect(x,groundY-30,18,8); ctx.fillRect(x-2,groundY-22,22,6);
}
function bgTorch(ctx, x, y) {
  ctx.fillStyle='#664422'; ctx.fillRect(x,y+7,4,10);
  ctx.fillStyle='#ff8800'; ctx.fillRect(x-1,y+1,6,7);
  ctx.fillStyle='#ffdd00'; ctx.fillRect(x,y+2,4,5);
  ctx.fillStyle='#ffffff'; ctx.fillRect(x+1,y+3,2,3);
  ctx.globalAlpha=0.14; ctx.fillStyle='#ff8800'; ctx.fillRect(x-9,y-6,22,24); ctx.globalAlpha=1;
}
function bgDeadTree(ctx, x, baseY) {
  const by = Math.floor(baseY);
  ctx.fillStyle='#1a1a1a'; ctx.fillRect(x+4,by-32,3,32); ctx.fillRect(x,by-24,12,2); ctx.fillRect(x+2,by-17,8,2); ctx.fillRect(x+6,by-11,6,2);
}
function bgBat(ctx, x, y) {
  ctx.fillStyle='#1a0030'; ctx.fillRect(x,y+2,2,3); ctx.fillRect(x-4,y,4,2); ctx.fillRect(x+2,y,4,2);
}

// ── AREAS ───────────────────────────────────────────────────
const AREAS = [
  { id:'forest',    name:'Enchanted Forest', icon:'🌲', min:1,  max:4,  foes:['slime','rat','goblin','wolf'] },
  { id:'cave',      name:'Goblin Caves',     icon:'🦇', min:3,  max:7,  foes:['goblin','bat','troll','rat'] },
  { id:'dungeon',   name:'Dark Dungeon',     icon:'⛏',  min:6,  max:11, foes:['skeleton','goblin','wolf','bat'] },
  { id:'graveyard', name:'Cursed Graveyard', icon:'💀', min:9,  max:15, foes:['skeleton','zombie','ghost'] },
  { id:'castle',    name:'Shadow Castle',    icon:'🏰', min:13, max:30, foes:['ghost','demon','dragon'] },
];

const FOES = {
  rat:      { name:'Rat',      sprite:'rat',      hp:8,  atk:2,  def:0,  xp:5,   gold:[1,3],   status:null },
  slime:    { name:'Slime',    sprite:'slime',    hp:14, atk:4,  def:1,  xp:10,  gold:[1,5],   status:null },
  goblin:   { name:'Goblin',   sprite:'goblin',   hp:22, atk:7,  def:2,  xp:18,  gold:[3,10],  status:{type:'stun',   chance:.25,turns:1,value:0} },
  bat:      { name:'Bat',      sprite:'bat',      hp:18, atk:8,  def:1,  xp:16,  gold:[2,7],   status:null },
  wolf:     { name:'Wolf',     sprite:'wolf',     hp:28, atk:9,  def:2,  xp:24,  gold:[2,8],   status:null },
  troll:    { name:'Troll',    sprite:'troll',    hp:45, atk:12, def:5,  xp:40,  gold:[8,18],  status:null },
  skeleton: { name:'Skeleton', sprite:'skeleton', hp:38, atk:11, def:4,  xp:35,  gold:[5,15],  status:null },
  zombie:   { name:'Zombie',   sprite:'zombie',   hp:50, atk:13, def:3,  xp:45,  gold:[6,16],  status:{type:'poison', chance:.35,turns:3,value:6} },
  ghost:    { name:'Ghost',    sprite:'ghost',    hp:42, atk:15, def:6,  xp:55,  gold:[8,20],  status:{type:'stun',   chance:.20,turns:1,value:0} },
  demon:    { name:'Demon',    sprite:'demon',    hp:70, atk:18, def:7,  xp:90,  gold:[15,40], status:{type:'burn',   chance:.30,turns:2,value:10} },
  dragon:   { name:'Dragon',   sprite:'dragon',   hp:90, atk:20, def:8,  xp:120, gold:[25,70], status:{type:'burn',   chance:.40,turns:3,value:12} },
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
  ghost:    [{id:'magic_staff',  p:.12},{id:'magic_ring', p:.12},{id:'elixir',p:.20}],
  demon:    [{id:'demon_armor',  p:.15},{id:'elixir',     p:.40},{id:'magic_ring',p:.18}],
  dragon:   [{id:'dragon_blade', p:.35},{id:'elixir',     p:.60},{id:'magic_ring',p:.30}],
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
};

const SKILLS = [
  { id:'power',   name:'Power Strike', icon:'💥', mp:15, unlockLv:1,  dmgMult:2.2,         desc:'2.2x ATK' },
  { id:'heal',    name:'Heal',         icon:'💚', mp:20, unlockLv:6,  healAmt:50,           desc:'Heilt 50 HP' },
  { id:'thunder', name:'Thunder',      icon:'⚡', mp:30, unlockLv:10, dmgMult:3.5, burn:true,desc:'3.5x + Burn' },
  { id:'drain',   name:'Drain Life',   icon:'🩸', mp:25, unlockLv:15, dmgMult:1.8, drain:true,desc:'1.8x + Lifesteal' },
];

function unlockedSkills() { return SKILLS.filter(s => G.p.level >= s.unlockLv); }

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

// ── STATE ────────────────────────────────────────────────────
const G = {
  p: {
    name:'Hero', level:1, xp:0, xpNext:100,
    hp:100, maxHp:100, mp:30, maxMp:30,
    baseAtk:8, baseDef:3, gold:0, kills:0,
    totalGoldEarned:0, statPoints:0, prestige:0,
    eq:{weapon:null,armor:null,acc:null},
    inv:[],
  },
  area: AREAS[0],
  combat: null,
  steps: 0,
  busy: false,
  quests: [],
  daily: null,
  shopMode: 'buy',
  kingDefeated: false,
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
  if (type==='str') { p.baseAtk+=2; addLog('💪 STR: +2 ATK'); }
  if (type==='def') { p.baseDef+=2; addLog('🛡 DEF: +2 DEF'); }
  if (type==='vit') { p.maxHp+=15; p.hp+=15; addLog('❤️ VIT: +15 MaxHP'); }
  if (type==='wis') { p.maxMp+=8;  p.mp+=8;  addLog('🔮 WIS: +8 MaxMP'); }
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
    p.baseAtk+=1; p.baseDef+=1; p.maxHp+=10; p.maxMp+=3;
    p.hp=Math.min(p.hp+10, stats().maxHp); p.mp=Math.min(p.mp+3, stats().maxMp);
    p.statPoints+=2;
    const ns = SKILLS.find(s=>s.unlockLv===p.level);
    const extra = ns ? `\n${ns.icon} ${ns.name}\nfreigeschaltet!` : '';
    SFX.levelUp();
    showOverlay(`⭐ LEVEL UP!\nLV ${p.level}\n+2 Stat-Punkte${extra}`);
    updateArea();
  }
  refresh();
}

// ── AREA ─────────────────────────────────────────────────────
function updateArea() {
  const lvl = G.p.level;
  G.area = AREAS.find(a=>lvl>=a.min&&lvl<=a.max) || AREAS[AREAS.length-1];
  document.getElementById('area-name').textContent = G.area.name;
  document.getElementById('area-icon').textContent = G.area.icon;
  drawBackground(G.area.id);
  const bb = document.getElementById('boss-btn');
  if (bb) bb.style.display = lvl >= 20 ? 'block' : 'none';
}

// ── EXPLORE ──────────────────────────────────────────────────
const EVENTS = [
  {t:'combat', w:48},{t:'gold',  w:18},{t:'heal',   w:10},
  {t:'chest',  w:8}, {t:'shrine',w:6}, {t:'boss',   w:4},{t:'nothing',w:6},
];
const CHEST_LOOT = ['potion','potion','potion','elixir','iron_sword','leather','iron_shield','health_ring','magic_ring'];

function pick(arr) {
  const total=arr.reduce((s,e)=>s+(e.w||e.p||0),0);
  let r=Math.random()*total;
  for(const e of arr){ r-=(e.w||e.p||0); if(r<=0) return e; }
  return arr[arr.length-1];
}

function doStep() {
  if (G.busy||G.combat) return;
  const p = G.p;
  if (p.hp<=0) { addLog('❌ Du bist tot! Benutze einen Trank.'); return; }
  G.steps++;
  document.getElementById('step-val').textContent = G.steps;
  tickQuestStep(); tickDailyStep();
  SFX.step();
  setBusy(true); setTimeout(()=>setBusy(false),700);

  const ev = pick(EVENTS);
  if (ev.t==='combat'||ev.t==='boss') {
    startCombat(G.area.foes[Math.floor(Math.random()*G.area.foes.length)], ev.t==='boss');
  } else if (ev.t==='gold') {
    const g=Math.floor((Math.random()*8+2)*p.level); earnGold(g); SFX.goldPickup(); addLog(`💰 Du findest ${g} Gold!`); refresh();
  } else if (ev.t==='heal') {
    const amt=Math.floor(Math.random()*15+8); p.hp=Math.min(stats().maxHp,p.hp+amt); SFX.heal(); addLog(`🌿 Ein Heilkraut! +${amt} HP`); refresh();
  } else if (ev.t==='chest') {
    const id=CHEST_LOOT[Math.floor(Math.random()*CHEST_LOOT.length)]; addInv(id);
    SFX.chest(); addLog(`📦 Schatzkiste! ${ITEMS[id].icon} ${ITEMS[id].name} gefunden!`); refresh();
  } else if (ev.t==='shrine') {
    const opts=[
      ()=>{ p.hp=stats().maxHp; addLog('⛩️ Heilschrein! HP vollständig geheilt.'); },
      ()=>{ p.mp=stats().maxMp; addLog('⛩️ Zauberschrein! MP vollständig.'); },
      ()=>{ const x=15*p.level; gainXP(x); addLog(`⛩️ Weisheitsschrein! +${x} XP.`); },
      ()=>{ const g=10*p.level; earnGold(g); addLog(`⛩️ Glücksschrein! +${g} Gold.`); },
    ];
    opts[Math.floor(Math.random()*opts.length)](); refresh();
  } else {
    const msgs=['🌲 Nichts passiert.','🌫️ Seltsamer Nebel...','🍄 Bunte Pilze.','🐦 Vögel zwitschern.','💨 Der Wind flüstert.','🕸️ Überall Spinnweben.','🌙 Der Mond steht tief.'];
    addLog(msgs[Math.floor(Math.random()*msgs.length)]);
  }
}

function earnGold(g) {
  G.p.gold+=g; G.p.totalGoldEarned+=g; tickQuestGold(g); tickDailyGold(g);
}

function setBusy(v) { G.busy=v; document.getElementById('explore-btn').disabled=v; }

// ── STATUS EFFECTS ───────────────────────────────────────────
const STATUS_ICONS  = {poison:'☠️',stun:'💫',burn:'🔥'};
const STATUS_LABELS = {poison:'Vergiftet',stun:'Betäubt',burn:'Brennt'};

function applyStatus(target, type, turns, value) {
  const list = target==='player' ? G.combat.playerStatus : G.combat.enemyStatus;
  const ex = list.find(s=>s.type===type);
  if (ex) { ex.turns=Math.max(ex.turns,turns); return; }
  list.push({type,turns,value});
  SFX.status();
  combatLog(`${STATUS_ICONS[type]} ${target==='player'?G.p.name:G.combat.name} ist ${STATUS_LABELS[type]}!`);
}

function processStatuses(target) {
  const list=target==='player'?G.combat.playerStatus:G.combat.enemyStatus;
  let stunned=false;
  for(let i=list.length-1;i>=0;i--){
    const s=list[i];
    if(s.type==='stun'){ stunned=true; combatLog(`💫 ${target==='player'?G.p.name:G.combat.name} ist betäubt!`); }
    else if(s.type==='poison'||s.type==='burn'){
      const icon=STATUS_ICONS[s.type];
      if(target==='player'){
        G.p.hp-=s.value;
        floatDmg(document.getElementById('player-combat-canvas'),icon+s.value,s.type==='burn'?'#ff6600':'#52c07a');
        combatLog(`${icon} -${s.value} HP`);
      } else {
        G.combat.hp-=s.value;
        floatDmg(document.getElementById('enemy-canvas'),icon+s.value,s.type==='burn'?'#ff6600':'#52c07a');
        combatLog(`${icon} ${G.combat.name}: -${s.value} HP`);
      }
    }
    s.turns--;
    if(s.turns<=0) list.splice(i,1);
  }
  return stunned;
}

function renderStatusRow(elId,list){
  const el=document.getElementById(elId); if(!el) return;
  el.innerHTML=list.map(s=>`<span class="sbadge">${STATUS_ICONS[s.type]}${s.turns}</span>`).join('');
}

// ── COMBAT ───────────────────────────────────────────────────
function startCombat(foeId, isBoss) {
  const base=FOES[foeId];
  const isElite = !isBoss && Math.random() < 0.05;
  const em = isElite ? 2.2 : 1;
  const m=(1+(G.p.level-1)*0.15)*(isBoss?2:1)*em;
  const goldMult = isBoss?3 : isElite?3 : 1;
  const drops=(DROPS[foeId]||[]).map(d=>(isBoss||isElite)?{...d,p:Math.min(1,d.p*(isElite?2.5:3))}:d);
  G.combat={
    id:foeId, isBoss, isElite, name:(isElite?'⚡ ELITE ':isBoss?'⭐ ':'')+base.name, sprite:base.sprite,
    hp:Math.floor(base.hp*m), maxHp:Math.floor(base.hp*m),
    atk:Math.floor(base.atk*m), def:Math.floor(base.def*m),
    xp:Math.floor(base.xp*m*(isBoss?1.5:isElite?2:1)),
    gold:[base.gold[0]*goldMult, base.gold[1]*goldMult],
    drops, playerTurn:true, playerStatus:[], enemyStatus:[],
    statusDef:base.status, isKing:false,
  };
  if (isElite) { addLog(`⚡ Ein ELITE ${base.name} erscheint! (3× Beute)`); SFX.boss(); }
  else addLog(isBoss?`🌟 Mächtiger ${base.name}! BOSS!`:`⚔ Ein ${base.name} erscheint!`);
  enterCombatScreen(base.sprite, isBoss||isElite, false);
}

function startFinalBoss() {
  if (G.p.level < 20) { showOverlay('❌ Du musst LV 20 sein!'); return; }
  G.combat = { ...SHADOW_KING, hp:SHADOW_KING.hp, maxHp:SHADOW_KING.maxHp, playerStatus:[], enemyStatus:[] };
  addLog('👑 DER SHADOW KING ERWACHT!');
  enterCombatScreen('shadow_king', false, true);
}

function enterCombatScreen(sprite, isBoss, isKing) {
  showScreen('combat',null);
  const lbl=document.getElementById('enemy-name-lbl');
  lbl.className='cname'+(isKing?' boss-name':isBoss?' boss-name':'');
  drawSprite(document.getElementById('enemy-canvas'),sprite);
  drawSprite(document.getElementById('player-combat-canvas'),'player');
  updateCombatUI(); setCombatBtns(true); hideSkillPicker(); hideCombatItems();
}

function combatAction(act) {
  if (!G.combat||!G.combat.playerTurn) return;
  const p=G.p; const e=G.combat; const s=stats();
  setCombatBtns(false); hideSkillPicker(); hideCombatItems(); e.playerTurn=false;
  const stunned=processStatuses('player');
  updateCombatUI(); updateHUD();
  if(p.hp<=0){setTimeout(()=>{p.hp=0;defeatPlayer();},400);return;}
  if(e.hp<=0){setTimeout(combatWin,400);return;}

  if(act==='flee'){
    if(Math.random()<0.45){ combatLog('🏃 Geflohen!'); SFX.flee(); setTimeout(endCombat,800); }
    else{ combatLog('😱 Flucht fehlgeschlagen!'); setTimeout(enemyTurn,700); }
    return;
  }
  if(stunned){ combatLog('💫 Betäubt! Zug übersprungen.'); setTimeout(enemyTurn,700); return; }

  const crit=Math.random()<0.15;
  const dmg=Math.max(1,Math.floor((s.atk-e.def+rand(-2,3))*(crit?2:1)));
  if(crit){ combatLog(`💥 KRITISCH! ${dmg} Schaden!`); SFX.crit(); }
  else    { combatLog(`⚔ Du schlägst für ${dmg} Schaden!`); SFX.hit(); }
  e.hp-=dmg;
  const ec=document.getElementById('enemy-canvas');
  floatDmg(ec,(crit?'💥':'')+dmg,crit?'#ffd700':'#e05252');
  shake(ec); flashHit(ec);
  updateCombatUI(); updateHUD();
  if(e.hp<=0){setTimeout(combatWin,700);return;}
  setTimeout(enemyTurn,800);
}

function useSkill(skillId) {
  if(!G.combat||!G.combat.playerTurn) return;
  const skill=SKILLS.find(s=>s.id===skillId); if(!skill) return;
  const p=G.p; const e=G.combat; const s=stats();
  if(p.mp<skill.mp){combatLog('❌ Kein MP!');return;}
  setCombatBtns(false); hideSkillPicker(); e.playerTurn=false; p.mp-=skill.mp;
  const stunned=processStatuses('player');
  updateCombatUI(); updateHUD();
  if(p.hp<=0){setTimeout(()=>{p.hp=0;defeatPlayer();},400);return;}
  if(e.hp<=0){setTimeout(combatWin,400);return;}
  if(stunned){combatLog('💫 Betäubt!'); p.mp+=skill.mp; setTimeout(enemyTurn,700);return;}

  if(skill.healAmt){
    const healed=Math.min(s.maxHp-p.hp,skill.healAmt);
    p.hp=Math.min(s.maxHp,p.hp+skill.healAmt);
    combatLog(`💚 Heilung! +${healed} HP`);
    SFX.heal();
    floatDmg(document.getElementById('player-combat-canvas'),'+'+healed,'#52c07a');
    updateHUD(); e.playerTurn=true; setCombatBtns(true); updateCombatUI(); return;
  }
  const crit=Math.random()<0.15;
  const dmg=Math.max(1,Math.floor(s.atk*skill.dmgMult-e.def+rand(-1,2))*(crit?2:1));
  combatLog(`${skill.icon} ${skill.name}! ${dmg}${crit?' KRIT!':''}`);
  if(crit) SFX.crit(); else SFX.hit();
  e.hp-=dmg;
  const ec2=document.getElementById('enemy-canvas');
  floatDmg(ec2,skill.icon+dmg,'#e8c96b');
  shake(ec2); flashHit(ec2);
  if(skill.burn)  applyStatus('enemy','burn',2,8);
  if(skill.drain){ const d=Math.floor(dmg*0.4); p.hp=Math.min(s.maxHp,p.hp+d); combatLog(`🩸 +${d} HP`); floatDmg(document.getElementById('player-combat-canvas'),'+'+d,'#cc44aa'); }
  updateCombatUI(); updateHUD();
  if(e.hp<=0){setTimeout(combatWin,700);return;}
  setTimeout(enemyTurn,800);
}

function useItemInCombat(idx) {
  if(!G.combat||!G.combat.playerTurn) return;
  const slot=G.p.inv[idx]; if(!slot) return;
  const item=ITEMS[slot.id]; if(!item||item.slot) return;
  const p=G.p; const s=stats();
  if(item.hp){p.hp=Math.min(s.maxHp,p.hp+(item.hp||0)); floatDmg(document.getElementById('player-combat-canvas'),'+'+item.hp+'HP','#52c07a');}
  if(item.mp) p.mp=Math.min(s.maxMp,p.mp+(item.mp||0));
  slot.qty=(slot.qty||1)-1; if(slot.qty<=0) p.inv.splice(idx,1);
  combatLog(`🧪 ${item.name} benutzt!`); hideCombatItems(); setCombatBtns(false);
  G.combat.playerTurn=false; updateHUD(); setTimeout(enemyTurn,800);
}

// ── SKILL PICKER ─────────────────────────────────────────────
function toggleSkillPicker(){const p=document.getElementById('skill-picker');if(p.classList.contains('open'))hideSkillPicker();else{hideCombatItems();showSkillPicker();}}
function showSkillPicker(){
  const picker=document.getElementById('skill-picker'); const av=unlockedSkills(); picker.innerHTML='';
  av.forEach(skill=>{
    const has=G.p.mp>=skill.mp; const btn=document.createElement('button');
    btn.className='skill-btn'+(has?'':' no-mp');
    btn.innerHTML=`<span>${skill.icon} ${skill.name}</span><span class="skill-unlock">${skill.mp}MP · ${skill.desc}</span>`;
    if(has) btn.onclick=()=>useSkill(skill.id); picker.appendChild(btn);
  });
  if(!av.length) picker.innerHTML='<div style="font-size:7px;color:var(--dim);padding:8px;text-align:center">Noch keine Skills.</div>';
  picker.classList.add('open'); document.getElementById('btn-skills').textContent='✨ Skills ▼';
}
function hideSkillPicker(){document.getElementById('skill-picker').classList.remove('open');const b=document.getElementById('btn-skills');if(b)b.textContent='✨ Skills';}

// ── COMBAT ITEM PICKER ───────────────────────────────────────
function toggleCombatItems(){const p=document.getElementById('combat-item-picker');if(p.classList.contains('open'))hideCombatItems();else{hideSkillPicker();showCombatItems();}}
function showCombatItems(){
  const picker=document.getElementById('combat-item-picker'); picker.innerHTML='';
  const cons=G.p.inv.filter(s=>ITEMS[s.id]&&!ITEMS[s.id].slot);
  if(!cons.length){picker.innerHTML='<div style="font-size:7px;color:var(--dim);padding:8px;text-align:center">Keine Tränke.</div>';}
  else{ G.p.inv.forEach((slot,idx)=>{const item=ITEMS[slot.id];if(!item||item.slot)return;const btn=document.createElement('button');btn.className='skill-btn';btn.innerHTML=`<span>${item.icon} ${item.name}${slot.qty>1?` x${slot.qty}`:''}</span><span class="skill-unlock">${item.hp?'+'+item.hp+'HP':''} ${item.mp?'+'+item.mp+'MP':''}</span>`;btn.onclick=()=>useItemInCombat(idx);picker.appendChild(btn);}); }
  picker.classList.add('open'); document.getElementById('btn-items').textContent='🎒 Items ▼';
}
function hideCombatItems(){document.getElementById('combat-item-picker').classList.remove('open');const b=document.getElementById('btn-items');if(b)b.textContent='🎒 Items';}

function enemyTurn() {
  if(!G.combat) return;
  const p=G.p; const e=G.combat; const s=stats();
  const stunned=processStatuses('enemy'); updateCombatUI();
  if(e.hp<=0){setTimeout(combatWin,400);return;}
  if(!stunned){
    const crit=Math.random()<0.10;
    const dmg=Math.max(1,Math.floor((e.atk-s.def+rand(-2,2))*(crit?1.8:1)));
    p.hp-=dmg; combatLog(`💢 ${e.name}: ${dmg}${crit?' Krit!':''}`);
    SFX.dmgTake();
    const pc=document.getElementById('player-combat-canvas');
    floatDmg(pc,'-'+dmg,'#e05252');
    shake(pc); flashHit(pc);
    if(e.statusDef&&Math.random()<e.statusDef.chance) applyStatus('player',e.statusDef.type,e.statusDef.turns,e.statusDef.value);
  }
  updateCombatUI(); updateHUD();
  if(p.hp<=0){p.hp=0;defeatPlayer();return;}
  e.playerTurn=true; setCombatBtns(true);
}

function defeatPlayer(){
  combatLog('💀 Du wurdest besiegt...'); setCombatBtns(false);
  setTimeout(()=>{
    const p=G.p; const lost=Math.floor(p.gold*0.1);
    p.gold=Math.max(0,p.gold-lost); p.hp=Math.max(1,Math.floor(stats().maxHp*0.3));
    endCombat(); addLog(`💀 Respawn. Verloren: ${lost} Gold.`);
  },1400);
}

function combatWin() {
  const p=G.p; const e=G.combat;
  const g=rand(e.gold[0],e.gold[1]); earnGold(g); p.kills++;
  combatLog(`🎉 Sieg! +${e.xp} XP  +${g} Gold`);
  tickQuestKill(e.id); tickDailyKill(e.id);
  for(const drop of e.drops){ if(Math.random()<drop.p){ addInv(drop.id); const it=ITEMS[drop.id]; combatLog(`📦 ${it.rarity==='legendary'?'🌟':it.rarity==='epic'?'💜':''} ${it.name}!`); } }
  const xp=e.xp; const isKing=e.isKing;
  setTimeout(()=>{ endCombat(); gainXP(xp); addLog(`✅ ${e.name} besiegt!`); if(isKing) showVictory(); },1100);
}

function endCombat() {
  G.combat=null; hideSkillPicker(); hideCombatItems();
  showScreen('explore',document.querySelector('.nav-btn')); refresh();
}

function updateCombatUI() {
  const e=G.combat; const p=G.p; const s=stats(); if(!e) return;
  document.getElementById('enemy-name-lbl').textContent =e.name;
  document.getElementById('enemy-hp-text').textContent  =`${Math.max(0,e.hp)}/${e.maxHp}`;
  document.getElementById('enemy-hp-bar').style.width   =pct(Math.max(0,e.hp),e.maxHp);
  document.getElementById('pcombat-hp-text').textContent=`${Math.max(0,p.hp)}/${s.maxHp}`;
  document.getElementById('pcombat-hp-bar').style.width =pct(Math.max(0,p.hp),s.maxHp);
  renderStatusRow('enemy-status',e.enemyStatus);
  renderStatusRow('player-status',e.playerStatus);
}

function setCombatBtns(on){document.querySelectorAll('.cbtn').forEach(b=>b.disabled=!on);}

// ── VICTORY + PRESTIGE ───────────────────────────────────────
function showVictory() {
  G.kingDefeated = true;
  SFX.victory();
  const p = G.p;
  const wrap = document.createElement('div');
  wrap.id = 'overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.92);z-index:100';
  wrap.innerHTML=`
    <div id="overlay-box" style="min-width:280px;max-width:90vw;text-align:center">
      🏆 VICTORY! 🏆<br><br>
      <span style="font-size:7px;color:var(--dim)">Du hast den Shadow King besiegt!<br><br>
      Level: ${p.level} &nbsp;|&nbsp; Kills: ${p.kills}<br>
      Steps: ${G.steps} &nbsp;|&nbsp; Gold: ${p.gold}<br>
      ${p.prestige>0?`Prestige: ⭐`.repeat(p.prestige)+'<br>':''}
      </span><br>
      <button onclick="doPrestige()" style="display:block;width:100%;background:#2a1a00;color:var(--accent);border:2px solid var(--accent);border-bottom:3px solid #a08830;padding:10px;font-family:'Press Start 2P',monospace;font-size:8px;cursor:pointer;margin-bottom:8px">⭐ PRESTIGE — Neustart mit Bonus</button>
      <button onclick="document.getElementById('overlay').remove()" style="display:block;width:100%;background:var(--panel);color:var(--dim);border:2px solid var(--border);padding:10px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer">▶ Weiterspielen</button>
    </div>`;
  document.body.appendChild(wrap);
}

function doPrestige() {
  document.getElementById('overlay')?.remove();
  const p = G.p;
  p.prestige = (p.prestige||0) + 1;
  const bonusAtk = p.prestige * 5;
  const bonusDef = p.prestige * 3;
  const keptGold = Math.floor(p.gold * 0.3);
  // keep one equipped item
  const keptItem = Object.values(p.eq).find(v=>v);
  p.level=1; p.xp=0; p.xpNext=100;
  p.baseAtk=8+bonusAtk; p.baseDef=3+bonusDef;
  p.maxHp=100; p.maxMp=30; p.hp=100; p.mp=30;
  p.gold=keptGold; p.kills=0; p.statPoints=0;
  p.eq={weapon:null,armor:null,acc:null}; p.inv=[];
  if(keptItem){ addInv(Object.keys(ITEMS).find(k=>ITEMS[k].name===keptItem.name)||'potion', true); }
  addInv('potion', true);
  G.steps=0; G.quests=[]; G.kingDefeated=false;
  generateQuests(); updateArea(); refresh();
  document.getElementById('step-val').textContent=0;
  addLog(`⭐ Prestige ${p.prestige}! +${bonusAtk} ATK +${bonusDef} DEF Bonus. Abenteuer beginnt neu!`);
  showOverlay(`⭐ PRESTIGE ${p.prestige}\n+${bonusAtk} ATK\n+${bonusDef} DEF\nBasisbonus permanent!`);
  save();
}

// ── FLOATING DAMAGE NUMBERS ──────────────────────────────────
function floatDmg(el,text,color='#e05252'){
  const rect=el.getBoundingClientRect();
  const d=document.createElement('div'); d.className='dmg-num'; d.textContent=text;
  d.style.cssText=`left:${Math.round(rect.left+rect.width/2-20)}px;top:${Math.round(rect.top+4)}px;color:${color}`;
  document.body.appendChild(d); setTimeout(()=>d.remove(),950);
}

// ── INVENTORY ────────────────────────────────────────────────
function addInv(id, silent=false){
  const item=ITEMS[id]; if(!item) return;
  if(!item.slot){ const ex=G.p.inv.find(i=>i.id===id); if(ex) ex.qty=(ex.qty||1)+1; else G.p.inv.push({id,qty:1}); }
  else G.p.inv.push({id,equipped:false});
  if(!silent) SFX.itemGet();
}

function useItem(idx){
  const p=G.p; const slot=p.inv[idx]; if(!slot) return; const item=ITEMS[slot.id]; if(!item) return;
  if(!item.slot){
    const s=stats();
    if(item.hp) p.hp=Math.min(s.maxHp,p.hp+(item.hp||0));
    if(item.mp) p.mp=Math.min(s.maxMp,p.mp+(item.mp||0));
    slot.qty=(slot.qty||1)-1; if(slot.qty<=0) p.inv.splice(idx,1); addLog(`🧪 ${item.name} benutzt!`);
  } else {
    const es=item.slot;
    if(slot.equipped){slot.equipped=false;p.eq[es]=null;}
    else{const prev=p.inv.find(i=>i.id===p.eq[es]?.id&&i.equipped);if(prev)prev.equipped=false;slot.equipped=true;p.eq[es]=item;}
  }
  refresh();
}

function sellItem(idx){
  const p=G.p; const slot=p.inv[idx]; if(!slot||slot.equipped) return;
  const item=ITEMS[slot.id]; if(!item) return;
  const price=Math.floor(item.value*0.5);
  if(slot.qty>1) slot.qty--; else p.inv.splice(idx,1);
  earnGold(price); addLog(`💱 ${item.name} für ${price} Gold verkauft.`); refresh();
}

function updateInvScreen(){
  document.getElementById('inv-gold-lbl').textContent=`🪙 ${G.p.gold}`;
  const grid=document.getElementById('inv-grid'); grid.innerHTML='';
  G.p.inv.forEach((slot,idx)=>{
    const item=ITEMS[slot.id]; if(!item) return;
    const div=document.createElement('div');
    div.className=`inv-item${slot.equipped?' equipped':''} ${item.rarity||''}`;
    div.innerHTML=`${item.icon}<small>${item.name.slice(0,10)}</small>${slot.qty>1?`<small>x${slot.qty}</small>`:''}`;
    div.onclick=()=>useItem(idx);
    let t;
    div.addEventListener('touchstart',()=>{t=setTimeout(()=>sellItem(idx),600);},{passive:true});
    div.addEventListener('touchend',()=>clearTimeout(t),{passive:true});
    div.addEventListener('touchmove',()=>clearTimeout(t),{passive:true});
    grid.appendChild(div);
  });
}

// ── SHOP ─────────────────────────────────────────────────────
function shopTab(mode,btn){
  G.shopMode=mode; document.querySelectorAll('.stab').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  document.getElementById('shop-buy-list').style.display =mode==='buy' ?'flex':'none';
  document.getElementById('shop-sell-list').style.display=mode==='sell'?'flex':'none';
  if(mode==='sell') renderShopSell();
}

function buyItem(id){
  const item=ITEMS[id]; if(!item) return;
  const price=Math.ceil(item.value*1.5);
  if(G.p.gold<price){showOverlay('❌ Kein Gold!');return;}
  G.p.gold-=price; addInv(id); addLog(`🛒 ${item.name} gekauft!`); refresh(); updateShopScreen();
}

function renderShopSell(){
  const list=document.getElementById('shop-sell-list'); list.innerHTML='';
  if(!G.p.inv.length){list.innerHTML='<div style="font-size:7px;color:var(--dim);padding:12px">Inventar leer.</div>';return;}
  G.p.inv.forEach((slot,idx)=>{
    const item=ITEMS[slot.id]; if(!item) return; const price=Math.floor(item.value*0.5);
    const row=document.createElement('div'); row.className='shop-row';
    row.innerHTML=`<div class="shop-icon">${item.icon}</div><div class="shop-info"><div class="shop-name">${item.name}${slot.qty>1?` x${slot.qty}`:''}</div><div class="shop-stat">${slot.equipped?'[equipped]':''}</div></div><div class="shop-price">${price}🪙</div><button class="shop-btn" ${slot.equipped?'disabled':''} onclick="sellItem(${idx});updateShopScreen()">Sell</button>`;
    list.appendChild(row);
  });
}

function updateShopScreen(){
  document.getElementById('shop-gold-val').textContent=G.p.gold;
  const buy=document.getElementById('shop-buy-list'); buy.innerHTML='';
  Object.entries(ITEMS).filter(([,it])=>it.buyable).forEach(([id,item])=>{
    const price=Math.ceil(item.value*1.5);
    const parts=[];
    if(item.atk)   parts.push(`ATK+${item.atk}`);
    if(item.def)   parts.push(`DEF+${item.def}`);
    if(item.maxHp) parts.push(`HP+${item.maxHp}`);
    if(item.maxMp) parts.push(`MP+${item.maxMp}`);
    if(item.hp)    parts.push(`Heilt ${item.hp}`);
    if(item.mp)    parts.push(`+${item.mp}MP`);
    const row=document.createElement('div'); row.className='shop-row';
    row.innerHTML=`<div class="shop-icon">${item.icon}</div><div class="shop-info"><div class="shop-name">${item.name}</div><div class="shop-stat">${parts.join('  ')}</div></div><div class="shop-price">${price}🪙</div><button class="shop-btn" ${G.p.gold<price?'disabled':''} onclick="buyItem('${id}')">Buy</button>`;
    buy.appendChild(row);
  });
  if(G.shopMode==='sell') renderShopSell();
}

// ── QUESTS ───────────────────────────────────────────────────
function generateQuests(){
  while(G.quests.length<3){
    const used=new Set(G.quests.map(q=>q.label));
    const av=QUEST_POOL.filter(q=>!used.has(q.label)); if(!av.length) break;
    const t=av[Math.floor(Math.random()*av.length)]; G.quests.push({...t,progress:0});
  }
}

function tickQuestKill(id){
  let ch=false;
  G.quests.forEach(q=>{ if(q.type==='kill'&&(q.target===id||q.target==='any')&&q.progress<q.qty){q.progress++;ch=true;if(q.progress>=q.qty)addLog(`📜 Quest: ${q.label}!`);} });
  if(ch) updateQuestScreen();
}
function tickQuestStep(){
  let ch=false;
  G.quests.forEach(q=>{ if(q.type==='step'&&q.progress<q.qty){q.progress++;ch=true;if(q.progress>=q.qty)addLog(`📜 Quest: ${q.label}!`);} });
  if(ch) updateQuestScreen();
}
function tickQuestGold(g){
  let ch=false;
  G.quests.forEach(q=>{ if(q.type==='gold'&&q.progress<q.qty){q.progress=Math.min(q.qty,q.progress+g);ch=true;if(q.progress>=q.qty)addLog(`📜 Quest: ${q.label}!`);} });
  if(ch) updateQuestScreen();
}

function claimQuest(idx){
  const q=G.quests[idx]; if(!q||q.progress<q.qty) return;
  G.p.gold+=q.goldR; if(q.itemR) addInv(q.itemR);
  const xp=q.xpR; G.quests.splice(idx,1); generateQuests();
  showOverlay(`📜 Quest!\n+${xp} XP\n+${q.goldR} Gold${q.itemR?'\n+'+ITEMS[q.itemR]?.name:''}`);
  gainXP(xp); updateQuestScreen(); refresh();
}

function updateQuestScreen(){
  const list=document.getElementById('quest-list'); if(!list) return;
  list.innerHTML='';
  G.quests.forEach((q,idx)=>{
    const done=q.progress>=q.qty;
    const card=document.createElement('div'); card.className='quest-card'+(done?' done':'');
    const rew=[`+${q.xpR} XP`,`+${q.goldR}🪙`]; if(q.itemR) rew.push(ITEMS[q.itemR]?.icon||'');
    card.innerHTML=`<div class="quest-title">${q.label}</div><div class="quest-prog-wrap"><div class="quest-prog${done?' done':''}" style="width:${pct(q.progress,q.qty)}"></div></div><div class="quest-info"><span>${q.progress}/${q.qty}</span><span class="quest-reward">${rew.join('  ')}</span></div>${done?`<button class="quest-claim" onclick="claimQuest(${idx})">✅ CLAIM</button>`:''}`;
    list.appendChild(card);
  });
  updateDailyQuestScreen();
}

// ── DAILY QUESTS ─────────────────────────────────────────────
function todayStr(){ return new Date().toISOString().slice(0,10); }

function loadDailyQuests(){
  try{
    const raw=localStorage.getItem('pq_daily'); if(!raw) return false;
    const d=JSON.parse(raw); if(d.date!==todayStr()) return false;
    G.daily=d; return true;
  }catch(_){return false;}
}

function saveDailyQuests(){ try{localStorage.setItem('pq_daily',JSON.stringify(G.daily));}catch(_){} }

function generateDailyQuests(){
  const pool=[...DAILY_POOL]; const picked=[];
  while(picked.length<3&&pool.length>0){
    const i=Math.floor(Math.random()*pool.length); picked.push({...pool[i],progress:0}); pool.splice(i,1);
  }
  G.daily={ date:todayStr(), quests:picked, bonusClaimed:false };
  saveDailyQuests();
}

function tickDailyKill(id){
  if(!G.daily) return; let ch=false;
  G.daily.quests.forEach(q=>{ if(q.type==='kill'&&(q.target===id||q.target==='any')&&q.progress<q.qty){q.progress++;ch=true;if(q.progress>=q.qty)addLog(`⭐ Tagesquest: ${q.label}!`);} });
  if(ch){saveDailyQuests();updateDailyQuestScreen();}
}
function tickDailyStep(){
  if(!G.daily) return; let ch=false;
  G.daily.quests.forEach(q=>{ if(q.type==='step'&&q.progress<q.qty){q.progress++;ch=true;if(q.progress>=q.qty)addLog(`⭐ Tagesquest: ${q.label}!`);} });
  if(ch){saveDailyQuests();updateDailyQuestScreen();}
}
function tickDailyGold(g){
  if(!G.daily) return; let ch=false;
  G.daily.quests.forEach(q=>{ if(q.type==='gold'&&q.progress<q.qty){q.progress=Math.min(q.qty,q.progress+g);ch=true;if(q.progress>=q.qty)addLog(`⭐ Tagesquest: ${q.label}!`);} });
  if(ch){saveDailyQuests();updateDailyQuestScreen();}
}

function claimDailyBonus(){
  if(!G.daily||G.daily.bonusClaimed) return;
  if(!G.daily.quests.every(q=>q.progress>=q.qty)) return;
  G.daily.bonusClaimed=true;
  const bonusXP=300*G.p.level; const bonusGold=100*G.p.level;
  gainXP(bonusXP); earnGold(bonusGold); addInv('elixir'); addInv('elixir');
  showOverlay(`⭐ TAGESBONUS!\n+${bonusXP} XP\n+${bonusGold} Gold\n+2 Elixiere`);
  saveDailyQuests(); updateDailyQuestScreen(); refresh();
}

function updateDailyQuestScreen(){
  const list=document.getElementById('daily-quest-list'); if(!list) return;
  list.innerHTML='';
  if(!G.daily){list.innerHTML='<div style="font-size:7px;color:var(--dim);padding:8px">Lade Tagesquests...</div>';return;}
  G.daily.quests.forEach((q,idx)=>{
    const done=q.progress>=q.qty;
    const card=document.createElement('div'); card.className='quest-card'+(done?' done':'');
    card.style.borderLeftColor='var(--accent)'; card.style.borderLeftWidth='3px';
    const rew=[`+${q.xpR} XP`,`+${q.goldR>0?q.goldR+'🪙':''}`]; if(q.itemR) rew.push(ITEMS[q.itemR]?.icon||'');
    card.innerHTML=`<div class="quest-title">⭐ ${q.label}</div><div class="quest-prog-wrap"><div class="quest-prog${done?' done':''}" style="width:${pct(q.progress,q.qty)}"></div></div><div class="quest-info"><span>${q.progress}/${q.qty}</span><span class="quest-reward">${rew.join('  ')}</span></div>`;
    list.appendChild(card);
  });
  const allDone=G.daily.quests.every(q=>q.progress>=q.qty);
  const bonusBtn=document.getElementById('daily-bonus-btn');
  if(bonusBtn) bonusBtn.style.display=(allDone&&!G.daily.bonusClaimed)?'block':'none';
}

function updateDailyTimer(){
  const el=document.getElementById('daily-timer'); if(!el) return;
  const now=new Date(); const midnight=new Date(now); midnight.setHours(24,0,0,0);
  const diff=midnight-now;
  const h=Math.floor(diff/3600000); const m=Math.floor((diff%3600000)/60000); const s=Math.floor((diff%60000)/1000);
  el.textContent=`Reset: ${h}h ${m}m ${s}s`;
  // Check if day rolled over
  if(G.daily&&G.daily.date!==todayStr()){generateDailyQuests();updateQuestScreen();}
}
setInterval(updateDailyTimer,1000);

// ── HUD + CHAR ───────────────────────────────────────────────
function updateHUD(){
  const p=G.p; const s=stats();
  document.getElementById('hud-level').textContent=`LV ${p.level}`;
  document.getElementById('hp-text').textContent=`${Math.max(0,p.hp)}`;
  document.getElementById('mp-text').textContent=`${p.mp}`;
  document.getElementById('hp-bar').style.width=pct(Math.max(0,p.hp),s.maxHp);
  document.getElementById('mp-bar').style.width=pct(p.mp,s.maxMp);
  document.getElementById('xp-bar').style.width=pct(p.xp,p.xpNext);
  document.getElementById('gold-val').textContent=p.gold;
}

function updateCharScreen(){
  const p=G.p; const s=stats();
  document.getElementById('s-level').textContent=p.level+(p.prestige>0?' '+'⭐'.repeat(p.prestige):'');
  document.getElementById('s-xp').textContent=`${p.xp} / ${p.xpNext}`;
  document.getElementById('s-hp').textContent=`${Math.max(0,p.hp)} / ${s.maxHp}`;
  document.getElementById('s-mp').textContent=`${p.mp} / ${s.maxMp}`;
  document.getElementById('s-maxhp').textContent=s.maxHp;
  document.getElementById('s-maxmp').textContent=s.maxMp;
  document.getElementById('s-atk').textContent=s.atk;
  document.getElementById('s-def').textContent=s.def;
  document.getElementById('s-kills').textContent=p.kills;
  const hasPts=p.statPoints>0;
  document.getElementById('stat-points-banner').style.display=hasPts?'block':'none';
  document.getElementById('sp-count').textContent=p.statPoints;
  document.querySelectorAll('.salloc').forEach(b=>b.disabled=!hasPts);
  const icons={weapon:'🗡',armor:'🛡',acc:'💍'};
  for(const sl of ['weapon','armor','acc']){const eq=p.eq[sl];document.getElementById(`eq-${sl}`).innerHTML=`${icons[sl]} <span>${eq?eq.name:'Empty'}</span>`;}
  updateInvScreen();
}

function refresh(){
  updateHUD(); updateCharScreen(); updateQuestScreen();
  if(G.combat) updateCombatUI();
}

// ── LOG ──────────────────────────────────────────────────────
function addLog(msg){ const log=document.getElementById('log'); const d=document.createElement('div'); d.textContent=msg; log.insertBefore(d,log.firstChild); if(log.children.length>25) log.removeChild(log.lastChild); }
function combatLog(msg){ const log=document.getElementById('combat-log'); const d=document.createElement('div'); d.textContent=msg; log.insertBefore(d,log.firstChild); if(log.children.length>14) log.removeChild(log.lastChild); }

// ── SCREEN NAV ───────────────────────────────────────────────
function showScreen(name,btn){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(`screen-${name}`).classList.add('active');
  if(btn){btn.classList.add('active');}
  else{const order=['explore','quests','char','shop'];const nb=document.querySelectorAll('.nav-btn');const i=order.indexOf(name);if(i>=0&&nb[i])nb[i].classList.add('active');}
  if(name==='char')   {updateCharScreen();drawSprite(document.getElementById('char-canvas'),'player');}
  if(name==='explore'){drawSprite(document.getElementById('player-canvas'),'player');drawBackground(G.area.id);}
  if(name==='quests') updateQuestScreen();
  if(name==='shop')   updateShopScreen();
}

// ── OVERLAY ──────────────────────────────────────────────────
function showOverlay(msg){
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.innerHTML=`<div id="overlay-box">${msg.replace(/\n/g,'<br>')}</div>`;
  wrap.onclick=()=>wrap.remove(); document.body.appendChild(wrap);
  setTimeout(()=>wrap.remove(),2800);
}

// ── NAME PROMPT ──────────────────────────────────────────────
function promptName(onDone){
  const wrap=document.createElement('div'); wrap.id='name-overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.85);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:260px;max-width:88vw">⚔ PIXEL QUEST RPG<br><br><span style="font-size:7px;color:var(--dim)">Dein Heldenname:</span><br><input id="name-inp" type="text" maxlength="10" value="Hero" autocomplete="off"><button id="name-start-btn" onclick="confirmName()">▶ START</button></div>`;
  document.body.appendChild(wrap);
  document.getElementById('name-inp').focus(); document.getElementById('name-inp').select();
  document.getElementById('name-inp').addEventListener('keydown',e=>{if(e.key==='Enter')confirmName();});
  window._onNameDone=onDone;
}

function confirmName(){
  const inp=document.getElementById('name-inp');
  G.p.name=(inp?.value.trim()||'Hero').slice(0,10)||'Hero';
  document.getElementById('name-overlay')?.remove();
  document.getElementById('pcombat-name').textContent=G.p.name;
  if(window._onNameDone) window._onNameDone();
}

// ── SAVE / LOAD ──────────────────────────────────────────────
function save(){
  try{localStorage.setItem('pq_save',JSON.stringify({p:G.p,steps:G.steps,quests:G.quests,kingDefeated:G.kingDefeated}));}catch(_){}
}

function load(){
  try{
    const raw=localStorage.getItem('pq_save'); if(!raw) return false;
    const d=JSON.parse(raw); Object.assign(G.p,d.p);
    G.steps=d.steps||0; G.quests=d.quests||[]; G.kingDefeated=d.kingDefeated||false;
    document.getElementById('step-val').textContent=G.steps; return true;
  }catch(_){return false;}
}

setInterval(save,15000);

// ── UTILS ────────────────────────────────────────────────────
function pct(v,max){return `${Math.min(100,Math.max(0,(v/max)*100))}%`;}
function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
function shake(el){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');}
function flashHit(el){el.classList.remove('hit-flash');void el.offsetWidth;el.classList.add('hit-flash');}

function toggleMute(){
  const muted = SFX.toggleMute();
  const btn = document.getElementById('mute-btn');
  if(btn) btn.textContent = muted ? '🔇' : '🔊';
}

// ── INIT ─────────────────────────────────────────────────────
function init(){
  const hasSave=load();
  if(!loadDailyQuests()) generateDailyQuests();
  generateQuests(); updateArea(); refresh();
  drawSprite(document.getElementById('player-canvas'),'player');
  addLog('🌟 Willkommen bei Pixel Quest RPG!');
  addLog('🗺 Drücke EXPLORE um dein Abenteuer zu beginnen.');
  if(!G.p.inv.length){addInv('potion',true);addInv('wood_sword',true);}
  if(!hasSave) promptName(()=>save());
  updateDailyTimer();
}

init();
