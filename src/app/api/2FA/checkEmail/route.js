import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer"; 

export const POST = async (req) => {
  try {
    const data = await req.json();
    const { email } = data;

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email tidak terdaftar" },
        { status: 404 }
      );
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user.update({
      where: { email: email },
      data: {
        resetOtp: otpCode,       
        resetOtpExpires: expiresAt  
      }
    });

    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Support Tim" <${process.env.EMAIL_USER}>`, 
      to: email,
      subject: "Kode OTP Reset Password",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4F46E5;">Permintaan Reset Password</h2>
          <p>Halo,</p>
          <p>Kami menerima permintaan untuk mereset password akun Anda. Gunakan kode OTP di bawah ini:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="letter-spacing: 5px; margin: 0; color: #111;">${otpCode}</h1>
          </div>
          <p>Kode ini akan kadaluarsa dalam 5 menit.</p>
          <p style="font-size: 12px; color: #888;">Jika Anda tidak merasa meminta ini, abaikan saja email ini.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { 
        success: true, 
        message: "OTP telah dikirim ke email", 
        email: user.email 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error checkEmail 2FA:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengirim email / Server Error" },
      { status: 500 }
    );
  }
};