import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Plus,
  RefreshCcw,
  SkipBack,
  SkipForward,
  Trash2,
  X,
} from 'lucide-react';
import VideoPreviewReviewMode from './VideoPreviewReviewMode';

type PreviewDraftState = 'clean' | 'draft';

type AssetItem = {
  id: string;
  storyboardId: number;
  name: string;
  type: '视频' | '图片';
  durationSec: number;
  thumb: string;
};

type TimelineClip = {
  id: string;
  sourceAssetId: string;
  name: string;
  durationSec: number;
  thumb: string;
};

const TIMELINE_STORAGE_KEY = 'comiai_video_preview_timeline_v2';

const storyboardAssetSeeds: Record<number, Array<Omit<AssetItem, 'id'>>> = {
  1: [
    { storyboardId: 1, name: '电视塔_全景.mp4', type: '视频', durationSec: 5, thumb: 'https://picsum.photos/seed/tower-1/240/420' },
    { storyboardId: 1, name: '电视塔_特写.mp4', type: '视频', durationSec: 5, thumb: 'https://picsum.photos/seed/tower-2/240/420' },
    { storyboardId: 1, name: '塔顶云层.jpg', type: '图片', durationSec: 5, thumb: 'https://picsum.photos/seed/tower-still/240/420' },
  ],
  2: [
    { storyboardId: 2, name: '主角祈祷.mp4', type: '视频', durationSec: 5, thumb: 'https://picsum.photos/seed/girl-pray/240/420' },
    { storyboardId: 2, name: '主角侧脸.jpg', type: '图片', durationSec: 5, thumb: 'https://picsum.photos/seed/girl-side/240/420' },
  ],
  3: [
    { storyboardId: 3, name: '塔下门洞.mp4', type: '视频', durationSec: 5, thumb: 'https://picsum.photos/seed/door-1/240/420' },
    { storyboardId: 3, name: '门洞补帧.jpg', type: '图片', durationSec: 5, thumb: 'https://picsum.photos/seed/door-still/240/420' },
  ],
  4: [
    { storyboardId: 4, name: '手部特写.mp4', type: '视频', durationSec: 5, thumb: 'https://picsum.photos/seed/hand-1/240/420' },
    { storyboardId: 4, name: '老城外景.mp4', type: '视频', durationSec: 5, thumb: 'https://picsum.photos/seed/street-1/240/420' },
  ],
  5: [
    { storyboardId: 5, name: '街巷广角.mp4', type: '视频', durationSec: 5, thumb: 'https://picsum.photos/seed/street-wide/240/420' },
    { storyboardId: 5, name: '场景补帧.jpg', type: '图片', durationSec: 5, thumb: 'https://picsum.photos/seed/still-1/240/420' },
  ],
  6: [
    { storyboardId: 6, name: '远景推镜.mp4', type: '视频', durationSec: 5, thumb: 'https://picsum.photos/seed/city-pan/240/420' },
    { storyboardId: 6, name: '剪影参考.jpg', type: '图片', durationSec: 5, thumb: 'https://picsum.photos/seed/city-still/240/420' },
  ],
};

const getLatestStoryboardAssets = (refreshMap: Record<number, number> = {}): AssetItem[] => {
  const results: AssetItem[] = [];
  Object.keys(storyboardAssetSeeds).forEach((key) => {
    const sbId = Number(key);
    const token = refreshMap[sbId] ?? 0;
    storyboardAssetSeeds[sbId].forEach((asset, index) => {
      results.push({
        ...asset,
        id: `sb-${sbId}-${index}-${token}`,
        // mock 刷新后不同素材版本
        thumb: `${asset.thumb}?v=${token}`,
        name: token > 0 && asset.type === '视频' ? `${asset.name.replace('.mp4', '')}_v${token}.mp4` : asset.name,
      });
    });
  });
  return results;
};

const toTimelineClips = (assets: AssetItem[]) =>
  assets
    .filter((item) => item.type === '视频')
    .slice(0, 6)
    .map((item, index) => ({
      id: `clip-${index + 1}`,
      sourceAssetId: item.id,
      name: item.name,
      durationSec: item.durationSec,
      thumb: item.thumb,
    }));

