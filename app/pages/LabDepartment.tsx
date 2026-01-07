import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient"; // Import supabase client
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  FlaskConical,
  TestTube,
  Microscope,
  Calendar,
  User,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Printer,
  TrendingUp,
  TrendingDown,
  X,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { PrintLabLayout } from "@/components/PrintLabLayout";

// Lab Test Packages dengan nilai rujukan tetap
const labTestPackages = {
  Hematologi: {
    name: "Pemeriksaan Hematologi Lengkap",
    parameters: [
      {
        name: "Hemoglobin",
        unit: "g/dL",
        normalValue: "L: 13-18 g/dL, P: 12-16 g/dL",
      },
      { name: "Leukosit", unit: "u/L", normalValue: "3200-10000 u/L" },
      { name: "Eritrosit", unit: "Juta u/L", normalValue: "4.1-5.1 Juta u/L" },
      { name: "Trombosit", unit: "u/L", normalValue: "150000-450000 u/L" },
      { name: "Hematokrit", unit: "%", normalValue: "L: 40-50%, P: 35-45%" },
      { name: "Staff", unit: "%", normalValue: "0-4%" },
      { name: "Netrofil Segmen", unit: "%", normalValue: "40-71%" },
      { name: "Limfosit", unit: "%", normalValue: "23-50%" },
      { name: "Monosit", unit: "%", normalValue: "4-10%" },
      { name: "LED", unit: "mm/jam", normalValue: "L: 0-15/Jam, P: 0-20/Jam" },
    ],
  },
  "Kimia Darah": {
    name: "Pemeriksaan Kimia Darah",
    parameters: [
      { name: "SGOT", unit: "IU/L", normalValue: "4-40 IU/L" },
      { name: "SGPT", unit: "IU/L", normalValue: "7-56 IU/L" },
      { name: "Ureum", unit: "mg/dL", normalValue: "10-50 mg/dL" },
      {
        name: "Kreatinin",
        unit: "mg/dL",
        normalValue: "L: 0.5-1.1 mg/dL, P: 0.6-0.9 mg/dL",
      },
    ],
  },
  "Kimia Klinik": {
    name: "Profil Lipid",
    parameters: [
      { name: "Kolesterol Total", unit: "mg/dL", normalValue: "<200 mg/dL" },
      { name: "HDL", unit: "mg/dL", normalValue: ">40 mg/dL" },
      { name: "LDL", unit: "mg/dL", normalValue: "<100 mg/dL" },
      { name: "Trigliserida", unit: "mg/dL", normalValue: "<150 mg/dL" },
      { name: "Gula Darah Puasa", unit: "mg/dL", normalValue: "70-100 mg/dL" },
      { name: "Gula Darah 2PP", unit: "mg/dL", normalValue: "<140 mg/dL" },
    ],
  },
  Mikrobiologi: {
    name: "Pemeriksaan Mikrobiologi",
    parameters: [
      { name: "Bakteri", unit: "", normalValue: "Negatif" },
      { name: "Jamur", unit: "", normalValue: "Negatif" },
      { name: "Sensitivitas", unit: "", normalValue: "Sesuai hasil kultur" },
    ],
  },
  Serologi: {
    name: "Pemeriksaan Serologi",
    parameters: [
      { name: "HBsAg", unit: "", normalValue: "Non Reaktif" },
      { name: "Anti HIV", unit: "", normalValue: "Non Reaktif" },
      { name: "VDRL", unit: "", normalValue: "Non Reaktif" },
      { name: "Dengue NS1", unit: "", normalValue: "Negatif" },
    ],
  },
  Urinalisis: {
    name: "Pemeriksaan Urine Lengkap",
    parameters: [
      { name: "Warna", unit: "", normalValue: "Kuning Jernih" },
      { name: "Protein", unit: "", normalValue: "Negatif" },
      { name: "Glukosa", unit: "", normalValue: "Negatif" },
      { name: "Leukosit", unit: "/LPB", normalValue: "0-5 /LPB" },
      { name: "Eritrosit", unit: "/LPB", normalValue: "0-2 /LPB" },
    ],
  },
};

// Types - Disesuaikan dengan struktur PrintLabLayout
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

