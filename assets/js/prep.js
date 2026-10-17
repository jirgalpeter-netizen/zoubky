'use strict';
// ===== Minihry před čištěním: kartáček, víčko, pasta =====
const PB = { x: 1120, y: 520, sc: 1.5, ang: -0.15 };      // kartáček při přípravě
const TUBE_REST = { x: 430, y: 500, sc: 1.25 };
const TUBE_MID = { x: 700, y: 430, sc: 1.5 };
const SQUEEZES = ['bring', 'tap', 'swipe', 'hold'];
function prepSteps(i) {
  const fixed = [['bring'], ['pick', 'bring'], ['unscrew', 'bring'], ['pick', 'tap'], ['unscrew', 'swipe', 'screw'], ['pick', 'unscrew', 'hold', 'screw']];
  if (i < fixed.length) return fixed[i].slice();
  const st = [];
  if (Math.random() < 0.5) st.push('pick');
  const un = Math.random() < 0.75; if (un) st.push('unscrew');
  st.push(pick(SQUEEZES));
  if (un && Math.random() < 0.6) st.push('screw');
  return st;
}
const PREP_SAY = { pick: 'pick', unscrew: 'unscrew', bring: 'bring', tap: 'tapSq', swipe: 'swipeSq', hold: 'holdSq', screw: 'screw' };
function bristleTopOf(x, y, sc, ang) { return { x: x + Math.sin(ang) * 30 * sc, y: y - Math.cos(ang) * 30 * sc }; }
function angDiff(a, b) { let d = a - b; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; }

