import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, Loader2, Shield, TrendingUp, ArrowRight, DollarSign, PieChart, BarChart3, Eye, EyeOff, Sparkles, Zap, Globe, Lock, User } from 'lucide-react';
import { validateEmail } from '../util/ValidateEmail';
import AxiosConfig from '../util/AxiosConfig';
import { API_ENDPOINTS } from '../util/ApiEndpoints';
import { AppContext } from '../context/AppContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);

  const validateForm = () => {
    const newErrors = {};
    
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
    e.preventDefault();
    
    console.log("🔐 Initiating login sequence...");
    console.log("📧 Login attempt for:", email);
    
    if (!validateForm()) {
      console.log("❌ Form validation failed:", errors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      console.log("🌐 Sending authentication request...");
      const response = await AxiosConfig.post(API_ENDPOINTS.LOGIN, {
        email,
        password
      });
      
      const { token, user } = response.data;
      console.log("✅ Authentication successful:", { token: !!token, user: user?.email });
      
      if (token) {
        localStorage.setItem("token", token);
        setUser(user);
        
        toast.success("🚀 Welcome back! Accessing your dashboard...", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        setTimeout(() => {
          console.log("🔄 Redirecting to dashboard...");
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error("💥 Authentication failed:", error);
      let errorMessage = "Invalid email or password";
      
      if (error.response && error.response.status === 401) {
        errorMessage = "Invalid credentials. Please check your email and password.";
      } else if (error.response && error.response.data) {
        errorMessage = error.response.data.message || "Login failed";
      }
      
      toast.error(`🔒 ${errorMessage}`, {
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
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 25%, #16213e 50%, #0f3460 75%, #000428 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        
        {/* Dynamic Background Grid */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite',
          zIndex: 1
        }}></div>
        
        {/* Animated Orbs */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2
        }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
                background: `radial-gradient(circle, ${
                  i % 3 === 0 ? 'rgba(0, 255, 255, 0.1)' : 
                  i % 3 === 1 ? 'rgba(255, 0, 255, 0.1)' : 
                  'rgba(255, 255, 0, 0.1)'
                } 0%, transparent 70%)`,
                borderRadius: '50%',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `orbFloat ${Math.random() * 15 + 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                filter: 'blur(1px)'
              }}
            />
          ))}
        </div>

        {/* Holographic Elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          color: 'rgba(0, 255, 255, 0.2)',
          animation: 'holoFloat 8s ease-in-out infinite',
          zIndex: 3
        }}>
          <DollarSign size={28} />
        </div>
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          color: 'rgba(255, 0, 255, 0.2)',
          animation: 'holoSpin 12s linear infinite',
          zIndex: 3
        }}>
          <PieChart size={24} />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '30%',
          left: '20%',
          color: 'rgba(255, 255, 0, 0.2)',
          animation: 'holoFloat 10s ease-in-out infinite reverse',
          zIndex: 3
        }}>
          <BarChart3 size={26} />
        </div>
        
        <div className="container-fluid h-100" style={{ position: 'relative', zIndex: 10 }}>
          <div className="row h-100 align-items-center justify-content-center py-4">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
              
              {/* Main Card */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(20px) saturate(200%)',
                borderRadius: '28px',
                padding: '48px 40px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: `
                  0 20px 40px 0 rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
                  0 0 0 1px rgba(255, 255, 255, 0.05),
                  0 0 60px rgba(0, 255, 255, 0.1)
                `,
                position: 'relative',
                overflow: 'hidden',
                animation: 'loginCardPulse 6s ease-in-out infinite'
              }}>
                
                {/* Card Shine Effect */}
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.05) 50%, transparent 60%)',
                  animation: 'shine 4s ease-in-out infinite',
                  pointerEvents: 'none'
                }}></div>
                
                {/* Content */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  
                  {/* Logo Section */}
                  <div className="text-center mb-5">
                    <h1 style={{
                      fontSize: 'clamp(30px, 6vw, 40px)',
                      fontWeight: '900',
                      background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #ffff00 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '16px',
                      letterSpacing: '-1px',
                      textShadow: '0 0 40px rgba(0, 255, 255, 0.5)',
                      animation: 'textPulse 4s ease-in-out infinite'
                    }}>
                      Money Manager
                    </h1>
                  </div>
                  {/* Welcome Header */}
                  <div className="text-center mb-5">
                    <h3 style={{
                      fontSize: 'clamp(24px, 4vw, 30px)',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '12px',
                      textShadow: '0 0 15px rgba(255, 255, 255, 0.3)'
                    }}>
                      Access Your Portal
                    </h3>
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '16px',
                      marginBottom: '0'
                    }}>
                      Enter your credentials to continue your financial journey
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    
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
                        <User size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        style={{
                          width: '100%',
                          padding: '20px 24px',
                          border: errors.email ? '2px solid #ff4444' : '2px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '18px',
                          fontSize: '16px',
                          color: '#ffffff',
                          outline: 'none',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          background: errors.email ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(15px)'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#00ffff';
                          e.target.style.background = 'rgba(0, 255, 255, 0.08)';
                          e.target.style.boxShadow = '0 0 25px rgba(0, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.email ? '#ff4444' : 'rgba(255, 255, 255, 0.1)';
                          e.target.style.background = errors.email ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)';
                          e.target.style.boxShadow = 'none';
                          e.target.style.transform = 'translateY(0)';
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
                          gap: '6px',
                          animation: 'errorShake 0.5s ease-in-out'
                        }}>
                          <Sparkles size={12} />
                          {errors.email}
                        </div>
                      )}
                    </div>
                    
                    {/* Password Input */}
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
                        <Lock size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          style={{
                            width: '100%',
                            padding: '20px 64px 20px 24px',
                            border: errors.password ? '2px solid #ff4444' : '2px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '18px',
                            fontSize: '16px',
                            color: '#ffffff',
                            outline: 'none',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: errors.password ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(15px)'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#ff00ff';
                            e.target.style.background = 'rgba(255, 0, 255, 0.08)';
                            e.target.style.boxShadow = '0 0 25px rgba(255, 0, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                            e.target.style.transform = 'translateY(-2px)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = errors.password ? '#ff4444' : 'rgba(255, 255, 255, 0.1)';
                            e.target.style.background = errors.password ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)';
                            e.target.style.boxShadow = 'none';
                            e.target.style.transform = 'translateY(0)';
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
                            padding: '10px',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 0, 255, 0.2)';
                            e.target.style.color = '#ff00ff';
                            e.target.style.transform = 'translateY(-50%) scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.target.style.color = '#ffffff';
                            e.target.style.transform = 'translateY(-50%) scale(1)';
                          }}
                        >
                          {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
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
                          gap: '6px',
                          animation: 'errorShake 0.5s ease-in-out'
                        }}>
                          <Sparkles size={12} />
                          {errors.password}
                        </div>
                      )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="d-flex justify-content-between align-items-center mb-5">
                      <div className="d-flex align-items-center gap-3">
                        <input 
                          type="checkbox" 
                          id="remember" 
                          style={{
                            width: '20px',
                            height: '20px',
                            accentColor: '#00ffff'
                          }} 
                        />
                        <label 
                          htmlFor="remember" 
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                            fontWeight: '500',
                            marginBottom: '0',
                            cursor: 'pointer'
                          }}
                        >
                          Remember me
                        </label>
                      </div>
                      <Link 
                        to="/forgot-password" 
                        style={{
                          color: '#ff00ff',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                          textShadow: '0 0 10px rgba(255, 0, 255, 0.5)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#ffff00';
                          e.target.style.textShadow = '0 0 15px rgba(255, 255, 0, 0.7)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#ff00ff';
                          e.target.style.textShadow = '0 0 10px rgba(255, 0, 255, 0.5)';
                        }}
                      >
                        Forgot password?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        padding: '22px 24px',
                        background: isLoading 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : 'linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #ffff00 100%)',
                        border: 'none',
                        borderRadius: '18px',
                        color: isLoading ? 'rgba(255, 255, 255, 0.5)' : '#000000',
                        fontSize: '16px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 10px 40px rgba(0, 255, 255, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.target.style.transform = 'translateY(-5px)';
                          e.target.style.boxShadow = '0 15px 50px rgba(255, 0, 255, 0.4)';
                          e.target.style.background = 'linear-gradient(135deg, #ff00ff 0%, #ffff00 50%, #00ffff 100%)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 10px 40px rgba(0, 255, 255, 0.3)';
                          e.target.style.background = 'linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #ffff00 100%)';
                        }
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight size={24} />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Sign Up Link */}
                  <div className="text-center mt-5 mb-4">
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '16px',
                      marginBottom: '0'
                    }}>
                      Don't have an account? 
                      <Link 
                        to="/signup" 
                        style={{
                          color: '#00ffff',
                          textDecoration: 'none',
                          fontWeight: '700',
                          marginLeft: '8px',
                          textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#ffff00';
                          e.target.style.textShadow = '0 0 15px rgba(255, 255, 0, 0.7)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#00ffff';
                          e.target.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
                        }}
                      >
                        Create Account
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
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-40px) rotate(180deg); opacity: 0.8; }
        }
        
        @keyframes holoFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-25px) rotate(90deg); opacity: 0.6; }
        }
        
        @keyframes holoSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes loginCardPulse {
          0%, 100% { 
            box-shadow: 0 20px 40px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 60px rgba(0, 255, 255, 0.1);
          }
          50% { 
            box-shadow: 0 20px 40px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 80px rgba(255, 0, 255, 0.2);
          }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        @keyframes logoRotate {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.05); }
        }
        
        @keyframes iconGlow {
          0% { filter: drop-shadow(0 0 15px #00ffff); }
          100% { filter: drop-shadow(0 0 35px #00ffff) drop-shadow(0 0 45px #ff00ff); }
        }
        
        @keyframes textPulse {
          0%, 100% { text-shadow: 0 0 30px rgba(0, 255, 255, 0.5); }
          50% { text-shadow: 0 0 40px rgba(0, 255, 255, 0.8), 0 0 50px rgba(255, 0, 255, 0.5); }
        }
        
        @keyframes indicatorPulse {
          0%, 100% { transform: translateY(0px); opacity: 0.8; }
          50% { transform: translateY(-3px); opacity: 1; }
        }
        
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes securityBadge {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }
        
        @media (max-width: 576px) {
          .main-card {
            padding: 32px 24px !important;
          }
          
          .feature-indicators {
            flex-direction: column !important;
            align-items: center !important;
          }
        }
      `}</style>
    </>
  );
}

export default Login;