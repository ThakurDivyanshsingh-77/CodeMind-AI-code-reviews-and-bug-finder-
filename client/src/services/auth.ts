import api from './api';
import { RegisterPayload, LoginPayload, AuthResponse, UserProfileResponse } from '@/types/auth';

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', payload);
  return response.data;
};

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', payload);
  return response.data;
};

export const getMe = async (): Promise<UserProfileResponse> => {
  const response = await api.get<UserProfileResponse>('/auth/me');
  return response.data;
};
