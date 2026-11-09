# Testing notes

`npm test` runs fast unit coverage for deterministic mock pagination, invalid paging, SQLite idempotency/checkpoints, and worker ordering (persistence before broadcast). Use `npm run demo`, start a pull, and open two browser tabs for the reproducible live WebSocket acceptance check. The mock defaults to 3,000 records and 5 seconds total simulated delay; set `MOCK_TOTAL_DELAY_MS=900000` for the full-duration run.
