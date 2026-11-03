import React from 'react';
import { Calendar, Clock, MapPin, Star, BadgeCheck, Users, Globe } from 'lucide-react';
import { EventItem } from '../types';
import { Language, translations, formatCurrency, formatDisplayDate, isToday } from '../translations';
import { CATEGORY_COLORS } from '../data/seedData';

interface EventCardProps {
  event: EventItem;
  language: Language;
  onSelect: (event: EventItem) => void;
  isSelected?: boolean;
  compact?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  language,
  onSelect,
  isSelected = false,
  compact = false,
}) => {
  const t = translations[language];
  const categoryConfig = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other;
  const happeningToday = isToday(event.date);
  const remainingSpots = Math.max(0, event.capacity - event.attendeesCount);
  const isSoldOut = remainingSpots === 0;

  if (compact) {
    return (
      <div
        onClick={() => onSelect(event)}
        className={`p-3 bg-white rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
          isSelected
            ? 'border-[#0F9D8A] ring-2 ring-[#0F9D8A]/20 shadow-md'
            : 'border-gray-200/80 hover:border-gray-300'
        }`}
      >
        <div className="flex gap-3 items-center">
          {/* Mini Cover */}
          <div
            className={`w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl relative overflow-hidden bg-gradient-to-br ${event.gradientTheme}`}
          >
            {event.customImage ? (
              <img src={event.customImage} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <span>{categoryConfig.emoji}</span>
            )}
            {happeningToday && (
              <span className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-[#FF8A3D] ring-2 ring-white animate-pulse" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${categoryConfig.bg}`}>
                {t.categories[event.category]}
              </span>
              <span className="text-[11px] font-bold text-gray-900 ml-auto">
                {formatCurrency(event.price, language)}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
              {event.title}
            </h4>

            <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
              <span className="flex items-center gap-1 truncate">
                <Clock className="w-3 h-3 text-[#0F9D8A]" />
                {event.startTime}
              </span>
              <span>•</span>
              <span className="truncate">{event.locationName.split(',')[0]}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(event)}
      className={`group bg-white rounded-2xl border overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 flex flex-col ${
        isSelected
          ? 'border-[#0F9D8A] ring-2 ring-[#0F9D8A]/30 shadow-md'
          : 'border-gray-200/90 hover:border-gray-300 shadow-xs'
      }`}
    >
      {/* Cover Banner */}
      <div className="relative h-36 sm:h-40 w-full overflow-hidden">
        {event.customImage ? (
          <img
            src={event.customImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${event.gradientTheme} flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300`}
          >
            {/* Subtle background pattern shapes */}
            <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            <span className="text-5xl filter drop-shadow-md select-none transform transition-transform group-hover:scale-110">
              {categoryConfig.emoji}
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1.5 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md text-gray-900 shadow-xs">
              {categoryConfig.emoji} {t.categories[event.category]}
            </span>

            {happeningToday && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-[#FF8A3D] text-white shadow-md animate-pulse-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                {t.happeningToday}
              </span>
            )}
          </div>

          <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xs text-right">
            <span className="text-xs sm:text-sm font-extrabold text-[#0F9D8A]">
              {formatCurrency(event.price, language)}
            </span>
          </div>
        </div>

        {/* Bottom Tags inside Cover */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {event.touristFriendly && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-md text-white">
              <Globe className="w-3 h-3 text-emerald-300" />
              <span>{t.touristFriendly}</span>
            </span>
          )}

          <div className="ml-auto">
            {isSoldOut ? (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-red-600 text-white shadow-xs">
                {t.soldOut}
              </span>
            ) : (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-md text-white flex items-center gap-1">
                <Users className="w-3 h-3 text-[#0F9D8A]" />
                {remainingSpots} {t.spotsLeft}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title */}
          <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug group-hover:text-[#0F9D8A] transition-colors line-clamp-2">
            {event.title}
          </h3>

          {/* Date, Time, Location */}
          <div className="mt-2.5 space-y-1.5 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#0F9D8A] flex-shrink-0" />
              <span className="font-semibold text-gray-800">
                {formatDisplayDate(event.date, language)}
              </span>
              <span className="text-gray-300">•</span>
              <Clock className="w-3.5 h-3.5 text-[#0F9D8A] flex-shrink-0" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="truncate font-medium">{event.locationName}</span>
            </div>
          </div>
        </div>

        {/* Footer: Host & CTA */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          {/* Host info */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg ${event.host.avatarColor} text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs`}
            >
              {event.host.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-gray-800 truncate">
                  {event.host.name}
                </span>
                {event.host.isVerified && (
                  <span title={t.verified}>
                    <BadgeCheck className="w-3.5 h-3.5 text-[#0F9D8A] fill-[#0F9D8A]/20 flex-shrink-0" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-gray-500">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{event.host.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(event);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#0F9D8A]/10 hover:bg-[#0F9D8A] text-[#0F9D8A] hover:text-white font-bold text-xs transition-colors flex-shrink-0"
          >
            {t.openDetail}
          </button>
        </div>
      </div>
    </div>
  );
};
