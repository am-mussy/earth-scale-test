import React from 'react';
import { motion } from 'framer-motion';
import { CategoryId, CategoryResult } from '../types';

interface RadarChartProps {
  categories: CategoryResult[];
  activeCategory: CategoryId | null;
  onSelectCategory: (id: CategoryId) => void;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  const size = 360;
  const center = size / 2;
  const maxRadius = 118;
  const levels = [25, 50, 75, 100];
  const count = categories.length;

  const getPoint = (index: number, valuePercent: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const r = (valuePercent / 100) * maxRadius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const polygonPoints = categories
    .map((c, i) => {
      const pt = getPoint(i, Math.max(12, c.axisScore));
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="relative mx-auto flex w-full max-w-[380px] items-center justify-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto w-full overflow-visible select-none"
        role="img"
        aria-label="Диаграмма по 8 сферам жизни"
      >
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.42" />
            <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.16" />
          </radialGradient>
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>

        {/* Concentric octagon rings */}
        {levels.map((level) => {
          const pts = categories
            .map((_, i) => {
              const pt = getPoint(i, level);
              return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
            })
            .join(' ');
          return (
            <polygon
              key={level}
              points={pts}
              fill="none"
              stroke={
                level === 50
                  ? 'rgba(148, 163, 184, 0.24)'
                  : 'rgba(148, 163, 184, 0.12)'
              }
              strokeDasharray={level === 50 ? '4 4' : undefined}
              strokeWidth={1}
            />
          );
        })}

        {/* Axis spokes */}
        {categories.map((cat, i) => {
          const end = getPoint(i, 100);
          const isSelected = activeCategory === cat.category.id;
          return (
            <line
              key={cat.category.id}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke={
                isSelected
                  ? cat.category.accentHex
                  : 'rgba(148, 163, 184, 0.16)'
              }
              strokeWidth={isSelected ? 1.8 : 1}
            />
          );
        })}

        {/* Animated data polygon */}
        <motion.polygon
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: `${center}px ${center}px` }}
          points={polygonPoints}
          fill="url(#radarFill)"
          stroke="url(#radarStroke)"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* Vertices and clickable labels */}
        {categories.map((cat, i) => {
          const pt = getPoint(i, Math.max(12, cat.axisScore));
          const labelPt = getPoint(i, 127);
          const isSelected = activeCategory === cat.category.id;
          const angleDeg = (360 * i) / count - 90;
          let textAnchor: 'middle' | 'start' | 'end' = 'middle';
          if (angleDeg > -70 && angleDeg < 70) textAnchor = 'start';
          else if (angleDeg > 110 || angleDeg < -110) textAnchor = 'end';

          return (
            <g
              key={cat.category.id}
              onClick={() => onSelectCategory(cat.category.id)}
              className="cursor-pointer group"
            >
              {/* Soft halo */}
              <motion.circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 10 : 7}
                fill={cat.category.accentHex}
                opacity={isSelected ? 0.35 : 0.18}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.35 + i * 0.04 }}
              />
              {/* Vertex core */}
              <motion.circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 5 : 3.8}
                fill={cat.category.accentHex}
                stroke="#050811"
                strokeWidth={1.5}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.35 + i * 0.04 }}
              />

              {/* Axis label */}
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="transition-colors duration-200"
                fill={isSelected ? '#f8fafc' : '#cbd5e1'}
                fontSize={12}
                fontWeight={isSelected ? 700 : 500}
                fontFamily="Inter, system-ui, sans-serif"
              >
                {cat.category.shortTitle}
              </text>
              <text
                x={labelPt.x}
                y={labelPt.y + 15}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                fill={cat.category.accentHex}
                fontSize={11}
                fontWeight={700}
                fontFamily="JetBrains Mono, monospace"
              >
                {cat.axisScore}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
