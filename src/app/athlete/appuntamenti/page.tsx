'use client';

import { useSession } from 'next-auth/react';
import { Calendar, Clock, Video, Phone, Dumbbell, ClipboardCheck } from 'lucide-react';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { SPORTS, Athlete, Appointment } from '@/lib/types';

export default function AthleteAppuntamentiPage() {
  const { data: session } = useSession();
  const athleteId = (session?.user as any)?.athleteId;
  const { athletes, appointments, fetchAthletes, fetchAppointments } = useStore();

  useEffect(() => { fetchAthletes(); fetchAppointments(); }, [fetchAthletes, fetchAppointments]);

  const athlete = athletes.find((a: Athlete) => a.id === athleteId);

  if (!athlete) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-white/20 text-sm">Caricamento...</p></div>;
  }

  const sport = SPORTS[athlete.sport];
  const myAppointments = appointments.filter((a: Appointment) => a.athleteId === athlete.id)
    .sort((a: Appointment, b: Appointment) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  const upcoming = myAppointments.filter((a: Appointment) => a.status === 'scheduled');
  const past = myAppointments.filter((a: Appointment) => a.status === 'completed');

  const typeIcons: Record<string, React.ReactNode> = {
    training: <Dumbbell size={14} />,
    assessment: <ClipboardCheck size={14} />,
    call: <Phone size={14} />,
    review: <Video size={14} />,
  };

  const typeLabels: Record<string, string> = {
    training: 'Allenamento',
    assessment: 'Valutazione',
    call: 'Chiamata',
    review: 'Review',
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
  };

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 -mt-5 sm:-mt-6 md:-mt-8">

      {/* Header */}
      <div className="relative overflow-hidden" style={{ height: '180px' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#0A0A0A]" />
        <div className="absolute bottom-6 left-6 lg:left-10 z-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-2">{sport.label}</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', lineHeight: 1, letterSpacing: '2px' }} className="text-white">
            APPUNTAMENTI
          </h1>
        </div>
        <div className="absolute bottom-6 right-6 lg:right-10 z-10">
          <div className="flex gap-4 text-[10px] text-white/20">
            <span>{upcoming.length} in programma</span>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-8 space-y-8">

        {/* Upcoming */}
        <div className="border border-white/[0.06]">
          <div className="px-5 py-3 border-b border-white/[0.06]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Prossimi</p>
          </div>
          {upcoming.length > 0 ? (
            <div className="divide-y divide-white/[0.03]">
              {upcoming.map(apt => (
                <div key={apt.id} className="px-6 py-5 flex items-center gap-5 hover:bg-white/[0.01] transition-colors">
                  <div className="w-14 h-14 bg-white/[0.04] flex flex-col items-center justify-center shrink-0">
                    <p className="text-[8px] uppercase text-white/15">{new Date(apt.date).toLocaleDateString('it-IT', { weekday: 'short' })}</p>
                    <p className="text-[22px] text-white/50" style={{ fontFamily: 'var(--font-heading)' }}>{apt.date.slice(8)}</p>
                    <p className="text-[8px] text-white/10">{new Date(apt.date).toLocaleDateString('it-IT', { month: 'short' })}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-white/60 mb-1">{apt.notes}</p>
                    <div className="flex items-center gap-3 text-[10px] text-white/20">
                      <span className="flex items-center gap-1"><Clock size={9} /> {apt.time}</span>
                      <span>{apt.duration} min</span>
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-white/[0.04] text-[8px] uppercase tracking-[0.15em]">
                        {typeIcons[apt.type]} {typeLabels[apt.type]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Calendar size={20} className="text-white/10 mx-auto mb-2" />
              <p className="text-[12px] text-white/15">Nessun appuntamento in programma</p>
            </div>
          )}
        </div>

        {/* History */}
        {past.length > 0 && (
          <div className="border border-white/[0.06]">
            <div className="px-5 py-3 border-b border-white/[0.06]">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Completati</p>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {past.map(apt => (
                <div key={apt.id} className="px-6 py-3 flex items-center gap-4 opacity-50">
                  <div className="w-8 h-8 bg-white/[0.03] flex items-center justify-center shrink-0">
                    <p className="text-[10px] text-white/15">{apt.date.slice(8)}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-white/30 truncate">{apt.notes}</p>
                  </div>
                  <p className="text-[10px] text-white/10 shrink-0">{apt.time} · {apt.duration}min</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
