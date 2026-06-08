import { NavLink } from 'react-router-dom';
import { useAppStore } from '../stores/appStore.js';
import { useAuthStore } from '../stores/authStore.js';

const navLinks = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/stocks', label: 'Stocks', icon: '📈' },
  { to: '/ipos', label: 'IPOs & FPOs', icon: '🚀' },
  { to: '/ipo-monitor', label: 'IPO Monitor', icon: '🔍' },
  { to: '/market-analysis', label: 'Market', icon: '🧠' },
  { to: '/portfolio', label: 'Portfolio', icon: '💼' },
  { to: '/sip', label: 'SIP Calc', icon: '📊' },
  { to: '/sip-advisor', label: 'SIP Guide', icon: '🎯' },
  { to: '/trust', label: 'Trust', icon: '🛡️' },
];

export default function Navbar() {
  const { mode, theme, setMode, setTheme } = useAppStore();
  const { isAuthenticated, user, logout } = useAuthStore();

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <header className="site-navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <a href="/" className="navbar-brand">
          <span className="brand-flag">🇮🇳</span>
          <span className="brand-text">BHARATNIVESH</span>
        </a>

        {/* Nav Links */}
        <nav className="navbar-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Mode Toggle */}
          <div className="mode-pill" title="Switch between Regular (Hindi) and Nerd (Quant) mode">
            <button
              className={`mode-btn${mode === 'regular' ? ' active' : ''}`}
              onClick={() => setMode('regular')}
            >
              Regular
            </button>
            <button
              className={`mode-btn${mode === 'nerd' ? ' active' : ''}`}
              onClick={() => setMode('nerd')}
            >
              Nerd
            </button>
          </div>

          {/* Theme Toggle */}
          <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Auth */}
          {isAuthenticated ? (
            <button
              className="btn btn-secondary btn-sm"
              onClick={logout}
              title={`Logged in as ${user?.name || user?.email}`}
            >
              👤 {user?.name?.split(' ')[0] || 'User'}
            </button>
          ) : (
            <NavLink to="/onboarding/kyc" className="btn btn-primary btn-sm">
              Get Started
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
