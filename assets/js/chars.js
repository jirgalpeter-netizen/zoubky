'use strict';
// ===== Postavy (pořadí = pořadí na mapě) =====
const CHARS = [
  { id: 'bobr', name: 'Bobík', voc: 'Bobíku', fur: '#8a5530', fur2: '#5e3519', muz: '#dcb88f', inner: '#5a3219', nose: '#2b1a10', ear: 'small', teeth: 'beaver', food: 'wood', whisk: true, tuft: true,
    story: 'Bobr Bobík celý den hryzal dřevo. Má plné zoubky třísek!' },
  { id: 'kocka', name: 'Micka', voc: 'Micko', fur: '#f5a442', fur2: '#c97420', muz: '#fff4e2', inner: '#ffb3c1', nose: '#ff7f9f', ear: 'cat', teeth: 'cat', food: 'fish', whisk: true, stripes: true, lashes: true,
    story: 'Kočička Micka spapala rybičku. Teď ji v zoubcích lechtají kůstky.' },
  { id: 'medved', name: 'Míša', voc: 'Míšo', fur: '#bb7d3f', fur2: '#8a5526', muz: '#f3d6ad', inner: '#f3d6ad', nose: '#2a1c14', ear: 'big', teeth: 'bear', food: 'honey',
    story: 'Medvídek Míša mlsal med. Zoubky má celé ulepené!' },
  { id: 'pes', name: 'Ťapka', voc: 'Ťapko', fur: '#f3e6cc', fur2: '#b8875a', muz: '#fffaf0', inner: '#b8875a', nose: '#2a1c14', ear: 'dog', teeth: 'bear', food: 'kibble', spot: true, lashes: true,
    story: 'Pejsek Ťapka chroupal granule. Mezi zoubky mu zůstaly drobečky!' },
  { id: 'kun', name: 'Koník Hopík', voc: 'Hopíku', fur: '#c58a52', fur2: '#8d5a2b', muz: '#f2d2ae', inner: '#f2d2ae', nose: '#6b3a1e', ear: 'horse', teeth: 'human', food: 'hay', horse: true, mane: '#5e3a1e', blaze: true,
    story: 'Koník Hopík spásal seno na louce. Stébla má i mezi zuby!' },
  { id: 'zajic', name: 'Ušák', voc: 'Ušáku', fur: '#dcd6d0', fur2: '#9e958c', muz: '#ffffff', inner: '#ffb3c1', nose: '#ff8fa8', ear: 'bunny', teeth: 'beaver', food: 'carrot', whisk: true,
    story: 'Zajíček Ušák chroupal mrkev. Zoubky má samou oranžovou!' },
  { id: 'holka', name: 'Klárka', voc: 'Klárko', human: true, skin: '#ffd9c2', hair: '#8a4b22', hairStyle: 'pigtails', bow: '#ff5fa2', teeth: 'human', food: 'choco', lashes: true,
    story: 'Klárka snědla velkou čokoládu. Zoubky má celé hnědé. Pomůžeš jí?' },
  { id: 'karkulka', name: 'Karkulka', voc: 'Karkulko', human: true, skin: '#ffdcc8', hair: '#a0522d', hairStyle: 'short', hood: '#e8332b', teeth: 'human', food: 'jam', lashes: true,
    story: 'Červená Karkulka ochutnala koláče z košíčku pro babičku. Má zoubky samou marmeládu!' },
  { id: 'vlk', name: 'Vlk', voc: 'Vlku', fur: '#8e959e', fur2: '#5d636b', muz: '#d5d9de', inner: '#5d636b', nose: '#1d1f22', ear: 'cat', teeth: 'bear', food: 'meat', whisk: true, wolf: true,
    story: 'Vlk z lesa je mlsný a nečistí si zuby. Dneska to změníme!' },
  { id: 'lev', name: 'Leo', voc: 'Leo', fur: '#f2b54a', fur2: '#c98420', muz: '#fff0d0', inner: '#c98420', nose: '#6b3a1e', ear: 'small', teeth: 'bear', food: 'meat', whisk: true, mane: '#c0601a',
    story: 'Lvíček Leo měl k obědu masíčko. Teď ho má i v zoubcích!' },
  { id: 'hroch', name: 'Hugo', voc: 'Hugo', fur: '#a495c4', fur2: '#6e6390', muz: '#c9bfe0', inner: '#e6a0b0', nose: '#5b5078', ear: 'small', teeth: 'hippo', food: 'melon', hippo: true,
    story: 'Hrošík Hugo spořádal celý meloun. Má v puse samá semínka!' },
  { id: 'opice', name: 'Žofka', voc: 'Žofko', fur: '#8b5a3c', fur2: '#5e3a22', muz: '#f2c9a0', inner: '#f2c9a0', nose: '#4a2e1c', ear: 'monkey', teeth: 'human', food: 'banana', monkey: true, lashes: true,
    story: 'Opička Žofka snědla banány. Zoubky má celé upatlané!' },
  { id: 'marenka', name: 'Mařenka', voc: 'Mařenko', human: true, skin: '#ffe0cc', hair: '#e8b34a', hairStyle: 'braids', bow: '#e8332b', teeth: 'human', food: 'ginger', lashes: true,
    story: 'Mařenka uždibovala z perníkové chaloupky. Zoubky má plné perníku!' },
  { id: 'jenicek', name: 'Jeníček', voc: 'Jeníčku', human: true, skin: '#ffdcc4', hair: '#e8b34a', hairStyle: 'short', cap: '#3fa9f5', teeth: 'human', food: 'ginger',
    story: 'Jeníček taky mlsal perníček. Pomoz mu vyčistit zoubky!' },
  { id: 'kluk', name: 'Tomík', voc: 'Tomíku', human: true, skin: '#f6cfb2', hair: '#4a3020', hairStyle: 'short', teeth: 'human', food: 'cake',
    story: 'Tomík měl narozeniny a snědl dort. Teď má zoubky samý krém!' },
  { id: 'kocour', name: 'Kocour v botách', voc: 'Kocoure', fur: '#b9b0a6', fur2: '#7d746a', muz: '#fff6ea', inner: '#ffb3c1', nose: '#ff8fa8', ear: 'cat', teeth: 'cat', food: 'meat', whisk: true, stripes: true, musketeer: true,
    story: 'Kocour v botách hodoval na zámku. Zoubky má ale celé špinavé!' },
  { id: 'panenka', name: 'Panenka Bella', voc: 'Bello', human: true, skin: '#ffe6d8', hair: '#ffd86b', hairStyle: 'long', tiara: true, teeth: 'human', food: 'candy', lashes: true, lips: '#ff5fa2',
    story: 'Panenka Bella snědla na plese spoustu bonbonů. Zoubky má samý cukr!' },
  { id: 'krokodyl', name: 'Kroko', voc: 'Kroko', fur: '#5cb85c', fur2: '#3d8b3d', muz: '#a8e08a', inner: '#3d8b3d', nose: '#2d6b2d', ear: 'none', teeth: 'croc', food: 'mud', croc: true,
    story: 'Krokodýl Kroko se koupal v bahně. Má ho i na zubech!' },
  { id: 'ufon', name: 'Mimozemšťan Blik', voc: 'Bliku', fur: '#7be07b', fur2: '#3fae5a', muz: '#c8f5b0', inner: '#3fae5a', nose: '#2f8a46', ear: 'none', teeth: 'croc', food: 'slime', alien: true,
    story: 'Mimozemšťan Blik přiletěl z vesmíru. Nikdy si nečistil zuby a má v nich zelený sliz!' },
  { id: 'drak', name: 'Dráček', voc: 'Dráčku', fur: '#9b7be0', fur2: '#6a4fb8', muz: '#e0d6ff', inner: '#ffd23f', nose: '#4a3590', ear: 'none', teeth: 'bear', food: 'berry', dragon: true,
    story: 'Dráček z hradu mlsal borůvky. V zoubcích se mu schoval velký bacil!' }
];
// hráč (avatar) – vybírá se na začátku
const AVATARS = [
  { id: 'a1', g: 'f', human: true, skin: '#ffe0cc', hair: '#f2c35a', hairStyle: 'long', bow: '#b06cff', teeth: 'human', lashes: true },
  { id: 'a2', g: 'f', human: true, skin: '#f6cfb2', hair: '#6b3a1e', hairStyle: 'pigtails', bow: '#4cd964', teeth: 'human', lashes: true },
  { id: 'a3', g: 'f', human: true, skin: '#ffd9c2', hair: '#c0501e', hairStyle: 'braids', bow: '#3fa9f5', teeth: 'human', lashes: true },
  { id: 'a4', g: 'm', human: true, skin: '#ffdcc4', hair: '#f2c35a', hairStyle: 'short', teeth: 'human' },
  { id: 'a5', g: 'm', human: true, skin: '#f6cfb2', hair: '#3b2a1e', hairStyle: 'short', cap: '#e8332b', teeth: 'human' },
  { id: 'a6', g: 'm', human: true, skin: '#e9b896', hair: '#1e1a18', hairStyle: 'short', teeth: 'human' }
];
const CHAR_BY = {}; CHARS.forEach((c, i) => { c.idx = i; CHAR_BY[c.id] = c; });

