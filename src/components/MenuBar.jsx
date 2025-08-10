import React, { useState, useRef, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, User, X, TrendingUp } from 'lucide-react';
import Sidebar from './Sidebar';

function MenuBar() {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropDownRef = useRef(null);
    const { user, clearUser } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // await AxiosConfig.post(API_ENDPOINTS.LOGOUT);
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            localStorage.setItem("justLoggedOut", "true");
            localStorage.clear();
            localStorage.setItem("justLoggedOut", "true");
            setShowDropdown(false);
            clearUser();
            navigate("/login");
        }
    };

 useEffect(() => {
    
    const handleClickOutside = (event) => {
        // only close if the click is truly outside the dropdown
        if (
          dropDownRef.current &&
          !dropDownRef.current.contains(event.target)
        ) {
          setShowDropdown(false);
        }
    };

     if (showDropdown) {
         document.addEventListener("mousedown", handleClickOutside);
     }

     return () => {
         document.removeEventListener("mousedown", handleClickOutside);
     };
 }, [showDropdown]);


    const menuBarStyle = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2), 0 2px 16px rgba(0, 0, 0, 0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '80px'
    };

    const logoContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    };

    const logoStyle = {
        width: '50px',
        height: '50px',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        cursor: 'pointer',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 24px rgba(255, 255, 255, 0.1)'
    };

    const logoTextStyle = {
        color: '#ffffff',
        fontSize: '1.75rem',
        fontWeight: '800',
        letterSpacing: '-0.025em',
        textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text'
    };

    const rightSectionStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
    };

    const userButtonStyle = {
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        padding: '0.75rem',
        color: '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        position: 'relative',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
    };

    const dropdownStyle = {
        position: 'absolute',
        top: '120%',
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(40px)',
        borderRadius: '24px',
        padding: '2rem',
        minWidth: '320px',
        boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2), 0 16px 32px rgba(102, 126, 234, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        animation: 'dropdownSlide 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        zIndex: 1001
    };

    const userInfoStyle = {
        marginBottom: '2rem',
        textAlign: 'center'
    };

    const logoutButtonStyle = {
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
        border: 'none',
        borderRadius: '16px',
        padding: '1rem 2rem',
        color: '#ffffff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        width: '100%',
        justifyContent: 'center',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        fontWeight: '700',
        fontSize: '1rem',
        boxShadow: '0 8px 24px rgba(255, 107, 107, 0.3)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    };

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        zIndex: 998,
        backdropFilter: 'blur(8px)'
    };

    const mobileMenuButtonStyle = {
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '0.75rem',
        color: '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
    };

    return (
        <>
            <style>
                {`
                    @keyframes dropdownSlide {
                        from {
                            opacity: 0;
                            transform: translateY(-20px) scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                    
                    @keyframes logoFloat {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-3px); }
                    }
                    
                    @keyframes glowPulse {
                        0%, 100% { 
                            box-shadow: 0 8px 24px rgba(255, 255, 255, 0.1);
                        }
                        50% { 
                            box-shadow: 0 8px 32px rgba(255, 255, 255, 0.3), 0 0 40px rgba(102, 126, 234, 0.3);
                        }
                    }
                    
                    .user-button:hover {
                        background: rgba(255, 255, 255, 0.25) !important;
                        border-color: rgba(255, 255, 255, 0.4) !important;
                        transform: translateY(-3px) scale(1.05) !important;
                        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3) !important;
                    }
                    
                    .logo:hover {
                        transform: translateY(-3px) scale(1.1) rotate(5deg) !important;
                        animation: glowPulse 2s infinite !important;
                        border-color: rgba(255, 255, 255, 0.6) !important;
                    }
                    
                    .mobile-menu-btn:hover {
                        background: rgba(255, 255, 255, 0.25) !important;
                        border-color: rgba(255, 255, 255, 0.4) !important;
                        transform: translateY(-2px) scale(1.05) !important;
                    }
                    
                    .logout-btn:hover {
                        transform: translateY(-3px) scale(1.02) !important;
                        box-shadow: 0 16px 40px rgba(255, 107, 107, 0.4) !important;
                        background: linear-gradient(135deg, #ff5252 0%, #f44336 100%) !important;
                    }
                    
                    .logo {
                        animation: logoFloat 3s ease-in-out infinite;
                    }
                    
                    @media (max-width: 768px) {
                        .mobile-menu-btn {
                            display: block !important;
                        }
                    }
                    
                    @media (min-width: 769px) {
                        .mobile-menu-btn {
                            display: none !important;
                        }
                    }
                `}
            </style>

            <nav style={menuBarStyle}>
                <div style={logoContainerStyle}>
                    <div 
                        style={logoStyle}
                        className="logo"
                        onClick={() => navigate('/dashboard')}
                    >
                        <TrendingUp size={28} color="#ffffff" />
                    </div>
                    <span style={logoTextStyle}>Money Manager</span>
                </div>

                <div style={rightSectionStyle}>
                    <button 
                        className="mobile-menu-btn"
                        style={mobileMenuButtonStyle}
                        onClick={() => setOpenSideMenu(!openSideMenu)}
                    >
                        {openSideMenu ? <X size={22} /> : <Menu size={22} />}
                    </button>

                    <div ref={dropDownRef} style={{ position: 'relative' }}>
                        <button 
                            style={userButtonStyle}
                            className="user-button"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <User size={22} />
                        </button>
                        
                        {showDropdown && (
                            <div style={dropdownStyle}>
                                <div style={userInfoStyle}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1.5rem auto',
                                        boxShadow: '0 12px 32px rgba(102, 126, 234, 0.3)',
                                        border: '4px solid rgba(255, 255, 255, 0.2)'
                                    }}>
                                        <User size={32} color="#ffffff" />
                                    </div>
                                    <p style={{ 
                                        margin: '0 0 0.5rem 0', 
                                        fontSize: '1.25rem', 
                                        fontWeight: '700',
                                        color: '#1f2937',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        WebkitBackgroundClip: 'text',
                                        backgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        {user?.fullName || 'John Doe'}
                                    </p>
                                    <p style={{ 
                                        margin: 0, 
                                        fontSize: '0.95rem',
                                        color: '#6b7280',
                                        fontWeight: '500'
                                    }}>
                                        {user?.email || 'john@example.com'}
                                    </p>
                                </div>
                                <button 
                                    style={logoutButtonStyle}
                                    className="logout-btn"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {openSideMenu && (
                <>
                    <div style={overlayStyle} onClick={() => setOpenSideMenu(false)}></div>
                    <div style={{
                        position: 'fixed',
                        top: '80px',
                        left: 0,
                        height: 'calc(100vh - 80px)',
                        width: '300px',
                        zIndex: 999,
                        transform: openSideMenu ? 'translateX(0)' : 'translateX(-100%)',
                        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(40px)',
                        boxShadow: '8px 0 32px rgba(0, 0, 0, 0.1)'
                    }}>
                        <Sidebar />
                    </div>
                </>
            )}
        </>
    )
}

export default MenuBar