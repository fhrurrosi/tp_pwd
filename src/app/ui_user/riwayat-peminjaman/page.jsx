'use client';

import { useState } from 'react';
import Navigation from '../../components/nav_user';

export default function RiwayatPeminjaman() {
  // Man: State untuk mengontrol tab aktif dan pagination
  // tabAktif: Tab yang sedang dipilih (Semua/Disetujui/Ditolak)
  const [tabAktif, setTabAktif] = useState('Semua');
  // halamanSaatIni: Halaman yang sedang ditampilkan
  const [halamanSaatIni, setHalamanSaatIni] = useState(1);
  // itemPerHalaman: Jumlah items yang ditampilkan per halaman (fixed: 6)
  const itemPerHalaman = 6;

  // Data contoh riwayat peminjaman
  // TODO: Integrate dengan API untuk fetch data dari database
  const semuaRiwayat = [
    { ruangan: 'Room 22', date: '2025-03-03', time: '10.30-12.10', status: 'Disetujui' },
    { ruangan: 'Room 34', date: '2025-03-03', time: '10.30-12.10', status: 'Ditolak' },
    { ruangan: 'Room 32', date: '2025-03-03', time: '10.30-12.10', status: 'Disetujui' },
    { ruangan: 'Room 20', date: '2025-03-03', time: '10.30-12.10', status: 'Ditolak' },
    { ruangan: 'Room 19', date: '2025-03-03', time: '10.30-12.10', status: 'Disetujui' },
    { ruangan: 'Room 50', date: '2025-03-03', time: '10.30-12.10', status: 'Disetujui' },
    { ruangan: 'Room 51', date: '2025-03-04', time: '10.30-12.10', status: 'Disetujui' },
    { ruangan: 'Room 52', date: '2025-03-04', time: '10.30-12.10', status: 'Ditolak' },
    { ruangan: 'Room 53', date: '2025-03-05', time: '10.30-12.10', status: 'Disetujui' },
    { ruangan: 'Room 54', date: '2025-03-05', time: '10.30-12.10', status: 'Ditolak' },
  ];
    // Man: Filter data berdasarkan tabAktif
  const dapatkanRiwayatTerfilter = () => {
    if (tabAktif === 'Semua') return semuaRiwayat;
    return semuaRiwayat.filter(item => item.status === tabAktif);
  };

  const riwayatTerfilter = dapatkanRiwayatTerfilter();
  
  // Man: Menghitung dan slice data untuk pagination
  // totalHalaman: Total halaman = total data / items per page (dibulatkan ke atas)
  const totalHalaman = Math.ceil(riwayatTerfilter.length / itemPerHalaman);
  // indeksAwal: Index awal data untuk halaman saat ini
  const indeksAwal = (halamanSaatIni - 1) * itemPerHalaman;
  // indeksAkhir: Index akhir data untuk halaman saat ini
  const indeksAkhir = indeksAwal + itemPerHalaman;
  // riwayatTerpaginasi: Data yang dipotong sesuai range untuk halaman aktif
  const riwayatTerpaginasi = riwayatTerfilter.slice(indeksAwal, indeksAkhir);

    //
  const tanganiPerubahanHalaman = (halaman) => {
    if (halaman >= 1 && halaman <= totalHalaman) {
      setHalamanSaatIni(halaman);
    }
  };

//   Handler untuk mengubah tab aktif
  const tanganiPerubahanTab = (tab) => {
    setTabAktif(tab);
    setHalamanSaatIni(1); // reset ke halaman 1 saat tab berubah
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 mt-20" role="main" aria-label="Riwayat Peminjaman">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Daftar Riwayat</h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => tanganiPerubahanTab('Semua')}
              className={`flex-1 px-6 py-4 text-lg font-semibold transition-all duration-200 ${
                tabAktif === 'Semua'
                  ? 'bg-white text-gray-900 border-b-4 border-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => tanganiPerubahanTab('Disetujui')}
              className={`flex-1 px-6 py-4 text-lg font-semibold transition-all duration-200 ${
                tabAktif === 'Disetujui'
                  ? 'bg-white text-gray-900 border-b-4 border-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Disetujui
            </button>
            <button
              onClick={() => tanganiPerubahanTab('Ditolak')}
              className={`flex-1 px-6 py-4 text-lg font-semibold transition-all duration-200 ${
                tabAktif === 'Ditolak'
                  ? 'bg-white text-gray-900 border-b-4 border-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Ditolak
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
                  <th className="px-6 py-5 text-left text-lg font-bold text-gray-900">Ruangan</th>
                  <th className="px-6 py-5 text-left text-lg font-bold text-gray-900">Date</th>
                  <th className="px-6 py-5 text-left text-lg font-bold text-gray-900">Time</th>
                  <th className="px-6 py-5 text-left text-lg font-bold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {riwayatTerpaginasi.length > 0 ? (
                  riwayatTerpaginasi.map((item, indeks) => (
                    <tr
                      key={indeks}
                      className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-5 text-gray-900 font-medium">{item.ruangan}</td>
                      <td className="px-6 py-5 text-gray-700">{item.date}</td>
                      <td className="px-6 py-5 text-gray-700">{item.time}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-2 rounded-lg font-semibold inline-block ${
                            item.status === 'Disetujui'
                              ? 'bg-gray-200 text-gray-800'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-lg">
                      Tidak ada riwayat peminjaman
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {riwayatTerfilter.length > 0 && (
            <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 flex items-center justify-center gap-3">
              {halamanSaatIni > 1 && (
                <button
                  onClick={() => tanganiPerubahanHalaman(halamanSaatIni - 1)}
                  className="px-5 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Sebelumnya
                </button>
              )}

              {Array.from({ length: totalHalaman }, (_, indeks) => {
                const nomorHalaman = indeks + 1;
                return (
                  <button
                    key={nomorHalaman}
                    onClick={() => tanganiPerubahanHalaman(nomorHalaman)}
                    className={`px-4 py-2 font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                      halamanSaatIni === nomorHalaman
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {nomorHalaman}
                  </button>
                );
              })}

              {halamanSaatIni < totalHalaman && (
                <button
                  onClick={() => tanganiPerubahanHalaman(halamanSaatIni + 1)}
                  className="px-5 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Berikutnya
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
