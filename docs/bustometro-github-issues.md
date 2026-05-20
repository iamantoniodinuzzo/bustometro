# Bustometro — GitHub Issues

Copia ogni blocco direttamente nel campo "New Issue" su GitHub.
Imposta **Milestone** e **Labels** come indicato per ogni issue.

---

## 🗂️ MILESTONE v1.4 — Viralità core

---

### Issue #1

**Title:** `[FEAT] Genera card risultato condivisibile (WhatsApp / Instagram Story)`

**Labels:** `enhancement` `high-priority` `v1.4`

**Milestone:** `v1.4 – Viralità core`

**Body:**

## 📋 Descrizione

Aggiungere la possibilità di generare e scaricare/condividere un'immagine con il risultato del calcolo, ottimizzata per Instagram Story (1080×1920) e anteprima WhatsApp.

È la feature a più alto impatto virale del progetto: trasforma il tool in **contenuto condivisibile**.

## ✅ Acceptance Criteria

- [ ] Pulsante "Condividi risultato" visibile solo quando `isComplete === true`
- [ ] Generazione immagine client-side via **Canvas API** (nessun backend richiesto)
- [ ] La card include: cifra in grande, range min-max, nome degli sposi (campo opzionale), logo Bustometro + URL, firma `by Indisparte`
- [ ] Formato esportabile: PNG 1080×1920 (Story) e 1080×1080 (Post/WhatsApp)
- [ ] Pulsanti di azione: **Scarica**, **Condividi su WhatsApp** (`wa.me` deep link), **Copia immagine** (Clipboard API)
- [ ] Stile coerente con l'estetica esistente (crema, bordeaux, Fraunces)
- [ ] Fallback testo se Clipboard API non disponibile

## 🔧 Note tecniche

- Usare `canvas.toBlob()` + `navigator.share()` (Web Share API) dove disponibile
- Deep link WhatsApp: `https://wa.me/?text=...` con URL encoded
- Font Fraunces da caricare su canvas via `FontFace` API prima del render

---

### Issue #2

**Title:** `[FEAT] Link condivisibile con scenario pre-compilato`

**Labels:** `enhancement` `high-priority` `v1.4`

**Milestone:** `v1.4 – Viralità core`

**Body:**

## 📋 Descrizione

Permettere di generare un URL che, quando aperto, pre-compila tutti i parametri del calcolatore. Abilita il flusso virale: *"Guarda quanto dice il sito che dovrei mettere alla cognata 👀"*.

## ✅ Acceptance Criteria

- [ ] I parametri del calcolo vengono serializzati come query string: `?p=1.2&i=2&b=0&c=90&d=1.3`
- [ ] All'apertura dell'URL, l'app legge i parametri e pre-compila lo stato
- [ ] Pulsante "Copia link" nella schermata risultato
- [ ] URL rimane leggibile e condivisibile (< 200 caratteri)
- [ ] Se i parametri mancano o sono invalidi, l'app si avvia normalmente senza errori
- [ ] Feedback visivo "Link copiato!" dopo il click (toast o mini-animazione)

## 🔧 Note tecniche

- Usare `URLSearchParams` per serializzare/deserializzare
- `useEffect` su mount che legge `window.location.search` e popola lo stato
- Nessun backend, tutto client-side

---

### Issue #3

**Title:** `[FEAT] Open Graph e meta tag ottimizzati per anteprima link`

**Labels:** `enhancement` `v1.4` `seo`

**Milestone:** `v1.4 – Viralità core`

**Body:**

## 📋 Descrizione

Ottimizzare le anteprime link quando Bustometro viene condiviso su WhatsApp, Telegram, Twitter/X, Facebook e LinkedIn.

## ✅ Acceptance Criteria

