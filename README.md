# Checkride Trainer

A free, offline study app (PWA) for the FAA Private Pilot (Airplane) oral exam,
built around a PAVE outline, a Cessna 152, and the KHIO / Pacific Northwest area.

**App link:** https://dylwhite.github.io/checkride-trainer/

> Study aid only. Not for navigation. Always defer to current FAA publications
> and the aircraft's POH.

## How it works
- Runs entirely on your phone. Progress is stored on-device (IndexedDB). No accounts, no servers, no paid services.
- Hosted free on GitHub Pages. Every change merged into `main` is rebuilt and published automatically by
  `.github/workflows/deploy.yml`.
- Install on iPhone: open the link in **Safari** → Share button → **Add to Home Screen**.

## Project layout
| Path | What it is |
| --- | --- |
| `src/styles/tokens.css` | Design tokens (all colors, sizes, motion) for dark and light mode |
| `src/screens/` | One file per screen (Today, Question, Progress, Settings…) |
| `src/components/` | Reusable pieces (tab bar, result sheet, icons, readiness ring) |
| `src/data/` | Study content (JSON/TS). Phase 1 holds preview sample data only |
| `scripts/icon.svg` | Original app icon; `npm run icons` regenerates icons and splash screens |
| `pave-outline.pdf` | The owner's PAVE study outline (source for the app's structure) |

## Copyright rule
This repo is public. Never commit the POH or other copyrighted third-party documents.
FAA publications and charts are public domain. `.gitignore` blocks `sources/private/` and POH PDFs.

## For developers
```
npm install
npm run dev     # local preview
npm run build   # production build into dist/
```
