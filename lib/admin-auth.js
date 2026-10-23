// /lib/admin-auth.js
// Guard for all /api/admin/* routes.
// The password comes from env var ADMIN_PASSWORD (never hardcoded).

export function requireAdmin(req, res) {
  const pass = req.headers["x-admin-password"];
  const expected = process.env.ADMIN_PASSWORD;

  // If env var is missing, refuse everything (fail closed, never open).
  if (!expected) {
    res.status(500).json({ error: "ADMIN_PASSWORD not configured on server" });
    return false;
  }

  if (!pass || pass !== expected) {
    res.status(401).json({ error: "unauthorized" });
    return false;
  }

  return true;
}