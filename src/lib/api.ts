import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { config } from "@/config/environment";

/**
 * API Response Wrapper
 * Standardized response format matching FastAPI backend
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

/**
 * API Error Handler
 * Centralized error handling
 */
export interface ApiErrorResponse {
  message: string;
  status: number;
  data?: any;
}

/**
 * API Client Configuration
 * Base URL comes from .env file (VITE_API_URL)
 */
const API_BASE_URL = config.api.baseURL;
const API_TIMEOUT = config.api.timeout;

/**
 * Create Axios Instance with default configuration
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Request Interceptor
 * Add authentication token if available
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("af_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle errors globally and unwrap FastAPI response format
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // FastAPI returns { status, data, message }
    // Return the entire response for consistency
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth data and redirect to login
      localStorage.removeItem("af_token");
      localStorage.removeItem("af_role");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

/**
 * API Client Service
 * Provides standard methods for all HTTP operations
 */
export const apiClient = {
  /**
   * GET request
   * @param url - Endpoint URL
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  get: async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response: AxiosResponse<any> = await axiosInstance.get(url, config);
      // Handle both response formats: direct data or wrapped in { data: ... }
      return response.data?.data !== undefined ? response.data.data : response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * POST request
   * @param url - Endpoint URL
   * @param data - Request body data
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  post: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response: AxiosResponse<any> = await axiosInstance.post(
        url,
        data,
        config
      );
      
      // Handle both response formats: direct data or wrapped in { data: ... }
      return response.data?.data !== undefined ? response.data.data : response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * PUT request
   * @param url - Endpoint URL
   * @param data - Request body data
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  put: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response: AxiosResponse<any> = await axiosInstance.put(
        url,
        data,
        config
      );
      // Handle both response formats: direct data or wrapped in { data: ... }
      return response.data?.data !== undefined ? response.data.data : response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * PATCH request
   * @param url - Endpoint URL
   * @param data - Request body data
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  patch: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response: AxiosResponse<any> = await axiosInstance.patch(
        url,
        data,
        config
      );
      // Handle both response formats: direct data or wrapped in { data: ... }
      return response.data?.data !== undefined ? response.data.data : response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * DELETE request
   * @param url - Endpoint URL
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  delete: async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response: AxiosResponse<any> = await axiosInstance.delete(
        url,
        config
      );
      // Handle both response formats: direct data or wrapped in { data: ... }
      // Also handle 204 No Content responses
      if (!response.data) return null as T;
      return response.data?.data !== undefined ? response.data.data : response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

/**
 * Error Handler
 * Standardize error responses
 */
const handleError = (error: any): ApiErrorResponse => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;

    if (config.features.enableLogs) {
      console.error(`API Error [${status}]:`, message);
    }

    return {
      status,
      message,
      data: error.response?.data,
    };
  }

  if (config.features.enableLogs) {
    console.error("Unexpected error:", error);
  }
  
  return {
    status: 500,
    message: "An unexpected error occurred",
    data: error,
  };
};

/**
 * ============================================================================
 * FastAPI Endpoint Modules
 * Based on api_endpoints.json
 * ============================================================================
 */

// Authentication
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post("/api/auth/login", { email, password }),
  register: (data: { email: string; password: string; name: string; role?: string }) =>
    apiClient.post("/api/auth/register", data),
  refresh: () => apiClient.post("/api/auth/refresh"),
};

// Users
export const usersApi = {
  me: () => apiClient.get("/api/users/me"),
  updateMe: (data: { name?: string; email?: string }) =>
    apiClient.put("/api/users/me", data),
  getAll: () => apiClient.get("/api/users"),
  getById: (id: string | number) => apiClient.get(`/api/users/${id}`),
  delete: (id: string | number) => apiClient.delete(`/api/users/${id}`),
  activate: (id: string | number) => apiClient.post(`/api/users/${id}/activate`),
  deactivate: (id: string | number) => apiClient.post(`/api/users/${id}/deactivate`),
};

