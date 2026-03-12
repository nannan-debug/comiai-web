import React, { useState } from 'react';
import { FileText, Upload, Wand2, Users, User, ArrowRight, Settings2, Sparkles, ChevronDown } from 'lucide-react';

export default function ScriptAndAssets({ onNext }: { onNext: () => void }) {
  const [isParsing, setIsParsing] = useState(false);
  const [hasParsed, setHasParsed] = useState(false);
  const [scriptText, setScriptText] = useState(
    `1日，夜，陷阵营地\n出场人物：老兵甲，士兵群演\n\n上帝视角垂直俯拍，极简几何构图。背景是深不见底的黑，中央是一个巨大的正方形朱砂红地毯区域。正中心是一团金色的圆形火焰（青铜方鼎）。三十个黑色的圆点（士兵）整齐围坐在火周围。\n老兵甲：（啃着羊腿，含糊不清）林兄弟，今天可太解气了！\n\n`
  );
  
  // Style and Orientation State
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
  const [isOrientationDropdownOpen, setIsOrientationDropdownOpen] = useState(false);
  const [selectedOrientation, setSelectedOrientation] = useState<'16:9' | '9:16'>('16:9');
  const [selectedStyle, setSelectedStyle] = useState<string>('默认');

  const styles = [
    { id: '默认', name: '默认', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80' },
    { id: '日本动画片', name: '日本动画片', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&q=80' },
    { id: '吉卜力', name: '吉卜力', image: 'https://images.unsplash.com/photo-1580477667995-2b92f01c3f15?w=150&q=80' },
    { id: '漫画', name: '漫画', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80' },
    { id: '3D', name: '3D', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80' },
    { id: '皮克斯', name: '皮克斯', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&q=80' },
    { id: '黏土', name: '黏土', image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=150&q=80' },
    { id: '扁平插画', name: '扁平插画', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80' },
    { id: '童话手绘', name: '童话手绘', image: 'https://images.unsplash.com/photo-1580477667995-2b92f01c3f15?w=150&q=80' },
    { id: '赛博朋克', name: '赛博朋克', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80' },
    { id: '水墨画', name: '水墨画', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80' },
    { id: '油画', name: '油画', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&q=80' },
    { id: '水彩', name: '水彩', image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=150&q=80' },
    { id: '游戏CG', name: '游戏CG', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80' },
    { id: '中国风', name: '中国风', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&q=80' },
  ];
  
  // Prompt Optimization State
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [showPromptSettings, setShowPromptSettings] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(
    `你是一个专业的漫剧分镜师。请根据用户提供的剧本片段，提取关键信息并生成结构化分镜。\n规则：\n1. 提取出场【角色】和【场景】。\n2. 重点优化【画面描述】：不要只复制原文，请根据剧情脑补出适合AI绘画的Prompt，必须包含：时间、环境、镜头景别(如全景/特写)、光影氛围(如赛博朋克/暖色调)。`
  );

  const handleParse = () => {
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
      setHasParsed(true);
    }, 1500);
  };

  return (
    <div className="flex-1 flex overflow-hidden p-3 gap-3 pb-0">
      {/* 左侧：剧本输入 */}
      <aside className="w-[400px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-sm flex items-center gap-2 text-slate-700">
            <FileText className="w-4 h-4 text-emerald-500" /> 输入本集剧本
          </h2>
          <button className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1 transition-colors">
            <Upload className="w-3 h-3" /> 导入文件
          </button>
        </div>
        <div className="flex-1 p-0 relative">
          <textarea
            className="w-full h-full p-4 resize-none outline-none text-slate-700 text-sm leading-relaxed placeholder:text-slate-400"
            placeholder="在此粘贴剧本内容..."
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
          ></textarea>
        </div>
        
        {/* 提示词优化设置区 */}
        <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-10px_20px_-15px_rgba(0,0,0,0.05)]">
          <div className="flex items-start justify-between mb-3">
            <label className="flex items-start gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={autoOptimize}
                onChange={(e) => {
                  setAutoOptimize(e.target.checked);
                  if (!e.target.checked) setShowPromptSettings(false);
                }}
                className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" 
              />
              <div>
                <div className="font-bold text-slate-800 text-sm flex items-center gap-1">
                  自动优化画面提示词 <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  开启后，AI将自动补充镜头语言、光影构图。
                </div>
              </div>
            </label>
            <button 
              onClick={() => {
                setShowPromptSettings(!showPromptSettings);
                if (!showPromptSettings && !autoOptimize) setAutoOptimize(true);
              }}
              className={`text-xs flex items-center gap-1 px-2 py-1 rounded-lg border transition-colors ${
                showPromptSettings 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-emerald-600'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" /> 设定规则
            </button>
          </div>

          {/* 自定义提示词编辑区 */}
          {showPromptSettings && (
            <div className="mb-4 bg-slate-50 border border-slate-200 rounded-xl p-3 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* 分镜制作默认模式选择 */}
              <div className="mb-4 pb-4 border-b border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">选择分镜制作默认模式</span>
                </div>
                <div className="flex gap-3 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer group bg-white px-3 py-2 rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors flex-1">
                    <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                    <span className="text-xs font-medium text-slate-700">多参生视频</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group bg-white px-3 py-2 rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors flex-1">
                    <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                    <span className="text-xs font-medium text-slate-700">图生视频</span>
                  </label>
                </div>
                <div className="text-[10px] text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                  <span>💡</span> 选择后仍可在分镜编辑页切换分镜生成模式
                </div>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-700">自定义系统提示词 (System Prompt)</span>
                <button 
                  onClick={() => setSystemPrompt(`你是一个专业的漫剧分镜师。请根据用户提供的剧本片段，提取关键信息并生成结构化分镜。\n规则：\n1. 提取出场【角色】和【场景】。\n2. 重点优化【画面描述】：不要只复制原文，请根据剧情脑补出适合AI绘画的Prompt，必须包含：时间、环境、镜头景别(如全景/特写)、光影氛围(如赛博朋克/暖色调)。`)}
                  className="text-[10px] text-slate-500 hover:text-emerald-600 underline decoration-slate-300 hover:decoration-emerald-600 underline-offset-2"
                >
                  恢复默认
                </button>
              </div>
              <textarea 
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full text-xs text-slate-600 p-2.5 bg-white border border-slate-200 rounded-lg resize-y h-32 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none leading-relaxed transition-all shadow-inner" 
                spellCheck="false"
              />
            </div>
          )}

          <button
            onClick={handleParse}
            disabled={isParsing}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isParsing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 text-emerald-400" />
            )}
            {isParsing ? '解析中...' : hasParsed ? '重新提取角色与场景' : '智能提取角色与场景'}
          </button>
        </div>
      </aside>

      {/* 右侧：资产绑定面板 */}
      <main className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
        {/* Header - Always visible */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center shrink-0 z-30 relative">
          <div>
            <h3 className="font-bold text-base text-slate-800">本集设定资产</h3>
            <p className="text-xs text-slate-500 mt-1">请确认AI提取的角色与场景，为后续生成视频打好基础。</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 bg-[#F8FAFC] border border-slate-200 rounded-xl p-1.5 shadow-sm">
              {/* Style Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 pl-2">风格:</span>
                <div className="relative">
                  <button 
                    onClick={() => { setIsStyleDropdownOpen(!isStyleDropdownOpen); setIsOrientationDropdownOpen(false); }}
                    className="flex items-center justify-between w-32 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <img src={styles.find(s => s.id === selectedStyle)?.image} alt={selectedStyle} className="w-4 h-4 rounded-sm object-cover shrink-0" />
                      <span className="truncate">{selectedStyle}</span>
                    </div>
                    <ChevronDown size={14} className="text-slate-400 shrink-0 ml-1" />
                  </button>
                  {isStyleDropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-40 max-h-64 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                      {styles.map(style => (
                        <button 
                          key={style.id}
                          onClick={() => { setSelectedStyle(style.id); setIsStyleDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-3 ${selectedStyle === style.id ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <img src={style.image} alt={style.name} className="w-5 h-5 rounded object-cover shadow-sm" />
                          <span className="truncate">{style.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-px h-5 bg-slate-300"></div>

              {/* Orientation Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">尺寸:</span>
                <div className="relative">
                  <button 
                    onClick={() => { setIsOrientationDropdownOpen(!isOrientationDropdownOpen); setIsStyleDropdownOpen(false); }}
                    className="flex items-center justify-between w-32 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {selectedOrientation === '16:9' ? (
                        <div className="w-3.5 h-2 border-2 border-slate-500 rounded-[2px] shrink-0"></div>
                      ) : (
                        <div className="w-2 h-3.5 border-2 border-slate-500 rounded-[2px] shrink-0"></div>
                      )}
                      <span className="truncate">{selectedOrientation === '16:9' ? '16:9 (横屏)' : '9:16 (竖屏)'}</span>
                    </div>
                    <ChevronDown size={14} className="text-slate-400 shrink-0 ml-1" />
                  </button>
                  {isOrientationDropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button 
                        onClick={() => { setSelectedOrientation('16:9'); setIsOrientationDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-3 ${selectedOrientation === '16:9' ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        <div className={`w-3.5 h-2 border-2 rounded-[2px] ${selectedOrientation === '16:9' ? 'border-emerald-500' : 'border-slate-400'}`}></div>
                        <span>16:9 (横屏)</span>
                      </button>
                      <button 
                        onClick={() => { setSelectedOrientation('9:16'); setIsOrientationDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-3 ${selectedOrientation === '9:16' ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        <div className={`w-2 h-3.5 border-2 rounded-[2px] ${selectedOrientation === '9:16' ? 'border-emerald-500' : 'border-slate-400'}`}></div>
                        <span>9:16 (竖屏)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onNext}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-colors shadow-md flex items-center gap-2 active:scale-95"
            >
              下一步：制作分镜表 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden flex flex-col">
          {!hasParsed && !isParsing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-10 bg-slate-50/50">
              <Users className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-sm font-medium">在左侧输入剧本并点击提取，AI将自动识别所需元素</p>
            </div>
          )}

          {isParsing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-600 z-20 bg-slate-50/80 backdrop-blur-sm">
              <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-4" />
              <p className="text-sm font-bold animate-pulse">正在深度理解剧本，提取实体资产...</p>
            </div>
          )}

          {hasParsed && !isParsing && (
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 animate-in fade-in duration-500 custom-scrollbar">
              {/* 角色区 */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" /> 核心角色 (2)
                </h4>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* 角色1 */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-emerald-300 transition-colors group">
                    <div className="h-40 relative flex items-center justify-center overflow-hidden bg-slate-100">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60')] bg-cover bg-center transition-transform duration-500 group-hover:scale-105"></div>
                      <span className="absolute top-2 left-2 text-white text-[10px] px-2 py-0.5 bg-emerald-500/90 rounded font-bold shadow-sm backdrop-blur-sm">
                        已绑定参考图
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="font-bold text-sm text-slate-800 mb-1">老兵甲</div>
                      <div className="text-xs text-slate-500 truncate mb-3">皮肤质感粗糙油亮</div>
                      <button className="w-full py-1.5 text-xs font-bold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                        编辑
                      </button>
                    </div>
                  </div>

                  {/* 角色2 */}
                  <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 overflow-hidden shadow-sm hover:border-emerald-300 transition-colors group">
                    <div className="h-40 bg-slate-50 flex flex-col items-center justify-center group-hover:bg-emerald-50/30 transition-colors">
                      <Users className="w-8 h-8 text-slate-300 mb-2 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <div className="p-3">
                      <div className="font-bold text-sm text-slate-800 mb-1">士兵群演</div>
                      <div className="text-xs text-slate-400 mb-3 truncate">陷阵营士兵黑色铁甲背影</div>
                      <button className="w-full py-1.5 text-xs font-bold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                        上传参考
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
