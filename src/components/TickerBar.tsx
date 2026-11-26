import React from 'react';
import { ALL_SYMBOLS, MarketSymbol, TICKER_ITEMS, TickerItem } from '../data/marketsData';

interface TickerBarProps {
  onSelectSymbol: (symbol: MarketSymbol) => void;
}

const TickerStrip: React.FC<{
  items: TickerItem[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
  ariaHidden?: boolean;
}> = ({ items, onSelectSymbol, ariaHidden }) => (
  <div aria-hidden={ariaHidden} className="flex items-center shrink-0">
    {items.map((item) => {
      const targetSymbol = ALL_SYMBOLS.find((s) => s.id === item.symbolId);
      return (
        <button
          key={`${ariaHidden ? 'dup-' : ''}${item.id}`}
          type="button"
          tabIndex={ariaHidden ? -1 : 0}
          onClick={() => targetSymbol && onSelectSymbol(targetSymbol)}
          className="flex items-center gap-2.5 px-5 border-r border-gray-200/80 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <span
            className="w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0"
            style={{
              backgroundColor: item.badgeBg,
              color: item.badgeTextColor ?? '#ffffff',
            }}
          >
            {item.badgeText}
          </span>
          <span className="text-[13px] font-semibold text-[#131722]">{item.label}</span>
          <span className="text-[13px] font-medium text-[#131722] tabular-nums">{item.price}</span>
          <span
            className={`text-[12px] font-semibold px-1.5 py-0.5 rounded tabular-nums ${
              item.isPositive
                ? 'text-[#089981] bg-[#089981]/10'
                : 'text-[#f23645] bg-[#f23645]/10'
            }`}
          >
            {item.changePct}
          </span>
        </button>
      );
    })}
  </div>
);

export const TickerBar: React.FC<TickerBarProps> = ({ onSelectSymbol }) => {
  return (
    <div
      className="w-full bg-white border-b border-gray-200/90 overflow-hidden ticker-container"
      data-purpose="market-ticker-bar"
    >
      <div className="ticker-track py-2.5">
        <TickerStrip items={TICKER_ITEMS} onSelectSymbol={onSelectSymbol} />
        <TickerStrip items={TICKER_ITEMS} onSelectSymbol={onSelectSymbol} ariaHidden />
      </div>
    </div>
  );
};
