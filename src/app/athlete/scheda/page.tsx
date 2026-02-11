'use client';

import { useSession } from 'next-auth/react';
import { FileText, Download, Clock, Dumbbell, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { plans } from '@/lib/data';
import { useStore } from '@/lib/store';
import { SPORTS, Athlete } from '@/lib/types';
import type { AthleteDocument } from '@/lib/auth-data';

export default function AthleteSchedaPage() {
  const { data: session } = useSession();
  const athleteId = (session?.user as any)?.athleteId;
  const { athletes, athleteDocuments, fetchAthletes, fetchAthleteDocuments } = useStore();
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  useEffect(() => { fetchAthletes(); fetchAthleteDocuments(); }, [fetchAthletes, fetchAthleteDocuments]);

  const athlete = athletes.find((a: Athlete) => a.id === athleteId);

  if (!athlete) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-white/20 text-sm">Caricamento...</p></div>;
  }

  const currentPlan = plans.find(p => athlete.assignedPlans.includes(p.id));
  const schemaDocs = athleteDocuments.filter((d: AthleteDocument) => d.athleteId === athlete.id && d.type === 'training-plan');
  const sport = SPORTS[athlete.sport];

  const difficultyLabels: Record<string, string> = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzato',
    elite: 'Elite',
  };

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 -mt-5 sm:-mt-6 md:-mt-8">

      {/* Header */}
      <div className="relative overflow-hidden" style={{ height: '180px' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#0A0A0A]" />
        <div className="absolute bottom-6 left-6 lg:left-10 z-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-2">{sport.label}</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', lineHeight: 1, letterSpacing: '2px' }} className="text-white text-[28px] sm:text-[36px]">
            LA TUA SCHEDA
          </h1>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-8 space-y-8">

        {currentPlan ? (
          <>
            {/* Plan Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-2">Programma</p>
                <p className="text-[16px] text-white/70" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>{currentPlan.name}</p>
              </div>
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-2">Categoria</p>
                <p className="text-[14px] text-white/50">{currentPlan.category}</p>
              </div>
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-2">Durata</p>
                <p className="text-[14px] text-white/50">{currentPlan.duration}</p>
              </div>
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-2">Difficoltà</p>
                <p className="text-[14px] text-white/50">{difficultyLabels[currentPlan.difficulty]}</p>
              </div>
            </div>

            {/* Description */}
            <div className="border border-white/[0.06] p-5">
              <p className="text-[12px] text-white/35 leading-relaxed">{currentPlan.description}</p>
            </div>

            {/* Sessions */}
            <div className="space-y-px">
              {currentPlan.sessions.map((s, i) => {
                const isExpanded = expandedSession === `${i}`;
                return (
                  <div key={i} className="border border-white/[0.06]">
                    <button
                      onClick={() => setExpandedSession(isExpanded ? null : `${i}`)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/[0.015] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-white/[0.04] flex items-center justify-center shrink-0">
                          <Dumbbell size={14} className="text-white/20" />
                        </div>
                        <div className="text-left">
                          <p className="text-[13px] text-white/60">{s.name}</p>
                          <p className="text-[10px] text-white/20">{s.day} · {s.exercises.length} esercizi</p>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp size={14} className="text-white/15" /> : <ChevronDown size={14} className="text-white/15" />}
                    </button>
                    {isExpanded && (
                      <div className="border-t border-white/[0.04] overflow-x-auto scrollbar-hide">
                        <table className="w-full min-w-[500px]">
                          <thead>
                            <tr className="border-b border-white/[0.04]">
                              <th className="text-left px-4 sm:px-6 py-2.5 text-[9px] uppercase tracking-[0.15em] text-white/25 w-[35%]">Esercizio</th>
                              <th className="text-center px-2 sm:px-3 py-2.5 text-[9px] uppercase tracking-[0.15em] text-white/25">Serie</th>
                              <th className="text-center px-2 sm:px-3 py-2.5 text-[9px] uppercase tracking-[0.15em] text-white/25">Reps</th>
                              <th className="text-center px-2 sm:px-3 py-2.5 text-[9px] uppercase tracking-[0.15em] text-white/25">Recupero</th>
                              <th className="text-left px-2 sm:px-3 py-2.5 text-[9px] uppercase tracking-[0.15em] text-white/25">Note</th>
                            </tr>
                          </thead>
                          <tbody>
                            {s.exercises.map((ex, j) => (
                              <tr key={j} className="border-b border-white/[0.02] last:border-b-0">
                                <td className="px-4 sm:px-6 py-3 text-[12px] text-white/60">{ex.name}</td>
                                <td className="px-2 sm:px-3 py-3 text-[12px] text-white/45 text-center">{ex.sets}</td>
                                <td className="px-2 sm:px-3 py-3 text-[12px] text-white/45 text-center">{ex.reps}</td>
                                <td className="px-2 sm:px-3 py-3 text-[12px] text-white/30 text-center">{ex.rest}</td>
                                <td className="px-2 sm:px-3 py-3 text-[10px] text-white/25 italic">{ex.notes || '–'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="border border-white/[0.06] py-16 flex flex-col items-center justify-center gap-2">
            <Dumbbell size={24} className="text-white/10" />
            <p className="text-[13px] text-white/20">Nessuna scheda assegnata</p>
            <p className="text-[10px] text-white/10">Il tuo coach ti assegnerà presto un programma</p>
          </div>
        )}

        {/* Downloadable training plan documents */}
        {schemaDocs.length > 0 && (
          <div className="border border-white/[0.06]">
            <div className="px-5 py-3 border-b border-white/[0.06]">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Schede scaricabili</p>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {schemaDocs.map(doc => (
                <div key={doc.id} className="px-5 py-3 flex items-center gap-4 hover:bg-white/[0.015] transition-colors">
                  <FileText size={14} className="text-white/15 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-white/50 truncate">{doc.name}</p>
                    <p className="text-[9px] text-white/15">{doc.size} · {doc.uploadedAt}</p>
                  </div>
                  <button className="w-7 h-7 bg-white/[0.04] flex items-center justify-center text-white/20 hover:text-white/50 transition-colors shrink-0">
                    <Download size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
