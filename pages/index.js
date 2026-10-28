import { useRouter } from 'next/router';
import { Signal, Wifi } from 'lucide-react';

export default function FirstWelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0B0E17] text-white flex justify-center items-center sm:py-6 selection:bg-[#4F65F6] selection:text-white">
      {/* Outer Phone Frame Container */}
      <div className="w-full max-w-[400px] bg-[#0F1423] min-h-screen sm:min-h-[844px] sm:max-h-[880px] sm:rounded-[48px] flex flex-col justify-between shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden sm:border-[10px] sm:border-[#1C2237]">

        {/* Top Half Metallic Gradient Header */}
        <div className="bg-gradient-to-b from-[#C5CBE1] via-[#D3CAD0] to-[#D9CED6] pt-3 pb-2 px-7 flex flex-col justify-between relative">
          {/* Status bar */}
          <div className="flex items-center justify-between text-[13px] font-bold text-[#161B30] select-none pt-1">
            <span>9:41</span>
            <div className="flex items-center space-x-1.5 text-[#161B30]">
              <Signal className="w-3.5 h-3.5 fill-current" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="w-5 h-2.5 rounded-[3px] border border-current p-[1px] flex items-center">
                <div className="h-full w-full bg-[#161B30] rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Logo & Brand Section */}
          <div className="text-center pt-9 pb-5 space-y-2">
            {/* Overlapping Blue Dots Logo */}
            <div className="relative w-14 h-12 mx-auto flex items-center justify-center">
              <div className="absolute top-0 left-2 w-6.5 h-6.5 rounded-full bg-[#4F65F6] shadow-2xs" />
              <div className="absolute bottom-0 right-2 w-8.5 h-8.5 rounded-full bg-[#3B4ED8] shadow-sm" />
            </div>

            <h1 className="text-[28px] font-extrabold text-[#161B30] tracking-[-0.03em] leading-none pt-1">
              SafeSpace
            </h1>

            <p className="text-[10.5px] font-bold text-[#6B7699] tracking-[0.22em] uppercase mt-2">
              SPEAK • SUPPORT • FEEL BETTER
            </p>
          </div>
        </div>

        {/* Vector Mountain Art Landscape */}
        <div className="relative w-full h-[185px] bg-[#D9CED6] -mt-1 shrink-0">
          <svg className="w-full h-full block" viewBox="0 0 400 200" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pastelGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FBCFE8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#FFEDD5" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Background Sky Glow */}
            <path d="M0 200 L50 90 L130 140 L240 70 L340 150 L400 110 L400 200 Z" fill="url(#pastelGlow)" />

            {/* Back Mountain Layer */}
            <path d="M0 200 L90 100 L170 155 L280 85 L400 160 L400 200 Z" fill="#9AA5C4" opacity="0.65" />

            {/* Middle Mountain Layer */}
            <path d="M0 200 L110 80 L195 140 L310 90 L400 145 L400 200 Z" fill="#2B3459" opacity="0.9" />

            {/* Foreground Mountain Layer */}
            <path d="M0 200 L150 70 L230 140 L400 55 L400 200 Z" fill="#0F1423" />
          </svg>
        </div>

        {/* Bottom Half Dark Section */}
        <div className="bg-[#0F1423] px-7 pt-4 pb-8 flex-1 flex flex-col justify-between text-center space-y-6">
          {/* Main Title & Description */}
          <div className="space-y-3 pt-2">
            <h2 className="text-[26px] font-extrabold text-white tracking-[-0.025em] leading-[1.25]">
              A safe place for your real feelings.
            </h2>
            <p className="text-[13px] text-[#9AA5C4] font-normal leading-[1.55] max-w-[290px] mx-auto">
              Share what's on your mind, get support from peers, and find helpful resources — all anonymously.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-1">
            <button
              onClick={() => router.push('/handle-setup')}
              className="w-full bg-[#4F65F6] hover:bg-[#3B51E2] text-white font-bold text-[15px] h-[54px] rounded-full shadow-[0_8px_30px_rgba(79,101,246,0.5)] transition-all active:scale-[0.98] flex items-center justify-center tracking-tight"
            >
              Get Started
            </button>

            <button
              onClick={() => router.push('/login')}
              className="w-full text-[13px] font-medium text-[#9AA5C4] hover:text-white transition-colors py-1 block"
            >
              I already have an account
            </button>

            {/* iPhone Home Indicator Bar */}
            <div className="w-32 h-[4px] bg-[#3B4668] rounded-full mx-auto pt-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
