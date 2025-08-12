import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Calendar, Eye } from 'lucide-react';

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

    const transactions = getFilteredTransactions();

    if (loading) {
        return (
            <div className="transactions-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
                <style>
                    {getStyles()}
                </style>
            </div>
        );
    }

    return (
        <div className="transactions-container">
            <style>
                {getStyles()}
            </style>
            
            <div className="transactions-header">
                <h3 className="transactions-title">Recent Transactions</h3>
                <div className="tab-container">
                    <button 
                        className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'income' ? 'active' : ''}`}
                        onClick={() => setActiveTab('income')}
                    >
                        Income
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'expense' ? 'active' : ''}`}
                        onClick={() => setActiveTab('expense')}
                    >
                        Expenses
                    </button>
                </div>
            </div>

            <div className="transactions-list">
                {transactions.map((transaction, index) => (
                    <div key={`${transaction.type}-${transaction.id}-${index}`} className="transaction-item">
                        <div className={`transaction-icon ${transaction.type === 'income' ? 'income-icon' : 'expense-icon'}`}>
                            {transaction.type === 'income' ? 
                                <ArrowUpRight size={16} /> : 
                                <ArrowDownRight size={16} />
                            }
                        </div>
                        <div className="transaction-info">
                            <h4 className="transaction-name">
                                {transaction.description}
                            </h4>
                            <p className="transaction-meta">
                                <Calendar size={10} />
                                <span>{formatDate(transaction.date)}</span>
                                {transaction.category && (
                                    <>
                                        <span className="separator">•</span>
                                        <span className="category">{transaction.category}</span>
                                    </>
                                )}
                            </p>
                        </div>
                        <div className={`transaction-amount ${transaction.type === 'income' ? 'income-amount' : 'expense-amount'}`}>
                            {formatAmount(transaction.amount, transaction.type)}
                        </div>
                    </div>
                ))}
            </div>

            <button className="view-more-button">
                <Eye size={14} />
                <span>View All Transactions</span>
            </button>
        </div>
    );
};

