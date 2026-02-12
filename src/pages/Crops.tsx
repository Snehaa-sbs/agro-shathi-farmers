import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Sprout, AlertTriangle, Calendar, FlaskConical } from 'lucide-react';

const cropData = [
  { key: 'crops.rice', emoji: '🌾', disease: 'common.medium', harvest: 45, fertilizer: true, stage: 3 },
  { key: 'crops.wheat', emoji: '🌿', disease: 'common.low', harvest: 60, fertilizer: false, stage: 2 },
  { key: 'crops.corn', emoji: '🌽', disease: 'common.low', harvest: 30, fertilizer: true, stage: 4 },
  { key: 'crops.vegetables', emoji: '🥬', disease: 'common.high', harvest: 15, fertilizer: false, stage: 5 },
];

const stages = ['Seeding', 'Germination', 'Vegetative', 'Flowering', 'Harvest'];
const stagesBn = ['বীজ বপন', 'অঙ্কুরোদগম', 'বৃদ্ধি', 'ফুল ফোটা', 'ফসল কাটা'];

const Crops: React.FC = () => {
  const { t, lang } = useI18n();
  const [selected, setSelected] = useState(0);

  const crop = cropData[selected];
  const stageList = lang === 'bn' ? stagesBn : stages;

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">🌱 {t('crops.title')}</h1>

      {/* Crop Selection */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {cropData.map((c, i) => (
          <button
            key={c.key}
            onClick={() => setSelected(i)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-sm transition-all ${
              selected === i
                ? 'gradient-earth text-primary-foreground shadow-button'
                : 'bg-card border border-border text-foreground'
            }`}
          >
            {c.emoji} {t(c.key)}
          </button>
        ))}
      </div>

      {/* Growth Stage */}
      <motion.div
        key={selected}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-2xl bg-card border border-border shadow-card mb-4"
      >
        <h3 className="font-bold text-foreground mb-3">{t('crops.stage')}</h3>
        <div className="flex items-center gap-1">
          {stageList.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full h-2 rounded-full ${
                i < crop.stage ? 'gradient-earth' : 'bg-muted'
              }`} />
              <span className={`text-[8px] font-semibold ${
                i < crop.stage ? 'text-primary' : 'text-muted-foreground'
              }`}>{s}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-card">
          <AlertTriangle className="w-5 h-5 text-warning mb-2" />
          <p className="text-xs font-semibold text-muted-foreground">{t('crops.disease')}</p>
          <p className="text-lg font-extrabold text-foreground">{t(crop.disease)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border shadow-card">
          <Calendar className="w-5 h-5 text-primary mb-2" />
          <p className="text-xs font-semibold text-muted-foreground">{t('crops.harvest')}</p>
          <p className="text-lg font-extrabold text-foreground">{crop.harvest} {t('crops.days')}</p>
        </div>
        {crop.fertilizer && (
          <div className="col-span-2 p-4 rounded-2xl bg-success/10 border border-success/20">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-success" />
              <p className="text-sm font-bold text-foreground">{t('crops.fertilizer')}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {lang === 'bn' ? 'আগামীকাল সার দিতে হবে। প্রতি শতাংশে ২ কেজি ইউরিয়া।' : 'Fertilizer due tomorrow. Apply 2kg urea per decimal.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Crops;
