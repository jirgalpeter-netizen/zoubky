'use strict';
// ===== KNÍŽKA NA NÁLEPKY: odlepit – nalepit – přitlačit; stránku jde vytrhnout =====
const PAGE = { x: 150, y: 20, w: 1300, h: 540 };
const TRAY_Y = 648, BIN = { x: 1530, y: 470 };
// Převod z volného lepení (verze 2–3): co bylo v knížce, je teď nalepené na svém místě; nálepky už se nesčítají
if (!Save.placed) {
  Save.placed = {};
  for (const pg of (Save.book || [])) for (const st of (pg.st || [])) Save.placed[st.id] = true;
  for (const k of Object.keys(Save.inv)) Save.inv[k] = Save.inv[k] > 0 && !Save.placed[k] ? 1 : 0;
  Save.save();
}
// Každá nálepka má v knížce své místo
const ALBUM = (() => {
  const charPage = (cs, bg) => { const n0 = Math.ceil(cs.length / 2); return { bg, slots: cs.map((c, i) => { const row = i < n0 ? 0 : 1, k = row ? i - n0 : i, cnt = row ? cs.length - n0 : n0; return { id: 'c:' + c.id, x: 800 + (k - (cnt - 1) / 2) * 270, y: row ? 410 : 170 }; }) }; };
  return [
    { bg: 0, slots: [['sun', 1240, 120], ['rainbow', 420, 140], ['flower', 300, 430], ['butterfly', 790, 220], ['balloon', 1030, 300], ['strawberry', 620, 440]].map(([id, x, y]) => ({ id, x, y })) },
    { bg: 2, slots: [['rocket', 360, 190], ['star', 700, 130], ['crown', 1040, 170], ['heart', 500, 420], ['tooth', 840, 420], ['fish', 1190, 400]].map(([id, x, y]) => ({ id, x, y })) },
    charPage(CHARS.slice(0, 7), 4), charPage(CHARS.slice(7, 14), 3), charPage(CHARS.slice(14), 1)
  ];
})();
function slotOf(id) { for (let p = 0; p < ALBUM.length; p++) for (const s of ALBUM[p].slots) if (s.id === id) return { page: p, s }; return null; }
function drawPageBg(bg, x, y, w, h) {
  ctx.save(); rr(x, y, w, h, 30); ctx.clip();
  const lg = (a, b, c, d) => { const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, a); if (c) g.addColorStop(c, b), g.addColorStop(c + 0.01, d); g.addColorStop(1, c ? d : b); return g; };
  if (bg === 0) { ctx.fillStyle = lg('#8fd8ff', '#dff6ff'); ctx.fillRect(x, y, w, h); cloud(x + w * 0.15, y + 90, 0.9); cloud(x + w * 0.7, y + 70, 0.7); ctx.fillStyle = '#8fdc6a'; ctx.beginPath(); ctx.ellipse(x + w * 0.27, y + h + 60, w * 0.46, 260, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#7ccf5a'; ctx.beginPath(); ctx.ellipse(x + w * 0.8, y + h + 80, w * 0.42, 250, 0, 0, 7); ctx.fill(); }
  if (bg === 1) { ctx.fillStyle = lg('#bfeaff', '#bfeaff', 0.45, '#2f8fd8'); ctx.fillRect(x, y, w, h); ctx.fillStyle = '#f3dca0'; ctx.beginPath(); ctx.ellipse(x + w * 0.15, y + h + 40, w * 0.32, 120, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(x + w - 150, y + 90, 55, 0, 7); ctx.fill(); }
  if (bg === 2) { ctx.fillStyle = '#1b1f4a'; ctx.fillRect(x, y, w, h); for (let k = 0; k < 70; k++) { ctx.fillStyle = 'rgba(255,255,255,' + (0.5 + 0.5 * Math.sin(T * 2 + k)) + ')'; ctx.beginPath(); ctx.arc(x + prand(k) * w, y + prand(k + 99) * h, 2 + prand(k + 7) * 2, 0, 7); ctx.fill(); } ctx.fillStyle = '#ff9f1a'; ctx.beginPath(); ctx.arc(x + w - 200, y + 150, 80, 0, 7); ctx.fill(); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 12; ctx.beginPath(); ctx.ellipse(x + w - 200, y + 150, 130, 30, -0.3, 0, 7); ctx.stroke(); }
  if (bg === 3) { ctx.fillStyle = lg('#ffd6ea', '#fff3c4'); ctx.fillRect(x, y, w, h); ctx.fillStyle = 'rgba(255,176,204,.8)'; for (const dx of [-220, -80, 80, 220]) { rr(x + w / 2 + dx - 45, y + h - 330 + Math.abs(dx) * 0.3, 90, 400, 10); ctx.fill(); } rr(x + w / 2 - 260, y + h - 230, 520, 260, 10); ctx.fill(); }
  if (bg === 4) { ctx.fillStyle = lg('#c8f0c0', '#5fb84f'); ctx.fillRect(x, y, w, h); for (let k = 0; k < 7; k++) { const tx = x + 80 + k * w / 7, ty = y + h - 40; ctx.fillStyle = '#8a5a30'; ctx.fillRect(tx - 12, ty - 120, 24, 120); ctx.fillStyle = k % 2 ? '#3f9a3f' : '#4fae46'; ctx.beginPath(); ctx.arc(tx, ty - 160, 70, 0, 7); ctx.fill(); } }
  if (bg === 5) { ctx.fillStyle = lg('#5fd0ff', '#1d4fa8'); ctx.fillRect(x, y, w, h); for (let k = 0; k < 14; k++) { ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + prand(k + 3) * w, y + ((prand(k) * h - T * 30 * (1 + prand(k + 9))) % h + h) % h, 6 + prand(k + 5) * 12, 0, 7); ctx.stroke(); } ctx.fillStyle = '#f3dca0'; ctx.fillRect(x, y + h - 50, w, 50); for (let k = 0; k < 5; k++) { ctx.strokeStyle = '#2fa84f'; ctx.lineWidth = 10; ctx.beginPath(); const sx = x + 120 + k * 260; ctx.moveTo(sx, y + h - 40); ctx.quadraticCurveTo(sx + Math.sin(T + k) * 30, y + h - 140, sx, y + h - 220); ctx.stroke(); } }
  ctx.restore();
  ctx.lineWidth = 8; ctx.strokeStyle = '#ffffff'; rr(x, y, w, h, 30); ctx.stroke();
}
Scenes.album = {
  page: 0, scroll: 0,
  enter() {
    Music.on = true; this.drag = null; this.wob = {}; this.flip = null; this.shine = {}; this.pend = null; this.back = null;
    const ids = this.trayIds();
    if (ids.length) { const so = slotOf(ids[0]); if (so) this.page = so.page; }
    if (firstTimes('albumHello', 2)) say(ids.length || Object.keys(Save.placed).length ? P.albumHello : P.albumEmpty);
    this.btns = [
      { x: 70, y: 290, r: 50, color: '#ff9f1a', icon: 'prev', fn: () => this.turn(-1) },
      { x: 1530, y: 290, r: 50, color: '#ff9f1a', icon: 'next', fn: () => this.turn(1) },
      { x: 70, y: 70, r: 44, color: '#3fa9f5', icon: 'map', fn: () => { this.stickPend(); go('map'); } }
    ];
  },
  turn(d, to) { if (this.flip) return; this.stickPend(); this.flip = { t: 0, d, to }; Snd.sticker(); },
  stickPend() { if (this.pend) { Save.placed[this.pend.id] = true; Save.save(); this.pend = null; } },
  trayIds() { const ids = Object.keys(Save.inv).filter(k => Save.inv[k] > 0 && !Save.placed[k]); return ids.sort((a, b) => (a.startsWith('c:') ? 1 : 0) - (b.startsWith('c:') ? 1 : 0)); },
  trayPos(i) { return { x: 200 + i * 128 - this.scroll, y: TRAY_Y }; },
  maxScroll() { return Math.max(0, this.trayIds().length * 128 - 1250); },
  update(dt) {
    for (const k in this.wob) this.wob[k] = Math.max(0, this.wob[k] - dt);
    for (const k in this.shine) { this.shine[k] += dt; if (this.shine[k] > 1) delete this.shine[k]; }
    if (this.flip) { const f = this.flip, was = f.t; f.t += dt / 0.5; if (was < 0.5 && f.t >= 0.5) this.page = f.to != null ? f.to : (this.page + f.d + ALBUM.length) % ALBUM.length; if (f.t >= 1) this.flip = null; }
    if (this.back) { this.back.t += dt / 0.35; if (this.back.t >= 1) this.back = null; }
  },
  drawPage(x0) {
    const pg = ALBUM[this.page], { y, w, h } = PAGE, x = x0, dx = x - PAGE.x;
    drawPageBg(pg.bg, x, y, w, h);
    const d = this.drag, target = d && d.carry ? slotOf(d.id) : null;
    for (const sl of pg.slots) {
      const sx = sl.x + dx, sy = sl.y;
      if (Save.placed[sl.id]) {
        const w2 = this.wob[sl.id] || 0; drawSticker(sl.id, sx, sy, 74 * (1 + w2 * 0.25), Math.sin(T * 25) * 0.2 * w2);
        const sh = this.shine[sl.id]; if (sh != null) { ctx.save(); ctx.beginPath(); ctx.arc(sx, sy, 74, 0, 7); ctx.clip(); const gx = sx - 120 + sh * 240; const g = ctx.createLinearGradient(gx - 40, 0, gx + 40, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,.85)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(gx - 40, sy - 80, 80, 160); ctx.restore(); }
        continue;
      }
      if (this.pend && this.pend.id === sl.id) { // nalepená, ale ještě nepřitlačená
        const s = this.pend, lift = 1 - s.press;
        ctx.fillStyle = 'rgba(0,0,0,' + (0.25 * lift) + ')'; ctx.beginPath(); ctx.ellipse(sx + 14 * lift, sy + 18 * lift, 76, 70, 0, 0, 7); ctx.fill();
        drawSticker(sl.id, sx - 6 * lift, sy - 10 * lift + Math.sin(T * 8) * 3 * lift, 74 * (1 + 0.06 * lift), Math.sin(T * 5) * 0.05 * lift);
        ctx.strokeStyle = 'rgba(255,210,63,' + (0.5 + 0.5 * Math.sin(T * 8)) + ')'; ctx.lineWidth = 6; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.arc(sx, sy, 92, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * s.press); ctx.stroke(); ctx.setLineDash([]);
        continue;
      }
      // prázdné místo: obrys a stín nálepky
      const glow = target && target.s === sl;
      ctx.fillStyle = glow ? 'rgba(255,246,160,' + (0.6 + 0.3 * Math.sin(T * 8)) + ')' : 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.arc(sx, sy, 76, 0, 7); ctx.fill();
      ctx.strokeStyle = glow ? '#ffb800' : 'rgba(90,90,110,.45)'; ctx.lineWidth = glow ? 7 : 4; ctx.setLineDash([12, 10]); ctx.stroke(); ctx.setLineDash([]);
      ctx.save(); ctx.globalAlpha = 0.18; drawSticker(sl.id, sx, sy, 62, 0, true); ctx.restore();
    }
  },
  draw() {
    const f = full(); const g = ctx.createLinearGradient(0, f.y, 0, f.y + f.h); g.addColorStop(0, '#ffe9bd'); g.addColorStop(1, '#ffd38a');
    ctx.fillStyle = g; ctx.fillRect(f.x, f.y, f.w, f.h);
    ctx.fillStyle = '#c0703a'; rr(PAGE.x - 22, PAGE.y - 10, PAGE.w + 44, PAGE.h + 20, 36); ctx.fill();
    ctx.fillStyle = '#fffaf0'; rr(PAGE.x - 6, PAGE.y + 4, PAGE.w + 12, PAGE.h, 30); ctx.fill();
    if (this.flip) { const k = Math.abs(Math.cos(this.flip.t * Math.PI)); ctx.save(); ctx.translate(PAGE.x + PAGE.w / 2, 0); ctx.scale(Math.max(0.02, k), 1); ctx.translate(-(PAGE.x + PAGE.w / 2), 0); this.drawPage(PAGE.x); ctx.restore(); }
    else this.drawPage(PAGE.x);
    for (let i = 0; i < ALBUM.length; i++) { const full2 = ALBUM[i].slots.every(s => Save.placed[s.id]); ctx.fillStyle = i === this.page ? '#c0703a' : full2 ? '#ffd23f' : 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(VW / 2 - 60 + i * 30, 580, 9, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#ffffff'; rr(140, TRAY_Y - 62, 1320, 124, 30); ctx.fill();
    ctx.save(); rr(140, TRAY_Y - 70, 1320, 140, 30); ctx.clip();
    const d = this.drag;
    this.trayIds().forEach((id, i) => {
      const p = this.trayPos(i); if (p.x < 60 || p.x > 1540) return;
      ctx.strokeStyle = 'rgba(150,150,150,.6)'; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.arc(p.x, p.y, 54, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      const peeling = d && d.id === id && d.from === 'tray';
      if (peeling && d.carry) return;
      if (this.back && this.back.id === id) return;
      if (peeling) { const q = d.peel; ctx.fillStyle = '#eee'; ctx.beginPath(); ctx.arc(p.x, p.y, 50, 0, 7); ctx.fill(); drawSticker(id, p.x + q * 20, p.y - q * 40, 50 * (1 + q * 0.25), q * 0.5); }
      else drawSticker(id, p.x, p.y, 50, 0);
    });
    ctx.restore();
    if (this.trayIds().length === 0 && !d) drawToothChar(800, TRAY_Y, 40, T);
    for (const b of this.btns) drawBtn(b);
    if (this.back) { const b = this.back, k = ease(b.t), i = this.trayIds().indexOf(b.id), p = this.trayPos(Math.max(0, i)); drawSticker(b.id, lerp(b.x, p.x, k), lerp(b.y, p.y, k), lerp(80, 50, k), 0); }
    if (d && d.carry) { ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(d.x + 20, d.y + 30, 74, 66, 0, 0, 7); ctx.fill(); drawSticker(d.id, d.x, d.y, 80, Math.sin(T * 6) * 0.08); }
    // nápověda: kam s nálepkou / přitlačit / kterou vzít
    if (this.pend && !(d && d.rub)) { const so = slotOf(this.pend.id); drawHand(so.s.x + Math.sin(T * 6) * 40, so.s.y, 0, 0.9); }
    else if (d && d.carry) { const so = slotOf(d.id); if (so && so.page === this.page && !this.flip) { const k = (T * 0.6) % 1; drawHand(lerp(d.x, so.s.x, ease(k * 1.3)), lerp(d.y, so.s.y, ease(k * 1.3)), 0, 0.8); } }
    else if (sceneT > 4 && !d && this.trayIds().length) { const p = this.trayPos(0), k = (T * 0.5) % 1; drawHand(p.x, lerp(p.y, p.y - 90, ease(k * 2)), 0, 0.9); }
  },
  down(x, y) {
    if (this.flip) return;
    const b = hitBtn(this.btns, x, y); if (b) { Snd.tap(); b.fn(); return; }
    if (this.pend) { const so = slotOf(this.pend.id); if (dist(x, y, so.s.x, so.s.y) < 110) { this.drag = { rub: true, lx: x, ly: y }; return; } this.stickPend(); }
    if (y > TRAY_Y - 70) {
      const ids = this.trayIds();
      for (let i = 0; i < ids.length; i++) { const p = this.trayPos(i); if (dist(x, y, p.x, p.y) < 60) { this.drag = { from: 'tray', id: ids[i], sx: x, sy: y, x, y, peel: 0, carry: false, scroll: this.scroll }; return; } }
      this.drag = { from: 'scroll', sx: x, scroll: this.scroll }; return;
    }
    for (const sl of ALBUM[this.page].slots) if (Save.placed[sl.id] && dist(x, y, sl.x, sl.y) < 74) { this.drag = { tapSt: sl.id }; return; }
    if (x > PAGE.x && x < PAGE.x + PAGE.w && y > PAGE.y && y < PAGE.y + PAGE.h) this.drag = { swipe: true, sx: x, sy: y };
  },
  move(x, y) {
    const d = this.drag; if (!d) return;
    if (d.rub) {
      const dd = dist(x, y, d.lx, d.ly); d.lx = x; d.ly = y; const so = slotOf(this.pend.id);
      if (dist(x, y, so.s.x, so.s.y) < 120) {
        this.pend.press = Math.min(1, this.pend.press + dd / 450);
        if (Math.random() < 0.3) addPart({ x: x + rnd(-20, 20), y: y + rnd(-20, 20), vx: rnd(-60, 60), vy: rnd(-80, -20), life: 0.5, size: rnd(4, 8), color: '#ffd700', type: 'star' });
        if (this.pend.press >= 1) this.stick();
      }
      return;
    }
    if (d.from === 'scroll') { this.scroll = clamp(d.scroll - (x - d.sx), 0, this.maxScroll()); return; }
    if (d.from === 'tray') {
      if (!d.carry) {
        if (Math.abs(x - d.sx) > 26 && Math.abs(y - d.sy) < Math.abs(x - d.sx) * 0.6) { this.drag = { from: 'scroll', sx: d.sx, scroll: d.scroll }; return; }
        d.peel = clamp(Math.max(d.sy - y, dist(x, y, d.sx, d.sy) * 0.6) / 110, 0, 1);
        if (d.peel >= 1) { d.carry = true; Snd.noise(0.18, { f: 2500, fto: 6000, vol: 0.25, ft: 'bandpass' }); buzz(20); const so = slotOf(d.id); if (so && so.page !== this.page) this.turn(0, so.page); }
      }
      d.x = x; d.y = y;
    }
  },
  up(x, y) {
    const d = this.drag; this.drag = null; if (!d) return;
    if (d.rub || d.from === 'scroll') return;
    if (d.swipe) { if (Math.abs(x - d.sx) > 140) this.turn(x < d.sx ? 1 : -1); return; }
    if (d.tapSt) { this.wob[d.tapSt] = 1; Snd.sparkle(); say(stickerName(d.tapSt) + '!'); return; }
    if (d.from === 'tray') {
      if (!d.carry) return;
      const so = slotOf(d.id);
      if (so && so.page === this.page && dist(d.x, d.y, so.s.x, so.s.y) < 105) { this.pend = { id: d.id, press: 0 }; Save.inv[d.id] = 0; Save.save(); Snd.sticker(); buzz(15); if (firstTimes('press', 2)) say(P.press); }
      else { this.back = { id: d.id, x: d.x, y: d.y, t: 0 }; Snd.boing(); }
    }
  },
  stick() {
    const id = this.pend.id, so = slotOf(id); this.pend = null; Save.placed[id] = true; Save.save(); this.shine[id] = 0;
    Snd.sticker(); Snd.sparkle(); buzz(50); burst(so.s.x, so.s.y, 30, { colors: ['#ffd700', '#ffffff', '#ff8fc7', '#5fd0ff'], smin: 150, smax: 500 });
    if (ALBUM[this.page].slots.every(s => Save.placed[s.id])) { setTimeout(() => { Snd.fanfare(); confetti(100); }, 400); praise(pick(P.hurray), 0); }
    this.drag = null;
  }
};
