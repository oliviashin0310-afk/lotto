import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Check, 
  X, 
  Key, 
  Award, 
  Lock, 
  Zap, 
  Cpu, 
  TrendingUp, 
  Layers 
} from 'lucide-react';
import { sound } from '../utils/soundFx';
import confetti from 'canvas-confetti';

export default function VipModal({ isOpen, onClose, isVip, setIsVip }) {
  const [licenseKey, setLicenseKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const validKeys = [
    'QUANT-VIP-2026',
    'PRO-100M-KRW',
    'LUCKY-7777',
    'ENTERPRISE-100',
    'VIP-PRO-PASS'
  ];

  const handleActivate = (e) => {
    e.preventDefault();
    sound.playClick();
    const cleanKey = licenseKey.trim().toUpperCase();

    if (validKeys.includes(cleanKey) || cleanKey.startsWith('QUANT-')) {
      setIsVip(true);
      setErrorMsg('');
      setSuccessMsg('축하합니다! 100만원 상당의 QUANT ENTERPRISE VIP 평생 라이선스가 활성화되었습니다.');
      sound.playJackpot();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore
      }
    } else {
      setErrorMsg('유효하지 않은 라이선스 키입니다. (체험용 키: QUANT-VIP-2026)');
    }
  };

  const handleDemoToggle = () => {
    sound.playClick();
    const nextState = !isVip;
    setIsVip(nextState);
    if (nextState) {
      sound.playJackpot();
      setSuccessMsg('VIP 모드가 즉시 활성화되었습니다.');
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {
        // Ignore
      }
    } else {
      setSuccessMsg('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0a101f] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white font-mono flex items-center gap-2">
                <span>QUANT ENTERPRISE VIP</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  정가 ₩1,000,000
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">상업용 최고급 퀀트 로또 6/45 라이선스 게이트웨이</p>
            </div>
          </div>
          <button
            onClick={() => { onClose(); sound.playClick(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Badge */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${isVip ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isVip ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`}></div>
              <div>
                <span className="font-bold text-sm block">
                  {isVip ? 'VIP 엔터프라이즈 라이선스 활성화 상태' : '현재 체험 모드 (Standard Demo)'}
                </span>
                <span className="text-xs text-slate-400">
                  {isVip ? '전체 1,150회 전수 백테스팅 및 몬테카를로 5,000회 제한 없음' : '정식 라이선스 키를 등록하여 전 기능을 영구 해금하세요.'}
                </span>
              </div>
            </div>
            <button
              onClick={handleDemoToggle}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono border transition-all ${isVip ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 border-slate-700 text-slate-300'}`}
            >
              {isVip ? '활성 해제' : '원클릭 체험 활성화'}
            </button>
          </div>

          {/* Value Props Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>100만원 엔터프라이즈 솔루션 4대 핵심 가치</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: TrendingUp,
                  title: '1,150회 전수 백테스팅 시뮬레이터',
                  desc: '2002년부터 현재까지 전회차 6,900개 당첨공 대조, 누적 수익률(ROI), 최대 낙폭(MDD), Equity Curve 제공'
                },
                {
                  icon: Cpu,
                  title: '4대 퀀트 알고리즘 엔진 탑재',
                  desc: '몬테카를로 5,000회 시뮬레이션, 평균 회귀(Mean Reversion), 모멘텀 추세 추종, AC 6+ 복잡도 최적화'
                },
                {
                  icon: Layers,
                  title: '특허급 5대 정밀 필터 매트릭스',
                  desc: '고정수/제외수, 정규분포 총합(100~175), 홀짝 3:3 황금비율, 연속수 제어 필터링'
                },
                {
                  icon: ShieldCheck,
                  title: '보안 영수증 & 공식 티켓 인쇄 시스템',
                  desc: '위조방지 SHA-256 해시, 바코드 시뮬레이션, 인쇄 및 PDF 저장용 고해상도 벡터 티켓'
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-bold text-white">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* License Key Input Form */}
          <form onSubmit={handleActivate} className="space-y-3 pt-2">
            <label className="block text-xs font-mono text-slate-300">
              라이선스 키 입력 (ENTERPRISE LICENSE KEY)
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="예: QUANT-VIP-2026"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs font-mono shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                인증 등록
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-mono flex items-center gap-1">
                <span>⚠️ {errorMsg}</span>
              </p>
            )}
            {successMsg && (
              <p className="text-xs text-emerald-400 font-mono flex items-center gap-1 font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>{successMsg}</span>
              </p>
            )}
            <p className="text-[10px] text-slate-500 font-mono">
              * 체험 테스트용 키: <code className="text-cyan-400">QUANT-VIP-2026</code> 또는 <code className="text-cyan-400">PRO-100M-KRW</code>
            </p>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>QUANT LOTTO TERMINAL ENTERPRISE v4.8</span>
          <button
            onClick={() => { onClose(); sound.playClick(); }}
            className="text-slate-400 hover:text-white transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
