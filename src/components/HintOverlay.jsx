import React from 'react';
import { Lightbulb } from 'lucide-react';

const HintOverlay = ({ hint, hintLevel = 1, visible = false }) => {
  if (!visible || !hint) return null;

  return (
    <div className="hint-panel" role="status" aria-live="polite">
      <div className="hint-icon">
        <Lightbulb size={24} color="var(--gold-dark)" />
      </div>
      <div>
        <div className="hint-label">Hint {hintLevel}</div>
        <div className="hint-text">{hint}</div>
      </div>
    </div>
  );
};

export default HintOverlay;
