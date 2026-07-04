import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lock, Eye, EyeOff } from 'lucide-react';
import { CONFIG } from '../config';

interface Props {
  onUnlock: () => void;
}

const HEARTS = ['❤️', '💕', '💖', '💗', '💓', '🌹', '✨'];

export default function PasswordGate({ onUnlock }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const floatingHearts = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    emoji: HEARTS[i % HEARTS.length],
    left: `${(i * 5.5 + 2) % 100}%`,
    size: 14 + (i % 4) * 6,
    duration: 7 + (i % 5) * 2,
    delay: -(i * 0.9),
  }));

  const handleInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 6);
    setCode(digits);
    setError(false);
    if (digits.length === CONFIG.PASSWORD.length) {
      checkPassword(digits);
    }
  };

  const checkPassword = (attempt: string) => {
    if (attempt === CONFIG.PASSWORD) {
      setUnlocking(true);
      setTimeout(onUnlock, 900);
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => { setShaking(false); setCode(''); }, 600);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code) checkPassword(code);
  };

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 400);
  }, []);

  return (
    <AnimatePresence>
      {!unlocking && (
        <motion.div
          key="gate"
          className="fixed inset-0 bg-romantic-gate flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7 }}
        >
          {/* Floating hearts background */}
          {floatingHearts.map(h => (
            <span
              key={h.id}
              className="petal select-none"
              style={{
                left: h.left,
                fontSize: h.size,
                animationDuration: `${h.duration}s`,
                animationDelay: `${h.delay}s`,
              }}
            >
              {h.emoji}
            </span>
          ))}

          {/* Radial glow center */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(244,63,94,0.08) 0%, transparent 70%)' }}
          />

          {/* ── Layout ── */}
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-6 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

            {/* Left — Illustration */}
            <motion.div
              className="w-full lg:w-1/2 flex justify-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="animate-sway">
                <div
                  className="image-frame rounded-3xl overflow-hidden relative"
                  style={{ width: 'min(340px, 85vw)', height: 'min(340px, 85vw)' }}
                >
                  <img
                    src="/images/img1.jpg"
                    alt="Birthday surprise"
                    className="w-full h-full object-cover"
                    style={{ filter: 'brightness(0.85) saturate(1.15)' }}
                  />
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(100,0,30,0.6) 100%)' }}
                  />
                  <div className="absolute bottom-5 left-0 right-0 text-center">
                    <p className="font-display italic text-white text-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                      Something magical awaits...
                    </p>
                  </div>

                  {/* Corner hearts */}
                  {['top-3 left-3','top-3 right-3','bottom-16 left-3','bottom-16 right-3'].map((pos, i) => (
                    <span key={i} className={`absolute ${pos} text-lg`}
                      style={{ animation: `floatGentle ${2.5 + i * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}>
                      💕
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — Password card */}
            <motion.div
              className="w-full lg:w-1/2 flex justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            >
              <div
                className={`glass-card rounded-3xl p-8 sm:p-10 w-full max-w-md ${shaking ? 'animate-shake' : ''}`}
                style={error ? { border: '1px solid rgba(239,68,68,0.5)', boxShadow: '0 0 0 3px rgba(239,68,68,0.15), 0 8px 32px rgba(0,0,0,0.3)' } : {}}
              >
                {/* Lock icon */}
                <div className="flex justify-center mb-6">
                  <div className="glow-pulse rounded-full p-4" style={{ background: 'linear-gradient(135deg,#f43f5e,#be123c)' }}>
                    <Lock className="text-white" size={28} />
                  </div>
                </div>

                {/* Title */}
                <h1 className="font-display text-white text-center text-2xl sm:text-3xl font-semibold mb-2 leading-tight">
                  A Special Surprise Awaits ❤️
                </h1>
                <p className="text-center text-sm sm:text-base mb-8"
                  style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Enter the Secret Birthday Code
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type={show ? 'text' : 'password'}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={code}
                      onChange={e => handleInput(e.target.value)}
                      placeholder="● ● ● ● ● ●"
                      className={`pin-input ${error ? 'error' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* PIN dot indicators */}
                  <div className="flex justify-center gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-full transition-all duration-200"
                        style={{
                          width: i < code.length ? 14 : 10,
                          height: i < code.length ? 14 : 10,
                          background: i < code.length
                            ? (error ? '#ef4444' : 'linear-gradient(135deg,#f43f5e,#fda4af)')
                            : 'rgba(255,255,255,0.2)',
                          boxShadow: i < code.length ? '0 0 8px rgba(244,63,94,0.6)' : 'none',
                          alignSelf: 'center',
                        }}
                      />
                    ))}
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-center text-sm font-medium"
                        style={{ color: '#fca5a5' }}
                      >
                        Oops! Wrong Secret Code 🙈 Try again!
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    className="btn-luxury w-full py-4 rounded-2xl text-base sm:text-lg"
                  >
                    Unlock Surprise ❤️
                  </button>
                </form>

                {/* Bottom hint */}
                <div className="flex items-center justify-center gap-2 mt-6">
                  {[...Array(5)].map((_, i) => (
                    <Heart key={i} size={12} fill="#f43f5e" className="text-rose-500"
                      style={{ animation: `floatGentle ${1.5 + i * 0.2}s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
