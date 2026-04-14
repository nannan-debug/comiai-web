# ComiAI 项目交接文档（给新对话的 Claude 看）

---

## 第一步：先读这个文件，再动手

你好！这是一个 AI 漫画/剧本生产平台。用户希望继续开发。请先完整阅读本文件。

---

## 项目位置
```
本地路径：/Users/newblue/Projects/comiai-web-v2.0.1
服务器：ubuntu@82.157.197.163  /opt/comiai
SSH密码：.EQtB48eZXsa5=n-
```

## 本地启动（两个终端）
```bash
# 终端1：后端
cd /Users/newblue/Projects/comiai-web-v2.0.1
npm run server    # 运行在 http://localhost:3001

# 终端2：前端
cd /Users/newblue/Projects/comiai-web-v2.0.1
npm run dev       # 运行在 http://localhost:5173
```

## 部署到服务器
```bash
cd /Users/newblue/Projects/comiai-web-v2.0.1
npm run build
sshpass -p '.EQtB48eZXsa5=n-' rsync -avz \
  --exclude 'node_modules' --exclude '.env' --exclude 'comiai.db*' --exclude 'uploads' --exclude '.git' \
  -e "ssh -o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no" \
  ./ ubuntu@82.157.197.163:/opt/comiai/
sshpass -p '.EQtB48eZXsa5=n-' ssh -o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no ubuntu@82.157.197.163 \
  "cd /opt/comiai && npm install --production && pm2 restart comiai"
```

## 线上地址
http://82.157.197.163

---

## 关键凭证（.env 已配置好）

凭证保存在服务器 `/opt/comiai/.env` 和本地 `.env` 文件中，不提交到代码库。

```
VOLC_ACCESS_KEY=<见 .env>
VOLC_SECRET_KEY=<见 .env>
KIMI_API_KEY=<见 .env>
JWT_SECRET=<见 .env>
SERVER_PORT=3001
```

**重要：** VOLC_SECRET_KEY 直接使用原始值（不做任何 Base64 解码），签名方式见 server/volcengine.ts

---

## 技术栈
- 前端：React + Vite + TypeScript
- 后端：Express + TypeScript（用 tsx 运行）
- 数据库：SQLite（better-sqlite3），文件位于 server/comiai.db
- 认证：JWT + bcryptjs
- 部署：PM2 + Nginx 反代
- 即梦 API：手动 HMAC-SHA256 签名（见 server/volcengine.ts）
- Kimi API：OpenAI 兼容格式，用于 AI 拆分剧本

---

## 项目结构
```
comiai-web-v2.0.1/
├── src/
│   ├── App.tsx                  # 主入口，JWT 认证，所有 useState 必须在 if(!user) 之前
│   ├── Login.tsx                # 登录/注册页
│   ├── ProjectManagement.tsx    # 项目列表页（含新建项目弹窗、风格选择）
│   ├── EpisodeManagement.tsx    # 分集管理页（空状态 UI）
│   ├── AccountCenter.tsx        # 账户中心（积分、购买、改名）
│   └── api.ts                   # 统一 API 客户端（Bearer Token）
├── server/
│   ├── index.ts                 # Express 入口，端口 3001
│   ├── db.ts                    # SQLite schema
│   ├── volcengine.ts            # 即梦图片/视频生成（手动 HMAC 签名）
│   └── routes/
│       ├── auth.ts              # POST /api/auth/login  /register
│       ├── user.ts              # GET/PUT /api/user/me  购买积分
│       ├── projects.ts          # 项目 CRUD
│       ├── episodes.ts          # 分集 CRUD
│       ├── script.ts            # 剧本上传 + Kimi AI 拆分
│       └── generate.ts          # 图片/视频生成接口
├── public/
│   └── style-images/            # 风格预览图（待生成）
├── scripts/
│   └── gen-style-images.ts      # 生成风格封面图的脚本
├── .env
└── vite.config.ts               # /api 和 /uploads 代理到 localhost:3001
```

---

## 已完成的功能
- 用户注册/登录（bcrypt + JWT），新用户初始 1000 积分
- 项目列表（真实数据，空状态 UI）
- 分集管理页（空状态，无 demo 数据）
- 账户中心（查看积分、购买套餐¥10=100积分、修改用户名）
- 剧本上传 + Kimi AI 拆分场景
- 即梦 API 签名问题已解决（手动 HMAC-SHA256，SK 原始值不解码）
- Nginx + PM2 部署到腾讯云

---

## 🔴 当前待完成的任务

### 任务1：精简风格选择 + 生成封面图
**需求：**
- 风格只保留 4 个：**默认（空占位）、写实、吉卜力、3D、皮克斯**（共5个，默认是空的）
- 默认风格：不需要图片，显示一个空白占位样式（比如虚线框 + "无风格"文字）
- 其他 4 个风格需要用即梦 API 生成封面图

**生成脚本已准备好：**
```bash
cd /Users/newblue/Projects/comiai-web-v2.0.1
npx tsx scripts/gen-style-images.ts
# 图片会保存到 public/style-images/{id}.jpg
```

脚本里的 STYLES 数组已更新为：
```js
{ id: 'realistic', name: '写实',   prompt: '电影级写实...' },
{ id: 'ghibli',   name: '吉卜力', prompt: '宫崎骏吉卜力...' },
{ id: '3d',       name: '3D',     prompt: '三维CG渲染...' },
{ id: 'pixar',    name: '皮克斯', prompt: '皮克斯Pixar...' },
```

**然后更新 src/ProjectManagement.tsx 的 styles 数组：**
```js
const styles = [
  { id: '',          name: '默认', image: null },   // 空占位，无图片
  { id: 'realistic', name: '写实', image: '/style-images/realistic.jpg' },
  { id: 'ghibli',    name: '吉卜力', image: '/style-images/ghibli.jpg' },
  { id: '3d',        name: '3D',   image: '/style-images/3d.jpg' },
  { id: 'pixar',     name: '皮克斯', image: '/style-images/pixar.jpg' },
];
```

**默认风格的占位样式（在 ProjectManagement.tsx 的风格卡片渲染中）：**
- 如果 `style.image === null`，显示一个灰色虚线方框 + 📋 图标 + "默认"文字，不显示背景图
- 选中时同样显示绿色边框

### 任务2：部署最新代码到服务器
完成任务1后，把最新代码部署上去。

---

## 注意事项

### 关于 volcengine.ts 签名
即梦 API 使用手动 HMAC-SHA256，SK **不做任何解码**，直接使用 .env 中的原始字符串：
```typescript
function getCredentials() {
  return {
    accessKeyId: process.env.VOLC_ACCESS_KEY!,
    secretKey: process.env.VOLC_SECRET_KEY!,  // 原始值，不解码
  };
}
```
查询任务时必须带 req_key：
```typescript
volcRequest('CVSync2AsyncGetResult', { req_key: 'jimeng_high_aes_general_v21_L', task_id: taskId })
```

### 关于 React Hooks 规则
App.tsx 中所有 useState 必须放在 `if (!user) return <Login />` **之前**，否则白屏。

### 关于新对话不记得上下文
每次新开对话，告诉 Claude：
> 请先读取 `/Users/newblue/Projects/comiai-web-v2.0.1/CLAUDE_HANDOFF.md` 了解项目背景
