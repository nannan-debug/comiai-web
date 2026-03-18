import React, { useState } from 'react';
import StoryboardProduction from './StoryboardProduction';
import VideoPreview from './VideoPreview';
import ScriptAndAssets from './ScriptAndAssets';
import StoryboardManagement from './StoryboardManagement';
import ScriptUpload from './ScriptUpload';
import EpisodeManagement from './EpisodeManagement';
import ScriptSplitView from './ScriptSplitView';
import ProjectManagement from './ProjectManagement';
import { ArrowLeft, X } from 'lucide-react';

type ViewState = 'projects' | 'management' | 'upload' | 'split' | 'production';
type StoryboardMode = 'image-video' | 'direct-video';
type SplitEntrySource = 'upload' | 'management';
type ProductionPanelMode = 'image' | 'video';
type PreviewDraftState = 'clean' | 'draft';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('projects');
  const [productionStep, setProductionStep] = useState(1);
  const [selectedStoryboardMode, setSelectedStoryboardMode] = useState<StoryboardMode>('image-video');
  const [splitEntrySource, setSplitEntrySource] = useState<SplitEntrySource>('upload');
  const [productionPanelMode, setProductionPanelMode] = useState<ProductionPanelMode>('image');
  const [previewDraftState, setPreviewDraftState] = useState<PreviewDraftState>('clean');
  const [previewNotice, setPreviewNotice] = useState('');
  const [showBatchOperations, setShowBatchOperations] = useState(false);

  const handleProductionStepChange = (nextStep: number) => {
    if (productionStep === 3 && nextStep !== 3 && previewDraftState === 'draft') {
      setPreviewNotice('视频预览里的修改已自动保存为草稿，可稍后继续并再决定是否应用。');
      setTimeout(() => setPreviewNotice(''), 2600);
    }
    setProductionStep(nextStep);
    if (nextStep !== 2) setShowBatchOperations(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5] text-slate-800 font-sans overflow-hidden text-sm relative">
      
      {/* Production Header (Only visible during actual production steps) */}
      {currentView === 'production' && (
        <header className="h-14 bg-[#333A3F] flex items-center justify-between px-6 shrink-0 shadow-lg z-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentView('management')}
              className="text-slate-400 hover:text-white transition-colors flex items-center justify-center p-1 rounded-full hover:bg-slate-700"
              title="返回分集管理"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white font-bold">M</div>
            <div className="text-xs text-slate-400">
              末日直播 › <span className="text-white">第一集</span>
            </div>
          </div>

          <div className="flex bg-[#23292E] rounded-full p-1 text-[11px] font-bold">
            <button onClick={() => handleProductionStepChange(1)} className={`px-4 py-1.5 rounded-full transition-all ${productionStep === 1 ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>1.剧本与设定</button>
            <button onClick={() => handleProductionStepChange(2)} className={`px-4 py-1.5 rounded-full transition-all ${productionStep === 2 ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>2.分镜制作</button>
            <button onClick={() => handleProductionStepChange(3)} className={`px-4 py-1.5 rounded-full transition-all ${productionStep === 3 ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>3.视频预览</button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1A1F23] px-3 py-1.5 rounded-full text-xs text-emerald-400 font-mono">
              🪙 24310
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-500 border border-slate-400"></div>
          </div>
        </header>
      )}

      {currentView === 'production' && previewNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[70] rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800 shadow-lg">
          {previewNotice}
        </div>
      )}

      {/* Page Content based on ViewState */}
      {currentView === 'projects' && (
        <ProjectManagement 
          onCreateProject={() => setCurrentView('upload')} 
          onEnterProject={() => setCurrentView('management')} 
        />
      )}

      {currentView === 'management' && (
        <EpisodeManagement 
          onUpload={() => {
            setSplitEntrySource('management');
            setCurrentView('split');
          }}
          onEnterEpisode={() => {
            setProductionStep(1);
            setCurrentView('production');
          }} 
          onBack={() => setCurrentView('projects')}
        />
      )}
      
      {currentView === 'upload' && (
        <ScriptUpload 
          onNext={() => {
            setSplitEntrySource('upload');
            setCurrentView('split');
          }} 
          onBack={() => setCurrentView('projects')} 
        />
      )}

      {currentView === 'split' && (
        <ScriptSplitView 
          onBack={() => setCurrentView(splitEntrySource === 'management' ? 'management' : 'upload')}
          onCreateProject={() => setCurrentView('management')} 
        />
      )}
      
      {/* Production Steps */}
      {currentView === 'production' && productionStep === 1 && (
        <ScriptAndAssets
          onNext={(mode) => {
            setSelectedStoryboardMode(mode);
            setProductionPanelMode(mode === 'direct-video' ? 'video' : 'image');
            setProductionStep(2);
          }}
        />
      )}
      {currentView === 'production' && productionStep === 2 && (
        <StoryboardProduction
          initialGlobalMode={productionPanelMode}
          initialTaskMode="all"
          onOpenPreview={() => setProductionStep(3)}
          onOpenBatchOperations={() => setShowBatchOperations(true)}
        />
      )}
      {currentView === 'production' && productionStep === 3 && (
        <VideoPreview onDraftStateChange={setPreviewDraftState} />
      )}

      {currentView === 'production' && productionStep === 2 && showBatchOperations && (
        <div className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-sm p-4">
          <div className="w-full h-full rounded-3xl bg-[#f8f8f9] border border-[#d2d3d4] shadow-2xl overflow-hidden flex flex-col">
            <div className="h-12 px-4 border-b border-[#d2d3d4] bg-white/70 flex items-center justify-between shrink-0">
              <div className="text-sm font-bold text-slate-800">批量操作 · 分镜管理</div>
              <button
                onClick={() => setShowBatchOperations(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center"
                title="关闭"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <StoryboardManagement
                onNext={(panelMode) => {
                  setProductionPanelMode(panelMode);
                  setShowBatchOperations(false);
                }}
                initialMode={selectedStoryboardMode}
                embedded
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
