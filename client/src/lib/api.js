const BASE_URL = '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    me: () => request('/auth/me'),
  },
  posts: {
    list: ({ cursor, limit = 10 } = {}) =>
      request(`/posts?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`),
    get: (slug) => request(`/posts/${slug}`),
    create: (data) => request('/posts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
    drafts: () => request('/posts/drafts/all'),
  },
};
