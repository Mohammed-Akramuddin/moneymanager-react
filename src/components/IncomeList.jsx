import React from 'react';
import { TrendingUp, Pencil, Trash2, DollarSign, Calendar } from 'lucide-react';

function IncomeList({ incomes = [], onEditIncome, onDeleteIncome, loading = false }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner" />
          <p>Loading incomes...</p>
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
            border-top: 3px solid #22c55e;
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

  if (incomes.length === 0) {
    return (
      <div className="empty-state">
        <TrendingUp size={48} />
        <h3>No income records found</h3>
        <p>Start adding your income sources to track your earnings</p>
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

  const totalIncome = incomes.reduce((sum, income) => sum + (income.amount || 0), 0);

  return (
    <div className="income-list-container">
      <div className="summary-card">
        <div className="summary-content">
          <TrendingUp size={32} />
          <div className="summary-info">
            <h3>Total Income</h3>
            <p className="total-amount">{formatCurrency(totalIncome)}</p>
          </div>
        </div>
        <p className="summary-subtitle">
          From {incomes.length} income source{incomes.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="income-grid">
        {incomes.map((income) => (
          <div key={income.id} className="income-card">
            <div className="card-actions">
              <button
                onClick={() => onEditIncome?.(income)}
                className="action-btn edit-btn"
                title="Edit income"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onDeleteIncome?.(income)}
                className="action-btn delete-btn"
                title="Delete income"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="icon-container">
              {income.icon ? (
                <span className="income-icon">{income.icon}</span>
              ) : (
                <TrendingUp size={32} style={{ color: '#22c55e' }} />
              )}
            </div>

            <h3 className="income-name">{income.name}</h3>
            
            <div className="income-amount">
              <DollarSign size={20} />
              {formatCurrency(income.amount || 0)}
            </div>

            {income.category && (
              <div className="income-category">
                {income.category.icon && <span>{income.category.icon}</span>}
                {income.category.name}
              </div>
            )}

            <div className="income-date">
              <Calendar size={16} />
              {formatDate(income.createdAt || income.date)}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .income-list-container {
          margin-top: 1rem;
        }

        .summary-card {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          border-radius: 20px;
          padding: 2rem;
          color: white;
          margin-bottom: 2rem;
          box-shadow: 0 8px 32px rgba(34, 197, 94, 0.3);
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

        .income-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .income-card {
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

        .income-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.2);
          border-color: rgba(34, 197, 94, 0.3);
        }

        .income-card:hover .card-actions {
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
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          border: 2px solid rgba(34, 197, 94, 0.3);
        }

        .income-icon {
          font-size: 32px;
        }

        .income-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.01em;
        }

        .income-amount {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .income-category {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          margin-bottom: 1rem;
        }

        .income-date {
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

          .income-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .income-card {
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

          .income-icon {
            font-size: 24px;
          }

          .income-name {
            font-size: 1.125rem;
            margin-bottom: 0.5rem;
          }

          .income-amount {
            font-size: 1.25rem;
            margin-bottom: 0.75rem;
          }

          .income-category {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
            margin-bottom: 0.75rem;
          }

          .income-date {
            font-size: 0.8rem;
          }
        }

        /* Tablet Responsive Styles */
        @media (min-width: 768px) and (max-width: 1024px) {
          .income-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.25rem;
          }

          .income-card {
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
          .income-card {
            padding: 1rem;
          }

          .summary-card {
            padding: 1.25rem;
          }

          .total-amount {
            font-size: 1.375rem;
          }

          .income-amount {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </div>
  );
}

export default IncomeList;