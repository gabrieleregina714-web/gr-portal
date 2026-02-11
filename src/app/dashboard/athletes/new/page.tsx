'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { SPORTS, Sport } from '@/lib/types';

export default function NewAthletePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    sport: 'gym' as Sport,
    age: '',
    height: '',
    weight: '',
    goal: '',
    notes: '',
  });

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: redirect back
    router.push('/dashboard/athletes');
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <Link
        href="/dashboard/athletes"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white/40 hover:text-white transition-colors"
      >
        <ArrowLeft size={14} /> Tutti gli atleti
      </Link>

      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-white/30 mb-1">
          Nuovo
        </p>
        <h1 className="nike-h2">AGGIUNGI ATLETA</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="nike-card p-4 sm:p-5 md:p-6 space-y-5">
          <h3 className="nike-h4">DATI PERSONALI</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">
                Nome *
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="nike-input w-full"
                placeholder="Marco"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">
                Cognome *
              </label>
              <input
                required
                type="text"
                value={form.surname}
                onChange={(e) => update('surname', e.target.value)}
                className="nike-input w-full"
                placeholder="Rossi"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="nike-input w-full"
                placeholder="marco@email.com"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">
                Telefono (WhatsApp)
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="nike-input w-full"
                placeholder="+39 333 123 4567"
              />
            </div>
          </div>
        </div>

        <div className="nike-card p-4 sm:p-5 md:p-6 space-y-5">
          <h3 className="nike-h4">SPORT & FISICO</h3>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">
              Sport *
            </label>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(SPORTS) as Sport[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => update('sport', s)}
                  className={`px-4 py-2.5 text-xs uppercase tracking-wider rounded-full border transition-colors ${
                    form.sport === s
                      ? 'bg-white text-black border-white'
                      : 'border-white/10 text-white/40 hover:border-white/30'
                  }`}
                >
                  {SPORTS[s].label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">
                Età
              </label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => update('age', e.target.value)}
                className="nike-input w-full"
                placeholder="24"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">
                Altezza (cm)
              </label>
              <input
                type="number"
                value={form.height}
                onChange={(e) => update('height', e.target.value)}
                className="nike-input w-full"
                placeholder="178"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">
                Peso (kg)
              </label>
              <input
                type="number"
                value={form.weight}
                onChange={(e) => update('weight', e.target.value)}
                className="nike-input w-full"
                placeholder="76"
              />
            </div>
          </div>
        </div>

        <div className="nike-card p-4 sm:p-5 md:p-6 space-y-5">
          <h3 className="nike-h4">OBIETTIVO</h3>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">
              Obiettivo principale
            </label>
            <input
              type="text"
              value={form.goal}
              onChange={(e) => update('goal', e.target.value)}
              className="nike-input w-full"
              placeholder="Preparazione match — potenza e resistenza"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">
              Note
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={3}
              className="nike-input w-full resize-none"
              placeholder="Note aggiuntive sull'atleta..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="nike-btn nike-btn-white">
            <Save size={16} />
            Salva Atleta
          </button>
          <Link
            href="/dashboard/athletes"
            className="nike-btn nike-btn-white"
          >
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}
