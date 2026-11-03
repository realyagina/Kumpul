import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Upload,
  AlertCircle,
  Eye,
  Check,
  Globe,
  Repeat,
} from 'lucide-react';
import { Category, EventItem, EventLevel, User } from '../types';
import { Language, translations } from '../translations';
import { CATEGORY_COLORS } from '../data/seedData';
import { EventCard } from './EventCard';

interface CreateEventFormProps {
  language: Language;
  currentUser: User | null;
  onClose: () => void;
  onSubmit: (newEvent: EventItem) => void;
  onOpenLogin: () => void;
}

const CATEGORIES: Category[] = ['Running', 'Yoga', 'Hiking', 'Workshop', 'Sports', 'Other'];
const LEVELS: EventLevel[] = ['Pemula', 'Menengah', 'Lanjutan', 'Semua Level'];

// Quick Bali presets for pin location
const PRESET_LOCATIONS = [
  { name: 'Echo Beach, Canggu', address: 'Jl. Pantai Batu Mejan, Canggu', lat: -8.6548, lng: 115.1278 },
  { name: 'Batu Bolong Beach, Canggu', address: 'Jl. Pantai Batu Bolong, Canggu', lat: -8.6592, lng: 115.1302 },
  { name: 'Campuhan Ridge Walk, Ubud', address: 'Jl. Raya Campuan, Sayan, Ubud', lat: -8.5035, lng: 115.2539 },
  { name: 'Hanoman Street Center, Ubud', address: 'Jl. Hanoman, Ubud, Gianyar', lat: -8.5134, lng: 115.2638 },
  { name: 'Penestanan Village, Ubud', address: 'Jl. Penestanan Kelod, Sayan, Ubud', lat: -8.5088, lng: 115.2472 },
  { name: 'Berawa Beach, Canggu', address: 'Jl. Pemelisan Agung, Tibubeneng', lat: -8.6621, lng: 115.1385 },
];

