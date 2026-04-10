import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware.js';
import { submitImageTask, submitVideoTask, queryTask } from '../volcengine.js';
import db from '../db.js';

const router = Router();
router.use(authMiddleware);

// 为单个场景生成图片
router.post('/image', async (req: AuthRequest, res: Response) => {
  const { scene_id, prompt } = req.body;
  if (!scene_id || !prompt) { res.status(400).json({ error: '缺少参数' }); return; }

  try {
    const taskId = await submitImageTask(prompt);
    db.prepare('UPDATE scenes SET image_task_id = ?, status = ? WHERE id = ?')
      .run(taskId, 'generating_image', scene_id);
    res.json({ task_id: taskId });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 为单个场景生成视频
router.post('/video', async (req: AuthRequest, res: Response) => {
  const { scene_id, prompt, image_url } = req.body;
  if (!scene_id || !prompt) { res.status(400).json({ error: '缺少参数' }); return; }

  try {
    const taskId = await submitVideoTask(prompt, image_url);
    db.prepare('UPDATE scenes SET video_task_id = ?, status = ? WHERE id = ?')
      .run(taskId, 'generating_video', scene_id);
    res.json({ task_id: taskId });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 批量提交分集所有场景生成图片
router.post('/episode/:episodeId/batch-image', async (req: AuthRequest, res: Response) => {
  const scenes = db.prepare(
    'SELECT * FROM scenes WHERE episode_id = ? ORDER BY scene_number ASC'
  ).all(req.params.episodeId) as any[];

  if (!scenes.length) { res.status(404).json({ error: '没有场景数据，请先拆分剧本' }); return; }

  const results: Array<{ scene_id: number; task_id?: string; error?: string }> = [];

  for (const scene of scenes) {
    const prompt = scene.image_prompt || `漫画风格，${scene.description}，高质量`;
    try {
      const taskId = await submitImageTask(prompt);
      db.prepare('UPDATE scenes SET image_task_id = ?, status = ? WHERE id = ?')
        .run(taskId, 'generating_image', scene.id);
      results.push({ scene_id: scene.id, task_id: taskId });
    } catch (e: any) {
      results.push({ scene_id: scene.id, error: e.message });
    }
    // 避免触发频率限制
    await new Promise(r => setTimeout(r, 300));
  }

  res.json({ results });
});

// 查询任务状态并更新数据库
router.get('/task/:taskId', async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;
  const { scene_id, type } = req.query as { scene_id: string; type: 'image' | 'video' };

  try {
    const result = await queryTask(taskId);

    if (result.status === 'done' && scene_id) {
      if (type === 'image' && result.imageUrls?.[0]) {
        db.prepare('UPDATE scenes SET image_url = ?, status = ? WHERE id = ?')
          .run(result.imageUrls[0], 'image_done', scene_id);
      } else if (type === 'video' && result.videoUrl) {
        db.prepare('UPDATE scenes SET video_url = ?, status = ? WHERE id = ?')
          .run(result.videoUrl, 'video_done', scene_id);
      }
    }

    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
