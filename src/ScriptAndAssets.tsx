import React, { useState } from 'react';
import { BookOpen, Wand2, Users, User, MapPin, Package, ChevronDown, Loader2 } from 'lucide-react';
import { scriptApi, AnalysisResult } from './api';

type StoryboardMode = 'image-video' | 'direct-video';

export default function ScriptAndAssets({
  onNext,
  scriptContent,
  episodeId,
}: {
  onNext: (mode: StoryboardMode) => void;
  scriptContent?: string;
  episodeId?: number;
}) {
  const initialText = scriptContent || '';
  const [savedText, setSavedText] = useState(initialText);
  const [draftText, setDraftText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [showNextMenu, setShowNextMenu] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      setSavedText(draftText);
      setIsEditing(false);
      setAnalysis(null);
    } else {
      setDraftText(savedText);
      setIsEditing(true);
      setShowNextMenu(false);
    }
  };

  const handleParse = async () => {
    setParseError(null);
    setShowNextMenu(false);
    setIsParsing(true);
    try {
      const result = await scriptApi.split(savedText, episodeId);
      setAnalysis(result);
    } catch (e: any) {
      setParseError(e.message ?? '解析失败，请重试');
    } finally {
      setIsParsing(false);
    }
  };

  const hasParsed = !!analysis && (analysis.person.length > 0 || analysis.scence.length > 0 || analysis.lens.length > 0);
  const isNextDisabled = !hasParsed || isParsing || isEditing;

  return (
    <div className="flex-1 flex overflow-hidden p-3 gap-3 pb-0">
      {/* 左侧：剧本 */}
      <aside className="w-[400px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-sm flex items-center gap-2 text-slate-700">
            <BookOpen className="w-4 h-4 text-[#6da768]" /> 剧本
          </h2>
          <button
            onClick={handleEditToggle}
            className="text-xs text-slate-500 hover:text-[#2b5f43] font-bold px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            {isEditing ? '保存文件' : '编辑文件'}
          </button>
        </div>
        <div className="flex-1 relative bg-slate-50/30 overflow-hidden">
          <textarea
            className={`w-full h-full p-4 resize-none outline-none text-slate-600 text-xs font-medium leading-relaxed placeholder:text-slate-400 bg-transparent ${isEditing ? '' : 'cursor-default'}`}
            placeholder="在此粘贴剧本内容..."
            value={isEditing ? draftText : savedText}
            readOnly={!isEditing}
            onChange={(e) => setDraftText(e.target.value)}
          />
        </div>
        <div className="p-4 bg-white border-t border-slate-100">
          <button
            onClick={handleParse}
            disabled={isParsing || isEditing || !savedText.trim()}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isParsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4 text-violet-400" />}
            {isEditing ? '请先保存文件' : isParsing ? 'AI 解析中...' : hasParsed ? '重新提取角色、场景与分镜' : '智能提取角色、场景与分镜'}
          </button>
          {parseError && <p className="text-xs text-red-500 mt-2 text-center">{parseError}</p>}
        </div>
      </aside>

      {/* 右侧：解析结果 */}
      <main className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center shrink-0 z-30 relative">
          <h3 className="font-bold text-base text-slate-800">设定资产</h3>
          <div className="relative">
            <button
              onClick={() => !isNextDisabled && setShowNextMenu(p => !p)}
              disabled={isNextDisabled}
              className="px-5 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-sm font-bold transition-colors shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              下一步：选择分镜模式 <ChevronDown className="w-4 h-4" />
            </button>
            {showNextMenu && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
                <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => { setShowNextMenu(false); onNext('direct-video'); }}>文字直出</button>
                <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 border-t border-slate-100" onClick={() => { setShowNextMenu(false); onNext('image-video'); }}>图生视频</button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* 空状态 */}
          {!hasParsed && !isParsing && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Users className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-sm font-medium">点击左侧"智能提取"，AI 将自动解析角色、场景与分镜</p>
            </div>
          )}

          {/* 解析中 */}
          {isParsing && (
            <div className="h-full flex flex-col items-center justify-center text-violet-600">
              <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin mb-4" />
              <p className="text-sm font-bold animate-pulse">AI 正在深度解析剧本，生成角色·场景·分镜...</p>
            </div>
          )}

          {/* 解析结果 */}
          {hasParsed && analysis && (
            <div className="p-6 space-y-8 animate-in fade-in duration-500">

              {/* 角色 */}
              {analysis.person.length > 0 && (
                <section>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <User className="w-4 h-4 text-violet-500" /> 角色 ({analysis.person.length})
                  </h4>
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {analysis.person.map((p) => (
                      <div key={p.name} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-violet-300 transition-colors">
                        <div className="h-32 bg-gradient-to-br from-violet-50 to-slate-100 flex items-center justify-center">
                          <User className="w-10 h-10 text-violet-300" />
                        </div>
                        <div className="p-3">
                          <div className="font-bold text-sm text-slate-800 mb-1">{p.name}</div>
                          <div className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{p.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 场景 */}
              {analysis.scence.length > 0 && (
                <section>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-violet-500" /> 场景 ({analysis.scence.length})
                  </h4>
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {analysis.scence.map((s) => (
                      <div key={s.name} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-violet-300 transition-colors">
                        <div className="h-32 bg-gradient-to-br from-emerald-50 to-slate-100 flex items-center justify-center">
                          <MapPin className="w-10 h-10 text-emerald-300" />
                        </div>
                        <div className="p-3">
                          <div className="font-bold text-sm text-slate-800 mb-1">{s.name}</div>
                          <div className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{s.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 道具（极简，可能为空） */}
              {analysis.props.length > 0 && (
                <section>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Package className="w-4 h-4 text-violet-500" /> 核心道具 ({analysis.props.length})
                  </h4>
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {analysis.props.map((prop) => (
                      <div key={prop.name} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-violet-300 transition-colors">
                        <div className="h-32 bg-gradient-to-br from-amber-50 to-slate-100 flex items-center justify-center">
                          <Package className="w-10 h-10 text-amber-300" />
                        </div>
                        <div className="p-3">
                          <div className="font-bold text-sm text-slate-800 mb-1">{prop.name}</div>
                          <div className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{prop.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 分镜列表 */}
              {analysis.lens.length > 0 && (
                <section>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                    🎬 分镜 ({analysis.lens.length} 段 · 共约 {analysis.lens.length * 15} 秒)
                  </h4>
                  <div className="space-y-3">
                    {analysis.lens.map((lens) => (
                      <div key={lens.camera} className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold bg-violet-500 text-white px-2 py-0.5 rounded-full">#{lens.camera}</span>
                          {lens.person && <span className="text-xs text-slate-500">👤 {lens.person}</span>}
                          {lens.scence_name && <span className="text-xs text-slate-500">📍 {lens.scence_name}</span>}
                          {lens.props && <span className="text-xs text-slate-500">📦 {lens.props}</span>}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{lens.video_prompt}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
