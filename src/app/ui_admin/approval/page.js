"use client";

import React, { useState, useMemo } from "react";

export default function Page() {
  const hariIni = new Date();
  const tahunSekarang = hariIni.getFullYear();
  const bulanSekarang = hariIni.getMonth();
  const pad = (n) => String(n).padStart(2, "0");

  const [bulanSaatIni, setBulanSaatIni] = useState(new Date(tahunSekarang, bulanSekarang, 1));
  const [tanggalTerpilih, setTanggalTerpilih] = useState(null); // number day-of-month
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Initial reservations (stateful so approve/reject can update)
  const [reservations, setReservations] = useState(() => {
    const names = ["Joko", "Siti", "Budi", "Ayu", "Rina", "Andi"];
    const rooms = ["Room 22", "Room 34", "Room 32", "Room 20", "Room 19", "Room 50"];
    const list = [];
    for (let i = 0; i < 12; i++) {
      const day = (i % 28) + 1;
      const dateStr = `${tahunSekarang}-${pad(bulanSekarang + 1)}-${pad(day)}`;
      list.push({
        id: i + 1,
        ruangan: rooms[i % rooms.length],
        date: dateStr,
        time: "10.30-12.10",
        user: names[i % names.length],
        rincian: "Lihat selengkapnya",
        keperluan: "Sidang",
        attachment: null,
        status: i % 4 === 0 ? 0 : 1,
      });
    }
    // add explicit January 1 entries for testing (fixed to 2026)
    const janDateBase = `2026-01-`;
    const startId = list.length + 1;
    // Place users on 2026-01-01..2026-01-05 (Joko and Andi on 01 so each day 1-5 shows entries)
    list.push({ id: startId, ruangan: "Room 101", date: `${janDateBase}01`, time: "09:00-10:00", user: "Joko", rincian: "Lihat selengkapnya", keperluan: "Sidang", attachment: "surat.pdf", status: 1 });
    list.push({ id: startId + 1, ruangan: "Room 102", date: `${janDateBase}02`, time: "10:30-12:00", user: "Siti", rincian: "Lihat selengkapnya", keperluan: "Presentasi", attachment: null, status: 0 });
    list.push({ id: startId + 2, ruangan: "Room 103", date: `${janDateBase}03`, time: "13:00-14:30", user: "Budi", rincian: "Lihat selengkapnya", keperluan: "Rapat", attachment: "dokumen.pdf", status: 1 });
    list.push({ id: startId + 3, ruangan: "Room 104", date: `${janDateBase}04`, time: "09:00-10:30", user: "Ayu", rincian: "Lihat selengkapnya", keperluan: "Workshop", attachment: null, status: 1 });
    list.push({ id: startId + 4, ruangan: "Room 105", date: `${janDateBase}05`, time: "11:00-12:30", user: "Rina", rincian: "Lihat selengkapnya", keperluan: "Presentasi", attachment: null, status: 0 });
    list.push({ id: startId + 5, ruangan: "Room 106", date: `${janDateBase}01`, time: "14:00-15:30", user: "Andi", rincian: "Lihat selengkapnya", keperluan: "Rapat", attachment: null, status: 1 });
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
                          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1" />
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
                <h2 className="text-lg font-semibold text-black mb-4">Menunggu Persetujuan</h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed text-sm text-black">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Ruangan</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Time</th>
                        <th className="px-4 py-3 text-left">Users</th>
                        <th className="px-4 py-3 text-left">Rincian Pengajuan</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {ruanganTerfilter.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">Tidak ada permintaan pada tanggal ini.</td>
                        </tr>
                      ) : (
                        ruanganTerfilter.map(r => (
                          <tr key={r.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">{r.id}</td>
                            <td className="px-4 py-3">{r.ruangan}</td>
                            <td className="px-4 py-3">{r.date}</td>
                            <td className="px-4 py-3">{r.time}</td>
                            <td className="px-4 py-3">{r.user}</td>
                            <td className="px-4 py-3">
                              <button onClick={() => openDetail(r)} className="text-black underline">{r.rincian}</button>
                            </td>
                            <td className="px-4 py-3">
                              {r.status === 1 ? (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-100 text-black">Disetujui</span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-black">Ditolak</span>
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
          <div className="absolute inset-0 bg-black opacity-40" onClick={closeDetail} />
          <div className="relative max-w-xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">Rincian Pengajuan</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="text-sm font-semibold">ID</div>
                <div className="sm:col-span-2">{selectedDetail.id}</div>

                <div className="text-sm font-semibold">Ruangan</div>
                <div className="sm:col-span-2">{selectedDetail.ruangan}</div>

                <div className="text-sm font-semibold">Tanggal</div>
                <div className="sm:col-span-2">{selectedDetail.date}</div>

                <div className="text-sm font-semibold">Jam</div>
                <div className="sm:col-span-2">{selectedDetail.time}</div>

                <div className="text-sm font-semibold">Keperluan</div>
                <div className="sm:col-span-2">{selectedDetail.keperluan || '-'}</div>

                <div className="text-sm font-semibold">Unggah Dokumen Pendukung(Optional)</div>
                <div className="sm:col-span-2">{selectedDetail.attachment || '-'}</div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button onClick={() => handleReject(selectedDetail.id)} className="px-4 py-2 bg-white border rounded text-black">Tolak</button>
                <button onClick={() => handleApprove(selectedDetail.id)} className="px-4 py-2 bg-black text-white rounded">Setujui</button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
