'use client';

import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

const PERSONAS = [
  { label: 'STABLE INDIVIDUALS', value: 'stable individuals' },
  { label: 'SENSORY-ORIENTED INDIVIDUALS', value: 'sensory-oriented individuals' },
  { label: 'NEW EXPLORERS', value: 'new explorers' },
  { label: 'EPICUREANS / VERY GOOD LIFE ENJOYERS', value: 'epicureans' },
  { label: 'MODERATES', value: 'moderates' },
];

const MESSAGE_TYPES = [
  { label: 'Welcome Message', value: 'welcome_msg' },
  { label: 'Update Notice', value: 'update_notice' },
  { label: 'Promotion', value: 'promotion' },
];

export default function ScheduleNotificationPage() {
  const router = useRouter();
  const [persona_type, setPersonaType] = useState(PERSONAS[0]);
  const [msg_type, setMsgType] = useState(MESSAGE_TYPES[0]);
  const [search, setSearch] = useState('');
  const [scheduled_date, setScheduledDate] = useState('');
  const [schedule_time, setScheduleTime] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [personaOpen, setPersonaOpen] = useState(false);
  const [msgTypeOpen, setMsgTypeOpen] = useState(false);
  const searchTimerRef = useRef<any>(null);

//   const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '');

//   const handleAuthError = () => {
//     localStorage.removeItem('token');
//     router.push('/login');
//   };


    const searchUsers = async (value: string) => {
    setSearch(value);

    if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
    }

    if (!value.trim()) {
        setUsers([]);
        return;
    }

    searchTimerRef.current = setTimeout(async () => {
        try {
        const res = await api.get(
            `/admin/users?search=${encodeURIComponent(value)}&page_size=10`
        );

        setUsers(res.data?.data?.results || []);
        } catch (err) {
        console.error(err);
        setUsers([]);
        }
    }, 300);
    };



    const handleSchedule = async () => {
    try {
        setLoading(true);

        const scheduleDateTime =
        scheduled_date && schedule_time
            ? new Date(
                `${scheduled_date}T${schedule_time}:00`
            ).toISOString()
            : '';

        await api.post(
        '/admin/schedule-notification',
        {
            persona_type: persona_type.value,
            msg_type: msg_type.value,
            message: '',
            scheduled_date,
            schedule_time: scheduleDateTime,
            search,
        }
        );

        alert('Notification scheduled successfully');
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };


    useEffect(() => {
    const handler = (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        if (!target.closest('.sp-dd-wrap')) {
        setPersonaOpen(false);
        setMsgTypeOpen(false);
        }
    };

    document.addEventListener('click', handler);

    return () => {
        document.removeEventListener('click', handler);
    };
    }, []);

  return (
    <AdminLayout>
      <style>{`
        .sp-page {
          padding: 32px 40px;
          min-height: 100vh;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .sp-inner { width: 100%; max-width: 780px; }
        .sp-header {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 24px;
        }
        .sp-title { font-size: 22px; font-weight: 600; color: #fff; margin: 0; }
        .sp-back {
          display: flex; align-items: center; gap: 6px;
          color: #e05c7a; font-size: 14px; cursor: pointer;
          background: none; border: none; padding: 0;
        }
        .sp-card {
          background: #1e1535; border-radius: 16px; padding: 28px 32px 32px;
        }
        .sp-card-title {
          display: flex; align-items: center; gap: 10px;
          font-size: 16px; font-weight: 600; color: #fff;
          padding-bottom: 18px; border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 24px;
        }
        .sp-section-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 18px;
        }
        /* Date/Time row */
        .sp-date-row {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 16px; margin-bottom: 16px;
        }
        .sp-field-label {
          font-size: 12px; color: rgba(255,255,255,0.5);
          margin-bottom: 6px; font-weight: 500;
        }
        .sp-date-input, .sp-time-input {
          background: #13102a; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: #fff; font-size: 14px;
          padding: 11px 14px; width: 100%; box-sizing: border-box;
          outline: none;
        }
        .sp-date-input::-webkit-calendar-picker-indicator,
        .sp-time-input::-webkit-calendar-picker-indicator {
          filter: invert(1) opacity(0.4); cursor: pointer;
        }
        .sp-date-input:focus, .sp-time-input:focus {
          border-color: rgba(124,92,191,0.6);
        }
        /* Custom dropdown */
        .sp-dd-wrap {
            position: relative;
            margin-bottom: 4px;
            z-index: 50;
            }

        .sp-dd-wrap.open {
            z-index: 999;
            }
        .sp-dd-trigger {
          background: #13102a; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: #fff; padding: 10px 40px 10px 14px;
          width: 100%; cursor: pointer; display: flex; flex-direction: column;
          gap: 2px; position: relative; box-sizing: border-box;
          text-align: left; outline: none;
        }
        .sp-dd-trigger .flt-label {
          font-size: 10px; color: rgba(255,255,255,0.4);
          text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;
        }
        .sp-dd-trigger .flt-value { font-size: 14px; color: #fff; font-weight: 500; }
        .sp-dd-arrow {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%); color: rgba(255,255,255,0.5);
        }
        .sp-dd-menu {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        background: #171322;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 10px;
        overflow: hidden;
        z-index: 9999;
        box-shadow: 0 12px 30px rgba(0,0,0,0.45);
        }
        .sp-dd-item {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 16px; font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.85); cursor: pointer; letter-spacing: 0.3px;
        }
        .sp-dd-item:hover { background: rgba(124,92,191,0.25); }
        .sp-dd-item.active { background: #7b2fff; color: #fff; }
        .sp-hint {
          display: flex; align-items: center; gap: 5px;
          font-size: 12px; color: rgba(255,255,255,0.35); margin: 4px 0 14px;
        }
        /* Send To */
        .sp-send-to-label { font-size: 13px; font-weight: 500; color: #fff; margin-bottom: 8px; }
        .sp-search-box {
          background: #13102a; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; display: flex; align-items: center;
          padding: 10px 14px; gap: 8px;
        }
        .sp-search-box.open { border-radius: 10px 10px 0 0; }
        .sp-search-box:focus-within { border-color: rgba(124,92,191,0.6); }
        .sp-search-box input {
          background: none; border: none; outline: none;
          color: #fff; font-size: 14px; flex: 1; width: 100%;
        }
        .sp-search-box input::placeholder { color: rgba(255,255,255,0.3); }
        .sp-user-list {
          background: #13102a; border: 1px solid rgba(255,255,255,0.08);
          border-top: none; border-radius: 0 0 10px 10px;
          max-height: 200px; overflow-y: auto;
        }
        .sp-user-item {
          padding: 10px 14px; font-size: 13px;
          color: rgba(255,255,255,0.8); cursor: pointer;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .sp-user-item:hover { background: rgba(124,92,191,0.2); }
        .sp-all-users { font-size: 13px; color: rgba(255,255,255,0.45); padding: 8px 2px 0; }
        .sp-footer {
          display: flex; align-items: center;
          justify-content: space-between; margin-top: 28px;
        }
        .sp-urgent {
          display: flex; align-items: center; gap: 8px;
          cursor: pointer; font-size: 13px; color: rgba(255,255,255,0.7); user-select: none;
        }
        .sp-radio {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .sp-radio.on { border-color: #e05c7a; }
        .sp-radio.on::after {
          content: ''; width: 8px; height: 8px; border-radius: 50%; background: #e05c7a;
        }
        .sp-schedule-btn {
          background: linear-gradient(135deg, #c47060 0%, #c06090 100%);
          border: none; border-radius: 24px; color: #fff;
          font-size: 14px; font-weight: 600; padding: 11px 36px;
          cursor: pointer; transition: opacity 0.2s;
        }
        .sp-schedule-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .sp-schedule-btn:hover:not(:disabled) { opacity: 0.88; }
      `}</style>

      <div className="sp-page">
        <div className="sp-inner">
          <div className="sp-header">
            <h1 className="sp-title">Notification &amp; Communication</h1>
            <button className="sp-back" onClick={() => router.back()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to List
            </button>
          </div>

          <div className="sp-card">
            <div className="sp-card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c5cbf" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Schedule Notification
            </div>

            <div className="sp-section-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e0963a" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Add Information
            </div>

            {/* Date + Time */}
            <div className="sp-date-row">
              <div>
                <div className="sp-field-label">Date</div>
                <input type="date" className="sp-date-input"
                  value={scheduled_date} onChange={(e) => setScheduledDate(e.target.value)} />
              </div>
              <div>
                <div className="sp-field-label">Time</div>
                <input type="time" className="sp-time-input"
                  value={schedule_time} onChange={(e) => setScheduleTime(e.target.value)} />
              </div>
            </div>
{/* //helllo */}
            {/* Persona Type */}
            {/* <div className="sp-dd-wrap" onClick={(e) => e.stopPropagation()}> */}
            <div
                className={`sp-dd-wrap ${personaOpen ? 'open' : ''}`}
                onClick={(e) => e.stopPropagation()}
                >
              {/* <button className="sp-dd-trigger" onClick={() => { setPersonaOpen(!personaOpen); setMsgTypeOpen(false); }}> */}
                <button
                type="button"
                className="sp-dd-trigger"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => {
                    setPersonaOpen(!personaOpen);
                    setMsgTypeOpen(false);
                }}
                >
                <span className="flt-label">Persona Type</span>
                <span className="flt-value">{persona_type.label}</span>
                <span className="sp-dd-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </span>
              </button>
              {personaOpen && (
                <div className="sp-dd-menu">
                  {PERSONAS.map((p) => (
                    <div key={p.value} className={`sp-dd-item ${persona_type.value === p.value ? 'active' : ''}`}
                      onClick={() => { setPersonaType(p); setPersonaOpen(false); }}>
                      {persona_type.value === p.value
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        : <span style={{ width: 14 }} />}
                      {p.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="sp-hint">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              Looks good!
            </div>

            {/* Message Type */}
            {/* <div className="sp-dd-wrap" onClick={(e) => e.stopPropagation()}> */}

            <div
                className={`sp-dd-wrap ${msgTypeOpen ? 'open' : ''}`}
                onClick={(e) => e.stopPropagation()}
                >
              {/* <button className="sp-dd-trigger" onClick={() => { setMsgTypeOpen(!msgTypeOpen); setPersonaOpen(false); }}> */}
                <button
                type="button"
                className="sp-dd-trigger"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => {
                    setMsgTypeOpen(!msgTypeOpen);
                    setPersonaOpen(false);
                }}
                >

                <span className="flt-label">Message Type</span>
                <span className="flt-value">{msg_type.label}</span>
                <span className="sp-dd-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </span>
              </button>
              {msgTypeOpen && (
                <div className="sp-dd-menu">
                  {MESSAGE_TYPES.map((m) => (
                    <div key={m.value} className={`sp-dd-item ${msg_type.value === m.value ? 'active' : ''}`}
                      onClick={() => { setMsgType(m); setMsgTypeOpen(false); }}>
                      {msg_type.value === m.value
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        : <span style={{ width: 14 }} />}
                      {m.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="sp-hint">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              Select message type
            </div>

            {/* Send To */}
            <div className="sp-send-to-label">Send To</div>
            <div className={`sp-search-box ${users.length > 0 ? 'open' : ''}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input placeholder="Search users by email or select 'All Users'..."
                value={search} onChange={(e) => searchUsers(e.target.value)} />
            </div>
            {users.length > 0 && (
              <div className="sp-user-list">
                {users.map((u: any) => (
                  <div key={u.user_id} className="sp-user-item"
                    onClick={() => { setSearch(u.email); setUsers([]); }}>
                    {u.full_name} ({u.email})
                  </div>
                ))}
              </div>
            )}
            <div className="sp-all-users">All Users</div>

            <div className="sp-footer">
              <div className="sp-urgent" onClick={() => setIsUrgent(!isUrgent)}>
                <div className={`sp-radio ${isUrgent ? 'on' : ''}`} />
                Urgent Notifications
              </div>
              <button className="sp-schedule-btn" onClick={handleSchedule} disabled={loading}>
                {loading ? 'Scheduling...' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}