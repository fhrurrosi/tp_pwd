'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import Image from 'next/image';
export default function Navigation() {
  const jalurSaatIni = usePathname();
  const { data: session } = useSession();

  const inisial =
    session?.user?.nama?.charAt(0).toUpperCase() ?? "U";
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50" role="navigation" aria-label="Navigasi utama">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/ui_user/dashboard" role="banner">
            <Image
              src="/logo.png"
              alt="Logo Tempatin"
              width={150}
              height={40}
              className="object-contain"
              priority
            />
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/ui_user/dashboard"
              className={`font-medium transition-colors duration-200 relative group ${jalurSaatIni === '/ui_user/dashboard'
                ? 'text-gray-900'
                : 'text-gray-700 hover:text-blue-600'
                }`}
              aria-current={jalurSaatIni === '/ui_user/dashboard' ? 'page' : undefined}
              aria-label="Dashboard"
            >
              Dashboard
              <span className={`absolute -bottom-[17px] left-0 w-full h-0.5 bg-blue-600 transition-transform duration-200 ${jalurSaatIni === '/ui_user/dashboard'
                ? 'scale-x-100'
                : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
            </Link>
            <Link
              href="/ui_user/reservasi-ruangan"
              className={`font-medium transition-colors duration-200 relative group ${jalurSaatIni === '/ui_user/reservasi-ruangan'
                ? 'text-gray-900'
                : 'text-gray-700 hover:text-blue-600'
                }`}
              aria-current={jalurSaatIni === '/ui_user/reservasi-ruangan' ? 'page' : undefined}
              aria-label="Reservasi Ruangan"
            >
              Reservasi Ruangan
              <span className={`absolute -bottom-[17px] left-0 w-full h-0.5 bg-blue-600 transition-transform duration-200 ${jalurSaatIni === '/ui_user/reservasi-ruangan'
                ? 'scale-x-100'
                : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
            </Link>
            <Link
              href="/ui_user/riwayat-peminjaman"
              className={`font-medium transition-colors duration-200 relative group ${jalurSaatIni === '/ui_user/riwayat-peminjaman'
                ? 'text-gray-900'
                : 'text-gray-700 hover:text-blue-600'
                }`}
              aria-current={jalurSaatIni === '/ui_user/riwayat-peminjaman' ? 'page' : undefined}
              aria-label="Riwayat Peminjaman"
            >
              Riwayat Peminjaman
              <span className={`absolute -bottom-[17px] left-0 w-full h-0.5 bg-blue-600 transition-transform duration-200 ${jalurSaatIni === '/ui_user/riwayat-peminjaman'
                ? 'scale-x-100'
                : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
            </Link>
            <Link
              href="/ui_user/logout"
              className={`font-medium transition-colors duration-200 relative group ${jalurSaatIni === '/ui_user/logout'
                ? 'text-red-600'
                : 'text-gray-700 hover:text-red-600'
                }`}
              aria-current={jalurSaatIni === '/ui_user/logout' ? 'page' : undefined}
              aria-label="Logout"
            >
              Logout
              <span className={`absolute -bottom-[17px] left-0 w-full h-0.5 bg-red-600 transition-transform duration-200 ${jalurSaatIni === '/ui_user/logout'
                ? 'scale-x-100'
                : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
            </Link>

            <button
              className="w-10 h-10 bg-linear-to-br from-blue-400 to-blue-600
              rounded-full shadow-md flex items-center justify-center
              text-white font-semibold"
              title={session?.user?.nama}
            >
              {inisial}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
