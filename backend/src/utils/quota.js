const fetchTimes = new Map();

export function canFetch(symbol, minIntervalMs = 60000) {
  const last = fetchTimes.get(symbol);
  if (!last) return true;
  return Date.now() - last >= minIntervalMs;
}

export function markFetched(symbol) {
  fetchTimes.set(symbol, Date.now());
}

export default { canFetch, markFetched };