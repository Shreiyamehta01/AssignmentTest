const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { enqueueJob, getStatusStore } = require('./store');
const {  PRIORITY_MAP } = require('./utils');
const startProcessor = require('./processor');

const app = express();
const PORT = 5000;
app.use(express.json());

// POST /ingest
app.post('/ingest', (req, res) => {
  const { ids, priority } = req.body;

  if (!Array.isArray(ids) || !ids.every(id => Number.isInteger(id) && id >= 1 && id <= 1e9 + 7)) {
    return res.status(400).json({ error: 'Invalid ids' });
  }

  if (!PRIORITY_MAP.hasOwnProperty(priority)) {
    return res.status(400).json({ error: 'Invalid priority' });
  }

  const ingestionId = uuidv4();
  enqueueJob(ids, priority, ingestionId);
  res.json({ ingestion_id: ingestionId });
});

// GET /status/:ingestion_id
app.get('/status/:ingestion_id', (req, res) => {
  const ingestionId = req.params.ingestion_id;
  const status = getStatusStore()[ingestionId];

  if (!status) {
    return res.status(404).json({ error: 'Ingestion ID not found' });
  }
  res.json(status);
});


app.get('/', (req, res) => {
  res.send('Welcome to the Data Ingestion API. Use /ingest and /status/:ingestion_id endpoints.');
});

// Start server and processor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

startProcessor();
