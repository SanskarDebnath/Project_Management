import { BASE_API_URL } from '../config';
import { encryptData, decryptData } from '../crypto';
import { toast } from 'sonner';
import { AUTH_STORAGE_KEY, USER_STORAGE_KEY } from '../constants';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  baseUrl?: string;
  rawJson?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_API_URL) {
    this.baseUrl = baseUrl;
  }

  async request<T = any>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', headers = {}, body, baseUrl, rawJson = true } = config;
    const url = `${baseUrl ?? this.baseUrl}${endpoint}`;
    const token = sessionStorage.getItem(AUTH_STORAGE_KEY);

    const mergedHeaders: Record<string, string> = {
      accept: 'application/json',
      ...headers,
    };

    if (token) {
      mergedHeaders['Authorization'] = `Bearer ${token}`;
    }

    let fetchBody: any = undefined;
    if (body !== undefined) {
      if (rawJson) {
        mergedHeaders['Content-Type'] = 'application/json';
        fetchBody = JSON.stringify(body);
      } else {
        /* Legacy encrypted formData commented out below for reference:
        const encrypted = encryptData(body);
        fetchBody = new FormData();
        fetchBody.append('data', encrypted);
        */
        const encrypted = encryptData(body);
        fetchBody = new FormData();
        fetchBody.append('data', encrypted);
      }
    }

    try {
      const response = await fetch(url, {
        method,
        headers: mergedHeaders,
        body: fetchBody,
      });

      if (response.status === 401 && !endpoint.includes('/public/')) {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        sessionStorage.removeItem(USER_STORAGE_KEY);
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
        return { success: false, error: 'Session expired' };
      }

      const responseText = await response.text();
      let decryptedData: any;

      try {
        decryptedData = decryptData(responseText);
      } catch {
        try {
          decryptedData = JSON.parse(responseText);
        } catch {
          decryptedData = responseText;
        }
      }

      return {
        success: response.ok,
        data: (decryptedData?.data ?? decryptedData) as T,
        message: decryptedData?.message || response.statusText,
        error: !response.ok ? (decryptedData?.detail || decryptedData?.message || 'API Error') : undefined,
      };
    } catch (err: any) {
      console.warn(`[ApiClient Network Warning] Endpoint ${endpoint} unreachable:`, err.message);
      return {
        success: false,
        error: err.message || 'Server connection failed',
        message: 'Server connection offline.',
      };
    }
  }
}

export const apiClient = new ApiClient();

