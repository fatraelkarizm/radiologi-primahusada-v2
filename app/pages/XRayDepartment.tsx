import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useReactToPrint } from "react-to-print";

import { PrintLayout } from "@/components/PrintLayout";

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
  Upload,
  Camera,
  Image,
  Download,
  Eye,
  Edit,
  Trash2,
  FileImage,
  Calendar,
  User,
  MoreHorizontal,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Printer,
  Share,
  Maximize2,
  X,
  AlertTriangle,
} from "lucide-react";

// Types
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
  patients?: Patient;
  doctors?: { name: string };
  radiolog_id?: number;
  radiologs?: { name: string }; // <-- TAMBAHKAN INI
};

type Patient = {
  id: number;
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

type Radiolog = {
  id: number;
  name: string;
};
export default function XRayDepartment() {
  // --- Authentication State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // State Management
  const [xrayData, setXrayData] = useState<XrayExamination[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [radiologs, setRadiologs] = useState<Radiolog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const [selectedXray, setSelectedXray] = useState<XrayExamination | null>(
    null,
  );
  const [editingXray, setEditingXray] = useState<XrayExamination | null>(null);
  const [xrayToDelete, setXrayToDelete] = useState<XrayExamination | null>(
    null,
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  // Print states
  const [printSearchTerm, setPrintSearchTerm] = useState("");
  const [xrayToPrint, setXrayToPrint] = useState<XrayExamination | null>(null);
  const printXrayComponentRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form data
  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    radiolog_id: "2", // <-- TAMBAHKAN INI DENGAN DEFAULT VALUE
    examination_type: "",
    examination_date: "",
    status: "Menunggu",
    notes: "",
  });

  // Print functionality
  const handleXrayPrint = useReactToPrint({
    contentRef: printXrayComponentRef,
    onAfterPrint: () => setXrayToPrint(null),
  });

  const triggerXrayPrint = (xray: XrayExamination) => {
    setXrayToPrint(xray);
  };

  useEffect(() => {
    if (xrayToPrint) {
      handleXrayPrint();
    }
  }, [xrayToPrint, handleXrayPrint]);

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
      return headers;
    } catch (error) {
      console.error("Auth header error:", error);
      throw error;
    }
  };

  const getJsonAuthHeader = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.access_token) {
        window.location.href = "/login";
        throw new Error("Tidak ada sesi aktif. Silakan login kembali.");
      }

      return {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      };
    } catch (error) {
      console.error("Auth header error:", error);
      throw error;
    }
  };

  // Fetch functions
  const fetchXrayExaminations = async () => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch("/api/xray", { headers });

      if (response.status === 401) {
        await supabase.auth.signOut();
        window.location.href = "/login";
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setXrayData(data);
      }
    } catch (error) {
      console.error("Fetch X-ray examinations error:", error);
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

  const fetchRadiologs = async () => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch("/api/radiologs", { headers });

      if (response.ok) {
        const data = await response.json();
        setRadiologs(data);
      }
    } catch (error) {
      console.error("Fetch radiologs error:", error);
    }
  };

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchXrayExaminations();
      fetchPatients();
      fetchDoctors();
      fetchRadiologs();
    }
  }, [isAuthenticated]);

  // File upload handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadFiles(files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setUploadFiles(files);
  };

  const removeFile = (index: number) => {
    setUploadFiles(uploadFiles.filter((_, i) => i !== index));
  };

  // CRUD Operations
  const handleSubmit = async () => {
    if (!formData.patient_id || !formData.examination_type) {
      alert("Pasien dan jenis pemeriksaan wajib diisi!");
      return;
    }

    setIsLoading(true);
    try {
      const authHeaders = await getAuthHeader();
      const submissionData = new FormData();

      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        submissionData.append(key, value);
      });
      

      // Add image files
      uploadFiles.forEach((file, index) => {
        submissionData.append("xrayImages", file);
      });

      const response = await fetch("/api/xray", {
        method: "POST",
        headers: authHeaders,
        body: submissionData,
      });

      if (response.status === 401) {
        await supabase.auth.signOut();
        window.location.href = "/login";
        return;
      }

      if (response.ok) {
        alert("Pemeriksaan X-Ray berhasil ditambahkan.");
        closeUploadModal();
        fetchXrayExaminations();
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
      alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingXray) return;

    try {
      const headers = await getJsonAuthHeader();
      const response = await fetch(`/api/xray/${editingXray.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          examination_type: formData.examination_type,
          examination_date: formData.examination_date,
          status: formData.status,
          notes: formData.notes,
          doctor_id: formData.doctor_id ? parseInt(formData.doctor_id) : null,
          radiolog_id: formData.radiolog_id ? parseInt(formData.radiolog_id) : null,
        }),
      });

      if (response.status === 401) {
        await supabase.auth.signOut();
        window.location.href = "/login";
        return;
      }

      if (response.ok) {
        alert("Data pemeriksaan berhasil diupdate.");
        closeEditModal();
        fetchXrayExaminations();
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
      alert((error as Error).message);
    }
  };

  const handleDelete = async () => {
    if (!xrayToDelete) return;

    try {
      const headers = await getAuthHeader();
      const response = await fetch(`/api/xray/${xrayToDelete.id}`, {
        method: "DELETE",
        headers,
      });

      if (response.status === 401) {
        await supabase.auth.signOut();
        window.location.href = "/login";
        return;
      }

      if (response.ok) {
        alert("Pemeriksaan X-Ray berhasil dihapus.");
        closeDeleteModal();
        fetchXrayExaminations();
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
      alert((error as Error).message);
    }
  };

  // Modal handlers
  const openUploadModal = () => {
    setFormData({
      patient_id: "",
      doctor_id: "",
      radiolog_id: "2", // <-- TAMBAHKAN INI DENGAN DEFAULT VALUE
      examination_type: "",
      examination_date: "",
      status: "Menunggu",
      notes: "",
    });
    setUploadFiles([]);
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setFormData({
      patient_id: "",
      doctor_id: "",
      radiolog_id: "2", // <-- TAMBAHKAN INI DENGAN DEFAULT VALUE
      examination_type: "",
      examination_date: "",
      status: "Menunggu",
      notes: "",
    });
    setUploadFiles([]);
  };

  const openEditModal = (xray: XrayExamination) => {
    setEditingXray(xray);
    setFormData({
      patient_id: String(xray.patient_id),
      doctor_id: xray.doctor_id ? String(xray.doctor_id) : "",
      radiolog_id: xray.radiolog_id ? String(xray.radiolog_id) : "2",
      examination_type: xray.examination_type,
      examination_date: xray.examination_date,
      status: xray.status,
      notes: xray.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingXray(null);
  };

  const openViewModal = (xray: XrayExamination) => {
    setSelectedXray(xray);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedXray(null);
  };

  const openDeleteModal = (xray: XrayExamination) => {
    setXrayToDelete(xray);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setXrayToDelete(null);
  };

  // Filter logic
  const filteredXrays = xrayData.filter((xray) => {
    const safeToLower = (str: string | null | undefined): string => {
      return str ? str.toLowerCase() : "";
    };

    const patientName = xray.patients?.name || "";
    const matchesSearch =
      safeToLower(patientName).includes(searchTerm.toLowerCase()) ||
      safeToLower(String(xray.id)).includes(searchTerm.toLowerCase()) ||
      safeToLower(xray.examination_type).includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      safeToLower(xray.status).replace(/\s+/g, "-") === statusFilter;

    const matchesType =
      typeFilter === "all" ||
      safeToLower(xray.examination_type).includes(typeFilter);

    return matchesSearch && matchesStatus && matchesType;
  });

  // Filter untuk print
  const filteredXraysForPrint = xrayData.filter((xray) => {
    const patientName = xray.patients?.name || "";
    return (
      patientName.toLowerCase().includes(printSearchTerm.toLowerCase()) ||
      String(xray.id).toLowerCase().includes(printSearchTerm.toLowerCase()) ||
      xray.examination_type
        .toLowerCase()
        .includes(printSearchTerm.toLowerCase())
    );
  });

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-green-100 text-green-800 border-green-200";
      case "Dalam Proses":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Menunggu":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("id-ID");
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

  return (
    <div className="space-y-6">
      {/* Print Component (Hidden) */}
      <div style={{ display: "none" }}>
        {xrayToPrint && (
          <PrintLayout
            ref={printXrayComponentRef}
            xrayData={xrayToPrint}
            patient={patients.find((p) => p.id === xrayToPrint.patient_id)}
            doctor={doctors.find((d) => d.id === xrayToPrint.doctor_id)}
          />
        )}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bagian Rontgen</h1>
          <p className="text-muted-foreground">
            Kelola pemeriksaan radiologi dan penyimpanan gambar
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Print Modal */}
          <Dialog open={isPrintModalOpen} onOpenChange={setIsPrintModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Cetak Laporan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Pilih Pemeriksaan untuk Dicetak</DialogTitle>
                <DialogDescription>
                  Cari dan pilih pemeriksaan yang laporannya ingin Anda cetak.
                </DialogDescription>
              </DialogHeader>
              <div className="my-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama pasien, ID pemeriksaan, atau jenis..."
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
                      <TableHead>ID</TableHead>
                      <TableHead>Pasien</TableHead>
                      <TableHead>Jenis</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredXraysForPrint.map((xray) => (
                      <TableRow key={xray.id}>
                        <TableCell className="font-medium">
                          XR{String(xray.id).padStart(3, "0")}
                        </TableCell>
                        <TableCell>{xray.patients?.name}</TableCell>
                        <TableCell>{xray.examination_type}</TableCell>
                        <TableCell>
                          {formatDate(xray.examination_date)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(xray.status)}>
                            {xray.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => triggerXrayPrint(xray)}
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

          {/* Add Examination Modal */}
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={openUploadModal}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pemeriksaan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Tambah Pemeriksaan Rontgen</DialogTitle>
                <DialogDescription>
                  Masukkan informasi pemeriksaan dan upload gambar hasil rontgen
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Informasi Pemeriksaan</TabsTrigger>
                  <TabsTrigger value="images">Upload Gambar</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-select">Pasien</Label>
                      <Select
                        value={formData.patient_id}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            patient_id: value,
                          }))
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
                      <Label htmlFor="xray-type">Jenis Pemeriksaan</Label>
                      <Select
                        value={formData.examination_type}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            examination_type: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis pemeriksaan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rontgen Dada">
                            Rontgen Dada
                          </SelectItem>
                          <SelectItem value="Rontgen Tulang">
                            Rontgen Tulang
                          </SelectItem>
                          <SelectItem value="CT Scan">CT Scan</SelectItem>
                          <SelectItem value="MRI">MRI</SelectItem>
                          <SelectItem value="Mammografi">Mammografi</SelectItem>
                          <SelectItem value="USG">USG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Dokter Pengirim bagian Tambah Pemeriksaan */}
                    <div className="space-y-2">
                      <Label htmlFor="doctor-select">Dokter Pengirim</Label>
                      <Select
                        value={formData.doctor_id}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, doctor_id: value }))
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

                    {/* Radiolog bagian Tambah Pemeriksaan */}

                    <div className="space-y-2">
                      <Label htmlFor="radiologist-select">Radiolog</Label>
                      <Select
                        value={formData.radiolog_id} // <-- Gunakan state radiolog_id
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            radiolog_id: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Radiolog" />
                        </SelectTrigger>
                        <SelectContent>
                          {radiologs.map((radiolog) => (
                            <SelectItem
                              key={radiolog.id}
                              value={String(radiolog.id)}
                            >
                              {radiolog.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="exam-date">Tanggal Pemeriksaan</Label>
                      <Input
                        id="exam-date"
                        type="date"
                        value={formData.examination_date}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            examination_date: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="exam-notes">Catatan Pemeriksaan</Label>
                      <Textarea
                        id="exam-notes"
                        placeholder="Masukkan catatan atau temuan pemeriksaan..."
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        rows={4}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="images" className="space-y-4">
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <FileImage className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      Drag & drop gambar atau klik untuk upload
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Mendukung format JPG, PNG, DICOM (maks. 50MB per file)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.dcm,.dicom"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-2" />
                      Pilih File
                    </Button>
                  </div>

                  {uploadFiles.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium">File yang akan diupload:</h3>
                      {uploadFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileImage className="w-5 h-5" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeUploadModal}>
                  Batal
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : "Simpan Pemeriksaan"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pemeriksaan
            </CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{xrayData.length}</div>
            <p className="text-xs text-muted-foreground">
              {xrayData.filter((x) => x.status === "Selesai").length} selesai
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gambar Tersimpan
            </CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {xrayData.reduce(
                (sum, xray) => sum + (xray.image_urls?.length || 0),
                0,
              )}
            </div>
            <p className="text-xs text-muted-foreground">File radiologi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dalam Proses</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {xrayData.filter((x) => x.status === "Dalam Proses").length}
            </div>
            <p className="text-xs text-muted-foreground">Pemeriksaan aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {xrayData.filter((x) => x.status === "Menunggu").length}
            </div>
            <p className="text-xs text-muted-foreground">Antrian pemeriksaan</p>
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
                placeholder="Cari berdasarkan nama pasien, ID, atau jenis pemeriksaan..."
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
                <SelectItem value="menunggu">Menunggu</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="rontgen">Rontgen</SelectItem>
                <SelectItem value="ct">CT Scan</SelectItem>
                <SelectItem value="mri">MRI</SelectItem>
                <SelectItem value="usg">USG</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* X-ray Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pemeriksaan Rontgen</CardTitle>
          <CardDescription>
            Total {filteredXrays.length} pemeriksaan ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pemeriksaan</TableHead>
                <TableHead>Pasien</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Dokter Pengirim</TableHead>
                <TableHead>Gambar</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredXrays.length > 0 ? (
                filteredXrays.map((xray) => (
                  <TableRow key={xray.id}>
                    <TableCell className="font-medium">
                      XR{String(xray.id).padStart(3, "0")}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {xray.patients?.name || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {xray.patient_id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{xray.examination_type}</TableCell>
                    <TableCell>{formatDate(xray.examination_date)}</TableCell>
                    <TableCell>{xray.doctors?.name || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileImage className="w-4 h-4" />
                        {xray.image_urls?.length || 0} gambar
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(xray.status)}>
                        {xray.status}
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
                          <DropdownMenuItem onClick={() => openViewModal(xray)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(xray)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => triggerXrayPrint(xray)}
                          >
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak Laporan
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => openDeleteModal(xray)}
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
                    Tidak ada data pemeriksaan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Detail Modal */}
      {selectedXray && (
        <Dialog open={isViewModalOpen} onOpenChange={() => closeViewModal()}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Detail Pemeriksaan: XR{String(selectedXray.id).padStart(3, "0")}
              </DialogTitle>
              <DialogDescription>
                {selectedXray.patients?.name} - {selectedXray.examination_type}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Informasi Pemeriksaan</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        ID Pemeriksaan:
                      </span>
                      <span>XR{String(selectedXray.id).padStart(3, "0")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pasien:</span>
                      <span>
                        {selectedXray.patients?.name} (ID:{" "}
                        {selectedXray.patient_id})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jenis:</span>
                      <span>{selectedXray.examination_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tanggal:</span>
                      <span>{formatDate(selectedXray.examination_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dokter:</span>
                      <span>{selectedXray.doctors?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(selectedXray.status)}>
                        {selectedXray.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Catatan</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedXray.notes || "Tidak ada catatan"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">
                    Gambar Radiologi ({selectedXray.image_urls?.length || 0})
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedXray.image_urls?.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-2 hover:bg-muted cursor-pointer"
                        onClick={() => setSelectedImage(imageUrl)}
                      >
                        <div className="aspect-square bg-muted rounded flex items-center justify-center mb-2">
                          <img
                            src={imageUrl}
                            alt={`X-ray ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const nextElement = e.currentTarget
                                .nextSibling as HTMLElement;
                              if (nextElement && nextElement.style) {
                                nextElement.style.display = "flex";
                              }
                            }}
                          />
                          <div
                            style={{ display: "none" }}
                            className="flex items-center justify-center w-full h-full"
                          >
                            <FileImage className="w-8 h-8 text-muted-foreground" />
                          </div>
                        </div>
                        <p className="text-xs font-medium truncate">
                          Gambar {index + 1}
                        </p>
                      </div>
                    )) || (
                      <div className="col-span-2 text-center py-8 text-muted-foreground">
                        <FileImage className="w-12 h-12 mx-auto mb-2" />
                        <p>Belum ada gambar</p>
                      </div>
                    )}
                  </div>
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
                  openEditModal(selectedXray);
                }}
              >
                Edit Pemeriksaan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Modal */}
      {editingXray && (
        <Dialog open={isEditModalOpen} onOpenChange={() => closeEditModal()}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Edit Pemeriksaan: XR{String(editingXray.id).padStart(3, "0")}
              </DialogTitle>
              <DialogDescription>
                Perbarui informasi pemeriksaan radiologi
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Jenis Pemeriksaan</Label>
                <Select
                  value={formData.examination_type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      examination_type: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rontgen Dada">Rontgen Dada</SelectItem>
                    <SelectItem value="Rontgen Tulang">
                      Rontgen Tulang
                    </SelectItem>
                    <SelectItem value="CT Scan">CT Scan</SelectItem>
                    <SelectItem value="MRI">MRI</SelectItem>
                    <SelectItem value="Mammografi">Mammografi</SelectItem>
                    <SelectItem value="USG">USG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Tanggal Pemeriksaan</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.examination_date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      examination_date: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Menunggu">Menunggu</SelectItem>
                    <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                    <SelectItem value="Selesai">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dokter Pengirim */}
              <div className="space-y-2">
                <Label htmlFor="edit-doctor">Dokter Pengirim</Label>
                <Select
                  value={formData.doctor_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, doctor_id: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih dokter" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={String(doctor.id)}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                      <Label htmlFor="radiologist-select">Radiolog</Label>
                      <Select
                        value={formData.radiolog_id} // <-- Gunakan state radiolog_id
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            radiolog_id: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Radiolog" />
                        </SelectTrigger>
                        <SelectContent>
                          {radiologs.map((radiolog) => (
                            <SelectItem
                              key={radiolog.id}
                              value={String(radiolog.id)}
                            >
                              {radiolog.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-notes">Catatan</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeEditModal}>
                Batal
              </Button>
              <Button onClick={handleUpdate}>Simpan Perubahan</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {xrayToDelete && (
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
                      <span className="font-medium">ID:</span> XR
                      {String(xrayToDelete.id).padStart(3, "0")}
                    </div>
                    <div>
                      <span className="font-medium">Pasien:</span>{" "}
                      {xrayToDelete.patients?.name}
                    </div>
                    <div>
                      <span className="font-medium">Jenis:</span>{" "}
                      {xrayToDelete.examination_type}
                    </div>
                    <div>
                      <span className="font-medium">Tanggal:</span>{" "}
                      {formatDate(xrayToDelete.examination_date)}
                    </div>
                    <div>
                      <span className="font-medium">Gambar:</span>{" "}
                      {xrayToDelete.image_urls?.length || 0} file
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Apakah Anda yakin ingin menghapus data pemeriksaan ini beserta
                  semua gambarnya?
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

      {/* Image Viewer Modal */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                Viewer Gambar Radiologi
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-center items-center min-h-96 bg-black rounded-lg">
              <img
                src={selectedImage}
                alt="X-ray Image"
                className="max-w-full max-h-96 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  (e.currentTarget.nextSibling as HTMLElement).style.display =
                    "flex";
                }}
              />
              <div
                style={{ display: "none" }}
                className="text-center text-white"
              >
                <FileImage className="w-24 h-24 mx-auto mb-4" />
                <p className="text-lg">Gagal memuat gambar</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={() => setSelectedImage(null)}>
                Tutup
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
