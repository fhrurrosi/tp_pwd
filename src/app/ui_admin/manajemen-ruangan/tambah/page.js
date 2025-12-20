"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

export default function Page() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", location: "", capacity: "", facilities: { ac: false, projector: false, whiteboard: false } })
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

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Nama Ruangan</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Masukkan" className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Lokasi</label>
            <input name="location" value={form.location} onChange={handleChange} placeholder="Masukkan" className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Kapasitas</label>
            <input name="capacity" value={form.capacity} onChange={handleChange} type="number" placeholder="Masukkan" className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-black mb-2">Fasilitas Pendukung :</legend>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="ac" checked={form.facilities.ac} onChange={handleChange} /> AC</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="projector" checked={form.facilities.projector} onChange={handleChange} /> Projector</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="whiteboard" checked={form.facilities.whiteboard} onChange={handleChange} /> Whiteboard</label>
            </div>
          </fieldset>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button type="button" onClick={onCancel} className="px-6 py-2 rounded-md bg-slate-200 text-sm">Batal</button>
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-md bg-indigo-600 text-white text-sm">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </div>
    </main>
  )
}
