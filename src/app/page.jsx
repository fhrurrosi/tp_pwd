export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-2">
              Sistem Reservasi Ruangan
            </h1>
            <p className="text-gray-600 text-sm">Silakan login untuk melanjutkan</p>
          </div>

          {/* Temporary Navigation - will be replaced with actual login */}
          <div className="space-y-3">
            <a
              href="/ui_user/dashboard"
              className="block w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-center hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Login sebagai Pengguna
            </a>
            <a
              href="/dashboard_admin"
              className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-200 transition-all duration-200 border border-gray-300"
            >
              Login sebagai Admin
            </a>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Halaman login lengkap akan segera dibuat
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
