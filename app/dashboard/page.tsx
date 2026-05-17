'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

import useLanguage from '@/lib/useLanguage';
import { translations } from '@/lib/translations';

// import { getDashboardMetrics, getRevenueOverview } from '@/lib/api';
import { getDashboardMetrics } from '@/lib/api';
import { Users, UserX, UserPlus, DollarSign, CreditCard, ChevronDown } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const METRIC_FILTERS = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

export default function DashboardPage() {
  const [filter, setFilter] = useState('yearly');
  const [filterOpen, setFilterOpen] = useState(false);
  const [metrics, setMetrics] = useState<Record<string, unknown>>({});
  const [revenueData, setRevenueData] = useState<unknown[]>([]);
  const [genderData, setGenderData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // const [mRes, rRes] = await Promise.all([
        //   getDashboardMetrics(filter),
        //   getRevenueOverview(filter),
        // ]);

        const mRes = await getDashboardMetrics(filter);
        const mData = mRes.data?.data || mRes.data || {};
        console.log('FILTER:', filter);
        console.log('METRICS:', mData);
        // console.log('REVENUE:', rRes.data);
        setMetrics(mData);

        // Revenue chart data
        // const rData = rRes.data?.data || rRes.data || {};
        // const chartArr =
        // rData?.revenue_summary ||
        // rData?.revenue_data ||
        // rData?.data ||
        // [];
        // setRevenueData(Array.isArray(chartArr) ? chartArr : []);

        setRevenueData(mData?.revenue_summary || []);

        // // Gender distribution
        // const gData = mData?.gender_distribution || [];
        // if (Array.isArray(gData) && gData.length > 0) {
        //   setGenderData(gData);
        // } else {
        //   // Fallback sample
        //   setGenderData([
        //     { name: 'Male', value: 67, color: '#e8456a' },
        //     { name: 'Female', value: 28, color: '#f472b6' },
        //     { name: 'Other', value: 5, color: '#6b6890' },
        //   ]);
        // }

        // Gender distribution
        const gData = mData?.gender_distribution || {};

        if (gData && typeof gData === 'object') {
          // const total = gData.total || 1;
          const total = gData.total ?? 0;
          if (total === 0) {
            setGenderData([
              { name: 'Male', value: 0, color: '#e8456a' },
              { name: 'Female', value: 0, color: '#f472b6' },
              { name: 'Other', value: 0, color: '#6b6890' },
            ]);
            return;
          }

          const formattedGenderData = [
            {
              name: 'Male',
              value: Number(((gData.male?.count || 0) / total * 100).toFixed(2)),
              color: '#e8456a',
            },
            {
              name: 'Female',
              value: Number(((gData.female?.count || 0) / total * 100).toFixed(2)),
              color: '#f472b6',
            },
            {
              name: 'Other',
              value: Number(((gData.other?.count || 0) / total * 100).toFixed(2)),
              color: '#6b6890',
            },
          ];

          setGenderData(formattedGenderData);
        } else {
          setGenderData([
            { name: 'Male', value: 67.06, color: '#e8456a' },
            { name: 'Female', value: 28.24, color: '#f472b6' },
            { name: 'Other', value: 4.71, color: '#6b6890' },
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  const statCards = [
    {
      label: t.totalUsers,
      value: metrics?.total_users ?? metrics?.total_registered_users ?? '—',
      icon: Users, color: '#e8456a',
    },
    {
      label: t.blockedUsers,
      value: metrics?.blocked_users ?? '—',
      icon: UserX, color: '#ef4444',
    },
    {
      label: t.newUsers,
      value: metrics?.new_users ?? '—',
      icon: UserPlus, color: '#a78bfa',
    },
    {
      label: t.totalRevenueGenerated,
      value:
        metrics?.total_revenue !== undefined
          ? `$${Number(metrics.total_revenue).toLocaleString()}`
          : metrics?.revenue !== undefined
          ? `$${Number(metrics.revenue).toLocaleString()}`
          : '$0',
      icon: DollarSign, color: '#22c55e',
    },
    {
      label: t.activeSubscriptions,
      value: metrics?.active_subscriptions ?? metrics?.subscriptions ?? '—',
      icon: CreditCard, color: '#f07f3c',
    },
  ];

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{t.dashboard}</h1>
            <p style={{ fontSize: '14px', color: 'var(--muted)' }}>{t.welcome}</p>
          </div>

          {/* Filter dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '8px 14px',
                color: 'var(--text)', fontSize: '13px', cursor: 'pointer',
              }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              <ChevronDown size={14} />
            </button>
            {filterOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '100%', marginTop: '4px',
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: '8px', overflow: 'hidden', zIndex: 50, minWidth: '120px',
              }}>
                {METRIC_FILTERS.map(f => (
                  <div
                    key={f}
                    onClick={() => { setFilter(f.toLowerCase()); setFilterOpen(false); }}
                    style={{
                      padding: '9px 16px', fontSize: '13px', cursor: 'pointer',
                      color: filter === f.toLowerCase() ? 'var(--pink)' : 'var(--text)',
                      background: filter === f.toLowerCase() ? 'rgba(232,69,106,0.08)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (filter !== f.toLowerCase()) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (filter !== f.toLowerCase()) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {f}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stat cards */}
        <div style={{display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '24px', }}
          >
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="seeu-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>{label}</p>
                  <p style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>
                    {loading ? '—' : String(value)}
                  </p>
                </div>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} style={{ color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '16px',
            }}
          >
          {/* Revenue chart */}
          <div className="seeu-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>Revenue Summary</h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '20px' }}>(from premium subscriptions)</p>
            <ResponsiveContainer width="100%" height={260}>
              {/* <AreaChart data={revenueData.length > 0 ? revenueData : SAMPLE_REVENUE}> */}
              {/* <AreaChart data={revenueData}> */}
             {revenueData.length > 0 ? (
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e8456a" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#e8456a" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#ffffff08"
                    horizontal={false}
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#6b6890', fontSize: 11 }}
                    axisLine={{ stroke: '#8a84b3', strokeWidth: 1 }}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[0, 40000]}
                    ticks={[0, 10000, 20000, 30000, 40000]}
                    tick={{ fill: '#6b6890', fontSize: 11 }}
                    axisLine={{ stroke: '#8a84b3', strokeWidth: 1 }}
                    tickLine={false}
                    tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `$${Number(value).toLocaleString(undefined, {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}`,
                      'Revenue',
                    ]}
                    contentStyle={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: 'var(--text)' }}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#e8456a"
                    strokeWidth={1.5}
                    fill="url(#revGrad)"
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              ) : (
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b6890',
                    fontSize: '14px',
                  }}
                >
                </div>
              )}
            </ResponsiveContainer>
          </div>

          {/* Gender pie */}
          <div className="seeu-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '20px' }}>
              Gender Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                  {(genderData as Array<{color?: string}>).map((entry, index) => (
                    <Cell key={index} fill={entry.color || GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '12px' }}>
              {(genderData as Array<{name: string; value: number; color?: string}>).map((g, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--muted)' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: g.color || GENDER_COLORS[i % GENDER_COLORS.length] }} />
                  {g.name}: {g.value}%
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

const GENDER_COLORS = ['#e8456a', '#f472b6', '#6b6890'];

const SAMPLE_REVENUE = [
  { label: '2020', revenue: 0 },
  { label: '2021', revenue: 800 },
  { label: '2022', revenue: 2400 },
  { label: '2023', revenue: 5200 },
  { label: '2024', revenue: 12000 },
  { label: '2025', revenue: 28000 },
  { label: '2026', revenue: 41000 },
];
