import React, { useState, useMemo } from 'react';
import { ChevronDown, Edit3, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

interface Episode {
  label: string;
  content: string;
}

const CN_NUM: Record<string, number> = {
  零:0, 一:1, 二:2, 三:3, 四:4, 五:5, 六:6, 七:7, 八:8, 九:9,
};

function cnToArabic(s: string): number {
  // 处理 十、二十、三十五 等简单格式
  if (/^\d+$/.test(s)) return parseInt(s, 10);
  let result = 0;
  let temp = 0;
  for (const ch of s) {
    const n = CN_NUM[ch];
    if (ch === '十') {
      result += (temp || 1) * 10;
      temp = 0;
    } else if (ch === '百') {
      result += (temp || 1) * 100;
      temp = 0;
    } else if (ch === '千') {
      result += (temp || 1) * 1000;
      temp = 0;
    } else if (n !== undefined) {
      temp = n;
    }
  }
  return result + temp;
}

function normalizeLabel(label: string): string {
  const m = label.match(/^第([零一二三四五六七八九十百千\d]+)集$/);
  if (!m) return label;
  const num = cnToArabic(m[1]);
  return `第${num}集`;
}

function parseEpisodes(content: string): Episode[] {
  const lines = content.split('\n');
  const episodes: Episode[] = [];
  const pattern = /^第[零一二三四五六七八九十百千\d]+集\s*$/;

  let currentLabel: string | null = null;
  let currentLines: string[] = [];

  for (const line of lines) {
    if (pattern.test(line.trim())) {
      if (currentLabel !== null) {
        episodes.push({ label: currentLabel, content: currentLines.join('\n').trim() });
      }
      currentLabel = normalizeLabel(line.trim());
      currentLines = [];
    } else {
      if (currentLabel !== null) currentLines.push(line);
    }
  }
  if (currentLabel !== null) {
    episodes.push({ label: currentLabel, content: currentLines.join('\n').trim() });
  }

  if (episodes.length === 0 && content.trim()) {
    episodes.push({ label: '第一集', content: content.trim() });
  }

  return episodes;
}

export default function ScriptSplitView({
  content,
  filename,
  onBack,
  onCreateProject,
}: {
  content: string;
  filename: string;
  onBack: () => void;
  onCreateProject: (projectName: string, episodeName: string, episodeContent: string) => Promise<void>;
}) {
  const episodes = useMemo(() => parseEpisodes(content), [content]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const selected = episodes[selectedIndex] ?? { label: '第一集', content: '' };
  // Use filename (strip .txt) as project name
  const projectName = filename.replace(/\.txt$/i, '');

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      await onCreateProject(projectName, selected.label, selected.content);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F3E8] overflow-hidden relative">
      <div className="pointer-events-none absolute right-8 top-24 h-28 w-28 rounded-[42%_58%_51%_49%/62%_38%_62%_38%] bg-[#d8ec6a]/45" />

      <header className="h-16 bg-[#f0ebdd] border-b border-[#6da768]/30 flex items-center justify-between px-6 shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-4 w-1/3">
          <button onClick={onBack} className="text-[#2b5f43] hover:text-[#193d2c] transition-colors flex items-center gap-2 text-sm font-medium">
            <ArrowLeft size={16} /> 返回上传
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center bg-[#193d2c] rounded-full p-1 shadow-inner border border-[#6da768]/60">
            <div onClick={onBack} className="flex items-center px-6 py-1.5 text-[#d7ead6] text-sm font-medium cursor-pointer hover:text-white transition-colors">
              1.上传剧本
            </div>
            <div className="flex items-center px-6 py-1.5 bg-[#d8ec6a] text-[#193d2c] rounded-full text-sm font-bold shadow-sm menu-title">
              2.剧本分集
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 w-1/3">
          <div className="flex items-center gap-2 bg-[#193d2c] px-3 py-1.5 rounded-full text-xs text-[#d8ec6a] font-mono border border-[#6da768]/60">
            🪙 24310
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-6 overflow-hidden relative z-10">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-[#193d2c] menu-title">分集剧本</h1>
            <p className="text-sm text-[#2b5f43]/80 mt-1">
              共识别 {episodes.length} 集，选择单集剧本进行视频创作
            </p>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="text-sm text-[#2b5f43] hover:text-[#193d2c] flex items-center gap-1.5 transition-colors">
              <Edit3 size={16} /> 手动编辑
            </button>

            {/* Episode dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-36 bg-[#fbf8ef] border border-[#6da768]/40 rounded-lg px-4 py-2 text-sm font-medium text-[#2b5f43] hover:bg-[#f5f1e4] transition-colors shadow-sm"
              >
                {selected.label} <ChevronDown size={16} className="text-[#2b5f43]/70 ml-2 shrink-0" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-full bg-[#fbf8ef] border border-[#6da768]/40 rounded-lg shadow-lg py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200 max-h-60 overflow-y-auto">
                  {episodes.map((ep, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedIndex(idx); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedIndex === idx ? 'bg-[#e9f2df] text-[#2b5f43] font-bold' : 'text-[#2b5f43] hover:bg-[#f5f1e4]'}`}
                    >
                      {ep.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="px-5 py-2 bg-[#193d2c] hover:bg-[#2b5f43] disabled:bg-[#c9d3c2] disabled:cursor-not-allowed text-[#f5f1e4] rounded-lg text-sm font-bold transition-all shadow-md flex items-center gap-2 active:scale-95 menu-title"
            >
              {isCreating ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              {isCreating ? '创建中...' : '创建漫剧项目'}
            </button>
          </div>
        </div>

        <div className="flex-1 bg-[#fbf8ef] rounded-2xl border-2 border-[#193d2c]/15 shadow-sm p-8 overflow-y-auto custom-scrollbar relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#6da768] rounded-l-2xl"></div>
          <div className="max-w-3xl mx-auto whitespace-pre-wrap text-[#2b5f43] leading-relaxed text-[15px] font-medium">
            {selected.content || <span className="text-[#2b5f43]/40 italic">该集暂无内容</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
