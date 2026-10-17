#!/usr/bin/env python3
"""Vyrobí ikony, snímky obrazovky a grafiku pro web, Google Play a App Store přímo z kódu hry.
Spouštět z /opt/zoubky-venv (playwright + pillow): media.py <výstupní složka>"""
import sys, asyncio, pathlib, base64, io
from playwright.async_api import async_playwright
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parent
OUT = pathlib.Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
HTML = (ROOT / 'assets' / 'index.html').as_uri()

ICON_JS = """(o) => { const orig = ctx; const c = document.createElement('canvas'); c.width = c.height = o.n; ctx = c.getContext('2d'); const n = o.n, k = n / 512;
 ctx.save(); ctx.scale(k, k);
 if (o.square) { const g = ctx.createLinearGradient(0,0,0,512); g.addColorStop(0,'#7fd8ff'); g.addColorStop(1,'#3f8ff5'); ctx.fillStyle = g; ctx.fillRect(0,0,512,512); }
 else { const g = ctx.createRadialGradient(256,200,40,256,256,300); g.addColorStop(0,'#c9f0ff'); g.addColorStop(1,'#3fa9f5'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(256,256,256,0,7); ctx.fill(); }
 const s = o.safe ? 0.78 : 1; ctx.translate(256,256); ctx.scale(s,s); ctx.translate(-256,-256);
 drawChar(CHARS[0], 256, 290, 170, {mode:'grin', happy:true}); drawBrush(330, 380, -0.9, 0.6, 1, 0);
 ctx.fillStyle='#fff'; starPath(420,110,34,10,4); ctx.fill(); starPath(95,150,22,7,4); ctx.fill();
 ctx.restore(); const url = c.toDataURL('image/png'); ctx = orig; return url; }"""
FEATURE_JS = """() => { const orig = ctx; const c = document.createElement('canvas'); c.width = 1024; c.height = 500; ctx = c.getContext('2d');
 const g = ctx.createLinearGradient(0,0,1024,500); g.addColorStop(0,'#6ccdfc'); g.addColorStop(1,'#b06cff'); ctx.fillStyle=g; ctx.fillRect(0,0,1024,500);
 for (let i=0;i<14;i++){ctx.fillStyle='rgba(255,255,255,.25)';ctx.beginPath();ctx.arc(prand(i)*1024,prand(i+9)*500,10+prand(i+3)*30,0,7);ctx.fill();}
 [['kocka',140,330,95],['bobr',330,300,120],['drak',880,320,110],['karkulka',700,340,95]].forEach(([id,x,y,r])=>drawChar(CHAR_BY[id],x,y,r,{mode:'grin',happy:true}));
 drawBrush(470, 300, -0.35, 0.75, 1, 1);
 ctx.fillStyle='#fff'; ctx.font='bold 112px Arial Rounded MT Bold, Arial, sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
 ctx.lineWidth=14; ctx.strokeStyle='#2a6fa8'; ctx.strokeText('Zoubky',512,92); ctx.fillText('Zoubky',512,92);
 const url = c.toDataURL('image/png'); ctx = orig; return url; }"""

SCENES = {
 'ukazka-1': "Save.profile={g:'f',name:'Laurinka',voc:'Laurinko',av:0};Save.unlocked=6;Save.done=['bobr','kocka','medved','pes','kun','zajic'];go('map');Scenes.map.camX=900;Scenes.map.greeted=true",
 'ukazka-2': "go('level',4);",
 'ukazka-3': "go('level',8);",
 'ukazka-4': "Save.book[0]={bg:0,st:[{id:'c:bobr',x:420,y:200,rot:-.1,stuck:true},{id:'rainbow',x:760,y:150,rot:.1,stuck:true},{id:'c:drak',x:1080,y:330,rot:.15,stuck:true},{id:'star',x:640,y:420,rot:0,stuck:true},{id:'c:karkulka',x:330,y:430,rot:.2,stuck:true}]};Save.inv={'c:kocka':1,'heart':2,'rocket':1,'flower':1,'c:pes':1,'sun':1};go('album')",
 'ukazka-5': "go('level',12);",
}
async def prep_scene(pg, name):
    if name == 'ukazka-2':
        await pg.wait_for_timeout(2600)
        await pg.evaluate("Prep.steps=['unscrew','bring'];Prep.i=-1;Prep.tube.cap='on';Prep.next();Prep.tube.spin=1.2;Prep.tube.out=.4")
        await pg.wait_for_timeout(1500)
    elif name == 'ukazka-3':
        await pg.wait_for_timeout(2000)
        await pg.evaluate("""Lv.setPhase('brush');Lv.veil=0;Lv.teeth.forEach((t,i)=>{if(i%3)t.dirt=.15});Lv.addGerm(0,{face:0,c:GERMC[1]});
          Lv.brush.held=true;Lv.brush.x=760;Lv.brush.y=470;Lv.brush.speed=4000;
          for(let k=0;k<40;k++)Lv.foam.push({x:640+Math.random()*260,y:440+Math.random()*60,r:9+Math.random()*12,a:1});Lv.brushT=Lv.cfg.dur*.55""")
        await pg.wait_for_timeout(700)
    elif name == 'ukazka-5':
        await pg.wait_for_timeout(1500)
        await pg.evaluate("Lv.setPhase('reward');Lv.startReward()")
        await pg.wait_for_timeout(2600)
    else:
        await pg.wait_for_timeout(1800)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(); await pg.goto(HTML); await pg.wait_for_timeout(600)
        def save(url, path, size=None, flatten=None):
            im = Image.open(io.BytesIO(base64.b64decode(url.split(',')[1]))).convert('RGBA')
            if size: im = im.resize(size, Image.LANCZOS)
            if flatten: bg = Image.new('RGB', im.size, flatten); bg.paste(im, mask=im.split()[3]); im = bg
            path.parent.mkdir(parents=True, exist_ok=True); im.save(path)
        ik = OUT / 'ikony'
        r = await pg.evaluate(ICON_JS, {'n': 1024, 'square': False}); save(r, ik / 'icon-512.png', (512, 512)); save(r, ik / 'icon-192.png', (192, 192))
        r = await pg.evaluate(ICON_JS, {'n': 1024, 'square': True}); save(r, ik / 'ios-1024.png', None, '#3f8ff5'); save(r, ik / 'apple-touch-icon.png', (180, 180), '#3f8ff5')
        r = await pg.evaluate(ICON_JS, {'n': 1024, 'square': True, 'safe': True}); save(r, ik / 'maskable-512.png', (512, 512), '#3f8ff5')
        save(await pg.evaluate(FEATURE_JS), OUT / 'obchody' / 'play-feature-1024x500.png', None, '#3fa9f5')
        await b.close()
        for kind, (w, h, dpr) in {'web': (900, 450, 2), 'play': (1080, 540, 2), 'appstore': (1434, 660, 2)}.items():
            b = await p.chromium.launch()
            for name, js in SCENES.items():
                pg = await b.new_page(viewport={'width': w, 'height': h}, device_scale_factor=dpr)
                await pg.goto(HTML); await pg.wait_for_timeout(700)
                await pg.evaluate("window.say=()=>{};Voice.say=()=>{};" + js)
                await prep_scene(pg, name)
                dest = OUT / ('obrazky' if kind == 'web' else 'obchody/' + kind)
                dest.mkdir(parents=True, exist_ok=True)
                await pg.screenshot(path=str(dest / f'{name}.png'))
                await pg.close()
            await b.close()
asyncio.run(main())
