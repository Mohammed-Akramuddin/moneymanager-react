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
        await fetchExpenseDetails();
        setOpenAddExpenseModal(false);
      }
    } catch (err) {
      console.error('Error creating expense:', err);
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
        await fetchExpenseDetails();
        setOpenAddExpenseModal(false);
        setSelectedExpense(null);
      }
    } catch (err) {
      console.error('Error updating expense:', err);
    }
  };

  const handleDeleteExpense = async (expense) => {
    if (window.confirm(`Are you sure you want to delete "${expense.name}"?`)) {
      try {
        const response = await AxiosConfig.delete(`${API_ENDPOINTS.GET_ALL_EXPENSES}/${expense.id}`);
        if (response.status === 200) {
          await fetchExpenseDetails();
        }
      } catch (err) {
        console.error('Error deleting expense:', err);
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
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

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

  return (
    <Dashboard>
      <div className="expense-container">
        <div className="expense-header">
          <h1 className="expense-title">Expense Management</h1>
          <p className="expense-subtitle">
            Track and manage your expenses efficiently
          </p>
        </div>

        <div className="expense-actions">
          <button
            onClick={() => setOpenAddExpenseModal(true)}
            className="btn btn-primary"
          >
            <Plus size={18} />
            <span className="btn-text">Add Expense</span>
          </button>

          <button
            onClick={fetchExpenseDetails}
            disabled={loading}
            className="btn btn-secondary"
          >
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
            <span className="btn-text">Refresh</span>
          </button>

          <button
            onClick={handleExportExcel}
            disabled={excelLoading}
            className="btn btn-accent"
          >
            <Download size={18} className={excelLoading ? 'spinning' : ''} />
            <span className="btn-text">Export</span>
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

      <style jsx>{`
        .expense-container {
          padding: 0;
          position: relative;
          z-index: 1;
        }

        .expense-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(239, 68, 68, 0.1);
        }

        .expense-title {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.02em;
        }

        .expense-subtitle {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }

        .expense-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          min-height: 44px;
          white-space: nowrap;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
        }

        .btn-secondary {
          background: transparent;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .btn-secondary:hover:not(:disabled) {
          border-color: #ef4444;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
          transform: translateY(-2px);
        }

        .btn-accent {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-accent:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .btn-text {
          display: inline;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .expense-container {
            padding: 0 0.5rem;
          }

          .expense-header {
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            text-align: center;
          }

          .expense-title {
            font-size: 1.5rem;
          }

          .expense-subtitle {
            font-size: 0.8rem;
          }

          .expense-actions {
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }

          .btn {
            padding: 12px 16px;
            font-size: 14px;
            min-height: 48px;
            width: 100%;
            justify-content: center;
          }

          .btn-text {
            display: inline;
          }

          .btn svg {
            margin-right: 8px;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 480px) {
          .expense-container {
            padding: 0 0.25rem;
          }

          .expense-actions {
            gap: 0.375rem;
          }

          .btn {
            padding: 10px 14px;
            font-size: 13px;
            min-height: 44px;
          }
        }

        /* Tablet Responsive Styles */
        @media (min-width: 768px) and (max-width: 1024px) {
          .expense-container {
            padding: 0 1rem;
          }

          .expense-title {
            font-size: 1.625rem;
          }

          .btn {
            padding: 11px 20px;
            font-size: 13px;
          }
        }

        /* Large Desktop Styles */
        @media (min-width: 1200px) {
          .expense-container {
            padding: 0 2rem;
          }

          .expense-title {
            font-size: 2rem;
          }

          .btn {
            padding: 12px 24px;
          }
        }
      `}</style>
    </Dashboard>
  );
}

export default Expense;