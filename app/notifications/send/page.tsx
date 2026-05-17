'use client';

import { useState, useRef, useEffect } from 'react';
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

export default function SendNotificationPage() {
  const router = useRouter();

  const [persona_type, setPersonaType] = useState(PERSONAS[0]);
  const [msg_type, setMsgType] = useState(MESSAGE_TYPES[0]);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [personaOpen, setPersonaOpen] = useState(false);
  const [msgTypeOpen, setMsgTypeOpen] = useState(false);

  const searchTimerRef = useRef<any>(null);


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

  const handleSend = async () => {
    try {
      setLoading(true);

    await api.post(
    '/admin/send-notification-to-users',
    {
        persona_type: persona_type.value,
        msg_type: msg_type.value,
        message: '',
        search,
    }
    );

      alert('Notification sent successfully');
        } catch (err) {
        console.error(err);
        }
        };

    useEffect(() => {
    const handler = (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        if (!target.closest('.np-dd-wrap')) {
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
        .np-page {
          padding: 32px 24px;
          min-height: 100vh;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .np-inner {
          width: 100%;
          max-width: 920px;
        }

        .np-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .np-title {
          font-size: 22px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .np-back {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #e05c7a;
          font-size: 14px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }

        .np-card {
          background: #1e1535;
          border-radius: 16px;
          padding: 28px 32px 32px;
        }

        .np-card-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 24px;
        }

        .np-section-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 18px;
        }


        .np-dd-wrap.open {
        z-index: 999;
        }


        .np-dd-wrap {
        position: relative;
        margin-bottom: 4px;
        z-index: 50;
        }

        .np-dd-trigger {
          background: #13102a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #fff;
          padding: 10px 40px 10px 14px;
          width: 100%;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 2px;
          position: relative;
          box-sizing: border-box;
          text-align: left;
          outline: none;
        }

        .np-dd-trigger .flt-label {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .np-dd-trigger .flt-value {
          font-size: 14px;
          color: #fff;
          font-weight: 500;
        }

        .np-dd-arrow {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.5);
        }

        .np-dd-menu {
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

        .np-dd-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 16px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.88);
          cursor: pointer;
        }

        .np-dd-item:hover {
          background: rgba(124,92,191,0.25);
        }

        .np-dd-item.active {
          background: linear-gradient(90deg, #7b2fff 0%, #a100ff 100%);
          color: #fff;
        }

        .np-hint {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          margin: 4px 0 14px;
        }

        .np-send-to-label {
          font-size: 13px;
          font-weight: 500;
          color: #fff;
          margin-bottom: 8px;
        }

        .np-search-box {
          background: #13102a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          padding: 10px 14px;
          gap: 8px;
        }

        .np-search-box.open {
          border-radius: 10px 10px 0 0;
        }

        .np-search-box:focus-within {
          border-color: rgba(124,92,191,0.6);
        }

        .np-search-box input {
          background: none;
          border: none;
          outline: none;
          color: #fff;
          font-size: 14px;
          flex: 1;
          width: 100%;
        }

        .np-search-box input::placeholder {
          color: rgba(255,255,255,0.3);
        }

        .np-user-list {
          background: #1a132d;
          border: 1px solid rgba(255,255,255,0.08);
          border-top: none;
          border-radius: 0 0 10px 10px;
          max-height: 180px;
          overflow-y: auto;
          margin-top: -2px;
        }

        .np-user-item {
          padding: 12px 16px;
          font-size: 13px;
          color: rgba(255,255,255,0.85);
          cursor: pointer;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .np-user-item:hover {
          background: rgba(124,92,191,0.2);
        }

        .np-all-users {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          padding: 8px 2px 0;
        }

        .np-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 36px;
        }

        .np-urgent {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          user-select: none;
        }

        .np-radio {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .np-radio.on {
          border-color: #e05c7a;
        }

        .np-radio.on::after {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e05c7a;
        }

        .np-send-btn {
          background: linear-gradient(135deg, #c47060 0%, #c06090 100%);
          border: none;
          border-radius: 24px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          padding: 11px 44px;
          min-width: 120px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .np-send-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .np-send-btn:hover:not(:disabled) {
          opacity: 0.88;
        }
      `}</style>

      <div className="np-page">
        <div className="np-inner">
          <div className="np-header">
            <h1 className="np-title">
              Notification & Communication
            </h1>

            <button
              className="np-back"
              onClick={() => router.back()}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>

              Back to List
            </button>
          </div>

          <div className="np-card">
            <div className="np-card-title">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7c5cbf"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>

              Send Notification
            </div>

            <div className="np-section-label">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#e0963a"
                strokeWidth="2.5"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>

              Add Information
            </div>

            <div
                className={`np-dd-wrap ${personaOpen ? 'open' : ''}`}
                onClick={(e) => e.stopPropagation()}
                >
                <button
                type="button"
                className="np-dd-trigger"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => {
                    setPersonaOpen(!personaOpen);
                    setMsgTypeOpen(false);
                }}
                >
                <span className="flt-label">
                  Persona Type
                </span>

                <span className="flt-value">
                  {persona_type.label}
                </span>

                <span className="np-dd-arrow">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </span>
              </button>

              {personaOpen && (
                <div className="np-dd-menu">
                  {PERSONAS.map((p) => (
                    <div
                      key={p.value}
                      className={`np-dd-item ${
                        persona_type.value === p.value
                          ? 'active'
                          : ''
                      }`}
                      onClick={() => {
                        setPersonaType(p);
                        setPersonaOpen(false);
                      }}
                    >
                      {persona_type.value === p.value ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : (
                        <span style={{ width: 14 }} />
                      )}

                      {p.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="np-hint">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12"/>
              </svg>

              Looks good!
            </div>

            <div
              className={`np-dd-wrap ${msgTypeOpen ? 'open' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
                <button
                type="button"
                className="np-dd-trigger"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => {
                    setMsgTypeOpen(!msgTypeOpen);
                    setPersonaOpen(false);
                }}
                >
                
                <span className="flt-label">
                  Message Type
                </span>

                <span className="flt-value">
                  {msg_type.label}
                </span>

                <span className="np-dd-arrow">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </span>
              </button>

              {msgTypeOpen && (
                <div className="np-dd-menu">
                  {MESSAGE_TYPES.map((m) => (
                    <div
                      key={m.value}
                      className={`np-dd-item ${
                        msg_type.value === m.value
                          ? 'active'
                          : ''
                      }`}
                      onClick={() => {
                        setMsgType(m);
                        setMsgTypeOpen(false);
                      }}
                    >
                      {msg_type.value === m.value ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : (
                        <span style={{ width: 14 }} />
                      )}

                      {m.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="np-hint">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12"/>
              </svg>

              Select message type
            </div>

            <div className="np-send-to-label">
              Send To
            </div>

            <div
              className={`np-search-box ${
                users.length > 0 ? 'open' : ''
              }`}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"/>
                <line
                  x1="21"
                  y1="21"
                  x2="16.65"
                  y2="16.65"
                />
              </svg>

              <input
                placeholder="Search users by email or select 'All Users'..."
                value={search}
                onChange={(e) => searchUsers(e.target.value)}
              />
            </div>

            {users.length > 0 && (
              <div className="np-user-list">
                {users.map((u: any) => (
                  <div
                    key={u.user_id}
                    className="np-user-item"
                    onClick={() => {
                      setSearch(u.email);
                      setUsers([]);
                    }}
                  >
                    {u.full_name} ({u.email})
                  </div>
                ))}
              </div>
            )}

            <div className="np-all-users">
              All Users
            </div>

            <div className="np-footer">
              <div
                className="np-urgent"
                onClick={() =>
                  setIsUrgent(!isUrgent)
                }
              >
                <div
                  className={`np-radio ${
                    isUrgent ? 'on' : ''
                  }`}
                />

                Urgent Notifications
              </div>

              <button
                className="np-send-btn"
                onClick={handleSend}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}