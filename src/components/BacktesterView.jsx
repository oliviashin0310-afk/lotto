import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Award, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  BarChart,
  Filter,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import LottoBall from './LottoBall';
import { runQuantBacktest } from '../utils/backtestEngine';
import { sound } from '../utils/soundFx';
import confetti from 'canvas-confetti';

export default function BacktesterView({ 
  currentGames = [], 
  onLoadGeneratedGames 
}) {
  const [testGames, setTestGames] = useState(currentGames.length > 0 ? currentGames : [
    { gameLabel: 'A', numbers: [3, 8, 17, 24, 33, 41] },
    { gameLabel: 'B', numbers: [7, 12, 19, 23, 35, 42] }
  ]);
  const [drawCount, setDrawCount] = useState(500);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [backtestResult, setBacktestResult] = useState(null);
  const [logFilterTier, setLogFilterTier] = useState('ALL'); // ALL, 3, 4, 5

  // Keep test games in sync if parent passed new games
  useEffect(() => {
    if (currentGames && currentGames.length > 0) {
      setTestGames(currentGames);
    }
  }, [currentGames]);

  // Run backtest on mount or when games change
  const executeBacktest = () => {
    if (testGames.length === 0) return;
    sound.playLaserSweep();
    setIsRunning(true);
    setProgress(0);

    const stepInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(stepInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 60);

    setTimeout(() => {
      clearInterval(stepInterval);
      setProgress(100);
      const res = runQuantBacktest({
        games: testGames,
        drawCount,
        costPerGame: 1000
      });

      setBacktestResult(res);
      setIsRunning(false);

      if (res && res.netProfit > 0) {
        sound.playJackpot();
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // Ignore
        }
      } else {
        sound.playBallLock(500);
      }
    }, 650);
  };

  useEffect(() => {
    executeBacktest();
  }, [testGames, drawCount]);

  // Filter winning events log
  const filteredEvents = useMemo(() => {
    if (!backtestResult || !backtestResult.topWinningEvents) return [];
    if (logFilterTier === 'ALL') return backtestResult.topWinningEvents;
    const tierNum = Number(logFilterTier);
    return backtestResult.topWinningEvents.filter(e => e.tier <= tierNum);
  }, [backtestResult, logFilterTier]);

  // Equity Curve SVG calculation
  const svgData = useMemo(() => {
    if (!backtestResult || !backtestResult.equityCurve || backtestResult.equityCurve.length < 2) {
      return null;
    }
    const data = backtestResult.equityCurve;
    const netValues = data.map(d => d.net);
    const minNet = Math.min(...netValues, 0);
    const maxNet = Math.max(...netValues, 0);
    const range = (maxNet - minNet) || 1;

    const width = 800;
    const height = 240;
    const padding = 20;

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((d.net - minNet) / range) * (height - padding * 2);
      return { x, y, net: d.net, round: d.round, date: d.date, roi: d.roi };
    });

    const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');

    // Zero line y position
    const zeroY = height - padding - ((0 - minNet) / range) * (height - padding * 2);

    return { points, pathD, zeroY, width, height, minNet, maxNet };
  }, [backtestResult]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel-glow rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono">
              <TrendingUp className="w-3.5 h-3.5 animate-pulse" />
              <span>FINANCIAL BACKTESTING SIMULATOR v4.8</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              역대 회차 <span className="text-cyan-400">가상 수익률 백테스팅</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              추출된 퀀트 번호 조합을 한국 로또 6/45 역대 1,150회 실제 당첨 데이터에 전수 대입하여, 가상 누적 투자금 대비 총 당첨금, 순손익, 투자수익률(ROI), 최대 낙폭(MDD)을 산출합니다.
            </p>
          </div>

          {/* Quick Config */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 block w-full sm:w-auto">백테스팅 기간:</span>
            {[
              { label: '최근 100회', value: 100 },
              { label: '최근 300회', value: 300 },
              { label: '최근 500회', value: 500 },
              { label: '전체 1,150회', value: 1150 }
            ].map(item => (
              <button
                key={item.value}
                onClick={() => {
                  setDrawCount(item.value);
                  sound.playClick();
                }}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all
                  ${drawCount === item.value 
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}
                `}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Target Combinations Strip */}
      <div className="glass-panel rounded-xl p-4 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              현재 백테스팅 대상 조합 ({testGames.length}게임 세트)
            </h2>
          </div>
          <button
            onClick={() => {
              if (onLoadGeneratedGames) onLoadGeneratedGames();
              sound.playClick();
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>생성기에서 최신 번호 다시 불러오기</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {testGames.map((game, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
              <span className="font-mono text-xs font-black text-cyan-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                게임 {game.gameLabel || String.fromCharCode(65 + i)}
              </span>
              <div className="flex items-center gap-1.5">
                {game.numbers.map((n, idx) => (
                  <LottoBall key={idx} number={n} size="sm" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Computing Progress Bar */}
      {isRunning && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/50 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 animate-spin text-cyan-400" />
              <span>역대 {drawCount}회차 당첨 빅데이터 대조 연산 진행중...</span>
            </span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              style={{ width: `${progress}%` }} 
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-300 shadow-md shadow-cyan-500/50"
            ></div>
          </div>
        </div>
      )}

      {/* Main Backtest KPI Cards */}
      {backtestResult && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Invested */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden group">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider">가상 총 투자금 (Capital)</span>
                <DollarSign className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                ₩{backtestResult.totalCost.toLocaleString()}
              </div>
              <div className="mt-2 text-xs text-slate-400 font-mono">
                {backtestResult.drawsCount}회차 × {backtestResult.gamesCount}게임 (회당 1,000원)
              </div>
            </div>

            {/* Total Payout */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden group">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider">총 회수 당첨금 (Payout)</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                ₩{backtestResult.totalPrize.toLocaleString()}
              </div>
              <div className="mt-2 text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <span>총 당첨 횟수:</span>
                <span className="text-cyan-400 font-bold">{backtestResult.winningEventsCount}회 적중</span>
              </div>
            </div>

            {/* Net P&L */}
            <div className={`
              glass-panel p-5 rounded-2xl border relative overflow-hidden group
              ${backtestResult.netProfit >= 0 
                ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/10' 
                : 'border-rose-500/30'}
            `}>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider">가상 순손익 (Net P&L)</span>
                {backtestResult.netProfit >= 0 
                  ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> 
                  : <ArrowDownRight className="w-4 h-4 text-rose-400" />}
              </div>
              <div className={`text-2xl sm:text-3xl font-black font-mono ${backtestResult.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {backtestResult.netProfit >= 0 ? '+' : ''}₩{backtestResult.netProfit.toLocaleString()}
              </div>
              <div className="mt-2 text-xs text-slate-400 font-mono">
                {backtestResult.netProfit >= 0 ? '수익 실현 상태' : '원금 대비 차액'}
              </div>
            </div>

            {/* ROI */}
            <div className={`
              glass-panel p-5 rounded-2xl border relative overflow-hidden group
              ${backtestResult.roi >= 0 ? 'border-cyan-500/40 bg-cyan-950/20' : 'border-slate-800'}
            `}>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider">투자 수익률 (ROI)</span>
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <div className={`text-2xl sm:text-3xl font-black font-mono ${backtestResult.roi >= 0 ? 'text-cyan-400' : 'text-slate-300'}`}>
                {backtestResult.roi >= 0 ? '+' : ''}{backtestResult.roi}%
              </div>
              <div className="mt-2 text-xs font-mono flex items-center justify-between text-slate-400">
                <span>적중률: <strong className="text-white">{backtestResult.hitRate}%</strong></span>
                <span>MDD: <strong>₩{backtestResult.maxDrawdown.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>

          {/* Cumulative Equity Curve Chart */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-cyan-400" />
                  <span>누적 자산 변동 곡선 (Equity Curve)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  시간 흐름에 따른 가상 투자금 투입 대비 당첨금 회수 누적 순손익 추이
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-cyan-400"></span>
                  <span className="text-slate-300">누적 손익 (Net Balance)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 border-t border-dashed border-amber-400"></span>
                  <span className="text-slate-400">손익분기선 (₩0 Break-Even)</span>
                </div>
              </div>
            </div>

            {/* SVG Chart */}
            {svgData ? (
              <div className="w-full overflow-x-auto">
                <div className="min-w-[600px] h-[240px] relative bg-slate-950/70 rounded-xl p-2 border border-slate-800/80">
                  <svg 
                    viewBox={`0 0 ${svgData.width} ${svgData.height}`} 
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Zero Line */}
                    <line
                      x1="0"
                      y1={svgData.zeroY}
                      x2={svgData.width}
                      y2={svgData.zeroY}
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.6"
                    />

                    {/* Area under curve */}
                    <path
                      d={`${svgData.pathD} L ${svgData.width - 20} ${svgData.height - 20} L 20 ${svgData.height - 20} Z`}
                      fill="url(#equityGrad)"
                    />

                    {/* Equity Curve Line */}
                    <path
                      d={svgData.pathD}
                      fill="none"
                      stroke="#00f2fe"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Points */}
                    {svgData.points.map((pt, idx) => (
                      <circle
                        key={idx}
                        cx={pt.x}
                        cy={pt.y}
                        r="3"
                        fill="#060913"
                        stroke="#00f2fe"
                        strokeWidth="2"
                        className="hover:r-5 transition-all cursor-pointer"
                      >
                        <title>{`회차: ${pt.round}회 (${pt.date})\n누적손익: ${pt.net.toLocaleString()}원\n수익률: ${pt.roi}%`}</title>
                      </circle>
                    ))}
                  </svg>
                </div>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-500 font-mono text-sm">
                차트 데이터를 렌더링할 데이터 포인트가 부족합니다.
              </div>
            )}
          </div>

          {/* Tier Breakdown Matrix */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>등수별 당첨 실적 매트릭스 (Prize Tier Breakdown)</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { tier: 1, name: '1등', rule: '6개 일치', avg: '평균 22억원', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
                { tier: 2, name: '2등', rule: '5개+보너스', avg: '평균 5,500만원', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
                { tier: 3, name: '3등', rule: '5개 일치', avg: '평균 145만원', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
                { tier: 4, name: '4등', rule: '4개 일치', avg: '고정 50,000원', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
                { tier: 5, name: '5등', rule: '3개 일치', avg: '고정 5,000원', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
                { tier: 0, name: '낙첨', rule: '2개 이하', avg: '0원', badge: 'bg-slate-800 text-slate-400 border-slate-700' }
              ].map((t) => {
                const count = backtestResult.tierCounts[t.tier] || 0;
                const totalWon = backtestResult.tierPrizes[t.tier] || 0;
                return (
                  <div key={t.tier} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-xs font-black border ${t.badge}`}>
                        {t.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{t.rule}</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-white font-mono block">
                        {count}회
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono block truncate">
                        {t.tier > 0 ? `₩${totalWon.toLocaleString()}` : '소멸'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Matches Log Table */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>당첨 회차 상세 검증 로그 (상위 {filteredEvents.length}건)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  과거 실제 추첨 번호와 내 퀀트 조합의 일치 번호 대조 분석
                </p>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                <span className="text-slate-500 px-2 flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  <span>필터:</span>
                </span>
                {['ALL', '3', '4', '5'].map((val) => (
                  <button
                    key={val}
                    onClick={() => { setLogFilterTier(val); sound.playClick(); }}
                    className={`
                      px-2.5 py-1 rounded font-bold transition-all
                      ${logFilterTier === val 
                        ? 'bg-cyan-500 text-slate-950' 
                        : 'text-slate-400 hover:text-white'}
                    `}
                  >
                    {val === 'ALL' ? '전체' : `${val}등 이상`}
                  </button>
                ))}
              </div>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                      <th className="py-3 px-4">회차 / 일자</th>
                      <th className="py-3 px-4">슬롯</th>
                      <th className="py-3 px-4">당첨 등수</th>
                      <th className="py-3 px-4">획득 당첨금</th>
                      <th className="py-3 px-4">내 조합 번호</th>
                      <th className="py-3 px-4">당시 추첨 번호</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredEvents.map((ev, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-white">{ev.round}회</span>
                          <span className="block text-[10px] text-slate-400">{ev.date}</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-cyan-400">
                          {ev.gameLabel}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`
                            px-2 py-0.5 rounded font-black text-[11px]
                            ${ev.tier === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : ''}
                            ${ev.tier === 2 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : ''}
                            ${ev.tier === 3 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : ''}
                            ${ev.tier === 4 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : ''}
                            ${ev.tier === 5 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : ''}
                          `}>
                            {ev.tierName}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-amber-300">
                          ₩{ev.prize.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {ev.userNumbers.map((n, ni) => (
                              <LottoBall
                                key={ni}
                                number={n}
                                size="xs"
                                isMatched={ev.matchedNumbers.includes(n)}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {ev.drawNumbers.map((n, ni) => (
                              <LottoBall
                                key={ni}
                                number={n}
                                size="xs"
                                isMatched={ev.matchedNumbers.includes(n)}
                              />
                            ))}
                            <span className="text-slate-500 text-xs px-0.5">+</span>
                            <LottoBall
                              number={ev.drawBonus}
                              size="xs"
                              isBonus={true}
                              isMatched={ev.bonusMatched}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 font-mono text-sm bg-slate-950/40 rounded-xl">
                선택한 필터 조건에 해당하는 당첨 내역이 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
