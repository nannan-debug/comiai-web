import React, { useMemo, useRef, useState } from 'react';
import { 
  BookOpen, PanelLeftClose, PanelLeftOpen, Cpu, Settings2, Play, 
  Image as ImageIcon, Video, SlidersHorizontal, Copy, Trash2, 
  Plus, CheckCircle2, Download, ChevronDown, LayoutGrid, Film,
  PlusCircle, X
} from 'lucide-react';

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

type StoryboardMode = 'image-video' | 'direct-video';
type CardMode = 'image' | 'video';
type GenerationStatus = 'idle' | 'generating' | 'completed';
type AssetType = 'scene' | 'character' | 'prop';

type PreviewState = {
  status: GenerationStatus;
  duration?: string;
  thumbnail?: string;
};

type ShotRecord = {
  id: number;
  assets: Array<{ type: AssetType; label: string; image?: string }>;
  references: string[];
  prompt: string;
  dialogue: string;
  sound: string;
  imagePreview: PreviewState;
  videoPreview: PreviewState;
};

const assetPresetPool: Record<AssetType, Array<{ label: string; image?: string }>> = {
  character: [
    { label: '老兵甲', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
    { label: '士兵群演', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=100&h=100&fit=crop' },
    { label: '林兄弟', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
  ],
  scene: [
    { label: '陷阵营地' },
    { label: '篝火区域' },
    { label: '营帐通道' },
    { label: '营地边缘' },
  ],
  prop: [
    { label: '青铜方鼎' },
    { label: '篝火火堆' },
    { label: '铁甲兵器' },
    { label: '战旗' },
  ],
};

const initialShotRecords: ShotRecord[] = [
  {
    id: 1,
    assets: [
      { type: 'scene', label: '陷阵营地' },
      { type: 'character', label: '老兵甲', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
      { type: 'prop', label: '青铜方鼎' },
    ],
    references: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=140&h=140&fit=crop&q=60'],
    prompt: '营地夜幕低垂，@{陷阵营地} 中央的营火在燃烧，@{老兵甲} 位于前景偏左，@{青铜方鼎} 作为视觉核心，人物与场景形成清晰主次关系。',
    dialogue: '老兵甲：今天总算能松口气了。',
    sound: '营地风声，木柴噼啪作响',
    imagePreview: {
      status: 'completed',
      thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=360&fit=crop&q=80',
    },
    videoPreview: {
      status: 'completed',
      thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=360&fit=crop&q=80',
      duration: '05s',
    },
  },
  {
    id: 2,
    assets: [
      { type: 'scene', label: '篝火区域' },
      { type: 'character', label: '士兵群演', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=100&h=100&fit=crop' },
      { type: 'prop', label: '篝火火堆' },
    ],
    references: [],
    prompt: '围绕 @{篝火区域} 做中景构图，@{士兵群演} 围坐成弧形，@{篝火火堆} 作为主光源，火光与暗部反差强烈。',
    dialogue: '暂无台词',
    sound: '火星爆裂声，铠甲轻微摩擦',
    imagePreview: {
      status: 'generating',
    },
    videoPreview: {
      status: 'idle',
    },
  },
  {
    id: 3,
    assets: [
      { type: 'scene', label: '营帐通道' },
      { type: 'character', label: '老兵甲', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
      { type: 'prop', label: '铁甲兵器' },
    ],
    references: ['https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=140&h=140&fit=crop&q=60'],
    prompt: '@{营帐通道} 被冷暖混合光切开，@{老兵甲} 走向镜头，@{铁甲兵器} 边缘泛出冷色高光，突出人物压迫感与步伐节奏。',
    dialogue: '老兵甲：都给我打起精神。',
    sound: '脚步踩地声，金属碰撞声',
    imagePreview: {
      status: 'idle',
    },
    videoPreview: {
      status: 'generating',
    },
  },
  {
    id: 4,
    assets: [
      { type: 'scene', label: '营地边缘' },
      { type: 'character', label: '士兵群演', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=100&h=100&fit=crop' },
      { type: 'prop', label: '战旗' },
    ],
    references: [],
    prompt: '@{营地边缘} 的 @{战旗} 在夜风中摇晃，@{士兵群演} 剪影层层递进，画面保留更多负空间，让风和旗成为情绪主导。',
    dialogue: '士兵群演：前面有动静。',
    sound: '旌旗掠风声，远处犬吠',
    imagePreview: {
      status: 'completed',
      thumbnail: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=600&h=360&fit=crop&q=80',
    },
    videoPreview: {
      status: 'idle',
    },
  },
];

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

export default function StoryboardManagement({ onNext, initialMode }: { onNext: (panelMode: CardMode) => void, initialMode: StoryboardMode }) {
  const [isScriptPanelOpen, setIsScriptPanelOpen] = useState(true);
  const [shots, setShots] = useState(initialShotRecords);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<{
    type: CardMode;
    title: string;
    thumbnail?: string;
    duration?: string;
  } | null>(null);

  // Style and Orientation State
  const [selectedStyle, setSelectedStyle] = useState('默认');
  const [selectedOrientation, setSelectedOrientation] = useState('16:9');
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
  const [isOrientationDropdownOpen, setIsOrientationDropdownOpen] = useState(false);

  const scriptLines = [
    "1日，夜，陷阵营地",
    "出场人物：老兵甲，士兵群演",
    "上帝视角垂直俯拍，极简几何构图。背景是深不见底的黑，中央是一个巨大的正方形朱砂红地毯区域。正中心是一团金色的圆形火焰（青铜方鼎）。三十个黑色的圆点（士兵）整齐围坐在火周围。",
    "老兵甲：（啃着羊腿，含糊不清）林兄弟，今天可太解气了！"
  ];

  const handleDeleteShot = (id: number) => {
    setShots((currentShots) => currentShots.filter((shot) => shot.id !== id).map((shot, index) => ({
      ...shot,
      id: index + 1,
    })));
  };

  const handleAddShot = () => {
    setShots((currentShots) => {
      const newId = currentShots.length + 1;
      return [
        ...currentShots,
        {
          id: newId,
          assets: [
            { type: 'scene', label: '新场景' },
            { type: 'character', label: '新角色' },
            { type: 'prop', label: '新道具' },
          ],
          references: [],
          prompt: '请补充分镜描述，明确主体、环境与镜头节奏。',
          dialogue: '暂无台词',
          sound: '待补充音效',
          imagePreview: { status: 'idle' },
          videoPreview: { status: 'idle' },
        },
      ];
    });
  };

  const handleGenerate = (shotId: number, mode: CardMode) => {
    const stateKey = mode === 'image' ? 'imagePreview' : 'videoPreview';

    setShots((currentShots) => currentShots.map((shot) => (
      shot.id === shotId
        ? {
            ...shot,
            [stateKey]: {
              ...shot[stateKey],
              status: 'generating',
            },
          }
        : shot
    )));

    setTimeout(() => {
      setShots((currentShots) => currentShots.map((shot) => {
        if (shot.id !== shotId) return shot;

        return {
          ...shot,
          [stateKey]: mode === 'image'
            ? {
                status: 'completed',
                thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=360&fit=crop&q=80',
              }
            : {
                status: 'completed',
                duration: '05s',
                thumbnail: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=600&h=360&fit=crop&q=80',
              },
        };
      }));
    }, 1800);
  };

  const handleUpdateShot = (shotId: number, field: 'prompt' | 'dialogue' | 'sound', value: string) => {
    setShots((currentShots) => currentShots.map((shot) => (
      shot.id === shotId
        ? { ...shot, [field]: value }
        : shot
    )));
  };

  const handleAddAssetToShot = (shotId: number, type: AssetType) => {
    setShots((currentShots) => currentShots.map((shot) => {
      if (shot.id !== shotId) return shot;

      const existingLabels = shot.assets.filter((asset) => asset.type === type).map((asset) => asset.label);
      const nextPreset = assetPresetPool[type].find((asset) => !existingLabels.includes(asset.label));
      const nextAsset = nextPreset ?? { label: `新${type === 'character' ? '角色' : type === 'scene' ? '场景' : '道具'}${existingLabels.length + 1}` };
      const nextMention = `@{${nextAsset.label}}`;

      return {
        ...shot,
        assets: [...shot.assets, { type, ...nextAsset }],
        prompt: shot.prompt.includes(nextMention) ? shot.prompt : `${shot.prompt}${shot.prompt ? ' ' : ''}${nextMention}`,
      };
    }));
  };

  const modeMeta = initialMode === 'direct-video'
    ? { label: '多参生视频', description: '当前按多参生视频模式初始化', textColor: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', icon: <Video className="w-3.5 h-3.5" /> }
    : { label: '图生视频', description: '当前按图生视频模式初始化', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', icon: <ImageIcon className="w-3.5 h-3.5" /> };

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-3 gap-3 pb-0" style={{ backgroundColor: ui.bg }}>
      <div className="flex-1 flex overflow-hidden gap-3">
        {/* 左侧：剧本回显 */}
        <aside 
          className={`rounded-2xl border shadow-sm flex flex-col overflow-hidden transition-all duration-300 shrink-0 ${
            isScriptPanelOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 invisible border-none'
          }`}
          style={{ backgroundColor: ui.window, borderColor: ui.border }}
        >
        <div className="px-4 py-3 border-b flex justify-between items-center" style={{ borderColor: ui.border, backgroundColor: '#f3f4f4' }}>
          <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: ui.primary }} /> 剧本上下文
          </span>
          <span className="text-[10px] text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded bg-white font-bold">只读参考</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 text-xs text-slate-600 leading-relaxed space-y-4 bg-slate-50/30">
          {scriptLines.map((line, idx) => (
            <div key={idx} className={idx === 2 ? 'border-emerald-400 border-l-2 pl-3 bg-emerald-50/50 -ml-4 p-2 rounded-r shadow-sm' : 'pl-3'}>
              {line.includes('老兵甲') ? (
                <span>
                  {line.split('老兵甲')[0]}
                  <span className="text-emerald-600 font-bold bg-emerald-100 px-1 rounded mx-0.5 shadow-sm">老兵甲</span>
                  {line.split('老兵甲')[1]}
                </span>
              ) : (
                line
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* 右侧：分镜编辑器区 */}
      <main className="flex-1 rounded-2xl border shadow-sm flex flex-col overflow-hidden relative min-w-0" style={{ backgroundColor: ui.window, borderColor: ui.border }}>
        {/* 工具栏 */}
        <div className="border-b px-6 py-3 shrink-0 flex items-center justify-between z-30" style={{ borderColor: ui.border, backgroundColor: '#f3f4f4' }}>
          <div className="flex items-center gap-4">
            <button 
              className="text-slate-400 p-1.5 rounded-lg transition-colors border border-transparent" 
              style={{ color: ui.subText }}
              onClick={() => setIsScriptPanelOpen(!isScriptPanelOpen)}
              title="显示/隐藏原文"
            >
              {isScriptPanelOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>
            
            <div className="h-4 w-px" style={{ backgroundColor: ui.border }}></div>

            <span className="text-sm font-bold text-slate-800">
              全集分镜管理 <span className="text-xs font-normal text-slate-500 ml-1">(共 {shots.length} 镜)</span>
            </span>
            
            {/* 风格与尺寸选择 */}
            <div className="flex items-center gap-3 border rounded-xl p-1 shadow-sm ml-2" style={{ backgroundColor: '#ffffff', borderColor: ui.border }}>
              {/* Style Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 pl-1.5">风格:</span>
                <div className="relative">
                  <button 
                    onClick={() => { setIsStyleDropdownOpen(!isStyleDropdownOpen); setIsOrientationDropdownOpen(false); }}
                    className="flex items-center justify-between w-28 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <img src={styles.find(s => s.id === selectedStyle)?.image} alt={selectedStyle} className="w-3.5 h-3.5 rounded-sm object-cover shrink-0" />
                      <span className="truncate">{selectedStyle}</span>
                    </div>
                    <ChevronDown size={12} className="text-slate-400 shrink-0 ml-1" />
                  </button>
                  {isStyleDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 max-h-64 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                      {styles.map(style => (
                        <button 
                          key={style.id}
                          onClick={() => { setSelectedStyle(style.id); setIsStyleDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-1.5 text-[11px] transition-colors flex items-center gap-2.5 ${selectedStyle === style.id ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <img src={style.image} alt={style.name} className="w-4 h-4 rounded object-cover shadow-sm" />
                          <span className="truncate">{style.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-px h-4" style={{ backgroundColor: ui.border }}></div>

              {/* Orientation Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400">尺寸:</span>
                <div className="relative">
                  <button 
                    onClick={() => { setIsOrientationDropdownOpen(!isOrientationDropdownOpen); setIsStyleDropdownOpen(false); }}
                    className="flex items-center justify-between w-28 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      {selectedOrientation === '16:9' ? (
                        <div className="w-3 h-1.5 border border-slate-500 rounded-[1px] shrink-0"></div>
                      ) : (
                        <div className="w-1.5 h-3 border border-slate-500 rounded-[1px] shrink-0"></div>
                      )}
                      <span className="truncate">{selectedOrientation === '16:9' ? '16:9 (横屏)' : '9:16 (竖屏)'}</span>
                    </div>
                    <ChevronDown size={12} className="text-slate-400 shrink-0 ml-1" />
                  </button>
                  {isOrientationDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button 
                        onClick={() => { setSelectedOrientation('16:9'); setIsOrientationDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-[11px] transition-colors flex items-center gap-2.5 ${selectedOrientation === '16:9' ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        <div className={`w-3 h-1.5 border rounded-[1px] ${selectedOrientation === '16:9' ? 'border-emerald-500' : 'border-slate-400'}`}></div>
                        <span>16:9 (横屏)</span>
                      </button>
                      <button 
                        onClick={() => { setSelectedOrientation('9:16'); setIsOrientationDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-[11px] transition-colors flex items-center gap-2.5 ${selectedOrientation === '9:16' ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        <div className={`w-1.5 h-3 border rounded-[1px] ${selectedOrientation === '9:16' ? 'border-emerald-500' : 'border-slate-400'}`}></div>
                        <span>9:16 (竖屏)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ml-2 shadow-sm ${modeMeta.textColor}`} style={{ backgroundColor: '#e9f8f0', borderColor: '#9ce9c7' }}>
              {modeMeta.icon}
              <div>
                <div className="text-[11px] font-bold leading-none">{modeMeta.label}</div>
                <div className="text-[10px] opacity-80 mt-0.5">镜头内仍可单独切换</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <button 
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="px-3 py-1.5 text-[11px] font-bold bg-white text-slate-600 border rounded-xl hover:bg-slate-50 flex items-center gap-1.5 shadow-sm transition-colors"
                style={{ borderColor: ui.border }}
              >
                <Cpu className="w-3.5 h-3.5" /> 模型偏好
              </button>
              
              {showModelMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                  <div className="text-xs font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <Settings2 className="w-3.5 h-3.5 text-emerald-500" /> 批量生成默认引擎
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">默认生图模型</label>
                      <select className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none hover:border-emerald-300 cursor-pointer focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner">
                        <option>Midjourney v6.0</option>
                        <option>Stable Diffusion XL</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">默认生视频模型</label>
                      <select className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none hover:border-emerald-300 cursor-pointer focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner">
                        <option>Vidu Q2Pro</option>
                        <option>Sora</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                    <button 
                      className="text-[11px] font-bold bg-slate-800 text-white px-4 py-1.5 rounded-xl hover:bg-slate-900 transition-colors shadow-md active:scale-95" 
                      onClick={() => setShowModelMenu(false)}
                    >
                      应用配置
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="px-4 py-1.5 text-[11px] font-bold text-white rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all" style={{ backgroundColor: ui.navBg }}>
              <Play className="w-3.5 h-3.5 fill-current" style={{ color: ui.primary }} /> 批量执行生成
            </button>
          </div>
        </div>
        
        {/* 列表区 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-20 custom-scrollbar" style={{ backgroundColor: '#f3f4f4' }}>
          {shots.map((shot, index) => (
            <ShotCard 
              key={shot.id} 
              shot={shot}
              shotNumber={index + 1} 
              onDelete={() => handleDeleteShot(shot.id)} 
              onGenerate={handleGenerate}
              onUpdateShot={handleUpdateShot}
              onAddAsset={handleAddAssetToShot}
              onPreviewAsset={setPreviewAsset}
              onNext={onNext}
              initialMode={initialMode}
            />
          ))}

          {/* 新增分镜按钮 */}
          <div className="pt-2 pb-6">
            <button 
              onClick={handleAddShot}
              className="w-full border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center py-6 text-slate-500 hover:text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer transition-all shadow-sm bg-white/50 active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wide">新增一条分镜</span>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>

    {previewAsset && (
      <div className="fixed inset-0 z-[120] bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-8">
        <div className="relative w-full max-w-5xl bg-white rounded-[28px] shadow-2xl overflow-hidden border border-slate-200">
          <button
            type="button"
            onClick={() => setPreviewAsset(null)}
            className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-black/75 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-[minmax(0,1fr)_320px] min-h-[620px]">
            <div className="bg-slate-950 flex items-center justify-center p-8">
              <div className="relative h-full max-h-[560px] w-full flex items-center justify-center">
                {previewAsset.thumbnail && (
                  <img
                    src={previewAsset.thumbnail}
                    alt={previewAsset.title}
                    className="max-h-[560px] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
                  />
                )}
                {previewAsset.type === 'video' && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-white/88 backdrop-blur flex items-center justify-center shadow-xl">
                        <Play className="w-10 h-10 text-blue-700 fill-current ml-1" />
                      </div>
                    </div>
                    {previewAsset.duration && (
                      <div className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-white">
                        {previewAsset.duration}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="bg-white border-l border-slate-200 p-6 flex flex-col">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                预览效果
              </div>
              <div className="mt-3 text-2xl font-bold text-slate-900">
                {previewAsset.type === 'image' ? '图片预览' : '视频预览'}
              </div>
              <div className="mt-2 text-sm text-slate-500 leading-6">
                {previewAsset.title}
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <div className="text-xs font-bold text-slate-500">当前状态</div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold bg-emerald-50 border-emerald-200 text-emerald-700">
                  {previewAsset.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  已生成可预览
                </div>
              </div>

              <div className="mt-auto flex gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewAsset(null)}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  关闭预览
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

function ShotCard({
  shot,
  shotNumber,
  onDelete,
  onGenerate,
  onUpdateShot,
  onAddAsset,
  onPreviewAsset,
  onNext,
  initialMode,
}: {
  shot: ShotRecord,
  shotNumber: number,
  onDelete: () => void,
  onGenerate: (shotId: number, mode: CardMode) => void,
  onUpdateShot: (shotId: number, field: 'prompt' | 'dialogue' | 'sound', value: string) => void,
  onAddAsset: (shotId: number, type: AssetType) => void,
  onPreviewAsset: (asset: { type: CardMode; title: string; thumbnail?: string; duration?: string }) => void,
  onNext: (panelMode: CardMode) => void,
  initialMode: StoryboardMode
}) {
  const [cardMode, setCardMode] = useState<'image' | 'video'>(initialMode === 'direct-video' ? 'video' : 'image');
  const currentPreview = cardMode === 'image' ? shot.imagePreview : shot.videoPreview;
  const sceneAsset = shot.assets.find((asset) => asset.type === 'scene');
  const characterAssets = shot.assets.filter((asset) => asset.type === 'character');
  const propAssets = shot.assets.filter((asset) => asset.type === 'prop');
  const isImageVideoWorkflow = initialMode === 'image-video';

  return (
    <div
      className="rounded-2xl shadow-sm border overflow-hidden flex transition-colors group/card"
      style={{ backgroundColor: ui.window, borderColor: ui.border }}
    >
      {/* 左侧序号栏 */}
      <div className="w-12 border-r flex flex-col items-center pt-5 shrink-0 gap-3 group relative" style={{ backgroundColor: '#f3f4f4', borderColor: ui.border }}>
        <span className="font-bold text-slate-700 bg-white border border-slate-200 w-7 h-7 flex items-center justify-center rounded-full shadow-sm text-xs">
          {shotNumber}
        </span>
        <div className="flex flex-col gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
          <button onClick={() => onNext(cardMode)} className="shadow-sm border rounded-lg p-1.5 transition-colors" style={{ color: ui.primary, backgroundColor: '#e9f8f0', borderColor: '#9ce9c7' }} title="进入精修模式">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
          <button className="text-slate-400 hover:text-slate-600 bg-white shadow-sm border border-slate-200 rounded-lg p-1.5 transition-colors" title="复制此镜">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="text-slate-400 hover:text-red-500 bg-white shadow-sm border border-slate-200 rounded-lg p-1.5 transition-colors" title="删除此镜">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 p-4 grid grid-cols-12 gap-5">
        {/* 列1：绑定资产 */}
        <div className="col-span-3 border-r pr-5 flex flex-col gap-4" style={{ borderColor: ui.border }}>
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold mb-2 block tracking-wider">绑定资产</label>
            <div className="flex flex-wrap gap-2">
              {sceneAsset && (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 pr-2 pl-1 py-1 rounded-lg shadow-sm">
                <div className="w-5 h-5 bg-white rounded flex items-center justify-center border border-slate-100 shrink-0">
                  <ImageIcon className="w-3 h-3 text-slate-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 truncate max-w-[72px]" title={sceneAsset.label}>{sceneAsset.label}</span>
              </div>
              )}
              {characterAssets.map((asset) => (
                <div key={asset.label} className="flex items-center gap-1.5 bg-white border border-slate-200 pr-2 pl-0.5 py-0.5 rounded-full shadow-sm">
                  {asset.image ? (
                    <img src={asset.image} className="w-5 h-5 rounded-full object-cover border border-slate-100" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-100" />
                  )}
                  <span className="text-[10px] font-bold text-slate-700">{asset.label}</span>
                </div>
              ))}
              {propAssets.map((asset) => (
                <div key={asset.label} className="flex items-center gap-1 bg-violet-50 border border-violet-100 px-2 py-1 rounded-full shadow-sm">
                  <span className="text-[10px] font-bold text-violet-700">{asset.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => onAddAsset(shot.id, 'character')} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700">
                <Plus className="w-3 h-3" /> 角色
              </button>
              <button type="button" onClick={() => onAddAsset(shot.id, 'scene')} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
                <Plus className="w-3 h-3" /> 场景
              </button>
              <button type="button" onClick={() => onAddAsset(shot.id, 'prop')} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700">
                <Plus className="w-3 h-3" /> 道具
              </button>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-50">
            <label className="text-[10px] text-slate-400 uppercase font-bold mb-2 block tracking-wider">附加参考图</label>
            <div className="flex gap-2 flex-wrap">
              {shot.references.map((reference, index) => (
                <div key={`${reference}-${index}`} className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <img src={reference} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer transition-colors bg-white shadow-sm">
                <Plus className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
        
        {/* 列2：提示词 */}
        <div className="col-span-5 border-r pr-5 flex flex-col" style={{ borderColor: ui.border }}>
          <label className="text-[10px] text-slate-400 uppercase font-bold mb-2 flex items-center justify-between tracking-wider">
            画面内容与AIGC提示词
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors shadow-sm border" style={{ color: ui.primary, backgroundColor: '#e9f8f0', borderColor: '#9ce9c7' }}>AI 优化</span>
          </label>
          <PromptAssetEditor
            value={shot.prompt}
            assets={shot.assets}
            onChange={(value) => onUpdateShot(shot.id, 'prompt', value)}
          />
          <div className="mt-auto grid grid-cols-2 gap-3 text-xs bg-white rounded-xl">
            <div>
              <span className="text-[9px] text-slate-400 font-bold block mb-1">台词</span>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 outline-none focus:border-emerald-500 focus:bg-white text-slate-700 placeholder-slate-400 font-medium shadow-inner transition-colors" value={shot.dialogue} onChange={(e) => onUpdateShot(shot.id, 'dialogue', e.target.value)} />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold block mb-1">音效</span>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 outline-none focus:border-emerald-500 focus:bg-white text-slate-700 font-medium shadow-inner transition-colors" value={shot.sound} onChange={(e) => onUpdateShot(shot.id, 'sound', e.target.value)} />
            </div>
          </div>
        </div>

        {/* 列3：生成预览 */}
        <div className="col-span-4 flex flex-col relative">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">预览与生成</label>
            <div className="flex p-0.5 rounded-lg border shadow-inner" style={{ backgroundColor: '#eceeee', borderColor: ui.border }}>
              <button 
                onClick={() => setCardMode('image')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${
                  cardMode === 'image' ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
                style={cardMode === 'image' ? { color: ui.primary } : undefined}
              >
                <ImageIcon className="w-3 h-3" /> 图生
              </button>
              <button 
                onClick={() => setCardMode('video')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${
                  cardMode === 'video' ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
                style={cardMode === 'video' ? { color: ui.primary } : undefined}
              >
                <Video className="w-3 h-3" /> 直出
              </button>
            </div>
          </div>

          {isImageVideoWorkflow ? (
            cardMode === 'image' ? (
            <div className="grid grid-cols-2 gap-2 min-h-[112px] animate-in fade-in duration-300">
              <div className="transition-all">
              {shot.imagePreview.status === 'completed' ? (
                <button
                  type="button"
                  onClick={() => onGenerate(shot.id, 'image')}
                  className="group/asset w-full h-full border rounded-xl overflow-hidden bg-white text-left transition-all shadow-sm border-emerald-300 ring-2 ring-emerald-200/60"
                >
                  <div className="relative h-full min-h-[112px]">
                    <img src={shot.imagePreview.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/asset:opacity-100 transition-opacity" />
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-white/90 text-[10px] font-bold text-emerald-700">已生成关键帧</div>
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover/asset:opacity-100 transition-opacity z-10">
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onPreviewAsset({
                            type: 'image',
                            title: `第 ${shotNumber} 镜关键帧`,
                            thumbnail: shot.imagePreview.thumbnail,
                          });
                        }}
                        className="px-3 py-2 rounded-xl bg-black/70 text-white text-[11px] font-bold shadow-sm hover:bg-black/80"
                      >
                        预览效果
                      </span>
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onNext('image');
                        }}
                        className="px-3 py-2 rounded-xl bg-white text-slate-800 text-[11px] font-bold shadow-sm hover:bg-slate-50"
                      >
                        图片精修
                      </span>
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onGenerate(shot.id, 'image');
                        }}
                        className="px-3 py-2 rounded-xl bg-emerald-500 text-white text-[11px] font-bold shadow-sm hover:bg-emerald-600"
                      >
                        重新生成
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-[11px] font-bold">点击重新生成</div>
                    </div>
                  </div>
                </button>
              ) : shot.imagePreview.status === 'generating' ? (
                <button
                  type="button"
                  onClick={() => onGenerate(shot.id, 'image')}
                  className="w-full h-full border rounded-xl text-amber-700 flex flex-col items-center justify-center min-h-[112px] transition-all shadow-sm border-amber-300 bg-amber-50/80 ring-2 ring-amber-200/60"
                >
                  <div className="w-8 h-8 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin mb-2" />
                  <div className="text-[11px] font-bold">关键帧生成中</div>
                  <div className="text-[10px] text-amber-600 mt-1">点击可重新触发任务</div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onGenerate(shot.id, 'image')}
                  className="w-full h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer text-slate-400 transition-all group shadow-sm min-h-[112px] border-emerald-300 bg-emerald-50/70 ring-2 ring-emerald-200/60"
                >
                  <ImageIcon className="w-5 h-5 mb-1 group-hover:text-emerald-500 transition-colors" />
                  <span className="text-[10px] font-bold text-slate-600 group-hover:text-emerald-600">点击生成关键帧</span>
                </button>
              )}
              </div>

              <div className="transition-all">
              {shot.videoPreview.status === 'completed' ? (
                <button
                  type="button"
                  onClick={() => onGenerate(shot.id, 'video')}
                  className="group/asset w-full h-full border rounded-xl overflow-hidden bg-white text-left transition-all shadow-sm relative border-slate-200 hover:border-blue-200"
                >
                  <div className="absolute top-2 right-2 z-10 px-2 py-1 rounded-full bg-black/60 text-[10px] font-bold text-white">{shot.videoPreview.duration ?? '05s'}</div>
                  <div className="relative h-full min-h-[112px]">
                    <img src={shot.videoPreview.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/asset:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/85 flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 text-blue-700 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover/asset:opacity-100 transition-opacity z-10">
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onPreviewAsset({
                            type: 'video',
                            title: `第 ${shotNumber} 镜直出视频`,
                            thumbnail: shot.videoPreview.thumbnail,
                            duration: shot.videoPreview.duration,
                          });
                        }}
                        className="px-3 py-2 rounded-xl bg-black/70 text-white text-[11px] font-bold shadow-sm hover:bg-black/80"
                      >
                        预览效果
                      </span>
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onNext('video');
                        }}
                        className="px-3 py-2 rounded-xl bg-white text-slate-800 text-[11px] font-bold shadow-sm hover:bg-slate-50"
                      >
                        视频精修
                      </span>
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onGenerate(shot.id, 'video');
                        }}
                        className="px-3 py-2 rounded-xl bg-blue-500 text-white text-[11px] font-bold shadow-sm hover:bg-blue-600"
                      >
                        重新生成
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-[11px] font-bold">已完成直出视频</div>
                    </div>
                  </div>
                </button>
              ) : shot.videoPreview.status === 'generating' ? (
                <button
                  type="button"
                  onClick={() => onGenerate(shot.id, 'video')}
                  className="w-full h-full border rounded-xl text-blue-700 flex flex-col items-center justify-center min-h-[112px] transition-all shadow-sm relative overflow-hidden border-blue-200 bg-blue-50/70"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_60%)]" />
                  <div className="w-8 h-8 rounded-full border-2 border-blue-200 border-t-blue-500 animate-spin mb-2 z-10" />
                  <div className="text-[11px] font-bold z-10">视频生成中</div>
                  <div className="text-[10px] text-blue-600 mt-1 z-10">点击重新发起任务</div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onGenerate(shot.id, 'video')}
                  className="w-full h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer text-blue-500 transition-all group relative overflow-hidden shadow-sm min-h-[112px] border-blue-300 bg-blue-50/50 hover:bg-blue-100 hover:border-blue-400"
                >
                  <div className="absolute top-1 right-1 flex items-center gap-1 z-10" onClick={(e) => e.stopPropagation()}>
                    <select className="bg-white border border-blue-200 text-[10px] font-bold text-blue-700 rounded-lg px-1.5 py-0.5 outline-none cursor-pointer shadow-sm">
                      <option>5s</option>
                      <option>10s</option>
                      <option>15s</option>
                    </select>
                  </div>
                  <Video className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-blue-700">点击直出视频</span>
                  <span className="text-[9px] mt-1 text-blue-400 font-bold">消耗 10 算力</span>
                </button>
              )}
              </div>
            </div>
            ) : (
            <div className="w-full h-full flex min-h-[112px] animate-in fade-in duration-300">
              {shot.videoPreview.status === 'completed' ? (
                <button
                  type="button"
                  onClick={() => onGenerate(shot.id, 'video')}
                  className="group/asset w-full flex-1 border border-blue-300 ring-2 ring-blue-200/60 rounded-xl overflow-hidden bg-white text-left transition-all shadow-sm relative"
                >
                  <div className="absolute top-2 right-2 z-10 px-2 py-1 rounded-full bg-black/60 text-[10px] font-bold text-white">{shot.videoPreview.duration ?? '05s'}</div>
                  <div className="relative h-full min-h-[112px]">
                    <img src={shot.videoPreview.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/asset:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/85 flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 text-blue-700 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover/asset:opacity-100 transition-opacity z-10">
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onPreviewAsset({
                            type: 'video',
                            title: `第 ${shotNumber} 镜直出视频`,
                            thumbnail: shot.videoPreview.thumbnail,
                            duration: shot.videoPreview.duration,
                          });
                        }}
                        className="px-3 py-2 rounded-xl bg-black/70 text-white text-[11px] font-bold shadow-sm hover:bg-black/80"
                      >
                        预览效果
                      </span>
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onNext('video');
                        }}
                        className="px-3 py-2 rounded-xl bg-white text-slate-800 text-[11px] font-bold shadow-sm hover:bg-slate-50"
                      >
                        视频精修
                      </span>
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onGenerate(shot.id, 'video');
                        }}
                        className="px-3 py-2 rounded-xl bg-blue-500 text-white text-[11px] font-bold shadow-sm hover:bg-blue-600"
                      >
                        重新生成
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-[11px] font-bold">已完成直出视频</div>
                    </div>
                  </div>
                </button>
              ) : shot.videoPreview.status === 'generating' ? (
                <button
                  type="button"
                  onClick={() => onGenerate(shot.id, 'video')}
                  className="w-full flex-1 border border-blue-300 ring-2 ring-blue-200/60 rounded-xl bg-blue-50/80 text-blue-700 flex flex-col items-center justify-center min-h-[112px] transition-all shadow-sm relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_60%)]" />
                  <div className="w-8 h-8 rounded-full border-2 border-blue-200 border-t-blue-500 animate-spin mb-2 z-10" />
                  <div className="text-[11px] font-bold z-10">视频生成中</div>
                  <div className="text-[10px] text-blue-600 mt-1 z-10">点击重新发起任务</div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onGenerate(shot.id, 'video')}
                  className="w-full flex-1 border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center bg-blue-50/70 ring-2 ring-blue-200/60 cursor-pointer text-blue-500 transition-all group relative overflow-hidden shadow-sm min-h-[112px]"
                >
                  <div className="absolute top-1 right-1 flex items-center gap-1 z-10" onClick={(e) => e.stopPropagation()}>
                    <select className="bg-white border border-blue-200 text-[10px] font-bold text-blue-700 rounded-lg px-1.5 py-0.5 outline-none cursor-pointer shadow-sm">
                      <option>5s</option>
                      <option>10s</option>
                      <option>15s</option>
                    </select>
                  </div>
                  <Video className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-blue-700">点击直出视频</span>
                  <span className="text-[9px] mt-1 text-blue-400 font-bold">消耗 10 算力</span>
                </button>
              )}
            </div>
            )
          ) : cardMode === 'image' ? (
            <div className="w-full h-full flex gap-2 min-h-[90px] animate-in fade-in duration-300">
              {currentPreview.status === 'completed' ? (
                <button
                  type="button"
                  onClick={() => onGenerate(shot.id, 'image')}
                  className="group/asset w-full flex-1 border border-emerald-200 rounded-xl overflow-hidden bg-white text-left hover:border-emerald-300 transition-colors shadow-sm"
                >
                  <div className="relative h-full min-h-[112px]">
                    <img src={currentPreview.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/asset:opacity-100 transition-opacity" />
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-white/90 text-[10px] font-bold text-emerald-700">已生成关键帧</div>
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover/asset:opacity-100 transition-opacity z-10">
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onPreviewAsset({
                            type: 'image',
                            title: `第 ${shotNumber} 镜关键帧`,
                            thumbnail: currentPreview.thumbnail,
                          });
                        }}
                        className="px-3 py-2 rounded-xl bg-black/70 text-white text-[11px] font-bold shadow-sm hover:bg-black/80"
                      >
                        预览效果
                      </span>
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onNext('image');
                        }}
                        className="px-3 py-2 rounded-xl bg-white text-slate-800 text-[11px] font-bold shadow-sm hover:bg-slate-50"
                      >
                        图片精修
                      </span>
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onGenerate(shot.id, 'image');
                        }}
                        className="px-3 py-2 rounded-xl bg-emerald-500 text-white text-[11px] font-bold shadow-sm hover:bg-emerald-600"
                      >
                        重新生成
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-[11px] font-bold">点击重新生成</div>
                      <div className="text-[10px] text-white/80 mt-0.5">保留当前案例作为已完成状态</div>
                    </div>
                  </div>
                </button>
              ) : currentPreview.status === 'generating' ? (
                <button
                  type="button"
                  onClick={() => onGenerate(shot.id, 'image')}
                  className="w-full flex-1 border border-amber-200 rounded-xl bg-amber-50/70 text-amber-700 flex flex-col items-center justify-center min-h-[112px] transition-colors shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin mb-2" />
                  <div className="text-[11px] font-bold">关键帧生成中</div>
                  <div className="text-[10px] text-amber-600 mt-1">点击可重新触发任务</div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onGenerate(shot.id, 'image')}
                  className="w-full flex-1 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 text-slate-400 transition-colors group shadow-sm min-h-[112px]"
                >
                  <ImageIcon className="w-5 h-5 mb-1 group-hover:text-emerald-500 transition-colors" />
                  <span className="text-[10px] font-bold text-slate-600 group-hover:text-emerald-600">点击生成关键帧</span>
                </button>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex min-h-[90px] animate-in fade-in duration-300">
              {currentPreview.status === 'completed' ? (
                <button
                  type="button"
                  onClick={() => onGenerate(shot.id, 'video')}
                  className="group/asset w-full flex-1 border border-blue-200 rounded-xl overflow-hidden bg-white text-left hover:border-blue-300 transition-colors shadow-sm relative"
                >
                  <div className="absolute top-2 right-2 z-10 px-2 py-1 rounded-full bg-black/60 text-[10px] font-bold text-white">{currentPreview.duration ?? '05s'}</div>
                  <div className="relative h-full min-h-[112px]">
                    <img src={currentPreview.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/asset:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/85 flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 text-blue-700 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover/asset:opacity-100 transition-opacity z-10">
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onPreviewAsset({
                            type: 'video',
                            title: `第 ${shotNumber} 镜直出视频`,
                            thumbnail: currentPreview.thumbnail,
                            duration: currentPreview.duration,
                          });
                        }}
                        className="px-3 py-2 rounded-xl bg-black/70 text-white text-[11px] font-bold shadow-sm hover:bg-black/80"
                      >
                        预览效果
                      </span>
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onNext('video');
                        }}
                        className="px-3 py-2 rounded-xl bg-white text-slate-800 text-[11px] font-bold shadow-sm hover:bg-slate-50"
                      >
                        视频精修
                      </span>
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onGenerate(shot.id, 'video');
                        }}
                        className="px-3 py-2 rounded-xl bg-blue-500 text-white text-[11px] font-bold shadow-sm hover:bg-blue-600"
                      >
                        重新生成
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-[11px] font-bold">已完成直出视频</div>
                      <div className="text-[10px] text-white/80 mt-0.5">点击可重新提交生成任务</div>
                    </div>
                  </div>
                </button>
              ) : currentPreview.status === 'generating' ? (
                <button
                  type="button"
                  onClick={() => onGenerate(shot.id, 'video')}
                  className="w-full flex-1 border border-blue-200 rounded-xl bg-blue-50/70 text-blue-700 flex flex-col items-center justify-center min-h-[112px] transition-colors shadow-sm relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_60%)]" />
                  <div className="w-8 h-8 rounded-full border-2 border-blue-200 border-t-blue-500 animate-spin mb-2 z-10" />
                  <div className="text-[11px] font-bold z-10">视频生成中</div>
                  <div className="text-[10px] text-blue-600 mt-1 z-10">点击重新发起任务</div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onGenerate(shot.id, 'video')}
                  className="w-full flex-1 border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center bg-blue-50/50 cursor-pointer hover:bg-blue-100 hover:border-blue-400 text-blue-500 transition-colors group relative overflow-hidden shadow-sm min-h-[112px]"
                >
                  <div className="absolute top-1 right-1 flex items-center gap-1 z-10" onClick={(e) => e.stopPropagation()}>
                    <select className="bg-white border border-blue-200 text-[10px] font-bold text-blue-700 rounded-lg px-1.5 py-0.5 outline-none cursor-pointer shadow-sm">
                      <option>5s</option>
                      <option>10s</option>
                      <option>15s</option>
                    </select>
                  </div>
                  <Video className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-blue-700">点击直出视频</span>
                  <span className="text-[9px] mt-1 text-blue-400 font-bold">消耗 10 算力</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PromptAssetEditor({
  value,
  assets,
  onChange,
}: {
  value: string;
  assets: Array<{ type: AssetType; label: string; image?: string }>;
  onChange: (value: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [mentionRange, setMentionRange] = useState<{ start: number; end: number; query: string } | null>(null);

  const assetMap = useMemo(
    () => Object.fromEntries(assets.map((asset) => [asset.label, asset])),
    [assets]
  );

  const mentionOptions = useMemo(() => {
    if (!mentionRange) return [];
    const keyword = mentionRange.query.toLowerCase();
    return assets.filter((asset) => asset.label.toLowerCase().includes(keyword));
  }, [assets, mentionRange]);

  const updateMentionState = (nextValue: string, caretPosition: number) => {
    const beforeCursor = nextValue.slice(0, caretPosition);
    const lastAt = beforeCursor.lastIndexOf('@');
    if (lastAt === -1) {
      setMentionRange(null);
      return;
    }

    const between = beforeCursor.slice(lastAt + 1);
    if (between.includes(' ') || between.includes('\n') || beforeCursor.slice(lastAt).startsWith('@{')) {
      setMentionRange(null);
      return;
    }

    setMentionRange({
      start: lastAt,
      end: caretPosition,
      query: between,
    });
  };

  const applyMention = (label: string) => {
    if (!mentionRange || !textareaRef.current) return;
    const nextValue = `${value.slice(0, mentionRange.start)}@{${label}} ${value.slice(mentionRange.end)}`;
    onChange(nextValue);
    setMentionRange(null);

    requestAnimationFrame(() => {
      const nextCaret = mentionRange.start + label.length + 4;
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(nextCaret, nextCaret);
    });
  };

  const promptParts = value.split(/(@\{[^}]+\})/g).filter(Boolean);

  const toneClassName = (type?: AssetType) => {
    if (type === 'character') return 'bg-sky-50 border-sky-100 text-sky-700';
    if (type === 'scene') return 'bg-emerald-50 border-emerald-100 text-emerald-700';
    if (type === 'prop') return 'bg-violet-50 border-violet-100 text-violet-700';
    return 'bg-slate-100 border-slate-200 text-slate-700';
  };

  return (
    <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 shadow-inner overflow-hidden relative">
      <div className="px-3 pt-3 pb-1 min-h-[72px] text-sm leading-7 text-slate-700">
        <div className="flex flex-wrap gap-x-1.5 gap-y-2">
          {promptParts.length === 0 && (
            <span className="text-slate-400 text-xs">输入提示词，使用 @ 快捷引用已绑定资产。</span>
          )}
          {promptParts.map((part, index) => {
            const match = part.match(/^@\{(.+)\}$/);
            if (match) {
              const asset = assetMap[match[1]];
              return (
                <span
                  key={`${part}-${index}`}
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${toneClassName(asset?.type)}`}
                >
                  {asset?.image && (
                    <img src={asset.image} alt="" className="w-4 h-4 rounded-full object-cover border border-white/60" />
                  )}
                  {match[1]}
                </span>
              );
            }

            return (
              <span key={`${part}-${index}`} className="whitespace-pre-wrap">
                {part}
              </span>
            );
          })}
        </div>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          updateMentionState(e.target.value, e.target.selectionStart);
        }}
        onClick={(e) => updateMentionState(e.currentTarget.value, e.currentTarget.selectionStart)}
        onKeyUp={(e) => updateMentionState(e.currentTarget.value, e.currentTarget.selectionStart)}
        className="w-full text-xs font-medium text-slate-700 bg-transparent px-3 pb-3 pt-1 h-24 resize-none outline-none leading-relaxed"
        placeholder="请输入提示词，输入 @ 可引用已绑定资产"
      />

      {mentionRange && mentionOptions.length > 0 && (
        <div className="absolute left-3 bottom-3 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl p-2 z-10">
          <div className="text-[10px] font-bold text-slate-400 px-2 pb-1">已绑定资产</div>
          <div className="space-y-1">
            {mentionOptions.map((asset) => (
              <button
                key={asset.label}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyMention(asset.label)}
                className="w-full flex items-center gap-2 rounded-xl px-2 py-2 text-left hover:bg-slate-50 transition-colors"
              >
                <div className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 text-[10px] font-bold ${toneClassName(asset.type)}`}>
                  {asset.image && (
                    <img src={asset.image} alt="" className="w-4 h-4 rounded-full object-cover border border-white/60" />
                  )}
                  {asset.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
