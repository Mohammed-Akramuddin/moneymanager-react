import React from 'react';
import { TrendingDown, Pencil, Trash2, DollarSign, Calendar } from 'lucide-react';

function ExpenseList({ expenses = [], onEditExpense, onDeleteExpense, loading = false }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner" />
          <p>Loading expenses...</p>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 3rem 1rem;
            color: #64748b;
          }

          .loading-content {
            text-align: center;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e2e8f0;
            border-top: 3px solid #ef4444;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem auto;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @media (max-width: 768px) {
            .loading-container {
              padding: 2rem 1rem;
            }

            .spinner {
              width: 32px;
              height: 32px;
            }
          }
        `}</style>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <TrendingDown size={48} />
        <h3>No expense records found</h3>
        <p>Start adding your expenses to track your spending</p>
        <style jsx>{`
          .empty-state {
            text-align: center;
            padding: 3rem 1rem;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 20px;
            border: 2px dashed #e2e8f0;
          }

          .empty-state svg {
            color: #94a3b8;
            margin-bottom: 1rem;
          }

          .empty-state h3 {
            color: #64748b;
            margin: 0 0 0.5rem 0;
            font-size: 1.25rem;
            font-weight: 600;
          }

          .empty-state p {
            color: #94a3b8;
            margin: 0;
          }

          @media (max-width: 768px) {
            .empty-state {
              padding: 2rem 1rem;
              border-radius: 16px;
            }

            .empty-state svg {
              width: 40px;
              height: 40px;
            }

            .empty-state h3 {
              font-size: 1.125rem;
            }

            .empty-state p {
              font-size: 0.875rem;
            }
          }
        `}</style>
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

  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

  return (
    <div className="expense-list-container">
      <div className="summary-card">
        <div className="summary-content">
          <TrendingDown size={32} />
          <div className="summary-info">
            <h3>Total Expenses</h3>
            <p className="total-amount">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>
        <p className="summary-subtitle">
          From {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="expense-grid">
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-card">
            <div className="card-actions">
              <button
                onClick={() => onEditExpense?.(expense)}
                className="action-btn edit-btn"
                title="Edit expense"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onDeleteExpense?.(expense)}
                className="action-btn delete-btn"
                title="Delete expense"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="icon-container">
              {expense.icon ? (
                <span className="expense-icon">{expense.icon}</span>
              ) : (
                <TrendingDown size={32} style={{ color: '#ef4444' }} />
              )}
            </div>

            <h3 className="expense-name">{expense.name}</h3>

            <div className="expense-amount">
              <DollarSign size={20} />
              {formatCurrency(expense.amount || 0)}
            </div>

            {expense.category && (
              <div className="expense-category">
                {expense.category.icon && <span>{expense.category.icon}</span>}
                {expense.category.name}
              </div>
            )}

            <div className="expense-date">
              <Calendar size={16} />
              {formatDate(expense.createdAt || expense.date)}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .expense-list-container {
          margin-top: 1rem;
        }

        .summary-card {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border-radius: 20px;
          padding: 2rem;
          color: white;
          margin-bottom: 2rem;
          box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
        }

        .summary-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .summary-info h3 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          opacity: 0.9;
        }

        .total-amount {
          margin: 0;
          font-size: 2rem;
          font-weight: 800;
        }

        .summary-subtitle {
          margin: 0;
          opacity: 0.8;
          font-size: 0.875rem;
        }

        .expense-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .expense-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }

        .expense-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.3);
        }

        .expense-card:hover .card-actions {
          opacity: 1;
        }

        .card-actions {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .edit-btn {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .edit-btn:hover {
          background: rgba(59, 130, 246, 0.2);
          transform: scale(1.1);
        }

        .delete-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: scale(1.1);
        }

        .icon-container {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          border: 2px solid rgba(239, 68, 68, 0.3);
        }

        .expense-icon {
          font-size: 32px;
        }

        .expense-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.01em;
        }

        .expense-amount {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .expense-category {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          margin-bottom: 1rem;
        }

        .expense-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .summary-card {
            padding: 1.5rem;
            border-radius: 16px;
            margin-bottom: 1.5rem;
          }

          .summary-content {
            gap: 0.75rem;
            margin-bottom: 0.75rem;
          }

          .summary-info h3 {
            font-size: 1rem;
          }

          .total-amount {
            font-size: 1.5rem;
          }

          .summary-subtitle {
            font-size: 0.8rem;
          }

          .expense-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .expense-card {
            padding: 1.25rem;
            border-radius: 16px;
          }

          .card-actions {
            opacity: 1;
            position: relative;
            top: auto;
            right: auto;
            justify-content: flex-end;
            margin-bottom: 1rem;
          }

          .action-btn {
            width: 32px;
            height: 32px;
          }

          .icon-container {
            width: 50px;
            height: 50px;
            margin-bottom: 0.75rem;
          }

          .expense-icon {
            font-size: 24px;
          }

          .expense-name {
            font-size: 1.125rem;
            margin-bottom: 0.5rem;
          }

          .expense-amount {
            font-size: 1.25rem;
            margin-bottom: 0.75rem;
          }

          .expense-category {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
            margin-bottom: 0.75rem;
          }

          .expense-date {
            font-size: 0.8rem;
          }
        }

        /* Tablet Responsive Styles */
        @media (min-width: 768px) and (max-width: 1024px) {
          .expense-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.25rem;
          }

          .expense-card {
            padding: 1.375rem;
          }

          .summary-card {
            padding: 1.75rem;
          }

          .total-amount {
            font-size: 1.75rem;
          }
        }

        /* Small mobile devices */
        @media (max-width: 480px) {
          .expense-card {
            padding: 1rem;
          }

          .summary-card {
            padding: 1.25rem;
          }

          .total-amount {
            font-size: 1.375rem;
          }

          .expense-amount {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ExpenseList;