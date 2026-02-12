import React from 'react';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Droplets, ThermometerSun, Wind, CloudRain, Sun, Wifi, WifiOff } from 'lucide-react';

const sensors = [
  { key: 'sensors.soil.moisture', icon: Droplets, value: '65%', unit: '', status: 'online', updated: 3, color: 'gradient-sky' },
  { key: 'sensors.soil.temp', icon: ThermometerSun, value: '28°C', unit: '', status: 'online', updated: 3, color: 'gradient-sun' },
  { key: 'sensors.air.temp', icon: ThermometerSun, value: '32°C', unit: '', status: 'online', updated: 5, color: 'gradient-sun' },
  { key: 'sensors.humidity', icon: Wind, value: '78%', unit: '', status: 'online', updated: 5, color: 'gradient-sky' },
  { key: 'sensors.rain', icon: CloudRain, value: 'No', unit: '', status: 'online', updated: 1, color: 'gradient-earth' },
  { key: 'sensors.light', icon: Sun, value: '850', unit: 'lux', status: 'offline', updated: 30, color: 'gradient-sun' },
];

const Sensors: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">📡 {t('sensors.title')}</h1>

      <div className="grid grid-cols-2 gap-3">
        {sensors.map((sensor, i) => (
          <motion.div
            key={sensor.key}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="p-4 rounded-2xl bg-card border border-border shadow-card"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-xl ${sensor.color} flex items-center justify-center`}>
                <sensor.icon className="w-4 h-4 text-primary-foreground" />
              </div>
              {sensor.status === 'online' ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-success">
                  <Wifi className="w-3 h-3" /> {t('sensors.online')}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-bold text-destructive">
                  <WifiOff className="w-3 h-3" /> {t('sensors.offline')}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-muted-foreground">{t(sensor.key)}</p>
            <p className="text-2xl font-extrabold text-foreground">
              {sensor.value}{sensor.unit && <span className="text-sm font-semibold text-muted-foreground ml-1">{sensor.unit}</span>}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {t('sensors.lastUpdate')}: {sensor.updated} {t('sensors.minutes.ago')}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Sensors;
