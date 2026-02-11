import { create } from 'zustand';
import type { Appointment, Athlete, SmartGoal, Achievement, WeeklyCheckIn } from './types';
import type { AthleteNote, AthleteDocument } from './auth-data';

const api = (col: string) => `/api/data/${col}`;

export interface AppNotification {
  id: string;
  userId: string;
  athleteId?: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

interface AppState {
  // Data
  athletes: Athlete[];
  appointments: Appointment[];
  smartGoals: SmartGoal[];
  achievements: Achievement[];
  weeklyCheckIns: WeeklyCheckIn[];
  athleteNotes: AthleteNote[];
  athleteDocuments: AthleteDocument[];
  notifications: AppNotification[];
  loading: boolean;

  // Fetch
  fetchAthletes: () => Promise<void>;
  fetchAppointments: () => Promise<void>;
  fetchSmartGoals: () => Promise<void>;
  fetchAchievements: () => Promise<void>;
  fetchWeeklyCheckIns: () => Promise<void>;
  fetchAthleteNotes: (athleteId?: string) => Promise<void>;
  fetchAthleteDocuments: (athleteId?: string) => Promise<void>;
  fetchNotifications: (userId?: string) => Promise<void>;
  fetchAll: () => Promise<void>;

  // Appointments
  addAppointment: (apt: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<void>;

  // Athletes
  updateAthlete: (id: string, updates: Partial<Athlete>) => Promise<void>;

  // Smart Goals
  addSmartGoal: (goal: Omit<SmartGoal, 'id'>) => Promise<void>;
  updateSmartGoal: (id: string, updates: Partial<SmartGoal>) => Promise<void>;
  deleteSmartGoal: (id: string) => Promise<void>;

  // Achievements
  addAchievement: (ach: Omit<Achievement, 'id'>) => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;

  // Check-ins
  addCheckIn: (ci: Omit<WeeklyCheckIn, 'id'>) => Promise<void>;

  // Notes
  addNote: (note: Omit<AthleteNote, 'id'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<AthleteNote>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;

  // Documents
  addDocument: (doc: Omit<AthleteDocument, 'id'>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;

  // Measurements (on athlete)
  addMeasurement: (athleteId: string, measurement: any) => Promise<void>;

  // Notifications
  addNotification: (notif: { athleteId: string; athleteName: string; athleteEmail?: string; type: string; title: string; message: string; link?: string; sendEmail?: boolean }) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: (userId: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  athletes: [],
  appointments: [],
  smartGoals: [],
  achievements: [],
  weeklyCheckIns: [],
  athleteNotes: [],
  athleteDocuments: [],
  notifications: [],
  loading: false,

  fetchAthletes: async () => {
    const res = await fetch(api('athletes'));
    const data = await res.json();
    set({ athletes: data });
  },

  fetchAppointments: async () => {
    const res = await fetch(api('appointments'));
    const data = await res.json();
    set({ appointments: data });
  },

  fetchSmartGoals: async () => {
    const res = await fetch(api('smartGoals'));
    const data = await res.json();
    set({ smartGoals: data });
  },

  fetchAchievements: async () => {
    const res = await fetch(api('achievements'));
    const data = await res.json();
    set({ achievements: data });
  },

  fetchWeeklyCheckIns: async () => {
    const res = await fetch(api('weeklyCheckIns'));
    const data = await res.json();
    set({ weeklyCheckIns: data });
  },

  fetchAthleteNotes: async (athleteId?: string) => {
    const url = athleteId ? `${api('athleteNotes')}?athleteId=${athleteId}` : api('athleteNotes');
    const res = await fetch(url);
    const data = await res.json();
    set({ athleteNotes: data });
  },

  fetchAthleteDocuments: async (athleteId?: string) => {
    const url = athleteId ? `${api('athleteDocuments')}?athleteId=${athleteId}` : api('athleteDocuments');
    const res = await fetch(url);
    const data = await res.json();
    set({ athleteDocuments: data });
  },

  fetchNotifications: async (userId?: string) => {
    const res = await fetch(api('notifications'));
    const data = await res.json();
    if (userId) {
      set({ notifications: data.filter((n: AppNotification) => n.userId === userId) });
    } else {
      set({ notifications: data });
    }
  },

  fetchAll: async () => {
    set({ loading: true });
    await Promise.all([
      get().fetchAthletes(),
      get().fetchAppointments(),
      get().fetchSmartGoals(),
      get().fetchAchievements(),
      get().fetchWeeklyCheckIns(),
      get().fetchAthleteNotes(),
      get().fetchAthleteDocuments(),
      get().fetchNotifications(),
    ]);
    set({ loading: false });
  },

  // Appointments
  addAppointment: async (apt) => {
    const res = await fetch(api('appointments'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apt),
    });
    const created = await res.json();
    set((s) => ({ appointments: [...s.appointments, created] }));
  },

  updateAppointment: async (id, updates) => {
    await fetch(api('appointments'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    set((s) => ({
      appointments: s.appointments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  },

  // Athletes
  updateAthlete: async (id, updates) => {
    await fetch(api('athletes'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    set((s) => ({
      athletes: s.athletes.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  },

  // Smart Goals
  addSmartGoal: async (goal) => {
    const res = await fetch(api('smartGoals'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal),
    });
    const created = await res.json();
    set((s) => ({ smartGoals: [...s.smartGoals, created] }));
  },

  updateSmartGoal: async (id, updates) => {
    await fetch(api('smartGoals'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    set((s) => ({
      smartGoals: s.smartGoals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  },

  deleteSmartGoal: async (id) => {
    await fetch(`${api('smartGoals')}?id=${id}`, { method: 'DELETE' });
    set((s) => ({ smartGoals: s.smartGoals.filter((g) => g.id !== id) }));
  },

  // Achievements
  addAchievement: async (ach) => {
    const res = await fetch(api('achievements'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ach),
    });
    const created = await res.json();
    set((s) => ({ achievements: [...s.achievements, created] }));
  },

  deleteAchievement: async (id) => {
    await fetch(`${api('achievements')}?id=${id}`, { method: 'DELETE' });
    set((s) => ({ achievements: s.achievements.filter((a) => a.id !== id) }));
  },

  // Check-ins
  addCheckIn: async (ci) => {
    const res = await fetch(api('weeklyCheckIns'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ci),
    });
    const created = await res.json();
    set((s) => ({ weeklyCheckIns: [...s.weeklyCheckIns, created] }));
  },

  // Notes
  addNote: async (note) => {
    const res = await fetch(api('athleteNotes'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    const created = await res.json();
    set((s) => ({ athleteNotes: [...s.athleteNotes, created] }));
  },

  updateNote: async (id, updates) => {
    await fetch(api('athleteNotes'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    set((s) => ({
      athleteNotes: s.athleteNotes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }));
  },

  deleteNote: async (id) => {
    await fetch(`${api('athleteNotes')}?id=${id}`, { method: 'DELETE' });
    set((s) => ({ athleteNotes: s.athleteNotes.filter((n) => n.id !== id) }));
  },

  // Documents
  addDocument: async (doc) => {
    const res = await fetch(api('athleteDocuments'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    const created = await res.json();
    set((s) => ({ athleteDocuments: [...s.athleteDocuments, created] }));
  },

  deleteDocument: async (id) => {
    await fetch(`${api('athleteDocuments')}?id=${id}`, { method: 'DELETE' });
    set((s) => ({ athleteDocuments: s.athleteDocuments.filter((d) => d.id !== id) }));
  },

  // Measurements
  addMeasurement: async (athleteId, measurement) => {
    const athlete = get().athletes.find((a) => a.id === athleteId);
    if (!athlete) return;
    const updatedMeasurements = [...athlete.measurements, measurement];
    await fetch(api('athletes'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: athleteId, measurements: updatedMeasurements }),
    });
    set((s) => ({
      athletes: s.athletes.map((a) =>
        a.id === athleteId ? { ...a, measurements: updatedMeasurements } : a
      ),
    }));
  },

  // Notifications
  addNotification: async (notif) => {
    const res = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notif),
    });
    const { notification } = await res.json();
    if (notification) {
      set((s) => ({ notifications: [notification, ...s.notifications] }));
    }
  },

  markNotificationRead: async (id) => {
    await fetch(api('notifications'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read: true }),
    });
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  },

  markAllNotificationsRead: async (userId) => {
    const unread = get().notifications.filter((n) => n.userId === userId && !n.read);
    await Promise.all(
      unread.map((n) =>
        fetch(api('notifications'), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: n.id, read: true }),
        })
      )
    );
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.userId === userId ? { ...n, read: true } : n
      ),
    }));
  },
}));
