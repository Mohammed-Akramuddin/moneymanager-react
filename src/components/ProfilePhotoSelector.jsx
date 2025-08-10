import { Delete, Trash, Upload, User, Camera, Sparkles, Zap, Image } from 'lucide-react';
import React, { useRef, useState } from 'react';

function ProfilePhotoSelector({ image, setImage }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  console.log('📸 ProfilePhotoSelector - Current state:', { 
    hasImage: !!image, 
    hasPreview: !!previewUrl 
  });

  const handleImageSubmit = (e) => {
    const file = e.target.files[0];
    console.log('📁 File selected:', file ? { name: file.name, size: file.size, type: file.type } : 'none');
    
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      console.log('✅ Preview URL created:', preview);
    }
  };

  const handleRemoveImage = () => {
    console.log('🗑️ Removing image...');
    setImage(null);
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const onChooseFile = () => {
    console.log('🖱️ Choose file button clicked');
    inputRef.current?.click();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '32px'
    }}>
      
      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageSubmit}
        style={{ display: 'none' }}
      />

      {/* Profile Photo Container */}
      <div
        style={{
          position: 'relative',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: !image 
            ? 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1))'
            : 'transparent',
          border: !image 
            ? '3px dashed rgba(255, 255, 255, 0.3)'
            : '3px solid rgba(0, 255, 255, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          animation: 'avatarGlow 4s ease-in-out infinite alternate',
          boxShadow: image 
            ? '0 0 30px rgba(0, 255, 255, 0.3), 0 0 60px rgba(255, 0, 255, 0.2)'
            : '0 0 20px rgba(255, 255, 255, 0.1)'
        }}
        onClick={!image ? onChooseFile : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(255, 0, 255, 0.1) 0%, transparent 50%)
          `,
          animation: 'backgroundShift 6s ease-in-out infinite',
          borderRadius: '50%'
        }} />

        {!image ? (
          // Upload State
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: '#ffffff',
            zIndex: 2,
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              animation: 'iconFloat 3s ease-in-out infinite'
            }}>
              <User size={32} style={{
                filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))'
              }} />
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              opacity: 0.8
            }}>
              Add Photo
            </div>
          </div>
        ) : (
          // Image Preview State
          <img 
            src={previewUrl} 
            alt="Profile Preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
              zIndex: 2
            }}
          />
        )}

        {/* Hover Overlay for Image */}
        {image && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            zIndex: 3,
            backdropFilter: 'blur(5px)'
          }}>
            <div style={{
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: '600',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Change Photo
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center'
      }}>
        
        {/* Upload Button */}
        <button
          onClick={onChooseFile}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.1))',
            border: '1px solid rgba(0, 255, 255, 0.3)',
            borderRadius: '50px',
            color: '#00ffff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backdropFilter: 'blur(10px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(255, 0, 255, 0.2))';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(0, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.1))';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <Camera size={16} />
          <span>{image ? 'Change' : 'Upload'}</span>
        </button>

        {/* Remove Button */}
        {image && (
          <button
            onClick={handleRemoveImage}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, rgba(255, 68, 68, 0.2), rgba(255, 0, 0, 0.1))',
              border: '1px solid rgba(255, 68, 68, 0.3)',
              borderRadius: '50px',
              color: '#ff4444',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              backdropFilter: 'blur(10px)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 68, 68, 0.3), rgba(255, 0, 0, 0.2))';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(255, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 68, 68, 0.2), rgba(255, 0, 0, 0.1))';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <Trash size={16} />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Helper Text */}
      <div style={{
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '13px',
        maxWidth: '300px',
        lineHeight: '1.4'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginBottom: '4px'
        }}>
        </div>
      </div>

      <style jsx>{`
        @keyframes avatarGlow {
          0% { 
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
          }
          100% { 
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.2), 0 0 60px rgba(255, 0, 255, 0.1);
          }
        }
        
        @keyframes backgroundShift {
          0%, 100% { 
            background: radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.1) 0%, transparent 50%), 
                       radial-gradient(circle at 70% 70%, rgba(255, 0, 255, 0.1) 0%, transparent 50%);
          }
          50% { 
            background: radial-gradient(circle at 70% 30%, rgba(255, 255, 0, 0.1) 0%, transparent 50%), 
                       radial-gradient(circle at 30% 70%, rgba(0, 255, 255, 0.1) 0%, transparent 50%);
          }
        }
        
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes sparkleRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Mobile Responsive */
        @media (max-width: 576px) {
          .avatar-container {
            width: 100px !important;
            height: 100px !important;
          }
          
          .action-buttons {
            flex-direction: column !important;
            width: 100% !important;
          }
          
          .action-buttons button {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ProfilePhotoSelector;