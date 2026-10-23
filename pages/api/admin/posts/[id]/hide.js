// /pages/api/admin/posts/[id]/hide.js
// POST /api/admin/posts/:id/hide  → sets hidden=true (removed from public feed)

import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "../../../../../lib/admin-auth";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  const { id } = req.query;
  const { error } = await admin.from("posts").update({ hidden: true }).eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ ok: true, id });
}