function blinkVal(seed) { const p = (T + seed * 1.37) % 4.2; return p > 4.02 ? Math.sin((p - 4.02) / 0.18 * Math.PI) : 0; }

function drawBackLayer(c, cx, cy, R) {
  ctx.lineJoin = 'round';
  if (c.mane && !c.horse) {
    ctx.fillStyle = c.mane; ctx.beginPath();
    for (let i = 0; i <= 32; i++) { const a = i / 32 * Math.PI * 2, r = R * (i % 2 ? 1.18 : 1.36); i ? ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.95) : ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.95); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c.mane, 0.15); ctx.beginPath(); ctx.ellipse(cx, cy, R * 1.12, R * 1.05, 0, 0, 7); ctx.fill();
  }
  if (c.human) {
    if (c.hood) { ctx.fillStyle = c.hood; ctx.beginPath(); ctx.ellipse(cx, cy - R * 0.08, R * 1.25, R * 1.2, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx - R * 1.1, cy + R * 0.4); ctx.quadraticCurveTo(cx, cy + R * 1.35, cx + R * 1.1, cy + R * 0.4); ctx.fill(); ctx.fillStyle = darken(c.hood, 0.25); ctx.beginPath(); ctx.ellipse(cx, cy - R * 0.02, R * 1.06, R * 1.04, 0, 0, 7); ctx.fill(); }
    ctx.fillStyle = c.hair;
    if (c.hairStyle === 'braids') for (const s of [-1, 1]) { for (let k = 0; k < 5; k++) { ctx.fillStyle = k % 2 ? darken(c.hair, 0.12) : c.hair; ctx.beginPath(); ctx.ellipse(cx + s * R * (0.88 + k * 0.02), cy + R * (0.05 + k * 0.24), R * 0.17, R * 0.15, 0, 0, 7); ctx.fill(); } ctx.fillStyle = c.bow || '#e8332b'; ctx.beginPath(); ctx.arc(cx + s * R * 0.98, cy + R * 1.2, R * 0.09, 0, 7); ctx.fill(); }
    ctx.fillStyle = c.hair;
    if (c.hairStyle === 'long') { rr(cx - R * 1.05, cy - R * 0.7, R * 2.1, R * 1.65, R * 0.5); ctx.fill(); }
    if (c.hairStyle === 'pigtails') for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + s * R * 1.08, cy + R * 0.05, R * 0.25, R * 0.45, s * 0.3, 0, 7); ctx.fill(); }
    ctx.fillStyle = c.skin; for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(cx + s * R * 0.92, cy + R * 0.02, R * 0.14, 0, 7); ctx.fill(); }
    return;
  }
  if (c.alien) for (const s of [-1, 1]) {
    ctx.strokeStyle = c.fur2; ctx.lineWidth = R * 0.05; ctx.lineCap = 'round';
    const tx = cx + s * R * (0.55 + Math.sin(T * 3 + s) * 0.04), ty = cy - R * 1.38;
    ctx.beginPath(); ctx.moveTo(cx + s * R * 0.28, cy - R * 0.8); ctx.quadraticCurveTo(cx + s * R * 0.3, cy - R * 1.2, tx, ty); ctx.stroke();
    ctx.fillStyle = Math.sin(T * 4 + s) > 0 ? '#ffd23f' : '#ff8fc7'; ctx.beginPath(); ctx.arc(tx, ty, R * 0.11, 0, 7); ctx.fill();
  }
  if (c.dragon) {
    ctx.fillStyle = '#ffd23f'; ctx.strokeStyle = '#d9a400'; ctx.lineWidth = R * 0.02;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx + s * R * 0.35, cy - R * 0.78); ctx.quadraticCurveTo(cx + s * R * 0.62, cy - R * 1.1, cx + s * R * 0.58, cy - R * 1.32); ctx.quadraticCurveTo(cx + s * R * 0.42, cy - R * 1.05, cx + s * R * 0.18, cy - R * 0.86); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    ctx.fillStyle = '#4cd9a0'; for (const dx of [-0.12, 0.12]) { ctx.beginPath(); ctx.moveTo(cx + dx * R - R * 0.09, cy - R * 0.88); ctx.lineTo(cx + dx * R, cy - R * 1.1); ctx.lineTo(cx + dx * R + R * 0.09, cy - R * 0.88); ctx.fill(); }
    for (const s of [-1, 1]) { ctx.fillStyle = c.fur2; ctx.beginPath(); ctx.moveTo(cx + s * R * 0.8, cy - R * 0.3); ctx.lineTo(cx + s * R * 1.22, cy - R * 0.55); ctx.lineTo(cx + s * R * 0.95, cy - R * 0.05); ctx.fill(); }
  }
  for (const s of [-1, 1]) {
    ctx.strokeStyle = c.fur2; ctx.lineWidth = R * 0.03;
    if (c.ear === 'cat') {
      ctx.fillStyle = c.fur;
      ctx.beginPath(); ctx.moveTo(cx + s * R * 0.18, cy - R * 0.78); ctx.lineTo(cx + s * R * 0.8, cy - R * 1.15); ctx.lineTo(cx + s * R * 0.88, cy - R * 0.38); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = c.inner; ctx.beginPath(); ctx.moveTo(cx + s * R * 0.36, cy - R * 0.74); ctx.lineTo(cx + s * R * 0.75, cy - R * 0.99); ctx.lineTo(cx + s * R * 0.79, cy - R * 0.53); ctx.closePath(); ctx.fill();
    } else if (c.ear === 'horse') {
      ctx.save(); ctx.translate(cx + s * R * 0.45, cy - R * 0.92); ctx.rotate(s * 0.4);
      ctx.fillStyle = c.fur; ctx.beginPath(); ctx.ellipse(0, 0, R * 0.15, R * 0.32, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = c.inner; ctx.beginPath(); ctx.ellipse(0, R * 0.04, R * 0.07, R * 0.2, 0, 0, 7); ctx.fill(); ctx.restore();
    } else if (c.ear === 'bunny') {
      ctx.save(); ctx.translate(cx + s * R * 0.34, cy - R * 1.2); ctx.rotate(s * 0.18 + Math.sin(T * 2 + s) * 0.05);
      ctx.fillStyle = c.fur; ctx.beginPath(); ctx.ellipse(0, 0, R * 0.19, R * 0.6, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = c.inner; ctx.beginPath(); ctx.ellipse(0, R * 0.05, R * 0.09, R * 0.45, 0, 0, 7); ctx.fill(); ctx.restore();
    } else if (c.ear === 'small' || c.ear === 'big') {
      const big = c.ear === 'big', er = big ? R * 0.3 : R * 0.17, ex = cx + s * R * (big ? 0.68 : 0.7), ey = cy - R * 0.7;
      ctx.fillStyle = c.fur; ctx.beginPath(); ctx.arc(ex, ey, er, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = c.inner; ctx.beginPath(); ctx.arc(ex + s * er * 0.05, ey + er * 0.08, er * 0.55, 0, 7); ctx.fill();
    } else if (c.ear === 'monkey') {
      ctx.fillStyle = c.fur; ctx.beginPath(); ctx.arc(cx + s * R * 0.95, cy - R * 0.05, R * 0.26, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = c.inner; ctx.beginPath(); ctx.arc(cx + s * R * 0.97, cy - R * 0.05, R * 0.16, 0, 7); ctx.fill();
    }
  }
}
function drawFrontLayer(c, cx, cy, R, open) {
  if (c.horse) { ctx.fillStyle = c.mane; for (const [dx, dy, r] of [[-0.12, -0.86, 0.16], [0.08, -0.9, 0.17], [0.0, -0.74, 0.12], [-0.25, -0.76, 0.12], [0.22, -0.78, 0.11]]) { ctx.beginPath(); ctx.ellipse(cx + dx * R, cy + dy * R, r * R, r * R * 0.8, dx * 3, 0, 7); ctx.fill(); } }
  if (c.musketeer) {
    ctx.fillStyle = '#ff4d4d'; ctx.beginPath(); ctx.moveTo(cx + R * 0.2, cy - R * 0.95); ctx.quadraticCurveTo(cx + R * 0.9, cy - R * 1.55, cx + R * 1.15, cy - R * 1.0); ctx.quadraticCurveTo(cx + R * 0.8, cy - R * 1.2, cx + R * 0.25, cy - R * 0.85); ctx.fill();
    ctx.fillStyle = '#6b3a1e'; rr(cx - R * 0.45, cy - R * 1.22, R * 0.9, R * 0.45, R * 0.18); ctx.fill();
    ctx.fillStyle = '#ffd23f'; ctx.fillRect(cx - R * 0.45, cy - R * 0.92, R * 0.9, R * 0.08);
    ctx.fillStyle = '#5a2f15'; ctx.beginPath(); ctx.ellipse(cx, cy - R * 0.8, R * 1.05, R * 0.2, -0.08, 0, 7); ctx.fill();
  }
  if (c.tiara) drawCrown(cx, cy - R * 0.86, R * 0.58);
  if (c.cap) {
    ctx.fillStyle = c.cap; ctx.beginPath(); ctx.ellipse(cx, cy - R * 0.55, R * 0.97, R * 0.5, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = darken(c.cap, 0.2); ctx.beginPath(); ctx.ellipse(cx + R * 0.45, cy - R * 0.55, R * 0.55, R * 0.12, 0.05, 0, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx, cy - R * 1.02, R * 0.08, 0, 7); ctx.fill();
  }
  if (c.ear === 'dog') for (const s of [-1, 1]) {
    ctx.save(); ctx.translate(cx + s * R * 0.82, cy - R * 0.35); ctx.rotate(s * (0.35 + Math.sin(T * 2.5 + s) * 0.05));
    ctx.fillStyle = c.fur2; ctx.beginPath(); ctx.ellipse(0, R * 0.3, R * 0.22, R * 0.48, 0, 0, 7); ctx.fill(); ctx.restore();
  }
  if (c.human) {
    ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, R * 0.96, R * 0.96, 0, 0, 7); ctx.clip();
    ctx.fillStyle = c.hair; ctx.beginPath();
    ctx.moveTo(cx - R * 1.1, cy - R * 0.05); ctx.lineTo(cx - R * 1.1, cy - R * 1.2); ctx.lineTo(cx + R * 1.1, cy - R * 1.2); ctx.lineTo(cx + R * 1.1, cy - R * 0.05);
    ctx.lineTo(cx + R * 0.88, cy - R * 0.05);
    const n = 5, y0 = cy - R * (open ? 0.7 : 0.5);
    for (let i = 0; i < n; i++) { const x1 = cx + R * 0.88 - (i + 1) * R * 1.76 / n, xm = (x1 + cx + R * 0.88 - i * R * 1.76 / n) / 2; ctx.quadraticCurveTo(xm, y0 + R * (i % 2 ? 0.16 : 0.1) + (i === 0 || i === n - 1 ? R * 0.35 : 0), x1, y0 + (i === n - 1 ? R * 0.45 : 0)); }
    ctx.lineTo(cx - R * 1.1, cy - R * 0.05); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.ellipse(cx - R * 0.35, cy - R * 0.8, R * 0.3, R * 0.08, -0.3, 0, 7); ctx.fill();
    ctx.restore();
    if (c.hairStyle === 'short') { ctx.fillStyle = c.hair; for (const [dx, h] of [[-0.25, 0.2], [0, 0.26], [0.22, 0.2]]) { ctx.beginPath(); ctx.moveTo(cx + (dx - 0.14) * R, cy - R * 0.9); ctx.lineTo(cx + dx * R, cy - R * (0.92 + h)); ctx.lineTo(cx + (dx + 0.14) * R, cy - R * 0.9); ctx.fill(); } }
    if (c.bow) for (const s of (c.hairStyle === 'pigtails' ? [-1, 1] : [1])) {
      const bx = cx + s * R * (c.hairStyle === 'pigtails' ? 0.88 : 0.55), by = cy - R * (c.hairStyle === 'pigtails' ? 0.42 : 0.85);
      ctx.fillStyle = c.bow; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - R * 0.18, by - R * 0.12); ctx.lineTo(bx - R * 0.18, by + R * 0.12); ctx.closePath(); ctx.moveTo(bx, by); ctx.lineTo(bx + R * 0.18, by - R * 0.12); ctx.lineTo(bx + R * 0.18, by + R * 0.12); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(bx, by, R * 0.06, 0, 7); ctx.fill();
    }
  }
}
function drawEyes(c, cx, ey, R, st) {
  for (const s of [-1, 1]) {
    const ex = cx + s * R * (c.croc ? 0.33 : 0.36);
    if (st.happy) {
      ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = R * 0.05; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(ex, ey + R * 0.05, R * 0.11, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      continue;
    }
    const bl = st.blink || 0, h = Math.max(1, R * 0.16 * (1 - bl * 0.92));
    if (c.alien) {
      ctx.fillStyle = '#1b1b2a'; ctx.beginPath(); ctx.ellipse(ex, ey, R * 0.17, Math.max(1, R * 0.23 * (1 - bl * 0.92)), s * -0.35, 0, 7); ctx.fill();
      if (bl < 0.6) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(ex - R * 0.05, ey - R * 0.08, R * 0.05, R * 0.07, -0.4, 0, 7); ctx.fill(); ctx.fillStyle = '#7fd6ff'; ctx.beginPath(); ctx.arc(ex + R * 0.05, ey + R * 0.07, R * 0.025, 0, 7); ctx.fill(); }
      continue;
    }
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(ex, ey, R * 0.14, h, 0, 0, 7); ctx.fill();
    ctx.lineWidth = R * 0.018; ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.stroke();
    if (bl < 0.6) {
      const px = ex + (st.lookX || 0) * R * 0.045, py = ey + (st.lookY || 0) * R * 0.05;
      ctx.save(); ctx.beginPath(); ctx.ellipse(ex, ey, R * 0.14, h, 0, 0, 7); ctx.clip();
      ctx.fillStyle = c.croc ? '#3a6b1a' : c.human ? '#3b6ea8' : '#2a1a10'; ctx.beginPath(); ctx.arc(px, py, R * 0.095, 0, 7); ctx.fill();
      if (c.human || c.croc) { ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(px, py, R * 0.05, 0, 7); ctx.fill(); }
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px + R * 0.03, py - R * 0.035, R * 0.032, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(px - R * 0.03, py + R * 0.03, R * 0.014, 0, 7); ctx.fill();
      ctx.restore();
    }
    if (c.lashes && bl < 0.5) {
      ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = R * 0.022; ctx.lineCap = 'round';
      for (let k = 0; k < 3; k++) { const a = -Math.PI / 2 + s * (0.55 + k * 0.28); ctx.beginPath(); ctx.moveTo(ex + Math.cos(a) * R * 0.14, ey + Math.sin(a) * h); ctx.lineTo(ex + Math.cos(a) * R * 0.21, ey + Math.sin(a) * h - R * 0.06); ctx.stroke(); }
    }
    if (st.sad || c.human || c.wolf) {
      ctx.strokeStyle = c.human ? darken(c.hair, 0.1) : darken(c.fur2, 0.2); ctx.lineWidth = R * 0.04; ctx.lineCap = 'round';
      ctx.beginPath();
      if (st.sad) { ctx.moveTo(ex - s * R * 0.12, ey - R * 0.3); ctx.lineTo(ex + s * R * 0.12, ey - R * 0.21); }
      else { ctx.arc(ex, ey - R * 0.08, R * 0.16, Math.PI * 1.25, Math.PI * 1.75); }
      ctx.stroke();
    }
  }
}
function drawNose(c, cx, ny, R) {
  if (c.human) { ctx.fillStyle = darken(c.skin, 0.12); ctx.beginPath(); ctx.ellipse(cx, ny, R * 0.07, R * 0.05, 0, 0, 7); ctx.fill(); return; }
  if (c.hippo || c.croc || c.horse) { ctx.fillStyle = c.nose; for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + s * R * 0.14, ny, R * 0.05, R * 0.07, s * 0.3, 0, 7); ctx.fill(); } return; }
  ctx.fillStyle = c.nose; ctx.beginPath();
  if (c.id === 'kocka' || c.id === 'zajic') {
    const w = c.id === 'zajic' ? 0.07 : 0.09;
    ctx.moveTo(cx - R * w, ny - R * 0.04); ctx.quadraticCurveTo(cx, ny - R * 0.08, cx + R * w, ny - R * 0.04);
    ctx.quadraticCurveTo(cx + R * 0.02, ny + R * 0.06, cx, ny + R * 0.06); ctx.quadraticCurveTo(cx - R * 0.02, ny + R * 0.06, cx - R * w, ny - R * 0.04);
  } else { const w = c.id === 'medved' || c.id === 'pes' ? R * 0.16 : R * 0.14; ctx.ellipse(cx, ny, w, w * 0.66, 0, 0, 7); }
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.ellipse(cx - R * 0.04, ny - R * 0.03, R * 0.04, R * 0.022, -0.3, 0, 7); ctx.fill();
}
function drawWhiskers(cx, ny, R) {
  ctx.strokeStyle = 'rgba(70,45,30,.55)'; ctx.lineWidth = R * 0.012; ctx.lineCap = 'round';
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.moveTo(cx + s * R * 0.28, ny + R * (0.06 + i * 0.05));
    ctx.quadraticCurveTo(cx + s * R * 0.55, ny + R * (0.0 + i * 0.07), cx + s * R * 0.82, ny + R * (-0.04 + i * 0.1)); ctx.stroke();
  }
}

