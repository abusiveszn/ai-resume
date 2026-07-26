export interface SystemStats {
  totalUsers: number;
  totalResumes: number;
  totalExports: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

export interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface ResumeStats {
  date: string;
  created: number;
  exported: number;
}

export interface AIServiceUsage {
  service: string;
  calls: number;
  avgResponseTime: number;
  successRate: number;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  lastBackup: string;
  storageUsed: number;
  storageTotal: number;
}

// Mock data for demo
export const MOCK_SYSTEM_STATS: SystemStats = {
  totalUsers: 52847,
  totalResumes: 89321,
  totalExports: 124567,
  activeUsers: 3241,
  newUsersToday: 156,
  newUsersThisWeek: 892,
  newUsersThisMonth: 3456,
};

export const MOCK_USER_ACTIVITIES: UserActivity[] = [
  {
    id: '1',
    userId: '2',
    userName: 'John Doe',
    userEmail: 'user@example.com',
    action: 'Created Resume',
    details: 'Software Engineer Resume',
    timestamp: '2024-04-10T14:30:00Z',
  },
  {
    id: '2',
    userId: '3',
    userName: 'Sarah Smith',
    userEmail: 'sarah@example.com',
    action: 'Exported PDF',
    details: 'Modern Template',
    timestamp: '2024-04-10T14:25:00Z',
  },
  {
    id: '3',
    userId: '4',
    userName: 'Mike Johnson',
    userEmail: 'mike@example.com',
    action: 'AI Suggestion',
    details: 'Improved summary section',
    timestamp: '2024-04-10T14:20:00Z',
  },
  {
    id: '4',
    userId: '5',
    userName: 'Emily Brown',
    userEmail: 'emily@example.com',
    action: 'Job Match',
    details: 'Matched with Senior Developer role - 87%',
    timestamp: '2024-04-10T14:15:00Z',
  },
  {
    id: '5',
    userId: '6',
    userName: 'David Wilson',
    userEmail: 'david@example.com',
    action: 'Created Resume',
    details: 'Product Manager Resume',
    timestamp: '2024-04-10T14:10:00Z',
  },
  {
    id: '6',
    userId: '7',
    userName: 'Lisa Chen',
    userEmail: 'lisa@example.com',
    action: 'Updated Profile',
    details: 'Added new experience',
    timestamp: '2024-04-10T14:05:00Z',
  },
  {
    id: '7',
    userId: '8',
    userName: 'Tom Anderson',
    userEmail: 'tom@example.com',
    action: 'Exported PDF',
    details: 'Professional Template',
    timestamp: '2024-04-10T14:00:00Z',
  },
  {
    id: '8',
    userId: '9',
    userName: 'Anna Martinez',
    userEmail: 'anna@example.com',
    action: 'AI Suggestion',
    details: 'Added action verbs',
    timestamp: '2024-04-10T13:55:00Z',
  },
];

export const MOCK_RESUME_STATS: ResumeStats[] = [
  { date: '2024-04-04', created: 245, exported: 189 },
  { date: '2024-04-05', created: 267, exported: 201 },
  { date: '2024-04-06', created: 289, exported: 234 },
  { date: '2024-04-07', created: 312, exported: 256 },
  { date: '2024-04-08', created: 298, exported: 245 },
  { date: '2024-04-09', created: 334, exported: 278 },
  { date: '2024-04-10', created: 156, exported: 134 },
];

export const MOCK_AI_USAGE: AIServiceUsage[] = [
  { service: 'Resume Improvement', calls: 45234, avgResponseTime: 1.2, successRate: 98.5 },
  { service: 'Job Matching', calls: 32156, avgResponseTime: 0.8, successRate: 99.2 },
  { service: 'Grammar Check', calls: 28901, avgResponseTime: 0.5, successRate: 99.8 },
  { service: 'Keyword Suggestion', calls: 19876, avgResponseTime: 0.6, successRate: 99.5 },
];

export const MOCK_SYSTEM_HEALTH: SystemHealth = {
  status: 'healthy',
  uptime: '99.97%',
  lastBackup: '2024-04-10T08:00:00Z',
  storageUsed: 68.5,
  storageTotal: 100,
};
