import { useState } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import CrisisModal from './CrisisModal';
import { Wifi, Signal } from 'lucide-react';

export default function Layout({
  children,
  title,
  showBack = false,
  showNav = true,
  rightElement,
  customHeader = false
}) {
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0D111D] text-[#101828] flex justify-center items-center sm:py-6 selection:bg-[#EEF2FF] selection:text-[#4F65F6]">
      {/* Container simulating native iPhone 15 Pro frame */}
      <div className="w-full max-w-[400px] bg-[#F4F6FC] min-h-screen sm:min-h-[844px] sm:max-h-[880px] sm:rounded-[48px] flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden sm:border-[10px] sm:border-[#1C2237] pb-16">

        {/* Status bar */}
        <div className="bg-white px-7 pt-3.5 pb-1 flex items-center justify-between text-[12px] font-bold text-[#101828] select-none z-40">
          <span>9:41</span>
          <div className="flex items-center space-x-1.5 text-[#101828]">
            <Signal className="w-3.5 h-3.5 fill-current" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="w-5 h-2.5 rounded-[3px] border border-current p-[1px] flex items-center">
              <div className="h-full w-full bg-[#101828] rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Header */}
        {!customHeader && (
          <Header title={title} showBack={showBack} rightElement={rightElement} />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-6">
          {children}
        </main>

        {/* Bottom Nav */}
        {showNav && <BottomNav />}

        {/* Global Crisis Modal */}
        <CrisisModal
          isOpen={isCrisisOpen}
          onClose={() => setIsCrisisOpen(false)}
        />
      </div>
    </div>
  );
}
