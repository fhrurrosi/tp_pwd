'use client';

import Link from 'next/link';

export default function TabelRuanganTersedia({ ruangan, halamanSaatIni = 1, totalHalaman = 1, padaPerubahanHalaman = () => {} }) {
  return (
    <div className="mt-8">      
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <th className="text-center px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-1/5">Ruangan</th>
              <th className="text-center px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-1/5">Date</th>
              <th className="text-center px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-1/5">Time</th>
              <th className="text-center px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-1/5">Status</th>
              <th className="text-center px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wide w-1/5">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Man: Map array ruangan untuk generate rows dinamis */}
            {ruangan.map((ruangan, indeks) => (
              <tr key={indeks} className="hover:bg-linear-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 group">
                <td className="px-6 py-4 w-1/5 text-center">
                  <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{ruangan.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-700 w-1/5 text-center">
                  <span>{ruangan.date}</span>
                </td>
                <td className="px-6 py-4 text-gray-700 w-1/5 text-center">
                  <span className="font-medium">{ruangan.time}</span>
                </td>
                <td className="px-6 py-4 w-1/5 text-center">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200 shadow-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    {ruangan.status}
                  </span>
                </td>
                <td className="px-6 py-4 w-1/5 text-center">
                  <Link 
                    href={`/ui_user/form-peminjaman?ruangan=${encodeURIComponent(ruangan.name)}&tanggal=${ruangan.date}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    {ruangan.action}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Man: Pagination dengan conditional rendering */}
        <div className="px-6 py-5 border-t border-gray-200 bg-linear-to-r from-gray-50 to-white">
          <div className="flex items-center justify-center gap-3 text-sm">
            {/* Man: Render tombol Previous hanya jika bukan halaman pertama */}
            {halamanSaatIni > 1 && (
              <button 
                onClick={() => padaPerubahanHalaman(halamanSaatIni - 1)}
                className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 hover:bg-blue-50 rounded-lg"
              >
                Sebelumnya
              </button>
            )}
            
            {/* Man: Generate tombol nomor halaman secara dinamis */}
            {Array.from({ length: totalHalaman }).map((_, indeks) => {
              const nomorHalaman = indeks + 1;
              return (
                <button
                  key={nomorHalaman}
                  onClick={() => padaPerubahanHalaman(nomorHalaman)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all duration-200 ${
                    halamanSaatIni === nomorHalaman
                      ? 'bg-blue-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                      : 'hover:bg-gray-100 text-gray-700 hover:text-blue-600 hover:shadow-md'
                  }`}
                >
                  {nomorHalaman}
                </button>
              );
            })}
            
            {/* Man: Render tombol Next hanya jika bukan halaman terakhir */}
            {halamanSaatIni < totalHalaman && (
              <button 
                onClick={() => padaPerubahanHalaman(halamanSaatIni + 1)}
                className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 hover:bg-blue-50 rounded-lg"
              >
                Berikutnya
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
