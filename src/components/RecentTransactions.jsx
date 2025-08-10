import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Calendar, TrendingUp, Eye } from 'lucide-react';

const RecentTransactions = () => {
    const [recentIncomes, setRecentIncomes] = useState([]);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'income', 'expense'

    useEffect(() => {
        fetchRecentTransactions();
    }, []);

    const fetchRecentTransactions = async () => {
        try {
            setLoading(true);
            
            // Fetch recent incomes
            const incomesResponse = await fetch('/api/income', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            const incomesData = await incomesResponse.json();
            
            // Fetch recent expenses
            const expensesResponse = await fetch('/api/expense', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            const expensesData = await expensesResponse.json();
            
            // Get most recent 5 of each
            setRecentIncomes(incomesData.slice(0, 5));
            setRecentExpenses(expensesData.slice(0, 5));
        } catch (error) {
            console.error('Error fetching transactions:', error);
            // Fallback data for demo
            setRecentIncomes([
                { id: 1, description: 'Freelance Project', amount: 5000, date: '2025-01-15', category: 'Freelance' },
                { id: 2, description: 'Salary', amount: 75000, date: '2025-01-01', category: 'Job' },
                { id: 3, description: 'Side Project', amount: 12000, date: '2025-01-10', category: 'Business' }
            ]);
            setRecentExpenses([
                { id: 1, description: 'Uber Ride', amount: 300, date: '2025-01-15', category: 'Transportation' },
                { id: 2, description: 'Grocery Shopping', amount: 2500, date: '2025-01-14', category: 'Food' },
                { id: 3, description: 'Coffee', amount: 150, date: '2025-01-13', category: 'Food' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const formatAmount = (amount, type) => {
        const formatted = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
        
        return type === 'income' ? `+${formatted}` : `-${formatted}`;
    };

    const getAllTransactions = () => {
        const incomeTransactions = recentIncomes.map(income => ({
            ...income,
            type: 'income'
        }));
        const expenseTransactions = recentExpenses.map(expense => ({
            ...expense,
            type: 'expense'
        }));
        
        return [...incomeTransactions, ...expenseTransactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 8);
    };

    const getFilteredTransactions = () => {
        switch (activeTab) {
            case 'income':
                return recentIncomes.map(income => ({ ...income, type: 'income' }));
            case 'expense':
                return recentExpenses.map(expense => ({ ...expense, type: 'expense' }));
            default:
                return getAllTransactions();
        }
    };

    const containerStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(40px)',
        borderRadius: '24px',
        padding: '2rem',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
    };

    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid rgba(102, 126, 234, 0.1)'
    };

    const titleStyle = {
        fontSize: '1.5rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: 0
    };

    const tabContainerStyle = {
        display: 'flex',
        gap: '0.5rem',
        background: 'rgba(102, 126, 234, 0.1)',
        borderRadius: '12px',
        padding: '0.25rem'
    };

    const getTabStyle = (isActive) => ({
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        border: 'none',
        background: isActive ? 'rgba(102, 126, 234, 1)' : 'transparent',
        color: isActive ? 'white' : '#64748b',
        fontWeight: '600',
        fontSize: '0.875rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    });

    const transactionItemStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '16px',
        marginBottom: '0.75rem',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        border: '1px solid rgba(255, 255, 255, 0.3)'
    };

    const getIconStyle = (type) => ({
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: type === 'income' 
            ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white'
    });

    const transactions = getFilteredTransactions();

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
                    
                    .transaction-item:hover {
                        transform: translateY(-2px) !important;
                        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
                        background: rgba(255, 255, 255, 0.9) !important;
                    }
                    
                    .view-more-btn:hover {
                        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%) !important;
                        transform: translateY(-2px) scale(1.05) !important;
                    }
                `}
            </style>
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <h3 style={titleStyle}>Recent Transactions</h3>
                    <div style={tabContainerStyle}>
                        <button 
                            style={getTabStyle(activeTab === 'all')}
                            onClick={() => setActiveTab('all')}
                        >
                            All
                        </button>
                        <button 
                            style={getTabStyle(activeTab === 'income')}
                            onClick={() => setActiveTab('income')}
                        >
                            Income
                        </button>
                        <button 
                            style={getTabStyle(activeTab === 'expense')}
                            onClick={() => setActiveTab('expense')}
                        >
                            Expenses
                        </button>
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    {transactions.map((transaction, index) => (
                        <div key={`${transaction.type}-${transaction.id}-${index}`} style={transactionItemStyle} className="transaction-item">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={getIconStyle(transaction.type)}>
                                    {transaction.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                                </div>
                                <div>
                                    <h4 style={{ 
                                        margin: '0 0 0.25rem 0', 
                                        fontSize: '1rem', 
                                        fontWeight: '600',
                                        color: '#1f2937'
                                    }}>
                                        {transaction.description}
                                    </h4>
                                    <p style={{ 
                                        margin: 0, 
                                        fontSize: '0.875rem', 
                                        color: '#64748b',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <Calendar size={12} />
                                        {formatDate(transaction.date)}
                                        {transaction.category && (
                                            <>
                                                <span>•</span>
                                                <span>{transaction.category}</span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div style={{ 
                                fontSize: '1.125rem', 
                                fontWeight: '700',
                                color: transaction.type === 'income' ? '#059669' : '#dc2626'
                            }}>
                                {formatAmount(transaction.amount, transaction.type)}
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s ease'
                    }}
                    className="view-more-btn"
                >
                    <Eye size={16} />
                    View All Transactions
                </button>
            </div>
        </>
    );
};

export default RecentTransactions;