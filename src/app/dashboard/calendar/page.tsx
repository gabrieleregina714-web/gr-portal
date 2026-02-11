'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, Plus, Video, X, Clock, ArrowRight } from 'lucide-react';
import { APPOINTMENT_TYPES, SPORTS, Sport, Athlete, Appointment } from '@/lib/types';
import { useStore } from '@/lib/store';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { it } from 'date-fns/locale';

export default function CalendarPage() {
  const { athletes, appointments, addAppointment, fetchAthletes } = useStore();
  useEffect(() => { fetchAthletes(); }, []);

  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 1, 10));
  const [showNewModal, setShowNewModal] = useState(false);
  const [newApt, setNewApt] = useState({
    athleteId: '',
    type: 'training' as 'training' | 'call' | 'assessment' | 'review',
    time: '',
    duration: 60,
    notes: '',
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const dayAppointments = appointments.filter((a: Appointment) => a.date === selectedDateStr);

  const daysWithAppointments = useMemo(() => {
    return new Set(appointments.map((a: Appointment) => a.date));
  }, [appointments]);

  // Count per day for dot indicators
  const dayApptCounts = useMemo(() => {
    const map: Record<string, number> = {};
    appointments.forEach((a: Appointment) => { map[a.date] = (map[a.date] || 0) + 1; });
    return map;
  }, [appointments]);

  // Upcoming appointments (next 7 from all)
  const upcomingAppointments = useMemo(() => {
    return [...appointments]
      .filter((a: Appointment) => a.date >= '2026-02-10')
      .sort((a: Appointment, b: Appointment) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
      .slice(0, 5);
  }, [appointments]);

  const weekDays = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];

  const handleCreateAppointment = () => {
    if (!newApt.athleteId || !newApt.time || !selectedDate) return;
    const ath = athletes.find((a: Athlete) => a.id === newApt.athleteId);
    if (!ath) return;
    addAppointment({
      athleteId: ath.id,
      athleteName: `${ath.name} ${ath.surname}`,
      type: newApt.type,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: newApt.time,
      duration: newApt.duration,
      notes: newApt.notes,
      status: 'scheduled',
      sport: ath.sport,
    });
    setNewApt({ athleteId: '', type: 'training', time: '', duration: 60, notes: '' });
    setShowNewModal(false);
  };

  const todayTotal = appointments.filter((a: Appointment) => a.date === '2026-02-10').length;
  const monthTotal = appointments.filter((a: Appointment) => a.date.startsWith(format(currentMonth, 'yyyy-MM'))).length;

  return (
    <div className="space-y-0">

      {/* ═══════════ HERO HEADER ═══════════ */}
      <div className="relative mb-6 sm:mb-8 lg:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/60 mb-3 font-medium">Pianificazione</p>
            <h1 style={{ fontFamily: 'var(--font-heading)', lineHeight: 0.85, letterSpacing: '2px' }} className="text-white text-[28px] sm:text-[36px] md:text-[42px]">
              <span className="text-white/55">YOUR</span><br />
              SCHEDULE
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 pb-2">
            {/* Stats pills */}
            <div className="text-right">
              <p className="nike-stat-value text-2xl sm:text-3xl">{todayTotal}</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/60 mt-0.5">Oggi</p>
            </div>
            <div className="w-px h-8 bg-white/[0.06]" />
            <div className="text-right">
              <p className="nike-stat-value text-2xl sm:text-3xl">{monthTotal}</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/60 mt-0.5">Questo mese</p>
            </div>
            <div className="w-px h-8 bg-white/[0.06]" />
            <button
              onClick={() => { if (selectedDate) setShowNewModal(true); }}
              className="group flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white text-black text-[11px] uppercase tracking-wider font-semibold hover:bg-white/90 transition-all"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span className="hidden sm:inline">Nuovo</span>
              <ArrowRight size={12} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all hidden sm:block" />
            </button>
          </div>
        </div>
        {/* Divider */}
        <div className="mt-6 h-px bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-transparent" />
      </div>

      {/* ═══════════ MAIN LAYOUT ═══════════ */}
      <div className="grid md:grid-cols-12 gap-4 sm:gap-5 lg:gap-8">

        {/* ── CALENDAR GRID ── */}
        <div className="md:col-span-7">
          {/* Month Navigation */}
          <div className="flex items-center gap-4 mb-5 sm:mb-6 lg:mb-8">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center hover:border-white/20 hover:bg-white/[0.03] transition-all"
            >
              <ChevronLeft size={15} className="text-white/70" />
            </button>
            <h2 className="nike-h3 min-w-[140px] sm:min-w-[220px] text-sm sm:text-base">
              {format(currentMonth, 'MMMM yyyy', { locale: it }).toUpperCase()}
            </h2>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center hover:border-white/20 hover:bg-white/[0.03] transition-all"
            >
              <ChevronRight size={15} className="text-white/70" />
            </button>
          </div>

          {/* Week day headers */}
          <div className="grid grid-cols-7 mb-1">
            {weekDays.map((d, i) => (
              <div key={i} className="text-center text-[10px] uppercase tracking-[0.2em] text-white/50 py-3 font-medium">{d}</div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-px bg-white/[0.02] rounded-2xl overflow-hidden">
            {days.map((day, idx) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const hasAppts = daysWithAppointments.has(dateStr);
              const isToday = isSameDay(day, new Date(2026, 1, 10));
              const count = dayApptCounts[dateStr] || 0;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`relative aspect-[1/1.1] flex flex-col items-center justify-center transition-all group ${
                    !isCurrentMonth
                      ? 'bg-transparent'
                      : isSelected
                      ? 'bg-white'
                      : 'bg-[#111111] hover:bg-[#161616]'
                  }`}
                >
                  <span className={`text-[13px] font-medium transition-colors ${
                    !isCurrentMonth
                      ? 'text-white/[0.06]'
                      : isSelected
                      ? 'text-black font-bold'
                      : isToday
                      ? 'text-[#C8102E] font-bold'
                      : 'text-white/60 group-hover:text-white/80'
                  }`}>
                    {format(day, 'd')}
                  </span>

                  {/* Appointment indicator — accent line */}
                  {hasAppts && isCurrentMonth && (
                    <div className="absolute bottom-2 flex items-center gap-[2px]">
                      {count <= 2 ? (
                        Array.from({ length: count }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-[5px] h-[2px] rounded-full transition-colors ${
                              isSelected ? 'bg-black/30' : 'bg-[#C8102E]'
                            }`}
                          />
                        ))
                      ) : (
                        <>
                          <div className={`w-[5px] h-[2px] rounded-full ${isSelected ? 'bg-black/30' : 'bg-[#C8102E]'}`} />
                          <div className={`w-[5px] h-[2px] rounded-full ${isSelected ? 'bg-black/20' : 'bg-[#C8102E]/60'}`} />
                          <div className={`w-[5px] h-[2px] rounded-full ${isSelected ? 'bg-black/10' : 'bg-[#C8102E]/30'}`} />
                        </>
                      )}
                    </div>
                  )}

                  {/* Today ring */}
                  {isToday && !isSelected && (
                    <div className="absolute inset-[6px] rounded-xl border border-[#C8102E]/20 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="md:col-span-5 space-y-4 sm:space-y-5 lg:space-y-6">

          {/* Day Detail */}
          <div className="rounded-2xl bg-[#111111] border border-white/[0.04] overflow-hidden">
            {/* Day header */}
            <div className="p-4 sm:p-5 md:p-6 pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-baseline gap-3">
                  <span className="nike-stat-value text-5xl">
                    {selectedDate ? format(selectedDate, 'd') : '--'}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      {selectedDate ? format(selectedDate, 'EEEE', { locale: it }).toUpperCase() : ''}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-white/55">
                      {selectedDate ? format(selectedDate, 'MMMM yyyy', { locale: it }) : ''}
                    </p>
                  </div>
                </div>
                {selectedDate && (
                  <button
                    onClick={() => setShowNewModal(true)}
                    className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-all"
                  >
                    <Plus size={14} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${dayAppointments.length > 0 ? 'bg-[#C8102E]' : 'bg-white/10'}`} />
                <p className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-medium">
                  {dayAppointments.length} {dayAppointments.length === 1 ? 'sessione' : 'sessioni'}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-4 sm:mx-5 md:mx-6 h-px bg-white/[0.04]" />

            {/* Timeline appointments */}
            <div className="p-4 sm:p-5 md:p-6 pt-4">
              {dayAppointments.length > 0 ? (
                <div className="space-y-0">
                  {dayAppointments
                    .sort((a: Appointment, b: Appointment) => a.time.localeCompare(b.time))
                    .map((apt, idx) => {
                    const type = APPOINTMENT_TYPES[apt.type];
                    const sport = apt.sport ? SPORTS[apt.sport] : null;
                    const athlete = athletes.find((a: Athlete) => a.id === apt.athleteId);
                    const isLast = idx === dayAppointments.length - 1;
                    return (
                      <div key={apt.id} className="flex gap-4 group">
                        {/* Timeline line */}
                        <div className="flex flex-col items-center pt-1">
                          <div className="w-2 h-2 rounded-full border-2 group-hover:scale-110 transition-transform" style={{ borderColor: type.color, backgroundColor: type.color + '30' }} />
                          {!isLast && <div className="w-px flex-1 bg-white/[0.04] my-1" />}
                        </div>
                        {/* Content */}
                        <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-5'}`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[11px] font-bold tabular-nums text-white/80">{apt.time}</span>
                            <span className="text-[11px] uppercase tracking-wider font-semibold px-1.5 py-[1px] rounded" style={{ color: type.color, backgroundColor: type.color + '12' }}>
                              {type.label}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-white/90 mb-0.5">{apt.athleteName}</p>
                          <div className="flex items-center gap-3 text-[10px] text-white/55">
                            <span className="flex items-center gap-1"><Clock size={9} /> {apt.duration} min</span>
                            {sport && <span style={{ color: sport.color + '80' }}>{sport.label}</span>}
                          </div>
                          {apt.notes && <p className="text-[11px] text-white/55 mt-1.5 leading-relaxed">{apt.notes}</p>}
                          {/* Action buttons */}
                          <div className="flex items-center gap-1.5 mt-2.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <a href="https://zoom.us/j/new" target="_blank" rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded bg-[#2D8CFF]/10 text-[#2D8CFF] text-[11px] font-semibold uppercase tracking-wider hover:bg-[#2D8CFF]/20 transition-colors flex items-center gap-1">
                              <Video size={8} /> Zoom
                            </a>
                            {athlete?.phone && (
                              <a href={`https://wa.me/${athlete.phone.replace('+', '')}`} target="_blank" rel="noopener noreferrer"
                                className="px-2 py-0.5 rounded bg-[#25D366]/10 text-[#25D366] text-[11px] font-semibold uppercase tracking-wider hover:bg-[#25D366]/20 transition-colors flex items-center gap-1">
                                <MessageCircle size={8} /> WA
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border border-dashed border-white/[0.08] flex items-center justify-center mb-3">
                    <Plus size={14} className="text-white/50" />
                  </div>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium mb-1">Giornata libera</p>
                  <button
                    onClick={() => setShowNewModal(true)}
                    className="text-[10px] text-white/60 hover:text-white/50 transition-colors mt-1 underline underline-offset-4 decoration-white/10"
                  >
                    Pianifica una sessione
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── UPCOMING ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/55 font-medium">Prossimi</p>
              <div className="h-px flex-1 ml-3 bg-white/[0.04]" />
            </div>
            <div className="space-y-1">
              {upcomingAppointments.map((apt) => {
                const type = APPOINTMENT_TYPES[apt.type];
                const isSelected = apt.date === selectedDateStr;
                return (
                  <button
                    key={apt.id}
                    onClick={() => {
                      const [y, m, d] = apt.date.split('-').map(Number);
                      setSelectedDate(new Date(y, m - 1, d));
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group ${
                      isSelected ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="w-[3px] h-5 rounded-full" style={{ backgroundColor: type.color + '60' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-white/70 truncate">{apt.athleteName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] tabular-nums text-white/60">{apt.time}</p>
                      <p className="text-[11px] text-white/50">{format(new Date(apt.date + 'T00:00'), 'd MMM', { locale: it })}</p>
                    </div>
                    <ArrowRight size={10} className="text-white/50 sm:text-white/0 sm:group-hover:text-white/55 transition-colors shrink-0" />
                  </button>
                );
              })}
              {upcomingAppointments.length === 0 && (
                <p className="text-[11px] text-white/50 py-4 text-center">Nessun appuntamento in programma</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ NEW APPOINTMENT MODAL ═══════════ */}
      {showNewModal && selectedDate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-5 md:p-6" onClick={() => setShowNewModal(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl sm:rounded-3xl w-full max-w-md overflow-hidden"
            style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}
          >
            {/* Modal header */}
            <div className="p-5 sm:p-6 md:p-7 pb-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="nike-h4">NUOVA SESSIONE</h3>
                <button onClick={() => setShowNewModal(false)} className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center text-white/60 hover:text-white/60 hover:bg-white/[0.08] transition-all">
                  <X size={14} />
                </button>
              </div>
              <p className="text-[10px] text-white/55 uppercase tracking-[0.2em] mb-6">
                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: it })}
              </p>
            </div>

            {/* Modal form */}
            <div className="px-4 sm:px-5 md:px-7 pb-2 space-y-5">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2 block font-medium">Atleta</label>
                <select value={newApt.athleteId} onChange={(e) => setNewApt({ ...newApt, athleteId: e.target.value })} className="nike-input !rounded-xl !bg-white/[0.03] !border-white/[0.06] focus:!border-white/[0.12]">
                  <option value="">Seleziona...</option>
                  {athletes.map((a: Athlete) => (
                    <option key={a.id} value={a.id}>{a.name} {a.surname} — {SPORTS[a.sport].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2 block font-medium">Tipo</label>
                <div className="grid grid-cols-2 sm:flex gap-2">
                  {(['training', 'call', 'assessment', 'review'] as const).map((t) => {
                    const apt_type = APPOINTMENT_TYPES[t];
                    const active = newApt.type === t;
                    return (
                      <button
                        key={t}
                        onClick={() => setNewApt({ ...newApt, type: t })}
                        className={`sm:flex-1 py-2.5 rounded-xl text-[10px] uppercase tracking-wider font-semibold transition-all border ${
                          active
                            ? 'border-white/20 bg-white/[0.06] text-white'
                            : 'border-white/[0.04] bg-transparent text-white/60 hover:text-white/70 hover:border-white/[0.08]'
                        }`}
                      >
                        {apt_type.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2 block font-medium">Ora</label>
                  <input type="time" value={newApt.time} onChange={(e) => setNewApt({ ...newApt, time: e.target.value })} className="nike-input !rounded-xl !bg-white/[0.03] !border-white/[0.06] focus:!border-white/[0.12]" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2 block font-medium">Durata</label>
                  <div className="flex gap-1.5">
                    {[30, 45, 60, 90].map((d) => (
                      <button
                        key={d}
                        onClick={() => setNewApt({ ...newApt, duration: d })}
                        className={`flex-1 py-2.5 rounded-xl text-[11px] font-semibold transition-all border ${
                          newApt.duration === d
                            ? 'border-white/20 bg-white/[0.06] text-white'
                            : 'border-white/[0.04] text-white/55 hover:text-white/70 hover:border-white/[0.08]'
                        }`}
                      >
                        {d}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2 block font-medium">Note</label>
                <textarea rows={2} value={newApt.notes} onChange={(e) => setNewApt({ ...newApt, notes: e.target.value })} placeholder="Opzionale..." className="nike-input !rounded-xl !bg-white/[0.03] !border-white/[0.06] focus:!border-white/[0.12] resize-none" />
              </div>
            </div>

            {/* Modal footer */}
            <div className="p-5 sm:p-6 md:p-7 pt-5 flex items-center gap-3">
              <button onClick={() => setShowNewModal(false)} className="flex-1 py-3 rounded-full text-[11px] uppercase tracking-wider font-medium text-white/60 border border-white/[0.06] hover:border-white/[0.12] hover:text-white/70 transition-all">
                Annulla
              </button>
              <button
                onClick={handleCreateAppointment}
                className="flex-1 py-3 rounded-full text-[11px] uppercase tracking-wider font-semibold bg-white text-black hover:bg-white/90 transition-all"
              >
                Conferma
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
