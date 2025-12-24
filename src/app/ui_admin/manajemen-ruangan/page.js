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


  useEffect(() => {
    async function fetchRooms() {
      setLoading(true)
      try {
      
        const currentPage = page && !isNaN(page) ? page : 1;
        
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
  }, [page])

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
  function updateStatusConfirm(id, nextStatus) {
     setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus ? "Tersedia" : "Tidak Tersedia" } : r)))
     setPendingChange(null)
  }

  return (
    <main className="min-h-screen p-6 bg-[#F8FAFC] font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-black">Manajemen Ruangan</h1>
          <button onClick={addRoom} className="text-sm bg-white border border-indigo-600 text-indigo-600 px-3 py-2 rounded-md hover:bg-indigo-50">
            Tambahkan Ruangan
          </button>
        </div>

        <div className="mt-6 rounded-lg overflow-hidden border border-slate-100">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[640px] table-auto">
              <thead className="bg-white">
                <tr>
                  <th className="text-left px-6 py-3 text-sm text-slate-600">Ruangan</th>
                  <th className="text-left px-6 py-3 text-sm text-slate-600">Kapasitas</th>
                  <th className="text-left px-6 py-3 text-sm text-slate-600">Lokasi</th>
                  <th className="text-left px-6 py-3 text-sm text-slate-600">Status</th>
                  <th className="text-left px-6 py-3 text-sm text-slate-600">Tindakan</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-slate-100">
                {loading ? (
            
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-20"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-10"></div></td>
                    </tr>
                  ))
                ) : rooms.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      Data tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  rooms.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-800 font-medium">{r.namaRuangan}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{r.kapasitas} Orang</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{r.lokasi}</td>
                      <td className="px-6 py-4 text-sm relative">
                        <button
                          onClick={() => toggleDropdown(r.id)}
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${r.status === 'Tersedia' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                        >
                          {r.status}
                        </button>
                        {openDropdown === r.id && (
                          <div className="absolute z-20 mt-2 bg-white border border-slate-200 rounded-md shadow-lg left-0 w-40">
                             <button onClick={() => { setPendingChange({ id: r.id, nextStatus: true }); setOpenDropdown(null); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 text-emerald-700">Set Tersedia</button>
                             <button onClick={() => { setPendingChange({ id: r.id, nextStatus: false }); setOpenDropdown(null); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-700">Set Tidak Tersedia</button>
                          </div>
                        )}
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
      

      {pendingChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPendingChange(null)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6 z-50">
            <h3 className="text-lg font-semibold">Konfirmasi</h3>
            <p className="text-sm text-slate-600 mt-2">Ubah status jadi <span className="font-bold">{pendingChange.nextStatus ? 'Tersedia' : 'Tidak Tersedia'}</span>?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setPendingChange(null)} className="px-4 py-2 bg-slate-100 rounded-md text-sm">Batal</button>
              <button onClick={() => updateStatusConfirm(pendingChange.id, pendingChange.nextStatus)} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm">Konfirmasi</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}