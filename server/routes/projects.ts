import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware.js';
import db from '../db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname2 = path.dirname(fileURLToPath(import.meta.url));
const ASSET_UPLOAD_DIR = path.join(__dirname2, '..', '..', 'uploads', 'assets');
if (!fs.existsSync(ASSET_UPLOAD_DIR)) fs.mkdirSync(ASSET_UPLOAD_DIR, { recursive: true });

const assetStorage = multer.diskStorage({
  destination: ASSET_UPLOAD_DIR,
  filename: (_, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});
const assetUpload = multer({ storage: assetStorage, limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();
router.use(authMiddleware);

// 获取项目列表
router.get('/', (req: AuthRequest, res: Response) => {
  const projects = db.prepare(`
    SELECT p.*, COUNT(e.id) as episode_count
    FROM projects p
    LEFT JOIN episodes e ON e.project_id = p.id
    WHERE p.user_id = ?
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `).all(req.userId);
  res.json(projects);
});

// 创建项目
router.post('/', (req: AuthRequest, res: Response) => {
  const { name, description } = req.body;
  if (!name) { res.status(400).json({ error: '项目名称不能为空' }); return; }

  const result = db.prepare(
    'INSERT INTO projects (user_id, name, description) VALUES (?, ?, ?)'
  ).run(req.userId, name, description ?? '');

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
  res.json(project);
});

// 删除项目
router.delete('/:id', (req: AuthRequest, res: Response) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ---- 分集 ----

// 获取分集列表
router.get('/:projectId/episodes', (req: AuthRequest, res: Response) => {
  const project = db.prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?').get(req.params.projectId, req.userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const episodes = db.prepare(`
    SELECT e.*, COUNT(s.id) as scene_count
    FROM episodes e
    LEFT JOIN scenes s ON s.episode_id = e.id
    WHERE e.project_id = ?
    GROUP BY e.id
    ORDER BY e.created_at ASC
  `).all(req.params.projectId);
  res.json(episodes);
});

// 创建分集
router.post('/:projectId/episodes', (req: AuthRequest, res: Response) => {
  const project = db.prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?').get(req.params.projectId, req.userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const { name, script_content } = req.body;
  if (!name) { res.status(400).json({ error: '分集名称不能为空' }); return; }

  const result = db.prepare(
    'INSERT INTO episodes (project_id, name, script_content) VALUES (?, ?, ?)'
  ).run(req.params.projectId, name, script_content ?? '');

  const episode = db.prepare('SELECT * FROM episodes WHERE id = ?').get(result.lastInsertRowid);
  res.json(episode);
});

// 删除分集
router.delete('/:projectId/episodes/:episodeId', (req: AuthRequest, res: Response) => {
  const project = db.prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?').get(req.params.projectId, req.userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const episode = db.prepare('SELECT id FROM episodes WHERE id = ? AND project_id = ?').get(req.params.episodeId, req.params.projectId);
  if (!episode) { res.status(404).json({ error: '分集不存在' }); return; }

  db.prepare('DELETE FROM scenes WHERE episode_id = ?').run(req.params.episodeId);
  db.prepare('DELETE FROM episodes WHERE id = ?').run(req.params.episodeId);
  res.json({ ok: true });
});

// 获取分集的分镜列表
router.get('/:projectId/episodes/:episodeId/scenes', (req: AuthRequest, res: Response) => {
  const project = db.prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?').get(req.params.projectId, req.userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const scenes = db.prepare(
    'SELECT * FROM scenes WHERE episode_id = ? ORDER BY scene_number ASC'
  ).all(req.params.episodeId);
  res.json(scenes);
});

// ---- 项目资产 ----

// 获取项目资产列表
router.get('/:projectId/assets', (req: AuthRequest, res: Response) => {
  const project = db.prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?').get(req.params.projectId, req.userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }
  const { category } = req.query;
  const assets = category
    ? db.prepare('SELECT * FROM project_assets WHERE project_id = ? AND category = ? ORDER BY created_at ASC').all(req.params.projectId, category)
    : db.prepare('SELECT * FROM project_assets WHERE project_id = ? ORDER BY created_at ASC').all(req.params.projectId);
  res.json(assets);
});

// 创建资产（含图片上传）
router.post('/:projectId/assets', assetUpload.single('image'), (req: AuthRequest, res: Response) => {
  const project = db.prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?').get(req.params.projectId, req.userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }
  const { name, category, description } = req.body;
  if (!name || !category) { res.status(400).json({ error: '名称和分类不能为空' }); return; }
  const image_url = req.file ? `/uploads/assets/${req.file.filename}` : '';
  const result = db.prepare(
    'INSERT INTO project_assets (project_id, category, name, image_url, description) VALUES (?, ?, ?, ?, ?)'
  ).run(req.params.projectId, category, name, image_url, description ?? '');
  const asset = db.prepare('SELECT * FROM project_assets WHERE id = ?').get(result.lastInsertRowid);
  res.json(asset);
});

// 删除资产
router.delete('/:projectId/assets/:assetId', (req: AuthRequest, res: Response) => {
  const project = db.prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?').get(req.params.projectId, req.userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }
  const asset = db.prepare('SELECT * FROM project_assets WHERE id = ? AND project_id = ?').get(req.params.assetId, req.params.projectId) as any;
  if (!asset) { res.status(404).json({ error: '资产不存在' }); return; }
  if (asset.image_url) {
    const filePath = path.join(__dirname2, '..', '..', asset.image_url);
    try { fs.unlinkSync(filePath); } catch {}
  }
  db.prepare('DELETE FROM project_assets WHERE id = ?').run(req.params.assetId);
  res.json({ ok: true });
});

export default router;
