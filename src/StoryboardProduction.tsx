import React, { useMemo, useState } from 'react';
import {
  Film,
  Image as ImageIcon,
  Upload,
  ChevronDown,
  Clock3,
  SlidersHorizontal,
  Sparkles,
  History,
  FileText,
  PlayCircle,
  Plus,
  Pencil,
  RefreshCw,
} from 'lucide-react';

type TaskType = 'image' | 'video';
type VideoMode = 'all-ref' | 'multi-image' | 'first-last' | 'single-image';

type ShotItem = {
  id: number;
  title: string;
  thumb?: string;
  draft?: boolean;
  mediaType?: 'video' | 'image';
};

type HistoryItem = {
  id: number;
  shotId: number;
  type: TaskType;
  createdAt: string;
  model: string;
  preview: string;
  prompt: string;
  params: string[];
};

type ShotFormState = {
  taskType: TaskType;
  videoMode: VideoMode;
  prompt: string;
  model: string;
  duration: string;
  resolution: string;
  ratio: string;
};

type ReferenceSlot = {
  label: string;
  type: 'asset' | 'upload' | 'frame';
  required?: boolean;
};

const SAMPLE_REFERENCE_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=480&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=480&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=480&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1511497584788-876760111969?w=480&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=480&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=480&auto=format&fit=crop&q=70',
];

const SHOTS: ShotItem[] = [
  {
    id: 1,
    title: '分镜1',
    mediaType: 'video',
    thumb:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=480&auto=format&fit=crop&q=70',
  },
  {
    id: 2,
    title: '分镜2',
    mediaType: 'image',
    thumb:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=480&auto=format&fit=crop&q=70',
  },
  {
    id: 3,
    title: '分镜3',
    mediaType: 'image',
    thumb:
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=480&auto=format&fit=crop&q=70',
  },
  {
    id: 4,
    title: '分镜4',
    mediaType: 'image',
    thumb:
      'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=480&auto=format&fit=crop&q=70',
  },
  {
    id: 5,
    title: '分镜5',
    draft: true,
  },
];

const HISTORY: HistoryItem[] = [
  {
    id: 101,
    shotId: 1,
    type: 'video',
    createdAt: '2026-04-01 15:09',
    model: 'Seedance2.0',
    preview:
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=960&auto=format&fit=crop&q=70',
    prompt: '夜色森林营地，圆形火焰在中心，俯拍缓慢推进，士兵围坐。',
    params: ['5s', '720p', '9:16', '多图生视频'],
  },
  {
    id: 102,
    shotId: 2,
    type: 'image',
    createdAt: '2026-04-01 14:36',
    model: 'Nano Banana Pro',
    preview:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=960&auto=format&fit=crop&q=70',
    prompt: '角色正面特写，冷暖对比光，背景虚化。',
    params: ['4张', '4:5', '电影质感'],
  },
  {
    id: 103,
    shotId: 3,
    type: 'video',
    createdAt: '2026-04-01 13:52',
    model: 'Vidu Q2Pro',
    preview:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=960&auto=format&fit=crop&q=70',
    prompt: '大远景，火堆周围人群轻微动作，镜头轻摇。',
    params: ['10s', '1080p', '16:9', '首尾帧'],
  },
];

function getReferenceTemplate(taskType: TaskType, videoMode: VideoMode): { title: string; cols: string; slots: ReferenceSlot[] } {
  if (taskType === 'image') {
    return {
      title: '参考内容（图生图）',
      cols: 'grid-cols-2',
      slots: [
        { label: '主参考图', type: 'frame', required: true },
        { label: '风格参考', type: 'asset' },
        { label: '角色参考', type: 'asset' },
        { label: '本地上传', type: 'upload' },
      ],
    };
  }

  if (videoMode === 'first-last') {
    return {
      title: '参考内容（首尾帧）',
      cols: 'grid-cols-2',
      slots: [
        { label: '首帧', type: 'frame', required: true },
        { label: '尾帧', type: 'frame', required: true },
        { label: '角色参考', type: 'asset' },
        { label: '本地上传', type: 'upload' },
      ],
    };
  }

  if (videoMode === 'single-image') {
    return {
      title: '参考内容（单图）',
      cols: 'grid-cols-2',
      slots: [
        { label: '单图输入', type: 'frame', required: true },
        { label: '角色参考', type: 'asset' },
        { label: '场景参考', type: 'asset' },
        { label: '本地上传', type: 'upload' },
      ],
    };
  }

  if (videoMode === 'all-ref') {
    return {
      title: '参考内容（上限9个）',
      cols: 'grid-cols-3',
      slots: [
        { label: '角色A', type: 'asset' },
        { label: '角色B', type: 'asset' },
        { label: '场景夜景', type: 'asset' },
        { label: '道具参考', type: 'asset' },
        { label: '氛围图', type: 'asset' },
        { label: '本地上传', type: 'upload' },
      ],
    };
  }

  return {
    title: '参考内容（多图）',
    cols: 'grid-cols-3',
    slots: [
      { label: '参考图1', type: 'frame', required: true },
      { label: '参考图2', type: 'frame' },
      { label: '参考图3', type: 'frame' },
      { label: '角色A', type: 'asset' },
      { label: '场景夜景', type: 'asset' },
      { label: '本地上传', type: 'upload' },
    ],
  };
}

