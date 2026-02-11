'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Users,
  Shield,
  ShieldCheck,
  Plus,
  X,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Edit3,
  Trash2,
  Lock,
  Unlock,
} from 'lucide-react';
import { staffUsers } from '@/lib/auth-data';

export default function TeamPage() {
  const { data: session } = useSession();
  const [showNewModal, setShowNewModal] = useState(false);

  const roleLabels: Record<string, string> = {
    ceo: 'CEO / Admin',
    employee: 'Dipendente',
    athlete: 'Atleta',
  };

  const permissionLabels: Record<string, string> = {
    all: 'Accesso completo',
    athletes: 'Gestione atleti',
    calendar: 'Calendario',
    training: 'Schede allenamento',
    measurements: 'Misurazioni',
    payments: 'Pagamenti',
    analytics: 'Analytics',
    team: 'Gestione team',
  };

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 -mt-5 sm:-mt-6 md:-mt-8">

      {/* Header */}
      <div className="relative overflow-hidden h-[220px] sm:h-[280px] md:h-[380px]">
        <img
          src="https://cdn.shopify.com/s/files/1/0969/1801/2243/files/renith-r-MLU_X1d3ofQ-unsplash.jpg?v=1768050398"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/10" />
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 lg:right-10 z-10">
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 text-[11px] uppercase tracking-[0.15em] bg-white text-black flex items-center gap-1.5 font-medium"
          >
            <Plus size={11} /> Aggiungi membro
          </button>
        </div>
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 lg:left-10 z-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/70 mb-2">Organizzazione</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', lineHeight: 1, letterSpacing: '2px' }} className="text-white text-[36px] sm:text-[48px] md:text-[56px]">
            TEAM
          </h1>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-8">

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.06] mb-8">
          <div className="bg-[#0A0A0A] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">Totale membri</p>
            <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{staffUsers.length}</p>
          </div>
          <div className="bg-[#0A0A0A] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">Admin</p>
            <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              {staffUsers.filter(u => u.role === 'ceo').length}
            </p>
          </div>
          <div className="bg-[#0A0A0A] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">Dipendenti</p>
            <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              {staffUsers.filter(u => u.role === 'employee').length}
            </p>
          </div>
        </div>

        {/* Staff list */}
        <div className="border border-white/[0.06]">
          <div className="px-5 py-3 border-b border-white/[0.06]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Membri del team</p>
          </div>
          {staffUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-3 sm:gap-6 px-4 sm:px-6 py-4 sm:py-5 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.015] transition-colors group">
              <div className="w-12 h-12 bg-white/[0.06] flex items-center justify-center text-[13px] text-white/70 shrink-0">
                {user.name[0]}{user.surname[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-[14px] text-white/80">{user.name} {user.surname}</p>
                  <span className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] ${
                    user.role === 'ceo'
                      ? 'bg-white/[0.08] text-white/50'
                      : 'bg-white/[0.03] text-white/60'
                  }`}>
                    {roleLabels[user.role]}
                  </span>
                  {user.status === 'suspended' && (
                    <span className="px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] bg-red-400/10 text-red-400/50">Sospeso</span>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] text-white/60 flex-wrap">
                  <span className="flex items-center gap-1"><Mail size={9} /> {user.email}</span>
                  {user.phone && <span className="flex items-center gap-1"><Phone size={9} /> {user.phone}</span>}
                  <span className="flex items-center gap-1"><Calendar size={9} /> Dal {user.hireDate}</span>
                </div>
              </div>

              {/* Permissions */}
              <div className="hidden md:flex flex-wrap gap-1 shrink-0 max-w-[200px]">
                {user.permissions.includes('all') ? (
                  <span className="px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] bg-white/[0.04] text-white/60 flex items-center gap-1">
                    <ShieldCheck size={8} /> Tutti i permessi
                  </span>
                ) : (
                  user.permissions.slice(0, 3).map(p => (
                    <span key={p} className="px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] bg-white/[0.03] text-white/50">
                      {permissionLabels[p] || p}
                    </span>
                  ))
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-px sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                <button className="w-7 h-7 bg-white/[0.04] flex items-center justify-center text-white/50 hover:text-white/70 transition-colors">
                  <Edit3 size={10} />
                </button>
                {user.role !== 'ceo' && (
                  <>
                    <button className="w-7 h-7 bg-white/[0.04] flex items-center justify-center text-white/50 hover:text-white/70 transition-colors">
                      {user.status === 'active' ? <Lock size={10} /> : <Unlock size={10} />}
                    </button>
                    <button className="w-7 h-7 bg-white/[0.04] flex items-center justify-center text-white/50 hover:text-red-400/40 transition-colors">
                      <Trash2 size={10} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Permissions matrix */}
        <div className="mt-8 border border-white/[0.06]">
          <div className="px-5 py-3 border-b border-white/[0.06]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Matrice permessi</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-white/55 w-40">Membro</th>
                  {['athletes', 'calendar', 'training', 'measurements', 'payments', 'analytics', 'team'].map(p => (
                    <th key={p} className="text-center px-3 py-3 text-[10px] uppercase tracking-[0.15em] text-white/50">
                      {permissionLabels[p]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staffUsers.map(user => (
                  <tr key={user.id} className="border-b border-white/[0.02] last:border-b-0">
                    <td className="px-4 py-3 text-[11px] text-white/50">{user.name} {user.surname[0]}.</td>
                    {['athletes', 'calendar', 'training', 'measurements', 'payments', 'analytics', 'team'].map(p => (
                      <td key={p} className="text-center px-3 py-3">
                        {user.permissions.includes('all') || user.permissions.includes(p) ? (
                          <div className="w-3 h-3 bg-white/30 mx-auto flex items-center justify-center">
                            <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        ) : (
                          <div className="w-3 h-3 bg-white/[0.04] mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Member Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6" onClick={() => setShowNewModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-[#111] border border-white/[0.08] w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/70">Nuovo membro</h3>
              <button onClick={() => setShowNewModal(false)} className="text-white/55 hover:text-white transition-colors"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[11px] uppercase tracking-[0.2em] text-white/55 mb-1.5 block">Nome</label><input type="text" placeholder="Nome" className="nike-input" /></div>
                <div><label className="text-[11px] uppercase tracking-[0.2em] text-white/55 mb-1.5 block">Cognome</label><input type="text" placeholder="Cognome" className="nike-input" /></div>
              </div>
              <div><label className="text-[11px] uppercase tracking-[0.2em] text-white/55 mb-1.5 block">Email</label><input type="email" placeholder="email@grperform.com" className="nike-input" /></div>
              <div><label className="text-[11px] uppercase tracking-[0.2em] text-white/55 mb-1.5 block">Password temporanea</label><input type="password" placeholder="••••••" className="nike-input" /></div>
              <div><label className="text-[11px] uppercase tracking-[0.2em] text-white/55 mb-1.5 block">Ruolo</label>
                <select className="nike-input">
                  <option value="employee">Dipendente</option>
                  <option value="ceo">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.2em] text-white/55 mb-2 block">Permessi</label>
                <div className="grid grid-cols-2 gap-2">
                  {['athletes', 'calendar', 'training', 'measurements', 'payments', 'analytics', 'team'].map(p => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-3.5 h-3.5 border border-white/[0.08] peer-checked:bg-white peer-checked:border-white transition-colors" />
                      <span className="text-[10px] text-white/60 group-hover:text-white/70 transition-colors">{permissionLabels[p]}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-5 border-t border-white/[0.06] flex items-center justify-end gap-3">
              <button onClick={() => setShowNewModal(false)} className="px-4 py-2 text-[11px] uppercase tracking-[0.15em] text-white/55 hover:text-white/50 transition-colors">Annulla</button>
              <button className="px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] bg-white text-black font-medium">Crea membro</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
