import React, { useState } from 'react';
import { Search, Filter, Plus, Clock, ChevronDown, User, Link2, Bell, FileText, FolderPlus, X, Image as ImageIcon } from 'lucide-react';

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
      tags: ['尹子文', '黄心宜', '何进鹏'], 
      date: '2026-03-11 17:23', 
      status: '未完成' 
    },
    { 
      id: 2, 
      title: '第2集', 
      epNumber: '2 集',
      cover: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80', 
      stats: { img: 892, vid: 429, del: 73, token: 183773, time: '47d02h59m' }, 
      tags: ['尹子文', '黄心宜', '超级管理员'], 
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
      tags: ['尹子文', '冯禧乐', '徐舒如', '刘璇', '黄心宜'], 
      date: '2026-03-11 17:23', 
      status: '未完成' 
    },
    { 
      id: 5, 
      title: '第五集', 
      epNumber: '5 集',
      cover: 'https://images.unsplash.com/photo-1504333638930-c8787321efa0?w=500&q=80', 
      stats: { img: 552, vid: 398, del: 67, token: 133770, time: '0d00h00m' }, 
      tags: ['何进鹏', '尹子文', '鲜轩', '黄心宜', '彭伊琳'], 
      date: '2026-03-11 17:23', 
      status: '未完成' 
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F4F5F7] overflow-hidden relative">
      {/* Header */}
      <header className="h-16 bg-[#EBECEF] border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-emerald-600 font-black text-xl italic tracking-tighter hover:opacity-85 transition-opacity"
            title="返回剧本项目页"
          >
            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center text-white text-sm">N</div>
            NGSHOW
          </button>
          <div className="text-sm text-slate-500">我的作品 › 末日直播：只有我知道结局</div>
        </div>
        
        {/* Center Nav */}
        <div className="flex items-center bg-[#333A3F] rounded-full p-1.5 gap-1">
          <button className="h-8 px-3 rounded-full text-xs font-semibold bg-[#01cd74] text-white">分集管理</button>
          <button className="h-8 px-3 rounded-full text-xs font-medium text-slate-300 hover:text-white transition-colors">角色管理</button>
          <button className="h-8 px-3 rounded-full text-xs font-medium text-slate-300 hover:text-white transition-colors">场景管理</button>
          <button className="h-8 px-3 rounded-full text-xs font-medium text-slate-300 hover:text-white transition-colors">道具管理</button>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
            <User size={16} />
          </div>
          <div className="flex items-center gap-2 bg-[#23292E] px-3 py-1.5 rounded-full text-xs text-emerald-400 font-mono">
            <Link2 size={12} className="text-emerald-500" /> 24310
          </div>
          <div className="relative w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
            <Bell size={16} />
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="px-4 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              className="h-10 px-5 rounded-full text-sm font-semibold transition-colors ui-btn-dark opacity-100"
              style={{ backgroundColor: '#1c2329', color: '#fff' }}
            >
              创建分集
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
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-3 transition-colors"
                  >
                    <FileText size={16} className="text-slate-400" />
                    <span>选择已有剧本</span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsCreateMenuOpen(false);
                      setIsNewProjectModalOpen(true);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-3 transition-colors"
                  >
                    <FolderPlus size={16} className="text-slate-400" />
                    <span>新建空项目</span>
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="请输入参与者名字" 
              className="h-10 pl-4 pr-12 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-64 transition-shadow shadow-sm" 
            />
            <button
              type="button"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-slate-300 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center"
            >
              <Search size={16} />
            </button>
          </div>
        </div>

        <button className="h-10 px-4 rounded-full border border-slate-500 text-sm text-slate-700 bg-white hover:bg-slate-50 inline-flex items-center gap-2">
          <Filter size={16} />
          集号正序
          <ChevronDown size={14} className="text-slate-400" />
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {episodes.map((ep) => (
            <div 
              key={ep.id} 
              onClick={onEnterEpisode}
              className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col h-[338px]"
            >
              {/* Cover Image Area */}
              <div className="relative h-[218px] shrink-0 overflow-hidden bg-slate-900">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${ep.cover})` }}
                />
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />

                {/* Stats */}
                <div className="absolute top-2.5 left-2.5 w-[56px] rounded-lg bg-black/55 backdrop-blur-[1px] px-2 py-2 flex flex-col gap-1.5 text-white">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold leading-none">{ep.stats.img}</span>
                    <span className="text-[9px] text-white/80">总生图</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold leading-none">{ep.stats.vid}</span>
                    <span className="text-[9px] text-white/80">总视频</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold leading-none">{ep.stats.del}</span>
                    <span className="text-[9px] text-white/80">总删除</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold leading-none">{ep.stats.token}</span>
                    <span className="text-[9px] text-white/80">总消耗</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold leading-none">{ep.stats.time}</span>
                    <span className="text-[9px] text-white/80">总耗时</span>
                  </div>
                </div>
                <div className="absolute bottom-2.5 right-2.5 w-5 h-5 rounded-full bg-black/55 border border-emerald-400 text-emerald-400 flex items-center justify-center">
                  <Clock size={12} />
                </div>
              </div>

              {/* Info Area */}
              <div className="px-2.5 py-2 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-1.5 gap-2">
                  <h3 className="font-semibold text-slate-800 text-lg leading-none tracking-normal">{ep.title}</h3>
                  <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">末日直播：只有我知道结局　30集</span>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-auto max-h-[42px] overflow-hidden">
                  {ep.tags.length > 0 ? (
                    ep.tags.slice(0, 8).map((tag, idx) => (
                      <span key={idx} className={`px-1.5 py-0.5 text-[10px] rounded-full border whitespace-nowrap ${
                        idx === 0
                          ? 'bg-[#333A3F] text-white border-[#333A3F]'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">暂无角色标签</span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-slate-200 text-[10px]">
                  <span className="text-slate-400">{ep.date}</span>
                  <span className="text-red-500 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>{ep.status}
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
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>集号
                </label>
                <div className="relative">
                  <select className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow appearance-none text-slate-500">
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
                <div className="border-2 border-dashed border-slate-200 rounded-xl h-48 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-emerald-300 hover:text-emerald-500 transition-colors cursor-pointer group">
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
                className="px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm ui-btn-dark"
                style={{ backgroundColor: '#1c2329', color: '#fff' }}
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
