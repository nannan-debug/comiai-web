import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authMiddleware, AuthRequest } from '../middleware.js';
import db from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();
router.use(authMiddleware);

// 上传剧本文件
router.post('/upload', upload.single('script'), async (req: AuthRequest, res: Response) => {
  if (!req.file) { res.status(400).json({ error: '请选择文件' }); return; }

  const content = fs.readFileSync(req.file.path, 'utf-8');
  res.json({ content, filename: req.file.originalname });
});

// AI 拆分剧本为分镜场景
router.post('/split', async (req: AuthRequest, res: Response) => {
  const { content, episode_id } = req.body;
  if (!content) { res.status(400).json({ error: '剧本内容不能为空' }); return; }

  let scenes: Scene[];

  if (process.env.KIMI_API_KEY) {
    scenes = await splitWithKimi(content);
  } else {
    scenes = splitWithRules(content);
  }

  // 如果传入了分集 ID，保存到数据库
  if (episode_id) {
    db.prepare('UPDATE episodes SET script_content = ?, status = ? WHERE id = ?')
      .run(content, 'split', episode_id);

    db.prepare('DELETE FROM scenes WHERE episode_id = ?').run(episode_id);
    const insertScene = db.prepare(`
      INSERT INTO scenes (episode_id, scene_number, title, description, dialogue, image_prompt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const s of scenes) {
      insertScene.run(episode_id, s.scene_number, s.title, s.description, s.dialogue, s.image_prompt);
    }
  }

  res.json({ scenes });
});

interface Scene {
  scene_number: number;
  title: string;
  description: string;
  dialogue: string;
  image_prompt: string;
}

// 规则拆分（不需要 AI Key）
function splitWithRules(content: string): Scene[] {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  const scenes: Scene[] = [];
  let current: Partial<Scene> | null = null;
  let sceneNum = 0;

  const sceneMarkers = /^(第[零一二三四五六七八九十百\d]+[幕场镜景]|scene\s*\d+|【.+?】|\[.+?\]|镜头\d+)/i;
  const dialogueMarker = /^([^\s：:]{1,10})[：:]\s*(.+)/;

  for (const line of lines) {
    if (sceneMarkers.test(line)) {
      if (current && current.description) {
        current.image_prompt = buildImagePrompt(current as Scene);
        scenes.push(current as Scene);
      }
      sceneNum++;
      current = {
        scene_number: sceneNum,
        title: line,
        description: '',
        dialogue: '',
        image_prompt: '',
      };
    } else if (current) {
      const dialogueMatch = line.match(dialogueMarker);
      if (dialogueMatch) {
        current.dialogue = (current.dialogue ? current.dialogue + '\n' : '') + line;
      } else {
        current.description = (current.description ? current.description + ' ' : '') + line;
      }
    } else {
      // 还没遇到场景标记，先按段落分
      sceneNum++;
      current = {
        scene_number: sceneNum,
        title: `第${sceneNum}场`,
        description: line,
        dialogue: '',
        image_prompt: '',
      };
    }
  }

  if (current && (current.description || current.dialogue)) {
    current.image_prompt = buildImagePrompt(current as Scene);
    scenes.push(current as Scene);
  }

  // 如果没有明显分场，按段落分（每 200 字一镜）
  if (scenes.length <= 1 && content.length > 300) {
    return splitByParagraph(content);
  }

  return scenes;
}

function splitByParagraph(content: string): Scene[] {
  const paragraphs = content.split(/\n{2,}/).filter(p => p.trim().length > 20);
  return paragraphs.map((p, i) => {
    const trimmed = p.trim();
    return {
      scene_number: i + 1,
      title: `第${i + 1}场`,
      description: trimmed,
      dialogue: '',
      image_prompt: buildImagePrompt({ scene_number: i + 1, title: `第${i + 1}场`, description: trimmed, dialogue: '', image_prompt: '' }),
    };
  });
}

function buildImagePrompt(scene: Scene): string {
  const base = scene.description || scene.dialogue;
  return `漫画风格，${base.slice(0, 100)}，高质量，细腻画风`;
}

// Kimi AI 拆分（moonshot，兼容 OpenAI 格式）
async function splitWithKimi(content: string): Promise<Scene[]> {
  const systemPrompt = `你是专业的漫画分镜师。请将用户提供的剧本拆分为分镜场景列表。
每个场景必须包含：scene_number（编号）、title（标题）、description（场景环境描述）、dialogue（台词，无则留空）、image_prompt（中文图像生成提示词，包含人物外貌、场景、光线、氛围、漫画风格）。
只返回 JSON 数组，不要有任何其他文字。格式：
[{"scene_number":1,"title":"场景名","description":"场景描述","dialogue":"台词","image_prompt":"图像提示词"}]`;

  const resp = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.KIMI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'moonshot-v1-8k',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `剧本内容：\n${content.slice(0, 6000)}` },
      ],
      temperature: 0.3,
    }),
  });

  if (!resp.ok) {
    console.error('Kimi API error:', await resp.text());
    return splitWithRules(content);
  }

  const data = await resp.json() as any;
  const text: string = data.choices?.[0]?.message?.content ?? '';
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return splitWithRules(content);

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return splitWithRules(content);
  }
}

export default router;
