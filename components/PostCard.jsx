import { useState, useEffect } from 'react';
import { MoreHorizontal, Heart, MessageCircle, Check, Bookmark, Flag, Copy, Send, X, Plus, Sparkles, ShieldAlert, Trash2 } from 'lucide-react';

export default function PostCard({ post, onEchoSuccess }) {
  const [echoes, setEchoes] = useState({
    hear: post.hear ?? 0,
    alone: post.alone ?? 0,
    strength: post.strength ?? 0,
    matter: post.matter ?? 0,
    love: post.love ?? 0,
    custom: post.custom ?? 0,
  });

  const [activeEchoes, setActiveEchoes] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayTime, setDisplayTime] = useState('Just now');
  const [toastMsg, setToastMsg] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [myHandle, setMyHandle] = useState('');

  // Dropdown options menu state (...)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // Custom Emoji Reaction Picker state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [customReactions, setCustomReactions] = useState([]);

  // Interactive Report Reason Modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  // Replies / Comments state per post ID
  const [showRepliesModal, setShowRepliesModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [repliesList, setRepliesList] = useState([]);

  useEffect(() => {
    const handleSaved = localStorage.getItem('safespace_handle') || 'QuietSun';
    setMyHandle(handleSaved);
  }, []);

  // Load post specific comments & saved state on mount
  useEffect(() => {
    if (!post?.id) return;

    try {
      const savedCommentsKey = `safespace_comments_${post.id}`;
      const savedCommentsStr = localStorage.getItem(savedCommentsKey);
      if (savedCommentsStr) {
        const parsed = JSON.parse(savedCommentsStr);
        if (Array.isArray(parsed)) {
          setRepliesList(parsed);
        }
      } else if (post.id === 'seed-1') {
        setRepliesList([
          { id: 'r1', handle: 'KindLeaf', body: 'I hear you so deeply. You are doing your best and that is enough.', time: '1h ago' },
          { id: 'r2', handle: 'Moonlit', body: 'Take a gentle deep breath. We are in this together.', time: '30m ago' },
        ]);
      } else {
        setRepliesList([]);
      }
    } catch (err) {
      console.warn('Failed to load post comments:', err);
    }

    try {
      const savedStr = localStorage.getItem('safespace_saved_echoes');
      if (savedStr) {
        const saved = JSON.parse(savedStr);
        if (Array.isArray(saved) && saved.some((s) => s.id === post.id)) {
          setIsLiked(true);
        }
      }
    } catch (err) {}
  }, [post.id]);

  useEffect(() => {
    setEchoes((prev) => ({
      ...prev,
      hear: Math.max(prev.hear || 0, post.hear ?? 0),
      alone: Math.max(prev.alone || 0, post.alone ?? 0),
      strength: Math.max(prev.strength || 0, post.strength ?? 0),
    }));
  }, [post.hear, post.alone, post.strength]);

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Just now';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMins = Math.floor((now - date) / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  useEffect(() => {
    if (post.created_at) {
      setDisplayTime(formatTime(post.created_at));
    }
  }, [post.created_at]);

  const totalEchoes = (echoes.hear || 0) + (echoes.alone || 0) + (echoes.strength || 0) + (echoes.matter || 0) + (echoes.love || 0) + (echoes.custom || 0);

  // Is this post created by the current user?
  const isMyPost = post.handle === myHandle || post.id?.startsWith('user-');

  // Delete Post Action
  const handleDeletePost = async () => {
    setShowOptionsMenu(false);
    if (!window.confirm('Are you sure you want to delete this confession?')) return;

    try {
      // Remove from localStorage
      const userPostsStr = localStorage.getItem('safespace_user_posts');
      if (userPostsStr) {
        let userPosts = JSON.parse(userPostsStr);
        userPosts = userPosts.filter((p) => p.id !== post.id && p.body !== post.body);
        localStorage.setItem('safespace_user_posts', JSON.stringify(userPosts));
      }

      // Send DELETE request to API
      fetch(`/api/posts?id=${post.id}`, { method: 'DELETE' }).catch(() => {});

      setToastMsg('🗑️ Confession deleted successfully.');
      if (onEchoSuccess) onEchoSuccess();
    } catch (err) {
      console.warn('Failed to delete post:', err);
    }
  };

  // Send Echo Reaction
  const handleEcho = async (type, customLabel) => {
    if (isSubmitting) return;

    setEchoes((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1,
    }));

    setActiveEchoes((prev) => ({
      ...prev,
      [type]: true,
    }));

    if (customLabel) {
      setCustomReactions((prev) => [...prev, customLabel]);
    }

    const echoNames = {
      hear: 'I hear you',
      alone: 'You are not alone',
      strength: 'Sending strength',
      matter: 'You matter',
      love: 'Sending love',
      custom: customLabel || 'Support sent',
    };

    setToastMsg(`" ${echoNames[type]} " sent!`);
    setTimeout(() => setToastMsg(''), 3000);

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/echoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: post.id,
          type: ['hear', 'alone', 'strength'].includes(type) ? type : 'hear',
        }),
      });

      if (res.ok && onEchoSuccess) {
        onEchoSuccess();
      }
    } catch (err) {
      console.error('Failed to send echo:', err);
    } finally {
      setIsSubmitting(false);
      setShowEmojiPicker(false);
    }
  };

  // Add Comment / Reply
  const handleAddReply = (e) => {
    e.preventDefault();
    const trimmed = replyText.trim();
    if (!trimmed) return;

    const savedHandle = localStorage.getItem('safespace_handle') || 'QuietSun';
    const newReply = {
      id: `reply-${Date.now()}`,
      handle: savedHandle,
      body: trimmed,
      time: 'Just now',
    };

    const updated = [...repliesList, newReply];
    setRepliesList(updated);
    setReplyText('');

    try {
      localStorage.setItem(`safespace_comments_${post.id}`, JSON.stringify(updated));
    } catch (err) {}

    setToastMsg('Your anonymous reply was added to this post!');
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleToggleLike = () => {
    setShowOptionsMenu(false);
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    try {
      const savedStr = localStorage.getItem('safespace_saved_echoes');
      let saved = [];
      if (savedStr) saved = JSON.parse(savedStr);

      if (newLikedState) {
        if (!saved.some((s) => s.id === post.id)) {
          saved.push({ id: post.id, handle: post.handle, body: post.body, category: post.category });
        }
        setToastMsg('❤️ Post saved to your Saved Echoes!');
      } else {
        saved = saved.filter((s) => s.id !== post.id);
        setToastMsg('Removed from Saved Echoes');
      }
      localStorage.setItem('safespace_saved_echoes', JSON.stringify(saved));
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {}
  };

  const handleOpenReportModal = () => {
    setShowOptionsMenu(false);
    setSelectedReportReason('');
    setReportDetails('');
    setShowReportModal(true);
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!selectedReportReason) return;

    setShowReportModal(false);

    try {
      const reportObj = {
        id: `report-${Date.now()}`,
        postId: post.id,
        postHandle: post.handle,
        postBody: post.body,
        reason: selectedReportReason,
        details: reportDetails,
        time: new Date().toISOString(),
      };

      const existingStr = localStorage.getItem('safespace_reports');
      let existing = [];
      if (existingStr) existing = JSON.parse(existingStr);
      localStorage.setItem('safespace_reports', JSON.stringify([reportObj, ...existing]));

      fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportObj),
      }).catch(() => {});
    } catch (err) {}

    setToastMsg(`🚩 Reported for "${selectedReportReason}". Moderators notified.`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleCopyLink = () => {
    setShowOptionsMenu(false);
    navigator.clipboard.writeText(window.location.href);
    setToastMsg('Anonymous link copied to clipboard!');
    setTimeout(() => setToastMsg(''), 3000);
  };

  const getAvatarStyles = (handleStr) => {
    if (handleStr?.toLowerCase().includes('starling') || handleStr?.toLowerCase().includes('s17')) {
      return { bg: 'bg-[#EEF2FF]', text: 'text-[#4F65F6]', initials: 'S17' };
    }
    if (handleStr?.toLowerCase().includes('bright') || handleStr?.toLowerCase().includes('bm')) {
      return { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]', initials: 'BM' };
    }
    if (handleStr?.toLowerCase().includes('quiet') || handleStr?.toLowerCase().includes('qs')) {
      return { bg: 'bg-[#E8ECFF]', text: 'text-[#4F65F6]', initials: 'QS' };
    }
    const colors = [
      { bg: 'bg-[#EEF2FF]', text: 'text-[#4F65F6]' },
      { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]' },
      { bg: 'bg-[#F5F3FF]', text: 'text-[#8B5CF6]' },
      { bg: 'bg-[#CCFBF1]', text: 'text-[#0D9488]' },
      { bg: 'bg-[#FFE4E6]', text: 'text-[#E11D48]' },
    ];
    let sum = 0;
    for (let i = 0; i < (handleStr || '').length; i++) {
      sum += handleStr.charCodeAt(i);
    }
    const style = colors[sum % colors.length];
    const initials = handleStr ? handleStr.substring(0, 2).toUpperCase() : 'AN';
    return { ...style, initials };
  };

  const avatar = getAvatarStyles(post.handle);

  return (
    <div className="bg-white rounded-[24px] p-5 border border-[#E9EEF5] shadow-[0_4px_16px_rgba(16,24,40,0.03)] space-y-3.5 transition-all relative">
      {/* Post Header */}
      <div className="flex items-center justify-between relative">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[12px] ${avatar.bg} ${avatar.text}`}>
            {avatar.initials}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-[#101828] text-[14px] leading-tight">
                {post.handle || 'Anonymous'}
              </h3>
              <span className="text-slate-300 text-xs">•</span>
              <span suppressHydrationWarning className="text-[12px] text-[#667085] font-medium">
                {displayTime}
              </span>
            </div>
            {post.category && (
              <span className="text-[10px] font-bold text-[#4F65F6] bg-[#EEF2FF] px-2 py-0.5 rounded-full inline-block mt-0.5">
                {post.category}
              </span>
            )}
          </div>
        </div>

        {/* ... Ellipsis Options Button */}
        <div className="relative">
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="text-[#98A2B3] hover:text-[#475467] p-2 rounded-full hover:bg-slate-50 transition-colors"
            aria-label="Post options menu"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {/* Post Options Dropdown Menu */}
          {showOptionsMenu && (
            <div className="absolute right-0 top-9 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-2 w-48 z-30 space-y-1 animate-fadeIn">
              {isMyPost && (
                <button
                  onClick={handleDeletePost}
                  className="w-full flex items-center space-x-2 p-2 rounded-xl text-[12px] font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete My Post</span>
                </button>
              )}

              <button
                onClick={handleToggleLike}
                className="w-full flex items-center space-x-2 p-2 rounded-xl text-[12px] font-bold text-slate-700 hover:bg-[#EEF2FF] hover:text-[#4F65F6] transition-colors text-left"
              >
                <Bookmark className={`w-4 h-4 ${isLiked ? 'fill-[#4F65F6] text-[#4F65F6]' : ''}`} />
                <span>{isLiked ? 'Saved in Profile' : 'Save Echo'}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center space-x-2 p-2 rounded-xl text-[12px] font-bold text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </button>

              <button
                onClick={handleOpenReportModal}
                className="w-full flex items-center space-x-2 p-2 rounded-xl text-[12px] font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left border-t border-slate-100 pt-2"
              >
                <Flag className="w-4 h-4" />
                <span>Report Post</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body Content */}
      <p className="text-[#1D2939] text-[13.5px] leading-[1.55] font-normal whitespace-pre-wrap">
        {post.body}
      </p>

      {/* Notification Toast Confirmation */}
      {toastMsg && (
        <div className="bg-[#12172D] text-white text-[11px] font-bold p-2.5 px-3 rounded-xl flex items-center space-x-1.5 animate-fadeIn">
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Echo Reaction Badges & Custom Emoji Picker */}
      <div className="space-y-2 pt-1">
        <div className="flex flex-wrap gap-2">
          {/* Default Echo Pill 1 */}
          <button
            onClick={() => handleEcho('hear')}
            className={`px-3.5 py-1.5 rounded-full font-semibold text-[12px] transition-all active:scale-95 flex items-center space-x-1.5 ${
              activeEchoes.hear
                ? 'bg-[#4F65F6] text-white shadow-xs'
                : 'bg-[#EEF2FF] text-[#4F65F6] border border-[#D9E2FE] hover:bg-[#E0E7FF]'
            }`}
          >
            <span>👂 I hear you</span>
            <span className="bg-white/90 text-[#4F65F6] px-2 py-0.2 rounded-full text-[10.5px] font-black ml-1 shadow-2xs">
              {echoes.hear}
            </span>
          </button>

          {/* Default Echo Pill 2 */}
          <button
            onClick={() => handleEcho('alone')}
            className={`px-3.5 py-1.5 rounded-full font-semibold text-[12px] transition-all active:scale-95 flex items-center space-x-1.5 ${
              activeEchoes.alone
                ? 'bg-[#8B5CF6] text-white shadow-xs'
                : 'bg-[#F5F3FF] text-[#8B5CF6] border border-[#EDE9FE] hover:bg-[#DDD6FE]'
            }`}
          >
            <span>🤝 Not alone</span>
            <span className="bg-white/90 text-[#8B5CF6] px-2 py-0.2 rounded-full text-[10.5px] font-black ml-1 shadow-2xs">
              {echoes.alone}
            </span>
          </button>

          {/* Default Echo Pill 3 */}
          <button
            onClick={() => handleEcho('strength')}
            className={`px-3.5 py-1.5 rounded-full font-semibold text-[12px] transition-all active:scale-95 flex items-center space-x-1.5 ${
              activeEchoes.strength
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'bg-[#F0F9FF] text-[#0284C7] border border-[#E0F2FE] hover:bg-[#BAE6FD]'
            }`}
          >
            <span>💪 Strength</span>
            <span className="bg-white/90 text-[#0284C7] px-2 py-0.2 rounded-full text-[10.5px] font-black ml-1 shadow-2xs">
              {echoes.strength}
            </span>
          </button>

          {/* Custom Reactions Added by User */}
          {customReactions.map((customText, idx) => (
            <span key={idx} className="px-3.5 py-1.5 rounded-full font-semibold text-[12px] bg-emerald-50 text-emerald-700 border border-emerald-200">
              {customText}
            </span>
          ))}

          {/* Customize Emoji / More Reactions Button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="px-3 py-1.5 rounded-full font-bold text-[12px] bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center space-x-1"
            title="Custom reaction emojis"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>React</span>
          </button>
        </div>

        {/* Custom Emoji / Reaction Selector Overlay */}
        {showEmojiPicker && (
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3 space-y-2 animate-fadeIn">
            <span className="text-[10.5px] font-extrabold text-[#667085] uppercase tracking-wider block">
              Choose a custom supportive reaction:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: '💜 You matter', type: 'matter' },
                { label: '🌸 Sending love', type: 'love' },
                { label: '✨ Stay strong', type: 'custom' },
                { label: '🕊️ Peace', type: 'custom' },
                { label: '🫂 Big hug', type: 'custom' },
                { label: '🌟 Hope', type: 'custom' },
              ].map((emojiItem) => (
                <button
                  key={emojiItem.label}
                  onClick={() => handleEcho(emojiItem.type, emojiItem.label)}
                  className="bg-white hover:bg-[#EEF2FF] text-[#101828] hover:text-[#4F65F6] border border-[#E2E8F0] text-[11.5px] font-semibold px-3 py-1.5 rounded-xl transition-all shadow-2xs"
                >
                  {emojiItem.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#F2F4F7] text-[12px] font-semibold text-[#475467]">
        {/* Active Heart Save / Like Button */}
        <button
          onClick={handleToggleLike}
          className="flex items-center space-x-1.5 text-[#101828] hover:text-[#4F65F6] transition-colors group"
          title="Save post to your profile"
        >
          <Heart className={`w-4 h-4 transition-transform group-hover:scale-110 ${
            isLiked ? 'fill-[#4F65F6] text-[#4F65F6]' : 'text-[#667085]'
          }`} />
          <span className="font-bold">{totalEchoes} Total Echoes</span>
        </button>

        {/* Interactive Comments/Replies Button */}
        <button
          onClick={() => setShowRepliesModal(true)}
          className="flex items-center space-x-1.5 text-[#667085] hover:text-[#4F65F6] transition-colors group"
        >
          <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform text-[#4F65F6]" />
          <span className="font-bold text-[#101828]">{repliesList.length} {repliesList.length === 1 ? 'reply' : 'replies'}</span>
        </button>
      </div>

      {/* INTERACTIVE REPORT REASON PICKER MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-rose-600">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-extrabold text-[#101828] text-base">Report Confession</h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
              <p className="text-slate-600 font-medium">
                Why are you reporting this post? SafeSpace youth moderators review reports within minutes.
              </p>

              <div className="space-y-2">
                {[
                  { id: 'distress', label: '🚫 Severe Distress or Self-Harm Concern' },
                  { id: 'harassment', label: '🛑 Harassment or Bullying' },
                  { id: 'inappropriate', label: '⚠️ Inappropriate / Explicit Content' },
                  { id: 'spam', label: '💬 Spam or Off-Topic' },
                ].map((reason) => (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => setSelectedReportReason(reason.label)}
                    className={`w-full p-3 rounded-2xl border text-left font-bold transition-all ${
                      selectedReportReason === reason.label
                        ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-2xs'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {reason.label}
                  </button>
                ))}
              </div>

              {selectedReportReason && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Additional details for moderators (optional):
                  </label>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    rows={2}
                    placeholder="Provide any context..."
                    className="w-full bg-[#F8FAFC] border border-[#D0D5DD] rounded-xl p-2.5 text-xs text-[#101828] focus:outline-none focus:border-rose-500"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedReportReason}
                  className="w-1/2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 text-white font-bold py-3 rounded-full shadow-md transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMMENTS / REPLIES MODAL OVERLAY */}
      {showRepliesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-5 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#4F65F6]" />
                <h3 className="font-extrabold text-[#101828] text-base">Supportive Replies</h3>
              </div>
              <button
                onClick={() => setShowRepliesModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Original Post Snippet */}
            <div className="bg-[#EEF2FF] border border-[#D9E2FE] rounded-2xl p-3 text-xs text-[#1D2939] italic font-medium">
              "{post.body}"
            </div>

            {/* Replies List */}
            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
              {repliesList.length === 0 ? (
                <div className="text-center py-6 space-y-1 text-slate-400">
                  <MessageCircle className="w-6 h-6 mx-auto stroke-1" />
                  <p className="text-xs font-bold text-slate-600">No replies yet</p>
                  <p className="text-[11px]">Be the first peer to leave a supportive reply below!</p>
                </div>
              ) : (
                repliesList.map((reply) => (
                  <div key={reply.id} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#101828]">{reply.handle}</span>
                      <span className="text-[10px] text-[#98A2B3]">{reply.time}</span>
                    </div>
                    <p className="text-[#344054] leading-relaxed">{reply.body}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Reply Form */}
            <form onSubmit={handleAddReply} className="pt-2 border-t border-slate-100 space-y-2">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a supportive anonymous reply..."
                  className="w-full bg-[#F8FAFC] border border-[#D0D5DD] rounded-2xl pl-3.5 pr-10 py-2.5 text-xs text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#4F65F6] font-medium"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="absolute right-2 p-1.5 rounded-xl bg-[#4F65F6] disabled:bg-slate-200 text-white transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
