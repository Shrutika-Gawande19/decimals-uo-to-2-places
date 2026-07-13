import { audioMap } from './audioMap';

let currentQueueSymbol = null;
let currentAudioElement = null;
let audioCache = {};

export const say = (text) => ({ text, style: 'statement' });
export const ask = (text) => ({ text, style: 'question' });
export const cheer = (text) => ({ text, style: 'encouragement' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think = (text) => ({ text, style: 'thinking' });
export const celebrate = (text) => ({ text, style: 'celebration' });
export const instruct = (text) => ({ text, style: 'instruction' });

// Preload audio
const preloadAudio = (url) => {
  if (!audioCache[url]) {
    const audio = new Audio(url);
    audio.load();
    audioCache[url] = audio;
  }
};

const getAudioUrl = async (text, style) => {
  // Always prefer static mapped audio
  if (audioMap[text]) {
    return audioMap[text];
  }
  
  // Fallback to dynamic generation via browser fetch
  console.warn(`Dynamic generation fallback for: "${text}". Please update audioMap.`);
  
  const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
  
  if (API_KEY) {
    try {
      const styles = {
        celebration: { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
        encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
        question: { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
        emphasis: { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
        thinking: { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
        statement: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
        instruction: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
      };
      const voiceSettings = styles[style] || styles.statement;
      
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
        {
          method: 'POST',
          headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model_id: 'eleven_multilingual_v2', text, voice_settings: voiceSettings }),
        }
      );
      
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
    } catch (err) {
      console.error("Dynamic audio generation failed", err);
    }
  }
  
  return null;
};

export const narrate = async (segments, shouldPlay = true) => {
  if (!shouldPlay || !segments || segments.length === 0) return;
  
  const symbol = Symbol();
  currentQueueSymbol = symbol;
  
  // Eager preloading for the first segment
  const firstUrl = await getAudioUrl(segments[0].text, segments[0].style);
  if (firstUrl) preloadAudio(firstUrl);
  
  for (let i = 0; i < segments.length; i++) {
    if (currentQueueSymbol !== symbol) break; // queue was interrupted
    
    const segment = segments[i];
    const url = await getAudioUrl(segment.text, segment.style);
    
    // Preload next segment if any
    if (i + 1 < segments.length) {
      getAudioUrl(segments[i+1].text, segments[i+1].style).then(nextUrl => {
        if (nextUrl) preloadAudio(nextUrl);
      });
    }
    
    if (!url) continue;
    
    await new Promise((resolve) => {
      const audio = audioCache[url] || new Audio(url);
      currentAudioElement = audio;
      
      // Slow down pace for a 4th grader (e.g. 0.9x speed)
      audio.playbackRate = 0.9;
      
      audio.onended = () => resolve();
      audio.onerror = (e) => {
        console.error("Audio playback error", e);
        resolve(); // Continue on error
      };
      
      audio.play().catch(e => {
        console.error("Audio play error", e);
        resolve();
      });
    });
  }
};

export const stopNarration = () => {
  currentQueueSymbol = null;
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.currentTime = 0;
    currentAudioElement = null;
  }
};
