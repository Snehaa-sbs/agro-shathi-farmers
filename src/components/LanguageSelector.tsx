import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { setLang, setFirstLaunchDone } = useI18n();
  const [selected, setSelected] = useState<'en' | 'bn' | null>(null);

  const handleStart = () => {
    if (selected) {
      setLang(selected);
      setFirstLaunchDone();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-sm text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="w-24 h-24 rounded-3xl gradient-earth flex items-center justify-center mx-auto mb-6 shadow-button"
        >
          <Sprout className="w-12 h-12 text-primary-foreground" />
        </motion.div>

        <h1 className="text-2xl font-extrabold text-foreground mb-1">Welcome / স্বাগতম</h1>
        <p className="text-lg font-bold text-primary mb-1">AgroSmart Assistant</p>
        <p className="text-sm text-muted-foreground mb-8">এগ্রোস্মার্ট সহকারী</p>

        <p className="text-base font-bold text-foreground mb-4">
          Choose your language / আপনার ভাষা নির্বাচন করুন
        </p>

        {/* Language Buttons */}
        <div className="space-y-3 mb-8">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected('en')}
            className={`w-full py-5 px-6 rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-3 ${
              selected === 'en'
                ? 'gradient-earth text-primary-foreground shadow-button'
                : 'bg-card border-2 border-border text-foreground'
            }`}
          >
            🇬🇧 English
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected('bn')}
            className={`w-full py-5 px-6 rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-3 ${
              selected === 'bn'
                ? 'gradient-earth text-primary-foreground shadow-button'
                : 'bg-card border-2 border-border text-foreground'
            }`}
          >
            🇧🇩 বাংলা (Bangla)
          </motion.button>
        </div>

        {/* Start Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          disabled={!selected}
          className={`w-full py-4 rounded-2xl text-lg font-extrabold transition-all ${
            selected
              ? 'gradient-sun text-secondary-foreground shadow-button'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {selected === 'bn' ? '🚀 শুরু করুন' : '🚀 Get Started'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LanguageSelector;
