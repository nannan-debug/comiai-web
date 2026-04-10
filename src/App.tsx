import React, { useState, useEffect } from 'react';
import StoryboardProduction from './StoryboardProduction';
import VideoPreview from './VideoPreview';
import ScriptAndAssets from './ScriptAndAssets';
import StoryboardManagement from './StoryboardManagement';
import ScriptUpload from './ScriptUpload';
import EpisodeManagement from './EpisodeManagement';
import ScriptSplitView from './ScriptSplitView';
import ProjectManagement from './ProjectManagement';
import Login from './Login';
import { ArrowLeft, LogOut } from 'lucide-react';

type ViewState = 'home' | 'projects' | 'management' | 'upload' | 'split' | 'production';
type StoryboardMode = 'image-video' | 'direct-video';

function HomeLanding({ onEnterProjects }: { onEnterProjects: () => void }) {
  return (
    <div className="flex-1 px-6 py-10 md:px-10 md:py-14 overflow-y-auto">
      <div className="max-w-6xl mx-auto min-h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#193d2c] rounded-xl flex items-center justify-center text-[#d8ec6a] font-bold text-lg">C</div>
            <span className="text-[#193d2c] font-bold text-2xl tracking-tight">Comiai</span>
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-[#193d2c] text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              剧本变漫剧
            </h1>
            <p className="text-[#6da768] text-xl md:text-2xl font-semibold mt-2">AI 一键生成</p>
          </div>

          {/* Sub */}
          <p className="text-[#2b5f43]/70 text-sm max-w-sm">
            上传剧本，AI 自动拆分场景、生成分镜图像与视频，轻松产出高质量漫剧内容
          </p>

          {/* CTA */}
          <button
            type="button"
            onClick={onEnterProjects}
            className="mt-2 px-10 py-4 rounded-2xl bg-[#193d2c] text-[#d8ec6a] font-bold text-base tracking-wide shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 hover:bg-[#2b5f43]"
          >
            开始创作
          </button>
        </div>

        {/* Feature hints */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '📄', label: '上传剧本', desc: '支持 TXT / 文档格式' },
            { icon: '✂️', label: 'AI 拆分场景', desc: '智能解析剧情结构' },
            { icon: '🎬', label: '生成漫剧', desc: '图像 + 视频一键输出' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-[#f0f7ec] border border-[#c5e0b4] p-4">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-[#193d2c] font-semibold text-sm">{item.label}</div>
              <div className="text-[#2b5f43]/60 text-xs mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<{ username: string; credits: number } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('comiai_user');
    const token = localStorage.getItem('comiai_token');
    if (stored && token) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const handleLogin = (username: string, credits: number) => {
    setUser({ username, credits });
  };

  const handleLogout = () => {
    localStorage.removeItem('comiai_token');
    localStorage.removeItem('comiai_user');
    setUser(null);
  };

  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [productionStep, setProductionStep] = useState(1);
  const [storyboardEntryMode, setStoryboardEntryMode] = useState<StoryboardMode>('image-video');
  const [currentProjectName, setCurrentProjectName] = useState('离婚后我成了顶流白月光');
  const [currentEpisodeName, setCurrentEpisodeName] = useState('第一集');

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

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
              🪙 {user.credits.toLocaleString()}
            </div>
            <span className="text-xs text-[#9fc79b]">{user.username}</span>
            <button onClick={handleLogout} title="退出登录" className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700">
              <LogOut size={15} />
            </button>
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
          username={user.username}
          credits={user.credits}
          onLogout={handleLogout}
          onCreditsChange={(n) => setUser(u => u ? { ...u, credits: n } : u)}
          onUsernameChange={(n) => setUser(u => u ? { ...u, username: n } : u)}
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
          username={user.username}
          credits={user.credits}
          onLogout={handleLogout}
          onCreditsChange={(n) => setUser(u => u ? { ...u, credits: n } : u)}
          onUsernameChange={(n) => setUser(u => u ? { ...u, username: n } : u)}
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
