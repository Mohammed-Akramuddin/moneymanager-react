import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, Loader2, Shield, TrendingUp, ArrowRight, DollarSign, PieChart, BarChart3, Eye, EyeOff, Sparkles, Zap, Globe, Lock } from 'lucide-react';
import { validateEmail } from '../util/ValidateEmail';
import AxiosConfig from '../util/AxiosConfig';
import { API_ENDPOINTS } from '../util/ApiEndpoints';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfilePhotoSelector from '../components/ProfilePhotoSelector';
import { uploadProfileImage } from '../util/uploadProfileImage';

function SignUp() {
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
    }
    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password.trim()) {
      newErrors.password = "Please enter a password";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    let profileImageUrl = "";
    e.preventDefault();
    
    console.log("🚀 Starting registration process...");
    console.log("📝 Form Data:", { fullName, email, hasImage: !!image });
    
    if (!validateForm()) {
      console.log("❌ Form validation failed:", errors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (image) {
        console.log("📸 Uploading profile image...");
        const url = await uploadProfileImage(image);
        profileImageUrl = url || "";
        console.log("✅ Profile image uploaded:", profileImageUrl);
      }
      
      console.log("🌐 Sending registration request...");
      const response = await AxiosConfig.post(API_ENDPOINTS.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl
      });
      
      if (response.status === 200) {
        console.log("✅ Registration successful:", response.data);
        toast.success("🎉 Account created successfully! Welcome aboard!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        setTimeout(() => {
          console.log("🔄 Redirecting to login...");
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("💥 Registration failed:", error);
      let errorMessage = "An unexpected error occurred";
      
      if (error.response && error.response.status === 403) {
        errorMessage = "Access forbidden. Please check your credentials.";
      } else if (error.response && error.response.data) {
        errorMessage = error.response.data.message || "Registration failed";
      }
      
      toast.error(`❌ ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 75%, #000000 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.2) 0%, transparent 50%)
          `,
          animation: 'backgroundPulse 8s ease-in-out infinite',
          zIndex: 1
        }}></div>
        
        {/* Floating Particles */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2
        }}>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                background: `linear-gradient(45deg, #00ffff, #ff00ff)`,
                borderRadius: '50%',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `floatingParticles ${Math.random() * 10 + 15}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.6,
                boxShadow: '0 0 10px currentColor'
              }}
            />
          ))}
        </div>

        {/* Holographic Icons */}
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          color: 'rgba(0, 255, 255, 0.3)',
          animation: 'holographicFloat 6s ease-in-out infinite',
          zIndex: 3
        }}>
          <DollarSign size={32} />
        </div>
        <div style={{
          position: 'absolute',
          top: '70%',
          left: '8%',
          color: 'rgba(255, 0, 255, 0.3)',
          animation: 'holographicFloat 8s ease-in-out infinite reverse',
          zIndex: 3
        }}>
          <PieChart size={28} />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '20%',
          color: 'rgba(255, 255, 0, 0.3)',
          animation: 'holographicSpin 10s linear infinite',
          zIndex: 3
        }}>
          <BarChart3 size={30} />
        </div>
        
        <div className="container-fluid h-100" style={{ position: 'relative', zIndex: 10 }}>
          <div className="row h-100 align-items-center justify-content-center py-4">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
              
              {/* Main Card */}
              <div style={{
                background: 'rgba(17, 25, 40, 0.75)',
                backdropFilter: 'blur(16px) saturate(180%)',
                borderRadius: '24px',
                padding: '48px 40px',
                border: '1px solid rgba(255, 255, 255, 0.125)',
                boxShadow: `
                  0 8px 32px 0 rgba(31, 38, 135, 0.37),
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
                  0 0 0 1px rgba(255, 255, 255, 0.05)
                `,
                position: 'relative',
                overflow: 'hidden',
                animation: 'cardGlow 4s ease-in-out infinite alternate'
              }}>
                
                {/* Card Background Effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.05) 0%, rgba(255, 0, 255, 0.05) 100%)',
                  borderRadius: '24px',
                  opacity: 0.8,
                  animation: 'shimmer 3s ease-in-out infinite alternate'
                }}></div>
                
                {/* Content */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  
                  {/* Logo Section */}
                  <div className="text-center mb-5">
                    <h1 style={{
                      fontSize: 'clamp(28px, 5vw, 36px)',
                      fontWeight: '900',
                      background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #ffff00 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '12px',
                      letterSpacing: '-1px',
                      textShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
                      animation: 'titleGlow 3s ease-in-out infinite alternate'
                    }}>
                      Money Manager
                    </h1>
                  </div>

                 

                  {/* Form Header */}
                  <div className="text-center mb-4">
                    <h3 style={{
                      fontSize: 'clamp(22px, 4vw, 28px)',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '8px',
                      textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                    }}>
                      Initialize Your Account
                    </h3>
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '16px',
                      marginBottom: '0'
                    }}>
                      Join the next generation of financial management
                    </p>
                  </div>

                  {/* Profile Photo Selector */}
                  <div className="text-center mb-4">
                    <ProfilePhotoSelector 
                      image={image}
                      setImage={setImage}
                    />
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    
                    {/* Full Name Input */}
                    <div className="mb-4">
                      <label style={{
                        display: 'block',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        <Globe size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullname(e.target.value)}
                        placeholder="Enter your full name"
                        style={{
                          width: '100%',
                          padding: '18px 24px',
                          border: errors.fullName ? '2px solid #ff4444' : '2px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '16px',
                          fontSize: '16px',
                          color: '#ffffff',
                          outline: 'none',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          background: errors.fullName ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#00ffff';
                          e.target.style.background = 'rgba(0, 255, 255, 0.1)';
                          e.target.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.fullName ? '#ff4444' : 'rgba(255, 255, 255, 0.1)';
                          e.target.style.background = errors.fullName ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      {errors.fullName && (
                        <div style={{
                          color: '#ff4444',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginTop: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Sparkles size={12} />
                          {errors.fullName}
                        </div>
                      )}
                    </div>

                    {/* Email Input */}
                    <div className="mb-4">
                      <label style={{
                        display: 'block',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        <Globe size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        style={{
                          width: '100%',
                          padding: '18px 24px',
                          border: errors.email ? '2px solid #ff4444' : '2px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '16px',
                          fontSize: '16px',
                          color: '#ffffff',
                          outline: 'none',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          background: errors.email ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#ff00ff';
                          e.target.style.background = 'rgba(255, 0, 255, 0.1)';
                          e.target.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.3)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.email ? '#ff4444' : 'rgba(255, 255, 255, 0.1)';
                          e.target.style.background = errors.email ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      {errors.email && (
                        <div style={{
                          color: '#ff4444',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginTop: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Sparkles size={12} />
                          {errors.email}
                        </div>
                      )}
                    </div>
                    
                    {/* Password Input */}
                    <div className="mb-5">
                      <label style={{
                        display: 'block',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        <Lock size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a secure password"
                          style={{
                            width: '100%',
                            padding: '18px 60px 18px 24px',
                            border: errors.password ? '2px solid #ff4444' : '2px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            fontSize: '16px',
                            color: '#ffffff',
                            outline: 'none',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: errors.password ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#ffff00';
                            e.target.style.background = 'rgba(255, 255, 0, 0.1)';
                            e.target.style.boxShadow = '0 0 20px rgba(255, 255, 0, 0.3)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = errors.password ? '#ff4444' : 'rgba(255, 255, 255, 0.1)';
                            e.target.style.background = errors.password ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
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
                            padding: '8px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(0, 255, 255, 0.2)';
                            e.target.style.color = '#00ffff';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.target.style.color = '#ffffff';
                          }}
                        >
                          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </span>
                      </div>
                      {errors.password && (
                        <div style={{
                          color: '#ff4444',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginTop: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Sparkles size={12} />
                          {errors.password}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        padding: '20px 24px',
                        background: isLoading 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : 'linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #ffff00 100%)',
                        border: 'none',
                        borderRadius: '16px',
                        color: isLoading ? 'rgba(255, 255, 255, 0.5)' : '#000000',
                        fontSize: '16px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 8px 32px rgba(0, 255, 255, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.target.style.transform = 'translateY(-4px)';
                          e.target.style.boxShadow = '0 12px 40px rgba(255, 0, 255, 0.4)';
                          e.target.style.background = 'linear-gradient(135deg, #ff00ff 0%, #ffff00 50%, #00ffff 100%)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 8px 32px rgba(0, 255, 255, 0.3)';
                          e.target.style.background = 'linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #ffff00 100%)';
                        }
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
                          Initializing...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight size={24} />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Login Link */}
                  <div className="text-center mt-4 mb-4">
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '16px',
                      marginBottom: '0'
                    }}>
                      Already have an account? 
                      <Link 
                        to="/login" 
                        style={{
                          color: '#00ffff',
                          textDecoration: 'none',
                          fontWeight: '700',
                          marginLeft: '8px',
                          textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#ff00ff';
                          e.target.style.textShadow = '0 0 15px rgba(255, 0, 255, 0.7)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#00ffff';
                          e.target.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
                        }}
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes backgroundPulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes floatingParticles {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        
        @keyframes holographicFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 0.7; }
        }
        
        @keyframes holographicSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes cardGlow {
          0% { box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05); }
          100% { box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 40px rgba(0, 255, 255, 0.1); }
        }
        
        @keyframes shimmer {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        @keyframes logoSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes neonPulse {
          0% { filter: drop-shadow(0 0 10px #00ffff); }
          100% { filter: drop-shadow(0 0 30px #00ffff) drop-shadow(0 0 40px #ff00ff); }
        }
        
        @keyframes titleGlow {
          0% { text-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
          100% { text-shadow: 0 0 30px rgba(0, 255, 255, 0.8), 0 0 40px rgba(255, 0, 255, 0.5); }
        }
        
        @keyframes badgeHover {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-2px); }
        }
        
        @keyframes securityPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        
        @media (max-width: 576px) {
          .card-container {
            padding: 32px 24px !important;
          }
          
          .feature-badges {
            flex-direction: column !important;
            align-items: center !important;
          }
        }
      `}</style>
    </>
  );
}

export default SignUp;