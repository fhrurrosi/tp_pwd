"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Nav() {
  const pathname = usePathname() || "/";
  const router = useRouter();

  const items = [
    { label: "Dashboard", href: "/ui_admin/dashboard" },
    { label: "Manajemen Ruangan", href: "/ui_admin/manajemen-ruangan" },
    { label: "Persetujuan", href: "/ui_admin/approval" },
    { label: "Laporan", href: "/ui_admin/laporan" },
  ];

  const go = (href) => {
    router.push(href);
  };

  return (
    <header className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* left: logo */}
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold">logo</div>
          </div>

          {/* center: nav items */}
          <nav className="hidden md:flex items-center gap-8">
            {items.map((it) => {
              const active = pathname.startsWith(it.href);
              return (
                <button
                  key={it.href}
                  onClick={() => go(it.href)}
                  className={`text-sm ${active ? 'font-semibold text-black' : 'text-gray-700 hover:text-black'}`}
                >
                  {it.label}
                </button>
              );
            })}
          </nav>

          {/* right: logout / profile */}
          <div className="flex items-center gap-4">
            <button onClick={() => go('/ui_user/logout')} className="text-sm text-gray-700 hover:text-black">Logout</button>
            <div className="w-8 h-8 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    </header>
  );
}
