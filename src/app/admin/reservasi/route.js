// src/app/api/admin/reservasi/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'; // Selalu data terbaru

// GET: Ambil Semua Reservasi (Bisa difilter tanggal dari frontend)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date'); // Format: YYYY-MM-DD

    const whereCondition = {};
    
    // Jika ada parameter tanggal, filter berdasarkan tanggalBooking
    if (dateParam) {
      const targetDate = new Date(dateParam + "T00:00:00.000Z");
      whereCondition.tanggalBooking = targetDate;
    }

    const reservasi = await prisma.reservasi.findMany({
      where: whereCondition,
      include: {
        user: { select: { nama: true, nimNip: true } },     // Ambil nama user
        ruangan: { select: { namaRuangan: true, jamMulai: true, jamSelesai: true } } // Ambil nama ruangan
      },
      orderBy: { createdAt: 'desc' } // Yang terbaru paling atas
    });

    return NextResponse.json({ success: true, data: reservasi });

  } catch (error) {
    console.error("Admin Reservasi Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, status } = body; 

    if (!id || !['Approved', 'Rejected'].includes(status)) {
      return NextResponse.json({ message: "Status tidak valid" }, { status: 400 });
    }

    const updated = await prisma.reservasi.update({
      where: { id: parseInt(id) },
      data: { status: status }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update Status Error:", error);
    return NextResponse.json({ message: "Gagal update status" }, { status: 500 });
  }
}