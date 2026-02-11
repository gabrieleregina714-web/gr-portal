export type Sport = 'boxing' | 'basketball' | 'football' | 'gym';

export interface Athlete {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  sport: Sport;
  age: number;
  height: number;
  weight: number;
  goal: string;
  startDate: string;
  status: 'active' | 'paused' | 'completed';
  notes: string;
  measurements: Measurement[];
  assignedPlans: string[];
  avatar?: string;
  coverPhoto?: string;
}

export interface Measurement {
  date: string;
  weight: number;
  bodyFat?: number;
  benchPress?: number;
  squat?: number;
  deadlift?: number;
  sprintTime?: number;
  vo2max?: number;
  punchPower?: number;
  verticalJump?: number;
}

export interface TrainingPlan {
  id: string;
  name: string;
  sport: Sport;
  category: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  sessions: TrainingSession[];
}

export interface TrainingSession {
  day: string;
  name: string;
  exercises: Exercise[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  athleteId: string;
  athleteName: string;
  type: 'training' | 'call' | 'assessment' | 'review';
  date: string;
  time: string;
  duration: number;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  sport: Sport;
}

export interface Goal {
  id: string;
  athleteId: string;
  title: string;
  target: string;
  current: string;
  progress: number;
  deadline: string;
  status: 'in-progress' | 'achieved' | 'missed';
}

export interface SmartGoal {
  id: string;
  athleteId: string;
  title: string;
  sport: Sport;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  metric: string;
  unit: string;
  startValue: number;
  currentValue: number;
  targetValue: number;
  milestones: Milestone[];
  deadline: string;
  createdAt: string;
  status: 'in-progress' | 'achieved' | 'missed';
}

export interface Milestone {
  id: string;
  label: string;
  value: number;
  achieved: boolean;
  achievedDate?: string;
}

export interface WeeklyCheckIn {
  id: string;
  athleteId: string;
  date: string;
  mood: number;
  energy: number;
  motivation: number;
  sleepQuality: number;
  soreness: number;
  notes: string;
  wins: string;
}

export interface Achievement {
  id: string;
  athleteId: string;
  title: string;
  description: string;
  unlockedAt?: string;
  category: 'streak' | 'milestone' | 'pr' | 'consistency' | 'mindset';
}

export const SPORT_GOAL_TEMPLATES: Record<Sport, { label: string; metric: string; unit: string }[]> = {
  boxing: [
    { label: 'Punch Power', metric: 'punchPower', unit: 'u' },
    { label: 'Peso Gara', metric: 'weight', unit: 'kg' },
    { label: 'Bench Press', metric: 'benchPress', unit: 'kg' },
    { label: 'Sprint', metric: 'sprintTime', unit: 's' },
  ],
  basketball: [
    { label: 'Salto Verticale', metric: 'verticalJump', unit: 'cm' },
    { label: 'Sprint 100m', metric: 'sprintTime', unit: 's' },
    { label: 'Peso Forma', metric: 'weight', unit: 'kg' },
  ],
  football: [
    { label: 'Sprint 100m', metric: 'sprintTime', unit: 's' },
    { label: 'VO2max', metric: 'vo2max', unit: 'ml/kg/min' },
    { label: 'Forza Gambe', metric: 'squat', unit: 'kg' },
    { label: 'Peso Forma', metric: 'weight', unit: 'kg' },
  ],
  gym: [
    { label: 'Bench Press', metric: 'benchPress', unit: 'kg' },
    { label: 'Squat', metric: 'squat', unit: 'kg' },
    { label: 'Deadlift', metric: 'deadlift', unit: 'kg' },
    { label: 'Body Fat', metric: 'bodyFat', unit: '%' },
    { label: 'Peso', metric: 'weight', unit: 'kg' },
  ],
};

export const MOTIVATIONAL_QUOTES: Record<Sport, string[]> = {
  boxing: [
    '"Non conta quanto forte colpisci, conta quanto forte riesci ad incassare." — Rocky Balboa',
    '"Fuggi da ciò che è comodo. Soffri ora e vivi il resto della tua vita come un campione." — Muhammad Ali',
    '"L\'ultimo round è quello che conta di più."',
  ],
  basketball: [
    '"Ho fallito più e più volte nella mia vita. Ed è per questo che ho avuto successo." — Michael Jordan',
    '"La differenza tra l\'impossibile e il possibile sta nella determinazione." — LeBron James',
    '"Il talento ti fa vincere una partita. Il lavoro e l\'intelligenza un campionato." — Michael Jordan',
  ],
  football: [
    '"Non arrenderti. Non arrenderti mai." — Cristiano Ronaldo',
    '"Ogni campione è stato prima un contendente che ha rifiutato di arrendersi." — Pelé',
    '"Il calcio è lo sport più bello del mondo, ma servono gambe per giocarlo." — Zinedine Zidane',
  ],
  gym: [
    '"Il dolore che senti oggi sarà la forza che senti domani."',
    '"Il corpo raggiunge ciò che la mente crede."',
    '"Non allenarti fino a quando non ce la fai più. Allenati fino a quando non devi più dimostrare niente."',
  ],
};

export const SPORTS: Record<Sport, { label: string; color: string; image: string; video: string }> = {
  boxing: {
    label: 'Boxe',
    color: '#C8102E',
    image: 'https://cdn.shopify.com/s/files/1/0969/1801/2243/files/ivana-cajina-rdZg6xmnpVM-unsplash.jpg?v=1770735527',
    video: 'https://cdn.shopify.com/videos/c/o/v/673e9ced982048dc8e59304eb4904c7a.mp4',
  },
  basketball: {
    label: 'Basket',
    color: '#F59E0B',
    image: 'https://cdn.shopify.com/s/files/1/0969/1801/2243/files/pexels-cottonbro-5274989.jpg?v=1759134212',
    video: 'https://cdn.shopify.com/videos/c/o/v/469000e845844f6e9fead297effa5ff9.mp4',
  },
  football: {
    label: 'Calcio',
    color: '#22C55E',
    image: 'https://cdn.shopify.com/s/files/1/0969/1801/2243/files/gurdaas-malik-iN00l7vz7dM-unsplash.jpg?v=1770735674',
    video: 'https://cdn.shopify.com/videos/c/o/v/6a8167baa90041eba727c82ce0ef19a7.mp4',
  },
  gym: {
    label: 'Palestra',
    color: '#6366F1',
    image: 'https://cdn.shopify.com/s/files/1/0969/1801/2243/files/pexels-marcuschanmedia-18112396.jpg?v=1757197638',
    video: 'https://cdn.shopify.com/videos/c/o/v/9ba439e2020340f78f2c429016943d4a.mp4',
  },
};

export const APPOINTMENT_TYPES: Record<string, { label: string; dot: string; color: string }> = {
  training:   { label: 'Allenamento',  dot: 'dot-training',   color: '#FFFFFF' },
  call:       { label: 'Chiamata',     dot: 'dot-call',       color: '#25D366' },
  assessment: { label: 'Valutazione',  dot: 'dot-assessment', color: '#C8102E' },
  review:     { label: 'Review',       dot: 'dot-review',     color: '#6366F1' },
};
