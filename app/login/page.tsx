'use client';
import useLanguage from '@/lib/useLanguage';
import { translations } from '@/lib/translations';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Cookies from 'js-cookie';
import { adminLogin } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('adminseeu@yopmail.com');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      const data = res.data;
      // Token might be in data.data.access_token or data.access_token
      const token = data?.data?.access_token || data?.access_token;
      if (token) {
        Cookies.set('admin_token', token, { expires: 7 });
        router.push('/dashboard');
      } else {
        setError(t.loginFailed || 'Login failed. Please try again.');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || t.invalidCredentials);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(232,69,106,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.06) 0%, transparent 60%)',
    }}>
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '40px 36px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
          }}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="26" fill="rgba(232,69,106,0.1)" />
              <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
                fill="url(#g)" fontSize="22" fontFamily="Sora" fontWeight="700">
                SU
              </text>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#e8456a" />
                  <stop offset="1" stopColor="#f07f3c" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
          {t.adminPanel}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--muted)' }}>  {t.loginAccess}</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>
              {t.email}
            </label>
            <input
              className="seeu-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@seeu.com"
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>
              {t.password}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                className="seeu-input"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ paddingRight: '42px' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--muted)',
                }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
              fontSize: '13px', color: '#ef4444',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="gradient-btn"
            disabled={loading}
            style={{
              width: '100%', padding: '12px', borderRadius: '10px',
              fontSize: '15px', fontWeight: '600',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? t.loggingIn : t.login}
          </button>
        </form>
      </div>
    </div>
  );
}
