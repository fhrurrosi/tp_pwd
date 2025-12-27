'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/ui_admin/dashboard',
    activeColor: 'text-gray-900',
    hoverColor: 'hover:text-blue-600',
    underline: 'bg-blue-600',
  },
  {
    label: 'Manajemen Ruangan',
    href: '/ui_admin/manajemen-ruangan',
    activeColor: 'text-gray-900',
    hoverColor: 'hover:text-blue-600',
    underline: 'bg-blue-600',
  },
  {
    label: 'Persetujuan',
    href: '/ui_admin/approval',
    activeColor: 'text-gray-900',
    hoverColor: 'hover:text-blue-600',
    underline: 'bg-blue-600',
  },
  {
    label: 'Logout',
    href: '/ui_admin/logout',
    activeColor: 'text-red-600',
    hoverColor: 'hover:text-red-600',
    underline: 'bg-red-600',
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const inisial = session?.user?.nama?.charAt(0).toUpperCase() ?? 'U';

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">logo</div>

          <div className="flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    font-medium relative group transition-colors duration-200
                    ${isActive ? item.activeColor : `text-gray-700 ${item.hoverColor}`}
                  `}
                >
                  {item.label}

                  <span
                    className={`
                      absolute -bottom-[17px] left-0 w-full h-0.5
                      ${item.underline}
                      transition-transform duration-200
                      ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                    `}
                  />
                </Link>
              );
            })}

            <button
              className="
                w-10 h-10 rounded-full
                bg-linear-to-br from-blue-400 to-blue-600
                shadow-md flex items-center justify-center
                text-white font-semibold
              "
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
