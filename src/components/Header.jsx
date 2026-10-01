import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  TrendingUp, 
  BarChart3, 
  BookmarkCheck, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';
import { sound } from '../utils/soundFx';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  isVip, 
  setIsVipModalOpen,
  savedCount = 0 
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const kst = new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);
      setTimeStr(`${kst} KST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAudioToggle = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  const navItems = [
    { id: 'generator', label: '퀀트 엔진', icon: Cpu, badge: 'AI ALPHA' },
    { id: 'backtester', label: '가상 백테스팅', icon: TrendingUp, badge: '1,150회 전수' },
    { id: 'bigdata', label: '빅데이터 통계', icon: BarChart3, badge: '실시간' },
    { id: 'vault', label: '보관함 & 티켓', icon: BookmarkCheck, count: savedCount }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#060913]/90 border-b border-cyan-500/20 shadow-2xl">
      {/* Top Telemetry Bar */}
      <div className="hidden md:flex items-center justify-between px-6 py-1 bg-slate-950/80 border-b border-slate-800/60 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/80"></span>
            <span className="text-emerald-400 font-semibold tracking-wider">QUANT ALGO ENGINE : ONLINE</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">CORE: LOTTO 6/45 BIG-DATA v4.8</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400/80 font-mono">DRAWS INDEXED: 1,150</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{timeStr}</span>
          </div>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => setIsVipModalOpen(true)}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isVip ? 'VIP ENTERPRISE ACTIVATED' : '100만원 VIP 라이선스'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => { setActiveTab('generator'); sound.playClick(); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all duration-300">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#060913] flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white font-mono">
                  QUANT<span className="text-cyan-400">LOTTO</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  PRO
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 hidden sm:block tracking-wide">
                100만원급 퀀트 통계 & 가상 백테스팅 터미널
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    sound.playClick();
                  }}
                  className={`
                    relative px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/50 shadow-lg shadow-cyan-500/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-cyan-500 text-slate-950 font-bold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={handleAudioToggle}
              title={isMuted ? '음소거 해제' : '사운드 끄기'}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* VIP Status Button */}
            <button
              onClick={() => {
                setIsVipModalOpen(true);
                sound.playClick();
              }}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all duration-200
                ${isVip 
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/20' 
                  : 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/40 hover:border-cyan-400'}
              `}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{isVip ? 'VIP 평생회원' : 'VIP 인증 (100만원)'}</span>
              <span className="sm:hidden">{isVip ? 'VIP' : 'VIP'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden flex items-center justify-around py-2 px-2 bg-slate-950/95 border-t border-slate-800/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                sound.playClick();
              }}
              className={`
                flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors relative
                ${isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'}
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className="absolute top-0 right-2 w-4 h-4 bg-cyan-500 text-slate-950 rounded-full text-[9px] flex items-center justify-center font-bold">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
