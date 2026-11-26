import React, { useEffect, useRef, useState } from 'react';
import { Globe, Search, Star, User, X } from 'lucide-react';
import { MarketSymbol } from '../data/marketsData';

export type NavSection = 'Markets' | 'Products' | 'Community' | 'Brokers' | 'More';

interface HeaderProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  onOpenSearch: () => void;
  onToggleBlackFriday: () => void;
  language: string;
  onChangeLanguage: (lang: string) => void;
  watchlistSymbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
  onRemoveWatchlist: (symbolId: string) => void;
}

const LANGUAGES = [
  { code: 'EN', label: 'English' },
  { code: 'ES', label: 'Español' },
  { code: 'DE', label: 'Deutsch' },
  { code: 'FR', label: 'Français' },
  { code: 'JA', label: '日本語' },
];

const NAV_ITEMS: NavSection[] = ['Products', 'Community', 'Markets', 'Brokers', 'More'];

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onSelectSection,
  onOpenSearch,
  onToggleBlackFriday,
  language,
  onChangeLanguage,
  watchlistSymbols,
  onSelectSymbol,
  onRemoveWatchlist,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full h-[60px] bg-white/95 backdrop-blur-sm border-b border-gray-200/80 sticky top-0 z-30">
      <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between gap-4">
        {/* Left: Logo, Search Bar, and Primary Navigation */}
        <div className="flex items-center gap-6 min-w-0">
          <button
            type="button"
            aria-label="TradingView Home"
            onClick={() => onSelectSection('Markets')}
            className="flex items-center shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2962FF] rounded"
          >
            <svg fill="none" height="28" viewBox="0 0 36 28" width="36" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 22H7V11H0V4H14V22ZM28 4H21L15.5 22H22.5L28 4Z" fill="#131722" />
              <circle cx="31.5" cy="7.5" fill="#131722" r="3.5" />
            </svg>
          </button>

          {/* Search Bar Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="relative hidden sm:flex items-center w-[200px] md:w-[220px] h-9 pl-9 pr-4 text-[14px] bg-[#f0f3fa] hover:bg-[#e6eaf5] text-gray-500 rounded-full border-none focus-visible:ring-2 focus-visible:ring-[#2962FF]/40 cursor-pointer transition-colors text-left shrink-0"
          >
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 pointer-events-none" />
            <span className="truncate whitespace-nowrap">Search (Ctrl+K)</span>
          </button>

          {/* Mobile Search Icon Button */}
          <button
            type="button"
            aria-label="Search symbols"
            onClick={onOpenSearch}
            className="sm:hidden p-2 text-gray-700 hover:text-[#2962FF] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Primary Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-6 text-[14px] font-medium text-[#131722]">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onSelectSection(item)}
                  className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2962FF] rounded ${
                    isActive
                      ? 'text-[#2962FF] font-semibold'
                      : 'text-[#131722] hover:text-[#2962FF]'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Language Selector, User Icon, and Black Friday Badge */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangMenuOpen((prev) => !prev)}
              aria-expanded={langMenuOpen}
              aria-haspopup="listbox"
              className="flex items-center gap-1.5 text-[14px] font-medium text-[#131722] hover:text-[#2962FF] transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Globe className="w-[18px] h-[18px] text-gray-700" strokeWidth={1.6} />
              <span>{language}</span>
            </button>

            {langMenuOpen && (
              <div
                role="listbox"
                aria-label="Select Language"
                className="absolute right-0 mt-2 w-40 bg-white rounded-xl border border-gray-200 shadow-lg py-1.5 z-40"
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    role="option"
                    aria-selected={language === lang.code}
                    onClick={() => {
                      onChangeLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-[13px] flex items-center justify-between hover:bg-[#f0f3fa] transition-colors cursor-pointer ${
                      language === lang.code
                        ? 'text-[#2962FF] font-semibold bg-[#f0f3fa]/60'
                        : 'text-[#131722]'
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-[11px] text-[#787B86] font-mono">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile / Watchlist Button */}
          <div className="relative" ref={accountRef}>
            <button
              type="button"
              aria-label="User Account & Watchlist"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((prev) => !prev)}
              className="relative p-1.5 text-gray-700 hover:text-[#2962FF] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <User className="w-5 h-5" strokeWidth={1.7} />
            </button>

            {accountOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl p-4 z-40">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <div className="text-[14px] font-semibold text-[#131722]">Market Watchlist</div>
                    <div className="text-[12px] text-[#787B86]">
                      {watchlistSymbols.length} saved {watchlistSymbols.length === 1 ? 'symbol' : 'symbols'}
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Close watchlist"
                    onClick={() => setAccountOpen(false)}
                    className="p-1 text-gray-400 hover:text-[#131722] rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {watchlistSymbols.length === 0 ? (
                  <div className="py-6 text-center text-[13px] text-[#787B86]">
                    No saved symbols yet. Click any market row to add it to your watchlist.
                  </div>
                ) : (
                  <div className="mt-2 max-h-64 overflow-y-auto divide-y divide-gray-100">
                    {watchlistSymbols.map((sym) => (
                      <div
                        key={sym.id}
                        className="py-2.5 flex items-center justify-between gap-2 group"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onSelectSymbol(sym);
                            setAccountOpen(false);
                          }}
                          className="flex items-center gap-2.5 text-left min-w-0 flex-1 cursor-pointer hover:opacity-80"
                        >
                          <span
                            className="w-6 h-6 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: sym.badgeBg,
                              color: sym.badgeTextColor ?? '#ffffff',
                            }}
                          >
                            {sym.badgeText}
                          </span>
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-[#131722] truncate">
                              {sym.ticker}
                            </div>
                            <div className="text-[11px] text-[#787B86] truncate">{sym.name}</div>
                          </div>
                        </button>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right tabular-nums">
                            <div className="text-[12px] font-semibold text-[#131722]">
                              {sym.priceDisplay}
                            </div>
                            <div
                              className={`text-[11px] font-semibold ${
                                sym.isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                              }`}
                            >
                              {sym.changePctDisplay}
                            </div>
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove ${sym.ticker} from watchlist`}
                            onClick={() => onRemoveWatchlist(sym.id)}
                            className="p-1 text-amber-500 hover:text-gray-400 rounded cursor-pointer"
                            title="Remove from watchlist"
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Black Friday Promo Badge Button */}
          <button
            type="button"
            onClick={onToggleBlackFriday}
            className="nav-badge-gradient text-white px-3.5 py-1 rounded-md text-center leading-tight shadow-sm hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
          >
            <span className="block text-[12px] font-bold tracking-tight">Black Friday</span>
            <span className="block text-[10px] font-medium opacity-95">Up to 80% OFF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
