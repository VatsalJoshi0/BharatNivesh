const TRUST_ITEMS = [
  {
    num: '01',
    icon: '🏷️',
    title: 'Clear Source Labels',
    desc: 'Every data point is labeled with a source (Yahoo Finance, @xenova/transformers, SEBI EDIFAR) so you know exactly where the data comes from.',
  },
  {
    num: '02',
    icon: '⚠️',
    title: 'Risk-First Language',
    desc: 'IPO, market, and SIP views always include risk notes and caveats — never one-sided return promises.',
  },
  {
    num: '03',
    icon: '📚',
    title: 'Educational Positioning',
    desc: 'The platform treats insights as decision support tools, not guaranteed advice. It avoids SEBI-regulated advisory claims.',
  },
  {
    num: '04',
    icon: '🤖',
    title: 'Local AI — Zero Privacy Risk',
    desc: 'Sentiment analysis runs locally via @xenova/transformers DistilBERT. Your data never leaves your machine.',
  },
  {
    num: '05',
    icon: '💰',
    title: 'Zero Cost, Zero Ads',
    desc: 'Fully free to use. No paywalls, no API subscriptions, no ads. Built on free public APIs only.',
  },
  {
    num: '06',
    icon: '🔓',
    title: 'Open Architecture',
    desc: 'The backend is swappable. Replace the Yahoo Finance scraper with any SEBI-verified data provider without changing the UI.',
  },
];

export default function TrustPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <span className="eyebrow">Transparency &amp; Trust</span>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Built for Careful Financial Decisions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '48rem' }}>
          BHARATNIVESH is designed around transparency — data sources are always labeled, risk notes are always present, and AI models always disclose their methodology.
        </p>
      </div>

      {/* Trust Grid */}
      <div className="grid-auto" style={{ '--col-min': '260px', marginBottom: '2rem' }}>
        {TRUST_ITEMS.map((item) => (
          <div key={item.num} className="card animate-fade-in-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '1.75rem' }}>{item.icon}</span>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                {item.num}
              </span>
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {item.title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Tech Stack Disclosure */}
      <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(96,165,250,0.06), rgba(167,139,250,0.04))', border: '1px solid rgba(96,165,250,0.12)' }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' }}>
          🔬 Technology Stack (Full Disclosure)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {[
            { label: 'Frontend', value: 'React 18, Vite, Zustand, React Query' },
            { label: 'Backend', value: 'Node.js, Express, Socket.io, Bull' },
            { label: 'AI Model', value: 'DistilBERT SST-2 (Xenova, local)' },
            { label: 'Market Data', value: 'Yahoo Finance (yahoo-finance2)' },
            { label: 'IPO Data', value: 'SEBI EDIFAR + GMP scraper' },
            { label: 'Database', value: 'PostgreSQL (mock fallback)' },
          ].map((tech) => (
            <div key={tech.label} style={{ padding: '0.85rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>{tech.label}</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{tech.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="alert alert-info">
        <strong>⚖️ Legal Disclaimer:</strong> BHARATNIVESH is NOT SEBI-registered. It does not provide personalized investment advice. All data is sourced from free public APIs for educational purposes. Financial decisions should be made after consulting a registered financial advisor and studying fund documents. Past performance does not guarantee future returns.
      </div>
    </div>
  );
}
