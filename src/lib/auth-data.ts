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

export const payments: Payment[] = [
  { id: 'pay-1', athleteId: '1', athleteName: 'Marco Rossi', type: 'subscription', planName: 'Percorso Boxe PRO', amount: 149, currency: 'EUR', status: 'paid', method: 'shopify', shopifyOrderId: '#GR-1042', date: '2026-02-01', period: 'Febbraio 2026' },
  { id: 'pay-2', athleteId: '2', athleteName: 'Luca Bianchi', type: 'subscription', planName: 'Percorso Basket Elite', amount: 129, currency: 'EUR', status: 'paid', method: 'shopify', shopifyOrderId: '#GR-1039', date: '2026-02-01', period: 'Febbraio 2026' },
  { id: 'pay-3', athleteId: '3', athleteName: 'Alessandro Conti', type: 'subscription', planName: 'Percorso Calcio Base', amount: 99, currency: 'EUR', status: 'paid', method: 'shopify', shopifyOrderId: '#GR-1035', date: '2026-02-01', period: 'Febbraio 2026' },
  { id: 'pay-4', athleteId: '4', athleteName: 'Davide Ferrara', type: 'subscription', planName: 'Percorso Gym Premium', amount: 119, currency: 'EUR', status: 'paid', method: 'shopify', shopifyOrderId: '#GR-1038', date: '2026-02-01', period: 'Febbraio 2026' },
  { id: 'pay-5', athleteId: '5', athleteName: 'Simone Greco', type: 'subscription', planName: 'Percorso Boxe Base', amount: 99, currency: 'EUR', status: 'pending', method: 'shopify', date: '2026-02-01', dueDate: '2026-02-15', period: 'Febbraio 2026', notes: 'Inviato promemoria via WhatsApp' },
  { id: 'pay-6', athleteId: '6', athleteName: 'Matteo Lombardi', type: 'subscription', planName: 'Percorso Gym Base', amount: 99, currency: 'EUR', status: 'cancelled', method: 'shopify', shopifyOrderId: '#GR-1025', date: '2026-01-15', period: 'Gennaio 2026', notes: 'Interrotto per infortunio. Riprende a marzo.' },
  // Historical payments
  { id: 'pay-7', athleteId: '1', athleteName: 'Marco Rossi', type: 'subscription', planName: 'Percorso Boxe PRO', amount: 149, currency: 'EUR', status: 'paid', method: 'shopify', shopifyOrderId: '#GR-1020', date: '2026-01-01', period: 'Gennaio 2026' },
  { id: 'pay-8', athleteId: '2', athleteName: 'Luca Bianchi', type: 'subscription', planName: 'Percorso Basket Elite', amount: 129, currency: 'EUR', status: 'paid', method: 'shopify', shopifyOrderId: '#GR-1018', date: '2026-01-01', period: 'Gennaio 2026' },
  { id: 'pay-9', athleteId: '3', athleteName: 'Alessandro Conti', type: 'subscription', planName: 'Percorso Calcio Base', amount: 99, currency: 'EUR', status: 'paid', method: 'shopify', shopifyOrderId: '#GR-1015', date: '2026-01-01', period: 'Gennaio 2026' },
  { id: 'pay-10', athleteId: '4', athleteName: 'Davide Ferrara', type: 'subscription', planName: 'Percorso Gym Premium', amount: 119, currency: 'EUR', status: 'paid', method: 'shopify', shopifyOrderId: '#GR-1016', date: '2026-01-01', period: 'Gennaio 2026' },
  { id: 'pay-11', athleteId: '5', athleteName: 'Simone Greco', type: 'subscription', planName: 'Percorso Boxe Base', amount: 99, currency: 'EUR', status: 'paid', method: 'shopify', shopifyOrderId: '#GR-1022', date: '2026-01-01', period: 'Gennaio 2026' },
  { id: 'pay-12', athleteId: '6', athleteName: 'Matteo Lombardi', type: 'subscription', planName: 'Percorso Gym Base', amount: 99, currency: 'EUR', status: 'paid', method: 'shopify', shopifyOrderId: '#GR-1012', date: '2025-12-01', period: 'Dicembre 2025' },
  { id: 'pay-13', athleteId: '1', athleteName: 'Marco Rossi', type: 'subscription', planName: 'Percorso Boxe PRO', amount: 149, currency: 'EUR', status: 'paid', method: 'shopify', shopifyOrderId: '#GR-1008', date: '2025-12-01', period: 'Dicembre 2025' },
  { id: 'pay-14', athleteId: '1', athleteName: 'Marco Rossi', type: 'single', planName: 'Sessione Extra 1:1', amount: 45, currency: 'EUR', status: 'paid', method: 'cash', date: '2026-01-20' },
  { id: 'pay-15', athleteId: '4', athleteName: 'Davide Ferrara', type: 'single', planName: 'Valutazione Corpo', amount: 35, currency: 'EUR', status: 'paid', method: 'transfer', date: '2026-01-25' },
  // Old months
  { id: 'pay-16', athleteId: '2', athleteName: 'Luca Bianchi', type: 'subscription', planName: 'Percorso Basket Elite', amount: 129, currency: 'EUR', status: 'paid', method: 'shopify', shopifyOrderId: '#GR-1005', date: '2025-12-01', period: 'Dicembre 2025' },
  { id: 'pay-17', athleteId: '3', athleteName: 'Alessandro Conti', type: 'subscription', planName: 'Percorso Calcio Base', amount: 99, currency: 'EUR', status: 'paid', method: 'shopify', shopifyOrderId: '#GR-1003', date: '2025-12-01', period: 'Dicembre 2025' },
  { id: 'pay-18', athleteId: '1', athleteName: 'Marco Rossi', type: 'subscription', planName: 'Percorso Boxe PRO', amount: 149, currency: 'EUR', status: 'paid', method: 'shopify', shopifyOrderId: '#GR-998', date: '2025-11-01', period: 'Novembre 2025' },
  { id: 'pay-19', athleteId: '1', athleteName: 'Marco Rossi', type: 'subscription', planName: 'Percorso Boxe PRO', amount: 149, currency: 'EUR', status: 'paid', method: 'shopify', shopifyOrderId: '#GR-990', date: '2025-10-01', period: 'Ottobre 2025' },
];

