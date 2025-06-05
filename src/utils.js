const PRIORITY_MAP = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  PRIORITY_MAP,
  sleep,
};