import { useState, useEffect, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { wonderQuestionNarration } from '../utils/narration';

const WONDER_QUESTIONS = [
  {
    question: "Ravi has $3.45. The toy costs $3.50. Does Ravi have enough money?",
    narrationText: "Ravi has 3 point 4 5 dollars. The toy costs 3 point 5 zero dollars. Does Ravi have enough money?",
    subtext: "When numbers have a decimal point, even a tiny difference matters! Let's explore what those digits mean.",
    emoji: '💰',
    bgEmojis: ['💰', '🧸', '💵', '🤔'],
    reveal: "The difference is just 5 cents — but which number is bigger?",
  },
  {
    question: "A ribbon is 2.6 m long. Another is 2.06 m. Which ribbon is longer?",
    narrationText: "A ribbon is 2 point 6 meters long. Another is 2 point zero 6 meters. Which ribbon is longer?",
    subtext: "Both look similar, but they are actually very different lengths!",
    emoji: '🎀',
    bgEmojis: ['🎀', '📏', '✂️', '🔢'],
    reveal: "The digits after the decimal point decide — tenths vs hundredths!",
  },
  {
    question: "A weighing scale shows 4.08 kg. What does the 8 mean?",
    narrationText: "A weighing scale shows 4 point zero 8 kilograms. What does the 8 mean?",
    subtext: "Every digit in a decimal number has its own special place and value!",
    emoji: '⚖️',
    bgEmojis: ['⚖️', '🔢', '💡', '✨'],
    reveal: "Is it 8 tenths? Or 8 hundredths? The position tells all!",
  },
  {
    question: "Priya scores 9.70 and Ahmad scores 9.7. Who scored higher?",
    narrationText: "Priya scores 9 point 7 zero and Ahmad scores 9 point 7. Who scored higher?",
    subtext: "Are these two scores the same, or is one really higher?",
    emoji: '🏆',
    bgEmojis: ['🏆', '⭐', '🎯', '🔢'],
    reveal: "Do trailing zeros change the value? Let's find out!",
  },
  {
    question: "A bus fare costs $1.05 and a snack costs $0.90. Together, how much?",
    narrationText: "A bus fare costs 1 point zero 5 dollars and a snack costs zero point 9 zero dollars. Together, how much?",
    subtext: "Decimals help us count money exactly — every cent matters!",
    emoji: '🚌',
    bgEmojis: ['🚌', '💳', '🍪', '💵'],
    reveal: "Can you add decimals like whole numbers? Almost — but you must line up the dots!",
  },
];

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [wonder] = useState(() => WONDER_QUESTIONS[Math.floor(Math.random() * WONDER_QUESTIONS.length)]);
  const [revealed, setRevealed] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  // ref to guard against narrating question twice if audioEnabled changes
  const didNarrateQuestion = useRef(false);

  // 1. Timers — run once on mount
  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true), 2200);
    const t2 = setTimeout(() => setShowBtn(true), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      stopNarration();
    };
  }, []);

  // 2. Narrate question + subtext exactly once when enabled
  useEffect(() => {
    if (audioEnabled && !didNarrateQuestion.current) {
      didNarrateQuestion.current = true;
      const questionToNarrate = wonder.narrationText || wonder.question;
      narrate(wonderQuestionNarration(questionToNarrate, wonder.subtext), true);
    }
    if (!audioEnabled) {
      stopNarration();
      didNarrateQuestion.current = false;
    }
    return () => {
      didNarrateQuestion.current = false;
    };
  }, [audioEnabled, wonder.question, wonder.subtext]);

  // 3. Reveal appears visually only — no audio for the yellow reveal box

  return (
    <div className="phase-wrapper centered">
      <div className="wonder-screen">
        <div className="wonder-tag">🔍 Phase 1 · Wonder</div>

        <div className="wonder-card">
          {wonder.bgEmojis.map((e, i) => (
            <span
              key={i}
              className="wonder-bg-emoji"
              style={{
                top: `${10 + (i * 22) % 70}%`,
                left: `${(i * 27) % 80}%`,
                fontSize: `${2 + (i % 2)}rem`,
                transform: `rotate(${i * 25}deg)`,
              }}
            >
              {e}
            </span>
          ))}

          <span className="wonder-emoji">{wonder.emoji}</span>
          <p className="wonder-question">{wonder.question}</p>
          <p className="wonder-subtext">{wonder.subtext}</p>

          {revealed && (
            <div className="wonder-reveal">
              💡 {wonder.reveal}
            </div>
          )}
        </div>

        <div className="mascot-bubble">
          <div style={{ fontSize: '3rem' }}>🦆</div>
          <div className="bubble-text">
            {showBtn
              ? "Ready to discover how decimals work? Let's go!"
              : "Hmm, interesting question! Let me think… 🤔"}
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg"
          onClick={onComplete}
          id="wonder-discover-btn"
          style={{
            opacity: showBtn ? 1 : 0,
            transform: showBtn ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            pointerEvents: showBtn ? 'auto' : 'none',
          }}
        >
          🚀 Let's Find Out!
        </button>
      </div>
    </div>
  );
}
