import React, { useState, useEffect } from 'react';
import { GeneratedReplyOption, ReplyType } from '../types';
import { Copy, Check, Lock, Globe, Bookmark, BookmarkCheck, Terminal, Sparkles, MessageSquare } from 'lucide-react';
import { REPLY_TYPE_LABELS } from '../constants';

interface ReplyCardProps {
  option: GeneratedReplyOption;
  index: number;
  onSave: (option: GeneratedReplyOption) => void;
}

export const ReplyCard: React.FC<ReplyCardProps> = ({ option, index, onSave }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Typing effect state
  const [displayedText, setDisplayedText] = useState('');
  const fullText = option.bodyEnglish;

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const speed = 10; // Typing speed in ms
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText((prev) => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [fullText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(option.bodyEnglish);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveClick = () => {
    onSave(option);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isPrivate = option.type === ReplyType.PRIVATE;

  return (
    <div className="group relative flex flex-col h-full glass-panel rounded-xl overflow-hidden transition-all duration-300 hover:shadow-neon hover:border-brand-500/30 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
      
      {/* Decorative Top Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50"></div>

      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex justify-between items-start bg-black/20">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 border uppercase tracking-widest ${
              isPrivate 
                ? 'bg-accent-purple/10 text-accent-purple border-accent-purple/30' 
                : 'bg-brand-500/10 text-brand-400 border-brand-500/30'
            }`}>
              {isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
              {isPrivate ? 'PRIVATE' : 'PUBLIC'}
            </span>
            <span className="text-[10px] text-gray-500 font-mono">OPT-{index + 1}</span>
          </div>
          <h4 className="font-bold text-white text-base tracking-tight text-shadow-sm">
            {option.headline}
          </h4>
        </div>
        
        <button
          onClick={handleSaveClick}
          className={`p-2 rounded-lg transition-all border ${
            saved 
              ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' 
              : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5'
          }`}
        >
          {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>
      
      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        
        {/* Chinese Reference */}
        <div className="relative pl-3 border-l-2 border-white/10">
            <p className="text-gray-400 text-xs leading-relaxed font-sans">
              {option.bodyChinese}
            </p>
        </div>

        {/* English Output (Terminal Style) */}
        <div className="flex-1 bg-black/40 rounded-lg border border-white/5 p-4 relative group/code mt-2">
          <div className="absolute top-2 right-3 flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/40"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500/40"></div>
            <div className="w-2 h-2 rounded-full bg-green-500/40"></div>
          </div>
          
          <div className="font-mono text-sm leading-relaxed text-brand-50 mt-4 min-h-[100px] whitespace-pre-wrap">
             {displayedText}
             <span className="inline-block w-2 h-4 bg-brand-500 ml-1 animate-pulse align-middle"></span>
          </div>

          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
            <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-bold transition-all border backdrop-blur-md ${
                  copied 
                    ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                    : 'bg-white/10 text-white border-white/20 hover:bg-brand-500/20 hover:border-brand-500/50'
                }`}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'COPIED' : 'COPY'}
            </button>
          </div>
        </div>
        
        {/* Analysis Footer */}
        <div className="pt-3 border-t border-white/5 flex items-start gap-2">
           <Sparkles className="w-3 h-3 text-brand-500 mt-0.5" />
           <p className="text-[10px] text-gray-500 leading-relaxed font-mono">
             <span className="text-brand-500">AI_ANALYSIS:</span> {option.toneAnalysis}
           </p>
        </div>
      </div>
    </div>
  );
};