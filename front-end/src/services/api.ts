import axios from 'axios';
import type { AuthResponse, Customer, Matter, ApiResponse } from '../types';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    localStorage.setItem('token', response.data.data.token);
    return response.data;
  },

  signup: async (email: string, password: string, firmName: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', { email, password, firmName });
    localStorage.setItem('token', response.data.data.token);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<{ user: any }>>('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

export const customerService = {
  getCustomers: async (): Promise<ApiResponse<{ customers: Customer[] }>> => {
    const response = await api.get('/customers');
    return response.data;
  },

  createCustomer: async (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<ApiResponse<Customer>>('/customers', customer);
    return response.data;
  },

  getCustomer: async (id: number): Promise<ApiResponse<Customer>> => {
    const response = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
    return response.data;
  },

  deleteCustomer: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },

  createMatter: async (customerId: string, matter: Omit<Matter, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<ApiResponse<Matter>>(`/customers/${customerId}/matters`, matter);
    return response.data;
  },

  getMatters: async (customerId: string) => {
    const response = await api.get<ApiResponse<{ matters: Matter[] }>>(`/customers/${customerId}/matters`);
    return response.data;
  },
};

export const matterService = {
  getMatters: async (customerId: number): Promise<ApiResponse<{ matters: Matter[] }>> => {
    const response = await api.get(`/customers/${customerId}/matters`);
    return response.data;
  },

  createMatter: async (customerId: number, title: string, description?: string): Promise<ApiResponse<{ matter: Matter }>> => {
    const response = await api.post(`/customers/${customerId}/matters`, { title, description });
    return response.data;
  },

  getMatter: async (customerId: number, matterId: number): Promise<ApiResponse<{ matter: Matter }>> => {
    const response = await api.get(`/customers/${customerId}/matters/${matterId}`);
    return response.data;
  },
}; 