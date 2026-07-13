# Product Requirements Document (PRD)
## Decimals up to 2 Decimal Places | Grade 4 Math
### Intellia SG | Singapore Primary Mathematics Curriculum (MOE)

═══════════════════════════════════════════════════════════════════════════════

## 1. EXECUTIVE SUMMARY

This document defines product requirements for the **"Decimals up to 2 Decimal
Places"** interactive lesson module, delivered as **Lesson 5.1** within Intellia
SG's Grade 4 Math program. The module targets Singapore Primary 4 students aged
9–10 and introduces decimal notation, place value (tenths and hundredths),
comparison, ordering, rounding, and addition/subtraction of decimals — fully
aligned with the Singapore MOE Mathematics Framework and the Primary 4
Targeting Mathematics syllabus.

The product is a standalone web page to be hosted at:
`https://intelliasg.com/courses/grade-4-math/lessons/decimals-2dp/`

It is built using React (Vite + JSX, JavaScript/CSS) and designed to strictly
mirror the visual and UX structure established at
`https://numberbound.vercel.app/` and the repository
`https://github.com/dsamyak/numberbound`.

Audio narration uses ElevenLabs exclusively (Voice: Alice, Voice ID:
`Xb7hH8MSUJpSbSDYk0k2`, Model: `eleven_multilingual_v2`) with pre-generated
static `.mp3` files for all phase narrations and dynamic generation for
practice questions — matching the pipeline documented in the Word Problems
Using Addition Audio & Narration Pipeline.

The module follows Intellia's 5-phase learner journey:

```
Phase 1 — INTRO      → Welcome screen + 5-phase progress map
Phase 2 — WONDER     → Curiosity hook
Phase 3 — STORY      → Narrative-based concept introduction
Phase 4 — SIMULATE   → Sandbox-style interactive simulation (3 stations)
Phase 5 — PLAY       → IntelliPlay™ gamified practice (100 randomised questions)
Phase 6 — REFLECT    → Journal / LearnFlow AI prompt + completion badge
```

═══════════════════════════════════════════════════════════════════════════════

## 2. PRODUCT VISION & GOALS

### Vision
To make decimal numbers up to 2 decimal places intuitive, visual, and joyful
for 9–10 year old Singapore learners — building a concrete-pictorial-abstract
(CPA) bridge from whole-number place value to tenths and hundredths through
animated place-value simulations, story narration, and adaptive gamified
challenge.

### Goals

| Goal                          | Metric                                              |
|-------------------------------|------------------------------------------------------|
| Learning Completion           | ≥85% of students complete all 5 phases              |
| Practice Engagement           | ≥90% attempt at least 10 practice questions          |
| Score Achievement             | Average challenge score ≥75% on first attempt        |
| Session Duration              | Average engagement ≥15 minutes per session           |
| Curriculum Alignment          | 100% aligned to Singapore MOE Primary 4 (Lesson 5.1) |
| Phase Progression             | ≥80% reach Play phase in a single session            |
| Simulation Interaction Rate   | ≥95% attempt all 3 simulation stations               |

═══════════════════════════════════════════════════════════════════════════════

## 3. TARGET USERS

### Primary: Grade 4 Students (Age 9–10)
- Comfortable readers; can process multi-step word problems and diagrams
- Learn concretely first (C → P → A: Concrete-Pictorial-Abstract), building on
  Grade 3 whole-number place value knowledge
- Motivated by mastery-based progression, streaks, and visible score gains
- Singapore context: familiar with hawker food prices, MRT fares, market
  weights and measures, local shopping scenarios

### Secondary: Parents & Teachers
- Assign as classwork or enrichment homework
- Expect strict MOE curriculum alignment
- Monitor via phase completion indicators embedded in lesson page

═══════════════════════════════════════════════════════════════════════════════

## 4. CURRICULUM ALIGNMENT — Singapore MOE Primary 4

```
Topic:        Decimals up to 2 Decimal Places (Lesson 5.1)
Programme:    Intellia SG Grade 4 Math — Section 5: Decimals
Lesson URL:   https://intelliasg.com/courses/grade-4-math/lessons/decimals-2dp/
```

**Source References:**
- Singapore MOE Primary Mathematics Syllabus (Primary 1–6), 2013 (Revised)
  - Strand: Number and Algebra
  - Sub-strand: Fractions and Decimals
  - Primary 4 anchor: "Decimals" — notation, place value, comparison,
    rounding, and the four operations (addition/subtraction focus)
