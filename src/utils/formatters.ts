import { PropertyCategory, PropertyStatus } from '../types/property';

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatRupiahShort(value: number): string {
  if (value >= 1_000_000_000) {
    const val = value / 1_000_000_000;
    return `Rp ${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)} Miliar`;
  }
  if (value >= 1_000_000) {
    const val = value / 1_000_000;
    return `Rp ${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)} Juta`;
  }
  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)} Ribu`;
  }
  return `Rp ${value}`;
}

export function getCategoryBadge(category: PropertyCategory): {
  label: string;
  tagClass: string;
  badgeClass: string;
  description: string;
} {
  switch (category) {
    case 'subsidi':
      return {
        label: 'Subsidi (FLPP)',
        tagClass: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
        badgeClass: 'bg-emerald-600 text-white',
        description: 'Rumah Program Pemerintah Bunga Flat 5% Tenor 20 Thn'
      };
    case 'komersil':
      return {
        label: 'Komersil (Cluster)',
        tagClass: 'text-indigo-700 bg-indigo-50 border border-indigo-200',
        badgeClass: 'bg-indigo-600 text-white',
        description: 'Cluster Modern Eksklusif Developer Swasta'
      };
    case 'recycle':
      return {
        label: 'Recycle (Takeover / Rehab)',
        tagClass: 'text-amber-800 bg-amber-50 border border-amber-200',
        badgeClass: 'bg-amber-600 text-white',
        description: 'Over Kredit Resmi Notaris / Siap Huni Renovasi'
      };
  }
}

export function getStatusBadge(status: PropertyStatus): {
  label: string;
  colorClass: string;
  dotColor: string;
} {
  switch (status) {
    case 'tersedia':
      return {
        label: 'Ready Stock',
        colorClass: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
        dotColor: 'bg-emerald-500'
      };
    case 'booking':
      return {
        label: 'Booking Fee',
        colorClass: 'text-amber-700 bg-amber-50 border border-amber-200',
        dotColor: 'bg-amber-500'
      };
    case 'proses_kpr':
      return {
        label: 'Proses KPR / Bank',
        colorClass: 'text-blue-700 bg-blue-50 border border-blue-200',
        dotColor: 'bg-blue-500'
      };
    case 'terjual':
      return {
        label: 'Terjual (Sold Out)',
        colorClass: 'text-slate-600 bg-slate-100 border border-slate-200',
        dotColor: 'bg-slate-400'
      };
    case 'renovasi':
      return {
        label: 'Tahap Renovasi',
        colorClass: 'text-purple-700 bg-purple-50 border border-purple-200',
        dotColor: 'bg-purple-500'
      };
  }
}

export function getKprStageLabel(stage: 'pemberkasan' | 'slik_checking' | 'wawancara_bank' | 'sp3k_turun' | 'akad_kredit'): string {
  switch (stage) {
    case 'pemberkasan':
      return '1. Pemberkasan Dokumen';
    case 'slik_checking':
      return '2. BI Checking / SLIK OJK';
    case 'wawancara_bank':
      return '3. Wawancara Analis Bank';
    case 'sp3k_turun':
      return '4. SP3K Terbit (Disetujui)';
    case 'akad_kredit':
      return '5. Siap Akad Kredit Notaris';
  }
}
