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
  const p = G.p; const prestige = p.prestige||0;
  let palette = prestige>=3 ? PRESTIGE_PALETTES[3] : prestige>=2 ? PRESTIGE_PALETTES[2] : prestige>=1 ? PRESTIGE_PALETTES[1] : null;
  if (!palette && G.heroSprite && G.heroSprite !== 'warrior') {
    const hp = HERO_PALETTES.find(h=>h.id===G.heroSprite);
    if (hp && hp.p) palette = hp.p;
  }
  drawSprite(canvas, 'player', 4, palette);
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
  battleStats: { dmgDealt:0, dmgTaken:0, highCrit:0, won:0, fled:0 },
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
};

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
    p.baseAtk+=1; p.baseDef+=1; p.maxHp+=10; p.maxMp+=3;
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
  document.getElementById('area-name').textContent = G.area.name;
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
  p.mp = Math.min(stats().maxMp, p.mp + 3);
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
    SFX.chest(); addLog(`📦 Schatzkiste! ${ITEMS[id].icon} ${ITEMS[id].name} gefunden!`); refresh();
  } else if (ev.t==='shrine') {
    const opts=[
      ()=>{ p.hp=stats().maxHp; addLog('⛩️ Heilschrein! HP vollständig geheilt.'); },
      ()=>{ p.mp=stats().maxMp; addLog('⛩️ Zauberschrein! MP vollständig.'); },
      ()=>{ const x=15*p.level; gainXP(x); addLog(`⛩️ Weisheitsschrein! +${x} XP.`); },
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
  const goldMult = isBoss?3 : isElite?3 : 1;
  const drops=(DROPS[foeId]||[]).map(d=>(isBoss||isElite)?{...d,p:Math.min(1,d.p*(isElite?2.5:3))}:d);
  G.combat={
    id:foeId, isBoss, isElite, name:(isElite?'⚡ ELITE ':isBoss?'⭐ ':'')+base.name, sprite:base.sprite,
    hp:Math.floor(base.hp*m), maxHp:Math.floor(base.hp*m),
    atk:Math.floor(base.atk*m), def:Math.floor(base.def*m),
    xp:Math.floor(base.xp*m*(isBoss?1.5:isElite?2:1)),
    gold:[base.gold[0]*goldMult, base.gold[1]*goldMult],
    drops, playerTurn:true, playerStatus:[], enemyStatus:[], combo:0,
    statusDef:base.status, isKing:false,
    atkBonus:0, atkBonusTurns:0, defBonus:0, defBonusTurns:0,
  };
  // bestiary
  if (!G.bestiary[foeId]) G.bestiary[foeId]={seen:0,killed:0};
  G.bestiary[foeId].seen++;
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
    shake(ec); flashHit(ec);
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
  if(crit){ combatLog(`💥 KRITISCH! ${totalDmg} Schaden!`); SFX.crit(); }
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
  // Boss phase 2
  if (!G.combat.phase2 && G.combat.isBoss && G.combat.hp < G.combat.maxHp * 0.5) {
    G.combat.phase2 = true;
    G.combat.atk = Math.floor(G.combat.atk * 1.5);
    combatLog(`💥 ${G.combat.name} Phase 2! ATK ×1.5!`);
    SFX.boss();
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
    // Evasion check
    if(s.evasion>0&&Math.random()<s.evasion){ combatLog('💨 Ausgewichen!'); }
    else {
      const crit=Math.random()<0.10;
      const nightMult = (G.dayNight >= 21 || G.dayNight < 5) ? 1.1 : 1;
      const dmg=Math.max(1,Math.floor((e.atk-s.def+rand(-2,2))*(crit?1.8:1)*nightMult));
      // Status resist
      const resisted=s.resist>0&&Math.random()<s.resist;
      p.hp-=dmg; G.battleStats.dmgTaken+=dmg;
      combatLog(`💢 ${e.name}: ${dmg}${crit?' Krit!':''}`);
      SFX.dmgTake();
      const pc=document.getElementById('player-combat-canvas');
      floatDmg(pc,'-'+dmg,'#e05252');
      shake(pc); flashHit(pc);
      if(!resisted&&e.statusDef&&Math.random()<e.statusDef.chance) applyStatus('player',e.statusDef.type,e.statusDef.turns,e.statusDef.value);
      else if(resisted&&e.statusDef) combatLog('💠 Status widerstanden!');
    }
  }
  updateCombatUI(); updateHUD();
  if(p.hp<=0){p.hp=0;defeatPlayer();return;}
  e.playerTurn=true; setCombatBtns(true);
}

function defeatPlayer(){
  combatLog('💀 Du wurdest besiegt...'); setCombatBtns(false);
  G.battleStats.fled++;
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
    LV ${G.p.level} · ${G.p.kills} Kills · ${G.steps} Steps</span><br><br>
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
  tickQuestKill(e.id); tickDailyKill(e.id);
  for(const drop of (e.drops||[])){ if(Math.random()<drop.p){ addInv(drop.id); const it=ITEMS[drop.id]; if(it) combatLog(`📦 ${it.rarity==='legendary'?'🌟':it.rarity==='epic'?'💜':''} ${it.name}!`); } }
  G.battleStats.won++;
  if(G.tutorialStep===1){G.tutorialStep=2;setTimeout(()=>showTutorialHint(1),600);}
  const xp=e.xp; const isKing=e.isKing;
  const isDungeon=!!G.dungeon; const isArena=!!G.arena; const isBossRush=!!G.bossRush;
  const sc=G.p.subclass?SUBCLASSES[G.p.subclass]:null;
  if(sc&&sc.healOnKill){ const h=Math.floor(stats().maxHp*0.08); G.p.hp=Math.min(stats().maxHp,G.p.hp+h); combatLog(`🛡 Paladin: +${h} HP`); }
  if(isBossRush) G.bossRush.score=(G.bossRush.score||0)+xp*2;
  setTimeout(()=>{
    endCombat();
    gainXP(xp);
    addLog(`✅ ${e.name} besiegt!`);
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
  document.getElementById('enemy-name-lbl').textContent =e.name;
  document.getElementById('enemy-hp-text').textContent  =`${Math.max(0,e.hp)}/${e.maxHp}`;
  document.getElementById('enemy-hp-bar').style.width   =pct(Math.max(0,e.hp),e.maxHp);
  document.getElementById('pcombat-hp-text').textContent=`${Math.max(0,p.hp)}/${s.maxHp}`;
  document.getElementById('pcombat-hp-bar').style.width =pct(Math.max(0,p.hp),s.maxHp);
  const cd=document.getElementById('combo-display');
  if(cd){const c=e.combo||0;cd.style.display=c>=2?'':'none';if(c>=2)cd.textContent=c>=5?`🔥 FEVER ×${c}!`:`🔥 COMBO ×${c}`;}
  renderStatusRow('enemy-status',e.enemyStatus);
  renderStatusRow('player-status',e.playerStatus);
}

function setCombatBtns(on){document.querySelectorAll('.cbtn').forEach(b=>b.disabled=!on);}

// ── NPC EVENTS ───────────────────────────────────────────────
function showMerchant() {
  const pool=Object.entries(ITEMS).filter(([,it])=>it.buyable);
  const picks=[];
  const tmp=[...pool];
  while(picks.length<3&&tmp.length){ picks.push(tmp.splice(Math.floor(Math.random()*tmp.length),1)[0]); }
  const btnStyle='display:block;width:100%;background:var(--panel);color:var(--text);border:1px solid var(--border);border-bottom:2px solid var(--accent2);padding:8px;margin-bottom:6px;font-family:\'Press Start 2P\',monospace;font-size:7px;cursor:pointer;text-align:left';
  const closeStyle='display:block;width:100%;background:var(--panel);color:var(--dim);border:1px solid var(--border);padding:8px;font-family:\'Press Start 2P\',monospace;font-size:7px;cursor:pointer';
  const wrap=document.createElement('div');
  wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.88);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:270px;max-width:90vw;text-align:center">
    🧙 Wanderhändler<br><br>
    <span style="font-size:7px;color:var(--dim)">Sonderangebote — 50% Rabatt!</span><br><br>
    ${picks.map(([id,it])=>`<button style="${btnStyle}" onclick="merchantBuy('${id}',${Math.ceil(it.value*0.75)})">${it.icon} ${it.name} &nbsp;${Math.ceil(it.value*0.75)}🪙<br><span style="color:var(--dim)">${it.rarity}</span></button>`).join('')}
    <button style="${closeStyle}" onclick="document.getElementById('overlay').remove()">🚶 Weiter</button>
  </div>`;
  document.body.appendChild(wrap);
}
function merchantBuy(id,price){
  if(G.p.gold<price){showOverlay('❌ Kein Gold!');return;}
  G.p.gold-=price; addInv(id); addLog(`🧙 ${ITEMS[id].icon} ${ITEMS[id].name} für ${price}🪙 gekauft!`);
  document.getElementById('overlay')?.remove(); refresh();
}
function showInn() {
  const p=G.p; const s=stats();
  const cost=Math.max(15,Math.floor(p.level*10));
  const missingHp=s.maxHp-p.hp; const missingMp=s.maxMp-p.mp;
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:260px;text-align:center">
    <div style="color:var(--accent);font-size:9px;margin-bottom:8px">🏠 WIRTSHAUS</div>
    <div style="font-size:7px;color:var(--dim);margin-bottom:10px">HP: ${p.hp}/${s.maxHp} · MP: ${p.mp}/${s.maxMp}</div>
    ${missingHp===0&&missingMp===0?`<div style="font-size:7px;color:var(--green);margin-bottom:10px">✓ Du bist bereits vollständig erholt!</div>`:`<div style="font-size:7px;color:var(--dim);margin-bottom:10px">Vollständige Erholung für <b style="color:var(--text)">${cost} 🪙</b></div>`}
    ${missingHp>0||missingMp>0?`<button onclick="doRest(${cost})" style="width:100%;background:var(--green);color:var(--bg);border:none;padding:10px;font-family:inherit;font-size:8px;cursor:pointer;margin-bottom:6px">💤 Ausruhen (${cost} 🪙)</button>`:''}
    <button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:inherit;font-size:7px;cursor:pointer">🚪 Verlassen</button>
  </div>`;
  document.body.appendChild(wrap);
}
function doRest(cost) {
  if(G.p.gold<cost){showOverlay('❌ Kein Gold!');return;}
  G.p.gold-=cost; const s=stats();
  G.p.hp=s.maxHp; G.p.mp=s.maxMp;
  SFX.heal();
  document.getElementById('overlay')?.remove();
  addLog(`🏠 Ausgeruht! HP und MP vollständig wiederhergestellt.`);
  refresh();
}

function showStranger(){
  const xp=Math.floor(20*G.p.level); const g=Math.floor(15*G.p.level);
  const btnStyle='display:block;width:100%;background:var(--panel);color:var(--text);border:1px solid var(--border);border-bottom:2px solid var(--accent2);padding:10px;margin-bottom:6px;font-family:\'Press Start 2P\',monospace;font-size:7px;cursor:pointer';
  const wrap=document.createElement('div');
  wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.88);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:260px;max-width:90vw;text-align:center">
    🤫 Mysteriöser Fremder<br><br>
    <span style="font-size:7px;color:var(--dim)">"Wähle weise, Held..."</span><br><br>
    <button style="${btnStyle}" onclick="strangerChoice('xp',${xp})">⭐ ${xp} Erfahrung</button>
    <button style="${btnStyle}" onclick="strangerChoice('gold',${g})">🪙 ${g} Gold</button>
  </div>`;
  document.body.appendChild(wrap);
}
function strangerChoice(type,val){
  document.getElementById('overlay')?.remove();
  if(type==='xp'){ gainXP(val); addLog(`🤫 Fremder schenkt dir ${val} XP!`); }
  else { earnGold(val); SFX.goldPickup(); addLog(`🤫 Fremder schenkt dir ${val} Gold!`); refresh(); }
}

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
  p.eq={weapon:null,armor:null,acc:null,pet:null,helm:null,gloves:null,boots:null}; p.inv=[];
  if(keptItem){ addInv(Object.keys(ITEMS).find(k=>ITEMS[k].name===keptItem.name)||'potion', true); }
  addInv('potion', true);
  G.steps=0; G.quests=[]; G.kingDefeated=false;
  generateQuests(); updateArea(); refresh();
  document.getElementById('step-val').textContent=0;
  saveHighscore(0,'Prestige');
  addLog(`⭐ Prestige ${p.prestige}! +${bonusAtk} ATK +${bonusDef} DEF Bonus. Abenteuer beginnt neu!`);
  showOverlay(`⭐ PRESTIGE ${p.prestige}\n+${bonusAtk} ATK\n+${bonusDef} DEF\nBasisbonus permanent!`);
  save();
}

// ── CLASS SELECTION ──────────────────────────────────────────
function showClassSelect() {
  if (G.p.class) return;
  const btnStyle='display:block;width:100%;background:var(--panel);color:var(--text);border:1px solid var(--border);border-bottom:3px solid var(--accent2);padding:12px 10px;margin-bottom:8px;font-family:\'Press Start 2P\',monospace;font-size:7px;cursor:pointer;text-align:left';
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.92);z-index:100';
  const opts=Object.entries(CLASSES).map(([id,cl])=>
    `<button style="${btnStyle}" onclick="chooseClass('${id}')">${cl.icon} ${cl.name}<br><span style="color:var(--dim);font-size:6px">${cl.desc}</span></button>`
  ).join('');
  wrap.innerHTML=`<div id="overlay-box" style="min-width:280px;max-width:90vw;text-align:center">
    ⚔ KLASSE WÄHLEN ⚔<br><br>
    <span style="font-size:6px;color:var(--dim)">LV 5 — Wähle deinen Weg!</span><br><br>
    ${opts}
  </div>`;
  document.body.appendChild(wrap);
}

function chooseClass(id) {
  document.getElementById('overlay')?.remove();
  G.p.class = id;
  const cl = CLASSES[id];
  addLog(`${cl.icon} Klasse: ${cl.name}! ${cl.desc}`);
  showOverlay(`${cl.icon} ${cl.name}!\n${cl.desc}`);
  refresh();
}

// ── ITEM UPGRADE ─────────────────────────────────────────────
function upgradeItem(idx) {
  const slot = G.p.inv[idx]; if (!slot || !slot.equipped) { showOverlay('❌ Item muss ausgerüstet sein!'); return; }
  const item = ITEMS[slot.id]; if (!item || !item.slot || item.slot==='pet') return;
  const upg = slot._upgrade||0;
  if (upg>=3) { showOverlay('❌ Bereits max. Upgrade!'); return; }
  const costs=[0,80,250,600];
  const cost=costs[upg+1];
  if (G.p.gold<cost) { showOverlay(`❌ Kein Gold!\nBenötigt: ${cost}🪙`); return; }
  G.p.gold-=cost; slot._upgrade=(upg+1);
  addLog(`✨ ${item.name} auf +${slot._upgrade} aufgewertet!`);
  refresh();
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

function dungeonNextRoom() {
  if (!G.dungeon) return;
  G.dungeon.room++;
  if (G.dungeon.room >= G.dungeon.maxRooms) {
    dungeonComplete();
  } else {
    addLog(`⛏ Raum ${G.dungeon.room+1}/${G.dungeon.maxRooms}...`);
    const foes = G.area.foes;
    setTimeout(()=>startCombat(foes[Math.floor(Math.random()*foes.length)], false), 1200);
  }
}

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

// ── SUBCLASS SELECTION ───────────────────────────────────────
function showSubclassSelect() {
  if (!G.p.class || G.p.subclass) return;
  const base = G.p.class;
  const opts = Object.entries(SUBCLASSES).filter(([,sc])=>sc.base===base);
  const btnStyle='display:block;width:100%;background:var(--panel);color:var(--text);border:1px solid var(--border);border-bottom:3px solid var(--accent2);padding:12px 10px;margin-bottom:8px;font-family:\'Press Start 2P\',monospace;font-size:7px;cursor:pointer;text-align:left';
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.92);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:280px;max-width:90vw;text-align:center">
    ⚡ SPEZIALISIERUNG ⚡<br><br>
    <span style="font-size:6px;color:var(--dim)">LV 15 — Wähle deinen Weg!</span><br><br>
    ${opts.map(([id,sc])=>`<button style="${btnStyle}" onclick="chooseSubclass('${id}')">${sc.icon} ${sc.name}<br><span style="color:var(--dim);font-size:6px">${sc.desc}</span></button>`).join('')}
  </div>`;
  document.body.appendChild(wrap);
}

function chooseSubclass(id) {
  document.getElementById('overlay')?.remove();
  G.p.subclass = id;
  const sc = SUBCLASSES[id];
  addLog(`${sc.icon} Spezialisierung: ${sc.name}! ${sc.desc}`);
  showOverlay(`${sc.icon} ${sc.name}!\n${sc.desc}`);
  refresh();
}

// ── RUNE SOCKET ───────────────────────────────────────────────
function showRuneMenu(invIdx) {
  const slot=G.p.inv[invIdx]; if(!slot||!slot.equipped) return;
  const item=ITEMS[slot.id]; if(!item||item.slot==='pet'||item.slot==='rune') return;
  const runes=G.p.inv.filter((s,i)=>ITEMS[s.id]&&ITEMS[s.id].slot==='rune'&&i!==invIdx);
  const current=slot._rune?ITEMS[slot._rune]:null;
  const btnStyle='display:block;width:100%;background:var(--panel);color:var(--text);border:1px solid var(--border);padding:8px;margin-bottom:5px;font-family:\'Press Start 2P\',monospace;font-size:6px;cursor:pointer;text-align:left';
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:260px;max-width:90vw;text-align:center">
    💎 RUNE EINSETZEN<br><span style="font-size:6px;color:var(--dim)">${item.name}${current?` · aktuell: ${current.name}`:' · leer'}</span><br><br>
    ${runes.length?runes.map((s,ri)=>{const r=ITEMS[s.id];const parts=[];if(r.atk)parts.push(`+${r.atk}ATK`);if(r.def)parts.push(`+${r.def}DEF`);if(r.maxMp)parts.push(`+${r.maxMp}MP`);if(r.critBonus)parts.push(`+${Math.round(r.critBonus*100)}%Krit`);return `<button style="${btnStyle}" onclick="socketRune(${invIdx},${G.p.inv.indexOf(s)})">${r.icon} ${r.name}<span style="color:var(--dim);font-size:5px"> ${parts.join(' ')}</span></button>`;}).join(''):'<div style="font-size:7px;color:var(--dim);padding:8px">Keine Runen im Inventar.</div>'}
    ${current?`<button style="${btnStyle};color:var(--red)" onclick="removeRune(${invIdx})">✖ Rune entfernen</button>`:''}
    <button onclick="document.getElementById('overlay').remove()" style="background:none;border:none;color:var(--dim);font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}

function socketRune(itemIdx, runeIdx) {
  const slot=G.p.inv[itemIdx]; const runeSlot=G.p.inv[runeIdx];
  if(!slot||!runeSlot) return;
  if(slot._rune){ const oldRune={id:slot._rune,qty:1}; G.p.inv.push(oldRune); }
  slot._rune=runeSlot.id;
  runeSlot.qty=(runeSlot.qty||1)-1; if(runeSlot.qty<=0) G.p.inv.splice(runeIdx,1);
  addLog(`💎 ${ITEMS[runeSlot.id].name} in ${ITEMS[slot.id].name} eingesetzt!`);
  document.getElementById('overlay')?.remove(); refresh();
}

function removeRune(itemIdx) {
  const slot=G.p.inv[itemIdx]; if(!slot||!slot._rune) return;
  addInv(slot._rune, true); slot._rune=null;
  addLog('💎 Rune entfernt.'); document.getElementById('overlay')?.remove(); refresh();
}

// ── ENCHANTING ────────────────────────────────────────────────
function showEnchantMenu(invIdx) {
  const slot=G.p.inv[invIdx]; if(!slot||!slot.equipped) return;
  const item=ITEMS[slot.id]; if(!item||item.slot==='pet'||item.slot==='rune') return;
  const elixirs=G.p.inv.filter(s=>s.id==='elixir');
  const total=elixirs.reduce((s,e)=>s+(e.qty||1),0);
  const current=slot._enchant;
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:250px;max-width:90vw;text-align:center">
    ✨ VERZAUBERN<br><span style="font-size:6px;color:var(--dim)">${item.name}${current?` · Bonus: +${current.val} ${current.stat}`:'· keine Verzauberung'}</span><br><br>
    <span style="font-size:7px;color:var(--dim)">Kostet 1 Elixier (du hast: ${total})</span><br><br>
    ${total>0?`<button onclick="doEnchant(${invIdx})" style="display:block;width:100%;background:var(--panel);color:var(--accent);border:1px solid var(--accent);border-bottom:2px solid var(--accent2);padding:10px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer;margin-bottom:8px">✨ Zufällig verzaubern</button>`:'<div style="font-size:7px;color:var(--dim);padding:8px">Kein Elixier!</div>'}
    <button onclick="document.getElementById('overlay').remove()" style="background:none;border:none;color:var(--dim);font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}

function doEnchant(invIdx) {
  const slot=G.p.inv[invIdx]; if(!slot) return;
  const elixirSlot=G.p.inv.find(s=>s.id==='elixir'); if(!elixirSlot) return;
  elixirSlot.qty=(elixirSlot.qty||1)-1; if(elixirSlot.qty<=0) G.p.inv.splice(G.p.inv.indexOf(elixirSlot),1);
  const stats_opts=['atk','def','maxHp','maxMp'];
  const stat=stats_opts[Math.floor(Math.random()*stats_opts.length)];
  const val=rand(3,9);
  slot._enchant={stat,val};
  const enchObj={};enchObj[stat]=val;slot._enchant=enchObj;
  addLog(`✨ ${ITEMS[slot.id].name} verzaubert! +${val} ${stat.toUpperCase()}`);
  document.getElementById('overlay')?.remove(); refresh();
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

// ── SMITH NPC ─────────────────────────────────────────────────
function showSmith() {
  const equipped=Object.values(G.p.eq).filter(e=>e&&e.slot!=='pet');
  const btnStyle='display:block;width:100%;background:var(--panel);color:var(--text);border:1px solid var(--border);border-bottom:2px solid var(--accent2);padding:8px;margin-bottom:5px;font-family:\'Press Start 2P\',monospace;font-size:6px;cursor:pointer;text-align:left';
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.88);z-index:100';
  const costs=[0,60,180,450];
  const rows=equipped.map(item=>{
    const invSlot=G.p.inv.find(i=>i.id===item.id&&i.equipped); if(!invSlot) return '';
    const upg=invSlot._upgrade||0; const idx=G.p.inv.indexOf(invSlot);
    const cost=costs[upg+1]||0;
    return upg<3?`<button style="${btnStyle}" onclick="upgradeItem(${idx});document.getElementById('overlay').remove()">${item.icon} ${item.name} +${upg}→+${upg+1} · ${cost}🪙</button>`:`<div style="font-size:6px;color:var(--accent);padding:4px">${item.icon} ${item.name} MAX</div>`;
  }).join('');
  wrap.innerHTML=`<div id="overlay-box" style="min-width:260px;max-width:90vw;text-align:center">
    🔨 Wanderschmied<br><br>${rows||'<div style="font-size:7px;color:var(--dim)">Nichts ausgerüstet.</div>'}
    <button onclick="document.getElementById('overlay').remove()" style="margin-top:8px;background:none;border:1px solid var(--border);color:var(--dim);padding:6px 16px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer">🚶 Weiter</button>
  </div>`;
  document.body.appendChild(wrap);
}

// ── ORACLE NPC ────────────────────────────────────────────────
function showOracle() {
  const foePool=G.area.foes; const foeId=foePool[Math.floor(Math.random()*foePool.length)];
  const drops=DROPS[foeId]||[]; const top=drops.slice().sort((a,b)=>b.p-a.p)[0];
  const hint=top?`${ITEMS[top.id]?.icon||'?'} ${ITEMS[top.id]?.name||'?'} von ${FOES[foeId]?.name||foeId}`:'Nichts...';
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.88);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="text-align:center;min-width:240px;max-width:90vw">
    🔮 Das Orakel spricht...<br><br>
    <span style="font-size:7px;color:var(--dim)">"Suche nach...</span><br><br>
    <span style="font-size:9px;color:var(--accent)">${hint}</span><br><br>
    <button onclick="document.getElementById('overlay').remove()" style="background:none;border:1px solid var(--border);color:var(--dim);padding:8px 20px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer">🙏 Dankeschön</button>
  </div>`;
  document.body.appendChild(wrap);
}

// ── HIGHSCORE ─────────────────────────────────────────────────
function saveHighscore(bonus=0, source='Run') {
  const score=G.p.kills*G.p.level+G.steps+bonus;
  try {
    const hs=JSON.parse(localStorage.getItem('pq_hs')||'[]');
    hs.push({name:G.p.name+(G.hardcore?'[HC]':''), score, level:G.p.level, kills:G.p.kills, source, date:new Date().toLocaleDateString('de-DE')});
    hs.sort((a,b)=>b.score-a.score);
    localStorage.setItem('pq_hs',JSON.stringify(hs.slice(0,8)));
  }catch(_){}
}

function showHighscore() {
  let hs=[]; try{hs=JSON.parse(localStorage.getItem('pq_hs')||'[]');}catch(_){}
  const rows=hs.length?hs.map((h,i)=>`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);font-size:7px"><span>${i+1}. ${h.name}</span><span style="color:var(--accent)">${h.score}</span></div>`).join(''):'<div style="font-size:7px;color:var(--dim);padding:8px">Noch keine Einträge.</div>';
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:260px;max-width:90vw">
    🏆 HIGHSCORE<br><br><div style="text-align:left">${rows}</div><br>
    <button onclick="document.getElementById('overlay').remove()" style="background:none;border:1px solid var(--border);color:var(--dim);padding:6px 16px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer;width:100%">✖</button>
  </div>`;
  document.body.appendChild(wrap);
}

// ── STATS SCREEN ──────────────────────────────────────────────
function showStats() {
  const bs=G.battleStats; const s=stats(); const p=G.p;
  const h=G.dayNight; const isNight=h>=21||h<5;
  const timeStr=`${h.toString().padStart(2,'0')}:00 ${isNight?'🌙':'☀️'}`;
  const row=(k,v,c='var(--accent)')=>`<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);font-size:7px"><span style="color:var(--dim)">${k}</span><span style="color:${c}">${v}</span></div>`;
  const rows=[
    row('── KAMPF ──','','var(--dim)'),
    row('Schaden ausgeteilt',bs.dmgDealt),
    row('Schaden erhalten',bs.dmgTaken),
    row('Höchster Krit',bs.highCrit),
    row('Kämpfe gewonnen',bs.won),
    row('Mal geflohen',bs.fled),
    row('── WERTE ──','','var(--dim)'),
    row('ATK / DEF',`${s.atk} / ${s.def}`),
    row('MaxHP / MaxMP',`${s.maxHp} / ${s.maxMp}`),
    row('Krit-Chance',`${((0.15+(s.critBonus||0))*100).toFixed(0)}%`),
    row('Lifesteal',s.lifesteal>0?`${(s.lifesteal*100).toFixed(0)}%`:'–'),
    row('Ausweichen',s.evasion>0?`${(s.evasion*100).toFixed(0)}%`:'–'),
    row('── WELT ──','','var(--dim)'),
    row('Uhrzeit',timeStr,isNight?'#aaccff':'#ffcc44'),
    row('Ressourcen',`🪵${G.resources.wood} 🪨${G.resources.ore} 🌿${G.resources.herbs}`),
    row('Gilde',G.guild?`${G.guild.name} (${GUILD_RANKS[Math.min(G.guild.rank,5)]})`:'–'),
    row('Schritte',G.steps),
    row('Dungeon Clears',G.dungeonClears),
    row('Achievements',`${G.achievements.length}/${ACHIEVEMENTS.length}`),
    row('Talent-Punkte',`${p.talentPoints} verfügbar`),
  ].join('');
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:270px;max-width:92vw;max-height:85vh;overflow-y:auto">
    📊 STATISTIK<br><br><div style="text-align:left">${rows}</div><br>
    <button onclick="document.getElementById('overlay').remove()" style="background:none;border:1px solid var(--border);color:var(--dim);padding:6px 16px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer;width:100%">✖</button>
  </div>`;
  document.body.appendChild(wrap);
}

// ── LOOT FILTER ───────────────────────────────────────────────
function showLootFilter() {
  const opts=['common','uncommon','rare','epic','legendary'];
  const labels={common:'Alle',uncommon:'Uncommon+',rare:'Rare+',epic:'Epic+',legendary:'Nur Legendary'};
  const btnStyle='display:block;width:100%;background:var(--panel);color:var(--text);border:1px solid var(--border);padding:8px;margin-bottom:5px;font-family:\'Press Start 2P\',monospace;font-size:7px;cursor:pointer';
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:240px;max-width:90vw;text-align:center">
    🗑 LOOT FILTER<br><span style="font-size:6px;color:var(--dim)">Aktuell: ${labels[G.lootFilter]||'Alle'}</span><br><br>
    ${opts.map(o=>`<button style="${btnStyle};${G.lootFilter===o?'border-color:var(--accent);color:var(--accent)':''}" onclick="G.lootFilter='${o}';document.getElementById('overlay').remove();addLog('🗑 Filter: ${labels[o]}')">${labels[o]}</button>`).join('')}
    <button onclick="document.getElementById('overlay').remove()" style="background:none;border:none;color:var(--dim);font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer">✖</button>
  </div>`;
  document.body.appendChild(wrap);
}

