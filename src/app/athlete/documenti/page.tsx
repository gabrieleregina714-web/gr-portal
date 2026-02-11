'use client';

import { useSession } from 'next-auth/react';
import { FileText, Download, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { SPORTS, Athlete } from '@/lib/types';
import type { AthleteDocument } from '@/lib/auth-data';

export default function AthleteDocumentiPage() {
  const { data: session } = useSession();
  const athleteId = (session?.user as any)?.athleteId;
  const { athletes, athleteDocuments, fetchAthletes, fetchAthleteDocuments } = useStore();
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => { fetchAthletes(); fetchAthleteDocuments(); }, [fetchAthletes, fetchAthleteDocuments]);

  const athlete = athletes.find((a: Athlete) => a.id === athleteId);

  if (!athlete) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-white/55 text-sm">Caricamento...</p></div>;
  }

  const sport = SPORTS[athlete.sport];
  const allDocs = athleteDocuments.filter((d: AthleteDocument) => d.athleteId === athlete.id);
  const docs = filter === 'all' ? allDocs : allDocs.filter((d: AthleteDocument) => d.type === filter);

  const DOC_TYPE_LABELS: Record<string, string> = {
    'training-plan': 'Scheda',
    nutrition: 'Nutrizione',
    report: 'Report',
    contract: 'Contratto',
    medical: 'Medico',
    other: 'Altro',
  };

  const filters = [
    { key: 'all', label: 'Tutti' },
    { key: 'training-plan', label: 'Schede' },
    { key: 'nutrition', label: 'Nutrizione' },
    { key: 'report', label: 'Report' },
    { key: 'medical', label: 'Medico' },
    { key: 'contract', label: 'Contratto' },
  ].filter(f => f.key === 'all' || allDocs.some((d: AthleteDocument) => d.type === f.key));

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 -mt-5 sm:-mt-6 md:-mt-8">

      {/* Header */}
      <div className="relative overflow-hidden" style={{ height: '180px' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#0A0A0A]" />
        <div className="absolute bottom-6 left-6 lg:left-10 z-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/55 mb-2">{sport.label}</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', lineHeight: 1, letterSpacing: '2px' }} className="text-white text-[28px] sm:text-[36px]">
            DOCUMENTI
          </h1>
        </div>
        <div className="absolute bottom-6 right-6 lg:right-10 z-10">
          <p className="text-[10px] text-white/50">{allDocs.length} file</p>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-8 space-y-6">

        {/* Filters */}
        <div className="flex gap-px flex-wrap">
          {filters.map(f => {
            const count = f.key === 'all' ? allDocs.length : allDocs.filter((d: AthleteDocument) => d.type === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-2 text-[11px] uppercase tracking-[0.15em] transition-colors ${
                  filter === f.key ? 'bg-white text-black' : 'bg-white/[0.03] text-white/55 hover:text-white/70'
                }`}
              >
                {f.label} <span className="text-[10px] ml-1 opacity-40">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Documents list */}
        {docs.length > 0 ? (
          <div className="space-y-px">
            {docs.map(doc => (
              <div key={doc.id} className="flex items-center gap-4 px-6 py-4 border border-white/[0.06] hover:bg-white/[0.015] transition-colors group">
                <div className={`w-8 h-8 flex items-center justify-center shrink-0 ${
                  doc.type === 'training-plan' ? 'bg-white/[0.08] text-white/70' : 'bg-white/[0.04] text-white/50'
                }`}>
                  <FileText size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-white/60 truncate">{doc.name}</p>
                  <p className="text-[11px] text-white/50 mt-0.5">
                    <span className={`inline-block px-1.5 py-0.5 mr-2 text-[10px] uppercase tracking-[0.15em] ${
                      doc.type === 'training-plan' ? 'bg-white/[0.08] text-white/70' : 'bg-white/[0.03] text-white/55'
                    }`}>{DOC_TYPE_LABELS[doc.type] || doc.type}</span>
                    {doc.size} &middot; {doc.uploadedAt}
                  </p>
                </div>
                <div className="flex items-center gap-px sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                  <button className="w-7 h-7 bg-white/[0.04] flex items-center justify-center text-white/55 hover:text-white/50 transition-colors"><Eye size={11} /></button>
                  <button className="w-7 h-7 bg-white/[0.04] flex items-center justify-center text-white/55 hover:text-white/50 transition-colors"><Download size={11} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-white/[0.06] py-12 text-center">
            <FileText size={24} className="text-white/50 mx-auto mb-2" />
            <p className="text-[12px] text-white/50">Nessun documento</p>
          </div>
        )}
      </div>
    </div>
  );
}
