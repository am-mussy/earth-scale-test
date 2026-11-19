import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles } from 'lucide-react';
import { EvaluatedQuestion } from '../types';
import { formatBillionsRu, pluralPeopleRu } from '../utils/scoring';

interface HumanityGridProps {
  rarestAdvantages: EvaluatedQuestion[];
  allEvaluated: EvaluatedQuestion[];
}

export const HumanityGrid: React.FC<HumanityGridProps> = ({
  rarestAdvantages,
  allEvaluated,
}) => {
  const candidates = useMemo(() => {
    const list = rarestAdvantages.slice(0, 8);
    return list.length > 0 ? list : allEvaluated.slice(0, 6);
  }, [rarestAdvantages, allEvaluated]);

  const [selectedId, setSelectedId] = useState<string>(
    candidates[0]?.question.id ?? '',
  );

  const active =
    candidates.find((c) => c.question.id === selectedId) ?? candidates[0];

  if (!active) return null;

  const topCount = Math.max(1, Math.min(100, Math.round(active.selectedOption.topPercent)));
  const aheadCount = Math.max(0, 100 - topCount);

  return (
    <div className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left column: explanation & switcher */}
        <div className="flex-1 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-teal-300 uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Если бы на Земле жило 100 человек
          </div>

          <div>
            <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {active.question.shortName}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
              Из 100 случайных людей на планете в твоей группе оказывается всего{' '}
              <span className="font-mono font-bold text-teal-300">
                {topCount} {pluralPeopleRu(topCount)}
              </span>
              {aheadCount > 0 ? (
                <>
                  {' '}
                  — а{' '}
                  <span className="font-semibold text-white">
                    {aheadCount} {pluralPeopleRu(aheadCount)}
                  </span>{' '}
                  (~{formatBillionsRu(active.aheadBillions)} в реальном масштабе)
                  не имеют этого преимущества.
                </>
              ) : (
                <> — это распространённый глобальный опыт.</>
              )}
            </p>
          </div>

          {/* Indicator selector pills */}
          <div className="flex flex-wrap gap-2">
            {candidates.map((item) => {
              const isSelected = item.question.id === active.question.id;
              return (
                <button
                  key={item.question.id}
                  type="button"
                  onClick={() => setSelectedId(item.question.id)}
                  className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-teal-400/60 bg-teal-400/15 text-teal-200 shadow-[0_0_20px_rgba(45,212,191,0.2)]'
                      : 'border-slate-700/70 bg-slate-900/50 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                  }`}
                >
                  <span>{item.question.shortName}</span>
                  <span className="ml-1.5 font-mono text-[11px] opacity-80">
                    Топ-{item.selectedOption.topPercent}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Verified source caption */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-slate-400">
            <span>База: {active.question.populationBaseLabel}</span>
            <span className="text-slate-600">•</span>
            <a
              href={active.question.source.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sky-300 underline decoration-sky-400/40 underline-offset-2 hover:text-sky-200"
            >
              {active.question.source.organization} ({active.question.source.year})
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Right column: Animated 10x10 humanity dot matrix */}
        <div className="flex flex-col items-center lg:items-end">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4 sm:p-5">
            <div className="grid grid-cols-10 gap-2 sm:gap-2.5">
              {Array.from({ length: 100 }, (_, idx) => {
                const isYou = idx === 0;
                const isInTopGroup = idx < topCount;
                return (
                  <motion.div
                    key={idx}
                    initial={false}
                    animate={{
                      scale: isYou ? 1.25 : isInTopGroup ? 1 : 0.85,
                      backgroundColor: isYou
                        ? '#facc15'
                        : isInTopGroup
                          ? '#2dd4bf'
                          : 'rgba(100, 116, 139, 0.28)',
                      boxShadow: isYou
                        ? '0 0 14px rgba(250, 204, 21, 0.85)'
                        : isInTopGroup
                          ? '0 0 10px rgba(45, 212, 191, 0.45)'
                          : 'none',
                    }}
                    transition={{
                      duration: 0.32,
                      delay: Math.min(idx * 0.004, 0.28),
                    }}
                    className="h-3 w-3 rounded-full sm:h-3.5 sm:w-3.5"
                    title={
                      isYou
                        ? 'Ты'
                        : isInTopGroup
                          ? 'Люди в твоей группе'
                          : 'Люди без этого преимущества'
                    }
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                <span className="text-slate-200">Ты</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-400" />
                <span>Твоя группа ({topCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600/60" />
                <span>Позади ({aheadCount})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
