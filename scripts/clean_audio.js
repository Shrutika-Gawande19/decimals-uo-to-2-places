import fs from 'fs';
import path from 'path';

import { audioMap } from '../src/utils/audioMap.js';

const outputDir = path.join(process.cwd(), 'public', 'assets', 'audio');
if (!fs.existsSync(outputDir)) {
  console.log("Audio directory does not exist.");
  process.exit(0);
}

const validFiles = new Set(Object.values(audioMap).map(p => path.basename(p)));

const allFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.mp3'));

let deletedCount = 0;
for (const file of allFiles) {
  if (!validFiles.has(file)) {
    fs.unlinkSync(path.join(outputDir, file));
    console.log(`Deleted unused audio: ${file}`);
    deletedCount++;
  }
}

console.log(`Cleanup complete. Deleted ${deletedCount} files.`);
