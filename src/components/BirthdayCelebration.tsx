import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CONFIG } from '../config';
import VideoPlayer from "./VideoPlayer";

interface Props {
  onOpenNote: () => void;
}

// ── Birthday Cake SVG ────────────────────────────────────────
function BirthdayCake({ candleBlown }: { candleBlown: boolean }) {
  return (
    <svg viewBox="0 0 220 260" className="w-full h-full" style={{ filter: 'drop-shadow(0 20px 40px rgba(244,63,94,0.4))' }}>
      {/* Plate / base shadow */}
      <ellipse cx="110" cy="250" rx="88" ry="10" fill="rgba(0,0,0,0.3)" />

      {/* Bottom tier */}
      <rect x="20" y="175" width="180" height="65" rx="8" fill="#c2185b" />
      <rect x="20" y="175" width="180" height="12" rx="4" fill="#e91e8c" />
      {/* Frosting drips bottom */}
      {[35,60,82,107,132,155,175].map((x,i) => (
        <path key={i} d={`M${x},175 Q${x+5},192 ${x+4},200`} stroke="white" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.85" />
      ))}
      {/* Decorations bottom tier */}
      {[38,68,98,128,158,188].map((x,i) => (
        <circle key={i} cx={x} cy="205" r="5" fill={['#FFD700','#FF69B4','#87CEEB','#FFD700','#FF69B4','#87CEEB'][i]} />
      ))}
      {/* Stripes bottom */}
      {[45,75,105,135,165].map((x,i) => (
        <rect key={i} x={x} y="195" width="8" height="28" rx="4" fill="rgba(255,255,255,0.12)" />
      ))}

      {/* Middle tier */}
      <rect x="40" y="112" width="140" height="65" rx="8" fill="#d81b60" />
      <rect x="40" y="112" width="140" height="12" rx="4" fill="#f06292" />
      {/* Frosting drips middle */}
      {[52,74,97,120,143,166].map((x,i) => (
        <path key={i} d={`M${x},112 Q${x+5},128 ${x+4},136`} stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.85" />
      ))}
      {/* Roses middle tier */}
      {[60,100,140,170].map((cx,i) => (
        <g key={i}>
          <circle cx={cx} cy="145" r="7" fill="#FF1493" opacity="0.9"/>
          <circle cx={cx-3} cy="143" r="4" fill="#FF69B4" opacity="0.85"/>
          <circle cx={cx+3} cy="143" r="4" fill="#FF69B4" opacity="0.85"/>
          <circle cx={cx} cy="139" r="4" fill="#FFB6C1" opacity="0.8"/>
        </g>
      ))}

      {/* Top tier */}
      <rect x="60" y="58" width="100" height="56" rx="8" fill="#e91e8c" />
      <rect x="60" y="58" width="100" height="11" rx="4" fill="#ff80ab" />
      {/* Frosting drips top */}
      {[68,88,108,128,148].map((x,i) => (
        <path key={i} d={`M${x},58 Q${x+4},72 ${x+4},80`} stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.85" />
      ))}
      {/* Stars top tier */}
      {[75,110,145].map((cx,i) => (
        <text key={i} x={cx} y="94" textAnchor="middle" fontSize="14" fill="#FFD700">★</text>
      ))}

      {/* ── Candle ── */}
      <rect x="104" y="26" width="12" height="34" rx="4" fill="url(#candleGrad)" />
      {/* Candle shine */}
      <rect x="107" y="30" width="3" height="20" rx="2" fill="rgba(255,255,255,0.4)" />

      <defs>
        <linearGradient id="candleGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFDEAD"/>
          <stop offset="40%" stopColor="#FFF8DC"/>
          <stop offset="100%" stopColor="#F4A460"/>
        </linearGradient>
        <radialGradient id="flameGrad" cx="50%" cy="80%" r="50%">
          <stop offset="0%" stopColor="#fff7c2"/>
          <stop offset="40%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#FF6B00"/>
        </radialGradient>
        <radialGradient id="flameCore" cx="50%" cy="70%" r="40%">
          <stop offset="0%" stopColor="white"/>
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Flame */}
      <AnimatePresence>
        {!candleBlown && (
          <motion.g
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            style={{ transformOrigin: '110px 26px' }}
          >
            {/* Glow */}
            <circle cx="110" cy="18" r="14" fill="rgba(255,180,0,0.15)" />
            {/* Outer flame */}
            <ellipse cx="110" cy="14" rx="7" ry="13" fill="url(#flameGrad)" className="flame" />
            {/* Inner flame */}
            <ellipse cx="110" cy="17" rx="4" ry="8" fill="url(#flameCore)" className="flame"
              style={{ animationDelay: '0.05s' }} />
            {/* Bright tip */}
            <circle cx="110" cy="7" r="2.5" fill="white" opacity="0.9" />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Smoke after blow */}
      {candleBlown && (
        <>
          <motion.ellipse cx="110" cy="24" rx="3" ry="5" fill="rgba(200,200,200,0.4)"
            initial={{ opacity: .6, scaleX: 1, y: 0 }}
            animate={{ opacity: 0, scaleX: 3, y: -40 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />
          <motion.ellipse cx="107" cy="20" rx="2" ry="4" fill="rgba(180,180,180,0.3)"
            initial={{ opacity: .5, scaleX: 1, y: 0 }}
            animate={{ opacity: 0, scaleX: 2.5, y: -35 }}
            transition={{ duration: 1.2, delay: 0.15, ease: 'easeOut' }}
          />
        </>
      )}

      {/* Bottom plate */}
      <ellipse cx="110" cy="242" rx="80" ry="8" fill="#880e4f" opacity="0.7" />
    </svg>
  );
}

// ── Floating ambient elements ─────────────────────────────────
const PETALS = ['🌸','🌺','🌹','💮','🌷'];
const BALLOONS_DATA = [
  { emoji: '🎈', left: '5%',  size: 36, dur: 12, delay: 0   },
  { emoji: '🎀', left: '15%', size: 28, dur: 14, delay: -4  },
  { emoji: '🎈', left: '80%', size: 40, dur: 10, delay: -2  },
  { emoji: '🎉', left: '90%', size: 32, dur: 13, delay: -6  },
  { emoji: '🎈', left: '50%', size: 30, dur: 11, delay: -8  },
  { emoji: '🎀', left: '65%', size: 26, dur: 15, delay: -3  },
];

export default function BirthdayCelebration({ onOpenNote }: Props) {
  const [candleBlown, setCandleBlown] = useState(false);
  const [wishMade, setWishMade] = useState(false);
  const celebrationRef = useRef<HTMLDivElement>(null);

  const petals = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: PETALS[i % PETALS.length],
    left: `${(i * 5 + 3) % 100}%`,
    size: 16 + (i % 3) * 8,
    dur: 8 + (i % 6) * 1.5,
    delay: -(i * 0.7),
  }));

  const sparkles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    top: `${10 + (i * 7) % 80}%`,
    left: `${(i * 7 + 5) % 95}%`,
    size: 8 + (i % 3) * 6,
    dur: 1.5 + (i % 4) * 0.5,
    delay: -(i * 0.4),
  }));

  const blowCandle = () => {
    if (wishMade) return;
    setCandleBlown(true);

    // Confetti burst
    const fire = (opts: confetti.Options) => confetti({ ...opts, disableForReducedMotion: true });

    setTimeout(() => {
      fire({ particleCount: 100, spread: 90, origin: { y: 0.55 }, colors: ['#f43f5e','#fda4af','#f59e0b','#fcd34d','#ec4899'] });
    }, 200);
    setTimeout(() => {
      fire({ particleCount: 60, spread: 60, origin: { y: 0.55, x: 0.3 }, angle: 60 });
      fire({ particleCount: 60, spread: 60, origin: { y: 0.55, x: 0.7 }, angle: 120 });
    }, 500);
    setTimeout(() => {
      fire({ particleCount: 40, spread: 120, origin: { y: 0.4 }, startVelocity: 25 });
    }, 800);

    setTimeout(() => setWishMade(true), 700);
  };

  return (
    <motion.div
      ref={celebrationRef}
      className="fixed inset-0 bg-romantic-celebration overflow-y-auto overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* ── Ambient elements ── */}
      {petals.map(p => (
        <span key={p.id} className="petal" style={{ left: p.left, fontSize: p.size, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}>
          {p.emoji}
        </span>
      ))}
      {BALLOONS_DATA.map((b, i) => (
        <span key={i} className="balloon" style={{ left: b.left, fontSize: b.size, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s`, bottom: '-60px' }}>
          {b.emoji}
        </span>
      ))}
      {sparkles.map(s => (
        <span key={s.id} className="sparkle" style={{ top: s.top, left: s.left, fontSize: s.size, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}>
          ✨
        </span>
      ))}

      {/* Radial glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(244,63,94,0.1) 0%, transparent 70%)' }} />

      {/* ── Content ── */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 py-10 sm:py-16">

        {/* Heading */}
        <motion.div
          className="text-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold leading-tight"
            style={{
              background: 'linear-gradient(135deg, #fda4af 0%, #f43f5e 40%, #f59e0b 70%, #fcd34d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: "1.2",
              textShadow: 'none',
              filter: 'drop-shadow(0 2px 12px rgba(244,63,94,0.4))',
            }}
          >
            🎂 Happy Birthday 🎂
          </h1>
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold mt-1"
            style={{
              background: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 40%, #fda4af 70%, #f43f5e 100%)',
              WebkitBackgroundClip: 'text',
              lineHeight: "1.2",
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 16px rgba(245,158,11,0.5))',
            }}
          >
            {CONFIG.BIRTHDAY_NAME}
          </h2>
          <motion.p
            className="text-base sm:text-xl mt-3 font-display italic"
            style={{ color: 'rgba(253,164,175,0.85)' }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            May all your dreams come true Buddammaa ❤️
          </motion.p>
        </motion.div>


        <motion.div
          className="w-full max-w-4xl mb-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div
            className="
            bg-white/10
            backdrop-blur-xl
            rounded-3xl
            p-4
            border border-pink-400/30
            shadow-[0_20px_60px_rgba(255,0,100,0.3)]
        "
          >
            <VideoPlayer videoSrc="/birthday-video.mp4" />
          </div>
        </motion.div>

        {/* Cake */}
        <motion.div
          className="relative mb-8 sm:mb-10"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, type: 'spring', stiffness: 100 }}
          style={{ width: 'min(240px, 68vw)', height: 'min(290px, 82vw)' }}
        >
          {/* Glow behind cake */}
          {!candleBlown && (
            <div className="absolute inset-0 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)', transform: 'scale(1.2)' }} />
          )}
          <BirthdayCake candleBlown={candleBlown} />
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <button
            onClick={blowCandle}
            disabled={wishMade}
            className="btn-luxury flex-1 py-4 rounded-2xl text-base sm:text-lg transition-all"
            style={wishMade ? { opacity: 0.7, cursor: 'default', background: 'linear-gradient(135deg,#16a34a,#15803d)' } : {}}
          >
            {wishMade ? 'Wish Made ❤️' : 'Blow The Candle 🕯️'}
          </button>

          <button
            onClick={onOpenNote}
            className="btn-outline flex-1 py-4 rounded-2xl text-base sm:text-lg font-bold"
          >
            Open My Special Note ❤️
          </button>
        </motion.div>

        {/* Decorative hearts row */}
        <motion.div
          className="flex gap-3 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {['💕','💖','🌹','💗','💓'].map((h, i) => (
            <span key={i} className="text-xl"
              style={{ animation: `floatGentle ${2 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}>
              {h}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
