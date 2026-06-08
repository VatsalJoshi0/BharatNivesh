import express from 'express';
import pool from '../config/database.js';
import yahooFinance from 'yahoo-finance2';
import cache from '../utils/cache.js';
import { getScreener } from '../services/stockAnalyzer.js';

const router = express.Router();

// GET /api/stocks/screener?strategy=growth&sector=IT&minPe=10&maxPe=30
router.get('/screener', async (req, res) => {
  try {
    const { strategy = 'growth', sector, minPe, maxPe, minMarketCap } = req.query;
    const cacheKey = `screener_${strategy}_${sector || 'all'}_${minPe || ''}_${maxPe || ''}_${minMarketCap || ''}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    // For MVP use stockAnalyzer mock data; in prod query fundamentals table
    const filters = { sector, minPe, maxPe, minMarketCap };
    const items = getScreener(strategy, filters);

    const data = { items };
    cache.set(cacheKey, data, 300000);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to run screener' });
  }
});

// GET /api/stocks/:symbol
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const yfSymbol = symbol.endsWith('.NS') || symbol.endsWith('.BO') ? symbol : `${symbol}.NS`;
    
    const quote = await yahooFinance.quote(yfSymbol);
    if (!quote) return res.status(404).json({ error: 'Stock not found' });
    
    const stockData = {
      symbol: symbol.toUpperCase(),
      name: quote.longName || quote.shortName || symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      marketCap: quote.marketCap,
      pe: quote.trailingPE,
      roe: 15.5, // Mocked ROE
      sector: quote.sector || 'Unknown'
    };
    
    res.json(stockData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stock' });
  }
});

export default router;
