
import React from 'react';
import { HistoryItem } from '../types';
import { ChevronRight, Clock } from 'lucide-react';
import { PLATFORM_CONFIG } from '../constants';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {history.slice(0, 6).map((item) => {
          const PlatformIcon = PLATFORM_CONFIG[item.platform].icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 hover:shadow-lg transition-all group text-left relative overflow-hidden"
            >
              {/* Left Accent Bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                <PlatformIcon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-fuchsia-400 transition-colors">{item.platform}</span>
                    <span className="text-[10px] font-mono text-slate-600 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                 </div>
                 <p className="text-xs text-slate-300 truncate font-medium opacity-80 group-hover:opacity-100 transition-opacity">{item.originalReview}</p>
              </div>
              
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
          );
      })}
    </div>
  );
};