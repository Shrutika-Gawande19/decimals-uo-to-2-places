import React, { useState, useCallback } from 'react';

const COLUMNS = [
  { key: 'ones',       label: 'Ones',       headerClass: 'ones-h',       bodyClass: 'ones-b',       discClass: 'disc-ones',       value: 1    },
  { key: 'tenths',     label: 'Tenths',     headerClass: 'tenths-h',     bodyClass: 'tenths-b',     discClass: 'disc-tenths',     value: 0.1  },
  { key: 'hundredths', label: 'Hundredths', headerClass: 'hundredths-h', bodyClass: 'hundredths-b', discClass: 'disc-hundredths', value: 0.01 },
];

const DISC_LABELS = { ones: '1', tenths: '0.1', hundredths: '0.01' };

/**
 * PlaceValueChart — interactive drag-and-drop / tap-based place value chart.
 * Props:
 *  targetNumber  — the number students must build (e.g. 3.45)
 *  mode          — 'interactive' | 'display'
 *  onSubmit(correct) — callback with whether chart is correctly built
 */
const PlaceValueChart = ({ targetNumber = 3.45, mode = 'interactive', onSubmit }) => {
  // Parse target into disc counts
  const targetOnes       = Math.floor(Math.abs(targetNumber));
  const remainder        = Math.round((Math.abs(targetNumber) - targetOnes) * 100);
  const targetTenths     = Math.floor(remainder / 10);
  const targetHundredths = remainder % 10;

  const [columns, setColumns] = useState({ ones: 0, tenths: 0, hundredths: 0 });
  const [dragOver, setDragOver] = useState(null);
  const [tapSelected, setTapSelected] = useState(null); // for tap fallback
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const getDisplay = () => {
    const o = columns.ones;
    const t = columns.tenths;
    const h = columns.hundredths;
    const val = o + t * 0.1 + h * 0.01;
    return val.toFixed(2);
  };

  const handleDragStart = (e, discType) => {
    e.dataTransfer.setData('discType', discType);
  };

  const handleDrop = useCallback((e, colKey) => {
    e.preventDefault();
    const discType = e.dataTransfer.getData('discType');
    if (discType === colKey) {
      setColumns((prev) => ({ ...prev, [colKey]: prev[colKey] + 1 }));
    }
    setDragOver(null);
  }, []);

  // Tap fallback: tap disc → tap column
  const handleTapDisc = (discType) => {
    setTapSelected(tapSelected === discType ? null : discType);
  };

  const handleTapColumn = (colKey) => {
    if (tapSelected === colKey) {
      setColumns((prev) => ({ ...prev, [colKey]: prev[colKey] + 1 }));
      setTapSelected(null);
    }
  };

  const handleRemove = (colKey) => {
    setColumns((prev) => ({ ...prev, [colKey]: Math.max(0, prev[colKey] - 1) }));
  };

  const handleSubmit = () => {
    const correct =
      columns.ones === targetOnes &&
      columns.tenths === targetTenths &&
      columns.hundredths === targetHundredths;
    setSubmitted(true);
    setIsCorrect(correct);
    onSubmit?.(correct);
  };

  const handleReset = () => {
    setColumns({ ones: 0, tenths: 0, hundredths: 0 });
    setSubmitted(false);
    setIsCorrect(null);
  };

  const displayVal = getDisplay();

  return (
    <div className="pvc-wrapper">
      {/* Target */}
      {mode === 'interactive' && (
        <p style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
          Build the number:
        </p>
      )}

      {/* Live display */}
      <div className="pvc-display" aria-live="polite" aria-label={`Current value: ${displayVal}`}>
        {displayVal.split('.').map((part, i) => (
          <React.Fragment key={i}>
            {i === 1 && <span className="decimal-point" aria-hidden="true">.</span>}
            <span>{part}</span>
          </React.Fragment>
        ))}
      </div>

      {/* Chart table */}
      <div className="pvc-table" role="region" aria-label="Place value chart">
        {COLUMNS.map((col) => (
          <div key={col.key} className={`pvc-col-header ${col.headerClass}`}>
            {col.label}
          </div>
        ))}
        {COLUMNS.map((col) => (
          <div
            key={col.key}
            className={`pvc-col-body ${col.bodyClass}${dragOver === col.key ? ' drag-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(col.key); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => handleDrop(e, col.key)}
            onClick={() => handleTapColumn(col.key)}
            aria-label={`${col.label} column — ${columns[col.key]} disc${columns[col.key] !== 1 ? 's' : ''}`}
            role="region"
          >
            {/* Placed discs */}
            {Array.from({ length: columns[col.key] }).map((_, i) => (
              <div
                key={i}
                className={`disc ${col.discClass} disc-in-chart`}
                onClick={(e) => { e.stopPropagation(); handleRemove(col.key); }}
                title="Click to remove"
                style={{ cursor: 'pointer', animationDelay: `${i * 0.05}s` }}
                aria-label={`Remove ${DISC_LABELS[col.key]} disc`}
              >
                {DISC_LABELS[col.key]}
              </div>
            ))}
            <div className="pvc-col-count">{columns[col.key]} {col.label.toLowerCase()}</div>
          </div>
        ))}
      </div>

      {/* Disc pool */}
      {mode === 'interactive' && !submitted && (
        <>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Drag discs into the correct column ↑ or tap disc then tap column
          </p>
          <div className="disc-pool" aria-label="Available discs">
            {COLUMNS.map((col) => (
              <div
                key={col.key}
                className={`disc ${col.discClass}${tapSelected === col.key ? ' dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, col.key)}
                onClick={() => handleTapDisc(col.key)}
                aria-label={`${DISC_LABELS[col.key]} disc — drag or tap`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleTapDisc(col.key)}
              >
                {DISC_LABELS[col.key]}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <button id="pvc-reset-btn" className="btn btn-ghost btn-sm" onClick={handleReset}>
              Reset
            </button>
            <button id="pvc-submit-btn" className="btn btn-primary btn-sm" onClick={handleSubmit}>
              Check My Answer ✓
            </button>
          </div>
        </>
      )}

      {/* Feedback */}
      {submitted && (
        <div
          className={`card${isCorrect ? '' : ''}`}
          style={{
            marginTop: '0.75rem',
            padding: '1rem',
            background: isCorrect ? 'var(--tenths-light)' : '#fff0f4',
            border: `2px solid ${isCorrect ? 'var(--success)' : 'var(--coral)'}`,
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            animation: isCorrect ? 'bounceIn 0.5s ease' : 'shake 0.4s ease',
          }}
          aria-live="assertive"
        >
          <span style={{ fontSize: '1.5rem' }}>{isCorrect ? '🎉' : '🔄'}</span>
          <p style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', marginTop: '0.25rem' }}>
            {isCorrect
              ? `Amazing! You built ${targetNumber.toFixed(2)}!`
              : `One disc is in the wrong place! Let's check the columns.`}
          </p>
          {!isCorrect && (
            <button className="btn btn-ghost btn-sm" style={{ marginTop: '0.5rem' }} onClick={handleReset}>
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaceValueChart;
