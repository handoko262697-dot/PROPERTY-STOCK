import React, { useState, useEffect, useRef } from 'react';
import { PropertyUnit, PropertyCategory, PropertyStatus, CertificateType, WaterSourceType, SitePlanMarker } from '../types/property';
import { X, Building2, MapPin, Calculator, ShieldCheck, RefreshCw, Home, Check, Camera, Image, Upload, ExternalLink, Map, Crosshair, Pin } from 'lucide-react';
import { SUBSIDI_GALLERY, KOMERSIL_GALLERY, RECYCLE_GALLERY, GALLERY_TITLES, DEFAULT_SITE_PLAN_IMAGE } from '../data/initialProperties';

interface AddEditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: PropertyUnit) => void;
  editingProperty?: PropertyUnit | null;
  defaultSalesContact?: {
    name: string;
    phone: string;
    whatsapp: string;
  };
}

const PRESET_IMAGES = [
  {
    name: 'Rumah Subsidi Modern Minimalis (Tipe 30/60)',
    url: '/src/assets/images/kyan_subsidi_house_1794148348377.jpg',
    category: 'subsidi'
  },
  {
    name: 'Rumah Komersil 2 Lantai Cluster Eksklusif',
    url: '/src/assets/images/kyan_komersil_cluster_1794148348155.jpg',
    category: 'komersil'
  },
  {
    name: 'Rumah Recycle / Over Kredit Siap Huni Renovasi',
    url: '/src/assets/images/kyan_recycle_takeover_1794148348612.jpg',
    category: 'recycle'
  }
];

