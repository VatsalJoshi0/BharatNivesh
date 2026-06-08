import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchGMP(url) {
  try {
    const res = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(res.data);
    // Best-effort selectors; may need adapting per site
    const gmpText = $('body').text().match(/GMP\s*[:\-]\s*([0-9,\.\-]+)/i);
    if (gmpText && gmpText[1]) return Number(gmpText[1].replace(/,/g, ''));

    // Try common spans
    const alt = $('[class*=gmp], .gmp, .grey-market-premium').first().text();
    if (alt) return Number(alt.replace(/[^0-9\-\.]/g, ''));

    return null;
  } catch (err) {
    console.warn('GMP fetch failed:', err.message);
    return null;
  }
}
