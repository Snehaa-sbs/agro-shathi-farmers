import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, RefreshCw, MapPin, Loader2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const regions = [
  { en: 'Dhaka', bn: 'ঢাকা' },
  { en: 'Chittagong', bn: 'চট্টগ্রাম' },
  { en: 'Rajshahi', bn: 'রাজশাহী' },
  { en: 'Khulna', bn: 'খুলনা' },
  { en: 'Sylhet', bn: 'সিলেট' },
  { en: 'Rangpur', bn: 'রংপুর' },
  { en: 'Barisal', bn: 'বরিশাল' },
  { en: 'Mymensingh', bn: 'ময়মনসিংহ' },
];

const MarketPrices = () => {
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const [region, setRegion] = useState('Dhaka');
  const [prices, setPrices] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPrices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('market-prices', {
        body: { lang, region }
      });
      if (error) throw error;
      setPrices(data);
    } catch (err: any) {
      toast({ title: lang === 'bn' ? 'দাম লোড ব্যর্থ' : 'Failed to load prices', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPrices(); }, [region]);

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-destructive" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-primary" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="p-4 space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">🏪 {t('market.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('market.subtitle')}</p>
      </motion.div>

      <div className="flex gap-2">
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="flex-1">
            <MapPin className="w-4 h-4 mr-1 text-primary" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {regions.map(r => (
              <SelectItem key={r.en} value={r.en}>{lang === 'bn' ? r.bn : r.en}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={fetchPrices} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : prices?.crops ? (
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <span>{lang === 'bn' ? prices.region_bn : prices.region}</span>
              <span className="text-xs text-muted-foreground font-normal">{prices.last_updated}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {prices.crops.map((crop: any, i: number) => (
                <motion.div
                  key={crop.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{lang === 'bn' ? crop.name_bn : crop.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">৳{crop.price_per_kg}/{lang === 'bn' ? 'কেজি' : 'kg'}</span>
                    <div className="flex items-center gap-1 min-w-[60px] justify-end">
                      <TrendIcon trend={crop.trend} />
                      <span className={`text-xs font-semibold ${crop.trend === 'up' ? 'text-destructive' : crop.trend === 'down' ? 'text-primary' : 'text-muted-foreground'}`}>
                        {crop.change_percent > 0 ? '+' : ''}{crop.change_percent}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default MarketPrices;
