import React, { useState } from 'react';
import { FileText, Upload, Wand2, Users, User, ChevronDown, ChevronUp, MapPinned, Package, Plus, Trash2, ScanSearch, Settings2, Link2, Copy } from 'lucide-react';

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
    shortHint: '多张参考图直接生成视频分镜',
    description: '更适合控制镜头运动、节奏和分镜参数，便于后续精细化调整。',
    badge: '镜头控制更强',
  },
  {
    id: 'image-video' as PlanId,
    title: '图生视频方案',
    shortHint: '先生成图，再图生视频',
    description: '更适合突出首帧画面质感和视觉氛围，方便快速预览分镜效果。',
    badge: '画面氛围更强',
  },
];

const initialPreviewShots: Record<PlanId, Array<{
  id: number;
  status: string;
  splitNo: string;
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
      splitNo: '1-1',
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
      splitNo: '1-2',
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
      splitNo: '1-3',
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
      splitNo: '1-1',
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
      splitNo: '1-2',
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
      splitNo: '1-3',
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
      splitNo: '1-4',
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
      splitNo: '1-5',
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
  splitNo: `1-${id}`,
  characters: [],
  scenes: [],
  props: [],
  visualPrompt: planId === 'image-video' ? '' : undefined,
  videoPrompt: '',
  dialogue: '',
  sound: '',
});

const normalizePreviewShots = (shots: Array<{
  id: number;
  status: string;
  splitNo: string;
  characters: string[];
  scenes: string[];
  props: string[];
  visualPrompt?: string;
  videoPrompt: string;
  dialogue: string;
  sound: string;
}>) => {
  const defaultPrefix = '1';
  const firstSplitNo = shots[0]?.splitNo ?? `${defaultPrefix}`;
  const parts = firstSplitNo.split('-').filter(Boolean);
  const prefix = parts.length > 0 ? parts[0] : '1';

  return shots.map((shot, index) => ({
    ...shot,
    id: index + 1,
    splitNo: `${prefix}-${index + 1}`,
  }));
};

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
        bound: true,
      },
      {
        name: '士兵群演',
        subtitle: '陷阵营士兵黑色铁甲背影',
        image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=500&q=80',
        status: 'AI识别',
        bound: true,
      },
      {
        name: '林倩',
        subtitle: '点击继续绑定角色参考图',
        status: '未绑定',
        bound: false,
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
        bound: true,
      },
      {
        name: '篝火区域',
        subtitle: '朱砂红区域与金色火焰构图',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60',
        status: '待完善',
        bound: true,
      },
      {
        name: '城市废墟',
        subtitle: '点击继续绑定场景参考图',
        status: '未绑定',
        bound: false,
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
        bound: true,
      },
      {
        name: '铁甲兵器',
        subtitle: '黑色护甲与武器装备',
        image: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=500&auto=format&fit=crop&q=60',
        status: '待完善',
        bound: true,
      },
      {
        name: '篝火火堆',
        subtitle: '夜景主光源与情绪锚点',
        image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=500&auto=format&fit=crop&q=60',
        status: 'AI识别',
        bound: true,
      },
      {
        name: '猛犸象',
        subtitle: '点击继续绑定道具参考图',
        status: '未绑定',
        bound: false,
      },
    ],
  },
];

