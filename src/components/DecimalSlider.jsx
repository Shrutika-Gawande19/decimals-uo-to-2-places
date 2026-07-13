import { useState, useEffect } from 'react';

const CHALLENGES = [
  { target: 3.45, label: 'three point four five' },
  { target: 6.08, label: 'six point zero eight' },
  { target: 2.30, label: 'two point three zero' },
  { target: 1.75, label: 'one point seven five' },
  { target: 0.90, label: 'zero point nine zero' },
];

export default function DecimalSlider({ onComplete }) {
  const [tenths, setTenths] = useState(0);
  const [hundredths, setHundredths] = useState(0);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [matched, setMatched] = useState(false);
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const challenge = CHALLENGES[challengeIdx];
  const onesVal = Math.floor(challenge.target);
  const currentVal = onesVal + tenths * 0.1 + hundredths * 0.01;
  const displayVal = currentVal.toFixed(2);

  useEffect(() => {
    // Reset sliders when challenge changes
    setTenths(0);
    setHundredths(0);
    setMatched(false);
    setShowSuccess(false);
  }, [challengeIdx]);

  const handleCheck = () => {
    const correct = Math.abs(currentVal - challenge.target) < 0.001;
    if (correct) {
      setMatched(true);
      setShowSuccess(true);
      setTimeout(() => {
        if (challengeIdx < CHALLENGES.length - 1) {
          setChallengeIdx(i => i + 1);
          setRound(r => r + 1);
        } else {
          setDone(true);
          setTimeout(onComplete, 1500);
        }
      }, 1600);
    } else {
      // Shake feedback — reset
      setTenths(0);
      setHundredths(0);
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
    <div className="slider-wrapper">
      <div className="station-header">
        🎚️ Decimal Slider — Round {round + 1} of {CHALLENGES.length}
      </div>

      {/* Challenge prompt */}
      <div className="slider-challenge">
        <div className="slider-challenge-text">🎯 Set the sliders to match:</div>
        <div className="slider-challenge-target">{challenge.target.toFixed(2)}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{challenge.label}</div>
      </div>

      {/* Live display */}
      <div className="slider-display">
        <span style={{ color: 'var(--text-primary)' }}>{onesVal}</span>
        <span className="sd-decimal">.</span>
        <span className="sd-tenths">{tenths}</span>
        <span className="sd-hundredths">{hundredths}</span>
      </div>

      {/* Breakdown pills */}
      <div className="slider-breakdown">
        <div className="slider-pill ones">{onesVal} <span style={{ opacity: 0.6 }}>one{onesVal !== 1 ? 's' : ''}</span></div>
        <div className="slider-pill tenths">{tenths} <span style={{ opacity: 0.6 }}>tenth{tenths !== 1 ? 's' : ''}</span></div>
        <div className="slider-pill hundredths">{hundredths} <span style={{ opacity: 0.6 }}>hundredth{hundredths !== 1 ? 's' : ''}</span></div>
      </div>

      {/* Sliders */}
      <div className="slider-controls">
        <div className="slider-row">
          <span className="slider-row-label tenths">Tenths:</span>
          <input
            type="range" min={0} max={9} value={tenths}
            className="tenths-slider"
            onChange={e => setTenths(Number(e.target.value))}
            disabled={matched}
          />
          <span className="slider-val" style={{ color: '#a5d6a7' }}>{tenths}</span>
        </div>
        <div className="slider-row">
          <span className="slider-row-label hundredths">Hundredths:</span>
          <input
            type="range" min={0} max={9} value={hundredths}
            className="hundredths-slider"
            onChange={e => setHundredths(Number(e.target.value))}
            disabled={matched}
          />
          <span className="slider-val" style={{ color: '#ce93d8' }}>{hundredths}</span>
        </div>
      </div>

      {/* Success / check */}
      {showSuccess ? (
        <div className="pvc-feedback correct" style={{ animation: 'bounceIn 0.4s ease' }}>
          ✅ Perfect! {challenge.target.toFixed(2)} matched!
        </div>
      ) : (
        <button
          id="slider-check-btn"
          className="btn btn-primary"
          onClick={handleCheck}
          disabled={matched}
        >
          ✓ Check Answer
        </button>
      )}
    </div>
  );
}
