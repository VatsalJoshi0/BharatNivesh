import { useEffect, useState } from 'react';
import { useAppStore } from '../stores/appStore.js';
import { stockService } from '../services/api.js';

const STRATEGIES = [
  { value: 'growth', label: '🚀 Growth', desc: 'High revenue/earnings growth' },
  { value: 'value', label: '💎 Value', desc: 'Low P/E, undervalued fundamentals' },
  { value: 'momentum', label: '⚡ Momentum', desc: 'Recent price strength' },
  { value: 'quality', label: '🏆 Quality', desc: 'High ROE, low debt, stable earnings' },
];

const SECTORS = ['', 'IT', 'Finance', 'Energy', 'FMCG', 'Pharma', 'Auto', 'Realty', 'Metal'];

function MetricBadge({ label, value, highlight }) {
  return (
    <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: highlight || 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
    </div>
  );
}

function StockCard({ stock, mode }) {
  const changeColor = (stock.momentum >= 0) ? 'var(--positive)' : 'var(--negative)';

  return (
    <div className="card" style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem' }}>
            {stock.symbol}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {stock.name}
          </p>
          <span className="badge badge-blue" style={{ marginTop: '0.35rem' }}>{stock.sector}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem' }}>
            ₹{stock.price?.toLocaleString('en-IN') || '—'}
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: changeColor }}>
            {stock.momentum >= 0 ? '▲' : '▼'} {Math.abs(stock.momentum || 0)}%
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
        <MetricBadge label="P/E" value={stock.pe || '—'} />
        <MetricBadge label="ROE" value={stock.roe ? `${stock.roe}%` : '—'} highlight="var(--positive)" />
        {mode === 'nerd' && (
          <>
            <MetricBadge label="Mkt Cap" value={stock.marketCap ? `₹${(stock.marketCap / 1000).toFixed(0)}B` : '—'} />
            <MetricBadge label="Momentum" value={stock.momentum ? `${stock.momentum}%` : '—'} highlight={changeColor} />
          </>
        )}
      </div>

      {mode === 'nerd' && (
        <div style={{ padding: '0.75rem', background: 'rgba(96,165,250,0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(96,165,250,0.12)', marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          🔬 {stock.analystNote || 'Quantitative screening based on fundamentals and price action.'}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn btn-primary" style={{ flex: 1 }}>📈 View</button>
        <button className="btn btn-success" style={{ flex: 1 }}>+ Portfolio</button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card">
      <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '8px' }} />
      <div className="skeleton" style={{ height: '14px', width: '40%', marginBottom: '16px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
        <div className="skeleton" style={{ height: '52px' }} />
        <div className="skeleton" style={{ height: '52px' }} />
      </div>
      <div className="skeleton" style={{ height: '38px' }} />
    </div>
  );
}

export default function StocksPage() {
  const { mode } = useAppStore();
  const [strategy, setStrategy] = useState('growth');
  const [filters, setFilters] = useState({ sector: '', minPe: '', maxPe: '' });
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    stockService.getScreener(strategy, filters)
      .then((res) => setStocks(res.items || []))
      .catch(() => {
        setError('Could not load stocks. Start the backend.');
        setStocks([]);
      })
      .finally(() => setLoading(false));
  }, [strategy, filters]);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span className="eyebrow">AI Stock Screener</span>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Stock Screener
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {mode === 'regular'
            ? 'Choose an investment style and find top-rated stocks in simple words.'
            : 'Filter by strategy, sector, and fundamental metrics. Nerd Mode shows full quant breakdown.'}
        </p>
      </div>

      {/* Strategy Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {STRATEGIES.map((s) => (
          <button
            key={s.value}
            onClick={() => setStrategy(s.value)}
            className="btn"
            style={{
              background: strategy === s.value ? 'var(--grad-primary)' : 'var(--bg-card)',
              color: strategy === s.value ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${strategy === s.value ? 'transparent' : 'var(--border-subtle)'}`,
              boxShadow: strategy === s.value ? '0 4px 14px rgba(102,126,234,0.3)' : 'none',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card-flat" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'flex-end', padding: '1rem 1.25rem' }}>
        <div>
          <label className="form-label">Sector</label>
          <select
            className="form-input form-select"
            value={filters.sector}
            onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
            style={{ width: '140px' }}
          >
            <option value="">All Sectors</option>
            {SECTORS.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Min P/E</label>
          <input
            type="number"
            className="form-input"
            placeholder="e.g. 10"
            value={filters.minPe}
            onChange={(e) => setFilters({ ...filters, minPe: e.target.value })}
            style={{ width: '110px' }}
          />
        </div>
        <div>
          <label className="form-label">Max P/E</label>
          <input
            type="number"
            className="form-input"
            placeholder="e.g. 40"
            value={filters.maxPe}
            onChange={(e) => setFilters({ ...filters, maxPe: e.target.value })}
            style={{ width: '110px' }}
          />
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => setFilters({ sector: '', minPe: '', maxPe: '' })}
        >
          Reset
        </button>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : stocks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, marginBottom: '0.5rem' }}>No stocks match your filters</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Try adjusting the strategy or sector filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: mode === 'nerd' ? 'repeat(auto-fill, minmax(300px, 1fr))' : 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {stocks.map((s) => <StockCard key={s.symbol} stock={s} mode={mode} />)}
        </div>
      )}
    </div>
  );
}
