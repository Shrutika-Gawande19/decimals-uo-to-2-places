import { useState, useCallback, useEffect } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import {
  simulateStation0Narration,
  simulateStation1Narration,
  simulateStation2Narration,
  simulateAllDoneNarration,
  simulateCorrectRoundNarration,
} from '../utils/narration';
import JuiceMixingLab from './JuiceMixingLab';
import CrystalMineExplorer from './CrystalMineExplorer';

// ── Place Value Chart (Station 0) ────────────────────────────────
const COLUMNS = [
  { key: 'ones',       label: 'Ones',       hClass: 'ones-h',       bClass: 'ones-b',       dClass: 'disc-ones',       disc: '1'    },
  { key: 'tenths',     label: 'Tenths',     hClass: 'tenths-h',     bClass: 'tenths-b',     dClass: 'disc-tenths',     disc: '0.1'  },
  { key: 'hundredths', label: 'Hundredths', hClass: 'hundredths-h', bClass: 'hundredths-b', dClass: 'disc-hundredths', disc: '0.01' },
];

const SIM_A_ROUNDS = [1.20, 3.45, 5.06];

function PlaceValueStation({ onComplete, audioEnabled }) {
  const [round, setRound] = useState(0);
  const [cols, setCols] = useState({ ones: 0, tenths: 0, hundredths: 0 });
  const [dragOver, setDragOver] = useState(null);
  const [tapSel, setTapSel] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [done, setDone] = useState(false);

  const target = SIM_A_ROUNDS[round];
  const tOnes = Math.floor(target);
  const rem = Math.round((target - tOnes) * 100);
  const tTenths = Math.floor(rem / 10);
  const tHundredths = rem % 10;

  const displayVal = (cols.ones + cols.tenths * 0.1 + cols.hundredths * 0.01).toFixed(2);

  const handleDrop = useCallback((e, key) => {
    e.preventDefault();
    const disc = e.dataTransfer.getData('disc');
    if (disc === key) setCols(p => ({ ...p, [key]: p[key] + 1 }));
    setDragOver(null);
  }, []);

  const handleTapDisc = (key) => setTapSel(tapSel === key ? null : key);
  const handleTapCol  = (key) => {
    if (tapSel === key) { setCols(p => ({ ...p, [key]: p[key] + 1 })); setTapSel(null); }
  };
  const handleRemove  = (key) => setCols(p => ({ ...p, [key]: Math.max(0, p[key] - 1) }));
  const handleReset   = () => { setCols({ ones: 0, tenths: 0, hundredths: 0 }); setSubmitted(false); setIsCorrect(null); setTapSel(null); };

  const handleSubmit = () => {
    const correct = cols.ones === tOnes && cols.tenths === tTenths && cols.hundredths === tHundredths;
    setSubmitted(true);
    setIsCorrect(correct);
    if (correct) {
      // Play celebration for correct answer
      if (audioEnabled) narrate(simulateCorrectRoundNarration(), true);
      setTimeout(() => {
        if (round < SIM_A_ROUNDS.length - 1) {
          setRound(r => r + 1);
          setCols({ ones: 0, tenths: 0, hundredths: 0 });
          setSubmitted(false); setIsCorrect(null);
        } else {
          setDone(true);
          setTimeout(onComplete, 1500);
        }
      }, 1600);
    }
  };

  if (done) {
    return (
      <div style={{ textAlign: 'center', animation: 'bounceIn 0.5s ease' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--gold)', fontWeight: 700 }}>
          Station Complete!
        </p>
      </div>
    );
  }

  return (
    <div className="pvc-wrapper">
      <div className="station-header">
        🏗️ Build the Number — Round {round + 1} of {SIM_A_ROUNDS.length}
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Drag discs into the correct column ↑ or tap a disc then tap a column
      </p>

      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
        Build the number:
      </div>
      <div className="pvc-target">{target.toFixed(2)}</div>

      <div className="pvc-display" aria-live="polite">
        {displayVal.split('').map((ch, i) =>
          ch === '.' ? <span key={i} className="decimal-point">.</span> : <span key={i}>{ch}</span>
        )}
      </div>

      <div className="pvc-table" style={{ width: '100%', maxWidth: 480 }} role="region" aria-label="Place value chart">
        {COLUMNS.map(col => <div key={col.key} className={`pvc-col-header ${col.hClass}`}>{col.label}</div>)}
        {COLUMNS.map(col => (
          <div
            key={col.key}
            className={`pvc-col-body ${col.bClass}${dragOver === col.key ? ' drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(col.key); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => handleDrop(e, col.key)}
            onClick={() => handleTapCol(col.key)}
            role="region"
            aria-label={`${col.label} — ${cols[col.key]}`}
          >
            {Array.from({ length: cols[col.key] }).map((_, i) => (
              <div
                key={i}
                className={`disc ${col.dClass} disc-in-chart`}
                onClick={e => { e.stopPropagation(); handleRemove(col.key); }}
                title="Click to remove"
                style={{ cursor: 'pointer' }}
              >
                {col.disc}
              </div>
            ))}
            <div className="pvc-col-count">{cols[col.key]}</div>
          </div>
        ))}
      </div>

      {!submitted && (
        <div className="disc-pool">
          {COLUMNS.map(col => (
            <div
              key={col.key}
              className={`disc ${col.dClass}${tapSel === col.key ? ' disc-in-chart' : ''}`}
              draggable
              onDragStart={e => e.dataTransfer.setData('disc', col.key)}
              onClick={() => handleTapDisc(col.key)}
              role="button" tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleTapDisc(col.key)}
              aria-label={`${col.disc} disc`}
              style={{ outline: tapSel === col.key ? '3px solid var(--gold)' : undefined }}
            >
              {col.disc}
            </div>
          ))}
        </div>
      )}

      {!submitted && (
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={handleReset}>Reset</button>
          <button id="pvc-submit-btn" className="btn btn-primary btn-sm" onClick={handleSubmit}>
            ✓ Check
          </button>
        </div>
      )}

      {submitted && (
        <div
          className={`pvc-feedback ${isCorrect ? 'correct' : 'wrong'}`}
          style={{ width: '100%', maxWidth: 480, animation: isCorrect ? 'bounceIn 0.4s ease' : 'shake 0.4s ease' }}
        >
          {isCorrect
            ? `🎉 Amazing! You built ${target.toFixed(2)} perfectly!`
            : `🔄 Not quite — check your columns! Ones: ${tOnes}, Tenths: ${tTenths}, Hundredths: ${tHundredths}`}
          {!isCorrect && (
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 12 }} onClick={handleReset}>
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main SimulatePhase ────────────────────────────────────────────
const STATIONS = [
  { id: 0, label: 'Build It', icon: '🏗️', subtitle: 'Place Value Chart' },
  { id: 1, label: 'Mix It',   icon: '🧃', subtitle: 'Juice Lab' },
  { id: 2, label: 'Mine It',  icon: '💎', subtitle: 'Crystal Mine' },
];

export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState([false, false, false]);

  /**
   * Per doc §5 — narrate station 0 intro on mount.
   * When `current` changes (user moves to next station) play that station's narration.
   * stopNarration() in cleanup prevents overlap when switching.
   */
  useEffect(() => {
    if (audioEnabled) {
      if (current === 0) narrate(simulateStation0Narration(), true);
      if (current === 1) narrate(simulateStation1Narration(), true);
      if (current === 2) narrate(simulateStation2Narration(), true);
    } else {
      stopNarration();
    }
    return () => stopNarration();
  }, [current, audioEnabled]);

  const handleStationComplete = (idx) => {
    const newDone = [...done];
    newDone[idx] = true;
    setDone(newDone);
    if (idx < 2) {
      setTimeout(() => setCurrent(idx + 1), 600);
    } else {
      // All three done
      if (audioEnabled) {
        setTimeout(() => narrate(simulateAllDoneNarration(), true), 700);
      }
    }
  };

  const allDone = done.every(Boolean);

  return (
    <div className="phase-wrapper">
      <div className="simulate-wrapper">
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span className="wonder-tag">🧪 Phase 3 · Simulate</span>
        </div>

        <div className="station-tabs" role="tablist">
          {STATIONS.map((s) => (
            <button
              key={s.id}
              className={`station-tab-btn ${current === s.id ? 'active' : ''} ${done[s.id] ? 'done' : ''}`}
              role="tab"
              aria-selected={current === s.id}
              onClick={() => (done[s.id - 1] !== false || s.id === 0) ? setCurrent(s.id) : null}
              id={`station-tab-${s.id}`}
            >
              <span className="station-tab-icon">{done[s.id] ? '✅' : s.icon}</span>
              <span>{s.label}</span>
              <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>{s.subtitle}</span>
            </button>
          ))}
        </div>

        <div
          className="glass-card"
          style={{ width: '100%', padding: 28, minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          {!allDone ? (
            <>
              {current === 0 && <PlaceValueStation key="a" audioEnabled={audioEnabled} onComplete={() => handleStationComplete(0)} />}
              {current === 1 && <JuiceMixingLab    key="b" onComplete={() => handleStationComplete(1)} />}
              {current === 2 && <CrystalMineExplorer key="c" onComplete={() => handleStationComplete(2)} />}
            </>
          ) : (
            <div style={{ textAlign: 'center', animation: 'bounceIn 0.6s ease' }}>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>🦆</div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold)', marginBottom: 8 }}>
                All Stations Complete!
              </p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                You are a true Decimal Explorer! 🚀
              </p>
              <button className="btn btn-primary btn-lg" onClick={onComplete} id="simulate-complete-btn">
                To the Challenge! →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
