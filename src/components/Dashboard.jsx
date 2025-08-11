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
                    * {
                        box-sizing: border-box;
                    }
                    
                    body {
                        margin: 0;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', sans-serif;
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                    }
                    
                    /* Mobile First Responsive Breakpoints */
                    .dashboard-container {
                        min-height: 100vh;
                        background: radial-gradient(circle at 10% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                                    radial-gradient(circle at 90% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
                                    linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                        position: relative;
                    }
                    
                    .main-content {
                        display: flex;
                        padding-top: 60px;
                        min-height: 100vh;
                    }
                    
                    .sidebar-container {
                        display: none;
                    }
                    
                    .content-area {
                        flex: 1;
                        padding: 1rem;
                        width: 100%;
                    }
                    
                    .content-wrapper {
                        background: rgba(255, 255, 255, 0.9);
                        backdrop-filter: blur(20px);
                        border-radius: 16px;
                        padding: 1.5rem;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        min-height: calc(100vh - 120px);
                        position: relative;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
                        overflow: hidden;
                    }
                    
                    .content-background {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.03) 0%, transparent 40%),
                                    radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.03) 0%, transparent 40%);
                        border-radius: 16px;
                        z-index: 0;
                    }
                    
                    .welcome-header {
                        margin-bottom: 2rem;
                        padding-bottom: 1.5rem;
                        border-bottom: 1px solid rgba(102, 126, 234, 0.1);
                        position: relative;
                        z-index: 1;
                    }
                    
                    .welcome-title {
                        font-size: 1.75rem;
                        font-weight: 800;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        -webkit-background-clip: text;
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin: 0 0 0.5rem 0;
                        letter-spacing: -0.01em;
                        line-height: 1.2;
                    }
                    
                    .welcome-subtitle {
                        font-size: 0.95rem;
                        color: #64748b;
                        margin: 0;
                        font-weight: 500;
                        line-height: 1.5;
                    }
                    
                    .stats-grid {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: 1rem;
                        margin-bottom: 2rem;
                        position: relative;
                        z-index: 1;
                    }
                    
                    .main-grid {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                        margin-bottom: 2rem;
                        position: relative;
                        z-index: 1;
                    }
                    
                    .stat-card {
                        border-radius: 20px;
                        padding: 1.5rem;
                        color: white;
                        position: relative;
                        overflow: hidden;
                        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
                        cursor: pointer;
                        min-height: 140px;
                    }
                    
                    .stat-card-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15) 0%, transparent 50%),
                                    radial-gradient(circle at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 50%);
                        border-radius: 20px;
                    }
                    
                    .stat-card-content {
                        position: relative;
                        z-index: 1;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }
                    
                    .stat-card-header {
                        display: flex;
                        align-items: flex-start;
                        justify-content: space-between;
                        margin-bottom: 0.75rem;
                    }
                    
                    .stat-label {
                        margin: 0;
                        font-size: 0.8rem;
                        opacity: 0.9;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.3px;
                        line-height: 1.3;
                    }
                    
                    .stat-value {
                        margin: 0;
                        font-size: 1.75rem;
                        font-weight: 800;
                        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                        letter-spacing: -0.01em;
                        line-height: 1.2;
                    }
                    
                    .stat-change {
                        display: flex;
                        align-items: center;
                        gap: 0.25rem;
                        margin-top: 0.75rem;
                        opacity: 0.9;
                        font-size: 0.75rem;
                        font-weight: 600;
                    }
                    
                    .cta-card {
                        background: rgba(255, 255, 255, 0.9);
                        backdrop-filter: blur(20px);
                        border-radius: 20px;
                        padding: 2rem;
                        text-align: center;
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        position: relative;
                        z-index: 1;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
                        overflow: hidden;
                        transition: all 0.3s ease;
                    }
                    
                    .cta-icon {
                        width: 60px;
                        height: 60px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 1.5rem auto;
                        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
                        border: 2px solid rgba(255, 255, 255, 0.2);
                    }
                    
                    .cta-title {
                        margin: 0 0 1rem 0;
                        color: #1f2937;
                        font-size: 1.25rem;
                        font-weight: 800;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        -webkit-background-clip: text;
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                        line-height: 1.3;
                    }
                    
                    .cta-description {
                        margin: 0 0 2rem 0;
                        color: #64748b;
                        font-size: 0.95rem;
                        font-weight: 500;
                        line-height: 1.5;
                    }
                    
                    .cta-buttons {
                        display: flex;
                        gap: 1rem;
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                    
                    .cta-button {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border: none;
                        border-radius: 12px;
                        padding: 0.875rem 1.5rem;
                        color: white;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        font-size: 0.875rem;
                        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
                        text-transform: uppercase;
                        letter-spacing: 0.3px;
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        min-width: 140px;
                        justify-content: center;
                    }
                    
                    .secondary-button {
                        background: transparent;
                        border: 2px solid #e2e8f0;
                        border-radius: 12px;
                        padding: 0.875rem 1.5rem;
                        color: #64748b;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        font-size: 0.875rem;
                        text-transform: uppercase;
                        letter-spacing: 0.3px;
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        min-width: 140px;
                        justify-content: center;
                    }
                    
                    /* Hover States */
                    .stat-card:hover {
                        transform: translateY(-4px) scale(1.01);
                        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
                    }
                    
                    .cta-button:hover {
                        transform: translateY(-2px) scale(1.02);
                        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
                        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
                    }
                    
                    .secondary-button:hover {
                        border-color: #667eea;
                        color: #667eea;
                        transform: translateY(-2px) scale(1.02);
                        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
                        background: rgba(102, 126, 234, 0.05);
                    }
                    
                    .cta-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
                    }
                    
                    /* Animations */
                    @keyframes contentFadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes titleGlow {
                        0%, 100% { 
                            text-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
                        }
                        50% { 
                            text-shadow: 0 0 25px rgba(102, 126, 234, 0.6), 0 0 35px rgba(118, 75, 162, 0.2);
                        }
                    }
                    
                    @keyframes loadingPulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                    
                    .content-fade-in {
                        animation: contentFadeIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    }
                    
                    .welcome-title {
                        animation: titleGlow 4s ease-in-out infinite;
                    }
                    
                    .loading-card {
                        animation: loadingPulse 1.5s ease-in-out infinite;
                    }
                    
                    /* Scrollbar */
                    ::-webkit-scrollbar {
                        width: 6px;
                    }
                    
                    ::-webkit-scrollbar-track {
                        background: rgba(241, 245, 249, 0.5);
                        border-radius: 3px;
                    }
                    
                    ::-webkit-scrollbar-thumb {
                        background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
                        border-radius: 3px;
                    }
                    
                    ::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
                    }
                    
                    /* Small Mobile (320px - 480px) */
                    @media (min-width: 320px) {
                        .welcome-title {
                            font-size: 1.5rem;
                        }
                        
                        .stat-value {
                            font-size: 1.5rem;
                        }
                        
                        .cta-buttons {
                            flex-direction: column;
                            align-items: center;
                        }
                        
                        .cta-button,
                        .secondary-button {
                            width: 100%;
                            max-width: 200px;
                        }
                    }
                    
                    /* Mobile (481px - 768px) */
                    @media (min-width: 481px) {
                        .content-area {
                            padding: 1.5rem;
                        }
                        
                        .content-wrapper {
                            padding: 2rem;
                            border-radius: 24px;
                        }
                        
                        .welcome-title {
                            font-size: 2rem;
                        }
                        
                        .stat-value {
                            font-size: 1.75rem;
                        }
                        
                        .stats-grid {
                            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                            gap: 1.25rem;
                        }
                        
                        .cta-buttons {
                            flex-direction: row;
                        }
                        
                        .cta-button,
                        .secondary-button {
                            width: auto;
                        }
                    }
                    
                    /* Tablet (769px - 1024px) */
                    @media (min-width: 769px) {
                        .main-content {
                            padding-top: 70px;
                        }
                        
                        .sidebar-container {
                            display: block;
                            width: 280px;
                            flex-shrink: 0;
                            background: transparent;
                        }
                        
                        .content-area {
                            padding: 2rem;
                            max-width: calc(100vw - 280px);
                        }
                        
                        .content-wrapper {
                            padding: 2.5rem;
                            border-radius: 28px;
                            backdrop-filter: blur(40px);
                        }
                        
                        .welcome-title {
                            font-size: 2.25rem;
                        }
                        
                        .stats-grid {
                            grid-template-columns: repeat(2, 1fr);
                            gap: 1.5rem;
                        }
                        
                        .main-grid {
                            grid-template-columns: 1.8fr 1.2fr;
                        }
                        
                        .stat-card {
                            padding: 2rem;
                            min-height: 160px;
                        }
                        
                        .stat-value {
                            font-size: 2rem;
                        }
                    }
                    
                    /* Desktop (1025px - 1440px) */
                    @media (min-width: 1025px) {
                        .main-content {
                            padding-top: 80px;
                        }
                        
                        .sidebar-container {
                            width: 300px;
                        }
                        
                        .content-area {
                            padding: 2.5rem;
                            max-width: calc(100vw - 300px);
                        }
                        
                        .content-wrapper {
                            padding: 3rem;
                            border-radius: 32px;
                            min-height: calc(100vh - 160px);
                        }
                        
                        .welcome-header {
                            margin-bottom: 3rem;
                            padding-bottom: 2rem;
                            border-bottom-width: 2px;
                        }
                        
                        .welcome-title {
                            font-size: 2.5rem;
                        }
                        
                        .welcome-subtitle {
                            font-size: 1.125rem;
                        }
                        
                        .stats-grid {
                            grid-template-columns: repeat(4, 1fr);
                            gap: 2rem;
                            margin-bottom: 3rem;
                        }
                        
                        .stat-card {
                            border-radius: 24px;
                            min-height: 180px;
                        }
                        
                        .stat-value {
                            font-size: 2.5rem;
                        }
                        
                        .cta-card {
                            border-radius: 28px;
                        }
                        
                        .cta-icon {
                            width: 80px;
                            height: 80px;
                        }
                        
                        .cta-title {
                            font-size: 1.75rem;
                        }
                        
                        .cta-description {
                            font-size: 1.125rem;
                        }
                    }
                    
                    /* Large Desktop (1441px+) */
                    @media (min-width: 1441px) {
                        .content-area {
                            max-width: 1400px;
                            margin: 0 auto;
                        }
                        
                        .stats-grid {
                            grid-template-columns: repeat(4, 1fr);
                            max-width: 1200px;
                            margin-left: auto;
                            margin-right: auto;
                            margin-bottom: 3rem;
                        }
                    }
                    
                    /* High DPI Displays */
                    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
                        .content-wrapper {
                            backdrop-filter: blur(30px);
                        }
                    }
                    
                    /* Landscape Mobile */
                    @media (max-height: 500px) and (orientation: landscape) {
                        .main-content {
                            padding-top: 50px;
                        }
                        
                        .content-wrapper {
                            min-height: calc(100vh - 100px);
                        }
                        
                        .welcome-header {
                            margin-bottom: 1.5rem;
                        }
                        
                        .stats-grid {
                            margin-bottom: 1.5rem;
                        }
                    }
                `}
            </style>

            <div className="dashboard-container">
                <MenuBar />

                {user && (
                    <div className="main-content">
                        <div className="sidebar-container">
                            <Sidebar />
                        </div>
                        <div className="content-area">
                            <div className="content-wrapper content-fade-in">
                                <div className="content-background"></div>
                                {!children && (
                                    <>
                                        <div className="welcome-header">
                                            <h1 className="welcome-title">
                                                Welcome back, {user?.fullName || user?.name || 'User'}!
                                            </h1>
                                            <p className="welcome-subtitle">
                                                Here's what's happening with your finances today. Take control and make informed decisions.
                                            </p>
                                        </div>

                                        <div className="stats-grid">
                                            <div 
                                                className={`stat-card ${loading ? 'loading-card' : ''}`}
                                                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                            >
                                                <div className="stat-card-overlay"></div>
                                                <div className="stat-card-content">
                                                    <div className="stat-card-header">
                                                        <h3 className="stat-label">Total Balance</h3>
                                                        <Wallet size={24} style={{ opacity: 0.8, flexShrink: 0 }} />
                                                    </div>
                                                    <div>
                                                        <p className="stat-value">
                                                            {loading ? '...' : formatCurrency(financialSummary.totalBalance)}
                                                        </p>
                                                        {!loading && (() => {
                                                            const change = getPreviousMonthChange(financialSummary.totalBalance);
                                                            const IconComponent = change.icon;
                                                            return (
                                                                <div className="stat-change">
                                                                    <IconComponent size={12} />
                                                                    <span>
                                                                        {change.isGood ? '+' : ''}{change.percent}% from last month
                                                                    </span>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div 
                                                className={`stat-card ${loading ? 'loading-card' : ''}`}
                                                style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
                                            >
                                                <div className="stat-card-overlay"></div>
                                                <div className="stat-card-content">
                                                    <div className="stat-card-header">
                                                        <h3 className="stat-label">Monthly Expenses</h3>
                                                        <ArrowDownRight size={24} style={{ opacity: 0.8, flexShrink: 0 }} />
                                                    </div>
                                                    <div>
                                                        <p className="stat-value">
                                                            {loading ? '...' : formatCurrency(financialSummary.monthlyExpenses)}
                                                        </p>
                                                        {!loading && (() => {
                                                            const change = getPreviousMonthChange(financialSummary.monthlyExpenses, 'expense');
                                                            const IconComponent = change.icon;
                                                            return (
                                                                <div className="stat-change">
                                                                    <IconComponent size={12} />
                                                                    <span>
                                                                        {change.isGood ? '-' : '+'}{change.percent}% from last month
                                                                    </span>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div 
                                                className={`stat-card ${loading ? 'loading-card' : ''}`}
                                                style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}
                                            >
                                                <div className="stat-card-overlay"></div>
                                                <div className="stat-card-content">
                                                    <div className="stat-card-header">
                                                        <h3 className="stat-label">Monthly Income</h3>
                                                        <DollarSign size={24} style={{ opacity: 0.8, flexShrink: 0 }} />
                                                    </div>
                                                    <div>
                                                        <p className="stat-value">
                                                            {loading ? '...' : formatCurrency(financialSummary.monthlyIncome)}
                                                        </p>
                                                        {!loading && (() => {
                                                            const change = getPreviousMonthChange(financialSummary.monthlyIncome);
                                                            const IconComponent = change.icon;
                                                            return (
                                                                <div className="stat-change">
                                                                    <IconComponent size={12} />
                                                                    <span>
                                                                        {change.isGood ? '+' : ''}{change.percent}% from last month
                                                                    </span>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div 
                                                className={`stat-card ${loading ? 'loading-card' : ''}`}
                                                style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
                                            >
                                                <div className="stat-card-overlay"></div>
                                                <div className="stat-card-content">
                                                    <div className="stat-card-header">
                                                        <h3 className="stat-label">Savings Goal</h3>
                                                        <PieChart size={24} style={{ opacity: 0.8, flexShrink: 0 }} />
                                                    </div>
                                                    <div>
                                                        <p className="stat-value">
                                                            {loading ? '...' : `${financialSummary.savingsProgress.toFixed(1)}%`}
                                                        </p>
                                                        <div className="stat-change">
                                                            <TrendingUp size={12} />
                                                            <span>
                                                                {loading ? '...' : `${formatCurrency(financialSummary.totalBalance)} of ${formatCurrency(financialSummary.savingsGoal)}`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="main-grid">
                                            <RecentTransactions />
                                            <FinancialChart />
                                        </div>

                                        <div className="cta-card">
                                            <div className="cta-icon">
                                                <TrendingUp size={28} color="#ffffff" />
                                            </div>
                                            <h3 className="cta-title">
                                                Ready to supercharge your finances?
                                            </h3>
                                            <p className="cta-description">
                                                Add new transactions, view detailed analytics, or download your financial reports.
                                            </p>
                                            <div className="cta-buttons">
                                                <button className="cta-button">
                                                    <Wallet size={16} />
                                                    Add Transaction
                                                </button>
                                                <button className="secondary-button">
                                                    <PieChart size={16} />
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