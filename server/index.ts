import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/auth.js';
import projectsRouter from './routes/projects.js';
import scriptRouter from './routes/script.js';
import generateRouter from './routes/generate.js';
import userRouter from './routes/user.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.SERVER_PORT ?? 3001);

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// 静态文件（生产构建）
app.use(express.static(path.join(__dirname, '..', 'dist')));
// 上传文件公开访问
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API 路由
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/script', scriptRouter);
app.use('/api/generate', generateRouter);

// SPA fallback（生产模式）
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ComiAI 后端运行在 http://0.0.0.0:${PORT}`);
});
