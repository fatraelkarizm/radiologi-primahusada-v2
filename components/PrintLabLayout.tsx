import React from 'react';

interface PrintLabLayoutProps {
  labTest: any;
}

export const PrintLabLayout = React.forwardRef<HTMLDivElement, PrintLabLayoutProps>(
  ({ labTest }, ref) => {
    return (
      <div ref={ref} className="p-8 bg-white">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Klinik Prima Husada</h1>
          <p className="text-sm text-gray-600">Jl. Kesehatan No. 1, Jakarta</p>
          <p className="text-sm text-gray-600">Telp: 021-12345678</p>
        </div>

        <div className="border-t-2 border-b-2 border-gray-300 py-4 mb-6">
          <h2 className="text-xl font-bold text-center">HASIL PEMERIKSAAN LABORATORIUM</h2>
        </div>

        <div className="mb-6">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 w-32">No. Lab</td>
                <td className="py-1">: {labTest.testCode}</td>
              </tr>
              <tr>
                <td className="py-1">Nama Pasien</td>
                <td className="py-1">: {labTest.patientName}</td>
              </tr>
              <tr>
                <td className="py-1">Tanggal</td>
                <td className="py-1">: {new Date(labTest.testDate).toLocaleDateString('id-ID')}</td>
              </tr>
              <tr>
                <td className="py-1">Jenis Tes</td>
                <td className="py-1">: {labTest.testType}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-8">
          <h3 className="font-bold mb-3">Hasil Pemeriksaan:</h3>
          {labTest.results ? (
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Parameter</th>
                  <th className="border border-gray-300 p-2 text-left">Hasil</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(labTest.results).map(([key, value]) => (
                  <tr key={key}>
                    <td className="border border-gray-300 p-2 capitalize">{key}</td>
                    <td className="border border-gray-300 p-2">{String(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 italic">Hasil belum tersedia</p>
          )}
        </div>

        {labTest.notes && (
          <div className="mb-8">
            <h3 className="font-bold mb-2">Catatan:</h3>
            <p className="text-sm">{labTest.notes}</p>
          </div>
        )}

        <div className="mt-12 flex justify-end">
          <div className="text-center">
            <p className="mb-16">Petugas Laboratorium,</p>
            <p className="font-bold border-t border-gray-800 pt-1">
              {labTest.doctor || '________________'}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

PrintLabLayout.displayName = 'PrintLabLayout';