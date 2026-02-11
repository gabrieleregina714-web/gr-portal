import { Athlete, TrainingPlan, Appointment, Goal, SmartGoal, WeeklyCheckIn, Achievement } from './types';

export const athletes: Athlete[] = [];

export const plans: TrainingPlan[] = [
  {
    id: 'p1', name: 'KO POWER', sport: 'boxing', category: 'Potenza',
    description: 'Sviluppa potenza devastante. Focus su esplosività, core e impatto.',
    duration: '8 settimane', difficulty: 'advanced',
    sessions: [
      { day: 'Lunedì', name: 'Upper Body Power', exercises: [
        { name: 'Bench Press Esplosiva', sets: 5, reps: '3', rest: '3 min', notes: 'Max velocità concentrica' },
        { name: 'Medicine Ball Chest Pass', sets: 4, reps: '8', rest: '90s' },
        { name: 'Landmine Press', sets: 4, reps: '6/lato', rest: '2 min' },
        { name: 'Plyometric Push-ups', sets: 4, reps: '8', rest: '90s' },
        { name: 'Heavy Bag Power Rounds', sets: 6, reps: '2 min', rest: '1 min', notes: 'Solo colpi potenti' },
      ]},
      { day: 'Mercoledì', name: 'Core & Rotazione', exercises: [
        { name: 'Rotational Med Ball Throw', sets: 5, reps: '8/lato', rest: '90s' },
        { name: 'Cable Woodchops', sets: 4, reps: '10/lato', rest: '60s' },
        { name: 'Pallof Press', sets: 3, reps: '12/lato', rest: '60s' },
        { name: 'Ab Wheel Rollout', sets: 4, reps: '10', rest: '90s' },
        { name: 'Shadow Boxing con Elastici', sets: 5, reps: '3 min', rest: '1 min' },
      ]},
      { day: 'Venerdì', name: 'Explosive Full Body', exercises: [
        { name: 'Power Clean', sets: 5, reps: '3', rest: '3 min' },
        { name: 'Box Jump', sets: 4, reps: '5', rest: '2 min' },
        { name: 'Kettlebell Swing', sets: 4, reps: '12', rest: '90s' },
        { name: 'Battle Ropes', sets: 5, reps: '30s', rest: '60s' },
        { name: 'Sparring Tecnico', sets: 4, reps: '3 min', rest: '1 min' },
      ]},
    ],
  },
  {
    id: 'p2', name: 'BODY RECOMP', sport: 'gym', category: 'Ricomposizione',
    description: 'Massa muscolare e riduzione grasso corporeo. Programma scientifico.',
    duration: '12 settimane', difficulty: 'intermediate',
    sessions: [
      { day: 'Lunedì', name: 'Push Day', exercises: [
        { name: 'Bench Press', sets: 4, reps: '8-10', rest: '2 min' },
        { name: 'Overhead Press', sets: 4, reps: '8-10', rest: '2 min' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '90s' },
        { name: 'Lateral Raises', sets: 4, reps: '12-15', rest: '60s' },
        { name: 'Tricep Pushdown', sets: 3, reps: '12-15', rest: '60s' },
      ]},
      { day: 'Martedì', name: 'Pull Day', exercises: [
        { name: 'Deadlift', sets: 4, reps: '6-8', rest: '3 min' },
        { name: 'Barbell Row', sets: 4, reps: '8-10', rest: '2 min' },
        { name: 'Lat Pulldown', sets: 3, reps: '10-12', rest: '90s' },
        { name: 'Face Pull', sets: 4, reps: '15', rest: '60s' },
        { name: 'Barbell Curl', sets: 3, reps: '10-12', rest: '60s' },
      ]},
      { day: 'Giovedì', name: 'Legs Day', exercises: [
        { name: 'Squat', sets: 4, reps: '8-10', rest: '3 min' },
        { name: 'Romanian Deadlift', sets: 4, reps: '10-12', rest: '2 min' },
        { name: 'Leg Press', sets: 3, reps: '12-15', rest: '2 min' },
        { name: 'Walking Lunges', sets: 3, reps: '12/gamba', rest: '90s' },
        { name: 'Calf Raises', sets: 4, reps: '15-20', rest: '60s' },
      ]},
    ],
  },
  {
    id: 'p3', name: 'VERTICAL LEAP', sport: 'basketball', category: 'Esplosività',
    description: 'Aumenta salto verticale e esplosività. Domina sotto canestro.',
    duration: '10 settimane', difficulty: 'advanced',
    sessions: [
      { day: 'Lunedì', name: 'Lower Body Power', exercises: [
        { name: 'Squat Jump con Bilanciere', sets: 5, reps: '5', rest: '3 min' },
        { name: 'Depth Jump', sets: 4, reps: '6', rest: '2 min' },
        { name: 'Single Leg Box Jump', sets: 4, reps: '5/gamba', rest: '2 min' },
        { name: 'Bulgarian Split Squat', sets: 4, reps: '8/gamba', rest: '90s' },
      ]},
      { day: 'Mercoledì', name: 'Agility & Speed', exercises: [
        { name: 'Ladder Drills', sets: 4, reps: '30s', rest: '60s' },
        { name: 'Cone Drills 5-10-5', sets: 6, reps: '1', rest: '90s' },
        { name: 'Lateral Bound', sets: 4, reps: '8/lato', rest: '90s' },
        { name: 'Sprint 20m', sets: 6, reps: '1', rest: '2 min' },
      ]},
    ],
  },
  {
    id: 'p4', name: 'ENDURANCE BEAST', sport: 'football', category: 'Resistenza',
    description: 'VO2max, resistenza e recupero per centrocampisti.',
    duration: '8 settimane', difficulty: 'intermediate',
    sessions: [
      { day: 'Lunedì', name: 'Interval Training', exercises: [
        { name: 'HIIT 30/30', sets: 10, reps: '30s sprint / 30s jog', rest: '3 min dopo 5' },
        { name: 'Shuttle Run', sets: 6, reps: '20m x 6', rest: '90s' },
        { name: 'Tempo Run', sets: 1, reps: '20 min', rest: '-' },
      ]},
      { day: 'Mercoledì', name: 'Forza Funzionale', exercises: [
        { name: 'Squat', sets: 4, reps: '8', rest: '2 min' },
        { name: 'Nordic Hamstring Curl', sets: 4, reps: '6', rest: '90s' },
        { name: 'Single Leg RDL', sets: 3, reps: '10/gamba', rest: '60s' },
        { name: 'Box Step-up', sets: 3, reps: '10/gamba', rest: '90s' },
      ]},
    ],
  },
  {
    id: 'p5', name: 'SPEED DEMON', sport: 'boxing', category: 'Velocità',
    description: 'Combinazioni veloci, footwork impeccabile, riflessi da campione.',
    duration: '6 settimane', difficulty: 'intermediate',
    sessions: [
      { day: 'Lunedì', name: 'Hand Speed', exercises: [
        { name: 'Speed Bag', sets: 6, reps: '2 min', rest: '30s' },
        { name: 'Double End Bag', sets: 5, reps: '3 min', rest: '1 min' },
        { name: 'Shadow Boxing Velocità', sets: 5, reps: '3 min', rest: '1 min' },
        { name: 'Resistance Band Punches', sets: 4, reps: '20/braccio', rest: '60s' },
      ]},
      { day: 'Mercoledì', name: 'Footwork', exercises: [
        { name: 'Ladder Drills Boxing', sets: 5, reps: '30s', rest: '30s' },
        { name: 'Jump Rope', sets: 6, reps: '3 min', rest: '30s' },
        { name: 'Pivot & Angle Drill', sets: 4, reps: '2 min', rest: '60s' },
      ]},
    ],
  },
  {
    id: 'p6', name: 'FAT BURNER', sport: 'gym', category: 'Dimagrimento',
    description: 'Circuiti ad alta intensità. Brucia grasso, mantieni massa.',
    duration: '10 settimane', difficulty: 'beginner',
    sessions: [
      { day: 'Lunedì', name: 'Circuit Training A', exercises: [
        { name: 'Goblet Squat', sets: 4, reps: '15', rest: '30s' },
        { name: 'Push-up', sets: 4, reps: '12', rest: '30s' },
        { name: 'Kettlebell Swing', sets: 4, reps: '15', rest: '30s' },
        { name: 'Mountain Climbers', sets: 4, reps: '20/lato', rest: '60s' },
      ]},
      { day: 'Mercoledì', name: 'Cardio HIIT', exercises: [
        { name: 'Burpees', sets: 5, reps: '10', rest: '45s' },
        { name: 'Battle Ropes', sets: 5, reps: '30s', rest: '30s' },
        { name: 'Box Jump', sets: 4, reps: '10', rest: '45s' },
        { name: 'Rowing 500m', sets: 1, reps: 'All out', rest: '-' },
      ]},
    ],
  },
];

export const appointments: Appointment[] = [];

export const goals: Goal[] = [];

export const smartGoals: SmartGoal[] = [];

export const weeklyCheckIns: WeeklyCheckIn[] = [];

export const achievements: Achievement[] = [];

