import React, { useState } from 'react';
import { SavedTemplate, TemplateCategory } from '../types';
import { Search, Copy, Trash2, Edit3, Check, Tag, Plus, Filter, LayoutGrid, Hash, Languages, Terminal } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 z-10 sticky top-0 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
             <Hash className="w-6 h-6 text-brand-500" />
             Template Library
           </h2>
           <p className="text-sm text-slate-500 font-mono mt-1">Found {templates.length} saved nodes</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search database..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-slate-700 rounded-xl text-sm shadow-inner focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-white placeholder:text-slate-600"
            />
          </div>
          <button 
            onClick={onCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-500 transition-all shadow-glow font-bold text-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            NEW NODE
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden px-8 pb-8 gap-8 pt-6">
        {/* Category Sidebar */}
        <div className="w-48 flex flex-col gap-1 shrink-0">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">Filter Stream</h3>
          {Object.values(TemplateCategory).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat 
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30' 
                  : 'text-slate-400 hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{CATEGORY_LABELS[cat].split('(')[0]}</span>
              {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto pr-2">
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-40">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                <Filter className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-lg font-bold text-slate-400">NO DATA FOUND</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const PlatformIcon = PLATFORM_CONFIG[template.platform].icon;
                return (
                  <div key={template.id} className="group bg-[#111827]/80 backdrop-blur-sm rounded-2xl border border-slate-700 hover:border-brand-500/50 transition-all duration-300 hover:shadow-glow-blue flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-700/50 flex justify-between items-start bg-slate-800/20">
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2">
                           <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-600 shadow-sm">
                             <PlatformIcon className="w-3 h-3" />
                             {template.platform}
                           </span>
                           <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                             <Tag className="w-3 h-3" />
                             {CATEGORY_LABELS[template.category].split('(')[0]}
                           </span>
                         </div>
                         <h3 className="font-bold text-slate-200 text-base">{template.title}</h3>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit(template)}
                          className="p-2 text-slate-500 hover:text-brand-400 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDelete(template.id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col gap-3">
                      {/* Chinese Preview */}
                      {template.contentChinese && (
                        <div className="text-xs text-slate-500 bg-slate-800/50 p-2 rounded border border-slate-700/50 mb-1">
                           <span className="font-bold mr-1 text-slate-400">CH:</span> {template.contentChinese}
                        </div>
                      )}
                      
                      {/* English Content */}
                      <div className="bg-black/50 p-3 rounded-lg border border-slate-800 relative">
                        <Terminal className="w-3 h-3 text-emerald-500 absolute top-3 right-3 opacity-50" />
                        <p className="text-sm text-emerald-400/90 font-medium leading-relaxed font-mono line-clamp-4">
                            {template.contentEnglish}
                        </p>
                      </div>
                      
                      {/* Tags */}
                      {template.tags && template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                           {template.tags.map((tag, i) => (
                             <span key={i} className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                               <Hash className="w-2 h-2 mr-1 opacity-50" />
                               {tag}
                             </span>
                           ))}
                        </div>
                      )}
                    </div>

                    <div className="p-3 px-5 border-t border-slate-700/50 bg-slate-800/30 flex justify-end">
                       <button
                        onClick={() => handleCopy(template.contentEnglish, template.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          copiedId === template.id 
                            ? 'bg-emerald-500 text-white shadow-glow' 
                            : 'bg-transparent border border-slate-600 text-slate-400 hover:border-brand-400 hover:text-brand-400'
                        }`}
                      >
                        {copiedId === template.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedId === template.id ? 'COPIED' : 'COPY ENGLISH'}
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