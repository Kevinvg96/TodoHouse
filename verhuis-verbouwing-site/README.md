# Verhuis & Verbouwing — checklist met login

Een statische site (te publiceren via GitHub Pages) met echte login voor
jou en Melissa, gedeelde voortgang, en een "wie heeft dit afgevinkt en
wanneer"-registratie per taak.

GitHub Pages kan zelf geen logins of gedeelde data onthouden (het is
pure statische hosting), dus de site gebruikt **Supabase** (gratis tier)
als achterliggende database + login-systeem. De site zelf blijft 100%
statisch en publiceer je gewoon via GitHub Pages zoals gepland.

## Hoe de beveiliging werkt

- De HTML/CSS/JS bestanden zijn publiek zichtbaar zodra ze op GitHub
  Pages staan — dat geldt voor élke statische site.
- De **echte** toegangscontrole zit in de database: enkel wie is
  aangemeld ("authenticated") én voorkomt in de `members`-tabel kan
  taken en afvinkingen lezen of aanpassen (afgedwongen via Row Level
  Security policies, zie `db/01_schema.sql`).
- Zonder geldig account krijg je dus wel de lege inlogpagina te zien,
  maar geen enkel taak- of voortgangsgegeven.

## Stap 1 — Supabase-project aanmaken

1. Ga naar [supabase.com](https://supabase.com) → gratis account → **New project**.
2. Kies een naam (bv. `verhuis-checklist`) en een database-wachtwoord (bewaar dit ergens).
3. Wacht tot het project klaar is (~1-2 min).

## Stap 2 — Database opzetten

1. Ga in het Supabase dashboard naar **SQL Editor**.
2. Plak de inhoud van `db/01_schema.sql`, klik **Run**.
3. Plak daarna de inhoud van `db/02_seed.sql`, klik **Run**.
   → Dit zet alle taken uit de verhuis- en verbouwingslijst al klaar.

## Stap 3 — API-sleutels invullen

1. Ga naar **Project Settings → API**.
2. Kopieer de **Project URL** en de **anon public key**.
3. Open `js/supabase-config.js` en vul beide in:
   ```js
   const SUPABASE_URL = "https://xxxxx.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOi...";
   ```

## Stap 4 — Jou en Melissa toegang geven

1. Publiceer de site eerst (stap 5) of open `index.html` lokaal.
2. Jij en Melissa maken **elk apart** een account aan via
   "Account aanmaken" (e-mail + wachtwoord). Supabase stuurt mogelijk
   een bevestigingsmail — die moet bevestigd worden voor je kan inloggen
   (in Supabase: **Authentication → Providers → Email**, kan je
   "Confirm email" ook uitschakelen voor eigen gebruik).
3. Ga in Supabase naar **Table Editor → members** en voeg voor elk van
   jullie een rij toe:
   - `id`: haal je op via **Authentication → Users** (kopieer het
     User UID van het juiste account)
   - `display_name`: bv. `Kevin` / `Melissa`
   - `initials`: bv. `KVG` / `MV`
4. Pas nu kunnen jullie allebei inloggen en de lijst zien.

> Tip: laat "Enable email signups" in **Authentication → Providers**
> gewoon aan zolang je enkel deze twee accounts aanmaakt — de RLS-policy
> zorgt dat iemand anders die zich zou registreren nog steeds niets kan
> zien totdat jij die persoon manueel in `members` zet.

## Stap 5 — Publiceren via GitHub Pages

1. Maak een nieuwe (privé of publieke) GitHub-repository aan.
2. Upload alle bestanden uit deze map (`index.html`, `app.html`, `css/`,
   `js/` — de `db/` map hoeft niet mee, die is enkel voor jezelf).
3. Ga naar **Settings → Pages**, kies branch `main`, map `/root`, **Save**.
4. Na een minuutje is de site live op `https://jouw-gebruikersnaam.github.io/repo-naam/`.

## Later een taak toevoegen

Onderaan elke categorie op de site staat een invulveld — typ de taak in,
vink "dubbel" aan als zowel jij als Melissa dit apart moeten afhandelen
(zoals bij werkgever/ziekenfonds), en klik **Toevoegen**. Dit verschijnt
meteen voor jullie beiden. Een volledig nieuwe categorie kan via het
veld onderaan de pagina.

## Bestandsoverzicht

```
index.html              Inlogpagina
app.html                De checklist zelf (enkel zichtbaar na inloggen)
css/style.css           Vormgeving
js/supabase-config.js   Jouw Supabase URL + sleutel (stap 3)
js/auth.js              Login/registratie-logica
js/app.js               Checklist-logica (laden, afvinken, toevoegen)
db/01_schema.sql         Tabellen + beveiligingsregels
db/02_seed.sql            Bestaande verhuis- en verbouwingslijst
```
