import React from 'react';
import { getBallColorInfo } from '../data/lottoData';

export default function LottoBall({ 
  number, 
  size = 'md', 
  isMatched = false, 
  isBonus = false,
  dimmed = false,
  showAnimation = false,
  animDelay = 0 
}) {
  const colorInfo = getBallColorInfo(number);

  const sizeClasses = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm md:w-11 md:h-11 md:text-base',
    lg: 'w-12 h-12 text-base md:w-14 md:h-14 md:text-lg',
    xl: 'w-14 h-14 text-lg md:w-16 md:h-16 md:text-xl'
  }[size] || 'w-10 h-10 text-sm';

  return (
    <div
      style={{
        animationDelay: showAnimation ? `${animDelay}ms` : '0ms'
      }}
      className={`
        lotto-ball-3d bg-gradient-to-br ${colorInfo.bg} ${sizeClasses}
        ${dimmed ? 'opacity-30 grayscale' : 'opacity-100'}
        ${isMatched ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900 shadow-lg shadow-emerald-500/60 scale-105' : ''}
        ${isBonus ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 shadow-lg shadow-amber-500/60' : ''}
        ${showAnimation ? 'animate-bounce' : ''}
        cursor-default select-none transition-all
      `}
      title={`번호 ${number} (${colorInfo.label})`}
    >
      <span className="font-extrabold text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)] font-mono">
        {number}
      </span>
      {isMatched && (
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-[9px] text-white font-black shadow">
          ✓
        </span>
      )}
      {isBonus && (
        <span className="absolute -bottom-1 -right-1 px-1 bg-amber-500 rounded text-[8px] text-slate-900 font-black shadow">
          +B
        </span>
      )}
    </div>
  );
}
