function drawSprite(canvas, key, scale=4, paletteOverride=null) {
  const s = SPRITES[key];
  if (!s) return;
  const palette = paletteOverride || s.p;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#000';
  s.d.forEach((row,r) => row.forEach((v,c) => {
    if (v === '.') return;
    ctx.fillRect(c*scale-1, r*scale-1, scale+2, scale+2);
  }));
  s.d.forEach((row,r) => row.forEach((v,c) => {
    if (v === '.') return;
    ctx.fillStyle = palette[v] || s.p[v];
    ctx.fillRect(c*scale, r*scale, scale, scale);
  }));
}

function drawPlayer(canvas) {
  const p = G.p;
  const prestige = p.prestige||0;
  let palette = prestige>=3 ? PRESTIGE_PALETTES[3] : prestige>=2 ? PRESTIGE_PALETTES[2] : prestige>=1 ? PRESTIGE_PALETTES[1] : null;
  // pick sprite key based on class
  const classSprite = {warrior:'warrior', mage:'mage', ranger:'ranger', rogue:'rogue', berserker:'warrior', paladin:'warrior', archmage:'mage', druid:'mage', assassin:'rogue', hunter:'ranger'}[p.class] || 'warrior';
  const spriteKey = (SPRITES[classSprite] ? classSprite : 'player');
  // hero palette override (only if no prestige palette)
  if (!palette && G.heroSprite && G.heroSprite !== 'warrior') {
    const hp = HERO_PALETTES.find(h=>h.id===G.heroSprite);
    if (hp && hp.p) palette = hp.p;
  }
  drawSprite(canvas, spriteKey, 4, palette);
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
function drawBackground(areaId, targetCanvas) {
  const canvas = targetCanvas || document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
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
  } else if (areaId === 'volcanic') {
    r('#1a0800',0,0,W,H);
    // lava glow sky
    ctx.globalAlpha=0.3; r('#ff4400',0,H*0.5,W,H*0.5); ctx.globalAlpha=1;
    // smoke clouds
    ctx.globalAlpha=0.18; r('#442200',20,8,60,18); r('#551100',100,4,80,22); r('#442200',190,10,50,16); ctx.globalAlpha=1;
    // rocky silhouettes
    r('#0d0400',0,H*0.55,W,H*0.45);
    for(let x=0;x<W;x+=20){ const h=12+(x*7)%20; r('#1a0800',x,H*0.55-h,20,h+2); }
    // lava pools
    r('#cc3300',0,H*0.78,W,4); r('#ff5500',8,H*0.78,W-16,2);
    for(let x=10;x<W-10;x+=30){ r('#ff6600',x,H*0.82,20,4); r('#ff4400',x+2,H*0.82,16,2); }
    // volcano peak
    r('#0d0400',80,0,80,H*0.6); r('#1a0800',90,0,60,H*0.55);
    ctx.globalAlpha=0.7; r('#ff3300',108,H*0.05,24,H*0.18); r('#ff6600',114,H*0.08,12,H*0.12); ctx.globalAlpha=1;
    // embers
    ctx.fillStyle='#ff6600';
    [[30,45],[70,30],[120,52],[160,38],[200,25],[220,50]].forEach(([x,y])=>ctx.fillRect(x,y,2,2));
    ctx.fillStyle='#ffaa00';
    [[45,35],[90,20],[140,44],[180,30]].forEach(([x,y])=>ctx.fillRect(x,y,1,1));
  } else if (areaId === 'void') {
    r('#000008',0,0,W,H);
    // void rifts
    ctx.globalAlpha=0.25; r('#4400aa',60,0,20,H); r('#220066',150,0,16,H); ctx.globalAlpha=1;
    // purple energy wisps
    [[20,18,'#6600cc'],[80,35,'#8800ff'],[130,12,'#4400aa'],[170,40,'#9900ff'],[210,22,'#6600cc']].forEach(([x,y,c])=>{
      ctx.globalAlpha=0.5; r(c,x,y,8,8); ctx.globalAlpha=0.2; r(c,x-4,y-4,16,16); ctx.globalAlpha=1;
    });
    // dark ground
    r('#050012',0,H*0.7,W,H*0.3);
    // floating void rocks
    [[10,H*0.5,30,12],[60,H*0.42,24,10],[130,H*0.52,28,10],[190,H*0.45,22,8]].forEach(([x,y,w,h])=>{
      r('#110033',x,y,w,h); r('#220055',x+2,y-2,w-4,4);
    });
    // void stars (white dots)
    ctx.fillStyle='#8866ff';
    [[5,5],[15,20],[35,8],[55,25],[95,10],[115,30],[145,6],[165,22],[185,14],[205,28],[225,5]].forEach(([x,y])=>ctx.fillRect(x,y,2,2));
    ctx.fillStyle='#ffffff';
    [[25,15],[75,28],[155,18],[195,8]].forEach(([x,y])=>ctx.fillRect(x,y,1,1));
  } else if (areaId === 'underwater') {
    r('#001833',0,0,W,H); r('#002255',0,H*0.65,W,H*0.35);
    ctx.globalAlpha=0.3; r('#0044aa',0,0,W,H*0.5); ctx.globalAlpha=1;
    [[20,70,'#3399ff'],[50,60,'#2288ee'],[90,75,'#44aaff'],[130,62,'#3399ff'],[170,72,'#2288ee'],[210,65,'#44aaff']].forEach(([x,y,c])=>{
      ctx.globalAlpha=0.6; r(c,x,y,4,4); ctx.globalAlpha=0.2; r(c,x-2,y-2,8,8); ctx.globalAlpha=1;
    });
    r('#ff4488',10,H*0.65,5,H*0.35); r('#ff8800',40,H*0.7,4,H*0.3);
    r('#ff4488',80,H*0.62,6,H*0.38); r('#00cc88',110,H*0.68,3,H*0.32);
    r('#ff4488',160,H*0.65,5,H*0.35); r('#ff8800',200,H*0.72,4,H*0.28);
    ctx.fillStyle='#aaeeff';
    [[30,H*0.4],[70,H*0.3],[120,H*0.45],[180,H*0.35],[220,H*0.4]].forEach(([x,y])=>{
      ctx.globalAlpha=0.4; ctx.fillRect(x,y,2,Math.abs(H*0.65-y)); ctx.globalAlpha=1;
    });
    r('#001122',0,H*0.82,W,H*0.18);
  } else if (areaId === 'sky') {
    r('#87ceeb',0,0,W,H);
    ctx.globalAlpha=0.9; r('#ffffff',5,12,50,14); r('#ffffff',0,12,55,12); ctx.globalAlpha=1;
    r('#ffffff',5,12,55,14); r('#ffffff',0,10,60,10);
    r('#ffffff',4,14,54,14); r('#ffffff',140,20,45,12); r('#ffffff',138,24,50,10);
    r('#aaaacc',75,H*0.35,90,H*0.65); r('#8888aa',70,H*0.3,15,H*0.1); r('#8888aa',155,H*0.3,15,H*0.1);
    for(let x=70;x<165;x+=10) r('#ccccdd',x,H*0.28,8,6);
    r('#ccccdd',70,H*0.36,95,4);
    ctx.globalAlpha=0.5; r('#ffffff',0,0,W,H*0.15); ctx.globalAlpha=1;
    r('#99aabb',0,H*0.85,W,H*0.15);
  } else if (areaId === 'ice') {
    r('#cce8ff',0,0,W,H); r('#99ccee',0,H*0.55,W,H*0.45);
    [[18,H*0.35,4,H*0.65],[40,H*0.28,3,H*0.72],[70,H*0.38,5,H*0.62],[100,H*0.32,4,H*0.68],[140,H*0.40,3,H*0.6],[165,H*0.30,5,H*0.70],[200,H*0.36,4,H*0.64]].forEach(([x,y,w,h])=>{
      r('#aaddff',x,y,w,h); r('#cceeff',x+1,y,w-2,4);
    });
    r('#88aacc',90,H*0.25,80,H*0.75); r('#aabbdd',90,H*0.25,80,8);
    r('#99bbcc',170,H*0.3,60,H*0.7);
    r('#ffffff',88,H*0.23,84,6); r('#ffffff',168,H*0.28,64,6);
    ctx.fillStyle='#ddeeff';
    [[10,H*0.5],[30,H*0.45],[55,H*0.52],[80,H*0.47],[120,H*0.5],[145,H*0.44],[190,H*0.51],[220,H*0.47]].forEach(([x,y])=>ctx.fillRect(x,y,6,4));
    r('#ddeeff',0,H*0.82,W,H*0.18);
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

// ── HELPERS ──────────────────────────────────────────────────
function unlockedSkills() { return SKILLS.filter(s => G.p.level >= s.unlockLv && (!s.reqClass || s.reqClass === G.p.class)); }


// ── STATE ────────────────────────────────────────────────────
const G = {
  p: {
    name:'Hero', level:1, xp:0, xpNext:100,
    hp:100, maxHp:100, mp:30, maxMp:30,
    baseAtk:8, baseDef:3, gold:0, kills:0,
    totalGoldEarned:0, statPoints:0, prestige:0,
    class:null, subclass:null,
    eq:{weapon:null,armor:null,acc:null,pet:null,helm:null,gloves:null,boots:null},
    inv:[], buffs:[],
    talents:{}, talentPoints:0,
    bestiaryRewarded:{},
  },
  area: AREAS[0],
  combat: null,
  steps: 0,
  busy: false,
  quests: [],
  daily: null,
  shopMode: 'buy',
  kingDefeated: false,
  achievements: [],
  bestiary: {},
  dungeon: null,
  dungeonClears: 0,
  arena: null,
  bossRush: null,
  weather: { particles: [], tick: 0 },
  battleStats: { dmgDealt:0, dmgTaken:0, highCrit:0, won:0, fled:0, lost:0 },
  lootFilter: 'common',
  hardcore: false,
  bank: [],
  resources: { wood:0, ore:0, herbs:0 },
  companion: null,
  speedrun: { active:false, startTime:0, bestTime:null },
  storyShown: [],
  autoBattle: false,
  dayNight: 6,
  heroSprite: 'warrior',
  worldBossSteps: 0,
  guild: null,
  difficulty: 'normal',
  tutorialStep: 0,
  tutorialDone: false,
  battleHistory: [],
  dailyChallenge: null,
  storyChains: {},
  invSort: 'none',
  lang: 'en',
};

// ── NAME HELPERS ─────────────────────────────────────────────
function iname(id){const item=ITEMS[id];if(!item)return id;return(G.lang==='en'&&item.nameEn)?item.nameEn:item.name;}
function fname(id){const foe=FOES[id];if(!foe)return id;return(G.lang==='en'&&foe.nameEn)?foe.nameEn:foe.name;}

// ── STATS ────────────────────────────────────────────────────
function stats() {
  const p = G.p;
  let atk=p.baseAtk, def=p.baseDef, maxHp=p.maxHp, maxMp=p.maxMp, critBonus=0, resist=0, mpRegen=0, eqEvasion=0, eqLifesteal=0;
  const equippedIds = [];
  for (const slot of ['weapon','armor','acc','pet','helm','gloves','boots']) {
    const eq = p.eq[slot];
    if (eq) {
      atk+=eq.atk||0; def+=eq.def||0;
      maxHp+=eq.maxHp||0; maxMp+=eq.maxMp||0;
      critBonus+=eq.critBonus||0; resist+=eq.resist||0;
      mpRegen+=eq.mpRegen||0;
      eqEvasion+=eq.evasion||0; eqLifesteal+=eq.lifesteal||0;
      if (slot!=='pet') {
        const invSlot = p.inv.find(i=>i.id===eq.id&&i.equipped);
        if (invSlot) {
          const upg = invSlot._upgrade||0;
          if (slot==='weapon') atk+=upg*3; else if (slot==='armor'||slot==='helm') def+=upg*3; else { atk+=upg; def+=upg; }
          const runeId = invSlot._rune;
          if (runeId && ITEMS[runeId]) {
            const r=ITEMS[runeId];
            atk+=r.atk||0; def+=r.def||0; maxMp+=r.maxMp||0; critBonus+=r.critBonus||0;
          }
          const enchant = invSlot._enchant;
          if (enchant) {
            atk+=enchant.atk||0; def+=enchant.def||0;
            maxHp+=enchant.maxHp||0; maxMp+=enchant.maxMp||0;
          }
          if (invSlot._artLevel) { atk+=invSlot._artLevel; def+=invSlot._artLevel; }
        }
        equippedIds.push(eq.id);
      }
    }
  }
  for (const b of (p.buffs||[])) {
    if (b.type==='atk') atk+=b.val;
    if (b.type==='def') def+=b.val;
  }
  if (G.combat) { atk+=G.combat.atkBonus||0; def+=G.combat.defBonus||0; }
  if (p.class && CLASSES[p.class]) {
    const cl = CLASSES[p.class];
    atk+=cl.bonusAtk||0; def+=cl.bonusDef||0;
    maxHp+=cl.bonusHp||0; maxMp+=cl.bonusMp||0;
    critBonus+=cl.bonusCrit||0;
  }
  if (p.subclass && SUBCLASSES[p.subclass]) {
    const sc = SUBCLASSES[p.subclass];
    atk+=sc.bonusAtk||0; def+=sc.bonusDef||0;
    maxHp+=sc.bonusHp||0; maxMp+=sc.bonusMp||0;
    critBonus+=sc.bonusCrit||0;
  }
  for (const s of ITEM_SETS) {
    if (s.pieces.every(id=>equippedIds.includes(id))) {
      atk+=s.bonus.atk||0; def+=s.bonus.def||0;
    }
  }
  // Talent bonuses
  const t = p.talents||{};
  critBonus += (t.crit||0)*0.05;
  if (t.atk_pct) atk  = Math.floor(atk  * (1 + (t.atk_pct||0)*0.10));
  if (t.def_pct) def  = Math.floor(def  * (1 + (t.def_pct||0)*0.10));
  if (t.hp_pct)  maxHp= Math.floor(maxHp* (1 + (t.hp_pct ||0)*0.08));
  mpRegen += (t.mp_regen||0)*2;
  return { atk, def, maxHp, maxMp, critBonus, resist, mpRegen,
    lifesteal: (t.lifesteal||0)*0.05 + eqLifesteal,
    evasion:   (t.evasion  ||0)*0.08 + eqEvasion,
    goldFind:  (t.gold_find||0)*0.20,
    xpBoost:   (t.xp_boost ||0)*0.15,
    critDmg:   (t.crit_dmg ||0)*0.15,
  };
}
// ── LEVELING ─────────────────────────────────────────────────
function xpFor(lvl) { return Math.floor(80 * Math.pow(1.3, lvl-1)); }

function gainXP(amount) {
  const p = G.p;
  const pet = p.eq.pet;
  if (pet && pet.xpBonus) amount = Math.floor(amount * (1 + pet.xpBonus));
  const s = stats();
  if (s.xpBoost > 0) amount = Math.floor(amount * (1 + s.xpBoost));
  if (G.dayNight >= 21 || G.dayNight < 5) amount = Math.floor(amount * 1.15);
  if (G.guild && G.guild.name==='Drachentöter') amount = Math.floor(amount * 1.1);
  p.xp += amount;
  while (p.xp >= p.xpNext) {
    p.xp -= p.xpNext;
    p.level++;
    p.xpNext = xpFor(p.level);
    const lv=p.level; const tier=lv<=20?1:lv<=50?2:3;
    p.baseAtk+=[1,2,4][tier-1]; p.baseDef+=[1,2,3][tier-1]; p.maxHp+=[15,25,40][tier-1]; p.maxMp+=[5,8,12][tier-1];
    p.hp=Math.min(p.hp+10, stats().maxHp); p.mp=Math.min(p.mp+3, stats().maxMp);
    p.statPoints+=2;
    p.talentPoints = (p.talentPoints||0) + 1;
    const ns = SKILLS.find(s=>s.unlockLv===p.level);
    const extra = ns ? `\n${ns.icon} ${ns.name}\nfreigeschaltet!` : '';
    SFX.levelUp();
    showOverlay(`⭐ LEVEL UP!\nLV ${p.level}\n+2 Stat +1 Talent${extra}`);
    if(G.tutorialStep===2){G.tutorialStep=3;setTimeout(()=>showTutorialHint(2),1200);}
    updateArea();
    if (p.level===5  && !p.class)    setTimeout(showClassSelect, 800);
    if (p.level===15 && !p.subclass) setTimeout(showSubclassSelect, 800);
    checkSpeedrunComplete();
  }
  checkAchievements();
  refresh();
}

function checkAchievements() {
  ACHIEVEMENTS.forEach(a => {
    if (!G.achievements.includes(a.id) && a.check(G)) {
      G.achievements.push(a.id);
      addLog(`🏅 Achievement: ${a.icon} ${a.label}!`);
      showOverlay(`🏅 Achievement!\n${a.icon} ${a.label}\n${a.desc}`);
    }
  });
}

// ── AREA ─────────────────────────────────────────────────────
function updateArea() {
  const lvl = G.p.level;
  const prevArea = G.area?.id;
  G.area = AREAS.find(a=>lvl>=a.min&&lvl<=a.max) || AREAS[AREAS.length-1];
  document.getElementById('area-name').textContent = t('area_'+G.area.id)||G.area.name;
  document.getElementById('area-icon').textContent = G.area.icon;
  drawBackground(G.area.id);
  const bb = document.getElementById('boss-btn');
  if (bb) bb.style.display = (lvl >= 20 && !G.kingDefeated) ? 'block' : 'none';
  initWeather(G.area.id);
  if(G.area.id !== prevArea && !G.storyShown.includes(G.area.id) && AREA_STORIES[G.area.id]){
    G.storyShown.push(G.area.id);
    setTimeout(()=>showOverlay(AREA_STORIES[G.area.id]), 600);
  }
}

// ── EXPLORE ──────────────────────────────────────────────────
const EVENTS = [
  {t:'combat',    w:35},{t:'gold',    w:12},{t:'heal',    w:8},
  {t:'chest',     w:6}, {t:'shrine',  w:5}, {t:'boss',    w:3},
  {t:'merchant',  w:4}, {t:'stranger',w:3}, {t:'trap',    w:3},
  {t:'dungeon',   w:3}, {t:'arena',   w:2}, {t:'smith',   w:3},
  {t:'oracle',    w:2}, {t:'thief',   w:2}, {t:'meteor',  w:2},
  {t:'divine',    w:2}, {t:'gather',  w:5}, {t:'pvp',     w:1},
  {t:'fish',      w:4}, {t:'inn',     w:3}, {t:'nothing', w:2},
  {t:'area_boss', w:2},
];
const CHEST_LOOT = ['potion','potion','elixir','iron_sword','leather','iron_shield','health_ring','magic_ring','battle_brew','atk_rune','def_rune','crit_rune','mp_rune','chain_mail','mage_robe','runed_sword','mp_potion','bone_dagger','battle_gauntlets','storm_boots'];

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
  G.worldBossSteps = (G.worldBossSteps||0) + 1;
  if (G.worldBossSteps >= 200) { G.worldBossSteps = 0; triggerWorldBoss(); return; }
  document.getElementById('step-val').textContent = G.steps;
  if (G.steps % 5 === 0) { G.dayNight = (G.dayNight + 1) % 24; updateDayNight(); }
  tickQuestStep(); tickDailyStep();
  SFX.step();
  p.mp = Math.min(stats().maxMp, p.mp + Math.max(3, Math.floor(stats().maxMp * 0.05)));
  setBusy(true); setTimeout(()=>setBusy(false),700);

  const ev = pick(EVENTS);
  if (ev.t==='combat'||ev.t==='boss') {
    const isNight = G.dayNight >= 21 || G.dayNight < 5;
    let foePool = G.area.foes.slice();
    if (isNight) {
      const nightFoes = ['skeleton','zombie','ghost'].filter(f => !foePool.includes(f));
      foePool = [...foePool, ...nightFoes];
    }
    startCombat(foePool[Math.floor(Math.random()*foePool.length)], ev.t==='boss');
  } else if (ev.t==='gold') {
    const g=Math.floor((Math.random()*8+2)*p.level); earnGold(g); SFX.goldPickup(); addLog(`💰 Du findest ${g} Gold!`); refresh();
  } else if (ev.t==='heal') {
    const amt=Math.floor(Math.random()*15+8); p.hp=Math.min(stats().maxHp,p.hp+amt); SFX.heal(); addLog(`🌿 Ein Heilkraut! +${amt} HP`); refresh();
  } else if (ev.t==='chest') {
    const id=CHEST_LOOT[Math.floor(Math.random()*CHEST_LOOT.length)]; addInv(id);
    SFX.chest(); addLog(`📦 Schatzkiste! ${ITEMS[id].icon} ${iname(id)} ${t('log_found')}!`); refresh();
  } else if (ev.t==='shrine') {
    const opts=[
      ()=>{ p.hp=stats().maxHp; addLog('⛩️ Heilschrein! HP vollständig geheilt.'); },
      ()=>{ p.mp=stats().maxMp; addLog('⛩️ Zauberschrein! MP vollständig.'); },
      ()=>{ const x=25*p.level; gainXP(x); addLog(`⛩️ Weisheitsschrein! +${x} XP.`); },
      ()=>{ const g=10*p.level; earnGold(g); addLog(`⛩️ Glücksschrein! +${g} Gold.`); },
    ];
    opts[Math.floor(Math.random()*opts.length)](); refresh();
  } else if (ev.t==='merchant') {
    addLog(NPC_MERCHANT_LINES[Math.floor(Math.random()*NPC_MERCHANT_LINES.length)]); showMerchant();
  } else if (ev.t==='stranger') {
    const allNPC=[...NPC_STRANGER_LINES,...NPC_ELDER_LINES,...NPC_GUARD_LINES];
    addLog(allNPC[Math.floor(Math.random()*allNPC.length)]); showStranger();
  } else if (ev.t==='trap') {
    const dmg=Math.max(1,Math.floor(p.hp*0.2));
    p.hp=Math.max(1,p.hp-dmg);
    const g=Math.floor((Math.random()*15+10)*p.level);
    earnGold(g); SFX.goldPickup();
    addLog(`🪤 Falle! -${dmg} HP aber ${g} Gold gefunden!`); refresh();
  } else if (ev.t==='dungeon') {
    addLog('⛏ Ein Dungeon-Eingang! Wagst du das Gauntlet?'); startDungeon();
  } else if (ev.t==='arena') {
    addLog('🏟 Eine Arena! Kämpfe 10 Runden für Ruhm!'); startArena();
  } else if (ev.t==='smith') {
    addLog('🔨 Ein Wanderschmied! Er kann dein Equipment stärken.'); showSmith();
  } else if (ev.t==='oracle') {
    addLog('🔮 Das Orakel spricht...'); showOracle();
  } else if (ev.t==='thief') {
    const stolen=Math.floor(p.gold*0.15+5*p.level);
    p.gold=Math.max(0,p.gold-stolen);
    addLog(`🦹 Ein Dieb! ${stolen} Gold gestohlen! Er flieht!`);
    SFX.dmgTake(); refresh();
  } else if (ev.t==='meteor') {
    const dmg=Math.max(5,Math.floor(p.maxHp*0.25)); const g=Math.floor(8*p.level*Math.random()+p.level*5);
    p.hp=Math.max(1,p.hp-dmg); earnGold(g); SFX.boss();
    addLog(`☄️ Meteorschauer! -${dmg} HP aber +${g} Gold!`); refresh();
  } else if (ev.t==='divine') {
    const heal=stats().maxHp-p.hp; const mp=stats().maxMp-p.mp;
    p.hp=stats().maxHp; p.mp=stats().maxMp;
    SFX.heal(); addLog(`✨ Göttliche Gnade! Vollständig geheilt! (+${heal} HP, +${mp} MP)`); refresh();
  } else if (ev.t==='gather') {
    const types=['wood','ore','herbs']; const res=types[Math.floor(Math.random()*types.length)];
    let amt=Math.floor(Math.random()*3)+1;
    if (G.guild && G.guild.name==='Waldläufer') amt += 1;
    G.resources[res]=(G.resources[res]||0)+amt;
    const icons={wood:'🪵',ore:'🪨',herbs:'🌿'};
    const names={wood:'Holz',ore:'Erz',herbs:'Kräuter'};
    addLog(`${icons[res]} +${amt} ${names[res]} gesammelt! (Gesamt: ${G.resources[res]})`);
    SFX.itemGet(); refresh();
  } else if (ev.t==='fish') {
    showFishingEvent();
  } else if (ev.t==='pvp') {
    addLog('⚔ Eine Aufforderung zum Duell!'); showPvPEvent();
  } else if (ev.t==='inn') {
    addLog('🏠 Du entdeckst ein Wirtshaus. Ausruhen?'); showInn();
  } else if (ev.t==='area_boss') {
    startAreaBoss(G.area.id);
  } else {
    addLog(NPC_FLAVOR_LINES[Math.floor(Math.random()*NPC_FLAVOR_LINES.length)]);
  }
  if (G.tutorialStep===0&&!G.combat) { G.tutorialStep=1; showTutorialHint(0); }
}

function earnGold(g) {
  const pet = G.p.eq.pet;
  if (pet && pet.goldBonus) g = Math.floor(g * (1 + pet.goldBonus));
  const s = stats();
  if (s.goldFind > 0) g = Math.floor(g * (1 + s.goldFind));
  if (G.guild && G.guild.name==='Schatzhüter') g = Math.floor(g * 1.1);
  G.p.gold+=g; G.p.totalGoldEarned+=g; tickQuestGold(g); tickDailyGold(g);
  checkAchievements();
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
  // Status combos
  const types = list.map(s=>s.type);
  if (types.includes('burn') && types.includes('poison')) {
    const explodeDmg = 30 + G.p.level * 3;
    if (target === 'enemy') {
      G.combat.hp -= explodeDmg;
      floatDmg(document.getElementById('enemy-canvas'), '💥'+explodeDmg, '#ff8800');
      combatLog(`💥 KOMBO: Feuer+Gift = Explosion! ${explodeDmg} Schaden!`);
    } else {
      G.p.hp -= explodeDmg;
      floatDmg(document.getElementById('player-combat-canvas'), '💥'+explodeDmg, '#ff8800');
      combatLog(`💥 Feuer+Gift Explosion! -${explodeDmg} HP!`);
    }
    for (let i=list.length-1;i>=0;i--) { if(list[i].type==='burn'||list[i].type==='poison') list.splice(i,1); }
    SFX.crit();
  }
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
  const diffMult = G.difficulty==='easy'?0.75 : G.difficulty==='hard'?1.35 : 1;
  const m=(1+(G.p.level-1)*0.15)*(isBoss?2:1)*em*diffMult;
  const xpScale=G.p.level>=51?Math.pow(1.08,G.p.level-50):G.p.level>=21?Math.pow(1.04,G.p.level-20):1;
  const goldMult = isBoss?3 : isElite?3 : 1;
  const drops=(DROPS[foeId]||[]).map(d=>(isBoss||isElite)?{...d,p:Math.min(1,d.p*(isElite?2.5:3))}:d);
  G.combat={
    id:foeId, isBoss, isElite, name:(isElite?'⚡ ELITE ':isBoss?'⭐ ':'')+base.name, sprite:base.sprite,
    hp:Math.floor(base.hp*m), maxHp:Math.floor(base.hp*m),
    atk:Math.floor(base.atk*m), def:Math.floor(base.def*m),
    xp:Math.floor(base.xp*m*xpScale*(isBoss?1.5:isElite?2:1)),
    gold:[Math.floor(base.gold[0]*goldMult*xpScale), Math.floor(base.gold[1]*goldMult*xpScale)],
    drops, playerTurn:true, playerStatus:[], enemyStatus:[], combo:0, rounds:0,
    statusDef:base.status, isKing:false,
    atkBonus:0, atkBonusTurns:0, defBonus:0, defBonusTurns:0,
  };
  // bestiary
  if (!G.bestiary[foeId]) G.bestiary[foeId]={seen:0,killed:0};
  G.bestiary[foeId].seen++;
  // Monster affixes
  const affixes = [];
  if (isElite && typeof MONSTER_AFFIXES !== 'undefined') {
    const pool = [...MONSTER_AFFIXES];
    const numAffixes = Math.min(2, 1 + Math.floor(Math.random()*2));
    for (let i=0;i<numAffixes;i++) {
      const pick = pool.splice(Math.floor(Math.random()*pool.length),1)[0];
      if (pick) { pick.apply(G.combat); affixes.push(pick); }
    }
    if (affixes.length) combatLog(`⚡ Affixe: ${affixes.map(a=>a.icon+a.name).join(' ')}`);
  } else if (!isBoss && G.p.level >= 10 && Math.random() < 0.12 && typeof MONSTER_AFFIXES !== 'undefined') {
    const pick = MONSTER_AFFIXES[Math.floor(Math.random()*MONSTER_AFFIXES.length)];
    if (pick) { pick.apply(G.combat); affixes.push(pick); combatLog(`🌀 ${pick.icon} ${G.combat.name} (${pick.name})!`); }
  }
  if (affixes.length) G.combat.name = affixes.map(a=>a.icon).join('')+' '+G.combat.name;
  if (isElite) { addLog(`⚡ Ein ELITE ${base.name} erscheint! (3× Beute)`); SFX.boss(); }
  else addLog(isBoss?`🌟 Mächtiger ${base.name}! BOSS!`:`⚔ Ein ${base.name} erscheint!`);
  enterCombatScreen(base.sprite, isBoss||isElite, false, base.palette||null);
}

function startFinalBoss() {
  if (G.p.level < 20) { showOverlay('❌ Du musst LV 20 sein!'); return; }
  G.combat = { ...SHADOW_KING, hp:SHADOW_KING.hp, maxHp:SHADOW_KING.maxHp, playerStatus:[], enemyStatus:[], combo:0, isBoss:true };
  addLog('👑 DER SHADOW KING ERWACHT!');
  enterCombatScreen('shadow_king', false, true);
}

function startAreaBoss(areaId) {
  const boss = AREA_BOSSES[areaId]; if (!boss) { startCombat(G.area.foes[0], true); return; }
  const base = FOES[boss.foeId]||FOES[G.area.foes[0]]; if (!base) return;
  const diffMult = G.difficulty==='easy'?0.75 : G.difficulty==='hard'?1.35 : 1;
  const m = (1+(G.p.level-1)*0.15) * boss.hpMult * diffMult;
  G.combat = {
    id:boss.foeId, isBoss:true, isElite:false,
    name:boss.name, sprite:base.sprite,
    hp:Math.floor(base.hp*m), maxHp:Math.floor(base.hp*m),
    atk:Math.floor(base.atk*boss.atkMult*(1+(G.p.level-1)*0.15)*diffMult),
    def:Math.floor(base.def*1.5*(1+(G.p.level-1)*0.1)),
    xp:Math.floor(base.xp*boss.xpMult*(1+(G.p.level-1)*0.15)),
    gold:[Math.floor(base.gold[0]*boss.goldMult), Math.floor(base.gold[1]*boss.goldMult)],
    drops:boss.drops||[], playerTurn:true, playerStatus:[], enemyStatus:[], combo:0,
    statusDef:base.status||null, isKing:false,
    atkBonus:0, atkBonusTurns:0, defBonus:0, defBonusTurns:0,
  };
  addLog(`👑 ${boss.name} tritt auf! GEBIET-BOSS!`); SFX.boss();
  enterCombatScreen(base.sprite, true, false, base.palette||null);
}

function enterCombatScreen(sprite, isBoss, isKing, palette=null) {
  showScreen('combat',null);
  // draw dimmed area background on combat stage
  const cbc = document.getElementById('combat-bg-canvas');
  if (cbc) {
    drawBackground(G.area.id, cbc);
    const ctx = cbc.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0,0,cbc.width,cbc.height);
  }
  const lbl=document.getElementById('enemy-name-lbl');
  lbl.className='cname'+(isKing?' boss-name':isBoss?' boss-name':'');
  drawSprite(document.getElementById('enemy-canvas'),sprite,4,palette);
  drawPlayer(document.getElementById('player-combat-canvas'));
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
    e.combo=0;
    if(Math.random()<0.45){ combatLog('🏃 Geflohen!'); SFX.flee(); setTimeout(endCombat,800); }
    else{ combatLog('😱 Flucht fehlgeschlagen!'); setTimeout(enemyTurn,700); }
    return;
  }
  if(stunned){ combatLog('💫 Betäubt! Zug übersprungen.'); setTimeout(enemyTurn,700); return; }

  e.combo=(e.combo||0)+1;
  const comboMult=1+Math.min(e.combo*0.12,0.72);
  const crit=Math.random()<(0.15+(s.critBonus||0));
  const sc=p.subclass?SUBCLASSES[p.subclass]:null;
  const wType=ITEMS[p.eq.weapon?.id]?.wType||null;
  const hits=(sc&&sc.autoMulti&&Math.random()<0.35)?2:(wType==='axe'&&Math.random()<0.25)?2:1;
  let totalDmg=0;
  const ec=document.getElementById('enemy-canvas');
  const critMult = 2 + (s.critDmg||0);
  for(let h=0;h<hits;h++){
    let dmg=Math.max(1,Math.floor((s.atk-e.def+rand(-2,3))*(crit?critMult:1)*comboMult));
    if(sc&&sc.berserker&&crit) dmg=Math.floor(dmg*2);
    totalDmg+=dmg; e.hp-=dmg;
    floatDmg(ec,(crit?'💥':'')+dmg,crit?'#ffd700':'#e05252');
    shake(ec); flashHit(ec); flashEnemy();
  }
  // Weather element bonus
  const foeWeakTo = FOES[G.combat.id]?.weakTo;
  const areaElem = WEATHER_ELEMENT[G.area.id] || null;
  if (foeWeakTo && areaElem && foeWeakTo === areaElem) {
    const bonus = Math.floor(totalDmg * 0.2);
    totalDmg += bonus; e.hp -= bonus;
    combatLog(`🌤 Elementvorteil! +20% Schaden!`);
  }
  // Bow: 25% stun on hit
  if(wType==='bow'&&Math.random()<0.25) { applyStatus('enemy','stun',1,0); }
  // Lifesteal
  if(s.lifesteal>0){ const ls=Math.floor(totalDmg*s.lifesteal); p.hp=Math.min(s.maxHp,p.hp+ls); if(ls>0)floatDmg(document.getElementById('player-combat-canvas'),'+'+ls,'#88ff88'); }
  G.battleStats.dmgDealt+=totalDmg;
  if(crit&&totalDmg>G.battleStats.highCrit) G.battleStats.highCrit=totalDmg;
  if(e.combo>=3) combatLog(`🔥 COMBO ×${e.combo}!`);
  if(crit){ combatLog(`💥 KRITISCH! ${totalDmg} Schaden!`); SFX.crit(); const app=document.getElementById('app');if(app){app.classList.remove('shake');void app.offsetWidth;app.classList.add('shake');setTimeout(()=>app.classList.remove('shake'),260);} }
  else if(hits>1){ combatLog(`${wType==='axe'?'🪓 Axt-Cleave':'🏹 Doppelschlag'}! ${totalDmg} Schaden!`); SFX.hit(); }
  else    { combatLog(`⚔ Du schlägst für ${totalDmg} Schaden!`); SFX.hit(); }
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

  if(skill.atkBuff){
    e.atkBonus=(e.atkBonus||0)+skill.atkBuff; e.atkBonusTurns=skill.buffTurns||3;
    combatLog(`${skill.icon} ${skill.name}! +${skill.atkBuff} ATK für ${skill.buffTurns} Runden!`);
    SFX.status(); floatDmg(document.getElementById('player-combat-canvas'),'+ATK','#ffcc00');
    updateCombatUI(); updateHUD(); e.playerTurn=true; setCombatBtns(true); return;
  }
  if(skill.defBuff){
    e.defBonus=(e.defBonus||0)+skill.defBuff; e.defBonusTurns=skill.buffTurns||3;
    combatLog(`${skill.icon} ${skill.name}! +${skill.defBuff} DEF für ${skill.buffTurns} Runden!`);
    SFX.status(); floatDmg(document.getElementById('player-combat-canvas'),'+DEF','#44aaff');
    updateCombatUI(); updateHUD(); e.playerTurn=true; setCombatBtns(true); return;
  }
  if(skill.fleeSkill){
    combatLog(`${skill.icon} ${skill.name}! Flucht gelungen!`); SFX.step();
    G.combat=null; G.battleStats.fled++;
    setTimeout(()=>showScreen('explore',null),600); return;
  }
  if(skill.healAmt&&skill.stun){
    const healed=Math.min(s.maxHp-p.hp,skill.healAmt);
    p.hp=Math.min(s.maxHp,p.hp+skill.healAmt);
    applyStatus('enemy','stun',2,0);
    combatLog(`${skill.icon} ${skill.name}! +${healed} HP & Feind betäubt!`);
    SFX.heal(); floatDmg(document.getElementById('player-combat-canvas'),'+'+healed,'#52c07a');
    updateCombatUI(); updateHUD(); e.playerTurn=true; setCombatBtns(true); return;
  }
  if(skill.healAmt){
    const healed=Math.min(s.maxHp-p.hp,skill.healAmt);
    p.hp=Math.min(s.maxHp,p.hp+skill.healAmt);
    combatLog(`💚 Heilung! +${healed} HP`);
    SFX.heal();
    floatDmg(document.getElementById('player-combat-canvas'),'+'+healed,'#52c07a');
    updateHUD(); e.playerTurn=true; setCombatBtns(true); updateCombatUI(); return;
  }
  const ec2 = document.getElementById('enemy-canvas');
  if(skill.multiHit){
    let total=0;
    for(let i=0;i<skill.multiHit;i++){
      const d=Math.max(1,Math.floor(s.atk*skill.dmgMult-e.def+rand(-1,2)));
      total+=d; e.hp-=d;
      floatDmg(ec2,skill.icon+d,'#88ddff');
      shake(ec2); flashHit(ec2);
    }
    combatLog(`${skill.icon} ${skill.name}! ${skill.multiHit}× Treffer! ${total} Gesamtschaden!`);
    SFX.hit();
    updateCombatUI(); updateHUD();
    if(e.hp<=0){setTimeout(combatWin,700);return;}
    setTimeout(enemyTurn,800); return;
  }
  const crit=Math.random()<(0.15+(s.critBonus||0));
  const scSub=p.subclass?SUBCLASSES[p.subclass]:null;
  const elemBonus=(skill.element&&FOES[e.id]&&FOES[e.id].weakTo===skill.element)?1.5:1;
  const skillMult=skill.dmgMult*(scSub&&scSub.skillBonus?(1+scSub.skillBonus):1)*elemBonus;
  const critMultiplier=skill.critMult||(2+(s.critDmg||0));
  let dmg=Math.max(1,Math.floor(s.atk*skillMult-e.def+rand(-1,2))*(crit?critMultiplier:1));
  if(elemBonus>1) combatLog(`🎯 SCHWÄCHE! ${skill.element.toUpperCase()}`);
  combatLog(`${skill.icon} ${skill.name}! ${dmg}${crit?' KRIT!':''}`);
  if(crit) SFX.crit(); else SFX.hit();
  e.hp-=dmg; G.battleStats.dmgDealt+=dmg;
  if(dmg>G.battleStats.highCrit&&crit) G.battleStats.highCrit=dmg;
  floatDmg(ec2,skill.icon+dmg,elemBonus>1?'#00ffaa':'#e8c96b');
  shake(ec2); flashHit(ec2);
  if(skill.stun) applyStatus('enemy','stun',1,0);
  if(skill.burn) applyStatus('enemy','burn',skill.id==='meteor'?3:2,skill.id==='meteor'?14:8);
  if(skill.poisonSkill) applyStatus('enemy','poison',4,8+Math.floor(s.atk*0.15));
  const doDrain=skill.drain||(scSub&&scSub.alwaysDrain);
  if(doDrain){ const d=Math.floor(dmg*0.4); p.hp=Math.min(s.maxHp,p.hp+d); combatLog(`🩸 +${d} HP`); floatDmg(document.getElementById('player-combat-canvas'),'+'+d,'#cc44aa'); }
  updateCombatUI(); updateHUD();
  if(e.hp<=0){setTimeout(combatWin,700);return;}
  setTimeout(enemyTurn,800);
}

