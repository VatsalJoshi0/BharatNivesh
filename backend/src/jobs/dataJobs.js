import cron from 'node-cron';
import { fetchIndices, fetchQuotes } from '../services/marketFetcher.js';
import { fetchEdifarXml, parseEdifar } from '../services/sebiEdifar.js';
import { fetchGMP } from '../services/gmpScraper.js';

export function startJobs(pool, io) {
  // fetch indices every 1 minute
  cron.schedule('*/1 * * * *', async () => {
    try {
      const indices = await fetchIndices();
      // upsert into market_quotes table for each index
      for (const [symbol, data] of Object.entries(indices)) {
        await pool.query(`INSERT INTO market_quotes (symbol, price, change, change_percent, updated_at)
          VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT (symbol) DO UPDATE SET price = EXCLUDED.price, change = EXCLUDED.change, change_percent = EXCLUDED.change_percent, updated_at = NOW()`, [symbol, data.price, data.change, data.change_percent]);
      }
      io.emit('indices_update', indices);
    } catch (err) {
      console.warn('Indices job error:', err.message);
    }
  });

  // fetch quotes every 5 minutes (example symbols configurable via env)
  cron.schedule('*/5 * * * *', async () => {
    try {
      const symbolsEnv = process.env.WATCH_SYMBOLS || '';
      const symbols = symbolsEnv.split(',').map(s => s.trim()).filter(Boolean);
      if (!symbols.length) return;
      const quotes = await fetchQuotes(symbols);
      for (const [symbol, q] of Object.entries(quotes)) {
        await pool.query(`INSERT INTO market_quotes (symbol, price, change, change_percent, updated_at)
          VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT (symbol) DO UPDATE SET price = EXCLUDED.price, change = EXCLUDED.change, change_percent = EXCLUDED.change_percent, updated_at = NOW()`, [symbol, q.price, q.change, q.change_percent]);
      }
      io.emit('quotes_update', quotes);
    } catch (err) {
      console.warn('Quotes job error:', err.message);
    }
  });

  // fetch EDIFAR once per day
  cron.schedule('0 2 * * *', async () => {
    try {
      const edifarUrl = process.env.EDIFAR_URL;
      if (!edifarUrl) return;
      const xml = await fetchEdifarXml(edifarUrl);
      const filings = await parseEdifar(xml);
      // Store filings to a table in future; for now, emit event
      io.emit('edifar_update', filings);
    } catch (err) {
      console.warn('EDIFAR job error:', err.message);
    }
  });

  // fetch GMP hourly for configured URLs
  cron.schedule('0 * * * *', async () => {
    try {
      const gmpUrls = (process.env.GMP_URLS || '').split(',').map(s => s.trim()).filter(Boolean);
      const results = {};
      for (const url of gmpUrls) {
        const gmp = await fetchGMP(url);
        results[url] = gmp;
      }
      io.emit('gmp_update', results);
    } catch (err) {
      console.warn('GMP job error:', err.message);
    }
  });

  console.log('Data jobs scheduled');
}
