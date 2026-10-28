import { useRouter } from 'next/router';
import { AlertTriangle, ChevronLeft, Phone, User, Package, ChevronRight, X } from 'lucide-react';

export default function CrisisModal({ isOpen, onClose }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#EE5D50] text-white flex flex-col justify-between overflow-y-auto animate-fadeIn">
      {/* Top Header Bar with Close / Back Button */}
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={onClose}
          className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-3.5 py-1.5 rounded-full transition-colors flex items-center space-x-1"
        >
          <X className="w-3.5 h-3.5" />
          <span>Close</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="px-6 space-y-6 flex-1 flex flex-col justify-center max-w-md mx-auto w-full pb-8">
        {/* Warning Icon & Compassionate Care Text */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-10 h-10 text-white stroke-[2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            You are not alone.
          </h1>
          <p className="text-sm sm:text-base text-white font-medium leading-relaxed max-w-xs mx-auto">
            It sounds like you are going through a hard time.
          </p>
          <p className="text-xs text-white/80 leading-normal max-w-xs mx-auto">
            You mentioned words that indicate you may need extra support right now. Caring counselors are available 24/7.
          </p>
        </div>

        {/* Immediate Support White Card */}
        <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-xl space-y-4">
          <h2 className="text-base font-extrabold text-[#EE5D50] tracking-tight">
            Immediate Support Helplines
          </h2>

          <div className="space-y-3.5">
            {/* Resource Item 1: Ethiopia Mental Health Helpline */}
            <a
              href="tel:+251118726090"
              className="flex items-center space-x-3.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors group"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#FEE2E2] text-[#EE5D50] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 fill-[#EE5D50]/20" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-sm leading-tight">
                  Ethiopia Mental Health Helpline
                </h3>
                <p className="text-xs font-bold text-[#4F65F6] mt-0.5">
                  +251 118 72 60 90
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  (24/7, Free)
                </p>
              </div>
            </a>

            {/* Resource Item 2: Youth Counseling Center */}
            <a
              href="tel:+251911203040"
              className="flex items-center space-x-3.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors group"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#FEE2E2] text-[#EE5D50] flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-sm leading-tight">
                  Youth Counseling Center
                </h3>
                <p className="text-xs font-bold text-[#4F65F6] mt-0.5">
                  +251 911 20 30 40
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  (9am - 5pm)
                </p>
              </div>
            </a>

            {/* Resource Item 3: More Resources */}
            <button
              onClick={() => {
                onClose();
                router.push('/resources');
              }}
              className="w-full flex items-center justify-between space-x-3.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#FEE2E2] text-[#EE5D50] flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">
                    More Resources
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    View local support services
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onClose}
            className="w-full bg-[#1D2344] hover:bg-[#161B33] text-white font-bold text-sm py-3.5 px-4 rounded-full shadow-lg transition-transform active:scale-98"
          >
            I'm okay for now (Close)
          </button>

          <button
            onClick={() => {
              onClose();
              router.push('/admin');
            }}
            className="w-full text-center text-xs font-semibold text-white/90 hover:text-white py-1 block transition-colors underline"
          >
            Talk to a moderator
          </button>
        </div>
      </div>
    </div>
  );
}