// ===== Zuby =====
const TEETH = {
  beaver: { up: [[1, .75], [1, .85], [1.75, 1.5, 'big'], [1.75, 1.5, 'big'], [1, .85], [1, .75]], lo: [[1, .7], [1, .8], [1.35, 1.05], [1.35, 1.05], [1, .8], [1, .7]] },
  bear: { up: [[1, .8], [1.1, 1.3, 'fang'], [1, .85], [1, .85], [1.1, 1.3, 'fang'], [1, .8]], lo: [[1, .75], [1.1, 1.15, 'fang'], [1, .8], [1, .8], [1.1, 1.15, 'fang'], [1, .75]] },
  cat: { up: [[1.15, 1.45, 'fang'], [.8, .7], [.8, .75], [.8, .75], [.8, .7], [1.15, 1.45, 'fang']], lo: [[1.1, 1.25, 'fang'], [.8, .65], [.8, .7], [.8, .7], [.8, .65], [1.1, 1.25, 'fang']] },
  human: { up: [[1, .8], [1, .88], [1.25, 1.02], [1.25, 1.02], [1, .88], [1, .8]], lo: [[1, .75], [1, .8], [1.1, .88], [1.1, .88], [1, .8], [1, .75]] },
  hippo: { up: [[1, .7], [1, .75], [1, .8], [1, .8], [1, .75], [1, .7]], lo: [[1, .7], [1.2, 1.55, 'fang'], [1, .75], [1, .75], [1.2, 1.55, 'fang'], [1, .7]] },
  croc: { up: [[1, .9, 'fang'], [1, 1.05, 'fang'], [1, .9, 'fang'], [1, 1.1, 'fang'], [1, 1.1, 'fang'], [1, .9, 'fang'], [1, 1.05, 'fang'], [1, .9, 'fang']], lo: [[1, .85, 'fang'], [1, 1, 'fang'], [1, .85, 'fang'], [1, 1, 'fang'], [1, 1, 'fang'], [1, .85, 'fang'], [1, 1, 'fang'], [1, .85, 'fang']] }
};
const FOODC = { hay: '#e6c24a', jam: '#d9203a', ginger: '#b8743a', candy: '#ff8fc7', slime: '#6bd14a', wood: '#a0682f', fish: '#e9a7a0', honey: '#f5b20c', kibble: '#9b6a3c', carrot: '#ff8a1f', choco: '#6b3a1e', meat: '#b5523b', melon: '#ff5a6e', banana: '#efd86a', cake: '#ffc6dc', mud: '#7a5a3a', berry: '#6a3fa0' };
function makeTeeth(type, food, dirt) {
  const out = [];
  for (const row of ['up', 'lo']) for (const d of TEETH[type][row]) {
    const up = row === 'up', spots = [], n = 2 + (Math.random() < 0.6 ? 1 : 0);
    for (let i = 0; i < n; i++) spots.push({ u: rnd(0.25, 0.75), v: up ? rnd(0.35, 0.8) : rnd(0.2, 0.65), r: rnd(7, 11), rot: rnd(0, 3.14), k: i / n, f: food });
    spots.push({ u: rnd(0.3, 0.7), v: up ? rnd(0.55, 0.85) : rnd(0.15, 0.45), r: rnd(10, 14), rot: 0, k: 0.5, f: 'plaque' });
    out.push({ upper: up, wr: d[0], hr: d[1], fang: d[2] === 'fang', big: d[2] === 'big', dirt: dirt, x: 0, y: 0, w: 0, h: 0, spots, clean: dirt < 0.05, tough: false });
  }
  return out;
}
function layoutTeeth(teeth, m, fullH) {
  const mg = m.w * 0.07, us = m.w - 2 * mg, base = fullH * 0.3;
  for (const row of [true, false]) {
    const ts = teeth.filter(t => t.upper === row), sum = ts.reduce((s, t) => s + t.wr, 0);
    let x = m.x + mg;
    for (const t of ts) { const w = us * t.wr / sum; t.w = w - 4; t.x = x + 2; x += w; t.h = base * t.hr; t.y = row ? m.y : m.y + m.h - t.h; }
  }
}
function toothPath(t) {
  const { x, y, w, h } = t, r = w * 0.35;
  ctx.beginPath();
  if (t.upper) {
    ctx.moveTo(x, y - 30); ctx.lineTo(x + w, y - 30);
    if (t.fang) { ctx.lineTo(x + w, y + h * 0.5); ctx.quadraticCurveTo(x + w * 0.62, y + h * 0.78, x + w * 0.5, y + h); ctx.quadraticCurveTo(x + w * 0.38, y + h * 0.78, x, y + h * 0.5); }
    else { ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); }
  } else {
    ctx.moveTo(x, y + h + 30); ctx.lineTo(x + w, y + h + 30);
    if (t.fang) { ctx.lineTo(x + w, y + h * 0.5); ctx.quadraticCurveTo(x + w * 0.62, y + h * 0.22, x + w * 0.5, y); ctx.quadraticCurveTo(x + w * 0.38, y + h * 0.22, x, y + h * 0.5); }
    else { ctx.lineTo(x + w, y + r); ctx.quadraticCurveTo(x + w, y, x + w - r, y); ctx.lineTo(x + r, y); ctx.quadraticCurveTo(x, y, x, y + r); }
  }
  ctx.closePath();
}
function blob(r, n, amp, seed) { ctx.beginPath(); for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, q = r * (1 + amp * Math.sin(a * 3 + seed) * Math.cos(a * 2 + seed * 2)); i ? ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q) : ctx.moveTo(Math.cos(a) * q, Math.sin(a) * q); } ctx.closePath(); }
function drawSpot(f, x, y, r, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  switch (f) {
    case 'wood': ctx.fillStyle = '#a0682f'; rr(-r * 1.5, -r * 0.38, r * 3, r * 0.76, r * 0.3); ctx.fill(); ctx.strokeStyle = '#6d4220'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r * 0.8, 0); ctx.stroke(); break;
    case 'honey': ctx.rotate(-rot); ctx.fillStyle = '#f5b20c'; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(r * 0.2, r * 1.0, r * 0.38, r * 0.7, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#ffe07a'; ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.3, r * 0.3, 0, 7); ctx.fill(); break;
    case 'fish': ctx.fillStyle = '#e9a7a0'; ctx.beginPath(); ctx.ellipse(0, 0, r * 1.1, r * 0.8, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-r * 0.8, -r * 0.1); ctx.lineTo(r * 0.8, -r * 0.1); for (let i = -1; i <= 1; i++) { ctx.moveTo(i * r * 0.4, -r * 0.5); ctx.lineTo(i * r * 0.4, r * 0.3); } ctx.stroke(); break;
    case 'kibble': ctx.fillStyle = '#9b6a3c'; rr(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6, r * 0.5); ctx.fill(); ctx.fillStyle = '#7a4f28'; ctx.beginPath(); ctx.arc(0, 0, r * 0.3, 0, 7); ctx.fill(); break;
    case 'carrot': ctx.fillStyle = '#ff8a1f'; ctx.beginPath(); ctx.moveTo(-r, -r * 0.5); ctx.lineTo(r, -r * 0.6); ctx.lineTo(r * 0.1, r * 0.9); ctx.closePath(); ctx.fill(); break;
    case 'choco': ctx.fillStyle = '#6b3a1e'; blob(r * 1.15, 18, 0.3, rot); ctx.fill(); ctx.fillStyle = '#8b5232'; ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.3, r * 0.3, 0, 7); ctx.fill(); break;
    case 'meat': ctx.fillStyle = '#b5523b'; blob(r, 16, 0.25, rot); ctx.fill(); ctx.strokeStyle = '#e08a76'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-r * 0.6, 0); ctx.lineTo(r * 0.6, -r * 0.2); ctx.stroke(); break;
    case 'melon': ctx.fillStyle = '#ff5a6e'; blob(r, 16, 0.2, rot); ctx.fill(); ctx.fillStyle = '#222'; ctx.beginPath(); ctx.ellipse(r * 0.1, 0, r * 0.22, r * 0.38, 0.4, 0, 7); ctx.fill(); break;
    case 'banana': ctx.fillStyle = '#efd86a'; blob(r * 1.1, 16, 0.3, rot); ctx.fill(); ctx.fillStyle = '#c9a83a'; ctx.beginPath(); ctx.arc(r * 0.3, r * 0.2, r * 0.18, 0, 7); ctx.fill(); break;
    case 'cake': ctx.fillStyle = '#fff6fa'; blob(r * 1.1, 16, 0.25, rot); ctx.fill(); ctx.fillStyle = '#ff8fc7'; ctx.beginPath(); ctx.arc(0, -r * 0.2, r * 0.55, 0, 7); ctx.fill(); for (let i = 0; i < 3; i++) { ctx.fillStyle = CONF[i]; ctx.fillRect(-r * 0.6 + i * r * 0.5, r * 0.3, r * 0.3, r * 0.12); } break;
    case 'mud': ctx.rotate(-rot); ctx.fillStyle = '#7a5a3a'; blob(r * 1.1, 16, 0.3, x); ctx.fill(); ctx.beginPath(); ctx.ellipse(-r * 0.2, r * 1.0, r * 0.3, r * 0.6, 0, 0, 7); ctx.fill(); break;
    case 'berry': ctx.fillStyle = '#6a3fa0'; for (const [a, b] of [[-0.45, 0.2], [0.45, 0.2], [0, -0.4]]) { ctx.beginPath(); ctx.arc(a * r, b * r, r * 0.55, 0, 7); ctx.fill(); } ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(-r * 0.1, -r * 0.55, r * 0.15, 0, 7); ctx.fill(); break;
    case 'hay': ctx.strokeStyle = '#e6c24a'; ctx.lineWidth = 3; ctx.lineCap = 'round'; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(-r * 1.3, i * r * 0.35); ctx.lineTo(r * 1.3, i * r * 0.35 + r * 0.2); ctx.stroke(); } break;
    case 'jam': ctx.rotate(-rot); ctx.fillStyle = '#d9203a'; blob(r, 16, 0.3, x); ctx.fill(); ctx.beginPath(); ctx.ellipse(r * 0.1, r * 0.9, r * 0.28, r * 0.55, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#ff7a8a'; ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.3, r * 0.22, 0, 7); ctx.fill(); break;
    case 'ginger': ctx.fillStyle = '#b8743a'; rr(-r, -r * 0.8, r * 2, r * 1.6, r * 0.4); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-r * 0.6, 0); ctx.quadraticCurveTo(0, -r * 0.5, r * 0.6, 0); ctx.stroke(); break;
    case 'candy': for (let i = 0; i < 4; i++) { ctx.fillStyle = CONF[i]; ctx.save(); ctx.rotate(i * 0.8); ctx.fillRect(-r * 0.15, -r, r * 0.3, r * 0.7); ctx.restore(); } ctx.fillStyle = '#ff8fc7'; ctx.beginPath(); ctx.arc(0, 0, r * 0.5, 0, 7); ctx.fill(); break;
    case 'slime': ctx.rotate(-rot); ctx.fillStyle = '#6bd14a'; blob(r * 1.1, 16, 0.3, x); ctx.fill(); ctx.beginPath(); ctx.ellipse(-r * 0.2, r * 1.0, r * 0.25, r * 0.6, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#b6f59a'; ctx.beginPath(); ctx.arc(r * 0.3, -r * 0.3, r * 0.22, 0, 7); ctx.fill(); break;
    case 'tartar': ctx.fillStyle = 'rgba(176,130,50,.85)'; blob(r * 1.2, 18, 0.25, rot); ctx.fill(); ctx.fillStyle = 'rgba(120,85,30,.8)'; ctx.beginPath(); ctx.arc(r * 0.2, r * 0.1, r * 0.4, 0, 7); ctx.fill(); break;
    default: ctx.fillStyle = 'rgba(196,196,92,.75)'; blob(r, 14, 0.2, rot); ctx.fill();
  }
  ctx.restore();
}
function drawTooth(t) {
  const d = t.dirt;
  toothPath(t);
  const dirty = t.tough ? '#c9a95a' : '#e6cf7c';
  const base = mix('#ffffff', dirty, Math.min(1, d * 0.9));
  const g = ctx.createLinearGradient(t.x, 0, t.x + t.w, 0);
  g.addColorStop(0, base); g.addColorStop(0.45, d < 0.3 ? '#ffffff' : base); g.addColorStop(1, mix('#dfe9f0', '#cdb46a', Math.min(1, d)));
  ctx.fillStyle = g; ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(140,110,100,.5)'; ctx.stroke();
  if (d < 0.5) { ctx.fillStyle = 'rgba(255,255,255,' + (0.8 * (1 - d * 2)) + ')'; rr(t.x + t.w * 0.18, t.y + (t.upper ? t.h * 0.12 : t.h * 0.35), t.w * 0.15, t.h * 0.45, t.w * 0.08); ctx.fill(); }
  if (d > 0.02) {
    ctx.save(); toothPath(t); ctx.clip();
    for (const s of t.spots) { const al = clamp(d * 1.6 - s.k * 0.6, 0, 1); if (al <= 0) continue; ctx.globalAlpha = al; drawSpot(s.f, t.x + s.u * t.w, t.y + s.v * t.h, s.r, s.rot); }
    if (t.tough) { ctx.globalAlpha = clamp(d * 1.3, 0, 1); drawSpot('tartar', t.x + t.w * 0.5, t.upper ? t.y + t.h * 0.25 : t.y + t.h * 0.75, Math.min(t.w * 0.38, 20), t.x); }
    ctx.restore();
  } else {
    const ph = (T * 0.9 + t.x * 0.013) % 3;
    if (ph < 0.5) { const k = Math.sin(ph / 0.5 * Math.PI); ctx.fillStyle = 'rgba(255,255,255,' + k + ')'; starPath(t.x + t.w * 0.72, t.y + (t.upper ? t.h * 0.3 : t.h * 0.6), 13 * k + 2, 3, 4); ctx.fill(); }
  }
}
function mouthPath(m) {
  const r = Math.min(m.h * 0.45, m.w * 0.2), rb = Math.min(m.h * 0.5, m.w * 0.28);
  ctx.beginPath(); ctx.moveTo(m.x + r, m.y); ctx.lineTo(m.x + m.w - r, m.y); ctx.quadraticCurveTo(m.x + m.w, m.y, m.x + m.w, m.y + r);
  ctx.lineTo(m.x + m.w, m.y + m.h - rb); ctx.quadraticCurveTo(m.x + m.w, m.y + m.h, m.x + m.w - rb, m.y + m.h);
  ctx.lineTo(m.x + rb, m.y + m.h); ctx.quadraticCurveTo(m.x, m.y + m.h, m.x, m.y + m.h - rb);
  ctx.lineTo(m.x, m.y + r); ctx.quadraticCurveTo(m.x, m.y, m.x + r, m.y); ctx.closePath();
}
function lipColor(c) { return c.lips || (c.human ? '#c9576a' : darken(c.fur2, 0.25)); }
function drawOpenMouth(c, m, teeth, inside) {
  mouthPath(m);
  const g = ctx.createLinearGradient(0, m.y, 0, m.y + m.h); g.addColorStop(0, '#4f0c18'); g.addColorStop(1, '#8a2536');
  ctx.fillStyle = g; ctx.fill();
  ctx.save(); mouthPath(m); ctx.clip();
  ctx.fillStyle = '#3a0811'; ctx.beginPath(); ctx.ellipse(m.x + m.w / 2, m.y + m.h * 0.5, m.w * 0.22, m.h * 0.25, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#ff8597'; ctx.beginPath(); ctx.ellipse(m.x + m.w / 2, m.y + m.h * 0.92, m.w * 0.34, m.h * 0.32, 0, 0, 7); ctx.fill();
  for (const t of teeth) drawTooth(t);
  if (inside) inside();
  ctx.restore();
  mouthPath(m); ctx.lineWidth = 10; ctx.strokeStyle = lipColor(c); ctx.lineJoin = 'round'; ctx.stroke();
}
function drawGrin(c, cx, y0, R) {
  const x0 = cx - R * 0.5, x1 = cx + R * 0.5;
  const path = () => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx, y0 + R * 0.12, x1, y0); ctx.quadraticCurveTo(cx, y0 + R * 0.78, x0, y0); ctx.closePath(); };
  path(); ctx.fillStyle = '#7a1f2b'; ctx.fill();
  ctx.save(); path(); ctx.clip();
  ctx.fillStyle = '#ff7f90'; ctx.beginPath(); ctx.ellipse(cx, y0 + R * 0.42, R * 0.25, R * 0.13, 0, 0, 7); ctx.fill();
  const n = c.teeth === 'croc' ? 10 : 8, w = (x1 - x0) / n;
  for (let i = 0; i < n; i++) {
    const big = c.teeth === 'beaver' && (i === 3 || i === 4), fang = (c.teeth === 'bear' || c.teeth === 'cat') && (i === 1 || i === 6);
    const h = R * (big ? 0.26 : fang ? 0.22 : 0.16);
    ctx.fillStyle = '#ffffff';
    if (c.teeth === 'croc') { ctx.beginPath(); ctx.moveTo(x0 + i * w + 1, y0 - R * 0.1); ctx.lineTo(x0 + (i + 1) * w - 1, y0 - R * 0.1); ctx.lineTo(x0 + (i + 0.5) * w, y0 + R * 0.16); ctx.closePath(); ctx.fill(); continue; }
    rr(x0 + i * w + 2, y0 - R * 0.1, w - 4, h + R * 0.1, w * 0.3); ctx.fill();
    ctx.strokeStyle = 'rgba(150,130,130,.5)'; ctx.lineWidth = 2; ctx.stroke();
  }
  ctx.restore();
  path(); ctx.lineWidth = R * 0.03; ctx.strokeStyle = lipColor(c); ctx.lineJoin = 'round'; ctx.stroke();
  const k = (T * 1.3) % 2;
  if (k < 0.6) { const s = Math.sin(k / 0.6 * Math.PI); ctx.fillStyle = 'rgba(255,255,255,' + s + ')'; starPath(cx + R * 0.25, y0 + R * 0.05, R * 0.09 * s + 2, R * 0.02, 4); ctx.fill(); }
}

