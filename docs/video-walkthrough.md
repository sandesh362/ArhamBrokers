# 2–4 minute walkthrough

0:00 — Run `npm run demo`; show the three service logs and dashboard. Point out already-persisted rows after a restart.

0:25 — Open a second browser tab and show its green live connection indicator. Explain that the table is a REST snapshot and WebSocket events are push-only.

0:45 — Click **Start pull**. Show the immediate accepted response in DevTools or `Invoke-RestMethod`; the dashboard remains usable.

1:15 — Show progress advancing and rows appearing without either tab being refreshed. Mention each source request is a bounded pagination request, not a 15-minute HTTP connection.

1:50 — Show completion, then start another pull and explain that the unique source ID makes it idempotent. Briefly show `docs/architecture.md`.

2:20 — Explain demo mode uses a fast duration. For the real timing demonstration, set `MOCK_TOTAL_DELAY_MS=900000`; it distributes delay across pages while each request stays under 30 seconds.
