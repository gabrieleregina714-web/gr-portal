'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push('/dashboard'), 800);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left — Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative items-end p-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-lg">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">
            Athlete Management Terminal
          </p>
          <h1 className="nike-h1 text-white leading-[0.9] mb-6">
            DOMINA
            <br />
            IL GIOCO.
          </h1>
          <p className="text-white/50 text-sm max-w-sm">
            Gestisci i tuoi atleti, programma gli allenamenti, monitora i progressi.
            Tutto in un unico terminale.
          </p>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-20">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-12">
            <Image
              src="https://cdn.shopify.com/s/files/1/0969/1801/2243/files/Black_White_Bold_Modern_Clothing_Brand_Logo_97389bbf-665b-4465-82ec-d71a0fa4b35e.png?v=1758700090"
              alt="GR Perform"
              width={140}
              height={50}
              unoptimized
            />
          </div>

          <p className="text-xs uppercase tracking-[0.25em] text-white/40 mb-2">
            Accedi al terminale
          </p>
          <h2 className="nike-h3 text-white mb-10">SIGN IN</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 pb-3 text-white text-sm focus:outline-none focus:border-white transition-colors placeholder:text-white/20"
                placeholder="coach@grperform.com"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 pb-3 text-white text-sm focus:outline-none focus:border-white transition-colors placeholder:text-white/20"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-white text-black font-semibold text-sm uppercase tracking-wider py-4 rounded-full hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Accedi <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-white/20 text-xs mt-12 text-center">
            © 2026 GR Perform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
