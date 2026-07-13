import fs from 'fs';
import path from 'path';

const sourceDir = 'C:/Users/hp/.gemini/antigravity-ide/brain/b6e06efb-c1c8-443b-bc4c-3af508ea7ca2';
const destDir = path.join(process.cwd(), 'public', 'assets', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const images = [
  'story_toyshop_1783867121365.png',
  'story_baking_1783867139746.png',
  'story_race_1783867158204.png',
  'story_ribbon_1783867174776.png',
  'story_quiz_1783867191782.png'
];

let successCount = 0;

images.forEach(img => {
  const src = path.join(sourceDir, img);
  const dest = path.join(destDir, img);
  
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✅ Copied ${img} to public/assets/images`);
      successCount++;
    } else {
      console.warn(`⚠️ Source image not found: ${src}`);
    }
  } catch (err) {
    console.error(`❌ Failed to copy ${img}:`, err.message);
  }
});

console.log(`\nCopied ${successCount} out of ${images.length} images successfully.`);
