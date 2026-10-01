import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GeneratorView from './components/GeneratorView';
import BacktesterView from './components/BacktesterView';
import BigDataView from './components/BigDataView';
import VaultView from './components/VaultView';
import TicketModal from './components/TicketModal';
import VipModal from './components/VipModal';
import { generateQuantCombinations } from './utils/quantEngine';
import { sound } from './utils/soundFx';

export default function App() {
  const [activeTab, setActiveTab] = useState('generator');
  const [isVip, setIsVip] = useState(() => {
    try {
      return localStorage.getItem('quant_lotto_vip') === 'true';
    } catch {
      return false;
    }
  });

  const [savedGames, setSavedGames] = useState(() => {
    try {
      const data = localStorage.getItem('quant_lotto_saved');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  // Current generated games shared across tabs
  const [currentGames, setCurrentGames] = useState(() => 
    generateQuantCombinations({ count: 5, strategy: 'ALPHA_QUANT' })
  );

  // Modals
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketGames, setTicketGames] = useState([]);

  // Sync VIP with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quant_lotto_vip', String(isVip));
    } catch {
      // Ignore
    }
  }, [isVip]);

  // Sync Saved Games with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quant_lotto_saved', JSON.stringify(savedGames));
    } catch {
      // Ignore
    }
  }, [savedGames]);

  // Handle Save Game
  const handleSaveGame = (game) => {
    const newEntry = {
      ...game,
      id: 'G-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      savedAt: new Date().toISOString()
    };
    setSavedGames(prev => [newEntry, ...prev]);
  };

  // Handle Delete Game
  const handleDeleteGame = (index) => {
    setSavedGames(prev => prev.filter((_, i) => i !== index));
  };

  // Handle Clear Vault
  const handleClearVault = () => {
    setSavedGames([]);
  };

  // Switch to Backtester with target games
  const handleRunBacktestWithGames = (games) => {
    setCurrentGames(games);
    setActiveTab('backtester');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Ticket Modal
  const handleOpenTicketModal = (games) => {
    setTicketGames(games);
    setIsTicketModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col cyber-grid-bg">
      {/* Sticky Terminal Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isVip={isVip}
        setIsVipModalOpen={setIsVipModalOpen}
        savedCount={savedGames.length}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'generator' && (
          <GeneratorView
            onRunBacktestWithGames={handleRunBacktestWithGames}
            onSaveGame={handleSaveGame}
            onOpenTicketModal={handleOpenTicketModal}
          />
        )}

        {activeTab === 'backtester' && (
          <BacktesterView
            currentGames={currentGames}
            onLoadGeneratedGames={() => {
              const fresh = generateQuantCombinations({ count: 5, strategy: 'ALPHA_QUANT' });
              setCurrentGames(fresh);
            }}
          />
        )}

        {activeTab === 'bigdata' && (
          <BigDataView />
        )}

        {activeTab === 'vault' && (
          <VaultView
            savedGames={savedGames}
            onDeleteGame={handleDeleteGame}
            onClearVault={handleClearVault}
            onRunBacktest={handleRunBacktestWithGames}
            onOpenTicket={handleOpenTicketModal}
            onGoToGenerator={() => setActiveTab('generator')}
          />
        )}
      </main>

      {/* Cybernetic Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-12 py-8 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-sm font-black text-white tracking-wider">
                QUANT LOTTO TERMINAL™ <span className="text-cyan-400">PRO EDITION</span>
              </span>
              <p className="text-[11px] text-slate-400">
                1,150회 빅데이터 딥러닝 통계 분석 & 퀀트 백테스팅 금융 시뮬레이션 시스템
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-emerald-400 font-bold">● SYSTEM OPERATIONAL</span>
              <span>VERSION 4.8.2-PRO</span>
              <span>ENTERPRISE LICENSE: ₩1,000,000</span>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-slate-600">
            <p>
              * 본 프로그램은 동행복권 로또 6/45 역대 통계 데이터 기반 연구/분석용 솔루션이며, 복권의 특성상 100% 당첨을 절대 보장하지 않습니다. 건전한 복권 문화를 준수해 주시기 바랍니다.
            </p>
            <p>© 2026 QUANT LOTTO LABS. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        games={ticketGames}
      />

      <VipModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        isVip={isVip}
        setIsVip={setIsVip}
      />
    </div>
  );
}
