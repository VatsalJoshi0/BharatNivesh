import express from 'express';
import pool from '../config/database.js';
import { enrichIpo, getVerdictRegular, getVerdictNerd, calculateRedFlags } from '../services/ipoAnalyzer.js';
import { fetchLiveIpos } from '../services/ipoScraper.js';
import cache from '../utils/cache.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const mockData = require('../../mockData.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cacheKey = 'ipos_list';
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    let liveIpos = await fetchLiveIpos();
    
    if (liveIpos.length === 0) {
      const result = await pool.query(
        'SELECT id, symbol, company_name, price_band_low as priceMin, price_band_high as priceMax, open_date, close_date FROM ipos ORDER BY open_date DESC LIMIT 20'
      );
      liveIpos = result.rows;
    }

    if (liveIpos.length === 0) {
       const mockIpos = mockData.buildIpos();
       liveIpos = mockIpos.map((i, idx) => ({
         id: idx + 1,
         symbol: i.name.substring(0, 5).toUpperCase(),
         company_name: i.name,
         priceMin: parseInt(i.price_band.split('-')[0].replace(/\\D/g, '')) || 100,
         priceMax: parseInt(i.price_band.split('-')[1].replace(/\\D/g, '')) || 120
       }));
    }

    const items = liveIpos.map((ipo, idx) => enrichIpo({ ...ipo, id: ipo.id || idx+1 }, req.query.mode || 'regular'));
    const data = { items };
    cache.set(cacheKey, data, 300000);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch IPOs' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const cacheKey = `ipo_${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const result = await pool.query('SELECT * FROM ipos WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'IPO not found' });
    const ipo = enrichIpo(result.rows[0], req.query.mode || 'regular');
    cache.set(cacheKey, ipo, 600000);
    res.json(ipo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch IPO details' });
  }
});

router.get('/:id/verdict', async (req, res) => {
  try {
    const { id } = req.params;
    const { mode = 'regular' } = req.query;
    const cacheKey = `verdict_${id}_${mode}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const result = await pool.query('SELECT * FROM ipos WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'IPO not found' });

    const ipo = result.rows[0];
    const verdict = mode === 'nerd' ? getVerdictNerd(ipo) : getVerdictRegular(ipo);
    const redFlags = calculateRedFlags(ipo);

    const data = { verdict, redFlags };
    cache.set(cacheKey, data, 600000);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate verdict' });
  }
});

router.post('/:id/apply', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id FROM ipos WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'IPO not found' });

    res.json({
      status: 'success',
      message: 'IPO application submitted (mock)',
      brokerDeeplink: `https://zerodha.com/ipos/apply?ipo_id=${id}`,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to apply' });
  }
});

export default router;