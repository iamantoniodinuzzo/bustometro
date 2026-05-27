# Bustometro — Architecture

Vite 5 + React 18 SPA. No backend, no router. Everything runs client-side.

---

## Folder structure

```
bustometro/
├── public/
│   ├── favicon.svg           # SVG envelope icon
│   └── og-image.png          # Static OG image 1200×630
├── src/
│   ├── App.jsx               # Entire app: hooks, components, logic, styles
│   ├── main.jsx              # React DOM entry point
│   └── index.css             # CSS reset only
├── ai_docs/
│   └── ARCHITECTURE.md       # This file
├── index.html                # HTML shell, SEO meta, OG tags, Google Fonts
├── vite.config.js            # Vite + React plugin config
├── package.json
├── CHANGELOG.md
├── README.md
└── CLAUDE.md
```

### `src/App.jsx` internal structure (single file, ~950 lines)

| Section | What it contains |
|---------|-----------------|
| **Hooks** | `useCountUp`, `usePrefersReducedMotion` |
| **Atmosphere** | Canvas 2D particle system — gold dust + confetti burst |
| **Envelope3D** | Three.js 3D envelope with mouse parallax and flap animation |
| **Bustometro** | Main component — all state, form logic, Canvas card generation, share actions |

---

## Dependency graph

```mermaid
graph TD
    index.html -->|module| main.jsx
    main.jsx -->|renders| App.jsx

    App.jsx --> React["React 18\nuseState · useEffect · useRef"]
    App.jsx --> Three["three.js r128\n3D envelope WebGL"]
    App.jsx --> Lucide["lucide-react\nIcons"]
    App.jsx --> Analytics["@vercel/analytics\nPage view tracking"]

    App.jsx --> Canvas2D["Canvas 2D API\nGold dust · Confetti\nShare card PNG"]
    App.jsx --> WebShare["Web Share API\nnative share sheet"]
    App.jsx --> ClipboardAPI["Clipboard API\ncopy link · copy image"]
    App.jsx --> URLSearchParams["URLSearchParams\nshareable URL state"]

    index.html --> GoogleFonts["Google Fonts CDN\nFraunces · DM Sans"]
    App.jsx --> GoogleFonts
```

---

## State (Bustometro component)

| State | Type | Description |
|-------|------|-------------|
| `parentela` | `number \| null` | Relationship coefficient (P): 2.0 · 1.5 · 1.2 · 1.0 |
| `adulti` | `number` | Adults count (I), default 1 |
| `bambini` | `number` | Children count (B), default 0 |
| `costoCoperto` | `number` | Cover cost estimate (C), default €80 |
| `figura` | `number \| null` | Style coefficient (D): 1.5 · 1.3 · 1.2 · 1.0 |
| `nomineSposi` | `string` | Optional couple name for share card |
| `cardFormat` | `'story' \| 'post'` | Canvas export format |
| `testimone` | `boolean` | Witness mode — applies ×1.3 multiplier on total (default `false`) |
| `suocera` | `boolean` | Mother-in-law mode — cosmetic note, no calculation change (default `false`) |

`isComplete = parentela !== null && figura !== null`

---

## Shareable URL params

```
?p=<parentela>&i=<adulti>&b=<bambini>&c=<costoCoperto>&d=<figura>[&t=1][&s=1]
```

Example: `?p=1.2&i=2&b=1&c=120&d=1.3&t=1`

| Param | Description |
|-------|-------------|
| `p` | Parentela coefficient |
| `i` | Adults count |
| `b` | Children count |
| `c` | Cover cost |
| `d` | Figura coefficient |
| `t` | `1` if Testimone mode active (omitted when false) |
| `s` | `1` if Suocera mode active (omitted when false) |
