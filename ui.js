// ── OVERLAY HELPERS ──────────────────────────────────────────
function closeOverlay(){
  const el=document.getElementById('overlay'); if(!el) return;
  el.classList.add('overlay-closing');
  setTimeout(()=>el.remove(),150);
}

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
    🧙 ${G.lang==='en'?'TRAVELING MERCHANT':'WANDERHÄNDLER'}<br><br>
    <span style="font-size:7px;color:var(--dim)">${G.lang==='en'?'Special offers — 50% off!':'Sonderangebote — 50% Rabatt!'}</span><br><br>
    ${picks.map(([id,it])=>`<button style="${btnStyle}" onclick="merchantBuy('${id}',${Math.ceil(it.value*0.75)})">${it.icon} ${it.name} &nbsp;${Math.ceil(it.value*0.75)}🪙<br><span style="color:var(--dim)">${it.rarity}</span></button>`).join('')}
    <button style="${closeStyle}" onclick="document.getElementById('overlay').remove()">🚶 Weiter</button>
  </div>`;
  document.body.appendChild(wrap);
}
function merchantBuy(id,price){
  if(G.p.gold<price){showOverlay(t('err_gold'));return;}
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
    <div style="color:var(--accent);font-size:9px;margin-bottom:8px">🏨 ${G.lang==='en'?'INN':'GASTHAUS'}</div>
    <div style="font-size:7px;color:var(--dim);margin-bottom:10px">HP: ${p.hp}/${s.maxHp} · MP: ${p.mp}/${s.maxMp}</div>
    ${missingHp===0&&missingMp===0?`<div style="font-size:7px;color:var(--green);margin-bottom:10px">✓ Du bist bereits vollständig erholt!</div>`:`<div style="font-size:7px;color:var(--dim);margin-bottom:10px">Vollständige Erholung für <b style="color:var(--text)">${cost} 🪙</b></div>`}
    ${missingHp>0||missingMp>0?`<button onclick="doRest(${cost})" style="width:100%;background:var(--green);color:var(--bg);border:none;padding:10px;font-family:inherit;font-size:8px;cursor:pointer;margin-bottom:6px">💤 Ausruhen (${cost} 🪙)</button>`:''}
    <button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:inherit;font-size:7px;cursor:pointer">🚪 Verlassen</button>
  </div>`;
  document.body.appendChild(wrap);
}
function doRest(cost) {
  if(G.p.gold<cost){showOverlay(t('err_gold'));return;}
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
    🧙 ${G.lang==='en'?'STRANGER':'FREMDER'}<br><br>
    <span style="font-size:7px;color:var(--dim)">${G.lang==='en'?'"Choose wisely, hero..."':'"Wähle weise, Held..."'}</span><br><br>
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
      ${t('step_counter')}: ${G.steps} &nbsp;|&nbsp; Gold: ${p.gold}<br>
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
  const bonusAtk = p.prestige * 5 + ((G.prestigeUpgrades?.atk_up||0)*10);
  const bonusDef = p.prestige * 3 + ((G.prestigeUpgrades?.def_up||0)*5);
  const bonusHp  = (G.prestigeUpgrades?.hp_up||0)*50;
  const bonusMp  = (G.prestigeUpgrades?.mp_up||0)*20;
  const goldPct  = 0.3 + (G.prestigeUpgrades?.gold_keep||0)*0.1;
  const keptGold = Math.floor(p.gold * goldPct);
  // keep equipped items (base 1 + start_item upgrades)
  const keepSlots = 1 + (G.prestigeUpgrades?.start_item||0);
  const keptItems = Object.values(p.eq).filter(v=>v).slice(0,keepSlots);
  p.level=1; p.xp=0; p.xpNext=100;
  p.baseAtk=8+bonusAtk; p.baseDef=3+bonusDef;
  p.maxHp=100+bonusHp; p.maxMp=30+bonusMp; p.hp=p.maxHp; p.mp=p.maxMp;
  p.gold=keptGold; p.kills=0; p.statPoints=0;
  p.eq={weapon:null,armor:null,acc:null,pet:null,helm:null,gloves:null,boots:null}; p.inv=[];
  keptItems.forEach(it=>{ addInv(Object.keys(ITEMS).find(k=>ITEMS[k].name===it.name)||'potion', true); });
  addInv('potion', true);
  G.prestigeCoins = (G.prestigeCoins||0) + 3;
  G.steps=0; G.quests=[]; G.kingDefeated=false;
  generateQuests(); updateArea(); refresh();
  document.getElementById('step-val').textContent=0;
  saveHighscore(0,'Prestige');
  addLog(`⭐ Prestige ${p.prestige}! +${bonusAtk} ATK +${bonusDef} DEF. +3 Prestige-Münzen!`);
  showOverlay(`⭐ PRESTIGE ${p.prestige}\n+${bonusAtk} ATK\n+${bonusDef} DEF\n+3 💫 Prestige-Münzen!`);
  setTimeout(()=>{ if(confirm('Prestige-Shop öffnen?')) showPrestigeShop(); }, 1500);
  save();
}

