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

    const containerStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(40px)',
        borderRadius: '24px',
        padding: '2rem',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.1)'
    };

    const titleStyle = {
        fontSize: '1.5rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: '0 0 2rem 0',
        textAlign: 'center'
    };

    const chartContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        position: 'relative'
    };

    const centerTextStyle = {
        position: 'absolute',
        textAlign: 'center',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    };

    const legendStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    };

    const legendItemStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem',
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '12px',
        transition: 'all 0.3s ease'
    };

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
                    strokeWidth="3"
                    style={{
                        transition: 'all 0.3s ease',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                    }}
                />
            );
        });
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        border: '4px solid rgba(102, 126, 234, 0.2)', 
                        borderTop: '4px solid #667eea',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    .legend-item:hover {
                        background: rgba(255, 255, 255, 0.9) !important;
                        transform: translateY(-2px) !important;
                        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
                    }
                `}
            </style>
            <div style={containerStyle}>
                <h3 style={titleStyle}>Financial Overview</h3>
                
                <div style={chartContainerStyle}>
                    <svg width="200" height="200" viewBox="0 0 200 200">
                        {createPieSlices()}
                        <circle
                            cx="100"
                            cy="100"
                            r="45"
                            fill="white"
                            stroke="rgba(102, 126, 234, 0.1)"
                            strokeWidth="2"
                        />
                    </svg>
                    <div style={centerTextStyle}>
                        <div style={{
                            fontSize: '0.875rem',
                            color: '#64748b',
                            fontWeight: '600',
                            marginBottom: '0.25rem'
                        }}>
                            Total Balance
                        </div>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {formatCurrency(financialData.totalBalance)}
                        </div>
                    </div>
                </div>

                <div style={legendStyle}>
                    {chartData.map((item, index) => {
                        const percentage = ((item.value / total) * 100).toFixed(1);
                        return (
                            <div key={index} style={legendItemStyle} className="legend-item">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        background: item.color,
                                        boxShadow: `0 2px 8px ${item.color}40`
                                    }}></div>
                                    <span style={{ fontWeight: '600', color: '#1f2937' }}>
                                        {item.label}
                                    </span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: '700', color: '#1f2937', fontSize: '0.95rem' }}>
                                        {formatCurrency(item.value)}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                        {percentage}%
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Monthly Summary */}
                <div style={{
                    marginTop: '2rem',
                    padding: '1.5rem',
                    background: 'rgba(102, 126, 234, 0.05)',
                    borderRadius: '16px',
                    border: '1px solid rgba(102, 126, 234, 0.1)'
                }}>
                    <h4 style={{
                        margin: '0 0 1rem 0',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#1f2937'
                    }}>
                        This Month Summary
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ArrowUpRight size={16} style={{ color: '#059669' }} />
                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Income:</span>
                            <span style={{ fontWeight: '700', color: '#059669' }}>
                                {formatCurrency(financialData.monthlyIncome)}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ArrowDownRight size={16} style={{ color: '#dc2626' }} />
                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Expenses:</span>
                            <span style={{ fontWeight: '700', color: '#dc2626' }}>
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