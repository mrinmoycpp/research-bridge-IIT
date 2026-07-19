# Anveshan — IIT Research Discovery Platform

A premium, editorial frontend for discovering professors, laboratories, research
areas, publications, and opportunities across the IITs. Built with React,
TypeScript, Tailwind CSS v4, and React Router.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/     Reusable UI (professor rows/cards, IIT cards, filters, nav, states)
  pages/          One file per route (Landing, Discover, ProfessorProfile, IITExplorer, ...)
  layouts/        MainLayout wraps every page with the navbar + footer
  services/       api.ts — the ONLY place that talks to "the backend"
  hooks/          useSaved (workspace/localStorage), useDebounce, useOnDismiss
  types/          Shared TypeScript interfaces (Professor, IIT, ResearchArea, ...)
  data/           Realistic mock data (professors, IITs, research areas, publications, opportunities)
  lib/            Small formatting/utility helpers
```

## Connecting your backend

Every page and component calls functions from `src/services/api.ts` — never
the mock data files directly. Each function already returns a `Promise` with
the exact shape the UI expects (see `src/types/index.ts`), so swapping mock
data for real HTTP calls means rewriting the function bodies in `api.ts`,
for example:

```ts
export async function fetchProfessors(filters, sort) {
  const params = new URLSearchParams({ ...filters, sort });
  const res = await fetch(`/api/professors?${params}`);
  return res.json();
}
```

No component code needs to change as long as the returned shape matches the
types in `src/types/index.ts`.

## Notes

- The "Saved" workspace (bookmarks, notes, compare list) is persisted to
  `localStorage` under the `research-platform:saved` key — replace
  `src/hooks/useSaved.ts` with real API calls once you have user accounts.
- All images are sourced from Unsplash and are safe for prototyping; swap in
  your own institutional photography before shipping to production.
- Global search (Cmd/Ctrl+K) is powered by `fetchSearchSuggestions` in the
  same service layer.
