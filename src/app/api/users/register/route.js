import "server-only";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();

    const userTerdaftar = await prisma.user.findFirst({
      where: {
        OR: [
          { email: body.email },
          { nimNip: body.nimNip }
        ]
      },
    });

    if (userTerdaftar) {
      return NextResponse.json(
        { message: "Email atau NIM/NIP sudah terdaftar" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(body.password, 10);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

    await prisma.pendingRegistration.upsert({
      where: { email: body.email },
      update: {
        nama: body.nama,
        password: hashed, 
        nimNip: body.nimNip,
        noTelepon: body.noTelepon,
        otp: otpCode,
        otpExpires: expiresAt,
        createdAt: new Date(), 
      },
      create: {
        email: body.email,
        nama: body.nama,
        password: hashed,
        nimNip: body.nimNip,
        noTelepon: body.noTelepon,
        otp: otpCode,
        otpExpires: expiresAt,
      },
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Registrasi Tempatin" <${process.env.EMAIL_USER}>`,
      to: body.email,
      subject: "Verifikasi Pendaftaran Akun",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
          <h2 style="color: #4F46E5; text-align: center;">Selamat Datang!</h2>
          <p>Halo <b>${body.nama}</b>,</p>
          <p>Terima kasih telah mendaftar. Untuk mengaktifkan akun Anda, silakan masukkan kode verifikasi berikut:</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="letter-spacing: 5px; margin: 0; color: #111;">${otpCode}</h1>
          </div>
          
          <p style="color: #555; font-size: 14px;">Kode ini berlaku selama 5 menit.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #888; text-align: center;">Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true,
      message: "OTP dikirim ke email", 
      email: body.email 
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ message: "Gagal memproses pendaftaran" }, { status: 500 });
  }
}