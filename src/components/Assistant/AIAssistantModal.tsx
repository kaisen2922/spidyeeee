import React, { useState, useRef, useEffect } from 'react';
import { useHeroStore } from '../../store/useHeroStore';
import { Send, X, Sparkles, User } from 'lucide-react';

export const AIAssistantModal: React.FC = () => {
  const { isAssistantOpen, setIsAssistantOpen, chatMessages, sendChatMessage } = useHeroStore();
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedPrompts = [
    'Where is Spider-Man?',
    'What is his current altitude?',
    'What is the current mission?',
    'How many active crimes?',
    'When will Spider-Man arrive?',
    'Show nearest hospital.'
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!isAssistantOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendChatMessage(input.trim());
    setInput('');
  };

  const handlePromptClick = (promptText: string) => {
    sendChatMessage(promptText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-slate-950 border-2 border-rose-500/70 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col h-[520px] font-cyber">
        
        {/* Header */}
        <div className="bg-slate-900 px-4 py-3 border-b border-rose-500/40 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-600 border border-white flex items-center justify-center text-white shadow-[0_0_10px_#f43f5e]">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white animate-pulse">
                <path d="M12 2C9.5 2 7.5 4 7.5 6.5C7.5 8.5 9 10 11 10.5V13.5C9 13 7.5 11.5 7.5 9.5H5.5C5.5 12.5 7.5 15 10 15.8V22H14V15.8C16.5 15 18.5 12.5 18.5 9.5H16.5C16.5 11.5 15 13 13 13.5V10.5C15 10 16.5 8.5 16.5 6.5C16.5 4 14.5 2 12 2Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-rose-300 text-sm">SPIDER-NET AI ASSISTANT</h3>
              <span className="text-[10px] text-emerald-400 font-tech">ONLINE | NYC SCANNER LINK</span>
            </div>
          </div>
          <button
            onClick={() => setIsAssistantOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/90">
          {chatMessages.map((msg) => {
            const isAI = msg.sender === 'SPIDER_NET_AI';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 ${isAI ? '' : 'flex-row-reverse space-x-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    isAI ? 'bg-rose-950 border border-rose-400 text-rose-300' : 'bg-amber-950 border border-amber-400 text-amber-300'
                  }`}
                >
                  {isAI ? (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-rose-300">
                      <path d="M12 2C9.5 2 7.5 4 7.5 6.5C7.5 8.5 9 10 11 10.5V13.5C9 13 7.5 11.5 7.5 9.5H5.5C5.5 12.5 7.5 15 10 15.8V22H14V15.8C16.5 15 18.5 12.5 18.5 9.5H16.5C16.5 11.5 15 13 13 13.5V10.5C15 10 16.5 8.5 16.5 6.5C16.5 4 14.5 2 12 2Z" />
                    </svg>
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-2.5 rounded-xl text-xs leading-relaxed ${
                    isAI
                      ? 'bg-slate-900 border border-rose-500/30 text-cyan-100 rounded-tl-none'
                      : 'bg-amber-500 text-amber-950 font-bold rounded-tr-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[9px] block mt-1 ${isAI ? 'text-slate-500 font-tech' : 'text-amber-900 font-tech'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(p)}
              className="bg-slate-950 hover:bg-rose-950 border border-slate-700 hover:border-rose-500 text-[10px] text-rose-300 px-2 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border-t border-rose-500/30 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask SPIDER-NET AI tactical questions..."
            className="flex-1 bg-slate-950 border border-rose-500/40 rounded-lg px-3 py-2 text-xs text-rose-100 placeholder-slate-500 focus:outline-none focus:border-rose-400 font-cyber"
          />
          <button
            type="submit"
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
