import { CATEGORIES, QUESTIONS } from '../data/questions';
import {
  AnswersMap,
  Archetype,
  CategoryResult,
  EvaluatedQuestion,
  QuizResults,
} from '../types';

export function formatBillionsRu(billions: number): string {
  if (billions >= 1) {
    return `${billions.toFixed(1).replace('.', ',')} млрд`;
  }
  const millions = Math.round(billions * 1000);
  return `${millions} млн`;
}

export function pluralPeopleRu(count: number): string {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return 'человек';
  if (mod10 >= 2 && mod10 <= 4) return 'человека';
  return 'человек';
}

function resolveArchetype(
  categories: CategoryResult[],
  globalIndex: number,
  achievementScore: number,
  foundationScore: number,
): Archetype {
  const sorted = [...categories].sort((a, b) => b.axisScore - a.axisScore);
  const topCat = sorted[0]?.category.id;
  const secondCat = sorted[1]?.category.id;

  if (globalIndex >= 82) {
    return {
      id: 'planetary_vanguard',
      title: 'Авангард планеты',
      tagline: 'Ты уже живёшь на уровне, о котором мечтает большинство человечества',
      description:
        'Твои результаты опережают мировые медианы почти по всем направлениям — и в личных навыках, и в устойчивости жизни. Сомнения в себе на таком уровне возникают не от нехватки достижений, а от привычки сравнивать себя только с верхним 1%.',
      color: '#2dd4bf',
    };
  }

  if (topCat === 'digital' || (topCat === 'education' && secondCat === 'digital')) {
    return {
      id: 'digital_pioneer',
      title: 'Цифровой первопроходец',
      tagline: 'Твой главный капитал — интеллект и инструменты будущего',
      description:
        'Ты владеешь знаниями и технологиями, которые дают колоссальный рычаг в XXI веке. Даже если кажется, что видимых «трофеев» мало, твоя когнитивная и цифровая база уже опережает миллиарды людей на планете.',
      color: '#38bdf8',
    };
  }

  if (topCat === 'community' || (topCat === 'growth' && secondCat === 'community')) {
    return {
      id: 'human_anchor',
      title: 'Опора и человеческое тепло',
      tagline: 'Ты силён в том, что невозможно купить за деньги',
      description:
        'В мире, где четверть планеты страдает от одиночества, а миллионы лишены поддержки, твоя способность строить связи, сохранять уважение и помогать другим — редчайший и недооценённый вид жизненного успеха.',
      color: '#f472b6',
    };
  }

  if (topCat === 'health' || secondCat === 'health') {
    return {
      id: 'vital_builder',
      title: 'Хранитель ресурса',
      tagline: 'У тебя крепкая телесная и жизненная база для долгой дистанции',
      description:
        'Здоровье, движение и навыки тела — фундамент, без которого меркнут любые внешние статусы. В любом возрасте такая база даёт тебе серьёзную фору на длинной дистанции.',
      color: '#fb7185',
    };
  }

  if (topCat === 'finance' || topCat === 'freedom') {
    return {
      id: 'quiet_strategist',
      title: 'Тихий стратег',
      tagline: 'Ты выстроил(а) реальную автономность и свободу манёвра',
      description:
        'Незаметно для самого себя ты создал(а) финансовую и жизненную опору, недоступную большей части планеты. У тебя есть пространство для выбора — а это и есть взрослая свобода.',
      color: '#34d399',
    };
  }

  if (achievementScore > foundationScore + 10) {
    return {
      id: 'self_made_spark',
      title: 'Архитектор себя',
      tagline: 'Твои личные навыки и усилия опережают стартовые условия',
      description:
        'Ты добиваешься многого за счёт собственного выбора, обучения и привычек, даже когда внешние обстоятельства не идеальны. Это говорит о внутренней силе, которую часто не замечаешь изнутри.',
      color: '#a78bfa',
    };
  }

  if (globalIndex >= 55) {
    return {
      id: 'steady_navigator',
      title: 'Человек с прочной опорой',
      tagline: 'Ты дальше, чем тебе кажется в моменты сомнений',
      description:
        'У тебя уже собран крепкий каркас жизни: во многих фундаментальных сферах ты впереди миллиардов людей. Осталось направить энергию в 1–2 конкретные точки роста — и ощущение застоя растворится.',
      color: '#60a5fa',
    };
  }

  return {
    id: 'rising_horizon',
    title: 'Точка разгона',
    tagline: 'Честный взгляд на реальность — лучшая стартовая площадка',
    description:
      'Даже сейчас у тебя есть реальные сильные стороны в мировом масштабе, а главное — ты честно смотришь на свою жизнь без иллюзий. Самый большой рост в жизни почти всегда начинается после честной инвентаризации.',
    color: '#fbbf24',
  };
}

