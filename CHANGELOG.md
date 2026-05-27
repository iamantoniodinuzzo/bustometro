# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2026-05-27

### Added
- **Modalità Testimone** — toggle opzionale nella sezione parentela che applica un moltiplicatore ×1.3 sul totale (componibile con P e D). Label: *"Hai detto sì. Anche al portafogli."* Il fattore appare nel breakdown espandibile.
- **Modalità Suocera** — toggle cosmetico nella sezione figura. Non altera il calcolo; mostra la nota *"Tua suocera sa già quanto hai messo. Lo sa."* sotto il risultato.
- **Propagazione URL** — i toggle Testimone e Suocera si serializzano nei parametri `?t=1` e `?s=1` del link condivisibile, ricostruendo lo stato completo all'apertura.
- **Badge sulla share card** — la card PNG (Story e Post) mostra il badge "💍 Testimone" sopra la cifra e la nota "👁️ Tua suocera lo sa" nel footer quando i rispettivi toggle sono attivi.
- **Easter egg e messaggi contestuali** — sistema di messaggi umoristici con priorità singola sotto il risultato:
  - *Squarcione massimo* (Genitore + Massimo + ≥3 adulti): *"Gli sposi ti vogliono come padrino di battesimo del primo figlio."*
  - *Range assurdo* (risultato >€800): *"A questo punto compragli anche la casa."*
  - *Tirchio totale* (Amico + Normale + 1 adulto + 0 bambini + coperto ≤€50): *"Vabbè dai, almeno gli auguri sinceri 💀"*

## [1.4.0] - 2026-05-24

### Added
- **Link condivisibile** — URL con query string (`?p=&i=&b=&c=&d=`) che pre-compila lo stato del calcolatore; pulsante "Copia link" con feedback toast nella schermata risultato.
- **Card risultato condivisibile** — generazione client-side via Canvas API in due formati: Story 1080×1920 (Instagram) e Post 1080×1080 (WhatsApp). La card include cifra, range, nome sposi opzionale, URL e firma Indisparte.
- **Azioni di condivisione** — Download PNG, condivisione WhatsApp via deep link `wa.me`, copia immagine negli appunti (Clipboard API), Web Share API nativa dove supportata.
- **Open Graph ottimizzati** — `og:image` statica 1200×630, `og:url`, `og:title` completo, `twitter:card` aggiornata a `summary_large_image`.

## [1.3.1] - 2026-05-20

### Fixed
- Fixed Vercel Analytics integration by using the correct React package.
- Updated author information and profile links in footer.

### Added
- Integrated Vercel Analytics for tracking.

## [1.3.0] - 2024-05-20

### Added
- Initial release with 3D Three.js interaction, gold dust, confetti, and micro-animations.
