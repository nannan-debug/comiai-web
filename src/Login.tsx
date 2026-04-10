import React, { useState } from 'react';
import { authApi } from './api';

interface Props {
  onLogin: (username: string, credits: number) => void;
}

export default function Login({ onLogin }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fn = mode === 'login' ? authApi.login : authApi.register;
      const res = await fn(username, password);
      localStorage.setItem('comiai_token', res.token);
      localStorage.setItem('comiai_user', JSON.stringify({ username: res.username, credits: res.credits }));
      onLogin(res.username, res.credits);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F3E8] items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 border border-[#c5e0b4]">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 bg-[#193d2c] rounded-xl flex items-center justify-center text-[#d8ec6a] font-bold text-lg">C</div>
          <span className="text-[#193d2c] font-bold text-xl tracking-tight">Comiai</span>
        </div>

        <h2 className="text-[#193d2c] font-bold text-lg mb-6 text-center">
          {mode === 'login' ? '登录账号' : '注册账号'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-[#2b5f43] font-semibold mb-1 block">用户名</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#c5e0b4] bg-[#f0f7ec] text-[#193d2c] text-sm focus:outline-none focus:border-[#6da768]"
            />
          </div>
          <div>
            <label className="text-xs text-[#2b5f43] font-semibold mb-1 block">密码</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#c5e0b4] bg-[#f0f7ec] text-[#193d2c] text-sm focus:outline-none focus:border-[#6da768]"
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs text-center bg-red-50 rounded-lg px-3 py-2">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 rounded-2xl bg-[#193d2c] text-[#d8ec6a] font-bold text-sm tracking-wide shadow transition-all hover:bg-[#2b5f43] disabled:opacity-60"
          >
            {loading ? '请稍候...' : mode === 'login' ? '登录' : '注册'}
          </button>
        </form>

        <p className="text-center text-xs text-[#2b5f43]/60 mt-6">
          {mode === 'login' ? '没有账号？' : '已有账号？'}
          <button
            type="button"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="text-[#193d2c] font-semibold underline ml-1"
          >
            {mode === 'login' ? '立即注册' : '去登录'}
          </button>
        </p>
      </div>
    </div>
  );
}
