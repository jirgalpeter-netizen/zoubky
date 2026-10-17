'use strict';
// ===== KNÍŽKA NA NÁLEPKY: odlepit – nalepit – přitlačit; stránku jde vytrhnout =====
const PAGE = { x: 150, y: 20, w: 1300, h: 540 };
const TRAY_Y = 648, BIN = { x: 1530, y: 470 };
const BG_N = 6;
if (!Save.book) { // převod stránek z verze 2.0
  Save.book = [0, 1, 2, 3].map(i => ({ bg: i, st: (Save.pages && Save.pages[i] || []).map(s => Object.assign({ stuck: true }, s)) }));
  Save.save();
}
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
    Music.on = true; this.drag = null; this.wob = {}; this.flip = null; this.tear = null; this.ball = null; this.shine = {};
    const any = this.trayIds().length > 0 || Save.book.some(p => p.st.length);
    say(any ? P.albumHello : P.albumEmpty);
    this.btns = [
      { x: 70, y: 290, r: 50, color: '#ff9f1a', icon: 'prev', fn: () => this.turn(-1) },
      { x: 1530, y: 290, r: 50, color: '#ff9f1a', icon: 'next', fn: () => this.turn(1) },
      { x: 70, y: 70, r: 44, color: '#3fa9f5', icon: 'map', fn: () => go('map') }
    ];
  },
  cur() { return Save.book[this.page]; },
  pending() { return this.cur().st.find(s => !s.stuck); },
  stickAll() { for (const pg of Save.book) for (const s of pg.st) s.stuck = true; Save.save(); },
  turn(d) { if (this.flip || this.tear) return; this.stickAll(); this.flip = { t: 0, d }; Snd.sticker(); },
  trayIds() { const ids = Object.keys(Save.inv).filter(k => Save.inv[k] > 0); return ids.sort((a, b) => (a.startsWith('c:') ? 0 : 1) - (b.startsWith('c:') ? 0 : 1)); },
  trayPos(i) { return { x: 200 + i * 128 - this.scroll, y: TRAY_Y }; },
  maxScroll() { return Math.max(0, this.trayIds().length * 128 - 1250); },
  update(dt) {
    for (const k in this.wob) this.wob[k] = Math.max(0, this.wob[k] - dt);
    for (const k in this.shine) { this.shine[k] += dt; if (this.shine[k] > 1) delete this.shine[k]; }
    if (this.flip) { const f = this.flip, was = f.t; f.t += dt / 0.5; if (was < 0.5 && f.t >= 0.5) this.page = (this.page + f.d + Save.book.length) % Save.book.length; if (f.t >= 1) this.flip = null; }
    if (this.ball) { const b = this.ball; b.t += dt; if (b.t > 0.9) { this.ball = null; Snd.boing(); } }
  },
  drawPage(x0) {
    const pg = this.cur(), { y, w, h } = PAGE, x = x0;
    drawPageBg(pg.bg, x, y, w, h);
    pg.st.forEach((s, i) => {
      if (s.stuck) { const w2 = this.wob[i] || 0; drawSticker(s.id, s.x + x - PAGE.x, s.y, 74 * (1 + w2 * 0.25), s.rot + Math.sin(T * 25) * 0.2 * w2);
        const sh = this.shine[i]; if (sh != null) { ctx.save(); ctx.beginPath(); ctx.arc(s.x + x - PAGE.x, s.y, 74, 0, 7); ctx.clip(); const sx = s.x + x - PAGE.x - 120 + sh * 240; const g = ctx.createLinearGradient(sx - 40, 0, sx + 40, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,.85)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(sx - 40, s.y - 80, 80, 160); ctx.restore(); } }
      else { // ještě nepřitlačená – odstává
        const lift = 1 - s.press;
        ctx.fillStyle = 'rgba(0,0,0,' + (0.25 * lift) + ')'; ctx.beginPath(); ctx.ellipse(s.x + 14 * lift, s.y + 18 * lift, 76, 70, 0, 0, 7); ctx.fill();
        drawSticker(s.id, s.x - 6 * lift, s.y - 10 * lift + Math.sin(T * 8) * 3 * lift, 74 * (1 + 0.06 * lift), s.rot + Math.sin(T * 5) * 0.05 * lift);
        ctx.strokeStyle = 'rgba(255,210,63,' + (0.5 + 0.5 * Math.sin(T * 8)) + ')'; ctx.lineWidth = 6; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.arc(s.x, s.y, 92, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * s.press); ctx.stroke(); ctx.setLineDash([]);
      }
    });
    // ohnutý roh – za něj se stránka vytrhává
    ctx.fillStyle = '#f0e6d2'; ctx.beginPath(); ctx.moveTo(x + w - 70, y); ctx.lineTo(x + w, y + 70); ctx.lineTo(x + w - 70, y + 70); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.15)'; ctx.lineWidth = 2; ctx.stroke();
  },
  draw() {
    const f = full(); const g = ctx.createLinearGradient(0, f.y, 0, f.y + f.h); g.addColorStop(0, '#ffe9bd'); g.addColorStop(1, '#ffd38a');
    ctx.fillStyle = g; ctx.fillRect(f.x, f.y, f.w, f.h);
    // hřbet knížky
    ctx.fillStyle = '#c0703a'; rr(PAGE.x - 22, PAGE.y - 10, PAGE.w + 44, PAGE.h + 20, 36); ctx.fill();
    ctx.fillStyle = '#fffaf0'; rr(PAGE.x - 6, PAGE.y + 4, PAGE.w + 12, PAGE.h, 30); ctx.fill();
    if (this.tear) {
      const p = this.tear.p;
      drawPageBg(-1, PAGE.x, PAGE.y, PAGE.w, PAGE.h); ctx.fillStyle = '#fffaf0'; rr(PAGE.x, PAGE.y, PAGE.w, PAGE.h, 30); ctx.fill();
      ctx.save(); ctx.translate(PAGE.x, PAGE.y + PAGE.h); ctx.rotate(-p * 0.35); ctx.translate(p * 260, -p * 120); ctx.translate(-PAGE.x, -(PAGE.y + PAGE.h));
      this.drawPage(PAGE.x);
      ctx.fillStyle = '#fffaf0'; ctx.beginPath(); ctx.moveTo(PAGE.x - 4, PAGE.y); for (let k = 0; k <= 20; k++) ctx.lineTo(PAGE.x + (k % 2 ? 14 : 0), PAGE.y + k * PAGE.h / 20); ctx.lineTo(PAGE.x - 4, PAGE.y + PAGE.h); ctx.closePath(); ctx.fill();
      ctx.restore();
    } else if (this.flip) {
      const k = Math.abs(Math.cos(this.flip.t * Math.PI));
      ctx.save(); ctx.translate(PAGE.x + PAGE.w / 2, 0); ctx.scale(Math.max(0.02, k), 1); ctx.translate(-(PAGE.x + PAGE.w / 2), 0); this.drawPage(PAGE.x); ctx.restore();
    } else this.drawPage(PAGE.x);
    if (this.ball) { const b = this.ball, k = ease(b.t / 0.9); const x = lerp(b.x, BIN.x, k), y = lerp(b.y, BIN.y - 30, k) - Math.sin(k * Math.PI) * 220; ctx.fillStyle = '#fffaf0'; ctx.save(); ctx.translate(x, y); ctx.rotate(b.t * 9); blob(70 * (1 - k * 0.55), 16, 0.3, 3); ctx.fill(); ctx.strokeStyle = '#d9cbb0'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
    drawBin(BIN.x, BIN.y, !!this.tear || !!this.ball);
    for (let i = 0; i < Save.book.length; i++) { ctx.fillStyle = i === this.page ? '#c0703a' : 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(VW / 2 - 45 + i * 30, 580, 9, 0, 7); ctx.fill(); }
    // arch s nálepkami
    ctx.fillStyle = '#ffffff'; rr(140, TRAY_Y - 62, 1320, 124, 30); ctx.fill();
    ctx.save(); rr(140, TRAY_Y - 70, 1320, 140, 30); ctx.clip();
    this.trayIds().forEach((id, i) => {
      const p = this.trayPos(i); if (p.x < 60 || p.x > 1540) return;
      ctx.strokeStyle = 'rgba(150,150,150,.6)'; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.arc(p.x, p.y, 54, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      const d = this.drag, peeling = d && d.id === id && d.from === 'tray';
      const left = Save.inv[id] - (peeling && d.carry ? 1 : 0);
      if (peeling && !d.carry) { const q = d.peel; ctx.fillStyle = '#eee'; ctx.beginPath(); ctx.arc(p.x, p.y, 50, 0, 7); ctx.fill(); drawSticker(id, p.x + q * 20, p.y - q * 40, 50 * (1 + q * 0.25), q * 0.5); }
      else if (left > 0) drawSticker(id, p.x, p.y, 50, 0);
      if (left > 1) { ctx.fillStyle = '#ff4d6d'; ctx.beginPath(); ctx.arc(p.x + 40, p.y - 38, 18, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = 'bold 22px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(left), p.x + 40, p.y - 37); }
    });
    ctx.restore();
    if (this.trayIds().length === 0 && !this.drag) drawToothChar(800, TRAY_Y, 40, T);
    for (const b of this.btns) drawBtn(b);
    const d = this.drag;
    if (d && d.carry) { ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(d.x + 20, d.y + 30, 74, 66, 0, 0, 7); ctx.fill(); drawSticker(d.id, d.x, d.y, 80, Math.sin(T * 6) * 0.08); }
    const pend = this.pending();
    if (pend && !(d && d.rub)) drawHand(pend.x + Math.sin(T * 6) * 40, pend.y, 0, 0.9);
    else if (sceneT > 2 && !d && this.trayIds().length && !this.cur().st.length) { const p = this.trayPos(0), k = (T * 0.5) % 1; drawHand(p.x, lerp(p.y, p.y - 90, ease(k * 2)), 0, 0.9); }
  },
  down(x, y) {
    if (this.flip || this.tear || this.ball) return;
    const b = hitBtn(this.btns, x, y); if (b) { Snd.tap(); b.fn(); return; }
    const pend = this.pending();
    if (pend && dist(x, y, pend.x, pend.y) < 100) { this.drag = { rub: true, s: pend, lx: x, ly: y }; return; }
    if (dist(x, y, PAGE.x + PAGE.w - 30, PAGE.y + 30) < 80) { this.stickAll(); this.tear = { sx: x, sy: y, p: 0 }; return; }
    if (y > TRAY_Y - 70) {
      const ids = this.trayIds();
      for (let i = 0; i < ids.length; i++) { const p = this.trayPos(i); if (dist(x, y, p.x, p.y) < 60) { this.stickAll(); this.drag = { from: 'tray', id: ids[i], sx: x, sy: y, x, y, peel: 0, carry: false, scroll: this.scroll }; Snd.tap(); return; } }
      this.drag = { from: 'scroll', sx: x, scroll: this.scroll }; return;
    }
    const st = this.cur().st;
    for (let i = st.length - 1; i >= 0; i--) if (st[i].stuck && dist(x, y, st[i].x, st[i].y) < 74) { this.drag = { tapSt: i, sx: x, sy: y }; return; }
    if (x > PAGE.x && x < PAGE.x + PAGE.w && y > PAGE.y && y < PAGE.y + PAGE.h) this.drag = { swipe: true, sx: x, sy: y };
  },
  move(x, y) {
    if (this.tear) { const t = this.tear; t.p = clamp(((t.sx - x) + (y - t.sy)) / 900, 0, 1); if ((t.p * 12 | 0) !== (t.lp || 0)) { t.lp = t.p * 12 | 0; Snd.noise(0.08, { f: 4000, vol: 0.15, ft: 'bandpass' }); } return; }
    const d = this.drag; if (!d) return;
    if (d.rub) {
      const dd = dist(x, y, d.lx, d.ly); d.lx = x; d.ly = y;
      if (dist(x, y, d.s.x, d.s.y) < 120) {
        d.s.press = Math.min(1, d.s.press + dd / 450);
        if (Math.random() < 0.3) addPart({ x: x + rnd(-20, 20), y: y + rnd(-20, 20), vx: rnd(-60, 60), vy: rnd(-80, -20), life: 0.5, size: rnd(4, 8), color: '#ffd700', type: 'star' });
        if (d.s.press >= 1) this.stick(d.s);
      }
      return;
    }
    if (d.from === 'scroll') { this.scroll = clamp(d.scroll - (x - d.sx), 0, this.maxScroll()); return; }
    if (d.swipe) return;
    if (d.from === 'tray') {
      if (!d.carry) {
        if (Math.abs(x - d.sx) > 26 && Math.abs(y - d.sy) < Math.abs(x - d.sx) * 0.6) { this.drag = { from: 'scroll', sx: d.sx, scroll: d.scroll }; return; }
        d.peel = clamp(Math.max(d.sy - y, dist(x, y, d.sx, d.sy) * 0.6) / 110, 0, 1);
        if (d.peel >= 1) { d.carry = true; Snd.noise(0.18, { f: 2500, fto: 6000, vol: 0.25, ft: 'bandpass' }); buzz(20); }
      }
      d.x = x; d.y = y;
    }
  },
  up(x, y) {
    if (this.tear) {
      const t = this.tear; this.tear = null;
      if (t.p > 0.45) {
        Snd.rip(); buzz(80);
        this.ball = { x: PAGE.x + PAGE.w / 2 + t.p * 200, y: PAGE.y + PAGE.h / 2 - t.p * 100, t: 0 };
        let bg; do { bg = rndi(0, BG_N - 1); } while (bg === this.cur().bg && BG_N > 1);
        Save.book[this.page] = { bg, st: [] }; Save.save(); say(P.tear);
      }
      return;
    }
    const d = this.drag; this.drag = null; if (!d) return;
    if (d.rub || d.from === 'scroll') return;
    if (d.swipe) { if (Math.abs(x - d.sx) > 140) this.turn(x < d.sx ? 1 : -1); return; }
    if (d.tapSt != null) { this.wob[d.tapSt] = 1; Snd.sparkle(); say(stickerName(this.cur().st[d.tapSt].id) + '!'); return; }
    if (d.from === 'tray') {
      if (!d.carry) { if (d.peel < 0.2) say(stickerName(d.id) + '!'); return; }
      const inPage = d.x > PAGE.x + 40 && d.x < PAGE.x + PAGE.w - 40 && d.y > PAGE.y + 40 && d.y < PAGE.y + PAGE.h - 30;
      if (inPage && Save.inv[d.id] > 0) {
        Save.inv[d.id]--; this.cur().st.push({ id: d.id, x: d.x, y: d.y, rot: rnd(-0.25, 0.25), stuck: false, press: 0 }); Save.save();
        Snd.sticker(); buzz(15);
        if (!this.saidPress || T - this.saidPress > 20) { this.saidPress = T; say(P.press); }
      }
    }
  },
  stick(s) {
    s.stuck = true; delete s.press; Save.save();
    const i = this.cur().st.indexOf(s); this.shine[i] = 0;
    Snd.sticker(); Snd.sparkle(); buzz(50); burst(s.x, s.y, 30, { colors: ['#ffd700', '#ffffff', '#ff8fc7', '#5fd0ff'], smin: 150, smax: 500 });
    for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; addPart({ x: s.x + Math.cos(a) * 80, y: s.y + Math.sin(a) * 80, vx: Math.cos(a) * 120, vy: Math.sin(a) * 120, life: 0.6, size: 10, color: '#ffffff', type: 'star' }); }
    say(pick(P.stuck)); say(stickerName(s.id) + '!', true);
    this.drag = null;
  }
};
