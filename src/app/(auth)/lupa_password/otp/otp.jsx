"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Otp({ email }) { 
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  async function handleConfirm() {
    if (!email) {
      Swal.fire("Error", "Email tidak ditemukan. Silakan ulangi proses.", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/2FA/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const result = await res.json();

      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'OTP Valid! Silakan buat password baru.',
          timer: 1500,
          showConfirmButton: false
        });
        router.push(`/lupa_password/reset?email=${email}&token=${otp}`);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: result.message || 'Kode OTP salah',
        });
      }
    } catch (err) {
      console.error("Error verifikasi:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan sistem',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">

        <section className="relative hidden md:flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-indigo-600 to-cyan-500 text-white p-8">
          <h2 className="text-3xl font-bold">Verifikasi OTP</h2>
          <p className="text-sm text-white/90 text-center">
            Kode dikirim ke: <br/> 
            <span className="font-mono font-bold bg-white/20 px-2 py-1 rounded mt-2 inline-block">
              {email || "Email tidak terdeteksi"}
            </span>
          </p>
        </section>

        <section className="p-8">
          <h1 className="text-2xl text-black font-semibold mb-2">Masukkan OTP</h1>
          <p className="text-sm text-[#64748B] mb-6">
            Masukkan kode OTP yang kami kirim ke email Anda.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Kode OTP</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full rounded-md border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-indigo-400 text-black tracking-[0.5em] text-center font-bold text-lg"
              />
              <p className="text-xs text-[#64748B] mt-1">Masukkan 6 digit angka.</p>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={otp.length !== 6 || loading}
              className={`w-full py-2 rounded-md font-semibold text-white transition ${
                otp.length === 6 && !loading 
                ? "bg-indigo-600 hover:bg-indigo-700" 
                : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              {loading ? "Memverifikasi..." : "Konfirmasi OTP"}
            </button>

            <a href="/lupa_password" className="block text-center text-sm text-indigo-600 hover:text-indigo-700">
              Kembali / Kirim Ulang
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}