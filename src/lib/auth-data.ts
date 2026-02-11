// User roles and authentication data
export type UserRole = 'ceo' | 'employee' | 'athlete';

export interface StaffUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string; // In production, this would be hashed and stored in a database
  role: UserRole;
  avatar?: string;
  phone?: string;
  hireDate: string;
  status: 'active' | 'suspended';
  permissions: string[];
}

export interface Payment {
  id: string;
  athleteId: string;
  athleteName: string;
  type: 'subscription' | 'single' | 'package';
  planName: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'refunded' | 'cancelled';
  method: 'shopify' | 'stripe' | 'cash' | 'transfer';
  shopifyOrderId?: string;
  date: string;
  dueDate?: string;
  period?: string; // e.g. "Febbraio 2026"
  notes?: string;
}

export interface Subscription {
  id: string;
  athleteId: string;
  athleteName: string;
  planName: string;
  sport: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  nextPayment: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  shopifySubscriptionId?: string;
  autoRenew: boolean;
}

export interface AthleteNote {
  id: string;
  athleteId: string;
  authorId: string;
  authorName: string;
  content: string;
  category: 'general' | 'injury' | 'nutrition' | 'mental' | 'performance' | 'admin';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  pinned: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'payment' | 'session' | 'goal' | 'checkin' | 'system' | 'athlete';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  athleteId?: string;
}

export interface AthleteUser {
  id: string;
  athleteId: string; // maps to athlete data id
  email: string;
  password: string;
  role: 'athlete';
  status: 'active' | 'suspended';
}

export interface AthleteDocument {
  id: string;
  athleteId: string;
  name: string;
  type: 'training-plan' | 'nutrition' | 'report' | 'contract' | 'medical' | 'other';
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  size?: string;
}

// ─── MOCK DATA ───

export const staffUsers: StaffUser[] = [
  {
    id: 'staff-1',
    name: 'Gabriele',
    surname: 'Regina',
    email: 'gabrieleregina714@gmail.com',
    password: 'Gabry200726',
    role: 'ceo',
    phone: '+393331234567',
    hireDate: '2025-01-01',
    status: 'active',
    permissions: ['all'],
  },
  {
    id: 'staff-2',
    name: 'Gabriele',
    surname: 'Regina',
    email: 'reginagabriele193@gmail.com',
    password: 'Gabry200726',
    role: 'employee',
    phone: '+393339876543',
    hireDate: '2025-06-01',
    status: 'active',
    permissions: ['athletes', 'calendar', 'training', 'measurements'],
  },
];

export const payments: Payment[] = [];

export const subscriptions: Subscription[] = [];

export const athleteNotes: AthleteNote[] = [];

export const notifications: Notification[] = [];

export const athleteUsers: AthleteUser[] = [];

export const athleteDocuments: AthleteDocument[] = [];

