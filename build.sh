#!/usr/bin/env bash
# Sestaví a podepíše Zoubky.apk bez Gradlu (aapt2 + javac + d8 + apksigner).
set -euo pipefail
cd "$(dirname "$0")"
SDK=${ANDROID_SDK:-/opt/android-sdk}; BT=$SDK/build-tools/35.0.0; PJ=$SDK/platforms/android-35/android.jar
KS=${ZOUBKY_KEYSTORE:-/root/.android-keys/zoubky.jks}; KSPASS_FILE=${KS%.jks}.heslo
VER_CODE=${VER_CODE:-2}; VER_NAME=${VER_NAME:-1.1}
rm -rf build; mkdir -p build/gen build/obj build/dex
"$BT/aapt2" compile --dir res -o build/res.zip
"$BT/aapt2" link -o build/app.unsigned.apk -I "$PJ" --manifest AndroidManifest.xml -A assets \
  --java build/gen build/res.zip --min-sdk-version 24 --target-sdk-version 35 \
  --version-code "$VER_CODE" --version-name "$VER_NAME"
javac -nowarn -source 8 -target 8 -bootclasspath "$PJ" -d build/obj $(find src build/gen -name '*.java') 2>&1 | grep -v 'warning' || true
"$BT/d8" --min-api 24 --lib "$PJ" --output build/dex $(find build/obj -name '*.class')
(cd build/dex && zip -q -j ../app.unsigned.apk classes.dex)
"$BT/zipalign" -f -p 4 build/app.unsigned.apk build/app.aligned.apk
if [ ! -f "$KS" ]; then
  mkdir -p "$(dirname "$KS")"; head -c 24 /dev/urandom | base64 | tr -dc 'A-Za-z0-9' > "$KSPASS_FILE"; echo >> "$KSPASS_FILE"; chmod 600 "$KSPASS_FILE"
  keytool -genkeypair -keystore "$KS" -alias zoubky -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass "$(head -1 "$KSPASS_FILE")" -keypass "$(head -1 "$KSPASS_FILE")" -dname "CN=Zoubky, O=Petr Jirgal, C=CZ" >/dev/null
fi
"$BT/apksigner" sign --ks "$KS" --ks-key-alias zoubky --ks-pass "pass:$(head -1 "$KSPASS_FILE")" --key-pass "pass:$(head -1 "$KSPASS_FILE")" --out Zoubky.apk build/app.aligned.apk
"$BT/apksigner" verify Zoubky.apk && ls -la Zoubky.apk
