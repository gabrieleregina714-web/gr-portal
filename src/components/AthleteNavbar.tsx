'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { signOut, useSession } from 'next-auth/react';

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
  const { data: session } = useSession();

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
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white">
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
