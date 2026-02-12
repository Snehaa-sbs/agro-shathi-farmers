import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CloudSun, Cpu, Sprout, Settings } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useI18n();
  const location = useLocation();

  const tabs = [
    { path: '/', icon: Home, label: 'nav.dashboard' },
    { path: '/weather', icon: CloudSun, label: 'nav.weather' },
    { path: '/sensors', icon: Cpu, label: 'nav.sensors' },
    { path: '/crops', icon: Sprout, label: 'nav.crops' },
    { path: '/settings', icon: Settings, label: 'nav.settings' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background max-w-md mx-auto relative">
      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border z-50">
        <div className="flex items-center justify-around py-2 px-1">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="flex flex-col items-center gap-0.5 px-2 py-1 relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full gradient-earth"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.icon
                  className={`w-6 h-6 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                />
                <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {t(tab.label)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
