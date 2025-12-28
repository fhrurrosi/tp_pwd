'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/nav_user';
import Link from 'next/link';

export default function ReservasiRuangan() {
  const hariIni = new Date();

  const [tanggalTerpilih, setTanggalTerpilih] = useState(null);
  const [bulanSaatIni, setBulanSaatIni] = useState(
    () => new Date(hariIni.getFullYear(), hariIni.getMonth(), 1)
  );

  const [daftarRuangan, setDaftarRuangan] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const [halamanSaatIni, setHalamanSaatIni] = useState(1);
  const ruanganPerHalaman = 5;

  useEffect(() => {
    const fetchRuangan = async () => {
      if (!tanggalTerpilih) return;

      setLoading(true);
      try {
        const year = bulanSaatIni.getFullYear();
        const month = String(bulanSaatIni.getMonth() + 1).padStart(2, '0');
        const day = String(tanggalTerpilih).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const res = await fetch(`/api/rooms/available?date=${dateStr}`, {
          cache: 'no-store',
          next: { revalidate: 0 }
        });
        const result = await res.json();

        if (result.success) {
          setDaftarRuangan(result.data);
        } else {
          setDaftarRuangan([]);
        }
      } catch (error) {
        console.error("Gagal fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRuangan();
  }, [tanggalTerpilih, bulanSaatIni]);

  const getFilteredRooms = () => {
    if (!searchTerm) return daftarRuangan;
    return daftarRuangan.filter(r =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const ruanganTerfilter = getFilteredRooms();

  const totalHalaman = Math.ceil(ruanganTerfilter.length / ruanganPerHalaman) || 1;
  const indeksAwal = (halamanSaatIni - 1) * ruanganPerHalaman;
  const ruanganTerpaginasi = ruanganTerfilter.slice(indeksAwal, indeksAwal + ruanganPerHalaman);

  const gantiHalaman = (n) => {
    if (n >= 1 && n <= totalHalaman) setHalamanSaatIni(n);
  };


  const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const namaHari = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return {
      daysInMonth: new Date(year, month + 1, 0).getDate(),
      firstDay: new Date(year, month, 1).getDay()
    };
  };

  const { daysInMonth, firstDay } = getDaysInMonth(bulanSaatIni);

  const prevMonth = () => {
    const newDate = new Date(bulanSaatIni.getFullYear(), bulanSaatIni.getMonth() - 1, 1);
    const today = new Date();
    if (newDate.getFullYear() > today.getFullYear() ||
      (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() >= today.getMonth())) {
      setBulanSaatIni(newDate);
      setTanggalTerpilih(null);
      setDaftarRuangan([]);
    }
  };

  const nextMonth = () => {
    setBulanSaatIni(new Date(bulanSaatIni.getFullYear(), bulanSaatIni.getMonth() + 1, 1));
    setTanggalTerpilih(null);
    setDaftarRuangan([]);
  };

  const isDisabled = (day) => {
    const checkDate = new Date(bulanSaatIni.getFullYear(), bulanSaatIni.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reservasi Ruangan</h1>
          <p className="text-gray-500 mt-2">Pilih tanggal untuk melihat ketersediaan ruangan.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h3 className="text-lg font-bold text-gray-800">{namaBulan[bulanSaatIni.getMonth()]} {bulanSaatIni.getFullYear()}</h3>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {namaHari.map((h, i) => <div key={i} className="text-center text-xs font-semibold text-gray-400 py-2">{h}</div>)}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const selected = tanggalTerpilih === day;
                  const disabled = isDisabled(day);

                  return (
                    <button
                      key={day}
                      onClick={() => {
                        setTanggalTerpilih(day);
                        setHalamanSaatIni(1);
                        setSearchTerm('');
                      }}
                      disabled={disabled}
                      className={`
                        aspect-square rounded-lg text-sm font-medium transition-all
                        ${disabled ? 'text-gray-300 cursor-not-allowed bg-gray-50' :
                          selected ? 'bg-blue-600 text-white shadow-md transform scale-105' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  disabled={!tanggalTerpilih}
                  placeholder={tanggalTerpilih ? "Cari nama ruangan atau lokasi..." : "Pilih tanggal terlebih dahulu"}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setHalamanSaatIni(1);
                  }}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50 disabled:cursor-not-allowed transition"
                />
              </div>
            </div>

            <div className="bg-transparent md:bg-white md:rounded-xl md:shadow-sm md:border border-gray-200 overflow-hidden min-h-[400px]">

              {!tanggalTerpilih ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-gray-400 bg-white rounded-xl border border-gray-200 md:border-0">
                  <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Pilih tanggal di kalender untuk melihat ruangan.</p>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center h-[400px] bg-white rounded-xl border border-gray-200 md:border-0">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-500">Mengecek ketersediaan...</p>
                </div>
              ) : ruanganTerfilter.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-gray-500 bg-white rounded-xl border border-gray-200 md:border-0">
                  <p className="text-lg font-medium">Tidak ada ruangan ditemukan.</p>
                  <p className="text-sm mt-1">{searchTerm ? `Tidak ada hasil untuk "${searchTerm}"` : "Semua ruangan penuh pada tanggal ini."}</p>
                </div>
              ) : (
                <>
                  <div className="md:hidden space-y-4">
                    {ruanganTerpaginasi.map((r, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{r.name}</h3>
                            <p className="text-xs text-gray-500">{r.location}</p>
                          </div>
                          <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {r.time}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                          Kapasitas: {r.capacity} Orang
                        </div>

                        <Link
                          href={r.link || '#'}
                          className="mt-2 w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
                        >
                          Booking Ruangan
                        </Link>
                      </div>
                    ))}
                  </div>

                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ruangan</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kapasitas</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Jam</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {ruanganTerpaginasi.map((r, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/50 transition duration-150">
                            <td className="px-6 py-4">
                              <div className="font-bold text-gray-900">{r.name}</div>
                              <div className="text-xs text-gray-500">{r.location}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {r.capacity} Orang
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {r.time}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link
                                href={r.link || '#'}
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all"
                              >
                                Booking
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {totalHalaman > 1 && (
                    <div className="px-4 md:px-6 py-4 mt-4 md:mt-0 md:border-t border-gray-200 bg-transparent md:bg-gray-50 flex items-center justify-between rounded-xl">
                      <button
                        onClick={() => gantiHalaman(halamanSaatIni - 1)}
                        disabled={halamanSaatIni === 1}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        Prev
                      </button>
                      <span className="text-sm text-gray-600 font-medium">
                        Hal {halamanSaatIni} / {totalHalaman}
                      </span>
                      <button
                        onClick={() => gantiHalaman(halamanSaatIni + 1)}
                        disabled={halamanSaatIni === totalHalaman}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}