function buildPersonalReflection(
  results: Pick<
    QuizResults,
    | 'aheadIndicatorsCount'
    | 'topHalfCount'
    | 'rarestAdvantages'
    | 'achievementLayer'
    | 'foundationLayer'
    | 'normalizations'
  >,
): string {
  const best = results.rarestAdvantages[0];
  const hasStruggle = results.normalizations.length > 0;

  const parts: string[] = [];

  if (best && best.selectedOption.aheadPercent >= 50) {
    parts.push(
      `Твой самый редкий показатель — «${best.question.shortName}»: здесь ты в Топ-${best.selectedOption.topPercent}% (впереди примерно ${formatBillionsRu(best.aheadBillions)} человек).`,
    );
  }

  parts.push(
    `В целом ты опережаешь существенную часть планеты в ${results.aheadIndicatorsCount} из ${QUESTIONS.length} проверенных сфер, а в ${results.topHalfCount} из них входишь в верхнюю половину мира.`,
  );

  if (results.achievementLayer.winsCount >= 6) {
    parts.push(
      `Важно: ${results.achievementLayer.winsCount} из этих побед — не везение со стартом, а твои личные навыки, привычки и осознанный выбор.`,
    );
  }

  if (hasStruggle) {
    parts.push(
      'А сомнения, усталость или чувство «я отстаю» — это не личный сбой: по данным Gallup, через это прямо сейчас проходят около 70% взрослых на Земле.',
    );
  } else {
    parts.push(
      'Ощущение «я ничего не достиг» чаще всего рождается из искажённой ленты соцсетей, где 8,2 миллиарда реальных судеб сжимаются до витрины 0,01% чужих пиков.',
    );
  }

  return parts.join(' ');
}

