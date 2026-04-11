import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import {
  Film,
  Image as ImageIcon,
  Upload,
  ChevronDown,
  Clock3,
  SlidersHorizontal,
  Sparkles,
  History,
  PlayCircle,
  Plus,
  Pencil,
  RefreshCw,
  X,
  Music,
  Video,
} from 'lucide-react';

type TaskType = 'image' | 'video';
type VideoMode = 'all-ref' | 'multi-image' | 'first-last' | 'single-image';

type ShotItem = {
  id: number;
  title: string;
  thumb?: string;
  draft?: boolean;
  mediaType?: 'video' | 'image';
};

type HistoryItem = {
  id: number;
  shotId: number;
  type: TaskType;
  createdAt: string;
  model: string;
  preview: string;
  prompt: string;
  params: string[];
};

// Asset color palette: { bg, border, text, highlight }
const PALETTE = [
  { bg: '#ede9fe', border: '#a78bfa', text: '#5b21b6', highlight: 'rgba(139,92,246,0.18)' },
  { bg: '#dbeafe', border: '#60a5fa', text: '#1e40af', highlight: 'rgba(59,130,246,0.18)' },
  { bg: '#d1fae5', border: '#34d399', text: '#065f46', highlight: 'rgba(16,185,129,0.18)' },
  { bg: '#ffedd5', border: '#fb923c', text: '#9a3412', highlight: 'rgba(249,115,22,0.18)' },
  { bg: '#fce7f3', border: '#f472b6', text: '#9d174d', highlight: 'rgba(236,72,153,0.18)' },
  { bg: '#fef3c7', border: '#fbbf24', text: '#78350f', highlight: 'rgba(251,191,36,0.18)' },
];

type Asset = {
  id: string;
  name: string;      // sanitized, no spaces — used as @tag identifier
  label: string;     // display label (original filename minus extension)
  colorIdx: number;
  url?: string;      // object URL for preview
  mediaType: 'image' | 'video' | 'audio';
};

type ShotFormState = {
  taskType: TaskType;
  videoMode: VideoMode;
  prompt: string;
  model: string;
  duration: string;
  resolution: string;
  ratio: string;
  assets: Asset[];
};

