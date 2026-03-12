import React, { useState } from 'react';
import { FileText, Upload, Wand2, Users, User, ArrowRight, Sparkles, ChevronDown, CheckCircle2, ChevronUp } from 'lucide-react';

type PlanId = 'multi-parameter' | 'image-video';
type RightTab = 'assets' | 'preview';
type StoryboardMode = 'image-video' | 'direct-video';

const defaultPrompts: Record<PlanId, string> = {
  'multi-parameter': `你是一个专业的漫剧分镜师。请根据用户提供的剧本片段，为多参生视频方案生成结构化分镜 Prompt。\n规则：\n1. 提取关键角色、场景、动作与情绪。\n2. 重点补充镜头运动、景别变化、运镜节奏、光影氛围与构图指令。\n3. 输出内容要适合后续多参数控制的分镜制作。`,
  'image-video': `你是一个专业的漫剧分镜师。请根据用户提供的剧本片段，为图生视频方案生成结构化分镜 Prompt。\n规则：\n1. 提取关键角色、场景、动作与情绪。\n2. 重点补充首帧画面主体、环境细节、光影氛围、构图关系与连续动作描述。\n3. 输出内容要更适合图生视频模式的画面生成。`,
};

const planOptions = [
  {
    id: 'multi-parameter' as PlanId,
    title: '多参生视频方案',
    description: '更适合控制镜头运动、节奏和分镜参数，便于后续精细化调整。',
    badge: '镜头控制更强',
  },
  {
    id: 'image-video' as PlanId,
    title: '图生视频方案',
    description: '更适合突出首帧画面质感和视觉氛围，方便快速预览分镜效果。',
    badge: '画面氛围更强',
  },
];

const previewShots: Record<PlanId, Array<{
  id: number;
  title: string;
  characters: string[];
  scenes: string[];
  visualPrompt: string;
  dialogue: string;
  sound: string;
}>> = {
  'multi-parameter': [
    {
      id: 1,
      title: '营地夜景开场',
      characters: ['老兵甲', '士兵群演'],
      scenes: ['陷阵营地'],
      visualPrompt: '上帝视角垂直俯拍，营地中央火焰形成视觉焦点，士兵环绕而坐，镜头缓慢下压，突出营地秩序与肃杀氛围。',
      dialogue: '老兵甲：（啃着羊腿，含糊不清）林兄弟，今天可太解气了！',
      sound: '柴火爆裂声，夜风掠过营帐',
    },
    {
      id: 2,
      title: '火焰与士兵节奏切换',
      characters: ['士兵群演'],
      scenes: ['陷阵营地', '篝火区域'],
      visualPrompt: '镜头切近篝火与士兵剪影，利用火光明暗变化塑造层次，节奏更强，突出群像的压迫感与战前静默。',
      dialogue: '暂无台词',
      sound: '火星噼啪，铠甲轻微摩擦',
    },
    {
      id: 3,
      title: '人物特写落点',
      characters: ['老兵甲'],
      scenes: ['陷阵营地'],
      visualPrompt: '从俯拍切到老兵甲半身近景，火光映亮脸部轮廓，保留背景士兵虚化，强调人物粗粝质感与情绪。',
      dialogue: '老兵甲：林兄弟，今天可太解气了！',
      sound: '人物吞咽声，篝火背景底噪',
    },
  ],
  'image-video': [
    {
      id: 1,
      title: '篝火主画面建立',
      characters: ['老兵甲', '士兵群演'],
      scenes: ['陷阵营地'],
      visualPrompt: '极简几何构图的营地夜景，黑色背景中一块朱砂红区域包裹金色火焰，人物围坐四周，强调首帧氛围与色块关系。',
      dialogue: '老兵甲：（啃着羊腿，含糊不清）林兄弟，今天可太解气了！',
      sound: '营地风声，火焰燃烧声',
    },
    {
      id: 2,
      title: '士兵群像氛围镜',
      characters: ['士兵群演'],
      scenes: ['陷阵营地'],
      visualPrompt: '以火焰为中心的广角画面，士兵围坐成圈，黑甲剪影与暖色火光形成反差，画面更注重静态氛围表达。',
      dialogue: '暂无台词',
      sound: '低沉环境声，木柴断裂声',
    },
    {
      id: 3,
      title: '老兵甲情绪定格',
      characters: ['老兵甲'],
      scenes: ['篝火区域'],
      visualPrompt: '人物近景靠右构图，火光映出皮肤与盔甲细节，背景保持柔焦，突出老兵甲轻松又粗粝的状态。',
      dialogue: '老兵甲：林兄弟，今天可太解气了！',
      sound: '人物说话声，篝火底噪',
    },
  ],
};

