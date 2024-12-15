import axios, { AxiosResponse, AxiosError } from 'axios';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

axiosInstance.interceptors.request.use(async (config) => {
  const supabase = createClientComponentClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('Response error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: async <T>(url: string, config?: object): Promise<T> => {
    try {
      const { data } = await axiosInstance.get<T>(url, config);
      return data;
    } catch (error) {
      console.error(`GET ${url} failed:`, error);
      throw error;
    }
  },
  post: async <TPayload = unknown, TResponse = TPayload>(
    url: string,
    payload?: TPayload,
    config?: object,
  ): Promise<TResponse> => {
    try {
      const { data } = await axiosInstance.post<TPayload, AxiosResponse<TResponse>>(
        url,
        payload,
        config,
      );
      return data;
    } catch (error) {
      console.error(`POST ${url} failed:`, error);
      throw error;
    }
  },
  put: async <T>(url: string, payload?: object, config?: object): Promise<T> => {
    try {
      const { data } = await axiosInstance.put<T>(url, payload, config);
      return data;
    } catch (error) {
      console.error(`PUT ${url} failed:`, error);
      throw error;
    }
  },
  patch: async <T>(url: string, payload?: object, config?: object): Promise<T> => {
    try {
      const { data } = await axiosInstance.patch<T>(url, payload, config);
      return data;
    } catch (error) {
      console.error(`PATCH ${url} failed:`, error);
      throw error;
    }
  },
  delete: async <T>(url: string, config?: object): Promise<T> => {
    try {
      const { data } = await axiosInstance.delete<T>(url, config);
      return data;
    } catch (error) {
      console.error(`DELETE ${url} failed:`, error);
      throw error;
    }
  },
};

export const queryKeys = {
  properties: {
    all: ['properties'] as const,
    detail: (id: string) => ['properties', id] as const,
    units: (id: string) => ['properties', id, 'units'] as const,
  },
  units: {
    all: ['units'] as const,
    detail: (id: string) => ['units', id] as const,
    leases: (id: string) => ['units', id, 'leases'] as const,
  }
}; 