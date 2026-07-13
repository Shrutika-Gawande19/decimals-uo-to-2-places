/**
 * XP per correct answer:
 *  - First try, no hints: 10 XP
 *  - Second try or hint used: 7 XP
 *  - Third try: 5 XP
 *  - Streak bonus (streak ≥ 5): +5 XP
 */
export function calcXP(attemptNumber, hintsUsed, currentStreak) {
  let base;
  if (attemptNumber === 0 && hintsUsed === 0) base = 10;
  else if (attemptNumber <= 1 && hintsUsed === 0) base = 7;
  else base = 5;
  const streakBonus = currentStreak >= 5 ? 5 : 0;
  return base + streakBonus;
}

/**
 * Stars per 10-question world:
 *  9–10 correct → 3 stars
 *  7–8  correct → 2 stars
 *  6    correct → 1 star (minimum to unlock next world)
 *  <6   correct → 0 stars (world stays locked or retry)
 */
export function calcStars(correct) {
  if (correct >= 9) return 3;
  if (correct >= 7) return 2;
  if (correct >= 6) return 1;
  return 0;
}

/**
 * Check if a world is unlocked.
 * World 0 (first) is always unlocked.
 * World N requires worldScores[N-1] to have stars >= 1.
 */
export function isWorldUnlocked(worldIndex, worldScores) {
  if (worldIndex === 0) return true;
  const prev = worldScores[worldIndex - 1];
  return prev !== null && prev.stars >= 1;
}

/**
 * Total XP needed to reach a "rank level"
 * (for display purposes, every 100 XP = 1 level)
 */
export function xpToLevel(xp) {
  return Math.floor(xp / 100) + 1;
}
