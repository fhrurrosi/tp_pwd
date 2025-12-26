import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { ruanganId, userId, tanggal, keperluan, dokumenPath } = body;

    if (!ruanganId || !userId || !tanggal || !keperluan) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    const isoDate = new Date(new Date(tanggal).toISOString().split('T')[0] + "T00:00:00.000Z");

    const newReservasi = await prisma.reservasi.create({
      data: {
        ruanganId: parseInt(ruanganId),
        userId: parseInt(userId),
        tanggalBooking: isoDate,
        keperluan: keperluan,
        status: "Pending",
        dokumenPath: dokumenPath || null 
      }
    });

    return NextResponse.json({ success: true, data: newReservasi }, { status: 201 });

  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "Ruangan sudah dibooking!" }, { status: 409 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}