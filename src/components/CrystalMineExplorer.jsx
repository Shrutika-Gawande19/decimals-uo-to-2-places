import { useState, useEffect } from 'react';

const ROUNDS = [
  { id: 1, target: 2.34 },
  { id: 2, target: 1.56 },
  { id: 3, target: 3.08 }
];

export default function CrystalMineExplorer({ onComplete }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [total, setTotal] = useState(0);
  const [overload, setOverload] = useState(false);
  const [success, setSuccess] = useState(false);
  const [done, setDone] = useState(false);

  const round = ROUNDS[roundIdx];

  useEffect(() => {
    // Check total against target
    // Because of floating point math, we round to 2 decimal places
    const current = Math.round(total * 100) / 100;
    const target = round.target;

    if (current > target) {
      setOverload(true);
      setTimeout(() => setOverload(false), 1000); // clear shake after 1s
    } else if (current === target && target > 0) {
      setSuccess(true);
      setTimeout(() => {
        if (roundIdx < ROUNDS.length - 1) {
          setRoundIdx(r => r + 1);
          setTotal(0);
          setSuccess(false);
        } else {
          setDone(true);
          setTimeout(onComplete, 1500);
        }
      }, 2000);
    }
  }, [total, round.target, roundIdx, onComplete]);

  const addCrystal = (amount) => {
    if (success) return; // disabled if already correct
    setTotal(prev => Math.round((prev + amount) * 100) / 100);
  };

  const reset = () => {
    setTotal(0);
    setOverload(false);
  };

  if (done) {
    return (
      <div style={{ textAlign: 'center', animation: 'bounceIn 0.5s ease' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>✨</div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--gold)', fontWeight: 700 }}>
          Mine Explored!
        </p>
      </div>
    );
  }

  return (
    <div className="crystal-mine-wrapper" style={{ width: '100%', maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
      <div className="station-header" style={{ marginBottom: 8 }}>
        💎 Crystal Mine Explorer — Cave {roundIdx + 1} of {ROUNDS.length}
      </div>
      
      {/* Target Chest Area */}
      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        borderRadius: 16, 
        padding: 20, 
        marginBottom: 24,
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 8 }}>
          The Treasure Chest requests:
        </p>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--gold)', fontWeight: 700 }}>
          {round.target}
        </div>
      </div>

      {/* Crystal Tappers */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 32 }}>
        {/* Big Crystal */}
        <button 
          onClick={() => addCrystal(1.00)}
          style={{ 
            background: 'linear-gradient(135deg, #fceabb, #f8b500)', 
            border: 'none', borderRadius: 20, padding: '16px 20px',
            boxShadow: '0 8px 24px rgba(248, 181, 0, 0.4)',
            cursor: 'pointer', transition: 'transform 0.1s',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>💎</span>
          <span style={{ color: '#1a1a2e', fontWeight: 900, marginTop: 8, fontSize: '1.1rem' }}>+1</span>
        </button>

        {/* Blue Crystal */}
        <button 
          onClick={() => addCrystal(0.10)}
          style={{ 
            background: 'linear-gradient(135deg, #4facfe, #00f2fe)', 
            border: 'none', borderRadius: 20, padding: '16px 20px',
            boxShadow: '0 8px 24px rgba(0, 242, 254, 0.4)',
            cursor: 'pointer', transition: 'transform 0.1s',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>🟦</span>
          <span style={{ color: '#1a1a2e', fontWeight: 900, marginTop: 8, fontSize: '1.1rem' }}>+0.1</span>
        </button>

        {/* Tiny Crystal */}
        <button 
          onClick={() => addCrystal(0.01)}
          style={{ 
            background: 'linear-gradient(135deg, #ff9a9e, #fecfef)', 
            border: 'none', borderRadius: 20, padding: '16px 20px',
            boxShadow: '0 8px 24px rgba(255, 154, 158, 0.4)',
            cursor: 'pointer', transition: 'transform 0.1s',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>✨</span>
          <span style={{ color: '#1a1a2e', fontWeight: 900, marginTop: 8, fontSize: '1.1rem' }}>+0.01</span>
        </button>
      </div>

      {/* Running Total & Feedback */}
      <div 
        style={{ 
          background: success ? 'rgba(74, 222, 128, 0.2)' : overload ? 'rgba(248, 113, 113, 0.2)' : 'rgba(0,0,0,0.2)',
          borderRadius: 24, 
          padding: '24px',
          border: `2px solid ${success ? '#4ade80' : overload ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
          animation: overload ? 'shake 0.4s ease' : success ? 'bounceIn 0.5s ease' : 'none',
          position: 'relative'
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: 8 }}>
          Collected Treasure:
        </p>
        <div style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: '3rem', 
          color: success ? '#4ade80' : overload ? '#f87171' : 'white', 
          fontWeight: 700 
        }}>
          {total.toFixed(2)}
        </div>

        {/* Chest Icon Feedback */}
        <div style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', fontSize: '3rem' }}>
          {success ? '🎉' : overload ? '⚠️' : '🧰'}
        </div>
      </div>

      {/* Error text & Reset */}
      <div style={{ minHeight: 40, marginTop: 16 }}>
        {overload ? (
          <p style={{ color: '#f87171', fontWeight: 600, animation: 'fadeIn 0.3s' }}>
            Oops! That's more treasure than I need.
          </p>
        ) : success ? (
          <p style={{ color: '#4ade80', fontWeight: 600, animation: 'fadeIn 0.3s' }}>
            Chest unlocked! Awesome!
          </p>
        ) : (
          total > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={reset}>
              Drop Treasure & Start Over
            </button>
          )
        )}
      </div>
    </div>
  );
}
