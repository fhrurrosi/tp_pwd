'use client';

export default function TabelRuanganSkeleton({ rows = 5 }) {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 gap-4 md:hidden animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 w-2/3">
                <div className="h-5 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
              <div className="h-6 bg-gray-100 rounded-full w-16" />
            </div>

            <div className="space-y-3 border-t border-slate-50 pt-3">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>

            <div className="mt-2 h-10 bg-gray-200 rounded-lg w-full" />
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg animate-pulse">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              {Array.from({ length: 5 }).map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-6 py-5 border-t border-gray-200 flex justify-center gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 bg-gray-200 rounded-xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
}