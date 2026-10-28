import { supabaseAdmin } from "../../../lib/supabase-admin";
import { rateLimit, ipOf } from "../../../lib/rate-limit";
import { inMemoryPosts } from "../posts/index";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!rateLimit(ipOf(req), 60, 60_000)) {
    return res.status(429).json({ error: "Too many requests, please slow down" });
  }

  const { post_id, type } = req.body || {};
  if (!post_id || !["hear", "alone", "strength"].includes(type)) {
    return res.status(400).json({ error: "Invalid payload. Required: post_id, type ('hear'|'alone'|'strength')" });
  }

  // Find post in inMemoryPosts and increment the echo count
  const target = inMemoryPosts.find((p) => p.id === post_id);
  if (target) {
    target[type] = (target[type] || 0) + 1;
  }

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data: post, error: fetchErr } = await supabaseAdmin
        .from("posts")
        .select(type)
        .eq("id", post_id)
        .maybeSingle();

      if (!fetchErr && post) {
        const newCount = (post[type] || 0) + 1;
        await supabaseAdmin
          .from("posts")
          .update({ [type]: newCount })
          .eq("id", post_id);
      }
    }
  } catch (err) {
    console.warn("Supabase echo update fallback:", err.message);
  }

  return res.status(200).json({
    ok: true,
    post_id,
    type,
    updatedPost: target || null
  });
}
