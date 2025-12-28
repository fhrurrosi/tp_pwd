import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" }, 
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" }, 
        { status: 404 }
      );
    }

    if (user.resetOtp !== otp || new Date() > new Date(user.resetOtpExpires)) {
      return NextResponse.json(
        { success: false, message: "Token/OTP tidak valid atau kadaluarsa" }, 
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetOtp: null,          
        resetOtpExpires: null     
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Password berhasil diubah. Silakan login." 
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" }, 
      { status: 500 }
    );
  }
}