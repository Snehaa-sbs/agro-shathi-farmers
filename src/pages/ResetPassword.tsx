import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setValid(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message, { duration: 5000 });
    } else {
      toast.success(t('auth.passwordUpdated'), { duration: 5000 });
      navigate('/');
    }
  };

  if (!valid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <p className="text-muted-foreground">Invalid or expired reset link.</p>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-foreground">{t('auth.resetPassword')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">{t('auth.newPassword')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">{t('auth.confirmPassword')}</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full shadow-button" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {t('auth.resetPassword')}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
