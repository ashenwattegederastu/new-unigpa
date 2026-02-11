import React from 'react';
import { useRouter } from 'next/router';
import IconButton from './IconButton';
import GPAIndicator from './GPAIndicator';

const DegreeCard = ({ degree, gpa, onEdit, onDelete }) => {
  const router = useRouter();

  const handleOpen = () => {
    router.push(`/degree/${degree.id}`);
  };

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '8px',
            color: 'var(--text-primary)',
          }}>
            {degree.name}
          </h3>
          <div style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            marginBottom: '4px',
          }}>
            🏛️ {degree.university}
          </div>
          {degree.startYear && (
            <div style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
            }}>
              📅 {degree.startYear} {degree.endYear ? `- ${degree.endYear}` : '- Present'}
            </div>
          )}
        </div>
        <GPAIndicator gpa={gpa} size={100} />
      </div>
      
      <div style={{
        display: 'flex',
        gap: '8px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
      }}>
        <IconButton
          icon="📖"
          label="Open"
          onClick={handleOpen}
          variant="primary"
          size="small"
        />
        <IconButton
          icon="✏️"
          label="Edit"
          onClick={() => onEdit(degree)}
          variant="secondary"
          size="small"
        />
        <IconButton
          icon="🗑️"
          label="Delete"
          onClick={() => onDelete(degree)}
          variant="danger"
          size="small"
        />
      </div>
    </div>
  );
};

export default DegreeCard;
