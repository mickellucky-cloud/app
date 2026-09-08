import React from 'react';

interface SparklineProps {
  data: number[];
  isPositive?: boolean;
  width?: number;
  height?: number;
  strokeWidth?: number;
  showFill?: boolean;
  className?: string;
  targetPrice?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  isPositive = true,
  width = 64,
  height = 24,
  strokeWidth = 1.8,
  showFill = true,
  className = '',
  targetPrice,
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  const paddingY = 2.5;
  const usableHeight = height - paddingY * 2;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  const strokeColor = isPositive ? '#10B981' : '#EF4444';
  const gradientId = `spark-grad-${Math.random().toString(36).substring(2, 7)}`;

  // Optional target price indicator level
  let targetY: number | null = null;
  let isTargetOutside: 'above' | 'below' | null = null;
  if (targetPrice !== undefined && range > 0) {
    const norm = (targetPrice - min) / range;
    if (norm > 1) {
      isTargetOutside = 'above';
      targetY = paddingY;
    } else if (norm < 0) {
      isTargetOutside = 'below';
      targetY = height - paddingY;
    } else {
      targetY = height - paddingY - norm * usableHeight;
    }
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {showFill && <path d={areaD} fill={`url(#${gradientId})`} />}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Optional Alert Target Price reference level */}
      {targetY !== null && (
        <g opacity="0.85">
          <line
            x1="0"
            y1={targetY}
            x2={width}
            y2={targetY}
            stroke="#C084FC"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          <circle
            cx={width - 2}
            cy={targetY}
            r={isTargetOutside ? 1.5 : 2}
            fill="#C084FC"
          />
        </g>
      )}
    </svg>
  );
};
