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

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        amount: value
      }));

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

  return (
    <div className="expense-form-container">
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            <TrendingDown size={16} />
            Expense Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter expense name (e.g., Groceries, Rent)"
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            <DollarSign size={16} />
            Amount
          </label>
          <div className="amount-input-container">
            <DollarSign size={20} className="amount-icon" />
            <input
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleAmountChange}
              className="form-input amount-input"
              placeholder="0.00"
            />
          </div>
          {errors.amount && <p className="form-error">{errors.amount}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="category_id" className="form-label">
            <Tag size={16} />
            Expense Category
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className="form-input form-select"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && <p className="form-error">{errors.category_id}</p>}
        </div>

        <div className="form-group emoji-picker-container">
          <label className="form-label">
            <Smile size={16} />
            Expense Icon
          </label>
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`emoji-button ${showEmojiPicker ? 'active' : ''}`}
          >
            <div className="emoji-button-content">
              <span className="emoji-display">{formData.icon}</span>
              <span className="emoji-text">Click to choose an icon</span>
            </div>
            <Smile size={20} className="emoji-icon" />
          </button>

          {showEmojiPicker && (
            <div className="emoji-picker-wrapper">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width="100%"
                height={300}
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

        <div className="form-actions">
          <button
            type="button"
            onClick={() => {
              setShowEmojiPicker(false);
              onCancel();
            }}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            <Save size={16} />
            <span>{initialData ? 'Update Expense' : 'Add Expense'}</span>
          </button>
        </div>
      </form>

      {showEmojiPicker && (
        <div
          className="emoji-overlay"
          onClick={() => setShowEmojiPicker(false)}
        />
      )}

      <style jsx>{`
        .expense-form-container {
          position: relative;
        }

        .expense-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.2s ease;
          font-family: inherit;
          background: white;
        }

        .form-input:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
          outline: none;
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
          padding-right: 40px;
        }

        .amount-input-container {
          position: relative;
        }

        .amount-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #ef4444;
          z-index: 1;
        }

        .amount-input {
          padding-left: 48px;
        }

        .form-error {
          color: #ef4444;
          font-size: 0.875rem;
          margin: 0;
        }

        .emoji-picker-container {
          position: relative;
          z-index: 1000;
        }

        .emoji-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 16px;
          width: 100%;
        }

        .emoji-button:hover {
          border-color: #cbd5e1;
        }

        .emoji-button.active {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .emoji-button-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .emoji-display {
          font-size: 24px;
        }

        .emoji-text {
          color: #64748b;
        }

        .emoji-icon {
          color: #94a3b8;
        }

        .emoji-picker-wrapper {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 1001;
          margin-top: 8px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          background: white;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          min-height: 44px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
        }

        .btn-secondary {
          background: transparent;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .btn-secondary:hover {
          border-color: #ef4444;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .emoji-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 999;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .expense-form {
            gap: 1rem;
          }

          .form-input {
            padding: 14px 16px;
            font-size: 16px;
          }

          .amount-input {
            padding-left: 44px;
          }

          .amount-icon {
            left: 14px;
          }

          .emoji-button {
            padding: 14px 16px;
          }

          .emoji-display {
            font-size: 20px;
          }

          .emoji-text {
            font-size: 14px;
          }

          .emoji-picker-wrapper {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90vw;
            max-width: 350px;
            z-index: 2000;
          }

          .form-actions {
            flex-direction: column-reverse;
            gap: 0.75rem;
          }

          .btn {
            justify-content: center;
            padding: 14px 20px;
            font-size: 16px;
          }
        }

        /* Tablet Responsive Styles */
        @media (min-width: 768px) and (max-width: 1024px) {
          .form-input {
            padding: 13px 16px;
          }

          .emoji-picker-wrapper {
            max-width: 400px;
          }
        }

        /* Small mobile devices */
        @media (max-width: 480px) {
          .emoji-picker-wrapper {
            width: 95vw;
            max-width: 320px;
          }

          .form-label {
            font-size: 0.8rem;
          }

          .btn {
            font-size: 14px;
            padding: 12px 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default ExpenseForm;