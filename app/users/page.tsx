  'use client';
  import useLanguage from '@/lib/useLanguage';
  import { translations } from '@/lib/translations';
  import { useEffect, useState, useCallback } from 'react';
  import AdminLayout from '@/components/layout/AdminLayout';
  import Pagination from '@/components/ui/Pagination';
  import { listUsers, blockUnblockUser } from '@/lib/api';
  import { Search, MoreHorizontal, ShieldOff, Shield, ChevronDown } from 'lucide-react';

  interface User {
    _id?: string;
    id?: string;

    full_name?: string;

    first_name?: string;
    last_name?: string;

    email?: string;

    phone?: string;
    contact_number?: string;

    gender?: string;

    orientation?: string;
    sexual_orientation?: string;

    subscription?: string;
    subscription_status?: string;

    created_at?: string;
    registration_date?: string;

    matches?: number;
    total_matches?: number;

    status?: string;

    is_blocked?: boolean;
  }

  export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');

    const [gender, setGender] = useState('all');
    const [status, setStatus] = useState('all');
    const [personaType, setPersonaType] = useState('all');

    const [genderOpen, setGenderOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionMenuId, setActionMenuId] = useState<string | null>(null);
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations];

    // useEffect(() => {
    //   setGender(t.allGenders);
    //   setStatus(t.allAccounts);
    //   setPersonaType(t.allTypes);
    // }, [language]);

    const GENDER_OPTIONS = [
      { label: t.allGenders, value: 'all' },
      { label: t.man, value: 'Man' },
      { label: t.woman, value: 'Woman' },
      { label: t.beyondBinary, value: 'Beyond Binary' },
    ];
    const STATUS_OPTIONS = [
      { label: t.allAccounts, value: 'all' },
      { label: t.active, value: 'active' },
      { label: t.blocked, value: 'blocked' },
    ];
    const TYPE_OPTIONS = [
      { label: t.allTypes, value: 'all' },
      { label: t.stableIndividuals, value: 'stable-individuals' },
      { label: t.sensoryOriented, value: 'sensory-oriented' },
      { label: t.newExplorers, value: 'new-explorers' }
    ];

    const fetchUsers = useCallback(async () => {
      setLoading(true);
      try {
        const params: Record<string, unknown> = { page, page_size: pageSize };
        if (search) params.search = search;
        // if (gender !== 'All Genders') params.gender = gender;
        
        // if (status !== 'All Accounts') params.status = status;
        // if (personaType !== 'All Types') params.persona_type = personaType;

        if (gender !== 'all') {
          params.gender = gender;
        }

        if (status !== 'all') {
          params.status = status;
        }

        if (personaType !== 'all') {
          params.persona_type = personaType;
        }


        const res = await listUsers(params as Parameters<typeof listUsers>[0]);
        const data = res.data?.data || res.data || {};
        const userList = data?.results || [];
        setUsers(Array.isArray(userList) ? userList : []);
        setTotal(
          data?.count ??
          data?.total ??
          userList.length ??
          0
        );
      } catch (e) {
        console.error(e);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, [page, pageSize, search, gender, status, personaType]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleBlock = async (userId: string, shouldBlock: boolean) => {
      try {
        await blockUnblockUser(userId, shouldBlock);
        fetchUsers();
      } catch (e) { console.error(e); }
      setActionMenuId(null);
    };

    const formatDate = (d?: string) => {
      if (!d) return '—';
      return new Date(d).toLocaleDateString('en-GB').replace(/\//g, '-');
    };

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
      <AdminLayout>
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{t.usersManagement}</h1>
            <p style={{ fontSize: '14px', color: 'var(--muted)' }}>{t.manageUsers}</p>
          </div>

          {/* Filters */}
          <div style={{ marginBottom: '16px' }}>
            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '12px', maxWidth: '300px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input
                className="seeu-input"
                placeholder={t.searchUsers}
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{ paddingLeft: '36px' }}
              />
            </div>

            {/* Filter row */}
            <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                }}
              >

              {/* Gender */}
              <div>
                <p style={{
                  fontSize: '11px',
                  color: 'var(--muted)',
                  marginBottom: '6px'
                }}>
                  {t.gender}
                </p>

                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setGenderOpen(!genderOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      color: 'var(--text)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      minWidth: '160px',
                      justifyContent: 'space-between',
                    }}
                  >
                    {
                      GENDER_OPTIONS.find(g => g.value === gender)?.label
                    } <ChevronDown size={13} />
                  </button>

                  {genderOpen && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: '100%',
                      marginTop: '4px',
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      zIndex: 50,
                      minWidth: '100%',
                    }}>
                      {GENDER_OPTIONS.map(g => (
                        <div
                          key={g.value}
                          onClick={() => {
                            setGender(g.value);
                            setGenderOpen(false);
                            setPage(1);
                          }}
                          style={{
                            padding: '9px 14px',
                            fontSize: '13px',
                            cursor: 'pointer',
                            color: gender === g.value ? 'var(--pink)' : 'var(--text)',
                            background: gender === g.value
                              ? 'rgba(232,69,106,0.08)'
                              : 'transparent',
                          }}
                        >
                          {g.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* User Type */}
              <div>
                <p style={{
                  fontSize: '11px',
                  color: 'var(--muted)',
                  marginBottom: '6px'
                }}>
                  {t.personaType}
                </p>

                <select
                  value={personaType}
                  onChange={e => {
                    setPersonaType(e.target.value);
                    setPage(1);
                  }}
                  className="seeu-input"
                  style={{ width: '100%' }}
                >
                  {TYPE_OPTIONS.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Status */}
              <div>
                <p style={{
                  fontSize: '11px',
                  color: 'var(--muted)',
                  marginBottom: '6px'
                }}>
                  {t.status}
                </p>

                <select
                  value={status}
                  onChange={e => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="seeu-input"
                  style={{ width: '100%' }}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <p style={{
                  fontSize: '11px',
                  color: 'var(--muted)',
                  marginBottom: '6px'
                }}>
                  Date From
                </p>

                <input
                  type="date"
                  className="seeu-input"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Date To */}
              <div>
                <p style={{
                  fontSize: '11px',
                  color: 'var(--muted)',
                  marginBottom: '6px'
                }}>
                  Date To
                </p>

                <input
                  type="date"
                  className="seeu-input"
                  style={{ width: '100%' }}
                />
              </div>

            </div>
          </div>

          {/* Table */}
          <div className="seeu-card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{t.name}</th>
                    <th>{t.email}</th>
                    <th>{t.phone}</th>
                    <th>{t.gender}</th>
                    <th>{t.orientation}</th>
                    <th>{t.subscription}</th>
                    <th>{t.registrationDate}</th>
                    <th>{t.matches}</th>
                    <th>{t.actions}</th>
                  </tr> 
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>{t.loading}</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>{t.noUsers}</td></tr>
                  ) : (
                    users.map((user, idx) => {
                      const uid = user._id || user.id || String(idx);
                      // const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || '—';
                      const name = user.full_name || '—';
                      return (
                        <tr key={uid}>
                          <td style={{ color: 'var(--muted)' }}>{(page - 1) * pageSize + idx + 1}</td>
                          <td style={{ fontWeight: '500', color: '#fff' }}>{name}</td>
                          <td style={{ color: 'var(--muted)', fontSize: '13px' }}>{user.email || '—'}</td>
                          <td style={{ color: 'var(--muted)', fontSize: '13px' }}>{user.phone || '—'}</td>
                          <td>{user.gender || '—'}</td>
                          <td>{user.orientation || '—'}</td>
                          <td>
                            {user.subscription ? (
                              <span className="badge-active">
                                {user.subscription}
                              </span>
                            ) : '—'}
                          </td>
                          <td style={{ color: 'var(--muted)', fontSize: '13px' }}>
                            {formatDate(user.created_at || user.registration_date)}
                          </td>
                          <td>
                            <span style={{ color: 'var(--pink)', fontWeight: '600' }}>
                              {user.matches ?? 0}
                            </span>
                          </td>
                          <td style={{ position: 'relative' }}>
                            <button
                              onClick={() => setActionMenuId(actionMenuId === uid ? null : uid)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px' }}
                            >
                              <MoreHorizontal size={16} />
                            </button>
                            {actionMenuId === uid && (
                              <div style={{
                                position: 'absolute', right: '8px', top: '100%',
                                background: 'var(--card)', border: '1px solid var(--border)',
                                borderRadius: '8px', zIndex: 50, minWidth: '140px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                              }}>
                                <div
                                  onClick={() => handleBlock(uid, !user.is_blocked)}
                                  style={{
                                    padding: '10px 14px', fontSize: '13px', cursor: 'pointer',
                                    color: user.is_blocked ? '#22c55e' : '#ef4444',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                  {user.is_blocked ? <Shield size={14} /> : <ShieldOff size={14} />}
                                  {user.is_blocked ? t.unblockUser : t.blockUser}
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
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              total={total}
            />
          </div>
        </div>
      </AdminLayout>
    );
  }
