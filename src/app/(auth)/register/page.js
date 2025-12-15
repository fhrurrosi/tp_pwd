"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { validateEmail, passwordStrength, validatePhone, normalizePhone, validateNIM } from "../../../lib/validation"

export default function RegisterPage() {
	const router = useRouter()
	const [form, setForm] = useState({ id: "", name: "", phone: "", email: "", password: "", confirmPassword: "" })
	const [emailValid, setEmailValid] = useState(true)
	const [pwdScore, setPwdScore] = useState(0)
	const [showPwd, setShowPwd] = useState(false)
	const [phoneValid, setPhoneValid] = useState(true)
	const [phoneTouched, setPhoneTouched] = useState(false)
	const [idValid, setIdValid] = useState(true)
	const [idTouched, setIdTouched] = useState(false)
	const [idError, setIdError] = useState("")

	function onChange(e) {
		const { name, value } = e.target
		setForm((s) => ({ ...s, [name]: value }))

		if (name === "email") setEmailValid(validateEmail(value))
		if (name === "password") setPwdScore(passwordStrength(value))
		if (name === "confirmPassword") {
			// change handled via form state; mismatch shown in UI
		}
		if (name === "phone") {
			setPhoneTouched(true)
			setPhoneValid(validatePhone(value))
		}

		if (name === "id") {
			setIdTouched(true)
			const res = validateNIM(value)
			setIdValid(res.valid)
			if (!res.valid) {
				if (res.reason === "length") setIdError("NIM/NIP harus minimal 10 digit")
				else if (res.reason === "year") setIdError(`Tahun awal tidak valid: ${res.year}`)
				else if (res.reason === "prodi") setIdError(`Kode prodi tidak valid: ${res.prodi}`)
				else setIdError("Format NIM/NIP tidak valid")
			} else setIdError("")
		}
	}

	async function handleRegister(e) {
		e.preventDefault()
		// normalize phone before sending
		const payload = { ...form, phone: normalizePhone(form.phone) }
		// TODO: POST payload to API
		router.push("/login")
	}

	const pwdLabel = pwdScore <= 1 ? "Lemah" : pwdScore === 2 ? "Sedang" : "Kuat"
	const pwdColor = pwdScore <= 1 ? "bg-red-400" : pwdScore === 2 ? "bg-amber-400" : "bg-emerald-400"

	const passwordsMatch = form.password === form.confirmPassword
	const isFormValid = form.id.trim() && form.name.trim() && form.phone.trim() && emailValid && phoneValid && idValid && form.password.length >= 8 && pwdScore >= 2 && passwordsMatch

	return (
		<main className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
			<div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
				<section className="relative hidden md:flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-indigo-600 to-cyan-500 text-white p-10">
					<div className="absolute top-4 left-4 flex items-center gap-3">
						<div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
							<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v4M12 21v-4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M3 12h4M21 12h-4M4.2 19.8l2.8-2.8M17 7l2.8-2.8" />
							</svg>
						</div>
						<div className="text-white font-bold text-lg">TEMPATIN</div>
					</div>

					<h2 className="text-3xl font-bold">Buat Akun Baru</h2>
					<p className="text-sm text-white/90 text-center">Daftar untuk mengakses dashboard dan fitur reservasi ruangan.</p>
					<div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
						</svg>
					</div>
				</section>

				<section className="p-8">
					<h1 className="text-2xl text-black font-semibold mb-2">Register</h1>
					<p className="text-sm text-[#64748B] mb-6">Isi data berikut untuk membuat akun baru.</p>

					<form onSubmit={handleRegister} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-black mb-1" htmlFor="id">NIM / NIP</label>
							  <input id="id" name="id" value={form.id} onChange={onChange} required placeholder="Masukkan NIM (contoh: 2300018164)" className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-sm placeholder-[#64748B] text-[#64748B] transition duration-150 ease-in-out focus:shadow-md hover:shadow-sm" />
							{idTouched && !idValid && (<p className="text-xs text-red-500 mt-1">{idError}</p>)}
						</div>

						<div>
							<label className="block text-sm font-medium text-black mb-1" htmlFor="name">Nama</label>
							  <input id="name" name="name" value={form.name} onChange={onChange} required placeholder="Nama lengkap" className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-sm placeholder-[#64748B] text-[#64748B] transition duration-150 ease-in-out focus:shadow-md hover:shadow-sm" />
						</div>

						<div>
							<label className="block text-sm font-medium text-black mb-1" htmlFor="phone">Nomor Telepon</label>
							  <input id="phone" name="phone" value={form.phone} onChange={onChange} required placeholder="08xxxxxxxxxx" className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-sm placeholder-[#64748B] text-[#64748B] transition duration-150 ease-in-out focus:shadow-md hover:shadow-sm" />
							{phoneTouched && !phoneValid && (<p className="text-xs text-red-500 mt-1">Nomor telepon tidak valid (contoh: 08123456789 atau +628123456789)</p>)}
						</div>

						<div>
							<label className="block text-sm font-medium text-black mb-1" htmlFor="email">Email</label>
							  <input id="email" name="email" type="email" value={form.email} onChange={onChange} required placeholder="email@domain.com" className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-sm placeholder-[#64748B] text-[#64748B] transition duration-150 ease-in-out focus:shadow-md hover:shadow-sm" />
							{!emailValid && form.email.length > 0 && (<p className="text-xs text-red-500 mt-1">Format email tidak valid</p>)}
						</div>

						<div>
							<label className="block text-sm font-medium text-black mb-1" htmlFor="password">Password</label>
							<div className="relative">
								<input id="password" name="password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={onChange} required placeholder="Minimal 8 karakter" className="w-full rounded-md border border-slate-200 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-sm placeholder-[#64748B] text-[#64748B] transition duration-150 ease-in-out focus:shadow-md hover:shadow-sm" />
								<button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700">
									{showPwd ? (
										<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.05-5.875M6.2 6.2A9.96 9.96 0 0112 5c5.523 0 10 4.477 10 10 0 1.095-.18 2.15-.525 3.125M3 3l18 18" />
										</svg>
									) : (
										<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
									)}
								</button>
							</div>

							<div className="mt-2 flex items-center gap-3">
								<div className="flex-1 h-2 rounded-md bg-slate-200 flex overflow-hidden">
									{[1, 2, 3, 4].map((n) => (
										<div key={n} className={`h-2 transition-all ${n <= pwdScore ? pwdColor : 'bg-slate-200'} w-1/4`} />
									))}
								</div>
								<div className="text-xs text-slate-500">{pwdLabel}</div>
							</div>

							{form.password.length > 0 && form.password.length < 8 && (<p className="text-xs text-red-500 mt-1">Password minimal 8 karakter</p>)}


							{/* Confirm password / re-enter */}
							<div className="mt-4">
								<label className="block text-sm font-medium text-black mb-1" htmlFor="confirmPassword">Konfirmasi Password</label>
								<input id="confirmPassword" name="confirmPassword" type={showPwd ? 'text' : 'password'} value={form.confirmPassword} onChange={onChange} required placeholder="Ulangi password" className="w-full rounded-md border border-slate-200 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-sm placeholder-[#64748B] text-[#64748B] transition duration-150 ease-in-out focus:shadow-md hover:shadow-sm" />
								{form.confirmPassword.length > 0 && !passwordsMatch && (<p className="text-xs text-red-500 mt-1">Password tidak sama</p>)}
							</div>
						</div>

						<div className="pt-2">
							<div className="space-y-3">
								<button type="submit" disabled={!isFormValid} className={`w-full text-white font-semibold py-2 rounded-md shadow-sm transform transition duration-150 ease-in-out ${isFormValid ? 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-lg active:scale-95' : 'bg-slate-300 cursor-not-allowed'}`}>Register</button>

								<div className="flex items-center gap-3">
									<div className="flex-1 h-px bg-[#E6EEF6]" />
									<div className="text-xs text-[#64748B]">or</div>
									<div className="flex-1 h-px bg-[#E6EEF6]" />
								</div>

								<button type="button" onClick={() => router.push('/login')} className="w-full bg-white border border-indigo-600 text-indigo-600 font-medium py-2 rounded-md shadow-sm transform transition duration-150 ease-in-out hover:bg-indigo-50 hover:-translate-y-1 active:scale-95">Masuk</button>
							</div>
						</div>

						<p className="text-xs text-[#64748B]">Catatan: Logic penyimpanan dan verifikasi email belum diimplementasikan. Tempat untuk menaruh logic: lihat fungsi <span className="font-mono">handleRegister</span> di atas.</p>
					</form>
				</section>
			</div>
		</main>
	)
}
