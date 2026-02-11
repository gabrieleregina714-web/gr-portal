'use client';

import { useSession } from 'next-auth/react';
import { User, Mail, Phone, Calendar, Ruler, Weight, Target, CreditCard, Camera, ImageIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/store';
import { subscriptions } from '@/lib/auth-data';
import { SPORTS, Athlete } from '@/lib/types';

export default function AthleteProfiloPage() {
  const { data: session } = useSession();
  const athleteId = (session?.user as any)?.athleteId;
  const { athletes, fetchAthletes, updateAthlete } = useStore();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchAthletes(); }, [fetchAthletes]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file || !athleteId) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', type === 'avatar' ? 'avatars' : 'covers');
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const { url } = await res.json();
    await updateAthlete(athleteId, type === 'avatar' ? { avatar: url } : { coverPhoto: url });
    setUploading(false);
  };

  const athlete = athletes.find((a: Athlete) => a.id === athleteId);

  if (!athlete) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-white/70 text-sm">Caricamento...</p></div>;
  }

  const sport = SPORTS[athlete.sport];
  const sub = subscriptions.find(s => s.athleteId === athlete.id);
  const lastM = athlete.measurements[athlete.measurements.length - 1];
  const daysSinceStart = Math.floor((new Date(2026, 1, 11).getTime() - new Date(athlete.startDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 -mt-5 sm:-mt-6 md:-mt-8">

      {/* Header */}
      <div className="relative overflow-hidden h-[220px] sm:h-[280px] md:h-[380px]">
        {athlete.coverPhoto ? (
          <img src={athlete.coverPhoto} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <img src="https://cdn.shopify.com/s/files/1/0969/1801/2243/files/renith-r-MLU_X1d3ofQ-unsplash.jpg?v=1768050398" alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-[#0A0A0A]/20" />
        <button onClick={() => coverInputRef.current?.click()} className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 transition-colors group" title="Cambia sfondo">
          <ImageIcon size={14} className="text-white/60 group-hover:text-white/60" />
        </button>
        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, 'cover')} />
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 lg:left-10 z-10 flex items-end gap-5">
          <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
            {athlete.avatar ? (
              <img src={athlete.avatar} alt="" className="w-16 h-16 object-cover" />
            ) : (
              <div className="w-16 h-16 bg-white/[0.06] flex items-center justify-center text-[20px] text-white/60 shrink-0" style={{ fontFamily: 'var(--font-heading)' }}>
                {athlete.name[0]}{athlete.surname[0]}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={16} className="text-white/60" />
            </div>
          </div>
          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, 'avatar')} />
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 mb-2">{sport.label} · Giorno {daysSinceStart}</p>
            <h1 style={{ fontFamily: 'var(--font-heading)', lineHeight: 1, letterSpacing: '2px' }} className="text-white text-[30px] sm:text-[40px] md:text-[48px]">
              {athlete.name.toUpperCase()} {athlete.surname.toUpperCase()}
            </h1>
          </div>
        </div>
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 lg:right-10 z-10">
          <span className={`px-3 py-1 text-[11px] uppercase tracking-[0.15em] ${
            athlete.status === 'active' ? 'bg-white/[0.06] text-white/70' : 'bg-red-400/10 text-red-400/40'
          }`}>
            {athlete.status === 'active' ? 'Attivo' : athlete.status === 'paused' ? 'In pausa' : 'Completato'}
          </span>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-8 space-y-8">

        {/* Personal info */}
        <div className="border border-white/[0.06]">
          <div className="px-5 py-3 border-b border-white/[0.06]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Informazioni personali</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.04]">
            {[
              { icon: <User size={13} />, label: 'Nome completo', value: `${athlete.name} ${athlete.surname}` },
              { icon: <Mail size={13} />, label: 'Email', value: athlete.email },
              { icon: <Phone size={13} />, label: 'Telefono', value: athlete.phone },
              { icon: <Calendar size={13} />, label: 'Età', value: `${athlete.age} anni` },
              { icon: <Ruler size={13} />, label: 'Altezza', value: `${athlete.height} cm` },
              { icon: <Weight size={13} />, label: 'Peso attuale', value: `${lastM.weight} kg` },
              { icon: <Target size={13} />, label: 'Obiettivo', value: athlete.goal },
              { icon: <Calendar size={13} />, label: 'Data inizio', value: athlete.startDate },
            ].map((item, i) => (
              <div key={i} className="bg-[#0A0A0A] px-5 py-4 flex items-center gap-3">
                <span className="text-white/70 shrink-0">{item.icon}</span>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-white/70 mb-0.5">{item.label}</p>
                  <p className="text-[13px] text-white/70">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sport info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
          <div className="bg-[#0A0A0A] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">Sport</p>
            <p className="text-[16px] text-white/60" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>{sport.label.toUpperCase()}</p>
          </div>
          <div className="bg-[#0A0A0A] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">Stato</p>
            <p className="text-[14px] text-white/70">{athlete.status === 'active' ? 'Attivo' : athlete.status === 'paused' ? 'In pausa' : 'Completato'}</p>
          </div>
          <div className="bg-[#0A0A0A] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">Giorni attivo</p>
            <p className="text-3xl font-bold text-white/60" style={{ fontFamily: 'var(--font-heading)' }}>{daysSinceStart}</p>
          </div>
          <div className="bg-[#0A0A0A] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">Misurazioni</p>
            <p className="text-3xl font-bold text-white/60" style={{ fontFamily: 'var(--font-heading)' }}>{athlete.measurements.length}</p>
          </div>
        </div>

        {/* Subscription */}
        {sub && (
          <div className="border border-white/[0.06]">
            <div className="px-5 py-3 border-b border-white/[0.06]">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Abbonamento</p>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.04]">
                <div className="bg-[#0A0A0A] px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-white/70 mb-0.5">Piano</p>
                  <p className="text-[14px] text-white/70">{sub.planName}</p>
                </div>
                <div className="bg-[#0A0A0A] px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-white/70 mb-0.5">Stato</p>
                  <p className="text-[14px] text-white/70">{sub.status === 'active' ? 'Attivo' : sub.status === 'paused' ? 'In pausa' : sub.status}</p>
                </div>
                <div className="bg-[#0A0A0A] px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-white/70 mb-0.5">Importo</p>
                  <p className="text-[14px] text-white/70">€{sub.amount}/mese</p>
                </div>
                <div className="bg-[#0A0A0A] px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-white/70 mb-0.5">Prossimo pagamento</p>
                  <p className="text-[14px] text-white/70">{sub.nextPayment}</p>
                </div>
                <div className="bg-[#0A0A0A] px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-white/70 mb-0.5">Data inizio</p>
                  <p className="text-[14px] text-white/70">{sub.startDate}</p>
                </div>
                <div className="bg-[#0A0A0A] px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-white/70 mb-0.5">Rinnovo automatico</p>
                  <p className="text-[14px] text-white/70">{sub.autoRenew ? 'Sì' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-white/[0.04] pt-6 text-center">
          <p className="text-[11px] text-white/70 uppercase tracking-[0.2em]">Per modifiche al profilo o all&apos;abbonamento contatta il tuo coach</p>
        </div>
      </div>
    </div>
  );
}