export const subscriptions: Subscription[] = [
  { id: 'sub-1', athleteId: '1', athleteName: 'Marco Rossi', planName: 'Percorso Boxe PRO', sport: 'boxing', amount: 149, currency: 'EUR', billingCycle: 'monthly', startDate: '2025-09-15', nextPayment: '2026-03-01', status: 'active', autoRenew: true },
  { id: 'sub-2', athleteId: '2', athleteName: 'Luca Bianchi', planName: 'Percorso Basket Elite', sport: 'basketball', amount: 129, currency: 'EUR', billingCycle: 'monthly', startDate: '2025-10-01', nextPayment: '2026-03-01', status: 'active', autoRenew: true },
  { id: 'sub-3', athleteId: '3', athleteName: 'Alessandro Conti', planName: 'Percorso Calcio Base', sport: 'football', amount: 99, currency: 'EUR', billingCycle: 'monthly', startDate: '2025-08-20', nextPayment: '2026-03-01', status: 'active', autoRenew: true },
  { id: 'sub-4', athleteId: '4', athleteName: 'Davide Ferrara', planName: 'Percorso Gym Premium', sport: 'gym', amount: 119, currency: 'EUR', billingCycle: 'monthly', startDate: '2025-11-01', nextPayment: '2026-03-01', status: 'active', autoRenew: true },
  { id: 'sub-5', athleteId: '5', athleteName: 'Simone Greco', planName: 'Percorso Boxe Base', sport: 'boxing', amount: 99, currency: 'EUR', billingCycle: 'monthly', startDate: '2025-12-01', nextPayment: '2026-03-01', status: 'active', autoRenew: true },
  { id: 'sub-6', athleteId: '6', athleteName: 'Matteo Lombardi', planName: 'Percorso Gym Base', sport: 'gym', amount: 99, currency: 'EUR', billingCycle: 'monthly', startDate: '2025-10-15', nextPayment: '-', status: 'paused', autoRenew: false },
];

