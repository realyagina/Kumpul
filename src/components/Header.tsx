import React from 'react';
import { MapPin, Plus, User as UserIcon, Calendar, Compass, Layers } from 'lucide-react';
import { Language, translations } from '../translations';
import { LanguageToggle } from './LanguageToggle';
import { User } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: User | null;
  onOpenCreate: () => void;
  onOpenProfile: () => void;
  onOpenLogin: () => void;
  activeRegion: 'all' | 'canggu' | 'ubud';
  onRegionChange: (region: 'all' | 'canggu' | 'ubud') => void;
  viewMode: 'map' | 'list';
  onToggleViewMode: () => void;
  joinedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  currentUser,
  onOpenCreate,
  onOpenProfile,
  onOpenLogin,
  activeRegion,
  onRegionChange,
  viewMode,
  onToggleViewMode,
  joinedCount,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onRegionChange('all')}>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#0F9D8A] text-white flex items-center justify-center shadow-md shadow-[#0F9D8A]/20 transition-transform group-hover:scale-105">
                <MapPin className="w-5 h-5 fill-white text-[#0F9D8A] -mt-0.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1F2937]">
                    Kumpul
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-[#FF8A3D]" />
                </div>
                <p className="text-[11px] text-gray-500 font-medium hidden md:block -mt-0.5">
                  {t.tagline}
                </p>
              </div>
            </div>

            {/* Quick Region Switcher (Desktop & Tablet) */}
            <div className="hidden sm:flex items-center bg-[#F3F4F0] p-1 rounded-xl border border-gray-200/80 text-xs font-semibold ml-2">
              <button
                type="button"
                onClick={() => onRegionChange('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeRegion === 'all'
                    ? 'bg-white text-[#0F9D8A] shadow-xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.allBali}
              </button>
              <button
                type="button"
                onClick={() => onRegionChange('canggu')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeRegion === 'canggu'
                    ? 'bg-white text-[#0F9D8A] shadow-xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Canggu
              </button>
              <button
                type="button"
                onClick={() => onRegionChange('ubud')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeRegion === 'ubud'
                    ? 'bg-white text-[#0F9D8A] shadow-xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Ubud
              </button>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Mobile View Switcher (Peta / Daftar) */}
            <button
              type="button"
              onClick={onToggleViewMode}
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 active:scale-95 transition-all shadow-xs"
              aria-label="Switch map/list view"
            >
              {viewMode === 'map' ? (
                <>
                  <Layers className="w-3.5 h-3.5 text-[#0F9D8A]" />
                  <span>{t.listView}</span>
                </>
              ) : (
                <>
                  <Compass className="w-3.5 h-3.5 text-[#0F9D8A]" />
                  <span>{t.mapView}</span>
                </>
              )}
            </button>

            {/* Language Toggle */}
            <LanguageToggle language={language} onToggle={onLanguageChange} />

            {/* Create Event Button */}
            <button
              type="button"
              onClick={onOpenCreate}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#FF8A3D] hover:bg-[#e9782e] active:scale-95 text-white font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t.createEvent}</span>
            </button>

            {/* Mobile Host Icon Button */}
            <button
              type="button"
              onClick={onOpenCreate}
              className="sm:hidden p-2 rounded-xl bg-[#FF8A3D] text-white active:scale-95 shadow-xs"
              title={t.createEvent}
              aria-label={t.createEvent}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* User Account / Profile */}
            {currentUser && currentUser.isLoggedIn ? (
              <button
                type="button"
                onClick={onOpenProfile}
                className="flex items-center gap-2 pl-1.5 pr-2.5 sm:pr-3 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200/90 rounded-xl transition-all cursor-pointer text-left"
              >
                <div className={`w-7 h-7 rounded-lg ${currentUser.avatarColor} text-white font-bold text-xs flex items-center justify-center shadow-xs`}>
                  {currentUser.initial}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[100px]">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  {joinedCount > 0 && (
                    <div className="text-[10px] text-[#0F9D8A] font-medium flex items-center gap-0.5">
                      <Calendar className="w-2.5 h-2.5" />
                      {joinedCount} {language === 'id' ? 'acara' : 'events'}
                    </div>
                  )}
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0F9D8A] hover:text-[#0b7869] bg-[#0F9D8A]/10 hover:bg-[#0F9D8A]/15 px-3 py-2 rounded-xl transition-all cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>{t.signIn}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Region Bar */}
        <div className="flex sm:hidden items-center justify-between gap-1 pt-2 border-t border-gray-100 mt-2 text-xs font-semibold">
          <div className="flex items-center gap-1 w-full">
            <button
              type="button"
              onClick={() => onRegionChange('all')}
              className={`flex-1 py-1 rounded-lg text-center transition-all ${
                activeRegion === 'all'
                  ? 'bg-[#0F9D8A] text-white font-bold shadow-xs'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {t.allBali}
            </button>
            <button
              type="button"
              onClick={() => onRegionChange('canggu')}
              className={`flex-1 py-1 rounded-lg text-center transition-all ${
                activeRegion === 'canggu'
                  ? 'bg-[#0F9D8A] text-white font-bold shadow-xs'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Canggu
            </button>
            <button
              type="button"
              onClick={() => onRegionChange('ubud')}
              className={`flex-1 py-1 rounded-lg text-center transition-all ${
                activeRegion === 'ubud'
                  ? 'bg-[#0F9D8A] text-white font-bold shadow-xs'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Ubud
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
