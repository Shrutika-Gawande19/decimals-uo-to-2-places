# TECHNICAL REQUIREMENTS DOCUMENT (TRD)

## Decimal Detectives: Decimals Up to 2 Decimal Places
**Grade 4 Mathematics | Gamified Interactive Lesson Module**

---

### 1. TECHNICAL OVERVIEW
This document specifies the architecture, component design, state management, data models, simulation logic, gamification implementation, audio pipeline, and quality standards for the Decimal Detectives lesson module for Grade 4 mathematics. The module teaches decimals up to 2 decimal places through a gamified journey that includes discovery, story learning, hands-on simulation, interactive play, and reflection.

The lesson follows the same overall structure, phase flow, and implementation theme as the reference TRD, while replacing the math domain with decimal understanding, comparison, ordering, rounding, and real-life decimal contexts such as money and measurement.

The module will be implemented as a React 18 application using Vite and JSX, designed for touch-friendly classroom use and structured for easy embedding inside a WordPress course page.

---

### 2. TECHNOLOGY STACK
| Layer | Technology | Rationale |
|---|---|---|
| UI Framework | React 18 + JSX | Matches the reference lesson architecture |
| Build Tool | Vite | Fast builds and simple deployment |
| State Management | useState, useReducer | Sufficient for lesson flow and game state |
| Styling | CSS Modules / Tailwind | Supports reusable, consistent UI themes |
| Icons | Lucide React | Lightweight educational UI icons |
| Animation | CSS keyframes + transitions | Smooth gamified feedback |
| SVG Diagrams | Inline SVG React | For place value charts, decimal bars, and number lines |
| Persistence | localStorage | Saves lesson progress locally |
| Audio | ElevenLabs + HTML5 Audio | High-quality narration and feedback |
| Math Logic | Vanilla JavaScript | No extra math dependency required |
| Build Output | Static frontend bundle | Easy to host and embed |

---

### 3. PROJECT STRUCTURE
The project structure mirrors the reference repository style and keeps the lesson self-contained.

```txt
decimal-detectives/
├── public/
│   └── assets/
│       ├── audio/
│       ├── images/
│       └── icons/
├── src/
│   ├── components/
│   │   ├── IntroScreen.jsx
│   │   ├── ProgressMap.jsx
│   │   ├── WonderPhase.jsx
│   │   ├── StoryPhase.jsx
│   │   ├── SimulatePhase.jsx
│   │   ├── PlayPhase.jsx
│   │   ├── ReflectPhase.jsx
│   │   ├── DecimalBar.jsx
│   │   ├── PlaceValueChart.jsx
│   │   ├── NumberLine.jsx
│   │   ├── ComparisonStation.jsx
│   │   ├── OrderingStation.jsx
│   │   ├── RoundingStation.jsx
│   │   ├── MoneyStation.jsx
│   │   ├── QuestionRenderer.jsx
│   │   ├── HintOverlay.jsx
│   │   ├── XPTracker.jsx
│   │   ├── StarRating.jsx
│   │   ├── BadgePanel.jsx
│   │   └── Mascot.jsx
│   ├── data/
│   │   ├── questionBank.js
│   │   └── storyContent.js
│   ├── hooks/
│   │   ├── useAudio.js
│   │   ├── useGameState.js
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   ├── shuffle.js
│   │   ├── scoring.js
│   │   ├── badgeEngine.js
│   │   └── decimalHelpers.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── scripts/
│   ├── generateaudio.js
│   └── cleanaudio.js
├── index.html
├── package.json
└── vite.config.js
```

---

### 4. APPLICATION STATE ARCHITECTURE
#### 4.1 Global State
The lesson uses a reducer-based global state to manage navigation, quiz progress, simulation progress, audio settings, and gamification metrics.

```js
const initialState = {
  phase: 'intro',
  storyPanel: 0,
  currentSimStation: 0,
  simStationsComplete: [false, false, false],
  simRound: 0,
  questionSet: [],
  currentQuestion: 0,
  currentWorld: 0,
  worldScores: Array(10).fill(null),
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
    reflect: false
  },
  sessionId: crypto.randomUUID(),
  settings: {
    audioEnabled: true,
    musicEnabled: false
  }
};
```

