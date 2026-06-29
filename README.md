# HKL-Kesämajat ry — hklkesamajat.fi

Yhteisöllinen kesämaja-alueen verkkopalvelu Lauttasaaren Länsiulapanniemellä.

## Sivut

| Tiedosto | Kuvaus |
|---|---|
| `index.html` | Etusivu — roolivalinta, sää, kartta, kannatusmaksu |
| `vierailija.html` | Vierailija — sää, levätilanne, siitepöly, vedenlämpö, mökkikartta, historia, hallitus, asiakirjat (PDF) |
| `mokki.html` | Mökkiläinen — kirjautuminen, profiili, sensorit, sauna (vuorot+laskuri), opas v5, dokumentit, kartta, hallitus, ilmoitukset |
| `admin.html` | Hallintapaneeli — kojelauta, analytiikka, palautteet, asukasrekisteri, mökit, vikat, tiedotteet, dokumentit, ilmoitukset |
| `tietosuoja.html` | GDPR-tietosuojaseloste |
| `hkl-base.css` | Yhteiset CSS-muuttujat |
| `hkl-analytics.js` | Kävijäseuranta + klikkausten seuranta + beta-palauteleima |

## Staattiset tiedostot

| Tiedosto | Kuvaus |
|---|---|
| `mokkikartta.jpg` / `.pdf` | Mökkikartta (alkuperäinen) |
| `historia.pdf` | Historiikki 1932–1992 |
| `yhdistyksen_saannot_2010.pdf` | Yhdistyksen säännöt |
| `jarjestyssaannot.pdf` | Järjestyssäännöt 2014 |
| `rakentamistapaohje.pdf` | Huvimajojen rakentamistapaohje |
| `maalisavyjen_vastaavuudet.pdf` | Maalisävyjen vastaavuudet |
| `hkl-*.jpg` | Hero-kuvat (laituri, ilta, ranta, talvi, uinti jne.) |

## Arkkitehtuuri

```
Selain
  ↓ HTTPS
Cloudflare (hklkesamajat.fi)
  ↓
cPanel (ulkoinen hosting) — staattiset tiedostot
  └── GitHub webhook → auto-deploy git push:sta

Cloudflare (jaaskel.com)
  ↓
Compute5 (.36) — nginx
  ├── Staattiset tiedostot: ~/web/
  └── /api/hkl/* → proxy → Pi (.33):8060
                              ↓
                         hkl_api.py (FastAPI/uvicorn)
                              ↓
                         hkl.db (SQLite)
                         hkl-docs/ (Google Drive sync)
```

## Deploy

### Järjestys: .33 → .36 → git push

1. **Muokkaa .33:lla** (Pi, `/home/pjaaskel/web/hklkesamajat-fi/`)
2. **Kopioi .36:lle** (jaaskel.com):
   ```bash
   # Kopioi ja korjaa linkit jaaskel.com-nimille
   cp hklkesamajat-fi/vierailija.html ~/web/hklkesamajat-vierailija.html
   sed -i 's|href="mokki.html"|href="hklkesamajat-mokki.html"|g' ...
   scp ~/web/hklkesamajat-*.html pjaaskel@192.168.86.36:~/web/
   ```
3. **git push** (hklkesamajat.fi → cPanel auto-deploy):
   ```bash
   cd /home/pjaaskel/web/hklkesamajat-fi
   git add -A && git commit -m "kuvaus" && git push origin main
   ```

### cPanel-asetukset

- **Domain**: hklkesamajat.fi
- **Käyttäjä**: `hklkesam`
- **Document root**: `/home/hklkesam/public_html/`
- **Repo**: `git@github.com:pjaaskela/hklkesamajat.git`
- **Deploy**: `.cpanel.yml` kopioi tiedostot automaattisesti `public_html/`-kansioon

### Tiedostonimet: jaaskel.com vs. hklkesamajat.fi

| jaaskel.com | hklkesamajat.fi (repo) |
|---|---|
| `hklkesamajat.html` | `index.html` |
| `hklkesamajat-mokki.html` | `mokki.html` |
| `hklkesamajat-vierailija.html` | `vierailija.html` |
| `hklkesamajat-admin.html` | `admin.html` |
| `hklkesamajat-tietosuoja.html` | `tietosuoja.html` |

## API (hkl_api.py)

Backend pyörii .33:lla portissa 8060. Kaikki endpointit `/api/hkl/`-polun alla.

### Julkiset endpointit
| Metodi | Polku | Kuvaus |
|---|---|---|
| POST | `/api/hkl/pageview` | Kävijäseuranta |
| POST | `/api/hkl/click` | Klikkausten seuranta |
| POST | `/api/hkl/feedback` | Beta-palaute |
| POST | `/api/hkl/login` | Mökkiläisen kirjautuminen |
| GET | `/api/hkl/announcements` | Tiedotteet |
| GET | `/api/hkl/listings` | Osto/myynti-ilmoitukset |
| GET | `/api/hkl/laituri` | Laiturin lämpötilamittaus |
| GET | `/api/hkl/local-sensor` | Paikallinen ulkomittari |
| GET | `/api/hkl/rss` | Uutiset (RSS) |
| GET | `/api/hkl/vessels` | AIS-laivaliikenne |
| GET | `/api/hkl/health` | Terveystarkistus |

### Autentikoidut (X-Hkl-Token)
| Metodi | Polku | Kuvaus |
|---|---|---|
| GET | `/api/hkl/documents` | Dokumenttilista (roolin mukaan) |
| GET | `/api/hkl/documents/{id}/download` | Dokumentin lataus |
| GET | `/api/hkl/my-cottage` | Oman mökin profiili |

### Admin (X-Api-Key)
| Metodi | Polku | Kuvaus |
|---|---|---|
| GET | `/api/hkl/stats` | Analytiikka (kävijät, sivut, klikit, laitteet) |
| GET | `/api/hkl/feedback` | Palautteet |
| GET | `/api/hkl/visitors` | Kävijälista |
| GET | `/api/hkl/sessions` | Sessiolista |
| POST | `/api/hkl/drive-sync` | Google Drive -synkronointi |
| POST/PUT/DELETE | `/api/hkl/listing/*` | Ilmoitusten hallinta |
| PUT | `/api/hkl/documents/{id}/access` | Dokumentin oikeustaso |

## Tietokanta (hkl.db)

| Taulu | Kuvaus |
|---|---|
| `cottages` | Mökit (8 oikeaa, dummyt poistettu) |
| `sessions` | Kirjautumissessiot |
| `announcements` | Tiedotteet |
| `documents` | Google Drive -dokumentit (access_level: kaikki/asukas/hallitus/admin) |
| `page_views` | Kävijäseuranta |
| `click_events` | Klikkausten seuranta |
| `feedback` | Beta-palautteet |
| `listings` | Osto/myynti-ilmoitukset |
| `laituri_readings` | Laiturin lämpötilamittaukset |
| `fault_reports` | Vikailmoitukset |

## Ulkoiset API:t

- **Open-Meteo** — sää, ennuste, ilmanlaatu, meridata
- **FMI** — vedenpinta, sää (jaaskel.com proxy)
- **UIRAS/FVH** — vedenlämpötilat
- **Google Maps** — kartta etusivulla
- **Google Pollen** — siitepölytiedot
- **HSL Digitransit** — julkinen liikenne
- **SYKE/Algaline** — levätilanne
- **OpenStreetMap/Overpass** — lähipalvelut
- **Google Drive** — dokumenttien synkronointi (Drive sync cron 04:00)
