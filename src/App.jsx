import { useState, useCallback, useEffect } from 'react';
import FloatingNumbers from './components/FloatingNumbers';
import IntroScreen from './components/IntroScreen';
import WonderPhase from './components/WonderPhase';
import StoryPhase from './components/StoryPhase';
import SimulatePhase from './components/SimulatePhase';
import PlayPhase from './components/PlayPhase';
import ReflectPhase from './components/ReflectPhase';

const PHASES = ['intro', 'wonder', 'story', 'simulate', 'play', 'reflect'];
const JOURNEY_ITEMS = [
  { icon: '🔍', label: 'Wonder' },
  { icon: '📖', label: 'Story' },
  { icon: '🧪', label: 'Simulate' },
  { icon: '🎮', label: 'Play' },
  { icon: '📓', label: 'Reflect' },
];

export default function App() {
  const [phase, setPhase] = useState('intro');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [playStats, setPlayStats] = useState(null);
  const [completedPhases, setCompletedPhases] = useState(new Set());

  const toggleAudio = useCallback(() => setAudioEnabled(p => !p), []);

  const goHome = useCallback(() => {
    setPhase('intro');
    setPlayStats(null);
  }, []);

  const advance = useCallback((from, to, statsUpdate) => {
    setCompletedPhases(prev => new Set([...prev, from]));
    if (statsUpdate) setPlayStats(statsUpdate);
    setPhase(to);
  }, []);

  const phaseIdx = PHASES.indexOf(phase);

  return (
    <div className="app-container">
      <FloatingNumbers />

      {/* Journey bar — hidden on intro */}
      {phase !== 'intro' && (
        <div className="journey-bar" role="navigation" aria-label="Learning journey">
          {JOURNEY_ITEMS.map((item, i) => {
            const phaseName = ['wonder','story','simulate','play','reflect'][i];
            const isActive = phase === phaseName;
            const isDone = completedPhases.has(phaseName);
            return (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center' }}>
                <div className={`journey-step ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}>
                  <div className="journey-step-dot">
                    {isDone ? '✓' : item.icon}
                  </div>
                  <span className="journey-step-label">{item.label}</span>
                </div>
                {i < JOURNEY_ITEMS.length - 1 && (
                  <div className={`journey-connector ${isDone ? 'filled' : ''}`} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Home button */}
      {phase !== 'intro' && (
        <button className="home-btn" onClick={goHome} aria-label="Go home">
          🏠 Home
        </button>
      )}

      {/* Audio toggle */}
      <button
        className="audio-toggle-btn"
        onClick={toggleAudio}
        aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
        title={audioEnabled ? 'Mute' : 'Unmute'}
      >
        {audioEnabled ? '🔊' : '🔇'}
      </button>

      {/* Phase content */}
      {phase === 'intro' && (
        <IntroScreen
          audioEnabled={audioEnabled}
          onStart={() => setPhase('wonder')}
        />
      )}

      {phase === 'wonder' && (
        <WonderPhase
          audioEnabled={audioEnabled}
          onComplete={() => advance('wonder', 'story')}
        />
      )}

      {phase === 'story' && (
        <StoryPhase
          audioEnabled={audioEnabled}
          onComplete={() => advance('story', 'simulate')}
        />
      )}

      {phase === 'simulate' && (
        <SimulatePhase
          audioEnabled={audioEnabled}
          onComplete={() => advance('simulate', 'play')}
        />
      )}

      {phase === 'play' && (
        <PlayPhase
          audioEnabled={audioEnabled}
          onComplete={(stats) => advance('play', 'reflect', stats)}
        />
      )}

      {phase === 'reflect' && (
        <ReflectPhase
          stats={playStats}
          audioEnabled={audioEnabled}
          onRestart={() => {
            setCompletedPhases(new Set());
            setPlayStats(null);
            setPhase('intro');
          }}
          onGoHome={goHome}
        />
      )}
    </div>
  );
}
