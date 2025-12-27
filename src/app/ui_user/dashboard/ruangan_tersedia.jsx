'use client';

import Link from 'next/link';

export default function TabelRuanganTersedia({ ruangan, halamanSaatIni = 1, totalHalaman = 1, padaPerubahanHalaman = () => {} }) {
  return (
    <div className="mt-8 flex flex-col gap-4">      
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Ruangan</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Jam Operasional</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ruangan.map((item, indeks) => (
                <tr key={indeks} className="hover:bg-slate-50/80 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                      <span className="text-xs text-slate-500">{item.location}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600 font-medium bg-slate-100 px-2 py-1 rounded">
                      {item.date}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {item.time}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      Tersedia
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link 
                      href={item.link || `/ui_user/form-peminjaman?ruanganId=${item.id}&tanggal=${item.date}`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm shadow-indigo-200"
                    >
                      Ajukan Peminjaman
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalHalaman > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Halaman <span className="font-medium text-slate-900">{halamanSaatIni}</span> dari {totalHalaman}
            </span>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => padaPerubahanHalaman(halamanSaatIni - 1)}
                disabled={halamanSaatIni === 1}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalHalaman }).map((_, i) => {
                  const num = i + 1;
                  return (
                     <button
                        key={num}
                        onClick={() => padaPerubahanHalaman(num)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                          halamanSaatIni === num
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {num}
                      </button>
                  );
                })}
              </div>

              <button 
                onClick={() => padaPerubahanHalaman(halamanSaatIni + 1)}
                disabled={halamanSaatIni === totalHalaman}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}