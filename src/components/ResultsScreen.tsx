import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Award,
  BookOpenCheck,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  Download,
  ExternalLink,
  Globe2,
  HeartHandshake,
  Layers,
  RotateCcw,
  Send,
  Sparkles,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { CATEGORY_MAP, QUESTIONS } from '../data/questions';
import { CategoryId, QuizResults } from '../types';
import { buildTextSummary, formatBillionsRu } from '../utils/scoring';
import { downloadResultCardPng } from '../utils/exportCard';
import { AnimatedNumber } from './AnimatedNumber';
import { CategoryIcon } from './CategoryIcon';
import { HumanityGrid } from './HumanityGrid';
import { RadarChart } from './RadarChart';

interface ResultsScreenProps {
  results: QuizResults;
  onRestart: () => void;
  onEditAnswers: () => void;
  onOpenMethodology: () => void;
}

type TableFilter = 'all' | 'ahead' | 'top50' | 'growth';

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  results,
  onRestart,
  onEditAnswers,
  onOpenMethodology,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(
    results.categories.slice().sort((a, b) => b.axisScore - a.axisScore)[0]
      ?.category.id ?? 'education',
  );
  const [tableFilter, setTableFilter] = useState<TableFilter>('all');
  const [copied, setCopied] = useState(false);

  const peak = results.rarestAdvantages[0] ?? null;

  const activeCategoryData =
    results.categories.find((c) => c.category.id === selectedCategory) ??
    results.categories[0];

  const filteredAll = useMemo(() => {
    switch (tableFilter) {
      case 'ahead':
        return results.evaluated
          .filter((e) => e.selectedOption.isAhead)
          .sort(
            (a, b) =>
              b.selectedOption.aheadPercent - a.selectedOption.aheadPercent,
          );
      case 'top50':
        return results.evaluated
          .filter((e) => e.selectedOption.aheadPercent >= 50)
          .sort(
            (a, b) =>
              b.selectedOption.aheadPercent - a.selectedOption.aheadPercent,
          );
      case 'growth':
        return results.evaluated.filter((e) => !e.selectedOption.isAhead);
      default:
        return results.evaluated;
    }
  }, [results.evaluated, tableFilter]);

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildTextSummary(results));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback ignored silently if clipboard blocked
    }
  };

  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
      {/* Top Action Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-400/30 bg-teal-400/10 text-teal-300">
            <Globe2 className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-sm font-bold text-white">
              Масштаб Земли
            </div>
            <div className="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
              Твой планетарный отчёт
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenMethodology}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-300 backdrop-blur-md transition hover:border-slate-500 hover:text-white"
          >
            <BookOpenCheck className="h-3.5 w-3.5 text-sky-300" />
            <span>Методология</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-200 backdrop-blur-md transition hover:border-teal-400/50 hover:text-teal-200"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-teal-300" />
                <span>Скопировано!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Скопировать</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => downloadResultCardPng(results)}
            className="btn-shine inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-400 to-sky-400 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-[0_0_24px_rgba(45,212,191,0.3)] transition hover:brightness-110"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Карточка PNG</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-400 transition hover:border-slate-500 hover:text-white"
            title="Пройти заново"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Заново</span>
          </button>
        </div>
      </motion.header>

      {/* ==================== SECTION 1: HERO ARCHETYPE & KPIs ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="glass-panel relative mt-7 overflow-hidden rounded-3xl p-6 sm:p-10"
      >
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-25"
          style={{ backgroundColor: results.archetype.color }}
        />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/35 bg-teal-400/12 px-3.5 py-1 text-xs font-semibold text-teal-200">
            <Award className="h-3.5 w-3.5 text-teal-300" />
            <span>Твой планетарный профиль</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {results.archetype.title}
          </h1>

          <p className="mt-2.5 text-lg font-medium text-teal-200/95 sm:text-xl">
            {results.archetype.tagline}
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {results.archetype.description}
          </p>

          {/* Personal verified reflection callout */}
          <div className="mt-6 rounded-2xl border border-slate-700/60 bg-slate-950/60 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <p className="text-sm leading-relaxed text-slate-200">
                {results.personalReflection}
              </p>
            </div>
          </div>

          {/* 4 Animated KPI Cards */}
          <div className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {/* KPI 1: Global Index */}
            <div className="rounded-2xl border border-slate-800/90 bg-slate-900/65 p-5">
              <div className="font-mono text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Планетарный индекс
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <AnimatedNumber
                  value={results.globalIndex}
                  className="font-display text-4xl font-extrabold text-teal-300"
                />
                <span className="font-mono text-sm text-slate-500">/ 100</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Сводный баланс по всем 32 показателям
              </div>
            </div>

            {/* KPI 2: Peak Rarest Advantage */}
            <div className="rounded-2xl border border-slate-800/90 bg-slate-900/65 p-5">
              <div className="font-mono text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Твой главный рекорд
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                {peak ? (
                  <>
                    <span className="font-display text-4xl font-extrabold text-sky-300">
                      Топ-
                      <AnimatedNumber value={peak.selectedOption.topPercent} />%
                    </span>
                  </>
                ) : (
                  <span className="font-display text-3xl font-extrabold text-amber-300">
                    Старт
                  </span>
                )}
              </div>
              <div className="mt-2 text-xs leading-snug text-slate-300">
                {peak
                  ? `${peak.question.shortName} (~${formatBillionsRu(peak.aheadBillions)} позади)`
                  : 'Честная точка разгона'}
              </div>
            </div>

            {/* KPI 3: Ahead indicators */}
            <div className="rounded-2xl border border-slate-800/90 bg-slate-900/65 p-5">
              <div className="font-mono text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Где ты впереди
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <AnimatedNumber
                  value={results.aheadIndicatorsCount}
                  className="font-display text-4xl font-extrabold text-indigo-300"
                />
                <span className="font-mono text-sm text-slate-500">
                  из {QUESTIONS.length}
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                {results.topHalfCount} — в Топ-50% мира, {results.topQuarterCount}{' '}
                — в Топ-25%
              </div>
            </div>

            {/* KPI 4: Personal Agency wins */}
            <div className="rounded-2xl border border-slate-800/90 bg-slate-900/65 p-5">
              <div className="font-mono text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Личные навыки и выбор
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <AnimatedNumber
                  value={results.achievementLayer.winsCount}
                  className="font-display text-4xl font-extrabold text-fuchsia-300"
                />
                <span className="font-mono text-sm text-slate-500">
                  из {results.achievementLayer.count}
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                То, что ты сам(а) освоил(а), выбрал(а) или отдал(а) миру
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ==================== SECTION 2: IF EARTH WERE 100 PEOPLE ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mt-7"
      >
        <HumanityGrid
          rarestAdvantages={results.rarestAdvantages}
          allEvaluated={results.evaluated}
        />
      </motion.section>

      {/* ==================== SECTION 3: TWO HONEST LAYERS ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        {/* Layer 1: Personal Skills & Choices */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-300">
              <Trophy className="h-3.5 w-3.5" />
              Слой 1 · Личный вклад и навыки
            </div>
            <span className="font-mono text-xl font-bold text-fuchsia-300">
              {results.achievementLayer.score}%
            </span>
          </div>

          <h3 className="mt-4 font-display text-xl font-bold text-white">
            То, что ты построил(а) сам(а)
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
            Языки, финансовая грамотность, плавание, спорт, ИИ/код, помощь людям,
            официальная работа и внутренний выбор. Это нельзя списать на простое
            везение.
          </p>

          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${results.achievementLayer.score}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-indigo-400"
            />
          </div>

          <div className="mt-5 space-y-2">
            {results.achievementLayer.topItems.length > 0 ? (
              results.achievementLayer.topItems.map((item) => (
                <div
                  key={item.question.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-slate-800/80 bg-slate-900/50 px-3.5 py-2.5 text-xs"
                >
                  <span className="font-medium text-slate-200">
                    {item.question.shortName}
                  </span>
                  <span className="shrink-0 font-mono font-bold text-fuchsia-300">
                    Топ-{item.selectedOption.topPercent}%
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 text-xs text-slate-400">
                Ниже мы собрали самые быстрые личные навыки, которые за пару
                недель переведут тебя в верхнюю половину планеты.
              </div>
            )}
          </div>
        </div>

        {/* Layer 2: Baseline Foundation */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-300">
              <Layers className="h-3.5 w-3.5" />
              Слой 2 · Базовая опора и условия
            </div>
            <span className="font-mono text-xl font-bold text-teal-300">
              {results.foundationLayer.score}%
            </span>
          </div>

          <h3 className="mt-4 font-display text-xl font-bold text-white">
            Фундамент, на котором ты стоишь
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
            Чистая вода, быт, еда, интернет, компьютер, медицина, безопасность и
            люди рядом. Мозг привыкает к ним и перестаёт их замечать — но это
            мощная стартовая база для следующего шага.
          </p>

          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${results.foundationLayer.score}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-teal-400 to-sky-400"
            />
          </div>

          <div className="mt-5 space-y-2">
            {results.foundationLayer.topItems.map((item) => (
              <div
                key={item.question.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-800/80 bg-slate-900/50 px-3.5 py-2.5 text-xs"
              >
                <span className="font-medium text-slate-200">
                  {item.question.shortName}
                </span>
                <span className="shrink-0 font-mono font-bold text-teal-300">
                  Впереди {item.selectedOption.aheadPercent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ==================== SECTION 4: 8-AXIS RADAR & SPHERES ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
        className="glass-panel mt-7 rounded-3xl p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-sky-300 uppercase">
              <Compass className="h-4 w-4" />
              Карта 8 сфер жизни
            </div>
            <h2 className="mt-1.5 font-display text-2xl font-bold text-white sm:text-3xl">
              Где твоя главная сила прямо сейчас
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Нажми на любую сферу, чтобы увидеть все 4 её показателя
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Radar Chart */}
          <div className="lg:col-span-5">
            <RadarChart
              categories={results.categories}
              activeCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Interactive Category Selector & Detail */}
          <div className="space-y-4 lg:col-span-7">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {results.categories.map((catRes) => {
                const isSelected = catRes.category.id === selectedCategory;
                return (
                  <button
                    key={catRes.category.id}
                    type="button"
                    onClick={() => setSelectedCategory(catRes.category.id)}
                    className={`cursor-pointer rounded-xl border p-2.5 text-left transition ${
                      isSelected
                        ? 'border-slate-400/70 bg-slate-800/80 shadow-md'
                        : 'border-slate-800 bg-slate-900/45 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span style={{ color: catRes.category.accentHex }}>
                        <CategoryIcon
                          categoryId={catRes.category.id}
                          className="h-4 w-4"
                        />
                      </span>
                      <span
                        className="font-mono text-xs font-bold"
                        style={{ color: catRes.category.accentHex }}
                      >
                        {catRes.axisScore}%
                      </span>
                    </div>
                    <div className="mt-1.5 truncate text-xs font-semibold text-slate-200">
                      {catRes.category.shortTitle}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Category 4-question breakdown */}
            {activeCategoryData && (
              <div className="rounded-2xl border border-slate-800/90 bg-slate-950/65 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border ${activeCategoryData.category.badgeClass}`}
                    >
                      <CategoryIcon
                        categoryId={activeCategoryData.category.id}
                        className="h-4 w-4"
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-white">
                        {activeCategoryData.category.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {activeCategoryData.category.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="font-mono text-xl font-bold"
                      style={{ color: activeCategoryData.category.accentHex }}
                    >
                      {activeCategoryData.axisScore}%
                    </div>
                    <div className="text-[11px] text-slate-400">
                      впереди в {activeCategoryData.aheadCount} из 4
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  {activeCategoryData.items.map((item) => (
                    <div
                      key={item.question.id}
                      className="rounded-xl border border-slate-800/80 bg-slate-900/55 p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-100 sm:text-sm">
                          {item.question.shortName}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold ${
                            item.selectedOption.isAhead
                              ? 'bg-teal-400/15 text-teal-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.selectedOption.isAhead
                            ? `Топ-${item.selectedOption.topPercent}% · впереди ${item.selectedOption.aheadPercent}%`
                            : 'Глобальное большинство'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        {item.selectedOption.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* ==================== SECTION 5: TOP 6 RAREST ADVANTAGES ==================== */}
      {results.rarestAdvantages.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="mt-7"
        >
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-teal-300 uppercase">
                <Trophy className="h-3.5 w-3.5" />
                Твои самые редкие вершины
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                Топ-6 показателей, где ты особенно далеко впереди
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            {results.rarestAdvantages.slice(0, 6).map((item, idx) => {
              const cat = CATEGORY_MAP[item.question.category];
              return (
                <motion.div
                  key={item.question.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-panel rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800/90 font-mono text-xs font-bold text-slate-300">
                        #{idx + 1}
                      </span>
                      <div>
                        <h3 className="font-display text-base font-bold text-white">
                          {item.question.shortName}
                        </h3>
                        <div className="text-[11px] text-slate-400">
                          {cat.title} • {item.question.populationBaseLabel}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 rounded-xl border border-teal-400/35 bg-teal-400/12 px-3 py-1 font-mono text-xs font-bold text-teal-200">
                      Топ-{item.selectedOption.topPercent}%
                    </div>
                  </div>

                  {/* Animated percentile bar */}
                  <div className="mt-4">
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
                      <span className="font-semibold text-slate-200">
                        Впереди {item.selectedOption.aheadPercent}% (~
                        {formatBillionsRu(item.aheadBillions)} чел.)
                      </span>
                      <a
                        href={item.question.source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center gap-1 text-[11px] text-sky-300 hover:underline"
                      >
                        {item.question.source.organization}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/90">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${Math.max(8, item.selectedOption.aheadPercent)}%`,
                        }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.85, delay: 0.1 + idx * 0.05 }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${cat.accentHex}, #2dd4bf)`,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* ==================== SECTION 6: NORMALIZATION & GROWTH LEVERS ==================== */}
      {(results.normalizations.length > 0 ||
        results.growthOpportunities.length > 0) && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2"
        >
          {/* Empathetic Normalization Cards */}
          {results.normalizations.length > 0 && (
            <div className="glass-panel rounded-3xl p-6 sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                <HeartHandshake className="h-3.5 w-3.5" />
                Важно знать · ты не один(а)
              </div>
              <h3 className="mt-3 font-display text-xl font-bold text-white">
                Там, где сейчас непросто — ты в огромном большинстве мира
              </h3>
              <div className="mt-4 space-y-3">
                {results.normalizations.map((item) => (
                  <div
                    key={item.question.id}
                    className="rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4"
                  >
                    <div className="text-sm font-bold text-amber-100">
                      {item.question.growthTip?.title}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300">
                      {item.question.growthTip?.description}
                    </p>
                    <div className="mt-2 font-mono text-[10px] text-slate-400">
                      Источник: {item.question.source.organization} (
                      {item.question.source.year})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable High-Leverage Growth Tips */}
          {results.growthOpportunities.length > 0 && (
            <div
              className={`glass-panel rounded-3xl p-6 sm:p-7 ${
                results.normalizations.length === 0 ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                <TrendingUp className="h-3.5 w-3.5" />
                Точки лёгкого рывка
              </div>
              <h3 className="mt-3 font-display text-xl font-bold text-white">
                Где реально обогнать миллиарды за ближайшие месяцы
              </h3>
              <div className="mt-4 space-y-3">
                {results.growthOpportunities.slice(0, 4).map((item) => (
                  <div
                    key={item.question.id}
                    className="rounded-2xl border border-emerald-400/20 bg-emerald-950/20 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-emerald-100">
                        {item.question.growthTip?.title}
                      </span>
                      <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-300">
                        → Топ-{item.question.growthTip?.targetTopPercent}%
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300">
                      {item.question.growthTip?.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.section>
      )}

      {/* ==================== SECTION 7: ALL 32 VERIFIED INDICATORS & SOURCES ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.5 }}
        className="glass-panel mt-7 rounded-3xl p-6 sm:p-8"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-400 uppercase">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-300" />
              Полная прозрачность данных
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              Все 32 показателя и подтверждённые источники
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['all', `Все (${QUESTIONS.length})`],
                ['ahead', `Впереди (${results.aheadIndicatorsCount})`],
                ['top50', `Топ-50% (${results.topHalfCount})`],
                [
                  'growth',
                  `Зона роста (${QUESTIONS.length - results.aheadIndicatorsCount})`,
                ],
              ] as Array<[TableFilter, string]>
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTableFilter(key)}
                className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                  tableFilter === key
                    ? 'border-teal-400/60 bg-teal-400/15 text-teal-200'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 divide-y divide-slate-800/75">
          {filteredAll.map((item) => {
            const cat = CATEGORY_MAP[item.question.category];
            return (
              <div
                key={item.question.id}
                className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: cat.accentHex }}
                    />
                    <span className="text-sm font-semibold text-white">
                      {item.question.shortName}
                    </span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-400">
                      Твой ответ: {item.selectedOption.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    {item.question.source.exactStat}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span>База: {item.question.populationBaseLabel}</span>
                    <span>•</span>
                    <a
                      href={item.question.source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sky-300/90 hover:text-sky-200 hover:underline"
                    >
                      {item.question.source.organization}:{' '}
                      {item.question.source.reportTitle} (
                      {item.question.source.year})
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="shrink-0 sm:text-right">
                  {item.selectedOption.isAhead ? (
                    <div className="inline-flex flex-col items-start sm:items-end">
                      <span className="rounded-lg border border-teal-400/35 bg-teal-400/12 px-2.5 py-1 font-mono text-xs font-bold text-teal-200">
                        Топ-{item.selectedOption.topPercent}%
                      </span>
                      <span className="mt-1 font-mono text-[11px] text-slate-400">
                        впереди {item.selectedOption.aheadPercent}% (~
                        {formatBillionsRu(item.aheadBillions)})
                      </span>
                    </div>
                  ) : (
                    <span className="inline-block rounded-lg border border-slate-700/80 bg-slate-900/70 px-2.5 py-1 font-mono text-xs text-slate-400">
                      Точка роста
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* ==================== CLOSING HUMAN PERSPECTIVE FOOTER ==================== */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-8 rounded-3xl border border-slate-800/80 bg-slate-950/60 p-6 text-center sm:p-8"
      >
        <p className="mx-auto max-w-2xl font-display text-lg font-bold text-white sm:text-xl">
          Этот момент — не финиш, а точка, из которой виден твой настоящий масштаб.
        </p>
        <p className="mx-auto mt-2.5 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
          Средняя ожидаемая продолжительность жизни на Земле превысила 73 года
          (ВОЗ, 2024–2025). Твоя реальная опора и накопленный опыт намного
          сильнее, чем шепчет внутренний критик.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => downloadResultCardPng(results)}
            className="btn-shine inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-400 to-sky-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_0_28px_rgba(45,212,191,0.3)] transition hover:brightness-110"
          >
            <Download className="h-4 w-4" />
            Сохранить карточку результата (PNG)
          </button>
          <button
            type="button"
            onClick={onEditAnswers}
            className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
          >
            Пересмотреть ответы
          </button>
        </div>
      </motion.footer>

      {/* ==================== AUTHOR TELEGRAM CHANNEL CARD ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mt-7 mb-4"
      >
        <a
          href="https://t.me/coverjs"
          target="_blank"
          rel="noreferrer"
          className="glass-panel glass-card-hover group relative block overflow-hidden rounded-3xl border border-sky-400/25 p-6 sm:p-8"
        >
          {/* Ambient Telegram glow */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-sky-400/15 blur-3xl transition-opacity duration-300 group-hover:opacity-90" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-sky-400/40 bg-gradient-to-br from-sky-400/25 to-indigo-500/20 text-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.22)] transition-transform duration-300 group-hover:scale-105">
                <Send className="h-6 w-6 -translate-x-0.5 translate-y-0.5" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/12 px-3 py-0.5 text-[11px] font-semibold text-sky-200">
                    Telegram-канал автора
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    @coverjs
                  </span>
                </div>

                <h3 className="mt-2.5 font-display text-xl font-bold text-white transition-colors group-hover:text-sky-200 sm:text-2xl">
                  Mustafa | Ковры с привкусом убыточного SaaS
                </h3>

                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-300">
                  Frontend разработчик уже 5й год, здесь пишу о разработке, об
                  инструментах и о жизни.
                </p>
              </div>
            </div>

            <div className="btn-shine inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-400 px-6 py-3.5 font-display text-sm font-bold text-slate-950 shadow-[0_0_28px_rgba(56,189,248,0.32)] transition-transform duration-200 group-hover:scale-[1.03]">
              <span>Подписаться</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </a>
      </motion.section>
    </div>
  );
};
