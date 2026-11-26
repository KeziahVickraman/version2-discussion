import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { ALL_SYMBOLS, MarketCategory, MarketSymbol } from '../data/marketsData';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol: (symbol: MarketSymbol) => void;
}

const FILTER_OPTIONS: { id: 'all' | MarketCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'indices', label: 'Indices' },
  { id: 'stocks', label: 'Stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'forex', label: 'Forex' },
];

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSymbol,
}) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | MarketCategory>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setCategoryFilter('all');
      setActiveIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_SYMBOLS.filter((sym) => {
      const matchesCategory = categoryFilter === 'all' || sym.category === categoryFilter;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        sym.ticker.toLowerCase().includes(q) ||
        sym.name.toLowerCase().includes(q) ||
        sym.exchange.toLowerCase().includes(q)
      );
    });
  }, [query, categoryFilter]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, categoryFilter]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (results.length ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) =>
          results.length ? (prev - 1 + results.length) % results.length : 0
        );
      } else if (e.key === 'Enter' && results[activeIndex]) {
        e.preventDefault();
        onSelectSymbol(results[activeIndex]);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, results, activeIndex, onClose, onSelectSymbol]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/35 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Symbol Search"
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200/80">
          <Search className="w-5 h-5 text-[#787B86] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company, crypto, or currency pair..."
            className="w-full text-[15px] text-[#131722] placeholder-[#787B86] bg-transparent border-none focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 text-gray-400 hover:text-[#131722] hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Bar */}
        <div className="px-4 py-2.5 bg-gray-50/80 border-b border-gray-200/80 flex items-center gap-1.5 overflow-x-auto">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setCategoryFilter(opt.id)}
              className={`px-3 py-1 text-[12px] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                categoryFilter === opt.id
                  ? 'bg-white text-[#131722] font-semibold shadow-sm'
                  : 'text-[#787B86] hover:text-[#131722] font-medium'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
          {results.length === 0 ? (
            <div className="py-10 px-6 text-center">
              <p className="text-[14px] font-medium text-[#131722]">No matching symbols</p>
              <p className="text-[12px] text-[#787B86] mt-1">
                Try searching for SPX, AAPL, NVDA, BTCUSD, or EURUSD.
              </p>
            </div>
          ) : (
            results.map((sym, idx) => (
              <button
                key={sym.id}
                type="button"
                onClick={() => {
                  onSelectSymbol(sym);
                  onClose();
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`w-full px-4 py-3 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                  idx === activeIndex ? 'bg-[#f0f3fa]' : 'hover:bg-[#f0f3fa]/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: sym.badgeBg,
                      color: sym.badgeTextColor ?? '#ffffff',
                    }}
                  >
                    {sym.badgeText}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#131722]">
                        {sym.ticker}
                      </span>
                      <span className="text-[11px] text-[#787B86]">{sym.exchange}</span>
                    </div>
                    <div className="text-[12px] text-[#787B86] truncate">{sym.name}</div>
                  </div>
                </div>

                <div className="text-right tabular-nums shrink-0">
                  <div className="text-[13px] font-semibold text-[#131722]">
                    {sym.priceDisplay}
                  </div>
                  <div
                    className={`text-[12px] font-semibold ${
                      sym.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {sym.changePctDisplay}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
