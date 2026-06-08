import { useEffect, useState } from 'react';
import { ipoService } from '../services/api.js';

function SubBucket({ label, value, color }) {
  return (
    <div style={{ padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: color || 'var(--text-primary)' }}>
        {value}x
      </div>
    </div>
  );
}

function MonitorCard({ ipo }) {
  const totalSub = ipo.subscription_buckets?.total_x || 0;
  const signalColor = totalSub >= 10 ? 'var(--positive)' : totalSub >= 3 ? 'var(--accent-yellow)' : 'var(--text-secondary)';

  return (
    <div className="card animate-fade-in-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>{ipo.day}</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem' }}>{ipo.name}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ipo.price_band} · Closes {ipo.closes_on}</p>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.75rem', borderRadius: '999px', background: `${signalColor}15`, color: signalColor, fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
          {ipo.demand_signal || 'Moderate'}
        </div>
      </div>

      {/* Subscription Buckets */}
      {ipo.subscription_buckets && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <SubBucket label="QIB" value={ipo.subscription_buckets.qib_x || 0} color="#0f766e" />
          <SubBucket label="NII" value={ipo.subscription_buckets.nii_x || 0} color="#2563eb" />
          <SubBucket label="RII" value={ipo.subscription_buckets.rii_x || 0} color="#c026d3" />
          <SubBucket label="Total" value={ipo.subscription_buckets.total_x || 0} color={signalColor} />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.85rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', border: '1px solid var(--border-subtle)' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Listing Risk</span>
        <span className={`badge ${ipo.listing_risk === 'Low' ? 'badge-green' : ipo.listing_risk === 'High' ? 'badge-red' : 'badge-yellow'}`}>
          {ipo.listing_risk || 'Moderate'}
        </span>
      </div>
    </div>
  );
}

function SkeletonMonitor() {
  return (
    <div className="card">
      <div className="skeleton" style={{ height: '12px', width: '30%', marginBottom: '6px' }} />
      <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '8px' }} />
      <div className="skeleton" style={{ height: '14px', width: '45%', marginBottom: '16px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '12px' }}>
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '60px' }} />)}
      </div>
      <div className="skeleton" style={{ height: '36px' }} />
    </div>
  );
}

export default function IpoMonitorPage() {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    ipoService.getUpcoming()
      .then((data) => {
        setIpos(data.items || []);
        setLastUpdate(new Date());
      })
      .catch(() => setError('Could not load IPO monitor. Start the backend server.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="eyebrow">IPO Subscription Monitor</span>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>
            IPO Monitor
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Track QIB, NII, and Retail subscription levels with demand signals and listing risk.
          </p>
        </div>

        {lastUpdate && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--positive)', display: 'inline-block' }} />
            Updated {lastUpdate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {[...Array(4)].map((_, i) => <SkeletonMonitor key={i} />)}
        </div>
      ) : ipos.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, marginBottom: '0.5rem' }}>No active IPOs to monitor</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Check back during active IPO windows for live subscription tracking.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {ipos.map((ipo) => <MonitorCard key={ipo.id} ipo={ipo} />)}
        </div>
      )}
    </div>
  );
}
