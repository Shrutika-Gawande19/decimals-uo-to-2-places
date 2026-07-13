/**
 * narration.js — per audio_generation_pipeline.md §E
 * Maps app phases to audio segments. Text MUST be 1:1 with generate_audio.js phrases.
 * Only paragraph text and questions. NEVER titles.
 */
import { say, ask, think, celebrate, instruct, cheer } from './audio';

// ── Intro ────────────────────────────────────────────────────────
export function introNarration() {
  return [
    celebrate("Welcome to the world of Decimals!"),
  ];
}

// ── WonderPhase ──────────────────────────────────────────────────
// Called once on mount: reads the question then the subtext
export function wonderQuestionNarration(question, subtext) {
  return [
    ask(question),
    say(subtext),
  ];
}
// Called when the reveal appears (after 2.2 s timer)
export function wonderRevealNarration(reveal) {
  return [
    think(reveal),
  ];
}

// ── StoryPhase ───────────────────────────────────────────────────
// Reads the white story body text per slide
export function storyNarration(storyText) {
  return [
    say(storyText),
  ];
}

// ── SimulatePhase ────────────────────────────────────────────────
export function simulateStation0Narration() {
  return [
    instruct("Let's build numbers! Drag the discs into the correct column to show the ones, tenths, and hundredths."),
  ];
}
export function simulateCorrectRoundNarration() {
  return [
    celebrate("Amazing! You built it perfectly! Let's try the next number!"),
  ];
}
export function simulateStation1Narration() {
  return [
    celebrate("Wonderful! Station one is done! Now let's head to the Juice Mixing Lab!"),
  ];
}
export function simulateStation2Narration() {
  return [
    celebrate("Great work mixing! Now let's mine some decimal crystals!"),
  ];
}
export function simulateAllDoneNarration() {
  return [
    celebrate("You are a true Decimal Explorer! All three stations complete!"),
  ];
}

// ── PlayPhase ─────────────────────────────────────────────────────
export function playNarration() {
  return [
    instruct("Choose the correct answer for the question."),
  ];
}
export function playCorrectNarration() {
  return [
    celebrate("That's correct! Well done!"),
  ];
}
export function playWrongNarration() {
  return [
    cheer("Not quite! Try again — you can do it!"),
  ];
}

// ── ReflectPhase ──────────────────────────────────────────────────
export function reflectNarration() {
  return [
    celebrate("Great job! Let's review what you learned."),
  ];
}
export function reflectTeachNarration() {
  return [
    instruct("Now let's test what you know. Can you teach it back?"),
  ];
}
export function reflectCorrectNarration() {
  return [
    celebrate("That's correct! You really understand decimals!"),
  ];
}
export function reflectWrongNarration() {
  return [
    cheer("Almost! Remember what we learned — give it another try!"),
  ];
}
