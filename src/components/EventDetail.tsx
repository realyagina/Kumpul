import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Star,
  BadgeCheck,
  Users,
  CheckCircle2,
  Share2,
  ExternalLink,
  ShieldAlert,
  AlertCircle,
  Repeat,
  Globe,
  Sparkles,
} from 'lucide-react';
import { EventItem, User } from '../types';
import { Language, translations, formatCurrency, formatDisplayDate, isToday } from '../translations';
import { CATEGORY_COLORS } from '../data/seedData';

interface EventDetailProps {
  event: EventItem;
  language: Language;
  onClose: () => void;
  onProceedToJoin: (event: EventItem) => void;
  currentUser: User | null;
  hasUserJoined: boolean;
}

export const EventDetail: React.FC<EventDetailProps> = ({
  event,
  language,
  onClose,
  onProceedToJoin,
  currentUser,
  hasUserJoined,
}) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);
  const categoryConfig = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other;
  const happeningToday = isToday(event.date);
  const remainingSpots = Math.max(0, event.capacity - event.attendeesCount);
  const isSoldOut = remainingSpots === 0;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${event.title} ${event.locationName}`
    )}&query_place_id=${event.lat},${event.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      {/* Modal Dialog Card */}
      <div className="bg-[#FAFAF7] w-full max-w-2xl min-h-screen sm:min-h-0 sm:max-h-[92vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative my-auto border border-gray-200">
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1">
          {/* Cover Hero */}
          <div className="relative h-60 sm:h-72 w-full overflow-hidden">
            {event.customImage ? (
              <img src={event.customImage} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${event.gradientTheme} flex items-center justify-center relative`}
              >
                <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                <span className="text-7xl filter drop-shadow-lg select-none">{categoryConfig.emoji}</span>
              </div>
            )}

            {/* Badges on Hero */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-gray-900 shadow-md">
                {categoryConfig.emoji} {t.categories[event.category]}
              </span>

              {happeningToday && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#FF8A3D] text-white shadow-md animate-pulse-subtle">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  {t.happeningToday}
                </span>
              )}

              {event.repeatsWeekly && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white shadow-md">
                  <Repeat className="w-3.5 h-3.5 text-[#0F9D8A]" />
                  <span>{t.repeatsWeekly}</span>
                </span>
              )}
            </div>

            {/* Price Pill Floating on Bottom Left */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-lg border border-gray-100">
              <span className="text-xs text-gray-500 font-semibold block leading-tight">
                {event.price === 0 ? 'Status' : t.pricePerTicket}
              </span>
              <span className="text-lg sm:text-xl font-black text-[#0F9D8A]">
                {formatCurrency(event.price, language)}
              </span>
            </div>
          </div>

          {/* Details Container */}
          <div className="p-5 sm:p-7 space-y-6">
            {/* Title & Level / Badges */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-200/80 text-gray-700">
                  {t.levels[event.level] || event.level}
                </span>
                {event.touristFriendly && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{t.touristFriendly}</span>
                  </span>
                )}
                {isSoldOut ? (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-red-600 text-white ml-auto">
                    {t.soldOut}
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#0F9D8A]/10 text-[#0F9D8A] ml-auto">
                    {remainingSpots} {t.spotsLeft}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                {event.title}
              </h1>
            </div>

            {/* Host Profile Card */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl ${event.host.avatarColor} text-white font-bold text-lg flex items-center justify-center shadow-xs flex-shrink-0`}
                >
                  {event.host.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                      {event.host.name}
                    </h4>
                    {event.host.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0F9D8A] bg-[#0F9D8A]/10 px-2 py-0.5 rounded-full">
                        <BadgeCheck className="w-3.5 h-3.5 fill-[#0F9D8A]/20" />
                        {t.verified}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      {event.host.rating.toFixed(1)}
                    </span>
                    <span>•</span>
                    <span>{t.host}</span>
                  </div>
                  {event.host.bio && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">{event.host.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Date, Time & Location Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Date & Time */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#0F9D8A]/10 text-[#0F9D8A] flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                    {t.dateAndTime}
                  </span>
                  <div className="text-sm font-bold text-gray-900 mt-0.5">
                    {formatDisplayDate(event.date, language)}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-1 mt-0.5 font-medium">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>{event.startTime} - {event.endTime} WITA</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#FF8A3D]/10 text-[#FF8A3D] flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                    {t.location}
                  </span>
                  <div className="text-sm font-bold text-gray-900 mt-0.5 truncate">
                    {event.locationName}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{event.address}</p>
                  <button
                    type="button"
                    onClick={openGoogleMaps}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0F9D8A] hover:underline mt-1 cursor-pointer"
                  >
                    <span>{t.tapToOpenMap}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-2">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider text-gray-500 text-[11px]">
                {t.eventDetails}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* What to Bring */}
            {event.whatToBring && event.whatToBring.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF8A3D]" />
                  <span>{t.whatToBring}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.whatToBring.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4F4F0] text-gray-800 text-xs font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F9D8A]" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Attendees List */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0F9D8A]" />
                  <span>{t.attendeesList}</span>
                </h3>
                <span className="text-xs font-bold text-gray-500">
                  {event.attendeesCount} / {event.capacity} {t.person}
                </span>
              </div>

              {/* Avatars */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {event.attendees && event.attendees.length > 0 ? (
                  event.attendees.map((attendee, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-shrink-0 group relative"
                    >
                      <div
                        className={`w-9 h-9 rounded-full ${attendee.avatarColor} text-white font-bold text-xs flex items-center justify-center ring-2 ring-white shadow-xs`}
                      >
                        {attendee.initial}
                      </div>
                      <span className="text-[10px] text-gray-600 mt-1 truncate max-w-[60px]">
                        {attendee.name.split(' ')[0]}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">Jadilah peserta pertama yang bergabung!</p>
                )}
              </div>
            </div>

            {/* Cancellation Policy line */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-2.5 text-xs text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{t.cancellationPolicyTitle}: </span>
                <span>{t.cancellationPolicyText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 bg-white border-t border-gray-200/80 flex items-center justify-between gap-3 z-10 shadow-lg">
          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-gray-200 hover:bg-gray-50 active:scale-95 text-xs font-bold text-gray-700 transition-all cursor-pointer flex-shrink-0"
            title={t.share}
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{copied ? t.copiedLink : t.share}</span>
          </button>

          {/* Price Summary */}
          <div className="hidden sm:block">
            <span className="text-[11px] text-gray-400 block font-medium">Total</span>
            <span className="text-lg font-black text-gray-900">
              {formatCurrency(event.price, language)}
            </span>
          </div>

          {/* Join / Buy Ticket Action */}
          {hasUserJoined ? (
            <div className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.alreadyJoined}</span>
            </div>
          ) : isSoldOut ? (
            <button
              disabled
              className="flex-1 sm:flex-initial py-3 px-6 rounded-2xl bg-gray-200 text-gray-500 text-xs sm:text-sm font-bold cursor-not-allowed text-center"
            >
              {t.soldOut}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onProceedToJoin(event)}
              className="flex-1 sm:flex-initial py-3.5 px-6 rounded-2xl bg-[#0F9D8A] hover:bg-[#0b7e6f] active:scale-95 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-[#0F9D8A]/20 transition-all cursor-pointer text-center"
            >
              {event.price === 0 ? t.actionJoin : t.actionBuyTicket}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
