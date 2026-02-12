import React from 'react';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Globe, Bell, Volume2, WifiOff, User, Info } from 'lucide-react';

const Settings: React.FC = () => {
  const { t, lang, setLang } = useI18n();

  const settingItems = [
    { icon: Bell, label: t('settings.notifications'), toggle: true, defaultOn: true },
    { icon: Volume2, label: t('settings.voice'), toggle: true, defaultOn: true },
    { icon: WifiOff, label: t('settings.offline'), toggle: true, defaultOn: false },
  ];

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">⚙️ {t('settings.title')}</h1>

      {/* Language Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-card border border-border shadow-card mb-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <Globe className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">{t('settings.language')}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setLang('en')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              lang === 'en' ? 'gradient-earth text-primary-foreground shadow-button' : 'bg-muted text-muted-foreground'
            }`}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => setLang('bn')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              lang === 'bn' ? 'gradient-earth text-primary-foreground shadow-button' : 'bg-muted text-muted-foreground'
            }`}
          >
            🇧🇩 বাংলা
          </button>
        </div>
      </motion.div>

      {/* Toggle Settings */}
      <div className="space-y-2 mb-6">
        {settingItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border shadow-card"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground text-sm">{item.label}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={item.defaultOn} className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primary-foreground after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-primary-foreground after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </motion.div>
        ))}
      </div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-2xl bg-card border border-border shadow-card mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full gradient-earth flex items-center justify-center">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="font-bold text-foreground">{t('settings.profile')}</p>
            <p className="text-xs text-muted-foreground">
              {lang === 'bn' ? 'ময়মনসিংহ, বাংলাদেশ' : 'Mymensingh, Bangladesh'}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-2xl bg-muted/50 text-center"
      >
        <Info className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
        <p className="text-xs text-muted-foreground font-semibold">{t('app.name')} v1.0</p>
        <p className="text-[10px] text-muted-foreground">{t('app.tagline')}</p>
      </motion.div>
    </div>
  );
};

export default Settings;
