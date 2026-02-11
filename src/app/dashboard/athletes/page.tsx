'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SPORTS, Sport, Athlete } from '@/lib/types';
import { useStore } from '@/lib/store';

export default function AthletesPage() {
  const { athletes, fetchAthletes } = useStore();
  useEffect(() => { fetchAthletes(); }, []);

  const sports = Object.entries(SPORTS) as [Sport, typeof SPORTS[Sport]][];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center pt-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
          Gestione
        </p>
        <h1 className="nike-h1">I TUOI ATLETI</h1>
        <p className="text-white/70 text-sm mt-3 max-w-md mx-auto">
          Seleziona una disciplina per visualizzare gli atleti, i loro progressi e le analitiche.
        </p>
      </div>

      {/* Sport Cards Grid */}
      <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {sports.map(([key, sport]) => {
          const count = athletes.filter((a: Athlete) => a.sport === key).length;
          return (
            <Link
              key={key}
              href={`/dashboard/athletes/sport/${key}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] flex flex-col justify-end"
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${sport.image})` }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content */}
              <div className="relative z-10 p-4 sm:p-5 md:p-6 lg:p-8">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="nike-h2 text-white leading-none mb-1">
                      {sport.label.toUpperCase()}
                    </h2>
                    <p className="text-white/50 text-sm">
                      {count} {count === 1 ? 'atleta' : 'atleti'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white group-hover:text-black text-white transition-all">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>

              {/* Sport color accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[3px]"
                style={{ backgroundColor: sport.color }}
              />
            </Link>
          );
        })}
      </div>

      {/* Total */}
      <div className="text-center pb-4">
        <p className="text-white/55 text-xs uppercase tracking-[0.2em]">
          Totale atleti: {athletes.length}
        </p>
      </div>
    </div>
  );
}
