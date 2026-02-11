import React from 'react';

const IconButton = ({ 
  icon, 
  label, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  type = 'button'
}) => {
  const getVariantStyles = () => {
    const baseStyles = {
      padding: size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
      opacity: disabled ? '0.5' : '1',
      cursor: disabled ? 'not-allowed' : 'pointer',
      width: fullWidth ? '100%' : 'auto',
    };

    const variants = {
      primary: {
        ...baseStyles,
        background: 'var(--primary-blue)',
        color: 'white',
      },
      danger: {
        ...baseStyles,
        background: 'var(--danger-red)',
        color: 'white',
      },
      success: {
        ...baseStyles,
        background: 'var(--success-green)',
        color: 'white',
      },
      ghost: {
        ...baseStyles,
        background: 'transparent',
        color: 'var(--text-primary)',
        border: '1px solid #d2d2d7',
      },
      secondary: {
        ...baseStyles,
        background: '#f5f5f7',
        color: 'var(--text-primary)',
      },
    };

    return variants[variant] || variants.primary;
  };

  const handleMouseEnter = (e) => {
    if (disabled) return;
    e.currentTarget.style.transform = 'scale(1.02)';
    e.currentTarget.style.opacity = '0.9';
  };

  const handleMouseLeave = (e) => {
    if (disabled) return;
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.opacity = '1';
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      style={getVariantStyles()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
    >
      {icon && <span style={{ fontSize: '1.2em' }}>{icon}</span>}
      {label && <span>{label}</span>}
    </button>
  );
};

export default IconButton;
