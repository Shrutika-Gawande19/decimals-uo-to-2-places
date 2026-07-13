import { useState, useMemo, useCallback, useEffect } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { playNarration } from '../utils/narration';
import { questionBank } from '../utils/questionBank';

const WORLDS = [
  { id: 0, name: 'Coin Corner',      icon: '🪙', color: '#ffc107', desc: 'Tenths basics' },
  { id: 1, name: 'Bakery Counter',   icon: '🥐', color: '#ff7043', desc: 'Reading decimals' },
  { id: 2, name: 'Wet Market',       icon: '🐟', color: '#4caf50', desc: 'Compare & order' },
  { id: 3, name: 'Ribbon Ruler',     icon: '🎀', color: '#e91e63', desc: 'Measurement' },
  { id: 4, name: 'Bus Fare Journey', icon: '🚌', color: '#2196f3', desc: 'Mixed medium' },
  { id: 5, name: 'MRT Station',      icon: '🚇', color: '#9c27b0', desc: 'Hard challenges' },
  { id: 6, name: 'Bookshop Budget',  icon: '📚', color: '#009688', desc: 'Word problems' },
  { id: 7, name: 'Pasar Malam',      icon: '🎪', color: '#ff5722', desc: 'Mixed hard' },
  { id: 8, name: 'Rainbow Bridge',   icon: '🌈', color: '#00bcd4', desc: 'All types' },
  { id: 9, name: 'Decimal Palace',   icon: '🏰', color: '#8bc34a', desc: 'Expert level' },
];

function calcStars(correct, total) {
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

// World Map
function WorldMap({ worldResults, onSelectWorld }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: 6 }}>
          🗺️ Choose Your World
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>Complete each world — 10 questions each!</p>
      </div>
      <div className="world-grid">
        {WORLDS.map((w, i) => {
          const result = worldResults[w.id];
          const isFirst = i === 0;
          const prevDone = i === 0 || !!worldResults[WORLDS[i - 1].id];
          const locked = !prevDone;
          const stars = result ? calcStars(result.correct, 10) : 0;
          return (
            <div
              key={w.id}
              className={`world-card ${locked ? 'locked' : ''} ${result ? 'completed' : ''}`}
              onClick={() => !locked && onSelectWorld(w.id)}
              id={`world-card-${w.id}`}
              role="button"
              tabIndex={locked ? -1 : 0}
              onKeyDown={e => e.key === 'Enter' && !locked && onSelectWorld(w.id)}
              style={{ borderColor: result ? w.color + '80' : undefined }}
            >
              {locked && <span className="world-lock">🔒</span>}
              <span className="world-icon">{w.icon}</span>
              <div className="world-name">{w.name}</div>
              <div className="world-desc">{w.desc}</div>
              {result && (
                <div className="world-stars">
                  {Array.from({ length: 3 }).map((_, si) => (
                    <span key={si} style={{ opacity: si < stars ? 1 : 0.2 }}>⭐</span>
                  ))}
                </div>
              )}
              {!result && !locked && (
                <div style={{ fontSize: '0.72rem', color: 'var(--gold)', marginTop: 4, fontWeight: 700 }}>
                  Start →
                </div>
              )}
            </div>
          );
        })}
      </div>
      {Object.keys(worldResults).length > 0 && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Completed {Object.keys(worldResults).length}/10 worlds
          </p>
        </div>
      )}
    </div>
  );
}

