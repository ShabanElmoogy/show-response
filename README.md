# Show Response

Project structure has been organized for a scalable Vite + React + TypeScript app.

## Structure

- public/
  - vite.svg
- src/
  - assets/
    - images/
      - react.svg
  - components/
  - pages/
  - hooks/
  - context/
  - services/
  - utils/
  - styles/
    - globals.css
    - App.css
  - App.tsx
  - main.tsx
- Config: vite.config.ts, tsconfig*.json, eslint.config.js

## Notes
- Global styles moved from `src/index.css` to `src/styles/globals.css` and import updated in `src/main.tsx`.
- App styles consolidated under `src/styles/App.css` and imported in `src/App.tsx`.
- Assets grouped under `src/assets/images`.
- Added empty directories with .gitkeep to guide future code organization.

## Scripts
- npm run dev
- npm run build
- npm run preview
