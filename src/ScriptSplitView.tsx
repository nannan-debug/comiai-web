import React, { useState } from 'react';
import { ChevronDown, Edit3, ArrowRight, ArrowLeft, X, Image as ImageIcon } from 'lucide-react';

export default function ScriptSplitView({ onCreateProject, onBack }: { onCreateProject: () => void, onBack: () => void }) {
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    <div className="flex flex-col h-full bg-[#F8F3E8] overflow-hidden relative">
      <div className="pointer-events-none absolute right-8 top-24 h-28 w-28 rounded-[42%_58%_51%_49%/62%_38%_62%_38%] bg-[#d8ec6a]/45" />
      {/* Top Navigation Bar */}
      <header className="h-16 bg-[#f0ebdd] border-b border-[#6da768]/30 flex items-center justify-between px-6 shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-4 w-1/3">
          <button 
            onClick={onBack}
            className="text-[#2b5f43] hover:text-[#193d2c] transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={16} /> 返回项目列表
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center bg-[#193d2c] rounded-full p-1 shadow-inner border border-[#6da768]/60">
            <div 
              onClick={onBack}
              className="flex items-center px-6 py-1.5 text-[#d7ead6] text-sm font-medium cursor-pointer hover:text-white transition-colors"
            >
              1.上传剧本
            </div>
            <div className="flex items-center px-6 py-1.5 bg-[#d8ec6a] text-[#193d2c] rounded-full text-sm font-bold shadow-sm menu-title">
              2.剧本分集
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 w-1/3">
          <div className="flex items-center gap-2 bg-[#193d2c] px-3 py-1.5 rounded-full text-xs text-[#d8ec6a] font-mono border border-[#6da768]/60">
            🪙 24310
          </div>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-6 overflow-hidden relative z-10">
        
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-[#193d2c] menu-title">分集剧本</h1>
            <p className="text-sm text-[#2b5f43]/80 mt-1">确认您的剧本，并选择单集剧本进行视频创作</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 ml-auto">
            <button className="text-sm text-[#2b5f43] hover:text-[#193d2c] flex items-center gap-1.5 transition-colors">
              <Edit3 size={16} /> 手动编辑
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-32 bg-[#fbf8ef] border border-[#6da768]/40 rounded-lg px-4 py-2 text-sm font-medium text-[#2b5f43] hover:bg-[#f5f1e4] transition-colors shadow-sm"
              >
                第{selectedEpisode}集 <ChevronDown size={16} className="text-[#2b5f43]/70" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-full bg-[#fbf8ef] border border-[#6da768]/40 rounded-lg shadow-lg py-1 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(ep => (
                    <button 
                      key={ep}
                      onClick={() => { setSelectedEpisode(ep); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedEpisode === ep ? 'bg-[#e9f2df] text-[#2b5f43] font-bold' : 'text-[#2b5f43] hover:bg-[#f5f1e4]'}`}
                    >
                      第{ep}集
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={onCreateProject}
              className="px-5 py-2 bg-[#193d2c] hover:bg-[#2b5f43] text-[#f5f1e4] rounded-lg text-sm font-bold transition-all shadow-md flex items-center gap-2 active:scale-95 menu-title"
            >
              创建漫剧项目 <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-[#fbf8ef] rounded-2xl border-2 border-[#193d2c]/15 shadow-sm p-8 overflow-y-auto custom-scrollbar relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#6da768] rounded-l-2xl"></div>
          
          <div className="max-w-3xl mx-auto whitespace-pre-wrap text-[#2b5f43] leading-relaxed text-[15px] font-medium">
            {scriptContent}
          </div>
        </div>

      </div>
    </div>
  );
}
