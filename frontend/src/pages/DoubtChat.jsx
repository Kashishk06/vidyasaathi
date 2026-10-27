import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';
import { VoiceButton } from '../components/VoiceButton';
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  BookOpen,
  Bot,
  User,
  HelpCircle,
  Lightbulb,
  AlertCircle
} from 'lucide-react';

export const DoubtChat = () => {
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content:
        language === 'hi'
          ? 'नमस्ते! मैं आपका विद्यासाथी AI ट्यूटर हूँ। आप गणित या विज्ञान की किताब से कोई भी सवाल पूछ सकते हैं या बोल सकते हैं।'
          : 'Hello! I am your VidyaSaathi AI tutor. Feel free to ask or speak any question from your Math or Science textbook.',
      sourceChapter: 'NCERT Class 8 Curriculum',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micNotice, setMicNotice] = useState('');
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle incoming search param queries
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setInputMsg(q);
      handleSend(q);
    }
  }, [searchParams]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputMsg;
    if (!textToSend.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMsg('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: textToSend.trim(),
        language: language,
      });

      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.data.reply,
        sourceChapter: res.data.source_chapter,
        audioText: res.data.audio_text,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorReply = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'माफ़ कीजिये, अभी संपर्क में समस्या है। कृपया पुनः प्रयास करें।',
        sourceChapter: 'System Notice',
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  // Web Speech API: Speech-to-Text with edit-before-send (Feature 6)
  const handleMicToggle = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicNotice('इस ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है। कृपया लिखकर प्रश्न पूछें। (Speech recognition not supported in this browser)');
      setTimeout(() => setMicNotice(''), 4500);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    const langMap = {
      hi: 'hi-IN',
      en: 'en-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      ta: 'ta-IN',
    };
    recognition.lang = langMap[language] || 'hi-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setMicNotice('सुन रहे हैं... कृपया अपना सवाल बोलें (Listening... please speak your question)');
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      setMicNotice('माइक्रोफ़ोन एक्सेस अस्वीकृत या अनुपलब्ध है। कृपया नीचे लिखकर पूछें। (Mic access denied or unavailable)');
      setTimeout(() => setMicNotice(''), 5000);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMsg(transcript);
      setMicNotice('आवाज़ पहचानी गई! आप भेजने से पहले इसे संपादित कर सकते हैं। (Voice captured - review or edit before sending)');
      setTimeout(() => setMicNotice(''), 4000);
    };

    recognition.start();
  };

  const samplePrompts = [
    { label: "ट्रैक्टर के पहिये चौड़े क्यों होते हैं?", query: "Why are tractor tires wide in muddy fields?" },
    { label: "स्टोमेटा (रंध्र) क्या काम करते हैं?", query: "What is stomata and what is its role in photosynthesis?" },
    { label: "1/2 और 1/4 को कैसे जोड़ते हैं?", query: "How to add fractions 1/2 and 1/4?" },
    { label: "प्रतिशत (Percentage) कैसे निकालते हैं?", query: "How to calculate percentage with a simple example?" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-xs flex items-center justify-between shrink-0 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              विद्यासाथी समाधान कक्ष (Doubt Assistant)
            </h2>
            <p className="text-xs text-slate-500">
              NCERT पाठ्यक्रम आधारित सुरक्षित और प्रामाणिक उत्तर
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 hidden sm:inline">
          Active Curriculum Guardrails
        </span>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 overflow-y-auto space-y-4 shadow-inner">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 sm:gap-3 ${
                isUser ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                  isUser
                    ? 'bg-orange-600 text-white'
                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 space-y-2 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>

                {!isUser && (
                  <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {m.sourceChapter && (
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-orange-600" />
                        {m.sourceChapter}
                      </span>
                    )}
                    <VoiceButton text={m.content} />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-none p-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-600 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-orange-600 animate-bounce delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-orange-600 animate-bounce delay-200"></div>
              <span className="text-xs text-slate-500 font-medium">पाठ्यक्रम से उत्तर खोज रहे हैं...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p.query)}
            className="px-3 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-900 text-xs font-semibold whitespace-nowrap border border-orange-200 transition-colors shrink-0"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Voice Status / Feedback Notice (Feature 6) */}
      {micNotice && (
        <div className="p-2.5 px-3.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 text-xs font-semibold flex items-center gap-2 animate-fade-in shrink-0">
          <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
          <span>{micNotice}</span>
        </div>
      )}

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 shrink-0 pt-1"
      >
        <button
          type="button"
          onClick={handleMicToggle}
          className={`p-3 rounded-2xl border transition-all btn-tactile ${
            isListening
              ? 'bg-red-600 text-white border-red-700 animate-pulse'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title={isListening ? t('listening') : t('micAsk')}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-orange-600" />}
        </button>

        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder={isListening ? t('listening') : t('typeQuestion')}
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
        />

        <button
          type="submit"
          disabled={!inputMsg.trim() || loading}
          className="p-3 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold shadow-md shadow-orange-500/20 btn-tactile transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
