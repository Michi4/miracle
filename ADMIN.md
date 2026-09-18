# MIRACLE Admin & Live-Daten — Anleitung für Hannah & Sophie

## Login

- Adresse: **https://miracle.websters.at/#/admin** (Link steht auch ganz unten auf der Seite: „Admin")
- Benutzername + Passwort eingeben. Nach 12 Stunden werdet ihr automatisch ausgeloggt.
- Nach 10 falschen Versuchen sperrt euch die Seite für 15 Minuten (Schutz vor Raten) — einfach warten.

## Gigs verwalten

- **Neuer Gig:** Datum im Format TT.MM.JJJJ (z. B. `23.08.2026`), Ort, Stadt, Notiz, Link (muss mit `https://` beginnen).
- **Bearbeiten/Löschen** direkt in der Liste. Alles ist **sofort live** — kein Warten, kein Neu-Build.
- Vergangene Gigs rutschen automatisch nach unten („Vergangene Auftritte"), der nächste Gig steht automatisch oben + im Ticket.

## Passwort ändern

- Im Admin unten bei „Passwort ändern": aktuelles + neues (mind. 10 Zeichen) + wiederholen.
- Das Start-Passwort bitte **gleich beim ersten Login ändern**.

## Instagram Live-Status

Der Server fragt Instagram ca. **alle 45 Minuten** automatisch ab:

- **Follower- & Post-Zahlen** (@miracleechoes, @hannah_rumetshofer, @sophie.fsdr) sind **immer live** — ganz ohne Einrichtung.
- Auf der Seite steht bei den Reels ein grüner **● LIVE**-Punkt, sobald frische Daten da sind.
- Klappt ein Sync mal nicht (Instagram blockt), bleiben die letzten guten Daten stehen — die Seite fällt auf die gespeicherten Inhalte zurück, nichts geht kaputt.
- Button **„↻ Jetzt syncen"** holt sofort frische Daten.

### Vollautomatische Live-Reels (optional, einmalig ~15 Min. einrichten)

Neue Reels erscheinen **von allein**, sobald ihr den offiziellen Instagram-Zugang verbindet:

1. Instagram-Konto auf **Professional (Creator/Business)** umstellen (in der App: Einstellungen → Kontoart).
2. Auf https://developers.facebook.com eine **App** erstellen (Typ „Business").
3. In der App das Produkt **„Instagram Graph API"** hinzufügen und euer Konto verknüpfen.
4. Unter Tools → **Graph API Explorer**: euer Konto wählen, Rechte `instagram_basic` + `pages_read_engagement`, **Token erzeugen** (langlebiges Token anfordern — ca. 60 Tage gültig, dann erneuern).
5. Eure **User-ID** steht im Explorer (Feld `id` bei Abfrage von `me?fields=id,username`).
6. `IG_ACCESS_TOKEN` und `IG_USER_ID` in `.env.secrets` eintragen + `docker compose up -d miracle-api`.
7. Im Admin-Status steht dann „offizielle API (Reels live)".

Ohne Token: Zahlen live, plus **Reels per Link**: im Admin bei „Reels live bringen" einfach den Instagram-Link eines neuen Posts/Reels einfügen — Text, Bild und Datum werden automatisch übernommen, das Reel steht sofort ganz oben auf der Seite. Löschen geht dort genauso (✕ → Ja).

## Sicherheit (fürs Protokoll)

- Passwörter liegen **nur als bcrypt-Hash (Kostenfaktor 12)** vor — niemals im Klartext, weder in der Datenbank noch in Logs.
- Sessions sind Zufalls-Tokens (32 Byte); gespeichert wird nur deren SHA-256-Hash. Cookie: `HttpOnly` + `Secure` + `SameSite=Lax`, 12 h gültig.
- Jede Admin-Änderung braucht zusätzlich ein **CSRF-Token** pro Session.
- Falsche Logins bekommen immer die gleiche Antwort (kein Raten von Benutzernamen möglich).
- Login ist rate-limitiert (10 Versuche / 15 Min. pro IP), alle Eingaben werden serverseitig validiert (zod).
- Bild-Proxy nur für Instagram-CDNs (Allowlist), keine offene Proxy-Funktion.
- Datenbankdatei (`miracle.json`) liegt auf einem Docker-Volume und hat Modus 0600.
- Kein Content-Security-Policy-Header, weil die Seite viele Inline-Styles nutzt — alle anderen Helmet-Header sind aktiv.
