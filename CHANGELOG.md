# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