const Prep = {
  start(lv) {
    this.lv = lv; this.steps = prepSteps(lv.ci); this.i = -1;
    this.tube = { x: TUBE_REST.x, y: TUBE_REST.y, sc: TUBE_REST.sc, rot: 0, cap: this.steps.indexOf('unscrew') >= 0 ? 'on' : 'off', spin: 0, out: 0, sq: 0, held: false, gx: 0, gy: 0, snapped: false, tx: null };
    this.capObj = null; this.paste = 0; this.done = false; this.doneT = 0;
    this.brushPos = { x: PB.x, y: PB.y }; this.picked = -1; this.pickT = 0;
    this.next();
  },
  next() {
    this.i++; this.t = 0; this.acc = 0; this.stroke = 0; this.lastA = null; this.holding = false; this.saidRem = 0;
    if (this.i >= this.steps.length) { this.done = true; this.doneT = 0; return; }
    const s = this.step();
    if (firstTimes('prep_' + s, 2)) say(G(P[PREP_SAY[s]]), true);
    const t = this.tube;
    if (s === 'unscrew' || s === 'screw') { t.tx = { x: TUBE_MID.x, y: TUBE_MID.y, rot: 0, sc: TUBE_MID.sc }; }
    else if (s === 'bring') t.tx = { x: TUBE_REST.x, y: TUBE_REST.y, rot: 0, sc: TUBE_REST.sc };
    else if (s === 'tap' || s === 'swipe' || s === 'hold') t.tx = this.abovePose();
    else t.tx = { x: TUBE_REST.x, y: TUBE_REST.y + 400, rot: 0, sc: TUBE_REST.sc };
    t.snapped = false;
  },
  step() { return this.steps[this.i]; },
  abovePose() { const bt = bristleTopOf(PB.x, PB.y, PB.sc, PB.ang), rot = 0.5, sc = 1.25; return { x: bt.x - Math.cos(rot) * 150 * sc, y: bt.y - 12 - Math.sin(rot) * 150 * sc, rot, sc }; },
  nozzle() { const t = this.tube; return { x: t.x + Math.cos(t.rot) * 150 * t.sc, y: t.y + Math.sin(t.rot) * 150 * t.sc }; },
  capPos() { const t = this.tube, d = (128 + t.out * 30) * t.sc; return { x: t.x + Math.cos(t.rot) * d, y: t.y + Math.sin(t.rot) * d }; },
  addPaste(a) {
    const before = this.paste; this.paste = Math.min(1.35, this.paste + a);
    const nz = this.nozzle(); for (let k = 0; k < 3; k++) addPart({ x: nz.x, y: nz.y, vx: rnd(-40, 40), vy: rnd(20, 90), life: 0.35, size: rnd(5, 10), color: '#ffffff' });
    if (before < 1.35 && this.paste >= 1.35) { Snd.sparkle(); setTimeout(() => this.lv.phase === 'prep' && this.step() && SQUEEZES.indexOf(this.step()) >= 0 && this.next(), 700); this.tube.tx = { x: TUBE_REST.x - 120, y: TUBE_REST.y + 60, rot: 0, sc: TUBE_REST.sc }; }
  },
  update(dt) {
    const t = this.tube; this.t += dt;
    if (this.done) { this.doneT += dt; t.x = lerp(t.x, -400, dt * 3); if (this.capObj) this.capObj.x = lerp(this.capObj.x, -400, dt * 3); return this.doneT > 0.8; }
    const s = this.step();
    if (t.tx && !t.held) { const k = Math.min(1, dt * 7); t.x = lerp(t.x, t.tx.x, k); t.y = lerp(t.y, t.tx.y, k); t.rot = lerp(t.rot, t.tx.rot, k); t.sc = lerp(t.sc, t.tx.sc, k); }
    t.sq = Math.max(0, t.sq - dt * 3);
    if (this.capObj && this.capObj.fly) {
      const c = this.capObj; c.x += c.vx * dt; c.y += c.vy * dt; c.vy += 1800 * dt; c.ang += c.va * dt;
      if (c.x > 1380) { c.x = 1380; c.vx = -Math.abs(c.vx) * 0.5; } if (c.x < 120) { c.x = 120; c.vx = Math.abs(c.vx) * 0.5; }
      if (c.y > 640) { c.y = 640; c.vy *= -0.35; c.vx *= 0.6; c.va *= 0.5; if (Math.abs(c.vy) < 60) { c.fly = false; c.vy = 0; } }
    }
    if (s === 'pick' && this.picked >= 0) { this.pickT += dt; const k = ease(this.pickT / 0.6); this.brushPos = { x: lerp(this.pickFrom.x, PB.x, k), y: lerp(this.pickFrom.y, PB.y, k) }; if (this.pickT > 0.9) this.next(); }
    if (s === 'bring') {
      const nz = this.nozzle(), bt = bristleTopOf(PB.x, PB.y, PB.sc, PB.ang);
      if (!t.snapped && dist(nz.x, nz.y, bt.x, bt.y) < 120) { t.snapped = true; t.held = false; t.tx = this.abovePose(); Snd.tap(); buzz(20); }
      if (t.snapped && this.paste < 1.35) { this.addPaste(dt * 0.6); t.sq = 0.6 + Math.sin(T * 14) * 0.3; if ((this.t * 3 | 0) !== ((this.t - dt) * 3 | 0)) Snd.squish(); }
    }
    if (s === 'hold' && this.holding && this.paste < 1.35) { this.addPaste(dt * 0.5); t.sq = 0.6 + Math.sin(T * 14) * 0.3; if ((this.t * 3 | 0) !== ((this.t - dt) * 3 | 0)) { Snd.squish(); buzz(10); } }
    if (s === 'screw' && this.capObj && this.capObj.attached === false && this.capObj.toNozzle) {
      const c = this.capObj, cp = this.capPos(); c.x = lerp(c.x, cp.x, dt * 8); c.y = lerp(c.y, cp.y, dt * 8); c.ang = lerp(c.ang, t.rot, dt * 8);
      if (dist(c.x, c.y, cp.x, cp.y) < 6) { this.capObj = null; t.cap = 'on'; t.out = 1; Snd.tap(); }
    }
    if (this.t > IDLE_HINT + 3 && T - lastSay > IDLE_REPEAT) say(G(P[PREP_SAY[s]]));
    return false;
  },
  down(x, y) {
    const s = this.step(), t = this.tube; if (!s) return;
    this.lastA = null; this.stroke = 0;
    if (s === 'pick' && this.picked < 0) {
      BRUSHES.forEach((B, i) => {
        const p = this.pickSlot(i), ex = p.x + Math.cos(-0.5) * 300, ey = p.y + Math.sin(-0.5) * 300;
        const L2 = (ex - p.x) ** 2 + (ey - p.y) ** 2, u = clamp(((x - p.x) * (ex - p.x) + (y - p.y) * (ey - p.y)) / L2, 0, 1);
        if (this.picked < 0 && dist(x, y, p.x + (ex - p.x) * u, p.y + (ey - p.y) * u) < 70) { this.picked = i; Save.brush = i; Save.save(); this.pickFrom = p; this.pickT = 0; Snd.sparkle(); buzz(25); burst(x, y, 16, {}); }
      });
      return;
    }
    if (s === 'bring' && !t.snapped && dist(x, y, t.x, t.y) < 210) { t.held = true; t.gx = t.x - x; t.gy = t.y - y; Snd.tap(); return; }
    if (s === 'tap' && this.onTube(x, y)) { this.addPaste(0.17); t.sq = 1; Snd.squish(); buzz(20); return; }
    if (s === 'hold' && this.onTube(x, y)) { this.holding = true; return; }
    if (s === 'screw' && this.capObj && !this.capObj.toNozzle && dist(x, y, this.capObj.x, this.capObj.y) < 120) { this.capObj.toNozzle = true; this.capObj.attached = false; Snd.tap(); return; }
  },
  onTube(x, y) { const t = this.tube, n = this.nozzle(); for (let k = 0; k <= 1; k += 0.25) if (dist(x, y, lerp(t.x - Math.cos(t.rot) * 140 * t.sc, n.x, k), lerp(t.y - Math.sin(t.rot) * 140 * t.sc, n.y, k)) < 110) return true; return false; },
  pickSlot(i) { return { x: 300 + i * 300, y: 520 + Math.sin(T * 2 + i) * 8 }; },
  move(x, y, dx, dy) {
    const s = this.step(), t = this.tube; if (!s) return;
    if (s === 'bring' && t.held) { t.x = x + t.gx; t.y = y + t.gy; t.rot = lerp(t.rot, 0.5, 0.2); return; }
    if ((s === 'unscrew' && t.cap === 'on') || (s === 'screw' && t.cap === 'on' && t.out > 0)) {
      const cp = this.capPos(); if (dist(x, y, cp.x, cp.y) < 30 || dist(x, y, cp.x, cp.y) > 330) { this.lastA = null; return; }
      const a = Math.atan2(y - cp.y, x - cp.x);
      if (this.lastA != null) {
        const d = angDiff(a, this.lastA); this.acc += Math.abs(d); t.spin += d * (s === 'unscrew' ? 1 : -1);
        if ((this.acc / 0.6 | 0) !== ((this.acc - Math.abs(d)) / 0.6 | 0)) Snd.twist();
        if (s === 'unscrew') { t.out = clamp(this.acc / (Math.PI * 2 * 2.2), 0, 1); if (t.out >= 1) this.capOff(); }
        else { t.out = clamp(1 - this.acc / (Math.PI * 2 * 1.5), 0, 1); if (t.out <= 0) { Snd.ding(); Snd.sparkle(); buzz(30); burst(cp.x, cp.y, 16, {}); this.next(); } }
      }
      this.lastA = a; return;
    }
    if (s === 'swipe' && this.onTube(x, y)) {
      const ax = Math.cos(t.rot), ay = Math.sin(t.rot), along = dx * ax + dy * ay;
      if (along > 0) { this.stroke += along; t.sq = Math.min(1, t.sq + along / 120); }
      if (this.stroke > 150) { this.stroke = 0; this.addPaste(0.4); Snd.squish(); buzz(20); }
    }
  },
  up() { const t = this.tube; t.held = false; this.holding = false; this.lastA = null; this.stroke = 0; },
  capOff() {
    const t = this.tube, cp = this.capPos(); t.cap = 'off'; t.out = 0;
    this.capObj = { x: cp.x, y: cp.y, ang: t.rot, vx: 300, vy: -700, va: 9, fly: true };
    Snd.pop(); Snd.sparkle(); buzz(40); burst(cp.x, cp.y, 18, {}); this.next();
  },
  hint() {
    const s = this.step(), t = this.tube; if (!s || this.done || this.t < 1.2) return null;
    if (s === 'pick' && this.picked < 0) return { x: this.pickSlot(1).x + 120, y: this.pickSlot(1).y - 60 };
    if (s === 'bring' && !t.snapped && !t.held) { const bt = bristleTopOf(PB.x, PB.y, PB.sc, PB.ang), k = (T * 0.5) % 1; return { x: lerp(t.x, bt.x - 160, ease(k * 1.4)), y: lerp(t.y, bt.y - 60, ease(k * 1.4)), still: true }; }
    if ((s === 'unscrew' && t.cap === 'on') || (s === 'screw' && t.cap === 'on' && t.out > 0)) { const cp = this.capPos(); return { x: cp.x + Math.cos(T * 3) * 110, y: cp.y + Math.sin(T * 3) * 110, still: true, circle: cp }; }
    if (s === 'screw' && this.capObj && !this.capObj.toNozzle && !this.capObj.fly) return { x: this.capObj.x, y: this.capObj.y };
    if (s === 'tap' || s === 'hold') return { x: t.x, y: t.y };
    if (s === 'swipe') { const n = this.nozzle(), k = (T * 0.8) % 1; return { x: lerp(t.x - Math.cos(t.rot) * 120 * t.sc, n.x - 40, k), y: lerp(t.y - Math.sin(t.rot) * 120 * t.sc, n.y - 20, k), still: true }; }
    return null;
  },
  draw() {
    const s = this.step(), t = this.tube;
    ctx.fillStyle = '#f3e3c8'; rr(-200, 600, 2000, 300, 30); ctx.fill(); ctx.fillStyle = '#e2cca8'; ctx.fillRect(-200, 600, 2000, 12);
    if (s === 'pick' && this.picked < 0 && !this.done) BRUSHES.forEach((B, i) => { const p = this.pickSlot(i); drawBrush(p.x, p.y, -0.5, 1.0, 0, i); });
    else drawBrush(this.brushPos.x, this.brushPos.y, PB.ang, PB.sc, this.paste);
    if (s === 'pick' && this.picked >= 0) drawBrush(this.brushPos.x, this.brushPos.y, PB.ang, PB.sc, 0);
    if (this.capObj) drawCap(this.capObj.x, this.capObj.y, t.sc, this.capObj.ang, 0);
    if (s !== 'pick' || this.done) drawTube(t.x, t.y, t.sc * (this.t > 1 && !t.held && (s === 'bring' || s === 'tap' || s === 'hold') ? 1 + Math.sin(T * 5) * 0.03 : 1), t.sq, t.rot, t.cap, t.spin, t.out);
    const h = this.hint();
    if (h && h.circle) { ctx.save(); ctx.strokeStyle = 'rgba(255,210,63,.9)'; ctx.lineWidth = 10; ctx.setLineDash([22, 16]); ctx.lineDashOffset = -T * 60; ctx.beginPath(); ctx.arc(h.circle.x, h.circle.y, 110, 0, 7); ctx.stroke(); ctx.restore(); }
    if (h) drawHand(h.x, h.y, h.still ? 0 : T, 0.9);
  }
};
