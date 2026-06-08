function createRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

function buildOverview() {
  const rand = createRandom(3391);
  const indices = [
    { key: 'nifty_50', label: 'NIFTY 50', base: 21850 },
    { key: 'sensex', label: 'SENSEX', base: 72800 },
    { key: 'banknifty', label: 'BANKNIFTY', base: 46600 },
    { key: 'india_vix', label: 'INDIA VIX', base: 15 }
  ];

  return {
    timestamp: new Date().toISOString(),
    source: 'Mock market feed',
    indices: indices.map((item) => {
      const value = item.base * (0.94 + rand() * 0.12);
      const change = (rand() - 0.5) * 2;
      return {
        key: item.key,
        label: item.label,
        value: Number(value.toFixed(2)),
        day_change_percent: Number(change.toFixed(2))
      };
    })
  };
}

function buildIpos() {
  const rand = createRandom(8917);
  const names = [
    { name: 'Aarambh Energy', band: 'Rs. 120 - Rs. 130' },
    { name: 'Nayi Underwriting', band: 'Rs. 54 - Rs. 58' },
    { name: 'Bharat Mobility', band: 'Rs. 285 - Rs. 305' },
    { name: 'Swasthya Connect', band: 'Rs. 380 - Rs. 410' }
  ];

  return names.map((item, index) => {
    const qib = 12 + rand() * 30;
    const nii = 6 + rand() * 18;
    const rii = 3 + rand() * 15;
    const confidence = ['High', 'Moderate', 'Strong', 'Cautious'][index % 4];
    const sentiment = ['Positive', 'Balanced', 'Bullish', 'Watchlisted'][index % 4];

    return {
      id: `${index + 1}`,
      name: item.name,
      price_band: item.band,
      issue_size: `Rs. ${(rand() * 250 + 125).toFixed(0)} Cr`,
      subscription_buckets: {
        qib_x: Number(qib.toFixed(1)),
        nii_x: Number(nii.toFixed(1)),
        rii_x: Number(rii.toFixed(1))
      },
      confidence,
      sentiment
    };
  });
}

function buildIpoSubscriptions() {
  return {
    timestamp: new Date().toISOString(),
    source: 'Mock IPO subscription feed',
    market_status: 'Open for tracking',
    items: buildIpos().map((ipo, index) => {
      const qib = ipo.subscription_buckets.qib_x;
      const nii = ipo.subscription_buckets.nii_x;
      const rii = ipo.subscription_buckets.rii_x;
      const employee = Number((1.4 + index * 0.7).toFixed(1));
      const total = Number(((qib + nii + rii + employee) / 4).toFixed(1));

      return {
        ...ipo,
        day: index % 2 === 0 ? 'Day 3' : 'Day 2',
        closes_on: ['2026-06-10', '2026-06-11', '2026-06-13', '2026-06-14'][index],
        subscription_buckets: {
          ...ipo.subscription_buckets,
          employee_x: employee,
          total_x: total
        },
        listing_risk: ['Medium', 'Low', 'Medium', 'High'][index],
        demand_signal: total > 18 ? 'Strong demand' : total > 10 ? 'Healthy demand' : 'Building demand',
        source_status: 'Timestamped mock data'
      };
    })
  };
}

function buildMarketAnalysis() {
  return {
    timestamp: new Date().toISOString(),
    source: 'Mock analysis model',
    market_mood: {
      label: 'Cautiously positive',
      summary: 'Large-cap breadth is stable while volatility remains watchful.',
      risk_level: 'Moderate'
    },
    sectors: [
      { name: 'Financial Services', change_percent: 0.82, breadth: 'Positive', signal: 'Accumulation' },
      { name: 'IT Services', change_percent: -0.34, breadth: 'Mixed', signal: 'Range-bound' },
      { name: 'Auto', change_percent: 1.12, breadth: 'Positive', signal: 'Momentum' },
      { name: 'Pharma', change_percent: 0.26, breadth: 'Stable', signal: 'Defensive strength' },
      { name: 'Energy', change_percent: -0.48, breadth: 'Weak', signal: 'Profit booking' }
    ],
    watchlist: [
      { symbol: 'HDFCBANK', trend: 'Bullish above support', risk: 'Medium', note: 'Watch volume confirmation.' },
      { symbol: 'RELIANCE', trend: 'Consolidating', risk: 'Medium', note: 'Breakout needs index support.' },
      { symbol: 'INFY', trend: 'Weak momentum', risk: 'High', note: 'Avoid chasing without reversal.' },
      { symbol: 'TATAMOTORS', trend: 'Positive momentum', risk: 'Medium', note: 'Trail stops on sharp moves.' }
    ],
    signals: [
      { label: 'Trend strength', value: '64/100', tone: 'positive' },
      { label: 'Volatility comfort', value: '58/100', tone: 'neutral' },
      { label: 'Breadth score', value: '61/100', tone: 'positive' },
      { label: 'Risk pressure', value: '42/100', tone: 'negative' }
    ]
  };
}

function buildSipSuggestions() {
  return {
    timestamp: new Date().toISOString(),
    source: 'Rule-based educational model',
    profiles: [
      {
        key: 'conservative',
        label: 'Conservative',
        allocation: 'Large-cap index funds, short-duration debt, and liquid reserves',
        monthly_sip_range: 'Rs. 3,000 - Rs. 12,000',
        horizon: '3-5 years',
        risk: 'Lower volatility, lower return expectation',
        suggestion: 'Prefer diversified index exposure and avoid concentrated thematic bets.'
      },
      {
        key: 'balanced',
        label: 'Balanced',
        allocation: 'Flexi-cap, large-cap index, ELSS, and debt allocation',
        monthly_sip_range: 'Rs. 5,000 - Rs. 25,000',
        horizon: '5-8 years',
        risk: 'Moderate volatility with diversified equity exposure',
        suggestion: 'Blend core index funds with one active diversified fund after checking expense ratio and consistency.'
      },
      {
        key: 'growth',
        label: 'Growth',
        allocation: 'Index funds, flexi-cap, mid-cap, and limited small-cap exposure',
        monthly_sip_range: 'Rs. 10,000 - Rs. 50,000',
        horizon: '8+ years',
        risk: 'Higher drawdowns possible',
        suggestion: 'Use staggered SIPs and keep emergency funds separate before increasing mid/small-cap exposure.'
      }
    ],
    checks: [
      'Emergency fund before aggressive SIP allocation',
      'Expense ratio and tracking error review',
      'Goal horizon matched with equity risk',
      'Annual portfolio rebalance'
    ]
  };
}

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  },
  body: JSON.stringify(body)
});

exports.handler = async (event) => {
  // Handle preflight OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    };
  }

  const path = event.path
    .replace(/^\/\.netlify\/functions\/api/, '')
    .replace(/^\/api/, '');

  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' });
  }

  if (path === '/v1/market/overview') {
    return json(200, buildOverview());
  }

  if (path === '/v1/ipo/upcoming') {
    return json(200, { items: buildIpos() });
  }

  if (path === '/v1/ipo/subscriptions') {
    return json(200, buildIpoSubscriptions());
  }

  if (path === '/v1/market/analysis') {
    return json(200, buildMarketAnalysis());
  }

  if (path === '/v1/sip/suggestions') {
    return json(200, buildSipSuggestions());
  }

  return json(404, { error: 'API route not found' });
};
