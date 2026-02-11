import { Athlete, TrainingPlan, Appointment, Goal, SmartGoal, WeeklyCheckIn, Achievement } from './types';

export const athletes: Athlete[] = [
  {
    id: '1', name: 'Marco', surname: 'Rossi', email: 'marco.rossi@email.com', phone: '+393331234567',
    sport: 'boxing', age: 24, height: 178, weight: 76, goal: 'Preparazione match — potenza KO',
    startDate: '2025-09-15', status: 'active', notes: 'Motivato, buona base atletica. Lavorare su gancio sinistro.',
    measurements: [
      { date: '2025-09-15', weight: 79, bodyFat: 18, punchPower: 65, benchPress: 80 },
      { date: '2025-10-15', weight: 78, bodyFat: 16, punchPower: 72, benchPress: 85 },
      { date: '2025-11-15', weight: 77, bodyFat: 15, punchPower: 78, benchPress: 90 },
      { date: '2025-12-15', weight: 76.5, bodyFat: 14, punchPower: 82, benchPress: 92 },
      { date: '2026-01-15', weight: 76, bodyFat: 13, punchPower: 88, benchPress: 95 },
    ],
    assignedPlans: ['p1'],
  },
  {
    id: '2', name: 'Luca', surname: 'Bianchi', email: 'luca.bianchi@email.com', phone: '+393409876543',
    sport: 'basketball', age: 20, height: 191, weight: 85, goal: 'Esplosività e verticalità',
    startDate: '2025-10-01', status: 'active', notes: 'Serie C. Focus su salto e agilità laterale.',
    measurements: [
      { date: '2025-10-01', weight: 87, verticalJump: 58, sprintTime: 12.1 },
      { date: '2025-11-01', weight: 86, verticalJump: 62, sprintTime: 11.8 },
      { date: '2025-12-01', weight: 85.5, verticalJump: 65, sprintTime: 11.5 },
      { date: '2026-01-01', weight: 85, verticalJump: 68, sprintTime: 11.3 },
    ],
    assignedPlans: ['p3'],
  },
  {
    id: '3', name: 'Alessandro', surname: 'Conti', email: 'ale.conti@email.com', phone: '+393285551234',
    sport: 'football', age: 22, height: 175, weight: 72, goal: 'Resistenza e velocità — centrocampista',
    startDate: '2025-08-20', status: 'active', notes: 'Juniores provinciale. Buona tecnica, migliorare fisicamente.',
    measurements: [
      { date: '2025-08-20', weight: 74, sprintTime: 12.5, vo2max: 48 },
      { date: '2025-09-20', weight: 73, sprintTime: 12.2, vo2max: 50 },
      { date: '2025-10-20', weight: 72.5, sprintTime: 11.9, vo2max: 52 },
      { date: '2025-11-20', weight: 72, sprintTime: 11.7, vo2max: 54 },
      { date: '2025-12-20', weight: 72, sprintTime: 11.5, vo2max: 56 },
    ],
    assignedPlans: ['p4'],
  },
  {
    id: '4', name: 'Davide', surname: 'Ferrara', email: 'davide.f@email.com', phone: '+393477778899',
    sport: 'gym', age: 28, height: 182, weight: 88, goal: 'Body recomp — massa e definizione',
    startDate: '2025-11-01', status: 'active', notes: 'Esperienza intermedia. Obiettivo estate 2026.',
    measurements: [
      { date: '2025-11-01', weight: 92, bodyFat: 22, benchPress: 90, squat: 110, deadlift: 130 },
      { date: '2025-12-01', weight: 90, bodyFat: 20, benchPress: 95, squat: 120, deadlift: 140 },
      { date: '2026-01-01', weight: 88, bodyFat: 18, benchPress: 100, squat: 125, deadlift: 145 },
    ],
    assignedPlans: ['p2'],
  },
  {
    id: '5', name: 'Simone', surname: 'Greco', email: 'simone.g@email.com', phone: '+393354443322',
    sport: 'boxing', age: 19, height: 172, weight: 65, goal: 'Velocità combinazioni e footwork',
    startDate: '2025-12-01', status: 'active', notes: 'Principiante con grande potenziale.',
    measurements: [
      { date: '2025-12-01', weight: 66, punchPower: 45, sprintTime: 11.8 },
      { date: '2026-01-01', weight: 65, punchPower: 52, sprintTime: 11.5 },
    ],
    assignedPlans: ['p5'],
  },
  {
    id: '6', name: 'Matteo', surname: 'Lombardi', email: 'matteo.l@email.com', phone: '+393201112233',
    sport: 'gym', age: 35, height: 176, weight: 95, goal: 'Dimagrimento e tonificazione',
    startDate: '2025-10-15', status: 'paused', notes: 'Infortunio spalla sinistra. Riprende a marzo.',
    measurements: [
      { date: '2025-10-15', weight: 102, bodyFat: 28, benchPress: 60, squat: 80 },
      { date: '2025-11-15', weight: 99, bodyFat: 26, benchPress: 65, squat: 85 },
      { date: '2025-12-15', weight: 97, bodyFat: 25, benchPress: 70, squat: 90 },
    ],
    assignedPlans: ['p6'],
  },
];

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

