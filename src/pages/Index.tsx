import React from 'react';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import {
  CloudSun, Droplets, Sprout, AlertTriangle, Volume2,
  ThermometerSun, Wind, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Dashboard: React.FC = () => {
  const { t, lang } = useI18n();

  const quickStats = [
    {
      icon: ThermometerSun,
      label: t('weather.temp'),
      value: '32°C',
      sub: lang === 'bn' ? 'আংশিক মেঘলা' : 'Partly Cloudy',
      gradient: 'gradient-sun',
      link: '/weather',
    },
    {
      icon: Droplets,
      label: t('dashboard.soil'),
      value: '65%',
      sub: t('common.good'),
      gradient: 'gradient-sky',
      link: '/sensors',
    },
    {
      icon: Sprout,
      label: t('dashboard.water'),
      value: lang === 'bn' ? '১৫ লি.' : '15 L',
      sub: t('irrigation.liters'),
      gradient: 'gradient-earth',
      link: '/irrigation',
    },
    {
      icon: AlertTriangle,
      label: t('nav.alerts'),
      value: '1',
      sub: t('alerts.disease'),
      gradient: 'gradient-alert',
      link: '/alerts',
    },
  ];

  const tasks = lang === 'bn'
    ? ['সকালে ধানে পানি দিন', 'ছত্রাকনাশক স্প্রে করুন', 'সেন্সর ব্যাটারি চেক করুন']
    : ['Irrigate rice field in morning', 'Spray fungicide on crops', 'Check sensor batteries'];

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-extrabold text-foreground">
          🌾 {t('dashboard.greeting')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t('dashboard.today')}</p>
      </motion.div>

      {/* Listen Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full mb-5 py-3 px-4 rounded-2xl gradient-earth flex items-center justify-center gap-3 shadow-button"
      >
        <Volume2 className="w-5 h-5 text-primary-foreground" />
        <span className="font-bold text-primary-foreground text-base">
          🔊 {t('dashboard.listen')}
        </span>
      </motion.button>

      {/* Quick Stats Grid */}
      <motion.div
        className="grid grid-cols-2 gap-3 mb-6"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        initial="hidden"
        animate="show"
      >
        {quickStats.map((stat) => (
          <motion.div key={stat.label} variants={card}>
            <Link
              to={stat.link}
              className="block p-4 rounded-2xl bg-card shadow-card border border-border hover:shadow-float transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.gradient} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-extrabold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Weather Quick */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <Link to="/weather" className="block p-4 rounded-2xl bg-card shadow-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-warning" />
              <span className="font-bold text-foreground">{t('weather.advice')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{t('weather.advice.text')}</p>
        </Link>
      </motion.div>

      {/* Today's Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-lg font-bold text-foreground mb-3">📋 {t('dashboard.tasks')}</h2>
        <div className="space-y-2">
          {tasks.map((task, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border shadow-card">
              <div className="w-6 h-6 rounded-full border-2 border-primary flex-shrink-0" />
              <span className="text-sm font-semibold text-foreground">{task}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Disease Alert Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link to="/alerts" className="block p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="font-bold text-destructive text-sm">{t('alerts.disease')}</span>
          </div>
          <p className="text-xs text-foreground">{t('alerts.disease.desc')}</p>
        </Link>
      </motion.div>
    </div>
  );
};

export default Dashboard;
