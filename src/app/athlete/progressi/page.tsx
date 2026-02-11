'use client';

import { useSession } from 'next-auth/react';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { SPORTS, Athlete } from '@/lib/types';

export default function AthleteProgressiPage() {
  const { data: session } = useSession();
  const athleteId = (session?.user as any)?.athleteId;
  const { athletes, fetchAthletes } = useStore();

  useEffect(() => { fetchAthletes(); }, [fetchAthletes]);

  const athlete = athletes.find((a: Athlete) => a.id === athleteId);

  if (!athlete) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-white/20 text-sm">Caricamento...</p></div>;
  }

  const sport = SPORTS[athlete.sport];
  const measurements = athlete.measurements;
  const lastM = measurements[measurements.length - 1];
  const firstM = measurements[0];

  // Determine sport-specific metrics
  const metricConfigs: { key: string; label: string; unit: string; lowerIsBetter?: boolean }[] = [
    { key: 'weight', label: 'Peso', unit: 'kg' },
  ];
  if (lastM.bodyFat !== undefined) metricConfigs.push({ key: 'bodyFat', label: 'Grasso corporeo', unit: '%', lowerIsBetter: true });
  if (lastM.punchPower !== undefined) metricConfigs.push({ key: 'punchPower', label: 'Punch Power', unit: 'u' });
  if (lastM.benchPress !== undefined) metricConfigs.push({ key: 'benchPress', label: 'Bench Press', unit: 'kg' });
  if (lastM.squat !== undefined) metricConfigs.push({ key: 'squat', label: 'Squat', unit: 'kg' });
  if (lastM.deadlift !== undefined) metricConfigs.push({ key: 'deadlift', label: 'Deadlift', unit: 'kg' });
  if (lastM.verticalJump !== undefined) metricConfigs.push({ key: 'verticalJump', label: 'Salto Verticale', unit: 'cm' });
  if (lastM.sprintTime !== undefined) metricConfigs.push({ key: 'sprintTime', label: 'Sprint 100m', unit: 's', lowerIsBetter: true });
  if (lastM.vo2max !== undefined) metricConfigs.push({ key: 'vo2max', label: 'VO2max', unit: 'ml/kg/min' });

  const chartData = measurements.map(m => ({
    ...m,
    date: m.date.slice(5),
  }));

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 -mt-5 sm:-mt-6 md:-mt-8">

      {/* Header */}
      <div className="relative overflow-hidden" style={{ height: '180px' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#0A0A0A]" />
        <div className="absolute bottom-6 left-6 lg:left-10 z-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-2">{sport.label}</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', lineHeight: 1, letterSpacing: '2px' }} className="text-white text-[28px] sm:text-[36px]">
            I TUOI PROGRESSI
          </h1>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-8 space-y-8">

        {/* KPI Cards */}
        <div className="grid gap-px bg-white/[0.06] grid-cols-2 sm:grid-cols-4">
          {metricConfigs.slice(0, 4).map(metric => {
            const current = (lastM as any)[metric.key];
            const first = (firstM as any)[metric.key];
            const delta = current !== undefined && first !== undefined ? +(current - first).toFixed(1) : null;
            const positive = metric.lowerIsBetter ? (delta !== null && delta < 0) : (delta !== null && delta > 0);
            return (
              <div key={metric.key} className="bg-[#0A0A0A] p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">{metric.label}</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-white/70" style={{ fontFamily: 'var(--font-heading)' }}>
                    {current}{metric.unit}
                  </p>
                  {delta !== null && delta !== 0 && (
                    <span className={`text-[10px] mb-1 flex items-center gap-0.5 ${positive ? 'text-white/40' : 'text-white/25'}`}>
                      {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {delta > 0 ? '+' : ''}{delta}{metric.unit}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional metrics if more than 4 */}
        {metricConfigs.length > 4 && (
          <div className="grid gap-px bg-white/[0.06] grid-cols-2 sm:grid-cols-4">
            {metricConfigs.slice(4).map(metric => {
              const current = (lastM as any)[metric.key];
              const first = (firstM as any)[metric.key];
              const delta = current !== undefined && first !== undefined ? +(current - first).toFixed(1) : null;
              const positive = metric.lowerIsBetter ? (delta !== null && delta < 0) : (delta !== null && delta > 0);
              return (
                <div key={metric.key} className="bg-[#0A0A0A] p-5">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">{metric.label}</p>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-white/70" style={{ fontFamily: 'var(--font-heading)' }}>
                      {current}{metric.unit}
                    </p>
                    {delta !== null && delta !== 0 && (
                      <span className={`text-[10px] mb-1 flex items-center gap-0.5 ${positive ? 'text-white/30' : 'text-white/15'}`}>
                        {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {delta > 0 ? '+' : ''}{delta}{metric.unit}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Charts */}
        {metricConfigs.map(metric => {
          const hasData = chartData.some(d => (d as any)[metric.key] !== undefined);
          if (!hasData) return null;
          return (
            <div key={metric.key} className="border border-white/[0.06]">
              <div className="px-5 py-3 border-b border-white/[0.06]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">{metric.label} nel tempo</p>
              </div>
              <div className="p-5" style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id={`grad-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 9 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.3)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey={metric.key}
                      stroke="rgba(255,255,255,0.4)"
                      fill={`url(#grad-${metric.key})`}
                      strokeWidth={1.5}
                      dot={{ r: 3, fill: '#0A0A0A', stroke: 'rgba(255,255,255,0.4)', strokeWidth: 1.5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}

        {/* Measurements table */}
        <div className="border border-white/[0.06]">
          <div className="px-5 py-3 border-b border-white/[0.06]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Storico misurazioni</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-5 py-3 text-[9px] uppercase tracking-[0.15em] text-white/30">Data</th>
                  {metricConfigs.map(m => (
                    <th key={m.key} className="text-center px-3 py-3 text-[9px] uppercase tracking-[0.15em] text-white/25">{m.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...measurements].reverse().map((m, i) => (
                  <tr key={i} className="border-b border-white/[0.02] last:border-b-0">
                    <td className="px-5 py-3 text-[11px] text-white/40">{m.date}</td>
                    {metricConfigs.map(mc => (
                      <td key={mc.key} className="px-3 py-3 text-[11px] text-white/30 text-center">
                        {(m as any)[mc.key] !== undefined ? `${(m as any)[mc.key]}${mc.unit}` : '–'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
