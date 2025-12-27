import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next"; 
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    const riwayat = await prisma.reservasi.findMany({
      where: {
        userId: userId,
      },
      include: {
        ruangan: {
          select: {
            namaRuangan: true,
            jamMulai: true,
            jamSelesai: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, data: riwayat });
  } catch (error) {
    console.error("Error Riwayat:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
