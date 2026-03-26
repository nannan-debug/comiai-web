import React, { useRef, useState } from 'react';
import {
  Home,
  PlaySquare,
  PenTool,
  ClipboardCheck,
  User,
  Link2,
  Bell,
  Film,
  Image as ImageIcon,
  LayoutTemplate,
  ChevronDown,
  RefreshCw,
  MoreHorizontal,
  Upload,
} from 'lucide-react';

type TaskMode = 'all' | 'multi-img2video' | 'first-last' | 'single-img2video';
type AssetType = 'character' | 'scene' | 'prop';
type RefAsset = { id: string; name: string; image: string; type: AssetType };

const referenceAssets = [
  { id: 'c-1', name: '美女', image: 'https://picsum.photos/seed/char-beauty/120/80', type: 'character' },
  { id: 'c-2', name: '帅哥', image: 'https://picsum.photos/seed/char-man/120/80', type: 'character' },
  { id: 's-1', name: '沙漠房间', image: 'https://picsum.photos/seed/scene-room/120/80', type: 'scene' },
  { id: 's-2', name: '秋天麦田', image: 'https://picsum.photos/seed/scene-wheat/120/80', type: 'scene' },
  { id: 'p-1', name: '菠萝蜜', image: 'https://picsum.photos/seed/prop-gold/120/80', type: 'prop' },
] as RefAsset[];

const records = [
  {
    id: 1,
    text: '3D动漫。可以自行增加景别、运镜方式，让画面更加流畅自然。不要字幕，不要字幕。',
    meta: '图片1 为此视频的场景，需要根据此场景延伸出多种角度的此场景，包括侧面、俯拍、仰拍，来适配各个镜头。人物与场景的大小关系正确。',
    model: 'Seedance 2.0',
    duration: '15s',
    image: 'https://picsum.photos/seed/video-record-a/980/560',
  },
  {
    id: 2,
    text: '3D动漫。可以自行增加景别、运镜方式，让画面更加流畅自然。不要字幕，不要字幕。',
    meta: '图片1 为此视频的场景，需要根据此场景延伸出多种角度的此场景，包括侧面、俯拍、仰拍，来适配各个镜头。人物与场景的大小关系正确。',
    model: 'Seedance 2.0',
    duration: '12s',
    image: 'https://picsum.photos/seed/video-record-b/980/560',
  },
];

