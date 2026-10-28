import { useState, useEffect } from 'react';
import { makeHandle } from '../lib/handle';
import { isCrisis } from '../lib/crisis-keywords';
import { RefreshCw, Lock, Shield, Wind, Send, Info, Moon, CheckCircle2 } from 'lucide-react';

export default function PostForm({ onPostCreated, onCrisisDetected, onOpenBreathing }) {
  const [handle, setHandle] = useState('');
  const [body, setBody] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const categories = [
    { label: 'School & Exams', icon: '📚' },
    { label: 'Overwhelmed', icon: '🌧️' },
    { label: 'Feeling Alone', icon: '🫂' },
    { label: 'Late Night Thoughts', icon: '💭' },
  ];

  // Generate anonymous handle on mount
  useEffect(() => {
    regenerateHandle();
  }, []);

  const regenerateHandle = () => {
    const newHandle = makeHandle();
    setHandle(newHandle);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const trimmed = body.trim();
    if (!trimmed) {
      setErrorMessage('Please write something before sharing.');
      return;
    }

    if (trimmed.length > 300) {
      setErrorMessage('Posts must be 300 characters or fewer.');
      return;
    }

    // Instant client-side crisis check (for instant feedback)
    const clientCrisis = isCrisis(trimmed);

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle: handle,
          body: trimmed,
          category: selectedCategory || 'General Vent',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit post');
      }

      // Check crisis condition from API or client pre-check
      if (data.flagged || clientCrisis) {
        // DO NOT clear body or refresh feed!
        // Open Crisis Modal overlay immediately
        if (onCrisisDetected) {
          onCrisisDetected();
        }
      } else {
        // Success case!
        setBody('');
        setSelectedCategory('');
        setSuccessMessage('Your thoughts have been shared safely with peers.');
        setTimeout(() => setSuccessMessage(''), 4000);
        if (onPostCreated) {
          onPostCreated();
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Privacy Card Header */}
      <div className="bg-indigo-900 text-white rounded-3xl p-5 space-y-2.5 shadow-md">
        <div className="flex items-center space-x-2 text-[11px] font-bold text-indigo-200 uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5 text-indigo-300" />
          <span>END-TO-END PRIVATE SPACE</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Unburden Your Mind
        </h2>
        <p className="text-xs text-indigo-200/90 leading-relaxed font-medium">
          100% anonymous. No profile or history is saved.
        </p>

        {/* Anonymous Handle Box */}
        <div className="pt-2">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-800/80 flex items-center justify-center text-indigo-200">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-indigo-200 font-semibold block uppercase tracking-wider">
                  Posting anonymously as
                </span>
                <span className="text-sm font-bold text-white tracking-wide">
                  {handle || 'QuietWillow_...'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={regenerateHandle}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 transition-colors"
                title="Regenerate anonymous handle"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <span className="bg-indigo-950/60 text-indigo-200 text-[10px] font-bold px-2 py-1 rounded-lg hidden sm:inline-block">
                Zero Data Kept
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Post Form Container */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4">
        {/* Textarea Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-xs font-bold text-slate-800">Release tension safely</span>
          </div>
          <span className={`text-xs font-mono font-bold ${body.length > 280 ? 'text-rose-500' : 'text-slate-400'}`}>
            {body.length} / 300
          </span>
        </div>

        {/* Textarea Input */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={300}
          rows={4}
          placeholder="What is weighing on your mind today? Vent freely, take all the space you need..."
          className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none font-normal"
        />

        {/* Optional Topic Tags */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Add an emotional anchor (optional):
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setSelectedCategory(isSelected ? '' : cat.label)}
                  className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-indigo-900 text-white shadow-xs'
                      : 'bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-800 border border-indigo-100/60'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="bg-sky-50/80 border border-sky-100 rounded-2xl p-3 flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <p className="text-xs text-sky-900 leading-snug font-medium">
            If you share crisis thoughts, SafeSpace will gently connect you with free 24/7 care counselors.
          </p>
        </div>

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="bg-rose-50 text-rose-700 text-xs font-bold p-3 rounded-xl border border-rose-200">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-3 rounded-xl border border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !body.trim()}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Sharing safely...' : 'Share Safely with Peers'}</span>
        </button>
      </form>

      {/* Breathing Prompt Banner */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-sky-50/90 to-blue-50/90 border border-indigo-100 rounded-3xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-indigo-600 shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Feeling high anxiety right now?</h4>
            <p className="text-[11px] text-slate-500 font-medium">Take a 4-second breath with us before posting.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenBreathing}
          className="bg-white hover:bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold text-xs py-2 px-3.5 rounded-xl shadow-2xs transition-colors shrink-0 flex items-center space-x-1"
        >
          <Wind className="w-3.5 h-3.5 text-indigo-600" />
          <span>Breathe</span>
        </button>
      </div>
    </div>
  );
}
