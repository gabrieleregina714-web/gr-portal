'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { goals } from '@/lib/data';
import { SPORTS, Sport, APPOINTMENT_TYPES, Athlete, Appointment, SmartGoal, WeeklyCheckIn, Achievement } from '@/lib/types';
import {
  Users, TrendingUp, Target, Activity, Award, Flame,
  ArrowUpRight, ArrowDownRight, Minus, ChevronRight,
  Brain, Zap, Heart,
} from 'lucide-react';
import { useStore } from '@/lib/store';

const tooltipStyle = {
  background: '#111',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '0',
  color: '#fff',
  fontSize: '11px',
};

export default function AnalyticsPage() {
  const { athletes, smartGoals, weeklyCheckIns, achievements, appointments: storeAppointments, fetchAll } = useStore();
  useEffect(() => { fetchAll(); }, []);

  const [selectedSport, setSelectedSport] = useState<Sport | 'all'>('all');
  const [activeSection, setActiveSection] = useState<'overview' | 'athletes' | 'goals' | 'wellbeing'>('overview');

  const activeAthletes = athletes.filter((a: Athlete) => a.status === 'active');
  const pausedAthletes = athletes.filter((a: Athlete) => a.status === 'paused');
  const filteredAthletes = selectedSport === 'all' ? athletes : athletes.filter((a: Athlete) => a.sport === selectedSport);

  // ─── Core metrics from real data ───
  const avgProgress = Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length);
  const goalsAchieved = goals.filter((g) => g.status === 'achieved').length;
  const goalsInProgress = goals.filter((g) => g.status === 'in-progress').length;
  const totalSessions = storeAppointments.length;
  const trainingSessions = storeAppointments.filter((a: Appointment) => a.type === 'training').length;
  const retentionRate = Math.round((activeAthletes.length / athletes.length) * 100);
  const totalMeasurements = athletes.reduce((s: number, a: Athlete) => s + a.measurements.length, 0);
  const totalCheckIns = weeklyCheckIns.length;
  const totalAchievements = achievements.length;
  const totalSmartGoals = smartGoals.length;

  // ─── Monthly trend from real measurements + appointments ───
  const monthlyTrend = useMemo(() => {
    const months = [
      { key: '2025-08', label: 'Ago' },
      { key: '2025-09', label: 'Set' },
      { key: '2025-10', label: 'Ott' },
      { key: '2025-11', label: 'Nov' },
      { key: '2025-12', label: 'Dic' },
      { key: '2026-01', label: 'Gen' },
      { key: '2026-02', label: 'Feb' },
    ];
    return months.map(({ key, label }) => {
      const atleti = athletes.filter((a: Athlete) => a.startDate.substring(0, 7) <= key).length;
      const misurazioni = athletes.reduce((sum: number, a: Athlete) =>
        sum + a.measurements.filter((m) => m.date.startsWith(key)).length, 0);
      const sessioni = storeAppointments.filter((a: Appointment) => a.date.startsWith(key)).length;
      return { month: label, sessioni: misurazioni + sessioni, atleti };
    });
  }, [storeAppointments]);

  // ─── Weekly heatmap from real appointment times ───
  const weeklyHeatmap = useMemo(() => {
    const dayNames = ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB'];
    const hourBuckets = [6, 8, 10, 12, 14, 16, 18, 20];
    const grid: Record<string, Record<string, number>> = {};
    ['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM'].forEach((d) => {
      grid[d] = {};
      hourBuckets.forEach((h) => { grid[d][`h${String(h).padStart(2, '0')}`] = 0; });
    });
    storeAppointments.forEach((apt: Appointment) => {
      const dateObj = new Date(apt.date + 'T00:00');
      const dayLabel = dayNames[dateObj.getDay()];
      const hour = parseInt(apt.time.split(':')[0], 10);
      const bucket = hourBuckets.reduce((prev, curr) =>
        Math.abs(curr - hour) < Math.abs(prev - hour) ? curr : prev);
      const key = `h${String(bucket).padStart(2, '0')}`;
      if (grid[dayLabel]) grid[dayLabel][key] = (grid[dayLabel][key] || 0) + 1;
    });
    return ['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM'].map((day) => ({ day, ...grid[day] }));
  }, [storeAppointments]);
  const hours = ['06', '08', '10', '12', '14', '16', '18', '20'];

  // ─── Athlete performance deltas (last 2 measurements) ───
  const athleteDeltas = useMemo(() => {
    return filteredAthletes
      .filter((a: Athlete) => a.measurements.length >= 2)
      .map((a: Athlete) => {
        const m = a.measurements;
        const last = m[m.length - 1];
        const prev = m[m.length - 2];
        const weightDelta = +(last.weight - prev.weight).toFixed(1);
        const bfDelta = last.bodyFat && prev.bodyFat ? +(last.bodyFat - prev.bodyFat).toFixed(1) : null;
        let kpiLabel = '', kpiDelta: number | null = null, kpiUnit = '';
        if (a.sport === 'boxing') { kpiLabel = 'Potenza'; kpiDelta = last.punchPower && prev.punchPower ? last.punchPower - prev.punchPower : null; kpiUnit = 'u'; }
        else if (a.sport === 'basketball') { kpiLabel = 'Salto'; kpiDelta = last.verticalJump && prev.verticalJump ? last.verticalJump - prev.verticalJump : null; kpiUnit = 'cm'; }
        else if (a.sport === 'football') { kpiLabel = 'VO2max'; kpiDelta = last.vo2max && prev.vo2max ? last.vo2max - prev.vo2max : null; kpiUnit = ''; }
        else { kpiLabel = 'Bench'; kpiDelta = last.benchPress && prev.benchPress ? last.benchPress - prev.benchPress : null; kpiUnit = 'kg'; }
        return { ...a, weightDelta, bfDelta, kpiLabel, kpiDelta, kpiUnit };
      });
  }, [filteredAthletes]);

  // ─── Goal ranking per athlete ───
  const goalData = useMemo(() => {
    return filteredAthletes.map((a: Athlete) => {
      const athGoals = goals.filter((g) => g.athleteId === a.id);
      const avg = athGoals.length > 0 ? Math.round(athGoals.reduce((s, g) => s + g.progress, 0) / athGoals.length) : 0;
      return { id: a.id, name: `${a.name} ${a.surname[0]}.`, fullName: `${a.name} ${a.surname}`, progresso: avg, sport: a.sport, goalCount: athGoals.length };
    }).sort((a, b) => b.progresso - a.progresso);
  }, [filteredAthletes]);

  // ─── Sport distribution ───
  const sportCounts = (Object.keys(SPORTS) as Sport[]).map((s) => ({
    sport: s, label: SPORTS[s].label, count: athletes.filter((a: Athlete) => a.sport === s).length,
    active: athletes.filter((a: Athlete) => a.sport === s && a.status === 'active').length,
  }));

  // ─── Radar chart (real data) ───
  const radarData = useMemo(() => {
    const avgMeasurements = athletes.reduce((s: number, a: Athlete) => s + a.measurements.length, 0) / Math.max(athletes.length, 1);
    const maxPossible = Math.max(...athletes.map((a: Athlete) => a.measurements.length), 1);
    const costanza = Math.round((avgMeasurements / maxPossible) * 100);
    return [
      { metric: 'Costanza', value: costanza },
      { metric: 'Progressi', value: avgProgress },
      { metric: 'Obiettivi', value: Math.round((goalsAchieved / Math.max(goals.length, 1)) * 100) },
      { metric: 'Retention', value: retentionRate },
      { metric: 'Sessioni', value: Math.min(100, Math.round((totalSessions / Math.max(athletes.length * 3, 1)) * 100)) },
    ];
  }, [avgProgress, goalsAchieved, retentionRate, totalSessions]);
  const healthScore = Math.round(radarData.reduce((s, r) => s + r.value, 0) / radarData.length);

  // ─── Wellbeing averages from check-ins ───
  const wellbeingAvg = useMemo(() => {
    if (weeklyCheckIns.length === 0) return { mood: 0, energy: 0, motivation: 0, sleep: 0, soreness: 0 };
    const n = weeklyCheckIns.length;
    return {
      mood: +(weeklyCheckIns.reduce((s: number, c: WeeklyCheckIn) => s + c.mood, 0) / n).toFixed(1),
      energy: +(weeklyCheckIns.reduce((s: number, c: WeeklyCheckIn) => s + c.energy, 0) / n).toFixed(1),
      motivation: +(weeklyCheckIns.reduce((s: number, c: WeeklyCheckIn) => s + c.motivation, 0) / n).toFixed(1),
      sleep: +(weeklyCheckIns.reduce((s: number, c: WeeklyCheckIn) => s + c.sleepQuality, 0) / n).toFixed(1),
      soreness: +(weeklyCheckIns.reduce((s: number, c: WeeklyCheckIn) => s + c.soreness, 0) / n).toFixed(1),
    };
  }, []);

  // ─── Wellbeing trend per week ───
  const wellbeingTrend = useMemo(() => {
    const grouped: Record<string, { mood: number[]; energy: number[]; motivation: number[] }> = {};
    weeklyCheckIns.forEach((ci: WeeklyCheckIn) => {
      const week = ci.date;
      if (!grouped[week]) grouped[week] = { mood: [], energy: [], motivation: [] };
      grouped[week].mood.push(ci.mood);
      grouped[week].energy.push(ci.energy);
      grouped[week].motivation.push(ci.motivation);
    });
    const uniqueDates = Array.from(new Set(weeklyCheckIns.map((c: WeeklyCheckIn) => c.date))).sort();
    return uniqueDates.map((d) => {
      const g = grouped[d];
      return {
        date: d.slice(5),
        Umore: +(g.mood.reduce((a, b) => a + b, 0) / g.mood.length).toFixed(1),
        Energia: +(g.energy.reduce((a, b) => a + b, 0) / g.energy.length).toFixed(1),
        Motivazione: +(g.motivation.reduce((a, b) => a + b, 0) / g.motivation.length).toFixed(1),
      };
    });
  }, []);

  // ─── SMART goal progress overview ───
  const smartGoalProgress = useMemo(() => {
    return smartGoals.map((sg: SmartGoal) => {
      const progress = sg.targetValue > sg.startValue
        ? ((sg.currentValue - sg.startValue) / (sg.targetValue - sg.startValue)) * 100
        : ((sg.startValue - sg.currentValue) / (sg.startValue - sg.targetValue)) * 100;
      const clamped = Math.min(100, Math.max(0, progress));
      const athlete = athletes.find((a: Athlete) => a.id === sg.athleteId);
      const daysLeft = Math.ceil((new Date(sg.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return { ...sg, progress: clamped, athleteName: athlete?.name ?? 'Sconosciuto', daysLeft };
    });
  }, [smartGoals, athletes]);

  const tabs: { key: typeof activeSection; label: string }[] = [
    { key: 'overview', label: 'Panoramica' },
    { key: 'athletes', label: 'Atleti' },
    { key: 'goals', label: 'Obiettivi' },
    { key: 'wellbeing', label: 'Benessere' },
  ];

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 -mt-5 sm:-mt-6 md:-mt-8">

      {/* HEADER */}
      <div className="relative overflow-hidden" style={{ height: '180px' }}>
        <div className="absolute inset-0 bg-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent" />

        <div className="absolute bottom-8 left-6 lg:left-10 z-10">
          <h1 style={{ fontFamily: 'var(--font-heading)', lineHeight: 1, letterSpacing: '2px' }} className="text-white text-[28px] sm:text-[36px] md:text-[42px]">
            ANALYTICS
          </h1>
          <div className="flex items-center gap-2 sm:gap-4 mt-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-[0.15em] text-white/70">{athletes.length} atleti</span>
            <span className="w-px h-3 bg-white/10 hidden sm:block" />
            <span className="text-[11px] uppercase tracking-[0.15em] text-white/70">{totalSmartGoals} obiettivi</span>
            <span className="w-px h-3 bg-white/10 hidden sm:block" />
            <span className="text-[11px] uppercase tracking-[0.15em] text-white/70">{totalMeasurements} misurazioni</span>
            <span className="w-px h-3 bg-white/10 hidden sm:block" />
            <span className="text-[11px] uppercase tracking-[0.15em] text-white/70">Score {healthScore}</span>
          </div>
        </div>

        {/* Sport filter */}
        <div className="absolute bottom-8 right-6 lg:right-10 z-10 flex items-center gap-0 overflow-x-auto scrollbar-hide max-w-[60%] sm:max-w-none">
          <button
            onClick={() => setSelectedSport('all')}
            className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors border border-white/[0.06] ${
              selectedSport === 'all' ? 'bg-white text-black border-white' : 'text-white/55 hover:text-white/70'
            }`}
          >Tutti</button>
          {(Object.keys(SPORTS) as Sport[]).map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSport(s)}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors border border-white/[0.06] border-l-0 ${
                selectedSport === s ? 'bg-white text-black border-white' : 'text-white/55 hover:text-white/70'
              }`}
            >{SPORTS[s].label}</button>
          ))}
        </div>
      </div>

      {/* TAB NAV */}
      <div className="px-4 sm:px-6 lg:px-10 border-b border-white/[0.06] overflow-x-auto scrollbar-hide">
        <div className="flex gap-0 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] transition-colors border-b ${
                activeSection === tab.key
                  ? 'text-white border-white'
                  : 'text-white/55 border-transparent hover:text-white/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-6 lg:px-10 py-8">

        {/* ══════ OVERVIEW ══════ */}
        {activeSection === 'overview' && (
          <div className="space-y-8 page-enter">

            {/* KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-px bg-white/[0.06]">
              {[
                { label: 'Atleti attivi', value: `${activeAthletes.length}`, unit: `/${athletes.length}` },
                { label: 'Retention', value: `${retentionRate}`, unit: '%' },
                { label: 'Progresso', value: `${avgProgress}`, unit: '%' },
                { label: 'Sessioni', value: `${totalSessions}`, unit: '' },
                { label: 'Check-in', value: `${totalCheckIns}`, unit: '' },
                { label: 'Traguardi', value: `${totalAchievements}`, unit: '' },
              ].map((s) => (
                <div key={s.label} className="bg-[#0A0A0A] p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">{s.label}</p>
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                    {s.value}
                    {s.unit && <span className="text-xs text-white/55 ml-1 font-normal">{s.unit}</span>}
                  </p>
                </div>
              ))}
            </div>

            {/* Trend + Radar */}
            <div className="grid md:grid-cols-3 gap-px bg-white/[0.06]">
              <div className="md:col-span-2 bg-[#0A0A0A] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60">Crescita</h3>
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5 text-[11px] text-white/55 uppercase tracking-wider">
                      <span className="w-3 h-px bg-white" /> Sessioni
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/55 uppercase tracking-wider">
                      <span className="w-3 h-px bg-white/40" /> Atleti
                    </div>
                  </div>
                </div>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrend}>
                      <defs>
                        <linearGradient id="gradW" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.08} />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="sessioni" stroke="#fff" strokeWidth={1.5} fill="url(#gradW)" dot={{ fill: '#fff', r: 2.5, strokeWidth: 0 }} />
                      <Area type="monotone" dataKey="atleti" stroke="rgba(255,255,255,0.4)" strokeWidth={1} fill="none" strokeDasharray="4 4" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#0A0A0A] p-6">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-4">Health Score</h3>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.06)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)' }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Score" dataKey="value" stroke="#fff" fill="#fff" fillOpacity={0.06} strokeWidth={1.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-2">
                  <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{healthScore}</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mt-1">Score complessivo</p>
                </div>
              </div>
            </div>

            {/* Sport Distribution + Session Types */}
            <div className="grid md:grid-cols-2 gap-px bg-white/[0.06]">
              <div className="bg-[#0A0A0A] p-6">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-5">Distribuzione sport</h3>
                <div className="space-y-4">
                  {sportCounts.map((s) => {
                    const pct = Math.round((s.count / athletes.length) * 100);
                    return (
                      <div key={s.sport}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] text-white/60">{s.label}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-white/50">{s.active}/{s.count} attivi</span>
                            <span className="text-[11px] text-white/70 tabular-nums w-8 text-right">{pct}%</span>
                          </div>
                        </div>
                        <div className="h-[2px] bg-white/[0.06] overflow-hidden">
                          <div className="h-full bg-white/40 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#0A0A0A] p-6">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-5">Tipologia sessioni</h3>
                <div className="space-y-4">
                  {(['training', 'assessment', 'call', 'review'] as const).map((type) => {
                    const t = APPOINTMENT_TYPES[type];
                    const count = storeAppointments.filter((a) => a.type === type).length;
                    const pct = Math.round((count / Math.max(storeAppointments.length, 1)) * 100);
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] text-white/60">{t.label}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-white/70 tabular-nums">{count}</span>
                            <span className="text-[11px] text-white/50 w-8 text-right">{pct}%</span>
                          </div>
                        </div>
                        <div className="h-[2px] bg-white/[0.06] overflow-hidden">
                          <div className="h-full bg-white/30 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Heatmap */}
            <div className="border border-white/[0.06]">
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60">Mappa sessioni</h3>
                <p className="text-[11px] text-white/50 mt-0.5">Distribuzione settimanale appuntamenti</p>
              </div>
              <div className="p-6">
                <div className="space-y-1">
                  <div className="flex gap-1 mb-1">
                    <div className="w-9" />
                    {hours.map((h) => (
                      <div key={h} className="flex-1 text-center text-[10px] text-white/50">{h}:00</div>
                    ))}
                  </div>
                  {weeklyHeatmap.map((row) => (
                    <div key={row.day} className="flex gap-1 items-center">
                      <span className="w-9 text-[11px] text-white/55 shrink-0">{row.day}</span>
                      {hours.map((h) => {
                        const val = (row as any)[`h${h}`] as number;
                        const opacity = val === 0 ? 0.03 : val === 1 ? 0.12 : val === 2 ? 0.25 : 0.5;
                        return (
                          <div
                            key={h}
                            className="flex-1 aspect-[2/1] transition-all"
                            style={{ backgroundColor: `rgba(255, 255, 255, ${opacity})` }}
                            title={`${row.day} ${h}:00 — ${val} sessioni`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 justify-end">
                  <span className="text-[10px] text-white/50">Meno</span>
                  {[0.03, 0.12, 0.25, 0.5].map((o, i) => (
                    <div key={i} className="w-3 h-3" style={{ backgroundColor: `rgba(255, 255, 255, ${o})` }} />
                  ))}
                  <span className="text-[10px] text-white/50">Più</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-2">Media sessioni/atleta</p>
                <p className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  {(totalSessions / Math.max(athletes.length, 1)).toFixed(1)}
                </p>
              </div>
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-2">In pausa</p>
                <p className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  {pausedAthletes.length}
                  <span className="text-xs text-white/50 ml-1 font-normal">atleti</span>
                </p>
              </div>
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-2">Misurazioni totali</p>
                <p className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{totalMeasurements}</p>
              </div>
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-2">Prossimo traguardo</p>
                <p className="text-[11px] text-white/60 leading-tight">
                  {goals.filter(g => g.status === 'in-progress').sort((a, b) => b.progress - a.progress)[0]?.title ?? '—'}
                </p>
                <p className="text-[11px] text-white/55 mt-1">
                  {goals.filter(g => g.status === 'in-progress').sort((a, b) => b.progress - a.progress)[0]?.progress ?? 0}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ══════ ATHLETES ══════ */}
        {activeSection === 'athletes' && (
          <div className="space-y-8 page-enter">

            {/* Performance Table */}
            <div className="border border-white/[0.06]">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60">Performance atleti</h3>
                <p className="text-[11px] text-white/50">Variazioni ultimo mese</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {['Atleta', 'Sport', 'Peso', 'Body Fat', 'KPI Sport', 'Trend'].map((h) => (
                        <th key={h} className="text-left px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-white/50 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {athleteDeltas.map((a) => (
                      <tr key={a.id} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group">
                        <td className="px-6 py-3.5">
                          <Link href={`/dashboard/athletes/${a.id}`} className="text-[13px] text-white/70 group-hover:text-white transition-colors">
                            {a.name} {a.surname}
                          </Link>
                        </td>
                        <td className="px-6">
                          <span className="text-[10px] uppercase tracking-[0.15em] text-white/60">{SPORTS[a.sport].label}</span>
                        </td>
                        <td className="px-6">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] tabular-nums text-white/50">{a.weightDelta > 0 ? '+' : ''}{a.weightDelta} kg</span>
                            {a.weightDelta < 0 ? <ArrowDownRight size={11} className="text-white/70" /> : a.weightDelta > 0 ? <ArrowUpRight size={11} className="text-white/60" /> : <Minus size={11} className="text-white/50" />}
                          </div>
                        </td>
                        <td className="px-6">
                          {a.bfDelta !== null ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[12px] tabular-nums text-white/50">{a.bfDelta > 0 ? '+' : ''}{a.bfDelta}%</span>
                              {a.bfDelta < 0 ? <ArrowDownRight size={11} className="text-white/70" /> : <ArrowUpRight size={11} className="text-white/60" />}
                            </div>
                          ) : (
                            <span className="text-[10px] text-white/50">—</span>
                          )}
                        </td>
                        <td className="px-6">
                          {a.kpiDelta !== null ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-white/50 uppercase tracking-wider">{a.kpiLabel}</span>
                              <span className="text-[12px] tabular-nums text-white/50">
                                {a.kpiDelta > 0 ? '+' : ''}{a.kpiDelta} {a.kpiUnit}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-white/50">—</span>
                          )}
                        </td>
                        <td className="px-6">
                          <div className="flex items-end gap-[2px] h-4">
                            {a.measurements.slice(-5).map((m, i) => {
                              const min = Math.min(...a.measurements.slice(-5).map(x => x.weight));
                              const max = Math.max(...a.measurements.slice(-5).map(x => x.weight));
                              const range = max - min || 1;
                              const barH = ((m.weight - min) / range) * 14 + 2;
                              return <div key={i} className="w-[3px] bg-white/20" style={{ height: `${barH}px` }} />;
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Athlete Goal Ranking */}
            <div className="border border-white/[0.06]">
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60">Ranking progresso obiettivi</h3>
              </div>
              <div>
                {goalData.map((g, i) => (
                  <Link key={g.id} href={`/dashboard/athletes/${g.id}`} className="flex items-center gap-6 px-6 py-3.5 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.015] transition-colors group">
                    <span className="text-[10px] tabular-nums text-white/50 font-bold w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-white/60 group-hover:text-white transition-colors">{g.fullName}</p>
                      <p className="text-[11px] text-white/50 mt-0.5">{SPORTS[g.sport].label} &middot; {g.goalCount} obiettivi</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-20">
                        <div className="h-[2px] bg-white/[0.06] overflow-hidden">
                          <div className="h-full bg-white/50 transition-all" style={{ width: `${g.progresso}%` }} />
                        </div>
                      </div>
                      <span className="text-[11px] text-white/70 tabular-nums w-8 text-right">{g.progresso}%</span>
                    </div>
                    <ChevronRight size={13} className="text-white/50 group-hover:text-white/60 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Per-sport athlete counts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
              {sportCounts.map((s) => (
                <Link key={s.sport} href={`/dashboard/athletes/sport/${s.sport}`} className="bg-[#0A0A0A] p-5 hover:bg-white/[0.02] transition-colors group">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">{s.label}</p>
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                    {s.count}
                  </p>
                  <p className="text-[11px] text-white/50 mt-1">{s.active} attivi</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ══════ GOALS ══════ */}
        {activeSection === 'goals' && (
          <div className="space-y-8 page-enter">

            {/* Goal KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
              {[
                { label: 'Obiettivi totali', value: `${goals.length}` },
                { label: 'In corso', value: `${goalsInProgress}` },
                { label: 'Raggiunti', value: `${goalsAchieved}` },
                { label: 'Progresso medio', value: `${avgProgress}%` },
              ].map((s) => (
                <div key={s.label} className="bg-[#0A0A0A] p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">{s.label}</p>
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* SMART Goals Detail */}
            <div className="border border-white/[0.06]">
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60">Obiettivi S.M.A.R.T.</h3>
                <p className="text-[11px] text-white/50 mt-0.5">{totalSmartGoals} obiettivi tracciati</p>
              </div>
              <div>
                {smartGoalProgress.map((sg) => (
                  <div key={sg.id} className="px-6 py-4 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.015] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-white/50">
                          {sg.metric === 'punchPower' ? <Zap size={13} /> : sg.metric === 'vo2max' ? <Heart size={13} /> : <Target size={13} />}
                        </div>
                        <div>
                          <p className="text-[12px] text-white/70">{sg.title}</p>
                          <p className="text-[11px] text-white/50 mt-0.5">{sg.athleteName} &middot; {sg.daysLeft > 0 ? `${sg.daysLeft}g rimanenti` : 'Scaduto'}</p>
                        </div>
                      </div>
                      <span className="text-lg text-white/80 tabular-nums" style={{ fontFamily: 'var(--font-heading)' }}>
                        {Math.round(sg.progress)}%
                      </span>
                    </div>
                    <div className="h-[2px] bg-white/[0.06] overflow-hidden">
                      <div className="h-full bg-white/50 transition-all" style={{ width: `${sg.progress}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-white/50 mt-1.5">
                      <span>{sg.startValue} {sg.unit}</span>
                      <span className="text-white/60">{sg.currentValue} {sg.unit}</span>
                      <span>{sg.targetValue} {sg.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Basic Goals */}
            <div className="border border-white/[0.06]">
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60">Obiettivi per atleta</h3>
              </div>
              <div>
                {goals.map((g) => {
                  const athlete = athletes.find(a => a.id === g.athleteId);
                  return (
                    <div key={g.id} className="flex items-center gap-6 px-6 py-3.5 border-b border-white/[0.03] last:border-b-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-white/60">{g.title}</p>
                        <p className="text-[11px] text-white/50 mt-0.5">{athlete ? `${athlete.name} ${athlete.surname}` : ''} &middot; Scadenza {g.deadline}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-16">
                          <div className="h-[2px] bg-white/[0.06] overflow-hidden">
                            <div className="h-full bg-white/50 transition-all" style={{ width: `${g.progress}%` }} />
                          </div>
                        </div>
                        <span className="text-[11px] text-white/70 tabular-nums w-8 text-right">{g.progress}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div className="border border-white/[0.06]">
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60">Traguardi sbloccati</h3>
                <p className="text-[11px] text-white/50 mt-0.5">{totalAchievements} totali</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px bg-white/[0.04]">
                {achievements.map((ach) => {
                  const athlete = athletes.find(a => a.id === ach.athleteId);
                  return (
                    <div key={ach.id} className="bg-[#0A0A0A] p-4">
                      <div className="text-white/50 mb-2"><Award size={13} /></div>
                      <p className="text-[11px] text-white/60">{ach.title}</p>
                      <p className="text-[11px] text-white/50 mt-0.5">{ach.description}</p>
                      <p className="text-[10px] text-white/50 mt-2">{athlete ? `${athlete.name} ${athlete.surname[0]}.` : ''} &middot; {ach.unlockedAt}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════ WELLBEING ══════ */}
        {activeSection === 'wellbeing' && (
          <div className="space-y-8 page-enter">

            {/* Wellbeing averages */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-white/[0.06]">
              {[
                { label: 'Umore', value: wellbeingAvg.mood, icon: <Brain size={14} /> },
                { label: 'Energia', value: wellbeingAvg.energy, icon: <Zap size={14} /> },
                { label: 'Motivazione', value: wellbeingAvg.motivation, icon: <Flame size={14} /> },
                { label: 'Sonno', value: wellbeingAvg.sleep, icon: <Activity size={14} /> },
                { label: 'Dolori', value: wellbeingAvg.soreness, icon: <Heart size={14} /> },
              ].map((s) => (
                <div key={s.label} className="bg-[#0A0A0A] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">{s.label}</p>
                    <div className="text-white/50">{s.icon}</div>
                  </div>
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                    {s.value}<span className="text-xs text-white/55 ml-1 font-normal">/10</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Wellbeing Trend Chart */}
            {wellbeingTrend.length > 1 && (
              <div className="border border-white/[0.06]">
                <div className="px-6 py-4 border-b border-white/[0.06]">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60">Andamento benessere</h3>
                  <p className="text-[11px] text-white/50 mt-0.5">Media settimanale di tutti gli atleti</p>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={wellbeingTrend}>
                      <defs>
                        <linearGradient id="gradMood" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.06} />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.15)' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.15)' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="Umore" stroke="#fff" fill="url(#gradMood)" strokeWidth={1.5} />
                      <Area type="monotone" dataKey="Energia" stroke="rgba(255,255,255,0.4)" fill="none" strokeWidth={1} strokeDasharray="4 4" />
                      <Area type="monotone" dataKey="Motivazione" stroke="rgba(255,255,255,0.25)" fill="none" strokeWidth={1} strokeDasharray="2 2" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-6 mt-3 text-[11px] text-white/55">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-px bg-white" /> Umore</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-px bg-white/40" /> Energia</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-px bg-white/25" /> Motivazione</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Check-ins */}
            <div className="border border-white/[0.06]">
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60">Ultimi check-in</h3>
                <p className="text-[11px] text-white/50 mt-0.5">{totalCheckIns} check-in totali</p>
              </div>
              <div>
                {weeklyCheckIns.slice(-10).reverse().map((ci) => {
                  const athlete = athletes.find(a => a.id === ci.athleteId);
                  return (
                    <div key={ci.id} className="flex items-center gap-6 px-6 py-3.5 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.015] transition-colors">
                      <div className="w-10 text-center shrink-0">
                        <p className="text-sm text-white/70" style={{ fontFamily: 'var(--font-heading)' }}>{new Date(ci.date).getDate()}</p>
                        <p className="text-[10px] text-white/50">{new Date(ci.date).toLocaleDateString('it-IT', { month: 'short' })}</p>
                      </div>
                      <div className="w-px h-6 bg-white/[0.06]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-white/60">{athlete ? `${athlete.name} ${athlete.surname}` : ''}</p>
                        {ci.wins && <p className="text-[11px] text-white/55 mt-0.5 truncate">{ci.wins}</p>}
                      </div>
                      <div className="hidden sm:flex items-center gap-4 shrink-0 text-[10px] text-white/60 tabular-nums">
                        <span>Umore {ci.mood}</span>
                        <span>Energia {ci.energy}</span>
                        <span>Motivazione {ci.motivation}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Per-athlete wellbeing summary */}
            <div className="border border-white/[0.06]">
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60">Benessere per atleta</h3>
              </div>
              <div>
                {athletes.filter(a => weeklyCheckIns.some(ci => ci.athleteId === a.id)).map((athlete) => {
                  const aCIs = weeklyCheckIns.filter(ci => ci.athleteId === athlete.id);
                  const latest = aCIs[aCIs.length - 1];
                  const avgMood = +(aCIs.reduce((s, c) => s + c.mood, 0) / aCIs.length).toFixed(1);
                  const avgEnergy = +(aCIs.reduce((s, c) => s + c.energy, 0) / aCIs.length).toFixed(1);
                  return (
                    <Link key={athlete.id} href={`/dashboard/athletes/${athlete.id}`} className="flex items-center gap-6 px-6 py-4 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.015] transition-colors group">
                      <div className="w-10 h-10 bg-white/[0.06] flex items-center justify-center text-[11px] text-white/70 shrink-0">
                        {athlete.name[0]}{athlete.surname[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-white/60 group-hover:text-white transition-colors">{athlete.name} {athlete.surname}</p>
                        <p className="text-[11px] text-white/50 mt-0.5">{aCIs.length} check-in &middot; Ultimo: {latest.date}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-6 shrink-0">
                        <div className="text-center">
                          <p className="text-sm text-white/50 tabular-nums" style={{ fontFamily: 'var(--font-heading)' }}>{avgMood}</p>
                          <p className="text-[10px] text-white/50 mt-0.5">Umore</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-white/50 tabular-nums" style={{ fontFamily: 'var(--font-heading)' }}>{avgEnergy}</p>
                          <p className="text-[10px] text-white/50 mt-0.5">Energia</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-white/50 tabular-nums" style={{ fontFamily: 'var(--font-heading)' }}>{latest.mood}</p>
                          <p className="text-[10px] text-white/50 mt-0.5">Ultimo</p>
                        </div>
                      </div>
                      <ChevronRight size={13} className="text-white/50 group-hover:text-white/60 transition-colors shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
