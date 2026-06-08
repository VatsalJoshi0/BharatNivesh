const rateLimitStore = new Map();

export function rateLimit(windowMs = 60000, maxRequests = 100) {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    if (!rateLimitStore.has(key)) rateLimitStore.set(key, []);
    
    const times = rateLimitStore.get(key).filter((t) => now - t < windowMs);
    times.push(now);
    rateLimitStore.set(key, times);

    if (times.length > maxRequests) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    next();
  };
}
