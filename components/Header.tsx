
import React from 'react';

interface HeaderProps {
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700">
      <div className="container mx-auto px-4 py-3 max-w-4xl flex justify-between items-center">
        <h1 
          className="text-xl md:text-2xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent cursor-pointer"
          onClick={onHomeClick}
        >
          AI英語実力テスト
        </h1>
        <button 
          onClick={onHomeClick}
          className="text-sm text-slate-400 hover:text-sky-400 transition-colors"
        >
          レベル選択へ
        </button>
      </div>
    </header>
  );
};

export default Header;
