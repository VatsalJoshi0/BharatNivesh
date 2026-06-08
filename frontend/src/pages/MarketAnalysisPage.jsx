import { useEffect, useState } from 'react';
import { marketService } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';

function SignalCard({ signal }) {
  const toneClass = signal.tone === 'positive' ? 'text-positive' : signal.tone === 'negative' ? 'text-negative' : 'text-neutral';
  return (
    <div className="stat-card animate-fade-in-up">
      <div className="stat-card-label">{signal.label}</div>
      <div className={`stat-card-value ${toneClass}`}>{signal.value}</div>
    </div>
  );
}

function SentimentItem({ item }) {
  return (
    <div className={`sentiment-item ${item.tone}`} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
      <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>{item.text}</p>
      <span
        className={`badge ${item.tone === 'positive' ? 'badge-green' : 'badge-red'}`}
        style={{ flexShrink: 0 }}
      >
        {item.sentiment} ({item.confidence?.toFixed(1)}%)
      </span>
    </div>
  );
}

export default function MarketAnalysisPage() {
  const { mode } = useAppStore();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    marketService.getAnalysis()
      .then((data) => {
        setAnalysis(data);
        setError('');
      })
      .catch(() => {
        setError('Unable to load market analysis. Make sure the backend is running.');
      })
      .finally(() => setLoading(false));
  }, []);

  const moodColor = analysis?.market_mood?.label === 'Bullish'
    ? 'var(--positive)' : analysis?.market_mood?.label === 'Bearish'
    ? 'var(--negative)' : 'var(--neutral)';

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span className="eyebrow">AI-Powered Insights</span>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Market Analysis
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {mode === 'regular'
            ? 'आज बाज़ार का मूड, सेक्टर ब्रेड्थ और वॉचलिस्ट नोट्स — एक नज़र में।'
            : 'Sector breadth, trend signals, volatility metrics, and local AI sentiment analysis on live headlines.'}
        </p>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '4rem 0' }}>
          <div className="loading-spinner" />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Analyzing market with AI...</p>
        </div>
      )}

      {analysis && (
        <>
          {/* Mood Banner */}
          <div className="card animate-fade-in-up" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'center', borderColor: moodColor, borderWidth: '1px' }}>
            <div>
              <span className="eyebrow">Current Market Mood</span>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 800, color: moodColor, letterSpacing: '-0.03em', margin: '0.25rem 0 0.75rem' }}>
                {analysis.market_mood.label} {analysis.market_mood.label === 'Bullish' ? '📈' : analysis.market_mood.label === 'Bearish' ? '📉' : '➡️'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {analysis.market_mood.summary}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Risk Level</span>
                <span className={`badge ${analysis.market_mood.risk_level === 'Low' ? 'badge-green' : analysis.market_mood.risk_level === 'High' ? 'badge-red' : 'badge-yellow'}`}>
                  {analysis.market_mood.risk_level}
                </span>
              </div>
              <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {analysis.source} · {new Date(analysis.timestamp).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Signal Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {analysis.signals?.map((signal) => (
              <SignalCard key={signal.label} signal={signal} />
            ))}
          </div>

          {/* Sectors + Watchlist */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Sector Breadth */}
            <div className="card">
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
                📊 Sector Breadth
              </h2>
              <div>
                {analysis.sectors?.map((sector) => (
                  <div key={sector.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div>
                      <strong style={{ fontSize: '0.9rem', display: 'block' }}>{sector.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sector.breadth} · {sector.signal}</span>
                    </div>
                    <span className={`badge ${sector.change_percent >= 0 ? 'badge-green' : 'badge-red'}`}>
                      {sector.change_percent >= 0 ? '+' : ''}{sector.change_percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Watchlist */}
            <div className="card">
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
                👁️ Watchlist Notes
              </h2>
              <div>
                {analysis.watchlist?.map((stock) => (
                  <div key={stock.symbol} style={{ padding: '0.85rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                      <div>
                        <strong style={{ fontSize: '0.95rem' }}>{stock.symbol}</strong>
                        <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--accent-blue)', fontWeight: 600, marginTop: '0.15rem' }}>
                          {stock.trend}
                        </span>
                      </div>
                      <span className={`badge ${stock.risk === 'Low' ? 'badge-green' : stock.risk === 'High' ? 'badge-red' : 'badge-yellow'}`}>
                        {stock.risk} Risk
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{stock.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Sentiment */}
          {analysis.news && analysis.news.length > 0 && (
            <div className="card animate-fade-in-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>
                  🤖 AI Sentiment Analysis
                </h2>
                <span className="badge badge-purple">Local DistilBERT</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {analysis.news.map((item, idx) => (
                  <SentimentItem key={idx} item={item} />
                ))}
              </div>
              {mode === 'nerd' && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)' }}>
                  🔬 Model: Xenova/distilbert-base-uncased-finetuned-sst-2-english (SST-2, ~260MB). Runs locally via @xenova/transformers. Falls back to keyword heuristics if model fails to load.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
