import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard'
import useUser from '../hooks/useUser';
import { Plus, RefreshCw, Download } from 'lucide-react';
import IncomeList from '../components/IncomeList';
import IncomeOverview from '../components/IncomeOverview';
import AxiosConfig from '../util/AxiosConfig';
import { API_ENDPOINTS } from '../util/ApiEndpoints';
import Modal from '../components/Modal';
import IncomeForm from '../components/IncomeForm';

function Income() {
  useUser();

  const [loading, setLoading] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [excelLoading, setExcelLoading] = useState(false);

  const fetchIncomeCategories = async () => {
    try {
      const response = await AxiosConfig.get(API_ENDPOINTS.GET_ALL_INCOME_CATEGORY);
      if (response.status === 200) {
        setIncomeCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching income categories:', err);
    }
  };

  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await AxiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
      if (response.status === 200) {
        setIncomeData(response.data);
      }
    } catch (err) {
      console.error('Error fetching incomes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (incomeData) => {
    try {
      const response = await AxiosConfig.post(API_ENDPOINTS.ADD_INCOME, incomeData);
      if (response.status === 200 || response.status === 201) {
        await fetchIncomeDetails();
        setOpenAddIncomeModal(false);
      }
    } catch (err) {
      console.error('Error creating income:', err);
    }
  };

  const handleEditIncome = (income) => {
    setSelectedIncome(income);
    setOpenAddIncomeModal(true);
  };

  const handleUpdateIncome = async (incomeData) => {
    try {
      const response = await AxiosConfig.put(
        `${API_ENDPOINTS.GET_ALL_INCOMES}/${selectedIncome.id}`, 
        incomeData
      );
      if (response.status === 200) {
        await fetchIncomeDetails();
        setOpenAddIncomeModal(false);
        setSelectedIncome(null);
      }
    } catch (err) {
      console.error('Error updating income:', err);
    }
  };

  const handleDeleteIncome = async (income) => {
    if (window.confirm(`Are you sure you want to delete "${income.name}"?`)) {
      try {
        const response = await AxiosConfig.delete(`${API_ENDPOINTS.GET_ALL_INCOMES}/${income.id}`);
        if (response.status === 200) {
          await fetchIncomeDetails();
        }
      } catch (err) {
        console.error('Error deleting income:', err);
      }
    }
  };

  const handleExportExcel = async () => {
    setExcelLoading(true);
    try {
      const response = await AxiosConfig.get(API_ENDPOINTS.INCOME_EXCEL, {
        responseType: 'blob'
      });
      
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'income-report.xlsx';
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
    setOpenAddIncomeModal(false);
    setSelectedIncome(null);
  };

  useEffect(() => {
    fetchIncomeCategories();
    fetchIncomeDetails();
  }, []);

  return (
    <Dashboard>
      <div className="income-container">
        <div className="income-header">
          <h1 className="income-title">Income Management</h1>
          <p className="income-subtitle">
            Track and manage your income sources efficiently
          </p>
        </div>

        <div className="income-actions">
          <button
            onClick={() => setOpenAddIncomeModal(true)}
            className="btn btn-primary"
          >
            <Plus size={18} />
            <span className="btn-text">Add Income</span>
          </button>
          
          <button
            onClick={fetchIncomeDetails}
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

        <IncomeOverview incomes={incomeData} />

        <IncomeList 
          incomes={incomeData} 
          onEditIncome={handleEditIncome}
          onDeleteIncome={handleDeleteIncome}
          loading={loading}
        />

        <Modal
          isOpen={openAddIncomeModal}
          onClose={handleCloseModal}
          title={selectedIncome ? 'Edit Income' : 'Add New Income'}
        >
          <IncomeForm
            initialData={selectedIncome}
            categories={incomeCategories}
            onSubmit={selectedIncome ? handleUpdateIncome : handleAddIncome}
            onCancel={handleCloseModal}
          />
        </Modal>
      </div>

      <style jsx>{`
        .income-container {
          padding: 0;
          position: relative;
          z-index: 1;
        }

        .income-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(34, 197, 94, 0.1);
        }

        .income-title {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.02em;
        }

        .income-subtitle {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }

        .income-actions {
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
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
        }

        .btn-secondary {
          background: transparent;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .btn-secondary:hover:not(:disabled) {
          border-color: #22c55e;
          color: #22c55e;
          background: rgba(34, 197, 94, 0.05);
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
          .income-container {
            padding: 0 0.5rem;
          }

          .income-header {
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            text-align: center;
          }

          .income-title {
            font-size: 1.5rem;
          }

          .income-subtitle {
            font-size: 0.8rem;
          }

          .income-actions {
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
          .income-container {
            padding: 0 0.25rem;
          }

          .income-actions {
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
          .income-container {
            padding: 0 1rem;
          }

          .income-title {
            font-size: 1.625rem;
          }

          .btn {
            padding: 11px 20px;
            font-size: 13px;
          }
        }

        /* Large Desktop Styles */
        @media (min-width: 1200px) {
          .income-container {
            padding: 0 2rem;
          }

          .income-title {
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

export default Income;