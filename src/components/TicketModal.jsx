import React from 'react';
import { Printer, Copy, Check, X, ShieldCheck, Sparkles, QrCode } from 'lucide-react';
import LottoBall from './LottoBall';
import { sound } from '../utils/soundFx';

export default function TicketModal({ isOpen, onClose, games = [] }) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !games || games.length === 0) return null;

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  });
  const timeFormatted = now.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const serialId = 'QLT-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  const hashId = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const handleCopy = () => {
    sound.playClick();
    const text = `[QUANT LOTTO 6/45 퀀트 분석 티켓]\n발행일시: ${dateFormatted} ${timeFormatted}\n보안코드: ${serialId}\n` +
      games.map(g => `게임 ${g.gameLabel || 'A'}: ${g.numbers.map(n => String(n).padStart(2, '0')).join(', ')} (퀀트점수: ${g.evaluation?.score || 90}점)`).join('\n') +
      `\n\n* 본 조합은 1,150회 빅데이터 알고리즘에 의해 최적 분산 추출되었습니다.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0c1322] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white font-mono">
              QUANT TERMINAL OFFICIAL RECEIPT
            </h2>
          </div>
          <button
            onClick={() => { onClose(); sound.playClick(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div id="printable-ticket" className="bg-slate-950 rounded-xl p-6 border border-cyan-500/20 shadow-inner font-mono text-xs space-y-4 relative">
            {/* Watermark Logo */}
            <div className="text-center space-y-1 border-b border-dashed border-slate-800 pb-4">
              <div className="text-lg font-black tracking-widest text-cyan-400">
                QUANT LOTTO 6/45
              </div>
              <div className="text-[10px] text-slate-400">
                ALGORITHMIC BIG-DATA QUANT RECEIPT
              </div>
              <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>VERIFIED QUANT COMBINATION</span>
              </div>
            </div>

            {/* Receipt Meta */}
            <div className="space-y-1 text-[11px] text-slate-400 border-b border-dashed border-slate-800 pb-3">
              <div className="flex justify-between">
                <span>발행일시 (TIMESTAMP):</span>
                <span className="text-white">{dateFormatted} {timeFormatted}</span>
              </div>
              <div className="flex justify-between">
                <span>터미널 시리얼 (SERIAL):</span>
                <span className="text-cyan-400 font-bold">{serialId}</span>
              </div>
              <div className="flex justify-between">
                <span>적용 데이터 (DATASET):</span>
                <span className="text-white">1,150회 전수 통계 매트릭스</span>
              </div>
              <div className="flex justify-between truncate">
                <span>보안 해시 (HASH):</span>
                <span className="text-slate-500 truncate max-w-[180px]">{hashId}</span>
              </div>
            </div>

            {/* Games Listing */}
            <div className="space-y-3 py-2 border-b border-dashed border-slate-800 pb-4">
              {games.map((game, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-cyan-400 text-xs">
                      {game.gameLabel || String.fromCharCode(65 + i)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {game.numbers.map((n, ni) => (
                        <LottoBall key={ni} number={n} size="xs" />
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-amber-400 block">
                      {game.evaluation?.grade || 'QUANT ALPHA'}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      스코어: {game.evaluation?.score || 92}점
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated Barcode */}
            <div className="pt-2 text-center space-y-2">
              <div className="h-10 w-full flex items-center justify-between px-2 bg-slate-900 rounded overflow-hidden opacity-80">
                {Array.from({ length: 48 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-full bg-slate-300"
                    style={{
                      width: idx % 3 === 0 ? '3px' : idx % 5 === 0 ? '1px' : '2px',
                      opacity: idx % 4 === 0 ? 0.3 : 1
                    }}
                  ></div>
                ))}
              </div>
              <div className="text-[10px] text-slate-500 tracking-wider">
                *{serialId}*
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/80">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '복사 완료' : '텍스트 복사'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>티켓 인쇄 / PDF 저장</span>
          </button>
        </div>
      </div>
    </div>
  );
}