function useItemInCombat(idx) {
  if(!G.combat||!G.combat.playerTurn) return;
  const slot=G.p.inv[idx]; if(!slot) return;
  const item=ITEMS[slot.id]; if(!item||item.slot) return;
  const p=G.p; const s=stats();
  if(item.hp){p.hp=Math.min(s.maxHp,p.hp+(item.hp||0)); SFX.heal(); floatDmg(document.getElementById('player-combat-canvas'),'+'+item.hp+'HP','#52c07a');}
  if(item.mp) p.mp=Math.min(s.maxMp,p.mp+(item.mp||0));
  if(item.buffAtk){
    p.buffs=p.buffs||[];
    const ex=p.buffs.find(b=>b.type==='atk');
    if(ex) ex.left=Math.max(ex.left,item.buffLeft);
    else p.buffs.push({type:'atk',val:item.buffAtk,left:item.buffLeft});
    combatLog(`⚗ +${item.buffAtk} ATK für ${item.buffLeft} Kämpfe!`);
    floatDmg(document.getElementById('player-combat-canvas'),`+${item.buffAtk}ATK`,'#e8c96b');
  }
  if(item.buffDef){
    p.buffs=p.buffs||[];
    const ex=p.buffs.find(b=>b.type==='def');
    if(ex) ex.left=Math.max(ex.left,item.buffLeft);
    else p.buffs.push({type:'def',val:item.buffDef,left:item.buffLeft});
    combatLog(`🍃 +${item.buffDef} DEF für ${item.buffLeft} Kämpfe!`);
    floatDmg(document.getElementById('player-combat-canvas'),`+${item.buffDef}DEF`,'#52c07a');
  }
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
  else{ G.p.inv.forEach((slot,idx)=>{const item=ITEMS[slot.id];if(!item||item.slot)return;const btn=document.createElement('button');btn.className='skill-btn';const desc=item.buffAtk?`+${item.buffAtk}ATK ${item.buffLeft}K`:item.buffDef?`+${item.buffDef}DEF ${item.buffLeft}K`:`${item.hp?'+'+item.hp+'HP':''} ${item.mp?'+'+item.mp+'MP':''}`.trim();btn.innerHTML=`<span>${item.icon} ${item.name}${slot.qty>1?` x${slot.qty}`:''}</span><span class="skill-unlock">${desc}</span>`;btn.onclick=()=>useItemInCombat(idx);picker.appendChild(btn);}); }
  picker.classList.add('open'); document.getElementById('btn-items').textContent='🎒 Items ▼';
}
function hideCombatItems(){document.getElementById('combat-item-picker').classList.remove('open');const b=document.getElementById('btn-items');if(b)b.textContent='🎒 Items';}

