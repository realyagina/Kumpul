import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  Info,
} from 'lucide-react';
import { EventItem, User, Booking } from '../types';
import { Language, translations, formatCurrency, formatDisplayDate } from '../translations';

interface PaymentFlowProps {
  event: EventItem;
  currentUser: User | null;
  language: Language;
  onClose: () => void;
  onCompleteBooking: (booking: Booking) => void;
  onOpenLogin: () => void;
}

type Step = 'form' | 'payment_method' | 'success';

export const PaymentFlow: React.FC<PaymentFlowProps> = ({
  event,
  currentUser,
  language,
  onClose,
  onCompleteBooking,
  onOpenLogin,
}) => {
  const t = translations[language];
  const isFree = event.price === 0;

  // Form states
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [quantity, setQuantity] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<'QRIS' | 'GoPay' | 'OVO' | 'DANA' | 'Bank Transfer'>('QRIS');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<Step>('form');
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Auto-fill from user
  useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.name);
      if (!phone) setPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Calculations
  const ticketSubtotal = event.price * quantity;
  const serviceFeePerTicket = 2000;
  const totalServiceFee = isFree ? 0 : serviceFeePerTicket * quantity;
  const grandTotal = isFree ? 0 : ticketSubtotal + totalServiceFee;

  // Max allowed quantity (up to 4 or remaining capacity)
  const remainingSpots = Math.max(1, event.capacity - event.attendeesCount);
  const maxQuantity = Math.min(4, remainingSpots);

  // Generate randomized booking code
  const generateBookingCode = () => {
    const prefix = isFree ? 'KMPL-FREE' : 'KMPL-TIX';
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}-${rand}`;
  };

  const handleConfirmRsvp = () => {
    if (!name.trim() || !phone.trim()) {
      alert('Mohon isi nama lengkap dan nomor telepon/WhatsApp Anda.');
      return;
    }

    if (!isFree) {
      setStep('payment_method');
      return;
    }

    // Free event booking
    finishBooking('Free');
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      finishBooking(selectedMethod);
    }, 1200);
  };

  const finishBooking = (method: 'QRIS' | 'GoPay' | 'OVO' | 'DANA' | 'Bank Transfer' | 'Free') => {
    const newBooking: Booking = {
      id: 'book-' + Date.now(),
      eventId: event.id,
      eventTitle: event.title,
      category: event.category,
      eventDate: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      locationName: event.locationName,
      bookingCode: generateBookingCode(),
      quantity: isFree ? 1 : quantity,
      ticketPrice: event.price,
      serviceFee: isFree ? 0 : totalServiceFee,
      totalPrice: isFree ? 0 : grandTotal,
      paymentMethod: method,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      userName: name,
      userPhone: phone,
      canCancelUntil: event.date + 'T' + event.startTime + ':00',
    };

    setCreatedBooking(newBooking);
    onCompleteBooking(newBooking);
    setStep('success');

    // Launch confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0F9D8A', '#FF8A3D', '#10B981', '#6366F1'],
    });
  };

  const copyBookingCode = () => {
    if (!createdBooking) return;
    navigator.clipboard.writeText(createdBooking.bookingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative my-auto border border-gray-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-gray-900">
              {step === 'success'
                ? t.successTitle
                : isFree
                ? t.rsvpFreeTitle
                : t.ticketOrderTitle}
            </h3>
            <p className="text-xs text-gray-500 truncate max-w-xs">{event.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: Details & Form */}
        {step === 'form' && (
          <div className="p-5 space-y-4">
            {/* Event Summary Strip */}
            <div className="p-3.5 bg-[#FAFAF7] rounded-2xl border border-gray-200/80 flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${event.gradientTheme} flex items-center justify-center text-xl flex-shrink-0 text-white`}
              >
                {event.customImage ? (
                  <img src={event.customImage} alt="" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span>📍</span>
                )}
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <span className="font-bold text-gray-900 block truncate">{event.title}</span>
                <span className="text-gray-500 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-[#0F9D8A]" />
                  {formatDisplayDate(event.date, language)} • {event.startTime} WITA
                </span>
                <span className="text-gray-500 truncate block mt-0.5">{event.locationName}</span>
              </div>
            </div>

            {/* If user not logged in banner */}
            {!currentUser && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs flex items-center justify-between gap-2">
                <div className="text-teal-900">
                  <span className="font-bold">Punya akun Kumpul? </span>
                  <span>Masuk untuk simpan tiket ke profil Anda.</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="px-2.5 py-1 bg-[#0F9D8A] text-white font-bold rounded-lg text-[11px] hover:bg-[#0c7f6f]"
                >
                  {t.signIn}
                </button>
              </div>
            )}

            {/* Attendee Info Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t.yourName}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Pratama"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0F9D8A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t.yourPhone}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0F9D8A] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Quantity Selector for Paid Events */}
            {!isFree && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">{t.ticketQuantity}</span>
                    <span className="text-[11px] text-gray-500">Maksimal 4 tiket per pesanan</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center font-bold text-gray-700 disabled:opacity-30 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-gray-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      disabled={quantity >= maxQuantity}
                      className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center font-bold text-gray-700 disabled:opacity-30 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/70 text-xs space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>
                      {formatCurrency(event.price, language)} × {quantity} tiket
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(ticketSubtotal, language)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <div>
                      <span>{t.serviceFee}</span>
                      <span className="text-[10px] text-gray-400 block">{t.serviceFeeNote}</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(totalServiceFee, language)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-900">{t.totalPayment}</span>
                    <span className="font-extrabold text-[#0F9D8A] text-base">
                      {formatCurrency(grandTotal, language)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConfirmRsvp}
                className="w-full py-3.5 rounded-2xl bg-[#0F9D8A] hover:bg-[#0b7e6f] active:scale-98 text-white font-extrabold text-sm shadow-md shadow-[#0F9D8A]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isFree ? t.confirmRsvp : t.selectPayment}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Simulated Payment Selection (for paid events) */}
        {step === 'payment_method' && (
          <div className="p-5 space-y-4">
            {/* Simulation Warning Banner */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">SIMULASI / DEMO ONLY: </span>
                <span>{t.simulatedPaymentNotice}</span>
              </div>
            </div>

            {/* Total to pay */}
            <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 font-semibold">{t.totalPayment}</span>
                <div className="text-xl font-black text-[#0F9D8A]">
                  {formatCurrency(grandTotal, language)}
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-200/80 text-gray-700">
                {quantity} {quantity === 1 ? 'Tiket' : 'Tiket'}
              </span>
            </div>

            {/* Payment Method Radio Options */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                {t.paymentMethod}
              </label>

              {(['QRIS', 'GoPay', 'OVO', 'DANA', 'Bank Transfer'] as const).map((method) => {
                const isChecked = selectedMethod === method;
                return (
                  <label
                    key={method}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-[#0F9D8A] bg-[#0F9D8A]/5 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={isChecked}
                        onChange={() => setSelectedMethod(method)}
                        className="text-[#0F9D8A] focus:ring-[#0F9D8A] cursor-pointer"
                      />
                      <div className="text-xs font-bold text-gray-800">
                        {t.paymentMethods[method]}
                      </div>
                    </div>
                    {method === 'QRIS' && (
                      <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                        Instan
                      </span>
                    )}
                  </label>
                );
              })}
            </div>

            {/* Action */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                {t.back}
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="flex-1 py-3.5 rounded-2xl bg-[#0F9D8A] hover:bg-[#0b7e6f] active:scale-98 text-white font-extrabold text-sm shadow-md shadow-[#0F9D8A]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>{t.processingPayment}</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t.payNow} (Simulasi)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success E-Ticket Screen */}
        {step === 'success' && createdBooking && (
          <div className="p-6 space-y-5 text-center">
            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-gray-900">{t.successTitle}</h2>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">{t.successDesc}</p>
            </div>

            {/* E-Ticket Card */}
            <div className="bg-[#F8F9F5] p-5 rounded-3xl border border-dashed border-gray-300 text-left space-y-4 relative">
              {/* Notches */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-r border-gray-300" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-l border-gray-300" />

              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-[#0F9D8A]" />
                  <span className="text-xs font-bold text-gray-900">E-Ticket Kumpul</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {t.bookingStatusConfirmed}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-gray-900 text-sm">{event.title}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-[#0F9D8A]" />
                  <span>{formatDisplayDate(event.date, language)}</span>
                  <span>•</span>
                  <span>{event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{event.locationName}</span>
                </div>
              </div>

              {/* Booking Code with Copy */}
              <div className="p-3 bg-white rounded-2xl border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    {t.bookingCode}
                  </span>
                  <span className="text-sm font-mono font-extrabold text-gray-900">
                    {createdBooking.bookingCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyBookingCode}
                  className="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Disalin' : 'Salin'}</span>
                </button>
              </div>

              {/* Summary line */}
              <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
                <span>Peserta: <strong className="text-gray-900">{createdBooking.userName}</strong> ({createdBooking.quantity} orang)</span>
                <span>Total: <strong className="text-[#0F9D8A]">{formatCurrency(createdBooking.totalPrice, language)}</strong></span>
              </div>
            </div>

            {/* Close / Return Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-[#0F9D8A] hover:bg-[#0b7e6f] text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
              >
                {t.backToHome}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