export const CreateEventForm: React.FC<CreateEventFormProps> = ({
  language,
  currentUser,
  onClose,
  onSubmit,
  onOpenLogin,
}) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Running');
  const [description, setDescription] = useState('');
  
  // Date setup (defaults to tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const [date, setDate] = useState(tomorrowStr);
  
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('08:30');
  
  const [locationName, setLocationName] = useState('Echo Beach, Canggu');
  const [address, setAddress] = useState('Jl. Pantai Batu Mejan, Canggu, Bali');
  const [lat, setLat] = useState(-8.6548);
  const [lng, setLng] = useState(115.1278);
  
  const [capacity, setCapacity] = useState(20);
  const [level, setLevel] = useState<EventLevel>('Semua Level');
  const [price, setPrice] = useState(0);
  const [whatToBringText, setWhatToBringText] = useState('Air minum, pakaian olahraga, handuk kecil');
  const [repeatsWeekly, setRepeatsWeekly] = useState(false);
  const [touristFriendly, setTouristFriendly] = useState(true);
  const [customImage, setCustomImage] = useState<string | undefined>(undefined);
  
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran gambar maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_LOCATIONS[0]) => {
    setLocationName(preset.name);
    setAddress(preset.address);
    setLat(preset.lat);
    setLng(preset.lng);
  };

  // Build the mock event object for live preview
  const previewEvent: EventItem = {
    id: 'preview-event',
    title: title || (language === 'id' ? 'Judul Kegiatan Anda' : 'Your Activity Title'),
    category,
    description: description || 'Deskripsi kegiatan akan tampil di sini...',
    date: date || tomorrowStr,
    startTime: startTime || '07:00',
    endTime: endTime || '08:30',
    locationName: locationName || 'Lokasi Kegiatan',
    address: address || 'Alamat lokasi',
    lat,
    lng,
    price: Number(price) || 0,
    capacity: Number(capacity) || 15,
    attendeesCount: 1,
    level,
    whatToBring: whatToBringText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    repeatsWeekly,
    touristFriendly,
    host: {
      name: currentUser?.name || 'Komunitas Kumpul',
      rating: 5.0,
      isVerified: true,
      avatarColor: currentUser?.avatarColor || 'bg-[#0F9D8A]',
      bio: 'Host komunitas Kumpul Bali',
    },
    attendees: [
      {
        name: currentUser?.name || 'Host',
        initial: currentUser?.initial || 'H',
        avatarColor: currentUser?.avatarColor || 'bg-[#0F9D8A]',
        joinedAt: 'baru saja',
      },
    ],
    gradientTheme:
      category === 'Running'
        ? 'from-[#0F9D8A] via-[#14B8A6] to-[#047857]'
        : category === 'Yoga'
        ? 'from-[#7C3AED] via-[#8B5CF6] to-[#4F46E5]'
        : category === 'Hiking'
        ? 'from-[#0D9488] via-[#14B8A6] to-[#047857]'
        : category === 'Workshop'
        ? 'from-[#EA580C] via-[#F97316] to-[#C2410C]'
        : category === 'Sports'
        ? 'from-[#0284C7] via-[#0EA5E9] to-[#0369A1]'
        : 'from-[#E11D48] via-[#F43F5E] to-[#BE123C]',
    customImage,
    createdAt: new Date().toISOString(),
  };

  const handleValidateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!title.trim() || title.length < 5) {
      newErrors.push(t.errors.titleRequired);
    }
    if (!description.trim() || description.length < 15) {
      newErrors.push(t.errors.descriptionRequired);
    }
    if (!date) {
      newErrors.push('Tanggal kegiatan wajib dipilih');
    } else {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.push(t.errors.datePast);
      }
    }
    if (!locationName.trim()) {
      newErrors.push(t.errors.locationRequired);
    }
    if (Number(capacity) < 1) {
      newErrors.push(t.errors.capacityMin);
    }
    if (Number(price) < 0) {
      newErrors.push(t.errors.priceNegative);
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setActiveTab('form');
      return;
    }

    setErrors([]);
    setIsSubmitting(true);

    const newEvent: EventItem = {
      ...previewEvent,
      id: 'event-' + Date.now(),
      createdByUserId: currentUser?.id,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(newEvent);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAFAF7] w-full max-w-3xl min-h-screen sm:min-h-0 sm:max-h-[92vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative my-auto border border-gray-200">
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-gray-200/80 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-black text-gray-900">{t.createEventTitle}</h2>
            <p className="text-xs text-gray-500">{t.createEventSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher on Mobile/Tablet */}
        <div className="flex border-b border-gray-200 bg-white px-5 pt-2 gap-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'form'
                ? 'border-[#0F9D8A] text-[#0F9D8A]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            1. Formulir Kegiatan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preview'
                ? 'border-[#0F9D8A] text-[#0F9D8A]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>2. {t.formPreviewTitle}</span>
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-7">
          {/* Validation Errors Box */}
          {errors.length > 0 && (
            <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold mb-1">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Harap perbaiki beberapa isian:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 pl-1">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'form' ? (
            <form onSubmit={handleValidateAndSubmit} className="space-y-5">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-800 block">
                    {t.formTitle} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t.formTitlePlaceholder}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-[#0F9D8A] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800 block">{t.formCategory}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    aria-label={t.formCategory}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-[#0F9D8A] focus:outline-hidden font-semibold"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {t.categories[c]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-800 block">
                  {t.formDescription} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.formDescriptionPlaceholder}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-[#0F9D8A] focus:outline-hidden resize-none"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800 block">{t.formDate}</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    aria-label={t.formDate}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-[#0F9D8A] focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800 block">{t.formStartTime}</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    aria-label={t.formStartTime}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-[#0F9D8A] focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800 block">{t.formEndTime}</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    aria-label={t.formEndTime}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-[#0F9D8A] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Location with Quick Presets */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0F9D8A]" />
                    <span>{t.location}</span>
                  </label>
                  <span className="text-[11px] text-gray-400">Pilih titik atau pilih patokan</span>
                </div>

                {/* Quick Presets Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                  {PRESET_LOCATIONS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                        locationName === preset.name
                          ? 'bg-[#0F9D8A] text-white border-[#0F9D8A] font-bold'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder={t.formLocationPlaceholder}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0F9D8A] focus:outline-hidden"
                  />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t.formAddressPlaceholder}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0F9D8A] focus:outline-hidden"
                  />
                </div>

                <div className="text-[11px] text-gray-500 flex items-center gap-2">
                  <span>Koordinat terpilih:</span>
                  <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-mono">
                    {lat.toFixed(4)}, {lng.toFixed(4)}
                  </code>
                </div>
              </div>

              {/* Capacity, Level, Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800 block">{t.formCapacity}</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    aria-label={t.formCapacity}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-[#0F9D8A] focus:outline-hidden font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800 block">{t.formLevel}</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as EventLevel)}
                    aria-label={t.formLevel}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-[#0F9D8A] focus:outline-hidden font-semibold"
                  >
                    {LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {t.levels[lvl] || lvl}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800 block">
                    {t.formPrice}
                    <span className="text-[10px] text-gray-400 font-normal ml-1">(0 = Gratis)</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={5000}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    aria-label={t.formPrice}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-[#0F9D8A] focus:outline-hidden font-semibold text-[#0F9D8A]"
                  />
                </div>
              </div>

              {/* What to Bring */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-800 block">{t.formWhatToBring}</label>
                <input
                  type="text"
                  value={whatToBringText}
                  onChange={(e) => setWhatToBringText(e.target.value)}
                  placeholder={t.formWhatToBringPlaceholder}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:border-[#0F9D8A] focus:outline-hidden"
                />
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-800 block">{t.formCoverImage}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#0F9D8A]" />
                    <span>{t.formUploadImage}</span>
                  </button>

                  {customImage && (
                    <button
                      type="button"
                      onClick={() => setCustomImage(undefined)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Hapus Foto & Gunakan Gradien
                    </button>
                  )}
                </div>
              </div>

              {/* Toggles: Repeats weekly & Tourist Friendly */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-200 cursor-pointer hover:border-gray-300">
                  <input
                    type="checkbox"
                    checked={repeatsWeekly}
                    onChange={(e) => setRepeatsWeekly(e.target.checked)}
                    className="rounded text-[#0F9D8A] focus:ring-[#0F9D8A] w-4 h-4 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-gray-800 block">{t.formRepeatsWeekly}</span>
                    <span className="text-gray-400 text-[11px]">Setiap minggu di jam yang sama</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-200 cursor-pointer hover:border-gray-300">
                  <input
                    type="checkbox"
                    checked={touristFriendly}
                    onChange={(e) => setTouristFriendly(e.target.checked)}
                    className="rounded text-[#0F9D8A] focus:ring-[#0F9D8A] w-4 h-4 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-gray-800 block">{t.formTouristFriendly}</span>
                    <span className="text-gray-400 text-[11px]">Pemandu siap berbahasa Inggris</span>
                  </div>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-2xl bg-[#0F9D8A] hover:bg-[#0b7e6f] active:scale-95 text-white font-extrabold text-sm shadow-md shadow-[#0F9D8A]/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? t.publishing : t.submitCreateEvent}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Live Preview Tab */
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  Ini adalah simulasi tampilan kartu kegiatan Anda di halaman utama Kumpul.
                </span>
              </div>

              <div className="max-w-md mx-auto">
                <EventCard
                  event={previewEvent}
                  language={language}
                  onSelect={() => {}}
                />
              </div>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className="px-5 py-2.5 rounded-xl bg-gray-200 text-gray-800 text-xs font-bold hover:bg-gray-300"
                >
                  Kembali Edit Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
