import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe2 } from 'lucide-react';

interface SynthesisScreenProps {
  onComplete: () => void;
}

const STAGES = [
  'Сопоставляем 32 показателя с данными 8,2 млрд жителей Земли…',
  'Сверяем статистику World Bank, WHO, UNESCO и ILO…',
  'Анализируем отчёты UBS, ITU, Gallup и Ethnologue…',
  'Формируем твой личный планетарный профиль…',
];

export const SynthesisScreen: React.FC<SynthesisScreenProps> = ({
  onComplete,
}) => {
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStageIdx((prev) => Math.min(prev + 1, STAGES.length - 1));
    }, 480);
    const doneTimer = window.setTimeout(() => {
      onComplete();
    }, 2050);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* Pulsing Orbital Rings */}
      <div className="relative flex h-36 w-36 items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-teal-400/45"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full border border-sky-400/40"
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-7 rounded-full bg-teal-400/20 blur-md"
        />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-300/40 bg-slate-900/90 text-teal-300 shadow-[0_0_30px_rgba(45,212,191,0.35)]">
          <Globe2 className="h-8 w-8" />
        </div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 font-display text-2xl font-bold text-white sm:text-3xl"
      >
        Вычисляем масштаб твоей жизни
      </motion.h2>

      <motion.p
        key={stageIdx}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 max-w-md text-sm text-slate-200 sm:text-base"
      >
        {STAGES[stageIdx]}
      </motion.p>

      {/* Progress Bar */}
      <div className="mt-7 h-1.5 w-64 overflow-hidden rounded-full bg-slate-800/90">
        <motion.div
          initial={{ width: '4%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.95, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400"
        />
      </div>
    </div>
  );
};
