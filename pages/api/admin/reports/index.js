import { supabaseAdmin } from "../../../../lib/supabase-admin";
import { requireAdmin } from "../../../../lib/admin-auth";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data, error } = await supabaseAdmin
        .from("reports")
        .select("*")
        .eq("resolved", false)
        .order("created_at", { ascending: false });

      if (!error && data) return res.json(data);
    }
  } catch (err) {
    console.warn("Supabase reports fetch fallback:", err.message);
  }

  return res.json([]);
}
