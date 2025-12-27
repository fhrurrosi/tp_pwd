import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    const pendingUser = await prisma.pendingRegistration.findUnique({
      where: { email },
    });
    if (!pendingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Data pendaftaran tidak ditemukan atau sudah kadaluarsa.",
        },
        { status: 404 }
      );
    }

    if (pendingUser.otp !== otp) {
      return NextResponse.json(
        { success: false, message: "Kode OTP salah." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(pendingUser.otpExpires)) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode OTP sudah kadaluarsa. Silakan daftar ulang.",
        },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        email: pendingUser.email,
        password: pendingUser.password, 
        nama: pendingUser.nama,
        nimNip: pendingUser.nimNip,
        noTelepon: pendingUser.noTelepon,
        role: "USER",
      },
    });
    await prisma.pendingRegistration.delete({
      where: { email },
    });

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil! Silakan login.",
    });
  } catch (error) {
    console.error("VERIFY REGISTER ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat verifikasi." },
      { status: 500 }
    );
  }
}
