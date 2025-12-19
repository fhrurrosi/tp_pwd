'use client';

import { useRouter } from 'next/navigation';
import Navigation from '../../components/nav_user';
import { signOut } from 'next-auth/react';
export default function Logout() {
  // Man: Menggunakan router untuk navigasi programatik
  const router = useRouter();

  const logout = () => {
    signOut({
      redirect: false, 
    }).then(() => {
      router.push('/login'); 
    });
  };

  // Handler untuk membatalkan logout
  const batalLogout = () => {
    // Man: Redirect kembali ke dashboard saat cancel
    router.push('/ui_user/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navigation />

      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4" role="main" aria-label="Konfirmasi Logout">
        <div className="text-center">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-12">
            Yakin Mau Logout?
          </h1>

          {/* Buttons */}
          <div className="flex gap-6 justify-center">
            <button
              onClick={batalLogout}
              className="px-12 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold text-xl rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md min-w-[140px]"
              aria-label="Batalkan logout"
            >
              Tidak
            </button>
            <button
              onClick={logout}
              className="px-12 py-4 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-xl rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 min-w-[140px]"
              aria-label="Konfirmasi logout"
            >
              Ya
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
