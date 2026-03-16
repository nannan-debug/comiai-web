import React, { useState } from 'react';
import { 
  Film, Image as ImageIcon, LayoutTemplate, User, Coins, 
  Upload, ArrowRightLeft, Download, CheckCircle2, 
  Maximize2, ChevronDown, Filter, Zap, LayoutGrid,
  Scissors, Share, ArrowUpFromLine, PlayCircle, Eye
} from 'lucide-react';

export default function StoryboardProduction({
  initialGlobalMode = 'video',
  initialTaskMode = 'first-last',
  onOpenPreview,
}: {
  initialGlobalMode?: 'video' | 'image';
  initialTaskMode?: 'all' | 'first-last' | 'img2video';
  onOpenPreview?: () => void;
}) {
  // 1. 全局任务切换
  const [globalMode, setGlobalMode] = useState<'video' | 'image'>(initialGlobalMode);
  
  // 2. 左侧任务面板 - 模式切换
  const [taskMode, setTaskMode] = useState<'all' | 'first-last' | 'img2video'>(initialTaskMode);
  
  // 模型与参数联动
  const [selectedModel, setSelectedModel] = useState('Seedance2.0');
  
  // 底部选中分镜
  const [activeStoryboard, setActiveStoryboard] = useState(1);

  return (
    <>
      <div className="flex-1 flex overflow-hidden p-3 gap-3 pb-0">
        {/* 1. 最左侧全局任务切换栏 */}
        <div className="w-14 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center py-4 gap-4 shrink-0 z-10">
          <div 
            className={`p-2.5 rounded-xl cursor-pointer group relative ${globalMode === 'video' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
            onClick={() => setGlobalMode('video')}
          >
            <Film size={20} />
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
              生视频
            </div>
          </div>
          <div 
            className={`p-2.5 rounded-xl cursor-pointer group relative ${globalMode === 'image' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
            onClick={() => setGlobalMode('image')}
          >
            <ImageIcon size={20} />
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
              生图片
            </div>
          </div>
          <div className="p-2.5 rounded-xl cursor-pointer text-gray-400 hover:bg-gray-50 hover:text-gray-600 group relative">
            <LayoutTemplate size={20} />
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
              排版
            </div>
          </div>
        </div>

        {/* 2. 左侧任务面板 */}
        <div className="w-72 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col shrink-0 z-10 overflow-y-auto">
          {globalMode === 'image' ? (
            <div className="p-4 flex flex-col h-full">
              {/* Title */}
              <div className="flex items-center gap-2 font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">
                <ImageIcon size={16} />
                分镜
              </div>

              {/* 参考内容 */}
              <div className="mb-6">
                <div className="text-xs font-medium text-gray-700 mb-2">参考内容 <span className="text-gray-400 font-normal">(上限6个)</span></div>
                <div className="grid grid-cols-3 gap-2">
                  {/* Existing references */}
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
                    <img src="https://picsum.photos/seed/ref1/100/100" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur text-gray-800 text-[10px] text-center py-0.5 truncate px-1">(图1) 战无涯</div>
                  </div>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
                    <img src="https://picsum.photos/seed/ref2/100/100" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur text-gray-800 text-[10px] text-center py-0.5 truncate px-1">(图2) 叶小厨</div>
                  </div>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
                    <img src="https://picsum.photos/seed/ref3/100/100" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur text-gray-800 text-[10px] text-center py-0.5 truncate px-1">(图3) 场景1</div>
                  </div>
                  
                  {/* Upload button */}
                  <div className="aspect-square bg-gray-50 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-emerald-400 cursor-pointer transition-colors">
                    <ImageIcon size={16} className="mb-1" />
                    <span className="text-[10px]">上传或选择</span>
                    <span className="text-[10px] text-gray-400">分镜图 /</span>
                    <span className="text-[10px] text-gray-400">设定库</span>
                  </div>
                </div>
              </div>

              {/* 画面提示词 */}
              <div className="mb-6">
                <div className="text-xs font-medium text-gray-700 mb-2">画面提示词</div>
                <textarea 
                  className="w-full h-32 p-3 bg-white border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="请输入提示词"
                  defaultValue="镜头从林战的视角开始，缓慢平移，展现他身处的环境。林战坐在泥泞的壕沟中，湿透的衣物紧贴身体，惊恐地扫视四周。手中紧握长矛，特写其破旧的质感。"
                ></textarea>
              </div>

              {/* 补充提示词 */}
              <div className="mb-6">
                <div className="text-xs font-medium text-gray-700 mb-2">补充提示词</div>
                <textarea 
                  className="w-full h-24 p-3 bg-white border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="请输入提示词"
                  defaultValue="艺术风格：3D高模渲染，Atmospheric Period Drama，影视级CGI风格，PBR材质，半写实风格化，图形设计融合感&#10;色调与光影：(Deep Jade Green + Charcoal Black)..."
                ></textarea>
              </div>

              {/* 模型选择及生成数量 */}
              <div className="mb-auto">
                <div className="text-xs font-medium text-gray-700 mb-2">模型选择及生成数量</div>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <select 
                      className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Nano Banana Pro">Nano Banana Pro</option>
                      <option value="Seedance2.0">Seedance2.0</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="w-24 relative">
                    <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500">
                      <option>生成1张</option>
                      <option>生成2张</option>
                      <option>生成4张</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 底部生成按钮 */}
              <button className="w-full mt-6 bg-[#1A202C] hover:bg-gray-800 text-white rounded-xl py-3 flex items-center justify-center gap-2 font-medium transition-colors">
                <div className="flex items-center gap-1 text-emerald-400">
                  <Coins size={14} />
                  <span>10</span>
                </div>
                生成图片
              </button>
            </div>
          ) : (
            <div className="p-4 flex flex-col h-full">
              {/* 模式切换 Tab */}
              <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
              {[
                { id: 'all', label: '全能参考', icon: <LayoutGrid size={14} /> },
                { id: 'first-last', label: '首尾帧', icon: <Film size={14} /> },
                { id: 'img2video', label: '图生视频', icon: <ImageIcon size={14} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setTaskMode(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    taskMode === tab.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 参考图区域 (首尾帧模式) */}
            <div className="mb-6">
              <div className="text-xs font-medium text-gray-700 mb-2">参考图</div>
              {taskMode === 'first-last' ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 aspect-square bg-gray-50 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-emerald-400 cursor-pointer transition-colors">
                    <Upload size={20} className="mb-2" />
                    <span className="text-xs">上传首帧图</span>
                    <span className="text-[10px] text-gray-400 mt-1">分镜图 / 设定库</span>
                  </div>
                  <button className="p-1.5 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors">
                    <ArrowRightLeft size={14} />
                  </button>
                  <div className="flex-1 aspect-square bg-gray-50 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-emerald-400 cursor-pointer transition-colors">
                    <Upload size={20} className="mb-2" />
                    <span className="text-xs">上传尾帧图</span>
                    <span className="text-[10px] text-gray-400 mt-1">分镜图 / 设定库</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-32 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-emerald-400 cursor-pointer transition-colors">
                  <Upload size={20} className="mb-2" />
                  <span className="text-xs">上传参考{taskMode === 'all' ? '视频/图片' : '图片'}</span>
                  <span className="text-[10px] text-gray-400 mt-1">支持拖拽 / 分镜图库 / 设定库</span>
                </div>
              )}
            </div>

            {/* 提示词输入 */}
            <div className="mb-6">
              <div className="text-xs font-medium text-gray-700 mb-2">视频提示词</div>
              <textarea 
                className="w-full h-28 p-3 bg-white border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="请输入提示词"
              ></textarea>
            </div>

            <div className="mb-6">
              <div className="text-xs font-medium text-gray-700 mb-2">补充提示词</div>
              <textarea 
                className="w-full h-20 p-3 bg-white border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="请输入提示词"
              ></textarea>
            </div>

            {/* 模型与参数选择 */}
            <div className="mb-auto">
              <div className="text-xs font-medium text-gray-700 mb-2">模型选择及生成数量</div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <select 
                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                  >
                    <option value="Seedance2.0">Seedance2.0</option>
                    <option value="Sora2">Sora 2</option>
                    <option value="ViduQ2Pro">ViduQ2Pro</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <div className="w-20 relative">
                  <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option>15s</option>
                    <option>5s</option>
                    <option>10s</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <div className="w-24 relative">
                  <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option>1080p</option>
                    <option>720p</option>
                    <option>4K</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

              {/* 底部生成按钮 */}
              <button className="w-full mt-6 bg-[#1A202C] hover:bg-gray-800 text-white rounded-xl py-3 flex items-center justify-center gap-2 font-medium transition-colors">
                <Zap size={16} className="text-emerald-400" />
                <span className="text-emerald-400">10</span>
                生成视频
              </button>
            </div>
          )}
        </div>

        {/* 中间区域：画布 + 底部卡片 */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* 3. 中心画布大图 */}
          <div className="flex-1 flex flex-col relative min-w-0 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
            <button className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 px-4 py-2 rounded-full text-xs font-medium text-gray-700 flex items-center gap-2 hover:bg-white transition-colors">
              <Scissors size={14} />
              截取关键帧
            </button>
          </div>
          
          <div className="flex-1 p-6 flex items-center justify-center relative">
            {/* 主画面 */}
            <div className="relative h-full max-h-[70vh] aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-lg group">
              <img 
                src="https://picsum.photos/seed/cyberpunk-tower/1080/1920" 
                alt="Main Canvas" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* 悬浮操作栏 */}
              <div className="absolute right-[-48px] top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                  <Share size={16} />
                </button>
                <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                  <Download size={16} />
                </button>
              </div>

              {/* 底部提交审核 */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <button className="bg-black/60 backdrop-blur-md text-white px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-black/80 transition-colors border border-white/10">
                  <ArrowUpFromLine size={16} />
                  提交审核
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* 4. 右侧历史记录 */}
        <div className="w-72 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex flex-col shrink-0 z-10">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 font-medium text-gray-800">
              {globalMode === 'video' ? <Film size={16} /> : <ImageIcon size={16} />}
              {globalMode === 'video' ? '视频记录' : '生图记录'}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {globalMode === 'image' ? (
              <>
                {/* 生图记录卡片 1 */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>2026-01-18 20:45</span>
                    <div className="flex items-center gap-1">
                      <Zap size={12} />
                      <span>jimeng</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm relative group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                        <ImageIcon size={14} />
                        历史-2
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"><CheckCircle2 size={14} /></button>
                        <button className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"><Download size={14} /></button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"><ChevronDown size={14} /></button>
                      </div>
                    </div>
                    <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1">
                      {[1,2,3,4,5].map(i => (
                        <img key={i} src={`https://picsum.photos/seed/ref${i}/60/60`} className="w-8 h-8 rounded object-cover border border-gray-200 shrink-0" referrerPolicy="no-referrer" />
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-500 line-clamp-2">
                      画风：超写实风格。景别：全景。视角：平视视角。机位：正面机位。内容：广阔而宁静的湖面...
                    </p>
                    
                    {/* 生成的图片 */}
                    <div className="mt-3 relative h-40 w-full bg-gray-100/80 rounded-lg overflow-hidden flex items-center justify-center">
                      <img src="https://picsum.photos/seed/cyberpunk-tower/400/711" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                </div>

                {/* 生图记录卡片 2 (当前选中/应用状态) */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>2026-01-18 21:08</span>
                    <div className="flex items-center gap-1">
                      <Zap size={12} />
                      <span>Nano Banana Pro 2</span>
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3 border-2 border-emerald-400 shadow-sm relative group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                        <ImageIcon size={14} />
                        历史-3
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-emerald-600 hover:bg-emerald-100 rounded" title="应用"><CheckCircle2 size={14} /></button>
                        <button className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"><Download size={14} /></button>
                        <button className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"><ChevronDown size={14} /></button>
                      </div>
                    </div>
                    <p className="text-[10px] text-emerald-600/80 line-clamp-3">
                      画风：超写实风格。景别：全景。视角：平视视角。机位：正面机位。内容：广阔而宁静的湖面，湖水呈现出蓝、绿、黄、青等多层次的色彩，清澈见底，能清晰看到水底的枯树和钙华沉积。湖面平静，反射着...
                    </p>
                    
                    {/* 生成的图片 */}
                    <div className="mt-3 relative h-40 w-full bg-gray-100/80 rounded-lg overflow-hidden flex items-center justify-center">
                      <img src="https://picsum.photos/seed/cyberpunk-tower-2/400/711" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 记录卡片 1 */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>2026-01-18 20:45</span>
                <div className="flex items-center gap-1">
                  <Zap size={12} />
                  <span>ViduQ2Pro | 1080p | 6s</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm relative group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                    <ImageIcon size={14} />
                    图生视频-2
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"><CheckCircle2 size={14} /></button>
                    <button className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"><Download size={14} /></button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"><ChevronDown size={14} /></button>
                  </div>
                </div>
                <div className="flex gap-2 mb-2">
                  <img src="https://picsum.photos/seed/ref1/60/60" className="w-10 h-10 rounded object-cover border border-gray-100" referrerPolicy="no-referrer" />
                </div>
                <p className="text-[10px] text-gray-500 line-clamp-2">
                  画风：超写实风格。景别：全景。视角：平视视角。机位：正面机位。内容：广阔而宁静的湖面...
                </p>
                
                {/* 视频缩略图 */}
                <div className="mt-3 relative h-40 w-full bg-gray-100/80 rounded-lg overflow-hidden flex items-center justify-center">
                  <img src="https://picsum.photos/seed/vid1/400/225" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <PlayCircle size={24} className="text-white/90" />
                  </div>
                </div>
              </div>
            </div>

            {/* 记录卡片 2 (当前选中/应用状态) */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>2026-01-18 21:08</span>
                <div className="flex items-center gap-1">
                  <Zap size={12} />
                  <span>Sora 2 | 1080p | 6s</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 border-2 border-emerald-400 shadow-sm relative group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <LayoutGrid size={14} />
                    多图参考-3
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-emerald-600 hover:bg-emerald-100 rounded" title="应用"><CheckCircle2 size={14} /></button>
                    <button className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"><Download size={14} /></button>
                    <button className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"><ChevronDown size={14} /></button>
                  </div>
                </div>
                <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1">
                  {[1,2,3,4,5].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/ref${i}/60/60`} className="w-8 h-8 rounded object-cover border border-emerald-200 shrink-0" referrerPolicy="no-referrer" />
                  ))}
                </div>
                <p className="text-[10px] text-emerald-600/80 line-clamp-2">
                  画风：超写实风格。景别：全景。视角：平视视角。机位：正面机位。内容：广阔而宁静的湖面...
                </p>
                
                {/* 视频缩略图 */}
                <div className="mt-3 relative h-40 w-full bg-gray-100/80 rounded-lg overflow-hidden flex items-center justify-center">
                  <img src="https://picsum.photos/seed/cyberpunk-tower/400/225" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <PlayCircle size={24} className="text-white/90" />
                  </div>
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur text-white text-[10px] px-1.5 py-0.5 rounded">
                    00:06
                  </div>
                </div>
              </div>
            </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* 5. 底部分镜项目区 (Moved to bottom) */}
      <footer className="h-48 bg-white border-t border-slate-200 flex flex-col shrink-0 p-3 z-10 shadow-inner">
        <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-4 text-xs">
            <span className="text-gray-500">总共分镜数: <span className="text-gray-900 font-medium">39</span></span>
            <span className="text-gray-500">已验收完成: <span className="text-emerald-600 font-medium">6</span></span>
            
            <div className="flex items-center gap-2 ml-4">
              <Filter size={14} className="text-gray-400" />
              <span className="text-gray-500">状态:</span>
              <select className="bg-transparent border-none focus:ring-0 text-gray-700 font-medium cursor-pointer">
                <option>全部</option>
                <option>待制作</option>
                <option>已完成</option>
              </select>
            </div>
            <button className="px-3 py-1 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition-colors">
              筛选
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPreview}
              className="px-3 py-1.5 border border-emerald-200 bg-emerald-50 rounded-lg text-xs font-medium text-emerald-700 flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
            >
              <Eye size={14} />
              查看视频预览
            </button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
              <LayoutGrid size={14} />
              一键补充
            </button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
              <Zap size={14} />
              一键生成
            </button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
              <Download size={14} />
              批量导出
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-x-auto pt-3 flex gap-3 items-center">
          {/* 分镜卡片列表 */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <div 
              key={item}
              onClick={() => setActiveStoryboard(item)}
              className={`w-40 h-full rounded-lg border-2 flex flex-col overflow-hidden cursor-pointer shrink-0 transition-colors ${
                activeStoryboard === item ? 'border-emerald-500 shadow-sm' : 'border-transparent bg-gray-100 hover:border-gray-300'
              }`}
            >
              <div className="px-2 py-1 flex justify-between items-center text-[10px] text-gray-500 bg-white/50">
                <span className="font-medium text-gray-700">{item}. 1-1-{item}</span>
                <div className="flex items-center gap-1">
                  <span>20次</span>
                  <Coins size={10} />
                  <span>1000</span>
                </div>
              </div>
              <div className="flex-1 relative bg-gray-200 flex items-center justify-center overflow-hidden">
                {item === 1 || item === 2 || item === 4 || item === 6 ? (
                  <img 
                    src={`https://picsum.photos/seed/storyboard-${item}/200/300`} 
                    alt={`Storyboard ${item}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : item === 5 ? (
                  <div className="text-gray-400">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                  </div>
                ) : null}
                {globalMode === 'video' && (item === 1 || item === 4) && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                     <PlayCircle size={24} className="text-white/80" />
                   </div>
                )}
              </div>
              <div className="px-2 py-1 text-[10px] text-gray-500 bg-white/50">
                耗时{item === 3 ? '0' : '2'}小时
              </div>
            </div>
          ))}
        </div>
      </footer>
    </>
  );
}
