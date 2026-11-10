import React from 'react';
import { PropertyUnit, PropertyStatus, KprStage } from '../types/property';
import { formatRupiah, getCategoryBadge, getStatusBadge } from '../utils/formatters';
import { FileCheck, User, Phone, CheckCircle2, Clock, ChevronRight, MessageSquare, Eye } from 'lucide-react';
import { generateWhatsAppMessage } from '../utils/kprCalculator';

interface KprPipelineViewProps {
  properties: PropertyUnit[];
  isAdmin?: boolean;
  onSelectDetail: (property: PropertyUnit) => void;
  onUpdateLeadStage: (unitId: string, newStage: KprStage) => void;
}

const STAGES: Array<{
  id: 'pemberkasan' | 'slik_checking' | 'wawancara_bank' | 'sp3k_turun' | 'akad_kredit';
  title: string;
  badge: string;
  desc: string;
}> = [
  { id: 'pemberkasan', title: '1. Pemberkasan', badge: 'bg-slate-100 text-slate-700', desc: 'KTP, KK, NPWP, Slip Gaji' },
  { id: 'slik_checking', title: '2. BI Checking', badge: 'bg-blue-50 text-blue-700 border border-blue-200', desc: 'Verifikasi SLIK OJK' },
  { id: 'wawancara_bank', title: '3. Wawancara Bank', badge: 'bg-amber-50 text-amber-700 border border-amber-200', desc: 'Interview Analis KPR' },
  { id: 'sp3k_turun', title: '4. SP3K Terbit', badge: 'bg-indigo-50 text-indigo-700 border border-indigo-200', desc: 'Plafond Disetujui Bank' },
  { id: 'akad_kredit', title: '5. Siap Akad', badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200', desc: 'Ttd Notaris & Serah Kunci' },
];

export const KprPipelineView: React.FC<KprPipelineViewProps> = ({
  properties,
  isAdmin = false,
  onSelectDetail,
  onUpdateLeadStage,
}) => {
  // Filter only units that have a buyer lead or are in booking/proses_kpr
  const pipelineUnits = properties.filter(p => p.buyerLead);

  const handleWhatsApp = (property: PropertyUnit) => {
    const encoded = generateWhatsAppMessage(property);
    const waUrl = `https://wa.me/${property.marketingContact.whatsapp}?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-xs font-semibold text-slate-700 mb-2">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Pipeline CRM & Pengajuan KPR Perbankan</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Monitoring Status Berkas Konsumen
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Pantau alur kelengkapan berkas pemohon KPR mulai dari BI Checking hingga tahap Akad Notaris.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono-numbers text-slate-900">
              {pipelineUnits.length}
            </span>
            <span className="text-xs text-slate-500 block">Unit Terbooking</span>
          </div>
        </div>
      </div>

      {/* 5 Stage Kanban-Style Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {STAGES.map((stage) => {
          const unitsInStage = pipelineUnits.filter(u => u.buyerLead?.kprStage === stage.id);

          return (
            <div key={stage.id} className="bg-slate-50/80 rounded-xl border border-slate-200 p-3.5 flex flex-col min-h-[420px]">
              
              {/* Stage Header */}
              <div className="mb-3 pb-2.5 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${stage.badge}`}>
                    {stage.title}
                  </span>
                  <span className="text-xs font-mono-numbers font-bold text-slate-600">
                    {unitsInStage.length}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{stage.desc}</p>
              </div>

              {/* Cards inside this stage */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {unitsInStage.map((unit) => {
                  const cat = getCategoryBadge(unit.category);

                  return (
                    <div
                      key={unit.id}
                      className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onSelectDetail(unit)}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-mono-numbers font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                          {unit.blockNumber}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${cat.tagClass}`}>
                          {cat.label}
                        </span>
                      </div>

                      <div className="font-bold text-xs text-slate-900 line-clamp-1">
                        {unit.title}
                      </div>

                      {/* Buyer Details */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800 truncate">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{unit.buyerLead?.buyerName}</span>
                        </div>
                        {unit.buyerLead?.buyerPhone && (
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="font-mono-numbers">{unit.buyerLead.buyerPhone}</span>
                          </div>
                        )}
                        {unit.buyerLead?.notes && (
                          <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-1.5 rounded mt-1 italic">
                            "{unit.buyerLead.notes}"
                          </p>
                        )}
                      </div>

                      {/* Advance Stage Selector (Admin Only) */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                        {isAdmin ? (
                          <select
                            value={unit.buyerLead?.kprStage}
                            onChange={(e) => onUpdateLeadStage(unit.id, e.target.value as any)}
                            title="Ubah Tahap KPR (Khusus Admin)"
                            className="text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-700"
                          >
                            <option value="pemberkasan">1. Pemberkasan</option>
                            <option value="slik_checking">2. BI Checking</option>
                            <option value="wawancara_bank">3. Wawancara</option>
                            <option value="sp3k_turun">4. SP3K Terbit</option>
                            <option value="akad_kredit">5. Siap Akad</option>
                          </select>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-medium">
                            Status: <strong className="text-slate-800">{stage.title}</strong>
                          </span>
                        )}

                        <button
                          onClick={() => handleWhatsApp(unit)}
                          title="Hubungi Sales WhatsApp"
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  );
                })}

                {unitsInStage.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[11px] text-slate-400 p-3 text-center">
                    Belum ada berkas pada tahap ini
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
