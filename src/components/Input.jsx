import { Eye, EyeOff, Sparkles, Zap } from 'lucide-react';
import React, { useState } from 'react';

function Input({ value, onChange, placeholder, label, type, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  console.log(`🎯 Input field "${label}" - Value: ${value ? '[PROTECTED]' : 'empty'}, Error: ${error || 'none'}`);

  const toggleShowPassword = () => {
    console.log(`👁️ Toggling password visibility for "${label}"`);
    setShowPassword(!showPassword);
  };

  const handleFocus = () => {
    console.log(`🔍 Input "${label}" focused`);
    setIsFocused(true);
  };

  const handleBlur = () => {
    console.log(`👋 Input "${label}" blurred`);
    setIsFocused(false);
  };

  const handleChange = (e) => {
    console.log(`✏️ Input "${label}" value changed`);
    onChange(e);
  };

  return (
    <div style={{
      marginBottom: '28px',
      position: 'relative'
    }}>
      {/* Futuristic Label */}
      <label style={{
        display: 'block',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '12px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
        animation: 'labelGlow 3s ease-in-out infinite alternate'
      }}>
        <Zap size={16} style={{ 
          marginRight: '8px', 
          verticalAlign: 'middle',
          color: isFocused ? '#00ffff' : '#ffffff'
        }} />
        {label}
      </label>

      {/* Input Container */}
      <div style={{
        position: 'relative',
        background: error 
          ? 'linear-gradient(135deg, rgba(255, 68, 68, 0.1), rgba(255, 0, 0, 0.05))'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(0, 255, 255, 0.02))',
        borderRadius: '16px',
        padding: '2px',
        animation: isFocused ? 'inputContainerActive 2s ease-in-out infinite' : 'inputContainerIdle 4s ease-in-out infinite'
      }}>
        
        {/* Holographic Border Effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isFocused 
            ? 'linear-gradient(45deg, #00ffff, #ff00ff, #ffff00, #00ffff)'
            : error
            ? 'linear-gradient(45deg, #ff4444, #ff0000, #ff4444)'
            : 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1))',
          borderRadius: '16px',
          animation: isFocused ? 'borderRotate 3s linear infinite' : 'none',
          opacity: isFocused ? 1 : 0.3
        }} />

        {/* Main Input */}
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type || 'text'}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            width: '100%',
            padding: type === 'password' ? '20px 64px 20px 24px' : '20px 24px',
            border: 'none',
            borderRadius: '14px',
            fontSize: '16px',
            color: '#ffffff',
            outline: 'none',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            background: error 
              ? 'rgba(20, 20, 30, 0.9)' 
              : isFocused 
              ? 'rgba(10, 15, 30, 0.95)' 
              : 'rgba(15, 20, 35, 0.9)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            zIndex: 2,
            boxShadow: isFocused 
              ? '0 0 30px rgba(0, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : error 
              ? '0 0 20px rgba(255, 68, 68, 0.3)'
              : 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            transform: isFocused ? 'translateY(-2px)' : 'translateY(0)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          }}
        />

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              zIndex: 3,
              backdropFilter: 'blur(5px)'
            }}
            onClick={toggleShowPassword}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 255, 255, 0.2)';
              e.target.style.color = '#00ffff';
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
              e.target.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#ffffff';
              e.target.style.transform = 'translateY(-50%) scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {showPassword ? (
              <Eye size={22} />
            ) : (
              <EyeOff size={22} />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          color: '#ff4444',
          fontSize: '13px',
          fontWeight: '500',
          marginTop: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'errorPulse 0.5s ease-in-out',
          background: 'rgba(255, 68, 68, 0.1)',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 68, 68, 0.2)'
        }}>
          <Sparkles size={14} style={{ 
            animation: 'sparkle 1s ease-in-out infinite alternate'
          }} />
          {error}
        </div>
      )}

      <style jsx>{`
        @keyframes labelGlow {
          0% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
          100% { text-shadow: 0 0 15px rgba(255, 255, 255, 0.6), 0 0 25px rgba(0, 255, 255, 0.3); }
        }
        
        @keyframes inputContainerActive {
          0%, 100% { 
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.05));
          }
          50% { 
            background: linear-gradient(135deg, rgba(255, 0, 255, 0.1), rgba(255, 255, 0, 0.05));
          }
        }
        
        @keyframes inputContainerIdle {
          0%, 100% { 
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(0, 255, 255, 0.02));
          }
          50% { 
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 0, 255, 0.02));
          }
        }
        
        @keyframes borderRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes errorPulse {
          0% { transform: translateX(0); opacity: 0; }
          25% { transform: translateX(-5px); opacity: 1; }
          75% { transform: translateX(5px); opacity: 1; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes sparkle {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(180deg) scale(1.1); }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
          font-style: italic;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 576px) {
          input {
            padding: 18px 60px 18px 20px !important;
            font-size: 14px !important;
          }
          
          label {
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Input;