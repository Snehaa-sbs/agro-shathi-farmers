import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Mic, X, Volume2, StopCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

const useSpeechSynthesis = () => {
  const speak = useCallback((text: string, lang: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  return { speak, stop };
};

const useSpeechRecognition = () => {
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback((lang: string, onResult: (text: string) => void, onEnd: () => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onEnd();
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    recognition.onerror = () => onEnd();
    recognition.onend = () => onEnd();
    recognition.start();
    recognitionRef.current = recognition;
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { startListening, stopListening };
};

// Simple mock AI responses
const getAIResponse = (query: string, lang: string): string => {
  const q = query.toLowerCase();
  if (lang === 'bn') {
    if (q.includes('আবহাওয়া') || q.includes('weather')) return 'আজ তাপমাত্রা ৩২°সে, আর্দ্রতা ৭৮%। আংশিক মেঘলা আকাশ। আগামীকাল বৃষ্টির সম্ভাবনা আছে।';
    if (q.includes('পানি') || q.includes('সেচ') || q.includes('water')) return 'আজ প্রতি শতাংশে ১৫ লিটার পানি দিতে হবে। সকাল ৬-৮টা সেচের জন্য ভালো সময়।';
    if (q.includes('রোগ') || q.includes('disease')) return 'উচ্চ আর্দ্রতায় ব্লাস্ট রোগের ঝুঁকি আছে। ছত্রাকনাশক স্প্রে করুন।';
    if (q.includes('সার') || q.includes('fertilizer')) return 'আগামীকাল সার দিতে হবে। প্রতি শতাংশে ২ কেজি ইউরিয়া প্রয়োগ করুন।';
    return 'আপনার প্রশ্নের জন্য ধন্যবাদ। আবহাওয়া, সেচ, রোগ বা সার সম্পর্কে জিজ্ঞাসা করুন।';
  }
  if (q.includes('weather') || q.includes('temp')) return 'Today\'s temperature is 32°C with 78% humidity. Partly cloudy. Rain expected tomorrow.';
  if (q.includes('water') || q.includes('irrigat')) return 'You need to irrigate 15 liters per decimal today. Best time: 6-8 AM morning.';
  if (q.includes('disease')) return 'High humidity increases blast disease risk. Apply fungicide spray.';
  if (q.includes('fertiliz')) return 'Fertilizer due tomorrow. Apply 2kg urea per decimal.';
  return 'Thank you for your question. Ask me about weather, irrigation, diseases, or fertilizer.';
};

const VoiceAssistant: React.FC = () => {
  const { t, lang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [response, setResponse] = useState('');
  const { speak, stop } = useSpeechSynthesis();
  const { startListening, stopListening } = useSpeechRecognition();

  const handleMicPress = () => {
    if (!isOpen) {
      setIsOpen(true);
      return;
    }
    if (isListening) {
      stopListening();
      setIsListening(false);
      return;
    }
    setIsListening(true);
    setUserQuery('');
    setResponse('');

    startListening(
      lang,
      (text) => {
        setUserQuery(text);
        const aiResp = getAIResponse(text, lang);
        setResponse(aiResp);
        speak(aiResp, lang);
        setIsSpeaking(true);
        // Auto-stop speaking state after a delay
        setTimeout(() => setIsSpeaking(false), 5000);
      },
      () => setIsListening(false)
    );
  };

  const handlePlayResponse = () => {
    if (response) {
      speak(response, lang);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 5000);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setResponse('');
    setUserQuery('');
    stop();
    stopListening();
    setIsListening(false);
    setIsSpeaking(false);
  };

  return (
    <>
      {/* Floating Mic Button */}
      <motion.button
        onClick={handleMicPress}
        className="fixed bottom-24 right-4 z-50 w-16 h-16 rounded-full gradient-earth flex items-center justify-center shadow-button animate-pulse-glow"
        whileTap={{ scale: 0.9 }}
        aria-label={t('dashboard.voice.hint')}
      >
        <Mic className="w-7 h-7 text-primary-foreground" />
      </motion.button>

      {/* Voice Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[60] bg-card rounded-t-3xl shadow-float border-t border-border p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-foreground">
                {lang === 'bn' ? '🎤 ভয়েস সহকারী' : '🎤 Voice Assistant'}
              </h3>
              <button onClick={handleClose} className="text-muted-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <motion.button
                onClick={handleMicPress}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                  isListening ? 'bg-destructive' : 'gradient-earth'
                }`}
                animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                {isListening ? (
                  <StopCircle className="w-8 h-8 text-destructive-foreground" />
                ) : (
                  <Mic className="w-8 h-8 text-primary-foreground" />
                )}
              </motion.button>

              <p className="text-sm text-muted-foreground text-center">
                {isListening
                  ? (lang === 'bn' ? '🔴 শুনছি... আবার ট্যাপ করে থামান' : '🔴 Listening... tap to stop')
                  : t('dashboard.voice.hint')}
              </p>

              {userQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full p-3 rounded-xl bg-primary/10 border border-primary/20"
                >
                  <p className="text-xs text-muted-foreground mb-1">{lang === 'bn' ? 'আপনি বলেছেন:' : 'You said:'}</p>
                  <p className="text-sm font-semibold text-foreground">{userQuery}</p>
                </motion.div>
              )}

              {response && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full p-4 rounded-xl bg-muted"
                >
                  <div className="flex items-start gap-3">
                    <button onClick={handlePlayResponse} className="flex-shrink-0 mt-0.5">
                      <Volume2 className={`w-5 h-5 ${isSpeaking ? 'text-primary animate-pulse' : 'text-primary'}`} />
                    </button>
                    <p className="text-sm font-medium text-foreground">{response}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAssistant;
