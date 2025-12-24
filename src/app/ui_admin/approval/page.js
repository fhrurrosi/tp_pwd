"use client";

import React, { useState, useMemo } from "react";

export default function Page() {
  const hariIni = new Date();
  const tahunSekarang = hariIni.getFullYear();
  const bulanSekarang = hariIni.getMonth();
  const pad = (n) => String(n).padStart(2, "0");

  const [bulanSaatIni, setBulanSaatIni] = useState(new Date(tahunSekarang, bulanSekarang, 1));
  
  // PERBAIKAN 1: Set default tanggal ke '1' agar tabel langsung terisi saat dibuka
  const [tanggalTerpilih, setTanggalTerpilih] = useState(1); 
  
  const [selectedDetail, setSelectedDetail] = useState(null);

  const [reservations, setReservations] = useState(() => {
    const list = [];
    
    // Helper untuk membuat tanggal string format YYYY-MM-DD sesuai bulan saat ini
    const getMyDate = (day) => {
      // bulanSekarang + 1 karena getMonth() mulai dari 0
      return `${tahunSekarang}-${pad(bulanSekarang + 1)}-${pad(day)}`;
    };

    // PERBAIKAN 2: Data Dummy disesuaikan dengan Bulan & Tahun Saat Ini (bukan hardcode 2026)
    // Data Spesifik (Joko, Siti, dll) ditaruh di tanggal 1-5 bulan ini
    list.push({ id: 101, ruangan: "Room 101", date: getMyDate(1), time: "09:00-10:00", user: "Joko", rincian: "Lihat selengkapnya", keperluan: "Sidang", attachment: "surat.pdf", status: 1 });
    list.push({ id: 102, ruangan: "Room 102", date: getMyDate(1), time: "14:00-15:30", user: "Andi", rincian: "Lihat selengkapnya", keperluan: "Rapat", attachment: null, status: 1 });
    
    list.push({ id: 103, ruangan: "Room 102", date: getMyDate(2), time: "10:30-12:00", user: "Siti", rincian: "Lihat selengkapnya", keperluan: "Presentasi", attachment: null, status: 0 });
    list.push({ id: 104, ruangan: "Room 103", date: getMyDate(3), time: "13:00-14:30", user: "Budi", rincian: "Lihat selengkapnya", keperluan: "Rapat", attachment: "dokumen.pdf", status: 1 });
    list.push({ id: 105, ruangan: "Room 104", date: getMyDate(4), time: "09:00-10:30", user: "Ayu", rincian: "Lihat selengkapnya", keperluan: "Workshop", attachment: null, status: 1 });
    list.push({ id: 106, ruangan: "Room 105", date: getMyDate(5), time: "11:00-12:30", user: "Rina", rincian: "Lihat selengkapnya", keperluan: "Presentasi", attachment: null, status: 0 });

    // Data Random tambahan untuk tanggal lain agar kalender terlihat ramai
    const rooms = ["Room 22", "Room 34", "Room 32"];
    const names = ["Budi", "Ayu", "Rina"];
    for (let i = 0; i < 5; i++) {
        // Generate data di tanggal 10, 15, 20, dst
        const day = 10 + (i * 2); 
        list.push({
            id: i + 1,
            ruangan: rooms[i % rooms.length],
            date: getMyDate(day),
            time: "10.30-12.10",
            user: names[i % names.length],
            rincian: "Lihat selengkapnya",
            keperluan: "Meeting Rutin",
            attachment: null,
            status: i % 2 === 0 ? 0 : 1,
        });
    }

    return list;
  });

  const namaBulan = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Augustus","September","Oktober","November","Desember"
  ];
  const namaHari = ["M","S","S","R","K","J","S"];

  const dapatkanHariDalamBulan = (tanggal) => {
    const tahun = tanggal.getFullYear();
    const bulan = tanggal.getMonth();
    const hariPertama = new Date(tahun, bulan, 1);
    const hariTerakhir = new Date(tahun, bulan + 1, 0);
    return {
      hariDalamBulan: hariTerakhir.getDate(),
      hariAwalMinggu: hariPertama.getDay(),
    };
  };

  const { hariDalamBulan, hariAwalMinggu } = dapatkanHariDalamBulan(bulanSaatIni);

  const bulanSebelumnya = () => setBulanSaatIni(new Date(bulanSaatIni.getFullYear(), bulanSaatIni.getMonth() - 1, 1));
  const bulanBerikutnya = () => setBulanSaatIni(new Date(bulanSaatIni.getFullYear(), bulanSaatIni.getMonth() + 1, 1));

  const apakahTanggalDinonaktifkan = (hari) => {
    const tanggalDicek = new Date(bulanSaatIni.getFullYear(), bulanSaatIni.getMonth(), hari);
    const now = new Date();
    now.setHours(0,0,0,0);
    tanggalDicek.setHours(0,0,0,0);
    // Nonaktifkan hanya jika tanggal dicek benar-benar SEBELUM hari ini
    return tanggalDicek < now;
  };

  const stringTanggalTerpilih = () => {
    if (!tanggalTerpilih) return null;
    const t = bulanSaatIni;
    return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(tanggalTerpilih)}`;
  };

  const reservationsByDate = useMemo(() => {
    const map = new Map();
    for (const r of reservations) {
      const arr = map.get(r.date) || [];
      arr.push(r);
      map.set(r.date, arr);
    }
    return map;
  }, [reservations]);

  const ruanganTerfilter = (() => {
    const s = stringTanggalTerpilih();
    if (!s) return [];
    return reservationsByDate.get(s) || [];
  })();

  const openDetail = (r) => setSelectedDetail(r);
  const closeDetail = () => setSelectedDetail(null);

  const handleApprove = (id) => {
    setReservations(prev => prev.map(x => x.id === id ? { ...x, status: 1 } : x));
    closeDetail();
  };
  const handleReject = (id) => {
    setReservations(prev => prev.map(x => x.id === id ? { ...x, status: 0 } : x));
    closeDetail();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 text-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-black mb-4">Persetujuan</h1>
        <p className="text-sm text-black mb-6">Pilih tanggal di kalender untuk memfilter permintaan.</p>

        <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <button onClick={bulanSebelumnya} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">‹</button>
                <div className="text-lg font-semibold text-black">{namaBulan[bulanSaatIni.getMonth()]} {bulanSaatIni.getFullYear()}</div>
                <button onClick={bulanBerikutnya} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">›</button>
              </div>

              <div className="grid grid-cols-7 gap-2 text-xs text-center text-black mb-2">
                {namaHari.map((h, idx) => <div key={`w-${idx}`}>{h}</div>)}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: hariAwalMinggu }).map((_, i) => <div key={`e-${i}`} className="h-8" />)}
                {Array.from({ length: hariDalamBulan }).map((_, idx) => {
                  const hari = idx + 1;
                  const terpilih = tanggalTerpilih === hari;
                  const dinonaktifkan = apakahTanggalDinonaktifkan(hari);
                  const dateKey = `${bulanSaatIni.getFullYear()}-${pad(bulanSaatIni.getMonth() + 1)}-${pad(hari)}`;
                  const adaReservasi = reservationsByDate.has(dateKey);
                  return (
                    <button
                      key={hari}
                      onClick={() => { if (!dinonaktifkan) setTanggalTerpilih(hari); }}
                      disabled={dinonaktifkan}
                      className={`aspect-square flex items-center justify-center rounded-lg ${dinonaktifkan ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : terpilih ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                      <div className="flex flex-col items-center">
                        <div>{hari}</div>
                        {adaReservasi && (
                          <div className={`w-1.5 h-1.5 rounded-full mt-1 ${terpilih ? 'bg-white' : 'bg-indigo-600'}`} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 text-sm">
                <button onClick={() => setTanggalTerpilih(null)} className="text-indigo-600 hover:underline">Reset filter</button>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-black mb-4">Menunggu Persetujuan ({stringTanggalTerpilih() || 'Semua'})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed text-sm text-black">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left w-16">ID</th>
                        <th className="px-4 py-3 text-left w-24">Ruangan</th>
                        <th className="px-4 py-3 text-left w-24">Date</th>
                        <th className="px-4 py-3 text-left w-28">Time</th>
                        <th className="px-4 py-3 text-left w-20">Users</th>
                        <th className="px-4 py-3 text-left">Rincian</th>
                        <th className="px-4 py-3 text-left w-24">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {ruanganTerfilter.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                            {tanggalTerpilih ? 'Tidak ada permintaan pada tanggal ini.' : 'Silakan pilih tanggal.'}
                          </td>
                        </tr>
                      ) : (
                        ruanganTerfilter.map(r => (
                          <tr key={r.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 truncate">{r.id}</td>
                            <td className="px-4 py-3 truncate" title={r.ruangan}>{r.ruangan}</td>
                            <td className="px-4 py-3 truncate">{r.date}</td>
                            <td className="px-4 py-3 truncate">{r.time}</td>
                            <td className="px-4 py-3 truncate">{r.user}</td>
                            <td className="px-4 py-3">
                              <button onClick={() => openDetail(r)} className="text-indigo-600 hover:text-indigo-800 underline">Lihat</button>
                            </td>
                            <td className="px-4 py-3">
                              {r.status === 1 ? (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-800">Disetujui</span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">Ditolak</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal detail */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeDetail} />
          <div className="relative max-w-lg w-full bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Rincian Pengajuan</h3>
                  <button onClick={closeDetail} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              <div className="space-y-4">
                 <div className="grid grid-cols-3 gap-4 border-b pb-3">
                    <span className="text-sm font-medium text-gray-500">ID Pengajuan</span>
                    <span className="col-span-2 text-sm text-gray-900 font-medium">#{selectedDetail.id}</span>
                 </div>
                 <div className="grid grid-cols-3 gap-4 border-b pb-3">
                    <span className="text-sm font-medium text-gray-500">Pemohon</span>
                    <span className="col-span-2 text-sm text-gray-900">{selectedDetail.user}</span>
                 </div>
                 <div className="grid grid-cols-3 gap-4 border-b pb-3">
                    <span className="text-sm font-medium text-gray-500">Ruangan</span>
                    <span className="col-span-2 text-sm text-gray-900">{selectedDetail.ruangan}</span>
                 </div>
                 <div className="grid grid-cols-3 gap-4 border-b pb-3">
                    <span className="text-sm font-medium text-gray-500">Waktu</span>
                    <span className="col-span-2 text-sm text-gray-900">{selectedDetail.date}, {selectedDetail.time}</span>
                 </div>
                 <div className="grid grid-cols-3 gap-4 border-b pb-3">
                    <span className="text-sm font-medium text-gray-500">Keperluan</span>
                    <span className="col-span-2 text-sm text-gray-900">{selectedDetail.keperluan}</span>
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                    <span className="text-sm font-medium text-gray-500">Lampiran</span>
                    <span className="col-span-2 text-sm text-blue-600 cursor-pointer hover:underline">
                        {selectedDetail.attachment || 'Tidak ada lampiran'}
                    </span>
                 </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3">
                <button onClick={() => handleReject(selectedDetail.id)} className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Tolak</button>
                <button onClick={() => handleApprove(selectedDetail.id)} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">Setujui</button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}