// ── CLASS SELECTION ──────────────────────────────────────────
function showClassSelect() {
  if (G.p.class) return;
  const btnStyle='display:block;width:100%;background:var(--panel);color:var(--text);border:1px solid var(--border);border-bottom:3px solid var(--accent2);padding:12px 10px;margin-bottom:8px;font-family:\'Press Start 2P\',monospace;font-size:7px;cursor:pointer;text-align:left';
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.92);z-index:100';
  const opts=Object.entries(CLASSES).map(([id,cl])=>{
    const name = (G.lang==='en'&&cl.nameEn) ? cl.nameEn : cl.name;
    return `<button style="${btnStyle}" onclick="chooseClass('${id}')">${cl.icon} ${name}<br><span style="color:var(--dim);font-size:6px">${cl.desc}</span></button>`;
  }).join('');
  wrap.innerHTML=`<div id="overlay-box" style="min-width:280px;max-width:90vw;text-align:center">
    ⚔ ${G.lang==='en'?'CHOOSE CLASS':'KLASSE WÄHLEN'} ⚔<br><br>
    <span style="font-size:6px;color:var(--dim)">LV 5 — ${G.lang==='en'?'Choose your path!':'Wähle deinen Weg!'}</span><br><br>
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

// ── ITEM UPGRADE ─────────────────────────────────────────────
function upgradeItem(idx) {
  const slot = G.p.inv[idx]; if (!slot || !slot.equipped) { showOverlay('❌ Item muss ausgerüstet sein!'); return; }
  const item = ITEMS[slot.id]; if (!item || !item.slot || item.slot==='pet') return;
  const upg = slot._upgrade||0;
  if (upg>=3) { showOverlay('❌ Bereits max. Upgrade!'); return; }
  const costs=[0,80,250,600];
  const cost=costs[upg+1];
  if (G.p.gold<cost) { showOverlay(`${t('err_gold')}\n${cost}🪙`); return; }
  G.p.gold-=cost; slot._upgrade=(upg+1);
  addLog(`✨ ${item.name} auf +${slot._upgrade} aufgewertet!`);
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
    // Auto-equip suggestion for gear when slot is empty
    if(item.slot && item.slot!=='rune' && !G.combat) {
      const cur=G.p.eq[item.slot];
      const curItem=cur?ITEMS[cur.id]:null;
      const newScore=(item.atk||0)+(item.def||0)+(item.maxHp||0)*0.1+(item.critBonus||0)*20;
      const curScore=curItem?(curItem.atk||0)+(curItem.def||0)+(curItem.maxHp||0)*0.1+(curItem.critBonus||0)*20:0;
      if(!curItem || newScore>curScore) {
        setTimeout(()=>{
          const newIdx=G.p.inv.findIndex(i=>i.id===id&&!i.equipped&&!i._unidentified);
          if(newIdx>=0) showAutoEquipPrompt(newIdx, item, curItem);
        }, 400);
      }
    }
  }
}

function showAutoEquipPrompt(idx, item, curItem) {
  const btnStyle='display:block;width:100%;border:1px solid var(--border);padding:8px;font-family:\'Press Start 2P\',monospace;font-size:7px;cursor:pointer;margin-bottom:5px';
  const compareText=curItem?`(ersetzt ${curItem.icon} ${curItem.name})`:'(Slot leer)';
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.85);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:240px;text-align:center">
    🔄 Besser als aktuell!<br><br>
    <span style="font-size:18px">${item.icon}</span><br>
    <span style="color:var(--accent);font-size:7px">${item.name}</span><br>
    <span style="font-size:6px;color:var(--dim)">${compareText}</span><br><br>
    <button onclick="useItem(${idx});document.getElementById('overlay').remove()" style="${btnStyle};background:var(--green);color:var(--bg);border-color:var(--green)">✅ Ausrüsten</button>
    <button onclick="document.getElementById('overlay').remove()" style="${btnStyle};background:var(--panel);color:var(--dim)">✖ Später</button>
  </div>`;
  document.body.appendChild(wrap);
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
      slot.equipped=true; p.eq[es]={...item, id:slot.id};
    }
  }
  refresh();
}

