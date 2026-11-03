import React from 'react';
import { EventItem } from '../types';
import { Language, translations } from '../translations';
import { EventCard } from './EventCard';
import { Sparkles, RotateCcw } from 'lucide-react';

interface EventListProps {
  events: EventItem[];
  selectedEvent: EventItem | null;
  onSelectEvent: (event: EventItem) => void;
  language: Language;
  onResetFilters: () => void;
  className?: string;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
  language,
  onResetFilters,
  className = '',
}) => {
  const t = translations[language];

  if (events.length === 0) {
    return (
      <div className={`p-8 text-center flex flex-col items-center justify-center my-auto ${className}`}>
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 text-3xl shadow-xs">
          🧭
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">
          {t.noEventsFoundTitle}
        </h3>
        <p className="text-xs text-gray-500 max-w-xs mb-5">
          {t.noEventsFoundDesc}
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F9D8A] hover:bg-[#0b7e6f] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.resetFilter}</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 p-3 sm:p-4 ${className}`}>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          language={language}
          onSelect={onSelectEvent}
          isSelected={selectedEvent?.id === event.id}
        />
      ))}
    </div>
  );
};
