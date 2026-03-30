import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, ChevronDown, User, ArrowLeft, FileText, FolderPlus, X, Image as ImageIcon } from 'lucide-react';

export default function EpisodeManagement({ onUpload, onEnterEpisode, onBack }: { onUpload: () => void, onEnterEpisode: () => void, onBack: () => void }) {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  
  // Mock data based on reference image
  const episodes = [
    { 
      id: 1, 
      title: '第1集', 
      epNumber: '1 集',
      cover: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=500&q=80', 
      stats: { img: 1016, vid: 274, del: 443, token: 122675, time: '0d00h00m' }, 
      tags: ['若曦', '婉清', '知夏'], 
      date: '2026-03-11 17:23', 
      status: '未完成' 
    },
    { 
      id: 2, 
      title: '第2集', 
      epNumber: '2 集',
      cover: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80', 
      stats: { img: 892, vid: 429, del: 73, token: 183773, time: '47d02h59m' }, 
      tags: ['语桐', '星冉', '初禾'], 
      date: '2026-01-23 14:24', 
      status: '未完成' 
    },
    { 
      id: 3, 
      title: '第3集', 
      epNumber: '3 集',
      cover: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=500&q=80', 
      stats: { img: 0, vid: 0, del: 0, token: 0, time: '47d02h08m' }, 
      tags: [], 
      date: '2026-01-23 15:14', 
      status: '未完成' 
    },
    { 
      id: 4, 
      title: '第四集', 
      epNumber: '4 集',
      cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&q=80', 
      stats: { img: 420, vid: 332, del: 154, token: 83720, time: '0d00h00m' }, 
      tags: ['慕晚', '书瑶', '南栀', '以宁', '昭月'], 
      date: '2026-03-11 17:23', 
      status: '未完成' 
    },
    { 
      id: 5, 
      title: '第五集', 
      epNumber: '5 集',
      cover: 'https://images.unsplash.com/photo-1504333638930-c8787321efa0?w=500&q=80', 
      stats: { img: 552, vid: 398, del: 67, token: 133770, time: '0d00h00m' }, 
      tags: ['婧妍', '清欢', '知意', '允棠', '若初'], 
      date: '2026-03-11 17:23', 
      status: '未完成' 
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8F3E8] overflow-hidden relative">
      {/* Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={16} /> 返回项目列表
          </button>
          <div className="h-4 w-px bg-slate-300"></div>
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            我的作品 <span className="text-slate-400">/</span> 离婚后我成了顶流白月光 <span className="text-slate-400">/</span> <span className="text-slate-900 font-bold">分集管理</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-violet-50 px-3 py-1.5 rounded-full text-xs text-violet-600 font-mono border border-violet-100">
            🪙 5092
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500">
            <User size={16} />
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus size={16} /> 创建分集
            </button>
            
            {/* Create Menu Dropdown */}
            {isCreateMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsCreateMenuOpen(false)}></div>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button 
                    onClick={() => {
                      setIsCreateMenuOpen(false);
                      onUpload();
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-violet-600 flex items-center gap-3 transition-colors"
                  >
                    <FileText size={16} className="text-slate-400" />
                    <span>选择已有剧本</span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsCreateMenuOpen(false);
                      setIsNewProjectModalOpen(true);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-violet-600 flex items-center gap-3 transition-colors"
                  >
                    <FolderPlus size={16} className="text-slate-400" />
                    <span>新建空项目</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
            <Filter size={16} className="text-slate-400" /> 集号正序 <ChevronDown size={14} className="text-slate-400" />
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="参与者名称搜索" 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 w-64 transition-shadow" 
            />
          </div>
        </div>

        <div className="flex items-center gap-8 text-sm font-medium">
          <button className="text-violet-600 border-b-2 border-violet-500 pb-1">分集管理</button>
          <button className="text-slate-500 hover:text-slate-800 pb-1 transition-colors">角色管理</button>
          <button className="text-slate-500 hover:text-slate-800 pb-1 transition-colors">场景管理</button>
          <button className="text-slate-500 hover:text-slate-800 pb-1 transition-colors">道具管理</button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 pt-0 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {episodes.map((ep) => (
            <div 
              key={ep.id} 
              onClick={onEnterEpisode}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-violet-300 transition-all cursor-pointer group flex flex-col h-[380px]"
            >
              {/* Cover Image Area */}
              <div className="relative h-[220px] shrink-0 overflow-hidden bg-slate-900">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${ep.cover})` }}
                />
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
                
                {/* Top Right Actions */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 bg-black/40 hover:bg-black/60 rounded text-white backdrop-blur-sm transition-colors" onClick={(e) => e.stopPropagation()}>
                    <Edit size={14} />
                  </button>
                  <button className="p-1.5 bg-black/40 hover:bg-red-500/80 rounded text-white backdrop-blur-sm transition-colors" onClick={(e) => e.stopPropagation()}>
                    <Trash2 size={14} />
                  </button>
                </div>


              </div>

              {/* Info Area */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-slate-800 text-base">{ep.title}</h3>
                  <span className="text-xs text-slate-500 font-medium">{ep.epNumber}</span>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-auto">
                  {ep.tags.length > 0 ? (
                    ep.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] rounded-full border border-slate-200">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">暂无角色标签</span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-400">{ep.date}</span>
                  <span className="text-red-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> {ep.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsNewProjectModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-[480px] max-w-[90vw] z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">新增分集</h2>
              <button 
                onClick={() => setIsNewProjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>分集名称
                </label>
                <input 
                  type="text" 
                  placeholder="请输入分集名称" 
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>集号
                </label>
                <div className="relative">
                  <select className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-shadow appearance-none text-slate-500">
                    <option value="">请选择或输入集号(1-100)</option>
                    {[...Array(100)].map((_, i) => (
                      <option key={i+1} value={i+1}>第{i+1}集</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  封面图
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl h-48 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-violet-300 hover:text-violet-500 transition-colors cursor-pointer group">
                  <ImageIcon size={48} className="mb-3 opacity-50 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                  <span className="text-sm font-medium">点击上传封面图</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setIsNewProjectModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full text-sm font-medium transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setIsNewProjectModalOpen(false);
                  onEnterEpisode(); // Go straight to production for new empty project
                }}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-medium transition-colors shadow-sm"
              >
                新增
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
