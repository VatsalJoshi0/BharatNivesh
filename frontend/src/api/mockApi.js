export async function fetchMarketOverview() {
  const response = await fetch('/api/v1/market/overview');
  if (!response.ok) {
    throw new Error('Unable to load market overview');
  }
  return response.json();
}

export async function fetchUpcomingIpos() {
  const response = await fetch('/api/v1/ipo/upcoming');
  if (!response.ok) {
    throw new Error('Unable to load IPO data');
  }
  return response.json();
}

export async function fetchIpoSubscriptions() {
  const response = await fetch('/api/v1/ipo/subscriptions');
  if (!response.ok) {
    throw new Error('Unable to load IPO subscription data');
  }
  return response.json();
}

export async function fetchMarketAnalysis() {
  const response = await fetch('/api/v1/market/analysis');
  if (!response.ok) {
    throw new Error('Unable to load market analysis');
  }
  return response.json();
}

export async function fetchSipSuggestions() {
  const response = await fetch('/api/v1/sip/suggestions');
  if (!response.ok) {
    throw new Error('Unable to load SIP suggestions');
  }
  return response.json();
}