#### 4.2 Reducer Action Types
```js
const ACTIONS = {
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
  UNLOCK_BADGE: 'UNLOCK_BADGE',
  COMPLETE_PHASE: 'COMPLETE_PHASE',
  TOGGLE_AUDIO: 'TOGGLE_AUDIO',
  TOGGLE_MUSIC: 'TOGGLE_MUSIC',
  RESTORE_SESSION: 'RESTORE_SESSION',
  RESET_SESSION: 'RESET_SESSION'
};
```

#### 4.3 Core Reducer Logic
Correct answers increase XP, streaks, and world scores. Incorrect answers reset streaks and increase attempt counts. Badge checks run after key state changes to unlock achievements at the right moments.

---

### 5. QUESTION DATA MODEL
#### 5.1 Question Schema
```js
interface Question {
  id: string;
  type: QuestionType;
  world: number;
  difficulty: 1 | 2 | 3;
  decimalA: number;
  decimalB: number;
  total?: number;
  answer: string | number;
  questionText: string;
  visual: VisualType;
  options?: (string | number)[];
  hint1: string;
  hint2: string;
  explanation: string;
}
```

#### 5.2 Question Types
The lesson includes question types that are suitable for Grade 4 and decimals up to two places:
- Compare two decimals.
- Order decimals from least to greatest.
- Identify the value of a digit in tenths or hundredths.
- Round a decimal to the nearest whole number or nearest tenth.
- Add or subtract decimals in money-based contexts.
- Choose the correct decimal on a number line.
- Match decimal representations in words, expanded form, and standard form.

#### 5.3 Sample Question Objects
- Compare: Which is greater, 3.4 or 3.48?
- Ordering: Put 2.15, 2.5, 2.05 in order from least to greatest.
- Place value: What is the value of the 7 in 4.76?
- Rounding: Round 6.38 to the nearest tenth.
- Money: Riya has Rs 12.50 and spends Rs 3.25. How much is left?

---

### 6. DECIMAL DIAGRAM COMPONENTS
#### 6.1 DecimalBar.jsx
This component visually shows decimals using bars divided into tenths and hundredths. It helps children see that 0.7 means 7 tenths and 0.75 means 7 tenths and 5 hundredths.

#### 6.2 PlaceValueChart.jsx
This component renders a place value chart with columns for ones, tenths, and hundredths. It supports drag-and-drop digits and tap-based interactions for tablets.

#### 6.3 NumberLine.jsx
This component displays a number line from 0 to 10 or 0 to 1 depending on the question. Decimal markers are highlighted, and students can tap the correct point for a given decimal.

---

### 7. SIMULATION STATION COMPONENT SPECS
#### 7.1 Decimal Sort Station
Students drag decimal cards into order from smallest to largest. Cards include close values like 2.4, 2.04, and 2.14 so the activity builds careful comparison skills.

#### 7.2 Place Value Builder Station
Students build decimals using base-ten blocks or digit tiles. The station reinforces that the digit in the tenths place is smaller than the digit in the ones place, and hundredths are even smaller.

#### 7.3 Money Match Station
Students match decimal amounts to coin or note combinations. This station uses realistic money values to make decimals meaningful and familiar.

Each station includes drag-and-drop interaction, tap fallback, correct/incorrect animations, and a completion check before advancing.

---

### 8. AUDIO PIPELINE
The lesson uses ElevenLabs narration for all spoken instructions, story text, feedback, and rewards. Audio clips are pre-generated for static lesson text and dynamically generated for reusable response phrases.

Narration scripts are kept in sync with on-screen text so that every visible sentence can be spoken exactly as written. The audio layer uses HTML5 Audio playback and silent fallback behavior if audio is unavailable.

---

### 9. RANDOMISATION ENGINE
A shuffle utility randomizes question order, station order, and some visual layouts so each session feels fresh. The question generator selects a balanced mix of comparison, ordering, place value, rounding, and money problems.

Distractors are created from common decimal mistakes, such as comparing digits by length instead of place value or confusing tenths with hundredths.

---

### 10. GAMIFICATION IMPLEMENTATION
#### 10.1 XP and Stars
Correct answers award XP based on first-try success, hint usage, and streak length. Each world of 10 questions awards 0 to 3 stars based on total correct responses.

#### 10.2 Badges
- Decimal Explorer: Complete Wonder and Story phases.
- Place Value Pro: Complete the place value station.
- Decimal Sorter: Complete the ordering station.
- Money Master: Complete the money station.
- Streak Star: Achieve a 10-question streak.
- Decimal Champion: Score 80 percent or above in Play phase.
- Perfect Place Value: Get all answers correct in a world focused on place value.
- Full Journey: Complete all phases.

