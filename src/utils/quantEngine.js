import { HISTORICAL_DRAWS, getLottoStatistics } from '../data/lottoData';

// Calculate Arithmetic Complexity (AC Value)
export function calculateACValue(numbers) {
  if (!numbers || numbers.length !== 6) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const diffs = new Set();
  
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      diffs.add(sorted[j] - sorted[i]);
    }
  }
  
  // Total pairs is 15. AC = distinct differences - (N - 1)
  return Math.max(0, diffs.size - (sorted.length - 1));
}

// Calculate consecutive number pairs count
export function calculateConsecutivePairs(numbers) {
  if (!numbers || numbers.length < 2) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  let count = 0;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1] - sorted[i] === 1) {
      count++;
    }
  }
  return count;
}

// Comprehensive Quant Combination Evaluator
export function evaluateCombination(numbers) {
  if (!numbers || numbers.length !== 6) {
    return {
      score: 0,
      grade: 'N/A',
      sum: 0,
      oddEven: '0:0',
      highLow: '0:0',
      acValue: 0,
      consecutiveCount: 0,
      colorCoverage: 0,
      radarMetrics: { sumScore: 0, balanceScore: 0, entropyScore: 0, momentumScore: 0, varianceScore: 0 },
      badges: []
    };
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, curr) => acc + curr, 0);

  // Odd / Even
  const oddCount = sorted.filter(n => n % 2 !== 0).length;
  const evenCount = 6 - oddCount;

  // High / Low (Low: 1~22, High: 23~45)
  const lowCount = sorted.filter(n => n <= 22).length;
  const highCount = 6 - lowCount;

  // AC Value & Consecutive pairs
  const acValue = calculateACValue(sorted);
  const consecutiveCount = calculateConsecutivePairs(sorted);

  // Color coverage (5 zones)
  const zones = new Set();
  sorted.forEach(n => {
    if (n <= 10) zones.add(1);
    else if (n <= 20) zones.add(2);
    else if (n <= 30) zones.add(3);
    else if (n <= 40) zones.add(4);
    else zones.add(5);
  });
  const colorCoverage = zones.size;

  // Sub-scores (0-100 each)
  // 1. Sum score: Optimal bell-curve center is ~138, optimal range 105 ~ 170
  let sumScore = 100 - Math.min(100, Math.abs(sum - 138) * 1.6);
  if (sumScore < 0) sumScore = 0;

  // 2. Odd-even balance score
  let balanceScore = 60;
  if (oddCount === 3) balanceScore = 100;
  else if (oddCount === 2 || oddCount === 4) balanceScore = 85;
  else if (oddCount === 1 || oddCount === 5) balanceScore = 40;
  else balanceScore = 15;

  // 3. High-low balance score
  let highLowScore = 60;
  if (lowCount === 3) highLowScore = 100;
  else if (lowCount === 2 || lowCount === 4) highLowScore = 85;
  else highLowScore = 45;

  // 4. AC Complexity score (AC >= 7 is ideal, AC 6 is good, < 5 is bad)
  let acScore = 50;
  if (acValue >= 8) acScore = 100;
  else if (acValue === 7) acScore = 90;
  else if (acValue === 6) acScore = 75;
  else if (acValue === 5) acScore = 55;
  else acScore = 20;

  // 5. Consecutive score (0 or 1 pair is standard, 2+ is low)
  let consecutiveScore = 100;
  if (consecutiveCount === 1) consecutiveScore = 90;
  else if (consecutiveCount === 2) consecutiveScore = 55;
  else if (consecutiveCount > 2) consecutiveScore = 20;

  // 6. Color coverage score (3 to 4 colors is ideal)
  let colorScore = (colorCoverage / 5) * 100;

  // Total Composite Quant Score
  const totalScore = Math.round(
    sumScore * 0.25 +
    balanceScore * 0.20 +
    acScore * 0.25 +
    highLowScore * 0.15 +
    consecutiveScore * 0.15
  );

  let grade = 'QUANT B';
  let gradeColor = 'text-blue-400 border-blue-500/30 bg-blue-500/10';
  if (totalScore >= 92) {
    grade = 'QUANT ALPHA S+';
    gradeColor = 'text-amber-400 border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/20';
  } else if (totalScore >= 82) {
    grade = 'QUANT S';
    gradeColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 shadow-md shadow-emerald-500/20';
  } else if (totalScore >= 72) {
    grade = 'QUANT A';
    gradeColor = 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
  }

  // Badges
  const badges = [];
  if (sum >= 110 && sum <= 165) badges.push('골든 썸(110~165)');
  if (oddCount === 3) badges.push('퍼펙트 홀짝(3:3)');
  if (acValue >= 7) badges.push(`고산술 복잡도(AC ${acValue})`);
  if (colorCoverage >= 4) badges.push('황금 섹터 분산(4구간+)');
  if (consecutiveCount <= 1) badges.push('연속수 이상 제어');

  return {
    score: totalScore,
    grade,
    gradeColor,
    sum,
    oddEven: `${oddCount}:${evenCount}`,
    highLow: `${lowCount}:${highCount}`,
    acValue,
    consecutiveCount,
    colorCoverage,
    radarMetrics: {
      sumScore: Math.round(sumScore),
      balanceScore: Math.round(balanceScore),
      entropyScore: Math.round(acScore),
      highLowScore: Math.round(highLowScore),
      spreadScore: Math.round(colorScore)
    },
    badges
  };
}