/* st: mode closed|open|grin, mouth, teeth, inside, blink, lookX, lookY, happy, sad, chew, hat, dx, tongue(0..1), tongueDirt */
function drawChar(c, cx, cy, R, st) {
  st = st || {};
  ctx.save();
  if (st.dx) cx += st.dx;
  const open = st.mode === 'open';
  drawBackLayer(c, cx, cy, R);
  const rx = c.hippo ? R * 1.08 : c.human ? R * 0.96 : R, ry = c.human ? R * 0.96 : R * 0.92;
  const skin = c.human ? c.skin : c.fur;
  const hg = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.45, R * 0.1, cx, cy, R * 1.05);
  hg.addColorStop(0, lighten(skin, 0.28)); hg.addColorStop(1, skin);
  ctx.fillStyle = hg; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 7); ctx.fill();
  ctx.lineWidth = R * 0.025; ctx.strokeStyle = c.human ? darken(c.skin, 0.15) : c.fur2; ctx.stroke();
  if (c.stripes) {
    ctx.fillStyle = c.fur2;
    for (const dx of [-0.16, 0, 0.16]) { ctx.beginPath(); ctx.ellipse(cx + dx * R, cy - R * 0.78, R * 0.035, R * 0.12, dx * 1.2, 0, 7); ctx.fill(); }
    for (const s of [-1, 1]) for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.ellipse(cx + s * R * 0.9, cy + R * (0.0 + i * 0.16), R * 0.1, R * 0.03, 0, 0, 7); ctx.fill(); }
  }
  if (c.tuft) { ctx.fillStyle = c.fur2; ctx.beginPath(); ctx.ellipse(cx - R * 0.06, cy - R * 0.88, R * 0.1, R * 0.06, -0.5, 0, 7); ctx.ellipse(cx + R * 0.07, cy - R * 0.9, R * 0.09, R * 0.05, 0.6, 0, 7); ctx.fill(); }
  if (c.croc) { ctx.fillStyle = c.fur2; for (const [a, b] of [[-0.6, -0.1], [0.6, -0.15], [-0.45, 0.45], [0.5, 0.4], [0, -0.6], [-0.75, 0.25], [0.75, 0.2]]) { ctx.beginPath(); ctx.arc(cx + a * R, cy + b * R, R * 0.05, 0, 7); ctx.fill(); } }
  const eyeY = cy - (open ? (c.croc ? 0.55 : 0.45) : (c.croc ? 0.35 : 0.18)) * R, noseY = cy + (open ? -0.2 : 0.14) * R;
  if (c.croc) { ctx.fillStyle = c.fur; ctx.strokeStyle = c.fur2; ctx.lineWidth = R * 0.025; for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(cx + s * R * 0.33, eyeY - R * 0.02, R * 0.22, Math.PI, 0); ctx.fill(); ctx.stroke(); } }
  if (c.blaze) { ctx.fillStyle = '#fff6ea'; ctx.beginPath(); ctx.ellipse(cx, cy - R * 0.4, R * 0.1, R * 0.38, 0, 0, 7); ctx.fill(); }
  if (c.monkey) { ctx.fillStyle = c.muz; for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(cx + s * R * 0.3, eyeY + R * 0.02, R * 0.3, 0, 7); ctx.fill(); } }
  if (c.spot) { ctx.fillStyle = c.fur2; ctx.beginPath(); ctx.ellipse(cx + R * 0.38, eyeY, R * 0.24, R * 0.22, 0.3, 0, 7); ctx.fill(); }
  if (!c.human) {
    ctx.fillStyle = c.muz; ctx.beginPath();
    if (open) ctx.ellipse(cx, cy + R * 0.28, R * (c.hippo ? 0.95 : 0.86), R * 0.6, 0, 0, 7);
    else ctx.ellipse(cx, cy + R * 0.34, R * (c.hippo || c.horse ? 0.75 : c.wolf ? 0.62 : 0.56), R * (c.hippo || c.horse ? 0.5 : 0.42), 0, 0, 7);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,110,130,.33)';
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + s * R * 0.62, cy + (open ? -0.12 : 0.18) * R, R * 0.13, R * 0.085, 0, 0, 7); ctx.fill(); }
  drawEyes(c, cx, eyeY, R, st);
  if (open) {
    drawOpenMouth(c, st.mouth, st.teeth, st.inside);
    if (st.tongue > 0) drawTongueOut(c, cx, st.mouth, R, st.tongue, st.tongueDirt || 0, st.tongueSpots);
  } else if (st.mode === 'grin') drawGrin(c, cx, noseY + R * 0.14, R);
  else {
    const my = noseY + R * 0.13;
    ctx.strokeStyle = c.lips || (c.human ? '#a8485a' : '#3b2416'); ctx.lineWidth = R * 0.035; ctx.lineCap = 'round';
    if (st.chew) {
      const k = Math.abs(Math.sin(st.chew * 9));
      ctx.fillStyle = '#7a1f2b'; ctx.beginPath(); ctx.ellipse(cx, my + R * 0.12, R * 0.17, Math.max(1, R * 0.12 * k), 0, 0, 7); ctx.fill(); ctx.stroke();
    } else if (st.sad) {
      if (!c.human) { ctx.beginPath(); ctx.moveTo(cx, noseY + R * 0.06); ctx.lineTo(cx, my); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(cx, my + R * 0.2, R * 0.15, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
    } else if (c.human) {
      ctx.beginPath(); ctx.arc(cx, my - R * 0.02, R * 0.16, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    } else {
      if (c.teeth === 'beaver') { ctx.fillStyle = '#fff'; ctx.lineWidth = R * 0.02; rr(cx - R * 0.09, my, R * 0.085, R * 0.14, R * 0.02); ctx.fill(); ctx.stroke(); rr(cx + R * 0.005, my, R * 0.085, R * 0.14, R * 0.02); ctx.fill(); ctx.stroke(); ctx.lineWidth = R * 0.035; }
      if (c.croc) { ctx.fillStyle = '#fff'; for (const dx of [-0.3, -0.15, 0.15, 0.3]) { ctx.beginPath(); ctx.moveTo(cx + dx * R - R * 0.04, my + R * 0.02); ctx.lineTo(cx + dx * R + R * 0.04, my + R * 0.02); ctx.lineTo(cx + dx * R, my + R * 0.1); ctx.fill(); } }
      ctx.beginPath(); ctx.moveTo(cx, noseY + R * 0.06); ctx.lineTo(cx, my); ctx.stroke();
      const w = c.hippo || c.croc || c.horse ? 0.2 : 0.11;
      ctx.beginPath(); ctx.arc(cx - R * w, my, R * w, 0.15, Math.PI - 0.3); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + R * w, my, R * w, 0.3, Math.PI - 0.15); ctx.stroke();
    }
  }
  if (c.whisk) drawWhiskers(cx, noseY, R);
  drawNose(c, cx, noseY, R);
  drawFrontLayer(c, cx, cy, R, open);
  if (st.hat && !c.tiara) drawCrown(cx, cy - R * (c.ear === 'bunny' ? 0.95 : c.musketeer ? 1.2 : c.cap ? 1.0 : 0.82), R * 0.62);
  ctx.restore();
}
function tongueGeom(m, R, k) { return { x: m.x + m.w / 2, y: m.y + m.h + R * 0.1 * k, rx: R * 0.3, ry: R * 0.28 * k }; }
function drawTongueOut(c, cx, m, R, k, dirt, spots) {
  const g = tongueGeom(m, R, k);
  ctx.fillStyle = '#ff7f95'; ctx.beginPath(); ctx.ellipse(g.x, g.y, g.rx, Math.max(1, g.ry), 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#e0607a'; ctx.lineWidth = 5; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(g.x, g.y - g.ry * 0.6); ctx.lineTo(g.x, g.y + g.ry * 0.6); ctx.stroke();
  if (dirt > 0.02 && spots) {
    ctx.save(); ctx.beginPath(); ctx.ellipse(g.x, g.y, g.rx, Math.max(1, g.ry), 0, 0, 7); ctx.clip();
    for (const s of spots) { ctx.globalAlpha = clamp(dirt * 1.5 - s.k * 0.5, 0, 1); ctx.fillStyle = 'rgba(250,250,235,.95)'; ctx.save(); ctx.translate(g.x + s.u * g.rx, g.y + s.v * g.ry); blob(s.r, 14, 0.25, s.u * 9); ctx.fill(); ctx.restore(); }
    ctx.restore();
  }
}
