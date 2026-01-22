import React, { useState, useEffect } from 'react';
import { Platform, Tone, GenerationResult, ReviewContext, HistoryItem, Resolution, SavedTemplate, TemplateCategory, GeneratedReplyOption, ReplyLength, EmojiLevel, LanguageStyle, ProductCategory, ReviewClassification } from './types';
import { PLATFORM_CONFIG, TONE_CONFIG, RESOLUTION_CONFIG, CLASSIFICATION_CONFIG, LENGTH_CONFIG, EMOJI_CONFIG, STYLE_CONFIG, CATEGORY_CONFIG } from './constants';
import { generateReviewReply } from './services/geminiService';
import { HistoryList } from './components/HistoryList';
import { ReplyCard } from './components/ReplyCard';
import { TemplateLibrary } from './components/TemplateLibrary';
import { ProcessingTerminal } from './components/ProcessingTerminal';
import { DEFAULT_TEMPLATES } from './data/defaultTemplates';
import { 
  Sparkles, 
  Settings2, 
  AlertCircle, 
  Menu, 
  X,
  MessageCircle,
  ShieldCheck,
  LayoutDashboard,
  Library,
  Save,
  Zap,
  Cpu,
  RefreshCcw,
  Wand2,
  Package,
  Activity,
  AlertTriangle,
  ChevronRight,
  Terminal,
  Play,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';

// --- UI Components ---

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
    <Icon className="w-4 h-4 text-brand-500" />
    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</span>
  </div>
);

// Custom Segmented Control
const SegmentControl = <T extends string>({ options, value, onChange, label }: { options: { value: T, label: string, icon?: any }[], value: T, onChange: (v: T) => void, label?: string }) => (
  <div className="space-y-2">
    {label && <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</label>}
    <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
            value === opt.value 
              ? 'bg-white/10 text-white shadow-lg border border-white/10' 
              : 'text-gray-600 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          {opt.icon && React.createElement(opt.icon, { size: 14 })}
          <span className="hidden xl:inline">{opt.label}</span>
        </button>
      ))}
    </div>
  </div>
);

// --- Presets Data ---
const PRESETS = [
  { id: 'standard', label: '标准客服', icon: MessageCircle, config: { tone: Tone.PROFESSIONAL, length: ReplyLength.MEDIUM, emoji: EmojiLevel.MINIMAL } },
  { id: 'apology', label: '高危安抚', icon: ShieldCheck, config: { tone: Tone.EMPATHETIC, length: ReplyLength.LONG, emoji: EmojiLevel.NONE } },
  { id: 'tiktok', label: 'TikTok 活力', icon: Zap, config: { tone: Tone.WITTY, length: ReplyLength.SHORT, emoji: EmojiLevel.HEAVY } },
];

// --- Main App ---