type LabTest = {
  id: string;
  patientId: string;
  patientName: string;
  testType: string;
  category: string;
  date: string;
  doctor: string;
  status: string;
  priority: string;
  results: { [key: string]: any };
  notes: string;
  // Menambahkan properti yang dibutuhkan oleh PrintLabLayout
  patients?: Patient;
  doctors?: Doctor;
};

export default function LabDepartment() {
  // --- Authentication State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // State untuk loading dan error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State Management
  const [labTestsData, setLabTestsData] = useState<LabTest[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<LabTest | null>(null);

  // Selected test states
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [editingTest, setEditingTest] = useState<LabTest | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTestType, setSelectedTestType] = useState("");

  // Print states
  const [printSearchTerm, setPrintSearchTerm] = useState("");
  const [labTestToPrint, setLabTestToPrint] = useState<LabTest | null>(null);
  const printLabComponentRef = useRef<HTMLDivElement>(null);

  // Form data for new/edit lab test
  const [formData, setFormData] = useState({
    patientId: "",
    category: "",
    testType: "",
    priority: "Normal",
    doctorId: "",
    date: "",
    notes: "",
    status: "Menunggu Sample",
  });

  // Dynamic test results based on selected package
  const [testResults, setTestResults] = useState<{ [key: string]: string }>({});

  // Print functionality
  const handleLabPrint = useReactToPrint({
    contentRef: printLabComponentRef,
    onAfterPrint: () => setLabTestToPrint(null),
  });

  // Helper function untuk menggabungkan data lab test dengan patient dan doctor
  const enrichLabTestWithRelations = (labTest: LabTest): LabTest => {
    const patient = patients.find((p) => String(p.id) === String(labTest.patientId));
    const doctor = doctors.find((d) => d.name === labTest.doctor || String(d.id) === String(formData.doctorId));
    
    return {
      ...labTest,
      patients: patient,
      doctors: doctor,
    };
  };

  const triggerLabPrint = (labTest: LabTest) => {
    // Enrich lab test dengan data patient dan doctor sebelum print
    const enrichedLabTest = enrichLabTestWithRelations(labTest);
    console.log("Data yang akan dicetak:", enrichedLabTest);
    setLabTestToPrint(enrichedLabTest);
  };

  useEffect(() => {
    if (labTestToPrint) {
      handleLabPrint();
    }
  }, [labTestToPrint, handleLabPrint]);

  // --- Authentication Check ---
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          window.location.href = "/login";
          return;
        }

        if (!session) {
          console.log("No active session found");
          window.location.href = "/login";
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth initialization error:", error);
        window.location.href = "/login";
      } finally {
        setIsAuthLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setIsAuthenticated(false);
        window.location.href = "/login";
      } else if (session) {
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- Auth Helper Functions ---
  const getAuthHeader = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.access_token) {
        window.location.href = "/login";
        throw new Error("Tidak ada sesi aktif. Silakan login kembali.");
      }

      const headers = new Headers();
      headers.append("Authorization", `Bearer ${session.access_token}`);
      headers.append("Content-Type", "application/json");
      return headers;
    } catch (error) {
      console.error("Auth header error:", error);
      throw error;
    }
  };

  // Fetch functions
  const fetchLabTests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const headers = await getAuthHeader();
      const response = await fetch("/api/lab-tests", { headers });

      if (response.status === 401) {
        await supabase.auth.signOut();
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const validatedData = Array.isArray(data)
        ? data.map((test) => ({
            id: test.id || "",
            patientId: test.patient_id || test.patientId || "",
            patientName:
              test.patient_name ||
              test.patientName ||
              test.patients?.name ||
              "",
            testType: test.test_type || test.testType || "",
            category: test.category || "",
            date: test.date || test.test_date || "",
            doctor: test.doctor_name || test.doctors?.name || "",
            status: test.status || "Menunggu Sample",
            priority: test.priority || "Normal",
            results: test.results || {},
            notes: test.notes || "",
            // Menambahkan relasi jika ada dalam response
            patients: test.patients,
            doctors: test.doctors,
          }))
        : [];

      setLabTestsData(validatedData);
    } catch (error) {
      console.error("Fetch lab tests error:", error);
      setError("Gagal memuat data tes laboratorium");
      setLabTestsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch("/api/patients", { headers });

      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      }
    } catch (error) {
      console.error("Fetch patients error:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch("/api/doctors", { headers });

      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error("Fetch doctors error:", error);
    }
  };

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchLabTests();
      fetchPatients();
      fetchDoctors();
    }
  }, [isAuthenticated]);

  // Handle category change - load test package parameters
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedTestType("");
    setFormData((prev) => ({ ...prev, category, testType: "" }));

    // Reset test results
    setTestResults({});

    // Initialize empty results for the selected package
    if (labTestPackages[category as keyof typeof labTestPackages]) {
      const packageData =
        labTestPackages[category as keyof typeof labTestPackages];
      const initialResults: { [key: string]: string } = {};
      packageData.parameters.forEach((param) => {
        initialResults[param.name] = "";
      });
      setTestResults(initialResults);
    }
  };

  const handleTestTypeChange = (testType: string) => {
    setSelectedTestType(testType);
    setFormData((prev) => ({ ...prev, testType }));
  };

  const handleResultChange = (parameterName: string, value: string) => {
    setTestResults((prev) => ({
      ...prev,
      [parameterName]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.patientId || !formData.category || !formData.testType) {
      alert("Pasien, Kategori, dan Jenis Tes wajib diisi!");
      return;
    }

    try {
      const headers = await getAuthHeader();
      const submitData = {
        ...formData,
        results: testResults,
      };

      const response = await fetch("/api/lab-tests", {
        method: "POST",
        headers,
        body: JSON.stringify(submitData),
      });

      if (response.status === 401) {
        await supabase.auth.signOut();
        window.location.href = "/login";
        return;
      }

      if (response.ok) {
        alert("Tes laboratorium berhasil ditambahkan.");
        closeAddModal();
        fetchLabTests();
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
      alert((error as Error).message);
    }
  };

  const handleUpdate = async () => {
    if (!editingTest) return;

    try {
      const headers = await getAuthHeader();
      const updateData = {
        status: formData.status,
        results: testResults,
        notes: formData.notes,
      };

      const response = await fetch(`/api/lab-tests/${editingTest.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updateData),
      });

      if (response.status === 401) {
        await supabase.auth.signOut();
        window.location.href = "/login";
        return;
      }

      if (response.ok) {
        alert("Data tes laboratorium berhasil diupdate.");
        closeEditModal();
        fetchLabTests();
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
      alert((error as Error).message);
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setFormData({
      patientId: "",
      category: "",
      testType: "",
      priority: "Normal",
      doctorId: "",
      date: "",
      notes: "",
      status: "Menunggu Sample",
    });
    setSelectedCategory("");
    setSelectedTestType("");
    setTestResults({});
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTest(null);
    setSelectedCategory("");
    setSelectedTestType("");
    setTestResults({});
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTest(null);
  };

  const openEditModal = (test: LabTest) => {
    setEditingTest(test);
    setSelectedCategory(test.category);
    setSelectedTestType(test.testType);
    setFormData({
      patientId: test.patientId,
      category: test.category,
      testType: test.testType,
      priority: test.priority,
      doctorId: "", // Bisa diambil dari test jika ada
      date: test.date,
      notes: test.notes,
      status: test.status,
    });
    setTestResults(test.results || {});
    setIsEditModalOpen(true);
  };

  const openViewModal = (test: LabTest) => {
    setSelectedTest(test);
    setIsViewModalOpen(true);
  };

  // Filter logic dengan safe toLowerCase
  const filteredTests = labTestsData.filter((test) => {
    const safeToLower = (str: string | null | undefined): string => {
      return str ? str.toLowerCase() : "";
    };

    const matchesSearch =
      safeToLower(test.patientName).includes(searchTerm.toLowerCase()) ||
      safeToLower(test.id).includes(searchTerm.toLowerCase()) ||
      safeToLower(test.testType).includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      safeToLower(test.status).replace(/\s+/g, "-") === statusFilter;

    const matchesCategory =
      categoryFilter === "all" ||
      safeToLower(test.category) === categoryFilter.toLowerCase();

    const matchesPriority =
      priorityFilter === "all" ||
      safeToLower(test.priority) === priorityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // Filter untuk print - dengan enrichment
  const filteredTestsForPrint = labTestsData
    .filter(
      (test) =>
        test.patientName.toLowerCase().includes(printSearchTerm.toLowerCase()) ||
        test.id.toLowerCase().includes(printSearchTerm.toLowerCase()) ||
        test.testType.toLowerCase().includes(printSearchTerm.toLowerCase()),
    )
    .map(enrichLabTestWithRelations); // Enrich dengan data relasi

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-green-100 text-green-800 border-green-200";
      case "Dalam Proses":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Menunggu Sample":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Normal":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Early Returns for Auth States
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Mengarahkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Memuat data laboratorium...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchLabTests()}>Coba Lagi</Button>
        </div>
      </div>
    );
  }

  // Delete function dengan modal konfirmasi
  const handleDelete = async () => {
    if (!testToDelete) return;

    try {
      const headers = await getAuthHeader();
      const response = await fetch(`/api/lab-tests/${testToDelete.id}`, {
        method: "DELETE",
        headers,
      });

      if (response.status === 401) {
        await supabase.auth.signOut();
        window.location.href = "/login";
        return;
      }

      if (!response.ok) throw new Error(await response.text());
      alert("Tes laboratorium berhasil dihapus.");
      setIsDeleteModalOpen(false);
      setTestToDelete(null);
      fetchLabTests();
    } catch (error) {
      console.error("Error:", error);
      alert((error as Error).message);
    }
  };

  const openDeleteModal = (test: LabTest) => {
    setTestToDelete(test);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTestToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Print Component (Hidden) */}
      <div style={{ display: "none" }}>
        {labTestToPrint && (
          <PrintLabLayout
            ref={printLabComponentRef}
            labTest={{
              ...labTestToPrint,
              doctors: labTestToPrint?.doctors as Doctor, // Ensure doctors is not optional
            }}
          />
        )}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Laboratorium</h1>
          <p className="text-muted-foreground">
            Kelola pemeriksaan laboratorium dan hasil tes
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Print Modal */}
          <Dialog open={isPrintModalOpen} onOpenChange={setIsPrintModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Cetak Hasil Lab
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Pilih Tes Lab untuk Dicetak</DialogTitle>
                <DialogDescription>
                  Cari dan pilih tes laboratorium yang hasilnya ingin Anda
                  cetak.
                </DialogDescription>
              </DialogHeader>
              <div className="my-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama pasien, ID tes, atau jenis tes..."
                    value={printSearchTerm}
                    onChange={(e) => setPrintSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto pr-4 -mr-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Tes</TableHead>
                      <TableHead>Pasien</TableHead>
                      <TableHead>Jenis Tes</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTestsForPrint.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.id}</TableCell>
                        <TableCell>{test.patientName}</TableCell>
                        <TableCell>{test.testType}</TableCell>
                        <TableCell>
                          {test.date
                            ? new Date(test.date).toLocaleDateString("id-ID")
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(test.status)}>
                            {test.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => triggerLabPrint(test)}
                          >
                            <Printer className="w-3 h-3 mr-2" />
                            Cetak
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Lab Test Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Tes Lab
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tambah Pemeriksaan Laboratorium</DialogTitle>
                <DialogDescription>
                  Masukkan informasi pemeriksaan lab dan hasil tes
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Informasi Tes</TabsTrigger>
                  <TabsTrigger value="results">Input Hasil</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-select">Pasien</Label>
                      <Select
                        value={formData.patientId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, patientId: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih pasien" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem
                              key={patient.id}
                              value={String(patient.id)}
                            >
                              {patient.id} - {patient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="test-category">Kategori Tes</Label>
                      <Select
                        value={selectedCategory}
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(labTestPackages).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="test-type">Jenis Tes</Label>
                      <Select
                        value={selectedTestType}
                        onValueChange={handleTestTypeChange}
                        disabled={!selectedCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis tes" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCategory && (
                            <SelectItem
                              value={
                                labTestPackages[
                                  selectedCategory as keyof typeof labTestPackages
                                ].name
                              }
                            >
                              {
                                labTestPackages[
                                  selectedCategory as keyof typeof labTestPackages
                                ].name
                              }
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Prioritas</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih prioritas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doctor-select">Dokter Pengirim</Label>
                      <Select
                        value={formData.doctorId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, doctorId: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih dokter" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem
                              key={doctor.id}
                              value={String(doctor.id)}
                            >
                              {doctor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="test-date">Tanggal Tes</Label>
                      <Input
                        id="test-date"
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="test-notes">Catatan Klinis</Label>
                      <Textarea
                        id="test-notes"
                        placeholder="Masukkan informasi klinis yang relevan..."
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="results" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="w-4 h-4" />
                      Input hasil tes setelah pemeriksaan selesai
                    </div>

                    {selectedCategory &&
                      labTestPackages[
                        selectedCategory as keyof typeof labTestPackages
                      ] && (
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4">
                            <h3 className="font-semibold mb-3">
                              {
                                labTestPackages[
                                  selectedCategory as keyof typeof labTestPackages
                                ].name
                              }
                            </h3>
                            <div className="space-y-3">
                              {labTestPackages[
                                selectedCategory as keyof typeof labTestPackages
                              ].parameters.map((param, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-4 gap-4 items-center p-3 border rounded"
                                >
                                  <div className="font-medium">
                                    {param.name}
                                  </div>
                                  <div>
                                    <Input
                                      placeholder="Hasil"
                                      value={testResults[param.name] || ""}
                                      onChange={(e) =>
                                        handleResultChange(
                                          param.name,
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {param.unit}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {param.normalValue}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                    {!selectedCategory && (
                      <div className="text-center py-8 text-muted-foreground">
                        <TestTube className="w-12 h-12 mx-auto mb-2" />
                        <p>Pilih kategori tes terlebih dahulu</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeAddModal}>
                  Batal
                </Button>
                <Button onClick={handleSubmit}>Simpan Tes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tes</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{labTestsData.length}</div>
            <p className="text-xs text-muted-foreground">
              {labTestsData.filter((t) => t.status === "Selesai").length}{" "}
              selesai
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dalam Proses</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {labTestsData.filter((t) => t.status === "Dalam Proses").length}
            </div>
            <p className="text-xs text-muted-foreground">Sedang dianalisis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Menunggu Sample
            </CardTitle>
            <Microscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                labTestsData.filter((t) => t.status === "Menunggu Sample")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Sample belum diterima
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {labTestsData.filter((t) => t.priority === "Urgent").length}
            </div>
            <p className="text-xs text-muted-foreground">Prioritas tinggi</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama pasien, ID, atau jenis tes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
                <SelectItem value="dalam-proses">Dalam Proses</SelectItem>
                <SelectItem value="menunggu-sample">Menunggu Sample</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {Object.keys(labTestPackages).map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter prioritas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Prioritas</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lab Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pemeriksaan Laboratorium</CardTitle>
          <CardDescription>
            Total {filteredTests.length} tes ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Tes</TableHead>
                <TableHead>Pasien</TableHead>
                <TableHead>Jenis Tes</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Prioritas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTests.length > 0 ? (
                filteredTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">
                      {test.id || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {test.patientName || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {test.patientId || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{test.testType || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{test.category || "N/A"}</Badge>
                    </TableCell>
                    <TableCell>
                      {test.date
                        ? new Date(test.date).toLocaleDateString("id-ID")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getPriorityColor(test.priority || "Normal")}
                      >
                        {test.priority || "Normal"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(
                          test.status || "Menunggu Sample",
                        )}
                      >
                        {test.status || "Menunggu Sample"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openViewModal(test)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Hasil
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(test)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => triggerLabPrint(test)}
                          >
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak Hasil
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => openDeleteModal(test)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Tidak ada data tes laboratorium
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Results Modal */}
      {selectedTest && (
        <Dialog open={isViewModalOpen} onOpenChange={() => closeViewModal()}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Hasil Laboratorium: {selectedTest.id}</DialogTitle>
              <DialogDescription>
                {selectedTest.patientName} - {selectedTest.testType}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Informasi Tes</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID Tes:</span>
                      <span>{selectedTest.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pasien:</span>
                      <span>
                        {selectedTest.patientName} ({selectedTest.patientId})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jenis Tes:</span>
                      <span>{selectedTest.testType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kategori:</span>
                      <Badge variant="outline">{selectedTest.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tanggal:</span>
                      <span>
                        {selectedTest.date
                          ? new Date(selectedTest.date).toLocaleDateString(
                              "id-ID",
                            )
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dokter:</span>
                      <span>{selectedTest.doctor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prioritas:</span>
                      <Badge
                        className={getPriorityColor(selectedTest.priority)}
                      >
                        {selectedTest.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(selectedTest.status)}>
                        {selectedTest.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Hasil Pemeriksaan</h3>
                  {Object.keys(selectedTest.results).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(selectedTest.results).map(
                        ([key, result]: [string, any]) => (
                          <div key={key} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{key}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <div>
                                Hasil:{" "}
                                <span className="font-medium">{result}</span>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <TestTube className="w-12 h-12 mx-auto mb-2" />
                      <p>Hasil belum tersedia</p>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Catatan</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedTest.notes || "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={closeViewModal}>
                Tutup
              </Button>
              <Button
                onClick={() => {
                  closeViewModal();
                  openEditModal(selectedTest);
                }}
              >
                Edit Hasil
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {testToDelete && (
        <Dialog open={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Konfirmasi Hapus
              </DialogTitle>
              <DialogDescription>
                Tindakan ini tidak dapat dibatalkan. Data yang dihapus akan
                hilang permanen.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-3">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">
                    Data yang akan dihapus:
                  </h4>
                  <div className="space-y-1 text-sm text-red-700">
                    <div>
                      <span className="font-medium">ID Tes:</span>{" "}
                      {testToDelete.id}
                    </div>
                    <div>
                      <span className="font-medium">Pasien:</span>{" "}
                      {testToDelete.patientName}
                    </div>
                    <div>
                      <span className="font-medium">Jenis Tes:</span>{" "}
                      {testToDelete.testType}
                    </div>
                    <div>
                      <span className="font-medium">Kategori:</span>{" "}
                      {testToDelete.category}
                    </div>
                    <div>
                      <span className="font-medium">Tanggal:</span>{" "}
                      {testToDelete.date
                        ? new Date(testToDelete.date).toLocaleDateString(
                            "id-ID",
                          )
                        : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Apakah Anda yakin ingin menghapus data tes laboratorium ini?
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeDeleteModal}>
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Ya, Hapus
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Results Modal */}
      {editingTest && (
        <Dialog open={isEditModalOpen} onOpenChange={() => closeEditModal()}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Hasil Lab: {editingTest.id}</DialogTitle>
              <DialogDescription>
                {editingTest.patientName} - {editingTest.testType}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Status Update */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Menunggu Sample">
                        Menunggu Sample
                      </SelectItem>
                      <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                      <SelectItem value="Selesai">Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-notes">Catatan</Label>
                  <Textarea
                    id="edit-notes"
                    placeholder="Masukkan catatan..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows={2}
                  />
                </div>
              </div>

              {/* Results Input */}
              {selectedCategory &&
                labTestPackages[
                  selectedCategory as keyof typeof labTestPackages
                ] && (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">
                        Input Hasil:{" "}
                        {
                          labTestPackages[
                            selectedCategory as keyof typeof labTestPackages
                          ].name
                        }
                      </h3>
                      <div className="space-y-3">
                        {labTestPackages[
                          selectedCategory as keyof typeof labTestPackages
                        ].parameters.map((param, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-4 gap-4 items-center p-3 border rounded"
                          >
                            <div className="font-medium">{param.name}</div>
                            <div>
                              <Input
                                placeholder="Hasil"
                                value={testResults[param.name] || ""}
                                onChange={(e) =>
                                  handleResultChange(param.name, e.target.value)
                                }
                              />
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {param.unit}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {param.normalValue}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={closeEditModal}>
                Batal
              </Button>
              <Button onClick={handleUpdate}>Simpan Perubahan</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}