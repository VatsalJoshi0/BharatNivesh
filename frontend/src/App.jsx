import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useAppStore } from './stores/appStore';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import OnboardingKYC from './pages/OnboardingKYC.jsx';
import OnboardingQuiz from './pages/OnboardingQuiz.jsx';
import IposPage from './pages/IposPage.jsx';
import PortfolioPage from './pages/PortfolioPage.jsx';
import StocksPage from './pages/StocksPage.jsx';
import IpoMonitorPage from './pages/IpoMonitorPage.jsx';
import MarketAnalysisPage from './pages/MarketAnalysisPage.jsx';
import SipPage from './pages/SipPage.jsx';
import SipAdvisorPage from './pages/SipAdvisorPage.jsx';
import TrustPage from './pages/TrustPage.jsx';

function App() {
  const authStore = useAuthStore();
  const appStore = useAppStore();

  useEffect(() => {
    authStore.restoreAuth();
    appStore.restorePreferences();
  }, []);

  // Apply theme to the HTML root element so CSS variables take effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appStore.theme);
  }, [appStore.theme]);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />

        <main className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/onboarding/kyc" element={<OnboardingKYC />} />
            <Route path="/onboarding/quiz" element={<OnboardingQuiz />} />
            <Route path="/ipos" element={<IposPage />} />
            <Route path="/stocks" element={<StocksPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/ipo-monitor" element={<IpoMonitorPage />} />
            <Route path="/market-analysis" element={<MarketAnalysisPage />} />
            <Route path="/sip" element={<SipPage />} />
            <Route path="/sip-advisor" element={<SipAdvisorPage />} />
            <Route path="/trust" element={<TrustPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
