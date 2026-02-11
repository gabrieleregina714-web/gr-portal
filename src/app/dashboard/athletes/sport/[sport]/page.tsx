'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Plus,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
} from 'lucide-react';
import { goals } from '@/lib/data';
import { SPORTS, Sport, Athlete } from '@/lib/types';
import { useStore } from '@/lib/store';

export default function SportAthletesPage() {
  const { athletes, fetchAthletes } = useStore();
  useEffect(() => { fetchAthletes(); }, []);

  const params = useParams();
  const sportKey = params.sport as Sport;
  const sport = SPORTS[sportKey];

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');

  if (!sport) {
    return (
      <div className="py-20 text-center">
        <p className="text-white/40">Sport non trovato.</p>
        <Link href="/dashboard/athletes" className="nike-btn nike-btn-white mt-4">
          Torna indietro
        </Link>
      </div>
    );
  }

  const allSportAthletes = athletes.filter((a: Athlete) => a.sport === sportKey);
  const activeCount = allSportAthletes.filter((a: Athlete) => a.status === 'active').length;
  const pausedCount = allSportAthletes.filter((a: Athlete) => a.status === 'paused').length;

  const sportAthletes = allSportAthletes.filter((a: Athlete) => {
    const matchSearch = `${a.name} ${a.surname}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 -mt-5 sm:-mt-6 md:-mt-8">

      {/* HEADER */}
      <div className="relative overflow-hidden" style={{ height: '220px' }}>
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={sport.video} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]/20" />

        <Link
          href="/dashboard/athletes"
          className="absolute top-6 left-6 lg:left-10 z-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={12} /> Atleti
        </Link>

        <div className="absolute bottom-8 left-6 lg:left-10 z-10">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '42px', lineHeight: 1, letterSpacing: '2px' }} className="text-white">
            {sport.label.toUpperCase()}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">{allSportAthletes.length} atleti</span>
            <span className="w-px h-3 bg-white/10" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">{activeCount} attivi</span>
            <span className="w-px h-3 bg-white/10" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">{pausedCount} in pausa</span>
          </div>
        </div>

        <div className="absolute bottom-8 right-6 lg:right-10 z-10 flex items-center gap-1.5">
          <Link
            href="/dashboard/athletes/new"
            className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
          >
            <Plus size={13} />
          </Link>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="px-6 lg:px-10 border-b border-white/[0.06]">
        <div className="flex items-center justify-between py-3">
          <div className="flex gap-0">
            {(['all', 'active', 'paused'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-colors border-b ${
                  statusFilter === s
                    ? 'text-white border-white'
                    : 'text-white/20 border-transparent hover:text-white/40'
                }`}
              >
                {s === 'all' ? `Tutti (${allSportAthletes.length})` : s === 'active' ? `Attivi (${activeCount})` : `Pausa (${pausedCount})`}
              </button>
            ))}
          </div>

          <div className="relative max-w-[220px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/15" />
            <input
              type="text"
              placeholder="Cerca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.06] py-2 pl-8 pr-3 text-[11px] text-white placeholder:text-white/15 outline-none focus:border-white/15 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-6 lg:px-10 py-8">

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-px bg-white/[0.06] mb-8">
          {[
            { label: 'Totale atleti', value: `${allSportAthletes.length}`, icon: <Users size={14} className="text-white/15" /> },
            { label: 'Attivi', value: `${activeCount}`, icon: <UserCheck size={14} className="text-white/15" /> },
            { label: 'In pausa', value: `${pausedCount}`, icon: <UserX size={14} className="text-white/15" /> },
          ].map((s) => (
            <div key={s.label} className="bg-[#0A0A0A] p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">{s.label}</p>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Athlete List */}
        <div className="space-y-px">
          {sportAthletes.map((athlete) => {
            const athleteGoals = goals.filter((g) => g.athleteId === athlete.id);
            const avgProg = athleteGoals.length
              ? Math.round(athleteGoals.reduce((s, g) => s + g.progress, 0) / athleteGoals.length)
              : 0;
            const lastM = athlete.measurements[athlete.measurements.length - 1];
            const daysSinceStart = Math.floor((new Date(2026, 1, 10).getTime() - new Date(athlete.startDate).getTime()) / (1000 * 60 * 60 * 24));

            return (
              <Link
                key={athlete.id}
                href={`/dashboard/athletes/${athlete.id}`}
                className="flex items-center gap-6 px-6 py-4 border border-white/[0.06] hover:bg-white/[0.015] transition-colors group"
              >
                {/* Avatar */}
                <div className="w-10 h-10 bg-white/[0.06] flex items-center justify-center text-[11px] font-semibold text-white/40 shrink-0">
                  {athlete.name[0]}{athlete.surname[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-white/80 font-medium tracking-wide truncate group-hover:text-white transition-colors">
                    {athlete.name} {athlete.surname}
                  </p>
                  <p className="text-[10px] text-white/20 mt-0.5 truncate">
                    {athlete.goal}
                  </p>
                </div>

                {/* Days */}
                <div className="hidden md:block text-right shrink-0">
                  <p className="text-[10px] text-white/15">Day {daysSinceStart}</p>
                </div>

                {/* Progress */}
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                  <div className="w-20">
                    <div className="h-[2px] bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full bg-white/50 transition-all"
                        style={{ width: `${avgProg}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[11px] text-white/30 w-8 text-right tabular-nums">{avgProg}%</span>
                </div>

                {/* Weight */}
                <div className="hidden lg:block text-right shrink-0 w-16">
                  <p className="text-[11px] text-white/40 tabular-nums">{lastM?.weight || '—'} <span className="text-white/15">kg</span></p>
                </div>

                {/* Status */}
                <span
                  className={`w-1.5 h-1.5 shrink-0 ${
                    athlete.status === 'active' ? 'bg-white/50' : 'bg-white/15'
                  }`}
                />

                <ChevronRight size={13} className="text-white/10 group-hover:text-white/30 transition-colors shrink-0" />
              </Link>
            );
          })}
        </div>

        {sportAthletes.length === 0 && (
          <div className="py-20 text-center border border-white/[0.06]">
            <p className="text-white/20 text-[11px] uppercase tracking-[0.2em] mb-6">Nessun atleta trovato</p>
            <Link
              href="/dashboard/athletes/new"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[9px] uppercase tracking-[0.15em] bg-white text-black font-medium"
            >
              <Plus size={12} /> Aggiungi atleta
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
