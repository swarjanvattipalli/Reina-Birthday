import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart } from 'lucide-react';
import { CONFIG } from '../config';

interface Props {
  onBack: () => void;
}

function useTypewriter(lines: string[], started: boolean) {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!started || done) return;

    if (currentLine >= lines.length) {
      setDone(true);
      return;
    }

    const line = lines[currentLine];
    if (currentChar <= line.length) {
      timerRef.current = setTimeout(() => {
        setDisplayed(prev => {
          const next = [...prev];
          next[currentLine] = line.slice(0, currentChar);
          return next;
        });
        setCurrentChar(c => c + 1);
      }, currentChar === 0 ? 400 : 35);
    } else {
      // Line complete — move to next after pause
      timerRef.current = setTimeout(() => {
        setCurrentLine(l => l + 1);
        setCurrentChar(0);
      }, 350);
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [started, currentLine, currentChar, lines, done]);

  return { displayed, activeLine: currentLine, done };
}

export default function LoveNote({ onBack }: Props) {
  const [visible, setVisible] = useState(false);
  const { displayed, activeLine, done } = useTypewriter(CONFIG.LOVE_NOTE, visible);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const floatingHearts = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${(i * 7 + 2) % 98}%`,
    size: 14 + (i % 3) * 6,
    dur: 7 + (i % 4) * 2,
    delay: -(i * 0.8),
  }));

  return (
    <motion.div
      className="fixed inset-0 bg-romantic-gate overflow-y-auto overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Floating hearts */}
      {floatingHearts.map(h => (
        <span key={h.id} className="petal" style={{ left: h.left, fontSize: h.size, animationDuration: `${h.dur}s`, animationDelay: `${h.delay}s` }}>
          💕
        </span>
      ))}

      {/* Radial glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(244,63,94,0.07) 0%, transparent 70%)' }} />

      <div className="relative z-10 min-h-screen w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">

        {/* ── Left: Framed Image ── */}
        <motion.div
          className="w-full lg:w-5/12 flex justify-center flex-shrink-0"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="animate-sway relative">
            <div
              className="image-frame rounded-3xl overflow-hidden"
              style={{ width: 'min(300px, 80vw)', height: 'min(380px, 100vw)' }}
            >
              <img
                src="/images/img2.jpg"
                alt="A special moment"
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.8) saturate(1.2)' }}
              />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(80,0,30,0.7) 100%)' }} />
              <div className="absolute bottom-4 left-0 right-0 text-center px-3">
                <p className="font-display italic text-white text-sm sm:text-base"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
                  Every day with you is a gift ❤️
                </p>
              </div>
            </div>

            {/* Floating hearts around image */}
            {['top-2 -left-4','top-2 -right-4','bottom-20 -left-5','bottom-20 -right-5'].map((pos, i) => (
              <span key={i} className={`absolute ${pos} text-2xl pointer-events-none`}
                style={{ animation: `floatGentle ${2 + i * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}>
                {['💕','💖','🌹','💗'][i]}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Right: Note Card ── */}
        <motion.div
          className="w-full lg:w-7/12"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <div className="glass-card-dark rounded-3xl p-6 sm:p-10">
            {/* Heading */}
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block text-3xl sm:text-4xl mb-3"
              >
                ❤️
              </motion.div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #fda4af, #f43f5e, #f59e0b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                A Special Message
              </h2>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>❤️ Just for you ❤️</p>
            </div>

            {/* Divider */}
            <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(244,63,94,0.4), transparent)' }} />

            {/* Typewriter text */}
            <div className="space-y-3 sm:space-y-4 min-h-[220px]">
              <AnimatePresence>
                {CONFIG.LOVE_NOTE.map((_, lineIdx) => {
                  const text = displayed[lineIdx] ?? '';
                  const isActive = lineIdx === activeLine && !done;
                  const isFirst = lineIdx === 0;
                  const isLast = lineIdx >= CONFIG.LOVE_NOTE.length - 2;

                  return (
                    <motion.p
                      key={lineIdx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: text.length > 0 ? 1 : 0, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`leading-relaxed ${isFirst ? 'font-display text-lg sm:text-xl font-semibold' : isLast ? 'font-display italic text-lg' : 'text-sm sm:text-base'}`}
                      style={{
                        color: isFirst
                          ? '#fda4af'
                          : isLast
                            ? '#f59e0b'
                            : 'rgba(255,255,255,0.82)',
                      }}
                    >
                      {text}
                      {isActive && text.length > 0 && (
                        <span className="cursor ml-0.5 font-light" style={{ color: '#f43f5e' }}>|</span>
                      )}
                    </motion.p>
                  );
                })}
              </AnimatePresence>

              {/* Signature */}
              {done && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-lg sm:text-xl font-semibold text-right"
                  style={{ color: '#fda4af' }}
                >
                  — {CONFIG.YOUR_NAME} 💕
                </motion.p>
              )}
            </div>

            {/* Divider */}
            <div className="h-px mt-6 mb-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(244,63,94,0.4), transparent)' }} />

            {/* Floating hearts at bottom */}
            {done && (
              <motion.div
                className="flex justify-center gap-3 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {['💕','💖','🌹','💗','💓','✨'].map((h, i) => (
                  <span key={i} className="text-xl"
                    style={{ animation: `floatGentle ${2 + i * 0.25}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}>
                    {h}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Back button */}
            <button
              onClick={onBack}
              className="btn-outline w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base font-bold"
            >
              <ArrowLeft size={16} />
              Back to Celebration
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
