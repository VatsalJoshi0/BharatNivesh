import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.post('/kyc', authenticateJWT, [
  body('pan').isLength({ min: 10, max: 10 }),
  body('address').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { pan, aadhar, address } = req.body;
    // For now, mock: update kyc_status for user
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    await pool.query('UPDATE users SET kyc_status = $1, updated_at = NOW() WHERE id = $2', ['verified', req.user.userId]);
    res.json({ ok: true, message: 'KYC recorded (mock)' });
  } catch (err) {
    res.status(500).json({ error: 'KYC failed' });
  }
});

router.post('/quiz', authenticateJWT, [
  body('answers').isArray({ min: 1 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { answers } = req.body;
    // Simple scoring: sum answers
    const score = answers.reduce((a, b) => a + Number(b), 0);
    const risk = score <= 10 ? 'Conservative' : score <= 20 ? 'Moderate' : 'Aggressive';
    await pool.query('UPDATE users SET risk_profile = $1, updated_at = NOW() WHERE id = $2', [risk, req.user.userId]);
    res.json({ ok: true, risk });
  } catch (err) {
    res.status(500).json({ error: 'Quiz submission failed' });
  }
});

export default router;