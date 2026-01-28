
export interface BodyParameter {
  date: string;
  weight: number; // kg
  bodyFat: number; // %
  muscleMass: number; // kg
  bmi: number; 
  waterPercentage: number; // %
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  coachName?: string;
  fitnessGoal?: string;
  healthNotes?: string;
  profileImage?: string;
  height?: number; // cm, for BMI calculation
  membershipType: 'Silver' | 'Gold' | 'Platinum';
  status: 'Active' | 'Expired' | 'Suspended';
  role: 'member' | 'coach';
  joinDate: string;
  expiryDate: string;
  stats: BodyParameter[];
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'coach' | 'member';
  type: 'selfie' | 'wellness_tip';
  content: string;
  imageUrl?: string;
  timestamp: string;
  likes: number;
  isFeatured?: boolean;
}

export interface ZoomSession {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: 'Yoga' | 'Nutrition' | 'HIIT' | 'Meditation';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'success' | 'alert';
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  STATS = 'stats',
  COMMUNITY = 'community',
  SESSIONS = 'sessions',
  PROFILE = 'profile',
  COACH_PANEL = 'coach_panel'
}

export type Theme = 'light' | 'dark';
