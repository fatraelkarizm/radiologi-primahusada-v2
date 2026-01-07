import React from "react";

// Gunakan tipe yang sudah ada di XRayDepartment
type XrayExamination = {
  id: number;
  patient_id: number;
  doctor_id?: number;
  examination_type: string;
  examination_date: string;
  status: string;
  notes?: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
  gender?: string;

  // Sesuaikan dengan struktur yang sudah ada
  patients?: {
    name: string;
    age: number;
    gender: string;
    address?: string;
    phone?: string;
    id?: number | string;
    // Tambahkan properties yang mungkin ada
    examination?: string;
    clinic?: string;
    review?: string;
  };
  doctors?: { name: string };
};

// Gunakan tipe Patient yang sudah ada di Patients.tsx
type Patient = {
  id: string | number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  examination?: string;
  clinic?: string;
  review?: string;
  // Tambahkan optional untuk menghindari error
  status?: string;
  created_at?: string;
};

type Doctor = {
  id: number;
  name: string;
  specialization?: string;
};

interface PrintLayoutProps {
  xrayData?: XrayExamination;
  patient?: Patient;
  doctor?: Doctor;
}

// Fungsi helper untuk memformat tanggal
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Fungsi helper untuk membuat nomor pemeriksaan
const generateExaminationNumber = (xrayData: XrayExamination) => {
  if (xrayData.created_at) {
    const date = new Date(xrayData.created_at);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `PH-${year}${month}${day}${hours}${minutes}${seconds}`;
  }
  return `PH-manual-${xrayData.id}`;
};

export const PrintLayout = React.forwardRef<HTMLDivElement, PrintLayoutProps>(
  ({ xrayData, patient, doctor }, ref) => {
    // Gunakan data dari xrayData atau fallback ke props
    const patientData = xrayData?.patients || patient;
    const doctorData = xrayData?.doctors || doctor;

    // Safe access untuk data yang mungkin tidak ada
    const getPatientExamination = () => {
      return (
        xrayData?.examination_type ||
        (patientData as Patient)?.examination ||
        "N/A"
      );
    };

    const getPatientClinic = () => {
      return (
        (patientData as Patient)?.clinic ||
        xrayData?.notes ||
        "Tidak ada data klinis."
      );
    };

    const getPatientReview = () => {
      return (patientData as Patient)?.review || "Tidak ada kesan.";
    };

    return (
      <div ref={ref}>
        <style type="text/css" media="print">
          {`
            @page { size: A5; margin: 0; }
            body, html { margin: 0; padding: 0; }
          `}
        </style>

        <div className="w-[148mm] min-h-[210mm] mx-auto p-8 bg-white text-black font-sans border border-gray-400">
          {/* Header - Hanya Logo dan Nama Klinik */}
          <header className="pb-4 border-b-2 border-black">
            <div className="flex items-center gap-4">
              <img src="/uploads/Logo PH.jpg" alt="" className="w-20 h-20" />

              <div className="flex justify-center flex-col mx-auto w-auto text-center ">
                <h1 className="text-lg font-bold">KLINIK ROENTGEN DAN USG</h1>
                <h2 className="text-3xl font-bold">PRIMA HUSADA</h2>
                <p className="text-base">
                  Jl Siliwangi No 28 A Parung Kuda Telp. 0857-1932-5557
                </p>
              </div>
            </div>
          </header>

          {/* Kepada Yang Terhormat - Dipindah ke bawah garis */}
          <div className="mt-4 mb-6 flex justify-end border-2 ">
            <div className="text-sm">
              <p className="mb-2">Kepada Yang Terhormat</p>
              <p>TS: {doctorData?.name || "Dr. Sari Indah"}</p>
              <br />
              <p className="font-bold">Di Tempat</p>
            </div>
          </div>

          {/* Patient Information */}
          <div className="flex flex-row justify-between mt-6 ">
            <table className="w-1/2 border border-gray-200 border-r-0 table-layout-fixed text-sm">
              <tbody className="text-sm">
                <tr className="text-sm">
                  <th className="border border-gray-200 p-2 w-1/2 text-sm">
                    Nama Pasien
                  </th>
                  <td className="border border-gray-200 p-2 w-1/2">
                    {patientData?.name || "N/A"}
                  </td>
                </tr>
                <tr className="text-sm">
                  <th className="border border-gray-200 p-2 w-1/2">Umur</th>
                  <td className="border border-gray-200 p-2 w-1/2">
                    {patientData?.age || "N/A"} Tahun
                  </td>
                </tr>
                <tr className="text-sm">
                  <th className="border border-gray-200 p-2 w-1/2">
                    Jenis Kelamin
                  </th>
                  <td className="border border-gray-200 p-2 w-1/2">
                    {patientData?.gender || "N/A"}
                  </td>
                </tr>
                <tr className="text-sm">
                  <th className="border border-gray-200 p-2 w-1/2">Alamat</th>
                  <td className="border border-gray-200 p-2 w-1/2">
                    {patientData?.address || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="w-1/2 border border-gray-200 border-l-0 table-layout-fixed">
              <tbody>
                <tr>
                  <th className="border border-gray-200 p-2 w-1/2 text-sm">Tanggal</th>
                  <td className="border border-gray-200 p-2 w-1/2">
                    {xrayData
                      ? formatDate(xrayData.examination_date)
                      : formatDate(new Date().toISOString())}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 w-1/2 text-sm">No.</th>
                  <td className="border border-gray-200 p-2 w-1/2 text-[12px]">
                    {xrayData
                      ? generateExaminationNumber(xrayData)
                      : `PH-manual-${patientData?.id}`}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 w-1/2">
                    Pemeriksaan
                  </th>
                  <td className="border border-gray-200 p-2 w-1/2">
                    {getPatientExamination()}
                  </td>
                </tr>
                <tr>
                  <th className="border border-gray-200 p-2 w-1/2">Dokter</th>
                  <td className="border border-gray-200 p-2 w-1/2">
                    {doctorData?.name || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Results Section */}
          <section className="mt-8">
            <h3 className="text-center font-bold underline mb-6">
              HASIL PEMERIKSAAN RADIOLOGI
            </h3>
            <div className="text-sm space-y-24">
              <div>
                <span className="font-bold w-16 inline-block">Klinis</span>:{" "}
                {getPatientClinic()}
              </div>
              <div>
                <span className="font-bold">Kesan :</span>
                <p className="ml-4 mt-1 whitespace-pre-wrap">
                  {getPatientReview()}
                </p>
              </div>
            </div>
          </section>

          {/* Footer - Dokter di bawah */}
          <footer className="mt-24 flex justify-end">
            <div className="text-center text-sm">
              <p>Salam Sejawat,</p>
              <div className="h-20"></div>
              <p className="font-bold underline">
                {doctorData?.name || "Dr. Sari Indah"}
              </p>
              <p>Radiolog</p>
            </div>
          </footer>
        </div>
      </div>
    );
  },
);

PrintLayout.displayName = "PrintLayout";
