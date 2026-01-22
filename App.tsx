
import React, { useState, useEffect, useRef } from 'react';
import { Platform, Tone, GenerationResult, ReviewContext, HistoryItem, Resolution, SavedTemplate, TemplateCategory, ReplyLength, EmojiLevel, LanguageStyle, ProductCategory, ReviewClassification } from './types';
import { PLATFORM_CONFIG, TONE_CONFIG, RESOLUTION_CONFIG, CLASSIFICATION_CONFIG, LENGTH_CONFIG, STYLE_CONFIG, CATEGORY_CONFIG } from './constants';
import { generateReviewReply } from './services/geminiService';
import { HistoryList } from './components/HistoryList';
import { ReplyCard } from './components/ReplyCard';
import { TemplateLibrary } from './components/TemplateLibrary';
import { ProcessingTerminal } from './components/ProcessingTerminal';
import { DEFAULT_TEMPLATES } from './data/defaultTemplates';
import { 
  Zap, 
  Menu, 
  X,
  LayoutDashboard,
  Database,
  RefreshCcw,
  ChevronDown,
  Settings,
  Sliders,
  Sparkles,
  Save,
  Package,
  Globe,
  PenTool,
  AlertTriangle,
  Key,
  User,
  ShoppingBag,
  ExternalLink,
  Clipboard,
  Trash2,
  FileText,
  Download,
  Upload,
  BookOpen
} from 'lucide-react';

// --- Modern UI Components ---

const ModernHeader = ({ title, icon: Icon }: { title: string, icon?: any }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
    {Icon && <Icon className="w-4 h-4 text-fuchsia-400" />}
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
  </div>
);

// Pill Segment Control
const ModernSegment = <T extends string>({ options, value, onChange }: { options: { value: T, label: string, icon?: any }[], value: T, onChange: (v: T) => void }) => (
  <div className="flex p-1 rounded-xl bg-black/20 border border-white/5 backdrop-blur-md">
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`flex-1 relative flex flex-col xl:flex-row items-center justify-center gap-2 py-2 px-2 rounded-lg transition-all duration-300 ${
          value === opt.value 
            ? 'bg-white/10 text-white shadow-lg shadow-purple-500/10 border border-white/10' 
            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
        }`}
      >
        {opt.icon && React.createElement(opt.icon, { size: 14, className: value === opt.value ? 'text-fuchsia-400' : 'text-slate-500' })}
        <span className="text-[10px] xl:text-xs font-medium">{opt.label}</span>
      </button>
    ))}
  </div>
);

// Glass Select
const ModernSelect = ({ value, onChange, options, label, icon: Icon }: any) => (
  <div className="group relative">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2 px-1">
       {Icon && <Icon size={12} className="text-cyan-400" />}
       {label}
    </label>
    <div className="relative">
      <select 
        value={value} 
        onChange={onChange}
        className="w-full bg-white/5 border border-white/10 text-slate-200 text-sm rounded-xl py-3 px-4 appearance-none hover:bg-white/10 hover:border-white/20 focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all cursor-pointer outline-none"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value} className="bg-[#0f172a] text-slate-200">{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-4 top-3.5 pointer-events-none text-slate-500 group-hover:text-slate-300 transition-colors">
        <ChevronDown size={14} />
      </div>
    </div>
  </div>
);

