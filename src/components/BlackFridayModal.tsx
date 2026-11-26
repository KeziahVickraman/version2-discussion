import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { BLACK_FRIDAY_PLANS } from '../data/marketsData';

interface BlackFridayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_SECONDS = 2 * 86400 + 6 * 3600 + 9 * 60 + 36;

export const BlackFridayModal: React.FC<BlackFridayModalProps> = ({ isOpen, onClose }) => {
  const [totalSeconds, setTotalSeconds] = useState(INITIAL_SECONDS);
  const [viewMode, setViewMode] = useState<'hero' | 'offers'>('hero');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTotalSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setViewMode('hero');
      setSelectedPlanId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const countdownUnits = [
    { label: 'DAYS', value: String(days).padStart(2, '0') },
    { label: 'HOURS', value: String(hours).padStart(2, '0') },
    { label: 'MINS', value: String(mins).padStart(2, '0') },
    { label: 'SECS', value: String(secs).padStart(2, '0') },
  ];

  return (
    <div
      aria-labelledby="bf-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] transition-all duration-200 cursor-pointer"
      data-purpose="black-friday-promo-modal"
      onClick={onClose}
      role="dialog"
    >
      {/* Modal Card */}
      <div
        className="cosmic-modal-bg relative w-full max-w-[920px] min-h-[560px] rounded-[20px] overflow-hidden flex flex-col items-center justify-center px-6 py-12 text-center border border-white/10 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Accretion Disk Visual Layer */}
        <div className="accretion-ring absolute inset-0 pointer-events-none" />

        {/* Top-left back button when viewing offers */}
        {viewMode === 'offers' && (
          <button
            type="button"
            onClick={() => {
              setViewMode('hero');
              setSelectedPlanId(null);
            }}
            className="absolute top-5 left-5 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}

        {/* Close 'X' Button */}
        <button
          aria-label="Close promotion modal"
          className="absolute top-5 right-5 z-20 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
          data-purpose="modal-close-button"
          onClick={onClose}
          type="button"
        >
          <X className="w-6 h-6" strokeWidth={1.8} />
        </button>

        {viewMode === 'hero' ? (
          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
            {/* Gradient Title */}
            <h2
              className="bf-title-gradient text-[52px] sm:text-[72px] font-extrabold tracking-tight leading-none mb-5"
              id="bf-modal-title"
            >
              Black Friday
            </h2>

            {/* Subtitle */}
            <p className="text-white text-[28px] sm:text-[36px] font-bold tracking-tight leading-tight mb-2">
              Up to 80% off
            </p>

            {/* Bonus Offer */}
            <p className="bf-sub-gradient text-[18px] sm:text-[20px] font-bold mb-9">
              +1 free month
            </p>

            {/* Countdown Label */}
            <p className="text-white/90 text-[14px] font-medium mb-3.5">Sale ends in</p>

            {/* Countdown Timer Boxes */}
            <div className="grid grid-cols-4 gap-3 mb-9" data-purpose="countdown-timer">
              {countdownUnits.map((unit) => (
                <div
                  key={unit.label}
                  className="w-[64px] h-[64px] sm:w-[70px] sm:h-[70px] rounded-xl bg-black/55 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center"
                >
                  <span className="text-white text-[20px] sm:text-[22px] font-bold leading-none mb-1 tabular-nums">
                    {unit.value}
                  </span>
                  <span className="text-gray-400 text-[9px] font-semibold tracking-wider uppercase">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={() => setViewMode('offers')}
              className="bf-btn-gradient inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-white text-[15px] font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap"
              data-purpose="explore-offers-cta"
            >
              Explore offers
            </button>
          </div>
        ) : (
          <div className="relative z-10 w-full max-w-4xl mx-auto pt-4">
            <h2
              className="bf-title-gradient text-[32px] sm:text-[40px] font-extrabold tracking-tight leading-tight mb-2"
              id="bf-modal-title"
            >
              Black Friday Annual Plans
            </h2>
            <p className="text-gray-300 text-[14px] sm:text-[15px] mb-7">
              Lock in up to 80% off plus 1 free month on any annual charting plan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {BLACK_FRIDAY_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-5 backdrop-blur-md border transition-all flex flex-col justify-between ${
                      plan.highlighted
                        ? 'bg-white/10 border-[#ff6b00]/60 shadow-lg'
                        : 'bg-black/50 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                        <span className="text-[12px] font-bold bf-sub-gradient">
                          -{plan.discountPct}% OFF
                        </span>
                      </div>
                      <p className="text-[12px] text-gray-400 mb-4">{plan.audience}</p>

                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-bold text-white tabular-nums">
                          ${plan.monthlyDiscounted.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400">/mo</span>
                        <span className="text-xs text-gray-500 line-through tabular-nums ml-1">
                          ${plan.monthlyOriginal.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-[12px] text-gray-300 mb-4 tabular-nums">
                        ${plan.annualTotal.toFixed(2)} billed annually · +1 free month
                      </div>

                      <ul className="space-y-2 text-[13px] text-gray-200 mb-5">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#ff7d26] shrink-0" />
                          <span>{plan.chartsPerTab}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#ff7d26] shrink-0" />
                          <span>{plan.indicatorsPerChart}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#ff7d26] shrink-0" />
                          <span>{plan.alerts}</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`w-full py-2.5 px-4 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#089981] text-white'
                          : plan.highlighted
                          ? 'bf-btn-gradient text-white'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {isSelected ? 'Offer Selected' : `Select ${plan.name}`}
                    </button>
                  </div>
                );
              })}
            </div>

            {selectedPlanId && (
              <div className="mt-5 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-sm text-white">
                <span>
                  Black Friday offer applied to{' '}
                  <strong>
                    {BLACK_FRIDAY_PLANS.find((p) => p.id === selectedPlanId)?.name}
                  </strong>{' '}
                  (+1 free month included).
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[#ff8a00] font-semibold hover:underline cursor-pointer"
                >
                  Return to Markets
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