- Targeting Mathematics Primary 4B (Casco Publications)
  - Chapter on Decimals: Tenths, Hundredths, Rounding, Addition & Subtraction
- My Pals Are Here! Maths Primary 4B (Marshall Cavendish)
  - Unit 8: Decimals — Understanding and Comparing Decimals

**MOE Learning Objectives Covered (Lesson 5.1):**

| LO  | Description                                                                            |
|-----|-----------------------------------------------------------------------------------------|
| LO1 | Understand decimal notation as an extension of whole-number place value (tenths, hundredths) |
| LO2 | Read and write decimals up to 2 decimal places                                          |
| LO3 | Represent decimals using place value discs, hundred-grids, and number lines             |
| LO4 | Compare and order decimals up to 2 decimal places                                       |
| LO5 | Round decimals to the nearest whole number and to the nearest tenth                     |
| LO6 | Convert between fractions (tenths/hundredths) and decimals                              |
| LO7 | Add and subtract decimals up to 2 decimal places in real-world contexts (money, length, mass) |

**Singapore Syllabus CPA Progression for This Lesson:**

```
Concrete    → Place value discs (1, 0.1, 0.01) arranged on a place value chart
              (simulated digitally)
Pictorial   → Hundred-grid shading, decimal number lines, money/ruler diagrams
Abstract    → "3.45 = 3 ones + 4 tenths + 5 hundredths"; comparing 3.45 ___ 3.5
```

**Number Ranges:**
```
Easy:    1 decimal place, 0.1–9.9
Medium:  2 decimal places, 0.01–50.00
Hard:    2 decimal places, 0.01–100.00; includes regrouping in +/− and
         reverse (find the missing digit / missing decimal)
```

**Vocabulary Focus (age-appropriate):**
`"decimal point", "tenths", "hundredths", "decimal place", "place value",
"equivalent decimal", "greater than", "less than", "round to the nearest",
"regroup"`

═══════════════════════════════════════════════════════════════════════════════

