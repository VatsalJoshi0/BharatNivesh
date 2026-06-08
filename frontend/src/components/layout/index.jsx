import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore.js';

export function Header() {
  const { mode, setMode } = useAppStore();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-blue-600">BHARATNIVESH</h1>
          <nav className="flex items-center gap-3">
            <Link to="/" className="text-sm text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/ipos" className="text-sm text-gray-700 hover:text-blue-600">IPOs</Link>
            <Link to="/stocks" className="text-sm text-gray-700 hover:text-blue-600">Stocks</Link>
            <Link to="/onboarding/kyc" className="text-sm text-gray-700 hover:text-blue-600">Onboarding</Link>
            <Link to="/portfolio" className="text-sm text-gray-700 hover:text-blue-600">Portfolio</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setMode(mode === 'regular' ? 'nerd' : 'regular')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            {mode === 'regular' ? 'Switch to Nerd Mode' : 'Switch to Regular Mode'}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
        <p>© 2026 BHARATNIVESH - Indian Investment Platform | SEBI Disclaimer | Privacy Policy</p>
      </div>
    </footer>
  );
}
