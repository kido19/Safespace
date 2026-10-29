# SafeSpace 🫂
**An anonymous, youth-centered peer-support app for mental well-being.**

## 📖 Overview
Young people today face unprecedented levels of stress, anxiety, and loneliness, often compounded by the pressure to curate a "perfect life" on social media. SafeSpace provides a safe, anonymous space where users (ages 16–24) can vent their honest feelings without fear of judgment, screenshot-shaming, or social backlash.

## ✨ Core Features
- **Anonymous Posting:** No emails, no names, no follower counts. Users get a randomized handle (e.g., "CalmOtter42").
- **The Echo System:** Instead of toxic "likes" or "upvotes," users send supportive "Echoes" (I hear you, You're not alone, Sending strength).
- **3-Layer Crisis Safety Net:** 
  1. *Client-side:* Immediate keyword detection before posting.
  2. *API-side:* Server validation flags harmful posts.
  3. *Database-side:* Postgres trigger automatically flags and hides crisis posts from the public feed.
- **Admin Moderation:** A password-protected dashboard for moderators to review flagged/reported posts and hide them if necessary.

## 🛠️ Tech Stack
- **Framework:** Next.js (React)
- **Database:** Supabase (PostgreSQL)
- **Security:** Row Level Security (RLS) policies, Service Role isolation, In-memory rate limiting.
- **Deployment:** Vercel

## 🚀 Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/kido19/Safespace.git
   cd Safespace
2. Install dependencies:
    npm install
3. Create a .env.local file in the root directory and add your Supabase credentials (see .env.example):
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    ADMIN_PASSWORD=your_secure_admin_password
4. Run the development server:
    npm run dev
5. Open http://localhost:3000 in your browser.

.

🛡️ Safety & Moderation Note
SafeSpace is a preventative mental health tool, not a replacement for professional therapy. The crisis trigger is designed to over-detect rather than under-detect, prioritizing user safety by immediately providing localized emergency hotlines (e.g., Ethiopia 907/991) and offering a listening ear.

