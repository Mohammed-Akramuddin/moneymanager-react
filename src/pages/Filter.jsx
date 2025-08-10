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

  // Styles
  const containerStyle = {
    padding: '0',
    position: 'relative',
    zIndex: 1
  };

  const headerStyle = {
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '2px solid rgba(59, 130, 246, 0.1)'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.02em'
  };

  const subtitleStyle = {
    fontSize: '1rem',
    color: '#64748b',
    margin: 0,
    fontWeight: '500'
  };

  const formCardStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    marginBottom: '2rem'
  };

  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column'
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const inputStyle = {
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
  };

  const selectStyle = {
    ...inputStyle,
    background: 'white',
    cursor: 'pointer'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2e8f0'
  };

  const primaryButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  };

  const secondaryButtonStyle = {
    ...primaryButtonStyle,
    background: 'transparent',
    color: '#64748b',
    border: '2px solid #e2e8f0',
    boxShadow: 'none'
  };

  const resultsCardStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
  };

  const transactionGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem'
  };

  const transactionCardStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    position: 'relative',
    overflow: 'hidden'
  };

  const transactionTypeStyle = (transactionType) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    background: transactionType === 'income' 
      ? 'rgba(34, 197, 94, 0.1)' 
      : 'rgba(239, 68, 68, 0.1)',
    color: transactionType === 'income' ? '#22c55e' : '#ef4444',
    marginBottom: '1rem'
  });

  const transactionAmountStyle = (transactionType) => ({
    fontSize: '1.5rem',
    fontWeight: '800',
    background: transactionType === 'income' 
      ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 0.5rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  });

  const transactionNameStyle = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 0.5rem 0'
  };

  const transactionDateStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#64748b',
    fontSize: '0.875rem',
    fontWeight: '500'
  };

  return (
    <Dashboard>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Filter Transactions</h1>
          <p style={subtitleStyle}>
            Search and filter your transactions with advanced criteria
          </p>
        </div>

        <div style={formCardStyle}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              color: '#1f2937', 
              margin: '0 0 0.5rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FilterIcon size={20} />
              Filter Criteria
            </h2>
            <p style={{ 
              color: '#64748b', 
              margin: 0, 
              fontSize: '0.875rem' 
            }}>
              Customize your search parameters to find specific transactions
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={formGridStyle}>
              {/* Transaction Type */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>
                  <Tag size={16} />
                  Transaction Type
                </label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  style={selectStyle}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              {/* Date Range */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>
                  <Calendar size={16} />
                  Date Range
                </label>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div>
                    <label style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem',
                      display: 'block',
                      fontWeight: '500'
                    }}>
                      Start Date
                    </label>
                    <input 
                      type='date' 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                      style={inputStyle}
                      placeholder="Start Date"
                    />
                  </div>
                  <div>
                    <label style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem',
                      display: 'block',
                      fontWeight: '500'
                    }}>
                      End Date
                    </label>
                    <input 
                      type='date' 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                      style={inputStyle}
                      placeholder="End Date"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Field */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>
                  <TrendingUp size={16} />
                  Sort By
                </label>
                <select 
                  value={sortField} 
                  onChange={(e) => setSortField(e.target.value)}
                  style={selectStyle}
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="category">Category</option>
                </select>
              </div>

              {/* Sort Order */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>
                  <TrendingDown size={16} />
                  Sort Order
                </label>
                <select 
                  value={sortOrder} 
                  onChange={(e) => setSortOrder(e.target.value)}
                  style={selectStyle}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              {/* Keyword */}
              <div style={{ ...inputGroupStyle, gridColumn: 'span 2' }}>
                <label style={labelStyle}>
                  <FileText size={16} />
                  Search Keyword
                </label>
                <input 
                  value={keyword} 
                  type="text" 
                  onChange={(e) => setKeyword(e.target.value)}
                  style={inputStyle}
                  placeholder="Search in transaction names, descriptions..."
                />
              </div>
            </div>

            <div style={buttonContainerStyle}>
              <button
                type="button"
                onClick={handleReset}
                style={secondaryButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.color = '#3b82f6';
                  e.target.style.background = 'rgba(59, 130, 246, 0.05)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.color = '#64748b';
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <RefreshCw size={18} />
                Reset
              </button>
              
              <button
                type="submit"
                disabled={loading}
                style={primaryButtonStyle}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                    e.target.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                  }
                }}
              >
                <Search size={18} style={{ 
                  animation: loading ? 'spin 1s linear infinite' : 'none' 
                }} />
                {loading ? 'Searching...' : 'Search Transactions'}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div style={resultsCardStyle}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1.5rem' 
            }}>
              <div>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700', 
                  color: '#1f2937', 
                  margin: '0 0 0.25rem 0' 
                }}>
                  Search Results
                </h3>
                <p style={{ 
                  color: '#64748b', 
                  margin: 0, 
                  fontSize: '0.875rem' 
                }}>
                  {loading ? 'Searching...' : `Found ${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`}
                </p>
              </div>
              
              {transactions.length > 0 && (
                <div style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  Total: {formatCurrency(
                    transactions.reduce((sum, t) => sum + (t.amount || 0), 0)
                  )}
                </div>
              )}
            </div>

            {loading ? (
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
                    borderTop: '3px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem auto'
                  }} />
                  <p>Searching transactions...</p>
                </div>
              </div>
            ) : transactions.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '16px',
                border: '2px dashed #e2e8f0'
              }}>
                <Search size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                <h3 style={{ 
                  color: '#64748b', 
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.125rem',
                  fontWeight: '600'
                }}>
                  No transactions found
                </h3>
                <p style={{ color: '#94a3b8', margin: 0 }}>
                  Try adjusting your search criteria or date range
                </p>
              </div>
            ) : (
              <div style={transactionGridStyle}>
                {transactions.map((transaction, index) => (
                  <div
                    key={transaction.id || index}
                    style={transactionCardStyle}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-4px) scale(1.02)';
                      e.target.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    <div style={transactionTypeStyle(transaction.type || type)}>
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

                    <h4 style={transactionNameStyle}>
                      {transaction.name || transaction.description || 'Unnamed Transaction'}
                    </h4>

                    <div style={transactionAmountStyle(transaction.type || type)}>
                      <DollarSign size={20} />
                      {formatCurrency(transaction.amount || 0)}
                    </div>

                    {transaction.category && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: 'rgba(107, 114, 128, 0.1)',
                        color: '#6b7280',
                        marginBottom: '0.75rem'
                      }}>
                        {transaction.category.icon && <span>{transaction.category.icon}</span>}
                        {transaction.category.name || transaction.category}
                      </div>
                    )}

                    <div style={transactionDateStyle}>
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

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          input:focus, select:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            outline: none !important;
          }
        `}
      </style>
    </Dashboard>
  )
}

export default Filter