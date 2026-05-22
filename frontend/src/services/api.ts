import axios from 'axios';
import type { Job, JobCreate, Resume, MatchResult, MatchRequest, MatchHistory } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Jobs API
export const jobsApi = {
  getAll: async (skip = 0, limit = 10): Promise<Job[]> => {
    const { data } = await apiClient.get('/jobs/', { params: { skip, limit } });
    return data;
  },
  
  getById: async (id: number): Promise<Job> => {
    const { data } = await apiClient.get(`/jobs/${id}`);
    return data;
  },
  
  create: async (job: JobCreate): Promise<Job> => {
    const { data } = await apiClient.post('/jobs/', job);
    return data;
  },
  
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/jobs/${id}`);
  },

  update: async (id: number, job: JobCreate): Promise<Job> => {
    const { data } = await apiClient.put(`/jobs/${id}`, job);
    return data;
  },
};

// Resumes API
export const resumesApi = {
  getAll: async (skip = 0, limit = 10): Promise<Resume[]> => {
    const { data } = await apiClient.get('/resumes/', { params: { skip, limit } });
    return data;
  },
  
  getById: async (id: number): Promise<Resume> => {
    const { data } = await apiClient.get(`/resumes/${id}`);
    return data;
  },
  
  upload: async (file: File, candidateName?: string): Promise<Resume> => {
    const formData = new FormData();
    formData.append('file', file);
    if (candidateName) {
      formData.append('candidate_name', candidateName);
    }
    
    const { data } = await apiClient.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
  
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/resumes/${id}`);
  },
};

// Matching API
export const matchingApi = {
  calculateScore: async (request: MatchRequest): Promise<MatchResult> => {
    const { data } = await apiClient.post('/match/score', request);
    return data;
  },
  
  getHistory: async (skip = 0, limit = 10): Promise<MatchHistory[]> => {
    const { data } = await apiClient.get('/match/history', { params: { skip, limit } });
    return data;
  },
};
