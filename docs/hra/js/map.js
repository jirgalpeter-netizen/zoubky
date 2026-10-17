'use strict';
let scene = 'map', sceneT = 0;
const Scenes = {};
function go(name, arg) { scene = name; sceneT = 0; parts = []; Reward.active = false; scrubWant = 0; Snd.scrub(0); ptrScene = null; Scenes[name].enter(arg); }

// ===== MAPA ZOUBKOVÉ ZEMĚ =====
// Mezi některými kamarády se cesta rozdvojí: nahoře a dole je zastávka s minihrou, obě větve vedou ke stejnému kamarádovi.
const FORKS = { 1: ['paint', 'ears'], 3: ['bubbles', 'paint'], 5: ['ears', 'bubbles'], 10: ['paint', 'bubbles'], 13: ['ears', 'paint'], 16: ['bubbles', 'ears'] };
const NODE_X = (() => { const xs = [280]; for (let i = 1; i < CHARS.length; i++) xs.push(xs[i - 1] + (FORKS[i - 1] ? 560 : 370)); return xs; })();
const NODES = CHARS.map((c, i) => ({ x: NODE_X[i], y: 480 + Math.sin(i * 1.3 + 0.4) * 130 }));
const WW = NODES[NODES.length - 1].x + 440;
const NX = f => { const i = Math.max(0, Math.min(NODES.length - 2, Math.floor(f))); return NODE_X[i] + (NODE_X[i + 1] - NODE_X[i]) * (f - i); };
const ZONES = [ // [od x, do x, druh, barva země]
  [-600, NX(5.5), 'meadow', '#8fdc6a'], [NX(5.5), NX(8.5), 'forest', '#5fb84f'], [NX(8.5), NX(11.5), 'jungle', '#6cc04c'],
  [NX(11.5), NX(13.5), 'ginger', '#f2cfe0'], [NX(13.5), NX(16.5), 'town', '#a6d98a'], [NX(16.5), NX(17.5), 'swamp', '#7fa86a'],
  [NX(17.5), NX(18.5), 'space', '#8b86c9'], [NX(18.5), WW + 600, 'castle', '#f3dca0']
];
const RIVER_X = NX(8.5);
function zoneAt(x) { for (const z of ZONES) if (x >= z[0] && x < z[1]) return z[2]; return 'meadow'; }
const prand = s => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const bz = (a, b, c, d, t) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
// křivka úseku s → s+1; route: 'main' | 'up' | 'down'
function segCurve(s, route) {
  const A = NODES[s], B = NODES[s + 1], dx = B.x - A.x;
  if (route === 'up' || route === 'down') {
    const avg = (A.y + B.y) / 2, mid = route === 'up' ? Math.max(350, avg - 175) : Math.min(665, avg + 175), cy = (mid - 0.25 * avg) / 0.75;
    return [A.x, A.y, A.x + dx * 0.22, cy, B.x - dx * 0.22, cy, B.x, B.y];
  }
  return [A.x, A.y, A.x + dx * 0.45, A.y, B.x - dx * 0.45, B.y, B.x, B.y];
}
function curvePt(k, t) { return { x: bz(k[0], k[2], k[4], k[6], t), y: bz(k[1], k[3], k[5], k[7], t) }; }
function segRoutes(s) { return FORKS[s] ? ['up', 'down'] : ['main']; }
function stationAt(s, route) { const k = segCurve(s, route), p = curvePt(k, 0.5); return { x: p.x, y: p.y, kind: FORKS[s][route === 'up' ? 0 : 1], key: s + route[0] }; }
const STATIONS = []; for (const s in FORKS) for (const r of ['up', 'down']) STATIONS.push(Object.assign(stationAt(+s, r), { s: +s, route: r }));
const PATH_SAMPLES = (() => { const out = []; for (let s = 0; s < NODES.length - 1; s++) for (const r of segRoutes(s)) { const k = segCurve(s, r); for (let t = 0; t <= 1; t += 0.04) out.push(curvePt(k, t)); } return out; })();
function nearPath(x, y, d) { for (const p of PATH_SAMPLES) if (Math.abs(p.x - x) < d && Math.abs(p.y - y) < d) return true; return false; }
function pathY(x) {
  for (let s = 0; s < NODES.length - 1; s++) { if (x > NODES[s + 1].x) continue; const k = segCurve(s, 'main'); let lo = 0, hi = 1; for (let i = 0; i < 20; i++) { const m = (lo + hi) / 2; if (curvePt(k, m).x < x) lo = m; else hi = m; } return curvePt(k, lo).y; }
  return NODES[NODES.length - 1].y;
}
const DECO = (() => {
  const out = [];
  for (let i = 0; i < 520; i++) {
    const x = prand(i) * WW, y = 310 + prand(i + 500) * 410;
    if (nearPath(x, y, 105) || Math.abs(x - RIVER_X) < 120) continue;
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
  // cesta (s odbočkami)
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const trace = () => { ctx.beginPath(); ctx.moveTo(-200, NODES[0].y + 40); ctx.lineTo(NODES[0].x, NODES[0].y); for (let s = 0; s < NODES.length - 1; s++) for (const r of segRoutes(s)) { const k = segCurve(s, r); ctx.moveTo(k[0], k[1]); ctx.bezierCurveTo(k[2], k[3], k[4], k[5], k[6], k[7]); } };
  trace(); ctx.strokeStyle = '#e8c88a'; ctx.lineWidth = 64; ctx.stroke();
  trace(); ctx.strokeStyle = '#f6e2b4'; ctx.lineWidth = 50; ctx.stroke();
  trace(); ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 7; ctx.setLineDash([18, 22]); ctx.stroke(); ctx.setLineDash([]);
  const by = pathY(RIVER_X);
  ctx.fillStyle = '#a0703a'; for (let i = 0; i < 9; i++) { rr(RIVER_X - 90 + i * 20, by - 44, 16, 88, 4); ctx.fill(); }
  ctx.fillStyle = '#6d4220'; ctx.fillRect(RIVER_X - 100, by - 50, 200, 8); ctx.fillRect(RIVER_X - 100, by + 42, 200, 8);
  for (const d of DECO) if (d.x > camX - 200 && d.x < camX + 1800) drawDeco(d);
  ctx.restore();
}
// ikonka zastávky s minihrou
function drawStation(st, active) {
  const { x, y } = st, bob = active ? -Math.abs(Math.sin(T * 4)) * 10 : 0;
  ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.beginPath(); ctx.ellipse(x, y + 46, 46, 11, 0, 0, 7); ctx.fill();
  ctx.save(); ctx.translate(x, y - 20 + bob);
  ctx.fillStyle = '#8a5a30'; ctx.fillRect(-6, 10, 12, 50);
  const col = { paint: '#ff9f1a', ears: '#ff8fc7', bubbles: '#5fd0ff' }[st.kind];
  ctx.fillStyle = Save.stations[st.key] ? col : lighten(col, 0.35); ctx.beginPath(); ctx.arc(0, 0, 44, 0, 7); ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.stroke();
  drawGameIcon(st.kind, 0, 0, 26);
  if (Save.stations[st.key]) { ctx.fillStyle = '#ffd23f'; starPath(30, -30, 14, 6, 5); ctx.fill(); }
  ctx.restore();
}
function drawGameIcon(kind, x, y, s) {
  ctx.save(); ctx.translate(x, y);
  if (kind === 'paint') { // paleta se štětcem
    ctx.fillStyle = '#fff3d6'; ctx.beginPath(); ctx.ellipse(0, 0, s, s * 0.8, -0.3, 0, 7); ctx.fill();
    for (const [dx, dy, c] of [[-0.5, -0.3, '#ff4d6d'], [0, -0.5, '#ffd23f'], [0.5, -0.2, '#3fa9f5'], [0.4, 0.35, '#4cd964']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(dx * s, dy * s, s * 0.2, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#c98a5a'; ctx.beginPath(); ctx.arc(-s * 0.35, s * 0.35, s * 0.18, 0, 7); ctx.fill();
  } else if (kind === 'ears') { // ouško a vatová tyčinka
    ctx.fillStyle = '#ffc9b0'; ctx.beginPath(); ctx.ellipse(-s * 0.15, 0, s * 0.6, s * 0.85, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#d98a74'; ctx.lineWidth = s * 0.12; ctx.beginPath(); ctx.arc(-s * 0.1, -s * 0.1, s * 0.32, -2.2, 1.6); ctx.stroke();
    ctx.save(); ctx.rotate(-0.7); ctx.fillStyle = '#fff'; ctx.fillRect(s * 0.1, -s * 0.06, s * 1.0, s * 0.12); ctx.beginPath(); ctx.ellipse(s * 0.1, 0, s * 0.2, s * 0.14, 0, 0, 7); ctx.ellipse(s * 1.1, 0, s * 0.2, s * 0.14, 0, 0, 7); ctx.fill(); ctx.restore();
  } else { // bubliny
    for (const [dx, dy, r] of [[-0.35, 0.2, 0.5], [0.4, -0.25, 0.42], [0.25, 0.5, 0.25]]) { ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(dx * s, dy * s, r * s, 0, 7); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = s * 0.1; ctx.stroke(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(dx * s - r * s * 0.35, dy * s - r * s * 0.35, r * s * 0.2, 0, 7); ctx.fill(); }
  }
  ctx.restore();
}
Scenes.map = {
  greeted: false,
  enter(arg) {
    Music.on = true; this.sel = -1; this.selT = 0; this.drag = null; this.vx = 0;
    this.walk = null; this.allT = -1; this.choose = null; this.stSel = null;
    const cur = Math.min(Save.unlocked, CHARS.length - 1);
    const from = arg && arg.walkFrom != null ? arg.walkFrom : null, res = arg && arg.resume;
    const allDone = Save.done.length >= CHARS.length;
    if (res) { this.walk = { from: res.from, route: res.route, t: 0.5, t0: 0.5, dur: 3.2 }; this.camX = this.camAt(curvePt(segCurve(res.from, res.route), 0.5).x); }
    else if (from != null && from + 1 < CHARS.length) {
      this.camX = this.camFor(from);
      if (FORKS[from]) { this.choose = { from, t: 0 }; if (firstTimes('fork', 3)) say(P.forkAsk); }
      else this.walk = { from, route: 'main', t: -0.6, t0: 0, dur: 2.2 };
    } else {
      this.camX = this.camFor(cur);
      if (from === CHARS.length - 1 && allDone) { this.allT = 0; sayName(G(P.mapAll)); confetti(120); Snd.fanfare(); }
      else if (!this.greeted) setTimeout(() => { say('Ahoj, ' + prof().voc + '!'); if (firstTimes('hello', 2)) say(P.hello, true); }, 600);
    }
    this.greeted = true;
    this.btns = [
      { x: 110, y: 630, r: 70, color: '#ff9f1a', icon: 'book', fn: () => go('album') },
      { x: 1490, y: 630, r: 70, color: '#4cd964', icon: 'together', fn: () => go('together') },
      { x: 1535, y: 62, r: 40, color: '#b06cff', icon: 'music', fn: () => setMusic(!Save.music) },
      { x: 270, y: 64, r: 42, color: '#ffffff', icon: 'none', fn: () => go('profile') }
    ];
  },
  camAt(x) { return clamp(x - 800, 0, WW - VW); },
  camFor(i) { return this.camAt(NODES[i].x); },
  // rozcestník: dvě šipky s obrázkem zastávky
  forkSigns() { const s = this.choose.from; return ['up', 'down'].map(r => { const p = curvePt(segCurve(s, r), 0.27); return { route: r, x: p.x + 10, y: clamp(p.y + (r === 'up' ? -55 : -5), 350, 620), kind: FORKS[s][r === 'up' ? 0 : 1] }; }); },
  tokenPos() {
    if (this.walk) { const w = this.walk, k = clamp(w.t, 0, 1), p = curvePt(segCurve(w.from, w.route), k); return { x: p.x - 10, y: p.y - (w.t > w.t0 && !w.stop ? Math.abs(Math.sin(k * Math.PI * 9)) * 22 : 0), walking: !w.stop }; }
    if (this.choose) { const A = NODES[this.choose.from]; return { x: A.x - 118, y: A.y + 10 }; }
    const cur = Math.min(Save.unlocked, CHARS.length - 1), n = NODES[Save.done.length >= CHARS.length ? CHARS.length - 1 : cur];
    return { x: n.x - 118, y: n.y + 10 };
  },
  update(dt) {
    if (this.walk) {
      const w = this.walk, was = w.t;
      if (!w.stop) w.t += dt / w.dur;
      if (w.t > 0 && w.t < 1 && !w.stop && Math.floor(w.t * w.dur * 3.5) !== Math.floor(was * w.dur * 3.5)) Snd.step();
      const p = curvePt(segCurve(w.from, w.route), clamp(w.t, 0, 1));
      this.camX = lerp(this.camX, this.camAt(p.x), dt * 3);
      // zastávka v půlce odbočky
      if (w.route !== 'main' && was < 0.5 && w.t >= 0.5) { w.t = 0.5; w.stop = 0; const st = stationAt(w.from, w.route); Snd.sparkle(); burst(st.x - this.camX, st.y - 60, 20, {}); }
      if (w.stop != null) { w.stop += dt; if (w.stop > 0.9) { const st = stationAt(w.from, w.route); go('game', { kind: st.kind, key: st.key, resume: { from: w.from, route: w.route } }); return; } }
      if (w.t >= 1.08) { const to = w.from + 1; this.walk = null; Snd.sparkle(); burst(NODES[to].x - this.camX, NODES[to].y - 60, 25, {}); }
    } else if (!this.drag) { this.camX = clamp(this.camX + this.vx * dt, 0, WW - VW); this.vx *= Math.pow(0.05, dt); }
    if (this.choose) { this.choose.t += dt; if (this.choose.t > 14 && T - lastSay > IDLE_REPEAT) say(P.forkAsk); }
    if (this.stSel) { this.stSel.t += dt; if (this.stSel.t > 0.9) go('game', { kind: this.stSel.st.kind, key: this.stSel.st.key }); }
    if (this.sel >= 0) { this.selT += dt; if (this.selT > 1.6) go('level', this.sel); }
    else if (!this.choose && sceneT > 25 && T - lastSay > 30) say(P.mapIdle);
    if (this.allT >= 0) { this.allT += dt; if (Math.random() < dt * 1.5) confetti(30); }
  },
  draw() {
    const camX = this.camX;
    drawWorld(camX);
    ctx.save(); ctx.translate(-camX, 0);
    const cur = Math.min(Save.unlocked, CHARS.length - 1);
    for (const st of STATIONS) if (st.x > camX - 100 && st.x < camX + VW + 100) drawStation(st, this.walk && this.walk.stop != null && stationAt(this.walk.from, this.walk.route).key === st.key || (this.stSel && this.stSel.st === st));
    NODES.forEach((n, i) => {
      if (n.x < camX - 150 || n.x > camX + VW + 150) return;
      const c = CHARS[i], done = Save.done.indexOf(c.id) >= 0, locked = i > Save.unlocked || ((this.walk || this.choose) && i === (this.walk || this.choose).from + 1);
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
    if (this.choose) for (const f of this.forkSigns()) { // šipky na rozcestí
      const k = 1 + Math.sin(T * 5 + (f.route === 'up' ? 0 : 1.5)) * 0.07;
      ctx.save(); ctx.translate(f.x, f.y); ctx.scale(k, k); ctx.rotate(f.route === 'up' ? -0.55 : 0.55);
      ctx.fillStyle = '#ffd23f'; ctx.strokeStyle = '#c98a00'; ctx.lineWidth = 5; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(-50, -26); ctx.lineTo(20, -26); ctx.lineTo(20, -50); ctx.lineTo(70, 0); ctx.lineTo(20, 50); ctx.lineTo(20, 26); ctx.lineTo(-50, 26); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.rotate(f.route === 'up' ? 0.55 : -0.55); drawGameIcon(f.kind, -8, 0, 22);
      ctx.restore();
    }
    const tp = this.tokenPos(), pc = playerChar();
    ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.beginPath(); ctx.ellipse(tp.x, tp.y + 22, 38, 10, 0, 0, 7); ctx.fill();
    drawChar(pc, tp.x, tp.y - 40, 46, { mode: tp.walking ? 'grin' : 'closed', blink: blinkVal(9), happy: tp.walking });
    drawBrush(tp.x + 38, tp.y + 6, -1.1, 0.28, 1);
    if (this.choose && this.choose.t > 3) { const f = this.forkSigns()[Math.floor(T / 2.5) % 2]; drawHand(f.x + 20, f.y + 10, T, 0.9); }
    else if (!this.walk && !this.choose && this.sel < 0 && sceneT > 3 && Save.done.length < CHARS.length) { const n = NODES[cur]; drawHand(n.x + 20, n.y + 20, T, 0.9); }
    ctx.restore();
    starBadge(30, 26, Save.done.length);
    for (const b of this.btns) { if (b.icon === 'none') { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fill(); ctx.save(); ctx.beginPath(); ctx.arc(b.x, b.y, b.r - 3, 0, 7); ctx.clip(); drawChar(pc, b.x, b.y + 6, 34, { mode: 'closed', blink: blinkVal(4) }); ctx.restore(); ctx.strokeStyle = '#ff8fc7'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.stroke(); } else drawBtn(b); }
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
    if (this.walk || this.sel >= 0 || this.stSel) return;
    const wx = x + this.camX;
    if (this.choose) { // výběr cestičky
      for (const f of this.forkSigns()) if (dist(wx, y, f.x, f.y) < 90 || dist(wx, y, stationAt(this.choose.from, f.route).x, stationAt(this.choose.from, f.route).y) < 70) {
        Snd.tap(); Snd.sparkle(); buzz(30); this.walk = { from: this.choose.from, route: f.route, t: 0, t0: 0, dur: 3.2 }; this.choose = null; return;
      }
      return;
    }
    for (const st of STATIONS) if (Save.stations[st.key] && dist(wx, y, st.x, st.y - 20) < 60) { Snd.tap(); Snd.sparkle(); this.stSel = { st, t: 0 }; return; }
    NODES.forEach((n, i) => {
      if (this.sel >= 0 || dist(wx, y, n.x, n.y) > 90) return;
      if (i > Save.unlocked) { Snd.wrong(); buzz(60); if (T - lastSay > 6) say(P.mapLocked); return; }
      this.sel = i; this.selT = 0; Snd.tap(); Snd.sparkle(); buzz(30); if (Save.done.indexOf(CHARS[i].id) < 0 || firstTimes('story_' + i, 2)) say(CHARS[i].story);
      burst(n.x - this.camX, n.y - 60, 20, {});
    });
  }
};

// ===== KDO JSI? (postavička a jméno) =====
Scenes.profile = {
  enter() {
    const p = Save.profile;
    this.phase = 'avatar'; this.sel = p ? Math.max(0, AVATARS.findIndex(a => a.id === p.avId)) : -1; this.name = p ? [p.name, p.voc, p.g] : null;
    Music.on = true; if (firstTimes('whoAreYou', 3)) say(P.whoAreYou);
  },
  avPos(i) { return { x: 200 + (i % 5) * 300, y: i < 5 ? 300 : 560 }; },
  nameBtns() {
    const list = NAMES.f.map(n => [n[0], n[1], 'f']).concat(NAMES.m.map(n => [n[0], n[1], 'm'])).concat([['Jiné…', null, null]]);
    return list.map((n, i) => ({ x: 575 + (i % 6) * 170, y: 52 + Math.floor(i / 6) * 76, w: 160, h: 64, n }));
  },
  update(dt) {},
  draw() {
    bgBath('#ffe9f3');
    if (this.phase === 'avatar') {
      drawToothChar(800, 105, 56, T);
      AVATARS.forEach((a, i) => { const p = this.avPos(i), s = this.sel === i; const bob = s ? -Math.abs(Math.sin(T * 6)) * 18 : Math.sin(T * 2 + i) * 5;
        ctx.fillStyle = s ? '#fff6a0' : a.name ? 'rgba(255,240,200,.9)' : 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(p.x, p.y + bob, 104, 0, 7); ctx.fill();
        if (a.name) { ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 6; ctx.stroke(); }
        ctx.save(); ctx.beginPath(); ctx.arc(p.x, p.y + bob, 102, 0, 7); ctx.clip(); drawChar(a, p.x, p.y + 14 + bob, 72, { mode: s ? 'grin' : 'closed', blink: blinkVal(i + 2), happy: s }); ctx.restore(); });
      if (Save.profile) drawBtn({ x: 80, y: 640, r: 46, color: '#3fa9f5', icon: 'map' });
      return;
    }
    const a = AVATARS[this.sel];
    drawChar(a, 250, 290, 140, { mode: 'grin', blink: blinkVal(3) });
    if (this.name) { ctx.fillStyle = '#7a3a5a'; ctx.font = 'bold 50px Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(this.name[0], 250, 500); }
    for (const b of this.nameBtns()) {
      const on = this.name && b.n[0] === this.name[0], f = b.n[2] === 'f';
      ctx.fillStyle = on ? (f ? '#ff6fa8' : '#3fa9f5') : b.n[2] ? (f ? '#ffe3ef' : '#e2f2ff') : '#ffffff'; rr(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, 22); ctx.fill();
      ctx.fillStyle = on ? '#fff' : '#4a3a4a'; ctx.font = 'bold ' + (b.n[0].length > 8 ? 23 : 27) + 'px Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(b.n[0], b.x, b.y + 2);
    }
    drawBtn({ x: 80, y: 640, r: 50, color: '#3fa9f5', icon: 'prev' });
    if (this.name) drawBtn({ x: 250, y: 640, r: 62, color: '#4cd964', icon: 'next', pulse: true });
  },
  down(x, y) {
    if (this.phase === 'avatar') {
      if (Save.profile && dist(x, y, 80, 640) < 66) { Snd.tap(); go('map'); return; }
      AVATARS.forEach((a, i) => { const p = this.avPos(i); if (dist(x, y, p.x, p.y) < 106) { this.sel = i; Snd.tap(); Snd.sparkle(); burst(p.x, p.y - 80, 16, {}); if (a.name) say(a.name + '!'); setTimeout(() => { if (this.sel === i && this.phase === 'avatar') { this.phase = 'name'; if (firstTimes('nameAsk', 3)) say(P.nameAsk, true); } }, 900); } });
      return;
    }
    if (dist(x, y, 80, 640) < 70) { Snd.tap(); this.phase = 'avatar'; return; }
    if (this.name && dist(x, y, 250, 640) < 80) {
      Snd.tap(); Snd.fanfare();
      Save.profile = { g: this.name[2] || AVATARS[this.sel].g, name: this.name[0], voc: this.name[1], avId: AVATARS[this.sel].id }; Save.save();
      Scenes.map.greeted = false; go('map'); return;
    }
    for (const b of this.nameBtns()) if (Math.abs(x - b.x) < b.w / 2 && Math.abs(y - b.y) < b.h / 2) {
      Snd.tap();
      if (b.n[1] == null) {
        let n = null; try { n = window.prompt('Jak se dítě jmenuje?', ''); } catch (e) {}
        if (n && n.trim()) { let v = null; try { v = window.prompt('Jak ho/ji oslovovat? (5. pád, např. Aničko)', n.trim()); } catch (e) {} let g = null; try { g = window.confirm('Je to holčička? (OK = holčička, Zrušit = kluk)') ? 'f' : 'm'; } catch (e) {} this.name = [n.trim(), (v || n).trim(), g]; say('Ahoj, ' + this.name[1] + '!'); }
      } else { this.name = b.n; say('Ahoj, ' + b.n[1] + '!'); }
    }
  }
};
