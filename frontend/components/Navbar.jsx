import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import IconButton from './IconButton';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated) return null;

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
      }}>
        <div
          onClick={() => router.push('/dashboard')}
          style={{
            fontSize: '20px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🎓 <span>UniGPA</span>
        </div>
        <div style={{
          display: 'flex',
          gap: '16px',
        }}>
          <a
            href="/dashboard"
            style={{
              color: router.pathname === '/dashboard' ? 'var(--primary-blue)' : 'var(--text-primary)',
              fontWeight: router.pathname === '/dashboard' ? '600' : '500',
              fontSize: '15px',
            }}
          >
            Dashboard
          </a>
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <div style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: '20px' }}>👤</span>
          <span>{user?.username || user?.email || 'User'}</span>
        </div>
        <IconButton
          icon="🚪"
          label="Logout"
          onClick={handleLogout}
          variant="ghost"
          size="small"
        />
      </div>
    </nav>
  );
};

export default Navbar;
