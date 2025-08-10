import React from 'react';
import { Layers2, Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

function CategoryList({ categories = [], onEditCategory, onDeleteCategory, loading = false }) {
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '3rem',
        color: '#64748b'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }} />
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        background: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '20px',
        border: '2px dashed #e2e8f0'
      }}>
        <Layers2 size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
        <h3 style={{ 
          color: '#64748b', 
          margin: '0 0 0.5rem 0',
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          No categories found
        </h3>
        <p style={{ color: '#94a3b8', margin: 0 }}>
          Create your first category to get started organizing your finances
        </p>
      </div>
    );
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    position: 'relative',
    overflow: 'hidden'
  };

  const getCardHoverStyle = (color) => ({
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px ${color}20`,
    borderColor: color
  });

  const iconContainerStyle = (color) => ({
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    background: `linear-gradient(135deg, ${color}20, ${color}10)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    border: `2px solid ${color}30`
  });

  const nameStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.01em'
  };

  const typeStyle = (isIncome) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    background: isIncome ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    color: isIncome ? '#22c55e' : '#ef4444',
    textTransform: 'capitalize'
  });

  const actionsStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    display: 'flex',
    gap: '0.5rem',
    opacity: 0,
    transition: 'opacity 0.2s ease'
  };

  const actionButtonStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  };

  const editButtonStyle = {
    ...actionButtonStyle,
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6'
  };

  const deleteButtonStyle = {
    ...actionButtonStyle,
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444'
  };

  return (
    <>
      <div style={gridStyle}>
        {categories.map((cat) => {
          const color = cat.color || '#667eea';
          const isIncome = cat.type === 'income';
          
          return (
            <div
              key={cat.id || cat.name}
              style={cardStyle}
              onMouseEnter={(e) => {
                const hoverStyle = getCardHoverStyle(color);
                Object.assign(e.currentTarget.style, hoverStyle);
                const actions = e.currentTarget.querySelector('.category-actions');
                if (actions) actions.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, cardStyle);
                const actions = e.currentTarget.querySelector('.category-actions');
                if (actions) actions.style.opacity = '0';
              }}
            >
              <div 
                className="category-actions"
                style={actionsStyle}
              >
                <button
                  onClick={() => onEditCategory?.(cat)}
                  style={editButtonStyle}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.2)';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                    e.target.style.transform = 'scale(1)';
                  }}
                  title="Edit category"
                >
                  <Pencil size={16} />
                </button>
                {onDeleteCategory && (
                  <button
                    onClick={() => onDeleteCategory?.(cat)}
                    style={deleteButtonStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                      e.target.style.transform = 'scale(1)';
                    }}
                    title="Delete category"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div style={iconContainerStyle(color)}>
                {cat.icon ? (
                  <span style={{ fontSize: '32px' }}>{cat.icon}</span>
                ) : (
                  <Layers2 size={32} style={{ color }} />
                )}
              </div>

              <h3 style={nameStyle}>{cat.name}</h3>
              
              <div style={typeStyle(isIncome)}>
                {isIncome ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {cat.type}
              </div>
            </div>
          );
        })}
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}

export default CategoryList;