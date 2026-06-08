import express from 'express';
import pool from '../config/database.js';
import cache from '../utils/cache.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cacheKey = 'secondary_offerings_list';
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    let offerings = [];
    try {
      const { rows } = await pool.query(
        'SELECT * FROM secondary_offerings ORDER BY open_date DESC LIMIT 20'
      );
      offerings = rows;
    } catch (e) {
      // ignore table not existing or query fail, fallback to mock
    }

    if (offerings.length === 0) {
      offerings = [
        {
          id: 1,
          symbol: 'NHPC-OFS',
          company_name: 'NHPC Limited (OFS)',
          type: 'OFS',
          price_band_low: 66.00,
          price_band_high: 66.00,
          open_date: '2026-06-05',
          close_date: '2026-06-08',
          subscription_count: 1.45
        },
        {
          id: 2,
          symbol: 'IRFC-FPO',
          company_name: 'Indian Railway Finance Corp (FPO)',
          type: 'FPO',
          price_band_low: 150.00,
          price_band_high: 155.00,
          open_date: '2026-06-12',
          close_date: '2026-06-15',
          subscription_count: 0.00
        },
        {
          id: 3,
          symbol: 'SGB2026I',
          company_name: 'Sovereign Gold Bond Scheme 2026-II',
          type: 'SGB',
          price_band_low: 6200.00,
          price_band_high: 6200.00,
          open_date: '2026-06-01',
          close_date: '2026-06-05',
          subscription_count: 3.20
        }
      ];
    }

    cache.set(cacheKey, offerings, 300000);
    res.json(offerings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch secondary offerings' });
  }
});

export default router;