## 5. THE 5-PHASE LEARNER JOURNEY (Intellia Model)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  INTRO SCREEN → Progress Map (5-step visual tracker, top bar)              │
│  Welcome: "Hello! Today we're going to learn about Decimals! 🎉"           │
│  Lesson badge shown (locked). 5 glowing phase dots visible.                │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1 — WONDER  (≈ 1–2 min)                                             │
│                                                                            │
│  Hook: "Ravi has $3.45. The toy he wants costs $3.50. 🧸                  │
│  Does Ravi have enough money? Which amount is bigger?"                    │
│                                                                            │
│  Visual: Two price tags floating in, coins/notes animating to $3.45       │
│  Animation: Coins stack up, decimal points glow and pulse                  │
│  Narration (ElevenLabs): Alice voice reads the hook warmly                 │
│  → Mascot (LearnFlow robot) appears with a thinking expression             │
│  → "Let's find out how DECIMALS help us compare amounts!"                 │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2 — STORY  (≈ 2–3 min)                                              │
│                                                                            │
│  Narrative: Siti visits the wet market with her mother.                   │
│  Panel 1: "A fish costs $4.25 and a chicken costs $4.05. 🐟🐔"           │
│  Panel 2: "The digit after the decimal point tells us the TENTHS!"       │
│  Panel 3: Place-value chart appears — Ones | Tenths | Hundredths          │
│  Panel 4: "$4.25 = 4 ones, 2 tenths, 5 hundredths. Let's compare!"       │
│  Panel 5: "Now Siti buys ribbon: 2.60 m and 2.06 m. Which is longer?"     │
│  Panel 6: "2.60 m is longer because 6 tenths is more than 0 tenths! 🎀"  │
│                                                                            │
│  → Illustrated story panels (animated slide-in), ElevenLabs narration     │
│  → Key vocabulary highlighted: "tenths", "hundredths", "decimal point"    │
│  → Place-value chart diagram introduced visually (colour-coded columns)   │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3 — SIMULATE  (≈ 5–6 min)                                          │
│                                                                            │
│  3 Interactive Stations — student must complete all 3 to advance          │
│                                                                            │
│  Station A — "The Place Value Chart" (Concrete)                           │
│    Drag place-value discs (1, 0.1, 0.01) onto the chart to build a       │
│    given decimal number.                                                  │
│                                                                            │
│  Station B — "Decimal Number Line Jump" (Pictorial)                       │
│    Drag markers to plot and order decimals correctly on a number line.   │
│                                                                            │
│  Station C — "Fill the Decimal Sentence" (Abstract)                       │
│    "3.45 ___ 3.5" (>,<,=) or "2.60 + 1.25 = ___" — number pad input      │
│    Place value chart shown as scaffold; abstract sentence completes the  │
│    CPA loop.                                                              │
│                                                                            │
│  → Mascot reacts to each completed station                                │
│  → ElevenLabs narrates each station instruction and feedback              │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 4 — PLAY  (≈ 6–8 min)                                              │
│                                                                            │
│  IntelliPlay™ Level: 100 randomised questions across 10 worlds            │
│  10 questions per world, world unlocks at ≥6/10 correct                  │
│  Stars (1–3), XP, badges, and streak fire counter active                  │
│  → Mastery gates the world map; encouragement-first feedback              │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 5 — REFLECT  (≈ 1–2 min)                                           │
│                                                                            │
│  Journal prompt: "Can you write a decimal and explain what each digit    │
│  after the point means?"                                                  │
│  Or: LearnFlow AI chat — type/speak your understanding                   │
│  Lesson complete badge unlocks here. Summary of XP + badges shown.       │
│  → "Share with your teacher!" button (screenshot / export)               │
└────────────────────────────────────────────────────────────────────────────┘
```

═══════════════════════════════════════════════════════════════════════════════

## 6. PHASE 3 — SIMULATION DESIGN (Detailed)

### 6.1 Station A — The Place Value Chart (Concrete)

**Visual:**
- A place value chart with 3 labelled columns: Ones | Tenths | Hundredths
- A pool of draggable place-value discs on the left (large "1", small "0.1",
  tiny "0.01" discs), colour-coded per column
- "Build the number 3.45!" instruction narrated by Alice (ElevenLabs)

**Interaction:**
- Student drags discs one at a time into the correct column
- OR taps a disc + taps destination column (accessibility mode)
- Each column shows a live counter (e.g. "3 ones") updating as discs land
- The decimal number (e.g. "3.45") builds live in a display box above the chart

**Feedback:**
- Correct number built → mascot dances, "Amazing! You built 3.45!" 🎉
- Wrong column/count on submit → gentle shake + "One disc is in the wrong
  place! Let's check the columns."

**Variants per round (randomised):**
```
Round 1: 1.20   (1 one, 2 tenths, 0 hundredths)
Round 2: 3.45   (3 ones, 4 tenths, 5 hundredths)
Round 3: 5.06   (5 ones, 0 tenths, 6 hundredths)
Round 4: 8.70   (8 ones, 7 tenths, 0 hundredths)
```

### 6.2 Station B — Decimal Number Line Jump (Pictorial)

**Visual:**
- A horizontal number line marked with major intervals (e.g. 0 to 5, or
  3.0 to 4.0 zoomed in for hundredths)
- 4 decimal value markers waiting to be placed, shown as floating labelled
  tokens (e.g. "3.45", "3.5", "3.05", "3.4")

**Interaction:**
- Student drags each marker to its correct position on the number line
- Multi-select checkpoint: correct placements snap and glow green; wrong
  placements bounce back with a hint arrow
- A "zoom" toggle lets students switch between a tenths-scale and a
  hundredths-scale number line

**Teaching goal:**
- Builds a visual sense of decimal magnitude and ordering
- Reinforces that more digits after the point does not always mean a bigger
  number (e.g. 3.5 > 3.45)

**Distractor design:**
- Values differ by small amounts (±0.05 to ±0.1) to require careful reading
- One marker always tests the "trailing zero" misconception (e.g. 3.4 vs 3.40)

**3 rounds with increasing complexity:**
```
Round 1: 2 markers, tenths only (easy)
Round 2: 3 markers, mixed tenths/hundredths (medium)
Round 3: 4 markers, close-value hundredths (hard — tests careful comparison)
```

### 6.3 Station C — Fill the Decimal Sentence (Abstract)

**Visual:**
```
3.45  ___  3.5        (comparison mode: >, <, =)
2.60  +  1.25  =  ___  (operation mode: addition/subtraction)
```

**Interaction:**
- Number pad / symbol pad (large, tap-friendly: 0–9 and >, <, = buttons)
- Place value chart shown above as visual scaffold
- "Show chart" hint button always visible
- On submit: correct → bounce animation; incorrect → shake + hint

**Variants (rotated per round):**
```
Compare:  3.45 ___ 3.5           (>, <, or =)
Add:      2.60 + 1.25 = ___      (with regrouping in hundredths)
Subtract: 5.00 − 2.35 = ___      (with regrouping across place values)
```

ElevenLabs narrates each sentence aloud when displayed.

═══════════════════════════════════════════════════════════════════════════════

## 7. PHASE 4 — QUESTION BANK (100 Randomised Questions)

### 7.1 Question Types (10 types × 10 questions = 100 total)

| Type | Description                                        | Example                                                        |
|------|-----------------------------------------------------|------------------------------------------------------------------|
| Q1   | Identify place value of a digit                     | In 4.25, what is the value of the digit 2?                      |
| Q2   | Read/write decimal from picture (grid/discs)         | [Grid shaded] What decimal does this represent?                 |
| Q3   | Compare two decimals (>, <, =)                       | 3.45 ___ 3.5                                                     |
| Q4   | Order decimals ascending/descending                  | Order from smallest: 2.06, 2.6, 2.16                             |
| Q5   | Round decimal to nearest whole number                | Round 4.68 to the nearest whole number.                         |
| Q6   | Round decimal to nearest tenth                       | Round 4.68 to the nearest tenth.                                 |
| Q7   | Convert fraction ↔ decimal                            | Write 3/10 as a decimal.                                         |
| Q8   | Singapore word problem — addition of decimals        | Priya buys a drink for $1.20 and a bun for $0.85. How much in total? |
| Q9   | Singapore word problem — subtraction of decimals     | Ahmad had $10.00. He spent $6.35. How much money is left?       |
| Q10  | True or False — decimal statement judgement          | "3.40 = 3.4" — True or False?                                    |

### 7.2 Question Distribution by Difficulty

| Type | Count | Easy (1 dp) | Medium (2 dp, ≤50) | Hard (2 dp, ≤100) |
|------|-------|-------------|---------------------|--------------------|
| Q1   |  10   |     5       |          3          |         2          |
| Q2   |  10   |     5       |          3          |         2          |
| Q3   |  10   |     4       |          4          |         2          |
| Q4   |  10   |     3       |          4          |         3          |
| Q5   |  10   |     3       |          4          |         3          |
| Q6   |  10   |     3       |          4          |         3          |
| Q7   |  10   |     4       |          4          |         2          |
| Q8   |  10   |     3       |          4          |         3          |
| Q9   |  10   |     3       |          4          |         3          |
| Q10  |  10   |     5       |          3          |         2          |
| **TOT** | **100** | **38** | **37** | **25** |

### 7.3 Number Ranges

```
Easy:    1 decimal place, 0.1–9.9
Medium:  2 decimal places, 0.01–50.00
Hard:    2 decimal places, 0.01–100.00; includes regrouping and
         reverse-find questions
