import express from 'express';
import pool from '../config/database.js';
import { authenticateJWT } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import yahooFinance from 'yahoo-finance2';

const router = express.Router();

// GET /api/portfolio - get user holdings
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    // Get holdings
    const { rows } = await pool.query('SELECT * FROM portfolio_holdings WHERE user_id = $1', [userId]);
    
    if (rows.length > 0) {
      const symbols = [...new Set(rows.map(r => r.symbol.endsWith('.NS') || r.symbol.endsWith('.BO') ? r.symbol : `${r.symbol}.NS`))];
      const quotes = await yahooFinance.quote(symbols);
      const quoteMap = {};
      quotes.forEach(q => {
        const sym = q.symbol.replace('.NS', '').replace('.BO', '');
        quoteMap[sym] = q.regularMarketPrice;
      });

      rows.forEach(r => {
        r.current_price = quoteMap[r.symbol] || Number(r.buy_price);
      });
    }

    res.json({ ok: true, holdings: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// POST /api/portfolio - add holding
router.post('/', authenticateJWT, [
  body('symbol').notEmpty().withMessage('Symbol is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be positive'),
  body('buy_price').isFloat({ min: 0.01 }).withMessage('Buy price must be greater than 0'),
  body('buy_date').isDate().withMessage('Valid date required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { symbol, quantity, buy_price, buy_date } = req.body;
    const userId = req.user.userId;

    const { rows } = await pool.query(
      'INSERT INTO portfolio_holdings (user_id, symbol, quantity, buy_price, buy_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, symbol.toUpperCase(), quantity, buy_price, buy_date]
    );

    res.status(201).json({ ok: true, holding: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add holding' });
  }
});

// DELETE /api/portfolio/:id - delete holding
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    const holdingId = req.params.id;

    const { rowCount } = await pool.query('DELETE FROM portfolio_holdings WHERE id = $1 AND user_id = $2', [holdingId, userId]);
    
    if (rowCount === 0) return res.status(404).json({ error: 'Holding not found' });
    
    res.json({ ok: true, message: 'Holding removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove holding' });
  }
});

export default router;
