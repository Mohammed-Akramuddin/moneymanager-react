import React, { useState, useEffect } from 'react';
import { PieChart, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const FinancialChart = () => {
    const [financialData, setFinancialData] = useState({
        totalBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFinancialData();
    }, []);

    const fetchFinancialData = async () => {
        try {
            setLoading(true);
            
            // Fetch incomes
            const incomesResponse = await fetch('/api/income', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            const incomesData = await incomesResponse.json();
            
            // Fetch expenses
            const expensesResponse = await fetch('/api/expense', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            const expensesData = await expensesResponse.json();

            // Calculate totals
            const totalIncome = incomesData.reduce((sum, income) => sum + income.amount, 0);
            const totalExpenses = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
            const totalBalance = totalIncome - totalExpenses;

            // Calculate monthly data (current month)
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            
            const monthlyIncome = incomesData
                .filter(income => {
                    const date = new Date(income.date);
                    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                })
                .reduce((sum, income) => sum + income.amount, 0);

            const monthlyExpenses = expensesData
                .filter(expense => {
                    const date = new Date(expense.date);
                    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                })
                .reduce((sum, expense) => sum + expense.amount, 0);

            setFinancialData({
                totalBalance,
                totalIncome,
                totalExpenses,
                monthlyIncome,
                monthlyExpenses
            });
        } catch (error) {
            console.error('Error fetching financial data:', error);
            // Fallback data for demo
            setFinancialData({
                totalBalance: 84200,
                totalIncome: 185000,
                totalExpenses: 100800,
                monthlyIncome: 85000,
                monthlyExpenses: 32405
            });
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Calculate chart data
    const chartData = [
        { label: 'Balance', value: Math.max(financialData.totalBalance, 0), color: '#667eea' },
        { label: 'Expenses', value: financialData.totalExpenses, color: '#f5576c' },
        { label: 'Income', value: financialData.totalIncome, color: '#00f2fe' }
    ];

    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    const createPieSlices = () => {
        let cumulativePercentage = 0;
        
        return chartData.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const startAngle = cumulativePercentage * 3.6; // Convert to degrees
            const endAngle = (cumulativePercentage + percentage) * 3.6;
            
            // Calculate the path for the pie slice
            const largeArcFlag = percentage > 50 ? 1 : 0;
            const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
            
            const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            
            cumulativePercentage += percentage;
            
            return (
                <path
                    key={index}
                    d={pathData}
                    fill={item.color}
                    stroke="white"
                    strokeWidth="2"
                    style={{
                        transition: 'all 0.3s ease',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                />
            );
        });
    };

    if (loading) {
        return (
            <div className="financial-chart-container">
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>
                {`
                    .financial-chart-container {
                        background: rgba(255, 255, 255, 0.9);
                        backdrop-filter: blur(20px);
                        border-radius: 20px;
                        padding: 1.5rem;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
                        height: fit-content;
                    }
                    
                    .chart-title {
                        font-size: 1.25rem;
                        font-weight: 700;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        -webkit-background-clip: text;
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin: 0 0 1.5rem 0;
                        text-align: center;
                    }
                    
                    .chart-container {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 1.5rem;
                        position: relative;
                    }
                    
                    .chart-center-text {
                        position: absolute;
                        text-align: center;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    
                    .center-label {
                        font-size: 0.75rem;
                        color: #64748b;
                        font-weight: 600;
                        margin-bottom: 0.25rem;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    
                    .center-value {
                        font-size: 1.125rem;
                        font-weight: 800;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        -webkit-background-clip: text;
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin: 0;
                    }
                    
                    .legend-container {
                        display: flex;
                        flex-direction: column;
                        gap: 0.75rem;
                        margin-bottom: 1.5rem;
                    }
                    
                    .legend-item {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0.75rem;
                        background: rgba(255, 255, 255, 0.7);
                        border-radius: 12px;
                        transition: all 0.3s ease;
                        border: 1px solid rgba(255, 255, 255, 0.3);
                    }
                    
                    .legend-item:hover {
                        background: rgba(255, 255, 255, 0.9);
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                    
                    .legend-left {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }
                    
                    .legend-color {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        flex-shrink: 0;
                    }
                    
                    .legend-label {
                        font-weight: 600;
                        color: #1f2937;
                        font-size: 0.875rem;
                    }
                    
                    .legend-right {
                        text-align: right;
                    }
                    
                    .legend-value {
                        font-weight: 700;
                        color: #1f2937;
                        font-size: 0.875rem;
                        margin-bottom: 0.125rem;
                    }
                    
                    .legend-percentage {
                        font-size: 0.75rem;
                        color: #64748b;
                    }
                    
                    .monthly-summary {
                        padding: 1.25rem;
                        background: rgba(102, 126, 234, 0.05);
                        border-radius: 12px;
                        border: 1px solid rgba(102, 126, 234, 0.1);
                    }
                    
                    .summary-title {
                        margin: 0 0 1rem 0;
                        font-size: 0.875rem;
                        font-weight: 600;
                        color: #1f2937;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    
                    .summary-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 0.75rem;
                    }
                    
                    .summary-item {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        font-size: 0.8rem;
                    }
                    
                    .summary-label {
                        color: #64748b;
                        margin-right: 0.25rem;
                    }
                    
                    .summary-value {
                        font-weight: 700;
                    }
                    
                    .income-value {
                        color: #059669;
                    }
                    
                    .expense-value {
                        color: #dc2626;
                    }
                    
                    .loading-spinner-container {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 300px;
                    }
                    
                    .loading-spinner {
                        width: 32px;
                        height: 32px;
                        border: 3px solid rgba(102, 126, 234, 0.2);
                        border-top: 3px solid #667eea;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    /* Mobile responsiveness */
                    @media (max-width: 480px) {
                        .financial-chart-container {
                            padding: 1.25rem;
                        }
                        
                        .chart-title {
                            font-size: 1.125rem;
                        }
                        
                        .center-value {
                            font-size: 1rem;
                        }
                        
                        .summary-grid {
                            grid-template-columns: 1fr;
                            gap: 0.5rem;
                        }
                        
                        .summary-item {
                            font-size: 0.75rem;
                        }
                    }
                    
                    @media (max-width: 768px) {
                        .chart-container {
                            margin-bottom: 1.25rem;
                        }
                        
                        .legend-container {
                            margin-bottom: 1.25rem;
                        }
                    }
                `}
            </style>
            <div className="financial-chart-container">
                <h3 className="chart-title">Financial Overview</h3>
                
                <div className="chart-container">
                    <svg width="180" height="180" viewBox="0 0 200 200" style={{ maxWidth: '100%', height: 'auto' }}>
                        {createPieSlices()}
                        <circle
                            cx="100"
                            cy="100"
                            r="40"
                            fill="white"
                            stroke="rgba(102, 126, 234, 0.1)"
                            strokeWidth="1"
                        />
                    </svg>
                    <div className="chart-center-text">
                        <div className="center-label">Total Balance</div>
                        <div className="center-value">
                            {formatCurrency(financialData.totalBalance)}
                        </div>
                    </div>
                </div>

                <div className="legend-container">
                    {chartData.map((item, index) => {
                        const percentage = ((item.value / total) * 100).toFixed(1);
                        return (
                            <div key={index} className="legend-item">
                                <div className="legend-left">
                                    <div 
                                        className="legend-color"
                                        style={{
                                            backgroundColor: item.color,
                                            boxShadow: `0 2px 8px ${item.color}40`
                                        }}
                                    ></div>
                                    <span className="legend-label">{item.label}</span>
                                </div>
                                <div className="legend-right">
                                    <div className="legend-value">
                                        {formatCurrency(item.value)}
                                    </div>
                                    <div className="legend-percentage">
                                        {percentage}%
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="monthly-summary">
                    <h4 className="summary-title">This Month Summary</h4>
                    <div className="summary-grid">
                        <div className="summary-item">
                            <ArrowUpRight size={14} style={{ color: '#059669', flexShrink: 0 }} />
                            <span className="summary-label">Income:</span>
                            <span className="summary-value income-value">
                                {formatCurrency(financialData.monthlyIncome)}
                            </span>
                        </div>
                        <div className="summary-item">
                            <ArrowDownRight size={14} style={{ color: '#dc2626', flexShrink: 0 }} />
                            <span className="summary-label">Expenses:</span>
                            <span className="summary-value expense-value">
                                {formatCurrency(financialData.monthlyExpenses)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FinancialChart;