export const appointments: Appointment[] = [
  { id: 'a1', athleteId: '1', athleteName: 'Marco Rossi', type: 'training', date: '2026-02-10', time: '09:00', duration: 90, notes: 'KO Power — Focus gancio sinistro', status: 'scheduled', sport: 'boxing' },
  { id: 'a2', athleteId: '2', athleteName: 'Luca Bianchi', type: 'training', date: '2026-02-10', time: '11:00', duration: 75, notes: 'Test salto verticale + pliometria', status: 'scheduled', sport: 'basketball' },
  { id: 'a3', athleteId: '4', athleteName: 'Davide Ferrara', type: 'training', date: '2026-02-10', time: '16:00', duration: 60, notes: 'Push Day — aumentare carico bench', status: 'scheduled', sport: 'gym' },
  { id: 'a4', athleteId: '3', athleteName: 'Alessandro Conti', type: 'call', date: '2026-02-10', time: '18:30', duration: 30, notes: 'Check settimanale', status: 'scheduled', sport: 'football' },
  { id: 'a5', athleteId: '5', athleteName: 'Simone Greco', type: 'assessment', date: '2026-02-11', time: '10:00', duration: 60, notes: 'Valutazione mensile — test velocità mani', status: 'scheduled', sport: 'boxing' },
  { id: 'a6', athleteId: '1', athleteName: 'Marco Rossi', type: 'training', date: '2026-02-12', time: '09:00', duration: 90, notes: 'Core & Rotazione', status: 'scheduled', sport: 'boxing' },
  { id: 'a7', athleteId: '4', athleteName: 'Davide Ferrara', type: 'review', date: '2026-02-13', time: '17:00', duration: 45, notes: 'Review mensile — nuove misurazioni', status: 'scheduled', sport: 'gym' },
  { id: 'a8', athleteId: '2', athleteName: 'Luca Bianchi', type: 'training', date: '2026-02-14', time: '11:00', duration: 75, notes: 'Agility & Speed day', status: 'scheduled', sport: 'basketball' },
];

