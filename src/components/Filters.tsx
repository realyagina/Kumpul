import React, { useState } from 'react';
import { Search, RotateCcw, SlidersHorizontal, ChevronDown, Check, Globe } from 'lucide-react';
import { Category, EventLevel, FilterState } from '../types';
import { Language, translations } from '../translations';
import { CATEGORY_COLORS } from '../data/seedData';

interface FiltersProps {
  language: Language;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

const CATEGORIES: (Category | 'All')[] = [
  'All',
  'Running',
  'Yoga',
  'Hiking',
  'Workshop',
  'Sports',
  'Other',
];

export const Filters: React.FC<FiltersProps> = ({
  language,
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  const t = translations[language];
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Check if any non-default filter is active
  const hasActiveFilters =
    filters.searchQuery.trim() !== '' ||
    filters.category !== 'All' ||
    filters.dateFilter !== 'all' ||
    filters.timeOfDay !== 'all' ||
    filters.priceType !== 'all' ||
    filters.level !== 'all' ||
    filters.touristFriendlyOnly;

  return (
    <div className="bg-white border-b border-gray-200/80 px-3 sm:px-4 py-3 space-y-3">
      {/* Search Bar & Advanced Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 bg-[#F8F8F5] focus:bg-white text-xs sm:text-sm text-gray-900 rounded-xl border border-gray-200 focus:border-[#0F9D8A] focus:outline-hidden transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-200/80 hover:bg-gray-300 w-4 h-4 rounded-full flex items-center justify-center font-bold"
            >
              ×
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            showAdvanced || (hasActiveFilters && filters.category === 'All')
              ? 'bg-[#0F9D8A]/10 border-[#0F9D8A] text-[#0F9D8A]'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.filters}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
            title={t.resetFilter}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.resetFilter}</span>
          </button>
        )}
      </div>

      {/* Category Pills (Horizontal Scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {CATEGORIES.map((cat) => {
          const isSelected = filters.category === cat;
          const config = cat !== 'All' ? CATEGORY_COLORS[cat] : null;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onFilterChange({ category: cat })}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#0F9D8A] text-white shadow-xs scale-102 font-bold'
                  : 'bg-[#F2F2EC] hover:bg-[#E7E7E0] text-gray-700 border border-transparent'
              }`}
            >
              {config && <span>{config.emoji}</span>}
              <span>{t.categories[cat]}</span>
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Collapsible Area */}
      {showAdvanced && (
        <div className="pt-2 pb-1 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Date Filter */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-700 block text-[11px] uppercase tracking-wider">
              {t.filterByDate}
            </label>
            <div className="grid grid-cols-2 gap-1">
              {(['all', 'today', 'tomorrow', 'this_week'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onFilterChange({ dateFilter: opt })}
                  className={`py-1.5 px-2 rounded-lg text-left transition-colors truncate ${
                    filters.dateFilter === opt
                      ? 'bg-[#0F9D8A] text-white font-semibold'
                      : 'bg-gray-100 hover:bg-gray-200/80 text-gray-700'
                  }`}
                >
                  {t.dateOptions[opt]}
                </button>
              ))}
            </div>
          </div>

          {/* Time of Day */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-700 block text-[11px] uppercase tracking-wider">
              {t.filterByTime}
            </label>
            <div className="space-y-1">
              {(['all', 'morning', 'afternoon', 'evening'] as const).map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => onFilterChange({ timeOfDay: time })}
                  className={`w-full py-1.5 px-2 rounded-lg text-left transition-colors truncate text-[11px] ${
                    filters.timeOfDay === time
                      ? 'bg-[#0F9D8A] text-white font-semibold'
                      : 'bg-gray-100 hover:bg-gray-200/80 text-gray-700'
                  }`}
                >
                  {t.timeOptions[time]}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Level */}
          <div className="space-y-3">
            <div>
              <label className="font-semibold text-gray-700 block text-[11px] uppercase tracking-wider mb-1">
                {t.filterByPrice}
              </label>
              <div className="flex gap-1">
                {(['all', 'free', 'paid'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onFilterChange({ priceType: p })}
                    className={`flex-1 py-1.5 text-center rounded-lg transition-colors text-[11px] ${
                      filters.priceType === p
                        ? 'bg-[#0F9D8A] text-white font-semibold'
                        : 'bg-gray-100 hover:bg-gray-200/80 text-gray-700'
                    }`}
                  >
                    {t.priceOptions[p]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 block text-[11px] uppercase tracking-wider mb-1">
                {t.filterByLevel}
              </label>
              <select
                value={filters.level}
                onChange={(e) => onFilterChange({ level: e.target.value as 'all' | EventLevel })}
                aria-label={t.filterByLevel}
                className="w-full bg-gray-100 border border-gray-200 rounded-lg py-1.5 px-2 text-[11px] text-gray-800 focus:outline-hidden focus:border-[#0F9D8A]"
              >
                <option value="all">{t.levels.all}</option>
                <option value="Pemula">{t.levels.Pemula}</option>
                <option value="Menengah">{t.levels.Menengah}</option>
                <option value="Lanjutan">{t.levels.Lanjutan}</option>
                <option value="Semua Level">{t.levels['Semua Level']}</option>
              </select>
            </div>
          </div>

          {/* Tourist Friendly Toggle & Results summary */}
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <label className="font-semibold text-gray-700 block text-[11px] uppercase tracking-wider mb-1">
                {t.touristFriendly}
              </label>
              <label className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/70 border border-amber-200/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.touristFriendlyOnly}
                  onChange={(e) => onFilterChange({ touristFriendlyOnly: e.target.checked })}
                  className="rounded text-[#0F9D8A] focus:ring-[#0F9D8A] w-4 h-4 cursor-pointer"
                />
                <div className="flex items-center gap-1.5 text-xs text-amber-900 font-medium">
                  <Globe className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.touristFriendlyTag}</span>
                </div>
              </label>
            </div>

            <div className="bg-gray-50 p-2 rounded-xl border border-gray-200/70 text-right">
              <span className="text-xs font-bold text-gray-800">
                {totalResults} {t.filterResults}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Active Quick Filters Bar (when advanced filters are collapsed) */}
      {!showAdvanced && (
        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-gray-900">{totalResults}</span>
            <span>{t.filterResults}</span>

            {filters.dateFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0F9D8A]/10 text-[#0F9D8A] font-semibold">
                {t.dateOptions[filters.dateFilter]}
              </span>
            )}
            {filters.priceType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0F9D8A]/10 text-[#0F9D8A] font-semibold">
                {t.priceOptions[filters.priceType]}
              </span>
            )}
            {filters.touristFriendlyOnly && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-semibold">
                🌐 {t.touristFriendly}
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-[#0F9D8A] hover:underline font-semibold ml-2 cursor-pointer"
            >
              {t.resetFilter}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
