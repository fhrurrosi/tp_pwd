"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function LupaPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const checkEmail = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const res = await fetch('/api/2FA/checkEmail', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (result.success) {
        router.push(`/lupa_password/otp?email=${result.email}`);
  
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Email tidak terdaftar',
          timer: 2000,
          showConfirmButton: false,
        });
        setLoading(false); 
      }
    } catch (err) {
      console.error("Error:", err);
      setLoading(false); 
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">

        <section className="relative hidden md:flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-indigo-600 to-cyan-500 text-white p-8">
          <h2 className="text-3xl font-bold">Selamat Datang</h2>
          <p className="text-sm text-white/90 text-center">
            Masukkan email untuk menerima kode OTP reset password.
          </p>
        </section>

        <section className="p-8">
          <h1 className="text-2xl text-black font-semibold mb-2">Lupa Password</h1>
          <p className="text-sm text-[#64748B] mb-6">
            Masukkan email Anda, kami akan mengirimkan kode OTP.
          </p>

          <form onSubmit={checkEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                required
                disabled={loading} 
                placeholder="email@gmail.com"
                className="w-full rounded-md border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-indigo-400 text-black disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading} 
              className={`block text-center w-full py-2 rounded-md font-semibold text-white transition ${
                loading 
                  ? "bg-slate-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700" 
              }`}
            >
              {loading ? "Memproses..." : "Konfirmasi"} 
            </button>

            <Link href="/login" className="block text-center text-sm text-indigo-600 hover:text-indigo-700">
              Kembali ke login
            </Link>
          </form>
        </section>
      </div>
    </main>
  );
}