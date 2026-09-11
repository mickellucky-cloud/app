import React, { useState, useMemo, useRef, useCallback } from 'react';
import { MarketPair } from '../../types';
import {
  TrendingUp,
  BarChart2,
  Maximize2,
  Minimize2,
  Sliders,
  Layers,
  Activity,
  Flame,
  Crosshair,
  X,
} from 'lucide-react';

export type ChartTimeframe = '1m' | '5m' | '15m' | '1H' | '4H' | '1D' | '1W';
export type ChartStyle = 'candles' | 'line' | 'depth';

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isUp: boolean;
}

interface CrosshairData {
  index: number;
  x: number;
  candleY: number;
  pointerY: number;
  price: number;
  candlePrice: number;
  time: string;
  candle: CandleData;
}

interface TradeChartProps {
  pair: MarketPair;
  timeframe: ChartTimeframe;
  onTimeframeChange: (tf: ChartTimeframe) => void;
  className?: string;
}

export const TradeChart: React.FC<TradeChartProps> = ({
  pair,
  timeframe,
  onTimeframeChange,
  className = '',
}) => {
  const [chartStyle, setChartStyle] = useState<ChartStyle>('candles');
  const [showMA7, setShowMA7] = useState(true);
  const [showMA25, setShowMA25] = useState(true);
  const [showMA99, setShowMA99] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [crosshairEnabled, setCrosshairEnabled] = useState(true);
  const [crosshair, setCrosshair] = useState<CrosshairData | null>(null);
  const [isTouchActive, setIsTouchActive] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Generate realistic candles based on base price, 24h range and timeframe
  const candles: CandleData[] = useMemo(() => {
    const count = 24;
    const basePrice = pair.price;
    const volatility = Math.max(basePrice * 0.003, (pair.high24h - pair.low24h) * 0.06);

    const data: CandleData[] = [];
    let currentOpen = basePrice * 0.982;

    const sparkSeed = pair.sparkline && pair.sparkline.length > 0 ? pair.sparkline : [1, 2, 3, 2, 4, 3, 5];

    for (let i = 0; i < count; i++) {
      const seedVal = sparkSeed[i % sparkSeed.length] || 1;
      const trendFactor = (i / count) * 0.025 + ((seedVal % 5) - 2) * 0.004;

      const open = i === 0 ? currentOpen : data[i - 1].close;
      // Last candle matches pair.price closely
      const close =
        i === count - 1
          ? basePrice
          : Math.max(open * 0.95, open + (Math.sin(i * 1.3) * volatility * 0.8 + trendFactor * basePrice));

      const isUp = close >= open;
      const high = Math.max(open, close) + Math.abs(Math.cos(i * 0.7)) * volatility * 0.65;
      const low = Math.min(open, close) - Math.abs(Math.sin(i * 0.9)) * volatility * 0.65;
      const volume = Math.floor(120000 + Math.abs(Math.sin(i * 1.5)) * 480000);

      const minsAgo = (count - 1 - i) * (timeframe === '1m' ? 1 : timeframe === '5m' ? 5 : timeframe === '15m' ? 15 : timeframe === '1H' ? 60 : timeframe === '4H' ? 240 : 1440);
      const date = new Date(Date.now() - minsAgo * 60000);
      const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

      data.push({
        time: timeStr,
        open,
        high,
        low,
        close,
        volume,
        isUp,
      });
    }
    return data;
  }, [pair.price, pair.high24h, pair.low24h, pair.sparkline, timeframe]);

  // Price bounds
  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    let maxVol = 0;
    candles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
    });
    // Add small padding
    const padding = (max - min) * 0.08 || 1;
    return {
      minPrice: min - padding,
      maxPrice: max + padding,
      maxVolume: maxVol || 1,
    };
  }, [candles]);

  // Coordinate scales
  const chartHeight = isExpanded ? 260 : 160;
  const chartWidth = 360;
  const volumeHeight = 36;
  const mainPriceHeight = chartHeight - volumeHeight - 16;

  const getY = (price: number) => {
    const range = maxPrice - minPrice;
    if (range <= 0) return mainPriceHeight / 2;
    return mainPriceHeight - ((price - minPrice) / range) * mainPriceHeight + 8;
  };

  const getVolY = (vol: number) => {
    const ratio = Math.min(1, vol / maxVolume);
    return chartHeight - ratio * volumeHeight;
  };

  const candleWidth = 8;
  const candleGap = (chartWidth - 24) / candles.length;

  // Moving averages
  const ma7Points = useMemo(() => {
    return candles
      .map((c, i) => {
        if (i < 3) return null;
        const slice = candles.slice(Math.max(0, i - 6), i + 1);
        const avg = slice.reduce((acc, curr) => acc + curr.close, 0) / slice.length;
        const x = 12 + i * candleGap + candleWidth / 2;
        const y = getY(avg);
        return `${x},${y}`;
      })
      .filter(Boolean)
      .join(' ');
  }, [candles, candleGap, maxPrice, minPrice]);

  const ma25Points = useMemo(() => {
    return candles
      .map((c, i) => {
        if (i < 6) return null;
        const slice = candles.slice(Math.max(0, i - 12), i + 1);
        const avg = slice.reduce((acc, curr) => acc + curr.close, 0) / slice.length;
        const x = 12 + i * candleGap + candleWidth / 2;
        const y = getY(avg);
        return `${x},${y}`;
      })
      .filter(Boolean)
      .join(' ');
  }, [candles, candleGap, maxPrice, minPrice]);

  // Line/Area path
  const areaPath = useMemo(() => {
    if (candles.length === 0) return '';
    const points = candles.map((c, i) => {
      const x = 12 + i * candleGap + candleWidth / 2;
      const y = getY(c.close);
      return { x, y };
    });

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      d += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, [candles, candleGap, maxPrice, minPrice]);

  const areaFill = `${areaPath} L ${chartWidth - 12} ${chartHeight - 4} L 12 ${chartHeight - 4} Z`;

  // Volume & Price formatters
  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(2)}M`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
    return vol.toString();
  };

  const formatPrice = (p: number) => {
    if (p >= 1000) {
      return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (p >= 1) {
      return p.toFixed(2);
    }
    return p.toFixed(4);
  };

  // Pointer & Touch coordinate handler for responsive crosshair
  const handlePointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current || !crosshairEnabled || candles.length === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relX = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const relY = Math.max(0, Math.min(rect.height, clientY - rect.top));

      const svgX = (relX / rect.width) * chartWidth;
      const svgY = (relY / rect.height) * chartHeight;

      // Nearest candle index
      const rawIndex = Math.round((svgX - 12 - candleWidth / 2) / candleGap);
      const index = Math.max(0, Math.min(candles.length - 1, rawIndex));
      const candle = candles[index];

      const priceRange = maxPrice - minPrice;
      const priceAtY =
        priceRange > 0
          ? minPrice + ((mainPriceHeight + 8 - svgY) / mainPriceHeight) * priceRange
          : candle.close;

      const candleCenterX = 12 + index * candleGap + candleWidth / 2;
      const candleCloseY = getY(candle.close);

      setCrosshair({
        index,
        x: candleCenterX,
        candleY: candleCloseY,
        pointerY: svgY,
        price: priceAtY,
        candlePrice: candle.close,
        time: candle.time,
        candle,
      });
    },
    [crosshairEnabled, candles, candleGap, candleWidth, chartWidth, chartHeight, mainPriceHeight, maxPrice, minPrice]
  );

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!crosshairEnabled) return;
    if (e.touches.length > 0) {
      setIsTouchActive(true);
      const touch = e.touches[0];
      handlePointer(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!crosshairEnabled) return;
    if (e.touches.length > 0) {
      if (e.cancelable) {
        e.preventDefault();
      }
      setIsTouchActive(true);
      const touch = e.touches[0];
      handlePointer(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsTouchActive(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!crosshairEnabled) return;
    handlePointer(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    if (!isTouchActive) {
      setCrosshair(null);
    }
  };

  const handleClearCrosshair = () => {
    setCrosshair(null);
    setIsTouchActive(false);
  };

  // Active candle displayed in HUD
  const activeCandle = crosshair ? crosshair.candle : candles[candles.length - 1];
  const activeChange = activeCandle ? ((activeCandle.close - activeCandle.open) / activeCandle.open) * 100 : 0;

  return (
    <div
      id="trade-chart-container"
      className={`rounded-2xl bg-slate-50 dark:bg-[#090C14] border border-slate-200 dark:border-white/[0.08] p-3 shadow-xs dark:shadow-xl transition-all ${className}`}
    >
      {/* Top Controls: Timeframe bar & Chart Mode Bar */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-white/[0.06] mb-2 text-xs">
        {/* Timeframe pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {(['1m', '5m', '15m', '1H', '4H', '1D', '1W'] as ChartTimeframe[]).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => onTimeframeChange(tf)}
              className={`px-2 py-0.5 rounded-lg font-mono-num text-[11px] font-semibold transition-all ${
                timeframe === tf
                  ? 'bg-purple-600/25 text-purple-700 dark:text-purple-200 border border-purple-500/40 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.04]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* View style toggles & Fullscreen */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setChartStyle('candles')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              chartStyle === 'candles'
                ? 'bg-purple-600/25 text-purple-700 dark:text-purple-300 border border-purple-500/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Candlestick Chart"
          >
            <BarChart2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setChartStyle('line')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              chartStyle === 'line'
                ? 'bg-purple-600/25 text-purple-700 dark:text-purple-300 border border-purple-500/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Line Area Chart"
          >
            <TrendingUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setChartStyle('depth')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              chartStyle === 'depth'
                ? 'bg-purple-600/25 text-purple-700 dark:text-purple-300 border border-purple-500/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Market Depth View"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Crosshair Tool Toggle Button */}
          <button
            id="trade-chart-crosshair-toggle"
            type="button"
            onClick={() => {
              if (crosshairEnabled) {
                setCrosshair(null);
                setIsTouchActive(false);
              }
              setCrosshairEnabled(!crosshairEnabled);
            }}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              crosshairEnabled
                ? 'bg-purple-600/25 text-purple-700 dark:text-purple-200 border border-purple-500/40 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title={crosshairEnabled ? 'Crosshair Tool Active (Touch/Drag to inspect)' : 'Enable Crosshair Tool'}
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            title={isExpanded ? 'Collapse Chart' : 'Expand Chart'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Pro HUD Metric Bar */}
      <div className="flex items-center justify-between text-[10px] font-mono-num py-1 px-1 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/[0.04] mb-2 overflow-x-auto no-scrollbar">
        {activeCandle && (
          <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
            {crosshair ? (
              <span className="flex items-center gap-1 font-mono-num font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/40 px-1.5 py-0.5 rounded text-[9px]">
                <Crosshair className="w-2.5 h-2.5" />
                {crosshair.time}
              </span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400 font-mono-num text-[9px]">{activeCandle.time}</span>
            )}
            <span>
              O: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{formatPrice(activeCandle.open)}</strong>
            </span>
            <span>
              H: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatPrice(activeCandle.high)}</strong>
            </span>
            <span>
              L: <strong className="text-rose-600 dark:text-rose-400 font-semibold">{formatPrice(activeCandle.low)}</strong>
            </span>
            <span>
              C:{' '}
              <strong
                className={`font-bold ${activeCandle.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
              >
                {formatPrice(activeCandle.close)}
              </strong>
            </span>
            <span
              className={`font-semibold px-1 rounded ${
                activeChange >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-transparent' : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-transparent'
              }`}
            >
              {activeChange >= 0 ? `+${activeChange.toFixed(2)}%` : `${activeChange.toFixed(2)}%`}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              V: {formatVolume(activeCandle.volume)}
            </span>
            {crosshair && (
              <button
                type="button"
                onClick={handleClearCrosshair}
                className="p-0.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-white/10 ml-1 transition-colors"
                title="Dismiss Crosshair"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Indicator pills */}
        {chartStyle === 'candles' && (
          <div className="flex items-center gap-1.5 pl-2">
            <button
              onClick={() => setShowMA7(!showMA7)}
              className={`px-1.5 py-0.2 rounded text-[9px] font-bold transition-all ${
                showMA7 ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              MA7
            </button>
            <button
              onClick={() => setShowMA25(!showMA25)}
              className={`px-1.5 py-0.2 rounded text-[9px] font-bold transition-all ${
                showMA25 ? 'bg-cyan-100 text-cyan-800 border border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/40' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              MA25
            </button>
          </div>
        )}
      </div>

      {/* SVG Canvas Stage with Responsive Touch & Pointer Crosshair */}
      <div
        ref={containerRef}
        id="trade-chart-stage"
        className="relative w-full overflow-hidden select-none cursor-crosshair touch-none"
        style={{ height: chartHeight }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Floating Detail Tooltip Overlay on Touch/Hover (Smart-flips so finger never occludes) */}
        {crosshair && (
          <div
            className={`absolute top-1.5 z-20 pointer-events-none px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-[#090C16]/95 border border-purple-500/40 shadow-xl backdrop-blur-md transition-all text-[10px] font-mono-num text-slate-900 dark:text-white ${
              crosshair.x < chartWidth / 2 ? 'right-2' : 'left-2'
            }`}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-1 mb-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                {crosshair.time}
              </span>
              <span
                className={`font-bold px-1.5 py-0.2 rounded text-[9px] ${
                  crosshair.candle.isUp ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300'
                }`}
              >
                {activeChange >= 0 ? `+${activeChange.toFixed(2)}%` : `${activeChange.toFixed(2)}%`}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-slate-500 dark:text-slate-400 text-[9.5px]">
              <div>O: <span className="text-slate-800 dark:text-slate-200 font-semibold">{formatPrice(crosshair.candle.open)}</span></div>
              <div>H: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatPrice(crosshair.candle.high)}</span></div>
              <div>L: <span className="text-rose-600 dark:text-rose-400 font-semibold">{formatPrice(crosshair.candle.low)}</span></div>
              <div>C: <span className={`font-bold ${crosshair.candle.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{formatPrice(crosshair.candle.close)}</span></div>
            </div>
            <div className="mt-1 pt-0.5 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400">
              <span>Volume</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">{formatVolume(crosshair.candle.volume)}</span>
            </div>
          </div>
        )}

        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Area gradient */}
            <linearGradient id="proAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.0" />
            </linearGradient>

            {/* Depth green */}
            <linearGradient id="depthBuyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
            </linearGradient>

            {/* Depth red */}
            <linearGradient id="depthSellGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines (Dotted) */}
          <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#94A3B8" strokeOpacity="0.25" strokeDasharray="3 3" />
          <line x1="0" y1={chartHeight * 0.5} x2={chartWidth} y2={chartHeight * 0.5} stroke="#94A3B8" strokeOpacity="0.25" strokeDasharray="3 3" />
          <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#94A3B8" strokeOpacity="0.25" strokeDasharray="3 3" />

          {/* Mode 1: CANDLESTICKS */}
          {chartStyle === 'candles' && (
            <>
              {/* Volume Bars */}
              {candles.map((c, i) => {
                const x = 12 + i * candleGap;
                const volY = getVolY(c.volume);
                const volH = chartHeight - volY;
                return (
                  <rect
                    key={`vol-${i}`}
                    x={x + 1}
                    y={volY}
                    width={candleWidth - 2}
                    height={volH}
                    fill={c.isUp ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}
                    rx={1}
                  />
                );
              })}

              {/* Candles (Wick + Body) */}
              {candles.map((c, i) => {
                const x = 12 + i * candleGap;
                const centerX = x + candleWidth / 2;
                const highY = getY(c.high);
                const lowY = getY(c.low);
                const openY = getY(c.open);
                const closeY = getY(c.close);

                const bodyY = Math.min(openY, closeY);
                const bodyH = Math.max(2.5, Math.abs(openY - closeY));
                const candleColor = c.isUp ? '#10B981' : '#F43F5E';

                return (
                  <g key={`c-${i}`} className="transition-opacity hover:opacity-80">
                    {/* Wick */}
                    <line
                      x1={centerX}
                      y1={highY}
                      x2={centerX}
                      y2={lowY}
                      stroke={candleColor}
                      strokeWidth={1.2}
                    />
                    {/* Body */}
                    <rect
                      x={x}
                      y={bodyY}
                      width={candleWidth}
                      height={bodyH}
                      fill={candleColor}
                      rx={1}
                    />
                  </g>
                );
              })}

              {/* Moving Average lines */}
              {showMA7 && ma7Points && (
                <polyline
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  points={ma7Points}
                  opacity={0.85}
                />
              )}
              {showMA25 && ma25Points && (
                <polyline
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  points={ma25Points}
                  opacity={0.85}
                />
              )}
            </>
          )}

          {/* Mode 2: LINE / AREA */}
          {chartStyle === 'line' && (
            <>
              <path d={areaFill} fill="url(#proAreaGrad)" />
              <path
                d={areaPath}
                fill="none"
                stroke="#A855F7"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
              />
              {/* Latest Price Pulse Circle */}
              {candles.length > 0 && (
                <g transform={`translate(${12 + (candles.length - 1) * candleGap + candleWidth / 2}, ${getY(pair.price)})`}>
                  <circle r="5" fill="#C084FC" />
                  <circle r="9" fill="none" stroke="#C084FC" strokeWidth="1.5" className="animate-ping opacity-75" />
                </g>
              )}
            </>
          )}

          {/* Mode 3: DEPTH WALL VIEW */}
          {chartStyle === 'depth' && (
            <g>
              {/* Green Bids Wall */}
              <path
                d={`M 10 ${chartHeight} L 10 ${chartHeight * 0.3} Q 100 ${chartHeight * 0.45}, 175 ${chartHeight * 0.7} L 175 ${chartHeight} Z`}
                fill="url(#depthBuyGrad)"
                stroke="#10B981"
                strokeWidth="1.5"
              />
              {/* Red Asks Wall */}
              <path
                d={`M 185 ${chartHeight} L 185 ${chartHeight * 0.7} Q 260 ${chartHeight * 0.45}, 350 ${chartHeight * 0.3} L 350 ${chartHeight} Z`}
                fill="url(#depthSellGrad)"
                stroke="#F43F5E"
                strokeWidth="1.5"
              />
              {/* Spread mark */}
              <line x1="180" y1="20" x2="180" y2={chartHeight} stroke="rgba(255,255,255,0.2)" strokeDasharray="2 2" />
              <text x="180" y="30" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">
                Spread 0.01%
              </text>
            </g>
          )}

          {/* Live Market Price Horizontal Guideline */}
          <line
            x1="0"
            y1={getY(pair.price)}
            x2={chartWidth}
            y2={getY(pair.price)}
            stroke={pair.change24h >= 0 ? '#10B981' : '#F43F5E'}
            strokeWidth="1"
            strokeDasharray="4 3"
            opacity={crosshair ? 0.35 : 0.8}
          />

          {/* Enhanced Touch-Responsive Crosshair Tool */}
          {crosshair && (
            <g id="chart-crosshair-group">
              {/* Vertical Crosshair Line */}
              <line
                x1={crosshair.x}
                y1="0"
                x2={crosshair.x}
                y2={chartHeight}
                stroke="#C084FC"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                opacity={0.9}
              />

              {/* Horizontal Crosshair Line at Selected Candle Price */}
              <line
                x1="0"
                y1={crosshair.candleY}
                x2={chartWidth}
                y2={crosshair.candleY}
                stroke="#C084FC"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                opacity={0.9}
              />

              {/* Reticle / Focal Target Dot */}
              <g transform={`translate(${crosshair.x}, ${crosshair.candleY})`}>
                <circle
                  r="8"
                  fill="none"
                  stroke={crosshair.candle.isUp ? '#10B981' : '#F43F5E'}
                  strokeWidth="1.5"
                  opacity={0.6}
                  className="animate-ping"
                />
                <circle
                  r="4"
                  fill="#FFFFFF"
                  stroke={crosshair.candle.isUp ? '#10B981' : '#F43F5E'}
                  strokeWidth="2"
                  className="drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                />
              </g>

              {/* Responsive X-Axis Timestamp Pill Badge */}
              {(() => {
                const badgeX = Math.max(26, Math.min(chartWidth - 26, crosshair.x));
                return (
                  <g transform={`translate(${badgeX}, ${chartHeight - 11})`}>
                    <rect
                      x="-24"
                      y="-8"
                      width="48"
                      height="16"
                      rx="4"
                      fill="#0B0F19"
                      stroke="#A855F7"
                      strokeWidth="1.2"
                      className="shadow-lg"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill="#E2E8F0"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {crosshair.time}
                    </text>
                  </g>
                );
              })()}

              {/* Responsive Y-Axis Price Pill Badge */}
              {(() => {
                const isNearRight = crosshair.x > chartWidth - 70;
                const badgeX = isNearRight ? 2 : chartWidth - 2;
                const badgeY = Math.max(12, Math.min(chartHeight - 22, crosshair.candleY));
                return (
                  <g transform={`translate(${badgeX}, ${badgeY})`}>
                    <rect
                      x={isNearRight ? 0 : -62}
                      y="-9"
                      width="62"
                      height="18"
                      rx="4"
                      fill={crosshair.candle.isUp ? '#059669' : '#E11D48'}
                      stroke="#FFFFFF"
                      strokeWidth="0.6"
                      opacity={0.98}
                      className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                    />
                    <text
                      x={isNearRight ? 31 : -31}
                      y="3.5"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {formatPrice(crosshair.candlePrice)}
                    </text>
                  </g>
                );
              })()}
            </g>
          )}
        </svg>

        {/* Floating Live Price Pill Tag on Y-Axis (dimmed when crosshair active to prevent confusion) */}
        <div
          className={`absolute right-1 px-1.5 py-0.5 rounded text-[10px] font-mono-num font-extrabold shadow-md pointer-events-none transition-all ${
            crosshair ? 'opacity-40' : 'opacity-100'
          } ${
            pair.change24h >= 0
              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
              : 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]'
          }`}
          style={{
            top: Math.max(4, Math.min(chartHeight - 24, getY(pair.price) - 10)),
          }}
        >
          {pair.price >= 1 ? pair.price.toFixed(2) : pair.price.toFixed(4)}
        </div>

        {/* Subtle mobile hint when crosshair is inactive */}
        {!crosshair && (
          <div className="absolute bottom-1.5 left-2 pointer-events-none text-[9px] text-slate-500 dark:text-slate-400 font-mono-num opacity-70 sm:opacity-50">
            Touch & drag to inspect
          </div>
        )}
      </div>
    </div>
  );
};
