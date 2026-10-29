import { supabase } from "../../../lib/supabase";
import { supabaseAdmin } from "../../../lib/supabase-admin";
import { rateLimit, ipOf } from "../../../lib/rate-limit";
import { isCrisis } from "../../../lib/crisis-keywords";

// No default seed posts — community starts clean so user inputs each post fresh
const SEED_POSTS = [];

// Persistent in-memory post store across session requests
export let inMemoryPosts = [...SEED_POSTS];

export default async function handler(req, res) {
  // GET — List public posts (Stripping secret authorToken from public view)
  if (req.method === "GET") {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const { data, error } = await supabase
          .from("feed_posts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        if (!error && data && data.length > 0) {
          const publicData = data.map(({ authorToken, ...rest }) => rest);
          return res.json(publicData);
        }
      }
    } catch (err) {
      console.warn("Supabase fetch fallback to memory store:", err.message);
    }

    // Return in-memory feed without authorToken
    const publicPosts = inMemoryPosts
      .filter((p) => !p.hidden && !p.flagged)
      .map(({ authorToken, ...rest }) => rest);

    return res.json(publicPosts);
  }

  // POST — Create new confession/post
  if (req.method === "POST") {
    if (!rateLimit(ipOf(req), 20, 60_000)) {
      return res.status(429).json({ error: "Too many posts, please wait a minute." });
    }

    const { handle, body, category, hasVoiceNote, audioUrl, audioDuration } = req.body || {};
    if (!handle || !body || body.length > 300) {
      return res.status(400).json({ error: "Invalid payload. Handle and body required." });
    }

    const crisis = isCrisis(body);
    const authorToken = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;

    const newPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      handle,
      body,
      hasVoiceNote: !!hasVoiceNote || !!audioUrl,
      audioUrl: audioUrl || null,
      audioDuration: audioDuration || 0,
      authorToken, // Secret token saved on server
      hear: 0,
      alone: 0,
      strength: 0,
      category: category || "General Vent",
      created_at: new Date().toISOString(),
      flagged: crisis,
      hidden: false
    };

    // Add new post to memory feed
    inMemoryPosts.unshift(newPost);

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        await supabaseAdmin
          .from("posts")
          .insert({
            handle,
            body,
            flagged: crisis,
            category: category || "General Vent"
          });
      }
    } catch (err) {
      console.warn("Supabase insert fallback:", err.message);
    }

    // Return post + authorToken ONLY to the creator
    return res.status(201).json({
      flagged: crisis,
      post: newPost,
      authorToken
    });
  }

  // DELETE — Delete post by ID (Strict authorization: requires secret authorToken OR admin password)
  if (req.method === "DELETE") {
    const id = req.query.id || req.body?.id;
    const requestToken = req.headers["x-author-token"] || req.query.authorToken || req.body?.authorToken;
    const requestHandle = req.headers["x-user-handle"] || req.query.handle || req.body?.handle;
    const adminPass = req.headers["x-admin-password"];
    const isAdmin = adminPass && adminPass === (process.env.ADMIN_PASSWORD || "test123local");

    if (!id) return res.status(400).json({ error: "Post ID required" });

    // Enforce strict permission check for non-admins
    if (!isAdmin) {
      const targetPost = inMemoryPosts.find((p) => p.id === id);

      if (!targetPost) {
        return res.status(403).json({ error: "Forbidden. You are not authorized to delete this post." });
      }

      if (targetPost.authorToken) {
        if (!requestToken || targetPost.authorToken !== requestToken) {
          return res.status(403).json({ error: "Forbidden. Invalid author token. You cannot delete another user's post." });
        }
      } else {
        if (!requestHandle || targetPost.handle !== requestHandle) {
          return res.status(403).json({ error: "Forbidden. You are not authorized to delete this post." });
        }
      }
    }

    // Remove from inMemoryPosts
    inMemoryPosts = inMemoryPosts.filter((p) => p.id !== id);

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        await supabaseAdmin.from("posts").delete().eq("id", id);
      }
    } catch (err) {
      console.warn("Supabase delete fallback:", err.message);
    }

    return res.status(200).json({ ok: true, deletedId: id });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

