import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Settings, FileText, Bookmark, HelpCircle, Info, ChevronRight, X, Shield, Check, Trash2, Heart, LogOut, LogIn, Bell, Smile, Frown, Meh, Sparkles, MessageCircle } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [handle, setHandle] = useState('QuietSun');
  const [userPosts, setUserPosts] = useState([]);
  const [savedEchoes, setSavedEchoes] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [wellBeingRating, setWellBeingRating] = useState(null);

  useEffect(() => {
    const savedHandle = localStorage.getItem('safespace_handle');
    if (savedHandle) {
      setHandle(savedHandle);
    }

    const savedPostsStr = localStorage.getItem('safespace_user_posts');
    if (savedPostsStr) {
      try {
        const parsed = JSON.parse(savedPostsStr);
        if (Array.isArray(parsed)) setUserPosts(parsed);
      } catch (err) {}
    }

    const savedEchoesStr = localStorage.getItem('safespace_saved_echoes');
    if (savedEchoesStr) {
      try {
        const parsed = JSON.parse(savedEchoesStr);
        if (Array.isArray(parsed)) setSavedEchoes(parsed);
      } catch (err) {}
    }

    const savedMood = localStorage.getItem('safespace_wellbeing_rating');
    if (savedMood) setWellBeingRating(savedMood);
  }, []);

  const totalEchoesCount = userPosts.reduce((sum, p) => sum + (p.echoesCount || 0), 0);

  const handleMoodSelect = (rating) => {
    setWellBeingRating(rating);
    localStorage.setItem('safespace_wellbeing_rating', rating);
  };

  // Delete user post
  const handleDeleteUserPost = async (postId, postBody) => {
    if (!window.confirm('Are you sure you want to delete this confession?')) return;

    try {
      const updatedPosts = userPosts.filter((p) => p.id !== postId && p.body !== postBody);
      setUserPosts(updatedPosts);
      localStorage.setItem('safespace_user_posts', JSON.stringify(updatedPosts));

      // Send delete request to API
      if (postId) {
        fetch(`/api/posts?id=${postId}`, { method: 'DELETE' }).catch(() => {});
      }
    } catch (err) {
      console.warn('Failed to delete user post:', err);
    }
  };

  const menuItems = [
    { id: 'my-posts', label: 'My Posts & Advice Received', icon: FileText, action: () => setActiveModal('my-posts') },
    { id: 'saved-echoes', label: 'Saved Echoes & Advice', icon: Bookmark, action: () => setActiveModal('saved-echoes') },
    { id: 'notifications', label: 'Support Notifications', icon: Bell, action: () => setActiveModal('notifications') },
    { id: 'settings', label: 'Settings & Handle', icon: Settings, action: () => setActiveModal('settings') },
    { id: 'help', label: 'Help & Support Lines', icon: HelpCircle, action: () => router.push('/resources') },
    { id: 'about', label: 'About SafeSpace', icon: Info, action: () => setActiveModal('about') },
  ];

  return (
    <Layout customHeader showNav>
      {/* Top Header Background & Settings */}
      <div className="bg-[#EBF3FF] pt-4 pb-2 px-6 relative">
        <div className="flex justify-end">
          <button
            onClick={() => setActiveModal('settings')}
            className="w-9 h-9 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-slate-700 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Header Details */}
        <div className="text-center space-y-2 pt-1 pb-4">
          <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto overflow-hidden bg-gradient-to-b from-[#93C5FD] to-[#3B82F6] flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="35" r="14" fill="#FBBF24" />
              <path d="M10 90 L50 40 L90 90 Z" fill="#60A5FA" />
              <path d="M30 90 L65 50 L100 90 Z" fill="#2563EB" opacity="0.9" />
            </svg>
          </div>

          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {handle}
          </h1>
          <p className="text-xs text-slate-500 font-medium flex items-center justify-center space-x-1">
            <Shield className="w-3.5 h-3.5 text-[#4F65F6] inline" />
            <span>Advice Taker • Anonymous Member</span>
          </p>

          {/* Stats Row */}
          <div className="flex items-center justify-around max-w-xs mx-auto pt-3 border-t border-blue-100/60 mt-3">
            <button onClick={() => setActiveModal('my-posts')} className="text-center group">
              <span className="text-base font-extrabold text-slate-900 block leading-tight group-hover:text-[#4F65F6]">
                {userPosts.length}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">My Posts</span>
            </button>
            <button onClick={() => setActiveModal('my-posts')} className="text-center group">
              <span className="text-base font-extrabold text-[#4F65F6] block leading-tight">
                {totalEchoesCount}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Reactions Received</span>
            </button>
            <div className="text-center">
              <span className="text-xs font-extrabold text-[#4F65F6] block leading-tight bg-white px-2 py-0.5 rounded-full border border-blue-200">
                0 Followers
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Zero Popularity Metrics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Separator */}
      <div className="w-full h-8 bg-[#EBF3FF] overflow-hidden -mt-1">
        <svg className="w-full h-full" viewBox="0 0 300 40" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 Q150 40 300 0 L300 40 L0 40 Z" fill="#F4F6FC" />
        </svg>
      </div>

      {/* 3-Month Well-Being Impact Tracker Widget */}
      <div className="p-4 pt-0 space-y-4">
        <div className="bg-white rounded-[22px] p-4 border border-[#E9EEF5] shadow-[0_4px_16px_rgba(16,24,40,0.03)] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-[#4F65F6] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Pilot Impact Study
            </span>
            <span className="text-[11px] text-[#667085] font-medium">Daily Check-In</span>
          </div>

          <h3 className="font-bold text-[#101828] text-[13px]">How supported do you feel today?</h3>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => handleMoodSelect('low')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                wellBeingRating === 'low'
                  ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Frown className="w-4 h-4 mx-auto mb-1 text-rose-500" />
              <span className="text-[11px] block">Overwhelmed</span>
            </button>

            <button
              onClick={() => handleMoodSelect('okay')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                wellBeingRating === 'okay'
                  ? 'bg-amber-50 border-amber-300 text-amber-700 font-bold'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Meh className="w-4 h-4 mx-auto mb-1 text-amber-500" />
              <span className="text-[11px] block">Okay</span>
            </button>

            <button
              onClick={() => handleMoodSelect('supported')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                wellBeingRating === 'supported'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Smile className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
              <span className="text-[11px] block">Supported</span>
            </button>
          </div>

          {wellBeingRating && (
            <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-xl text-center border border-emerald-100">
              ✓ Thank you for checking in! Your peer support data helps measure loneliness reduction.
            </p>
          )}
        </div>

        {/* Menu Items Container */}
        <div className="bg-white rounded-3xl p-2 border border-[#E9EEF5] shadow-[0_4px_16px_rgba(16,24,40,0.03)] divide-y divide-slate-50">
          {menuItems.map((item) => {
            const IconComp = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors rounded-2xl group text-left"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-[#EEF2FF] group-hover:text-[#4F65F6] transition-colors">
                    <IconComp className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            );
          })}
        </div>

        {/* Account Controls */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => router.push('/login')}
            className="flex items-center justify-center space-x-1.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 px-3 rounded-2xl shadow-2xs transition-colors"
          >
            <LogIn className="w-3.5 h-3.5 text-[#4F65F6]" />
            <span>Switch Account</span>
          </button>

          <button
            onClick={() => router.push('/welcome')}
            className="flex items-center justify-center space-x-1.5 bg-[#12172D] hover:bg-[#0B0E17] text-white font-bold text-xs py-3 px-3 rounded-2xl shadow-2xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-[#4F65F6]" />
            <span>Landing Page</span>
          </button>
        </div>
      </div>

      {/* MODAL: My Posts & Advice Received Breakdown with Delete Action */}
      {activeModal === 'my-posts' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-100 relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#4F65F6]" />
                <h3 className="font-extrabold text-slate-900 text-base">My Posts & Reactions</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {userPosts.length === 0 ? (
                <div className="text-center py-6 space-y-2">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No posts shared yet</p>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    You haven't posted anything yet under <span className="font-bold text-[#4F65F6]">{handle}</span>. When you're ready, share what's on your mind!
                  </p>
                </div>
              ) : (
                userPosts.map((p, idx) => (
                  <div key={idx} className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-[#4F65F6] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full">
                        Posted as {p.handle || handle}
                      </span>
                      <button
                        onClick={() => handleDeleteUserPost(p.id, p.body)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center space-x-1 p-1 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete this confession"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 leading-relaxed italic">
                      "{p.body}"
                    </p>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-bold text-[#4F65F6]">
                      <span>{p.echoesCount || 0} Total Echoes Received</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => { setActiveModal(null); router.push('/share'); }}
              className="w-full bg-[#4F65F6] text-white font-bold text-xs py-3 rounded-full shadow-xs shrink-0"
            >
              + Share Another Post
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Saved Echoes */}
      {activeModal === 'saved-echoes' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-100 relative">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">Saved Echoes & Advice</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {savedEchoes.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No saved echoes yet</p>
                <p className="text-[11px] text-slate-400">
                  Tap the <Bookmark className="w-3 h-3 text-[#4F65F6] inline" /> option on any post in the feed to save supportive messages for later.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {savedEchoes.map((e, idx) => (
                  <div key={idx} className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-4 space-y-1">
                    <span className="text-[10px] font-bold text-[#4F65F6]">{e.handle}</span>
                    <p className="text-xs text-slate-800">"{e.body}"</p>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setActiveModal(null)} className="w-full bg-slate-900 text-white font-bold text-xs py-3 rounded-full">
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Notifications */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-100 relative">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">Support Notifications</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              <div className="bg-[#EEF2FF] border border-[#D9E2FE] p-3 rounded-2xl space-y-1 text-xs">
                <div className="flex items-center space-x-1.5 text-[#4F65F6] font-bold">
                  <Heart className="w-3.5 h-3.5 fill-[#4F65F6]" />
                  <span>New Supportive Reactions Received!</span>
                </div>
                <p className="text-slate-700 text-[11.5px]">
                  Peers reacted to your confession with <strong>💜 You matter</strong>, <strong>🌸 Sending love</strong>, and <strong>✨ Stay strong</strong>!
                </p>
              </div>
            </div>

            <button onClick={() => setActiveModal(null)} className="w-full bg-slate-900 text-white font-bold text-xs py-3 rounded-full">
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Settings */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-100 relative">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">Account & Privacy Settings</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <div>
                  <span className="font-bold text-slate-900 block">Current Anonymous Handle</span>
                  <span className="text-slate-500 font-mono">{handle}</span>
                </div>
                <button
                  onClick={() => { setActiveModal(null); router.push('/handle-setup'); }}
                  className="bg-[#4F65F6] text-white font-bold px-3 py-1.5 rounded-xl text-[11px]"
                >
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <div>
                  <span className="font-bold text-slate-900 block">Zero-Trace Data Storage</span>
                  <span className="text-slate-500 text-[11px]">No personal tracking or email stored</span>
                </div>
                <Check className="w-4 h-4 text-emerald-600" />
              </div>

              <button
                onClick={() => {
                  localStorage.clear();
                  setUserPosts([]);
                  setSavedEchoes([]);
                  alert('Session data cleared safely.');
                  router.push('/handle-setup');
                }}
                className="w-full border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold p-3 rounded-2xl flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset Local Session Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: About */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-100 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#4F65F6]" />
                <h3 className="font-extrabold text-slate-900 text-base">About SafeSpace</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>SafeSpace</strong> is an anonymous, youth-centered peer-support app for young people aged 16–24.
              </p>
              <p>
                🔒 <strong>No Popularity Metrics:</strong> No follower counts, likes, or screenshot-shaming.
              </p>
              <p>
                💜 <strong>Peer Validation:</strong> Send and receive supportive "Echoes" like <em>"I hear you"</em> and <em>"You're not alone"</em>.
              </p>
              <p>
                🚨 <strong>Built-in AI Crisis Safety:</strong> Detects crisis language and connects users directly with verified 24/7 emergency hotlines & youth counselors.
              </p>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full bg-[#4F65F6] text-white font-bold text-xs py-3 rounded-full">
              Got it
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
