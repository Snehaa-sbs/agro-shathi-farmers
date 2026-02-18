import React, { useState } from 'react';
import { Beaker, Loader2, Leaf, FlaskConical } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SoilHealth = () => {
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [crop, setCrop] = useState('Rice');
  const [soilData, setSoilData] = useState({
    ph: '6.5',
    nitrogen: '200',
    phosphorus: '25',
    potassium: '150',
    organicMatter: '2.5',
  });

  const updateField = (field: string, value: string) => {
    setSoilData(prev => ({ ...prev, [field]: value }));
  };

  const analyze = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('soil-health', {
        body: { soilData, crop, lang }
      });
      if (error) throw error;
      setAnalysis(data);
    } catch (err: any) {
      toast({ title: lang === 'bn' ? 'বিশ্লেষণ ব্যর্থ' : 'Analysis failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const healthColor = (h: string) => {
    if (h === 'excellent') return 'default';
    if (h === 'good') return 'default';
    if (h === 'moderate') return 'secondary';
    return 'destructive';
  };

  const levelColor = (l: string) => {
    if (l === 'low') return 'destructive';
    if (l === 'high') return 'secondary';
    return 'default';
  };

  const crops = [
    { en: 'Rice', bn: 'ধান' },
    { en: 'Wheat', bn: 'গম' },
    { en: 'Corn', bn: 'ভুট্টা' },
    { en: 'Potato', bn: 'আলু' },
    { en: 'Vegetables', bn: 'সবজি' },
    { en: 'Jute', bn: 'পাট' },
  ];

  return (
    <div className="p-4 space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Beaker className="w-7 h-7 text-primary" />
          {t('soil.title')}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{t('soil.subtitle')}</p>
      </motion.div>

      {/* Input Form */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t('soil.inputTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">{t('soil.ph')}</Label>
              <Input type="number" step="0.1" value={soilData.ph} onChange={e => updateField('ph', e.target.value)} className="h-10 text-lg" />
            </div>
            <div>
              <Label className="text-xs">{t('soil.organic')}</Label>
              <Input type="number" step="0.1" value={soilData.organicMatter} onChange={e => updateField('organicMatter', e.target.value)} className="h-10 text-lg" />
            </div>
            <div>
              <Label className="text-xs">{t('soil.nitrogen')} (kg/ha)</Label>
              <Input type="number" value={soilData.nitrogen} onChange={e => updateField('nitrogen', e.target.value)} className="h-10 text-lg" />
            </div>
            <div>
              <Label className="text-xs">{t('soil.phosphorus')} (kg/ha)</Label>
              <Input type="number" value={soilData.phosphorus} onChange={e => updateField('phosphorus', e.target.value)} className="h-10 text-lg" />
            </div>
            <div>
              <Label className="text-xs">{t('soil.potassium')} (kg/ha)</Label>
              <Input type="number" value={soilData.potassium} onChange={e => updateField('potassium', e.target.value)} className="h-10 text-lg" />
            </div>
            <div>
              <Label className="text-xs">{t('soil.crop')}</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {crops.map(c => (
                    <SelectItem key={c.en} value={c.en}>{lang === 'bn' ? c.bn : c.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={analyze} disabled={isLoading} className="w-full gradient-earth text-primary-foreground h-12 text-base">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <FlaskConical className="w-5 h-5 mr-2" />}
            {isLoading ? t('soil.analyzing') : t('soil.analyze')}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <AnimatePresence>
        {analysis && !analysis.raw_advice && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <Card className="shadow-card border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-foreground">{t('soil.overallHealth')}</span>
                  <Badge variant={healthColor(analysis.overall_health)} className="capitalize">{analysis.overall_health}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{lang === 'bn' ? analysis.ph_status_bn : analysis.ph_status}</p>
              </CardContent>
            </Card>

            {/* Nutrient Deficiencies */}
            {analysis.deficiencies?.length > 0 && (
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t('soil.nutrients')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {analysis.deficiencies.map((d: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-semibold text-sm">{lang === 'bn' ? d.nutrient_bn : d.nutrient}</p>
                        <p className="text-xs text-muted-foreground">{lang === 'bn' ? d.recommendation_bn : d.recommendation}</p>
                      </div>
                      <Badge variant={levelColor(d.level)} className="capitalize">{d.level}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Fertilizer Plan */}
            {analysis.fertilizer_plan?.length > 0 && (
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-primary" />
                    {t('soil.fertilizerPlan')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {analysis.fertilizer_plan.map((f: any, i: number) => (
                    <div key={i} className="p-3 bg-primary/5 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm">{lang === 'bn' ? f.fertilizer_bn : f.fertilizer}</span>
                        <span className="text-xs font-bold text-primary">{f.amount}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{lang === 'bn' ? f.timing_bn : f.timing}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            {analysis.tips?.length > 0 && (
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">💡 {t('soil.tips')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(lang === 'bn' ? analysis.tips_bn : analysis.tips).map((tip: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SoilHealth;
