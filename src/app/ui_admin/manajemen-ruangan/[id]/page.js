"use client"

import React, { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { useRouter, useParams } from "next/navigation"

export default function EditRuanganPage() {
  // 1. Ambil ID dari URL menggunakan useParams (Wajib untuk Client Component)
  const params = useParams()
  const router = useRouter()
  const id = params?.id // ID ruangan (misal: "1")

  // State Form
  const [form, setForm] = useState({
    name: "",
    location: "",
    capacity: "",
    facilities: {
      ac: false,
      projector: false,
      whiteboard: false,
    },
  })

  // State Loading & Saving
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // 2. Fetch Data Ruangan saat halaman dibuka
  useEffect(() => {
    async function fetchRoomData() {
      if (!id) return // Tunggu sampai ID tersedia
      
      try {
        const res = await fetch(`/api/rooms/${id}`)
        
        if (!res.ok) {
            if (res.status === 404) throw new Error("Ruangan tidak ditemukan")
            throw new Error("Gagal mengambil data")
        }
        
        const data = await res.json()

        setForm({
          name: data.namaRuangan || "",
          location: data.lokasi || "",
          capacity: data.kapasitas || "",
          facilities: {
            ac: data.ac || false,
            projector: data.proyektor || false,
            whiteboard: data.papanTulis || false,
          },
        })
      } catch (error) {
        console.error(error)
        Swal.fire("Error", error.message, "error")
        router.push("/ui_admin/manajemen-ruangan") // Kembalikan ke list jika error
      } finally {
        setLoading(false)
      }
    }

    fetchRoomData()
  }, [id, router])

  // 3. Handle Perubahan Input
  function handleChange(e) {
    const { name, value, type, checked } = e.target
    
    // Handle Checkbox Fasilitas
    if (name in form.facilities) {
      setForm((prev) => ({ ...prev, facilities: { ...prev.facilities, [name]: checked } }))
      return
    }
 
    setForm((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }))
  }

  function onCancel() {
    router.push("/ui_admin/manajemen-ruangan")
  }
  async function onSave(e) {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/rooms/${id}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error("Gagal update data")

      await Swal.fire({
        title: "Berhasil!",
        text: "Data ruangan berhasil diperbarui.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      })
      
      router.push("/ui_admin/manajemen-ruangan")
    } catch (error) {
      console.error(error)
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan.", "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-6 bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 text-sm">Memuat data ruangan...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-6 bg-[#F8FAFC] font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 shadow">
        <h1 className="text-2xl font-semibold text-black mb-6">Edit Ruangan</h1>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Nama Ruangan</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Contoh: Ruang Lab A"
              className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Lokasi</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="Contoh: Gedung B Lt 2"
              className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Kapasitas</label>
            <input
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              type="number"
              required
              placeholder="0"
              className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
            />
          </div>

          <fieldset className="border border-slate-200 rounded-md p-4 bg-slate-50">
            <legend className="text-sm font-medium text-black px-2">Fasilitas Pendukung</legend>
            <div className="flex flex-col gap-2 mt-1">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" name="ac" checked={form.facilities.ac} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                AC
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" name="projector" checked={form.facilities.projector} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                Projector
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" name="whiteboard" checked={form.facilities.whiteboard} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                Whiteboard
              </label>
            </div>
          </fieldset>

          <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onCancel} 
              disabled={saving}
              className="px-6 py-2 rounded-md bg-white border border-slate-300 text-slate-700 text-sm hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="px-6 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
} 