'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/nav_user';

export default function RiwayatPeminjaman() {
  const [tabAktif, setTabAktif] = useState('Semua');
  const [halamanSaatIni, setHalamanSaatIni] = useState(1);
  const itemPerHalaman = 6;
  const [semuaRiwayat, setSemuaRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchRiwayat() {
      try {
        const res = await fetch('/api/users/riwayat', { cache: 'no-store' });
        const result = await res.json();
        if (result.success) {
          setSemuaRiwayat(result.data);
        } else {
          setSemuaRiwayat([]);
        }
      } catch (error) {
        console.error("Gagal ambil riwayat:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRiwayat();
  }, []);

  const dapatkanRiwayatTerfilter = () => {
    if (tabAktif === 'Semua') return semuaRiwayat;
    
    let targetStatus = '';
    if (tabAktif === 'Disetujui') targetStatus = 'Approved';
    else if (tabAktif === 'Ditolak') targetStatus = 'Rejected';
    else if (tabAktif === 'Pending') targetStatus = 'Pending';

    return semuaRiwayat.filter(item => item.status === targetStatus);
  };

  const riwayatTerfilter = dapatkanRiwayatTerfilter();

  const totalHalaman = Math.ceil(riwayatTerfilter.length / itemPerHalaman);
  const indeksAwal = (halamanSaatIni - 1) * itemPerHalaman;
  const indeksAkhir = indeksAwal + itemPerHalaman;
  const riwayatTerpaginasi = riwayatTerfilter.slice(indeksAwal, indeksAkhir);

  const tanganiPerubahanHalaman = (halaman) => {
    if (halaman >= 1 && halaman <= totalHalaman) {
      setHalamanSaatIni(halaman);
    }
  };

  const tanganiPerubahanTab = (tab) => {
    setTabAktif(tab);
    setHalamanSaatIni(1);
  };
  const formatTanggal = (isoDate) => {
    if (!isoDate) return '-';
    return new Date(isoDate).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Pending
    }
  };

  const getStatusLabel = (status) => {
     switch (status) {
      case 'Approved': return 'Disetujui';
      case 'Rejected': return 'Ditolak';
      default: return 'Pending';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 mt-20" role="main" aria-label="Riwayat Peminjaman">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Daftar Riwayat</h1>
          <p className="text-gray-500">Pantau status pengajuan peminjaman ruangan Anda.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {['Semua', 'Pending', 'Disetujui', 'Ditolak'].map((tab) => (
              <button
                key={tab}
                onClick={() => tanganiPerubahanTab(tab)}
                className={`flex-1 px-6 py-4 text-lg font-semibold transition-all duration-200 whitespace-nowrap ${
                  tabAktif === tab
                    ? 'bg-white text-gray-900 border-b-4 border-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[400px]">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-64 text-gray-400">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
               Memuat data...
             </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
                      <th className="px-6 py-5 text-left text-lg font-bold text-gray-900">Ruangan</th>
                      <th className="px-6 py-5 text-left text-lg font-bold text-gray-900">Tanggal</th>
                      <th className="px-6 py-5 text-left text-lg font-bold text-gray-900">Waktu</th>
                      <th className="px-6 py-5 text-left text-lg font-bold text-gray-900">Keperluan</th>
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
                          <td className="px-6 py-5 text-gray-900 font-medium text-lg">
                            {item.ruangan.namaRuangan}
                          </td>
                          <td className="px-6 py-5 text-gray-700">
                            {formatTanggal(item.tanggalBooking)}
                          </td>
                          <td className="px-6 py-5 text-gray-700 font-medium">
                            {item.ruangan.jamMulai} - {item.ruangan.jamSelesai}
                          </td>
                           <td className="px-6 py-5 text-gray-600 italic">
                            `{item.keperluan}`
                          </td>
                          <td className="px-6 py-5">
                            <span className={`px-4 py-2 rounded-lg font-bold text-sm border inline-block ${getStatusColor(item.status)}`}>
                              {getStatusLabel(item.status)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-lg">
                           {tabAktif === 'Semua' ? 'Belum ada riwayat peminjaman.' : `Tidak ada data dengan status ${tabAktif}.`}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {riwayatTerfilter.length > 0 && (
                <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 flex items-center justify-center gap-3">
                  <button
                    disabled={halamanSaatIni === 1}
                    onClick={() => tanganiPerubahanHalaman(halamanSaatIni - 1)}
                    className="px-5 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sebelumnya
                  </button>

                  <span className="text-gray-600 font-medium">
                    Halaman {halamanSaatIni} dari {totalHalaman || 1}
                  </span>

                  <button
                    disabled={halamanSaatIni === totalHalaman}
                    onClick={() => tanganiPerubahanHalaman(halamanSaatIni + 1)}
                    className="px-5 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Berikutnya
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}