export default function ScriptAndAssets({ onNext }: { onNext: (mode: StoryboardMode) => void }) {
  const ui = {
    primary: '#01cd74',
    text: '#1c2329',
    bg: '#e8e9ea',
    border: '#d2d3d4',
    window: '#f8f8f9',
    subText: '#a4a7a9',
    navBg: '#1c2329e6',
    disabled: '#dddddd',
  };
  const [isParsing, setIsParsing] = useState(false);
  const [hasParsed, setHasParsed] = useState(false);
  const [scriptText, setScriptText] = useState(
    `1日，夜，陷阵营地\n出场人物：老兵甲，士兵群演\n\n上帝视角垂直俯拍，极简几何构图。背景是深不见底的黑，中央是一个巨大的正方形朱砂红地毯区域。正中心是一团金色的圆形火焰（青铜方鼎）。三十个黑色的圆点（士兵）整齐围坐在火周围。\n老兵甲：（啃着羊腿，含糊不清）林兄弟，今天可太解气了！\n\n`
  );
  const [isScriptEditing, setIsScriptEditing] = useState(false);
  const [scriptDraftText, setScriptDraftText] = useState(scriptText);
  
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
  const [isPromptConfigOpen, setIsPromptConfigOpen] = useState(true);
  const [planPrompts, setPlanPrompts] = useState<Record<PlanId, string>>(defaultPrompts);
  const [activeRightTab, setActiveRightTab] = useState<RightTab>('assets');
  const [previewPlan, setPreviewPlan] = useState<PlanId>('multi-parameter');
  const [adoptedPlan, setAdoptedPlan] = useState<PlanId | null>(null);
  const [adoptedShotIdsByPlan, setAdoptedShotIdsByPlan] = useState<Record<PlanId, number[]>>({
    'multi-parameter': [],
    'image-video': [],
  });
  const [editablePreviewShots, setEditablePreviewShots] = useState(initialPreviewShots);
  const [editingSplitNoTarget, setEditingSplitNoTarget] = useState<{ planId: PlanId; shotId: number } | null>(null);
  const [editingSplitNoValue, setEditingSplitNoValue] = useState('');

  const selectedPlanOptions = planOptions.filter((plan) => selectedPlans.includes(plan.id));
  const previewPlanOptions = planOptions.filter((plan) => selectedPlans.includes(plan.id));
  const isSingleGeneratedPlan = previewPlanOptions.length === 1;
  const currentPreviewShots = editablePreviewShots[previewPlan];
  const currentAdoptedShotIds = adoptedShotIdsByPlan[previewPlan] ?? [];
  const hasUnadoptedShots = currentPreviewShots.some((shot) => !currentAdoptedShotIds.includes(shot.id));
  const allCurrentChecked = currentPreviewShots.length > 0 && currentAdoptedShotIds.length === currentPreviewShots.length;
  const canSelectShots = adoptedPlan !== null;
  const canProceed = adoptedPlan !== null && (adoptedShotIdsByPlan[adoptedPlan]?.length ?? 0) > 0;
  const nextStepDisabledReason = '暂无采用分镜，不可点';
  const canOpenPreview = hasParsed && !isParsing;
  const previewShotCountLabelMap: Record<PlanId, string> = {
    'multi-parameter': '10 分镜',
    'image-video': '20 分镜',
  };

  const togglePlan = (planId: PlanId) => {
    setSelectedPlans((currentPlans) => {
      if (currentPlans.includes(planId)) {
        return currentPlans.filter((id) => id !== planId);
      }
      return [...currentPlans, planId];
    });
  };

  const handleParse = () => {
    if (selectedPlans.length === 0) return;
    setIsParsing(true);
    setTimeout(() => {
      const autoSelectedPlan = selectedPlans.length === 1 ? selectedPlans[0] : null;
      setIsParsing(false);
      setHasParsed(true);
      setEditablePreviewShots(initialPreviewShots);
      setPreviewPlan(selectedPlans[0]);
      setAdoptedPlan(autoSelectedPlan);
      setAdoptedShotIdsByPlan({
        'multi-parameter': [],
        'image-video': [],
      });
      setActiveRightTab('preview');
    }, 1500);
  };

  const updatePreviewShot = (
    planId: PlanId,
    shotId: number,
    field: 'status' | 'splitNo' | 'visualPrompt' | 'videoPrompt' | 'dialogue' | 'sound',
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

  const startEditingSplitNo = (planId: PlanId, shotId: number, currentValue: string) => {
    setEditingSplitNoTarget({ planId, shotId });
    setEditingSplitNoValue(currentValue);
  };

  const saveEditingSplitNo = () => {
    if (!editingSplitNoTarget) return;
    const nextValue = editingSplitNoValue.trim();
    if (!nextValue) {
      setEditingSplitNoTarget(null);
      setEditingSplitNoValue('');
      return;
    }

    updatePreviewShot(editingSplitNoTarget.planId, editingSplitNoTarget.shotId, 'splitNo', nextValue);
    setEditingSplitNoTarget(null);
    setEditingSplitNoValue('');
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

      const reindexedShots = normalizePreviewShots([
        ...shots.slice(0, insertIndex + 1),
        nextShot,
        ...shots.slice(insertIndex + 1),
      ]);

      return {
        ...currentShots,
        [planId]: reindexedShots,
      };
    });

    setAdoptedShotIdsByPlan((current) => {
      const selectedIds = current[planId] ?? [];
      const shifted = selectedIds.map((id) => (id > shotId ? id + 1 : id));
      return { ...current, [planId]: shifted };
    });
  };

  const deletePreviewShot = (planId: PlanId, shotId: number) => {
    setEditablePreviewShots((currentShots) => {
      const shots = currentShots[planId];
      if (shots.length <= 1) return currentShots;

      const reindexedShots = normalizePreviewShots(shots.filter((shot) => shot.id !== shotId));

      return {
        ...currentShots,
        [planId]: reindexedShots,
      };
    });

    setAdoptedShotIdsByPlan((current) => {
      const selectedIds = current[planId] ?? [];
      const reindexed = selectedIds
        .filter((id) => id !== shotId)
        .map((id) => (id > shotId ? id - 1 : id));
      return { ...current, [planId]: reindexed };
    });
  };

  const duplicatePreviewShotAfter = (planId: PlanId, shotId: number) => {
    setEditablePreviewShots((currentShots) => {
      const shots = currentShots[planId];
      const insertIndex = shots.findIndex((shot) => shot.id === shotId);
      if (insertIndex === -1) return currentShots;

      const source = shots[insertIndex];
      const copiedShot = {
        ...source,
        id: source.id + 1,
        splitNo: source.splitNo,
        characters: [...source.characters],
        scenes: [...source.scenes],
        props: [...source.props],
      };

      const reindexedShots = normalizePreviewShots([
        ...shots.slice(0, insertIndex + 1),
        copiedShot,
        ...shots.slice(insertIndex + 1),
      ]);

      return {
        ...currentShots,
        [planId]: reindexedShots,
      };
    });

    setAdoptedShotIdsByPlan((current) => {
      const selectedIds = current[planId] ?? [];
      const shifted = selectedIds.map((id) => (id > shotId ? id + 1 : id));
      return { ...current, [planId]: shifted };
    });
  };

  const toggleShotChecked = (planId: PlanId, shotId: number) => {
    if (!adoptedPlan) return;
    setAdoptedShotIdsByPlan((current) => {
      const selectedIds = current[planId] ?? [];
      const nextIds = selectedIds.includes(shotId)
        ? selectedIds.filter((id) => id !== shotId)
        : [...selectedIds, shotId].sort((a, b) => a - b);
      return { ...current, [planId]: nextIds };
    });
  };

  const toggleSelectAllShots = (planId: PlanId) => {
    if (!adoptedPlan) return;
    setAdoptedShotIdsByPlan((current) => {
      const allIds = editablePreviewShots[planId].map((shot) => shot.id);
      const currentIds = current[planId] ?? [];
      return {
        ...current,
        [planId]: currentIds.length === allIds.length ? [] : allIds,
      };
    });
  };

  const clearUnadoptedShots = (planId: PlanId) => {
    if (!adoptedPlan) return;
    const adoptedSet = new Set(adoptedShotIdsByPlan[planId] ?? []);
    const shots = editablePreviewShots[planId] ?? [];
    if (shots.length === 0) return;
    const hasUnadopted = shots.some((shot) => !adoptedSet.has(shot.id));
    if (!hasUnadopted) return;

    const confirmed = window.confirm('确定要删除所有未采用的分镜吗？');
    if (!confirmed) return;

    setEditablePreviewShots((currentShots) => {
      const planShots = currentShots[planId];
      const nextShots = planShots.filter((shot) => adoptedSet.has(shot.id));
      return {
        ...currentShots,
        [planId]: normalizePreviewShots(nextShots),
      };
    });

    setAdoptedShotIdsByPlan((current) => {
      const keptCount = shots.filter((shot) => adoptedSet.has(shot.id)).length;
      const nextIds = Array.from({ length: keptCount }, (_, index) => index + 1);
      return { ...current, [planId]: nextIds };
    });
  };

  const handleProceed = () => {
    if (!canProceed || !adoptedPlan) return;
    onNext(adoptedPlan === 'multi-parameter' ? 'direct-video' : 'image-video');
  };

  const toggleScriptEditing = () => {
    if (!isScriptEditing) {
      setScriptDraftText(scriptText);
      setIsScriptEditing(true);
      return;
    }

    setScriptText(scriptDraftText);
    setIsScriptEditing(false);
  };

  return (
    <div className="flex-1 flex overflow-hidden p-3 gap-3 pb-0" style={{ backgroundColor: ui.bg }}>
      {/* 左侧：剧本输入 */}
      <aside className="w-[400px] rounded-2xl border shadow-sm flex flex-col overflow-hidden shrink-0 relative" style={{ backgroundColor: ui.window, borderColor: ui.border }}>
        <div className="px-4 py-3 border-b flex justify-between items-center" style={{ borderColor: ui.border, backgroundColor: '#f2f3f4' }}>
          <h2 className="font-bold text-sm flex items-center gap-2 text-slate-700">
            <FileText className="w-4 h-4" style={{ color: ui.primary }} /> 本集剧本
          </h2>
          <button
            type="button"
            onClick={toggleScriptEditing}
            className="text-xs flex items-center gap-1 transition-colors font-medium hover:text-slate-700"
            style={{ color: isScriptEditing ? ui.primary : '#8e9194' }}
          >
            <FileText className="w-3 h-3" />
            {isScriptEditing ? '保存编辑' : '手动编辑'}
          </button>
        </div>
        <div className="flex-1 p-0 relative">
          <textarea
            className={`w-full h-full p-4 resize-none text-slate-700 text-sm leading-relaxed placeholder:text-slate-400 ${
              isScriptEditing ? 'outline-none bg-white' : 'outline-none bg-transparent cursor-default'
            }`}
            placeholder="在此粘贴剧本内容..."
            value={isScriptEditing ? scriptDraftText : scriptText}
            onChange={(e) => {
              if (!isScriptEditing) return;
              setScriptDraftText(e.target.value);
            }}
            readOnly={!isScriptEditing}
          ></textarea>
        </div>
        
        {isPromptConfigOpen && (
          <div
            className="absolute left-3 right-3 rounded-2xl border shadow-xl z-40 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
            style={{ top: 72, bottom: 94, backgroundColor: ui.window, borderColor: ui.border }}
          >
            <div className="h-full overflow-y-auto p-4 custom-scrollbar">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">生成方式</span>
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
                        className={`text-left rounded-xl border px-3 py-2.5 transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-200 shadow-sm'
                            : 'border-transparent bg-[#eceeef] hover:border-slate-300'
                        }`}
                      >
                        <div className={`text-sm font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-800'}`}>
                          {plan.id === 'multi-parameter' ? '多参生视频' : '图生视频'}
                        </div>
                        <div className={`mt-1 text-xs leading-4 ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {plan.shortHint}
                        </div>
                      </button>
                      );
                    })}
                </div>
              </div>

                {selectedPlans.length > 0 && (
                  <div className="space-y-3">
                  {selectedPlanOptions.map((plan) => (
                    <div key={plan.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-800">
                          {plan.id === 'multi-parameter' ? '多参生视频提示词' : '图生视频提示词'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPlanPrompts((currentPrompts) => ({ ...currentPrompts, [plan.id]: defaultPrompts[plan.id] }))}
                            className="text-xs text-slate-500 hover:text-emerald-600"
                          >
                            恢复默认
                          </button>
                        </div>
                        <textarea
                          value={planPrompts[plan.id]}
                          onChange={(e) => setPlanPrompts((currentPrompts) => ({ ...currentPrompts, [plan.id]: e.target.value }))}
                          className="w-full text-sm text-slate-700 p-3 bg-[#f3f4f5] border border-slate-300 rounded-xl resize-y h-32 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none leading-relaxed transition-all"
                          spellCheck="false"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 提示词设置栏 */}
        <div className="p-4 border-t shadow-[0_-10px_20px_-15px_rgba(0,0,0,0.05)] relative z-50" style={{ backgroundColor: ui.window, borderColor: ui.border }}>
          <button
            type="button"
            onClick={() => setIsPromptConfigOpen((open) => !open)}
            className="w-full flex items-center justify-between text-left pb-2 border-b"
            style={{ borderColor: ui.border }}
          >
            <div className="font-bold text-slate-800 text-[22px] leading-none flex items-center gap-1.5">
              <Settings2 className="w-4 h-4 text-slate-500" />
              <span className="text-sm">拆分镜提示词</span>
            </div>
            {isPromptConfigOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={handleParse}
            disabled={isParsing || selectedPlans.length === 0}
            className="w-full py-2.5 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ backgroundColor: ui.navBg }}
          >
            {isParsing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" style={{ color: '#8ef2c8' }} />
            )}
            {isParsing
              ? '生成中...'
              : `生成${selectedPlans.length > 1 ? `${selectedPlans.length}套` : ''}分镜方案`}
          </button>
        </div>
      </aside>

      {/* 右侧：资产绑定面板 */}
      <main className="flex-1 rounded-2xl border shadow-sm flex flex-col overflow-hidden relative" style={{ backgroundColor: ui.window, borderColor: ui.border }}>
        <div className="px-4 pt-3 pb-2 border-b space-y-2" style={{ borderColor: ui.border, backgroundColor: '#f2f3f4' }}>
          <div className="flex items-center justify-end">
            <div className="relative group">
              <button
                type="button"
                onClick={handleProceed}
                disabled={!canProceed}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm disabled:cursor-not-allowed"
                style={!canProceed ? { backgroundColor: ui.disabled, color: '#8e9194' } : { backgroundColor: ui.primary, color: '#fff' }}
              >
                开始制作 →
              </button>
              {!canProceed && (
                <div className="pointer-events-none absolute right-0 top-full mt-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 z-20">
                  <div className="whitespace-nowrap rounded-lg bg-[#1c2329] text-white text-xs px-3 py-1.5 shadow-lg">
                    {nextStepDisabledReason}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-[16px] font-bold text-slate-800">本集设定与分镜</h3>
            <p className="text-xs text-slate-500 mt-1">确定设定绑定无误并确认分镜细节后开始制作</p>
          </div>

          <div className="grid grid-cols-2 rounded-full border p-1 gap-1 max-w-[360px]" style={{ borderColor: ui.border, backgroundColor: '#eceeef' }}>
            <button
              type="button"
              onClick={() => setActiveRightTab('assets')}
              className={`h-8 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeRightTab === 'assets'
                  ? 'bg-white border border-slate-200 shadow-sm text-slate-900'
                  : 'text-slate-500'
              }`}
              style={activeRightTab === 'assets' ? { color: ui.text } : undefined}
            >
              <Users className="w-3.5 h-3.5" />
              设定资产
            </button>
            <button
              type="button"
              onClick={() => {
                if (!canOpenPreview) return;
                setActiveRightTab('preview');
              }}
              disabled={!canOpenPreview}
              className={`h-8 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeRightTab === 'preview'
                  ? 'bg-white border border-slate-200 shadow-sm text-slate-900'
                  : 'text-slate-500'
              }`}
              style={
                activeRightTab === 'preview'
                  ? { color: ui.text }
                  : (!canOpenPreview ? { color: '#b5b8bc', cursor: 'not-allowed' } : undefined)
              }
              title={!canOpenPreview ? '请先在左侧生成分镜方案' : ''}
            >
              <ScanSearch className="w-3.5 h-3.5" />
              拆分镜预览
            </button>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden flex flex-col">
          {!hasParsed && !isParsing && (
            <div className="absolute inset-0 z-10 bg-[#f3f4f5]">
              <div className="h-full w-full" />
            </div>
          )}

          {isParsing && (
            <div className="absolute inset-0 z-20 bg-slate-50/90 backdrop-blur-sm p-6">
              <div className="relative h-full rounded-3xl border border-slate-300 bg-[#f3f4f5] p-6 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent animate-[shimmer_1.8s_infinite]" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-6 w-44 rounded bg-slate-300/70" />
                      <div className="mt-3 h-4 w-72 rounded bg-slate-200/90" />
                    </div>
                    <div className="h-10 w-32 rounded-full bg-slate-300/70" />
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="h-18 rounded-2xl border border-emerald-200 bg-white/85" />
                    <div className="h-18 rounded-2xl border border-slate-200 bg-white/80" />
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="h-40 rounded-2xl border border-slate-200 bg-white/80" />
                    <div className="h-40 rounded-2xl border border-slate-200 bg-white/80" />
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex items-center gap-2.5 rounded-full bg-[#1c2329] px-4 py-2 text-white shadow-lg">
                  <div className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                  <span className="text-sm font-semibold tracking-[0.2px]">正在生成拆分镜方案...</span>
                </div>
              </div>
            </div>
          )}

          {hasParsed && !isParsing && (
            <>
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

                          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            {section.items.map((item) => (
                              <button
                                key={item.name}
                                type="button"
                                className={`rounded-3xl border overflow-hidden shadow-sm transition-all text-left group min-h-[216px] ${
                                  item.bound
                                    ? 'bg-white border-slate-200 hover:border-emerald-300'
                                    : 'bg-[#f3f4f5] border-slate-300'
                                }`}
                              >
                                {item.bound ? (
                                  <>
                                    <div className="h-30 relative overflow-hidden bg-slate-100">
                                      <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                        style={{ backgroundImage: `url(${item.image})` }}
                                      />
                                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
                                      <span className="absolute top-3 left-3 text-white text-[10px] px-2 py-1 bg-black/35 rounded-full font-medium backdrop-blur-sm">
                                        {item.status}
                                      </span>
                                    </div>
                                    <div className="p-3">
                                      <div className="font-bold text-sm text-slate-800">{item.name}</div>
                                      <div className="text-xs text-slate-500 mt-1 line-clamp-1 min-h-[18px]">{item.subtitle}</div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="h-full flex flex-col items-center justify-center px-4 text-center">
                                    <Link2 className="w-11 h-11 text-slate-400" />
                                    <div className="mt-3 text-2xl leading-none text-slate-400">+</div>
                                    <div className="mt-3 text-base font-semibold text-slate-600">绑定{section.title}</div>
                                    <div className="mt-1.5 text-xs text-slate-500">{item.name}</div>
                                  </div>
                                )}
                              </button>
                            ))}

                            <button
                              type="button"
                              className="rounded-3xl border-2 border-dashed border-[#98a2b3] bg-[#f3f4f5] hover:border-emerald-300 transition-colors min-h-[216px] flex flex-col items-center justify-center text-slate-500 hover:text-emerald-600"
                            >
                              <div className="w-14 h-14 rounded-2xl bg-transparent border-0 flex items-center justify-center">
                                <Plus className="w-7 h-7" />
                              </div>
                              <div className="mt-2 text-sm font-bold">{section.createLabel}</div>
                            </button>
                          </div>
                        </section>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeRightTab === 'preview' && (
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 animate-in fade-in duration-500 custom-scrollbar space-y-4">
                  <section className="rounded-3xl border border-slate-300 bg-[#f3f4f5] p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-base leading-none font-bold text-slate-800">拆分镜方案预览</h4>
                        <p className="text-xs text-slate-500 mt-2">先预览分镜内容，再决定采用哪个版本进入分镜管理页。</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (isSingleGeneratedPlan && adoptedPlan === previewPlan) return;
                          setAdoptedPlan(previewPlan);
                          setPreviewPlan(previewPlan);
                        }}
                        className="px-4 h-10 rounded-full text-sm font-bold transition-all ui-btn-dark shadow-sm"
                      >
                        {adoptedPlan === previewPlan
                          ? (isSingleGeneratedPlan ? '已自动选定当前方案' : '当前方案已选定')
                          : '选定当前方案'}
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {previewPlanOptions.map((plan) => (
                        <div key={plan.id} className="relative group/plan-tab">
                          <button
                            type="button"
                            onClick={() => {
                              if (adoptedPlan) return;
                              setPreviewPlan(plan.id);
                            }}
                            disabled={adoptedPlan !== null}
                            className={`w-full rounded-2xl border px-4 py-4 text-center transition-all ${
                              previewPlan === plan.id
                                ? 'bg-white border-emerald-500 ring-1 ring-emerald-200 shadow-sm'
                                : 'bg-[#eceeef] border-transparent hover:border-slate-300'
                            } ${adoptedPlan !== null ? 'cursor-not-allowed' : ''}`}
                          >
                            <div className={`text-sm leading-none font-bold ${previewPlan === plan.id ? 'text-emerald-700' : 'text-slate-800'}`}>
                              {plan.id === 'multi-parameter' ? '多参生视频' : '图生视频'}
                            </div>
                          <div className="text-base leading-none text-slate-500 mt-2">{previewShotCountLabelMap[plan.id]}</div>
                        </button>
                          {adoptedPlan !== null && (
                            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 translate-y-1 group-hover/plan-tab:opacity-100 group-hover/plan-tab:translate-y-0 transition-all duration-150 z-20">
                              <div className="whitespace-nowrap rounded-lg bg-[#1c2329] text-white text-xs px-3 py-1.5 shadow-lg">方案已选定，不可切换</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-3xl border border-slate-300 bg-[#f3f4f5] p-3 shadow-sm">
                    <div className="flex items-center justify-between px-2 py-1">
                      <div className="flex items-center gap-3 text-sm text-slate-700">
                        <div className="relative group/selectall">
                          <button
                            type="button"
                            onClick={() => toggleSelectAllShots(previewPlan)}
                            disabled={!canSelectShots}
                            className={`w-8 h-8 rounded-full border-2 inline-flex items-center justify-center transition-colors ${
                              allCurrentChecked ? 'border-emerald-300 bg-white shadow-[0_0_0_1px_rgba(1,205,116,0.18)]' : 'border-[#b8e9d2] bg-white'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <span
                              className={`w-3 h-3 rounded-full transition-colors ${
                                allCurrentChecked ? 'bg-emerald-500' : 'bg-transparent'
                              }`}
                            />
                          </button>
                          {!canSelectShots && (
                            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 translate-y-1 group-hover/selectall:opacity-100 group-hover/selectall:translate-y-0 transition-all duration-150 z-20">
                              <div className="whitespace-nowrap rounded-lg bg-[#1c2329] text-white text-xs px-3 py-1.5 shadow-lg">请先选方案</div>
                            </div>
                          )}
                        </div>
                        <span className="text-slate-700">全选</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-slate-500">已选{currentAdoptedShotIds.length}个</span>
                        <button
                          type="button"
                          onClick={() => clearUnadoptedShots(previewPlan)}
                          disabled={!canSelectShots || !hasUnadoptedShots}
                          className={`inline-flex items-center justify-center h-10 px-4 rounded-[18px] border-2 text-sm font-medium leading-none transition-colors ${
                            canSelectShots && hasUnadoptedShots
                              ? 'border-[#ff6b6d] text-[#ff6b6d] bg-white hover:bg-red-50'
                              : 'border-slate-300 bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                          title={!canSelectShots ? '请先选方案' : !hasUnadoptedShots ? '当前没有未采用的分镜' : ''}
                          style={{
                            borderWidth: 2,
                            borderStyle: 'solid',
                            borderColor: canSelectShots && hasUnadoptedShots ? '#ff6b6d' : '#cbd5e1',
                            backgroundColor: canSelectShots && hasUnadoptedShots ? '#ffffff' : '#f1f5f9',
                          }}
                        >
                          清空未采用
                        </button>
                      </div>
                      <button className="h-10 px-4 rounded-full border-2 border-slate-700 text-slate-700 text-sm font-bold flex items-center gap-2 bg-white">
                        <Upload className="w-4 h-4" />
                        导出表格
                      </button>
                    </div>

                    <div className="space-y-3 mt-3">
                      {currentPreviewShots.map((shot, index) => (
                        (() => {
                          const isShotAdopted = currentAdoptedShotIds.includes(shot.id);
                          const showSolidChecked = isShotAdopted;
                          const isShotEditable = !isShotAdopted;

                          return (
                        <div
                          key={`${previewPlan}-${shot.id}`}
                          className={`group/shot relative rounded-2xl border bg-[#f7f8f9] overflow-visible transition-all ${
                            showSolidChecked
                              ? 'border-emerald-300 ring-1 ring-emerald-100'
                              : 'border-slate-300'
                          }`}
                        >
                          <div className="px-3 py-2 border-b border-slate-300 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleShotChecked(previewPlan, shot.id)}
                              disabled={!canSelectShots}
                              title={!canSelectShots ? '请先选方案' : ''}
                              className={`w-8 h-8 rounded-full inline-flex items-center justify-center border-2 transition-colors disabled:opacity-45 disabled:cursor-not-allowed ${
                                showSolidChecked
                                  ? 'border-emerald-300 bg-white shadow-[0_0_0_1px_rgba(1,205,116,0.22)]'
                                  : 'border-[#b8e9d2] bg-white hover:bg-emerald-50/40'
                              }`}
                            >
                              <span
                                className={`w-3 h-3 rounded-full transition-colors ${
                                  showSolidChecked ? 'bg-emerald-500' : 'bg-transparent'
                                }`}
                              />
                            </button>

                            <div className="min-w-[200px]">
                              <div className="text-base leading-none text-slate-800 font-medium flex items-center gap-1">
                                <span>{shot.id}.</span>
                                {editingSplitNoTarget?.planId === previewPlan && editingSplitNoTarget?.shotId === shot.id ? (
                                  <input
                                    autoFocus
                                    value={editingSplitNoValue}
                                    onChange={(e) => setEditingSplitNoValue(e.target.value)}
                                    onBlur={saveEditingSplitNo}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') saveEditingSplitNo();
                                      if (e.key === 'Escape') {
                                        setEditingSplitNoTarget(null);
                                        setEditingSplitNoValue('');
                                      }
                                    }}
                                    className="h-7 min-w-[120px] px-2 rounded-md border border-emerald-300 bg-white text-sm outline-none"
                                  />
                                ) : (
                                  <span
                                    onDoubleClick={() => {
                                      if (!isShotEditable) return;
                                      startEditingSplitNo(previewPlan, shot.id, shot.splitNo);
                                    }}
                                    className={isShotEditable ? 'cursor-text' : 'cursor-default'}
                                    title={isShotEditable ? '双击可编辑分镜号' : '已采用分镜不可编辑'}
                                  >
                                    分镜{shot.splitNo}
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-full text-xs border border-slate-400 text-slate-700 bg-white">手动创建</span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs border ${
                                    isShotAdopted
                                      ? 'border-[#38bdf8] bg-[#38bdf8] text-white'
                                      : 'border-slate-300 text-slate-400 bg-slate-200'
                                  }`}
                                >
                                  {isShotAdopted ? '已采用' : '草稿已保存'}
                                </span>
                              </div>
                            </div>

                            <div className="h-8 w-px bg-slate-300" />
                            <AssetChipGroup
                              title="角色"
                              tone="character"
                              tags={shot.characters}
                              disabled={!isShotEditable}
                              onAdd={() => addPreviewTag(previewPlan, shot.id, 'characters', `角色${shot.characters.length + 1}`)}
                              onRemove={(value) => removePreviewTag(previewPlan, shot.id, 'characters', value)}
                            />
                            <div className="h-8 w-px bg-slate-300" />
                            <AssetChipGroup
                              title="场景"
                              tone="scene"
                              tags={shot.scenes}
                              disabled={!isShotEditable}
                              onAdd={() => addPreviewTag(previewPlan, shot.id, 'scenes', `场景${shot.scenes.length + 1}`)}
                              onRemove={(value) => removePreviewTag(previewPlan, shot.id, 'scenes', value)}
                            />
                            <div className="h-8 w-px bg-slate-300" />
                            <AssetChipGroup
                              title="道具"
                              tone="prop"
                              tags={shot.props}
                              disabled={!isShotEditable}
                              onAdd={() => addPreviewTag(previewPlan, shot.id, 'props', `道具${shot.props.length + 1}`)}
                              onRemove={(value) => removePreviewTag(previewPlan, shot.id, 'props', value)}
                            />

                            <div className="ml-auto" />
                          </div>

                            <div className="px-3 py-2 space-y-2">
                            <div>
                              <div className="text-xs font-bold text-slate-700 mb-1">视频提示词:</div>
                              <textarea
                                value={shot.videoPrompt}
                                onChange={(e) => updatePreviewShot(previewPlan, shot.id, 'videoPrompt', e.target.value)}
                                readOnly={!isShotEditable}
                                className="w-full min-h-[66px] resize-y rounded-xl border border-slate-300 bg-[#f3f4f5] px-3 py-2 text-sm leading-6 text-slate-700 outline-none focus:border-emerald-300 focus:bg-white"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <div className="text-xs font-bold text-slate-700 mb-1">台词:</div>
                                <textarea
                                  value={shot.dialogue}
                                  onChange={(e) => updatePreviewShot(previewPlan, shot.id, 'dialogue', e.target.value)}
                                  readOnly={!isShotEditable}
                                  className="w-full min-h-[56px] resize-y rounded-xl border border-slate-300 bg-[#f3f4f5] px-3 py-2 text-sm leading-6 text-slate-700 outline-none focus:border-emerald-300 focus:bg-white"
                                />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-700 mb-1">音效:</div>
                                <textarea
                                  value={shot.sound}
                                  onChange={(e) => updatePreviewShot(previewPlan, shot.id, 'sound', e.target.value)}
                                  readOnly={!isShotEditable}
                                  className="w-full min-h-[56px] resize-y rounded-xl border border-slate-300 bg-[#f3f4f5] px-3 py-2 text-sm leading-6 text-slate-700 outline-none focus:border-emerald-300 focus:bg-white"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="absolute left-1/2 bottom-0 z-[60] -translate-x-1/2 translate-y-1/2 h-9 rounded-full bg-[#374151] text-white px-2.5 flex items-center gap-2 opacity-0 group-hover/shot:opacity-100 transition-opacity shadow-lg pointer-events-auto">
                            <button
                              type="button"
                              onClick={() => duplicatePreviewShotAfter(previewPlan, shot.id)}
                              className="w-7 h-7 inline-flex items-center justify-center rounded-full hover:bg-white/15 transition-colors"
                              title="复制分镜"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertPreviewShotAfter(previewPlan, shot.id)}
                              className="w-7 h-7 inline-flex items-center justify-center rounded-full hover:bg-white/15 transition-colors"
                              title="新增分镜"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deletePreviewShot(previewPlan, shot.id)}
                              disabled={currentPreviewShots.length <= 1}
                              className="w-7 h-7 inline-flex items-center justify-center rounded-full hover:bg-white/15 transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
                              title="删除分镜"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                          );
                        })()
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function AssetChipGroup({
  title,
  tone,
  tags,
  disabled = false,
  onAdd,
  onRemove,
}: {
  title: string;
  tone: 'character' | 'scene' | 'prop';
  tags: string[];
  disabled?: boolean;
  onAdd: () => void;
  onRemove: (value: string) => void;
}) {
  const chipClassName = tone === 'character'
    ? 'bg-[#08b87b] border-[#08b87b] text-white'
    : tone === 'scene'
      ? 'bg-[#08a7b8] border-[#08a7b8] text-white'
      : 'bg-[#b89900] border-[#b89900] text-white';

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-sm font-medium text-slate-700">{title}:</span>
      {tags.map((tag) => (
        <span
          key={tag}
          className={`relative inline-flex items-center gap-1 rounded-lg border pl-1.5 pr-2 py-1 text-xs font-medium whitespace-nowrap ${chipClassName}`}
        >
          <span className="w-4 h-4 rounded bg-white/85 shrink-0" />
          <span>{tag}</span>
          <button
            type="button"
            onClick={() => onRemove(tag)}
            disabled={disabled}
            className="absolute -right-1 -top-1 w-3.5 h-3.5 rounded-full bg-slate-400 text-white text-[10px] leading-none flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ×
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className="text-sm text-slate-400 hover:text-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        添加
      </button>
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
