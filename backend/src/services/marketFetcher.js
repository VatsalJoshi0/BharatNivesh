import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

export async function fetchIndices() {
  try {
    const results = await yahooFinance.quote(['^NSEI', '^BSESN', '^NSEBANK']);
    const indices = {};
    results.forEach(q => {
      let key = 'NIFTY_50';
      if (q.symbol === '^BSESN') key = 'SENSEX';
      else if (q.symbol === '^NSEBANK') key = 'BANKNIFTY';
      
      indices[key] = {
        price: q.regularMarketPrice,
        change: q.regularMarketChange,
        change_percent: q.regularMarketChangePercent
      };
    });
    return indices;
  } catch (err) {
    console.warn('Yahoo Finance indices fetch failed, using fallback:', err.message);
    return {
      NIFTY_50: { price: 23456.12, change: -12.34, change_percent: -0.05 },
      SENSEX: { price: 78345.21, change: 45.6, change_percent: 0.06 },
      BANKNIFTY: { price: 48900.55, change: 120.2, change_percent: 0.25 },
    };
  }
}

export async function fetchQuotes(symbols = []) {
  if (!symbols.length) return {};
  try {
    const yfSymbols = symbols.map(s => s.endsWith('.NS') || s.endsWith('.BO') ? s : `${s}.NS`);
    const results = await yahooFinance.quote(yfSymbols);
    const quotes = {};
    results.forEach(q => {
      const sym = q.symbol.replace('.NS', '').replace('.BO', '');
      quotes[sym] = {
        price: q.regularMarketPrice,
        change: q.regularMarketChange,
        change_percent: q.regularMarketChangePercent
      };
    });
    return quotes;
  } catch (err) {
    console.warn('Yahoo Finance quotes fetch failed, using fallback:', err.message);
    const mock = {};
    symbols.forEach((s) => {
      mock[s] = { price: (Math.random() * 1000).toFixed(2), change: (Math.random() * 10 - 5).toFixed(2), change_percent: (Math.random()*2-1).toFixed(2) };
    });
    return mock;
  }
}
