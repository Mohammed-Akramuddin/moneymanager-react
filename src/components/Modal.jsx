import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000, // Much higher z-index
    backdropFilter: 'blur(8px)',
    animation: 'modalFadeIn 0.3s ease-out'
  };

  const modalStyle = {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '20px',
    position: 'relative',
    width: '500px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 32px 64px rgba(0, 0, 0, 0.3), 0 16px 32px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transform: 'scale(1)',
    animation: 'modalSlideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  };

  const headerStyle = {
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid rgba(102, 126, 234, 0.1)',
    position: 'relative'
  };

  const titleStyle = {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '0',
    right: '0',
    border: 'none',
    background: 'rgba(244, 245, 247, 0.8)',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    color: '#64748b'
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 1
  };

  // Add styles to document head if not already present
  React.useEffect(() => {
    if (!document.getElementById('modal-styles')) {
      const style = document.createElement('style');
      style.id = 'modal-styles';
      style.textContent = `
        @keyframes modalFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .modal-close-button:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #ef4444 !important;
          transform: scale(1.1) !important;
        }
        
        body.modal-open {
          overflow: hidden;
        }
      `;
      document.head.appendChild(style);
    }

    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  return createPortal(
    <div
      onClick={handleOverlayClick}
      style={overlayStyle}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <header style={headerStyle}>
          <h2 id="modal-title" style={titleStyle}>
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={closeButtonStyle}
            className="modal-close-button"
          >
            <X size={20} />
          </button>
        </header>

        <div style={contentStyle}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;