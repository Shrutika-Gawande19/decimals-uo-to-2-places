import React from 'react';

/**
 * DecimalBar — visual representation of a decimal as a filled bar.
 * Props: value (0–1), animated, label
 */
const DecimalBar = ({ value = 0, animated = true, label = '' }) => {
  const pct = Math.min(1, Math.max(0, value)) * 100;
  const tenths = Math.floor(value * 10);
  const hundredths = Math.floor((value * 100) % 10);

  return (
    <div className="decimal-bar-wrap">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
        <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--text-body)' }}>
          {label || value.toFixed(2)}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {tenths} tenths, {hundredths} hundredths
        </span>
      </div>

      {/* Main bar */}
      <div className="decimal-bar-track" aria-label={`${pct.toFixed(0)}% filled`} role="img">
        <div
          className="decimal-bar-fill"
          style={{ width: animated ? `${pct}%` : `${pct}%` }}
        />
      </div>

      {/* Tenths subdivisions */}
      <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const tenthVal = (i + 1) * 0.1;
          const isFilled = value >= tenthVal - 0.001;
          const isPartial = !isFilled && value >= tenthVal - 0.1 - 0.001;
          return (
            <div
              key={i}
              title={`${(i + 1)} tenths = ${((i + 1) * 0.1).toFixed(1)}`}
              style={{
                flex: 1,
                height: 20,
                borderRadius: 4,
                background: isFilled
                  ? 'linear-gradient(135deg, var(--primary), var(--purple))'
                  : isPartial
                  ? 'linear-gradient(135deg, var(--primary-light), var(--purple-light))'
                  : 'var(--bg-alt)',
                border: '1px solid var(--border)',
                transition: animated ? 'background 0.5s ease' : 'none',
                position: 'relative',
              }}
            >
              {i === 9 && (
                <span style={{
                  position: 'absolute',
                  bottom: '-18px',
                  right: 0,
                  fontSize: '0.6rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-head)',
                }}>1</span>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '22px' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-head)' }}>0</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-head)' }}>← 10 tenths →</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-head)' }}>1</span>
      </div>
    </div>
  );
};

export default DecimalBar;
