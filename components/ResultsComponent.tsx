
import React from 'react';
import { ResultsData, Quiz } from '../types';

interface ResultsComponentProps {
  results: ResultsData;
  quiz: Quiz;
  userAnswers: (number | null)[];
  onNewQuiz: () => void;
  onSelectAnotherLevel: () => void;
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({ results, quiz, userAnswers, onNewQuiz, onSelectAnotherLevel }) => {
  const scoreColor = results.score / results.total >= 0.8 ? 'text-green-400' : results.score / results.total >= 0.5 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="animate-fade-in space-y-8">
      {/* Score Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
        <h2 className="text-lg font-semibold text-slate-400 mb-2">{results.level} - 結果</h2>
        <p className="text-6xl font-bold mb-2">
          <span className={scoreColor}>{results.score}</span>
          <span className="text-3xl text-slate-400"> / {results.total}</span>
        </p>
        <p className="text-xl font-medium text-slate-300">正解</p>
      </div>

      {/* Passage Summary Section */}
      {results.passageSummary && (
        <div>
          <h3 className="text-2xl font-bold mb-4 text-center">文章の要約</h3>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{results.passageSummary}</p>
          </div>
        </div>
      )}

      {/* Explanations Section */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-center">詳細解説</h3>
        <div className="space-y-6">
          {results.explanations.map((exp, index) => {
            const userAnswerIndex = userAnswers[index];
            const correctAnswerIndex = quiz.questions[index].correctAnswerIndex;
            const isCorrect = userAnswerIndex === correctAnswerIndex;

            return (
              <div key={index} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-sky-400">{`Q${index + 1}. の解説`}</h4>
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                        isCorrect
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                        {isCorrect ? '正解' : '不正解'}
                    </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-slate-300 mb-1 border-b border-slate-700 pb-2">詳しい解説</h5>
                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed pt-2">{exp.detailedExplanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vocabulary Section */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-center">重要単語・成句</h3>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <ul className="divide-y divide-slate-700">
            {results.vocabulary.map((vocab, index) => (
              <li key={index} className="py-4">
                <p className="font-bold text-lg text-cyan-300">{vocab.word}</p>
                <p className="text-slate-300 mt-1">{vocab.meaning}</p>
                <p className="text-slate-400 mt-2 italic">e.g. "{vocab.example}"</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <button
          onClick={onNewQuiz}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:from-sky-600 hover:to-cyan-600 transform hover:scale-105"
        >
          同じレベルで再挑戦
        </button>
        <button
          onClick={onSelectAnotherLevel}
          className="w-full sm:w-auto px-6 py-3 bg-slate-700 text-slate-200 font-bold rounded-lg transition-colors hover:bg-slate-600"
        >
          他のレベルを選択
        </button>
      </div>
    </div>
  );
};

export default ResultsComponent;
