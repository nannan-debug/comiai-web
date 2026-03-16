import React, { useEffect, useState } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, MessageSquare, 
  Share2, CheckCircle2, Clock, ChevronRight, ChevronLeft,
  Pencil, MousePointer2, Type, Eraser, Layers, MoreHorizontal,
  Upload, History, Settings, User, ChevronDown, Plus, Eye,
  AlertCircle, Check, Scissors, Volume2, FastForward, Download,
  Filter, CheckSquare, Trash2, Film, CheckCircle, RefreshCcw, Send,
  Target, List, Image as ImageIcon, RotateCcw, Square, MoveUpRight, X,
  ExternalLink
} from 'lucide-react';

type PreviewDraftState = 'clean' | 'draft';

export default function VideoPreview({
  onDraftStateChange,
}: {
  onDraftStateChange?: (state: PreviewDraftState) => void;
}) {
  // 页面状态控制：'edit' (粗剪) | 'review' (审阅)
  const [pageMode, setPageMode] = useState('edit'); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(45);
  const [duration] = useState(300); 
  
  // 资源池状态
  const [activeSb, setActiveSb] = useState(1); 
  const [assetType, setAssetType] = useState('全部'); 
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [isFixedOnly, setIsFixedOnly] = useState(false);

  // 版本与同步
  const [activeVersion, setActiveVersion] = useState('v2');
  const [showVersionMenu, setShowVersionMenu] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 提交审阅状态
  const [previewAdjustment, setPreviewAdjustment] = useState('保留当前镜头节奏，优先检查角色情绪与转场流畅度。');
  const [draftState, setDraftState] = useState<PreviewDraftState>('clean');
  const [isAssetsCollapsed, setIsAssetsCollapsed] = useState(false);
  const [isReviewCollapsed, setIsReviewCollapsed] = useState(false);

  // 1. 全局素材库
  const assetLibrary = [
    { id: 'v1', sbId: 1, name: '电视塔_全景.mp4', type: '视频', duration: '00:09', isFixed: true, thumb: 'bg-orange-100' },
    { id: 'v2', sbId: 1, name: '电视塔_特写.mp4', type: '视频', duration: '00:04', isFixed: false, thumb: 'bg-orange-50' },
    { id: 'p1', sbId: 1, name: '背景草稿.jpg', type: '图片', duration: '--', isFixed: true, thumb: 'bg-slate-200' },
    { id: 'v3', sbId: 2, name: '主角_特写_祈祷.mp4', type: '视频', duration: '00:05', isFixed: true, thumb: 'bg-emerald-100' },
    { id: 'v4', sbId: 3, name: '废墟_全景.mp4', type: '视频', duration: '00:06', isFixed: true, thumb: 'bg-blue-100' },
    { id: 'p2', sbId: 3, name: '概念图.jpg', type: '图片', duration: '--', isFixed: false, thumb: 'bg-slate-300' },
  ];

  // 2. 版本快照数据
  const [versionData, setVersionData] = useState({
    v1: {
      tracks: [
        { id: 'clip_1', assetId: 'v1', label: '电视塔_全景.mp4', duration: '3.0s', thumb: 'bg-orange-100' },
        { id: 'clip_2', assetId: 'v3', label: '主角_特写_祈祷.mp4', duration: '5.2s', thumb: 'bg-emerald-100' },
      ],
      comments: [
        { id: 101, time: 24, author: '编导-张三', text: 'V1：这里建议加个特写转场。', status: 'resolved', hasAnnotation: false },
      ]
    },
    v2: {
      tracks: [
        { id: 'clip_3', assetId: 'v4', label: '废墟_全景.mp4', duration: '4.0s', thumb: 'bg-blue-100' },
        { id: 'clip_4', assetId: 'v3', label: '主角_特写_祈祷.mp4', duration: '5.2s', thumb: 'bg-emerald-100' },
        { id: 'clip_5', assetId: 'v1', label: '电视塔_全景.mp4', duration: '3.5s', thumb: 'bg-orange-100' },
      ],
      comments: [
        { id: 102, time: 45, author: '编导-张三', text: '此处表情过于夸张，建议微调。', status: 'pending', hasAnnotation: true },
        { id: 103, time: 142, author: '监制-李四', text: '加入一张背景参考图。', status: 'pending', hasAnnotation: false, attachment: 'bg-slate-200' },
      ]
    }
  });

  const currentVersion = versionData[activeVersion as keyof typeof versionData];
  
  const filteredAssets = assetLibrary.filter(asset => {
    if (asset.sbId !== activeSb) return false;
    if (assetType !== '全部' && asset.type !== assetType) return false;
    if (isFixedOnly && !asset.isFixed) return false;
    return true;
  });

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    setIsPlaying(false);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1500);
  };

  const handleSubmitReview = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setPageMode('review');
    }, 2000);
  };

  useEffect(() => {
    onDraftStateChange?.(draftState);
  }, [draftState, onDraftStateChange]);

  const handlePreviewAdjustmentChange = (value: string) => {
    setPreviewAdjustment(value);
    if (draftState !== 'draft') {
      setDraftState('draft');
    }
  };

  const handleApplyDraft = () => {
    setDraftState('clean');
  };

  return (
    <>
      {/* 2. 主内容区 */}
      <div className="flex-1 flex overflow-hidden p-3 gap-3 pb-0">
        
        {/* 左侧：资产池 (白色主题) */}
        <aside className={`bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden transition-all duration-300 ${pageMode === 'edit' ? (isAssetsCollapsed ? 'w-14 opacity-100' : 'w-72 opacity-100') : 'w-0 opacity-0 invisible'}`}>
          <div className="p-4 border-b border-slate-100 bg-slate-50/40 flex items-center justify-between shrink-0">
            {!isAssetsCollapsed && <span className="font-bold text-base text-slate-700">剧集资产</span>}
            <button
              onClick={() => setIsAssetsCollapsed((prev) => !prev)}
              className="ml-auto rounded-xl p-2 text-slate-400 transition-colors hover:bg-white hover:text-emerald-600"
              title={isAssetsCollapsed ? '展开剧集资产' : '收起剧集资产'}
            >
              <List size={18} />
            </button>
          </div>
          {isAssetsCollapsed ? (
            <div className="flex flex-1 flex-col items-center gap-3 py-4">
              {[1, 2, 3, 4, 5, 6].map((id) => (
                <button
                  key={id}
                  onClick={() => setActiveSb(id)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-[11px] font-bold transition-all ${activeSb === id ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'}`}
                >
                  {id}
                </button>
              ))}
            </div>
          ) : (
            <>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <button onClick={() => setShowTypeMenu(!showTypeMenu)} className="w-full flex items-center justify-between bg-slate-50 text-slate-600 px-3 py-1.5 rounded-xl text-xs border border-slate-200">
                  {assetType} <ChevronDown size={14} className={showTypeMenu ? 'rotate-180 transition-all' : ''}/>
                </button>
                {showTypeMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-[70] overflow-hidden">
                    {['全部', '图片', '视频'].map(t => (
                      <button key={t} onClick={() => {setAssetType(t); setShowTypeMenu(false);}} className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 ${assetType === t ? 'text-emerald-600 font-bold bg-emerald-50' : 'text-slate-500'}`}>{t}</button>
                    ))}
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <div onClick={() => setIsFixedOnly(!isFixedOnly)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isFixedOnly ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                  {isFixedOnly && <Check size={12} className="text-white font-bold" />}
                </div>
                <span className="text-[11px] font-bold text-slate-500">已定稿</span>
              </label>
            </div>

            <div className="flex gap-4 overflow-x-auto hide-scrollbar border-b border-slate-100 pb-1 text-[11px] font-bold text-slate-400">
              {[1, 2, 3, 4, 5, 6].map(id => (
                <button 
                  key={id} 
                  onClick={() => setActiveSb(id)}
                  className={`whitespace-nowrap pb-2 border-b-2 transition-all ${activeSb === id ? 'text-emerald-500 border-emerald-500' : 'border-transparent hover:text-slate-600'}`}
                >
                  分镜 {id}
                </button>
              ))}
              <button className="text-slate-400 pb-2"><MoreHorizontal size={14}/></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 content-start bg-slate-50/30">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="group relative bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer">
                <div className={`aspect-[9/16] w-full ${asset.thumb} opacity-80 flex items-center justify-center relative`}>
                  {asset.isFixed && <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold shadow-sm">已定稿</span>}
                  {asset.type === '视频' && <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[9px] px-1.5 rounded font-mono font-bold">{asset.duration}</span>}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                    <button className="bg-white p-2 rounded-full text-emerald-500 shadow-xl hover:scale-110 active:scale-95 transition-transform"><Plus size={18}/></button>
                  </div>
                </div>
                <div className="p-2 text-[10px] text-slate-500 font-bold truncate">{asset.name}</div>
              </div>
            ))}
          </div>
            </>
          )}
        </aside>

        {/* 中间：播放器区域 */}
        <main className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
          <div className="h-10 border-b border-slate-100 flex items-center justify-between px-4 bg-slate-50/30">
            <div className="flex bg-slate-200/50 rounded-xl p-0.5 shadow-inner">
              <button onClick={() => setPageMode('edit')} className={`px-5 py-1 rounded-lg text-[11px] font-bold transition-all ${pageMode === 'edit' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}>🚧 粗剪模式</button>
              <button onClick={() => setPageMode('review')} className={`px-5 py-1 rounded-lg text-[11px] font-bold transition-all ${pageMode === 'review' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>🎬 审阅模式</button>
            </div>
            <div className="flex items-center gap-3">
              <input
                value={previewAdjustment}
                onChange={(e) => handlePreviewAdjustmentChange(e.target.value)}
                className="hidden w-64 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-600 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400 md:block"
                placeholder="补充一句当前预览调整说明"
              />
              <button
                onClick={handleApplyDraft}
                disabled={draftState === 'clean'}
                className={`rounded-xl px-3 py-1.5 text-[11px] font-bold transition-colors ${draftState === 'draft' ? 'bg-emerald-500 text-white shadow-sm hover:bg-emerald-600' : 'cursor-not-allowed bg-slate-200 text-slate-400'}`}
              >
                应用到当前版本
              </button>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-100 uppercase tracking-widest">
                {activeVersion} 版本状态：{pageMode === 'edit' ? '正在粗剪' : '审阅进行中'}
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8 bg-[#EBEEF2] relative">
            <div className="relative w-[300px] h-[533px] bg-black rounded-3xl shadow-2xl overflow-hidden group border-[6px] border-white">
               {pageMode === 'review' && Math.abs(currentTime - 45) < 3 && (
                 <div className="absolute inset-0 z-20 pointer-events-none">
                    <div className="absolute top-[20%] left-[20%] w-24 h-24 text-red-500">
                       <MoveUpRight size={64} className="rotate-180 drop-shadow-lg" />
                       <div className="absolute top-16 left-16 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold whitespace-nowrap">此处表情需修改</div>
                    </div>
                 </div>
               )}
               <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white/5 font-black text-6xl select-none uppercase tracking-tighter">
                 {activeVersion}
               </div>
            </div>
          </div>

          <div className="h-12 border-t border-slate-100 flex items-center justify-between px-6 bg-white shrink-0">
            <div className="text-[10px] font-mono text-slate-400 font-bold">{formatTime(currentTime)} / {formatTime(duration)}</div>
            <div className="flex items-center gap-6">
              <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                {isPlaying ? <Pause size={18}/> : <Play size={18} className="ml-0.5"/>}
              </button>
            </div>
            <div className="flex gap-4">
              <button className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors"><Volume2 size={16}/></button>
              <button className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors"><Share2 size={16}/></button>
            </div>
          </div>
        </main>

        {/* 右侧：审阅面板 */}
        <aside className={`bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden transition-all duration-300 ${isReviewCollapsed ? 'w-14' : 'w-72'}`}>
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center text-slate-700">
            {!isReviewCollapsed && (
              <>
                <h3 className="font-bold flex items-center gap-2"><MessageSquare size={16} className="text-emerald-500" /> 审阅反馈</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-bold">{currentVersion.comments.length}</span>
              </>
            )}
            <button
              onClick={() => setIsReviewCollapsed((prev) => !prev)}
              className="ml-auto rounded-xl p-2 text-slate-400 transition-colors hover:bg-white hover:text-emerald-600"
              title={isReviewCollapsed ? '展开审阅反馈' : '收起审阅反馈'}
            >
              <MessageSquare size={18} />
            </button>
          </div>
          {isReviewCollapsed ? (
            <div className="flex flex-1 flex-col items-center gap-3 py-4">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600">{currentVersion.comments.length}</span>
            </div>
          ) : (
            <>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/30">
            {currentVersion.comments.map(c => (
              <div 
                key={c.id} 
                onClick={() => handleSeek(c.time)}
                className={`p-3 bg-white border rounded-xl transition-all cursor-pointer shadow-sm hover:border-emerald-300 ${Math.abs(currentTime - c.time) < 2 ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/10' : 'border-slate-100'}`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-700">{c.author}</span>
                    <span className="text-[10px] text-emerald-500 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                       {formatTime(c.time)}
                       {c.hasAnnotation && <Pencil size={10} className="text-emerald-600 animate-pulse"/>}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 italic">来自 V1</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{c.text}</p>
                {c.attachment && <div className={`mt-2 h-16 w-full rounded-lg ${c.attachment} border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400`}>图片附件</div>}
              </div>
            ))}
          </div>

          {/* 批注工具与评论输入 */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col gap-2">
             <div className="relative group">
               <textarea 
                 placeholder="在审阅模式下输入建议..." 
                 disabled={pageMode === 'edit'}
                 className={`w-full p-3 pr-20 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none bg-white shadow-inner transition-all ${pageMode === 'edit' ? 'bg-slate-50 cursor-not-allowed opacity-60' : ''}`}
                 rows="3"
               ></textarea>
               <div className="absolute right-2 bottom-2 flex items-center gap-1">
                 <button className="p-1.5 text-slate-400 hover:text-emerald-500"><ImageIcon size={16}/></button>
                 <button className="ml-1 bg-slate-800 text-white p-2 rounded-lg shadow-md hover:bg-slate-900 transition-all"><Send size={14}/></button>
               </div>
             </div>
          </div>
            </>
          )}
        </aside>
      </div>

      {/* 3. 底部时间轴区 */}
      <footer className="h-44 bg-white border-t border-slate-200 flex flex-col shrink-0 p-3 pt-0 z-10 shadow-inner">
        <div className="h-12 flex items-center justify-between px-2">
           <div className="flex items-center gap-4">
             {/* 版本快照切换 */}
             <div className="relative group">
               <button onClick={() => setShowVersionMenu(!showVersionMenu)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[11px] font-bold hover:bg-slate-800 transition-all shadow-md">
                 <History size={14}/> {activeVersion.toUpperCase()} 分支 <ChevronDown size={14} className={showVersionMenu ? 'rotate-180 transition-all' : ''}/>
               </button>
               {showVersionMenu && (
                 <div className="absolute bottom-full left-0 mb-3 w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-[60]">
                   {['v2', 'v1'].map(v => (
                     <button key={v} onClick={() => { setActiveVersion(v); setShowVersionMenu(false); }} className={`w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${activeVersion === v ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-slate-50 text-slate-600'}`}>
                       <span className="uppercase">{v} 分支预览</span> {activeVersion === v && <Check size={14}/>}
                     </button>
                   ))}
                 </div>
               )}
             </div>

             {pageMode === 'edit' && (
               <button onClick={handleSync} className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-[10px] font-bold hover:bg-amber-100 transition-all">
                 <RefreshCcw size={12} className={isSyncing ? 'animate-spin' : ''}/>
                 {isSyncing ? '同步中...' : '同步分镜'}
               </button>
             )}
             <div className="h-4 w-px bg-slate-200 mx-1"></div>
             <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 shadow-inner">
               <button className="text-[10px] font-bold text-slate-300 hover:text-slate-600">－</button>
               <div className="w-32 h-1 bg-slate-200 rounded-full"><div className="w-1/2 h-full bg-emerald-500 rounded-full shadow-sm"></div></div>
               <button className="text-[10px] font-bold text-slate-300 hover:text-slate-600">＋</button>
             </div>
           </div>
           <div className="flex gap-2">
             <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold flex items-center gap-1.5 shadow-sm hover:bg-slate-50"><Scissors size={14}/> 分割</button>
             
             {/* 粗剪模式下的提交审阅按钮 */}
             {pageMode === 'edit' && (
               <button 
                onClick={handleSubmitReview}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl text-[11px] font-bold flex items-center gap-2 shadow-md hover:bg-blue-700 transition-all active:scale-95"
               >
                <Send size={14}/> 提交审阅
               </button>
             )}
             
             <button className="px-5 py-2 bg-emerald-500 text-white rounded-xl text-[11px] font-bold flex items-center gap-2 shadow-md hover:bg-emerald-600">导出成片</button>
           </div>
        </div>

        {/* 轨道主体 */}
        <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto flex flex-col relative hide-scrollbar shadow-inner">
           <div className="h-6 flex items-end gap-24 px-4 pb-1 opacity-40 text-[9px] font-mono border-b border-slate-200 bg-white/50 sticky top-0 z-10">
             <span>00:00:00</span><span>00:00:10</span><span>00:00:20</span><span>00:00:30</span><span>00:00:40</span>
           </div>
           <div className="flex-1 flex gap-0.5 p-2 min-w-max items-center relative">
             {/* 评论锚点 */}
             {currentVersion.comments.map(c => (
                <div key={`marker-${c.id}`} onClick={() => handleSeek(c.time)} className="absolute top-1/2 -translate-y-1/2 z-30 cursor-pointer group flex flex-col items-center transition-all" style={{ left: `${(c.time / duration) * 100}%` }}>
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${c.hasAnnotation ? 'bg-emerald-400 ring-2 ring-emerald-500/20' : (c.status === 'resolved' ? 'bg-slate-300' : 'bg-red-400')}`}>
                    {c.hasAnnotation && <Pencil size={6} className="text-white"/>}
                  </div>
                </div>
             ))}

             {currentVersion.tracks.map((clip, i) => (
                <div key={clip.id} className={`h-[85%] min-w-[160px] rounded-xl border-2 transition-all relative group flex flex-col overflow-hidden cursor-pointer ${Math.abs(currentTime - (i * 60)) < 30 ? 'border-emerald-500 bg-white shadow-lg z-10' : 'border-white bg-white shadow-sm'}`}>
                  <div className={`absolute inset-0 opacity-15 ${clip.thumb || 'bg-slate-200'}`}></div>
                  <div className="relative z-10 p-2.5 flex flex-col h-full justify-between">
                      <span className="text-[10px] font-bold text-slate-700 truncate">{clip.label}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-white/60 px-1.5 self-end rounded shadow-sm">片段 #{i+1}</span>
                  </div>
                  <div className="absolute inset-y-0 left-0 w-2 bg-emerald-500 opacity-0 group-hover:opacity-100 cursor-col-resize"></div>
                  <div className="absolute inset-y-0 right-0 w-2 bg-emerald-500 opacity-0 group-hover:opacity-100 cursor-col-resize"></div>
                </div>
             ))}
           </div>
           {/* 播放指针 */}
           <div className="absolute top-0 bottom-0 w-0.5 bg-emerald-500 z-40 shadow-[0_0_15px_rgba(16,185,129,0.6)] pointer-events-none transition-all duration-100" style={{ left: `${(currentTime / duration) * 100}%` }}>
             <div className="w-4 h-4 bg-emerald-500 rounded-md absolute -top-2 -left-[7px] rotate-45 border-2 border-white shadow-xl"></div>
           </div>
        </div>
      </footer>

      {/* 提交审阅 全屏反馈反馈 */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-[#333A3F]/80 backdrop-blur-md z-[200] flex items-center justify-center animate-in fade-in duration-300">
           <div className="bg-white p-10 rounded-[32px] shadow-2xl flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
             <div className="relative">
               <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                 <CheckCircle2 size={48} className="text-emerald-500 animate-in zoom-in-50 duration-500"/>
               </div>
               <div className="absolute -top-1 -right-1">
                 <span className="flex h-4 w-4">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                 </span>
               </div>
             </div>
             <div className="text-center space-y-2">
               <h2 className="text-2xl font-black text-slate-800 tracking-tight">提交审阅成功</h2>
               <p className="text-slate-500 font-medium">版本 {activeVersion.toUpperCase()} 已锁定，通知已发送至编导侧</p>
             </div>
             <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
               <Film size={12}/> {activeVersion} 快照已固化
             </div>
           </div>
        </div>
      )}

      {/* 同步数据 Loading */}
      {isSyncing && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-sm z-[200] flex items-center justify-center">
           <div className="bg-slate-900 text-white px-8 py-5 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
             <RefreshCcw size={32} className="animate-spin text-emerald-400"/>
             <span className="text-base font-bold tracking-widest">同步 Step 3 分镜定稿...</span>
           </div>
        </div>
      )}
    </>
  );
}
