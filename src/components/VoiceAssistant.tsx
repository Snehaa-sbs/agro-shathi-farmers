import React, { useState } from 'react';
import { Mic, X, Volume2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceAssistant: React.FC = () => {
  const { t, lang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState('');

  const handleMicPress = () => {
    if (!isOpen) {
      setIsOpen(true);
      return;
    }
    setIsListening(true);
    setResponse('');

    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      setResponse(
        lang === 'bn'
          ? 'আজ তাপমাত্রা ৩২°সে এবং আর্দ্রতা ৭৮%। প্রতি শতাংশে ১৫ লিটার পানি দিন।'
          : 'Today temperature is 32°C and humidity 78%. Irrigate 15 liters per decimal.'
      );
    }, 2000);
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
                {lang === 'bn' ? 'ভয়েস সহকারী' : 'Voice Assistant'}
              </h3>
              <button onClick={() => { setIsOpen(false); setResponse(''); }} className="text-muted-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <motion.button
                onTouchStart={handleMicPress}
                onClick={handleMicPress}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                  isListening ? 'bg-destructive' : 'gradient-earth'
                }`}
                animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Mic className="w-8 h-8 text-primary-foreground" />
              </motion.button>

              <p className="text-sm text-muted-foreground text-center">
                {isListening
                  ? (lang === 'bn' ? 'শুনছি...' : 'Listening...')
                  : t('dashboard.voice.hint')}
              </p>

              {response && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full p-4 rounded-xl bg-muted"
                >
                  <div className="flex items-start gap-3">
                    <Volume2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
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
