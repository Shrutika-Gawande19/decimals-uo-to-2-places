import React, { useEffect, useRef } from 'react';

const BottomBar = ({ xp, totalStars, streak, xpFloat }) => {
  const xpRef = useRef(null);

  return (
    <footer className="bottom-bar" role="contentinfo">
      {/* XP */}
      <div className="bottom-stat xp" id="xp-counter" aria-label={`${xp} XP`}>
        <span className="stat-icon">⚡</span>
        <span>{xp}</span>
        {xpFloat && (
          <span className="xp-float" key={xpFloat.key} aria-hidden="true">
            +{xpFloat.amount}
          </span>
        )}
      </div>

      {/* Stars */}
      <div className="bottom-stat stars" id="star-counter" aria-label={`${totalStars} stars`}>
        <span className="stat-icon">⭐</span>
        <span>{totalStars}</span>
      </div>

      {/* Streak */}
      <div
        className={`bottom-stat streak${streak >= 5 ? ' hot' : ''}`}
        id="streak-counter"
        aria-label={`Streak: ${streak}`}
      >
        <span className="stat-icon">{streak >= 5 ? '🔥' : '💫'}</span>
        <span>{streak}</span>
      </div>
    </footer>
  );
};

export default BottomBar;
