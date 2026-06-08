import { useEffect, useState } from 'react';
import { useAppStore } from '../stores/appStore.js';
import { ipoService, secondaryService } from '../services/api.js';
import { useSocket } from '../hooks/useSocket.js';

const VERDICT_STYLES = {
  Apply: { bg: 'var(--positive-bg)', color: 'var(--positive)', icon: '✅' },
  'Strong Buy': { bg: 'var(--positive-bg)', color: 'var(--positive)', icon: '🚀' },
  Consider: { bg: 'rgba(251,191,36,0.1)', color: 'var(--accent-yellow)', icon: '🤔' },
  Hold: { bg: 'var(--neutral-bg)', color: 'var(--neutral)', icon: '⏸️' },
  Skip: { bg: 'var(--negative-bg)', color: 'var(--negative)', icon: '⛔' },
  Avoid: { bg: 'var(--negative-bg)', color: 'var(--negative)', icon: '🚫' },
};

const FLAG_ICONS = { high: '🚩', medium: '⚠️', low: '⚡' };

function VerdictBadge({ verdict, confidence }) {
  const style = VERDICT_STYLES[verdict] || VERDICT_STYLES['Hold'];
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.75rem', borderRadius: '999px', background: style.bg, color: style.color, fontSize: '0.8rem', fontWeight: 700 }}>
      {style.icon} {verdict} · {confidence?.toFixed(0) || 50}%
    </div>
  );
}

