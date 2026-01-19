import React, { useState, useEffect } from 'react';
import { Platform, Tone, GenerationResult, ReviewContext, HistoryItem, Resolution, SavedTemplate, TemplateCategory, GeneratedReplyOption } from './types';
import { PLATFORM_CONFIG, TONE_CONFIG, RESOLUTION_CONFIG, CLASSIFICATION_CONFIG } from './constants';
import { generateReviewReply } from './services/geminiService';
import { HistoryList } from './components/HistoryList';
import { ReplyCard } from './components/ReplyCard';
import { TemplateLibrary } from './components/TemplateLibrary';
import { DEFAULT_TEMPLATES } from './data/defaultTemplates';
import { 
  Sparkles, 
  Send, 
  Settings2, 
  AlertCircle, 
  Menu, 
  X,
  MessageCircle,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  Library,
  Save,
  Command,
  Zap,
  Cpu
} from 'lucide-react';

// Tech Modal Component
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0f172a]/90 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-300 border border-slate-700/50 shadow-glow">
        <div className="px-6 py-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/20">
          <h3 className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-400" />
            {title}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<'generator' | 'library'>('generator');

  // State for Input
  const [reviewText, setReviewText] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.AMAZON);
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [resolution, setResolution] = useState<Resolution>(Resolution.NONE);
  const [context, setContext] = useState<ReviewContext>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // State for Processing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  
  // State for History & Saved Templates
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);

  // Modal State for Saving Template
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<SavedTemplate>>({});
  const [tagsInput, setTagsInput] = useState('');

  // Load data
  useEffect(() => {
    const savedHistory = localStorage.getItem('replyWiseHistory_v3');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
    const savedTmpls = localStorage.getItem('replyWiseTemplates_v3');
    if (savedTmpls) {
      try { 
        setSavedTemplates(JSON.parse(savedTmpls)); 
      } catch (e) { 
        console.error(e); 
        // Fallback to default if parse fails
        setSavedTemplates(DEFAULT_TEMPLATES);
      }
    } else {
      // Initialize with default templates if no data found
      setSavedTemplates(DEFAULT_TEMPLATES);
    }
  }, []);

  // Persist data
  useEffect(() => {
    localStorage.setItem('replyWiseHistory_v3', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    // Only save if we have templates (to avoid saving empty array over defaults accidentally if logic changes)
    if (savedTemplates.length > 0) {
      localStorage.setItem('replyWiseTemplates_v3', JSON.stringify(savedTemplates));
    }
  }, [savedTemplates]);

  const handleGenerate = async () => {
    if (!reviewText.trim()) {
      setError("请输入内容 / Please enter content.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentHistoryId(null);

    try {
      const genResult = await generateReviewReply(reviewText, platform, tone, resolution, context);
      setResult(genResult);

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        originalReview: reviewText,
        platform,
        result: genResult
      };

      setHistory(prev => [newItem, ...prev].slice(0, 50)); 
    } catch (err: any) {
      setError(err.message || "Connection Error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setReviewText(item.originalReview);
    setPlatform(item.platform);
    setResult(item.result);
    setCurrentHistoryId(item.id);
    if (window.innerWidth < 1024) setIsSidebarOpen(false); 
  };

  const handleClearHistory = () => {
    if (confirm("Clear all history?")) {
      setHistory([]);
    }
  };

  // --- Saved Template Logic ---
  const openSaveModal = (option?: GeneratedReplyOption) => {
    if (option) {
      setEditingTemplate({
        id: '',
        title: option.headline,
        contentEnglish: option.bodyEnglish,
        contentChinese: option.bodyChinese,
        category: TemplateCategory.OTHER,
        platform: platform,
        createdAt: Date.now(),
        tags: []
      });
      setTagsInput('');
    } else {
      setEditingTemplate({
        id: '',
        title: '',
        contentEnglish: '',
        contentChinese: '',
        category: TemplateCategory.ALL,
        platform: Platform.GENERAL,
        createdAt: Date.now(),
        tags: []
      });
      setTagsInput('');
    }
    setIsSaveModalOpen(true);
  };

  const saveTemplate = () => {
    if (!editingTemplate.title || !editingTemplate.contentEnglish) return;
    const processedTags = tagsInput.split(/[,，]/).map(t => t.trim()).filter(Boolean);
    const templateData = { ...editingTemplate, tags: processedTags } as SavedTemplate;

    if (editingTemplate.id) {
      setSavedTemplates(prev => prev.map(t => t.id === editingTemplate.id ? { ...t, ...templateData } : t));
    } else {
      const newTemplate: SavedTemplate = {
        ...templateData,
        id: Date.now().toString(),
        createdAt: Date.now()
      };
      setSavedTemplates(prev => [newTemplate, ...prev]);
    }
    setIsSaveModalOpen(false);
  };

  const deleteTemplate = (id: string) => {
    if (confirm("Delete template?")) {
      setSavedTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  const editTemplate = (template: SavedTemplate) => {
    setEditingTemplate(template);
    setTagsInput(template.tags?.join(', ') || '');
    setIsSaveModalOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans text-slate-200">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Cyber Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-[280px] bg-[#0B0F19]/80 backdrop-blur-xl border-r border-slate-800/50 transform transition-transform duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] lg:relative lg:translate-x-0 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* App Logo */}
        <div className="h-20 flex items-center px-6 mt-2 shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent opacity-50"></div>
          <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tight relative z-10">
            <div className="relative group">
               <div className="absolute inset-0 bg-brand-400 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
               <div className="bg-[#1e293b] text-brand-300 border border-slate-700 p-2.5 rounded-xl relative shadow-inner">
                 <Sparkles className="w-5 h-5" />
               </div>
            </div>
            <div className="flex flex-col">
              <span className="leading-none text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">ReplyWise</span>
              <span className="text-[10px] text-brand-400 font-mono mt-0.5 tracking-widest">AI TERMINAL</span>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Menu - Neon Pills */}
        <div className="px-4 py-6 flex flex-col gap-2 shrink-0">
           <button 
             onClick={() => setCurrentView('generator')}
             className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border ${
               currentView === 'generator' 
                 ? 'bg-brand-500/10 border-brand-500/30 text-brand-300 shadow-[0_0_15px_-3px_rgba(45,212,191,0.2)]' 
                 : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
             }`}
           >
             <LayoutDashboard className="w-4 h-4" />
             AI 生成工作台 (Generator)
           </button>
           <button 
             onClick={() => setCurrentView('library')}
             className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border ${
               currentView === 'library' 
                 ? 'bg-brand-500/10 border-brand-500/30 text-brand-300 shadow-[0_0_15px_-3px_rgba(45,212,191,0.2)]' 
                 : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
             }`}
           >
             <Library className="w-4 h-4" />
             话术库 (Templates)
           </button>
        </div>

        {/* History List */}
        {currentView === 'generator' && (
          <div className="flex-1 overflow-hidden flex flex-col border-t border-slate-800/50 pt-4">
            <div className="px-6 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
              History Log
            </div>
            <HistoryList 
              history={history} 
              onSelect={handleSelectHistory} 
              onClear={handleClearHistory}
              currentId={currentHistoryId || undefined}
            />
          </div>
        )}
        
        {/* User Status */}
        <div className="p-4 border-t border-slate-800/50 bg-[#0B0F19]">
           <div className="flex items-center gap-3 px-2 rounded-xl bg-slate-900/50 p-2 border border-slate-800">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-blue-600 shadow-glow flex items-center justify-center text-white text-xs font-bold font-mono">
                AI
             </div>
             <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-200">PRO SYSTEM</span>
               <span className="text-[10px] text-brand-500 flex items-center gap-1">
                 <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500"></span>
                  </span>
                 Gemini Online
               </span>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* VIEW 1: GENERATOR */}
        {currentView === 'generator' && (
          <>
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 z-20 shrink-0 lg:hidden">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scroll-smooth pb-10 pt-4 lg:pt-8">
              <div className="max-w-7xl mx-auto px-6 space-y-8">
                
                {/* Input Card - Tech Style */}
                <div className="bg-[#111827]/60 backdrop-blur-xl rounded-[24px] shadow-2xl border border-slate-700/50 p-1 overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="p-6 lg:p-8 space-y-8">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left Column: Review Input */}
                      <div className="lg:col-span-7 flex flex-col gap-3">
                        <label className="text-sm font-bold text-brand-400 flex items-center gap-2 uppercase tracking-wide">
                          <MessageCircle className="w-4 h-4" />
                          Review Input (English)
                        </label>
                        <div className="relative group/input">
                          <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="> Paste customer review here..."
                            className="w-full h-64 p-5 bg-[#0B0F19] border border-slate-700 rounded-xl focus:ring-1 focus:ring-brand-500 focus:border-brand-500 resize-none transition-all duration-200 text-base leading-relaxed placeholder:text-slate-600 outline-none text-slate-200 font-mono shadow-inner"
                          />
                          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-slate-500">
                            CHARS: {reviewText.length}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Settings */}
                      <div className="lg:col-span-5 flex flex-col gap-4">
                        <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50 flex flex-col gap-5">
                          <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Platform</label>
                            <div className="relative">
                              <select
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value as Platform)}
                                className="w-full pl-10 pr-4 py-3 bg-[#0B0F19] border border-slate-700 rounded-xl text-sm font-semibold text-slate-200 shadow-sm focus:ring-1 focus:ring-brand-500 transition-all cursor-pointer appearance-none outline-none"
                              >
                                {Object.values(Platform).map((p) => (
                                  <option key={p} value={p}>{PLATFORM_CONFIG[p].label}</option>
                                ))}
                              </select>
                              <div className="absolute left-3 top-3 text-brand-500 pointer-events-none">
                                {React.createElement(PLATFORM_CONFIG[platform].icon, { size: 16 })}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Tone</label>
                              <div className="relative">
                                <select
                                  value={tone}
                                  onChange={(e) => setTone(e.target.value as Tone)}
                                  className="w-full pl-9 pr-2 py-3 bg-[#0B0F19] border border-slate-700 rounded-xl text-sm font-semibold text-slate-200 shadow-sm focus:ring-1 focus:ring-brand-500 transition-all cursor-pointer appearance-none outline-none"
                                >
                                  {Object.values(Tone).map((t) => (
                                    <option key={t} value={t}>{TONE_CONFIG[t].label.split(' ')[0]}</option>
                                  ))}
                                </select>
                                <div className="absolute left-3 top-3 text-slate-500 pointer-events-none">
                                  {React.createElement(TONE_CONFIG[tone].icon, { size: 16 })}
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Action</label>
                              <div className="relative">
                                <select
                                  value={resolution}
                                  onChange={(e) => setResolution(e.target.value as Resolution)}
                                  className="w-full pl-9 pr-2 py-3 bg-[#0B0F19] border border-slate-700 rounded-xl text-sm font-semibold text-slate-200 shadow-sm focus:ring-1 focus:ring-brand-500 transition-all cursor-pointer appearance-none outline-none"
                                >
                                  {Object.values(Resolution).map((r) => (
                                    <option key={r} value={r}>{RESOLUTION_CONFIG[r].label.split(' ')[0]}</option>
                                  ))}
                                </select>
                                <div className="absolute left-3 top-3 text-slate-500 pointer-events-none">
                                  {React.createElement(RESOLUTION_CONFIG[resolution].icon, { size: 16 })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Advanced Toggle */}
                        <button 
                          onClick={() => setShowAdvanced(!showAdvanced)}
                          className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all border ${
                            showAdvanced 
                              ? 'bg-brand-500/10 border-brand-500/30 text-brand-400' 
                              : 'bg-slate-800/30 border-transparent text-slate-400 hover:bg-slate-800/50'
                          }`}
                        >
                          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                            <Settings2 className="w-4 h-4" /> Context Data
                          </span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                        </button>

                         {/* Advanced Fields */}
                        {showAdvanced && (
                          <div className="p-4 bg-[#0B0F19] rounded-xl border border-slate-700 animate-in slide-in-from-top-2 duration-200 space-y-3">
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:ring-1 focus:ring-brand-500 placeholder:text-slate-600 outline-none text-slate-200"
                                placeholder="Customer Name (Optional)"
                                value={context.customerName || ''}
                                onChange={(e) => setContext({...context, customerName: e.target.value})}
                            />
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:ring-1 focus:ring-brand-500 placeholder:text-slate-600 outline-none text-slate-200"
                                placeholder="Product Name (Optional)"
                                value={context.productName || ''}
                                onChange={(e) => setContext({...context, productName: e.target.value})}
                            />
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:ring-1 focus:ring-brand-500 placeholder:text-slate-600 outline-none text-slate-200"
                                placeholder="Key points to mention..."
                                value={context.keyPointsToAddress || ''}
                                onChange={(e) => setContext({...context, keyPointsToAddress: e.target.value})}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Generate Button - Cyber Button */}
                    <div className="flex justify-end pt-2">
                        <button
                          onClick={handleGenerate}
                          disabled={loading || !reviewText.trim()}
                          className={`group relative px-8 py-4 rounded-xl flex items-center gap-3 font-bold text-white transition-all duration-300 transform active:scale-[0.98] overflow-hidden
                            ${loading || !reviewText.trim() 
                              ? 'bg-slate-800 cursor-not-allowed text-slate-500' 
                              : 'bg-brand-600 hover:shadow-glow'
                            }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center gap-2">
                             {loading ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                                <span>PROCESSING...</span>
                              </div>
                            ) : (
                              <>
                                <Zap className="w-4 h-4 fill-white" />
                                <span>INITIALIZE REPLY</span>
                              </>
                            )}
                          </div>
                        </button>
                    </div>
                    
                    {error && (
                      <div className="p-4 bg-red-900/20 text-red-400 border border-red-500/30 rounded-xl flex items-start gap-3 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Results Section */}
                {result && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    
                    {/* Analysis Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#111827]/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 text-slate-300">
                              <MessageCircle className="w-4 h-4 text-brand-400" />
                              <h3 className="font-bold text-sm tracking-wide">ANALYSIS SUMMARY</h3>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 border ${CLASSIFICATION_CONFIG[result.classification].color}`}>
                              {React.createElement(CLASSIFICATION_CONFIG[result.classification].icon, { className: "w-3 h-3" })}
                              {CLASSIFICATION_CONFIG[result.classification].label}
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">{result.reviewSummary}</p>
                      </div>

                      <div className="bg-[#111827]/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 flex flex-col gap-4">
                        <div className="flex items-center gap-2.5 text-slate-300">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <h3 className="font-bold text-sm tracking-wide">SAFETY CHECK</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">{result.complianceNotes}</p>
                      </div>
                    </div>

                    {/* Reply Options */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-6 px-1 flex items-center gap-2 tracking-wide">
                        <Command className="w-5 h-5 text-brand-400" />
                        GENERATED SOLUTIONS <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded ml-2">Bilingual Output</span>
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                        {result.options.map((option, idx) => (
                          <ReplyCard 
                            key={idx} 
                            option={option} 
                            index={idx} 
                            onSave={openSaveModal} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {!result && !loading && (
                  <div className="text-center py-24 opacity-50">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800/50 shadow-inner mb-4 border border-slate-700/50">
                      <Cpu className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-400 mb-2 tracking-wide">SYSTEM READY</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto font-mono">
                      Awaiting input stream for analysis...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: TEMPLATE LIBRARY */}
        {currentView === 'library' && (
          <TemplateLibrary 
            templates={savedTemplates}
            onDelete={deleteTemplate}
            onEdit={editTemplate}
            onCreate={() => openSaveModal()}
          />
        )}
      </main>

      {/* Tech Modal */}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title={editingTemplate.id ? "EDIT NODE" : "SAVE NODE"}
      >
        <div className="flex flex-col gap-5 text-slate-300">
          <div>
            <label className="block text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2">Title</label>
            <input 
              type="text"
              value={editingTemplate.title || ''}
              onChange={(e) => setEditingTemplate({...editingTemplate, title: e.target.value})}
              className="w-full px-4 py-3 bg-[#0B0F19] border border-slate-700 rounded-xl focus:ring-1 focus:ring-brand-500 transition-all outline-none text-white"
              placeholder="e.g. Standard Refund Apology"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2">Category</label>
               <select 
                 value={editingTemplate.category || TemplateCategory.OTHER}
                 onChange={(e) => setEditingTemplate({...editingTemplate, category: e.target.value as TemplateCategory})}
                 className="w-full px-4 py-3 bg-[#0B0F19] border border-slate-700 rounded-xl focus:ring-1 focus:ring-brand-500 transition-all outline-none text-white"
               >
                 {Object.entries(TemplateCategory).filter(([key, val]) => val !== 'All').map(([key, val]) => (
                   <option key={val} value={val}>{val}</option>
                 ))}
               </select>
             </div>
             <div>
               <label className="block text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2">Platform</label>
               <select 
                 value={editingTemplate.platform || Platform.GENERAL}
                 onChange={(e) => setEditingTemplate({...editingTemplate, platform: e.target.value as Platform})}
                 className="w-full px-4 py-3 bg-[#0B0F19] border border-slate-700 rounded-xl focus:ring-1 focus:ring-brand-500 transition-all outline-none text-white"
               >
                 {Object.values(Platform).map(p => (
                   <option key={p} value={p}>{PLATFORM_CONFIG[p].label}</option>
                 ))}
               </select>
             </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2">Tags</label>
            <input 
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-3 bg-[#0B0F19] border border-slate-700 rounded-xl focus:ring-1 focus:ring-brand-500 transition-all outline-none text-sm text-white"
              placeholder="refund, urgent..."
            />
          </div>

          <div>
             <label className="block text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2 flex justify-between">
                <span>Chinese Note (Private)</span>
             </label>
             <textarea 
              value={editingTemplate.contentChinese || ''}
              onChange={(e) => setEditingTemplate({...editingTemplate, contentChinese: e.target.value})}
              className="w-full h-20 px-4 py-3 bg-[#0B0F19] border border-slate-700 rounded-xl focus:ring-1 focus:ring-brand-500 transition-all outline-none resize-none mb-2 text-white"
              placeholder="Translation..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2">English Reply (Public)</label>
            <textarea 
              value={editingTemplate.contentEnglish || ''}
              onChange={(e) => setEditingTemplate({...editingTemplate, contentEnglish: e.target.value})}
              className="w-full h-32 px-4 py-3 bg-black border border-slate-700 rounded-xl focus:ring-1 focus:ring-brand-500 transition-all outline-none resize-none font-mono text-sm text-green-400"
              placeholder="Reply text..."
            />
          </div>

          <div className="pt-2">
            <button
              onClick={saveTemplate}
              className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-500 transition-colors shadow-glow flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              SAVE TO MEMORY
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default App;