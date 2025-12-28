import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const targetDate = dateParam ? new Date(dateParam) : new Date();
    const isoDate = new Date(targetDate.toISOString().split('T')[0] + "T00:00:00.000Z");
    const displayDateString = targetDate.toISOString().split('T')[0];
    const rooms = await prisma.ruangan.findMany({
      where: {
        deletedAt: null, 
        status: 'Tersedia', 
        reservasi: {
          none: {
            tanggalBooking: isoDate,
            
            status: {
              notIn: ['Rejected']
            }
          }
        }
      },
      orderBy: {
        namaRuangan: 'asc',
      }
    });

    const formattedRooms = rooms.map((room) => ({
      id: room.id,
      name: room.namaRuangan,
      date: displayDateString,
      location: room.lokasi,
      capacity: room.kapasitas,
      time: `${room.jamMulai} - ${room.jamSelesai}`,
      status: 'tersedia',
      link: `/ui_user/form-peminjaman?ruanganId=${room.id}&tanggal=${displayDateString}`
    }));

    return NextResponse.json({ success: true, data: formattedRooms }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}