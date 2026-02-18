import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import VoiceAssistant from "@/components/VoiceAssistant";
import LanguageSelector from "@/components/LanguageSelector";
import Index from "./pages/Index";
import Weather from "./pages/Weather";
import Sensors from "./pages/Sensors";
import Crops from "./pages/Crops";
import Irrigation from "./pages/Irrigation";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import Chatbot from "./pages/Chatbot";
import HarvestCalendar from "./pages/HarvestCalendar";
import DiseaseScanner from "./pages/DiseaseScanner";
import MarketPrices from "./pages/MarketPrices";
import SoilHealth from "./pages/SoilHealth";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/sign-in" replace />;
  return <>{children}</>;
};

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  const { isFirstLaunch } = useI18n();

  if (isFirstLaunch) {
    return <LanguageSelector />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes (no layout) */}
        <Route path="/sign-up" element={<AuthRoute><SignUp /></AuthRoute>} />
        <Route path="/sign-in" element={<AuthRoute><SignIn /></AuthRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes (with layout) */}
        <Route path="/" element={<ProtectedRoute><Layout><Index /></Layout></ProtectedRoute>} />
        <Route path="/weather" element={<ProtectedRoute><Layout><Weather /></Layout></ProtectedRoute>} />
        <Route path="/sensors" element={<ProtectedRoute><Layout><Sensors /></Layout></ProtectedRoute>} />
        <Route path="/crops" element={<ProtectedRoute><Layout><Crops /></Layout></ProtectedRoute>} />
        <Route path="/irrigation" element={<ProtectedRoute><Layout><Irrigation /></Layout></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><Layout><Alerts /></Layout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><Layout><Chatbot /></Layout></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><Layout><HarvestCalendar /></Layout></ProtectedRoute>} />
        <Route path="/disease-scanner" element={<ProtectedRoute><Layout><DiseaseScanner /></Layout></ProtectedRoute>} />
        <Route path="/market-prices" element={<ProtectedRoute><Layout><MarketPrices /></Layout></ProtectedRoute>} />
        <Route path="/soil-health" element={<ProtectedRoute><Layout><SoilHealth /></Layout></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <VoiceAssistant />
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