function enemyTurn() {
  if(!G.combat) return;
  G.combat.rounds=(G.combat.rounds||0)+1; tickQuestSurvive();
  // Boss phase 2
  if (!G.combat.phase2 && G.combat.isBoss && G.combat.hp < G.combat.maxHp * 0.5) {
    G.combat.phase2 = true;
    G.combat.atk = Math.floor(G.combat.atk * 1.5);
    combatLog(`💥 ${G.combat.name} Phase 2! ATK ×1.5!`);
    SFX.boss();
    const fl=document.createElement('div'); fl.className='phase2-flash'; document.body.appendChild(fl);
    setTimeout(()=>fl.remove(),800);
  }
  const p=G.p; const e=G.combat;
  // Decrement combat skill buffs
  if(e.atkBonusTurns>0){e.atkBonusTurns--;if(e.atkBonusTurns===0)e.atkBonus=0;}
  if(e.defBonusTurns>0){e.defBonusTurns--;if(e.defBonusTurns===0)e.defBonus=0;}
  const s=stats();
  // Staff MP regen
  if(s.mpRegen>0){ p.mp=Math.min(s.maxMp,p.mp+s.mpRegen); updateHUD(); }
  // Companion attack
  if(G.companion&&G.companion.hp>0&&e.hp>0){
    const cd=Math.max(1,G.companion.atk-Math.floor(e.def*0.5)+rand(-2,2));
    e.hp-=cd;
    combatLog(`${G.companion.icon} ${G.companion.name}: ${cd} Schaden!`);
    // Healer companion
    if(G.companion.heals&&Math.random()<0.35){ const h=Math.floor(s.maxHp*0.05); p.hp=Math.min(s.maxHp,p.hp+h); combatLog(`💚 ${G.companion.name} heilt +${h} HP`); }
    updateCombatUI();
    if(e.hp<=0){setTimeout(combatWin,400);return;}
  }
  const stunned=processStatuses('enemy'); updateCombatUI();
  if(e.hp<=0){setTimeout(combatWin,400);return;}
  if(!stunned){
    e.combo=0;
    const attackTimes = e._multiAtk||1;
    for (let ai=0; ai<attackTimes; ai++) {
      // Evasion check
      if(s.evasion>0&&Math.random()<s.evasion){ combatLog('💨 Ausgewichen!'); continue; }
      if(e._evasion&&Math.random()<e._evasion){ combatLog(`💨 ${e.name} weicht aus!`); continue; }
      const crit=Math.random()<0.10;
      const nightMult = (G.dayNight >= 21 || G.dayNight < 5) ? 1.1 : 1;
      const dmg=Math.max(1,Math.floor((e.atk-s.def+rand(-2,2))*(crit?1.8:1)*nightMult));
      // Status resist
      const resisted=s.resist>0&&Math.random()<s.resist;
      p.hp-=dmg; G.battleStats.dmgTaken+=dmg;
      combatLog(`💢 ${e.name}${attackTimes>1?' (×'+attackTimes+')':''}: ${dmg}${crit?' Krit!':''}`);
      SFX.dmgTake();
      const ec3=document.getElementById('enemy-canvas');
      if(ec3){ec3.classList.remove('enemy-lunge');void ec3.offsetWidth;ec3.classList.add('enemy-lunge');setTimeout(()=>ec3.classList.remove('enemy-lunge'),400);}
      const pc=document.getElementById('player-combat-canvas');
      floatDmg(pc,'-'+dmg,'#e05252');
      shake(pc); flashHit(pc); flashPlayer();
      if(!resisted&&e.statusDef&&Math.random()<e.statusDef.chance) applyStatus('player',e.statusDef.type,e.statusDef.turns,e.statusDef.value);
      else if(resisted&&e.statusDef) combatLog('💠 Status widerstanden!');
      // Vampiric affix: enemy heals on hit
      if(e._lifesteal){ const heal=Math.floor(dmg*e._lifesteal); e.hp=Math.min(e.maxHp,e.hp+heal); combatLog(`🩸 ${e.name} saugt ${heal} HP!`); }
      if(p.hp<=0) break;
    }
  }
  updateCombatUI(); updateHUD();
  if(p.hp<=0){p.hp=0;defeatPlayer();return;}
  e.playerTurn=true; setCombatBtns(true);
}

