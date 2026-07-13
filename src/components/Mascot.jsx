import React from 'react';

const MASCOT_FACES = {
  idle:         '🤖',
  curious:      '🧐',
  happy:        '😄',
  thinking:     '🤔',
  celebrating:  '🎉',
  encouraging:  '💪',
};

const Mascot = ({ mood = 'idle', message = '', size = 80 }) => {
  return (
    <div className="mascot-wrap" aria-live="polite" aria-atomic="true">
      {message && (
        <div className="mascot-bubble" role="status">
          {message}
        </div>
      )}
      <div
        className={`mascot-body ${mood}`}
        style={{ width: size, height: size, fontSize: size * 0.7 }}
        role="img"
        aria-label={`LearnFlow mascot — ${mood}`}
      >
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #4A90D9 0%, #845EC2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(74,144,217,0.3)',
          fontSize: size * 0.5,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Shine */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '15%',
            width: '30%',
            height: '15%',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
            transform: 'rotate(-15deg)',
          }} />
          {MASCOT_FACES[mood] || MASCOT_FACES.idle}
        </div>
      </div>
    </div>
  );
};

export default Mascot;
