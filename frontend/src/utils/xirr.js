export function calculateXIRR(cashFlows) {
  if (cashFlows.length < 2) return 0;

  const hasNegative = cashFlows.some(cf => cf.amount < 0);
  const hasPositive = cashFlows.some(cf => cf.amount > 0);
  if (!hasNegative || !hasPositive) return 0;

  const maxIterations = 100;
  const tolerance = 1e-6;
  let guess = 0.1;

  const yearsDiff = (d1, d2) => {
    return (d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24 * 365);
  };

  const firstDate = cashFlows[0].date;

  const xirrEquation = (r) => {
    let sum = 0;
    for (const cf of cashFlows) {
      const t = yearsDiff(cf.date, firstDate);
      sum += cf.amount / Math.pow(1 + r, t);
    }
    return sum;
  };

  const xirrDerivative = (r) => {
    let sum = 0;
    for (const cf of cashFlows) {
      const t = yearsDiff(cf.date, firstDate);
      sum -= t * cf.amount / Math.pow(1 + r, t + 1);
    }
    return sum;
  };

  for (let i = 0; i < maxIterations; i++) {
    const eqVal = xirrEquation(guess);
    const derivVal = xirrDerivative(guess);
    if (Math.abs(derivVal) < 1e-12) break;
    
    const nextGuess = guess - eqVal / derivVal;
    if (Math.abs(nextGuess - guess) < tolerance) {
      return nextGuess * 100;
    }
    guess = nextGuess;
  }

  return guess * 100;
}
