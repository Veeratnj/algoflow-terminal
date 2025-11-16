export interface DemoUser {
  id: string;
  email: string;
  password: string;
  role: string; // 'admin' | 'user' | 'trader' | 'viewer'
}

// Development-only hardcoded credentials
// Admin and User accounts for quick testing
const demoUsers: DemoUser[] = [
  {
    id: "admin-1",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "user-1",
    email: "user@example.com",
    password: "user123",
    role: "user",
  },
];

export default demoUsers;