export const athleteNotes: AthleteNote[] = [
  { id: 'n1', athleteId: '1', authorId: 'staff-1', authorName: 'Gabriele R.', content: 'Motivazione altissima post-feste. Gancio sinistro migliorato notevolmente. Continuare con il focus sulla potenza rotazionale.', category: 'performance', priority: 'medium', createdAt: '2026-02-03T10:00:00', pinned: true },
  { id: 'n2', athleteId: '1', authorId: 'staff-1', authorName: 'Gabriele R.', content: 'Leggero fastidio al polso destro durante il bag work. Monitorare nelle prossime sessioni, se persiste valutare esami.', category: 'injury', priority: 'high', createdAt: '2026-02-07T14:30:00', pinned: false },
  { id: 'n3', athleteId: '1', authorId: 'staff-1', authorName: 'Gabriele R.', content: 'Peso stabile a 76kg. Dieta sotto controllo, integrazione creatina funziona bene.', category: 'nutrition', priority: 'low', createdAt: '2026-01-28T09:00:00', pinned: false },
  { id: 'n4', athleteId: '2', authorId: 'staff-1', authorName: 'Gabriele R.', content: 'Ginocchio sinistro un po\' dolorante dopo la pliometria. Ridurre impatto per 1 settimana e aggiungere lavoro di mobilità.', category: 'injury', priority: 'high', createdAt: '2026-01-22T16:00:00', pinned: true },
  { id: 'n5', athleteId: '2', authorId: 'staff-2', authorName: 'Staff GR', content: 'MVP nella partita di sabato. Vertical jump in costante crescita. Ottimo feedback dal coach della squadra.', category: 'performance', priority: 'medium', createdAt: '2026-02-04T11:00:00', pinned: false },
  { id: 'n6', athleteId: '3', authorId: 'staff-1', authorName: 'Gabriele R.', content: 'Sprint test migliorato a 11.5s. Focus su accelerazione nei primi 20 metri per la prossima fase.', category: 'performance', priority: 'medium', createdAt: '2026-01-28T15:00:00', pinned: false },
  { id: 'n7', athleteId: '3', authorId: 'staff-1', authorName: 'Gabriele R.', content: 'Ha segnalato stress per esami universitari. Regime ridotto per 2 settimane, mantenere solo mantenimento.', category: 'mental', priority: 'medium', createdAt: '2026-02-05T10:00:00', pinned: true },
  { id: 'n8', athleteId: '4', authorId: 'staff-1', authorName: 'Gabriele R.', content: 'Raggiunto il 100kg di bench! Obiettivo intermedio completato. Prossimo target 105kg entro metà marzo.', category: 'performance', priority: 'low', createdAt: '2026-01-26T18:00:00', pinned: false },
  { id: 'n9', athleteId: '4', authorId: 'staff-1', authorName: 'Gabriele R.', content: 'Dieta: ha sgarrato durante il weekend. Ricordare importanza della compliance nei weekend. Aggiunto pasto libero il sabato per compliance.', category: 'nutrition', priority: 'medium', createdAt: '2026-01-14T09:30:00', pinned: false },
  { id: 'n10', athleteId: '5', authorId: 'staff-2', authorName: 'Staff GR', content: 'Principiante con grande potenziale. Coordinazione improvvisata eccellente. Aumentare gradualmente intensità.', category: 'general', priority: 'low', createdAt: '2025-12-10T14:00:00', pinned: false },
  { id: 'n11', athleteId: '6', authorId: 'staff-1', authorName: 'Gabriele R.', content: 'Infortunio spalla sinistra. Risonanza effettuata, nulla di grave. Fisioterapia in corso, riprende allenamenti a marzo.', category: 'injury', priority: 'high', createdAt: '2026-01-10T11:00:00', pinned: true },
  { id: 'n12', athleteId: '6', authorId: 'staff-1', authorName: 'Gabriele R.', content: 'Abbonamento in pausa fino a riabilitazione completata. Contattare a fine febbraio per aggiornamento.', category: 'admin', priority: 'medium', createdAt: '2026-01-15T10:00:00', pinned: false },
];

export const notifications: Notification[] = [
  { id: 'not-1', userId: 'staff-1', type: 'payment', title: 'Pagamento in sospeso', message: 'Simone Greco non ha ancora pagato l\'abbonamento di Febbraio (€99)', read: false, createdAt: '2026-02-10T08:00:00', athleteId: '5', link: '/dashboard/payments' },
  { id: 'not-2', userId: 'staff-1', type: 'session', title: 'Valutazione oggi', message: 'Simone Greco — Valutazione mensile alle 10:00', read: false, createdAt: '2026-02-11T07:00:00', athleteId: '5', link: '/dashboard/calendar' },
  { id: 'not-3', userId: 'staff-1', type: 'goal', title: 'Obiettivo quasi raggiunto', message: 'Marco Rossi — Punch Power a 88/90. Mancano solo 2 unità!', read: false, createdAt: '2026-02-09T18:00:00', athleteId: '1', link: '/dashboard/athletes/1' },
  { id: 'not-4', userId: 'staff-1', type: 'checkin', title: 'Check-in ricevuto', message: 'Davide Ferrara ha completato il check-in settimanale: Umore 8/10, Motivazione 9/10', read: true, createdAt: '2026-02-09T12:00:00', athleteId: '4' },
  { id: 'not-5', userId: 'staff-1', type: 'athlete', title: 'Nuovo atleta inattivo', message: 'Matteo Lombardi è in pausa da 27 giorni. Pianificare contatto di follow-up.', read: true, createdAt: '2026-02-08T09:00:00', athleteId: '6' },
  { id: 'not-6', userId: 'staff-1', type: 'system', title: 'Report mensile pronto', message: 'Il report di Gennaio 2026 è pronto per la revisione.', read: true, createdAt: '2026-02-01T08:00:00', link: '/dashboard/analytics' },
  { id: 'not-7', userId: 'staff-1', type: 'payment', title: 'Pagamento ricevuto', message: 'Alessandro Conti — €99 via Shopify (#GR-1035)', read: true, createdAt: '2026-02-01T10:30:00', athleteId: '3' },
  { id: 'not-8', userId: 'staff-1', type: 'goal', title: 'Milestone raggiunto', message: 'Davide Ferrara — Bench Press 100kg raggiunto!', read: true, createdAt: '2026-01-26T18:00:00', athleteId: '4' },
];

