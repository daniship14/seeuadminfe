'use client';

// import { ReactNode, useState } from 'react';
import useLanguage from '@/lib/useLanguage';
import { translations } from '@/lib/translations';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Settings, Bell,
  LogOut, Globe, ChevronDown, User, Menu, X
} from 'lucide-react';
import Cookies from 'js-cookie';
import { adminLogout } from '@/lib/api';



export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    check();

    window.addEventListener('resize', check);

    return () => window.removeEventListener('resize', check);
  }, []);


  const [profileOpen, setProfileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
//   const [language, setLanguage] = useState('en');

//   useEffect(() => {
//   const savedLang = localStorage.getItem('lang') || 'en';
//   setLanguage(savedLang);
// }, []);

  const handleLogout = async () => {
    try { await adminLogout(); } catch {}
    Cookies.remove('admin_token');
    router.push('/login');
  };

  const { language, setLanguage } = useLanguage();

  const t = translations[language as keyof typeof translations];

  const navItems = [
    { href: '/dashboard', label: t.dashboard, icon: LayoutDashboard },
    { href: '/users', label: t.users, icon: Users },
    { href: '/configuration', label: t.config, icon: Settings },
    { href: '/notifications', label: t.notifications, icon: Bell },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Sidebar */}
    <aside
      style={{
        position: isMobile ? 'fixed' : 'relative',
        left: 0,
        top: 0,
        height: isMobile ? '100vh' : '100%',
        width: sidebarOpen ? '270px' : '0',
        minWidth: sidebarOpen ? '270px' : '0',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.25s, min-width 0.25s',
        zIndex: 40,
      }}
    >
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'var(--gradient)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '700', color: '#fff',
              flexShrink: 0,
            }}>
              SU
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap' }}>SeeU</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{t.adminPanel}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              

            <Link
              key={href}
              href={href}
              onClick={() => { if (isMobile) setSidebarOpen(false); }}
              className={`nav-link ${isActive ? 'active' : ''}`}
              style={{
                marginBottom: '8px',
                whiteSpace: 'nowrap',

                background: isActive
                  ? 'rgba(168,85,247,0.12)'
                  : 'transparent',

                border: isActive
                  ? '1px solid #9333ea'
                  : '1px solid transparent',

                borderRadius: '14px',

                boxShadow: isActive
                  ? `
                      0 0 12px rgba(168,85,247,0.55),
                      0 0 28px rgba(168,85,247,0.35),
                      inset 0 0 12px rgba(168,85,247,0.18)
                    `
                  : 'none',

                transition: 'all 0.25s ease',
              }}
            >
                <Icon size={16} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '13px' }}>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleLogout}
            className="nav-link"
            style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
          >
            <LogOut size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
            <span style={{ color: '#ef4444', fontSize: '13px', whiteSpace: 'nowrap' }}>{t.logout}</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 39,
          }}
        />
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{
          height: '52px', background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px', flexShrink: 0,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px' }}
          >
            {sidebarOpen ? <Menu size={18} /> : <Menu size={18} />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Language */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text)', fontSize: '13px',
                }}
              >
                <Globe size={15} />
                {language === 'fr' ? 'Français' : 'English'}
                <ChevronDown size={13} />
              </button>
              {langOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: '4px',
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: '8px', overflow: 'hidden', zIndex: 100, minWidth: '100px',
                }}>
                  {/* {['English', 'French'].map(lang => (
                    <div key={lang}
                      onClick={() => setLangOpen(false)}
                      style={{
                        padding: '8px 14px', fontSize: '13px', cursor: 'pointer',
                        color: 'var(--text)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {lang}
                    </div>
                  ))} */}
                  {[
                  { label: 'English', value: 'en' },
                  { label: 'Français', value: 'fr' }
                ].map(lang => (
                  <div
                    key={lang.value}
                    onClick={() => {
                      localStorage.setItem('lang', lang.value);
                      setLanguage(lang.value);
                      window.location.reload();
                    }}
                    style={{
                      padding: '8px 14px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      color: language === lang.value ? '#e8456a' : 'var(--text)',
                      background:
                        language === lang.value
                          ? 'rgba(232,69,106,0.08)'
                          : 'transparent',
                    }}
                    onMouseEnter={e => {
                      if (language !== lang.value) {
                        e.currentTarget.style.background =
                          'rgba(255,255,255,0.05)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (language !== lang.value) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {lang.label}
                  </div>
                ))}
                </div>
              )}
            </div>

            {/* Admin */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: 'var(--gradient)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: '600', color: '#fff',
                }}>
                  A
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text)' }}>Admin</span>
              </button>

              {profileOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: '4px',
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: '8px', overflow: 'hidden', zIndex: 100, minWidth: '120px',
                }}>
                  <div
                    onClick={() => {
                      setProfileOpen(false);
                      setShowProfileModal(true);
                    }}
                    style={{ padding: '10px 14px', fontSize: '13px', cursor: 'pointer', color: 'var(--text)', display: 'flex', gap: '8px', alignItems: 'center' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <User size={14} /> Profile
                  </div>
                  <div
                    onClick={handleLogout}
                    style={{ padding: '10px 14px', fontSize: '13px', cursor: 'pointer', color: '#ef4444', display: 'flex', gap: '8px', alignItems: 'center' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LogOut size={14} /> Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isMobile ? '16px' : '28px 32px',
        }}
      >
          {children}
        </main>

        {showProfileModal && (
          <div
            onClick={() => setShowProfileModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '500px',
                background: '#17082e',
                borderRadius: '20px',
                padding: '32px',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Close */}
              <button
                onClick={() => setShowProfileModal(false)}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '20px',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: '1px solid #7c3aed',
                  background: 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                ×
              </button>

              {/* Title */}
              <h2
                style={{
                  color: '#fff',
                  fontWeight: '700',
                  marginBottom: '28px',
                  fontSize: '18px',
                  textAlign: 'left',
                }}
              >
                {language === 'fr' ? "Profil d'administrateur" : 'Admin Profile'}
              </h2>

              {/* Avatar */}
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'var(--gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '32px',
                  fontWeight: '700',
                  margin: '0 auto 20px',
                }}
              >
                JA
              </div>

              {/* Name */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div
                  style={{
                    color: '#fff',
                    fontSize: '24px',
                    fontWeight: '700',
                  }}
                >
                  John Anderson
                </div>

                <div
                  style={{
                    color: 'var(--muted)',
                    marginTop: '6px',
                    fontSize: '14px',
                  }}
                >
                  {language === 'fr' ? 'Super administrateur' : 'Super Administrator'}
                </div>
              </div>

              {/* Email */}
              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  paddingTop: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#fff',
                    fontSize: '14px',
                  }}
                >
                  <span style={{ color: 'var(--muted)' }}>
                    Email
                  </span>

                  <span>
                    admin@seeU.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}