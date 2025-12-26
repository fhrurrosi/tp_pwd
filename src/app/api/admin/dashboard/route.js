
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    const [totalRooms, totalPending, recentReservations] = await Promise.all([
      prisma.ruangan.count(),
      prisma.reservasi.count({
        where: { status: "Pending" }
      }),
      prisma.reservasi.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' }, 
        include: {
          user: { select: { nama: true } }, 
          ruangan: { select: { namaRuangan: true, jamMulai: true, jamSelesai: true } } 
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalRooms,
        totalPending,
        recentReservations
      }
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}