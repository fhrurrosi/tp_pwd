'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Navigation from '@/app/components/nav_admin';
import { LogOut, ShieldAlert } from 'lucide-react';

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const batalLogout = () => {
    router.push('/ui_admin/dashboard');
  };

  const logout = async () => {
    setLoading(true);
    await signOut({ redirect: false });
    window.location.href = '/login';
  };

  return (
    <>
      <Navigation />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-lg rounded-xl bg-white p-10 shadow-lg text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <ShieldAlert className="h-7 w-7 text-red-600" />
          </div>

          <h1 className="mb-3 text-2xl font-bold text-gray-900">
            Anda yakin ingin keluar?
          </h1>

          <div className="flex justify-center gap-6">
            <button
              type="button"
              onClick={batalLogout}
              disabled={loading}
              className="
                px-8 py-3 rounded-lg
                border border-gray-300
                text-gray-700 font-semibold
                hover:bg-gray-100
                transition
                disabled:opacity-50
              "
            >
              Batal
            </button>

            <button
              type="button"
              onClick={logout}
              disabled={loading}
              className="
                px-8 py-3 rounded-lg
                bg-red-600 text-white font-semibold
                hover:bg-red-700
                transition
                shadow-md hover:shadow-lg
                disabled:opacity-50
                inline-flex items-center gap-2
              "
            >
              <LogOut className="h-5 w-5" />
              {loading ? 'Keluar...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
