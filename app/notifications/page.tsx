'use client';
import useLanguage from '@/lib/useLanguage';
import { translations } from '@/lib/translations';
import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Pagination from '@/components/ui/Pagination';
import { getAdminNotifications, sendNotification, scheduleNotification } from '@/lib/api';
import { X, Send, Clock, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';



interface Notification {
  _id?: string;
  id?: string;
  created_at?: string;
  scheduled_at?: string;
  date_time?: string;
  persona_type?: string;
  user_name?: string;
  username?: string;
  to?: string;
  email?: string;
  message?: string;
  msg_type?: string;
  status?: string;
}



const PERSONA_TYPES = ['Stable Individuals', 'Sensory-Oriented Individuals', 'New Explorers'];
const MSG_TYPES = ['Welcome', 'Take subscription to start chat', 'Custom'];

export default function NotificationsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'sent' | 'scheduled'>('sent');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  


  const pageSize = 10;

  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminNotifications(tab === 'sent' ? 'sent' : 'scheduled', page, pageSize);
      const data = res.data?.data || res.data || {};
      const list = data?.notifications || data?.data || data || [];
      setNotifications(Array.isArray(list) ? list : []);
      setTotal(data?.total || (Array.isArray(list) ? list.length : 0));
    } catch (e) {
      console.error(e);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);





  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '—';

    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      })
      .replace('am', 'AM')
      .replace('pm', 'PM');

  };

  const getPersonaClass = (type?: string) => {
    if (!type) return 'persona-tag persona-stable';
    const t = type.toLowerCase();
    if (t.includes('stable')) return 'persona-tag persona-stable';
    if (t.includes('sensory')) return 'persona-tag persona-sensory';
    return 'persona-tag persona-explorer';
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const tabBtnStyle = (active: boolean) => ({
    padding: '8px 20px', borderRadius: '8px', border: 'none',
    cursor: 'pointer', fontSize: '13px', fontWeight: '500',
    background: active ? 'var(--gradient)' : 'transparent',
    color: active ? '#fff' : 'var(--muted)',
  });

  return (
    <AdminLayout>
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{t.notifications}</h1>
          <p style={{ fontSize: '14px', color: 'var(--muted)' }}>{t.notificationsSubtitle}</p>
        </div>

        {/* Top action bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* LEFT FILTER TABS */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              background: 'var(--surface)',
              padding: '4px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
            }}
          >
            <button
              onClick={() => {
                setTab('sent');
                setPage(1);
              }}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                background: tab === 'sent' ? 'var(--gradient)' : 'transparent',
                color: tab === 'sent' ? '#fff' : 'var(--muted)',
              }}
            >
              {t.sendNotification}
            </button>

            <button
              onClick={() => {
                setTab('scheduled');
                setPage(1);
              }}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                background: tab === 'scheduled' ? 'var(--gradient)' : 'transparent',
                color: tab === 'scheduled' ? '#fff' : 'var(--muted)',
              }}
            >
              {t.scheduleNotification}
            </button>
          </div>

          {/* RIGHT ACTION BUTTON */}

          <button
            className="gradient-btn"
            onClick={() => {
              if (tab === 'sent') {
                router.push('/notifications/send');
              } else {
                router.push('/notifications/schedule');
              }
            }}
            style={{
              padding: '10px 26px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            {tab === 'sent' ? t.sendNotification : t.schedule}
          </button>
        </div>

        {/* Table */}
        <div className="seeu-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t.dateTime}</th>
                  <th>{t.personaType}</th>
                  <th>{t.userName}</th>
                  <th>{t.to}</th>
                  <th>{t.message}</th>
                  <th>{t.status}</th>
                  <th>{t.action}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>{t.loading}</td></tr>
                ) : notifications.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>{t.noNotifications}</td></tr>
                ) : (
                  notifications.map((n, idx) => (
                    <tr key={n._id || n.id || String(idx)}>
                      <td style={{ color: 'var(--muted)' }}>{(page - 1) * pageSize + idx + 1}</td>
                      <td style={{ fontSize: '13px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                        {formatDateTime(n.created_at || n.scheduled_at || n.date_time)}
                      </td>
                      <td>
                        {n.persona_type && (
                          <span className={getPersonaClass(n.persona_type)}>{n.persona_type}</span>
                        )}
                      </td>
                      <td style={{ fontWeight: '500' }}>{n.user_name || n.username || '—'}</td>
                      <td style={{ fontSize: '13px', color: 'var(--muted)' }}>{n.to || n.email || '—'}</td>
                      <td style={{ fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {(n as any).title || n.message || n.msg_type || '—'}
                      </td>
                      <td>
                        <span className={n.status === 'sent' ? 'badge-sent' : 'badge-scheduled'}>
                          {n.status || (tab === 'sent' ? t.sent : t.scheduled)}
                        </span>
                      </td>
                      <td>
                        {/* <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '18px' }}> */}
                        <button
                          onClick={() => setSelectedNotification(n)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--muted)',
                            fontSize: '18px',
                          }}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              total={total}
              pageSize={pageSize}
              onPageSizeChange={() => {}}
            />
        </div>
      </div>

      {selectedNotification && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedNotification(null)}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '760px',
              background: '#1b1235',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '22px',
            }}
          >
            {/* HEADER */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '22px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Clock size={18} color="#8b5cf6" />

                <h2
                  style={{
                    color: '#fff',
                    fontSize: '20px',
                    fontWeight: '700',
                  }}
                >
                  {tab === 'scheduled'
                    ? 'Scheduled Notification Details'
                    : 'Notification Details'}
                </h2>
              </div>

              <button
                onClick={() => setSelectedNotification(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* ADD INFO */}
            <div
              className="seeu-card"
              style={{
                padding: '20px',
                marginBottom: '18px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '18px',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '16px',
                }}
              >
                <Send size={18} color="#f59e0b" />
                {tab === 'scheduled' ? 'Basic Information' : 'Basic Information'}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '20px',
                }}
              >
                <div>
                  <div style={{ color: 'var(--muted)', marginBottom: '6px' }}>
                    {tab === 'scheduled' ? 'Schedule ID' : 'Notification ID'}
                  </div>

                  <div style={{ color: '#fff', fontWeight: '600' }}>
                    #{selectedNotification._id || selectedNotification.id || '—'}       
                  </div>
                </div>

                <div>
                  <div style={{ color: 'var(--muted)', marginBottom: '6px' }}>
                    Created Date & Time
                  </div>

                  <div style={{ color: '#fff', fontWeight: '600' }}>
                    {formatDateTime(selectedNotification.created_at)}
                  </div>
                </div>

                {tab === 'scheduled' && (
                  <div>
                    <div style={{ color: 'var(--muted)', marginBottom: '6px' }}>
                      Scheduled Time
                    </div>

                    <div style={{ color: '#fff', fontWeight: '600' }}>
                      {formatDateTime(
                        (selectedNotification as any).scheduled_time ||
                        selectedNotification.scheduled_at ||
                        selectedNotification.date_time
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RECIPIENTS */}
            <div
              className="seeu-card"
              style={{
                padding: '20px',
                marginBottom: '18px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '18px',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '18px',
                }}
              >
                <Eye size={18} color="#f59e0b" />
                Recipients
              </div>

              <div style={{ marginBottom: '18px' }}>
                <div style={{ color: 'var(--muted)', marginBottom: '8px' }}>
                  Target User Type
                </div>

                <span className={getPersonaClass(selectedNotification.persona_type)}>
                  {selectedNotification.persona_type}
                </span>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <div style={{ color: 'var(--muted)', marginBottom: '6px' }}>
                  User Name
                </div>

                <div style={{ color: '#fff', fontWeight: '600' }}>
                  {selectedNotification.user_name ||
                    selectedNotification.username ||
                    '—'}
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <div style={{ color: 'var(--muted)', marginBottom: '6px' }}>
                  Delivery Target
                </div>

                <div style={{ color: '#fff', fontWeight: '600' }}>
                  {selectedNotification.email ||
                    selectedNotification.to ||
                    '—'}
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--muted)', marginBottom: '6px' }}>
                  User ID
                </div>

                <div style={{ color: '#fff', fontWeight: '600' }}>
                  {(selectedNotification as any).user_id || '—'}
                </div>
              </div>
            </div>

            {/* MESSAGE */}
            <div
              className="seeu-card"
              style={{
                padding: '20px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '18px',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '18px',
                }}
              >
                <Send size={18} color="#f59e0b" />
                Message Content
              </div>

              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '14px',
                  color: '#fff',
                }}
              >
                {(selectedNotification as any).title ||
                  selectedNotification.message ||
                  selectedNotification.msg_type ||
                  '—'}
              </div>


              {tab !== 'scheduled' && (
                <div
                  className="seeu-card"
                  style={{
                    padding: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '18px',
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: '18px',
                    }}
                  >
                    <Clock size={18} color="#f59e0b" />
                    Status
                  </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '20px',
                      }}
                    >
                      <div>
                        <div style={{ color: 'var(--muted)', marginBottom: '6px' }}>
                          Delivery Status
                        </div>

                        <span className="badge-active">
                          Sent Successfully
                        </span>
                      </div>

                      <div>
                        <div style={{ color: 'var(--muted)', marginBottom: '6px' }}>
                          Notification Type
                        </div>

                        <div style={{ color: '#fff', fontWeight: '600' }}>
                          Push Notification
                        </div>
                      </div>

                      <div>
                        <div style={{ color: 'var(--muted)', marginBottom: '6px' }}>
                          Priority
                        </div>

                        <div style={{ color: '#fff', fontWeight: '600' }}>
                          Normal
                        </div>
                      </div>
                    </div>
                </div>
              )}


            </div>

            {/* FOOTER */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                className="gradient-btn"
                onClick={() => setSelectedNotification(null)}
                style={{
                  padding: '10px 30px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}



    </AdminLayout>
  );
}