export const athleteUsers: AthleteUser[] = [
  { id: 'ath-user-1', athleteId: '1', email: 'marco.rossi@email.com', password: 'Marco2026!', role: 'athlete', status: 'active' },
  { id: 'ath-user-2', athleteId: '2', email: 'luca.bianchi@email.com', password: 'Luca2026!', role: 'athlete', status: 'active' },
  { id: 'ath-user-3', athleteId: '3', email: 'ale.conti@email.com', password: 'Ale2026!', role: 'athlete', status: 'active' },
  { id: 'ath-user-4', athleteId: '4', email: 'davide.f@email.com', password: 'Davide2026!', role: 'athlete', status: 'active' },
  { id: 'ath-user-5', athleteId: '5', email: 'simone.g@email.com', password: 'Simone2026!', role: 'athlete', status: 'active' },
  { id: 'ath-user-6', athleteId: '6', email: 'matteo.l@email.com', password: 'Matteo2026!', role: 'athlete', status: 'suspended' },
];

export const athleteDocuments: AthleteDocument[] = [
  { id: 'doc-1', athleteId: '1', name: 'Scheda KO Power - Settimana 12-16', type: 'training-plan', url: '#', uploadedAt: '2026-02-01', uploadedBy: 'Gabriele R.', size: '245 KB' },
  { id: 'doc-2', athleteId: '1', name: 'Piano Alimentare Febbraio', type: 'nutrition', url: '#', uploadedAt: '2026-02-01', uploadedBy: 'Gabriele R.', size: '180 KB' },
  { id: 'doc-3', athleteId: '1', name: 'Report Progresso Gennaio', type: 'report', url: '#', uploadedAt: '2026-01-31', uploadedBy: 'Gabriele R.', size: '1.2 MB' },
  { id: 'doc-4', athleteId: '2', name: 'Scheda Vertical Leap - Fase 3', type: 'training-plan', url: '#', uploadedAt: '2026-02-03', uploadedBy: 'Gabriele R.', size: '210 KB' },
  { id: 'doc-5', athleteId: '3', name: 'Scheda Endurance - Mese 5', type: 'training-plan', url: '#', uploadedAt: '2026-01-28', uploadedBy: 'Gabriele R.', size: '195 KB' },
  { id: 'doc-6', athleteId: '4', name: 'Scheda Body Recomp - Push/Pull/Legs', type: 'training-plan', url: '#', uploadedAt: '2026-02-01', uploadedBy: 'Gabriele R.', size: '230 KB' },
  { id: 'doc-7', athleteId: '4', name: 'Piano Alimentare Recomp', type: 'nutrition', url: '#', uploadedAt: '2026-01-15', uploadedBy: 'Gabriele R.', size: '190 KB' },
  { id: 'doc-8', athleteId: '5', name: 'Scheda Speed Demon - Introduzione', type: 'training-plan', url: '#', uploadedAt: '2025-12-05', uploadedBy: 'Staff GR', size: '175 KB' },
  { id: 'doc-9', athleteId: '6', name: 'Certificato Medico', type: 'medical', url: '#', uploadedAt: '2025-10-20', uploadedBy: 'Gabriele R.', size: '520 KB' },
  { id: 'doc-10', athleteId: '6', name: 'Report Risonanza Spalla', type: 'medical', url: '#', uploadedAt: '2026-01-08', uploadedBy: 'Gabriele R.', size: '2.1 MB' },
];
