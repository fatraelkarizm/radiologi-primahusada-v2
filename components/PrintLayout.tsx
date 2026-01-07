import React from 'react';

interface PrintLayoutProps {
  xrayData: any;
  patient?: any;
  doctor?: any;
}

export const PrintLayout = React.forwardRef<HTMLDivElement, PrintLayoutProps>(
  ({ xrayData, patient, doctor }, ref) => {
    return (
      <div ref={ref} className="p-8 bg-white">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Klinik Prima Husada</h1>
          <p className="text-sm text-gray-600">Jl. Kesehatan No. 1, Jakarta</p>
          <p className="text-sm text-gray-600">Telp: 021-12345678</p>
        </div>

        <div className="border-t-2 border-b-2 border-gray-300 py-4 mb-6">
          <h2 className="text-xl font-bold text-center">HASIL PEMERIKSAAN RADIOLOGI</h2>
        </div>

        <div className="mb-6">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 w-32">No. Pemeriksaan</td>
                <td className="py-1">: XR{String(xrayData.id).padStart(3, '0')}</td>
              </tr>
              <tr>
                <td className="py-1">Nama Pasien</td>
                <td className="py-1">: {patient?.name || '-'}</td>
              </tr>
              <tr>
                <td className="py-1">Tanggal</td>
                <td className="py-1">: {new Date(xrayData.examination_date || xrayData.examinationDate).toLocaleDateString('id-ID')}</td>
              </tr>
              <tr>
                <td className="py-1">Jenis Pemeriksaan</td>
                <td className="py-1">: {xrayData.examination_type || xrayData.examinationType}</td>
              </tr>
              <tr>
                <td className="py-1">Dokter Pengirim</td>
                <td className="py-1">: {doctor?.name || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {xrayData.findings && (
          <div className="mb-8">
            <h3 className="font-bold mb-2">Hasil Pembacaan:</h3>
            <p className="text-sm whitespace-pre-wrap">{xrayData.findings}</p>
          </div>
        )}

        {xrayData.notes && (
          <div className="mb-8">
            <h3 className="font-bold mb-2">Catatan:</h3>
            <p className="text-sm">{xrayData.notes}</p>
          </div>
        )}

        <div className="mt-12 flex justify-end">
          <div className="text-center">
            <p className="mb-16">Dokter Radiologi,</p>
            <p className="font-bold border-t border-gray-800 pt-1">
              ________________
            </p>
          </div>
        </div>
      </div>
    );
  }
);

PrintLayout.displayName = 'PrintLayout';
