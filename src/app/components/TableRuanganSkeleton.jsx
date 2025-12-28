'use client';

export default function TabelRuanganSkeleton({ rows = 5 }) {
  return (
    <div className="mt-8 animate-pulse">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
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