function defeatPlayer(){
  combatLog('💀 Du wurdest besiegt...'); setCombatBtns(false);
  if(G.combat) recordBattleHistory(G.combat,'loss');
  G.battleStats.lost=(G.battleStats.lost||0)+1;
  setTimeout(()=>{
    if(G.hardcore){
      saveHighscore();
      endCombat();
      showHardcoreGameOver();
      return;
    }
    const p=G.p; const lost=Math.floor(p.gold*0.1);
    p.gold=Math.max(0,p.gold-lost); p.hp=Math.max(1,Math.floor(stats().maxHp*0.3));
    G.dungeon=null; G.arena=null;
    endCombat(); addLog(`💀 Respawn. Verloren: ${lost} Gold.`);
  },1400);
}

function showHardcoreGameOver() {
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.97);z-index:200';
  wrap.innerHTML=`<div id="overlay-box" style="text-align:center;border-color:#ff0000">
    💀 GAME OVER 💀<br><br>
    <span style="font-size:7px;color:var(--dim)">Hardcore-Held gefallen<br>
    LV ${G.p.level} · ${G.p.kills} Kills · ${G.steps} ${t('step_counter')}</span><br><br>
    <button onclick="hardcoreReset()" style="display:block;width:100%;background:#2a0000;color:#ff4444;border:2px solid #ff0000;padding:10px;font-family:'Press Start 2P',monospace;font-size:8px;cursor:pointer">🔄 Neu starten</button>
  </div>`;
  document.body.appendChild(wrap);
}

function hardcoreReset(){
  document.getElementById('overlay')?.remove();
  localStorage.removeItem('pq_save');
  location.reload();
}

function combatWin() {
  const p=G.p; const e=G.combat;
  const g=rand(e.gold[0],e.gold[1]); earnGold(g); p.kills++;
  if (G.bestiary[e.id]) { G.bestiary[e.id].killed++; checkBestiaryReward(e.id); }
  // Artifact kills
  for (const slot of Object.values(G.p.eq)) {
    if (slot && ITEMS[slot.id]?.artifact) {
      const invSlot = G.p.inv.find(i=>i.id===slot.id&&i.equipped);
      if (invSlot) {
        invSlot._artKills = (invSlot._artKills||0) + 1;
        if (invSlot._artKills % 50 === 0) {
          invSlot._artLevel = (invSlot._artLevel||0) + 1;
          addLog(`💎 Seelen-Stein LV${invSlot._artLevel}! (+1 ATK, +1 DEF)`);
          SFX.levelUp();
        }
      }
    }
  }
  combatLog(`🎉 Sieg! +${e.xp} XP  +${g} Gold`);
  recordBattleHistory(e, 'win');
  tickQuestKill(e.id); tickDailyKill(e.id);
  tickStoryChain(e.id, e.isBoss);
  for(const drop of (e.drops||[])){ if(Math.random()<drop.p){ addInv(drop.id); const it=ITEMS[drop.id]; if(it) combatLog(`📦 ${it.rarity==='legendary'?'🌟':it.rarity==='epic'?'💜':''} ${it.name}!`); } }
  G.battleStats.won++;
  if(G.tutorialStep===1){G.tutorialStep=2;setTimeout(()=>showTutorialHint(1),600);}
  const xp=e.xp; const isKing=e.isKing;
  const isDungeon=!!G.dungeon; const isArena=!!G.arena; const isBossRush=!!G.bossRush;
  const sc=G.p.subclass?SUBCLASSES[G.p.subclass]:null;
  if(sc&&sc.healOnKill){ const h=Math.floor(stats().maxHp*0.08); G.p.hp=Math.min(stats().maxHp,G.p.hp+h); combatLog(`🛡 Paladin: +${h} HP`); }
  if(isBossRush) G.bossRush.score=(G.bossRush.score||0)+xp*2;
  const seasonalReward=e._seasonalReward;
  const isDailyChallenge=e._dailyChallenge;
  const challengerIdx=e._challengerIdx;
  setTimeout(()=>{
    endCombat();
    gainXP(xp);
    if(seasonalReward){ for(let i=0;i<(seasonalReward.qty||1);i++) addInv(seasonalReward.id); addLog(`🎁 Event-Belohnung: ${ITEMS[seasonalReward.id]?.icon} ×${seasonalReward.qty}!`); }
    if(isDailyChallenge && G.dailyChallenge && !G.dailyChallenge.done){
      G.dailyChallenge.done=true;
      const dc=G.dailyChallenge;
      for(let i=0;i<dc.rewardQty;i++) addInv(dc.reward);
      gainXP(dc.xp); earnGold(dc.gold);
      SFX.victory(); addLog(`${dc.icon} Tages-Herausforderung abgeschlossen! +${dc.xp}XP +${dc.gold}G`);
      save();
    }
    if(challengerIdx !== undefined && (G.challengerCleared||0) <= challengerIdx) {
      const CHALL_REWARDS=[
        { xp:2000, gold:1000, item:'chaos_crystal' },
        { xp:3500, gold:1800, item:'void_robe' },
        { xp:5000, gold:2500, item:'chaos_blade' },
        { xp:8000, gold:4000, item:'crystal_crown' },
        { xp:12000,gold:6000, item:'celestial_bow' },
      ];
      const cr=CHALL_REWARDS[challengerIdx];
      if(cr){ gainXP(cr.xp); earnGold(cr.gold); addInv(cr.item); SFX.victory(); addLog(`🏆 Herausforderer Stufe ${challengerIdx+1} bezwungen! ${ITEMS[cr.item]?.icon} ${ITEMS[cr.item]?.name} erhalten!`); }
      G.challengerCleared=(G.challengerCleared||0)+1;
      save();
    }
    addLog(`✅ ${(G.lang==='en'&&e.id&&FOES[e.id]?.nameEn)?e.name.replace(FOES[e.id].name,FOES[e.id].nameEn):e.name} ${t('log_defeated')}!`);
    if(isKing){ showVictory(); checkSpeedrunComplete(); }
    if(isDungeon) dungeonNextRoom();
    if(isArena) arenaNextRound();
    if(isBossRush) bossRushNext();
  },1100);
}

function endCombat() {
  G.combat=null; hideSkillPicker(); hideCombatItems();
  if(G.autoBattle){ G.autoBattle=false; clearInterval(window._autoBattleInterval); window._autoBattleInterval=null; }
  G.p.buffs=(G.p.buffs||[]).filter(b=>{
    b.left--;
    if(b.left<=0){addLog(`⌛ ${b.type==='atk'?'ATK':'DEF'}-Buff abgelaufen.`);return false;}
    return true;
  });
  showScreen('explore',document.querySelector('.nav-btn')); refresh();
}

function updateCombatUI() {
  const e=G.combat; const p=G.p; const s=stats(); if(!e) return;
  document.getElementById('enemy-name-lbl').textContent =(G.lang==='en'&&e.id&&FOES[e.id]?.nameEn)?e.name.replace(FOES[e.id].name,FOES[e.id].nameEn):e.name;
  document.getElementById('enemy-hp-text').textContent  =`${Math.max(0,e.hp)}/${e.maxHp}`;
  document.getElementById('enemy-hp-bar').style.width   =pct(Math.max(0,e.hp),e.maxHp);
  document.getElementById('pcombat-hp-text').textContent=`${Math.max(0,p.hp)}/${s.maxHp}`;
  document.getElementById('pcombat-hp-bar').style.width =pct(Math.max(0,p.hp),s.maxHp);
  const cd=document.getElementById('combo-display');
  if(cd){
    const c=e.combo||0;
    if(c>=2){
      cd.style.display='block';
      const prev=cd.textContent;
      const next=c>=8?`🔥🔥 MAX FEVER ×${c}!!`:c>=5?`🔥 FEVER ×${c}!`:`🔥 COMBO ×${c}`;
      if(prev!==next){cd.textContent=next;cd.classList.remove('comboPulse');void cd.offsetWidth;cd.classList.add('comboPulse');}
    } else {cd.style.display='none';}
  }
  renderStatusRow('enemy-status',e.enemyStatus);
  renderStatusRow('player-status',e.playerStatus);
}

function setCombatBtns(on){document.querySelectorAll('.cbtn').forEach(b=>b.disabled=!on);}

function showPrestigeShop() {
  const pu = G.prestigeUpgrades = G.prestigeUpgrades||{};
  const coins = G.prestigeCoins||0;
  const rows = PRESTIGE_SHOP.map(s=>{
    const owned=pu[s.id]||0; const maxed=owned>=s.max;
    const canBuy=!maxed&&coins>=s.cost;
    return `<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border)">
      <div style="flex:1">
        <div style="font-size:6px;color:${maxed?'var(--accent)':'var(--text)'}">${s.label}${maxed?' ✓MAX':''}</div>
        <div style="font-size:5px;color:var(--dim);margin-top:2px">${s.desc} · ${owned}/${s.max}</div>
      </div>
      <button onclick="buyPrestigeUpgrade('${s.id}')" ${canBuy?'':'disabled'} style="background:${canBuy?'var(--accent)':'var(--panel)'};color:${canBuy?'var(--bg)':'var(--dim)'};border:1px solid ${canBuy?'var(--accent)':'var(--border)'};padding:5px 7px;font-family:'Press Start 2P',monospace;font-size:6px;cursor:${canBuy?'pointer':'default'}">💫${s.cost}</button>
    </div>`;
  }).join('');
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.92);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:290px;max-width:90vw;max-height:85vh;overflow-y:auto">
    <div style="text-align:center;color:var(--accent);font-size:9px;margin-bottom:4px">💫 PRESTIGE-SHOP</div>
    <div style="text-align:center;font-size:7px;color:var(--dim);margin-bottom:10px">💫 ${coins} Prestige-Münzen verfügbar</div>
    <div style="text-align:left">${rows}</div><br>
    <button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}

function buyPrestigeUpgrade(id) {
  const s=PRESTIGE_SHOP.find(x=>x.id===id); if(!s) return;
  G.prestigeUpgrades=G.prestigeUpgrades||{};
  if((G.prestigeUpgrades[id]||0)>=s.max){showOverlay('❌ Bereits maximal!');return;}
  if((G.prestigeCoins||0)<s.cost){showOverlay('❌ Nicht genug Prestige-Münzen!');return;}
  G.prestigeCoins-=s.cost; G.prestigeUpgrades[id]=(G.prestigeUpgrades[id]||0)+1;
  addLog(`💫 ${s.label} erworben!`); SFX.levelUp();
  document.getElementById('overlay')?.remove(); save(); showPrestigeShop();
}

// ── DUNGEON GAUNTLET ─────────────────────────────────────────
const DUNGEON_ROOMS = 5;
function startDungeon() {
  if (G.dungeon) return;
  const foes = G.area.foes;
  G.dungeon = { room:0, maxRooms:DUNGEON_ROOMS };
  addLog(`⛏ Dungeon Gauntlet gestartet! ${DUNGEON_ROOMS} Räume!`);
  setBusy(false);
  setTimeout(()=>startCombat(foes[Math.floor(Math.random()*foes.length)], false), 300);
}

const PROC_ROOM_TYPES = [
  {t:'combat',   w:38},{t:'chest',   w:14},{t:'heal',     w:10},
  {t:'trap',     w:8}, {t:'merchant',w:7}, {t:'boss_room',w:10},{t:'shrine',  w:7},{t:'secret',  w:6},
];

function dungeonNextRoom() {
  if (!G.dungeon) return;
  G.dungeon.room++;
  if (G.dungeon.room >= G.dungeon.maxRooms) { dungeonComplete(); return; }
  const room = pick(PROC_ROOM_TYPES);
  const foes = G.area.foes; const p = G.p;
  addLog(`⛏ Raum ${G.dungeon.room+1}/${G.dungeon.maxRooms} — ${roomIcon(room.t)}`);
  setTimeout(() => {
    if (room.t==='combat') { startCombat(foes[Math.floor(Math.random()*foes.length)], false); }
    else if (room.t==='boss_room') { startCombat(foes[Math.floor(Math.random()*foes.length)], true); }
    else if (room.t==='chest') {
      const id=CHEST_LOOT[Math.floor(Math.random()*CHEST_LOOT.length)]; addInv(id);
      SFX.chest(); addLog(`📦 Schatzkammer! ${ITEMS[id].icon} ${ITEMS[id].name}!`); dungeonNextRoom();
    } else if (room.t==='heal') {
      const h=Math.floor(stats().maxHp*0.35); p.hp=Math.min(stats().maxHp,p.hp+h);
      SFX.heal(); addLog(`💚 Heilquelle! +${h} HP`); refresh(); dungeonNextRoom();
    } else if (room.t==='trap') {
      const dmg=Math.max(5,Math.floor(p.hp*0.2)); p.hp=Math.max(1,p.hp-dmg);
      SFX.dmgTake(); addLog(`🪤 Falle! -${dmg} HP`); refresh(); dungeonNextRoom();
    } else if (room.t==='merchant') {
      addLog('🧙 Dungeon-Händler!'); showMerchant(); G.dungeon._pausedForMerchant=true;
    } else if (room.t==='shrine') {
      p.hp=stats().maxHp; p.mp=stats().maxMp; SFX.heal();
      addLog('⛩️ Dungeon-Schrein! Vollständig geheilt!'); refresh(); dungeonNextRoom();
    } else if (room.t==='secret') {
      const rewards=['elixir','chaos_crystal','mana_crystal','battle_brew'];
      const r=rewards[Math.floor(Math.random()*rewards.length)]; addInv(r); addInv(r);
      SFX.chest(); addLog(`🌟 Geheimraum! ×2 ${ITEMS[r].icon} ${ITEMS[r].name}!`); dungeonNextRoom();
    } else { startCombat(foes[Math.floor(Math.random()*foes.length)], false); }
  }, 900);
}
function roomIcon(t){return {combat:'⚔',chest:'📦',heal:'💚',trap:'🪤',merchant:'🧙',boss_room:'💀',shrine:'⛩️',secret:'🌟'}[t]||'?';}

function dungeonComplete() {
  G.dungeonClears = (G.dungeonClears||0)+1;
  G.dungeon = null;
  checkAchievements();
  const rewards=['dragon_blade','shadow_blade','thorn_shield','chaos_crystal','void_robe','chaos_blade'];
  const r1=rewards[Math.floor(Math.random()*rewards.length)];
  const r2=rewards[Math.floor(Math.random()*rewards.length)];
  addInv(r1); addInv('elixir'); addInv('elixir');
  SFX.victory();
  showOverlay(`🏆 GAUNTLET KLAR!\n5/5 Räume!\n${ITEMS[r1].icon} ${ITEMS[r1].name}\n+2 Elixiere`);
  refresh();
}

// ── ARENA MODE ────────────────────────────────────────────────
function startArena() {
  if (G.arena) return;
  G.arena = { round:0, maxRounds:10, score:0 };
  addLog('🏟 Arena! 10 Runden, kämpfe für Ruhm!');
  setBusy(false);
  setTimeout(()=>startCombat(G.area.foes[Math.floor(Math.random()*G.area.foes.length)], false), 300);
}

function arenaNextRound() {
  if (!G.arena) return;
  G.arena.round++;
  G.arena.score+=G.p.kills;
  if (G.arena.round>=G.arena.maxRounds) {
    arenaComplete();
  } else {
    addLog(`🏟 Runde ${G.arena.round+1}/${G.arena.maxRounds}...`);
    const foes=G.area.foes;
    setTimeout(()=>startCombat(foes[Math.floor(Math.random()*foes.length)], G.arena.round>=8), 1200);
  }
}

function arenaComplete() {
  const score=G.arena.score+G.arena.maxRounds*G.p.level;
  G.arena=null;
  saveHighscore(score, 'Arena');
  SFX.victory();
  const g=Math.floor(score*2.5); earnGold(g);
  addInv('elixir'); if(G.p.level>=20) addInv('chaos_crystal');
  showOverlay(`🏆 ARENA CHAMPION!\nScore: ${score}\n+${g} Gold\n+Elixier`);
  refresh();
}

