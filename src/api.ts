// 统一 API 请求工具

function getToken(): string | null {
  return localStorage.getItem('comiai_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const resp = await fetch(path, { ...options, headers });

  if (resp.status === 401) {
    localStorage.removeItem('comiai_token');
    localStorage.removeItem('comiai_user');
    window.location.reload();
    throw new Error('未登录');
  }

  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error ?? '请求失败');
  return data as T;
}

// Auth
export const authApi = {
  login: (username: string, password: string) =>
    request<{ token: string; username: string; credits: number }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  register: (username: string, password: string) =>
    request<{ token: string; username: string; credits: number }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
};

// Projects
export const projectsApi = {
  list: () => request<any[]>('/api/projects'),
  create: (name: string, description?: string) =>
    request<any>('/api/projects', { method: 'POST', body: JSON.stringify({ name, description }) }),
  delete: (id: number) => request<any>(`/api/projects/${id}`, { method: 'DELETE' }),

  listEpisodes: (projectId: number) => request<any[]>(`/api/projects/${projectId}/episodes`),
  createEpisode: (projectId: number, name: string, script_content?: string) =>
    request<any>(`/api/projects/${projectId}/episodes`, {
      method: 'POST',
      body: JSON.stringify({ name, script_content }),
    }),
  listScenes: (projectId: number, episodeId: number) =>
    request<any[]>(`/api/projects/${projectId}/episodes/${episodeId}/scenes`),
};

// Script
export const scriptApi = {
  uploadFile: async (file: File) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('script', file);
    const resp = await fetch('/api/script/upload', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error ?? '上传失败');
    return data as { content: string; filename: string };
  },
  split: (content: string, episode_id?: number) =>
    request<{ scenes: any[] }>('/api/script/split', {
      method: 'POST',
      body: JSON.stringify({ content, episode_id }),
    }),
};

// Generate
export const generateApi = {
  submitImage: (scene_id: number, prompt: string) =>
    request<{ task_id: string }>('/api/generate/image', {
      method: 'POST',
      body: JSON.stringify({ scene_id, prompt }),
    }),
  submitVideo: (scene_id: number, prompt: string, image_url?: string) =>
    request<{ task_id: string }>('/api/generate/video', {
      method: 'POST',
      body: JSON.stringify({ scene_id, prompt, image_url }),
    }),
  batchImage: (episodeId: number) =>
    request<{ results: any[] }>(`/api/generate/episode/${episodeId}/batch-image`, { method: 'POST' }),
  queryTask: (taskId: string, scene_id: number, type: 'image' | 'video') =>
    request<{ status: string; imageUrls?: string[]; videoUrl?: string }>(
      `/api/generate/task/${taskId}?scene_id=${scene_id}&type=${type}`
    ),
};