// Strategy Weights Generator
function buildNumberWeights(strategy, stats) {
  const weights = Array.from({ length: 46 }, () => 1.0);
  
  if (strategy === 'ALPHA_QUANT') {
    // Quant alpha: favor historical balanced frequency, penalize extreme extremes
    stats.numberStats.forEach(st => {
      // Moderate weight based on historical frequency
      weights[st.number] = 0.8 + (st.frequency / stats.totalDraws) * 3.0;
    });
  } else if (strategy === 'COLD_CATCHER') {
    // Mean reversion: boost numbers with high absence (미출현 번호 우선 가중치)
    stats.numberStats.forEach(st => {
      const absenceBonus = Math.min(4.0, 1.0 + (st.absenceCount / 10));
      weights[st.number] = absenceBonus;
    });
  } else if (strategy === 'HOT_MOMENTUM') {
    // Trend following: boost numbers that appeared often in recent 20 draws
    const recent20 = HISTORICAL_DRAWS.slice(0, 20);
    const recentFreq = Array.from({ length: 46 }, () => 0);
    recent20.forEach(d => d.numbers.forEach(n => recentFreq[n]++));
    for (let n = 1; n <= 45; n++) {
      weights[n] = 0.5 + recentFreq[n] * 1.5;
    }
  } else if (strategy === 'MONTE_CARLO') {
    // Pure balanced entropy with micro-jitter
    for (let n = 1; n <= 45; n++) {
      weights[n] = 1.0 + Math.random() * 0.2;
    }
  }

  return weights;
}

// Single candidate generator with weighted selection
function pickWeightedNumbers(weights, fixedNumbers, excludedNumbers) {
  const availablePool = [];
  for (let n = 1; n <= 45; n++) {
    if (!excludedNumbers.includes(n) && !fixedNumbers.includes(n)) {
      availablePool.push(n);
    }
  }

  const result = [...fixedNumbers];
  const needed = 6 - result.length;

  for (let i = 0; i < needed; i++) {
    if (availablePool.length === 0) break;

    // Calculate sum of weights for available pool
    const totalWeight = availablePool.reduce((sum, n) => sum + weights[n], 0);
    let randomVal = Math.random() * totalWeight;

    let pickedIdx = 0;
    for (let j = 0; j < availablePool.length; j++) {
      randomVal -= weights[availablePool[j]];
      if (randomVal <= 0) {
        pickedIdx = j;
        break;
      }
    }

    result.push(availablePool[pickedIdx]);
    availablePool.splice(pickedIdx, 1);
  }

  return result.sort((a, b) => a - b);
}

// Main Generation Function
export function generateQuantCombinations({
  count = 5,
  strategy = 'ALPHA_QUANT',
  fixedNumbers = [],
  excludedNumbers = [],
  sumRange = [100, 175],
  oddEvenFilter = 'BALANCED', // 'ANY' | '3:3' | 'BALANCED' (2:4, 3:3, 4:2)
  maxConsecutive = 1,
  minAC = 6,
  monteCarloIterations = 5000
}) {
  const stats = getLottoStatistics();
  const weights = buildNumberWeights(strategy, stats);

  const results = [];
  const maxAttempts = 2000;

  for (let gameIndex = 0; gameIndex < count; gameIndex++) {
    let bestCandidate = null;
    let bestScore = -1;

    // If strategy is MONTE_CARLO, run iterations to find highest scored candidate
    const iterations = strategy === 'MONTE_CARLO' ? Math.min(monteCarloIterations, 1000) : 50;

    for (let attempt = 0; attempt < iterations; attempt++) {
      const candidate = pickWeightedNumbers(weights, fixedNumbers, excludedNumbers);
      if (candidate.length !== 6) continue;

      const evalData = evaluateCombination(candidate);

      // Filter checks
      const [sumMin, sumMax] = sumRange;
      if (evalData.sum < sumMin || evalData.sum > sumMax) {
        // In loose mode, don't strictly drop if hard to find, but reduce score
        if (attempt < iterations - 5) continue;
      }

      // Odd:Even filter
      const [odds] = evalData.oddEven.split(':').map(Number);
      if (oddEvenFilter === '3:3' && odds !== 3) {
        if (attempt < iterations - 5) continue;
      } else if (oddEvenFilter === 'BALANCED' && (odds < 2 || odds > 4)) {
        if (attempt < iterations - 5) continue;
      }

      // Max consecutive
      if (maxConsecutive !== 'ANY' && evalData.consecutiveCount > maxConsecutive) {
        if (attempt < iterations - 5) continue;
      }

      // Min AC
      if (minAC && evalData.acValue < minAC) {
        if (attempt < iterations - 5) continue;
      }

      // Check if this candidate is better
      if (evalData.score > bestScore) {
        bestScore = evalData.score;
        bestCandidate = {
          gameLabel: String.fromCharCode(65 + gameIndex), // A, B, C, D, E
          numbers: candidate,
          evaluation: evalData,
          strategy,
          timestamp: new Date().toISOString()
        };
      }

      // In fast modes, break early if score is top tier
      if (strategy !== 'MONTE_CARLO' && bestScore >= 88) {
        break;
      }
    }

    // Fallback if filters were too strict
    if (!bestCandidate) {
      const fallback = pickWeightedNumbers(weights, fixedNumbers, excludedNumbers);
      bestCandidate = {
        gameLabel: String.fromCharCode(65 + gameIndex),
        numbers: fallback,
        evaluation: evaluateCombination(fallback),
        strategy,
        timestamp: new Date().toISOString()
      };
    }

    results.push(bestCandidate);
  }

  return results;
}
