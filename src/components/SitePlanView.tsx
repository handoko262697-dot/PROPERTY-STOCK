import React, { useState, useRef } from 'react';
import { PropertyUnit, PropertyStatus, SitePlanMarker } from '../types/property';
import { DEFAULT_SITE_PLAN_IMAGE } from '../data/initialProperties';
import { formatRupiah, getStatusBadge } from '../utils/formatters';
import { 
  Map, ZoomIn, ZoomOut, RotateCcw, Pin, Upload, Crosshair, 
  Eye, Check, Search, Trash2, Move, Sparkles, Plus, AlertCircle,
  HelpCircle, ArrowRight
} from 'lucide-react';

interface SitePlanViewProps {
  properties: PropertyUnit[];
  isAdmin?: boolean;
  onSelectProperty: (property: PropertyUnit) => void;
  onUpdatePropertyMarker: (unitId: string, marker: SitePlanMarker | undefined, customImage?: string) => void;
}

export const SitePlanView: React.FC<SitePlanViewProps> = ({
  properties,
  isAdmin = false,
  onSelectProperty,
  onUpdatePropertyMarker,
}) => {
  // Master image: check if properties have a common site plan image or use default
  const masterImageFromProps = properties.find(p => p.sitePlanImage)?.sitePlanImage || DEFAULT_SITE_PLAN_IMAGE;
  const [masterImage, setMasterImage] = useState<string>(masterImageFromProps);
  const [zoom, setZoom] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | PropertyStatus>('all');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [searchBlockQuery, setSearchBlockQuery] = useState('');
  
  // Active targeting state: which unit is currently being pinned by clicking on the map
  const [activePinUnitId, setActivePinUnitId] = useState<string | null>(null);
  const [hoveredUnit, setHoveredUnit] = useState<PropertyUnit | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<PropertyUnit | null>(null);
  
  // Quick popup when clicking on empty map spot without a pre-selected unit
  const [clickCoords, setClickCoords] = useState<{ x: number; y: number } | null>(null);
  const [isClickPopupOpen, setIsClickPopupOpen] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clusters list
  const clusters = Array.from(new Set(properties.map(p => p.clusterOrHousingName))).filter(Boolean);

  // Filtered units
  const filteredProperties = properties.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (selectedCluster !== 'all' && p.clusterOrHousingName !== selectedCluster) return false;
    if (searchBlockQuery.trim()) {
      const q = searchBlockQuery.toLowerCase();
      const matchBlock = p.blockNumber.toLowerCase().includes(q);
      const matchTitle = p.title.toLowerCase().includes(q);
      if (!matchBlock && !matchTitle) return false;
    }
    return true;
  });

  // KPI stats
  const totalPinned = properties.filter(p => p.sitePlanMarker).length;
  const totalUnpinned = properties.length - totalPinned;
  const totalReady = properties.filter(p => p.status === 'tersedia').length;
  const totalBooking = properties.filter(p => p.status === 'booking').length;
  const totalKpr = properties.filter(p => p.status === 'proses_kpr').length;
  const totalTerjual = properties.filter(p => p.status === 'terjual').length;

  const activeUnit = properties.find(p => p.id === activePinUnitId);

  // Upload custom site plan image
  const handleUploadMasterSitePlan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setMasterImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Precise click handler on site plan image
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const img = imgRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check bounds within actual image
    if (clickX < 0 || clickX > rect.width || clickY < 0 || clickY > rect.height) return;

    const xPct = Math.round((clickX / rect.width) * 1000) / 10;
    const yPct = Math.round((clickY / rect.height) * 1000) / 10;
    const boundedX = Math.max(1, Math.min(99, xPct));
    const boundedY = Math.max(1, Math.min(99, yPct));

    // Case 1: An active unit is selected for pinning -> Drop pin immediately!
    if (activePinUnitId) {
      const targetUnit = properties.find(p => p.id === activePinUnitId);
      if (targetUnit) {
        const marker: SitePlanMarker = {
          x: boundedX,
          y: boundedY,
          label: targetUnit.blockNumber,
        };
        onUpdatePropertyMarker(activePinUnitId, marker, masterImage);

        // Auto advance to next unpinned unit if any
        const nextUnpinned = properties.find(p => p.id !== activePinUnitId && !p.sitePlanMarker);
        if (nextUnpinned) {
          setActivePinUnitId(nextUnpinned.id);
        } else {
          setActivePinUnitId(null);
        }
      }
      return;
    }

    // Case 2: No active unit selected -> Open quick assign popup at this coordinate
    setClickCoords({ x: boundedX, y: boundedY });
    setIsClickPopupOpen(true);
  };

  // Assign chosen unit from popup to the clicked coordinates
  const handleAssignUnitAtCoords = (unitId: string) => {
    if (!clickCoords) return;
    const unit = properties.find(p => p.id === unitId);
    if (unit) {
      const marker: SitePlanMarker = {
        x: clickCoords.x,
        y: clickCoords.y,
        label: unit.blockNumber,
      };
      onUpdatePropertyMarker(unitId, marker, masterImage);
    }
    setIsClickPopupOpen(false);
    setClickCoords(null);
  };

  // Auto-pin all remaining unpinned units with distributed positions
  const handleAutoPinAllBlocks = () => {
    if (!confirm(`Tandai otomatis semua ${totalUnpinned} kavling yang belum memiliki tanda pada denah?`)) {
      return;
    }

    // Distribute unpinned blocks in a clean grid layout
    const unpinned = properties.filter(p => !p.sitePlanMarker);
    const startX = 25;
    const startY = 25;
    const stepX = 12;
    const stepY = 15;

    unpinned.forEach((unit, idx) => {
      const row = Math.floor(idx / 5);
      const col = idx % 5;
      const marker: SitePlanMarker = {
        x: Math.round((startX + (col * stepX)) * 10) / 10,
        y: Math.round((startY + (row * stepY)) * 10) / 10,
        label: unit.blockNumber,
      };
      onUpdatePropertyMarker(unit.id, marker, masterImage);
    });
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner & Summary */}
      <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Sistem Penandaan Kavling Site Plan Terintegrasi</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Denah Kavling & Posisi Semua Blok ({properties.length} Unit)</span>
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Klik tombol <strong>"Titikkan di Denah"</strong> pada blok yang diinginkan, lalu klik di mana saja pada gambar denah untuk meletakkan tanda.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Zoom Controls */}
            <div className="inline-flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 shadow-xs">
              <button
                type="button"
                onClick={() => setZoom(prev => Math.max(0.75, prev - 0.25))}
                title="Zoom Out"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-semibold px-2 text-emerald-300">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom(prev => Math.min(2.5, prev + 0.25))}
                title="Zoom In"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {zoom !== 1 && (
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  title="Reset Zoom"
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded border-l border-slate-700"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Admin Upload Master Image */}
            {isAdmin && (
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ganti Foto Denah</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadMasterSitePlan}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Filter and Status Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3">
          
          {/* Status Buttons Filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] mr-1">Status:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Semua ({properties.length})
            </button>
            <button
              onClick={() => setStatusFilter('tersedia')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
                statusFilter === 'tersedia'
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/60'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Ready ({totalReady})</span>
            </button>
            <button
              onClick={() => setStatusFilter('booking')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
                statusFilter === 'booking'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-amber-950/60 text-amber-300 hover:bg-amber-900/60 border border-amber-800/60'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Booking ({totalBooking})</span>
            </button>
            <button
              onClick={() => setStatusFilter('proses_kpr')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
                statusFilter === 'proses_kpr'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-blue-950/60 text-blue-300 hover:bg-blue-900/60 border border-blue-800/60'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>Proses KPR ({totalKpr})</span>
            </button>
            <button
              onClick={() => setStatusFilter('terjual')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
                statusFilter === 'terjual'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-rose-950/60 text-rose-300 hover:bg-rose-900/60 border border-rose-800/60'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Terjual ({totalTerjual})</span>
            </button>
          </div>

          {/* Quick Progress Badge */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Progres Penandaan:</span>
            <span className="font-mono-numbers font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px]">
              {totalPinned} / {properties.length} Ditandai ({Math.round((totalPinned / properties.length) * 100)}%)
            </span>
          </div>
        </div>

        {/* ACTIVE PINNING BANNER */}
        {activeUnit && (
          <div className="mt-4 p-3.5 bg-emerald-500 text-slate-950 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg animate-pulse">
            <div className="flex items-center gap-2.5">
              <Crosshair className="w-5 h-5 text-slate-950 shrink-0" />
              <div>
                <span className="font-extrabold text-sm block">
                  🎯 MODE MENITIKKAN AKTIF: Klik pada gambar denah di lokasi [{activeUnit.blockNumber}]
                </span>
                <span className="text-xs font-medium text-slate-900 block">
                  {activeUnit.title} · {formatRupiah(activeUnit.price)} · Status: {activeUnit.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActivePinUnitId(null)}
                className="px-3 py-1 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm"
              >
                Batalkan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Split Layout: Map on the Left, Block Panel on the Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT / CENTER: THE INTERACTIVE SITE PLAN CANVAS */}
        <div className="lg:col-span-8 space-y-3">
          <div 
            ref={containerRef}
            className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 sm:p-4 shadow-2xl"
          >
            {/* Scrollable image viewport */}
            <div className="overflow-auto max-h-[680px] rounded-xl flex items-center justify-center">
              <div
                onClick={handleImageClick}
                className={`relative inline-block mx-auto transition-transform duration-200 origin-center ${
                  activePinUnitId ? 'cursor-crosshair' : 'cursor-pointer'
                }`}
                style={{ transform: `scale(${zoom})` }}
              >
                <img
                  ref={imgRef}
                  src={masterImage}
                  alt="Site Plan Perumahan KYAN Property"
                  className="block w-full h-auto select-none rounded-lg shadow-lg pointer-events-auto"
                  style={{ minWidth: '700px' }}
                />

                {/* Overlaid Markers for all units */}
                {filteredProperties.map(unit => {
                  if (!unit.sitePlanMarker) return null;
                  const isSelected = selectedUnit?.id === unit.id;
                  const isHovered = hoveredUnit?.id === unit.id;
                  const isCurrentlyTargeted = activePinUnitId === unit.id;
                  const stat = getStatusBadge(unit.status);

                  // Color based on status
                  const markerBg = unit.status === 'tersedia'
                    ? 'bg-emerald-500'
                    : unit.status === 'booking'
                    ? 'bg-amber-500'
                    : unit.status === 'proses_kpr'
                    ? 'bg-blue-600'
                    : 'bg-rose-600';

                  const ringBorder = unit.status === 'tersedia'
                    ? 'border-emerald-300'
                    : unit.status === 'booking'
                    ? 'border-amber-300'
                    : unit.status === 'proses_kpr'
                    ? 'border-blue-300'
                    : 'border-rose-300';

                  return (
                    <div
                      key={unit.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activePinUnitId) {
                          // If another unit was targeted, switch target
                          setActivePinUnitId(unit.id);
                        } else {
                          setSelectedUnit(selectedUnit?.id === unit.id ? null : unit);
                        }
                      }}
                      onMouseEnter={() => setHoveredUnit(unit)}
                      onMouseLeave={() => setHoveredUnit(null)}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-115 z-20 group ${
                        isCurrentlyTargeted ? 'scale-125 z-30' : ''
                      }`}
                      style={{
                        left: `${unit.sitePlanMarker.x}%`,
                        top: `${unit.sitePlanMarker.y}%`
                      }}
                    >
                      {/* Radar Sonar Ping Wave */}
                      {(unit.status === 'tersedia' || isSelected || isCurrentlyTargeted) && (
                        <span className={`absolute w-8 h-8 rounded-full ${unit.status === 'tersedia' ? 'bg-emerald-400/35' : 'bg-rose-400/40'} animate-ping`} />
                      )}

                      {/* Marker Label Badge */}
                      <div className={`px-2 py-0.5 rounded-md font-black text-[10px] sm:text-[11px] text-white border ${ringBorder} shadow-xl whitespace-nowrap flex items-center gap-1 bg-slate-900/95 backdrop-blur-xs transition-all ${
                        isSelected || isCurrentlyTargeted ? 'ring-2 ring-white scale-105' : ''
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${markerBg} shrink-0`} />
                        <span className="font-mono-numbers">{unit.sitePlanMarker.label || unit.blockNumber}</span>
                      </div>

                      {/* Pin Icon */}
                      <div className={`w-4 h-4 rounded-full mx-auto -mt-1 ${markerBg} border-2 border-white shadow-md flex items-center justify-center text-white`}>
                        <Pin className="w-2 h-2 fill-white" />
                      </div>

                      {/* Tooltip Card on Hover/Selected */}
                      {(isHovered || isSelected) && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900/95 backdrop-blur-md rounded-xl p-3 border border-slate-700 text-white shadow-2xl z-40 animate-in fade-in zoom-in-95 pointer-events-auto"
                        >
                          <div className="flex items-start gap-2.5">
                            <img
                              src={unit.image}
                              alt={unit.title}
                              className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-700"
                            />
                            <div className="flex-1 min-w-0 text-left">
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded inline-block mb-1 ${stat.colorClass}`}>
                                {stat.label}
                              </span>
                              <h4 className="font-bold text-xs text-white truncate">
                                {unit.blockNumber}
                              </h4>
                              <p className="text-[11px] text-slate-300 truncate">
                                {unit.title}
                              </p>
                              <div className="font-mono-numbers text-xs font-bold text-emerald-400 mt-1">
                                {formatRupiah(unit.price)}
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => setActivePinUnitId(unit.id)}
                              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                            >
                              <Move className="w-3 h-3" />
                              <span>Pindah Titik</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectProperty(unit)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Detail</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instruction Footer Bar */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-[11px]">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {activePinUnitId 
                    ? `Sedang menitikkan kavling [${activeUnit?.blockNumber}]. Klik pada lokasi di gambar denah.`
                    : 'Klik tombol "Titikkan di Denah" pada daftar blok di sebelah kanan untuk menandai kavling.'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px]">Ready</span>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-[11px]">Booking</span>
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-[11px]">KPR</span>
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <span className="text-[11px]">Terjual</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: DAFTAR SEMUA BLOK KAVLING (TOTAL BLOK) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-md space-y-3">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Map className="w-4 h-4 text-emerald-600" />
                  <span>Daftar Total Blok ({properties.length} Kavling)</span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  Pilih kavling untuk menitikkan atau mengubah posisi tanda
                </span>
              </div>

              {totalUnpinned > 0 && isAdmin && (
                <button
                  type="button"
                  onClick={handleAutoPinAllBlocks}
                  title="Otomatis berikan tanda awal untuk semua blok yang belum ditandai"
                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md text-[11px] font-bold border border-emerald-200 transition-colors"
                >
                  Tandai Otomatis
                </button>
              )}
            </div>

            {/* Search Input for Blocks */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nomor blok (e.g. B3, A1, D1)..."
                value={searchBlockQuery}
                onChange={(e) => setSearchBlockQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* List of All Blocks */}
            <div className="overflow-y-auto max-h-[560px] space-y-2 pr-1">
              {filteredProperties.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  Tidak ada kavling yang sesuai dengan pencarian atau filter.
                </div>
              ) : (
                filteredProperties.map(unit => {
                  const isPinned = !!unit.sitePlanMarker;
                  const isTargeted = activePinUnitId === unit.id;
                  const stat = getStatusBadge(unit.status);

                  return (
                    <div
                      key={unit.id}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isTargeted
                          ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                          : isPinned
                          ? 'bg-white border-slate-200 hover:border-slate-300'
                          : 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono-numbers font-black text-xs text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {unit.blockNumber}
                            </span>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${stat.colorClass}`}>
                              {stat.label}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 truncate mt-0.5">
                            {unit.title}
                          </div>
                          <div className="font-mono-numbers text-[11px] font-bold text-slate-800">
                            {formatRupiah(unit.price)}
                          </div>
                        </div>

                        {/* Pinning Action Controls */}
                        <div className="shrink-0 flex flex-col items-end gap-1">
                          {isPinned ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setActivePinUnitId(unit.id)}
                                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                                  isTargeted
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                                title="Klik untuk memindahkan letak tanda di denah"
                              >
                                <Move className="w-3 h-3 text-emerald-600" />
                                <span>{isTargeted ? 'Memindahkan...' : 'Pindah Titik'}</span>
                              </button>
                              
                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={() => onUpdatePropertyMarker(unit.id, undefined)}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                                  title="Hapus tanda pin kavling ini"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setActivePinUnitId(unit.id)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1 transition-colors ${
                                isTargeted
                                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              }`}
                            >
                              <Pin className="w-3 h-3 fill-white" />
                              <span>{isTargeted ? 'Klik di Denah!' : 'Titikkan di Denah'}</span>
                            </button>
                          )}

                          {isPinned && (
                            <span className="text-[9px] font-mono text-emerald-700 flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5 text-emerald-600" />
                              <span>X: {unit.sitePlanMarker?.x}% Y: {unit.sitePlanMarker?.y}%</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

      </div>

      {/* QUICK ASSIGN POPUP (WHEN CLICKING DIRECTLY ON AN UNPINNED SPOT ON MAP) */}
      {isClickPopupOpen && clickCoords && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Pin className="w-4 h-4 text-emerald-600" />
                <span>Titikkan Kavling di Posisi Ini</span>
              </h3>
              <button
                onClick={() => setIsClickPopupOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Pilih blok kavling yang berada pada titik koordinat X: <strong>{clickCoords.x}%</strong>, Y: <strong>{clickCoords.y}%</strong>:
            </p>

            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
              {properties.map(p => {
                const stat = getStatusBadge(p.status);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleAssignUnitAtCoords(p.id)}
                    className="w-full text-left p-2 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 flex items-center justify-between gap-2 transition-colors text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 font-mono-numbers">{p.blockNumber}</span>
                      <span className="text-slate-500 text-[11px] block">{p.title}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${stat.colorClass}`}>
                        {stat.label}
                      </span>
                      {p.sitePlanMarker && (
                        <span className="text-[9px] text-slate-400 block mt-0.5">Sudah ditandai</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsClickPopupOpen(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
