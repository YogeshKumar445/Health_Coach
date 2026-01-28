
import { Member, Post, ZoomSession, Notification } from './types';

export const COACH_USER: Member = {
  id: 'coach_admin',
  name: 'Admin Coach',
  email: 'owner@vitalityhub.com',
  role: 'coach',
  membershipType: 'Platinum',
  status: 'Active',
  joinDate: '2023-01-01',
  expiryDate: '2099-01-01',
  stats: []
};

export const CURRENT_USER: Member = {
  id: 'user_1',
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  role: 'member',
  height: 175,
  membershipType: 'Gold',
  status: 'Active',
  joinDate: '2023-11-15',
  expiryDate: '2024-11-15',
  stats: [
    { date: '2024-01-01', weight: 82.5, bodyFat: 22, muscleMass: 60, bmi: 26.9, waterPercentage: 55 },
    { date: '2024-02-01', weight: 80.2, bodyFat: 20.5, muscleMass: 61, bmi: 26.2, waterPercentage: 56 },
    { date: '2024-03-01', weight: 78.8, bodyFat: 19.2, muscleMass: 62, bmi: 25.7, waterPercentage: 57 },
    { date: '2024-04-01', weight: 77.5, bodyFat: 18.5, muscleMass: 62.5, bmi: 25.3, waterPercentage: 58 },
  ]
};

export const MOCK_MEMBERS: Member[] = [
  CURRENT_USER,
  {
    id: 'user_2',
    name: 'Sarah Parker',
    email: 'sarah.p@example.com',
    role: 'member',
    height: 165,
    membershipType: 'Silver',
    status: 'Active',
    joinDate: '2024-01-10',
    expiryDate: '2024-07-10',
    stats: [
      { date: '2024-03-15', weight: 65.0, bodyFat: 28, muscleMass: 42, bmi: 23.9, waterPercentage: 52 }
    ]
  },
  {
    id: 'user_3',
    name: 'Mike Ross',
    email: 'mike.r@example.com',
    role: 'member',
    height: 182,
    membershipType: 'Gold',
    status: 'Suspended',
    joinDate: '2023-05-10',
    expiryDate: '2024-05-10',
    stats: [
      { date: '2024-02-01', weight: 88.0, bodyFat: 25, muscleMass: 62, bmi: 26.6, waterPercentage: 54 }
    ]
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    authorId: 'coach_1',
    authorName: 'Coach Sarah',
    authorRole: 'coach',
    type: 'wellness_tip',
    content: 'Consistency is key! Remember to hydrate throughout your workout. Your body will thank you later. 💧✨',
    timestamp: '2 hours ago',
    likes: 45,
    isFeatured: true
  },
  {
    id: 'p2',
    authorId: 'user_2',
    authorName: 'Mike Ross',
    authorRole: 'member',
    type: 'selfie',
    content: 'Morning sweat session done! Feeling incredible today! 🏋️‍♂️',
    imageUrl: 'https://picsum.photos/seed/fitness1/600/400',
    timestamp: '4 hours ago',
    likes: 12
  }
];

export const MOCK_SESSIONS: ZoomSession[] = [
  {
    id: 's1',
    title: 'Morning Vinyasa Flow',
    description: 'A gentle but energizing flow to start your day right. Focus on mobility and breath work.',
    date: '2024-04-10',
    duration: '45 mins',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000',
    category: 'Yoga'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'New Session Uploaded',
    message: 'Coach Sarah just uploaded "Evening Breathwork". Check it out!',
    timestamp: '10 mins ago',
    isRead: false,
    type: 'info'
  }
];
