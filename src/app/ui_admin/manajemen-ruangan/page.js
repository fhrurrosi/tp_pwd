"use client"

import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import roomsData from "../../../data/rooms.json"

export default function Page() {
	const router = useRouter()

	// Initialize from JSON so multiple pages can consume the same file
	const [rooms, setRooms] = useState(() => roomsData)
	const [page, setPage] = useState(1)
	const pageSize = 5

	const totalPages = Math.ceil(rooms.length / pageSize)
	const current = useMemo(() => {
		const s = (page - 1) * pageSize
		return rooms.slice(s, s + pageSize)
	}, [rooms, page])

	const [openDropdown, setOpenDropdown] = useState(null)
	const [pendingChange, setPendingChange] = useState(null) // { id, nextStatus }

	function toggleDropdown(id) {
		setOpenDropdown((prev) => (prev === id ? null : id))
	}

	function updateStatusConfirm(id, nextStatus) {
		// apply status change
		setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)))
		setPendingChange(null)
	}

	function goToEdit(id) {
		router.push(`/ui_admin/manajemen-ruangan/${id}`)
	}

	function addRoom() {
		router.push(`/ui_admin/manajemen-ruangan/tambah`)
	}

	function goNext() {
		setPage((p) => Math.min(totalPages, p + 1))
	}
	function goPrev() {
		setPage((p) => Math.max(1, p - 1))
	}
	function goTo(n) {
		setPage(() => Math.min(Math.max(1, n), totalPages))
	}

	return (
		<main className="min-h-screen p-6 bg-[#F8FAFC] font-sans">
			<div className="max-w-6xl mx-auto">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-semibold text-black">Manajemen Ruangan</h1>
					<button
						onClick={addRoom}
						className="text-sm bg-white border border-indigo-600 text-indigo-600 px-3 py-2 rounded-md shadow-sm hover:bg-indigo-50"
					>
						Tambahkan Ruangan
					</button>
				</div>

				<div className="mt-6 rounded-lg overflow-hidden border border-slate-100">
					<div className="w-full overflow-x-auto">
						<table className="w-full min-w-[640px] table-auto">
							<thead className="bg-white">
								<tr>
									<th className="text-left px-6 py-3 text-sm text-slate-600">Ruangan</th>
									<th className="text-left px-6 py-3 text-sm text-slate-600">Kapasitas</th>
									<th className="text-left px-6 py-3 text-sm text-slate-600">Lokasi</th>
									<th className="text-left px-6 py-3 text-sm text-slate-600">Status</th>
									<th className="text-left px-6 py-3 text-sm text-slate-600">Tindakan</th>
								</tr>
							</thead>

							<tbody className="bg-white divide-y divide-slate-100">
								{current.map((r) => (
									<tr key={r.id} className="hover:bg-slate-50">
										<td className="px-6 py-4 text-sm text-slate-800">{r.name}</td>
										<td className="px-6 py-4 text-sm text-slate-700">{r.capacity}</td>
										<td className="px-6 py-4 text-sm text-slate-700">{r.location}</td>
										<td className="px-6 py-4 text-sm relative">
											<button
												onClick={() => toggleDropdown(r.id)}
												className={`px-3 py-1 rounded-full text-sm font-semibold ${
													r.status ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
												}`}
											>
												{r.status ? "Tersedia" : "Tidak Tersedia"}
											</button>

											{openDropdown === r.id && (
												<div className="absolute z-20 mt-2 bg-white border border-slate-200 rounded-md shadow-lg right-0">
													<button
														onClick={() => { setPendingChange({ id: r.id, nextStatus: true }); setOpenDropdown(null); }}
														className="block px-4 py-2 text-sm w-44 text-slate-700 hover:bg-slate-50"
													>
														Tersedia
													</button>
													<button
														onClick={() => { setPendingChange({ id: r.id, nextStatus: false }); setOpenDropdown(null); }}
														className="block px-4 py-2 text-sm w-44 text-slate-700 hover:bg-slate-50"
													>
														Tidak Tersedia
													</button>
												</div>
											)}
										</td>
										<td className="px-6 py-4 text-sm">
											<button
												onClick={() => goToEdit(r.id)}
												className="text-sm text-indigo-600 hover:underline"
											>
												edit ruangan
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<div className="flex flex-col sm:flex-row items-center gap-3 justify-between mt-4">
					<div className="text-sm text-slate-600">&nbsp;</div>

					<div className="flex items-center gap-3">
						<button
							onClick={goPrev}
							disabled={page === 1}
							className="px-3 py-1 rounded-md border border-slate-200 text-sm text-slate-700 disabled:opacity-50"
						>
							Sebelumnya
						</button>

						<div className="flex items-center gap-2">
							{Array.from({ length: totalPages }).map((_, idx) => {
								const n = idx + 1
								return (
									<button
										key={n}
										onClick={() => goTo(n)}
										className={`px-3 py-1 rounded-md text-sm border ${n === page ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-200"}`}
									>
										{n}
									</button>
								)
							})}
						</div>

						<button
							onClick={goNext}
							disabled={page === totalPages}
							className="px-3 py-1 rounded-md border border-slate-200 text-sm text-slate-700 disabled:opacity-50"
						>
							Berikutnya
						</button>
					</div>
				</div>
			</div>

				{/* Confirmation dialog (Tailwind) */}
				{pendingChange && (
					<div className="fixed inset-0 z-40 flex items-center justify-center">
						<div className="absolute inset-0 bg-black/40" onClick={() => setPendingChange(null)} />
						<div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-50">
							<h3 className="text-lg font-semibold">Konfirmasi Ubah Status</h3>
							<p className="text-sm text-slate-600 mt-2">Apakah Anda yakin ingin mengubah status ruangan menjadi <span className="font-medium">{pendingChange.nextStatus ? 'Tersedia' : 'Tidak Tersedia'}</span>?</p>
							<div className="mt-4 flex justify-end gap-3">
								<button onClick={() => setPendingChange(null)} className="px-4 py-2 rounded-md bg-slate-200">Batal</button>
								<button onClick={() => updateStatusConfirm(pendingChange.id, pendingChange.nextStatus)} className="px-4 py-2 rounded-md bg-indigo-600 text-white">Konfirmasi</button>
							</div>
						</div>
					</div>
				)}
		</main>
	)
}

