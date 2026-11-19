import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CATEGORY_MAP, QUESTIONS } from './data/questions';
import { AnswersMap } from './types';
import { calculateResults } from './utils/scoring';
import { CosmicCanvas } from './components/CosmicCanvas';
import { LandingScreen } from './components/LandingScreen';
import { QuizScreen } from './components/QuizScreen';
import { SynthesisScreen } from './components/SynthesisScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { MethodologyModal } from './components/MethodologyModal';

type ScreenState = 'landing' | 'quiz' | 'synthesis' | 'results';

const STORAGE_KEY = 'earth_scale_answers_v1';

function loadSavedAnswers(): AnswersMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export const App: React.FC = () => {
  const [answers, setAnswers] = useState<AnswersMap>(() => loadSavedAnswers());
  const [screen, setScreen] = useState<ScreenState>('landing');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // Ignore storage quota errors
    }
  }, [answers]);

  // Smooth scroll to top when changing major screens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen]);

  const savedCount = Object.keys(answers).length;

  const handleStartNew = useCallback(() => {
    setAnswers({});
    setCurrentIndex(0);
    setScreen('quiz');
  }, []);

  const handleResume = useCallback(() => {
    if (Object.keys(answers).length >= QUESTIONS.length) {
      setScreen('results');
      return;
    }
    const firstUnanswered = QUESTIONS.findIndex((q) => !answers[q.id]);
    setCurrentIndex(firstUnanswered === -1 ? 0 : firstUnanswered);
    setScreen('quiz');
  }, [answers]);

  const handleSelectAnswer = useCallback(
    (questionId: string, optionId: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    },
    [],
  );

  const handleFinishQuiz = useCallback(() => {
    setScreen('synthesis');
  }, []);

  const handleSynthesisDone = useCallback(() => {
    setScreen('results');
  }, []);

  const handleEditAnswers = useCallback(() => {
    setCurrentIndex(0);
    setScreen('quiz');
  }, []);

  const results = useMemo(() => {
    if (screen !== 'results' && savedCount < QUESTIONS.length) {
      return null;
    }
    return calculateResults(answers);
  }, [answers, savedCount, screen]);

  const activeAccentHex = useMemo(() => {
    if (screen === 'quiz') {
      const q = QUESTIONS[currentIndex];
      return CATEGORY_MAP[q.category].accentHex;
    }
    if (screen === 'results' && results) {
      return results.archetype.color;
    }
    return '#2dd4bf';
  }, [currentIndex, results, screen]);

  const canvasIntensity =
    screen === 'landing' || screen === 'synthesis'
      ? 'hero'
      : screen === 'quiz'
        ? 'quiz'
        : 'results';

  return (
    <div className="noise-overlay relative min-h-screen w-full overflow-x-hidden">
      <CosmicCanvas accentHex={activeAccentHex} intensity={canvasIntensity} />

      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <LandingScreen
              savedCount={savedCount}
              onStartNew={handleStartNew}
              onResume={handleResume}
              onOpenMethodology={() => setMethodologyOpen(true)}
            />
          </motion.div>
        )}

        {screen === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <QuizScreen
              currentIndex={currentIndex}
              answers={answers}
              onSelectAnswer={handleSelectAnswer}
              onChangeIndex={setCurrentIndex}
              onFinish={handleFinishQuiz}
              onExitHome={() => setScreen('landing')}
            />
          </motion.div>
        )}

        {screen === 'synthesis' && (
          <motion.div
            key="synthesis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.35 }}
          >
            <SynthesisScreen onComplete={handleSynthesisDone} />
          </motion.div>
        )}

        {screen === 'results' && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <ResultsScreen
              results={results}
              onRestart={handleStartNew}
              onEditAnswers={handleEditAnswers}
              onOpenMethodology={() => setMethodologyOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <MethodologyModal
        open={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />
    </div>
  );
};

export default App;
