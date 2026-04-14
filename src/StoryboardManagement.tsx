import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen, PanelLeftClose, PanelLeftOpen, Cpu, Settings2, Play,
  Image as ImageIcon, Video, SlidersHorizontal, Trash2,
  Plus, Film, PlusCircle, Upload, Package, User, MapPin, X,
  Wand2, Loader2, Search, Check, Copy, Pencil,
} from 'lucide-react';
import { scriptApi, AnalysisResult } from './api';

// ── Types ────────────────────────────────────────────────────────────────────
type BoundAsset = { id: number; type: 'role' | 'scene' | 'prop'; label: string; avatar?: string };

// ── Prompt tag rendering ──────────────────────────────────────────────────────
function parsePromptSegments(text: string) {
  const regex = /<(user|scene|prop)>(.*?)<\/\1>/g;
  const segs: { type: string; content: string }[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) segs.push({ type: 'text', content: text.slice(last, m.index) });
    segs.push({ type: m[1], content: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) segs.push({ type: 'text', content: text.slice(last) });
  return segs;
}

const TAG_STYLE: Record<string, string> = {
  user: 'bg-violet-100 text-violet-700 border-violet-200',
  scene: 'bg-[#d1fae5] text-[#065f46] border-[#6da768]/50',
  prop: 'bg-amber-100 text-amber-700 border-amber-200',
};
const TAG_PREFIX: Record<string, string> = { user: '@', scene: '#', prop: '+' };

function InlineTag({ type, label, analysisResult }: { type: string; label: string; analysisResult: AnalysisResult | null }) {
  const [show, setShow] = useState(false);

  const info =
    type === 'user' ? analysisResult?.person?.find(p => p.name === label)
    : type === 'scene' ? analysisResult?.scence?.find(s => s.name === label)
    : analysisResult?.props?.find(p => p.name === label);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 rounded-md border text-[11px] font-semibold cursor-default align-middle ${TAG_STYLE[type] ?? ''}`}>
        <span className="opacity-60 text-[10px]">{TAG_PREFIX[type]}</span>{label}
      </span>
      {show && info && (
        <div className="absolute bottom-full left-0 mb-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-3 w-52 pointer-events-none">
          <div className="font-bold text-xs text-slate-800 mb-1">{label}</div>
          <div className="text-[10px] text-slate-500 leading-relaxed line-clamp-5">
            {'desc' in info ? (info as any).desc : ''}
          </div>
        </div>
      )}
    </span>
  );
}

function PromptDisplay({ text, analysisResult }: { text: string; analysisResult: AnalysisResult | null }) {
  if (!text) return <span className="text-slate-300 italic text-xs">暂无提示词，点击编辑填写</span>;
  const segs = parsePromptSegments(text);
  return (
    <span className="text-xs text-slate-700 leading-relaxed">
      {segs.map((seg, i) =>
        seg.type === 'text'
          ? <span key={i}>{seg.content}</span>
          : <InlineTag key={i} type={seg.type} label={seg.content} analysisResult={analysisResult} />
      )}
    </span>
  );
}

// ── Asset Library Modal ───────────────────────────────────────────────────────
function AssetLibraryModal({
  analysisResult,
  currentAssets,
  onConfirm,
  onClose,
}: {
  analysisResult: AnalysisResult | null;
  currentAssets: BoundAsset[];
  onConfirm: (assets: BoundAsset[]) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<BoundAsset[]>([]);
  const [activeTab, setActiveTab] = useState<'role' | 'scene' | 'prop'>('role');

  const allAssets: BoundAsset[] = [
    ...(analysisResult?.person ?? []).map((p, i) => ({ id: i, type: 'role' as const, label: p.name })),
    ...(analysisResult?.scence ?? []).map((s, i) => ({ id: 100 + i, type: 'scene' as const, label: s.name })),
    ...(analysisResult?.props ?? []).map((p, i) => ({ id: 200 + i, type: 'prop' as const, label: p.name })),
  ];

  const currentKeys = new Set(currentAssets.map(a => `${a.type}-${a.label}`));
  const filtered = allAssets.filter(a => a.type === activeTab && a.label.includes(search));

  const tabCounts = {
    role: allAssets.filter(a => a.type === 'role').length,
    scene: allAssets.filter(a => a.type === 'scene').length,
    prop: allAssets.filter(a => a.type === 'prop').length,
  };

  const toggle = (asset: BoundAsset) => {
    setSelected(prev =>
      prev.some(s => s.id === asset.id) ? prev.filter(s => s.id !== asset.id) : [...prev, asset]
    );
  };

  const GRAD: Record<string, string> = {
    role: 'from-violet-50 to-slate-100',
    scene: 'from-emerald-50 to-slate-100',
    prop: 'from-amber-50 to-slate-100',
  };
  const ICON: Record<string, React.ReactNode> = {
    role: <User className="w-7 h-7 text-violet-300" />,
    scene: <MapPin className="w-7 h-7 text-emerald-300" />,
    prop: <Package className="w-7 h-7 text-amber-300" />,
  };
  const TYPE_LABEL: Record<string, string> = { role: '角色', scene: '场景', prop: '道具' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[520px] max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#6da768]" /> 资源库
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-slate-100 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:border-[#6da768] bg-slate-50 focus:bg-white transition-colors"
              placeholder="搜索角色、场景或道具..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 pb-3 shrink-0 flex gap-1">
          {([
            { key: 'role', label: '角色', icon: <User className="w-3 h-3" /> },
            { key: 'scene', label: '场景', icon: <MapPin className="w-3 h-3" /> },
            { key: 'prop', label: '道具', icon: <Package className="w-3 h-3" /> },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === tab.key
                  ? 'bg-[#193d2c] text-[#d8ec6a]'
                  : 'bg-[#f0ece0] text-[#2b5f43] hover:bg-[#e9f2df]'
              }`}
            >
              {tab.icon}{tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab.key ? 'bg-[#2b5f43] text-[#d8ec6a]' : 'bg-[#d7ead6] text-[#2b5f43]'
              }`}>
                {tabCounts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Package className="w-8 h-8 opacity-20" />
              <span className="text-sm">{analysisResult ? '未找到匹配资产' : '请先在左侧提取设定资产'}</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {filtered.map(asset => {
                const isSelected = selected.some(s => s.id === asset.id);
                const alreadyBound = currentKeys.has(`${asset.type}-${asset.label}`);
                return (
                  <button
                    key={asset.id}
                    onClick={() => !alreadyBound && toggle(asset)}
                    disabled={alreadyBound}
                    className={`rounded-xl border-2 overflow-hidden text-left transition-all ${
                      alreadyBound
                        ? 'border-slate-100 opacity-40 cursor-not-allowed'
                        : isSelected
                        ? 'border-[#2b5f43] shadow-md shadow-[#2b5f43]/10'
                        : 'border-slate-200 hover:border-[#9fc79b]'
                    }`}
                  >
                    <div className={`h-20 bg-gradient-to-br ${GRAD[asset.type]} flex items-center justify-center relative`}>
                      {ICON[asset.type]}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#2b5f43] flex items-center justify-center shadow">
                          <Check className="w-3 h-3 text-[#d8ec6a]" />
                        </div>
                      )}
                      {alreadyBound && (
                        <div className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-slate-400 text-white px-1.5 py-0.5 rounded">已绑定</div>
                      )}
                    </div>
                    <div className="p-2">
                      <div className="text-xs font-bold text-slate-800 truncate">{asset.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{TYPE_LABEL[asset.type]}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">已选 {selected.length} 个</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              取消
            </button>
            <button
              onClick={() => { onConfirm(selected); onClose(); }}
              disabled={selected.length === 0}
              className="px-4 py-2 text-xs font-bold bg-[#193d2c] text-[#d8ec6a] rounded-xl hover:bg-[#2b5f43] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              确认选择（{selected.length}）
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shot Row (table row) ──────────────────────────────────────────────────────
function ShotRow({
  shotNumber,
  analysisResult,
  storageKey,
  onDelete,
  onNext,
}: {
  shotNumber: number;
  analysisResult: AnalysisResult | null;
  storageKey: string | null;
  onDelete: () => void;
  onNext: () => void;
}) {
  const lensItem = analysisResult?.lens?.[shotNumber - 1];
  const [boundAssets, setBoundAssets] = useState<BoundAsset[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [refImages, setRefImages] = useState<string[]>([]);
  const uploadRef = useRef<HTMLInputElement>(null);
  const didInit = useRef(false);

  // Initialise from localStorage (if exists) or derive from lensItem
  useEffect(() => {
    didInit.current = false;
    if (!lensItem) { setBoundAssets([]); setPrompt(''); didInit.current = true; return; }

    if (storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const { prompt: sp, boundAssets: sb } = JSON.parse(saved);
          if (sp !== undefined) setPrompt(sp);
          if (sb !== undefined) setBoundAssets(sb);
          didInit.current = true;
          return;
        }
      } catch { /* ignore */ }
    }

    // Fall back to lensItem-derived state
    const stripTags = (s: string) => s.replace(/<[^>]+>/g, '').trim();
    const initial: BoundAsset[] = [];
    lensItem.person?.split(/[,，]/).map(s => stripTags(s)).filter(Boolean).forEach((name, i) => {
      const personInfo = analysisResult?.person?.find(p => p.name === name);
      initial.push({ id: i, type: 'role', label: name, avatar: (personInfo as any)?.image ?? undefined });
    });
    lensItem.scence_name?.split(/[,，]/).map(s => stripTags(s)).filter(Boolean).forEach((name, i) => {
      const sceneInfo = analysisResult?.scence?.find(sc => sc.name === name);
      initial.push({ id: 100 + i, type: 'scene', label: name, avatar: (sceneInfo as any)?.image ?? undefined });
    });
    lensItem.props?.split(/[,，]/).map(s => stripTags(s)).filter(Boolean).forEach((name, i) => {
      initial.push({ id: 200 + i, type: 'prop', label: name });
    });
    setBoundAssets(initial);
    setPrompt(lensItem.video_prompt ?? '');
    didInit.current = true;
  }, [lensItem, analysisResult, storageKey]);

  // Persist changes to localStorage
  useEffect(() => {
    if (!storageKey || !didInit.current) return;
    localStorage.setItem(storageKey, JSON.stringify({ prompt, boundAssets }));
  }, [prompt, boundAssets, storageKey]);

  const roles = boundAssets.filter(a => a.type === 'role');
  const scenes = boundAssets.filter(a => a.type === 'scene');

  const handleAddAssets = (assets: BoundAsset[]) => {
    setBoundAssets(prev => {
      const keys = new Set(prev.map(a => `${a.type}-${a.label}`));
      return [...prev, ...assets.filter(a => !keys.has(`${a.type}-${a.label}`))];
    });
  };

  return (
    <div className="flex items-stretch bg-white rounded-2xl border border-slate-200 hover:border-[#9fc79b] transition-colors shadow-sm overflow-hidden group/row min-h-[160px]">

      {/* ① 序号 + 操作 */}
      <div className="w-12 bg-slate-50/60 border-r border-slate-100 flex flex-col items-center pt-4 gap-2.5 shrink-0">
        <span className="font-bold text-slate-700 bg-white border border-slate-200 w-7 h-7 flex items-center justify-center rounded-full shadow-sm text-xs shrink-0">
          {shotNumber}
        </span>
        <div className="flex flex-col gap-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button onClick={onNext} className="w-7 h-7 rounded-lg bg-[#e9f2df] border border-[#6da768]/30 text-[#2b5f43] flex items-center justify-center hover:bg-[#d7ead6] transition-colors" title="进入精修">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:text-slate-600 transition-colors" title="复制">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:text-red-500 hover:border-red-200 transition-colors" title="删除">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ② 出镜主体 + 参考垫图 */}
      <div className="w-52 border-r border-slate-100 p-3 flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">出镜主体</span>
          <button
            onClick={() => setShowLibrary(true)}
            className="w-5 h-5 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-[#2b5f43] hover:border-[#6da768] transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {roles.length > 0 && (
          <div>
            <div className="text-[9px] text-slate-400 mb-1 font-bold uppercase">角色</div>
            <div className="flex flex-wrap gap-1.5">
              {roles.map(r => (
                <span key={r.id} className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-[10px] font-bold pl-0.5 pr-2 py-0.5 rounded-full">
                  {r.avatar
                    ? <img src={r.avatar} className="w-5 h-5 rounded-full object-cover border border-violet-200 shrink-0" />
                    : <span className="w-5 h-5 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center shrink-0">
                        <User className="w-2.5 h-2.5 text-violet-400" />
                      </span>
                  }
                  {r.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {scenes.length > 0 && (
          <div>
            <div className="text-[9px] text-slate-400 mb-1 font-bold uppercase">场景</div>
            <div className="flex flex-wrap gap-1.5">
              {scenes.map(s => (
                <span key={s.id} className="inline-flex items-center gap-1.5 bg-[#d1fae5] border border-[#6da768]/40 text-[#065f46] text-[10px] font-bold pl-0.5 pr-2 py-0.5 rounded-lg">
                  {s.avatar
                    ? <img src={s.avatar} className="w-5 h-5 rounded-md object-cover border border-[#6da768]/30 shrink-0" />
                    : <span className="w-5 h-5 rounded-md bg-[#bbf7d0] border border-[#6da768]/30 flex items-center justify-center shrink-0">
                        <MapPin className="w-2.5 h-2.5 text-[#6da768]" />
                      </span>
                  }
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {boundAssets.length === 0 && (
          <button
            onClick={() => setShowLibrary(true)}
            className="w-full border border-dashed border-slate-200 rounded-lg py-2 text-[10px] text-slate-400 hover:text-[#2b5f43] hover:border-[#6da768] hover:bg-[#f5faee] transition-colors"
          >
            + 绑定资产
          </button>
        )}

        {/* 参考垫图 */}
        <div className="mt-auto pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] text-slate-400 font-bold uppercase">参考垫图</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {refImages.map((img, i) => (
              <div key={i} className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-200 group/img shrink-0">
                <img src={img} className="w-full h-full object-cover" />
                <button
                  onClick={() => setRefImages(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            <button
              onClick={() => uploadRef.current?.click()}
              className="w-9 h-9 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center hover:border-[#6da768] hover:bg-[#f5faee] transition-colors shrink-0"
              title="上传垫图"
            >
              <Upload className="w-3 h-3 text-slate-300" />
            </button>
          </div>
          <input
            ref={uploadRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => {
              const files: File[] = e.target.files ? Array.from(e.target.files) : [];
              setRefImages(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
              e.target.value = '';
            }}
          />
        </div>
      </div>

      {/* ④ 视频提示词 */}
      <div className="flex-1 p-3 flex flex-col gap-2 min-w-0">
        <div className="flex items-center justify-between shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">视频提示词</span>
          <span className="text-[9px] font-bold text-[#2b5f43] bg-[#e9f2df] px-1.5 py-0.5 rounded cursor-pointer hover:bg-[#d7ead6] transition-colors border border-[#6da768]/25">
            AI 优化
          </span>
        </div>

        <div className="flex-1 relative group/prompt">
          <textarea
            className="w-full h-full min-h-[100px] text-xs text-slate-700 bg-transparent border border-transparent rounded-xl p-2 resize-none outline-none hover:border-slate-200 hover:bg-slate-50/60 focus:border-[#6da768] focus:bg-white leading-relaxed transition-colors placeholder:text-slate-300"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="暂无提示词，直接输入…"
          />
        </div>
      </div>

      {/* ⑤ 预览与生成 */}
      <div className="w-36 border-l border-slate-100 p-3 flex flex-col gap-2 shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">预览与生成</span>
        <div className="flex gap-1 shrink-0">
          <button className="flex-1 py-1 text-[10px] font-bold border border-slate-200 rounded-lg hover:border-[#6da768] hover:bg-[#f5faee] text-slate-500 transition-colors">
            图生
          </button>
          <button className="flex-1 py-1 text-[10px] font-bold bg-[#e9f2df] border border-[#6da768]/40 rounded-lg text-[#2b5f43]">
            直出
          </button>
        </div>
        <button className="flex-1 border-2 border-dashed border-[#6da768] rounded-xl flex flex-col items-center justify-center bg-[#f5faee] hover:bg-[#e9f2df] transition-colors cursor-pointer min-h-[80px] group/gen">
          <Video className="w-5 h-5 text-[#6da768] mb-1 group-hover/gen:scale-110 transition-transform" />
          <span className="text-[10px] font-bold text-[#2b5f43]">点击直出视频</span>
          <span className="text-[9px] text-[#6da768]/80 font-bold mt-0.5">消耗 10 算力</span>
        </button>
      </div>

      {showLibrary && (
        <AssetLibraryModal
          analysisResult={analysisResult}
          currentAssets={boundAssets}
          onConfirm={handleAddAssets}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function StoryboardManagement({
  onNext,
  scriptContent,
  episodeId,
}: {
  onNext: () => void;
  scriptContent?: string;
  episodeId?: number;
}) {
  const [isScriptPanelOpen, setIsScriptPanelOpen] = useState(true);
  const [shots, setShots] = useState<number[]>([]);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showAssetManager, setShowAssetManager] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isEditingScript, setIsEditingScript] = useState(false);
  const [savedScript, setSavedScript] = useState(scriptContent ?? '');
  const [draftScript, setDraftScript] = useState(scriptContent ?? '');

  // Restore analysis on mount
  useEffect(() => {
    if (!episodeId) return;
    // Try localStorage override first (includes user edits to assets)
    const lsKey = `comiai_analysis_${episodeId}`;
    const cached = localStorage.getItem(lsKey);
    if (cached) {
      try {
        const result: AnalysisResult = JSON.parse(cached);
        if (result.lens?.length) {
          setAnalysisResult(result);
          setShots(Array.from({ length: result.lens.length }, (_, i) => i + 1));
          return;
        }
      } catch { /* ignore */ }
    }
    // Fall back to backend
    scriptApi.getAnalysis(episodeId).then(result => {
      if (result?.lens?.length) {
        setAnalysisResult(result);
        setShots(Array.from({ length: result.lens.length }, (_, i) => i + 1));
      }
    }).catch(() => {});
  }, [episodeId]);

  const persistAnalysis = (result: AnalysisResult) => {
    setAnalysisResult(result);
    if (episodeId) localStorage.setItem(`comiai_analysis_${episodeId}`, JSON.stringify(result));
  };

  const handleEditToggle = () => {
    if (isEditingScript) {
      setSavedScript(draftScript);
      setIsEditingScript(false);
      setAnalysisResult(null);
    } else {
      setDraftScript(savedScript);
      setIsEditingScript(true);
    }
  };

  const handleExtract = async () => {
    if (!savedScript.trim()) return;
    setParseError(null);
    setIsParsing(true);
    try {
      const result = await scriptApi.split(savedScript, episodeId);
      const lensCount = result?.lens?.length ?? 6;
      // Clear stale per-shot data so fresh AI data is used
      if (episodeId) {
        for (let i = 1; i <= lensCount + 5; i++) {
          localStorage.removeItem(`comiai_shot_${episodeId}_${i}`);
        }
      }
      persistAnalysis(result);
      setShots(Array.from({ length: lensCount }, (_, i) => i + 1));
      setShowAssetManager(true);
    } catch (e: any) {
      setParseError(e.message ?? '解析失败，请重试');
    } finally {
      setIsParsing(false);
    }
  };

  const hasParsed = !!analysisResult && (
    (analysisResult.person?.length ?? 0) > 0 ||
    (analysisResult.scence?.length ?? 0) > 0 ||
    (analysisResult.lens?.length ?? 0) > 0
  );

  const handleDeleteShot = (id: number) => setShots(prev => prev.filter(s => s !== id));

  const handleAddShot = () => {
    const newId = shots.length > 0 ? Math.max(...shots) + 1 : 1;
    setShots(prev => [...prev, newId]);
  };

  return (
    <div className="stage-shell flex-1 flex flex-col overflow-hidden p-3 gap-3 pb-0">
      <div className="flex-1 flex overflow-hidden gap-3">

        {/* 左侧：剧本 */}
        <aside className={`stage-pane bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden transition-all duration-300 shrink-0 ${
          isScriptPanelOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 invisible border-none'
        }`}>
          <div className="px-4 h-[52px] border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
            <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#6da768]" /> 剧本
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEditToggle}
                className="text-xs text-slate-500 hover:text-[#2b5f43] font-bold px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
              >
                {isEditingScript ? '保存编辑' : '编辑'}
              </button>
              <button
                onClick={() => setIsScriptPanelOpen(false)}
                className="text-slate-400 hover:text-[#2b5f43] p-1 rounded-lg hover:bg-[#e9f2df] transition-colors"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50/30 relative custom-scrollbar">
            {isEditingScript ? (
              <textarea
                className="w-full h-full p-4 resize-none outline-none text-xs text-slate-600 font-medium leading-relaxed bg-transparent"
                value={draftScript}
                onChange={e => setDraftScript(e.target.value)}
                placeholder="在此输入剧本内容..."
              />
            ) : savedScript.trim() ? (
              <pre className="p-4 text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-sans">{savedScript}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                <BookOpen className="w-8 h-8" />
                <span className="text-xs">暂无剧本内容</span>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-100 bg-white shrink-0">
            <button
              onClick={handleExtract}
              disabled={isParsing || isEditingScript || !savedScript.trim()}
              className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isParsing
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> AI 提取中...</>
                : isEditingScript
                ? <><Wand2 className="w-3.5 h-3.5 text-violet-400" /> 请先保存编辑</>
                : <><Wand2 className="w-3.5 h-3.5 text-violet-400" />{hasParsed ? '重新提取资产' : '智能提取角色/场景'}</>
              }
            </button>
            {parseError && <p className="text-[10px] text-red-500 mt-1.5 text-center">{parseError}</p>}
            {hasParsed && !isParsing && (
              <button
                onClick={() => setShowAssetManager(true)}
                className="w-full mt-2 py-1.5 bg-[#e9f2df] hover:bg-[#d7ead6] text-[#2b5f43] border border-[#6da768]/40 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Package className="w-3.5 h-3.5" /> 查看设定资产
              </button>
            )}
          </div>
        </aside>

        {/* 右侧：分镜列表 */}
        <main className="stage-pane flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative min-w-0">
          {/* 工具栏 */}
          <div className="border-b border-slate-100 px-6 h-[52px] shrink-0 flex items-center justify-between z-30 bg-slate-50/50">
            <div className="flex items-center gap-4">
              {!isScriptPanelOpen && (
                <>
                  <button
                    onClick={() => setIsScriptPanelOpen(true)}
                    className="text-slate-400 hover:text-[#2b5f43] p-1.5 rounded-lg hover:bg-[#e9f2df] transition-colors border border-slate-200 bg-white shadow-sm"
                  >
                    <PanelLeftOpen className="w-4 h-4" />
                  </button>
                  <span className="h-5 w-px bg-slate-200" />
                </>
              )}
              <span className="text-sm font-bold text-slate-800">
                全集分镜管理 <span className="text-xs font-normal text-slate-500 ml-1">(共 {shots.length} 镜)</span>
              </span>
              <button
                onClick={() => setShowAssetManager(true)}
                className="px-2.5 py-1 text-[11px] font-bold bg-white text-[#2b5f43] border border-slate-200 rounded-lg hover:bg-[#f5faee] hover:border-[#6da768] transition-colors inline-flex items-center gap-1.5 shadow-sm"
              >
                <Package className="w-3.5 h-3.5" /> 设定资产
                {hasParsed && <span className="w-1.5 h-1.5 rounded-full bg-[#6da768]" />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowModelMenu(!showModelMenu)}
                  className="px-3 py-1.5 text-[11px] font-bold bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-[#2b5f43] flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Cpu className="w-3.5 h-3.5" /> 模型偏好
                </button>
                {showModelMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                    <div className="text-xs font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <Settings2 className="w-3.5 h-3.5 text-[#6da768]" /> 批量生成默认引擎
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">默认生图模型</label>
                        <select className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none focus:border-[#9fc79b]">
                          <option>Midjourney v6.0</option>
                          <option>Stable Diffusion XL</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">默认生视频模型</label>
                        <select className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none focus:border-[#9fc79b]">
                          <option>Vidu Q2Pro</option>
                          <option>Sora</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                      <button onClick={() => setShowModelMenu(false)} className="text-[11px] font-bold bg-slate-800 text-white px-4 py-1.5 rounded-xl hover:bg-slate-900 transition-colors shadow-md active:scale-95">
                        应用配置
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={onNext}
                className="px-4 py-1.5 text-[11px] font-bold rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all bg-[#193d2c] hover:bg-[#2b5f43] text-[#d8ec6a]"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> 批量执行生成
              </button>
            </div>
          </div>

          {/* 列表 */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30 pb-20 custom-scrollbar">
            {shots.length === 0 && (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Film className="w-12 h-12 opacity-20" />
                <p className="text-sm font-medium">暂无分镜</p>
                <p className="text-xs text-slate-400">在左侧剧本面板点击"智能提取"，AI 将自动生成分镜列表</p>
              </div>
            )}
            {shots.map((shot, index) => (
              <ShotRow
                key={shot}
                shotNumber={index + 1}
                analysisResult={analysisResult}
                storageKey={episodeId ? `comiai_shot_${episodeId}_${index + 1}` : null}
                onDelete={() => handleDeleteShot(shot)}
                onNext={onNext}
              />
            ))}
            <div className="pt-2 pb-6">
              <button
                onClick={handleAddShot}
                className="w-full border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center py-5 text-slate-500 hover:text-[#2b5f43] hover:border-[#6da768] hover:bg-[#e9f2df] cursor-pointer transition-all bg-white/50 active:scale-[0.99]"
              >
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5" />
                  <span className="font-bold text-sm">新增一条分镜</span>
                </div>
              </button>
            </div>
          </div>

          {showAssetManager && (
            <AssetManagerOverlay
              analysisResult={analysisResult}
              onUpdateAnalysis={persistAnalysis}
              onClose={() => setShowAssetManager(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// ── Asset edit types ──────────────────────────────────────────────────────────
type EditableAsset = { name: string; desc: string; feature?: string; image?: string };

// ── Asset Edit Modal ──────────────────────────────────────────────────────────
function AssetEditModal({
  asset,
  colorClass,
  placeholderIcon,
  onSave,
  onClose,
}: {
  asset: EditableAsset;
  colorClass: string;
  placeholderIcon: React.ReactNode;
  onSave: (updated: EditableAsset) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(asset.name);
  const [desc, setDesc] = useState(asset.desc);
  const [image, setImage] = useState(asset.image);
  const imgRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-[400px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Pencil className="w-4 h-4 text-[#6da768]" /> 编辑资产
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Image area */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">参考图</label>
            <div className={`relative h-36 rounded-xl overflow-hidden bg-gradient-to-br ${colorClass} flex items-center justify-center group/imgarea`}>
              {image
                ? <img src={image} className="w-full h-full object-cover" />
                : placeholderIcon
              }
              {/* Hover overlay with upload action */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/imgarea:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                <button
                  onClick={() => imgRef.current?.click()}
                  className="flex items-center gap-1.5 bg-white/90 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-white transition-colors shadow-sm"
                >
                  <Upload className="w-3 h-3" /> 上传图片
                </button>
                {image && (
                  <button
                    onClick={() => setImage(undefined)}
                    className="flex items-center gap-1.5 bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-500 transition-colors shadow-sm"
                  >
                    <X className="w-3 h-3" /> 移除
                  </button>
                )}
              </div>
            </div>
            <input
              ref={imgRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) setImage(URL.createObjectURL(f));
                e.target.value = '';
              }}
            />
            {!image && (
              <button
                onClick={() => imgRef.current?.click()}
                className="w-full mt-2 py-1.5 text-xs font-bold border border-dashed border-slate-200 rounded-lg text-slate-500 hover:border-[#6da768] hover:text-[#2b5f43] hover:bg-[#f5faee] transition-colors"
              >
                上传参考图
              </button>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">名称</label>
            <input
              className="w-full px-3 py-2 text-sm text-slate-800 font-bold border border-slate-200 rounded-xl outline-none focus:border-[#6da768] bg-slate-50 focus:bg-white transition-colors"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="资产名称"
            />
          </div>

          {/* Desc */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">描述信息</label>
            <textarea
              className="w-full px-3 py-2 text-xs text-slate-600 border border-slate-200 rounded-xl outline-none focus:border-[#6da768] bg-slate-50 focus:bg-white transition-colors resize-none leading-relaxed"
              rows={4}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="外观、特征等描述..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            取消
          </button>
          <button
            onClick={() => { onSave({ ...asset, name: name.trim() || asset.name, desc, image }); onClose(); }}
            className="px-4 py-2 text-xs font-bold bg-[#193d2c] text-[#d8ec6a] rounded-xl hover:bg-[#2b5f43] transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Asset Card ────────────────────────────────────────────────────────────────
function AnalysisAssetCard({
  asset,
  colorClass,
  icon,
  onEdit,
  onDelete,
}: {
  asset: EditableAsset;
  colorClass: string;
  icon: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-[#9fc79b] transition-colors group/card">
      {/* Image / placeholder */}
      <div className={`relative h-28 bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
        {asset.image
          ? <img src={asset.image} className="w-full h-full object-cover" />
          : icon
        }
        {/* Hover action buttons */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="w-6 h-6 rounded-md bg-white/90 shadow-sm flex items-center justify-center text-slate-600 hover:text-[#2b5f43] hover:bg-white transition-colors"
            title="编辑"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="w-6 h-6 rounded-md bg-white/90 shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white transition-colors"
            title="删除"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="p-3">
        <div className="font-bold text-sm text-slate-800 mb-1">{asset.name}</div>
        <div className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{asset.desc}</div>
      </div>
    </div>
  );
}

