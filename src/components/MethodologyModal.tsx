import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpenCheck, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { QUESTIONS } from '../data/questions';

interface MethodologyModalProps {
  open: boolean;
  onClose: () => void;
}

const UNIQUE_SOURCES = Array.from(
  new Map(
    QUESTIONS.map((q) => [
      `${q.source.organization}::${q.source.reportTitle}`,
      q.source,
    ]),
  ).values(),
);

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel relative max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="absolute top-5 right-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-700/70 bg-slate-900/80 text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-300">
              <BookOpenCheck className="h-3.5 w-3.5" />
              Честная методология и источники
            </div>

            <h2 className="mt-4 font-display text-2xl font-bold text-white">
              Откуда взяты цифры в этом тесте?
            </h2>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
              <p>
                Каждый из 32 вопросов опирается на официальные глобальные отчёты
                2020–2026 годов: Всемирный банк, ВОЗ, ЮНЕСКО, ЮНИСЕФ, МОТ, МСЭ
                (ООН), ФАО, UBS Global Wealth Report, Gallup World Poll, Meta–Gallup,
                CAF World Giving Index, S&P Global FinLit Survey, Ethnologue,
                GitHub Octoverse и Microsoft AI Economy Institute.
              </p>
              <div className="rounded-2xl border border-teal-400/25 bg-teal-400/8 p-4 text-slate-200">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-300" />
                  <div className="text-xs leading-relaxed sm:text-sm">
                    <strong className="text-teal-200">
                      Никакой фальшивой математики:
                    </strong>{' '}
                    мы намеренно НЕ перемножаем вероятности всех 32 показателей,
                    чтобы выдать красивую, но ложную цифру «ты в топ 0,0001%».
                    Глобальные факторы связаны между собой. Вместо этого ты видишь
                    честный перцентиль по каждому показателю отдельно, базу
                    сравнения (все 8,2 млрд людей, взрослые 15+ или рабочая сила)
                    и разделение на <strong>личные навыки/выбор</strong> и{' '}
                    <strong>базовую опору</strong>.
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Все ответы хранятся только локально в твоём браузере и никуда не
                отправляются.
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Подтверждённые отчёты ({UNIQUE_SOURCES.length})
              </h3>
              <div className="mt-3 space-y-2">
                {UNIQUE_SOURCES.map((src) => (
                  <a
                    key={`${src.organization}-${src.reportTitle}`}
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-900/50 p-3 transition hover:border-sky-400/40 hover:bg-slate-900/90"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-sky-200">
                        {src.organization}{' '}
                        <span className="font-mono font-normal text-slate-400">
                          ({src.year})
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400">
                        {src.reportTitle}
                      </div>
                    </div>
                    <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500 transition group-hover:text-sky-300" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
