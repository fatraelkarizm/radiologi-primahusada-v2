import React from "react";

// Types
type Patient = {
  id: string | number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
};

type Doctor = {
  id: number;
  name: string;
  specialization?: string;
};

// Tipe LabTest yang BENAR (cocok dengan API)
type LabTest = {
  id: string | number;
  patientId: string | number;
  patientName: string;
  testType: string;
  category: string;
  date: string;
  doctor: string; // Ini bisa jadi nama string saja jika tidak ada relasi lengkap
  status: string;
  priority: string;
  results: { [key: string]: any };
  notes: string;
  patients: Patient; // Objek pasien yang lengkap ada di sini
  doctors: Doctor;   // Objek dokter yang lengkap ada di sini
};

// Interface props yang BENAR (lebih simpel)
interface PrintLabLayoutProps {
  labTest: Omit<LabTest, 'patients' | 'doctors'> & { patients?: Patient; doctors?: Doctor };
}

// Data labTestPackages
const labTestPackages = {
  Hematologi: {
    name: "Pemeriksaan Hematologi Lengkap",
    parameters: [
      { name: "Hemoglobin", unit: "g/dL", normalValue: "L: 13-18 g/dL, P: 12-16 g/dL" },
      { name: "Leukosit", unit: "u/L", normalValue: "3200-10000 u/L" },
      { name: "Eritrosit", unit: "Juta u/L", normalValue: "4.1-5.1 Juta u/L" },
      { name: "Trombosit", unit: "u/L", normalValue: "150000-450000 u/L" },
      { name: "Hematokrit", unit: "%", normalValue: "L: 40-50%, P: 35-45%" },
      { name: "Staff", unit: "%", normalValue: "0-4%" },
      { name: "Netrofil Segmen", unit: "%", normalValue: "40-71%" },
      { name: "Limfosit", unit: "%", normalValue: "23-50%" },
      { name: "Monosit", unit: "%", normalValue: "4-10%" },
      { name: "LED", unit: "mm/jam", normalValue: "L: 0-15/Jam, P: 0-20/Jam" }
    ]
  },
  "Kimia Darah": {
    name: "Pemeriksaan Kimia Darah",
    parameters: [
      { name: "SGOT", unit: "IU/L", normalValue: "4-40 IU/L" },
      { name: "SGPT", unit: "IU/L", normalValue: "7-56 IU/L" },
      { name: "Ureum", unit: "mg/dL", normalValue: "10-50 mg/dL" },
      { name: "Kreatinin", unit: "mg/dL", normalValue: "L: 0.5-1.1 mg/dL, P: 0.6-0.9 mg/dL" }
    ]
  },
  // ... sisa data labTestPackages
};

// Helper functions
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const getTestParameters = (category: string) => {
  return labTestPackages[category as keyof typeof labTestPackages]?.parameters || [];
};

function checkIfAbnormal(result: string, normalRange: string): boolean {
  if (!result || !normalRange || result === "-") return false;
  const numericResult = parseFloat(result);
  if (isNaN(numericResult)) return false;
  const ranges = normalRange.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/g);
  if (ranges && ranges.length > 0) {
    const range = ranges[0].match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
    if (range) {
      const min = parseFloat(range[1]);
      const max = parseFloat(range[2]);
      return numericResult < min || numericResult > max;
    }
  }
  if (normalRange.includes("<")) {
    const maxValue = parseFloat(normalRange.replace(/[<>]/g, ""));
    return numericResult > maxValue;
  }
  if (normalRange.includes(">")) {
    const minValue = parseFloat(normalRange.replace(/[<>]/g, ""));
    return numericResult < minValue;
  }
  return false;
}

function isHighValue(result: string, normalRange: string): boolean {
  const numericResult = parseFloat(result);
  if (isNaN(numericResult)) return false;
  const ranges = normalRange.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/g);
  if (ranges && ranges.length > 0) {
    const range = ranges[0].match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
    if (range) {
      const max = parseFloat(range[2]);
      return numericResult > max;
    }
  }
  if (normalRange.includes("<")) {
    const maxValue = parseFloat(normalRange.replace(/[<>]/g, ""));
    return numericResult > maxValue;
  }
  return false;
}

