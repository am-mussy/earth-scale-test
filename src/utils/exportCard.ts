import { QuizResults } from '../types';
import { formatBillionsRu } from './scoring';

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3,
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let lineCount = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    const width = ctx.measureText(testLine).width;
    if (width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = words[i];
      currentY += lineHeight;
      lineCount++;
      if (lineCount >= maxLines - 1) {
        const remaining = words.slice(i).join(' ');
        ctx.fillText(
          remaining.length > 68 ? `${remaining.slice(0, 65)}...` : remaining,
          x,
          currentY,
        );
        return currentY + lineHeight;
      }
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

export function downloadResultCardPng(results: QuizResults): void {
  const width = 1080;
  const height = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Deep cosmic background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#050915');
  bgGrad.addColorStop(0.5, '#0a1226');
  bgGrad.addColorStop(1, '#060a18');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Atmospheric glows
  const glow1 = ctx.createRadialGradient(200, 180, 10, 200, 180, 520);
  glow1.addColorStop(0, 'rgba(45, 212, 191, 0.22)');
  glow1.addColorStop(1, 'rgba(45, 212, 191, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  const glow2 = ctx.createRadialGradient(900, 960, 10, 900, 960, 520);
  glow2.addColorStop(0, 'rgba(129, 140, 248, 0.20)');
  glow2.addColorStop(1, 'rgba(129, 140, 248, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  // Subtle starfield dots
  for (let i = 0; i < 95; i++) {
    const sx = ((i * 197 + 43) % (width - 40)) + 20;
    const sy = ((i * 313 + 71) % (height - 40)) + 20;
    const sr = (i % 3) * 0.6 + 0.6;
    ctx.fillStyle = `rgba(226, 232, 240, ${0.12 + (i % 5) * 0.06})`;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Outer card border
  roundRect(ctx, 44, 44, width - 88, height - 88, 36);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Header badge
  roundRect(ctx, 88, 92, 430, 46, 23);
  ctx.fillStyle = 'rgba(45, 212, 191, 0.14)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#5eead4';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillText('МАСШТАБ ЗЕМЛИ • 8,2 МЛРД ЛЮДЕЙ', 114, 122);

  // Archetype title
  ctx.fillStyle = '#f8fafc';
  ctx.font = '800 58px "Manrope", system-ui, sans-serif';
  ctx.fillText(results.archetype.title, 88, 222);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 26px "Inter", system-ui, sans-serif';
  wrapText(ctx, results.archetype.tagline, 88, 272, 900, 36, 2);

  // 3 KPI tiles
  const best = results.rarestAdvantages[0];
  const kpis = [
    {
      label: 'ПЛАНЕТАРНЫЙ ИНДЕКС',
      value: `${results.globalIndex} / 100`,
      sub: 'по 32 показателям',
      color: '#2dd4bf',
    },
    {
      label: 'САМОЕ РЕДКОЕ ПРЕИМУЩЕСТВО',
      value: best ? `ТОП-${best.selectedOption.topPercent}%` : 'СТАРТ',
      sub: best ? best.question.shortName : 'Время роста',
      color: '#38bdf8',
    },
    {
      label: 'В ВЕРХНЕЙ ПОЛОВИНЕ МИРА',
      value: `${results.topHalfCount} из 32`,
      sub: `впереди в ${results.aheadIndicatorsCount} сферах`,
      color: '#c084fc',
    },
  ];

  kpis.forEach((kpi, idx) => {
    const bx = 88 + idx * 308;
    const by = 355;
    roundRect(ctx, bx, by, 288, 162, 24);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 15px "JetBrains Mono", monospace';
    ctx.fillText(kpi.label, bx + 22, by + 38);

    ctx.fillStyle = kpi.color;
    ctx.font = '800 44px "Manrope", system-ui, sans-serif';
    ctx.fillText(kpi.value, bx + 22, by + 100);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 19px "Inter", system-ui, sans-serif';
    const subText = kpi.sub.length > 24 ? `${kpi.sub.slice(0, 22)}…` : kpi.sub;
    ctx.fillText(subText, bx + 22, by + 138);
  });

  // Top 5 rarest advantages section
  ctx.fillStyle = '#f1f5f9';
  ctx.font = '700 28px "Manrope", system-ui, sans-serif';
  ctx.fillText('Где ты особенно далеко впереди планеты', 88, 582);

  const top5 = results.rarestAdvantages.slice(0, 5);
  top5.forEach((item, idx) => {
    const rowY = 616 + idx * 88;
    roundRect(ctx, 88, rowY, 904, 72, 18);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 23px "Inter", system-ui, sans-serif';
    ctx.fillText(item.question.shortName, 114, rowY + 34);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 17px "Inter", system-ui, sans-serif';
    ctx.fillText(
      `Впереди ${item.selectedOption.aheadPercent}% (~${formatBillionsRu(item.aheadBillions)} чел.) • ${item.question.source.organization}`,
      114,
      rowY + 59,
    );

    // Top badge right
    const pillText = `ТОП-${item.selectedOption.topPercent}%`;
    roundRect(ctx, 838, rowY + 17, 134, 38, 19);
    ctx.fillStyle = 'rgba(45, 212, 191, 0.18)';
    ctx.fill();
    ctx.fillStyle = '#5eead4';
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.fillText(pillText, 858, rowY + 43);
  });

  // 8 Categories mini grid at bottom
  ctx.fillStyle = '#f1f5f9';
  ctx.font = '700 26px "Manrope", system-ui, sans-serif';
  ctx.fillText('Профиль по 8 сферам жизни', 88, 1106);

  results.categories.forEach((catRes, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cx = 88 + col * 462;
    const cy = 1134 + row * 38;

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 19px "Inter", system-ui, sans-serif';
    ctx.fillText(catRes.category.shortTitle, cx, cy + 16);

    // Bar track
    roundRect(ctx, cx + 146, cy + 4, 232, 14, 7);
    ctx.fillStyle = 'rgba(148, 163, 184, 0.18)';
    ctx.fill();

    // Bar fill
    const fillW = Math.max(14, (232 * catRes.axisScore) / 100);
    roundRect(ctx, cx + 146, cy + 4, fillW, 14, 7);
    ctx.fillStyle = catRes.category.accentHex;
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 18px "JetBrains Mono", monospace';
    ctx.fillText(`${catRes.axisScore}%`, cx + 392, cy + 17);
  });

  // Footer credits
  ctx.fillStyle = '#64748b';
  ctx.font = '500 17px "Inter", system-ui, sans-serif';
  ctx.fillText(
    'Подтверждённые данные: ООН • ВОЗ • Всемирный банк • ЮНЕСКО • МОТ • МСЭ • UBS • Gallup • Ethnologue',
    88,
    1292,
  );

  const link = document.createElement('a');
  link.download = `earth-scale-profile-${results.globalIndex}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
