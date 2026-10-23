// /pages/api/admin/posts/[id]/index.js
// DELETE /api/admin/posts/:id  → permanently removes the post + its echoes + reports

import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "../../../../../lib/admin-auth";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== "DELETE") return res.status(405).json({ error: "method not allowed" });

  const { id } = req.query;
  // echoes/reports cascade via ON DELETE CASCADE in schema — one delete is enough
  const { error } = await admin.from("posts").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ ok: true, id });
}