export default function VideoPreview({
  onDraftStateChange,
}: {
  onDraftStateChange?: (state: PreviewDraftState) => void;
}) {
  const [allAssets, setAllAssets] = useState<AssetItem[]>([]);
  const [activeStoryboardId, setActiveStoryboardId] = useState(1);
  const [showStoryboardMenu, setShowStoryboardMenu] = useState(false);
  const [playheadSec, setPlayheadSec] = useState(0);
  const [timelineClips, setTimelineClips] = useState<TimelineClip[]>([]);
  const [assetRefreshMap, setAssetRefreshMap] = useState<Record<number, number>>({});
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const [showReviewMode, setShowReviewMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCreateExportTaskModal, setShowCreateExportTaskModal] = useState(false);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [jianyingPath, setJianyingPath] = useState('/Users/anna/Movies/JianyingPro/User Data/Projects/com.lveditor.draft');
  const [draftExportPath, setDraftExportPath] = useState('');
  const [exportTasks, setExportTasks] = useState([
    { id: 189, operator: '郭楠楠', progress: '100%', createdAt: '2026-03-18 11:27:42', action: '下载' },
  ]);
  const [exportPage, setExportPage] = useState(1);
  const [exportPageSize, setExportPageSize] = useState(10);
  const [exportJumpPage, setExportJumpPage] = useState('1');
  const [isPlaying, setIsPlaying] = useState(false);
  const timelineTrackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onDraftStateChange?.('clean');
  }, [onDraftStateChange]);

  useEffect(() => {
    const latestAssets = getLatestStoryboardAssets(assetRefreshMap);
    setAllAssets(latestAssets);

    const saved = localStorage.getItem(TIMELINE_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as TimelineClip[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTimelineClips(parsed);
          return;
        }
      } catch {
        // ignore corrupted saved data
      }
    }
    setTimelineClips(toTimelineClips(latestAssets));
  // 进入页面都拉最新素材，但时间轴只在首次无缓存时初始化
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(timelineClips));
  }, [timelineClips]);

  const filteredAssets = allAssets.filter((item) => {
    if (item.storyboardId !== activeStoryboardId) return false;
    if (item.type !== '视频') return false;
    return true;
  });

  const totalDuration = useMemo(
    () => Math.max(5, timelineClips.reduce((sum, clip) => sum + clip.durationSec, 0)),
    [timelineClips]
  );
  const pxPerSecond = 26;
  const timelineWidth = Math.max(900, totalDuration * pxPerSecond);
  const tickMarks = useMemo(() => {
    const marks: number[] = [];
    for (let i = 0; i <= totalDuration; i += 5) marks.push(i);
    if (marks[marks.length - 1] !== totalDuration) marks.push(totalDuration);
    return marks;
  }, [totalDuration]);
  const playheadPercent = totalDuration > 0 ? (playheadSec / totalDuration) * 100 : 0;

  const activePreviewClip = useMemo(() => {
    let cursor = 0;
    for (const clip of timelineClips) {
      cursor += clip.durationSec;
      if (playheadSec <= cursor) return clip;
    }
    return timelineClips[timelineClips.length - 1] || null;
  }, [timelineClips, playheadSec]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRefreshAssets = () => {
    const nextMap = { ...assetRefreshMap, [activeStoryboardId]: (assetRefreshMap[activeStoryboardId] ?? 0) + 1 };
    setAssetRefreshMap(nextMap);
    setAllAssets(getLatestStoryboardAssets(nextMap));
  };

  const handleAddToTimeline = (asset: AssetItem) => {
    const insertionIndex = (() => {
      let cursor = 0;
      for (let i = 0; i < timelineClips.length; i += 1) {
        cursor += timelineClips[i].durationSec;
        if (playheadSec < cursor) return i + 1;
      }
      return timelineClips.length;
    })();

    const nextClip: TimelineClip = {
      id: `clip-${Date.now()}`,
      sourceAssetId: asset.id,
      name: asset.name,
      durationSec: asset.durationSec,
      thumb: asset.thumb,
    };

    setTimelineClips((prev) => [...prev.slice(0, insertionIndex), nextClip, ...prev.slice(insertionIndex)]);
  };

  const handleDeleteClip = (clipId: string) => {
    setTimelineClips((prev) => prev.filter((clip) => clip.id !== clipId));
  };

  const handleOverwriteTimeline = () => {
    setTimelineClips(toTimelineClips(getLatestStoryboardAssets(assetRefreshMap)));
    setShowOverwriteConfirm(false);
    setPlayheadSec(0);
    setIsPlaying(false);
  };

  const handleConfirmCreateExportTask = () => {
    const nextPath = draftExportPath.trim();
    if (!nextPath) return;

    setJianyingPath(nextPath);
    const nextId = exportTasks.length > 0 ? exportTasks[0].id + 1 : 1;
    const now = new Date();
    const pad = (n: number) => `${n}`.padStart(2, '0');
    const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    setExportTasks((prev) => [
      { id: nextId, operator: '郭楠楠', progress: '100%', createdAt: stamp, action: '下载' },
      ...prev,
    ]);
    setExportPage(1);
    setExportJumpPage('1');
    setShowCreateExportTaskModal(false);
  };

  const handleDownload = () => {
    setShowDownloadConfirm(true);
  };

  const handleConfirmDownload = () => {
    setShowDownloadConfirm(false);
  };

  const exportTotalPages = Math.max(1, Math.ceil(exportTasks.length / exportPageSize));
  const safeExportPage = Math.min(exportTotalPages, Math.max(1, exportPage));
  const pagedExportTasks = exportTasks.slice((safeExportPage - 1) * exportPageSize, safeExportPage * exportPageSize);

  const seekTo = (next: number) => {
    const safe = Math.min(totalDuration, Math.max(0, next));
    setPlayheadSec(safe);
  };

  const seekBy = (delta: number) => seekTo(playheadSec + delta);

  const getClipStart = (index: number) => timelineClips.slice(0, index).reduce((sum, clip) => sum + clip.durationSec, 0);

  const seekPrevClip = () => {
    const starts = timelineClips.map((_, i) => getClipStart(i));
    const prev = [...starts].reverse().find((start) => start < Math.max(0, playheadSec - 0.001));
    seekTo(prev ?? 0);
  };

  const seekNextClip = () => {
    const starts = timelineClips.map((_, i) => getClipStart(i));
    const next = starts.find((start) => start > playheadSec + 0.001);
    seekTo(next ?? totalDuration);
  };

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = setInterval(() => {
      setPlayheadSec((prev) => {
        const next = prev + 1;
        if (next >= totalDuration) {
          setIsPlaying(false);
          return totalDuration;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, totalDuration]);

  return (
    <>
      <div className="flex-1 flex overflow-hidden p-3 pb-0 gap-3 bg-[#e8e9ea]">
        <aside className="w-[300px] rounded-3xl border border-[#d2d3d4] bg-[#f8f8f9] shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-[#d2d3d4] bg-[#f2f3f4] flex items-center justify-between">
            <div className="font-bold text-slate-700">分镜素材</div>
            <button
              onClick={handleRefreshAssets}
              className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1"
            >
              <RefreshCcw size={12} />
              刷新
            </button>
          </div>
          <div className="px-4 pt-2 pb-1 flex items-center gap-3 text-xs font-semibold text-slate-500 border-b border-slate-200">
            {[1, 2, 3, 4].map((id) => (
              <button
                key={id}
                onClick={() => setActiveStoryboardId(id)}
                className={`pb-1 border-b-2 ${activeStoryboardId === id ? 'border-emerald-500 text-emerald-600' : 'border-transparent hover:text-slate-700'}`}
              >
                分镜{id}
              </button>
            ))}
            <div className="relative ml-auto">
              <button
                onClick={() => setShowStoryboardMenu((prev) => !prev)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 bg-white hover:bg-slate-50"
              >
                分 <ChevronDown size={12} />
              </button>
              {showStoryboardMenu ? (
                <div className="absolute right-0 top-full mt-1 w-20 rounded-xl border border-slate-200 bg-white shadow-lg z-20 overflow-hidden">
                  {[1, 2, 3, 4, 5, 6].map((id) => (
                    <button
                      key={id}
                      onClick={() => {
                        setActiveStoryboardId(id);
                        setShowStoryboardMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs ${activeStoryboardId === id ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      分镜{id}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <div className="p-3 grid grid-cols-2 gap-3 overflow-y-auto">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="rounded-xl bg-[#e8e9ea] p-2 border border-slate-200">
                <div className="relative rounded-lg overflow-hidden">
                  <img src={asset.thumb} className="w-full aspect-[9/14] object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute top-1 left-1 text-[10px] bg-white/95 text-slate-700 px-1.5 py-0.5 rounded-full">{formatTime(asset.durationSec)}</span>
                  <button
                    onClick={() => handleAddToTimeline(asset)}
                    className="absolute top-1 right-1 w-7 h-7 rounded-full bg-white text-slate-700 border border-slate-200 flex items-center justify-center hover:text-emerald-600"
                    title="添加到时间轴（在时间指针后）"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 rounded-3xl border border-[#d2d3d4] bg-[#f8f8f9] shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 flex items-center justify-center bg-[#e8e9ea] p-6">
            <div className="w-[420px] max-w-[52%] aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl">
              {activePreviewClip ? (
                <img src={activePreviewClip.thumb} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">暂无视频片段</div>
              )}
            </div>
          </div>
        </main>
      </div>

      <footer className="h-44 border-t border-[#d2d3d4] bg-[#f8f8f9] px-3 pb-3">
        <div className="h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowOverwriteConfirm(true)}
              className="h-8 px-3 rounded-full border border-slate-400 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <RefreshCcw size={13} />
              更新分镜
            </button>
            <div className="text-xs text-slate-500">{formatTime(playheadSec)} / {formatTime(totalDuration)}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="mr-2 flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-1.5 py-1">
              <button
                onClick={seekPrevClip}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center"
                title="上一段"
              >
                <SkipBack size={14} />
              </button>
              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center"
                title={isPlaying ? '暂停' : '播放'}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>
              <button
                onClick={seekNextClip}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center"
                title="下一段"
              >
                <SkipForward size={14} />
              </button>
            </div>
            <button
              onClick={() => setShowReviewMode(true)}
              className="h-9 px-4 rounded-xl border border-slate-500 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100"
            >
              审阅模式
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="h-9 px-4 rounded-xl border border-slate-500 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100"
            >
              导出到剪映
            </button>
          </div>
        </div>

        <div className="h-[92px] rounded-2xl border border-slate-200 bg-slate-50 overflow-x-auto">
          <div className="relative p-2.5 min-w-max" style={{ width: `${timelineWidth}px` }}>
            <div className="relative h-5 mb-1">
              {tickMarks.map((sec) => {
                const left = (sec / totalDuration) * timelineWidth;
                const major = sec % 10 === 0 || sec === 0 || sec === totalDuration;
                return (
                  <div key={sec} className="absolute top-0" style={{ left }}>
                    <div className={`w-px ${major ? 'h-4 bg-slate-500' : 'h-2.5 bg-slate-300'}`} />
                    {major ? <span className="absolute -left-3 top-4 text-[10px] text-slate-500">{formatTime(sec)}</span> : null}
                  </div>
                );
              })}
            </div>

            <div
              ref={timelineTrackRef}
              className="relative h-14 rounded-xl border border-slate-200 bg-white overflow-hidden cursor-pointer"
              onClick={(e) => {
                if (!timelineTrackRef.current) return;
                const rect = timelineTrackRef.current.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                seekTo(Math.round(ratio * totalDuration));
              }}
            >
              {timelineClips.map((clip, idx) => {
                const startSec = getClipStart(idx);
                const left = (startSec / totalDuration) * 100;
                const width = (clip.durationSec / totalDuration) * 100;
                const active = activePreviewClip?.id === clip.id;
                return (
                  <div
                    key={clip.id}
                    className={`absolute top-1 bottom-1 rounded-lg border overflow-hidden group ${active ? 'border-emerald-500 ring-1 ring-emerald-300' : 'border-slate-200'}`}
                    style={{ left: `${left}%`, width: `${Math.max(6, width)}%` }}
                  >
                    <img src={clip.thumb} className="absolute inset-0 w-full h-full object-cover opacity-70" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10 px-1.5 pt-1 text-[10px] font-semibold text-white truncate">{idx + 1}. {clip.name}</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClip(clip.id);
                      }}
                      className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-black/55 text-white hidden group-hover:flex items-center justify-center"
                      title="删除片段"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                );
              })}

              <div className="absolute top-0 bottom-0 w-[2px] bg-emerald-500 z-20" style={{ left: `${playheadPercent}%` }}>
                <div className="absolute -top-1 -left-[5px] w-3 h-3 rounded-sm rotate-45 bg-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {showOverwriteConfirm && (
        <div className="fixed inset-0 z-[140] bg-black/45 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-4 shadow-2xl">
            <div className="font-bold text-slate-800 mb-2">确认更新分镜</div>
            <p className="text-sm text-slate-500 leading-6">
              更新分镜会拉取最新素材并覆盖当前时间轴，之前的手动编辑将被替换。是否继续？
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowOverwriteConfirm(false)} className="h-9 px-3 rounded-lg bg-slate-100 text-slate-700 text-sm">取消</button>
              <button onClick={handleOverwriteTimeline} className="h-9 px-3 rounded-lg bg-[#01cd74] text-white text-sm">确认覆盖</button>
            </div>
          </div>
        </div>
      )}

      {showReviewMode && (
        <div className="fixed inset-0 z-[130] bg-black/45 backdrop-blur-sm p-4">
          <div className="w-full h-full rounded-3xl overflow-hidden border border-[#d2d3d4] bg-[#f8f8f9] shadow-2xl relative">
            <button
              onClick={() => setShowReviewMode(false)}
              className="absolute top-3 right-3 z-[140] w-9 h-9 rounded-full bg-black/45 text-white flex items-center justify-center hover:bg-black/60"
              title="关闭审阅模式"
            >
              <X size={16} />
            </button>
            <VideoPreviewReviewMode onDraftStateChange={onDraftStateChange} />
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 z-[150] bg-black/45 backdrop-blur-sm p-6 flex items-center justify-center">
          <div className="w-full max-w-[920px] rounded-[22px] bg-[#f8f8f9] border border-[#d2d3d4] shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[28px] font-bold leading-none text-slate-900">导出任务列表</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-10 h-10 rounded-full border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <button
                onClick={() => {
                  setDraftExportPath('');
                  setShowCreateExportTaskModal(true);
                }}
                className="h-10 px-5 rounded-lg bg-[#01cd74] text-white text-sm font-semibold leading-none hover:opacity-95"
              >
                +新建导出任务
              </button>

              <button
                onClick={() => setExportTasks((prev) => [...prev])}
                className="ml-auto h-10 px-5 rounded-lg border border-slate-300 bg-white text-sm text-slate-600 font-medium hover:bg-slate-50 inline-flex items-center gap-1.5"
              >
                <RefreshCcw className="w-4 h-4" />
                刷新列表
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
              <div className="grid grid-cols-5 bg-[#eceeef] text-slate-700 text-sm font-semibold px-6 py-3">
                <div>序号</div>
                <div>操作人</div>
                <div>进度</div>
                <div>创建时间</div>
                <div>操作</div>
              </div>
              {pagedExportTasks.map((task) => (
                <div key={task.id} className="grid grid-cols-5 px-6 py-3.5 text-sm text-slate-700 border-t border-slate-100">
                  <div>{task.id}</div>
                  <div>{task.operator}</div>
                  <div>{task.progress}</div>
                  <div>{task.createdAt}</div>
                  <button
                    onClick={handleDownload}
                    className="text-[#01cd74] font-semibold text-left hover:underline"
                  >
                    {task.action}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-end text-sm text-slate-500 gap-4">
              <span>共 {exportTasks.length} 条</span>

              <button
                type="button"
                className="h-8 min-w-10 px-2 rounded-lg border border-slate-300 bg-white text-slate-500 inline-flex items-center justify-center"
                onClick={() => {
                  const next = exportPageSize === 10 ? 20 : 10;
                  setExportPageSize(next);
                  setExportPage(1);
                  setExportJumpPage('1');
                }}
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              <button
                type="button"
                className="p-1 text-slate-400 disabled:opacity-40"
                disabled={safeExportPage <= 1}
                onClick={() => {
                  const next = Math.max(1, safeExportPage - 1);
                  setExportPage(next);
                  setExportJumpPage(String(next));
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-[#01cd74] font-semibold">{safeExportPage}</span>

              <button
                type="button"
                className="p-1 text-slate-400 disabled:opacity-40"
                disabled={safeExportPage >= exportTotalPages}
                onClick={() => {
                  const next = Math.min(exportTotalPages, safeExportPage + 1);
                  setExportPage(next);
                  setExportJumpPage(String(next));
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <span>前往</span>

              <input
                value={exportJumpPage}
                onChange={(e) => setExportJumpPage(e.target.value.replace(/[^\d]/g, ''))}
                onBlur={() => {
                  const parsed = Number(exportJumpPage || '1');
                  const next = Math.min(exportTotalPages, Math.max(1, parsed || 1));
                  setExportPage(next);
                  setExportJumpPage(String(next));
                }}
                className="w-14 h-8 rounded-lg border border-slate-300 bg-white text-center text-slate-700 outline-none"
              />

              <span>页</span>
            </div>

          </div>
        </div>
      )}

      {showCreateExportTaskModal && (
        <div className="fixed inset-0 z-[160] bg-black/45 backdrop-blur-sm p-6 flex items-center justify-center">
          <div className="w-full max-w-[760px] rounded-[20px] bg-[#f8f8f9] border border-[#d2d3d4] shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">新建导出任务</h3>
              <button
                onClick={() => setShowCreateExportTaskModal(false)}
                className="w-9 h-9 rounded-full border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">导出地址</label>
              <p className="text-xs text-slate-500 mb-2">请粘贴本地剪映草稿地址</p>
              <input
                value={draftExportPath}
                onChange={(e) => setDraftExportPath(e.target.value)}
                placeholder="请输入剪映草稿地址"
                className="w-full h-10 px-4 rounded-xl border border-slate-300 bg-white text-sm text-slate-700 outline-none focus:border-emerald-400"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-700 mb-2">注：</div>
              <div className="text-xs leading-6 text-slate-600 whitespace-pre-line">
                在剪映的全局设置中可查看剪映的草稿位置，请正确粘贴内容，否则会保存失败。参考案例如下：
                {'\n'}Windows 系统默认位置一般在：C:\Users\你的用户名\AppData\Local\JianyingPro\User Data\Projects\com.lveditor.draft
                {'\n'}Mac 系统默认位置一般在：/Users/你的用户名/Movies/JianyingPro/User Data/Projects/com.lveditor.draft
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateExportTaskModal(false)}
                className="h-9 px-4 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                onClick={handleConfirmCreateExportTask}
                className="h-9 px-4 rounded-lg bg-[#1c2329] text-white text-sm font-semibold hover:opacity-95"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {showDownloadConfirm && (
        <div className="fixed inset-0 z-[165] bg-black/45 backdrop-blur-sm p-6 flex items-center justify-center">
          <div className="w-full max-w-[760px] rounded-[20px] bg-[#f8f8f9] border border-[#d2d3d4] shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">导出剪映草稿</h3>
              <button
                onClick={() => setShowDownloadConfirm(false)}
                className="w-9 h-9 rounded-full border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm leading-7 text-slate-600">
                <p>您的文件将被保存到</p>
                <p className="my-1 font-semibold text-slate-800 break-all">{jianyingPath}</p>
                <p>请到该路径下解压文件，并重启剪映即可看到导入草稿。</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowDownloadConfirm(false)}
                className="h-9 px-4 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDownload}
                className="h-9 px-4 rounded-lg bg-[#1c2329] text-white text-sm font-semibold hover:opacity-95"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
