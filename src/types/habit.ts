export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly';
  createdAt: Date;
  userId: string;
  completions: HabitCompletion[];
}

export interface HabitCompletion {
  date: string; // YYYY-MM-DD format
  completed: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}