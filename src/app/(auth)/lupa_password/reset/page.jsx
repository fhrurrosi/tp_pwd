"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";


function ResetForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token"); 

  const canSubmit = password.length >= 6 && password === confirmPassword;

  useEffect(() => {
    if (!email || !token) {
      Swal.fire("Error", "Akses tidak sah. Silakan ulangi proses lupa password.", "error")
        .then(() => router.push("/lupa_password"));
    }
  }, [email, token, router]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!canSubmit) return;
    setLoading(true);

    try {
      const res = await fetch('/api/2FA/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email: email, 
            otp: token,        
            newPassword: password
        })
      });

      const result = await res.json();

      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Password telah diubah. Silakan login dengan password baru.',
          timer: 2000,
          showConfirmButton: false
        });
        router.push("/login");

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: result.message,
        });
      }

    } catch (err) {
      console.error(err);
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
          <h2 className="text-3xl font-bold">Reset Password</h2>
          <p className="text-sm text-white/90 text-center">
            Buat password baru untuk akun Anda.
          </p>
        </section>

        <section className="p-8">
          <h1 className="text-2xl text-black font-semibold mb-2">Password Baru</h1>
          <p className="text-sm text-[#64748B] mb-6">
            Masukkan password baru Anda dan konfirmasi.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Password baru</label>
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-indigo-400 text-[#64748B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Konfirmasi password</label>
              <input
                type="password"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-indigo-400 text-[#64748B]"
              />
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Password tidak sama.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className={`w-full py-2 rounded-md font-semibold text-white transition ${
                canSubmit && !loading ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              {loading ? "Menyimpan..." : "Simpan Password"}
            </button>

            <a href="/login" className="block text-center text-sm text-indigo-600 hover:text-indigo-700">
              Batal / Kembali ke Login
            </a>
          </form>
        </section>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetForm />
    </Suspense>
  );
}