// ── WORLD MAP ────────────────────────────────────────────────
function drawMiniMap() {
  const c=document.getElementById('minimap-canvas'); if(!c) return;
  const ctx=c.getContext('2d'); const W=c.width, H=c.height;
  ctx.fillStyle='#0a0a12'; ctx.fillRect(0,0,W,H);
  // Layout: 2 rows of 5, then secret area at bottom right
  const layout=[
    [0,0],[1,0],[2,0],[3,0],[4,0],
    [0,1],[1,1],[2,1],[3,1],[4,1],
    [4,2], // secret area
  ];
  const cellW=46, cellH=22, offX=8, offY=6;
  AREAS.forEach((a,i)=>{
    if(i>=layout.length) return;
    const [gx,gy]=layout[i]; const x=offX+gx*cellW, y=offY+gy*cellH;
    const active=G.area.id===a.id;
    const isSecret=a.secret;
    const secretUnlocked=isSecret&&(G.p.prestige||0)>=5;
    const locked=(!secretUnlocked&&isSecret)||(G.p.level<a.min);
    // draw line to next
    if(i<AREAS.length-1&&layout[i+1]){
      const [nx,ny]=layout[i+1];
      ctx.strokeStyle='#334'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(x+18,y+9); ctx.lineTo(offX+nx*cellW+18,offY+ny*cellH+9); ctx.stroke();
    }
    ctx.fillStyle=active?'#2244aa':locked?'#1a1a1a':isSecret?'#3a0a5a':'#1a2a1a';
    ctx.strokeStyle=active?'#6688ff':locked?'#333':isSecret?'#9952e0':'#445544';
    ctx.lineWidth=active?2:1;
    ctx.fillRect(x,y,36,18); ctx.strokeRect(x,y,36,18);
    ctx.font='11px serif'; ctx.textAlign='center';
    ctx.fillStyle=locked?'#333':'#fff';
    ctx.fillText(locked?'🔒':a.icon,x+18,y+13);
    if(active){ ctx.fillStyle='#88aaff'; ctx.font='4px monospace'; ctx.fillText('▲',x+18,y+20); }
  });
}

function showWorldMap() {
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.92);z-index:100';
  const lvl=G.p.level; const prestige=G.p.prestige||0;
  const nodes=AREAS.map((a,i)=>{
    const isSecret=a.secret;
    const secretUnlocked=isSecret&&prestige>=5;
    const locked=(isSecret&&!secretUnlocked)||(lvl<a.min);
    const active=G.area.id===a.id;
    const col=active?'var(--accent)':locked?'#333':isSecret?'#9952e0':'#556';
    const tx=active?'var(--text)':locked?'#444':isSecret?'#cc88ff':'#aaa';
    const clickable=!locked&&!active;
    const lockReason=isSecret&&!secretUnlocked?'🔒 Prestige 5 erforderlich':locked?'Benötigt LV '+a.min:active?'Aktuelles Gebiet':'Reisen → '+a.name;
    return `<div style="display:flex;align-items:center;gap:10px;margin:4px 0;${clickable?'cursor:pointer;':''}opacity:${locked?0.4:1}"
      ${clickable?`onclick="travelToArea('${a.id}')"`:''}
      title="${lockReason}">
      <div style="width:36px;height:36px;border:2px solid ${col};display:flex;align-items:center;justify-content:center;font-size:18px;background:${active?'#1a1a30':clickable?'#111':'transparent'}">${locked?'🔒':a.icon}</div>
      <div style="text-align:left;flex:1">
        <div style="font-size:7px;color:${tx}">${isSecret&&!secretUnlocked?'???':a.name}${active?' ◀':''}${isSecret&&secretUnlocked?' 🌟':''}</div>
        <div style="font-size:6px;color:var(--dim)">${isSecret?'🔒 Prestige 5':'LV '+a.min+'–'+a.max}${clickable?' · Tippen zum Reisen':''}</div>
      </div>
    </div>`;
  }).join('');
  wrap.innerHTML=`<div id="overlay-box" style="min-width:260px;max-width:90vw;max-height:85vh;overflow-y:auto;position:relative">
    🗺 WELTKARTE<br><br>
    <canvas id="minimap-canvas" width="260" height="70" style="display:block;margin:0 auto 12px;image-rendering:pixelated"></canvas>
    <div style="text-align:left;padding:0 8px">${nodes}</div>
    <br><button onclick="document.getElementById('overlay').remove()" style="background:none;border:1px solid var(--border);color:var(--dim);padding:6px 16px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
  drawMiniMap();
}
function travelToArea(areaId) {
  const a = AREAS.find(a=>a.id===areaId); if(!a) return;
  if(a.secret && (G.p.prestige||0)<5){showOverlay('🔒 Dimensionsriss: Prestige 5 erforderlich!');return;}
  if(G.p.level < a.min){showOverlay(t('err_level'));return;}
  if(G.combat){showOverlay('❌ Beende zuerst den Kampf!');return;}
  G.area = a;
  document.getElementById('area-name').textContent = a.name;
  document.getElementById('area-icon').textContent = a.icon;
  drawBackground(a.id);
  initWeather(a.id);
  if(!G.storyShown.includes(a.id) && AREA_STORIES[a.id]){
    G.storyShown.push(a.id);
    setTimeout(()=>showOverlay(AREA_STORIES[a.id]), 400);
  }
  document.getElementById('overlay')?.remove();
  addLog(`🗺 Reist nach ${a.name}!`);
  MUSIC.play(a.id);
  refresh();
}

// ── CRAFTING ─────────────────────────────────────────────────
function showCrafting() {
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  const btnStyle='display:block;width:100%;background:var(--panel);border:1px solid var(--border);border-bottom:2px solid var(--accent2);color:var(--text);padding:8px 10px;margin-bottom:6px;font-family:\'Press Start 2P\',monospace;font-size:6px;cursor:pointer;text-align:left';
  const resLine=`🪵 Holz:${G.resources.wood||0} 🪨 Erz:${G.resources.ore||0} 🌿 Kräuter:${G.resources.herbs||0}`;
  const rows=CRAFTING.map(r=>{
    const req=r.requires.map(x=>`${x.qty}× ${x.res?{wood:'Holz',ore:'Erz',herbs:'Kräuter'}[x.id]:ITEMS[x.id]?.name||x.id}`).join(', ');
    const res=ITEMS[r.result];
    const canCraft=r.requires.every(x=>{ if(x.res) return (G.resources[x.id]||0)>=x.qty; const s=G.p.inv.find(i=>i.id===x.id); return s&&(s.qty||1)>=x.qty; });
    return `<button style="${btnStyle};${canCraft?'':'color:var(--dim)'}" ${canCraft?`onclick="doCraft('${r.id}')"`:'disabled'}>${res?.icon||''} ${(G.lang==='en'&&r.labelEn)?r.labelEn:r.label}<br><span style="color:var(--dim);font-size:5px">${req} → ${res?.name}</span></button>`;
  }).join('');
  const resBadge=`<div style="font-size:6px;color:var(--accent);margin-bottom:8px;padding:4px;background:var(--panel);border:1px solid var(--border)">${resLine}</div>`;
  wrap.innerHTML=`<div id="overlay-box" style="min-width:280px;max-width:92vw;max-height:82vh;display:flex;flex-direction:column;overflow:hidden">
    <div style="flex-shrink:0;padding-bottom:6px">⚗ CRAFTING<br><br>${resBadge}</div>
    <div style="overflow-y:auto;flex:1;padding-right:2px">${rows}</div>
    <div style="flex-shrink:0;padding-top:6px"><button onclick="closeOverlay()" style="background:none;border:1px solid var(--border);color:var(--dim);padding:8px 16px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer;width:100%">✖ Schließen</button></div>
  </div>`;
  document.body.appendChild(wrap);
}

function doCraft(recipeId) {
  const r=CRAFTING.find(x=>x.id===recipeId); if(!r) return;
  for(const req of r.requires) {
    if(req.res) {
      if((G.resources[req.id]||0)<req.qty){showOverlay('❌ Ressourcen fehlen!');return;}
    } else {
      const s=G.p.inv.find(i=>i.id===req.id);
      if(!s||(s.qty||1)<req.qty){showOverlay('❌ Materialien fehlen!');return;}
    }
  }
  for(const req of r.requires) {
    if(req.res) G.resources[req.id]-=req.qty;
    else {
      const s=G.p.inv.find(i=>i.id===req.id);
      s.qty=(s.qty||1)-req.qty; if(s.qty<=0) G.p.inv.splice(G.p.inv.indexOf(s),1);
    }
  }
  for(let i=0;i<(r.resultQty||1);i++) addInv(r.result);
  const res=ITEMS[r.result];
  document.getElementById('overlay')?.remove();
  SFX.itemGet();
  addLog(`⚗ ${res.icon} ${iname(r.result)} ${t('log_crafted')}!`);
  showOverlay(`⚗ Gecraftet!\n${res.icon} ${res.name}`);
  tickQuestCraft();
  refresh();
}

// ── WEATHER ──────────────────────────────────────────────────
function initWeather(areaId) {
  G.weather.particles=[];
  G.weather.type=areaId;
}

function weatherTick() {
  const wc=document.getElementById('weather-canvas');
  if(!wc) return;
  const ctx=wc.getContext('2d');
  const W=wc.width, H=wc.height;
  const type=G.weather.type;
  if(!type||type==='dungeon'||type==='castle') { ctx.clearRect(0,0,W,H); return; }
  ctx.clearRect(0,0,W,H);
  const wp=G.weather.particles;
  // spawn
  const spawnRates={forest:0.5,cave:0.2,graveyard:0.3,volcanic:0.6,void:0.4};
  if(Math.random()<(spawnRates[type]||0.3)) {
    if(type==='forest'||type==='cave') wp.push({x:Math.random()*W,y:-4,vy:2+Math.random()*2,vx:(Math.random()-0.5)*0.5,life:1});
    else if(type==='graveyard') wp.push({x:Math.random()*W,y:-4,vy:1+Math.random(),vx:(Math.random()-0.5)*0.8,life:1});
    else if(type==='volcanic') wp.push({x:Math.random()*W,y:H,vy:-(1+Math.random()*3),vx:(Math.random()-0.5)*1.5,life:1});
    else if(type==='void') wp.push({x:Math.random()*W,y:Math.random()*H,vy:(Math.random()-0.5)*0.5,vx:Math.random()*0.8,life:1,size:Math.random()*3+1});
  }
  // update & draw
  for(let i=wp.length-1;i>=0;i--) {
    const p=wp[i]; p.x+=p.vx; p.y+=p.vy; p.life-=0.01;
    if(p.life<=0||p.y>H+4||p.y<-4||p.x<-4||p.x>W+4){wp.splice(i,1);continue;}
    ctx.globalAlpha=p.life*0.7;
    if(type==='forest'||type==='cave'){ ctx.fillStyle='#aaddff'; ctx.fillRect(p.x,p.y,1,3); }
    else if(type==='graveyard'){ ctx.fillStyle='#ddeeff'; ctx.fillRect(p.x,p.y,2,2); }
    else if(type==='volcanic'){ ctx.fillStyle=Math.random()<0.5?'#ff6600':'#ffaa00'; ctx.fillRect(p.x,p.y,2,2); }
    else if(type==='void'){ ctx.fillStyle='#aa44ff'; ctx.fillRect(p.x,p.y,p.size||2,p.size||2); }
    ctx.globalAlpha=1;
  }
  if(wp.length>80) wp.splice(0,wp.length-80);
}

// ── FLOATING DAMAGE NUMBERS ──────────────────────────────────
function floatDmg(el,text,color='#e05252'){
  if(!el) return;
  const rect=el.getBoundingClientRect();
  const d=document.createElement('div'); d.className='dmg-num'; d.textContent=text;
  d.style.cssText=`left:${Math.round(rect.left+rect.width/2-20)}px;top:${Math.round(rect.top+4)}px;color:${color}`;
  document.body.appendChild(d); setTimeout(()=>d.remove(),950);
}

// ── QUESTS ───────────────────────────────────────────────────
function questScaledQty(t){
  const lv=G.p.level||1;
  if(t.type==='kill')    return Math.max(5, Math.floor(5*Math.sqrt(lv)));
  if(t.type==='gold')    return Math.floor(50*lv);
  if(t.type==='step')    return Math.max(t.qty, Math.floor(t.qty*Math.sqrt(lv/5)));
  if(t.type==='craft')   return Math.max(t.qty, Math.floor(t.qty*Math.sqrt(lv/5)));
  if(t.type==='survive') return Math.max(t.qty, Math.floor(t.qty*Math.sqrt(lv/5)));
  return t.qty;
}
function generateQuests(){
  while(G.quests.length<3){
    const used=new Set(G.quests.map(q=>q.label));
    const av=QUEST_POOL.filter(q=>!used.has(q.label)); if(!av.length) break;
    const t=av[Math.floor(Math.random()*av.length)];
    const qty=questScaledQty(t);
    G.quests.push({...t,qty,progress:0});
  }
}

function tickQuestKill(id){
  let ch=false;
  G.quests.forEach(q=>{ if(q.type==='kill'&&(q.target===id||q.target==='any')&&q.progress<q.qty){q.progress++;ch=true;if(q.progress>=q.qty)addLog(`📜 Quest: ${(G.lang==='en'&&q.labelEn)?q.labelEn:q.label}!`);} });
  if(ch) updateQuestScreen();
}
function tickQuestStep(){
  let ch=false;
  G.quests.forEach(q=>{ if(q.type==='step'&&q.progress<q.qty){q.progress++;ch=true;if(q.progress>=q.qty)addLog(`📜 Quest: ${(G.lang==='en'&&q.labelEn)?q.labelEn:q.label}!`);} });
  if(ch) updateQuestScreen();
}
function tickQuestGold(g){
  let ch=false;
  G.quests.forEach(q=>{ if(q.type==='gold'&&q.progress<q.qty){q.progress=Math.min(q.qty,q.progress+g);ch=true;if(q.progress>=q.qty)addLog(`📜 Quest: ${(G.lang==='en'&&q.labelEn)?q.labelEn:q.label}!`);} });
  if(ch) updateQuestScreen();
}
function tickQuestCraft(){
  let ch=false;
  G.quests.forEach(q=>{ if(q.type==='craft'&&q.progress<q.qty){q.progress++;ch=true;if(q.progress>=q.qty)addLog(`📜 Quest: ${(G.lang==='en'&&q.labelEn)?q.labelEn:q.label}!`);} });
  if(ch) updateQuestScreen();
}
function tickQuestSurvive(){
  let ch=false;
  G.quests.forEach(q=>{ if(q.type==='survive'&&q.progress<q.qty){q.progress++;ch=true;if(q.progress>=q.qty)addLog(`📜 Quest: ${(G.lang==='en'&&q.labelEn)?q.labelEn:q.label}!`);} });
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
    const qlabel=(G.lang==='en'&&q.labelEn)?q.labelEn:q.label;
    card.innerHTML=`<div class="quest-title">${qlabel}</div><div class="quest-prog-wrap"><div class="quest-prog${done?' done':''}" style="width:${pct(q.progress,q.qty)}"></div></div><div class="quest-info"><span>${q.progress}/${q.qty}</span><span class="quest-reward">${rew.join('  ')}</span></div>${done?`<button class="quest-claim" onclick="claimQuest(${idx})">✅ CLAIM</button>`:''}`;
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
  G.daily.quests.forEach(q=>{ if(q.type==='kill'&&(q.target===id||q.target==='any')&&q.progress<q.qty){q.progress++;ch=true;if(q.progress>=q.qty)addLog(`⭐ ${G.lang==='en'?'Daily Quest':'Tagesquest'}: ${(G.lang==='en'&&q.labelEn)?q.labelEn:q.label}!`);} });
  if(ch){saveDailyQuests();updateDailyQuestScreen();}
}
function tickDailyStep(){
  if(!G.daily) return; let ch=false;
  G.daily.quests.forEach(q=>{ if(q.type==='step'&&q.progress<q.qty){q.progress++;ch=true;if(q.progress>=q.qty)addLog(`⭐ ${G.lang==='en'?'Daily Quest':'Tagesquest'}: ${(G.lang==='en'&&q.labelEn)?q.labelEn:q.label}!`);} });
  if(ch){saveDailyQuests();updateDailyQuestScreen();}
}
function tickDailyGold(g){
  if(!G.daily) return; let ch=false;
  G.daily.quests.forEach(q=>{ if(q.type==='gold'&&q.progress<q.qty){q.progress=Math.min(q.qty,q.progress+g);ch=true;if(q.progress>=q.qty)addLog(`⭐ ${G.lang==='en'?'Daily Quest':'Tagesquest'}: ${(G.lang==='en'&&q.labelEn)?q.labelEn:q.label}!`);} });
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
    const dqlabel=(G.lang==='en'&&q.labelEn)?q.labelEn:q.label;
    card.innerHTML=`<div class="quest-title">⭐ ${dqlabel}</div><div class="quest-prog-wrap"><div class="quest-prog${done?' done':''}" style="width:${pct(q.progress,q.qty)}"></div></div><div class="quest-info"><span>${q.progress}/${q.qty}</span><span class="quest-reward">${rew.join('  ')}</span></div>`;
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
  const icons={weapon:'🗡',armor:'🛡',acc:'💍',pet:'🐾',helm:'🪖',gloves:'🧤',boots:'👢'};
  for(const sl of ['weapon','armor','acc','pet','helm','gloves','boots']){
    const el=document.getElementById(`eq-${sl}`); if(!el) continue;
    const eq=p.eq[sl];
    const invSlot=eq?p.inv.find(i=>i.id===eq.id&&i.equipped):null;
    const upg=invSlot&&invSlot._upgrade?` +${invSlot._upgrade}`:'';
    const rune=invSlot&&invSlot._rune?` ${ITEMS[invSlot._rune]?.icon||''}`:'' ;
    const enc=invSlot&&invSlot._enchant?' ✨':'';
    el.innerHTML=`${icons[sl]} <span>${eq?iname(eq.id)+upg+rune+enc:t('equip_empty')}</span>`;
  }
  const clEl=document.getElementById('s-class');
  if(clEl){
    let ct=p.class?`${CLASSES[p.class].icon} ${CLASSES[p.class].name}`:'–';
    if(p.subclass&&SUBCLASSES[p.subclass]) ct+=` › ${SUBCLASSES[p.subclass].icon} ${SUBCLASSES[p.subclass].name}`;
    clEl.textContent=ct;
  }
  // active item sets
  const equippedIds=Object.values(p.eq).filter(Boolean).map(e=>e.id);
  const setSel=document.getElementById('s-sets');
  if(setSel) setSel.textContent=ITEM_SETS.filter(s=>s.pieces.every(id=>equippedIds.includes(id))).map(s=>s.label).join(', ')||'–';
  updateInvScreen();
}

function applyLang(){
  // Nav buttons
  const navKeys=['nav_explore','nav_quests','nav_char','nav_shop'];
  document.querySelectorAll('#bottom-nav .nav-btn small').forEach((el,i)=>{
    if(navKeys[i]) el.textContent=t(navKeys[i]);
  });
  // Explore button
  const eb=document.getElementById('explore-btn');
  if(eb&&!eb.disabled) eb.textContent=t('btn_explore');
  // Boss button
  const bb=document.getElementById('boss-btn');
  if(bb) bb.textContent=t('btn_boss');
  // Step counter label
  const sc=document.getElementById('step-counter');
  if(sc&&sc.childNodes[0]) sc.childNodes[0].textContent=t('step_counter')+': ';
  // Combat buttons
  const ba=document.getElementById('btn-attack');
  if(ba) ba.textContent=t('btn_attack');
  const bfl=document.querySelector('#combat-btns .cbtn:nth-child(4)');
  if(bfl) bfl.textContent=t('btn_flee');
  // Auto battle button
  const abBtn=document.getElementById('auto-battle-btn');
  if(abBtn) abBtn.textContent=G.autoBattle?t('btn_auto_on'):t('btn_auto_off');
  // Inventory tip
  const it=document.getElementById('inv-tip');
  if(it) it.textContent=t('inv_tip');
  // Quest hint
  const qh=document.getElementById('quest-hint');
  if(qh) qh.textContent=t('quest_hint');
  // Quest daily header
  const qdh=document.querySelector('#daily-header h2');
  if(qdh) qdh.textContent=t('quest_daily');
  // Daily bonus button
  const dbb=document.getElementById('daily-bonus-btn');
  if(dbb) dbb.textContent=t('quest_claim');
  // Character screen headings
  document.querySelectorAll('#screen-char h2').forEach(h=>{if(/Charakter|Character/.test(h.textContent)) h.textContent=t('char_title');});
  document.querySelectorAll('#screen-char h3').forEach(h=>{
    if(/Ausrüstung|Equipment/.test(h.textContent)) h.textContent=t('char_equip');
    else if(/Inventar|Inventory/.test(h.textContent)&&h.childNodes[0]) h.childNodes[0].textContent=t('char_inv')+' ';
  });
  // Stat row labels in character screen
  const keyMap={'Level':'char_lv','XP':'char_xp','HP':'char_hp','MP':'char_mp','ATK':'char_atk','DEF':'char_def','MaxHP':'char_maxhp','MaxMP':'char_maxmp','Kills':'char_kills','Klasse':'char_class','Class':'char_class','Modus':'char_mode','Mode':'char_mode'};
  document.querySelectorAll('#screen-char .stat-row').forEach(row=>{
    const spans=row.querySelectorAll('span');
    if(spans.length>=1){const txt=spans[0].textContent.trim();const key=keyMap[txt];if(key) spans[0].textContent=t(key);}
  });
  // Equipment empty slots
  document.querySelectorAll('.equip-row span').forEach(span=>{
    if(span.textContent==='Leer'||span.textContent==='Empty') span.textContent=t('equip_empty');
  });
  // Shop tabs
  const stabs=document.querySelectorAll('.stab');
  if(stabs[0]) stabs[0].textContent=t('shop_buy');
  if(stabs[1]) stabs[1].textContent=t('shop_sell');
  // Stat points banner
  const spb=document.getElementById('stat-points-banner');
  if(spb){const sc2=document.getElementById('sp-count');const cnt=sc2?sc2.textContent:'';spb.innerHTML=`⭐ <span id="sp-count">${cnt}</span> ${t('stat_points')}`;}
  // Mode / Hardcore label in char screen
  const hcEl=document.getElementById('s-hardcore');
  if(hcEl) hcEl.textContent=G.hardcore?t('char_hardcore'):t('char_normal');
}

function getCurrentMilestone() {
  const p = G.p; const lv = p.level; const kills = p.kills;
  if (!p.class) return { text: t('ms_pick_class'), icon: '⚔' };
  if (lv < 5)   return { text: t('ms_reach_lv5'), icon: '⬆', sub: `LV ${lv}/5` };
  if (lv < 10)  return { text: t('ms_explore_cave'), icon: '🦇', sub: `LV ${lv}/10` };
  if (lv < 15)  return { text: t('ms_reach_lv15'), icon: '⬆', sub: `LV ${lv}/15` };
  if (lv < 20)  return { text: t('ms_dungeon'), icon: '⛏', sub: `LV ${lv}/20` };
  if (!p.class || p.class === 'warrior') return { text: t('ms_pick_subclass'), icon: '🌟' };
  if (lv < 30)  return { text: t('ms_graveyard'), icon: '💀', sub: `LV ${lv}/30` };
  if (lv < 40)  return { text: t('ms_castle'), icon: '🏰', sub: `LV ${lv}/40` };
  if (lv < 50)  return { text: t('ms_reach_lv50'), icon: '⬆', sub: `LV ${lv}/50` };
  if (!G.kingDefeated) return { text: t('ms_shadow_king'), icon: '💀', sub: `LV ${lv}` };
  if (!(p.prestige)) return { text: t('ms_prestige'), icon: '⭐' };
  return { text: t('ms_legend'), icon: '👑', sub: `Prestige ${p.prestige}` };
}

function refresh(){
  updateHUD(); updateCharScreen(); updateQuestScreen();
  if(G.combat) updateCombatUI();
  const mb = document.getElementById('milestone-bar');
  if (mb) {
    const m = getCurrentMilestone();
    mb.innerHTML = `<span style="color:var(--dim);font-size:5px">NEXT: </span><span style="font-size:6px;color:var(--accent)">${m.icon} ${m.text}</span>${m.sub?`<span style="font-size:5px;color:var(--dim)"> · ${m.sub}</span>`:''}`;
  }
  applyLang();
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
  if(name==='char')   {updateCharScreen();drawPlayer(document.getElementById('char-canvas'));}
  if(name==='explore'){drawPlayer(document.getElementById('player-canvas'));drawBackground(G.area.id);}
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

// ── AUTO-BATTLE ───────────────────────────────────────────────
function toggleAutoBattle(){
  G.autoBattle=!G.autoBattle;
  const btn=document.getElementById('auto-battle-btn');
  if(btn) btn.textContent=G.autoBattle?t('btn_auto_on'):t('btn_auto_off');
  if(G.autoBattle && G.combat){
    window._autoBattleInterval=setInterval(()=>{
      if(!G.combat||!G.autoBattle){clearInterval(window._autoBattleInterval);return;}
      combatAction('attack');
    },900);
  } else {
    clearInterval(window._autoBattleInterval);
  }
}

// ── BANK / STASH ─────────────────────────────────────────────
function showBank(){
  const p=G.p;
  const invRows=p.inv.map((it,i)=>{
    const item=ITEMS[it.id]; if(!item||it.equipped) return '';
    return `<div class="shop-row" style="font-size:7px">
      <span class="shop-icon">${item.icon}</span>
      <span class="shop-info"><div class="shop-name">${iname(it.id)}</div></span>
      <button class="shop-btn" onclick="bankDeposit(${i})">Einlagern</button>
    </div>`;
  }).join('');
  const bankRows=G.bank.map((it,i)=>{
    const item=ITEMS[it.id]; if(!item) return '';
    return `<div class="shop-row" style="font-size:7px">
      <span class="shop-icon">${item.icon}</span>
      <span class="shop-info"><div class="shop-name">${iname(it.id)}</div></span>
      <button class="shop-btn" onclick="bankWithdraw(${i})">Abheben</button>
    </div>`;
  }).join('');
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:290px;max-width:90vw;max-height:85vh;overflow-y:auto;text-align:left">
    <div style="text-align:center;color:var(--accent);font-size:9px;margin-bottom:10px">🏦 TRESOR (${G.bank.length}/30)</div>
    <div style="font-size:7px;color:var(--dim);margin-bottom:6px">Inventar → Tresor</div>
    ${invRows||'<div style="font-size:6px;color:var(--dim);padding:8px">Kein Inventar</div>'}
    <div style="font-size:7px;color:var(--dim);margin:10px 0 6px">Tresor → Inventar</div>
    ${bankRows||'<div style="font-size:6px;color:var(--dim);padding:8px">Tresor leer</div>'}
    <br><button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:inherit;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}
function bankDeposit(idx){
  if(G.bank.length>=30){showOverlay('❌ Tresor voll!');return;}
  const it=G.p.inv.splice(idx,1)[0];
  G.bank.push(it);
  document.getElementById('overlay')?.remove();
  showBank(); refresh();
}
function bankWithdraw(idx){
  if(G.p.inv.length>=30){showOverlay('❌ Inventar voll!');return;}
  const it=G.bank.splice(idx,1)[0];
  G.p.inv.push(it);
  document.getElementById('overlay')?.remove();
  showBank(); refresh();
}

// ── TALENT TREE ───────────────────────────────────────────────
function showTalentTree(){
  const p=G.p;
  const rows=TALENT_NODES.map(n=>{
    const lv=p.talents[n.id]||0;
    const canLearn=p.talentPoints>=n.cost&&lv<n.maxLv;
    return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:14px">${n.icon}</span>
      <div style="flex:1">
        <div style="font-size:7px;color:var(--text)">${n.name} ${lv>0?'['+lv+'/'+n.maxLv+']':''}</div>
        <div style="font-size:6px;color:var(--dim)">${n.desc}</div>
      </div>
      <button onclick="learnTalent('${n.id}')" ${canLearn?'':'disabled'} style="background:${canLearn?'var(--accent)':'var(--border)'};color:${canLearn?'var(--bg)':'var(--dim)'};border:none;padding:4px 8px;font-family:inherit;font-size:6px;cursor:${canLearn?'pointer':'default'}">${n.cost}⭐</button>
    </div>`;
  }).join('');
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:290px;max-width:90vw;max-height:85vh;overflow-y:auto;text-align:left">
    <div style="text-align:center;color:var(--accent);font-size:9px;margin-bottom:8px">🌟 TALENTBAUM — ${p.talentPoints} Punkte</div>
    ${rows}
    <br><button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:inherit;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}
