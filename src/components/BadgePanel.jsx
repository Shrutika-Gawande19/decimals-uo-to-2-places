import React from 'react';
import { BADGE_META, BADGE_IDS } from '../utils/badgeEngine';

const ALL_BADGE_IDS = Object.values(BADGE_IDS);

export const BadgeGrid = ({ unlockedBadges = [] }) => (
  <div className="badge-grid" aria-label="Badges">
    {ALL_BADGE_IDS.map((id) => {
      const meta = BADGE_META[id];
      const unlocked = unlockedBadges.includes(id);
      return (
        <div key={id} className="badge-item" title={meta.desc}>
          <div className={`badge-icon${unlocked ? '' : ' locked'}`} role="img" aria-label={unlocked ? meta.name : 'Locked badge'}>
            {meta.emoji}
          </div>
          <span className="badge-name">{meta.name}</span>
        </div>
      );
    })}
  </div>
);

export const BadgePopup = ({ badgeId, onClose }) => {
  if (!badgeId) return null;
  const meta = BADGE_META[badgeId];
  if (!meta) return null;

  return (
    <>
      <div className="badge-popup-overlay" onClick={onClose} aria-hidden="true" />
      <div
        className="badge-popup"
        role="alertdialog"
        aria-labelledby="badge-title"
        aria-describedby="badge-desc"
      >
        <div className="badge-popup-icon" aria-hidden="true">{meta.emoji}</div>
        <div className="badge-popup-title" id="badge-title">Badge Unlocked!</div>
        <div className="badge-popup-name" id="badge-desc">{meta.name}</div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          {meta.desc}
        </p>
        <button id="badge-popup-close" className="btn btn-gold btn-sm" onClick={onClose}>
          Awesome! 🎉
        </button>
      </div>
    </>
  );
};

const BadgePanel = ({ unlockedBadges, newBadgeId, onDismiss }) => (
  <>
    <BadgeGrid unlockedBadges={unlockedBadges} />
    <BadgePopup badgeId={newBadgeId} onClose={onDismiss} />
  </>
);

export default BadgePanel;
