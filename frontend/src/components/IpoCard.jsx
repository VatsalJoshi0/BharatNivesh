function IpoCard({ ipo }) {
  const { name, price_band, issue_size, subscription_buckets, confidence, sentiment } = ipo;
  const totalDemand = subscription_buckets.qib_x + subscription_buckets.nii_x + subscription_buckets.rii_x;

  const progress = (value) => Math.min(100, Math.round((value / totalDemand) * 100));

  return (
    <article className="ipo-card">
      <div className="ipo-card-top">
        <div>
          <span className="ipo-name">{name}</span>
          <p className="ipo-band">Price band: {price_band}</p>
        </div>
        <div className="ipo-pill">{confidence}</div>
      </div>
      <div className="ipo-summary">
        <p>{issue_size} issue size</p>
        <p>Sentiment: {sentiment}</p>
      </div>
      <div className="subscription-section">
        <span className="subscription-label">Subscription buckets</span>
        <div className="bucket-row">
          <span>QIB</span>
          <div className="bucket-bar">
            <div className="bucket-fill qib" style={{ width: `${progress(subscription_buckets.qib_x)}%` }} />
          </div>
          <span>{subscription_buckets.qib_x}x</span>
        </div>
        <div className="bucket-row">
          <span>NII</span>
          <div className="bucket-bar">
            <div className="bucket-fill nii" style={{ width: `${progress(subscription_buckets.nii_x)}%` }} />
          </div>
          <span>{subscription_buckets.nii_x}x</span>
        </div>
        <div className="bucket-row">
          <span>RII</span>
          <div className="bucket-bar">
            <div className="bucket-fill rii" style={{ width: `${progress(subscription_buckets.rii_x)}%` }} />
          </div>
          <span>{subscription_buckets.rii_x}x</span>
        </div>
      </div>
    </article>
  );
}

export default IpoCard;
