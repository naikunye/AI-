
import React, { useState } from 'react';
import { GeneratedReplyOption, ReplyType } from '../types';
import { Copy, Check, Lock, Globe, Bookmark, BookmarkCheck, Wand2 } from 'lucide-react';

interface ReplyCardProps {
  option: GeneratedReplyOption;
  index: number;
  onSave: (option: GeneratedReplyOption) => void;
}

export const ReplyCard: React.FC<ReplyCardProps> = ({ option, index, onSave }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

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
    <div 
      className="flex flex-col h-full glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 group animate-fade-in relative" 
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Subtle colorful glow on hover */}
      <div className="absolute -inset-px bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5 flex justify-between items-start bg-white/[0.02]">
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider border ${
               isPrivate ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
            }`}>
              {isPrivate ? <Lock size={10} /> : <Globe size={10} />}
              {isPrivate ? '私信/邮件' : '公开回复'}
            </span>
          </div>
          <h4 className="font-bold text-white text-base tracking-tight leading-snug">
            {option.headline}
          </h4>
        </div>
        
        <button
          onClick={handleSaveClick}
          className={`relative z-10 p-2 rounded-lg transition-all ${
            saved 
              ? 'text-yellow-400 bg-yellow-400/10' 
              : 'text-slate-500 hover:text-white hover:bg-white/10'
          }`}
          title="保存至话术库"
        >
          {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Body */}
      <div className="p-6 flex-1 flex flex-col gap-6 relative z-10">
        
        {/* Context */}
        <div className="pl-3 border-l-2 border-slate-700/50">
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              {option.bodyChinese}
            </p>
        </div>

        {/* Output Block */}
        <div className="flex-1 bg-[#050911] rounded-xl border border-white/5 p-4 relative group/code shadow-inner">
          <div className="font-mono text-sm leading-relaxed text-slate-200 whitespace-pre-wrap select-text">
             {option.bodyEnglish}
          </div>

          <div className="absolute top-3 right-3 opacity-0 group-hover/code:opacity-100 transition-opacity">
            <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  copied 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                    : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/20 hover:text-white'
                }`}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? '已复制' : '复制'}
            </button>
          </div>
        </div>
        
        {/* Logic Footer */}
        <div className="pt-4 border-t border-white/5 flex items-start gap-2.5">
           <div className="mt-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
             <Wand2 className="w-2.5 h-2.5 text-white" />
           </div>
           <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
             {option.toneAnalysis}
           </p>
        </div>
      </div>
    </div>
  );
};