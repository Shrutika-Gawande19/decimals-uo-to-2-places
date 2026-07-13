/**
 * Story content for Phase 2 — STORY
 * 6 panels, Siti + Singapore wet market context
 */

export const storyPanels = [
  {
    id: 0,
    emoji: '🛒',
    visual: 'market',
    title: "Siti Goes to the Wet Market",
    text: "Siti visits the wet market with her mother. She sees all kinds of food with price tags showing numbers with a dot in them — decimal numbers!",
    highlight: ["decimal numbers"],
    narration: [
      "Siti visits the wet market with her mother.",
      "She sees all kinds of food with price tags showing numbers with a dot in them — decimal numbers!",
    ],
    style: 'statement',
  },
  {
    id: 1,
    emoji: '🐟',
    visual: 'fish_chicken',
    title: "Two Prices — Which is More?",
    text: "A fish costs $4.25 and a chicken costs $4.05. Her mother asks: \"Which costs more?\" Siti looks carefully at the digit after the decimal point — the TENTHS!",
    highlight: ["TENTHS"],
    narration: [
      "A fish costs four dollars and twenty-five cents.",
      "A chicken costs four dollars and five cents.",
      "Which one costs more? Siti looks at the digit after the decimal point — the tenths!",
    ],
    style: 'statement',
  },
  {
    id: 2,
    emoji: '📊',
    visual: 'place_value_chart',
    title: "The Place Value Chart",
    text: "A place value chart helps us compare! It has three columns: Ones | Tenths | Hundredths. Each column tells us what a digit is worth.",
    highlight: ["Ones", "Tenths", "Hundredths"],
    narration: [
      "A place value chart helps us understand and compare decimal numbers.",
      "It has three columns: Ones, Tenths, and Hundredths.",
      "Each column tells us what a digit is worth.",
    ],
    style: 'emphasis',
  },
  {
    id: 3,
    emoji: '💡',
    visual: 'breakdown',
    title: "$4.25 = 4 ones + 2 tenths + 5 hundredths",
    text: "$4.25 has 4 ones, 2 tenths, and 5 hundredths. $4.05 has 4 ones, 0 tenths, and 5 hundredths. Since 2 tenths > 0 tenths, the fish ($4.25) costs MORE!",
    highlight: ["2 tenths", "0 tenths"],
    narration: [
      "Four dollars and twenty-five cents has 4 ones, 2 tenths, and 5 hundredths.",
      "Four dollars and five cents has 4 ones, 0 tenths, and 5 hundredths.",
      "Since 2 tenths is greater than 0 tenths, the fish costs more!",
    ],
    style: 'statement',
  },
  {
    id: 4,
    emoji: '🎀',
    visual: 'ribbon',
    title: "Now Siti Buys Ribbons",
    text: "Siti's mother buys two ribbons: one is 2.60 m long and one is 2.06 m long. Which ribbon is longer? Let's use the place value chart to compare!",
    highlight: ["2.60 m", "2.06 m"],
    narration: [
      "Now Siti's mother buys two ribbons.",
      "One ribbon is two point six zero metres long, and the other is two point zero six metres long.",
      "Which ribbon is longer? Let us use the place value chart to compare!",
    ],
    style: 'thinking',
  },
  {
    id: 5,
    emoji: '✅',
    visual: 'ribbon_compare',
    title: "2.60 m is Longer!",
    text: "2.60 m has 6 tenths, but 2.06 m has only 0 tenths! 6 tenths is much more than 0 tenths. So 2.60 m > 2.06 m. Now you know how to compare decimals! 🎉",
    highlight: ["6 tenths", "0 tenths"],
    narration: [
      "Two point six zero metres has 6 tenths!",
      "But two point zero six metres has only 0 tenths.",
      "Six tenths is much greater than zero tenths, so 2.60 m is longer. Now you know how to compare decimals!",
    ],
    style: 'celebration',
  },
];

export const WORLD_NAMES = [
  { name: 'Coin Corner',        emoji: '🪙', bg: '#eef6ff' },
  { name: 'Bakery Counter',     emoji: '🥐', bg: '#fff8ed' },
  { name: 'Wet Market',         emoji: '🐟', bg: '#edfff7' },
  { name: 'Ribbon Ruler',       emoji: '🎀', bg: '#fdf0ff' },
  { name: 'Bus Fare Journey',   emoji: '🚌', bg: '#f0f8ff' },
  { name: 'MRT Station',        emoji: '🚇', bg: '#f0f0ff' },
  { name: 'Bookshop Budget',    emoji: '📚', bg: '#fffaed' },
  { name: 'Pasar Malam Stalls', emoji: '🏮', bg: '#fff4f0' },
  { name: 'Rainbow Bridge',     emoji: '🌈', bg: '#f4fff4' },
  { name: 'Decimal Palace',     emoji: '🏰', bg: '#fffff0' },
];
