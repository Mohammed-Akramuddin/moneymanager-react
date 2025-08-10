import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, DollarSign, Mail, Download, ArrowUpRight } from 'lucide-react';

function IncomeOverview({ incomes = [] }) {
  const [chartData, setChartData] = useState([]);
  const [topIncomes, setTopIncomes] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);

  useEffect(() => {
    if (incomes.length > 0) {
      // Process data for chart
      const processedData = processIncomeData(incomes);
      setChartData(processedData);
      
      // Get top 5 incomes
      const sortedIncomes = [...incomes]
        .sort((a, b) => (b.amount || 0) - (a.amount || 0))
        .slice(0, 5);
      setTopIncomes(sortedIncomes);
    }
  }, [incomes]);

  const processIncomeData = (incomes) => {
    // Group incomes by date and sum amounts
    const groupedData = {};
    
    incomes.forEach(income => {
      const date = new Date(income.createdAt || income.date || Date.now());
      const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {
          date: dateKey,
          amount: 0,
          details: []
        };
      }
      
      groupedData[dateKey].amount += income.amount || 0;
      groupedData[dateKey].details.push(income);
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

  const totalIncome = incomes.reduce((sum, income) => sum + (income.amount || 0), 0);
  const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
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
            color: '#22c55e',
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
            {data.details.slice(0, 3).map((income, index) => (
              <p key={index} style={{ 
                margin: '2px 0', 
                fontSize: '12px',
                color: '#374151'
              }}>
                {income.icon} {income.name}: {formatCurrency(income.amount)}
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
    background: 'rgba(34, 197, 94, 0.05)',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid rgba(34, 197, 94, 0.1)'
  };

  const statValueStyle = {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#22c55e',
    margin: '0 0 0.25rem 0'
  };

  const statLabelStyle = {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
    fontWeight: '500'
  };

  const incomeSourcesStyle = {
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
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(34, 197, 94, 0.3)',
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
    color: '#22c55e'
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

  if (incomes.length === 0) {
    return (
      <div style={overviewStyle}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <TrendingUp size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
          <h3 style={{ 
            color: '#64748b', 
            margin: '0 0 0.5rem 0',
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            No income data available
          </h3>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            Add some income records to see your overview and trends
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Income Overview Chart */}
      <div style={overviewStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Income Overview</h2>
          <p style={subtitleStyle}>
            Track your earnings over time and analyze your income trends.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <p style={statValueStyle}>{formatCurrency(totalIncome)}</p>
            <p style={statLabelStyle}>Total Income</p>
          </div>
          <div style={statCardStyle}>
            <p style={statValueStyle}>{formatCurrency(averageIncome)}</p>
            <p style={statLabelStyle}>Average Income</p>
          </div>
          <div style={statCardStyle}>
            <p style={statValueStyle}>{incomes.length}</p>
            <p style={statLabelStyle}>Income Sources</p>
          </div>
        </div>

        {/* Chart */}
        <div style={chartContainerStyle}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05}/>
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
                stroke="#22c55e"
                strokeWidth={3}
                fill="url(#incomeGradient)"
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#22c55e', strokeWidth: 2, fill: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Income Sources */}
      <div style={incomeSourcesStyle}>
        <div style={sourcesHeaderStyle}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700', 
            color: '#1f2937', 
            margin: 0 
          }}>
            Top Income Sources
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
          {topIncomes.map((income, index) => (
            <div 
              key={income.id || index}
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
                {income.icon || '💰'}
              </div>
              <div style={sourceInfoStyle}>
                <h4 style={sourceNameStyle}>{income.name}</h4>
                <p style={sourceDateStyle}>
                  <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {new Date(income.createdAt || income.date || Date.now()).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div style={sourceAmountStyle}>
                <span>+{formatCurrency(income.amount || 0)}</span>
                <ArrowUpRight size={16} />
              </div>
            </div>
          ))}
        </div>

        {topIncomes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <p>No income sources to display</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default IncomeOverview;