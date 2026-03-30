export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface StoredTokens {
  accessToken: string | null;
  refreshToken: string | null;
  rememberMe: boolean;
}

export interface AuthUser {
  id?: string;
  _id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  avatar?: string;
  profile_image?: string;
  role?: string;
  [key: string]: unknown;
}

export interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: AuthUser | null;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  remember_me?: boolean;
}

export interface AuthResponseData {
  accessToken?: string;
  refreshToken?: string;
  access_token?: string;
  refresh_token?: string;
  user?: AuthUser;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
