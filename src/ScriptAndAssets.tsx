import React, { useState } from 'react';
import { BookOpen, Wand2, Users, User, MapPin, Package, ChevronDown, Plus } from 'lucide-react';

type StoryboardMode = 'image-video' | 'direct-video';

export default function ScriptAndAssets({ onNext }: { onNext: (mode: StoryboardMode) => void }) {
  const [isParsing, setIsParsing] = useState(false);
  const [hasParsed, setHasParsed] = useState(false);
  const [showNextMenu, setShowNextMenu] = useState(false);
  const initialScriptText =
    `1日，夜，陷阵营地\n出场人物：老兵甲，士兵群演\n\n上帝视角垂直俯拍，极简几何构图。背景是深不见底的黑，中央是一个巨大的正方形朱砂红地毯区域。正中心是一团金色的圆形火焰（青铜方鼎）。三十个黑色的圆点（士兵）整齐围坐在火周围。\n老兵甲：（啃着羊腿，含糊不清）林兄弟，今天可太解气了！\n\n`;
  const [savedScriptText, setSavedScriptText] = useState(initialScriptText);
  const [draftScriptText, setDraftScriptText] = useState(initialScriptText);
  const [isEditingScript, setIsEditingScript] = useState(false);

  const handleParse = () => {
    setShowNextMenu(false);
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
      setHasParsed(true);
    }, 1500);
  };

  const handleScriptEditToggle = () => {
    if (isEditingScript) {
      setSavedScriptText(draftScriptText);
      setIsEditingScript(false);
      setHasParsed(false);
      setShowNextMenu(false);
      return;
    }

    setDraftScriptText(savedScriptText);
    setIsEditingScript(true);
    setShowNextMenu(false);
  };

  const isNextDisabled = !hasParsed || isParsing || isEditingScript;

  const handleSelectNextMode = (mode: StoryboardMode) => {
    setShowNextMenu(false);
    onNext(mode);
  };

  return (
    <div className="flex-1 flex overflow-hidden p-3 gap-3 pb-0">
      {/* 左侧：剧本输入 */}
      <aside className="w-[400px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-sm flex items-center gap-2 text-slate-700">
            <BookOpen className="w-4 h-4 text-[#6da768]" /> 剧本
          </h2>
          <button
            onClick={handleScriptEditToggle}
            className="text-xs text-slate-500 hover:text-[#2b5f43] font-bold px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            {isEditingScript ? '保存文件' : '编辑文件'}
          </button>
        </div>
        <div className="flex-1 p-0 relative bg-slate-50/30">
          <textarea
            className={`w-full h-full p-4 resize-none outline-none text-slate-600 text-xs font-medium leading-relaxed placeholder:text-slate-400 bg-transparent ${
              isEditingScript ? '' : 'cursor-default'
            }`}
            placeholder="在此粘贴剧本内容..."
            value={isEditingScript ? draftScriptText : savedScriptText}
            readOnly={!isEditingScript}
            onChange={(e) => setDraftScriptText(e.target.value)}
          ></textarea>
        </div>

        <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-10px_20px_-15px_rgba(0,0,0,0.05)]">
          <button
            onClick={handleParse}
            disabled={isParsing || isEditingScript}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isParsing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 text-violet-400" />
            )}
            {isEditingScript
              ? '请先保存文件'
              : isParsing
                ? '解析中...'
                : hasParsed
                  ? '重新提取角色、场景与道具'
                  : '智能提取角色、场景与道具'}
          </button>
        </div>
      </aside>

      {/* 右侧：资产绑定面板 */}
      <main className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
        {/* Header - Always visible */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center shrink-0 z-30 relative">
          <div>
            <h3 className="font-bold text-base text-slate-800">设定资产</h3>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => !isNextDisabled && setShowNextMenu((prev) => !prev)}
                disabled={isNextDisabled}
                className="px-5 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-sm font-bold transition-colors shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                下一步：选择分镜模式
                <span className="h-4 w-px bg-white/35 mx-0.5" />
                <ChevronDown className="w-4 h-4" />
              </button>

              {showNextMenu && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => handleSelectNextMode('direct-video')}
                  >
                    文字直出
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                    onClick={() => handleSelectNextMode('image-video')}
                  >
                    图生视频
                  </button>
                </div>
              )}
            </div>
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
            <div className="absolute inset-0 flex flex-col items-center justify-center text-violet-600 z-20 bg-slate-50/80 backdrop-blur-sm">
              <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin mb-4" />
              <p className="text-sm font-bold animate-pulse">正在深度理解剧本，提取实体资产...</p>
            </div>
          )}

          {hasParsed && !isParsing && (
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 animate-in fade-in duration-500 custom-scrollbar">
              {/* 角色区 */}
              <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <User className="w-4 h-4 text-violet-500" /> 角色 (2)
                  </h4>
                  <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-violet-600 transition-colors flex items-center justify-center shadow-sm">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* 角色1 */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-violet-300 transition-colors group">
                    <div className="h-40 relative flex items-center justify-center overflow-hidden bg-slate-100">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60')] bg-cover bg-center transition-transform duration-500 group-hover:scale-105"></div>
                      <span className="absolute top-2 left-2 text-white text-[10px] px-2 py-0.5 bg-violet-500/90 rounded font-bold shadow-sm backdrop-blur-sm">
                        已绑定参考图
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="font-bold text-sm text-slate-800 mb-1">老兵甲</div>
                      <div className="text-xs text-slate-500 truncate mb-3">皮肤质感粗糙油亮</div>
                      <button className="w-full py-1.5 text-xs font-bold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-violet-600 transition-colors">
                        编辑
                      </button>
                    </div>
                  </div>

                  {/* 角色2 */}
                  <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 overflow-hidden shadow-sm hover:border-violet-300 transition-colors group">
                    <div className="h-40 bg-slate-50 flex flex-col items-center justify-center group-hover:bg-violet-50/30 transition-colors">
                      <Users className="w-8 h-8 text-slate-300 mb-2 group-hover:text-violet-400 transition-colors" />
                    </div>
                    <div className="p-3">
                      <div className="font-bold text-sm text-slate-800 mb-1">士兵群演</div>
                      <div className="text-xs text-slate-400 mb-3 truncate">陷阵营士兵黑色铁甲背影</div>
                      <button className="w-full py-1.5 text-xs font-bold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-violet-600 transition-colors">
                        上传参考
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 场景区 */}
              <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-violet-500" /> 场景 (1)
                  </h4>
                  <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-violet-600 transition-colors flex items-center justify-center shadow-sm">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-violet-300 transition-colors group">
                    <div className="h-40 relative flex items-center justify-center overflow-hidden bg-slate-100">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60')] bg-cover bg-center transition-transform duration-500 group-hover:scale-105"></div>
                    </div>
                    <div className="p-3">
                      <div className="font-bold text-sm text-slate-800 mb-1">陷阵营地（夜）</div>
                      <div className="text-xs text-slate-500 truncate mb-3">篝火中心构图、黑色环境氛围</div>
                      <button className="w-full py-1.5 text-xs font-bold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-violet-600 transition-colors">
                        编辑
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 道具区 */}
              <div className="mb-2">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Package className="w-4 h-4 text-violet-500" /> 道具 (2)
                  </h4>
                  <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-violet-600 transition-colors flex items-center justify-center shadow-sm">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-violet-300 transition-colors group">
                    <div className="h-40 relative flex items-center justify-center overflow-hidden bg-slate-100">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536617621572-1d5f1e62608f?w=500&auto=format&fit=crop&q=60')] bg-cover bg-center transition-transform duration-500 group-hover:scale-105"></div>
                    </div>
                    <div className="p-3">
                      <div className="font-bold text-sm text-slate-800 mb-1">青铜方鼎</div>
                      <div className="text-xs text-slate-500 truncate mb-3">中央火焰载体，场景核心视觉锚点</div>
                      <button className="w-full py-1.5 text-xs font-bold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-violet-600 transition-colors">
                        编辑
                      </button>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-violet-300 transition-colors group">
                    <div className="h-40 relative flex items-center justify-center overflow-hidden bg-slate-100">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551029506-0807df4e2031?w=500&auto=format&fit=crop&q=60')] bg-cover bg-center transition-transform duration-500 group-hover:scale-105"></div>
                    </div>
                    <div className="p-3">
                      <div className="font-bold text-sm text-slate-800 mb-1">羊腿</div>
                      <div className="text-xs text-slate-500 truncate mb-3">老兵甲手持道具，强化人物状态</div>
                      <button className="w-full py-1.5 text-xs font-bold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-violet-600 transition-colors">
                        编辑
                      </button>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 overflow-hidden shadow-sm hover:border-violet-300 transition-colors group">
                    <div className="h-40 bg-slate-50 flex flex-col items-center justify-center group-hover:bg-violet-50/30 transition-colors">
                      <Plus className="w-8 h-8 text-slate-300 mb-2 group-hover:text-violet-400 transition-colors" />
                      <span className="text-xs text-slate-400 group-hover:text-violet-500 font-bold">新增道具</span>
                    </div>
                    <div className="p-3">
                      <div className="font-bold text-sm text-slate-800 mb-1">上传道具参考</div>
                      <div className="text-xs text-slate-400 mb-3 truncate">支持上传图片用于统一画面资产</div>
                      <button className="w-full py-1.5 text-xs font-bold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-violet-600 transition-colors">
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
