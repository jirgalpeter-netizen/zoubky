'use strict';
// ===== Hráč: jméno a rod =====
const NAMES = {
  f: [['Laurinka', 'Laurinko'], ['Jasmínka', 'Jasmínko'], ['Anička', 'Aničko'], ['Eliška', 'Eliško'], ['Terezka', 'Terezko'], ['Natálka', 'Natálko'], ['Adélka', 'Adélko'], ['Sofinka', 'Sofinko'], ['Viktorka', 'Viktorko'], ['Kristýnka', 'Kristýnko'], ['Emička', 'Emičko'], ['Julinka', 'Julinko'], ['Barunka', 'Barunko'], ['Klárka', 'Klárko'], ['Lucinka', 'Lucinko'], ['Nelinka', 'Nelinko'], ['Zuzanka', 'Zuzanko'], ['Amálka', 'Amálko'], ['Rozárka', 'Rozárko']],
  m: [['Honzík', 'Honzíku'], ['Tomášek', 'Tomášku'], ['Matýsek', 'Matýsku'], ['Vojtíšek', 'Vojtíšku'], ['Adámek', 'Adámku'], ['Filípek', 'Filípku'], ['Kubík', 'Kubíku'], ['Ondrášek', 'Ondrášku'], ['Davídek', 'Davídku'], ['Lukášek', 'Lukášku'], ['Šimonek', 'Šimonku'], ['Toník', 'Toníku'], ['Vašík', 'Vašíku'], ['Kryštůfek', 'Kryštůfku'], ['Martínek', 'Martínku'], ['Péťa', 'Péťo'], ['Jiříček', 'Jiříčku'], ['Mikulášek', 'Mikulášku']]
};
function prof() { return Save.profile || { g: 'f', name: 'Laurinka', voc: 'Laurinko', avId: 'a1' }; }
if (Save.profile && !Save.profile.avId) { Save.profile.avId = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'][Save.profile.av] || 'a1'; Save.save(); } // převod z verze 3.1
function G(x) { return x && typeof x === 'object' && !Array.isArray(x) && x.f ? x[prof().g] : x; }
function sayName(text, queue) { say(prof().voc + '!', queue); if (text) say(text, true); }
function playerChar() { return AVATARS.find(a => a.id === prof().avId) || AVATARS[0]; }

// ===== Věty hry (z nich se generuje nahraný hlas) =====
const P = {
  hello: 'Vítej v Zoubkové zemi. Ťukni na kamaráda, který potřebuje vyčistit zoubky.',
  mapAgain: 'Kam půjdeme teď? Ťukni na kamaráda.',
  mapLocked: 'Tam ještě nemůžeme. Nejdřív pomoz kamarádovi, který je na řadě.',
  mapWalk: 'Jdeme dál!',
  mapAll: { f: 'Vyčistila jsi zoubky všem kamarádům. Jsi opravdová zoubková víla!', m: 'Vyčistil jsi zoubky všem kamarádům. Jsi opravdový zoubkový rytíř!' },
  mapIdle: 'Ťukni na kamaráda.',
  open: c => 'Otevři pusu, ' + c.voc + '! Áááá!',
  pick: 'Vyber si kartáček, který se ti líbí!',
  picked: 'Ten je krásný!',
  unscrew: 'Nejdřív odšroubuj víčko. Točíme prstem dokola!',
  capOff: 'Víčko je dole!',
  bring: 'Přilož pastu ke kartáčku.',
  tapSq: 'Ťukej na tubu a pasta poleze ven!',
  swipeSq: 'Vymačkej pastu. Přejeď prstem po tubě až k hubičce!',
  holdSq: 'Zmáčkni tubu a drž!',
  pasteDone: 'To je pasty! Super.',
  screw: 'A teď víčko zase zašroubujeme. Ťukni na víčko a točíme dokola!',
  capOn: 'Hotovo, tuba je zavřená!',
  brush: 'Teď čisti zoubky. Drhni, drhni!',
  praise: ['Pryč, bacile!', 'Bacil je pryč!', 'Super!', 'Šikulka!', 'Jen tak dál!'],
  hintGerm: 'Tady je ještě bacil!',
  hintTooth: 'Tady je ještě špinavý zoubek.',
  keep: ['Ještě čistíme, ať jsou zoubky krásně bílé!', 'Ještě chvilku! Zoubky to mají rády.', 'Drhni dál, hodiny ještě běží!'],
  snack: c => 'Mňam, ' + c.name + ' si dal svačinku! Zoubky jsou zase špinavé. Čistíme!',
  germsCome: 'Pozor, přicházejí další bacilové!',
  jump: { nose: 'Hihi! Bacil vyskočil na nos! Vyčisti ho!', cheek: 'Bacil skočil na tvářičku! Rychle ho vyčisti!', head: 'Bacil vylezl až na čelo! Chyť ho kartáčkem!' },
  hop: 'Hihi, bacil utekl! Chyť ho!',
  hopIntro: 'Pozor, bacilové tu umí utíkat!',
  starWave: 'Na zoubku se objevila zlatá hvězdička! Vyčisti ji a je tvoje!',
  starGot: 'Hvězdička je tvoje!',
  boss: 'Pozor, velký bacil! Drhni ho pořádně!',
  bossSplit: 'Rozpadl se na malé bacily! Chyť je!',
  gapIntro: 'Mezi zoubky se schovalo jídlo. Kartáčkem nahoru a dolů!',
  gapHint: 'Nahoru a dolů!',
  gapDone: 'Mezi zoubky je čisto!',
  toughIntro: 'Tenhle zoubek je hodně špinavý. Musíš drhnout víc!',
  tongue: 'A teď jazýček! Vyčisti i jazýček.',
  tongueDone: 'Jazýček je čistý!',
  cleanDone: 'Hotovo! Zoubky jsou čisté. Teď vypláchneme pusu.',
  rinse: 'Vezmi hrneček a dones ho k pusince.',
  rinseGo: 'Plách, plách! Vypláchneme pěnu.',
  rinseRemind: 'Dones hrneček k pusince.',
  quiz: 'Co je pro zoubky zdravé? Ťukni na to.',
  quizRemind: 'Co je pro zoubky zdravé?',
  wrong: 'Kdepak, sladkosti zoubkům škodí.',
  reward: c => 'Hurá! ' + c.name + ' má čisté zoubky! Tady máš nálepku.',
  remember: 'A nezapomeň: zoubky si čistíme ráno a večer!',
  albumHello: 'Každá nálepka má v knížce svoje místo. Najdi ho a nalep ji tam.',
  albumEmpty: 'Zatím tu nejsou nálepky. Vyčisti kamarádům zoubky a dostaneš je.',
  press: 'Teď ji pořádně přitlač prstíkem!',
  stuck: ['Drží!', 'Krásně přilepená!', 'Paráda!'],
  tear: 'Ríííp! Stránka je pryč. Tady je nová.',
  togChoose: 'Jak dlouho budeme čistit? Vyber hodiny.',
  togStart: 'Čistíme zoubky spolu! Vezmi si svůj kartáček a čisti se mnou.',
  togQ: ['Nahoře na jedné straně. Drhni, drhni!', 'Teď nahoře na druhé straně.', 'A teď dole na jedné straně.', 'Dole na druhé straně. Už jen kousek!'],
  togEnd: { f: 'Výborně! Vyčistila sis zoubky. Teď vypláchni pusu.', m: 'Výborně! Vyčistil sis zoubky. Teď vypláchni pusu.' },
  whoAreYou: 'Ahoj! Kdo jsi ty? Ťukni na sebe.',
  ultra: 'Pozor, ultrabacil! Je silný, musíš ho drhnout dlouho!',
  snackShoot: 'Padá jídlo! Sestřel ho kartáčkem, ať nespadne do pusy!',
  wrongBrush: 'Ajaj, sladkost! Zoubky jsou zase špinavé. Ještě chvilku čistíme!',
  minis: 'Na co máš chuť? Vyber si hru.',
  forkAsk: 'Kudy půjdeme? Vyber cestičku.',
  paint: 'Vyber barvičku a ťukni do obrázku.',
  ears: 'Vyčisti oušku. Jemně, ať to nebolí!',
  bubbles: 'Prasknou bubliny! Ťukej na ně.',
  balloons: 'Vyber si balónek!',
  hurray: ['Hurá!', 'Výborně!', 'Paráda!', 'Jsi šikula!'],
  bonusSticker: 'Nálepka navíc!',
  thatsYou: 'To jsi ty? Super!',
  nameAsk: 'A jak se jmenuješ? Ať tě můžu oslovovat.'
};
function allPhrases() {
  const out = new Set();
  const add = v => { if (typeof v === 'string') out.add(v); else if (Array.isArray(v)) v.forEach(add); else if (typeof v === 'function') CHARS.forEach(c => out.add(v(c))); else if (v && typeof v === 'object') Object.values(v).forEach(add); };
  for (const k in P) add(P[k]);
  CHARS.forEach(c => { out.add(c.story); out.add(c.name + '!'); });
  Object.values(FOOD).forEach(f => f.yes && out.add(f.yes));
  Object.values(STNAME).forEach(n => out.add(n + '!'));
  for (const g of ['f', 'm']) NAMES[g].forEach(([n, v]) => { out.add(v + '!'); out.add('Ahoj, ' + v + '!'); });
  return [...out];
}

// ===== Obtížnost levelů =====
// čas drhnutí: začíná na 5 s a postupně roste na 3 minuty (pořád se něco děje, aby dítě udrželo pozornost)
const DUR = [5, 8, 12, 16, 20, 25, 30, 36, 43, 50, 60, 70, 80, 92, 105, 120, 135, 150, 165, 180];
function lvlCfg(i) {
  const pool = ['germs'];
  if (i >= 1) pool.push('snack');
  if (i >= 2) pool.push('gaps');
  if (i >= 3) pool.push('jump');
  if (i >= 4) pool.push('star', 'tough');
  if (i >= 6) pool.push('ultra');
  return {
    dur: DUR[i] || 180, pool,
    germs: Math.min(2 + Math.floor(i / 3), 6), gaps: i >= 2 ? 1 + (i >= 8 ? 1 : 0) : 0, tough: i >= 4 ? 1 + Math.floor(i / 8) : 0,
    hops: i >= 12 ? 2 : i >= 5 ? 1 : 0, tongue: i >= 5, ultra: i >= 4 ? 1 + Math.floor((i - 4) / 5) : 0, boss: i === CHARS.length - 1, rate: 0.0036, quiz3: i >= 6,
    intro: { gaps: i === 2, hop: i === 5, tough: i === 4, ultra: i === 4 }
  };
}

// ===== Odměna: nálepky se musí vydělat =====
function hasSticker(id) { return (Save.inv[id] || 0) > 0 || !!Save.placed[id]; }
function unearnedItems() { return ITEM_STICKERS.filter(id => !hasSticker(id)); }
function giveItem(prefer) { const left = unearnedItems(); if (!left.length) return null; const id = prefer && left.indexOf(prefer) >= 0 ? prefer : pick(left); Save.inv[id] = 1; Save.save(); return id; }
function giveReward(c, extra) {
  const got = [];
  if (c && Save.done.indexOf(c.id) < 0) { Save.done.push(c.id); if (!hasSticker('c:' + c.id)) { Save.inv['c:' + c.id] = 1; got.push('c:' + c.id); } }
  if (extra) for (const e of extra) { const id = giveItem(e); if (id) got.push(id); }
  if (c) Save.unlocked = Math.max(Save.unlocked, Math.min(CHARS.length - 1, c.idx + 1));
  Save.rewards++; Save.save();
  return got;
}
const BAL_COL = ['#ff4d6d', '#ffd23f', '#4cd964', '#3fa9f5', '#b06cff', '#ff9f1a'];
const Reward = {
  active: false, t: 0, ids: [], btns: [], bal: [], popped: -1, popT: 0, bonus: null,
  // chance = pravděpodobnost nálepky navíc v jednom z balónků
  start(ids, btns, chance) {
    this.active = true; this.t = 0; this.ids = ids; this.btns = btns; this.popped = -1; this.popT = 0;
    const left = unearnedItems();
    this.bonus = left.length && Math.random() < (chance == null ? 0.35 : chance) ? pick(left) : null;
    const cols = shuffle(BAL_COL), n = 3, x0 = ids.length ? 640 : 520, gap = ids.length ? 210 : 260;
    this.bal = Array.from({ length: n }, (_, i) => ({ x: x0 + i * gap, y: 370, c: cols[i], ph: rnd(0, 6), fly: 0, pop: -1 }));
    Snd.fanfare(); buzz(80); confetti(90); burst(800, 300, 40, { smin: 200, smax: 700, max: 20 });
    if (firstTimes('balloons', 2)) say(P.balloons, true); else praise(pick(P.hurray), 0);
  },
  update(dt) {
    if (!this.active) return; this.t += dt;
    if (this.t > 0.6 && this.t < 5 && Math.random() < dt * 1.0) confetti(20);
    if (this.popped >= 0) { this.popT += dt; for (const b of this.bal) if (b.pop < 0 && b !== this.bal[this.popped]) b.fly += dt; }
    else if (this.t > 14 && T - lastSay > IDLE_REPEAT) say(P.balloons);
  },
  balPos(b) { return { x: b.x + Math.sin(T * 1.3 + b.ph) * 14, y: b.y + Math.sin(T * 1.9 + b.ph) * 16 - b.fly * b.fly * 260 }; },
  btnsReady() { return this.popped >= 0 ? this.popT > 1.4 : this.t > 16; },
  draw() {
    if (!this.active) return;
    const n = this.ids.length;
    this.ids.forEach((id, i) => {
      const k = easeBack((this.t - i * 0.5) / 0.8), x = 250, y = n === 1 ? 330 : 210 + i * 240, r = n === 1 ? 125 : 100;
      ctx.save(); ctx.translate(x, y); ctx.rotate(T * 0.4 + i); ctx.globalAlpha = 0.5 * ease((this.t - i * 0.5) / 0.5);
      for (let j = 0; j < 12; j++) { ctx.fillStyle = j % 2 ? '#fff6a0' : '#ffffff'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r * 1.8 * k, j * Math.PI / 6, (j + 0.5) * Math.PI / 6); ctx.closePath(); ctx.fill(); }
      ctx.restore();
      if (k > 0) drawSticker(id, x, y + Math.sin(T * 3 + i) * 8, r * k, Math.sin(T * 2 + i) * 0.1);
    });
    this.bal.forEach((b, i) => {
      const p = this.balPos(b), k = easeBack((this.t - 0.4 - i * 0.15) / 0.6);
      if (b.pop >= 0) { // co bylo uvnitř
        const q = ease(this.popT / 0.6);
        if (this.bonus) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(T * 0.5); ctx.globalAlpha = 0.6; for (let j = 0; j < 12; j++) { ctx.fillStyle = j % 2 ? '#fff6a0' : '#ffffff'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 170 * q, j * Math.PI / 6, (j + 0.5) * Math.PI / 6); ctx.closePath(); ctx.fill(); } ctx.restore(); drawSticker(this.bonus, p.x, p.y + Math.sin(T * 3) * 6, 100 * easeBack(this.popT / 0.6), Math.sin(T * 2) * 0.1); }
        else { ctx.fillStyle = '#ffcc00'; starPath(p.x, p.y, 70 * q, 32 * q, 5); ctx.fill(); ctx.strokeStyle = '#e69500'; ctx.lineWidth = 4; ctx.stroke(); }
        return;
      }
      if (k <= 0 || p.y < -200) return;
      ctx.save(); ctx.translate(p.x, p.y); ctx.scale(k, k);
      ctx.strokeStyle = 'rgba(80,80,80,.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 95); ctx.quadraticCurveTo(Math.sin(T * 2 + b.ph) * 20, 160, 0, 230); ctx.stroke();
      ctx.fillStyle = b.c; ctx.beginPath(); ctx.ellipse(0, 0, 78, 95, 0, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-12, 100); ctx.lineTo(12, 100); ctx.lineTo(0, 88); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.ellipse(-28, -36, 16, 28, -0.5, 0, 7); ctx.fill();
      ctx.restore();
    });
    if (this.popped < 0 && this.t > 3) { const b = this.bal[Math.floor(T / 2) % this.bal.length], p = this.balPos(b); drawHand(p.x + 10, p.y + 30, T, 0.9); }
    for (const b of this.btns) { b.sc = this.btnsReady() ? easeBack((this.popped >= 0 ? this.popT - 1.4 : this.t - 16) / 0.5 - b.delay) : 0; if (b.sc > 0.01) drawBtn(b); }
  },
  down(x, y) {
    if (!this.active || this.t < 0.8) return false;
    if (this.popped < 0) {
      for (let i = 0; i < this.bal.length; i++) {
        const b = this.bal[i], p = this.balPos(b);
        if (Math.abs(x - p.x) < 90 && y > p.y - 110 && y < p.y + 120) {
          this.popped = i; b.pop = 0; this.popT = 0; Snd.pop(); Snd.noise(0.15, { f: 4000, vol: 0.4, ft: 'highpass' }); buzz(60);
          burst(p.x, p.y, 40, { colors: [b.c, '#ffffff', '#ffd700'], smin: 200, smax: 700 });
          if (this.bonus) { Save.inv[this.bonus] = 1; Save.save(); setTimeout(() => { Snd.sparkle(); Snd.fanfare(); }, 250); say(P.bonusSticker, true); }
          else Snd.sparkle();
          if (Save.rewards % 4 === 0) setTimeout(() => sayName(P.remember, true), 1800);
          return true;
        }
      }
    }
    if (!this.btnsReady()) return false;
    const b = hitBtn(this.btns, x, y); if (b) { Snd.tap(); b.fn(); return true; } return false;
  }
};

