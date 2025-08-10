import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
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
        await fetchIncomeDetails(); // Refresh the list
        setOpenAddIncomeModal(false);
        // You could add a success toast here
      }
    } catch (err) {
      console.error('Error creating income:', err);
      // You could add an error toast here
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
        await fetchIncomeDetails(); // Refresh the list
        setOpenAddIncomeModal(false);
        setSelectedIncome(null);
        // You could add a success toast here
      }
    } catch (err) {
      console.error('Error updating income:', err);
      // You could add an error toast here
    }
  };

  const handleDeleteIncome = async (income) => {
    if (window.confirm(`Are you sure you want to delete "${income.name}"?`)) {
      try {
        const response = await AxiosConfig.delete(`${API_ENDPOINTS.GET_ALL_INCOMES}/${income.id}`);
        if (response.status === 200) {
          await fetchIncomeDetails(); // Refresh the list
          // You could add a success toast here
        }
      } catch (err) {
        console.error('Error deleting income:', err);
        // You could add an error toast here
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
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        // Get filename from response headers or use default
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
      // You could add an error toast here
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

  const containerStyle = {
    padding: '0',
    position: 'relative',
    zIndex: 1
  };

  const headerStyle = {
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '2px solid rgba(34, 197, 94, 0.1)'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
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
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
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
          <h1 style={titleStyle}>Income Management</h1>
          <p style={subtitleStyle}>
            Track and manage your income sources efficiently
          </p>
        </div>

        <div style={actionsStyle}>
          <button
            onClick={() => setOpenAddIncomeModal(true)}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
            }}
          >
            <Plus size={18} />
            Add Income
          </button>
          
          <button
            onClick={fetchIncomeDetails}
            disabled={loading}
            style={refreshButtonStyle}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.borderColor = '#22c55e';
                e.target.style.color = '#22c55e';
                e.target.style.background = 'rgba(34, 197, 94, 0.05)';
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

export default Income;