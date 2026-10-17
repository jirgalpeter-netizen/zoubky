'use strict';
// ===== Plátno ve vysokém rozlišení (virtuální scéna 1600×720) =====
const VW = 1600, VH = 720;
const cvs = document.getElementById('c');
let ctx = cvs.getContext('2d');
let dpr = 1, S = 1, OX = 0, OY = 0;
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 4);
  cvs.width = Math.round(innerWidth * dpr);
  cvs.height = Math.round(innerHeight * dpr);
  S = Math.min(cvs.width / VW, cvs.height / VH);
  OX = (cvs.width - VW * S) / 2;
  OY = (cvs.height - VH * S) / 2;
}
addEventListener('resize', resize);
resize();

const rnd = (a, b) => a + Math.random() * (b - a);
const rndi = (a, b) => Math.floor(rnd(a, b + 1));
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const dist = (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2);
const ease = t => { t = clamp(t, 0, 1); return 1 - Math.pow(1 - t, 3); };
const easeInOut = t => { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const easeBack = t => { t = clamp(t, 0, 1); const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
function hex2rgb(h) { h = h.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
function mix(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return 'rgb(' + Math.round(A[0] + (B[0] - A[0]) * t) + ',' + Math.round(A[1] + (B[1] - A[1]) * t) + ',' + Math.round(A[2] + (B[2] - A[2]) * t) + ')'; }
const lighten = (h, t) => mix(h, '#ffffff', t), darken = (h, t) => mix(h, '#000000', t);
function full() { return { x: -OX / S, y: -OY / S, w: cvs.width / S, h: cvs.height / S }; }

// ===== Uložení postupu =====
const Store = {
  get(k, d) { try { const v = localStorage.getItem('zoubky_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('zoubky_' + k, JSON.stringify(v)); } catch (e) {} }
};
const Save = {
  unlocked: Store.get('unlocked', 0),       // nejvyšší odemčený level (index)
  done: Store.get('done', []),              // id dokončených postav
  inv: Store.get('inv', null),              // nálepky k nalepení {id: počet}
  pages: Store.get('pages', [[], [], [], []]),
  music: Store.get('music', true),
  brush: Store.get('brush', 0),
  profile: Store.get('profile', null),
  book: Store.get('book', null),
  togetherSec: Store.get('togetherSec', 120),
  save() { for (const k of ['unlocked', 'done', 'inv', 'pages', 'music', 'togetherSec', 'brush', 'profile', 'book']) Store.set(k, this[k]); }
};
if (!Save.inv) { // převod nálepek z verze 1
  Save.inv = {};
  for (const id of Store.get('stickers', [])) Save.inv[id] = (Save.inv[id] || 0) + 1;
  Save.save();
}
function addSticker(id) { Save.inv[id] = (Save.inv[id] || 0) + 1; Save.save(); }

// ===== Hlas: nahrané věty (voice/manifest.js), jinak hlas telefonu =====
let T = 0, lastSay = -99, scrubWant = 0;
const VOICE = window.VOICE || {};
const Voice = {
  q: [], cur: null, missing: new Set(),
  say(text, queue) {
    lastSay = T;
    if (!queue) { this.q = []; this.stop(); }
    this.q.push(text);
    if (!this.cur) this.next();
  },
  stop() {
    if (this.cur) { try { this.cur.onended = this.cur.onerror = null; this.cur.pause(); } catch (e) {} this.cur = null; }
    try { if (window.Android && window.Android.stopSpeak) window.Android.stopSpeak(); else if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
  },
  next() {
    const t = this.q.shift();
    if (t == null) { this.cur = null; return; }
    const f = VOICE[t];
    if (f) {
      const a = new Audio('voice/' + f); a.volume = 1;
      this.cur = a;
      const done = () => { if (this.cur === a) { this.cur = null; setTimeout(() => this.next(), 120); } };
      a.onended = done; a.onerror = () => { if (this.cur === a) { this.cur = null; this.tts(t); this.next(); } };
      const p = a.play(); if (p && p.catch) p.catch(() => { if (this.cur === a) { this.cur = null; this.tts(t); this.next(); } });
    } else {
      this.missing.add(t);
      this.tts(t); this.next();
    }
  },
  tts(t) {
    try {
      if (window.Android && window.Android.speak) { window.Android.speak(t, true); return; }
      if (window.speechSynthesis) { const u = new SpeechSynthesisUtterance(t); u.lang = 'cs-CZ'; u.rate = 0.9; u.pitch = 1.1; speechSynthesis.speak(u); }
    } catch (e) {}
  },
  busy() { return !!this.cur || this.q.length > 0; }
};
function say(t, queue) { Voice.say(t, queue); }
function buzz(ms) { try { if (window.Android && window.Android.vibrate) window.Android.vibrate(ms); else if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

// ===== Zvuky (syntetizované) =====
const Snd = {
  ac: null,
  init() {
    if (this.ac) { if (this.ac.state === 'suspended') this.ac.resume(); return; }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ac = new AC();
      this.master = this.ac.createGain(); this.master.gain.value = 0.7; this.master.connect(this.ac.destination);
      this.musicG = this.ac.createGain(); this.musicG.gain.value = Save.music ? 0.1 : 0; this.musicG.connect(this.master);
      const len = this.ac.sampleRate * 2, b = this.ac.createBuffer(1, len, this.ac.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.noiseBuf = b;
      const src = this.ac.createBufferSource(); src.buffer = b; src.loop = true;
      this.scrubF = this.ac.createBiquadFilter(); this.scrubF.type = 'bandpass'; this.scrubF.frequency.value = 3500; this.scrubF.Q.value = 0.9;
      this.scrubG = this.ac.createGain(); this.scrubG.gain.value = 0;
      src.connect(this.scrubF); this.scrubF.connect(this.scrubG); this.scrubG.connect(this.master); src.start();
    } catch (e) { this.ac = null; }
  },
  tone(f, d, o) {
    o = o || {}; const ac = this.ac; if (!ac) return;
    const t = ac.currentTime + (o.when || 0);
    const osc = ac.createOscillator(), g = ac.createGain();
    osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + d);
    const v = o.vol == null ? 0.3 : o.vol;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + Math.min(0.02, d / 4));
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    osc.connect(g); g.connect(o.dest || this.master); osc.start(t); osc.stop(t + d + 0.05);
  },
  noise(d, o) {
    o = o || {}; const ac = this.ac; if (!ac) return;
    const t = ac.currentTime + (o.when || 0);
    const s = ac.createBufferSource(); s.buffer = this.noiseBuf;
    const f = ac.createBiquadFilter(); f.type = o.ft || 'lowpass'; f.frequency.setValueAtTime(o.f || 1000, t);
    if (o.fto) f.frequency.exponentialRampToValueAtTime(o.fto, t + d);
    const g = ac.createGain(); g.gain.setValueAtTime(o.vol == null ? 0.3 : o.vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t, Math.random()); s.stop(t + d + 0.05);
  },
  pop() { this.tone(rnd(500, 700), 0.14, { to: 1500, vol: 0.35 }); },
  boing() { this.tone(rnd(260, 330), 0.22, { type: 'triangle', to: 130, vol: 0.22 }); },
  hihi() { [0, 0.12].forEach(w => this.tone(1200, 0.08, { type: 'triangle', to: 1700, vol: 0.12, when: w })); },
  tap() { this.tone(660, 0.08, { vol: 0.2 }); this.tone(990, 0.1, { vol: 0.15, when: 0.05 }); },
  ding() { this.tone(1568, 0.3, { vol: 0.15 }); this.tone(2093, 0.4, { vol: 0.1, when: 0.08 }); },
  sparkle() { [1319, 1568, 2093, 2637].forEach((f, i) => this.tone(f, 0.25, { vol: 0.12, when: i * 0.07 })); },
  squish() { this.noise(0.3, { f: 500, fto: 2200, vol: 0.2, ft: 'bandpass' }); this.tone(220, 0.25, { to: 480, vol: 0.1 }); },
  splash() { this.noise(1.2, { f: 3000, fto: 300, vol: 0.3 }); for (let i = 0; i < 8; i++) this.tone(rnd(300, 700), 0.1, { to: rnd(800, 1500), vol: 0.08, when: 0.3 + i * 0.09 }); },
  munch() { for (let i = 0; i < 4; i++) this.noise(0.09, { f: 1400, vol: 0.4, when: i * 0.2, ft: 'bandpass' }); },
  wrong() { this.tone(240, 0.18, { type: 'square', vol: 0.06 }); this.tone(180, 0.3, { type: 'square', vol: 0.06, when: 0.18 }); },
  step() { this.tone(rnd(500, 600), 0.06, { type: 'triangle', vol: 0.1 }); },
  rip() { this.noise(0.5, { f: 6000, fto: 900, vol: 0.35, ft: 'bandpass' }); this.noise(0.25, { f: 3000, vol: 0.2, ft: 'highpass', when: 0.1 }); },
  twist() { this.tone(rnd(900, 1100), 0.04, { type: 'square', vol: 0.05 }); },
  sticker() { this.noise(0.12, { f: 2500, vol: 0.2, ft: 'highpass' }); this.tone(880, 0.12, { vol: 0.15, when: 0.05 }); },
  fanfare() {
    const n = [523, 659, 784, 1047, 784, 1047], w = [0, 0.13, 0.26, 0.39, 0.6, 0.73];
    n.forEach((f, i) => { const d = i === 5 ? 0.7 : 0.18; this.tone(f, d, { type: 'triangle', vol: 0.22, when: w[i] }); this.tone(f * 2, d, { vol: 0.06, when: w[i] }); });
  },
  scrubNow: 0,
  scrub(level) {
    if (!this.scrubG) return; const t = this.ac.currentTime;
    if (level < 0.005) { if (this.scrubNow > 0) { this.scrubG.gain.cancelScheduledValues(t); this.scrubG.gain.setValueAtTime(this.scrubG.gain.value, t); this.scrubG.gain.linearRampToValueAtTime(0, t + 0.06); } this.scrubNow = 0; return; }
    this.scrubNow = level; this.scrubG.gain.setTargetAtTime(level, t, 0.04); this.scrubF.frequency.setTargetAtTime(2500 + level * 9000, t, 0.05);
  }
};
const Music = {
  on: false, next: 0, step: 0,
  mel: [523, 659, 784, 659, 698, 880, 784, 0, 659, 784, 659, 523, 587, 659, 523, 0, 784, 880, 784, 659, 698, 784, 698, 587, 659, 698, 659, 523, 587, 523, 0, 0],
  bass: [131, 175, 196, 131, 165, 175, 196, 131],
  tick() {
    if (!this.on || !Snd.ac || !Save.music) return;
    const ac = Snd.ac;
    Snd.musicG.gain.setTargetAtTime(Voice.busy() ? 0.035 : 0.1, ac.currentTime, 0.2);
    if (this.next < ac.currentTime) this.next = ac.currentTime + 0.05;
    while (this.next < ac.currentTime + 0.25) {
      const w = this.next - ac.currentTime, n = this.mel[this.step % this.mel.length];
      if (n) Snd.tone(n, 0.24, { type: 'triangle', vol: 0.5, when: w, dest: Snd.musicG });
      if (this.step % 2 === 0) Snd.tone(this.bass[Math.floor(this.step / 4) % this.bass.length], 0.35, { vol: 0.7, when: w, dest: Snd.musicG });
      this.step++; this.next += 0.27;
    }
  }
};
function setMusic(on) { Save.music = on; Save.save(); if (Snd.musicG) Snd.musicG.gain.value = on ? 0.1 : 0; }

// ===== Částice =====
let parts = [];
function addPart(p) { parts.push(Object.assign({ vx: 0, vy: 0, g: 0, life: 1, size: 10, rot: 0, vr: 0, color: '#fff', type: 'dot' }, p)); }
function burst(x, y, n, o) {
  o = o || {};
  for (let i = 0; i < n; i++) {
    const a = rnd(0, Math.PI * 2), sp = rnd(o.smin || 100, o.smax || 400);
    addPart({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (o.up || 0), g: o.g || 0, life: rnd(0.6, 1.2) * (o.life || 1), size: rnd(o.min || 6, o.max || 14), color: pick(o.colors || ['#ffd700', '#ffffff', '#fff3a0']), type: o.type || 'star', rot: rnd(0, 6), vr: rnd(-6, 6) });
  }
}
const CONF = ['#ff4d6d', '#ffd23f', '#4cd964', '#3fa9f5', '#b06cff', '#ff9f1a', '#ffffff'];
function confetti(n) {
  for (let i = 0; i < (n || 70); i++) addPart({ x: rnd(0, VW), y: rnd(-80, -10), vx: rnd(-80, 80), vy: rnd(120, 360), g: 160, life: rnd(2.5, 4), size: rnd(14, 24), color: pick(CONF), type: 'confetti', rot: rnd(0, 6), vr: rnd(-8, 8) });
}
function updParts(dt) {
  for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.g * dt; p.rot += p.vr * dt; p.life -= dt; if (p.type === 'confetti') p.vx += Math.sin(T * 3 + p.rot) * 30 * dt; }
  parts = parts.filter(p => p.life > 0);
}
function drawParts() {
  for (const p of parts) {
    ctx.save();
    ctx.globalAlpha = clamp(p.life / 0.4, 0, 1);
    ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.type === 'star') { starPath(0, 0, p.size, p.size * 0.45, 5); ctx.fill(); }
    else if (p.type === 'confetti') { ctx.scale(1, Math.abs(Math.sin(p.rot * 2)) * 0.8 + 0.2); ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); }
    else if (p.type === 'bubble') { ctx.beginPath(); ctx.arc(0, 0, p.size, 0, 7); ctx.fillStyle = 'rgba(225,245,255,.55)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 2.5; ctx.stroke(); }
    else if (p.type === 'drop') { ctx.beginPath(); ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, 7); ctx.fill(); }
    else { ctx.beginPath(); ctx.arc(0, 0, p.size, 0, 7); ctx.fill(); }
    ctx.restore();
  }
}

// ===== Základní tvary =====
function rr(x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}
function starPath(x, y, R, r, n) {
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, rad = i % 2 ? r : R; i ? ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad) : ctx.moveTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); }
  ctx.closePath();
}
function heartPath(x, y, s) {
  ctx.beginPath(); ctx.moveTo(x, y + s * 0.75);
  ctx.bezierCurveTo(x - s * 1.25, y - s * 0.05, x - s * 0.6, y - s * 0.95, x, y - s * 0.35);
  ctx.bezierCurveTo(x + s * 0.6, y - s * 0.95, x + s * 1.25, y - s * 0.05, x, y + s * 0.75);
  ctx.closePath();
}
function cuteFace(x, y, s) {
  ctx.fillStyle = '#3a2416';
  ctx.beginPath(); ctx.arc(x - s * 0.32, y - s * 0.1, s * 0.11, 0, 7); ctx.arc(x + s * 0.32, y - s * 0.1, s * 0.11, 0, 7); ctx.fill();
  ctx.strokeStyle = '#3a2416'; ctx.lineWidth = s * 0.09; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(x, y + s * 0.05, s * 0.25, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
  ctx.fillStyle = 'rgba(255,110,130,.45)';
  ctx.beginPath(); ctx.arc(x - s * 0.55, y + s * 0.12, s * 0.12, 0, 7); ctx.arc(x + s * 0.55, y + s * 0.12, s * 0.12, 0, 7); ctx.fill();
}
function drawCrown(x, y, w) {
  const h = w * 0.55;
  ctx.save();
  ctx.beginPath(); ctx.moveTo(x - w / 2, y);
  ctx.lineTo(x - w / 2, y - h * 0.55); ctx.lineTo(x - w * 0.25, y - h * 0.2); ctx.lineTo(x, y - h);
  ctx.lineTo(x + w * 0.25, y - h * 0.2); ctx.lineTo(x + w / 2, y - h * 0.55); ctx.lineTo(x + w / 2, y); ctx.closePath();
  const g = ctx.createLinearGradient(0, y - h, 0, y); g.addColorStop(0, '#fff17a'); g.addColorStop(1, '#f5b400');
  ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = w * 0.04; ctx.strokeStyle = '#c98a00'; ctx.lineJoin = 'round'; ctx.stroke();
  for (const [c, dx] of [['#ff4d6d', -0.25], ['#3fa9f5', 0], ['#4cd964', 0.25]]) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + dx * w, y - h * 0.2, w * 0.06, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#fff'; for (const dx of [-0.5, 0, 0.5]) { ctx.beginPath(); ctx.arc(x + dx * w, y - (dx === 0 ? h : h * 0.55), w * 0.05, 0, 7); ctx.fill(); }
  ctx.restore();
}
function drawLock(x, y, s) {
  ctx.save(); ctx.translate(x, y);
  ctx.strokeStyle = '#8a8f99'; ctx.lineWidth = s * 0.18; ctx.beginPath(); ctx.arc(0, -s * 0.2, s * 0.38, Math.PI, 0); ctx.stroke();
  ctx.fillStyle = '#b8bec8'; rr(-s * 0.6, -s * 0.2, s * 1.2, s * 0.95, s * 0.18); ctx.fill();
  ctx.fillStyle = '#6b707a'; ctx.beginPath(); ctx.arc(0, s * 0.18, s * 0.13, 0, 7); ctx.fill(); ctx.fillRect(-s * 0.05, s * 0.2, s * 0.1, s * 0.3);
  ctx.restore();
}
