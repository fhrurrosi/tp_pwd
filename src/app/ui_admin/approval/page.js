"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Pastikan install sweetalert2

export default function HalamanPersetujuanAdmin() {
  const hariIni = new Date();
  const tahunSekarang = hariIni.getFullYear();
  const bulanSekarang = hariIni.getMonth();
  const pad = (n) => String(n).padStart(2, "0");

  // --- STATE ---
  const [bulanSaatIni, setBulanSaatIni] = useState(new Date(tahunSekarang, bulanSekarang, 1));
  
  // Default tanggal null supaya user memilih dulu, atau bisa di-set ke hari ini
  const [tanggalTerpilih, setTanggalTerpilih] = useState(hariIni.getDate());
  
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [listReservasi, setListReservasi] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- 1. FETCH DATA DARI API ---
  useEffect(() => {
    async function fetchData() {
      if (!tanggalTerpilih) return;

      setLoading(true);
      try {
        const year = bulanSaatIni.getFullYear();
        const month = pad(bulanSaatIni.getMonth() + 1);
        const day = pad(tanggalTerpilih);
        const dateStr = `${year}-${month}-${day}`;

        // Panggil API dengan filter tanggal
        const res = await fetch(`/api/admin/reservasi?date=${dateStr}`, {
           cache: 'no-store'
        });
        const result = await res.json();
        
        if (result.success) {
          setListReservasi(result.data);
        } else {
          setListReservasi([]);
        }

      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tanggalTerpilih, bulanSaatIni]); // Refresh saat tanggal/bulan ganti

  // --- 2. HANDLE APPROVE / REJECT ---
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch('/api/admin/reservasi', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (!res.ok) throw new Error("Gagal update");

      // Update State Lokal biar gak perlu refresh
      setListReservasi(prev => prev.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));

      setSelectedDetail(null); // Tutup modal
      
      Swal.fire({
        icon: 'success',
        title: `Berhasil diubah ke ${newStatus}`,
        timer: 1500,
        showConfirmButton: false
      });

    } catch (error) {
      Swal.fire('Error', 'Gagal mengubah status', 'error');
    }
  };


  // --- HELPER KALENDER ---
  const namaBulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const namaHari = ["M","S","S","R","K","J","S"];

  const dapatkanHariDalamBulan = (tanggal) => {
    const thn = tanggal.getFullYear();
    const bln = tanggal.getMonth();
    return {
      hariDalamBulan: new Date(thn, bln + 1, 0).getDate(),
      hariAwalMinggu: new Date(thn, bln, 1).getDay(),
    };
  };

  const { hariDalamBulan, hariAwalMinggu } = dapatkanHariDalamBulan(bulanSaatIni);
  const bulanSebelumnya = () => setBulanSaatIni(new Date(bulanSaatIni.getFullYear(), bulanSaatIni.getMonth() - 1, 1));
  const bulanBerikutnya = () => setBulanSaatIni(new Date(bulanSaatIni.getFullYear(), bulanSaatIni.getMonth() + 1, 1));

  const stringTanggalTerpilih = () => {
    if (!tanggalTerpilih) return "";
    return `${bulanSaatIni.getFullYear()}-${pad(bulanSaatIni.getMonth() + 1)}-${pad(tanggalTerpilih)}`;
  };

  // Helper untuk Link Dokumen Supabase
  const getDokumenUrl = (path) => {
    if (!path) return null;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/dokumen-peminjaman/${path}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-slate-900">Persetujuan Reservasi</h1>
        <p className="text-sm text-slate-500 mb-6">Kelola permintaan peminjaman ruangan masuk.</p>

        <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
          
          {/* --- KOLOM KIRI: KALENDER --- */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <button onClick={bulanSebelumnya} className="p-2 hover:bg-slate-100 rounded-full">
                   <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="font-bold text-slate-800">{namaBulan[bulanSaatIni.getMonth()]} {bulanSaatIni.getFullYear()}</div>
                <button onClick={bulanBerikutnya} className="p-2 hover:bg-slate-100 rounded-full">
                   <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {namaHari.map((h, i) => <div key={i} className="text-xs font-semibold text-slate-400 py-1">{h}</div>)}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: hariAwalMinggu }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: hariDalamBulan }).map((_, i) => {
                  const hari = i + 1;
                  const isSelected = tanggalTerpilih === hari;
                  return (
                    <button
                      key={hari}
                      onClick={() => setTanggalTerpilih(hari)}
                      className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {hari}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* --- KOLOM KANAN: LIST RESERVASI --- */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-semibold text-slate-800">
                  Daftar Pengajuan ({stringTanggalTerpilih()})
                </h2>
                <span className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600 font-medium">
                  Total: {listReservasi.length}
                </span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                  Loading data...
                </div>
              ) : listReservasi.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <p>Tidak ada pengajuan pada tanggal ini.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-6 py-3">Pemohon</th>
                        <th className="px-6 py-3">Ruangan</th>
                        <th className="px-6 py-3">Jam</th>
                        <th className="px-6 py-3 text-center">Status</th>
                        <th className="px-6 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {listReservasi.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">{item.user.nama}</div>
                            <div className="text-xs text-slate-500">{item.user.nimNip}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-700">
                            {item.ruangan.namaRuangan}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {item.ruangan.jamMulai} - {item.ruangan.jamSelesai}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                              item.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                              item.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700' // Pending
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => setSelectedDetail(item)}
                              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm hover:underline"
                            >
                              Detail & Proses
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL DETAIL --- */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedDetail(null)} />
          
          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all scale-100">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="font-bold text-slate-800 text-lg">Detail Pengajuan</h3>
               <button onClick={() => setSelectedDetail(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-6 space-y-4">
               {/* Info Grid */}
               <div className="grid grid-cols-3 gap-y-4 text-sm">
                  <div className="text-slate-500 font-medium">ID Reservasi</div>
                  <div className="col-span-2 text-slate-900">#{selectedDetail.id}</div>

                  <div className="text-slate-500 font-medium">Pemohon</div>
                  <div className="col-span-2">
                    <div className="font-semibold text-slate-900">{selectedDetail.user.nama}</div>
                    <div className="text-slate-500 text-xs">{selectedDetail.user.nimNip}</div>
                  </div>

                  <div className="text-slate-500 font-medium">Ruangan</div>
                  <div className="col-span-2 text-slate-900">{selectedDetail.ruangan.namaRuangan}</div>

                  <div className="text-slate-500 font-medium">Keperluan</div>
                  <div className="col-span-2 text-slate-900 bg-slate-50 p-2 rounded border border-slate-100">
                    {selectedDetail.keperluan}
                  </div>

                  <div className="text-slate-500 font-medium self-center">Dokumen</div>
                  <div className="col-span-2">
                    {selectedDetail.dokumenPath ? (
                      <a 
                        href={getDokumenUrl(selectedDetail.dokumenPath)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Lihat Lampiran
                      </a>
                    ) : (
                      <span className="text-slate-400 italic text-xs">Tidak ada lampiran</span>
                    )}
                  </div>
               </div>

               {/* Action Buttons */}
               <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button 
                    onClick={() => handleStatusChange(selectedDetail.id, 'Rejected')}
                    className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors"
                  >
                    Tolak Pengajuan
                  </button>
                  <button 
                    onClick={() => handleStatusChange(selectedDetail.id, 'Approved')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-colors"
                  >
                    Setujui Pengajuan
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}