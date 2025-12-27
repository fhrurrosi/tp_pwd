"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/app/components/nav_admin";
import Swal from "sweetalert2";
export default function ManajemenRuanganPage() {
  const router = useRouter();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [meta, setMeta] = useState({ total: 0, last_page: 1 });

  const [openDropdown, setOpenDropdown] = useState(null);

  const [pendingChange, setPendingChange] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      try {
        const currentPage = page && !isNaN(page) ? page : 1;
        const res = await fetch(`/api/rooms?page=${currentPage}&limit=5`);
        const dataJson = await res.json();

        setRooms(dataJson.data || []);
        setMeta({
          total: dataJson.meta?.total || 0,
          last_page: Number(dataJson.meta?.last_page) || 1,
        });
      } catch (error) {
        console.error("Gagal fetch:", error);
        setRooms([]);
        setMeta({ total: 0, last_page: 1 });
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, [page]);

  async function updateStatusConfirm(id, nextStatus) {
    const statusString = nextStatus ? "Tersedia" : "Tidak Tersedia";

    try {
      const res = await fetch(`/api/rooms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusString }),
      });

      if (!res.ok) throw new Error("Gagal update ke server");

      setRooms((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: statusString } : r))
      );
      setPendingChange(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  function openDeleteModal(id) {
    setPendingDelete(id);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;

    try {
      const res = await fetch(`/api/rooms/${pendingDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus ruangan");

      setRooms((prev) => prev.filter((r) => r.id !== pendingDelete));
      setPendingDelete(null);
      Swal.fire({
        title: "Berhasil!",
        text: "Ruangan berhasil dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menghapus ruangan (Cek Server Logs).",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  }

  const safeLastPage = Number(meta.last_page) > 0 ? Number(meta.last_page) : 1;

  function goNext() {
    setPage((p) => {
      const nextPage = p + 1;
      return nextPage > safeLastPage ? safeLastPage : nextPage;
    });
  }
  function goPrev() {
    setPage((p) => Math.max(1, p - 1));
  }
  function goTo(n) {
    setPage(n);
  }

  function toggleDropdown(id) {
    setOpenDropdown((prev) => (prev === id ? null : id));
  }
  function goToEdit(id) {
    router.push(`/ui_admin/manajemen-ruangan/${id}`);
  }
  function addRoom() {
    router.push(`/ui_admin/manajemen-ruangan/tambah`);
  }

  return (
    <>
    <Navigation />
      <main className="min-h-screen p-6 bg-[#F8FAFC] font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-black">
              Manajemen Ruangan
            </h1>
            <button
              onClick={addRoom}
              className="text-sm bg-white border border-indigo-600 text-indigo-600 px-3 py-2 rounded-md hover:bg-indigo-50"
            >
              Tambahkan Ruangan
            </button>
          </div>

          <div className="mt-6 rounded-lg overflow-hidden border border-slate-100 bg-white">
            <div className="w-full overflow-x-auto min-h-[300px]">
              <table className="w-full min-w-[750px] table-auto">
                <thead className="bg-white border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Ruangan
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Kapasitas
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Lokasi
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Jam Operasional
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Tindakan
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-6 bg-slate-200 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-slate-200 rounded w-10"></div>
                        </td>
                      </tr>
                    ))
                  ) : rooms.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-slate-500"
                      >
                        Data tidak ditemukan
                      </td>
                    </tr>
                  ) : (
                    rooms.map((r) => (
                      <tr
                        key={r.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                          {r.namaRuangan}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {r.kapasitas} Orang
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {r.lokasi}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-xs font-medium">
                            {r.jamMulai} - {r.jamSelesai}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm relative">
                          <div className="relative inline-block">
                            <button
                              onClick={() => toggleDropdown(r.id)}
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                r.status === "Tersedia"
                                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                  : "bg-red-100 text-red-700 border-red-200"
                              }`}
                            >
                              {r.status} ▾
                            </button>
                            {openDropdown === r.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setOpenDropdown(null)}
                                />
                                <div className="absolute left-0 mt-2 z-20 w-40 bg-white border border-slate-200 rounded-md shadow-xl">
                                  <button
                                    onClick={() => {
                                      setPendingChange({
                                        id: r.id,
                                        nextStatus: true,
                                      });
                                      setOpenDropdown(null);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 text-emerald-700"
                                  >
                                    Set Tersedia
                                  </button>
                                  <button
                                    onClick={() => {
                                      setPendingChange({
                                        id: r.id,
                                        nextStatus: false,
                                      });
                                      setOpenDropdown(null);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-700"
                                  >
                                    Set Tidak Tersedia
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => goToEdit(r.id)}
                              className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                            >
                              Edit
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              onClick={() => openDeleteModal(r.id)}
                              className="text-sm text-red-600 hover:text-red-800 hover:underline font-medium"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between mt-4">
            <div className="text-sm text-slate-600">
              Halaman {page} dari {safeLastPage}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={goPrev}
                disabled={page === 1}
                className="px-3 py-1 rounded-md border border-slate-200 text-sm disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <div className="flex gap-2">
                {Array.from({ length: safeLastPage }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => goTo(n)}
                      className={`px-3 py-1 rounded-md text-sm border ${
                        n === page
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={goNext}
                disabled={page >= safeLastPage}
                className="px-3 py-1 rounded-md border border-slate-200 text-sm disabled:opacity-50"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>

        {pendingChange && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setPendingChange(null)}
            />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 z-50 border border-gray-100">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 leading-6">
                  Ubah Status?
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Ubah status menjadi{" "}
                  <span className="font-bold">
                    {pendingChange.nextStatus ? "Tersedia" : "Tidak Tersedia"}
                  </span>
                  ?
                </p>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setPendingChange(null)}
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={() =>
                    updateStatusConfirm(
                      pendingChange.id,
                      pendingChange.nextStatus
                    )
                  }
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  Ya, Ubah
                </button>
              </div>
            </div>
          </div>
        )}

        {pendingDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setPendingDelete(null)}
            />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 z-50 border border-red-100">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 leading-6">
                  Hapus Ruangan?
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Apakah Anda yakin? Data ruangan ini akan dihapus permanen dan
                  tidak bisa dikembalikan.
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setPendingDelete(null)}
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 shadow-sm"
                >
                  Hapus Permanen
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
