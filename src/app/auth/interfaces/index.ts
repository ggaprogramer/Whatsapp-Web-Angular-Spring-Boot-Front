export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberPassword: boolean;
}

export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password1: string;
  password2: string;
  roles: Roles[];
}

export interface LoginResponse {
  status: StatusResponse;
  message: string;
  type: string;
  token: string;
}

export interface RegisterResponse {
  status: StatusResponse;
  message: string;
  type: string;
}

export type Roles = 'USER' | 'ADMIN';

export type StatusResponse = 'SUCCESS' | 'ERROR';
