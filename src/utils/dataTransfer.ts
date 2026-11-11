import { PropertyUnit, PropertyCategory, PropertyStatus } from '../types/property';
import { SUBSIDI_GALLERY, KOMERSIL_GALLERY, RECYCLE_GALLERY } from '../data/initialProperties';

/**
 * Export properties to standard CSV format (Excel compatible)
 */
export function exportPropertiesToCSV(properties: PropertyUnit[]): void {
  const headers = [
    'ID Unit',
    'Judul Listing',
    'Nama Cluster / Perumahan',
    'Blok Kavling',
    'Kategori (subsidi/komersil/recycle)',
    'Status (tersedia/booking/proses_kpr/terjual/renovasi)',
    'Harga Cash (Rp)',
    'Uang Muka DP (Rp)',
    'Cicilan per Bulan (Rp)',
    'Booking Fee (Rp)',
    'Provinsi',
    'Kota / Kabupaten',
    'Kecamatan',
    'Alamat Lengkap',
    'Titik Lokasi (Google Maps URL / Koordinat)',
    'Luas Bangunan (m2)',
    'Luas Tanah (m2)',
    'Kamar Tidur',
    'Kamar Mandi',
    'Carport',
    'Daya Listrik (VA)',
    'Sumber Air',
    'Sertifikat',
    'Nama Sales',
    'Nomor Telepon Sales',
    'Nomor WhatsApp Sales',
    'Deskripsi'
  ];

  const rows = properties.map(p => {
    const mapsLocation = p.location.mapsUrl || (p.location.latitude && p.location.longitude ? `${p.location.latitude}, ${p.location.longitude}` : '');
    return [
      `"${p.id}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.clusterOrHousingName.replace(/"/g, '""')}"`,
      `"${p.blockNumber.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.status}"`,
      p.price,
      p.downPayment,
      p.installmentPerMonth,
      p.bookingFee,
      `"${p.location.province}"`,
      `"${p.location.city}"`,
      `"${p.location.district}"`,
      `"${p.location.address.replace(/"/g, '""')}"`,
      `"${mapsLocation}"`,
      p.specs.buildingArea,
      p.specs.surfaceArea,
      p.specs.bedrooms,
      p.specs.bathrooms,
      p.specs.carport,
      p.specs.electricity,
      `"${p.specs.waterSource}"`,
      `"${p.specs.certificate}"`,
      `"${p.marketingContact.name.replace(/"/g, '""')}"`,
      `"${p.marketingContact.phone}"`,
      `"${p.marketingContact.whatsapp}"`,
      `"${(p.description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `KYAN_PROPERTY_INVENTORY_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Parse CSV with proper quote handling
 */
export function parseCSVLines(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentToken = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentToken += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentToken.trim());
      currentToken = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(currentToken.trim());
      currentToken = '';
      if (row.some(val => val.length > 0)) {
        lines.push(row);
      }
      row = [];
    } else {
      currentToken += char;
    }
  }

  if (currentToken.length > 0 || row.length > 0) {
    row.push(currentToken.trim());
    if (row.some(val => val.length > 0)) {
      lines.push(row);
    }
  }

  return lines;
}

/**
 * Parse CSV text into PropertyUnit array
 */
export function parsePropertiesFromCSV(
  csvText: string,
  defaultSales: { name: string; phone: string; whatsapp: string }
): { success: boolean; data?: PropertyUnit[]; error?: string } {
  try {
    const cleanText = csvText.replace(/^\uFEFF/, '').trim();
    if (!cleanText) {
      return { success: false, error: 'File CSV kosong.' };
    }

    const lines = parseCSVLines(cleanText);
    if (lines.length < 2) {
      return { success: false, error: 'File CSV harus memiliki baris judul (header) dan minimal 1 baris data unit.' };
    }

    const rawRows = lines.slice(1);
    const properties: PropertyUnit[] = [];

    rawRows.forEach((row, idx) => {
      if (row.length < 5) return;

      const title = row[1] || row[0] || `Unit Kavling ${idx + 1}`;
      const cluster = row[2] || title;
      const block = row[3] || `Blok ${idx + 1}`;
      
      const rawCategory = (row[4] || 'subsidi').toLowerCase().trim();
      const category: PropertyCategory = rawCategory.includes('komersil') ? 'komersil' : rawCategory.includes('recycle') ? 'recycle' : 'subsidi';
      
      const rawStatus = (row[5] || 'tersedia').toLowerCase().trim();
      const status: PropertyStatus = ['tersedia', 'booking', 'proses_kpr', 'terjual', 'renovasi'].includes(rawStatus) 
        ? (rawStatus as PropertyStatus) 
        : 'tersedia';

      const price = Number(row[6]?.replace(/[^0-9]/g, '')) || (category === 'subsidi' ? 185000000 : 450000000);
      const dp = Number(row[7]?.replace(/[^0-9]/g, '')) || Math.round(price * 0.05);
      const installment = Number(row[8]?.replace(/[^0-9]/g, '')) || Math.round((price - dp) / 240);
      const bookingFee = Number(row[9]?.replace(/[^0-9]/g, '')) || 1000000;

      const province = row[10] || 'Jawa Barat';
      const city = row[11] || 'Bogor';
      const district = row[12] || 'Cileungsi';
      const address = row[13] || `Jl. Raya ${cluster}, ${district}, ${city}`;
      const rawMapsLoc = (row[14] || '').trim();

      let parsedLat: number | undefined;
      let parsedLng: number | undefined;
      if (rawMapsLoc) {
        const coordMatch = rawMapsLoc.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
        if (coordMatch) {
          parsedLat = parseFloat(coordMatch[1]);
          parsedLng = parseFloat(coordMatch[2]);
        }
      }

      const lb = Number(row[15]?.replace(/[^0-9]/g, '')) || (category === 'subsidi' ? 30 : 45);
      const lt = Number(row[16]?.replace(/[^0-9]/g, '')) || (category === 'subsidi' ? 60 : 72);
      const bedrooms = Number(row[17]?.replace(/[^0-9]/g, '')) || 2;
      const bathrooms = Number(row[18]?.replace(/[^0-9]/g, '')) || 1;
      const carport = Number(row[19]?.replace(/[^0-9]/g, '')) || 1;
      const electricity = Number(row[20]?.replace(/[^0-9]/g, '')) || 1300;
      const waterSource = (row[21] || 'Sumur Bor Jetpump') as any;
      const certificate = (row[22] || 'SHM') as any;

      const salesName = row[23] || defaultSales.name;
      const salesPhone = row[24] || defaultSales.phone;
      const salesWhatsapp = row[25]?.replace(/[^0-9]/g, '') || defaultSales.whatsapp;
      const description = row[26] || `Unit pilihan di ${cluster}. Lokasi strategis dengan fasilitas lengkap dan legalitas terjamin.`;

      const defaultGallery = category === 'komersil' ? KOMERSIL_GALLERY : category === 'recycle' ? RECYCLE_GALLERY : SUBSIDI_GALLERY;

      const unit: PropertyUnit = {
        id: `csv-import-${Date.now()}-${idx}`,
        title,
        clusterOrHousingName: cluster,
        blockNumber: block,
        category,
        price,
        downPayment: dp,
        installmentPerMonth: installment,
        bookingFee,
        location: {
          province,
          city,
          district,
          address,
          nearbyFacilities: ['Akses Jalan Aspal', 'Dekat Sarana Pendidikan', 'Pasar & Pertokoan', 'Bebas Banjir'],
          mapsUrl: rawMapsLoc ? (rawMapsLoc.startsWith('http') ? rawMapsLoc : `https://www.google.com/maps?q=${encodeURIComponent(rawMapsLoc)}`) : undefined,
          latitude: parsedLat,
          longitude: parsedLng,
        },
        specs: {
          buildingArea: lb,
          surfaceArea: lt,
          bedrooms,
          bathrooms,
          carport,
          floors: 1,
          electricity,
          waterSource,
          certificate,
          roadWidth: 'Row 6.5 Meter',
        },
        status,
        image: defaultGallery[0],
        gallery: defaultGallery,
        description,
        highlights: ['Legalitas Terjamin SHM', 'Stok Siap Bangun / Siap Huni', 'Akses Strategis'],
        marketingContact: {
          name: salesName,
          phone: salesPhone,
          whatsapp: salesWhatsapp,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      properties.push(unit);
    });

    if (properties.length === 0) {
      return { success: false, error: 'Tidak ada baris data unit yang berhasil diproses dari file CSV.' };
    }

    return { success: true, data: properties };
  } catch (err: any) {
    return { success: false, error: `Gagal membaca file CSV: ${err.message || 'Format tidak sesuai'}` };
  }
}

/**
 * Generate sample CSV template for download
 */
export function downloadSampleCSV(): void {
  const sampleHeaders = [
    'ID Unit',
    'Judul Listing',
    'Nama Cluster / Perumahan',
    'Blok Kavling',
    'Kategori (subsidi/komersil/recycle)',
    'Status (tersedia/booking/proses_kpr/terjual/renovasi)',
    'Harga Cash (Rp)',
    'Uang Muka DP (Rp)',
    'Cicilan per Bulan (Rp)',
    'Booking Fee (Rp)',
    'Provinsi',
    'Kota / Kabupaten',
    'Kecamatan',
    'Alamat Lengkap',
    'Titik Lokasi (Google Maps URL / Koordinat)',
    'Luas Bangunan (m2)',
    'Luas Tanah (m2)',
    'Kamar Tidur',
    'Kamar Mandi',
    'Carport',
    'Daya Listrik (VA)',
    'Sumber Air',
    'Sertifikat',
    'Nama Sales',
    'Nomor Telepon Sales',
    'Nomor WhatsApp Sales',
    'Deskripsi'
  ];

  const sampleRows = [
    [
      '"UNIT-SUB-01"',
      '"Griya Asri Cileungsi Type 30/60"',
      '"Griya Asri Cileungsi"',
      '"Blok C1 / No. 08"',
      '"subsidi"',
      '"tersedia"',
      '185000000',
      '5000000',
      '1180000',
      '1000000',
      '"Jawa Barat"',
      '"Bogor"',
      '"Cileungsi"',
      '"Jl. Raya Cileungsi - Setu Km. 4"',
      '"-6.4025, 106.9942"',
      '30',
      '60',
      '2',
      '1',
      '1',
      '1300',
      '"Sumur Bor Jetpump"',
      '"SHM"',
      '"Handoko Marketing"',
      '"0812-8899-7711"',
      '"6281288997711"',
      '"Rumah subsidi pemerintah FLPP bebas banjir, dekat jalan utama."'
    ],
    [
      '"UNIT-KOM-01"',
      '"Grand Emerald Cluster Modern Type 45/72"',
      '"Grand Emerald Residence"',
      '"Blok B2 / No. 15"',
      '"komersil"',
      '"tersedia"',
      '485000000',
      '25000000',
      '3450000',
      '2500000',
      '"Jawa Barat"',
      '"Bekasi"',
      '"Tambun Selatan"',
      '"Jl. Boulevard Grand Emerald No. 15"',
      '"-6.2621, 107.0543"',
      '45',
      '72',
      '2',
      '1',
      '1',
      '2200',
      '"PDAM"',
      '"SHM"',
      '"Handoko Marketing"',
      '"0812-8899-7711"',
      '"6281288997711"',
      '"Cluster one gate system keamanan 24 jam, underground drainage, club house."'
    ]
  ];

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [sampleHeaders.join(','), ...sampleRows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'TEMPLATE_IMPORT_KYAN_PROPERTY.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
