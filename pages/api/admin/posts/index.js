import { supabaseAdmin } from "../../../../lib/supabase-admin";
import { requireAdmin } from "../../../../lib/admin-auth";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const status = req.query.status || "flagged";

  if (status === "flagged") {
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .eq("flagged", true)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  return res.status(400).json({ error: "invalid status" });
}