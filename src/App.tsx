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

type ViewState = 'home' | 'projects' | 'management' | 'upload' | 'split' | 'production';
type StoryboardMode = 'image-video' | 'direct-video';

function HomeLanding({ onEnterProjects }: { onEnterProjects: () => void }) {
  return (
    <div className="flex-1 px-6 py-10 md:px-10 md:py-14 overflow-y-auto">
      <div className="max-w-6xl mx-auto min-h-full flex flex-col">
        <div className="mt-6 md:mt-12 flex-1 flex flex-col items-center justify-center text-center">
          <div className="menu-title text-[#6da768] text-base tracking-[0.2em] uppercase">Cold Pressed Studio</div>
          <h1 className="menu-title text-[#193d2c] text-[64px] md:text-[110px] mt-2">MENU</h1>
          <p className="text-[#2b5f43]/80 font-bold tracking-[0.2em] text-xs uppercase mt-2">Nature In Every Press</p>

          <button
            type="button"
            onClick={onEnterProjects}
            className="mt-8 w-44 h-44 md:w-56 md:h-56 rounded-[42%] bg-[#d8ec6a] text-[#193d2c] border-[5px] border-[#2b5f43] shadow-xl flex flex-col items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
            title="进入创作菜单"
          >
            <div className="menu-title text-xl">ENTER</div>
            <div className="text-5xl leading-none mt-2">🥬</div>
            <div className="text-[12px] mt-2 tracking-[0.18em] font-extrabold">STUDIO</div>
          </button>
          <p className="mt-5 text-[#2b5f43]/80 font-semibold">点击按钮进入项目创作页面</p>
        </div>

        <div className="poster-card mt-10 md:mt-14 rounded-[28px] border bg-[#f0ebdd] text-[#193d2c] overflow-hidden">
          <div className="relative p-8 md:p-10 min-h-[220px]">
            <div className="absolute left-8 top-8 w-28 h-28 bg-[#6da768] rounded-[42%_58%_51%_49%/62%_38%_62%_38%] opacity-90"></div>
            <div className="absolute right-10 bottom-8 w-20 h-40 bg-[#9fc79b] rounded-[56%_44%_62%_38%/28%_68%_32%_72%]"></div>
            <div className="relative z-10 mt-16 md:mt-20 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="menu-title text-3xl md:text-4xl tracking-tight">COMIAI GREENS</div>
                <div className="text-[#2b5f43]/85 text-sm mt-2 font-semibold">为创作而生 · 手绘绿意工作台</div>
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-[#6da768] font-bold">Made with Love</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [productionStep, setProductionStep] = useState(1);
  const [storyboardEntryMode, setStoryboardEntryMode] = useState<StoryboardMode>('image-video');
  const [currentProjectName, setCurrentProjectName] = useState('离婚后我成了顶流白月光');
  const [currentEpisodeName, setCurrentEpisodeName] = useState('第一集');

  const normalizeEpisodeName = (episodeName?: string) => {
    if (!episodeName) return '第一集';
    const match = episodeName.match(/^第(\d+)集$/);
    if (!match) return episodeName;
    const num = Number(match[1]);
    const map: Record<number, string> = {
      1: '第一集',
      2: '第二集',
      3: '第三集',
      4: '第四集',
      5: '第五集',
      6: '第六集',
      7: '第七集',
      8: '第八集',
      9: '第九集',
      10: '第十集',
    };
    return map[num] ?? episodeName;
  };

  return (
    <div className="lifely-theme flex flex-col h-screen bg-[#F8F3E8] text-slate-800 font-sans overflow-hidden text-sm relative">
      
      {/* Production Header (Only visible during actual production steps) */}
      {currentView === 'production' && (
        <header className="h-14 bg-[#193d2c] flex items-center justify-between px-6 shrink-0 shadow-lg z-50 border-b border-[#6da768]/60">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentView('management')}
              className="text-slate-400 hover:text-white transition-colors flex items-center justify-center p-1 rounded-full hover:bg-slate-700"
              title="返回分集管理"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="w-8 h-8 bg-[#6da768] rounded flex items-center justify-center text-[#193d2c] font-bold">C</div>
            <div className="text-xs text-slate-400">
              <span className="text-[#9fc79b]">{currentProjectName}</span> <span className="px-1">·</span> <span className="text-white">{currentEpisodeName}</span>
            </div>
          </div>

          <div className="flex bg-[#2b5f43] rounded-full p-1 text-[11px] font-bold">
            <button onClick={() => setProductionStep(1)} className={`px-4 py-1.5 rounded-full transition-all ${productionStep === 1 ? 'bg-[#d8ec6a] text-[#193d2c] shadow-sm' : 'text-[#d7ead6] hover:text-white'}`}>1.剧本与设定</button>
            <button onClick={() => setProductionStep(2)} className={`px-4 py-1.5 rounded-full transition-all ${productionStep === 2 ? 'bg-[#d8ec6a] text-[#193d2c] shadow-sm' : 'text-[#d7ead6] hover:text-white'}`}>2.分镜管理</button>
            <button onClick={() => setProductionStep(3)} className={`px-4 py-1.5 rounded-full transition-all ${productionStep === 3 ? 'bg-[#d8ec6a] text-[#193d2c] shadow-sm' : 'text-[#d7ead6] hover:text-white'}`}>3.分镜制作</button>
            <button onClick={() => setProductionStep(4)} className={`px-4 py-1.5 rounded-full transition-all ${productionStep === 4 ? 'bg-[#d8ec6a] text-[#193d2c] shadow-sm' : 'text-[#d7ead6] hover:text-white'}`}>4.视频预览</button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#163527] px-3 py-1.5 rounded-full text-xs text-[#d8ec6a] font-mono">
              🪙 24310
            </div>
            <div className="w-8 h-8 rounded-full bg-[#9fc79b] border border-[#6da768]"></div>
          </div>
        </header>
      )}

      {/* Page Content based on ViewState */}
      {currentView === 'home' && (
        <HomeLanding onEnterProjects={() => setCurrentView('projects')} />
      )}

      {currentView === 'projects' && (
        <ProjectManagement 
          onCreateProject={() => setCurrentView('upload')} 
          onEnterProject={() => {
            setCurrentProjectName('离婚后我成了顶流白月光');
            setCurrentView('management');
          }}
          onGoHome={() => setCurrentView('home')}
        />
      )}

      {currentView === 'management' && (
        <EpisodeManagement 
          projectName={currentProjectName}
          onProjectNameChange={setCurrentProjectName}
          onUpload={() => setCurrentView('upload')}
          onEnterEpisode={(episodeName) => {
            setCurrentEpisodeName(normalizeEpisodeName(episodeName));
            setProductionStep(1);
            setCurrentView('production');
          }} 
          onBack={() => setCurrentView('projects')}
          onGoHome={() => setCurrentView('home')}
          onGoScript={() => setCurrentView('upload')}
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
        <ScriptAndAssets
          onNext={(mode) => {
            setStoryboardEntryMode(mode);
            setProductionStep(2);
          }}
        />
      )}
      {currentView === 'production' && productionStep === 2 && (
        <StoryboardManagement
          initialMode={storyboardEntryMode}
          onNext={() => setProductionStep(3)}
        />
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
