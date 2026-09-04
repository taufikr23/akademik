import api from '../api/client';
import type { ApiResponse, AuthResponse } from '../types';

export const authService = {
  login: async (username: string, password: string) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', { username, password });
    return res.data;
  },
  register: async (data: any) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', data);
    return res.data;
  },
  activate: async (token: string, username: string, newPassword: string) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/api/auth/activate', { token, username, newPassword });
    return res.data;
  },
  getPendingRegistrations: async () => {
    const res = await api.get<ApiResponse<any[]>>('/api/auth/admin/approvals/pending');
    return res.data;
  },
  approveUser: async (userId: number) => {
    const res = await api.post<ApiResponse<any>>('/api/auth/admin/approvals/' + userId + '/approve');
    return res.data;
  },
  rejectUser: async (userId: number) => {
    const res = await api.post<ApiResponse<any>>('/api/auth/admin/approvals/' + userId + '/reject');
    return res.data;
  },
  me: async () => {
    const res = await api.get<ApiResponse<AuthResponse>>('/api/auth/me');
    return res.data;
  },
};