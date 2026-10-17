'use strict';
// ===== MINIHRY NA ZASTÁVKÁCH: malování, čištění oušek, bubliny =====
const PAINT_COLS = ['#ff4d6d', '#ff9f1a', '#ffd23f', '#4cd964', '#3fa9f5', '#b06cff', '#8a5530'];
const PICS = [
  [ // domeček
    { t: 'circ', x: 1080, y: 170, r: 75 },
    { t: 'rect', x: 1052, y: 470, w: 46, h: 150, r: 8 },
    { t: 'circ', x: 1075, y: 420, r: 105 },
    { t: 'rect', x: 760, y: 150, w: 56, h: 120, r: 6 },
    { t: 'rect', x: 450, y: 300, w: 400, h: 300, r: 12 },
    { t: 'poly', p: [[410, 315], [650, 115], [890, 315]] },
    { t: 'rect', x: 610, y: 450, w: 80, h: 150, r: 14 },
    { t: 'rect', x: 490, y: 360, w: 90, h: 80, r: 10 },
    { t: 'rect', x: 720, y: 360, w: 90, h: 80, r: 10 }
  ],
  [ // kytička v květináči
    { t: 'circ', x: 1080, y: 150, r: 65 },
    { t: 'rect', x: 690, y: 290, w: 22, h: 250, r: 8 },
    { t: 'ell', x: 630, y: 430, rx: 70, ry: 28, a: -0.5 },
    { t: 'ell', x: 772, y: 460, rx: 70, ry: 28, a: 0.5 },
    ...[0, 1, 2, 3, 4, 5].map(i => { const a = i * Math.PI / 3; return { t: 'ell', x: 701 + Math.cos(a) * 82, y: 230 + Math.sin(a) * 82, rx: 58, ry: 36, a }; }),
    { t: 'circ', x: 701, y: 230, r: 48 },
    { t: 'poly', p: [[580, 520], [822, 520], [790, 655], [612, 655]] }
  ],
  [ // rybička
    { t: 'circ', x: 400, y: 210, r: 34 }, { t: 'circ', x: 360, y: 130, r: 24 }, { t: 'circ', x: 430, y: 80, r: 16 },
    { t: 'poly', p: [[860, 380], [1030, 260], [1000, 380], [1030, 500]] },
    { t: 'poly', p: [[600, 262], [700, 170], [770, 270]] },
    { t: 'ell', x: 680, y: 390, rx: 230, ry: 145, a: 0 },
    { t: 'ell', x: 720, y: 395, rx: 26, ry: 120, a: 0 },
    { t: 'ell', x: 810, y: 395, rx: 24, ry: 100, a: 0 },
    { t: 'circ', x: 545, y: 350, r: 34 },
    { t: 'poly', p: [[620, 470], [700, 450], [690, 520]] }
  ]
];
function regPath(g) {
  ctx.beginPath();
  if (g.t === 'circ') ctx.arc(g.x, g.y, g.r, 0, 7);
  else if (g.t === 'ell') ctx.ellipse(g.x, g.y, g.rx, g.ry, g.a || 0, 0, 7);
  else if (g.t === 'rect') { rr(g.x, g.y, g.w, g.h, g.r || 0); return; }
  else { g.p.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); }
}
function regHit(g, x, y) {
  if (g.t === 'circ') return dist(x, y, g.x, g.y) < g.r;
  if (g.t === 'rect') return x > g.x && x < g.x + g.w && y > g.y && y < g.y + g.h;
  if (g.t === 'ell') { const c = Math.cos(-(g.a || 0)), s = Math.sin(-(g.a || 0)), dx = x - g.x, dy = y - g.y, u = dx * c - dy * s, v = dx * s + dy * c; return (u / g.rx) ** 2 + (v / g.ry) ** 2 < 1; }
  let inside = false; const p = g.p;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) if ((p[i][1] > y) !== (p[j][1] > y) && x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) inside = !inside;
  return inside;
}
function regCenter(g) {
  if (g.t === 'rect') return { x: g.x + g.w / 2, y: g.y + g.h / 2 };
  if (g.t === 'poly') return { x: g.p.reduce((s, q) => s + q[0], 0) / g.p.length, y: g.p.reduce((s, q) => s + q[1], 0) / g.p.length };
  return { x: g.x, y: g.y };
}