```

### 7.4 Singapore Context Names & Objects Used in Word Problems

```
Names:   Wei Ming, Priya, Raju, Ahmad, Mia, Jun, Siti, Ryan, Xiao Ling, Aisha
Objects: bus fares, drinks, buns, exercise books, pencils, ribbon lengths,
         fish, chicken, fruit, stationery, ang bao money, bubble tea
Contexts: hawker centre, wet market, school bookshop, MRT fare card,
          pasar malam, birthday party budget
```

### 7.5 MOE-Aligned Language Requirements

All questions use approved Singapore MOE vocabulary:
```
- "decimal point", "tenths", "hundredths", "decimal place"
- "greater than", "less than", "equal to", "round to the nearest"
- "how much altogether", "how much is left", "equivalent decimal"
```
Sentence structures match Primary 4 Targeting Mathematics style.

═══════════════════════════════════════════════════════════════════════════════

## 8. GAMIFICATION DESIGN

### 8.1 Reward System

```
Stars (⭐):    Earned per 10-question world (1–3 stars based on score)
XP Points:    10 XP correct first try | 7 XP second try | 5 XP with hint used
Streak 🔥:    Fire counter for consecutive correct answers
Streak Bonus: +5 XP per correct answer when streak ≥ 5
```

### 8.2 Badges (Unlockable)

```
🏅 "Decimal Detective"   — Complete Wonder + Story phases
🥈 "Place Value Pro"     — Complete all 3 Simulation stations
🥇 "Decimal Champion"   — Score ≥80% on Play phase (≥80 questions correct)
💎 "Perfect Precision"  — Score 10/10 in any world
🔥 "Streak Star"        — Achieve a streak of 10 consecutive correct answers
🌟 "Full Journey"       — Complete all 5 phases (lesson complete badge)
🎯 "Number Line Ninja"  — Get 5 correct in Station B without any wrong pick
💰 "Money Master"       — Answer 5 money word problems correctly (Q8/Q9)
```

### 8.3 Feedback Mechanics

```
✅ Correct:
   - Bounce animation on answer card + mascot happy mood
   - ElevenLabs celebration audio: "Amazing! You've got decimals down! 🎉"
   - XP floats up from answer card (+10 / +7 / +5)
   - Streak fire counter increments