export const goals: Goal[] = [
  { id: 'g1', athleteId: '1', title: 'Punch Power 90+', target: '90', current: '88', progress: 88, deadline: '2026-03-15', status: 'in-progress' },
  { id: 'g2', athleteId: '1', title: 'Peso 75kg', target: '75', current: '76', progress: 75, deadline: '2026-04-01', status: 'in-progress' },
  { id: 'g3', athleteId: '2', title: 'Vertical Jump 75cm', target: '75', current: '68', progress: 68, deadline: '2026-05-01', status: 'in-progress' },
  { id: 'g4', athleteId: '3', title: 'VO2max 60', target: '60', current: '56', progress: 80, deadline: '2026-04-01', status: 'in-progress' },
  { id: 'g5', athleteId: '4', title: 'Body Fat 15%', target: '15', current: '18', progress: 60, deadline: '2026-06-01', status: 'in-progress' },
  { id: 'g6', athleteId: '4', title: 'Bench 110kg', target: '110', current: '100', progress: 70, deadline: '2026-06-01', status: 'in-progress' },
  { id: 'g7', athleteId: '5', title: 'Punch Power 65', target: '65', current: '52', progress: 52, deadline: '2026-04-01', status: 'in-progress' },
];

export const smartGoals: SmartGoal[] = [
  {
    id: 'sg1', athleteId: '1', title: 'Punch Power 90+', sport: 'boxing',
    specific: 'Raggiungere un punch power di 90 unità nel colpo diretto destro',
    measurable: 'Misurato tramite sensore di impatto durante le sessioni',
    achievable: 'Attualmente a 88, crescita costante di +4u/mese da settembre',
    relevant: 'Essenziale per la preparazione al match di aprile',
    timeBound: 'Entro il 15 marzo 2026 — restano 33 giorni',
    metric: 'punchPower', unit: 'u', startValue: 65, currentValue: 88, targetValue: 90,
    milestones: [
      { id: 'm1', label: 'Base 70', value: 70, achieved: true, achievedDate: '2025-10-01' },
      { id: 'm2', label: 'Intermedio 80', value: 80, achieved: true, achievedDate: '2025-12-01' },
      { id: 'm3', label: 'Avanzato 85', value: 85, achieved: true, achievedDate: '2026-01-01' },
      { id: 'm4', label: 'Target 90', value: 90, achieved: false },
    ],
    deadline: '2026-03-15', createdAt: '2025-09-15', status: 'in-progress',
  },
  {
    id: 'sg2', athleteId: '1', title: 'Peso Gara 75kg', sport: 'boxing',
    specific: 'Raggiungere il peso gara di 75 kg mantenendo la massa muscolare',
    measurable: 'Peso corporeo misurato settimanalmente a digiuno',
    achievable: 'Calo costante di 0.75kg/mese, attualmente a 76kg',
    relevant: 'Categoria di peso per il match — requisito obbligatorio',
    timeBound: 'Entro il 1 aprile 2026',
    metric: 'weight', unit: 'kg', startValue: 79, currentValue: 76, targetValue: 75,
    milestones: [
      { id: 'm5', label: '78 kg', value: 78, achieved: true, achievedDate: '2025-10-15' },
      { id: 'm6', label: '77 kg', value: 77, achieved: true, achievedDate: '2025-11-15' },
      { id: 'm7', label: '76 kg', value: 76, achieved: true, achievedDate: '2026-01-15' },
      { id: 'm8', label: '75 kg', value: 75, achieved: false },
    ],
    deadline: '2026-04-01', createdAt: '2025-09-15', status: 'in-progress',
  },
  {
    id: 'sg3', athleteId: '2', title: 'Vertical Jump 75cm', sport: 'basketball',
    specific: 'Aumentare il salto verticale da fermo a 75 cm',
    measurable: 'Test Vertec ogni 2 settimane',
    achievable: 'Crescita di 3.3cm/mese, partendo da 58cm, ora a 68cm',
    relevant: 'Dominare sotto canestro e migliorare le capacità di rimbalzo',
    timeBound: 'Entro il 1 maggio 2026',
    metric: 'verticalJump', unit: 'cm', startValue: 58, currentValue: 68, targetValue: 75,
    milestones: [
      { id: 'm9', label: '62 cm', value: 62, achieved: true, achievedDate: '2025-11-01' },
      { id: 'm10', label: '66 cm', value: 66, achieved: true, achievedDate: '2025-12-15' },
      { id: 'm11', label: '70 cm', value: 70, achieved: false },
      { id: 'm12', label: '75 cm', value: 75, achieved: false },
    ],
    deadline: '2026-05-01', createdAt: '2025-10-01', status: 'in-progress',
  },
  {
    id: 'sg4', athleteId: '2', title: 'Sprint sotto 11s', sport: 'basketball',
    specific: 'Portare il tempo sui 100m sotto gli 11 secondi',
    measurable: 'Cronometraggio elettronico ogni 2 settimane',
    achievable: 'Miglioramento di 0.2s/mese, da 12.1s a 11.3s',
    relevant: 'Velocità in campo per transizioni offensive e difensive',
    timeBound: 'Entro il 1 giugno 2026',
    metric: 'sprintTime', unit: 's', startValue: 12.1, currentValue: 11.3, targetValue: 11.0,
    milestones: [
      { id: 'm29', label: '11.8s', value: 11.8, achieved: true, achievedDate: '2025-11-01' },
      { id: 'm30', label: '11.5s', value: 11.5, achieved: true, achievedDate: '2025-12-01' },
      { id: 'm31', label: '11.2s', value: 11.2, achieved: false },
      { id: 'm32', label: '11.0s', value: 11.0, achieved: false },
    ],
    deadline: '2026-06-01', createdAt: '2025-10-01', status: 'in-progress',
  },
  {
    id: 'sg5', athleteId: '3', title: 'VO2max 60', sport: 'football',
    specific: 'Portare il VO2max a 60 ml/kg/min per dominare a centrocampo',
    measurable: 'Test incrementale su tapis roulant mensile',
    achievable: 'Miglioramento di 1.6/mese, da 48 a 56 in 5 mesi',
    relevant: 'Resistenza fondamentale per coprire 12km a partita',
    timeBound: 'Entro il 1 aprile 2026',
    metric: 'vo2max', unit: 'ml/kg/min', startValue: 48, currentValue: 56, targetValue: 60,
    milestones: [
      { id: 'm13', label: '50', value: 50, achieved: true, achievedDate: '2025-09-20' },
      { id: 'm14', label: '54', value: 54, achieved: true, achievedDate: '2025-11-20' },
      { id: 'm15', label: '57', value: 57, achieved: false },
      { id: 'm16', label: '60', value: 60, achieved: false },
    ],
    deadline: '2026-04-01', createdAt: '2025-08-20', status: 'in-progress',
  },
  {
    id: 'sg6', athleteId: '3', title: 'Sprint 11.0s', sport: 'football',
    specific: 'Raggiungere un tempo di 11.0 secondi sui 100m',
    measurable: 'Test sprint cronometrato ogni sessione di velocità',
    achievable: 'Calo di 0.25s/mese, da 12.5s a 11.5s attuale',
    relevant: 'Velocità fondamentale per scatti in partita e pressione alta',
    timeBound: 'Entro il 1 maggio 2026',
    metric: 'sprintTime', unit: 's', startValue: 12.5, currentValue: 11.5, targetValue: 11.0,
    milestones: [
      { id: 'm33', label: '12.0s', value: 12.0, achieved: true, achievedDate: '2025-09-20' },
      { id: 'm34', label: '11.5s', value: 11.5, achieved: true, achievedDate: '2025-12-20' },
      { id: 'm35', label: '11.2s', value: 11.2, achieved: false },
      { id: 'm36', label: '11.0s', value: 11.0, achieved: false },
    ],
    deadline: '2026-05-01', createdAt: '2025-08-20', status: 'in-progress',
  },
  {
    id: 'sg7', athleteId: '4', title: 'Body Fat 15%', sport: 'gym',
    specific: 'Ridurre la percentuale di grasso corporeo al 15%',
    measurable: 'Plicometria professionale ogni 2 settimane',
    achievable: 'Calo di 2%/mese con dieta e cardio moderato',
    relevant: 'Obiettivo definizione per estate 2026',
    timeBound: 'Entro il 1 giugno 2026',
    metric: 'bodyFat', unit: '%', startValue: 22, currentValue: 18, targetValue: 15,
    milestones: [
      { id: 'm17', label: '20%', value: 20, achieved: true, achievedDate: '2025-12-01' },
      { id: 'm18', label: '18%', value: 18, achieved: true, achievedDate: '2026-01-01' },
      { id: 'm19', label: '16%', value: 16, achieved: false },
      { id: 'm20', label: '15%', value: 15, achieved: false },
    ],
    deadline: '2026-06-01', createdAt: '2025-11-01', status: 'in-progress',
  },
  {
    id: 'sg8', athleteId: '4', title: 'Bench Press 110kg', sport: 'gym',
    specific: 'Raggiungere 110 kg di massimale su panca piana',
    measurable: 'Test 1RM ogni 3 settimane',
    achievable: 'Progressione di 5kg/mese, dai 90kg iniziali',
    relevant: 'Forza upper body e obiettivo personale di lungo termine',
    timeBound: 'Entro il 1 giugno 2026',
    metric: 'benchPress', unit: 'kg', startValue: 90, currentValue: 100, targetValue: 110,
    milestones: [
      { id: 'm21', label: '95 kg', value: 95, achieved: true, achievedDate: '2025-12-01' },
      { id: 'm22', label: '100 kg', value: 100, achieved: true, achievedDate: '2026-01-01' },
      { id: 'm23', label: '105 kg', value: 105, achieved: false },
      { id: 'm24', label: '110 kg', value: 110, achieved: false },
    ],
    deadline: '2026-06-01', createdAt: '2025-11-01', status: 'in-progress',
  },
  {
    id: 'sg9', athleteId: '4', title: 'Squat 140kg', sport: 'gym',
    specific: 'Portare il massimale di squat a 140 kg',
    measurable: 'Test 1RM ogni 3 settimane con spotter',
    achievable: 'Progressione di 5kg/mese, da 110kg a 125kg attuale',
    relevant: 'Forza lower body, base per tutti gli altri esercizi',
    timeBound: 'Entro il 1 giugno 2026',
    metric: 'squat', unit: 'kg', startValue: 110, currentValue: 125, targetValue: 140,
    milestones: [
      { id: 'm37', label: '115 kg', value: 115, achieved: true, achievedDate: '2025-11-15' },
      { id: 'm38', label: '120 kg', value: 120, achieved: true, achievedDate: '2025-12-01' },
      { id: 'm39', label: '130 kg', value: 130, achieved: false },
      { id: 'm40', label: '140 kg', value: 140, achieved: false },
    ],
    deadline: '2026-06-01', createdAt: '2025-11-01', status: 'in-progress',
  },
  {
    id: 'sg10', athleteId: '5', title: 'Punch Power 65', sport: 'boxing',
    specific: 'Sviluppare punch power base di 65 unità',
    measurable: 'Sensore di impatto durante ogni sessione',
    achievable: 'Principiante con grande potenziale, +7u in 1 mese',
    relevant: 'Costruire potenza di base prima della tecnica avanzata',
    timeBound: 'Entro il 1 aprile 2026',
    metric: 'punchPower', unit: 'u', startValue: 45, currentValue: 52, targetValue: 65,
    milestones: [
      { id: 'm25', label: '50', value: 50, achieved: true, achievedDate: '2025-12-20' },
      { id: 'm26', label: '55', value: 55, achieved: false },
      { id: 'm27', label: '60', value: 60, achieved: false },
      { id: 'm28', label: '65', value: 65, achieved: false },
    ],
    deadline: '2026-04-01', createdAt: '2025-12-01', status: 'in-progress',
  },
];

