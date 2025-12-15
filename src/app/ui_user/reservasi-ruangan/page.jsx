'use client';

import { useState } from 'react';
import Navigation from '../../components/nav_user';
import Link from 'next/link';

export default function ReservasiRuangan() {
  const hariIni = new Date();
  const tanggalHariIni = hariIni.toISOString().split('T')[0];

  const [tanggalTerpilih, setTanggalTerpilih] = useState(null);

  const [bulanSaatIni, setBulanSaatIni] = useState(
    () => new Date(hariIni.getFullYear(), hariIni.getMonth(), 1)
  );

  const [tanggalMinimum] = useState(tanggalHariIni);

  const [halamanSaatIni, setHalamanSaatIni] = useState(1);
  const ruanganPerHalaman = 6;

  const [tampilkanModalFilter, setTampilkanModalFilter] = useState(false);

  const [filter, setFilter] = useState({
    status: 'Tersedia',
    ruangan: '',
    tanggal: ''
  });

  // Data contoh ruangan 
  // TODO: Integrate API untuk fetch data real dari database
  const semuaRuangan = [
    { name: 'Room 22', time: '10.30-12.10', status: 'Tersedia' },
    { name: 'Room 34', time: '10.30-12.10', status: 'Tersedia' },
    { name: 'Room 32', time: '10.30-12.10', status: 'Tersedia' },
    { name: 'Room 20', time: '10.30-12.10', status: 'Tersedia' },
    { name: 'Room 19', time: '10.30-12.10', status: 'Tersedia' },
    { name: 'Room 50', time: '10.30-12.10', status: 'Tersedia' },
    { name: 'Room 52', date: tanggalHariIni, time: '10.30-12.10', status: 'Tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 53', date: tanggalHariIni, time: '10.30-12.10', status: 'Tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 54', date: tanggalHariIni, time: '10.30-12.10', status: 'Tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 55', date: tanggalHariIni, time: '10.30-12.10', status: 'Tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 56', date: tanggalHariIni, time: '10.30-12.10', status: 'Tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 57', date: tanggalHariIni, time: '10.30-12.10', status: 'Tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 58', date: tanggalHariIni, time: '10.30-12.10', status: 'Tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 59', date: tanggalHariIni, time: '10.30-12.10', status: 'Tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 60', date: tanggalHariIni, time: '10.30-12.10', status: 'Tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 61', date: tanggalHariIni, time: '10.30-12.10', status: 'Tersedia', action: 'Ajukan Peminjaman' },
  ];

  // Man: Filter ruangan berdasarkan tanggal dan filter dari modal
  const dapatkanRuanganTerfilter = () => {
    if (!tanggalTerpilih) return [];
    
    const tahun = bulanSaatIni.getFullYear();
    const bulan = bulanSaatIni.getMonth();
    const stringTanggalTerpilih = `${tahun}-${String(bulan + 1).padStart(2, '0')}-${String(tanggalTerpilih).padStart(2, '0')}`;
    
    let daftarRuangan = semuaRuangan.map(itemRuangan => ({
      ...itemRuangan,
      date: stringTanggalTerpilih
    }));

    // terima tanggalTerpilih sebagai filter tanggal
    if (filter.ruangan && filter.ruangan !== '') {
      daftarRuangan = daftarRuangan.filter(itemRuangan => itemRuangan.name === filter.ruangan);
    }

    // menampilkan semua ruangan jika tidak menggunkan filter
    if (filter.status && filter.status !== 'Tersedia' && filter.status !== 'Semua') {
      daftarRuangan = daftarRuangan.filter(itemRuangan => itemRuangan.status === filter.status);
    }

    return daftarRuangan;
  };

  const ruanganTerfilter = dapatkanRuanganTerfilter();
  
  // Man: Menghitung dan slice data untuk pagination
  const totalHalaman = ruanganTerfilter.length > 0 ? Math.ceil(ruanganTerfilter.length / ruanganPerHalaman) : 0;
  const indeksAwal = (halamanSaatIni - 1) * ruanganPerHalaman;
  const indeksAkhir = indeksAwal + ruanganPerHalaman;
  const ruanganTerpaginasi = ruanganTerfilter.slice(indeksAwal, indeksAkhir);

  //  Handler untuk mengubah halaman pagination
  const tanganiPerubahanHalaman = (halaman) => {
    if (halaman >= 1 && halaman <= totalHalaman) {
      setHalamanSaatIni(halaman);
    }
  };

  /**
   * Handler untuk memilih tanggal di kalender
   * Reset pagination ke halaman 1 saat tanggal berubah
   */
  const tanganiPilihTanggal = (hari) => {
    if (!apakahTanggalDinonaktifkan(hari)) {
      setTanggalTerpilih(hari);
      setHalamanSaatIni(1);
    }
  };

  // Handler untuk perubahan tanggal dari input
   
  const tanganiPerubahanTanggal = (e) => {
    const { value } = e.target;
    setTanggalTerpilih(value);
    setHalamanSaatIni(1);
  };

  // Fungsi untuk mendapatkan jumlah hari dalam bulan dan hari awal minggu
  const dapatkanHariDalamBulan = (tanggal) => {
    const tahun = tanggal.getFullYear();
    const bulan = tanggal.getMonth();
    const hariPertama = new Date(tahun, bulan, 1);
    const hariTerakhir = new Date(tahun, bulan + 1, 0);
    const hariDalamBulan = hariTerakhir.getDate();
    const hariAwalMinggu = hariPertama.getDay();

    return { hariDalamBulan, hariAwalMinggu };
  };

  const { hariDalamBulan, hariAwalMinggu } = dapatkanHariDalamBulan(bulanSaatIni);

  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Augustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const namaHari = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];

  // Fungsi untuk navigasi ke bulan sebelumnya
  // Tidak bisa mundur ke bulan sebelum bulan saat ini
  const bulanSebelumnya = () => {
    const bulanBaru = new Date(bulanSaatIni.getFullYear(), bulanSaatIni.getMonth() - 1, 1);
    // mencegak kembali ke bulan sebelumnya dari hari ini
    const hariIni = new Date();
    if (bulanBaru.getFullYear() > hariIni.getFullYear() || 
        (bulanBaru.getFullYear() === hariIni.getFullYear() && bulanBaru.getMonth() >= hariIni.getMonth())) {
      setBulanSaatIni(bulanBaru);
    }
  };

  // Fungsi untuk navigasi ke bulan berikutnya
  const bulanBerikutnya = () => {
    setBulanSaatIni(new Date(bulanSaatIni.getFullYear(), bulanSaatIni.getMonth() + 1, 1));
  };
   // Fungsi ini bertugas membandingkan tanggal kalender yang di klik dengan tanggal hari ini jika tanggal di kalender sudah lewat maka tombol tanggal tersebut akan dinonaktifkan
  const apakahTanggalDinonaktifkan = (hari) => {
    const tanggalDicek = new Date(bulanSaatIni.getFullYear(), bulanSaatIni.getMonth(), hari);
    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);
    tanggalDicek.setHours(0, 0, 0, 0);
    return tanggalDicek < hariIni;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-8 py-12" role="main" aria-label="Reservasi Ruangan">
        {/* Calendar Section */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-10 mb-12 border border-gray-200">
          <h2 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-8">Pilih Tanggal</h2>
          
          <div className="max-w-md">
            {/* Navigasi Bulan */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={bulanSebelumnya}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h3 className="text-xl font-bold text-gray-900">
                {namaBulan[bulanSaatIni.getMonth()]} {bulanSaatIni.getFullYear()}
              </h3>
              
              <button
                onClick={bulanBerikutnya}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Grid Kalender */}
            <div className="grid grid-cols-7 gap-2">
              {/* Header Hari */}
              {namaHari.map((hari, indeks) => (
                <div key={indeks} className="text-center font-semibold text-gray-600 text-sm py-2">
                  {hari}
                </div>
              ))}

              {/* Sel kosong untuk hari sebelum bulan dimulai */}
              {Array.from({ length: hariAwalMinggu }).map((_, indeks) => (
                <div key={`empty-${indeks}`} className="aspect-square" />
              ))}

              {/* Hari dalam bulan */}
              {Array.from({ length: hariDalamBulan }).map((_, indeks) => {
                const hari = indeks + 1;
                const terpilih = tanggalTerpilih === hari;
                const dinonaktifkan = apakahTanggalDinonaktifkan(hari);
                
                return (
                  <button
                    key={hari}
                    onClick={() => tanganiPilihTanggal(hari)}
                    disabled={dinonaktifkan}
                    className={`aspect-square flex items-center justify-center rounded-lg text-base font-medium transition-all duration-200 ${
                      dinonaktifkan
                        ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                        : terpilih
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                    }`}
                  >
                    {hari}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Jadwal Ruangan */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 overflow-hidden">
          <div className="p-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Jadwal Ruangan</h2>
                {tanggalTerpilih && (
                  <p className="text-sm text-gray-600 mt-2">
                    Menampilkan ruangan tersedia untuk tanggal: <span className="font-semibold text-blue-600">
                      {new Date(bulanSaatIni.getFullYear(), bulanSaatIni.getMonth(), tanggalTerpilih).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </p>
                )}
              </div>
              <button 
                onClick={() => setTampilkanModalFilter(true)}
                className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Filter
              </button>
            </div>

            {/* Pesan ketika tidak ada tanggal yang dipilih */}
            {!tanggalTerpilih && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 text-lg font-medium">Silakan pilih tanggal terlebih dahulu untuk melihat ruangan yang tersedia</p>
              </div>
            )}

            {/* Table */}
            {tanggalTerpilih && (
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="text-center px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-1/5">Ruangan</th>
                      <th className="text-center px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-1/5">Date</th>
                      <th className="text-center px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-1/5">Time</th>
                      <th className="text-center px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-1/5">Status</th>
                      <th className="text-center px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-1/5">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ruanganTerpaginasi.map((ruangan, indeks) => (
                      <tr key={indeks} className="hover:bg-linear-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 group">
                        <td className="px-6 py-4 w-1/5 text-center">
                          <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{ruangan.name}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 w-1/5 text-center">
                          <span>{ruangan.date}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 w-1/5 text-center">
                          <span className="font-medium">{ruangan.time}</span>
                        </td>
                        <td className="px-6 py-4 w-1/5 text-center">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200 shadow-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                            {ruangan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 w-1/5 text-center">
                          <Link
                            href={`/ui_user/form-peminjaman?ruangan=${encodeURIComponent(ruangan.name)}&tanggal=${ruangan.date}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            Ajukan Peminjaman
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {tanggalTerpilih && (
              <div className="mt-8 flex items-center justify-center gap-3 text-sm">
                {halamanSaatIni > 1 && (
                  <button 
                    onClick={() => tanganiPerubahanHalaman(halamanSaatIni - 1)}
                    className="px-5 py-2.5 text-gray-600 hover:text-blue-600 font-semibold transition-colors duration-200 hover:bg-blue-50 rounded-lg"
                  >
                    Sebelumnya
                  </button>
                )}
                
                {Array.from({ length: totalHalaman }).map((_, indeks) => {
                  const nomorHalaman = indeks + 1;
                  return (
                    <button
                      key={nomorHalaman}
                      onClick={() => tanganiPerubahanHalaman(nomorHalaman)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all duration-200 ${
                        halamanSaatIni === nomorHalaman
                          ? 'bg-blue-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                          : 'hover:bg-gray-100 text-gray-700 hover:text-blue-600 hover:shadow-md'
                      }`}
                    >
                      {nomorHalaman}
                    </button>
                  );
                })}
                
                {halamanSaatIni < totalHalaman && (
                  <button 
                    onClick={() => tanganiPerubahanHalaman(halamanSaatIni + 1)}
                    className="px-5 py-2.5 text-gray-600 hover:text-blue-600 font-semibold transition-colors duration-200 hover:bg-blue-50 rounded-lg"
                  >
                    Berikutnya
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

      {/* Filter Modal */}
      {tampilkanModalFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="bg-linear-to-r from-gray-100 to-gray-50 px-8 py-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Pilih Filter yang ingin diterapkan</h3>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              {/* Status Filter */}
              <div className="space-y-3">
                <label className="block text-lg font-bold text-gray-900">Status</label>
                <select
                  value={filter.status}
                  onChange={(e) => setFilter({...filter, status: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 text-base transition-all duration-200 bg-white"
                >
                  <option value="Tersedia">Tersedia</option>
                  <option value="Tidak Tersedia">Tidak Tersedia</option>
                  <option value="Semua">Semua</option>
                </select>
              </div>

              {/* Ruangan Filter */}
              <div className="space-y-3">
                <label className="block text-lg font-bold text-gray-900">Ruangan</label>
                <select
                  value={filter.ruangan}
                  onChange={(e) => setFilter({...filter, ruangan: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 text-base transition-all duration-200 bg-white"
                >
                  <option value="">Semua Ruangan</option>
                  {semuaRuangan.map((ruangan, indeks) => (
                    <option key={indeks} value={ruangan.name}>{ruangan.name}</option>
                  ))}
                </select>
              </div>

              {/* Tanggal Filter */}
              <div className="space-y-3">
                <label className="block text-lg font-bold text-gray-900">Tanggal</label>
                <input
                  type="date"
                  value={filter.tanggal}
                  onChange={(e) => setFilter({...filter, tanggal: e.target.value})}
                  min={tanggalMinimum}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 text-base transition-all duration-200 bg-white"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex gap-4">
              <button
                onClick={() => setTampilkanModalFilter(false)}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Batalkan
              </button>
              <button
                onClick={() => {
                  // terapkan filter
                  setTampilkanModalFilter(false);
                }}
                className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
