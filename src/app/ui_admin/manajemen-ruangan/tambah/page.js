"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

export default function Page() {
  const router = useRouter()
  
  const [form, setForm] = useState({ 
    name: "", 
    location: "", 
    capacity: "", 
    jamMulai: "07:00",   
    jamSelesai: "09:00", 
    facilities: { ac: false, projector: false, whiteboard: false } 
  })

  const [saving, setSaving] = useState(false)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    
    if (name in form.facilities) {
      setForm((p) => ({ ...p, facilities: { ...p.facilities, [name]: checked } }))
      return
    }
    
    setForm((p) => ({ ...p, [name]: type === 'number' ? Number(value) : value }))
  }

  function onCancel() {
    router.push('/ui_admin/manajemen-ruangan')
  }

  async function onSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        location: form.location,
        capacity: Number(form.capacity) || 0,
        jamMulai: form.jamMulai,     
        jamSelesai: form.jamSelesai, 
        status: true,
        facilities: form.facilities,
      }

      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to create')

      await Swal.fire({ title: 'Berhasil', text: 'Ruangan berhasil ditambahkan', icon: 'success', confirmButtonText: 'OK' })
      router.push('/ui_admin/manajemen-ruangan')
    } catch (err) {
      console.error(err)
      await Swal.fire({ title: 'Gagal', text: 'Tidak dapat menambahkan ruangan', icon: 'error', confirmButtonText: 'OK' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen p-6 bg-[#F8FAFC] font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 shadow">
        <h1 className="text-2xl font-semibold text-black mb-6">Tambahkan Ruangan</h1>

        <form onSubmit={onSave} className="space-y-6">
          
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <h3 className="text-lg font-medium text-slate-800">Informasi Ruangan</h3>
            
            <div>
              <label className="block text-sm font-medium text-black mb-1">Nama Ruangan (Sesi)</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="Contoh: Lab Komdas (Sesi Pagi)" 
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                required 
              />
          
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Lokasi</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="Lantai 2" className="w-full rounded-md border border-slate-200 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Kapasitas</label>
                <input name="capacity" value={form.capacity} onChange={handleChange} type="number" placeholder="0" className="w-full rounded-md border border-slate-200 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-b border-slate-100 pb-6">
            <h3 className="text-lg font-medium text-slate-800">Waktu Operasional</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Jam Mulai</label>
                <input 
                  type="time" 
                  name="jamMulai" 
                  value={form.jamMulai} 
                  onChange={handleChange} 
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Jam Selesai</label>
                <input 
                  type="time" 
                  name="jamSelesai" 
                  value={form.jamSelesai} 
                  onChange={handleChange} 
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                  required 
                />
              </div>
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-black mb-2">Fasilitas Pendukung</legend>
            <div className="flex text-black flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm bg-white border px-3 py-2 rounded cursor-pointer hover:bg-slate-50">
                <input type="checkbox" name="ac" checked={form.facilities.ac} onChange={handleChange} /> AC
              </label>
              <label className="flex items-center gap-2 text-sm bg-white border px-3 py-2 rounded cursor-pointer hover:bg-slate-50">
                <input type="checkbox" name="projector" checked={form.facilities.projector} onChange={handleChange} /> Projector
              </label>
              <label className="flex items-center gap-2 text-sm bg-white border px-3 py-2 rounded cursor-pointer hover:bg-slate-50">
                <input type="checkbox" name="whiteboard" checked={form.facilities.whiteboard} onChange={handleChange} /> Whiteboard
              </label>
            </div>
          </fieldset>

          <div className="flex items-center justify-end gap-4 mt-8 pt-4 border-t border-slate-100">
            <button type="button" onClick={onCancel} className="px-6 py-2 rounded-md bg-white border border-slate-300 text-slate-700 text-sm hover:bg-slate-50">Batal</button>
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 shadow-sm">{saving ? 'Menyimpan...' : 'Simpan Ruangan'}</button>
          </div>
        </form>
      </div>
    </main>
  )
}