import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  User,
  FileText,
  FolderPlus,
  X,
  Image as ImageIcon,
  Home,
  PlaySquare,
  PenTool,
  BarChart2,
  ClipboardCheck,
  Users,
  MapPin,
  Package,
} from 'lucide-react';

export default function EpisodeManagement({
  onUpload,
  onEnterEpisode,
  onBack,
  onGoHome,
  onGoScript,
  projectName,
  onProjectNameChange,
}: {
  onUpload: () => void;
  onEnterEpisode: (episodeName?: string) => void;
  onBack: () => void;
  onGoHome: () => void;
  onGoScript: () => void;
  projectName: string;
  onProjectNameChange: (name: string) => void;
}) {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isGlobalMenuOpen, setIsGlobalMenuOpen] = useState(false);
  const [isProjectEditOpen, setIsProjectEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'episode' | 'role' | 'scene' | 'prop'>('overview');
  const [projectMeta, setProjectMeta] = useState({
    name: projectName,
    style: '国风写实',
    aspectRatio: '9:16',
    summary: '复仇题材短剧，主线围绕婚变后的身份反转与情感对抗。',
    cover: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=500&q=80',
  });
  const [projectDraft, setProjectDraft] = useState(projectMeta);
  
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

  const roleAssets = [
    {
      id: 1,
      name: '若曦',
      subtitle: '女主角，清冷克制，现代职场穿搭',
      cover: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80',
      tags: ['女主', '都市', '职场'],
      usage: '已绑定 12 集',
      updatedAt: '2026-03-12 10:21',
    },
    {
      id: 2,
      name: '婉清',
      subtitle: '闺蜜角色，温柔亲和，浅色系服装',
      cover: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=500&q=80',
      tags: ['闺蜜', '现代', '辅助角色'],
      usage: '已绑定 8 集',
      updatedAt: '2026-03-11 18:42',
    },
    {
      id: 3,
      name: '顾沉舟',
      subtitle: '男主角，沉稳克制，深色正装',
      cover: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80',
      tags: ['男主', '商业', '冷峻'],
      usage: '已绑定 10 集',
      updatedAt: '2026-03-10 09:35',
    },
  ];

  const sceneAssets = [
    {
      id: 1,
      name: '顶层会议室',
      subtitle: '落地窗城市夜景，冷色照明，高对比',
      cover: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&q=80',
      tags: ['室内', '夜景', '商务'],
      usage: '已绑定 9 集',
      updatedAt: '2026-03-09 22:17',
    },
    {
      id: 2,
      name: '江边步道',
      subtitle: '黄昏逆光，微风，情绪对话场景',
      cover: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60d?w=500&q=80',
      tags: ['室外', '黄昏', '情绪戏'],
      usage: '已绑定 6 集',
      updatedAt: '2026-03-11 14:03',
    },
    {
      id: 3,
      name: '公寓客厅',
      subtitle: '暖光生活氛围，居家情节高频场景',
      cover: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=500&q=80',
      tags: ['室内', '生活流', '日常'],
      usage: '已绑定 11 集',
      updatedAt: '2026-03-12 08:56',
    },
  ];

  const propAssets = [
    {
      id: 1,
      name: '订婚戒指',
      subtitle: '银色戒托 + 小钻，关键剧情道具',
      cover: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&q=80',
      tags: ['饰品', '关键道具', '近景'],
      usage: '已绑定 7 集',
      updatedAt: '2026-03-08 20:11',
    },
    {
      id: 2,
      name: '录音笔',
      subtitle: '黑色磨砂外壳，信息反转道具',
      cover: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&q=80',
      tags: ['电子', '证据链', '剧情推进'],
      usage: '已绑定 5 集',
      updatedAt: '2026-03-07 16:27',
    },
    {
      id: 3,
      name: '项目合同',
      subtitle: 'A4纸质合同，签署镜头高频使用',
      cover: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&q=80',
      tags: ['文档', '商务', '特写'],
      usage: '已绑定 13 集',
      updatedAt: '2026-03-12 11:38',
    },
  ];

  const searchPlaceholder = activeTab === 'overview'
    ? '分集 / 角色 / 场景 / 道具搜索'
    : activeTab === 'episode'
    ? '参与者名称搜索'
    : activeTab === 'role'
      ? '角色名称搜索'
      : activeTab === 'scene'
        ? '场景名称搜索'
        : '道具名称搜索';

  const currentAssets = activeTab === 'role'
    ? roleAssets
    : activeTab === 'scene'
      ? sceneAssets
      : propAssets;

  const openProjectEdit = () => {
    setProjectDraft(projectMeta);
    setIsProjectEditOpen(true);
  };

  const handleProjectCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setProjectDraft((prev) => ({ ...prev, cover: previewUrl }));
  };

  const handleSaveProjectMeta = () => {
    setProjectMeta(projectDraft);
    onProjectNameChange(projectDraft.name);
    setIsProjectEditOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F3E8] overflow-hidden relative">
      <div className="pointer-events-none absolute -right-10 top-20 h-40 w-40 rounded-[42%_58%_51%_49%/62%_38%_62%_38%] bg-[#9fc79b]/35" />
      {/* Header */}
      <header className="h-16 bg-[#f0ebdd] border-b border-[#6da768]/30 flex items-center justify-between px-6 shrink-0">
        <div className="relative">
          <button
            onClick={() => setIsGlobalMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 text-[#2b5f43] font-black text-xl tracking-tight menu-title hover:opacity-90 transition-opacity"
            title="打开全局导航"
          >
            <div className="w-6 h-6 bg-[#6da768] rounded flex items-center justify-center text-[#193d2c] text-sm">C</div>
            COMIAI
          </button>

          {isGlobalMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsGlobalMenuOpen(false)}></div>
              <div className="absolute top-full left-0 mt-2 w-52 bg-[#fffdf6] rounded-2xl border border-[#6da768]/35 shadow-[0_10px_24px_rgba(25,61,44,0.12)] divide-y divide-[#6da768]/20 overflow-hidden z-50">
                <button
                  onClick={() => {
                    setIsGlobalMenuOpen(false);
                    onGoHome();
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-[#2b5f43] hover:bg-[#f5faee] transition-colors"
                >
                  首页
                </button>
                <button
                  onClick={() => {
                    setIsGlobalMenuOpen(false);
                    onGoScript();
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-[#2b5f43] hover:bg-[#f5faee] transition-colors"
                >
                  剧本
                </button>
                <button
                  onClick={() => {
                    setIsGlobalMenuOpen(false);
                    onBack();
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-[#193d2c] font-bold bg-[#f5faee] transition-colors"
                >
                  项目
                </button>
                <button
                  onClick={() => setIsGlobalMenuOpen(false)}
                  className="w-full text-left px-4 py-3 text-sm text-[#2b5f43]/60 hover:bg-[#f5faee] transition-colors"
                >
                  工具箱（即将上线）
                </button>
                <button
                  onClick={() => setIsGlobalMenuOpen(false)}
                  className="w-full text-left px-4 py-3 text-sm text-[#2b5f43]/60 hover:bg-[#f5faee] transition-colors"
                >
                  团队（即将上线）
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center bg-[#2b5f43] rounded-full p-1 gap-1 text-[11px] font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeTab === 'overview'
                ? 'bg-[#d8ec6a] text-[#193d2c] shadow-sm'
                : 'text-[#d7ead6] hover:text-white'
            }`}
          >
            总览
          </button>
          <button
            onClick={() => setActiveTab('episode')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeTab === 'episode'
                ? 'bg-[#d8ec6a] text-[#193d2c] shadow-sm'
                : 'text-[#d7ead6] hover:text-white'
            }`}
          >
            分集
          </button>
          <button
            onClick={() => setActiveTab('role')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeTab === 'role'
                ? 'bg-[#d8ec6a] text-[#193d2c] shadow-sm'
                : 'text-[#d7ead6] hover:text-white'
            }`}
          >
            角色
          </button>
          <button
            onClick={() => setActiveTab('scene')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeTab === 'scene'
                ? 'bg-[#d8ec6a] text-[#193d2c] shadow-sm'
                : 'text-[#d7ead6] hover:text-white'
            }`}
          >
            场景
          </button>
          <button
            onClick={() => setActiveTab('prop')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeTab === 'prop'
                ? 'bg-[#d8ec6a] text-[#193d2c] shadow-sm'
                : 'text-[#d7ead6] hover:text-white'
            }`}
          >
            道具
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#e9f2df] px-4 py-1.5 rounded-full text-xs text-[#2b5f43] font-mono border border-[#6da768]/45">
            5092
          </div>
          <div className="w-10 h-10 rounded-full bg-[#f3f8f3] flex items-center justify-center text-[#2b5f43] border-2 border-[#6da768]/45">
            <User size={18} />
          </div>
        </div>
      </header>

      <div className="px-6 py-3 border-b border-[#6da768]/25 bg-[#f6f1e6]">
        <div className="flex items-center justify-between gap-4">
          <div className="text-[#193d2c] text-base font-bold menu-title">{projectMeta.name}</div>
          <div />
        </div>
      </div>

      {/* Toolbar - only for 分集页 */}
      {activeTab === 'episode' && (
        <div className="px-6 py-4 flex items-center justify-between shrink-0 relative z-40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
                className="menu-title px-4 py-2 bg-[#193d2c] hover:bg-[#2b5f43] text-[#f5f1e4] rounded-lg text-sm transition-colors flex items-center gap-2 shadow-sm"
              >
                <Plus size={16} /> 创建分集
              </button>
              
              {/* Create Menu Dropdown */}
              {isCreateMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsCreateMenuOpen(false)}></div>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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

            <div className="flex items-center gap-2 bg-[#fbf8ef] border border-[#6da768]/40 rounded-lg px-3 py-2 text-sm text-[#2b5f43] cursor-pointer hover:bg-[#f5f1e4] transition-colors">
              <Filter size={16} className="text-[#2b5f43]/65" /> 集号正序 <ChevronDown size={14} className="text-[#2b5f43]/65" />
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2b5f43]/65" />
              <input 
                type="text" 
                placeholder={searchPlaceholder}
                className="pl-9 pr-4 py-2 bg-[#fbf8ef] border border-[#6da768]/40 rounded-lg text-sm focus:outline-none focus:border-[#6da768] focus:ring-1 focus:ring-[#6da768] w-64 transition-shadow" 
              />
            </div>
          </div>

          <div />
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 pt-0 custom-scrollbar relative z-10">
        {activeTab === 'overview' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <div className="xl:col-span-7 bg-[#fbf8ef] rounded-2xl border border-[#6da768]/35 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[30px] leading-none menu-title text-[#193d2c]">{projectMeta.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-[#f1f7e8] border border-[#6da768]/35 text-[#2b5f43]">{projectMeta.aspectRatio}</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-[#f1f7e8] border border-[#6da768]/35 text-[#2b5f43]">{projectMeta.style}</span>
                    </div>
                  </div>
                  <button
                    onClick={openProjectEdit}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#e9f2df] border border-[#6da768]/35 text-[#2b5f43] hover:bg-[#dff0cf] transition-colors"
                  >
                    编辑
                  </button>
                </div>
                <p className="text-sm text-[#2b5f43]/75 mt-4">{projectMeta.summary || '暂无项目梗概'}</p>
              </div>

              <div className="xl:col-span-2 bg-[#fbf8ef] rounded-2xl border border-[#6da768]/35 p-5 shadow-sm">
                <div className="text-sm font-bold text-[#193d2c]">剧本</div>
                <div className="h-[90px] flex flex-col items-center justify-center text-[#2b5f43]/75">
                  <FileText size={24} />
                  <div className="text-xs mt-2">{projectMeta.name}.txt</div>
                </div>
              </div>

              <div className="xl:col-span-3 bg-[#fbf8ef] rounded-2xl border border-[#6da768]/35 p-5 shadow-sm">
                <div className="text-sm font-bold text-[#193d2c]">项目预算</div>
                <div className="text-sm text-[#2b5f43]/80 mt-3 space-y-1.5">
                  <div>图片资产：{roleAssets.length + sceneAssets.length + propAssets.length}</div>
                  <div>视频资产：{episodes.length * 2}</div>
                  <div>已消耗积分：231</div>
                </div>
              </div>
            </div>

            <div className="text-[32px] leading-none menu-title text-[#193d2c]">步骤1：前期资产准备</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('role')}
                className="h-36 rounded-2xl border border-[#6da768]/35 bg-[linear-gradient(120deg,#f8f3e8,#f1f7e8)] p-5 text-left hover:border-[#6da768] transition-colors"
              >
                <div className="text-[36px] leading-none menu-title text-[#193d2c]">{roleAssets.length}</div>
                <div className="text-xl menu-title text-[#2b5f43] mt-2">角色</div>
              </button>
              <button
                onClick={() => setActiveTab('scene')}
                className="h-36 rounded-2xl border border-[#6da768]/35 bg-[linear-gradient(120deg,#f8f3e8,#e9f2df)] p-5 text-left hover:border-[#6da768] transition-colors"
              >
                <div className="text-[36px] leading-none menu-title text-[#193d2c]">{sceneAssets.length}</div>
                <div className="text-xl menu-title text-[#2b5f43] mt-2">场景</div>
              </button>
              <button
                onClick={() => setActiveTab('prop')}
                className="h-36 rounded-2xl border border-[#6da768]/35 bg-[linear-gradient(120deg,#f8f3e8,#eef6e4)] p-5 text-left hover:border-[#6da768] transition-colors"
              >
                <div className="text-[36px] leading-none menu-title text-[#193d2c]">{propAssets.length}</div>
                <div className="text-xl menu-title text-[#2b5f43] mt-2">道具</div>
              </button>
            </div>

            <div className="text-[32px] leading-none menu-title text-[#193d2c]">步骤2：剧集创作</div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => onEnterEpisode(ep.title)}
                  className="bg-[#fbf8ef] rounded-2xl border border-[#6da768]/35 p-3 text-left hover:border-[#6da768] transition-colors"
                >
                  <div className="h-36 rounded-xl overflow-hidden bg-slate-900 relative">
                    <div
                      className="absolute inset-0 bg-cover bg-center lifely-bg-photo"
                      style={{ backgroundImage: `url(${ep.cover})` }}
                    />
                  </div>
                  <div className="mt-3">
                    <div className="font-bold text-[#193d2c] text-base">{ep.title}</div>
                    <div className="text-xs text-[#2b5f43]/70 mt-1">创建于：{ep.date}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : activeTab === 'episode' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {episodes.map((ep) => (
              <div
                key={ep.id}
                onClick={() => onEnterEpisode(ep.title)}
                className="bg-[#fbf8ef] rounded-2xl border-2 border-[#193d2c]/15 overflow-hidden shadow-[6px_6px_0_rgba(25,61,44,0.16)] hover:shadow-[8px_8px_0_rgba(25,61,44,0.2)] hover:border-[#6da768]/70 transition-all cursor-pointer group flex flex-col h-[380px]"
              >
                <div className="relative h-[220px] shrink-0 overflow-hidden bg-slate-900">
                  <div
                    className="absolute inset-0 bg-cover bg-center lifely-bg-photo opacity-80 group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${ep.cover})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />

                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 bg-[#193d2c]/75 hover:bg-[#193d2c] rounded text-white backdrop-blur-sm transition-colors" onClick={(e) => e.stopPropagation()}>
                      <Edit size={14} />
                    </button>
                    <button className="p-1.5 bg-[#193d2c]/75 hover:bg-red-600/80 rounded text-white backdrop-blur-sm transition-colors" onClick={(e) => e.stopPropagation()}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-[#193d2c] text-base">{ep.title}</h3>
                    <span className="text-xs text-[#2b5f43]/80 font-medium">{ep.epNumber}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-auto">
                    {ep.tags.length > 0 ? (
                      ep.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[#e9f2df] text-[#2b5f43] text-[11px] rounded-full border border-[#6da768]/30">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">暂无角色标签</span>
                    )}
                  </div>

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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            <button className="bg-[#fbf8ef] rounded-2xl border-2 border-dashed border-[#6da768]/45 hover:border-[#6da768] hover:bg-[#f5faee] transition-colors h-[360px] flex flex-col items-center justify-center text-[#2b5f43]/70 hover:text-[#2b5f43]">
              <Plus size={28} className="mb-3" />
              <span className="text-sm font-bold">
                新增{activeTab === 'role' ? '角色' : activeTab === 'scene' ? '场景' : '道具'}资产
              </span>
              <span className="text-xs mt-1 opacity-70">上传图片并补充描述信息</span>
            </button>

            {currentAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-[#fbf8ef] rounded-2xl border-2 border-[#193d2c]/15 overflow-hidden shadow-[6px_6px_0_rgba(25,61,44,0.16)] hover:shadow-[8px_8px_0_rgba(25,61,44,0.2)] hover:border-[#6da768]/70 transition-all cursor-pointer group flex flex-col h-[360px]"
              >
                <div className="relative h-[210px] shrink-0 overflow-hidden bg-slate-900">
                  <div
                    className="absolute inset-0 bg-cover bg-center lifely-bg-photo opacity-85 group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${asset.cover})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/75" />

                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 bg-[#193d2c]/75 hover:bg-[#193d2c] rounded text-white backdrop-blur-sm transition-colors">
                      <Edit size={14} />
                    </button>
                    <button className="p-1.5 bg-[#193d2c]/75 hover:bg-red-600/80 rounded text-white backdrop-blur-sm transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="mb-2">
                    <h3 className="font-bold text-[#193d2c] text-base">{asset.name}</h3>
                    <p className="text-xs text-[#2b5f43]/75 mt-1 line-clamp-2">{asset.subtitle}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-auto">
                    {asset.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-[#e9f2df] text-[#2b5f43] text-[11px] rounded-full border border-[#6da768]/30">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#193d2c]/10 text-[11px]">
                    <span className="text-[#2b5f43]/65">{asset.updatedAt}</span>
                    <span className="text-[#2b5f43] font-semibold">{asset.usage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isProjectEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsProjectEditOpen(false)}></div>
          <div className="relative z-10 w-[920px] max-w-[95vw] max-h-[90vh] overflow-hidden rounded-2xl border-2 border-[#193d2c]/15 bg-[#fbf8ef] shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80">
              <h3 className="text-xl font-bold text-[#193d2c] menu-title">修改项目</h3>
              <button
                onClick={() => setIsProjectEditOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#193d2c] mb-2">项目名称</label>
                  <input
                    value={projectDraft.name}
                    onChange={(e) => setProjectDraft((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#6da768]/35 bg-white text-[#2b5f43] outline-none focus:border-[#6da768] focus:ring-2 focus:ring-[#6da768]/20"
                    placeholder="请输入项目名称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#193d2c] mb-2">全局风格</label>
                  <select
                    value={projectDraft.style}
                    onChange={(e) => setProjectDraft((prev) => ({ ...prev, style: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#6da768]/35 bg-white text-[#2b5f43] outline-none focus:border-[#6da768] focus:ring-2 focus:ring-[#6da768]/20"
                  >
                    <option value="国风写实">国风写实</option>
                    <option value="现代都市">现代都市</option>
                    <option value="电影质感">电影质感</option>
                    <option value="古风武侠">古风武侠</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#193d2c] mb-2">画面比例</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setProjectDraft((prev) => ({ ...prev, aspectRatio: '9:16' }))}
                      className={`py-2.5 rounded-xl border text-sm font-bold transition-colors ${
                        projectDraft.aspectRatio === '9:16'
                          ? 'bg-[#e9f2df] border-[#6da768] text-[#2b5f43]'
                          : 'bg-white border-[#6da768]/35 text-[#2b5f43]/75'
                      }`}
                    >
                      9:16 竖屏
                    </button>
                    <button
                      onClick={() => setProjectDraft((prev) => ({ ...prev, aspectRatio: '16:9' }))}
                      className={`py-2.5 rounded-xl border text-sm font-bold transition-colors ${
                        projectDraft.aspectRatio === '16:9'
                          ? 'bg-[#e9f2df] border-[#6da768] text-[#2b5f43]'
                          : 'bg-white border-[#6da768]/35 text-[#2b5f43]/75'
                      }`}
                    >
                      16:9 横屏
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#193d2c] mb-2">项目梗概</label>
                  <textarea
                    value={projectDraft.summary}
                    onChange={(e) => setProjectDraft((prev) => ({ ...prev, summary: e.target.value }))}
                    className="w-full min-h-[150px] px-3 py-2.5 rounded-xl border border-[#6da768]/35 bg-white text-[#2b5f43] outline-none focus:border-[#6da768] focus:ring-2 focus:ring-[#6da768]/20 resize-none"
                    placeholder="请输入项目梗概"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#193d2c] mb-2">项目封面</label>
                <div className="rounded-2xl border border-[#6da768]/35 bg-white p-3">
                  <div
                    className="w-full aspect-[9/12] rounded-xl bg-slate-100 bg-cover bg-center border border-slate-200"
                    style={{ backgroundImage: `url(${projectDraft.cover})` }}
                  />
                  <label className="mt-3 w-full inline-flex items-center justify-center px-3 py-2 rounded-xl border border-[#6da768]/35 bg-[#f8fbf3] text-[#2b5f43] text-sm font-bold hover:bg-[#eef6e4] transition-colors cursor-pointer">
                    上传封面
                    <input type="file" accept="image/*" className="hidden" onChange={handleProjectCoverUpload} />
                  </label>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200/80 bg-[#f6f1e6] flex items-center justify-end gap-3">
              <button
                onClick={() => setIsProjectEditOpen(false)}
                className="px-6 py-2.5 rounded-full border border-[#193d2c]/20 bg-white text-[#2b5f43] text-sm font-bold hover:bg-[#f5f1e4] transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveProjectMeta}
                className="px-6 py-2.5 rounded-full bg-[#193d2c] text-[#f5f1e4] text-sm font-bold hover:bg-[#2b5f43] transition-colors"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsNewProjectModalOpen(false)}></div>
          <div className="bg-[#fbf8ef] rounded-2xl shadow-xl w-[480px] max-w-[90vw] z-10 overflow-hidden animate-in zoom-in-95 duration-200 border-2 border-[#193d2c]/15">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#193d2c] menu-title">新增分集</h2>
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
                  className="w-full px-3 py-2.5 bg-[#fbf8ef] border border-[#6da768]/40 rounded-lg text-sm focus:outline-none focus:border-[#6da768] focus:ring-1 focus:ring-[#6da768] transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>集号
                </label>
                <div className="relative">
                  <select className="w-full px-3 py-2.5 bg-[#fbf8ef] border border-[#6da768]/40 rounded-lg text-sm focus:outline-none focus:border-[#6da768] focus:ring-1 focus:ring-[#6da768] transition-shadow appearance-none text-[#2b5f43]/75">
                    <option value="">请选择或输入集号(1-100)</option>
                    {[...Array(100)].map((_, i) => (
                      <option key={i+1} value={i+1}>第{i+1}集</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2b5f43]/65 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  封面图
                </label>
                <div className="border-2 border-dashed border-[#6da768]/40 rounded-xl h-48 flex flex-col items-center justify-center text-[#2b5f43]/60 hover:bg-[#e9f2df] hover:border-[#6da768] hover:text-[#2b5f43] transition-colors cursor-pointer group">
                  <ImageIcon size={48} className="mb-3 opacity-50 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                  <span className="text-sm font-medium">点击上传封面图</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-[#f5f1e4]">
              <button 
                onClick={() => setIsNewProjectModalOpen(false)}
                className="px-6 py-2.5 bg-[#fbf8ef] border border-[#193d2c]/20 hover:bg-[#f5f1e4] text-[#2b5f43] rounded-full text-sm font-medium transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setIsNewProjectModalOpen(false);
                  onEnterEpisode('第1集');
                }}
                className="px-6 py-2.5 bg-[#193d2c] hover:bg-[#2b5f43] text-[#f5f1e4] rounded-full text-sm font-medium transition-colors shadow-sm"
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
