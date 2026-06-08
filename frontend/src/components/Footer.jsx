export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span>🇮🇳</span>
          <strong style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em' }}>
            BHARATNIVESH
          </strong>
        </div>
        <p>AI-powered Indian investment intelligence — for educational purposes only.</p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', opacity: 0.6 }}>
          Not SEBI-registered. Not investment advice. Data sourced from free public APIs. &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
