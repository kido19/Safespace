import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Phone, Users, Plus, ChevronRight, Heart, BookOpen, Wind, Eye, X, Check, Play, Pause, Send, MessageSquare, Bot } from 'lucide-react';

const HOTLINES_DATA = [
  {
    id: 1,
    title: 'Mental Health Helpline',
    phone: '+251 118 72 60 90',
    details: '24/7 • Free • Confidential',
    icon: Phone,
    iconBg: 'bg-[#4F65F6] text-white',
    href: 'tel:+251118726090',
  },
  {
    id: 2,
    title: 'Youth Counseling Center',
    phone: '+251 911 20 30 40',
    details: '9am - 5pm • Free Youth Support',
    icon: Users,
    iconBg: 'bg-[#4F65F6] text-white',
    href: 'tel:+251911203040',
  },
  {
    id: 3,
    title: 'Ethiopian Red Cross',
    phone: '+251 111 11 22 33',
    details: '24/7 Emergency Crisis Support',
    icon: Plus,
    iconBg: 'bg-[#FEE2E2] text-[#EE5D50]',
    href: 'tel:+251111112233',
  },
  {
    id: 4,
    title: 'Amanuel Hospital Emergency Hub',
    phone: '+251 11 275 7699',
    details: 'National Psychiatric Emergency Center',
    icon: Phone,
    iconBg: 'bg-[#4F65F6] text-white',
    href: 'tel:+251112757699',
  },
];

