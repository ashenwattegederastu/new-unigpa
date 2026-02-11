import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import ModuleCard from '../../components/ModuleCard';
import GPAIndicator from '../../components/GPAIndicator';
import IconButton from '../../components/IconButton';

const GRADE_OPTIONS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];

export default function DegreeDetail() {
  const [degree, setDegree] = useState(null);
  const [modules, setModules] = useState([]);
  const [gpa, setGpa] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: '',
    grade: ''
  });
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const { isAuthenticated, loading: authLoading, authenticatedFetch } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      loadDegreeData();
    }
  }, [isAuthenticated, id]);

  const loadDegreeData = async () => {
    try {
      setLoading(true);
      
      // Load degree info (Note: This endpoint might not exist, using modules endpoint as primary)
      const degreeResponse = await authenticatedFetch(`/api/degrees/${id}`);
      if (degreeResponse.ok) {
        const degreeData = await degreeResponse.json();
        setDegree(degreeData);
      }

      // Load modules
      const modulesResponse = await authenticatedFetch(`/api/degrees/${id}/modules`);
      if (modulesResponse.ok) {
        const modulesData = await modulesResponse.json();
        setModules(modulesData);
      }

      // Load GPA
      const gpaResponse = await authenticatedFetch(`/api/degrees/${id}/gpa`);
      if (gpaResponse.ok) {
        const gpaData = await gpaResponse.json();
        setGpa(gpaData.gpa || 0);
      }
    } catch (err) {
      console.error('Error loading degree data:', err);
      showToast('Failed to load degree data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddModule = () => {
    setEditingModule(null);
    setFormData({ name: '', code: '', credits: '', grade: '' });
    setError('');
    setShowModal(true);
  };

  const handleEditModule = (module) => {
    setEditingModule(module);
    setFormData({
      name: module.name || '',
      code: module.code || '',
      credits: module.credits || '',
      grade: module.grade || ''
    });
    setError('');
    setShowModal(true);
  };

  const handleDeleteModule = async (module) => {
    if (!confirm(`Are you sure you want to delete "${module.name}"?`)) {
      return;
    }

    try {
      const response = await authenticatedFetch(`/api/modules/${module.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showToast('Module deleted successfully', 'success');
        loadDegreeData();
      } else {
        showToast('Failed to delete module', 'error');
      }
    } catch (err) {
      showToast('Failed to delete module', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.credits || !formData.grade) {
      setError('Please fill in required fields (name, credits, and grade)');
      return;
    }

    try {
      const method = editingModule ? 'PUT' : 'POST';
      const url = editingModule 
        ? `/api/modules/${editingModule.id}` 
        : `/api/degrees/${id}/modules`;
      
      const response = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast(
          editingModule ? 'Module updated successfully' : 'Module added successfully',
          'success'
        );
        setShowModal(false);
        loadDegreeData();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save module');
      }
    } catch (err) {
      setError('Failed to save module');
    }
  };

  const handleBack = () => {
    router.push('/dashboard');
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
          <IconButton
            icon="⬅️"
            label="Back to Dashboard"
            onClick={handleBack}
            variant="ghost"
            size="small"
            style={{ marginBottom: '16px' }}
          />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            <div>
              <h1 style={{ 
                fontSize: '36px', 
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                {degree?.name || 'Degree'}
              </h1>
              {degree?.university && (
                <p style={{ 
                  fontSize: '18px',
                  color: 'var(--text-secondary)',
                  marginBottom: '4px'
                }}>
                  🏛️ {degree.university}
                </p>
              )}
              {degree?.startYear && (
                <p style={{ 
                  fontSize: '16px',
                  color: 'var(--text-secondary)'
                }}>
                  📅 {degree.startYear} {degree.endYear ? `- ${degree.endYear}` : '- Present'}
                </p>
              )}
            </div>
            
            <GPAIndicator gpa={gpa} size={140} />
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600'
          }}>
            Modules
          </h2>
          <IconButton
            icon="➕"
            label="Add Module"
            onClick={handleAddModule}
            variant="primary"
          />
        </div>

        {modules.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <div className="empty-state-text">No modules yet</div>
            <IconButton
              icon="➕"
              label="Add Your First Module"
              onClick={handleAddModule}
              variant="primary"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1">
            {modules.map(module => (
              <ModuleCard
                key={module.id}
                module={module}
                onEdit={handleEditModule}
                onDelete={handleDeleteModule}
              />
            ))}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingModule ? 'Edit Module' : 'Add Module'}
                </h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Module Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Data Structures and Algorithms"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Module Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. CS201"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Credits *</label>
                    <input
                      type="number"
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                      placeholder="3"
                      min="0"
                      step="0.5"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Grade *</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    >
                      <option value="">Select grade</option>
                      {GRADE_OPTIONS.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
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
                    label={editingModule ? 'Update' : 'Add'}
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
