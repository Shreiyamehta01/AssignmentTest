const { getJobQueue, setJobQueue, updateBatchStatus } = require('./store');
const { sleep, PRIORITY_MAP } = require('./utils');

async function mockExternalAPI(id) {
  await sleep(1000); // simulate 1s delay per ID
  return { id, data: 'processed' };
}

async function processBatch(batch) {
  console.log(`Processing batch ${batch.batch_id} with ids [${batch.ids.join(', ')}]`);
  updateBatchStatus(batch.batch_id, batch.ingestion_id, 'triggered');

  const results = await Promise.all(batch.ids.map(id => mockExternalAPI(id)));
  console.log(`Completed batch ${batch.batch_id}:`, results);
  updateBatchStatus(batch.batch_id, batch.ingestion_id, 'completed');
}

function sortQueue(queue) {
  return queue.sort((a, b) => {
    if (PRIORITY_MAP[a.priority] !== PRIORITY_MAP[b.priority]) {
      return PRIORITY_MAP[a.priority] - PRIORITY_MAP[b.priority];
    }
    return a.created_time - b.created_time;
  });
}

async function startProcessor() {
  setInterval(async () => {
    let queue = getJobQueue();
    if (!queue.length) return;

    queue = sortQueue(queue);
    const batch = queue.shift();
    setJobQueue(queue);

    await processBatch(batch);
  }, 5000); // 1 batch per 5 seconds
}

module.exports = startProcessor;
