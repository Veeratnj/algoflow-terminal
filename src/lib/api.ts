import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { config } from "@/config/environment";

/**
 * API Response Wrapper
 * Standardized response format for all API calls
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
 * Handle errors globally
 */
axiosInstance.interceptors.response.use(
  (response) => {
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
      const response: AxiosResponse<T> = await axiosInstance.get(url, config);
      return response.data;
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
      const response: AxiosResponse<T> = await axiosInstance.post(
        url,
        data,
        config
      );
      return response.data;
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
      const response: AxiosResponse<T> = await axiosInstance.put(
        url,
        data,
        config
      );
      return response.data;
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
      const response: AxiosResponse<T> = await axiosInstance.patch(
        url,
        data,
        config
      );
      return response.data;
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
      const response: AxiosResponse<T> = await axiosInstance.delete(
        url,
        config
      );
      return response.data;
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

    console.error(`API Error [${status}]:`, message);

    return {
      status,
      message,
      data: error.response?.data,
    };
  }

  console.error("Unexpected error:", error);
  return {
    status: 500,
    message: "An unexpected error occurred",
    data: error,
  };
};

/**
 * Specific API Endpoints Module
 * Higher-level functions for specific resources
 */

// Market Data
export const marketApi = {
  getIndices: () => apiClient.get("/marketIndices"),
  getPnl: () => apiClient.get("/pnl"),
};

// Trades
export const tradesApi = {
  getAll: () => apiClient.get("/trades"),
  getById: (id: string | number) => apiClient.get(`/trades/${id}`),
  create: (data: any) => apiClient.post("/trades", data),
  update: (id: string | number, data: any) =>
    apiClient.put(`/trades/${id}`, data),
  delete: (id: string | number) => apiClient.delete(`/trades/${id}`),
};

// Orders
export const ordersApi = {
  getAll: () => apiClient.get("/orderHistory"),
  getById: (id: string) => apiClient.get(`/orderHistory/${id}`),
  create: (data: any) => apiClient.post("/orderHistory", data),
  update: (id: string, data: any) =>
    apiClient.put(`/orderHistory/${id}`, data),
  cancel: (id: string) => apiClient.patch(`/orderHistory/${id}`, { status: "CANCELLED" }),
};

// Strategies
export const strategiesApi = {
  getAll: () => apiClient.get("/strategies"),
  getById: (id: string | number) =>
    apiClient.get(`/strategies/${id}`),
  create: (data: any) => apiClient.post("/strategies", data),
  update: (id: string | number, data: any) =>
    apiClient.put(`/strategies/${id}`, data),
  delete: (id: string | number) =>
    apiClient.delete(`/strategies/${id}`),
};

// Users
export const usersApi = {
  getAll: () => apiClient.get("/users"),
  getById: (id: string) => apiClient.get(`/users/${id}`),
  create: (data: any) => apiClient.post("/users", data),
  update: (id: string, data: any) =>
    apiClient.put(`/users/${id}`, data),
  delete: (id: string) => apiClient.delete(`/users/${id}`),
  login: (email: string, password: string) =>
    apiClient.post("/users/login", { email, password }),
};

// Logs
export const logsApi = {
  getAll: () => apiClient.get("/logs"),
  getById: (id: string | number) => apiClient.get(`/logs/${id}`),
};

// Alerts
export const alertsApi = {
  getAll: () => apiClient.get("/alerts"),
  getById: (id: string | number) => apiClient.get(`/alerts/${id}`),
};

// Analytics
export const analyticsApi = {
  getAll: () => apiClient.get("/analytics"),
  getByDate: (date: string) => apiClient.get(`/analytics?date=${date}`),
};

export default apiClient;
