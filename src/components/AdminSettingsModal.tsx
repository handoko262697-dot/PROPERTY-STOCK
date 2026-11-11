import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { PropertyUnit } from '../types/property';
import { UserRole } from '../types/auth';
import { 
  exportPropertiesToCSV, 
  parsePropertiesFromCSV, 
  downloadSampleCSV 
} from '../utils/dataTransfer';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Download, 
  Upload, 
  Users, 
  UserCheck, 
  UserX, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  ShieldCheck, 
  FileSpreadsheet, 
  ExternalLink,
  Save,
  Check,
  User,
  Clock,
  Sparkles
} from 'lucide-react';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: PropertyUnit[];
  onUpdateProperties: (updated: PropertyUnit[]) => void;
  salesSettings: {
    name: string;
    phone: string;
    whatsapp: string;
  };
  onUpdateSalesSettings: (newSettings: { name: string; phone: string; whatsapp: string }, applyToAllUnits: boolean) => void;
  showToast: (msg: string) => void;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  isOpen,
  onClose,
  properties,
  onUpdateProperties,
  salesSettings,
  onUpdateSalesSettings,
  showToast,
}) => {
  const { allUsers, pendingUsersCount, approveUser, rejectUser, deleteUser, changeUserRole, currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'sales' | 'data' | 'users'>('sales');

  // Sales Form State
  const [salesName, setSalesName] = useState(salesSettings.name);
  const [salesPhone, setSalesPhone] = useState(salesSettings.phone);
  const [salesWhatsapp, setSalesWhatsapp] = useState(salesSettings.whatsapp);
  const [applyToAllUnits, setApplyToAllUnits] = useState(true);

  // Data Import State
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [parsedPreview, setParsedPreview] = useState<PropertyUnit[] | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User Approval Filter State
  const [userFilter, setUserFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  if (!isOpen) return null;

  // Format WhatsApp number to standard (e.g., 0812 -> 62812)
  const sanitizeWhatsappNumber = (input: string) => {
    let cleaned = input.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    }
    return cleaned;
  };

  const handleSaveSales = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanWa = sanitizeWhatsappNumber(salesWhatsapp);
    onUpdateSalesSettings({
      name: salesName.trim(),
      phone: salesPhone.trim(),
      whatsapp: cleanWa,
    }, applyToAllUnits);
    showToast(
      applyToAllUnits
        ? 'Nomor sales diperbarui dan diterapkan ke seluruh unit properti!'
        : 'Nomor sales default diperbarui!'
    );
  };

  // Handle File Upload for Import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setImportError(null);
    setParsedPreview(null);
    setIsProcessingFile(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) {
        setImportError('File kosong atau tidak dapat dibaca.');
        setIsProcessingFile(false);
        return;
      }

      if (file.name.endsWith('.csv') || file.type.includes('csv') || file.type.includes('sheet') || file.name.endsWith('.txt')) {
        const res = parsePropertiesFromCSV(content, {
          name: salesName,
          phone: salesPhone,
          whatsapp: sanitizeWhatsappNumber(salesWhatsapp),
        });
        if (res.success && res.data) {
          setParsedPreview(res.data);
        } else {
          setImportError(res.error || 'Gagal membaca format CSV.');
        }
      } else {
        setImportError('Format file tidak didukung. Harap unggah file spreadsheet .csv.');
      }
      setIsProcessingFile(false);
    };

    reader.onerror = () => {
      setImportError('Terjadi kesalahan saat membaca file.');
      setIsProcessingFile(false);
    };

    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (!parsedPreview || parsedPreview.length === 0) return;

    if (importMode === 'replace') {
      if (confirm(`Anda yakin ingin MENGGANTIKAN seluruh ${properties.length} data properti yang ada dengan ${parsedPreview.length} data baru dari file?`)) {
        onUpdateProperties(parsedPreview);
        showToast(`Berhasil mengimpor ${parsedPreview.length} unit baru (Stok lama digantikan)!`);
        setImportFile(null);
        setParsedPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } else {
      // Merge mode: Add without duplicate IDs
      const existingIds = new Set(properties.map(p => p.id));
      const newItems = parsedPreview.map((item, idx) => {
        if (existingIds.has(item.id)) {
          return { ...item, id: `${item.id}-imp-${Date.now()}-${idx}` };
        }
        return item;
      });
      onUpdateProperties([...newItems, ...properties]);
      showToast(`Berhasil menambahkan ${newItems.length} unit properti ke inventory!`);
      setImportFile(null);
      setParsedPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Filtered Users
  const filteredUsers = allUsers.filter(u => {
    if (userFilter === 'all') return true;
    return u.status === userFilter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Pengaturan & Manajemen Sistem</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                  Khusus Admin
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Kontrol kontak sales pemasaran, ekspor/impor stok kavling, dan persetujuan akun pengguna
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6 text-xs font-semibold shrink-0 gap-2 pt-2">
          
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all ${
              activeTab === 'sales'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Ganti Nomor Sales</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all ${
              activeTab === 'data'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
            <span>Ekspor & Impor Data</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all relative ${
              activeTab === 'users'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span>Approval Akun User</span>
            {pendingUsersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold animate-pulse">
                {pendingUsersCount}
              </span>
            )}
          </button>

        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">

          {/* TAB 1: PENGATURAN NOMOR SALES */}
          {activeTab === 'sales' && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Konfigurasi Kontak Sales & Konsultan Pemasaran
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Nomor ini akan digunakan saat konsumen menekan tombol Hubungi Marketing atau Ajukan Minat via WhatsApp di seluruh halaman katalog dan detail kavling.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveSales} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nama Kontak Sales / Marketing
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Handoko / Tim Marketing KYAN Property"
                      value={salesName}
                      onChange={(e) => setSalesName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Nomor Telepon Kantor / Seluler
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="0812-8899-7711"
                        value={salesPhone}
                        onChange={(e) => setSalesPhone(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Nomor WhatsApp (Aktif)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="081288997711 atau 6281288997711"
                        value={salesWhatsapp}
                        onChange={(e) => setSalesWhatsapp(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50 focus:bg-white"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Format otomatis: {sanitizeWhatsappNumber(salesWhatsapp) || '-'}
                      </span>
                    </div>
                  </div>

                  {/* Apply to all properties checkbox */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="applyAll"
                        checked={applyToAllUnits}
                        onChange={(e) => setApplyToAllUnits(e.target.checked)}
                        className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
                      />
                      <label htmlFor="applyAll" className="font-medium text-slate-800 cursor-pointer">
                        Perbarui seluruh kontak WhatsApp di {properties.length} unit inventori saat ini
                      </label>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Direkomendasikan
                    </span>
                  </div>

                  {/* Live WhatsApp Test Button */}
                  <div className="flex items-center justify-between pt-2">
                    <a
                      href={`https://wa.me/${sanitizeWhatsappNumber(salesWhatsapp)}?text=${encodeURIComponent('Halo Marketing KYAN Property, saya ingin konsultasi stok kavling perumahan.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Uji Coba Kirim Pesan WhatsApp</span>
                    </a>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan Nomor</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Information Card */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Petunjuk Nomor Sales:</span>
                </div>
                <p>
                  Setiap penambahan unit baru berikutnya otomatis memakai nomor sales ini. Mengaktifkan opsi perbarui seluruh unit akan merefresh seluruh tombol WhatsApp pada kartu properti, tabel stok, dan rincian kavling.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: EKSPOR & IMPOR DATA INVENTORY */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              
              {/* SECTION A: EKSPOR DATA */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Download className="w-4 h-4 text-emerald-600" />
                      <span>Ekspor Data Inventory (Excel / Spreadsheet)</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Unduh seluruh stok kavling properti ({properties.length} unit) dalam format file spreadsheet CSV yang dapat dibuka langsung di Microsoft Excel atau Google Sheets.
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-1">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                        <span>Format CSV (Microsoft Excel / Google Sheets)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Tabel lengkap data kavling: Judul, Blok, Kategori, Harga, DP, Angsuran, Titik Lokasi Google Maps, Spesifikasi Lengkap, dan Kontak Sales.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        exportPropertiesToCSV(properties);
                        showToast('File CSV berhasil diunduh');
                      }}
                      className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh File CSV (.csv)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION B: IMPOR DATA */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-emerald-600" />
                      <span>Impor Data dari Spreadsheet CSV</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tambahkan unit kavling secara massal dari file spreadsheet CSV (Microsoft Excel).
                    </p>
                  </div>
                  <button
                    onClick={downloadSampleCSV}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:underline bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg"
                  >
                    <Download className="w-3 h-3" />
                    <span>Unduh Template CSV</span>
                  </button>
                </div>

                {/* Upload Zone */}
                <div className="mt-4 p-5 rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-500 bg-slate-50 text-center transition-colors">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="importFileInput"
                  />
                  <label htmlFor="importFileInput" className="cursor-pointer block">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-2 text-slate-600">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {importFile ? importFile.name : 'Klik untuk memilih file spreadsheet CSV (.csv)'}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Kompatibel dengan Microsoft Excel dan Google Sheets
                    </span>
                  </label>
                </div>

                {isProcessingFile && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-xs text-center animate-pulse">
                    Memproses dan memvalidasi baris data file...
                  </div>
                )}

                {importError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{importError}</span>
                  </div>
                )}

                {/* Parsed Preview and Execution Option */}
                {parsedPreview && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900">
                          File Valid: Terdeteksi {parsedPreview.length} Unit Kavling
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Ukuran: {(importFile?.size ? importFile.size / 1024 : 0).toFixed(1)} KB
                      </span>
                    </div>

                    {/* Mode Selection */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Pilih Metode Impor:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setImportMode('merge')}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            importMode === 'merge'
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-sm'
                              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div>+ Gabungkan (Merge)</div>
                          <span className="text-[10px] font-normal text-slate-500 block mt-0.5">
                            Menambahkan {parsedPreview.length} unit baru tanpa menghapus stok yang sudah ada.
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setImportMode('replace')}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            importMode === 'replace'
                              ? 'border-red-600 bg-red-50 text-red-900 font-bold shadow-sm'
                              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div>⚠ Gantikan Seluruhnya (Replace All)</div>
                          <span className="text-[10px] font-normal text-slate-500 block mt-0.5">
                            Menghapus seluruh {properties.length} stok saat ini dan menggantinya dengan data file ini.
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Preview Table of First 3 Items */}
                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden text-[11px]">
                      <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                        Pratinjau Contoh Unit yang Diimpor:
                      </div>
                      <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto">
                        {parsedPreview.slice(0, 4).map((p, i) => (
                          <div key={i} className="px-3 py-2 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-slate-900">{p.title}</span>
                              <span className="text-slate-500 ml-2">({p.blockNumber})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                {p.category}
                              </span>
                              <span className="font-semibold text-slate-900">
                                Rp {p.price.toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {parsedPreview.length > 4 && (
                        <div className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] text-center border-t border-slate-100">
                          ... dan {parsedPreview.length - 4} unit lainnya
                        </div>
                      )}
                    </div>

                    {/* Commit Button */}
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setImportFile(null);
                          setParsedPreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleExecuteImport}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Eksekusi Impor {parsedPreview.length} Unit Sekarang</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 3: APPROVAL AKUN USER */}
          {activeTab === 'users' && (
            <div className="space-y-5">
              
              {/* Header Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500">Total Akun Terdaftar</div>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">{allUsers.length}</div>
                </div>

                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200">
                  <div className="text-[11px] text-amber-800 font-medium">Menunggu Approval</div>
                  <div className="text-xl font-bold text-amber-900 mt-0.5 flex items-center gap-1.5">
                    <span>{pendingUsersCount}</span>
                    {pendingUsersCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold animate-pulse">
                        Perlu Tindakan
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
                  <div className="text-[11px] text-emerald-800 font-medium">Akun Disetujui</div>
                  <div className="text-xl font-bold text-emerald-900 mt-0.5">
                    {allUsers.filter(u => u.status === 'approved').length}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500">Akun Ditolak</div>
                  <div className="text-xl font-bold text-slate-700 mt-0.5">
                    {allUsers.filter(u => u.status === 'rejected').length}
                  </div>
                </div>

              </div>

              {/* User Filter Sub-tabs */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs font-medium">
                  <button
                    onClick={() => setUserFilter('all')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      userFilter === 'all' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua ({allUsers.length})
                  </button>
                  <button
                    onClick={() => setUserFilter('pending')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      userFilter === 'pending' ? 'bg-amber-500 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Menunggu Approval ({pendingUsersCount})
                  </button>
                  <button
                    onClick={() => setUserFilter('approved')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      userFilter === 'approved' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Disetujui ({allUsers.filter(u => u.status === 'approved').length})
                  </button>
                  <button
                    onClick={() => setUserFilter('rejected')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      userFilter === 'rejected' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Ditolak ({allUsers.filter(u => u.status === 'rejected').length})
                  </button>
                </div>

                <div className="text-[11px] text-slate-500">
                  Hanya akun dengan status <strong>Disetujui (Approved)</strong> yang dapat login ke aplikasi.
                </div>
              </div>

              {/* User Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Nama & Email Pengguna</th>
                        <th className="py-3 px-4">WhatsApp / Telp</th>
                        <th className="py-3 px-4">Peran (Role)</th>
                        <th className="py-3 px-4">Status Akun</th>
                        <th className="py-3 px-4">Waktu Daftar</th>
                        <th className="py-3 px-4 text-right">Aksi Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            Tidak ada akun dengan status ini.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => {
                          const isSelf = currentUser?.id === u.id;
                          return (
                            <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                              
                              {/* Name & Email */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                                    u.role === 'admin' ? 'bg-slate-900' : 'bg-emerald-600'
                                  }`}>
                                    {u.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                      <span>{u.name}</span>
                                      {isSelf && (
                                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1 rounded font-normal">
                                          (Anda)
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-slate-500 font-mono">
                                      {u.email}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Phone */}
                              <td className="py-3 px-4 font-mono text-slate-700">
                                {u.phone ? (
                                  <a 
                                    href={`https://wa.me/${u.phone.replace(/[^0-9]/g, '')}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-emerald-700 hover:underline flex items-center gap-1"
                                  >
                                    <span>{u.phone}</span>
                                  </a>
                                ) : (
                                  <span className="text-slate-400">-</span>
                                )}
                              </td>

                              {/* Role */}
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  u.role === 'admin'
                                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}>
                                  {u.role === 'admin' ? <ShieldCheck className="w-3 h-3 text-indigo-700" /> : <User className="w-3 h-3 text-slate-500" />}
                                  <span>{u.role}</span>
                                </span>
                              </td>

                              {/* Status */}
                              <td className="py-3 px-4">
                                {u.status === 'pending' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                                    <Clock className="w-3 h-3 text-amber-700" />
                                    <span>Menunggu Approval</span>
                                  </span>
                                ) : u.status === 'approved' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                    <span>Disetujui (Aktif)</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">
                                    <UserX className="w-3 h-3 text-red-700" />
                                    <span>Ditolak / Nonaktif</span>
                                  </span>
                                )}
                              </td>

                              {/* Registration date */}
                              <td className="py-3 px-4 text-slate-500 text-[11px]">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                }) : '-'}
                              </td>

                              {/* Admin Action Buttons */}
                              <td className="py-3 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  
                                  {/* Approve Button */}
                                  {u.status !== 'approved' && (
                                    <button
                                      onClick={() => {
                                        approveUser(u.id);
                                        showToast(`Akun ${u.name} berhasil disetujui (Approved)!`);
                                      }}
                                      className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors flex items-center gap-1"
                                      title="Setujui Akun Pengguna"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>Setujui</span>
                                    </button>
                                  )}

                                  {/* Reject Button */}
                                  {u.status !== 'rejected' && !isSelf && (
                                    <button
                                      onClick={() => {
                                        rejectUser(u.id);
                                        showToast(`Akun ${u.name} ditolak / dinonaktifkan.`);
                                      }}
                                      className="px-2 py-1 rounded bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-300 hover:border-red-300 font-semibold text-[11px] transition-colors flex items-center gap-1"
                                      title="Tolak Akun"
                                    >
                                      <UserX className="w-3 h-3" />
                                      <span>Tolak</span>
                                    </button>
                                  )}

                                  {/* Toggle Role Button */}
                                  {!isSelf && (
                                    <button
                                      onClick={() => {
                                        const newRole: UserRole = u.role === 'admin' ? 'user' : 'admin';
                                        changeUserRole(u.id, newRole);
                                        showToast(`Peran ${u.name} diubah menjadi ${newRole.toUpperCase()}`);
                                      }}
                                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium border border-slate-200 transition-colors"
                                      title={`Ubah peran menjadi ${u.role === 'admin' ? 'User' : 'Admin'}`}
                                    >
                                      {u.role === 'admin' ? 'Jadikan User' : 'Jadikan Admin'}
                                    </button>
                                  )}

                                  {/* Delete Button */}
                                  {!isSelf && (
                                    <button
                                      onClick={() => {
                                        if (confirm(`Hapus akun ${u.name} (${u.email}) secara permanen?`)) {
                                          deleteUser(u.id);
                                          showToast(`Akun ${u.name} telah dihapus.`);
                                        }
                                      }}
                                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                      title="Hapus Akun Pengguna"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                </div>
                              </td>

                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>KYAN PROPERTY APP · Panel Kontrol Administrasi</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
