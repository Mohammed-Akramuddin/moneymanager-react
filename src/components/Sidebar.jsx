import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { User, Home, TrendingUp, PieChart, Settings, CreditCard, Wallet, Star, BarChart3, DollarSign, Target } from 'lucide-react'
import { SIDE_BAR_DATA } from '../assets/assets'
import { useNavigate, useLocation } from 'react-router-dom'

function Sidebar() {
    const { user } = useContext(AppContext)
    const navigate = useNavigate();
    const location = useLocation();

    const sidebarStyle = {
        height: '100%',
        background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
    };

    const sidebarBackgroundStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
            radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
            linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)
        `,
        zIndex: 0
    };

    const userSectionStyle = {
        textAlign: 'center',
        marginBottom: '2.5rem',
        padding: '2rem 1.5rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '24px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3), 0 8px 16px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    };

    const userSectionOverlay = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
            radial-gradient(circle at 30% 40%, rgba(255,255,255,0.2) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)
        `,
        borderRadius: '24px'
    };

    const defaultProfileStyle = {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.2)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem auto',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        border: '4px solid rgba(255,255,255,0.3)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)'
    };

    const userNameStyle = {
        color: '#ffffff',
        fontSize: '1.25rem',
        fontWeight: '700',
        margin: '0 0 0.5rem 0',
        position: 'relative',
        zIndex: 1,
        textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
    };

    const premiumBadgeStyle = {
        background: 'rgba(255,255,255,0.25)',
        backdropFilter: 'blur(20px)',
        color: '#ffffff',
        padding: '0.5rem 1rem',
        borderRadius: '16px',
        fontSize: '0.8rem',
        fontWeight: '700',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        border: '2px solid rgba(255,255,255,0.2)',
        position: 'relative',
        zIndex: 1,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
    };

    const getMenuItemStyle = (isActive) => ({
        background: isActive 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
            : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(20px)',
        border: isActive 
            ? '2px solid rgba(255, 255, 255, 0.3)' 
            : '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '18px',
        padding: '1rem 1.25rem',
        color: isActive ? '#ffffff' : '#64748b',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '0.75rem',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        fontSize: '1rem',
        fontWeight: isActive ? '700' : '600',
        textAlign: 'left',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        boxShadow: isActive 
            ? '0 12px 32px rgba(102, 126, 234, 0.4), 0 4px 16px rgba(0, 0, 0, 0.1)' 
            : '0 4px 16px rgba(0, 0, 0, 0.05)',
        textShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none'
    });

    const menuIconStyle = {
        transition: 'all 0.3s ease',
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
    };

    // Default menu items with more comprehensive options
    const defaultMenuItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: Wallet, label: 'Wallets', path: '/wallets' },
        { icon: CreditCard, label: 'Transactions', path: '/transactions' },
        { icon: DollarSign, label: 'Income', path: '/income' },
        { icon: Target, label: 'Expenses', path: '/expenses' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: PieChart, label: 'Reports', path: '/reports' },
        { icon: Settings, label: 'Settings', path: '/settings' }
    ];

    const menuItems = SIDE_BAR_DATA || defaultMenuItems;

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/' || location.pathname === '/dashboard';
        }
        return location.pathname === path;
    };

    return (
        <>
            <style>
                {`
                    @keyframes profileFloat {
                        0%, 100% { transform: translateY(0px) scale(1); }
                        50% { transform: translateY(-5px) scale(1.05); }
                    }
                    
                    @keyframes menuSlide {
                        0% { transform: translateX(-10px); opacity: 0; }
                        100% { transform: translateX(0); opacity: 1; }
                    }
                    
                    @keyframes glowEffect {
                        0%, 100% { 
                            box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4), 0 4px 16px rgba(0, 0, 0, 0.1);
                        }
                        50% { 
                            box-shadow: 0 16px 40px rgba(102, 126, 234, 0.6), 0 8px 24px rgba(0, 0, 0, 0.15);
                        }
                    }
                    
                    .sidebar-menu-item:not(.active):hover {
                        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%) !important;
                        border-color: rgba(102, 126, 234, 0.3) !important;
                        color: #667eea !important;
                        transform: translateX(8px) scale(1.02) !important;
                        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2) !important;
                    }
                    
                    .sidebar-menu-item:not(.active):hover svg {
                        color: #667eea !important;
                        transform: scale(1.1) !important;
                    }
                    
                    .sidebar-menu-item.active {
                        animation: glowEffect 3s ease-in-out infinite;
                    }
                    
                    .sidebar-menu-item.active svg {
                        filter: drop-shadow(0 2px 8px rgba(255, 255, 255, 0.3)) !important;
                    }
                    
                    .profile-container:hover .profile-image {
                        animation: profileFloat 1s ease;
                        border-color: rgba(255,255,255,0.6) !important;
                    }
                    
                    .sidebar-container {
                        animation: menuSlide 0.6s ease;
                    }
                    
                    .footer-card:hover {
                        transform: translateY(-3px) scale(1.02) !important;
                        box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2) !important;
                    }
                `}
            </style>

            <div style={sidebarStyle} className="sidebar-container">
                <div style={sidebarBackgroundStyle}></div>
                
                <div style={userSectionStyle} className="profile-container">
                    <div style={userSectionOverlay}></div>
                    {user?.profileImageUrl ? (
                        <img 
                            src={user.profileImageUrl} 
                            alt="Profile" 
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '4px solid rgba(255,255,255,0.3)',
                                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                margin: '0 auto 1rem auto',
                                display: 'block',
                                backdropFilter: 'blur(20px)'
                            }}
                            className="profile-image"
                        />
                    ) : (
                        <div style={defaultProfileStyle} className="profile-image">
                            <User size={36} color="#ffffff" />
                        </div>
                    )}
                    <h5 style={userNameStyle}>
                        {user?.fullName || 'John Doe'}
                    </h5>
                </div>

                <div style={{ flex: 1, zIndex: 1, position: 'relative' }}>
                    {menuItems.map((item, index) => {
                        const IconComponent = item.icon;
                        const active = isActive(item.path);
                        return (
                            <button
                                key={`menu_${index}`}
                                style={getMenuItemStyle(active)}
                                className={`sidebar-menu-item ${active ? 'active' : ''}`}
                                onClick={() => navigate(item.path)}
                            >
                                <IconComponent size={22} style={menuIconStyle} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>

               
            </div>
        </>
    )
}

export default Sidebar