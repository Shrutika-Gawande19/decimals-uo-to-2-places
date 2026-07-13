const NUMBERS = ['0.1', '3.45', '💎', '0.01', '6.08', '✨', '0.5', '2.30', '⭐', '1.75', '0.09', '💫', '9.90', '0.75'];

export default function FloatingNumbers() {
  return (
    <div className="floating-numbers" aria-hidden="true">
      {NUMBERS.map((n, i) => (
        <span
          key={i}
          className="floating-number"
          style={{
            left: `${(i * 7.3 + 5) % 92}%`,
            animationDuration: `${18 + (i * 2.3) % 12}s`,
            animationDelay: `${(i * 3.1) % 10}s`,
            fontSize: i % 3 === 0 ? '2rem' : '3.5rem',
          }}
        >
          {n}
        </span>
      ))}
    </div>
  );
}
