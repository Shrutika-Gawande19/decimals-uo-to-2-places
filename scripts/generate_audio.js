import fs from 'fs';
import path from 'path';

// Text segments exactly matching the ones we'll read
const phrases = [
  // WonderPhase — question text (white)
  { text: "Ravi has 3 point 4 5 dollars. The toy costs 3 point 5 zero dollars. Does Ravi have enough money?", style: 'question' },
  { text: "When numbers have a decimal point, even a tiny difference matters! Let's explore what those digits mean.", style: 'statement' },
  { text: "The difference is just 5 cents — but which number is bigger?", style: 'thinking' },

  { text: "A ribbon is 2 point 6 meters long. Another is 2 point zero 6 meters. Which ribbon is longer?", style: 'question' },
  { text: "Both look similar, but they are actually very different lengths!", style: 'statement' },
  { text: "The digits after the decimal point decide — tenths vs hundredths!", style: 'instruction' },

  { text: "A weighing scale shows 4 point zero 8 kilograms. What does the 8 mean?", style: 'question' },
  { text: "Every digit in a decimal number has its own special place and value!", style: 'statement' },
  { text: "Is it 8 tenths? Or 8 hundredths? The position tells all!", style: 'instruction' },

  { text: "Priya scores 9 point 7 zero and Ahmad scores 9 point 7. Who scored higher?", style: 'question' },
  { text: "Are these two scores the same, or is one really higher?", style: 'statement' },
  { text: "Do trailing zeros change the value? Let's find out!", style: 'instruction' },

  { text: "A bus fare costs 1 point zero 5 dollars and a snack costs zero point 9 zero dollars. Together, how much?", style: 'question' },
  { text: "Decimals help us count money exactly — every cent matters!", style: 'statement' },
  { text: "Can you add decimals like whole numbers? Almost — but you must line up the dots!", style: 'instruction' },

  // StoryPhase — story body text (white)
  { text: "Leo really wants the new toy robot in the shop window. The price tag says 12 point 5 zero dollars. The number before the dot tells him the whole dollars, and the numbers after the dot are the parts of a dollar — the cents! Decimals help us count money perfectly.", style: 'statement' },
  { text: "Later, Leo helps his mom bake a cake. The recipe needs exactly 1 point 2 5 kilograms of flour. The 2 is in the tenths place, and the 5 is in the hundredths place. Every tiny bit matters in baking, and decimals help us measure exactly what we need!", style: 'statement' },
  { text: "At school, Leo runs a race in 14 point 8 seconds. His friend runs it in 14 point zero 8 seconds. Who was faster? 14 point 8 has 8 tenths, but 14 point zero 8 has zero tenths! So Leo took more time. His friend was faster!", style: 'statement' },
  { text: "In art class, Leo needs a ribbon exactly 3 point 5 meters long. He cuts a ribbon that is 3 point 5 zero meters long. His teacher smiles and says they are exactly the same length! Adding a zero at the end doesn't change the value.", style: 'statement' },
  { text: "Leo gets an A on his math quiz! He realizes decimals aren't just numbers on a page — they are everywhere in the real world, helping us measure things perfectly. Now, he's a true Decimal Explorer!", style: 'celebration' },

  // IntroScreen
  { text: "Welcome to the world of Decimals!", style: 'celebration' },

  // SimulatePhase — station intros
  { text: "Let's build numbers! Drag the discs into the correct column to show the ones, tenths, and hundredths.", style: 'instruction' },
  { text: "Amazing! You built it perfectly! Let's go to the next round!", style: 'celebration' },
  { text: "Woohoo! Station one is complete! Now let's head to the Juice Mixing Lab!", style: 'celebration' },
  { text: "Great work mixing! Time to mine some decimal crystals!", style: 'celebration' },
  { text: "You are a true Decimal Explorer! All three stations done!", style: 'celebration' },

  // PlayPhase
  { text: "Choose the correct answer for the question.", style: 'instruction' },
  { text: "That's correct! Well done!", style: 'celebration' },
  { text: "Not quite! Try again — you can do it!", style: 'encouragement' },

  // ReflectPhase
  { text: "Great job! Let's review what you learned.", style: 'celebration' },
  { text: "Now let's test what you know. Can you teach it back?", style: 'instruction' },
  { text: "That's correct! You really understand decimals!", style: 'celebration' },
  { text: "Almost! Remember what we learned — give it another try!", style: 'encouragement' },
];

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
let API_KEY = process.env.VITE_ELEVENLABS_API_KEY;

if (!API_KEY && fs.existsSync(path.join(process.cwd(), '.env.local'))) {
  const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
  const match = envContent.match(/VITE_ELEVENLABS_API_KEY=(.*)/);
  if (match) {
    API_KEY = match[1].trim();
  }
}

if (!API_KEY) {
  console.error("Missing VITE_ELEVENLABS_API_KEY. Did you forget to load .env.local?");
  process.exit(1);
}

const styles = {
  celebration: { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question: { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis: { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking: { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateAudio() {
  const audioMap = {};
  const outputDir = path.join(process.cwd(), 'public', 'assets', 'audio');

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const slug = slugify(text).substring(0, 50);
    const filename = `audio_${style}_${slug}_${i}.mp3`;
    const outPath = path.join(outputDir, filename);
    const relPath = `/assets/audio/${filename}`;

    audioMap[text] = relPath;

    const forceRegenIndices = [0, 3, 6, 9, 12, 15, 16, 17, 18];
    if (fs.existsSync(outPath) && !forceRegenIndices.includes(i)) {
      console.log(`Skipping (already exists): ${filename}`);
      continue;
    }

    console.log(`Generating [${style}]: ${text.substring(0, 60)}...`);

    const voiceSettings = styles[style] || styles.statement;

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
        {
          method: 'POST',
          headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model_id: 'eleven_multilingual_v2', text, voice_settings: voiceSettings }),
        }
      );

      if (!response.ok) {
        console.error(`Error for "${filename}":`, await response.text());
        continue;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(outPath, buffer);
      await delay(500);
    } catch (err) {
      console.error(`Fetch failed for "${filename}":`, err.message);
    }
  }

  const mapCode = `export const audioMap = ${JSON.stringify(audioMap, null, 2)};\n`;
  fs.writeFileSync(path.join(process.cwd(), 'src', 'utils', 'audioMap.js'), mapCode);
  console.log('\n✅ Updated src/utils/audioMap.js');
}

generateAudio();
