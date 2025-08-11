import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import useUser from '../hooks/useUser';
import { Plus, RefreshCw } from 'lucide-react';
import CategoryList from '../components/CategoryList';
import AxiosConfig from '../util/AxiosConfig';
import { API_ENDPOINTS } from '../util/ApiEndpoints';
import Modal from '../components/Modal';
import CategoryForm from '../components/CategoryForm';

function Category() {
  useUser();

  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategoryDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await AxiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORY);
      if (response.status === 200) {
        setCategoryData(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (categoryData) => {
    try {
      const response = await AxiosConfig.post(API_ENDPOINTS.GET_ALL_CATEGORY, categoryData);
      if (response.status === 200 || response.status === 201) {
        await fetchCategoryDetails();
        setOpenAddCategoryModal(false);
      }
    } catch (err) {
      console.error('Error creating category:', err);
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setOpenAddCategoryModal(true);
  };

  const handleUpdateCategory = async (categoryData) => {
    try {
      const response = await AxiosConfig.put(
        `${API_ENDPOINTS.GET_ALL_CATEGORY}/${selectedCategory.id}`,
        categoryData
      );
      if (response.status === 200) {
        await fetchCategoryDetails();
        setOpenAddCategoryModal(false);
        setSelectedCategory(null);
      }
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const handleCloseModal = () => {
    setOpenAddCategoryModal(false);
    setSelectedCategory(null);
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, []);

  const containerStyle = {
    padding: '0',
    position: 'relative',
    zIndex: 1
  };

  const headerStyle = {
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid rgba(102, 126, 234, 0.1)',
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.02em'
  };

  const subtitleStyle = {
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    color: '#64748b',
    margin: 0,
    fontWeight: '500',
    paddingLeft: '1rem',
    paddingRight: '1rem'
  };

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: 'clamp(10px, 2vw, 12px) clamp(16px, 4vw, 24px)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    fontSize: 'clamp(12px, 2.5vw, 14px)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    minWidth: '120px',
    width: '100%',
    maxWidth: '200px'
  };

  const refreshButtonStyle = {
    ...buttonStyle,
    background: 'transparent',
    color: '#64748b',
    border: '2px solid #e2e8f0',
    boxShadow: 'none'
  };

  const actionsStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
    padding: '0 1rem'
  };

  return (
    <Dashboard>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Categories</h1>
          <p style={subtitleStyle}>
            Organize your expenses and income with custom categories
          </p>
        </div>

        <div style={actionsStyle}>
          <button
            onClick={() => setOpenAddCategoryModal(true)}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
          >
            <Plus size={18} />
            Add Category
          </button>
          
          <button
            onClick={fetchCategoryDetails}
            disabled={loading}
            style={refreshButtonStyle}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.borderColor = '#667eea';
                e.target.style.color = '#667eea';
                e.target.style.background = 'rgba(102, 126, 234, 0.05)';
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
        </div>

        <CategoryList 
          categories={categoryData} 
          onEditCategory={handleEditCategory}
          loading={loading}
        />

        <Modal
          isOpen={openAddCategoryModal}
          onClose={handleCloseModal}
          title={selectedCategory ? 'Edit Category' : 'Add New Category'}
        >
          <CategoryForm
            initialData={selectedCategory}
            onSubmit={selectedCategory ? handleUpdateCategory : handleAddCategory}
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

          /* Mobile responsive styles */
          @media (max-width: 767px) {
            .category-actions-mobile {
              flex-direction: column;
              gap: 0.75rem;
              padding: 0 0.5rem;
            }
            
            .category-button-mobile {
              width: 100% !important;
              max-width: none !important;
              min-width: auto !important;
            }
            
            .category-header-mobile {
              text-align: center;
              padding: 0 0.5rem;
              margin-bottom: 1rem;
            }
          }

          /* Tablet responsive styles */
          @media (min-width: 768px) and (max-width: 1023px) {
            .category-actions-tablet {
              justify-content: center;
              gap: 1rem;
            }
            
            .category-button-tablet {
              min-width: 140px;
              max-width: 180px;
            }
          }

          /* Large screen styles */
          @media (min-width: 1024px) {
            .category-actions-desktop {
              justify-content: flex-start;
            }
          }
        `}
      </style>
    </Dashboard>
  );
}

export default Category;