import React from 'react';
import { Bookmark, Trash2, Printer, TrendingUp, Copy, AlertCircle, Sparkles } from 'lucide-react';
import LottoBall from './LottoBall';
import { sound } from '../utils/soundFx';

export default function VaultView({ 
  savedGames = [], 
  onDeleteGame, 
  onClearVault, 
  onRunBacktest, 
  onOpenTicket, 
  onGoToGenerator 
}) {
  const handleCopySingle = (game) => {
    sound.playClick();
    const text = `[QUANT LOTTO 보관함] ${game.numbers.join(', ')} (스코어: ${game.evaluation?.score || 90}점)`;
    navigator.clipboard.writeText(text);
    alert('번호가 클립보드에 복사되었습니다.');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel-glow rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
              <Bookmark className="w-3.5 h-3.5" />
              <span>QUANT PORTFOLIO VAULT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              나만의 퀀트 <span className="text-cyan-400">조합 보관함</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              알고리즘 분석을 거쳐 저장한 프리미엄 번호 조합들을 영구 보관하고 관리합니다. (총 {savedGames.length}개 보관중)
            </p>
          </div>

          {savedGames.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenTicket(savedGames);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/30 hover:scale-105 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>전체 일괄 티켓 출력</span>
              </button>
              <button
                onClick={() => {
                  if (confirm('보관함의 모든 번호를 삭제하시겠습니까?')) {
                    sound.playClick();
                    onClearVault();
                  }
                }}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-rose-500/30 text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>전체 비우기</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* List */}
      {savedGames.length > 0 ? (
        <div className="space-y-3">
          {savedGames.map((game, idx) => (
            <div
              key={game.id || idx}
              className="glass-panel rounded-xl p-4 sm:p-5 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Left: Info & Balls */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-cyan-400 text-xs font-mono">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {game.savedAt ? new Date(game.savedAt).toLocaleString('ko-KR') : '보관된 번호'}
                  </span>
                  {game.evaluation?.grade && (
                    <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {game.evaluation.grade} ({game.evaluation.score}점)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {game.numbers.map((n, i) => (
                    <LottoBall key={i} number={n} size="md" />
                  ))}
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => {
                    sound.playClick();
                    onRunBacktest([game]);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>백테스팅</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenTicket([game]);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>티켓</span>
                </button>

                <button
                  onClick={() => handleCopySingle(game)}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="복사"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onDeleteGame(idx);
                  }}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 text-center space-y-4 border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
            <Bookmark className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">보관함이 비어 있습니다.</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              퀀트 생성 엔진에서 알고리즘 추출을 실행한 후, 마음에 드는 조합의 보관 아이콘(북마크)을 눌러 저장해보세요.
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onGoToGenerator();
            }}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>퀀트 엔진으로 번호 추출하러 가기</span>
          </button>
        </div>
      )}
    </div>
  );
}
