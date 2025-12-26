"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ManajemenRuanganPage() {
  const router = useRouter()

  // --- STATE ---
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  
  // Default nilai harus 1, jangan biarkan kosong
  const [meta, setMeta] = useState({ total: 0, last_page: 1 }) 

  const [openDropdown, setOpenDropdown] = useState(null)
  const [pendingChange, setPendingChange] = useState(null)


  // --- 1. FETCH DATA (Standard) ---
  useEffect(() => {
    async function fetchRooms() {
      setLoading(true)
      try {
        const currentPage = page && !isNaN(page) ? page : 1;
        
        // Panggil API GET
        const res = await fetch(`/api/rooms?page=${currentPage}&limit=5`)
        const dataJson = await res.json()
        
        setRooms(dataJson.data || [])
        setMeta({
          total: dataJson.meta?.total || 0,
          last_page: Number(dataJson.meta?.last_page) || 1 
        })

      } catch (error) {
        console.error("Gagal fetch:", error)
        setRooms([])
        setMeta({ total: 0, last_page: 1 })
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [page]) // Jalan setiap kali halaman berubah


  // --- 2. LOGIC UPDATE STATUS (YANG SUDAH DIPERBAIKI) ---
  async function updateStatusConfirm(id, nextStatus) {
    const statusString = nextStatus ? "Tersedia" : "Tidak Tersedia";

    try {
      // A. Kirim Request ke Database
      const res = await fetch(`/api/rooms/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        // Backend sudah pintar, cuma kirim status aman
        body: JSON.stringify({ status: statusString }),
      });

      if (!res.ok) {
        throw new Error("Gagal update ke server");
      }

      // B. Update Tampilan di Layar (Biar langsung berubah tanpa refresh)
      setRooms((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: statusString } : r))
      );
      
      // C. Tutup Modal
      setPendingChange(null);

    } catch (error) {
      console.error("Error updating status:", error);
      alert("Gagal mengubah status. Cek koneksi atau coba lagi.");
    }
  }


  // --- HELPER FUNCTION ---
  const safeLastPage = Number(meta.last_page) > 0 ? Number(meta.last_page) : 1;

  function goNext() { 
    setPage((p) => {
      const nextPage = p + 1;
      return nextPage > safeLastPage ? safeLastPage : nextPage;
    }) 
  }
  
  function goPrev() { 
    setPage((p) => Math.max(1, p - 1)) 
  }
  
  function goTo(n) { 
    setPage(n) 
  }

  function toggleDropdown(id) { setOpenDropdown((prev) => (prev === id ? null : id)) }
  function goToEdit(id) { router.push(`/ui_admin/manajemen-ruangan/${id}`) }
  function addRoom() { router.push(`/ui_admin/manajemen-ruangan/tambah`) }


  return (
    <main className="min-h-screen p-6 bg-[#F8FAFC] font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-black">Manajemen Ruangan</h1>
          <button onClick={addRoom} className="text-sm bg-white border border-indigo-600 text-indigo-600 px-3 py-2 rounded-md hover:bg-indigo-50">
            Tambahkan Ruangan
          </button>
        </div>

        <div className="mt-6 rounded-lg overflow-hidden border border-slate-100 bg-white">
          <div className="w-full overflow-x-auto min-h-[300px]">
            <table className="w-full min-w-[750px] table-auto">
              <thead className="bg-white border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Ruangan</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Kapasitas</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Lokasi</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Jam Operasional</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Tindakan</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-20"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-10"></div></td>
                    </tr>
                  ))
                ) : rooms.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      Data tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  rooms.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-800 font-medium">{r.namaRuangan}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{r.kapasitas} Orang</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{r.lokasi}</td>
                      
                      {/* --- DATA JAM --- */}
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-xs font-medium">
                          {r.jamMulai} - {r.jamSelesai}
                        </span>
                      </td>
                      {/* ---------------- */}

                      <td className="px-6 py-4 text-sm relative">
                        <div className="relative inline-block">
                            <button
                              onClick={() => toggleDropdown(r.id)}
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${r.status === 'Tersedia' ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"}`}
                            >
                              {r.status} ▾
                            </button>
                            {openDropdown === r.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                                <div className="absolute left-0 mt-2 z-20 w-40 bg-white border border-slate-200 rounded-md shadow-xl">
                                  <button onClick={() => { setPendingChange({ id: r.id, nextStatus: true }); setOpenDropdown(null); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 text-emerald-700">Set Tersedia</button>
                                  <button onClick={() => { setPendingChange({ id: r.id, nextStatus: false }); setOpenDropdown(null); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-700">Set Tidak Tersedia</button>
                                </div>
                              </>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button onClick={() => goToEdit(r.id)} className="text-sm text-indigo-600 hover:underline font-medium">Edit</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between mt-4">
          <div className="text-sm text-slate-600">
             Halaman {page} dari {safeLastPage}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={goPrev} disabled={page === 1} className="px-3 py-1 rounded-md border border-slate-200 text-sm disabled:opacity-50">Sebelumnya</button>
            <div className="flex gap-2">
              {Array.from({ length: safeLastPage }, (_, i) => i + 1).map((n) => (
                <button 
                  key={n} 
                  onClick={() => goTo(n)} 
                  className={`px-3 py-1 rounded-md text-sm border ${n === page ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-slate-200"}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button onClick={goNext} disabled={page >= safeLastPage} className="px-3 py-1 rounded-md border border-slate-200 text-sm disabled:opacity-50">Berikutnya</button>
          </div>
        </div>
      </div>
      
      {/* MODAL KONFIRMASI */}
    {/* MODAL KONFIRMASI */}
      {pendingChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop gelap transparan */}
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setPendingChange(null)} 
          />
          
          {/* Container Modal */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 z-50 transform transition-all scale-100 border border-gray-100">
            
            {/* Icon Header */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
            </div>

            {/* Judul & Deskripsi */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 leading-6">
                Konfirmasi Perubahan
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Apakah Anda yakin ingin mengubah status ruangan ini menjadi{' '}
                  <span className={`font-bold px-2 py-0.5 rounded border ${
                    pendingChange.nextStatus 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {pendingChange.nextStatus ? 'Tersedia' : 'Tidak Tersedia'}
                  </span>
                  ?
                </p>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setPendingChange(null)}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => updateStatusConfirm(pendingChange.id, pendingChange.nextStatus)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  pendingChange.nextStatus
                    ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500' // Tombol Hijau
                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500' // Tombol Merah
                }`}
              >
                Ya, Ubah
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}