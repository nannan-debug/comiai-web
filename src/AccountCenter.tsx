import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, Edit2, Check, X, Coins, ChevronRight, Sparkles } from 'lucide-react';
import { authApi } from './api';

interface Props {
  username: string;
  credits: number;
  onLogout: () => void;
  onCreditsChange: (newCredits: number) => void;
  onUsernameChange: (newUsername: string) => void;
}

const PACKAGES = [
  { id: 'p100',  credits: 100,  price: 10,  label: '100 积分',  badge: '' },
  { id: 'p500',  credits: 500,  price: 45,  label: '500 积分',  badge: '省¥5' },
  { id: 'p1000', credits: 1000, price: 80,  label: '1000 积分', badge: '省¥20' },
  { id: 'p3000', credits: 3000, price: 220, label: '3000 积分', badge: '省¥80' },
];

function getToken() { return localStorage.getItem('comiai_token') ?? ''; }

async function apiRequest(path: string, options: RequestInit = {}) {
  const resp = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
      ...(options.headers as any),
    },
  });
  return resp.json();
}

export default function AccountCenter({ username, credits, onLogout, onCreditsChange, onUsernameChange }: Props) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'menu' | 'profile' | 'purchase'>('menu');
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(username);
  const [nameError, setNameError] = useState('');
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [purchaseMsg, setPurchaseMsg] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  // 点外面关闭
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setView('menu');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const saveName = async () => {
    if (!newName.trim()) return;
    const res = await apiRequest('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ username: newName.trim() }),
    });
    if (res.error) { setNameError(res.error); return; }
    onUsernameChange(newName.trim());
    // 更新本地存储
    const stored = JSON.parse(localStorage.getItem('comiai_user') ?? '{}');
    localStorage.setItem('comiai_user', JSON.stringify({ ...stored, username: newName.trim() }));
    setEditingName(false);
    setNameError('');
  };

  const handlePurchase = async (pkgId: string) => {
    setPurchasing(pkgId);
    setPurchaseMsg('');
    const res = await apiRequest('/api/user/purchase', {
      method: 'POST',
      body: JSON.stringify({ package_id: pkgId }),
    });
    setPurchasing(null);
    if (res.error) { setPurchaseMsg('购买失败：' + res.error); return; }
    onCreditsChange(res.credits);
    const stored = JSON.parse(localStorage.getItem('comiai_user') ?? '{}');
    localStorage.setItem('comiai_user', JSON.stringify({ ...stored, credits: res.credits }));
    setPurchaseMsg(`成功充值 ${res.added} 积分！当前余额：${res.credits}`);
  };

  // 用户名首字母头像
  const initial = (username?.[0] ?? 'U').toUpperCase();

  return (
    <div ref={ref} className="relative">
      {/* 触发按钮 */}
      <button
        onClick={() => { setOpen(!open); setView('menu'); }}
        className="w-10 h-10 rounded-full bg-[#193d2c] flex items-center justify-center text-[#d8ec6a] font-bold text-sm border-2 border-[#6da768]/45 hover:border-[#6da768] transition-all"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-[#e0f0d8] z-[999] overflow-hidden">

          {/* 主菜单 */}
          {view === 'menu' && (
            <>
              {/* 用户信息头部 */}
              <div className="px-5 py-4 bg-[#f0f7ec] border-b border-[#c5e0b4]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#193d2c] flex items-center justify-center text-[#d8ec6a] font-bold text-lg">
                    {initial}
                  </div>
                  <div>
                    <div className="font-bold text-[#193d2c] text-sm">{username}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs text-[#6da768]">🪙</span>
                      <span className="text-xs font-mono font-bold text-[#2b5f43]">{credits.toLocaleString()} 积分</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 菜单项 */}
              <div className="py-1.5">
                <button
                  onClick={() => setView('profile')}
                  className="w-full px-5 py-3 flex items-center gap-3 text-sm text-[#193d2c] hover:bg-[#f5faee] transition-colors"
                >
                  <User size={16} className="text-[#6da768]" />
                  <span className="flex-1 text-left">账户设置</span>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
                <button
                  onClick={() => { setView('purchase'); setPurchaseMsg(''); }}
                  className="w-full px-5 py-3 flex items-center gap-3 text-sm text-[#193d2c] hover:bg-[#f5faee] transition-colors"
                >
                  <Sparkles size={16} className="text-[#6da768]" />
                  <span className="flex-1 text-left">充值积分</span>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
              </div>

              <div className="border-t border-[#e0f0d8] py-1.5">
                <button
                  onClick={onLogout}
                  className="w-full px-5 py-3 flex items-center gap-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  退出登录
                </button>
              </div>
            </>
          )}

          {/* 账户设置 */}
          {view === 'profile' && (
            <>
              <div className="px-5 py-3.5 border-b border-[#e0f0d8] flex items-center gap-2">
                <button onClick={() => setView('menu')} className="text-[#6da768] hover:text-[#193d2c] text-xs">← 返回</button>
                <span className="text-sm font-bold text-[#193d2c]">账户设置</span>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {/* 头像 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-[#193d2c] flex items-center justify-center text-[#d8ec6a] font-bold text-2xl">
                    {initial}
                  </div>
                  <span className="text-xs text-slate-400">头像暂不支持自定义</span>
                </div>

                {/* 用户名 */}
                <div>
                  <label className="text-xs font-semibold text-[#2b5f43] mb-1 block">用户名</label>
                  {editingName ? (
                    <div className="flex gap-2">
                      <input
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-[#6da768] rounded-xl focus:outline-none"
                        autoFocus
                        onKeyDown={e => e.key === 'Enter' && saveName()}
                      />
                      <button onClick={saveName} className="p-2 bg-[#193d2c] text-[#d8ec6a] rounded-xl hover:bg-[#2b5f43]"><Check size={14} /></button>
                      <button onClick={() => { setEditingName(false); setNewName(username); setNameError(''); }} className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200"><X size={14} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="flex-1 px-3 py-2 text-sm bg-[#f5faee] rounded-xl text-[#193d2c]">{username}</span>
                      <button onClick={() => setEditingName(true)} className="p-2 bg-[#f0f7ec] text-[#6da768] rounded-xl hover:bg-[#e0f0d8]"><Edit2 size={14} /></button>
                    </div>
                  )}
                  {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
                </div>

                {/* 积分信息 */}
                <div className="bg-[#f0f7ec] rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-[#2b5f43]">当前积分</span>
                  <span className="font-mono font-bold text-[#193d2c]">🪙 {credits.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => { setView('purchase'); setPurchaseMsg(''); }}
                  className="py-2.5 rounded-xl bg-[#193d2c] text-[#d8ec6a] font-bold text-sm hover:bg-[#2b5f43] transition-colors"
                >
                  充值积分
                </button>
              </div>
            </>
          )}

          {/* 充值积分 */}
          {view === 'purchase' && (
            <>
              <div className="px-5 py-3.5 border-b border-[#e0f0d8] flex items-center gap-2">
                <button onClick={() => setView('menu')} className="text-[#6da768] hover:text-[#193d2c] text-xs">← 返回</button>
                <span className="text-sm font-bold text-[#193d2c]">充值积分</span>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <p className="text-xs text-slate-400 text-center">10元 = 100积分，积分用于生成图片和视频</p>

                {PACKAGES.map(pkg => (
                  <button
                    key={pkg.id}
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={purchasing === pkg.id}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-[#c5e0b4] bg-[#f0f7ec] hover:border-[#6da768] hover:bg-[#e8f5e0] transition-all disabled:opacity-60"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#193d2c]">{pkg.label}</span>
                      {pkg.badge && (
                        <span className="text-[10px] bg-[#d8ec6a] text-[#193d2c] px-1.5 py-0.5 rounded-full font-bold">{pkg.badge}</span>
                      )}
                    </div>
                    <span className="font-bold text-[#2b5f43]">
                      {purchasing === pkg.id ? '处理中...' : `¥${pkg.price}`}
                    </span>
                  </button>
                ))}

                {purchaseMsg && (
                  <div className={`text-xs text-center px-3 py-2 rounded-lg ${purchaseMsg.startsWith('成功') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                    {purchaseMsg}
                  </div>
                )}

                <p className="text-[10px] text-slate-300 text-center">* 演示环境直接到账，正式上线将接入支付宝/微信支付</p>
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
}
