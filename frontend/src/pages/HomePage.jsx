import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { marketService } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';

const FEATURES = [
  {
    icon: '🚀',
    title: 'IPO Intelligence',
    desc: 'AI-scored IPO analysis with GMP tracking, red-flag detection, and DCF valuations.',
    link: '/ipos',
  },
  {
    icon: '📈',
    title: 'Stock Screener',
    desc: 'Filter by strategy (Growth/Value/Momentum/Quality) with live P/E, ROE, and momentum scores.',
    link: '/stocks',
  },
  {
    icon: '💼',
    title: 'Portfolio Tracker',
    desc: 'Track your holdings with live prices, P&L, and XIRR annualized return calculations.',
    link: '/portfolio',
  },
  {
    icon: '🧠',
    title: 'AI Market Analysis',
    desc: 'Local DistilBERT sentiment model analyzes news headlines — zero API cost, 100% private.',
    link: '/market-analysis',
  },
  {
    icon: '📊',
    title: 'SIP Calculator',
    desc: 'Plan monthly SIPs with a visual wealth growth chart and top mutual fund recommendations.',
    link: '/sip',
  },
  {
    icon: '🔍',
    title: 'IPO Monitor',
    desc: 'Track subscription status, allotment chances, and GMP data for all open IPOs.',
    link: '/ipo-monitor',
  },
];

function MarketTicker({ label, data }) {
  if (!data) return null;
  const change = data.change_percent;
  const isUp = change >= 0;
  return (
    <div className="market-ticker-card animate-fade-in-up">
      <div className="ticker-label">{label}</div>
      <div className="ticker-value">
        {data.price ? data.price.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '—'}
      </div>
      {change !== undefined && (
        <span className={`ticker-change ${isUp ? 'up' : 'down'}`}>
          {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
        </span>
      )}
    </div>
  );
}

function SkeletonTicker() {
  return (
    <div className="market-ticker-card">
      <div className="skeleton" style={{ height: '12px', width: '60%', marginBottom: '10px' }} />
      <div className="skeleton" style={{ height: '28px', width: '80%', marginBottom: '8px' }} />
      <div className="skeleton" style={{ height: '20px', width: '40%' }} />
    </div>
  );
}

export default function HomePage() {
  const { mode } = useAppStore();
  const [indices, setIndices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    marketService.getIndices()
      .then((data) => {
        setIndices(data);
        setError('');
      })
      .catch(() => {
        setError('Live data unavailable — backend may be offline.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="hero-section animate-fade-in-up">
        <div className="hero-badge">
          🇮🇳 AI-Powered · Free · Open Source
        </div>
        <h1 className="hero-title">
          India's Smartest{' '}
          <span className="gradient-text">Investment Dashboard</span>
        </h1>
        <p className="hero-subtitle">
          {mode === 'regular'
            ? 'IPO अलर्ट, स्टॉक स्क्रीनर, SIP कैलकुलेटर और AI मार्केट विश्लेषण — सब एक जगह, बिल्कुल मुफ़्त।'
            : 'Real-time IPO scoring, quantitative stock screening, XIRR portfolio tracking, and local DistilBERT sentiment analysis — zero cost, zero compromise.'}
        </p>
        <div className="hero-cta-row">
          <Link to="/ipos" className="btn btn-primary btn-lg">
            🚀 Explore IPOs
          </Link>
          <Link to="/stocks" className="btn btn-secondary btn-lg">
            📈 Screen Stocks
          </Link>
          <Link to="/portfolio" className="btn btn-secondary btn-lg">
            💼 My Portfolio
          </Link>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">₹0</div>
            <div className="hero-stat-label">Cost to use (always free)</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">6+</div>
            <div className="hero-stat-label">Powerful analysis tools</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">AI</div>
            <div className="hero-stat-label">Local DistilBERT model</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">XIRR</div>
            <div className="hero-stat-label">Annualized returns</div>
          </div>
        </div>
      </section>

      {/* LIVE MARKET INDICES */}
      <section style={{ marginBottom: '2rem' }}>
        <div className="section-header">
          <div>
            <span className="eyebrow">Live Market</span>
            <h2 className="section-title">India Market Overview</h2>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {loading ? 'Fetching live data...' : error ? '⚠️ Offline' : '🟢 Live'}
          </span>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            {error} Backend might need to be started with <code>npm run dev</code>.
          </div>
        )}

        <div className="market-grid">
          {loading ? (
            <>
              <SkeletonTicker />
              <SkeletonTicker />
              <SkeletonTicker />
              <SkeletonTicker />
            </>
          ) : indices ? (
            <>
              <MarketTicker label="NIFTY 50" data={indices.NIFTY_50} />
              <MarketTicker label="SENSEX" data={indices.SENSEX} />
              <MarketTicker label="BANK NIFTY" data={indices.BANKNIFTY} />
              <MarketTicker label="NIFTY MidCap" data={indices.NIFTY_MIDCAP} />
            </>
          ) : (
            <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
              Could not load indices. Start the backend server to see live data.
            </p>
          )}
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section>
        <div className="section-header">
          <div>
            <span className="eyebrow">Platform Features</span>
            <h2 className="section-title">Everything you need to invest smarter</h2>
          </div>
        </div>

        <div className="grid-auto" style={{ '--col-min': '280px' }}>
          {FEATURES.map((f, i) => (
            <Link
              key={f.link}
              to={f.link}
              className={`card animate-fade-in-up stagger-${Math.min(i + 1, 4)}`}
              style={{ display: 'block', cursor: 'pointer', textDecoration: 'none' }}
            >
              <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* MODE EXPLAINER */}
      <section style={{ marginTop: '2.5rem' }}>
        <div className="card-flat" style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.08) 0%, rgba(167,139,250,0.05) 100%)', border: '1px solid rgba(102,126,234,0.15)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
            <div>
              <span className="eyebrow">Dual Mode Interface</span>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                Regular Mode <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>vs</span> Nerd Mode
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                Switch between <strong style={{ color: 'var(--text-primary)' }}>Regular Mode</strong> (simple Hindi verdicts — Apply / Skip / Consider) and{' '}
                <strong style={{ color: 'var(--text-primary)' }}>Nerd Mode</strong> (quantitative metrics — DCF targets, P/E analysis, XIRR, debt ratios) using the toggle in the navbar.
              </p>
            </div>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>🙋 Regular Mode</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Simple verdicts in plain language. Perfect for new investors.
                </div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(102,126,234,0.25)' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem', color: 'var(--accent-purple)' }}>🔬 Nerd Mode</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Full quant metrics — DCF, XIRR, Sharpe, P/E, ROE, debt analysis.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
