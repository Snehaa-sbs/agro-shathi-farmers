import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { speakText } from '@/lib/speech';
import { motion } from 'framer-motion';
import { Send, Bot, User, Volume2 } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const getResponse = (query: string, lang: string): string => {
  const q = query.toLowerCase();
  if (lang === 'bn') {
    if (q.includes('আবহাওয়া') || q.includes('তাপমাত্রা')) return 'আজ তাপমাত্রা ৩২°সে এবং আর্দ্রতা ৭৮%। আংশিক মেঘলা। আগামীকাল বৃষ্টির সম্ভাবনা ৭০%।';
    if (q.includes('পানি') || q.includes('সেচ')) return 'আজ প্রতি শতাংশে ১৫ লিটার পানি দিতে হবে। সকাল ৬-৮টা সেচের সেরা সময়।';
    if (q.includes('রোগ')) return 'উচ্চ আর্দ্রতায় ব্লাস্ট রোগের ঝুঁকি মাঝারি। প্রতিরোধে ছত্রাকনাশক ট্রাইসাইক্লাজোল ব্যবহার করুন।';
    if (q.includes('সার')) return 'ধানের ফুল আসার পর্যায়ে। প্রতি শতাংশে ২ কেজি ইউরিয়া এবং ১ কেজি পটাশ দিন।';
    if (q.includes('বাজার') || q.includes('দাম')) return 'ধান: ৩২ টাকা/কেজি, গম: ৩৮ টাকা/কেজি, সবজি: ২৫-৫০ টাকা/কেজি।';
    if (q.includes('ফসল') || q.includes('কাটা')) return 'আপনার ধান আনুমানিক ৪৫ দিনের মধ্যে কাটার উপযুক্ত হবে।';
    return 'আপনার প্রশ্নের জন্য ধন্যবাদ! আবহাওয়া, সেচ, রোগ, সার বা বাজার দর সম্পর্কে জিজ্ঞাসা করুন। 🌾';
  }
  if (q.includes('weather') || q.includes('temp')) return 'Today\'s temperature is 32°C with 78% humidity. Partly cloudy. 70% rain chance tomorrow.';
  if (q.includes('water') || q.includes('irrigat')) return 'Irrigate 15 liters per decimal today. Best time: 6-8 AM morning.';
  if (q.includes('disease')) return 'Medium blast disease risk due to high humidity. Use Tricyclazole fungicide for prevention.';
  if (q.includes('fertiliz')) return 'Rice is at flowering stage. Apply 2kg urea and 1kg potash per decimal.';
  if (q.includes('market') || q.includes('price')) return 'Rice: ৳32/kg, Wheat: ৳38/kg, Vegetables: ৳25-50/kg.';
  if (q.includes('harvest') || q.includes('crop')) return 'Your rice crop is estimated to be ready for harvest in approximately 45 days.';
  return 'Thank you for your question! Ask me about weather, irrigation, diseases, fertilizer, or market prices. 🌾';
};

const Chatbot: React.FC = () => {
  const { t, lang } = useI18n();
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: t('chatbot.welcome'), isBot: true },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    const response = getResponse(input, lang);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: response, isBot: true }]);
    }, 600);
  };

  const handleSpeak = (text: string) => {
    speakText(text, lang);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] px-4 pt-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-4">🤖 {t('chatbot.title')}</h1>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.isBot ? 'justify-start' : 'justify-end'}`}
          >
            {msg.isBot && (
              <div className="w-8 h-8 rounded-full gradient-earth flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            <div className={`max-w-[75%] p-3 rounded-2xl ${
              msg.isBot
                ? 'bg-card border border-border shadow-card'
                : 'gradient-earth text-primary-foreground'
            }`}>
              <p className={`text-sm font-medium ${msg.isBot ? 'text-foreground' : ''}`}>{msg.text}</p>
              {msg.isBot && (
                <button onClick={() => handleSpeak(msg.text)} className="mt-2">
                  <Volume2 className="w-4 h-4 text-primary" />
                </button>
              )}
            </div>
            {!msg.isBot && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 py-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t('chatbot.placeholder')}
          className="flex-1 px-4 py-3 rounded-2xl bg-card border border-border text-foreground text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleSend}
          className="w-12 h-12 rounded-2xl gradient-earth flex items-center justify-center shadow-button flex-shrink-0"
        >
          <Send className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
