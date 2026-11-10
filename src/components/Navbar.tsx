import React from 'react';
import { Home, Layers, FileCheck, Plus, Download, RotateCcw, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: 'catalog' | 'table' | 'pipeline';
  setActiveTab: (tab: 'catalog' | 'table' | 'pipeline') => void;
  onOpenAddModal: () => void;
  onExportCsv: () => void;
  onResetData: () => void;
  totalUnits: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onExportCsv,
  onResetData,
  totalUnits,
}) => {
  const { currentUser, isAdmin, logout, openLoginModal } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Brand title */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/assets/aistudio/logo_kyan_797e1a08.jpg"
              alt="KYAN Property Logo"
              className="w-10 h-10 rounded-full object-cover shadow-sm border border-emerald-500/30 bg-white"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                  KYAN PROPERTY
                </span>
                <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {totalUnits} Unit
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Contractor & Agency Property · Subsidi · Komersil · Recycle
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === 'catalog'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Katalog Unit</span>
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === 'table'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Stok Kavling</span>
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === 'pipeline'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Monitoring KPR</span>
            </button>
          </nav>

          {/* Zone 3: Primary Actions & User Auth */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Export CSV is available to both */}
            <button
              onClick={onExportCsv}
              title="Unduh Data Inventory format CSV / Excel"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>

            {/* Reset Data - Admin Only */}
            {isAdmin && (
              <button
                onClick={onResetData}
                title="Reset ke data awal demo (Khusus Admin)"
                className="hidden sm:block p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Tambah Unit - ONLY ADMIN CAN SEE AND CLICK */}
            {isAdmin && (
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Unit</span>
              </button>
            )}

            {/* User Account / Login Status */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div
                  onClick={openLoginModal}
                  className="cursor-pointer flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                  title="Klik untuk membuka menu akun"
                >
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white bg-slate-900">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-semibold text-slate-900 line-clamp-1 leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Keluar dari akun"
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Akun</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'catalog' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Katalog Properti
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'table' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Stok Kavling
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'pipeline' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Berkas KPR
          </button>
        </div>

      </div>
    </header>
  );
};
