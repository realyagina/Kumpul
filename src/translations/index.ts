export type Language = 'id' | 'en';

export const translations = {
  id: {
    // App & Header
    appName: 'Kumpul',
    tagline: 'Cari kegiatan, temukan teman.',
    subtagline: 'Komunitas olahraga & wellness lokal di Bali',
    explore: 'Jelajahi',
    createEvent: 'Buat Kegiatan',
    myActivities: 'Kegiatan Saya',
    signIn: 'Masuk',
    signOut: 'Keluar',
    profile: 'Profil Saya',
    close: 'Tutup',
    cancel: 'Batal',
    back: 'Kembali',
    save: 'Simpan',
    share: 'Bagikan',
    copiedLink: 'Tautan disalin ke clipboard!',
    
    // View modes
    mapView: 'Peta',
    listView: 'Daftar',
    splitView: 'Peta & Daftar',

    // Regions
    allBali: 'Semua Bali',
    canggu: 'Canggu',
    ubud: 'Ubud',

    // Categories
    categories: {
      All: 'Semua',
      Running: 'Lari & Jogging',
      Yoga: 'Yoga & Meditasi',
      Hiking: 'Hiking & Alam',
      Workshop: 'Workshop & Kelas',
      Sports: 'Olahraga & Fun Match',
      Other: 'Lainnya',
    },

    // Badges & Labels
    happeningToday: 'Hari Ini',
    spotsLeft: 'sisa kuota',
    spotSingular: 'sisa kuota',
    free: 'Gratis',
    soldOut: 'Penuh',
    touristFriendly: 'Ramah Turis',
    touristFriendlyTag: 'English / Ramah Turis',
    repeatsWeekly: 'Ulangi setiap minggu',
    verified: 'Terverifikasi',
    host: 'Host',
    joined: 'Telah Bergabung',
    spots: 'kuota',
    person: 'orang',
    
    // Levels
    levels: {
      all: 'Semua Level',
      'Pemula': 'Pemula',
      'Menengah': 'Menengah',
      'Lanjutan': 'Lanjutan',
      'Semua Level': 'Semua Level',
    },

    // Filters
    filters: 'Filter',
    filterResults: 'kegiatan ditemukan',
    resetFilter: 'Reset Filter',
    searchPlaceholder: 'Cari kegiatan, lokasi, atau host...',
    filterByDate: 'Waktu Kegiatan',
    dateOptions: {
      all: 'Kapan saja',
      today: 'Hari Ini',
      tomorrow: 'Besok',
      this_week: 'Minggu Ini',
      custom: 'Pilih Tanggal',
    },
    filterByTime: 'Waktu Hari',
    timeOptions: {
      all: 'Semua Waktu',
      morning: 'Pagi (05:00 - 11:59)',
      afternoon: 'Siang (12:00 - 15:59)',
      evening: 'Sore / Malam (16:00 - 23:00)',
    },
    filterByPrice: 'Harga',
    priceOptions: {
      all: 'Semua',
      free: 'Gratis',
      paid: 'Berbayar',
    },
    filterByLevel: 'Tingkat Kemampuan',
    quickFilters: 'Filter Cepat',

    // Event Detail
    eventDetails: 'Detail Kegiatan',
    dateAndTime: 'Waktu & Tanggal',
    location: 'Lokasi Kegiatan',
    tapToOpenMap: 'Buka di Google Maps',
    whatToBring: 'Yang Perlu Dibawa',
    attendeesList: 'Peserta yang Sudah Gabung',
    cancellationPolicyTitle: 'Kebijakan Pembatalan',
    cancellationPolicyText: 'Pembatalan gratis hingga 24 jam sebelum acara dimulai.',
    actionJoin: 'Gabung Sekarang',
    actionBuyTicket: 'Beli Tiket',
    alreadyJoined: 'Anda Sudah Terdaftar',
    loginToJoin: 'Masuk untuk Bergabung',
    openDetail: 'Lihat Detail',
    eventFullNotice: 'Mohon maaf, kuota peserta untuk acara ini sudah penuh.',

    // Join & Payment Flow
    rsvpFreeTitle: 'Konfirmasi Pendaftaran',
    rsvpFreeDesc: 'Kegiatan ini gratis! Cukup konfirmasi kehadiran Anda agar host dapat menyiapkan tempat.',
    yourName: 'Nama Lengkap',
    yourPhone: 'Nomor WhatsApp',
    confirmRsvp: 'Konfirmasi Kehadiran',
    ticketOrderTitle: 'Pembelian Tiket',
    ticketQuantity: 'Jumlah Tiket',
    pricePerTicket: 'Harga per Tiket',
    serviceFee: 'Biaya Layanan Kumpul',
    serviceFeeNote: 'Rp2.000 per tiket untuk operasional platform',
    totalPayment: 'Total Pembayaran',
    paymentMethod: 'Metode Pembayaran',
    simulatedPaymentNotice: 'Mode Simulasi / Demo: Tidak ada biaya riil yang dipotong.',
    selectPayment: 'Pilih Metode Pembayaran',
    payNow: 'Bayar Sekarang',
    processingPayment: 'Memproses Pembayaran...',
    successTitle: 'Pendaftaran Berhasil!',
    successDesc: 'Sampai jumpa di lokasi! Simpan bukti tiket dan kode pemesanan ini.',
    bookingCode: 'Kode Pemesanan',
    viewInMyActivities: 'Lihat di Kegiatan Saya',
    backToHome: 'Kembali ke Beranda',

    // Payment Methods
    paymentMethods: {
      QRIS: 'QRIS (Gopay, OVO, Dana, BCA, dll)',
      GoPay: 'GoPay',
      OVO: 'OVO',
      DANA: 'DANA',
      'Bank Transfer': 'BCA / Mandiri Virtual Account',
    },

    // Create Event
    createEventTitle: 'Buat Kegiatan Baru',
    createEventSubtitle: 'Buka sesi olahraga, kumpul santai, atau workshop untuk komunitas Anda.',
    formTitle: 'Judul Kegiatan',
    formTitlePlaceholder: 'Contoh: Sunset Yoga & Meditasi Santai',
    formCategory: 'Kategori',
    formDescription: 'Deskripsi Kegiatan',
    formDescriptionPlaceholder: 'Jelaskan rencana kegiatan, siapa yang cocok ikut, dan suasana acaranya...',
    formDate: 'Tanggal Kegiatan',
    formStartTime: 'Jam Mulai',
    formEndTime: 'Jam Selesai',
    formLocationName: 'Nama Lokasi / Tempat',
    formLocationPlaceholder: 'Contoh: Pantai Echo Beach, Canggu',
    formAddress: 'Alamat Lengkap / Patokan',
    formAddressPlaceholder: 'Contoh: Parkir timur depan Warung Pantai',
    formMapPinPrompt: 'Klik pada peta untuk menentukan titik koordinat:',
    formCapacity: 'Kapasitas Peserta (Maksimal)',
    formLevel: 'Tingkat Kemampuan',
    formPrice: 'Biaya Partisipasi (Rp)',
    formPriceHint: 'Tulis 0 jika acara ini Gratis',
    formCoverImage: 'Gambar Sampul',
    formUploadImage: 'Unggah Foto Sendiri',
    formUseCategoryGradient: 'Gunakan Gradien Default',
    formWhatToBring: 'Yang Perlu Dibawa (pisahkan dengan koma)',
    formWhatToBringPlaceholder: 'Baju ganti, air minum, matras yoga...',
    formRepeatsWeekly: 'Ulangi setiap minggu',
    formTouristFriendly: 'Ramah Turis (bilingual / pemandu berbahasa Inggris)',
    formPreviewTitle: 'Pratinjau Kartu Acara',
    submitCreateEvent: 'Terbitkan Kegiatan',
    publishing: 'Menerbitkan...',
    eventCreatedSuccess: 'Kegiatan Anda berhasil diterbitkan dan langsung tampil di peta!',

    // Validation
    errors: {
      titleRequired: 'Judul kegiatan wajib diisi (min. 5 karakter)',
      descriptionRequired: 'Deskripsi kegiatan wajib diisi (min. 15 karakter)',
      datePast: 'Tanggal kegiatan tidak boleh di masa lalu',
      timeInvalid: 'Jam selesai harus lebih akhir dari jam mulai',
      locationRequired: 'Nama lokasi harus diisi',
      capacityMin: 'Kapasitas minimal 1 orang',
      priceNegative: 'Biaya tidak boleh kurang dari 0',
      loginRequiredToHost: 'Silakan masuk terlebih dahulu untuk membuat kegiatan.',
    },

    // Profile & My Activities
    profileTitle: 'Profil Pengguna',
    memberSince: 'Anggota Kumpul Komunitas',
    tabJoined: 'Kegiatan Saya',
    tabHosted: 'Saya Host',
    noJoinedEvents: 'Anda belum mendaftar kegiatan apapun.',
    exploreNow: 'Cari Kegiatan Sekarang',
    noHostedEvents: 'Anda belum membuat kegiatan.',
    startHostingNow: 'Mulai Buat Kegiatan',
    participantCount: 'Peserta Terdaftar',
    cancelBooking: 'Batalkan Pendaftaran',
    cancelBookingConfirm: 'Apakah Anda yakin ingin membatalkan pendaftaran ini?',
    cancelSuccess: 'Pendaftaran berhasil dibatalkan.',
    cannotCancelExpired: 'Pembatalan hanya berlaku maksimal 24 jam sebelum acara.',
    bookingStatusConfirmed: 'Terkonfirmasi',
    bookingStatusCancelled: 'Dibatalkan',

    // Login modal
    loginTitle: 'Masuk ke Kumpul',
    loginSubtitle: 'Bergabung dengan komunitas lokal. Masuk tanpa password yang rumit.',
    phoneLabel: 'Nomor WhatsApp / HP',
    phonePlaceholder: '081234567890',
    quickFillTitle: 'Atau pilih akun contoh:',
    loginSubmit: 'Lanjutkan',
    privacyNotice: 'Data hanya disimpan di peramban Anda untuk keperluan demo.',

    // Empty states
    noEventsFoundTitle: 'Tidak ada kegiatan yang cocok',
    noEventsFoundDesc: 'Coba ubah filter tanggal, kategori, atau reset pencarian Anda.',
  },
  en: {
    // App & Header
    appName: 'Kumpul',
    tagline: 'Find activities, find your people.',
    subtagline: 'Local sports & wellness community discovery in Bali',
    explore: 'Explore',
    createEvent: 'Host Activity',
    myActivities: 'My Activities',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    profile: 'My Profile',
    close: 'Close',
    cancel: 'Cancel',
    back: 'Back',
    save: 'Save',
    share: 'Share',
    copiedLink: 'Link copied to clipboard!',
    
    // View modes
    mapView: 'Map',
    listView: 'List',
    splitView: 'Map & List',

    // Regions
    allBali: 'All Bali',
    canggu: 'Canggu',
    ubud: 'Ubud',

    // Categories
    categories: {
      All: 'All',
      Running: 'Running & Jogging',
      Yoga: 'Yoga & Meditation',
      Hiking: 'Hiking & Trails',
      Workshop: 'Workshops & Classes',
      Sports: 'Sports & Matches',
      Other: 'Other',
    },

    // Badges & Labels
    happeningToday: 'Today',
    spotsLeft: 'spots left',
    spotSingular: 'spot left',
    free: 'Free',
    soldOut: 'Full',
    touristFriendly: 'Tourist Friendly',
    touristFriendlyTag: 'English / Tourist Friendly',
    repeatsWeekly: 'Repeats weekly',
    verified: 'Verified',
    host: 'Host',
    joined: 'Joined',
    spots: 'spots',
    person: 'people',

    // Levels
    levels: {
      all: 'All Levels',
      'Pemula': 'Beginner',
      'Menengah': 'Intermediate',
      'Lanjutan': 'Advanced',
      'Semua Level': 'All Levels',
    },

    // Filters
    filters: 'Filters',
    filterResults: 'activities found',
    resetFilter: 'Reset Filters',
    searchPlaceholder: 'Search activities, locations, hosts...',
    filterByDate: 'Date',
    dateOptions: {
      all: 'Anytime',
      today: 'Today',
      tomorrow: 'Tomorrow',
      this_week: 'This Week',
      custom: 'Custom Date',
    },
    filterByTime: 'Time of Day',
    timeOptions: {
      all: 'All Day',
      morning: 'Morning (05:00 - 11:59)',
      afternoon: 'Afternoon (12:00 - 15:59)',
      evening: 'Evening / Night (16:00 - 23:00)',
    },
    filterByPrice: 'Price',
    priceOptions: {
      all: 'All',
      free: 'Free',
      paid: 'Paid',
    },
    filterByLevel: 'Experience Level',
    quickFilters: 'Quick Filters',

    // Event Detail
    eventDetails: 'Activity Details',
    dateAndTime: 'Date & Time',
    location: 'Location',
    tapToOpenMap: 'Open in Google Maps',
    whatToBring: 'What to Bring',
    attendeesList: 'Registered Attendees',
    cancellationPolicyTitle: 'Cancellation Policy',
    cancellationPolicyText: 'Free cancellation up to 24 hours before the event starts.',
    actionJoin: 'Join Now',
    actionBuyTicket: 'Buy Ticket',
    alreadyJoined: 'You Are Registered',
    loginToJoin: 'Sign In to Join',
    openDetail: 'View Details',
    eventFullNotice: 'Sorry, this activity has reached maximum capacity.',

    // Join & Payment Flow
    rsvpFreeTitle: 'Confirm Free RSVP',
    rsvpFreeDesc: 'This activity is free! Just confirm your attendance so the host knows to expect you.',
    yourName: 'Full Name',
    yourPhone: 'WhatsApp Number',
    confirmRsvp: 'Confirm Attendance',
    ticketOrderTitle: 'Ticket Order',
    ticketQuantity: 'Ticket Quantity',
    pricePerTicket: 'Price per Ticket',
    serviceFee: 'Kumpul Service Fee',
    serviceFeeNote: 'Rp2.000 per ticket for platform operations',
    totalPayment: 'Total Payment',
    paymentMethod: 'Payment Method',
    simulatedPaymentNotice: 'Simulation Mode: No real funds will be charged.',
    selectPayment: 'Select Payment Method',
    payNow: 'Pay Now',
    processingPayment: 'Processing Payment...',
    successTitle: 'Registration Confirmed!',
    successDesc: 'See you at the event! Save your e-ticket and booking code below.',
    bookingCode: 'Booking Code',
    viewInMyActivities: 'View in My Activities',
    backToHome: 'Back to Home',

    // Payment Methods
    paymentMethods: {
      QRIS: 'QRIS (Gopay, OVO, Dana, BCA, etc.)',
      GoPay: 'GoPay',
      OVO: 'OVO',
      DANA: 'DANA',
      'Bank Transfer': 'BCA / Mandiri Virtual Account',
    },

    // Create Event
    createEventTitle: 'Host a New Activity',
    createEventSubtitle: 'Share a workout, social meetup, or workshop with the community.',
    formTitle: 'Activity Title',
    formTitlePlaceholder: 'E.g., Sunset Beach Yoga & Sound Bath',
    formCategory: 'Category',
    formDescription: 'Description',
    formDescriptionPlaceholder: 'Explain the activity flow, who should join, and the overall vibe...',
    formDate: 'Date',
    formStartTime: 'Start Time',
    formEndTime: 'End Time',
    formLocationName: 'Location / Venue Name',
    formLocationPlaceholder: 'E.g., Echo Beach, Canggu',
    formAddress: 'Full Address / Meeting Point',
    formAddressPlaceholder: 'E.g., East parking lot in front of Warung Pantai',
    formMapPinPrompt: 'Click on the map to drop a pin:',
    formCapacity: 'Participant Capacity (Max)',
    formLevel: 'Skill Level',
    formPrice: 'Participation Fee (Rp)',
    formPriceHint: 'Enter 0 if this activity is Free',
    formCoverImage: 'Cover Image',
    formUploadImage: 'Upload Custom Photo',
    formUseCategoryGradient: 'Use Category Gradient',
    formWhatToBring: 'What to Bring (separated by comma)',
    formWhatToBringPlaceholder: 'Water bottle, towel, yoga mat...',
    formRepeatsWeekly: 'Repeats weekly',
    formTouristFriendly: 'Tourist Friendly (English-friendly host)',
    formPreviewTitle: 'Live Card Preview',
    submitCreateEvent: 'Publish Activity',
    publishing: 'Publishing...',
    eventCreatedSuccess: 'Your activity has been published and is now live on the map!',

    // Validation
    errors: {
      titleRequired: 'Title is required (min. 5 chars)',
      descriptionRequired: 'Description is required (min. 15 chars)',
      datePast: 'Activity date cannot be in the past',
      timeInvalid: 'End time must be after start time',
      locationRequired: 'Location name is required',
      capacityMin: 'Capacity must be at least 1',
      priceNegative: 'Price cannot be negative',
      loginRequiredToHost: 'Please sign in to host an activity.',
    },

    // Profile & My Activities
    profileTitle: 'User Profile',
    memberSince: 'Kumpul Community Member',
    tabJoined: 'My Activities',
    tabHosted: 'Hosted by Me',
    noJoinedEvents: 'You haven’t joined any activities yet.',
    exploreNow: 'Discover Activities Now',
    noHostedEvents: 'You haven’t hosted any activities yet.',
    startHostingNow: 'Host an Activity',
    participantCount: 'Registered Participants',
    cancelBooking: 'Cancel Booking',
    cancelBookingConfirm: 'Are you sure you want to cancel this booking?',
    cancelSuccess: 'Booking cancelled successfully.',
    cannotCancelExpired: 'Cancellation is only allowed up to 24h before the event.',
    bookingStatusConfirmed: 'Confirmed',
    bookingStatusCancelled: 'Cancelled',

    // Login modal
    loginTitle: 'Sign In to Kumpul',
    loginSubtitle: 'Join local community activities. Quick login without passwords.',
    phoneLabel: 'WhatsApp / Phone Number',
    phonePlaceholder: '081234567890',
    quickFillTitle: 'Or choose a demo profile:',
    loginSubmit: 'Continue',
    privacyNotice: 'Data is saved locally in your browser for demo purposes.',

    // Empty states
    noEventsFoundTitle: 'No activities found',
    noEventsFoundDesc: 'Try adjusting your dates, categories, or reset your filters.',
  },
};

