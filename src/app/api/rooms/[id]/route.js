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
    const facilities = payload.facilities || {}


    const existingRoom = await prisma.ruangan.findUnique({ where: { id: id } })
    if (!existingRoom) {
        return NextResponse.json({ message: 'Ruangan tidak ditemukan' }, { status: 404 })
    }

    const updatedRoom = await prisma.ruangan.update({
      where: { id: id },
      data: {
        namaRuangan: payload.name,
        lokasi: payload.location,
        kapasitas: Number(payload.capacity),
        ac: facilities.ac,
        proyektor: facilities.projector,
        papanTulis: facilities.whiteboard,
    
        ...(payload.status && { status: payload.status })
      }
    })

    return NextResponse.json(updatedRoom, { status: 200 })
  } catch (error) {
    console.error("🔥 Error PATCH Room:", error)
    return NextResponse.json({ message: 'Gagal update data', error: error.message }, { status: 500 })
  }
}