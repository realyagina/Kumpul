/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { EventItem, Booking, User, FilterState, Category, EventLevel } from './types';
import { Language, translations, isToday, isTomorrow, isThisWeek } from './translations';
import { getInitialEvents } from './data/seedData';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { EventList } from './components/EventList';
import { Map } from './components/Map';
import { EventDetail } from './components/EventDetail';
import { CreateEventForm } from './components/CreateEventForm';
import { PaymentFlow } from './components/PaymentFlow';
import { ProfileModal } from './components/ProfileModal';
import { LoginModal } from './components/LoginModal';
import { MobileBottomSheet } from './components/MobileBottomSheet';

const STORAGE_KEYS = {
  EVENTS: 'kumpul_events_v2',
  BOOKINGS: 'kumpul_bookings_v2',
  USER: 'kumpul_user_v2',
  LANG: 'kumpul_lang_v2',
};

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'All',
  dateFilter: 'all',
  timeOfDay: 'all',
  priceType: 'all',
  level: 'all',
  touristFriendlyOnly: false,
  region: 'all',
};

export default function App() {
  // 1. Language state
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return saved === 'en' || saved === 'id' ? saved : 'id';
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  // 2. Events state
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading events:', e);
    }
    const initial = getInitialEvents();
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(initial));
    return initial;
  });

  // 3. User state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading user:', e);
    }
    // Default demo user so app is immediately interactive
    const defaultUser: User = {
      id: 'usr-default',
      name: 'Budi Santoso',
      phone: '081234567890',
      avatarColor: 'bg-[#0F9D8A]',
      initial: 'BS',
      isLoggedIn: true,
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
    return defaultUser;
  });

  // 4. Bookings state
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading bookings:', e);
    }
    return [];
  });

  // 5. Active Region & Filters
  const [activeRegion, setActiveRegion] = useState<'all' | 'canggu' | 'ubud'>('all');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // 6. View Mode for Mobile (map vs list)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // 7. Modals & Selection
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [detailEvent, setDetailEvent] = useState<EventItem | null>(null);
  const [bookingEvent, setBookingEvent] = useState<EventItem | null>(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Persist events
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  // Persist bookings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  // Persist user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  // Handle region button clicks
  const handleRegionChange = (region: 'all' | 'canggu' | 'ubud') => {
    setActiveRegion(region);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setActiveRegion('all');
  };

  // Filtered Events Calculation
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesDesc = event.description.toLowerCase().includes(query);
        const matchesLoc = event.locationName.toLowerCase().includes(query) || event.address.toLowerCase().includes(query);
        const matchesHost = event.host.name.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesHost) return false;
      }

      // 2. Category
      if (filters.category !== 'All' && event.category !== filters.category) {
        return false;
      }

      // 3. Region
      if (activeRegion === 'canggu') {
        const isCanggu =
          event.locationName.toLowerCase().includes('canggu') ||
          event.address.toLowerCase().includes('canggu') ||
          event.locationName.toLowerCase().includes('pererenan') ||
          event.locationName.toLowerCase().includes('berawa') ||
          event.lat < -8.60;
        if (!isCanggu) return false;
      } else if (activeRegion === 'ubud') {
        const isUbud =
          event.locationName.toLowerCase().includes('ubud') ||
          event.address.toLowerCase().includes('ubud') ||
          event.locationName.toLowerCase().includes('campuhan') ||
          event.locationName.toLowerCase().includes('penestanan') ||
          event.lat > -8.60;
        if (!isUbud) return false;
      }

      // 4. Date Filter
      if (filters.dateFilter === 'today' && !isToday(event.date)) return false;
      if (filters.dateFilter === 'tomorrow' && !isTomorrow(event.date)) return false;
      if (filters.dateFilter === 'this_week' && !isThisWeek(event.date)) return false;

      // 5. Time of Day
      if (filters.timeOfDay !== 'all') {
        const hour = parseInt(event.startTime.split(':')[0], 10);
        if (filters.timeOfDay === 'morning' && (hour < 5 || hour >= 12)) return false;
        if (filters.timeOfDay === 'afternoon' && (hour < 12 || hour >= 16)) return false;
        if (filters.timeOfDay === 'evening' && (hour < 16 || hour >= 24)) return false;
      }

      // 6. Price
      if (filters.priceType === 'free' && event.price > 0) return false;
      if (filters.priceType === 'paid' && event.price === 0) return false;

      // 7. Level
      if (filters.level !== 'all' && event.level !== 'Semua Level' && event.level !== filters.level) {
        return false;
      }

      // 8. Tourist Friendly
      if (filters.touristFriendlyOnly && !event.touristFriendly) return false;

      return true;
    });
  }, [events, filters, activeRegion]);

  // Complete Booking Flow (Free RSVP or Paid)
  const handleCompleteBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);

    // Update event attendee count & attendees list in state
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === newBooking.eventId) {
          const newAttendee = {
            name: newBooking.userName,
            initial: newBooking.userName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase(),
            avatarColor: 'bg-[#0F9D8A]',
            joinedAt: 'baru saja',
          };
          return {
            ...e,
            attendeesCount: Math.min(e.capacity, e.attendeesCount + newBooking.quantity),
            attendees: [newAttendee, ...(e.attendees || [])],
          };
        }
        return e;
      })
    );
  };

  // Cancel Booking
  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    // Decrement attendeesCount on the event
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === booking.eventId) {
          return {
            ...e,
            attendeesCount: Math.max(0, e.attendeesCount - booking.quantity),
          };
        }
        return e;
      })
    );
  };

  // Create Event Submit
  const handleCreateEvent = (newEvent: EventItem) => {
    setEvents((prev) => [newEvent, ...prev]);
    setIsCreatingEvent(false);
    setSelectedEvent(newEvent);
    setDetailEvent(newEvent);
  };

  // Check if current user has joined an event
  const hasUserJoinedEvent = (eventId: string): boolean => {
    if (!currentUser) return false;
    return bookings.some(
      (b) => b.eventId === eventId && b.status === 'confirmed' && b.userName === currentUser.name
    );
  };

  // Hosted events by current user
  const hostedEvents = useMemo(() => {
    if (!currentUser) return [];
    return events.filter(
      (e) =>
        e.createdByUserId === currentUser.id ||
        e.host.name.toLowerCase() === currentUser.name.toLowerCase()
    );
  }, [events, currentUser]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-[#1F2937]">
      {/* 1. Sticky Global Header */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        currentUser={currentUser}
        onOpenCreate={() => {
          if (!currentUser?.isLoggedIn) {
            setIsLoginOpen(true);
          } else {
            setIsCreatingEvent(true);
          }
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        activeRegion={activeRegion}
        onRegionChange={handleRegionChange}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode((prev) => (prev === 'map' ? 'list' : 'map'))}
        joinedCount={bookings.filter((b) => b.status === 'confirmed').length}
      />

      {/* 2. Main Content Layout */}
      <main className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        {/* DESKTOP LEFT PANEL / MOBILE LIST VIEW */}
        <div
          className={`flex flex-col bg-white border-r border-gray-200/90 z-10 transition-all ${
            viewMode === 'list'
              ? 'w-full block flex-1'
              : 'hidden lg:flex lg:w-[450px] xl:w-[480px] h-[calc(100vh-65px)]'
          }`}
        >
          {/* Filters Bar */}
          <Filters
            language={language}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalResults={filteredEvents.length}
          />

          {/* Scrollable Event List */}
          <div className="flex-1 overflow-y-auto">
            <EventList
              events={filteredEvents}
              selectedEvent={selectedEvent}
              onSelectEvent={(evt) => {
                setSelectedEvent(evt);
                setDetailEvent(evt);
              }}
              language={language}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>

        {/* MAP VIEW CONTAINER (Full height on Desktop, Toggled or Fullscreen on Mobile) */}
        <div
          className={`flex-1 relative ${
            viewMode === 'map' ? 'h-[calc(100vh-65px)] w-full block' : 'hidden lg:block lg:h-[calc(100vh-65px)]'
          }`}
        >
          {/* Leaflet OpenStreetMap */}
          <Map
            events={filteredEvents}
            selectedEvent={selectedEvent}
            onSelectEvent={(evt) => {
              setSelectedEvent(evt);
            }}
            language={language}
            activeRegion={activeRegion}
          />

          {/* Mobile Bottom Sheet (Only visible on mobile screens when in Map mode) */}
          {viewMode === 'map' && (
            <MobileBottomSheet
              language={language}
              events={filteredEvents}
              selectedEvent={selectedEvent}
              onSelectEvent={(evt) => setSelectedEvent(evt)}
              onOpenDetail={(evt) => setDetailEvent(evt)}
              onClearSelectedEvent={() => setSelectedEvent(null)}
              onResetFilters={handleResetFilters}
            />
          )}
        </div>
      </main>

      {/* 3. Event Detail Modal */}
      {detailEvent && (
        <EventDetail
          event={detailEvent}
          language={language}
          onClose={() => setDetailEvent(null)}
          onProceedToJoin={(evt) => {
            setBookingEvent(evt);
          }}
          currentUser={currentUser}
          hasUserJoined={hasUserJoinedEvent(detailEvent.id)}
        />
      )}

      {/* 4. Payment & RSVP Checkout Modal */}
      {bookingEvent && (
        <PaymentFlow
          event={bookingEvent}
          currentUser={currentUser}
          language={language}
          onClose={() => setBookingEvent(null)}
          onCompleteBooking={(booking) => {
            handleCompleteBooking(booking);
          }}
          onOpenLogin={() => setIsLoginOpen(true)}
        />
      )}

      {/* 5. Create Event Modal */}
      {isCreatingEvent && (
        <CreateEventForm
          language={language}
          currentUser={currentUser}
          onClose={() => setIsCreatingEvent(false)}
          onSubmit={handleCreateEvent}
          onOpenLogin={() => setIsLoginOpen(true)}
        />
      )}

      {/* 6. Profile & My Activities Modal */}
      {isProfileOpen && currentUser && (
        <ProfileModal
          language={language}
          currentUser={currentUser}
          bookings={bookings}
          hostedEvents={hostedEvents}
          allEvents={events}
          onClose={() => setIsProfileOpen(false)}
          onLogout={() => {
            setCurrentUser(null);
            setIsProfileOpen(false);
          }}
          onCancelBooking={handleCancelBooking}
          onSelectEvent={(evt) => {
            setSelectedEvent(evt);
            setDetailEvent(evt);
          }}
          onOpenCreate={() => setIsCreatingEvent(true)}
        />
      )}

      {/* 7. Mock Login Modal */}
      {isLoginOpen && (
        <LoginModal
          language={language}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsLoginOpen(false);
          }}
        />
      )}
    </div>
  );
}
