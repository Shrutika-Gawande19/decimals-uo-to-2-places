import { useState, useEffect, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { reflectNarration } from '../utils/narration';

const REFLECT_QUESTIONS = [
  {
    q: 'In the number 5.38, what is the value of the digit 3?',
    options: [
      { text: '3 tenths = 0.3', correct: true,  emoji: '✅' },
      { text: '3 hundredths = 0.03', correct: false, emoji: '❌' },
      { text: '3 ones = 3', correct: false, emoji: '❌' },
    ],
  },
  {
    q: 'Which statement is correct?',
    options: [
      { text: '4.05 < 4.5 because 0 tenths < 5 tenths', correct: true,  emoji: '✅' },
      { text: '4.05 > 4.5 because 4.05 has more digits', correct: false, emoji: '❌' },
      { text: '4.05 = 4.5 because both start with 4', correct: false, emoji: '❌' },
    ],
  },
  {
    q: 'Round 7.85 to the nearest tenth.',
    options: [
      { text: '7.9 — because 5 ≥ 5, round up',  correct: true,  emoji: '✅' },
      { text: '7.8 — because I look at the 8',    correct: false, emoji: '❌' },
      { text: '8.0 — always round up to whole',   correct: false, emoji: '❌' },
    ],
  },
];

const CONFIDENCE = [
  { emoji: '😊', label: "I can explain decimals to a friend!", color: '#4caf50' },
  { emoji: '🙂', label: "I understand most of it!",            color: '#ff9800' },
  { emoji: '😐', label: "I need more practice.",               color: '#42a5f5' },
];

function Confetti({ active }) {
  const pieces = useRef(
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      color: ['#ffc107','#e91e63','#4caf50','#2196f3','#ff5722','#9c27b0'][i % 6],
      size: 6 + Math.random() * 10,
      duration: 2.5 + Math.random() * 3,
      rotate: Math.random() * 360,
    }))
  ).current;

  if (!active) return null;
  return (
    <>
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            width: p.size, height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </>
  );
}

