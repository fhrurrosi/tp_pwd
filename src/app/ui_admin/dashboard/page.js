"use client"
import React, { useMemo, useState, useEffect } from "react"

export default function Page() {
  const [stats, setStats] = useState({ totalRooms: 0, pendingReservations: 0 });
  const [allReservations, setAllReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/admin/dashboard', { cache: 'no-store' });
        const result = await res.json();

        if (result.success) {
          setStats({
            totalRooms: result.data.totalRooms,
            pendingReservations: result.data.totalPending
          });
          setAllReservations(result.data.recentReservations);
        }
      } catch (error) {
        console.error("Gagal load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);
  const pageSize = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(allReservations.length / pageSize) || 1;

  const currentReservations = useMemo(() => {
    const start = (page - 1) * pageSize;
    return allReservations.slice(start, start + pageSize);
  }, [allReservations, page]);

  function goNext() { setPage((p) => Math.min(totalPages, p + 1)); }
  function goPrev() { setPage((p) => Math.max(1, p - 1)); }
  function goTo(n) { setPage(() => Math.min(Math.max(1, n), totalPages)); }


  const formatTanggal = (isoDate) => {
    if (!isoDate) return '-';
    return new Date(isoDate).toLocaleDateString('id-ID'); 
  };

  const getStatusBadge = (status) => {
    let style = "bg-gray-100 text-gray-700"; 
    if (status === 'Approved') style = "bg-emerald-100 text-emerald-700";
    if (status === 'Pending') style = "bg-amber-100 text-amber-700";
    if (status === 'Rejected') style = "bg-red-100 text-red-700";

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
        {status}
      </span>
    );
  };

  return (
    <main className="min-h-screen p-6 bg-[#F8FAFC] font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
        <p className="text-sm text-[#64748B] mt-1">Welcome back, Admin</p>


        <section className="flex flex-col md:flex-row gap-4 md:gap-6 mt-6 mb-8">

          <div className="w-full md:w-auto bg-white shadow rounded-lg p-5 border border-slate-100 min-w-[200px]">
            <div className="text-sm text-slate-700">Total Rooms</div>
            <div className="text-2xl font-bold mt-2 text-black">
              {loading ? <div className="h-8 w-14 bg-slate-200 rounded animate-pulse" /> : stats.totalRooms}
            </div>
          </div>

          <div className="w-full md:w-auto bg-white shadow rounded-lg p-5 border border-slate-100 min-w-[200px]">
            <div className="text-sm text-slate-700">Pending Reservations</div>
            <div className="text-2xl font-bold mt-2 text-black">
              {loading ? <div className="h-8 w-10 bg-slate-200 rounded animate-pulse" /> : stats.pendingReservations}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium text-black mb-3">Recent Reservations</h2>

          <div className="rounded-lg overflow-hidden border border-slate-100 shadow-sm bg-white">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[640px] table-auto">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Ruangan</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Time</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">User</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={`skeleton-${i}`}>
                        <td className="px-6 py-4"><div className="h-4 w-28 bg-slate-100 rounded animate-pulse" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 rounded animate-pulse" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-100 rounded animate-pulse" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 rounded animate-pulse" /></td>
                        <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" /></td>
                      </tr>
                    ))
                  ) : currentReservations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Belum ada reservasi terbaru.</td>
                    </tr>
                  ) : (
                    currentReservations.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                            {r.ruangan?.namaRuangan || 'Ruangan Dihapus'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                            {formatTanggal(r.tanggalBooking)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                             {r.ruangan ? `${r.ruangan.jamMulai} - ${r.ruangan.jamSelesai}` : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-800">
                            {r.user?.nama || 'User Dihapus'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                            {getStatusBadge(r.status)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {!loading && currentReservations.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 justify-end">
              <button
                onClick={goPrev}
                disabled={page === 1}
                className="px-3 py-1 rounded-md border border-slate-200 text-sm text-slate-700 disabled:opacity-50 hover:bg-white transition"
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
                      className={`w-8 h-8 flex items-center justify-center rounded-md text-sm border transition ${
                        n === page 
                        ? "bg-indigo-600 text-white border-indigo-600" 
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {n}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={goNext}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-md border border-slate-200 text-sm text-slate-700 disabled:opacity-50 hover:bg-white transition"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}