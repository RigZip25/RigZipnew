# RigZip

A minimal full-stack TypeScript starter and the Cloud Agent development environment for it.

- `server/` — Express + TypeScript JSON API (rig fleet + health endpoints)
- `web/` — React + Vite + TypeScript single-page app that consumes the API

## Requirements

- Node.js >= 20 (developed against Node 22)
- npm (workspaces)

## Getting started

```bash
npm install        # install all workspace dependencies
npm run dev        # start API (:3001) and web (:5173) together
```

Then open http://localhost:5173. The Vite dev server proxies `/api/*` to the
API on port 3001, so the frontend and backend work together out of the box.

## Common commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Run the API and web dev servers concurrently |
| `npm run build` | Type-check and build both workspaces |
| `npm run lint` | Lint both workspaces with ESLint |
| `npm run typecheck` | Type-check both workspaces without emitting |
| `npm run start` | Run the compiled API from `server/dist` |

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Service health probe |
| GET | `/api/rigs` | List rigs |
| POST | `/api/rigs` | Create a rig (`{ name, location, status }`) |

## Cloud Agent environment

`.cursor/environment.json` defines the Cloud Agent environment:

- `install`: `npm ci` (falls back to `npm install`) to refresh dependencies
- `terminals`: long-running `server` and `web` dev servers
- `ports`: exposes `5173` (web) and `3001` (api)
