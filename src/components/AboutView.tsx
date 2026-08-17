import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface AboutViewProps {
  onBackToTest: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBackToTest }) => {
  return (
    <div
      id="about-view-container"
      className="w-full max-w-4xl mx-auto my-6 bg-[#171411] border border-[#2c241c] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-[#ff6b00]/5 animate-in fade-in duration-200"
    >
      {/* Header */}
      <div className="border-b border-[#2c241c] pb-6">
        <button
          id="about-back-btn"
          onClick={onBackToTest}
          className="flex items-center gap-1.5 text-xs text-[#ff6b00] hover:text-[#ff852e] font-medium mb-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Test</span>
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f5f3f0]">
          About Type<span className="text-[#ff6b00]">Vora</span>
        </h2>
        <p className="text-xs text-[#8a817a] mt-1">
          Free, minimal, modern English typing speed & accuracy test.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="bg-[#0c0a09] border border-[#2c241c] rounded-xl p-5">
          <h3 className="text-sm font-bold text-[#f5f3f0] mb-1">Distraction-Free</h3>
          <p className="text-xs text-[#8a817a] leading-relaxed">
            Zero ads and clean minimalism. Surrounding elements dim while you type to keep you focused.
          </p>
        </div>

        <div className="bg-[#0c0a09] border border-[#2c241c] rounded-xl p-5">
          <h3 className="text-sm font-bold text-[#f5f3f0] mb-1">Local & Private</h3>
          <p className="text-xs text-[#8a817a] leading-relaxed">
            All test records are stored locally in your browser. No registration or server account required.
          </p>
        </div>

        <div className="bg-[#0c0a09] border border-[#2c241c] rounded-xl p-5">
          <h3 className="text-sm font-bold text-[#f5f3f0] mb-1">Accurate Metrics</h3>
          <p className="text-xs text-[#8a817a] leading-relaxed">
            Calculated with standard net WPM formulas (5 characters per word), raw pace, and real-time accuracy.
          </p>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="bg-[#0c0a09] border border-[#2c241c] rounded-xl p-5 my-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8a817a] mb-3">
          Shortcuts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center justify-between bg-[#171411] p-3 rounded-lg border border-[#2c241c]">
            <span className="text-[#f5f3f0]">Restart Test</span>
            <span className="key-cap">Enter</span>
          </div>
          <div className="flex items-center justify-between bg-[#171411] p-3 rounded-lg border border-[#2c241c]">
            <span className="text-[#f5f3f0]">Delete Word</span>
            <span className="key-cap">Ctrl + Backspace</span>
          </div>
          <div className="flex items-center justify-between bg-[#171411] p-3 rounded-lg border border-[#2c241c]">
            <span className="text-[#f5f3f0]">Next Word</span>
            <span className="key-cap">Space</span>
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-center">
        <button
          id="about-start-btn"
          onClick={onBackToTest}
          className="px-5 py-2.5 bg-[#ff6b00] hover:bg-[#e65c00] text-zinc-950 font-bold rounded-lg text-xs transition-all shadow-md shadow-[#ff6b00]/20"
        >
          Start Typing Test
        </button>
      </div>
    </div>
  );
};
