"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(data) {
    setErrorMessage(""); 
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      setErrorMessage("Email atau password salah"); 
      return;
    }

    const session = await getSession();

    if (session?.user?.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/ui_user/dashboard");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
      
        <section className="relative hidden md:flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-indigo-600 to-cyan-500 text-white p-8">
          <h2 className="text-3xl font-bold">Selamat Datang</h2>
          <p className="text-sm text-white/90 text-center">
            Masuk untuk melanjutkan ke dashboard reservasi ruangan.
          </p>
        </section>

       
        <section className="p-8">
          <h1 className="text-2xl text-black font-semibold mb-2">Login</h1>
          <p className="text-sm text-[#64748B] mb-6">
            Masukkan email dan password untuk masuk.
          </p>

    
          {errorMessage && (
            <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-400 text-red-700 font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
           
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="email@gmail.com"
                {...register("email")}
                className="w-full rounded-md border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-indigo-400 text-[#64748B]"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

           
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="******"
                  {...register("password")}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 pr-10
                    focus:outline-none focus:ring-2 focus:ring-indigo-400
                    placeholder:text-sm placeholder-[#64748B]
                    text-[#64748B] transition"
                />

               
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  aria-label={showPwd ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPwd ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5 c4.477 0 8.268 2.943 9.542 7 -1.274 4.057-5.065 7-9.542 7 -4.477 0-8.268-2.943-9.542-7z" />
                    </svg>

                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3l18 18" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.73 5.08A9.96 9.96 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.96 9.96 0 01-1.67 3.03M6.2 6.2A9.96 9.96 0 002.458 12c1.274 4.057 5.065 7 9.542 7 1.155 0 2.268-.195 3.31-.555" />
                    </svg>
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`w-full py-2 rounded-md font-semibold text-white transition
                ${isValid
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-slate-300 cursor-not-allowed"
                }`}
            >
              {isSubmitting ? "Loading..." : "Login"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/register")}
              className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-md hover:bg-indigo-50"
            >
              Register
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