const MINI = {};
MINI.paint = {
  bg: '#fff6e0',
  start() {
    const n = (Seen.paintPic || 0); Seen.paintPic = n + 1; Store.set('seen', Seen);
    this.regs = PICS[n % PICS.length].map(g => Object.assign({ fill: null, k: 0 }, g));
    this.col = 0;
  },
  palPos(i) { return { x: 1470, y: 90 + i * 88 }; },
  update(dt) { for (const g of this.regs) if (g.fill) g.k = Math.min(1, g.k + dt * 4); },
  draw() {
    ctx.fillStyle = '#ffffff'; rr(330, 50, 860, 620, 40); ctx.fill(); ctx.strokeStyle = '#ffd9a0'; ctx.lineWidth = 8; ctx.stroke();
    ctx.lineJoin = 'round';
    for (const g of this.regs) {
      regPath(g); ctx.fillStyle = '#ffffff'; ctx.fill();
      if (g.fill) { ctx.save(); regPath(g); ctx.clip(); const c = regCenter(g); ctx.fillStyle = g.fill; ctx.beginPath(); ctx.arc(c.x, c.y, 400 * ease(g.k), 0, 7); ctx.fill(); ctx.restore(); }
      regPath(g); ctx.strokeStyle = '#4a3a3a'; ctx.lineWidth = 7; ctx.stroke();
    }
    PAINT_COLS.forEach((c, i) => { const p = this.palPos(i), on = i === this.col, r = on ? 46 : 36;
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 7); ctx.fill(); ctx.lineWidth = on ? 8 : 4; ctx.strokeStyle = '#fff'; ctx.stroke();
      if (on) { ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(p.x - 12, p.y - 12, 10, 0, 7); ctx.fill(); } });
    const p = this.palPos(this.col); drawBrushTip(p.x - 95, p.y, PAINT_COLS[this.col]);
  },
  hint() { const g = this.regs.find(r => !r.fill); return g ? regCenter(g) : null; },
  down(x, y, gm) {
    for (let i = 0; i < PAINT_COLS.length; i++) { const p = this.palPos(i); if (dist(x, y, p.x, p.y) < 48) { this.col = i; Snd.tap(); return; } }
    for (let i = this.regs.length - 1; i >= 0; i--) {
      const g = this.regs[i]; if (!regHit(g, x, y)) continue;
      const was = g.fill; g.fill = PAINT_COLS[this.col]; g.k = was ? 0.4 : 0; Snd.pop(); buzz(15); burst(x, y, 12, { colors: [g.fill, '#ffffff'], smin: 60, smax: 260 });
      if (!was && this.regs.every(r => r.fill)) gm.finish();
      return;
    }
  }
};
function drawBrushTip(x, y, col) { // štětec u vybrané barvy
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.2);
  ctx.fillStyle = '#c98a5a'; rr(-70, -8, 60, 16, 8); ctx.fill(); ctx.fillStyle = '#b8bec8'; ctx.fillRect(-14, -10, 16, 20);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(2, -10); ctx.quadraticCurveTo(34, -6, 40, 0); ctx.quadraticCurveTo(34, 6, 2, 10); ctx.fill();
  ctx.restore();
}

