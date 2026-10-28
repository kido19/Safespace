// Guard for all /api/admin/* routes.
// Defaults to test123local for local demo if env var ADMIN_PASSWORD is not set.

export function requireAdmin(req, res) {
  const pass = req.headers["x-admin-password"];
  const expected = process.env.ADMIN_PASSWORD || "test123local";

  if (!pass || pass !== expected) {
    res.status(401).json({ error: "unauthorized" });
    return false;
  }

  return true;
}
