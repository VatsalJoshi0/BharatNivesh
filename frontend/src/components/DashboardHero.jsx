import { useMemo } from 'react';

function DashboardHero({ overview, lastSync, error }) {
  const cards = useMemo(() => {
    if (!overview) return [];
    return overview.indices.map((item) => ({
      title: item.label,
      value: item.value,
      change: item.day_change_percent,
      isRisk: item.key === 'india_vix'
    }));
  }, [overview]);

  return (
    <section className="dashboard-hero">
      <header className="section-header">
        <div>
          <h2>India market overview</h2>
          <p>Deterministic mock market insights updated every refresh.</p>
        </div>
        {lastSync && <span className="last-sync">Last sync: {lastSync}</span>}
      </header>
      <div className="hero-grid">
        {error ? (
          <p className="error-text">{error}</p>
        ) : overview ? (
          cards.map((card) => (
            <article key={card.title} className={`market-card ${card.isRisk ? 'risk-card' : ''}`}>
              <strong>{card.title}</strong>
              <div className="market-value">₹{card.value.toLocaleString('en-IN')}</div>
              <div className={`market-change ${card.change >= 0 ? 'positive' : 'negative'}`}>
                {card.change >= 0 ? '+' : ''}
                {card.change}%
              </div>
            </article>
          ))
        ) : (
          <p className="loading-text">Loading market overview...</p>
        )}
      </div>
    </section>
  );
}

export default DashboardHero;
