"use client"

import React, { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { useRouter, useParams } from "next/navigation"
import roomsData from "../../../../data/rooms.json"

export default function Page() {
  const params = useParams()
  const id = params?.id
  return <EditClient id={id} />
}

function EditClient({ id }) {
  const router = useRouter()
  const numericId = Number(id)

  const room = roomsData.find((r) => r.id === numericId)

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

  useEffect(() => {
    if (room) {
      setForm({
        name: room.name || "",
        location: room.location || "",
        capacity: room.capacity || "",
        facilities: {
          ac: false,
          projector: false,
          whiteboard: false,
        },
      })
    }
  }, [id])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    if (name in form.facilities) {
      setForm((prev) => ({ ...prev, facilities: { ...prev.facilities, [name]: checked } }))
      return
    }
    setForm((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }))
  }

  function onCancel() {
    router.push("/ui_admin/manajemen-ruangan")
  }

  function onSave(e) {
    e.preventDefault()
    // For now just log the updated data — persistence not implemented
    console.log("Saved room:", { id: numericId, ...form })

    // show success alert, then navigate back
    Swal.fire({
      title: "Perubahan Tersimpan",
      text: "Data ruangan berhasil disimpan.",
      icon: "success",
      confirmButtonText: "OK",
      timer: 2000,
      timerProgressBar: true,
    }).then(() => {
      router.push("/ui_admin/manajemen-ruangan")
    })
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
              placeholder="Masukkan"
              className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-sm placeholder-[#64748B] text-[#64748B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Lokasi</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Masukkan"
              className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-sm placeholder-[#64748B] text-[#64748B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Kapasitas</label>
            <input
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              type="number"
              placeholder="Masukkan"
              className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-sm placeholder-[#64748B] text-[#64748B]"
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-black mb-2">Fasilitas Pendukung :</legend>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="ac" checked={form.facilities.ac} onChange={handleChange} />
                AC
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="projector" checked={form.facilities.projector} onChange={handleChange} />
                Projector
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="whiteboard" checked={form.facilities.whiteboard} onChange={handleChange} />
                Whiteboard
              </label>
            </div>
          </fieldset>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button type="button" onClick={onCancel} className="px-6 py-2 rounded-md bg-slate-200 text-sm">
              Batal
            </button>
            <button type="submit" className="px-6 py-2 rounded-md bg-indigo-600 text-white text-sm">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
