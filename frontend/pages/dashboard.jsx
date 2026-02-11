import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import DegreeCard from '../components/DegreeCard';
import IconButton from '../components/IconButton';

export default function Dashboard() {
  const [degrees, setDegrees] = useState([]);
  const [degreeGPAs, setDegreeGPAs] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDegree, setEditingDegree] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    startYear: '',
    endYear: ''
  });
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const { isAuthenticated, loading: authLoading, authenticatedFetch } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDegrees();
    }
  }, [isAuthenticated]);

  const loadDegrees = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch('/api/degrees');
      
      if (response.ok) {
        const data = await response.json();
        setDegrees(data);
        
        // Load GPA for each degree
        const gpaPromises = data.map(degree =>
          authenticatedFetch(`/api/degrees/${degree.id}/gpa`)
            .then(res => res.ok ? res.json() : null)
            .then(gpaData => ({ id: degree.id, gpa: gpaData?.gpa || 0 }))
            .catch(() => ({ id: degree.id, gpa: 0 }))
        );
        
        const gpas = await Promise.all(gpaPromises);
        const gpaMap = {};
        gpas.forEach(item => {
          gpaMap[item.id] = item.gpa;
        });
        setDegreeGPAs(gpaMap);
      }
    } catch (err) {
      console.error('Error loading degrees:', err);
      showToast('Failed to load degrees', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddDegree = () => {
    setEditingDegree(null);
    setFormData({ name: '', university: '', startYear: '', endYear: '' });
    setError('');
    setShowModal(true);
  };

  const handleEditDegree = (degree) => {
    setEditingDegree(degree);
    setFormData({
      name: degree.name || '',
      university: degree.university || '',
      startYear: degree.startYear || '',
      endYear: degree.endYear || ''
    });
    setError('');
    setShowModal(true);
  };

  const handleDeleteDegree = async (degree) => {
    if (!confirm(`Are you sure you want to delete "${degree.name}"?`)) {
      return;
    }

    try {
      const response = await authenticatedFetch(`/api/degrees/${degree.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showToast('Degree deleted successfully', 'success');
        loadDegrees();
      } else {
        showToast('Failed to delete degree', 'error');
      }
    } catch (err) {
      showToast('Failed to delete degree', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.university) {
      setError('Please fill in required fields (name and university)');
      return;
    }

    try {
      const method = editingDegree ? 'PUT' : 'POST';
      const url = editingDegree ? `/api/degrees/${editingDegree.id}` : '/api/degrees';
      
      const response = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast(
          editingDegree ? 'Degree updated successfully' : 'Degree added successfully',
          'success'
        );
        setShowModal(false);
        loadDegrees();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save degree');
      }
    } catch (err) {
      setError('Failed to save degree');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ textAlign: 'center', paddingTop: '60px' }}>
          <div className="loading-spinner" style={{ margin: '0 auto' }} />
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            My Degrees
          </h1>
          <p style={{ 
            fontSize: '16px',
            color: 'var(--text-secondary)'
          }}>
            Manage your university degrees and track your GPA
          </p>
        </div>

        {degrees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎓</div>
            <div className="empty-state-text">No degrees yet</div>
            <IconButton
              icon="➕"
              label="Add Your First Degree"
              onClick={handleAddDegree}
              variant="primary"
            />
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {degrees.map(degree => (
              <DegreeCard
                key={degree.id}
                degree={degree}
                gpa={degreeGPAs[degree.id] || 0}
                onEdit={handleEditDegree}
                onDelete={handleDeleteDegree}
              />
            ))}
          </div>
        )}

        {degrees.length > 0 && (
          <button className="floating-button" onClick={handleAddDegree}>
            ➕
          </button>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingDegree ? 'Edit Degree' : 'Add Degree'}
                </h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Degree Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Bachelor of Computer Science"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">University *</label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    placeholder="e.g. University of Example"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Start Year</label>
                    <input
                      type="number"
                      value={formData.startYear}
                      onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                      placeholder="2020"
                      min="1900"
                      max="2040"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">End Year</label>
                    <input
                      type="number"
                      value={formData.endYear}
                      onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                      placeholder="2024"
                      min="1900"
                      max="2040"
                    />
                  </div>
                </div>

                {error && (
                  <div className="error-message" style={{ marginBottom: '16px' }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                  <IconButton
                    type="submit"
                    icon="💾"
                    label={editingDegree ? 'Update' : 'Add'}
                    variant="primary"
                    fullWidth
                  />
                  <IconButton
                    type="button"
                    icon="✕"
                    label="Cancel"
                    onClick={() => setShowModal(false)}
                    variant="ghost"
                  />
                </div>
              </form>
            </div>
          </div>
        )}

        {toast && (
          <div className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
