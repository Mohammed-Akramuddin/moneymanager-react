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
    padding: 'clamp(10px, 2vw, 12px) clamp(12px, 3vw, 16px)',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: 'clamp(14px, 2.5vw, 16px)',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
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
    fontSize: 'clamp(12px, 2vw, 14px)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const errorStyle = {
    color: '#ef4444',
    fontSize: 'clamp(12px, 2vw, 14px)',
    marginTop: '4px'
  };

  const buttonStyle = {
    padding: 'clamp(10px, 2vw, 12px) clamp(16px, 4vw, 24px)',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: 'clamp(12px, 2vw, 14px)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    minHeight: '44px',
    flexGrow: 1,
    minWidth: '120px'
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
    gap: 'clamp(8px, 2vw, 12px)',
    padding: 'clamp(10px, 2vw, 12px) clamp(12px, 3vw, 16px)',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: 'clamp(14px, 2.5vw, 16px)',
    width: '100%',
    justifyContent: 'space-between',
    minHeight: '44px',
    boxSizing: 'border-box'
  };

  const emojiPickerContainerStyle = {
    position: 'relative',
    zIndex: 1000
  };

  const emojiPickerWrapperStyle = {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1001,
    marginTop: '8px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    maxWidth: '90vw',
    width: 'min(350px, 90vw)'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(16px, 3vw, 24px)',
    padding: 'clamp(8px, 2vw, 0)'
  };

  const buttonsContainerStyle = {
    display: 'flex',
    gap: 'clamp(12px, 3vw, 16px)',
    justifyContent: 'flex-end',
    paddingTop: 'clamp(12px, 3vw, 16px)',
    borderTop: '1px solid #e2e8f0',
    flexDirection: window.innerWidth < 480 ? 'column' : 'row'
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
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
          onFocus={(e) => Object.assign(e.target.style, focusedInputStyle)}
          onBlur={(e) => Object.assign(e.target.style, inputStyle)}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)' }}>
            <span style={{ fontSize: 'clamp(20px, 4vw, 24px)' }}>{formData.icon}</span>
            <span style={{ color: '#64748b', fontSize: 'clamp(12px, 2vw, 14px)' }}>
              Choose an icon
            </span>
          </div>
          <Smile size={20} style={{ color: '#94a3b8' }} />
        </button>
        
        {showEmojiPicker && (
          <div style={emojiPickerWrapperStyle}>
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width={Math.min(350, window.innerWidth * 0.9)}
              height={Math.min(400, window.innerHeight * 0.5)}
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

      <div style={buttonsContainerStyle}>
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

      <style>
        {`
          @media (max-width: 479px) {
            .form-buttons-mobile {
              flex-direction: column !important;
              gap: 12px !important;
            }
            
            .form-button-mobile {
              width: 100% !important;
              min-width: auto !important;
            }
          }
        `}
      </style>
    </form>
  );
}

export default CategoryForm;