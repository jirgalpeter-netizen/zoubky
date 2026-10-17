'use strict';
// ===== Nálepky =====
const ITEM_STICKERS = ['star', 'heart', 'rainbow', 'sun', 'balloon', 'crown', 'flower', 'rocket', 'fish', 'butterfly', 'strawberry', 'tooth'];
const STNAME = { star: 'Hvězdička', heart: 'Srdíčko', rainbow: 'Duha', sun: 'Sluníčko', balloon: 'Balónek', crown: 'Korunka', flower: 'Kytička', rocket: 'Raketa', fish: 'Rybička', butterfly: 'Motýlek', strawberry: 'Jahůdka', tooth: 'Zoubek' };
function stickerName(id) { if (id.startsWith('c:')) { const c = CHAR_BY[id.slice(2)]; return c ? c.name : ''; } return STNAME[id] || ''; }
function drawSticker(id, x, y, r, rot, noBack) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0);
  if (!noBack) {
    ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = r * 0.15; ctx.shadowOffsetY = r * 0.05;
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
    ctx.shadowColor = 'transparent';
  }
  const s = r * 0.72;
  if (id.startsWith('c:')) { const c = CHAR_BY[id.slice(2)]; if (c) drawChar(c, 0, s * 0.12, s * 0.78, { mode: 'closed', happy: true }); ctx.restore(); return; }
  switch (id) {
    case 'star': ctx.fillStyle = '#ffcc00'; starPath(0, s * 0.05, s, s * 0.48, 5); ctx.fill(); ctx.strokeStyle = '#e69500'; ctx.lineWidth = r * 0.04; ctx.lineJoin = 'round'; ctx.stroke(); cuteFace(0, s * 0.12, s * 0.45); break;
    case 'heart': ctx.fillStyle = '#ff4d6d'; heartPath(0, 0, s * 0.95); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.ellipse(-s * 0.4, -s * 0.3, s * 0.12, s * 0.2, -0.6, 0, 7); ctx.fill(); cuteFace(0, 0, s * 0.45); break;
    case 'rainbow': {
      const cols = ['#ff4d4d', '#ffa31a', '#ffe11a', '#4cd964', '#3fa9f5', '#9b59b6'];
      ctx.lineWidth = s * 0.13; cols.forEach((c, i) => { ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(0, s * 0.35, s * (0.95 - i * 0.13), Math.PI, Math.PI * 2); ctx.stroke(); });
      ctx.fillStyle = '#fff'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * s * 0.72, s * 0.38, s * 0.2, 0, 7); ctx.arc(k * s * 0.52, s * 0.42, s * 0.16, 0, 7); ctx.arc(k * s * 0.9, s * 0.44, s * 0.15, 0, 7); ctx.fill(); }
      break;
    }
    case 'sun':
      ctx.save(); ctx.rotate(T * 0.5); ctx.fillStyle = '#ffb000';
      for (let i = 0; i < 12; i++) { ctx.rotate(Math.PI / 6); ctx.beginPath(); ctx.moveTo(-s * 0.12, -s * 0.6); ctx.lineTo(0, -s * 0.98); ctx.lineTo(s * 0.12, -s * 0.6); ctx.fill(); }
      ctx.restore(); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(0, 0, s * 0.62, 0, 7); ctx.fill(); cuteFace(0, s * 0.05, s * 0.45); break;
    case 'balloon':
      ctx.strokeStyle = '#999'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, s * 0.55); ctx.quadraticCurveTo(-s * 0.2, s * 0.75, s * 0.05, s * 0.95); ctx.stroke();
      ctx.fillStyle = '#ff5fa2'; ctx.beginPath(); ctx.ellipse(0, -s * 0.12, s * 0.58, s * 0.68, 0, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-s * 0.1, s * 0.62); ctx.lineTo(s * 0.1, s * 0.62); ctx.lineTo(0, s * 0.52); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.ellipse(-s * 0.25, -s * 0.4, s * 0.1, s * 0.2, -0.4, 0, 7); ctx.fill(); break;
    case 'crown': drawCrown(0, s * 0.45, s * 1.6); break;
    case 'flower':
      ctx.fillStyle = '#4cbf3c'; ctx.fillRect(-s * 0.05, s * 0.2, s * 0.1, s * 0.75);
      ctx.fillStyle = '#ff8fc7'; for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; ctx.beginPath(); ctx.arc(Math.cos(a) * s * 0.42, -s * 0.15 + Math.sin(a) * s * 0.42, s * 0.3, 0, 7); ctx.fill(); }
      ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(0, -s * 0.15, s * 0.32, 0, 7); ctx.fill(); cuteFace(0, -s * 0.12, s * 0.28); break;
    case 'rocket':
      ctx.rotate(0.6);
      ctx.fillStyle = '#ff9f1a'; ctx.beginPath(); ctx.moveTo(-s * 0.18, s * 0.55); ctx.quadraticCurveTo(0, s * (1.0 + Math.sin(T * 20) * 0.08), s * 0.18, s * 0.55); ctx.fill();
      ctx.fillStyle = '#e8332b'; ctx.beginPath(); ctx.moveTo(-s * 0.28, s * 0.25); ctx.lineTo(-s * 0.5, s * 0.65); ctx.lineTo(-s * 0.2, s * 0.55); ctx.fill(); ctx.beginPath(); ctx.moveTo(s * 0.28, s * 0.25); ctx.lineTo(s * 0.5, s * 0.65); ctx.lineTo(s * 0.2, s * 0.55); ctx.fill();
      ctx.fillStyle = '#eef3f8'; ctx.beginPath(); ctx.ellipse(0, -s * 0.05, s * 0.3, s * 0.68, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#e8332b'; ctx.beginPath(); ctx.moveTo(-s * 0.26, -s * 0.38); ctx.quadraticCurveTo(0, -s * 0.95, s * 0.26, -s * 0.38); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#3fa9f5'; ctx.beginPath(); ctx.arc(0, -s * 0.05, s * 0.15, 0, 7); ctx.fill(); ctx.strokeStyle = '#8899aa'; ctx.lineWidth = 3; ctx.stroke(); break;
    case 'fish':
      ctx.fillStyle = '#3fa9f5'; ctx.beginPath(); ctx.moveTo(s * 0.45, 0); ctx.lineTo(s * 0.95, -s * 0.4); ctx.lineTo(s * 0.95, s * 0.4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#5fd0ff'; ctx.beginPath(); ctx.ellipse(-s * 0.1, 0, s * 0.65, s * 0.45, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.ellipse(0, -s * 0.05, s * 0.12, s * 0.35, 0.2, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-s * 0.4, -s * 0.08, s * 0.13, 0, 7); ctx.fill(); ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(-s * 0.42, -s * 0.07, s * 0.07, 0, 7); ctx.fill(); break;
    case 'butterfly':
      for (const k of [-1, 1]) { ctx.fillStyle = '#b06cff'; ctx.beginPath(); ctx.ellipse(k * s * 0.42, -s * 0.25, s * 0.38, s * 0.42, k * 0.4, 0, 7); ctx.fill(); ctx.fillStyle = '#ff8fc7'; ctx.beginPath(); ctx.ellipse(k * s * 0.35, s * 0.32, s * 0.26, s * 0.3, -k * 0.4, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(k * s * 0.45, -s * 0.25, s * 0.1, 0, 7); ctx.fill(); }
      ctx.fillStyle = '#4a2e1c'; rr(-s * 0.08, -s * 0.55, s * 0.16, s * 1.1, s * 0.08); ctx.fill();
      ctx.strokeStyle = '#4a2e1c'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -s * 0.5); ctx.lineTo(-s * 0.2, -s * 0.85); ctx.moveTo(0, -s * 0.5); ctx.lineTo(s * 0.2, -s * 0.85); ctx.stroke(); break;
    case 'strawberry':
      ctx.fillStyle = '#ff3b4f'; ctx.beginPath(); ctx.moveTo(0, s * 0.85); ctx.bezierCurveTo(-s * 0.9, s * 0.2, -s * 0.7, -s * 0.6, 0, -s * 0.45); ctx.bezierCurveTo(s * 0.7, -s * 0.6, s * 0.9, s * 0.2, 0, s * 0.85); ctx.fill();
      ctx.fillStyle = '#ffe07a'; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.ellipse(((i % 3) - 1) * s * 0.3 + (Math.floor(i / 3) % 2) * s * 0.1, -s * 0.1 + Math.floor(i / 3) * s * 0.28, s * 0.04, s * 0.07, 0, 0, 7); ctx.fill(); }
      ctx.fillStyle = '#4cbf3c'; for (let i = 0; i < 5; i++) { ctx.save(); ctx.translate(0, -s * 0.48); ctx.rotate(-1.2 + i * 0.6); ctx.beginPath(); ctx.ellipse(0, -s * 0.15, s * 0.08, s * 0.2, 0, 0, 7); ctx.fill(); ctx.restore(); } break;
    case 'tooth': drawToothChar(0, 0, s * 0.85, T, true); break;
  }
  ctx.restore();
}

