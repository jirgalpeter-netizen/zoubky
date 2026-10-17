'use strict';
// ===== ČISTÍME SPOLU =====
const TOG_OPTS = [{ s: 30, label: '30 s' }, { s: 60, label: '1 min' }, { s: 120, label: '2 min' }, { s: 180, label: '3 min' }];
Scenes.together = {
  enter() {
    this.phase = 'choose'; this.t = 0; this.q = -1; this.foam = [];
    const pool = CHARS.slice(0, Math.min(Save.unlocked, CHARS.length - 1) + 1);
    this.c = pick(pool);
    this.teeth = makeTeeth(this.c.teeth, this.c.food, 0); this.fullH = FR * 0.67;
    Music.on = true; Music.step = 0;
    this.btns = TOG_OPTS.map((o, i) => ({ x: 380 + i * 280, y: 470, r: 95, color: ['#5fd0ff', '#4cd964', '#ff9f1a', '#b06cff'][i], icon: 'hourglass', label: o.label, sec: o.s, pulse: o.s === Save.togetherSec, fn: () => this.start(o.s) }));
    say(P.togChoose);
  },
  start(sec) {
    Save.togetherSec = sec; Save.save();
    this.dur = sec; this.phase = 'run'; this.t = 0; this.q = -1;
    say(P.togStart);
  },
  mouthRect() { return { x: FCX - FR * 0.7, y: FCY - FR * 0.05, w: FR * 1.4, h: this.fullH }; },
  brushPos() {
    const m = this.mouthRect(), q = Math.max(0, this.q), left = q % 2 === 0, upper = q < 2;
    return { x: m.x + m.w * (left ? 0.28 : 0.72) + Math.sin(T * 10) * m.w * 0.14, y: upper ? m.y + m.h * 0.2 : m.y + m.h * 0.8 };
  },
  update(dt) {
    if (this.phase === 'reward') { Reward.update(dt); return; }
    if (this.phase !== 'run') return;
    this.t += dt;
    const tt = this.t - 4; if (tt < 0) return;
    const q = Math.min(3, Math.floor(tt / (this.dur / 4)));
    if (q !== this.q) { this.q = q; say(P.togQ[q]); Snd.sparkle(); buzz(60); }
    const p = this.brushPos();
    if (Math.random() < dt * 25) { this.foam.push({ x: p.x + rnd(-40, 40), y: p.y + rnd(-20, 20), r: rnd(8, 18) }); if (this.foam.length > 120) this.foam.shift(); }
    if (tt >= this.dur) {
      this.phase = 'reward'; Music.on = false; this.foam = [];
      Reward.start(giveReward(null), [
        { x: 1290, y: 560, r: 62, color: '#ff9f1a', icon: 'again', delay: 0, fn: () => go('together') },
        { x: 1480, y: 560, r: 62, color: '#4cd964', icon: 'map', delay: 0.15, fn: () => go('map') }
      ], 0.6);
      sayName(G(P.togEnd), true);
    }
  },
  draw() {
    bgBath('#c9f0e0');
    if (this.phase === 'choose') {
      drawChar(playerChar(), 800, 200, 120, { mode: 'grin', blink: blinkVal(3) });
      drawBrush(940, 250, -0.9, 0.7, 1);
      for (const b of this.btns) { drawBtn(b); }
      drawBtn({ x: 70, y: 70, r: 44, color: '#3fa9f5', icon: 'map' });
      return;
    }
    const m = this.mouthRect(); layoutTeeth(this.teeth, m, this.fullH);
    const tt = this.t - 4, running = this.phase === 'run' && tt >= 0, done = this.phase === 'reward';
    drawChar(this.c, FCX, FCY, FR, { mode: done ? 'grin' : 'open', mouth: m, teeth: this.teeth, blink: blinkVal(2), happy: done, hat: done,
      inside: () => { for (const f of this.foam) { ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 7); ctx.fill(); } } });
    if (running) { const p = this.brushPos(); drawBrush(p.x, p.y, 1.0, 1.1, 1); }
    if (!done) {
      const cx = 200, cy = 330, r = 135, left = tt < 0 ? 1 : clamp(1 - tt / this.dur, 0, 1);
      ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(cx, cy, r + 14, 0, 7); ctx.fill();
      const cols = ['#ff8fc7', '#ffd23f', '#5fd0ff', '#4cd964'];
      for (let i = 0; i < 4; i++) {
        const a0 = -Math.PI / 2 + i * Math.PI / 2, a1 = a0 + Math.PI / 2, aEnd = -Math.PI / 2 + (1 - left) * Math.PI * 2;
        if (aEnd >= a1) continue;
        ctx.fillStyle = cols[i]; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, Math.max(a0, aEnd), a1); ctx.closePath(); ctx.fill();
      }
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; for (let i = 0; i < 4; i++) { const a = -Math.PI / 2 + i * Math.PI / 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.stroke(); }
      drawToothChar(cx, cy, 42, T);
      if (tt < 0) { const n = Math.ceil(-tt); ctx.fillStyle = '#ff6fa8'; ctx.beginPath(); ctx.arc(cx, cy + 210, 46, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = 'bold 60px Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(n), cx, cy + 213); }
      const mx = 1400, my = 330, w = 240, h = 170;
      ctx.fillStyle = 'rgba(255,255,255,.9)'; rr(mx - w / 2 - 16, my - h / 2 - 16, w + 32, h + 32, 40); ctx.fill();
      for (let i = 0; i < 4; i++) {
        const qx = mx - w / 2 + (i % 2) * w / 2, qy = my - h / 2 + Math.floor(i / 2) * h / 2, cur = i === this.q, past = i < this.q;
        ctx.fillStyle = cur ? (Math.sin(T * 8) > 0 ? '#ffd23f' : '#ffe98a') : past ? '#4cd964' : '#e3f3fa';
        rr(qx + 4, qy + 4, w / 2 - 8, h / 2 - 8, 22); ctx.fill();
        ctx.fillStyle = '#fff'; for (let k = 0; k < 3; k++) { rr(qx + 18 + k * 34, i < 2 ? qy + 14 : qy + h / 2 - 52, 26, 38, 10); ctx.fill(); }
        if (past) { ctx.fillStyle = '#fff'; starPath(qx + w / 4, qy + h / 4, 20, 9, 5); ctx.fill(); }
      }
      drawBtn({ x: 1530, y: 70, r: 44, color: '#ff9f1a', icon: 'skip' });
    }
    if (done) { const f = full(); ctx.fillStyle = 'rgba(255,246,214,' + (0.8 * ease(Reward.t / 0.6)) + ')'; ctx.fillRect(f.x, f.y, f.w, f.h); Reward.draw(); }
    else drawBtn({ x: 70, y: 70, r: 44, color: '#3fa9f5', icon: 'map' });
  },
  down(x, y) {
    if (this.phase === 'reward') { Reward.down(x, y); return; }
    if (dist(x, y, 70, 70) < 70) { Snd.tap(); go('map'); return; }
    if (this.phase === 'choose') { const b = hitBtn(this.btns, x, y); if (b) { Snd.tap(); b.fn(); } return; }
    if (dist(x, y, 1530, 70) < 70) { // rodič přeskočí na další čtvrtinu
      Snd.tap(); const quarter = this.dur / 4, tt = Math.max(0, this.t - 4);
      this.t = 4 + Math.min(this.dur, (Math.floor(tt / quarter) + 1) * quarter);
    }
  }
};
Scenes.level = Lv;

