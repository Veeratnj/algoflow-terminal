# AlgoFlow Terminal

A modern algorithmic trading platform built with React, TypeScript, and FastAPI backend integration.

## 🚀 Features

- **Real-time Trading Dashboard**: Monitor market indices, P&L, and active trades
- **Order Management**: Place, track, and manage orders with ease
- **Strategy Management**: Create and deploy automated trading strategies
- **Analytics & Reports**: Comprehensive trading performance analytics
- **User Management**: Role-based access control (Admin/Trader)
- **Alert System**: Real-time notifications for market events
- **Trade Logging**: Complete audit trail of all trading activities

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **shadcn/ui** - UI component library
- **Radix UI** - Headless UI primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend Integration

- **FastAPI** - Python backend framework
- RESTful API architecture
- JWT authentication

## 📋 Prerequisites

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **yarn** package manager
- **FastAPI Backend** running on the configured server

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <YOUR_GIT_URL>
   cd algoflow-terminal
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   # API Configuration
   VITE_API_URL=http://13.204.188.14:8000

   # Application Environment
   VITE_APP_ENV=development
   VITE_APP_NAME=AlgoTrader
   VITE_APP_VERSION=1.0.0

   # API Timeout (in milliseconds)
   VITE_API_TIMEOUT=15000

   # Feature Flags
   VITE_ENABLE_LOGS=true
   VITE_ENABLE_ANALYTICS=false
   ```

   For production, update `.env.production` accordingly.

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build with development configuration
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🏗️ Project Structure

```
algoflow-terminal/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── lib/            # Utility functions and API client
│   ├── config/         # Configuration files
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
├── .env                # Environment variables (local)
├── .env.production     # Production environment variables
└── vite.config.ts      # Vite configuration
```

## 🔌 API Integration

The application connects to a FastAPI backend with the following endpoints:

- `/api/auth/*` - Authentication (login, register, refresh)
- `/api/users/*` - User management
- `/api/market/*` - Market data and indices
- `/api/trades/*` - Trade management
- `/api/orders/*` - Order management
- `/api/strategies/*` - Strategy management
- `/api/analytics/*` - Analytics and reports
- `/api/alerts/*` - Alert notifications
- `/api/logs/*` - System logs

API client is located at `src/lib/api.ts`

## 🔐 Authentication

The application uses JWT-based authentication:

- Access tokens are stored in `localStorage` as `af_token`
- User roles are stored as `af_role`
- Automatic token refresh on 401 responses
- Automatic redirect to login on unauthorized access

## 🎨 UI Components

Built with **shadcn/ui** component library based on Radix UI primitives:

- Fully accessible components
- Customizable with Tailwind CSS
- Dark mode support with `next-themes`
- Responsive design for all screen sizes

## 📊 State Management

- **TanStack Query** (React Query) for server state
- **React Context** for global UI state
- **localStorage** for persistent data (auth tokens, user preferences)

## 🚀 Deployment

### Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Environment Configuration

Ensure `.env.production` is properly configured with production API endpoints before building.

## 🧪 Development

### Code Style

- TypeScript strict mode enabled
- ESLint for code linting
- Consistent component structure
- Custom hooks for reusable logic

### Best Practices

- Component-based architecture
- Type-safe API calls
- Error boundary implementation
- Proper error handling
- Loading states for async operations

## 📦 Dependencies Management

Major dependencies are kept up to date. Check `package.json` for current versions.

To update dependencies:

```bash
npm update
```

## 🐛 Troubleshooting

### Port 8080 already in use

Change the port in `vite.config.ts`:

```typescript
server: {
  port: 3000, // or any available port
}
```

### API connection issues

- Verify `VITE_API_URL` in `.env` is correct
- Ensure backend server is running
- Check network connectivity
- Restart dev server after `.env` changes

### Build errors

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📄 License

This project is private and proprietary.

## 👥 Support

For issues and questions, contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: November 2025
