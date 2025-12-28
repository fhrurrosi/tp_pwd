"use client";
import Navigation from "@/app/components/nav_admin";
import React, { useMemo, useState, useEffect } from "react";

export default function Page() {
  const [stats, setStats] = useState({ totalRooms: 0, pendingReservations: 0 });
  const [allReservations, setAllReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
        const result = await res.json();

        if (result.success) {
          setStats({
            totalRooms: result.data.totalRooms,
            pendingReservations: result.data.totalPending,
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

  function goNext() {
    setPage((p) => Math.min(totalPages, p + 1));
  }
  function goPrev() {
    setPage((p) => Math.max(1, p - 1));
  }
  function goTo(n) {
    setPage(() => Math.min(Math.max(1, n), totalPages));
  }

  const formatTanggal = (isoDate) => {
    if (!isoDate) return "-";
    return new Date(isoDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Komponen Badge Status Reusable
  const StatusBadge = ({ status }) => {
    let style = "bg-gray-100 text-gray-700";
    let label = status;

    if (status === "Approved") {
      style = "bg-emerald-100 text-emerald-700";
      label = "Disetujui";
    }
    if (status === "Pending") {
      style = "bg-amber-100 text-amber-700";
      label = "Pending";
    }
    if (status === "Rejected") {
      style = "bg-red-100 text-red-700";
      label = "Ditolak";
    }

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-semibold ${style}`}
      >
        {label}
      </span>
    );
  };

  return (
    <>
      <Navigation />
      {/* P-3 di mobile, P-6 di desktop */}
      <main className="min-h-screen p-3 md:p-6 bg-[#F8FAFC] font-sans">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl md:text-2xl font-semibold text-black">
            Dashboard
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            Welcome back, Admin
          </p>

          {/* Grid Layout: 2 Kolom di Mobile, Flex Row di Desktop */}
          <section className="grid grid-cols-2 md:flex md:flex-row gap-3 md:gap-6 mt-4 md:mt-6 mb-6 md:mb-8">
            <div className="w-full bg-white shadow rounded-lg p-4 md:p-5 border border-slate-100">
              <div className="text-xs md:text-sm text-slate-700">
                Total Rooms
              </div>
              <div className="text-xl md:text-2xl font-bold mt-2 text-black">
                {loading ? (
                  <div className="h-6 w-10 md:h-8 md:w-14 bg-slate-200 rounded animate-pulse" />
                ) : (
                  stats.totalRooms
                )}
              </div>
            </div>

            <div className="w-full bg-white shadow rounded-lg p-4 md:p-5 border border-slate-100">
              <div className="text-xs md:text-sm text-slate-700">
                Pending Reservations
              </div>
              <div className="text-xl md:text-2xl font-bold mt-2 text-black">
                {loading ? (
                  <div className="h-6 w-8 md:h-8 md:w-10 bg-slate-200 rounded animate-pulse" />
                ) : (
                  stats.pendingReservations
                )}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base md:text-lg font-medium text-black mb-3">
              Recent Reservations
            </h2>

            {/* --- WRAPPER UTAMA --- */}
            <div className="rounded-lg border border-slate-100 shadow-sm bg-white overflow-hidden">
              {/* --- TAMPILAN DESKTOP (TABEL) --- */}
              {/* Hidden di mobile, Block di md keatas */}
              <div className="hidden md:block w-full overflow-x-auto">
                <table className="w-full min-w-[640px] table-auto">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Ruangan
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Date
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Time
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        User
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={`skeleton-${i}`}>
                          <td className="px-6 py-4">
                            <div className="h-4 w-28 bg-slate-100 rounded animate-pulse" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" />
                          </td>
                        </tr>
                      ))
                    ) : currentReservations.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-slate-400"
                        >
                          Belum ada reservasi terbaru.
                        </td>
                      </tr>
                    ) : (
                      currentReservations.map((r) => (
                        <tr
                          key={r.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                            {r.ruangan?.namaRuangan || "Ruangan Dihapus"}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formatTanggal(r.tanggalBooking)}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {r.ruangan
                              ? `${r.ruangan.jamMulai} - ${r.ruangan.jamSelesai}`
                              : "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-800">
                            {r.user?.nama || "User Dihapus"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <StatusBadge status={r.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* --- TAMPILAN MOBILE (KARTU) --- */}
              {/* Block di mobile, Hidden di md keatas */}
              <div className="block md:hidden">
                {loading ? (
                  <div className="p-4 space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={`mob-skeleton-${i}`}
                        className="bg-slate-50 p-4 rounded-lg animate-pulse"
                      >
                        <div className="h-4 w-1/2 bg-slate-200 rounded mb-2" />
                        <div className="h-3 w-3/4 bg-slate-200 rounded" />
                      </div>
                    ))}
                  </div>
                ) : currentReservations.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    Belum ada reservasi terbaru.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {currentReservations.map((r) => (
                      <div key={r.id} className="p-4 hover:bg-slate-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold text-slate-800 text-sm">
                              {r.ruangan?.namaRuangan || "Ruangan Dihapus"}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {formatTanggal(r.tanggalBooking)}
                            </div>
                          </div>
                          <StatusBadge status={r.status} />
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-3 text-xs bg-slate-50 p-2 rounded border border-slate-100">
                          <div>
                            <span className="block text-slate-400 text-[10px] uppercase">
                              Jam
                            </span>
                            <span className="text-slate-700 font-medium">
                              {r.ruangan
                                ? `${r.ruangan.jamMulai} - ${r.ruangan.jamSelesai}`
                                : "-"}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="block text-slate-400 text-[10px] uppercase">
                              User
                            </span>
                            <span className="text-slate-700 font-medium truncate">
                              {r.user?.nama || "User Dihapus"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pagination Controls */}
            {!loading && currentReservations.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 justify-end">
                <button
                  onClick={goPrev}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-md border border-slate-200 text-xs md:text-sm text-slate-700 disabled:opacity-50 hover:bg-white transition"
                >
                  Prev
                </button>

                <div className="flex flex-wrap items-center gap-1 md:gap-2">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const n = idx + 1;
                    return (
                      <button
                        key={n}
                        onClick={() => goTo(n)}
                        className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-md text-xs md:text-sm border transition ${
                          n === page
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={goNext}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded-md border border-slate-200 text-xs md:text-sm text-slate-700 disabled:opacity-50 hover:bg-white transition"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}