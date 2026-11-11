import React, { useState } from 'react';
import { PropertyUnit, PropertyStatus, KprStage } from '../types/property';
import { formatRupiah, formatRupiahShort, getCategoryBadge, getStatusBadge } from '../utils/formatters';
import { generateWhatsAppMessage } from '../utils/kprCalculator';
import { DEFAULT_SITE_PLAN_IMAGE, GALLERY_TITLES } from '../data/initialProperties';
import { 
  X, MapPin, BedDouble, Bath, Home, ShieldCheck, RefreshCw, Sparkles, 
  MessageSquare, Printer, Check, User, ChevronLeft, ChevronRight,
  Building, Maximize2, Camera, ExternalLink, Map, ZoomIn, ZoomOut, RotateCcw, Pin
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: PropertyUnit | null;
  isAdmin?: boolean;
  onClose: () => void;
  onUpdateLead: (unitId: string, lead: PropertyUnit['buyerLead']) => void;
  onUpdateStatus: (unitId: string, status: PropertyStatus) => void;
  onOpenEdit: (property: PropertyUnit) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isAdmin = false,
  onClose,
  onUpdateLead,
  onUpdateStatus,
  onOpenEdit,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'siteplan' | 'buyer' | 'brochure'>('overview');
  const [sitePlanZoom, setSitePlanZoom] = useState(1);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Buyer Lead form state
  const [buyerName, setBuyerName] = useState(property?.buyerLead?.buyerName || '');
  const [buyerPhone, setBuyerPhone] = useState(property?.buyerLead?.buyerPhone || '');
  const [kprStage, setKprStage] = useState<KprStage>(
    property?.buyerLead?.kprStage || 'pemberkasan'
  );
  const [buyerNotes, setBuyerNotes] = useState(property?.buyerLead?.notes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!property) return null;

  // Fallback to 7 photos if property.gallery has fewer
  const photos = property.gallery && property.gallery.length >= 7 
    ? property.gallery.slice(0, 7)
    : [
        property.image,
        '/src/assets/images/kyan_living_room_1794176190514.jpg',
        '/src/assets/images/kyan_master_bedroom_1794176192336.jpg',
        '/src/assets/images/kyan_modern_kitchen_1794176192419.jpg',
        '/src/assets/images/kyan_clean_bathroom_1794176192658.jpg',
        '/src/assets/images/kyan_carport_garden_1794176192753.jpg',
        '/src/assets/images/kyan_property_banner_1794148348923.jpg'
      ];

  const cat = getCategoryBadge(property.category);
  const stat = getStatusBadge(property.status);

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) return;

    const newLead: PropertyUnit['buyerLead'] = {
      buyerName,
      buyerPhone,
      kprStage,
      bookedAt: property.buyerLead?.bookedAt || new Date().toISOString(),
      notes: buyerNotes,
    };

    onUpdateLead(property.id, newLead);
    if (property.status === 'tersedia') {
      onUpdateStatus(property.id, 'booking');
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const encoded = generateWhatsAppMessage(property);
    const waUrl = `https://wa.me/${property.marketingContact.whatsapp}?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const nextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <>
      {/* Fullscreen Lightbox Modal for Photo Gallery */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-5xl flex items-center justify-between text-white text-xs mb-3 px-2">
            <span className="font-semibold text-sm">
              {GALLERY_TITLES[activePhotoIndex] || `Foto ${activePhotoIndex + 1}`} · {property.title}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative max-w-5xl w-full max-h-[80vh] flex items-center justify-center">
            <img
              src={photos[activePhotoIndex]}
              alt={GALLERY_TITLES[activePhotoIndex]}
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />

            <button
              onClick={prevPhoto}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Thumbnails */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-4xl p-2">
            {photos.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`w-14 h-11 rounded overflow-hidden shrink-0 transition-all border-2 ${
                  activePhotoIndex === idx ? 'border-white scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={p} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Detail Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Modal Top Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/80">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${cat.badgeClass}`}>
                  {cat.label}
                </span>
                <span className="font-mono-numbers text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                  {property.blockNumber}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${stat.colorClass}`}>
                  {stat.label}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {property.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                title="Cetak Lembar Brosur Penawaran"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Navigation Tabs (KPR SIMULATOR HAS BEEN REMOVED) */}
          <div className="flex items-center gap-2 px-6 border-b border-slate-200 bg-white overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'border-slate-900 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>7 Galeri Foto & Spesifikasi Unit</span>
            </button>
            
            <button
              onClick={() => setActiveTab('siteplan')}
              className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'siteplan'
                  ? 'border-slate-900 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Site Plan & Posisi Kavling</span>
            </button>
            
            <button
              onClick={() => setActiveTab('buyer')}
              className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'buyer'
                  ? 'border-slate-900 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Catat Calon Buyer & Berkas' : 'Ajukan Minat / Booking'}</span>
            </button>

            <button
              onClick={() => setActiveTab('brochure')}
              className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'brochure'
                  ? 'border-slate-900 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Brosur Cetak / Penawaran</span>
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* TAB 1: 7-PHOTO GALLERY & SPECS */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* 7 FOTO GALLERY SHOWCASE */}
                <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md border border-slate-800">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white text-sm">Galeri Lengkap Unit (7 Foto)</span>
                    </div>
                    <span className="font-mono-numbers text-slate-300 bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                      Foto {activePhotoIndex + 1} dari {photos.length}
                    </span>
                  </div>

                  {/* Main Active Photo Display */}
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center group">
                    <img
                      src={photos[activePhotoIndex]}
                      alt={GALLERY_TITLES[activePhotoIndex] || `Foto ${activePhotoIndex + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Navigation Arrows */}
                    <button
                      onClick={prevPhoto}
                      title="Foto Sebelumnya"
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextPhoto}
                      title="Foto Selanjutnya"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Bottom Photo Caption & Zoom button */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none">
                      <div className="bg-black/75 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold text-white pointer-events-auto">
                        {GALLERY_TITLES[activePhotoIndex] || `Foto ${activePhotoIndex + 1}`}
                      </div>
                      <button
                        onClick={() => setIsLightboxOpen(true)}
                        title="Perbesar Foto Layar Penuh"
                        className="bg-black/75 hover:bg-black/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-xs font-medium text-white flex items-center gap-1.5 pointer-events-auto transition-colors"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Perbesar</span>
                      </button>
                    </div>
                  </div>

                  {/* 7 Thumbnails Carousel Strip */}
                  <div className="mt-3 grid grid-cols-7 gap-1.5 sm:gap-2">
                    {photos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIndex(idx)}
                        className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                          activePhotoIndex === idx
                            ? 'border-emerald-400 ring-2 ring-emerald-400/40 scale-102'
                            : 'border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-500'
                        }`}
                      >
                        <img
                          src={photo}
                          alt={GALLERY_TITLES[idx]}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] text-white py-0.5 truncate px-1 text-center font-mono-numbers">
                          #{idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Photo Index Indicator Labels */}
                  <div className="mt-2 text-center text-[11px] text-slate-400 truncate">
                    Sedang melihat: <strong className="text-white">{GALLERY_TITLES[activePhotoIndex]}</strong>
                  </div>
                </div>

                {/* Pricing & Key Numbers Box */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Pricing Overview */}
                  <div className="md:col-span-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Harga Cash / Akad</span>
                    <div className="text-2xl font-bold text-slate-900 font-mono-numbers mt-0.5">
                      {formatRupiah(property.price)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-500">Estimasi Cicilan:</span>
                        <div className="font-bold text-slate-800 font-mono-numbers text-sm">
                          {formatRupiah(property.installmentPerMonth)}<span className="text-xs font-normal">/bln</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">Uang Muka (DP):</span>
                        <div className="font-bold text-slate-800 font-mono-numbers text-sm">
                          {formatRupiah(property.downPayment)}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">Tanda Jadi (Booking):</span>
                        <div className="font-semibold text-slate-800 font-mono-numbers">
                          {formatRupiah(property.bookingFee)}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">Status Legalitas:</span>
                        <div className="font-semibold text-emerald-700 font-mono-numbers">
                          Sertifikat {property.specs.certificate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Details */}
                  <div className="md:col-span-6 flex flex-col justify-between">
                    {property.category === 'subsidi' && property.subsidiData && (
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1.5 h-full flex flex-col justify-center">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Program Rumah Subsidi Pemerintah FLPP
                        </div>
                        <p className="text-emerald-700">
                          • Suku Bunga KPR: <strong>{property.subsidiData.bungaTetap}% Flat</strong> sampai lunas (20 tahun).
                        </p>
                        <p className="text-emerald-700">
                          • Bantuan Uang Muka (SBUM): <strong>{formatRupiah(property.subsidiData.bantuanUangMuka)}</strong>.
                        </p>
                        <p className="text-emerald-700">
                          • Syarat: Belum memiliki rumah & gaji pokok maks {formatRupiahShort(property.subsidiData.syaratGajiMaksimal)}.
                        </p>
                      </div>
                    )}

                    {property.category === 'recycle' && property.recycleData && (
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1.5 h-full flex flex-col justify-center">
                        <div className="font-bold flex items-center gap-1.5 text-amber-800">
                          <RefreshCw className="w-4 h-4 text-amber-600" />
                          Skema Over Kredit / Takeover Notaris
                        </div>
                        <p className="text-amber-800">
                          • Bank Asal: <strong>{property.recycleData.bankAsal}</strong>
                        </p>
                        <p className="text-amber-800">
                          • DP / Biaya Ganti Rugi: <strong>{formatRupiah(property.recycleData.dpOverKredit)}</strong>
                        </p>
                        <p className="text-amber-800">
                          • Cicilan Berjalan: <strong>{formatRupiah(property.recycleData.angsuranBerjalan)}/bln</strong> (Sisa {(property.recycleData.sisaTenorBulan / 12).toFixed(1)} Tahun)
                        </p>
                        <p className="text-amber-700 text-[11px] italic">
                          *Bisa langsung proses di depan Notaris tanpa perlu BI Checking ulang bank.
                        </p>
                      </div>
                    )}

                    {property.category === 'komersil' && (
                      <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-900 space-y-1.5 h-full flex flex-col justify-center">
                        <div className="font-bold flex items-center gap-1.5 text-indigo-800">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          Keunggulan Kawasan Komersil Eksklusif
                        </div>
                        <p className="text-indigo-800">• One Gate System dengan keamanan security 24 jam</p>
                        <p className="text-indigo-800">• Row Jalan Lebar {property.specs.roadWidth} paving press</p>
                        <p className="text-indigo-800">• Dekat akses tol utama & pusat perbelanjaan</p>
                      </div>
                    )}
                  </div>

                </div>

                {/* Physical Specifications Grid */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-600" />
                    Spesifikasi Bangunan & Fasilitas Kavling
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block mb-0.5">Luas Bangunan (LB)</span>
                      <span className="font-bold text-slate-800 font-mono-numbers text-sm">{property.specs.buildingArea} m²</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block mb-0.5">Luas Tanah (LT)</span>
                      <span className="font-bold text-slate-800 font-mono-numbers text-sm">{property.specs.surfaceArea} m²</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block mb-0.5">Kamar Tidur / Mandi</span>
                      <span className="font-bold text-slate-800 font-mono-numbers text-sm">{property.specs.bedrooms} KT / {property.specs.bathrooms} KM</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block mb-0.5">Carport & Lantai</span>
                      <span className="font-bold text-slate-800 font-mono-numbers text-sm">{property.specs.carport} Mobil · {property.specs.floors} Lantai</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block mb-0.5">Daya Listrik PLN</span>
                      <span className="font-bold text-slate-800 font-mono-numbers text-sm">{property.specs.electricity} Watt</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block mb-0.5">Sumber Air Bersih</span>
                      <span className="font-bold text-slate-800 text-sm truncate">{property.specs.waterSource}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block mb-0.5">Sertifikat Legal</span>
                      <span className="font-bold text-slate-800 font-mono-numbers text-sm">{property.specs.certificate}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block mb-0.5">Lebar Row Jalan</span>
                      <span className="font-bold text-slate-800 text-sm">{property.specs.roadWidth}</span>
                    </div>
                  </div>
                </div>

                {/* Description & Nearby Facilities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Deskripsi Unit</h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-200 p-3.5 rounded-lg">
                      {property.description}
                    </p>
                    
                    {property.recycleData?.kondisiRenovasi && (
                      <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900">
                        <strong>Catatan Renovasi Siap Huni:</strong> {property.recycleData.kondisiRenovasi}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Akses & Fasilitas Terdekat</h4>
                    <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-700">
                      <div className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {property.location.address}
                      </div>
                      {property.location.nearbyFacilities.map((fac, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Titik Lokasi Google Maps Interactive View */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-rose-600" />
                        <span>Titik Lokasi Proyek & Peta Navigasi</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {property.location.address} ({property.location.district}, {property.location.city})
                        {property.location.latitude && property.location.longitude && (
                          <span className="ml-1 text-[11px] font-mono text-slate-400">
                            [{property.location.latitude}, {property.location.longitude}]
                          </span>
                        )}
                      </p>
                    </div>

                    <a
                      href={
                        property.location.mapsUrl
                          ? (property.location.mapsUrl.startsWith('http') ? property.location.mapsUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location.mapsUrl)}`)
                          : (property.location.latitude && property.location.longitude
                              ? `https://www.google.com/maps/search/?api=1&query=${property.location.latitude},${property.location.longitude}`
                              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.clusterOrHousingName}, ${property.location.district}, ${property.location.city}`)}`)
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs shrink-0 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka Titik Lokasi di Google Maps</span>
                    </a>
                  </div>

                  {/* Embed Map Iframe */}
                  <div className="w-full h-52 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative">
                    <iframe
                      key={property.id}
                      title={`Titik Lokasi ${property.title}`}
                      width="100%"
                      height="100%"
                      loading="lazy"
                      className="border-0"
                      src={
                        property.location.latitude && property.location.longitude
                          ? `https://maps.google.com/maps?q=${property.location.latitude},${property.location.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                          : property.location.mapsUrl && property.location.mapsUrl.includes(',')
                            ? `https://maps.google.com/maps?q=${encodeURIComponent(property.location.mapsUrl)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                            : `https://maps.google.com/maps?q=${encodeURIComponent(`${property.clusterOrHousingName} ${property.location.district} ${property.location.city}`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`
                      }
                    />
                  </div>
                </div>

              </div>
            )}

            {/* TAB: SITE PLAN & POSISI KAVLING */}
            {activeTab === 'siteplan' && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Map className="w-4 h-4 text-emerald-600" />
                      <span>Denah Site Plan Kawasan: {property.clusterOrHousingName}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Menampilkan denah tata letak masterplan perumahan dan posisi spesifik kavling <strong>{property.blockNumber}</strong>.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Zoom controls */}
                    <div className="inline-flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setSitePlanZoom(prev => Math.max(0.75, prev - 0.25))}
                        title="Zoom Out"
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] font-mono font-semibold px-2 text-slate-700">
                        {Math.round(sitePlanZoom * 100)}%
                      </span>
                      <button
                        type="button"
                        onClick={() => setSitePlanZoom(prev => Math.min(2.5, prev + 0.25))}
                        title="Zoom In"
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                      {sitePlanZoom !== 1 && (
                        <button
                          type="button"
                          onClick={() => setSitePlanZoom(1)}
                          title="Reset Zoom"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded ml-0.5 border-l border-slate-200"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => onOpenEdit(property)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
                      >
                        <Pin className="w-3 h-3" />
                        <span>Edit Tanda / Ganti Denah</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Site Plan Visual Container */}
                <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 sm:p-4 shadow-xl">
                  <div className="overflow-auto max-h-[520px] rounded-xl flex items-center justify-center">
                    <div
                      className="relative transition-transform duration-200 origin-center inline-block"
                      style={{ transform: `scale(${sitePlanZoom})` }}
                    >
                      <img
                        src={property.sitePlanImage || DEFAULT_SITE_PLAN_IMAGE}
                        alt={`Site Plan ${property.clusterOrHousingName}`}
                        className="max-w-full h-auto block rounded-lg shadow-md select-none"
                        style={{ minWidth: '600px' }}
                      />

                      {/* Unit Marker on Site Plan */}
                      {property.sitePlanMarker ? (
                        <div
                          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
                          style={{
                            left: `${property.sitePlanMarker.x}%`,
                            top: `${property.sitePlanMarker.y}%`
                          }}
                        >
                          {/* Animated radar sonar wave */}
                          <span className="absolute w-12 h-12 rounded-full bg-emerald-400/40 animate-ping" />
                          <span className="absolute w-6 h-6 rounded-full bg-emerald-500/60" />

                          {/* Marker Callout Bubble */}
                          <div className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-extrabold text-xs border-2 border-emerald-400 shadow-2xl whitespace-nowrap flex items-center gap-1.5 mb-1 animate-bounce">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{property.sitePlanMarker.label || property.blockNumber}</span>
                            <span className={`text-[10px] px-1 py-0.2 rounded font-normal ${stat.colorClass}`}>
                              {stat.label}
                            </span>
                          </div>

                          {/* Pin Arrow */}
                          <div className="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
                            <Pin className="w-3.5 h-3.5 fill-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 shadow-md">
                          ℹ️ Posisi tanda kavling ini belum diatur. Admin dapat mengklik tombol <strong>Edit Tanda</strong> di atas untuk menandai letak kavling pada foto denah.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Legend & Unit Specs Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block mb-0.5 text-[11px]">Blok & No Kavling:</span>
                    <span className="font-bold text-slate-800 text-sm font-mono-numbers">{property.blockNumber}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block mb-0.5 text-[11px]">Status Ketersediaan:</span>
                    <span className={`inline-block font-semibold px-2 py-0.5 rounded text-xs mt-0.5 ${stat.colorClass}`}>
                      {stat.label}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block mb-0.5 text-[11px]">Lebar Jalan Depan:</span>
                    <span className="font-semibold text-slate-800 text-sm">{property.specs.roadWidth}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BUYER & BOOKING INQUIRY */}
            {activeTab === 'buyer' && (
              <div className="space-y-6">
                
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900">
                  <h4 className="font-bold mb-1">
                    {isAdmin ? 'Manajemen Calon Pembeli & Monitoring Berkas' : 'Form Pengajuan Minat / Booking Unit'}
                  </h4>
                  <p>
                    {isAdmin 
                      ? `Catat calon buyer yang telah membayar booking fee untuk kavling ${property.blockNumber}.` 
                      : `Tertarik dengan unit ${property.blockNumber} (${property.title})? Isi formulir di bawah ini agar tim marketing KYAN Property dapat segera menghubungi Anda.`}
                  </p>
                </div>

                <form onSubmit={handleSaveLead} className="space-y-4 bg-white p-5 rounded-xl border border-slate-200">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Lengkap Calon Pembeli *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ahmad Fauzi (Karyawan PT Astra)"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nomor HP / WhatsApp *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 0812-3456-7890"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono-numbers"
                      />
                    </div>
                  </div>

                  {/* Tahap Progres KPR - Admin editable, User inform */}
                  {isAdmin ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Tahapan Berkas Saat Ini (Khusus Admin)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                        {[
                          { id: 'pemberkasan', label: '1. Pemberkasan Dokumen' },
                          { id: 'slik_checking', label: '2. BI Checking / SLIK' },
                          { id: 'wawancara_bank', label: '3. Wawancara Analis' },
                          { id: 'sp3k_turun', label: '4. SP3K Terbit (ACC)' },
                          { id: 'akad_kredit', label: '5. Siap Akad Notaris' },
                        ].map(stg => (
                          <button
                            type="button"
                            key={stg.id}
                            onClick={() => setKprStage(stg.id as any)}
                            className={`p-2.5 rounded-lg border text-left transition-all ${
                              kprStage === stg.id
                                ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {stg.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Catatan Tambahan */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isAdmin ? 'Catatan Pemberkasan / Kelengkapan' : 'Rencana Survey / Pertanyaan Khusus'}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={isAdmin ? "Contoh: DP sudah masuk 50%, berkas slip gaji lengkap..." : "Contoh: Mau survey lokasi hari Sabtu ini, apakah bisa didampingi marketing?"}
                      value={buyerNotes}
                      onChange={(e) => setBuyerNotes(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-3 text-slate-800"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-slate-500">
                      {property.buyerLead?.bookedAt && (
                        <span>Terdaftar sejak: {new Date(property.buyerLead.bookedAt).toLocaleDateString('id-ID')}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {savedSuccess && (
                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="w-4 h-4" /> {isAdmin ? 'Tersimpan!' : 'Pengajuan Berhasil Dikirim!'}
                        </span>
                      )}
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                      >
                        {isAdmin ? 'Simpan Data Calon Pembeli' : 'Kirim Pengajuan Booking / Survey'}
                      </button>
                    </div>
                  </div>

                </form>

              </div>
            )}

            {/* TAB 3: PRINTABLE BROCHURE / OFFER SHEET */}
            {activeTab === 'brochure' && (
              <div className="p-6 bg-white border border-slate-300 rounded-xl space-y-6 text-slate-800" id="printable-brochure">
                
                {/* Header Brosur */}
                <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
                  <div>
                    <div className="text-xl font-bold tracking-tight text-slate-900">
                      KYAN PROPERTY
                    </div>
                    <p className="text-xs text-slate-500">
                      Lembar Informasi Resmi Unit & Galeri Foto Lengkap
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono-numbers px-2.5 py-1 bg-slate-900 text-white rounded font-bold">
                      KAVLING: {property.blockNumber}
                    </span>
                    <div className="text-xs text-slate-500 mt-1">
                      Dicetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
                    </div>
                  </div>
                </div>

                {/* Unit Title & Pricing Box */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{property.title}</h3>
                    <p className="text-xs text-slate-600">{property.location.address}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {cat.label}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                        Tipe {property.specs.buildingArea}/{property.specs.surfaceArea}
                      </span>
                    </div>
                  </div>
                  <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6">
                    <div className="text-xs text-slate-500">Harga Jual / Akad:</div>
                    <div className="text-xl font-bold text-slate-900 font-mono-numbers">
                      {formatRupiah(property.price)}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Cicilan: <strong>{formatRupiahShort(property.installmentPerMonth)}</strong>/bln · DP {formatRupiahShort(property.downPayment)}
                    </div>
                  </div>
                </div>

                {/* 7 Photos Grid for Print Sheet */}
                <div>
                  <div className="font-bold text-xs text-slate-900 mb-2">Dokumentasi 7 Foto Unit Kavling:</div>
                  <div className="grid grid-cols-4 gap-2">
                    {photos.slice(0, 4).map((p, idx) => (
                      <div key={idx} className="aspect-[4/3] rounded border border-slate-200 overflow-hidden">
                        <img src={p} alt={`Print Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {photos.slice(4, 7).map((p, idx) => (
                      <div key={idx + 4} className="aspect-[4/3] rounded border border-slate-200 overflow-hidden">
                        <img src={p} alt={`Print Photo ${idx + 5}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specs & Highlights */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 border border-slate-200 rounded-lg">
                    <div className="font-bold text-slate-900 mb-2">Spesifikasi Bangunan</div>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Luas Bangunan: {property.specs.buildingArea} m²</li>
                      <li>• Luas Tanah: {property.specs.surfaceArea} m²</li>
                      <li>• Kamar Tidur: {property.specs.bedrooms} Kamar</li>
                      <li>• Kamar Mandi: {property.specs.bathrooms} Kamar</li>
                      <li>• Legalitas: Sertifikat {property.specs.certificate}</li>
                      <li>• Listrik & Air: {property.specs.electricity} Watt · {property.specs.waterSource}</li>
                    </ul>
                  </div>

                  <div className="p-3 border border-slate-200 rounded-lg">
                    <div className="font-bold text-slate-900 mb-2">Keunggulan & Aksesibilitas</div>
                    <ul className="space-y-1 text-slate-600">
                      {property.highlights.map((h, i) => (
                        <li key={i}>• {h}</li>
                      ))}
                      {property.location.nearbyFacilities.slice(0, 2).map((f, i) => (
                        <li key={`f-${i}`}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Contact Footer */}
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900">Kantor Pemasaran KYAN Property</div>
                    <div className="text-slate-500">Sales Consultant: {property.marketingContact.name} ({property.marketingContact.phone})</div>
                  </div>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg text-xs"
                  >
                    Cetak Lembar Ini
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Modal Bottom Sticky Bar */}
          <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            
            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={() => onOpenEdit(property)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Edit Data Unit (Admin)
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Hubungi Marketing WhatsApp</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Tutup
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};
