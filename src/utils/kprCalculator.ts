import { PropertyCategory, PropertyUnit } from '../types/property';
import { formatRupiah } from './formatters';

export interface KprSimulationInput {
  propertyPrice: number;
  downPayment: number; // Nilai Rupiah
  tenorYears: number; // 5, 10, 15, 20, 25
  annualInterestRate: number; // Persen, e.g. 5.0 atau 7.5
  category: PropertyCategory;
}

export interface KprSimulationResult {
  propertyPrice: number;
  downPayment: number;
  downPaymentPercent: number;
  loanPrincipal: number; // Plafond Pinjaman KPR
  tenorYears: number;
  tenorMonths: number;
  annualInterestRate: number;
  monthlyInstallment: number;
  totalRepayment: number;
  totalInterest: number;
  estimatedCosts: {
    bookingFee: number;
    bphtb: number; // Bea Perolehan Hak atas Tanah dan Bangunan (~5% x (harga - NPOPTKP))
    ajbNotary: number; // Akta Jual Beli & Notaris (~1%)
    bankAdminAndProvision: number; // Provisi & Administrasi KPR (~1.5% dari plafond)
    lifeAndFireInsurance: number; // Asuransi Jiwa & Kebakaran (~1.2% dari plafond)
    totalInitialCost: number; // Total Dana Awal Dibutuhkan
  };
}

export function calculateKpr(input: KprSimulationInput): KprSimulationResult {
  const { propertyPrice, downPayment, tenorYears, annualInterestRate, category } = input;

  const loanPrincipal = Math.max(0, propertyPrice - downPayment);
  const tenorMonths = tenorYears * 12;
  const monthlyRate = annualInterestRate / 100 / 12;

  let monthlyInstallment = 0;
  if (loanPrincipal > 0 && tenorMonths > 0) {
    if (monthlyRate === 0) {
      monthlyInstallment = loanPrincipal / tenorMonths;
    } else {
      // Formula anuitas: P * [ r(1+r)^n ] / [ (1+r)^n – 1 ]
      const factor = Math.pow(1 + monthlyRate, tenorMonths);
      monthlyInstallment = Math.round((loanPrincipal * (monthlyRate * factor)) / (factor - 1));
    }
  }

  const totalRepayment = monthlyInstallment * tenorMonths;
  const totalInterest = Math.max(0, totalRepayment - loanPrincipal);
  const downPaymentPercent = propertyPrice > 0 ? (downPayment / propertyPrice) * 100 : 0;

  // Estimasi Biaya Awal (Pra-Akad)
  // Untuk subsidi FLPP: Gratis PPN & SBUM bantuan uang muka Rp 4jt, biaya provisi & notaris disubsidi pemerintah
  let bphtb = 0;
  let ajbNotary = 0;
  let bankAdminAndProvision = 0;
  let lifeAndFireInsurance = 0;
  const bookingFee = category === 'subsidi' ? 1000000 : category === 'recycle' ? 2000000 : 5000000;

  if (category === 'subsidi') {
    // Subsidi biasanya bebas BPHTB atau dapat stimulus pemerintah, biaya notaris & provisi flat murah ~Rp 2.500.000 - Rp 3.500.000
    bphtb = 0; // Bebas BPHTB untuk MBR FLPP di banyak pemda
    ajbNotary = 1500000;
    bankAdminAndProvision = 500000;
    lifeAndFireInsurance = 1000000;
  } else if (category === 'recycle') {
    // Recycle takeover lewat notaris biasanya butuh Akta Perjanjian Oper Kredit Notaris + Kuasa Menjual & Mengambil Sertifikat (~Rp 3.500.000 - Rp 5.000.000)
    bphtb = 0; // belum balik nama jika masih angsuran berjalan
    ajbNotary = 3500000;
    bankAdminAndProvision = 0; // tidak ada biaya bank baru jika over kredit notaris
    lifeAndFireInsurance = 0;
  } else {
    // Komersil: standar BPHTB 5% x (Harga - NPOPTKP 60jt), AJB Notaris 1%, Provisi Bank 1%, Asuransi 1%
    const npoptkp = 60000000;
    bphtb = Math.max(0, (propertyPrice - npoptkp) * 0.05);
    ajbNotary = Math.round(propertyPrice * 0.01);
    bankAdminAndProvision = Math.round(loanPrincipal * 0.015);
    lifeAndFireInsurance = Math.round(loanPrincipal * 0.012);
  }

  const totalInitialCost = downPayment + bookingFee + bphtb + ajbNotary + bankAdminAndProvision + lifeAndFireInsurance;

  return {
    propertyPrice,
    downPayment,
    downPaymentPercent,
    loanPrincipal,
    tenorYears,
    tenorMonths,
    annualInterestRate,
    monthlyInstallment,
    totalRepayment,
    totalInterest,
    estimatedCosts: {
      bookingFee,
      bphtb,
      ajbNotary,
      bankAdminAndProvision,
      lifeAndFireInsurance,
      totalInitialCost
    }
  };
}

