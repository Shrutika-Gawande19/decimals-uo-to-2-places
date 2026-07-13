import { useRef, useCallback } from 'react';

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL = 'eleven_multilingual_v2';

// Style presets per narration context
const VOICE_SETTINGS = {
  statement:    { stability: 0.75, similarity_boost: 0.75, style: 0.0 },
  instruction:  { stability: 0.80, similarity_boost: 0.75, style: 0.0 },
  question:     { stability: 0.60, similarity_boost: 0.80, style: 0.3 },
  encouragement:{ stability: 0.55, similarity_boost: 0.85, style: 0.6 },
  emphasis:     { stability: 0.85, similarity_boost: 0.70, style: 0.1 },
  thinking:     { stability: 0.65, similarity_boost: 0.80, style: 0.2 },
  celebration:  { stability: 0.45, similarity_boost: 0.90, style: 0.8 },
};

export function useAudio(audioEnabled = true) {
  const cache = useRef(new Map()); // text → blob URL
  const currentAudio = useRef(null);
  const preloadedAudio = useRef(null);

  const getApiKey = () => import.meta.env.VITE_ELEVENLABS_API_KEY;

  const stop = useCallback(() => {
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current.src = '';
      currentAudio.current = null;
    }
  }, []);

  const fetchAudioBlob = useCallback(async (text, style = 'statement') => {
    if (!audioEnabled || !getApiKey()) return null;
    const cacheKey = `${text}::${style}`;
    if (cache.current.has(cacheKey)) return cache.current.get(cacheKey);

    try {
      const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': getApiKey(),
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: MODEL,
          voice_settings: settings,
        }),
      });

      if (!res.ok) return null;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      cache.current.set(cacheKey, url);
      return url;
    } catch {
      return null;
    }
  }, [audioEnabled]);

  const playText = useCallback(async (text, style = 'statement', onEnd) => {
    if (!audioEnabled) { onEnd?.(); return; }
    stop();

    const url = await fetchAudioBlob(text, style);
    if (!url) { onEnd?.(); return; }

    const audio = new Audio(url);
    currentAudio.current = audio;
    audio.onended = () => { currentAudio.current = null; onEnd?.(); };
    audio.onerror = () => { currentAudio.current = null; onEnd?.(); };
    audio.play().catch(() => { onEnd?.(); });
  }, [audioEnabled, fetchAudioBlob, stop]);

  // Play array of segments sequentially, eagerly preloading next
  const playSegments = useCallback(async (segments, style = 'statement', onDone) => {
    if (!audioEnabled || !segments?.length) { onDone?.(); return; }

    let cancelled = false;
    const cancel = () => { cancelled = true; stop(); };

    const playOne = async (index) => {
      if (cancelled || index >= segments.length) { onDone?.(); return; }

      // Eager-preload next segment
      if (index + 1 < segments.length) {
        fetchAudioBlob(segments[index + 1], style);
      }

      await new Promise((resolve) => playText(segments[index], style, resolve));
      if (!cancelled) playOne(index + 1);
    };

    playOne(0);
    return cancel;
  }, [audioEnabled, playText, fetchAudioBlob, stop]);

  const preload = useCallback((text, style = 'statement') => {
    fetchAudioBlob(text, style);
  }, [fetchAudioBlob]);

  return { playText, playSegments, preload, stop };
}
