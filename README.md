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
| `src/data/` | Study content: outline, Notes Check, question bank, sources |
| `public/charts/` | Excerpts of FAA VFR sectional charts (public domain), labeled not for navigation |
| `scripts/icon.svg` | Original app icon; `npm run icons` regenerates icons and splash screens |
| `pave-outline.pdf` | The owner's PAVE study outline (source for the app's structure) |

## Content and sources
- `pave-outline.txt` is the owner's study outline. It is the app's structure (`src/data/outline.ts`).
- `src/data/sources.ts` lists every source and the exact edition used (ACS FAA-S-ACS-6C, PHAK 8083-25C,
  AFH 8083-3C, AWH 8083-28B, RMH 8083-2A, W&B 8083-1B, AIM eff. 9 Jul 2026, eCFR as of 12 Nov 2026,
  Chart Users' Guide 9 Jul 2026, Chart Supplement NW 29 Oct 2026, Seattle sectional 29 Oct 2026,
  1985 Cessna 152 POH, Garmin GTN 650 and GTX 345 pilot's guides).
- `src/data/notes.ts` is the Notes Check (corrections to the outline).
- Question bank (`src/data/bank.ts` combines them): `items.ts` and `scenarios.ts` (hand-written scenarios,
  emergencies, chart questions), `facts.ts` (quick-recall tables; each row becomes a multiple-choice question
  and a flashcard), `wb.ts` (weight & balance problems from the POH sample airplane), `oral.ts`
  (examiner what-if follow-ups), `story.ts` (Flight Story generator with Chart Supplement airport data).
- To add content, add rows or items to these files with citations, then run the citation verifier.
- `scripts/verify-citations.py` checks every citation against locally downloaded source text.

## Copyright rule
This repo is public. Never commit the POH or other copyrighted third-party documents.
FAA publications and charts are public domain. `.gitignore` blocks `sources/private/` and POH PDFs.

## For developers
```
npm install
npm run dev     # local preview
npm run build   # production build into dist/
```
