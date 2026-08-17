import React, { useEffect, useState } from 'react';
import { TestResult } from '../types';
import { RotateCcw, Share2, History as HistoryIcon, CheckCircle2, Shuffle } from 'lucide-react';

interface ResultsViewProps {
  result: TestResult;
  onRestart: () => void;
  onNewText: () => void;
  onViewHistory: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onRestart,
  onNewText,
  onViewHistory,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `TypeVora English Typing Test
Speed: ${result.wpm} WPM (Raw: ${result.rawWpm} WPM)
Accuracy: ${result.accuracy}%
Duration: ${result.timeTaken}s (${result.difficulty})
${result.performanceMessage}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || (e.key === 'Enter' && !e.shiftKey)) {
        e.preventDefault();
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestart]);

  const historyData =
    result.wpmHistory.length > 0
      ? result.wpmHistory
      : [{ second: 1, wpm: result.wpm, rawWpm: result.rawWpm, errors: result.incorrectChars }];

  const maxWpm = Math.max(80, ...historyData.map((d) => Math.max(d.wpm, d.rawWpm))) * 1.15;
  const maxSec = Math.max(1, result.timeTaken);

  const pointsWpm = historyData
    .map((d, i) => {
      const x = ((d.second || i + 1) / maxSec) * 500;
      const y = 140 - (d.wpm / maxWpm) * 120;
      return `${x},${y}`;
    })
    .join(' ');

  const pointsRaw = historyData
    .map((d, i) => {
      const x = ((d.second || i + 1) / maxSec) * 500;
      const y = 140 - (d.rawWpm / maxWpm) * 120;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      id="test-results-card"
      className="w-full max-w-5xl lg:max-w-6xl mx-auto my-6 bg-[#171411] border border-[#2c241c] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-[#ff6b00]/5 animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header Result summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2c241c] pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f5f3f0]">
            {result.performanceMessage}
          </h2>
          <p className="text-xs text-[#8a817a] mt-1">
            Duration: {result.timeTaken}s • Difficulty: {result.difficulty} • {result.date}
          </p>
        </div>

        {/* Primary WPM badge */}
        <div className="flex items-baseline gap-2 bg-[#ff6b00]/15 border border-[#ff6b00]/30 px-6 py-3 rounded-xl shadow-lg shadow-[#ff6b00]/10">
          <span className="text-4xl sm:text-5xl font-bold font-mono text-[#ff6b00]">
            {result.wpm}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#ff6b00]">
            WPM
          </span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
        <div className="bg-[#0c0a09] border border-[#2c241c] rounded-xl p-4">
          <div className="text-xs text-[#8a817a] mb-1">
            Accuracy
          </div>
          <div className="text-2xl font-bold font-mono text-[#f5f3f0]">
            {result.accuracy}%
          </div>
          <div className="text-[11px] text-[#8a817a] mt-0.5">
            {result.correctChars} of {result.totalChars} chars
          </div>
        </div>

        <div className="bg-[#0c0a09] border border-[#2c241c] rounded-xl p-4">
          <div className="text-xs text-[#8a817a] mb-1">
            Raw Speed
          </div>
          <div className="text-2xl font-bold font-mono text-[#f5f3f0]">
            {result.rawWpm} <span className="text-xs text-[#8a817a] font-normal">WPM</span>
          </div>
          <div className="text-[11px] text-[#8a817a] mt-0.5">
            Without penalties
          </div>
        </div>

        <div className="bg-[#0c0a09] border border-[#2c241c] rounded-xl p-4">
          <div className="text-xs text-[#8a817a] mb-1">
            Characters
          </div>
          <div className="text-2xl font-bold font-mono text-[#f5f3f0]">
            <span className="text-[#f5f3f0]">{result.correctChars}</span>
            <span className="text-[#8a817a] text-lg mx-1">/</span>
            <span className="text-[#ef4444]">{result.incorrectChars}</span>
          </div>
          <div className="text-[11px] text-[#8a817a] mt-0.5">
            correct / errors
          </div>
        </div>

        <div className="bg-[#0c0a09] border border-[#2c241c] rounded-xl p-4">
          <div className="text-xs text-[#8a817a] mb-1">
            Time Taken
          </div>
          <div className="text-2xl font-bold font-mono text-[#f5f3f0]">
            {result.timeTaken >= 60
              ? `${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s`
              : `${result.timeTaken}s`}
          </div>
          <div className="text-[11px] text-[#8a817a] mt-0.5">
            Target:{' '}
            {result.durationSetting >= 60
              ? `${Math.floor(result.durationSetting / 60)} min`
              : `${result.durationSetting}s`}
          </div>
        </div>
      </div>

      {/* Speed Graph (WPM over test timeline) */}
      {historyData.length > 1 && (
        <div className="my-6 bg-[#0c0a09] border border-[#2c241c] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-[#8a817a] mb-3">
            <span className="font-medium text-[#f5f3f0]">Speed Graph</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff6b00]"></span>
                <span>Net WPM</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8a817a]"></span>
                <span>Raw WPM</span>
              </span>
            </div>
          </div>

          <div className="w-full h-32 relative">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
              <line x1="0" y1="20" x2="500" y2="20" stroke="#2c241c" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#2c241c" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#2c241c" />

              <polyline
                fill="none"
                stroke="#8a817a"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                points={pointsRaw}
              />

              <polyline
                fill="none"
                stroke="#ff6b00"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsWpm}
              />
            </svg>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#2c241c]">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="result-restart-btn"
            onClick={onRestart}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#ff6b00] hover:bg-[#e65c00] text-zinc-950 font-bold rounded-lg text-sm transition-all shadow-md shadow-[#ff6b00]/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart (Tab / Enter)</span>
          </button>

          <button
            id="result-new-text-btn"
            onClick={onNewText}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0c0a09] hover:bg-[#231d17] text-[#f5f3f0] rounded-lg text-sm font-medium border border-[#2c241c] transition-all"
          >
            <Shuffle className="w-4 h-4 text-[#ff6b00]" />
            <span>New Text</span>
          </button>

          <button
            id="result-copy-btn"
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0c0a09] hover:bg-[#231d17] text-[#f5f3f0] rounded-lg text-sm font-medium border border-[#2c241c] transition-all"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#ff6b00]" />
                <span className="text-[#ff6b00]">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#8a817a]" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        <button
          id="result-view-history-btn"
          onClick={onViewHistory}
          className="flex items-center gap-1.5 text-xs text-[#8a817a] hover:text-[#f5f3f0] transition-colors py-2"
        >
          <HistoryIcon className="w-3.5 h-3.5" />
          <span>View History</span>
        </button>
      </div>
    </div>
  );
};
