/**
 * Shared speech synthesis utility with proper Bangla voice support.
 * 
 * The Web Speech API often doesn't have bn-BD voices loaded immediately.
 * This utility waits for voices to load and picks the best available Bangla voice.
 */

let voicesLoaded = false;
let cachedVoices: SpeechSynthesisVoice[] = [];

const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (voicesLoaded && cachedVoices.length > 0) {
      resolve(cachedVoices);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      cachedVoices = voices;
      voicesLoaded = true;
      resolve(voices);
      return;
    }

    // Voices not yet loaded — wait for the event
    const onVoicesChanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      voicesLoaded = true;
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      resolve(cachedVoices);
    };
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);

    // Timeout fallback (some browsers never fire voiceschanged)
    setTimeout(() => {
      if (!voicesLoaded) {
        cachedVoices = window.speechSynthesis.getVoices();
        voicesLoaded = true;
        resolve(cachedVoices);
      }
    }, 1000);
  });
};

const findBestVoice = (voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null => {
  if (lang === 'bn') {
    // Try exact matches first
    const bnVoice = voices.find(v => v.lang === 'bn-BD') 
      || voices.find(v => v.lang === 'bn-IN')
      || voices.find(v => v.lang.startsWith('bn'))
      // Fallback: try Hindi as it shares similar phonetics
      || voices.find(v => v.lang === 'hi-IN')
      || voices.find(v => v.lang.startsWith('hi'));
    return bnVoice || null;
  }
  
  const enVoice = voices.find(v => v.lang === 'en-US')
    || voices.find(v => v.lang.startsWith('en'));
  return enVoice || null;
};

export const speakText = async (text: string, lang: string): Promise<void> => {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const voices = await loadVoices();
  const utterance = new SpeechSynthesisUtterance(text);
  
  const voice = findBestVoice(voices, lang);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
  }
  
  utterance.rate = 0.85;
  utterance.pitch = 1;

  // Chrome bug workaround: speechSynthesis can pause on long texts
  // Resume periodically
  const resumeInterval = setInterval(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      // Keep alive
    } else if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }, 5000);

  return new Promise<void>((resolve) => {
    utterance.onend = () => {
      clearInterval(resumeInterval);
      resolve();
    };
    utterance.onerror = () => {
      clearInterval(resumeInterval);
      resolve();
    };
    window.speechSynthesis.speak(utterance);
  });
};

export const stopSpeaking = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
