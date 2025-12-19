'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/nav_user';
import TabelRuanganTersedia from './ruangan_tersedia';
import TabelRuanganSkeleton from '../../components/TableRuanganSkeleton';

export default function DashboardUser() {
  const [halamanSaatIni, setHalamanSaatIni] = useState(1);
  const [loading, setLoading] = useState(true);

  const ruanganPerHalaman = 6;

  const hariIni = new Date();
  const tanggalHariIni = hariIni.toISOString().split('T')[0];

  const semuaRuanganTersedia = [
    { name: 'Room 22', date: tanggalHariIni, time: '10.30-12.10', status: 'tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 34', date: tanggalHariIni, time: '10.30-12.10', status: 'tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 32', date: tanggalHariIni, time: '10.30-12.10', status: 'tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 20', date: tanggalHariIni, time: '10.30-12.10', status: 'tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 19', date: tanggalHariIni, time: '10.30-12.10', status: 'tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 51', date: tanggalHariIni, time: '10.30-12.10', status: 'tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 52', date: tanggalHariIni, time: '10.30-12.10', status: 'tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 53', date: tanggalHariIni, time: '10.30-12.10', status: 'tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 54', date: tanggalHariIni, time: '10.30-12.10', status: 'tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 55', date: tanggalHariIni, time: '10.30-12.10', status: 'tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 56', date: tanggalHariIni, time: '10.30-12.10', status: 'tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 57', date: tanggalHariIni, time: '10.30-12.10', status: 'tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 58', date: tanggalHariIni, time: '10.30-12.10', status: 'tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 59', date: tanggalHariIni, time: '10.30-12.10', status: 'tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 60', date: tanggalHariIni, time: '10.30-12.10', status: 'tersedia', action: 'Ajukan Peminjaman' },
    { name: 'Room 61', date: tanggalHariIni, time: '10.30-12.10', status: 'tersedia', action: 'Ajukan Peminjaman' },
  ];

  const totalHalaman = Math.ceil(semuaRuanganTersedia.length / ruanganPerHalaman);
  const indeksAwal = (halamanSaatIni - 1) * ruanganPerHalaman;
  const indeksAkhir = indeksAwal + ruanganPerHalaman;
  const ruanganTerpaginasi = semuaRuanganTersedia.slice(indeksAwal, indeksAkhir);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [halamanSaatIni]);


  const tanganiPerubahanHalaman = (halaman) => {
    if (halaman >= 1 && halaman <= totalHalaman) {
      setLoading(true);
      setHalamanSaatIni(halaman);
    }
  };


  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-3">
            Ruangan Tersedia Hari Ini
          </h1>
          <p className="text-gray-600 text-sm">
            Tanggal:{' '}
            <span className="font-semibold text-blue-600">
              {hariIni.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </p>
        </div>

        {loading ? (
          <TabelRuanganSkeleton rows={ruanganPerHalaman} />
        ) : (
          <TabelRuanganTersedia
            ruangan={ruanganTerpaginasi}
            halamanSaatIni={halamanSaatIni}
            totalHalaman={totalHalaman}
            padaPerubahanHalaman={tanganiPerubahanHalaman}
          />
        )}
      </main>
    </div>
  );
}
