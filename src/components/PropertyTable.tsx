import React from 'react';
import { PropertyUnit, PropertyStatus } from '../types/property';
import { formatRupiah, formatRupiahShort, getCategoryBadge, getStatusBadge, getKprStageLabel } from '../utils/formatters';
import { generateWhatsAppMessage } from '../utils/kprCalculator';
import { Eye, Edit3, Trash2, MessageSquare, User, ShieldCheck } from 'lucide-react';

interface PropertyTableProps {
  properties: PropertyUnit[];
  isAdmin?: boolean;
  onSelectDetail: (property: PropertyUnit) => void;
  onEditProperty: (property: PropertyUnit) => void;
  onDeleteProperty: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: PropertyStatus) => void;
}

export const PropertyTable: React.FC<PropertyTableProps> = ({
  properties,
  isAdmin = false,
  onSelectDetail,
  onEditProperty,
  onDeleteProperty,
  onUpdateStatus,
}) => {
  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500 text-sm">Tidak ada data unit yang cocok dengan filter yang dipilih.</p>
      </div>
    );
  }

  const handleWhatsApp = (property: PropertyUnit) => {
    const encoded = generateWhatsAppMessage(property);
    const waUrl = `https://wa.me/${property.marketingContact.whatsapp}?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Blok / No</th>
              <th className="py-3 px-4">Nama Perumahan & Kategori</th>
              <th className="py-3 px-4">Lokasi</th>
              <th className="py-3 px-3">Tipe (LB/LT)</th>
              <th className="py-3 px-4 text-right">Harga Cash</th>
              <th className="py-3 px-4 text-right">DP & Cicilan</th>
              <th className="py-3 px-4">Status Kavling</th>
              <th className="py-3 px-4">Calon Konsumen</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {properties.map((item) => {
              const cat = getCategoryBadge(item.category);
              const stat = getStatusBadge(item.status);

              return (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Blok / No Kavling */}
                  <td className="py-3.5 px-4 font-mono-numbers font-bold text-slate-900 whitespace-nowrap">
                    <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200">
                      {item.blockNumber}
                    </span>
                  </td>

                  {/* Nama Perumahan & Kategori */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 text-xs hover:text-indigo-600 cursor-pointer" onClick={() => onSelectDetail(item)}>
                      {item.title}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${cat.tagClass}`}>
                        {cat.label}
                      </span>
                      <span className="text-slate-400 font-mono-numbers text-[10px]">{item.specs.certificate}</span>
                    </div>
                  </td>

                  {/* Lokasi */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{item.location.city}</div>
                    <div className="text-slate-400 text-[11px]">{item.location.district}</div>
                  </td>

                  {/* Tipe LB/LT */}
                  <td className="py-3.5 px-3 font-mono-numbers whitespace-nowrap">
                    <div className="font-semibold text-slate-800">{item.specs.buildingArea} / {item.specs.surfaceArea} m²</div>
                    <div className="text-[11px] text-slate-500">{item.specs.bedrooms} KT · {item.specs.bathrooms} KM</div>
                  </td>

                  {/* Harga Cash */}
                  <td className="py-3.5 px-4 text-right font-mono-numbers whitespace-nowrap">
                    <div className="font-bold text-slate-900">{formatRupiah(item.price)}</div>
                    <div className="text-[10px] text-slate-400">Cash / Akad</div>
                  </td>

                  {/* DP & Cicilan */}
                  <td className="py-3.5 px-4 text-right font-mono-numbers whitespace-nowrap">
                    <div className="font-semibold text-slate-800">
                      {formatRupiahShort(item.installmentPerMonth)}<span className="text-[10px] text-slate-400 font-normal">/bln</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      DP: {formatRupiahShort(item.downPayment)}
                    </div>
                  </td>

                  {/* Status Kavling: Admin can change, User sees badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {isAdmin ? (
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value as PropertyStatus)}
                        className={`text-[11px] font-semibold rounded-lg px-2 py-1 border transition-colors cursor-pointer ${stat.colorClass}`}
                      >
                        <option value="tersedia">Ready Stock</option>
                        <option value="booking">Booking Fee</option>
                        <option value="proses_kpr">Proses KPR</option>
                        <option value="terjual">Terjual</option>
                        <option value="renovasi">Renovasi</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md ${stat.colorClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${stat.dotColor}`} />
                        {stat.label}
                      </span>
                    )}
                  </td>

                  {/* Calon Konsumen / Lead */}
                  <td className="py-3.5 px-4">
                    {item.buyerLead ? (
                      <div className="max-w-[160px]">
                        <div className="font-semibold text-slate-800 truncate flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.buyerLead.buyerName}</span>
                        </div>
                        <div className="text-[10px] text-blue-600 font-medium truncate">
                          {getKprStageLabel(item.buyerLead.kprStage)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">- Belum ada -</span>
                    )}
                  </td>

                  {/* Aksi: Admin gets Edit & Delete, User gets Detail & WA */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      
                      <button
                        onClick={() => onSelectDetail(item)}
                        title="Lihat Detail & 7 Galeri Foto"
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleWhatsApp(item)}
                        title="Kirim pesan WhatsApp"
                        className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onEditProperty(item)}
                            title="Edit Data Kavling (Khusus Admin)"
                            className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Hapus unit ${item.blockNumber} (${item.title}) dari inventory?`)) {
                                onDeleteProperty(item.id);
                              }
                            }}
                            title="Hapus Unit (Khusus Admin)"
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}

                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