// ── 设定资产覆盖层 ──────────────────────────────────────────────────────────
function AssetManagerOverlay({
  analysisResult,
  onUpdateAnalysis,
  onClose,
}: {
  analysisResult: AnalysisResult | null;
  onUpdateAnalysis: (r: AnalysisResult) => void;
  onClose: () => void;
}) {
  const [persons, setPersons] = useState<EditableAsset[]>(() => analysisResult?.person ?? []);
  const [scenes, setScenes] = useState<EditableAsset[]>(() => analysisResult?.scence ?? []);
  const [props, setProps] = useState<EditableAsset[]>(() => analysisResult?.props ?? []);
  const [editTarget, setEditTarget] = useState<{ list: 'person' | 'scence' | 'props'; index: number } | null>(null);

  const syncUp = (p: EditableAsset[], sc: EditableAsset[], pr: EditableAsset[]) => {
    if (!analysisResult) return;
    onUpdateAnalysis({ ...analysisResult, person: p as any, scence: sc as any, props: pr as any });
  };

  const handleSave = (list: 'person' | 'scence' | 'props', index: number, updated: EditableAsset) => {
    const next = (arr: EditableAsset[]) => arr.map((a, i) => i === index ? updated : a);
    if (list === 'person') { const p = next(persons); setPersons(p); syncUp(p, scenes, props); }
    else if (list === 'scence') { const s = next(scenes); setScenes(s); syncUp(persons, s, props); }
    else { const pr = next(props); setProps(pr); syncUp(persons, scenes, pr); }
  };

  const handleDelete = (list: 'person' | 'scence' | 'props', index: number) => {
    const next = (arr: EditableAsset[]) => arr.filter((_, i) => i !== index);
    if (list === 'person') { const p = next(persons); setPersons(p); syncUp(p, scenes, props); }
    else if (list === 'scence') { const s = next(scenes); setScenes(s); syncUp(persons, s, props); }
    else { const pr = next(props); setProps(pr); syncUp(persons, scenes, pr); }
  };

  const hasData = persons.length > 0 || scenes.length > 0 || props.length > 0;

  // determine the asset being edited
  const getEditAsset = (): { asset: EditableAsset; colorClass: string; icon: React.ReactNode } | null => {
    if (!editTarget) return null;
    const { list, index } = editTarget;
    if (list === 'person') return { asset: persons[index], colorClass: 'from-violet-50 to-slate-100', icon: <User className="w-12 h-12 text-violet-200" /> };
    if (list === 'scence') return { asset: scenes[index], colorClass: 'from-emerald-50 to-slate-100', icon: <MapPin className="w-12 h-12 text-emerald-200" /> };
    return { asset: props[index], colorClass: 'from-amber-50 to-slate-100', icon: <Package className="w-12 h-12 text-amber-200" /> };
  };

  const editCtx = getEditAsset();

  return (
    <div className="absolute inset-0 z-40 bg-white flex flex-col">
      <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Package className="w-4 h-4 text-[#6da768]" /> 设定资产管理
        </h3>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-[#2b5f43] hover:border-[#6da768] transition-colors flex items-center justify-center">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 space-y-8 custom-scrollbar">
        {!hasData && (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Package className="w-12 h-12 opacity-20" />
            <p className="text-sm font-medium">暂无资产</p>
            <p className="text-xs">在左侧剧本面板点击"智能提取"后，角色、场景与道具会自动显示在这里</p>
          </div>
        )}

        {persons.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-[#6da768]" /> 角色 ({persons.length})
              </h4>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {persons.map((p, i) => (
                <AnalysisAssetCard
                  key={i}
                  asset={p}
                  colorClass="from-violet-50 to-slate-100"
                  icon={<User className="w-8 h-8 text-violet-300" />}
                  onEdit={() => setEditTarget({ list: 'person', index: i })}
                  onDelete={() => handleDelete('person', i)}
                />
              ))}
            </div>
          </section>
        )}

        {scenes.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#6da768]" /> 场景 ({scenes.length})
              </h4>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {scenes.map((s, i) => (
                <AnalysisAssetCard
                  key={i}
                  asset={s}
                  colorClass="from-emerald-50 to-slate-100"
                  icon={<MapPin className="w-8 h-8 text-emerald-300" />}
                  onEdit={() => setEditTarget({ list: 'scence', index: i })}
                  onDelete={() => handleDelete('scence', i)}
                />
              ))}
            </div>
          </section>
        )}

        {props.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#6da768]" /> 核心道具 ({props.length})
              </h4>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {props.map((prop, i) => (
                <AnalysisAssetCard
                  key={i}
                  asset={prop}
                  colorClass="from-amber-50 to-slate-100"
                  icon={<Package className="w-8 h-8 text-amber-300" />}
                  onEdit={() => setEditTarget({ list: 'props', index: i })}
                  onDelete={() => handleDelete('props', i)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {editCtx && editTarget && (
        <AssetEditModal
          asset={editCtx.asset}
          colorClass={editCtx.colorClass}
          placeholderIcon={editCtx.icon}
          onSave={updated => handleSave(editTarget.list, editTarget.index, updated)}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  );
}