function learnTalent(id){
  const node=TALENT_NODES.find(n=>n.id===id); if(!node) return;
  const lv=G.p.talents[id]||0;
  if(G.p.talentPoints<node.cost||lv>=node.maxLv) return;
  G.p.talentPoints-=node.cost;
  G.p.talents[id]=(lv+1);
  SFX.levelUp();
  document.getElementById('overlay')?.remove();
  showTalentTree(); refresh();
}

// ── BOSS RUSH ─────────────────────────────────────────────────
function startBossRush(){
  if(G.combat){showOverlay('❌ Beende zuerst den Kampf!');return;}
  G.bossRush={round:0,score:0};
  addLog('⚡ Boss Rush gestartet!');
  showScreen('combat'); bossRushNext();
}
function bossRushNext(){
  const seq=BOSS_RUSH_SEQ;
  const round=G.bossRush.round;
  if(round>=seq.length){bossRushComplete();return;}
  const foeId=seq[round];
  const foe=FOES[foeId]; if(!foe) return;
  G.bossRush.round++;
  const hp=Math.floor(foe.hp*1.5); // harder versions
  G.combat={
    foe:{...foe,id:foeId,hp,maxHp:hp,statusEffects:[]},
    playerStatus:[],turn:1,combo:0,fled:false,
  };
  showScreen('combat');
  updateCombatUI();
  addLog(`⚡ Boss Rush Runde ${round+1}: ${foe.name}!`);
  drawSprite(document.getElementById('enemy-canvas'),foe.sprite||foeId);
  drawBackground(G.area.id,true);
}
function bossRushComplete(){
  const score=G.bossRush.score||0;
  G.bossRush=null;
  SFX.levelUp(); SFX.levelUp();
  showOverlay(`⚡ BOSS RUSH ABGESCHLOSSEN!\n🏆 Score: ${score}\n\n+500 Gold!`);
  earnGold(500); addLog(`⚡ Boss Rush abgeschlossen! Score: ${score}`); refresh();
}

