import React, { useState, useEffect } from 'react';
import HintOverlay from './HintOverlay';
import DecimalBar from './DecimalBar';

// Hundred-grid visual for Q2
const HundredGrid = ({ shadedCount = 0 }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(10, 1fr)',
      gap: 2,
      width: 200,
      height: 200,
      background: 'var(--bg-alt)',
      padding: 4,
      borderRadius: 8,
      margin: '0 auto',
      border: '1.5px solid var(--border)',
    }}
    aria-label={`Grid with ${shadedCount} squares shaded out of 100`}
    role="img"
  >
    {Array.from({ length: 100 }).map((_, i) => (
      <div
        key={i}
        style={{
          background: i < shadedCount
            ? 'linear-gradient(135deg, var(--primary), var(--purple))'
            : 'white',
          borderRadius: 2,
          transition: 'background 0.3s',
        }}
      />
    ))}
  </div>
);

/**
 * QuestionRenderer — renders all 10 question types.
 * Props:
 *  question     — question object from questionBank
 *  onAnswer(correct, isMoneyQ) — callback
 *  onHintUsed   — called when hint requested
 */
const QuestionRenderer = ({ question, onAnswer, onHintUsed }) => {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null); // 'correct' | 'wrong' | null
  const [attemptNum, setAttemptNum] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);  // 0=none,1=hint1,2=hint2
  const [answered, setAnswered] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [cardAnim, setCardAnim] = useState('');

  useEffect(() => {
    setSelected(null);
    setResult(null);
    setAttemptNum(0);
    setHintLevel(0);
    setAnswered(false);
    setInputVal('');
    setCardAnim('');
  }, [question?.id]);

  if (!question) return null;

  const isMoneyQ = question.type === 'Q8' || question.type === 'Q9';
  const isCompare = question.type === 'Q3';
  const isTrueFalse = question.type === 'Q10';
  const isOpenInput = false; // all questions are MCQ for simplicity

  const handleAnswer = (option) => {
    if (answered) return;
    const isCorrect = option === question.answer;
    setSelected(option);

    if (isCorrect) {
      setResult('correct');
      setCardAnim('correct-anim');
      setAnswered(true);
      setTimeout(() => onAnswer?.(true, isMoneyQ), 900);
    } else {
      setResult('wrong');
      setCardAnim('wrong-anim');
      setAttemptNum((a) => a + 1);

      if (attemptNum + 1 >= 1 && hintLevel === 0) setHintLevel(1);
      if (attemptNum + 1 >= 2 && hintLevel < 2) setHintLevel(2);

      setTimeout(() => {
        setCardAnim('');
        setResult(null);
        setSelected(null);

        if (attemptNum + 1 >= 3) {
          // Reveal answer on 3rd wrong
          setAnswered(true);
          setSelected(question.answer);
          setResult('correct');
          setTimeout(() => onAnswer?.(false, isMoneyQ), 1800);
        }
      }, 800);
    }
  };

  const handleHint = () => {
    const newLevel = Math.min(hintLevel + 1, 2);
    setHintLevel(newLevel);
    onHintUsed?.();
  };

  const getVisual = () => {
    if (question.visual === 'grid') {
      const shaded = Math.round(parseFloat(question.answer.replace('$', '')) * 100);
      return <HundredGrid shadedCount={Math.min(100, Math.max(0, shaded || 35))} />;
    }
    if (question.visual === 'bar') {
      const val = parseFloat(question.answer);
      return <DecimalBar value={isNaN(val) ? 0.5 : Math.min(1, val)} animated />;
    }
    if (question.visual === 'pvc') {
      // Show a small place value chart breakdown hint
      const num = question.decimalA || parseFloat(question.questionText.match(/\d+\.\d+/)?.[0] || '0');
      if (!isNaN(num) && num > 0 && num < 100) {
        const ones = Math.floor(num);
        const tenths = Math.floor((num * 10) % 10);
        const hundredths = Math.floor((num * 100) % 10);
        return (
          <div style={{
            display: 'flex',
            gap: 0,
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1.5px solid var(--border)',
            fontSize: '0.875rem',
            maxWidth: 280,
            margin: '0 auto',
          }}>
            {[
              { label: 'Ones', val: ones, bg: 'var(--ones-color)' },
              { label: 'Tenths', val: tenths, bg: 'var(--tenths-color)' },
              { label: 'Hundredths', val: hundredths, bg: 'var(--hundredths-color)' },
            ].map((col) => (
              <div key={col.label} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ background: col.bg, color: 'white', padding: '0.25rem', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '0.75rem' }}>
                  {col.label}
                </div>
                <div style={{ padding: '0.5rem', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-main)' }}>
                  {col.val}
                </div>
              </div>
            ))}
          </div>
        );
      }
    }
    return null;
  };

  const visual = getVisual();

  return (
    <div className={`question-card ${cardAnim}`}>
      {/* Question text */}
      <div className="question-text" role="heading" aria-level="3">
        {question.questionText}
      </div>

      {/* Visual aid */}
      {visual && (
        <div style={{ marginBottom: '1.25rem' }}>{visual}</div>
      )}

      {/* Options */}
      <div
        className="options-grid"
        style={question.options?.length <= 2 ? { gridTemplateColumns: '1fr 1fr', maxWidth: 400, margin: '0 auto' } : {}}
        role="group"
        aria-label="Answer choices"
      >
        {question.options?.map((opt, i) => {
          let cls = 'option-btn';
          if (selected === opt && result === 'correct') cls += ' correct';
          else if (selected === opt && result === 'wrong') cls += ' wrong';
          return (
            <button
              key={i}
              id={`option-${question.id}-${i}`}
              className={cls}
              onClick={() => handleAnswer(opt)}
              disabled={answered || (selected === opt && result !== null)}
              aria-pressed={selected === opt}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Attempt dots */}
      {!answered && (
        <div className="attempt-dots" aria-label={`${attemptNum} attempt${attemptNum !== 1 ? 's' : ''} used`}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`attempt-dot${i < attemptNum ? ' used' : ''}`} aria-hidden="true" />
          ))}
        </div>
      )}

      {/* Hint request button */}
      {!answered && attemptNum > 0 && hintLevel < 2 && (
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <button id="hint-btn" className="btn btn-ghost btn-sm" onClick={handleHint}>
            💡 Show Hint
          </button>
        </div>
      )}

      {/* Hint display */}
      <HintOverlay
        hint={hintLevel === 1 ? question.hint1 : question.hint2}
        hintLevel={hintLevel}
        visible={hintLevel > 0 && !answered}
      />

      {/* Explanation on reveal */}
      {answered && result === 'correct' && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.875rem',
          background: 'var(--tenths-light)',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--success)',
          fontSize: '0.9rem',
          color: 'var(--text-body)',
          animation: 'slideDown 0.3s ease',
        }}>
          ✅ {question.explanation}
        </div>
      )}
    </div>
  );
};

export default QuestionRenderer;
