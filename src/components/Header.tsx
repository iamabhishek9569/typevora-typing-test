import React from 'react';
import { Volume2, VolumeX, History, Info, Keyboard } from 'lucide-react';

interface HeaderProps {
  activeTab: 'test' | 'history' | 'about';
  setActiveTab: (tab: 'test' | 'history' | 'about') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  historyCount: number;
  isTypingActive: boolean;
  onQuickRestart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  onToggleSound,
  historyCount,
  isTypingActive,
  onQuickRestart,
}) => {
  return (
    <header
      className={`w-full max-w-5xl mx-auto px-6 pt-8 pb-4 transition-opacity duration-300 ${
        isTypingActive ? 'opacity-20 hover:opacity-100' : 'opacity-100'
      }`}
    >
      <div className="flex items-center justify-between pb-4">
        {/* Sleek Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => {
            setActiveTab('test');
            onQuickRestart();
          }}
          className="flex items-center gap-2.5 text-left group transition-all"
        >
          <div className="w-6 h-6 bg-[#ff6b00] rounded-[4px] flex items-center justify-center text-zinc-950 font-black text-xs shadow-md shadow-[#ff6b00]/20 group-hover:scale-105 transition-transform">
            <span className="font-mono">V</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#f5f3f0] group-hover:text-white transition-colors">
            Type<span className="text-[#ff6b00]">Vora</span>
          </span>
        </button>

        {/* Sleek Nav Links & Sound */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <nav className="flex items-center gap-5 sm:gap-7">
            <button
              id="tab-test-btn"
              onClick={() => setActiveTab('test')}
              className={`transition-colors py-1 ${
                activeTab === 'test'
                  ? 'text-[#f5f3f0] font-semibold border-b-2 border-[#ff6b00]'
                  : 'text-[#8a817a] hover:text-[#f5f3f0]'
              }`}
            >
              Test
            </button>

            <button
              id="tab-history-btn"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 transition-colors py-1 ${
                activeTab === 'history'
                  ? 'text-[#f5f3f0] font-semibold border-b-2 border-[#ff6b00]'
                  : 'text-[#8a817a] hover:text-[#f5f3f0]'
              }`}
            >
              <span>History</span>
              {historyCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    activeTab === 'history'
                      ? 'bg-[#ff6b00] text-zinc-950 font-bold'
                      : 'bg-[#2c241c] text-[#8a817a]'
                  }`}
                >
                  {historyCount}
                </span>
              )}
            </button>

            <button
              id="tab-about-btn"
              onClick={() => setActiveTab('about')}
              className={`transition-colors py-1 ${
                activeTab === 'about'
                  ? 'text-[#f5f3f0] font-semibold border-b-2 border-[#ff6b00]'
                  : 'text-[#8a817a] hover:text-[#f5f3f0]'
              }`}
            >
              About
            </button>
          </nav>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            title={soundEnabled ? 'Disable Keyboard Sound' : 'Enable Keyboard Sound'}
            className={`p-1.5 rounded-md transition-colors ${
              soundEnabled
                ? 'text-[#ff6b00] bg-[#ff6b00]/15 border border-[#ff6b00]/30'
                : 'text-[#8a817a] hover:text-[#f5f3f0]'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