// ── SPEEDRUN ──────────────────────────────────────────────────
function startSpeedrun(){
  if(G.p.level>1){showOverlay('❌ Speedrun nur auf LV1 startbar! Prestige zuerst.');return;}
  G.speedrun={active:true,startTime:Date.now(),bestTime:G.speedrun.bestTime||null};
  G.p.level=1;G.p.xp=0;G.p.xpNext=100;G.p.kills=0;G.kingDefeated=false;
  addLog('⏱ Speedrun gestartet! Ziel: LV20 + König besiegen!');
  const el=document.getElementById('speedrun-timer');
  if(el) el.style.display='block';
  window._speedrunInterval=setInterval(updateSpeedrunTimer,1000);
  refresh();
}
function updateSpeedrunTimer(){
  if(!G.speedrun.active){clearInterval(window._speedrunInterval);return;}
  const el=document.getElementById('speedrun-timer');
  if(!el) return;
  const elapsed=Math.floor((Date.now()-G.speedrun.startTime)/1000);
  const m=Math.floor(elapsed/60).toString().padStart(2,'0');
  const s=(elapsed%60).toString().padStart(2,'0');
  el.textContent=`⏱ ${m}:${s}`;
}
function checkSpeedrunComplete(){
  if(!G.speedrun.active) return;
  if(G.p.level>=20&&G.kingDefeated){
    clearInterval(window._speedrunInterval);
    const elapsed=Math.floor((Date.now()-G.speedrun.startTime)/1000);
    const m=Math.floor(elapsed/60).toString().padStart(2,'0');
    const s=(elapsed%60).toString().padStart(2,'0');
    const isNewBest=!G.speedrun.bestTime||elapsed<G.speedrun.bestTime;
    if(isNewBest) G.speedrun.bestTime=elapsed;
    G.speedrun.active=false;
    const el=document.getElementById('speedrun-timer');if(el) el.style.display='none';
    SFX.levelUp();SFX.levelUp();
    showOverlay(`⏱ SPEEDRUN ABGESCHLOSSEN!\n🕐 Zeit: ${m}:${s}${isNewBest?'\n🏆 NEUER REKORD!':'\n(Best: '+Math.floor(G.speedrun.bestTime/60)+'m'+(G.speedrun.bestTime%60)+'s)'}`);
  }
}

// ── COMPANIONS ────────────────────────────────────────────────
function showCompanions(){
  const comp=G.companion;
  const hireRows=Object.entries(COMPANIONS).map(([id,c])=>{
    const active=comp&&comp.id===id;
    return `<div class="shop-row">
      <span class="shop-icon">${c.icon}</span>
      <div class="shop-info">
        <div class="shop-name">${c.name}${active?' (aktiv)':''}</div>
        <div class="shop-stat">HP:${c.maxHp} ATK:${c.atk}${c.heals?' Heilt':''}${active?' HP:'+comp.hp:''}  </div>
      </div>
      ${active?`<button class="shop-btn" onclick="hireCompanion(null)">Entlassen</button>`:`<button class="shop-btn" onclick="hireCompanion('${id}')" ${G.p.gold<c.goldCost?'disabled':''}>🪙${c.goldCost}</button>`}
    </div>`;
  }).join('');
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:290px;max-width:90vw;max-height:85vh;overflow-y:auto;text-align:left">
    <div style="text-align:center;color:var(--accent);font-size:9px;margin-bottom:10px">🧑‍🤝‍🧑 GEFÄHRTEN</div>
    ${hireRows}
    <br><button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:inherit;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}
function hireCompanion(id){
  if(!id){G.companion=null;document.getElementById('overlay')?.remove();showCompanions();addLog('👋 Gefährte entlassen.');refresh();return;}
  const c=COMPANIONS[id]; if(!c) return;
  if(G.p.gold<c.goldCost){showOverlay('❌ Zu wenig Gold!');return;}
  G.p.gold-=c.goldCost;
  G.companion={...c,id,hp:c.maxHp};
  document.getElementById('overlay')?.remove();
  addLog(`${c.icon} ${c.name} angeheuert!`);
  showCompanions(); refresh();
}

// ── DAILY DUNGEON ─────────────────────────────────────────────
function showDailyDungeon(){
  const today=new Date().toDateString();
  const cleared=G.daily&&G.daily.dungeonDate===today&&G.daily.dungeonCleared;
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:270px;text-align:center">
    🏰 TAGESDUNGEON<br><br>
    <span style="font-size:7px;color:var(--dim)">Täglicher 5-Kampf-Dungeon mit Bonusbelohnung!</span><br><br>
    ${cleared
      ?'<span style="color:var(--green);font-size:8px">✅ Heute abgeschlossen!</span>'
      :`<button onclick="startDailyDungeon()" style="width:100%;background:var(--accent);color:var(--bg);border:none;padding:10px;font-family:inherit;font-size:8px;cursor:pointer">⚔ STARTEN</button>`
    }<br><br>
    <button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:inherit;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}
function startDailyDungeon(){
  document.getElementById('overlay')?.remove();
  G.dungeon={floors:5,current:1,bonus:true};
  addLog('🏰 Tagesdungeon betreten!');
  showScreen('explore'); doStep();
}

// ── BESTIARY REWARD ───────────────────────────────────────────
function checkBestiaryReward(foeId) {
  const b = G.bestiary[foeId]; if (!b) return;
  if (!G.p.bestiaryRewarded) G.p.bestiaryRewarded = {};
  const prev = G.p.bestiaryRewarded[foeId] || 0;
  const REWARDS = [{kills:10,baseAtk:1,label:'+1 ATK'},{kills:25,baseDef:1,label:'+1 DEF'},{kills:50,maxHp:10,label:'+10 MaxHP'}];
  for (const r of REWARDS) {
    if (b.killed >= r.kills && prev < r.kills) {
      G.p.bestiaryRewarded[foeId] = r.kills;
      if (r.baseAtk) G.p.baseAtk += r.baseAtk;
      if (r.baseDef) G.p.baseDef += r.baseDef;
      if (r.maxHp)  { G.p.maxHp += r.maxHp; G.p.hp += r.maxHp; }
      addLog(`📖 Bestiarium: ${FOES[foeId]?.name} ×${r.kills} → ${r.label}!`);
      SFX.levelUp();
    }
  }
}

// ── DAY/NIGHT ─────────────────────────────────────────────────
function updateDayNight() {
  const h = G.dayNight;
  const isNight = h >= 21 || h < 5;
  const sceneWrap = document.getElementById('scene-wrap');
  if (sceneWrap) sceneWrap.style.filter = isNight ? 'brightness(0.6) hue-rotate(30deg)' : '';
  const el = document.getElementById('daynightlbl');
  if (el) el.textContent = isNight ? '🌙 Nacht' : h < 12 ? '🌄 Morgen' : '☀️ Tag';
}

// ── SEASONAL EVENT ───────────────────────────────────────────
const SEASONAL_EVENTS = {
  spring: { name:'🌸 Frühlingsfest',  month:[3,4,5],  bonus:'×1.5 XP',   foe:'goblin',  icon:'🌸', reward:'battle_brew', rewardQty:3 },
  summer: { name:'☀ Sommerschlacht', month:[6,7,8],  bonus:'×1.5 Gold',  foe:'dragon',  icon:'☀', reward:'elixir',      rewardQty:4 },
  autumn: { name:'🍂 Erntedunkel',   month:[9,10,11],bonus:'+20% Drops',  foe:'skeleton',icon:'🍂', reward:'mana_crystal', rewardQty:2 },
  winter: { name:'❄ Winterfluch',   month:[12,1,2], bonus:'2× Drops',   foe:'ice_golem',icon:'❄', reward:'chaos_crystal',rewardQty:1 },
};

function getSeasonalEvent() {
  const m=new Date().getMonth()+1;
  return Object.values(SEASONAL_EVENTS).find(e=>e.month.includes(m))||SEASONAL_EVENTS.spring;
}

function showSeasonalDungeon() {
  const ev=getSeasonalEvent();
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.92);z-index:100';
  const foe=FOES[ev.foe]||FOES.goblin;
  wrap.innerHTML=`<div id="overlay-box" style="min-width:270px;text-align:center">
    <div style="font-size:12px;margin-bottom:6px">${ev.icon}</div>
    <div style="color:var(--accent);font-size:9px;margin-bottom:8px">${ev.name}</div>
    <div style="font-size:7px;color:var(--dim);margin-bottom:12px">Saisonales Event aktiv!<br>Bonus: ${ev.bonus}</div>
    <div style="font-size:7px;margin-bottom:14px">Gegner: ${foe.icon} ${foe.name}<br><span style="font-size:6px;color:var(--dim)">Belohnung: ${ITEMS[ev.reward]?.icon} ${ITEMS[ev.reward]?.name} ×${ev.rewardQty}</span></div>
    <button onclick="startSeasonalFight('${ev.foe}','${ev.reward}',${ev.rewardQty})" style="width:100%;background:var(--accent);color:var(--bg);border:none;padding:10px;font-family:'Press Start 2P',monospace;font-size:8px;cursor:pointer;margin-bottom:6px">${ev.icon} EVENT-KAMPF!</button>
    <button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}

function startSeasonalFight(foeId, rewardId, rewardQty) {
  document.getElementById('overlay')?.remove();
  const ev=getSeasonalEvent();
  startCombat(foeId, true);
  // Mark seasonal reward to give after win
  G.combat._seasonalReward={id:rewardId,qty:rewardQty,bonus:ev.bonus};
  addLog(`${ev.icon} ${ev.name}: Event-Kampf beginnt!`);
}

// ── GUILD ─────────────────────────────────────────────────────
const GUILD_RANKS = ['Neuling','Lehrling','Geselle','Meister','Champion','Legende'];
function showGuild() {
  const g = G.guild;
  if (!g) {
    const wrap = document.createElement('div'); wrap.id='overlay';
    wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
    wrap.innerHTML=`<div id="overlay-box" style="min-width:270px;text-align:center">
      🏛 GILDE<br><br>
      <span style="font-size:7px;color:var(--dim)">Tritt einer Gilde bei für tägliche Missionen und Belohnungen!</span><br><br>
      <button onclick="joinGuild('Drachentöter')" style="width:100%;background:var(--panel);border:1px solid var(--border);color:var(--text);padding:8px;font-family:inherit;font-size:7px;cursor:pointer;margin-bottom:4px">⚔ Drachentöter (Kampf)</button>
      <button onclick="joinGuild('Schatzhüter')" style="width:100%;background:var(--panel);border:1px solid var(--border);color:var(--text);padding:8px;font-family:inherit;font-size:7px;cursor:pointer;margin-bottom:4px">💰 Schatzhüter (Gold)</button>
      <button onclick="joinGuild('Waldläufer')" style="width:100%;background:var(--panel);border:1px solid var(--border);color:var(--text);padding:8px;font-family:inherit;font-size:7px;cursor:pointer;margin-bottom:8px">🌲 Waldläufer (Erkunden)</button>
      <button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:inherit;font-size:7px;cursor:pointer">✖ Schließen</button>
    </div>`;
    document.body.appendChild(wrap);
    return;
  }
  const rankName = GUILD_RANKS[Math.min(g.rank, GUILD_RANKS.length-1)];
  const xpToNext = (g.rank+1)*500;
  const wrap = document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:270px;text-align:left">
    <div style="text-align:center;color:var(--accent);font-size:9px;margin-bottom:10px">🏛 ${g.name}</div>
    <div style="font-size:7px;color:var(--dim);margin-bottom:6px">Rang: ${rankName} · Gilden-XP: ${g.xp}/${xpToNext}</div>
    <div style="height:6px;background:var(--border);margin-bottom:10px"><div style="height:100%;background:var(--accent);width:${Math.min(100,g.xp/xpToNext*100)}%"></div></div>
    <div style="font-size:7px;color:var(--dim)">Gilden-Bonus: ${g.name==='Drachentöter'?'+10% XP':g.name==='Schatzhüter'?'+10% Gold':'+1 Ressource/Step'}</div><br>
    <button onclick="document.getElementById('overlay').remove();claimGuildDaily()" style="width:100%;background:var(--green);color:var(--bg);border:none;padding:8px;font-family:inherit;font-size:7px;cursor:pointer;margin-bottom:6px">📦 Tagesbonus abholen</button>
    <button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:inherit;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}
function joinGuild(name) {
  G.guild = { name, xp:0, rank:0 };
  document.getElementById('overlay')?.remove();
  addLog(`🏛 Gilde "${name}" beigetreten!`); refresh();
  showGuild();
}
function claimGuildDaily() {
  if (!G.guild) return;
  const today = new Date().toDateString();
  if (G.guild.lastClaim === today) { showOverlay('❌ Heute bereits abgeholt!'); return; }
  G.guild.lastClaim = today;
  G.guild.xp += 100;
  if (G.guild.xp >= (G.guild.rank+1)*500) { G.guild.rank++; addLog(`🏛 Gilden-Rang: ${GUILD_RANKS[Math.min(G.guild.rank,GUILD_RANKS.length-1)]}!`); SFX.levelUp(); }
  const bonus = G.guild.name==='Drachentöter' ? ()=>{ gainXP(G.p.level*20); } :
                G.guild.name==='Schatzhüter'  ? ()=>{ earnGold(G.p.level*15); } :
                ()=>{ G.resources.wood+=2; G.resources.ore+=1; G.resources.herbs+=2; };
  bonus();
  addLog('🏛 Gilden-Tagesbonus erhalten!'); SFX.chest(); refresh();
}

// ── WORLD BOSS ────────────────────────────────────────────────
function triggerWorldBoss() {
  addLog('🌍 Der WELTENBEZWINGER erscheint! Ein mächtiger Feind!');
  SFX.boss(); SFX.boss();
  const wrap = document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:270px;text-align:center;border-color:#ff4444">
    ⚡ WELTENBEZWINGER ⚡<br><br>
    <span style="font-size:7px;color:var(--dim)">HP: ${WORLD_BOSS_DATA.hp} · ATK: ${WORLD_BOSS_DATA.atk}<br>Garantierte Legendary-Drops!</span><br><br>
    <button onclick="document.getElementById('overlay').remove();startWorldBoss()" style="width:100%;background:#2a0000;color:#ff4444;border:2px solid #cc0000;padding:10px;font-family:inherit;font-size:8px;cursor:pointer;margin-bottom:6px">⚔ KÄMPFEN</button>
    <button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:inherit;font-size:7px;cursor:pointer">🏃 Fliehen</button>
  </div>`;
  document.body.appendChild(wrap);
}
function startWorldBoss() {
  const d = WORLD_BOSS_DATA;
  G.combat = { id:d.id, isBoss:true, name:d.name, sprite:d.sprite, hp:d.hp, maxHp:d.hp, atk:d.atk, def:d.def, xp:d.xp, gold:d.gold, statusDef:d.status, drops:d.drops, playerTurn:true, playerStatus:[], enemyStatus:[], combo:0, isWorldBoss:true };
  enterCombatScreen(d.sprite, true, false);
}

// ── SAVE / LOAD ──────────────────────────────────────────────
function save(){
  try{localStorage.setItem('pq_save',JSON.stringify({
    p:G.p, steps:G.steps, quests:G.quests, kingDefeated:G.kingDefeated,
    achievements:G.achievements, bestiary:G.bestiary, dungeonClears:G.dungeonClears,
    battleStats:G.battleStats, lootFilter:G.lootFilter, hardcore:G.hardcore,
    bank:G.bank, resources:G.resources, companion:G.companion,
    speedrun:G.speedrun, storyShown:G.storyShown,
    guild:G.guild, dayNight:G.dayNight, heroSprite:G.heroSprite, worldBossSteps:G.worldBossSteps,
    difficulty:G.difficulty, tutorialStep:G.tutorialStep, tutorialDone:G.tutorialDone,
    prestigeCoins:G.prestigeCoins, prestigeUpgrades:G.prestigeUpgrades,
    battleHistory:G.battleHistory, dailyChallenge:G.dailyChallenge, storyChains:G.storyChains,
    invSort:G.invSort, lang:G.lang,
  }));}catch(_){}
}

