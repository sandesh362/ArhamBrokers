# BSE Trades Dashboard

Local, production-minded assessment project: a deterministic mock BSE feed, an Express/SQLite ingestion service, and a React operations dashboard with WebSocket updates. A dashboard remains responsive while a durable background job retrieves exchange pages.

## Prerequisites and install (PowerShell)

```powershell
Copy-Item .env.example .env
npm run install:all
npm run dev
```

Open `http://localhost:5173`. The application API is `http://localhost:4000/api`, mock exchange is `http://localhost:4001`, and live events use `ws://localhost:4000/ws`.

Run services individually with `npm --prefix mock-bse-api run dev`, `npm --prefix server run dev`, and `npm --prefix client run dev`. `npm run demo` starts a fast 1.5-second source simulation. Build with `npm run build`; test with `npm test`; lint with `npm run lint`. `npm --prefix server run reset-db` safely removes only the configured local database.

## API

`GET /getTrades?limit=100&offset=0` returns stable seeded rows and `{ pagination: { limit, offset, total, returned, hasMore, nextOffset } }`. `GET /health` is the mock health check.

The backend provides `GET /api/health`, `GET /api/trades?limit=20&offset=0&symbol=TCS`, `GET /api/trades/:tradeId`, `POST /api/pulls`, `GET /api/pulls`, `GET /api/pulls/:id`, and `POST /api/pulls/:id/retry`. Starting a pull returns `202` immediately:

```json
{"jobId":"uuid","status":"queued","message":"Trade pull accepted"}
```

The worker persists each batch transactionally then broadcasts `{type,eventId,timestamp,data}` events: `connected`, `pull:started`, `trades:batch`, `pull:progress`, `pull:completed`, and `pull:failed`. Source IDs have a SQLite unique constraint; reruns and retrying committed pages do not duplicate rows. Job offsets survive normal server restarts and queued/running jobs resume on startup.

## Configuration

Copy `.env.example` to `.env` at repository root before starting. It documents ports, database path, allowed origin, source size/page size, simulation duration, worker batch delay, request timeout, and retry policy. Default seed count is 3,000. `MOCK_TOTAL_DELAY_MS=900000` requests the 15-minute simulation; the mock calculates per-page delay and rejects an unsafe per-request setting. `PULL_REQUEST_TIMEOUT_MS` must be less than 30,000ms.

## Design and recovery

See [architecture](docs/architecture.md), [testing notes](docs/testing.md), and the [recording script](docs/video-walkthrough.md). The dashboard uses no polling interval. On a WebSocket reconnect it reloads the current server-backed snapshot, which reconciles missed committed rows. The local demo intentionally omits authentication and a persisted event log; see architecture limitations.

## Repository

`mock-bse-api/` is the deterministic exchange; `server/` is REST, SQLite, job worker, and WebSocket hub; `client/` is Vite/React; `docs/` contains architecture, test notes, and walkthrough.