/**
 * Format currency according to Indonesian format: Rp50.000 or "Gratis" / "Free"
 */
export function formatCurrency(amount: number, lang: Language): string {
  if (amount <= 0) {
    return lang === 'id' ? 'Gratis' : 'Free';
  }
  // Format with thousand separator dots e.g. 50.000
  const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp${formatted}`;
}

/**
 * Format date in Indonesian ("Sab, 14 Nov") or English ("Sat, 14 Nov")
 */
export function formatDisplayDate(dateStr: string, lang: Language): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    const idDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const idMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    const enDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = lang === 'id' ? idDays[date.getDay()] : enDays[date.getDay()];
    const monthName = lang === 'id' ? idMonths[date.getMonth()] : enMonths[date.getMonth()];

    return `${dayName}, ${day} ${monthName}`;
  } catch {
    return dateStr;
  }
}

/**
 * Checks if an event is happening today
 */
export function isToday(dateStr: string): boolean {
  const today = new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return (
    today.getFullYear() === year &&
    today.getMonth() === month - 1 &&
    today.getDate() === day
  );
}

/**
 * Checks if an event is happening tomorrow
 */
export function isTomorrow(dateStr: string): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [year, month, day] = dateStr.split('-').map(Number);
  return (
    tomorrow.getFullYear() === year &&
    tomorrow.getMonth() === month - 1 &&
    tomorrow.getDate() === day
  );
}

/**
 * Checks if event is within next 7 days
 */
export function isThisWeek(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekLater = new Date(today);
  weekLater.setDate(today.getDate() + 7);

  const [year, month, day] = dateStr.split('-').map(Number);
  const eventDate = new Date(year, month - 1, day);
  return eventDate >= today && eventDate <= weekLater;
}
