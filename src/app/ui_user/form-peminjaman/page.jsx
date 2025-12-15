'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from '../../components/nav_user';


export default function HalamanFormPeminjaman() {
  // Man: Router untuk navigasi programatik
  const router = useRouter();
  // Man: Mendapatkan parameter dari URL
  const parameterPencarian = useSearchParams();
  // Man: State untuk menyimpan data form
  const [dataForm, setDataForm] = useState({
    ruangan: '',
    tanggal: '',
    jamMulai: '',
    jamSelesai: '',
    keperluan: '',
    dokumen: null,
  });

  // Man: State untuk minimum date dan opsi waktu
  const [tanggalMinimum, setTanggalMinimum] = useState('');
  const [opsiWaktu, setOpsiWaktu] = useState([]);

  /**
   * useEffect untuk inisialisasi tanggal minimum dan opsi waktu
   */
  useEffect(() => {
    const hariIni = new Date();
    const tanggalHariIni = hariIni.toISOString().split('T')[0];
    setTanggalMinimum(tanggalHariIni);

    // mengatur waktu dari 07:00 sampai 16:00
    const waktu = [];
    for (let jam = 7; jam <= 16; jam++) {
      const stringWaktu = `${jam.toString().padStart(2, '0')}:00`;
      waktu.push(stringWaktu);
    }
    setOpsiWaktu(waktu);
  }, []);

  /**
   * useEffect untuk mengisi form dengan data dari ruangan dan tanggal yang dituju
   */
  useEffect(() => {
    const ruangan = parameterPencarian.get('ruangan');
    const tanggal = parameterPencarian.get('tanggal');
    
    setDataForm(sebelumnya => ({
      ...sebelumnya,
      ruangan: ruangan || '',
      tanggal: tanggal || '',
    }));
  }, [parameterPencarian]);

  
  const tanganiPerubahan = (e) => {
    const { name, value } = e.target;
    
    // Validasi tanggal - tidak boleh tanggal di masa lalu
    if (name === 'tanggal' && value) {
      const tanggalTerpilih = new Date(value);
      const hariIni = new Date();
      hariIni.setHours(0, 0, 0, 0);
      tanggalTerpilih.setHours(0, 0, 0, 0);
      
      if (tanggalTerpilih < hariIni) {
        alert('Anda tidak bisa memilih tanggal di masa lalu! Silakan pilih tanggal hari ini atau setelahnya.');
        return;
      }
    }
    
    setDataForm(sebelumnya => ({
      ...sebelumnya,
      [name]: value
    }));
  };

  
  // Handler untuk upload file dokumen
  const tanganiPerubahanFile = (e) => {
    const file = e.target.files[0];
    setDataForm(sebelumnya => ({
      ...sebelumnya,
      dokumen: file
    }));
  };

  // Handler untuk membatalkan form dan kembali ke halaman sebelumnya
  const tanganiBatal = () => {
    router.back();
  };

  // Handler untuk submit form peminjaman
  const tanganiSubmit = async (e) => {
    e.preventDefault();
    // panggil API untuk submit dataForm
    console.log('Form submitted:', dataForm);
    alert('Peminjaman berhasil diajukan!');
    router.push('/ui_user/dashboard');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-8 py-12" role="main" aria-label="Form Peminjaman Ruangan">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Isi Formulir Berikut :</h1>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={tanganiSubmit} className="space-y-6">
              {/* Ruangan */}
              <div className="grid grid-cols-3 items-center border-b border-gray-200 pb-6">
                <label className="text-xl font-bold text-gray-900">Ruangan</label>
                <div className="col-span-2">
                  <div className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 text-lg">
                    <span className="font-semibold">{dataForm.ruangan || '-'}</span>
                  </div>
                  <input
                    type="hidden"
                    name="ruangan"
                    value={dataForm.ruangan}
                  />
                </div>
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-3 items-center border-b border-gray-200 pb-6">
                <label className="text-xl font-bold text-gray-900">Tanggal</label>
                <div className="col-span-2">
                  <div className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 text-lg">
                    <span className="font-semibold">
                      {dataForm.tanggal 
                        ? new Date(dataForm.tanggal + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                        : '-'
                      }
                    </span>
                  </div>
                  <input
                    type="hidden"
                    name="tanggal"
                    value={dataForm.tanggal}
                  />
                </div>
              </div>

              {/* Jam Mulai */}
              <div className="grid grid-cols-3 items-center border-b border-gray-200 pb-6">
                <label className="text-xl font-bold text-gray-900">Jam Mulai</label>
                <div className="col-span-2">
                  <select
                    name="jamMulai"
                    value={dataForm.jamMulai}
                    onChange={tanganiPerubahan}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-lg transition-all duration-200 bg-white"
                    required
                  >
                    <option value="">Pilih Jam Mulai</option>
                    {opsiWaktu.map((waktu) => (
                      <option key={waktu} value={waktu}>
                        {waktu}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Jam Selesai */}
              <div className="grid grid-cols-3 items-center border-b border-gray-200 pb-6">
                <label className="text-xl font-bold text-gray-900">Jam Selesai</label>
                <div className="col-span-2">
                  <select
                    name="jamSelesai"
                    value={dataForm.jamSelesai}
                    onChange={tanganiPerubahan}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-lg transition-all duration-200 bg-white"
                    required
                  >
                    <option value="">Pilih Jam Selesai</option>
                    {opsiWaktu.map((waktu) => (
                      <option key={waktu} value={waktu} disabled={dataForm.jamMulai && waktu <= dataForm.jamMulai}>
                        {waktu}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Keperluan */}
              <div className="grid grid-cols-3 items-center border-b border-gray-200 pb-6">
                <label className="text-xl font-bold text-gray-900">keperluan</label>
                <div className="col-span-2">
                  <input
                    type="text"
                    name="keperluan"
                    value={dataForm.keperluan}
                    onChange={tanganiPerubahan}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-lg transition-all duration-200"
                    placeholder="Masukkan keperluan"
                    required
                  />
                </div>
              </div>

              {/* Unggah Dokumen */}
              <div className="grid grid-cols-3 items-start border-b border-gray-200 pb-6">
                <label className="text-xl font-bold text-gray-900 pt-3">
                  Unggah Dokumen<br/>
                  Pendukung(Opsional)
                </label>
                <div className="col-span-2">
                  <div className="relative">
                    <input
                      type="file"
                      name="dokumen"
                      onChange={tanganiPerubahanFile}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="block w-full px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition-all duration-200 cursor-pointer bg-gray-50 hover:bg-blue-50"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-gray-600">
                          {dataForm.dokumen ? dataForm.dokumen.name : 'Pilih file atau drag & drop di sini'}
                        </span>
                      </div>
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Format: PDF, DOC, DOCX (Max 5MB)</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={tanganiBatal}
                  className="flex-1 px-8 py-4 bg-gray-200 text-gray-800 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Batalkan Peminjaman
                </button>
                <button
                  type="submit"
                  className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Ajukan Peminjaman
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
