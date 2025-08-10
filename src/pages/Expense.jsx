import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import useUser from '../hooks/useUser';
import { Plus, RefreshCw, Download } from 'lucide-react';
import ExpenseList from '../components/ExpenseList';
import ExpenseOverview from '../components/ExpenseOverview';
import AxiosConfig from '../util/AxiosConfig';
import { API_ENDPOINTS } from '../util/ApiEndpoints';
import Modal from '../components/Modal';
import ExpenseForm from '../components/ExpenseForm';

function Expense() {
  useUser();

  const [loading, setLoading] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [excelLoading, setExcelLoading] = useState(false);

  const fetchExpenseCategories = async () => {
    try {
      const response = await AxiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSE_CATEGORY);
      if (response.status === 200) {
        setExpenseCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching expense categories:', err);
    }
  };

  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await AxiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
      if (response.status === 200) {
        setExpenseData(response.data);
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      const response = await AxiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, expenseData);
      if (response.status === 200 || response.status === 201) {
        await fetchExpenseDetails(); // Refresh the list
        setOpenAddExpenseModal(false);
        // You could add a success toast here
      }
    } catch (err) {
      console.error('Error creating expense:', err);
      // You could add an error toast here
    }
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setOpenAddExpenseModal(true);
  };

  const handleUpdateExpense = async (expenseData) => {
    try {
      const response = await AxiosConfig.put(
        `${API_ENDPOINTS.GET_ALL_EXPENSES}/${selectedExpense.id}`, 
        expenseData
      );
      if (response.status === 200) {
        await fetchExpenseDetails(); // Refresh the list
        setOpenAddExpenseModal(false);
        setSelectedExpense(null);
        // You could add a success toast here
      }
    } catch (err) {
      console.error('Error updating expense:', err);
      // You could add an error toast here
    }
  };

  const handleDeleteExpense = async (expense) => {
    if (window.confirm(`Are you sure you want to delete "${expense.name}"?`)) {
      try {
        const response = await AxiosConfig.delete(`${API_ENDPOINTS.GET_ALL_EXPENSES}/${expense.id}`);
        if (response.status === 200) {
          await fetchExpenseDetails(); // Refresh the list
          // You could add a success toast here
        }
      } catch (err) {
        console.error('Error deleting expense:', err);
        // You could add an error toast here
      }
    }
  };

  const handleExportExcel = async () => {
    setExcelLoading(true);
    try {
      const response = await AxiosConfig.get(API_ENDPOINTS.EXPENSE_EXCEL, {
        responseType: 'blob'
      });
      
      if (response.status === 200) {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        // Get filename from response headers or use default
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'expense-report.xlsx';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error exporting excel:', err);
      // You could add an error toast here
    } finally {
      setExcelLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenAddExpenseModal(false);
    setSelectedExpense(null);
  };

  useEffect(() => {
    fetchExpenseCategories();
    fetchExpenseDetails();
  }, []);

  const containerStyle = {
    padding: '0',
    position: 'relative',
    zIndex: 1
  };

  const headerStyle = {
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '2px solid rgba(239, 68, 68, 0.1)'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.02em'
  };

  const subtitleStyle = {
    fontSize: '1rem',
    color: '#64748b',
    margin: 0,
    fontWeight: '500'
  };

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
    marginRight: '1rem'
  };

  const refreshButtonStyle = {
    ...buttonStyle,
    background: 'transparent',
    color: '#64748b',
    border: '2px solid #e2e8f0',
    boxShadow: 'none'
  };

  const excelButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  };

  const actionsStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  };

  return (
    <Dashboard>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Expense Management</h1>
          <p style={subtitleStyle}>
            Track and manage your expenses efficiently
          </p>
        </div>

        <div style={actionsStyle}>
          <button
            onClick={() => setOpenAddExpenseModal(true)}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
            }}
          >
            <Plus size={18} />
            Add Expense
          </button>
          
          <button
            onClick={fetchExpenseDetails}
            disabled={loading}
            style={refreshButtonStyle}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.borderColor = '#ef4444';
                e.target.style.color = '#ef4444';
                e.target.style.background = 'rgba(239, 68, 68, 0.05)';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.color = '#64748b';
                e.target.style.background = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            <RefreshCw size={18} style={{ 
              animation: loading ? 'spin 1s linear infinite' : 'none' 
            }} />
            Refresh
          </button>

          <button
            onClick={handleExportExcel}
            disabled={excelLoading}
            style={excelButtonStyle}
            onMouseEnter={(e) => {
              if (!excelLoading) {
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                e.target.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!excelLoading) {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }
            }}
          >
            <Download size={18} style={{ 
              animation: excelLoading ? 'spin 1s linear infinite' : 'none' 
            }} />
            Export Excel
          </button>
        </div>

        <ExpenseOverview expenses={expenseData} />

        <ExpenseList 
          expenses={expenseData} 
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
          loading={loading}
        />

        <Modal
          isOpen={openAddExpenseModal}
          onClose={handleCloseModal}
          title={selectedExpense ? 'Edit Expense' : 'Add New Expense'}
        >
          <ExpenseForm
            initialData={selectedExpense}
            categories={expenseCategories}
            onSubmit={selectedExpense ? handleUpdateExpense : handleAddExpense}
            onCancel={handleCloseModal}
          />
        </Modal>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Dashboard>
  );
}

export default Expense;