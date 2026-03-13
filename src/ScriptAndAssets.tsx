import React, { useState } from 'react';
import { FileText, Upload, Wand2, Users, User, ArrowRight, Sparkles, ChevronDown, CheckCircle2, ChevronUp, ImagePlus, MapPinned, Package, Plus, Trash2 } from 'lucide-react';

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

const initialPreviewShots: Record<PlanId, Array<{
  id: number;
  status: string;
  characters: string[];
  scenes: string[];
  props: string[];
  visualPrompt?: string;
  videoPrompt: string;
  dialogue: string;
  sound: string;
}>> = {
  'multi-parameter': [
    {
      id: 1,
      status: '初始化',
      characters: ['老兵甲', '士兵群演'],
      scenes: ['陷阵营地'],
      props: ['青铜方鼎', '篝火火堆'],
      videoPrompt: '镜头从高空缓慢俯冲到营地中央火焰，士兵环绕而坐，火光映出铁甲轮廓，突出营地秩序与肃杀氛围。',
      dialogue: '老兵甲：（啃着羊腿，含糊不清）林兄弟，今天可太解气了！',
      sound: '柴火爆裂声，夜风掠过营帐',
    },
    {
      id: 2,
      status: '初始化',
      characters: ['士兵群演'],
      scenes: ['陷阵营地', '篝火区域'],
      props: ['铁甲兵器', '篝火火堆'],
      videoPrompt: '镜头切近篝火与士兵剪影，快速扫过兵器细节和人物侧脸，利用火光明暗变化塑造压迫感。',
      dialogue: '暂无台词',
      sound: '火星噼啪，铠甲轻微摩擦',
    },
    {
      id: 3,
      status: '初始化',
      characters: ['老兵甲'],
      scenes: ['陷阵营地'],
      props: ['铁甲兵器'],
      videoPrompt: '镜头切到老兵甲半身近景，火光映亮脸部与肩甲，背景士兵轻微虚化，停留人物情绪与吞咽动作。',
      dialogue: '老兵甲：林兄弟，今天可太解气了！',
      sound: '人物吞咽声，篝火背景底噪',
    },
  ],
  'image-video': [
    {
      id: 1,
      status: '初始化',
      characters: ['老兵甲', '士兵群演'],
      scenes: ['陷阵营地'],
      props: ['青铜方鼎', '篝火火堆'],
      visualPrompt: '极简几何构图的营地夜景，黑色背景中一块朱砂红区域包裹金色火焰，人物围坐四周，强调首帧氛围与色块关系。',
      videoPrompt: '镜头从静态主画面缓慢推进至篝火中心，再轻微环绕士兵群像，保持压抑而稳定的夜间节奏。',
      dialogue: '老兵甲：（啃着羊腿，含糊不清）林兄弟，今天可太解气了！',
      sound: '营地风声，火焰燃烧声',
    },
    {
      id: 2,
      status: '初始化',
      characters: ['士兵群演'],
      scenes: ['陷阵营地'],
      props: ['铁甲兵器', '篝火火堆'],
      visualPrompt: '以火焰为中心的广角画面，士兵围坐成圈，黑甲剪影与暖色火光形成反差，画面更注重静态氛围表达。',
      videoPrompt: '在首帧构图基础上缓慢横移，掠过围坐士兵与篝火，突出夜色中群像的静默压迫感。',
      dialogue: '暂无台词',
      sound: '低沉环境声，木柴断裂声',
    },
    {
      id: 3,
      status: '初始化',
      characters: ['老兵甲'],
      scenes: ['篝火区域'],
      props: ['铁甲兵器'],
      visualPrompt: '人物近景靠右构图，火光映出皮肤与盔甲细节，背景保持柔焦，突出老兵甲轻松又粗粝的状态。',
      videoPrompt: '镜头轻推人物面部与肩部甲片细节，定格其说话前后的神情变化，保留背景火焰闪烁。',
      dialogue: '老兵甲：林兄弟，今天可太解气了！',
      sound: '人物说话声，篝火底噪',
    },
    {
      id: 4,
      status: '初始化',
      characters: ['士兵群演'],
      scenes: ['篝火区域'],
      props: ['篝火火堆', '铁甲兵器'],
      visualPrompt: '围绕篝火做中景构图，士兵剪影分布在画面左右两侧，火焰作为主光源，强调人物受光和夜间环境反差。',
      videoPrompt: '基于静态构图做轻微横移，掠过火焰与兵器边缘高光，维持压抑的停顿感。',
      dialogue: '暂无台词',
      sound: '火焰燃烧声，铠甲轻响',
    },
    {
      id: 5,
      status: '初始化',
      characters: ['老兵甲', '士兵群演'],
      scenes: ['陷阵营地'],
      props: ['青铜方鼎'],
      visualPrompt: '从营地全景回到人物与篝火关系，老兵甲位于前景偏左，群演位于背景，整体画面更像片尾收束镜头。',
      videoPrompt: '镜头缓慢拉远，收住人物与营地关系，最后停在火焰与夜色的整体氛围上。',
      dialogue: '老兵甲：（含糊不清）今天总算能松口气了。',
      sound: '夜风声渐强，篝火噼啪作响',
    },
  ],
};

