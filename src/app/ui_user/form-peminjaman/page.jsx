'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2'; 
import Navigation from '../../components/nav_user';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase Client

export default function HalamanFormPeminjaman() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Ambil ID dan Tanggal dari URL
  const ruanganIdParam = searchParams.get('ruanganId');
  const tanggalParam = searchParams.get('tanggal');

  // State Data Ruangan (Fetch dari DB)
  const [roomDetails, setRoomDetails] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);

  // State Form Input User
  const [formData, setFormData] = useState({
    keperluan: '',
    dokumen: null, // Menyimpan Object File
  });

  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Detail Ruangan saat halaman dimuat
  useEffect(() => {
    async function getRoomDetails() {
      if (!ruanganIdParam) return;
      
      try {
        const res = await fetch(`/api/rooms/${ruanganIdParam}`);
        const data = await res.json();
        if (res.ok) {
          setRoomDetails(data);
        } else {
          Swal.fire("Error", "Gagal mengambil data ruangan", "error");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingRoom(false);
      }
    }

    getRoomDetails();
  }, [ruanganIdParam]);

  // Handler Input Text
  const tanganiPerubahan = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler File
  const tanganiPerubahanFile = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, dokumen: file }));
  };

  // Handler Submit (Upload + Simpan)
  const tanganiSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const userId = 1; // Nanti ganti dengan session user asli

    try {
      let dokumenUrl = null;
      if (formData.dokumen) {
        const file = formData.dokumen;
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('dokumen-peminjaman')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error("Gagal upload dokumen: " + uploadError.message);
        }

        dokumenUrl = uploadData.path; 
      }

      const payload = {
        ruanganId: ruanganIdParam,
        userId: userId, 
        tanggal: tanggalParam,
        keperluan: formData.keperluan,
        dokumenPath: dokumenUrl 
      };

      const res = await fetch('/api/reservasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("Maaf, ruangan ini baru saja dibooking orang lain!");
        }
        throw new Error(result.message || "Gagal mengajukan peminjaman");
      }

      // Sukses
      await Swal.fire({
        title: "Berhasil!",
        text: "Peminjaman berhasil diajukan.",
        icon: "success",
        confirmButtonColor: "#2563EB"
      });
      
      router.push('/ui_user/dashboard');

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Gagal",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#EF4444"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Tampilan Loading
  if (loadingRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Header Biru */}
          <div className="bg-blue-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white tracking-wide">Konfirmasi Peminjaman</h1>
            <p className="text-blue-100 text-sm mt-1">Pastikan detail ruangan dan tanggal sudah sesuai.</p>
          </div>

          <div className="p-8">
            <form onSubmit={tanganiSubmit} className="space-y-8">
              
              {/* --- INFO READ ONLY (TAMPILAN LAMA DIKEMBALIKAN) --- */}
              <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 space-y-4">
                
                {/* Nama Ruangan */}
                <div className="grid grid-cols-1 md:grid-cols-3 md:items-center gap-2">
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Ruangan</label>
                  <div className="md:col-span-2 text-xl font-bold text-gray-800">
                    {roomDetails?.namaRuangan || '-'}
                  </div>
                </div>

                <div className="h-px bg-blue-200/50 w-full"></div>

                {/* Tanggal Booking */}
                <div className="grid grid-cols-1 md:grid-cols-3 md:items-center gap-2">
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tanggal</label>
                  <div className="md:col-span-2 text-lg font-semibold text-gray-800">
                    {tanggalParam 
                      ? new Date(tanggalParam).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) 
                      : '-'}
                  </div>
                </div>

                <div className="h-px bg-blue-200/50 w-full"></div>

                {/* Jam Operasional */}
                <div className="grid grid-cols-1 md:grid-cols-3 md:items-center gap-2">
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Waktu Sesi</label>
                  <div className="md:col-span-2">
                    <span className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-100 text-blue-800 font-bold text-lg border border-blue-200">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {roomDetails?.jamMulai} - {roomDetails?.jamSelesai} WIB
                    </span>
                  </div>
                </div>
              </div>

              {/* --- FORM INPUT USER --- */}
              <div className="space-y-6">
                
                {/* Keperluan */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-lg">Keperluan Peminjaman</label>
                  <textarea
                    name="keperluan"
                    rows="3"
                    value={formData.keperluan}
                    onChange={tanganiPerubahan}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 text-lg placeholder-gray-400"
                    placeholder="Contoh: Mengadakan kelas pengganti"
                    required
                  />
                </div>

                {/* Upload Dokumen */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-lg">
                    Dokumen Pendukung <span className="text-gray-400 font-normal text-sm">(Opsional)</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="file"
                      onChange={tanganiPerubahanFile}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 px-4 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-all"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="mb-2 text-sm text-gray-500 font-semibold group-hover:text-blue-600">
                          {formData.dokumen ? formData.dokumen.name : "Klik untuk upload dokumen"}
                        </p>
                        <p className="text-xs text-gray-400">PDF, DOC, DOCX (Max 5MB)</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={submitting}
                  className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Mengupload...
                    </>
                  ) : (
                    'Ajukan Sekarang'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}