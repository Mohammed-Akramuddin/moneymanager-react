import React, { useState } from 'react'
import Dashboard from '../components/Dashboard'
import useUser from '../hooks/useUser'
import { Search, Filter as FilterIcon, Calendar, DollarSign, Tag, TrendingUp, TrendingDown, RefreshCw, FileText } from 'lucide-react';
import AxiosConfig from '../util/AxiosConfig';
import { API_ENDPOINTS } from '../util/ApiEndpoints';

function Filter() {
  useUser();

  const [type, setType] = useState("income");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [keyword, setKeyword] = useState("")
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);

    try {
      const response = await AxiosConfig.post(API_ENDPOINTS.APPLY_FILTER, {
        type,
        startDate,
        endDate,
        keyword,
        sortField,
        sortOrder
      });
      setTransactions(response.data);
    } catch (error) {
      console.log(error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }

  const handleReset = () => {
    setType("income");
    setStartDate("");
    setEndDate("");
    setKeyword("");
    setSortField("date");
    setSortOrder("asc");
    setTransactions([]);
    setHasSearched(false);
  };

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

  return (
    <Dashboard>
      <div className="filter-container">
        {/* Header Section */}
        <div className="filter-header">
          <h1 className="filter-title">Filter Transactions</h1>
          <p className="filter-subtitle">
            Search and filter your transactions with advanced criteria
          </p>
        </div>

        {/* Form Card */}
        <div className="filter-form-card">
          <div className="filter-form-header">
            <h2 className="filter-form-title">
              <FilterIcon className="filter-icon" size={20} />
              Filter Criteria
            </h2>
            <p className="filter-form-subtitle">
              Customize your search parameters to find specific transactions
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="filter-form-grid">
              {/* Transaction Type */}
              <div className="filter-input-group">
                <label className="filter-label">
                  <Tag size={16} />
                  Transaction Type
                </label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="filter-select"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="filter-input-group filter-date-group">
                <label className="filter-label">
                  <Calendar size={16} />
                  Date Range
                </label>
                <div className="filter-date-inputs">
                  <div className="filter-date-wrapper">
                    <label className="filter-date-label">Start Date</label>
                    <input 
                      type='date' 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                      className="filter-input"
                    />
                  </div>
                  <div className="filter-date-wrapper">
                    <label className="filter-date-label">End Date</label>
                    <input 
                      type='date' 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                      className="filter-input"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Field */}
              <div className="filter-input-group">
                <label className="filter-label">
                  <TrendingUp size={16} />
                  Sort By
                </label>
                <select 
                  value={sortField} 
                  onChange={(e) => setSortField(e.target.value)}
                  className="filter-select"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="category">Category</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="filter-input-group">
                <label className="filter-label">
                  <TrendingDown size={16} />
                  Sort Order
                </label>
                <select 
                  value={sortOrder} 
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="filter-select"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              {/* Keyword */}
              <div className="filter-input-group filter-keyword-group">
                <label className="filter-label">
                  <FileText size={16} />
                  Search Keyword
                </label>
                <input 
                  value={keyword} 
                  type="text" 
                  onChange={(e) => setKeyword(e.target.value)}
                  className="filter-input"
                  placeholder="Search in transaction names, descriptions..."
                />
              </div>
            </div>

            <div className="filter-button-container">
              <button
                type="button"
                onClick={handleReset}
                className="filter-button filter-button-secondary"
              >
                <RefreshCw size={18} />
                <span>Reset</span>
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="filter-button filter-button-primary"
              >
                <Search size={18} className={loading ? 'filter-spin' : ''} />
                <span>{loading ? 'Searching...' : 'Search Transactions'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="filter-results-card">
            <div className="filter-results-header">
              <div className="filter-results-info">
                <h3 className="filter-results-title">Search Results</h3>
                <p className="filter-results-subtitle">
                  {loading ? 'Searching...' : `Found ${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`}
                </p>
              </div>
              
              {transactions.length > 0 && (
                <div className="filter-total-amount">
                  Total: {formatCurrency(
                    transactions.reduce((sum, t) => sum + (t.amount || 0), 0)
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <div className="filter-loading">
                <div className="filter-loading-content">
                  <div className="filter-spinner" />
                  <p>Searching transactions...</p>
                </div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="filter-no-results">
                <Search size={48} className="filter-no-results-icon" />
                <h3 className="filter-no-results-title">No transactions found</h3>
                <p className="filter-no-results-subtitle">
                  Try adjusting your search criteria or date range
                </p>
              </div>
            ) : (
              <div className="filter-transaction-grid">
                {transactions.map((transaction, index) => (
                  <div key={transaction.id || index} className="filter-transaction-card">
                    <div className={`filter-transaction-type ${transaction.type === 'income' || type === 'income' ? 'income' : 'expense'}`}>
                      {transaction.type === 'income' || type === 'income' ? (
                        <>
                          <TrendingUp size={16} />
                          Income
                        </>
                      ) : (
                        <>
                          <TrendingDown size={16} />
                          Expense
                        </>
                      )}
                    </div>

                    <h4 className="filter-transaction-name">
                      {transaction.name || transaction.description || 'Unnamed Transaction'}
                    </h4>

                    <div className={`filter-transaction-amount ${transaction.type === 'income' || type === 'income' ? 'income' : 'expense'}`}>
                      <DollarSign size={20} />
                      {formatCurrency(transaction.amount || 0)}
                    </div>

                    {transaction.category && (
                      <div className="filter-transaction-category">
                        {transaction.category.icon && <span>{transaction.category.icon}</span>}
                        {transaction.category.name || transaction.category}
                      </div>
                    )}

                    <div className="filter-transaction-date">
                      <Calendar size={16} />
                      {formatDate(transaction.createdAt || transaction.date)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .filter-container {
          padding: 0;
          position: relative;
          z-index: 1;
        }

        .filter-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(59, 130, 246, 0.1);
        }

        .filter-title {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.02em;
        }

        .filter-subtitle {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }

        .filter-form-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }

        .filter-form-header {
          margin-bottom: 1rem;
          padding: 0;
        }

        .filter-form-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-form-subtitle {
          color: #64748b;
          margin: 0;
          font-size: 0.875rem;
        }

        .filter-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
          width: 100%;
        }

        .filter-input-group {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-input,
        .filter-select {
          padding: 10px 12px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.2s ease;
          font-family: inherit;
          background: white;
          width: 100%;
          box-sizing: border-box;
          min-width: 0;
        }

        .filter-select {
          cursor: pointer;
        }

        .filter-input:focus,
        .filter-select:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          outline: none !important;
        }

        .filter-date-inputs {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
        }

        .filter-date-wrapper {
          width: 100%;
          min-width: 0;
        }

        .filter-date-label {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
          display: block;
          font-weight: 500;
        }

        .filter-button-container {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
          flex-direction: column;
          margin-top: 1rem;
        }

        .filter-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          width: 100%;
          box-sizing: border-box;
          min-width: 0;
        }

        .filter-button-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .filter-button-primary:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .filter-button-secondary {
          background: transparent;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .filter-button-secondary:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
          transform: translateY(-2px);
        }

        .filter-results-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }

        .filter-results-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .filter-results-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.25rem 0;
        }

        .filter-results-subtitle {
          color: #64748b;
          margin: 0;
          font-size: 0.875rem;
        }

        .filter-total-amount {
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-align: center;
          word-break: break-word;
        }

        .filter-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 3rem;
          color: #64748b;
        }

        .filter-loading-content {
          text-align: center;
        }

        .filter-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem auto;
        }

        .filter-no-results {
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 16px;
          border: 2px dashed #e2e8f0;
        }

        .filter-no-results-icon {
          color: #94a3b8;
          margin-bottom: 1rem;
        }

        .filter-no-results-title {
          color: #64748b;
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .filter-no-results-subtitle {
          color: #94a3b8;
          margin: 0;
          font-size: 0.875rem;
        }

        .filter-transaction-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
          margin-top: 1.5rem;
          width: 100%;
        }

        .filter-transaction-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }

        .filter-transaction-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
        }

        .filter-transaction-type {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .filter-transaction-type.income {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .filter-transaction-type.expense {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .filter-transaction-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          word-break: break-word;
        }

        .filter-transaction-amount {
          font-size: 1.125rem;
          font-weight: 800;
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          word-break: break-word;
        }

        .filter-transaction-amount.income {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .filter-transaction-amount.expense {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .filter-transaction-category {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 500;
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
          margin-bottom: 0.75rem;
          word-break: break-word;
        }

        .filter-transaction-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .filter-spin {
          animation: spin 1s linear infinite;
        }

        /* Tablet Styles */
        @media (min-width: 640px) {
          .filter-title {
            font-size: 1.75rem;
          }

          .filter-subtitle {
            font-size: 0.95rem;
          }

          .filter-form-card {
            padding: 1.5rem;
            border-radius: 24px;
          }

          .filter-form-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .filter-date-inputs {
            flex-direction: row;
            gap: 0.75rem;
          }

          .filter-button-container {
            flex-direction: row;
            justify-content: flex-end;
          }

          .filter-button {
            width: auto;
            font-size: 0.875rem;
          }

          .filter-results-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .filter-results-card {
            padding: 1.5rem;
            border-radius: 24px;
          }

          .filter-total-amount {
            font-size: 0.875rem;
          }

          .filter-transaction-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .filter-transaction-name {
            font-size: 1rem;
          }

          .filter-transaction-amount {
            font-size: 1.25rem;
          }
        }

        /* Desktop Styles */
        @media (min-width: 1024px) {
          .filter-form-card {
            padding: 2rem;
          }

          .filter-form-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }

          .filter-keyword-group {
            grid-column: span 2;
          }

          .filter-date-group {
            grid-column: span 2;
          }

          .filter-results-card {
            padding: 2rem;
          }

          .filter-total-amount {
            font-size: 1rem;
          }

          .filter-transaction-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
          }

          .filter-transaction-card {
            padding: 1.5rem;
          }

          .filter-transaction-name {
            font-size: 1.125rem;
          }

          .filter-transaction-amount {
            font-size: 1.5rem;
          }
        }

        /* Large Desktop Styles */
        @media (min-width: 1280px) {
          .filter-transaction-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          }
        }
      `}</style>
    </Dashboard>
  )
}

export default Filter