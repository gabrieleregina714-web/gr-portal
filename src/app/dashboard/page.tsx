'use client';

import Link from 'next/link';
import {
  Users,
  CalendarDays,
  TrendingUp,
  Target,
  ArrowRight,
  ArrowUpRight,
  Clock,
  ChevronRight,
  Video,
  MessageCircle,
  Flame,
  Check,
  Plus,
} from 'lucide-react';
import { goals } from '@/lib/data';
import { SPORTS, APPOINTMENT_TYPES, Sport } from '@/lib/types';
import { useStore } from '@/lib/store';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { athletes, appointments: storeAppointments, smartGoals, weeklyCheckIns, achievements, updateAppointment, fetchAll } = useStore();
  useEffect(() => { fetchAll(); }, []);
  const activeAthletes = athletes.filter((a) => a.status === 'active');
  const todayAppointments = storeAppointments
    .filter((a) => a.date === '2026-02-10')
    .sort((a, b) => a.time.localeCompare(b.time));
  const avgProgress = Math.round(
    goals.reduce((s, g) => s + g.progress, 0) / goals.length
  );
  const topGoal = [...goals].sort((a, b) => b.progress - a.progress)[0];

  // Next upcoming appointment
  const nextApt = storeAppointments
    .filter((a) => a.date >= '2026-02-10')
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))[0];

  // Smart greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'BUONGIORNO' : hour < 18 ? 'BUON POMERIGGIO' : 'BUONASERA';

  // Weekly training streak
  const today = new Date(2026, 1, 10);
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const hasSession = storeAppointments.some(a => a.date === dateStr);
    if (hasSession) streak++;
    else if (i > 0) break;
  }

  // This week vs last week
  const getWeekStart = (date: Date, weeksAgo: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay() + 1 - weeksAgo * 7);
    return d;
  };
  const thisWeekStart = getWeekStart(today, 0);
  const lastWeekStart = getWeekStart(today, 1);
  const thisWeekEnd = new Date(thisWeekStart);
  thisWeekEnd.setDate(thisWeekEnd.getDate() + 6);
  const lastWeekEnd = new Date(lastWeekStart);
  lastWeekEnd.setDate(lastWeekEnd.getDate() + 6);
  const countInRange = (start: Date, end: Date) =>
    storeAppointments.filter(a => {
      const d = new Date(a.date);
      return d >= start && d <= end;
    }).length;
  const thisWeekCount = countInRange(thisWeekStart, thisWeekEnd);
  const lastWeekCount = countInRange(lastWeekStart, lastWeekEnd);
  const weekDelta = thisWeekCount - lastWeekCount;

  // Month hours
  const monthHours = Math.round(
    storeAppointments
      .filter(a => a.date.startsWith('2026-02'))
      .reduce((sum, a) => sum + a.duration, 0) / 60
  );

  // Latest check-in
  const latestCheckIn = weeklyCheckIns.length > 0 ? weeklyCheckIns[weeklyCheckIns.length - 1] : null;
  const latestCheckInAthlete = latestCheckIn ? athletes.find(a => a.id === latestCheckIn.athleteId) : null;

  // Achievements count
  const totalAchievements = achievements.length;

  // Days since first athlete
  const earliestStart = athletes.reduce((min, a) => a.startDate < min ? a.startDate : min, athletes[0]?.startDate || '');
  const daysSinceStart = Math.floor((today.getTime() - new Date(earliestStart).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 -mt-5 sm:-mt-6 md:-mt-8">

      {/* HEADER */}
      <div className="relative overflow-hidden" style={{ height: '380px' }}>
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="https://cdn.shopify.com/videos/c/o/v/4e1c6acfb7834b46aea4d169fd262d61.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/10" />

        <div className="absolute bottom-10 left-6 lg:left-10 z-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/60 mb-3">
            {format(new Date(2026, 1, 10), 'EEEE d MMMM yyyy', { locale: it }).toUpperCase()}
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading)', lineHeight: 0.95, letterSpacing: '3px' }} className="text-white text-[36px] sm:text-[48px] md:text-[56px]">
            <span className="text-white/60">{greeting},</span><br className="sm:hidden" /> COACH
          </h1>
          <div className="flex items-center gap-3 sm:gap-5 mt-4 flex-wrap">
            <span className="text-[12px] uppercase tracking-[0.15em] text-white/70">{todayAppointments.length} sessioni oggi</span>
            <span className="w-px h-3 bg-white/10 hidden sm:block" />
            <span className="text-[12px] uppercase tracking-[0.15em] text-white/70">{activeAthletes.length} atleti attivi</span>
            <span className="w-px h-3 bg-white/10 hidden sm:block" />
            <span className="text-[12px] uppercase tracking-[0.15em] text-white/70">Day {daysSinceStart}</span>
          </div>
        </div>

        <div className="absolute top-6 right-6 lg:right-10 z-10 flex items-center gap-2">
          <Link href="/dashboard/calendar" className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-all">
            <CalendarDays size={15} />
          </Link>
          <Link href="/dashboard/athletes/new" className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-all">
            <Plus size={15} />
          </Link>
          <Link href="/dashboard/analytics" className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-all">
            <TrendingUp size={15} />
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8">

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-px bg-white/[0.06] mb-8">
          {[
            { label: 'Atleti attivi', value: `${activeAthletes.length}`, unit: `/${athletes.length}` },
            { label: 'Oggi', value: `${todayAppointments.length}`, unit: 'sessioni' },
            { label: 'Streak', value: `${streak}`, unit: 'gg' },
            { label: 'Settimana', value: `${thisWeekCount}`, unit: weekDelta !== 0 ? `${weekDelta > 0 ? '+' : ''}${weekDelta}` : '' },
            { label: 'Febbraio', value: `${monthHours}`, unit: 'h' },
            { label: 'Progresso', value: `${avgProgress}`, unit: '%' },
          ].map((s) => (
            <div key={s.label} className="bg-[#0A0A0A] p-3 sm:p-5">
              <p className="text-[11px] uppercase tracking-[0.15em] text-white/70 mb-2">{s.label}</p>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                {s.value}
                {s.unit && <span className="text-xs text-white/55 ml-1 font-normal">{s.unit}</span>}
              </p>
            </div>
          ))}
        </div>

        {/* Main Grid: Timeline + Right Column */}
        <div className="grid md:grid-cols-3 gap-px bg-white/[0.06] mb-8">

          {/* Today's Timeline */}
          <div className="md:col-span-2 bg-[#0A0A0A] p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60">Oggi &mdash; 10 Febbraio</h3>
              <Link href="/dashboard/calendar" className="text-[11px] uppercase tracking-[0.15em] text-white/50 hover:text-white/70 transition-colors flex items-center gap-1">
                Calendario <ArrowRight size={9} />
              </Link>
            </div>

            {todayAppointments.length > 0 ? (
              <div className="space-y-0">
                {todayAppointments.map((apt, idx) => {
                  const type = APPOINTMENT_TYPES[apt.type];
                  const sport = apt.sport ? SPORTS[apt.sport] : null;
                  const athlete = athletes.find((a) => a.id === apt.athleteId);
                  const isLast = idx === todayAppointments.length - 1;
                  const isCompleted = apt.status === 'completed';
                  return (
                    <div key={apt.id} className={`flex gap-4 group/item ${isCompleted ? 'opacity-40' : ''}`}>
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center pt-1.5">
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateAppointment(apt.id, { status: isCompleted ? 'scheduled' : 'completed' }); }}
                          className={`w-2 h-2 border transition-all hover:scale-125 ${isCompleted ? 'bg-white/50 border-white/50' : 'border-white/20 bg-transparent group-hover/item:border-white/40'}`}
                          title={isCompleted ? 'Segna come non completato' : 'Segna come completato'}
                        />
                        {!isLast && <div className="w-px flex-1 bg-white/[0.06] my-1" />}
                      </div>
                      {/* Card */}
                      <Link href={`/dashboard/athletes/${apt.athleteId}`} className={`flex-1 ${isLast ? 'pb-0' : 'pb-5'}`}>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[11px] tabular-nums text-white/50">{apt.time}</span>
                          <span className="text-[11px] uppercase tracking-[0.15em] text-white/55">{type.label}</span>
                        </div>
                        <p className={`text-[13px] text-white/80 group-hover/item:text-white transition-colors ${isCompleted ? 'line-through' : ''}`}>
                          {apt.athleteName}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-white/50 mt-0.5">
                          <span className="flex items-center gap-1"><Clock size={9} /> {apt.duration} min</span>
                          {sport && <span>{sport.label}</span>}
                        </div>
                        {apt.notes && <p className="text-[10px] text-white/50 mt-1.5 leading-relaxed">{apt.notes}</p>}
                        {/* Action buttons on hover */}
                        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <span className="px-2 py-0.5 bg-white/[0.04] text-white/55 text-[10px] uppercase tracking-wider flex items-center gap-1 hover:text-white/70 transition-colors">
                            <Video size={8} /> Zoom
                          </span>
                          {athlete?.phone && (
                            <span className="px-2 py-0.5 bg-white/[0.04] text-white/55 text-[10px] uppercase tracking-wider flex items-center gap-1 hover:text-white/70 transition-colors">
                              <MessageCircle size={8} /> WA
                            </span>
                          )}
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[11px] text-white/50 py-8 text-center">Nessuna sessione oggi</p>
            )}
          </div>

          {/* Right Column */}
          <div className="bg-[#0A0A0A] p-6 space-y-6">

            {/* Next Session */}
            {nextApt && (() => {
              const type = APPOINTMENT_TYPES[nextApt.type];
              const sport = nextApt.sport ? SPORTS[nextApt.sport] : null;
              const isToday = nextApt.date === '2026-02-10';
              return (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 bg-white/50 animate-pulse" />
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">
                      {isToday ? 'Prossima sessione' : 'Prossimo appuntamento'}
                    </p>
                  </div>
                  <p className="text-lg text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                    {nextApt.athleteName.toUpperCase()}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-white/60 mt-1">
                    <span className="text-white/50">{nextApt.time}</span>
                    <span>{nextApt.duration} min</span>
                    {sport && <span>{sport.label}</span>}
                  </div>
                  {nextApt.notes && <p className="text-[10px] text-white/50 mt-2 leading-relaxed">{nextApt.notes}</p>}
                  <div className="flex items-center gap-px mt-3">
                    <a href="https://zoom.us/j/new" target="_blank" rel="noopener noreferrer"
                      className="flex-1 py-2 bg-white/[0.04] text-white/60 text-[11px] uppercase tracking-[0.15em] text-center hover:bg-white/[0.08] hover:text-white/50 transition-all flex items-center justify-center gap-1.5">
                      <Video size={10} /> Zoom
                    </a>
                    <Link href={`/dashboard/athletes/${nextApt.athleteId}`}
                      className="flex-1 py-2 bg-white/[0.04] text-white/60 text-[11px] uppercase tracking-[0.15em] text-center hover:bg-white/[0.08] hover:text-white/50 transition-all flex items-center justify-center gap-1.5">
                      Profilo <ArrowRight size={9} />
                    </Link>
                  </div>
                </div>
              );
            })()}

            {/* Divider */}
            <div className="h-px bg-white/[0.06]" />

            {/* Goals */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60">Obiettivi</h3>
                <Link href="/dashboard/analytics" className="text-[11px] uppercase tracking-[0.15em] text-white/50 hover:text-white/70 transition-colors">
                  Tutti &rarr;
                </Link>
              </div>
              <div className="space-y-3">
                {goals.sort((a, b) => b.progress - a.progress).slice(0, 4).map((goal) => {
                  const athlete = athletes.find((a) => a.id === goal.athleteId);
                  return (
                    <div key={goal.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[11px] text-white/60">{goal.title}</p>
                        <span className="text-[11px] text-white/70 tabular-nums">{goal.progress}%</span>
                      </div>
                      <div className="h-[2px] bg-white/[0.06] overflow-hidden">
                        <div className="h-full bg-white/50 transition-all" style={{ width: `${goal.progress}%` }} />
                      </div>
                      <p className="text-[11px] text-white/50 mt-1">{athlete?.name} {athlete?.surname[0]}.</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.06]" />

            {/* Latest Check-in */}
            {latestCheckIn && latestCheckInAthlete && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/55 mb-2">Ultimo check-in</p>
                <p className="text-[11px] text-white/50">{latestCheckInAthlete.name} {latestCheckInAthlete.surname}</p>
                <div className="flex items-center gap-4 mt-1.5 text-[10px] text-white/60">
                  <span>Umore {latestCheckIn.mood}/10</span>
                  <span>Energia {latestCheckIn.energy}/10</span>
                </div>
                {latestCheckIn.wins && <p className="text-[11px] text-white/50 mt-1.5 italic">{latestCheckIn.wins}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Sport Cards + Roster */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] mb-8">
          {(Object.keys(SPORTS) as Sport[]).map((s) => {
            const sport = SPORTS[s];
            const count = athletes.filter((a) => a.sport === s).length;
            const active = athletes.filter((a) => a.sport === s && a.status === 'active').length;
            const sportGoals = goals.filter(g => {
              const ath = athletes.find(a => a.id === g.athleteId);
              return ath?.sport === s;
            });
            const avgGoal = sportGoals.length ? Math.round(sportGoals.reduce((sum, g) => sum + g.progress, 0) / sportGoals.length) : 0;
            return (
              <Link key={s} href={`/dashboard/athletes/sport/${s}`} className="bg-[#0A0A0A] p-4 sm:p-5 hover:bg-white/[0.02] transition-colors group">
                <p className="text-[11px] uppercase tracking-[0.15em] text-white/70 mb-2">{sport.label}</p>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{count}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] text-white/60">{active} attivi</span>
                  <span className="text-[10px] text-white/60">Avg {avgGoal}%</span>
                </div>
                <ChevronRight size={11} className="text-white/50 sm:text-white/0 sm:group-hover:text-white/55 transition-colors mt-2" />
              </Link>
            );
          })}
        </div>

        {/* Roster */}
        <div className="border border-white/[0.06]">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.06]">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60">Roster</h3>
            <Link href="/dashboard/athletes" className="text-[11px] uppercase tracking-[0.15em] text-white/50 hover:text-white/70 transition-colors flex items-center gap-1">
              Tutti <ArrowRight size={9} />
            </Link>
          </div>
          <div>
            {activeAthletes.map((athlete) => {
              const sport = SPORTS[athlete.sport];
              const lastM = athlete.measurements[athlete.measurements.length - 1];
              const prevM = athlete.measurements.length >= 2 ? athlete.measurements[athlete.measurements.length - 2] : null;
              const weightDelta = prevM ? +(lastM.weight - prevM.weight).toFixed(1) : null;
              const athleteGoals = goals.filter((g) => g.athleteId === athlete.id);
              const avgGoal = athleteGoals.length > 0 ? Math.round(athleteGoals.reduce((s, g) => s + g.progress, 0) / athleteGoals.length) : 0;
              const daysSince = Math.floor((today.getTime() - new Date(athlete.startDate).getTime()) / (1000 * 60 * 60 * 24));

              return (
                <Link
                  key={athlete.id}
                  href={`/dashboard/athletes/${athlete.id}`}
                  className="flex items-center gap-3 sm:gap-6 px-4 sm:px-6 py-4 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.015] transition-colors group"
                >
                  <div className="w-10 h-10 bg-white/[0.06] flex items-center justify-center text-[11px] text-white/70 shrink-0">
                    {athlete.name[0]}{athlete.surname[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-white/80 group-hover:text-white transition-colors truncate">
                      {athlete.name} {athlete.surname}
                    </p>
                    <p className="text-[11px] text-white/60 mt-0.5 truncate">
                      {sport.label} &middot; {athlete.goal}
                    </p>
                  </div>

                  {/* Weight */}
                  <div className="hidden sm:block text-right shrink-0 w-16">
                    <p className="text-[11px] text-white/70 tabular-nums">
                      {lastM?.weight} <span className="text-white/50">kg</span>
                    </p>
                    {weightDelta !== null && (
                      <p className="text-[11px] text-white/55">{weightDelta > 0 ? '+' : ''}{weightDelta}</p>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="hidden md:flex items-center gap-3 shrink-0">
                    <div className="w-16">
                      <div className="h-[2px] bg-white/[0.06] overflow-hidden">
                        <div className="h-full bg-white/50 transition-all" style={{ width: `${avgGoal}%` }} />
                      </div>
                    </div>
                    <span className="text-[10px] text-white/60 tabular-nums w-8 text-right">{avgGoal}%</span>
                  </div>

                  {/* Day count */}
                  <div className="hidden lg:block text-right shrink-0">
                    <p className="text-[11px] text-white/50">Day {daysSince}</p>
                  </div>

                  {/* Sparkline */}
                  <div className="hidden lg:flex items-end gap-[2px] h-3.5 shrink-0">
                    {athlete.measurements.slice(-5).map((m, i) => {
                      const weights = athlete.measurements.slice(-5).map(x => x.weight);
                      const min = Math.min(...weights);
                      const max = Math.max(...weights);
                      const range = max - min || 1;
                      const h = ((m.weight - min) / range) * 12 + 2;
                      return <div key={i} className="w-[3px] bg-white/15" style={{ height: `${h}px` }} />;
                    })}
                  </div>

                  <span className={`w-1.5 h-1.5 shrink-0 ${athlete.status === 'active' ? 'bg-white/50' : 'bg-white/15'}`} />
                  <ChevronRight size={13} className="text-white/50 group-hover:text-white/60 transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
