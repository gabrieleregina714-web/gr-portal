'use client';

import { useSession } from 'next-auth/react';
import { Target, Award, CheckCircle2, Flame, Activity, Trophy, Brain, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { SPORTS, Athlete, SmartGoal, Achievement, WeeklyCheckIn } from '@/lib/types';

type Tab = 'obiettivi' | 'achievements' | 'checkin';

const ACHIEVEMENT_ICONS: Record<string, React.ReactNode> = {
  streak: <Flame size={15} />,
  consistency: <Activity size={15} />,
  pr: <Trophy size={15} />,
  milestone: <Target size={15} />,
  mindset: <Brain size={15} />,
};

export default function AthleteObiettiviPage() {
  const { data: session } = useSession();
  const athleteId = (session?.user as any)?.athleteId;
  const { athletes, smartGoals, achievements, weeklyCheckIns, fetchAthletes, fetchSmartGoals, fetchAchievements, fetchWeeklyCheckIns } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('obiettivi');

  useEffect(() => { fetchAthletes(); fetchSmartGoals(); fetchAchievements(); fetchWeeklyCheckIns(); }, [fetchAthletes, fetchSmartGoals, fetchAchievements, fetchWeeklyCheckIns]);

  const athlete = athletes.find((a: Athlete) => a.id === athleteId);

  if (!athlete) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-white/20 text-sm">Caricamento...</p></div>;
  }

  const sport = SPORTS[athlete.sport];
  const myGoals = smartGoals.filter((g: SmartGoal) => g.athleteId === athlete.id);
  const myAchievements = achievements.filter((a: Achievement) => a.athleteId === athlete.id).sort((a: Achievement, b: Achievement) => (b.unlockedAt ?? '').localeCompare(a.unlockedAt ?? ''));
  const myCheckIns = weeklyCheckIns.filter((c: WeeklyCheckIn) => c.athleteId === athlete.id).sort((a: WeeklyCheckIn, b: WeeklyCheckIn) => b.date.localeCompare(a.date));

  const tabs: { key: Tab; label: string }[] = [
    { key: 'obiettivi', label: 'Obiettivi' },
    { key: 'achievements', label: `Achievements (${myAchievements.length})` },
    { key: 'checkin', label: 'Check-in' },
  ];

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 -mt-5 sm:-mt-6 md:-mt-8">

      {/* Header */}
      <div className="relative overflow-hidden" style={{ height: '180px' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#0A0A0A]" />
        <div className="absolute bottom-6 left-6 lg:left-10 z-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-2">{sport.label}</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', lineHeight: 1, letterSpacing: '2px' }} className="text-white text-[28px] sm:text-[36px]">
            OBIETTIVI
          </h1>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-8 space-y-8">

        {/* Tabs */}
        <div className="flex gap-px">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2.5 text-[9px] uppercase tracking-[0.15em] transition-colors ${
                activeTab === t.key ? 'bg-white text-black' : 'bg-white/[0.03] text-white/25 hover:text-white/50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* OBIETTIVI TAB */}
        {activeTab === 'obiettivi' && (
          <div className="space-y-6 page-enter">
            {myGoals.map(goal => {
              const progress = Math.round(((goal.currentValue - goal.startValue) / (goal.targetValue - goal.startValue)) * 100);
              const achieved = goal.milestones.filter(m => m.achieved).length;
              const total = goal.milestones.length;
              return (
                <div key={goal.id} className="border border-white/[0.06]">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-[16px] text-white/70 mb-1" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>{goal.title}</h3>
                        <p className="text-[11px] text-white/25">{goal.specific}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-[28px] text-white/60" style={{ fontFamily: 'var(--font-heading)' }}>{progress}%</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-white/[0.04] mb-4 relative">
                      <div className="h-full bg-white/30 transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                      {goal.milestones.map((ms, i) => {
                        const pos = ((ms.value - goal.startValue) / (goal.targetValue - goal.startValue)) * 100;
                        return (
                          <div key={ms.id} className="absolute top-0 h-full w-px bg-white/10" style={{ left: `${pos}%` }}>
                            <div className={`absolute -top-4 -translate-x-1/2 w-2 h-2 ${ms.achieved ? 'bg-white/40' : 'bg-white/10'}`} />
                          </div>
                        );
                      })}
                    </div>

                    {/* Values */}
                    <div className="flex items-center justify-between text-[10px] text-white/20 mb-5">
                      <span>Inizio: {goal.startValue}{goal.unit}</span>
                      <span className="text-white/40">Attuale: {goal.currentValue}{goal.unit}</span>
                      <span>Target: {goal.targetValue}{goal.unit}</span>
                    </div>

                    {/* Milestones */}
                    <div className="flex gap-px">
                      {goal.milestones.map(ms => (
                        <div key={ms.id} className={`flex-1 p-3 ${ms.achieved ? 'bg-white/[0.06]' : 'bg-white/[0.02]'}`}>
                          <div className="flex items-center gap-1.5 mb-1">
                            {ms.achieved ? <CheckCircle2 size={10} className="text-white/40" /> : <div className="w-2.5 h-2.5 border border-white/10" />}
                            <p className="text-[10px] text-white/30">{ms.label}</p>
                          </div>
                          {ms.achievedDate && (
                            <p className="text-[8px] text-white/10 ml-4">{ms.achievedDate}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-3 border-t border-white/[0.04] flex items-center justify-between text-[9px] text-white/15">
                    <span>Scadenza: {goal.deadline}</span>
                    <span>{achieved}/{total} milestone raggiunti</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === 'achievements' && (
          <div className="page-enter">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-white/[0.06]">
              {myAchievements.map(ach => (
                <div key={ach.id} className="bg-[#0A0A0A] p-5 flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/[0.06] flex items-center justify-center shrink-0 text-white/30">
                    {ACHIEVEMENT_ICONS[ach.category] || <Award size={15} />}
                  </div>
                  <div>
                    <p className="text-[13px] text-white/60 font-medium mb-0.5">{ach.title}</p>
                    <p className="text-[10px] text-white/20 mb-1">{ach.description}</p>
                    <p className="text-[9px] text-white/10">{ach.unlockedAt}</p>
                  </div>
                </div>
              ))}
            </div>
            {myAchievements.length === 0 && (
              <div className="border border-white/[0.06] py-12 text-center">
                <Award size={24} className="text-white/10 mx-auto mb-2" />
                <p className="text-[12px] text-white/15">Nessun achievement ancora</p>
              </div>
            )}
          </div>
        )}

        {/* CHECK-IN TAB */}
        {activeTab === 'checkin' && (
          <div className="space-y-4 page-enter">
            {myCheckIns.map(ci => (
              <div key={ci.id} className="border border-white/[0.06]">
                <div className="px-5 py-3 border-b border-white/[0.04] flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">Settimana del {ci.date}</p>
                  {ci.wins && <p className="text-[10px] text-white/15 italic max-w-[50%] truncate">{ci.wins}</p>}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-px bg-white/[0.04]">
                  {[
                    { label: 'Umore', value: ci.mood },
                    { label: 'Energia', value: ci.energy },
                    { label: 'Motivazione', value: ci.motivation },
                    { label: 'Sonno', value: ci.sleepQuality },
                    { label: 'Dolore', value: ci.soreness },
                  ].map(item => (
                    <div key={item.label} className="bg-[#0A0A0A] p-3 text-center">
                      <p className="text-[18px] text-white/40 mb-0.5" style={{ fontFamily: 'var(--font-heading)' }}>{item.value}</p>
                      <p className="text-[7px] uppercase tracking-[0.15em] text-white/12">{item.label}</p>
                    </div>
                  ))}
                </div>
                {ci.notes && (
                  <div className="px-5 py-2.5 border-t border-white/[0.03]">
                    <p className="text-[10px] text-white/15">{ci.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
