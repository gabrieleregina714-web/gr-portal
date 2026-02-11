'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  Check,
  Clock,
  X,
  ChevronRight,
  Filter,
  CreditCard,
  UserMinus,
  UserPlus,
  Repeat,
  ExternalLink,
} from 'lucide-react';
import { payments, subscriptions } from '@/lib/auth-data';
import { SPORTS, Sport, Athlete } from '@/lib/types';
import { useStore } from '@/lib/store';

type Tab = 'overview' | 'transactions' | 'subscriptions' | 'insights';

export default function PaymentsPage() {
  const { athletes, fetchAthletes } = useStore();
  useEffect(() => { fetchAthletes(); }, []);

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('2026-02');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Panoramica' },
    { id: 'transactions', label: 'Transazioni' },
    { id: 'subscriptions', label: 'Abbonamenti' },
    { id: 'insights', label: 'Business' },
  ];

  // ─── Computed data ───
  const thisMonthPayments = payments.filter(p => p.date.startsWith(filterMonth));
  const paidThisMonth = thisMonthPayments.filter(p => p.status === 'paid');
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const overduePayments = payments.filter(p => p.status === 'overdue');

  const totalRevenue = paidThisMonth.reduce((s, p) => s + p.amount, 0);
  const pendingAmount = pendingPayments.reduce((s, p) => s + p.amount, 0);

  // Monthly revenue breakdown
  const monthlyRevenue = useMemo(() => {
    const months: Record<string, number> = {};
    payments.filter(p => p.status === 'paid').forEach(p => {
      const m = p.date.substring(0, 7);
      months[m] = (months[m] || 0) + p.amount;
    });
    return Object.entries(months).sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  const lastMonthRevenue = monthlyRevenue.find(([m]) => m === '2026-01')?.[1] || 0;
  const revenueDelta = lastMonthRevenue ? Math.round(((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : 0;

  // Active vs churned
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const pausedSubs = subscriptions.filter(s => s.status === 'paused' || s.status === 'cancelled');
  const MRR = activeSubs.reduce((s, sub) => s + sub.amount, 0);

  // Revenue by sport
  const revenueBySport = useMemo(() => {
    const map: Record<string, number> = {};
    paidThisMonth.forEach(p => {
      const athlete = athletes.find((a: Athlete) => a.id === p.athleteId);
      if (athlete) {
        map[athlete.sport] = (map[athlete.sport] || 0) + p.amount;
      }
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [paidThisMonth]);

  // Client lifetime value
  const clientRevenue = useMemo(() => {
    const map: Record<string, { name: string; total: number; months: number; sport: Sport }> = {};
    payments.filter(p => p.status === 'paid').forEach(p => {
      const athlete = athletes.find((a: Athlete) => a.id === p.athleteId);
      if (athlete) {
        if (!map[p.athleteId]) {
          map[p.athleteId] = { name: p.athleteName, total: 0, months: 0, sport: athlete.sport };
        }
        map[p.athleteId].total += p.amount;
        if (p.type === 'subscription') map[p.athleteId].months++;
      }
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, []);

  // Avg revenue per athlete
  const avgRevenuePerAthlete = activeSubs.length > 0 ? Math.round(MRR / activeSubs.length) : 0;

  // Filtered transactions
  const filteredPayments = useMemo(() => {
    let list = [...payments];
    if (filterStatus !== 'all') list = list.filter(p => p.status === filterStatus);
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [filterStatus]);

  const statusMap: Record<string, { label: string; style: string }> = {
    paid: { label: 'Pagato', style: 'text-white/60 bg-white/[0.04]' },
    pending: { label: 'In attesa', style: 'text-yellow-400/70 bg-yellow-400/[0.06]' },
    overdue: { label: 'Scaduto', style: 'text-red-400/70 bg-red-400/[0.06]' },
    refunded: { label: 'Rimborsato', style: 'text-blue-400/70 bg-blue-400/[0.06]' },
    cancelled: { label: 'Annullato', style: 'text-white/55 bg-white/[0.02]' },
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
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 lg:right-10 z-10 flex items-center gap-3">
          <span className="text-[10px] text-white/70 uppercase tracking-[0.15em]">
            MRR €{MRR}
          </span>
        </div>
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 lg:left-10 z-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/70 mb-2">Gestione finanziaria</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', lineHeight: 1, letterSpacing: '2px' }} className="text-white text-[36px] sm:text-[48px] md:text-[56px]">
            PAGAMENTI
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-10 overflow-x-auto scrollbar-hide">
        <div className="flex gap-0 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-5 py-3 text-[11px] uppercase tracking-[0.2em] transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-white border-white'
                  : 'text-white/60 border-transparent hover:text-white/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8">

        {/* ═══ OVERVIEW ═══ */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">Entrate Febbraio</p>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  €{totalRevenue}
                </p>
                {revenueDelta !== 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    {revenueDelta > 0 ? <ArrowUpRight size={10} className="text-white/70" /> : <ArrowDownRight size={10} className="text-white/55" />}
                    <span className="text-[11px] text-white/60">{revenueDelta > 0 ? '+' : ''}{revenueDelta}% vs Gennaio</span>
                  </div>
                )}
              </div>
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">MRR</p>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>€{MRR}</p>
                <p className="text-[11px] text-white/50 mt-1">{activeSubs.length} abbonamenti attivi</p>
              </div>
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">In sospeso</p>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>€{pendingAmount}</p>
                <p className="text-[11px] text-white/50 mt-1">{pendingPayments.length} pagamenti</p>
              </div>
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">Media/Atleta</p>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>€{avgRevenuePerAthlete}</p>
                <p className="text-[11px] text-white/50 mt-1">mensile</p>
              </div>
            </div>

            {/* Alerts */}
            {(pendingPayments.length > 0 || overduePayments.length > 0) && (
              <div className="border border-white/[0.06]">
                <div className="px-5 py-3 border-b border-white/[0.06]">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 flex items-center gap-2">
                    <AlertCircle size={11} /> Attenzione
                  </p>
                </div>
                {pendingPayments.map(p => (
                  <Link key={p.id} href={`/dashboard/athletes/${p.athleteId}`} className="flex items-center gap-4 px-5 py-3 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.015] transition-colors">
                    <Clock size={12} className="text-yellow-400/50 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-white/60">{p.athleteName} — {p.planName}</p>
                      <p className="text-[11px] text-white/55 mt-0.5">{p.notes || `Scadenza: ${p.dueDate}`}</p>
                    </div>
                    <span className="text-[12px] text-white/70 tabular-nums">€{p.amount}</span>
                    <ChevronRight size={12} className="text-white/50" />
                  </Link>
                ))}
              </div>
            )}

            {/* Revenue by Month */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06]">
              <div className="bg-[#0A0A0A] p-6">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-5">Entrate Mensili</h3>
                <div className="space-y-3">
                  {monthlyRevenue.map(([month, revenue]) => {
                    const maxRev = Math.max(...monthlyRevenue.map(([, r]) => r));
                    const pct = (revenue / maxRev) * 100;
                    const [y, m] = month.split('-');
                    const monthNames = ['', 'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
                    return (
                      <div key={month}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-white/70">{monthNames[parseInt(m)]} {y}</span>
                          <span className="text-[11px] text-white/50 tabular-nums">€{revenue}</span>
                        </div>
                        <div className="h-[3px] bg-white/[0.04]">
                          <div className="h-full bg-white/40 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#0A0A0A] p-6">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-5">Entrate per Sport</h3>
                <div className="space-y-4">
                  {revenueBySport.map(([sport, revenue]) => {
                    const sportInfo = SPORTS[sport as Sport];
                    const pct = totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0;
                    return (
                      <div key={sport} className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/[0.04] flex items-center justify-center text-[10px] sm:text-[11px] uppercase tracking-wider text-white/60 shrink-0">
                          {sportInfo?.label.substring(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] text-white/50">{sportInfo?.label}</span>
                            <span className="text-[11px] text-white/70 tabular-nums">€{revenue}</span>
                          </div>
                          <div className="h-[2px] bg-white/[0.04]">
                            <div className="h-full bg-white/30" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <span className="text-[10px] text-white/55 tabular-nums w-8 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.04]">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-4">Top Clienti per Valore</h3>
                  {clientRevenue.slice(0, 4).map(([id, data]) => (
                    <Link key={id} href={`/dashboard/athletes/${id}`} className="flex items-center gap-3 py-2 hover:bg-white/[0.02] transition-colors -mx-2 px-2 group">
                      <div className="w-7 h-7 bg-white/[0.04] flex items-center justify-center text-[11px] text-white/60">
                        {data.name.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] text-white/50 group-hover:text-white/70 transition-colors">{data.name}</p>
                        <p className="text-[11px] text-white/50">{data.months} mesi</p>
                      </div>
                      <span className="text-[11px] text-white/70 tabular-nums">€{data.total}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ TRANSACTIONS ═══ */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-px bg-white/[0.06] w-full sm:w-fit overflow-x-auto scrollbar-hide">
              {['all', 'paid', 'pending', 'overdue', 'cancelled'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 sm:px-4 py-2 text-[11px] uppercase tracking-[0.15em] transition-colors whitespace-nowrap ${
                    filterStatus === s ? 'bg-white text-black' : 'bg-[#0A0A0A] text-white/60 hover:text-white/50'
                  }`}
                >
                  {s === 'all' ? 'Tutti' : statusMap[s]?.label || s}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="border border-white/[0.06] overflow-x-auto scrollbar-hide">
              <div className="min-w-[700px]">
              <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/[0.06]">
                <span className="col-span-3 text-[10px] uppercase tracking-[0.15em] text-white/60">Atleta</span>
                <span className="col-span-3 text-[10px] uppercase tracking-[0.15em] text-white/60">Piano</span>
                <span className="col-span-2 text-[10px] uppercase tracking-[0.15em] text-white/60">Data</span>
                <span className="col-span-1 text-[10px] uppercase tracking-[0.15em] text-white/60">Importo</span>
                <span className="col-span-1 text-[10px] uppercase tracking-[0.15em] text-white/60">Metodo</span>
                <span className="col-span-1 text-[10px] uppercase tracking-[0.15em] text-white/60">Stato</span>
                <span className="col-span-1 text-[10px] uppercase tracking-[0.15em] text-white/60">Ordine</span>
              </div>
              {filteredPayments.map((p) => (
                <Link
                  key={p.id}
                  href={`/dashboard/athletes/${p.athleteId}`}
                  className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.015] transition-colors group"
                >
                  <span className="col-span-3 text-[12px] text-white/60 group-hover:text-white/80 transition-colors truncate">{p.athleteName}</span>
                  <span className="col-span-3 text-[11px] text-white/60 truncate">{p.planName}</span>
                  <span className="col-span-2 text-[11px] text-white/60 tabular-nums">{p.date}</span>
                  <span className="col-span-1 text-[12px] text-white/50 tabular-nums">€{p.amount}</span>
                  <span className="col-span-1 text-[10px] text-white/55 uppercase">{p.method}</span>
                  <span className="col-span-1">
                    <span className={`text-[11px] uppercase tracking-[0.1em] px-2 py-0.5 ${statusMap[p.status]?.style}`}>
                      {statusMap[p.status]?.label}
                    </span>
                  </span>
                  <span className="col-span-1 text-[10px] text-white/50 flex items-center gap-1">
                    {p.shopifyOrderId && (
                      <>{p.shopifyOrderId} <ExternalLink size={8} /></>
                    )}
                  </span>
                </Link>
              ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ SUBSCRIPTIONS ═══ */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.06]">
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">Attivi</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{activeSubs.length}</p>
              </div>
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">In pausa / Annullati</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{pausedSubs.length}</p>
              </div>
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">Churn Rate</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  {subscriptions.length > 0 ? Math.round((pausedSubs.length / subscriptions.length) * 100) : 0}%
                </p>
              </div>
            </div>

            <div className="border border-white/[0.06]">
              <div className="px-5 py-3 border-b border-white/[0.06]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Tutti gli abbonamenti</p>
              </div>
              {subscriptions.map((sub) => {
                const sport = SPORTS[sub.sport as Sport];
                const statusStyles: Record<string, string> = {
                  active: 'bg-white/50',
                  paused: 'bg-yellow-400/50',
                  cancelled: 'bg-white/15',
                  expired: 'bg-red-400/50',
                };
                return (
                  <Link
                    key={sub.id}
                    href={`/dashboard/athletes/${sub.athleteId}`}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 px-4 sm:px-5 py-4 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.015] transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className={`w-1.5 h-1.5 shrink-0 ${statusStyles[sub.status]}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-white/70 group-hover:text-white transition-colors">{sub.athleteName}</p>
                        <p className="text-[11px] text-white/55 mt-0.5">{sub.planName} &middot; {sport?.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-5 pl-5 sm:pl-0">
                      <div className="shrink-0">
                        <p className="text-[13px] text-white/50 tabular-nums">€{sub.amount}<span className="text-white/50 text-[10px]">/mese</span></p>
                      </div>
                      <div className="shrink-0">
                        <p className="text-[10px] text-white/60">Prossimo</p>
                        <p className="text-[11px] text-white/70 tabular-nums">{sub.nextPayment}</p>
                      </div>
                      <div className="shrink-0">
                        <span className={`text-[11px] uppercase tracking-[0.1em] px-2 py-0.5 ${
                          sub.status === 'active' ? 'text-white/50 bg-white/[0.04]' :
                          sub.status === 'paused' ? 'text-yellow-400/50 bg-yellow-400/[0.04]' :
                          'text-white/55 bg-white/[0.02]'
                        }`}>
                          {sub.status === 'active' ? 'Attivo' : sub.status === 'paused' ? 'Pausa' : 'Stop'}
                        </span>
                      </div>
                      {sub.autoRenew && <Repeat size={10} className="text-white/50 shrink-0" />}
                      <ChevronRight size={12} className="text-white/50 group-hover:text-white/60 transition-colors shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ BUSINESS INSIGHTS ═══ */}
        {activeTab === 'insights' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">Revenue Totale</p>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  €{payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)}
                </p>
                <p className="text-[11px] text-white/50 mt-1">da sempre</p>
              </div>
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">ARR Proiettato</p>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>€{MRR * 12}</p>
                <p className="text-[11px] text-white/50 mt-1">annualizzato</p>
              </div>
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">LTV Medio</p>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  €{clientRevenue.length > 0 ? Math.round(clientRevenue.reduce((s, [, d]) => s + d.total, 0) / clientRevenue.length) : 0}
                </p>
                <p className="text-[11px] text-white/50 mt-1">per cliente</p>
              </div>
              <div className="bg-[#0A0A0A] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">Retention Rate</p>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  {subscriptions.length > 0 ? Math.round((activeSubs.length / subscriptions.length) * 100) : 0}%
                </p>
                <p className="text-[11px] text-white/50 mt-1">{activeSubs.length}/{subscriptions.length} atleti</p>
              </div>
            </div>

            {/* Client Journey */}
            <div className="border border-white/[0.06]">
              <div className="px-5 py-3 border-b border-white/[0.06]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Customer Journey</p>
              </div>
              <div className="grid md:grid-cols-3 gap-px bg-white/[0.06]">
                {/* New clients */}
                <div className="bg-[#0A0A0A] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <UserPlus size={12} className="text-white/60" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Nuovi (ultimi 3 mesi)</p>
                  </div>
                  {athletes.filter((a: Athlete) => {
                    const start = new Date(a.startDate);
                    const threeMonthsAgo = new Date(2026, 1, 10);
                    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                    return start >= threeMonthsAgo;
                  }).map((a: Athlete) => (
                    <div key={a.id} className="flex items-center gap-3 py-1.5">
                      <div className="w-1 h-1 bg-white/30" />
                      <p className="text-[11px] text-white/50">{a.name} {a.surname}</p>
                      <span className="text-[11px] text-white/50">{SPORTS[a.sport].label}</span>
                    </div>
                  ))}
                </div>

                {/* Active */}
                <div className="bg-[#0A0A0A] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Users size={12} className="text-white/60" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Attivi</p>
                  </div>
                  {athletes.filter((a: Athlete) => a.status === 'active').map((a: Athlete) => (
                    <div key={a.id} className="flex items-center gap-3 py-1.5">
                      <div className="w-1 h-1 bg-white/50" />
                      <p className="text-[11px] text-white/50">{a.name} {a.surname}</p>
                      <span className="text-[11px] text-white/50">
                        {Math.floor((new Date(2026, 1, 10).getTime() - new Date(a.startDate).getTime()) / (1000 * 60 * 60 * 24))} gg
                      </span>
                    </div>
                  ))}
                </div>

                {/* Churned */}
                <div className="bg-[#0A0A0A] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <UserMinus size={12} className="text-white/60" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">In pausa / Persi</p>
                  </div>
                  {athletes.filter((a: Athlete) => a.status !== 'active').map((a: Athlete) => (
                    <div key={a.id} className="flex items-center gap-3 py-1.5">
                      <div className="w-1 h-1 bg-white/15" />
                      <p className="text-[11px] text-white/60">{a.name} {a.surname}</p>
                      <span className="text-[11px] text-white/50">{a.notes?.split('.')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Projections */}
            <div className="border border-white/[0.06] p-6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-4">Proiezioni</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: 'Con +1 cliente/mese', value: `€${(MRR + avgRevenuePerAthlete * 3) * 12}`, desc: 'ARR tra 3 mesi' },
                  { label: 'Con retention 100%', value: `€${MRR * 12}`, desc: 'ARR stabile' },
                  { label: 'Con churn attuale', value: `€${Math.round(MRR * 0.83 * 12)}`, desc: 'ARR se perdi 1/6 clienti' },
                ].map(p => (
                  <div key={p.label}>
                    <p className="text-[10px] text-white/55 mb-1">{p.label}</p>
                    <p className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{p.value}</p>
                    <p className="text-[11px] text-white/50 mt-0.5">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
