import axios from 'axios';
import xml2js from 'xml2js';

export async function fetchEdifarXml(url) {
  try {
    const res = await axios.get(url, { responseType: 'text' });
    return res.data;
  } catch (err) {
    console.warn('Failed to fetch EDIFAR XML:', err.message);
    return null;
  }
}

export async function parseEdifar(xmlText) {
  if (!xmlText) return [];
  try {
    const parsed = await xml2js.parseStringPromise(xmlText, { explicitArray: false });
    // EDIFAR structures vary; attempt to extract filings
    const filings = [];
    const root = parsed?.EDIFAR || parsed;
    // This is a best-effort extractor for Phase 1; refine as required
    if (root && root.Filing) {
      const items = Array.isArray(root.Filing) ? root.Filing : [root.Filing];
      for (const f of items) {
        filings.push({ company: f.CompanyName || f.companyName || null, date: f.FilingDate || f.filingDate || null, raw: f });
      }
    }
    return filings;
  } catch (err) {
    console.warn('Failed to parse EDIFAR XML:', err.message);
    return [];
  }
}
