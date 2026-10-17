'use strict';
// Webová verze (GitHub Pages): offline přes service worker, na iPhonu nápověda „Přidat na plochu“ (hra na výšku se otočí sama)
(function () {
  if (!/^https?:/.test(location.protocol) || window.Android || window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.zoubky) return;
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('../sw.js', { scope: '../' }).catch(() => {});
  const css = document.createElement('style');
  css.textContent = '.zb-ov{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:18px;background:rgba(40,120,180,.94);color:#fff;font:600 22px/1.35 system-ui,-apple-system,sans-serif;text-align:center;padding:24px;z-index:9;touch-action:auto}.zb-ov b{font-size:28px}.zb-ov button{font:700 22px system-ui,sans-serif;border:0;border-radius:40px;padding:14px 34px;background:#4cd964;color:#fff}.zb-ov .zb-k{display:inline-block;background:#fff;color:#2a6fa8;border-radius:10px;padding:2px 10px;margin:0 4px}';
  document.head.appendChild(css);
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = window.navigator.standalone || matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches;
  let seen = false; try { seen = localStorage.getItem('zoubky_iosTip') === '1'; } catch (e) {}
  if (ios && !standalone && !seen) {
    const ov = document.createElement('div'); ov.className = 'zb-ov';
    ov.innerHTML = '<div style="font-size:64px">🦷</div><b>Přidej si Zoubky na plochu</b><div>Dole ťukni na <span class="zb-k">Sdílet ⬆︎</span>, pak <span class="zb-k">Přidat na plochu</span> a <span class="zb-k">Přidat</span>.<br>Hra pak poběží na celou obrazovku i bez internetu.</div><button>Hrát hned</button>';
    ov.querySelector('button').onclick = () => { try { localStorage.setItem('zoubky_iosTip', '1'); } catch (e) {} ov.remove(); };
    document.body.appendChild(ov);
  }
})();