- [ ] `og:image` con immagine statica 1200×630 (generata una volta e committata in `/public`)
- [ ] `og:title`: `Bustometro — Quanto mettere in busta al matrimonio?`
- [ ] `og:description`: testo coinvolgente che invita al click
- [ ] `twitter:card`: `summary_large_image`
- [ ] Testato su [opengraph.xyz](https://opengraph.xyz) e WhatsApp link preview
- [ ] Favicon SVG visibile su tutti i browser moderni

---

## 🗂️ MILESTONE v1.5 — Personalità e virality hooks

---

### Issue #4

**Title:** `[FEAT] Easter egg "Modalità Tirchio" e messaggi contestuali`

**Labels:** `enhancement` `fun` `v1.5`

**Milestone:** `v1.5 – Personalità`

**Body:**

## 📋 Descrizione

Aggiungere messaggi scherzosi e Easter egg per rendere l'app memorabile e generare screenshot da condividere.

## ✅ Acceptance Criteria

- [ ] **Tirchio totale**: se `parentela = Amico (1.0)` + `figura = Normale (1.0)` + `adulti = 1` + `bambini = 0` + `coperto ≤ 50` → messaggio speciale: *"Vabbè dai, almeno gli auguri sinceri 💀"*
- [ ] **Squarcione massimo**: se `parentela = Genitore (2.0)` + `figura = Massimo (1.5)` + `adulti ≥ 3` → messaggio: *"Gli sposi ti vogliono come padrino di battesimo del primo figlio."*
- [ ] **Range assurdo**: se risultato > €800 → *"A questo punto compragli anche la casa."*
- [ ] I messaggi appaiono con animazione sotto il range, in tono ironico
- [ ] I messaggi sono progettati per essere **screenshot-friendly**

---

### Issue #5

**Title:** `[FEAT] Modalità Testimone e Modalità Suocera`

**Labels:** `enhancement` `fun` `v1.5`

**Milestone:** `v1.5 – Personalità`

**Body:**

## 📋 Descrizione

Aggiungere due modalità speciali con moltiplicatori dedicati e copy ironica.

## ✅ Acceptance Criteria

**Modalità Testimone**
- [ ] Toggle attivabile nella sezione i. (parentela), separato dalle opzioni standard
- [ ] Applica moltiplicatore `×1.3` aggiuntivo sul totale (si compone con P e D)
- [ ] Label: *"Testimone 💍"* con nota: *"Hai detto sì. Anche al portafogli."*

**Modalità Suocera**
- [ ] Seconda modalità speciale, icona 👁️
- [ ] Non modifica i calcoli ma mostra una nota fissa sotto il risultato: *"Tua suocera sa già quanto hai messo. Lo sa."*
- [ ] Puramente cosmetics/umoristica, massimizza la condivisibilità

- [ ] Entrambe le modalità integrano con la card condivisibile (issue #1)

---

### Issue #6

**Title:** `[FEAT] Feedback audio opzionale sul risultato`

**Labels:** `enhancement` `ux` `v1.5`

**Milestone:** `v1.5 – Personalità`

**Body:**

## 📋 Descrizione

Aggiungere effetti sonori opzionali (opt-in esplicito) che reagiscono all'importo calcolato. Aumenta la memorabilità e il valore TikTok del tool.

## ✅ Acceptance Criteria

- [ ] **Disabilitato di default** — attivabile con toggle 🔊 visibile nella schermata risultato
- [ ] Suono **cha-ching** per importi > €300
- [ ] Suono **neutro** per importi €150–€300
- [ ] Suono **comico** (scrunch di carta) per importi < €100
- [ ] Rispetta `prefers-reduced-motion` (se attivo, nessun audio)
- [ ] Suoni generati via **Web Audio API** (nessun file esterno, zero costi CDN)
- [ ] Volume non invasivo, max 0.4

---

## 🗂️ MILESTONE v1.6 — Social proof e dati

---

### Issue #7

**Title:** `[FEAT] Toggle regionale Nord / Centro / Sud`

**Labels:** `enhancement` `v1.6` `cultural`

**Milestone:** `v1.6 – Social proof`

**Body:**

## 📋 Descrizione

Aggiungere un selettore geografico che aggiusta i valori di default e i coefficienti in base alla regione. Tocca un nervo culturale italiano molto forte → dibattito → condivisioni.

## ✅ Acceptance Criteria

- [ ] Selettore a 3 opzioni nella sezione ii. (partecipanti): **Nord** · **Centro** · **Sud**
- [ ] Default: **Centro** (valore neutro della formula originale)
- [ ] **Nord**: costo coperto default –10%, coefficiente D default = Normale (1.0)
- [ ] **Sud**: costo coperto default +15%, coefficiente D default = Sufficiente (1.2)
- [ ] Nota ironica visibile: *"Le aspettative variano. Come i cognati."*
- [ ] La selezione regionale si riflette nel link pre-compilato (issue #2)
- [ ] Non altera la formula, cambia solo i valori suggeriti di default

---

### Issue #8

**Title:** `[FEAT] Contatore buste calcolate e media per categoria`

**Labels:** `enhancement` `v1.6` `backend-lite`

**Milestone:** `v1.6 – Social proof`

**Body:**

## 📋 Descrizione

Mostrare dati aggregati anonimi per creare social proof passiva: dimostra che il tool è usato e fornisce riferimento contestuale.

## ✅ Acceptance Criteria

- [ ] Contatore globale *"X.XXX buste calcolate questo mese"* visibile in header
- [ ] Sezione opzionale nella schermata risultato: *"La media degli utenti in questa categoria: €Y"*
- [ ] Dati suddivisi per categoria parentela (amici, cugini, fratelli, genitori)
- [ ] Implementato con **Vercel KV** (Redis, piano gratuito)
- [ ] Incremento anonimo — nessun dato personale salvato
- [ ] Aggiornamento dati ogni 5 minuti (cache, non real-time per limitare le chiamate)
- [ ] Graceful degradation: se KV non risponde, i contatori non appaiono

## 🔧 Note tecniche

- Vercel KV gratuito: 30.000 req/mese, 256MB storage
- Endpoint: Vercel Edge Function `/api/stats`
- Payload: `{ category: "amico", amount: 180 }` — nessun IP, nessun timestamp

---

## 🗂️ MILESTONE v2.0 — Crescita organica

---

### Issue #9

**Title:** `[FEAT] PWA installabile (manifest + service worker)`

**Labels:** `enhancement` `v2.0` `pwa`

**Milestone:** `v2.0 – Crescita organica`

**Body:**

## 📋 Descrizione

Rendere Bustometro installabile come app nativa su iOS e Android tramite Progressive Web App. Riduce l'attrito per gli utenti ricorrenti (stagione matrimoniale = più calcoli).

## ✅ Acceptance Criteria

- [ ] `manifest.json` con nome, icone, colori tema (bordeaux `#7A1F2B` + crema)
- [ ] Icone PWA: 192×192 e 512×512 (SVG o PNG)
- [ ] `theme_color: "#7A1F2B"`, `background_color: "#F5EFE4"`
- [ ] Service worker con cache strategy `cache-first` per assets statici
- [ ] Prompt "Aggiungi alla home" attivabile (no auto-prompt invasivo)
- [ ] Funziona offline con l'ultima versione cached
- [ ] Testato su Safari iOS e Chrome Android

---

### Issue #10

**Title:** `[FEAT] "Bustometro Wrapped" — statistiche annuali condivisibili`

**Labels:** `enhancement` `v2.0` `viral` `seasonal`

**Milestone:** `v2.0 – Crescita organica`

**Body:**

## 📋 Descrizione

A dicembre, mostrare un riepilogo dell'anno in stile Spotify Wrapped con i dati aggregati di tutti gli utenti. Contenuto altamente condivisibile con pattern già noto al pubblico.

## ✅ Acceptance Criteria

- [ ] Disponibile solo nel mese di **dicembre** (o attivabile manualmente per test)
- [ ] Dati mostrati: totale buste calcolate nell'anno, regione più generosa, importo medio nazionale, categoria più calcolata, record massimo anonimo
- [ ] Layout a **slide scorribili** (formato Story), animazioni in stile recap
- [ ] Card esportabile come immagine (riusa la logica issue #1)
- [ ] CTA finale: *"Scopri quanto metteresti tu →"* con link all'app
- [ ] Dipende da issue #8 (dati aggregati Vercel KV)

---

### Issue #11

**Title:** `[FEAT] Blog SEO — articoli sul galateo del matrimonio`

**Labels:** `enhancement` `v2.0` `seo` `content`

**Milestone:** `v2.0 – Crescita organica`

**Body:**

## 📋 Descrizione

Aggiungere una sezione blog con articoli SEO-ottimizzati sulle keyword a lungo termine collegate al tema "busta matrimonio". Genera traffico organico continuo.

## ✅ Acceptance Criteria

- [ ] Route `/blog` con lista articoli
- [ ] Articoli in **Markdown** (file `.md` in `/content/blog/`) renderizzati a runtime
- [ ] Minimo 5 articoli al lancio:
  - *"Quanto mettere in busta a un matrimonio di amici"*
  - *"Galateo del testimone: quanto si spende"*
  - *"Busta matrimonio: Nord vs Sud a confronto"*
  - *"Bomboniera o busta: cosa preferiscono gli sposi"*
  - *"Come si calcola il coperto al matrimonio"*
- [ ] Meta title e description personalizzati per ogni articolo
- [ ] Link interno al calcolatore in ogni articolo
- [ ] Sitemap XML generata automaticamente
- [ ] Schema markup `Article` per Google

---

## 📌 Riepilogo Label suggerite

Crea queste label nel tuo repo prima di aprire le issue:

| Label | Colore | Descrizione |
|-------|--------|-------------|
| `enhancement` | `#84b6eb` | Nuova feature |
| `high-priority` | `#e11d48` | Priorità massima |
| `fun` | `#f59e0b` | Feature umoristica/virale |
| `ux` | `#8b5cf6` | Esperienza utente |
| `seo` | `#10b981` | SEO e crescita organica |
| `seasonal` | `#f97316` | Feature stagionale |
| `backend-lite` | `#6366f1` | Richiede Vercel KV / Edge |
| `pwa` | `#0ea5e9` | Progressive Web App |
| `content` | `#14b8a6` | Contenuto editoriale |
| `v1.4` | `#7a1f2b` | Milestone v1.4 |
| `v1.5` | `#7a1f2b` | Milestone v1.5 |
| `v1.6` | `#7a1f2b` | Milestone v1.6 |
| `v2.0` | `#7a1f2b` | Milestone v2.0 |