export default function ReflectPhase({ stats, audioEnabled, onRestart, onGoHome }) {
  const [step, setStep] = useState(0); // 0=stats, 1=teach, 2=confidence, 3=certificate
  const [teachIdx, setTeachIdx] = useState(0);

  useEffect(() => {
    if (audioEnabled && step === 0) {
      narrate(reflectNarration(), true);
    } else if (!audioEnabled) {
      stopNarration();
    }
    return () => stopNarration();
  }, [audioEnabled, step]);
  const [teachCorrect, setTeachCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [chosenOpt, setChosenOpt] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [confetti, setConfetti] = useState(false);

  const worldResults = stats?.worldResults || {};
  const totalWorlds = Object.keys(worldResults).length;
  const totalStars = Object.values(worldResults).reduce((a, r) => {
    const pct = r.correct / 10;
    return a + (pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.5 ? 1 : 0);
  }, 0);
  const totalCorrect = Object.values(worldResults).reduce((a, r) => a + r.correct, 0);
  const pct = totalWorlds > 0 ? Math.round((totalCorrect / (totalWorlds * 10)) * 100) : 0;

  useEffect(() => {
    if (step === 3) setConfetti(true);
  }, [step]);

  const handleTeachAnswer = (opt) => {
    if (answered) return;
    setAnswered(true);
    setChosenOpt(opt);
    if (opt.correct) setTeachCorrect(n => n + 1);
  };

  const nextTeach = () => {
    if (teachIdx < REFLECT_QUESTIONS.length - 1) {
      setTeachIdx(i => i + 1);
      setAnswered(false);
      setChosenOpt(null);
    } else {
      setStep(2);
    }
  };

  const q = REFLECT_QUESTIONS[teachIdx];

  return (
    <div className="phase-wrapper centered">
      <Confetti active={confetti} />
      <div className="reflect-wrapper">
        {/* Phase tag */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span className="wonder-tag">📓 Phase 5 · Reflect</span>
        </div>

        {/* Step 0: Stats */}
        {step === 0 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 className="phase-title" style={{ marginBottom: 6 }}>📊 Your Results</h2>
            <p className="phase-subtitle">Look how far you've come, Decimal Explorer!</p>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🌍</div>
                <div className="stat-value">{totalWorlds}</div>
                <div className="stat-label">Worlds Explored</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">{totalStars}</div>
                <div className="stat-label">Stars Earned</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-value">{pct}%</div>
                <div className="stat-label">Accuracy</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💎</div>
                <div className="stat-value">{totalCorrect}</div>
                <div className="stat-label">Correct Answers</div>
              </div>
            </div>

            <button className="btn btn-primary w-full" onClick={() => setStep(1)} style={{ marginTop: 8 }}>
              Teach It Back! 🎓
            </button>
          </div>
        )}

        {/* Step 1: Teach-back quiz */}
        {step === 1 && (
          <div className="reflect-question" key={teachIdx}>
            <h2 className="phase-title" style={{ marginBottom: 6 }}>🎓 Teach It Back</h2>
            <p className="phase-subtitle" style={{ marginBottom: 16 }}>
              Question {teachIdx + 1} of {REFLECT_QUESTIONS.length}
            </p>

            <div className="glass-card-sm" style={{ marginBottom: 16 }}>
              <p className="reflect-q-text">{q.q}</p>
              <div className="reflect-options">
                {q.options.map((opt, i) => {
                  const isChosen = chosenOpt === opt;
                  return (
                    <button
                      key={i}
                      id={`reflect-opt-${i}`}
                      className={`reflect-option ${isChosen && opt.correct ? 'correct' : ''} ${isChosen && !opt.correct ? 'wrong' : ''}`}
                      onClick={() => handleTeachAnswer(opt)}
                      disabled={answered}
                    >
                      <span>{opt.emoji}</span> {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>

            {answered && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary btn-sm" onClick={nextTeach} id="teach-next-btn">
                  {teachIdx < REFLECT_QUESTIONS.length - 1 ? 'Next Question →' : 'Check Confidence →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Confidence */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 className="phase-title" style={{ marginBottom: 6 }}>🧠 How do you feel?</h2>
            <p className="phase-subtitle">About decimals up to 2 decimal places:</p>

            <div className="confidence-picker" style={{ marginTop: 20 }}>
              {CONFIDENCE.map((c, i) => (
                <button
                  key={i}
                  id={`confidence-${i}`}
                  className="confidence-btn"
                  onClick={() => { setConfidence(c); setStep(3); }}
                  style={{ borderColor: confidence === c ? c.color : undefined }}
                >
                  <span className="confidence-emoji">{c.emoji}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Certificate */}
        {step === 3 && (
          <div style={{ animation: 'bounceIn 0.7s ease' }}>
            <div className="certificate-card">
              <span className="certificate-trophy">🏆</span>
              <div className="certificate-title">Decimal Explorer</div>
              <p className="certificate-subtitle">
                This certificate is awarded for completing the<br />
                <strong>Decimals up to 2 Decimal Places</strong> module!
              </p>

              <div className="stats-grid" style={{ maxWidth: 360, margin: '0 auto 24px' }}>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-value">{totalStars}</div>
                  <div className="stat-label">Stars</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎓</div>
                  <div className="stat-value">{teachCorrect}/{REFLECT_QUESTIONS.length}</div>
                  <div className="stat-label">Teach-Back</div>
                </div>
              </div>

              {confidence && (
                <div style={{
                  background: 'rgba(255,255,255,0.06)', borderRadius: 12,
                  padding: '12px 20px', marginBottom: 24, fontSize: '1rem',
                  color: 'var(--text-secondary)'
                }}>
                  {confidence.emoji} {confidence.label}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" id="play-again-btn" onClick={onRestart}>
                  🔄 Play Again
                </button>
                <button className="btn btn-outline" onClick={onGoHome}>
                  🏠 Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