// ── WORLD MAP ────────────────────────────────────────────────
function showWorldMap() {
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.92);z-index:100';
  const lvl=G.p.level;
  const nodes=AREAS.map((a,i)=>{
    const locked=lvl<a.min;
    const active=G.area.id===a.id;
    const col=active?'var(--accent)':locked?'#333':'#556';
    const tx=active?'var(--text)':locked?'#444':'#aaa';
    const clickable=!locked&&!active;
    return `<div style="display:flex;align-items:center;gap:10px;margin:4px 0;${clickable?'cursor:pointer;':''}opacity:${locked?0.4:1}"
      ${clickable?`onclick="travelToArea('${a.id}')"`:''}
      title="${locked?'Benötigt LV '+a.min:active?'Aktuelles Gebiet':'Reisen → '+a.name}">
      <div style="width:36px;height:36px;border:2px solid ${col};display:flex;align-items:center;justify-content:center;font-size:18px;background:${active?'#1a1a30':clickable?'#111':'transparent'}">${locked?'🔒':a.icon}</div>
      <div style="text-align:left;flex:1">
        <div style="font-size:7px;color:${tx}">${a.name}${active?' ◀':''}</div>
        <div style="font-size:6px;color:var(--dim)">LV ${a.min}–${a.max}${clickable?' · Tippen zum Reisen':''}</div>
      </div>
    </div>`;
  }).join('');
  wrap.innerHTML=`<div id="overlay-box" style="min-width:260px;max-width:90vw;max-height:85vh;overflow-y:auto;position:relative">
    🗺 WELTKARTE<br><br>
    <div style="text-align:left;padding:0 8px">${nodes}</div>
    <br><button onclick="document.getElementById('overlay').remove()" style="background:none;border:1px solid var(--border);color:var(--dim);padding:6px 16px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}
function travelToArea(areaId) {
  const a = AREAS.find(a=>a.id===areaId); if(!a) return;
  if(G.p.level < a.min){showOverlay('❌ Level zu niedrig!');return;}
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
  refresh();
}

// ── BESTIARY ─────────────────────────────────────────────────
function showBestiary() {
  const entries=Object.entries(G.bestiary);
  const MILESTONES=[{kills:10,label:'+1 ATK',icon:'⚔'},{kills:25,label:'+1 DEF',icon:'🛡'},{kills:50,label:'+10 HP',icon:'❤'}];
  let rows=entries.length?entries.map(([id,b])=>{
    const f=FOES[id]||{}; const name=f.name||id;
    const rewarded=G.p.bestiaryRewarded?.[id]||0;
    const milestoneHtml=MILESTONES.map(m=>{
      const done=b.killed>=m.kills;
      const claimed=rewarded>=m.kills;
      const pct=Math.min(100,Math.floor(b.killed/m.kills*100));
      return `<div style="margin-top:3px">
        <div style="display:flex;justify-content:space-between;font-size:5px;color:${claimed?'var(--green)':done?'var(--accent)':'var(--dim)'}">
          <span>${m.icon} ×${m.kills} → ${m.label}</span>
          <span>${claimed?'✓':b.killed+'/'+m.kills}</span>
        </div>
        <div style="height:3px;background:var(--border);margin-top:1px">
          <div style="height:100%;background:${claimed?'var(--green)':'var(--accent)'};width:${pct}%"></div>
        </div>
      </div>`;
    }).join('');
    return `<div style="padding:6px 0;border-bottom:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between;font-size:7px;margin-bottom:2px">
        <span>${f.icon||'👾'} ${name}</span>
        <span style="color:var(--dim);font-size:6px">Gesehen:${b.seen} Kills:${b.killed}</span>
      </div>
      ${milestoneHtml}
    </div>`;
  }).join(''):'<div style="font-size:7px;color:var(--dim);padding:8px">Noch keine Gegner erforscht.</div>';
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:290px;max-width:90vw;max-height:85vh;overflow-y:auto">
    <div style="text-align:center;color:var(--accent);font-size:9px;margin-bottom:10px">📖 BESTIARIUM</div>
    <div style="text-align:left">${rows}</div><br>
    <button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
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
    return `<button style="${btnStyle};${canCraft?'':'color:var(--dim)'}" ${canCraft?`onclick="doCraft('${r.id}')"`:'disabled'}>${res?.icon||''} ${r.label}<br><span style="color:var(--dim);font-size:5px">${req} → ${res?.name}</span></button>`;
  }).join('');
  const resBadge=`<div style="font-size:6px;color:var(--accent);margin-bottom:8px;padding:4px;background:var(--panel);border:1px solid var(--border)">${resLine}</div>`;
  wrap.innerHTML=`<div id="overlay-box" style="min-width:280px;max-width:90vw">
    ⚗ CRAFTING<br><br>${resBadge}${rows}
    <button onclick="document.getElementById('overlay').remove()" style="background:none;border:1px solid var(--border);color:var(--dim);padding:6px 16px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer;width:100%">✖ Schließen</button>
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
  addLog(`⚗ ${res.icon} ${res.name} gecraftet!`);
  showOverlay(`⚗ Gecraftet!\n${res.icon} ${res.name}`);
  refresh();
}

