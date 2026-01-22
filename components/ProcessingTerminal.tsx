import React, { useEffect, useState, useRef } from 'react';
import { Terminal, Cpu, ShieldCheck, Globe, Sparkles, Database, Wifi } from 'lucide-react';

export const ProcessingTerminal: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const steps = [
    { text: "INITIALIZING NEURAL LINK...", delay: 200 },
    { text: "ESTABLISHING SECURE CONNECTION [PORT 443]...", delay: 600 },
    { text: "ANALYZING SENTIMENT VECTOR...", delay: 1200 },
    { text: "DETECTING LANGUAGE PATTERNS...", delay: 1600 },
    { text: "LOADING COMPLIANCE PROTOCOLS [AMAZON/TIKTOK]...", delay: 2200 },
    { text: "SCANNING FOR RISK FACTORS...", delay: 2800 },
    { text: "OPTIMIZING RESPONSE TONE...", delay: 3400 },
    { text: "GENERATING STRATEGIC OPTIONS...", delay: 4000 },
    { text: "FINALIZING OUTPUT BUFFER...", delay: 4800 },
  ];

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    
    steps.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setLogs(prev => [...prev, `> ${step.text}`]);
      }, step.delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* Central Visual */}
      <div className="relative mb-12">
        <div className="w-32 h-32 rounded-full border border-brand-500/30 flex items-center justify-center relative">
           <div className="absolute inset-0 rounded-full border-t-2 border-brand-500 animate-spin"></div>
           <div className="absolute inset-2 rounded-full border-b-2 border-accent-purple/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
           <Cpu className="w-12 h-12 text-brand-400 animate-pulse" />
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
           <span className="text-xs font-mono text-brand-500 tracking-[0.2em] animate-blink">PROCESSING DATA</span>
        </div>
      </div>

      {/* Terminal Window */}
      <div className="w-full max-w-lg glass-panel rounded-xl border border-brand-500/20 overflow-hidden flex flex-col shadow-neon">
        <div className="bg-black/40 px-4 py-2 border-b border-brand-500/20 flex items-center gap-2">
           <Terminal className="w-3 h-3 text-brand-500" />
           <span className="text-[10px] font-mono text-brand-500/70">SYS.LOG.TRACE</span>
        </div>
        <div 
          ref={scrollRef}
          className="h-48 p-4 font-mono text-xs text-brand-300 space-y-2 overflow-y-auto scrollbar-none"
        >
           {logs.map((log, i) => (
             <div key={i} className="animate-fade-in opacity-80 border-l-2 border-transparent hover:border-brand-500 pl-2 transition-colors">
               <span className="text-brand-500/50 mr-2">{(Date.now() + i * 153).toString().slice(-6)}</span>
               {log}
             </div>
           ))}
           <div className="animate-blink w-2 h-4 bg-brand-500 inline-block align-middle ml-1"></div>
        </div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
    </div>
  );
};