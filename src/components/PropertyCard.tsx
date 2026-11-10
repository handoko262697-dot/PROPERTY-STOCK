import React from 'react';
import { PropertyUnit, PropertyStatus } from '../types/property';
import { formatRupiah, formatRupiahShort, getCategoryBadge, getStatusBadge } from '../utils/formatters';
import { generateWhatsAppMessage } from '../utils/kprCalculator';
import { MapPin, BedDouble, Bath, Home, MessageSquare, ArrowRight, ShieldCheck, RefreshCw, Sparkles, Check } from 'lucide-react';

interface PropertyCardProps {
  property: PropertyUnit;
  isAdmin?: boolean;
  onSelectDetail: (property: PropertyUnit) => void;
  onUpdateStatus: (id: string, newStatus: PropertyStatus) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isAdmin = false,
  onSelectDetail,
  onUpdateStatus,
}) => {
  const cat = getCategoryBadge(property.category);
  const stat = getStatusBadge(property.status);

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const encoded = generateWhatsAppMessage(property);
    const waUrl = `https://wa.me/${property.marketingContact.whatsapp}?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      
      {/* Top Image & Status Badges */}
      <div>
        <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onSelectDetail(property)}>
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />

          {/* Fallback pattern if image is hidden */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 to-transparent flex items-end p-3 pointer-events-none">
            <span className="text-white text-xs font-semibold px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm">
              {property.blockNumber}
            </span>
          </div>

          {/* Floating Category Badge */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm ${cat.badgeClass}`}>
              {cat.label}
            </span>
          </div>

          {/* Floating Availability Status */}
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm ${stat.colorClass} flex items-center gap-1.5`}>
              <span className={`w-1.5 h-1.5 rounded-full ${stat.dotColor}`} />
              {stat.label}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          
          {/* Location line */}
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{property.location.district}, {property.location.city}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-numbers text-slate-600">{property.specs.certificate}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectDetail(property)}
            className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1 mb-1"
          >
            {property.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-1 mb-3">
            {property.clusterOrHousingName}
          </p>

          {/* Specific Tagline for Category */}
          {property.category === 'subsidi' && property.subsidiData && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50/80 px-2 py-1 rounded mb-3 border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate font-medium">Bunga KPR FLPP 5% Flat s/d 20 Thn</span>
            </div>
          )}

          {property.category === 'recycle' && property.recycleData && (
            <div className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50/90 px-2 py-1 rounded mb-3 border border-amber-200">
              <RefreshCw className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="truncate font-medium">
                Over Notaris {property.recycleData.bankAsal} · Sisa {(property.recycleData.sisaTenorBulan / 12).toFixed(0)} Thn
              </span>
            </div>
          )}

          {property.category === 'komersil' && (
            <div className="flex items-center gap-1.5 text-xs text-indigo-900 bg-indigo-50/80 px-2 py-1 rounded mb-3 border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate font-medium">One Gate System · Row {property.specs.roadWidth}</span>
            </div>
          )}

          {/* Specs Row */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-lg text-xs text-slate-700 mb-3 border border-slate-100 font-mono-numbers">
            <div className="flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.specs.buildingArea}/{property.specs.surfaceArea} m²</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.specs.bedrooms} KT</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.specs.bathrooms} KM</span>
            </div>
          </div>

          {/* Price & Installment */}
          <div className="pt-1">
            <div className="text-xs text-slate-500 font-medium">Harga Cash / Akad</div>
            <div className="text-lg font-bold text-slate-900 font-mono-numbers">
              {formatRupiah(property.price)}
            </div>

            <div className="flex items-center justify-between text-xs mt-1 text-slate-600">
              <span>
                Cicilan: <strong className="text-slate-900 font-mono-numbers">{formatRupiahShort(property.installmentPerMonth)}</strong>/bln
              </span>
              <span>
                DP: <strong className="text-slate-800 font-mono-numbers">{formatRupiahShort(property.downPayment)}</strong>
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 pt-0 sm:p-5 sm:pt-0">
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          
          {/* Detail Button */}
          <button
            onClick={() => onSelectDetail(property)}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <span>Detail & 7 Foto</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsApp}
            title="Tanya unit via WhatsApp Marketing"
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tanya Sales</span>
          </button>

          {/* Admin-Only Status Changer */}
          {isAdmin && (
            <select
              value={property.status}
              onChange={(e) => onUpdateStatus(property.id, e.target.value as PropertyStatus)}
              onClick={(e) => e.stopPropagation()}
              title="Ubah Status Kavling (Khusus Admin)"
              className="text-[11px] font-medium bg-white border border-slate-300 rounded-lg px-2 py-2 text-slate-700 focus:outline-none hover:border-slate-400"
            >
              <option value="tersedia">Ready Stock</option>
              <option value="booking">Booking</option>
              <option value="proses_kpr">Proses KPR</option>
              <option value="terjual">Terjual</option>
              <option value="renovasi">Renovasi</option>
            </select>
          )}

        </div>
      </div>

    </div>
  );
};
