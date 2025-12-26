import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params 
    const id = parseInt(resolvedParams.id)
    if (isNaN(id)) {
      return NextResponse.json({ message: 'ID harus berupa angka' }, { status: 400 })
    }

    const room = await prisma.ruangan.findUnique({
      where: { id: id }
    })

    if (!room) {
      return NextResponse.json({ message: 'Ruangan tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(room, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 })
  }
}

export async function PATCH(req, { params }) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    
    const payload = await req.json()
    const existingRoom = await prisma.ruangan.findUnique({ where: { id: id } })
    if (!existingRoom) {
        return NextResponse.json({ message: 'Ruangan tidak ditemukan' }, { status: 404 })
    }

    const dataToUpdate = {}
    if (payload.name) dataToUpdate.namaRuangan = payload.name
    if (payload.location) dataToUpdate.lokasi = payload.location
    if (payload.capacity) dataToUpdate.kapasitas = Number(payload.capacity)

    // Update fasilitas (jika ada object facilities)
    if (payload.facilities) {
      if (payload.facilities.ac !== undefined) dataToUpdate.ac = payload.facilities.ac
      if (payload.facilities.projector !== undefined) dataToUpdate.proyektor = payload.facilities.projector
      if (payload.facilities.whiteboard !== undefined) dataToUpdate.papanTulis = payload.facilities.whiteboard
    }

    // Update STATUS (Ini target utama kita sekarang)
    if (payload.status) {
      dataToUpdate.status = payload.status
    }

    const updatedRoom = await prisma.ruangan.update({
      where: { id: id },
      data: dataToUpdate 
    })

    return NextResponse.json({
        success: true, 
        data: updatedRoom,
        message: 'Berhasil update data'
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ message: 'Gagal update data', error: error.message }, { status: 500 })
  }
}