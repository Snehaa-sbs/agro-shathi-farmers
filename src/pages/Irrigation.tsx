import React from 'react';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Droplets, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const Irrigation: React.FC = () => {
  const { t, lang } = useI18n();

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">💧 {t('irrigation.title')}</h1>

      {/* Water Requirement Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-3xl gradient-sky text-center shadow-float mb-6"
      >
        <Droplets className="w-14 h-14 text-primary-foreground mx-auto mb-2 animate-float" />
        <p className="text-5xl font-extrabold text-primary-foreground">
          {lang === 'bn' ? '১৫' : '15'}
        </p>
        <p className="text-primary-foreground/80 font-bold">{t('irrigation.liters')}</p>
      </motion.div>

      {/* Status */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-card">
          <Droplets className="w-5 h-5 text-info mb-2" />
          <p className="text-xs font-semibold text-muted-foreground">{t('dashboard.soil')}</p>
          <p className="text-xl font-extrabold text-foreground">65%</p>
          <div className="w-full h-2 rounded-full bg-muted mt-2">
            <div className="w-[65%] h-full rounded-full gradient-sky" />
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border shadow-card">
          <CheckCircle className="w-5 h-5 text-success mb-2" />
          <p className="text-xs font-semibold text-muted-foreground">
            {lang === 'bn' ? 'অবস্থা' : 'Status'}
          </p>
          <p className="text-lg font-extrabold text-success">
            {lang === 'bn' ? 'সেচ দরকার' : 'Needs Water'}
          </p>
        </div>
      </div>

      {/* Schedule */}
      <h2 className="text-lg font-bold text-foreground mb-3">🕐 {t('irrigation.schedule')}</h2>
      <div className="space-y-2 mb-6">
        {[
          { time: t('irrigation.morning'), amount: lang === 'bn' ? '১০ লিটার' : '10 liters', active: true },
          { time: t('irrigation.evening'), amount: lang === 'bn' ? '৫ লিটার' : '5 liters', active: false },
        ].map((slot) => (
          <div key={slot.time} className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border shadow-card">
            <div className="flex items-center gap-3">
              <Clock className={`w-5 h-5 ${slot.active ? 'text-primary' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm font-bold text-foreground">{slot.time}</p>
                <p className="text-xs text-muted-foreground">{slot.amount}</p>
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${slot.active ? 'bg-success' : 'bg-muted'}`} />
          </div>
        ))}
      </div>

      {/* Warning */}
      <div className="p-4 rounded-2xl bg-warning/10 border border-warning/20">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <span className="font-bold text-foreground text-sm">{t('irrigation.warning')}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {lang === 'bn'
            ? 'অতিরিক্ত পানি দিলে শিকড় পচে যেতে পারে। সেন্সর রিডিং অনুসরণ করুন।'
            : 'Overwatering can cause root rot. Follow sensor readings for optimal irrigation.'}
        </p>
      </div>
    </div>
  );
};

export default Irrigation;