// ===== Jídlo do kvízu =====
const FOOD = {
  apple: { good: true, yes: 'Ano! Jablíčko je pro zoubky zdravé. Mňam!' },
  carrot: { good: true, yes: 'Ano! Mrkvička je pro zoubky zdravá. Mňam!' },
  cheese: { good: true, yes: 'Ano! Sýr je pro zoubky zdravý. Mňam!' },
  cucumber: { good: true, yes: 'Ano! Okurka je pro zoubky zdravá.' },
  milk: { good: true, yes: 'Ano! Mlíčko dělá zoubky silné.' },
  broccoli: { good: true, yes: 'Ano! Brokolice je zdravá.' },
  pear: { good: true, yes: 'Ano! Hruška je zdravá. Mňam!' },
  yogurt: { good: true, yes: 'Ano! Bílý jogurt je pro zoubky dobrý.' },
  lolly: { good: false }, choco: { good: false }, soda: { good: false }, cake: { good: false },
  donut: { good: false }, gummy: { good: false }, icecream: { good: false }
};
const GOOD_FOOD = Object.keys(FOOD).filter(k => FOOD[k].good), BAD_FOOD = Object.keys(FOOD).filter(k => !FOOD[k].good);
function drawFood(id, x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0);
  if (id === 'apple') {
    ctx.fillStyle = '#e8332b'; ctx.beginPath(); ctx.arc(-s * 0.28, s * 0.05, s * 0.55, 0, 7); ctx.arc(s * 0.28, s * 0.05, s * 0.55, 0, 7); ctx.fill();
    ctx.fillStyle = '#ff6b5e'; ctx.beginPath(); ctx.ellipse(-s * 0.4, -s * 0.15, s * 0.14, s * 0.24, -0.4, 0, 7); ctx.fill();
    ctx.strokeStyle = '#6b4220'; ctx.lineWidth = s * 0.09; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, -s * 0.4); ctx.quadraticCurveTo(s * 0.05, -s * 0.65, s * 0.12, -s * 0.75); ctx.stroke();
    ctx.fillStyle = '#4cbf3c'; ctx.beginPath(); ctx.ellipse(s * 0.3, -s * 0.62, s * 0.24, s * 0.12, -0.5, 0, 7); ctx.fill();
  } else if (id === 'carrot') {
    ctx.rotate(0.5);
    ctx.fillStyle = '#4cbf3c'; for (const a of [-0.5, 0, 0.5]) { ctx.save(); ctx.translate(0, -s * 0.55); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(0, -s * 0.25, s * 0.1, s * 0.3, 0, 0, 7); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = '#ff8a1f'; ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.55); ctx.quadraticCurveTo(0, -s * 0.7, s * 0.3, -s * 0.55); ctx.lineTo(s * 0.04, s * 0.9); ctx.quadraticCurveTo(0, s * 0.95, -s * 0.04, s * 0.9); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#d96a0c'; ctx.lineWidth = s * 0.04; ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) { const yy = -s * 0.3 + i * s * 0.28, w = s * 0.22 * (1 - i * 0.22); ctx.beginPath(); ctx.moveTo(-w, yy); ctx.lineTo(-w * 0.2, yy + s * 0.03); ctx.stroke(); }
  } else if (id === 'cheese') {
    ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.moveTo(-s * 0.8, s * 0.45); ctx.lineTo(s * 0.8, s * 0.45); ctx.lineTo(s * 0.8, -s * 0.1); ctx.lineTo(-s * 0.8, s * 0.05); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffe58a'; ctx.beginPath(); ctx.moveTo(-s * 0.8, s * 0.05); ctx.lineTo(s * 0.8, -s * 0.1); ctx.lineTo(s * 0.3, -s * 0.5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e6b400'; for (const [a, b, r] of [[-0.4, 0.25, 0.12], [0.3, 0.2, 0.09], [0.55, 0.32, 0.06], [-0.05, 0.33, 0.06]]) { ctx.beginPath(); ctx.arc(a * s, b * s, r * s, 0, 7); ctx.fill(); }
  } else if (id === 'lolly') {
    ctx.fillStyle = '#e8c9a0'; rr(-s * 0.06, 0, s * 0.12, s * 0.95, s * 0.05); ctx.fill();
    ctx.fillStyle = '#ff5fa2'; ctx.beginPath(); ctx.arc(0, -s * 0.15, s * 0.6, 0, 7); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = s * 0.11; ctx.beginPath();
    for (let i = 0; i < 60; i++) { const a = i * 0.32, r = s * 0.55 * i / 60; i ? ctx.lineTo(Math.cos(a) * r, -s * 0.15 + Math.sin(a) * r) : ctx.moveTo(0, -s * 0.15); } ctx.stroke();
  } else if (id === 'choco') {
    ctx.rotate(-0.2);
    ctx.fillStyle = '#6b3a1e'; rr(-s * 0.5, -s * 0.8, s, s * 1.2, s * 0.08); ctx.fill();
    ctx.strokeStyle = '#4a2410'; ctx.lineWidth = s * 0.04;
    ctx.beginPath(); ctx.moveTo(0, -s * 0.8); ctx.lineTo(0, s * 0.4); ctx.stroke();
    for (let j = 1; j < 3; j++) { ctx.beginPath(); ctx.moveTo(-s * 0.5, -s * 0.8 + j * s * 0.4); ctx.lineTo(s * 0.5, -s * 0.8 + j * s * 0.4); ctx.stroke(); }
    ctx.fillStyle = '#e8332b'; rr(-s * 0.55, -s * 0.05, s * 1.1, s * 0.9, s * 0.08); ctx.fill();
    ctx.fillStyle = '#ffd23f'; starPath(0, s * 0.4, s * 0.2, s * 0.09, 5); ctx.fill();
  } else if (id === 'soda') {
    ctx.fillStyle = '#ff4d6d'; rr(-s * 0.38, -s * 0.6, s * 0.76, s * 1.4, s * 0.12); ctx.fill();
    ctx.fillStyle = '#c9ced6'; rr(-s * 0.34, -s * 0.72, s * 0.68, s * 0.16, s * 0.06); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(0, s * 0.1, s * 0.26, s * 0.34, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#ff4d6d'; starPath(0, s * 0.1, s * 0.18, s * 0.08, 5); ctx.fill();
    ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = s * 0.08; ctx.beginPath(); ctx.moveTo(s * 0.1, -s * 0.66); ctx.lineTo(s * 0.25, -s * 1.0); ctx.stroke();
  } else if (id === 'cucumber') {
    ctx.rotate(-0.5); ctx.fillStyle = '#3f9a3f'; rr(-s * 0.95, -s * 0.28, s * 1.9, s * 0.56, s * 0.28); ctx.fill();
    ctx.fillStyle = '#6cc04c'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-s * 0.6 + i * s * 0.3, -s * 0.05 + (i % 2) * s * 0.12, s * 0.05, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#c8f0a0'; ctx.beginPath(); ctx.ellipse(s * 0.95, 0, s * 0.12, s * 0.27, 0, 0, 7); ctx.fill();
  } else if (id === 'milk') {
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#9bb8cc'; ctx.lineWidth = s * 0.05;
    ctx.beginPath(); ctx.moveTo(-s * 0.45, -s * 0.35); ctx.lineTo(0, -s * 0.75); ctx.lineTo(s * 0.45, -s * 0.35); ctx.lineTo(s * 0.45, s * 0.85); ctx.lineTo(-s * 0.45, s * 0.85); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3fa9f5'; ctx.fillRect(-s * 0.45, s * 0.05, s * 0.9, s * 0.4); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(0, s * 0.25, s * 0.22, s * 0.13, 0, 0, 7); ctx.fill();
  } else if (id === 'broccoli') {
    ctx.fillStyle = '#9bd36a'; rr(-s * 0.16, 0, s * 0.32, s * 0.85, s * 0.12); ctx.fill();
    ctx.fillStyle = '#3f9a3f'; for (const [a, b, r] of [[-0.42, -0.2, 0.36], [0.42, -0.2, 0.36], [0, -0.45, 0.42], [-0.18, 0.05, 0.3], [0.2, 0.05, 0.3]]) { ctx.beginPath(); ctx.arc(a * s, b * s, r * s, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#4fae46'; for (const [a, b] of [[-0.3, -0.35], [0.15, -0.6], [0.4, -0.15]]) { ctx.beginPath(); ctx.arc(a * s, b * s, s * 0.1, 0, 7); ctx.fill(); }
  } else if (id === 'pear') {
    ctx.fillStyle = '#c9d94a'; ctx.beginPath(); ctx.arc(0, s * 0.3, s * 0.55, 0, 7); ctx.arc(0, -s * 0.25, s * 0.33, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(-s * 0.25, s * 0.15, s * 0.1, s * 0.22, -0.3, 0, 7); ctx.fill();
    ctx.strokeStyle = '#6b4220'; ctx.lineWidth = s * 0.08; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, -s * 0.55); ctx.lineTo(s * 0.08, -s * 0.8); ctx.stroke();
    ctx.fillStyle = '#4cbf3c'; ctx.beginPath(); ctx.ellipse(s * 0.25, -s * 0.72, s * 0.2, s * 0.1, -0.4, 0, 7); ctx.fill();
  } else if (id === 'yogurt') {
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#9bb8cc'; ctx.lineWidth = s * 0.05;
    ctx.beginPath(); ctx.moveTo(-s * 0.55, -s * 0.4); ctx.lineTo(s * 0.55, -s * 0.4); ctx.lineTo(s * 0.42, s * 0.75); ctx.lineTo(-s * 0.42, s * 0.75); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c8d3dc'; rr(-s * 0.62, -s * 0.55, s * 1.24, s * 0.18, s * 0.06); ctx.fill();
    ctx.fillStyle = '#4cd964'; ctx.beginPath(); ctx.arc(0, s * 0.18, s * 0.22, 0, 7); ctx.fill();
  } else if (id === 'donut') {
    ctx.fillStyle = '#e0a96a'; ctx.beginPath(); ctx.arc(0, 0, s * 0.75, 0, 7); ctx.arc(0, 0, s * 0.24, 0, 7); ctx.fill('evenodd');
    ctx.fillStyle = '#ff8fc7'; ctx.beginPath(); for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI * 2, r = s * (0.66 + 0.06 * Math.sin(i * 2.3)); i ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.arc(0, 0, s * 0.3, 0, 7); ctx.fill('evenodd');
    for (let i = 0; i < 10; i++) { const a = i * 0.63; ctx.fillStyle = CONF[i % 6]; ctx.save(); ctx.translate(Math.cos(a) * s * 0.46, Math.sin(a) * s * 0.46); ctx.rotate(a * 2); ctx.fillRect(-s * 0.07, -s * 0.02, s * 0.14, s * 0.04); ctx.restore(); }
  } else if (id === 'gummy') {
    for (const [dx, c] of [[-0.35, '#ff4d6d'], [0.35, '#4cd964']]) { ctx.fillStyle = c; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(dx * s, -s * 0.35, s * 0.25, 0, 7); ctx.arc(dx * s - s * 0.18, -s * 0.55, s * 0.1, 0, 7); ctx.arc(dx * s + s * 0.18, -s * 0.55, s * 0.1, 0, 7); ctx.ellipse(dx * s, s * 0.2, s * 0.3, s * 0.42, 0, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1;
  } else if (id === 'icecream') {
    ctx.fillStyle = '#e8b06a'; ctx.beginPath(); ctx.moveTo(-s * 0.4, 0); ctx.lineTo(s * 0.4, 0); ctx.lineTo(0, s * 0.95); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#c98a4a'; ctx.lineWidth = s * 0.04; for (const k of [-0.2, 0.1]) { ctx.beginPath(); ctx.moveTo(k * s - s * 0.2, 0); ctx.lineTo(k * s + s * 0.25, s * 0.5); ctx.stroke(); }
    ctx.fillStyle = '#ff8fc7'; ctx.beginPath(); ctx.arc(-s * 0.2, -s * 0.15, s * 0.32, 0, 7); ctx.fill(); ctx.fillStyle = '#fff3c4'; ctx.beginPath(); ctx.arc(s * 0.2, -s * 0.2, s * 0.32, 0, 7); ctx.fill();
    ctx.fillStyle = '#6b3a1e'; ctx.beginPath(); ctx.arc(0, -s * 0.48, s * 0.3, 0, 7); ctx.fill(); ctx.fillStyle = '#e8332b'; ctx.beginPath(); ctx.arc(s * 0.05, -s * 0.8, s * 0.12, 0, 7); ctx.fill();
  } else if (id === 'cake') {
    ctx.fillStyle = '#f7d9a8'; ctx.beginPath(); ctx.moveTo(-s * 0.75, s * 0.5); ctx.lineTo(s * 0.75, s * 0.5); ctx.lineTo(s * 0.75, -s * 0.15); ctx.lineTo(-s * 0.75, s * 0.0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ff8fc7'; ctx.beginPath(); ctx.moveTo(-s * 0.8, 0); ctx.lineTo(s * 0.8, -s * 0.18); ctx.lineTo(s * 0.2, -s * 0.55); ctx.closePath(); ctx.fill();
    ctx.fillRect(-s * 0.75, s * 0.12, s * 1.5, s * 0.1);
    ctx.fillStyle = '#e8332b'; ctx.beginPath(); ctx.arc(s * 0.2, -s * 0.62, s * 0.14, 0, 7); ctx.fill();
  }
  ctx.restore();
}

// ===== Kartáček, pasta, hrneček, ruka =====
// kartáčky na výběr
const BRUSHES = [
  { handle: '#3d9bff', grip: '#ff6fa8', stripe: '#ffd23f', head: '#2f86e8', deco: 'star' },
  { handle: '#4cd964', grip: '#2fa84f', stripe: '#ffd23f', head: '#2fa84f', deco: 'dino' },
  { handle: '#ff8fc7', grip: '#b06cff', stripe: '#ffffff', head: '#ff5fa2', deco: 'crown' },
  { handle: '#ff9f1a', grip: '#e8332b', stripe: '#ffffff', head: '#e8332b', deco: 'rocket' }
];
// bod (0,0) = střed štětin; kartáček míří rukojetí doprava (úhel ang)
function drawBrush(x, y, ang, sc, paste, style) {
  const B = BRUSHES[style == null ? (Save.brush || 0) : style] || BRUSHES[0];
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(sc, sc); ctx.translate(28, 34);
  ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 6;
  ctx.fillStyle = B.handle; rr(10, -15, 330, 30, 15); ctx.fill();
  ctx.shadowColor = 'transparent';
  if (B.deco === 'dino') { ctx.fillStyle = B.grip; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(60 + i * 40, -14); ctx.lineTo(78 + i * 40, -36); ctx.lineTo(96 + i * 40, -14); ctx.fill(); } }
  ctx.fillStyle = B.grip; rr(190, -19, 140, 38, 19); ctx.fill();
  ctx.fillStyle = B.stripe; for (let i = 0; i < 3; i++) { rr(210 + i * 38, -19, 14, 38, 6); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,255,255,.35)'; rr(20, -10, 300, 7, 3); ctx.fill();
  if (B.deco === 'star') { ctx.fillStyle = '#ffd23f'; starPath(350, 0, 30, 13, 5); ctx.fill(); }
  if (B.deco === 'crown') drawCrown(352, 14, 54);
  if (B.deco === 'rocket') { ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.moveTo(340, -16); ctx.lineTo(380 + Math.sin(T * 25) * 6, 0); ctx.lineTo(340, 16); ctx.fill(); }
  ctx.fillStyle = B.head; rr(-78, -15, 104, 30, 12); ctx.fill();
  for (let i = 0; i < 12; i++) { ctx.fillStyle = i % 2 ? '#a5e6ff' : '#ffffff'; rr(-74 + i * 8.2, -54, 7, 42, 3); ctx.fill(); }
  if (paste > 0) {
    const L = 92 * Math.min(1, paste), hgt = 1 + Math.max(0, paste - 1) * 0.4;
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(-76, -52);
    for (let i = 0; i <= 12; i++) ctx.lineTo(-76 + i * L / 12, -60 - (Math.sin(i * 1.3) * 6 + 8) * hgt);
    ctx.lineTo(-76 + L, -52); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#3fc1c9'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i <= 11; i++) { const px = -72 + i * (L - 8) / 11, py = -64 - Math.sin(i * 1.3) * 5 * hgt; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
    ctx.strokeStyle = '#ff6fa8'; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= 11; i++) { const px = -70 + i * (L - 10) / 11, py = -57 - Math.sin(i * 1.3 + 1) * 3; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
  }
  ctx.restore();
}
// tuba: (0,0) = střed těla, hubička vpravo na (150, 0) v lokálních souřadnicích
function drawCap(x, y, sc, ang, spin) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang || 0); ctx.scale(sc, sc);
  ctx.fillStyle = '#ff6fa8'; rr(-26, -24, 52, 48, 10); ctx.fill();
  ctx.save(); rr(-26, -24, 52, 48, 10); ctx.clip(); ctx.fillStyle = '#e04f8c';
  const off = ((spin || 0) * 40) % 10; for (let k = -40; k < 40; k += 10) ctx.fillRect(-26, k + off, 52, 4);
  ctx.restore(); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(-20, -20, 8, 40);
  ctx.restore();
}
// cap: 'on' | 'off'; capSpin: otáčení víčka (rad), capOut: 0..1 vysunutí
function drawTube(x, y, sc, squeeze, rot, cap, capSpin, capOut) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(sc, sc);
  const sq = 1 - squeeze * 0.35;
  ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.moveTo(-150, -60 * sq); ctx.lineTo(70, -48 * sq); ctx.quadraticCurveTo(95, -40 * sq, 100, -20); ctx.lineTo(100, 20); ctx.quadraticCurveTo(95, 40 * sq, 70, 48 * sq); ctx.lineTo(-150, 60 * sq); ctx.closePath(); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#3fc1c9'; ctx.fillRect(-160, -64 * sq, 22, 128 * sq);
  ctx.fillStyle = '#2aa6ae'; for (let i = 0; i < 4; i++) ctx.fillRect(-158, -60 * sq + i * 32 * sq, 18, 6);
  ctx.fillStyle = '#3fc1c9'; rr(-120, -36 * sq, 160, 72 * sq, 20 * sq); ctx.fill();
  ctx.fillStyle = '#fff'; starPath(-40, 0, 26 * sq, 11 * sq, 5); ctx.fill();
  ctx.fillStyle = '#ff6fa8'; ctx.beginPath(); ctx.arc(-90, -8 * sq, 9 * sq, 0, 7); ctx.arc(10, 10 * sq, 7 * sq, 0, 7); ctx.fill();
  ctx.fillStyle = '#e0e6ec'; rr(98, -16, 52, 32, 8); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(104, -12, 8, 24);
  if (cap === 'on') drawCap(128 + (capOut || 0) * 30, 0, 1, 0, capSpin);
  ctx.restore();
}
function drawCup(x, y, sc, tilt, water) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.scale(sc, sc);
  ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
  ctx.strokeStyle = '#ff9f1a'; ctx.lineWidth = 18; ctx.beginPath(); ctx.ellipse(78, 0, 36, 46, 0, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  ctx.fillStyle = '#ffb347'; ctx.beginPath(); ctx.moveTo(-75, -90); ctx.lineTo(75, -90); ctx.lineTo(60, 90); ctx.quadraticCurveTo(0, 104, -60, 90); ctx.closePath(); ctx.fill();
  ctx.shadowColor = 'transparent';
  if (water > 0) { ctx.save(); ctx.beginPath(); ctx.moveTo(-70, -78); ctx.lineTo(70, -78); ctx.lineTo(60, 88); ctx.lineTo(-60, 88); ctx.closePath(); ctx.clip(); ctx.fillStyle = '#7fd6ff'; ctx.fillRect(-80, 88 - 160 * water, 160, 200); ctx.restore(); }
  ctx.fillStyle = '#ffe08a'; ctx.beginPath(); ctx.ellipse(0, -90, 75, 14, 0, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.4)'; rr(-58, -70, 16, 140, 8); ctx.fill();
  ctx.fillStyle = '#fff'; heartPath(10, 10, 26); ctx.fill();
  ctx.restore();
}
function drawHand(x, y, t, sc, dir) {
  sc = sc || 1;
  const k = (t * 1.4) % 1;
  ctx.strokeStyle = 'rgba(255,255,255,' + (1 - k) + ')'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, 20 + k * 50, 0, 7); ctx.stroke();
  let bx = Math.sin(t * 6) * 12 * 0.5, by = Math.sin(t * 6) * 12;
  if (dir) { const m = Math.sin(t * 3) * 90; bx = dir.x * m; by = dir.y * m; }
  ctx.save(); ctx.translate(x + 6 + bx, y + 6 + by); ctx.scale(sc, sc); ctx.rotate(-0.45);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#333'; ctx.lineWidth = 5; ctx.lineJoin = 'round';
  rr(-32, 52, 84, 78, 28); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 3; i++) { rr(-2 + i * 18, 44, 20, 34, 10); ctx.fill(); ctx.stroke(); }
  rr(-14, 0, 28, 82, 14); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.fillRect(-11, 60, 22, 28);
  ctx.restore();
}
function drawUpDown(x, y, t, s) {
  s = s || 1; const k = Math.sin(t * 8) * 10 * s;
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#ffd23f'; ctx.strokeStyle = '#c98a00'; ctx.lineWidth = 3; ctx.lineJoin = 'round';
  for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, d * (46 * s + k)); ctx.lineTo(-20 * s, d * (22 * s + k)); ctx.lineTo(-8 * s, d * (22 * s + k)); ctx.lineTo(-8 * s, d * (6 * s)); ctx.lineTo(8 * s, d * (6 * s)); ctx.lineTo(8 * s, d * (22 * s + k)); ctx.lineTo(20 * s, d * (22 * s + k)); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  ctx.restore();
}
function drawToothChar(x, y, s, t, still) {
  ctx.save(); ctx.translate(x, y + (still ? 0 : Math.sin(t * 2.5) * 6)); if (!still) ctx.rotate(Math.sin(t * 1.7) * 0.06);
  ctx.shadowColor = 'rgba(0,0,0,.18)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.moveTo(-s * 0.9, -s * 0.3);
  ctx.bezierCurveTo(-s * 1.0, -s * 1.05, -s * 0.2, -s * 1.05, 0, -s * 0.75);
  ctx.bezierCurveTo(s * 0.2, -s * 1.05, s * 1.0, -s * 1.05, s * 0.9, -s * 0.3);
  ctx.bezierCurveTo(s * 0.85, s * 0.3, s * 0.65, s * 1.0, s * 0.45, s * 1.0);
  ctx.bezierCurveTo(s * 0.25, s * 1.0, s * 0.2, s * 0.4, 0, s * 0.4);
  ctx.bezierCurveTo(-s * 0.2, s * 0.4, -s * 0.25, s * 1.0, -s * 0.45, s * 1.0);
  ctx.bezierCurveTo(-s * 0.65, s * 1.0, -s * 0.85, s * 0.3, -s * 0.9, -s * 0.3);
  ctx.closePath(); ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.strokeStyle = '#b9d9ea'; ctx.lineWidth = s * 0.05; ctx.stroke();
  cuteFace(0, -s * 0.25, s * 0.55);
  ctx.restore();
}

