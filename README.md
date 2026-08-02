# Interactive Steam Deck Portfolio

3D Steam Deck portfolio shell — React + Vite + react-three-fiber. **About Me** embeds the live site at [jzl-seven.vercel.app](https://jzl-seven.vercel.app/) (services, projects, contact, and product story).

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Portfolio content

- **About Me** on the Deck screen loads [https://jzl-seven.vercel.app/](https://jzl-seven.vercel.app/) in an iframe.
- **Games** — native Deck Snake plus embedded free-to-play titles.

## Wiring notes

- Interaction state lives in `src/store/deckStore.ts`.
- `ScreenOverlay.tsx` renders React UI on the 3D Screen mesh via drei `<Html transform>`.
- Menu items are defined in `src/data/menuItems.ts`.

## Blender / model export

Rename interactive meshes before export (`Btn_A`, `Joystick_L`, `D_Pad_Up`, etc.). Export glTF to `public/models/SteamDeck/`.

## E2E tests

```bash
npm run test:e2e
```