export const weeklyCheckIns: WeeklyCheckIn[] = [
  // Marco
  { id: 'ci1', athleteId: '1', date: '2025-12-29', mood: 7, energy: 6, motivation: 8, sleepQuality: 7, soreness: 5, notes: 'Ritmo buono dopo le feste', wins: 'Mantenuto peso durante Natale' },
  { id: 'ci2', athleteId: '1', date: '2026-01-05', mood: 8, energy: 7, motivation: 9, sleepQuality: 8, soreness: 4, notes: 'Inizio anno carico', wins: 'PR al bench press 95kg' },
  { id: 'ci3', athleteId: '1', date: '2026-01-12', mood: 6, energy: 5, motivation: 7, sleepQuality: 5, soreness: 7, notes: 'Settimana dura, poco sonno', wins: 'Completato tutte le sessioni' },
  { id: 'ci4', athleteId: '1', date: '2026-01-19', mood: 8, energy: 7, motivation: 8, sleepQuality: 7, soreness: 4, notes: 'Recupero migliorato', wins: 'Punch power 86, nuovo record' },
  { id: 'ci5', athleteId: '1', date: '2026-01-26', mood: 9, energy: 8, motivation: 9, sleepQuality: 8, soreness: 3, notes: 'Settimana perfetta', wins: 'Peso sceso a 76.2kg' },
  { id: 'ci6', athleteId: '1', date: '2026-02-02', mood: 8, energy: 8, motivation: 10, sleepQuality: 8, soreness: 3, notes: 'Motivazione alle stelle, match si avvicina', wins: 'Punch power 88! Quasi al goal' },
  // Luca
  { id: 'ci7', athleteId: '2', date: '2026-01-05', mood: 7, energy: 7, motivation: 8, sleepQuality: 7, soreness: 5, notes: 'Buon inizio anno', wins: 'Vertical jump 66cm' },
  { id: 'ci8', athleteId: '2', date: '2026-01-12', mood: 8, energy: 8, motivation: 8, sleepQuality: 8, soreness: 4, notes: 'Sprint migliorato', wins: '11.4s sprint' },
  { id: 'ci9', athleteId: '2', date: '2026-01-19', mood: 7, energy: 6, motivation: 7, sleepQuality: 6, soreness: 6, notes: 'Ginocchio un po\' dolorante', wins: 'Gestito il dolore senza saltare sessioni' },
  { id: 'ci10', athleteId: '2', date: '2026-01-26', mood: 8, energy: 7, motivation: 8, sleepQuality: 7, soreness: 4, notes: 'Ginocchio ok', wins: 'Vertical jump 68cm!' },
  { id: 'ci11', athleteId: '2', date: '2026-02-02', mood: 9, energy: 8, motivation: 9, sleepQuality: 8, soreness: 3, notes: 'Grande forma', wins: 'MVP nella partita di sabato' },
  // Alessandro
  { id: 'ci12', athleteId: '3', date: '2026-01-12', mood: 7, energy: 7, motivation: 8, sleepQuality: 7, soreness: 4, notes: 'Partita giovedì, carico moderato', wins: 'Assist in partita!' },
  { id: 'ci13', athleteId: '3', date: '2026-01-19', mood: 8, energy: 7, motivation: 8, sleepQuality: 7, soreness: 5, notes: 'Ottimo lavoro di resistenza', wins: 'VO2max test 55' },
  { id: 'ci14', athleteId: '3', date: '2026-01-26', mood: 7, energy: 6, motivation: 7, sleepQuality: 6, soreness: 5, notes: 'Stanco dalla partita', wins: 'Sprint 11.5s PR!' },
  { id: 'ci15', athleteId: '3', date: '2026-02-02', mood: 9, energy: 8, motivation: 9, sleepQuality: 8, soreness: 3, notes: 'Forma fisica top', wins: 'VO2max 56, gol in partita!' },
  // Davide
  { id: 'ci16', athleteId: '4', date: '2026-01-12', mood: 7, energy: 6, motivation: 7, sleepQuality: 6, soreness: 6, notes: 'Dieta un po\' sgarra', wins: 'Deadlift 145kg' },
  { id: 'ci17', athleteId: '4', date: '2026-01-19', mood: 6, energy: 6, motivation: 6, sleepQuality: 5, soreness: 5, notes: 'Motivazione calata un po\'', wins: 'Peso sceso sotto i 89' },
  { id: 'ci18', athleteId: '4', date: '2026-01-26', mood: 8, energy: 7, motivation: 8, sleepQuality: 7, soreness: 4, notes: 'Ripresa ottima', wins: 'Bench 100kg raggiunto!' },
  { id: 'ci19', athleteId: '4', date: '2026-02-02', mood: 8, energy: 8, motivation: 9, sleepQuality: 8, soreness: 3, notes: 'On fire, body fat al 18%', wins: 'Milestone body fat raggiunto' },
];