const App: React.FC = () => {
  // Navigation
  const [currentView, setCurrentView] = useState<'generator' | 'library'>('generator');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Core Inputs
  const [reviewText, setReviewText] = useState('');
  
  // Strategy Controls
  const [platform, setPlatform] = useState<Platform>(Platform.AMAZON);
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [resolution, setResolution] = useState<Resolution>(Resolution.NONE);
  const [productCategory, setProductCategory] = useState<ProductCategory>(ProductCategory.GENERAL);
  
  // Advanced Controls
  const [replyLength, setReplyLength] = useState<ReplyLength>(ReplyLength.MEDIUM);
  const [emojiLevel, setEmojiLevel] = useState<EmojiLevel>(EmojiLevel.MINIMAL);
  const [languageStyle, setLanguageStyle] = useState<LanguageStyle>(LanguageStyle.NATIVE_US);
  const [context, setContext] = useState<ReviewContext>({});
  
  // System State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);

  // Modals
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<SavedTemplate>>({});
  const [tagsInput, setTagsInput] = useState('');

  // Initial Load
  useEffect(() => {
    try {
      const hist = localStorage.getItem('replyWiseHistory_v3');
      if (hist) setHistory(JSON.parse(hist));
      const tmpl = localStorage.getItem('replyWiseTemplates_v3');
      setSavedTemplates(tmpl ? JSON.parse(tmpl) : DEFAULT_TEMPLATES);
    } catch (e) { console.error(e); }
  }, []);

  // Save Effect
  useEffect(() => {
    localStorage.setItem('replyWiseHistory_v3', JSON.stringify(history));
    localStorage.setItem('replyWiseTemplates_v3', JSON.stringify(savedTemplates));
  }, [history, savedTemplates]);

  const handleGenerate = async () => {
    if (!reviewText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null); // Clear previous result to show terminal
    
    // Minimum 2s delay to show off the terminal animation
    const minDelay = new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      const finalContext = { ...context, category: productCategory };
      const [res] = await Promise.all([
        generateReviewReply(reviewText, platform, tone, resolution, finalContext, replyLength, emojiLevel, languageStyle),
        minDelay
      ]);
      
      setResult(res);
      setHistory(prev => [{ id: Date.now().toString(), timestamp: Date.now(), originalReview: reviewText, platform, result: res }, ...prev].slice(0, 50));
    } catch (e: any) {
      setError(e.message || "System Malfunction");
    } finally {
      setLoading(false);
    }
  };

  // --- Quick Actions ---
  const saveTemplate = () => {
    if (!editingTemplate.title) return;
    const newTmpl = { ...editingTemplate, tags: tagsInput.split(/[,，]/).map(t => t.trim()).filter(Boolean), id: editingTemplate.id || Date.now().toString(), createdAt: Date.now() } as SavedTemplate;
    setSavedTemplates(prev => editingTemplate.id ? prev.map(t => t.id === newTmpl.id ? newTmpl : t) : [newTmpl, ...prev]);
    setIsSaveModalOpen(false);
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (preset) {
      setTone(preset.config.tone);
      setReplyLength(preset.config.length);
      setEmojiLevel(preset.config.emoji);
    }
  };

  return (
    <div className="flex h-screen text-gray-200 overflow-hidden font-sans">
      
      {/* --- Sidebar (Command Rail) --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 glass-panel border-r-0 border-r-white/10 transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full bg-black/40">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-white/5 relative overflow-hidden shrink-0">
             <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent opacity-50"></div>
             <div className="flex items-center gap-3 relative z-10">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-blue-600/20 border border-brand-500/50 flex items-center justify-center text-brand-400 shadow-neon">
                 <Zap className="w-6 h-6" />
               </div>
               <div>
                 <h1 className="font-bold text-lg text-white tracking-tight leading-none">REPLY<span className="text-brand-400">WISE</span></h1>
                 <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase">AI Command Center v2.0</span>
               </div>
             </div>
             <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto text-gray-500"><X /></button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2 shrink-0">
             <button onClick={() => setCurrentView('generator')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border ${currentView === 'generator' ? 'bg-brand-500/10 text-brand-400 border-brand-500/30 shadow-[0_0_15px_-3px_rgba(0,240,255,0.2)]' : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'}`}>
                <LayoutDashboard className="w-4 h-4" /> <span>作战指挥台 (OPS)</span>
             </button>
             <button onClick={() => setCurrentView('library')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border ${currentView === 'library' ? 'bg-brand-500/10 text-brand-400 border-brand-500/30 shadow-[0_0_15px_-3px_rgba(0,240,255,0.2)]' : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'}`}>
                <Library className="w-4 h-4" /> <span>战术资料库 (DB)</span>
             </button>
          </nav>

          {/* Tactical Presets (Quick Access) */}
          <div className="px-4 py-2 shrink-0">
             <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 px-2">Tactical Presets</div>
             <div className="grid grid-cols-1 gap-2">
                {PRESETS.map(p => (
                   <button key={p.id} onClick={() => applyPreset(p.id)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-brand-500/30 transition-all text-left group">
                      <p.icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-400" />
                      <span className="text-xs text-gray-400 group-hover:text-white font-medium">{p.label}</span>
                   </button>
                ))}
             </div>
          </div>

          {/* System Status */}
          <div className="mt-auto p-6 border-t border-white/5 shrink-0">
             <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-500/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500"></div>
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono uppercase relative z-10">
                  <span>System Status</span>
                  <span className="text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ONLINE</span>
                </div>
                <div className="w-full bg-gray-800 h-0.5 rounded-full overflow-hidden relative z-10">
                  <div className="bg-brand-500 w-1/2 h-full animate-pulse-slow"></div>
                </div>
                <div className="text-[9px] text-brand-500 font-mono relative z-10">GEMINI NEURAL ENGINE CONNECTED</div>
             </div>
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-transparent">
        
        {currentView === 'generator' ? (
          <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
             
             {/* LEFT PANEL: INPUT & CONTROLS (Scrollable) */}
             <div className="flex-1 lg:w-[420px] xl:w-[480px] flex flex-col border-r border-white/5 bg-dark-bg/80 backdrop-blur-md overflow-y-auto custom-scrollbar shrink-0">
                
                {/* Mobile Header */}
                <header className="lg:hidden h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0 bg-black/50 backdrop-blur-md sticky top-0 z-20">
                   <div className="font-bold text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-brand-500" /> REPLYWISE
                   </div>
                   <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-brand-400"><Menu /></button>
                </header>

                <div className="p-6 space-y-8 pb-32">
                   
                   {/* 1. Review Input */}
                   <section>
                      <SectionHeader icon={Terminal} title="输入源 (INPUT STREAM)" />
                      <div className="relative group">
                         <div className="absolute inset-0 bg-brand-500/5 rounded-xl blur-sm group-hover:bg-brand-500/10 transition-colors opacity-0 group-hover:opacity-100"></div>
                         <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="> 等待输入客户评论数据..."
                            className="relative w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono text-gray-300 placeholder:text-gray-700 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 outline-none resize-none custom-scrollbar transition-all"
                         />
                         <div className="absolute bottom-3 right-3 text-[9px] font-mono text-gray-600 pointer-events-none">
                            {reviewText.length} CHARS
                         </div>
                      </div>
                   </section>

                   {/* 2. Strategy Controls */}
                   <section className="space-y-6">
                      <SectionHeader icon={Settings2} title="战术配置 (STRATEGY)" />
                      
                      {/* Platform & Category */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">目标平台</label>
                          <div className="relative">
                            <select 
                              value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-gray-300 outline-none focus:border-brand-500 appearance-none"
                            >
                               {Object.values(Platform).map(p => <option key={p} value={p}>{PLATFORM_CONFIG[p].label}</option>)}
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none text-gray-500"><ChevronRight className="w-3 h-3 rotate-90" /></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">产品领域</label>
                          <div className="relative">
                            <select 
                              value={productCategory} onChange={(e) => setProductCategory(e.target.value as ProductCategory)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-gray-300 outline-none focus:border-brand-500 appearance-none"
                            >
                               {Object.values(ProductCategory).map(c => <option key={c} value={c}>{CATEGORY_CONFIG[c].label}</option>)}
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none text-gray-500"><ChevronRight className="w-3 h-3 rotate-90" /></div>
                          </div>
                        </div>
                      </div>

                      {/* Context Fields */}
                      <div className="grid grid-cols-2 gap-4">
                         <input 
                           placeholder="产品名称 (可选)" 
                           className="bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-gray-300 outline-none focus:border-brand-500 placeholder:text-gray-700"
                           value={context.productName || ''} onChange={(e) => setContext({...context, productName: e.target.value})}
                         />
                         <input 
                           placeholder="客户姓名 (可选)" 
                           className="bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-gray-300 outline-none focus:border-brand-500 placeholder:text-gray-700"
                           value={context.customerName || ''} onChange={(e) => setContext({...context, customerName: e.target.value})}
                         />
                      </div>

                      {/* Tone & Resolution */}
                      <SegmentControl 
                        label="语气基调 (Tone)"
                        value={tone} onChange={(val) => setTone(val)}
                        options={Object.values(Tone).map(t => ({ value: t, label: TONE_CONFIG[t].label.split('(')[0], icon: TONE_CONFIG[t].icon }))}
                      />
                      
                      <div className="space-y-2">
                          <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">解决方案 (Action)</label>
                          <div className="relative">
                            <select 
                              value={resolution} onChange={(e) => setResolution(e.target.value as Resolution)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-gray-300 outline-none focus:border-brand-500 appearance-none"
                            >
                               {Object.values(Resolution).map(r => <option key={r} value={r}>{RESOLUTION_CONFIG[r].label}</option>)}
                            </select>
                            <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500"><ChevronRight className="w-3 h-3 rotate-90" /></div>
                          </div>
                      </div>
                   </section>

                   {/* 3. Advanced Styles */}
                   <section className="space-y-4">
                      <SectionHeader icon={SlidersHorizontal} title="微调参数 (PARAMETERS)" />
                      <SegmentControl 
                        label="篇幅长度"
                        value={replyLength} onChange={(val) => setReplyLength(val)}
                        options={Object.values(ReplyLength).map(l => ({ value: l, label: LENGTH_CONFIG[l].label.split(' ')[0], icon: LENGTH_CONFIG[l].icon }))}
                      />
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">表情浓度</label>
                            <input 
                              type="range" min="0" max="2" step="1" 
                              value={Object.values(EmojiLevel).indexOf(emojiLevel)}
                              onChange={(e) => setEmojiLevel(Object.values(EmojiLevel)[parseInt(e.target.value)])}
                              className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                            />
                            <div className="flex justify-between text-[9px] text-gray-500 mt-2 font-mono uppercase">
                               <span>无</span><span>适中</span><span>丰富</span>
                            </div>
                         </div>
                         <div>
                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">语言风格</label>
                            <div className="relative">
                              <select 
                                value={languageStyle} onChange={(e) => setLanguageStyle(e.target.value as LanguageStyle)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-gray-300 outline-none focus:border-brand-500 appearance-none"
                              >
                                 {Object.values(LanguageStyle).map(s => <option key={s} value={s}>{STYLE_CONFIG[s].label.split('(')[0]}</option>)}
                              </select>
                              <div className="absolute right-2 top-2.5 pointer-events-none text-gray-500"><ChevronRight className="w-3 h-3 rotate-90" /></div>
                            </div>
                         </div>
                      </div>
                   </section>

                   {/* Action Button */}
                   <div className="sticky bottom-6 z-10">
                     <button 
                       onClick={handleGenerate}
                       disabled={loading || !reviewText.trim()}
                       className={`w-full py-4 rounded-xl font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all relative overflow-hidden group shadow-lg ${
                         loading || !reviewText.trim() 
                         ? 'bg-gray-800 text-gray-600 border border-gray-700' 
                         : 'bg-brand-600 text-white shadow-neon border border-brand-400/50 hover:bg-brand-500 hover:scale-[1.01]'
                       }`}
                     >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        {loading ? <RefreshCcw className="animate-spin w-4 h-4" /> : <Play className="fill-current w-4 h-4" />}
                        <span className="text-xs">{loading ? 'PROCESSING...' : 'INITIATE GENERATION'}</span>
                     </button>
                   </div>

                </div>
             </div>

             {/* RIGHT PANEL: OUTPUT (Scrollable) */}
             <div className="flex-1 bg-black/30 flex flex-col h-full overflow-hidden relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                   <Cpu className="w-32 h-32 text-brand-900 animate-pulse-slow" />
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
                   
                   {/* LOADING STATE: TERMINAL */}
                   {loading && (
                      <ProcessingTerminal />
                   )}

                   {/* EMPTY STATE */}
                   {!result && !loading && (
                      <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-6">
                         <div className="w-32 h-32 rounded-full border border-dashed border-gray-800 flex items-center justify-center relative">
                            <div className="absolute inset-0 border-t border-brand-500/20 rounded-full animate-spin"></div>
                            <Activity className="w-12 h-12 text-gray-700" />
                         </div>
                         <div className="text-center space-y-2">
                           <p className="font-mono text-sm tracking-[0.2em] text-gray-500">SYSTEM STANDBY</p>
                           <p className="text-xs text-gray-700">Waiting for data stream input...</p>
                         </div>
                      </div>
                   )}

                   {/* RESULTS DISPLAY */}
                   {result && !loading && (
                      <div className="space-y-8 animate-slide-up max-w-6xl mx-auto pb-20">
                         
                         {/* Dashboard Stats */}
                         <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Summary */}
                            <div className="md:col-span-8 glass-panel rounded-xl p-6 border border-white/10 relative overflow-hidden group">
                               <div className="absolute top-0 left-0 w-1 h-full bg-brand-500 group-hover:shadow-[0_0_15px_#00F0FF] transition-shadow"></div>
                               <h3 className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                  <Activity className="w-3 h-3" /> INTELLIGENCE REPORT
                               </h3>
                               <p className="text-sm text-gray-300 leading-relaxed font-light">{result.reviewSummary}</p>
                            </div>

                            {/* Risk Gauge */}
                            <div className="md:col-span-4 glass-panel rounded-xl p-6 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
                               <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 w-full text-center">RISK INDEX</h3>
                               <div className="relative w-28 h-28 flex items-center justify-center">
                                  <svg className="w-full h-full transform -rotate-90 drop-shadow-lg">
                                     <circle cx="56" cy="56" r="42" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                                     <circle 
                                        cx="56" cy="56" r="42" 
                                        stroke={result.riskScore > 50 ? '#EF4444' : '#10B981'} 
                                        strokeWidth="8" 
                                        fill="none" 
                                        strokeDasharray={`${result.riskScore * 2.63} 263`} 
                                        className="transition-all duration-1000 ease-out" 
                                        strokeLinecap="round"
                                     />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                                     <span className={`text-3xl font-bold ${result.riskScore > 50 ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-green-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}>{result.riskScore}</span>
                                  </div>
                               </div>
                               <div className={`text-[10px] font-bold uppercase mt-2 px-2 py-0.5 rounded border ${CLASSIFICATION_CONFIG[result.classification].color.replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                                  {CLASSIFICATION_CONFIG[result.classification].label}
                               </div>
                            </div>
                         </div>

                         {/* Compliance */}
                         <div className="glass-panel rounded-xl p-5 border border-white/10 bg-red-500/5 flex items-start gap-4 shadow-inner">
                            <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 text-red-400">
                               <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                               <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">COMPLIANCE PROTOCOL CHECK</h4>
                               <p className="text-xs text-gray-400 leading-relaxed">{result.complianceNotes}</p>
                            </div>
                         </div>

                         {/* Reply Cards */}
                         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            {result.options.map((opt, i) => (
                               <ReplyCard 
                                 key={i} 
                                 option={opt} 
                                 index={i} 
                                 onSave={(o) => {
                                    // Intelligent Category Mapping
                                    let derivedCategory = TemplateCategory.OTHER;
                                    if (result.classification === ReviewClassification.POSITIVE) {
                                       derivedCategory = TemplateCategory.POSITIVE;
                                    } else if (result.classification === ReviewClassification.NEGATIVE || result.classification === ReviewClassification.HIGH_RISK) {
                                       derivedCategory = TemplateCategory.NEGATIVE;
                                    }

                                    setEditingTemplate({
                                       title: o.headline,
                                       contentEnglish: o.bodyEnglish,
                                       contentChinese: o.bodyChinese,
                                       platform: platform,
                                       category: derivedCategory
                                    });
                                    // Auto-generate smart tags
                                    setTagsInput(`${result.classification}, ${platform}, ${o.type}`);
                                    setIsSaveModalOpen(true);
                                 }} 
                               />
                            ))}
                         </div>

                         {/* History Log (Mini) */}
                         <div className="pt-8 border-t border-white/5 opacity-80 hover:opacity-100 transition-opacity">
                            <div className="flex items-center justify-between mb-4">
                               <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">RECENT OPERATIONS LOG</h3>
                               <button onClick={() => setHistory([])} className="text-[9px] text-gray-600 hover:text-red-400 uppercase">CLEAR LOGS</button>
                            </div>
                            <HistoryList 
                               history={history} 
                               onSelect={(item) => { setResult(item.result); setReviewText(item.originalReview); }} 
                               onClear={() => setHistory([])}
                            />
                         </div>
                      </div>
                   )}
                </div>
             </div>
          </div>
        ) : (
          <TemplateLibrary 
             templates={savedTemplates}
             onDelete={(id) => setSavedTemplates(prev => prev.filter(t => t.id !== id))}
             onEdit={(t) => { setEditingTemplate(t); setIsSaveModalOpen(true); }}
             onCreate={() => { setEditingTemplate({}); setIsSaveModalOpen(true); }}
          />
        )}

      </main>

      {/* Save Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
           <div className="bg-[#080808] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl p-6 m-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-500 shadow-[0_0_10px_#00F0FF]"></div>
              
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Save className="w-5 h-5 text-brand-500"/> 
                    <span className="tracking-wide">SAVE TACTICAL NODE</span>
                 </h2>
                 <button onClick={() => setIsSaveModalOpen(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5"/></button>
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Title Identifier</label>
                    <input 
                        value={editingTemplate.title || ''} 
                        onChange={e => setEditingTemplate({...editingTemplate, title: e.target.value})} 
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-brand-500 transition-colors"
                        placeholder="e.g. Refund Protocol Alpha"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category</label>
                        <select 
                            value={editingTemplate.category || 'Other'} 
                            onChange={e => setEditingTemplate({...editingTemplate, category: e.target.value as any})} 
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-gray-300 outline-none focus:border-brand-500"
                        >
                           {Object.values(TemplateCategory).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tags</label>
                        <input 
                            value={tagsInput} 
                            onChange={e => setTagsInput(e.target.value)} 
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-gray-300 outline-none focus:border-brand-500" 
                            placeholder="urgent, refund..."
                        />
                    </div>
                 </div>

                 <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Internal Notes (Chinese)</label>
                     <textarea 
                        value={editingTemplate.contentChinese || ''} 
                        onChange={e => setEditingTemplate({...editingTemplate, contentChinese: e.target.value})} 
                        className="w-full h-20 bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-gray-300 resize-none outline-none focus:border-brand-500" 
                     />
                 </div>

                 <div className="space-y-2">
                     <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest flex items-center gap-2"><Terminal className="w-3 h-3" /> Output Script (English)</label>
                     <textarea 
                        value={editingTemplate.contentEnglish || ''} 
                        onChange={e => setEditingTemplate({...editingTemplate, contentEnglish: e.target.value})} 
                        className="w-full h-32 bg-black border border-white/10 rounded-lg p-3 text-sm font-mono text-brand-400 resize-none outline-none focus:border-brand-500/50" 
                     />
                 </div>

                 <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                    <button onClick={() => setIsSaveModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-white uppercase tracking-wider transition-colors">Cancel</button>
                    <button onClick={saveTemplate} className="px-6 py-2 bg-brand-600 text-white font-bold text-xs rounded-lg hover:bg-brand-500 uppercase tracking-wider shadow-neon transition-all hover:scale-105">Confirm Save</button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default App;