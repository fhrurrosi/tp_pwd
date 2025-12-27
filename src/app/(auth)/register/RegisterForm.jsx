"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  validateEmail,
  passwordStrength,
  validatePhone,
  normalizePhone,
  validateNIM,
} from "../../../lib/validation"; 
import Swal from "sweetalert2";

export default function RegisterPage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validation, setValidation] = useState({
    emailValid: true,
    phoneValid: true,
    phoneTouched: false,
    idValid: true,
    idTouched: false,
    idError: "",
    pwdScore: 0,
  });

  const [showPwd, setShowPwd] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "phone") {
      const numbersOnly = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: numbersOnly }));

      setValidation((prev) => ({
        ...prev,
        phoneTouched: true,
        phoneValid: validatePhone(numbersOnly),
      }));
      return;
    }

    if (name === "id") {
      const numbersOnly = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: numbersOnly }));

      const res = validateNIM(numbersOnly);
      let error = "";

      if (!res.valid) {
        if (res.reason === "length") error = "NIM/NIP minimal 10 digit";
        else if (res.reason === "year") error = `Tahun tidak valid: ${res.year}`;
        else if (res.reason === "prodi") error = `Kode prodi tidak valid: ${res.prodi}`;
        else error = "Format NIM/NIP tidak valid";
      }

      setValidation((prev) => ({
        ...prev,
        idTouched: true,
        idValid: res.valid,
        idError: error,
      }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setValidation((prev) => ({ ...prev, emailValid: validateEmail(value) }));
    }

    if (name === "password") {
      setValidation((prev) => ({ ...prev, pwdScore: passwordStrength(value) }));
    }
  }

  const passwordsMatch = form.password === form.confirmPassword;
  const pwdLabel =
    validation.pwdScore <= 1
      ? "Lemah"
      : validation.pwdScore === 2
        ? "Sedang"
        : "Kuat";
  const pwdColor =
    validation.pwdScore <= 1
      ? "bg-red-400"
      : validation.pwdScore === 2
        ? "bg-amber-400"
        : "bg-emerald-400";

  const isFormValid =
    form.id &&
    form.name &&
    form.phone &&
    validation.emailValid &&
    validation.phoneValid &&
    validation.idValid &&
    form.password.length >= 8 &&
    validation.pwdScore >= 2 &&
    passwordsMatch;

  async function handleRegister(e) {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);

    const payload = {
      nimNip: form.id.trim(),
      nama: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      noTelepon: normalizePhone(form.phone),
      password: form.password,
    };

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          title: "Registrasi Gagal",
          text: data.message || "Terjadi kesalahan",
          icon: "error",
          confirmButtonText: "OK",
        });
        setIsLoading(false); 
        return;
      }

      setIsLoading(false); 

      Swal.fire({
        title: "Langkah Terakhir!",
        text: "Kode OTP telah dikirim ke email Anda. Silakan verifikasi untuk mengaktifkan akun.",
        icon: "success",
        confirmButtonText: "Masukkan OTP",
        timer: 3000,
      }).then(() => {
        router.push(`/register/otp?email=${data.email}`);
      });

    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Server Error",
        text: "Terjadi kesalahan pada server",
        icon: "error",
        confirmButtonText: "OK",
      });
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <Sidebar />

        <section className="p-8">
          <h1 className="text-2xl text-black font-semibold mb-2">Register</h1>
          <p className="text-sm text-[#64748B] mb-6">
            Isi data berikut untuk membuat akun baru.
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <FormInput
              label="NIM / NIP"
              id="id"
              type="text"
              inputMode="numeric"
              value={form.id}
              onChange={handleChange}
              disabled={isLoading} 
              placeholder="Masukkan NIM (contoh: 2300018164)"
              error={
                validation.idTouched && !validation.idValid
                  ? validation.idError
                  : ""
              }
              required
            />

            <FormInput
              label="Nama"
              id="name"
              value={form.name}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Nama lengkap"
              required
            />

            <FormInput
              label="Nomor Telepon"
              id="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="08xxxxxxxxxx"
              error={
                validation.phoneTouched && !validation.phoneValid
                  ? "Nomor telepon tidak valid (contoh: 08123456789 atau +628123456789)"
                  : ""
              }
              required
            />

            <FormInput
              label="Email"
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="email@gmail.com"
              error={
                !validation.emailValid && form.email.length > 0
                  ? "Format email tidak valid"
                  : ""
              }
              required
            />

            <div>
              <label
                className="block text-sm font-medium text-black mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Minimal 8 karakter"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-sm placeholder-[#64748B] text-[#64748B] transition duration-150 ease-in-out focus:shadow-md hover:shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-md bg-slate-200 flex overflow-hidden">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className={`h-2 transition-all ${n <= validation.pwdScore ? pwdColor : "bg-slate-200"
                          } w-1/4`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-slate-500">{pwdLabel}</div>
                </div>
              )}

              {form.password.length > 0 && form.password.length < 8 && (
                <p className="text-xs text-red-500 mt-1">
                  Password minimal 8 karakter
                </p>
              )}
            </div>

            <FormInput
              label="Konfirmasi Password"
              id="confirmPassword"
              type={showPwd ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Ulangi password"
              error={
                form.confirmPassword.length > 0 && !passwordsMatch
                  ? "Password tidak sama"
                  : ""
              }
              required
            />

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full flex justify-center items-center text-white font-semibold py-2 rounded-md shadow-sm transform transition duration-150 ease-in-out ${
                  isFormValid && !isLoading
                    ? "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-lg active:scale-95"
                    : "bg-slate-300 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  "Register"
                )}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#E6EEF6]" />
                <div className="text-xs text-[#64748B]">or</div>
                <div className="flex-1 h-px bg-[#E6EEF6]" />
              </div>

              <button
                type="button"
                onClick={() => router.push("/login")}
                disabled={isLoading}
                className="w-full bg-white border border-indigo-600 text-indigo-600 font-medium py-2 rounded-md shadow-sm transform transition duration-150 ease-in-out hover:bg-indigo-50 hover:-translate-y-1 active:scale-95"
              >
                Masuk
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

function Sidebar() {
  return (
    <section className="relative hidden md:flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-indigo-600 to-cyan-500 text-white p-10">
      <div className="absolute top-4 left-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 3v4M12 21v-4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M3 12h4M21 12h-4M4.2 19.8l2.8-2.8M17 7l2.8-2.8"
            />
          </svg>
        </div>
        <div className="text-white font-bold text-lg">TEMPATIN</div>
      </div>

      <h2 className="text-3xl font-bold">Buat Akun Baru</h2>
      <p className="text-sm text-white/90 text-center">
        Daftar untuk mengakses dashboard dan fitur reservasi ruangan.
      </p>

      <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"
          />
        </svg>
      </div>
    </section>
  );
}

function FormInput({ label, id, error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-black mb-1" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-sm placeholder-[#64748B] text-[#64748B] transition duration-150 ease-in-out focus:shadow-md hover:shadow-sm disabled:bg-slate-100 disabled:text-slate-400"
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.05-5.875M6.2 6.2A9.96 9.96 0 0112 5c5.523 0 10 4.477 10 10 0 1.095-.18 2.15-.525 3.125M3 3l18 18"
      />
    </svg>
  );
}