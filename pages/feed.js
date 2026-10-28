import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { Heart } from 'lucide-react';

const SEED_FEED = [
  {
    id: 'post-1',
    handle: 'Starling_17',
    body: "I've been feeling so overwhelmed with school lately. I'm doing my best but it still feels like it's never enough. I'm so tired and I don't know what to do anymore...",
    category: 'School',
    hear: 52,
    alone: 44,
    strength: 32,
    echoesCount: 128,
    repliesCount: 12,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-2',
    handle: 'BrightMoon',
    body: 'Family pressure is so real... sometimes I just wish I could disappear for a little while and catch my breath without someone judging every move.',
    category: 'Family',
    hear: 30,
    alone: 20,
    strength: 14,
    echoesCount: 64,
    repliesCount: 7,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-3',
    handle: 'QuietSun',
    body: 'Late night anxiety hit again. Remind yourselves that it is okay to rest when you are exhausted.',
    category: 'Anxiety',
    hear: 19,
    alone: 25,
    strength: 18,
    echoesCount: 62,
    repliesCount: 4,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

export default function FeedPage() {
  const [posts, setPosts] = useState(SEED_FEED);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    let apiData = [];
    try {
      const res = await fetch('/api/posts');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data)) {
          apiData = data;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch posts from API:', err);
    }

    // Merge locally created user posts from localStorage at the top
    let localUserPosts = [];
    try {
      const localStr = localStorage.getItem('safespace_user_posts');
      if (localStr) {
        const parsed = JSON.parse(localStr);
        if (Array.isArray(parsed)) localUserPosts = parsed;
      }
    } catch (err) {
      console.warn('Failed to parse local user posts:', err);
    }

    // Combine local user posts at top, then API data, then seed feed, deduplicating by ID or body
    const baseList = apiData.length > 0 ? apiData : SEED_FEED;
    const combined = [...localUserPosts];

    baseList.forEach((item) => {
      if (!combined.some((c) => c.id === item.id || (c.body && item.body && c.body.trim() === item.body.trim()))) {
        combined.push(item);
      }
    });

    setPosts(combined);
    setLoading(false);
  };

  const categories = ['All', 'School', 'Anxiety', 'Family', 'Relationships'];

  const filteredPosts = posts.filter((post) => {
    if (filter === 'All') return true;
    const cat = post.category ? post.category.toLowerCase() : '';
    const f = filter.toLowerCase();
    if (f === 'school') return cat.includes('school') || cat.includes('exam');
    if (f === 'anxiety') return cat.includes('anxiety') || cat.includes('overwhelm') || cat.includes('vent');
    if (f === 'family') return cat.includes('family');
    if (f === 'relationships') return cat.includes('relation');
    return cat.includes(f);
  });

  return (
    <Layout title="SafeSpace">
      <div className="p-4 space-y-4">
        {/* Banner Card */}
        <div className="bg-gradient-to-r from-[#1E2548] via-[#28325E] to-[#1E2548] text-white rounded-[24px] p-5 shadow-sm space-y-1.5 border border-[#2F3A6E]/50">
          <h2 className="text-[17px] font-extrabold tracking-tight text-white flex items-center space-x-1.5">
            <span>Hey there, You're not alone.</span>
            <span>💜</span>
          </h2>
          <p className="text-[12px] text-white/80 font-normal leading-relaxed">
            This is a safe space. Your feelings matter here.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`shrink-0 text-[12px] font-semibold px-4 py-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-[#161C2E] text-white shadow-xs'
                    : 'bg-white text-[#52607B] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Post Feed */}
        <div className="space-y-4 pt-1">
          {loading ? (
            <div className="text-center py-8 space-y-2">
              <div className="w-7 h-7 border-3 border-[#4F65F6] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#667085] font-medium">Loading safe space echoes...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white rounded-[24px] p-8 text-center space-y-2 border border-[#E9EEF5]">
              <Heart className="w-8 h-8 text-[#4F65F6] mx-auto opacity-80" />
              <h3 className="font-bold text-[#101828] text-sm">No echoes in this channel yet</h3>
              <p className="text-xs text-[#667085] max-w-xs mx-auto">
                Be the first to share your feelings. Your words might help someone else feel less alone.
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEchoSuccess={fetchPosts}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