function load(){
  try{
    const raw=localStorage.getItem('pq_save'); if(!raw) return false;
    const d=JSON.parse(raw); Object.assign(G.p,d.p);
    G.steps=d.steps||0; G.quests=d.quests||[]; G.kingDefeated=d.kingDefeated||false;
    G.achievements=d.achievements||[]; G.bestiary=d.bestiary||{}; G.dungeonClears=d.dungeonClears||0;
    G.battleStats=d.battleStats||{dmgDealt:0,dmgTaken:0,highCrit:0,won:0,fled:0,lost:0};
    if(G.battleStats.lost===undefined) G.battleStats.lost=0;
    G.lootFilter=d.lootFilter||'common'; G.hardcore=d.hardcore||false;
    G.bank=d.bank||[]; G.resources=d.resources||{wood:0,ore:0,herbs:0};
    G.companion=d.companion||null; G.speedrun=d.speedrun||{active:false,startTime:0,bestTime:null};
    G.storyShown=d.storyShown||[];
    G.guild=d.guild||null; G.dayNight=d.dayNight||6; G.heroSprite=d.heroSprite||'warrior';
    G.worldBossSteps=d.worldBossSteps||0;
    G.difficulty=d.difficulty||'normal'; G.tutorialStep=d.tutorialStep||99; G.tutorialDone=d.tutorialDone||false;
    G.prestigeCoins=d.prestigeCoins||0; G.prestigeUpgrades=d.prestigeUpgrades||{};
    G.battleHistory=d.battleHistory||[]; G.dailyChallenge=d.dailyChallenge||null; G.storyChains=d.storyChains||{};
    G.invSort=d.invSort||'none'; G.lang=d.lang||'en';
    if(!G.p.eq.pet) G.p.eq.pet=null;
    if(!G.p.subclass) G.p.subclass=null;
    if(!G.p.eq.helm) G.p.eq.helm=null;
    if(!G.p.eq.gloves) G.p.eq.gloves=null;
    if(!G.p.eq.boots) G.p.eq.boots=null;
    if(!G.p.talents) G.p.talents={};
    if(G.p.talentPoints===undefined) G.p.talentPoints=0;
    if(!G.p.bestiaryRewarded) G.p.bestiaryRewarded={};
    document.getElementById('step-val').textContent=G.steps; return true;
  }catch(_){return false;}
}

setInterval(save,15000);

// ── UTILS ────────────────────────────────────────────────────
function pct(v,max){return `${Math.min(100,Math.max(0,(v/max)*100))}%`;}
function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
function shake(el){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');}
function flashHit(el){el.classList.remove('hit-flash');void el.offsetWidth;el.classList.add('hit-flash');}
function flashEnemy(){const c=document.getElementById('enemy-canvas');if(!c)return;c.style.filter='brightness(3) saturate(0) sepia(1) hue-rotate(-30deg)';setTimeout(()=>{c.style.filter='';},120);}
function flashPlayer(){const c=document.getElementById('player-combat-canvas');if(!c)return;c.style.filter='brightness(0.4) sepia(1) hue-rotate(200deg)';setTimeout(()=>{c.style.filter='';},120);}

function toggleMute(){
  const muted = SFX.toggleMute();
  MUSIC.setMuted(muted);
  const btn = document.getElementById('mute-btn');
  if(btn) btn.textContent = muted ? '🔇' : '🔊';
}

// ── STORY CHAIN QUESTS ────────────────────────────────────────
function tickStoryChain(foeId, isBoss) {
  if (typeof STORY_CHAINS === 'undefined') return;
  for (const chain of STORY_CHAINS) {
    const state = G.storyChains[chain.id] = G.storyChains[chain.id] || {step:0, kills:{}};
    if (state.done) continue;
    const step = chain.steps[state.step];
    if (!step) continue;
    if (step.boss && !isBoss) continue;
    if (foeId === step.target) {
      state.kills[step.target] = (state.kills[step.target]||0)+1;
      if (state.kills[step.target] >= step.qty) {
        state.step++;
        const nextStep = chain.steps[state.step];
        if (!nextStep) {
          state.done = true;
          chain.rewards.forEach(r => addInv(r));
          gainXP(chain.xpBonus||0); earnGold(chain.goldBonus||0);
          SFX.victory();
          showOverlay(`🎉 ${chain.title}\nABGESCHLOSSEN!\n\n${chain.finalText}`);
          addLog(`📖 Quest-Kette "${chain.title}" abgeschlossen!`);
        } else {
          showOverlay(`📖 ${chain.title}\nSchritt ${state.step+1}/${chain.steps.length}\n\n${nextStep.story}`);
          addLog(`📖 ${chain.title}: ${nextStep.label}`);
        }
      }
    }
  }
}

function showStoryChains() {
  if (typeof STORY_CHAINS === 'undefined') { showOverlay('❌ Keine Quest-Ketten!'); return; }
  const rows = STORY_CHAINS.map(chain => {
    const state = G.storyChains[chain.id]||{step:0,kills:{}};
    const step = chain.steps[state.step];
    const done = state.done;
    const pct = done ? 100 : Math.floor((state.step/chain.steps.length)*100);
    return `<div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between;font-size:7px">
        <span style="color:${done?'var(--green)':'var(--accent)'}">${done?'✅':''} ${chain.title}</span>
        <span style="color:var(--dim);font-size:6px">${done?'Fertig!':state.step+'/'+chain.steps.length}</span>
      </div>
      ${!done&&step?`<div style="font-size:6px;color:var(--dim);margin-top:3px">${step.label} (${state.kills[step.target]||0}/${step.qty})</div>`:''}
      <div style="height:3px;background:var(--border);margin-top:4px"><div style="height:100%;background:${done?'var(--green)':'var(--accent)'};width:${pct}%"></div></div>
    </div>`;
  }).join('');
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:280px;max-width:90vw;max-height:82vh;overflow-y:auto">
    <div style="text-align:center;color:var(--accent);font-size:9px;margin-bottom:10px">📖 QUEST-KETTEN</div>
    ${rows}
    <br><button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}

// ── DAILY CHALLENGE ───────────────────────────────────────────
const DAILY_CHALLENGES = [
  { foe:'dragon',    name:'Drachen-Tag',     icon:'🐉', reward:'dragon_scale',   rewardQty:1, xp:800,  gold:400 },
  { foe:'demon',     name:'Dämon-Invasion',  icon:'😈', reward:'chaos_crystal',  rewardQty:1, xp:600,  gold:350 },
  { foe:'void_lich', name:'Lich-Auferstehung',icon:'💀',reward:'void_robe',      rewardQty:1, xp:1200, gold:600 },
  { foe:'dark_mage', name:'Magiertag',       icon:'🔮', reward:'mana_crystal',   rewardQty:2, xp:500,  gold:300 },
  { foe:'troll',     name:'Troll-Ansturm',   icon:'👹', reward:'berserker_axe',  rewardQty:1, xp:400,  gold:250 },
  { foe:'vampire',   name:'Vampir-Nacht',    icon:'🧛', reward:'magic_ring',     rewardQty:1, xp:450,  gold:280 },
];

function generateDailyChallenge() {
  const today = new Date().toDateString();
  const idx = Math.abs(today.split('').reduce((h,c)=>Math.imul(31,h)+c.charCodeAt(0)|0,0)) % DAILY_CHALLENGES.length;
  G.dailyChallenge = { ...DAILY_CHALLENGES[idx], date:today, done:false };
}

function showDailyChallenge() {
  if (!G.dailyChallenge || G.dailyChallenge.date !== new Date().toDateString()) generateDailyChallenge();
  const dc = G.dailyChallenge;
  const foe = FOES[dc.foe]||{}; const reward = ITEMS[dc.reward]||{};
  const wrap = document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.92);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:270px;text-align:center">
    <div style="font-size:11px;margin-bottom:4px">${dc.icon}</div>
    <div style="color:var(--accent);font-size:9px;margin-bottom:6px">TAGES-HERAUSFORDERUNG</div>
    <div style="color:var(--text);font-size:8px;margin-bottom:10px">${dc.name}</div>
    <div style="font-size:7px;color:var(--dim);margin-bottom:14px">
      Gegner: ${foe.icon||''} ${foe.name||dc.foe}<br>
      Belohnung: ${reward.icon||''} ${reward.name||dc.reward} ×${dc.rewardQty}<br>
      +${dc.xp} XP · +${dc.gold} Gold
    </div>
    ${dc.done
      ? '<div style="color:var(--green);font-size:8px;margin-bottom:12px">✅ Heute erledigt!</div>'
      : `<button onclick="startDailyChallengeFight()" style="width:100%;background:var(--accent);color:var(--bg);border:none;padding:10px;font-family:'Press Start 2P',monospace;font-size:8px;cursor:pointer;margin-bottom:6px">⚔ ANNEHMEN</button>`
    }
    <button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}

function startDailyChallengeFight() {
  document.getElementById('overlay')?.remove();
  const dc = G.dailyChallenge; if (!dc||dc.done) return;
  startCombat(dc.foe, true);
  G.combat._dailyChallenge = true;
  addLog(`${dc.icon} Tages-Herausforderung: ${dc.name}!`);
}

// ── CHIPTUNE MUSIC SYSTEM ─────────────────────────────────────
const MUSIC = (() => {
  let ac = null; let beatTimer = null; let muted = false; let beatIdx = 0;
  const MELODIES = {
    forest:     [262,294,330,294,262,294,349,330],
    cave:       [196,0,185,196,0,175,165,0],
    dungeon:    [220,233,220,208,196,208,220,0],
    graveyard:  [174,0,185,174,164,0,155,164],
    castle:     [262,247,233,247,262,294,247,0],
    volcanic:   [220,246,261,246,220,0,246,261],
    void:       [110,116,123,116,110,0,103,0],
    underwater: [220,246,276,246,220,196,0,196],
    sky:        [330,370,415,370,330,294,262,0],
    ice:        [196,220,247,220,196,175,0,175],
    void_rift:  [87,92,98,92,87,0,82,0],
  };
  function note(freq, dur) {
    if (!ac||!freq||muted) return;
    const o=ac.createOscillator(); const g=ac.createGain();
    o.type='square'; o.frequency.value=freq;
    g.gain.setValueAtTime(0.035, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime+dur);
    o.connect(g); g.connect(ac.destination);
    o.start(); o.stop(ac.currentTime+dur);
  }
  return {
    play(areaId) {
      if (!ac) { try { ac=new(window.AudioContext||window.webkitAudioContext)(); } catch(e){ return; } }
      this.stop(); if (muted) return;
      const m = MELODIES[areaId]||MELODIES.forest;
      beatIdx = 0;
      beatTimer = setInterval(()=>{ note(m[beatIdx%m.length], 0.2); beatIdx++; }, 320);
    },
    stop() { clearInterval(beatTimer); beatTimer=null; },
    setMuted(v) { muted=v; if(v) this.stop(); },
    get muted(){ return muted; },
  };
})();

// ── IDLE BOB ANIMATION ────────────────────────────────────────
(function startIdleBob(){
  let t=0; let frameId=null;
  function bob(){
    frameId=requestAnimationFrame(bob); t+=0.04;
    const y=Math.sin(t)*2;
    const pc=document.getElementById('player-canvas');
    if(pc) pc.style.transform=`translateY(${y}px)`;
    const cc=document.getElementById('char-canvas');
    if(cc) cc.style.transform=`translateY(${y}px)`;
  }
  bob();
})();

// ── INIT ─────────────────────────────────────────────────────
function init(){
  const hasSave=load();
  if(!loadDailyQuests()) generateDailyQuests();
  generateQuests(); updateArea(); refresh();
  drawPlayer(document.getElementById('player-canvas'));
  if(!G.p.inv.length){addInv('potion',true);addInv('wood_sword',true);}
  showTitleScreen();
  if(hasSave&&G.p.kills===0){const log=document.getElementById('log');if(!log||!log.children.length)addLog(t('log_start'));}
  if(!G.dailyChallenge||G.dailyChallenge.date!==new Date().toDateString()) generateDailyChallenge();
  updateDailyTimer();
  updateDayNight();
  setInterval(weatherTick, 80);
  const srEl=document.getElementById('speedrun-timer');
  if(srEl) srEl.style.display=G.speedrun.active?'block':'none';
  if(G.speedrun.active) window._speedrunInterval=setInterval(updateSpeedrunTimer,1000);
  applyLang();
  initSwipeGestures();
  initInstallBanner();
  MUSIC.play(G.area.id);
}

// ── SWIPE NAVIGATION ─────────────────────────────────────────
function initSwipeGestures() {
  const SCREENS = ['explore','quests','char','shop'];
  let tx=0, ty=0;
  const screens = document.getElementById('screens');
  if (!screens) return;
  screens.addEventListener('touchstart', e => { tx=e.touches[0].clientX; ty=e.touches[0].clientY; }, {passive:true});
  screens.addEventListener('touchend', e => {
    if (G.combat) return;
    const dx=e.changedTouches[0].clientX-tx;
    const dy=e.changedTouches[0].clientY-ty;
    if (Math.abs(dx)<Math.abs(dy)*1.5 || Math.abs(dx)<50) return;
    const cur=SCREENS.findIndex(s=>document.getElementById('screen-'+s)?.classList.contains('active'));
    const next=dx<0?Math.min(cur+1,SCREENS.length-1):Math.max(cur-1,0);
    if (next!==cur) { const btns=document.querySelectorAll('.nav-btn'); showScreen(SCREENS[next], btns[next]); }
  }, {passive:true});
}

// ── PWA INSTALL BANNER ────────────────────────────────────────
function initInstallBanner() {
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); deferredPrompt = e;
    const b = document.createElement('div'); b.id='install-banner';
    b.innerHTML=`<span style="flex:1">📲 Als App installieren!</span><button onclick="doInstall()">Installieren</button><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--dim);font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer;padding:4px">✖</button>`;
    document.body.appendChild(b);
    window._installPrompt = deferredPrompt;
  });
}
function doInstall() {
  if (window._installPrompt) { window._installPrompt.prompt(); document.getElementById('install-banner')?.remove(); }
}

// ── ENDGAME CHALLENGER MODE ───────────────────────────────────
function showChallenger() {
  const p = G.p; const cleared = G.kingDefeated;
  if (!cleared) { showOverlay('❌ Besiege zuerst den Shadow King!'); return; }
  const tier = Math.max(0, (p.prestige||0));
  const challenges = [
    { name:'Wächter-Prüfung',  mult:1.5, xp:2000, gold:1000, reward:'chaos_crystal' },
    { name:'Schattenwächter',  mult:2.0, xp:3500, gold:1800, reward:'void_robe' },
    { name:'Dimensionsherr',   mult:3.0, xp:5000, gold:2500, reward:'chaos_blade' },
    { name:'Ewiger Champion',  mult:4.0, xp:8000, gold:4000, reward:'crystal_crown' },
    { name:'Legendärer Titan', mult:6.0, xp:12000,gold:6000, reward:'celestial_bow' },
  ];
  const rows = challenges.map((c,i)=>{
    const done=(G.challengerCleared||0)>i;
    return `<div class="challenger-row${done?' challenger-active':''}">
      <span style="color:${done?'var(--green)':'var(--text)'}">${done?'✅ ':''} ${c.name}</span>
      <button onclick="startChallengerFight(${i})" ${done?'disabled':''} style="background:${done?'var(--panel)':'var(--accent)'};color:${done?'var(--dim)':'var(--bg)'};border:none;padding:5px 8px;font-family:'Press Start 2P',monospace;font-size:5px;cursor:${done?'default':'pointer'}">⚔ ${done?'Klar':'Kämpfen'}</button>
    </div>`;
  }).join('');
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.92);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:280px;max-width:90vw;text-align:center">
    <div style="color:var(--accent);font-size:9px;margin-bottom:4px">⚔ HERAUSFORDERER</div>
    <div style="font-size:6px;color:var(--dim);margin-bottom:12px">Endgame-Bosse für Legendäre Belohnungen</div>
    ${rows}
    <br><button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}

function startChallengerFight(idx) {
  document.getElementById('overlay')?.remove();
  const CHALL=[
    { foe:'dark_mage',   mult:1.5 },
    { foe:'chaos_dragon',mult:2.0 },
    { foe:'void_lich',   mult:3.0 },
    { foe:'blizzard_dragon',mult:4.0 },
    { foe:'deep_kraken', mult:6.0 },
  ];
  const c=CHALL[idx]; if(!c) return;
  startCombat(c.foe, true);
  G.combat._challengerIdx=idx;
  G.combat._challengerMult=c.mult;
  addLog(`⚔ Herausforderer Stufe ${idx+1}!`);
}

init();
