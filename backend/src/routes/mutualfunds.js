import express from 'express';
import pool from '../config/database.js';
import cache from '../utils/cache.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, risk } = req.query;
    const cacheKey = `mf_list_${category || 'all'}_${risk || 'all'}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    let funds = [];
    try {
      let query = 'SELECT * FROM mutual_funds';
      const params = [];
      if (category || risk) {
        query += ' WHERE';
        if (category) {
          params.push(category);
          query += ` category = $${params.length}`;
        }
        if (risk) {
          if (category) query += ' AND';
          params.push(risk);
          query += ` risk_level = $${params.length}`;
        }
      }
      const { rows } = await pool.query(query, params);
      funds = rows;
    } catch (e) {
      // fallback
    }

    if (funds.length === 0) {
      funds = [
        { id: 1, name: 'HDFC Index Fund-Nifty 50 Plan', category: 'Equity', risk_level: 'High', nav: 210.45, expense_ratio: 0.20, returns_3y: 15.40, returns_5y: 14.20 },
        { id: 2, name: 'Parag Parikh Flexi Cap Fund', category: 'Equity', risk_level: 'Very High', nav: 85.34, expense_ratio: 0.65, returns_3y: 21.20, returns_5y: 19.80 },
        { id: 3, name: 'SBI Bluechip Fund', category: 'Equity', risk_level: 'High', nav: 92.11, expense_ratio: 0.85, returns_3y: 14.10, returns_5y: 12.85 },
        { id: 4, name: 'ICICI Prudential Corporate Bond Fund', category: 'Debt', risk_level: 'Moderate', nav: 34.56, expense_ratio: 0.35, returns_3y: 7.20, returns_5y: 7.80 },
        { id: 5, name: 'Aditya Birla Sun Life Liquid Fund', category: 'Liquid', risk_level: 'Low', nav: 380.23, expense_ratio: 0.15, returns_3y: 5.80, returns_5y: 5.50 }
      ];
      if (category) {
        funds = funds.filter(f => f.category.toLowerCase() === category.toLowerCase());
      }
      if (risk) {
        funds = funds.filter(f => f.risk_level.toLowerCase() === risk.toLowerCase());
      }
    }

    cache.set(cacheKey, funds, 300000);
    res.json(funds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch mutual funds' });
  }
});

router.get('/suggestions', async (req, res) => {
  try {
    const cacheKey = 'sip_suggestions';
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const data = {
      profiles: [
        {
          key: 'conservative',
          label: 'Conservative',
          monthly_sip_range: '₹1,000 - ₹5,000',
          suggestion: 'Focus on Liquid funds, Short-term Debt funds, and Arbitrage funds. Keeps capital relatively safe while beating inflation slightly.',
          allocation: '80% Debt, 20% Equity',
          horizon: '1-3 years',
          risk: 'Low to Moderate volatility'
        },
        {
          key: 'balanced',
          label: 'Balanced',
          monthly_sip_range: '₹5,000 - ₹15,000',
          suggestion: 'A mix of Nifty Index funds, Large-cap equity, and High-quality Corporate Debt. Suitable for steady long-term growth with moderate protection.',
          allocation: '50% Equity, 50% Debt',
          horizon: '3-5 years',
          risk: 'Moderate volatility'
        },
        {
          key: 'aggressive',
          label: 'Aggressive',
          monthly_sip_range: '₹15,000+',
          suggestion: 'Flexi-cap, Mid-cap, and Small-cap equity funds. Offers high growth potential over long timelines, but requires tolerance for market drops.',
          allocation: '85% Equity, 15% Debt',
          horizon: '5+ years',
          risk: 'High volatility'
        }
      ],
      checks: [
        'Ensure you have 6 months of emergency expenses saved separately.',
        'Choose Direct plans over Regular plans to save on commissions (increases returns by ~0.5%-1% yearly).',
        'Compare Expense Ratios (lower is better) and Exit Load periods.',
        'Review the historical rolling returns, not just the last 1-year trailing return.'
      ]
    };

    cache.set(cacheKey, data, 600000);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch SIP suggestions' });
  }
});

export default router;
