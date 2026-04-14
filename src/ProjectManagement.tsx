import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, User, Home, PlaySquare, Users, FileText, FolderPlus, X, Image as ImageIcon, ChevronDown, PenTool, BarChart2, ClipboardCheck } from 'lucide-react';
import AccountCenter from './AccountCenter';
import { projectsApi } from './api';

interface Props {
  onCreateProject: () => void;
  onEnterProject: (id: number, name: string) => void;
  onGoHome: () => void;
  username: string;
  credits: number;
  onLogout: () => void;
  onCreditsChange: (n: number) => void;
  onUsernameChange: (n: string) => void;
}

interface Project {
  id: number;
  name: string;
  description: string;
  cover: string;
  status: string;
  created_at: string;
  episode_count: number;
}

export default function ProjectManagement({ onCreateProject, onEnterProject, onGoHome, username, credits, onLogout, onCreditsChange, onUsernameChange }: Props) {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedOrientation, setSelectedOrientation] = useState<'16:9' | '9:16'>('16:9');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const styles: { id: string; name: string; image: string | null }[] = [
    { id: '',          name: '默认',  image: null },
    { id: 'realistic', name: '写实',  image: '/style-images/realistic.jpg' },
    { id: 'ghibli',    name: '吉卜力', image: '/style-images/ghibli.jpg' },
    { id: '3d',        name: '3D',   image: '/style-images/3d.jpg' },
    { id: 'pixar',     name: '皮克斯', image: '/style-images/pixar.jpg' },
  ];

  // 从后端加载项目列表
  useEffect(() => {
    setLoading(true);
    projectsApi.list()
      .then((list: any[]) => setProjects(list))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('确认删除该项目？删除后不可恢复')) return;
    try {
      await projectsApi.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('删除失败，请重试');
    }
  };

  const filteredProjects = projects.filter(p =>
    !searchText || p.name.toLowerCase().includes(searchText.toLowerCase())
  );

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
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="pl-4 pr-10 py-2.5 bg-[#fbf8ef] border border-[#6da768]/40 rounded-full text-sm focus:outline-none focus:border-[#6da768] focus:ring-1 focus:ring-[#6da768] w-64 transition-shadow shadow-sm"
          />
          <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 pt-0 custom-scrollbar relative z-10">
        {loading ? (
          /* 加载中 */
          <div className="flex items-center justify-center h-64 text-[#2b5f43]/50 text-sm">加载中…</div>
        ) : filteredProjects.length === 0 ? (
          /* 空状态 */
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#f0f7ec] border-2 border-dashed border-[#6da768]/40 flex items-center justify-center mb-4">
              <FolderPlus size={28} className="text-[#6da768]/60" />
            </div>
            <div className="text-[#193d2c] font-bold text-base mb-1">
              {searchText ? '没有找到匹配的项目' : '还没有项目'}
            </div>
            <p className="text-sm text-[#2b5f43]/60 mb-4">点击「新建项目」开始创作</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
            {filteredProjects.map((ep) => (
              <div
                key={ep.id}
                onClick={() => onEnterProject(ep.id, ep.name)}
                className="bg-[#fbf8ef] rounded-2xl border-2 border-[#193d2c]/15 overflow-hidden shadow-[6px_6px_0_rgba(25,61,44,0.17)] hover:shadow-[8px_8px_0_rgba(25,61,44,0.2)] hover:border-[#6da768]/70 transition-all cursor-pointer group flex flex-col h-[380px]"
              >
                {/* Cover */}
                <div className="relative h-[220px] shrink-0 overflow-hidden bg-[#1f3828]">
                  {ep.cover ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${ep.cover})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#6da768]/20">
                      <ImageIcon size={48} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/70" />

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1.5 bg-[#193d2c]/75 hover:bg-red-600/80 rounded text-white backdrop-blur-sm transition-colors"
                      onClick={(e) => handleDelete(e, ep.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="font-bold text-[#193d2c] text-sm line-clamp-2 leading-tight">{ep.name}</h3>
                    <span className="text-xs text-[#2b5f43]/70 font-medium whitespace-nowrap shrink-0">
                      {ep.episode_count > 0 ? `${ep.episode_count} 集` : '暂无分集'}
                    </span>
                  </div>

                  {ep.description ? (
                    <p className="text-xs text-[#2b5f43]/60 line-clamp-2 mb-auto">{ep.description}</p>
                  ) : (
                    <p className="text-xs text-slate-400 italic mb-auto">暂无简介</p>
                  )}

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#193d2c]/10 text-[11px]">
                    <span className="text-[#2b5f43]/60">
                      {ep.created_at ? new Date(ep.created_at).toLocaleDateString('zh-CN') : ''}
                    </span>
                    <span className="text-[#2b5f43] flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6da768]"></span>
                      {ep.status === 'active' ? '进行中' : ep.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
                      value={newProjectName}
                      onChange={e => setNewProjectName(e.target.value)}
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
                        {style.image === null ? (
                          /* 默认风格：空占位 */
                          <div className="absolute inset-0 border-2 border-dashed border-[#6da768]/50 rounded-xl bg-[#f5f1e4] flex flex-col items-center justify-center gap-2 group-hover:bg-[#e9f2df] group-hover:border-[#6da768] transition-colors">
                            <span className="text-2xl">📋</span>
                            <span className="text-sm font-medium text-[#2b5f43]">默认</span>
                          </div>
                        ) : (
                          <>
                            <div
                              className="absolute inset-0 bg-cover bg-center lifely-bg-photo transition-transform duration-500 group-hover:scale-110"
                              style={{ backgroundImage: `url(${style.image})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                              <span className="text-white text-sm font-medium">{style.name}</span>
                            </div>
                          </>
                        )}
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
                disabled={!newProjectName.trim()}
                onClick={async () => {
                  try {
                    const project = await projectsApi.create(newProjectName.trim());
                    setIsNewProjectModalOpen(false);
                    setNewProjectName('');
                    onEnterProject(project.id, project.name);
                  } catch {
                    alert('创建项目失败，请重试');
                  }
                }}
                className="px-8 py-2.5 bg-[#193d2c] hover:bg-[#2b5f43] text-[#f5f1e4] rounded-full text-sm font-medium transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
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
