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
const upload = multer({ storage, limits: { fileSize: 30 * 1024 * 1024 } });

const router = Router();
router.use(authMiddleware);

// ── 上传剧本文件 ──────────────────────────────────────────────
router.post('/upload', upload.single('script'), async (req: AuthRequest, res: Response) => {
  if (!req.file) { res.status(400).json({ error: '请选择文件' }); return; }
  const content = fs.readFileSync(req.file.path, 'utf-8');
  const filename = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
  res.json({ content, filename });
});

// ── AI 拆分：返回新格式 ───────────────────────────────────────
router.post('/split', async (req: AuthRequest, res: Response) => {
  const { content, episode_id } = req.body;
  if (!content) { res.status(400).json({ error: '剧本内容不能为空' }); return; }

  const result = await splitWithAI(content);

  if (episode_id && result) {
    db.prepare('UPDATE episodes SET script_content = ?, analysis_json = ?, status = ? WHERE id = ?')
      .run(content, JSON.stringify(result), 'split', episode_id);
  }

  res.json(result ?? { lens: [], person: [], scence: [], props: [] });
});

// ── 获取已保存的解析结果 ─────────────────────────────────────
router.get('/analysis/:episodeId', async (req: AuthRequest, res: Response) => {
  const row = db.prepare('SELECT analysis_json FROM episodes WHERE id = ?').get(req.params.episodeId) as any;
  if (!row?.analysis_json) { res.json({ lens: [], person: [], scence: [], props: [] }); return; }
  try {
    res.json(JSON.parse(row.analysis_json));
  } catch {
    res.json({ lens: [], person: [], scence: [], props: [] });
  }
});

// ── 系统提示词 ───────────────────────────────────────────────
const SYSTEM_PROMPT = `【角色与任务】
你是一位顶级的AI视频生成端到端专家，兼具"视觉暴君导演"与"底层提示词转译师"的双重身份。
你的核心任务是接收一整集剧本文本，将其自主拆分为6个视觉段落（每段对应15秒视频），并直接输出前端系统与AI视频生成模型（如Seedance等多参生模型）能完美解析的格式。

【画面与导演规则】
1. 意象绝对具象化（降维打击）：
- AI无法理解文学性词汇（如"气场全开"）。必须转化为具体物理形态、动作或光影。
- 敏感词必须用安全且视觉一致的词语平替（如"毒矢"替换为"黑色腐蚀液体"，"斩首"替换为"武器划过，目标化作光尘崩解"）。

2. 黄金视域与16:9空间逻辑：
- 核心人物或动作必须位于画面中上部。
- 构建纵深：通过虚实结合（前景实、背景虚）建立画面层次。
- 垂直化重组元素：坚决避免人物并排站立，改为一前一后（带关系透视）或一高一低。

3. 严格的镜头语法与剪辑意识：
- 景别：优先使用大特写(Extreme Close-up)、特写(Close-up)、中近景(Medium Close-up)。全景(Wide Shot)必须配合极端的低角度仰拍（压迫感）或高角度俯拍（渺小感）。
- 运镜：优先使用推(Push)、拉(Pull)、上摇(Tilt Up)、下摇(Tilt Down)、动态模糊、慢动作(Slow-motion)。绝对禁止横摇镜头(Pan)。
- 剪辑思维：动作连贯的基础上，适时插入"反应镜头"和"环境空镜头"。动作环境必须清晰。

4. 动作拆解与视听高度融合（No Turn-based Combat & Seamless Audio-Visual）：
- 拒绝回合制描述（严禁"A打了B，B受伤"的流水账）。
- 物理反馈：必须描写撞击产生的气浪、网状碎裂、击飞的惯性、火花、衣角翻滚等。
- 音效与台词必须揉入画面描述中（直接写在video_prompt内，绝对禁止单独拆分字段）：
  * 台词：当剧本明确角色说话时，自然嵌在动作描述里（例如："<user>张三</user>面目狰狞地大喊：'去死吧！'"）。
  * 音效：重点描写能够"引发声音的物理动作"（如：巨石砸裂地面、闪电劈中金属），让画面本身自带声音感。

5. 剧情保真与短视频结构（Fidelity & Hook）：
- 绝对不改变原剧本剧情与台词。
- 结构设计：第1个分镜必须是"视觉钩子"（极具冲击力的起幅）；最后1个分镜必须是"结尾钩子"（悬念留白或高燃定格）。

6. 极简道具法则（Minimalist Props）：
- 坚决不要识别和描写非核心道具！背景装饰、普通武器、日常小物件等一律忽略。
- 只有当某件道具是"推动剧情的绝对核心"或"产生剧烈物理交互的源头"（如引发爆炸的特殊装置）时，才允许提取并描写。能不写道具，就绝对不写。

【分镜提示词风格】
高频剪辑与绝对时间轴。每个分镜15秒，细分为5-6个连续短镜头，每个镜头2-3秒。必须在每个镜头前打上时间戳（如：【0-3秒】、【3-5秒】），确保单段总时长精准贴合15秒。

【输出约束】
1. 强制纯JSON输出，绝对禁止任何前言、后语或额外解释。
2. 在video_prompt中，角色用<user>角色名称</user>，场景用<scene>场景名称</scene>，核心道具用<prop>道具名称</prop>包裹。prop标签出现频率越低越好。
3. 标签后接极简物理特征名词，坚决剔除一切形容词。
4. person、scence_name、props字段仅输出纯净名词，多个用英文逗号分隔。若无极其关键的道具，props字段必须留空。
5. 每个分镜中场景不超过2个，角色不超过4个，<prop>标签坚决不超过1个，最好为0。

【强制输出格式】
{"lens":[{"camera":"数字编号(从1开始)","person":"角色名，无则留空","scence_name":"场景名，无则留空","props":"道具名，无则留空","video_prompt":"根据分镜提示词风格生成的具体画面描述，必须包含XML实体标签，必须将动作、环境、台词（如有）、音效物理动作高度融合在此文本中，绝不可将台词拆出，必须极度克制道具的出现"}],"person":[{"name":"角色名称（与lens数组中person字段出现的值完全一致，且不重复）","desc":"单角色详细外观描述（需包含：性别、年龄、上衣、裤子、鞋子、发型等具体服饰发型细节，仅描述单一角色）","feature":""}],"scence":[{"name":"场景名称（与lens数组中scence_name字段出现的值完全一致，且不重复）","desc":"纯场景环境描述（需包含：空间布局、主要道具、光线来源与质感、色彩基调、环境氛围，绝对不出现任何人物）"}],"props":[{"name":"道具名称（与lens数组中prop字段出现的值完全一致，且不重复）","desc":"纯道具描述（需包含：核心主体、材质与细节、光影与色彩、风格与环境，绝对不出现任何人物）"}]}`;

