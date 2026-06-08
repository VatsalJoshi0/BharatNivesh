export function generateMockStocks() {
  const sample = [
    { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT', marketCap: 1500000, pe: 28, roe: 25, momentum: 12 },
    { symbol: 'INFY', name: 'Infosys', sector: 'IT', marketCap: 700000, pe: 22, roe: 18, momentum: 8 },
    { symbol: 'HDFC', name: 'HDFC Bank', sector: 'Finance', marketCap: 1000000, pe: 18, roe: 16, momentum: 5 },
    { symbol: 'RELI', name: 'Reliance Industries', sector: 'Energy', marketCap: 2000000, pe: 28, roe: 12, momentum: 15 },
    { symbol: 'ICIC', name: 'ICICI Bank', sector: 'Finance', marketCap: 600000, pe: 16, roe: 14, momentum: -2 },
  ];
  return sample;
}

export function applyFilters(stocks = [], filters = {}) {
  return stocks.filter((s) => {
    if (filters.sector && s.sector.toLowerCase() !== filters.sector.toLowerCase()) return false;
    if (filters.minPe && s.pe < Number(filters.minPe)) return false;
    if (filters.maxPe && s.pe > Number(filters.maxPe)) return false;
    if (filters.minMarketCap && s.marketCap < Number(filters.minMarketCap)) return false;
    return true;
  });
}

export function screenerByStrategy(strategy = 'growth', stocks = []) {
  const list = [...stocks];
  switch (strategy) {
    case 'growth':
      return list.sort((a, b) => b.roe - a.roe);
    case 'value':
      return list.sort((a, b) => a.pe - b.pe);
    case 'momentum':
      return list.sort((a, b) => b.momentum - a.momentum);
    case 'quality':
      return list.sort((a, b) => (b.roe + b.momentum) - (a.roe + a.momentum));
    default:
      return list;
  }
}

export function getScreener(strategy = 'growth', filters = {}) {
  // In production, query DB for fundamentals; for MVP use mock data
  const stocks = generateMockStocks();
  const filtered = applyFilters(stocks, filters);
  const scored = screenerByStrategy(strategy, filtered);
  return scored.map((s) => ({
    symbol: s.symbol,
    name: s.name,
    sector: s.sector,
    marketCap: s.marketCap,
    pe: s.pe,
    roe: s.roe,
    momentum: s.momentum,
  }));
}
