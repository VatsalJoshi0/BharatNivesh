import { useEffect, useState } from 'react';
import SipOptimizer from '../components/SipOptimizer.jsx';
import { mutualFundService } from '../services/api.js';

const RISK_COLORS = {
  Low: 'var(--positive)',
  Moderate: 'var(--accent-yellow)',
  High: 'var(--negative)',
};

function FundCard({ fund }) {
  const riskColor = RISK_COLORS[fund.risk_level] || 'var(--text-secondary)';
  return (
    <div className="card" style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3, marginBottom: '0.3rem' }}>
            {fund.name}
          </h3>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span className="badge badge-blue">{fund.category}</span>
            <span className="badge" style={{ background: `${riskColor}15`, color: riskColor }}>{fund.risk_level} Risk</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.15rem' }}>3Y Returns</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: 'var(--positive)' }}>
            {fund.returns_3y}%
          </div>
        </div>
      </div>
      <hr className="divider" />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        <span>NAV <strong style={{ color: 'var(--text-primary)' }}>₹{fund.nav}</strong></span>
        <span>Expense <strong style={{ color: 'var(--text-primary)' }}>{fund.expense_ratio}%</strong></span>
      </div>
    </div>
  );
}

function SkeletonFund() {
  return (
    <div className="card">
      <div className="skeleton" style={{ height: '16px', width: '70%', marginBottom: '8px' }} />
      <div className="skeleton" style={{ height: '12px', width: '40%', marginBottom: '16px' }} />
      <div className="skeleton" style={{ height: '1px', marginBottom: '12px' }} />
      <div className="skeleton" style={{ height: '12px', width: '60%' }} />
    </div>
  );
}

export default function SipPage() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mutualFundService.getFunds()
      .then((data) => setFunds(Array.isArray(data) ? data : []))
      .catch(() => setFunds([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span className="eyebrow">Monthly SIP Planning</span>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          Build Wealth with SIPs
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Calculate your SIP returns and explore top-rated mutual funds for disciplined wealth creation.
        </p>
      </div>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* Calculator */}
        <div>
          <SipOptimizer />

          {/* Info Card */}
          <div className="card" style={{ marginTop: '1rem', background: 'linear-gradient(135deg, rgba(17,153,142,0.08), rgba(56,239,125,0.04))', border: '1px solid rgba(52,211,153,0.15)' }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--positive)' }}>
              💡 Why SIP?
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              <li>Rupee-cost averaging reduces market timing risk</li>
              <li>Power of compounding grows wealth exponentially</li>
              <li>Auto-debit removes emotional investing bias</li>
              <li>Start with as low as ₹500/month</li>
            </ul>
          </div>
        </div>

        {/* Mutual Funds */}
        <div>
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <h2 className="section-title">🏆 Top Mutual Funds</h2>
            <span className="badge badge-green">Curated</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading ? (
              [...Array(5)].map((_, i) => <SkeletonFund key={i} />)
            ) : funds.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Could not load funds. Start the backend server.
              </div>
            ) : (
              funds.map((fund) => <FundCard key={fund.id} fund={fund} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
