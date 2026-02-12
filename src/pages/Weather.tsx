import React from 'react';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { ThermometerSun, Droplets, CloudRain, Wind, Sun, CloudSun } from 'lucide-react';

const Weather: React.FC = () => {
  const { t, lang } = useI18n();

  const forecast = [
    { day: lang === 'bn' ? 'শনি' : 'Sat', icon: CloudSun, temp: '31°', rain: '10%' },
    { day: lang === 'bn' ? 'রবি' : 'Sun', icon: CloudRain, temp: '28°', rain: '70%' },
    { day: lang === 'bn' ? 'সোম' : 'Mon', icon: CloudRain, temp: '27°', rain: '80%' },
    { day: lang === 'bn' ? 'মঙ্গল' : 'Tue', icon: Sun, temp: '33°', rain: '5%' },
    { day: lang === 'bn' ? 'বুধ' : 'Wed', icon: Sun, temp: '34°', rain: '0%' },
    { day: lang === 'bn' ? 'বৃহ' : 'Thu', icon: CloudSun, temp: '32°', rain: '15%' },
    { day: lang === 'bn' ? 'শুক্র' : 'Fri', icon: CloudSun, temp: '31°', rain: '20%' },
  ];

  const stats = [
    { icon: ThermometerSun, label: t('weather.temp'), value: '32°C / 24°C', color: 'text-warning' },
    { icon: Droplets, label: t('weather.humidity'), value: '78%', color: 'text-info' },
    { icon: CloudRain, label: t('weather.rain'), value: '35%', color: 'text-info' },
    { icon: Wind, label: t('weather.wind'), value: '12 km/h', color: 'text-muted-foreground' },
    { icon: Sun, label: t('weather.uv'), value: '7 (High)', color: 'text-warning' },
  ];

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">🌦️ {t('weather.title')}</h1>

      {/* Current Weather Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-3xl gradient-sky mb-6 text-center shadow-float"
      >
        <CloudSun className="w-16 h-16 text-primary-foreground mx-auto mb-2 animate-float" />
        <p className="text-5xl font-extrabold text-primary-foreground">32°C</p>
        <p className="text-primary-foreground/80 font-semibold mt-1">
          {lang === 'bn' ? 'আংশিক মেঘলা' : 'Partly Cloudy'}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-3 rounded-2xl bg-card border border-border shadow-card"
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-1`} />
            <p className="text-xs text-muted-foreground font-semibold">{stat.label}</p>
            <p className="text-lg font-extrabold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* 7-Day Forecast */}
      <h2 className="text-lg font-bold text-foreground mb-3">📅 {t('weather.forecast')}</h2>
      <div className="flex gap-2 overflow-x-auto pb-4 -mx-1 px-1">
        {forecast.map((day, i) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="flex-shrink-0 w-16 py-3 px-2 rounded-2xl bg-card border border-border shadow-card flex flex-col items-center gap-1"
          >
            <span className="text-xs font-bold text-muted-foreground">{day.day}</span>
            <day.icon className="w-5 h-5 text-warning" />
            <span className="text-sm font-extrabold text-foreground">{day.temp}</span>
            <span className="text-[10px] text-info font-semibold">💧{day.rain}</span>
          </motion.div>
        ))}
      </div>

      {/* Advice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-4 rounded-2xl bg-warning/10 border border-warning/20"
      >
        <h3 className="font-bold text-foreground text-sm mb-1">💡 {t('weather.advice')}</h3>
        <p className="text-sm text-muted-foreground">{t('weather.advice.text')}</p>
      </motion.div>
    </div>
  );
};

export default Weather;
