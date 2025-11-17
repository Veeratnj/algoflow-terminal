# Environment Configuration Guide

This document explains how to configure environment variables for AlgoTrader Terminal.

## Overview

AlgoTrader Terminal uses environment variables for configuration management. The application supports multiple environments with fallback defaults.

## Environment Files

### `.env` (Base Configuration)
Contains default configuration for the application.

```env
VITE_API_URL=http://localhost:3001
VITE_APP_ENV=development
VITE_APP_NAME=AlgoTrader
VITE_APP_VERSION=1.0.0
VITE_API_TIMEOUT=10000
VITE_ENABLE_LOGS=true
VITE_ENABLE_ANALYTICS=true
```

### `.env.local` (Local Development - NOT COMMITTED)
Overrides `.env` for local development. This file is ignored by git.

```env
VITE_API_URL=http://localhost:3001
VITE_APP_ENV=development
VITE_ENABLE_LOGS=true
VITE_ENABLE_ANALYTICS=false
```

### `.env.production` (Production Configuration)
Configuration for production build.

```env
VITE_API_URL=https://api.algotrader.com
VITE_APP_ENV=production
VITE_API_TIMEOUT=15000
VITE_ENABLE_LOGS=false
VITE_ENABLE_ANALYTICS=true
```

## Environment Variables

### API Configuration

#### `VITE_API_URL`
- **Description**: Base URL for the API server
- **Default**: `http://localhost:3001`
- **Example**: `https://api.algotrader.com`
- **Used by**: `src/lib/api.ts`

#### `VITE_API_TIMEOUT`
- **Description**: API request timeout in milliseconds
- **Default**: `10000` (10 seconds)
- **Example**: `15000` (for production)

### Application Configuration

#### `VITE_APP_ENV`
- **Description**: Application environment
- **Values**: `development`, `production`
- **Default**: `development`

#### `VITE_APP_NAME`
- **Description**: Application name
- **Default**: `AlgoTrader`

#### `VITE_APP_VERSION`
- **Description**: Application version
- **Default**: `1.0.0`

### Feature Flags

#### `VITE_ENABLE_LOGS`
- **Description**: Enable/disable console logging
- **Values**: `true`, `false`
- **Default**: `true` (development), `false` (production)

#### `VITE_ENABLE_ANALYTICS`
- **Description**: Enable/disable analytics tracking
- **Values**: `true`, `false`
- **Default**: `true`

## Usage in Code

### Using Configuration in Components

```typescript
import { config } from '@/config/environment';

// Access API URL
console.log(config.api.baseURL); // http://localhost:3001

// Access app info
console.log(config.app.name);    // AlgoTrader
console.log(config.app.env);     // development

// Check environment
if (config.isDevelopment()) {
  // Development-specific code
}

// Check feature flags
if (config.features.enableLogs) {
  console.log('Logging enabled');
}
```

### Using in API Client

The API client automatically uses `VITE_API_URL` and `VITE_API_TIMEOUT`:

```typescript
import { tradesApi } from '@/lib/api';

// Uses base URL from VITE_API_URL
const trades = await tradesApi.getAll();
```

## Setting Up Different Environments

### Development Setup

1. Copy `.env` to `.env.local`
2. Update `VITE_API_URL` if your API runs on a different port
3. Start the app: `npm run dev`

```env
# .env.local
VITE_API_URL=http://localhost:3001
VITE_APP_ENV=development
```

### Production Setup

1. The `.env.production` file is automatically used for `npm run build`
2. Update `VITE_API_URL` to your production API endpoint

```env
# .env.production
VITE_API_URL=https://api.algotrader.com
VITE_APP_ENV=production
```

### Docker/CI/CD Setup

Set environment variables directly in your deployment:

```bash
docker run \
  -e VITE_API_URL=https://api.algotrader.com \
  -e VITE_APP_ENV=production \
  algotrader-terminal:latest
```

## Important Notes

⚠️ **Security**
- Never commit `.env.local` or `.env.production.local`
- Use `.gitignore` to exclude local environment files
- Never store sensitive data in `.env` files

✅ **Best Practices**
- Always provide default values in `.env`
- Use `.env.local` for local development overrides
- Document all environment variables
- Use meaningful variable names with `VITE_` prefix
- Keep `.env` in version control, `.env.local` in `.gitignore`

## Verification

To verify environment variables are loaded correctly:

```typescript
// In browser console
import { config } from '@/config/environment'
console.log(config)
```

Should output:
```javascript
{
  api: { baseURL: "http://localhost:3001", timeout: 10000 },
  app: { env: "development", name: "AlgoTrader", version: "1.0.0" },
  features: { enableLogs: true, enableAnalytics: true },
  isDevelopment: ƒ,
  isProduction: ƒ
}
```

## Troubleshooting

### Variables not loading?

1. Restart dev server: `npm run dev`
2. Clear `.vite` cache: `rm -rf .vite`
3. Check file naming: Must start with `VITE_` prefix
4. Verify Vite config supports env files

### Wrong API endpoint being used?

1. Check `.env.local` is not overriding `.env`
2. Verify `VITE_API_URL` in active environment file
3. Check browser DevTools → Application → Environment

### Production build uses development settings?

1. Ensure `.env.production` exists with correct values
2. Run build: `npm run build` (uses `.env.production`)
3. Check dist/assets files for environment values

