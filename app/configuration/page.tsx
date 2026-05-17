'use client';

import useLanguage from '@/lib/useLanguage';
import { translations } from '@/lib/translations';
import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Pagination from '@/components/ui/Pagination';
import { toggleSubscriptionStatus } from '@/lib/api';
import axios from 'axios';
import { Search, MoreHorizontal } from 'lucide-react';
import api from '@/lib/api';

type TabType = 'basic' | 'chat' | 'micro';

interface Plan {
  _id?: string;
  id?: string;
  plan_name?: string;
  name?: string;
  plan_price?: number;
  price?: number;
  plan_duration?: string;
  interval?: string;
  plan_feature?: string[];
  features?: string[];
  plan_description?: string;
  description?: string;
  status?: string;
  is_active?: boolean;
  trial_days?: number;
  credits?: number;
  validity_days?: number;
  type?: string;
  quantity?: number;
}

export default function ConfigurationPage() {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);


  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

const fetchPlans = useCallback(async () => {
  setLoading(true);

  try {
    const planTypeMap: Record<TabType, string> = {
      basic: 'basic',
      chat: 'chat',
      micro: 'micro',
    };

    const res = await axios.get(
      'https://integ-stripe-svc-dev.prometteur.in/stripe/subscription-plans',
      {
        params: {
          planType: planTypeMap[activeTab],
        },

        headers: {
          apikey: 'IntegrationsServiceAPIKey123',
          apisecrete: 'IntegrationsServiceAPISecrete123',
        },
      }
    );

    const items = res.data?.data?.items || [];

    const formattedPlans = items.map((item: any) => ({
      id: item.planId,

      plan_name: item.product?.name,

      plan_description: item.product?.description,

      plan_price: item.price?.unitAmount
        ? item.price.unitAmount / 100
        : 0,

      plan_duration:
        item.price?.recurring?.interval || '—',

      trial_days: item.defaultTrialDays,

      status: item.active ? 'active' : 'inactive',

      is_active: item.active,
    }));

    setPlans(formattedPlans);

  } catch (e) {
    console.error(e);
    setPlans([]);
  } finally {
    setLoading(false);
  }
}, [activeTab]);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const handleToggleStatus = async (planId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await toggleSubscriptionStatus(planId, newStatus as 'active' | 'inactive');
      fetchPlans();
    } catch (e) { console.error(e); }
    setActionMenuId(null);
  };



  const filteredPlans = plans.filter(p => {
    const name = (p.plan_name || p.name || '').toLowerCase();
    return name.includes(search.toLowerCase());
  });
  const totalPages = Math.max(1, Math.ceil(filteredPlans.length / pageSize));
  const pagedPlans = filteredPlans.slice((page - 1) * pageSize, page * pageSize);

  const tabStyle = (tab: TabType) => ({
    padding: '8px 20px', borderRadius: '8px', border: 'none',
    cursor: 'pointer', fontSize: '14px', fontWeight: '500',
    background: activeTab === tab ? 'var(--gradient)' : 'transparent',
    color: activeTab === tab ? '#fff' : 'var(--muted)',
    transition: 'all 0.15s',
  });

  return (
    <AdminLayout>
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{t.configurationPricing}</h1>
          <p style={{ fontSize: '14px', color: 'var(--muted)' }}>{t.managePricing}</p>
        </div>

        {/* Tabs + Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '4px',
              background: 'var(--surface)',
              borderRadius: '10px',
              padding: '4px',
              width: 'fit-content',
              minWidth: '320px',
            }}
          >
            {(['basic', 'chat', 'micro'] as TabType[]).map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} style={tabStyle(tab) as React.CSSProperties}>
                {tab === 'basic' ? 'Basic Plan' : tab === 'chat' ? 'Chat Plan' : 'Micro Plan'}
              </button>
            ))}
          </div>

          <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: 1,
                  justifyContent: 'flex-end',
                  minWidth: '250px',
                }}
              >
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input
                className="seeu-input"
                placeholder={t.searchPlan}
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{ paddingLeft: '32px', width: '100%',}}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="seeu-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            {activeTab === 'basic' && (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Plan Name</th>
                    <th>Price</th>
                    <th>Interval</th>
                    <th>Trial Days</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>{t.loading}</td></tr>
                  ) : pagedPlans.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>{t.noPlans}</td></tr>
                  ) : (
                    pagedPlans.map((plan, idx) => {
                      const pid = plan._id || plan.id || String(idx);
                      const isActive = plan.status === 'active' || plan.is_active;
                      return (
                        <tr key={pid}>
                          <td style={{ color: 'var(--muted)' }}>{(page - 1) * pageSize + idx + 1}</td>
                          <td style={{ fontWeight: '500', color: '#fff' }}>{plan.plan_name || plan.name || '—'}</td>
                          <td>EUR {plan.plan_price ?? plan.price ?? '—'}</td>
                          <td>{plan.plan_duration || plan.interval || '—'}</td>
                          <td>{plan.trial_days ? `${plan.trial_days} trial days` : 'No trial'}</td>
                          <td><span className={isActive ? 'badge-active' : 'badge-inactive'}>{isActive ? 'active' : 'inactive'}</span></td>
                          <td style={{ position: 'relative' }}>
                            <button
                              onClick={() => setActionMenuId(actionMenuId === pid ? null : pid)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}
                            >
                              <MoreHorizontal size={16} />
                            </button>
                            {actionMenuId === pid && (
                              <div style={{
                                position: 'absolute', right: '8px', top: '100%',
                                background: 'var(--card)', border: '1px solid var(--border)',
                                borderRadius: '8px', zIndex: 50, minWidth: '150px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                              }}>
                                <div
                                  onClick={() => handleToggleStatus(pid, isActive ? 'active' : 'inactive')}
                                  style={{ padding: '10px 14px', fontSize: '13px', cursor: 'pointer', color: 'var(--text)' }}
                                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                  {isActive ? 'Deactivate' : 'Activate'} Plan
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'chat' && (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Plan Name</th>
                    <th>Credits</th>
                    <th>Price</th>
                    <th>Validity (Days)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>Loading...</td></tr>
                  ) : pagedPlans.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>No chat plans found</td></tr>
                  ) : (
                    pagedPlans.map((plan, idx) => {
                      const pid = plan._id || plan.id || String(idx);
                      const isActive = plan.status === 'active' || plan.is_active;
                      return (
                        <tr key={pid}>
                          <td style={{ color: 'var(--muted)' }}>{(page - 1) * pageSize + idx + 1}</td>
                          <td style={{ fontWeight: '500', color: '#fff' }}>{plan.plan_name || plan.name || '—'}</td>
                          <td>{plan.credits ?? 'N/A'}</td>
                          <td>EUR {plan.plan_price ?? plan.price ?? '—'}</td>
                          <td>{plan.validity_days ? `${plan.validity_days} days` : '—'}</td>
                          <td><span className={isActive ? 'badge-active' : 'badge-inactive'}>{isActive ? 'active' : 'inactive'}</span></td>
                          <td>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                              <MoreHorizontal size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'micro' && (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Plan Name</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>Loading...</td></tr>
                  ) : pagedPlans.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>No micro plans found</td></tr>
                  ) : (
                    pagedPlans.map((plan, idx) => {
                      const pid = plan._id || plan.id || String(idx);
                      const isActive = plan.status === 'active' || plan.is_active;
                      return (
                        <tr key={pid}>
                          <td style={{ color: 'var(--muted)' }}>{(page - 1) * pageSize + idx + 1}</td>
                          <td style={{ fontWeight: '500', color: '#fff' }}>{plan.plan_name || plan.name || '—'}</td>
                          <td>{plan.type || 'micro'}</td>
                          <td>{plan.quantity ?? 1}</td>
                          <td style={{ fontSize: '13px', color: 'var(--muted)', maxWidth: '200px' }}>{plan.plan_description || plan.description || '—'}</td>
                          <td>EUR {plan.plan_price ?? plan.price ?? '—'}</td>
                          <td><span className={isActive ? 'badge-active' : 'badge-inactive'}>{isActive ? 'active' : 'inactive'}</span></td>
                          <td>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                              <MoreHorizontal size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            total={filteredPlans.length}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
