import React, { useState } from 'react';
import { UploadCloud, FileText, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ScriptUpload({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    simulateUpload();
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F5F7] overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-4 w-1/3">
          <button 
            onClick={onBack}
            className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={16} /> 返回项目列表
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center bg-[#333A3F] rounded-full p-1 shadow-inner">
            <div className="flex items-center px-6 py-1.5 bg-emerald-500 text-white rounded-full text-sm font-bold shadow-sm">
              1.上传剧本
            </div>
            <div className="flex items-center px-6 py-1.5 text-slate-400 text-sm font-medium">
              2.剧本分集
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 w-1/3">
          <div className="flex items-center gap-2 bg-[#23292E] px-3 py-1.5 rounded-full text-xs text-emerald-400 font-mono">
            🪙 24310
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center p-8 overflow-y-auto custom-scrollbar relative">
        
        {/* Absolute positioned Action Button */}
        <div className="absolute top-8 right-8 z-10">
          <button 
            onClick={onNext}
            disabled={!uploadSuccess}
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2 active:scale-95"
          >
            解析剧本 <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="w-full max-w-5xl flex flex-col items-center gap-8 mt-4">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">从剧本开始</h1>
            <p className="text-sm text-slate-500 font-medium">
              上传符合规定格式的剧本后，点击右上方按钮，自动对剧本进行解析
            </p>
          </div>

          {/* Main Content */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Upload Area */}
            <div 
              className={`relative h-[520px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${
                isDragging 
                  ? 'border-emerald-500 bg-emerald-50/50 scale-[1.02]' 
                  : uploadSuccess
                    ? 'border-emerald-300 bg-white shadow-sm'
                    : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-slate-50 cursor-pointer shadow-sm'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isUploading && !uploadSuccess && simulateUpload()}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
                  <div className="text-emerald-600 font-bold tracking-widest animate-pulse">正在上传并校验格式...</div>
                </div>
              ) : uploadSuccess ? (
                <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-800 mb-1">《末日直播》全集剧本.txt</div>
                    <div className="text-sm text-slate-500">上传成功，共识别到 12 集内容</div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadSuccess(false);
                    }}
                    className="mt-4 px-6 py-2 text-sm font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    重新上传
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-slate-400 group">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                    <UploadCloud size={40} />
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-base font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                      点击或拖拽剧本至此开始上传
                    </div>
                    <div className="text-xs font-medium">
                      仅支持上传纯文本剧本（.txt），大小 ≤ 30MB
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Instructions */}
            <div className="h-[520px] bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col overflow-y-auto custom-scrollbar">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" /> 剧本格式说明
              </h2>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                若上传剧本的格式与规定格式不符，可能会影响剧本解析结果。系统将根据以下规则自动将剧本拆分为单集和场次。
              </p>

              <div className="space-y-8">
                {/* Section 1 */}
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-3">拆分单集格式示意</h3>
                  <ul className="text-sm text-slate-600 space-y-2 mb-4 list-disc list-inside marker:text-emerald-500">
                    <li>"第"字开头,"集"字结尾</li>
                    <li>"第xx集"独立成行</li>
                  </ul>
                  <div className="bg-[#1E293B] rounded-xl p-5 font-mono text-sm text-slate-300 shadow-inner border border-slate-700">
                    <div className="text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-md inline-block mb-3">
                      第三集
                    </div>
                    <div className="leading-relaxed space-y-2">
                      <p>3-1场 周易识海 日内 (金色汪洋,威严神圣)</p>
                      <p>出场角色:蛟龙之魂、周易(神念化身)</p>
                      <p>△蛟龙之魂的虚影撞入一片无边无际的金色海洋,周围是奔流不息的法力。</p>
                      <p>蛟龙之魂(惊骇):这是什么地方?! 这是谁的识海?!</p>
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-3">拆分场次格式示意</h3>
                  <ul className="text-sm text-slate-600 space-y-2 mb-4 list-disc list-inside marker:text-emerald-500">
                    <li>符合"X-X"格式</li>
                    <li>X为阿拉伯数字</li>
                    <li>X-X位于该行文字开头</li>
                  </ul>
                  <div className="bg-[#1E293B] rounded-xl p-5 font-mono text-sm text-slate-300 shadow-inner border border-slate-700">
                    <div className="text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-md inline-block mb-3">
                      1-8场 斩妖司-刑房点卯处日内
                    </div>
                    <div className="leading-relaxed space-y-2">
                      <p>出场角色:周易、鲁校尉、众刑者</p>
                      <p>△鲁校尉面无表情地分派任务。</p>
                      <p>鲁校尉:......周易,甲字一号狱,重犯郑华。</p>
                      <p>△话音刚落,周围的刑者们倒吸一口凉气,纷纷投来同情的目光。</p>
                      <p>刑者A(窃窃私语):甲字狱?那不是专门关押绝世大魔头的地方吗?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full flex items-center justify-start mt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <AlertCircle size={14} className="text-amber-500" />
              请确保上传内容及成果使用合法合规且不侵犯任何人权利。
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
