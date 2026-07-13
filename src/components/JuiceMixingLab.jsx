import { useState, useEffect } from 'react';

const ROUNDS = [
  {
    id: 1,
    juice1Name: 'Strawberry Juice',
    juice1Emoji: '🍓',
    juice1Color: 'linear-gradient(to bottom, #ff4e50, #f9d423)',
    juice1Solid: '#ff4e50',
    amount1: 1.35,
    juice2Name: 'Orange Juice',
    juice2Emoji: '🍊',
    juice2Color: 'linear-gradient(to bottom, #f12711, #f5af19)',
    juice2Solid: '#f5af19',
    amount2: 2.40,
    maxVolume: 5.00
  },
  {
    id: 2,
    juice1Name: 'Apple Juice',
    juice1Emoji: '🍏',
    juice1Color: 'linear-gradient(to bottom, #56ab2f, #a8e063)',
    juice1Solid: '#56ab2f',
    amount1: 2.15,
    juice2Name: 'Grape Juice',
    juice2Emoji: '🍇',
    juice2Color: 'linear-gradient(to bottom, #8e2de2, #4a00e0)',
    juice2Solid: '#8e2de2',
    amount2: 1.50,
    maxVolume: 5.00
  },
  {
    id: 3,
    juice1Name: 'Mango Juice',
    juice1Emoji: '🥭',
    juice1Color: 'linear-gradient(to bottom, #f2994a, #f2c94c)',
    juice1Solid: '#f2994a',
    amount1: 0.85,
    juice2Name: 'Pineapple Juice',
    juice2Emoji: '🍍',
    juice2Color: 'linear-gradient(to bottom, #ffe000, #799f0c)',
    juice2Solid: '#ffe000',
    amount2: 3.20,
    maxVolume: 5.00
  }
];

export default function JuiceMixingLab({ onComplete }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [poured1, setPoured1] = useState(false);
  const [poured2, setPoured2] = useState(false);
  const [done, setDone] = useState(false);

  const round = ROUNDS[roundIdx];
  const totalAmount = round.amount1 + round.amount2;

  const h1 = (round.amount1 / round.maxVolume) * 100;
  const h2 = (round.amount2 / round.maxVolume) * 100;

  const handleNext = () => {
    if (roundIdx < ROUNDS.length - 1) {
      setPoured1(false);
      setPoured2(false);
      setRoundIdx(r => r + 1);
    } else {
      setDone(true);
      setTimeout(onComplete, 1500);
    }
  };

  if (done) {
    return (
      <div style={{ textAlign: 'center', animation: 'bounceIn 0.5s ease' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🍹</div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--gold)', fontWeight: 700 }}>
          Juice Lab Complete!
        </p>
      </div>
    );
  }

  return (
    <div className="juice-lab-wrapper" style={{ width: '100%', maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
      <div className="station-header" style={{ marginBottom: 8 }}>
        🧃 Juice Mixing Lab — Order {roundIdx + 1} of {ROUNDS.length}
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
        Pour the juices to see how decimals add up!
      </p>

      {/* Jug & Animation Area */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: 260, gap: 20, marginBottom: 24 }}>
        
        {/* Jug Container */}
        <div style={{
          position: 'relative',
          width: 140,
          height: 240,
          border: '4px solid rgba(255,255,255,0.4)',
          borderTop: 'none',
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          background: 'rgba(255,255,255,0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          {/* Measurement Marks */}
          {[1, 2, 3, 4].map(mark => (
            <div key={mark} style={{
              position: 'absolute',
              bottom: `${(mark / round.maxVolume) * 100}%`,
              left: 0,
              width: '100%',
              borderBottom: '1px dashed rgba(255,255,255,0.2)'
            }}>
              <span style={{ position: 'absolute', left: 4, bottom: 2, fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                {mark}L
              </span>
            </div>
          ))}

          {/* Liquid 2 (Top Layer) */}
          <div style={{
            width: '100%',
            height: poured2 ? `${h2}%` : '0%',
            background: round.juice2Color,
            transition: 'height 1.5s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            opacity: poured2 ? 1 : 0
          }}>
            {poured2 && `${round.amount2.toFixed(2)}L`}
          </div>

          {/* Liquid 1 (Bottom Layer) */}
          <div style={{
            width: '100%',
            height: poured1 ? `${h1}%` : '0%',
            background: round.juice1Color,
            transition: 'height 1.5s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            opacity: poured1 ? 1 : 0
          }}>
            {poured1 && `${round.amount1.toFixed(2)}L`}
          </div>
        </div>

        {/* Buttons next to jug */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 16 }}>
          <button 
            className="btn"
            style={{ 
              background: poured1 ? 'rgba(255,255,255,0.1)' : round.juice1Solid,
              color: poured1 ? 'rgba(255,255,255,0.5)' : 'white',
              border: 'none',
              padding: '10px 16px',
              cursor: poured1 ? 'default' : 'pointer'
            }}
            onClick={() => setPoured1(true)}
            disabled={poured1}
          >
            {round.juice1Emoji} Pour {round.amount1.toFixed(2)}L
          </button>
          
          <button 
            className="btn"
            style={{ 
              background: !poured1 || poured2 ? 'rgba(255,255,255,0.1)' : round.juice2Solid,
              color: !poured1 || poured2 ? 'rgba(255,255,255,0.5)' : 'white',
              border: 'none',
              padding: '10px 16px',
              cursor: !poured1 || poured2 ? 'default' : 'pointer'
            }}
            onClick={() => setPoured2(true)}
            disabled={!poured1 || poured2}
          >
            {round.juice2Emoji} Pour {round.amount2.toFixed(2)}L
          </button>
        </div>
      </div>

      {/* Equation Box */}
      <div style={{
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 16,
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
        marginBottom: 20
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <span style={{ color: poured1 ? round.juice1Solid : 'rgba(255,255,255,0.3)', transition: 'color 0.5s' }}>
            {poured1 ? round.amount1.toFixed(2) : '?.??'}
          </span>
          <span style={{ color: 'var(--gold)' }}>+</span>
          <span style={{ color: poured2 ? round.juice2Solid : 'rgba(255,255,255,0.3)', transition: 'color 0.5s' }}>
            {poured2 ? round.amount2.toFixed(2) : '?.??'}
          </span>
          <span style={{ color: 'var(--gold)' }}>=</span>
          <span style={{ color: poured1 && poured2 ? '#4ade80' : 'rgba(255,255,255,0.3)', transition: 'color 0.5s', fontWeight: 'bold' }}>
            {poured1 && poured2 ? totalAmount.toFixed(2) : '?.??'} L
          </span>
        </div>
      </div>

      {/* Next Button */}
      {poured1 && poured2 && (
        <button className="btn btn-primary" style={{ animation: 'bounceIn 0.4s ease' }} onClick={handleNext}>
          {roundIdx < ROUNDS.length - 1 ? "Next Order →" : "Finish Lab 🎉"}
        </button>
      )}
    </div>
  );
}
