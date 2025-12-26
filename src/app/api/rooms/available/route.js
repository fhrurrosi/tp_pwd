import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    // 1. Setup Tanggal
    const targetDate = dateParam ? new Date(dateParam) : new Date();
    const isoDate = new Date(targetDate.toISOString().split('T')[0] + "T00:00:00.000Z");
    const displayDateString = targetDate.toISOString().split('T')[0];

    // 2. Query Database
    const rooms = await prisma.ruangan.findMany({
      where: {
        deletedAt: null, 
        status: 'Tersedia', 
        
        // --- LOGIC KETERSEDIAAN YANG SUDAH DIUPDATE ---
        reservasi: {
          none: {
            // Syarat 1: Tanggalnya sama
            tanggalBooking: isoDate,
            
            // Syarat 2: Statusnya BUKAN 'Rejected' atau 'Cancelled'
            // Artinya: Ruangan ini akan disembunyikan (dianggap penuh) 
            // HANYA JIKA ada reservasi yang statusnya Pending atau Approved.
            // Kalau ada reservasi 'Rejected', kondisi ini jadi false, ruangan tetap muncul.
            status: {
              notIn: ['Rejected', 'Cancelled']
            }
          }
        }
        // ----------------------------------------------
      },
      orderBy: {
        namaRuangan: 'asc',
      }
    });

    // 3. Format Data
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
    console.error("Error fetching available rooms:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}