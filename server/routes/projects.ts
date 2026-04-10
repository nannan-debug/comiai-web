import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware.js';
import db from '../db.js';

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

// 获取分集的分镜列表
router.get('/:projectId/episodes/:episodeId/scenes', (req: AuthRequest, res: Response) => {
  const project = db.prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?').get(req.params.projectId, req.userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const scenes = db.prepare(
    'SELECT * FROM scenes WHERE episode_id = ? ORDER BY scene_number ASC'
  ).all(req.params.episodeId);
  res.json(scenes);
});

export default router;
