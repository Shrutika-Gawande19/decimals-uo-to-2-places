import React from 'react';
import { Lock } from 'lucide-react';
import { WORLD_NAMES } from '../data/storyContent';
import StarRating from './StarRating';

const WorldMap = ({ currentWorld, worldScores, onSelectWorld }) => {
  return (
    <div className="card-glass" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', overflow: 'visible' }}>
      <div className="card-accent-top" />
      <h2 className="heading-phase text-center mb-1">IntelliPlay™ Challenge</h2>
      <p className="text-center text-body mb-3">Complete worlds to earn stars! You need 6/10 to unlock the next world.</p>
      
      <div className="world-map-grid" role="group" aria-label="World selection map">
        {WORLD_NAMES.map((world, idx) => {
          const score = worldScores[idx];
          const prevScore = idx > 0 ? worldScores[idx - 1] : null;
          const isUnlocked = idx === 0 || (prevScore && prevScore.correct >= 6);
          const isCompleted = score && score.correct >= 6;
          const isActive = idx === currentWorld;
          
          let statusClass = '';
          if (!isUnlocked) statusClass = 'locked';
          else if (isCompleted) statusClass = 'completed';
          if (isActive) statusClass += ' active';

          return (
            <button
              key={idx}
              id={`world-node-${idx}`}
              className={`world-node ${statusClass}`.trim()}
              onClick={() => isUnlocked && onSelectWorld(idx)}
              disabled={!isUnlocked}
              aria-label={`${world.name} (World ${idx + 1}). ${isUnlocked ? (isCompleted ? `Completed, ${score.stars} stars` : 'Unlocked') : 'Locked'}`}
              title={world.name}
            >
              <div className="world-node-icon" style={{ background: isUnlocked ? world.bg : 'var(--bg-alt)' }} aria-hidden="true">
                {isUnlocked ? world.emoji : <Lock size={28} color="var(--border-strong)" />}
                <div className="world-node-num">{idx + 1}</div>
              </div>
              
              <div className="world-node-name">{world.name}</div>
              
              {isUnlocked && (
                <div style={{ transform: 'scale(0.8)' }}>
                  <StarRating stars={score ? score.stars : 0} max={3} size="sm" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WorldMap;
