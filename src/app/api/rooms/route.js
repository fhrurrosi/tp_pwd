import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    // 1. Parsing Parameter dengan Default Value
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    
    const page = pageParam ? parseInt(pageParam) : 1;
    const limit = limitParam ? parseInt(limitParam) : 10;
    
    // Pastikan skip tidak negatif
    const skip = Math.max(0, (page - 1) * limit);

    // 2. Query Database (Data & Total)
    const [rooms, total] = await prisma.$transaction([
      prisma.ruangan.findMany({
        where: { deletedAt: null },
        skip: skip,
        take: limit,
        orderBy: {
          id: "desc",
        },
      }),
      prisma.ruangan.count({ where: { deletedAt: null } }),
    ]);

    // 3. LOGIKA PENGAMAN (Anti-NaN)
    // Jika total 0, maka 0/10 = 0. Kita paksa jadi 1 agar frontend tidak error.
    const lastPage = Math.ceil(total / limit) || 1;

    return NextResponse.json(
      {
        data: rooms,
        meta: {
          total: total,
          page: page,
          last_page: lastPage, 
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching rooms:", err);
    return NextResponse.json(
      { message: "Error server", error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const payload = await req.json();
    const facilities = payload.facilities || {};
    
    // Logic Status
    const statusString = payload.status ? "Tersedia" : "Tidak Tersedia";

    const newRoom = await prisma.ruangan.create({
      data: {
        namaRuangan: payload.name,
        lokasi: payload.location,
        kapasitas: Number(payload.capacity),
        status: statusString,
        ac: facilities.ac || false,
        proyektor: facilities.projector || false,
        papanTulis: facilities.whiteboard || false,
      },
    });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (err) {
    console.error("Error creating room:", err);
    return NextResponse.json(
      { message: "Failed to create room" },
      { status: 500 }
    );
  }
}