export default function ScriptAndAssets({ onNext }: { onNext: (mode: StoryboardMode) => void }) {
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
  
  const [selectedPlans, setSelectedPlans] = useState<PlanId[]>(['multi-parameter', 'image-video']);
  const [isPromptConfigOpen, setIsPromptConfigOpen] = useState(false);
  const [expandedPromptPlans, setExpandedPromptPlans] = useState<PlanId[]>(['multi-parameter']);
  const [planPrompts, setPlanPrompts] = useState<Record<PlanId, string>>(defaultPrompts);
  const [activeRightTab, setActiveRightTab] = useState<RightTab>('assets');
  const [previewPlan, setPreviewPlan] = useState<PlanId>('multi-parameter');
  const [adoptedPlan, setAdoptedPlan] = useState<PlanId | null>(null);

  const selectedPlanOptions = planOptions.filter((plan) => selectedPlans.includes(plan.id));
  const previewPlanOptions = planOptions.filter((plan) => selectedPlans.includes(plan.id));
  const currentPreviewShots = previewShots[previewPlan];

  const togglePlan = (planId: PlanId) => {
    setSelectedPlans((currentPlans) => {
      if (currentPlans.includes(planId)) {
        const nextPlans = currentPlans.filter((id) => id !== planId);
        setExpandedPromptPlans((currentExpanded) => currentExpanded.filter((id) => id !== planId));
        return nextPlans;
      }

      setExpandedPromptPlans((currentExpanded) => (
        currentExpanded.includes(planId) ? currentExpanded : [...currentExpanded, planId]
      ));
      return [...currentPlans, planId];
    });
  };

  const togglePromptExpansion = (planId: PlanId) => {
    setExpandedPromptPlans((currentExpanded) => (
      currentExpanded.includes(planId)
        ? currentExpanded.filter((id) => id !== planId)
        : [...currentExpanded, planId]
    ));
  };

  const handleParse = () => {
    if (selectedPlans.length === 0) return;
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
      setHasParsed(true);
      setPreviewPlan(selectedPlans[0]);
      setAdoptedPlan(null);
      setActiveRightTab('preview');
    }, 1500);
  };

  const handleProceed = () => {
    if (!adoptedPlan) return;
    onNext(adoptedPlan === 'multi-parameter' ? 'direct-video' : 'image-video');
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
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="font-bold text-slate-800 text-sm flex items-center gap-1">
                自动优化画面提示词 <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                AI补充镜头语言、光影构图
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPromptConfigOpen((open) => !open)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-medium hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50/40 transition-colors"
            >
              设定规则
              {isPromptConfigOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {isPromptConfigOpen && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">分镜生成方案</span>
                  <span className="text-[10px] text-slate-500">可单选/多选</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {planOptions.map((plan) => {
                    const isSelected = selectedPlans.includes(plan.id);

                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => togglePlan(plan.id)}
                        className={`text-left rounded-xl border px-3 py-2.5 transition-colors ${
                          isSelected
                            ? 'border-emerald-300 bg-emerald-50'
                            : 'border-slate-200 bg-white hover:border-emerald-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-800">{plan.title}</span>
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-500' : 'text-slate-300'}`} />
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">{plan.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedPlans.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">提示词配置</span>
                    <span className="text-[10px] text-slate-500">{selectedPlans.length} 个方案</span>
                  </div>

                  {selectedPlanOptions.map((plan) => {
                    const isExpanded = expandedPromptPlans.includes(plan.id);
                    const isDefaultPrompt = planPrompts[plan.id] === defaultPrompts[plan.id];

                    return (
                      <div key={plan.id} className="border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between py-1.5">
                          <div>
                            <div className="text-xs font-medium text-slate-800">{plan.title}</div>
                            <div className="text-[10px] text-slate-500">{isDefaultPrompt ? '默认模板' : '已自定义'}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setPlanPrompts((currentPrompts) => ({ ...currentPrompts, [plan.id]: defaultPrompts[plan.id] }))}
                              className="text-[10px] text-slate-500 hover:text-emerald-600"
                            >
                              恢复默认
                            </button>
                            <button
                              type="button"
                              onClick={() => togglePromptExpansion(plan.id)}
                              className="text-[10px] text-slate-600 hover:text-emerald-600 flex items-center gap-1"
                            >
                              {isExpanded ? '收起' : '编辑'}
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                        {isExpanded && (
                          <textarea
                            value={planPrompts[plan.id]}
                            onChange={(e) => setPlanPrompts((currentPrompts) => ({ ...currentPrompts, [plan.id]: e.target.value }))}
                            className="mt-1 w-full text-xs text-slate-600 p-2.5 bg-slate-50 border border-slate-200 rounded-lg resize-y h-24 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none leading-relaxed transition-all"
                            spellCheck="false"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleParse}
            disabled={isParsing || selectedPlans.length === 0}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isParsing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 text-emerald-400" />
            )}
            {isParsing
              ? '生成中...'
              : `生成${selectedPlans.length > 1 ? `${selectedPlans.length}套` : ''}分镜方案`}
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
              onClick={handleProceed}
              disabled={!adoptedPlan}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-sm font-bold transition-colors shadow-md flex items-center gap-2 active:scale-95 disabled:shadow-none disabled:cursor-not-allowed"
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
            <>
              <div className="px-6 pt-4 bg-white border-b border-slate-100">
                <div className="inline-flex bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveRightTab('assets')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeRightTab === 'assets' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    设定资产
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRightTab('preview')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeRightTab === 'preview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    拆分镜预览
                  </button>
                </div>
              </div>

              {activeRightTab === 'assets' && (
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 animate-in fade-in duration-500 custom-scrollbar">
                  <div className="mb-8">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-500" /> 核心角色 (2)
                    </h4>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

              {activeRightTab === 'preview' && (
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 animate-in fade-in duration-500 custom-scrollbar space-y-5">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">拆分镜方案预览</h4>
                        <p className="text-xs text-slate-500 mt-1">先预览分镜内容，再决定采用哪个版本进入分镜管理页。</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAdoptedPlan(previewPlan)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${adoptedPlan === previewPlan ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
                      >
                        {adoptedPlan === previewPlan ? '当前方案已选定' : '选定当前方案'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {previewPlanOptions.map((plan) => (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => setPreviewPlan(plan.id)}
                          className={`text-left rounded-xl border px-4 py-3 transition-colors ${previewPlan === plan.id ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-emerald-200'}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold text-slate-800">{plan.title}</span>
                            {adoptedPlan === plan.id && <span className="text-[10px] font-medium text-emerald-700 bg-white border border-emerald-200 rounded-full px-2 py-0.5">已选定</span>}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">{plan.badge}</div>
                          <div className="text-[11px] text-slate-500 mt-2">{previewShots[plan.id].length} 镜</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {currentPreviewShots.map((shot) => (
                    <div key={shot.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-lg font-bold flex items-center justify-center shrink-0">
                          {shot.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <h5 className="text-sm font-bold text-slate-800">{shot.title}</h5>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {shot.characters.map((character) => (
                                  <span key={character} className="px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-700">
                                    角色：{character}
                                  </span>
                                ))}
                                {shot.scenes.map((scene) => (
                                  <span key={scene} className="px-2.5 py-1 rounded-full bg-emerald-50 text-[11px] font-medium text-emerald-700">
                                    场景：{scene}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0">第 {shot.id} 镜</span>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <div className="text-[11px] font-bold text-slate-500 mb-1.5">画面内容与 AIGC 提示词</div>
                              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 leading-relaxed">
                                {shot.visualPrompt}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-[11px] font-bold text-slate-500 mb-1.5">台词</div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 min-h-[72px]">
                                  {shot.dialogue}
                                </div>
                              </div>
                              <div>
                                <div className="text-[11px] font-bold text-slate-500 mb-1.5">音效</div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 min-h-[72px]">
                                  {shot.sound}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
