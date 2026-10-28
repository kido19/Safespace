import { supabase } from "../../../lib/supabase";
import { supabaseAdmin } from "../../../lib/supabase-admin";
import { rateLimit, ipOf } from "../../../lib/rate-limit";
import { isCrisis } from "../../../lib/crisis-keywords";

// Initial seed posts
const SEED_POSTS = [
  {
    id: "seed-1",
    handle: "OceanBreeze_19",
    body: "Finals week is crushing me. My parents keep asking about GPA and I couldn't catch my breath in the library today. Just feeling like I'm not enough.",
    hear: 24,
    alone: 38,
    strength: 15,
    category: "School & Pressure",
    created_at: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    flagged: false,
    hidden: false
  },
  {
    id: "seed-2",
    handle: "MorningFern_73",
    body: "Moved into dorms two months ago and I still eat dinner alone in my room every evening. Seeing everyone laughing in groups in the hallway feels heavy.",
    hear: 42,
    alone: 57,
    strength: 31,
    category: "Loneliness",
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    flagged: false,
    hidden: false
  },
  {
    id: "seed-3",
    handle: "GentleDolphin_08",
    body: "Tried talking to my brother about my anxiety, but he told me to 'just workout and stop thinking so much'. Wish people understood mental health is real.",
    hear: 19,
    alone: 29,
    strength: 44,
    category: "Family Pressure",
    created_at: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    flagged: false,
    hidden: false
  },
  {
    id: "seed-4",
    handle: "CalmOtter_42",
    body: "Passed my final practical today after failing twice before! To anyone struggling: please keep going, your turning point is closer than it feels.",
    hear: 67,
    alone: 12,
    strength: 88,
    category: "Hope & Wins",
    created_at: new Date(Date.now() - 320 * 60 * 1000).toISOString(),
    flagged: false,
    hidden: false
  }
];

// Persistent in-memory post store across session requests
export let inMemoryPosts = [...SEED_POSTS];

export default async function handler(req, res) {
  // GET — List posts
  if (req.method === "GET") {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const { data, error } = await supabase
          .from("feed_posts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        if (!error && data && data.length > 0) {
          return res.json(data);
        }
      }
    } catch (err) {
      console.warn("Supabase fetch fallback to memory store:", err.message);
    }

    // Return in-memory feed (filtering out hidden & flagged posts)
    const publicPosts = inMemoryPosts.filter((p) => !p.hidden && !p.flagged);
    return res.json(publicPosts);
  }

  // POST — Create new confession/post
  if (req.method === "POST") {
    if (!rateLimit(ipOf(req), 20, 60_000)) {
      return res.status(429).json({ error: "Too many posts, please wait a minute." });
    }

    const { handle, body, category } = req.body || {};
    if (!handle || !body || body.length > 300) {
      return res.status(400).json({ error: "Invalid payload. Handle and body required." });
    }

    const crisis = isCrisis(body);
    const newPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      handle,
      body,
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

    return res.status(201).json({
      flagged: crisis,
      post: newPost
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