❌ Incorrect (Attempt 1):
   - Gentle shake animation on answer card
   - ElevenLabs gentle voice: "Not quite! Let's look at the place values again 🔢"
   - Hint 1 activates: Place value chart highlighted with column values shown

❌ Incorrect (Attempt 2):
   - Stronger shake + Hint 2: Number line animation shows exact position
   - ElevenLabs: "Watch the number line! Can you spot where it belongs?"

❌ Incorrect (Attempt 3):
   - Answer revealed with animated explanation (mascot explains)
   - ElevenLabs: full explanation read aloud
   - No score penalty — encouragement only
```

No negative scoring. Encouragement-first approach always.

### 8.4 World Map (IntelliPlay™ Level Progression)

```
World  1 — "Coin Corner"        (Q1–10,  1 dp, easy, tenths only)
World  2 — "Bakery Counter"     (Q11–20, 1–2 dp, easy-med, ≤10)
World  3 — "Wet Market"         (Q21–30, 2 dp, medium, ≤25)
World  4 — "Ribbon Ruler"       (Q31–40, 2 dp, medium, ≤35, measurement)
World  5 — "Bus Fare Journey"   (Q41–50, 2 dp, medium-hard, ≤50)
World  6 — "MRT Station"        (Q51–60, 2 dp, hard, ≤65, includes reverse)
World  7 — "Bookshop Budget"    (Q61–70, 2 dp, hard, word problems)
World  8 — "Pasar Malam Stalls" (Q71–80, 2 dp, hard, ≤85, mixed types)
World  9 — "Rainbow Bridge"     (Q81–90, 2 dp, hard, all types mixed)
World 10 — "Decimal Palace"     (Q91–100, 2 dp, hardest, reverse + rounding link)

