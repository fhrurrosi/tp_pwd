"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const canSubmit = password.length >= 6 && password === confirmPassword;

  function handleSubmit(e) {
    e.preventDefault();
    // 
    router.push("/login");
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
          <h1 className="text-2xl text-black font-semibold mb-2">Reset Password</h1>
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
              disabled={!canSubmit}
              className={`w-full py-2 rounded-md font-semibold text-white transition ${
                canSubmit ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              Simpan Password
            </button>

            <a href="/login" className="block text-center text-sm text-indigo-600 hover:text-indigo-700">
              Kembali ke login
            </a>
          </form>
        </section>
      </div>
    </main>
  );
}
