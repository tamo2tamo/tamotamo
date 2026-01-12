
import React from 'react';
import { QuizLevel } from '../types';

interface LevelSelectorProps {
  onSelect: (level: QuizLevel) => void;
}

const LevelCard: React.FC<{level: QuizLevel, description: string, onClick: () => void}> = ({level, description, onClick}) => (
    <button
        onClick={onClick}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-6 text-left hover:bg-slate-700/50 hover:border-sky-500 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-sky-500"
    >
        <h3 className="text-xl font-bold text-sky-400">{level}</h3>
        <p className="mt-2 text-slate-400">{description}</p>
    </button>
);


const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h2 className="text-3xl font-bold mb-2 text-center">挑戦するレベルを選択</h2>
      <p className="text-slate-400 mb-8 text-center">AIがあなたのレベルに合わせて最適な問題を作成します。</p>
      <div className="w-full max-w-2xl space-y-4">
        <LevelCard 
            level={QuizLevel.LEVEL_1} 
            description="基礎力を固め、標準的な問題形式に慣れるためのレベルです。"
            onClick={() => onSelect(QuizLevel.LEVEL_1)}
        />
        <LevelCard 
            level={QuizLevel.LEVEL_2} 
            description="標準的な長文読解。正確な読解力と設問処理能力が問われます。"
            onClick={() => onSelect(QuizLevel.LEVEL_2)}
        />
        <LevelCard 
            level={QuizLevel.LEVEL_3}
            description="複雑で抽象的な長文。高度な語彙力と論理的思考力が求められます。"
            onClick={() => onSelect(QuizLevel.LEVEL_3)}
        />
      </div>
    </div>
  );
};

export default LevelSelector;
