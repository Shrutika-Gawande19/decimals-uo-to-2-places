// ─────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────
export const ACTIONS = {
  SET_PHASE: 'SET_PHASE',
  NEXT_STORY_PANEL: 'NEXT_STORY_PANEL',
  ADVANCE_SIM_STATION: 'ADVANCE_SIM_STATION',
  COMPLETE_SIM_STATION: 'COMPLETE_SIM_STATION',
  NEXT_SIM_ROUND: 'NEXT_SIM_ROUND',
  LOAD_QUESTIONS: 'LOAD_QUESTIONS',
  ANSWER_CORRECT: 'ANSWER_CORRECT',
  ANSWER_INCORRECT: 'ANSWER_INCORRECT',
  USE_HINT: 'USE_HINT',
  NEXT_QUESTION: 'NEXT_QUESTION',
  SET_WORLD: 'SET_WORLD',
  COMPLETE_WORLD: 'COMPLETE_WORLD',
  UNLOCK_BADGE: 'UNLOCK_BADGE',
  COMPLETE_PHASE: 'COMPLETE_PHASE',
  TOGGLE_AUDIO: 'TOGGLE_AUDIO',
  TOGGLE_MUSIC: 'TOGGLE_MUSIC',
  RESTORE_SESSION: 'RESTORE_SESSION',
  RESET_SESSION: 'RESET_SESSION',
  SHOW_XP_FLOAT: 'SHOW_XP_FLOAT',
  HIDE_XP_FLOAT: 'HIDE_XP_FLOAT',
};

