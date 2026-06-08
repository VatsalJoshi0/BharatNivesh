import axios from 'axios';
import * as cheerio from 'cheerio';
import logger from '../config/logger.js';

export async function fetchLiveIpos() {
  try {
    const url = 'https://www.investorgain.com/report/live-ipo-gmp/331/';
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(data);
    
    const ipos = [];
    $('table tbody tr').each((i, row) => {
      if (i >= 15) return; 
      const cols = $(row).find('td');
      if (cols.length >= 6) {
        const name = $(cols[0]).text().trim().replace(/IPO.*/i, '').trim();
        const price = $(cols[1]).text().trim();
        const gmp = $(cols[2]).text().trim();
        const sub = $(cols[4]).text().trim();
        
        if (name) {
          ipos.push({
            symbol: name.substring(0, 8).toUpperCase().replace(/[^A-Z]/g, ''),
            company_name: name,
            priceMin: parseFloat(price) || 0,
            priceMax: parseFloat(price) || 0,
            gmp: parseFloat(gmp) || 0,
            subscription_count: parseFloat(sub) || 0,
            open_date: new Date().toISOString(),
            close_date: new Date(Date.now() + 3*24*60*60*1000).toISOString(),
          });
        }
      }
    });

    return ipos;
  } catch (error) {
    logger.warn('IPO Scraper failed:', error.message);
    return [];
  }
}