export function generateWhatsAppMessage(property: PropertyUnit, userCustomNote?: string): string {
  const categoryLabel = property.category === 'subsidi' ? 'Rumah Subsidi (FLPP)' : property.category === 'recycle' ? 'Rumah Recycle (Takeover / Rehab)' : 'Rumah Komersil (Cluster)';

  const text = `Halo Tim Marketing KYAN PROPERTY,

Saya tertarik dan ingin menanyakan informasi lebih lanjut mengenai unit properti berikut:
🏠 *${property.title}*
📍 *Lokasi:* ${property.location.district}, ${property.location.city}
🔢 *Blok / Kavling:* ${property.blockNumber}
🏷️ *Kategori:* ${categoryLabel}
💰 *Harga:* ${formatRupiah(property.price)}
💵 *Estimasi Cicilan:* ${formatRupiah(property.installmentPerMonth)}/bulan
📐 *Spesifikasi:* Tipe ${property.specs.buildingArea}/${property.specs.surfaceArea} (LB/LT)

${userCustomNote ? `Catatan Pertanyaan:\n"${userCustomNote}"\n\n` : ''}Apakah unit ini masih tersedia untuk jadwal survey lokasi atau simulasi KPR lebih detail?

Terima kasih.`;

  return encodeURIComponent(text);
}

export function exportPropertiesToCSV(properties: PropertyUnit[]): void {
  const headers = [
    'ID Unit',
    'Nama Perumahan / Cluster',
    'Blok Kavling',
    'Kategori',
    'Status Unit',
    'Harga Cash (Rp)',
    'Uang Muka / DP (Rp)',
    'Cicilan / Bulan (Rp)',
    'Kota / Kabupaten',
    'Kecamatan',
    'Luas Bangunan (m2)',
    'Luas Tanah (m2)',
    'Kamar Tidur',
    'Kamar Mandi',
    'Sertifikat',
    'Calon Pembeli',
    'Tahap KPR',
    'No WhatsApp Marketing'
  ];

  const rows = properties.map(p => [
    `"${p.id}"`,
    `"${p.title.replace(/"/g, '""')}"`,
    `"${p.blockNumber}"`,
    `"${p.category.toUpperCase()}"`,
    `"${p.status.toUpperCase()}"`,
    p.price,
    p.downPayment,
    p.installmentPerMonth,
    `"${p.location.city}"`,
    `"${p.location.district}"`,
    p.specs.buildingArea,
    p.specs.surfaceArea,
    p.specs.bedrooms,
    p.specs.bathrooms,
    `"${p.specs.certificate}"`,
    `"${p.buyerLead?.buyerName || '-'}"`,
    `"${p.buyerLead?.kprStage || '-'}"`,
    `"${p.marketingContact.whatsapp}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `KYAN_PROPERTY_INVENTORY_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
