# Tree of Growth — Portfolio

Cinematic scroll-driven portfolio for **John Philip Garcia**. The visitor enters a bronze dome, approaches an ancient tree, and discovers six crystals before the spellbook of projects.

## Setup

```bash
cd site
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Deploy on Vercel

- Root directory: `site`
- Framework preset: Vite
- Build command: `npm run build`
- Output: `dist`

SPA routing is handled by `vercel.json`.

## Replace scene images

Plates live in `public/images/` and are referenced from `src/data/assets.ts`. Drop in new WebP files with the same names (`dome-wide.webp`, `tree-close.webp`, `crystal-01.webp`, …) without changing components.

Source Plantarium PNGs can be re-encoded with:

```bash
node scripts/convert-images.mjs
```

## Notes

- Background music is the ethereal fairy-tale track in `public/audio/`. It starts when you enter the journey and stays on unless you mute it.
- The loading seal uses [Magic Ring — Red](https://sketchfab.com/3d-models/magic-ring-red-08b6d10747ae4319a5d6fb1c2a47be92) by Noob Model :D, licensed [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/).