export default function StoryboardProduction() {
  const [shots, setShots] = useState<ShotItem[]>(SHOTS);
  const [activeShotId, setActiveShotId] = useState(1);
  const [shotForms, setShotForms] = useState<Record<number, ShotFormState>>({
    1: {
      taskType: 'video',
      videoMode: 'all-ref',
      prompt: '夜色营地，圆形火焰位于中心，俯拍镜头缓慢推进，角色轮廓被火光照亮。',
      model: 'Seedance2.0',
      duration: '5s',
      resolution: '720p',
      ratio: '9:16',
    },
    2: {
      taskType: 'image',
      videoMode: 'single-image',
      prompt: '角色特写，人物面部受冷暖光交错照亮，背景轻微虚化。',
      model: 'Nano Banana Pro',
      duration: '5s',
      resolution: '720p',
      ratio: '9:16',
    },
    3: {
      taskType: 'video',
      videoMode: 'first-last',
      prompt: '森林河道全景，士兵围火堆，镜头缓慢平移。',
      model: 'Vidu Q2Pro',
      duration: '10s',
      resolution: '1080p',
      ratio: '16:9',
    },
  });

  const activeShot = useMemo(
    () => shots.find((item) => item.id === activeShotId) ?? shots[0],
    [activeShotId, shots]
  );

  const visibleHistory = useMemo(
    () => HISTORY.filter((item) => item.shotId === activeShotId),
    [activeShotId]
  );

  const defaultForm: ShotFormState = {
    taskType: 'video',
    videoMode: 'all-ref',
    prompt: '请描述当前分镜的画面、镜头运动、角色动作和氛围光影。',
    model: 'Seedance2.0',
    duration: '5s',
    resolution: '720p',
    ratio: '9:16',
  };

  const activeForm = shotForms[activeShotId] ?? defaultForm;
  const referenceTemplate = getReferenceTemplate(activeForm.taskType, activeForm.videoMode);
  const imageRatioOptions = ['智能', '21:9', '16:9', '3:2', '4:3', '1:1', '3:4', '2:3', '9:16'];
  const videoRatioOptions = ['9:16', '16:9', '1:1', '4:5'];
  const imageResolutionOptions = ['1K', '2K', '4K'];
  const videoResolutionOptions = ['720p', '1080p', '4K'];

  const updateActiveForm = (patch: Partial<ShotFormState>) => {
    setShotForms((prev) => ({
      ...prev,
      [activeShotId]: {
        ...(prev[activeShotId] ?? defaultForm),
        ...patch,
      },
    }));
  };

  const addNewShot = () => {
    const nextIndex = shots.length + 1;
    const nextShot: ShotItem = {
      id: Date.now(),
      title: `分镜${nextIndex}`,
      draft: true,
    };
    setShots((prev) => [...prev, nextShot]);
    setShotForms((prev) => ({
      ...prev,
      [nextShot.id]: defaultForm,
    }));
    setActiveShotId(nextShot.id);
  };

  return (
    <div className="stage-shell flex-1 overflow-hidden p-3 pb-0">
      <div className="h-full flex gap-3 overflow-hidden">
        {/* 左：分镜快速定位 */}
        <aside className="stage-pane w-[180px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col shrink-0">
          <div className="h-14 px-4 border-b border-slate-100 bg-slate-50/60 flex items-center">
            <div className="text-sm font-bold text-slate-800">分镜({shots.length})</div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {shots.map((shot, index) => {
              const active = shot.id === activeShotId;
              return (
                <button
                  key={shot.id}
                  onClick={() => setActiveShotId(shot.id)}
                  className={`w-full text-left rounded-2xl border-2 transition-all overflow-hidden ${
                    active
                      ? 'border-[#2b5f43] bg-[#f5faee] shadow-[0_0_0_2px_rgba(109,167,104,0.35)]'
                      : 'border-slate-200 bg-white hover:border-[#9fc79b]'
                  }`}
                >
                  <div className="relative h-44 rounded-[14px] overflow-hidden bg-black">
                    <div className="absolute left-2 top-2 min-w-6 h-6 rounded-full bg-black/85 text-white text-xs font-bold flex items-center justify-center px-1.5 z-20">
                      {index + 1}
                    </div>
                    {shot.draft && (
                      <div className="absolute right-2 top-2 h-6 rounded-full bg-slate-700/95 text-white text-[10px] font-bold px-2 flex items-center z-20">
                        未定稿
                      </div>
                    )}
                    {!shot.draft && (
                      <div className="absolute right-2 top-2 h-7 w-7 rounded-lg bg-white/95 border border-slate-200 text-[#2b5f43] flex items-center justify-center z-20">
                        {shot.mediaType === 'video' ? <PlayCircle className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                      </div>
                    )}
                    {shot.thumb ? (
                      <div
                        className="h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${shot.thumb})` }}
                      />
                    ) : (
                      <div className="h-full bg-slate-100 flex items-center justify-center">
                        <ImageIcon className="w-7 h-7 text-slate-400" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
            <button
              onClick={addNewShot}
              className="w-full h-20 rounded-xl border border-slate-200 bg-[#f1f4f2] hover:bg-[#e9f2df] text-slate-600 hover:text-[#2b5f43] transition-colors flex flex-col items-center justify-center gap-1"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs font-bold">添加分镜</span>
            </button>
          </div>
        </aside>

        {/* 中：提交任务面板 */}
        <section className="stage-pane w-[360px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col shrink-0">
          <div className="h-14 px-4 border-b border-slate-100 bg-slate-50/60 flex items-center">
            <div className="w-full max-w-[220px] grid grid-cols-2 gap-2">
              <button
                onClick={() => updateActiveForm({ taskType: 'image' })}
                className={`h-8 rounded-lg text-sm font-bold transition-colors ${
                  activeForm.taskType === 'image'
                    ? 'bg-[#2b5f43] text-white'
                    : 'bg-transparent text-slate-500 hover:text-[#2b5f43]'
                }`}
              >
                图片
              </button>
              <button
                onClick={() => updateActiveForm({ taskType: 'video' })}
                className={`h-8 rounded-lg text-sm font-bold transition-colors ${
                  activeForm.taskType === 'video'
                    ? 'bg-[#2b5f43] text-white'
                    : 'bg-transparent text-slate-500 hover:text-[#2b5f43]'
                }`}
              >
                视频
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeForm.taskType === 'video' && (
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                {[
                  { id: 'all-ref', label: '全能参考' },
                  { id: 'first-last', label: '首尾帧' },
                  { id: 'single-image', label: '单图声视频' },
                ].map((item) => {
                  const active = activeForm.videoMode === (item.id as VideoMode);
                  return (
                    <button
                      key={item.id}
                      onClick={() => updateActiveForm({ videoMode: item.id as VideoMode })}
                      className={`h-8 px-3 rounded-md text-sm font-bold transition-colors ${
                        active
                          ? 'bg-[#eef5e9] text-[#2b5f43]'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}

            <div>
              <div className="text-xs font-bold text-slate-700 mb-2">{referenceTemplate.title}</div>
              <div className={`grid ${referenceTemplate.cols} gap-2`}>
                {referenceTemplate.slots.map((slot, index) => {
                  if (slot.type === 'upload') {
                    return (
                      <button key={slot.label} className="h-16 rounded-lg border-2 border-dashed border-slate-300 bg-white text-slate-400 hover:text-[#2b5f43] hover:border-[#6da768] transition-colors flex flex-col items-center justify-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{slot.label}</span>
                      </button>
                    );
                  }

                  if (slot.type === 'frame') {
                    return (
                      <div key={slot.label} className="h-16 rounded-lg border border-slate-200 bg-slate-50 relative overflow-hidden">
                        <img
                          src={SAMPLE_REFERENCE_IMAGES[index % SAMPLE_REFERENCE_IMAGES.length]}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className="absolute left-1.5 bottom-1 text-[10px] font-bold text-white">{slot.label}</span>
                        {slot.required && <span className="absolute right-1.5 top-1.5 text-[9px] px-1 py-0.5 rounded bg-white/85 text-[#2b5f43]">必填</span>}
                      </div>
                    );
                  }

                  return (
                    <div key={slot.label} className="h-16 rounded-lg border border-slate-200 bg-slate-50 relative overflow-hidden">
                      <img
                        src={SAMPLE_REFERENCE_IMAGES[index % SAMPLE_REFERENCE_IMAGES.length]}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute left-1.5 bottom-1 text-[10px] font-bold text-white">{slot.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700 mb-2">{activeForm.taskType === 'video' ? '视频提示词' : '画面提示词'}</div>
              <textarea
                value={activeForm.prompt}
                onChange={(e) => updateActiveForm({ prompt: e.target.value })}
                className="w-full min-h-[140px] resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 outline-none focus:bg-white focus:border-[#6da768]"
              />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">模型参数</div>
              <div className={`grid gap-2 ${activeForm.taskType === 'image' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <SelectField value={activeForm.model} onChange={(next) => updateActiveForm({ model: next })} options={['Seedance2.0', 'Vidu Q2Pro', 'Sora2', 'Nano Banana Pro']} />
                {activeForm.taskType === 'video' && (
                  <SelectField value={activeForm.duration} onChange={(next) => updateActiveForm({ duration: next })} options={['5s', '10s', '15s']} icon={<Clock3 className="w-3.5 h-3.5 text-slate-400" />} />
                )}
                <SelectField value={activeForm.ratio} onChange={(next) => updateActiveForm({ ratio: next })} options={activeForm.taskType === 'image' ? imageRatioOptions : videoRatioOptions} icon={<Film className="w-3.5 h-3.5 text-slate-400" />} />
                <SelectField value={activeForm.resolution} onChange={(next) => updateActiveForm({ resolution: next })} options={activeForm.taskType === 'image' ? imageResolutionOptions : videoResolutionOptions} icon={<SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />} />
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <button className="w-full rounded-xl py-2.5 bg-[#193d2c] hover:bg-[#2b5f43] text-[#f5f1e4] text-sm font-bold flex items-center justify-center gap-2 transition-colors">
              <Sparkles className="w-4 h-4 text-[#d8ec6a]" />
              {activeForm.taskType === 'video' ? '提交生视频任务' : '提交生图任务'}
            </button>
          </div>
        </section>

        {/* 右：历史记录 */}
        <section className="stage-pane flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-w-0">
          <div className="h-14 px-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <History className="w-4 h-4 text-[#6da768]" /> 历史记录
            </div>
            <div className="text-xs text-slate-500">{activeShot.title}</div>
          </div>

          <div className="h-full overflow-y-auto p-5 space-y-4">
            {visibleHistory.length === 0 && (
              <div className="h-[320px] rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                <PlayCircle className="w-8 h-8 mb-2" />
                <div className="text-sm font-bold">暂无历史记录</div>
                <div className="text-xs mt-1">提交任务后会在这里展示生成内容和参数</div>
              </div>
            )}

            {visibleHistory.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    {shots
                      .filter((s) => !!s.thumb)
                      .slice(0, 4)
                      .map((s) => (
                        <img
                          key={`${item.id}-${s.id}`}
                          src={s.thumb}
                          className="w-8 h-8 rounded-md object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-slate-700 leading-relaxed line-clamp-2">
                      {item.prompt}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                      <span>{item.model}</span>
                      <span>|</span>
                      <span>{item.params[0] ?? '--'}</span>
                      <span>|</span>
                      <span>{item.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={item.preview} className="w-full h-[320px] object-cover" referrerPolicy="no-referrer" />
                </div>

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <button className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold text-[13px] hover:bg-slate-50 inline-flex items-center gap-1.5">
                    <Pencil className="w-3.5 h-3.5" /> 重新编辑
                  </button>
                  <button className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold text-[13px] hover:bg-slate-50 inline-flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5" /> 再次生成
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
  icon,
}: {
  value: string;
  onChange: (next: string) => void;
  options: string[];
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {icon && <span className="absolute left-2.5 top-1/2 -translate-y-1/2">{icon}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 py-2 pr-8 outline-none focus:border-[#6da768] ${
          icon ? 'pl-8' : 'pl-3'
        }`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}
