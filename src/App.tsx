import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PasswordGate from './components/PasswordGate';
import BirthdayCelebration from './components/BirthdayCelebration';
import LoveNote from './components/LoveNote';
import MusicPlayer from './components/MusicPlayer';

type Screen = 'gate' | 'celebration' | 'note';

export default function App() {
  const [screen, setScreen] = useState<Screen>('gate');
  const [musicStarted, setMusicStarted] = useState(false);

  const handleUnlock = () => {
    setScreen('celebration');
    setMusicStarted(true);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {screen === 'gate' && (
          <PasswordGate key="gate" onUnlock={handleUnlock} />
        )}
        {screen === 'celebration' && (
          <BirthdayCelebration key="celebration" onOpenNote={() => setScreen('note')} />
        )}
        {screen === 'note' && (
          <LoveNote key="note" onBack={() => setScreen('celebration')} />
        )}
      </AnimatePresence>

      {/* Music player — shown whenever unlocked */}
      {musicStarted && <MusicPlayer autoplay={true} />}
    </div>
  );
}