// ===== Vstup =====
let ptrId = null, ptrScene = null;
function toV(e) { const lx = ROT ? e.clientY : e.clientX, ly = ROT ? SW - e.clientX : e.clientY; return { x: (lx * dpr - OX) / S, y: (ly * dpr - OY) / S }; }
cvs.addEventListener('pointerdown', e => {
  e.preventDefault(); Snd.init();
  if (ptrId !== null) return;
  ptrId = e.pointerId; try { cvs.setPointerCapture(e.pointerId); } catch (er) {}
  const p = toV(e); ptrScene = scene;
  if (scene === 'level' && Lv.phase !== 'reward' && dist(p.x, p.y, 70, 70) < 70) { Snd.tap(); go('map'); return; }
  const sc = Scenes[scene]; sc.down && sc.down(p.x, p.y);
});
cvs.addEventListener('pointermove', e => {
  if (e.pointerId !== ptrId || ptrScene !== scene) return; const sc = Scenes[scene];
  const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
  for (const ev of (evs.length ? evs : [e])) { const p = toV(ev); sc.move && sc.move(p.x, p.y); }
});
function endPtr(e) { if (e.pointerId !== ptrId) return; ptrId = null; if (ptrScene !== scene) return; const p = toV(e); const sc = Scenes[scene]; sc.up && sc.up(p.x, p.y); }
cvs.addEventListener('pointerup', endPtr);
cvs.addEventListener('pointercancel', endPtr);
document.addEventListener('contextmenu', e => e.preventDefault());

window.onBack = function () { if (scene === 'map') return false; go('map'); return true; };
window.onPauseApp = function () { Snd.scrub(0); Voice.stop(); try { if (Snd.ac) Snd.ac.suspend(); } catch (e) {} };
window.onResumeApp = function () { try { if (Snd.ac) Snd.ac.resume(); } catch (e) {} };
document.addEventListener('visibilitychange', () => { if (document.hidden) window.onPauseApp(); else window.onResumeApp(); });

// ===== Smyčka =====
let last = performance.now();
function loop(ts) {
  let dt = (ts - last) / 1000; last = ts; if (dt > 0.05) dt = 0.05; if (dt < 0) dt = 0;
  T += dt; sceneT += dt;
  try {
    Music.tick();
    scrubWant = 0;
    Scenes[scene].update(dt);
    Snd.scrub(scrubWant);
    updParts(dt);
    ctx.setTransform(S, 0, 0, S, OX, OY);
    Scenes[scene].draw();
    drawParts();
    if (sceneT < 0.35) { const f = full(); ctx.fillStyle = 'rgba(255,255,255,' + (1 - sceneT / 0.35) + ')'; ctx.fillRect(f.x, f.y, f.w, f.h); }
  } catch (err) { console.error(err); }
  requestAnimationFrame(loop);
}
go(Save.profile ? 'map' : 'profile');
requestAnimationFrame(loop);
