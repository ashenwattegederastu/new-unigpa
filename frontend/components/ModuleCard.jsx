import React from 'react';
import IconButton from './IconButton';

const ModuleCard = ({ module, onEdit, onDelete }) => {
  const getGradeColor = (grade) => {
    if (['A+', 'A', 'A-'].includes(grade)) return 'var(--success-green)';
    if (['B+', 'B', 'B-'].includes(grade)) return 'var(--primary-blue)';
    if (['C+', 'C', 'C-'].includes(grade)) return 'var(--warning-yellow)';
    return 'var(--danger-red)';
  };

  return (
    <div className="glass-card" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px',
        }}>
          <h4 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--text-primary)',
          }}>
            {module.name}
          </h4>
          {module.grade && (
            <span style={{
              background: getGradeColor(module.grade),
              color: 'white',
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
            }}>
              {module.grade}
            </span>
          )}
        </div>
        <div style={{
          display: 'flex',
          gap: '16px',
          fontSize: '14px',
          color: 'var(--text-secondary)',
        }}>
          {module.code && (
            <span>📚 {module.code}</span>
          )}
          {module.credits && (
            <span>⭐ {module.credits} credits</span>
          )}
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '8px',
      }}>
        <IconButton
          icon="✏️"
          onClick={() => onEdit(module)}
          variant="secondary"
          size="small"
        />
        <IconButton
          icon="🗑️"
          onClick={() => onDelete(module)}
          variant="danger"
          size="small"
        />
      </div>
    </div>
  );
};

export default ModuleCard;
