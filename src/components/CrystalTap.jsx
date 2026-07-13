import { useState, useEffect } from 'react';

// 9 crystals — 3 of each type
const generateCrystals = () => {
  const numbers = [
    { val: 3.45, type: 'ones',       display: '3', label: '3 Ones = 3',       gem: '🟦' },
    { val: 3.45, type: 'tenths',     display: '4', label: '4 Tenths = 0.4',    gem: '🟩' },
    { val: 3.45, type: 'hundredths', display: '5', label: '5 Hundredths = 0.05',gem: '🟪' },
    { val: 6.08, type: 'ones',       display: '6', label: '6 Ones = 6',       gem: '🟦' },
    { val: 6.08, type: 'tenths',     display: '0', label: '0 Tenths = 0',      gem: '🟩' },
    { val: 6.08, type: 'hundredths', display: '8', label: '8 Hundredths = 0.08',gem: '🟪' },
    { val: 2.30, type: 'ones',       display: '2', label: '2 Ones = 2',       gem: '🟦' },
    { val: 2.30, type: 'tenths',     display: '3', label: '3 Tenths = 0.3',    gem: '🟩' },
    { val: 2.30, type: 'hundredths', display: '0', label: '0 Hundredths = 0',  gem: '🟪' },
  ];
  // Shuffle
  return numbers.map((c, i) => ({ ...c, id: i, flipped: false })).sort(() => Math.random() - 0.5);
};

const GEM_EMOJIS = { ones: '💎', tenths: '💚', hundredths: '💜' };
const GEM_LABELS_FRONT = ['3.45', '6.08', '2.30', '3.45', '6.08', '2.30', '3.45', '6.08', '2.30'];

export default function CrystalTap({ onComplete }) {
  const [crystals, setCrystals] = useState(() => generateCrystals());
  const [flippedCount, setFlippedCount] = useState(0);
  const [done, setDone] = useState(false);

  const handleTap = (id) => {
    setCrystals(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setFlippedCount(n => {
      const next = n + 1;
      if (next === 9) {
        setDone(true);
        setTimeout(onComplete, 1800);
      }
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
      <div className="station-header">💎 Crystal Tap — Reveal the Place Values</div>

      <p className="crystal-instruction">
        Tap each crystal to reveal its place value hidden inside!
      </p>

      <div className="crystal-grid">
        {crystals.map((c) => (
          <div
            key={c.id}
            className={`crystal-card ${c.flipped ? 'flipped' : ''}`}
            onClick={() => !c.flipped && handleTap(c.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && !c.flipped && handleTap(c.id)}
            aria-label={c.flipped ? `${c.label}` : 'Tap to reveal'}
            id={`crystal-${c.id}`}
          >
            {/* Front */}
            <div className="crystal-face crystal-front">
              <span style={{ fontSize: '2.2rem' }}>{GEM_EMOJIS[c.type]}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                {c.val.toFixed(2)}
              </span>
            </div>

            {/* Back */}
            <div className={`crystal-face crystal-back ${c.type}`}>
              <div className="crystal-val">{c.display}</div>
              <div className="crystal-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <p className="crystal-progress">
        {done
          ? '🎉 All crystals revealed! Amazing work!'
          : `${flippedCount} / 9 crystals revealed`}
      </p>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: '💎 Ones', cls: 'ones' },
          { label: '💚 Tenths', cls: 'tenths' },
          { label: '💜 Hundredths', cls: 'hundredths' },
        ].map(l => (
          <span
            key={l.label}
            className={`slider-pill ${l.cls}`}
            style={{ fontSize: '0.8rem', padding: '5px 12px' }}
          >
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
