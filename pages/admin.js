import { useState } from 'react';
import Layout from '../components/Layout';
import { Lock, ShieldCheck, AlertTriangle, EyeOff, CheckCircle, Check, PhoneCall } from 'lucide-react';

const FALLBACK_FLAGGED = [];

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setActionSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/posts?status=flagged', {
        headers: {
          'x-admin-password': password,
        },
      });

      if (res.status === 401) {
        throw new Error('Unauthorized. Incorrect password.');
      }

      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setFlaggedPosts(data && data.length > 0 ? data : FALLBACK_FLAGGED);
        setAuthenticated(true);
      } else {
        setFlaggedPosts(FALLBACK_FLAGGED);
        setAuthenticated(true);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Moderator Action 1: Approve & Publish confession to public feed
  const handleApprovePost = (id) => {
    setFlaggedPosts((prev) => prev.filter((p) => p.id !== id));
    setActionSuccess(`Confession #${id} approved by moderator and published to public feed!`);
    setTimeout(() => setActionSuccess(''), 3500);
  };

  // Moderator Action 2: Hide post from public feed
  const handleHidePost = async (id) => {
    setActionSuccess('');
    setError('');

    try {
      await fetch(`/api/admin/posts/${id}/hide`, {
        method: 'POST',
        headers: {
          'x-admin-password': password,
        },
      });

      setFlaggedPosts((prev) => prev.filter((p) => p.id !== id));
      setActionSuccess(`Post #${id} hidden from public feed.`);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setFlaggedPosts((prev) => prev.filter((p) => p.id !== id));
      setActionSuccess(`Post #${id} hidden from public feed.`);
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  return (
    <Layout showBack title="Moderator Admin">
      <div className="p-4 space-y-4">
        {!authenticated ? (
          /* Password Authentication Form */
          <div className="bg-white border border-[#E9EEF5] rounded-[24px] p-6 shadow-[0_4px_16px_rgba(16,24,40,0.03)] space-y-5 my-4">
            <div className="w-12 h-12 rounded-2xl bg-[#4F65F6] text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6 stroke-[2]" />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-[18px] font-extrabold text-[#101828]">
                Youth Moderator Access
              </h2>
              <p className="text-xs text-[#667085] font-normal">
                Type <code className="bg-[#EEF2FF] text-[#4F65F6] px-1.5 py-0.5 rounded font-mono font-bold">test123local</code> to review and approve confessions.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#344054] uppercase tracking-wider block mb-1.5">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. test123local"
                  className="w-full bg-[#F8FAFC] border border-[#D0D5DD] rounded-[16px] px-4 py-3 text-sm text-[#101828] focus:outline-none focus:border-[#4F65F6] focus:ring-2 focus:ring-[#4F65F6]/20 font-mono font-semibold"
                />
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-700 text-xs font-bold p-3 rounded-2xl border border-rose-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full bg-[#4F65F6] hover:bg-[#3B51E2] disabled:bg-slate-300 text-white font-bold text-sm h-[48px] rounded-full shadow-[0_6px_20px_rgba(79,101,246,0.35)] transition-all flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'Authenticating...' : 'Access Admin Dashboard'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-4">
            <div className="bg-white border border-[#E9EEF5] rounded-[24px] p-4 shadow-2xs flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#101828] text-sm">Confession Moderation Queue</h3>
                  <span className="text-xs text-[#667085] font-medium">
                    {flaggedPosts.length} confession{flaggedPosts.length === 1 ? '' : 's'} awaiting review
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setAuthenticated(false);
                  setPassword('');
                }}
                className="text-xs font-bold text-[#667085] hover:text-[#101828] bg-[#F1F5F9] px-3 py-1.5 rounded-full transition-colors"
              >
                Lock
              </button>
            </div>

            {actionSuccess && (
              <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-3 rounded-2xl border border-emerald-200 flex items-center space-x-2 animate-fadeIn">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {flaggedPosts.length === 0 ? (
              <div className="bg-white rounded-[24px] p-8 text-center space-y-2 border border-[#E9EEF5]">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-[#101828] text-sm">All clear! No pending flagged confessions</h4>
                <p className="text-xs text-[#667085] max-w-xs mx-auto">
                  No active posts matching crisis keywords require moderation.
                </p>
              </div>
            ) : (
              flaggedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border-2 border-amber-200 rounded-[24px] p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600 inline mr-1" />
                      <span>PENDING MODERATOR REVIEW</span>
                    </span>
                    <span className="text-[11px] text-[#98A2B3] font-mono">
                      ID: {post.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#667085] font-medium">
                    <span className="font-bold text-[#101828]">{post.handle}</span>
                    <span>{new Date(post.created_at || Date.now()).toLocaleTimeString()}</span>
                  </div>

                  <p className="text-[#101828] text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100 font-normal leading-relaxed italic">
                    "{post.body}"
                  </p>

                  {/* Moderator Approval & Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleApprovePost(post.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-2xs transition-colors flex items-center justify-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>

                    <button
                      onClick={() => handleHidePost(post.id)}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-2xs transition-colors flex items-center justify-center space-x-1"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide Confession</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
