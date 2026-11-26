import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { MARKET_SYMBOLS, MarketCategory, MarketSymbol } from '../data/marketsData';

interface MarketOverviewSectionProps {
  activeTab: MarketCategory;
  onTabChange: (tab: MarketCategory) => void;
  onSelectSymbol: (symbol: MarketSymbol) => void;
  selectedSymbolId?: string | null;
}

type SortField = 'ticker' | 'price' | 'change' | 'secondary';
type SortDirection = 'asc' | 'desc';

const TABS: { id: MarketCategory; label: string }[] = [
  { id: 'indices', label: 'Indices' },
  { id: 'stocks', label: 'Stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'forex', label: 'Forex' },
];

const COLUMN_HEADERS: Record<
  MarketCategory,
  { symbol: string; price: string; change: string; secondary: string }
> = {
  indices: {
    symbol: 'Symbol',
    price: 'Price',
    change: 'Change %',
    secondary: 'Volume / Cap',
  },
  stocks: {
    symbol: 'Symbol',
    price: 'Price',
    change: 'Change %',
    secondary: 'Market Cap',
  },
  crypto: {
    symbol: 'Symbol',
    price: 'Price',
    change: '24h Change %',
    secondary: 'Market Cap',
  },
  forex: {
    symbol: 'Pair',
    price: 'Bid',
    change: 'Change %',
    secondary: '24h Range',
  },
};

export const MarketOverviewSection: React.FC<MarketOverviewSectionProps> = ({
  activeTab,
  onTabChange,
  onSelectSymbol,
  selectedSymbolId,
}) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDir === 'desc') {
        setSortDir('asc');
      } else {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDir(field === 'ticker' ? 'asc' : 'desc');
    }
  };

  const rows = useMemo(() => {
    const filtered = MARKET_SYMBOLS.filter((item) => item.category === activeTab);
    if (!sortField) return filtered;

    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'ticker') cmp = a.ticker.localeCompare(b.ticker);
      if (sortField === 'price') cmp = a.priceNumeric - b.priceNumeric;
      if (sortField === 'change') cmp = a.changePctNumeric - b.changePctNumeric;
      if (sortField === 'secondary') cmp = a.secondaryNumeric - b.secondaryNumeric;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [activeTab, sortField, sortDir]);

  const headers = COLUMN_HEADERS[activeTab];

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3 h-3 inline-block ml-1 text-[#2962FF]" />
    ) : (
      <ArrowDown className="w-3 h-3 inline-block ml-1 text-[#2962FF]" />
    );
  };

  return (
    <section
      aria-labelledby="market-overview-heading"
      className="mt-10"
      data-purpose="market-overview-section"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <h2
          className="text-[22px] font-bold text-[#131722] tracking-tight"
          id="market-overview-heading"
        >
          Market Overview
        </h2>

        {/* Category Tabs */}
        <div
          className="inline-flex items-center bg-[#e8eaed] p-1 rounded-xl self-start sm:self-auto"
          role="tablist"
          aria-label="Market Categories"
        >
          {TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  onTabChange(tab.id);
                  setSortField(null);
                }}
                className={`px-4 py-1.5 text-[13px] rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'font-semibold bg-white text-[#131722] shadow-sm'
                    : 'font-medium text-[#787B86] hover:text-[#131722]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200/80 text-[12px] font-medium text-[#787B86] uppercase tracking-wider bg-gray-50/60">
                <th className="py-3 px-5">
                  <button
                    type="button"
                    onClick={() => handleSort('ticker')}
                    className="uppercase tracking-wider hover:text-[#131722] transition-colors cursor-pointer"
                  >
                    {headers.symbol}
                    {renderSortIcon('ticker')}
                  </button>
                </th>
                <th className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('price')}
                    className="uppercase tracking-wider hover:text-[#131722] transition-colors cursor-pointer"
                  >
                    {headers.price}
                    {renderSortIcon('price')}
                  </button>
                </th>
                <th className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('change')}
                    className="uppercase tracking-wider hover:text-[#131722] transition-colors cursor-pointer"
                  >
                    {headers.change}
                    {renderSortIcon('change')}
                  </button>
                </th>
                <th className="py-3 px-4 text-right hidden md:table-cell">
                  <button
                    type="button"
                    onClick={() => handleSort('secondary')}
                    className="uppercase tracking-wider hover:text-[#131722] transition-colors cursor-pointer"
                  >
                    {headers.secondary}
                    {renderSortIcon('secondary')}
                  </button>
                </th>
                <th className="py-3 px-5 text-right">7D Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[13px]">
              {rows.map((row) => {
                const isSelected = selectedSymbolId === row.id;
                return (
                  <tr
                    key={row.id}
                    onClick={() => onSelectSymbol(row)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#f0f3fa]' : 'hover:bg-[#f0f3fa]/70'
                    }`}
                  >
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: row.badgeBg,
                            color: row.badgeTextColor ?? '#ffffff',
                          }}
                        >
                          {row.badgeText}
                        </span>
                        <div>
                          <div className="font-semibold text-[#131722]">{row.ticker}</div>
                          <div className="text-[12px] text-[#787B86]">{row.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-[#131722] tabular-nums">
                      {row.priceDisplay}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-semibold tabular-nums ${
                        row.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {row.changePctDisplay}
                    </td>
                    <td className="py-3 px-4 text-right text-[#787B86] hidden md:table-cell tabular-nums">
                      {row.secondaryMetric}
                    </td>
                    <td className="py-3 px-5 text-right">
                      <svg className="inline-block w-20 h-6" viewBox="0 0 80 24" aria-hidden="true">
                        <polyline
                          fill="none"
                          points={row.sparklinePoints}
                          stroke={row.isPositive ? '#089981' : '#f23645'}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
