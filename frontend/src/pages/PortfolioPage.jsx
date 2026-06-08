import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '../stores/authStore';
import { portfolioService } from '../services/api';
import { calculateXIRR } from '../utils/xirr';

function SummaryCard({ label, value, sub, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value" style={{ color: color || 'var(--text-primary)', fontSize: '1.6rem' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{sub}</div>}
    </div>
  );
}

export default function PortfolioPage() {
  const { isAuthenticated } = useAuthStore();
  const [holdings, setHoldings] = useState([]);
  const [form, setForm] = useState({ symbol: '', qty: '', buyPrice: '', buyDate: '' });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    portfolioService.getHoldings()
      .then((res) => {
        const formatted = (res.holdings || []).map((h) => ({
          ...h,
          qty: h.quantity,
          buyPrice: Number(h.buy_price),
          currentPrice: Number(h.current_price || h.buy_price),
        }));
        setHoldings(formatted);
      })
      .catch(() => setError('Could not load portfolio — start the backend server.'))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!form.symbol || !form.qty || !form.buyPrice) {
      setError('Please fill in all required fields.');
      return;
    }
    setAdding(true);
    setError('');
    try {
      const res = await portfolioService.addHolding({
        symbol: form.symbol.toUpperCase(),
        quantity: Number(form.qty),
        buy_price: Number(form.buyPrice),
        buy_date: form.buyDate || new Date().toISOString().split('T')[0],
      });
      const newH = {
        ...res.holding,
        qty: res.holding.quantity,
        buyPrice: Number(res.holding.buy_price),
        currentPrice: Number(res.holding.buy_price),
      };
      setHoldings((prev) => [...prev, newH]);
      setForm({ symbol: '', qty: '', buyPrice: '', buyDate: '' });
    } catch {
      setError('Failed to add holding. Try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await portfolioService.removeHolding(id);
      setHoldings((prev) => prev.filter((h) => h.id !== id));
    } catch {
      setError('Failed to remove holding.');
    }
  };

  const totalValue = holdings.reduce((s, h) => s + h.qty * h.currentPrice, 0);
  const totalInvested = holdings.reduce((s, h) => s + h.qty * h.buyPrice, 0);
  const pl = totalValue - totalInvested;
  const plPct = totalInvested > 0 ? ((pl / totalInvested) * 100).toFixed(2) : '0.00';

  const xirr = useMemo(() => {
    if (holdings.length === 0 || totalValue === 0) return 0;
    const cashFlows = [];
    holdings.forEach((h) => {
      const d = h.buy_date ? new Date(h.buy_date) : new Date();
      cashFlows.push({ amount: -1 * h.qty * h.buyPrice, date: d });
    });
    cashFlows.push({ amount: totalValue, date: new Date() });
    cashFlows.sort((a, b) => a.date - b.date);
    try { return calculateXIRR(cashFlows); } catch { return 0; }
  }, [holdings, totalValue]);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span className="eyebrow">Your Investments</span>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>
          Portfolio Tracker
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
          Track holdings, P&amp;L, and XIRR-annualized returns in real time.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Add Holding Form */}
      {isAuthenticated ? (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.05rem', marginBottom: '1rem' }}>
            ➕ Add Holding
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label className="form-label">Symbol *</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. RELIANCE"
                value={form.symbol}
                onChange={(e) => setForm({ ...form, symbol: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Quantity *</label>
              <input
                className="form-input"
                type="number"
                placeholder="e.g. 10"
                value={form.qty}
                onChange={(e) => setForm({ ...form, qty: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Buy Price (₹) *</label>
              <input
                className="form-input"
                type="number"
                placeholder="e.g. 2500"
                value={form.buyPrice}
                onChange={(e) => setForm({ ...form, buyPrice: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Buy Date</label>
              <input
                className="form-input"
                type="date"
                value={form.buyDate}
                onChange={(e) => setForm({ ...form, buyDate: e.target.value })}
              />
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleAdd}
            disabled={adding}
            style={{ minWidth: '140px' }}
          >
            {adding ? '⏳ Adding...' : '➕ Add Holding'}
          </button>
        </div>
      ) : (
        <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
          Please <a href="/onboarding/kyc" style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>register / sign in</a> to save and track your portfolio.
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <SummaryCard label="Total Invested" value={`₹${totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
        <SummaryCard label="Current Value" value={`₹${totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
        <SummaryCard
          label="Total P&L"
          value={`${pl >= 0 ? '+' : ''}₹${Math.abs(pl).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          sub={`${plPct}% overall`}
          color={pl >= 0 ? 'var(--positive)' : 'var(--negative)'}
        />
        <SummaryCard
          label="XIRR (Annualized)"
          value={`${xirr >= 0 ? '+' : ''}${xirr.toFixed(2)}%`}
          sub="Annualized return rate"
          color={xirr >= 0 ? 'var(--positive)' : 'var(--negative)'}
        />
      </div>

      {/* Holdings Table */}
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : holdings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💼</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, marginBottom: '0.5rem' }}>
            Your portfolio is empty
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Add your first holding above to start tracking!
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.05rem' }}>
              Holdings ({holdings.length})
            </h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th style={{ textAlign: 'right' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Buy Price</th>
                  <th style={{ textAlign: 'right' }}>Current</th>
                  <th style={{ textAlign: 'right' }}>P&amp;L</th>
                  <th style={{ textAlign: 'right' }}>P&amp;L %</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => {
                  const holdingPL = (h.currentPrice - h.buyPrice) * h.qty;
                  const holdingPLPct = h.buyPrice > 0 ? ((h.currentPrice - h.buyPrice) / h.buyPrice) * 100 : 0;
                  return (
                    <tr key={h.id}>
                      <td>
                        <span style={{ fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{h.symbol}</span>
                      </td>
                      <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{h.qty}</td>
                      <td style={{ textAlign: 'right' }}>₹{Number(h.buyPrice).toLocaleString('en-IN')}</td>
                      <td style={{ textAlign: 'right' }}>₹{Number(h.currentPrice).toLocaleString('en-IN')}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: holdingPL >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
                        {holdingPL >= 0 ? '+' : ''}₹{Math.abs(holdingPL).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: holdingPLPct >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
                        {holdingPLPct >= 0 ? '+' : ''}{holdingPLPct.toFixed(2)}%
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemove(h.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
