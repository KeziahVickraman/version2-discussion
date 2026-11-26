import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MARKET_SYMBOLS, MarketSymbol } from '../data/marketsData';

interface IndicesSectionProps {
  onSelectSymbol: (symbol: MarketSymbol) => void;
  onFocusIndicesTab: () => void;
}

export const IndicesSection: React.FC<IndicesSectionProps> = ({
  onSelectSymbol,
  onFocusIndicesTab,
}) => {
  const sp500 = MARKET_SYMBOLS.find((s) => s.id === 'spx');

  return (
    <section aria-labelledby="indices-heading" data-purpose="indices-section">
      <div className="flex items-center gap-1.5 mb-4">
        <button
          type="button"
          onClick={onFocusIndicesTab}
          className="inline-flex items-center gap-1.5 group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2962FF] rounded"
        >
          <h1
            className="text-[26px] font-bold text-[#131722] tracking-tight group-hover:text-[#2962FF] transition-colors"
            id="indices-heading"
          >
            Indices
          </h1>
          <ChevronRight
            className="w-5 h-5 text-[#131722] mt-0.5 group-hover:text-[#2962FF] group-hover:translate-x-0.5 transition-all"
            strokeWidth={2.5}
          />
        </button>
      </div>

      {/* Indices Cards Row */}
      <div className="flex flex-wrap items-center gap-4">
        {sp500 && (
          <button
            type="button"
            onClick={() => onSelectSymbol(sp500)}
            data-purpose="index-card-sp500"
            className="flex items-center gap-3 bg-[#e8eaed] hover:bg-[#dfe2e7] transition-colors rounded-2xl px-4 py-3 min-w-[200px] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2962FF]"
          >
            <div className="w-9 h-9 rounded-full bg-[#d94654] text-white flex items-center justify-center text-[11px] font-bold tracking-tight shrink-0">
              500
            </div>
            <div>
              <div className="text-[14px] font-semibold text-[#131722] leading-snug">
                S&amp;P 500
              </div>
            </div>
          </button>
        )}
      </div>
    </section>
  );
};
