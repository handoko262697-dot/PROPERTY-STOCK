import React, { useState, useEffect, useMemo } from 'react';
import { PropertyUnit, PropertyFilterState, PropertyStatus, KprStage } from './types/property';
import { INITIAL_PROPERTIES, SUBSIDI_GALLERY, KOMERSIL_GALLERY, RECYCLE_GALLERY } from './data/initialProperties';
import { exportPropertiesToCSV } from './utils/kprCalculator';
import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { FilterBar } from './components/FilterBar';
import { PropertyCard } from './components/PropertyCard';
import { PropertyTable } from './components/PropertyTable';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AddEditPropertyModal } from './components/AddEditPropertyModal';
import { KprPipelineView } from './components/KprPipelineView';
import { LoginModal } from './components/LoginModal';
import { LoginScreen } from './components/LoginScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LayoutGrid, Table, Plus, Info, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'kyan_property_inventory_data_v2';

function PropertyAppContent() {
  const { currentUser, isAdmin, openLoginModal } = useAuth();

  // 1. Data Store with LocalStorage Persistence
  const [properties, setProperties] = useState<PropertyUnit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: any) => {
            if (!p.gallery || p.gallery.length < 7) {
              const matchingSeed = INITIAL_PROPERTIES.find(init => init.id === p.id);
              if (matchingSeed) {
                return { ...p, gallery: matchingSeed.gallery };
              }
              const defaultGallery = p.category === 'komersil' 
                ? KOMERSIL_GALLERY 
                : p.category === 'recycle' 
                ? RECYCLE_GALLERY 
                : SUBSIDI_GALLERY;
              return { ...p, gallery: defaultGallery };
            }
            return p;
          });
        }
      }
    } catch (e) {
      console.error('Failed to parse saved properties', e);
    }
    return INITIAL_PROPERTIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [properties]);

  // 2. Navigation & Views State
  const [activeTab, setActiveTab] = useState<'catalog' | 'table' | 'pipeline'>('catalog');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // 3. Modals State
  const [selectedPropertyDetail, setSelectedPropertyDetail] = useState<PropertyUnit | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyUnit | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 4. Comprehensive Filter State
  const initialFilter: PropertyFilterState = {
    searchQuery: '',
    category: 'all',
    city: 'all',
    district: 'all',
    status: 'all',
    minPrice: null,
    maxPrice: null,
    quickPriceRange: 'all',
    minBedrooms: 'all',
    sortBy: 'terbaru',
  };

  const [filter, setFilter] = useState<PropertyFilterState>(initialFilter);

  // Extract available unique cities and districts
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    properties.forEach(p => {
      if (p.location.city) set.add(p.location.city);
    });
    return Array.from(set).sort();
  }, [properties]);

  const availableDistricts = useMemo(() => {
    const set = new Set<string>();
    properties.forEach(p => {
      if (filter.city === 'all' || p.location.city === filter.city) {
        if (p.location.district) set.add(p.location.district);
      }
    });
    return Array.from(set).sort();
  }, [properties, filter.city]);

  // 5. Filter & Sort Properties
  const filteredProperties = useMemo(() => {
    return properties.filter(item => {
      // Search query (title, cluster, block, address, developer)
      if (filter.searchQuery.trim() !== '') {
        const query = filter.searchQuery.toLowerCase();
        const matchesQuery =
          item.title.toLowerCase().includes(query) ||
          item.clusterOrHousingName.toLowerCase().includes(query) ||
          item.blockNumber.toLowerCase().includes(query) ||
          item.location.address.toLowerCase().includes(query) ||
          item.location.city.toLowerCase().includes(query) ||
          item.location.district.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Category filter
      if (filter.category !== 'all' && item.category !== filter.category) {
        return false;
      }

      // City filter
      if (filter.city !== 'all' && item.location.city.toLowerCase() !== filter.city.toLowerCase()) {
        return false;
      }

      // District filter
      if (filter.district !== 'all' && item.location.district.toLowerCase() !== filter.district.toLowerCase()) {
        return false;
      }

      // Status filter
      if (filter.status !== 'all' && item.status !== filter.status) {
        return false;
      }

      // Bedrooms filter
      if (filter.minBedrooms !== 'all' && item.specs.bedrooms < Number(filter.minBedrooms)) {
        return false;
      }

      // Min price filter
      if (filter.minPrice !== null && item.price < filter.minPrice) {
        return false;
      }

      // Max price filter
      if (filter.maxPrice !== null && item.price > filter.maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'terbaru') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (filter.sortBy === 'harga_asc') {
        return a.price - b.price;
      }
      if (filter.sortBy === 'harga_desc') {
        return b.price - a.price;
      }
      if (filter.sortBy === 'angsuran_asc') {
        return a.installmentPerMonth - b.installmentPerMonth;
      }
      if (filter.sortBy === 'luas_tanah') {
        return b.specs.surfaceArea - a.specs.surfaceArea;
      }
      return 0;
    });
  }, [properties, filter]);

  // 6. Action Handlers (CRUD & Status)
  const handleOpenAddModal = () => {
    if (!isAdmin) {
      showToast('Akses dibatasi: Hanya akun Admin yang dapat menambah unit baru.');
      openLoginModal();
      return;
    }
    setEditingProperty(null);
    setIsAddModalOpen(true);
  };

  const handleSaveProperty = (savedUnit: PropertyUnit) => {
    if (!isAdmin) {
      showToast('Akses dibatasi: Hanya akun Admin yang berwenang menyimpan perubahan unit.');
      return;
    }

    setProperties(prev => {
      const exists = prev.some(p => p.id === savedUnit.id);
      if (exists) {
        return prev.map(p => p.id === savedUnit.id ? savedUnit : p);
      } else {
        return [savedUnit, ...prev];
      }
    });

    if (selectedPropertyDetail && selectedPropertyDetail.id === savedUnit.id) {
      setSelectedPropertyDetail(savedUnit);
    }
    showToast(editingProperty ? 'Perubahan unit berhasil disimpan' : 'Unit baru berhasil ditambahkan ke inventory');
    setEditingProperty(null);
  };

  const handleDeleteProperty = (id: string) => {
    if (!isAdmin) {
      showToast('Hanya akun Admin yang dapat menghapus unit.');
      return;
    }
    setProperties(prev => prev.filter(p => p.id !== id));
    if (selectedPropertyDetail?.id === id) {
      setSelectedPropertyDetail(null);
    }
    showToast('Unit telah dihapus dari inventory');
  };

  const handleUpdateStatus = (id: string, newStatus: PropertyStatus) => {
    if (!isAdmin) {
      showToast('Hanya Admin yang dapat mengubah status unit.');
      return;
    }
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    if (selectedPropertyDetail?.id === id) {
      setSelectedPropertyDetail(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Status kavling berhasil diubah ke: ${newStatus.toUpperCase()}`);
  };

  const handleUpdateLead = (unitId: string, lead: PropertyUnit['buyerLead']) => {
    setProperties(prev => prev.map(p => {
      if (p.id === unitId) {
        return {
          ...p,
          buyerLead: lead,
          status: p.status === 'tersedia' ? 'booking' : p.status,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    if (selectedPropertyDetail?.id === unitId) {
      setSelectedPropertyDetail(prev => prev ? { ...prev, buyerLead: lead } : null);
    }
    showToast('Data peminat & status berkas KPR berhasil dicatat');
  };

  const handleUpdateLeadStage = (unitId: string, newStage: KprStage) => {
    if (!isAdmin) {
      showToast('Hanya Admin yang dapat mengubah progres tahapan KPR.');
      return;
    }
    setProperties(prev => prev.map(p => {
      if (p.id === unitId && p.buyerLead) {
        return {
          ...p,
          buyerLead: {
            ...p.buyerLead,
            kprStage: newStage
          },
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
    showToast('Tahap KPR berhasil diperbarui');
  };

  const handleResetData = () => {
    if (!isAdmin) {
      showToast('Hanya akun Admin yang berwenang mereset data.');
      return;
    }
    if (confirm('Reset seluruh inventory kembali ke data awal demo KYAN Property?')) {
      setProperties(INITIAL_PROPERTIES);
      localStorage.removeItem(STORAGE_KEY);
      setFilter(initialFilter);
      showToast('Data inventory telah direset ke default');
    }
  };

  const handleExportCsv = () => {
    exportPropertiesToCSV(filteredProperties);
    showToast('File CSV berhasil diunduh');
  };

  // Mandatory Initial Screen: Must log in first
  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-slate-900 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={handleOpenAddModal}
        onExportCsv={handleExportCsv}
        onResetData={handleResetData}
        totalUnits={properties.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: KATALOG PROPERTI (GRID VIEW) */}
        {activeTab === 'catalog' && (
          <div>
            {/* Banner Overview */}
            <StatsBanner
              properties={properties}
              activeCategory={filter.category}
              onSelectCategory={(cat) => setFilter(prev => ({ ...prev, category: cat }))}
            />

            {/* Filter Bar with Price and Location */}
            <FilterBar
              filter={filter}
              setFilter={setFilter}
              availableCities={availableCities}
              availableDistricts={availableDistricts}
              totalMatches={filteredProperties.length}
              totalUnits={properties.length}
              onReset={() => setFilter(initialFilter)}
            />

            {/* View Mode Switcher Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-xs">
                Daftar Kavling & Unit Perumahan ({filteredProperties.length})
              </h2>

              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  title="Tampilan Grid Kartu"
                  className={`p-1.5 rounded text-xs transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  title="Tampilan Tabel Stok Opname"
                  className={`p-1.5 rounded text-xs transition-colors ${
                    viewMode === 'table'
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Table className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid or Inline Table */}
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-6">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Info className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Tidak Ada Unit yang Cocok
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Coba ubah rentang harga atau pilih lokasi lain untuk melihat stok kavling yang tersedia.
                </p>
                <button
                  onClick={() => setFilter(initialFilter)}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isAdmin={isAdmin}
                    onSelectDetail={(prop) => setSelectedPropertyDetail(prop)}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            ) : (
              <PropertyTable
                properties={filteredProperties}
                isAdmin={isAdmin}
                onSelectDetail={(prop) => setSelectedPropertyDetail(prop)}
                onEditProperty={(prop) => {
                  setEditingProperty(prop);
                  setIsAddModalOpen(true);
                }}
                onDeleteProperty={handleDeleteProperty}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </div>
        )}

        {/* VIEW 2: STOK OPNAME KAVLING (DEDICATED TABLE VIEW) */}
        {activeTab === 'table' && (
          <div>
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Stok Opname Kavling Real Estate
                </h2>
                <p className="text-xs text-slate-500">
                  Tabel master data kavling untuk developer, marketing agen, dan legalitas berkas KPR.
                </p>
              </div>

              {isAdmin && (
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Kavling Baru (Admin)</span>
                </button>
              )}
            </div>

            <FilterBar
              filter={filter}
              setFilter={setFilter}
              availableCities={availableCities}
              availableDistricts={availableDistricts}
              totalMatches={filteredProperties.length}
              totalUnits={properties.length}
              onReset={() => setFilter(initialFilter)}
            />

            <PropertyTable
              properties={filteredProperties}
              isAdmin={isAdmin}
              onSelectDetail={(prop) => setSelectedPropertyDetail(prop)}
              onEditProperty={(prop) => {
                setEditingProperty(prop);
                setIsAddModalOpen(true);
              }}
              onDeleteProperty={handleDeleteProperty}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        )}

        {/* VIEW 3: MONITORING BERKAS KPR PIPELINE */}
        {activeTab === 'pipeline' && (
          <KprPipelineView
            properties={properties}
            isAdmin={isAdmin}
            onSelectDetail={(prop) => setSelectedPropertyDetail(prop)}
            onUpdateLeadStage={handleUpdateLeadStage}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/logo_kyan_797e1a08.jpg"
              alt="KYAN Property"
              className="w-7 h-7 rounded-full object-cover border border-emerald-500/30 bg-white"
            />
            <div>
              <span className="font-bold text-slate-900">KYAN PROPERTY APP</span>
              <span className="mx-1.5">·</span>
              <span>Contractor & Agency Property (Subsidi, Komersil & Recycle)</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} KYAN PROPERTY. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Property Detail Modal */}
      {selectedPropertyDetail && (
        <PropertyDetailModal
          property={selectedPropertyDetail}
          isAdmin={isAdmin}
          onClose={() => setSelectedPropertyDetail(null)}
          onUpdateLead={handleUpdateLead}
          onUpdateStatus={handleUpdateStatus}
          onOpenEdit={(prop) => {
            if (!isAdmin) {
              showToast('Hanya Admin yang dapat mengedit data unit');
              return;
            }
            setSelectedPropertyDetail(null);
            setEditingProperty(prop);
            setIsAddModalOpen(true);
          }}
        />
      )}

      {/* Add / Edit Property Modal - Restricted to Admin */}
      <AddEditPropertyModal
        isOpen={isAddModalOpen && isAdmin}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProperty(null);
        }}
        onSave={handleSaveProperty}
        editingProperty={editingProperty}
      />

      {/* Login & Register Modal */}
      <LoginModal />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PropertyAppContent />
    </AuthProvider>
  );
}
