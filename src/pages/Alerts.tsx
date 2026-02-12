import React from 'react';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { AlertTriangle, CloudRain, Zap, Thermometer, Volume2, Bug } from 'lucide-react';

const Alerts: React.FC = () => {
  const { t, lang } = useI18n();

  const alerts = [
    {
      icon: Bug,
      title: t('alerts.disease'),
      desc: t('alerts.disease.desc'),
      level: 'warning' as const,
      time: lang === 'bn' ? '২ ঘণ্টা আগে' : '2 hours ago',
    },
    {
      icon: CloudRain,
      title: t('alerts.flood'),
      desc: lang === 'bn' ? 'আগামী ৪৮ ঘণ্টায় ভারী বৃষ্টির সম্ভাবনা। সতর্ক থাকুন।' : 'Heavy rainfall expected in next 48 hours. Stay alert.',
      level: 'danger' as const,
      time: lang === 'bn' ? '৫ ঘণ্টা আগে' : '5 hours ago',
    },
    {
      icon: Thermometer,
      title: t('alerts.heatwave'),
      desc: lang === 'bn' ? 'তাপমাত্রা ৩৮°সে এর উপরে যেতে পারে। ফসলে বেশি পানি দিন।' : 'Temperature may exceed 38°C. Increase irrigation for crops.',
      level: 'warning' as const,
      time: lang === 'bn' ? '১ দিন আগে' : '1 day ago',
    },
  ];

  const levelStyles = {
    warning: 'bg-warning/10 border-warning/20',
    danger: 'bg-destructive/10 border-destructive/20',
  };

  const iconStyles = {
    warning: 'text-warning',
    danger: 'text-destructive',
  };

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">🚨 {t('alerts.title')}</h1>

      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-2xl border ${levelStyles[alert.level]}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <alert.icon className={`w-5 h-5 ${iconStyles[alert.level]}`} />
                <span className="font-bold text-foreground text-sm">{alert.title}</span>
              </div>
              <button className="gradient-earth w-8 h-8 rounded-full flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{alert.desc}</p>
            <p className="text-[10px] text-muted-foreground">{alert.time}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
