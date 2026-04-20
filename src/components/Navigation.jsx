import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Timer, Beaker, User, LogOut, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Navigation.css';

const Navigation = () => {
  const { logout, theme, toggleTheme, credits, user } = useAppContext();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/session', icon: Users, label: 'Sessions' },
    { path: '/focus', icon: Timer, label: 'Focus Rooms' },
    { path: '/labs', icon: Beaker, label: 'Peer Labs' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="sidebar card glass">
      <div className="sidebar-header">
        <div className="logo-container">
          <span className="logo-sparkle">✨</span>
          <h1 className="logo-text text-gradient">Pyxora</h1>
        </div>
        <div className="user-info">
          <div className="credits-badge">
            <span className="credits-icon">💎</span>
            <span className="credits-amount">{credits}</span>
          </div>
          <span className="username" title={user?.username || 'user'}>
            {user?.username ? `@${user.username}` : '@user'}
          </span>
        </div>
      </div>

      <div className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <item.icon className="nav-icon" size={20} />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <button onClick={toggleTheme} className="footer-btn btn-secondary">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button onClick={logout} className="footer-btn btn-outline" style={{ border: 'none', color: 'var(--text-muted)' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
