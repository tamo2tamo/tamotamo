
import React, { useState, useMemo } from 'react';
import { Quiz } from '../types';

interface QuizComponentProps {
  quiz: Quiz;
  onSubmit: (answers: (number | null)[]) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quiz, onSubmit }) => {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quiz.questions.length).fill(null));

  const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const allAnswered = useMemo(() => answers.every(answer => answer !== null), [answers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allAnswered) {
      onSubmit(answers);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">{quiz.title}</h2>
      <p className="text-center text-slate-400 mb-8">全ての設問に解答してください。</p>

      <form onSubmit={handleSubmit}>
        {quiz.questions[0].passage && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-300 mb-4 border-b border-slate-600 pb-2">Reading Passage</h3>
            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{quiz.questions[0].passage}</p>
          </div>
        )}

        <div className="space-y-8">
          {quiz.questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <p className="font-semibold text-lg text-slate-200 mb-4">{`Q${qIndex + 1}. ${q.question}`}</p>
              <div className="space-y-3">
                {q.options.map((option, oIndex) => (
                  <label
                    key={oIndex}
                    className={`flex items-center p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      answers[qIndex] === oIndex
                        ? 'bg-sky-900/50 border-sky-500'
                        : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      value={oIndex}
                      checked={answers[qIndex] === oIndex}
                      onChange={() => handleAnswerChange(qIndex, oIndex)}
                      className="hidden"
                    />
                    <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mr-4 flex items-center justify-center ${
                      answers[qIndex] === oIndex ? 'border-sky-400 bg-sky-500' : 'border-slate-400'
                    }`}>
                      {answers[qIndex] === oIndex && <span className="w-2 h-2 rounded-full bg-white"></span>}
                    </span>
                    <span className="text-slate-300">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={!allAnswered}
            className="px-8 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:from-sky-600 hover:to-cyan-600 transform hover:scale-105"
          >
            採点する
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizComponent;