export const PrintLabLayout = React.forwardRef<HTMLDivElement, PrintLabLayoutProps>(
  ({ labTest }, ref) => {
    console.log(labTest);
    // Data pasien & dokter diambil dari dalam objek labTest
    const patientData = labTest.patients;
    const doctorData = labTest.doctors;


    const testParameters = getTestParameters(labTest.category);

    const groupedParameters = () => {
      const groups: { [key: string]: any[] } = {};
      if (labTest.category === "Hematologi") {
        groups["Hematologi"] = testParameters.filter(p => ["Hemoglobin", "Leukosit", "Eritrosit", "Trombosit", "Hematokrit"].includes(p.name));
        groups["Diff count"] = testParameters.filter(p => ["Staff", "Netrofil Segmen", "Limfosit", "Monosit"].includes(p.name));
        groups["Laju Endap Darah"] = testParameters.filter(p => ["LED"].includes(p.name));
      } else if (labTest.category === "Kimia Darah") {
        groups["Kimia Darah"] = [];
        groups["Faal Hati"] = testParameters.filter(p => ["SGOT", "SGPT"].includes(p.name));
        groups["Faal Ginjal"] = testParameters.filter(p => ["Ureum", "Kreatinin"].includes(p.name));
      } else {
        groups[labTest.category] = testParameters;
      }
      return groups;
    };

    return (
      <div ref={ref}>
        <style type="text/css" media="print">{`
            @page { size: A4; margin: 0; }
            body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; -webkit-print-color-adjust: exact; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000; padding: 4px 8px; text-align: left; font-size: 12px; }
        `}</style>

        <div className="w-full bg-white text-black font-sans text-sm p-[15mm]">
          <div className="text-center mb-4">
            <h1 className="text-lg font-bold underline mb-4">HASIL PEMERIKSAAN LABORATORIUM</h1>
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
              <div className="flex">
                <span className="w-16 inline-block font-medium">Nama</span>
                <span className="mr-2">:</span>
                <span className="font-medium">{patientData?.name}</span>
              </div>
              <div className="flex">
                <span className="w-16 inline-block font-medium">Alamat</span>
                <span className="mr-2">:</span>
                <span>{patientData?.address}</span>
              </div>
              <div className="flex">
                <span className="w-16 inline-block font-medium">Umur</span>
                <span className="mr-2">:</span>
                <span>{patientData?.age ? `${patientData.age} Tahun` : "N/A Tahun"}</span>
              </div>
              <div className="flex">
                <span className="w-16 inline-block font-medium">Pengirim</span>
                <span className="mr-2">:</span>
                <span>{doctorData?.name}</span>
              </div>
              <div className="flex">
                <span className="w-16 inline-block font-medium">Tanggal</span>
                <span className="mr-2">:</span>
                <span>{formatDate(labTest.date)}</span>
              </div>
              <div className="flex">
                <span className="w-16 inline-block font-medium">No Lab</span>
                <span className="mr-2">:</span>
                <span>{labTest.id}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-black font-bold text-center w-1/4">Pemeriksaan</th>
                  <th className="p-2 border border-black font-bold text-center w-1/4">Hasil</th>
                  <th className="p-2 border border-black font-bold text-center w-1/4">Nilai Rujukan</th>
                  <th className="p-2 border border-black font-bold text-center w-1/4">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedParameters()).map(([groupName, parameters]) => (
                  <React.Fragment key={groupName}>
                    <tr>
                      <td className="p-2 border border-black font-bold bg-gray-50" colSpan={4}>{groupName}</td>
                    </tr>
                    {parameters.map((param, index) => {
                      const result = labTest.results[param.name] || "";
                      const isAbnormal = checkIfAbnormal(result, param.normalValue);
                      return (
                        <tr key={index}>
                          <td className="p-2 border border-black pl-4">- {param.name}</td>
                          <td className={`p-2 border border-black text-center font-medium ${isAbnormal ? 'text-red-600 font-bold' : ''}`}>{result || "-"}</td>
                          <td className="p-2 border border-black text-center">{param.normalValue}</td>
                          <td className="p-2 border border-black text-center">
                            {isAbnormal && result ? (<span className="text-red-600 font-bold">{isHighValue(result, param.normalValue) ? "↑" : "↓"}</span>) : ""}
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <div className="font-bold mb-1">Catatan:</div>
            <div className="text-sm">{labTest.notes || "X"}</div>
          </div>

          <div className="flex justify-end mt-8">
            <div className="text-center">
              <div className="mb-1">Petugas Lab</div>
              <div className="h-16"></div>
              <div className="font-bold underline">
                {doctorData?.name && doctorData.specialization?.toLowerCase().includes('patologi') ? doctorData.name : "Rizka Fuji Lestary, S.Tr. Kes"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrintLabLayout.displayName = "PrintLabLayout";