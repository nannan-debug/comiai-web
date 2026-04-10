import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware.js';
import db from '../db.js';

const router = Router();
router.use(authMiddleware);

// 获取当前用户信息
router.get('/me', (req: AuthRequest, res: Response) => {
  const user = db.prepare('SELECT id, username, credits, avatar, created_at FROM users WHERE id = ?').get(req.userId) as any;
  if (!user) { res.status(404).json({ error: '用户不存在' }); return; }
  res.json(user);
});

// 更新用户名
router.put('/profile', (req: AuthRequest, res: Response) => {
  const { username } = req.body;
  if (!username?.trim()) { res.status(400).json({ error: '用户名不能为空' }); return; }

  const exists = db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(username, req.userId);
  if (exists) { res.status(400).json({ error: '用户名已被使用' }); return; }

  db.prepare('UPDATE users SET username = ? WHERE id = ?').run(username.trim(), req.userId);
  res.json({ ok: true, username: username.trim() });
});

// 积分套餐
const PACKAGES = [
  { id: 'p100',  credits: 100,  price: 10,  label: '100 积分',  desc: '¥10' },
  { id: 'p500',  credits: 500,  price: 45,  label: '500 积分',  desc: '¥45，省¥5' },
  { id: 'p1000', credits: 1000, price: 80,  label: '1000 积分', desc: '¥80，省¥20' },
  { id: 'p3000', credits: 3000, price: 220, label: '3000 积分', desc: '¥220，省¥80' },
];

router.get('/packages', (_req, res) => {
  res.json(PACKAGES);
});

// 模拟购买积分（实际项目对接支付宝/微信支付）
router.post('/purchase', (req: AuthRequest, res: Response) => {
  const { package_id } = req.body;
  const pkg = PACKAGES.find(p => p.id === package_id);
  if (!pkg) { res.status(400).json({ error: '套餐不存在' }); return; }

  db.prepare('UPDATE users SET credits = credits + ? WHERE id = ?').run(pkg.credits, req.userId);
  const user = db.prepare('SELECT credits FROM users WHERE id = ?').get(req.userId) as any;

  res.json({ ok: true, credits: user.credits, added: pkg.credits });
});

export default router;
