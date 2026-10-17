# Zoubky – hra pro děti 3–4 roky (Android)

**Stažení do mobilu:** https://github.com/jirgalpeter-netizen/zoubky/releases/latest/download/Zoubky-1.1.apk (veřejné, bez přihlášení)

Naučná hra pro děti 3–4 roky (verze 3.0): na začátku dítě vybere postavičku a jméno, pak putuje Zoubkovou zemí (20 kamarádů – zvířátka, holčička a kluk, Karkulka, vlk, Mařenka a Jeníček, Kocour v botách, panenka, mimozemšťan, dráček).
Bez čtení – vše řídí hlas, obrázky a ukazující ručička.

- **Kolo:** minihry s pastou (výběr kartáčku, odšroubování víčka točením, přiložení / ťukání / vymačkání / držení tuby, zašroubování) → čištění ve vlnách (svačinka, noví bacilové, bacil skočí na obličej, mezizubí nahoru-dolů, zubní kámen, zlatá hvězdička), délka roste od 25 s do 3 minut a hodiny běží jen při drhnutí → jazýček → hrneček prstem k puse → kvíz o zdravém jídle → odměna.
- **Knížka nálepek:** nálepku je třeba odlepit z archu, nalepit, přitlačit prstem (pak drží natrvalo); stránky se listují a dají se vytrhnout za ohnutý roh do koše.
- **Čistíme spolu:** 30 s / 1 / 2 / 3 minuty, rodič může přeskočit čtvrtinu.
- **Hlas:** věty v `assets/js/level.js` (objekt `P`); `hlas.py nahraj VOICE_ID` je nahraje hlasem ElevenLabs do `assets/voice/`, chybějící věty mluví hlas telefonu.
- Hra: `assets/index.html` + `assets/js/*.js` (canvas, vektorově v plném rozlišení), obal: `src/…/MainActivity.java` (WebView, TTS, vibrace, celá obrazovka na šířku).
- **Sestavení:** `./build.sh` (Android SDK v `/opt/android-sdk`, JDK 17, platforma android-35) → `Zoubky.apk`; cíl Android 15 (targetSdk 35), funguje od Androidu 7 – S21 až S24 i novější. Podpisový klíč je mimo git v `/root/.android-keys/` – pro aktualizace stejným klíčem ho nemaž; nová verze = zvyš `VER_CODE`/`VER_NAME` (např. `VER_CODE=3 VER_NAME=1.2 ./build.sh`).
- **Záloha:** veřejné repo https://github.com/jirgalpeter-netizen/zoubky (pracovní kopie na VPS `/root/repos/zoubky`, `gh` na VPS přihlášený). Nová verze: postavit zde, zkopírovat zdroje do repa, push a `gh release create vX.Y Zoubky-X.Y.apk`.
