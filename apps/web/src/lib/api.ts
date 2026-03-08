import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: (data: any) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

export const uapApi = {
  getProfile: () => api.get('/uap/profile'),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateProfile: (data: any) => api.put('/uap/profile', data),
  uploadDocument: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/uap/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const scholarshipApi = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll: (params?: any) => api.get('/scholarships', { params }),
  getById: (id: string) => api.get(`/scholarships/${id}`),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search: (query: string, filters?: any) =>
    api.post('/scholarships/search', { query, filters }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apply: (scholarshipId: string, data: any) =>
    api.post(`/scholarships/${scholarshipId}/apply`, data),
};

export const universityApi = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll: (params?: any) => api.get('/universities', { params }),
  getById: (id: string) => api.get(`/universities/${id}`),
  getProgrammes: (universityId: string) =>
    api.get(`/universities/${universityId}/programmes`),
  follow: (universityId: string) => api.post(`/universities/${universityId}/follow`),
};

export const jobApi = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll: (params?: any) => api.get('/jobs', { params }),
  getById: (id: string) => api.get(`/jobs/${id}`),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apply: (jobId: string, data: any) => api.post(`/jobs/${jobId}/apply`, data),
};

export const notificationApi = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};
