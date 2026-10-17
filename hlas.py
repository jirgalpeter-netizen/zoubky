#!/usr/bin/env python3
"""Nahraje všechny věty hry hlasem ElevenLabs do assets/voice/ a zapíše voice/manifest.js.

Použití (python z /opt/zoubky-venv – má playwright):
  hlas.py hlasy                 – vypíše české ženské hlasy z knihovny ElevenLabs
  hlas.py ukazky ID1 ID2 ...    – vyrobí ukázky do ukazky-hlasu/
  hlas.py nahraj VOICE_ID       – nahraje všechny věty (už hotové soubory přeskočí)
Klíč se čte z /root/.config/zoubky/elevenlabs.env (ELEVENLABS_API_KEY=...), nikdy se nevypisuje.
"""
import sys, json, hashlib, pathlib, time, asyncio, urllib.request, urllib.error

ROOT = pathlib.Path(__file__).resolve().parent
ASSETS = ROOT / 'assets'
VOICE_DIR = ASSETS / 'voice'
KEYFILE = pathlib.Path('/root/.config/zoubky/elevenlabs.env')
MODEL = 'eleven_multilingual_v2'
SETTINGS = {'stability': 0.45, 'similarity_boost': 0.8, 'style': 0.35, 'use_speaker_boost': True, 'speed': 0.92}
SAMPLE = 'Ahoj Laurinko! Já jsem bobr Bobík. Vyčistíš mi zoubky? Výborně, šikulko, zoubky jsou krásně čisté!'


def key():
    for line in KEYFILE.read_text().splitlines():
        if line.startswith('ELEVENLABS_API_KEY='):
            k = line.split('=', 1)[1].strip()
            if k and k != 'VLOZ_TOKEN_SEM':
                return k
    sys.exit('Chybí klíč v ' + str(KEYFILE))


def api(path, body=None, method=None, raw=False):
    req = urllib.request.Request('https://api.elevenlabs.io' + path, method=method or ('POST' if body is not None else 'GET'),
                                 data=json.dumps(body).encode() if body is not None else None,
                                 headers={'xi-api-key': key(), 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' if raw else 'application/json'})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                data = r.read()
                return data if raw else json.loads(data)
        except urllib.error.HTTPError as e:
            msg = e.read().decode('utf-8', 'replace')[:300]
            if e.code in (429, 500, 502, 503) and attempt < 4:
                time.sleep(3 * (attempt + 1)); continue
            sys.exit(f'ElevenLabs {e.code}: {msg}')


def tts(voice_id, text):
    return api(f'/v1/text-to-speech/{voice_id}?output_format=mp3_44100_96', {'text': text, 'model_id': MODEL, 'voice_settings': SETTINGS}, raw=True)


def phrases():
    from playwright.async_api import async_playwright
    async def run():
        async with async_playwright() as p:
            b = await p.chromium.launch(); pg = await b.new_page()
            await pg.goto((ASSETS / 'index.html').as_uri()); await pg.wait_for_timeout(500)
            out = await pg.evaluate('allPhrases()'); await b.close(); return out
    return asyncio.run(run())


def cmd_hlasy():
    seen = []
    for gender in ('female', 'male'):
        r = api(f'/v1/shared-voices?page_size=40&language=cs&gender={gender}&sort=usage_character_count_1y')
        for v in r.get('voices', []):
            seen.append(v)
            print(f"{gender:6} {v['voice_id']}  {v.get('public_owner_id','')}  {v.get('name','')[:30]:30} {v.get('age','')[:10]:10} {v.get('use_case','')[:16]:16} {(v.get('description') or '')[:70]}")
    mine = api('/v1/voices')
    print('--- v tvé knihovně:')
    for v in mine.get('voices', []):
        print(f"       {v['voice_id']}  {v.get('name','')[:30]}  {v.get('category','')}")


def ensure_in_library(voice_id):
    mine = {v['voice_id'] for v in api('/v1/voices').get('voices', [])}
    if voice_id in mine:
        return voice_id
    for gender in ('female', 'male'):
        for v in api(f'/v1/shared-voices?page_size=100&language=cs&gender={gender}').get('voices', []):
            if v['voice_id'] == voice_id:
                r = api(f"/v1/voices/add/{v['public_owner_id']}/{voice_id}", {'new_name': 'Zoubky ' + v.get('name', '')[:20]})
                return r.get('voice_id', voice_id)
    return voice_id


def cmd_ukazky(ids):
    d = ROOT / 'ukazky-hlasu'; d.mkdir(exist_ok=True)
    for i, vid in enumerate(ids, 1):
        vid2 = ensure_in_library(vid)
        (d / f'el-{i}-{vid}.mp3').write_bytes(tts(vid2, SAMPLE))
        print('ukázka', i, vid)


def cmd_nahraj(voice_id):
    voice_id = ensure_in_library(voice_id)
    VOICE_DIR.mkdir(exist_ok=True)
    texts = phrases()
    manifest, chars = {}, 0
    for t in texts:
        name = hashlib.md5((voice_id + '|' + MODEL + '|' + t).encode()).hexdigest()[:12] + '.mp3'
        f = VOICE_DIR / name
        if not f.exists() or f.stat().st_size < 1000:
            f.write_bytes(tts(voice_id, t)); chars += len(t); time.sleep(0.2)
        manifest[t] = name
    for old in VOICE_DIR.glob('*.mp3'):
        if old.name not in manifest.values():
            old.unlink()
    (VOICE_DIR / 'manifest.js').write_text('window.VOICE = ' + json.dumps(manifest, ensure_ascii=False, indent=0) + ';\n', encoding='utf-8')
    print(f'vět {len(texts)}, nově nahráno znaků {chars}, souborů {len(manifest)}')


if __name__ == '__main__':
    c = sys.argv[1] if len(sys.argv) > 1 else ''
    if c == 'hlasy': cmd_hlasy()
    elif c == 'ukazky': cmd_ukazky(sys.argv[2:])
    elif c == 'nahraj': cmd_nahraj(sys.argv[2])
    else: print(__doc__)