Unlock gate: ≥6/10 correct (1-star minimum) required to advance to next world.
3 stars in a world unlocks a hidden "Bonus Challenge" (3 extra questions).
```

### 8.5 Mascot (LearnFlow AI Companion)

```
Character:   Friendly robot — "LearnFlow" (matching Intellia branding)
Mood States: idle | curious | happy | thinking | celebrating | encouraging
Appearances: Wonder hook, Story narration, Simulation feedback, Reflect phase
Reactions:   Correct answer, badge unlock, streak milestone, world completion
Audio:       All mascot speech via ElevenLabs Alice voice (pre-generated .mp3)
```

═══════════════════════════════════════════════════════════════════════════════

## 9. AUDIO & NARRATION DESIGN

### 9.1 ElevenLabs Pipeline (as per Audio & Narration Pipeline doc)

```
Voice Provider:   ElevenLabs (ONLY — no browser Web Speech API fallback)
Voice Name:       Alice (Clear, Engaging Educator)
Voice ID:         Xb7hH8MSUJpSbSDYk0k2
Model:            eleven_multilingual_v2
API Key Env Var:  VITE_ELEVENLABS_API_KEY
```

### 9.2 Speech Styles Mapped to ElevenLabs Settings

| Style          | stability | similarity_boost | style | Use case                      |
|----------------|-----------|-------------------|-------|--------------------------------|
| statement      |   0.75    |       0.75        |  0.0  | Story narration, instructions  |
| instruction    |   0.80    |       0.75        |  0.0  | Simulation station prompts     |
| question       |   0.60    |       0.80        |  0.3  | Practice question read-aloud   |
| encouragement  |   0.55    |       0.85        |  0.6  | Correct answer feedback        |
| emphasis       |   0.85    |       0.70        |  0.1  | Key vocabulary highlight       |
| thinking       |   0.65    |       0.80        |  0.2  | Mascot thinking moments        |
| celebration    |   0.45    |       0.90        |  0.8  | Badge unlock, world complete    |

### 9.3 Pre-generated Audio Files (Offline — `scripts/generate_audio.js`)

All phase narration lines (Wonder, Story panels, Simulate instructions,
Reflect prompt, badge unlock messages, world completion) are pre-generated
offline and stored as static `.mp3` in `public/assets/audio/`.

`audioMap.js` is auto-generated and maps exact text strings → file paths.
The frontend checks `audioMap` first; dynamic generation only for play-phase
questions not in the map (using `elevenLabsCache` in memory).

### 9.4 Dynamic Generation

Practice questions (Phase 4) are generated dynamically if not pre-cached.
Requires `VITE_ELEVENLABS_API_KEY` in `.env.local`.
If key is absent, narration silently skipped (no browser TTS fallback).
Internal memory cache (`elevenLabsCache`) prevents re-fetching same text.

### 9.5 Segment Synchronisation

The audio engine parses narration as an array of segments (one per sentence).
While segment `i` plays, segment `i+1` is eagerly preloaded via `getAudioUrl`.
This guarantees seamless, gap-free narration across multi-sentence scripts.
Uses HTML5 Audio API (`new Audio()`) for playback.

### 9.6 Narration Script Examples

```
Phase 1 (Wonder) — style: thinking
  "Ravi has three dollars and forty-five cents."
  "The toy he wants costs three dollars and fifty cents."
  "Does Ravi have enough money? Let's find out what decimals really mean!"

Phase 2 (Story, Panel 1) — style: statement
  "Siti visits the wet market with her mother."
  "A fish costs four dollars and twenty-five cents."
  "A chicken costs four dollars and five cents. Which one costs more?"

Phase 3 (Station A) — style: instruction
  "Drag the discs onto the chart. Build the number three point four five!"
  "Make sure each disc goes in the correct column. Can you do it?"

Phase 4 (Correct feedback) — style: celebration
  "Amazing! You built the decimal correctly! You are a superstar!"

Phase 5 (Reflect) — style: thinking
  "Wow, what a journey today! Can you tell me one thing you learned about decimals?"
