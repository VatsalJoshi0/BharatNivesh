export function calculateRedFlags(ipoData = {}) {
  const flags = [];
  const {
    prospectus = '',
    promoterPledge = 0,
    litigation = 0,
    contingentLiabilities = 0,
    debtToEquity = 0,
    issueSize = 0,
  } = ipoData;

  // Promoter pledge > 50%
  if (promoterPledge > 50) {
    flags.push({
      severity: 'high',
      title: 'High Promoter Pledge',
      description: `${promoterPledge}% of promoter holdings pledged`,
    });
  }

  // Litigation concerns
  if (litigation > 0) {
    flags.push({
      severity: litigation > 5 ? 'high' : 'medium',
      title: 'Ongoing Litigation',
      description: `${litigation} cases ongoing`,
    });
  }

  // Contingent liabilities
  if (contingentLiabilities > 0) {
    flags.push({
      severity: 'medium',
      title: 'Contingent Liabilities',
      description: `₹${contingentLiabilities}Cr at risk`,
    });
  }

  // Debt to equity > 2
  if (debtToEquity > 2) {
    flags.push({
      severity: 'medium',
      title: 'High Debt Ratio',
      description: `D/E ratio: ${debtToEquity.toFixed(2)}`,
    });
  }

  // Issue size analysis
  if (issueSize > 2000) {
    flags.push({
      severity: 'low',
      title: 'Large Issue Size',
      description: `₹${issueSize}Cr (dilution risk)`,
    });
  }

  return flags;
}

export function getVerdictRegular(ipoData = {}) {
  const {
    gmp = 0,
    priceMin = 1,
    subscription = 0,
    sector = '',
  } = ipoData;

  const gmpPercent = ((gmp - priceMin) / priceMin) * 100;
  const score = [];

  if (gmpPercent > 30) score.push(1);
  if (gmpPercent > 50) score.push(1);
  if (subscription > 1.5) score.push(1);
  if (subscription > 3) score.push(1);

  const recommendation = score.length >= 3 ? 'Apply' : score.length >= 2 ? 'Consider' : 'Skip';
  const reason =
    recommendation === 'Apply'
      ? `GMP at ₹${gmp} (+${gmpPercent.toFixed(0)}%), Strong subscription (${subscription.toFixed(1)}x)`
      : recommendation === 'Consider'
        ? `Moderate GMP, Decent subscription`
        : `Weak GMP or subscription`;

  return {
    verdict: recommendation,
    reason,
    confidence: (score.length / 4) * 100,
    action: recommendation === 'Apply' ? 'apply' : recommendation === 'Consider' ? 'alert' : 'skip',
  };
}

export function getVerdictNerd(ipoData = {}) {
  const {
    pe = 0,
    peerAvgPe = 0,
    roe = 0,
    debt = 0,
    equity = 0,
    gmp = 0,
    priceMin = 1,
    issue = 0,
    revenue = 0,
    profitMargin = 0,
  } = ipoData;

  const flags = calculateRedFlags(ipoData);
  const severityCount = flags.filter((f) => f.severity === 'high').length;

  const metrics = {
    peRatio: pe < peerAvgPe * 0.9 ? 'Attractive' : 'Fair',
    roeQuality: roe > 15 ? 'Strong' : 'Moderate',
    debtHealth: debt / equity < 1 ? 'Healthy' : 'Concerning',
    profitability: profitMargin > 10 ? 'Good' : 'Modest',
    valuation: ((gmp - priceMin) / priceMin) * 100,
  };

  const dcfTarget = priceMin * (1 + (roe / 100) * 10);
  const upside = ((dcfTarget - gmp) / gmp) * 100;

  let verdict = 'Hold';
  if (severityCount === 0 && upside > 30 && metrics.peRatio === 'Attractive') {
    verdict = 'Strong Buy';
  } else if (severityCount === 0 && upside > 15) {
    verdict = 'Buy';
  } else if (severityCount > 2) {
    verdict = 'Avoid';
  } else if (upside < -10) {
    verdict = 'Sell';
  }

  return {
    verdict,
    metrics,
    dcfTarget: dcfTarget.toFixed(0),
    upside: upside.toFixed(1),
    redFlags: flags,
    confidence: Math.max(0, 100 - severityCount * 20),
  };
}

export function enrichIpo(ipo = {}, mode = 'regular') {
  const mockData = {
    gmp: 150,
    subscription: 2.5,
    promoterPledge: 35,
    litigation: 1,
    roe: 18,
    peerAvgPe: 22,
    debtToEquity: 0.8,
  };

  const enriched = { ...ipo, ...mockData };

  if (mode === 'nerd') {
    enriched.verdict = getVerdictNerd(enriched);
  } else {
    enriched.verdict = getVerdictRegular(enriched);
  }

  enriched.redFlags = calculateRedFlags(enriched);
  return enriched;
}
