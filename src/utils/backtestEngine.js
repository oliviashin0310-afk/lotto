import { HISTORICAL_DRAWS, LOTTO_RULES } from '../data/lottoData';

// Compare single game against a winning draw
export function matchNumbersWithDraw(userNumbers, draw) {
  const drawSet = new Set(draw.numbers);
  const matched = userNumbers.filter(n => drawSet.has(n));
  const matchCount = matched.length;
  const bonusMatched = userNumbers.includes(draw.bonus);

  let tier = 0; // 0 = miss
  let prize = 0;

  if (matchCount === 6) {
    tier = 1;
    prize = draw.prize1st || LOTTO_RULES.PRIZES[1].avgAmount;
  } else if (matchCount === 5 && bonusMatched) {
    tier = 2;
    prize = LOTTO_RULES.PRIZES[2].avgAmount;
  } else if (matchCount === 5) {
    tier = 3;
    prize = LOTTO_RULES.PRIZES[3].avgAmount;
  } else if (matchCount === 4) {
    tier = 4;
    prize = LOTTO_RULES.PRIZES[4].avgAmount;
  } else if (matchCount === 3) {
    tier = 5;
    prize = LOTTO_RULES.PRIZES[5].avgAmount;
  }

  return {
    tier,
    tierName: LOTTO_RULES.PRIZES[tier].name,
    prize,
    matchCount,
    bonusMatched,
    matchedNumbers: matched
  };
}

// Full Historical Backtester
export function runQuantBacktest({
  games = [], // array of { numbers: [..], gameLabel: 'A' }
  drawCount = 500, // 50, 100, 300, 500, 1150
  costPerGame = 1000
}) {
  if (!games || games.length === 0) {
    return null;
  }

  // Slice historical draws (newest first, or chronological for equity curve)
  const targetDraws = HISTORICAL_DRAWS.slice(0, Math.min(drawCount, HISTORICAL_DRAWS.length));
  // Reverse to chronological (oldest to newest) for equity curve progression
  const chronologicalDraws = [...targetDraws].reverse();

  let cumulativeCost = 0;
  let cumulativePrize = 0;
  let peakBalance = 0;
  let maxDrawdown = 0;

  const tierCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 0: 0 };
  const tierPrizes = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const winningEvents = [];
  const equityCurve = [];

  // Step sampling for equity curve if draws are large
  const step = Math.max(1, Math.floor(chronologicalDraws.length / 50));

  chronologicalDraws.forEach((draw, index) => {
    let roundPrize = 0;
    const roundCost = games.length * costPerGame;
    cumulativeCost += roundCost;

    games.forEach((game) => {
      const match = matchNumbersWithDraw(game.numbers, draw);
      tierCounts[match.tier]++;

      if (match.tier > 0) {
        tierPrizes[match.tier] += match.prize;
        roundPrize += match.prize;

        winningEvents.push({
          round: draw.round,
          date: draw.date,
          gameLabel: game.gameLabel || 'A',
          userNumbers: game.numbers,
          drawNumbers: draw.numbers,
          drawBonus: draw.bonus,
          matchedNumbers: match.matchedNumbers,
          bonusMatched: match.bonusMatched,
          tier: match.tier,
          tierName: match.tierName,
          prize: match.prize
        });
      }
    });

    cumulativePrize += roundPrize;
    const currentBalance = cumulativePrize - cumulativeCost;

    // Track peak and Max Drawdown (MDD)
    if (currentBalance > peakBalance) {
      peakBalance = currentBalance;
    }
    const currentDrawdown = peakBalance - currentBalance;
    if (currentDrawdown > maxDrawdown) {
      maxDrawdown = currentDrawdown;
    }

    // Sample equity point
    if (index % step === 0 || index === chronologicalDraws.length - 1) {
      equityCurve.push({
        round: draw.round,
        date: draw.date,
        cost: cumulativeCost,
        prize: cumulativePrize,
        net: currentBalance,
        roi: cumulativeCost > 0 ? ((currentBalance / cumulativeCost) * 100).toFixed(1) : '0'
      });
    }
  });

  const totalGamesPlayed = targetDraws.length * games.length;
  const totalWinningGames = tierCounts[1] + tierCounts[2] + tierCounts[3] + tierCounts[4] + tierCounts[5];
  const hitRate = totalGamesPlayed > 0 ? ((totalWinningGames / totalGamesPlayed) * 100).toFixed(2) : '0';
  const netProfit = cumulativePrize - cumulativeCost;
  const roi = cumulativeCost > 0 ? ((netProfit / cumulativeCost) * 100).toFixed(2) : '0';

  // Sort winning events: highest tier first, then newest
  winningEvents.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier; // 1 is highest
    return b.round - a.round;
  });

  const bestRound = winningEvents.length > 0 ? winningEvents[0] : null;

  return {
    drawsCount: targetDraws.length,
    gamesCount: games.length,
    totalGamesPlayed,
    totalCost: cumulativeCost,
    totalPrize: cumulativePrize,
    netProfit,
    roi: parseFloat(roi),
    hitRate: parseFloat(hitRate),
    maxDrawdown,
    tierCounts,
    tierPrizes,
    bestRound,
    winningEventsCount: winningEvents.length,
    topWinningEvents: winningEvents.slice(0, 20),
    equityCurve
  };
}
