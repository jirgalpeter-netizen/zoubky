# Zoubky – App Store a TestFlight (podklady k vyplnění)

Bundle ID: `cz.petr.zoubky` · aplikace pro iPhone i iPad se sestavuje automaticky na GitHubu (workflow **iOS** v repu `jirgalpeter-netizen/zoubky`) – Mac ani Xcode nejsou potřeba.

## Postup (jednorázově)
1. **Apple Developer Program:** https://developer.apple.com/programs/enroll/ – jako *Individual*, 99 USD ročně, Apple ID s dvoufázovým ověřením; schválení obvykle 1–2 dny.
2. **Bundle ID:** https://developer.apple.com/account/resources/identifiers/add/bundleId → *App IDs → App* → popis *Zoubky*, Explicit `cz.petr.zoubky`.
3. **Záznam aplikace:** https://appstoreconnect.apple.com/apps → **+ Nová aplikace** → iOS, název *Zoubky – čištění zubů*, jazyk čeština, Bundle ID `cz.petr.zoubky`, SKU `zoubky`.
4. **API klíč pro GitHub:** App Store Connect → *Uživatelé a přístup → Integrace → App Store Connect API* → *Vygenerovat klíč*, role **App Manager** → stáhnout `.p8` (jde jen jednou).
5. **Tajemství v GitHubu:** https://github.com/jirgalpeter-netizen/zoubky/settings/secrets/actions → *New repository secret* čtyřikrát:
   - `APPLE_TEAM_ID` – Team ID (developer.apple.com → Membership)
   - `ASC_KEY_ID` – Key ID klíče
   - `ASC_ISSUER_ID` – Issuer ID (nahoře na stránce klíčů)
   - `ASC_KEY_P8` – celý obsah staženého `.p8` souboru
6. **Nahrát:** https://github.com/jirgalpeter-netizen/zoubky/actions/workflows/ios.yml → *Run workflow* → zaškrtnout *Nahrát do TestFlight* → Run. Za ~15 minut je sestavení v App Store Connect.
7. **TestFlight:** interní testeři (až 100 lidí z týmu) hned; externí testeři nebo **veřejný odkaz** po rychlé kontrole Applu. Testeři si nainstalují aplikaci *TestFlight* a pak Zoubky jedním ťuknutím.
8. **App Store:** vyplnit záznam níže → *Přidat k revizi* → *Odeslat ke kontrole*.

## Záznam v App Store
- **Název (30):** Zoubky – čištění zubů · **Podtitul (30):** Hra o čištění zubů pro děti
- **Klíčová slova (100):** zuby,čištění,kartáček,děti,hra,naučná,zubař,pasta,bacil,nálepky,školka,zoubky
- **Popis:** stejný jako pro Google Play (`google-play.md`)
- **Kategorie:** Vzdělávání + **Děti – 5 let a méně** (Kids Category)
- **URL podpory a marketingu:** https://jirgalpeter-netizen.github.io/zoubky/ · **Zásady:** https://jirgalpeter-netizen.github.io/zoubky/soukromi.html
- **Snímky 6,9″:** `appstore/ukazka-1…5.png` (2868×1320, na šířku)
- **Soukromí aplikace (nutriční štítek):** *Data se neshromažďují*.
- **Věkové hodnocení:** vše „Žádné“ → 4+.
- **Šifrování:** v aplikaci nastaveno, že nepoužívá nestandardní šifrování (otázka se nezobrazí).
