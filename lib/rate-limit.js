// /lib/rate-limit.js — in-memory limiter, fine for MVP (resets on cold start)
const hits = new Map();

export function rateLimit(key, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) return false;
  arr.push(now);
  hits.set(key, arr);
  return true;
}

export function ipOf(req) {
  return (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
}