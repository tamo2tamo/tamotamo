
import React, { useState, useCallback } from 'react';
import { QuizLevel, Screen, Quiz, ResultsData } from './types';
import { generateQuiz, gradeAndExplain } from './services/geminiService';
import LevelSelector from './components/LevelSelector';
import QuizComponent from './components/QuizComponent';
import ResultsComponent from './components/ResultsComponent';
import LoadingComponent from './components/LoadingComponent';
import Header from './components/Header';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.LEVEL_SELECT);
  const [level, setLevel] = useState<QuizLevel | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [results, setResults] = useState<ResultsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);

  const handleLevelSelect = useCallback(async (selectedLevel: QuizLevel) => {
    setLevel(selectedLevel);
    setLoadingMessage('AIが最適な問題を生成中です...');
    setScreen(Screen.LOADING);
    setError(null);
    try {
      const newQuiz = await generateQuiz(selectedLevel, previousQuestions);
      setQuiz(newQuiz);
      setPreviousQuestions(newQuiz.questions.map(q => q.question));
      setScreen(Screen.QUIZ);
    } catch (e) {
      setError('問題の生成に失敗しました。時間をおいて再試行してください。');
      setScreen(Screen.LEVEL_SELECT);
      console.error(e);
    }
  }, [previousQuestions]);

  const handleQuizSubmit = useCallback(async (answers: (number | null)[]) => {
    if (!quiz || !level) return;

    setUserAnswers(answers);
    setLoadingMessage('AIが採点と解説を生成中です...');
    setScreen(Screen.LOADING);
    setError(null);
    try {
      const nonNullAnswers = answers.filter(a => a !== null) as number[];
      const resultsData = await gradeAndExplain(quiz, nonNullAnswers, level);
      setResults(resultsData);
      setScreen(Screen.RESULTS);
    } catch (e) {
      setError('採点と解説の生成に失敗しました。時間をおいて再試行してください。');
      setScreen(Screen.QUIZ); // Return to quiz to allow re-submission
      console.error(e);
    }
  }, [quiz, level]);

  const handleNewQuiz = useCallback(() => {
    if (level) {
      handleLevelSelect(level);
    }
  }, [level, handleLevelSelect]);

  const handleSelectAnotherLevel = useCallback(() => {
    setQuiz(null);
    setResults(null);
    setLevel(null);
    setError(null);
    setUserAnswers([]);
    setPreviousQuestions([]);
    setScreen(Screen.LEVEL_SELECT);
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case Screen.LOADING:
        return <LoadingComponent message={loadingMessage} />;
      case Screen.QUIZ:
        return quiz && <QuizComponent quiz={quiz} onSubmit={handleQuizSubmit} />;
      case Screen.RESULTS:
        return results && quiz && <ResultsComponent results={results} quiz={quiz} userAnswers={userAnswers} onNewQuiz={handleNewQuiz} onSelectAnotherLevel={handleSelectAnotherLevel} />;
      case Screen.LEVEL_SELECT:
      default:
        return <LevelSelector onSelect={handleLevelSelect} />;
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Header onHomeClick={handleSelectAnotherLevel} />
      <main className="container mx-auto p-4 max-w-4xl">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;
