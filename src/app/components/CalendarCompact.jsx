"use client";

import React, { useState } from "react";

export default function CalendarCompact({ selected, onSelect }) {
  const hariIni = new Date();
  const [bulanSaatIni, setBulanSaatIni] = useState(
    () => new Date(hariIni.getFullYear(), hariIni.getMonth(), 1)
  );

  const tahun = bulanSaatIni.getFullYear();
  const bulan = bulanSaatIni.getMonth();
  const hariPertama = new Date(tahun, bulan, 1).getDay();
  const hariDalamBulan = new Date(tahun, bulan + 1, 0).getDate();

  const namaBulan = [
    'Januari','Februari','Maret','April','Mei','Juni',
    'Juli','Augustus','September','Oktober','November','Desember'
  ];
  const namaHari = ['M','S','S','R','K','J','S'];

  const bulanSebelumnya = () => {
    setBulanSaatIni(new Date(bulanSaatIni.getFullYear(), bulanSaatIni.getMonth() - 1, 1));
  };

  const bulanBerikutnya = () => setBulanSaatIni(new Date(bulanSaatIni.getFullYear(), bulanSaatIni.getMonth() + 1, 1));

  const apakahTanggalDinonaktifkan = (hari) => {
    const tanggalDicek = new Date(bulanSaatIni.getFullYear(), bulanSaatIni.getMonth(), hari);
    const h = new Date();
    h.setHours(0,0,0,0);
    tanggalDicek.setHours(0,0,0,0);
    return tanggalDicek < h;
  };

  const pad = (n) => String(n).padStart(2,'0');

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={bulanSebelumnya} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100">
          ‹
        </button>
        <div className="text-sm font-semibold text-slate-700">{namaBulan[bulan]} {tahun}</div>
        <button onClick={bulanBerikutnya} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100">›</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-center text-slate-500">
        {namaHari.map((w, i)=> <div key={`weekday-${i}`} className="py-1">{w}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1 mt-2">
        {Array.from({ length: hariPertama }).map((_,i)=> <div key={`e-${i}`} className="h-8" />)}
        {Array.from({ length: hariDalamBulan }).map((_,idx)=> {
          const hari = idx + 1;
          const iso = `${tahun}-${pad(bulan+1)}-${pad(hari)}`;
          const dinonaktifkan = apakahTanggalDinonaktifkan(hari);
          const isSelected = selected === iso;
          return (
            <button
              key={iso}
              onClick={() => onSelect(iso)}
              disabled={dinonaktifkan}
              className={`h-8 flex items-center justify-center rounded ${isSelected ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <span className="text-sm">{hari}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
