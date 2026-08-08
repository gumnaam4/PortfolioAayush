// api/market.js — Server-side market data proxy
// Fetches quotes from Yahoo Finance (no API key required). Returns normalized data.

const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
  try {
    const qs = req.query.symbols || req.url.split('?')[1] || '';
    // Expect symbols as comma-separated string, e.g. ^NSEI,^BSESN,INFY.NS
    const symbols = (Array.isArray(req.query.symbols) ? req.query.symbols.join(',') : String(req.query.symbols || '')).trim();
    if (!symbols) {
      return res.status(400).json({ error: 'Missing symbols parameter' });
    }

    // Use Yahoo Finance quote endpoint
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'Portfolio/1.0' } });
    if (!r.ok) return res.status(502).json({ error: 'Failed to fetch market data' });
    const data = await r.json();
    const results = (data.quoteResponse && data.quoteResponse.result) || [];

    const norm = results.map(q => ({
      symbol: q.symbol,
      name: q.longName || q.shortName || q.displayName || '',
      price: q.regularMarketPrice ?? null,
      change: q.regularMarketChange ?? null,
      changePercent: q.regularMarketChangePercent ?? null,
      marketState: q.marketState || null,
      currency: q.currency || null,
      exchange: q.fullExchangeName || q.exchange || null,
      lastUpdate: q.regularMarketTime ? new Date(q.regularMarketTime * 1000).toISOString() : null,
      raw: q
    }));

    // Include a note about possible delays
    return res.status(200).json({ note: 'Prices may be delayed depending on source.', data: norm });
  } catch (err) {
    console.error('Market proxy error:', err.message);
    return res.status(500).json({ error: 'Server error fetching market data' });
  }
};
