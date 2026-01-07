export interface User {
  _id?: string;
  email: string;
  password?: string; // Hashed password, not stored for OAuth users
  name?: string;
  provider?: 'credentials' | 'google';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