// ===== Level =====
const FCX = 800, FCY = 380, FR = 340, FOAM_LIFE = 1.1;
const BRUSH_SC = 1.3, BRUSH_OFF = { x: -50, y: -95 };
const FACE_SPOTS = [{ k: 'nose', x: 0, y: -0.2 }, { k: 'cheek', x: -0.66, y: -0.1 }, { k: 'cheek', x: 0.66, y: -0.1 }, { k: 'head', x: 0, y: -0.78 }];
const Lv = {
  enter(ci) {
    this.ci = ci; this.c = CHARS[ci]; this.cfg = lvlCfg(ci);
    this.phase = 'intro'; this.pt = 0; this.open = 0; this.veil = 0;
    this.fullH = FR * 0.67;
    this.teeth = makeTeeth(this.c.teeth, this.c.food, 1);
    layoutTeeth(this.teeth, this.mouthRect(1), this.fullH);
    this.gaps = []; this.germs = []; this.foam = []; this.foamAcc = 0;
    this.addGaps(this.cfg.gaps); this.makeTough(this.cfg.tough);
    for (let k = 0; k < this.cfg.germs; k++) this.addGerm(rndi(0, this.teeth.length - 1), { c: GERMC[k % GERMC.length], hops: this.cfg.hops });
    for (let k = 0; k < this.cfg.ultra; k++) this.addUltra();
    this.fallers = [];
    this.brush = { x: PB.x, y: PB.y, held: false, speed: 0, sc: PB.sc, flip: 1, flipT: 1, ang: -0.15, angT: 1 };
    this.cup = { x: 1390, y: 560, rx: 1390, ry: 560, held: false, gx: 0, gy: 0, pour: -1 };
    this.tg = { k: 0, dirt: 1, spots: Array.from({ length: 9 }, (_, i) => ({ u: rnd(-0.7, 0.7), v: rnd(-0.6, 0.6), r: rnd(14, 24), k: i / 9 })) };
    this.brushT = 0; this.waveN = 0; this.lastWave = null; this.waveWait = -1; this.bonus = [];
    this.lastProgT = 0; this.hintSaidT = 0; this.keepSaidT = 0; this.said = {}; this.sadT = 0; this.chewT = -1; this.quiz = null; this.snackFx = null;
    Music.on = false;
  },
  addGerm(ti, o) { const g = Object.assign({ ti, u: rnd(0.35, 0.65), v: this.teeth[ti].upper ? 0.6 : 0.4, hp: 3, hit: 0, sq: 0, ph: rnd(0, 6), dead: false, r: 25, hops: 0, hopCd: 0, hop: null, face: null }, o); this.germs.push(g); return g; },
  addUltra(hop) { return this.addGerm(rndi(0, this.teeth.length - 1), { ultra: true, c: ['#ffcf3f', '#e8332b'], r: 36, hp: 7, hops: 1, hop: hop || null }); },
  addGaps(n) {
    const pairs = []; this.teeth.forEach((t, i) => { const nx = this.teeth[i + 1]; if (nx && nx.upper === t.upper && !this.gaps.some(g => !g.done && g.a === i)) pairs.push([i, i + 1]); });
    shuffle(pairs).slice(0, n).forEach(([a, b]) => this.gaps.push({ a, b, prog: 0, done: false, f: this.c.food }));
  },
  makeTough(n) { shuffle([...this.teeth.keys()]).slice(0, n).forEach(i => { this.teeth[i].tough = true; this.teeth[i].dirt = 1; this.teeth[i].clean = false; }); },
  mouthRect(open) { const h = this.fullH || FR * 0.67; return { x: FCX - FR * 0.7, y: FCY - FR * 0.05, w: FR * 1.4, h: Math.max(8, h * open) }; },
  facePos(f) { const s = FACE_SPOTS[f]; return { x: FCX + s.x * FR, y: FCY + s.y * FR }; },
  germBase(g) { if (g.face != null) return this.facePos(g.face); const t = this.teeth[g.ti]; return { x: t.x + g.u * t.w, y: t.y + g.v * t.h }; },
  germPos(g) {
    const p = this.germBase(g);
    if (g.hop) { const k = ease(g.hop.t / 0.5); return { x: lerp(g.hop.fx, p.x, k), y: lerp(g.hop.fy, p.y, k) - Math.sin(k * Math.PI) * 140 }; }
    return { x: p.x + Math.sin(T * 3 + g.ph) * 4, y: p.y + Math.cos(T * 4 + g.ph) * 3 };
  },
  gapPos(g) { const a = this.teeth[g.a], b = this.teeth[g.b], h = Math.min(a.h, b.h); return { x: (a.x + a.w + b.x) / 2, y: a.upper ? a.y + h * 0.5 : a.y + a.h - h * 0.5, up: a.upper }; },
  boardClear() {
    const avg = this.teeth.reduce((s, t) => s + t.dirt, 0) / this.teeth.length, maxD = Math.max(...this.teeth.map(t => t.dirt));
    return avg < 0.05 && maxD < 0.2 && !this.germs.some(g => !g.dead) && !this.gaps.some(g => !g.done) && !this.bonus.some(b => !b.got) && !(this.fallers && this.fallers.length);
  },
  setPhase(p) { this.phase = p; this.pt = 0; },
  update(dt) {
    this.pt += dt;
    const P_ = this.phase, b = this.brush;
    this.veil = lerp(this.veil, P_ === 'prep' ? 1 : 0, dt * 4);
    if (P_ === 'intro') { this.open = easeBack(this.pt / 1.0); if (this.pt > 1.6) { this.setPhase('prep'); Prep.start(this); } }
    if (P_ === 'prep' && Prep.update(dt)) { this.setPhase('brush'); this.lastProgT = T; b.x = PB.x; b.y = PB.y; this.startBrushTalk(); }
    if (P_ === 'brush') this.updBrush(dt);
    if (P_ === 'brush' || P_ === 'tongue') {
      if (b.held) { if (b.x < FCX - 70) b.flipT = -1; else if (b.x > FCX + 70) b.flipT = 1; const m0 = this.mouthRect(this.open); b.angT = b.y > m0.y + m0.h * 0.55 ? 0.55 : 1.0; }
      b.flip = lerp(b.flip, b.flipT, dt * 8); b.ang = lerp(b.ang, b.held ? b.angT : -0.15, dt * 8);
      if (P_ === 'brush' && this.open < 1) this.open = Math.min(1, this.open + dt * 3);
      b.sc = lerp(b.sc, BRUSH_SC, dt * 5); b.speed *= Math.pow(0.02, dt); scrubWant = b.held ? clamp(b.speed / 9000, 0, 0.16) : 0; }
    if (P_ === 'tongue') {
      this.tg.k = Math.min(1, this.tg.k + dt * 2);
      if (this.tg.dirt < 0.05) { this.tg.dirt = 0; Snd.sparkle(); this.toClean(); }
      else if (!b.held && T - this.lastProgT > IDLE_HINT && T - this.hintSaidT > IDLE_REPEAT) { this.hintSaidT = T; say(P.tongue); }
    }
    if (P_ === 'clean') {
      this.tg.k = Math.max(0, this.tg.k - dt * 2);
      for (const t of this.teeth) t.dirt *= Math.pow(0.02, dt);
      b.x = lerp(b.x, 1750, dt * 3);
      if (this.pt > 1.3) { for (const t of this.teeth) t.dirt = 0; this.setPhase('rinse'); if (firstTimes('rinse', 2)) say(P.rinse, true); }
    }
    if (P_ === 'rinse') this.updRinse(dt);
    if (P_ === 'quiz') {
      this.open = Math.max(0, this.open - dt * 3);
      this.sadT -= dt;
      if (this.chewT >= 0) { this.chewT += dt; if (this.chewT > 2.4) { this.chewT = -1; if (this.wrongPick) this.again(); else { this.setPhase('reward'); this.startReward(); } } }
      else if (this.pt > 12 && T - lastSay > IDLE_REPEAT) say(P.quizRemind);
    }
    if (P_ === 'reward') Reward.update(dt);
    // pěna: bílá → průhlednější → rychle praskne
    for (const f of this.foam) { f.a = Math.min(1, f.a + dt * 6); f.age = (f.age || 0) + dt; }
    if (this.foam.length && this.foam[0].age > FOAM_LIFE) { const keep = []; for (const f of this.foam) { if (f.age > FOAM_LIFE) { if (Math.random() < 0.25) addPart({ x: f.x, y: f.y, vx: rnd(-40, 40), vy: rnd(-90, -30), life: 0.25, size: f.r * 0.5, type: 'bubble' }); } else keep.push(f); } this.foam = keep; }
    if (this.snackFx) { this.snackFx.t += dt; if (this.snackFx.t > 1.2) this.snackFx = null; }
  },
  startBrushTalk() {
    const i = this.cfg.intro;
    if (firstTimes('brush', 2)) say(P.brush, true);
    if (i.gaps && firstTimes('gapIntro')) say(P.gapIntro, true);
    if (i.tough && firstTimes('toughIntro')) say(P.toughIntro, true);
    if (i.hop && firstTimes('hopIntro')) say(P.hopIntro, true);
    if (this.cfg.ultra && firstTimes('ultraIntro')) say(P.ultra, true);
  },
  updBrush(dt) {
    const b = this.brush, m = this.mouthRect(this.open);
    // hodiny čištění běží jen když se opravdu drhne
    const near = b.held && b.speed > 250 && (b.x > m.x - 60 && b.x < m.x + m.w + 60 && b.y > m.y - 60 && b.y < m.y + m.h + 60 || this.germs.some(g => !g.dead && g.face != null && dist(b.x, b.y, this.germBase(g).x, this.germBase(g).y) < 150));
    if (near) this.brushT = Math.min(this.cfg.dur, this.brushT + dt);
    for (const g of this.germs) {
      g.hit -= dt; g.sq *= Math.pow(0.01, dt); g.hopCd -= dt;
      if (g.hop) { g.hop.t += dt; if (g.hop.t > 0.5) g.hop = null; continue; }
      if (!g.dead && g.face == null && g.hops > 0 && g.hopCd <= 0 && b.held) {
        const p = this.germPos(g);
        if (dist(b.x, b.y, p.x, p.y) < 150) {
          let ti = g.ti; for (let k = 0; k < 10 && ti === g.ti; k++) ti = rndi(0, this.teeth.length - 1);
          g.ti = ti; g.v = this.teeth[ti].upper ? 0.6 : 0.4; g.hops--; g.hopCd = 1.2; g.hop = { fx: p.x, fy: p.y, t: 0 };
          Snd.hihi();
        }
      }
    }
    const m2 = this.mouthRect(this.open);
    for (const f of this.fallers) {
      f.y += f.v * dt; f.x = lerp(f.x, f.tx, dt * 0.9); f.rot += dt * 3;
      if (b.held && f.y > 0 && dist(b.x, b.y, f.x, f.y) < 90) this.shoot(f);
      else if (f.y > m2.y + m2.h * 0.35) { // spadlo do pusy
        f.done = true; Snd.munch(); this.chewFx = 0.6;
        this.teeth.map((t, i) => [Math.abs(t.x + t.w / 2 - f.x), i]).sort((p, q) => p[0] - q[0]).slice(0, 3).forEach(([, i]) => { const t = this.teeth[i]; t.dirt = 1; t.clean = false; });
      }
    }
    if (this.fallers.some(f => f.done)) this.fallers = this.fallers.filter(f => !f.done);
    this.chewFx = Math.max(0, (this.chewFx || 0) - dt);
    const clear = this.boardClear();
    if (clear && this.brushT >= this.cfg.dur) {
      b.held = false; Snd.fanfare(); burst(FCX, FCY + 100, 40, { smin: 150, smax: 600 });
      if (this.cfg.tongue) { this.setPhase('tongue'); if (firstTimes('tongue', 2)) say(P.tongue); this.lastProgT = T; }
      else this.toClean();
      return;
    }
    if (clear) {
      if (this.waveWait < 0) this.waveWait = 0.9;
      this.waveWait -= dt;
      if (this.waveWait <= 0) { this.waveWait = -1; this.spawnWave(); }
    } else if (!b.held && T - this.lastProgT > IDLE_HINT && T - this.hintSaidT > IDLE_REPEAT) {
      this.hintSaidT = T;
      say(this.gaps.some(g => !g.done) && Math.random() < 0.5 ? P.gapHint : this.germs.some(g => !g.dead) ? P.hintGerm : P.hintTooth);
    }
  },
  spawnWave() {
    this.waveN++;
    const isLast = this.brushT >= this.cfg.dur * 0.75;
    let w;
    if (this.cfg.boss && isLast && !this.said.boss) w = 'boss';
    else { const pool = this.cfg.pool.filter(x => x !== this.lastWave); w = pick(pool.length ? pool : this.cfg.pool); }
    this.lastWave = w;
    const n = this.teeth.length;
    if (w === 'germs') {
      const cnt = 2 + Math.floor(this.ci / 4);
      for (let k = 0; k < cnt; k++) { const side = k % 2 ? 1 : -1; this.addGerm(rndi(0, n - 1), { c: GERMC[(k + this.waveN) % GERMC.length], hops: this.cfg.hops, hop: { fx: FCX + side * 700, fy: FCY + rnd(-100, 100), t: -k * 0.25 } }); }
      Snd.hihi();
    }
    if (w === 'snack') { // kamarád dostal chuť: jídlo padá do pusy, kartáčkem ho jde sestřelit
      const m = this.mouthRect(this.open), k = 3 + Math.min(3, Math.floor(this.ci / 5));
      for (let j = 0; j < k; j++) this.fallers.push({ food: pick(['cake', 'choco', 'lolly', 'donut', 'gummy', 'icecream']), x: rnd(250, 1350), y: -90 - j * 190, tx: rnd(m.x + 70, m.x + m.w - 70), v: rnd(160, 210) + this.ci * 5, rot: rnd(0, 6) });
      if (firstTimes('snackShoot', 2)) say(P.snackShoot);
    }
    if (w === 'ultra') { const sd = Math.random() < 0.5 ? -1 : 1; this.addUltra({ fx: FCX + sd * 700, fy: FCY, t: 0 }); Snd.hihi(); }
    if (w === 'gaps') this.addGaps(1 + (this.ci >= 8 ? 1 : 0));
    if (w === 'tough') this.makeTough(1 + Math.floor(this.ci / 8));
    if (w === 'jump') {
      const fi = rndi(0, FACE_SPOTS.length - 1), t = this.teeth[rndi(0, n - 1)];
      this.addGerm(0, { face: fi, c: pick(GERMC), hp: 3, hop: { fx: t.x + t.w / 2, fy: t.y + t.h / 2, t: 0 } });
      Snd.hihi(); if (firstTimes('jump')) say(P.jump[FACE_SPOTS[fi].k]);
    }
    if (w === 'star') { const ti = rndi(0, n - 1); this.bonus.push({ ti, prog: 0, got: false }); Snd.sparkle(); if (firstTimes('star')) say(P.starWave); }
    if (w === 'boss') { this.said.boss = true; this.addGerm(rndi(0, n - 1), { c: ['#c86bff', '#7a2fb0'], r: 48, hp: 8, boss: true, hop: { fx: FCX, fy: -100, t: 0 } }); if (firstTimes('boss', 2)) say(P.boss); }
  },
  shoot(f) { f.done = true; Snd.pop(); Snd.ding(); buzz(25); burst(f.x, f.y, 22, { colors: ['#ffffff', '#ffd700', FOODC[f.food] || '#ff8fc7'], smin: 120, smax: 420 }); praise(pick(P.praise), 30); },
  toClean() { this.setPhase('clean'); },
  updRinse(dt) {
    const c = this.cup, m = this.mouthRect(this.open);
    if (c.pour >= 0) {
      c.pour += dt; const r = c.pour;
      c.x = lerp(c.x, r < 2.0 ? FCX + 250 : 1800, dt * (r < 2.0 ? 8 : 3)); c.y = lerp(c.y, m.y - 90, dt * 8);
      if (r > 0.3 && r < 1.6) {
        for (let i = 0; i < 3; i++) addPart({ x: c.x - 90 + rnd(-10, 10), y: c.y + 40, vx: rnd(-260, -120), vy: rnd(60, 220), g: 900, life: 0.6, size: rnd(7, 12), color: '#7fd6ff', type: 'drop' });
        const k = Math.ceil(this.foam.length * dt * 2.5);
        for (let i = 0; i < k && this.foam.length; i++) { const f = this.foam.splice(Math.floor(Math.random() * this.foam.length), 1)[0]; addPart({ x: f.x, y: f.y, vy: rnd(-200, -60), vx: rnd(-40, 40), life: 0.6, size: f.r, type: 'bubble' }); }
      }
      if (r > 1.6) this.foam = [];
      if (r > 2.6) { this.setPhase('quiz'); this.setupQuiz(); }
      return;
    }
    if (!c.held) { c.x = lerp(c.x, c.rx, dt * 5); c.y = lerp(c.y, c.ry, dt * 5); }
    else if (dist(c.x, c.y, FCX + 150, m.y) < 260 || (Math.abs(c.x - FCX) < 330 && c.y < m.y + m.h)) { c.held = false; c.pour = 0; Snd.splash(); buzz(40); }
    if (this.pt > 12 && T - lastSay > IDLE_REPEAT && !c.held) say(P.rinseRemind);
  },
  setupQuiz() {
    const ids = shuffle(shuffle(GOOD_FOOD).slice(0, 3).concat(shuffle(BAD_FOOD).slice(0, 2)));
    const pos = shuffle([[215, 230], [215, 520], [1390, 165], [1390, 390], [1390, 610]]);
    this.quiz = { r: 92, items: ids.map((id, i) => ({ id, x: pos[i][0], y: pos[i][1], wob: 0, gone: false, fly: -1 })) };
    this.wrongPick = false;
    if (firstTimes('quiz', 2)) say(P.quiz, true);
  },
  // vybral sladkost: zoubky jsou zase špinavé, 10 s čištění navíc a pak znovu nabídka
  again() {
    this.quiz = null; this.wrongPick = false; this.cfg.tongue = false; this.cfg.dur = this.brushT + 10;
    shuffle([...this.teeth.keys()]).slice(0, Math.ceil(this.teeth.length * 0.6)).forEach(i => { this.teeth[i].dirt = 1; this.teeth[i].clean = false; });
    this.cup = { x: 1390, y: 560, rx: 1390, ry: 560, held: false, gx: 0, gy: 0, pour: -1 }; this.foam = []; this.waveWait = -1;
    this.brush.x = PB.x; this.brush.y = PB.y; this.lastProgT = T;
    this.setPhase('brush');
  },
  startReward() {
    const first = Save.done.indexOf(this.c.id) < 0;
    const got = giveReward(this.c, this.bonus.filter(b => b.got).length ? ['star'] : null);
    this.firstTime = first;
    Reward.start(got, [
      { x: 1400, y: 300, r: 92, color: '#4cd964', icon: 'map', delay: 0, pulse: true, fn: () => go('map', { walkFrom: this.firstTime ? this.ci : null }) },
      { x: 1400, y: 540, r: 62, color: '#ff9f1a', icon: 'again', delay: 0.15, fn: () => go('level', this.ci) }
    ], this.firstTime ? 0.3 : 0.45);
  },
  hint() {
    const P_ = this.phase;
    if (P_ === 'rinse' && !this.cup.held && this.cup.pour < 0 && this.pt > 1.5) { const m = this.mouthRect(this.open), k = (T * 0.5) % 1; return { x: lerp(this.cup.x, FCX + 200, ease(k * 1.4)), y: lerp(this.cup.y - 40, m.y, ease(k * 1.4)), still: true }; }
    if (P_ === 'quiz' && this.chewT < 0 && this.pt > 4 && this.quiz) { const it = this.quiz.items.find(i => FOOD[i.id].good); return { x: it.x, y: it.y + 30 }; }
    if (P_ === 'tongue' && !this.brush.held && T - this.lastProgT > 3) { const g = tongueGeom(this.mouthRect(this.open), FR, this.tg.k); return { x: g.x, y: g.y }; }
    if (P_ === 'brush' && !this.brush.held && T - this.lastProgT > 4) {
      const fg = this.germs.find(g => !g.dead && g.face != null); if (fg) return this.germPos(fg);
      const gp = this.gaps.find(g => !g.done); if (gp) { const p = this.gapPos(gp); return { x: p.x, y: p.y, updown: true }; }
      const bn = this.bonus.find(b => !b.got); if (bn) { const t = this.teeth[bn.ti]; return { x: t.x + t.w / 2, y: t.y + t.h / 2 }; }
      const g = this.germs.find(g => !g.dead); if (g) return this.germPos(g);
      let best = null; for (const t of this.teeth) if (!best || t.dirt > best.dirt) best = t;
      if (best && best.dirt > 0.05) return { x: best.x + best.w / 2, y: best.y + best.h / 2 };
      const m = this.mouthRect(this.open); return { x: m.x + m.w * 0.5 + Math.sin(T * 2) * 120, y: m.y + m.h * 0.3, still: true };
    }
    return null;
  },
  down(x, y) {
    const P_ = this.phase;
    if (P_ === 'prep') { Prep.down(x, y); this.px = x; this.py = y; return; }
    if (P_ === 'brush' || P_ === 'tongue') { const b = this.brush; b.held = true; b.x = x + BRUSH_OFF.x * b.flip; b.y = y + BRUSH_OFF.y; return; }
    if (P_ === 'rinse' && this.cup.pour < 0) { const c = this.cup; if (dist(x, y, c.x, c.y) < 190) { c.held = true; c.gx = c.x - x; c.gy = c.y - y; Snd.tap(); } return; }
    if (P_ === 'quiz' && this.quiz && this.chewT < 0) {
      for (const it of this.quiz.items) {
        if (it.gone || dist(x, y, it.x, it.y) > this.quiz.r + 20) continue;
        if (FOOD[it.id].good) { it.fly = 0; this.chewT = 0; Snd.ding(); setTimeout(() => Snd.munch(), 450); buzz(40); burst(it.x, it.y, 25, {}); praise(FOOD[it.id].yes, 20); }
        else { it.fly = 0; this.chewT = 0; this.wrongPick = true; this.sadT = 2.4; setTimeout(() => { Snd.munch(); Snd.wrong(); }, 450); buzz(120); say(P.wrongBrush, true); }
      }
      return;
    }
    if (P_ === 'reward') Reward.down(x, y);
  },
  move(x, y) {
    const P_ = this.phase;
    if (P_ === 'prep') { Prep.move(x, y, x - (this.px || x), y - (this.py || y)); this.px = x; this.py = y; return; }
    if (P_ === 'rinse' && this.cup.held) { this.cup.x = x + this.cup.gx; this.cup.y = y + this.cup.gy; return; }
    const b = this.brush; if ((P_ !== 'brush' && P_ !== 'tongue') || !b.held) return;
    const nx = x + BRUSH_OFF.x * b.flip, ny = y + BRUSH_OFF.y, dx = nx - b.x, dy = ny - b.y, d = Math.hypot(dx, dy);
    b.x = nx; b.y = ny; if (d < 0.5) return;
    b.speed = b.speed * 0.6 + d * 96;
    const m = this.mouthRect(this.open);
    let progressed = false;
    if (P_ === 'tongue') {
      const g = tongueGeom(m, FR, this.tg.k);
      if (((b.x - g.x) / (g.rx + 40)) ** 2 + ((b.y - g.y) / (g.ry + 40)) ** 2 < 1) { this.tg.dirt = Math.max(0, this.tg.dirt - d * 0.0035); this.lastProgT = T; this.spawnFoam(b, d, 0.5); }
      return;
    }
    for (const t of this.teeth) {
      if (b.x > t.x - 45 && b.x < t.x + t.w + 45 && b.y > t.y - 35 && b.y < t.y + t.h + 35 && t.dirt > 0) {
        t.dirt = Math.max(0, t.dirt - d * this.cfg.rate * (t.tough ? 0.4 : 1)); progressed = true;
        if (!t.clean && t.dirt < 0.05) { t.clean = true; t.dirt = 0; t.tough = false; Snd.ding(); burst(t.x + t.w / 2, t.y + t.h / 2, 10, { smin: 60, smax: 220 }); }
      }
    }
    for (const f of this.fallers) if (!f.done && f.y > 0 && dist(b.x, b.y, f.x, f.y) < 90) { this.shoot(f); progressed = true; }
    for (const bn of this.bonus) {
      if (bn.got) continue; const t = this.teeth[bn.ti];
      if (Math.abs(b.x - (t.x + t.w / 2)) < 60 && Math.abs(b.y - (t.y + t.h / 2)) < 60) { bn.prog += d / 300; progressed = true; if (bn.prog >= 1) { bn.got = true; Snd.sparkle(); Snd.ding(); buzz(40); burst(t.x + t.w / 2, t.y + t.h / 2, 30, { colors: ['#ffd700', '#fff3a0'] }); } }
    }
    for (const g of this.gaps) {
      if (g.done) continue; const p = this.gapPos(g);
      if (Math.abs(b.x - p.x) < 58 && Math.abs(b.y - p.y) < 80) {
        g.prog += (Math.abs(dy) + Math.abs(dx) * 0.6) / 120; progressed = true;
        if (g.prog >= 1) { g.done = true; Snd.pop(); Snd.ding(); buzz(30); burst(p.x, p.y, 16, { colors: [FOODC[g.f] || '#fff', '#ffffff', '#ffd700'] }); }
      }
    }
    for (const g of this.germs) {
      if (g.dead || g.hop) continue; const p = this.germPos(g);
      if (dist(b.x, b.y, p.x, p.y) < 55 + g.r && g.hit <= 0) {
        g.hp--; g.hit = 0.22; g.sq = 1; progressed = true;
        if (g.hp <= 0) {
          g.dead = true; Snd.pop(); buzz(g.ultra ? 60 : 25); burst(p.x, p.y, g.boss || g.ultra ? 40 : 18, { colors: [g.c[0], '#ffffff', '#ffd700'] }); if (g.ultra) Snd.sparkle();
          if (g.boss) { const fr = shuffle([...this.teeth.keys()]); for (let k = 0; k < 3; k++) this.addGerm(fr[k], { c: GERMC[k], hp: 2, hops: 1, hop: { fx: p.x, fy: p.y, t: 0 } }); }
          else praise(pick(P.praise), 35);
        } else Snd.boing();
      }
    }
    if (progressed) this.lastProgT = T;
    else if (this.boardClear() && T - this.keepSaidT > 40 && T - lastSay > 20) { this.keepSaidT = T; say(pick(P.keep)); }
    if (b.x > m.x && b.x < m.x + m.w && b.y > m.y && b.y < m.y + m.h) this.spawnFoam(b, d, 1);
  },
  spawnFoam(b, d, k) {
    this.foamAcc += d * k;
    while (this.foamAcc > 13) { this.foamAcc -= 13; this.foam.push({ x: b.x + rnd(-45, 45), y: b.y + rnd(-28, 28), r: rnd(9, 22), a: 0 }); if (this.foam.length > 190) this.foam.shift(); }
  },
  up() { this.brush.held = false; if (this.cup.held) this.cup.held = false; if (this.phase === 'prep') Prep.up(); },
  drawInside() {
    for (const g of this.gaps) {
      if (g.done) continue; const p = this.gapPos(g), dir = p.up ? 1 : -1, off = g.prog * 26 * dir;
      ctx.save(); ctx.globalAlpha = 1 - Math.max(0, g.prog - 0.75) / 0.25;
      ctx.fillStyle = FOODC[g.f] || '#a0682f'; rr(p.x - 9, p.y - 22 + off, 18, 44, 8); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 2; ctx.stroke();
      drawSpot(g.f, p.x, p.y + off + dir * 18, 9, 1.2);
      ctx.restore();
    }
    for (const bn of this.bonus) {
      if (bn.got) continue; const t = this.teeth[bn.ti], s = 22 * (1 - bn.prog * 0.3) + Math.sin(T * 6) * 3;
      ctx.fillStyle = '#ffd700'; starPath(t.x + t.w / 2, t.y + t.h / 2, s, s * 0.45, 5); ctx.fill(); ctx.strokeStyle = '#e69500'; ctx.lineWidth = 3; ctx.stroke();
    }
    for (const g of this.germs) { if (g.dead || g.face != null || g.hop) continue; const p = this.germPos(g); if (g.ultra) drawUltraAura(p.x, p.y, g.r, g.hp); drawGerm(p.x, p.y, g.r, g.c, g.ph, g.sq, g.hit > 0 || (this.brush.held && dist(this.brush.x, this.brush.y, p.x, p.y) < 160), g.boss || g.ultra); }
    for (const f of this.foam) { const age = f.age || 0, al = age < 0.25 ? 0.92 : 0.92 * Math.max(0, 1 - (age - 0.25) / (FOAM_LIFE - 0.25)), r = f.r * f.a * (1 + age * 0.15); ctx.fillStyle = 'rgba(255,255,255,' + al * 0.95 + ')'; ctx.beginPath(); ctx.arc(f.x, f.y, r, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(160,210,240,' + Math.min(0.85, al + 0.2) + ')'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,' + Math.min(1, al + 0.3) + ')'; ctx.beginPath(); ctx.arc(f.x - r * 0.35, f.y - r * 0.35, r * 0.25, 0, 7); ctx.fill(); }
  },
  draw() {
    bgBath();
    const P_ = this.phase, c = this.c, b = this.brush;
    const m = this.mouthRect(this.open);
    layoutTeeth(this.teeth, m, this.fullH);
    let mode = 'open';
    if (P_ === 'quiz') mode = this.open > 0.05 ? 'open' : 'closed';
    if (P_ === 'reward') mode = 'grin';
    drawChar(c, FCX, FCY, FR, {
      mode, mouth: m, teeth: this.teeth, inside: () => this.drawInside(), blink: blinkVal(1), happy: P_ === 'reward' || P_ === 'clean', sad: this.sadT > 0, hat: P_ === 'reward',
      lookX: b.held ? clamp((b.x - FCX) / 500, -1, 1) : 0, lookY: b.held ? clamp((b.y - 260) / 300, -1, 1) : 0.3,
      chew: this.chewT > 0.5 && this.chewT < 2.2 ? this.chewT : 0, dx: this.sadT > 0.8 ? Math.sin(T * 30) * 14 : 0,
      tongue: this.tg.k, tongueDirt: this.tg.dirt, tongueSpots: this.tg.spots
    });
    // bacilové, kteří utekli z pusy na obličej nebo teprve přibíhají
    for (const g of this.germs) { if (g.dead || (g.face == null && !g.hop) || (g.hop && g.hop.t < 0)) continue; const p = this.germPos(g); if (g.ultra) drawUltraAura(p.x, p.y, g.r, g.hp); drawGerm(p.x, p.y, g.r * (g.face != null ? 1.3 : 1), g.c, g.ph, g.sq, g.hit > 0, false); }
    if (this.snackFx) { const k = ease(this.snackFx.t / 0.7); drawFood(this.snackFx.food, lerp(1500, FCX, k), lerp(150, m.y + m.h / 2, k) - Math.sin(k * Math.PI) * 150, 70 * (1 - k * 0.7), k * 6); }
    if (this.veil > 0.01) { const f = full(); ctx.fillStyle = 'rgba(235,248,255,' + (0.6 * this.veil) + ')'; ctx.fillRect(f.x, f.y, f.w, f.h); }
    if (P_ === 'brush' || P_ === 'tongue' || P_ === 'clean') {
      const pr = P_ === 'brush' ? this.brushT / this.cfg.dur : 1;
      ctx.fillStyle = 'rgba(255,255,255,.8)'; rr(480, 16, 640, 40, 20); ctx.fill();
      const g = ctx.createLinearGradient(480, 0, 1120, 0); g.addColorStop(0, '#5fd0ff'); g.addColorStop(1, '#4cd964');
      ctx.fillStyle = g; rr(486, 22, Math.max(28, 628 * pr), 28, 14); ctx.fill();
      drawToothChar(486 + Math.max(28, 628 * pr) - 14, 36, 22, T, true);
      ctx.fillStyle = pr >= 1 ? '#ffcc00' : 'rgba(255,255,255,.9)'; starPath(1150, 36, 30, 14, 5); ctx.fill(); ctx.strokeStyle = pr >= 1 ? '#e69500' : '#9bc7d8'; ctx.lineWidth = 3; ctx.stroke();
    }
    if (P_ === 'prep') Prep.draw();
    if (P_ === 'brush') for (const f of this.fallers) { if (f.y < -60) continue; ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.beginPath(); ctx.arc(f.x + 8, f.y + 10, 52, 0, 7); ctx.fill(); drawFood(f.food, f.x, f.y, 55, Math.sin(f.rot) * 0.4); }
    if (P_ === 'brush' || P_ === 'tongue') { const fl = Math.abs(b.flip) < 0.12 ? Math.sign(b.flip || 1) * 0.12 : b.flip; ctx.save(); ctx.translate(b.x, b.y); ctx.scale(fl, 1); drawBrush(0, 0, b.ang + (b.held ? Math.sin(T * 30) * 0.02 * clamp(b.speed / 3000, 0, 1) : 0), b.sc, 1); ctx.restore(); }
    if (P_ === 'clean') drawBrush(b.x, b.y, -0.15, BRUSH_SC, 1);
    if (P_ === 'rinse') { const c2 = this.cup, r = c2.pour; drawCup(c2.x, c2.y, r < 0 && !c2.held ? 1 + Math.sin(T * 5) * 0.04 : 1, r >= 0 ? lerp(0, -1.1, ease(r / 0.4)) * (r > 2.0 ? Math.max(0, 1 - (r - 2) * 2) : 1) : 0, r >= 0 ? 1 - clamp(r / 1.4, 0, 1) : 1); }
    if (P_ === 'quiz' && this.quiz) {
      const R = this.quiz.r;
      for (const it of this.quiz.items) {
        if (it.gone) continue;
        let x = it.x, y = it.y, s = 1;
        if (it.fly >= 0) { it.fly += 1 / 60; const k = ease(it.fly / 0.5); x = lerp(it.x, FCX, k); y = lerp(it.y, FCY + FR * 0.4, k); s = 1 - k; if (it.fly > 0.5) it.gone = true; }
        it.wob = Math.max(0, it.wob - 1 / 60 * 1.2);
        if (s > 0.02) {
          ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
          const pulse = this.pt > 4 && FOOD[it.id].good && this.chewT < 0 ? 1 + Math.sin(T * 5) * 0.05 : 1; ctx.scale(pulse, pulse);
          ctx.shadowColor = 'rgba(0,0,0,.2)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8;
          ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.fill(); ctx.shadowColor = 'transparent';
          drawFood(it.id, 0, 0, R * 0.7, Math.sin(T * 30) * 0.25 * it.wob);
          ctx.restore();
        }
      }
    }
    if (P_ === 'reward') { const f = full(); ctx.fillStyle = 'rgba(255,246,214,' + (0.8 * ease(Reward.t / 0.6)) + ')'; ctx.fillRect(f.x, f.y, f.w, f.h); Reward.draw(); }
    const h = this.hint();
    if (h) { if (h.updown) drawUpDown(h.x + 70, h.y, T, 1); drawHand(h.x, h.y, h.still ? 0 : T, 1); }
    if (P_ !== 'reward') drawBtn({ x: 70, y: 70, r: 44, color: '#3fa9f5', icon: 'map' });
  }
};
