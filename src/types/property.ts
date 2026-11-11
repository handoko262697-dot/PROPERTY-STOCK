export type PropertyCategory = 'subsidi' | 'komersil' | 'recycle';

export type PropertyStatus = 'tersedia' | 'booking' | 'proses_kpr' | 'terjual' | 'renovasi';

export type CertificateType = 'SHM' | 'HGB' | 'AJB';

export type WaterSourceType = 'Sumur Bor Jetpump' | 'PDAM' | 'WTP Kawasan';

export type KprStage = 'pemberkasan' | 'slik_checking' | 'wawancara_bank' | 'sp3k_turun' | 'akad_kredit';

export interface BuyerLead {
  buyerName: string;
  buyerPhone: string;
  kprStage: KprStage;
  bookedAt: string;
  notes?: string;
}

export interface SitePlanMarker {
  x: number; // percentage 0 - 100% from left
  y: number; // percentage 0 - 100% from top
  label?: string; // e.g. "Blok B3 / No. 14"
  notes?: string;
}

export interface PropertyUnit {
  id: string;
  title: string;
  clusterOrHousingName: string;
  blockNumber: string; // e.g. "Blok B3 / No. 12"
  category: PropertyCategory;
  sitePlanImage?: string; // Foto denah / site plan
  sitePlanMarker?: SitePlanMarker; // Posisi titik tanda pada foto denah
  price: number; // Rupiah
  downPayment: number; // Minimal DP
  installmentPerMonth: number; // Estimasi cicilan per bulan
  bookingFee: number; // Uang tanda jadi
  location: {
    province: string;
    city: string;
    district: string;
    address: string;
    nearbyFacilities: string[];
    latitude?: number;
    longitude?: number;
    mapsUrl?: string; // Link Google Maps atau pin titik lokasi
  };
  specs: {
    buildingArea: number; // LB (m²)
    surfaceArea: number; // LT (m²)
    bedrooms: number;
    bathrooms: number;
    carport: number;
    floors: number;
    electricity: number; // Watt
    waterSource: WaterSourceType;
    certificate: CertificateType;
    roadWidth: string; // misal "Row 6.5 Meter"
  };
  status: PropertyStatus;
  image: string;
  gallery: string[]; // 7 Foto Galeri Unit
  description: string;
  highlights: string[];
  // Spesifik untuk Recycle / Takeover
  recycleData?: {
    bankAsal: string; // misal BTN, BRI, BSI, Mandiri
    sisaTenorBulan: number; // misal 144 bulan (12 tahun)
    angsuranBerjalan: number; // Rp / bulan
    dpOverKredit: number; // Biaya ganti rugi DP ke pemilik lama
    kondisiRenovasi: string; // misal "Siap huni, dapur tertutup, kanopi terpasang, cat baru"
  };
  // Spesifik untuk Subsidi FLPP
  subsidiData?: {
    skema: string; // FLPP / BPVA
    bungaTetap: number; // 5%
    bantuanUangMuka: number; // Rp 4.000.000 (SBUM)
    syaratGajiMaksimal: number; // Rp 8.000.000
  };
  // Kontak Agen / Kantor Pemasaran
  marketingContact: {
    name: string;
    phone: string;
    whatsapp: string;
  };
  buyerLead?: BuyerLead;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilterState {
  searchQuery: string;
  category: 'all' | PropertyCategory;
  city: string;
  district: string;
  status: 'all' | PropertyStatus;
  minPrice: number | null;
  maxPrice: number | null;
  quickPriceRange: 'all' | 'under200' | '200to500' | '500to1000' | 'above1000';
  minBedrooms: number | 'all';
  sortBy: 'terbaru' | 'harga_asc' | 'harga_desc' | 'luas_tanah' | 'angsuran_asc';
}
