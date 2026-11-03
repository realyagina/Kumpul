import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Sparkles, X, Compass, Layers } from 'lucide-react';
import { EventItem } from '../types';
import { Language, translations } from '../translations';
import { EventCard } from './EventCard';

interface MobileBottomSheetProps {
  language: Language;
  events: EventItem[];
  selectedEvent: EventItem | null;
  onSelectEvent: (event: EventItem) => void;
  onOpenDetail: (event: EventItem) => void;
  onClearSelectedEvent: () => void;
  onResetFilters: () => void;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  language,
  events,
  selectedEvent,
  onSelectEvent,
  onOpenDetail,
  onClearSelectedEvent,
  onResetFilters,
}) => {
  const t = translations[language];
  // Sheet snap height: 'peek' | 'half' | 'full'
  const [snap, setSnap] = useState<'peek' | 'half' | 'full'>('half');

  const toggleSnap = () => {
    if (snap === 'peek') setSnap('half');
    else if (snap === 'half') setSnap('full');
    else setSnap('peek');
  };

  const getSheetHeightClass = () => {
    switch (snap) {
      case 'peek':
        return selectedEvent ? 'h-36' : 'h-16';
      case 'half':
        return 'h-[48vh]';
      case 'full':
        return 'h-[85vh]';
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-20 bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] border-t border-gray-200/90 transition-all duration-300 flex flex-col lg:hidden ${getSheetHeightClass()}`}
    >
      {/* Draggable Grab Bar */}
      <div
        onClick={toggleSnap}
        className="w-full pt-2.5 pb-2 flex flex-col items-center justify-center cursor-pointer select-none active:bg-gray-50 rounded-t-3xl"
      >
        <div className="w-12 h-1.5 rounded-full bg-gray-300 mb-1" />
        <div className="w-full px-4 flex items-center justify-between text-xs font-bold text-gray-700">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0F9D8A]" />
            <span>
              {events.length} {t.filterResults}
            </span>
          </div>

          <div className="flex items-center gap-1 text-gray-400 text-[11px]">
            <span>{snap === 'full' ? 'Kecilkan' : snap === 'peek' ? 'Buka' : 'Lebarkan'}</span>
            {snap === 'full' ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5" />
            )}
          </div>
        </div>
      </div>

      {/* Sheet Content */}
      <div className="flex-1 overflow-y-auto px-3.5 pb-6">
        {selectedEvent && snap === 'peek' ? (
          /* Preview Card inside Peek state */
          <div className="relative pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClearSelectedEvent();
              }}
              className="absolute -top-1 right-1 z-10 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <EventCard
              event={selectedEvent}
              language={language}
              onSelect={onOpenDetail}
              isSelected={true}
              compact={true}
            />
          </div>
        ) : (
          /* Normal Scrollable List of Events */
          <div className="space-y-3 pt-1">
            {events.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-500">
                <p>{t.noEventsFoundTitle}</p>
                <button
                  onClick={onResetFilters}
                  className="mt-2 text-[#0F9D8A] font-bold underline"
                >
                  {t.resetFilter}
                </button>
              </div>
            ) : (
              events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  language={language}
                  onSelect={onOpenDetail}
                  isSelected={selectedEvent?.id === event.id}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
