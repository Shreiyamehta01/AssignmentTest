const { v4: uuidv4 } = require('uuid');

let jobQueue = []; // Priority Queue
let statusStore = {}; // In-memory status

function enqueueJob(ids, priority, ingestionId) {
  const now = Date.now();
  const batches = [];

  for (let i = 0; i < ids.length; i += 3) {
    const batch = {
      batch_id: uuidv4(),
      ids: ids.slice(i, i + 3),
      ingestion_id: ingestionId,
      priority,
      created_time: now,
      status: 'yet_to_start',
    };
    jobQueue.push(batch);
    batches.push({ batch_id: batch.batch_id, ids: batch.ids, status: 'yet_to_start' });
  }

  statusStore[ingestionId] = {
    ingestion_id: ingestionId,
    status: 'yet_to_start',
    batches,
  };
}

function getJobQueue() {
  return jobQueue;
}

function setJobQueue(newQueue) {
  jobQueue = newQueue;
}

function getStatusStore() {
  return statusStore;
}

function updateBatchStatus(batch_id, ingestion_id, newStatus) {
  const ingestion = statusStore[ingestion_id];
  if (!ingestion) return;
  const batch = ingestion.batches.find(b => b.batch_id === batch_id);
  if (batch) batch.status = newStatus;

  const statuses = ingestion.batches.map(b => b.status);
  if (statuses.every(s => s === 'completed')) ingestion.status = 'completed';
  else if (statuses.some(s => s === 'triggered')) ingestion.status = 'triggered';
  else ingestion.status = 'yet_to_start';
}

module.exports = {
  enqueueJob,
  getJobQueue,
  setJobQueue,
  getStatusStore,
  updateBatchStatus,
};
