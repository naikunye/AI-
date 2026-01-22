
import React, { useState } from 'react';
import { SavedTemplate, TemplateCategory } from '../types';
import { Search, Copy, Trash2, Edit3, Check, Tag, Plus, Filter, Database, Hash } from 'lucide-react';
import { PLATFORM_CONFIG } from '../constants';

interface TemplateLibraryProps {
  templates: SavedTemplate[];
  onDelete: (id: string) => void;
  onEdit: (template: SavedTemplate) => void;
  onCreate: () => void;
}

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  [TemplateCategory.ALL]: '全部',
  [TemplateCategory.POSITIVE]: '好评',
  [TemplateCategory.NEGATIVE]: '差评/纠纷',
  [TemplateCategory.LOGISTICS]: '物流相关',
  [TemplateCategory.INQUIRY]: '售前咨询',
  [TemplateCategory.OTHER]: '其他',
};

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ templates, onDelete, onEdit, onCreate }) => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>(TemplateCategory.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTemplates = templates.filter(t => {
    // Filter by Category sidebar
    const matchesCategory = selectedCategory === TemplateCategory.ALL || t.category === selectedCategory;
    
    // Filter by Search Query
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
        t.title.toLowerCase().includes(searchLower) || 
        t.contentEnglish.toLowerCase().includes(searchLower) ||
        (t.contentChinese && t.contentChinese.toLowerCase().includes(searchLower)) ||
        t.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        // Expanded: Search by Platform and Category name
        t.platform.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      
      {/* --- Top Bar --- */}
      <div className="px-8 py-8 shrink-0 z-10 bg-black/40 backdrop-blur-md border-b border-white/5 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        
        {/* Title Block */}
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-fuchsia-400" />
           </div>
           <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                智能话术库
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono tracking-wide">在线</span>
              </h2>
              <p className="text-[10px] text-slate-500 font-mono mt-1 tracking-widest uppercase">
                {filteredTemplates.length} 条记录 // 已加密存储
              </p>
           </div>
        </div>
        
        {/* Action Block */}
        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
          {/* Search Input */}
          <div className="relative group flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-fuchsia-400 transition-colors" />
            <input 
              type="text" 
              placeholder="搜索内容、平台、分类或标签..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white placeholder:text-slate-600 focus:border-fuchsia-500/50 outline-none transition-all"
            />
          </div>
          {/* Create Button */}
          <button 
            onClick={onCreate}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl hover:bg-white/90 transition-all shadow-lg shadow-white/10 font-bold text-xs tracking-wider uppercase"
          >
            <Plus className="w-4 h-4" />
            新建话术
          </button>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Filter */}
        <div className="w-64 hidden lg:flex flex-col gap-1 p-6 border-r border-white/5 bg-black/20 backdrop-blur-sm overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">分类筛选</div>
          {Object.values(TemplateCategory).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold transition-all duration-200 group border ${
                selectedCategory === cat 
                  ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' 
                  : 'text-slate-500 border-transparent hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                 <Hash className={`w-3 h-3 ${selectedCategory === cat ? 'text-fuchsia-400' : 'text-slate-600'}`} />
                 <span>{CATEGORY_LABELS[cat].split('(')[0]}</span>
              </div>
              {selectedCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_#d946ef]"></div>}
            </button>
          ))}
        </div>

        {/* Grid View */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-30 space-y-4">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-dashed border-white/10">
                <Filter className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-xs font-mono tracking-widest text-slate-500">未找到相关数据</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {filteredTemplates.map((template, idx) => {
                const PlatformIcon = PLATFORM_CONFIG[template.platform].icon;
                return (
                  <div key={template.id} className="group glass-card rounded-2xl flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                    
                    {/* Card Header */}
                    <div className="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-start relative">
                      
                      <div className="flex flex-col gap-2 relative z-10 w-full">
                         <div className="flex items-center justify-between w-full">
                           <div className="flex gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 text-slate-400 border border-white/10 uppercase tracking-wider">
                              <PlatformIcon className="w-3 h-3" />
                              {template.platform}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 uppercase tracking-wider">
                              <Tag className="w-3 h-3" />
                              {CATEGORY_LABELS[template.category].split('(')[0]}
                            </span>
                           </div>
                           
                           {/* Actions */}
                           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onEdit(template)} className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => onDelete(template.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                         </div>
                         <h3 className="font-bold text-white text-sm mt-2 leading-snug group-hover:text-fuchsia-400 transition-colors truncate">{template.title}</h3>
                      </div>
                    </div>
                    
                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col gap-4">
                      {template.contentChinese && (
                        <div className="text-[10px] text-slate-500 leading-relaxed font-medium line-clamp-2">
                           {template.contentChinese}
                        </div>
                      )}
                      
                      <div className="relative group/code flex-1">
                         <div className="bg-black/40 p-3 rounded-xl border border-white/5 h-full min-h-[80px]">
                            <p className="text-xs text-slate-300 font-mono leading-relaxed line-clamp-4">
                                {template.contentEnglish}
                            </p>
                         </div>
                      </div>
                      
                      {template.tags && template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto">
                           {template.tags.map((tag, i) => (
                             <span key={i} className="text-[9px] font-mono text-slate-600 bg-white/5 px-1.5 py-0.5 rounded">
                               #{tag}
                             </span>
                           ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="p-3 px-5 border-t border-white/5 bg-black/20 flex justify-end">
                       <button
                        onClick={() => handleCopy(template.contentEnglish, template.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-bold font-mono tracking-widest uppercase transition-all border ${
                          copiedId === template.id 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                            : 'bg-transparent border-transparent text-slate-500 hover:text-white'
                        }`}
                      >
                        {copiedId === template.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedId === template.id ? '已复制' : '复制英文内容'}
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
