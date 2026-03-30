import React, { useState } from 'react';
import StoryboardProduction from './StoryboardProduction';
import VideoPreview from './VideoPreview';
import ScriptAndAssets from './ScriptAndAssets';
import StoryboardManagement from './StoryboardManagement';
import ScriptUpload from './ScriptUpload';
import EpisodeManagement from './EpisodeManagement';
import ScriptSplitView from './ScriptSplitView';
import ProjectManagement from './ProjectManagement';
import { ArrowLeft } from 'lucide-react';

type ViewState = 'projects' | 'management' | 'upload' | 'split' | 'production';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('projects');
  const [productionStep, setProductionStep] = useState(1);

  return (
    <div className="flex flex-col h-screen bg-[#F8F3E8] text-slate-800 font-sans overflow-hidden text-sm relative">
      
      {/* Production Header (Only visible during actual production steps) */}
      {currentView === 'production' && (
        <header className="h-14 bg-[#2E2638] flex items-center justify-between px-6 shrink-0 shadow-lg z-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentView('management')}
              className="text-slate-400 hover:text-white transition-colors flex items-center justify-center p-1 rounded-full hover:bg-slate-700"
              title="返回分集管理"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="w-8 h-8 bg-violet-500 rounded flex items-center justify-center text-white font-bold">C</div>
            <div className="text-xs text-slate-400">
              ComiAI › <span className="text-white">第一集</span>
            </div>
          </div>

          <div className="flex bg-[#3A3147] rounded-full p-1 text-[11px] font-bold">
            <button onClick={() => setProductionStep(1)} className={`px-4 py-1.5 rounded-full transition-all ${productionStep === 1 ? 'bg-violet-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>1.剧本与设定</button>
            <button onClick={() => setProductionStep(2)} className={`px-4 py-1.5 rounded-full transition-all ${productionStep === 2 ? 'bg-violet-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>2.分镜管理</button>
            <button onClick={() => setProductionStep(3)} className={`px-4 py-1.5 rounded-full transition-all ${productionStep === 3 ? 'bg-violet-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>3.分镜制作</button>
            <button onClick={() => setProductionStep(4)} className={`px-4 py-1.5 rounded-full transition-all ${productionStep === 4 ? 'bg-violet-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>4.视频预览</button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1A1F23] px-3 py-1.5 rounded-full text-xs text-violet-400 font-mono">
              🪙 24310
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-500 border border-slate-400"></div>
          </div>
        </header>
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
          onUpload={() => setCurrentView('upload')}
          onEnterEpisode={() => {
            setProductionStep(1);
            setCurrentView('production');
          }} 
          onBack={() => setCurrentView('projects')}
        />
      )}
      
      {currentView === 'upload' && (
        <ScriptUpload 
          onNext={() => setCurrentView('split')} 
          onBack={() => setCurrentView('projects')} 
        />
      )}

      {currentView === 'split' && (
        <ScriptSplitView 
          onBack={() => setCurrentView('upload')}
          onCreateProject={() => setCurrentView('management')} 
        />
      )}
      
      {/* Production Steps */}
      {currentView === 'production' && productionStep === 1 && (
        <ScriptAndAssets onNext={() => setProductionStep(2)} />
      )}
      {currentView === 'production' && productionStep === 2 && (
        <StoryboardManagement onNext={() => setProductionStep(3)} />
      )}
      {currentView === 'production' && productionStep === 3 && (
        <StoryboardProduction />
      )}
      {currentView === 'production' && productionStep === 4 && (
        <VideoPreview />
      )}
    </div>
  );
}
