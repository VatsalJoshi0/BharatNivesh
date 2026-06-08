import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

function AppLayout({ theme, onThemeChange }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
      <ThemeToggle theme={theme} onToggle={onThemeChange} />
    </div>
  );
}

export default AppLayout;
