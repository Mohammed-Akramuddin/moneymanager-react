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
                <style>
                    {`
                        .financial-chart-container {
                            background: rgba(255, 255, 255, 0.9);
                            backdrop-filter: blur(20px);
                            border-radius: clamp(16px, 4vw, 20px);
                            padding: clamp(1rem, 3vw, 1.5rem);
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
                            height: fit-content;
                            width: 100%;
                            min-height: clamp(250px, 40vw, 400px);
                        }
                        
                        .loading-spinner-container {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: clamp(200px, 30vw, 300px);
                        }
                        
                        .loading-spinner {
                            width: clamp(24px, 6vw, 32px);
                            height: clamp(24px, 6vw, 32px);
                            border: 3px solid rgba(102, 126, 234, 0.2);
                            border-top: 3px solid #667eea;
                            border-radius: 50%;
                            animation: spin 1s linear infinite;
                        }
                        
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}
                </style>
            </div>
        );
    }

    return (
        <div className="financial-chart-container">
            <style>
                {`
                    .financial-chart-container {
                        background: rgba(255, 255, 255, 0.9);
                        backdrop-filter: blur(20px);
                        border-radius: clamp(16px, 4vw, 20px);
                        padding: clamp(1rem, 3vw, 1.5rem);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
                        height: fit-content;
                        width: 100%;
                    }
                    
                    .chart-title {
                        font-size: clamp(1rem, 3vw, 1.25rem);
                        font-weight: 700;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        -webkit-background-clip: text;
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin: 0 0 clamp(1rem, 3vw, 1.5rem) 0;
                        text-align: center;
                    }
                    
                    .chart-container {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: clamp(1rem, 3vw, 1.5rem);
                        position: relative;
                        width: 100%;
                    }
                    
                    .chart-svg {
                        width: 100%;
                        height: auto;
                        max-width: clamp(140px, 35vw, 180px);
                        max-height: clamp(140px, 35vw, 180px);
                    }
                    
                    .chart-center-text {
                        position: absolute;
                        text-align: center;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    
                    .center-label {
                        font-size: clamp(0.6rem, 1.8vw, 0.75rem);
                        color: #64748b;
                        font-weight: 600;
                        margin-bottom: clamp(0.125rem, 0.5vw, 0.25rem);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    
                    .center-value {
                        font-size: clamp(0.8rem, 2.5vw, 1.125rem);
                        font-weight: 800;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        -webkit-background-clip: text;
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin: 0;
                        word-break: break-all;
                    }
                    
                    .legend-container {
                        display: flex;
                        flex-direction: column;
                        gap: clamp(0.5rem, 1.5vw, 0.75rem);
                        margin-bottom: clamp(1rem, 3vw, 1.5rem);
                        width: 100%;
                    }
                    
                    .legend-item {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: clamp(0.625rem, 2vw, 0.75rem);
                        background: rgba(255, 255, 255, 0.7);
                        border-radius: clamp(8px, 2vw, 12px);
                        transition: all 0.3s ease;
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        min-height: clamp(40px, 8vw, 60px);
                    }
                    
                    .legend-item:hover {
                        background: rgba(255, 255, 255, 0.9);
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                    
                    .legend-left {
                        display: flex;
                        align-items: center;
                        gap: clamp(0.375rem, 1vw, 0.5rem);
                        min-width: 0;
                        flex: 1;
                    }
                    
                    .legend-color {
                        width: clamp(8px, 2vw, 12px);
                        height: clamp(8px, 2vw, 12px);
                        border-radius: 50%;
                        flex-shrink: 0;
                    }
                    
                    .legend-label {
                        font-weight: 600;
                        color: #1f2937;
                        font-size: clamp(0.75rem, 2vw, 0.875rem);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    
                    .legend-right {
                        text-align: right;
                        flex-shrink: 0;
                    }
                    
                    .legend-value {
                        font-weight: 700;
                        color: #1f2937;
                        font-size: clamp(0.75rem, 2vw, 0.875rem);
                        margin-bottom: clamp(0.0625rem, 0.3vw, 0.125rem);
                        word-break: break-all;
                    }
                    
                    .legend-percentage {
                        font-size: clamp(0.625rem, 1.8vw, 0.75rem);
                        color: #64748b;
                    }
                    
                    .monthly-summary {
                        padding: clamp(1rem, 3vw, 1.25rem);
                        background: rgba(102, 126, 234, 0.05);
                        border-radius: clamp(8px, 2vw, 12px);
                        border: 1px solid rgba(102, 126, 234, 0.1);
                    }
                    
                    .summary-title {
                        margin: 0 0 clamp(0.75rem, 2vw, 1rem) 0;
                        font-size: clamp(0.75rem, 2vw, 0.875rem);
                        font-weight: 600;
                        color: #1f2937;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        text-align: center;
                    }
                    
                    .summary-grid {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: clamp(0.5rem, 1.5vw, 0.75rem);
                        width: 100%;
                    }
                    
                    .summary-item {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: clamp(0.375rem, 1vw, 0.5rem);
                        font-size: clamp(0.7rem, 1.8vw, 0.8rem);
                        padding: clamp(0.375rem, 1vw, 0.5rem);
                        background: rgba(255, 255, 255, 0.6);
                        border-radius: clamp(6px, 1.5vw, 8px);
                        min-height: clamp(36px, 7vw, 44px);
                    }
                    
                    .summary-left {
                        display: flex;
                        align-items: center;
                        gap: clamp(0.25rem, 0.8vw, 0.375rem);
                        flex: 1;
                        min-width: 0;
                    }
                    
                    .summary-label {
                        color: #64748b;
                        font-weight: 500;
                        white-space: nowrap;
                    }
                    
                    .summary-value {
                        font-weight: 700;
                        flex-shrink: 0;
                        word-break: break-all;
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
                        height: clamp(200px, 30vw, 300px);
                    }
                    
                    .loading-spinner {
                        width: clamp(24px, 6vw, 32px);
                        height: clamp(24px, 6vw, 32px);
                        border: 3px solid rgba(102, 126, 234, 0.2);
                        border-top: 3px solid #667eea;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    /* Small screens optimization */
                    @media (max-width: 320px) {
                        .financial-chart-container {
                            padding: 1rem;
                        }
                        
                        .legend-item {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 0.5rem;
                            text-align: left;
                        }
                        
                        .legend-right {
                            text-align: left;
                            width: 100%;
                        }
                        
                        .summary-grid {
                            gap: 0.5rem;
                        }
                    }
                    
                    /* Medium screens */
                    @media (min-width: 480px) {
                        .summary-grid {
                            grid-template-columns: repeat(2, 1fr);
                        }
                    }
                    
                    /* Larger screens */
                    @media (min-width: 768px) {
                        .chart-container {
                            margin-bottom: 1.5rem;
                        }
                        
                        .legend-container {
                            margin-bottom: 1.5rem;
                        }
                        
                        .summary-grid {
                            grid-template-columns: repeat(2, 1fr);
                            gap: 1rem;
                        }
                    }
                    
                    /* Very large screens */
                    @media (min-width: 1200px) {
                        .chart-svg {
                            max-width: 200px;
                            max-height: 200px;
                        }
                        
                        .center-value {
                            font-size: 1.25rem;
                        }
                    }
                    
                    /* Landscape phones */
                    @media (max-height: 500px) and (orientation: landscape) {
                        .chart-container {
                            margin-bottom: 1rem;
                        }
                        
                        .monthly-summary {
                            padding: 1rem;
                        }
                    }
                    
                    /* High DPI displays */
                    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
                        .financial-chart-container {
                            backdrop-filter: blur(30px);
                        }
                    }
                `}
            </style>
            
            <h3 className="chart-title">Financial Overview</h3>
            
            <div className="chart-container">
                <svg 
                    className="chart-svg"
                    viewBox="0 0 200 200" 
                    preserveAspectRatio="xMidYMid meet"
                >
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
                        <div className="summary-left">
                            <ArrowUpRight size={clamp(12, 14)} style={{ color: '#059669', flexShrink: 0 }} />
                            <span className="summary-label">Income:</span>
                        </div>
                        <span className="summary-value income-value">
                            {formatCurrency(financialData.monthlyIncome)}
                        </span>
                    </div>
                    <div className="summary-item">
                        <div className="summary-left">
                            <ArrowDownRight size={clamp(12, 14)} style={{ color: '#dc2626', flexShrink: 0 }} />
                            <span className="summary-label">Expenses:</span>
                        </div>
                        <span className="summary-value expense-value">
                            {formatCurrency(financialData.monthlyExpenses)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper function for clamp-like behavior in JavaScript
const clamp = (min, max) => {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) / 100;
    return Math.min(Math.max(min, vw * 3), max);
};

export default FinancialChart;