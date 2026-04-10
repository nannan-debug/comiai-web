// 手动实现 Volcengine HMAC-SHA256 签名（@volcengine/openapi SDK 签名有问题，直接手动实现）
import crypto from 'crypto';

const REGION = 'cn-north-1';
const SERVICE = 'cv';
const HOST = 'visual.volcengineapi.com';
const VERSION = '2022-08-31';

function hmac(key: Buffer | string, msg: string): Buffer {
  return crypto.createHmac('sha256', key).update(msg).digest();
}
function sha256hex(msg: string): string {
  return crypto.createHash('sha256').update(msg).digest('hex');
}

async function volcRequest(action: string, body: object): Promise<any> {
  const AK = process.env.VOLC_ACCESS_KEY!;
  const SK = process.env.VOLC_SECRET_KEY!; // 直接使用原始值，不解码

  const bodyStr = JSON.stringify(body);

  const now = new Date();
  const xdate = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '').replace('T', 'T').slice(0, 15) + 'Z';
  const ymd = xdate.substring(0, 8);

  const bodyHash = sha256hex(bodyStr);
  const queryStr = `Action=${action}&Version=${VERSION}`;
  const signedHeaders = 'content-type;host;x-date';
  const canonicalHeaders = `content-type:application/json\nhost:${HOST}\nx-date:${xdate}\n`;
  const canonicalRequest = `POST\n/\n${queryStr}\n${canonicalHeaders}\n${signedHeaders}\n${bodyHash}`;

  const credentialScope = `${ymd}/${REGION}/${SERVICE}/request`;
  const strToSign = `HMAC-SHA256\n${xdate}\n${credentialScope}\n${sha256hex(canonicalRequest)}`;

  const signingKey = hmac(hmac(hmac(hmac(SK, ymd), REGION), SERVICE), 'request');
  const signature = crypto.createHmac('sha256', signingKey).update(strToSign).digest('hex');

  const auth = `HMAC-SHA256 Credential=${AK}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const resp = await fetch(`https://${HOST}?${queryStr}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'host': HOST,
      'x-date': xdate,
      'authorization': auth,
    },
    body: bodyStr,
  });

  const result = await resp.json() as any;
  if (result?.ResponseMetadata?.Error) {
    const err = result.ResponseMetadata.Error;
    throw new Error(`[${err.Code}] ${err.Message}`);
  }
  return result;
}

// 即梦图片生成 - 提交任务
export async function submitImageTask(prompt: string, width = 1024, height = 1024): Promise<string> {
  const result = await volcRequest('CVSync2AsyncSubmitTask', {
    req_key: 'jimeng_high_aes_general_v21_L',
    prompt,
    width,
    height,
    use_sr: false,
  });

  const taskId = result?.data?.task_id;
  if (!taskId) throw new Error(`图片任务提交失败: ${JSON.stringify(result)}`);
  return taskId as string;
}

// 即梦视频生成 - 提交任务
export async function submitVideoTask(prompt: string, imageUrl?: string): Promise<string> {
  const body: Record<string, any> = imageUrl
    ? { req_key: 'jimeng_video_img2video_s2_0', prompt, image_url: imageUrl, duration: 5, fps: 24, width: 1280, height: 720 }
    : { req_key: 'jimeng_video_s2_0_hd', prompt, duration: 5, fps: 24, width: 1280, height: 720 };

  const result = await volcRequest('CVSync2AsyncSubmitTask', body);
  const taskId = result?.data?.task_id;
  if (!taskId) throw new Error(`视频任务提交失败: ${JSON.stringify(result)}`);
  return taskId as string;
}

// 查询任务结果
export async function queryTask(taskId: string, reqKey = 'jimeng_high_aes_general_v21_L'): Promise<{
  status: 'pending' | 'running' | 'done' | 'failed';
  imageUrls?: string[];
  videoUrl?: string;
}> {
  // req_key 必须与提交时一致
  const result = await volcRequest('CVSync2AsyncGetResult', { req_key: reqKey, task_id: taskId });
  const data = result?.data ?? {};

  // status: 0=排队 1=处理中 2=成功 3=失败
  const statusMap: Record<number, 'pending' | 'running' | 'done' | 'failed'> = {
    0: 'pending', 1: 'running', 2: 'done', 3: 'failed',
  };
  const status = statusMap[data.status as number] ?? 'pending';
  if (status !== 'done') return { status };

  const imageUrls: string[] = (data.image_urls ?? data.images ?? []).map((u: any) =>
    typeof u === 'string' ? u : (u.url ?? u.uri ?? '')
  ).filter(Boolean);

  const videoUrl: string | undefined = data.video_url ?? data.video?.url;
  return { status, imageUrls, videoUrl };
}
