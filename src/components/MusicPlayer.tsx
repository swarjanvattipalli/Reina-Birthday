import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { CONFIG } from '../config';

interface Props {
  autoplay?: boolean;
}

export default function MusicPlayer({ autoplay = false }: Props) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [showVolume, setShowVolume] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Only render if music URL configured
  if (!CONFIG.MUSIC_URL) return null;

  useEffect(() => {
    const audio = new Audio(CONFIG.MUSIC_URL);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    if (autoplay) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }

    return () => { audio.pause(); audio.src = ''; };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().then(() => setPlaying(true)).catch(() => {}); }
  };

  const toggleMute = () => {
    if (audioRef.current) audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, type: 'spring' }}
    >
      {/* Volume slider */}
      <AnimatePresence>
        {showVolume && (
          <motion.div
            className="glass-card rounded-2xl p-3 flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
          >
            <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors">
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolume}
              className="w-20"
              style={{ writingMode: 'vertical-lr', direction: 'rtl', height: 80, WebkitWritingMode: 'vertical-lr' } as React.CSSProperties}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button row */}
      <div className="flex gap-2 items-center">
        {/* Musical notes ambient */}
        {playing && (
          <div className="flex gap-1 items-end pb-1">
            {[1,2,3].map(i => (
              <motion.span
                key={i}
                className="text-xs"
                style={{ color: 'rgba(253,164,175,0.8)' }}
                animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }}
              >
                ♪
              </motion.span>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowVolume(!showVolume)}
          className="music-btn w-10 h-10 rounded-full flex items-center justify-center text-white"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <button
          onClick={togglePlay}
          className="music-btn w-12 h-12 rounded-full flex items-center justify-center text-white"
        >
          {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
      </div>
    </motion.div>
  );
}
