import React, { useEffect, useState } from 'react';
import { Star, X } from 'lucide-react';
import { MarketSymbol } from '../data/marketsData';

interface SymbolDrawerProps {
  symbol: MarketSymbol | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbolId: string) => void;
}

type Timeframe = '1D' | '1W' | '1M' | '1Y';
const TIMEFRAMES: Timeframe[] = ['1D', '1W', '1M', '1Y'];

export const SymbolDrawer: React.FC<SymbolDrawerProps> = ({
  symbol,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    setHoverIdx(null);
    setTimeframe('1D');
  }, [symbol?.id]);

  useEffect(() => {
    if (!symbol) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [symbol, onClose]);

  if (!symbol) return null;

  const points = symbol.series[timeframe];
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const range = maxVal - minVal || 1;

  const width = 440;
  const height = 180;
  const padX = 12;
  const padY = 16;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const coords = points.map((val, idx) => {
    const x = padX + (idx / Math.max(points.length - 1, 1)) * chartW;
    const y = padY + chartH - ((val - minVal) / range) * chartH;
    return { x, y, val };
  });

  const polylineStr = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const areaStr = `${padX},${height - padY} ${polylineStr} ${width - padX},${height - padY}`;
  const accentColor = symbol.isPositive ? '#089981' : '#f23645';

  const activePoint = hoverIdx !== null ? coords[hoverIdx] : coords[coords.length - 1];
  const formatVal = (val: number) => {
    if (symbol.category === 'forex') return val.toFixed(4);
    if (symbol.priceDisplay.startsWith('$')) {
      return `$${val.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-black/25 backdrop-blur-[1px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${symbol.ticker} market quote`}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-gray-200 flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="px-6 py-5 border-b border-gray-200/80 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <span
              className="w-10 h-10 rounded-full text-xs font-bold flex items-center justify-center shrink-0"
              style={{
                backgroundColor: symbol.badgeBg,
                color: symbol.badgeTextColor ?? '#ffffff',
              }}
            >
              {symbol.badgeText}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[18px] font-bold text-[#131722] truncate">{symbol.ticker}</h3>
                <span className="text-[12px] text-[#787B86]">· {symbol.exchange}</span>
              </div>
              <p className="text-[13px] text-[#787B86] truncate">{symbol.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onToggleWatchlist(symbol.id)}
              aria-label={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isWatchlisted
                  ? 'bg-amber-50 border-amber-200 text-amber-500'
                  : 'border-gray-200 text-gray-500 hover:text-[#131722] hover:bg-gray-50'
              }`}
              title={isWatchlisted ? 'Saved in Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close symbol details"
              className="p-2 text-gray-400 hover:text-[#131722] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Price Header */}
        <div className="px-6 pt-5 pb-3">
          <div className="flex items-baseline gap-3">
            <span className="text-[30px] font-bold text-[#131722] tabular-nums tracking-tight">
              {hoverIdx !== null ? formatVal(activePoint.val) : symbol.priceDisplay}
            </span>
            <span className="text-[12px] font-medium text-[#787B86]">{symbol.currency}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[13px]">
            <span
              className={`font-semibold tabular-nums ${
                symbol.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
              }`}
            >
              {symbol.changePctDisplay}
            </span>
            <span className="text-[#787B86]">· {timeframe} Performance</span>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="px-6 py-2 flex items-center justify-between">
          <div className="inline-flex items-center bg-[#f0f3fa] p-1 rounded-lg">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => {
                  setTimeframe(tf);
                  setHoverIdx(null);
                }}
                className={`px-3 py-1 text-[12px] rounded-md transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-white text-[#131722] font-semibold shadow-sm'
                    : 'text-[#787B86] hover:text-[#131722] font-medium'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-[#787B86] tabular-nums">
            {hoverIdx !== null ? `Point ${hoverIdx + 1}/${points.length}` : 'Latest quote'}
          </span>
        </div>

        {/* Interactive Chart */}
        <div className="px-6 py-3">
          <div className="rounded-2xl border border-gray-200/80 bg-[#fafbfd] p-3">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-44 overflow-visible"
              onMouseLeave={() => setHoverIdx(null)}
            >
              <defs>
                <linearGradient id={`grad-${symbol.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity="0.22" />
                  <stop offset="100%" stopColor={accentColor} stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Subtle grid lines */}
              {[0.25, 0.5, 0.75].map((ratio) => {
                const y = padY + chartH * ratio;
                return (
                  <line
                    key={ratio}
                    x1={padX}
                    y1={y}
                    x2={width - padX}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                );
              })}

              <polygon points={areaStr} fill={`url(#grad-${symbol.id})`} />
              <polyline
                fill="none"
                points={polylineStr}
                stroke={accentColor}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Hover crosshair */}
              {activePoint && (
                <>
                  <line
                    x1={activePoint.x}
                    y1={padY}
                    x2={activePoint.x}
                    y2={height - padY}
                    stroke="#9ca3af"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <circle
                    cx={activePoint.x}
                    cy={activePoint.y}
                    r="4.5"
                    fill="#ffffff"
                    stroke={accentColor}
                    strokeWidth="2.5"
                  />
                </>
              )}

              {/* Invisible hover columns */}
              {coords.map((pt, idx) => {
                const sliceW = chartW / coords.length;
                return (
                  <rect
                    key={idx}
                    x={pt.x - sliceW / 2}
                    y={0}
                    width={sliceW}
                    height={height}
                    fill="transparent"
                    className="cursor-crosshair"
                    onMouseEnter={() => setHoverIdx(idx)}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="px-6 py-4">
          <h4 className="text-[13px] font-semibold text-[#131722] mb-3">Key Statistics</h4>
          <div className="divide-y divide-gray-100 border border-gray-200/80 rounded-2xl px-4 bg-white">
            <div className="py-3 flex items-center justify-between text-[13px]">
              <span className="text-[#787B86]">Open</span>
              <span className="font-semibold text-[#131722] tabular-nums">{symbol.open}</span>
            </div>
            <div className="py-3 flex items-center justify-between text-[13px]">
              <span className="text-[#787B86]">Previous Close</span>
              <span className="font-semibold text-[#131722] tabular-nums">{symbol.prevClose}</span>
            </div>
            <div className="py-3 flex items-center justify-between text-[13px]">
              <span className="text-[#787B86]">Day&apos;s Range</span>
              <span className="font-semibold text-[#131722] tabular-nums">{symbol.dayRange}</span>
            </div>
            <div className="py-3 flex items-center justify-between text-[13px]">
              <span className="text-[#787B86]">52-Week Range</span>
              <span className="font-semibold text-[#131722] tabular-nums">{symbol.yearRange}</span>
            </div>
            <div className="py-3 flex items-center justify-between text-[13px]">
              <span className="text-[#787B86]">
                {symbol.category === 'forex'
                  ? '24h Range'
                  : symbol.category === 'indices'
                  ? 'Volume / Cap'
                  : 'Market Cap'}
              </span>
              <span className="font-semibold text-[#131722] tabular-nums">
                {symbol.secondaryMetric}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
