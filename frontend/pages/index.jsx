import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import IconButton from '../components/IconButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            🎓 <span>UniGPA</span>
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)',
            fontSize: '16px'
          }}>
            Calculate your university GPA with ease
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message" style={{ marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <IconButton
            type="submit"
            icon={loading ? '⏳' : '🔓'}
            label={loading ? 'Logging in...' : 'Login'}
            variant="primary"
            fullWidth
            disabled={loading}
          />
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px',
          fontSize: '14px',
          color: 'var(--text-secondary)'
        }}>
          Don't have an account?{' '}
          <a 
            href="/register"
            style={{ 
              color: 'var(--primary-blue)',
              fontWeight: '600'
            }}
          >
            Register here
          </a>
        </div>
      </div>
    </div>
  );
}