function SubscriptionBar({ label, value, color }) {
  const width = Math.min(100, (value || 0));
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
        <span>{label}</span>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{value?.toFixed(2) || 0}x</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${Math.min(100, width * 3)}%`, background: color }} />
      </div>
    </div>
  );
}

function RegularCard({ ipo }) {
  const verdict = ipo.verdict || {};
  return (
    <div className="card" style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem' }}>
            {ipo.company_name || ipo.symbol}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            ₹{ipo.priceMin || 0} – ₹{ipo.priceMax || 0} per share
          </p>
        </div>
        <VerdictBadge verdict={verdict.verdict || 'Hold'} confidence={verdict.confidence || 50} />
      </div>

      <div style={{ padding: '0.85rem', background: 'rgba(96,165,250,0.06)', borderRadius: 'var(--radius-sm)', marginBottom: '0.85rem', fontSize: '0.875rem', color: 'var(--text-secondary)', border: '1px solid rgba(96,165,250,0.1)' }}>
        <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>AI Verdict</strong>
        {verdict.reason || 'Analyzing...'}
      </div>

      {ipo.redFlags && ipo.redFlags.length > 0 && (
        <div style={{ marginBottom: '0.85rem' }}>
          {ipo.redFlags.slice(0, 2).map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
              <span>{FLAG_ICONS[f.severity] || '⚡'}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{f.title}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
        {verdict.action === 'apply' && (
          <>
            <button className="btn btn-success" style={{ flex: 1 }}>✓ Apply</button>
            <button className="btn btn-secondary" style={{ flex: 1 }}>🔔 Alert</button>
          </>
        )}
        {verdict.action === 'alert' && (
          <button className="btn btn-secondary" style={{ flex: 1 }}>🔔 Set Alert</button>
        )}
        {verdict.action === 'skip' && (
          <>
            <button className="btn" style={{ flex: 1, background: 'var(--negative-bg)', color: 'var(--negative)', border: '1px solid rgba(248,113,113,0.2)' }}>Skip</button>
            <button className="btn btn-secondary" style={{ flex: 1 }}>Learn More</button>
          </>
        )}
        {!verdict.action && (
          <button className="btn btn-primary" style={{ flex: 1 }}>View Details</button>
        )}
      </div>
    </div>
  );
}

function NerdCard({ ipo }) {
  const verdict = ipo.verdict || {};
  const metrics = verdict.metrics || {};
  return (
    <div className="card" style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: '0.15rem' }}>
            {ipo.company_name || ipo.symbol}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Band: ₹{ipo.priceMin || 0} – ₹{ipo.priceMax || 0}
          </p>
        </div>
        <VerdictBadge verdict={verdict.verdict || 'Hold'} confidence={verdict.confidence || 50} />
      </div>

      {/* Quant Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '0.85rem' }}>
        {[
          { label: 'P/E Ratio', value: metrics.peRatio || '—' },
          { label: 'ROE Quality', value: metrics.roeQuality || '—' },
          { label: 'Debt Health', value: metrics.debtHealth || '—' },
          { label: 'Valuation', value: metrics.valuation ? `${metrics.valuation.toFixed(1)}%` : '—' },
        ].map((m) => (
          <div key={m.label} style={{ padding: '0.6rem 0.85rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>{m.label}</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.95rem' }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* DCF */}
      <div style={{ padding: '0.75rem', background: 'var(--positive-bg)', borderRadius: 'var(--radius-sm)', marginBottom: '0.85rem', border: '1px solid rgba(52,211,153,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>DCF Target</span>
          <strong style={{ fontFamily: "'Space Grotesk', sans-serif" }}>₹{verdict.dcfTarget || '—'}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.3rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Est. Upside</span>
          <strong style={{ color: (verdict.upside || 0) > 0 ? 'var(--positive)' : 'var(--negative)' }}>
            {(verdict.upside || 0) > 0 ? '+' : ''}{verdict.upside || 0}%
          </strong>
        </div>
      </div>

      {/* Subscription */}
      {ipo.subscriptions && (
        <div style={{ marginBottom: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SubscriptionBar label="QIB" value={ipo.subscriptions.qib} color="#0f766e" />
          <SubscriptionBar label="NII" value={ipo.subscriptions.nii} color="#2563eb" />
          <SubscriptionBar label="RII" value={ipo.subscriptions.rii} color="#c026d3" />
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn btn-primary" style={{ flex: 1 }}>Full Analysis</button>
        <button className="btn btn-success" style={{ flex: 1 }}>Apply</button>
      </div>
    </div>
  );
}

function OfferingCard({ offering }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{offering.company_name}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>₹{offering.price_band_low} – ₹{offering.price_band_high}</p>
        </div>
        <span className="badge badge-purple">{offering.type}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.85rem' }}>
        <div style={{ padding: '0.6rem 0.85rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.15rem' }}>Open</div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{new Date(offering.open_date).toLocaleDateString('en-IN')}</div>
        </div>
        <div style={{ padding: '0.6rem 0.85rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.15rem' }}>Close</div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{new Date(offering.close_date).toLocaleDateString('en-IN')}</div>
        </div>
      </div>
      {offering.subscription_count > 0 && (
        <div style={{ padding: '0.6rem 0.85rem', background: 'var(--positive-bg)', borderRadius: 'var(--radius-sm)', marginBottom: '0.85rem', fontSize: '0.85rem', color: 'var(--positive)', fontWeight: 600 }}>
          📊 {offering.subscription_count}x Subscribed
        </div>
      )}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn btn-success" style={{ flex: 1 }}>Apply</button>
        <button className="btn btn-secondary" style={{ flex: 1 }}>🔔 Alert</button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card">
      <div className="skeleton" style={{ height: '18px', width: '65%', marginBottom: '8px' }} />
      <div className="skeleton" style={{ height: '13px', width: '40%', marginBottom: '16px' }} />
      <div className="skeleton" style={{ height: '70px', marginBottom: '12px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '12px' }}>
        <div className="skeleton" style={{ height: '40px' }} />
        <div className="skeleton" style={{ height: '40px' }} />
      </div>
      <div className="skeleton" style={{ height: '38px' }} />
    </div>
  );
}

export default function IposPage() {
  const { mode } = useAppStore();
  const [activeTab, setActiveTab] = useState('ipos');
  const [ipos, setIpos] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useSocket();

  useEffect(() => {
    setLoading(true);
    setError('');
    const loader = activeTab === 'ipos'
      ? ipoService.getUpcoming().then((d) => setIpos(d.items || []))
      : secondaryService.getOfferings().then((d) => setOfferings(d || []));

    loader
      .catch(() => setError('Could not load data. Start the backend server.'))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const items = activeTab === 'ipos' ? ipos : offerings;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="eyebrow">Public Offerings</span>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>
            IPOs &amp; Offerings
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            {mode === 'regular' ? '📊 Simple verdicts — Apply / Consider / Skip' : '🔬 Full quant analysis — DCF, P/E, ROE, Debt Health'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="tab-bar" style={{ width: 'fit-content' }}>
          <button className={`tab-btn${activeTab === 'ipos' ? ' active' : ''}`} onClick={() => setActiveTab('ipos')}>
            🚀 IPOs
          </button>
          <button className={`tab-btn${activeTab === 'secondary' ? ' active' : ''}`} onClick={() => setActiveTab('secondary')}>
            📈 FPOs / OFS
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, marginBottom: '0.5rem' }}>
            {activeTab === 'ipos' ? 'No upcoming IPOs right now' : 'No active FPOs or OFS'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Check back soon for new opportunities!</p>
        </div>
      ) : activeTab === 'ipos' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {ipos.map((ipo) => (
            <div key={ipo.id} className="animate-fade-in-up">
              {mode === 'regular' ? <RegularCard ipo={ipo} /> : <NerdCard ipo={ipo} />}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {offerings.map((o) => <OfferingCard key={o.id} offering={o} />)}
        </div>
      )}
    </div>
  );
}
