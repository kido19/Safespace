import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { Heart, Sparkles, MessageCircle, Shield, Bookmark, Check } from 'lucide-react';

export default function EchoesPage() {
  const [activeTab, setActiveTab] = useState('For You');
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEchoesFeed();

    // Load user's created posts to display in "My Received Echoes"
    try {
      const savedPostsStr = localStorage.getItem('safespace_user_posts');
      if (savedPostsStr) {
        const parsed = JSON.parse(savedPostsStr);
        if (Array.isArray(parsed)) setUserPosts(parsed);
      }
    } catch (err) {}
  }, []);

  const fetchEchoesFeed = async () => {
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
      console.warn('Failed to fetch echoes feed:', err);
    }

    // Load local user posts
    let localUserPosts = [];
    try {
      const localStr = localStorage.getItem('safespace_user_posts');
      if (localStr) {
        const parsed = JSON.parse(localStr);
        if (Array.isArray(parsed)) localUserPosts = parsed;
      }
    } catch (err) {}

    const combined = [...localUserPosts];
    apiData.forEach((item) => {
      if (!combined.some((c) => c.id === item.id || (c.body && item.body && c.body.trim() === item.body.trim()))) {
        combined.push(item);
      }
    });

    setPosts(combined);
    setLoading(false);
  };

  const myHandle = typeof window !== 'undefined' ? localStorage.getItem('safespace_handle') || 'Anonymous' : 'Anonymous';

  return (
    <Layout showBack title="Echoes & Validation">
      <div className="p-4 space-y-4">
        {/* Validation Sanctuary Banner */}
        <div className="bg-gradient-to-r from-[#1E2548] via-[#2A335E] to-[#1E2548] text-white rounded-[24px] p-5 shadow-sm space-y-2 border border-[#2D3A6B]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-[#4F65F6] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Validation Sanctuary
            </span>
            <span className="text-[11px] text-slate-300 font-medium flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400 inline" />
              <span>100% Peer Support</span>
            </span>
          </div>

          <h2 className="text-[16px] font-extrabold text-white tracking-tight leading-snug">
            Send & Receive Emotional Validation
          </h2>
          <p className="text-[12px] text-slate-300 font-normal leading-relaxed">
            Instead of "likes", peers send supportive "Echoes" so everyone feels heard without popularity metrics.
          </p>
        </div>

        {/* Switcher Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#EAEFF7] pb-2 overflow-x-auto no-scrollbar">
          {['For You', 'All Peer Echoes', 'My Received Echoes'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#4F65F6] text-white shadow-xs'
                    : 'bg-white text-[#667085] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* TAB 1 & 2: FOR YOU / ALL PEER ECHOES */}
        {(activeTab === 'For You' || activeTab === 'All Peer Echoes') && (
          <div className="space-y-4 pt-1">
            {loading ? (
              <div className="text-center py-8 space-y-2">
                <div className="w-7 h-7 border-3 border-[#4F65F6] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#667085] font-medium">Loading supportive echoes...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-[24px] p-8 text-center space-y-2 border border-[#E9EEF5]">
                <Sparkles className="w-8 h-8 text-[#4F65F6] mx-auto opacity-80" />
                <h3 className="font-bold text-[#101828] text-sm">No echoes shared yet</h3>
                <p className="text-xs text-[#667085] max-w-xs mx-auto">
                  Be the first to echo support on posts in the feed!
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEchoSuccess={fetchEchoesFeed}
                />
              ))
            )}
          </div>
        )}

        {/* TAB 3: MY RECEIVED ECHOES & VALIDATION */}
        {activeTab === 'My Received Echoes' && (
          <div className="space-y-4 pt-1">
            <div className="bg-white rounded-[24px] p-5 border border-[#E9EEF5] shadow-[0_4px_16px_rgba(16,24,40,0.03)] space-y-3">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-[#4F65F6] fill-[#4F65F6]" />
                <h3 className="font-extrabold text-[#101828] text-[15px]">Reactions Received for {myHandle}</h3>
              </div>

              {userPosts.length === 0 ? (
                <div className="text-center py-6 space-y-2">
                  <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No posts shared yet</p>
                  <p className="text-[11.5px] text-slate-500">
                    When you post a confession or request advice, peer reactions and custom echoes will appear here!
                  </p>
                </div>
              ) : (
                userPosts.map((p, idx) => (
                  <div key={idx} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 space-y-2.5 text-xs">
                    <p className="text-[#101828] font-medium italic">"{p.body}"</p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-200">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                        Support Badges & Reactions Received:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="bg-[#EEF2FF] text-[#4F65F6] text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-[#D9E2FE]">
                          👂 {p.hear || 0} I hear you
                        </span>
                        <span className="bg-[#F5F3FF] text-[#8B5CF6] text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-[#EDE9FE]">
                          🤝 {p.alone || 0} Not alone
                        </span>
                        <span className="bg-[#F0F9FF] text-[#0284C7] text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-[#E0F2FE]">
                          💪 {p.strength || 0} Strength
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
