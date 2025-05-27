export interface User {
  id: number;
  email: string;
  firmName: string;
}

export interface Customer {
  id: number;
  name: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Matter {
  id: number;
  title: string;
  description?: string;
  status: string;
  customerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  status: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  status: string;
  data: T;
} 