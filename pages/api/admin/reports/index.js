import { supabase } from "../../../lib/supabase";
import { rateLimit, ipOf } from "../../../lib/rate-limit";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });
  if (!rateLimit(ipOf(req), 5, 60_000)) return res.status(429).json({ error: "slow down" });

  const { post_id, reason } = req.body || {};
  if (!post_id) return res.status(400).json({ error: "post_id required" });

  const { error } = await supabase.from("reports").insert({ post_id, reason: reason || null });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ ok: true });
}