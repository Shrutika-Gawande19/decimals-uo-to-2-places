import React from 'react';

const StarRating = ({ stars = 0, max = 3, size = 'md', animated = false }) => {
  const sizeMap = { sm: '1.25rem', md: '1.75rem', lg: '2.5rem' };
  return (
    <div className="star-row" role="img" aria-label={`${stars} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`star-icon${i < stars ? ' earned' : ''}`}
          style={{
            fontSize: sizeMap[size] || sizeMap.md,
            animationDelay: animated ? `${i * 0.15}s` : '0s',
          }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
};

export default StarRating;