// --- Main Application ---

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<SavedTemplate>>({});
  const [tagsInput, setTagsInput] = useState('');
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial Load
  useEffect(() => {
    try {
      const hist = localStorage.getItem('replyWiseHistory_v5');
      if (hist) setHistory(JSON.parse(hist));
      const tmpl = localStorage.getItem('replyWiseTemplates_v5');
      setSavedTemplates(tmpl ? JSON.parse(tmpl) : DEFAULT_TEMPLATES);
      const ctx = localStorage.getItem('replyWiseContext_v5');
      if (ctx) setContext(JSON.parse(ctx));
    } catch (e) { console.error(e); }
  }, []);

  // Save Effect
  useEffect(() => {
    localStorage.setItem('replyWiseHistory_v5', JSON.stringify(history));
    localStorage.setItem('replyWiseTemplates_v5', JSON.stringify(savedTemplates));
    localStorage.setItem('replyWiseContext_v5', JSON.stringify(context));
  }, [history, savedTemplates, context]);

  const handleOpenSettings = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
       await window.aistudio.openSelectKey();
    }
    setIsSettingsOpen(true);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!reviewText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null); 
    
    // Smooth transition time
    const minDelay = new Promise(resolve => setTimeout(resolve, 2500));
    
    try {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
             throw new Error("API_KEY_MISSING");
        }
      }

      const finalContext = { ...context, category: productCategory };
      const [res] = await Promise.all([
        generateReviewReply(reviewText, platform, tone, resolution, finalContext, replyLength, emojiLevel, languageStyle),
        minDelay
      ]);
      
      setResult(res);
      setHistory(prev => [{ id: Date.now().toString(), timestamp: Date.now(), originalReview: reviewText, platform, result: res }, ...prev].slice(0, 50));
    } catch (e: any) {
      console.error(e);
      let msg = "系统出了点小问题，请重试";
      if (e.message === "API_KEY_MISSING" || e.message?.includes("API key")) {
          msg = "API Key 未配置";
      } else if (e.message?.includes("fetch")) {
          msg = "网络连接失败，请检查网络";
      } else if (e.message) {
          msg = e.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = () => {
    if (!editingTemplate.title) return;
    const newTmpl = { ...editingTemplate, tags: tagsInput.split(/[,，]/).map(t => t.trim()).filter(Boolean), id: editingTemplate.id || Date.now().toString(), createdAt: Date.now() } as SavedTemplate;
    setSavedTemplates(prev => editingTemplate.id ? prev.map(t => t.id === newTmpl.id ? newTmpl : t) : [newTmpl, ...prev]);
    setIsSaveModalOpen(false);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setReviewText(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleFillDemo = () => {
    const demos = [
       "The item arrived two days late and the box was crushed. I intended this as a gift for my niece's birthday which is tomorrow. Very disappointed with the shipping.",
       "Absolutely love this product! The build quality is amazing and it feels very premium. Will definitely buy again.",
       "Product works but the instructions are in Chinese only. I can't figure out how to set the timer. Can someone help?"
    ];
    setReviewText(demos[Math.floor(Math.random() * demos.length)]);
  };

  const handleExportData = () => {
    const data = {
      history,
      templates: savedTemplates,
      context
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `replywise_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.history) setHistory(json.history);
        if (json.templates) setSavedTemplates(json.templates);
        if (json.context) setContext(json.context);
        alert('数据导入成功！');
      } catch (err) {
        alert('无法解析文件，请确保格式正确。');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex h-screen text-slate-200 overflow-hidden font-sans bg-transparent">
      
      {/* --- Glass Sidebar --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-20 lg:w-24 bg-black/40 backdrop-blur-2xl border-r border-white/5 flex flex-col items-center py-8 transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          
          {/* Logo */}
          <div className="relative group mb-12 cursor-pointer">
             <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 flex items-center justify-center relative z-10 shadow-2xl">
                <Zap className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 fill-current" />
             </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 space-y-4 w-full px-3">
             <button 
                onClick={() => setCurrentView('generator')} 
                className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 group relative overflow-hidden ${currentView === 'generator' ? 'bg-white/10 text-white shadow-inner ring-1 ring-white/5' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}
             >
                {currentView === 'generator' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>}
                <LayoutDashboard className={`w-5 h-5 ${currentView === 'generator' ? 'text-fuchsia-400' : ''}`} />
                <span className="text-[11px] font-bold">智能生成</span>
             </button>

             <button 
                onClick={() => setCurrentView('library')} 
                className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 group relative overflow-hidden ${currentView === 'library' ? 'bg-white/10 text-white shadow-inner ring-1 ring-white/5' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}
             >
                {currentView === 'library' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>}
                <Database className={`w-5 h-5 ${currentView === 'library' ? 'text-cyan-400' : ''}`} />
                <span className="text-[11px] font-bold">话术库</span>
             </button>
          </nav>

          {/* Bottom Actions */}
          <div className="w-full px-3 pb-4">
             <button 
                onClick={handleOpenSettings}
                className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 text-slate-500 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5"
                title="系统设置"
             >
                <Settings className="w-5 h-5" />
                <span className="text-[10px] font-bold">设置</span>
             </button>
          </div>
      </aside>

      {/* --- Main Workspace --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {currentView === 'generator' ? (
          <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
             
             {/* LEFT PANEL: INPUT & CONFIG */}
             <div className="flex-1 lg:max-w-[480px] xl:max-w-[540px] flex flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl z-10">
                
                {/* Mobile Header */}
                <header className="lg:hidden h-16 flex items-center justify-between px-6 border-b border-white/5 bg-black/40 backdrop-blur-md">
                   <div className="font-bold text-white flex items-center gap-2">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">ReplyWise AI</span>
                   </div>
                   <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-400"><Menu size={24} /></button>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-8">
                   
                   {/* 1. INPUT CARD */}
                   <section>
                      <div className="flex justify-between items-center mb-3">
                         <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef]"></div>
                           <h2 className="text-sm font-bold text-white tracking-wide">客户反馈 / 评论</h2>
                         </div>
                         
                         {/* Input Toolbar */}
                         <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
                            <button onClick={handlePaste} title="粘贴内容" className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"><Clipboard size={12} /></button>
                            <button onClick={handleFillDemo} title="随机示例" className="p-1.5 text-slate-400 hover:text-fuchsia-400 hover:bg-white/10 rounded-md transition-colors"><FileText size={12} /></button>
                            {reviewText && <button onClick={() => setReviewText('')} title="清空" className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-md transition-colors"><Trash2 size={12} /></button>}
                         </div>
                      </div>
                      
                      <div className="relative group">
                         <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-50 transition duration-500 blur-sm"></div>
                         <div className="relative bg-[#0b0f19] rounded-2xl p-1 overflow-hidden">
                           <textarea
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              placeholder="请粘贴买家的评论或私信内容..."
                              className="w-full h-40 bg-transparent rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed custom-scrollbar"
                           />
                           <div className="absolute bottom-2 right-3 text-[10px] text-slate-600 font-mono pointer-events-none">
                              {reviewText.length} 字符
                           </div>
                         </div>
                      </div>
                   </section>

                   {/* 2. STRATEGY SETTINGS */}
                   <section>
                      <ModernHeader title="策略配置" icon={Settings} />
                      
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                           <ModernSelect 
                              label="销售平台"
                              icon={Globe}
                              value={platform}
                              onChange={(e: any) => setPlatform(e.target.value)}
                              options={Object.values(Platform).map(p => ({ value: p, label: PLATFORM_CONFIG[p].label }))}
                           />
                           <ModernSelect 
                              label="产品类目"
                              icon={Package}
                              value={productCategory}
                              onChange={(e: any) => setProductCategory(e.target.value)}
                              options={Object.values(ProductCategory).map(c => ({ value: c, label: CATEGORY_CONFIG[c].label }))}
                           />
                        </div>

                        <div>
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block px-1">语气语调</label>
                           <ModernSegment 
                              value={tone} onChange={(val) => setTone(val)}
                              options={Object.values(Tone).map(t => ({ value: t, label: TONE_CONFIG[t].label.split('(')[0], icon: TONE_CONFIG[t].icon }))}
                           />
                        </div>

                        <ModernSelect 
                            label="解决方案 / 行动"
                            icon={Sliders}
                            value={resolution}
                            onChange={(e: any) => setResolution(e.target.value)}
                            options={Object.values(Resolution).map(r => ({ value: r, label: RESOLUTION_CONFIG[r].label }))}
                         />
                      </div>
                   </section>

                   {/* 3. TWEAKS */}
                   <section>
                      <ModernHeader title="精细调整" icon={PenTool} />
                      
                      <div className="space-y-6">
                         <ModernSegment 
                             value={replyLength} onChange={(val) => setReplyLength(val)}
                             options={Object.values(ReplyLength).map(l => ({ value: l, label: LENGTH_CONFIG[l].label.split('(')[0], icon: LENGTH_CONFIG[l].icon }))}
                          />

                        <div className="grid grid-cols-2 gap-6 items-end">
                           <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Emoji 表情浓度</label>
                              <div className="flex justify-between items-center gap-2">
                                 {Object.values(EmojiLevel).map((lvl, idx) => {
                                    const isSelected = emojiLevel === lvl;
                                    return (
                                       <button 
                                          key={lvl}
                                          onClick={() => setEmojiLevel(lvl)}
                                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${isSelected ? 'bg-fuchsia-500 shadow-[0_0_8px_#d946ef]' : 'bg-white/10 hover:bg-white/20'}`}
                                       />
                                    )
                                 })}
                              </div>
                              <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-medium">
                                 <span>无</span><span>丰富</span>
                              </div>
                           </div>
                           
                           <ModernSelect 
                              label="语言风格"
                              value={languageStyle}
                              onChange={(e: any) => setLanguageStyle(e.target.value)}
                              options={Object.values(LanguageStyle).map(s => ({ value: s, label: STYLE_CONFIG[s].label.split('(')[0] }))}
                           />
                        </div>
                      </div>
                   </section>

                   <div className="h-24"></div> {/* Safe space */}
                </div>

                {/* Floating Generate Button */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#030014] via-[#030014]/90 to-transparent z-20">
                   <button 
                     onClick={handleGenerate}
                     disabled={loading || !reviewText.trim()}
                     className={`w-full py-4 rounded-2xl font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group ${
                       loading || !reviewText.trim() 
                       ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5' 
                       : 'bg-primary-gradient text-white shadow-glow-lg border border-white/20'
                     }`}
                   >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      
                      {loading ? <RefreshCcw className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5 fill-current" />}
                      <span className="relative z-10">{loading ? '智能分析中...' : '生成 AI 回复'}</span>
                   </button>
                </div>
             </div>

             {/* RIGHT PANEL: OUTPUT */}
             <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-10 opacity-30 pointer-events-none">
                   <div className="w-64 h-64 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar">
                   {loading && <ProcessingTerminal />}

                   {/* Error State */}
                   {error && !loading && (
                      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 animate-fade-in backdrop-blur-md shadow-lg shadow-red-500/10">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold uppercase tracking-wider mb-1 text-red-400">系统错误</h4>
                          <p className="text-xs opacity-90 font-mono mb-2">{error}</p>
                          {error.includes("API Key") && (
                            <button 
                              onClick={() => setIsSettingsOpen(true)}
                              className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                            >
                              配置 API Key
                            </button>
                          )}
                        </div>
                        <button onClick={() => setError(null)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 self-start">
                          <X size={16} />
                        </button>
                      </div>
                   )}

                   {!result && !loading && !error && (
                      <div className="h-full flex flex-col items-center justify-center space-y-8 opacity-60">
                         <div className="relative group">
                           <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
                           <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md relative z-10">
                              <Sparkles className="w-10 h-10 text-fuchsia-400 opacity-80" />
                           </div>
                        </div>
                         <div className="text-center">
                           <h2 className="text-2xl font-bold text-white tracking-tight mb-2">等待指令</h2>
                           <p className="text-slate-500 font-medium">请在左侧输入客户反馈，开始智能分析。</p>
                         </div>
                      </div>
                   )}

                   {result && !loading && (
                      <div className="space-y-8 max-w-6xl mx-auto pb-20 animate-fade-in">
                         
                         {/* Header Stats */}
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* AI Summary */}
                            <div className="md:col-span-2 glass-card rounded-2xl p-6 relative overflow-hidden group">
                               <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
                               <h3 className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                 <Sparkles size={12}/> 核心意图分析
                               </h3>
                               <p className="text-sm text-slate-300 leading-relaxed text-justify">{result.reviewSummary}</p>
                            </div>

                            {/* Risk Gauge */}
                            <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
                               <div className="flex justify-between items-start z-10">
                                  <div>
                                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">风险系数</h3>
                                    <div className={`text-lg font-bold ${result.riskScore > 50 ? 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]' : 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]'}`}>
                                      {CLASSIFICATION_CONFIG[result.classification].label}
                                    </div>
                                  </div>
                                  <div className="text-2xl font-bold text-white/20">{result.riskScore}%</div>
                               </div>
                               
                               {/* Progress Bar */}
                               <div className="mt-4 w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${result.riskScore > 50 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`} 
                                    style={{ width: `${result.riskScore}%` }}
                                  ></div>
                               </div>
                            </div>
                         </div>

                         {/* Alerts */}
                         {(result.classification === ReviewClassification.HIGH_RISK || result.classification === ReviewClassification.NEGATIVE) && (
                            <div className="bg-red-500/10 rounded-2xl p-4 border border-red-500/20 flex gap-4 items-center backdrop-blur-md">
                               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]"></div>
                               <p className="text-sm text-red-200 font-medium tracking-wide">{result.complianceNotes}</p>
                            </div>
                         )}

                         {/* Options Cards */}
                         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            {result.options.map((opt, i) => (
                               <ReplyCard 
                                 key={i} 
                                 option={opt} 
                                 index={i} 
                                 onSave={(o) => {
                                    let derivedCategory = TemplateCategory.OTHER;
                                    if (result.classification === ReviewClassification.POSITIVE) derivedCategory = TemplateCategory.POSITIVE;
                                    else if (result.classification === ReviewClassification.NEGATIVE || result.classification === ReviewClassification.HIGH_RISK) derivedCategory = TemplateCategory.NEGATIVE;

                                    setEditingTemplate({
                                       title: o.headline,
                                       contentEnglish: o.bodyEnglish,
                                       contentChinese: o.bodyChinese,
                                       platform: platform,
                                       category: derivedCategory
                                    });
                                    setTagsInput(`${result.classification}, ${platform}, ${o.type}`);
                                    setIsSaveModalOpen(true);
                                 }} 
                               />
                            ))}
                         </div>

                         {/* History Section */}
                         <div className="pt-10 border-t border-white/5">
                            <div className="flex items-center justify-between mb-6">
                               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">最近生成记录</h3>
                               {history.length > 0 && (
                                <button onClick={() => setHistory([])} className="text-[10px] text-slate-500 hover:text-white uppercase font-bold transition-colors">清除历史</button>
                               )}
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

      {/* Modern Save Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fade-in p-4">
           <div className="bg-[#0f172a] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
              {/* Header Gradient */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                 <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                    <Save className="w-4 h-4 text-fuchsia-400"/> 保存至话术库
                 </h2>
                 <button onClick={() => setIsSaveModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">话术标题</label>
                    <input 
                        value={editingTemplate.title || ''} 
                        onChange={e => setEditingTemplate({...editingTemplate, title: e.target.value})} 
                        placeholder="例如：通用好评回复"
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white font-medium outline-none focus:border-fuchsia-500 transition-colors placeholder:text-slate-600"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">分类</label>
                        <select 
                            value={editingTemplate.category || 'Other'} 
                            onChange={e => setEditingTemplate({...editingTemplate, category: e.target.value as any})} 
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-fuchsia-500"
                        >
                           {Object.values(TemplateCategory).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">标签</label>
                        <input 
                            value={tagsInput} 
                            onChange={e => setTagsInput(e.target.value)} 
                            placeholder="标签1, 标签2"
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-fuchsia-500 placeholder:text-slate-600" 
                        />
                    </div>
                 </div>

                 <div className="space-y-2">
                     <label className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider">回复内容 (英文)</label>
                     <textarea 
                        value={editingTemplate.contentEnglish || ''} 
                        onChange={e => setEditingTemplate({...editingTemplate, contentEnglish: e.target.value})} 
                        className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-mono text-slate-200 resize-none outline-none focus:border-fuchsia-500" 
                     />
                 </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-white/5 flex justify-end gap-4 shrink-0">
                 <button onClick={() => setIsSaveModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors">取消</button>
                 <button onClick={saveTemplate} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:shadow-glow-sm transition-all">确认保存</button>
              </div>
           </div>
        </div>
      )}

      {/* Settings Modal (Replaces old Alert) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fade-in p-4">
           <div className="bg-[#0f172a] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
              {/* Header Gradient */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                 <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                    <Settings className="w-4 h-4 text-fuchsia-400"/> 系统设置
                 </h2>
                 <button onClick={() => setIsSettingsOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
              </div>

              <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
                 
                 {/* API Status Section */}
                 <div className="space-y-3">
                    <ModernHeader title="API 连接状态" icon={Key} />
                    
                    {(!process.env.API_KEY || process.env.API_KEY === '') ? (
                       <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-red-400 font-bold text-xs mb-2">
                             <AlertTriangle size={14} />
                             <span>未检测到 API Key</span>
                          </div>
                          <p className="text-[11px] text-red-200/80 leading-relaxed mb-3">
                             由于安全策略限制，本页面无法直接输入保存 API Key。请前往您的托管平台（如 Vercel）配置环境变量。
                          </p>
                          <div className="bg-black/40 rounded-lg p-3 font-mono text-[10px] text-fuchsia-400 mb-3 border border-white/5 flex items-center justify-between group cursor-copy" onClick={() => navigator.clipboard.writeText('API_KEY')}>
                             <span>API_KEY=your_google_api_key</span>
                             <span className="opacity-0 group-hover:opacity-100 text-slate-500">复制变量名</span>
                          </div>
                          <a 
                             href="https://aistudio.google.com/app/apikey" 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="inline-flex items-center gap-2 text-[10px] font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
                          >
                             <ExternalLink size={12} />
                             获取 Google API Key
                          </a>
                       </div>
                    ) : (
                       <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                             <Key size={14} className="text-emerald-400" />
                          </div>
                          <div>
                             <div className="text-xs font-bold text-emerald-400">已连接</div>
                             <div className="text-[10px] text-emerald-200/60 font-mono">环境变量已成功加载</div>
                          </div>
                       </div>
                    )}
                 </div>

                 {/* Default Context Section */}
                 <div className="space-y-4">
                    <ModernHeader title="默认上下文预设" icon={User} />
                    <p className="text-[10px] text-slate-500 -mt-2">预先填入以下信息，AI 生成时会自动带入，无需重复输入。</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">默认客户名称</label>
                          <div className="relative">
                             <User className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-500" />
                             <input 
                                 value={context.customerName || ''} 
                                 onChange={e => setContext({...context, customerName: e.target.value})} 
                                 placeholder="Customer Name"
                                 className="w-full bg-black/20 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 outline-none focus:border-fuchsia-500 transition-colors placeholder:text-slate-600"
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">默认产品名称</label>
                          <div className="relative">
                             <ShoppingBag className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-500" />
                             <input 
                                 value={context.productName || ''} 
                                 onChange={e => setContext({...context, productName: e.target.value})} 
                                 placeholder="Product Name"
                                 className="w-full bg-black/20 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 outline-none focus:border-fuchsia-500 transition-colors placeholder:text-slate-600"
                             />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">关键回复要点 (Key Points)</label>
                       <textarea 
                           value={context.keyPointsToAddress || ''} 
                           onChange={e => setContext({...context, keyPointsToAddress: e.target.value})} 
                           placeholder="例如：强调我们提供30天无理由退款，提醒客户查看说明书..."
                           className="w-full h-24 bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-slate-200 resize-none outline-none focus:border-fuchsia-500 transition-colors placeholder:text-slate-600"
                       />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider flex items-center gap-2">
                          <BookOpen size={12} />
                          全局自定义规则 (Brand Rules)
                       </label>
                       <textarea 
                           value={context.customRules || ''} 
                           onChange={e => setContext({...context, customRules: e.target.value})} 
                           placeholder="例如：所有回复必须以 'Best regards, The Support Team' 结尾；禁止提及具体的退款金额；始终推荐客户查看FAQ页面。"
                           className="w-full h-32 bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-xl p-3 text-xs text-slate-200 resize-none outline-none focus:border-fuchsia-500 transition-colors placeholder:text-slate-600"
                       />
                       <p className="text-[9px] text-slate-500">* 此规则将强制应用于所有生成的回复中。</p>
                    </div>
                 </div>

                 {/* Data Management Section */}
                 <div className="space-y-4 pt-4 border-t border-white/5">
                    <ModernHeader title="数据备份与恢复" icon={Database} />
                    <div className="grid grid-cols-2 gap-4">
                       <button 
                          onClick={handleExportData}
                          className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all"
                       >
                          <Download size={14} />
                          导出数据 (JSON)
                       </button>
                       <div className="relative">
                          <input 
                             type="file" 
                             ref={fileInputRef}
                             onChange={handleImportData}
                             accept=".json"
                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <button 
                             className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all pointer-events-none"
                          >
                             <Upload size={14} />
                             导入数据
                          </button>
                       </div>
                    </div>
                 </div>

              </div>

              <div className="p-6 border-t border-white/5 bg-white/5 flex justify-end shrink-0">
                 <button onClick={() => setIsSettingsOpen(false)} className="px-6 py-2 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-white/90 transition-all shadow-lg shadow-white/10">完成</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default App;
