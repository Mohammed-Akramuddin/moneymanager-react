import React, { useState } from 'react';
import { Save, Smile, Tag } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

function CategoryForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'expense',
    icon: initialData?.icon || '💰'
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
      newErrors.name = 'Category name is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Category type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Only send name, type, and icon to the API
      const submitData = {
        name: formData.name.trim(),
        type: formData.type,
        icon: formData.icon
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
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
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

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <label htmlFor="name" style={labelStyle}>
          <Tag size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Category Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          style={inputStyle}
          placeholder="Enter category name"
          onFocus={(e) => e.target.style.cssText = Object.entries(focusedInputStyle).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`).join('; ')}
          onBlur={(e) => e.target.style.cssText = Object.entries(inputStyle).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`).join('; ')}
        />
        {errors.name && <p style={errorStyle}>{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="type" style={labelStyle}>Category Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          style={inputStyle}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        {errors.type && <p style={errorStyle}>{errors.type}</p>}
      </div>

      <div style={emojiPickerContainerStyle}>
        <label style={labelStyle}>
          <Smile size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Category Icon
        </label>
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          style={{
            ...emojiButtonStyle,
            borderColor: showEmojiPicker ? '#667eea' : '#e2e8f0',
            boxShadow: showEmojiPicker ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
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
            e.target.style.borderColor = '#667eea';
            e.target.style.color = '#667eea';
            e.target.style.background = 'rgba(102, 126, 234, 0.05)';
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
            e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
          }}
        >
          <Save size={16} />
          {initialData ? 'Update Category' : 'Create Category'}
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

export default CategoryForm;