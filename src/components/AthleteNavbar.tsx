'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, Bell, FileText, Calendar, Target, MessageCircle, Settings } from 'lucide-react';
import clsx from 'clsx';
import { signOut, useSession } from 'next-auth/react';
import { useStore, AppNotification } from '@/lib/store';

const NAV_ITEMS = [
  { label: 'Home', href: '/athlete' },
  { label: 'Scheda', href: '/athlete/scheda' },
  { label: 'Progressi', href: '/athlete/progressi' },
  { label: 'Appuntamenti', href: '/athlete/appuntamenti' },
  { label: 'Obiettivi', href: '/athlete/obiettivi' },
  { label: 'Documenti', href: '/athlete/documenti' },
  { label: 'Profilo', href: '/athlete/profilo' },
];

export default function AthleteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const athleteId = (session?.user as any)?.athleteId;
  const userId = athleteId ? `ath-user-${athleteId}` : '';
  const { notifications, fetchNotifications, markNotificationRead, markAllNotificationsRead } = useStore();

  useEffect(() => {
    if (userId) fetchNotifications(userId);
  }, [userId, fetchNotifications]);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const myNotifs = notifications.filter(n => n.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const unreadCount = myNotifs.filter(n => !n.read).length;

  const notifIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText size={13} />;
      case 'appointment': return <Calendar size={13} />;
      case 'goal': return <Target size={13} />;
      case 'message': return <MessageCircle size={13} />;
      default: return <Settings size={13} />;
    }
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m fa`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h fa`;
    const days = Math.floor(hrs / 24);
    return `${days}g fa`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/athlete" className="flex items-center shrink-0">
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
                item.href === '/athlete'
                  ? pathname === '/athlete'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'px-3 py-2 text-[10px] uppercase tracking-[0.15em] font-medium transition-colors',
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
            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-white/60 hover:text-white transition-colors"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-black text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-[340px] bg-[#141414] border border-white/[0.08] shadow-2xl z-50 max-h-[420px] overflow-y-auto">
                  <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Notifiche</p>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllNotificationsRead(userId)}
                        className="text-[10px] uppercase tracking-[0.15em] text-white/50 hover:text-white/80 transition-colors"
                      >
                        Segna tutte lette
                      </button>
                    )}
                  </div>
                  {myNotifs.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bell size={20} className="mx-auto text-white/20 mb-2" />
                      <p className="text-[11px] text-white/40">Nessuna notifica</p>
                    </div>
                  ) : (
                    myNotifs.slice(0, 10).map(n => (
                      <Link
                        key={n.id}
                        href={n.link || '/athlete'}
                        onClick={() => { markNotificationRead(n.id); setNotifOpen(false); }}
                        className={`block px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${!n.read ? 'bg-white/[0.03]' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 p-1.5 ${!n.read ? 'text-white/80' : 'text-white/40'}`}>
                            {notifIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[12px] font-medium truncate ${!n.read ? 'text-white/90' : 'text-white/60'}`}>{n.title}</p>
                            <p className="text-[11px] text-white/50 truncate mt-0.5">{n.message}</p>
                            <p className="text-[10px] text-white/30 mt-1">{timeAgo(n.createdAt)}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 bg-white rounded-full mt-1.5 shrink-0" />}
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {session?.user?.name && (
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/70">{session.user.name}</span>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-xs uppercase tracking-wider text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <LogOut size={14} />
              Esci
            </button>
          </div>

          {/* Mobile toggle + bell */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 text-white/60"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-black text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button onClick={() => setOpen(!open)} className="p-2 text-white">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile notifications dropdown */}
      {notifOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#111] max-h-[50vh] overflow-y-auto">
          <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.06]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Notifiche</p>
            {unreadCount > 0 && (
              <button onClick={() => markAllNotificationsRead(userId)} className="text-[10px] uppercase tracking-[0.15em] text-white/50">
                Segna tutte lette
              </button>
            )}
          </div>
          {myNotifs.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-[11px] text-white/40">Nessuna notifica</p>
            </div>
          ) : (
            myNotifs.slice(0, 8).map(n => (
              <Link
                key={n.id}
                href={n.link || '/athlete'}
                onClick={() => { markNotificationRead(n.id); setNotifOpen(false); }}
                className={`block px-4 py-3 border-b border-white/[0.03] ${!n.read ? 'bg-white/[0.03]' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 ${!n.read ? 'text-white/80' : 'text-white/40'}`}>
                    {notifIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] font-medium truncate ${!n.read ? 'text-white/90' : 'text-white/60'}`}>{n.title}</p>
                    <p className="text-[11px] text-white/50 truncate mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-white/30 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-white rounded-full mt-1.5 shrink-0" />}
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#0A0A0A]">
          <div className="px-4 sm:px-6 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/athlete'
                  ? pathname === '/athlete'
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
                className="flex items-center gap-2 px-4 py-3 text-sm uppercase tracking-wider text-white/60 w-full text-left"
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
