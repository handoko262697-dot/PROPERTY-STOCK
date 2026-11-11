import { PropertyUnit } from '../types/property';

export const GALLERY_TITLES = [
  '1. Fasad Tampak Depan',
  '2. Ruang Tamu & Keluarga',
  '3. Kamar Tidur Utama',
  '4. Dapur & Kitchen Area',
  '5. Kamar Mandi Bersih',
  '6. Carport & Taman Depan',
  '7. Lingkungan & Gerbang Kawasan',
];

export const SUBSIDI_GALLERY = [
  '/src/assets/images/kyan_subsidi_house_1794148348377.jpg',
  '/src/assets/images/kyan_living_room_1794176190514.jpg',
  '/src/assets/images/kyan_master_bedroom_1794176192336.jpg',
  '/src/assets/images/kyan_modern_kitchen_1794176192419.jpg',
  '/src/assets/images/kyan_clean_bathroom_1794176192658.jpg',
  '/src/assets/images/kyan_carport_garden_1794176192753.jpg',
  '/src/assets/images/kyan_property_banner_1794148348923.jpg',
];

export const KOMERSIL_GALLERY = [
  '/src/assets/images/kyan_komersil_cluster_1794148348155.jpg',
  '/src/assets/images/kyan_living_room_1794176190514.jpg',
  '/src/assets/images/kyan_master_bedroom_1794176192336.jpg',
  '/src/assets/images/kyan_modern_kitchen_1794176192419.jpg',
  '/src/assets/images/kyan_clean_bathroom_1794176192658.jpg',
  '/src/assets/images/kyan_carport_garden_1794176192753.jpg',
  '/src/assets/images/kyan_property_banner_1794148348923.jpg',
];

export const RECYCLE_GALLERY = [
  '/src/assets/images/kyan_recycle_takeover_1794148348612.jpg',
  '/src/assets/images/kyan_living_room_1794176190514.jpg',
  '/src/assets/images/kyan_master_bedroom_1794176192336.jpg',
  '/src/assets/images/kyan_modern_kitchen_1794176192419.jpg',
  '/src/assets/images/kyan_clean_bathroom_1794176192658.jpg',
  '/src/assets/images/kyan_carport_garden_1794176192753.jpg',
  '/src/assets/images/kyan_property_banner_1794148348923.jpg',
];

export const DEFAULT_SITE_PLAN_IMAGE = '/src/assets/images/site_plan_master_1794378811121.jpg';