#### 10.3 Feedback
Correct answers trigger celebration animations, stars, badge popups, and cheerful narration. Incorrect answers trigger encouraging retry prompts and hint overlays.

---

### 11. CSS ANIMATION KEYFRAMES
The visual theme uses playful but clean motion to keep Grade 4 learners engaged without overwhelming them.

Key animations include:
- bounceIn for correct answer cards.
- shake for incorrect attempts.
- floatUp for XP rewards.
- pulseGlow for active tiles.
- slideInUp for lesson panels.
- decimalSpark for small decorative twinkles around important numbers.

---

### 12. COMPONENT PROP CONTRACTS
#### DecimalBar
Props: `value`, `scale`, `highlightMode`, `animated`.

#### PlaceValueChart
Props: `number`, `missingPlace`, `onDropDigit`, `showLabels`.

#### NumberLine
Props: `start`, `end`, `step`, `target`, `onSelect`.

#### QuestionRenderer
Props: `question`, `onAnswer`, `hints`.

#### BadgePanel
Props: `badges`, `newBadgeId`.

---

### 13. PERFORMANCE REQUIREMENTS
The lesson should load quickly and feel smooth on classroom devices.

| Metric | Target |
|---|---|
| Initial load time | Under 2 seconds |
| Time to first meaningful paint | Under 1 second |
| Animation frame rate | 60 fps |
| Bundle size | Under 600 KB gzipped |
| Lighthouse Performance | 90+ |
| Accessibility | 90+ |

---

### 14. BROWSER DEVICE SUPPORT
The module should support common classroom devices, especially tablets and mobile browsers.

| Environment | Support Level |
|---|---|
| Chrome desktop | Full |
| Safari iPad | Full primary device |
| Firefox desktop | Full |
| Edge desktop | Full |
| Android Chrome | Full |
| iPhone Safari | Full |
| IE 11 | Not supported |

---

### 15. WORDPRESS EMBEDDING
The lesson can be embedded in WordPress using a CDN bundle or iframe.

Option A uses a script tag placed in a custom HTML block. Option B uses an iframe with a fixed height and internal scrolling on smaller screens.

---

### 16. QUALITY ASSURANCE CHECKLIST
| Category | Test Case | Status |
|---|---|---|
| Audio | All narration clips play correctly | TBD |
| Audio | No crash when audio is disabled | TBD |
| Questions | All decimal question types render correctly | TBD |
| Questions | Correct answer always appears in option sets | TBD |
| Simulations | Drag and tap interactions work on tablet | TBD |
| Simulations | Decimal place value chart accepts input correctly | TBD |
| Simulations | Number line taps map to the right decimal | TBD |
| Phases | All phases navigate end to end | TBD |
| Gamification | XP and streaks update correctly | TBD |
| Gamification | Stars award correctly by score band | TBD |
| Gamification | Badges unlock at the correct conditions | TBD |
| Persistence | localStorage saves and restores progress | TBD |
| Responsive | Layout works on tablet and mobile | TBD |
| Accessibility | Touch targets are large and readable | TBD |
| Curriculum | Decimals up to 2 decimal places are covered | TBD |

---

### 17. AUDIO FILE MANAGEMENT WORKFLOW
1. Add narration phrases to the audio generation script.
2. Generate the static `.mp3` files.
3. Update the audio map.
4. Keep all on-screen text synchronized with narration text.
5. Remove unused audio assets after edits.
6. Deploy the updated lesson bundle together with the audio assets.

---

### 18. DEPLOYMENT PIPELINE
1. Install dependencies.
2. Generate audio assets.
3. Build the Vite production bundle.
4. Deploy to CDN or hosting platform.
5. Test the preview version.
6. Embed into the WordPress course page.
7. Verify lesson flow, audio, animations, and scoring.
8. Publish the lesson to learners.

---

### 19. DOCUMENT METADATA
**Document Version:** 1.0  
**Topic:** Decimals up to 2 decimal places  
**Grade:** 4  
**Lesson Type:** Gamified Interactive Math Lesson  
**Primary Goal:** Build understanding of decimal place value, comparison, ordering, rounding, and real-life decimal use  
**Reference Style:** Same structure and theme as the attached TRD, adapted for decimals  