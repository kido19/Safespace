import { supabase } from "../../../lib/supabase";
import { supabaseAdmin } from "../../../lib/supabase-admin";
import { rateLimit, ipOf } from "../../../lib/rate-limit";
import { isCrisis } from "../../../lib/crisis-keywords";

export default async function handler(req, res) {
  // GET — list feed
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("feed_posts")
      .select("*")
      .limit(50);
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  // POST — create post
  if (req.method === "POST") {
    if (!rateLimit(ipOf(req), 5, 60_000)) {
      return res.status(429).json({ error: "too many posts, slow down" });
    }

    const { handle, body } = req.body || {};
    if (!handle || !body || body.length > 300) {
      return res.status(400).json({ error: "invalid payload" });
    }

    const crisis = isCrisis(body);

    // Insert WITHOUT selecting the result back (avoids RLS read issues)
    const { error: insertError } = await supabaseAdmin
      .from("posts")
      .insert({ handle, body, flagged: crisis });

    if (insertError) return res.status(500).json({ error: insertError.message });

    // If it's a crisis, we don't need to send the ID back to the frontend
    return res.status(201).json({
      flagged: crisis,
    });
  }

  return res.status(405).json({ error: "method not allowed" });
}