function sellItem(idx){
  const p=G.p; const slot=p.inv[idx]; if(!slot||slot.equipped) return;
  const item=ITEMS[slot.id]; if(!item) return;
  const price=Math.floor(item.value*0.5);
  if(slot.qty>1) slot.qty--; else p.inv.splice(idx,1);
  earnGold(price); addLog(`💱 ${iname(slot.id)} ${t('log_sold')} (${price} Gold).`); refresh();
}

function confirmSell(idx){
  const slot=G.p.inv[idx]; if(!slot||slot.equipped) return;
  const item=ITEMS[slot.id]; if(!item) return;
  const price=Math.floor(item.value*0.5);
  document.getElementById('overlay')?.remove();
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.88);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:220px;max-width:90vw;text-align:center">
    <div style="font-size:14px;margin-bottom:8px">${item.icon}</div>
    <div style="color:var(--accent);font-size:8px;margin-bottom:10px">💱 ${item.name} für ${price}🪙 verkaufen?</div>
    <div style="display:flex;gap:8px;justify-content:center">
      <button onclick="sellItem(${idx});document.getElementById('overlay').remove();refresh()" style="background:var(--green);color:var(--bg);border:none;padding:8px 16px;font-family:inherit;font-size:7px;cursor:pointer">✔ Ja</button>
      <button onclick="document.getElementById('overlay').remove()" style="background:none;border:1px solid var(--border);color:var(--dim);padding:8px 16px;font-family:inherit;font-size:7px;cursor:pointer">✖ Nein</button>
    </div>
  </div>`;
  document.body.appendChild(wrap);
}

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

function updateInvScreen(){
  document.getElementById('inv-gold-lbl').textContent=`🪙 ${G.p.gold}`;
  // Sort button
  const sortLabels={'none':'Standard','rarity':'Seltenheit','type':'Typ'};
  const sortModes=['none','rarity','type'];
  let sortBtn=document.getElementById('inv-sort-btn');
  const grid=document.getElementById('inv-grid');
  if(!sortBtn){
    sortBtn=document.createElement('button');
    sortBtn.id='inv-sort-btn';
    sortBtn.style.cssText='font-size:6px;color:var(--dim);background:none;border:1px solid var(--border);padding:4px 8px;cursor:pointer;font-family:inherit;display:block;margin-bottom:6px';
    grid.parentNode.insertBefore(sortBtn,grid);
  }
  if(!G.invSort) G.invSort='none';
  sortBtn.textContent=`Sortierung: ${sortLabels[G.invSort]}`;
  sortBtn.onclick=()=>{
    const next=sortModes[(sortModes.indexOf(G.invSort)+1)%sortModes.length];
    G.invSort=next; updateInvScreen();
  };
  grid.innerHTML='';
  // Build a sorted index array so original inv indices stay valid
  const SLOT_ORDER=['weapon','armor','helm','gloves','boots','acc','pet','rune'];
  const indices=G.p.inv.map((_,i)=>i);
  if(G.invSort==='rarity'){
    indices.sort((a,b)=>{
      const ra=RARITY_ORDER.indexOf(ITEMS[G.p.inv[a].id]?.rarity||'common');
      const rb=RARITY_ORDER.indexOf(ITEMS[G.p.inv[b].id]?.rarity||'common');
      return rb-ra;
    });
  } else if(G.invSort==='type'){
    indices.sort((a,b)=>{
      const sa=ITEMS[G.p.inv[a].id]?.slot; const sb=ITEMS[G.p.inv[b].id]?.slot;
      const ia=sa?SLOT_ORDER.indexOf(sa):(sa===null?SLOT_ORDER.length:SLOT_ORDER.length+1);
      const ib=sb?SLOT_ORDER.indexOf(sb):(sb===null?SLOT_ORDER.length:SLOT_ORDER.length+1);
      return (ia<0?SLOT_ORDER.length:ia)-(ib<0?SLOT_ORDER.length:ib);
    });
  }
  indices.forEach(idx=>{
    const slot=G.p.inv[idx];
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
      div.innerHTML=`${item.icon}${upgLabel}<small>${iname(slot.id).slice(0,9)}</small>${slot.qty>1?`<small>x${slot.qty}</small>`:''}`;
      div.onclick=()=>{ if(slot.equipped&&item.slot&&item.slot!=='pet'){ showUpgradeMenu(idx); } else if(!item.slot){ showConsumableMenu(idx); } else if(item.slot&&!slot.equipped){ showItemCompare(idx); } else { useItem(idx); } };
    }
    let t;
    div.addEventListener('touchstart',()=>{t=setTimeout(()=>{ if(!slot.equipped)confirmSell(idx); },600);},{passive:true});
    div.addEventListener('touchend',()=>clearTimeout(t),{passive:true});
    div.addEventListener('touchmove',()=>clearTimeout(t),{passive:true});
    grid.appendChild(div);
  });
}

function showItemCompare(idx) {
  const slot=G.p.inv[idx]; if(!slot) return; const item=ITEMS[slot.id]; if(!item||!item.slot) return;
  const eqSlot=item.slot; const cur=G.p.eq[eqSlot]; const curItem=cur?ITEMS[cur.id]:null;
  const upg=slot._upgrade||0;
  const newAtk=(item.atk||0)+(eqSlot==='weapon'?upg*3:upg);
  const newDef=(item.def||0)+(eqSlot==='armor'||eqSlot==='helm'?upg*3:upg);
  const curAtk=curItem?(curItem.atk||0):0; const curDef=curItem?(curItem.def||0):0;
  const diff=(s,n,c)=>{const d=n-c;return d>0?`<span class="compare-better">+${d}</span>`:d<0?`<span class="compare-worse">${d}</span>`:`<span class="compare-same">±0</span>`;};
  const rows=[
    curItem?`<div class="compare-row"><span>ATK</span><span>${curAtk}→${newAtk} ${diff('atk',newAtk,curAtk)}</span></div>`:'',
    curItem?`<div class="compare-row"><span>DEF</span><span>${curDef}→${newDef} ${diff('def',newDef,curDef)}</span></div>`:'',
    item.maxHp?`<div class="compare-row"><span>HP</span><span>${curItem?.maxHp||0}→${item.maxHp}</span></div>`:'',
    item.critBonus?`<div class="compare-row"><span>KRIT</span><span>+${Math.floor(item.critBonus*100)}%</span></div>`:'',
    item.evasion?`<div class="compare-row"><span>AUSW.</span><span>+${Math.floor(item.evasion*100)}%</span></div>`:'',
  ].filter(Boolean).join('');
  const curLine=curItem?`<div style="font-size:6px;color:var(--dim);margin-bottom:6px">Aktuell: ${curItem.icon} ${curItem.name}</div>`:'<div style="font-size:6px;color:var(--dim);margin-bottom:6px">Slot leer</div>';
  const btnStyle='display:block;width:100%;background:var(--panel);border:1px solid var(--border);padding:8px;font-family:\'Press Start 2P\',monospace;font-size:6px;cursor:pointer;margin-bottom:6px';
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.88);z-index:100';
  const sellPrice=Math.floor(item.value*0.5);
  wrap.innerHTML=`<div id="overlay-box" style="min-width:240px;max-width:90vw;text-align:center">
    <span style="font-size:16px">${item.icon}</span><br>
    <span style="color:var(--accent)">${item.name}</span> <span style="font-size:6px;color:var(--dim)">[${item.rarity||'common'}]</span><br><br>
    ${curLine}
    ${rows?`<div style="margin-bottom:10px">${rows}</div>`:''}
    <button onclick="useItem(${idx});document.getElementById('overlay').remove()" style="${btnStyle};color:var(--green);border-color:var(--green)">✅ Ausrüsten</button>
    <button onclick="sellItem(${idx});document.getElementById('overlay').remove();refresh()" style="${btnStyle};color:var(--dim)">💱 Verkaufen (${sellPrice}🪙)</button>
    <button onclick="document.getElementById('overlay').remove()" style="background:none;border:none;color:var(--dim);font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer">✖</button>
  </div>`;
  document.body.appendChild(wrap);
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
  if(G.p.gold<price){showOverlay(t('err_gold'));return;}
  G.p.gold-=price; addInv(id); addLog(`🛒 ${iname(id)} ${t('log_bought')}!`); refresh(); updateShopScreen();
}

function renderShopSell(){
  const list=document.getElementById('shop-sell-list'); list.innerHTML='';
  if(!G.p.inv.length){list.innerHTML='<div style="font-size:7px;color:var(--dim);padding:12px">Inventar leer.</div>';return;}
  G.p.inv.forEach((slot,idx)=>{
    const item=ITEMS[slot.id]; if(!item) return; const price=Math.floor(item.value*0.5);
    const row=document.createElement('div'); row.className='shop-row';
    row.innerHTML=`<div class="shop-icon">${item.icon}</div><div class="shop-info"><div class="shop-name">${iname(slot.id)}${slot.qty>1?` x${slot.qty}`:''}</div><div class="shop-stat">${slot.equipped?'[equipped]':''}</div></div><div class="shop-price">${price}🪙</div><button class="shop-btn" ${slot.equipped?'disabled':''} onclick="sellItem(${idx});updateShopScreen()">Sell</button>`;
    list.appendChild(row);
  });
}

function shopItemMinLv(item){
  const v=Math.max(item.atk||0, item.def||0);
  if(v>30) return 30; if(v>20) return 20; return 0;
}
function shopItemBetter(item){
  const sl=item.slot; if(!sl||sl==='rune'||sl==='pet') return false;
  const eq=G.p.eq[sl]; if(!eq) return false;
  const cur=ITEMS[eq.id]; if(!cur) return false;
  return (item.atk||0)>(cur.atk||0) || (item.def||0)>(cur.def||0);
}
function shopBuildRow(buy,id,item){
  const price=Math.ceil(item.value*1.5);
  const parts=[];
  if(item.atk)       parts.push(`ATK+${item.atk}`);
  if(item.def)       parts.push(`DEF+${item.def}`);
  if(item.maxHp)     parts.push(`HP+${item.maxHp}`);
  if(item.maxMp)     parts.push(`MP+${item.maxMp}`);
  if(item.hp)        parts.push(`Heilt ${item.hp}`);
  if(item.mp)        parts.push(`+${item.mp}MP`);
  if(item.xpBonus)   parts.push(`XP+${Math.round(item.xpBonus*100)}%`);
  if(item.goldBonus) parts.push(`Gold+${Math.round(item.goldBonus*100)}%`);
  if(item.critBonus) parts.push(`+${Math.round(item.critBonus*100)}%Krit`);
  const canAfford=G.p.gold>=price;
  const better=shopItemBetter(item);
  const minLv=shopItemMinLv(item);
  const badge=better?`<span style="color:#6f6;font-size:6px;margin-left:3px">⬆ Empfohlen</span>`:'';
  const lvLabel=minLv?`<span style="color:var(--dim);font-size:6px;margin-left:3px">Min. LV ${minLv}</span>`:'';
  const row=document.createElement('div'); row.className='shop-row';
  const btn=`<button class="shop-btn" style="${canAfford?'border-color:var(--accent)':''}" ${canAfford?'':'disabled'} onclick="buyItem('${id}')">Buy</button>`;
  row.innerHTML=`<div class="shop-icon">${item.icon}</div><div class="shop-info"><div class="shop-name">${iname(id)}${badge}${lvLabel}</div><div class="shop-stat">${parts.join('  ')}</div></div><div class="shop-price">${price}🪙</div>${btn}`;
  buy.appendChild(row);
}
function shopCatHeader(buy,label,color){
  const h=document.createElement('div');
  h.style.cssText=`padding:6px 0 2px;font-size:7px;color:${color};width:100%;border-top:1px solid var(--border);margin-top:4px`;
  h.textContent=label; buy.appendChild(h);
}
function updateShopScreen(){
  document.getElementById('shop-gold-val').textContent=G.p.gold;
  const buy=document.getElementById('shop-buy-list'); buy.innerHTML='';
  const cats=[
    {label:'⚔ Waffen',     color:'#e07070', filter:([,it])=>it.buyable&&it.slot==='weapon'},
    {label:'🛡 Rüstung',   color:'#70aaff', filter:([,it])=>it.buyable&&(it.slot==='armor'||it.slot==='helm'||it.slot==='gloves'||it.slot==='boots')},
    {label:'💍 Accessoires',color:'#ffcc55', filter:([,it])=>it.buyable&&it.slot==='acc'},
    {label:'🧪 Tränke',    color:'#70e0a0', filter:([,it])=>it.buyable&&!it.slot},
    {label:'💎 Runen',     color:'#aa66ff', filter:([,it])=>it.buyable&&it.slot==='rune'},
    {label:'🐾 Begleiter', color:'var(--accent)', filter:([,it])=>it.buyable&&it.slot==='pet'},
  ];
  cats.forEach(({label,color,filter},ci)=>{
    const entries=Object.entries(ITEMS).filter(filter);
    if(!entries.length) return;
    shopCatHeader(buy,label,color);
    entries.forEach(([id,item])=>shopBuildRow(buy,id,item));
  });
  if(G.shopMode==='sell') renderShopSell();
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
    const weakLine=f.weakTo?`<span style="color:#52c07a;font-size:5px">⚡ Schwach: ${f.weakTo}</span>`:
                   f.element?`<span style="color:var(--dim);font-size:5px">Element: ${f.element}</span>`:'';
    const dropIds=(DROPS[id]||[]).slice(0,3).map(d=>ITEMS[d.id]?.icon||'').join('');
    return `<div style="padding:6px 0;border-bottom:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:7px;margin-bottom:2px">
        <span>${f.icon||'👾'} ${name} ${weakLine}</span>
        <span style="color:var(--dim);font-size:6px">👁${b.seen} 💀${b.killed}${dropIds?' '+dropIds:''}</span>
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
    row('Niederlagen',bs.lost||0),
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

