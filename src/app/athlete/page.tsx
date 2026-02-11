'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Calendar, FileText, Target, TrendingUp, ChevronRight, Flame, Award, Clock } from 'lucide-react';
import Link from 'next/link';
import { plans } from '@/lib/data';
import { subscriptions } from '@/lib/auth-data';
import type { AthleteDocument } from '@/lib/auth-data';
import { useStore } from '@/lib/store';
import { SPORTS, MOTIVATIONAL_QUOTES, Athlete, Appointment, SmartGoal, Achievement, WeeklyCheckIn } from '@/lib/types';

export default function AthleteHomePage() {
  const { data: session } = useSession();
  const athleteId = (session?.user as any)?.athleteId;
  const { athletes, appointments, smartGoals, achievements, weeklyCheckIns, athleteDocuments, fetchAll } = useStore();

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const athlete = athletes.find((a: Athlete) => a.id === athleteId);

  if (!athlete) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-white/70 text-sm">Caricamento...</p>
      </div>
    );
  }

  const sport = SPORTS[athlete.sport];
  const athleteGoals = smartGoals.filter((g: SmartGoal) => g.athleteId === athlete.id);
  const athleteAppointments = appointments.filter((a: Appointment) => a.athleteId === athlete.id && a.status === 'scheduled')
    .sort((a: Appointment, b: Appointment) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const nextAppointment = athleteAppointments[0];
  const athleteCheckIns = weeklyCheckIns.filter((c: WeeklyCheckIn) => c.athleteId === athlete.id).sort((a: WeeklyCheckIn, b: WeeklyCheckIn) => b.date.localeCompare(a.date));
  const lastCheckIn = athleteCheckIns[0];
  const athleteAchievements = achievements.filter((a: Achievement) => a.athleteId === athlete.id).sort((a: Achievement, b: Achievement) => (b.unlockedAt ?? '').localeCompare(a.unlockedAt ?? ''));
  const latestAchievement = athleteAchievements[0];
  const athletePlan = plans.find(p => athlete.assignedPlans.includes(p.id));
  const athleteDocs = athleteDocuments.filter((d: AthleteDocument) => d.athleteId === athlete.id && d.type === 'training-plan');
  const sub = subscriptions.find(s => s.athleteId === athlete.id);
  const lastM = athlete.measurements[athlete.measurements.length - 1];
  const prevM = athlete.measurements.length > 1 ? athlete.measurements[athlete.measurements.length - 2] : null;
  const daysSinceStart = Math.floor((new Date(2026, 1, 11).getTime() - new Date(athlete.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const sportQuotes = MOTIVATIONAL_QUOTES[athlete.sport];
  const sportQuote = sportQuotes[Math.floor(daysSinceStart / 7) % sportQuotes.length];

  // Streak calculation (simplified)
  const streak = athleteCheckIns.length;

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 -mt-5 sm:-mt-6 md:-mt-8">

      {/* Hero Header */}
      <div className="relative overflow-hidden h-[220px] sm:h-[280px] md:h-[380px]">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="https://cdn.shopify.com/videos/c/o/v/4e1c6acfb7834b46aea4d169fd262d61.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/10" />
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 lg:left-10 z-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/70 mb-2">{sport.label} · Giorno {daysSinceStart}</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', lineHeight: 1, letterSpacing: '2px' }} className="text-white mb-3 text-[36px] sm:text-[48px] md:text-[56px]">
            CIAO, {athlete.name.toUpperCase()}
          </h1>
          <p className="text-[12px] text-white/70 max-w-md italic">&ldquo;{sportQuote}&rdquo;</p>
        </div>
        {/* Streak badge */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 lg:right-10 z-10 flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] border border-white/[0.08]">
            <Flame size={14} className="text-white/80" />
            <span className="text-[11px] text-white/80">{streak} settimane</span>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-8 space-y-8">

        {/* Quick Actions Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
          <Link href="/athlete/scheda" className="bg-[#0A0A0A] p-5 hover:bg-white/[0.015] transition-colors group">
            <FileText size={16} className="text-white/70 mb-3" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-1">La tua scheda</p>
            <p className="text-[13px] text-white/60 group-hover:text-white/80 transition-colors">{athletePlan?.name || 'Nessuna'}</p>
          </Link>
          <Link href="/athlete/appuntamenti" className="bg-[#0A0A0A] p-5 hover:bg-white/[0.015] transition-colors group">
            <Calendar size={16} className="text-white/70 mb-3" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-1">Prossimo</p>
            {nextAppointment ? (
              <p className="text-[13px] text-white/60 group-hover:text-white/80 transition-colors">{nextAppointment.date.slice(5)} · {nextAppointment.time}</p>
            ) : (
              <p className="text-[13px] text-white/60">Nessuno</p>
            )}
          </Link>
          <Link href="/athlete/obiettivi" className="bg-[#0A0A0A] p-5 hover:bg-white/[0.015] transition-colors group">
            <Target size={16} className="text-white/70 mb-3" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-1">Obiettivi attivi</p>
            <p className="text-[13px] text-white/60 group-hover:text-white/80 transition-colors">{athleteGoals.filter((g: SmartGoal) => g.status === 'in-progress').length} in corso</p>
          </Link>
          <Link href="/athlete/progressi" className="bg-[#0A0A0A] p-5 hover:bg-white/[0.015] transition-colors group">
            <TrendingUp size={16} className="text-white/70 mb-3" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-1">Peso attuale</p>
            <p className="text-[13px] text-white/60 group-hover:text-white/80 transition-colors">
              {lastM.weight} kg
              {prevM && <span className="text-[10px] ml-1 text-white/70">({lastM.weight - prevM.weight > 0 ? '+' : ''}{(lastM.weight - prevM.weight).toFixed(1)})</span>}
            </p>
          </Link>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: Next appointment + objectives progress */}
          <div className="space-y-6">

            {/* Next appointment */}
            {nextAppointment && (
              <div className="border border-white/[0.06]">
                <div className="px-5 py-3 border-b border-white/[0.06]">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Prossimo appuntamento</p>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/[0.04] flex flex-col items-center justify-center shrink-0">
                      <p className="text-[11px] uppercase text-white/70">{new Date(nextAppointment.date).toLocaleDateString('it-IT', { weekday: 'short' })}</p>
                      <p className="text-[18px] text-white/60" style={{ fontFamily: 'var(--font-heading)' }}>{nextAppointment.date.slice(8)}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] text-white/60 mb-1">{nextAppointment.notes}</p>
                      <div className="flex items-center gap-3 text-[10px] text-white/70">
                        <span className="flex items-center gap-1"><Clock size={9} /> {nextAppointment.time}</span>
                        <span>{nextAppointment.duration} min</span>
                        <span className="px-2 py-0.5 bg-white/[0.04] text-[10px] uppercase tracking-[0.15em]">
                          {nextAppointment.type === 'training' ? 'Allenamento' : nextAppointment.type === 'assessment' ? 'Valutazione' : nextAppointment.type === 'call' ? 'Chiamata' : 'Review'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Goals progress */}
            <div className="border border-white/[0.06]">
              <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Obiettivi</p>
                <Link href="/athlete/obiettivi" className="text-[11px] uppercase tracking-[0.15em] text-white/70 hover:text-white/70 transition-colors flex items-center gap-1">
                  Vedi tutti <ChevronRight size={10} />
                </Link>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {athleteGoals.slice(0, 3).map(goal => {
                  const progress = Math.round(((goal.currentValue - goal.startValue) / (goal.targetValue - goal.startValue)) * 100);
                  return (
                    <div key={goal.id} className="px-5 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[12px] text-white/70">{goal.title}</p>
                        <p className="text-[11px] text-white/60">{goal.currentValue}{goal.unit} / {goal.targetValue}{goal.unit}</p>
                      </div>
                      <div className="w-full h-1 bg-white/[0.04]">
                        <div className="h-full bg-white/30" style={{ width: `${Math.min(progress, 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Latest achievement + last check-in + subscription */}
          <div className="space-y-6">

            {/* Latest achievement */}
            {latestAchievement && (
              <div className="border border-white/[0.06]">
                <div className="px-5 py-3 border-b border-white/[0.06]">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Ultimo achievement</p>
                </div>
                <div className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/[0.06] flex items-center justify-center shrink-0">
                    <Award size={18} className="text-white/70" />
                  </div>
                  <div>
                    <p className="text-[13px] text-white/60 font-medium">{latestAchievement.title}</p>
                    <p className="text-[10px] text-white/70 mt-0.5">{latestAchievement.description} · {latestAchievement.unlockedAt}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Last check-in */}
            {lastCheckIn && (
              <div className="border border-white/[0.06]">
                <div className="px-5 py-3 border-b border-white/[0.06]">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Ultimo check-in · {lastCheckIn.date}</p>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-px bg-white/[0.04]">
                    {[
                      { label: 'Umore', value: lastCheckIn.mood },
                      { label: 'Energia', value: lastCheckIn.energy },
                      { label: 'Motivazione', value: lastCheckIn.motivation },
                      { label: 'Sonno', value: lastCheckIn.sleepQuality },
                      { label: 'Dolore', value: lastCheckIn.soreness },
                    ].map(item => (
                      <div key={item.label} className="bg-[#0A0A0A] p-3 text-center">
                        <p className="text-[18px] text-white/70 mb-0.5" style={{ fontFamily: 'var(--font-heading)' }}>{item.value}</p>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-white/70">{item.label}</p>
                      </div>
                    ))}
                  </div>
                  {lastCheckIn.wins && (
                    <p className="text-[11px] text-white/60 mt-3 italic">&ldquo;{lastCheckIn.wins}&rdquo;</p>
                  )}
                </div>
              </div>
            )}

            {/* Subscription status */}
            {sub && (
              <div className="border border-white/[0.06]">
                <div className="px-5 py-3 border-b border-white/[0.06]">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Abbonamento</p>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[13px] text-white/70">{sub.planName}</p>
                    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] ${
                      sub.status === 'active' ? 'bg-white/[0.06] text-white/70' : 'bg-red-400/10 text-red-400/40'
                    }`}>{sub.status === 'active' ? 'Attivo' : sub.status === 'paused' ? 'In pausa' : sub.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-white/70">
                    <span>€{sub.amount}/mese</span>
                    <span>Prossimo: {sub.nextPayment}</span>
                    {sub.autoRenew && <span className="text-white/70">Rinnovo auto</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming appointments list */}
        {athleteAppointments.length > 1 && (
          <div className="border border-white/[0.06]">
            <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Prossimi appuntamenti</p>
              <Link href="/athlete/appuntamenti" className="text-[11px] uppercase tracking-[0.15em] text-white/70 hover:text-white/70 transition-colors flex items-center gap-1">
                Vedi tutti <ChevronRight size={10} />
              </Link>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {athleteAppointments.slice(0, 4).map(apt => (
                <div key={apt.id} className="px-5 py-3 flex items-center gap-4">
                  <div className="w-8 h-8 bg-white/[0.03] flex items-center justify-center shrink-0">
                    <p className="text-[10px] text-white/70">{apt.date.slice(8)}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-white/70 truncate">{apt.notes}</p>
                  </div>
                  <p className="text-[10px] text-white/70 shrink-0">{apt.time} · {apt.duration}min</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
