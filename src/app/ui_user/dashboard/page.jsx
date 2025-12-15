'use client';

import { useState, useMemo } from 'react';
import Navigation from '../../components/nav_user';
import TabelRuanganTersedia from './ruangan_tersedia';


export default function DashboardUser() {
  // State untuk mengontrol pagination
  // halamanSaatIni: halaman yang sedang aktif (default: 1)
  const [halamanSaatIni, setHalamanSaatIni] = useState(1);
  
  // Konfigurasi: Jumlah ruangan yang ditampilkan per halaman
  const ruanganPerHalaman = 6;
  
  // Man: Mendapatkan tanggal hari ini untuk filter ruangan
  // Format: YYYY-MM-DD untuk kompatibilitas dengan database
  const hariIni = new Date();
  const tanggalHariIni = hariIni.toISOString().split('T')[0];
  
  // Data contoh 
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

  // Man Menghitung dan slice data untuk pagination
  // totalHalaman: Total halaman = total data / items per page (dibulatkan ke atas)
  const totalHalaman = Math.ceil(semuaRuanganTersedia.length / ruanganPerHalaman);
  // indeksAwal: Index awal data untuk halaman saat ini = (halaman - 1) * items per page
  const indeksAwal = (halamanSaatIni - 1) * ruanganPerHalaman;
  // indeksAkhir: Index akhir data = indeksAwal + items per page
  const indeksAkhir = indeksAwal + ruanganPerHalaman;
  // ruanganTerpaginasi: Data yang dipotong sesuai range index untuk halaman aktif
  const ruanganTerpaginasi = semuaRuanganTersedia.slice(indeksAwal, indeksAkhir);

  // Man Handler untuk mengubah halaman pagination
  // Parameter: halaman (nomor halaman yang akan dituju)
  // Validasi: Hanya update jika halaman number valid (>= 1 dan <= totalHalaman)
  const tanganiPerubahanHalaman = (halaman) => {
    if (halaman >= 1 && halaman <= totalHalaman) {
      setHalamanSaatIni(halaman);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-8 py-12" role="main" aria-label="Dashboard">
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-3">Ruangan Tersedia Hari Ini</h1>
          <p className="text-gray-600 text-sm">
            Tanggal: <span className="font-semibold text-blue-600">{hariIni.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </p>
        </div>
        
        <TabelRuanganTersedia 
          ruangan={ruanganTerpaginasi} 
          halamanSaatIni={halamanSaatIni} 
          totalHalaman={totalHalaman}
          padaPerubahanHalaman={tanganiPerubahanHalaman}
        />
      </main>
    </div>
  );
}
