export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
}

