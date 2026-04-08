export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Checkpoint {
  id: string;
  title: string;
  done: boolean;
  order: number;
}

export interface Task {
  id: string;
  title: string;
  type: 'MICRO' | 'MACRO';
  status: 'TODO' | 'DONE' | 'ARCHIVED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate?: string;
  repeat: 'DAILY' | 'WEEKLY' | 'NONE';
  categoryId?: string;
  goalId?: string;
  userId: string;
  createdAt: string;
  completedAt?: string;
  checkpoints: Checkpoint[];
  category?: Category;
}

export type GoalLevel = 'LIFE' | 'MONTH' | 'WEEK';

export interface Goal {
  id: string;
  title: string;
  level: GoalLevel;
  progress: number;
  deadline?: string;
  parentId?: string;
  categoryId?: string;
  userId: string;
  createdAt: string;
  category?: Category;
  tasks: Pick<Task, 'id' | 'title' | 'status'>[];
  children: Goal[];
}

export type NoteType = 'ARTICLE' | 'THOUGHT' | 'SHOPPING' | 'WISHLIST';

export interface Note {
  id: string;
  type: NoteType;
  title?: string;
  content?: string;
  url?: string;
  tags: string[];
  done: boolean;
  price?: number;
  imageUrl?: string;
  userId: string;
  createdAt: string;
}

export type MoodType = 'DEAD' | 'OK' | 'ANGRY' | 'FIRE' | 'CHAOS';

export interface Mood {
  id: string;
  value: MoodType;
  date: string;
  userId: string;
}

export interface DashboardData {
  tasksToday: number;
  doneToday: number;
  doneTasks: number;
  weeklyDone: number;
  completionRate: number;
  streak: number;
  heatmap: { date: string; count: number }[];
  goals: Goal[];
  mood: Mood | null;
}