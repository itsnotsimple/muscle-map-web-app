import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import { MessageCircle, X, Send, Loader2, Bot, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t('chatbot.greeting') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Fetch initial limit status on mount or login
  useEffect(() => {
    if (user && !user.isPremium && remaining === null) {
      const fetchStatus = async () => {
        try {
          const res = await ApiService.getChatStatus(user.token);
          if (res.ok) {
            const data = await res.json();
            if (typeof data.remainingMessages === 'number') {
              setRemaining(data.remainingMessages);
            }
          }
        } catch (e) {
          console.error("Failed to fetch chat status", e);
        }
      };
      fetchStatus();
    }
  }, [user, remaining]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const historyPayload = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await ApiService.chat(user.token, userMessage, historyPayload);
      const data = await response.json();
      
      if (response.status === 403 && data.error === "LIMIT_REACHED") {
        setShowLimitModal(true);
        // Remove the user's message from the UI since it wasn't processed
        setMessages(messages);
        return;
      }

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error(data.message || data.error || 'Your session has expired. Please log out and log back in.');
        }
        throw new Error(data.error || 'Failed to chat');
      }

      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      if (data.remainingMessages !== undefined && data.remainingMessages !== null) {
        setRemaining(data.remainingMessages);
      }
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'assistant', content: error instanceof Error ? error.message : 'There was an error reaching the coaching servers. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 font-sans">
        {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-120px)] bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 pointer-events-auto">
          {/* Header */}
          <div className="bg-blue-600 dark:bg-blue-700 text-white p-4 flex items-center justify-between shadow-sm relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-1.5 rounded-full relative">
                <Bot size={20} className="text-white" />
                {user?.isPremium && (
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-900 rounded-full p-0.5 shadow-sm" title="PRO">
                    <Crown size={10} strokeWidth={3} />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">{t('chatbot.title')}</h3>
                <span className="text-[10px] uppercase font-semibold text-blue-200 tracking-wider">
                  {user?.isPremium && <span className="text-yellow-300 font-black mr-1">PRO</span>}
                  {t('chatbot.subtitle')}
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                }`}>
                  {/* 2. Използваме ReactMarkdown тук */}
                  <div className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                  <ReactMarkdown 
                    components={{
                      // Премахваме {node}, оставяме само {...props}
                      strong: ({ ...props }) => <strong className="font-extrabold text-blue-600 dark:text-blue-400" {...props} />,
                      ul: ({ ...props }) => <ul className="list-disc ml-4 my-2 space-y-1" {...props} />,
                      p: ({ ...props }) => <p className="m-0 inline" {...props} />,
                    }}
                  >
                    {msg.content || ''}
                  </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 p-3.5 rounded-2xl rounded-bl-none flex items-center gap-3 text-sm shadow-sm border border-slate-200 dark:border-slate-700">
                  <Loader2 size={16} className="animate-spin text-blue-500" />
                   <span className="font-medium animate-pulse">{t('chatbot.consulting')}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input - Запазваме си твоята логика */}
          {!user ? (
            <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center relative z-10 rounded-b-3xl">
              <p className="text-xs font-semibold text-slate-500 mb-3 tracking-wide uppercase">{t('chatbot.loginPrompt')}</p>
               <Link to="/login" onClick={() => setIsOpen(false)} className="flex justify-center items-center w-full py-3 bg-[#274690] text-white text-sm font-bold rounded-full hover:bg-[#1f3770] transition-colors shadow-md">
                {t('chatbot.signInBtn')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative z-10 rounded-b-3xl">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    user?.isPremium ? t('chatbot.placeholderPremium', 'Ask your PRO AI Coach anything...') 
                    : (remaining !== null ? `${t('chatbot.placeholder')} (${remaining} left)` : t('chatbot.placeholder', 'Ask about fitness or diet...'))
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-full pl-5 pr-14 py-3.5 focus:outline-none focus:ring-0 transition-all text-sm border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-600 font-medium placeholder-slate-400"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <Send size={16} className="relative left-[1px]" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 active:scale-95 z-50 pointer-events-auto ${
          isOpen ? 'bg-slate-800 dark:bg-slate-700 text-white rotate-90 scale-90' : 'bg-blue-600 dark:bg-blue-500 text-white ring-4 ring-blue-600/20'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>

    {/* LIMIT MODAL OVERLAY */}
    {showLimitModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative border border-slate-200 dark:border-slate-800 text-center animate-in fade-in zoom-in duration-300">
             <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-4 border border-blue-200 dark:border-blue-700/50">
               <Bot size={28} />
             </div>
             <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{t('chat.limitTitle', 'Daily Limit Reached')}</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
               {t('chat.limitDesc', 'Free members are limited to 5 AI messages per day. Upgrade to Premium for unlimited contextual AI coaching.')}
             </p>
             <div className="flex flex-col gap-3">
               <Link 
                  to="/premium"
                  onClick={() => setShowLimitModal(false)}
                  className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 rounded-xl font-bold shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all flex items-center justify-center gap-2"
               >
                  💎 {t('premium.title')} Premium
               </Link>
               <button 
                 onClick={() => setShowLimitModal(false)}
                 className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all"
               >
                 {t('profile.cancel', 'Maybe Later')}
               </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;