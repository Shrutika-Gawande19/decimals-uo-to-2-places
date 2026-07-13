/**
 * BADGE ENGINE
 * Returns array of badge IDs that should be newly unlocked
 * given the current game state. Caller must filter against
 * already-unlocked badges.
 */

export const BADGE_IDS = {
  DECIMAL_DETECTIVE: 'decimal_detective',
  PLACE_VALUE_PRO: 'place_value_pro',
  DECIMAL_CHAMPION: 'decimal_champion',
  PERFECT_PRECISION: 'perfect_precision',
  STREAK_STAR: 'streak_star',
  FULL_JOURNEY: 'full_journey',
  NUMBER_LINE_NINJA: 'number_line_ninja',
  MONEY_MASTER: 'money_master',
};

export const BADGE_META = {
  [BADGE_IDS.DECIMAL_DETECTIVE]: {
    emoji: '🏅',
    name: 'Decimal Detective',
    desc: 'Complete Wonder + Story phases',
  },
  [BADGE_IDS.PLACE_VALUE_PRO]: {
    emoji: '🥈',
    name: 'Place Value Pro',
    desc: 'Complete all 3 Simulation stations',
  },
  [BADGE_IDS.DECIMAL_CHAMPION]: {
    emoji: '🥇',
    name: 'Decimal Champion',
    desc: 'Score ≥80% on Play phase',
  },
  [BADGE_IDS.PERFECT_PRECISION]: {
    emoji: '💎',
    name: 'Perfect Precision',
    desc: 'Score 10/10 in any world',
  },
  [BADGE_IDS.STREAK_STAR]: {
    emoji: '🔥',
    name: 'Streak Star',
    desc: '10 consecutive correct answers',
  },
  [BADGE_IDS.FULL_JOURNEY]: {
    emoji: '🌟',
    name: 'Full Journey',
    desc: 'Complete all 5 phases',
  },
  [BADGE_IDS.NUMBER_LINE_NINJA]: {
    emoji: '🎯',
    name: 'Number Line Ninja',
    desc: '5 correct in Station B, no wrong picks',
  },
  [BADGE_IDS.MONEY_MASTER]: {
    emoji: '💰',
    name: 'Money Master',
    desc: '5 money word problems correct',
  },
};

/**
 * Given the full game state, return an array of badge IDs
 * that are NOW earned (may include already-earned ones — caller must diff).
 */
export function checkBadges(state) {
  const earned = [];
  const { phaseComplete, simStationsComplete, worldScores, maxStreak, badges } = state;

  const has = (id) => badges.includes(id);

  // 🏅 Decimal Detective — Wonder + Story complete
  if (!has(BADGE_IDS.DECIMAL_DETECTIVE) && phaseComplete.wonder && phaseComplete.story) {
    earned.push(BADGE_IDS.DECIMAL_DETECTIVE);
  }

  // 🥈 Place Value Pro — all 3 stations done
  if (!has(BADGE_IDS.PLACE_VALUE_PRO) && simStationsComplete.every(Boolean)) {
    earned.push(BADGE_IDS.PLACE_VALUE_PRO);
  }

  // 🥇 Decimal Champion — play phase complete with ≥80% total
  if (!has(BADGE_IDS.DECIMAL_CHAMPION) && phaseComplete.play) {
    const completedWorlds = worldScores.filter((w) => w !== null);
    if (completedWorlds.length > 0) {
      const totalCorrect = completedWorlds.reduce((sum, w) => sum + w.correct, 0);
      const totalQuestions = completedWorlds.reduce((sum, w) => sum + w.total, 0);
      if (totalCorrect / totalQuestions >= 0.8) earned.push(BADGE_IDS.DECIMAL_CHAMPION);
    }
  }

  // 💎 Perfect Precision — any world 10/10
  if (!has(BADGE_IDS.PERFECT_PRECISION)) {
    if (worldScores.some((w) => w && w.correct === 10)) {
      earned.push(BADGE_IDS.PERFECT_PRECISION);
    }
  }

  // 🔥 Streak Star — maxStreak ≥ 10
  if (!has(BADGE_IDS.STREAK_STAR) && maxStreak >= 10) {
    earned.push(BADGE_IDS.STREAK_STAR);
  }

  // 🌟 Full Journey — all phases complete
  if (!has(BADGE_IDS.FULL_JOURNEY) && Object.values(phaseComplete).every(Boolean)) {
    earned.push(BADGE_IDS.FULL_JOURNEY);
  }

  return earned;
}
