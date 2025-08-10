import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  DollarSign,
  PieChart,
  Eye
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import AxiosConfig from '../util/AxiosConfig';
import { API_ENDPOINTS } from '../util/ApiEndpoints';

function HomePage({ onNavigate }) {
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    topIncomes: [],
    topExpenses: [],
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch incomes and expenses concurrently
      const [incomesResponse, expensesResponse] = await Promise.all([
        AxiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES),
        AxiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES)
      ]);

      const incomes = incomesResponse.data || [];
      const expenses = expensesResponse.data || [];

      // Calculate totals
      const totalIncome = incomes.reduce((sum, item) => sum + (item.amount || 0), 0);
      const totalExpense = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
      const balance = totalIncome - totalExpense;

      // Get top 5 incomes and expenses
      const topIncomes = incomes
        .sort((a, b) => (b.amount || 0) - (a.amount || 0))
        .slice(0, 5);
      
      const topExpenses = expenses
        .sort((a, b) => (b.amount || 0) - (a.amount || 0))
        .slice(0, 5);

      // Combine and sort recent transactions
      const allTransactions = [
        ...incomes.map(item => ({ ...item, type: 'income' })),
        ...expenses.map(item => ({ ...item, type: 'expense' }))
      ].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
       .slice(0, 8);

      setDashboardData({
        totalIncome,
        totalExpense,
        balance,
        topIncomes,
        topExpenses,
        recentTransactions: allTransactions
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Prepare pie chart data
  const pieChartData = [
    { 
      name: 'Income', 
      value: dashboardData.totalIncome, 
      color: '#22c55e',
      percentage: dashboardData.totalIncome + dashboardData.totalExpense > 0 
        ? ((dashboardData.totalIncome / (dashboardData.totalIncome + dashboardData.totalExpense)) * 100).toFixed(1)
        : 0
    },
    { 
      name: 'Expenses', 
      value: dashboardData.totalExpense, 
      color: '#ef4444',
      percentage: dashboardData.totalIncome + dashboardData.totalExpense > 0 
        ? ((dashboardData.totalExpense / (dashboardData.totalIncome + dashboardData.totalExpense)) * 100).toFixed(1)
        : 0
    }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          minWidth: '150px'
        }}>
          <p style={{ 
            margin: '0 0 4px 0', 
            fontWeight: '600', 
            color: '#1f2937',
            fontSize: '14px'
          }}>
            {data.name}
          </p>
          <p style={{ 
            margin: '0 0 4px 0', 
            fontWeight: '700', 
            color: data.color,
            fontSize: '16px'
          }}>
            {formatCurrency(data.value)}
          </p>
          <p style={{ 
            margin: '0', 
            fontSize: '12px',
            color: '#6b7280'
          }}>
            {data.percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '2rem',
        marginTop: '1rem'
      }}>
        {payload.map((entry, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem' 
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: entry.color
            }} />
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: '600',
              color: '#374151'
            }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Styles
  const containerStyle = {
    padding: '0',
    minHeight: '100vh'
  };

  const headerStyle = {
    marginBottom: '2rem',
    paddingBottom: '1.5rem'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.02em'
  };

  const subtitleStyle = {
    fontSize: '1.125rem',
    color: '#64748b',
    margin: 0,
    fontWeight: '500'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  };

  const statCardStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    position: 'relative',
    overflow: 'hidden'
  };

  const getCardHoverStyle = () => ({
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
  });

  const cardIconStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem'
  };

  const cardValueStyle = {
    fontSize: '2rem',
    fontWeight: '800',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.01em'
  };

  const cardLabelStyle = {
    fontSize: '0.875rem',
    fontWeight: '600',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const sectionStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    marginBottom: '2rem'
  };

  const sectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  };

  const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0
  };

  const moreButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'transparent',
    color: '#6366f1',
    border: '2px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const transactionItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    marginBottom: '0.75rem',
    transition: 'all 0.2s ease'
  };

  const transactionIconStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px'
  };

  const transactionInfoStyle = {
    flex: 1
  };

  const transactionNameStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 0.25rem 0'
  };

  const transactionDateStyle = {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: 0
  };

  const transactionAmountStyle = {
    fontSize: '1.125rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const gridLayoutStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem'
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        color: '#64748b'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }} />
          <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Dashboard</h1>
        <p style={subtitleStyle}>
          Welcome back! Here's an overview of your financial status.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={statsGridStyle}>
        {/* Balance Card */}
        <div
          style={{
            ...statCardStyle,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            const hoverStyle = getCardHoverStyle();
            Object.assign(e.currentTarget.style, hoverStyle);
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, {
              ...statCardStyle,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white'
            });
          }}
        >
          <div style={{ ...cardIconStyle, background: 'rgba(255, 255, 255, 0.2)' }}>
            <Wallet size={32} />
          </div>
          <h3 style={cardValueStyle}>{formatCurrency(dashboardData.balance)}</h3>
          <p style={{ ...cardLabelStyle, opacity: 0.9 }}>Total Balance</p>
        </div>

        {/* Total Income Card */}
        <div
          style={{
            ...statCardStyle,
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            const hoverStyle = getCardHoverStyle();
            Object.assign(e.currentTarget.style, hoverStyle);
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, {
              ...statCardStyle,
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white'
            });
          }}
        >
          <div style={{ ...cardIconStyle, background: 'rgba(255, 255, 255, 0.2)' }}>
            <TrendingUp size={32} />
          </div>
          <h3 style={cardValueStyle}>{formatCurrency(dashboardData.totalIncome)}</h3>
          <p style={{ ...cardLabelStyle, opacity: 0.9 }}>Total Income</p>
        </div>

        {/* Total Expense Card */}
        <div
          style={{
            ...statCardStyle,
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            const hoverStyle = getCardHoverStyle();
            Object.assign(e.currentTarget.style, hoverStyle);
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, {
              ...statCardStyle,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white'
            });
          }}
        >
          <div style={{ ...cardIconStyle, background: 'rgba(255, 255, 255, 0.2)' }}>
            <TrendingDown size={32} />
          </div>
          <h3 style={cardValueStyle}>{formatCurrency(dashboardData.totalExpense)}</h3>
          <p style={{ ...cardLabelStyle, opacity: 0.9 }}>Total Expense</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Recent Transactions</h2>
        </div>

        {dashboardData.recentTransactions.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '0.75rem'
          }}>
            {dashboardData.recentTransactions.map((transaction, index) => (
              <div
                key={`${transaction.type}-${transaction.id || index}`}
                style={transactionItemStyle}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  ...transactionIconStyle,
                  background: transaction.type === 'income' 
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))',
                  border: `2px solid ${transaction.type === 'income' 
                    ? 'rgba(34, 197, 94, 0.3)'
                    : 'rgba(239, 68, 68, 0.3)'}`
                }}>
                  {transaction.icon || (transaction.type === 'income' ? '💰' : '💸')}
                </div>
                <div style={transactionInfoStyle}>
                  <h4 style={transactionNameStyle}>{transaction.name}</h4>
                  <p style={transactionDateStyle}>
                    <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {formatDate(transaction.createdAt || transaction.date)}
                  </p>
                </div>
                <div style={{
                  ...transactionAmountStyle,
                  color: transaction.type === 'income' ? '#22c55e' : '#ef4444'
                }}>
                  {transaction.type === 'income' ? (
                    <>
                      <ArrowUpRight size={16} />
                      +{formatCurrency(transaction.amount || 0)}
                    </>
                  ) : (
                    <>
                      <ArrowDownRight size={16} />
                      -{formatCurrency(transaction.amount || 0)}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <PieChart size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
              No transactions yet
            </h3>
            <p style={{ margin: 0 }}>Start adding income and expenses to see your activity here</p>
          </div>
        )}
      </div>

      {/* Financial Overview Pie Chart */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Financial Overview</h2>
        </div>
        
        {dashboardData.totalIncome > 0 || dashboardData.totalExpense > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
            alignItems: 'center'
          }}>
            {/* Pie Chart */}
            <div style={{ height: '350px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke={entry.color}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} />
                </RechartsPieChart>
              </ResponsiveContainer>
              
              {/* Center Balance Display */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none'
              }}>
                <p style={{
                  margin: '0 0 0.25rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Balance
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  color: dashboardData.balance >= 0 ? '#22c55e' : '#ef4444'
                }}>
                  {formatCurrency(dashboardData.balance)}
                </p>
              </div>
            </div>

            {/* Summary Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.05)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '2px solid rgba(34, 197, 94, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <TrendingUp size={24} style={{ color: '#22c55e' }} />
                  <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                    Total Income
                  </h3>
                </div>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '800', color: '#22c55e' }}>
                  {formatCurrency(dashboardData.totalIncome)}
                </p>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                  {pieChartData[0]?.percentage}% of total transactions
                </p>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.05)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '2px solid rgba(239, 68, 68, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <TrendingDown size={24} style={{ color: '#ef4444' }} />
                  <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                    Total Expenses
                  </h3>
                </div>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '800', color: '#ef4444' }}>
                  {formatCurrency(dashboardData.totalExpense)}
                </p>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                  {pieChartData[1]?.percentage}% of total transactions
                </p>
              </div>

              <div style={{
                background: dashboardData.balance >= 0 
                  ? 'rgba(34, 197, 94, 0.05)' 
                  : 'rgba(239, 68, 68, 0.05)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: `2px solid ${dashboardData.balance >= 0 
                  ? 'rgba(34, 197, 94, 0.1)' 
                  : 'rgba(239, 68, 68, 0.1)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <Wallet size={24} style={{ 
                    color: dashboardData.balance >= 0 ? '#22c55e' : '#ef4444' 
                  }} />
                  <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                    Net Balance
                  </h3>
                </div>
                <p style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontSize: '2rem', 
                  fontWeight: '800', 
                  color: dashboardData.balance >= 0 ? '#22c55e' : '#ef4444' 
                }}>
                  {formatCurrency(dashboardData.balance)}
                </p>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                  {dashboardData.balance >= 0 ? 'Positive' : 'Negative'} cash flow
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <PieChart size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
              No financial data available
            </h3>
            <p style={{ margin: 0 }}>Add income and expenses to see your financial overview</p>
          </div>
        )}
      </div>

      {/* Top Incomes and Expenses Grid */}
      <div style={gridLayoutStyle}>
        {/* Top 5 Incomes */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>Top Income Sources</h2>
            <button
              style={moreButtonStyle}
              onClick={() => onNavigate?.('/income')}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                e.target.style.borderColor = '#6366f1';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <Eye size={16} />
              View All
            </button>
          </div>
          
          {dashboardData.topIncomes.length > 0 ? (
            dashboardData.topIncomes.map((income, index) => (
              <div
                key={income.id || index}
                style={transactionItemStyle}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  ...transactionIconStyle,
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))',
                  border: '2px solid rgba(34, 197, 94, 0.3)'
                }}>
                  {income.icon || '💰'}
                </div>
                <div style={transactionInfoStyle}>
                  <h4 style={transactionNameStyle}>{income.name}</h4>
                  <p style={transactionDateStyle}>
                    <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {formatDate(income.createdAt || income.date)}
                  </p>
                </div>
                <div style={{
                  ...transactionAmountStyle,
                  color: '#22c55e'
                }}>
                  <ArrowUpRight size={16} />
                  +{formatCurrency(income.amount || 0)}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              <TrendingUp size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No income records yet</p>
            </div>
          )}
        </div>

        {/* Top 5 Expenses */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>Top Expenses</h2>
            <button
              style={moreButtonStyle}
              onClick={() => onNavigate?.('/expenses')}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                e.target.style.borderColor = '#6366f1';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <Eye size={16} />
              View All
            </button>
          </div>
          
          {dashboardData.topExpenses.length > 0 ? (
            dashboardData.topExpenses.map((expense, index) => (
              <div
                key={expense.id || index}
                style={transactionItemStyle}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  ...transactionIconStyle,
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))',
                  border: '2px solid rgba(239, 68, 68, 0.3)'
                }}>
                  {expense.icon || '💸'}
                </div>
                <div style={transactionInfoStyle}>
                  <h4 style={transactionNameStyle}>{expense.name}</h4>
                  <p style={transactionDateStyle}>
                    <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {formatDate(expense.createdAt || expense.date)}
                  </p>
                </div>
                <div style={{
                  ...transactionAmountStyle,
                  color: '#ef4444'
                }}>
                  <ArrowDownRight size={16} />
                  -{formatCurrency(expense.amount || 0)}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              <TrendingDown size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No expense records yet</p>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default HomePage;