// ── RARE POPUP ───────────────────────────────────────────────
function showRarePopup(item) {
  const el = document.createElement('div');
  el.className = 'rare-popup ' + (item.rarity||'');
  el.innerHTML = `${item.icon||'📦'} ${item.rarity==='legendary'?(G.lang==='en'?'LEGENDARY':'LEGENDÄR'):(G.lang==='en'?'EPIC':'EPISCH')}!<br><span style="font-size:7px;color:inherit">${iname(item.id)||item.name}</span>`;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 2400);
}

// ── BATTLE HISTORY ────────────────────────────────────────────
function recordBattleHistory(e, result) {
  if (!G.battleHistory) G.battleHistory = [];
  G.battleHistory.unshift({ name:e.name, result, dmgDealt:G.battleStats.dmgDealt, dmgTaken:G.battleStats.dmgTaken, ts:Date.now() });
  if (G.battleHistory.length > 15) G.battleHistory.pop();
}

function showBattleHistory() {
  const h = G.battleHistory||[];
  const rows = h.length ? h.map(b=>{
    const t = new Date(b.ts); const timeStr=`${t.getHours().toString().padStart(2,'0')}:${t.getMinutes().toString().padStart(2,'0')}`;
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);font-size:6px">
      <span style="color:${b.result==='win'?'var(--green)':'#e05252'}">${b.result==='win'?'✅':'💀'} ${b.name.slice(0,16)}</span>
      <span style="color:var(--dim)">${timeStr}</span>
    </div>`;
  }).join('') : '<div style="font-size:7px;color:var(--dim);padding:10px">Noch keine Kämpfe.</div>';
  const wrap=document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:100';
  wrap.innerHTML=`<div id="overlay-box" style="min-width:280px;max-width:90vw;max-height:80vh;overflow-y:auto">
    <div style="text-align:center;color:var(--accent);font-size:9px;margin-bottom:10px">⚔ KAMPF-VERLAUF</div>
    ${rows}
    <br><button onclick="document.getElementById('overlay').remove()" style="width:100%;background:none;border:1px solid var(--border);color:var(--dim);padding:6px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer">✖ Schließen</button>
  </div>`;
  document.body.appendChild(wrap);
}

// ── TITLE SCREEN ─────────────────────────────────────────────
function showTitleScreen() {
  const existing = document.getElementById('overlay');
  if (existing) existing.remove();
  const hasSave = !!localStorage.getItem('pixelquest');
  const wrap = document.createElement('div');
  wrap.id = 'overlay';
  wrap.style.cssText = 'position:fixed;inset:0;background:var(--bg);z-index:200;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0';
  wrap.innerHTML = `
    <div style="text-align:center;padding:20px">
      <div style="font-size:7px;color:var(--dim);letter-spacing:2px;margin-bottom:8px">A PIXEL ADVENTURE</div>
      <div style="font-size:18px;color:var(--accent);text-shadow:0 0 20px rgba(232,201,107,0.6);line-height:1.3;margin-bottom:4px">PIXEL</div>
      <div style="font-size:18px;color:var(--accent);text-shadow:0 0 20px rgba(232,201,107,0.6);line-height:1.3;margin-bottom:20px">QUEST</div>
      <div style="font-size:7px;color:var(--accent2);margin-bottom:32px">RPG</div>
      <canvas id="title-player-canvas" width="64" height="64" style="display:block;margin:0 auto 24px;image-rendering:pixelated"></canvas>
      ${hasSave ? `
        <button onclick="continueSave()" style="display:block;width:200px;background:var(--accent);color:var(--bg);border:none;border-bottom:4px solid var(--accent2);padding:14px;font-family:'Press Start 2P',monospace;font-size:8px;cursor:pointer;margin:0 auto 10px">&#9654; CONTINUE</button>
        <button onclick="newGameConfirm()" style="display:block;width:200px;background:var(--panel);color:var(--dim);border:1px solid var(--border);padding:10px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer;margin:0 auto">&#10010; NEW GAME</button>
      ` : `
        <button onclick="startNewGame()" style="display:block;width:200px;background:var(--accent);color:var(--bg);border:none;border-bottom:4px solid var(--accent2);padding:14px;font-family:'Press Start 2P',monospace;font-size:8px;cursor:pointer;margin:0 auto">&#9654; START GAME</button>
      `}
      <div style="font-size:5px;color:var(--dim);margin-top:24px">v1.0 · og34</div>
    </div>
  `;
  document.body.appendChild(wrap);
  setTimeout(() => {
    const c = document.getElementById('title-player-canvas');
    if (c) drawSprite(c, 'warrior', 4, null);
  }, 50);
}

function continueSave() {
  document.getElementById('overlay')?.remove();
  refresh();
  applyLang();
}

function newGameConfirm() {
  const existing = document.getElementById('overlay');
  if (existing) existing.remove();
  const wrap = document.createElement('div'); wrap.id='overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.92);z-index:201';
  wrap.innerHTML=`<div id="overlay-box" style="text-align:center">
    <div style="margin-bottom:12px;font-size:8px">&#9888; Start new game?<br><span style="font-size:6px;color:var(--dim)">Current save will be lost.</span></div>
    <button onclick="startNewGame()" style="display:block;width:100%;background:var(--red);color:#fff;border:none;padding:10px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer;margin-bottom:8px">&#10004; Yes, new game</button>
    <button onclick="document.getElementById('overlay').remove();showTitleScreen()" style="background:none;border:1px solid var(--border);color:var(--dim);padding:8px;font-family:'Press Start 2P',monospace;font-size:7px;cursor:pointer;width:100%">&#10006; Cancel</button>
  </div>`;
  document.body.appendChild(wrap);
}

function startNewGame() {
  const hasSave = !!localStorage.getItem('pixelquest');
  if (hasSave) { localStorage.removeItem('pixelquest'); location.reload(); }
  else { document.getElementById('overlay')?.remove(); promptName(() => save()); }
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
  if(G.p.kills===0&&G.p.level===1&&!G.tutorialDone) showWelcomeOverlay();
  else setTimeout(()=>showTutorialHint(0),800);
  if(window._onNameDone) window._onNameDone();
}

function showWelcomeOverlay(){
  const wrap=document.createElement('div'); wrap.id='welcome-overlay';
  wrap.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.95);z-index:110';
  const bodyLines=t('welcome_body').replace(/\n/g,'<br>');
  wrap.innerHTML=`<div style="min-width:270px;max-width:90vw;text-align:center;padding:18px">
    <div style="font-size:11px;color:var(--accent);margin-bottom:12px">⚔ ${t('welcome_title')}, ${G.p.name}!</div>
    <div style="font-size:7px;color:var(--text);text-align:left;line-height:2;margin-bottom:16px">${bodyLines}</div>
    <button onclick="dismissWelcome()" style="width:100%;background:var(--accent);color:var(--bg);border:none;padding:10px;font-family:'Press Start 2P',monospace;font-size:8px;cursor:pointer">${t('welcome_btn')}</button>
  </div>`;
  document.body.appendChild(wrap);
}

function dismissWelcome(){
  document.getElementById('welcome-overlay')?.remove();
  G.tutorialDone=true;
  save();
  setTimeout(()=>showTutorialHint(0),400);
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
    <div style="display:flex;align-items:center;gap:8px;justify-content:center;margin-bottom:14px">
      <span style="font-size:7px;color:var(--dim)">${t('lang_label')}:</span>
      <button onclick="G.lang='en';save();refresh();document.getElementById('overlay').remove()" style="background:none;border:1px solid var(--border);padding:4px 10px;font-family:inherit;font-size:7px;cursor:pointer;color:${G.lang==='en'?'var(--accent)':'var(--dim)'}">EN</button>
      <button onclick="G.lang='de';save();refresh();document.getElementById('overlay').remove()" style="background:none;border:1px solid var(--border);padding:4px 10px;font-family:inherit;font-size:7px;cursor:pointer;color:${G.lang==='de'?'var(--accent)':'var(--dim)'}">DE</button>
    </div>
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

// ── TUTORIAL ──────────────────────────────────────────────────
const TUTORIAL_HINTS = [
  '💡 Tippe ERKUNDEN um Abenteuer zu erleben!',
  '💡 Skills im Kampf verursachen mehr Schaden!',
  '💡 Ausrüstung im Inventar anlegen für Boni!',
  '💡 Im Shop kannst du Items kaufen & verkaufen.',
  '💡 Tagesquests geben täglich Belohnungen!',
  '💡 Crafting: kombiniere Ressourcen zu Items!',
  '💡 Levelup: vergib Stat-Punkte unter Charakter!',
];

function showTutorialHint(step) {
  if (step >= TUTORIAL_HINTS.length) return;
  const el = document.createElement('div');
  el.className = 'tutorial-hint';
  el.textContent = TUTORIAL_HINTS[step];
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 4800);
}

// ── MORE MENU ─────────────────────────────────────────────────
function showMoreMenu() {
  document.getElementById('overlay')?.remove();
  const wrap = document.createElement('div');
  wrap.id = 'overlay';
  wrap.style.cssText = 'position:fixed;inset:0;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.85);z-index:100';
  wrap.innerHTML = `<div id="overlay-box" style="width:100%;max-width:400px;max-height:80dvh;overflow-y:auto;padding:12px 12px 20px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <span style="color:var(--accent);font-size:9px">☰ MEHR</span>
      <button onclick="closeOverlay()" style="background:none;border:1px solid var(--border);color:var(--dim);padding:4px 8px;font-family:inherit;font-size:7px;cursor:pointer">✖</button>
    </div>
    <div class="more-cat">${t('more_combat')}</div>
    <button class="more-btn" onclick="closeOverlay();startBossRush()">⚡ Boss Rush</button>
    <button class="more-btn" onclick="closeOverlay();startArena()">🏟 Arena</button>
    <button class="more-btn" onclick="closeOverlay();showDailyChallenge()">🎯 Daily Challenge</button>
    <div class="more-cat">${t('more_dungeons')}</div>
    <button class="more-btn" onclick="closeOverlay();showDailyDungeon()">🏰 Daily Dungeon</button>
    <button class="more-btn" onclick="closeOverlay();showSeasonalDungeon()">🌸 Saisonaler Dungeon</button>
    <div class="more-cat">${t('more_char')}</div>
    <button class="more-btn" onclick="closeOverlay();showCompanions()">🧑‍🤝‍🧑 Begleiter</button>
    <button class="more-btn" onclick="closeOverlay();showGuild()">🏛 Gilde</button>
    <button class="more-btn" onclick="closeOverlay();showPrestigeShop()">⭐ Prestige-Shop</button>
    <button class="more-btn" onclick="closeOverlay();showSpriteSelect()">🎨 Sprite</button>
    <div class="more-cat">${t('more_info')}</div>
    <button class="more-btn" onclick="closeOverlay();showStats()">📊 Stats</button>
    <button class="more-btn" onclick="closeOverlay();showHighscore()">🏆 Highscore</button>
    <button class="more-btn" onclick="closeOverlay();showBattleHistory()">📜 Kampfhistorie</button>
    <button class="more-btn" onclick="closeOverlay();showBestiary()">📗 Bestiary</button>
    <div class="more-cat">${t('more_system')}</div>
    <button class="more-btn" onclick="closeOverlay();showSettings()">⚙ Einstellungen</button>
    <button class="more-btn" onclick="closeOverlay();showBank()">🏦 Bank</button>
    <button class="more-btn" onclick="closeOverlay();showLootFilter()">🗑 Loot-Filter</button>
    <button class="more-btn" onclick="closeOverlay();showRuneCombine()">💫 Runen</button>
  </div>`;
  document.body.appendChild(wrap);
}

// ── LEVEL UP SCREEN ──────────────────────────────────────────
function showLevelUpScreen(oldLv, newLv, gains) {
  const existing = document.getElementById('levelup-overlay');
  if (existing) existing.remove();
  const wrap = document.createElement('div');
  wrap.id = 'levelup-overlay';
  wrap.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.85);z-index:150;animation:fadeIn .3s ease';
  wrap.innerHTML = `
    <div style="text-align:center;padding:24px;max-width:280px">
      <div style="font-size:7px;color:var(--dim);margin-bottom:6px;letter-spacing:2px">LEVEL UP!</div>
      <div style="font-size:28px;color:var(--accent);text-shadow:0 0 30px rgba(232,201,107,0.8);margin-bottom:4px">${newLv}</div>
      <div style="font-size:7px;color:var(--dim);margin-bottom:20px">${oldLv} → ${newLv}</div>
      <div style="font-size:6px;color:var(--text);line-height:2.2;margin-bottom:20px">
        ${gains.atk?`<div>⚔ ATK <span style="color:var(--accent)">+${gains.atk}</span></div>`:''}
        ${gains.def?`<div>🛡 DEF <span style="color:var(--accent)">+${gains.def}</span></div>`:''}
        ${gains.maxHp?`<div>❤ MaxHP <span style="color:var(--accent)">+${gains.maxHp}</span></div>`:''}
        ${gains.maxMp?`<div>💙 MaxMP <span style="color:var(--accent)">+${gains.maxMp}</span></div>`:''}
        ${gains.statPoints?`<div>⭐ <span style="color:var(--accent)">${gains.statPoints} Stat Point${gains.statPoints>1?'s':''}</span> to assign!</div>`:''}
      </div>
      <button onclick="document.getElementById('levelup-overlay').remove()"
        style="background:var(--accent);color:var(--bg);border:none;border-bottom:3px solid var(--accent2);padding:12px 32px;font-family:'Press Start 2P',monospace;font-size:8px;cursor:pointer">
        ▶ CONTINUE
      </button>
    </div>
  `;
  document.body.appendChild(wrap);
  // auto-dismiss after 4 seconds if player doesn't tap
  setTimeout(() => { document.getElementById('levelup-overlay')?.remove(); }, 4000);
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
