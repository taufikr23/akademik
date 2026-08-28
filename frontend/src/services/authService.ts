import api from '../api/client';
import type { ApiResponse, AuthResponse } from '../types';

export const authService = { 
  login: async (username: string, password: string) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/api/v1/auth/login', { username, password });
    return res.data;
  },

  register: async (username: string, password: string, role: string) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/api/v1/auth/register', { username, password, role });
    return res.data;
  },

  activate: async (username: string, activationCode: string, newPassword: string) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/api/v1/auth/activate', { username, activationCode, newPassword });
    return res.data;
  },

  me: async () => {
    const res = await api.get<ApiResponse<AuthResponse>>('/api/v1/auth/me');
    return res.data;
  },
};
