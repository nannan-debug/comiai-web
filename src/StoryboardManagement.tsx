import React, { useEffect, useRef, useState } from 'react';
import { 
  BookOpen, PanelLeftClose, PanelLeftOpen, Cpu, Settings2, Play, 
  Image as ImageIcon, Video, SlidersHorizontal, Copy, Trash2, 
  Plus, CheckCircle2, Download, LayoutGrid, Film,
  PlusCircle, FolderOpen, Sparkles, Upload, Package, User, MapPin, X
} from 'lucide-react';

type StoryboardMode = 'image-video' | 'direct-video';

export default function StoryboardManagement({
  onNext,
  initialMode = 'image-video',
}: {
  onNext: () => void;
  initialMode?: StoryboardMode;
}) {
  const [isScriptPanelOpen, setIsScriptPanelOpen] = useState(true);
  const [shots, setShots] = useState([1, 2, 3, 4]);
  const [globalMode, setGlobalMode] = useState<StoryboardMode>(initialMode);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showAssetManager, setShowAssetManager] = useState(false);


  const scriptLines = [
    "1日，夜，陷阵营地",
    "出场人物：老兵甲，士兵群演",
    "上帝视角垂直俯拍，极简几何构图。背景是深不见底的黑，中央是一个巨大的正方形朱砂红地毯区域。正中心是一团金色的圆形火焰（青铜方鼎）。三十个黑色的圆点（士兵）整齐围坐在火周围。",
    "老兵甲：（啃着羊腿，含糊不清）林兄弟，今天可太解气了！"
  ];

  const handleDeleteShot = (id: number) => {
    setShots(shots.filter(s => s !== id));
  };

  const handleAddShot = () => {
    const newId = shots.length > 0 ? Math.max(...shots) + 1 : 1;
    setShots([...shots, newId]);
  };

  return (
    <div className="stage-shell flex-1 flex flex-col overflow-hidden p-3 gap-3 pb-0">
      <div className="flex-1 flex overflow-hidden gap-3">
        {/* 左侧：剧本回显 */}
        <aside 
          className={`stage-pane bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden transition-all duration-300 shrink-0 ${
            isScriptPanelOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 invisible border-none'
          }`}
        >
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <span className="stage-title text-sm font-bold text-slate-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#6da768]" /> 剧本
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded bg-white font-bold">只读参考</span>
            <button 
              className="text-slate-400 hover:text-[#2b5f43] p-1 rounded-lg hover:bg-[#e9f2df] transition-colors border border-transparent hover:border-[#6da768]/25" 
              onClick={() => setIsScriptPanelOpen(false)}
              title="收起剧本参考"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 text-xs text-slate-600 leading-relaxed space-y-4 bg-slate-50/30">
          {scriptLines.map((line, idx) => (
            <div key={idx} className={idx === 2 ? 'border-[#6da768] border-l-2 pl-3 bg-[#e9f2df] -ml-4 p-2 rounded-r shadow-sm' : 'pl-3'}>
              {line.includes('老兵甲') ? (
                <span>
                  {line.split('老兵甲')[0]}
                  <span className="text-[#2b5f43] font-bold bg-[#d7ead6] px-1 rounded mx-0.5 shadow-sm">老兵甲</span>
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
      <main className="stage-pane flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative min-w-0">
        {/* 工具栏 */}
        <div className="border-b border-slate-100 px-6 py-3 shrink-0 flex items-center justify-between z-30 bg-slate-50/50">
          <div className="flex items-center gap-4">
            {!isScriptPanelOpen && (
              <>
                <button
                  className="text-slate-400 hover:text-[#2b5f43] p-1.5 rounded-lg hover:bg-[#e9f2df] transition-colors border border-slate-200 bg-white shadow-sm"
                  onClick={() => setIsScriptPanelOpen(true)}
                  title="展开剧本参考"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </button>
                <span className="h-5 w-px bg-slate-200" />
              </>
            )}
            <span className="stage-title ink-title text-sm font-bold text-slate-800">
              全集分镜管理 <span className="text-xs font-normal text-slate-500 ml-1">(共 {shots.length} 镜)</span>
            </span>
            <button
              onClick={() => setShowAssetManager(true)}
              className="px-2.5 py-1 text-[11px] font-bold bg-white text-[#2b5f43] border border-slate-200 rounded-lg hover:bg-[#f5faee] hover:border-[#6da768] transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <Package className="w-3.5 h-3.5" /> 设定资产
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <button 
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="px-3 py-1.5 text-[11px] font-bold bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-[#2b5f43] flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Cpu className="w-3.5 h-3.5" /> 模型偏好
              </button>
              
              {showModelMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                  <div className="stage-title text-xs font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <Settings2 className="w-3.5 h-3.5 text-[#6da768]" /> 批量生成默认引擎
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">默认生图模型</label>
                      <select className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none hover:border-[#9fc79b] cursor-pointer focus:ring-2 focus:ring-[#6da768]/20 transition-all shadow-inner">
                        <option>Midjourney v6.0</option>
                        <option>Stable Diffusion XL</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">默认生视频模型</label>
                      <select className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none hover:border-[#9fc79b] cursor-pointer focus:ring-2 focus:ring-[#6da768]/20 transition-all shadow-inner">
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

            <button className="stage-primary doodle-arrow px-4 py-1.5 text-[11px] font-bold rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all">
              <Play className="w-3.5 h-3.5 fill-current text-[#d8ec6a]" /> 批量执行生成
            </button>
          </div>
        </div>
        
        {/* 列表区 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 pb-20 custom-scrollbar">
          {shots.map((shot, index) => (
            <ShotCard 
              key={shot} 
              shotNumber={index + 1} 
              onDelete={() => handleDeleteShot(shot)} 
              onNext={onNext}
              globalMode={globalMode}
            />
          ))}

          {/* 新增分镜按钮 */}
          <div className="pt-2 pb-6">
            <button
              onClick={handleAddShot}
              className="w-full doodle-arrow border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center py-6 text-slate-500 hover:text-[#2b5f43] hover:border-[#6da768] hover:bg-[#e9f2df] cursor-pointer transition-all shadow-sm bg-white/50 active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wide">新增一条分镜</span>
              </div>
            </button>
          </div>
        </div>

        {showAssetManager && <AssetManagerOverlay onClose={() => setShowAssetManager(false)} />}
      </main>
    </div>
    </div>
  );
}

function AssetManagerOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-40 bg-white flex flex-col">
      <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <h3 className="stage-title text-sm font-bold text-slate-800 flex items-center gap-2">
          <Package className="w-4 h-4 text-[#6da768]" /> 设定资产管理
        </h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-[#2b5f43] hover:border-[#6da768] transition-colors flex items-center justify-center"
          title="关闭资产管理"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 space-y-8 custom-scrollbar">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-[#6da768]" /> 角色 (2)
            </h4>
            <button className="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-[#2b5f43] hover:border-[#6da768] transition-colors flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AssetCard
              title="老兵甲"
              subtitle="皮肤质感粗糙油亮"
              image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60"
            />
            <AssetUploadCard title="士兵群演" subtitle="陷阵营士兵黑色铁甲背影" icon="role" />
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#6da768]" /> 场景 (1)
            </h4>
            <button className="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-[#2b5f43] hover:border-[#6da768] transition-colors flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AssetCard
              title="陷阵营地（夜）"
              subtitle="篝火中心构图、黑色环境氛围"
              image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60"
            />
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#6da768]" /> 道具 (2)
            </h4>
            <button className="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-[#2b5f43] hover:border-[#6da768] transition-colors flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AssetCard
              title="青铜方鼎"
              subtitle="中央火焰载体，视觉锚点"
              image="https://images.unsplash.com/photo-1536617621572-1d5f1e62608f?w=500&auto=format&fit=crop&q=60"
            />
            <AssetCard
              title="羊腿"
              subtitle="老兵甲手持道具"
              image="https://images.unsplash.com/photo-1551029506-0807df4e2031?w=500&auto=format&fit=crop&q=60"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function AssetCard({ title, subtitle, image }: { title: string; subtitle: string; image: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="h-36 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      <div className="p-3">
        <div className="font-bold text-sm text-slate-800 mb-1">{title}</div>
        <div className="text-xs text-slate-500 truncate mb-3">{subtitle}</div>
        <button className="w-full py-1.5 text-xs font-bold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
          编辑
        </button>
      </div>
    </div>
  );
}

function AssetUploadCard({
  title,
  subtitle,
  icon = 'role',
}: {
  title: string;
  subtitle: string;
  icon?: 'role' | 'scene' | 'prop';
}) {
  const IconComp = icon === 'scene' ? MapPin : icon === 'prop' ? Package : User;
  return (
    <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 overflow-hidden shadow-sm">
      <div className="h-36 bg-slate-50 flex flex-col items-center justify-center">
        <IconComp className="w-8 h-8 text-slate-300 mb-2" />
      </div>
      <div className="p-3">
        <div className="font-bold text-sm text-slate-800 mb-1">{title}</div>
        <div className="text-xs text-slate-400 truncate mb-3">{subtitle}</div>
        <button className="w-full py-1.5 text-xs font-bold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
          上传参考
        </button>
      </div>
    </div>
  );
}

function ShotCard({
  shotNumber,
  onDelete,
  onNext,
  globalMode,
}: {
  key?: React.Key;
  shotNumber: number;
  onDelete: () => void;
  onNext: () => void;
  globalMode: 'image-video' | 'direct-video';
}) {
  type BoundAsset = {
    id: number;
    type: 'scene' | 'role' | 'prop';
    label: string;
    avatar?: string;
  };

  const [cardMode, setCardMode] = useState<'image' | 'video'>(
    globalMode === 'direct-video' ? 'video' : 'image'
  );
  const [showAssetMenu, setShowAssetMenu] = useState(false);
  const [assetSeq, setAssetSeq] = useState(1);
  const [boundAssets, setBoundAssets] = useState<BoundAsset[]>([
    { id: 1, type: 'scene', label: '营地' },
    { id: 2, type: 'role', label: '老兵甲', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
  ]);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const libraryAssets: Omit<BoundAsset, 'id'>[] = [
    { type: 'scene', label: '王城街道' },
    { type: 'role', label: '士兵群演', avatar: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=100&h=100&fit=crop' },
    { type: 'prop', label: '青铜方鼎' },
    { type: 'prop', label: '战旗' },
  ];

  useEffect(() => {
    setCardMode(globalMode === 'direct-video' ? 'video' : 'image');
  }, [globalMode]);

  const appendAsset = (asset: Omit<BoundAsset, 'id'>) => {
    setBoundAssets((prev) => [...prev, { ...asset, id: Date.now() + Math.floor(Math.random() * 1000) }]);
  };

  const handleAddFromLibrary = () => {
    const index = boundAssets.length % libraryAssets.length;
    appendAsset(libraryAssets[index]);
    setShowAssetMenu(false);
  };

  const handleGenerateAsset = () => {
    appendAsset({ type: 'role', label: `新角色${assetSeq}` });
    setAssetSeq((prev) => prev + 1);
    setShowAssetMenu(false);
  };

  const handleLocalUpload = () => {
    uploadInputRef.current?.click();
  };

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const pureName = file.name.replace(/\.[^/.]+$/, '');
    appendAsset({ type: 'prop', label: pureName || `本地资源${assetSeq}` });
    setAssetSeq((prev) => prev + 1);
    setShowAssetMenu(false);
    e.target.value = '';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex transition-colors hover:border-[#9fc79b] group/card min-h-[220px]">
      {/* 左侧序号栏 */}
      <div className="bg-slate-50/50 w-12 border-r border-slate-100 flex flex-col items-center pt-5 shrink-0 gap-3 group relative">
        <span className="font-bold text-slate-700 bg-white border border-slate-200 w-7 h-7 flex items-center justify-center rounded-full shadow-sm text-xs">
          {shotNumber}
        </span>
        <div className="flex flex-col gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
          <button onClick={onNext} className="text-[#6da768] hover:text-[#193d2c] bg-[#e9f2df] shadow-sm border border-[#6da768]/30 rounded-lg p-1.5 transition-colors" title="进入精修模式">
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
      <div className="flex-1 p-4 grid grid-cols-12 gap-5 min-h-[220px]">
        {/* 列1：绑定资产 */}
        <div className="col-span-3 border-r border-slate-100 pr-5 flex flex-col gap-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">绑定资产</label>
              <div className="relative">
                <button
                  onClick={() => setShowAssetMenu((prev) => !prev)}
                  className="w-5 h-5 rounded-md border border-slate-300 bg-white text-slate-500 hover:text-[#2b5f43] hover:border-[#6da768] flex items-center justify-center transition-colors"
                  title="新增绑定资产"
                >
                  <Plus className="w-3 h-3" />
                </button>
                {showAssetMenu && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowAssetMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 z-40 w-44 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                      <button
                        onClick={handleAddFromLibrary}
                        className="w-full px-3 py-2 text-left text-xs font-bold text-[#2b5f43] hover:bg-[#f5faee] transition-colors flex items-center gap-2"
                      >
                        <FolderOpen className="w-3.5 h-3.5" /> 资源库导入
                      </button>
                      <button
                        onClick={handleGenerateAsset}
                        className="w-full px-3 py-2 text-left text-xs font-bold text-[#2b5f43] hover:bg-[#f5faee] transition-colors flex items-center gap-2 border-t border-slate-100"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> 新建生成
                      </button>
                      <button
                        onClick={handleLocalUpload}
                        className="w-full px-3 py-2 text-left text-xs font-bold text-[#2b5f43] hover:bg-[#f5faee] transition-colors flex items-center gap-2 border-t border-slate-100"
                      >
                        <Upload className="w-3.5 h-3.5" /> 本地上传
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <input ref={uploadInputRef} type="file" className="hidden" accept="image/*" onChange={handleLocalFileChange} />
            <div className="flex flex-wrap gap-2">
              {boundAssets.map((asset) => (
                <div
                  key={asset.id}
                  className={`flex items-center gap-1.5 border border-slate-200 pr-2 py-0.5 shadow-sm ${
                    asset.type === 'role' ? 'pl-0.5 bg-white rounded-full' : 'pl-1 bg-slate-50 rounded-lg'
                  }`}
                >
                  {asset.type === 'role' && asset.avatar ? (
                    <img src={asset.avatar} className="w-5 h-5 rounded-full object-cover border border-slate-100 lifely-image" />
                  ) : (
                    <div className="w-5 h-5 bg-white rounded flex items-center justify-center border border-slate-100 shrink-0">
                      {asset.type === 'scene' ? (
                        <ImageIcon className="w-3 h-3 text-slate-400" />
                      ) : (
                        <Package className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                  )}
                  <span className="text-[10px] font-bold text-slate-700 truncate max-w-[70px]" title={asset.label}>
                    {asset.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 列2：提示词 */}
        <div className="col-span-5 border-r border-slate-100 pr-5 flex flex-col">
          <label className="text-[10px] text-slate-400 uppercase font-bold mb-2 flex items-center justify-between tracking-wider">
            {cardMode === 'video' ? '视频提示词' : '生图提示词'}
            <span className="text-[9px] font-bold text-[#2b5f43] bg-[#e9f2df] px-1.5 py-0.5 rounded cursor-pointer hover:bg-[#d7ead6] transition-colors shadow-sm border border-[#6da768]/25">AI 优化</span>
          </label>
          <textarea 
            className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-2.5 h-32 resize-none outline-none focus:border-[#6da768] focus:bg-white focus:ring-2 focus:ring-[#6da768]/20 transition-all leading-relaxed mb-3 shadow-inner"
            defaultValue="上帝视角垂直俯拍，极简几何构图。画面是纯粹的几何图形：背景是深不见底的黑，中央是一个巨大的正方形朱砂红地毯区域。正中心是一团金色的圆形火焰（青铜方鼎）。三十个黑色的圆点（士兵）整齐围坐在火周围。影视级CGI渲染。"
          />
        </div>

        {/* 列3：生成预览 */}
        <div className="col-span-4 flex flex-col relative">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">预览与生成</label>
            <div className="flex items-center bg-[#f1f4f2] border border-slate-200 rounded-lg p-0.5">
              <button 
                onClick={() => setCardMode('image')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${
                  cardMode === 'image'
                    ? 'bg-white text-[#2b5f43] border border-[#d5ddd8]'
                    : 'bg-transparent text-[#2b5f43]/75 border border-transparent'
                }`}
              >
                <ImageIcon className="w-3 h-3" /> 图生
              </button>
              <button 
                onClick={() => setCardMode('video')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${
                  cardMode === 'video'
                    ? 'bg-white text-[#2b5f43] border border-[#d5ddd8]'
                    : 'bg-transparent text-[#2b5f43]/75 border border-transparent'
                }`}
              >
                <Video className="w-3 h-3" /> 直出
              </button>
            </div>
          </div>
          
          {cardMode === 'image' ? (
            <div className="w-full h-full flex gap-2 min-h-[90px] animate-in fade-in duration-300">
              <div className="flex-1 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:border-[#6da768] hover:bg-[#e9f2df] text-slate-400 transition-colors group shadow-sm">
                <ImageIcon className="w-5 h-5 mb-1 group-hover:text-[#6da768] transition-colors" />
                <span className="text-[10px] font-bold text-slate-600 group-hover:text-[#2b5f43]">生成关键帧</span>
              </div>
              <div className="flex-1 border border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-100/50 text-slate-400 opacity-60 shadow-inner">
                <Film className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold">需先生成图片</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex min-h-[90px] animate-in fade-in duration-300">
              <div className="w-full flex-1 border-2 border-dashed border-[#6da768] rounded-xl flex flex-col items-center justify-center bg-[#e9f2df] cursor-pointer hover:bg-[#e9f2df] hover:border-[#6da768] text-[#6da768] transition-colors group relative overflow-hidden shadow-sm">
                <div className="absolute top-1 right-1 flex items-center gap-1 z-10" onClick={(e) => e.stopPropagation()}>
                  <select className="bg-white border border-[#6da768]/40 text-[10px] font-bold text-[#2b5f43] rounded-lg px-1.5 py-0.5 outline-none cursor-pointer shadow-sm">
                    <option>5s</option>
                    <option>10s</option>
                    <option>15s</option>
                  </select>
                </div>
                <Video className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#2b5f43]">点击直出视频</span>
                <span className="text-[9px] mt-1 text-[#6da768]/80 font-bold">消耗 10 算力</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