export const achievements: Achievement[] = [
  // Marco
  { id: 'ach1', athleteId: '1', title: 'Primo Mese', description: 'Completato il primo mese di allenamento', unlockedAt: '2025-10-15', category: 'streak' },
  { id: 'ach2', athleteId: '1', title: 'Costanza', description: '10 sessioni completate', unlockedAt: '2025-10-30', category: 'consistency' },
  { id: 'ach3', athleteId: '1', title: 'PR Hunter', description: 'Primo record personale battuto', unlockedAt: '2025-11-15', category: 'pr' },
  { id: 'ach4', athleteId: '1', title: 'Iron Will', description: 'Streak di 30 giorni consecutivi', unlockedAt: '2025-12-15', category: 'streak' },
  { id: 'ach5', athleteId: '1', title: 'Milestone Master', description: 'Raggiunto 3 milestone su un obiettivo', unlockedAt: '2026-01-01', category: 'milestone' },
  { id: 'ach6', athleteId: '1', title: 'Mind Strong', description: 'Check-in motivazione 10/10', unlockedAt: '2026-02-02', category: 'mindset' },
  // Luca
  { id: 'ach7', athleteId: '2', title: 'Primo Mese', description: 'Completato il primo mese', unlockedAt: '2025-11-01', category: 'streak' },
  { id: 'ach8', athleteId: '2', title: 'Costanza', description: '10 sessioni completate', unlockedAt: '2025-11-20', category: 'consistency' },
  { id: 'ach9', athleteId: '2', title: 'Sky High', description: 'Salto verticale +10cm dal primo test', unlockedAt: '2026-01-01', category: 'pr' },
  // Alessandro
  { id: 'ach10', athleteId: '3', title: 'Primo Mese', description: 'Completato il primo mese', unlockedAt: '2025-09-20', category: 'streak' },
  { id: 'ach11', athleteId: '3', title: 'Maratoneta', description: 'VO2max superiore a 54', unlockedAt: '2025-11-20', category: 'milestone' },
  { id: 'ach12', athleteId: '3', title: 'Speed Demon', description: 'Sprint sotto i 12 secondi', unlockedAt: '2025-10-20', category: 'pr' },
  // Davide
  { id: 'ach13', athleteId: '4', title: 'Primo Mese', description: 'Completato il primo mese', unlockedAt: '2025-12-01', category: 'streak' },
  { id: 'ach14', athleteId: '4', title: 'Century Club', description: 'Bench press 100kg raggiunto', unlockedAt: '2026-01-26', category: 'pr' },
  { id: 'ach15', athleteId: '4', title: 'Trasformazione', description: 'Body fat -4% dal primo check', unlockedAt: '2026-01-01', category: 'milestone' },
  // Simone
  { id: 'ach16', athleteId: '5', title: 'Primo Mese', description: 'Completato il primo mese', unlockedAt: '2026-01-01', category: 'streak' },
  { id: 'ach17', athleteId: '5', title: 'First Blood', description: 'Punch power sopra 50', unlockedAt: '2025-12-20', category: 'pr' },
];
