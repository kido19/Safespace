import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronLeft, RefreshCw, Signal, Wifi, ArrowRight } from 'lucide-react';
import { makeHandle } from '../lib/handle';

export default function HandleSetupPage() {
  const router = useRouter();
  const [handle, setHandle] = useState('');

  useEffect(() => {
    setHandle(makeHandle());
  }, []);

  const handleShuffle = () => {
    setHandle(makeHandle());
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const finalHandle = handle.trim() || 'QuietSun';
    localStorage.setItem('safespace_handle', finalHandle);
    router.push('/feed');
  };

  return (
    <div className="min-h-screen bg-[#0B0E17] text-[#101828] flex justify-center items-center sm:py-6 selection:bg-[#EEF2FF] selection:text-[#4F65F6]">
      {/* Outer Phone Frame */}
      <div className="w-full max-w-[400px] bg-white min-h-screen sm:min-h-[844px] sm:max-h-[880px] sm:rounded-[48px] flex flex-col justify-between shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden sm:border-[10px] sm:border-[#1C2237]">

        {/* Top Content Area */}
        <div className="p-6 pt-3.5 flex-1 flex flex-col justify-between pb-0">
          <div>
            {/* Status bar */}
            <div className="flex items-center justify-between text-[12px] font-bold text-[#101828] select-none pb-3">
              <span>9:41</span>
              <div className="flex items-center space-x-1.5 text-[#101828]">
                <Signal className="w-3.5 h-3.5 fill-current" />
                <Wifi className="w-3.5 h-3.5" />
                <div className="w-5 h-2.5 rounded-[3px] border border-current p-[1px] flex items-center">
                  <div className="h-full w-full bg-[#101828] rounded-[1px]" />
                </div>
              </div>
            </div>

            {/* Header Bar with Back Arrow and Step Indicators */}
            <div className="flex items-center justify-between py-1">
              <button
                onClick={() => router.push('/')}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
              </button>

              {/* Step indicator dots */}
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E2E8F0]" />
                <span className="w-6 h-2 rounded-full bg-[#4F65F6]" />
                <span className="w-2 h-2 rounded-full bg-[#E2E8F0]" />
              </div>

              <div className="w-9 h-9" />
            </div>

            {/* Title & Input Form */}
            <form onSubmit={handleContinue} className="space-y-6 pt-4">
              <div className="space-y-2">
                <h1 className="text-[25px] font-extrabold text-[#101828] tracking-[-0.02em] leading-[1.25]">
                  Create your anonymous handle
                </h1>
                <p className="text-[13px] text-[#667085] font-normal leading-[1.5]">
                  Choose a handle that feels like you. No real names, no photos.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-[12px] font-bold text-[#101828] block">
                  Your handle
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="e.g. QuietSun, Dreamer24"
                    className="w-full bg-white border border-[#D0D5DD] rounded-[18px] px-4 py-3.5 text-[14px] font-semibold text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#4F65F6] focus:ring-2 focus:ring-[#4F65F6]/20 transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="absolute right-3 p-1.5 rounded-xl bg-[#F2F4F7] hover:bg-[#E4E7EC] text-[#475467] transition-colors"
                    title="Generate another handle"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#4F65F6] hover:bg-[#3B51E2] text-white font-bold text-[15px] h-[52px] rounded-full shadow-[0_8px_25px_rgba(79,101,246,0.45)] transition-all active:scale-[0.98] flex items-center justify-center tracking-tight space-x-2"
                >
                  <span>Create Account & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-1">
                  <Link
                    href="/login"
                    className="text-[12.5px] font-medium text-[#667085] hover:text-[#4F65F6] transition-colors"
                  >
                    Already have an account? <span className="font-bold text-[#4F65F6] underline">Sign In</span>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Sun & Waves Vector Illustration - Fitted 100% with no gaps */}
        <div className="w-full h-[190px] relative overflow-hidden shrink-0 mt-2">
          <svg className="w-full h-full block" viewBox="0 0 300 160" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Flying Birds */}
            <path d="M100 25 Q105 20 110 25 Q115 20 120 25" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M118 36 Q123 31 128 36 Q133 31 138 36" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Sun */}
            <circle cx="170" cy="65" r="32" fill="url(#sunGrad)" />

            <defs>
              <radialGradient id="sunGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(170 65) rotate(90) scale(32)">
                <stop stopColor="#FBBF24" />
                <stop offset="1" stopColor="#F59E0B" />
              </radialGradient>
            </defs>

            {/* Layered Wave Graphics */}
            <path d="M0 70 Q80 50 160 80 Q240 110 300 80 L300 160 L0 160 Z" fill="#DBEAFE" opacity="0.9" />
            <path d="M0 90 Q100 105 190 75 Q250 60 300 95 L300 160 L0 160 Z" fill="#60A5FA" opacity="0.8" />
            <path d="M0 110 Q110 85 210 115 Q260 130 300 110 L300 160 L0 160 Z" fill="#2563EB" opacity="0.9" />
            <path d="M0 128 Q130 115 230 132 L300 122 L300 160 L0 160 Z" fill="#1E3A8A" />
          </svg>
        </div>
      </div>
    </div>
  );
}
