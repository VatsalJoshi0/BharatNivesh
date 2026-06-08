import { useEffect, useMemo, useState } from 'react';
import { mutualFundService } from '../services/api.js';

const CHECK_ICONS = ['🛡️', '📋', '💰', '⏱️', '📊', '🔍', '🏦', '📈'];

export default function SipAdvisorPage() {
  const [data, setData] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState('balanced');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mutualFundService.getSuggestions()
      .then(setData)
      .catch(() => setError('Could not load SIP suggestions. Start the backend server.'))
      .finally(() => setLoading(false));
  }, []);

  const profile = useMemo(() => {
    if (!data) return null;
    return data.profiles?.find((item) => item.key === selectedProfile) || data.profiles?.[0];
  }, [data, selectedProfile]);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span className="eyebrow">SIP Guidance</span>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          SIP Advisor
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Goal-aware SIP profiles based on risk tolerance, time horizon, and allocation style.
        </p>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '4rem 0' }}>
          <div className="loading-spinner" />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading SIP profiles...</p>
        </div>
      )}

      {data && profile && (
        <>
          {/* Profile Selector */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {data.profiles?.map((item) => (
              <button
                key={item.key}
                onClick={() => setSelectedProfile(item.key)}
                className="btn"
                style={{
                  background: item.key === selectedProfile ? 'var(--grad-primary)' : 'var(--bg-card)',
                  color: item.key === selectedProfile ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${item.key === selectedProfile ? 'transparent' : 'var(--border-subtle)'}`,
                  boxShadow: item.key === selectedProfile ? '0 4px 14px rgba(102,126,234,0.3)' : 'none',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Profile Card */}
          <div className="card animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
              <div>
                <span className="eyebrow">{profile.label} Profile</span>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.03em', margin: '0.5rem 0 0.75rem', background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {profile.monthly_sip_range}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {profile.suggestion}
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                {[
                  { label: 'Allocation Style', value: profile.allocation },
                  { label: 'Investment Horizon', value: profile.horizon },
                  { label: 'Risk Level', value: profile.risk },
                ].map((fact) => (
                  <div key={fact.label} style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                      {fact.label}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.95rem' }}>
                      {fact.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pre-Investment Checklist */}
          <div className="card">
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' }}>
              ✅ Before You Invest — Checklist
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {data.checks?.map((check, i) => (
                <div key={check} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', padding: '0.85rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '0.1rem' }}>{CHECK_ICONS[i % CHECK_ICONS.length]}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{check}</span>
                </div>
              ))}
            </div>
            <div className="alert alert-info" style={{ fontSize: '0.82rem' }}>
              ⚠️ These are <strong>educational suggestions</strong> based on broad risk profiles. Always verify fund documents, expense ratios, taxation, and personal suitability before investing. Not SEBI-registered advice.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
