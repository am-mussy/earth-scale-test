import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpenCheck,
  Clock,
  Globe2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { QUESTIONS } from '../data/questions';

interface LandingScreenProps {
  savedCount: number;
  onStartNew: () => void;
  onResume: () => void;
  onOpenMethodology: () => void;
}

const PREVIEW_FACTS = [
  {
    stat: '19%',
    label: 'людей на Земле говорят на английском',
    source: 'Ethnologue 2025',
    accent: 'text-indigo-300',
  },
  {
    stat: '44%',
    label: 'взрослых в мире умеют плавать сами',
    source: 'Gallup World Risk Poll',
    accent: 'text-rose-300',
  },
  {
    stat: '81%',
    label: 'планеты живёт менее чем на $30/день (ППС)',
    source: 'World Bank / OWID',
    accent: 'text-emerald-300',
  },
  {
    stat: '18%',
    label: 'трудоспособного мира используют ИИ',
    source: 'Microsoft AI Report 2026',
    accent: 'text-sky-300',
  },
];

const SOURCE_BADGES = [
  'World Bank',
  'WHO',
  'UNESCO',
  'Gallup',
  'UBS',
  'ITU (ООН)',
  'ILO',
  'FAO',
  'Ethnologue',
];

export const LandingScreen: React.FC<LandingScreenProps> = ({
  savedCount,
  onStartNew,
  onResume,
  onOpenMethodology,
}) => {
  const hasPartialProgress = savedCount > 0 && savedCount < QUESTIONS.length;
  const hasCompleted = savedCount >= QUESTIONS.length;

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-between px-4 py-8 sm:px-6 sm:py-12">
      {/* Top minimal navigation */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-400/30 bg-teal-400/10 text-teal-300 shadow-[0_0_24px_rgba(45,212,191,0.2)]">
            <Globe2 className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-sm font-bold tracking-tight text-white">
              Масштаб Земли
            </div>
            <div className="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
              8,2 млрд человек
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenMethodology}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3.5 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md transition hover:border-slate-500 hover:text-white"
        >
          <BookOpenCheck className="h-3.5 w-3.5 text-teal-300" />
          <span>Источники и данные</span>
        </button>
      </motion.header>

      {/* Main Hero */}
      <main className="my-auto py-10 text-center sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-xs font-semibold text-teal-200 backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5 text-teal-300" />
          <span>32 проверенных показателя • Актуально для любого человека</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-4xl font-display text-4xl leading-[1.1] font-extrabold tracking-tight text-white sm:text-6xl lg:text-[64px]"
        >
          Кажется, что ты ничего не достиг?{' '}
          <span className="animate-gradient-text bg-gradient-to-r from-teal-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
            Посмотри в масштабе всей планеты.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg"
        >
          Соцсети постоянно сравнивают нас с 0,01% чужих вершин. Ответь за{' '}
          <span className="font-semibold text-white">3 минуты</span> на 32 простых
          вопроса — и узнай по реальным данным ООН, ВОЗ, Всемирного банка, ЮНЕСКО
          и Gallup, в чём ты уже опережаешь миллиарды людей на Земле.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.33 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-300"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-slate-900/60 px-3.5 py-1.5 backdrop-blur-md">
            <Clock className="h-3.5 w-3.5 text-sky-300" />
            Просто отвечать — 1 клик на вопрос
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-slate-900/60 px-3.5 py-1.5 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-300" />
            100% подтверждённые источники
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-slate-900/60 px-3.5 py-1.5 backdrop-blur-md">
            <Globe2 className="h-3.5 w-3.5 text-indigo-300" />
            8 сфер жизни • без воды и клише
          </span>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.42 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3.5"
        >
          {hasPartialProgress || hasCompleted ? (
            <>
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onResume}
                className="btn-shine inline-flex cursor-pointer items-center gap-2.5 rounded-2xl bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400 px-8 py-4 font-display text-base font-bold text-slate-950 shadow-[0_0_40px_rgba(45,212,191,0.38)] transition"
              >
                <span>
                  {hasCompleted
                    ? 'Открыть мои результаты'
                    : `Продолжить (${savedCount} из ${QUESTIONS.length})`}
                </span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              <button
                type="button"
                onClick={onStartNew}
                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/70 px-6 py-4 text-sm font-semibold text-slate-200 backdrop-blur-md transition hover:border-slate-500 hover:bg-slate-800/80"
              >
                <RotateCcw className="h-4 w-4" />
                Начать заново
              </button>
            </>
          ) : (
            <motion.button
              type="button"
              whileHover={{ scale: 1.035 }}
              whileTap={{ scale: 0.97 }}
              onClick={onStartNew}
              className="btn-shine inline-flex cursor-pointer items-center gap-3 rounded-2xl bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400 px-9 py-4 font-display text-base font-extrabold text-slate-950 shadow-[0_0_45px_rgba(45,212,191,0.4)] transition sm:text-lg"
            >
              <span>Узнать своё место на планете</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          )}
        </motion.div>

        {/* Live preview fact cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.52 }}
          className="mt-14 grid grid-cols-2 gap-3 text-left sm:gap-4 lg:grid-cols-4"
        >
          {PREVIEW_FACTS.map((fact, idx) => (
            <motion.div
              key={fact.source}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.56 + idx * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass-panel rounded-2xl p-4 sm:p-5"
            >
              <div className={`font-mono text-2xl font-bold sm:text-3xl ${fact.accent}`}>
                {fact.stat}
              </div>
              <p className="mt-1.5 text-xs leading-snug text-slate-200 sm:text-sm">
                {fact.label}
              </p>
              <div className="mt-3 font-mono text-[10px] tracking-wide text-slate-500 uppercase">
                {fact.source}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Authoritative source ticker footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
        className="border-t border-slate-800/70 pt-5 text-center"
      >
        <div className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">
          Подтверждённые базы данных
        </div>
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate-400">
          {SOURCE_BADGES.map((name) => (
            <span key={name} className="transition hover:text-slate-200">
              {name}
            </span>
          ))}
        </div>
      </motion.footer>
    </div>
  );
};
