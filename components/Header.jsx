import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Heart, Bell, ChevronLeft, Check, BellOff } from 'lucide-react';

export default function Header({ title, showBack = false, rightElement }) {
  const router = useRouter();
  const [handle, setHandle] = useState('QuietSun');
  const [showNotif, setShowNotif] = useState(false);
  const [notifsList, setNotifsList] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('safespace_handle');
    if (saved) {
      setHandle(saved);
    }

    // Load actual dynamic notifications from local storage
    try {
      const notifsStr = localStorage.getItem('safespace_notifications');
      if (notifsStr) {
        const parsed = JSON.parse(notifsStr);
        if (Array.isArray(parsed)) {
          setNotifsList(parsed);
        }
      }
    } catch (err) {}
  }, []);

  const hasUnread = notifsList.some((n) => n.unread);

  const handleToggleNotif = () => {
    setShowNotif(!showNotif);

    // Mark as read
    if (hasUnread) {
      const updated = notifsList.map((n) => ({ ...n, unread: false }));
      setNotifsList(updated);
      try {
        localStorage.setItem('safespace_notifications', JSON.stringify(updated));
      } catch (err) {}
    }
  };

  const getInitials = (str) => {
    if (!str) return 'QS';
    const parts = str.split(/[_ ]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl px-5 py-3 border-b border-[#EAEFF7]">
      <div className="flex items-center justify-between max-w-[400px] mx-auto relative">
        {showBack ? (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-[#1E293B] transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            {title && (
              <h1 className="text-[17px] font-bold text-[#101828] tracking-tight">{title}</h1>
            )}
          </div>
        ) : (
          <Link href="/welcome" className="flex items-center space-x-2.5 group" title="Return to Landing Screen">
            <div className="w-9 h-9 rounded-[14px] bg-[#4F65F6] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(79,101,246,0.3)] transition-transform group-hover:scale-105">
              <Heart className="w-5 h-5 fill-white stroke-none" />
            </div>
            <span className="text-[18px] font-extrabold text-[#101828] tracking-tight">
              SafeSpace
            </span>
          </Link>
        )}

        {/* Right side items */}
        {rightElement ? (
          rightElement
        ) : (
          <div className="flex items-center space-x-2.5">
            {/* Notification Bell Button */}
            <button
              onClick={handleToggleNotif}
              className="relative w-9 h-9 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#475467] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 stroke-[2]" />
              {hasUnread && (
                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#4F65F6]" />
              )}
            </button>

            {/* Profile Avatar */}
            <Link
              href="/profile"
              className="w-9 h-9 rounded-full bg-[#EEF2FF] text-[#4F65F6] font-extrabold text-[12px] flex items-center justify-center border border-[#D9E2FE] shadow-2xs hover:scale-105 transition-transform"
              title={`Logged in as ${handle}. Tap to view Profile.`}
            >
              {getInitials(handle)}
            </Link>
          </div>
        )}

        {/* Dynamic Notification Toast / Drawer */}
        {showNotif && (
          <div className="absolute top-12 right-0 bg-[#12172D] text-white text-[11px] p-3.5 rounded-2xl shadow-2xl z-50 w-64 border border-[#2D3866] space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
              <span className="font-extrabold text-[#4F65F6] uppercase tracking-wider text-[10px]">
                Support Notifications
              </span>
              <button onClick={() => setShowNotif(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {notifsList.length === 0 ? (
              <div className="py-2 text-center text-slate-300 space-y-1">
                <BellOff className="w-5 h-5 mx-auto text-slate-400" />
                <p className="font-bold text-xs text-white">No new notifications</p>
                <p className="text-[10.5px] text-slate-400">
                  When peers echo or reply to your posts, notifications will show here!
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {notifsList.slice(0, 3).map((item) => (
                  <div key={item.id} className="bg-[#1C2342] p-2.5 rounded-xl space-y-0.5 border border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{item.sender}</span>
                      <span className="text-[9.5px] text-slate-400">{item.time}</span>
                    </div>
                    {item.type === 'echo' ? (
                      <p className="text-slate-300 text-[10.5px]">
                        Reacted <strong>"{item.echoType}"</strong> to {item.postTitle}
                      </p>
                    ) : (
                      <p className="text-slate-300 text-[10.5px]">
                        Commented: "{item.replyBody}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
