import React, { useState } from 'react';
import { Search, Edit, Trash2, User, Home, PlaySquare, Users, FileText, FolderPlus, X, Image as ImageIcon, ChevronDown, PenTool, BarChart2, ClipboardCheck } from 'lucide-react';
import AccountCenter from './AccountCenter';

interface Props {
  onCreateProject: () => void;
  onEnterProject: () => void;
  onGoHome: () => void;
  username: string;
  credits: number;
  onLogout: () => void;
  onCreditsChange: (n: number) => void;
  onUsernameChange: (n: string) => void;
}

export default function ProjectManagement({ onCreateProject, onEnterProject, onGoHome, username, credits, onLogout, onCreditsChange, onUsernameChange }: Props) {
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
      title: '离婚后我成了顶流白月光', 
      epCount: '52 集',
      cover: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=500&q=80', 
      stats: { img: 2599, vid: 0, del: 0, token: 3281163, time: '56d05h59m' }, 
      tags: ['若曦', '婉清', '知夏', '念禾', '可歆', '予棠', '苏晚', '安宁'], 
      date: '2026-01-14 11:30', 
      status: '未完成' 
    },
    { 
      id: 2, 
      title: '被绿后我带娃爆红全网', 
      epCount: '36 集',
      cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&q=80', 
      stats: { img: 3774, vid: 1671, del: 548, token: 906220, time: '62d06h35m' }, 
      tags: ['语桐', '星冉', '初禾', '嘉宁', '芷晴', '晚意', '清妍'], 
      date: '2026-01-16 14:15', 
      status: '未完成' 
    },
    { 
      id: 3, 
      title: '重生后我手撕绿茶和渣男', 
      epCount: '44 集',
      cover: 'https://images.unsplash.com/photo-1504333638930-c8787321efa0?w=500&q=80', 
      stats: { img: 5482, vid: 2963, del: 959, token: 1091122, time: '86d03h08m' }, 
      tags: ['慕晚', '书瑶', '南栀', '以宁', '昭月', '予安'], 
      date: '2026-01-12 19:42', 
      status: '未完成' 
    },
    { 
      id: 4, 
      title: '误嫁豪门后，冷面总裁真香了', 
      epCount: '60 集',
      cover: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=500&q=80', 
      stats: { img: 8810, vid: 5244, del: 532, token: 2572990, time: '90d23h48m' }, 
      tags: ['婧妍', '清欢', '知意', '允棠', '书意', '若初'], 
      date: '2025-12-02 19:56', 
      status: '未完成' 
    },
    { 
      id: 5, 
      title: '恋综翻车后，我靠打脸逆袭', 
      epCount: '22 集',
      cover: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80', 
      stats: { img: 92, vid: 46, del: 0, token: 16193, time: '98d21h33m' }, 
      tags: ['可可', '念念', '芊羽', '时宜'], 
      date: '2025-12-02 19:56', 
      status: '未完成' 
    },
    { 
      id: 6, 
      title: 'ComiAI：全城都在等她复仇', 
      epCount: '28 集',
      cover: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=500&q=80', 
      stats: { img: 5841, vid: 2190, del: 353, token: 1086716, time: '134d07h06m' }, 
      tags: ['云舒', '槿年', '星眠', '若琳'], 
      date: '2025-10-28 10:23', 
      status: '未完成' 
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8F3E8] overflow-hidden relative">
      <div className="pointer-events-none absolute -left-10 top-24 h-44 w-44 rounded-[42%_58%_51%_49%/62%_38%_62%_38%] bg-[#9fc79b]/40" />
      <div className="pointer-events-none absolute right-8 bottom-10 h-28 w-28 rounded-[56%_44%_62%_38%/28%_68%_32%_72%] bg-[#d8ec6a]/50" />
      {/* Header */}
      <header className="h-16 bg-[#f0ebdd] border-b border-[#6da768]/30 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2 text-[#2b5f43] font-black text-xl tracking-tight menu-title">
          <div className="w-6 h-6 bg-[#6da768] rounded flex items-center justify-center text-[#193d2c] text-sm">C</div>
          COMIAI
        </div>
        
        {/* Center Nav */}
        <div className="flex items-center bg-[#193d2c] rounded-full p-1.5 gap-1 border border-[#6da768]/50">
          <button
            onClick={onGoHome}
            className="h-10 px-3 rounded-full flex items-center justify-center gap-1.5 text-[#d5e8d2] hover:text-white hover:bg-[#2b5f43] transition-colors text-xs font-bold"
          >
            <Home size={15} />
            首页
          </button>
          <button className="h-10 px-3 rounded-full flex items-center justify-center gap-1.5 bg-[#d8ec6a] text-[#193d2c] shadow-sm text-xs font-bold">
            <PlaySquare size={15} />
            我的项目
          </button>
          <div className="relative group">
            <button disabled className="h-10 px-3 rounded-full flex items-center justify-center gap-1.5 text-[#d5e8d2]/40 cursor-not-allowed text-xs font-bold">
              <PenTool size={15} />
              艺术创作
            </button>
            <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 bg-[#193d2c] text-[#d8ec6a] text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">开发中</span>
          </div>
          <div className="relative group">
            <button disabled className="h-10 px-3 rounded-full flex items-center justify-center gap-1.5 text-[#d5e8d2]/40 cursor-not-allowed text-xs font-bold">
              <BarChart2 size={15} />
              数据面板
            </button>
            <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 bg-[#193d2c] text-[#d8ec6a] text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">开发中</span>
          </div>
          <div className="relative group">
            <button disabled className="h-10 px-3 rounded-full flex items-center justify-center gap-1.5 text-[#d5e8d2]/40 cursor-not-allowed text-xs font-bold">
              <ClipboardCheck size={15} />
              审阅中心
            </button>
            <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 bg-[#193d2c] text-[#d8ec6a] text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">开发中</span>
          </div>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#e9f2df] px-4 py-1.5 rounded-full text-xs text-[#2b5f43] font-mono border border-[#6da768]/45">
            🪙 {credits.toLocaleString()}
          </div>
          <AccountCenter
            username={username}
            credits={credits}
            onLogout={onLogout}
            onCreditsChange={onCreditsChange}
            onUsernameChange={onUsernameChange}
          />
        </div>
      </header>

      {/* Toolbar */}
      <div className="px-6 py-6 flex items-center gap-4 shrink-0 relative z-40">
        <div className="relative">
          <button 
            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
            className="menu-title px-6 py-2.5 bg-[#193d2c] hover:bg-[#2b5f43] text-[#f5f1e4] rounded-full text-sm transition-colors shadow-sm flex items-center gap-2"
          >
            新建项目
          </button>

          {/* Create Menu Dropdown */}
          {isCreateMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsCreateMenuOpen(false)}></div>
              <div className="absolute top-full left-0 mt-2 w-56 bg-[#fffdf6] rounded-2xl border border-[#6da768]/35 shadow-[0_10px_24px_rgba(25,61,44,0.12)] divide-y divide-[#6da768]/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <button 
                  onClick={() => {
                    setIsCreateMenuOpen(false);
                    onCreateProject();
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-[#2b5f43] hover:bg-[#f5faee] flex items-center gap-3 transition-colors"
                >
                  <FileText size={16} className="text-[#2b5f43]/70" />
                  <span>从剧本出发</span>
                </button>
                <button 
                  onClick={() => {
                    setIsCreateMenuOpen(false);
                    setIsNewProjectModalOpen(true);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-[#2b5f43] hover:bg-[#f5faee] flex items-center gap-3 transition-colors"
                >
                  <FolderPlus size={16} className="text-[#2b5f43]/70" />
                  <span>新建空项目</span>
                </button>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <input 
            type="text" 
            placeholder="请输入项目名称" 
            className="pl-4 pr-10 py-2.5 bg-[#fbf8ef] border border-[#6da768]/40 rounded-full text-sm focus:outline-none focus:border-[#6da768] focus:ring-1 focus:ring-[#6da768] w-64 transition-shadow shadow-sm" 
          />
          <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 pt-0 custom-scrollbar relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
          {projects.map((ep) => (
            <div 
              key={ep.id} 
              onClick={onEnterProject}
              className="bg-[#fbf8ef] rounded-2xl border-2 border-[#193d2c]/15 overflow-hidden shadow-[6px_6px_0_rgba(25,61,44,0.17)] hover:shadow-[8px_8px_0_rgba(25,61,44,0.2)] hover:border-[#6da768]/70 transition-all cursor-pointer group flex flex-col h-[420px]"
            >
              {/* Cover Image Area */}
              <div className="relative h-[240px] shrink-0 overflow-hidden bg-slate-900">
                <div 
                  className="absolute inset-0 bg-cover bg-center lifely-bg-photo opacity-80 group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${ep.cover})` }}
                />
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
                
                {/* Top Right Actions */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 bg-[#193d2c]/75 hover:bg-[#193d2c] rounded text-white backdrop-blur-sm transition-colors" onClick={(e) => e.stopPropagation()}>
                    <Edit size={14} />
                  </button>
                  <button className="p-1.5 bg-[#193d2c]/75 hover:bg-red-600/80 rounded text-white backdrop-blur-sm transition-colors" onClick={(e) => e.stopPropagation()}>
                    <Trash2 size={14} />
                  </button>
                </div>


              </div>

              {/* Info Area */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="font-bold text-[#193d2c] text-sm line-clamp-2 leading-tight">{ep.title}</h3>
                  <span className="text-xs text-[#2b5f43]/80 font-medium whitespace-nowrap">{ep.epCount}</span>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-auto overflow-hidden max-h-[60px]">
                  {ep.tags.length > 0 ? (
                    ep.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-[#e9f2df] text-[#2b5f43] text-[11px] rounded-full border border-[#6da768]/30 whitespace-nowrap">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">暂无角色标签</span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#193d2c]/10 text-[11px]">
                  <span className="text-[#2b5f43]/65">{ep.date}</span>
                  <span className="text-[#2b5f43] flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6da768]"></span> {ep.status}
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
          <div className="bg-[#fbf8ef] rounded-2xl shadow-xl w-[900px] max-w-[95vw] max-h-[90vh] flex flex-col z-10 overflow-hidden animate-in zoom-in-95 duration-200 border-2 border-[#193d2c]/15">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 shrink-0">
              <h2 className="text-xl font-bold text-[#193d2c] menu-title">新增剧本</h2>
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
                      className="w-full px-4 py-3 bg-[#fbf8ef] border border-[#6da768]/40 rounded-xl text-sm focus:outline-none focus:border-[#6da768] focus:ring-1 focus:ring-[#6da768] transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      制作人
                    </label>
                    <input 
                      type="text" 
                      placeholder="请输入制作人" 
                      className="w-full px-4 py-3 bg-[#fbf8ef] border border-[#6da768]/40 rounded-xl text-sm focus:outline-none focus:border-[#6da768] focus:ring-1 focus:ring-[#6da768] transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      剧本封面
                    </label>
                    <div className="border-2 border-dashed border-[#6da768]/40 rounded-2xl h-48 flex flex-col items-center justify-center text-[#2b5f43]/60 hover:bg-[#e9f2df] hover:border-[#6da768] hover:text-[#2b5f43] transition-colors cursor-pointer group bg-[#f5f1e4]">
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
                        className={`flex-1 h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${selectedOrientation === '16:9' ? 'border-[#6da768] bg-[#e9f2df] text-[#2b5f43]' : 'border-[#193d2c]/15 bg-[#fbf8ef] text-[#2b5f43]/75 hover:border-[#193d2c]/30'}`}
                      >
                        <div className={`w-8 h-5 border-2 rounded-sm ${selectedOrientation === '16:9' ? 'border-[#6da768]' : 'border-[#2b5f43]/60'}`}></div>
                        <span className="text-sm font-medium">16:9</span>
                      </button>
                      <button 
                        onClick={() => setSelectedOrientation('9:16')}
                        className={`flex-1 h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${selectedOrientation === '9:16' ? 'border-[#6da768] bg-[#e9f2df] text-[#2b5f43]' : 'border-[#193d2c]/15 bg-[#f5f1e4] text-[#2b5f43]/75 hover:border-[#193d2c]/30'}`}
                      >
                        <div className={`w-5 h-8 border-2 rounded-sm ${selectedOrientation === '9:16' ? 'border-[#6da768]' : 'border-[#2b5f43]/60'}`}></div>
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
                        className={`relative rounded-xl overflow-hidden cursor-pointer group aspect-square ${selectedStyle === style.id ? 'ring-2 ring-[#6da768] ring-offset-2 ring-offset-[#fbf8ef]' : ''}`}
                      >
                        <div 
                          className="absolute inset-0 bg-cover bg-center lifely-bg-photo transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url(${style.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                          <span className="text-white text-sm font-medium">{style.name}</span>
                        </div>
                        {selectedStyle === style.id && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-[#6da768] rounded-full flex items-center justify-center border-2 border-white">
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
            <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-start gap-4 bg-[#fbf8ef] shrink-0">
              <button 
                onClick={() => setIsNewProjectModalOpen(false)}
                className="px-8 py-2.5 bg-[#fbf8ef] border border-[#193d2c]/20 hover:bg-[#f5f1e4] text-[#2b5f43] rounded-full text-sm font-medium transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setIsNewProjectModalOpen(false);
                  onEnterProject(); // Go to episode management for the new project
                }}
                className="px-8 py-2.5 bg-[#193d2c] hover:bg-[#2b5f43] text-[#f5f1e4] rounded-full text-sm font-medium transition-colors shadow-sm"
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
