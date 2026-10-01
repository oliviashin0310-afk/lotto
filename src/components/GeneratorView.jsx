import React, { useState } from 'react';
import { 
  Zap, 
  Sliders, 
  RotateCcw, 
  TrendingUp, 
  Bookmark, 
  Copy, 
  Check, 
  Printer, 
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Flame,
  Snowflake,
  Activity,
  Cpu
} from 'lucide-react';
import LottoBall from './LottoBall';
import { generateQuantCombinations } from '../utils/quantEngine';
import { sound } from '../utils/soundFx';
import confetti from 'canvas-confetti';

export default function GeneratorView({ 
  onRunBacktestWithGames, 
  onSaveGame, 
  onOpenTicketModal 
}) {
  // Config state
  const [strategy, setStrategy] = useState('ALPHA_QUANT');
  const [gameCount, setGameCount] = useState(5);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [fixedNumbers, setFixedNumbers] = useState([]);
  const [excludedNumbers, setExcludedNumbers] = useState([]);
  const [sumRange, setSumRange] = useState([100, 175]);
  const [oddEvenFilter, setOddEvenFilter] = useState('BALANCED');
  const [maxConsecutive, setMaxConsecutive] = useState(1);
  const [minAC, setMinAC] = useState(6);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGames, setGeneratedGames] = useState(() => 
    generateQuantCombinations({ count: 5, strategy: 'ALPHA_QUANT' })
  );
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [savedSuccessIndex, setSavedSuccessIndex] = useState(null);

  // Toggle fixed number
  const toggleFixed = (num) => {
    sound.playClick();
    if (fixedNumbers.includes(num)) {
      setFixedNumbers(fixedNumbers.filter(n => n !== num));
    } else {
      if (fixedNumbers.length >= 5) {
        alert('고정수는 최대 5개까지 지정할 수 있습니다.');
        return;
      }
      setExcludedNumbers(excludedNumbers.filter(n => n !== num));
      setFixedNumbers([...fixedNumbers, num].sort((a, b) => a - b));
    }
  };

  // Toggle excluded number
  const toggleExcluded = (num) => {
    sound.playClick();
    if (excludedNumbers.includes(num)) {
      setExcludedNumbers(excludedNumbers.filter(n => n !== num));
    } else {
      if (excludedNumbers.length >= 39) {
        alert('제외수는 최대 39개까지 지정할 수 있습니다.');
        return;
      }
      setFixedNumbers(fixedNumbers.filter(n => n !== num));
      setExcludedNumbers([...excludedNumbers, num].sort((a, b) => a - b));
    }
  };

  // Run generator with visual and audio suspense
  const handleGenerate = () => {
    sound.playLaserSweep();
    setIsGenerating(true);

    let step = 0;
    const interval = setInterval(() => {
      sound.playBallLock(400 + step * 40);
      step++;
      if (step >= 6) {
        clearInterval(interval);
        const results = generateQuantCombinations({
          count: gameCount,
          strategy,
          fixedNumbers,
          excludedNumbers,
          sumRange,
          oddEvenFilter,
          maxConsecutive,
          minAC
        });

        setGeneratedGames(results);
        setIsGenerating(false);

        // Check if top score achieved
        if (results.some(r => r.evaluation.score >= 90)) {
          sound.playJackpot();
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 }
            });
          } catch {
            // Ignore
          }
        }
      }
    }, 120);
  };

  // Copy single game numbers
  const handleCopyNumbers = (game, index) => {
    sound.playClick();
    const text = `[QUANT LOTTO] 게임 ${game.gameLabel}: ${game.numbers.join(', ')} (퀀트점수: ${game.evaluation.score}점)`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  // Copy all games
  const handleCopyAll = () => {
    sound.playClick();
    const text = generatedGames
      .map(g => `게임 ${g.gameLabel}: ${g.numbers.map(n => String(n).padStart(2, '0')).join(', ')} [${g.evaluation.grade} ${g.evaluation.score}점]`)
      .join('\n');
    navigator.clipboard.writeText(text);
    alert('전체 퀀트 번호 조합이 클립보드에 복사되었습니다.');
  };

  // Save single game
  const handleSave = (game, index) => {
    sound.playClick();
    onSaveGame(game);
    setSavedSuccessIndex(index);
    setTimeout(() => setSavedSuccessIndex(null), 1800);
  };

  // Save all games
  const handleSaveAll = () => {
    sound.playClick();
    generatedGames.forEach(g => onSaveGame(g));
    alert(`${generatedGames.length}개 게임 조합이 보관함에 안전하게 저장되었습니다.`);
  };

  const strategies = [
    {
      id: 'ALPHA_QUANT',
      name: 'QUANT ALPHA',
      sub: '통계 최적화 모드',
      desc: '역대 1등 당첨번호 통계 가중치, 정규분포 총합, AC 6+ 산술 복잡도, 홀짝 균형 완벽 적용',
      icon: Cpu,
      color: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/40 text-cyan-300'
    },
    {
      id: 'COLD_CATCHER',
      name: 'COLD CATCHER',
      sub: '미출현 반등 모드',
      desc: '장기 미출현 번호의 평균 회귀(Mean Reversion) 이론 기반 가중치 추출 알고리즘',
      icon: Snowflake,
      color: 'from-blue-500/20 to-indigo-600/20 border-blue-500/40 text-blue-300'
    },
    {
      id: 'HOT_MOMENTUM',
      name: 'HOT MOMENTUM',
      sub: '핫 모멘텀 모드',
      desc: '최근 20회차 최다 출현 번호의 상승 모멘텀(Trend Following) 추세 추종 알고리즘',
      icon: Flame,
      color: 'from-rose-500/20 to-amber-600/20 border-rose-500/40 text-rose-300'
    },
    {
      id: 'MONTE_CARLO',
      name: 'MONTE CARLO PRO',
      sub: '몬테카를로 시뮬레이션',
      desc: '5,000회 무작위 시뮬레이션을 가동하여 수학적 엔트로피가 가장 이상적인 조합 선별',
      icon: Activity,
      color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40 text-emerald-300'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Engine Status */}
      <div className="glass-panel-glow rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>ALGORITHMIC LOTTERY QUANT ENGINE v4.8</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              로또 6/45 <span className="text-cyan-400">퀀트 번호 생성 엔진</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              단순 무작위 추첨이 아닌, 역대 1,150회차 당첨 빅데이터 통계, 산술적 복잡도(AC), 정규분포 총합, 홀짝 균형 지수를 적용하여 수학적으로 승률을 극대화한 알고리즘 조합을 추출합니다.
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-3 gap-3 font-mono text-center">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="block text-xs text-slate-400">역대 데이터셋</span>
              <span className="text-lg font-bold text-cyan-400">1,150회</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="block text-xs text-slate-400">최적 총합 구간</span>
              <span className="text-lg font-bold text-amber-400">100~175</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="block text-xs text-slate-400">산술 복잡도(AC)</span>
              <span className="text-lg font-bold text-emerald-400">≥ 6 Target</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Selection Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>생성 전략 알고리즘 선택 (QUANT STRATEGY)</span>
          </label>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">게임 수:</span>
            {[1, 3, 5].map((cnt) => (
              <button
                key={cnt}
                onClick={() => { setGameCount(cnt); sound.playClick(); }}
                className={`
                  px-2.5 py-1 rounded text-xs font-bold transition-all
                  ${gameCount === cnt 
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'}
                `}
              >
                {cnt}게임
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {strategies.map((strat) => {
            const Icon = strat.icon;
            const isSelected = strategy === strat.id;
            return (
              <div
                key={strat.id}
                onClick={() => { setStrategy(strat.id); sound.playClick(); }}
                className={`
                  p-4 rounded-xl border cursor-pointer transition-all duration-200 relative overflow-hidden group
                  ${isSelected 
                    ? `bg-gradient-to-br ${strat.color} shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/50` 
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'}
                `}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 animate-ping"></div>
                )}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-wide">{strat.name}</h2>
                    <span className="text-[11px] text-cyan-400/90 font-medium">{strat.sub}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {strat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advanced Quant Filters Accordion */}
      <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
        <button
          onClick={() => { setIsFilterOpen(!isFilterOpen); sound.playClick(); }}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-white">퀀트 고급 필터 매트릭스 (고정수, 제외수, 총합, 홀짝 제어)</span>
            {(fixedNumbers.length > 0 || excludedNumbers.length > 0) && (
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                고정 {fixedNumbers.length}개 / 제외 {excludedNumbers.length}개 적용중
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
            <span>{isFilterOpen ? '필터 닫기' : '필터 열기'}</span>
            {isFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isFilterOpen && (
          <div className="p-5 border-t border-slate-800/80 bg-slate-950/40 space-y-6">
            {/* Fixed Numbers (고정수) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>고정수 지정 (반드시 포함할 번호, 최대 5개)</span>
                  <span className="text-cyan-400 font-mono">[{fixedNumbers.length}/5]</span>
                </label>
                {fixedNumbers.length > 0 && (
                  <button
                    onClick={() => setFixedNumbers([])}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    고정수 초기화
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 max-h-36 overflow-y-auto">
                {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
                  const isFixed = fixedNumbers.includes(num);
                  const isExcluded = excludedNumbers.includes(num);
                  return (
                    <button
                      key={num}
                      disabled={isExcluded}
                      onClick={() => toggleFixed(num)}
                      className={`
                        w-8 h-8 rounded-lg text-xs font-bold font-mono transition-all
                        ${isFixed 
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/40 font-black scale-105' 
                          : isExcluded 
                            ? 'bg-slate-900 text-slate-700 cursor-not-allowed opacity-30' 
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}
                      `}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Excluded Numbers (제외수) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  <span>제외수 지정 (완전 배제할 번호)</span>
                  <span className="text-rose-400 font-mono">[{excludedNumbers.length}개 제외됨]</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      // Exclude last round benchmark numbers [3, 8, 17, 24, 33, 41]
                      setExcludedNumbers([3, 8, 17, 24, 33, 41]);
                      sound.playClick();
                    }}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    직전 회차 번호 일괄 제외
                  </button>
                  {excludedNumbers.length > 0 && (
                    <button
                      onClick={() => setExcludedNumbers([])}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      제외수 초기화
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 max-h-36 overflow-y-auto">
                {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
                  const isFixed = fixedNumbers.includes(num);
                  const isExcluded = excludedNumbers.includes(num);
                  return (
                    <button
                      key={num}
                      disabled={isFixed}
                      onClick={() => toggleExcluded(num)}
                      className={`
                        w-8 h-8 rounded-lg text-xs font-bold font-mono transition-all
                        ${isExcluded 
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/40 font-black line-through' 
                          : isFixed 
                            ? 'bg-slate-900 text-slate-700 cursor-not-allowed opacity-30' 
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}
                      `}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Other Quant Filters: Odd/Even, Max Consecutive, Min AC */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">홀짝 비율 필터</label>
                <select
                  value={oddEvenFilter}
                  onChange={(e) => setOddEvenFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="BALANCED">황금 균형 (2:4 / 3:3 / 4:2) - 81% 출현</option>
                  <option value="3:3">엄격한 3:3 대칭</option>
                  <option value="ANY">제한 없음 (자유)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">연속 번호 제한</label>
                <select
                  value={maxConsecutive}
                  onChange={(e) => setMaxConsecutive(e.target.value === 'ANY' ? 'ANY' : Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value={1}>최대 1쌍 이하 (권장)</option>
                  <option value={0}>연속 번호 완전 배제 (0쌍)</option>
                  <option value="ANY">제한 없음</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">산술 복잡도 (AC값)</label>
                <select
                  value={minAC}
                  onChange={(e) => setMinAC(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value={6}>AC 6 이상 (권장 - 1등 90% 이상)</option>
                  <option value={7}>AC 7 이상 (고난도 복잡 분산)</option>
                  <option value={5}>AC 5 이상 (기본 분산)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Big Generate Button */}
      <div className="flex flex-col items-center justify-center pt-2">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`
            relative group px-10 py-5 rounded-2xl font-black text-lg sm:text-xl tracking-wider uppercase
            flex items-center gap-3 transition-all duration-300
            ${isGenerating 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-400/60 hover:scale-[1.02] active:scale-[0.98]'}
          `}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
          <span className="relative flex items-center gap-3 font-mono">
            {isGenerating ? (
              <>
                <RotateCcw className="w-6 h-6 animate-spin text-cyan-400" />
                <span>퀀트 알고리즘 5,000회 시뮬레이션 연산중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
                <span>QUANT 번호 추출 시뮬레이션 가동</span>
              </>
            )}
          </span>
        </button>
        <span className="mt-2 text-xs font-mono text-slate-500">
          * 실시간 1,150회 빅데이터 가중치 매트릭스 동기화 완료
        </span>
      </div>

      {/* Generated Games Section */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"></span>
              <span>퀀트 추출 번호 조합 ({generatedGames.length}게임)</span>
            </h2>
            <p className="text-xs text-slate-400">
              각 조합별 종합 퀀트 스코어 및 5대 세부 지표 분석 완료
            </p>
          </div>

          {/* Bulk Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAll}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              <span>전체 보관함 저장</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onOpenTicketModal(generatedGames);
              }}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-xs font-bold text-amber-300 hover:border-amber-400 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>공식 티켓 발행</span>
            </button>
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>전체 복사</span>
            </button>
          </div>
        </div>

        {/* Game Cards List */}
        <div className="space-y-3">
          {generatedGames.map((game, index) => {
            const evalData = game.evaluation;
            const isSaved = savedSuccessIndex === index;
            const isCopied = copiedIndex === index;

            return (
              <div
                key={index}
                className="glass-panel rounded-xl p-4 sm:p-5 border border-slate-800/80 hover:border-cyan-500/30 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Game Slot + Balls */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-black text-sm text-cyan-400 shadow-inner">
                        {game.gameLabel}
                      </div>
                      <span className="text-xs font-bold text-slate-400 font-mono hidden sm:inline">
                        SLOT {game.gameLabel}
                      </span>
                    </div>

                    {/* 6 Lotto Balls */}
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      {game.numbers.map((num, i) => (
                        <LottoBall
                          key={i}
                          number={num}
                          size="md"
                          showAnimation={isGenerating}
                          animDelay={i * 80}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Middle: Quant Metrics */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-mono text-xs text-slate-400">
                    {/* Score Badge */}
                    <div className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1.5 ${evalData.gradeColor}`}>
                      <Sparkles className="w-3 h-3" />
                      <span>{evalData.grade}</span>
                      <span className="text-sm font-black">{evalData.score}점</span>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/60">
                      <div>
                        <span className="text-slate-500 text-[10px] block">총합</span>
                        <span className="font-bold text-slate-200">{evalData.sum}</span>
                      </div>
                      <span className="text-slate-700">|</span>
                      <div>
                        <span className="text-slate-500 text-[10px] block">홀:짝</span>
                        <span className="font-bold text-slate-200">{evalData.oddEven}</span>
                      </div>
                      <span className="text-slate-700">|</span>
                      <div>
                        <span className="text-slate-500 text-[10px] block">고:저</span>
                        <span className="font-bold text-slate-200">{evalData.highLow}</span>
                      </div>
                      <span className="text-slate-700">|</span>
                      <div>
                        <span className="text-slate-500 text-[10px] block">AC값</span>
                        <span className="font-bold text-cyan-400">{evalData.acValue}</span>
                      </div>
                      <span className="text-slate-700">|</span>
                      <div>
                        <span className="text-slate-500 text-[10px] block">연속수</span>
                        <span className="font-bold text-slate-200">{evalData.consecutiveCount}쌍</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center">
                    {/* Jump to Backtester */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        onRunBacktestWithGames([game]);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="이 조합으로 역대 1,150회 가상 백테스팅 실행"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>백테스팅</span>
                    </button>

                    {/* Save to Vault */}
                    <button
                      onClick={() => handleSave(game, index)}
                      className={`
                        p-2 rounded-lg border transition-colors
                        ${isSaved 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'}
                      `}
                      title="보관함에 저장"
                    >
                      {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    {/* Copy */}
                    <button
                      onClick={() => handleCopyNumbers(game, index)}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                      title="번호 복사"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Sub Badges */}
                {evalData.badges.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-800/40">
                    {evalData.badges.map((b, bi) => (
                      <span key={bi} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/60 text-slate-300 border border-slate-700/50">
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
