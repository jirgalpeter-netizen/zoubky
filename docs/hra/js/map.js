'use strict';
let scene = 'map', sceneT = 0;
const Scenes = {};
function go(name, arg) { scene = name; sceneT = 0; parts = []; Reward.active = false; scrubWant = 0; Snd.scrub(0); ptrScene = null; Scenes[name].enter(arg); }

// ===== MAPA ZOUBKOVÉ ZEMĚ =====
const NODES = CHARS.map((c, i) => ({ x: 280 + i * 370, y: 480 + Math.sin(i * 1.3 + 0.4) * 130 }));
const WW = NODES[NODES.length - 1].x + 440;
const NX = i => 280 + i * 370;
const ZONES = [ // [od x, do x, druh, barva země]
  [-600, NX(5.5), 'meadow', '#8fdc6a'], [NX(5.5), NX(8.5), 'forest', '#5fb84f'], [NX(8.5), NX(11.5), 'jungle', '#6cc04c'],
  [NX(11.5), NX(13.5), 'ginger', '#f2cfe0'], [NX(13.5), NX(16.5), 'town', '#a6d98a'], [NX(16.5), NX(17.5), 'swamp', '#7fa86a'],
  [NX(17.5), NX(18.5), 'space', '#8b86c9'], [NX(18.5), WW + 600, 'castle', '#f3dca0']
];
const RIVER_X = NX(8.5);
function zoneAt(x) { for (const z of ZONES) if (x >= z[0] && x < z[1]) return z[2]; return 'meadow'; }
const prand = s => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
function pathY(x) {
  if (x <= NODES[0].x) return NODES[0].y;
  for (let i = 0; i < NODES.length - 1; i++) { const a = NODES[i], b = NODES[i + 1]; if (x <= b.x) return lerp(a.y, b.y, (x - a.x) / (b.x - a.x)); }
  return NODES[NODES.length - 1].y;
}
const DECO = (() => {
  const out = [];
  for (let i = 0; i < 520; i++) {
    const x = prand(i) * WW, y = 310 + prand(i + 500) * 410;
    if (Math.abs(y - pathY(x)) < 110 || Math.abs(x - RIVER_X) < 120) continue;
    const z = zoneAt(x), r = prand(i + 9);
    const kind = { meadow: r < 0.2 ? 'bush' : 'flower', forest: r < 0.65 ? 'tree' : r < 0.85 ? 'mushroom' : 'bush', jungle: r < 0.5 ? 'palm' : 'flower', ginger: r < 0.5 ? 'lolly' : r < 0.75 ? 'candy' : 'none', town: r < 0.25 ? 'house' : r < 0.6 ? 'flower' : 'tree', swamp: r < 0.6 ? 'reed' : 'lily', space: r < 0.5 ? 'crystal' : 'none', castle: r < 0.4 ? 'shell' : 'none' }[z];
    if (kind !== 'none') out.push({ x, y, kind, s: 0.7 + prand(i + 77) * 0.6, c: pick(['#ff8fc7', '#ffd23f', '#ffffff', '#b06cff', '#ff6b5e', '#5fd0ff']) });
  }
  return out.sort((a, b) => a.y - b.y);
})();
function drawDeco(d) {
  const { x, y, s } = d;
  switch (d.kind) {
    case 'flower': ctx.fillStyle = d.c; for (let i = 0; i < 5; i++) { const a = i * 1.256; ctx.beginPath(); ctx.arc(x + Math.cos(a) * 8 * s, y + Math.sin(a) * 8 * s, 7 * s, 0, 7); ctx.fill(); } ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(x, y, 6 * s, 0, 7); ctx.fill(); break;
    case 'tree': ctx.fillStyle = '#8a5a30'; rr(x - 10 * s, y - 50 * s, 20 * s, 55 * s, 6 * s); ctx.fill(); ctx.fillStyle = '#3f9a3f'; for (const [a, b, r] of [[0, -95, 50], [-32, -70, 38], [32, -70, 38]]) { ctx.beginPath(); ctx.arc(x + a * s, y + b * s, r * s, 0, 7); ctx.fill(); } ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.beginPath(); ctx.arc(x - 12 * s, y - 108 * s, 18 * s, 0, 7); ctx.fill(); break;
    case 'bush': ctx.fillStyle = '#4fae46'; for (const a of [-22, 0, 22]) { ctx.beginPath(); ctx.arc(x + a * s, y - 18 * s, 24 * s, 0, 7); ctx.fill(); } ctx.fillStyle = '#ff4d6d'; ctx.beginPath(); ctx.arc(x - 10 * s, y - 25 * s, 5 * s, 0, 7); ctx.arc(x + 14 * s, y - 15 * s, 5 * s, 0, 7); ctx.fill(); break;
    case 'mushroom': ctx.fillStyle = '#fff4e2'; rr(x - 8 * s, y - 26 * s, 16 * s, 28 * s, 6 * s); ctx.fill(); ctx.fillStyle = '#e8332b'; ctx.beginPath(); ctx.arc(x, y - 26 * s, 24 * s, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#fff'; for (const [a, b] of [[-10, -36], [8, -40], [14, -30]]) { ctx.beginPath(); ctx.arc(x + a * s, y + b * s, 4 * s, 0, 7); ctx.fill(); } break;
    case 'palm': ctx.strokeStyle = '#a0703a'; ctx.lineWidth = 14 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 20 * s, y - 70 * s, x + 6 * s, y - 130 * s); ctx.stroke(); ctx.fillStyle = '#2fa84f'; for (let i = 0; i < 6; i++) { ctx.save(); ctx.translate(x + 6 * s, y - 130 * s); ctx.rotate(i * 1.05 + Math.sin(T + x) * 0.05); ctx.beginPath(); ctx.ellipse(38 * s, 0, 40 * s, 11 * s, 0.3, 0, 7); ctx.fill(); ctx.restore(); } break;
    case 'lolly': ctx.fillStyle = '#fff'; ctx.fillRect(x - 4 * s, y - 70 * s, 8 * s, 70 * s); ctx.fillStyle = d.c; ctx.beginPath(); ctx.arc(x, y - 82 * s, 28 * s, 0, 7); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.arc(x, y - 82 * s, 15 * s, 0, 5); ctx.stroke(); break;
    case 'candy': ctx.fillStyle = d.c; ctx.beginPath(); ctx.ellipse(x, y - 12 * s, 18 * s, 12 * s, 0, 0, 7); ctx.fill(); for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + k * 16 * s, y - 12 * s); ctx.lineTo(x + k * 32 * s, y - 24 * s); ctx.lineTo(x + k * 32 * s, y); ctx.fill(); } break;
    case 'house': ctx.fillStyle = '#fff3d6'; ctx.fillRect(x - 40 * s, y - 60 * s, 80 * s, 60 * s); ctx.fillStyle = '#e8584a'; ctx.beginPath(); ctx.moveTo(x - 50 * s, y - 58 * s); ctx.lineTo(x, y - 100 * s); ctx.lineTo(x + 50 * s, y - 58 * s); ctx.fill(); ctx.fillStyle = '#7fd6ff'; ctx.fillRect(x - 28 * s, y - 45 * s, 18 * s, 16 * s); ctx.fillRect(x + 10 * s, y - 45 * s, 18 * s, 16 * s); ctx.fillStyle = '#8a5a30'; ctx.fillRect(x - 8 * s, y - 26 * s, 16 * s, 26 * s); break;
    case 'reed': ctx.strokeStyle = '#4f8a3a'; ctx.lineWidth = 4 * s; for (const a of [-8, 0, 8]) { ctx.beginPath(); ctx.moveTo(x + a * s, y); ctx.lineTo(x + a * 1.6 * s, y - 60 * s); ctx.stroke(); } ctx.fillStyle = '#7a4f28'; ctx.beginPath(); ctx.ellipse(x, y - 64 * s, 6 * s, 16 * s, 0, 0, 7); ctx.fill(); break;
    case 'lily': ctx.fillStyle = '#4fae46'; ctx.beginPath(); ctx.ellipse(x, y, 30 * s, 14 * s, 0, 0.3, 6); ctx.lineTo(x, y); ctx.fill(); ctx.fillStyle = '#ff8fc7'; ctx.beginPath(); ctx.arc(x + 6 * s, y - 6 * s, 7 * s, 0, 7); ctx.fill(); break;
    case 'crystal': ctx.fillStyle = d.c; ctx.beginPath(); ctx.moveTo(x, y - 50 * s); ctx.lineTo(x + 14 * s, y); ctx.lineTo(x - 14 * s, y); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.moveTo(x, y - 50 * s); ctx.lineTo(x + 4 * s, y); ctx.lineTo(x - 6 * s, y); ctx.fill(); break;
    case 'shell': ctx.fillStyle = '#ffb3c1'; ctx.beginPath(); ctx.arc(x, y, 14 * s, Math.PI, 0); ctx.fill(); ctx.strokeStyle = '#e88a9e'; ctx.lineWidth = 2; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + i * 6 * s, y - 13 * s); ctx.stroke(); } break;
  }
}
function drawGingerHouse(x, y) {
  ctx.fillStyle = '#b8743a'; ctx.fillRect(x - 110, y - 120, 220, 140);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x - 140, y - 115); ctx.lineTo(x, y - 230); ctx.lineTo(x + 140, y - 115); ctx.fill();
  ctx.fillStyle = '#9a5c28'; ctx.beginPath(); ctx.moveTo(x - 128, y - 118); ctx.lineTo(x, y - 215); ctx.lineTo(x + 128, y - 118); ctx.fill();
  for (let i = 0; i < 9; i++) { ctx.fillStyle = CONF[i % 6]; ctx.beginPath(); ctx.arc(x - 90 + i * 22, y - 130 - (i < 5 ? i : 8 - i) * 16, 8, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#ff8fc7'; rr(x - 26, y - 60, 52, 80, 26); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillRect(x - 90, y - 90, 40, 36); ctx.fillRect(x + 50, y - 90, 40, 36);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.setLineDash([10, 8]); ctx.strokeRect(x - 110, y - 120, 220, 140); ctx.setLineDash([]);
}
function drawUfo(x, y) {
  ctx.save(); ctx.translate(x, y + Math.sin(T * 2) * 10);
  ctx.fillStyle = 'rgba(255,255,160,.25)'; ctx.beginPath(); ctx.moveTo(-40, 20); ctx.lineTo(40, 20); ctx.lineTo(90, 200); ctx.lineTo(-90, 200); ctx.fill();
  ctx.fillStyle = '#9fe3ff'; ctx.beginPath(); ctx.arc(0, -10, 42, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#c4c9cf'; ctx.beginPath(); ctx.ellipse(0, 6, 110, 28, 0, 0, 7); ctx.fill();
  for (let i = 0; i < 5; i++) { ctx.fillStyle = Math.sin(T * 6 + i) > 0 ? '#ffd23f' : '#ff4d6d'; ctx.beginPath(); ctx.arc(-70 + i * 35, 10, 7, 0, 7); ctx.fill(); }
  ctx.restore();
}
function drawWorld(camX) {
  const f = full();
  const g = ctx.createLinearGradient(0, f.y, 0, 300); g.addColorStop(0, '#6ccdfc'); g.addColorStop(1, '#d4f3ff');
  ctx.fillStyle = g; ctx.fillRect(f.x, f.y, f.w, f.h);
  ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(1380, 90, 52, 0, 7); ctx.fill(); cuteFace(1380, 95, 34);
  for (let i = 0; i < 9; i++) { const x = ((i * 900 + T * 12 - camX * 0.3) % 8100 + 8100) % 8100 - 300; cloud(x, 60 + (i % 3) * 45, 0.7 + (i % 2) * 0.4); }
  ctx.save(); ctx.translate(-camX, 0);
  // noční nebe nad vesmírnou zónou
  const sp = ZONES.find(z => z[2] === 'space');
  const gs = ctx.createLinearGradient(0, f.y, 0, 300); gs.addColorStop(0, '#1b1f4a'); gs.addColorStop(1, '#5a4fa8');
  ctx.fillStyle = gs; rr(sp[0] - 60, f.y - 10, sp[1] - sp[0] + 120, 320 - f.y, 60); ctx.fill();
  for (let k = 0; k < 30; k++) { ctx.fillStyle = 'rgba(255,255,255,' + (0.5 + 0.5 * Math.sin(T * 2 + k)) + ')'; ctx.beginPath(); ctx.arc(sp[0] + prand(k) * (sp[1] - sp[0]), f.y + prand(k + 50) * (290 - f.y), 2.5, 0, 7); ctx.fill(); }
  // hory za městem
  for (let i = 0; i < 9; i++) {
    const x = NX(13.5) + i * 120, h = 160 + prand(i + 3) * 110;
    ctx.fillStyle = '#9aa7b8'; ctx.beginPath(); ctx.moveTo(x - 140, 300); ctx.lineTo(x, 300 - h); ctx.lineTo(x + 140, 300); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(x - 38, 300 - h + 52); ctx.lineTo(x, 300 - h); ctx.lineTo(x + 38, 300 - h + 52); ctx.lineTo(x + 12, 300 - h + 42); ctx.lineTo(x, 300 - h + 56); ctx.lineTo(x - 14, 300 - h + 42); ctx.fill();
  }
  // hrad
  const cx = NODES[NODES.length - 1].x + 30;
  ctx.fillStyle = '#ffc6dc'; rr(cx - 150, 120, 300, 190, 10); ctx.fill();
  for (const dx of [-170, -60, 60, 170]) { ctx.fillStyle = '#ffb0cc'; rr(cx + dx - 32, 70 + Math.abs(dx) * 0.2, 64, 240, 8); ctx.fill(); ctx.fillStyle = '#b06cff'; ctx.beginPath(); ctx.moveTo(cx + dx - 42, 72 + Math.abs(dx) * 0.2); ctx.lineTo(cx + dx, 10 + Math.abs(dx) * 0.2); ctx.lineTo(cx + dx + 42, 72 + Math.abs(dx) * 0.2); ctx.fill(); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.moveTo(cx + dx, 10 + Math.abs(dx) * 0.2); ctx.lineTo(cx + dx + 30, 20 + Math.abs(dx) * 0.2 + Math.sin(T * 3 + dx) * 4); ctx.lineTo(cx + dx, 30 + Math.abs(dx) * 0.2); ctx.fill(); }
  ctx.fillStyle = '#c0477a'; ctx.beginPath(); ctx.arc(cx, 280, 40, Math.PI, 0); ctx.fillRect(cx - 40, 280, 80, 30); ctx.fill();
  // zem po zónách
  for (const [a, b, , col] of ZONES) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(a, 300); for (let x = a; x <= b; x += 40) ctx.lineTo(x, 292 + Math.sin(x / 160) * 10); ctx.lineTo(b, f.y + f.h + 10); ctx.lineTo(a, f.y + f.h + 10); ctx.closePath(); ctx.fill(); }
  // řeka, bažina, moře
  ctx.fillStyle = '#5fc4f5'; ctx.beginPath(); ctx.moveTo(RIVER_X - 60, 296); ctx.bezierCurveTo(RIVER_X + 30, 420, RIVER_X - 70, 560, RIVER_X + 20, f.y + f.h + 10); ctx.lineTo(RIVER_X + 100, f.y + f.h + 10); ctx.bezierCurveTo(RIVER_X + 20, 560, RIVER_X + 120, 420, RIVER_X + 60, 296); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 4; for (let i = 0; i < 6; i++) { const y = 340 + i * 70 + (T * 30) % 70; ctx.beginPath(); ctx.moveTo(RIVER_X - 15 + Math.sin(y / 50) * 30, y); ctx.lineTo(RIVER_X + 15 + Math.sin(y / 50) * 30, y + 8); ctx.stroke(); }
  const sw = ZONES.find(z => z[2] === 'swamp'); ctx.fillStyle = 'rgba(90,140,110,.6)'; ctx.beginPath(); ctx.ellipse((sw[0] + sw[1]) / 2, 640, 220, 70, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#3fa9f5'; ctx.beginPath(); ctx.moveTo(WW - 260, f.y + f.h + 10); ctx.quadraticCurveTo(WW - 200, 560, WW + 600, 520); ctx.lineTo(WW + 600, f.y + f.h + 10); ctx.closePath(); ctx.fill();
  drawGingerHouse(NX(12.5), 400);
  drawUfo(NX(18) + 150, 170);
  // cesta
  const pathTrace = () => { ctx.beginPath(); ctx.moveTo(-200, NODES[0].y + 40); ctx.lineTo(NODES[0].x, NODES[0].y); for (let i = 1; i < NODES.length - 1; i++) { const p = NODES[i], q = NODES[i + 1]; ctx.quadraticCurveTo(p.x, p.y, (p.x + q.x) / 2, (p.y + q.y) / 2); } const L = NODES[NODES.length - 1]; ctx.lineTo(L.x, L.y); };
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  pathTrace(); ctx.strokeStyle = '#e8c88a'; ctx.lineWidth = 64; ctx.stroke();
  pathTrace(); ctx.strokeStyle = '#f6e2b4'; ctx.lineWidth = 50; ctx.stroke();
  pathTrace(); ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 7; ctx.setLineDash([18, 22]); ctx.stroke(); ctx.setLineDash([]);
  const by = pathY(RIVER_X);
  ctx.fillStyle = '#a0703a'; for (let i = 0; i < 9; i++) { rr(RIVER_X - 90 + i * 20, by - 44, 16, 88, 4); ctx.fill(); }
  ctx.fillStyle = '#6d4220'; ctx.fillRect(RIVER_X - 100, by - 50, 200, 8); ctx.fillRect(RIVER_X - 100, by + 42, 200, 8);
  for (const d of DECO) if (d.x > camX - 200 && d.x < camX + 1800) drawDeco(d);
  ctx.restore();
}
Scenes.map = {
  greeted: false,
  enter(arg) {
    Music.on = true; this.sel = -1; this.selT = 0; this.drag = null; this.vx = 0;
    this.walk = null; this.allT = -1;
    const cur = Math.min(Save.unlocked, CHARS.length - 1);
    const from = arg && arg.walkFrom != null ? arg.walkFrom : null;
    const allDone = Save.done.length >= CHARS.length;
    if (from != null && from + 1 < CHARS.length) { this.walk = { from, to: from + 1, t: -0.6 }; this.camX = this.camFor(from); say(P.mapWalk); }
    else {
      this.camX = this.camFor(cur);
      if (from === CHARS.length - 1 && allDone) { this.allT = 0; sayName(G(P.mapAll)); confetti(120); Snd.fanfare(); }
      else if (!this.greeted) setTimeout(() => { say('Ahoj, ' + prof().voc + '!'); say(P.hello, true); }, 600);
      else sayName(P.mapAgain);
    }
    this.greeted = true;
    this.btns = [
      { x: 110, y: 630, r: 70, color: '#ff9f1a', icon: 'book', fn: () => go('album') },
      { x: 1490, y: 630, r: 70, color: '#4cd964', icon: 'together', fn: () => go('together') },
      { x: 1535, y: 62, r: 40, color: '#b06cff', icon: 'music', fn: () => setMusic(!Save.music) },
      { x: 270, y: 64, r: 42, color: '#ffffff', icon: 'none', fn: () => go('profile') }
    ];
  },
  camFor(i) { return clamp(NODES[i].x - 800, 0, WW - VW); },
  tokenPos() {
    const cur = Math.min(Save.unlocked, CHARS.length - 1);
    if (this.walk) { const k = clamp(this.walk.t / 2.0, 0, 1), a = NODES[this.walk.from], b = NODES[this.walk.to]; return { x: lerp(a.x, b.x, easeInOut(k)) - 118, y: lerp(a.y, b.y, easeInOut(k)) - Math.abs(Math.sin(k * Math.PI * 7)) * 26 }; }
    const n = NODES[Save.done.length >= CHARS.length ? CHARS.length - 1 : cur];
    return { x: n.x - 118, y: n.y + 10 };
  },
  update(dt) {
    if (this.walk) {
      const w = this.walk; w.t += dt;
      if (w.t > 0 && Math.floor(w.t * 3.5) !== Math.floor((w.t - dt) * 3.5) && w.t < 2) Snd.step();
      this.camX = lerp(this.camX, this.camFor(w.t < 1 ? w.from : w.to), dt * 2.5);
      if (w.t > 2.2) { this.walk = null; Snd.sparkle(); burst(NODES[w.to].x - this.camX, NODES[w.to].y - 60, 25, {}); say(CHARS[w.to].story); }
    } else if (!this.drag) { this.camX = clamp(this.camX + this.vx * dt, 0, WW - VW); this.vx *= Math.pow(0.05, dt); }
    if (this.sel >= 0) { this.selT += dt; if (this.selT > 1.6) go('level', this.sel); }
    else if (sceneT > 15 && T - lastSay > 15) say(P.mapIdle);
    if (this.allT >= 0) { this.allT += dt; if (Math.random() < dt * 1.5) confetti(30); }
  },
  draw() {
    const camX = this.camX;
    drawWorld(camX);
    ctx.save(); ctx.translate(-camX, 0);
    const cur = Math.min(Save.unlocked, CHARS.length - 1);
    NODES.forEach((n, i) => {
      if (n.x < camX - 150 || n.x > camX + VW + 150) return;
      const c = CHARS[i], done = Save.done.indexOf(c.id) >= 0, locked = i > Save.unlocked || (this.walk && i === this.walk.to && this.walk.t < 2);
      const isCur = !locked && !done && i === cur, sel = this.sel === i;
      const bob = isCur || sel ? -Math.abs(Math.sin(T * (sel ? 9 : 3))) * (sel ? 30 : 12) : 0;
      ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.beginPath(); ctx.ellipse(n.x, n.y + 70, 70, 16, 0, 0, 7); ctx.fill();
      ctx.save(); ctx.translate(0, bob);
      ctx.fillStyle = locked ? '#d5dae0' : '#ffffff'; ctx.beginPath(); ctx.arc(n.x, n.y, 74, 0, 7); ctx.fill();
      ctx.lineWidth = 10; ctx.strokeStyle = locked ? '#aab2bc' : done ? '#4cd964' : isCur ? (Math.sin(T * 6) > 0 ? '#ffd23f' : '#ffb800') : '#3fa9f5'; ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.arc(n.x, n.y, 68, 0, 7); ctx.clip();
      drawChar(c, n.x, n.y + 6, 50, { mode: done ? 'grin' : 'closed', blink: blinkVal(i), happy: done });
      if (locked) { ctx.fillStyle = 'rgba(200,206,214,.75)'; ctx.fillRect(n.x - 80, n.y - 80, 160, 160); }
      ctx.restore();
      if (locked) drawLock(n.x, n.y + 6, 34);
      if (done) { drawCrown(n.x, n.y - 62, 54); ctx.fillStyle = '#4cd964'; ctx.beginPath(); ctx.arc(n.x + 55, n.y + 50, 22, 0, 7); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(n.x + 45, n.y + 50); ctx.lineTo(n.x + 53, n.y + 58); ctx.lineTo(n.x + 66, n.y + 42); ctx.stroke(); }
      ctx.restore();
    });
    const tp = this.tokenPos();
    drawChar(playerChar(), tp.x, tp.y - 40, 46, { mode: 'closed', blink: blinkVal(9) });
    drawBrush(tp.x + 38, tp.y + 6, -1.1, 0.28, 1);
    if (!this.walk && this.sel < 0 && sceneT > 3 && Save.done.length < CHARS.length) { const n = NODES[cur]; drawHand(n.x + 20, n.y + 20, T, 0.9); }
    ctx.restore();
    starBadge(30, 26, Save.done.length);
    for (const b of this.btns) { if (b.icon === 'none') { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fill(); ctx.save(); ctx.beginPath(); ctx.arc(b.x, b.y, b.r - 3, 0, 7); ctx.clip(); drawChar(playerChar(), b.x, b.y + 6, 34, { mode: 'closed', blink: blinkVal(4) }); ctx.restore(); ctx.strokeStyle = '#ff8fc7'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.stroke(); } else drawBtn(b); }
  },
  down(x, y) {
    const b = hitBtn(this.btns, x, y); if (b) { Snd.tap(); b.fn(); return; }
    this.drag = { sx: x, sy: y, cam: this.camX, moved: false, lt: T }; this.vx = 0;
  },
  move(x, y) {
    const d = this.drag; if (!d) return;
    if (Math.abs(x - d.sx) > 16) d.moved = true;
    if (d.moved) { const nc = clamp(d.cam - (x - d.sx), 0, WW - VW); const dt = Math.max(0.008, T - d.lt); this.vx = (nc - this.camX) / dt * 0.5 + this.vx * 0.5; this.camX = nc; d.lt = T; }
  },
  up(x, y) {
    const d = this.drag; this.drag = null; if (!d || d.moved) return;
    this.vx = 0;
    if (this.walk || this.sel >= 0) return;
    const wx = x + this.camX;
    NODES.forEach((n, i) => {
      if (this.sel >= 0 || dist(wx, y, n.x, n.y) > 90) return;
      if (i > Save.unlocked) { Snd.wrong(); buzz(60); say(P.mapLocked); return; }
      this.sel = i; this.selT = 0; Snd.tap(); Snd.sparkle(); buzz(30); say(CHARS[i].story);
      burst(n.x - this.camX, n.y - 60, 20, {});
    });
  }
};

// ===== KDO JSI? (avatar a jméno) =====
Scenes.profile = {
  enter() {
    this.phase = 'avatar'; this.sel = Save.profile ? Save.profile.av : -1; this.selT = 0; this.name = Save.profile ? [Save.profile.name, Save.profile.voc] : null;
    Music.on = true; say(P.whoAreYou);
  },
  avPos(i) { return { x: 230 + i * 228, y: 400 }; },
  nameBtns() {
    const g = AVATARS[this.sel].g, list = NAMES[g].concat([['Jiné…', null]]);
    return list.map((n, i) => ({ x: 560 + (i % 4) * 255, y: 70 + Math.floor(i / 4) * 92, w: 235, h: 76, n }));
  },
  update(dt) { this.selT += dt; },
  draw() {
    bgBath('#ffe9f3');
    if (this.phase === 'avatar') {
      drawToothChar(800, 130, 70, T);
      AVATARS.forEach((a, i) => { const p = this.avPos(i), s = this.sel === i; const bob = s ? -Math.abs(Math.sin(T * 6)) * 20 : Math.sin(T * 2 + i) * 5; ctx.fillStyle = s ? '#fff6a0' : 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(p.x, p.y + bob, 108, 0, 7); ctx.fill(); drawChar(a, p.x, p.y + 8 + bob, 82, { mode: s ? 'grin' : 'closed', blink: blinkVal(i + 2), happy: s }); });
      return;
    }
    const a = AVATARS[this.sel];
    drawChar(a, 250, 300, 150, { mode: 'grin', blink: blinkVal(3) });
    if (this.name) { ctx.fillStyle = '#7a3a5a'; ctx.font = 'bold 54px Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(this.name[0], 250, 520); }
    for (const b of this.nameBtns()) {
      const on = this.name && b.n[0] === this.name[0];
      ctx.fillStyle = on ? '#ff8fc7' : '#ffffff'; rr(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, 24); ctx.fill();
      ctx.fillStyle = on ? '#fff' : '#5a3a4a'; ctx.font = 'bold 34px Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(b.n[0], b.x, b.y + 2);
    }
    drawBtn({ x: 80, y: 640, r: 50, color: '#3fa9f5', icon: 'prev' });
    if (this.name) drawBtn({ x: 250, y: 640, r: 62, color: '#4cd964', icon: 'next', pulse: true });
  },
  down(x, y) {
    if (this.phase === 'avatar') {
      AVATARS.forEach((a, i) => { const p = this.avPos(i); if (dist(x, y, p.x, p.y) < 110) { this.sel = i; Snd.tap(); Snd.sparkle(); burst(p.x, p.y - 80, 16, {}); say(P.thatsYou); setTimeout(() => { if (this.sel === i && this.phase === 'avatar') { this.phase = 'name'; if (this.name && !NAMES[a.g].some(n => n[0] === this.name[0])) this.name = null; say(P.nameAsk, true); } }, 1100); } });
      return;
    }
    if (dist(x, y, 80, 640) < 70) { Snd.tap(); this.phase = 'avatar'; return; }
    if (this.name && dist(x, y, 250, 640) < 80) {
      Snd.tap(); Snd.fanfare();
      Save.profile = { g: AVATARS[this.sel].g, name: this.name[0], voc: this.name[1], av: this.sel }; Save.save();
      Scenes.map.greeted = false; go('map'); return;
    }
    for (const b of this.nameBtns()) if (Math.abs(x - b.x) < b.w / 2 && Math.abs(y - b.y) < b.h / 2) {
      Snd.tap();
      if (b.n[1] == null) {
        let n = null; try { n = window.prompt('Jak se dítě jmenuje?', ''); } catch (e) {}
        if (n && n.trim()) { let v = null; try { v = window.prompt('Jak ho/ji oslovovat? (5. pád, např. Aničko)', n.trim()); } catch (e) {} this.name = [n.trim(), (v || n).trim()]; say('Ahoj, ' + this.name[1] + '!'); }
      } else { this.name = b.n; say('Ahoj, ' + b.n[1] + '!'); }
    }
  }
};