export default function CreativeCenter({ onBack }: { onBack: () => void }) {
  const [taskMode, setTaskMode] = useState<TaskMode>('all');
  const [selectedModel, setSelectedModel] = useState('Seedance2.0');
  const [duration, setDuration] = useState('15s');
  const [resolution, setResolution] = useState('720p');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>(referenceAssets.map((item) => item.id));
  const [videoPromptText, setVideoPromptText] = useState(
    '@美女 营地中央火焰形成视觉焦点，@帅哥 在秋天的麦田里吟唱，@沙漠房间 玩弄 @菠萝蜜'
  );
  const [supplementPromptText, setSupplementPromptText] = useState('');
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionCursor, setMentionCursor] = useState(0);
  const promptRef = useRef<HTMLTextAreaElement | null>(null);
  const promptOverlayRef = useRef<HTMLDivElement | null>(null);
  const selectedAssets = referenceAssets.filter((item) => selectedAssetIds.includes(item.id));
  const mentionCandidates = selectedAssets.filter((item) => item.name.toLowerCase().includes(mentionQuery.toLowerCase()));
  const assetToneClass = (type: AssetType) => {
    if (type === 'character') return 'bg-[#08b87b]';
    if (type === 'scene') return 'bg-[#08a7b8]';
    return 'bg-[#b89900]';
  };
  const assetToneColor = (type: AssetType) => {
    if (type === 'character') return '#08b87b';
    if (type === 'scene') return '#08a7b8';
    return '#b89900';
  };
  const mentionsInText = (text: string) => {
    const matches = text.match(/@[\u4e00-\u9fa5A-Za-z0-9_-]+/g) || [];
    return matches.map((token) => token.slice(1));
  };
  const hasMention = (text: string, assetName: string) => mentionsInText(text).includes(assetName);
  const escapeHTML = (text: string) =>
    text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  const renderPromptWithTags = (text: string) => {
    const escaped = escapeHTML(text);
    return escaped.replace(/@([\u4e00-\u9fa5A-Za-z0-9_-]+)/g, (full, name) => {
      const target = selectedAssets.find((asset) => asset.name === name);
      if (!target) return full;
      const tone = assetToneColor(target.type);
      return `<span style="display:inline-block;padding:1px 10px;border-radius:999px;background:${tone};color:#fff;line-height:1.45;margin:0 1px;font-weight:600;">@${escapeHTML(
        name
      )}</span>`;
    });
  };
  const removeMentionFromText = (text: string, assetName: string) =>
    text
      .replace(new RegExp(`@${assetName}\\s*`, 'g'), '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  const toggleAssetSelection = (asset: RefAsset) => {
    const selected = selectedAssetIds.includes(asset.id);
    if (selected) {
      if (hasMention(videoPromptText, asset.name)) {
        const ok = window.confirm(`移除素材“${asset.name}”会同步移除视频提示词中的 @${asset.name}，是否继续？`);
        if (!ok) return;
        setVideoPromptText((prev) => removeMentionFromText(prev, asset.name));
      }
      setSelectedAssetIds((prev) => prev.filter((id) => id !== asset.id));
      return;
    }
    setSelectedAssetIds((prev) => [...prev, asset.id]);
    setVideoPromptText((prev) => (hasMention(prev, asset.name) ? prev : `${prev}${prev.endsWith(' ') || prev.length === 0 ? '' : ' '}@${asset.name} `));
  };
  const insertMention = (asset: RefAsset) => {
    const textarea = promptRef.current;
    if (!textarea) return;
    const before = videoPromptText.slice(0, mentionCursor).replace(/@[\u4e00-\u9fa5A-Za-z0-9_-]*$/, '');
    const after = videoPromptText.slice(mentionCursor);
    const nextText = `${before}@${asset.name} ${after}`;
    setVideoPromptText(nextText);
    setShowMentionMenu(false);
    setMentionQuery('');
    requestAnimationFrame(() => {
      const cursorPos = before.length + asset.name.length + 2;
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };
  const handleVideoPromptChange = (value: string) => {
    const prevMentions = new Set(mentionsInText(videoPromptText));
    const nextMentions = new Set(mentionsInText(value));
    const removed = [...prevMentions].filter((name) => !nextMentions.has(name));
    if (removed.length > 0) {
      const removedAsset = selectedAssets.find((item) => removed.includes(item.name));
      if (removedAsset) {
        const ok = window.confirm(`你删除了 @${removedAsset.name}，是否同步取消该参考素材？`);
        if (ok) {
          setSelectedAssetIds((prev) => prev.filter((id) => id !== removedAsset.id));
        }
      }
    }
    setVideoPromptText(value);
  };

  return (
    <div className="flex flex-col h-full bg-[#E8E9EA] overflow-hidden">
      <header className="h-16 bg-[#EBECEF] border-b border-[#d2d3d4] flex items-center justify-between px-4 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-emerald-600 font-black text-2xl italic tracking-tighter hover:opacity-85 transition-opacity"
          title="返回剧本项目页"
        >
          <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center text-white text-sm">N</div>
          NGSHOW
        </button>

        <div className="flex items-center bg-[#333A3F] rounded-full p-1.5 gap-1">
          <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <Home size={18} />
          </button>
          <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <PlaySquare size={18} />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#01cd74] text-white shadow-sm">
            <PenTool size={18} />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <ClipboardCheck size={18} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white"><User size={16} /></div>
          <div className="flex items-center gap-2 bg-[#23292E] px-3 py-1.5 rounded-full text-xs text-emerald-400 font-mono">
            <Link2 size={12} className="text-emerald-500" /> 24310
          </div>
          <div className="relative w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#EBECEF]">11</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden p-4">
        <div className="h-full flex gap-3">
          <aside className="w-12 rounded-2xl border border-[#d2d3d4] bg-[#f8f8f9] shadow-sm flex flex-col items-center py-3 gap-3 shrink-0">
            <button className="w-8 h-8 rounded-xl bg-[#d8f8ea] text-[#01cd74] flex items-center justify-center"><Film size={16} /></button>
            <button className="w-8 h-8 rounded-xl text-slate-400 hover:bg-slate-100 flex items-center justify-center"><ImageIcon size={16} /></button>
            <button className="w-8 h-8 rounded-xl text-slate-400 hover:bg-slate-100 flex items-center justify-center"><LayoutTemplate size={16} /></button>
          </aside>

          <aside className="w-[300px] rounded-2xl border border-[#d2d3d4] bg-[#f8f8f9] shadow-sm overflow-hidden flex flex-col">
            <div className="p-3 border-b border-[#d2d3d4]">
              <div className="flex flex-wrap gap-3 pb-2 border-b border-[#d2d3d4]">
                {[
                  { id: 'all', label: '全能参考' },
                  { id: 'multi-img2video', label: '多图生视频' },
                  { id: 'first-last', label: '首尾帧' },
                  { id: 'single-img2video', label: '单图生视频' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTaskMode(tab.id as TaskMode)}
                    className="inline-flex items-center gap-1.5 text-[12px] text-[#1c2329] hover:opacity-80 transition-opacity"
                  >
                    <span className={`w-3.5 h-3.5 rounded-full border ${taskMode === tab.id ? 'border-[#1c2329] bg-[#1c2329]' : 'border-[#1c2329] bg-transparent'}`} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 space-y-4">
              <div>
                <div className="text-xs font-semibold text-[#1c2329] mb-2">参考内容 <span className="text-[#8e9194] font-normal">(上限9个)</span></div>
                <div className="rounded-xl bg-[#eceeef] border border-[#d2d3d4] p-2">
                  <div className="grid grid-cols-4 gap-2">
                    {referenceAssets.map((asset) => (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => toggleAssetSelection(asset)}
                        className={`rounded-lg overflow-hidden border bg-white text-left transition-all ${
                          selectedAssetIds.includes(asset.id)
                            ? 'border-[#01cd74] shadow-[0_0_0_1px_rgba(1,205,116,0.22)]'
                            : 'border-slate-200 hover:border-[#9fdccb]'
                        }`}
                      >
                        <img src={asset.image} className="w-full h-14 object-cover" referrerPolicy="no-referrer" />
                        <div className={`text-[10px] text-white text-center py-0.5 font-medium ${assetToneClass(asset.type)}`}>{asset.name}</div>
                      </button>
                    ))}
                    <button className="h-[76px] rounded-lg border border-dashed border-[#8e9194] bg-[#f3f4f5] flex flex-col items-center justify-center text-[#8e9194] text-[11px] leading-4 hover:border-[#01cd74] hover:text-[#01cd74] transition-colors">
                      <Upload size={16} className="mb-1" />
                      本地上传
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#1c2329] mb-2">视频提示词</div>
                <div className="relative">
                  <div
                    ref={promptOverlayRef}
                    className="w-full h-[120px] ui-textarea bg-white whitespace-pre-wrap break-words overflow-y-auto leading-7 text-sm text-[#1c2329] pointer-events-none"
                    dangerouslySetInnerHTML={{ __html: renderPromptWithTags(videoPromptText) || '<span style="color:#9ca3af;">输入提示词，输入 @ 可快捷插入已绑定素材</span>' }}
                  />
                  <textarea
                    ref={promptRef}
                    value={videoPromptText}
                    onChange={(event) => {
                      const value = event.target.value;
                      handleVideoPromptChange(value);
                      const cursor = event.target.selectionStart || 0;
                      setMentionCursor(cursor);
                      const textBefore = value.slice(0, cursor);
                      const match = textBefore.match(/@([\u4e00-\u9fa5A-Za-z0-9_-]*)$/);
                      if (match) {
                        setMentionQuery(match[1] || '');
                        setShowMentionMenu(true);
                      } else {
                        setShowMentionMenu(false);
                      }
                    }}
                    onScroll={(event) => {
                      if (promptOverlayRef.current) {
                        promptOverlayRef.current.scrollTop = event.currentTarget.scrollTop;
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowMentionMenu(false), 120);
                    }}
                    className="absolute inset-0 w-full h-[120px] ui-textarea bg-transparent text-transparent caret-[#1c2329] selection:bg-sky-200 selection:text-transparent leading-7 text-sm resize-none"
                    placeholder="输入提示词，输入 @ 可快捷插入已绑定素材"
                  />
                  {showMentionMenu && mentionCandidates.length > 0 && (
                    <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 rounded-xl border border-[#d2d3d4] bg-white shadow-lg p-1.5 max-h-44 overflow-y-auto">
                      {mentionCandidates.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            insertMention(item);
                          }}
                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#f0fdf7] flex items-center gap-2"
                        >
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-white text-xs ${assetToneClass(item.type)}`}>@{item.name}</span>
                          <span className="text-xs text-[#8e9194]">{item.type === 'character' ? '角色' : item.type === 'scene' ? '场景' : '道具'}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#1c2329] mb-2">补充提示词</div>
                <textarea
                  className="w-full h-[88px] ui-textarea bg-white"
                  placeholder="请输入提示词"
                  value={supplementPromptText}
                  onChange={(event) => setSupplementPromptText(event.target.value)}
                />
              </div>

              <div>
                <div className="text-xs font-semibold text-[#1c2329] mb-2">模型设置</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="relative">
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full h-9 ui-input appearance-none text-xs pr-7"
                    >
                      <option>Seedance2.0</option>
                      <option>ViduQ2Pro</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full h-9 ui-input appearance-none text-xs pr-7">
                      <option>15s</option>
                      <option>12s</option>
                      <option>8s</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full h-9 ui-input appearance-none text-xs pr-7">
                      <option>720p</option>
                      <option>1080p</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-[#d2d3d4]">
              <button className="w-full h-10 rounded-xl bg-[#1c2329] text-white font-semibold inline-flex items-center justify-center gap-2">
                <span className="text-[#8ef2c8]">🪙10</span> 生成视频
              </button>
            </div>
          </aside>

          <main className="flex-1 rounded-2xl border border-[#d2d3d4] bg-[#f8f8f9] shadow-sm overflow-hidden flex flex-col">
            <div className="h-14 px-4 border-b border-[#d2d3d4] flex items-center">
              <h2 className="text-xl font-semibold text-[#1c2329]">视频记录</h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
              {records.map((record) => (
                <section key={record.id} className="bg-white border border-[#e2e8f0] rounded-xl p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-[#8e9194] mb-2">
                        <span className="font-semibold text-[#1c2329]">视频记录</span>
                        <span>{record.model}</span>
                        <span>{record.duration}</span>
                      </div>
                      <p className="text-sm text-[#1c2329] leading-7">{record.text}</p>
                      <p className="text-[13px] text-[#64748b] mt-2 leading-6">{record.meta}</p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg overflow-hidden border border-[#d2d3d4] bg-[#eceeef] max-w-[760px]">
                    <img src={record.image} alt={`record-${record.id}`} className="w-full h-[310px] object-cover" />
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button className="h-9 px-3 rounded-lg border border-[#d2d3d4] text-[#1c2329] text-sm inline-flex items-center gap-1.5 hover:bg-[#f8fafc]">
                      <RefreshCw size={14} />
                      重新编辑
                    </button>
                    <button className="h-9 px-3 rounded-lg border border-[#d2d3d4] text-[#1c2329] text-sm inline-flex items-center gap-1.5 hover:bg-[#f8fafc]">
                      <RefreshCw size={14} />
                      再次生成
                    </button>
                    <button className="h-9 w-9 rounded-lg border border-[#d2d3d4] text-[#1c2329] inline-flex items-center justify-center hover:bg-[#f8fafc]">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