export function calculateResults(answers: AnswersMap): QuizResults {
  const evaluated: EvaluatedQuestion[] = QUESTIONS.map((question) => {
    const chosenId = answers[question.id];
    const selectedOption =
      question.options.find((opt) => opt.id === chosenId) ??
      question.options[question.options.length - 1];
    const aheadBillions =
      (selectedOption.aheadPercent / 100) * question.referenceBillions;

    return {
      question,
      selectedOption,
      aheadBillions,
    };
  });

  const categories: CategoryResult[] = CATEGORIES.map((category) => {
    const items = evaluated.filter((e) => e.question.category === category.id);
    const axisScore = Math.round(
      items.reduce((sum, e) => sum + e.selectedOption.normalizedScore, 0) /
        Math.max(1, items.length),
    );
    const avgAheadPercent = Math.round(
      items.reduce((sum, e) => sum + e.selectedOption.aheadPercent, 0) /
        Math.max(1, items.length),
    );
    const aheadCount = items.filter((e) => e.selectedOption.isAhead).length;

    return {
      category,
      axisScore,
      avgAheadPercent,
      aheadCount,
      totalQuestions: items.length,
      items,
    };
  });

  const globalIndex = Math.round(
    evaluated.reduce((sum, e) => sum + e.selectedOption.normalizedScore, 0) /
      evaluated.length,
  );

  const aheadItems = evaluated.filter((e) => e.selectedOption.isAhead);
  const averageAheadPercent = Math.round(
    aheadItems.length > 0
      ? aheadItems.reduce((sum, e) => sum + e.selectedOption.aheadPercent, 0) /
          aheadItems.length
      : 0,
  );

  const aheadIndicatorsCount = aheadItems.length;
  const topHalfCount = evaluated.filter(
    (e) => e.selectedOption.aheadPercent >= 50,
  ).length;
  const topQuarterCount = evaluated.filter(
    (e) => e.selectedOption.aheadPercent >= 75,
  ).length;

  const rarestAdvantages = [...aheadItems].sort(
    (a, b) => b.selectedOption.aheadPercent - a.selectedOption.aheadPercent,
  );

  const achievementItems = evaluated.filter(
    (e) => e.question.pillar === 'achievement',
  );
  const foundationItems = evaluated.filter(
    (e) => e.question.pillar === 'foundation',
  );

  const makeLayer = (items: EvaluatedQuestion[]) => {
    const wins = items.filter((e) => e.selectedOption.isAhead);
    const score = Math.round(
      items.reduce((sum, e) => sum + e.selectedOption.normalizedScore, 0) /
        Math.max(1, items.length),
    );
    const avgAhead = Math.round(
      wins.length > 0
        ? wins.reduce((sum, e) => sum + e.selectedOption.aheadPercent, 0) /
            wins.length
        : 0,
    );
    const topItems = [...wins]
      .sort((a, b) => b.selectedOption.aheadPercent - a.selectedOption.aheadPercent)
      .slice(0, 4);

    return {
      avgAheadPercent: avgAhead,
      score,
      count: items.length,
      winsCount: wins.length,
      topItems,
    };
  };

  const achievementLayer = makeLayer(achievementItems);
  const foundationLayer = makeLayer(foundationItems);

  const normalizations = evaluated.filter(
    (e) =>
      !e.selectedOption.isAhead && e.question.growthTip?.type === 'normalize',
  );

  const growthOpportunities = evaluated
    .filter(
      (e) =>
        !e.selectedOption.isAhead && e.question.growthTip?.type === 'action',
    )
    .sort(
      (a, b) =>
        (a.question.growthTip?.targetTopPercent ?? 100) -
        (b.question.growthTip?.targetTopPercent ?? 100),
    );

  const archetype = resolveArchetype(
    categories,
    globalIndex,
    achievementLayer.score,
    foundationLayer.score,
  );

  const personalReflection = buildPersonalReflection({
    aheadIndicatorsCount,
    topHalfCount,
    rarestAdvantages,
    achievementLayer,
    foundationLayer,
    normalizations,
  });

  return {
    evaluated,
    categories,
    averageAheadPercent,
    globalIndex,
    aheadIndicatorsCount,
    topHalfCount,
    topQuarterCount,
    rarestAdvantages,
    achievementLayer,
    foundationLayer,
    normalizations,
    growthOpportunities,
    archetype,
    personalReflection,
  };
}

export function buildTextSummary(results: QuizResults): string {
  const top5 = results.rarestAdvantages
    .slice(0, 5)
    .map(
      (item) =>
        `• ${item.question.shortName}: Топ-${item.selectedOption.topPercent}% (впереди ${item.selectedOption.aheadPercent}% — ~${formatBillionsRu(item.aheadBillions)} чел.)`,
    )
    .join('\n');

  return [
    `🌍 Масштаб Земли — мой планетарный профиль`,
    `Архетип: ${results.archetype.title}`,
    `Планетарный индекс: ${results.globalIndex} / 100`,
    `Сфер с преимуществом: ${results.aheadIndicatorsCount} из ${QUESTIONS.length} (${results.topHalfCount} — в верхней половине мира)`,
    ``,
    `Мои самые редкие преимущества на планете:`,
    top5 || '• Точка честного старта и роста',
    ``,
    `Источники: ООН, ВОЗ, Всемирный банк, ЮНЕСКО, МОТ, МСЭ, UBS, Gallup, Ethnologue.`,
  ].join('\n');
}
