import React, { useState } from 'react';
import { ChevronDown, Edit3, ArrowRight, ArrowLeft, X, Image as ImageIcon } from 'lucide-react';

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

export default function ScriptSplitView({ onCreateProject, onBack }: { onCreateProject: () => void, onBack: () => void }) {
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('默认');
  const [selectedOrientation, setSelectedOrientation] = useState<'16:9' | '9:16'>('16:9');
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
  const [isOrientationDropdownOpen, setIsOrientationDropdownOpen] = useState(false);

  const scriptContent = `第${selectedEpisode}集

【第一集】
1-1 日，外，街头
出场人物：李泰
△李泰站在人来人往的街头。
VO（李泰混响）：我重生了，回到了《领主时代》公测前一个月。
VO：这款现象级全息网游在上线前就火爆全球，可没人知道，登陆游戏后就永久无法退出，游戏中死亡也是真的死亡，而蓝星也不复存在！
【快切闪回画面】

△（快速、混乱的镜头）城市废墟中，无数狰狞的魔物从空间裂缝中涌出，发出震耳欲聋的咆哮，玩家们释放各类特效技能，与面目狰狞的魔物惨烈搏杀。
△天空被撕裂，巨大的骨龙喷吐着幽蓝色龙息，高楼大厦如积木般倒塌。
△一个面容沧桑、浑身是血的中年李泰，一人站在尸山血海之上，和魔神对峙。发出不甘的怒吼，最终被一道从天而降的魔光吞噬。
【快切闪回结束】

李泰OS：这不是游戏，是末日！
李泰OS：上一世，我只是C级天赋，即便拼尽全力，也敌不过魔神。而传说中，限量的钻石级游戏仓，保底都能开出S级天赋！
△李泰走到了游戏设备发售中心前。
李泰OS：这一次，我一定要抢占先机！
△他看了一眼手机，屏幕上显示着房产交易信息：【XX市中心别墅，已成功交易，当前余额：500万元】。

1-2 日，内，游戏设备发售中心
出场人物：李泰，服务员，陆霆，林倩，江雪，路人
△发售中心内人声鼎沸，巨大电子屏上，【钻石级游戏仓】的库存数字减少到【1】。
△排队的队伍，总算是轮到了李泰。
李泰：（急切）我要一台钻石游戏仓！
服务员：（职业微笑）好的先生，总价500万元。
△李泰刷卡支付，刷卡机报错：【余额不足】。
李泰：（愣住）怎么回事？我的卡里有500万才对！
服务员：先生，钻石仓的交易需要额外支付2%的税费和手续费，总共是507万9千6百元。您还差近8万元。
△这时，陆霆，林倩，江雪一同走了过来。
陆霆：（惊讶）哟呵，李泰？你也来买游戏仓？还是钻石仓？
△他身边的林倩也一脸不可思议地看着李泰。
林倩：什么？钻石仓？你哪来那么多钱？
李泰（平静）：我把房子卖了。`;

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
            <div 
              onClick={onBack}
              className="flex items-center px-6 py-1.5 text-slate-400 text-sm font-medium cursor-pointer hover:text-slate-300 transition-colors"
            >
              1.上传剧本
            </div>
            <div className="flex items-center px-6 py-1.5 bg-emerald-500 text-white rounded-full text-sm font-bold shadow-sm">
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

      {/* Main Area */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-6 overflow-hidden">
        
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-800">分集剧本</h1>
            <p className="text-sm text-slate-500 mt-1">确认您的剧本，并选择单集剧本进行视频创作</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 ml-auto flex-wrap justify-end">
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-2 py-1.5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 pl-1">风格:</span>
                <div className="relative">
                  <button
                    onClick={() => { setIsStyleDropdownOpen(!isStyleDropdownOpen); setIsOrientationDropdownOpen(false); }}
                    className="flex items-center justify-between w-40 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-white transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <img src={styles.find((style) => style.id === selectedStyle)?.image} alt={selectedStyle} className="w-5 h-5 rounded-md object-cover shrink-0" />
                      <span className="truncate">{selectedStyle}</span>
                    </div>
                    <ChevronDown size={14} className="text-slate-400 shrink-0 ml-1" />
                  </button>
                  {isStyleDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20 max-h-64 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                      {styles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => { setSelectedStyle(style.id); setIsStyleDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-3 ${selectedStyle === style.id ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <img src={style.image} alt={style.name} className="w-5 h-5 rounded object-cover shadow-sm" />
                          <span className="truncate">{style.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-px h-5 bg-slate-300"></div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">尺寸:</span>
                <div className="relative">
                  <button
                    onClick={() => { setIsOrientationDropdownOpen(!isOrientationDropdownOpen); setIsStyleDropdownOpen(false); }}
                    className="flex items-center justify-between w-40 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-white transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {selectedOrientation === '16:9' ? (
                        <div className="w-4 h-2.5 border-2 border-slate-500 rounded-[3px] shrink-0"></div>
                      ) : (
                        <div className="w-2.5 h-4 border-2 border-slate-500 rounded-[3px] shrink-0"></div>
                      )}
                      <span className="truncate">{selectedOrientation === '16:9' ? '16:9 (横屏)' : '9:16 (竖屏)'}</span>
                    </div>
                    <ChevronDown size={14} className="text-slate-400 shrink-0 ml-1" />
                  </button>
                  {isOrientationDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button
                        onClick={() => { setSelectedOrientation('16:9'); setIsOrientationDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-3 ${selectedOrientation === '16:9' ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        <div className={`w-4 h-2.5 border-2 rounded-[3px] ${selectedOrientation === '16:9' ? 'border-emerald-500' : 'border-slate-400'}`}></div>
                        <span>16:9 (横屏)</span>
                      </button>
                      <button
                        onClick={() => { setSelectedOrientation('9:16'); setIsOrientationDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-3 ${selectedOrientation === '9:16' ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        <div className={`w-2.5 h-4 border-2 rounded-[3px] ${selectedOrientation === '9:16' ? 'border-emerald-500' : 'border-slate-400'}`}></div>
                        <span>9:16 (竖屏)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button className="text-sm text-slate-600 hover:text-emerald-600 flex items-center gap-1.5 transition-colors">
              <Edit3 size={16} /> 手动编辑
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-32 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                第{selectedEpisode}集 <ChevronDown size={16} className="text-slate-400" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(ep => (
                    <button 
                      key={ep}
                      onClick={() => { setSelectedEpisode(ep); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedEpisode === ep ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      第{ep}集
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={onCreateProject}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
              创建漫剧项目 <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 overflow-y-auto custom-scrollbar relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-2xl"></div>
          
          <div className="max-w-3xl mx-auto whitespace-pre-wrap text-slate-700 leading-relaxed text-[15px] font-medium">
            {scriptContent}
          </div>
        </div>

      </div>
    </div>
  );
}
