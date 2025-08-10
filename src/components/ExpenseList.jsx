import React from 'react';
import { TrendingDown, Pencil, Trash2, DollarSign, Calendar } from 'lucide-react';

function ExpenseList({ expenses = [], onEditExpense, onDeleteExpense, loading = false }) {
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
            borderTop: '3px solid #ef4444',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }} />
          <p>Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        background: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '20px',
        border: '2px dashed #e2e8f0'
      }}>
        <TrendingDown size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
        <h3 style={{ 
          color: '#64748b', 
          margin: '0 0 0.5rem 0',
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          No expense records found
        </h3>
        <p style={{ color: '#94a3b8', margin: 0 }}>
          Start adding your expenses to track your spending
        </p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
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

  const getCardHoverStyle = () => ({
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.3)'
  });

  const iconContainerStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    border: '2px solid rgba(239, 68, 68, 0.3)'
  };

  const nameStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.01em'
  };

  const amountStyle = {
    fontSize: '1.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 1rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const categoryStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    marginBottom: '1rem'
  };

  const dateStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#64748b',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '1rem'
  };

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

  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

  return (
    <>
      {/* Summary Card */}
      <div style={{
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        borderRadius: '20px',
        padding: '2rem',
        color: 'white',
        marginBottom: '2rem',
        boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <TrendingDown size={32} />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', opacity: 0.9 }}>
              Total Expenses
            </h3>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>
              {formatCurrency(totalExpenses)}
            </p>
          </div>
        </div>
        <p style={{ margin: 0, opacity: 0.8, fontSize: '0.875rem' }}>
          From {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div style={gridStyle}>
        {expenses.map((expense) => {
          return (
            <div
              key={expense.id}
              style={cardStyle}
              onMouseEnter={(e) => {
                const hoverStyle = getCardHoverStyle();
                Object.assign(e.currentTarget.style, hoverStyle);
                const actions = e.currentTarget.querySelector('.expense-actions');
                if (actions) actions.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, cardStyle);
                const actions = e.currentTarget.querySelector('.expense-actions');
                if (actions) actions.style.opacity = '0';
              }}
            >
              <div 
                className="expense-actions"
                style={actionsStyle}
              >
                <button
                  onClick={() => onEditExpense?.(expense)}
                  style={editButtonStyle}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.2)';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                    e.target.style.transform = 'scale(1)';
                  }}
                  title="Edit expense"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDeleteExpense?.(expense)}
                  style={deleteButtonStyle}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.target.style.transform = 'scale(1)';
                  }}
                  title="Delete expense"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={iconContainerStyle}>
                {expense.icon ? (
                  <span style={{ fontSize: '32px' }}>{expense.icon}</span>
                ) : (
                  <TrendingDown size={32} style={{ color: '#ef4444' }} />
                )}
              </div>

              <h3 style={nameStyle}>{expense.name}</h3>
              
              <div style={amountStyle}>
                <DollarSign size={20} />
                {formatCurrency(expense.amount || 0)}
              </div>

              {expense.category && (
                <div style={categoryStyle}>
                  {expense.category.icon && <span>{expense.category.icon}</span>}
                  {expense.category.name}
                </div>
              )}

              <div style={dateStyle}>
                <Calendar size={16} />
                {formatDate(expense.createdAt || expense.date)}
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

export default ExpenseList;