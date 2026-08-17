import React, { useState, useRef, useEffect } from 'react';
import { Difficulty } from '../types';
import { RefreshCw, Shuffle, Check, Clock, X } from 'lucide-react';

interface TestConfigBarProps {
  selectedDuration: number;
  selectedDifficulty: Difficulty;
  onSelectDuration: (duration: number) => void;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onRestart: () => void;
  onNewText: () => void;
  disabled: boolean;
  isTypingActive: boolean;
}

const PRESET_DURATIONS = [15, 30, 60, 120];

export const TestConfigBar: React.FC<TestConfigBarProps> = ({
  selectedDuration,
  selectedDifficulty,
  onSelectDuration,
  onSelectDifficulty,
  onRestart,
  onNewText,
  disabled,
  isTypingActive,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customUnit, setCustomUnit] = useState<'min' | 'sec'>('min');
  const [customValue, setCustomValue] = useState<string>('5');
  const modalRef = useRef<HTMLDivElement>(null);

  const isPreset = PRESET_DURATIONS.includes(selectedDuration);

  // Close popup when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowCustomModal(false);
      }
    };
    if (showCustomModal) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showCustomModal]);

  const handleApplyCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const num = parseFloat(customValue);
    if (isNaN(num) || num <= 0) return;

    let seconds = 0;
    if (customUnit === 'min') {
      const clampedMin = Math.min(60, Math.max(1, Math.round(num)));
      seconds = clampedMin * 60;
    } else {
      seconds = Math.min(3600, Math.max(5, Math.round(num)));
    }

    onSelectDuration(seconds);
    setShowCustomModal(false);
  };

  const handleSelectQuickMinute = (min: number) => {
    onSelectDuration(min * 60);
    setShowCustomModal(false);
  };

  const formatDurationLabel = (sec: number) => {
    if (sec % 60 === 0) {
      return `${sec / 60}m`;
    }
    return `${sec}s`;
  };

  return (
    <div
<<<<<<< HEAD
      className={`w-full max-w-5xl lg:max-w-6xl mx-auto mb-6 px-4 transition-opacity duration-300 ${
=======
      className={`w-full max-w-4xl mx-auto mb-6 px-4 transition-opacity duration-300 ${
>>>>>>> c72c158648bcc11f6a3f96963d22ec6ce579feca
        isTypingActive ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : 'opacity-100'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 py-2">
        {/* Time Selector */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          {PRESET_DURATIONS.map((dur) => {
            const isSelected = selectedDuration === dur;
            return (
              <button
                key={dur}
                id={`duration-${dur}-btn`}
                disabled={disabled}
                onClick={() => {
                  setShowCustomModal(false);
                  onSelectDuration(dur);
                }}
                className={`text-sm font-medium px-3 py-1.5 rounded-md transition-all ${
                  isSelected
                    ? 'text-[#ff6b00] bg-[#ff6b00]/15 border border-[#ff6b00]/30 font-semibold'
                    : 'text-[#8a817a] hover:text-[#f5f3f0] bg-transparent'
                }`}
              >
                {dur === 60 ? '1m' : dur === 120 ? '2m' : `${dur}s`}
              </button>
            );
          })}

          {/* Custom Time Trigger & Dropdown */}
          <div className="relative" ref={modalRef}>
            <button
              id="duration-custom-btn"
              disabled={disabled}
              onClick={() => {
                setShowCustomModal(!showCustomModal);
                if (!isPreset) {
                  if (selectedDuration % 60 === 0) {
                    setCustomUnit('min');
                    setCustomValue(String(selectedDuration / 60));
                  } else {
                    setCustomUnit('sec');
                    setCustomValue(String(selectedDuration));
                  }
                }
              }}
              className={`text-sm font-medium px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                !isPreset
                  ? 'text-[#ff6b00] bg-[#ff6b00]/15 border border-[#ff6b00]/30 font-semibold'
                  : 'text-[#8a817a] hover:text-[#f5f3f0] bg-transparent'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{!isPreset ? formatDurationLabel(selectedDuration) : 'custom'}</span>
            </button>

            {/* Custom Modal Popover */}
            {showCustomModal && (
              <div
                id="custom-time-popover"
                className="absolute left-0 sm:left-auto top-full mt-2 z-40 bg-[#171411] border border-[#2c241c] rounded-xl p-4 shadow-2xl shadow-[#ff6b00]/10 min-w-[280px] sm:min-w-[320px] animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#2c241c] mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#ff6b00]" />
                    <span className="text-xs font-bold text-[#f5f3f0] uppercase tracking-wider">
                      Custom Duration
                    </span>
                  </div>
                  <button
                    onClick={() => setShowCustomModal(false)}
                    className="text-[#8a817a] hover:text-[#f5f3f0] p-1 rounded transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Minute Presets */}
                <div className="mb-4">
                  <label className="block text-[11px] font-medium text-[#8a817a] mb-2">
                    Quick Minute Presets (Max 60 min)
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[3, 5, 10, 15, 20, 30, 45, 60].map((min) => {
                      const isActive = selectedDuration === min * 60;
                      return (
                        <button
                          key={min}
                          type="button"
                          onClick={() => handleSelectQuickMinute(min)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium transition-all ${
                            isActive
                              ? 'bg-[#ff6b00] text-zinc-950 font-bold shadow-md shadow-[#ff6b00]/25'
                              : 'bg-[#0c0a09] text-[#f5f3f0] hover:bg-[#231d17] border border-[#2c241c]'
                          }`}
                        >
                          {min} min
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Exact Input Form */}
                <form onSubmit={handleApplyCustom} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-[#8a817a]">
                      Manual Duration
                    </label>
                    <div className="flex items-center gap-1 bg-[#0c0a09] p-0.5 rounded-lg border border-[#2c241c] text-[10px]">
                      <button
                        type="button"
                        onClick={() => setCustomUnit('min')}
                        className={`px-2 py-0.5 rounded font-medium transition-colors ${
                          customUnit === 'min'
                            ? 'bg-[#ff6b00] text-zinc-950 font-bold'
                            : 'text-[#8a817a] hover:text-[#f5f3f0]'
                        }`}
                      >
                        Minutes
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomUnit('sec')}
                        className={`px-2 py-0.5 rounded font-medium transition-colors ${
                          customUnit === 'sec'
                            ? 'bg-[#ff6b00] text-zinc-950 font-bold'
                            : 'text-[#8a817a] hover:text-[#f5f3f0]'
                        }`}
                      >
                        Seconds
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        id="custom-duration-input"
                        type="number"
                        min={customUnit === 'min' ? 1 : 5}
                        max={customUnit === 'min' ? 60 : 3600}
                        step="1"
                        autoFocus
                        value={customValue}
                        onChange={(e) => setCustomValue(e.target.value)}
                        placeholder={customUnit === 'min' ? '1 to 60' : '5 to 3600'}
                        className="w-full bg-[#0c0a09] border border-[#2c241c] rounded-lg px-3 py-2 text-sm text-[#f5f3f0] font-mono focus:outline-none focus:border-[#ff6b00] transition-colors"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8a817a] font-mono">
                        {customUnit === 'min' ? 'min (max 60)' : 'sec'}
                      </span>
                    </div>

                    <button
                      type="submit"
                      id="apply-custom-time-btn"
                      className="px-3.5 py-2 bg-[#ff6b00] hover:bg-[#e65c00] text-zinc-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shrink-0 shadow-md shadow-[#ff6b00]/20"
                    >
                      <Check className="w-4 h-4" />
                      <span>Set</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Difficulty and Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border-l border-[#2c241c] pl-3">
            {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((diff) => {
              const active = selectedDifficulty === diff;
              return (
                <button
                  key={diff}
                  id={`diff-${diff}-btn`}
                  disabled={disabled}
                  onClick={() => onSelectDifficulty(diff)}
                  className={`px-2.5 py-1 rounded text-xs capitalize transition-all ${
                    active
                      ? 'text-[#ff6b00] bg-[#ff6b00]/15 border border-[#ff6b00]/30 font-semibold'
                      : 'text-[#8a817a] hover:text-[#f5f3f0]'
                  }`}
                >
                  {diff}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 border-l border-[#2c241c] pl-3">
            <button
              id="new-text-btn"
              onClick={onNewText}
              disabled={disabled}
              title="Generate new random text"
              className="p-1.5 text-[#8a817a] hover:text-[#f5f3f0] rounded transition-colors"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              id="restart-btn"
              onClick={onRestart}
              title="Restart test (Enter or Tab)"
              className="p-1.5 text-[#8a817a] hover:text-[#f5f3f0] rounded transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
