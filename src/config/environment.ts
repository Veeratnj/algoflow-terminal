/**
 * Environment Configuration
 * Centralized configuration management for the application
 */

export const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_URL || "",
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "10000", 10),
  },

  // App Configuration
  app: {
    env: import.meta.env.VITE_APP_ENV || "development",
    name: import.meta.env.VITE_APP_NAME || "Smart Elite Trading Club",
    version: import.meta.env.VITE_APP_VERSION || "0.0.1",
  },

  // Feature Flags
  features: {
    enableLogs: import.meta.env.VITE_ENABLE_LOGS === "true",
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  },

  // Utility Methods
  isDevelopment: () => import.meta.env.VITE_APP_ENV === "development",
  isProduction: () => import.meta.env.VITE_APP_ENV === "production",
};

export default config;
