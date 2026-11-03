import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  LogOut,
  Users,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Star,
  ExternalLink,
} from 'lucide-react';
import { Booking, EventItem, User } from '../types';
import { Language, translations, formatCurrency, formatDisplayDate } from '../translations';

interface ProfileModalProps {
  language: Language;
  currentUser: User;
  bookings: Booking[];
  hostedEvents: EventItem[];
  onClose: () => void;
  onLogout: () => void;
  onCancelBooking: (bookingId: string) => void;
  onSelectEvent: (event: EventItem) => void;
  allEvents: EventItem[];
  onOpenCreate: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  language,
  currentUser,
  bookings,
  hostedEvents,
  onClose,
  onLogout,
  onCancelBooking,
  onSelectEvent,
  allEvents,
  onOpenCreate,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'joined' | 'hosted'>('joined');

  // Check if booking can be cancelled (at least 24h before event date + start time)
  const canCancelBooking = (booking: Booking): boolean => {
    try {
      const [year, month, day] = booking.eventDate.split('-').map(Number);
      const [hours, minutes] = booking.startTime.split(':').map(Number);
      const eventTime = new Date(year, month - 1, day, hours, minutes).getTime();
      const now = new Date().getTime();
      const diffHours = (eventTime - now) / (1000 * 60 * 60);
      return diffHours > 24;
    } catch {
      return false;
    }
  };

  const activeBookings = bookings.filter((b) => b.status === 'confirmed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAFAF7] w-full max-w-2xl min-h-screen sm:min-h-0 sm:max-h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative my-auto border border-gray-200">
        {/* Profile Top Bar */}
        <div className="bg-white px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl ${currentUser.avatarColor} text-white font-black text-base flex items-center justify-center shadow-xs`}
            >
              {currentUser.initial}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900 leading-tight">
                {currentUser.name}
              </h3>
              <p className="text-xs text-gray-500">{currentUser.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              title={t.signOut}
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-gray-200 bg-white px-5 text-xs font-bold gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('joined')}
            className={`pb-3 pt-2 transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'joined'
                ? 'border-[#0F9D8A] text-[#0F9D8A]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>{t.tabJoined}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gray-100 text-[10px]">
              {activeBookings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hosted')}
            className={`pb-3 pt-2 transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'hosted'
                ? 'border-[#0F9D8A] text-[#0F9D8A]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.tabHosted}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gray-100 text-[10px]">
              {hostedEvents.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'joined' && (
            <div>
              {activeBookings.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200/80">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F9D8A] flex items-center justify-center text-xl mb-3">
                    🎟️
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 mb-1">{t.noJoinedEvents}</h4>
                  <p className="text-xs text-gray-500 max-w-xs mb-4">
                    Temukan aktivitas seru di peta Canggu atau Ubud sekarang.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-[#0F9D8A] text-white text-xs font-bold rounded-xl hover:bg-[#0c7f6f]"
                  >
                    {t.exploreNow}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeBookings.map((booking) => {
                    const allowCancel = canCancelBooking(booking);
                    const matchingEvent = allEvents.find((e) => e.id === booking.eventId);

                    return (
                      <div
                        key={booking.id}
                        className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                              {t.bookingStatusConfirmed}
                            </span>
                            <h4 className="font-bold text-sm sm:text-base text-gray-900 mt-1">
                              {booking.eventTitle}
                            </h4>
                          </div>

                          <span className="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                            {booking.bookingCode}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#0F9D8A]" />
                            <span>{formatDisplayDate(booking.eventDate, language)}</span>
                            <span>•</span>
                            <span>{booking.startTime} WITA</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span className="truncate">{booking.locationName}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                          <div className="text-gray-500">
                            <span>{booking.quantity} tiket • </span>
                            <strong className="text-gray-900">
                              {formatCurrency(booking.totalPrice, language)}
                            </strong>
                          </div>

                          <div className="flex items-center gap-2">
                            {matchingEvent && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onSelectEvent(matchingEvent);
                                }}
                                className="text-xs text-[#0F9D8A] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <span>{t.openDetail}</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}

                            {allowCancel ? (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(t.cancelBookingConfirm)) {
                                    onCancelBooking(booking.id);
                                  }
                                }}
                                className="text-xs text-red-600 hover:text-red-700 font-bold ml-2 cursor-pointer"
                              >
                                {t.cancelBooking}
                              </button>
                            ) : (
                              <span className="text-[10px] text-gray-400" title={t.cannotCancelExpired}>
                                Pembatalan ditutup
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'hosted' && (
            <div>
              {hostedEvents.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200/80">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#FF8A3D] flex items-center justify-center text-xl mb-3">
                    🏃‍♀️
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 mb-1">{t.noHostedEvents}</h4>
                  <p className="text-xs text-gray-500 max-w-xs mb-4">
                    Jadilah host! Siapa saja dapat membuka sesi lari, yoga, atau kumpul santai.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCreate();
                    }}
                    className="px-4 py-2 bg-[#FF8A3D] text-white text-xs font-bold rounded-xl hover:bg-[#e9782e]"
                  >
                    {t.startHostingNow}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {hostedEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-[#0F9D8A]">
                            {t.categories[evt.category]}
                          </span>
                          <h4 className="font-bold text-sm sm:text-base text-gray-900 mt-1">
                            {evt.title}
                          </h4>
                        </div>
                        <span className="text-xs font-bold text-gray-900">
                          {formatCurrency(evt.price, language)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#0F9D8A]" />
                          <span>{formatDisplayDate(evt.date, language)}</span>
                          <span>•</span>
                          <span>{evt.startTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#0F9D8A] font-bold ml-auto">
                          <Users className="w-3.5 h-3.5" />
                          <span>
                            {evt.attendeesCount} / {evt.capacity} {t.person}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-gray-500 text-[11px]">
                          Rating Host Anda: <strong className="text-amber-500">★ 5.0</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectEvent(evt);
                          }}
                          className="text-xs text-[#0F9D8A] font-bold hover:underline cursor-pointer"
                        >
                          Lihat Detail Publik
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
