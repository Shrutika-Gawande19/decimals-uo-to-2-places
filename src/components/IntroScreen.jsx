import { useEffect } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { introNarration } from '../utils/narration';

const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder', desc: 'A decimals mystery!' },
  { icon: '📖', label: 'Story', desc: 'Dot explores place value' },
  { icon: '🧪', label: 'Simulate', desc: 'Build & interact' },
  { icon: '🎮', label: 'Play', desc: 'Gamified challenges' },
  { icon: '📓', label: 'Reflect', desc: 'What did you learn?' },
];

const DECO = ['💎', '0.5', '3.45', '✨', '0.1', '🔢', '6.08', '💫', '0.01', '⭐'];

export default function IntroScreen({ onStart, audioEnabled }) {
  useEffect(() => {
    if (audioEnabled) {
      narrate(introNarration(), true);
    } else {
      stopNarration();
    }
    return () => stopNarration();
  }, [audioEnabled]);
  return (
    <div className="intro-screen">
      {/* Floating decorations */}
      {DECO.map((d, i) => (
        <span
          key={i}
          className="intro-floating-deco"
          style={{
            left: `${(i * 11.3) % 95}%`,
            animationDuration: `${14 + (i * 3.1) % 12}s`,
            animationDelay: `${(i * 2.3) % 8}s`,
            fontSize: i % 3 === 0 ? '2rem' : '3rem',
          }}
        >
          {d}
        </span>
      ))}

      {/* Curriculum badge */}
      <div className="intro-badge">✨ Grade 4 · Mathematics</div>

      {/* Title */}
      <h1 className="intro-title" style={{ marginBottom: 12 }}>
        <span className="word-decimals">Decimals —</span>{' '}
        <span className="word-places" style={{ color: 'var(--coral)' }}>Up to 2 Places</span>
      </h1>
      
      {/* Subtitle */}
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>
        Lesson 1 · Introduction to decimals
      </p>

      {/* Mascot & Bubble */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
        {/* Mascot */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, #ffd54f, #ff8f00)',
          boxShadow: '0 0 20px rgba(255,193,7,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem',
          flexShrink: 0
        }}>
          🤖
        </div>
        
        {/* Bubble */}
        <div style={{
          position: 'relative',
          background: 'white', color: '#1a1a2e',
          padding: '12px 24px', borderRadius: 16,
          fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 500,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
        }}>
          {/* Arrow */}
          <div style={{
            position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)',
            width: 0, height: 0,
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            borderRight: '12px solid white'
          }} />
          Let's explore decimals! 💎
        </div>
      </div>

      <p className="intro-subtitle">
        Help <strong>Dot</strong> the Decimal Explorer collect decimal crystals scattered
        across the Sky Island — by mastering <strong>ones, tenths & hundredths!</strong>
      </p>

      {/* Journey steps */}
      <div className="intro-journey-grid">
        {JOURNEY_PHASES.map((phase) => (
          <div className="intro-journey-item" key={phase.label}>
            <div className="intro-journey-icon">{phase.icon}</div>
            <div>
              <div className="intro-journey-label">{phase.label}</div>
              <div className="intro-journey-desc">{phase.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Start button */}
      <button className="intro-start-btn" onClick={onStart} id="start-btn">
        <span>🚀</span> Begin Your Journey!
      </button>

      {/* Info chips */}
      <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { icon: '🎯', label: '100 Challenges' },
          { icon: '💎', label: 'Decimal Crystals' },
          { icon: '⭐', label: 'Stars & XP' },
        ].map(c => (
          <div
            key={c.label}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: '10px 18px',
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)'
            }}
          >
            <span>{c.icon}</span> {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}
