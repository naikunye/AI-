import React from 'react';
import { HistoryItem } from '../types';
import { Clock } from 'lucide-react';
import { PLATFORM_CONFIG } from '../constants';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  currentId?: string;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onClear, currentId }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center mt-6 opacity-50">
        <div className="bg-slate-800 p-3 rounded-full mb-3 text-slate-500 border border-slate-700">
          <Clock className="w-5 h-5" />
        </div>
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">No Data Logs</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end px-4 py-2">
        <button 
          onClick={onClear}
          className="text-[10px] text-slate-600 hover:text-red-400 px-2 py-1 transition-colors font-mono uppercase tracking-wider"
        >
          Clear Logs
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 space-y-2 pb-4">
        {history.map((item) => {
          const PlatformIcon = PLATFORM_CONFIG[item.platform].icon;
          const isActive = currentId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 group relative border ${
                isActive 
                  ? 'bg-brand-500/10 border-brand-500/30 shadow-[0_0_10px_rgba(45,212,191,0.1)]' 
                  : 'bg-transparent border-transparent hover:bg-white/5 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border ${
                  isActive ? 'bg-brand-500/20 text-brand-300 border-brand-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}>
                  <PlatformIcon className="w-3 h-3" />
                  {PLATFORM_CONFIG[item.platform].label.split(' ')[0]}
                </span>
                <span className="text-[10px] opacity-40 font-mono text-slate-400">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <p className={`text-xs line-clamp-2 leading-relaxed ${isActive ? 'text-slate-200 font-medium' : 'text-slate-500 group-hover:text-slate-400'}`}>
                {item.originalReview}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};