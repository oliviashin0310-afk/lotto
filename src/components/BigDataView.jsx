import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Flame, 
  Snowflake, 
  Clock, 
  PieChart, 
  Sparkles, 
  TrendingUp, 
  Info,
  Calendar,
  Layers,
  Search
} from 'lucide-react';
import LottoBall from './LottoBall';
import { HISTORICAL_DRAWS, getLottoStatistics } from '../data/lottoData';
import { sound } from '../utils/soundFx';

export default function BigDataView() {
  const [selectedNumber, setSelectedNumber] = useState(7);
  const [sortMode, setSortMode] = useState('NUM'); // 'NUM' | 'FREQ' | 'ABSENCE'

  const stats = useMemo(() => getLottoStatistics(), []);

  // Sorted 1~45 stats
  const sortedNumberStats = useMemo(() => {
    const list = [...stats.numberStats];
    if (sortMode === 'FREQ') {
      return list.sort((a, b) => b.frequency - a.frequency);
    } else if (sortMode === 'ABSENCE') {
      return list.sort((a, b) => b.absenceCount - a.absenceCount);
    }
    return list.sort((a, b) => a.number - b.number);
  }, [stats, sortMode]);

  // Selected number details
  const selectedInfo = useMemo(() => {
    return stats.numberStats.find(n => n.number === selectedNumber) || stats.numberStats[0];
  }, [stats, selectedNumber]);

  // Color distribution calculations
  const colorTotal = Object.values(stats.colorDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel-glow rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <BarChart3 className="w-3.5 h-3.5 animate-pulse" />
              <span>BIG DATA STATISTICAL ROOM v4.8</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              역대 1,150회 <span className="text-cyan-400">빅데이터 통계 분석실</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              2002년 1회차부터 축적된 1,150회 총 6,900개의 당첨 번호 빅데이터를 교차 분석하여 번호별 출현 빈도, 장기 미출현 주기, 색상별 섹터 비중을 실시간 제공합니다.
            </p>
          </div>

          <div className="flex items-center gap-4 font-mono">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">총 누적 추첨 볼</span>
              <span className="text-lg font-black text-cyan-400">6,900개</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">최다 출현 번호</span>
              <span className="text-lg font-black text-amber-400">{stats.hotNumbers[0].number}번</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hot vs Cold Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hot Momentum */}
        <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-950/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
              <span>TOP 5 핫 모멘텀 (최다 출현 번호)</span>
            </h2>
            <span className="text-xs font-mono text-rose-400">추세 추종 지표</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {stats.hotNumbers.slice(0, 5).map((item, idx) => (
              <div 
                key={item.number} 
                onClick={() => { setSelectedNumber(item.number); sound.playClick(); }}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-rose-400 flex flex-col items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <span className="text-[10px] font-mono font-bold text-rose-400">#{idx + 1}위</span>
                <LottoBall number={item.number} size="sm" />
                <span className="text-xs font-mono font-bold text-white">{item.frequency}회</span>
                <span className="text-[10px] font-mono text-slate-400">{item.rate}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cold Reversion */}
        <div className="glass-panel p-5 rounded-2xl border border-blue-500/30 bg-blue-950/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Snowflake className="w-5 h-5 text-blue-400 animate-pulse" />
              <span>TOP 5 미출현 반등 후보 (Longest Absence)</span>
            </h2>
            <span className="text-xs font-mono text-blue-400">평균 회귀 지표</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {stats.overdueNumbers.slice(0, 5).map((item, idx) => (
              <div 
                key={item.number} 
                onClick={() => { setSelectedNumber(item.number); sound.playClick(); }}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-400 flex flex-col items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <span className="text-[10px] font-mono font-bold text-blue-400">#{idx + 1}위</span>
                <LottoBall number={item.number} size="sm" />
                <span className="text-xs font-mono font-bold text-amber-300">{item.absenceCount}주 미출현</span>
                <span className="text-[10px] font-mono text-slate-400">누적 {item.frequency}회</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 1~45 Number Frequency Interactive Grid */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>1~45 전 번호 출현 빈도 매트릭스 (클릭하여 심층 분석)</span>
            </h2>
            <p className="text-xs text-slate-400">
              원하는 번호를 클릭하면 해당 번호의 상세 통계와 최근 출현 주기를 즉시 확인합니다.
            </p>
          </div>

          {/* Sort Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-slate-500 px-2">정렬:</span>
            {[
              { id: 'NUM', label: '번호순' },
              { id: 'FREQ', label: '출현빈도순' },
              { id: 'ABSENCE', label: '미출현주기순' }
            ].map(s => (
              <button
                key={s.id}
                onClick={() => { setSortMode(s.id); sound.playClick(); }}
                className={`
                  px-2.5 py-1 rounded font-bold transition-all
                  ${sortMode === s.id 
                    ? 'bg-cyan-500 text-slate-950 shadow' 
                    : 'text-slate-400 hover:text-white'}
                `}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Number Inspector Banner */}
        {selectedInfo && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <LottoBall number={selectedInfo.number} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white font-mono">
                    {selectedInfo.number}번 정밀 퀀트 분석
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                    {selectedInfo.color.label}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  역대 1,150회 중 총 <strong className="text-white">{selectedInfo.frequency}회</strong> 당첨 출현 (점유율 {selectedInfo.rate}%)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block">최근 미출현 연속</span>
                <span className="font-bold text-amber-400 text-sm">{selectedInfo.absenceCount}주 연속 미출현</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block">전체 출현 순위</span>
                <span className="font-bold text-cyan-400 text-sm">
                  {stats.numberStats.filter(n => n.frequency > selectedInfo.frequency).length + 1}위 / 45
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Number Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-9 lg:grid-cols-15 gap-2 pt-2">
          {sortedNumberStats.map((item) => {
            const isSelected = selectedNumber === item.number;
            return (
              <button
                key={item.number}
                onClick={() => { setSelectedNumber(item.number); sound.playClick(); }}
                className={`
                  p-2 rounded-xl flex flex-col items-center gap-1.5 transition-all
                  ${isSelected 
                    ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105' 
                    : 'bg-slate-900/80 border border-slate-800 hover:border-slate-600 hover:bg-slate-800/80'}
                `}
              >
                <LottoBall number={item.number} size="xs" />
                <span className="text-[11px] font-mono font-bold text-white">
                  {item.frequency}회
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  {item.absenceCount}주전
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mathematical Distributions (Odd/Even, Sum Ranges, Color Sections) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Color Section Breakdown */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-400" />
            <span>색상별 5대 섹터 분포</span>
          </h2>
          <div className="space-y-2.5 pt-1">
            {[
              { label: '1~10번 (골드)', color: 'bg-amber-400', count: stats.colorDistribution['1-10'] },
              { label: '11~20번 (블루)', color: 'bg-blue-500', count: stats.colorDistribution['11-20'] },
              { label: '21~30번 (레드)', color: 'bg-rose-500', count: stats.colorDistribution['21-30'] },
              { label: '31~40번 (그레이)', color: 'bg-slate-400', count: stats.colorDistribution['31-40'] },
              { label: '41~45번 (에메랄드)', color: 'bg-emerald-500', count: stats.colorDistribution['41-45'] }
            ].map((sec, idx) => {
              const pct = ((sec.count / colorTotal) * 100).toFixed(1);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{sec.label}</span>
                    <span className="text-slate-400 font-bold">{sec.count}개 ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div style={{ width: `${pct}%` }} className={`h-full ${sec.color}`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Odd/Even Ratio Bell Curve */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>홀수 : 짝수 출현 비율 통계</span>
          </h2>
          <div className="space-y-2.5 pt-1">
            {Object.entries(stats.oddEvenRatios).map(([ratio, count], idx) => {
              const pct = ((count / stats.totalDraws) * 100).toFixed(1);
              const isGolden = ratio === '3:3' || ratio === '2:4' || ratio === '4:2';
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className={isGolden ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
                      {ratio} {isGolden && '★ 골든'}
                    </span>
                    <span className="text-slate-300 font-bold">{count}회 ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      style={{ width: `${pct * 2.5}%` }} 
                      className={`h-full ${isGolden ? 'bg-cyan-400' : 'bg-slate-600'}`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sum Range Bell Curve */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>총합 정규분포 구간 통계</span>
          </h2>
          <div className="space-y-2.5 pt-1">
            {Object.entries(stats.sumRanges).map(([range, count], idx) => {
              const pct = ((count / stats.totalDraws) * 100).toFixed(1);
              const isTarget = range === '121-140' || range === '141-160' || range === '100-120';
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className={isTarget ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                      {range} 구간 {isTarget && '★ 밀집'}
                    </span>
                    <span className="text-slate-300 font-bold">{count}회 ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      style={{ width: `${pct * 2.8}%` }} 
                      className={`h-full ${isTarget ? 'bg-amber-400' : 'bg-slate-600'}`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Draws Live Timeline */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>최근 10회차 공식 당첨 번호 실시간 스트림</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">동행복권 공식 데이터베이스 연동</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="py-3 px-4">회차</th>
                <th className="py-3 px-4">추첨일자</th>
                <th className="py-3 px-4">당첨 번호 (6개)</th>
                <th className="py-3 px-4">보너스</th>
                <th className="py-3 px-4">1등 당첨금 (개별)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {HISTORICAL_DRAWS.slice(0, 10).map((draw) => (
                <tr key={draw.round} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4 font-black text-cyan-400 text-sm">
                    {draw.round}회
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {draw.date}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {draw.numbers.map((n, i) => (
                        <LottoBall key={i} number={n} size="xs" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <LottoBall number={draw.bonus} size="xs" isBonus={true} />
                  </td>
                  <td className="py-3 px-4 font-black text-amber-300">
                    ₩{draw.prize1st.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
