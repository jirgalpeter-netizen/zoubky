# Zoubky – hra pro děti 3–4 roky (Android)

Naučná hra: dítě prstem čistí zoubky bobrovi Bobíkovi, medvídkovi Míšovi a kočičce Micce.
Bez čtení – vše řídí český hlas (Android TextToSpeech), obrázky a ukazující ručička.

- **Průběh kola:** pasta na kartáček → drhnutí (špína podle zvířátka: dřevo / med / ryba, bacily praskají) → vypláchnutí vodou → otázka „co je pro zoubky zdravé“ (jablko/mrkev vs. lízátko/čokoláda) → odměna (korunka, konfety, nálepka, hvězda).
- **Album nálepek** (oranžové tlačítko vlevo dole) a **Čistíme spolu** (zelené vpravo dole): 2 minuty skutečného čištění s dítětem, 4 × 30 s po čtvrtinách pusy, hlasové pokyny.
- Hra: `assets/index.html` (canvas, vykresleno vektorově v plném rozlišení S21), obal: `src/…/MainActivity.java` (WebView, TTS, vibrace, celá obrazovka na šířku).
- **Sestavení:** `./build.sh` (Android SDK v `/opt/android-sdk`, JDK 17, platforma android-35) → `Zoubky.apk`; cíl Android 15 (targetSdk 35), funguje od Androidu 7 – S21 až S24 i novější. Podpisový klíč je mimo git v `/root/.android-keys/` – pro aktualizace stejným klíčem ho nemaž; nová verze = zvyš `VER_CODE`/`VER_NAME` (např. `VER_CODE=3 VER_NAME=1.2 ./build.sh`).
