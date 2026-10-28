import { supabaseAdmin } from "../../../../../lib/supabase-admin";
import { requireAdmin } from "../../../../../lib/admin-auth";
import { inMemoryPosts } from "../../../posts/index";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { id } = req.query;

  // Hide in local memory store
  const target = inMemoryPosts.find((p) => p.id === id);
  if (target) {
    target.hidden = true;
  }

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      await supabaseAdmin.from("posts").update({ hidden: true }).eq("id", id);
    }
  } catch (err) {
    console.warn("Supabase admin hide fallback:", err.message);
  }

  return res.json({ ok: true, id });
}
