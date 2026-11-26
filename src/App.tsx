import { useEffect, useMemo, useRef, useState } from 'react';
import { DiscussionEmbed } from 'disqus-react';
import { BlackFridayModal } from './components/BlackFridayModal';
import { CommandSearchModal } from './components/CommandSearchModal';
import { Header, NavSection } from './components/Header';
import { IndicesSection } from './components/IndicesSection';
import { MarketOverviewSection } from './components/MarketOverviewSection';
import { SectionSubPanels } from './components/SectionSubPanels';
import { SymbolDrawer } from './components/SymbolDrawer';
import { TickerBar } from './components/TickerBar';
import { ALL_SYMBOLS, MarketCategory, MarketSymbol } from './data/marketsData';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('Markets');
  const [activeTab, setActiveTab] = useState<MarketCategory>('indices');
  const [isBlackFridayOpen, setIsBlackFridayOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<MarketSymbol | null>(null);
  const [language, setLanguage] = useState('EN');
  const [watchlistIds, setWatchlistIds] = useState<string[]>(['spx', 'aapl', 'btcusd']);

  const overviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const watchlistSymbols = useMemo(
    () => ALL_SYMBOLS.filter((sym) => watchlistIds.includes(sym.id)),
    [watchlistIds]
  );

  const toggleWatchlist = (symbolId: string) => {
    setWatchlistIds((prev) =>
      prev.includes(symbolId) ? prev.filter((id) => id !== symbolId) : [...prev, symbolId]
    );
  };

  const handleFocusIndicesTab = () => {
    setActiveSection('Markets');
    setActiveTab('indices');
    overviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSelectSymbol = (symbol: MarketSymbol) => {
    setSelectedSymbol(symbol);
  };

  const disqusConfig = useMemo(
    () => ({
      url: typeof window !== 'undefined' ? window.location.href.split('#')[0] : '',
      identifier: 'tradingview-markets-overview',
      title: 'TradingView Markets',
      language: 'en',
      preData: () => {},
      preInit: () => {},
      onInit: () => {},
      onReady: () => {},
      afterRender: () => {},
      preReset: () => {},
      onIdentify: () => {},
      beforeComment: (comment: unknown) => comment,
      onNewComment: () => {},
      onPaginate: () => {},
    }),
    []
  );

  return (
    <div className="min-h-screen bg-[#f2f3f5] text-[#131722] flex flex-col">
      <Header
        activeSection={activeSection}
        onSelectSection={(sec) => setActiveSection(sec)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleBlackFriday={() => setIsBlackFridayOpen((prev) => !prev)}
        language={language}
        onChangeLanguage={setLanguage}
        watchlistSymbols={watchlistSymbols}
        onSelectSymbol={handleSelectSymbol}
        onRemoveWatchlist={(id) => toggleWatchlist(id)}
      />

      <TickerBar onSelectSymbol={handleSelectSymbol} />

      <main className="w-full max-w-[1440px] mx-auto px-6 py-8 flex-1">
        {activeSection === 'Markets' ? (
          <>
            <IndicesSection
              onSelectSymbol={handleSelectSymbol}
              onFocusIndicesTab={handleFocusIndicesTab}
            />
            <div ref={overviewRef}>
              <MarketOverviewSection
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onSelectSymbol={handleSelectSymbol}
                selectedSymbolId={selectedSymbol?.id}
              />
            </div>
          </>
        ) : (
          <SectionSubPanels
            section={activeSection}
            onBackToMarkets={() => setActiveSection('Markets')}
            onSelectSymbol={handleSelectSymbol}
          />
        )}
        <DiscussionEmbed shortname='trading-view' config={disqusConfig} />
      </main>

      <BlackFridayModal
        isOpen={isBlackFridayOpen}
        onClose={() => setIsBlackFridayOpen(false)}
      />

      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSymbol={handleSelectSymbol}
      />

      <SymbolDrawer
        symbol={selectedSymbol}
        onClose={() => setSelectedSymbol(null)}
        isWatchlisted={selectedSymbol ? watchlistIds.includes(selectedSymbol.id) : false}
        onToggleWatchlist={toggleWatchlist}
      />
    </div>
  );
}