// Question View
function QuestionView({ worldId, onWorldComplete }) {
  const world = WORLDS[worldId];
  const questions = useMemo(() => {
    const wq = questionBank.filter(q => q.world === worldId);
    return [...wq].sort(() => Math.random() - 0.5);
  }, [worldId]);

  const [qIdx, setQIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [worldDone, setWorldDone] = useState(false);
  const [showXP, setShowXP] = useState(null);
  const [hintsShown, setHintsShown] = useState(0);

  const q = questions[qIdx];
  const totalQ = questions.length;

  const handleSelect = (opt) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    const correct = opt === q.answer;
    if (correct) {
      const xp = 10 + (streak >= 5 ? 5 : 0);
      setScore(s => s + 1);
      setStreak(s => s + 1);
      setShowXP(`+${xp} XP`);
      setTimeout(() => setShowXP(null), 1200);
    } else {
      setStreak(0);
      setLives(l => Math.max(0, l - 1));
    }
  };

  const handleNext = () => {
    if (qIdx < totalQ - 1) {
      setQIdx(i => i + 1);
      setSelected(null);
      setAnswered(false);
      setHintsShown(0);
    } else {
      setWorldDone(true);
    }
  };

  if (worldDone) {
    const stars = calcStars(score, totalQ);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div className="glass-card world-complete-card" style={{ animation: 'bounceIn 0.6s ease' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 8 }}>
            {score >= 7 ? '🏆' : '💪'}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'white', marginBottom: 4 }}>
            {score >= 7 ? 'World Clear! 🎉' : 'Good Try!'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
            You scored <strong style={{ color: 'white' }}>{score} / {totalQ}</strong> in {world.name}
          </p>
          <div className="stars-row">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`star-icon ${i < stars ? '' : 'empty'}`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                ⭐
              </span>
            ))}
          </div>
          <button
            id="world-continue-btn"
            className="btn btn-primary"
            onClick={() => onWorldComplete(worldId, { correct: score })}
            style={{ marginTop: 8, width: '100%' }}
          >
            {score >= 6 ? 'Continue →' : 'Back to Map'}
          </button>
        </div>
      </div>
    );
  }

  const isCorrect = answered && selected === q.answer;
  const isWrong = answered && selected !== q.answer;

  return (
    <div className="question-view" style={{ animation: 'fadeIn 0.3s ease' }} key={qIdx}>
      {/* XP popup */}
      {showXP && <div className="xp-popup">{showXP}</div>}

      {/* Top bar */}
      <div className="question-topbar">
        <div className="lives-display">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="life-heart" style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>
          {world.icon} {world.name} · Q{qIdx + 1}/{totalQ}
        </div>
        {streak > 0 && (
          <div className="streak-badge">🔥 {streak}</div>
        )}
      </div>

      {/* Progress bar */}
      <div className="progress-bar-container" style={{ marginBottom: 16 }}>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${((qIdx + 1) / totalQ) * 100}%` }} />
        </div>
      </div>

      {/* Question card */}
      <div className="question-card">
        <p className="question-text">{q.questionText}</p>
        <div className={`options-grid ${q.options.length <= 3 ? 'options-col' : ''}`}
          style={{ gridTemplateColumns: q.options.length <= 3 ? '1fr' : '1fr 1fr' }}
        >
          {q.options.map((opt, i) => {
            const isThis = selected === opt;
            return (
              <button
                key={i}
                id={`option-${i}`}
                className={`option-btn ${isThis && isCorrect ? 'correct' : ''} ${isThis && isWrong ? 'wrong' : ''} ${answered && opt === q.answer && !isThis ? 'correct' : ''}`}
                onClick={() => handleSelect(opt)}
                disabled={answered}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {answered && (
        <div className={`question-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
          {isCorrect ? `✅ ${q.explanation}` : `❌ The answer is ${q.answer}. ${q.explanation}`}
        </div>
      )}

      {/* Hint */}
      {!answered && hintsShown === 0 && (
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginTop: 8 }}
          onClick={() => setHintsShown(1)}
        >
          💡 Hint
        </button>
      )}
      {hintsShown > 0 && !answered && (
        <div className="hint-box" style={{ marginTop: 8 }}>
          {hintsShown === 1 ? q.hint1 : q.hint2}
          {hintsShown === 1 && (
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 8 }} onClick={() => setHintsShown(2)}>
              More hint
            </button>
          )}
        </div>
      )}

      {/* Next */}
      {answered && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button id="next-q-btn" className="btn btn-primary" onClick={handleNext}>
            {qIdx < totalQ - 1 ? 'Next →' : 'Finish World 🏁'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function PlayPhase({ onComplete, audioEnabled }) {
  const [worldResults, setWorldResults] = useState({});
  const [currentWorld, setCurrentWorld] = useState(null);

  useEffect(() => {
    if (audioEnabled && currentWorld === null) {
      narrate(playNarration(), true);
    } else {
      stopNarration();
    }
    return () => stopNarration();
  }, [audioEnabled, currentWorld]);

  const handleWorldComplete = useCallback((worldId, result) => {
    setWorldResults(prev => ({ ...prev, [worldId]: result }));
    setCurrentWorld(null);
    const allDone = Object.keys(worldResults).length + 1 >= WORLDS.length;
    if (allDone) {
      setTimeout(() => onComplete({ worldResults: { ...worldResults, [worldId]: result } }), 300);
    }
  }, [worldResults, onComplete]);

  const totalStars = Object.values(worldResults).reduce((a, r) => a + calcStars(r.correct, 10), 0);
  const doneCt = Object.keys(worldResults).length;

  return (
    <div className="phase-wrapper">
      <div className="play-wrapper">
        {/* Phase tag */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span className="wonder-tag">🎮 Phase 4 · Play</span>
        </div>

        {/* Stats row */}
        {doneCt > 0 && currentWorld === null && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
            <div className="streak-badge">⭐ {totalStars} Stars</div>
            <div className="streak-badge">🌍 {doneCt}/10 Worlds</div>
          </div>
        )}

        {currentWorld === null ? (
          <>
            <WorldMap worldResults={worldResults} onSelectWorld={setCurrentWorld} />
            {doneCt >= 1 && (
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <button className="btn btn-outline" onClick={() => onComplete({ worldResults })}>
                  Finish & Reflect →
                </button>
              </div>
            )}
          </>
        ) : (
          <QuestionView
            key={currentWorld}
            worldId={currentWorld}
            onWorldComplete={handleWorldComplete}
          />
        )}
      </div>
    </div>
  );
}
