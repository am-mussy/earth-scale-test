export type CategoryId =
  | 'education'
  | 'finance'
  | 'health'
  | 'digital'
  | 'safety'
  | 'freedom'
  | 'community'
  | 'growth';

export type PillarType = 'achievement' | 'foundation';

export type PopulationBaseKey =
  | 'world'         // ~8.2 млрд (все жители Земли, UN WPP 2024–2026)
  | 'adults'        // ~6.1 млрд (взрослые 15+ лет)
  | 'adults_wealth' // ~3.8–5.5 млрд (взрослое население по методике UBS)
  | 'workforce'     // ~3.6 млрд (мировая рабочая сила, ILO)
  | 'working_age'   // ~5.3 млрд (трудоспособное население 15–64 лет)
  | 'households';   // ~2.2 млрд (домохозяйства мира, ITU)

export interface CategoryMeta {
  id: CategoryId;
  title: string;
  shortTitle: string;
  subtitle: string;
  accentHex: string;
  accentGlow: string;
  gradientClass: string;
  badgeClass: string;
  ringClass: string;
  iconName: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  sublabel?: string;
  /**
   * Percentage of the reference population that the user is ahead of
   * when choosing this option (0 to 99).
   * Strictly derived from verified international reports.
   */
  aheadPercent: number;
  /**
   * Percentage of the reference population that belongs to this tier or above ("Top X%").
   * e.g., aheadPercent = 81 -> topPercent = 19 ("Топ-19%").
   */
  topPercent: number;
  /**
   * Normalized 0..100 score within this question for balanced 8-axis radar calculation.
   */
  normalizedScore: number;
  /**
   * Whether this answer represents an active advantage / positive benchmark.
   */
  isAhead: boolean;
  /**
   * Short empathetic micro-feedback shown right after answering or in the detail view.
   */
  feedback: string;
}

export interface VerifiedSource {
  organization: string;
  reportTitle: string;
  year: string;
  url: string;
  exactStat: string;
}

export interface Question {
  id: string;
  index: number;
  category: CategoryId;
  pillar: PillarType;
  shortName: string;
  prompt: string;
  hint?: string;
  populationBase: PopulationBaseKey;
  populationBaseLabel: string;
  /** Approximate population size in billions for the reference base */
  referenceBillions: number;
  options: QuestionOption[];
  source: VerifiedSource;
  /** Actionable growth tip if the user is not yet in the upper tier */
  growthTip?: {
    type: 'normalize' | 'action';
    title: string;
    description: string;
    targetTopPercent: number;
  };
}

export type AnswersMap = Record<string, string>;

export interface EvaluatedQuestion {
  question: Question;
  selectedOption: QuestionOption;
  aheadBillions: number;
}

export interface CategoryResult {
  category: CategoryMeta;
  /** 0..100 score on this axis based on normalized answers */
  axisScore: number;
  /** Average verified aheadPercent across the 4 questions in this category */
  avgAheadPercent: number;
  /** Number of questions where user holds an advantage */
  aheadCount: number;
  totalQuestions: number;
  items: EvaluatedQuestion[];
}

export interface Archetype {
  id: string;
  title: string;
  tagline: string;
  description: string;
  color: string;
}

export interface QuizResults {
  evaluated: EvaluatedQuestion[];
  categories: CategoryResult[];
  /** Average verified aheadPercent across all 32 indicators */
  averageAheadPercent: number;
  /** Composite 0..100 planetary score */
  globalIndex: number;
  /** Count of questions where user is ahead (isAhead === true) */
  aheadIndicatorsCount: number;
  /** Count of questions where user is in the top 50% (aheadPercent >= 50) */
  topHalfCount: number;
  /** Count of questions where user is in the top 25% (aheadPercent >= 75) */
  topQuarterCount: number;
  /** Rarest advantages sorted by highest aheadPercent first */
  rarestAdvantages: EvaluatedQuestion[];
  /** Two honest psychological layers */
  achievementLayer: {
    avgAheadPercent: number;
    score: number;
    count: number;
    winsCount: number;
    topItems: EvaluatedQuestion[];
  };
  foundationLayer: {
    avgAheadPercent: number;
    score: number;
    count: number;
    winsCount: number;
    topItems: EvaluatedQuestion[];
  };
  /** Empathetic normalization notes for any struggles selected */
  normalizations: EvaluatedQuestion[];
  /** High-leverage actionable growth items */
  growthOpportunities: EvaluatedQuestion[];
  archetype: Archetype;
  personalReflection: string;
}
