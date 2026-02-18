import React, { useState, useRef } from 'react';
import { Camera, Upload, Bug, Shield, Loader2, AlertTriangle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const DiseaseScanner = () => {
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<any>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: lang === 'bn' ? 'ফাইল খুব বড়' : 'File too large', description: lang === 'bn' ? '৫MB এর কম ফাইল ব্যবহার করুন' : 'Use a file under 5MB', variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
      setDiagnosis(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    try {
      const base64 = imagePreview.split(',')[1];
      const { data, error } = await supabase.functions.invoke('crop-disease-scan', {
        body: { imageBase64: base64, lang }
      });
      if (error) throw error;
      setDiagnosis(data);
    } catch (err: any) {
      toast({ title: lang === 'bn' ? 'বিশ্লেষণ ব্যর্থ' : 'Analysis failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const severityColor = (s: string) => {
    if (s === 'high') return 'destructive';
    if (s === 'medium') return 'secondary';
    return 'default';
  };

  return (
    <div className="p-4 space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Bug className="w-7 h-7 text-primary" />
          {t('scanner.title')}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{t('scanner.subtitle')}</p>
      </motion.div>

      {/* Upload Area */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageSelect} />
          
          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-primary/30 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/60 transition-colors bg-primary/5"
            >
              <Camera className="w-12 h-12 text-primary" />
              <p className="text-foreground font-semibold text-center">{t('scanner.upload')}</p>
              <p className="text-muted-foreground text-xs text-center">{t('scanner.uploadHint')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <img src={imagePreview} alt="Crop" className="w-full h-48 object-cover rounded-lg" />
              <div className="flex gap-2">
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1">
                  <Upload className="w-4 h-4 mr-1" /> {t('scanner.change')}
                </Button>
                <Button onClick={analyzeImage} disabled={isAnalyzing} className="flex-1 gradient-earth text-primary-foreground">
                  {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Bug className="w-4 h-4 mr-1" />}
                  {isAnalyzing ? t('scanner.analyzing') : t('scanner.analyze')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <AnimatePresence>
        {diagnosis && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <Card className="shadow-card border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{lang === 'bn' ? diagnosis.disease_name_bn : diagnosis.disease_name}</span>
                  <Badge variant={severityColor(diagnosis.severity)}>
                    {diagnosis.severity === 'high' ? t('common.high') : diagnosis.severity === 'medium' ? t('common.medium') : t('common.low')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{t('scanner.confidence')}:</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="h-2 rounded-full gradient-earth" style={{ width: `${diagnosis.confidence}%` }} />
                  </div>
                  <span className="font-semibold text-primary">{diagnosis.confidence}%</span>
                </div>
                <p className="text-sm text-foreground">{lang === 'bn' ? diagnosis.description_bn : diagnosis.description}</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  {t('scanner.treatment')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(lang === 'bn' ? diagnosis.treatment_bn : diagnosis.treatment)?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full gradient-earth text-primary-foreground flex items-center justify-center text-xs shrink-0 mt-0.5">{i + 1}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-secondary" />
                  {t('scanner.prevention')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(lang === 'bn' ? diagnosis.prevention_bn : diagnosis.prevention)?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiseaseScanner;
