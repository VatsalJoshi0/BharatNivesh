import { useMemo, useState } from 'react';

export default function SipOptimizer() {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(7);
  const [growth, setGrowth] = useState(12);

  const result = useMemo(() => {
    const months = years * 12;
    const monthlyRate = growth / 100 / 12;
    const futureValue =
      monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvested = monthly * months;
    const gains = futureValue - totalInvested;
    const gainsPercent = totalInvested > 0 ? ((gains / totalInvested) * 100).toFixed(1) : 0;
    return { futureValue, totalInvested, gains, gainsPercent, annualContribution: monthly * 12 };
  }, [monthly, years, growth]);

  const investedWidth = Math.min(95, (result.totalInvested / result.futureValue) * 100);

  const sliders = [
    { label: 'Monthly SIP', value: monthly, set: setMonthly, min: 500, max: 100000, step: 500, display: `₹${monthly.toLocaleString('en-IN')}` },
    { label: 'Timeline', value: years, set: setYears, min: 1, max: 30, step: 1, display: `${years} yrs` },
    { label: 'Expected Return', value: growth, set: setGrowth, min: 4, max: 24, step: 1, display: `${growth}% p.a.` },
  ];

  return (
    <div className="card">
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
        🧮 SIP Calculator
      </h2>

      {/* Sliders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {sliders.map((s) => (
          <div key={s.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</label>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{s.display}</span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              onChange={(e) => s.set(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--accent-blue)',
                cursor: 'pointer',
              }}
            />
          </div>
        ))}
      </div>

      {/* Result Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
            Target Wealth
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: 'var(--positive)' }}>
            ₹{Math.round(result.futureValue).toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
            Total Invested
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.2rem' }}>
            ₹{Math.round(result.totalInvested).toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{ padding: '1rem', background: 'rgba(96,165,250,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(96,165,250,0.15)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
            Gains ({result.gainsPercent}%)
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent-blue)' }}>
            ₹{Math.round(result.gains).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
          Invested vs Growth
        </div>
        <div style={{ height: '28px', borderRadius: '999px', overflow: 'hidden', display: 'flex', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ width: `${investedWidth}%`, background: 'linear-gradient(135deg, #2563eb, #3b82f6)', borderRadius: '999px 0 0 999px', transition: 'width 0.5s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: '#fff' }}>
            {investedWidth > 15 ? 'Invested' : ''}
          </div>
          <div style={{ flex: 1, background: 'linear-gradient(135deg, #059669, #34d399)', borderRadius: '0 999px 999px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: '#fff' }}>
            {100 - investedWidth > 10 ? 'Growth' : ''}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>0</span>
          <span>₹{Math.round(result.futureValue).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}
