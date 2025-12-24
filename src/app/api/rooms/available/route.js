
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const rooms = await prisma.ruangan.findMany({
      where: {
        deletedAt: null, 
        createdAt: {
          gte: startOfDay, 
          lte: endOfDay   
        }
      },
      orderBy: {
        namaRuangan: 'asc',
      }
    });

    const tanggalHariIniStr = now.toISOString().split('T')[0];

    const formattedRooms = rooms.map((room) => {
      return {
        id: room.id,
        name: room.namaRuangan,
        date: tanggalHariIniStr, 
        time: '08.00 - 17.00', 
        status: room.status.toLowerCase(),
        action: 'Ajukan Peminjaman'
      };
    });

    return NextResponse.json({ 
      success: true, 
      data: formattedRooms 
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Gagal mengambil data ruangan" 
    }, { status: 500 });
  }
}