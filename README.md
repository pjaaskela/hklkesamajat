# HKL-Kesämajat ry — hklkesamajat.fi

Yhteisöllinen kesämaja-alueen verkkopalvelu Lauttasaaressa.

## Sivut

| Tiedosto | Kuvaus |
|---|---|
| `index.html` | Etusivu — roolivalinta, sää, kartta |
| `mokki.html` | Mökkiläinen — kirjautuminen, profiili, vikailmoitukset, tiedotteet |
| `vierailija.html` | Vierailija — sää, kartta, palvelut, uimarannat, AIS-laivat |
| `admin.html` | Hallintapaneeli — asukasrekisteri, mökit, vikat, tiedotteet |
| `tietosuoja.html` | GDPR-tietosuojaseloste |
| `hkl-base.css` | Yhteiset CSS-muuttujat |

## Deploy (cPanel Git)

Sivusto on hostattuna cPanelissa (hklkesamajat.fi). Deploy tapahtuu automaattisesti `.cpanel.yml`-tiedoston kautta kun cPanel vetää uusimman commitin.

### Päivitysprosessi

1. Muokkaa lähdettä Pi:llä (`/home/pjaaskel/web/hklkesamajat-*.html`)
2. Kopioi muutokset repoon nimien muunnoksella:
   ```
   hklkesamajat.html        → index.html
   hklkesamajat-mokki.html  → mokki.html
   hklkesamajat-admin.html  → admin.html
   jne.
   ```
3. Korjaa linkit: `hklkesamajat-X.html` → `X.html`
4. Korjaa API_BASE: `'https://jaaskel.com'` (ei localhost-logiikkaa)
5. Commit + push:
   ```bash
   cd /home/pjaaskel/web/hklkesamajat-fi
   git add -A
   git commit -m "kuvaus"
   git push
   ```
6. cPanel: Git → Pull or Deploy (tai auto-deploy jos konfiguroitu)

### cPanel-asetukset

- **Hosting**: hklkesamajat.fi
- **Käyttäjä**: `hklkesam`
- **Document root**: `/home/hklkesam/public_html/`
- **Repo**: `git@github.com:pjaaskela/hklkesamajat.git`
- **Deploy-tiedosto**: `.cpanel.yml` — kopioi kaikki tiedostot `public_html/`-kansioon

### API

Kaikki API-kutsut menevät osoitteeseen `https://jaaskel.com/api/hkl/...` (backend pyörii Compute5:llä portissa 8060).

## Tiedostonimet: jaaskel.com vs. hklkesamajat.fi

| jaaskel.com | hklkesamajat.fi (repo) |
|---|---|
| `hklkesamajat.html` | `index.html` |
| `hklkesamajat-mokki.html` | `mokki.html` |
| `hklkesamajat-vierailija.html` | `vierailija.html` |
| `hklkesamajat-admin.html` | `admin.html` |
| `hklkesamajat-tietosuoja.html` | `tietosuoja.html` |
