import React from "react";
import { User, Phone, MapPin, Calendar, Hash } from "lucide-react";

// Tipe Patient masih sama
type Patient = {
  id: string | number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  status: string;
  photo_url?: string;
  created_at: string;
  examination?: string;
  clinic?: string;
  review?: string;
  doctor_id?: number;
  doctors?: { name: string };
};

// Nama interface props disesuaikan kembali
interface PrintCardLayoutProps {
  patient: Patient;
  doctor?: { name: string }; // Define the Doctor type inline as an object with a name property
}

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};


export const PrintCardLayout = React.forwardRef<HTMLDivElement, PrintCardLayoutProps>(
  ({ patient }, ref) => {
    const patientFullName = patient.name || "Nama Pasien";
    const patientInitials = patientFullName.split(' ').map(n => n[0]).join('').substring(0, 2);

    return (
      <div ref={ref}>
        {/* CSS untuk Print */}
        <style type="text/css" media="print">
          {`
            @page { size: A4; margin: 0; }
            body, html { 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact;
              width: 210mm;
              height: 297mm;
            }
          `}
        </style>

        {/* --- KONTEN CV --- */}
        <div className="w-[210mm] min-h-[297mm] bg-white flex font-sans">
          
          {/* === SIDEBAR KIRI === */}
          <aside className="w-1/3 bg-slate-800 text-white p-8 flex flex-col">
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto rounded-full border-4 border-teal-400 bg-slate-700 flex items-center justify-center overflow-hidden">
                {patient.photo_url ? (
                  <img src={patient.photo_url} alt={patient.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-teal-300">{patientInitials}</span>
                )}
              </div>
            </div>

            {/* --- Kontak --- */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-teal-400 border-b-2 border-teal-400 pb-1 mb-3">KONTAK</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" /> <span>{patient.address || "Belum ada alamat"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} /> <span>{patient.phone || "Belum ada telepon"}</span>
                </div>
              </div>
            </div>

            {/* --- Detail Pasien --- */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-teal-400 border-b-2 border-teal-400 pb-1 mb-3">DETAIL</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Umur:</strong> {patient.age} Tahun</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Status:</strong> <span className="font-semibold text-teal-300">{patient.status || 'Aktif'}</span></p>
              </div>
            </div>
            
            <div className="mt-auto text-center">
              {/* QR Code dinamis dari api.qrserver.com */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=PatientID-${patient.id}&bgcolor=1e293b&color=ffffff&qzone=1`} 
                alt="QR Code Pasien"
                className="mx-auto rounded-lg"
              />
              <p className="text-xs text-slate-400 mt-2">ID Pasien: {patient.id}</p>
            </div>
          </aside>

          {/* === KONTEN UTAMA KANAN === */}
          <main className="w-2/3 p-10 text-slate-700">
            <header className="mb-12 text-left">
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-800">{patient.name || "Nama Pasien"}</h1>
              <p className="text-md text-slate-500 mt-1">Laporan Medis Pasien per tanggal {formatDate(new Date().toISOString())}</p>
            </header>

            {/* --- Ringkasan Medis --- */}
            <section className="mb-10">
              <h2 className="text-xl font-bold text-teal-600 border-b-2 border-teal-600 pb-2 mb-4">RINGKASAN MEDIS</h2>
              <p className="text-sm leading-relaxed">
                {patient.clinic || "Tidak ada data klinis yang tercatat saat ini. Riwayat pemeriksaan detail dapat dilihat di bawah."}
              </p>
            </section>

            {/* --- Riwayat Pemeriksaan --- */}
            <section className="mb-10">
              <h2 className="text-xl font-bold text-teal-600 border-b-2 border-teal-600 pb-2 mb-4">RIWAYAT PEMERIKSAAN TERAKHIR</h2>
              <div className="flex gap-6 mt-4">
                <div className="text-sm text-right text-slate-500 w-28 flex-shrink-0">
                  <p className="font-semibold">{formatDate(patient.created_at)}</p>
                  <p>Oleh: {patient.doctors?.name || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-bold text-md text-slate-800">{patient.examination || "Pemeriksaan Umum"}</h3>
                  <blockquote className="border-l-4 border-teal-500 pl-4 mt-2 italic text-sm">
                    <p className="font-semibold">Kesan:</p>
                    <p>{patient.review || "Tidak ada kesan yang diberikan."}</p>
                  </blockquote>
                </div>
              </div>
            </section>
            
            {/* --- Footer --- */}
            <footer className="mt-auto pt-10 text-center">
              <p className="text-xs text-slate-400">
                Klinik Prima Husada | Jl Siliwangi Parung Kuda | Telp/Hp 0857-1932-5557
              </p>
              <p className="text-xs text-slate-400">
                Dokumen ini dibuat secara otomatis oleh sistem pada {new Date().toLocaleString('id-ID')}.
              </p>
            </footer>
          </main>
        </div>
      </div>
    );
  }
);

// Nama display name juga disesuaikan kembali
PrintCardLayout.displayName = "PrintCardLayout";