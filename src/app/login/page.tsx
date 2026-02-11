'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Credenziali non valide');
      setLoading(false);
    } else {
      // Fetch session to check role and redirect accordingly
      const res = await fetch('/api/auth/session');
      const session = await res.json();
      if (session?.user?.role === 'athlete') {
        router.push('/athlete');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Left — Video */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="https://cdn.shopify.com/videos/c/o/v/4e1c6acfb7834b46aea4d169fd262d61.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-12 left-12 z-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3">Athlete Management System</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '56px', lineHeight: 0.9, letterSpacing: '3px' }} className="text-white">
            GR<br />PERFORM
          </h1>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-20">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="lg:hidden mb-12 flex justify-center">
            <Image
              src="https://cdn.shopify.com/s/files/1/0969/1801/2243/files/Black_White_Bold_Modern_Clothing_Brand_Logo_97389bbf-665b-4465-82ec-d71a0fa4b35e.png?v=1758700090"
              alt="GR Perform"
              width={100}
              height={35}
              unoptimized
            />
          </div>

          <div className="hidden lg:block mb-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-2">Accedi al portale</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', lineHeight: 1, letterSpacing: '2px' }} className="text-white">
              LOGIN
            </h2>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 border border-red-500/20 bg-red-500/5 mb-6">
              <AlertCircle size={14} className="text-red-400 shrink-0" />
              <p className="text-[11px] text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-white/50 block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-white/[0.12] px-4 py-3.5 text-sm text-white placeholder-white/25 focus:border-white/30 focus:outline-none transition-colors"
                placeholder="coach@grperform.com"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-white/50 block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border border-white/[0.12] px-4 py-3.5 text-sm text-white placeholder-white/25 focus:border-white/30 focus:outline-none transition-colors pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black animate-spin" />
              ) : (
                <>Accedi <ArrowRight size={12} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/[0.04]">
            <p className="text-[10px] text-white/30 text-center uppercase tracking-[0.2em]">
              GR Perform &copy; 2026 — Tutti i diritti riservati
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