// ===== Bacil =====
const GERMC = [['#8be15a', '#4f9a2c'], ['#b88cff', '#7c4fd0'], ['#5fd0ff', '#2a8fc0'], ['#ffb347', '#cf7a1c'], ['#ff7aa8', '#c94a78']];
function drawGerm(x, y, r, c, ph, sq, scared, angry) {
  ctx.save(); ctx.translate(x, y);
  const s = 1 + sq * 0.45; ctx.scale(s, 1 / s);
  ctx.strokeStyle = c[1]; ctx.lineWidth = 3 * r / 25; ctx.lineCap = 'round';
  for (const k of [-1, 1]) { const ax = k * r * 0.65 + Math.sin(T * 5 + ph) * 3; ctx.beginPath(); ctx.moveTo(k * r * 0.3, -r * 0.8); ctx.quadraticCurveTo(k * r * 0.5, -r * 1.3, ax, -r * 1.35); ctx.stroke(); ctx.fillStyle = c[1]; ctx.beginPath(); ctx.arc(ax, -r * 1.35, r * 0.13, 0, 7); ctx.fill(); }
  ctx.beginPath();
  for (let i = 0; i <= 28; i++) { const a = i / 28 * Math.PI * 2, rr2 = r * (1 + 0.1 * Math.sin(a * 7 + T * 6 + ph)); i ? ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2) : ctx.moveTo(Math.cos(a) * rr2, Math.sin(a) * rr2); }
  ctx.closePath(); ctx.fillStyle = c[0]; ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-r * 0.35, -r * 0.15, r * 0.3, 0, 7); ctx.arc(r * 0.35, -r * 0.15, r * 0.3, 0, 7); ctx.fill();
  ctx.fillStyle = '#222';
  const lx = Math.sin(T * 2 + ph) * r * 0.08;
  ctx.beginPath(); ctx.arc(-r * 0.35 + lx, -r * 0.12, r * 0.14, 0, 7); ctx.arc(r * 0.35 + lx, -r * 0.12, r * 0.14, 0, 7); ctx.fill();
  ctx.strokeStyle = '#222'; ctx.lineWidth = 3 * r / 25;
  if (angry) { ctx.beginPath(); ctx.moveTo(-r * 0.6, -r * 0.55); ctx.lineTo(-r * 0.15, -r * 0.4); ctx.moveTo(r * 0.6, -r * 0.55); ctx.lineTo(r * 0.15, -r * 0.4); ctx.stroke(); }
  if (scared) { ctx.beginPath(); ctx.ellipse(0, r * 0.4, r * 0.18, r * 0.22, 0, 0, 7); ctx.fillStyle = '#222'; ctx.fill(); }
  else { ctx.beginPath(); ctx.arc(0, r * 0.2, r * 0.32, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.fillRect(-r * 0.12, r * 0.47, r * 0.1, r * 0.1); }
  ctx.restore();
}