MINI.ears = {
  bg: '#ffe9f3',
  start() { this.side = 1; this.tip = null; this.giggle = 0; this.happy = 0; this.c = pick(CHARS.slice(0, Math.min(Save.unlocked, CHARS.length - 1) + 1)); this.newWax(); },
  newWax() { this.wax = []; let k = 0; while (this.wax.length < 7 && k++ < 300) { const u = rnd(-0.85, 0.85), v = rnd(-0.85, 0.85); if (u * u + v * v > 0.8) continue; const x = 15 + u * 120, y = -10 + v * 185; if (this.wax.some(w => dist(w.x, w.y, x, y) < 70)) continue; this.wax.push({ x, y, r: rnd(20, 30), dirt: 1, seed: rnd(0, 6) }); } },
  wx(w) { return { x: 800 + this.side * w.x, y: 380 + w.y }; },
  update(dt) { this.giggle -= dt; this.happy = Math.max(0, this.happy - dt); },
  draw() {
    drawChar(this.c, 230, 470, 130, { mode: this.happy > 0 ? 'grin' : 'closed', happy: this.happy > 0, blink: blinkVal(5) });
    ctx.save(); ctx.translate(800, 380); ctx.scale(this.side, 1);
    ctx.fillStyle = '#ffcfb5'; ctx.beginPath(); ctx.ellipse(0, 0, 205, 285, 0.08, 0, 7); ctx.fill(); ctx.strokeStyle = '#d99a80'; ctx.lineWidth = 9; ctx.stroke();
    ctx.fillStyle = '#ffbea2'; ctx.beginPath(); ctx.ellipse(15, -10, 145, 215, 0.08, 0, 7); ctx.fill();
    ctx.strokeStyle = '#e8a68c'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(10, -40, 120, -2.6, 0.9); ctx.stroke();
    ctx.fillStyle = '#b86e5e'; ctx.beginPath(); ctx.ellipse(40, 50, 42, 58, 0.1, 0, 7); ctx.fill(); ctx.fillStyle = '#8a4a40'; ctx.beginPath(); ctx.ellipse(46, 58, 22, 32, 0.1, 0, 7); ctx.fill();
    ctx.restore();
    for (const w of this.wax) {
      if (w.dirt <= 0) continue; const p = this.wx(w);
      ctx.save(); ctx.translate(p.x, p.y); ctx.globalAlpha = clamp(w.dirt * 1.3, 0, 1); ctx.scale(0.6 + w.dirt * 0.4, 0.6 + w.dirt * 0.4);
      ctx.fillStyle = '#e2b24a'; blob(w.r, 14, 0.18, w.seed); ctx.fill(); ctx.strokeStyle = '#b8862a'; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.arc(-w.r * 0.3, -w.r * 0.3, w.r * 0.22, 0, 7); ctx.fill();
      ctx.restore();
    }
    const t = this.tip || { x: 1250, y: 520 }, used = 1 - this.wax.reduce((s, w) => s + w.dirt, 0) / this.wax.length;
    ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(this.tip ? -0.75 : -0.4);
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#bcd'; ctx.lineWidth = 3; rr(0, -9, 330, 18, 9); ctx.fill(); ctx.stroke();
    for (const ex of [0, 330]) { ctx.fillStyle = ex ? '#ffffff' : mix('#ffffff', '#e2b24a', used * 0.7); ctx.beginPath(); ctx.ellipse(ex, 0, 34, 24, 0, 0, 7); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  },
  hint() { const w = this.wax.find(q => q.dirt > 0); if (!w) return null; const p = this.wx(w); return { x: p.x + 40, y: p.y + 80 }; },
  down(x, y) { this.tip = { x: x - 40, y: y - 80 }; },
  move(x, y, gm) {
    const nt = { x: x - 40, y: y - 80 }, o = this.tip || nt, d = dist(o.x, o.y, nt.x, nt.y); this.tip = nt; if (d < 0.5) return;
    let rubbed = false;
    for (const w of this.wax) {
      if (w.dirt <= 0) continue; const p = this.wx(w);
      if (dist(nt.x, nt.y, p.x, p.y) < w.r + 34) {
        w.dirt -= d * 0.004; rubbed = true; gm.lastAct = T;
        if (w.dirt <= 0.05) { w.dirt = 0; Snd.ding(); buzz(20); burst(p.x, p.y, 12, { colors: ['#fff3a0', '#ffffff'], smin: 60, smax: 220 }); }
      }
    }
    if (rubbed) { this.happy = 0.6; if (this.giggle <= 0) { this.giggle = rnd(2.5, 4); Snd.hihi(); } }
    if (this.wax.every(w => w.dirt <= 0)) {
      if (this.side === 1) { this.side = -1; Snd.sparkle(); this.tip = null; this.newWax(); }
      else gm.finish();
    }
  },
  up() { this.tip = null; }
};

MINI.bubbles = {
  goal: 15,
  drawBg() {
    const f = full(), g = ctx.createLinearGradient(0, f.y, 0, f.y + f.h); g.addColorStop(0, '#7fd3ff'); g.addColorStop(1, '#e3f7ff');
    ctx.fillStyle = g; ctx.fillRect(f.x, f.y, f.w, f.h);
    for (let i = 0; i < 5; i++) cloud(((i * 420 + T * 15) % 2000) - 200, 110 + (i % 2) * 70, 0.8 + (i % 3) * 0.2);
    ctx.fillStyle = '#8fdc6a'; ctx.beginPath(); ctx.ellipse(800, f.y + f.h + 300, 1400, 420, 0, 0, 7); ctx.fill();
  },
  start() { this.b = []; this.n = 0; this.acc = 0; for (let i = 0; i < 4; i++) this.spawn(rnd(250, 650)); },
  spawn(y) { this.b.push({ x: rnd(260, 1340), y, r: rnd(52, 80), v: rnd(50, 95), ph: rnd(0, 6), in: pick(['star', 'heart', 'fish', 'none', 'none']), pop: -1 }); },
  update(dt, gm) {
    if (!gm.done) { this.acc -= dt; if (this.acc <= 0 && this.b.length < 7) { this.acc = rnd(0.5, 0.9); this.spawn(800); } }
    for (const q of this.b) { if (q.pop >= 0) q.pop += dt; else q.y -= q.v * dt; }
    this.b = this.b.filter(q => q.y > -120 && q.pop < 0.3);
  },
  draw() {
    drawToothChar(800, 650, 48, T);
    for (const q of this.b) {
      if (q.pop >= 0) continue; const x = q.x + Math.sin(T * 1.5 + q.ph) * 25, y = q.y;
      if (q.in === 'star') { ctx.fillStyle = '#ffcc00'; starPath(x, y, q.r * 0.38, q.r * 0.17, 5); ctx.fill(); }
      if (q.in === 'heart') { ctx.fillStyle = '#ff4d6d'; heartPath(x, y, q.r * 0.34); ctx.fill(); }
      if (q.in === 'fish') drawSticker('fish', x, y, q.r * 0.45, 0, true);
      const g = ctx.createRadialGradient(x - q.r * 0.3, y - q.r * 0.3, q.r * 0.1, x, y, q.r);
      g.addColorStop(0, 'rgba(255,255,255,.15)'); g.addColorStop(0.75, 'rgba(200,235,255,.25)'); g.addColorStop(1, 'rgba(255,170,240,.55)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, q.r, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.ellipse(x - q.r * 0.38, y - q.r * 0.4, q.r * 0.16, q.r * 0.09, -0.7, 0, 7); ctx.fill();
    }
    for (let i = 0; i < this.goal; i++) { const x = 800 - (this.goal - 1) * 22 + i * 44; ctx.fillStyle = i < this.n ? '#ffd23f' : 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(x, 40, 15, 0, 7); ctx.fill(); }
  },
  hint() { const q = this.b.filter(q => q.pop < 0 && q.y < 640 && q.y > 120)[0]; return q ? { x: q.x + Math.sin(T * 1.5 + q.ph) * 25, y: q.y } : null; },
  down(x, y, gm) {
    for (const q of this.b) {
      if (q.pop >= 0) continue; const bx = q.x + Math.sin(T * 1.5 + q.ph) * 25;
      if (dist(x, y, bx, q.y) < q.r + 20) {
        q.pop = 0; this.n++; Snd.tone(500 + this.n * 45, 0.12, { to: 1400 + this.n * 60, vol: 0.3 }); buzz(15);
        for (let k = 0; k < 10; k++) addPart({ x: bx + rnd(-q.r, q.r) * 0.6, y: q.y + rnd(-q.r, q.r) * 0.6, vx: rnd(-160, 160), vy: rnd(-160, 60), g: 300, life: 0.5, size: rnd(5, 10), type: 'bubble' });
        if (q.in !== 'none') burst(bx, q.y, 10, {});
        if (this.n >= this.goal) gm.finish();
        return;
      }
    }
  }
};

Scenes.game = {
  enter(arg) {
    this.arg = arg || { kind: 'paint' }; this.g = MINI[this.arg.kind]; this.done = false; this.doneT = 0; this.phase = 'play'; this.lastAct = T;
    Music.on = true; this.g.start(this);
    if (firstTimes('mini_' + this.arg.kind, 2)) setTimeout(() => say(P[this.arg.kind]), 500);
  },
  finish() { if (this.done) return; this.done = true; this.doneT = 0; Snd.fanfare(); buzz(60); confetti(70); },
  leave() { go('map', this.arg.resume ? { resume: this.arg.resume } : null); },
  toReward() {
    this.phase = 'reward';
    const first = this.arg.key ? !Save.stations[this.arg.key] : false;
    if (this.arg.key) { Save.stations[this.arg.key] = true; Save.save(); }
    const got = first ? giveReward(null, [null]) : (Save.rewards++, Save.save(), []);
    Reward.start(got, [
      { x: 1400, y: 300, r: 92, color: '#4cd964', icon: 'map', delay: 0, pulse: true, fn: () => this.leave() },
      { x: 1400, y: 540, r: 62, color: '#ff9f1a', icon: 'again', delay: 0.15, fn: () => go('game', this.arg) }
    ], first ? 0.2 : 0.4);
  },
  update(dt) {
    if (this.phase === 'reward') { Reward.update(dt); return; }
    this.g.update(dt, this);
    if (this.done) { this.doneT += dt; if (this.doneT > 1.6) this.toReward(); }
    else if (T - this.lastAct > IDLE_HINT + 4 && T - lastSay > IDLE_REPEAT) say(P[this.arg.kind]);
  },
  draw() {
    if (this.phase !== 'reward' && this.g.drawBg) this.g.drawBg(); else bgBath(this.phase === 'reward' ? '#fff3c4' : this.g.bg);
    if (this.phase === 'reward') { Reward.draw(); return; }
    this.g.draw(this);
    if (!this.done && T - this.lastAct > IDLE_HINT - 4) { const h = this.g.hint(); if (h) drawHand(h.x, h.y, T, 1); }
    drawBtn({ x: 70, y: 70, r: 44, color: '#3fa9f5', icon: 'map' });
  },
  down(x, y) {
    if (this.phase === 'reward') { Reward.down(x, y); return; }
    if (dist(x, y, 70, 70) < 70) { Snd.tap(); this.leave(); return; }
    this.lastAct = T; if (!this.done && this.g.down) this.g.down(x, y, this);
  },
  move(x, y) { if (this.phase === 'play' && !this.done && this.g.move) this.g.move(x, y, this); },
  up(x, y) { if (this.g.up) this.g.up(x, y, this); }
};
