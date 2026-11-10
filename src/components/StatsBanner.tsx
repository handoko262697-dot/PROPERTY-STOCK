import React from 'react';
import { PropertyUnit } from '../types/property';
import { formatRupiahShort } from '../utils/formatters';
import { Building2, ShieldCheck, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';

interface StatsBannerProps {
  properties: PropertyUnit[];
  onSelectCategory: (category: 'all' | 'subsidi' | 'komersil' | 'recycle') => void;
  activeCategory: string;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  properties,
  onSelectCategory,
  activeCategory,
}) => {
  const totalUnits = properties.length;
  const subsidiCount = properties.filter(p => p.category === 'subsidi').length;
  const komersilCount = properties.filter(p => p.category === 'komersil').length;
  const recycleCount = properties.filter(p => p.category === 'recycle').length;
  const availableCount = properties.filter(p => p.status === 'tersedia').length;
  const bookedOrKprCount = properties.filter(p => p.status === 'booking' || p.status === 'proses_kpr').length;
  
  const totalInventoryValue = properties.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-md border border-slate-800 mb-8">
      {/* Background Graphic / Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/kyan_property_banner_1794148348923.jpg"
          alt="KYAN Property Housing Development Estate"
          className="w-full h-full object-cover opacity-25"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950/70" />
      </div>

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 max-w-3xl mb-6">
          <img
            src="/assets/aistudio/logo_kyan_797e1a08.jpg"
            alt="KYAN Property"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-emerald-400/40 bg-white shadow-lg shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300 mb-2">
              <span className="font-semibold text-emerald-400">KYAN PROPERTY</span>
              <span>·</span>
              <span>Contractor & Agency Property</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              Inventory Perumahan Subsidi, Komersil & Recycle
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed">
              Kelola dan cari stok kavling rumah siap huni di Bogor, Bekasi, Tangerang, Cikarang & Bandung.
              Lengkap dengan dokumentasi 7 galeri foto per unit, skema over kredit notaris, dan filter harga lokasi akurat.
            </p>
          </div>
        </div>

        {/* 4 Interactive Category & KPI Blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-2 border-t border-slate-800/80">
          
          {/* Card 1: Subsidi FLPP */}
          <button
            onClick={() => onSelectCategory(activeCategory === 'subsidi' ? 'all' : 'subsidi')}
            className={`text-left p-3.5 rounded-xl border transition-all ${
              activeCategory === 'subsidi'
                ? 'bg-emerald-950/70 border-emerald-500/80 ring-2 ring-emerald-500/30'
                : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Subsidi (FLPP)
              </span>
              <span className="font-mono-numbers text-xs bg-emerald-900/50 px-1.5 py-0.5 rounded text-emerald-300">
                5% Fixed
              </span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-white font-mono-numbers">
              {subsidiCount} <span className="text-xs text-slate-400 font-normal">Unit</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 truncate">
              Mulai Rp 181 Jt · Cicilan Rp 1,1 Jt/bln
            </p>
          </button>

          {/* Card 2: Komersil Cluster */}
          <button
            onClick={() => onSelectCategory(activeCategory === 'komersil' ? 'all' : 'komersil')}
            className={`text-left p-3.5 rounded-xl border transition-all ${
              activeCategory === 'komersil'
                ? 'bg-indigo-950/70 border-indigo-500/80 ring-2 ring-indigo-500/30'
                : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Komersil (Cluster)
              </span>
              <span className="font-mono-numbers text-xs bg-indigo-900/50 px-1.5 py-0.5 rounded text-indigo-300">
                One Gate
              </span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-white font-mono-numbers">
              {komersilCount} <span className="text-xs text-slate-400 font-normal">Unit</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 truncate">
              Mulai Rp 520 Jt · Fasilitas Lengkap
            </p>
          </button>

          {/* Card 3: Recycle / Takeover */}
          <button
            onClick={() => onSelectCategory(activeCategory === 'recycle' ? 'all' : 'recycle')}
            className={`text-left p-3.5 rounded-xl border transition-all ${
              activeCategory === 'recycle'
                ? 'bg-amber-950/70 border-amber-500/80 ring-2 ring-amber-500/30'
                : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                Recycle & Rehab
              </span>
              <span className="font-mono-numbers text-xs bg-amber-900/50 px-1.5 py-0.5 rounded text-amber-300">
                Notaris
              </span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-white font-mono-numbers">
              {recycleCount} <span className="text-xs text-slate-400 font-normal">Unit</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 truncate">
              DP Over Mulai Rp 50 Jt · Siap Huni
            </p>
          </button>

          {/* Card 4: Total Aset & Ready Stock */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-300" />
                Stok Tersedia
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {availableCount} Ready
              </span>
            </div>
            <div className="text-lg md:text-xl font-bold text-white font-mono-numbers">
              {formatRupiahShort(totalInventoryValue)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {bookedOrKprCount} Unit dalam proses KPR/Booking
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