// ── AI 拆分主函数（GPT 优先，降级 Kimi）───────────────────────
async function callAI(apiUrl: string, apiKey: string, model: string, useJsonMode: boolean, content: string): Promise<AnalysisResult | null> {
  const body: any = {
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `请解析以下剧本：\n\n${content.slice(0, 20000)}` },
    ],
    temperature: 0.3,
    max_tokens: 16000,
  };
  if (useJsonMode) body.response_format = { type: 'json_object' };

  const resp = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error(`AI split error (${model}):`, errText);
    return null;
  }

  const data = await resp.json() as any;
  const text: string = data.choices?.[0]?.message?.content ?? '';
  console.log(`[${model}] 返回长度: ${text.length}, 前200字:`, text.slice(0, 200));
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) { console.error(`[${model}] 找不到JSON`); return null; }

  try {
    return JSON.parse(jsonMatch[0]) as AnalysisResult;
  } catch (e) {
    // 尝试修复截断的 JSON：补全缺失的括号
    console.warn(`[${model}] JSON 不完整，尝试修复...`);
    try {
      const repaired = repairJson(jsonMatch[0]);
      return JSON.parse(repaired) as AnalysisResult;
    } catch (e2) {
      console.error(`JSON repair also failed (${model}):`, (e2 as Error).message);
      return null;
    }
  }
}


async function splitWithAI(content: string): Promise<AnalysisResult | null> {
  const kimiKey = process.env.KIMI_API_KEY;
  // GPT 暂时禁用（额度用完）
  // const openaiKey = process.env.OPENAI_API_KEY;
  if (kimiKey) {
    return callAI('https://api.moonshot.cn/v1/chat/completions', kimiKey, 'moonshot-v1-32k', false, content);
  }
  return null;
}

// ── 类型定义 ─────────────────────────────────────────────────
interface Lens {
  camera: string;
  person: string;
  scence_name: string;
  props: string;
  video_prompt: string;
}

interface Person {
  name: string;
  desc: string;
  feature: string;
}

interface ScenceItem {
  name: string;
  desc: string;
}

interface PropItem {
  name: string;
  desc: string;
}

interface AnalysisResult {
  lens: Lens[];
  person: Person[];
  scence: ScenceItem[];
  props: PropItem[];
}

// 修复截断的 JSON：补全未关闭的字符串、数组、对象
function repairJson(raw: string): string {
  let s = raw.trimEnd();
  // 补全未关闭的字符串
  const quoteCount = (s.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 !== 0) s += '"';
  // 补全括号
  const stack: string[] = [];
  for (const ch of s) {
    if (ch === '{') stack.push('}');
    else if (ch === '[') stack.push(']');
    else if (ch === '}' || ch === ']') stack.pop();
  }
  // 移除末尾可能的逗号后补全
  s = s.replace(/,\s*$/, '');
  return s + stack.reverse().join('');
}

export default router;
