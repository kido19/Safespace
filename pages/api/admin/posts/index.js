import { supabaseAdmin } from "../../../../lib/supabase-admin";
import { requireAdmin } from "../../../../lib/admin-auth";
import { inMemoryPosts } from "../../posts/index";
import { matchedKeywords } from "../../../../lib/crisis-keywords";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const status = req.query.status || "flagged";

  if (status === "flagged") {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const { data, error } = await supabaseAdmin
          .from("posts")
          .select("*")
          .eq("flagged", true)
          .order("created_at", { ascending: false });

        if (!error && data) return res.json(data);
      }
    } catch (err) {
      console.warn("Supabase admin fetch fallback:", err.message);
    }

    // Return in-memory flagged posts
    const flagged = inMemoryPosts
      .filter((p) => p.flagged)
      .map((p) => ({
        ...p,
        matchedKeywords: matchedKeywords(p.body)
      }));

    return res.json(flagged);
  }

  return res.status(400).json({ error: "Invalid status" });
}
