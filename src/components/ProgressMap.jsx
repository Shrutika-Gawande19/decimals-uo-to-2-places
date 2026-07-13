import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const PHASES = [
  { key: 'intro',    label: 'Intro',    emoji: '🏠' },
  { key: 'wonder',   label: 'Wonder',   emoji: '🔍' },
  { key: 'story',    label: 'Story',    emoji: '📖' },
  { key: 'simulate', label: 'Simulate', emoji: '🧪' },
  { key: 'play',     label: 'Play',     emoji: '🎮' },
  { key: 'reflect',  label: 'Reflect',  emoji: '💬' },
];

const ProgressMap = ({ currentPhase, phaseComplete, audioEnabled, onToggleAudio }) => {
  const currentIndex = PHASES.findIndex((p) => p.key === currentPhase);

  return (
    <header className="top-bar" role="banner">
      {/* Brand */}
      <div className="top-bar-brand">
        <div className="brand-logo" aria-hidden="true">I</div>
        <span className="brand-name">Intellia SG</span>
      </div>

      {/* Phase dots */}
      <nav className="phase-progress" aria-label="Lesson progress">
        {PHASES.map((phase, i) => {
          const isDone = phaseComplete[phase.key] || currentIndex > i;
          const isActive = phase.key === currentPhase;
          return (
            <React.Fragment key={phase.key}>
              {i > 0 && (
                <div
                  className={`phase-connector${isDone && !isActive ? ' done' : ''}`}
                  aria-hidden="true"
                />
              )}
              <div className="phase-dot-wrap">
                <div
                  className={`phase-dot${isActive ? ' active' : ''}${isDone && !isActive ? ' done' : ''}`}
                  title={phase.label}
                  aria-label={`${phase.label}${isActive ? ' (current)' : isDone ? ' (complete)' : ''}`}
                >
                  {isDone && !isActive ? '✓' : phase.emoji}
                </div>
                <span className="phase-dot-label">{phase.label}</span>
              </div>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Audio toggle */}
      <div className="top-bar-audio">
        <button
          id="audio-toggle-btn"
          className={`audio-btn${audioEnabled ? ' active' : ''}`}
          onClick={onToggleAudio}
          aria-label={audioEnabled ? 'Disable narration' : 'Enable narration'}
          title={audioEnabled ? 'Narration ON' : 'Narration OFF'}
        >
          {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>
    </header>
  );
};

export default ProgressMap;
