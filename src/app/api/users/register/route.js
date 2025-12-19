import "server-only";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const hashed = await bcrypt.hash(body.password, 10);
    const userTerdaftar = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (userTerdaftar) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }
    await prisma.user.create({
      data: {
        nimNip: body.nimNip,
        nama: body.nama,
        email: body.email,
        noTelepon: body.noTelepon,
        password: hashed,
      },
    });
    return NextResponse.json({ message: "OK" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
