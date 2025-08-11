import React, { useState, useEffect } from 'react';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

function IncomeOverview({ incomes = [] }) {
  const [chartData, setChartData] = useState([]);
  const [topIncomes, setTopIncomes] = useState([]);

  useEffect(() => {
    if (incomes.length > 0) {
      const processedData = processIncomeData(incomes);
      setChartData(processedData);
      
      const sortedIncomes = [...incomes]
        .sort((a, b) => (b.amount || 0) - (a.amount || 0))
        .slice(0, 5);
      setTopIncomes(sortedIncomes);
    }
  }, [incomes]);

  const processIncomeData = (incomes) => {
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
        <div className="chart-tooltip">
          <p className="tooltip-date">{label}</p>
          <p className="tooltip-amount">Total: {formatCurrency(data.amount)}</p>
          <div className="tooltip-details">
            <p className="tooltip-details-title">Details:</p>
            {data.details.slice(0, 3).map((income, index) => (
              <p key={index} className="tooltip-detail-item">
                {income.icon} {income.name}: {formatCurrency(income.amount)}
              </p>
            ))}
            {data.details.length > 3 && (
              <p className="tooltip-more">+{data.details.length - 3} more...</p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (incomes.length === 0) {
    return (
      <div className="overview-empty">
        <div className="empty-content">
          <TrendingUp size={48} />
          <h3>No income data available</h3>
          <p>Add some income records to see your overview and trends</p>
        </div>
        <style jsx>{`
          .overview-empty {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
            margin-bottom: 2rem;
          }

          .empty-content {
            text-align: center;
            padding: 2rem;
          }

          .empty-content svg {
            color: #94a3b8;
            margin-bottom: 1rem;
          }

          .empty-content h3 {
            color: #64748b;
            margin: 0 0 0.5rem 0;
            font-size: 1.25rem;
            font-weight: 600;
          }

          .empty-content p {
            color: #94a3b8;
            margin: 0;
          }

          @media (max-width: 768px) {
            .overview-empty {
              padding: 1.5rem;
              border-radius: 16px;
            }

            .empty-content {
              padding: 1rem;
            }

            .empty-content svg {
              width: 40px;
              height: 40px;
            }

            .empty-content h3 {
              font-size: 1.125rem;
            }

            .empty-content p {
              font-size: 0.875rem;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="overview-container">
      <div className="overview-card">
        <div className="overview-header">
          <h2 className="overview-title">Income Overview</h2>
          <p className="overview-subtitle">
            Track your earnings over time and analyze your income trends.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-value">{formatCurrency(totalIncome)}</p>
            <p className="stat-label">Total Income</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{formatCurrency(averageIncome)}</p>
            <p className="stat-label">Average Income</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{incomes.length}</p>
            <p className="stat-label">Income Sources</p>
          </div>
        </div>

        <div className="chart-container">
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

      <div className="sources-card">
        <div className="sources-header">
          <h3 className="sources-title">Top Income Sources</h3>
          <div className="sources-actions">
            
          </div>
        </div>

        <div className="sources-list">
          {topIncomes.map((income, index) => (
            <div key={income.id || index} className="source-item">
              <div className="source-icon">
                {income.icon || '💰'}
              </div>
              <div className="source-info">
                <h4 className="source-name">{income.name}</h4>
                <p className="source-date">
                  <Calendar size={12} />
                  {new Date(income.createdAt || income.date || Date.now()).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="source-amount">
                <span className="amount-text">+{formatCurrency(income.amount || 0)}</span>
                <ArrowUpRight size={16} />
              </div>
            </div>
          ))}
        </div>

        {topIncomes.length === 0 && (
          <div className="sources-empty">
            <p>No income sources to display</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .overview-container {
          margin-bottom: 1.5rem;
        }

        .overview-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
        }

        .overview-header {
          margin-bottom: 2rem;
        }

        .overview-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.01em;
        }

        .overview-subtitle {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
          font-weight: 500;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(34, 197, 94, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(34, 197, 94, 0.1);
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: #22c55e;
          margin: 0 0 0.25rem 0;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
          font-weight: 500;
        }

        .chart-container {
          height: 300px;
        }

        .chart-tooltip {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          min-width: 200px;
        }

        .tooltip-date {
          margin: 0 0 8px 0;
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
        }

        .tooltip-amount {
          margin: 0 0 12px 0;
          font-weight: 800;
          color: #22c55e;
          font-size: 18px;
        }

        .tooltip-details {
          border-top: 1px solid #e5e7eb;
          padding-top: 8px;
        }

        .tooltip-details-title {
          margin: 0 0 4px 0;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
        }

        .tooltip-detail-item {
          margin: 2px 0;
          font-size: 12px;
          color: #374151;
        }

        .tooltip-more {
          margin: 4px 0 0 0;
          font-size: 11px;
          color: #9ca3af;
          font-style: italic;
        }

        .sources-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        .sources-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .sources-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .sources-actions {
          display: flex;
          gap: 0.5rem;
        }

        .sources-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .source-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.2s ease;
        }

        .source-item:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .source-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(34, 197, 94, 0.3);
          font-size: 20px;
          flex-shrink: 0;
        }

        .source-info {
          flex: 1;
          min-width: 0;
        }

        .source-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.25rem 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .source-date {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .source-amount {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.125rem;
          font-weight: 700;
          color: #22c55e;
          flex-shrink: 0;
        }

        .amount-text {
          white-space: nowrap;
        }

        .sources-empty {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .overview-card {
            padding: 1.5rem;
            border-radius: 16px;
            margin-bottom: 1.5rem;
          }

          .overview-header {
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .overview-title {
            font-size: 1.25rem;
          }

          .overview-subtitle {
            font-size: 0.8rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
          }

          .stat-card {
            padding: 1rem;
            text-align: center;
          }

          .stat-value {
            font-size: 1.5rem;
          }

          .chart-container {
            height: 250px;
          }

          .chart-tooltip {
            min-width: 180px;
            padding: 12px;
          }

          .sources-card {
            padding: 1.5rem;
            border-radius: 16px;
          }

          .sources-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .sources-title {
            text-align: center;
            font-size: 1.125rem;
          }

          .sources-actions {
            justify-content: center;
          }

          .sources-list {
            gap: 0.75rem;
          }

          .source-item {
            padding: 1rem;
            gap: 0.75rem;
          }

          .source-icon {
            width: 40px;
            height: 40px;
            font-size: 16px;
          }

          .source-name {
            font-size: 0.875rem;
          }

          .source-date {
            font-size: 0.7rem;
          }

          .source-amount {
            font-size: 1rem;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.25rem;
          }

          .amount-text {
            font-size: 0.875rem;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 480px) {
          .overview-card {
            padding: 1.25rem;
          }

          .sources-card {
            padding: 1.25rem;
          }

          .chart-container {
            height: 200px;
          }

          .stat-card {
            padding: 0.75rem;
          }

          .stat-value {
            font-size: 1.375rem;
          }

          .source-item {
            padding: 0.75rem;
            gap: 0.625rem;
          }

          .source-icon {
            width: 36px;
            height: 36px;
            font-size: 14px;
          }

          .source-name {
            font-size: 0.8rem;
          }

          .source-amount {
            font-size: 0.875rem;
          }

          .amount-text {
            font-size: 0.8rem;
          }
        }

        /* Tablet Responsive Styles */
        @media (min-width: 768px) and (max-width: 1024px) {
          .overview-card {
            padding: 1.75rem;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          }

          .chart-container {
            height: 275px;
          }

          .sources-card {
            padding: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default IncomeOverview;