export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  githubUsername?: string;
  isVerified?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}
