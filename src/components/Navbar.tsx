'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, LogOut, Search, Bell } from 'lucide-react';
import clsx from 'clsx';
import { signOut, useSession } from 'next-auth/react';
import { SPORTS, Athlete } from '@/lib/types';
import { notifications } from '@/lib/auth-data';
import { useStore } from '@/lib/store';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Atleti', href: '/dashboard/athletes' },
  { label: 'Calendario', href: '/dashboard/calendar' },
  { label: 'Analytics', href: '/dashboard/analytics' },
  { label: 'Pagamenti', href: '/dashboard/payments' },
  { label: 'Team', href: '/dashboard/team' },
];

export default function Navbar() {
  const { athletes, fetchAthletes } = useStore();
  useEffect(() => { fetchAthletes(); }, []);

  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notiOpen, setNotiOpen] = useState(false);
  const notiRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const unreadCount = notifications.filter(n => !n.read).length;
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredAthletes = searchQuery.length >= 1
    ? athletes.filter((a: Athlete) =>
        `${a.name} ${a.surname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        SPORTS[a.sport].label.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) {
        setNotiOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  // Keyboard shortcut: Ctrl+K
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center shrink-0">
            <Image
              src="https://cdn.shopify.com/s/files/1/0969/1801/2243/files/Black_White_Bold_Modern_Clothing_Brand_Logo_97389bbf-665b-4465-82ec-d71a0fa4b35e.png?v=1758700090"
              alt="GR Perform"
              width={72}
              height={25}
              unoptimized
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'px-4 py-2 text-xs uppercase tracking-[0.15em] font-medium transition-colors',
                    isActive
                      ? 'bg-white text-black'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center gap-2 px-3 py-2 text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
              >
                <Search size={14} />
                <span className="text-[10px] uppercase tracking-wider hidden lg:inline">Cerca</span>
                <kbd className="hidden lg:inline text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/20 font-mono">⌘K</kbd>
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-12 w-[320px] bg-[#141414] border border-white/[0.08] shadow-2xl overflow-hidden z-50">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                    <Search size={14} className="text-white/30 shrink-0" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cerca atleta..."
                      className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-white/20 hover:text-white/50">
                        <X size={12} />
                      </button>
                    )}
                  </div>
                  <div className="max-h-[280px] overflow-y-auto">
                    {filteredAthletes.length > 0 ? (
                      filteredAthletes.map((a) => {
                        const sp = SPORTS[a.sport];
                        return (
                          <button
                            key={a.id}
                            onClick={() => { router.push(`/dashboard/athletes/${a.id}`); setSearchOpen(false); setSearchQuery(''); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors text-left"
                          >
                            <div className="w-8 h-8 flex items-center justify-center text-[11px] font-bold uppercase shrink-0 bg-white/[0.06] text-white/40">
                              {a.name[0]}{a.surname[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-medium text-white/80 truncate">{a.name} {a.surname}</p>
                              <p className="text-[10px] text-white/25">{sp.label} · {a.status === 'active' ? 'Attivo' : 'In pausa'}</p>
                            </div>
                          </button>
                        );
                      })
                    ) : searchQuery.length >= 1 ? (
                      <div className="px-4 py-6 text-center">
                        <p className="text-[11px] text-white/20">Nessun risultato</p>
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-[11px] text-white/20">Digita per cercare...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Notifications */}
            <div ref={notiRef} className="relative">
              <button
                onClick={() => setNotiOpen(!notiOpen)}
                className="relative p-2 text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
              >
                <Bell size={15} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-white text-black text-[7px] font-bold flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
              {notiOpen && (
                <div className="absolute right-0 top-12 w-[340px] bg-[#141414] border border-white/[0.08] shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Notifiche</p>
                    <span className="text-[9px] text-white/20">{unreadCount} nuove</span>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {notifications.slice(0, 8).map(n => (
                      <div key={n.id} className={`px-4 py-3 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors ${!n.read ? 'bg-white/[0.015]' : ''}`}>
                        <div className="flex items-start gap-3">
                          {!n.read && <div className="w-1 h-1 bg-white/50 mt-1.5 shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-white/60 leading-relaxed">{n.message}</p>
                            <p className="text-[9px] text-white/15 mt-1">{n.createdAt}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* User + logout */}
            {session?.user?.name && (
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/20">{session.user.name}</span>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-xs uppercase tracking-wider text-white/30 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <LogOut size={14} />
              Esci
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-white"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#0A0A0A]">
          <div className="px-4 sm:px-6 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    'block px-4 py-3 text-sm uppercase tracking-wider transition-colors',
                    isActive
                      ? 'bg-white text-black font-medium'
                      : 'text-white/50 hover:bg-white/5'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-white/5 mt-4">
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center gap-2 px-4 py-3 text-sm uppercase tracking-wider text-white/30 w-full text-left"
              >
                <LogOut size={14} /> Esci
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
