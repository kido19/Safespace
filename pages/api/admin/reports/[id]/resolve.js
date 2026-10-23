import { supabaseAdmin } from "../../../../../lib/supabase-admin";
import { requireAdmin } from "../../../../../lib/admin-auth";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  const { id } = req.query;
  const { error } = await supabaseAdmin.from("reports").update({ resolved: true }).eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ ok: true, id });
}