export type Category = 'Running' | 'Yoga' | 'Hiking' | 'Workshop' | 'Sports' | 'Other';

export type EventLevel = 'Pemula' | 'Menengah' | 'Lanjutan' | 'Semua Level';

export interface Host {
  name: string;
  rating: number;
  isVerified: boolean;
  avatarColor: string;
  phone?: string;
  bio?: string;
}

export interface Attendee {
  name: string;
  initial: string;
  avatarColor: string;
  joinedAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: Category;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h)
  endTime: string; // HH:mm (24h)
  locationName: string;
  address: string;
  lat: number;
  lng: number;
  price: number; // 0 = Free
  capacity: number;
  attendeesCount: number;
  level: EventLevel;
  whatToBring: string[];
  repeatsWeekly: boolean;
  touristFriendly: boolean;
  host: Host;
  attendees: Attendee[];
  gradientTheme: string; // CSS gradient class
  customImage?: string; // Base64 data URL if uploaded
  createdAt: string;
  createdByUserId?: string;
}

export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  category: Category;
  eventDate: string;
  startTime: string;
  endTime: string;
  locationName: string;
  bookingCode: string;
  quantity: number;
  ticketPrice: number;
  serviceFee: number;
  totalPrice: number;
  paymentMethod: 'QRIS' | 'GoPay' | 'OVO' | 'DANA' | 'Bank Transfer' | 'Free';
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  userName: string;
  userPhone: string;
  canCancelUntil: string; // ISO string 24h before event
}

export interface User {
  id: string;
  name: string;
  phone: string;
  avatarColor: string;
  initial: string;
  isLoggedIn: boolean;
}

export interface FilterState {
  searchQuery: string;
  category: Category | 'All';
  dateFilter: 'all' | 'today' | 'tomorrow' | 'this_week' | 'custom';
  customDate?: string;
  timeOfDay: 'all' | 'morning' | 'afternoon' | 'evening';
  priceType: 'all' | 'free' | 'paid';
  level: 'all' | EventLevel;
  touristFriendlyOnly: boolean;
  region: 'all' | 'canggu' | 'ubud';
}
