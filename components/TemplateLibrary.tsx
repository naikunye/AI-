import React, { useState } from 'react';
import { SavedTemplate, TemplateCategory } from '../types';
import { Search, Copy, Trash2, Edit3, Check, Tag, Plus, Filter, Hash, Terminal, Database, Layers } from 'lucide-react';
import { PLATFORM_CONFIG } from '../constants';

interface TemplateLibraryProps {
  templates: SavedTemplate[];
  onDelete: (id: string) => void;
  onEdit: (template: SavedTemplate) => void;
  onCreate: () => void;
}

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  [TemplateCategory.ALL]: '全部 (All)',
  [TemplateCategory.POSITIVE]: '好评 (Positive)',
  [TemplateCategory.NEGATIVE]: '差评 (Negative)',
  [TemplateCategory.LOGISTICS]: '物流 (Logistics)',
  [TemplateCategory.INQUIRY]: '咨询 (Inquiry)',
  [TemplateCategory.OTHER]: '其他 (Other)',
};

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ templates, onDelete, onEdit, onCreate }) => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>(TemplateCategory.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === TemplateCategory.ALL || t.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = t.title.toLowerCase().includes(searchLower) || 
                          t.contentEnglish.toLowerCase().includes(searchLower) ||
                          (t.contentChinese && t.contentChinese.includes(searchLower)) ||
                          t.tags?.some(tag => tag.toLowerCase().includes(searchLower));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      
      {/* --- Top Bar: Control Deck --- */}
      <div className="px-8 py-6 shrink-0 z-10 bg-dark-bg/80 backdrop-blur-md border-b border-white/5 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        
        {/* Title Block */}
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-purple/20 border border-brand-500/30 flex items-center justify-center shadow-neon">
              <Database className="w-6 h-6 text-brand-400" />
           </div>
           <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                TACTICAL DATABASE
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 font-mono">v3.0</span>
              </h2>
              <p className="text-xs text-gray-500 font-mono mt-0.5 tracking-wide uppercase">
                {templates.length} DATA NODES AVAILABLE // ENCRYPTED
              </p>
           </div>
        </div>
        
        {/* Action Block */}
        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
          {/* Search Input */}
          <div className="relative group flex-1 md:w-80">
            <div className="absolute inset-0 bg-brand-500/5 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-brand-400 transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH PROTOCOLS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-gray-700 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 outline-none transition-all"
            />
          </div>
          {/* Create Button */}
          <button 
            onClick={onCreate}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-600/90 text-white rounded-xl hover:bg-brand-500 transition-all shadow-neon font-bold text-xs tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            NEW NODE
          </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Filter */}
        <div className="w-56 hidden lg:flex flex-col gap-1 p-6 border-r border-white/5 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-4 px-2">Data Filters</div>
          {Object.values(TemplateCategory).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold transition-all duration-200 group border ${
                selectedCategory === cat 
                  ? 'bg-brand-500/10 text-brand-400 border-brand-500/30 shadow-[0_0_15px_-5px_rgba(0,240,255,0.3)]' 
                  : 'text-gray-500 border-transparent hover:bg-white/5 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                 <Layers className={`w-3 h-3 ${selectedCategory === cat ? 'text-brand-500' : 'text-gray-600'}`} />
                 <span>{CATEGORY_LABELS[cat].split('(')[0]}</span>
              </div>
              {selectedCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-[0_0_5px_#00F0FF]"></div>}
            </button>
          ))}
        </div>

        {/* Grid View */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar bg-black/20">
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-30 space-y-4">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-dashed border-white/10">
                <Filter className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-sm font-mono tracking-widest text-gray-500">NO DATA NODES FOUND</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {filteredTemplates.map((template, idx) => {
                const PlatformIcon = PLATFORM_CONFIG[template.platform].icon;
                return (
                  <div key={template.id} className="group glass-panel rounded-xl flex flex-col overflow-hidden transition-all duration-300 hover:border-brand-500/40 hover:translate-y-[-2px] hover:shadow-lg animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                    
                    {/* Card Header */}
                    <div className="p-5 border-b border-white/5 bg-white/5 flex justify-between items-start relative overflow-hidden">
                      {/* Hover Highlight */}
                      <div className="absolute top-0 left-0 w-1 h-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="flex flex-col gap-2 relative z-10">
                         <div className="flex items-center gap-2">
                           <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-black/40 text-gray-400 border border-white/10 uppercase tracking-wider">
                             <PlatformIcon className="w-3 h-3" />
                             {template.platform}
                           </span>
                           <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-brand-500/5 text-brand-400 border border-brand-500/20 uppercase tracking-wider">
                             <Tag className="w-3 h-3" />
                             {CATEGORY_LABELS[template.category].split('(')[0]}
                           </span>
                         </div>
                         <h3 className="font-bold text-gray-100 text-sm leading-tight group-hover:text-brand-300 transition-colors">{template.title}</h3>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-200">
                        <button onClick={() => onEdit(template)} className="p-2 text-gray-500 hover:text-brand-400 hover:bg-white/10 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => onDelete(template.id)} className="p-2 text-gray-500 hover:text-accent-pink hover:bg-white/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    
                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col gap-4">
                      {template.contentChinese && (
                        <div className="text-[11px] text-gray-500 leading-relaxed border-l-2 border-white/10 pl-3">
                           {template.contentChinese}
                        </div>
                      )}
                      
                      <div className="relative group/code">
                         <div className="bg-black/40 p-3 rounded-lg border border-white/10 min-h-[80px]">
                            <p className="text-xs text-brand-50/80 font-mono leading-relaxed line-clamp-4">
                                {template.contentEnglish}
                            </p>
                         </div>
                         <Terminal className="w-3 h-3 text-brand-500 absolute top-3 right-3 opacity-20" />
                      </div>
                      
                      {template.tags && template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto">
                           {template.tags.map((tag, i) => (
                             <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono text-gray-500 bg-white/5 border border-white/5">
                               # {tag}
                             </span>
                           ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="p-3 px-5 border-t border-white/5 bg-black/20 flex justify-end">
                       <button
                        onClick={() => handleCopy(template.contentEnglish, template.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all border ${
                          copiedId === template.id 
                            ? 'bg-brand-500/20 text-brand-400 border-brand-500/50' 
                            : 'bg-transparent border-white/10 text-gray-500 hover:border-brand-500/30 hover:text-brand-300'
                        }`}
                      >
                        {copiedId === template.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedId === template.id ? 'COPIED' : 'COPY_TEXT'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};