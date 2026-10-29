import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import CrisisModal from '../components/CrisisModal';
import { isCrisis } from '../lib/crisis-keywords';
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react';

export default function CreatePostPage() {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [selectedTag, setSelectedTag] = useState('School');
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const tags = ['School', 'Anxiety', 'Family', 'Relationships', 'Loneliness', 'Other'];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordDuration(0);

      timerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access unavailable or denied:', err);
      setIsRecording(true);
      setRecordDuration(0);
      timerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    } else {
      setAudioUrl('simulated-audio');
    }
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const togglePlayback = () => {
    if (!audioUrl) return;
    if (audioUrl === 'simulated-audio') {
      setIsPlaying(!isPlaying);
      return;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordDuration(0);
  };

  const saveToLocalUserPosts = (newPostObj, token) => {
    try {
      const existingStr = localStorage.getItem('safespace_user_posts');
      let existing = [];
      if (existingStr) {
        existing = JSON.parse(existingStr);
      }
      localStorage.setItem('safespace_user_posts', JSON.stringify([newPostObj, ...existing]));

      if (token && newPostObj.id) {
        const tokensStr = localStorage.getItem('safespace_post_tokens');
        let tokens = tokensStr ? JSON.parse(tokensStr) : {};
        tokens[newPostObj.id] = token;
        localStorage.setItem('safespace_post_tokens', JSON.stringify(tokens));
      }
    } catch (err) {
      console.warn('Failed to save to local user posts:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;

    if (isCrisis(trimmed)) {
      setIsCrisisOpen(true);
      return;
    }

    setIsSubmitting(true);
    const savedHandle = localStorage.getItem('safespace_handle') || 'Anonymous';

    const newPostObj = {
      id: `user-post-${Date.now()}`,
      handle: savedHandle,
      body: trimmed,
      category: selectedTag,
      hasVoiceNote: !!audioUrl,
      audioUrl: audioUrl || null,
      audioDuration: recordDuration || 0,
      created_at: new Date().toISOString(),
      hear: 0,
      alone: 0,
      strength: 0,
    };

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle: savedHandle,
          body: trimmed,
          category: selectedTag,
          hasVoiceNote: !!audioUrl,
          audioUrl: audioUrl || null,
          audioDuration: recordDuration || 0,
        }),
      });

      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.flagged) {
          setIsCrisisOpen(true);
        } else {
          const finalPost = data.post || newPostObj;
          const token = data.authorToken || finalPost.authorToken;
          saveToLocalUserPosts(finalPost, token);
          router.push('/feed');
        }
      } else {
        saveToLocalUserPosts(newPostObj);
        router.push('/feed');
      }
    } catch (err) {
      console.error('Failed to submit post via API, saving locally:', err);
      saveToLocalUserPosts(newPostObj);
      router.push('/feed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout showBack title="">
      <div className="p-5 space-y-5">
        {/* Heading */}
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Share what's on your mind
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            It's okay to be honest here. This is a judgment-free space.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Textarea Input Container */}
          <div className="relative bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs focus-within:border-[#4F65F6] focus-within:ring-2 focus-within:ring-[#4F65F6]/15 transition-all">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={500}
              rows={6}
              placeholder="What's going on? (e.g. school stress, anxiety, family pressure, relationships...)"
              className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none font-normal leading-relaxed"
            />
            <div className="text-right pt-2 text-xs font-mono font-medium text-slate-400">
              {body.length}/500
            </div>
          </div>

          {/* Tag Selectors */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#EEF2FF] text-[#4F65F6] border border-[#C7D2FE]'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* Voice Note Section */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-slate-800">
              Add a voice note (optional)
            </h3>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
              {!isRecording && !audioUrl && (
                <button
                  type="button"
                  onClick={startRecording}
                  className="w-full flex items-center space-x-3 text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#EEF2FF] text-[#4F65F6] flex items-center justify-center group-hover:bg-[#E0E7FF] transition-colors">
                    <Mic className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    Tap to record
                  </span>
                </button>
              )}

              {isRecording && (
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center animate-pulse">
                      <Mic className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Recording voice note...</span>
                      <span className="text-[11px] font-mono text-rose-600 font-bold">{recordDuration}s</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="p-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                  >
                    <Square className="w-4 h-4 fill-white" />
                  </button>
                </div>
              )}

              {audioUrl && !isRecording && (
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={togglePlayback}
                      className="w-10 h-10 rounded-full bg-[#4F65F6] text-white flex items-center justify-center shadow-xs"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                    </button>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Voice Note Recorded</span>
                      <span className="text-[11px] text-slate-400 font-medium">Ready to post</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={deleteRecording}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete recording"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !body.trim()}
              className="w-full bg-[#4F65F6] hover:bg-[#3B51E2] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm py-4 px-6 rounded-full shadow-lg shadow-[#4F65F6]/30 transition-transform active:scale-98"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>

      <CrisisModal
        isOpen={isCrisisOpen}
        onClose={() => setIsCrisisOpen(false)}
      />
    </Layout>
  );
}
