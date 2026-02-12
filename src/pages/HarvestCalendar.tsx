import React from 'react';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';

interface CropSeason {
  crop: { en: string; bn: string };
  emoji: string;
  plant: { en: string; bn: string };
  harvest: { en: string; bn: string };
  months: number[]; // 1-12, highlighted months
  type: 'plant' | 'harvest' | 'both';
  plantMonths: number[];
  harvestMonths: number[];
}

const crops: CropSeason[] = [
  {
    crop: { en: 'Aman Rice', bn: 'আমন ধান' },
    emoji: '🌾',
    plant: { en: 'Jun-Aug', bn: 'জুন-আগস্ট' },
    harvest: { en: 'Nov-Dec', bn: 'নভেম্বর-ডিসেম্বর' },
    months: [],
    type: 'both',
    plantMonths: [6, 7, 8],
    harvestMonths: [11, 12],
  },
  {
    crop: { en: 'Boro Rice', bn: 'বোরো ধান' },
    emoji: '🌾',
    plant: { en: 'Dec-Feb', bn: 'ডিসেম্বর-ফেব্রুয়ারি' },
    harvest: { en: 'Apr-May', bn: 'এপ্রিল-মে' },
    months: [],
    type: 'both',
    plantMonths: [12, 1, 2],
    harvestMonths: [4, 5],
  },
  {
    crop: { en: 'Wheat', bn: 'গম' },
    emoji: '🌿',
    plant: { en: 'Nov-Dec', bn: 'নভেম্বর-ডিসেম্বর' },
    harvest: { en: 'Mar-Apr', bn: 'মার্চ-এপ্রিল' },
    months: [],
    type: 'both',
    plantMonths: [11, 12],
    harvestMonths: [3, 4],
  },
  {
    crop: { en: 'Corn', bn: 'ভুট্টা' },
    emoji: '🌽',
    plant: { en: 'Oct-Nov', bn: 'অক্টোবর-নভেম্বর' },
    harvest: { en: 'Feb-Mar', bn: 'ফেব্রুয়ারি-মার্চ' },
    months: [],
    type: 'both',
    plantMonths: [10, 11],
    harvestMonths: [2, 3],
  },
  {
    crop: { en: 'Jute', bn: 'পাট' },
    emoji: '🌱',
    plant: { en: 'Mar-May', bn: 'মার্চ-মে' },
    harvest: { en: 'Jul-Sep', bn: 'জুলাই-সেপ্টেম্বর' },
    months: [],
    type: 'both',
    plantMonths: [3, 4, 5],
    harvestMonths: [7, 8, 9],
  },
  {
    crop: { en: 'Mustard', bn: 'সরিষা' },
    emoji: '🌼',
    plant: { en: 'Oct-Nov', bn: 'অক্টোবর-নভেম্বর' },
    harvest: { en: 'Feb-Mar', bn: 'ফেব্রুয়ারি-মার্চ' },
    months: [],
    type: 'both',
    plantMonths: [10, 11],
    harvestMonths: [2, 3],
  },
];

const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthsBn = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রি', 'মে', 'জুন', 'জুলা', 'আগ', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];

const HarvestCalendar: React.FC = () => {
  const { t, lang } = useI18n();
  const currentMonth = new Date().getMonth() + 1;
  const monthLabels = lang === 'bn' ? monthsBn : monthsEn;

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-2">📅 {t('calendar.title')}</h1>
      <p className="text-sm text-muted-foreground mb-4">
        {t('calendar.current')}: <span className="font-bold text-primary">{monthLabels[currentMonth - 1]}</span>
      </p>

      {/* Legend */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm gradient-earth" />
          <span className="text-xs font-semibold text-muted-foreground">{t('calendar.plant')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm gradient-sun" />
          <span className="text-xs font-semibold text-muted-foreground">{t('calendar.harvest')}</span>
        </div>
      </div>

      {/* Crop Timelines */}
      <div className="space-y-3">
        {crops.map((crop, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="p-3 rounded-2xl bg-card border border-border shadow-card"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-foreground text-sm">
                {crop.emoji} {lang === 'bn' ? crop.crop.bn : crop.crop.en}
              </span>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 12 }, (_, idx) => {
                const month = idx + 1;
                const isPlant = crop.plantMonths.includes(month);
                const isHarvest = crop.harvestMonths.includes(month);
                const isCurrent = month === currentMonth;
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-0.5">
                    <div
                      className={`w-full h-4 rounded-sm transition-all ${
                        isPlant ? 'gradient-earth' : isHarvest ? 'gradient-sun' : 'bg-muted'
                      } ${isCurrent ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                    />
                    <span className={`text-[7px] font-semibold ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                      {monthLabels[idx].slice(0, 2)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[9px] text-muted-foreground">
                🌱 {lang === 'bn' ? crop.plant.bn : crop.plant.en}
              </span>
              <span className="text-[9px] text-muted-foreground">
                🌾 {lang === 'bn' ? crop.harvest.bn : crop.harvest.en}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HarvestCalendar;