// ultrabacil: zlatá zubatá záře, slábne s každým zásahem
function drawUltraAura(x, y, r, hp) {
  const k = clamp(hp / 7, 0.2, 1), R = r * (1.55 + Math.sin(T * 6) * 0.08);
  ctx.save(); ctx.translate(x, y); ctx.rotate(T * 1.5);
  ctx.fillStyle = 'rgba(255,210,63,' + (0.45 * k) + ')'; ctx.beginPath();
  for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, q = i % 2 ? R : R * 0.78; i ? ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q) : ctx.moveTo(Math.cos(a) * q, Math.sin(a) * q); }
  ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#ff4d6d'; for (let i = 0; i < Math.ceil(hp / 2); i++) { heartPath(x - 22 + i * 15, y - r - 26, 6); ctx.fill(); }
}

// ===== Tlačítka =====
function drawBtn(b) {
  const p = b.pulse ? 1 + Math.sin(T * 5) * 0.06 : 1, sc = b.sc == null ? 1 : b.sc;
  ctx.save(); ctx.translate(b.x, b.y); ctx.scale(p * sc, p * sc);
  ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
  ctx.fillStyle = b.color; ctx.beginPath(); ctx.arc(0, 0, b.r, 0, 7); ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.lineWidth = b.r * 0.08; ctx.strokeStyle = '#fff'; ctx.stroke();
  drawIcon(b.icon, b.r * 0.55, b.color);
  if (b.label) { ctx.fillStyle = '#2a5a6a'; ctx.font = 'bold ' + Math.round(b.r * 0.4) + 'px Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(b.label, 0, b.r + 34); }
  ctx.restore();
}
function drawIcon(name, s, col) {
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  switch (name) {
    case 'home': case 'map':
      if (name === 'map') {
        ctx.beginPath(); ctx.moveTo(-s, -s * 0.6); ctx.lineTo(-s * 0.35, -s * 0.8); ctx.lineTo(s * 0.35, -s * 0.6); ctx.lineTo(s, -s * 0.8); ctx.lineTo(s, s * 0.6); ctx.lineTo(s * 0.35, s * 0.8); ctx.lineTo(-s * 0.35, s * 0.6); ctx.lineTo(-s, s * 0.8); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = col; ctx.lineWidth = s * 0.1; ctx.setLineDash([s * 0.15, s * 0.12]); ctx.beginPath(); ctx.moveTo(-s * 0.7, s * 0.4); ctx.quadraticCurveTo(-s * 0.1, -s * 0.5, s * 0.5, -s * 0.2); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#ff4d6d'; ctx.beginPath(); ctx.arc(s * 0.55, -s * 0.25, s * 0.16, 0, 7); ctx.fill();
        break;
      }
      ctx.beginPath(); ctx.moveTo(-s * 1.0, -s * 0.05); ctx.lineTo(0, -s * 0.95); ctx.lineTo(s * 1.0, -s * 0.05); ctx.closePath(); ctx.fill();
      ctx.fillRect(-s * 0.7, -s * 0.15, s * 1.4, s * 1.0);
      ctx.fillStyle = col; rr(-s * 0.2, s * 0.3, s * 0.4, s * 0.56, s * 0.08); ctx.fill(); break;
    case 'again': {
      ctx.lineWidth = s * 0.28; const e = Math.PI * 1.45; ctx.beginPath(); ctx.arc(0, 0, s * 0.68, -Math.PI * 0.35, e); ctx.stroke();
      const px = Math.cos(e) * s * 0.68, py = Math.sin(e) * s * 0.68, tx = -Math.sin(e), ty = Math.cos(e), nx = Math.cos(e), ny = Math.sin(e);
      ctx.beginPath(); ctx.moveTo(px + tx * s * 0.45, py + ty * s * 0.45); ctx.lineTo(px + nx * s * 0.38, py + ny * s * 0.38); ctx.lineTo(px - nx * s * 0.38, py - ny * s * 0.38); ctx.closePath(); ctx.fill(); break;
    }
    case 'next': case 'prev':
      ctx.save(); if (name === 'prev') ctx.scale(-1, 1);
      ctx.beginPath(); ctx.moveTo(-s * 0.75, -s * 0.25); ctx.lineTo(s * 0.05, -s * 0.25); ctx.lineTo(s * 0.05, -s * 0.72); ctx.lineTo(s * 0.88, 0);
      ctx.lineTo(s * 0.05, s * 0.72); ctx.lineTo(s * 0.05, s * 0.25); ctx.lineTo(-s * 0.75, s * 0.25); ctx.closePath(); ctx.fill(); ctx.restore(); break;
    case 'skip':
      for (const dx of [-0.45, 0.3]) { ctx.beginPath(); ctx.moveTo(dx * s - s * 0.35, -s * 0.6); ctx.lineTo(dx * s + s * 0.4, 0); ctx.lineTo(dx * s - s * 0.35, s * 0.6); ctx.closePath(); ctx.fill(); } break;
    case 'book':
      rr(-s * 0.95, -s * 0.7, s * 0.92, s * 1.4, s * 0.12); ctx.fill(); rr(s * 0.03, -s * 0.7, s * 0.92, s * 1.4, s * 0.12); ctx.fill();
      ctx.fillStyle = '#ffcc00'; starPath(-s * 0.48, 0, s * 0.32, s * 0.14, 5); ctx.fill();
      ctx.fillStyle = '#ff4d6d'; heartPath(s * 0.5, -s * 0.05, s * 0.3); ctx.fill(); break;
    case 'together':
      ctx.lineWidth = s * 0.16; ctx.beginPath(); ctx.arc(-s * 0.15, -s * 0.12, s * 0.62, 0, 7); ctx.stroke();
      ctx.lineWidth = s * 0.13; ctx.beginPath(); ctx.moveTo(-s * 0.15, -s * 0.12); ctx.lineTo(-s * 0.15, -s * 0.5); ctx.moveTo(-s * 0.15, -s * 0.12); ctx.lineTo(s * 0.15, -s * 0.02); ctx.stroke();
      ctx.save(); ctx.translate(s * 0.5, s * 0.55); ctx.rotate(-0.7); rr(-s * 0.08, -s * 0.05, s * 0.75, s * 0.16, s * 0.08); ctx.fill(); rr(-s * 0.42, -s * 0.12, s * 0.36, s * 0.2, s * 0.05); ctx.fill();
      for (let i = 0; i < 4; i++) ctx.fillRect(-s * 0.4 + i * s * 0.09, -s * 0.3, s * 0.05, s * 0.18); ctx.restore(); break;
    case 'hourglass':
      ctx.fillRect(-s * 0.6, -s * 0.9, s * 1.2, s * 0.16); ctx.fillRect(-s * 0.6, s * 0.74, s * 1.2, s * 0.16);
      ctx.beginPath(); ctx.moveTo(-s * 0.45, -s * 0.74); ctx.lineTo(s * 0.45, -s * 0.74); ctx.lineTo(s * 0.08, 0); ctx.lineTo(s * 0.45, s * 0.74); ctx.lineTo(-s * 0.45, s * 0.74); ctx.lineTo(-s * 0.08, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.moveTo(-s * 0.3, s * 0.7); ctx.lineTo(s * 0.3, s * 0.7); ctx.lineTo(0, s * 0.3); ctx.closePath(); ctx.fill(); break;
    case 'games': // tři barevné hrací kostičky
      for (const [dx, dy, c] of [[-0.45, 0.3, '#ffd23f'], [0.45, 0.3, '#4cd964'], [0, -0.45, '#5fd0ff']]) { ctx.fillStyle = '#fff'; rr(dx * s - s * 0.38, dy * s - s * 0.38, s * 0.76, s * 0.76, s * 0.14); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(dx * s, dy * s, s * 0.14, 0, 7); ctx.fill(); }
      break;
    case 'music':
      ctx.beginPath(); ctx.ellipse(-s * 0.35, s * 0.5, s * 0.3, s * 0.22, -0.3, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(s * 0.45, s * 0.35, s * 0.3, s * 0.22, -0.3, 0, 7); ctx.fill();
      ctx.lineWidth = s * 0.14; ctx.beginPath(); ctx.moveTo(-s * 0.08, s * 0.48); ctx.lineTo(-s * 0.08, -s * 0.6); ctx.lineTo(s * 0.72, -s * 0.78); ctx.lineTo(s * 0.72, s * 0.33); ctx.stroke();
      if (!Save.music) { ctx.strokeStyle = '#ff4d4d'; ctx.lineWidth = s * 0.2; ctx.beginPath(); ctx.moveTo(-s * 0.9, -s * 0.9); ctx.lineTo(s * 0.9, s * 0.9); ctx.stroke(); }
      break;
  }
}
function hitBtn(btns, x, y) { for (const b of btns) if (!b.hidden && (b.sc == null || b.sc > 0.5) && dist(x, y, b.x, b.y) < b.r + 18) return b; return null; }

// ===== Pozadí koupelny =====
const BGB = Array.from({ length: 14 }, () => ({ x: rnd(0, VW), y: rnd(0, VH), r: rnd(10, 30), s: rnd(15, 40) }));
function bgBath(tint) {
  const f = full(); ctx.fillStyle = tint || '#bfe9f5'; ctx.fillRect(f.x, f.y, f.w, f.h);
  ctx.strokeStyle = 'rgba(255,255,255,.65)'; ctx.lineWidth = 4; ctx.beginPath();
  for (let x = Math.floor(f.x / 90) * 90; x < f.x + f.w; x += 90) { ctx.moveTo(x, f.y); ctx.lineTo(x, f.y + f.h); }
  for (let y = Math.floor(f.y / 90) * 90; y < f.y + f.h; y += 90) { ctx.moveTo(f.x, y); ctx.lineTo(f.x + f.w, y); }
  ctx.stroke();
  ctx.fillStyle = 'rgba(80,160,190,.35)'; ctx.fillRect(f.x, 650, f.w, f.y + f.h - 650);
  for (const b of BGB) { const y = ((b.y - T * b.s) % (VH + 80) + VH + 80) % (VH + 80) - 40; ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(b.x + Math.sin(T + b.r) * 10, y, b.r, 0, 7); ctx.stroke(); }
}
function cloud(x, y, s) { ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.beginPath(); ctx.arc(x, y, 40 * s, 0, 7); ctx.arc(x + 45 * s, y - 20 * s, 50 * s, 0, 7); ctx.arc(x + 95 * s, y, 42 * s, 0, 7); ctx.arc(x + 45 * s, y + 15 * s, 40 * s, 0, 7); ctx.fill(); }
function starBadge(x, y, n) {
  ctx.fillStyle = 'rgba(255,255,255,.88)'; rr(x, y, 190, 76, 38); ctx.fill();
  ctx.fillStyle = '#ffcc00'; starPath(x + 40, y + 38, 28, 13, 5); ctx.fill(); ctx.strokeStyle = '#e69500'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = '#5a3a10'; ctx.font = 'bold 46px Arial, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(String(n), x + 80, y + 40);
}

function drawBin(x, y, open) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#8fa3b5'; ctx.beginPath(); ctx.moveTo(-48, -40); ctx.lineTo(48, -40); ctx.lineTo(38, 60); ctx.lineTo(-38, 60); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#6f8396'; ctx.lineWidth = 5; for (const dx of [-18, 0, 18]) { ctx.beginPath(); ctx.moveTo(dx, -28); ctx.lineTo(dx * 0.85, 50); ctx.stroke(); }
  ctx.save(); ctx.translate(-54, -44); ctx.rotate(open ? -0.6 : 0); ctx.fillStyle = '#a8bccc'; rr(0, -12, 108, 14, 6); ctx.fill(); rr(40, -22, 28, 12, 5); ctx.fill(); ctx.restore();
  ctx.restore();
}
