'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/nav_user';
import TabelRuanganTersedia from './ruangan_tersedia';
import TabelRuanganSkeleton from '../../components/TableRuanganSkeleton';

export default function DashboardUser() {
  // State untuk data ruangan
  const [daftarRuangan, setDaftarRuangan] = useState([]);
  
  // State pagination & loading
  const [halamanSaatIni, setHalamanSaatIni] = useState(1);
  const [loading, setLoading] = useState(true);

  const ruanganPerHalaman = 6;
  const hariIni = new Date();

  // --- BAGIAN FETCHING DATA ---
  useEffect(() => {
    async function fetchRuangan() {
      setLoading(true);
      try {
        const res = await fetch('/api/rooms/available');
        const result = await res.json();
        
        if (result.success) {
          setDaftarRuangan(result.data);
        } else {
          console.error("Gagal mengambil data:", result.message);
          setDaftarRuangan([]);
        }
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        // Matikan loading setelah fetch selesai
        setLoading(false);
      }
    }

    fetchRuangan();
  }, []); 
  // Dependency array kosong [] artinya fetch hanya jalan sekali saat halaman dibuka

  // --- LOGIKA PAGINATION ---
  const totalHalaman = Math.ceil(daftarRuangan.length / ruanganPerHalaman);
  const indeksAwal = (halamanSaatIni - 1) * ruanganPerHalaman;
  const indeksAkhir = indeksAwal + ruanganPerHalaman;
  const ruanganTerpaginasi = daftarRuangan.slice(indeksAwal, indeksAkhir);

  const tanganiPerubahanHalaman = (halaman) => {
    if (halaman >= 1 && halaman <= totalHalaman) {
      setHalamanSaatIni(halaman);
      // Opsional: Scroll ke atas tabel saat ganti halaman
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
            // Gunakan data dari state, bukan variabel hardcode
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