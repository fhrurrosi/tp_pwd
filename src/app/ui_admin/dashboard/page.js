"use client"

import React, { useMemo, useState, useEffect } from "react"

// Dummy stat functions - replace implementations with real data fetching
function getTotalRooms() {
	// TODO: implement with real data source (e.g., fetch from API / prisma)
	return 12 // dummy value
}

function getPendingReservations() {
	// TODO: implement with real data source
	return 3 // dummy value
}

function generateDummyReservations(count = 15) {
	const statuses = ["Confirmed", "Pending", "Canceled"]
	const rooms = ["Room 22", "Room 34", "Room 32", "Room 20", "Room 19", "Room 50", "Room 10", "Room 11"]
	const users = ["Joko", "Siti", "Budi", "Ayu", "Rahmat"]

	const data = []
	for (let i = 0; i < count; i++) {
		const room = rooms[i % rooms.length]
		const user = users[i % users.length]
		const status = statuses[i % statuses.length]
		const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000)
		const dateStr = date.toISOString().slice(0, 10)
		const time = `10.30-12.10`

		data.push({ id: i + 1, room, date: dateStr, time, user, status })
	}
	return data
}

export default function Page() {
	const totalRooms = getTotalRooms()
	const pendingReservations = getPendingReservations()

	const allReservations = useMemo(() => generateDummyReservations(15), [])
	// Loading state to show skeletons while data is being fetched
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Simulate network load for skeleton demo — replace with real fetch logic
		const t = setTimeout(() => setLoading(false), 600)
		return () => clearTimeout(t)
	}, [])

	const pageSize = 5
	const [page, setPage] = useState(1)
	const totalPages = Math.ceil(allReservations.length / pageSize)

	const currentReservations = useMemo(() => {
		const start = (page - 1) * pageSize
		return allReservations.slice(start, start + pageSize)
	}, [allReservations, page])

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
				<h1 className="text-2xl font-semibold text-black">Dashboard</h1>
				<p className="text-sm text-[#64748B] mt-1">Welcome back, Admin</p>

				{/* Section 1: Stats (responsive) */}
				<section className="flex flex-col md:flex-row gap-4 md:gap-6 mt-6 mb-8">
					<div className="w-full md:w-auto bg-white shadow rounded-lg p-5 border border-slate-100">
						<div className="text-sm text-slate-700">Total Rooms</div>
						<div className="text-2xl font-bold mt-2 text-black">
							{loading ? <div className="h-6 w-14 bg-slate-200 rounded animate-pulse" /> : totalRooms}
						</div>
					</div>

					<div className="w-full md:w-auto bg-white shadow rounded-lg p-5 border border-slate-100">
						<div className="text-sm text-slate-700">Pending Reservations</div>
						<div className="text-2xl font-bold mt-2 text-black">
							{loading ? <div className="h-6 w-10 bg-slate-200 rounded animate-pulse" /> : pendingReservations}
						</div>
					</div>
				</section>

				{/* Section 2: Reservation table with pagination */}
				<section>
					<h2 className="text-lg font-medium text-black mb-3">Recent Reservations</h2>

					<div className="rounded-lg overflow-hidden border border-slate-100">
						<div className="w-full overflow-x-auto">
							<table className="w-full min-w-[640px] table-auto">
							<thead className="bg-white">
								<tr>
									<th className="text-left px-6 py-3 text-sm text-slate-600">Ruangan</th>
									<th className="text-left px-6 py-3 text-sm text-slate-600">Date</th>
									<th className="text-left px-6 py-3 text-sm text-slate-600">Time</th>
									<th className="text-left px-6 py-3 text-sm text-slate-600">User</th>
									<th className="text-left px-6 py-3 text-sm text-slate-600">Status</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-slate-100">
								{loading
									? // Skeleton rows (5 rows to match page size)
										Array.from({ length: 5 }).map((_, i) => (
											<tr key={`skeleton-${i}`} className="hover:bg-slate-50">
												<td className="px-6 py-4 text-sm">
													<div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
												</td>
												<td className="px-6 py-4 text-sm">
													<div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
												</td>
												<td className="px-6 py-4 text-sm">
													<div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
												</td>
												<td className="px-6 py-4 text-sm">
													<div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
												</td>
												<td className="px-6 py-4 text-sm">
													<div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
												</td>
											</tr>
										))
									: currentReservations.map((r) => (
											<tr key={r.id} className="hover:bg-slate-50">
												<td className="px-6 py-4 text-sm text-slate-800">{r.room}</td>
												<td className="px-6 py-4 text-sm text-slate-600">{r.date}</td>
												<td className="px-6 py-4 text-sm text-slate-600">{r.time}</td>
												<td className="px-6 py-4 text-sm text-slate-800">{r.user}</td>
												<td className="px-6 py-4 text-sm">
													<span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
														r.status === "Confirmed" ? "bg-emerald-100 text-emerald-700" : r.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
													}`}>
														{r.status}
													</span>
												</td>
											</tr>
										))}
							</tbody>
						</table>
						</div>
					</div>

					{/* Pagination controls */}
					<div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
						<button
							onClick={goPrev}
							disabled={page === 1}
							className="px-3 py-1 rounded-md border border-slate-200 text-sm text-slate-700 disabled:opacity-50"
						>
							Prev
						</button>

						<div className="flex flex-wrap items-center gap-2">
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
							Next
						</button>
					</div>
				</section>
			</div>
		</main>
	)
}

