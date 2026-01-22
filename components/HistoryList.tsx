import React from 'react';
import { HistoryItem } from '../types';
import { Clock, ChevronRight } from 'lucide-react';
import { PLATFORM_CONFIG } from '../constants';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  currentId?: string;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {history.slice(0, 4).map((item) => {
          const PlatformIcon = PLATFORM_CONFIG[item.platform].icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-brand-500/30 transition-all group text-left"
            >
              <div className="w-8 h-8 rounded-md bg-black/40 flex items-center justify-center text-gray-400 group-hover:text-brand-400 transition-colors">
                <PlatformIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{item.platform}</span>
                    <span className="text-[9px] font-mono text-gray-600">{new Date(item.timestamp).toLocaleTimeString()}</span>
                 </div>
                 <p className="text-xs text-gray-300 truncate">{item.originalReview}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
            </button>
          );
      })}
      {history.length > 0 && (
          <button onClick={onClear} className="col-span-full mt-2 text-[10px] text-gray-600 hover:text-red-400 uppercase tracking-widest text-center py-2">
             CLEAR HISTORY LOGS
          </button>
      )}
    </div>
  );
};