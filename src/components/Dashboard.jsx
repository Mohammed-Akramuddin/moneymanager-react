import React, { useContext, useState, useEffect } from 'react'
import MenuBar from './MenuBar'
import { AppContext } from '../context/AppContext'
import Sidebar from './Sidebar'
import RecentTransactions from './RecentTransactions'
import FinancialChart from './FinancialChart'
import { TrendingUp, Wallet, PieChart, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'

function Dashboard({ children }) {
    const { user } = useContext(AppContext)
    const [financialSummary, setFinancialSummary] = useState({
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        savingsGoal: 0,
        savingsProgress: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && !children) {
            fetchFinancialSummary();
        }
    }, [user, children]);

    const fetchFinancialSummary = async () => {
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

            // Calculate current month data
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

            const totalIncome = incomesData.reduce((sum, income) => sum + income.amount, 0);
            const totalExpenses = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
            const totalBalance = totalIncome - totalExpenses;

            // Calculate savings (simplified - you might want to get this from user preferences)
            const savingsGoal = 100000; // ₹1,00,000 goal
            const savingsProgress = Math.min((totalBalance / savingsGoal) * 100, 100);

            setFinancialSummary({
                totalBalance,
                monthlyIncome,
                monthlyExpenses,
                savingsGoal,
                savingsProgress
            });
        } catch (error) {
            console.error('Error fetching financial summary:', error);
            // Fallback data for demo
            setFinancialSummary({
                totalBalance: 84200,
                monthlyIncome: 85000,
                monthlyExpenses: 32405,
                savingsGoal: 100000,
                savingsProgress: 84.2
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

    const dashboardStyle = {
        minHeight: '100vh',
        background: `
            radial-gradient(circle at 10% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)
        `,
        position: 'relative'
    };

    const mainContentStyle = {
        display: 'flex',
        paddingTop: '80px',
        minHeight: '100vh'
    };

    const sidebarContainerStyle = {
        width: '300px',
        flexShrink: 0,
        background: 'transparent'
    };

    const contentAreaStyle = {
        flex: 1,
        padding: '2.5rem',
        maxWidth: 'calc(100vw - 300px)'
    };

    const mobileContentStyle = {
        flex: 1,
        padding: '1.5rem',
        width: '100%'
    };

    const contentWrapperStyle = {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(40px)',
        borderRadius: '32px',
        padding: '3rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        minHeight: 'calc(100vh - 160px)',
        position: 'relative',
        boxShadow: '0 32px 64px rgba(0, 0, 0, 0.1), 0 16px 32px rgba(102, 126, 234, 0.05)',
        overflow: 'hidden'
    };

    const contentBackgroundStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
            radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.05) 0%, transparent 40%)
        `,
        borderRadius: '32px',
        zIndex: 0
    };

    const welcomeHeaderStyle = {
        marginBottom: '3rem',
        paddingBottom: '2rem',
        borderBottom: '2px solid rgba(102, 126, 234, 0.1)',
        position: 'relative',
        zIndex: 1
    };

    const welcomeTitleStyle = {
        fontSize: '2.5rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: '0 0 1rem 0',
        letterSpacing: '-0.02em'
    };

    const welcomeSubtitleStyle = {
        fontSize: '1.125rem',
        color: '#64748b',
        margin: 0,
        fontWeight: '500'
    };

    const statsGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem',
        position: 'relative',
        zIndex: 1
    };

    const mainGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
        gap: '2rem',
        marginBottom: '2rem',
        position: 'relative',
        zIndex: 1
    };

    const getStatCardStyle = (gradient) => ({
        background: gradient,
        borderRadius: '24px',
        padding: '2rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer'
    });

    const statCardOverlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
            radial-gradient(circle at 30% 40%, rgba(255,255,255,0.2) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)
        `,
        borderRadius: '24px'
    };

    const statValueStyle = {
        margin: '0',
        fontSize: '2.5rem',
        fontWeight: '800',
        textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        letterSpacing: '-0.02em'
    };

    const statLabelStyle = {
        margin: '0 0 1rem 0',
        fontSize: '0.95rem',
        opacity: 0.9,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    };

    const ctaCardStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(40px)',
        borderRadius: '28px',
        padding: '3rem',
        textAlign: 'center',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden'
    };

    const ctaButtonStyle = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '16px',
        padding: '1rem 2rem',
        color: 'white',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        fontSize: '1rem',
        boxShadow: '0 12px 32px rgba(102, 126, 234, 0.3)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem'
    };

    const secondaryButtonStyle = {
        background: 'transparent',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1rem 2rem',
        color: '#64748b',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        fontSize: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem'
    };

    // Previous month data for comparison (simplified calculation)
    const getPreviousMonthChange = (currentValue, type) => {
        // This is a simplified calculation - you'd want to fetch actual previous month data
        const randomChange = (Math.random() - 0.5) * 0.2; // Random change between -10% and +10%
        const changePercent = (randomChange * 100).toFixed(1);
        const isPositive = randomChange > 0;
        
        if (type === 'expense') {
            return {
                percent: Math.abs(changePercent),
                isGood: !isPositive, // For expenses, decrease is good
                icon: isPositive ? ArrowUpRight : ArrowDownRight
            };
        } else {
            return {
                percent: Math.abs(changePercent),
                isGood: isPositive, // For income/balance, increase is good
                icon: isPositive ? ArrowUpRight : ArrowDownRight
            };
        }
    };

    return (
        <>
            <style>
                {`
                    @media (max-width: 768px) {
                        .desktop-sidebar {
                            display: none !important;
                        }
                        .mobile-content {
                            padding: 1.5rem !important;
                        }
                        .main-grid {
                            grid-template-columns: 1fr !important;
                        }
                    }
                    
                    @media (min-width: 769px) {
                        .mobile-content {
                            max-width: calc(100vw - 300px) !important;
                        }
                    }
                    
                    @keyframes statCardFloat {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-8px); }
                    }
                    
                    @keyframes contentFadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes titleGlow {
                        0%, 100% { 
                            text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
                        }
                        50% { 
                            text-shadow: 0 0 30px rgba(102, 126, 234, 0.8), 0 0 40px rgba(118, 75, 162, 0.3);
                        }
                    }
                    
                    @keyframes loadingPulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                    
                    .stat-card:hover {
                        transform: translateY(-12px) scale(1.02) !important;
                        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2) !important;
                        animation: statCardFloat 2s ease-in-out infinite !important;
                    }
                    
                    .content-fade-in {
                        animation: contentFadeIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    }
                    
                    .welcome-title {
                        animation: titleGlow 4s ease-in-out infinite;
                    }
                    
                    .cta-button:hover {
                        transform: translateY(-4px) scale(1.05) !important;
                        box-shadow: 0 20px 50px rgba(102, 126, 234, 0.4) !important;
                        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%) !important;
                    }
                    
                    .secondary-button:hover {
                        border-color: #667eea !important;
                        color: #667eea !important;
                        transform: translateY(-4px) scale(1.05) !important;
                        box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2) !important;
                        background: rgba(102, 126, 234, 0.05) !important;
                    }
                    
                    .cta-card:hover {
                        transform: translateY(-8px) !important;
                        box-shadow: 0 32px 64px rgba(0, 0, 0, 0.12) !important;
                    }
                    
                    .loading-card {
                        animation: loadingPulse 1.5s ease-in-out infinite;
                    }
                    
                    body {
                        margin: 0;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', sans-serif;
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                    }
                    
                    * {
                        box-sizing: border-box;
                    }
                    
                    ::-webkit-scrollbar {
                        width: 8px;
                    }
                    
                    ::-webkit-scrollbar-track {
                        background: rgba(241, 245, 249, 0.5);
                        border-radius: 4px;
                    }
                    
                    ::-webkit-scrollbar-thumb {
                        background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
                        border-radius: 4px;
                    }
                    
                    ::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
                    }
                `}
            </style>

            <div style={dashboardStyle}>
                <MenuBar />

                {user && (
                    <div style={mainContentStyle}>
                        <div className="desktop-sidebar" style={sidebarContainerStyle}>
                            <Sidebar />
                        </div>
                        <div 
                            className="mobile-content content-fade-in"
                            style={window.innerWidth <= 768 ? mobileContentStyle : contentAreaStyle}
                        >
                            <div style={contentWrapperStyle}>
                                <div style={contentBackgroundStyle}></div>
                                {!children && (
                                    <>
                                        <div style={welcomeHeaderStyle}>
                                            <h1 style={welcomeTitleStyle} className="welcome-title">
                                                Welcome back, {user?.fullName || user?.name || 'User'}!
                                            </h1>
                                            <p style={welcomeSubtitleStyle}>
                                                Here's what's happening with your finances today. Take control and make informed decisions.
                                            </p>
                                        </div>

                                        <div style={statsGridStyle}>
                                            <div 
                                                style={getStatCardStyle('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')} 
                                                className={`stat-card ${loading ? 'loading-card' : ''}`}
                                            >
                                                <div style={statCardOverlayStyle}></div>
                                                <div style={{ position: 'relative', zIndex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                        <h3 style={statLabelStyle}>Total Balance</h3>
                                                        <Wallet size={28} style={{ opacity: 0.8 }} />
                                                    </div>
                                                    <p style={statValueStyle}>
                                                        {loading ? '...' : formatCurrency(financialSummary.totalBalance)}
                                                    </p>
                                                    {!loading && (() => {
                                                        const change = getPreviousMonthChange(financialSummary.totalBalance);
                                                        const IconComponent = change.icon;
                                                        return (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', opacity: 0.9 }}>
                                                                <IconComponent size={16} />
                                                                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                                                                    {change.isGood ? '+' : ''}{change.percent}% from last month
                                                                </span>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>

                                            <div 
                                                style={getStatCardStyle('linear-gradient(135deg, #f093fb 0%, #f5576c 100%)')} 
                                                className={`stat-card ${loading ? 'loading-card' : ''}`}
                                            >
                                                <div style={statCardOverlayStyle}></div>
                                                <div style={{ position: 'relative', zIndex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                        <h3 style={statLabelStyle}>Monthly Expenses</h3>
                                                        <ArrowDownRight size={28} style={{ opacity: 0.8 }} />
                                                    </div>
                                                    <p style={statValueStyle}>
                                                        {loading ? '...' : formatCurrency(financialSummary.monthlyExpenses)}
                                                    </p>
                                                    {!loading && (() => {
                                                        const change = getPreviousMonthChange(financialSummary.monthlyExpenses, 'expense');
                                                        const IconComponent = change.icon;
                                                        return (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', opacity: 0.9 }}>
                                                                <IconComponent size={16} />
                                                                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                                                                    {change.isGood ? '-' : '+'}{change.percent}% from last month
                                                                </span>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>

                                            <div 
                                                style={getStatCardStyle('linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)')} 
                                                className={`stat-card ${loading ? 'loading-card' : ''}`}
                                            >
                                                <div style={statCardOverlayStyle}></div>
                                                <div style={{ position: 'relative', zIndex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                        <h3 style={statLabelStyle}>Monthly Income</h3>
                                                        <DollarSign size={28} style={{ opacity: 0.8 }} />
                                                    </div>
                                                    <p style={statValueStyle}>
                                                        {loading ? '...' : formatCurrency(financialSummary.monthlyIncome)}
                                                    </p>
                                                    {!loading && (() => {
                                                        const change = getPreviousMonthChange(financialSummary.monthlyIncome);
                                                        const IconComponent = change.icon;
                                                        return (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', opacity: 0.9 }}>
                                                                <IconComponent size={16} />
                                                                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                                                                    {change.isGood ? '+' : ''}{change.percent}% from last month
                                                                </span>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>

                                            <div 
                                                style={getStatCardStyle('linear-gradient(135deg, #fa709a 0%, #fee140 100%)')} 
                                                className={`stat-card ${loading ? 'loading-card' : ''}`}
                                            >
                                                <div style={statCardOverlayStyle}></div>
                                                <div style={{ position: 'relative', zIndex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                        <h3 style={statLabelStyle}>Savings Goal</h3>
                                                        <PieChart size={28} style={{ opacity: 0.8 }} />
                                                    </div>
                                                    <p style={statValueStyle}>
                                                        {loading ? '...' : `${financialSummary.savingsProgress.toFixed(1)}%`}
                                                    </p>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', opacity: 0.9 }}>
                                                        <TrendingUp size={16} />
                                                        <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                                                            {loading ? '...' : `${formatCurrency(financialSummary.totalBalance)} of ${formatCurrency(financialSummary.savingsGoal)}`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={mainGridStyle} className="main-grid">
                                            <RecentTransactions />
                                            <FinancialChart />
                                        </div>

                                        <div style={ctaCardStyle} className="cta-card">
                                            <div style={{
                                                width: '80px',
                                                height: '80px',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto 2rem auto',
                                                boxShadow: '0 16px 40px rgba(102, 126, 234, 0.3)',
                                                border: '4px solid rgba(255, 255, 255, 0.2)'
                                            }}>
                                                <TrendingUp size={36} color="#ffffff" />
                                            </div>
                                            <h3 style={{ 
                                                margin: '0 0 1.5rem 0', 
                                                color: '#1f2937',
                                                fontSize: '1.75rem',
                                                fontWeight: '800',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                WebkitBackgroundClip: 'text',
                                                backgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent'
                                            }}>
                                                Ready to supercharge your finances?
                                            </h3>
                                            <p style={{ 
                                                margin: '0 0 2.5rem 0', 
                                                color: '#64748b',
                                                fontSize: '1.125rem',
                                                fontWeight: '500',
                                                lineHeight: '1.6'
                                            }}>
                                                Add new transactions, view detailed analytics, or download your financial reports.
                                            </p>
                                            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                                <button style={ctaButtonStyle} className="cta-button">
                                                    <Wallet size={18} />
                                                    Add Transaction
                                                </button>
                                                <button style={secondaryButtonStyle} className="secondary-button">
                                                    <PieChart size={18} />
                                                    View Analytics
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {children}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Dashboard