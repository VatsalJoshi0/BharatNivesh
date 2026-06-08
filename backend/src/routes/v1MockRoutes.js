import express from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const mockData = require('../../mockData.js');

const router = express.Router();

router.get('/market/overview', (req, res) => res.json(mockData.buildOverview()));
router.get('/ipo/upcoming', (req, res) => res.json(mockData.buildIpos()));
router.get('/ipo/subscriptions', (req, res) => res.json(mockData.buildIpoSubscriptions()));
router.get('/market/analysis', (req, res) => res.json(mockData.buildMarketAnalysis()));
router.get('/sip/suggestions', (req, res) => res.json(mockData.buildSipSuggestions()));

export default router;