// ─────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────
export const initialState = {
  phase: 'intro',
  storyPanel: 0,
  currentSimStation: 0,
  simStationsComplete: [false, false, false],
  simRound: 0,
  questionSet: [],
  currentQuestion: 0,
  currentWorld: 0,
  worldScores: Array(10).fill(null),       // null = locked, object = { correct, total, stars }
  currentWorldCorrect: 0,
  currentWorldAttempts: 0,
  hintsUsed: 0,
  attemptCount: 0,
  xp: 0,
  totalStars: 0,
  streak: 0,
  maxStreak: 0,
  badges: [],
  phaseComplete: {
    wonder: false,
    story: false,
    simulate: false,
    play: false,
    reflect: false,
  },
  sessionId: crypto.randomUUID(),
  xpFloat: null,             // { amount, key }
  settings: {
    audioEnabled: true,
    musicEnabled: false,
  },
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function calcXP(attemptCount, hintsUsed, streak) {
  let base = attemptCount === 0 ? 10 : attemptCount === 1 ? 7 : 5;
  if (hintsUsed > 0) base = Math.min(base, 5);
  const bonus = streak >= 5 ? 5 : 0;
  return base + bonus;
}

function calcStars(correct) {
  if (correct >= 9) return 3;
  if (correct >= 7) return 2;
  if (correct >= 6) return 1;
  return 0;
}

// ─────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────
export function gameReducer(state, action) {
  switch (action.type) {

    case ACTIONS.SET_PHASE:
      return { ...state, phase: action.payload };

    case ACTIONS.NEXT_STORY_PANEL:
      return { ...state, storyPanel: state.storyPanel + 1 };

    case ACTIONS.ADVANCE_SIM_STATION:
      return { ...state, currentSimStation: Math.min(state.currentSimStation + 1, 2), simRound: 0 };

    case ACTIONS.COMPLETE_SIM_STATION: {
      const updated = [...state.simStationsComplete];
      updated[action.payload] = true;
      return { ...state, simStationsComplete: updated };
    }

    case ACTIONS.NEXT_SIM_ROUND:
      return { ...state, simRound: state.simRound + 1 };

    case ACTIONS.LOAD_QUESTIONS:
      return {
        ...state,
        questionSet: action.payload,
        currentQuestion: 0,
        currentWorldCorrect: 0,
        currentWorldAttempts: 0,
        attemptCount: 0,
        hintsUsed: 0,
      };

    case ACTIONS.ANSWER_CORRECT: {
      const xpGain = calcXP(state.attemptCount, state.hintsUsed, state.streak);
      const newStreak = state.streak + 1;
      return {
        ...state,
        xp: state.xp + xpGain,
        streak: newStreak,
        maxStreak: Math.max(newStreak, state.maxStreak),
        currentWorldCorrect: state.currentWorldCorrect + 1,
        attemptCount: 0,
        hintsUsed: 0,
        xpFloat: { amount: xpGain, key: Date.now() },
      };
    }

    case ACTIONS.ANSWER_INCORRECT:
      return {
        ...state,
        streak: 0,
        attemptCount: state.attemptCount + 1,
      };

    case ACTIONS.USE_HINT:
      return { ...state, hintsUsed: state.hintsUsed + 1 };

    case ACTIONS.NEXT_QUESTION:
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
        attemptCount: 0,
        hintsUsed: 0,
      };

    case ACTIONS.SET_WORLD:
      return {
        ...state,
        currentWorld: action.payload,
        currentWorldCorrect: 0,
        currentWorldAttempts: 0,
        attemptCount: 0,
        hintsUsed: 0,
      };

    case ACTIONS.COMPLETE_WORLD: {
      const { worldIndex, correct } = action.payload;
      const stars = calcStars(correct);
      const updatedScores = [...state.worldScores];
      updatedScores[worldIndex] = { correct, total: 10, stars };
      return {
        ...state,
        worldScores: updatedScores,
        totalStars: state.totalStars + stars,
      };
    }

    case ACTIONS.UNLOCK_BADGE: {
      if (state.badges.includes(action.payload)) return state;
      return { ...state, badges: [...state.badges, action.payload] };
    }

    case ACTIONS.COMPLETE_PHASE: {
      return {
        ...state,
        phaseComplete: { ...state.phaseComplete, [action.payload]: true },
      };
    }

    case ACTIONS.TOGGLE_AUDIO:
      return { ...state, settings: { ...state.settings, audioEnabled: !state.settings.audioEnabled } };

    case ACTIONS.TOGGLE_MUSIC:
      return { ...state, settings: { ...state.settings, musicEnabled: !state.settings.musicEnabled } };

    case ACTIONS.RESTORE_SESSION:
      return { ...action.payload, xpFloat: null };

    case ACTIONS.RESET_SESSION:
      return { ...initialState, sessionId: crypto.randomUUID() };

    case ACTIONS.SHOW_XP_FLOAT:
      return { ...state, xpFloat: action.payload };

    case ACTIONS.HIDE_XP_FLOAT:
      return { ...state, xpFloat: null };

    default:
      return state;
  }
}

import { useReducer, useEffect, useCallback } from 'react';
import { checkBadges } from '../utils/badgeEngine';

const STORAGE_KEY = 'intellia_decimals_session';

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState, (init) => {
    // Start fresh on every reload so the intro screen is always first.
    return init;
  });

  // Persist state on every change
  useEffect(() => {
    try {
      const { xpFloat, ...toSave } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (_) { /* ignore */ }
  }, [state]);

  // Badge engine runs after relevant changes
  const dispatchWithBadge = useCallback((action) => {
    dispatch(action);
    // Badge checks run on the next render cycle via useEffect in App
  }, []);

  // Auto-hide XP float
  useEffect(() => {
    if (state.xpFloat) {
      const t = setTimeout(() => dispatch({ type: ACTIONS.HIDE_XP_FLOAT }), 1500);
      return () => clearTimeout(t);
    }
  }, [state.xpFloat]);

  const checkAndUnlockBadges = useCallback((newState) => {
    const newBadges = checkBadges(newState);
    newBadges.forEach((badgeId) => {
      dispatch({ type: ACTIONS.UNLOCK_BADGE, payload: badgeId });
    });
  }, []);

  return { state, dispatch: dispatchWithBadge, checkAndUnlockBadges };
}