export const INITIAL_PROPERTIES: PropertyUnit[] = [
  {
    id: 'prop-sub-001',
    title: 'Pesona Harmoni Cileungsi',
    clusterOrHousingName: 'Perumahan Pesona Harmoni Cileungsi Tahap 2',
    blockNumber: 'Blok B3 / No. 14',
    category: 'subsidi',
    price: 185000000,
    downPayment: 2500000,
    installmentPerMonth: 1180000,
    bookingFee: 1000000,
    location: {
      province: 'Jawa Barat',
      city: 'Bogor',
      district: 'Cileungsi',
      address: 'Jl. Raya Cileungsi - Setu Km. 4, Pasir Angin, Cileungsi, Bogor',
      latitude: -6.398123,
      longitude: 107.012345,
      mapsUrl: 'https://www.google.com/maps?q=-6.398123,107.012345',
      nearbyFacilities: ['10 Menit ke Terminal Cileungsi', '15 Menit ke Gerbang Tol Nagrak', 'Dekat Pasar Tradisional & RS Hermina', 'Angkutan Umum 24 Jam']
    },
    specs: {
      buildingArea: 30,
      surfaceArea: 60,
      bedrooms: 2,
      bathrooms: 1,
      carport: 1,
      floors: 1,
      electricity: 1300,
      waterSource: 'Sumur Bor Jetpump',
      certificate: 'SHM',
      roadWidth: 'Row 6.5 Meter'
    },
    status: 'tersedia',
    image: SUBSIDI_GALLERY[0],
    gallery: SUBSIDI_GALLERY,
    sitePlanImage: DEFAULT_SITE_PLAN_IMAGE,
    sitePlanMarker: { x: 52.5, y: 44.5, label: 'B3 / No. 14' },
    description: 'Rumah subsidi pemerintah program FLPP dengan konstruksi dinding hebel ganda, rangka atap baja ringan, plafon gipsum rapi, dan sistem drainase kawasan tertutup anti banjir.',
    highlights: ['Bunga KPR Flat 5% sampai 20 Tahun', 'Bebas PPN & Bantuan Subsidi Uang Muka (SBUM)', 'Double Dinding Hebel & Rangka Baja Ringan', 'Dekat Rencana Tol JORR 2'],
    subsidiData: {
      skema: 'FLPP (Fasilitas Likuiditas Pembiayaan Perumahan)',
      bungaTetap: 5.0,
      bantuanUangMuka: 4000000,
      syaratGajiMaksimal: 8000000
    },
    marketingContact: {
      name: 'Rian Kurniawan (Marketing Inhouse)',
      phone: '0812-8899-7711',
      whatsapp: '6281288997711'
    },
    createdAt: '2026-10-15T08:00:00Z',
    updatedAt: '2026-11-01T10:30:00Z'
  },
  {
    id: 'prop-sub-002',
    title: 'Grand Cikarang Asri Regency',
    clusterOrHousingName: 'Grand Cikarang Asri - Blok Edelweiss',
    blockNumber: 'Blok E2 / No. 08',
    category: 'subsidi',
    price: 185000000,
    downPayment: 1850000,
    installmentPerMonth: 1205000,
    bookingFee: 500000,
    location: {
      province: 'Jawa Barat',
      city: 'Bekasi',
      district: 'Cikarang Utara',
      address: 'Jl. Pilar Sukatani, Karangbahagia, Cikarang Utara, Kab. Bekasi',
      latitude: -6.242567,
      longitude: 107.158912,
      mapsUrl: 'https://www.google.com/maps?q=-6.242567,107.158912',
      nearbyFacilities: ['12 Menit ke Stasiun KRL Cikarang', 'Dekat Kawasan Industri Jababeka & MM2100', 'Sentra Grosir Cikarang (SGC)', 'Dekat RSUD Kabupaten Bekasi']
    },
    specs: {
      buildingArea: 36,
      surfaceArea: 60,
      bedrooms: 2,
      bathrooms: 1,
      carport: 1,
      floors: 1,
      electricity: 1300,
      waterSource: 'Sumur Bor Jetpump',
      certificate: 'HGB',
      roadWidth: 'Row 7 Meter'
    },
    status: 'booking',
    image: SUBSIDI_GALLERY[0],
    gallery: SUBSIDI_GALLERY,
    sitePlanImage: DEFAULT_SITE_PLAN_IMAGE,
    sitePlanMarker: { x: 38.0, y: 24.5, label: 'E2 / No. 08' },
    description: 'Unit perumahan subsidi favorit buruh dan karyawan kawasan industri Cikarang. Row jalan lebar muat 2 mobil papasan, air tanah jernih layak konsumsi, kawasan ramai berpenghuni 800+ KK.',
    highlights: ['Akses Langsung Angkot ke Stasiun Cikarang', 'Kawasan Mandiri dengan Fasilitas Masjid & Lapangan', 'Cicilan Tetap Rp 1 Jutaan/Bulan', 'Tipe 36 Lebih Luas di Kelas Subsidi'],
    subsidiData: {
      skema: 'FLPP Bank BTN Syariah',
      bungaTetap: 5.0,
      bantuanUangMuka: 4000000,
      syaratGajiMaksimal: 8000000
    },
    marketingContact: {
      name: 'Dewi Safitri (Sales Coordinator)',
      phone: '0857-1122-3344',
      whatsapp: '6285711223344'
    },
    buyerLead: {
      buyerName: 'Ahmad Fauzi (Karyawan PT Epson)',
      buyerPhone: '0813-4455-6677',
      kprStage: 'slik_checking',
      bookedAt: '2026-11-04T14:20:00Z',
      notes: 'Sudah setor booking fee Rp 500rb, berkas slip gaji & rekening koran 3 bln lengkap.'
    },
    createdAt: '2026-10-20T09:15:00Z',
    updatedAt: '2026-11-04T14:20:00Z'
  },
  {
    id: 'prop-sub-003',
    title: 'Griya Mutiara Parung Panjang',
    clusterOrHousingName: 'Griya Mutiara Sentosa Tahap 3',
    blockNumber: 'Blok D1 / No. 22',
    category: 'subsidi',
    price: 181000000,
    downPayment: 2000000,
    installmentPerMonth: 1150000,
    bookingFee: 1000000,
    location: {
      province: 'Jawa Barat',
      city: 'Bogor',
      district: 'Parung Panjang',
      address: 'Jl. Raya Parung Panjang - Legok, Cibunar, Parung Panjang, Bogor',
      latitude: -6.347890,
      longitude: 106.562341,
      mapsUrl: 'https://www.google.com/maps?q=-6.347890,106.562341',
      nearbyFacilities: ['7 Menit ke Stasiun Parung Panjang', '20 Menit ke BSD City / Aeon Mall', 'Dekat Pasar Modern Parung Panjang', 'Puskesmas 24 Jam']
    },
    specs: {
      buildingArea: 30,
      surfaceArea: 60,
      bedrooms: 2,
      bathrooms: 1,
      carport: 1,
      floors: 1,
      electricity: 1300,
      waterSource: 'Sumur Bor Jetpump',
      certificate: 'SHM',
      roadWidth: 'Row 6.5 Meter'
    },
    status: 'tersedia',
    image: SUBSIDI_GALLERY[0],
    gallery: SUBSIDI_GALLERY,
    sitePlanImage: DEFAULT_SITE_PLAN_IMAGE,
    sitePlanMarker: { x: 78.5, y: 38.0, label: 'D1 / No. 22' },
    description: 'Hunian subsidi strategis berorientasi transit (TOD) sangat dekat dengan stasiun KRL Parung Panjang jurusan Tanah Abang Jakarta. Udara masih sejuk dengan pemandangan perbukitan hijau.',
    highlights: ['Sangat Ramah Komuter Kereta KRL', 'Hanya 40 Menit ke Stasiun Tanah Abang', 'Sertifikat Hak Milik (SHM)', 'Row Jalan Paving Block Rapi'],
    subsidiData: {
      skema: 'FLPP Bank BTN Konvensional',
      bungaTetap: 5.0,
      bantuanUangMuka: 4000000,
      syaratGajiMaksimal: 8000000
    },
    marketingContact: {
      name: 'Rian Kurniawan (Marketing Inhouse)',
      phone: '0812-8899-7711',
      whatsapp: '6281288997711'
    },
    createdAt: '2026-10-25T11:00:00Z',
    updatedAt: '2026-11-06T09:00:00Z'
  },
  {
    id: 'prop-sub-004',
    title: 'Puri Surya Rajeg Tangerang',
    clusterOrHousingName: 'Puri Surya Rajeg Kencana',
    blockNumber: 'Blok F4 / No. 05',
    category: 'subsidi',
    price: 181000000,
    downPayment: 3000000,
    installmentPerMonth: 1160000,
    bookingFee: 1000000,
    location: {
      province: 'Banten',
      city: 'Tangerang',
      district: 'Rajeg',
      address: 'Jl. Raya Rajeg - Mauk, Sukatani, Rajeg, Kabupaten Tangerang',
      latitude: -6.143210,
      longitude: 106.512340,
      mapsUrl: 'https://www.google.com/maps?q=-6.143210,106.512340',
      nearbyFacilities: ['25 Menit ke Bandara Soekarno Hatta', 'Pintu Tol Cikupa / Pasar Kemis', 'Dekat Waterpark Kukun', 'Sekolah TK sampai SMA dalam radius 1km']
    },
    specs: {
      buildingArea: 30,
      surfaceArea: 60,
      bedrooms: 2,
      bathrooms: 1,
      carport: 1,
      floors: 1,
      electricity: 1300,
      waterSource: 'Sumur Bor Jetpump',
      certificate: 'HGB',
      roadWidth: 'Row 6 Meter'
    },
    status: 'proses_kpr',
    image: SUBSIDI_GALLERY[0],
    gallery: SUBSIDI_GALLERY,
    sitePlanImage: DEFAULT_SITE_PLAN_IMAGE,
    sitePlanMarker: { x: 14.5, y: 68.0, label: 'F4 / No. 05' },
    description: 'Unit subsidi zona Tangerang utara dengan akses cepat ke Bandara Internasional Soekarno-Hatta. Fondasi batu kali kokoh, kusen aluminium anti rayap, genteng flat beton.',
    highlights: ['Dekat Bandara Soetta', 'Kusen Aluminium Anti Rayap & Lapuk', 'Lingkungan Nyaman & Asri', 'Fasilitas Taman Bermain Anak'],
    subsidiData: {
      skema: 'FLPP Bank BRI',
      bungaTetap: 5.0,
      bantuanUangMuka: 4000000,
      syaratGajiMaksimal: 8000000
    },
    marketingContact: {
      name: 'Bagus Pratama (Sales Executive)',
      phone: '0819-2233-4455',
      whatsapp: '6281922334455'
    },
    buyerLead: {
      buyerName: 'Siti Rahmawati (Guru Honorer)',
      buyerPhone: '0878-9988-7766',
      kprStage: 'wawancara_bank',
      bookedAt: '2026-10-28T16:00:00Z',
      notes: 'Jadwal wawancara dengan Bank BRI cabang Tangerang hari Rabu jam 10 pagi.'
    },
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-11-02T13:40:00Z'
  },
  {
    id: 'prop-kom-001',
    title: 'Cluster Pine Crest Serpong',
    clusterOrHousingName: 'Pine Crest Residence @ Serpong Green',
    blockNumber: 'Kavling A2 / No. 05',
    category: 'komersil',
    price: 895000000,
    downPayment: 45000000,
    installmentPerMonth: 6450000,
    bookingFee: 10000000,
    location: {
      province: 'Banten',
      city: 'Tangerang',
      district: 'Serpong',
      address: 'Jl. Raya Ciater Serpong, Ciater, Serpong, Tangerang Selatan',
      latitude: -6.315670,
      longitude: 106.689012,
      mapsUrl: 'https://www.google.com/maps?q=-6.315670,106.689012',
      nearbyFacilities: ['5 Menit ke Gerbang Tol BSD - Bintaro', '10 Menit ke Stasiun Rawa Buntu', 'Dekat AEON Mall & Mall The Breeze', 'Sekolah Al-Azhar & Santa Ursula']
    },
    specs: {
      buildingArea: 78,
      surfaceArea: 84,
      bedrooms: 3,
      bathrooms: 2,
      carport: 2,
      floors: 2,
      electricity: 2200,
      waterSource: 'PDAM',
      certificate: 'SHM',
      roadWidth: 'Row 8 Meter'
    },
    status: 'tersedia',
    image: KOMERSIL_GALLERY[0],
    gallery: KOMERSIL_GALLERY,
    sitePlanImage: DEFAULT_SITE_PLAN_IMAGE,
    sitePlanMarker: { x: 31.0, y: 84.0, label: 'A2 / No. 05' },
    description: 'Rumah mewah 2 lantai berkonsep modern tropical Scandinavian di jantung Serpong. Dilengkapi sistem keamanan one gate, CCTV 24 jam, underground cable system, dan clubhouse eksklusif penghuni.',
    highlights: ['Underground Cable System (Kabel Bawah Tanah)', 'Smart Door Lock & CCTV Kawasan', 'Clubhouse & Kolam Renang Eksklusif', '2 Carport Luas Muat SUV & City Car'],
    marketingContact: {
      name: 'Hendro Prasetyo (Senior Property Advisor)',
      phone: '0811-9988-1234',
      whatsapp: '6281199881234'
    },
    createdAt: '2026-10-01T07:30:00Z',
    updatedAt: '2026-11-07T11:20:00Z'
  },
  {
    id: 'prop-kom-002',
    title: 'The Grand Residence Sawangan',
    clusterOrHousingName: 'The Grand Sawangan Lifestyle Park',
    blockNumber: 'Kavling C1 / No. 18',
    category: 'komersil',
    price: 680000000,
    downPayment: 30000000,
    installmentPerMonth: 4900000,
    bookingFee: 5000000,
    location: {
      province: 'Jawa Barat',
      city: 'Depok',
      district: 'Sawangan',
      address: 'Jl. Raya Sawangan - Muchtar, Bojongsari, Sawangan, Depok',
      latitude: -6.402340,
      longitude: 106.772341,
      mapsUrl: 'https://www.google.com/maps?q=-6.402340,106.772341',
      nearbyFacilities: ['8 Menit ke Gerbang Tol Sawangan 4 (Desari)', '15 Menit ke The Park Mall Sawangan', 'RS Brawijaya & RS Permata Depok', 'Dekat Sekolah Cita Persada']
    },
    specs: {
      buildingArea: 54,
      surfaceArea: 72,
      bedrooms: 2,
      bathrooms: 1,
      carport: 1,
      floors: 1,
      electricity: 2200,
      waterSource: 'Sumur Bor Jetpump',
      certificate: 'SHM',
      roadWidth: 'Row 7.5 Meter'
    },
    status: 'tersedia',
    image: KOMERSIL_GALLERY[0],
    gallery: KOMERSIL_GALLERY,
    sitePlanImage: DEFAULT_SITE_PLAN_IMAGE,
    sitePlanMarker: { x: 58.5, y: 24.0, label: 'C1 / No. 18' },
    description: 'Hunian cluster modern bernuansa resort dengan ceiling plafon tinggi 4.2 meter, sirkulasi udara silang optimal, dan pencahayaan alami melimpah. Akses super mudah ke Tol Desari (Depok - Antasari).',
    highlights: ['High Ceiling 4.2m Ruang Terasa Sangat Sejuk', 'Free Kanopi & Smart Home Package', 'Promo Subsidi Biaya KPR & Free BPHTB', 'Lokasi Segitiga Emas Depok - Jaksel - Tangsel'],
    marketingContact: {
      name: 'Dewi Safitri (Sales Coordinator)',
      phone: '0857-1122-3344',
      whatsapp: '6285711223344'
    },
    createdAt: '2026-10-18T10:00:00Z',
    updatedAt: '2026-11-05T15:10:00Z'
  },
  {
    id: 'prop-kom-003',
    title: 'Cikarang Grand Estate Premium',
    clusterOrHousingName: 'Cikarang Grand Estate - Cluster Sakura',
    blockNumber: 'Kavling B1 / No. 03',
    category: 'komersil',
    price: 520000000,
    downPayment: 25000000,
    installmentPerMonth: 3850000,
    bookingFee: 5000000,
    location: {
      province: 'Jawa Barat',
      city: 'Bekasi',
      district: 'Cikarang',
      address: 'Kawasan Deltamas Boulevard, Cikarang Pusat, Kabupaten Bekasi',
      latitude: -6.338901,
      longitude: 107.172345,
      mapsUrl: 'https://www.google.com/maps?q=-6.338901,107.172345',
      nearbyFacilities: ['5 Menit ke Pintu Tol Cibatu & Cikarang Pusat', 'Dekat AEON Mall Deltamas Terbesar', 'Kampus ITSB & Sekolah Al-Azhar', 'Pusat Pemerintahan Kab. Bekasi']
    },
    specs: {
      buildingArea: 45,
      surfaceArea: 72,
      bedrooms: 2,
      bathrooms: 1,
      carport: 1,
      floors: 1,
      electricity: 2200,
      waterSource: 'WTP Kawasan',
      certificate: 'HGB',
      roadWidth: 'Row 8 Meter'
    },
    status: 'booking',
    image: KOMERSIL_GALLERY[0],
    gallery: KOMERSIL_GALLERY,
    sitePlanImage: DEFAULT_SITE_PLAN_IMAGE,
    sitePlanMarker: { x: 42.0, y: 44.5, label: 'B1 / No. 03' },
    description: 'Cluster prestisius selangkah dari AEON Mall Deltamas dan exit tol langsung. Mengadopsi arsitektur kontemporer Jepang dengan taman hijau zen garden komunal dan jogging track.',
    highlights: ['Selangkah ke AEON Mall Deltamas', 'Potensi Sewa Tinggi untuk Ekspatriat Kawasan GIIC', 'Sistem Satu Pintu Keamanan Berlapis RFID', 'Jalan Utama Paving Press Mutu K-350'],
    marketingContact: {
      name: 'Hendro Prasetyo (Senior Property Advisor)',
      phone: '0811-9988-1234',
      whatsapp: '6281199881234'
    },
    buyerLead: {
      buyerName: 'Ir. Budi Santoso (Supervisor Astra)',
      buyerPhone: '0812-9911-8822',
      kprStage: 'sp3k_turun',
      bookedAt: '2026-10-22T10:00:00Z',
      notes: 'SP3K dari Bank Mandiri sudah disetujui plafond 495jt, tinggal tentukan tanggal akad kredit.'
    },
    createdAt: '2026-10-12T13:00:00Z',
    updatedAt: '2026-11-06T14:00:00Z'
  },
  {
    id: 'prop-rec-001',
    title: 'Griya Indah Tambun (Over Kredit)',
    clusterOrHousingName: 'Perumahan Griya Indah Tambun 2',
    blockNumber: 'Blok C4 / No. 09',
    category: 'recycle',
    price: 235000000,
    downPayment: 65000000,
    installmentPerMonth: 1050000,
    bookingFee: 2000000,
    location: {
      province: 'Jawa Barat',
      city: 'Bekasi',
      district: 'Tambun Selatan',
      address: 'Jl. Rawa Kalong, Mangunjaya, Tambun Selatan, Kabupaten Bekasi',
      latitude: -6.258901,
      longitude: 107.062341,
      mapsUrl: 'https://www.google.com/maps?q=-6.258901,107.062341',
      nearbyFacilities: ['8 Menit ke Stasiun KRL Tambun', 'Dekat Pasar Mini Tambun & Superindo', 'Akses Tol Tambun / Grand Wisata', 'Dekat RS Karya Medika 2']
    },
    specs: {
      buildingArea: 42,
      surfaceArea: 60,
      bedrooms: 2,
      bathrooms: 1,
      carport: 1,
      floors: 1,
      electricity: 1300,
      waterSource: 'Sumur Bor Jetpump',
      certificate: 'SHM',
      roadWidth: 'Row 6 Meter'
    },
    status: 'tersedia',
    image: RECYCLE_GALLERY[0],
    gallery: RECYCLE_GALLERY,
    sitePlanImage: DEFAULT_SITE_PLAN_IMAGE,
    sitePlanMarker: { x: 47.0, y: 28.5, label: 'C4 / No. 09' },
    description: 'Unit Recycle / Over Kredit resmi Notaris. Rumah sudah renovasi total: dapur belakang tertutup rapi, kanopi baja ringan baru, cat luar dalam fresh, dan lantai keramik baru ganti. Tanpa perlu BI Checking ulang bank jika over kredit notaris.',
    highlights: ['Bisa Proses Over Kredit Resmi Lewat Notaris', 'Dapur Sudah Ditutup & Ada Meja Kompor Granit', 'Cicilan BTN Flat Rp 1.050.000 / Bulan', 'Sisa Tenor Hanya 9 Tahun Lagi'],
    recycleData: {
      bankAsal: 'Bank BTN Cabang Bekasi',
      sisaTenorBulan: 108,
      angsuranBerjalan: 1050000,
      dpOverKredit: 65000000,
      kondisiRenovasi: 'Dapur belakang tertutup tembok tinggi, kanopi carport terpasang, keramik 50x50 baru, cat dinding Nippon Paint fresh.'
    },
    marketingContact: {
      name: 'Bagus Pratama (Sales Executive)',
      phone: '0819-2233-4455',
      whatsapp: '6281922334455'
    },
    createdAt: '2026-10-14T09:00:00Z',
    updatedAt: '2026-11-06T16:00:00Z'
  },
  {
    id: 'prop-rec-002',
    title: 'Taman Cileungsi Hijau (Siap Huni)',
    clusterOrHousingName: 'Taman Cileungsi Hijau Blok K',
    blockNumber: 'Blok K2 / No. 17',
    category: 'recycle',
    price: 198000000,
    downPayment: 50000000,
    installmentPerMonth: 980000,
    bookingFee: 1500000,
    location: {
      province: 'Jawa Barat',
      city: 'Bogor',
      district: 'Cileungsi',
      address: 'Jl. Cileungsi Gandoang Km. 3, Cileungsi, Bogor',
      latitude: -6.412345,
      longitude: 107.032109,
      mapsUrl: 'https://www.google.com/maps?q=-6.412345,107.032109',
      nearbyFacilities: ['10 Menit ke Taman Buah Mekarsari', 'Dekat RS Kenari Graha Medika', 'Akses Pintu Tol Jatikarya / Cibubur', 'Dekat Pusat Perbelanjaan Metropolitan Mall Cibubur']
    },
    specs: {
      buildingArea: 38,
      surfaceArea: 60,
      bedrooms: 2,
      bathrooms: 1,
      carport: 1,
      floors: 1,
      electricity: 1300,
      waterSource: 'Sumur Bor Jetpump',
      certificate: 'HGB',
      roadWidth: 'Row 6 Meter'
    },
    status: 'proses_kpr',
    image: RECYCLE_GALLERY[0],
    gallery: RECYCLE_GALLERY,
    sitePlanImage: DEFAULT_SITE_PLAN_IMAGE,
    sitePlanMarker: { x: 50.0, y: 84.0, label: 'K2 / No. 17' },
    description: 'Unit recycle eks-takeover yang telah di-rehab total oleh KYAN Property. Dinding tidak retak, sanitasi closet duduk baru, wastafel baru, siap masuk tanpa pusing biaya tukang.',
    highlights: ['Kondisi 100% Siap Huni Bebas PR', 'Cicilan Super Ringan di Bawah Rp 1 Juta', 'Legalitas Notaris Lengkap & Aman', 'Jalan Lingkungan Paving Rapi'],
    recycleData: {
      bankAsal: 'Bank BTN Syariah Bogor',
      sisaTenorBulan: 120,
      angsuranBerjalan: 980000,
      dpOverKredit: 50000000,
      kondisiRenovasi: 'Plumbing pipa baru, closet ganti duduk, cat exterior & interior baru, taman depan dirapikan.'
    },
    marketingContact: {
      name: 'Dewi Safitri (Sales Coordinator)',
      phone: '0857-1122-3344',
      whatsapp: '6285711223344'
    },
    buyerLead: {
      buyerName: 'Dian Permana (Wirausaha Kuliner)',
      buyerPhone: '0856-7788-9900',
      kprStage: 'akad_kredit',
      bookedAt: '2026-10-18T11:00:00Z',
      notes: 'Akad notaris over kredit dijadwalkan tanggal 10 November 2026 jam 13.00 di kantor Notaris Cileungsi.'
    },
    createdAt: '2026-10-08T11:30:00Z',
    updatedAt: '2026-11-05T09:20:00Z'
  }
];
