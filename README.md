# Data Ingestion API

A simple Node.js + Express API system that accepts data ingestion requests, processes IDs asynchronously in batches with priority handling, and enforces rate limiting.

---

## Features

- **POST /ingest** — Submit a list of IDs and a priority (HIGH, MEDIUM, LOW).

  - Processes IDs in batches of 3 asynchronously.
  - Rate limits to 1 batch per 5 seconds.
  - Higher priority batches get processed first.
  - Returns a unique `ingestion_id` immediately.

- **GET /status/:ingestion_id** — Check the status of ingestion request batches.
  - Shows batch statuses: `yet_to_start`, `triggered`, or `completed`.
  - Overall ingestion status reflects the batch states.

---

## Installation

```bash
git clone <repo-url>
cd data-ingestion-api
npm install
```
