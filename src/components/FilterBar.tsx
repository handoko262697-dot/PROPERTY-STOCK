import React from 'react';
import { PropertyFilterState, PropertyCategory, PropertyStatus } from '../types/property';
import { Search, MapPin, SlidersHorizontal, RotateCcw, Building, Check, ArrowUpDown } from 'lucide-react';
import { formatRupiahShort } from '../utils/formatters';

interface FilterBarProps {
  filter: PropertyFilterState;
  setFilter: React.Dispatch<React.SetStateAction<PropertyFilterState>>;
  availableCities: string[];
  availableDistricts: string[];
  totalMatches: number;
  totalUnits: number;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  setFilter,
  availableCities,
  availableDistricts,
  totalMatches,
  totalUnits,
  onReset,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  // Quick price preset handler
  const handleQuickPrice = (preset: PropertyFilterState['quickPriceRange']) => {
    let min: number | null = null;
    let max: number | null = null;

    if (preset === 'under200') {
      min = null;
      max = 200000000;
    } else if (preset === '200to500') {
      min = 200000000;
      max = 500000000;
    } else if (preset === '500to1000') {
      min = 500000000;
      max = 1000000000;
    } else if (preset === 'above1000') {
      min = 1000000000;
      max = null;
    }

    setFilter(prev => ({
      ...prev,
      quickPriceRange: preset,
      minPrice: min,
      maxPrice: max
    }));
  };

  const isFiltered =
    filter.searchQuery !== '' ||
    filter.category !== 'all' ||
    filter.city !== 'all' ||
    filter.district !== 'all' ||
    filter.status !== 'all' ||
    filter.quickPriceRange !== 'all' ||
    filter.minPrice !== null ||
    filter.maxPrice !== null ||
    filter.minBedrooms !== 'all';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-5 mb-6 space-y-4">
      
      {/* Row 1: Search & Main Category Segmented Control */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => setFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Cari nama perumahan, nomor blok (misal: B3), jalan, atau pengembang..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
          {filter.searchQuery && (
            <button
              onClick={() => setFilter(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto shrink-0">
          {[
            { id: 'all', label: 'Semua Kategori' },
            { id: 'subsidi', label: 'Subsidi (FLPP)' },
            { id: 'komersil', label: 'Komersil' },
            { id: 'recycle', label: 'Recycle / Takeover' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(prev => ({ ...prev, category: tab.id as PropertyFilterState['category'] }))}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                filter.category === tab.id
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Toggle Advanced Button */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors shrink-0 ${
            showAdvanced || isFiltered
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filter Lanjutan</span>
          {isFiltered && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>

      </div>

      {/* Row 2: Location Filter & Quick Price Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-slate-100 items-center">
        
        {/* Kota / Kabupaten Select */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>Wilayah / Kota</span>
          </label>
          <select
            value={filter.city}
            onChange={(e) => setFilter(prev => ({ ...prev, city: e.target.value, district: 'all' }))}
            className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">Semua Kota (Jabodetabek & Jabar)</option>
            {availableCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Kecamatan Select (Dynamically filtered by city if selected) */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Kecamatan / Area
          </label>
          <select
            value={filter.district}
            onChange={(e) => setFilter(prev => ({ ...prev, district: e.target.value }))}
            className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">Semua Area</option>
            {availableDistricts.map(dist => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>

        {/* Quick Price Range Presets */}
        <div className="md:col-span-6">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Rentang Harga Populer
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'under200', label: '< 200 Juta (Subsidi)' },
              { id: '200to500', label: '200 - 500 Jt' },
              { id: '500to1000', label: '500 Jt - 1 Miliar' },
              { id: 'above1000', label: '> 1 Miliar' },
            ].map(tier => (
              <button
                key={tier.id}
                onClick={() => handleQuickPrice(tier.id as PropertyFilterState['quickPriceRange'])}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
                  filter.quickPriceRange === tier.id
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Advanced Filter Collapse Panel */}
      {showAdvanced && (
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/80">
          
          {/* Custom Min Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Harga Minimum (Rp)
            </label>
            <input
              type="number"
              step={10000000}
              placeholder="e.g. 150000000"
              value={filter.minPrice ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : Number(e.target.value);
                setFilter(prev => ({ ...prev, minPrice: val, quickPriceRange: 'all' }));
              }}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-mono-numbers"
            />
            {filter.minPrice && (
              <span className="text-[11px] text-slate-500 font-mono-numbers mt-0.5 block">
                {formatRupiahShort(filter.minPrice)}
              </span>
            )}
          </div>

          {/* Custom Max Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Harga Maksimum (Rp)
            </label>
            <input
              type="number"
              step={10000000}
              placeholder="e.g. 800000000"
              value={filter.maxPrice ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : Number(e.target.value);
                setFilter(prev => ({ ...prev, maxPrice: val, quickPriceRange: 'all' }));
              }}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-mono-numbers"
            />
            {filter.maxPrice && (
              <span className="text-[11px] text-slate-500 font-mono-numbers mt-0.5 block">
                {formatRupiahShort(filter.maxPrice)}
              </span>
            )}
          </div>

          {/* Status Unit Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status Ketersediaan
            </label>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as PropertyFilterState['status'] }))}
              className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
            >
              <option value="all">Semua Status</option>
              <option value="tersedia">Ready Stock (Tersedia)</option>
              <option value="booking">Booking Fee</option>
              <option value="proses_kpr">Proses Berkas KPR</option>
              <option value="terjual">Terjual (Sold Out)</option>
              <option value="renovasi">Tahap Renovasi</option>
            </select>
          </div>

          {/* Minimal Kamar Tidur */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jumlah Kamar Tidur
            </label>
            <select
              value={filter.minBedrooms}
              onChange={(e) => setFilter(prev => ({ ...prev, minBedrooms: e.target.value === 'all' ? 'all' : Number(e.target.value) }))}
              className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
            >
              <option value="all">Semua Jumlah KT</option>
              <option value={2}>Minimal 2 Kamar</option>
              <option value={3}>Minimal 3 Kamar</option>
            </select>
          </div>

        </div>
      )}

      {/* Row 3: Active Status Bar & Sort Order */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500">
        
        {/* Results Count & Quick Location Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-slate-700">
            Ditemukan <strong className="text-slate-900 font-bold font-mono-numbers">{totalMatches}</strong> dari {totalUnits} unit kavling
          </span>

          {/* Quick city tag badges */}
          <div className="hidden sm:flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
            <span className="text-[11px] text-slate-400">Pilihan cepat:</span>
            {['Bogor', 'Bekasi', 'Tangerang', 'Depok'].map(city => (
              <button
                key={city}
                onClick={() => setFilter(prev => ({ ...prev, city: prev.city === city ? 'all' : city, district: 'all' }))}
                className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                  filter.city === city
                    ? 'bg-slate-800 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Sort & Reset Actions */}
        <div className="flex items-center gap-3 ml-auto">
          
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filter.sortBy}
              onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value as PropertyFilterState['sortBy'] }))}
              className="text-xs bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none"
            >
              <option value="terbaru">Paling Baru Diupdate</option>
              <option value="harga_asc">Harga Termurah (Subsidi First)</option>
              <option value="harga_desc">Harga Tertinggi (Komersil)</option>
              <option value="angsuran_asc">Cicilan Termurah / Bln</option>
              <option value="luas_tanah">Luas Tanah Terbesar</option>
            </select>
          </div>

          {isFiltered && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filter
            </button>
          )}

        </div>

      </div>

    </div>
  );
};