// Market Data
export const marketApi = {
  getIndices: () => apiClient.get("/api/market/indices"),
  getIndexByName: (name: string) => apiClient.get(`/api/market/indices/${name}`),
  createIndex: (data: any) => apiClient.post("/api/market/indices", data),
  updateIndex: (id: string | number, data: any) =>
    apiClient.put(`/api/market/indices/${id}`, data),
  deleteIndex: (id: string | number) => apiClient.delete(`/api/market/indices/${id}`),
  getPnl: () => apiClient.get("/api/market/pnl"),
  getPnlByPeriod: (period: "today" | "week" | "month") =>
    apiClient.get(`/api/market/pnl/${period}`),
  createPnl: (data: any) => apiClient.post("/api/market/pnl", data),
};

// Trades
export const tradesApi = {
  getAll: () => apiClient.get("/api/trades"),
  getById: (id: string | number) => apiClient.get(`/api/trades/${id}`),
  create: (data: any) => apiClient.post("/api/trades", data),
  update: (id: string | number, data: any) => apiClient.put(`/api/trades/${id}`, data),
  delete: (id: string | number) => apiClient.delete(`/api/trades/${id}`),
  getActive: () => apiClient.get("/api/trades/active/all"),
  close: (id: string | number, closingPrice: number) =>
    apiClient.post(`/api/trades/${id}/close?closing_price=${closingPrice}`),
};

// Orders
export const ordersApi = {
  getAll: () => apiClient.get("/api/orders"),
  getById: (id: string) => apiClient.get(`/api/orders/${id}`),
  create: (data: any) => apiClient.post("/api/orders", data),
  update: (id: string, data: any) => apiClient.put(`/api/orders/${id}`, data),
  cancel: (id: string) => apiClient.patch(`/api/orders/${id}/cancel`),
  delete: (id: string) => apiClient.delete(`/api/orders/${id}`),
};

// Strategies
export const strategiesApi = {
  getAll: () => apiClient.get("/api/strategies"),
  getById: (id: string | number) => apiClient.get(`/api/strategies/${id}`),
  create: (data: any) => apiClient.post("/api/strategies", data),
  update: (id: string | number, data: any) =>
    apiClient.put(`/api/strategies/${id}`, data),
  delete: (id: string | number) => apiClient.delete(`/api/strategies/${id}`),
  getActive: () => apiClient.get("/api/strategies/active/all"),
};

// Analytics
export const analyticsApi = {
  getAll: () => apiClient.get("/api/analytics"),
  getByDate: (date: string) => apiClient.get(`/api/analytics/date/${date}`),
  create: (data: any) => apiClient.post("/api/analytics", data),
  getRange: (startDate: string, endDate: string) =>
    apiClient.get(`/api/analytics/range?start_date=${startDate}&end_date=${endDate}`),
  getLatest: (days: number = 30) => apiClient.get(`/api/analytics/latest?days=${days}`),
};

// Alerts
export const alertsApi = {
  getAll: (isRead?: boolean) => {
    const params = isRead !== undefined ? `?is_read=${isRead}` : "";
    return apiClient.get(`/api/alerts${params}`);
  },
  getById: (id: string | number) => apiClient.get(`/api/alerts/${id}`),
  create: (data: { message: string; alert_type: string }) =>
    apiClient.post("/api/alerts", data),
  markAsRead: (id: string | number) => apiClient.patch(`/api/alerts/${id}/read`),
  delete: (id: string | number) => apiClient.delete(`/api/alerts/${id}`),
};

// Logs
export const logsApi = {
  getAll: (params?: { level?: string; category?: string; limit?: number }) => {
    const queryString = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    return apiClient.get(`/api/logs${queryString}`);
  },
  getById: (id: string | number) => apiClient.get(`/api/logs/${id}`),
  create: (data: any) => apiClient.post("/api/logs", data),
};

export default apiClient;