const SHOTS: ShotItem[] = [
  { id: 1, title: '分镜1', mediaType: 'video', thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=480&auto=format&fit=crop&q=70' },
  { id: 2, title: '分镜2', mediaType: 'image', thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=480&auto=format&fit=crop&q=70' },
  { id: 3, title: '分镜3', mediaType: 'image', thumb: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=480&auto=format&fit=crop&q=70' },
  { id: 4, title: '分镜4', mediaType: 'image', thumb: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=480&auto=format&fit=crop&q=70' },
  { id: 5, title: '分镜5', draft: true },
];

const HISTORY: HistoryItem[] = [
  { id: 101, shotId: 1, type: 'video', createdAt: '2026-04-01 15:09', model: 'Seedance2.0', preview: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=960&auto=format&fit=crop&q=70', prompt: '夜色森林营地，圆形火焰在中心，俯拍缓慢推进，士兵围坐。', params: ['5s', '720p', '9:16', '多图生视频'] },
  { id: 102, shotId: 2, type: 'image', createdAt: '2026-04-01 14:36', model: 'Nano Banana Pro', preview: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=960&auto=format&fit=crop&q=70', prompt: '角色正面特写，冷暖对比光，背景虚化。', params: ['4张', '4:5', '电影质感'] },
  { id: 103, shotId: 3, type: 'video', createdAt: '2026-04-01 13:52', model: 'Vidu Q2Pro', preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=960&auto=format&fit=crop&q=70', prompt: '大远景，火堆周围人群轻微动作，镜头轻摇。', params: ['10s', '1080p', '16:9', '首尾帧'] },
];

function sanitizeName(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w\u4e00-\u9fff]/g, '')
    .slice(0, 20) || 'asset';
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildHighlightHtml(value: string, assets: Asset[]): string {
  const assetMap = new Map(assets.map((a) => [a.name, a]));
  const regex = /@([^\s@]+)/g;
  let html = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(value)) !== null) {
    html += escapeHtml(value.slice(lastIndex, match.index));
    const asset = assetMap.get(match[1]);
    if (asset) {
      const c = PALETTE[asset.colorIdx % PALETTE.length];
      html += `<mark style="background:${c.highlight};color:${c.text};border-radius:3px;padding:1px 3px;font-weight:600;">${escapeHtml(match[0])}</mark>`;
    } else {
      html += escapeHtml(match[0]);
    }
    lastIndex = match.index + match[0].length;
  }
  html += escapeHtml(value.slice(lastIndex));
  if (value.endsWith('\n')) html += '\u200b';
  return html;
}

// ── PromptEditor: textarea with @tag highlighting ──────────────────────────
function PromptEditor({
  value,
  onChange,
  assets,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  assets: Asset[];
  label: string;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const [atQuery, setAtQuery] = useState<string | null>(null);

  const highlightHtml = useMemo(() => buildHighlightHtml(value, assets), [value, assets]);

  // Auto-grow textarea height
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
    if (mirrorRef.current) mirrorRef.current.style.height = `${ta.scrollHeight}px`;
  }, [value]);

  const syncScroll = () => {
    if (mirrorRef.current && taRef.current) {
      mirrorRef.current.scrollTop = taRef.current.scrollTop;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value: v, selectionStart: pos } = e.target;
    onChange(v);
    const before = v.slice(0, pos ?? v.length);
    const match = before.match(/@([^\s@]*)$/);
    setAtQuery(match ? match[1] : null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') { setAtQuery(null); return; }
    if (e.key === 'Backspace') {
      const ta = e.currentTarget;
      const { value: v, selectionStart: pos, selectionEnd: selEnd } = ta;
      if (pos === selEnd && pos > 0) {
        const before = v.slice(0, pos);
        const tagMatch = before.match(/@([^\s@]+)$/);
        if (tagMatch && assets.some((a) => a.name === tagMatch[1])) {
          e.preventDefault();
          const newVal = v.slice(0, pos - tagMatch[0].length) + v.slice(pos);
          onChange(newVal);
          const newPos = pos - tagMatch[0].length;
          requestAnimationFrame(() => {
            if (taRef.current) taRef.current.selectionStart = taRef.current.selectionEnd = newPos;
          });
        }
      }
    }
  };

  const insertMention = useCallback(
    (asset: Asset) => {
      const ta = taRef.current;
      if (!ta) return;
      const { value: v, selectionStart: pos } = ta;
      const safePos = pos ?? v.length;
      const before = v.slice(0, safePos);
      const match = before.match(/@([^\s@]*)$/);
      const start = match ? safePos - match[0].length : safePos;
      const newVal = v.slice(0, start) + `@${asset.name} ` + v.slice(safePos);
      onChange(newVal);
      setAtQuery(null);
      const newPos = start + asset.name.length + 2;
      requestAnimationFrame(() => {
        if (taRef.current) {
          taRef.current.selectionStart = taRef.current.selectionEnd = newPos;
          taRef.current.focus();
        }
      });
    },
    [onChange]
  );

  const filteredAssets =
    atQuery !== null
      ? assets.filter((a) => a.name.toLowerCase().includes(atQuery.toLowerCase()))
      : [];

  const FONT_STYLE: React.CSSProperties = {
    fontSize: '13px',
    lineHeight: '1.6',
    fontFamily: 'inherit',
    padding: '10px 12px',
    boxSizing: 'border-box',
  };

  return (
    <div>
      <div className="text-xs font-bold text-slate-700 mb-2">{label}</div>
      <div className="relative">
        <div className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:bg-white focus-within:border-[#6da768] transition-colors">
          {/* Mirror div — renders highlighted text */}
          <div
            ref={mirrorRef}
            aria-hidden
            className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words overflow-hidden text-slate-700"
            style={FONT_STYLE}
            dangerouslySetInnerHTML={{ __html: highlightHtml }}
          />
          {/* Transparent textarea on top — handles all input */}
          <textarea
            ref={taRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onScroll={syncScroll}
            className="relative w-full min-h-[130px] resize-none outline-none bg-transparent"
            style={{ ...FONT_STYLE, caretColor: '#334155', color: 'transparent' }}
          />
        </div>

        {/* @mention autocomplete dropdown */}
        {atQuery !== null && filteredAssets.length > 0 && (
          <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden min-w-[160px]">
            {filteredAssets.map((asset) => {
              const c = PALETTE[asset.colorIdx % PALETTE.length];
              return (
                <button
                  key={asset.id}
                  onMouseDown={(e) => { e.preventDefault(); insertMention(asset); }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.border }} />
                  <span className="font-medium text-slate-700">@{asset.name}</span>
                  <span className="text-xs text-slate-400 ml-auto truncate max-w-[80px]">{asset.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Hint */}
        {assets.length > 0 && atQuery === null && (
          <p className="text-[10px] text-slate-400 mt-1">输入 @ 可引用素材</p>
        )}
      </div>
    </div>
  );
}

// ── AssetCard ──────────────────────────────────────────────────────────────
function AssetCard({ asset, onDelete }: { asset: Asset; onDelete: () => void }) {
  const c = PALETTE[asset.colorIdx % PALETTE.length];
  return (
    <div
      className="relative flex items-center gap-2 rounded-lg border pl-2 pr-2 py-1.5 bg-white shadow-sm"
      style={{ borderColor: c.border, borderLeftWidth: 3 }}
    >
      {/* Thumbnail / icon */}
      <div className="w-9 h-9 rounded-md overflow-hidden shrink-0 flex items-center justify-center bg-slate-100">
        {asset.mediaType === 'image' && asset.url ? (
          <img src={asset.url} className="w-full h-full object-cover" />
        ) : asset.mediaType === 'video' ? (
          <Video className="w-4 h-4 text-slate-400" />
        ) : (
          <Music className="w-4 h-4 text-slate-400" />
        )}
      </div>
      {/* Name + tag badge */}
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold text-slate-700 truncate leading-tight max-w-[80px]">{asset.label}</div>
        <div
          className="text-[10px] font-semibold px-1 py-0.5 rounded mt-0.5 inline-block"
          style={{ background: c.highlight, color: c.text }}
        >
          @{asset.name}
        </div>
      </div>
      {/* Delete */}
      <button
        onClick={onDelete}
        className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function StoryboardProduction() {
  const [shots, setShots] = useState<ShotItem[]>(SHOTS);
  const [activeShotId, setActiveShotId] = useState(1);
  const [globalColorIdx, setGlobalColorIdx] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [shotForms, setShotForms] = useState<Record<number, ShotFormState>>({
    1: { taskType: 'video', videoMode: 'all-ref', prompt: '夜色营地，圆形火焰位于中心，俯拍镜头缓慢推进，角色轮廓被火光照亮。', model: 'Seedance2.0', duration: '5s', resolution: '720p', ratio: '9:16', assets: [] },
    2: { taskType: 'image', videoMode: 'single-image', prompt: '角色特写，人物面部受冷暖光交错照亮，背景轻微虚化。', model: 'Nano Banana Pro', duration: '5s', resolution: '720p', ratio: '9:16', assets: [] },
    3: { taskType: 'video', videoMode: 'first-last', prompt: '森林河道全景，士兵围火堆，镜头缓慢平移。', model: 'Vidu Q2Pro', duration: '10s', resolution: '1080p', ratio: '16:9', assets: [] },
  });

  const activeShot = useMemo(() => shots.find((s) => s.id === activeShotId) ?? shots[0], [activeShotId, shots]);
  const visibleHistory = useMemo(() => HISTORY.filter((h) => h.shotId === activeShotId), [activeShotId]);

  const defaultForm: ShotFormState = {
    taskType: 'video', videoMode: 'all-ref',
    prompt: '请描述当前分镜的画面、镜头运动、角色动作和氛围光影。',
    model: 'Seedance2.0', duration: '5s', resolution: '720p', ratio: '9:16', assets: [],
  };

  const activeForm = shotForms[activeShotId] ?? defaultForm;

  const updateActiveForm = (patch: Partial<ShotFormState>) => {
    setShotForms((prev) => ({ ...prev, [activeShotId]: { ...(prev[activeShotId] ?? defaultForm), ...patch } }));
  };

  const addNewShot = () => {
    const nextShot: ShotItem = { id: Date.now(), title: `分镜${shots.length + 1}`, draft: true };
    setShots((prev) => [...prev, nextShot]);
    setShotForms((prev) => ({ ...prev, [nextShot.id]: defaultForm }));
    setActiveShotId(nextShot.id);
  };

  // ── Asset upload ────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!e.target.files) return;
    // reset so the same file can be re-selected
    e.target.value = '';
    if (!file) return;

    const mediaType: Asset['mediaType'] = file.type.startsWith('video/')
      ? 'video'
      : file.type.startsWith('audio/')
      ? 'audio'
      : 'image';

    const label = file.name.replace(/\.[^/.]+$/, '').trim().slice(0, 24) || 'asset';
    const name = sanitizeName(file.name);
    const url = mediaType === 'image' ? URL.createObjectURL(file) : undefined;

    const colorIdx = globalColorIdx % PALETTE.length;
    setGlobalColorIdx((n) => n + 1);

    const newAsset: Asset = { id: `${Date.now()}`, name, label, colorIdx, url, mediaType };
    const currentAssets = activeForm.assets ?? [];
    const newAssets = [...currentAssets, newAsset];
    // Auto-append @tag to prompt
    const newPrompt = activeForm.prompt.trimEnd() + (activeForm.prompt.trim() ? '\n' : '') + `@${name} `;
    updateActiveForm({ assets: newAssets, prompt: newPrompt });
  };

  const handleDeleteAsset = (asset: Asset) => {
    const tagPattern = new RegExp(`@${asset.name}(\\s|$)`, 'g');
    const hasTag = tagPattern.test(activeForm.prompt);
    if (hasTag && !window.confirm(`删除素材「${asset.label}」？提示词中对应的 @${asset.name} 标签也会被移除。`)) return;
    const newPrompt = activeForm.prompt.replace(new RegExp(`@${asset.name}(\\s?)`, 'g'), '');
    const newAssets = (activeForm.assets ?? []).filter((a) => a.id !== asset.id);
    if (asset.url) URL.revokeObjectURL(asset.url);
    updateActiveForm({ assets: newAssets, prompt: newPrompt });
  };

  const imageRatioOptions = ['智能', '21:9', '16:9', '3:2', '4:3', '1:1', '3:4', '2:3', '9:16'];
  const videoRatioOptions = ['9:16', '16:9', '1:1', '4:5'];
  const imageResolutionOptions = ['1K', '2K', '4K'];
  const videoResolutionOptions = ['720p', '1080p', '4K'];

  const currentAssets = activeForm.assets ?? [];

  return (
    <div className="stage-shell flex-1 overflow-hidden p-3 pb-0">
      <div className="h-full flex gap-3 overflow-hidden">

        {/* 左：分镜快速定位 */}
        <aside className="stage-pane w-[180px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col shrink-0">
          <div className="h-14 px-4 border-b border-slate-100 bg-slate-50/60 flex items-center">
            <div className="text-sm font-bold text-slate-800">分镜({shots.length})</div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {shots.map((shot, index) => {
              const active = shot.id === activeShotId;
              return (
                <button
                  key={shot.id}
                  onClick={() => setActiveShotId(shot.id)}
                  className={`w-full text-left rounded-2xl border-2 transition-all overflow-hidden ${
                    active
                      ? 'border-[#2b5f43] bg-[#f5faee] shadow-[0_0_0_2px_rgba(109,167,104,0.35)]'
                      : 'border-slate-200 bg-white hover:border-[#9fc79b]'
                  }`}
                >
                  <div className="relative h-44 rounded-[14px] overflow-hidden bg-black">
                    <div className="absolute left-2 top-2 min-w-6 h-6 rounded-full bg-black/85 text-white text-xs font-bold flex items-center justify-center px-1.5 z-20">
                      {index + 1}
                    </div>
                    {shot.draft && (
                      <div className="absolute right-2 top-2 h-6 rounded-full bg-slate-700/95 text-white text-[10px] font-bold px-2 flex items-center z-20">
                        未定稿
                      </div>
                    )}
                    {!shot.draft && (
                      <div className="absolute right-2 top-2 h-7 w-7 rounded-lg bg-white/95 border border-slate-200 text-[#2b5f43] flex items-center justify-center z-20">
                        {shot.mediaType === 'video' ? <PlayCircle className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                      </div>
                    )}
                    {shot.thumb ? (
                      <div className="h-full bg-cover bg-center" style={{ backgroundImage: `url(${shot.thumb})` }} />
                    ) : (
                      <div className="h-full bg-slate-100 flex items-center justify-center">
                        <ImageIcon className="w-7 h-7 text-slate-400" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
            <button
              onClick={addNewShot}
              className="w-full h-20 rounded-xl border border-slate-200 bg-[#f1f4f2] hover:bg-[#e9f2df] text-slate-600 hover:text-[#2b5f43] transition-colors flex flex-col items-center justify-center gap-1"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs font-bold">添加分镜</span>
            </button>
          </div>
        </aside>

        {/* 中：提交任务面板 */}
        <section className="stage-pane w-[360px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col shrink-0">
          <div className="h-14 px-4 border-b border-slate-100 bg-slate-50/60 flex items-center">
            <div className="w-full max-w-[220px] grid grid-cols-2 gap-2">
              <button
                onClick={() => updateActiveForm({ taskType: 'image' })}
                className={`h-8 rounded-lg text-sm font-bold transition-colors ${
                  activeForm.taskType === 'image' ? 'bg-[#2b5f43] text-white' : 'bg-transparent text-slate-500 hover:text-[#2b5f43]'
                }`}
              >
                图片
              </button>
              <button
                onClick={() => updateActiveForm({ taskType: 'video' })}
                className={`h-8 rounded-lg text-sm font-bold transition-colors ${
                  activeForm.taskType === 'video' ? 'bg-[#2b5f43] text-white' : 'bg-transparent text-slate-500 hover:text-[#2b5f43]'
                }`}
              >
                视频
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Video mode tabs */}
            {activeForm.taskType === 'video' && (
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                {[
                  { id: 'all-ref', label: '全能参考' },
                  { id: 'first-last', label: '首尾帧' },
                  { id: 'single-image', label: '单图声视频' },
                ].map((item) => {
                  const active = activeForm.videoMode === (item.id as VideoMode);
                  return (
                    <button
                      key={item.id}
                      onClick={() => updateActiveForm({ videoMode: item.id as VideoMode })}
                      className={`h-8 px-3 rounded-md text-sm font-bold transition-colors ${
                        active ? 'bg-[#eef5e9] text-[#2b5f43]' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── Asset reference area ───────────────────────────────── */}
            <div>
              <div className="text-xs font-bold text-slate-700 mb-2">参考素材</div>
              <div className="flex flex-wrap gap-2">
                {currentAssets.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} onDelete={() => handleDeleteAsset(asset)} />
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-[56px] px-3 rounded-lg border-2 border-dashed border-slate-300 bg-white text-slate-400 hover:text-[#2b5f43] hover:border-[#6da768] transition-colors flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold min-w-[64px]"
                >
                  <Upload className="w-3.5 h-3.5" />
                  添加素材
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,audio/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* ── Prompt editor with @tag highlighting ──────────────── */}
            <PromptEditor
              value={activeForm.prompt}
              onChange={(v) => updateActiveForm({ prompt: v })}
              assets={currentAssets}
              label={activeForm.taskType === 'video' ? '视频提示词' : '画面提示词'}
            />

            {/* Model params */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">模型参数</div>
              <div className={`grid gap-2 ${activeForm.taskType === 'image' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <SelectField value={activeForm.model} onChange={(next) => updateActiveForm({ model: next })} options={['Seedance2.0', 'Vidu Q2Pro', 'Sora2', 'Nano Banana Pro']} />
                {activeForm.taskType === 'video' && (
                  <SelectField value={activeForm.duration} onChange={(next) => updateActiveForm({ duration: next })} options={['5s', '10s', '15s']} icon={<Clock3 className="w-3.5 h-3.5 text-slate-400" />} />
                )}
                <SelectField value={activeForm.ratio} onChange={(next) => updateActiveForm({ ratio: next })} options={activeForm.taskType === 'image' ? imageRatioOptions : videoRatioOptions} icon={<Film className="w-3.5 h-3.5 text-slate-400" />} />
                <SelectField value={activeForm.resolution} onChange={(next) => updateActiveForm({ resolution: next })} options={activeForm.taskType === 'image' ? imageResolutionOptions : videoResolutionOptions} icon={<SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />} />
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <button className="w-full rounded-xl py-2.5 bg-[#193d2c] hover:bg-[#2b5f43] text-[#f5f1e4] text-sm font-bold flex items-center justify-center gap-2 transition-colors">
              <Sparkles className="w-4 h-4 text-[#d8ec6a]" />
              {activeForm.taskType === 'video' ? '提交生视频任务' : '提交生图任务'}
            </button>
          </div>
        </section>

        {/* 右：历史记录 */}
        <section className="stage-pane flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-w-0">
          <div className="h-14 px-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <History className="w-4 h-4 text-[#6da768]" /> 历史记录
            </div>
            <div className="text-xs text-slate-500">{activeShot.title}</div>
          </div>

          <div className="h-full overflow-y-auto p-5 space-y-4">
            {visibleHistory.length === 0 && (
              <div className="h-[320px] rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                <PlayCircle className="w-8 h-8 mb-2" />
                <div className="text-sm font-bold">暂无历史记录</div>
                <div className="text-xs mt-1">提交任务后会在这里展示生成内容和参数</div>
              </div>
            )}

            {visibleHistory.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    {shots.filter((s) => !!s.thumb).slice(0, 4).map((s) => (
                      <img key={`${item.id}-${s.id}`} src={s.thumb} className="w-8 h-8 rounded-md object-cover border border-slate-200" referrerPolicy="no-referrer" />
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-slate-700 leading-relaxed line-clamp-2">{item.prompt}</div>
                    <div className="mt-1 text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                      <span>{item.model}</span>
                      <span>|</span>
                      <span>{item.params[0] ?? '--'}</span>
                      <span>|</span>
                      <span>{item.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={item.preview} className="w-full h-[320px] object-cover" referrerPolicy="no-referrer" />
                </div>

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <button className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold text-[13px] hover:bg-slate-50 inline-flex items-center gap-1.5">
                    <Pencil className="w-3.5 h-3.5" /> 重新编辑
                  </button>
                  <button className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold text-[13px] hover:bg-slate-50 inline-flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5" /> 再次生成
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SelectField({ value, onChange, options, icon }: { value: string; onChange: (next: string) => void; options: string[]; icon?: React.ReactNode }) {
  return (
    <div className="relative">
      {icon && <span className="absolute left-2.5 top-1/2 -translate-y-1/2">{icon}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 py-2 pr-8 outline-none focus:border-[#6da768] ${icon ? 'pl-8' : 'pl-3'}`}
      >
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}
