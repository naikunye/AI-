import React, { useState } from 'react';
import { GeneratedReplyOption, ReplyType } from '../types';
import { Copy, Check, Lock, Globe, Sparkles, Bookmark, BookmarkCheck, Languages, Terminal } from 'lucide-react';
import { REPLY_TYPE_LABELS } from '../constants';

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
    <div className="group relative flex flex-col h-full bg-[#111827]/80 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-lg hover:shadow-glow-blue hover:border-brand-500/50 transition-all duration-300 overflow-hidden">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-700/50 flex justify-between items-start bg-slate-800/30">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
              isPrivate 
                ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' 
                : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
            }`}>
              {isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
              {REPLY_TYPE_LABELS[option.type]}
            </span>
          </div>
          <h4 className="font-bold text-slate-100 text-base leading-tight tracking-wide">
            {option.headline}
          </h4>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveClick}
            className={`p-2 rounded-lg transition-all ${
              saved 
                ? 'text-yellow-400 bg-yellow-400/10' 
                : 'text-slate-500 hover:text-yellow-400 hover:bg-slate-700'
            }`}
          >
            {saved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col gap-5">
        
        {/* Chinese Translation - Secondary */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <Languages className="w-3 h-3" />
            <span>Translation (Reference)</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
            {option.bodyChinese}
          </p>
        </div>

        {/* English Original - Terminal Style */}
        <div className="flex flex-col gap-2 mt-1 flex-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3" />
              <span>Output Source</span>
            </div>
          </div>
          <div className="relative group/code flex-1 bg-[#050505] rounded-xl border border-slate-800 shadow-inner">
             {/* Terminal Header Decor */}
             <div className="flex gap-1.5 p-3 border-b border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
             </div>
             
             <textarea 
                readOnly
                className="w-full h-[calc(100%-40px)] bg-transparent text-emerald-400 p-4 rounded-b-xl text-sm font-mono leading-relaxed resize-none focus:outline-none scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
                value={option.bodyEnglish}
             />
             
             <button
                onClick={handleCopy}
                className={`absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${
                  copied 
                    ? 'bg-emerald-500 text-white border-emerald-500' 
                    : 'bg-slate-800 text-slate-300 border-slate-600 hover:border-brand-400 hover:text-brand-400'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'COPIED' : 'COPY'}
              </button>
          </div>
        </div>
        
        {/* Footer / Analysis */}
        <div className="pt-3 border-t border-slate-700/50">
           <p className="text-xs text-slate-500 leading-relaxed">
             <span className="font-bold text-brand-500 mr-1 font-mono text-[10px] uppercase">AI Reasoning //</span> 
             {option.toneAnalysis}
           </p>
        </div>
      </div>
    </div>
  );
};