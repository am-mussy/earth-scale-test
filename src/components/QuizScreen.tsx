import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  Home,
  Info,
  Sparkles,
  Zap,
} from 'lucide-react';
import { CATEGORIES, CATEGORY_MAP, QUESTIONS } from '../data/questions';
import { AnswersMap, QuestionOption } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface QuizScreenProps {
  currentIndex: number;
  answers: AnswersMap;
  onSelectAnswer: (questionId: string, optionId: string) => void;
  onChangeIndex: (nextIndex: number) => void;
  onFinish: () => void;
  onExitHome: () => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
    scale: 0.985,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
    scale: 0.985,
  }),
};

export const QuizScreen: React.FC<QuizScreenProps> = ({
  currentIndex,
  answers,
  onSelectAnswer,
  onChangeIndex,
  onFinish,
  onExitHome,
}) => {
  const [direction, setDirection] = useState(1);
  const [showInstantFact, setShowInstantFact] = useState(false);
  const [justSelectedOption, setJustSelectedOption] =
    useState<QuestionOption | null>(null);
  const autoAdvanceTimerRef = useRef<number | null>(null);

  const question = QUESTIONS[currentIndex];
  const category = CATEGORY_MAP[question.category];
  const selectedId = answers[question.id];
  const selectedOption =
    question.options.find((opt) => opt.id === selectedId) ?? null;

  const isLast = currentIndex === QUESTIONS.length - 1;
  const remainingMinutes = Math.max(
    1,
    Math.ceil(((QUESTIONS.length - currentIndex) * 5.5) / 60),
  );

  const clearPendingTimer = () => {
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearPendingTimer();
  }, []);

  useEffect(() => {
    setJustSelectedOption(null);
  }, [currentIndex]);

  const goNext = useCallback(() => {
    clearPendingTimer();
    if (isLast) {
      onFinish();
    } else {
      setDirection(1);
      onChangeIndex(currentIndex + 1);
    }
  }, [currentIndex, isLast, onChangeIndex, onFinish]);

  const goPrev = useCallback(() => {
    clearPendingTimer();
    if (currentIndex > 0) {
      setDirection(-1);
      onChangeIndex(currentIndex - 1);
    }
  }, [currentIndex, onChangeIndex]);

  const handleChoose = useCallback(
    (option: QuestionOption) => {
      clearPendingTimer();
      onSelectAnswer(question.id, option.id);
      setJustSelectedOption(option);

      if (!showInstantFact) {
        autoAdvanceTimerRef.current = window.setTimeout(() => {
          if (isLast) {
            onFinish();
          } else {
            setDirection(1);
            onChangeIndex(currentIndex + 1);
          }
        }, 560);
      }
    },
    [
      currentIndex,
      isLast,
      onChangeIndex,
      onFinish,
      onSelectAnswer,
      question.id,
      showInstantFact,
    ],
  );

  // Keyboard shortcuts: 1-4 select, ArrowLeft/Backspace back, Enter/ArrowRight next
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const num = Number(e.key);
      if (num >= 1 && num <= question.options.length) {
        e.preventDefault();
        handleChoose(question.options[num - 1]);
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault();
        goPrev();
        return;
      }

      if ((e.key === 'Enter' || e.key === 'ArrowRight') && selectedId) {
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev, handleChoose, question.options, selectedId]);

  const activeFeedbackOption = justSelectedOption ?? selectedOption;

  // Milestone gentle encouragement
  const milestoneNote =
    currentIndex === 16
      ? 'Экватор пройден! Уже видна мощная картина.'
      : currentIndex === 28
        ? 'Финальные 4 вопроса — скоро откроем твой планетарный профиль.'
        : null;

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-6 sm:px-6 sm:py-9">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onExitHome}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-800/80 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-400 backdrop-blur-md transition hover:border-slate-600 hover:text-white"
        >
          <Home className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">На главную</span>
        </button>

        {/* Speed vs Instant Fact Toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-800/90 bg-slate-900/70 p-1 text-xs backdrop-blur-md">
          <button
            type="button"
            onClick={() => setShowInstantFact(false)}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition ${
              !showInstantFact
                ? 'bg-slate-800 text-teal-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Быстро</span>
          </button>
          <button
            type="button"
            onClick={() => {
              clearPendingTimer();
              setShowInstantFact(true);
            }}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition ${
              showInstantFact
                ? 'bg-slate-800 text-sky-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="h-3.5 w-3.5" />
            <span>С фактом сразу</span>
          </button>
        </div>

        <div className="text-right font-mono text-xs text-slate-400">
          <span className="font-bold text-white">
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <span> / {QUESTIONS.length}</span>
        </div>
      </div>

      {/* 8-Chapter Segmented Progress Bar */}
      <div className="mt-5">
        <div className="grid grid-cols-8 gap-1.5">
          {CATEGORIES.map((cat, catIdx) => {
            const catStart = catIdx * 4;
            const filledInCat = Math.max(
              0,
              Math.min(4, currentIndex - catStart + (selectedId ? 1 : 0)),
            );
            const isCurrentCat = cat.id === category.id;
            return (
              <div key={cat.id} className="space-y-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800/90">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.accentHex }}
                    initial={false}
                    animate={{ width: `${(filledInCat / 4) * 100}%` }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <div
                  className={`hidden truncate text-center text-[10px] font-medium transition-colors sm:block ${
                    isCurrentCat ? 'text-slate-200' : 'text-slate-600'
                  }`}
                >
                  {cat.shortTitle}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: category.accentHex }}
            />
            Сфера {CATEGORIES.findIndex((c) => c.id === category.id) + 1} из 8:{' '}
            <strong className="text-slate-200">{category.title}</strong>
          </span>
          <span className="font-mono">≈ {remainingMinutes} мин</span>
        </div>
      </div>

      {/* Milestone Toast */}
      <AnimatePresence>
        {milestoneNote && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-teal-400/25 bg-teal-400/10 px-4 py-2 text-xs font-medium text-teal-200"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{milestoneNote}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Animated Question Card */}
      <div className="my-auto py-6 sm:py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={question.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-9"
          >
            {/* Subtle top accent gradient line */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-80"
              style={{
                background: `linear-gradient(90deg, transparent, ${category.accentHex}, transparent)`,
              }}
            />

            {/* Category & Pillar Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${category.badgeClass}`}
              >
                <CategoryIcon categoryId={category.id} className="h-3.5 w-3.5" />
                <span>{category.title}</span>
              </div>

              <span className="rounded-full border border-slate-700/70 bg-slate-900/60 px-2.5 py-1 text-[11px] font-medium text-slate-400">
                {question.pillar === 'achievement'
                  ? 'Личный навык / выбор'
                  : 'Опора и условия'}
              </span>
            </div>

            {/* Question Prompt */}
            <h2 className="mt-5 font-display text-2xl leading-snug font-bold text-white sm:text-[28px]">
              {question.prompt}
            </h2>

            {question.hint && (
              <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                {question.hint}
              </p>
            )}

            {/* Answer Options */}
            <div className="mt-7 space-y-3">
              {question.options.map((option, optIdx) => {
                const isSelected = selectedId === option.id;
                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => handleChoose(option)}
                    className={`group relative flex w-full cursor-pointer items-start gap-3.5 rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                      isSelected
                        ? 'border-teal-400/75 bg-teal-400/14 shadow-[0_0_28px_rgba(45,212,191,0.16)]'
                        : 'border-slate-700/65 bg-slate-900/50 hover:border-slate-500/80 hover:bg-slate-800/65'
                    }`}
                  >
                    {/* Key number / Check indicator */}
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-teal-300 bg-teal-400 text-slate-950'
                          : 'border-slate-700 bg-slate-950/70 text-slate-400 group-hover:border-slate-500 group-hover:text-slate-200'
                      }`}
                    >
                      {isSelected ? <Check className="h-4 w-4 stroke-[3]" /> : optIdx + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-sm font-semibold sm:text-base ${
                          isSelected ? 'text-white' : 'text-slate-100'
                        }`}
                      >
                        {option.label}
                      </div>
                      {option.sublabel && (
                        <div className="mt-0.5 text-xs text-slate-400">
                          {option.sublabel}
                        </div>
                      )}
                    </div>

                    {/* Instant micro-pill in fast mode right on click */}
                    {isSelected && option.isAhead && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="shrink-0 self-center rounded-full border border-teal-400/40 bg-teal-400/15 px-2.5 py-1 font-mono text-[11px] font-bold text-teal-200"
                      >
                        +{option.aheadPercent}%
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Instant Verified Fact Drawer (when "С фактом сразу" is active and answered) */}
            <AnimatePresence>
              {showInstantFact && activeFeedbackOption && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-2xl border border-sky-400/25 bg-sky-950/35 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-teal-300">
                        {activeFeedbackOption.isAhead
                          ? `ТОП-${activeFeedbackOption.topPercent}% • ВПЕРЕДИ ${activeFeedbackOption.aheadPercent}%`
                          : 'ГЛОБАЛЬНЫЙ КОНТЕКСТ'}
                      </span>
                      <a
                        href={question.source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:underline"
                      >
                        {question.source.organization} ({question.source.year})
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">
                      {activeFeedbackOption.feedback}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Card Footer: Back / Next / Source */}
            <div className="mt-7 flex items-center justify-between gap-3 border-t border-slate-800/80 pt-5">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Назад</span>
              </button>

              <div className="hidden text-center text-[11px] text-slate-500 sm:block">
                Источник: {question.source.organization} ({question.source.year})
              </div>

              <button
                type="button"
                onClick={goNext}
                disabled={!selectedId}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-30 ${
                  selectedId
                    ? 'bg-gradient-to-r from-teal-400 to-sky-400 text-slate-950 shadow-[0_0_24px_rgba(45,212,191,0.3)] hover:brightness-110'
                    : 'border border-slate-800 bg-slate-900/50 text-slate-500'
                }`}
              >
                <span>{isLast ? 'Показать результат' : 'Дальше'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle Keyboard Hint */}
      <div className="pb-2 text-center text-[11px] text-slate-500">
        Подсказка: можно нажимать клавиши{' '}
        <kbd className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
          1
        </kbd>
        –
        <kbd className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
          {question.options.length}
        </kbd>{' '}
        на клавиатуре и{' '}
        <kbd className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
          ←
        </kbd>{' '}
        чтобы вернуться.
      </div>
    </div>
  );
};
