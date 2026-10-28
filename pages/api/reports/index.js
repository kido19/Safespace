import { supabase } from "../../../lib/supabase";
import { rateLimit, ipOf } from "../../../lib/rate-limit";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!rateLimit(ipOf(req), 5, 60_000)) return res.status(429).json({ error: "Slow down" });

  const { post_id, reason } = req.body || {};
  if (!post_id) return res.status(400).json({ error: "post_id required" });

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { error } = await supabase.from("reports").insert({ post_id, reason: reason || null });
      if (error) return res.status(500).json({ error: error.message });
    }
  } catch (err) {
    console.warn("Report insert fallback:", err.message);
  }

  return res.json({ ok: true });
}