```

═══════════════════════════════════════════════════════════════════════════════

## 10. UX & VISUAL DESIGN REQUIREMENTS

### 10.1 Visual Theme

```
Brand:           Intellia SG — Think. Explore. Become.
Reference UI:    https://numberbound.vercel.app/ (mirror exactly)
Reference Repo:  https://github.com/dsamyak/numberbound
Colours:         Match numberbound.vercel.app exactly
  - Primary blue: consistent with existing Intellia lessons (#4A90D9 / equivalent)
  - Accent gold/yellow for rewards and stars
  - Soft coral/red for wrong-answer shake states
  - White card backgrounds, soft drop shadows
  - Phase band colours: distinct per phase (matching Intellia journey infographic)
Typography:      Rounded, clear — Nunito or Fredoka One
Illustrations:   Clean, child-friendly, Singapore-context market/money imagery
Place Value UI:  Colour-coded chart columns (Ones / Tenths / Hundredths),
                 distinct disc sizes/colours per place value
```

### 10.2 Layout Structure (mirrors numberbound.vercel.app)

```
Top Bar:         Intellia logo | Lesson title "Decimals" | 5-phase dot tracker
Main Area:       Phase content (fills screen, responsive, smooth phase transitions)
Bottom Bar:      XP counter | Star count | Streak fire | Phase navigation arrows
Sidebar:         Hidden on mobile; shown on tablet+ as vertical phase map
```

### 10.3 Place Value & Decimal Diagram Visual Component (Primary Visual)

Used throughout all phases. Visual spec:
```
- 3-column place value chart (Ones | Tenths | Hundredths), clearly labelled
- Discs animate in (drop/stack animation) when a value is built
- Number line variant: horizontal track with major/minor tick marks,
  draggable labelled markers
- Missing digit shown as dashed-border box with "?" inside
- Connecting label underneath chart: "3.45 = 3 ones + 4 tenths + 5 hundredths"
```

### 10.4 Accessibility

```
Large tap targets (minimum 44×44px on all interactive elements)
WCAG AA colour contrast on all text elements
All narration via ElevenLabs (premium, consistent voice)
Keyboard navigable (Tab + Enter for all interactions)
No mandatory time pressure (optional timer toggle in challenge mode only)
Drag interactions have touch-equivalent tap+tap fallback
```

### 10.5 Responsive Design

```
Primary:    iPad / tablet (768px+) — classroom context
Secondary:  Desktop browser (1024px+)
Tertiary:   Mobile (375px+) — stacked single-column layout
```

═══════════════════════════════════════════════════════════════════════════════

## 11. CONTENT REQUIREMENTS

### 11.1 Simulation Visuals

```
Place value chart:    SVG-rendered 3-column chart with draggable discs
Object pool:          Coin/note icons ($ notes, cents), ribbon/ruler icons
Station B assets:     Number line with zoomable tenths/hundredths scale
Abstract sentences:   Large bold typography, one highlighted blank per round
```

### 11.2 Question Bank Coverage

```
All 10 question types × 10 questions = 100 unique question objects in questionBank.js
Questions randomised per session using Fisher-Yates shuffle
No two sessions present same question order
MCQ distractors always plausible (within ±0.1 or common place-value errors)
```

### 11.3 Word Problem Format (MOE style)

**Addition sense:**
```
"[Name] buys a [item] for $[amount1] and a [item2] for $[amount2].
 How much does [he/she] spend altogether?"
```

**Subtraction sense:**
```
"[Name] had $[total]. [He/She] spent $[amount] on [item].
 How much money does [he/she] have left?"
```

**Let's Think Along style (extended):**
```
"[Name] has a ribbon that is ___ m long. [He/She] cuts off ___ m.
 How long is the ribbon now? Draw it on the number line and check!"
```

### 11.4 Audio Script Parity (1:1 Strict Parity Rule)

Every on-screen text string that is narrated must match the `narration.js`
text exactly — same words, same punctuation. This prevents confusion for
young learners who are simultaneously listening and reading. Any UI text
change requires updating both the `generate_audio.js` phrases array and the
`narration.js` file.

═══════════════════════════════════════════════════════════════════════════════

## 12. SUCCESS CRITERIA (v1.0)

| Criterion                                       | Target       |
|--------------------------------------------------|--------------|
| All 100 questions randomised correctly            | ✅ Required |
| All 3 simulation stations functional              | ✅ Required |
| All 5 phases navigable end-to-end                | ✅ Required |
| Gamification (XP, stars, 8 badges) working       | ✅ Required |
| World map 10-world progression logic correct     | ✅ Required |
| ElevenLabs audio plays for all phase narration   | ✅ Required |
| Audio pipeline (pre-gen + dynamic) functional    | ✅ Required |
| Mobile/tablet responsive layout                  | ✅ Required |
| Singapore MOE syllabus 100% covered              | ✅ Required |
| Loads in < 3 seconds (Vite production build)     | ✅ Required |
| WCAG AA accessible                               | ✅ Required |
| UI matches numberbound.vercel.app structure      | ✅ Required |
| Hosted correctly at intelliasg.com lesson URL    | ✅ Required |

═══════════════════════════════════════════════════════════════════════════════

## 13. OUT OF SCOPE (v1.0)

```
- Teacher dashboard / backend analytics
- Student login / account persistence across devices
- Multiplayer or class competition features
- Parent progress report emails
- Print worksheet generation
- Lessons 5.2 (Multiplying/Dividing Decimals) and 5.3 (Decimals in Measurement)
  — separate modules
- Assessment against full curriculum (broader test engine)
```

═══════════════════════════════════════════════════════════════════════════════

**Document Version:**    1.0 | July 2026
**Product:**             Intellia SG — Grade 4 Math, Lesson 5.1
**Lesson Title:**        Decimals up to 2 Decimal Places
**Curriculum:**          Singapore MOE Primary 4 Mathematics
**Reference UI:**        https://numberbound.vercel.app/
**Reference Repo:**      https://github.com/dsamyak/numberbound
**Audio Pipeline:**      ElevenLabs (Alice, Xb7hH8MSUJpSbSDYk0k2, eleven_multilingual_v2)
**Parent Course Page:**  https://intelliasg.com/courses/grade-4-math/
**Lesson URL:**          https://intelliasg.com/courses/grade-4-math/lessons/decimals-2dp/
