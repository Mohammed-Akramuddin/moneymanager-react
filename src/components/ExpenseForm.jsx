import React, { useState } from 'react';
import { Save, Smile, DollarSign, Tag, TrendingDown } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

function ExpenseForm({ onSubmit, onCancel, initialData = null, categories = [] }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    amount: initialData?.amount || '',
    icon: initialData?.icon || '💸',
    category_id: initialData?.category?.id || initialData?.category_id || (categories.length > 0 ? categories[0].id : '')
  });

  const [errors, setErrors] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        amount: value
      }));
      
      // Clear error when user starts typing
      if (errors.amount) {
        setErrors(prev => ({
          ...prev,
          amount: ''
        }));
      }
    }
  };

  const handleEmojiClick = (emojiData) => {
    setFormData(prev => ({
      ...prev,
      icon: emojiData.emoji
    }));
    setShowEmojiPicker(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Expense name is required';
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'Category selection is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        name: formData.name.trim(),
        amount: parseFloat(formData.amount),
        icon: formData.icon,
        category_id: parseInt(formData.category_id, 10)
      };
      onSubmit(submitData);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
  };

  const focusedInputStyle = {
    ...inputStyle,
    borderColor: '#ef4444',
    boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const errorStyle = {
    color: '#ef4444',
    fontSize: '14px',
    marginTop: '4px'
  };

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'transparent',
    color: '#64748b',
    border: '2px solid #e2e8f0'
  };

  const emojiButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '16px',
    width: '100%',
    justifyContent: 'space-between'
  };

  const emojiPickerContainerStyle = {
    position: 'relative',
    zIndex: 1000
  };

  const emojiPickerWrapperStyle = {
    position: 'absolute',
    top: '100%',
    left: '0',
    zIndex: 1001,
    marginTop: '8px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0'
  };

  const amountInputStyle = {
    ...inputStyle,
    paddingLeft: '48px'
  };

  const amountContainerStyle = {
    position: 'relative'
  };

  const dollarIconStyle = {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#ef4444',
    zIndex: 1
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <label htmlFor="name" style={labelStyle}>
          <TrendingDown size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Expense Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          style={inputStyle}
          placeholder="Enter expense name (e.g., Groceries, Rent)"
          onFocus={(e) => e.target.style.cssText = Object.entries(focusedInputStyle).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`).join('; ')}
          onBlur={(e) => e.target.style.cssText = Object.entries(inputStyle).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`).join('; ')}
        />
        {errors.name && <p style={errorStyle}>{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="amount" style={labelStyle}>
          <DollarSign size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Amount
        </label>
        <div style={amountContainerStyle}>
          <DollarSign size={20} style={dollarIconStyle} />
          <input
            type="text"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleAmountChange}
            style={amountInputStyle}
            placeholder="0.00"
            onFocus={(e) => {
              const focusedStyle = { ...focusedInputStyle, paddingLeft: '48px' };
              e.target.style.cssText = Object.entries(focusedStyle).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`).join('; ');
            }}
            onBlur={(e) => e.target.style.cssText = Object.entries(amountInputStyle).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`).join('; ')}
          />
        </div>
        {errors.amount && <p style={errorStyle}>{errors.amount}</p>}
      </div>

      <div>
        <label htmlFor="category_id" style={labelStyle}>
          <Tag size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Expense Category
        </label>
        <select
          id="category_id"
          name="category_id"
          value={formData.category_id}
          onChange={handleInputChange}
          style={inputStyle}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
        {errors.category_id && <p style={errorStyle}>{errors.category_id}</p>}
      </div>

      <div style={emojiPickerContainerStyle}>
        <label style={labelStyle}>
          <Smile size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Expense Icon
        </label>
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          style={{
            ...emojiButtonStyle,
            borderColor: showEmojiPicker ? '#ef4444' : '#e2e8f0',
            boxShadow: showEmojiPicker ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (!showEmojiPicker) {
              e.target.style.borderColor = '#cbd5e1';
            }
          }}
          onMouseLeave={(e) => {
            if (!showEmojiPicker) {
              e.target.style.borderColor = '#e2e8f0';
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>{formData.icon}</span>
            <span style={{ color: '#64748b' }}>Click to choose an icon</span>
          </div>
          <Smile size={20} style={{ color: '#94a3b8' }} />
        </button>
        
        {showEmojiPicker && (
          <div style={emojiPickerWrapperStyle}>
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width={350}
              height={400}
              searchDisabled={false}
              skinTonesDisabled={true}
              previewConfig={{
                showPreview: false
              }}
              categories={[
                'smileys_people',
                'animals_nature',
                'food_drink',
                'travel_places',
                'activities',
                'objects',
                'symbols'
              ]}
            />
          </div>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        justifyContent: 'flex-end',
        paddingTop: '16px',
        borderTop: '1px solid #e2e8f0'
      }}>
        <button
          type="button"
          onClick={() => {
            setShowEmojiPicker(false);
            onCancel();
          }}
          style={secondaryButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#ef4444';
            e.target.style.color = '#ef4444';
            e.target.style.background = 'rgba(239, 68, 68, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.color = '#64748b';
            e.target.style.background = 'transparent';
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={primaryButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
          }}
        >
          <Save size={16} />
          {initialData ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>

      {/* Click outside to close emoji picker */}
      {showEmojiPicker && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setShowEmojiPicker(false)}
        />
      )}
    </form>
  );
}

export default ExpenseForm;