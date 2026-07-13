import React, { useState, useRef, useCallback } from 'react';

/**
 * NumberLine — SVG-based horizontal number line with draggable markers.
 * Props:
 *  markers       — array of { label, value } objects to be placed
 *  start, end    — number line range
 *  step          — major tick interval
 *  onComplete(allCorrect) — callback when all markers placed
 */
const NumberLine = ({
  markers = [],
  start = 0,
  end = 5,
  step = 1,
  onComplete,
}) => {
  const [placed, setPlaced] = useState({}); // label → { placed: bool, correct: bool, x }
  const [dragging, setDragging] = useState(null);
  const [zoomTenths, setZoomTenths] = useState(false);
  const svgRef = useRef(null);

  const W = 600, H = 120, TRACK_Y = 70, TICK_MAJOR = 20, TICK_MINOR = 10;
  const MARKER_R = 22;
  const TOLERANCE = (W / (end - start)) * step * 0.35;

  const xForValue = useCallback((val) => {
    return 40 + ((val - start) / (end - start)) * (W - 80);
  }, [start, end, W]);

  const valueForX = useCallback((x) => {
    const ratio = (x - 40) / (W - 80);
    const raw = start + ratio * (end - start);
    // Snap to nearest step/10
    const snap = zoomTenths ? 0.01 : 0.1;
    return Math.round(raw / snap) * snap;
  }, [start, end, W, zoomTenths]);

  const majorTicks = [];
  for (let v = start; v <= end + 1e-9; v = Math.round((v + step) * 1000) / 1000) {
    majorTicks.push(v);
  }

  const minorTicks = [];
  const minorStep = step / 10;
  for (let v = start; v <= end + 1e-9; v = Math.round((v + minorStep) * 10000) / 10000) {
    if (!majorTicks.some((t) => Math.abs(t - v) < 1e-9)) minorTicks.push(v);
  }

  const handleSvgMouseMove = (e) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const svgX = ((clientX - rect.left) / rect.width) * W;
    setDragging((d) => ({ ...d, x: Math.max(40, Math.min(W - 40, svgX)) }));
  };

  const handleSvgMouseUp = (e) => {
    if (!dragging) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const svgX = ((clientX - rect.left) / rect.width) * W;
    const snappedX = Math.max(40, Math.min(W - 40, svgX));
    const placedValue = valueForX(snappedX);
    const correct = Math.abs(placedValue - dragging.targetValue) <= Math.abs((end - start) * 0.05 + 0.005);

    const correctX = xForValue(dragging.targetValue);
    setPlaced((prev) => ({
      ...prev,
      [dragging.label]: { placed: true, correct, x: correct ? correctX : snappedX },
    }));
    setDragging(null);

    // Check all placed
    const newPlaced = { ...placed, [dragging.label]: { placed: true, correct, x: correct ? correctX : snappedX } };
    if (markers.every((m) => newPlaced[m.label]?.placed)) {
      const allCorrect = markers.every((m) => newPlaced[m.label]?.correct);
      setTimeout(() => onComplete?.(allCorrect), 600);
    }
  };

  return (
    <div className="number-line-wrap">
      {/* Zoom toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <button
          id="nl-zoom-toggle"
          className={`btn btn-sm ${zoomTenths ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setZoomTenths((z) => !z)}
          aria-pressed={zoomTenths}
        >
          {zoomTenths ? '🔍 Hundredths view' : '🔎 Tenths view'}
        </button>
      </div>

      {/* Unplaced markers */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '0.75rem' }}>
        {markers.filter((m) => !placed[m.label]?.placed).map((m) => (
          <div
            key={m.label}
            className="nl-marker"
            style={{
              width: 56,
              height: 36,
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-head)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'grab',
              boxShadow: 'var(--shadow-sm)',
              userSelect: 'none',
            }}
            draggable
            onMouseDown={(e) => {
              e.preventDefault();
              setDragging({ label: m.label, targetValue: m.value, x: 200 });
            }}
            onTouchStart={(e) => {
              const rect = svgRef.current?.getBoundingClientRect();
              if (rect) {
                const tx = ((e.touches[0].clientX - rect.left) / rect.width) * W;
                setDragging({ label: m.label, targetValue: m.value, x: tx });
              }
            }}
            aria-label={`Marker ${m.label} — drag to number line`}
            role="button"
            tabIndex={0}
          >
            {m.label}
          </div>
        ))}
      </div>

      {/* SVG Number Line */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="number-line-svg"
        style={{ width: '100%', maxWidth: 600, touchAction: 'none', cursor: dragging ? 'grabbing' : 'default' }}
        onMouseMove={handleSvgMouseMove}
        onMouseUp={handleSvgMouseUp}
        onTouchMove={handleSvgMouseMove}
        onTouchEnd={handleSvgMouseUp}
        aria-label="Number line"
        role="img"
      >
        {/* Track */}
        <rect x={30} y={TRACK_Y - 3} width={W - 60} height={6} rx={3} fill="var(--border-strong)" />

        {/* Minor ticks */}
        {minorTicks.map((v) => (
          <line
            key={v}
            x1={xForValue(v)} y1={TRACK_Y - TICK_MINOR}
            x2={xForValue(v)} y2={TRACK_Y + TICK_MINOR}
            stroke="var(--text-light)" strokeWidth={1}
          />
        ))}

        {/* Major ticks + labels */}
        {majorTicks.map((v) => (
          <g key={v}>
            <line
              x1={xForValue(v)} y1={TRACK_Y - TICK_MAJOR}
              x2={xForValue(v)} y2={TRACK_Y + TICK_MAJOR}
              stroke="var(--text-body)" strokeWidth={2}
            />
            <text
              x={xForValue(v)} y={TRACK_Y + TICK_MAJOR + 16}
              textAnchor="middle"
              fill="var(--text-body)"
              fontFamily="var(--font-head)"
              fontWeight="600"
              fontSize={12}
            >
              {Number.isInteger(v) ? v : v.toFixed(1)}
            </text>
          </g>
        ))}

        {/* Placed markers */}
        {markers.filter((m) => placed[m.label]?.placed).map((m) => {
          const info = placed[m.label];
          return (
            <g key={m.label} className={`nl-marker ${info.correct ? 'correct-placed' : 'wrong-placed'}`}>
              <polygon
                points={`${info.x},${TRACK_Y - MARKER_R - 16} ${info.x - MARKER_R},${TRACK_Y - 30} ${info.x + MARKER_R},${TRACK_Y - 30}`}
                fill={info.correct ? 'var(--success)' : 'var(--coral)'}
              />
              <rect x={info.x - MARKER_R} y={TRACK_Y - MARKER_R - 16 - 20} width={MARKER_R * 2} height={22} rx={6}
                fill={info.correct ? 'var(--success)' : 'var(--coral)'} />
              <text x={info.x} y={TRACK_Y - MARKER_R - 16 - 4}
                textAnchor="middle" fill="white" fontFamily="var(--font-head)" fontWeight="700" fontSize={11}>
                {m.label}
              </text>
              {info.correct && (
                <text x={info.x} y={TRACK_Y - 8} textAnchor="middle" fontSize={14}>✓</text>
              )}
            </g>
          );
        })}

        {/* Currently dragging marker */}
        {dragging && (
          <g>
            <polygon
              points={`${dragging.x},${TRACK_Y - MARKER_R - 16} ${dragging.x - MARKER_R},${TRACK_Y - 30} ${dragging.x + MARKER_R},${TRACK_Y - 30}`}
              fill="var(--primary)" opacity={0.8}
            />
            <rect x={dragging.x - MARKER_R} y={TRACK_Y - MARKER_R - 16 - 20} width={MARKER_R * 2} height={22} rx={6}
              fill="var(--primary)" opacity={0.8} />
            <text x={dragging.x} y={TRACK_Y - MARKER_R - 16 - 4}
              textAnchor="middle" fill="white" fontFamily="var(--font-head)" fontWeight="700" fontSize={11}>
              {dragging.label}
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
        Drag each label to its correct position on the number line
      </p>
    </div>
  );
};

export default NumberLine;
