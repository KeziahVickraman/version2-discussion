import React from 'react';
import { ArrowLeft, BarChart3, Building2, Compass, Layers, MessageSquare, TrendingUp } from 'lucide-react';
import { MARKET_SYMBOLS, MarketSymbol } from '../data/marketsData';
import { NavSection } from './Header';

interface SectionSubPanelsProps {
  section: Exclude<NavSection, 'Markets'>;
  onBackToMarkets: () => void;
  onSelectSymbol: (symbol: MarketSymbol) => void;
}

export const SectionSubPanels: React.FC<SectionSubPanelsProps> = ({
  section,
  onBackToMarkets,
  onSelectSymbol,
}) => {
  const spx = MARKET_SYMBOLS.find((s) => s.id === 'spx')!;
  const nvda = MARKET_SYMBOLS.find((s) => s.id === 'nvda')!;
  const btc = MARKET_SYMBOLS.find((s) => s.id === 'btcusd')!;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBackToMarkets}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#2962FF] hover:underline mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Markets Overview</span>
          </button>
          <h1 className="text-[26px] font-bold text-[#131722] tracking-tight">{section}</h1>
        </div>
      </div>

      {section === 'Products' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: BarChart3,
              title: 'Supercharts',
              desc: 'Multi-timeframe charting with 100+ technical indicators and drawing tools.',
              actionLabel: 'Inspect SPX Chart',
              symbol: spx,
            },
            {
              icon: Layers,
              title: 'Stock & Crypto Screener',
              desc: 'Filter global equities, digital assets, and FX pairs by momentum and market cap.',
              actionLabel: 'Open NVDA Quote',
              symbol: nvda,
            },
            {
              icon: TrendingUp,
              title: 'Economic & Earnings Calendar',
              desc: 'Track central bank decisions, CPI releases, and quarterly earnings dates.',
              actionLabel: 'Inspect BTCUSD',
              symbol: btc,
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-gray-200/80 p-6 flex flex-col justify-between shadow-sm"
            >
              <div>
                <card.icon className="w-6 h-6 text-[#2962FF] mb-3" />
                <h2 className="text-[17px] font-bold text-[#131722] mb-2">{card.title}</h2>
                <p className="text-[13px] text-[#787B86] leading-relaxed mb-5">{card.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => onSelectSymbol(card.symbol)}
                className="self-start px-4 py-2 text-[13px] font-semibold text-white bg-[#2962FF] hover:bg-[#1e53e5] rounded-lg transition-colors cursor-pointer"
              >
                {card.actionLabel}
              </button>
            </div>
          ))}
        </div>
      )}

      {section === 'Community' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              author: 'MacroDesk',
              time: '2h ago',
              title: 'SPX holding above 5,950 trendline support ahead of holiday session',
              summary:
                'Breadth remains constructive across mega-cap tech and industrials with steady index volume.',
              symbol: spx,
            },
            {
              author: 'QuantFlow',
              time: '4h ago',
              title: 'BTCUSD momentum consolidation near 97.4K resistance zone',
              summary:
                'Spot inflows continue to absorb intraday pullbacks while funding rates normalize.',
              symbol: btc,
            },
          ].map((idea) => (
            <div
              key={idea.title}
              className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-[12px] text-[#787B86] mb-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#2962FF]" />
                  <span className="font-semibold text-[#131722]">{idea.author}</span>
                  <span>·</span>
                  <span>{idea.time}</span>
                  <span>·</span>
                  <span>{idea.symbol.ticker}</span>
                </div>
                <h2 className="text-[16px] font-bold text-[#131722] mb-2">{idea.title}</h2>
                <p className="text-[13px] text-[#787B86] leading-relaxed mb-4">{idea.summary}</p>
              </div>
              <button
                type="button"
                onClick={() => onSelectSymbol(idea.symbol)}
                className="self-start text-[13px] font-semibold text-[#2962FF] hover:underline cursor-pointer"
              >
                View {idea.symbol.ticker} Quote →
              </button>
            </div>
          ))}
        </div>
      )}

      {section === 'Brokers' && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {[
              { name: 'Interactive Brokers', assetClasses: 'Stocks · Indices · Futures · Forex', rating: '4.9 / 5' },
              { name: 'Pepperstone', assetClasses: 'Forex · Indices · Commodities', rating: '4.8 / 5' },
              { name: 'TradeStation', assetClasses: 'Equities · ETFs · Options · Crypto', rating: '4.7 / 5' },
            ].map((broker) => (
              <div
                key={broker.name}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f0f3fa]/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-[#2962FF] shrink-0" />
                  <div>
                    <div className="text-[14px] font-semibold text-[#131722]">{broker.name}</div>
                    <div className="text-[12px] text-[#787B86]">{broker.assetClasses}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[13px] font-semibold text-[#131722] tabular-nums">
                    {broker.rating}
                  </span>
                  <button
                    type="button"
                    onClick={onBackToMarkets}
                    className="px-3.5 py-1.5 text-[12px] font-semibold text-[#2962FF] bg-[#f0f3fa] hover:bg-[#e6eaf5] rounded-lg transition-colors cursor-pointer"
                  >
                    Open Markets
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === 'More' && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <Compass className="w-5 h-5 text-[#2962FF]" />
            <h2 className="text-[17px] font-bold text-[#131722]">Platform Resources</h2>
          </div>
          <p className="text-[13px] text-[#787B86] mb-4 max-w-2xl">
            Explore Pine Script documentation, market data coverage across 100+ global exchanges, and keyboard shortcuts like Ctrl+K for instant symbol lookup.
          </p>
          <button
            type="button"
            onClick={onBackToMarkets}
            className="px-4 py-2 text-[13px] font-semibold text-white bg-[#131722] hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          >
            Return to Markets
          </button>
        </div>
      )}
    </section>
  );
};
