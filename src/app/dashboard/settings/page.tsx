'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Save, User, Bell, Palette, Globe } from 'lucide-react';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Gabriele',
    surname: 'Rossi',
    email: 'coach@grperform.com',
    phone: '+393331234567',
    role: 'Head Coach',
  });

  const [notifications, setNotifications] = useState({
    whatsapp: true,
    email: true,
    reminder: true,
    weekly: false,
  });

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-white/60 mb-1">
          Configurazione
        </p>
        <h1 className="nike-h2">SETTINGS</h1>
      </div>

      {/* Brand */}
      <div className="nike-card p-4 sm:p-5 md:p-6">
        <div className="flex items-center gap-3 mb-6">
          <Palette size={16} className="text-white/60" />
          <h3 className="nike-h4">BRAND</h3>
        </div>
        <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
          <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center p-3">
            <Image
              src="https://cdn.shopify.com/s/files/1/0969/1801/2243/files/Black_White_Bold_Modern_Clothing_Brand_Logo_97389bbf-665b-4465-82ec-d71a0fa4b35e.png?v=1758700090"
              alt="GR Perform"
              width={60}
              height={60}
              unoptimized
            />
          </div>
          <div>
            <p className="font-semibold text-sm">GR PERFORM</p>
            <p className="text-xs text-white/60 mt-1">
              Athlete Management Terminal
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-black border-2 border-white/20" />
                <span className="text-[10px] text-white/60">Nero</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#C8102E] border-2 border-white/10" />
                <span className="text-[10px] text-white/60">Rosso</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white border-2 border-white/10" />
                <span className="text-[10px] text-white/60">Bianco</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className="nike-card p-4 sm:p-5 md:p-6">
        <div className="flex items-center gap-3 mb-6">
          <User size={16} className="text-white/60" />
          <h3 className="nike-h4">PROFILO COACH</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile((p) => ({ ...p, name: e.target.value }))
              }
              className="nike-input w-full"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-2">
              Cognome
            </label>
            <input
              type="text"
              value={profile.surname}
              onChange={(e) =>
                setProfile((p) => ({ ...p, surname: e.target.value }))
              }
              className="nike-input w-full"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile((p) => ({ ...p, email: e.target.value }))
              }
              className="nike-input w-full"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-2">
              Telefono
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) =>
                setProfile((p) => ({ ...p, phone: e.target.value }))
              }
              className="nike-input w-full"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-2">
              Ruolo
            </label>
            <input
              type="text"
              value={profile.role}
              onChange={(e) =>
                setProfile((p) => ({ ...p, role: e.target.value }))
              }
              className="nike-input w-full"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="nike-card p-4 sm:p-5 md:p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell size={16} className="text-white/60" />
          <h3 className="nike-h4">NOTIFICHE</h3>
        </div>
        <div className="space-y-4">
          {[
            {
              key: 'whatsapp' as const,
              label: 'Promemoria WhatsApp',
              desc: 'Invia promemoria automatici via WhatsApp agli atleti',
            },
            {
              key: 'email' as const,
              label: 'Notifiche Email',
              desc: 'Ricevi un riepilogo giornaliero via email',
            },
            {
              key: 'reminder' as const,
              label: 'Reminder Sessioni',
              desc: 'Avviso 1h prima di ogni sessione',
            },
            {
              key: 'weekly' as const,
              label: 'Report Settimanale',
              desc: 'Report automatico ogni lunedì',
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-2"
            >
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-white/60 mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  setNotifications((n) => ({
                    ...n,
                    [item.key]: !n[item.key],
                  }))
                }
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  notifications[item.key] ? 'bg-white' : 'bg-white/10'
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 w-[18px] h-[18px] rounded-full absolute top-[3px] transition-transform ${
                    notifications[item.key] ? 'right-[3px] bg-black' : 'left-[3px] bg-white'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hosting */}
      <div className="nike-card p-4 sm:p-5 md:p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe size={16} className="text-white/60" />
          <h3 className="nike-h4">HOSTING</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Vercel</p>
            <p className="text-xs text-white/60 mt-0.5">
              Deploy automatico su Vercel
            </p>
          </div>
          <span className="nike-tag !bg-green-500/10 !text-green-400">
            Attivo
          </span>
        </div>
      </div>

      <button className="nike-btn nike-btn-white">
        <Save size={16} />
        Salva Modifiche
      </button>
    </div>
  );
}
