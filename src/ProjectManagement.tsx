import React, { useState } from 'react';
import { Search, Clock, Edit, Trash2, User, Home, PlaySquare, Link2, Users, Bell, FileText, FolderPlus, X, Image as ImageIcon, ChevronDown, PenTool, BarChart2, ClipboardCheck } from 'lucide-react';

export default function ProjectManagement({ onCreateProject, onEnterProject }: { onCreateProject: () => void, onEnterProject: () => void }) {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [selectedOrientation, setSelectedOrientation] = useState<'16:9' | '9:16'>('16:9');
  const [selectedStyle, setSelectedStyle] = useState<string>('默认');

  const styles = [
    { id: '默认', name: '默认', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80' },
    { id: '日本动画片', name: '日本动画片', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&q=80' },
    { id: '吉卜力', name: '吉卜力', image: 'https://images.unsplash.com/photo-1580477667995-2b92f01c3f15?w=150&q=80' },
    { id: '漫画', name: '漫画', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80' },
    { id: '3D', name: '3D', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80' },
    { id: '皮克斯', name: '皮克斯', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&q=80' },
    { id: '黏土', name: '黏土', image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=150&q=80' },
    { id: '扁平插画', name: '扁平插画', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80' },
    { id: '童话手绘', name: '童话手绘', image: 'https://images.unsplash.com/photo-1580477667995-2b92f01c3f15?w=150&q=80' },
    { id: '赛博朋克', name: '赛博朋克', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80' },
    { id: '水墨画', name: '水墨画', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80' },
    { id: '油画', name: '油画', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&q=80' },
    { id: '水彩', name: '水彩', image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=150&q=80' },
    { id: '游戏CG', name: '游戏CG', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80' },
    { id: '中国风', name: '中国风', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&q=80' },
  ];

  // Mock data based on reference image
  const projects = [
    { 
      id: 1, 
      title: '开局小兵', 
      epCount: '55 集',
      cover: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=500&q=80', 
      stats: { img: 2599, vid: 0, del: 0, token: 3281163, time: '56d05h59m' }, 
      tags: ['尹子文', '彭伊琳', '何进鹏', '黄心宜', '徐舒如', '李浩菲', '鲜轩', '冯禧乐', '刘璇', '超级管理员', '鲁奕萱', '黄家轩', '谢灵岩'], 
      date: '2026-01-14 11:30', 
      status: '未完成' 
    },
    { 
      id: 2, 
      title: '提前登录三十天，我能无...', 
      epCount: '22 集',
      cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&q=80', 
      stats: { img: 3774, vid: 1671, del: 548, token: 906220, time: '62d06h35m' }, 
      tags: ['朱毅博', '杨翎', '杨钧雅', '吴佳琦', '杨钧雅', '杨翎', '鲁奕萱'], 
      date: '2026-01-16 14:15', 
      status: '未完成' 
    },
    { 
      id: 3, 
      title: '丧神来自恶人谷，罪犯们...', 
      epCount: '45 集',
      cover: 'https://images.unsplash.com/photo-1504333638930-c8787321efa0?w=500&q=80', 
      stats: { img: 5482, vid: 2963, del: 959, token: 1091122, time: '86d03h08m' }, 
      tags: ['超级管理员', '胡涵', '海一凡', '李浩菲', '罗婷蓉', '尹子文'], 
      date: '2026-01-12 19:42', 
      status: '未完成' 
    },
    { 
      id: 4, 
      title: '末世厨娘', 
      epCount: '67 集',
      cover: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=500&q=80', 
      stats: { img: 8810, vid: 5244, del: 532, token: 2572990, time: '90d23h48m' }, 
      tags: ['马子晏', '吴佳琦', '赵芳毅', '胡涵', '王婧瑶', '杨钧雅'], 
      date: '2025-12-02 19:56', 
      status: '未完成' 
    },
    { 
      id: 5, 
      title: '神魔战场清洁工', 
      epCount: '3 集',
      cover: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80', 
      stats: { img: 92, vid: 46, del: 0, token: 16193, time: '98d21h33m' }, 
      tags: ['超级管理员'], 
      date: '2025-12-02 19:56', 
      status: '未完成' 
    },
    { 
      id: 6, 
      title: '末日直播：只有我知道结局', 
      epCount: '24 集',
      cover: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=500&q=80', 
      stats: { img: 5841, vid: 2190, del: 353, token: 1086716, time: '134d07h06m' }, 
      tags: ['超级管理员'], 
      date: '2025-10-28 10:23', 
      status: '未完成' 
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F4F5F7] overflow-hidden relative">
      {/* Header */}
      <header className="h-16 bg-[#EBECEF] border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2 text-emerald-600 font-black text-xl italic tracking-tighter">
          <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center text-white text-sm">N</div>
          NGSHOW
        </div>
        
        {/* Center Nav */}
        <div className="flex items-center bg-[#333A3F] rounded-full p-1.5 gap-1">
          <div className="relative group">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
              <Home size={18} />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              首页
            </div>
          </div>
          <div className="relative group">
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-600 text-white shadow-sm">
              <PlaySquare size={18} />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              我的作品
            </div>
          </div>
          <div className="relative group">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
              <PenTool size={18} />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              艺术创作
            </div>
          </div>
          <div className="relative group">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
              <BarChart2 size={18} />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              数据面板
            </div>
          </div>
          <div className="relative group">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
              <ClipboardCheck size={18} />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              审阅中心
            </div>
          </div>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
            <User size={16} />
          </div>
          <div className="flex items-center gap-2 bg-[#23292E] px-3 py-1.5 rounded-full text-xs text-emerald-400 font-mono">
            <Link2 size={12} className="text-emerald-500" /> 5092
          </div>
          <div className="relative w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#EBECEF]">10</span>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="px-6 py-6 flex items-center gap-4 shrink-0">
        <div className="relative">
          <button 
            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
            className="px-6 py-2.5 bg-[#333A3F] hover:bg-slate-800 text-white rounded-full text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
          >
            项目创作
          </button>

          {/* Create Menu Dropdown */}
          {isCreateMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsCreateMenuOpen(false)}></div>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                <button 
                  onClick={() => {
                    setIsCreateMenuOpen(false);
                    onCreateProject();
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-3 transition-colors"
                >
                  <FileText size={16} className="text-slate-400" />
                  <span>从剧本出发</span>
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

        <div className="relative">
          <input 
            type="text" 
            placeholder="请输入剧本名称" 
            className="pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-64 transition-shadow shadow-sm" 
          />
          <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 pt-0 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
          {projects.map((ep) => (
            <div 
              key={ep.id} 
              onClick={onEnterProject}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col h-[420px]"
            >
              {/* Cover Image Area */}
              <div className="relative h-[240px] shrink-0 overflow-hidden bg-slate-900">
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

                {/* Stats */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 text-white">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold leading-none">{ep.stats.img}</span>
                    <span className="text-[10px] text-white/70">总生图</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold leading-none">{ep.stats.vid}</span>
                    <span className="text-[10px] text-white/70">总视频</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold leading-none">{ep.stats.del}</span>
                    <span className="text-[10px] text-white/70">总删除</span>
                  </div>
                  <div className="flex flex-col mt-2">
                    <span className="text-sm font-bold leading-none">{ep.stats.token}</span>
                    <span className="text-[10px] text-white/70">总消耗</span>
                  </div>
                </div>

                {/* Time & Clock Icon */}
                <div className="absolute bottom-3 left-4 flex flex-col text-white">
                  <span className="text-sm font-bold leading-none">{ep.stats.time}</span>
                  <span className="text-[10px] text-white/70">总耗时</span>
                </div>
                <div className="absolute bottom-3 right-3 text-emerald-400">
                  <Clock size={20} />
                </div>
              </div>

              {/* Info Area */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight">{ep.title}</h3>
                  <span className="text-xs text-slate-500 font-medium whitespace-nowrap">{ep.epCount}</span>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-auto overflow-hidden max-h-[60px]">
                  {ep.tags.length > 0 ? (
                    ep.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] rounded-full border border-slate-200 whitespace-nowrap">
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
          <div className="bg-white rounded-2xl shadow-xl w-[900px] max-w-[95vw] max-h-[90vh] flex flex-col z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 shrink-0">
              <h2 className="text-xl font-bold text-slate-800">新增剧本</h2>
              <button 
                onClick={() => setIsNewProjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-100"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="flex gap-12">
                {/* Left Column - Form */}
                <div className="w-[320px] shrink-0 flex flex-col gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <span className="text-red-500 mr-1">*</span>剧本名称
                    </label>
                    <input 
                      type="text" 
                      placeholder="请输入剧本名称" 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      制作人
                    </label>
                    <input 
                      type="text" 
                      placeholder="请输入制作人" 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      剧本封面
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl h-48 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-emerald-300 hover:text-emerald-500 transition-colors cursor-pointer group bg-slate-50/50">
                      <ImageIcon size={48} className="mb-3 opacity-40 group-hover:opacity-80 transition-opacity" strokeWidth={1.5} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      横屏/竖屏<span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setSelectedOrientation('16:9')}
                        className={`flex-1 h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${selectedOrientation === '16:9' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                      >
                        <div className={`w-8 h-5 border-2 rounded-sm ${selectedOrientation === '16:9' ? 'border-emerald-500' : 'border-slate-400'}`}></div>
                        <span className="text-sm font-medium">16:9</span>
                      </button>
                      <button 
                        onClick={() => setSelectedOrientation('9:16')}
                        className={`flex-1 h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${selectedOrientation === '9:16' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-300'}`}
                      >
                        <div className={`w-5 h-8 border-2 rounded-sm ${selectedOrientation === '9:16' ? 'border-emerald-500' : 'border-slate-400'}`}></div>
                        <span className="text-sm font-medium">9:16</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column - Styles */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    剧本风格<span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="grid grid-cols-5 gap-4">
                    {styles.map((style) => (
                      <div 
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`relative rounded-xl overflow-hidden cursor-pointer group aspect-square ${selectedStyle === style.id ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}
                      >
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url(${style.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                          <span className="text-white text-sm font-medium">{style.name}</span>
                        </div>
                        {selectedStyle === style.id && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-start gap-4 bg-white shrink-0">
              <button 
                onClick={() => setIsNewProjectModalOpen(false)}
                className="px-8 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full text-sm font-medium transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setIsNewProjectModalOpen(false);
                  onEnterProject(); // Go to episode management for the new project
                }}
                className="px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-medium transition-colors shadow-sm"
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
