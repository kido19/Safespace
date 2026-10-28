import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, ThumbsUp, Plus, Heart, User } from 'lucide-react';

export default function BottomNav() {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { label: 'Feed', href: '/feed', icon: Home },
    { label: 'Echoes', href: '/echoes', icon: ThumbsUp },
    { label: 'Create', href: '/share', isCenter: true, icon: Plus },
    { label: 'Resources', href: '/resources', icon: Heart },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#EAEFF7] px-4 py-2.5">
      <div className="flex items-center justify-around max-w-[400px] mx-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href || (item.href === '/feed' && currentPath === '/');

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-5 flex items-center justify-center"
                aria-label="Create Post"
              >
                <div className="w-12 h-12 rounded-full bg-[#4F65F6] hover:bg-[#3B51E2] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(79,101,246,0.35)] transition-all active:scale-95 border-4 border-white">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-0.5 px-3 transition-colors ${
                isActive ? 'text-[#4F65F6] font-bold' : 'text-[#8E99B0] font-medium hover:text-[#4A5568]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2px] text-[#4F65F6]' : 'stroke-[1.8px]'}`} />
              <span className="text-[10px] mt-1 tracking-tight font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
