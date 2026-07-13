import { useState, useEffect } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { storyNarration } from '../utils/narration';

const STORY_SLIDES = [
  {
    image: '/assets/images/story_toyshop_1783867121365.png',
    title: "Leo's Robot Dream",
    text: "Leo really wants the new toy robot in the shop window. The price tag says $12.50. The number before the dot tells him the whole dollars, and the numbers after the dot are the parts of a dollar — the cents! Decimals help us count money perfectly.",
    // Phonetic: $12.50 → "12 point 5 zero dollars"
    narrationText: "Leo really wants the new toy robot in the shop window. The price tag says 12 point 5 zero dollars. The number before the dot tells him the whole dollars, and the numbers after the dot are the parts of a dollar — the cents! Decimals help us count money perfectly.",
    highlight: "✨ The dot separates the wholes from the parts! ✨",
    mascotText: "12 whole dollars and 50 cents! 🤖",
  },
  {
    image: '/assets/images/story_baking_1783867139746.png',
    title: "Baking a Cake",
    text: "Later, Leo helps his mom bake a cake. The recipe needs exactly 1.25 kg of flour. The '2' is in the tenths place, and the '5' is in the hundredths place. Every tiny bit matters in baking, and decimals help us measure exactly what we need!",
    // Phonetic: 1.25 -> "1 point 2 5"
    narrationText: "Later, Leo helps his mom bake a cake. The recipe needs exactly 1 point 2 5 kilograms of flour. The 2 is in the tenths place, and the 5 is in the hundredths place. Every tiny bit matters in baking, and decimals help us measure exactly what we need!",
    highlight: "✨ 1.25 = 1 whole + 2 tenths + 5 hundredths ✨",
    mascotText: "Precision is key! 🍰",
    objectPosition: "bottom"
  },
  {
    image: '/assets/images/story_race_1783867158204.png',
    title: "The Running Race",
    text: "At school, Leo runs a race in 14.8 seconds. His friend runs it in 14.08 seconds. Who was faster? 14.8 has 8 tenths, but 14.08 has 0 tenths! So Leo took more time. His friend was faster!",
    // Phonetic: 14.8 -> "14 point 8", 14.08 -> "14 point zero 8"
    narrationText: "At school, Leo runs a race in 14 point 8 seconds. His friend runs it in 14 point zero 8 seconds. Who was faster? 14 point 8 has 8 tenths, but 14 point zero 8 has zero tenths! So Leo took more time. His friend was faster!",
    highlight: "✨ Always compare digits from left to right! ✨",
    mascotText: "0 tenths < 8 tenths! 🏃",
  },
  {
    image: '/assets/images/story_ribbon_1783867174776.png',
    title: "The Ribbon Cut",
    text: "In art class, Leo needs a ribbon exactly 3.5 meters long. He cuts a ribbon that is 3.50 meters long. His teacher smiles and says they are exactly the same length! Adding a zero at the end doesn't change the value.",
    // Phonetic: 3.5 -> "3 point 5", 3.50 -> "3 point 5 zero"
    narrationText: "In art class, Leo needs a ribbon exactly 3 point 5 meters long. He cuts a ribbon that is 3 point 5 zero meters long. His teacher smiles and says they are exactly the same length! Adding a zero at the end doesn't change the value.",
    highlight: "✨ 3.5 and 3.50 are exactly equal! ✨",
    mascotText: "Zeros at the end are invisible! 🎀",
  },
  {
    image: '/assets/images/story_quiz_1783867191782.png',
    title: "The Decimal Expert",
    text: "Leo gets an 'A' on his math quiz! He realizes decimals aren't just numbers on a page — they are everywhere in the real world, helping us measure things perfectly. Now, he's a true Decimal Explorer!",
    // Match audioMap key exactly (no quotes around A)
    narrationText: "Leo gets an A on his math quiz! He realizes decimals aren't just numbers on a page — they are everywhere in the real world, helping us measure things perfectly. Now, he's a true Decimal Explorer!",
    highlight: "✨ You're ready to use decimals everywhere! ✨",
    mascotText: "Great job, Leo! ⭐",
  },
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const slide = STORY_SLIDES[slideIdx];
  const total = STORY_SLIDES.length;
  const isLast = slideIdx === total - 1;

  const nextSlide = () => {
    if (!isLast) setSlideIdx(i => i + 1);
    else onComplete();
  };

  const prevSlide = () => {
    if (slideIdx > 0) setSlideIdx(i => i - 1);
  };

  useEffect(() => {
    if (audioEnabled) {
      narrate(storyNarration(slide.narrationText || slide.text), true);
    } else {
      stopNarration();
    }
    return () => stopNarration();
  }, [slideIdx, audioEnabled]);


  return (
    <div className="phase-wrapper">
      <div className="story-wrapper" style={{ width: '100%', maxWidth: 720, margin: '0 auto' }}>
        
        {/* Progress Bar Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '0 8px' }}>
          <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${((slideIdx + 1) / total) * 100}%`, height: '100%', background: 'var(--gold)', transition: 'width 0.3s ease' }} />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {slideIdx + 1} / {total}
          </div>
        </div>

        {/* Story Card */}
        <div style={{ 
          background: 'var(--bg-card-solid, #1a1a5e)', 
          borderRadius: 24, 
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
        }}>
          {/* Image */}
          <div style={{ width: '100%', height: 380, background: '#0a0a2e' }}>
            <img 
              src={slide.image} 
              alt={slide.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: slide.objectPosition || 'center' }} 
            />
          </div>

          {/* Content */}
          <div style={{ padding: '24px 36px' }}>
            <h2 style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>
              {slide.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.5, marginBottom: 20 }}>
              {slide.text}
            </p>

            {/* Highlight Box */}
            <div style={{ 
              border: '1px solid rgba(255,193,7,0.3)', 
              background: 'rgba(255,193,7,0.05)',
              borderRadius: 12, 
              padding: '12px', 
              textAlign: 'center', 
              color: 'var(--gold)', 
              fontWeight: 700, 
              fontSize: '0.95rem',
              marginBottom: 20 
            }}>
              {slide.highlight}
            </div>

            {/* Mascot Bubble */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(135deg, #ffd54f, #ff8f00)',
                boxShadow: '0 0 16px rgba(255,193,7,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem',
                flexShrink: 0
              }}>
                🤖
              </div>
              <div style={{
                position: 'relative',
                background: 'white', color: '#1a1a2e',
                padding: '12px 20px', borderRadius: '16px 16px 16px 16px',
                fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 500,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)',
                  width: 0, height: 0,
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderRight: '10px solid white'
                }} />
                {slide.mascotText}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, padding: '0 12px' }}>
          <button 
            onClick={prevSlide}
            style={{ 
              background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', 
              borderRadius: 24, padding: '10px 20px', fontSize: '0.95rem', fontWeight: 600,
              cursor: 'pointer',
              opacity: slideIdx === 0 ? 0 : 1,
              pointerEvents: slideIdx === 0 ? 'none' : 'auto',
              transition: 'all 0.2s'
            }}
          >
            ← Back
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            {STORY_SLIDES.map((_, i) => (
              <div 
                key={i} 
                style={{ 
                  width: 8, height: 8, borderRadius: '50%', 
                  background: i === slideIdx ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
                  transition: 'background 0.3s'
                }} 
              />
            ))}
          </div>

          <button 
            onClick={nextSlide}
            style={{ 
              background: 'var(--gold)', color: '#1a1a2e', border: 'none',
              borderRadius: 24, padding: '10px 24px', fontSize: '0.95rem', fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255,193,7,0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {isLast ? "Next →" : "Next →"}
          </button>
        </div>

      </div>
    </div>
  );
}