const createEmptyPreviewShot = (planId: PlanId, id: number) => ({
  id,
  status: '初始化',
  characters: [],
  scenes: [],
  props: [],
  visualPrompt: planId === 'image-video' ? '' : undefined,
  videoPrompt: '',
  dialogue: '',
  sound: '',
});

const assetSections = [
  {
    id: 'characters',
    title: '角色',
    icon: User,
    createLabel: '创建角色',
    items: [
      {
        name: '老兵甲',
        subtitle: '皮肤质感粗糙油亮',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
        status: '已绑定参考图',
      },
      {
        name: '士兵群演',
        subtitle: '陷阵营士兵黑色铁甲背影',
        image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=500&q=80',
        status: 'AI识别',
      },
    ],
  },
  {
    id: 'scenes',
    title: '场景',
    icon: MapPinned,
    createLabel: '创建场景',
    items: [
      {
        name: '陷阵营地',
        subtitle: '夜色营地，火焰作为视觉中心',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&auto=format&fit=crop&q=60',
        status: 'AI识别',
      },
      {
        name: '篝火区域',
        subtitle: '朱砂红区域与金色火焰构图',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60',
        status: '待完善',
      },
    ],
  },
  {
    id: 'props',
    title: '道具',
    icon: Package,
    createLabel: '创建道具',
    items: [
      {
        name: '青铜方鼎',
        subtitle: '营火核心道具，金色火焰承载体',
        image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=500&auto=format&fit=crop&q=60',
        status: 'AI识别',
      },
      {
        name: '铁甲兵器',
        subtitle: '黑色护甲与武器装备',
        image: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=500&auto=format&fit=crop&q=60',
        status: '待完善',
      },
      {
        name: '篝火火堆',
        subtitle: '夜景主光源与情绪锚点',
        image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=500&auto=format&fit=crop&q=60',
        status: 'AI识别',
      },
    ],
  },
];

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
  const [editablePreviewShots, setEditablePreviewShots] = useState(initialPreviewShots);

  const selectedPlanOptions = planOptions.filter((plan) => selectedPlans.includes(plan.id));
  const previewPlanOptions = planOptions.filter((plan) => selectedPlans.includes(plan.id));
  const currentPreviewShots = editablePreviewShots[previewPlan];
  const previewGridClass = previewPlan === 'multi-parameter'
    ? 'grid-cols-[56px_110px_132px_132px_132px_minmax(420px,1.8fr)_170px_150px]'
    : 'grid-cols-[56px_110px_132px_132px_132px_minmax(520px,2.1fr)_170px_150px]';

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
      setEditablePreviewShots(initialPreviewShots);
      setPreviewPlan(selectedPlans[0]);
      setAdoptedPlan(null);
      setActiveRightTab('preview');
    }, 1500);
  };

  const updatePreviewShot = (
    planId: PlanId,
    shotId: number,
    field: 'status' | 'visualPrompt' | 'videoPrompt' | 'dialogue' | 'sound',
    value: string
  ) => {
    setEditablePreviewShots((currentShots) => ({
      ...currentShots,
      [planId]: currentShots[planId].map((shot) => {
        if (shot.id !== shotId) return shot;

        return {
          ...shot,
          [field]: value,
        };
      }),
    }));
  };

  const addPreviewTag = (planId: PlanId, shotId: number, field: 'characters' | 'scenes' | 'props', value: string) => {
    const nextTag = value.trim();
    if (!nextTag) return;

    setEditablePreviewShots((currentShots) => ({
      ...currentShots,
      [planId]: currentShots[planId].map((shot) => {
        if (shot.id !== shotId) return shot;
        if (shot[field].includes(nextTag)) return shot;

        return {
          ...shot,
          [field]: [...shot[field], nextTag],
        };
      }),
    }));
  };

  const removePreviewTag = (planId: PlanId, shotId: number, field: 'characters' | 'scenes' | 'props', value: string) => {
    setEditablePreviewShots((currentShots) => ({
      ...currentShots,
      [planId]: currentShots[planId].map((shot) => (
        shot.id === shotId
          ? {
              ...shot,
              [field]: shot[field].filter((item) => item !== value),
            }
          : shot
      )),
    }));
  };

  const insertPreviewShotAfter = (planId: PlanId, shotId: number) => {
    setEditablePreviewShots((currentShots) => {
      const shots = currentShots[planId];
      const insertIndex = shots.findIndex((shot) => shot.id === shotId);
      if (insertIndex === -1) return currentShots;

      const nextShot = createEmptyPreviewShot(planId, shotId + 1);

      const reindexedShots = [
        ...shots.slice(0, insertIndex + 1),
        nextShot,
        ...shots.slice(insertIndex + 1),
      ].map((shot, index) => ({
        ...shot,
        id: index + 1,
      }));

      return {
        ...currentShots,
        [planId]: reindexedShots,
      };
    });
  };

  const deletePreviewShot = (planId: PlanId, shotId: number) => {
    setEditablePreviewShots((currentShots) => {
      const shots = currentShots[planId];
      if (shots.length <= 1) return currentShots;

      const reindexedShots = shots
        .filter((shot) => shot.id !== shotId)
        .map((shot, index) => ({
          ...shot,
          id: index + 1,
        }));

      return {
        ...currentShots,
        [planId]: reindexedShots,
      };
    });
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
            <FileText className="w-4 h-4 text-emerald-500" /> 本集剧本
          </h2>
          <button className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors font-medium">
            <Upload className="w-3 h-3" /> 可编辑
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
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="text-xs text-slate-500">
                      已识别 2 个角色 · 2 个场景 · 3 个道具，点击卡片继续设置。
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
                      <Wand2 className="w-3.5 h-3.5 text-emerald-500" />
                      自动生成
                    </div>
                  </div>

                  <div className="space-y-8">
                    {assetSections.map((section) => {
                      const SectionIcon = section.icon;

                      return (
                        <section key={section.id}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <SectionIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <h5 className="text-sm font-bold text-slate-800">绑定{section.title}</h5>
                                <p className="text-xs text-slate-500 mt-0.5">{section.items.length} 个已识别资产</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {section.items.map((item) => (
                              <button
                                key={item.name}
                                type="button"
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-emerald-300 hover:-translate-y-0.5 transition-all text-left group"
                              >
                                <div className="h-44 relative overflow-hidden bg-slate-100">
                                  <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${item.image})` }}
                                  />
                                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
                                  <span className="absolute top-3 left-3 text-white text-[10px] px-2 py-1 bg-black/35 rounded-full font-medium backdrop-blur-sm">
                                    {item.status}
                                  </span>
                                </div>
                                <div className="p-4">
                                  <div className="font-bold text-sm text-slate-800">{item.name}</div>
                                  <div className="text-xs text-slate-500 mt-1 line-clamp-2 min-h-[34px]">{item.subtitle}</div>
                                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                                    <ImagePlus className="w-3.5 h-3.5" />
                                    继续设置
                                  </div>
                                </div>
                              </button>
                            ))}

                            <button
                              type="button"
                              className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors min-h-[272px] flex flex-col items-center justify-center text-slate-500 hover:text-emerald-600"
                            >
                              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                <Plus className="w-7 h-7" />
                              </div>
                              <div className="mt-4 text-sm font-bold">{section.createLabel}</div>
                              <div className="mt-1 text-xs">手动补充缺失资产</div>
                            </button>
                          </div>
                        </section>
                      );
                    })}
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
                          <div className="text-[11px] text-slate-500 mt-2">{editablePreviewShots[plan.id].length} 镜</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto custom-scrollbar">
                    <div className={`grid ${previewGridClass} min-w-max text-[12px] font-bold text-white bg-[#374151]`}>
                      <div className="px-3 py-4 border-r border-white/10">镜号</div>
                      <div className="px-4 py-4 border-r border-white/10">状态</div>
                      <div className="px-4 py-4 border-r border-white/10">角色</div>
                      <div className="px-4 py-4 border-r border-white/10">场景</div>
                      <div className="px-4 py-4 border-r border-white/10">道具</div>
                      <div className="px-4 py-4 border-r border-white/10">
                        {previewPlan === 'image-video' ? '画面描述词' : '视频描述词'}
                      </div>
                      <div className="px-4 py-4 border-r border-white/10">台词</div>
                      <div className="px-4 py-4">音效</div>
                    </div>

                    {currentPreviewShots.map((shot, index) => (
                      <div
                        key={`${previewPlan}-${shot.id}`}
                        className={`group/shot relative grid ${previewGridClass} min-w-max text-sm text-slate-700 bg-white ${index !== currentPreviewShots.length - 1 ? 'border-b border-slate-200' : ''}`}
                      >
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => insertPreviewShotAfter(previewPlan, currentPreviewShots[index - 1].id)}
                            className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center opacity-0 group-hover/shot:opacity-100 transition-opacity hover:bg-emerald-600"
                            aria-label={`在第 ${shot.id - 1} 镜后新增分镜`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}

                        <div className="px-3 py-4 border-r border-slate-200 font-bold text-slate-800 flex items-start justify-between gap-2">
                          <span className="pt-1">{shot.id}</span>
                          <button
                            type="button"
                            onClick={() => deletePreviewShot(previewPlan, shot.id)}
                            disabled={currentPreviewShots.length <= 1}
                            className="mt-0.5 rounded-lg border border-slate-200 bg-white p-1 text-slate-400 opacity-0 group-hover/shot:opacity-100 transition-opacity hover:border-rose-200 hover:text-rose-500 disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label={`删除第 ${shot.id} 镜`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="px-3 py-4 border-r border-slate-200">
                          <input
                            value={shot.status}
                            onChange={(e) => updatePreviewShot(previewPlan, shot.id, 'status', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-emerald-300 focus:bg-white"
                          />
                        </div>

                        <div className="px-3 py-4 border-r border-slate-200">
                          <TagEditor
                            tags={shot.characters}
                            placeholder="输入角色后回车"
                            tone="character"
                            onAdd={(value) => addPreviewTag(previewPlan, shot.id, 'characters', value)}
                            onRemove={(value) => removePreviewTag(previewPlan, shot.id, 'characters', value)}
                          />
                        </div>

                        <div className="px-3 py-4 border-r border-slate-200">
                          <TagEditor
                            tags={shot.scenes}
                            placeholder="输入场景后回车"
                            tone="scene"
                            onAdd={(value) => addPreviewTag(previewPlan, shot.id, 'scenes', value)}
                            onRemove={(value) => removePreviewTag(previewPlan, shot.id, 'scenes', value)}
                          />
                        </div>

                        <div className="px-3 py-4 border-r border-slate-200">
                          <TagEditor
                            tags={shot.props}
                            placeholder="输入道具后回车"
                            tone="prop"
                            onAdd={(value) => addPreviewTag(previewPlan, shot.id, 'props', value)}
                            onRemove={(value) => removePreviewTag(previewPlan, shot.id, 'props', value)}
                          />
                        </div>

                        <div className="px-4 py-4 border-r border-slate-200">
                          <textarea
                            value={previewPlan === 'image-video' ? shot.visualPrompt ?? '' : shot.videoPrompt}
                            onChange={(e) => updatePreviewShot(previewPlan, shot.id, previewPlan === 'image-video' ? 'visualPrompt' : 'videoPrompt', e.target.value)}
                            className="w-full min-h-[140px] resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm leading-7 text-slate-700 outline-none focus:border-emerald-300 focus:bg-white"
                          />
                        </div>

                        <div className="px-4 py-4 border-r border-slate-200">
                          <textarea
                            value={shot.dialogue}
                            onChange={(e) => updatePreviewShot(previewPlan, shot.id, 'dialogue', e.target.value)}
                            className="w-full min-h-[140px] resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm leading-7 text-slate-700 outline-none focus:border-emerald-300 focus:bg-white"
                          />
                        </div>

                        <div className="px-4 py-4">
                          <textarea
                            value={shot.sound}
                            onChange={(e) => updatePreviewShot(previewPlan, shot.id, 'sound', e.target.value)}
                            className="w-full min-h-[140px] resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm leading-7 text-slate-700 outline-none focus:border-emerald-300 focus:bg-white"
                          />
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function TagEditor({
  tags,
  placeholder,
  tone,
  onAdd,
  onRemove,
}: {
  tags: string[];
  placeholder: string;
  tone: 'character' | 'scene' | 'prop';
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const [draft, setDraft] = useState('');

  const toneClassName = tone === 'character'
    ? 'bg-sky-50 border-sky-100 text-sky-700'
    : tone === 'scene'
      ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
      : 'bg-violet-50 border-violet-100 text-violet-700';

  const handleSubmit = () => {
    if (!draft.trim()) return;
    onAdd(draft);
    setDraft('');
  };

  return (
    <div className="min-h-[96px] rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 flex flex-wrap content-start gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${toneClassName}`}
        >
          {tag}
          <button
            type="button"
            onClick={() => onRemove(tag)}
            className="text-current/60 hover:text-current transition-colors"
            aria-label={`删除${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === '，' || e.key === ',') {
            e.preventDefault();
            handleSubmit();
          }

          if (e.key === 'Backspace' && !draft && tags.length > 0) {
            onRemove(tags[tags.length - 1]);
          }
        }}
        onBlur={handleSubmit}
        className="min-w-[88px] flex-1 bg-transparent py-1 text-xs text-slate-700 outline-none placeholder:text-slate-400"
        placeholder={tags.length === 0 ? placeholder : '继续添加'}
      />
    </div>
  );
}
