
import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export const ProcessingTerminal: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("正在初始化神经核心...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    const timeouts = [
      setTimeout(() => setStatus("正在分析情感向量..."), 800),
      setTimeout(() => setStatus("检查平台合规协议..."), 1800),
      setTimeout(() => setStatus("优化语气与语调..."), 2800),
      setTimeout(() => setStatus("最终内容生成中..."), 3800),
    ];

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* Central Orb */}
      <div className="relative mb-16">
        {/* Outer Glow Rings */}
        <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-3xl animate-pulse"></div>
        <div className="w-40 h-40 rounded-full border border-white/10 flex items-center justify-center relative">
           <div className="absolute inset-0 rounded-full border-t-2 border-fuchsia-500 animate-spin" style={{ animationDuration: '2s' }}></div>
           <div className="absolute inset-4 rounded-full border-b-2 border-cyan-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
           <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-sm"></div>
           
           <Sparkles className="w-12 h-12 text-white animate-pulse relative z-10" />
        </div>
      </div>

      {/* Progress & Text */}
      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <h3 className="text-lg font-bold text-white tracking-widest uppercase animate-pulse">{status}</h3>
        
        {/* Modern Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
           <div 
             className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transition-all duration-100 ease-out shadow-[0_0_10px_rgba(236,72,153,0.5)]"
             style={{ width: `${progress}%` }}
           ></div>
        </div>
        
        <div className="text-xs font-mono text-slate-500">{progress}% 完成</div>
      </div>
    </div>
  );
};