import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider, useI18n } from "@/lib/i18n";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isFirstLaunch } = useI18n();

  if (isFirstLaunch) {
    return <LanguageSelector />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/sensors" element={<Sensors />} />
          <Route path="/crops" element={<Crops />} />
          <Route path="/irrigation" element={<Irrigation />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/calendar" element={<HarvestCalendar />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <VoiceAssistant />
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