const ARTICLES_DATA = [
  {
    id: 'art-1',
    title: 'Understanding Academic Burnout & Overwhelm',
    readTime: '3 min read',
    category: 'Student Wellness',
    summary: 'Recognize the cognitive signs of academic exhaustion and learn 4 practical strategies to restore mental energy.',
    content: `Academic burnout is not a personal failure—it is a physiological response to prolonged stress without adequate recovery time.

Key Signs of Academic Burnout:
• Constant exhaustion even after sleeping
• Feeling detached or cynical about your studies
• Difficulty concentrating or remembering information
• Physical symptoms like headaches or muscle tension

4 Practical Grounding Strategies:
1. The 50/10 Micro-Break Rule: Study for 50 minutes, then completely disconnect for 10 minutes away from screens.
2. Separate Worth from Outcomes: Remind yourself that a single grade or exam does not define your intrinsic human value.
3. Establish a Shut-Down Ritual: Pick a fixed time each evening (e.g. 9:00 PM) where all study materials are put away.
4. Reach Out Early: Talk to a trusted peer or counselor before stress turns into acute crisis.`,
  },
  {
    id: 'art-2',
    title: 'How to Support a Friend Going Through a Hard Time',
    readTime: '4 min read',
    category: 'Peer Care Guide',
    summary: 'A step-by-step guide on active listening, direct crisis questioning, and providing non-judgmental comfort.',
    content: `When a friend is hurting, you don't need to have all the answers. Your presence and compassionate listening are the most powerful support you can offer.

1. Practice Active, Non-Judgmental Listening:
• Validate their feelings: Say "That sounds really heavy and painful" rather than trying to instantly "fix" it.
• Avoid minimizing: Refrain from sayings like "It could be worse" or "Look on the bright side."

2. Ask Direct, Compassionate Questions:
• If you are worried about their safety, ask clearly: "Are you thinking about hurting yourself or ending your life?"
• Asking directly does NOT plant the idea; it opens a safe door for them to be honest.

3. Offer Concrete, Specific Help:
• Instead of saying "Let me know if you need anything," offer specific small acts: "Can I bring you lunch?" or "Would you like me to sit with you while you call a counselor?"

4. Know When to Involve Care Professionals:
• If they are in immediate physical danger, stay with them and contact local emergency or crisis hotlines immediately.`,
  },
  {
    id: 'art-3',
    title: 'Navigating Family Expectations & Boundaries',
    readTime: '4 min read',
    category: 'Emotional Health',
    summary: 'How to manage parental pressure, maintain open communication, and protect your emotional peace.',
    content: `Family pressure is one of the most common sources of stress among young adults. Balancing respect for your family with your own mental well-being requires gentle, firm boundaries.

1. Acknowledge Their Intentions vs. Impact:
• Recognize that family pressure often stems from their own anxieties or desires for your security. However, their intent does not mean you must absorb unmanageable pressure.

2. Practice De-escalation Sentences:
• Use "I" statements: "I value your advice, but right now I am feeling overwhelmed and need a moment to catch my breath."

3. Create Safe Mental Spaces:
• Designate daily quiet time for yourself where you engage in relaxing activities away from high-pressure conversations.`,
  },
];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('Hotlines');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Active Running 4-7-8 Breathing Exercise State
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale'); // Inhale (4s), Hold (7s), Exhale (8s)
  const [breathTimer, setBreathTimer] = useState(4);

  // Live Breathing Timer Interval Loop
  useEffect(() => {
    let interval = null;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev > 1) return prev - 1;

          // Switch breathing phase
          setBreathPhase((currentPhase) => {
            if (currentPhase === 'Inhale') {
              setBreathTimer(7);
              return 'Hold';
            } else if (currentPhase === 'Hold') {
              setBreathTimer(8);
              return 'Exhale';
            } else {
              setBreathTimer(4);
              return 'Inhale';
            }
          });
          return 4;
        });
      }, 1000);
    } else {
      setBreathPhase('Inhale');
      setBreathTimer(4);
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  // Interactive Grounding State
  const [groundingSteps, setGroundingSteps] = useState({
    see: false,
    feel: false,
    hear: false,
    smell: false,
    taste: false,
  });

  const toggleGrounding = (key) => {
    setGroundingSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = ['Hotlines', 'Articles', 'Self-Care'];

  return (
    <Layout showBack title="Resources & Care">
      <div className="p-4 space-y-5">
        {/* Top Banner Card */}
        <div className="bg-[#1D2B53] text-white rounded-[24px] p-5 shadow-sm relative overflow-hidden flex items-center justify-between border border-[#2D3A6B]">
          <div className="space-y-1.5 max-w-[68%] z-10">
            <h2 className="text-[16px] font-extrabold text-white tracking-tight leading-snug">
              You're not alone.<br />Help is always available.
            </h2>
            <p className="text-[11px] text-slate-300 font-normal leading-relaxed">
              Explore 24/7 free helplines, interactive grounding tools, and peer articles.
            </p>
          </div>

          {/* Banner Graphic Illustration */}
          <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="35" stroke="#3A4D80" strokeWidth="4" />
              <circle cx="50" cy="50" r="26" stroke="#4F65F6" strokeWidth="6" opacity="0.6" />
              <path d="M50 25 C38 25 30 35 30 48 C30 65 50 82 50 82 C50 82 70 65 70 48 C70 35 62 25 50 25 Z" fill="#25356E" />
              <path d="M50 35 C44 35 40 40 40 46 C40 55 50 64 50 64 C50 64 60 55 60 46 C60 40 56 35 50 35 Z" fill="#4F65F6" />
            </svg>
          </div>
        </div>

        {/* Underline Category Tab Bar */}
        <div className="flex items-center space-x-6 border-b border-[#EAEFF7] px-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2.5 text-[13px] font-semibold shrink-0 transition-colors relative ${
                  isActive ? 'text-[#4F65F6] font-extrabold' : 'text-[#667085] hover:text-[#101828]'
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F65F6] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: HOTLINES & COUNSELORS */}
        {activeTab === 'Hotlines' && (
          <div className="space-y-3 pt-1">
            {HOTLINES_DATA.map((item) => {
              const IconComp = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className="bg-white rounded-[20px] p-4 border border-[#E9EEF5] shadow-[0_4px_16px_rgba(16,24,40,0.03)] flex items-center justify-between hover:bg-[#F8FAFC] transition-colors group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                      <IconComp className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#101828] text-[13.5px] leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-[12px] font-bold text-[#4F65F6] mt-0.5">
                        {item.phone}
                      </p>
                      <p className="text-[11px] text-[#667085] font-medium">
                        {item.details}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#EEF2FF] group-hover:bg-[#4F65F6] group-hover:text-white text-[#4F65F6] p-2 rounded-xl transition-colors shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* TAB 2: FULL READABLE ARTICLES */}
        {activeTab === 'Articles' && (
          <div className="space-y-3.5 pt-1">
            {ARTICLES_DATA.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-[22px] p-5 border border-[#E9EEF5] shadow-[0_4px_16px_rgba(16,24,40,0.03)] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#4F65F6] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {art.category}
                  </span>
                  <span className="text-[11px] text-[#98A2B3] font-medium">
                    {art.readTime}
                  </span>
                </div>

                <h3 className="font-extrabold text-[#101828] text-[15px] leading-snug">
                  {art.title}
                </h3>

                <p className="text-[12.5px] text-[#475467] leading-relaxed">
                  {art.summary}
                </p>

                <button
                  onClick={() => setSelectedArticle(art)}
                  className="w-full bg-[#F8FAFC] hover:bg-[#EEF2FF] text-[#4F65F6] font-bold text-[12px] py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center space-x-1.5 border border-[#E2E8F0]"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Full Guide</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SELF-CARE */}
        {activeTab === 'Self-Care' && (
          <div className="space-y-4 pt-1">
            {/* 4-7-8 Breathing */}
            <div className="bg-gradient-to-br from-[#1E2548] to-[#2B3564] text-white rounded-[24px] p-5 space-y-4 shadow-sm border border-[#2F3A6E]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#A0ABC0] uppercase tracking-wider flex items-center space-x-1">
                  <Wind className="w-3.5 h-3.5 text-[#4F65F6]" />
                  <span>Nervous System Reset</span>
                </span>
                <span className="text-[10px] bg-[#4F65F6] text-white px-2.5 py-0.5 rounded-full font-bold">
                  {isBreathing ? 'Timer Active' : '4-7-8 Exercise'}
                </span>
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-[16px] font-extrabold text-white">4-7-8 Paced Breathing Tool</h3>
                <p className="text-[12px] text-slate-300 leading-relaxed max-w-xs mx-auto">
                  Inhale for 4s, hold for 7s, exhale for 8s to ease acute physical anxiety.
                </p>
              </div>

              <div className="relative w-32 h-32 mx-auto flex items-center justify-center my-3">
                <div
                  className={`absolute inset-0 rounded-full bg-[#4F65F6]/40 transition-all duration-1000 ${
                    isBreathing
                      ? breathPhase === 'Inhale'
                        ? 'scale-110 bg-indigo-500/50'
                        : breathPhase === 'Hold'
                        ? 'scale-110 bg-amber-500/40'
                        : 'scale-90 bg-sky-500/40'
                      : 'scale-100'
                  }`}
                />
                <div className="relative z-10 w-24 h-24 rounded-full bg-white text-[#101828] flex flex-col items-center justify-center shadow-lg border-2 border-[#EEF2FF]">
                  <span className="text-[11px] font-black uppercase text-[#4F65F6]">
                    {isBreathing ? breathPhase : 'Ready'}
                  </span>
                  <span className="text-[24px] font-black text-[#101828]">
                    {isBreathing ? `${breathTimer}s` : 'Start'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsBreathing(!isBreathing)}
                className={`w-full font-bold text-[14px] h-[48px] rounded-full transition-all active:scale-98 shadow-md flex items-center justify-center space-x-2 ${
                  isBreathing
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-[#4F65F6] hover:bg-[#3B51E2] text-white shadow-[0_6px_20px_rgba(79,101,246,0.35)]'
                }`}
              >
                {isBreathing ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                <span>{isBreathing ? 'Pause Breathing Exercise' : 'Run 4-7-8 Breathing Timer'}</span>
              </button>
            </div>

            {/* 5-4-3-2-1 Sensory Grounding */}
            <div className="bg-white rounded-[24px] p-5 border border-[#E9EEF5] shadow-[0_4px_16px_rgba(16,24,40,0.03)] space-y-3.5">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-[#4F65F6] uppercase tracking-wider block">
                  Sensory Focus Exercise
                </span>
                <h3 className="font-extrabold text-[#101828] text-[15px]">5-4-3-2-1 Sensory Grounding</h3>
                <p className="text-[12px] text-[#667085]">
                  Tap each box as you notice items in your environment:
                </p>
              </div>

              <div className="space-y-2 text-[12.5px]">
                {[
                  { key: 'see', label: '👀 Name 5 things you can SEE around you' },
                  { key: 'feel', label: '✋ Name 4 things you can TOUCH/FEEL right now' },
                  { key: 'hear', label: '🎧 Name 3 things you can HEAR in the room' },
                  { key: 'smell', label: '🌸 Name 2 things you can SMELL' },
                  { key: 'taste', label: '💧 Name 1 thing you can TASTE' },
                ].map((item) => {
                  const checked = groundingSteps[item.key];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleGrounding(item.key)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        checked
                          ? 'bg-[#EEF2FF] border-[#4F65F6] text-[#4F65F6] font-bold'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#344054]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                        checked ? 'bg-[#4F65F6] border-[#4F65F6] text-white' : 'border-slate-300'
                      }`}>
                        {checked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ARTICLE MODAL OVERLAY */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold text-[#4F65F6] bg-[#EEF2FF] px-2.5 py-1 rounded-full uppercase">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-1 flex-1">
              <h2 className="text-[17px] font-extrabold text-[#101828] leading-snug">
                {selectedArticle.title}
              </h2>
              <div className="text-[12.5px] text-[#344054] leading-relaxed whitespace-pre-wrap space-y-2">
                {selectedArticle.content}
              </div>
            </div>

            <button
              onClick={() => setSelectedArticle(null)}
              className="w-full bg-[#101828] text-white font-bold text-xs py-3 rounded-full shadow-md shrink-0"
            >
              Close Article
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
