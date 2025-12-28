'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import Image from 'next/image';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/ui_user/dashboard',
    activeColor: 'text-gray-900',
    hoverColor: 'hover:text-blue-600',
    lineColor: 'bg-blue-600'
  },
  {
    label: 'Reservasi Ruangan',
    href: '/ui_user/reservasi-ruangan',
    activeColor: 'text-gray-900',
    hoverColor: 'hover:text-blue-600',
    lineColor: 'bg-blue-600'
  },
  {
    label: 'Riwayat Peminjaman',
    href: '/ui_user/riwayat-peminjaman',
    activeColor: 'text-gray-900',
    hoverColor: 'hover:text-blue-600',
    lineColor: 'bg-blue-600'
  },
  {
    label: 'Logout',
    href: '/ui_user/logout',
    activeColor: 'text-red-600',
    hoverColor: 'hover:text-red-600',
    lineColor: 'bg-red-600'
  },
];

export default function Navigation() {
  const jalurSaatIni = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false); // State untuk menu mobile

  const inisial = session?.user?.nama?.charAt(0).toUpperCase() ?? "U";

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50" role="navigation" aria-label="Navigasi utama">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          
          <Link href="/ui_user/dashboard" role="banner" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Logo Tempatin"
              width={150}
              height={32}
              className="object-contain w-auto h-8 md:h-10"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = jalurSaatIni === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    font-medium transition-colors duration-200 relative group 
                    ${isActive ? item.activeColor : `text-gray-700 ${item.hoverColor}`}
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                  <span className={`
                    absolute -bottom-[21px] left-0 w-full h-0.5 
                    ${item.lineColor} 
                    transition-transform duration-200 
                    ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                  `}></span>
                </Link>
              );
            })}

            <button
              className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600
              rounded-full shadow-md flex items-center justify-center
              text-white font-semibold transform hover:scale-105 transition-transform"
              title={session?.user?.nama}
            >
              {inisial}
            </button>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600
              rounded-full shadow-md flex items-center justify-center
              text-white font-semibold text-sm">
              {inisial}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100" id="mobile-menu">
          <div className="space-y-1 px-4 py-3 pb-5 shadow-inner">
            {NAV_ITEMS.map((item) => {
              const isActive = jalurSaatIni === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    block px-3 py-3 rounded-md text-base font-medium border-l-4 transition-all
                    ${isActive 
                      ? `bg-blue-50 border-blue-600 ${item.activeColor}` 
                      : `border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900`
                    }
                    ${item.label === 'Logout' ? 'text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-600' : ''}
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}