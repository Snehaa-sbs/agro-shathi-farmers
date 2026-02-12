import React from 'react';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Droplets, ThermometerSun, Wind, CloudRain, Sun, Wifi, WifiOff } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const sensorItems = [
  { key: 'sensors.soil.moisture', icon: Droplets, value: '65%', unit: '', status: 'online', updated: 3, color: 'gradient-sky' },
  { key: 'sensors.soil.temp', icon: ThermometerSun, value: '28°C', unit: '', status: 'online', updated: 3, color: 'gradient-sun' },
  { key: 'sensors.air.temp', icon: ThermometerSun, value: '32°C', unit: '', status: 'online', updated: 5, color: 'gradient-sun' },
  { key: 'sensors.humidity', icon: Wind, value: '78%', unit: '', status: 'online', updated: 5, color: 'gradient-sky' },
  { key: 'sensors.rain', icon: CloudRain, value: 'No', unit: '', status: 'online', updated: 1, color: 'gradient-earth' },
  { key: 'sensors.light', icon: Sun, value: '850', unit: 'lux', status: 'offline', updated: 30, color: 'gradient-sun' },
];

const moistureData = [
  { day: 'Mon', value: 58 },
  { day: 'Tue', value: 62 },
  { day: 'Wed', value: 55 },
  { day: 'Thu', value: 70 },
  { day: 'Fri', value: 68 },
  { day: 'Sat', value: 65 },
  { day: 'Sun', value: 65 },
];

const tempData = [
  { day: 'Mon', value: 30 },
  { day: 'Tue', value: 31 },
  { day: 'Wed', value: 28 },
  { day: 'Thu', value: 33 },
  { day: 'Fri', value: 34 },
  { day: 'Sat', value: 32 },
  { day: 'Sun', value: 32 },
];

const Sensors: React.FC = () => {
  const { t, lang } = useI18n();

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">📡 {t('sensors.title')}</h1>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {sensorItems.map((sensor, i) => (
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

      {/* Charts */}
      <h2 className="text-lg font-bold text-foreground mb-3">📈 {t('sensors.history')}</h2>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-2xl bg-card border border-border shadow-card mb-4"
      >
        <p className="text-sm font-bold text-foreground mb-2">💧 {t('sensors.soil.moisture')} (%)</p>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={moistureData}>
            <defs>
              <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(200, 70%, 50%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(200, 70%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[40, 80]} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="hsl(200, 70%, 50%)" fill="url(#moistureGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-2xl bg-card border border-border shadow-card"
      >
        <p className="text-sm font-bold text-foreground mb-2">🌡️ {t('sensors.air.temp')} (°C)</p>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={tempData}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(35, 80%, 55%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(35, 80%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[25, 38]} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="hsl(35, 80%, 55%)" fill="url(#tempGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Sensors;
