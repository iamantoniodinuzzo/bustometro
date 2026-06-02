# ✉️ Bustometro

> **Quanto mettere in busta al matrimonio?**
> La formula napoletana di Amedeo Colella, vestita di codice.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Indisparte/bustometro)
![Version](https://img.shields.io/badge/version-1.6.0-7a1f2b?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-b8924f?style=flat-square)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)

---

## ✨ Funzionalità

- 📬 **Calcolo preciso** basato su parentela, numero di partecipanti e stile di spesa
- 🔮 **Busta 3D interattiva** in Three.js — reagisce al mouse e al touch con parallax
- ✨ **Polvere d'oro** ambientale e coriandoli celebrativi al completamento del calcolo
- 🔢 **Counter animato** con easing cubico sul risultato finale
- 🔗 **Link condivisibile** — URL con stato pre-compilato, copia in un click e feedback visivo
- 🖼️ **Card condivisibile** — genera immagini PNG via Canvas API in formato Story (9:16) e Post (1:1) con download, condivisione WhatsApp e copia negli appunti
- 💍 **Modalità Testimone** — moltiplicatore ×1.3 per chi ha detto sì (al portafogli)
- 👁️ **Modalità Suocera** — nota cosmetica che ricorda che lei lo sa sempre
- 🎭 **Easter egg contestuali** — messaggi umoristici per il tirchio totale, lo squarcione massimo e il range assurdo (>€800)
- 🗺️ **Toggle regionale** — selettore Nord / Centro / Sud che imposta automaticamente il costo coperto e il coefficiente figura in base alle medie regionali italiane
- 📊 **Social proof passiva** — contatore globale buste calcolate nel mese e media anonima per categoria, via Upstash Redis (graceful degradation inclusa)
- 📱 **Mobile-first**, completamente responsive
- ♿ **Accessibile** — rispetta `prefers-reduced-motion`
- 📖 **Crediti completi** all'inventore della formula e allo sviluppatore

---

## 🧮 La formula

```
€ = (B/2 + I) × (C + C×30%) × P × D
```

| Variabile | Significato | Valori |
|-----------|-------------|--------|
| **B** | Numero di bambini | intero ≥ 0 |
| **I** | Numero di adulti | intero ≥ 1 |
| **C** | Costo stimato del coperto | €30 – €200 |
| **P** | Coefficiente parentela | Genitore 2,0 · Fratello/Sorella 1,5 · Cugino 1,2 · Amico 1,0 |
| **D** | Coefficiente "figura" | Massimo 1,5 · Medio 1,3 · Sufficiente 1,2 · Normale 1,0 |

---

## 👑 Crediti formula

La formula è stata ideata da **Amedeo Colella**, scrittore e docente di napoletanità presso la fondazione Humaniter. Pubblicata in *Manuale di filosofia napoletana* (Cultura Nova editore, p. 145).

> Nella versione originale napoletana, il coefficiente D si chiama *"squarciunaria"*:
> Squarcione (1,5) · Ngannaruto (1,3) · «Amma fa' 'na bella figura» (1,2) · Normale (1,0)

---

## 👨‍💻 Sviluppatore

Interfaccia progettata e sviluppata da **[Indisparte](https://github.com/Indisparte)**.

---

## 🚀 Avvio locale

Assicurati di avere **Node.js 18+** installato.

```bash
# Clona il repository
git clone https://github.com/Indisparte/bustometro.git
cd bustometro

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

Apri [http://localhost:5173](http://localhost:5173) nel browser.

---

## 📦 Build per produzione

```bash
npm run build
```

La build viene generata nella cartella `dist/`.

---

## 🌐 Deploy su Vercel

**Metodo 1 — Un click:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Indisparte/bustometro)

**Metodo 2 — Manuale:**

1. Fai il push del repository su GitHub
2. Vai su [vercel.com](https://vercel.com) → **New Project** → **Import from GitHub**
3. Seleziona `bustometro`
4. Vercel rileva automaticamente Vite — nessuna configurazione necessaria
5. Clicca **Deploy** ✅

Ogni push su `main` eseguirà un nuovo deploy automaticamente.

---

## 🗂️ Struttura del progetto

```
bustometro/
├── api/
│   └── stats.js              # Vercel Edge Function — social proof stats
├── public/
│   ├── favicon.svg           # Favicon busta con ceralacca
│   └── og-image.png          # Open Graph image 1200×630
├── src/
│   ├── App.jsx               # Componente principale + 3D + animazioni
│   ├── main.jsx              # Entry point React
│   └── index.css             # Reset CSS
├── index.html                # HTML con meta tag SEO e font
├── vite.config.js            # Configurazione Vite
├── package.json
└── .gitignore
```

---

## 🔧 Tecnologie

| Tool | Uso |
|------|-----|
| **React 18** | UI framework |
| **Three.js r128** | Busta 3D e rendering WebGL |
| **Vite 5** | Build tool e dev server |
| **Lucide React** | Icone |
| **Fraunces** | Font display (Google Fonts) |
| **DM Sans** | Font body (Google Fonts) |
| **Canvas 2D API** | Polvere d'oro, coriandoli e generazione card PNG |
| **Web Share API** | Condivisione nativa su mobile |
| **Clipboard API** | Copia link e immagini |
| **Upstash Redis** | Storage social proof stats via REST |
| **Vercel Edge Functions** | API `/api/stats` — aggregati anonimi |

---

## 📄 Licenza

Distribuito sotto licenza **MIT**. Libero da usare, modificare e distribuire.
Vedi il file `LICENSE` per i dettagli.

---

## 📎 Riferimenti

- [Resto al Sud — La formula matematica napoletana](https://www.restoalsud.it/primo-piano/quanto-mettere-nella-busta-del-matrimonio-lo-svela-una-formula-matematica-napoletana/)
- [Sfilate — Il calcolo esatto](https://www.sfilate.it/376460/sposi-non-sai-quanto-mettere-nella-busta-il-calcolo-esatto-per-evitare-figuracce/)
- [Trend Online — Quanto regalare al matrimonio](https://www.trend-online.com/lusso/matrimonio-quanto-regalare-soldi-busta/)

---

<div align="center">
  <sub>Formula © Amedeo Colella · Interfaccia con ♥ da <a href="https://github.com/Indisparte">Indisparte</a></sub>
</div>
