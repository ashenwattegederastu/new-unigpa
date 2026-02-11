import React from 'react';

const GPAIndicator = ({ gpa, size = 120, maxGPA = 4.0 }) => {
  const percentage = Math.min((gpa / maxGPA) * 100, 100);
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (gpa >= 3.5) return 'var(--success-green)';
    if (gpa >= 3.0) return 'var(--primary-blue)';
    if (gpa >= 2.5) return 'var(--warning-yellow)';
    return 'var(--danger-red)';
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: size, 
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e5ea"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease'
          }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          fontSize: size / 3.5,
          fontWeight: '700',
          color: getColor(),
        }}>
          {typeof gpa === 'number' ? gpa.toFixed(2) : '--'}
        </div>
        <div style={{
          fontSize: size / 8,
          color: 'var(--text-secondary)',
          fontWeight: '500'
        }}>
          GPA
        </div>
      </div>
    </div>
  );
};

export default GPAIndicator;