// ── ACHIEVEMENT SCREEN ───────────────────────────────────────
function showAchievements() {
  const rows=ACHIEVEMENTS.map(a=>{
    const done=G.achievements.includes(a.id);
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);font-size:7px;color:${done?'var(--accent)':'var(--dim)'}">
      <span>${a.icon} ${a.label}</span><span>${done?'✅':a.desc}</span>
    </div>`;
  }).join('');
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:290px;max-width:90vw;max-height:80vh;overflow-y:auto">
    🏅 ACHIEVEMENTS (${G.achievements.length}/${ACHIEVEMENTS.length})<br><br>
    <div style="text-align:left">${rows}</div><br>
    <button onclick="document.getElementById('overlay').remove()" style="background:none;border:1px solid var(--border);color:var(--dim);padding:6px 16px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer;width:100%">✖</button>
  </div>`;
  document.body.appendChild(wrap);
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
  const rect=el.getBoundingClientRect();
  const d=document.createElement('div'); d.className='dmg-num'; d.textContent=text;
  d.style.cssText=`left:${Math.round(rect.left+rect.width/2-20)}px;top:${Math.round(rect.top+4)}px;color:${color}`;
  document.body.appendChild(d); setTimeout(()=>d.remove(),950);
}

// ── INVENTORY ────────────────────────────────────────────────
const RARITY_ORDER = ['common','uncommon','rare','epic','legendary'];
const UNIDENTIFIED_RARITIES = ['epic','legendary'];
function addInv(id, silent=false, forceUnidentified=false){
  const item=ITEMS[id]; if(!item) return;
  if (!silent && G.lootFilter && G.lootFilter!=='common' && item.slot && item.slot!=='pet' && item.slot!=='rune') {
    const minIdx=RARITY_ORDER.indexOf(G.lootFilter);
    const itemIdx=RARITY_ORDER.indexOf(item.rarity||'common');
    if(itemIdx<minIdx) { addLog(`🗑 [Filter] ${item.icon} ${item.name} ignoriert.`); return; }
  }
  if(!item.slot){ const ex=G.p.inv.find(i=>i.id===id&&!i._unidentified); if(ex) ex.qty=(ex.qty||1)+1; else G.p.inv.push({id,qty:1}); }
  else {
    const unid = forceUnidentified || (!silent && UNIDENTIFIED_RARITIES.includes(item.rarity) && Math.random()<0.4);
    G.p.inv.push({id,equipped:false, _unidentified:unid||undefined});
    if(unid) addLog(`📜 ??? Unbekanntes ${item.slot==='weapon'?'Waffe':item.slot==='armor'?'Rüstung':'Item'} gefunden! (Schriftrolle zum Identifizieren)`);
  }
  if(!silent) {
    SFX.itemGet();
    if(item.rarity==='epic'||item.rarity==='legendary') showRarePopup(item);
  }
}

function identifyItem(idx) {
  const slot=G.p.inv[idx]; if(!slot||!slot._unidentified) return;
  const scrollIdx=G.p.inv.findIndex(i=>i.id==='id_scroll');
  if(scrollIdx===-1){ showOverlay('❌ Keine Schriftrolle!\nKaufe eine im Shop.'); return; }
  const sc=G.p.inv[scrollIdx]; sc.qty=(sc.qty||1)-1; if(sc.qty<=0) G.p.inv.splice(scrollIdx,1);
  delete slot._unidentified;
  const item=ITEMS[slot.id];
  addLog(`🔍 Enthüllt: ${item.icon} ${item.name}! (${item.rarity})`);
  SFX.chest(); refresh();
}

function useItem(idx){
  const p=G.p; const slot=p.inv[idx]; if(!slot) return; const item=ITEMS[slot.id]; if(!item) return;
  if(slot.id==='id_scroll'){
    const unids=p.inv.map((s,i)=>({s,i})).filter(({s})=>s._unidentified);
    if(!unids.length){showOverlay('❌ Keine unbekannten Items!');return;}
    if(unids.length===1){identifyItem(unids[0].i);document.getElementById('overlay')?.remove();refresh();return;}
    const wrap=document.createElement('div');wrap.id='overlay';
    wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
    const rows=unids.map(({s,i})=>`<button onclick="identifyItem(${i});document.getElementById('overlay').remove();refresh()" style="display:block;width:100%;background:var(--panel);border:1px solid var(--border);color:var(--text);padding:8px;font-family:inherit;font-size:7px;cursor:pointer;margin-bottom:5px;text-align:left">❓ ??? [${ITEMS[s.id]?.slot||'?'}]</button>`).join('');
    wrap.innerHTML=`<div id="overlay-box" style="min-width:250px;text-align:center">📜 Welches Item identifizieren?<br><br>${rows}<button onclick="document.getElementById('overlay').remove()" style="background:none;border:none;color:var(--dim);font-family:inherit;font-size:7px;cursor:pointer">✖</button></div>`;
    document.body.appendChild(wrap);
    return;
  }
  if(!item.slot){
    const s=stats();
    if(item.hp) { p.hp=Math.min(s.maxHp,p.hp+(item.hp||0)); SFX.heal(); }
    if(item.mp) p.mp=Math.min(s.maxMp,p.mp+(item.mp||0));
    if(item.buffAtk){
      p.buffs=p.buffs||[];
      const ex=p.buffs.find(b=>b.type==='atk');
      if(ex) ex.left=Math.max(ex.left,item.buffLeft);
      else p.buffs.push({type:'atk',val:item.buffAtk,left:item.buffLeft});
      addLog(`⚗ +${item.buffAtk} ATK für ${item.buffLeft} Kämpfe!`);
    }
    if(item.buffDef){
      p.buffs=p.buffs||[];
      const ex=p.buffs.find(b=>b.type==='def');
      if(ex) ex.left=Math.max(ex.left,item.buffLeft);
      else p.buffs.push({type:'def',val:item.buffDef,left:item.buffLeft});
      addLog(`🍃 +${item.buffDef} DEF für ${item.buffLeft} Kämpfe!`);
    }
    slot.qty=(slot.qty||1)-1; if(slot.qty<=0) p.inv.splice(idx,1); addLog(`🧪 ${item.name} benutzt!`);
  } else {
    const es=item.slot;
    if(slot.equipped){slot.equipped=false;p.eq[es]=null;}
    else{
      const prevId=p.eq[es]?.id;
      const prev=prevId?p.inv.find(i=>i.id===prevId&&i.equipped):null;
      if(prev)prev.equipped=false;
      slot.equipped=true; p.eq[es]=item;
    }
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
    const upg=slot._upgrade||0;
    const div=document.createElement('div');
    const isUnid = slot._unidentified;
    div.className=`inv-item${slot.equipped?' equipped':''} ${isUnid?'epic':item.rarity||''}`;
    const upgLabel=upg>0?`<small style="color:var(--accent)">+${upg}</small>`:'';
    if(isUnid){
      div.innerHTML=`❓<small>??? ${item.slot}</small>`;
      div.onclick=()=>{ showOverlay(`📜 Unidentifiziertes Item\n\n[${item.slot}]\n\nSchriftrolle benutzen?`); setTimeout(()=>{ if(confirm('Schriftrolle benutzen?')) identifyItem(idx); },300); };
    } else {
      div.innerHTML=`${item.icon}${upgLabel}<small>${item.name.slice(0,9)}</small>${slot.qty>1?`<small>x${slot.qty}</small>`:''}`;
      div.onclick=()=>{ if(slot.equipped&&item.slot&&item.slot!=='pet'){ showUpgradeMenu(idx); } else if(!item.slot){ showConsumableMenu(idx); } else { useItem(idx); } };
    }
    let t;
    div.addEventListener('touchstart',()=>{t=setTimeout(()=>{ if(!slot.equipped)sellItem(idx); },600);},{passive:true});
    div.addEventListener('touchend',()=>clearTimeout(t),{passive:true});
    div.addEventListener('touchmove',()=>clearTimeout(t),{passive:true});
    grid.appendChild(div);
  });
}

