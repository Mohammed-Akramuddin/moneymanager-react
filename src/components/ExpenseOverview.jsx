import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingDown, Calendar, DollarSign, Mail, Download, ArrowDownRight } from 'lucide-react';

function ExpenseOverview({ expenses = [] }) {
  const [chartData, setChartData] = useState([]);
  const [topExpenses, setTopExpenses] = useState([]);

  useEffect(() => {
    if (expenses.length > 0) {
      // Process data for chart
      const processedData = processExpenseData(expenses);
      setChartData(processedData);
      
      // Get top 5 expenses
      const sortedExpenses = [...expenses]
        .sort((a, b) => (b.amount || 0) - (a.amount || 0))
        .slice(0, 5);
      setTopExpenses(sortedExpenses);
    }
  }, [expenses]);

  const processExpenseData = (expenses) => {
    // Group expenses by date and sum amounts
    const groupedData = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.createdAt || expense.date || Date.now());
      const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {
          date: dateKey,
          amount: 0,
          details: []
        };
      }
      
      groupedData[dateKey].amount += expense.amount || 0;
      groupedData[dateKey].details.push(expense);
    });

    // Convert to array and sort by date
    return Object.values(groupedData).sort((a, b) => {
      const dateA = new Date(a.date + ' 2024');
      const dateB = new Date(b.date + ' 2024');
      return dateA - dateB;
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          minWidth: '200px'
        }}>
          <p style={{ 
            margin: '0 0 8px 0', 
            fontWeight: '600', 
            color: '#1f2937',
            fontSize: '14px'
          }}>
            {label}
          </p>
          <p style={{ 
            margin: '0 0 12px 0', 
            fontWeight: '800', 
            color: '#ef4444',
            fontSize: '18px'
          }}>
            Total: {formatCurrency(data.amount)}
          </p>
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
            <p style={{ 
              margin: '0 0 4px 0', 
              fontSize: '12px', 
              fontWeight: '600',
              color: '#6b7280'
            }}>
              Details:
            </p>
            {data.details.slice(0, 3).map((expense, index) => (
              <p key={index} style={{ 
                margin: '2px 0', 
                fontSize: '12px',
                color: '#374151'
              }}>
                {expense.icon} {expense.name}: {formatCurrency(expense.amount)}
              </p>
            ))}
            {data.details.length > 3 && (
              <p style={{ 
                margin: '4px 0 0 0', 
                fontSize: '11px',
                color: '#9ca3af',
                fontStyle: 'italic'
              }}>
                +{data.details.length - 3} more...
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const overviewStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    marginBottom: '2rem'
  };

  const headerStyle = {
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.01em'
  };

  const subtitleStyle = {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
    fontWeight: '500'
  };

  const chartContainerStyle = {
    height: '300px',
    marginBottom: '2rem'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  };

  const statCardStyle = {
    background: 'rgba(239, 68, 68, 0.05)',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid rgba(239, 68, 68, 0.1)'
  };

  const statValueStyle = {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#ef4444',
    margin: '0 0 0.25rem 0'
  };

  const statLabelStyle = {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
    fontWeight: '500'
  };

  const expenseSourcesStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
  };

  const sourcesHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  };

  const sourcesListStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem'
  };

  const sourceItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.2s ease'
  };

  const sourceIconStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(239, 68, 68, 0.3)',
    fontSize: '20px'
  };

  const sourceInfoStyle = {
    flex: 1
  };

  const sourceNameStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 0.25rem 0'
  };

  const sourceDateStyle = {
    fontSize: '0.75rem',
    color: '#6b7280',
    margin: 0
  };

  const sourceAmountStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.125rem',
    fontWeight: '700',
    color: '#ef4444'
  };

  const actionButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'rgba(107, 114, 128, 0.1)',
    color: '#6b7280',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  if (expenses.length === 0) {
    return (
      <div style={overviewStyle}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <TrendingDown size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
          <h3 style={{ 
            color: '#64748b', 
            margin: '0 0 0.5rem 0',
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            No expense data available
          </h3>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            Add some expense records to see your overview and trends
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Expense Overview Chart */}
      <div style={overviewStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Expense Overview</h2>
          <p style={subtitleStyle}>
            Track your spending over time and analyze your expense patterns.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <p style={statValueStyle}>{formatCurrency(totalExpenses)}</p>
            <p style={statLabelStyle}>Total Expenses</p>
          </div>
          <div style={statCardStyle}>
            <p style={statValueStyle}>{formatCurrency(averageExpense)}</p>
            <p style={statLabelStyle}>Average Expense</p>
          </div>
          <div style={statCardStyle}>
            <p style={statValueStyle}>{expenses.length}</p>
            <p style={statLabelStyle}>Total Transactions</p>
          </div>
        </div>

        {/* Chart */}
        <div style={chartContainerStyle}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.1)" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#ef4444"
                strokeWidth={3}
                fill="url(#expenseGradient)"
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#ef4444', strokeWidth: 2, fill: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Expenses */}
      <div style={expenseSourcesStyle}>
        <div style={sourcesHeaderStyle}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700', 
            color: '#1f2937', 
            margin: 0 
          }}>
            Top Expenses
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              style={actionButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(107, 114, 128, 0.15)';
                e.target.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(107, 114, 128, 0.1)';
                e.target.style.color = '#6b7280';
              }}
            >
              <Mail size={16} />
              Email
            </button>
            <button 
              style={actionButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(107, 114, 128, 0.15)';
                e.target.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(107, 114, 128, 0.1)';
                e.target.style.color = '#6b7280';
              }}
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>

        <div style={sourcesListStyle}>
          {topExpenses.map((expense, index) => (
            <div 
              key={expense.id || index}
              style={sourceItemStyle}
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
              <div style={sourceIconStyle}>
                {expense.icon || '💸'}
              </div>
              <div style={sourceInfoStyle}>
                <h4 style={sourceNameStyle}>{expense.name}</h4>
                <p style={sourceDateStyle}>
                  <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {new Date(expense.createdAt || expense.date || Date.now()).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div style={sourceAmountStyle}>
                <span>-{formatCurrency(expense.amount || 0)}</span>
                <ArrowDownRight size={16} />
              </div>
            </div>
          ))}
        </div>

        {topExpenses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <p>No expenses to display</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseOverview;