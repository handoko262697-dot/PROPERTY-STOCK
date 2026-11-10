import React, { useState, useEffect } from 'react';
import { PropertyUnit, PropertyCategory, PropertyStatus, CertificateType, WaterSourceType } from '../types/property';
import { X, Building2, MapPin, Calculator, ShieldCheck, RefreshCw, Home, Check, Camera, Image } from 'lucide-react';
import { SUBSIDI_GALLERY, KOMERSIL_GALLERY, RECYCLE_GALLERY, GALLERY_TITLES } from '../data/initialProperties';

interface AddEditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: PropertyUnit) => void;
  editingProperty?: PropertyUnit | null;
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
}) => {
  if (!isOpen) return null;

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

  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [gallery, setGallery] = useState<string[]>(SUBSIDI_GALLERY);
  const [description, setDescription] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');

  // Recycle extra
  const [bankAsal, setBankAsal] = useState('Bank BTN');
  const [sisaTenorBulan, setSisaTenorBulan] = useState(120);
  const [angsuranBerjalan, setAngsuranBerjalan] = useState(1050000);
  const [dpOverKredit, setDpOverKredit] = useState(55000000);
  const [kondisiRenovasi, setKondisiRenovasi] = useState('Dapur sudah ditutup, cat baru, kanopi baja ringan.');

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
      setHighlightsInput('Bunga KPR FLPP 5% Flat\nBebas PPN\nDekat Sekolah & Pasar');
    }
  }, [editingProperty, isOpen]);

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
      marketingContact: editingProperty?.marketingContact || {
        name: 'Tim Marketing KYAN Property',
        phone: '0812-8899-7711',
        whatsapp: '6281288997711'
      },
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
                  { id: 'subsidi', label: 'Subsidi (FLPP)', icon: ShieldCheck, desc: 'Bunga 5% Flat' },
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

            {/* 7 Photo Slots Grid */}
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                Daftar 7 Foto Dokumentasi Produk:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GALLERY_TITLES.map((titleText, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                    <div className="w-16 h-12 rounded overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={gallery[idx] || SUBSIDI_GALLERY[idx]}
                        alt={titleText}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-slate-800 block truncate">
                        {titleText}
                      </span>
                      <input
                        type="text"
                        value={gallery[idx] || ''}
                        onChange={(e) => {
                          const updated = [...gallery];
                          updated[idx] = e.target.value;
                          setGallery(updated);
                        }}
                        placeholder="URL Foto..."
                        className="w-full text-[10px] border border-slate-200 rounded px-1.5 py-0.5 mt-0.5 text-slate-700 truncate"
                      />
                    </div>
                  </div>
                ))}
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
                placeholder="Bunga KPR Flat 5%&#10;Bebas PPN&#10;Dekat Stasiun KRL"
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
