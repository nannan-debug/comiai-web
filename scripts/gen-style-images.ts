/**
 * 批量调用即梦 API 生成风格展示图
 * 运行：npx tsx scripts/gen-style-images.ts
 */
import 'dotenv/config';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'style-images');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const REGION = 'cn-north-1';
const SERVICE = 'cv';
const HOST = 'visual.volcengineapi.com';
const VERSION = '2022-08-31';

const ACCESS_KEY = process.env.VOLC_ACCESS_KEY!;
const RAW_SK = process.env.VOLC_SECRET_KEY!;
// 火山引擎控制台 SK 双重 base64 编码，需解两次
function decodesk(sk: string): string {
  try {
    const once = Buffer.from(sk, 'base64').toString('utf-8');
    const twice = Buffer.from(once, 'base64').toString('utf-8');
    if (/^[0-9a-f]{32,64}$/i.test(twice)) return twice;
    if (/^[0-9a-f]{32,64}$/i.test(once)) return once;
    return sk;
  } catch { return sk; }
}
const SECRET_KEY = RAW_SK; // 直接使用原始值，不解码
console.log('使用 SK（前8位）:', SECRET_KEY.slice(0, 8) + '...');

function hmac(key: Buffer | string, msg: string): Buffer {
  return crypto.createHmac('sha256', key).update(msg, 'utf8').digest();
}
function hashStr(msg: string): string {
  return crypto.createHash('sha256').update(msg, 'utf8').digest('hex');
}

async function volcRequest(action: string, body: object): Promise<any> {
  const now = new Date();
  const xDate = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const dateStamp = xDate.slice(0, 8);
  const queryString = `Action=${action}&Version=${VERSION}`;
  const bodyStr = JSON.stringify(body);
  const payloadHash = hashStr(bodyStr);
  const canonicalHeaders = `content-type:application/json\nhost:${HOST}\nx-date:${xDate}\n`;
  const signedHeaders = 'content-type;host;x-date';
  const canonicalRequest = ['POST', '/', queryString, canonicalHeaders, signedHeaders, payloadHash].join('\n');
  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/request`;
  const stringToSign = ['HMAC-SHA256', xDate, credentialScope, hashStr(canonicalRequest)].join('\n');
  const kDate = hmac(SECRET_KEY, dateStamp);
  const kRegion = hmac(kDate, REGION);
  const kService = hmac(kRegion, SERVICE);
  const kSigning = hmac(kService, 'request');
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');
  const authorization = `HMAC-SHA256 Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const resp = await fetch(`https://${HOST}?${queryString}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Host': HOST, 'X-Date': xDate, 'Authorization': authorization },
    body: bodyStr,
  });
  return resp.json();
}

async function submitImageTask(prompt: string): Promise<string> {
  const result = await volcRequest('CVSync2AsyncSubmitTask', {
    req_key: 'jimeng_high_aes_general_v21_L',
    prompt,
    width: 512,
    height: 512,
    use_sr: false,
  });
  if (result?.ResponseMetadata?.Error) throw new Error(`提交失败: ${JSON.stringify(result.ResponseMetadata.Error)}`);
  const taskId = result?.data?.task_id;
  if (!taskId) throw new Error(`提交失败，无 task_id: ${JSON.stringify(result)}`);
  return taskId as string;
}

async function pollTask(taskId: string, maxWait = 120000): Promise<string> {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    await new Promise(r => setTimeout(r, 3000));
    const result = await volcRequest('CVSync2AsyncGetResult', { req_key: 'jimeng_high_aes_general_v21_L', task_id: taskId });
    if (result?.ResponseMetadata?.Error) throw new Error(`查询失败: ${JSON.stringify(result.ResponseMetadata.Error)}`);
    const { status, image_urls, images } = result.data ?? {};
    if (status === 2) {
      const urls = image_urls ?? images ?? [];
      const url = typeof urls[0] === 'string' ? urls[0] : urls[0]?.url ?? urls[0]?.uri;
      if (!url) throw new Error('结果中没有图片 URL');
      return url;
    }
    if (status === 3) throw new Error('任务失败');
    process.stdout.write('.');
  }
  throw new Error('超时');
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, resp => {
      if (resp.statusCode === 301 || resp.statusCode === 302) {
        https.get(resp.headers.location!, r => r.pipe(file));
      } else {
        resp.pipe(file);
      }
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

// 4 种风格及对应的生图 prompt
const STYLES = [
  { id: 'realistic', name: '写实',   prompt: '电影级写实风格漫画场景，都市街头，人物肖像，自然光影，高清细节，cinematic' },
  { id: 'ghibli',   name: '吉卜力', prompt: '宫崎骏吉卜力动画风格，温暖色调，绿色田园，可爱少女，手绘质感，studio ghibli' },
  { id: '3d',       name: '3D',     prompt: '三维CG渲染风格，写实3D人物场景，精细材质，电影级渲染，立体光影，4K画质' },
  { id: 'pixar',    name: '皮克斯', prompt: '皮克斯Pixar动画风格，3D卡通人物，圆润造型，丰富表情，明亮饱和色彩，温馨' },
];

async function main() {
  console.log(`开始生成 ${STYLES.length} 张风格图片（串行，每次一张）...\n`);

  for (const style of STYLES) {
    const filename = `${style.id}.jpg`;
    const dest = path.join(OUT_DIR, filename);
    if (fs.existsSync(dest)) {
      console.log(`⏭  [${style.name}] 已存在，跳过`);
      continue;
    }
    try {
      process.stdout.write(`📤 提交 [${style.name}]... `);
      const taskId = await submitImageTask(style.prompt);
      console.log(`taskId: ${taskId}`);

      process.stdout.write(`⏳ 等待结果 `);
      const imageUrl = await pollTask(taskId, 180000);
      console.log(` ✓`);

      await downloadFile(imageUrl, dest);
      console.log(`💾 已保存: public/style-images/${style.id}.jpg\n`);

      // 每张之间等 2 秒，避免并发限制
      await new Promise(r => setTimeout(r, 2000));
    } catch (e: any) {
      console.error(`\n✗ [${style.name}] 失败: ${e.message}\n`);
    }
  }

  console.log('\n✅ 全部完成！');
  const files = fs.existsSync(OUT_DIR) ? fs.readdirSync(OUT_DIR) : [];
  console.log(`生成了 ${files.length} 张图片：`);
  files.forEach(f => console.log(`  /style-images/${f}`));
}

main().catch(console.error);
