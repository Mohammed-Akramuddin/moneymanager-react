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
        <div className="custom-tooltip">
          <p className="tooltip-label">
            {data.name}
          </p>
          <p className="tooltip-value" style={{ color: data.color }}>
            {formatCurrency(data.value)}
          </p>
          <p className="tooltip-percentage">
            {data.percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="chart-legend">
        {payload.map((entry, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="legend-text">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner" />
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage-container">
      <style>
        {`
          .homepage-container {
            padding: 0;
            min-height: 100vh;
            width: 100%;
          }
          
          .page-header {
            margin-bottom: 1rem;
            padding-bottom: 1rem;
          }
          
          .page-title {
            font-size: clamp(1.5rem, 4vw, 2.5rem);
            font-weight: 800;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 0 0 0.5rem 0;
            letter-spacing: -0.02em;
          }
          
          .page-subtitle {
            font-size: clamp(0.875rem, 2.5vw, 1.125rem);
            color: #64748b;
            margin: 0;
            font-weight: 500;
            line-height: 1.5;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
            gap: clamp(1rem, 3vw, 1.5rem);
            margin-bottom: clamp(1.5rem, 4vw, 3rem);
            width: 100%;
          }
          
          .stat-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px);
            border-radius: clamp(16px, 4vw, 24px);
            padding: clamp(1.25rem, 4vw, 2rem);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
            min-height: clamp(120px, 20vw, 150px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: white;
          }
          
          .stat-card:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
          }
          
          .stat-card.balance-card {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          }
          
          .stat-card.income-card {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          }
          
          .stat-card.expense-card {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          }
          
          .card-icon {
            width: clamp(40px, 10vw, 60px);
            height: clamp(40px, 10vw, 60px);
            border-radius: clamp(12px, 3vw, 16px);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: clamp(0.75rem, 2vw, 1.5rem);
            background: rgba(255, 255, 255, 0.2);
            flex-shrink: 0;
          }
          
          .card-value {
            font-size: clamp(1.25rem, 4vw, 2rem);
            font-weight: 800;
            margin: 0 0 0.5rem 0;
            letter-spacing: -0.01em;
            line-height: 1.1;
            word-break: break-all;
          }
          
          .card-label {
            font-size: clamp(0.75rem, 2vw, 0.875rem);
            font-weight: 600;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            opacity: 0.9;
          }
          
          .section-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px);
            border-radius: clamp(16px, 4vw, 24px);
            padding: clamp(1.25rem, 4vw, 2rem);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
            margin-bottom: clamp(1.5rem, 4vw, 2rem);
            width: 100%;
          }
          
          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: clamp(1rem, 3vw, 1.5rem);
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          .section-title {
            font-size: clamp(1rem, 3vw, 1.25rem);
            font-weight: 700;
            color: #1f2937;
            margin: 0;
          }
          
          .transactions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
            gap: clamp(0.5rem, 2vw, 0.75rem);
            width: 100%;
          }
          
          .transaction-item {
            display: flex;
            align-items: center;
            gap: clamp(0.75rem, 2vw, 1rem);
            padding: clamp(0.75rem, 2vw, 1rem);
            background: rgba(255, 255, 255, 0.6);
            border-radius: clamp(12px, 3vw, 16px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            transition: all 0.2s ease;
            min-width: 0;
          }
          
          .transaction-item:hover {
            background: rgba(255, 255, 255, 0.8);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .transaction-icon {
            width: clamp(32px, 8vw, 48px);
            height: clamp(32px, 8vw, 48px);
            border-radius: clamp(8px, 2vw, 12px);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: clamp(16px, 4vw, 20px);
            flex-shrink: 0;
          }
          
          .transaction-icon.income {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1));
            border: 2px solid rgba(34, 197, 94, 0.3);
          }
          
          .transaction-icon.expense {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1));
            border: 2px solid rgba(239, 68, 68, 0.3);
          }
          
          .transaction-info {
            flex: 1;
            min-width: 0;
          }
          
          .transaction-name {
            font-size: clamp(0.875rem, 2.5vw, 1rem);
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 0.25rem 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .transaction-date {
            font-size: clamp(0.7rem, 2vw, 0.75rem);
            color: #6b7280;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 4px;
          }
          
          .transaction-amount {
            font-size: clamp(0.875rem, 2.5vw, 1.125rem);
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex-shrink: 0;
          }
          
          .income-amount {
            color: #22c55e;
          }
          
          .expense-amount {
            color: #ef4444;
          }
          
          .overview-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: clamp(1.5rem, 4vw, 2rem);
            align-items: start;
          }
          
          .chart-container {
            height: clamp(250px, 50vw, 350px);
            position: relative;
            width: 100%;
          }
          
          .chart-center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            pointer-events: none;
            z-index: 10;
          }
          
          .chart-center-label {
            margin: 0 0 0.25rem 0;
            font-size: clamp(0.7rem, 2vw, 0.875rem);
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .chart-center-value {
            margin: 0;
            font-size: clamp(1rem, 3vw, 1.5rem);
            font-weight: 800;
            color: #1f2937;
          }
          
          .chart-legend {
            display: flex;
            justify-content: center;
            gap: clamp(1rem, 4vw, 2rem);
            margin-top: 1rem;
            flex-wrap: wrap;
          }
          
          .legend-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .legend-color {
            width: clamp(8px, 2vw, 12px);
            height: clamp(8px, 2vw, 12px);
            border-radius: 50%;
          }
          
          .legend-text {
            font-size: clamp(0.75rem, 2vw, 0.875rem);
            font-weight: 600;
            color: #374151;
          }
          
          .summary-stats {
            display: flex;
            flex-direction: column;
            gap: clamp(1rem, 3vw, 1.5rem);
          }
          
          .summary-card {
            border-radius: clamp(12px, 3vw, 16px);
            padding: clamp(1rem, 3vw, 1.5rem);
            border: 2px solid;
          }
          
          .summary-card.income-summary {
            background: rgba(34, 197, 94, 0.05);
            border-color: rgba(34, 197, 94, 0.1);
          }
          
          .summary-card.expense-summary {
            background: rgba(239, 68, 68, 0.05);
            border-color: rgba(239, 68, 68, 0.1);
          }
          
          .summary-card.balance-summary {
            background: rgba(34, 197, 94, 0.05);
            border-color: rgba(34, 197, 94, 0.1);
          }
          
          .summary-card.balance-summary.negative {
            background: rgba(239, 68, 68, 0.05);
            border-color: rgba(239, 68, 68, 0.1);
          }
          
          .summary-header {
            display: flex;
            align-items: center;
            gap: clamp(0.75rem, 2vw, 1rem);
            margin-bottom: 0.5rem;
          }
          
          .summary-title {
            margin: 0;
            font-size: clamp(0.875rem, 2.5vw, 1.125rem);
            font-weight: 600;
            color: #1f2937;
          }
          
          .summary-value {
            margin: 0 0 0.5rem 0;
            font-size: clamp(1.25rem, 4vw, 2rem);
            font-weight: 800;
          }
          
          .summary-percentage {
            margin: 0;
            font-size: clamp(0.75rem, 2vw, 0.875rem);
            color: #6b7280;
          }
          
          .income-color { color: #22c55e; }
          .expense-color { color: #ef4444; }
          
          .grid-layout {
            display: grid;
            grid-template-columns: 1fr;
            gap: clamp(1.5rem, 4vw, 2rem);
            margin-bottom: clamp(1.5rem, 4vw, 2rem);
          }
          
          .more-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 2vw, 1rem);
            background: transparent;
            color: #6366f1;
            border: 2px solid rgba(99, 102, 241, 0.2);
            border-radius: clamp(8px, 2vw, 12px);
            font-size: clamp(0.75rem, 2vw, 0.875rem);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
          }
          
          .more-button:hover {
            background: rgba(99, 102, 241, 0.1);
            border-color: #6366f1;
            transform: translateY(-2px);
          }
          
          .custom-tooltip {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 12px 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            min-width: 150px;
          }
          
          .tooltip-label {
            margin: 0 0 4px 0;
            font-weight: 600;
            color: #1f2937;
            font-size: 14px;
          }
          
          .tooltip-value {
            margin: 0 0 4px 0;
            font-weight: 700;
            font-size: 16px;
          }
          
          .tooltip-percentage {
            margin: 0;
            font-size: 12px;
            color: #6b7280;
          }
          
          .empty-state {
            text-align: center;
            padding: clamp(2rem, 6vw, 3rem);
            color: #6b7280;
          }
          
          .empty-state svg {
            margin-bottom: 1rem;
            opacity: 0.5;
          }
          
          .empty-state h3 {
            margin: 0 0 0.5rem 0;
            font-size: clamp(1rem, 3vw, 1.125rem);
            font-weight: 600;
          }
          
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 60vh;
            color: #64748b;
          }
          
          .loading-content {
            text-align: center;
          }
          
          .loading-spinner {
            width: clamp(40px, 10vw, 60px);
            height: clamp(40px, 10vw, 60px);
            border: 4px solid #e2e8f0;
            border-top: 4px solid #6366f1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem auto;
          }
          
          .loading-text {
            font-size: clamp(1rem, 3vw, 1.125rem);
            font-weight: 500;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          /* Responsive breakpoints */
          @media (min-width: 768px) {
            .stats-grid {
              grid-template-columns: repeat(3, 1fr);
            }
            
            .overview-grid {
              grid-template-columns: 1.2fr 1fr;
            }
            
            .grid-layout {
              grid-template-columns: repeat(2, 1fr);
            }
            
            .transactions-grid {
              grid-template-columns: 1fr;
            }
          }
          
          @media (min-width: 1024px) {
            .stats-grid {
              grid-template-columns: repeat(3, 1fr);
            }
            
            .overview-grid {
              grid-template-columns: 1.5fr 1fr;
            }
          }
          
          @media (min-width: 1200px) {
            .page-header {
              margin-bottom: 2rem;
              padding-bottom: 1.5rem;
            }
            
            .overview-grid {
              grid-template-columns: 1.8fr 1.2fr;
            }
          }
          
          /* Very small screens */
          @media (max-width: 320px) {
            .stats-grid {
              grid-template-columns: 1fr;
              gap: 1rem;
            }
            
            .section-header {
              flex-direction: column;
              align-items: stretch;
              text-align: center;
            }
            
            .transactions-grid {
              grid-template-columns: 1fr;
            }
            
            .transaction-item {
              padding: 0.75rem;
            }
            
            .transaction-name {
              font-size: 0.8rem;
            }
          }
          
          /* Landscape phone */
          @media (max-height: 500px) and (orientation: landscape) {
            .chart-container {
              height: 200px;
            }
            
            .stat-card {
              min-height: 100px;
            }
          }
        `}
      </style>

      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Welcome back! Here's an overview of your financial status.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card balance-card">
          <div className="card-icon">
            <Wallet size={32} />
          </div>
          <h3 className="card-value">{formatCurrency(dashboardData.balance)}</h3>
          <p className="card-label">Total Balance</p>
        </div>

        <div className="stat-card income-card">
          <div className="card-icon">
            <TrendingUp size={32} />
          </div>
          <h3 className="card-value">{formatCurrency(dashboardData.totalIncome)}</h3>
          <p className="card-label">Total Income</p>
        </div>

        <div className="stat-card expense-card">
          <div className="card-icon">
            <TrendingDown size={32} />
          </div>
          <h3 className="card-value">{formatCurrency(dashboardData.totalExpense)}</h3>
          <p className="card-label">Total Expense</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Recent Transactions</h2>
        </div>

        {dashboardData.recentTransactions.length > 0 ? (
          <div className="transactions-grid">
            {dashboardData.recentTransactions.map((transaction, index) => (
              <div
                key={`${transaction.type}-${transaction.id || index}`}
                className="transaction-item"
              >
                <div className={`transaction-icon ${transaction.type}`}>
                  {transaction.icon || (transaction.type === 'income' ? '💰' : '💸')}
                </div>
                <div className="transaction-info">
                  <h4 className="transaction-name">{transaction.name}</h4>
                  <p className="transaction-date">
                    <Calendar size={12} />
                    {formatDate(transaction.createdAt || transaction.date)}
                  </p>
                </div>
                <div className={`transaction-amount ${transaction.type === 'income' ? 'income-amount' : 'expense-amount'}`}>
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
          <div className="empty-state">
            <PieChart size={48} />
            <h3>No transactions yet</h3>
            <p>Start adding income and expenses to see your activity here</p>
          </div>
        )}
      </div>

      {/* Financial Overview */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Financial Overview</h2>
        </div>
        
        {dashboardData.totalIncome > 0 || dashboardData.totalExpense > 0 ? (
          <div className="overview-grid">
            <div className="chart-container">
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
              
              <div className="chart-center">
                <p className="chart-center-label">Balance</p>
                <p 
                  className="chart-center-value"
                  style={{ 
                    color: dashboardData.balance >= 0 ? '#22c55e' : '#ef4444' 
                  }}
                >
                  {formatCurrency(dashboardData.balance)}
                </p>
              </div>
            </div>

            <div className="summary-stats">
              <div className="summary-card income-summary">
                <div className="summary-header">
                  <TrendingUp size={24} className="income-color" />
                  <h3 className="summary-title">Total Income</h3>
                </div>
                <p className="summary-value income-color">
                  {formatCurrency(dashboardData.totalIncome)}
                </p>
                <p className="summary-percentage">
                  {pieChartData[0]?.percentage}% of total transactions
                </p>
              </div>

              <div className="summary-card expense-summary">
                <div className="summary-header">
                  <TrendingDown size={24} className="expense-color" />
                  <h3 className="summary-title">Total Expenses</h3>
                </div>
                <p className="summary-value expense-color">
                  {formatCurrency(dashboardData.totalExpense)}
                </p>
                <p className="summary-percentage">
                  {pieChartData[1]?.percentage}% of total transactions
                </p>
              </div>

              <div className={`summary-card balance-summary ${dashboardData.balance < 0 ? 'negative' : ''}`}>
                <div className="summary-header">
                  <Wallet size={24} style={{ 
                    color: dashboardData.balance >= 0 ? '#22c55e' : '#ef4444' 
                  }} />
                  <h3 className="summary-title">Net Balance</h3>
                </div>
                <p 
                  className="summary-value" 
                  style={{ 
                    color: dashboardData.balance >= 0 ? '#22c55e' : '#ef4444' 
                  }}
                >
                  {formatCurrency(dashboardData.balance)}
                </p>
                <p className="summary-percentage">
                  {dashboardData.balance >= 0 ? 'Positive' : 'Negative'} cash flow
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <PieChart size={48} />
            <h3>No financial data available</h3>
            <p>Add income and expenses to see your financial overview</p>
          </div>
        )}
      </div>

      {/* Top Incomes and Expenses */}
      <div className="grid-layout">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Top Income Sources</h2>
            <button
              className="more-button"
              onClick={() => onNavigate?.('/income')}
            >
              <Eye size={16} />
              View All
            </button>
          </div>
          
          {dashboardData.topIncomes.length > 0 ? (
            <div className="transactions-grid">
              {dashboardData.topIncomes.map((income, index) => (
                <div key={income.id || index} className="transaction-item">
                  <div className="transaction-icon income">
                    {income.icon || '💰'}
                  </div>
                  <div className="transaction-info">
                    <h4 className="transaction-name">{income.name}</h4>
                    <p className="transaction-date">
                      <Calendar size={12} />
                      {formatDate(income.createdAt || income.date)}
                    </p>
                  </div>
                  <div className="transaction-amount income-amount">
                    <ArrowUpRight size={16} />
                    +{formatCurrency(income.amount || 0)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <TrendingUp size={32} />
              <p>No income records yet</p>
            </div>
          )}
        </div>

        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Top Expenses</h2>
            <button
              className="more-button"
              onClick={() => onNavigate?.('/expenses')}
            >
              <Eye size={16} />
              View All
            </button>
          </div>
          
          {dashboardData.topExpenses.length > 0 ? (
            <div className="transactions-grid">
              {dashboardData.topExpenses.map((expense, index) => (
                <div key={expense.id || index} className="transaction-item">
                  <div className="transaction-icon expense">
                    {expense.icon || '💸'}
                  </div>
                  <div className="transaction-info">
                    <h4 className="transaction-name">{expense.name}</h4>
                    <p className="transaction-date">
                      <Calendar size={12} />
                      {formatDate(expense.createdAt || expense.date)}
                    </p>
                  </div>
                  <div className="transaction-amount expense-amount">
                    <ArrowDownRight size={16} />
                    -{formatCurrency(expense.amount || 0)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <TrendingDown size={32} />
              <p>No expense records yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;