export const AddEditPropertyModal: React.FC<AddEditPropertyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProperty,
  defaultSalesContact,
}) => {
  // Form states
  const [title, setTitle] = useState('');
  const [clusterName, setClusterName] = useState('');
  const [blockNumber, setBlockNumber] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('subsidi');
  const [status, setStatus] = useState<PropertyStatus>('tersedia');
  
  const [price, setPrice] = useState<number>(185000000);
  const [downPayment, setDownPayment] = useState<number>(2000000);
  const [installment, setInstallment] = useState<number>(1150000);
  const [bookingFee, setBookingFee] = useState<number>(1000000);

  const [province, setProvince] = useState('Jawa Barat');
  const [city, setCity] = useState('Bogor');
  const [district, setDistrict] = useState('Cileungsi');
  const [address, setAddress] = useState('');

  const [buildingArea, setBuildingArea] = useState<number>(30);
  const [surfaceArea, setSurfaceArea] = useState<number>(60);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [carport, setCarport] = useState<number>(1);
  const [floors, setFloors] = useState<number>(1);
  const [electricity, setElectricity] = useState<number>(1300);
  const [waterSource, setWaterSource] = useState<WaterSourceType>('Sumur Bor Jetpump');
  const [certificate, setCertificate] = useState<CertificateType>('SHM');
  const [roadWidth, setRoadWidth] = useState('Row 6.5 Meter');
  const [mapsUrl, setMapsUrl] = useState('');

  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [gallery, setGallery] = useState<string[]>(SUBSIDI_GALLERY);
  const [description, setDescription] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');
  
  // Site Plan state
  const [sitePlanImage, setSitePlanImage] = useState<string>(DEFAULT_SITE_PLAN_IMAGE);
  const [sitePlanMarker, setSitePlanMarker] = useState<SitePlanMarker | undefined>(undefined);
  const sitePlanImgRef = useRef<HTMLImageElement>(null);

  const handleSitePlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setSitePlanImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSitePlanClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const img = sitePlanImgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    if (clickX < 0 || clickX > rect.width || clickY < 0 || clickY > rect.height) return;
    const xPct = Math.round((clickX / rect.width) * 1000) / 10;
    const yPct = Math.round((clickY / rect.height) * 1000) / 10;
    setSitePlanMarker({
      x: Math.max(1, Math.min(99, xPct)),
      y: Math.max(1, Math.min(99, yPct)),
      label: blockNumber || 'Kavling',
    });
  };

  // Recycle extra
  const [bankAsal, setBankAsal] = useState('Bank BTN');
  const [sisaTenorBulan, setSisaTenorBulan] = useState(120);
  const [angsuranBerjalan, setAngsuranBerjalan] = useState(1050000);
  const [dpOverKredit, setDpOverKredit] = useState(55000000);
  const [kondisiRenovasi, setKondisiRenovasi] = useState('Dapur sudah ditutup, cat baru, kanopi baja ringan.');

  // Photo Upload Handler for a specific slot (1-7)
  const handleSlotPhotoUpload = (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setGallery(prev => {
          const updated = [...prev];
          updated[slotIndex] = dataUrl;
          return updated;
        });
        if (slotIndex === 0) {
          setImage(dataUrl);
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Multiple / Batch Photo Upload Handler
  const handleBatchPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxCount = Math.min(files.length, 7);
    const readers: Promise<{ index: number; dataUrl: string }>[] = [];

    for (let i = 0; i < maxCount; i++) {
      const file = files[i];
      const slotIdx = i;
      readers.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({ index: slotIdx, dataUrl: event.target?.result as string });
          };
          reader.readAsDataURL(file);
        })
      );
    }

    Promise.all(readers).then((results) => {
      setGallery(prev => {
        const updated = [...prev];
        results.forEach(({ index, dataUrl }) => {
          if (dataUrl) {
            updated[index] = dataUrl;
          }
        });
        return updated;
      });
      if (results[0]?.dataUrl) {
        setImage(results[0].dataUrl);
      }
    });

    e.target.value = '';
  };

  // Populate when editing
  useEffect(() => {
    if (editingProperty) {
      setTitle(editingProperty.title);
      setClusterName(editingProperty.clusterOrHousingName);
      setBlockNumber(editingProperty.blockNumber);
      setCategory(editingProperty.category);
      setStatus(editingProperty.status);
      setPrice(editingProperty.price);
      setDownPayment(editingProperty.downPayment);
      setInstallment(editingProperty.installmentPerMonth);
      setBookingFee(editingProperty.bookingFee);
      setProvince(editingProperty.location.province);
      setCity(editingProperty.location.city);
      setDistrict(editingProperty.location.district);
      setAddress(editingProperty.location.address);
      setMapsUrl(editingProperty.location.mapsUrl || (editingProperty.location.latitude && editingProperty.location.longitude ? `https://www.google.com/maps?q=${editingProperty.location.latitude},${editingProperty.location.longitude}` : ''));
      setBuildingArea(editingProperty.specs.buildingArea);
      setSurfaceArea(editingProperty.specs.surfaceArea);
      setBedrooms(editingProperty.specs.bedrooms);
      setBathrooms(editingProperty.specs.bathrooms);
      setCarport(editingProperty.specs.carport);
      setFloors(editingProperty.specs.floors);
      setElectricity(editingProperty.specs.electricity);
      setWaterSource(editingProperty.specs.waterSource);
      setCertificate(editingProperty.specs.certificate);
      setRoadWidth(editingProperty.specs.roadWidth);
      setImage(editingProperty.image);
      setGallery(editingProperty.gallery?.length >= 7 ? editingProperty.gallery : (editingProperty.category === 'komersil' ? KOMERSIL_GALLERY : editingProperty.category === 'recycle' ? RECYCLE_GALLERY : SUBSIDI_GALLERY));
      setDescription(editingProperty.description);
      setHighlightsInput(editingProperty.highlights.join('\n'));
      setSitePlanImage(editingProperty.sitePlanImage || DEFAULT_SITE_PLAN_IMAGE);
      setSitePlanMarker(editingProperty.sitePlanMarker);

      if (editingProperty.recycleData) {
        setBankAsal(editingProperty.recycleData.bankAsal);
        setSisaTenorBulan(editingProperty.recycleData.sisaTenorBulan);
        setAngsuranBerjalan(editingProperty.recycleData.angsuranBerjalan);
        setDpOverKredit(editingProperty.recycleData.dpOverKredit);
        setKondisiRenovasi(editingProperty.recycleData.kondisiRenovasi);
      }
    } else {
      // Defaults for new property
      setTitle('');
      setClusterName('');
      setBlockNumber('Blok A1 / No. 01');
      setCategory('subsidi');
      setStatus('tersedia');
      setPrice(185000000);
      setDownPayment(2000000);
      setInstallment(1150000);
      setBookingFee(1000000);
      setProvince('Jawa Barat');
      setCity('Bogor');
      setDistrict('Cileungsi');
      setAddress('Jl. Raya Cileungsi, Bogor');
      setMapsUrl('');
      setBuildingArea(30);
      setSurfaceArea(60);
      setBedrooms(2);
      setBathrooms(1);
      setCarport(1);
      setFloors(1);
      setElectricity(1300);
      setWaterSource('Sumur Bor Jetpump');
      setCertificate('SHM');
      setRoadWidth('Row 6.5 Meter');
      setImage(SUBSIDI_GALLERY[0]);
      setGallery(SUBSIDI_GALLERY);
      setDescription('Unit perumahan baru dengan sirkulasi udara optimal dan konstruksi hebel berkualitas.');
      setHighlightsInput('Program KPR Subsidi FLPP\nBebas PPN\nDekat Sekolah & Pasar');
      setSitePlanImage(DEFAULT_SITE_PLAN_IMAGE);
      setSitePlanMarker(undefined);
    }
  }, [editingProperty, isOpen]);

  if (!isOpen) return null;

  // Adjust default values when category changes
  const handleCategoryChange = (newCat: PropertyCategory) => {
    setCategory(newCat);
    if (!editingProperty) {
      if (newCat === 'subsidi') {
        setPrice(185000000);
        setDownPayment(2000000);
        setInstallment(1150000);
        setBookingFee(1000000);
        setBuildingArea(30);
        setSurfaceArea(60);
        setImage(SUBSIDI_GALLERY[0]);
        setGallery(SUBSIDI_GALLERY);
      } else if (newCat === 'komersil') {
        setPrice(650000000);
        setDownPayment(30000000);
        setInstallment(4800000);
        setBookingFee(5000000);
        setBuildingArea(54);
        setSurfaceArea(72);
        setImage(KOMERSIL_GALLERY[0]);
        setGallery(KOMERSIL_GALLERY);
      } else {
        setPrice(220000000);
        setDownPayment(50000000);
        setInstallment(1020000);
        setBookingFee(2000000);
        setBuildingArea(38);
        setSurfaceArea(60);
        setImage(RECYCLE_GALLERY[0]);
        setGallery(RECYCLE_GALLERY);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const highlights = highlightsInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const fullGallery = gallery.length >= 7 
      ? gallery.slice(0, 7)
      : [...gallery, ...SUBSIDI_GALLERY.slice(gallery.length)];

    // Parse coordinates if mapsUrl has lat, lng
    let parsedLat = editingProperty?.location.latitude;
    let parsedLng = editingProperty?.location.longitude;
    if (mapsUrl) {
      const coordMatch = mapsUrl.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
      if (coordMatch) {
        parsedLat = parseFloat(coordMatch[1]);
        parsedLng = parseFloat(coordMatch[2]);
      }
    }

    const savedUnit: PropertyUnit = {
      id: editingProperty ? editingProperty.id : `prop-${Date.now()}`,
      title: title || `${clusterName} ${blockNumber}`,
      clusterOrHousingName: clusterName || 'Perumahan Asri',
      blockNumber: blockNumber || 'Blok Kavling',
      category,
      status,
      price: Number(price),
      downPayment: Number(downPayment),
      installmentPerMonth: Number(installment),
      bookingFee: Number(bookingFee),
      location: {
        province,
        city,
        district,
        address: address || `${district}, ${city}`,
        mapsUrl: mapsUrl.trim() || undefined,
        latitude: parsedLat,
        longitude: parsedLng,
        nearbyFacilities: editingProperty?.location.nearbyFacilities || ['Dekat Stasiun KRL', 'Akses Pintu Tol', 'Dekat Pasar Tradisional']
      },
      specs: {
        buildingArea: Number(buildingArea),
        surfaceArea: Number(surfaceArea),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        carport: Number(carport),
        floors: Number(floors),
        electricity: Number(electricity),
        waterSource,
        certificate,
        roadWidth: roadWidth || 'Row 6 Meter'
      },
      image: fullGallery[0],
      gallery: fullGallery,
      description: description || 'Unit properti siap huni pilihan terbaik dari KYAN Property.',
      highlights: highlights.length > 0 ? highlights : ['Lingkungan Asri', 'Bebas Banjir', 'Akses Mudah'],
      marketingContact: editingProperty?.marketingContact || defaultSalesContact || {
        name: 'Tim Marketing KYAN Property',
        phone: '0812-8899-7711',
        whatsapp: '6281288997711'
      },
      sitePlanImage: sitePlanImage || DEFAULT_SITE_PLAN_IMAGE,
      sitePlanMarker: sitePlanMarker ? {
        x: sitePlanMarker.x,
        y: sitePlanMarker.y,
        label: sitePlanMarker.label || blockNumber || 'Kavling'
      } : undefined,
      createdAt: editingProperty?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (category === 'recycle') {
      savedUnit.recycleData = {
        bankAsal: bankAsal || 'Bank BTN',
        sisaTenorBulan: Number(sisaTenorBulan),
        angsuranBerjalan: Number(angsuranBerjalan),
        dpOverKredit: Number(dpOverKredit),
        kondisiRenovasi: kondisiRenovasi || 'Siap Huni'
      };
    } else if (category === 'subsidi') {
      savedUnit.subsidiData = {
        skema: 'FLPP (Fasilitas Likuiditas Pembiayaan Perumahan)',
        bungaTetap: 5.0,
        bantuanUangMuka: 4000000,
        syaratGajiMaksimal: 8000000
      };
    }

    onSave(savedUnit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editingProperty ? 'Edit Data Kavling Unit' : 'Tambah Unit Baru ke Inventory'}
            </h2>
            <p className="text-xs text-slate-500">
              KYAN PROPERTY APP · Sistem Stok Rumah Subsidi, Komersil & Recycle
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-800">
          
          {/* Section 1: Kategori & Identitas Kavling */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Building2 className="w-4 h-4 text-slate-600" />
              1. Kategori & Identitas Kavling
            </h3>

            {/* Category Selector Tabs */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Kategori Properti *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'subsidi', label: 'Subsidi (FLPP)', icon: ShieldCheck, desc: 'Program Pemerintah' },
                  { id: 'komersil', label: 'Komersil', icon: Building2, desc: 'Cluster Modern' },
                  { id: 'recycle', label: 'Recycle', icon: RefreshCw, desc: 'Takeover / Rehab' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => handleCategoryChange(item.id as PropertyCategory)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        category === item.id
                          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] opacity-80 block mt-0.5">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Perumahan / Cluster *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pesona Cileungsi Asri"
                  value={clusterName}
                  onChange={(e) => setClusterName(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Blok / Kavling *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blok B2 / No. 15"
                  value={blockNumber}
                  onChange={(e) => setBlockNumber(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono-numbers"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Status Ketersediaan *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                >
                  <option value="tersedia">Ready Stock (Tersedia)</option>
                  <option value="booking">Booking Fee</option>
                  <option value="proses_kpr">Proses Berkas KPR</option>
                  <option value="terjual">Terjual (Sold Out)</option>
                  <option value="renovasi">Tahap Renovasi</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Judul Lengkap Listing (Opsional)
              </label>
              <input
                type="text"
                placeholder="e.g. Pesona Cileungsi Asri Blok B2 Hook Murah"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
              />
            </div>

          </div>

          {/* Section 2: Finansial & Harga */}
          <div className="space-y-4 pt-3 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Calculator className="w-4 h-4 text-slate-600" />
              2. Skema Finansial & Harga
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Harga Cash / Akad (Rp) *
                </label>
                <input
                  type="number"
                  step={500000}
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono-numbers"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Uang Muka (DP) (Rp) *
                </label>
                <input
                  type="number"
                  step={500000}
                  required
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono-numbers"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Estimasi Cicilan / Bln (Rp) *
                </label>
                <input
                  type="number"
                  step={10000}
                  required
                  value={installment}
                  onChange={(e) => setInstallment(Number(e.target.value))}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono-numbers"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Booking Fee (Rp)
                </label>
                <input
                  type="number"
                  step={100000}
                  value={bookingFee}
                  onChange={(e) => setBookingFee(Number(e.target.value))}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono-numbers"
                />
              </div>
            </div>

            {/* Khusus Recycle / Takeover fields */}
            {category === 'recycle' && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
                  Rincian Khusus Unit Recycle / Over Kredit
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-amber-800 mb-1">Bank Asal KPR</label>
                    <input
                      type="text"
                      placeholder="e.g. Bank BTN Cabang Bekasi"
                      value={bankAsal}
                      onChange={(e) => setBankAsal(e.target.value)}
                      className="w-full text-xs border border-amber-200 rounded-lg px-3 py-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-amber-800 mb-1">Sisa Tenor (Bulan)</label>
                    <input
                      type="number"
                      placeholder="108 bulan (9 tahun)"
                      value={sisaTenorBulan}
                      onChange={(e) => setSisaTenorBulan(Number(e.target.value))}
                      className="w-full text-xs border border-amber-200 rounded-lg px-3 py-2 bg-white font-mono-numbers"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-amber-800 mb-1">DP Over Kredit (Ganti Rugi)</label>
                    <input
                      type="number"
                      value={dpOverKredit}
                      onChange={(e) => setDpOverKredit(Number(e.target.value))}
                      className="w-full text-xs border border-amber-200 rounded-lg px-3 py-2 bg-white font-mono-numbers"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-amber-800 mb-1">Catatan Kondisi Renovasi</label>
                  <input
                    type="text"
                    placeholder="e.g. Dapur tertutup rapi, kanopi terpasang, cat baru siap huni"
                    value={kondisiRenovasi}
                    onChange={(e) => setKondisiRenovasi(e.target.value)}
                    className="w-full text-xs border border-amber-200 rounded-lg px-3 py-2 bg-white"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Section 3: Lokasi & Alamat */}
          <div className="space-y-4 pt-3 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <MapPin className="w-4 h-4 text-slate-600" />
              3. Lokasi & Alamat
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kota / Kabupaten *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                >
                  <option value="Bogor">Bogor</option>
                  <option value="Bekasi">Bekasi</option>
                  <option value="Tangerang">Tangerang</option>
                  <option value="Depok">Depok</option>
                  <option value="Bandung">Bandung</option>
                  <option value="Cikarang">Cikarang</option>
                  <option value="Karawang">Karawang</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kecamatan *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cileungsi, Sawangan, Serpong"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Provinsi</label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                placeholder="e.g. Jl. Raya Cileungsi - Setu Km. 4, Cileungsi, Bogor"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
              />
            </div>

            {/* Titik Lokasi Google Maps */}
            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-semibold text-emerald-900 text-xs">
                  Titik Lokasi (Google Maps / Titik Koordinat GPS)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          const lat = pos.coords.latitude.toFixed(6);
                          const lng = pos.coords.longitude.toFixed(6);
                          setMapsUrl(`https://www.google.com/maps?q=${lat},${lng}`);
                        },
                        () => {
                          alert('Gagal mengambil titik GPS. Pastikan izin lokasi diaktifkan.');
                        }
                      );
                    } else {
                      alert('Browser tidak mendukung geolokasi');
                    }
                  }}
                  className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-200 px-2 py-0.5 rounded shadow-xs hover:bg-emerald-50 inline-flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" />
                  Gunakan GPS Saat Ini
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Contoh: https://maps.app.goo.gl/... atau koordinat -6.398123, 107.012345"
                  value={mapsUrl}
                  onChange={(e) => setMapsUrl(e.target.value)}
                  className="w-full text-xs border border-emerald-200 rounded-lg px-3 py-2 text-slate-800 bg-white"
                />
                {mapsUrl.trim() && (
                  <a
                    href={mapsUrl.startsWith('http') ? mapsUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-2 rounded-lg font-medium inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Tes Titik
                  </a>
                )}
              </div>
              <p className="text-[11px] text-emerald-700/80">
                Titik lokasi ini akan otomatis muncul pada tombol peta dan embed Google Maps di detail produk.
              </p>
            </div>
          </div>

          {/* Section 4: Spesifikasi Bangunan */}
          <div className="space-y-4 pt-3 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Home className="w-4 h-4 text-slate-600" />
              4. Spesifikasi Teknis Bangunan
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Luas Bangunan (m²)</label>
                <input
                  type="number"
                  value={buildingArea}
                  onChange={(e) => setBuildingArea(Number(e.target.value))}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 font-mono-numbers"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Luas Tanah (m²)</label>
                <input
                  type="number"
                  value={surfaceArea}
                  onChange={(e) => setSurfaceArea(Number(e.target.value))}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 font-mono-numbers"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kamar Tidur</label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 font-mono-numbers"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kamar Mandi</label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 font-mono-numbers"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Listrik (Watt)</label>
                <select
                  value={electricity}
                  onChange={(e) => setElectricity(Number(e.target.value))}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5"
                >
                  <option value={1300}>1300 Watt</option>
                  <option value={2200}>2200 Watt</option>
                  <option value={3500}>3500 Watt</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sumber Air</label>
                <select
                  value={waterSource}
                  onChange={(e) => setWaterSource(e.target.value as WaterSourceType)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5"
                >
                  <option value="Sumur Bor Jetpump">Sumur Bor Jetpump</option>
                  <option value="PDAM">PDAM</option>
                  <option value="WTP Kawasan">WTP Kawasan</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sertifikat</label>
                <select
                  value={certificate}
                  onChange={(e) => setCertificate(e.target.value as CertificateType)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5"
                >
                  <option value="SHM">SHM (Hak Milik)</option>
                  <option value="HGB">HGB (Guna Bangunan)</option>
                  <option value="AJB">AJB (Akta Jual Beli)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Row Jalan</label>
                <input
                  type="text"
                  value={roadWidth}
                  onChange={(e) => setRoadWidth(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Galeri 7 Foto & Deskripsi */}
          <div className="space-y-4 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>5. Galeri Produk (Wajib 7 Foto)</span>
              </h3>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px]">Set Standar:</span>
                <button
                  type="button"
                  onClick={() => setGallery(SUBSIDI_GALLERY)}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px]"
                >
                  Subsidi
                </button>
                <button
                  type="button"
                  onClick={() => setGallery(KOMERSIL_GALLERY)}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px]"
                >
                  Komersil
                </button>
                <button
                  type="button"
                  onClick={() => setGallery(RECYCLE_GALLERY)}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px]"
                >
                  Recycle
                </button>
              </div>
            </div>

            {/* Multi-upload banner */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-emerald-950 block">Upload Foto dari Galeri / File Perangkat</span>
                <span className="text-[11px] text-emerald-800/80 block">
                  Pilih langsung dari galeri HP atau komputer Anda tanpa perlu mengetik link URL.
                </span>
              </div>
              <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs shrink-0 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Sekaligus (Hingga 7 Foto)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleBatchPhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* 7 Photo Slots Grid */}
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                Daftar 7 Foto Unit (Klik "Pilih Foto" atau "Ganti Foto" pada masing-masing slot):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GALLERY_TITLES.map((titleText, idx) => {
                  const currentPhoto = gallery[idx] || SUBSIDI_GALLERY[idx];
                  const isUploaded = gallery[idx]?.startsWith('data:image');
                  return (
                    <div key={idx} className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
                      <div className="w-16 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative group">
                        <img
                          src={currentPhoto}
                          alt={titleText}
                          className="w-full h-full object-cover"
                        />
                        {isUploaded && (
                          <div className="absolute top-0.5 right-0.5 bg-emerald-600 text-white text-[9px] px-1 rounded-sm font-bold">
                            Upload
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-bold text-slate-800 truncate block">
                            {titleText}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200 transition-colors">
                            <Upload className="w-3 h-3 text-emerald-600" />
                            <span>{isUploaded ? 'Ganti Foto' : 'Pilih Foto'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSlotPhotoUpload(idx, e)}
                              className="hidden"
                            />
                          </label>
                          {isUploaded && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...gallery];
                                updated[idx] = (category === 'komersil' ? KOMERSIL_GALLERY : category === 'recycle' ? RECYCLE_GALLERY : SUBSIDI_GALLERY)[idx];
                                setGallery(updated);
                              }}
                              className="text-[10px] text-slate-400 hover:text-rose-600 font-medium"
                              title="Reset ke gambar default"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Keunggulan Utama (1 per baris)
              </label>
              <textarea
                rows={3}
                value={highlightsInput}
                onChange={(e) => setHighlightsInput(e.target.value)}
                placeholder="Program KPR Subsidi FLPP&#10;Bebas PPN&#10;Dekat Stasiun KRL"
                className="w-full text-xs border border-slate-200 rounded-lg p-3 text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Deskripsi Lengkap
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan detail lingkungan, spesifikasi, dan keunggulan unit..."
                className="w-full text-xs border border-slate-200 rounded-lg p-3 text-slate-800"
              />
            </div>

          </div>

          {/* Section 6: Foto Site Plan & Tanda Posisi Kavling */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Map className="w-4 h-4 text-emerald-600" />
                  <span>6. Foto Site Plan Denah & Berikan Tanda Posisi Kavling</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Upload foto denah site plan dan klik langsung pada gambar untuk memberikan tanda pin kavling ini.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload / Ganti Foto Denah</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSitePlanUpload}
                    className="hidden"
                  />
                </label>
                {sitePlanImage !== DEFAULT_SITE_PLAN_IMAGE && (
                  <button
                    type="button"
                    onClick={() => setSitePlanImage(DEFAULT_SITE_PLAN_IMAGE)}
                    className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    Reset Foto
                  </button>
                )}
                {sitePlanMarker && (
                  <button
                    type="button"
                    onClick={() => setSitePlanMarker(undefined)}
                    className="text-xs text-rose-600 hover:text-rose-700 px-2 py-1.5 rounded-lg border border-rose-200 bg-rose-50 font-medium"
                  >
                    Hapus Tanda
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Site Plan Canvas */}
            <div className="space-y-2">
              <div className="relative w-full rounded-xl overflow-hidden border-2 border-dashed border-emerald-400/80 bg-slate-950 flex items-center justify-center p-2 shadow-inner">
                <div
                  onClick={handleSitePlanClick}
                  className="relative inline-block cursor-crosshair group max-w-full"
                  title="Klik di mana saja pada gambar denah untuk meletakkan / memindahkan tanda pin kavling"
                >
                  <img
                    ref={sitePlanImgRef}
                    src={sitePlanImage}
                    alt="Site Plan Perumahan"
                    className="max-h-[420px] w-auto max-w-full object-contain block mx-auto rounded-lg select-none pointer-events-auto shadow-md"
                  />

                  {/* Helper hint banner */}
                  <div className="absolute top-2 left-2 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1.5 pointer-events-none shadow-md">
                    <Crosshair className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>Klik pada denah untuk meletakkan tanda kavling <strong>({blockNumber || 'Unit'})</strong></span>
                  </div>

                  {/* Pinned Marker Overlay */}
                  {sitePlanMarker && (
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-150 pointer-events-none flex flex-col items-center z-10"
                      style={{ left: `${sitePlanMarker.x}%`, top: `${sitePlanMarker.y}%` }}
                    >
                      {/* Glowing pulse ring */}
                      <span className="absolute w-8 h-8 rounded-full bg-rose-500/30 animate-ping" />
                      
                      {/* Pin label badge */}
                      <div className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-bold text-[11px] border border-rose-400 shadow-lg whitespace-nowrap flex items-center gap-1 mb-0.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                        <span>{sitePlanMarker.label || blockNumber || 'Kavling'}</span>
                      </div>

                      {/* Pin pointer icon */}
                      <div className="w-5 h-5 rounded-full bg-rose-600 border-2 border-white shadow-md flex items-center justify-center text-white">
                        <Pin className="w-2.5 h-2.5 fill-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Marker Status Indicator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Status Tanda Kavling:</span>
                  {sitePlanMarker ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded text-[11px]">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Ditandai pada X: {sitePlanMarker.x}% · Y: {sitePlanMarker.y}%
                    </span>
                  ) : (
                    <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                      Belum ditandai (Klik pada denah di atas untuk menandai)
                    </span>
                  )}
                </div>

                {sitePlanMarker && (
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-slate-600 font-medium">Label Tanda:</label>
                    <input
                      type="text"
                      value={sitePlanMarker.label || blockNumber}
                      onChange={(e) => setSitePlanMarker({ ...sitePlanMarker, label: e.target.value })}
                      placeholder="e.g. Blok B3 / 14"
                      className="text-xs bg-white border border-slate-300 rounded px-2 py-1 font-semibold text-slate-800"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
            >
              {editingProperty ? 'Simpan Perubahan' : 'Tambah ke Inventory'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
