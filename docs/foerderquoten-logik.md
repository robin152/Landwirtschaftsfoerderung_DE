# Förderquoten-Logik: Regional-Förderung 2026

> **Single Source of Truth** für die Berechnungslogik der Förderquoten.
> Letzte Aktualisierung: 2026-02-19

---

## 1. Fördergebiet-Typen (Förderstatus 2022-2027)

| Code | Bezeichnung | Beschreibung |
|------|-------------|--------------|
| **N** | Kein Fördergebiet | Wirtschaftsstarke Regionen (z.B. München, Stuttgart, Frankfurt) |
| **C** | C-Fördergebiet | Strukturschwache Regionen (z.B. Ruhrgebiet, Ostdeutschland) |
| **C+** | C-Fördergebiet mit Grenzzuschlag | C-Gebiet mit +10 PP Grenzzuschlag gem. Rn. 184 Regionalbeihilfeleitlinien |
| **D** | D-Fördergebiet | Übergangsgebiete mit leichter Strukturschwäche |

---

## 2. Förderquoten Pfad A: Regionale Investitionsbeihilfe (Art. 14/17 AGVO)

### N (Kein Fördergebiet)
- **Kein Pfad A möglich** (keine regionale Investitionsbeihilfe)
- Pfad B/C1/C2 gelten gebietsunabhängig

### C-Gebiet Typ a (Basis)
| Größe | Quote |
|-------|-------|
| KU (Kleinunternehmen) | 35% |
| MU (Mittleres Unternehmen) | 25% |
| GU (Großunternehmen) | 15% |

### C-Gebiet Typ b (Basis)
| Größe | Quote |
|-------|-------|
| KU | 30% |
| MU | 20% |
| GU | 10% |

### C-Gebiet mit Bevölkerungsrückgang
- Jeweiliger C-Satz + **5 Prozentpunkte**
- Beispiel Typ a: KU 40%, MU 30%, GU 20%

### C+ Gebiet (Grenzzuschlag gem. Rn. 184 Regionalbeihilfeleitlinien)
- Jeweiliger C-Satz + **10 Prozentpunkte**
- Begrenzt durch max. 15 PP Abstand zum A-Gebiet
- Typische Werte (Typ a Basis):

| Größe | Quote |
|-------|-------|
| KU | 45% |
| MU | 35% |
| GU | 25% |

### D-Gebiet
| Größe | Quote (Art. 17 Basis) | Quote mit De-minimis (+20 PP) |
|-------|----------------------|-------------------------------|
| KU | 20% | 50% (max. Invest 600k) |
| MU | 10% | 40% (max. Invest 750k) |
| GU | 0% (nur De-minimis/Sonderprogramme) | 30% (max. Invest 1.000k) |

**De-minimis-Regelung bei D-Gebieten:**
- +20 PP Spielraum gegenüber C(b)
- Max. 300.000 EUR über 3 Jahre rollierend
- Investitionsobergrenzen: KU 600k, MU 750k, GU 1.000k

---

## 3. Förderquoten Pfad B: Erneuerbare Energie (Art. 41 AGVO)

**GEBIETSUNABHÄNGIG** -- gilt in C-, C+-, D-Gebieten und Nicht-Fördergebieten identisch.
**KEIN** zusätzlicher C-Gebiets-Bonus!

### Energieerzeugung (PV, Wind, Wärmepumpen)
| Größe | Quote |
|-------|-------|
| KU | 65% (45% Basis + 20% KMU-Aufschlag) |
| MU | 55% (45% + 10%) |
| GU | 45% |

### Stromspeicher (mind. 75% aus EE)
| Größe | Quote |
|-------|-------|
| KU | 50% (30% Basis + 20%) |
| MU | 40% (30% + 10%) |
| GU | 30% |

---

## 4. Förderquoten Pfad C1: Umweltschutz (Art. 36 AGVO)

Basis: 40%, +20% für Klein, +10% für Mittel
**C/C+-Gebiets-Bonus: +5%** (C+ ist ein C-Gebiet)

| Größe | Ohne C-Bonus | Mit C/C+-Bonus |
|-------|-------------|----------------|
| KU | 60% | 65% |
| MU | 50% | 55% |
| GU | 40% | 45% |

**NUR Mehrkosten** gegenüber Standardinvestition förderfähig!

---

## 5. Förderquoten Pfad C2: Energieeffizienz (Art. 38 AGVO)

Basis: 30%, +20% für Klein, +10% für Mittel
**C/C+-Gebiets-Bonus: +5%** (C+ ist ein C-Gebiet)

| Größe | Ohne C-Bonus | Mit C/C+-Bonus |
|-------|-------------|----------------|
| KU | 50% | 55% |
| MU | 40% | 45% |
| GU | 30% | 35% |

**NUR Mehrkosten** gegenüber Standardinvestition förderfähig!

---

## 6. Entscheidungsbaum

```
Investitionsvorhaben eingegeben
  |
  v
Fördergebiet bestimmen (via n8n-Webhook: PLZ -> N/C/C+/D)
  |
  v
Pfad A möglich? (nur C, C+, D)
  |--- Ja -> Regionale Investitionsbeihilfe berechnen
  |--- Nein -> Weiter zu Pfad B
  |
  v
Pfad B: EE-Investition? (gebietsunabhängig)
  |--- Ja -> EE-Quoten anwenden (max. 65%)
  |--- Nein -> Weiter zu Pfad C
  |
  v
Pfad C1: Umweltschutz? / Pfad C2: Energieeffizienz?
  |--- Ja -> C1/C2-Quoten anwenden (mit C-Bonus wenn C/C+)
  |--- Nein -> Sonderfälle prüfen
```

---

## 7. Webhook-Spezifikation

| Parameter | Wert |
|-----------|------|
| **Endpunkt** | `POST https://eskalator-prozesse.app.n8n.cloud/webhook/grw_webpage` |
| **Request-Body** | `{ "PLZ": "45127" }` |
| **Response** | `{ "foerderDetails": { "supabaseExtraction": [{ "foerdergebiet": "C" }] } }` |
| **Timeout** | 10 Sekunden |
| **Fallback bei Fehler** | Code "N" (Standardgebiet, kein Bonus) |

### Mögliche Response-Werte
| Webhook-Code | Interner Wert | UI-Anzeige |
|-------------|---------------|------------|
| `N` | Standardgebiet | Kein Fördergebiet |
| `C` | C-Fördergebiet | C-Fördergebiet |
| `C+` | C-Fördergebiet (Grenzzuschlag) | C-Fördergebiet (Grenzzuschlag) |
| `D` | D-Fördergebiet | D-Fördergebiet |

---

## 8. Mapping-Tabelle: Code -> Regionalbonus

| Code | Pfad A: Regionalbonus (KU Typ a) | Pfad C1/C2: C-Bonus |
|------|----------------------------------|---------------------|
| N | Kein Pfad A | 0% |
| C | Basis: 35% (KU) | +5% |
| C+ | Basis + 10 PP: 45% (KU) | +5% (gleich wie C) |
| D | 20% + 20% De-minimis = 50% (KU) | 0% |

---

## 9. Zusatzboni (separat von Gebietstyp)

| Bonus | Wert | Bedingung |
|-------|------|-----------|
| Bevölkerungsrückgang | +5 PP | Flagge im Calculator (hasBevoelkerungsBonus) |
| A-Angrenzung | Erhöhter GU-Basis | Flagge im Calculator (isAAngrenzend) |

Diese Boni werden im Calculator separat gesetzt und sind unabhängig vom Webhook-Ergebnis.
