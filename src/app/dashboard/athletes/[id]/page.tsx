'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, MessageCircle, Mail, Video, Calendar, Plus, X, Edit3,
  Image as ImageIcon, FileText, ChevronLeft, ChevronRight, Upload,
  Trash2, Clock, Download, Eye, Check, BarChart3, CheckCircle2,
  TrendingUp, Target, Brain, Flame, Zap, Moon, Activity, Award,
  Star, Trophy, Lock, Quote, Heart,
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { plans, goals } from '@/lib/data';
import { SPORTS, APPOINTMENT_TYPES, MOTIVATIONAL_QUOTES } from '@/lib/types';
import { useStore } from '@/lib/store';
import type { AthleteNote } from '@/lib/auth-data';

type Tab = 'overview' | 'percorso' | 'appointments' | 'gallery' | 'documents' | 'notes' | 'measurements';

const MOCK_PHOTOS = [
  { id: '1', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=500&fit=crop', date: '2025-09-15', label: 'Inizio percorso' },
  { id: '2', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop', date: '2025-10-15', label: 'Mese 1' },
  { id: '3', url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=500&fit=crop', date: '2025-11-15', label: 'Mese 2' },
  { id: '4', url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=500&fit=crop', date: '2025-12-15', label: 'Mese 3' },
  { id: '5', url: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=400&h=500&fit=crop', date: '2026-01-15', label: 'Mese 4' },
];

const ACHIEVEMENT_ICONS: Record<string, React.ReactNode> = {
  streak: <Flame size={15} />,
  consistency: <Activity size={15} />,
  pr: <Trophy size={15} />,
  milestone: <Target size={15} />,
  mindset: <Brain size={15} />,
};

const METRIC_ICONS: Record<string, React.ReactNode> = {
  punchPower: <Zap size={14} />,
  weight: <BarChart3 size={14} />,
  benchPress: <TrendingUp size={14} />,
  squat: <TrendingUp size={14} />,
  deadlift: <TrendingUp size={14} />,
  sprintTime: <Activity size={14} />,
  vo2max: <Heart size={14} />,
  verticalJump: <TrendingUp size={14} />,
  bodyFat: <BarChart3 size={14} />,
};

export default function AthleteProfilePage() {
  const params = useParams();
  const {
    athletes, appointments, smartGoals, achievements, weeklyCheckIns, athleteNotes, athleteDocuments,
    fetchAll, addAppointment, updateAthlete, addSmartGoal, updateSmartGoal, deleteSmartGoal,
    addAchievement, deleteAchievement, addCheckIn, addNote, updateNote, deleteNote,
    addDocument, deleteDocument, addMeasurement,
  } = useStore();
  const athlete = athletes.find((a) => a.id === params.id);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [comparePhotos, setComparePhotos] = useState<string[]>([]);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<{ id?: string; title: string; target: string; current: string; progress: number; deadline: string; status: 'in-progress' | 'achieved' | 'missed' } | null>(null);
  const [newApt, setNewApt] = useState({ type: 'training' as const, date: '', time: '', duration: 60, notes: '' });
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInValues, setCheckInValues] = useState({ mood: 5, energy: 5, motivation: 5, sleepQuality: 5, soreness: 3, notes: '', wins: '' });
  const [showNewAchievement, setShowNewAchievement] = useState(false);
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchDesc, setNewAchDesc] = useState('');
  const [newAchCategory, setNewAchCategory] = useState<'streak' | 'milestone' | 'pr' | 'consistency' | 'mindset'>('milestone');
  const docInputRef = useRef<HTMLInputElement>(null);
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    if (athlete) {
      setEditFormData({
        name: athlete.name, surname: athlete.surname, email: athlete.email,
        phone: athlete.phone, age: athlete.age, height: athlete.height,
        weight: athlete.weight, goal: athlete.goal, status: athlete.status, notes: athlete.notes,
      });
    }
  }, [athlete?.id]);

  if (!athlete) {
    return (
      <div className="py-20 text-center">
        <p className="text-white/40">Caricamento...</p>
        <Link href="/dashboard/athletes" className="nike-btn nike-btn-white mt-4">Torna alla lista</Link>
      </div>
    );
  }

  const sport = SPORTS[athlete.sport];
  const athletePlans = plans.filter((p) => athlete.assignedPlans.includes(p.id));
  const athleteGoals = goals.filter((g) => g.athleteId === athlete.id);
  const athleteAppointments = appointments.filter((a) => a.athleteId === athlete.id);
  const athleteSmartGoals = smartGoals.filter((sg) => sg.athleteId === athlete.id);
  const athleteCheckIns = weeklyCheckIns.filter((ci) => ci.athleteId === athlete.id);
  const athleteAchievements = achievements.filter((a) => a.athleteId === athlete.id);
  const lastM = athlete.measurements[athlete.measurements.length - 1];
  const prevM = athlete.measurements.length >= 2 ? athlete.measurements[athlete.measurements.length - 2] : null;

  const bmi = lastM ? +(lastM.weight / Math.pow(athlete.height / 100, 2)).toFixed(1) : null;
  const bmiCategory = bmi ? (bmi < 18.5 ? 'Sottopeso' : bmi < 25 ? 'Normopeso' : bmi < 30 ? 'Sovrappeso' : 'Obeso') : null;
  const weightDelta = prevM ? +(lastM.weight - prevM.weight).toFixed(1) : null;
  const bfDelta = prevM?.bodyFat && lastM?.bodyFat ? +(lastM.bodyFat - prevM.bodyFat).toFixed(1) : null;
  const completedSessions = athleteAppointments.filter(a => a.status === 'completed').length;
  const totalSessions = athleteAppointments.length;
  const daysSinceStart = Math.floor((new Date(2026, 1, 10).getTime() - new Date(athlete.startDate).getTime()) / (1000 * 60 * 60 * 24));

  const weightData = athlete.measurements.map((m) => ({ date: m.date.slice(5), peso: m.weight }));
  const sportQuotes = MOTIVATIONAL_QUOTES[athlete.sport];
  const sportQuote = sportQuotes[Math.floor(daysSinceStart / 7) % sportQuotes.length];

  const athleteNotesFiltered = athleteNotes.filter(n => n.athleteId === athlete.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const athleteDocs = athleteDocuments.filter(d => d.athleteId === athlete.id);

  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<AthleteNote['category']>('general');
  const [notePriority, setNotePriority] = useState<AthleteNote['priority']>('medium');
  const [showNewMeasurement, setShowNewMeasurement] = useState(false);
  const [newMeasurement, setNewMeasurement] = useState<Record<string, string>>({});
  const [docFilter, setDocFilter] = useState('all');

  // --- HANDLERS ---
  const handleSaveAthlete = async () => {
    await updateAthlete(athlete.id, editFormData);
    setShowEditModal(false);
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    await addNote({
      athleteId: athlete.id, authorId: 'staff-1', authorName: 'Gabriele R.',
      content: noteContent, category: noteCategory, priority: notePriority,
      createdAt: new Date().toISOString(), pinned: false,
    });
    setNoteContent('');
  };

  const handleTogglePinNote = async (note: AthleteNote) => {
    await updateNote(note.id, { pinned: !note.pinned });
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
  };

  const handleSaveMeasurement = async () => {
    if (!newMeasurement.date || !newMeasurement.weight) return;
    const m: Record<string, any> = { date: newMeasurement.date, weight: parseFloat(newMeasurement.weight) };
    if (newMeasurement.bodyFat) m.bodyFat = parseFloat(newMeasurement.bodyFat);
    if (newMeasurement.punchPower) m.punchPower = parseFloat(newMeasurement.punchPower);
    if (newMeasurement.benchPress) m.benchPress = parseFloat(newMeasurement.benchPress);
    if (newMeasurement.squat) m.squat = parseFloat(newMeasurement.squat);
    if (newMeasurement.deadlift) m.deadlift = parseFloat(newMeasurement.deadlift);
    if (newMeasurement.sprintTime) m.sprintTime = parseFloat(newMeasurement.sprintTime);
    if (newMeasurement.vo2max) m.vo2max = parseFloat(newMeasurement.vo2max);
    if (newMeasurement.verticalJump) m.verticalJump = parseFloat(newMeasurement.verticalJump);
    await addMeasurement(athlete.id, m);
    setNewMeasurement({});
    setShowNewMeasurement(false);
  };

  const handleSaveGoal = async () => {
    if (!editingGoal) return;
    if (editingGoal.id) {
      // update existing goal
      const goalData = goals.find(g => g.id === editingGoal.id);
      if (goalData) {
        // update in goals collection via API
        await fetch('/api/data/goals', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingGoal.id, ...editingGoal }),
        });
      }
    } else {
      // create new goal
      await fetch('/api/data/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ athleteId: athlete.id, ...editingGoal }),
      });
    }
    setShowGoalModal(false);
    setEditingGoal(null);
    window.location.reload();
  };

  const handleDeleteGoal = async () => {
    if (!editingGoal?.id) return;
    await fetch(`/api/data/goals?id=${editingGoal.id}`, { method: 'DELETE' });
    setShowGoalModal(false);
    setEditingGoal(null);
    window.location.reload();
  };

  const handleSaveCheckIn = async () => {
    await addCheckIn({
      athleteId: athlete.id,
      date: new Date().toISOString().split('T')[0],
      ...checkInValues,
      mood: checkInValues.mood,
      energy: checkInValues.energy,
      motivation: checkInValues.motivation,
      sleepQuality: checkInValues.sleepQuality,
      soreness: checkInValues.soreness,
    });
    setCheckInValues({ mood: 5, energy: 5, motivation: 5, sleepQuality: 5, soreness: 3, notes: '', wins: '' });
    setShowCheckInModal(false);
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'documents');
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const { url, name, size } = await res.json();
    await addDocument({
      athleteId: athlete.id,
      name: name,
      type: 'training-plan',
      url,
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: 'Gabriele R.',
      size,
    });
    if (docInputRef.current) docInputRef.current.value = '';
  };

  const handleDeleteDoc = async (id: string) => {
    await deleteDocument(id);
  };

  const handleAddAchievement = async () => {
    if (!newAchTitle.trim()) return;
    await addAchievement({
      athleteId: athlete.id,
      title: newAchTitle,
      description: newAchDesc,
      unlockedAt: new Date().toISOString().split('T')[0],
      category: newAchCategory,
    });
    setNewAchTitle('');
    setNewAchDesc('');
    setShowNewAchievement(false);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Panoramica' },
    { key: 'percorso', label: 'Percorso' },
    { key: 'appointments', label: 'Appuntamenti' },
    { key: 'notes', label: 'Note' },
    { key: 'measurements', label: 'Misurazioni' },
    { key: 'gallery', label: 'Galleria' },
    { key: 'documents', label: 'Documenti' },
  ];

  const toggleComparePhoto = (id: string) => {
    setComparePhotos((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]
    );
  };

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 -mt-5 sm:-mt-6 md:-mt-8">

      {/* HEADER */}
      <div className="relative overflow-hidden" style={{ height: '220px' }}>
        {athlete.coverPhoto ? (
          <img src={athlete.coverPhoto} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={sport.video} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]/20" />

        <Link
          href={`/dashboard/athletes/sport/${athlete.sport}`}
          className="absolute top-6 left-6 lg:left-10 z-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={12} /> {sport.label}
        </Link>

        <div className="absolute bottom-8 left-6 lg:left-10 z-10 flex items-end gap-4">
          {athlete.avatar && (
            <img src={athlete.avatar} alt="" className="w-14 h-14 object-cover border border-white/10" />
          )}
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '42px', lineHeight: 1, letterSpacing: '2px' }} className="text-white">
              {athlete.name.toUpperCase()} {athlete.surname.toUpperCase()}
            </h1>
            <div className="flex items-center gap-4 mt-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">{sport.label}</span>
            <span className="w-px h-3 bg-white/10" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">{athlete.goal}</span>
            <span className="w-px h-3 bg-white/10" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Day {daysSinceStart}</span>
          </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-6 lg:right-10 z-10 flex items-center gap-1.5">
          <button onClick={() => setShowEditModal(true)} className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
            <Edit3 size={13} />
          </button>
          <a href={`https://wa.me/${athlete.phone?.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
            <MessageCircle size={13} />
          </a>
          <a href="https://zoom.us/j/new" target="_blank" rel="noopener noreferrer" className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
            <Video size={13} />
          </a>
          <a href={`mailto:${athlete.email}`} className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
            <Mail size={13} />
          </a>
        </div>
      </div>

      {/* TAB NAV */}
      <div className="px-6 lg:px-10 border-b border-white/[0.06]">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] transition-colors border-b ${
                activeTab === tab.key
                  ? 'text-white border-white'
                  : 'text-white/20 border-transparent hover:text-white/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-6 lg:px-10 py-8">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 page-enter">

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-px bg-white/[0.06]">
              {[
                { label: 'Età', value: `${athlete.age}`, unit: '' },
                { label: 'Altezza', value: `${athlete.height}`, unit: 'cm' },
                { label: 'Peso', value: `${lastM?.weight || '—'}`, unit: 'kg', delta: weightDelta },
                { label: 'Body Fat', value: lastM?.bodyFat ? `${lastM.bodyFat}` : '—', unit: '%', delta: bfDelta },
                { label: 'BMI', value: bmi ? `${bmi}` : '—', unit: bmiCategory || '' },
                { label: 'Sessioni', value: `${completedSessions}/${totalSessions}`, unit: '' },
              ].map((s) => (
                <div key={s.label} className="bg-[#0A0A0A] p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-2">{s.label}</p>
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                    {s.value}
                    {s.unit && <span className="text-xs text-white/20 ml-1 font-normal">{s.unit}</span>}
                  </p>
                  {'delta' in s && s.delta !== null && s.delta !== undefined && (
                    <p className={`text-[10px] mt-1 ${Number(s.delta) < 0 ? 'text-white/50' : 'text-white/30'}`}>
                      {Number(s.delta) > 0 ? '+' : ''}{s.delta}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Chart + Goals */}
            <div className="grid md:grid-cols-3 gap-px bg-white/[0.06]">
              <div className="md:col-span-2 bg-[#0A0A0A] p-6">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-6">Andamento peso</h3>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0', color: '#fff', fontSize: '11px' }} />
                      <Line type="monotone" dataKey="peso" stroke="#fff" strokeWidth={1.5} dot={{ fill: '#fff', r: 2.5, strokeWidth: 0 }} activeDot={{ r: 4, fill: '#fff', strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#0A0A0A] p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30">Obiettivi</h3>
                  <button onClick={() => setActiveTab('percorso')} className="text-[10px] uppercase tracking-[0.15em] text-white/20 hover:text-white/50 transition-colors">
                    Tutti &rarr;
                  </button>
                </div>
                <div className="space-y-4">
                  {athleteSmartGoals.slice(0, 3).map((sg) => {
                    const progress = sg.targetValue > sg.startValue
                      ? ((sg.currentValue - sg.startValue) / (sg.targetValue - sg.startValue)) * 100
                      : ((sg.startValue - sg.currentValue) / (sg.startValue - sg.targetValue)) * 100;
                    const clamped = Math.min(100, Math.max(0, progress));
                    return (
                      <div key={sg.id} className="cursor-pointer group" onClick={() => { setActiveTab('percorso'); setExpandedGoal(sg.id); }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs text-white/70 group-hover:text-white transition-colors">{sg.title}</p>
                          <span className="text-xs text-white/40 tabular-nums">{Math.round(clamped)}%</span>
                        </div>
                        <div className="w-full bg-white/[0.06] h-[2px]">
                          <div className="h-[2px] bg-white/60 transition-all" style={{ width: `${clamped}%` }} />
                        </div>
                        <p className="text-[9px] text-white/15 mt-1">{sg.currentValue} / {sg.targetValue} {sg.unit}</p>
                      </div>
                    );
                  })}
                  {athleteSmartGoals.length === 0 && athleteGoals.map((goal) => (
                    <div key={goal.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs text-white/70">{goal.title}</p>
                        <span className="text-xs text-white/40 tabular-nums">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-white/[0.06] h-[2px]">
                        <div className="h-[2px] bg-white/60 transition-all" style={{ width: `${goal.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                {athleteCheckIns.length > 0 && (() => {
                  const latest = athleteCheckIns[athleteCheckIns.length - 1];
                  return (
                    <div className="mt-5 pt-4 border-t border-white/[0.06] cursor-pointer" onClick={() => setActiveTab('percorso')}>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1">Ultimo check-in</p>
                      <div className="flex items-center gap-4 text-[10px] text-white/30">
                        <span>Umore {latest.mood}/10</span>
                        <span>Energia {latest.energy}/10</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Training Plans */}
            {athletePlans.map((plan) => (
              <div key={plan.id} className="border border-white/[0.06]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30">{plan.name}</h3>
                    <p className="text-[9px] text-white/15 mt-0.5">{plan.duration} &mdash; {plan.category} &mdash; {plan.difficulty}</p>
                  </div>
                </div>
                <div>
                  {plan.sessions.map((session, idx) => (
                    <div key={idx} className="flex items-center gap-6 px-6 py-3 border-b border-white/[0.03] last:border-b-0">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-white/15 w-14 shrink-0">{session.day}</span>
                      <span className="text-[13px] text-white/60">{session.name}</span>
                      <span className="text-[9px] text-white/15 ml-auto">{session.exercises.length} ex.</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Info */}
            <div className="border border-white/[0.06]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30">Informazioni</h3>
                <button onClick={() => setShowEditModal(true)} className="text-[9px] uppercase tracking-[0.15em] text-white/15 hover:text-white/40 transition-colors flex items-center gap-1">
                  <Edit3 size={10} /> Modifica
                </button>
              </div>
              <div className="grid sm:grid-cols-2">
                {[
                  { l: 'Email', v: athlete.email },
                  { l: 'Telefono', v: athlete.phone },
                  { l: 'Inizio', v: athlete.startDate },
                  { l: 'Percorso', v: `${daysSinceStart} giorni` },
                  { l: 'Stato', v: athlete.status === 'active' ? 'Attivo' : 'In pausa' },
                  { l: 'Avg. Obiettivi', v: athleteGoals.length > 0 ? `${Math.round(athleteGoals.reduce((s, g) => s + g.progress, 0) / athleteGoals.length)}%` : '—' },
                ].map((r) => (
                  <div key={r.l} className="flex justify-between px-6 py-3 border-b border-white/[0.03]">
                    <span className="text-[11px] text-white/20">{r.l}</span>
                    <span className="text-[11px] text-white/60">{r.v}</span>
                  </div>
                ))}
              </div>
              {athlete.notes && (
                <div className="px-6 py-4">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-white/15 mb-1.5">Note</p>
                  <p className="text-[11px] text-white/30 leading-relaxed">{athlete.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PERCORSO */}
        {activeTab === 'percorso' && (
          <div className="space-y-8 page-enter">
            <div className="border border-white/[0.06]">
              <div className="px-6 py-5">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-1">Il tuo percorso</p>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', lineHeight: 1, letterSpacing: '1px' }} className="text-white">
                  {athlete.name.toUpperCase()}, CONTINUA COS&Igrave;.
                </h2>
              </div>
              <div className="grid grid-cols-3 border-t border-white/[0.06]">
                {[
                  { value: daysSinceStart, label: 'Giorni attivi' },
                  { value: athleteSmartGoals.length, label: 'Obiettivi' },
                  { value: athleteAchievements.length, label: 'Traguardi' },
                ].map((stat) => (
                  <div key={stat.label} className="px-6 py-5 border-r border-white/[0.06] last:border-r-0">
                    <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{stat.value}</p>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/20 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-[9px] text-white/15 mb-2">
                  <span>{athlete.startDate}</span>
                  <span>Giorno {daysSinceStart}</span>
                </div>
                <div className="h-[2px] bg-white/[0.06] overflow-hidden">
                  <div className="h-full bg-white/40 transition-all duration-1000" style={{ width: `${Math.min(100, (daysSinceStart / 365) * 100)}%` }} />
                </div>
              </div>
            </div>

            {/* SMART Goals */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/30">Obiettivi S.M.A.R.T.</h2>
                <button onClick={() => { setEditingGoal({ title: '', target: '', current: '', progress: 0, deadline: '', status: 'in-progress' }); setShowGoalModal(true); }} className="text-[9px] uppercase tracking-[0.15em] text-white/20 hover:text-white/50 transition-colors flex items-center gap-1">
                  <Plus size={11} /> Nuovo
                </button>
              </div>
              <div className="space-y-px">
                {athleteSmartGoals.map((sg) => {
                  const progress = sg.targetValue > sg.startValue
                    ? ((sg.currentValue - sg.startValue) / (sg.targetValue - sg.startValue)) * 100
                    : ((sg.startValue - sg.currentValue) / (sg.startValue - sg.targetValue)) * 100;
                  const clampedProgress = Math.min(100, Math.max(0, progress));
                  const daysLeft = Math.floor((new Date(sg.deadline).getTime() - new Date(2026, 1, 10).getTime()) / (1000 * 60 * 60 * 24));
                  const isExpanded = expandedGoal === sg.id;
                  return (
                    <div key={sg.id} className="border border-white/[0.06] overflow-hidden">
                      <div className="px-6 py-5 cursor-pointer hover:bg-white/[0.015] transition-colors" onClick={() => setExpandedGoal(isExpanded ? null : sg.id)}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-white/20">{METRIC_ICONS[sg.metric] || <Target size={14} />}</div>
                            <div>
                              <h3 className="text-[13px] text-white/80">{sg.title}</h3>
                              <p className="text-[9px] text-white/15 mt-0.5">{daysLeft > 0 ? `${daysLeft} giorni rimanenti` : 'Scaduto'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-lg text-white/80 tabular-nums" style={{ fontFamily: 'var(--font-heading)' }}>{Math.round(clampedProgress)}%</span>
                            <ChevronRight size={14} className={`text-white/15 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                          </div>
                        </div>
                        <div className="h-[2px] bg-white/[0.06] overflow-hidden">
                          <div className="h-full bg-white/50 transition-all duration-700" style={{ width: `${clampedProgress}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-white/15 mt-2">
                          <span>{sg.startValue} {sg.unit}</span>
                          <span>{sg.targetValue} {sg.unit}</span>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="px-6 pb-6 border-t border-white/[0.04] pt-5 space-y-5">
                          <div className="grid grid-cols-3 gap-px bg-white/[0.06]">
                            <div className="bg-[#0A0A0A] p-4 text-center">
                              <p className="text-[8px] uppercase tracking-[0.2em] text-white/15">Partenza</p>
                              <p className="text-lg text-white/30 mt-1" style={{ fontFamily: 'var(--font-heading)' }}>{sg.startValue}</p>
                            </div>
                            <div className="bg-[#0A0A0A] p-4 text-center">
                              <p className="text-[8px] uppercase tracking-[0.2em] text-white/15">Attuale</p>
                              <p className="text-lg text-white mt-1" style={{ fontFamily: 'var(--font-heading)' }}>{sg.currentValue}</p>
                            </div>
                            <div className="bg-[#0A0A0A] p-4 text-center">
                              <p className="text-[8px] uppercase tracking-[0.2em] text-white/15">Target</p>
                              <p className="text-lg text-white/30 mt-1" style={{ fontFamily: 'var(--font-heading)' }}>{sg.targetValue}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-white/15 mb-3">Milestones</p>
                            <div className="grid grid-cols-2 gap-px bg-white/[0.04]">
                              {sg.milestones.map((ms) => (
                                <div key={ms.id} className="flex items-center gap-2 p-3 bg-[#0A0A0A]">
                                  {ms.achieved ? <CheckCircle2 size={12} className="text-white/50" /> : <div className="w-3 h-3 border border-white/10" />}
                                  <div>
                                    <p className={`text-[11px] ${ms.achieved ? 'text-white/60' : 'text-white/20'}`}>{ms.label}</p>
                                    {ms.achievedDate && <p className="text-[8px] text-white/15">{ms.achievedDate}</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-white/15 mb-3">Metodo S.M.A.R.T.</p>
                            <div className="space-y-px">
                              {[
                                { letter: 'S', label: 'Specific', text: sg.specific },
                                { letter: 'M', label: 'Measurable', text: sg.measurable },
                                { letter: 'A', label: 'Achievable', text: sg.achievable },
                                { letter: 'R', label: 'Relevant', text: sg.relevant },
                                { letter: 'T', label: 'Time-bound', text: sg.timeBound },
                              ].map((s) => (
                                <div key={s.letter} className="flex gap-4 py-2.5 border-b border-white/[0.03] last:border-b-0">
                                  <span className="text-[11px] font-bold text-white/30 w-4 shrink-0">{s.letter}</span>
                                  <div>
                                    <p className="text-[8px] uppercase tracking-[0.2em] text-white/15">{s.label}</p>
                                    <p className="text-[11px] text-white/40 mt-0.5">{s.text}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[9px] text-white/10 pt-2">
                            <span>Creato: {sg.createdAt}</span>
                            <span>Scadenza: {sg.deadline}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Check-in */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/30">Check-in Settimanale</h2>
                <button onClick={() => setShowCheckInModal(true)} className="text-[9px] uppercase tracking-[0.15em] text-white/20 hover:text-white/50 transition-colors flex items-center gap-1">
                  <Plus size={11} /> Check-in
                </button>
              </div>
              {athleteCheckIns.length > 1 && (
                <div className="border border-white/[0.06] p-6 mb-px">
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={athleteCheckIns.map(ci => ({ date: ci.date.slice(5), Umore: ci.mood, Energia: ci.energy, Motivazione: ci.motivation }))}>
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.08} />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.15)' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.15)' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0', fontSize: '10px' }} />
                      <Area type="monotone" dataKey="Umore" stroke="#fff" fill="url(#lineGrad)" strokeWidth={1.5} />
                      <Area type="monotone" dataKey="Energia" stroke="rgba(255,255,255,0.4)" fill="none" strokeWidth={1} strokeDasharray="4 4" />
                      <Area type="monotone" dataKey="Motivazione" stroke="rgba(255,255,255,0.25)" fill="none" strokeWidth={1} strokeDasharray="2 2" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-6 mt-3 text-[9px] text-white/20">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-px bg-white" /> Umore</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-px bg-white/40" /> Energia</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-px bg-white/25" /> Motivazione</span>
                  </div>
                </div>
              )}
              {athleteCheckIns.length > 0 && (() => {
                const latest = athleteCheckIns[athleteCheckIns.length - 1];
                return (
                  <div className="border border-white/[0.06]">
                    <div className="px-6 py-3 border-b border-white/[0.04] flex items-center justify-between">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-white/15">Ultimo check-in &mdash; {latest.date}</p>
                    </div>
                    <div className="grid grid-cols-5">
                      {[
                        { label: 'Umore', value: latest.mood },
                        { label: 'Energia', value: latest.energy },
                        { label: 'Motivazione', value: latest.motivation },
                        { label: 'Sonno', value: latest.sleepQuality },
                        { label: 'Dolori', value: latest.soreness },
                      ].map((item) => (
                        <div key={item.label} className="px-4 py-5 text-center border-r border-white/[0.04] last:border-r-0">
                          <p className="text-xl text-white" style={{ fontFamily: 'var(--font-heading)' }}>{item.value}</p>
                          <p className="text-[8px] uppercase tracking-[0.2em] text-white/15 mt-1">{item.label}</p>
                        </div>
                      ))}
                    </div>
                    {latest.wins && (
                      <div className="px-6 py-3 border-t border-white/[0.04]">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-white/15 mb-1">Win</p>
                        <p className="text-[11px] text-white/40">{latest.wins}</p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Achievements */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/30">Traguardi</h2>
                <button onClick={() => setShowNewAchievement(true)} className="text-[9px] uppercase tracking-[0.2em] text-white/30 hover:text-white/60 flex items-center gap-1"><Plus size={11} /> Aggiungi</button>
              </div>
              {showNewAchievement && (
                <div className="border border-white/[0.06] bg-[#111] p-5 mb-4 space-y-3">
                  <input value={newAchTitle} onChange={(e) => setNewAchTitle(e.target.value)} placeholder="Titolo traguardo" className="w-full bg-transparent border border-white/[0.06] px-3 py-2 text-[12px] text-white/80 placeholder:text-white/20 outline-none" />
                  <input value={newAchDesc} onChange={(e) => setNewAchDesc(e.target.value)} placeholder="Descrizione" className="w-full bg-transparent border border-white/[0.06] px-3 py-2 text-[12px] text-white/80 placeholder:text-white/20 outline-none" />
                  <select value={newAchCategory} onChange={(e) => setNewAchCategory(e.target.value as any)} className="w-full bg-[#111] border border-white/[0.06] px-3 py-2 text-[12px] text-white/80 outline-none">
                    <option value="milestone">Milestone</option>
                    <option value="streak">Streak</option>
                    <option value="pr">Record Personale</option>
                    <option value="consistency">Costanza</option>
                    <option value="mindset">Mindset</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={handleAddAchievement} className="nike-btn nike-btn-white text-[10px]">Salva</button>
                    <button onClick={() => setShowNewAchievement(false)} className="nike-btn text-[10px] text-white/40">Annulla</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.06]">
                {athleteAchievements.map((ach) => (
                  <div key={ach.id} className="bg-[#0A0A0A] p-5 group hover:bg-white/[0.02] transition-colors">
                    <div className="text-white/20 mb-3">{ACHIEVEMENT_ICONS[ach.category] || <Star size={15} />}</div>
                    <p className="text-[11px] text-white/60 font-medium">{ach.title}</p>
                    <p className="text-[9px] text-white/15 mt-1">{ach.description}</p>
                    {ach.unlockedAt && <p className="text-[8px] text-white/10 mt-2">{ach.unlockedAt}</p>}
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 4 - athleteAchievements.length) }).map((_, i) => (
                  <div key={`l-${i}`} className="bg-[#0A0A0A] p-5">
                    <Lock size={13} className="text-white/[0.06] mb-3" />
                    <p className="text-[11px] text-white/[0.08]">Bloccato</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote */}
            <div className="border-t border-b border-white/[0.06] py-10 text-center">
              <p className="text-[13px] text-white/25 italic leading-relaxed max-w-md mx-auto">{sportQuote}</p>
            </div>
          </div>
        )}

        {/* APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-8 page-enter">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/30">Appuntamenti</h2>
              <button onClick={() => setShowNewAppointment(true)} className="text-[9px] uppercase tracking-[0.15em] text-white/20 hover:text-white/50 transition-colors flex items-center gap-1">
                <Plus size={11} /> Nuovo
              </button>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/15 mb-3">Prossimi</p>
              <div className="space-y-px">
                {athleteAppointments.filter((a) => a.status === 'scheduled').map((apt) => {
                  const aptType = APPOINTMENT_TYPES[apt.type];
                  return (
                    <div key={apt.id} className="flex items-center gap-6 px-6 py-4 border border-white/[0.06] hover:bg-white/[0.015] transition-colors">
                      <div className="w-10 text-center shrink-0">
                        <p className="text-lg text-white" style={{ fontFamily: 'var(--font-heading)' }}>{new Date(apt.date).getDate()}</p>
                        <p className="text-[8px] uppercase tracking-[0.15em] text-white/15">{new Date(apt.date).toLocaleDateString('it-IT', { month: 'short' })}</p>
                      </div>
                      <div className="w-px h-8 bg-white/[0.06]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-white/70">{aptType?.label || apt.type}</p>
                        <p className="text-[10px] text-white/20 mt-0.5">{apt.time} &middot; {apt.duration} min &middot; {apt.notes}</p>
                      </div>
                      <button className="w-7 h-7 border border-white/10 flex items-center justify-center text-white/15 hover:text-white/40 transition-colors">
                        <Edit3 size={11} />
                      </button>
                    </div>
                  );
                })}
                {athleteAppointments.filter((a) => a.status === 'scheduled').length === 0 && (
                  <p className="text-[11px] text-white/15 py-8 text-center">Nessun appuntamento in programma</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/15 mb-3">Completati</p>
              <div className="space-y-px">
                {athleteAppointments.filter((a) => a.status === 'completed').map((apt) => {
                  const aptType = APPOINTMENT_TYPES[apt.type];
                  return (
                    <div key={apt.id} className="flex items-center gap-6 px-6 py-3 border border-white/[0.03] opacity-40">
                      <div className="w-10 text-center shrink-0">
                        <p className="text-sm text-white" style={{ fontFamily: 'var(--font-heading)' }}>{new Date(apt.date).getDate()}</p>
                        <p className="text-[8px] uppercase tracking-[0.15em] text-white/15">{new Date(apt.date).toLocaleDateString('it-IT', { month: 'short' })}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-white/60">{aptType?.label || apt.type}</p>
                        <p className="text-[9px] text-white/15">{apt.time} &middot; {apt.notes}</p>
                      </div>
                      <Check size={12} className="text-white/30 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* GALLERY */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/30">Galleria Progressi</h2>
              <div className="flex items-center gap-1.5">
                <button onClick={() => { setCompareMode(!compareMode); setComparePhotos([]); }} className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] transition-colors border ${compareMode ? 'bg-white text-black border-white' : 'border-white/10 text-white/20 hover:text-white/40'}`}>
                  Confronta
                </button>
                <button className="px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] bg-white text-black flex items-center gap-1">
                  <Upload size={11} /> Carica
                </button>
              </div>
            </div>
            {compareMode && comparePhotos.length === 2 && (
              <div className="border border-white/[0.06] p-6">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/15 mb-4">Confronto</p>
                <div className="grid grid-cols-2 gap-px bg-white/[0.06]">
                  {comparePhotos.map((id) => {
                    const photo = MOCK_PHOTOS.find((p) => p.id === id)!;
                    return (
                      <div key={id} className="relative bg-[#0A0A0A]">
                        <img src={photo.url} alt={photo.label} className="w-full aspect-[3/4] object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-[10px] uppercase tracking-[0.15em] text-white/80">{photo.label}</p>
                          <p className="text-[8px] text-white/30">{photo.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {compareMode && comparePhotos.length < 2 && (
              <p className="text-[10px] text-white/15 text-center py-3">Seleziona {2 - comparePhotos.length} foto per confrontare</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-white/[0.06]">
              {MOCK_PHOTOS.map((photo) => (
                <div key={photo.id} onClick={() => compareMode ? toggleComparePhoto(photo.id) : setLightboxPhoto(photo.id)} className={`relative group cursor-pointer aspect-[3/4] bg-[#0A0A0A] ${compareMode && comparePhotos.includes(photo.id) ? 'ring-1 ring-white' : ''}`}>
                  <img src={photo.url} alt={photo.label} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-white/80">{photo.label}</p>
                    <p className="text-[8px] text-white/30">{photo.date}</p>
                  </div>
                  {compareMode && comparePhotos.includes(photo.id) && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-white flex items-center justify-center">
                      <Check size={11} className="text-black" />
                    </div>
                  )}
                </div>
              ))}
              <div className="aspect-[3/4] flex flex-col items-center justify-center gap-2 border border-dashed border-white/[0.06] cursor-pointer hover:border-white/15 transition-colors bg-[#0A0A0A]">
                <Upload size={16} className="text-white/10" />
                <p className="text-[8px] uppercase tracking-[0.2em] text-white/10">Carica</p>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS */}
        {activeTab === 'documents' && (() => {
          const DOC_TYPE_LABELS: Record<string, string> = { 'training-plan': 'Scheda', nutrition: 'Nutrizione', report: 'Report', contract: 'Contratto', medical: 'Medico', other: 'Altro' };
          const DOC_TYPE_FILTERS = ['all', 'training-plan', 'nutrition', 'report', 'medical', 'contract', 'other'] as const;
          const DOC_FILTER_LABELS: Record<string, string> = { all: 'Tutti', 'training-plan': 'Schede', nutrition: 'Nutrizione', report: 'Report', medical: 'Medico', contract: 'Contratto', other: 'Altro' };
          return (
          <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/30">Documenti &amp; Schede</h2>
              <div>
                <input ref={docInputRef} type="file" onChange={handleDocUpload} className="hidden" accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png" />
                <button onClick={() => docInputRef.current?.click()} className="px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] bg-white text-black flex items-center gap-1">
                  <Upload size={11} /> Allega file
                </button>
              </div>
            </div>

            {/* Category filter */}
            <div className="flex gap-px flex-wrap">
              {DOC_TYPE_FILTERS.map((f) => {
                const count = f === 'all' ? athleteDocs.length : athleteDocs.filter(d => d.type === f).length;
                if (f !== 'all' && count === 0) return null;
                return (
                  <button key={f} className={`px-3 py-2 text-[9px] uppercase tracking-[0.15em] transition-colors ${f === 'all' ? 'bg-white text-black' : 'bg-white/[0.03] text-white/20 hover:text-white/40'}`}>
                    {DOC_FILTER_LABELS[f]} <span className="text-[7px] ml-1 opacity-40">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Documents list */}
            {athleteDocs.length > 0 ? (
              <div className="space-y-px">
                {athleteDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-4 px-6 py-4 border border-white/[0.06] hover:bg-white/[0.015] transition-colors group">
                    <div className={`w-8 h-8 flex items-center justify-center shrink-0 ${
                      doc.type === 'training-plan' ? 'bg-white/[0.08] text-white/40' : 'bg-white/[0.04] text-white/15'
                    }`}>
                      <FileText size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-white/60 truncate">{doc.name}</p>
                      <p className="text-[9px] text-white/15 mt-0.5">
                        <span className={`inline-block px-1.5 py-0.5 mr-2 text-[7px] uppercase tracking-[0.15em] ${
                          doc.type === 'training-plan' ? 'bg-white/[0.08] text-white/40' : 'bg-white/[0.03] text-white/20'
                        }`}>{DOC_TYPE_LABELS[doc.type] || doc.type}</span>
                        {doc.size} &middot; {doc.uploadedAt} &middot; {doc.uploadedBy}
                      </p>
                    </div>
                    <div className="flex items-center gap-px opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="w-7 h-7 bg-white/[0.04] flex items-center justify-center text-white/20 hover:text-white/50 transition-colors"><Eye size={11} /></a>
                      <a href={doc.url} download className="w-7 h-7 bg-white/[0.04] flex items-center justify-center text-white/20 hover:text-white/50 transition-colors"><Download size={11} /></a>
                      <button onClick={() => handleDeleteDoc(doc.id)} className="w-7 h-7 bg-white/[0.04] flex items-center justify-center text-white/20 hover:text-red-400/40 transition-colors"><Trash2 size={11} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-white/[0.06] py-10 text-center">
                <FileText size={20} className="text-white/10 mx-auto mb-2" />
                <p className="text-[11px] text-white/20">Nessun documento allegato</p>
              </div>
            )}

            {/* Drop zone */}
            <div onClick={() => docInputRef.current?.click()} className="border border-dashed border-white/[0.06] py-12 flex flex-col items-center justify-center gap-2 hover:border-white/15 transition-colors cursor-pointer">
              <Upload size={16} className="text-white/10" />
              <p className="text-[11px] text-white/15">Trascina file qui per allegarli</p>
              <p className="text-[9px] text-white/[0.08]">Schede, piani alimentari, referti, contratti &mdash; PDF, XLSX, DOC, IMG</p>
            </div>
          </div>
          );
        })()}

        {/* NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-6 page-enter">
            {/* New note form */}
            <div className="border border-white/[0.06] p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-3">Nuova nota</p>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Scrivi una nota su questo atleta..."
                rows={3}
                className="nike-input resize-none w-full mb-3"
              />
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-px">
                  {(['general', 'performance', 'injury', 'nutrition', 'mental', 'admin'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNoteCategory(cat)}
                      className={`px-3 py-1.5 text-[8px] uppercase tracking-[0.15em] transition-colors ${
                        noteCategory === cat ? 'bg-white text-black' : 'bg-white/[0.03] text-white/20 hover:text-white/40'
                      }`}
                    >
                      {cat === 'general' ? 'Generale' : cat === 'performance' ? 'Performance' : cat === 'injury' ? 'Infortunio' : cat === 'nutrition' ? 'Nutrizione' : cat === 'mental' ? 'Mentale' : 'Admin'}
                    </button>
                  ))}
                </div>
                <div className="flex gap-px">
                  {(['low', 'medium', 'high'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setNotePriority(p)}
                      className={`px-3 py-1.5 text-[8px] uppercase tracking-[0.15em] transition-colors ${
                        notePriority === p ? 'bg-white text-black' : 'bg-white/[0.03] text-white/20 hover:text-white/40'
                      }`}
                    >
                      {p === 'low' ? 'Bassa' : p === 'medium' ? 'Media' : 'Alta'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAddNote}
                  disabled={!noteContent.trim()}
                  className="ml-auto px-4 py-1.5 text-[9px] uppercase tracking-[0.15em] bg-white text-black font-medium disabled:opacity-30"
                >
                  Aggiungi nota
                </button>
              </div>
            </div>

            {/* Pinned notes */}
            {athleteNotesFiltered.filter(n => n.pinned).length > 0 && (
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-3">Fissate</p>
                <div className="space-y-px">
                  {athleteNotesFiltered.filter(n => n.pinned).map(note => {
                    const categoryLabels: Record<string, string> = { general: 'Generale', performance: 'Performance', injury: 'Infortunio', nutrition: 'Nutrizione', mental: 'Mentale', admin: 'Admin' };
                    return (
                      <div key={note.id} className="flex gap-4 px-5 py-4 border border-white/[0.06] bg-white/[0.01] group">
                        <div className="w-1 shrink-0 mt-1" style={{ backgroundColor: note.priority === 'high' ? 'rgba(239,68,68,0.5)' : note.priority === 'medium' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)' }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-white/65 leading-relaxed">{note.content}</p>
                          <div className="flex items-center gap-3 mt-2 text-[9px] text-white/15">
                            <span>{note.authorName}</span>
                            <span>{new Date(note.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            <span className="px-1.5 py-0.5 bg-white/[0.03] text-[8px] uppercase tracking-wider">{categoryLabels[note.category]}</span>
                          </div>
                        </div>
                        <Star size={10} className="text-white/30 shrink-0 mt-1" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All notes */}
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-3">Tutte le note ({athleteNotesFiltered.length})</p>
              <div className="space-y-px">
                {athleteNotesFiltered.filter(n => !n.pinned).map(note => {
                  const categoryLabels: Record<string, string> = { general: 'Generale', performance: 'Performance', injury: 'Infortunio', nutrition: 'Nutrizione', mental: 'Mentale', admin: 'Admin' };
                  return (
                    <div key={note.id} className="flex gap-4 px-5 py-4 border border-white/[0.04] hover:bg-white/[0.01] transition-colors group">
                      <div className="w-1 shrink-0 mt-1" style={{ backgroundColor: note.priority === 'high' ? 'rgba(239,68,68,0.4)' : note.priority === 'medium' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-white/55 leading-relaxed">{note.content}</p>
                        <div className="flex items-center gap-3 mt-2 text-[9px] text-white/15">
                          <span>{note.authorName}</span>
                          <span>{new Date(note.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          <span className="px-1.5 py-0.5 bg-white/[0.03] text-[8px] uppercase tracking-wider">{categoryLabels[note.category]}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-px opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => handleTogglePinNote(note)} className="w-6 h-6 bg-white/[0.03] flex items-center justify-center text-white/15 hover:text-white/40 transition-colors"><Star size={9} /></button>
                        <button onClick={() => handleDeleteNote(note.id)} className="w-6 h-6 bg-white/[0.03] flex items-center justify-center text-white/15 hover:text-white/40 transition-colors"><Trash2 size={9} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MEASUREMENTS */}
        {activeTab === 'measurements' && (
          <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/30">Storico misurazioni</h2>
              <button
                onClick={() => setShowNewMeasurement(!showNewMeasurement)}
                className="px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] bg-white text-black flex items-center gap-1"
              >
                <Plus size={11} /> Nuova
              </button>
            </div>

            {/* New measurement form */}
            {showNewMeasurement && (
              <div className="border border-white/[0.06] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-4">Nuova Misurazione</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[8px] uppercase tracking-[0.15em] text-white/15 mb-1 block">Data</label>
                    <input type="date" value={newMeasurement.date || ''} onChange={(e) => setNewMeasurement({ ...newMeasurement, date: e.target.value })} className="nike-input" />
                  </div>
                  <div>
                    <label className="text-[8px] uppercase tracking-[0.15em] text-white/15 mb-1 block">Peso (kg)</label>
                    <input type="number" step="0.1" placeholder="76.5" onChange={(e) => setNewMeasurement({ ...newMeasurement, weight: e.target.value })} className="nike-input" />
                  </div>
                  <div>
                    <label className="text-[8px] uppercase tracking-[0.15em] text-white/15 mb-1 block">Body Fat (%)</label>
                    <input type="number" step="0.1" placeholder="13" onChange={(e) => setNewMeasurement({ ...newMeasurement, bodyFat: e.target.value })} className="nike-input" />
                  </div>
                  {(athlete.sport === 'boxing') && (
                    <div>
                      <label className="text-[8px] uppercase tracking-[0.15em] text-white/15 mb-1 block">Punch Power (u)</label>
                      <input type="number" placeholder="88" onChange={(e) => setNewMeasurement({ ...newMeasurement, punchPower: e.target.value })} className="nike-input" />
                    </div>
                  )}
                  {(athlete.sport === 'gym' || athlete.sport === 'boxing') && (
                    <div>
                      <label className="text-[8px] uppercase tracking-[0.15em] text-white/15 mb-1 block">Bench Press (kg)</label>
                      <input type="number" placeholder="95" onChange={(e) => setNewMeasurement({ ...newMeasurement, benchPress: e.target.value })} className="nike-input" />
                    </div>
                  )}
                  {(athlete.sport === 'gym' || athlete.sport === 'football') && (
                    <div>
                      <label className="text-[8px] uppercase tracking-[0.15em] text-white/15 mb-1 block">Squat (kg)</label>
                      <input type="number" placeholder="125" onChange={(e) => setNewMeasurement({ ...newMeasurement, squat: e.target.value })} className="nike-input" />
                    </div>
                  )}
                  {(athlete.sport === 'gym') && (
                    <div>
                      <label className="text-[8px] uppercase tracking-[0.15em] text-white/15 mb-1 block">Deadlift (kg)</label>
                      <input type="number" placeholder="145" onChange={(e) => setNewMeasurement({ ...newMeasurement, deadlift: e.target.value })} className="nike-input" />
                    </div>
                  )}
                  {(athlete.sport === 'football' || athlete.sport === 'basketball' || athlete.sport === 'boxing') && (
                    <div>
                      <label className="text-[8px] uppercase tracking-[0.15em] text-white/15 mb-1 block">Sprint 100m (s)</label>
                      <input type="number" step="0.1" placeholder="11.3" onChange={(e) => setNewMeasurement({ ...newMeasurement, sprintTime: e.target.value })} className="nike-input" />
                    </div>
                  )}
                  {(athlete.sport === 'football') && (
                    <div>
                      <label className="text-[8px] uppercase tracking-[0.15em] text-white/15 mb-1 block">VO2max (ml/kg/min)</label>
                      <input type="number" step="0.1" placeholder="56" onChange={(e) => setNewMeasurement({ ...newMeasurement, vo2max: e.target.value })} className="nike-input" />
                    </div>
                  )}
                  {(athlete.sport === 'basketball') && (
                    <div>
                      <label className="text-[8px] uppercase tracking-[0.15em] text-white/15 mb-1 block">Salto Verticale (cm)</label>
                      <input type="number" placeholder="68" onChange={(e) => setNewMeasurement({ ...newMeasurement, verticalJump: e.target.value })} className="nike-input" />
                    </div>
                  )}
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <button onClick={() => setShowNewMeasurement(false)} className="px-4 py-1.5 text-[9px] uppercase tracking-[0.15em] text-white/20 hover:text-white/40 transition-colors">Annulla</button>
                  <button onClick={handleSaveMeasurement} className="px-4 py-1.5 text-[9px] uppercase tracking-[0.15em] bg-white text-black font-medium">Salva</button>
                </div>
              </div>
            )}

            {/* Measurements table */}
            <div className="border border-white/[0.06]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left px-4 py-3 text-[8px] uppercase tracking-[0.15em] text-white/20">Data</th>
                      <th className="text-left px-4 py-3 text-[8px] uppercase tracking-[0.15em] text-white/20">Peso</th>
                      {athlete.measurements.some(m => m.bodyFat) && <th className="text-left px-4 py-3 text-[8px] uppercase tracking-[0.15em] text-white/20">Body Fat</th>}
                      {athlete.measurements.some(m => m.punchPower) && <th className="text-left px-4 py-3 text-[8px] uppercase tracking-[0.15em] text-white/20">Punch Power</th>}
                      {athlete.measurements.some(m => m.benchPress) && <th className="text-left px-4 py-3 text-[8px] uppercase tracking-[0.15em] text-white/20">Bench Press</th>}
                      {athlete.measurements.some(m => m.squat) && <th className="text-left px-4 py-3 text-[8px] uppercase tracking-[0.15em] text-white/20">Squat</th>}
                      {athlete.measurements.some(m => m.deadlift) && <th className="text-left px-4 py-3 text-[8px] uppercase tracking-[0.15em] text-white/20">Deadlift</th>}
                      {athlete.measurements.some(m => m.sprintTime) && <th className="text-left px-4 py-3 text-[8px] uppercase tracking-[0.15em] text-white/20">Sprint</th>}
                      {athlete.measurements.some(m => m.vo2max) && <th className="text-left px-4 py-3 text-[8px] uppercase tracking-[0.15em] text-white/20">VO2max</th>}
                      {athlete.measurements.some(m => m.verticalJump) && <th className="text-left px-4 py-3 text-[8px] uppercase tracking-[0.15em] text-white/20">Salto V.</th>}
                      <th className="text-left px-4 py-3 text-[8px] uppercase tracking-[0.15em] text-white/20">Δ Peso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...athlete.measurements].reverse().map((m, idx, arr) => {
                      const prev = idx < arr.length - 1 ? arr[idx + 1] : null;
                      const wDelta = prev ? +(m.weight - prev.weight).toFixed(1) : null;
                      return (
                        <tr key={m.date} className="border-b border-white/[0.02] last:border-b-0 hover:bg-white/[0.01] transition-colors">
                          <td className="px-4 py-3 text-[11px] text-white/40 tabular-nums">{m.date}</td>
                          <td className="px-4 py-3 text-[11px] text-white/60 tabular-nums">{m.weight} kg</td>
                          {athlete.measurements.some(x => x.bodyFat) && <td className="px-4 py-3 text-[11px] text-white/40 tabular-nums">{m.bodyFat ? `${m.bodyFat}%` : '—'}</td>}
                          {athlete.measurements.some(x => x.punchPower) && <td className="px-4 py-3 text-[11px] text-white/40 tabular-nums">{m.punchPower ?? '—'}</td>}
                          {athlete.measurements.some(x => x.benchPress) && <td className="px-4 py-3 text-[11px] text-white/40 tabular-nums">{m.benchPress ? `${m.benchPress} kg` : '—'}</td>}
                          {athlete.measurements.some(x => x.squat) && <td className="px-4 py-3 text-[11px] text-white/40 tabular-nums">{m.squat ? `${m.squat} kg` : '—'}</td>}
                          {athlete.measurements.some(x => x.deadlift) && <td className="px-4 py-3 text-[11px] text-white/40 tabular-nums">{m.deadlift ? `${m.deadlift} kg` : '—'}</td>}
                          {athlete.measurements.some(x => x.sprintTime) && <td className="px-4 py-3 text-[11px] text-white/40 tabular-nums">{m.sprintTime ? `${m.sprintTime}s` : '—'}</td>}
                          {athlete.measurements.some(x => x.vo2max) && <td className="px-4 py-3 text-[11px] text-white/40 tabular-nums">{m.vo2max ?? '—'}</td>}
                          {athlete.measurements.some(x => x.verticalJump) && <td className="px-4 py-3 text-[11px] text-white/40 tabular-nums">{m.verticalJump ? `${m.verticalJump} cm` : '—'}</td>}
                          <td className="px-4 py-3 text-[10px] tabular-nums">
                            {wDelta !== null ? (
                              <span className={wDelta < 0 ? 'text-white/40' : wDelta > 0 ? 'text-white/25' : 'text-white/15'}>
                                {wDelta > 0 ? '+' : ''}{wDelta}
                              </span>
                            ) : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-px bg-white/[0.06]">
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-4">Andamento Peso</p>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={athlete.measurements.map(m => ({ date: m.date.slice(5), value: m.weight }))}>
                    <defs>
                      <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fff" stopOpacity={0.08} />
                        <stop offset="100%" stopColor="#fff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.1)', fontSize: 9 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.06)', fontSize: 10, color: '#fff' }} />
                    <Area type="monotone" dataKey="value" stroke="rgba(255,255,255,0.4)" fill="url(#weightFill)" strokeWidth={1.5} dot={{ r: 2, fill: 'rgba(255,255,255,0.5)' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {athlete.measurements.some(m => m.bodyFat) && (
                <div className="bg-[#0A0A0A] p-5">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-4">Body Fat %</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={athlete.measurements.filter(m => m.bodyFat).map(m => ({ date: m.date.slice(5), value: m.bodyFat }))}>
                      <defs>
                        <linearGradient id="bfFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#fff" stopOpacity={0.08} />
                          <stop offset="100%" stopColor="#fff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.1)', fontSize: 9 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.06)', fontSize: 10, color: '#fff' }} />
                      <Area type="monotone" dataKey="value" stroke="rgba(255,255,255,0.4)" fill="url(#bfFill)" strokeWidth={1.5} dot={{ r: 2, fill: 'rgba(255,255,255,0.5)' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6" onClick={() => setLightboxPhoto(null)}>
          <button className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors" onClick={() => setLightboxPhoto(null)}><X size={20} /></button>
          <div onClick={(e) => e.stopPropagation()} className="relative max-w-2xl w-full">
            <img src={MOCK_PHOTOS.find((p) => p.id === lightboxPhoto)?.url} alt="" className="w-full" />
            <div className="absolute bottom-4 left-4 bg-black/70 px-4 py-2">
              <p className="text-[10px] text-white/80">{MOCK_PHOTOS.find((p) => p.id === lightboxPhoto)?.label}</p>
              <p className="text-[8px] text-white/30">{MOCK_PHOTOS.find((p) => p.id === lightboxPhoto)?.date}</p>
            </div>
            <button onClick={() => { const idx = MOCK_PHOTOS.findIndex((p) => p.id === lightboxPhoto); if (idx > 0) setLightboxPhoto(MOCK_PHOTOS[idx - 1].id); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 flex items-center justify-center text-white/40 hover:text-white"><ChevronLeft size={16} /></button>
            <button onClick={() => { const idx = MOCK_PHOTOS.findIndex((p) => p.id === lightboxPhoto); if (idx < MOCK_PHOTOS.length - 1) setLightboxPhoto(MOCK_PHOTOS[idx + 1].id); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 flex items-center justify-center text-white/40 hover:text-white"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6" onClick={() => setShowEditModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-[#111] border border-white/[0.08] w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/40">Modifica atleta</h3>
              <button onClick={() => setShowEditModal(false)} className="text-white/20 hover:text-white transition-colors"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Nome</label><input type="text" value={editFormData.name || ''} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="nike-input" /></div>
                <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Cognome</label><input type="text" value={editFormData.surname || ''} onChange={(e) => setEditFormData({...editFormData, surname: e.target.value})} className="nike-input" /></div>
              </div>
              <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Email</label><input type="email" value={editFormData.email || ''} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="nike-input" /></div>
              <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Telefono</label><input type="tel" value={editFormData.phone || ''} onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})} className="nike-input" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Età</label><input type="number" value={editFormData.age || ''} onChange={(e) => setEditFormData({...editFormData, age: Number(e.target.value)})} className="nike-input" /></div>
                <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Altezza</label><input type="number" value={editFormData.height || ''} onChange={(e) => setEditFormData({...editFormData, height: Number(e.target.value)})} className="nike-input" /></div>
                <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Peso</label><input type="number" value={editFormData.weight || ''} onChange={(e) => setEditFormData({...editFormData, weight: Number(e.target.value)})} className="nike-input" /></div>
              </div>
              <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Obiettivo</label><input type="text" value={editFormData.goal || ''} onChange={(e) => setEditFormData({...editFormData, goal: e.target.value})} className="nike-input" /></div>
              <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Stato</label>
                <select value={editFormData.status || 'active'} onChange={(e) => setEditFormData({...editFormData, status: e.target.value})} className="nike-input"><option value="active">Attivo</option><option value="paused">In pausa</option><option value="completed">Completato</option></select>
              </div>
              <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Note</label><textarea value={editFormData.notes || ''} onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})} rows={3} className="nike-input resize-none" /></div>
            </div>
            <div className="px-6 py-5 border-t border-white/[0.06] flex items-center justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-[9px] uppercase tracking-[0.15em] text-white/20 hover:text-white/50 transition-colors">Annulla</button>
              <button onClick={handleSaveAthlete} className="px-5 py-2.5 text-[9px] uppercase tracking-[0.15em] bg-white text-black font-medium">Salva modifiche</button>
            </div>
          </div>
        </div>
      )}

      {/* GOAL MODAL */}
      {showGoalModal && editingGoal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6" onClick={() => { setShowGoalModal(false); setEditingGoal(null); }}>
          <div onClick={(e) => e.stopPropagation()} className="bg-[#111] border border-white/[0.08] w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/40">{editingGoal.id ? 'Modifica obiettivo' : 'Nuovo obiettivo'}</h3>
              <button onClick={() => { setShowGoalModal(false); setEditingGoal(null); }} className="text-white/20 hover:text-white transition-colors"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Titolo</label>
                <input type="text" value={editingGoal.title} onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })} placeholder="es. Aumentare bench press" className="nike-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Attuale</label>
                  <input type="text" value={editingGoal.current} onChange={(e) => setEditingGoal({ ...editingGoal, current: e.target.value })} placeholder="es. 80 kg" className="nike-input" />
                </div>
                <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Target</label>
                  <input type="text" value={editingGoal.target} onChange={(e) => setEditingGoal({ ...editingGoal, target: e.target.value })} placeholder="es. 100 kg" className="nike-input" />
                </div>
              </div>
              <div>
                <label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-2 block">Progresso &mdash; {editingGoal.progress}%</label>
                <input type="range" min={0} max={100} value={editingGoal.progress} onChange={(e) => setEditingGoal({ ...editingGoal, progress: Number(e.target.value) })}
                  className="w-full h-[2px] bg-white/[0.06] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Scadenza</label>
                  <input type="date" value={editingGoal.deadline} onChange={(e) => setEditingGoal({ ...editingGoal, deadline: e.target.value })} className="nike-input" />
                </div>
                <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Stato</label>
                  <select value={editingGoal.status} onChange={(e) => setEditingGoal({ ...editingGoal, status: e.target.value as 'in-progress' | 'achieved' | 'missed' })} className="nike-input">
                    <option value="in-progress">In corso</option><option value="achieved">Raggiunto</option><option value="missed">Non raggiunto</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-5 border-t border-white/[0.06] flex items-center justify-between">
              <div>{editingGoal.id && <button onClick={handleDeleteGoal} className="text-[9px] uppercase tracking-[0.15em] text-white/15 hover:text-white/40 transition-colors flex items-center gap-1"><Trash2 size={10} /> Elimina</button>}</div>
              <div className="flex items-center gap-3">
                <button onClick={() => { setShowGoalModal(false); setEditingGoal(null); }} className="px-4 py-2 text-[9px] uppercase tracking-[0.15em] text-white/20 hover:text-white/50 transition-colors">Annulla</button>
                <button onClick={handleSaveGoal} className="px-5 py-2.5 text-[9px] uppercase tracking-[0.15em] bg-white text-black font-medium">{editingGoal.id ? 'Salva' : 'Crea'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECK-IN MODAL */}
      {showCheckInModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6" onClick={() => setShowCheckInModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-[#111] border border-white/[0.08] w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/40">Check-in settimanale</h3>
              <button onClick={() => setShowCheckInModal(false)} className="text-white/20 hover:text-white transition-colors"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-5">
              <p className="text-[10px] text-white/20">Valuta da 1 a 10.</p>
              {[
                { key: 'mood', label: 'Umore' },
                { key: 'energy', label: 'Energia' },
                { key: 'motivation', label: 'Motivazione' },
                { key: 'sleepQuality', label: 'Sonno' },
                { key: 'soreness', label: 'Dolori' },
              ].map((field) => (
                <div key={field.key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-white/40">{field.label}</span>
                    <span className="text-sm text-white tabular-nums" style={{ fontFamily: 'var(--font-heading)' }}>{(checkInValues as Record<string, number | string>)[field.key] || 5}</span>
                  </div>
                  <input type="range" min={1} max={10} value={(checkInValues as Record<string, number | string>)[field.key] as number || 5}
                    onChange={(e) => setCheckInValues(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                    className="w-full h-[2px] bg-white/[0.06] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer" />
                </div>
              ))}
              <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Win</label>
                <input type="text" value={checkInValues.wins} onChange={(e) => setCheckInValues(prev => ({ ...prev, wins: e.target.value }))} placeholder="Cosa è andato bene?" className="nike-input" />
              </div>
              <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Note</label>
                <textarea value={checkInValues.notes} onChange={(e) => setCheckInValues(prev => ({ ...prev, notes: e.target.value }))} rows={2} placeholder="Come ti senti..." className="nike-input resize-none" />
              </div>
            </div>
            <div className="px-6 py-5 border-t border-white/[0.06] flex items-center justify-end gap-3">
              <button onClick={() => setShowCheckInModal(false)} className="px-4 py-2 text-[9px] uppercase tracking-[0.15em] text-white/20 hover:text-white/50 transition-colors">Annulla</button>
              <button onClick={handleSaveCheckIn} className="px-5 py-2.5 text-[9px] uppercase tracking-[0.15em] bg-white text-black font-medium">Salva</button>
            </div>
          </div>
        </div>
      )}

      {/* NEW APPOINTMENT MODAL */}
      {showNewAppointment && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6" onClick={() => setShowNewAppointment(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-[#111] border border-white/[0.08] w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/40">Nuovo appuntamento</h3>
              <button onClick={() => setShowNewAppointment(false)} className="text-white/20 hover:text-white transition-colors"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Tipo</label>
                <select value={newApt.type} onChange={(e) => setNewApt({ ...newApt, type: e.target.value as 'training' })} className="nike-input">
                  <option value="training">Allenamento</option><option value="call">Chiamata</option><option value="assessment">Valutazione</option><option value="review">Review</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Data</label><input type="date" value={newApt.date} onChange={(e) => setNewApt({ ...newApt, date: e.target.value })} className="nike-input" /></div>
                <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Ora</label><input type="time" value={newApt.time} onChange={(e) => setNewApt({ ...newApt, time: e.target.value })} className="nike-input" /></div>
              </div>
              <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Durata (min)</label><input type="number" value={newApt.duration} onChange={(e) => setNewApt({ ...newApt, duration: Number(e.target.value) })} className="nike-input" /></div>
              <div><label className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5 block">Note</label><textarea rows={2} value={newApt.notes} onChange={(e) => setNewApt({ ...newApt, notes: e.target.value })} placeholder="Dettagli..." className="nike-input resize-none" /></div>
            </div>
            <div className="px-6 py-5 border-t border-white/[0.06] flex items-center justify-end gap-3">
              <button onClick={() => setShowNewAppointment(false)} className="px-4 py-2 text-[9px] uppercase tracking-[0.15em] text-white/20 hover:text-white/50 transition-colors">Annulla</button>
              <button onClick={() => { if (!newApt.date || !newApt.time) return; addAppointment({ athleteId: athlete.id, athleteName: `${athlete.name} ${athlete.surname}`, type: newApt.type, date: newApt.date, time: newApt.time, duration: newApt.duration, notes: newApt.notes, status: 'scheduled', sport: athlete.sport }); setNewApt({ type: 'training', date: '', time: '', duration: 60, notes: '' }); setShowNewAppointment(false); }}
                className="px-5 py-2.5 text-[9px] uppercase tracking-[0.15em] bg-white text-black font-medium">Crea</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}