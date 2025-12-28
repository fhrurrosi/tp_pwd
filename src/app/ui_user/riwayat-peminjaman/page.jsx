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
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200'; 
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
          <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
            {['Semua', 'Pending', 'Disetujui', 'Ditolak'].map((tab) => (
              <button
                key={tab}
                onClick={() => tanganiPerubahanTab(tab)}
                className={`flex-1 min-w-[100px] px-6 py-4 text-sm md:text-lg font-semibold transition-all duration-200 whitespace-nowrap ${
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

        <div className="bg-transparent md:bg-white rounded-2xl md:shadow-xl overflow-hidden min-h-[400px]">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white rounded-2xl shadow-xl">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
               Memuat data...
             </div>
          ) : (
            <>
            
              <div className="md:hidden flex flex-col gap-4">
                {riwayatTerpaginasi.length > 0 ? (
                  riwayatTerpaginasi.map((item, indeks) => (
                    <div key={indeks} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{item.ruangan.namaRuangan}</h3>
                          <p className="text-xs text-gray-500">{formatTanggal(item.tanggalBooking)}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span className="font-medium">{item.ruangan.jamMulai} - {item.ruangan.jamSelesai}</span>
                        </div>
                        <div className="flex items-start gap-2">
                             <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                             <span className="italic">"{item.keperluan}"</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                    <p className="text-gray-500">{tabAktif === 'Semua' ? 'Belum ada riwayat.' : `Tidak ada data ${tabAktif}.`}</p>
                  </div>
                )}
              </div>
              <div className="hidden md:block overflow-x-auto">
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
                            "{item.keperluan}"
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
                <div className="px-6 py-5 bg-white md:bg-gradient-to-r md:from-gray-50 md:to-white md:border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-3 mt-4 md:mt-0 rounded-xl md:rounded-none shadow-sm md:shadow-none">
                  
                  <span className="text-gray-600 font-medium text-sm md:text-base order-2 md:order-1">
                    Halaman {halamanSaatIni} dari {totalHalaman || 1}
                  </span>

                  <div className="flex gap-2 order-1 md:order-2 w-full md:w-auto justify-center">
                    <button
                        disabled={halamanSaatIni === 1}
                        onClick={() => tanganiPerubahanHalaman(halamanSaatIni - 1)}
                        className="flex-1 md:flex-none px-5 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        Sebelumnya
                    </button>

                    <button
                        disabled={halamanSaatIni === totalHalaman}
                        onClick={() => tanganiPerubahanHalaman(halamanSaatIni + 1)}
                        className="flex-1 md:flex-none px-5 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        Berikutnya
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}