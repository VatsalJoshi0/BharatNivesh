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
    NIFTY_50: {
      price: 21874.45,
      change_percent: 0.48
    },
    SENSEX: {
      price: 72642.31,
      change_percent: 0.36
    },
    BANKNIFTY: {
      price: 46812.9,
      change_percent: -0.12
    },
    NIFTY_MIDCAP: {
      price: 48920.2,
      change_percent: 0.72
    },
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

function buildStocks() {
  return [
    { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', price: 2920, pe: 24.1, roe: 9.2, marketCap: 19500, momentum: 2.4, analystNote: 'Large-cap energy and retail exposure with stable cash generation.' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Finance', price: 1684, pe: 18.6, roe: 16.8, marketCap: 12800, momentum: 1.1, analystNote: 'Private bank with strong deposit franchise and improving margins.' },
    { symbol: 'INFY', name: 'Infosys', sector: 'IT', price: 1498, pe: 22.8, roe: 29.4, marketCap: 6200, momentum: -0.8, analystNote: 'IT services leader; near-term demand remains selective.' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors', sector: 'Auto', price: 986, pe: 16.2, roe: 18.7, marketCap: 3600, momentum: 3.6, analystNote: 'Auto momentum supported by premium passenger vehicles and JLR.' },
    { symbol: 'SUNPHARMA', name: 'Sun Pharma', sector: 'Pharma', price: 1516, pe: 31.4, roe: 15.1, marketCap: 3640, momentum: 1.8, analystNote: 'Defensive pharma exposure with specialty pipeline optionality.' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'FMCG', price: 2392, pe: 52.5, roe: 20.6, marketCap: 5620, momentum: -0.5, analystNote: 'Quality FMCG compounder; valuation requires patience.' }
  ];
}

function buildFunds() {
  return [
    { id: 'mf-1', name: 'Bharat Large Cap Index Fund', category: 'Large Cap', risk_level: 'Moderate', returns_3y: 15.2, nav: 184.32, expense_ratio: 0.18 },
    { id: 'mf-2', name: 'Nivesh Flexi Cap Opportunities', category: 'Flexi Cap', risk_level: 'Moderate', returns_3y: 18.7, nav: 92.45, expense_ratio: 0.62 },
    { id: 'mf-3', name: 'India Midcap Growth Fund', category: 'Mid Cap', risk_level: 'High', returns_3y: 22.4, nav: 128.11, expense_ratio: 0.78 },
    { id: 'mf-4', name: 'Short Duration Debt Plus', category: 'Debt', risk_level: 'Low', returns_3y: 7.1, nav: 36.82, expense_ratio: 0.24 },
    { id: 'mf-5', name: 'Tax Saver Equity Plan', category: 'ELSS', risk_level: 'High', returns_3y: 16.9, nav: 74.56, expense_ratio: 0.54 }
  ];
}

function buildOfferings() {
  return [
    { id: 'ofs-1', company_name: 'National Grid Infra Trust', type: 'InvIT', price_band_low: 98, price_band_high: 102, open_date: '2026-06-12', close_date: '2026-06-16', subscription_count: 2.8 },
    { id: 'fpo-1', company_name: 'Bharat Renewables FPO', type: 'FPO', price_band_low: 142, price_band_high: 150, open_date: '2026-06-14', close_date: '2026-06-18', subscription_count: 0.9 }
  ];
}

function buildHoldings() {
  return [
    { id: 'holding-1', symbol: 'HDFCBANK', quantity: 12, buy_price: 1540, current_price: 1684, buy_date: '2025-09-12' },
    { id: 'holding-2', symbol: 'INFY', quantity: 8, buy_price: 1430, current_price: 1498, buy_date: '2025-11-03' }
  ];
}

function toDetailedIpos() {
  return buildIpos().map((ipo, index) => {
    const low = Number((ipo.price_band.match(/\d+/g) || [100, 120])[0]);
    const high = Number((ipo.price_band.match(/\d+/g) || [100, 120])[1] || low + 10);
    const total = Number(((ipo.subscription_buckets.qib_x + ipo.subscription_buckets.nii_x + ipo.subscription_buckets.rii_x) / 3).toFixed(2));

    return {
      ...ipo,
      company_name: ipo.name,
      symbol: ipo.name.split(' ').map((word) => word[0]).join('').toUpperCase(),
      priceMin: low,
      priceMax: high,
      subscriptions: {
        qib: ipo.subscription_buckets.qib_x,
        nii: ipo.subscription_buckets.nii_x,
        rii: ipo.subscription_buckets.rii_x
      },
      subscription_buckets: {
        ...ipo.subscription_buckets,
        total_x: total
      },
      day: index % 2 === 0 ? 'Day 3' : 'Day 2',
      closes_on: ['2026-06-10', '2026-06-11', '2026-06-13', '2026-06-14'][index],
      listing_risk: ['Medium', 'Low', 'Medium', 'High'][index],
      demand_signal: total > 18 ? 'Strong demand' : total > 10 ? 'Healthy demand' : 'Building demand',
      verdict: {
        verdict: ['Apply', 'Consider', 'Strong Buy', 'Hold'][index % 4],
        confidence: [78, 64, 84, 55][index % 4],
        action: ['apply', 'alert', 'apply', 'skip'][index % 4],
        reason: `${ipo.name} shows ${ipo.sentiment.toLowerCase()} demand with ${ipo.confidence.toLowerCase()} confidence on subscription quality.`,
        dcfTarget: high + 22 + index * 9,
        upside: [18, 9, 24, -3][index % 4],
        metrics: {
          peRatio: [28, 19, 34, 41][index % 4],
          roeQuality: ['Strong', 'Stable', 'High', 'Watch'][index % 4],
          debtHealth: ['Low', 'Moderate', 'Low', 'Elevated'][index % 4],
          valuation: [71, 58, 76, 44][index % 4]
        }
      },
      redFlags: index === 3 ? [{ severity: 'medium', title: 'Higher valuation versus listed peers' }] : []
    };
  });
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
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
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
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }

  const path = event.path
    .replace(/^\/\.netlify\/functions\/api/, '')
    .replace(/^\/api/, '');

  if (event.httpMethod === 'GET' && (path === '/v1/market/overview' || path === '/market/indices')) {
    return json(200, buildOverview());
  }

  if (event.httpMethod === 'GET' && path === '/market/quotes') {
    const params = new URLSearchParams(event.queryStringParameters || {});
    const symbols = (params.get('symbols') || 'RELIANCE,HDFCBANK').split(',');
    return json(200, {
      items: symbols.map((symbol, index) => ({
        symbol: symbol.trim().toUpperCase(),
        price: Number((1200 + index * 185 + createRandom(symbol.length + index)() * 60).toFixed(2)),
        change_percent: Number(((createRandom(symbol.length + 17)() - 0.5) * 3).toFixed(2))
      }))
    });
  }

  if (event.httpMethod === 'GET' && (path === '/v1/ipo/upcoming' || path === '/ipos')) {
    return json(200, { items: toDetailedIpos() });
  }

  if (event.httpMethod === 'GET' && path.startsWith('/ipos/')) {
    const id = path.split('/').pop();
    const ipo = toDetailedIpos().find((item) => item.id === id);
    return ipo ? json(200, ipo) : json(404, { error: 'IPO not found' });
  }

  if (event.httpMethod === 'GET' && path === '/v1/ipo/subscriptions') {
    return json(200, buildIpoSubscriptions());
  }

  if (event.httpMethod === 'GET' && (path === '/v1/market/analysis' || path === '/market/analysis')) {
    return json(200, buildMarketAnalysis());
  }

  if (event.httpMethod === 'GET' && (path === '/v1/sip/suggestions' || path === '/mutualfunds/suggestions')) {
    return json(200, buildSipSuggestions());
  }

  if (event.httpMethod === 'GET' && path === '/mutualfunds') {
    return json(200, buildFunds());
  }

  if (event.httpMethod === 'GET' && path === '/stocks/screener') {
    const params = event.queryStringParameters || {};
    const items = buildStocks().filter((stock) => {
      if (params.sector && stock.sector !== params.sector) return false;
      if (params.minPe && stock.pe < Number(params.minPe)) return false;
      if (params.maxPe && stock.pe > Number(params.maxPe)) return false;
      return true;
    });
    return json(200, { items });
  }

  if (event.httpMethod === 'GET' && path.startsWith('/stocks/')) {
    const symbol = path.split('/').pop().toUpperCase();
    const stock = buildStocks().find((item) => item.symbol === symbol);
    return stock ? json(200, stock) : json(404, { error: 'Stock not found' });
  }

  if (event.httpMethod === 'GET' && path === '/secondary') {
    return json(200, buildOfferings());
  }

  if (event.httpMethod === 'GET' && path === '/portfolio') {
    return json(200, { holdings: buildHoldings() });
  }

  if (event.httpMethod === 'POST' && path === '/portfolio') {
    const body = JSON.parse(event.body || '{}');
    return json(201, {
      holding: {
        id: `holding-${Date.now()}`,
        symbol: String(body.symbol || 'STOCK').toUpperCase(),
        quantity: Number(body.quantity || 0),
        buy_price: Number(body.buy_price || 0),
        current_price: Number(body.buy_price || 0),
        buy_date: body.buy_date || new Date().toISOString().slice(0, 10)
      }
    });
  }

  if (event.httpMethod === 'DELETE' && path.startsWith('/portfolio/')) {
    return json(200, { ok: true });
  }

  if (event.httpMethod === 'POST' && path === '/onboarding/kyc') {
    return json(200, { ok: true, status: 'submitted' });
  }

  if (event.httpMethod === 'POST' && path === '/onboarding/quiz') {
    const body = JSON.parse(event.body || '{}');
    const answers = Array.isArray(body.answers) ? body.answers : [];
    const average = answers.reduce((sum, value) => sum + Number(value || 0), 0) / Math.max(answers.length, 1);
    return json(200, { ok: true, risk: average >= 4 ? 'growth' : average >= 2.5 ? 'balanced' : 'conservative' });
  }

  return json(404, { error: 'API route not found' });
};