const getStyles = () => `
    .transactions-container {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(20px);
        border-radius: clamp(16px, 4vw, 20px);
        padding: clamp(1rem, 3vw, 1.5rem);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        height: fit-content;
        width: 100%;
    }
    
    .transactions-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: clamp(1rem, 3vw, 1.5rem);
        padding-bottom: clamp(0.75rem, 2vw, 1rem);
        border-bottom: 1px solid rgba(102, 126, 234, 0.1);
        flex-wrap: wrap;
        gap: clamp(0.75rem, 2vw, 1rem);
    }
    
    .transactions-title {
        font-size: clamp(1rem, 3vw, 1.25rem);
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
        flex-shrink: 0;
    }
    
    .tab-container {
        display: flex;
        gap: clamp(0.125rem, 0.5vw, 0.25rem);
        background: rgba(102, 126, 234, 0.1);
        border-radius: clamp(6px, 2vw, 8px);
        padding: clamp(0.125rem, 0.5vw, 0.25rem);
        flex-shrink: 0;
    }
    
    .tab-button {
        padding: clamp(0.375rem, 1.5vw, 0.5rem) clamp(0.5rem, 2vw, 0.75rem);
        border-radius: clamp(4px, 1.5vw, 6px);
        border: none;
        background: transparent;
        font-weight: 600;
        font-size: clamp(0.625rem, 2vw, 0.75rem);
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        white-space: nowrap;
    }
    
    .tab-button.active {
        background: rgba(102, 126, 234, 1);
        color: white;
    }
    
    .tab-button:not(.active) {
        color: #64748b;
    }
    
    .tab-button:not(.active):hover {
        background: rgba(102, 126, 234, 0.15);
        color: #667eea;
    }
    
    .transactions-list {
        margin-bottom: clamp(1rem, 3vw, 1.25rem);
        display: flex;
        flex-direction: column;
        gap: clamp(0.375rem, 1vw, 0.5rem);
    }
    
    .transaction-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: clamp(0.625rem, 2vw, 0.875rem);
        background: rgba(255, 255, 255, 0.7);
        border-radius: clamp(8px, 2vw, 12px);
        transition: all 0.3s ease;
        cursor: pointer;
        border: 1px solid rgba(255, 255, 255, 0.3);
        gap: clamp(0.5rem, 1.5vw, 0.75rem);
        min-height: clamp(50px, 12vw, 70px);
    }
    
    .transaction-item:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        background: rgba(255, 255, 255, 0.9);
    }
    
    .transaction-icon {
        width: clamp(28px, 7vw, 32px);
        height: clamp(28px, 7vw, 32px);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    
    .income-icon {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
    }
    
    .expense-icon {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
    }
    
    .transaction-info {
        min-width: 0;
        flex: 1;
    }
    
    .transaction-name {
        margin: 0 0 clamp(0.125rem, 0.5vw, 0.25rem) 0;
        font-size: clamp(0.75rem, 2.2vw, 0.875rem);
        font-weight: 600;
        color: #1f2937;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.2;
    }
    
    .transaction-meta {
        margin: 0;
        font-size: clamp(0.625rem, 1.8vw, 0.75rem);
        color: #64748b;
        display: flex;
        align-items: center;
        gap: clamp(0.25rem, 0.8vw, 0.375rem);
        flex-wrap: wrap;
        line-height: 1.2;
    }
    
    .separator {
        color: #94a3b8;
    }
    
    .category {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: clamp(60px, 15vw, 100px);
    }
    
    .transaction-amount {
        font-size: clamp(0.75rem, 2.2vw, 0.875rem);
        font-weight: 700;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: clamp(0.25rem, 0.8vw, 0.375rem);
        white-space: nowrap;
    }
    
    .income-amount {
        color: #059669;
    }
    
    .expense-amount {
        color: #dc2626;
    }
    
    .view-more-button {
        width: 100%;
        padding: clamp(0.625rem, 2vw, 0.75rem);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: clamp(8px, 2vw, 12px);
        color: white;
        font-weight: 600;
        font-size: clamp(0.7rem, 2vw, 0.8rem);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: clamp(0.375rem, 1vw, 0.5rem);
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        min-height: clamp(40px, 10vw, 50px);
    }
    
    .view-more-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    }
    
    .view-more-button span {
        white-space: nowrap;
    }
    
    .loading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: clamp(150px, 30vw, 200px);
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
    
    /* Small screens */
    @media (max-width: 320px) {
        .transactions-header {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
        }
        
        .transactions-title {
            text-align: center;
        }
        
        .tab-container {
            align-self: center;
        }
        
        .transaction-item {
            padding: 0.625rem;
        }
        
        .transaction-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.125rem;
        }
        
        .separator {
            display: none;
        }
    }
    
    /* Medium screens */
    @media (min-width: 480px) {
        .transactions-header {
            flex-direction: row;
        }
        
        .transaction-meta {
            flex-direction: row;
        }
        
        .separator {
            display: inline;
        }
    }
    
    /* Large screens */
    @media (min-width: 768px) {
        .transactions-header {
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
        }
        
        .transactions-list {
            margin-bottom: 1.25rem;
            gap: 0.5rem;
        }
        
        .transaction-item {
            padding: 0.875rem;
            min-height: 60px;
        }
        
        .transaction-icon {
            width: 32px;
            height: 32px;
        }
    }
    
    /* Extra large screens */
    @media (min-width: 1200px) {
        .transactions-container {
            padding: 1.5rem;
        }
        
        .view-more-button {
            min-height: 44px;
        }
    }
    
    /* Landscape phones */
    @media (max-height: 500px) and (orientation: landscape) {
        .transaction-item {
            min-height: 45px;
            padding: 0.5rem;
        }
        
        .loading-container {
            height: 120px;
        }
    }
    
    /* High DPI displays */
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        .transactions-container {
            backdrop-filter: blur(30px);
        }
    }
`;

export default RecentTransactions;