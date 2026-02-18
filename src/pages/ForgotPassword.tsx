import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Sprout, ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message, { duration: 5000 });
    } else {
      setSent(true);
      toast.success(t('auth.resetEmailSent'), { duration: 5000 });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl gradient-earth flex items-center justify-center mx-auto shadow-button">
            <Sprout className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('auth.forgotPassword')}</h1>
          <p className="text-sm text-muted-foreground">{t('auth.forgotSubtitle')}</p>
        </div>

        {sent ? (
          <div className="text-center space-y-4 p-6 rounded-lg border border-border bg-card">
            <Mail className="w-12 h-12 text-primary mx-auto" />
            <p className="text-sm text-foreground">{t('auth.checkEmail')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full shadow-button" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('auth.sendResetLink')}
            </Button>
          </form>
        )}

        <Link to="/sign-in" className="flex items-center justify-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          {t('auth.backToSignIn')}
        </Link>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
