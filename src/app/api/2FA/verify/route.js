import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email dan OTP wajib diisi" }, 
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim() },
    });

    if (!user) {
        return NextResponse.json(
            { success: false, message: `User dengan email '${email}' tidak ditemukan.` }, 
            { status: 404 }
        );
    }

    if (user.resetOtp !== otp) {
      return NextResponse.json(
        { success: false, message: "Kode OTP salah" }, 
        { status: 400 }
      );
    }

    if (!user.resetOtpExpires || new Date() > new Date(user.resetOtpExpires)) {
      return NextResponse.json(
        { success: false, message: "Kode OTP sudah kadaluarsa" }, 
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "OTP Valid" 
    });

  } catch (error) {
    console.error("VERIFY RESET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" }, 
      { status: 500 }
    );
  }
}