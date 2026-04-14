import React, { useState, useEffect } from 'react';
import { projectsApi, uploadAsset } from './api';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  ChevronDown,
  FileText,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import AccountCenter from './AccountCenter';

export default function EpisodeManagement({
  projectId,
  onUpload,
  onEnterEpisode,
  onBack,
  onGoHome,
  onGoScript,
  onCreateFromScript,
  projectName,
  onProjectNameChange,
  scriptContent,
  username,
  credits,
  onLogout,
  onCreditsChange,
  onUsernameChange,
}: {
  projectId?: number;
  onUpload: () => void;
  onEnterEpisode: (episodeName?: string) => void;
  onBack: () => void;
  onGoHome: () => void;
  onGoScript: () => void;
  onCreateFromScript?: () => void;
  projectName: string;
  onProjectNameChange: (name: string) => void;
  scriptContent?: string;
  username: string;
  credits: number;
  onLogout: () => void;
  onCreditsChange: (n: number) => void;
  onUsernameChange: (n: string) => void;
}) {
  const [isNewEpisodeModalOpen, setIsNewEpisodeModalOpen] = useState(false);
  const [episodeDraft, setEpisodeDraft] = useState({ name: '', number: '', cover: '' });
  const [episodes, setEpisodes] = useState<{ id: number; title: string; number: string; cover: string; date: string }[]>([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [isGlobalMenuOpen, setIsGlobalMenuOpen] = useState(false);

  // 从后端加载分集列表
  useEffect(() => {
    if (!projectId) return;
    setEpisodesLoading(true);
    projectsApi.listEpisodes(projectId)
      .then((list: any[]) => {
        setEpisodes(list.map((ep) => ({
          id: ep.id,
          title: ep.name,
          number: String(ep.id),
          cover: ep.cover_url ?? '',
          date: ep.created_at ? new Date(ep.created_at).toLocaleDateString('zh-CN') : '',
        })));
      })
      .catch(() => {})
      .finally(() => setEpisodesLoading(false));
  }, [projectId]);
  const [isProjectEditOpen, setIsProjectEditOpen] = useState(false);
  const [projectMeta, setProjectMeta] = useState({
    name: projectName,
    style: '',
    aspectRatio: '',
    summary: '',
    cover: '',
  });
  const [projectDraft, setProjectDraft] = useState(projectMeta);

  // 资产 Modal 状态
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [assetModalCategory, setAssetModalCategory] = useState<'role' | 'scene' | 'prop'>('role');
  const [assetList, setAssetList] = useState<any[]>([]);
  const [assetLoading, setAssetLoading] = useState(false);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetDesc, setNewAssetDesc] = useState('');
  const [newAssetFile, setNewAssetFile] = useState<File | null>(null);
  const [newAssetPreview, setNewAssetPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [assetCounts, setAssetCounts] = useState<Record<string, number>>({ role: 0, scene: 0, prop: 0 });

  // 页面加载时拉全量资产计数
  useEffect(() => {
    if (!projectId) return;
    projectsApi.listAssets(projectId)
      .then((list: any[]) => {
        setAssetCounts({
          role:  list.filter(a => a.category === 'role').length,
          scene: list.filter(a => a.category === 'scene').length,
          prop:  list.filter(a => a.category === 'prop').length,
        });
      })
      .catch(() => {});
  }, [projectId]);

  const loadAssets = (category: string) => {
    if (!projectId) return;
    setAssetLoading(true);
    projectsApi.listAssets(projectId, category)
      .then(list => setAssetList(list))
      .catch(() => {})
      .finally(() => setAssetLoading(false));
  };

  const openAssetModal = (category: 'role' | 'scene' | 'prop') => {
    setAssetModalCategory(category);
    setAssetModalOpen(true);
    setAddFormOpen(false);
    loadAssets(category);
  };

  const handleAddAsset = async () => {
    if (!newAssetName.trim() || !projectId) return;
    setSubmitting(true);
    try {
      const asset = await uploadAsset(projectId, {
        name: newAssetName.trim(),
        category: assetModalCategory,
        description: newAssetDesc,
        imageFile: newAssetFile,
      });
      setAssetList(prev => [...prev, asset]);
      setAssetCounts(prev => ({ ...prev, [assetModalCategory]: (prev[assetModalCategory] ?? 0) + 1 }));
      setNewAssetName('');
      setNewAssetDesc('');
      setNewAssetFile(null);
      setNewAssetPreview('');
      setAddFormOpen(false);
    } catch {
      alert('添加失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryLabel: Record<'role' | 'scene' | 'prop', string> = { role: '角色', scene: '场景', prop: '道具' };

  const handleDeleteAsset = async (assetId: number) => {
    if (!projectId || !confirm('确认删除？')) return;
    try {
      await projectsApi.deleteAsset(projectId, assetId);
      const deleted = assetList.find(a => a.id === assetId);
      setAssetList(prev => prev.filter(a => a.id !== assetId));
      if (deleted) setAssetCounts(prev => ({ ...prev, [deleted.category]: Math.max(0, (prev[deleted.category] ?? 0) - 1) }));
    } catch {
      alert('删除失败');
    }
  };

  const handleDeleteEpisode = async (e: React.MouseEvent, episodeId: number) => {
    e.stopPropagation();
    if (!confirm('确认删除该分集？删除后不可恢复')) return;
    try {
      if (projectId) await projectsApi.deleteEpisode(projectId, episodeId);
      setEpisodes(prev => prev.filter(ep => ep.id !== episodeId));
    } catch {
      alert('删除失败，请重试');
    }
  };

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
        <div className="flex items-center gap-3">
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
          <span className="text-xs text-[#6da768] font-medium bg-[#e9f2df] px-2 py-0.5 rounded-full">总览</span>
        </div>

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

      <div className="px-6 py-3 border-b border-[#6da768]/25 bg-[#f6f1e6]">
        <div className="flex items-center justify-between gap-4">
          <div className="text-[#193d2c] text-base font-bold menu-title">{projectMeta.name}</div>
          <div />
        </div>
      </div>


      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 pt-0 custom-scrollbar relative z-10">
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
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-[#193d2c]">剧本</div>
                  {scriptContent
                    ? <button onClick={onCreateFromScript ?? onGoScript} className="text-[10px] text-[#6da768] hover:text-[#193d2c] font-bold">重新上传</button>
                    : <button onClick={onGoScript} className="text-[10px] text-[#6da768] hover:text-[#193d2c] font-bold underline">上传剧本</button>
                  }
                </div>
                {scriptContent ? (
                  <pre className="text-[10px] text-[#2b5f43]/70 leading-relaxed whitespace-pre-wrap line-clamp-4 font-sans h-[72px] overflow-hidden">
                    {scriptContent}
                  </pre>
                ) : (
                  <div className="h-[72px] flex flex-col items-center justify-center text-[#2b5f43]/40">
                    <FileText size={22} />
                    <div className="text-xs mt-1.5">暂未上传剧本</div>
                  </div>
                )}
              </div>

              <div className="xl:col-span-3 bg-[#fbf8ef] rounded-2xl border border-[#6da768]/35 p-5 shadow-sm">
                <div className="text-sm font-bold text-[#193d2c]">项目统计</div>
                <div className="text-sm text-[#2b5f43]/80 mt-3 space-y-1.5">
                  <div>图片资产：0</div>
                  <div>视频资产：0</div>
                  <div>已消耗积分：0</div>
                </div>
              </div>
            </div>

            <div className="text-[32px] leading-none menu-title text-[#193d2c]">步骤1：前期资产准备</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => openAssetModal('role')}
                className="h-36 rounded-2xl border border-[#6da768]/35 bg-[linear-gradient(120deg,#f8f3e8,#f1f7e8)] p-5 text-left hover:border-[#6da768] transition-colors"
              >
                <div className="text-[36px] leading-none menu-title text-[#193d2c]">{assetCounts.role}</div>
                <div className="text-xl menu-title text-[#2b5f43] mt-2">角色</div>
              </button>
              <button
                onClick={() => openAssetModal('scene')}
                className="h-36 rounded-2xl border border-[#6da768]/35 bg-[linear-gradient(120deg,#f8f3e8,#e9f2df)] p-5 text-left hover:border-[#6da768] transition-colors"
              >
                <div className="text-[36px] leading-none menu-title text-[#193d2c]">{assetCounts.scene}</div>
                <div className="text-xl menu-title text-[#2b5f43] mt-2">场景</div>
              </button>
              <button
                onClick={() => openAssetModal('prop')}
                className="h-36 rounded-2xl border border-[#6da768]/35 bg-[linear-gradient(120deg,#f8f3e8,#eef6e4)] p-5 text-left hover:border-[#6da768] transition-colors"
              >
                <div className="text-[36px] leading-none menu-title text-[#193d2c]">{assetCounts.prop}</div>
                <div className="text-xl menu-title text-[#2b5f43] mt-2">道具</div>
              </button>
            </div>

            <div className="text-[32px] leading-none menu-title text-[#193d2c]">步骤2：剧集创作</div>

            {episodes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#f0f7ec] border-2 border-dashed border-[#6da768]/40 flex items-center justify-center mb-4">
                  <Plus size={28} className="text-[#6da768]/60" />
                </div>
                <div className="text-[#193d2c] font-bold text-base mb-1">还没有分集</div>
                <div className="text-sm text-[#2b5f43]/60 mb-4">
                  {scriptContent ? '已有剧本，可从剧本创建分集，或手动创建' : '上传剧本后 AI 自动拆分，或手动创建分集'}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={scriptContent ? (onCreateFromScript ?? onGoScript) : onGoScript}
                    className="px-5 py-2.5 bg-[#193d2c] text-[#d8ec6a] rounded-xl text-sm font-bold hover:bg-[#2b5f43] transition-colors"
                  >
                    {scriptContent ? '从剧本创建' : '上传剧本'}
                  </button>
                  <button
                    onClick={() => { setEpisodeDraft({ name: '', number: '', cover: '' }); setIsNewEpisodeModalOpen(true); }}
                    className="px-5 py-2.5 bg-[#f0f7ec] text-[#2b5f43] border border-[#6da768]/40 rounded-xl text-sm font-bold hover:bg-[#e0f0d8] transition-colors"
                  >
                    手动创建
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* 新建分集卡 */}
                <div
                  onClick={() => { setEpisodeDraft({ name: '', number: '', cover: '' }); setIsNewEpisodeModalOpen(true); }}
                  className="relative h-40 rounded-2xl border-2 border-dashed border-[#6da768]/40 bg-[#f5faee] hover:border-[#6da768] hover:bg-[#eaf4e3] transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-[#2b5f43]/50 hover:text-[#2b5f43]"
                >
                  <Plus size={28} strokeWidth={1.5} />
                  <span className="text-xs font-medium">新建分集</span>
                </div>

                {episodes.map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => onEnterEpisode(ep.title)}
                    className="group relative bg-[#fbf8ef] rounded-2xl border-2 border-[#193d2c]/15 overflow-hidden shadow-[4px_4px_0_rgba(25,61,44,0.14)] hover:shadow-[6px_6px_0_rgba(25,61,44,0.2)] hover:border-[#6da768]/60 transition-all cursor-pointer"
                  >
                    <div className="relative h-40 overflow-hidden bg-[#e8f0e0]">
                      {ep.cover ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                          style={{ backgroundImage: `url(${ep.cover})` }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[#6da768]/30">
                          <ImageIcon size={36} strokeWidth={1.5} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 text-white font-bold text-base leading-tight drop-shadow">
                        {ep.title}
                      </div>
                      {/* 删除按钮 */}
                      <button
                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-600/80 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                        onClick={(e) => handleDeleteEpisode(e, ep.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
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

      {/* New Episode Modal */}
      {isNewEpisodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#193d2c]/60 backdrop-blur-sm" onClick={() => setIsNewEpisodeModalOpen(false)} />
          <div className="relative z-10 bg-[#fbf8ef] rounded-2xl shadow-2xl w-[480px] max-w-[90vw] overflow-hidden animate-in zoom-in-95 duration-200 border border-[#6da768]/30">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#6da768]/20">
              <h2 className="text-lg font-bold text-[#193d2c] menu-title">新增分集</h2>
              <button
                onClick={() => setIsNewEpisodeModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#2b5f43]/60 hover:text-[#193d2c] hover:bg-[#e9f2df] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              {/* 分集名称 */}
              <div>
                <label className="block text-sm font-bold text-[#193d2c] mb-2">
                  <span className="text-red-500 mr-1">*</span>分集名称
                </label>
                <input
                  type="text"
                  placeholder="请输入分集名称"
                  value={episodeDraft.name}
                  onChange={e => setEpisodeDraft(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-[#6da768]/40 rounded-xl text-sm text-[#193d2c] placeholder:text-[#2b5f43]/40 focus:outline-none focus:border-[#6da768] focus:ring-2 focus:ring-[#6da768]/20 transition-all"
                />
              </div>

              {/* 集号 */}
              <div>
                <label className="block text-sm font-bold text-[#193d2c] mb-2">
                  <span className="text-red-500 mr-1">*</span>集号
                </label>
                <div className="relative">
                  <select
                    value={episodeDraft.number}
                    onChange={e => setEpisodeDraft(prev => ({ ...prev, number: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-[#6da768]/40 rounded-xl text-sm focus:outline-none focus:border-[#6da768] focus:ring-2 focus:ring-[#6da768]/20 transition-all appearance-none text-[#2b5f43]"
                  >
                    <option value="">请选择或输入集号(1-100)</option>
                    {Array.from({ length: 100 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>第{i + 1}集</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2b5f43]/50 pointer-events-none" />
                </div>
              </div>

              {/* 封面图 */}
              <div>
                <label className="block text-sm font-bold text-[#193d2c] mb-2">封面图</label>
                <label className="block border-2 border-dashed border-[#6da768]/40 rounded-xl h-44 flex flex-col items-center justify-center text-[#2b5f43]/50 hover:bg-[#f0f7ec] hover:border-[#6da768] hover:text-[#2b5f43] transition-colors cursor-pointer group overflow-hidden relative">
                  {episodeDraft.cover ? (
                    <img src={episodeDraft.cover} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon size={40} className="mb-2 opacity-40 group-hover:opacity-70 transition-opacity" strokeWidth={1.5} />
                      <span className="text-sm font-medium">点击上传封面图</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) setEpisodeDraft(prev => ({ ...prev, cover: URL.createObjectURL(file) }));
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#6da768]/20 flex items-center justify-end gap-3 bg-[#f0ece0]">
              <button
                onClick={() => setIsNewEpisodeModalOpen(false)}
                className="px-6 py-2.5 bg-[#fbf8ef] border border-[#6da768]/30 hover:bg-[#f0f7ec] text-[#2b5f43] rounded-full text-sm font-bold transition-colors"
              >
                取消
              </button>
              <button
                disabled={!episodeDraft.name.trim() || !episodeDraft.number}
                onClick={async () => {
                  const title = episodeDraft.name.trim() || `第${episodeDraft.number}集`;
                  if (projectId) {
                    try {
                      const created = await projectsApi.createEpisode(projectId, title);
                      setEpisodes(prev => [
                        ...prev,
                        {
                          id: created.id,
                          title: created.name ?? title,
                          number: episodeDraft.number,
                          cover: episodeDraft.cover,
                          date: new Date().toLocaleDateString('zh-CN'),
                        },
                      ]);
                    } catch {
                      // 离线 fallback：仅本地存
                      setEpisodes(prev => [
                        ...prev,
                        { id: Date.now(), title, number: episodeDraft.number, cover: episodeDraft.cover, date: new Date().toLocaleDateString('zh-CN') },
                      ]);
                    }
                  } else {
                    setEpisodes(prev => [
                      ...prev,
                      { id: Date.now(), title, number: episodeDraft.number, cover: episodeDraft.cover, date: new Date().toLocaleDateString('zh-CN') },
                    ]);
                  }
                  setIsNewEpisodeModalOpen(false);
                  setEpisodeDraft({ name: '', number: '', cover: '' });
                }}
                className="px-6 py-2.5 bg-[#193d2c] hover:bg-[#2b5f43] text-[#d8ec6a] rounded-full text-sm font-bold transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                新增
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Modal */}
      {assetModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setAssetModalOpen(false)} />
          <div className="relative z-10 w-[480px] h-full bg-[#fbf8ef] border-l border-[#6da768]/30 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#6da768]/20 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-[#193d2c] menu-title">
                  {categoryLabel[assetModalCategory]}资产
                </h2>
                <p className="text-xs text-[#2b5f43]/60 mt-0.5">名称将作为 @标签 在分镜 Prompt 中引用</p>
              </div>
              <button onClick={() => setAssetModalOpen(false)} className="p-2 rounded-full hover:bg-[#e9f2df] transition-colors text-[#2b5f43]/60">
                <X size={18} />
              </button>
            </div>

            {/* Asset list */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {assetLoading ? (
                <div className="text-center text-[#2b5f43]/50 text-sm py-8">加载中…</div>
              ) : assetList.length === 0 && !addFormOpen ? (
                <div className="text-center text-[#2b5f43]/40 text-sm py-12">
                  <div className="text-3xl mb-3">📂</div>
                  <div>还没有{({ role: '角色', scene: '场景', prop: '道具' } as const)[assetModalCategory]}，点击下方添加</div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {assetList.map((asset) => (
                    <div key={asset.id} className="group relative bg-white rounded-2xl border border-[#6da768]/25 overflow-hidden shadow-sm">
                      <div className="h-32 bg-[#e8f0e0] relative overflow-hidden">
                        {asset.image_url ? (
                          <img src={asset.image_url} className="w-full h-full object-cover" alt={asset.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#6da768]/30">
                            <ImageIcon size={28} strokeWidth={1.5} />
                          </div>
                        )}
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-600/80 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="px-3 py-2">
                        <div className="font-semibold text-[#193d2c] text-sm">@{asset.name}</div>
                        {asset.description && <div className="text-xs text-[#2b5f43]/60 mt-0.5 line-clamp-1">{asset.description}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add form */}
              {addFormOpen && (
                <div className="mt-4 bg-[#f5f1e4] rounded-2xl border border-[#6da768]/30 p-4 flex flex-col gap-3">
                  <div className="text-sm font-bold text-[#193d2c]">添加新资产</div>
                  <div>
                    <label className="text-xs text-[#2b5f43]/70 mb-1 block">名称 *</label>
                    <input
                      value={newAssetName}
                      onChange={e => setNewAssetName(e.target.value)}
                      placeholder="如：若曦、客厅场景..."
                      className="w-full px-3 py-2 rounded-xl border border-[#6da768]/40 text-sm focus:outline-none focus:border-[#6da768] bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#2b5f43]/70 mb-1 block">图片</label>
                    <label className="block border-2 border-dashed border-[#6da768]/40 rounded-xl overflow-hidden cursor-pointer hover:border-[#6da768] transition-colors">
                      {newAssetPreview ? (
                        <img src={newAssetPreview} className="w-full h-32 object-cover" />
                      ) : (
                        <div className="h-28 flex flex-col items-center justify-center text-[#2b5f43]/40 hover:text-[#2b5f43]/70">
                          <ImageIcon size={24} strokeWidth={1.5} className="mb-1" />
                          <span className="text-xs">点击上传图片</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={e => {
                        const f = e.target.files?.[0];
                        if (f) { setNewAssetFile(f); setNewAssetPreview(URL.createObjectURL(f)); }
                      }} />
                    </label>
                  </div>
                  <div>
                    <label className="text-xs text-[#2b5f43]/70 mb-1 block">描述（可选）</label>
                    <textarea
                      value={newAssetDesc}
                      onChange={e => setNewAssetDesc(e.target.value)}
                      placeholder="外形特征、场景描述等..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl border border-[#6da768]/40 text-sm focus:outline-none focus:border-[#6da768] bg-white resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setAddFormOpen(false)} className="flex-1 py-2 rounded-full border border-[#6da768]/30 text-[#2b5f43] text-sm hover:bg-[#e9f2df] transition-colors">取消</button>
                    <button
                      onClick={handleAddAsset}
                      disabled={!newAssetName.trim() || submitting}
                      className="flex-1 py-2 rounded-full bg-[#193d2c] text-[#d8ec6a] text-sm font-bold hover:bg-[#2b5f43] transition-colors disabled:opacity-40"
                    >
                      {submitting ? '保存中…' : '保存'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {!addFormOpen && (
              <div className="px-4 py-4 border-t border-[#6da768]/20 shrink-0">
                <button
                  onClick={() => setAddFormOpen(true)}
                  className="w-full py-2.5 rounded-full border-2 border-dashed border-[#6da768]/50 text-[#2b5f43] text-sm font-medium hover:border-[#6da768] hover:bg-[#f0f7ec] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> 添加{({ role: '角色', scene: '场景', prop: '道具' } as const)[assetModalCategory]}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