function showConsumableMenu(idx) {
  const slot=G.p.inv[idx]; if(!slot) return; const item=ITEMS[slot.id]; if(!item) return;
  const btnStyle='display:block;width:100%;background:var(--panel);border:1px solid var(--border);padding:8px;font-family:\'Press Start 2P\',monospace;font-size:6px;cursor:pointer;margin-bottom:6px;text-align:left';
  const desc=item.hp?`Heilt ${item.hp} HP`:item.buffAtk?`+${item.buffAtk} ATK (${item.buffLeft} Kämpfe)`:item.buffDef?`+${item.buffDef} DEF (${item.buffLeft} Kämpfe)`:item.mp?`+${item.mp} MP`:item.id==='id_scroll'?'Identifiziert unbekannte Items':'';
  const sellPrice=Math.floor(item.value*0.5);
  const isScroll=item.id==='id_scroll';
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.85);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:240px;max-width:90vw;text-align:center">
    <span style="font-size:18px">${item.icon}</span><br>
    <span style="color:var(--accent)">${item.name}</span>${slot.qty>1?`<span style="font-size:6px;color:var(--dim)"> ×${slot.qty}</span>`:''}<br>
    <span style="font-size:6px;color:var(--dim)">${desc}</span><br><br>
    <button onclick="useItem(${idx});document.getElementById('overlay').remove()" style="${btnStyle};color:var(--green)">🧪 Benutzen</button>
    ${!isScroll?`<button onclick="recycleItem(${idx})" style="${btnStyle};color:#ffaa44">♻ Zerlegen → Ressourcen</button>`:''}
    <button onclick="sellItem(${idx});document.getElementById('overlay').remove();refresh()" style="${btnStyle};color:var(--dim)">💱 Verkaufen (${sellPrice}🪙)</button>
    <button onclick="document.getElementById('overlay').remove()" style="background:none;border:none;color:var(--dim);font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer;margin-top:4px">✖</button>
  </div>`;
  document.body.appendChild(wrap);
}

function showUpgradeMenu(idx) {
  const slot=G.p.inv[idx]; const item=ITEMS[slot.id];
  const upg=slot._upgrade||0; const costs=[0,80,250,600];
  const runeId=slot._rune; const enchant=slot._enchant;
  const btnStyle='display:block;width:100%;background:var(--panel);border:1px solid var(--border);padding:8px;font-family:\'Press Start 2P\',monospace;font-size:6px;cursor:pointer;margin-bottom:6px';
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.85);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:250px;max-width:90vw;text-align:center">
    ${item.icon} ${item.name} +${upg}${runeId?` ${ITEMS[runeId]?.icon}`:''}${enchant?` ✨`:''}<br><br>
    ${upg<3?`<button onclick="upgradeItem(${idx});document.getElementById('overlay').remove()" style="${btnStyle};color:var(--accent);border-color:var(--accent)">✨ Aufwerten +${upg+1} · ${costs[upg+1]}🪙</button>`:`<div style="font-size:7px;color:var(--accent);margin-bottom:6px">MAX +3</div>`}
    <button onclick="document.getElementById('overlay').remove();showRuneMenu(${idx})" style="${btnStyle};color:#aa66ff">💎 Rune einsetzen${runeId?` (${ITEMS[runeId]?.name})`:''}</button>
    <button onclick="document.getElementById('overlay').remove();showEnchantMenu(${idx})" style="${btnStyle};color:#55ddff">✨ Verzaubern${enchant?' (aktiv)':''}</button>
    <button onclick="useItem(${idx});document.getElementById('overlay').remove()" style="${btnStyle};color:var(--text)">🔄 Aus/Anlegen</button>
    <button onclick="document.getElementById('overlay').remove()" style="background:none;border:none;color:var(--dim);font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer">✖</button>
  </div>`;
  document.body.appendChild(wrap);
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
  Object.entries(ITEMS).filter(([,it])=>it.buyable&&it.slot!=='pet').forEach(([id,item])=>{
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
  // runes section
  const runeHeader=document.createElement('div');
  runeHeader.style.cssText='padding:6px 0;font-size:7px;color:#aa66ff;width:100%';
  runeHeader.textContent='💎 Runen'; buy.appendChild(runeHeader);
  Object.entries(ITEMS).filter(([,it])=>it.buyable&&it.slot==='rune').forEach(([id,item])=>{
    const price=Math.ceil(item.value*1.5);
    const parts=[];
    if(item.atk) parts.push(`ATK+${item.atk}`);
    if(item.def) parts.push(`DEF+${item.def}`);
    if(item.maxMp) parts.push(`MP+${item.maxMp}`);
    if(item.critBonus) parts.push(`+${Math.round(item.critBonus*100)}%Krit`);
    const row=document.createElement('div'); row.className='shop-row';
    row.innerHTML=`<div class="shop-icon">${item.icon}</div><div class="shop-info"><div class="shop-name">${item.name}</div><div class="shop-stat">${parts.join('  ')}</div></div><div class="shop-price">${price}🪙</div><button class="shop-btn" ${G.p.gold<price?'disabled':''} onclick="buyItem('${id}')">Buy</button>`;
    buy.appendChild(row);
  });
  // pets section
  const petHeader=document.createElement('div');
  petHeader.style.cssText='padding:6px 0;font-size:7px;color:var(--accent);width:100%';
  petHeader.textContent='🐾 Begleiter'; buy.appendChild(petHeader);
  Object.entries(ITEMS).filter(([,it])=>it.buyable&&it.slot==='pet').forEach(([id,item])=>{
    const price=Math.ceil(item.value*1.5);
    const parts=[];
    if(item.def) parts.push(`DEF+${item.def}`);
    if(item.xpBonus) parts.push(`XP+${Math.round(item.xpBonus*100)}%`);
    if(item.goldBonus) parts.push(`Gold+${Math.round(item.goldBonus*100)}%`);
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
  const icons={weapon:'🗡',armor:'🛡',acc:'💍',pet:'🐾',helm:'🪖',gloves:'🧤',boots:'👢'};
  for(const sl of ['weapon','armor','acc','pet','helm','gloves','boots']){
    const el=document.getElementById(`eq-${sl}`); if(!el) continue;
    const eq=p.eq[sl];
    const invSlot=eq?p.inv.find(i=>i.id===eq.id&&i.equipped):null;
    const upg=invSlot&&invSlot._upgrade?` +${invSlot._upgrade}`:'';
    const rune=invSlot&&invSlot._rune?` ${ITEMS[invSlot._rune]?.icon||''}`:'' ;
    const enc=invSlot&&invSlot._enchant?' ✨':'';
    el.innerHTML=`${icons[sl]} <span>${eq?eq.name+upg+rune+enc:'Empty'}</span>`;
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

// ── RARE POPUP ───────────────────────────────────────────────
function showRarePopup(item) {
  const el = document.createElement('div');
  el.className = 'rare-popup ' + (item.rarity||'');
  el.innerHTML = `${item.icon||'📦'} ${item.rarity==='legendary'?'LEGENDÄR':'EPISCH'}!<br><span style="font-size:7px;color:inherit">${item.name}</span>`;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 2400);
}

// ── INTRO SCREEN ─────────────────────────────────────────────
function promptName(onDone){
  window._onNameDone=onDone;
  const wrap=document.createElement('div'); wrap.id='name-overlay';
  wrap.style.cssText='position:fixed;inset:0;overflow-y:auto;display:flex;align-items:flex-start;justify-content:center;background:rgba(0,0,0,.93);z-index:100;padding:12px 0';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:270px;max-width:90vw;text-align:center">
    <div style="font-size:11px;color:var(--accent);margin-bottom:10px">⚔ PIXEL QUEST RPG</div>
    <div style="font-size:7px;color:var(--dim);margin-bottom:14px">Ein Pixel-Abenteuer wartet!</div>

    <div style="font-size:7px;color:var(--dim);margin-bottom:4px">Dein Heldenname:</div>
    <input id="name-inp" type="text" maxlength="10" value="Hero" autocomplete="off" style="margin-bottom:14px">

    <div style="font-size:7px;color:var(--text);margin-bottom:6px">Klasse wählen:</div>
    <div style="display:flex;gap:6px;margin-bottom:14px">
      <button class="intro-class-btn selected" id="cls-warrior" onclick="introSelectClass('warrior')">⚔<br>Krieger<br><span style="font-size:5px;color:var(--dim)">+ATK +HP</span></button>
      <button class="intro-class-btn" id="cls-mage"    onclick="introSelectClass('mage')">🔮<br>Magier<br><span style="font-size:5px;color:var(--dim)">+MP Schaden</span></button>
      <button class="intro-class-btn" id="cls-rogue"   onclick="introSelectClass('rogue')">🗡<br>Schurke<br><span style="font-size:5px;color:var(--dim)">+Krit Ausweichen</span></button>
    </div>

    <div style="font-size:7px;color:var(--text);margin-bottom:6px">Schwierigkeit:</div>
    <div style="display:flex;gap:4px;margin-bottom:14px">
      <button class="diff-btn" id="diff-easy"   onclick="introSetDiff('easy')">😊<br>Leicht</button>
      <button class="diff-btn active" id="diff-normal" onclick="introSetDiff('normal')">⚔<br>Normal</button>
      <button class="diff-btn" id="diff-hard"   onclick="introSetDiff('hard')">💀<br>Schwer</button>
    </div>

    <div style="display:flex;align-items:center;gap:8px;justify-content:center;margin-bottom:14px">
      <input type="checkbox" id="hc-check" onchange="G.hardcore=this.checked">
      <label for="hc-check" style="font-size:6px;color:#ff4444;cursor:pointer">☠ HARDCORE (Permadeath)</label>
    </div>
    <button id="name-start-btn" onclick="confirmName()">▶ ABENTEUER BEGINNEN</button>
  </div>`;
  document.body.appendChild(wrap);
  const inp=document.getElementById('name-inp');
  inp.focus(); inp.select();
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')confirmName();});
  window._introClass='warrior';
  window._introDiff='normal';
}

function introSelectClass(cls){
  window._introClass=cls;
  ['warrior','mage','rogue'].forEach(c=>{
    const b=document.getElementById('cls-'+c);
    if(b) b.classList.toggle('selected',c===cls);
  });
}
function introSetDiff(d){
  window._introDiff=d; G.difficulty=d;
  ['easy','normal','hard'].forEach(x=>{
    const b=document.getElementById('diff-'+x);
    if(b) b.classList.toggle('active',x===d);
  });
}

function confirmName(){
  const inp=document.getElementById('name-inp');
  G.p.name=(inp?.value.trim()||'Hero').slice(0,10)||'Hero';
  G.p.class=window._introClass||'warrior';
  G.difficulty=window._introDiff||'normal';
  if(G.p.class&&CLASSES[G.p.class]){
    const cl=CLASSES[G.p.class];
    G.p.baseAtk+=(cl.bonusAtk||0); G.p.baseDef+=(cl.bonusDef||0);
    G.p.maxHp+=(cl.bonusHp||0); G.p.hp=G.p.maxHp;
    G.p.maxMp+=(cl.bonusMp||0); G.p.mp=G.p.maxMp;
  }
  document.getElementById('name-overlay')?.remove();
  document.getElementById('pcombat-name').textContent=G.p.name;
  refresh();
  setTimeout(()=>showTutorialHint(0),800);
  if(window._onNameDone) window._onNameDone();
}

// ── AUTO-BATTLE ───────────────────────────────────────────────
function toggleAutoBattle(){
  G.autoBattle=!G.autoBattle;
  const btn=document.getElementById('auto-battle-btn');
  if(btn) btn.textContent=G.autoBattle?'⚡ Auto: ON':'⚡ Auto: OFF';
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
      <span class="shop-info"><div class="shop-name">${item.name}</div></span>
      <button class="shop-btn" onclick="bankDeposit(${i})">Einlagern</button>
    </div>`;
  }).join('');
  const bankRows=G.bank.map((it,i)=>{
    const item=ITEMS[it.id]; if(!item) return '';
    return `<div class="shop-row" style="font-size:7px">
      <span class="shop-icon">${item.icon}</span>
      <span class="shop-info"><div class="shop-name">${item.name}</div></span>
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

// ── PVP ────────────────────────────────────────────────────────
function savePvPSnapshot(){
  const s=stats();
  const snap={name:G.p.name,level:G.p.level,atk:s.atk,def:s.def,maxHp:G.p.maxHp,class:G.p.class};
  try{localStorage.setItem('pq_pvp_snap',JSON.stringify(snap));}catch(_){}
  showOverlay('💾 PvP-Snapshot gespeichert!');
}
function simulatePvP(opp){
  const s=stats();
  let myHp=G.p.maxHp, oppHp=opp.maxHp;
  for(let i=0;i<30;i++){
    const myDmg=Math.max(1,s.atk-Math.floor(opp.def*0.6)+rand(-3,3));
    oppHp-=myDmg;
    if(oppHp<=0) return true;
    const oppDmg=Math.max(1,opp.atk-Math.floor(s.def*0.6)+rand(-3,3));
    myHp-=oppDmg;
    if(myHp<=0) return false;
  }
  return myHp>oppHp;
}
function showPvP(){
  let snapHtml='<div style="font-size:6px;color:var(--dim);padding:8px">Kein gespeicherter Gegner</div>';
  try{
    const raw=localStorage.getItem('pq_pvp_snap');
    if(raw){
      const opp=JSON.parse(raw);
      const win=simulatePvP(opp);
      snapHtml=`<div style="padding:8px;border:1px solid var(--border);font-size:7px">
        <div style="color:var(--accent)">${opp.name} LV${opp.level}</div>
        <div style="color:var(--dim)">ATK:${opp.atk} DEF:${opp.def} HP:${opp.maxHp}</div>
        <div style="margin-top:6px;color:${win?'var(--green)':'var(--red)'}">${win?'🏆 DU GEWINNST':'💀 DU VERLIERST'}</div>
      </div>`;
    }
  }catch(_){}
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:280px;max-width:90vw;text-align:left">
    <div style="text-align:center;color:var(--accent);font-size:9px;margin-bottom:10px">⚔ PVP SIMULATION</div>
    <div style="font-size:7px;color:var(--dim);margin-bottom:6px">Dein aktueller Snapshot:</div>
    <button onclick="savePvPSnapshot();document.getElementById('overlay').remove();showPvP()" style="width:100%;background:var(--panel);border:1px solid var(--border);color:var(--text);padding:8px;font-family:inherit;font-size:7px;cursor:pointer;margin-bottom:8px">💾 Snapshot speichern</button>
    <div style="font-size:7px;color:var(--dim);margin-bottom:6px">Gespeicherter Gegner:</div>
    ${snapHtml}
    <br><button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:inherit;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}
function showPvPEvent(){
  let opp=null;
  try{const raw=localStorage.getItem('pq_pvp_snap');if(raw) opp=JSON.parse(raw);}catch(_){}
  if(!opp){
    const s=stats();
    opp={name:'Wanderer',level:Math.max(1,G.p.level-1+rand(-2,2)),atk:Math.max(5,s.atk-rand(2,8)),def:Math.max(2,s.def-rand(1,4)),maxHp:Math.max(50,G.p.maxHp-rand(10,30))};
  }
  const win=simulatePvP(opp);
  const goldWon=win?rand(50,150):0;
  if(win){earnGold(goldWon);gainXP(Math.floor(G.p.level*30));}
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:260px;text-align:center">
    ⚔ DUELL vs. ${opp.name}!<br><br>
    <span style="color:${win?'var(--green)':'var(--red)'};font-size:10px">${win?'🏆 SIEG!':'💀 NIEDERLAGE!'}</span><br><br>
    ${win?`+🪙${goldWon} Gold erhalten!`:''}<br>
    <button onclick="document.getElementById('overlay').remove();refresh()" style="margin-top:12px;width:100%;background:var(--accent);color:var(--bg);border:none;padding:8px;font-family:inherit;font-size:7px;cursor:pointer">OK</button>
  </div>`;
  document.body.appendChild(wrap);
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

// ── FISHING ──────────────────────────────────────────────────
function showFishingEvent() {
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  const sweetPct=30+Math.floor(Math.random()*45);
  wrap.innerHTML=`<div id="overlay-box" style="min-width:260px;text-align:center">
    <div style="color:var(--accent);font-size:9px;margin-bottom:8px">🎣 ANGELN</div>
    <div style="font-size:7px;color:var(--dim);margin-bottom:12px">Drücke HAKEN! wenn der Zeiger im grünen Bereich ist!</div>
    <div id="fish-bar-wrap" style="position:relative;height:22px;background:var(--panel);border:1px solid var(--border);border-radius:2px;overflow:hidden;margin-bottom:14px">
      <div id="fish-sweet" style="position:absolute;top:0;bottom:0;width:25%;left:${sweetPct}%;background:rgba(0,255,80,0.25);border-left:1px solid #0f0;border-right:1px solid #0f0"></div>
      <div id="fish-ptr" style="position:absolute;top:0;bottom:0;width:3px;background:#fff;left:0"></div>
    </div>
    <button id="fish-hook-btn" onclick="doFishHook()" style="width:100%;background:var(--accent2);color:var(--bg);border:none;padding:10px;font-family:inherit;font-size:9px;cursor:pointer;margin-bottom:6px">🪝 HAKEN!</button>
    <button onclick="cancelFishing()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:inherit;font-size:7px;cursor:pointer">✖ Aufgeben</button>
  </div>`;
  document.body.appendChild(wrap);
  let pos=0, dir=1;
  window._fishState={sweetPct,done:false};
  window._fishInt=setInterval(()=>{
    if(window._fishState.done) return;
    pos+=dir*2.5; if(pos>=100||pos<=0) dir*=-1;
    window._fishState.pos=pos;
    const ptr=document.getElementById('fish-ptr');
    if(ptr) ptr.style.left=pos+'%';
  },30);
}
function doFishHook() {
  const st=window._fishState; if(!st||st.done) return;
  st.done=true; clearInterval(window._fishInt);
  const pos=st.pos||0; const sw=st.sweetPct;
  const inSweet=pos>=sw && pos<=sw+25;
  const nearSweet=pos>=sw-12 && pos<=sw+37;
  document.getElementById('overlay')?.remove();
  if(inSweet){
    const rare=Math.random()<0.35;
    const caught=rare?'rare_fish':'fish';
    addInv(caught); SFX.itemGet();
    addLog(rare?'🐠 PERFEKTER TREFFER! Seltener Fisch!':'🐟 Guter Treffer! Fisch gefangen!');
  } else if(nearSweet){
    addInv('fish'); SFX.itemGet();
    addLog('🐟 Knapp! Kleiner Fisch gefangen.');
  } else {
    addLog('🎣 Verpasst! Der Fisch entkam...');
  }
  refresh();
}
function cancelFishing() {
  clearInterval(window._fishInt); window._fishState=null;
  document.getElementById('overlay')?.remove();
  addLog('🎣 Angeln abgebrochen.');
}

// ── RECYCLE ───────────────────────────────────────────────────
function recycleItem(invIdx) {
  const slot=G.p.inv[invIdx]; if(!slot||slot.equipped) return;
  const item=ITEMS[slot.id]; if(!item) return;
  const r=item.rarity||'common';
  if(r==='common')         { G.resources.wood+=1; }
  else if(r==='uncommon')  { G.resources.ore+=2; }
  else if(r==='rare')      { G.resources.ore+=3; G.resources.herbs+=2; }
  else                     { G.resources.ore+=5; G.resources.herbs+=3; G.resources.wood+=3; }
  if(slot.qty>1) slot.qty--; else G.p.inv.splice(invIdx,1);
  addLog(`♻ ${item.name} zerlegt! Ressourcen erhalten.`);
  document.getElementById('overlay')?.remove();
  refresh();
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

// ── RUNE COMBINE ──────────────────────────────────────────────
function showRuneCombine() {
  const rows = Object.entries(RUNE_COMBINE).map(([runeId, combo]) => {
    const item = ITEMS[runeId]; const res = ITEMS[combo.result];
    const count = G.p.inv.filter(i=>i.id===runeId).length;
    const canDo = count >= combo.needs;
    return `<div class="shop-row"><span class="shop-icon">${item.icon}×${combo.needs}</span>
      <div class="shop-info"><div class="shop-name">${item.name} → ${res.name}</div>
      <div class="shop-stat">Hast du: ${count}/${combo.needs}</div></div>
      <button class="shop-btn" onclick="doRuneCombine('${runeId}')" ${canDo?'':'disabled'}>${res.icon}</button>
    </div>`;
  }).join('');
  const wrap = document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:290px;max-width:90vw;max-height:85vh;overflow-y:auto;text-align:left">
    <div style="text-align:center;color:var(--accent);font-size:9px;margin-bottom:10px">💫 RUNEN KOMBINIEREN</div>
    ${rows||'<div style="color:var(--dim);font-size:7px;padding:8px">Keine kombinierbaren Runen im Inventar.</div>'}
    <br><button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:inherit;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}
function doRuneCombine(runeId) {
  const combo = RUNE_COMBINE[runeId]; if (!combo) return;
  const runesInInv = G.p.inv.filter(i=>i.id===runeId);
  if (runesInInv.length < combo.needs) { showOverlay('❌ Nicht genug Runen!'); return; }
  for (let i = 0; i < combo.needs; i++) {
    const idx = G.p.inv.indexOf(runesInInv[i]);
    G.p.inv.splice(idx, 1);
  }
  addInv(combo.result);
  const res = ITEMS[combo.result];
  SFX.levelUp();
  document.getElementById('overlay')?.remove();
  addLog(`💫 Runen kombiniert! ${res.icon} ${res.name} erhalten!`);
  showRuneCombine(); refresh();
}

// ── EXPORT / IMPORT CODE ─────────────────────────────────────
function exportCode() {
  const data = { name:G.p.name, level:G.p.level, kills:G.p.kills, gold:G.p.totalGoldEarned, steps:G.steps, prestige:G.p.prestige||0 };
  const code = btoa(JSON.stringify(data));
  const wrap = document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:280px;text-align:center">
    🏅 RANGLISTEN-CODE<br><br>
    <div style="font-size:6px;color:var(--dim);word-break:break-all;border:1px solid var(--border);padding:8px;margin:8px 0;user-select:all">${code}</div>
    <div style="font-size:7px;color:var(--dim)">${G.p.name} · LV${G.p.level} · ${G.p.kills} Kills</div><br>
    <button onclick="navigator.clipboard?.writeText('${code}').then(()=>addLog('📋 Code kopiert!'))" style="width:100%;background:var(--accent);color:var(--bg);border:none;padding:8px;font-family:inherit;font-size:7px;cursor:pointer;margin-bottom:4px">📋 Exportieren / Kopieren</button>
    <button onclick="showImportCode()" style="width:100%;background:var(--panel);border:1px solid var(--border);color:var(--text);padding:8px;font-family:inherit;font-size:7px;cursor:pointer;margin-bottom:6px">📥 Code Importieren</button>
    <button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:inherit;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}

function showImportCode() {
  document.getElementById('overlay')?.remove();
  const wrap = document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:280px;text-align:center">
    📥 CODE IMPORTIEREN<br><br>
    <div style="font-size:7px;color:var(--dim);margin-bottom:8px">Ranglisten-Code einfügen:</div>
    <textarea id="import-inp" style="width:100%;height:60px;background:var(--surface);border:1px solid var(--border);color:var(--text);font-family:monospace;font-size:7px;padding:6px;resize:none;box-sizing:border-box" placeholder="Code hier einfügen..."></textarea><br><br>
    <button onclick="doImportCode()" style="width:100%;background:var(--accent);color:var(--bg);border:none;padding:8px;font-family:inherit;font-size:7px;cursor:pointer;margin-bottom:6px">✅ Importieren</button>
    <button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:inherit;font-size:7px;cursor:pointer">✖ Abbrechen</button>
  </div>`;
  document.body.appendChild(wrap);
}

function doImportCode() {
  const raw = document.getElementById('import-inp')?.value.trim();
  if (!raw) { showOverlay('❌ Kein Code eingegeben!'); return; }
  try {
    const d = JSON.parse(atob(raw));
    if (!d.name||!d.level) throw new Error('invalid');
    document.getElementById('overlay')?.remove();
    showOverlay(`🏅 RANGLISTE\n\n👤 ${d.name}\n⚔ LV ${d.level}\n💀 Kills: ${d.kills||0}\n🪙 Gold: ${d.gold||0}\n👣 Schritte: ${d.steps||0}${d.prestige?'\n🌟 Prestige '+d.prestige:''}`);
  } catch(_) {
    showOverlay('❌ Ungültiger Code!');
  }
}

// ── SETTINGS ─────────────────────────────────────────────────
function showSettings() {
  const wrap = document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.92);z-index:100';
  const d = G.difficulty||'normal';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:270px;text-align:center">
    ⚙ EINSTELLUNGEN<br><br>
    <div style="font-size:7px;color:var(--text);margin-bottom:6px">Schwierigkeit:</div>
    <div style="display:flex;gap:4px;margin-bottom:14px">
      <button class="diff-btn${d==='easy'?' active':''}"   id="s-diff-easy"   onclick="settingsDiff('easy')">😊 Leicht</button>
      <button class="diff-btn${d==='normal'?' active':''}" id="s-diff-normal" onclick="settingsDiff('normal')">⚔ Normal</button>
      <button class="diff-btn${d==='hard'?' active':''}"   id="s-diff-hard"   onclick="settingsDiff('hard')">💀 Schwer</button>
    </div>
    <div style="font-size:6px;color:var(--dim);margin-bottom:14px">Schwierigkeit wirkt sich auf Gegner-HP/ATK aus.</div>
    <div style="display:flex;align-items:center;gap:8px;justify-content:center;margin-bottom:14px">
      <input type="checkbox" id="s-mute" ${SFX.muted?'checked':''} onchange="if(this.checked!==SFX.muted)toggleMute()">
      <label for="s-mute" style="font-size:7px;cursor:pointer">🔇 Stumm</label>
    </div>
    <div style="display:flex;align-items:center;gap:8px;justify-content:center;margin-bottom:14px">
      <input type="checkbox" id="s-hc" ${G.hardcore?'checked':''} onchange="G.hardcore=this.checked;save()">
      <label for="s-hc" style="font-size:6px;color:#ff4444;cursor:pointer">☠ Hardcore (Permadeath)</label>
    </div>
    <button onclick="confirmReset()" style="width:100%;background:#3a1010;border:1px solid #ff4444;color:#ff4444;padding:8px;font-family:inherit;font-size:7px;cursor:pointer;margin-bottom:6px">🗑 Spielstand LÖSCHEN</button>
    <button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:inherit;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}

function settingsDiff(d) {
  G.difficulty=d; save();
  ['easy','normal','hard'].forEach(x=>{
    const b=document.getElementById('s-diff-'+x);
    if(b) b.classList.toggle('active',x===d);
  });
}

function confirmReset() {
  const wrap2=document.createElement('div'); wrap2.id='overlay2';
  wrap2.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.7);z-index:200';
  wrap2.innerHTML=`<div id="overlay-box" style="text-align:center;min-width:240px">
    ⚠ WIRKLICH LÖSCHEN?<br><br>
    <div style="font-size:7px;color:var(--dim);margin-bottom:12px">Alle Daten gehen verloren!</div>
    <button onclick="doReset()" style="width:100%;background:#ff4444;border:none;color:#000;padding:8px;font-family:inherit;font-size:7px;cursor:pointer;margin-bottom:6px">💥 JA, LÖSCHEN</button>
    <button onclick="document.getElementById('overlay2').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:inherit;font-size:7px;cursor:pointer">✖ Abbrechen</button>
  </div>`;
  document.body.appendChild(wrap2);
}

function doReset() {
  localStorage.removeItem('pq_save'); location.reload();
}

// ── TUTORIAL ──────────────────────────────────────────────────
const TUTORIAL_HINTS = [
  '💡 Drücke EXPLORE um dein Abenteuer zu starten!',
  '💡 Benutze Skills im Kampf für mehr Schaden!',
  '💡 Levle auf um neue Fähigkeiten freizuschalten!',
  '💡 Öffne Schatzkisten für seltene Ausrüstung!',
  '💡 Rüste Items aus im Inventar für Boni!',
];

function showTutorialHint(step) {
  if (step >= TUTORIAL_HINTS.length) return;
  const el = document.createElement('div');
  el.className = 'tutorial-hint';
  el.textContent = TUTORIAL_HINTS[step];
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 4800);
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

// ── SPRITE SELECT ─────────────────────────────────────────────
function showSpriteSelect() {
  const rows = HERO_PALETTES.map(hp => {
    const active = G.heroSprite === hp.id;
    return `<div style="display:flex;align-items:center;gap:10px;padding:8px;border:1px solid ${active?'var(--accent)':'var(--border)'};margin-bottom:6px;cursor:pointer" onclick="selectHeroSprite('${hp.id}')">
      <span style="font-size:9px;color:${active?'var(--accent)':'var(--text)'}">${active?'▶ ':''}${hp.name}</span>
      ${active?'<span style="font-size:7px;color:var(--accent)">(aktiv)</span>':''}
    </div>`;
  }).join('');
  const wrap = document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:270px;text-align:left">
    <div style="text-align:center;color:var(--accent);font-size:9px;margin-bottom:10px">🎨 CHARAKTER-STIL</div>
    ${rows}
    <button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:inherit;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}
function selectHeroSprite(id) {
  G.heroSprite = id;
  document.getElementById('overlay')?.remove();
  drawPlayer(document.getElementById('player-canvas'));
  drawPlayer(document.getElementById('char-canvas'));
  addLog(`🎨 Stil: ${HERO_PALETTES.find(h=>h.id===id)?.name||id}`);
  showSpriteSelect();
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
    difficulty:G.difficulty, tutorialStep:G.tutorialStep,
  }));}catch(_){}
}

function load(){
  try{
    const raw=localStorage.getItem('pq_save'); if(!raw) return false;
    const d=JSON.parse(raw); Object.assign(G.p,d.p);
    G.steps=d.steps||0; G.quests=d.quests||[]; G.kingDefeated=d.kingDefeated||false;
    G.achievements=d.achievements||[]; G.bestiary=d.bestiary||{}; G.dungeonClears=d.dungeonClears||0;
    G.battleStats=d.battleStats||{dmgDealt:0,dmgTaken:0,highCrit:0,won:0,fled:0};
    G.lootFilter=d.lootFilter||'common'; G.hardcore=d.hardcore||false;
    G.bank=d.bank||[]; G.resources=d.resources||{wood:0,ore:0,herbs:0};
    G.companion=d.companion||null; G.speedrun=d.speedrun||{active:false,startTime:0,bestTime:null};
    G.storyShown=d.storyShown||[];
    G.guild=d.guild||null; G.dayNight=d.dayNight||6; G.heroSprite=d.heroSprite||'warrior';
    G.worldBossSteps=d.worldBossSteps||0;
    G.difficulty=d.difficulty||'normal'; G.tutorialStep=d.tutorialStep||99;
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
  drawPlayer(document.getElementById('player-canvas'));
  addLog('🌟 Willkommen bei Pixel Quest RPG!');
  addLog('🗺 Drücke EXPLORE um dein Abenteuer zu beginnen.');
  if(!G.p.inv.length){addInv('potion',true);addInv('wood_sword',true);}
  if(!hasSave) promptName(()=>save());
  updateDailyTimer();
  updateDayNight();
  setInterval(weatherTick, 80);
  const srEl=document.getElementById('speedrun-timer');
  if(srEl) srEl.style.display=G.speedrun.active?'block':'none';
  if(G.speedrun.active) window._speedrunInterval=setInterval(updateSpeedrunTimer,1000);
  const abBtn=document.getElementById('auto-battle-btn');
  if(abBtn) abBtn.textContent=G.autoBattle?'⚡ Auto: ON':'⚡ Auto: OFF';
}

init();
