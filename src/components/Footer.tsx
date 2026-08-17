import React from 'react';

interface FooterProps {
  isTypingActive: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isTypingActive }) => {
  return (
    <footer
      className={`w-full max-w-5xl mx-auto px-6 py-6 mt-auto border-t border-[#2c241c] text-[#8a817a] text-xs transition-opacity duration-300 ${
        isTypingActive ? 'opacity-20' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>&copy; 2026 TypeVora &mdash; Free English Typing Test</div>
        <div className="flex items-center gap-1.5 text-xs text-[#8a817a]">
          <span>Press</span>
          <span className="key-cap">Enter</span>
          <span>to restart</span>
        </div>
      </div>
    </footer>
  );
};
