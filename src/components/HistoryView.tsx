import React, { useState } from 'react';
import { TestResult } from '../types';
import { clearStoredHistory } from '../utils/calculateWpm';
import {
  Trash2,
  ArrowLeft,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

interface HistoryViewProps {
  history: TestResult[];
  onBackToTest: () => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onBackToTest,
  onClearHistory,
}) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const totalTests = history.length;
  const bestWpm = totalTests > 0 ? Math.max(...history.map((h) => h.wpm)) : 0;
  const avgWpm = totalTests > 0 ? Math.round(history.reduce((acc, h) => acc + h.wpm, 0) / totalTests) : 0;
  const avgAccuracy = totalTests > 0 ? Math.round(history.reduce((acc, h) => acc + h.accuracy, 0) / totalTests) : 0;

  const handleConfirmClear = () => {
    clearStoredHistory();
    onClearHistory();
    setShowConfirmClear(false);
  };

  return (
    <div
      id="history-view-container"
      className="w-full max-w-4xl mx-auto my-6 bg-[#171411] border border-[#2c241c] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-[#ff6b00]/5 animate-in fade-in duration-200"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2c241c] pb-6">
        <div>
          <button
            id="history-back-btn"
            onClick={onBackToTest}
            className="flex items-center gap-1.5 text-xs text-[#ff6b00] hover:text-[#ff852e] font-medium mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Test</span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f5f3f0]">
            History
          </h2>
          <p className="text-xs text-[#8a817a] mt-0.5">
            Your recorded typing sessions.
          </p>
        </div>

        {totalTests > 0 && (
          <div>
            {!showConfirmClear ? (
              <button
                id="clear-history-btn"
                onClick={() => setShowConfirmClear(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[#8a817a] hover:text-[#ef4444] rounded-lg text-xs font-medium border border-[#2c241c] hover:border-[#ef4444]/40 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-[#ef4444]/10 border border-[#ef4444]/30 p-2 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-[#ef4444] shrink-0" />
                <span className="text-xs text-[#f5f3f0]">Delete all records?</span>
                <button
                  id="confirm-clear-btn"
                  onClick={handleConfirmClear}
                  className="px-2 py-1 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded text-xs font-bold"
                >
                  Yes
                </button>
                <button
                  id="cancel-clear-btn"
                  onClick={() => setShowConfirmClear(false)}
                  className="px-2 py-1 bg-[#2c241c] hover:bg-[#47392e] text-[#f5f3f0] rounded text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
        <div className="bg-[#0c0a09] border border-[#2c241c] rounded-xl p-4">
          <div className="text-xs text-[#8a817a] mb-1">Best Speed</div>
          <div className="text-2xl font-bold font-mono text-[#ff6b00]">
            {bestWpm} <span className="text-xs text-[#8a817a] font-normal">WPM</span>
          </div>
        </div>

        <div className="bg-[#0c0a09] border border-[#2c241c] rounded-xl p-4">
          <div className="text-xs text-[#8a817a] mb-1">Average Speed</div>
          <div className="text-2xl font-bold font-mono text-[#f5f3f0]">
            {avgWpm} <span className="text-xs text-[#8a817a] font-normal">WPM</span>
          </div>
        </div>

        <div className="bg-[#0c0a09] border border-[#2c241c] rounded-xl p-4">
          <div className="text-xs text-[#8a817a] mb-1">Average Accuracy</div>
          <div className="text-2xl font-bold font-mono text-[#f5f3f0]">
            {avgAccuracy}%
          </div>
        </div>

        <div className="bg-[#0c0a09] border border-[#2c241c] rounded-xl p-4">
          <div className="text-xs text-[#8a817a] mb-1">Tests Completed</div>
          <div className="text-2xl font-bold font-mono text-[#f5f3f0]">
            {totalTests}
          </div>
        </div>
      </div>

      {/* Table */}
      {totalTests === 0 ? (
        <div className="text-center py-16 px-4 bg-[#0c0a09] rounded-xl border border-[#2c241c] my-4">
          <p className="text-sm text-[#8a817a] mb-4">No tests completed yet.</p>
          <button
            id="empty-start-test-btn"
            onClick={onBackToTest}
            className="px-4 py-2 bg-[#ff6b00] hover:bg-[#e65c00] text-zinc-950 font-bold rounded-lg text-xs transition-all shadow-md shadow-[#ff6b00]/20"
          >
            Start Test
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#2c241c] bg-[#0c0a09]">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-[#2c241c] text-[#8a817a]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Speed</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4 text-right">Chars (OK/Err)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2c241c]">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-[#171411] transition-colors text-[#f5f3f0]">
                  <td className="py-3.5 px-4 text-[#8a817a]">
                    {item.date}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#ff6b00]">
                    {item.wpm} WPM
                  </td>
                  <td className="py-3.5 px-4 text-[#f5f3f0]">
                    {item.accuracy}%
                  </td>
                  <td className="py-3.5 px-4 text-[#8a817a]">
                    {item.timeTaken >= 60
                      ? `${Math.floor(item.timeTaken / 60)}m ${item.timeTaken % 60}s`
                      : `${item.timeTaken}s`}
                  </td>
                  <td className="py-3.5 px-4 capitalize text-[#8a817a]">
                    {item.difficulty}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span>{item.correctChars}</span>
                    <span className="text-[#8a817a] mx-1">/</span>
                    <span className={item.incorrectChars > 0 ? 'text-[#ef4444]' : 'text-[#8a817a]'}>
                      {item.incorrectChars}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
