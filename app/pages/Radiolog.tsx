import { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Label } from "@/components/ui/label";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Phone,
  Printer,
} from "lucide-react";

// Tipe Data untuk Radiolog (disesuaikan dengan skema database)
type Radiolog = {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  avatar?: string; // Avatar opsional
};

export default function Radiologs() {
  // --- Authentication State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // State Management
  const [radiologsData, setRadiologsData] = useState<Radiolog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State untuk kontrol modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRadiolog, setSelectedRadiolog] = useState<Radiolog | null>(null);
  const [editingRadiolog, setEditingRadiolog] = useState<Radiolog | null>(null);
  
  // State untuk data form
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
  });

  // --- Authentication Check ---
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          window.location.href = '/login';
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
        window.location.href = '/login';
      } finally {
        setIsAuthLoading(false);
      }
    };
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setIsAuthenticated(false);
          window.location.href = '/login';
        } else if (session) {
          setIsAuthenticated(true);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // --- Auth Helper Functions ---
  const getAuthHeader = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      window.location.href = '/login';
      throw new Error("Tidak ada sesi aktif. Silakan login kembali.");
    }
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${session.access_token}`);
    headers.append('Content-Type', 'application/json');
    return headers;
  };

  // Fetch data radiolog dari API
  const fetchRadiologs = async () => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch("/api/radiologs", { headers });
      
      if (response.status === 401) {
        await supabase.auth.signOut();
        return;
      }
      if (!response.ok) throw new Error("Gagal mengambil data radiolog");
      const data = await response.json();
      setRadiologsData(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchRadiologs();
    }
  }, [isAuthenticated]);

  // Handler untuk input form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handler untuk Submit (Tambah Radiolog)
  const handleSubmit = async () => {
    if (!formData.name || !formData.age || !formData.gender) {
        alert("Nama, Usia, dan Jenis Kelamin wajib diisi!");
        return;
    }
    try {
        const headers = await getAuthHeader();
        const response = await fetch("/api/radiologs", {
            method: 'POST',
            headers,
            body: JSON.stringify(formData)
        });
        
        if (response.status === 401) {
          await supabase.auth.signOut();
          return;
        }
        if (!response.ok) throw new Error(await response.text());
        alert("Radiolog baru berhasil ditambahkan.");
        closeAddModal();
        fetchRadiologs(); // Refresh data
    } catch (error) {
        console.error("Error:", error);
        alert((error as Error).message);
    }
  };

  // Handler untuk Update (Edit Radiolog)
  const handleUpdate = async () => {
    if (!editingRadiolog) return;
    try {
        const headers = await getAuthHeader();
        const response = await fetch(`/api/radiologs/${editingRadiolog.id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(formData)
        });
        
        if (response.status === 401) {
          await supabase.auth.signOut();
          return;
        }
        if (!response.ok) throw new Error(await response.text());
        alert("Data radiolog berhasil diupdate.");
        closeEditModal();
        fetchRadiologs(); // Refresh data
    } catch (error) {
        console.error("Error:", error);
        alert((error as Error).message);
    }
  };

  // Handler untuk Hapus Radiolog
  const handleDelete = async (radiologId: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data radiolog ini?")) return;
    try {
        const headers = await getAuthHeader();
        const response = await fetch(`/api/radiologs/${radiologId}`, { 
          method: 'DELETE',
          headers 
        });
        
        if (response.status === 401) {
          await supabase.auth.signOut();
          return;
        }
        if (!response.ok) throw new Error(await response.text());
        alert("Radiolog berhasil dihapus.");
        fetchRadiologs(); // Refresh data
    } catch (error) {
        console.error("Error:", error);
        alert((error as Error).message);
    }
  };

  // Logika Filter
  const filteredRadiologs = radiologsData.filter((radiolog) =>
    radiolog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(radiolog.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fungsi utilitas
  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  // Fungsi Kontrol Modal
  const openAddModal = () => {
    setFormData({ name: "", age: "", gender: "", phone: "" });
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (radiolog: Radiolog) => {
    setEditingRadiolog(radiolog);
    setFormData({
      name: radiolog.name,
      age: String(radiolog.age),
      gender: radiolog.gender,
      phone: radiolog.phone,
    });
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingRadiolog(null);
  };

  // --- Early Returns for Auth States ---
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
        <p>Mengarahkan ke halaman login...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manajemen Radiolog</h1>
          <p className="text-muted-foreground">Kelola data staf radiolog</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><Printer className="w-4 h-4 mr-2" />Cetak</Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild><Button onClick={openAddModal}><Plus className="w-4 h-4 mr-2" />Tambah Radiolog</Button></DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Tambah Radiolog Baru</DialogTitle>
                <DialogDescription>Masukkan informasi lengkap radiolog baru</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2 space-y-2"><Label htmlFor="name">Nama Lengkap</Label><Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Nama Lengkap"/></div>
                <div className="space-y-2"><Label htmlFor="age">Usia</Label><Input id="age" type="number" value={formData.age} onChange={handleInputChange} placeholder="30"/></div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                    <SelectTrigger><SelectValue placeholder="Pilih jenis kelamin"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2"><Label htmlFor="phone">Nomor Telepon</Label><Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="081234567890"/></div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeAddModal}>Batal</Button>
                <Button onClick={handleSubmit}>Simpan Radiolog</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Cari nama radiolog..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
          </div>
        </CardContent>
      </Card>

      {/* Radiologs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Radiolog</CardTitle>
          <CardDescription>Total {filteredRadiologs.length} radiolog ditemukan</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Usia</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRadiologs.map((radiolog) => (
                <TableRow key={radiolog.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar><AvatarImage src={radiolog.avatar} alt={radiolog.name} /><AvatarFallback>{getInitials(radiolog.name)}</AvatarFallback></Avatar>
                      <div>
                        <div className="font-medium">{radiolog.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {radiolog.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{radiolog.age} tahun</TableCell>
                  <TableCell>{radiolog.gender}</TableCell>
                  <TableCell><div className="flex items-center"><Phone className="w-3 h-3 mr-1"/>{radiolog.phone}</div></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSelectedRadiolog(radiolog)}><Eye className="mr-2 h-4 w-4"/>Lihat Detail</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(radiolog)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-500" onClick={() => handleDelete(radiolog.id)}><Trash2 className="mr-2 h-4 w-4"/>Hapus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Radiolog Detail Modal */}
      {selectedRadiolog && (
        <Dialog open={!!selectedRadiolog} onOpenChange={() => setSelectedRadiolog(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detail Radiolog</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24"><AvatarImage src={selectedRadiolog.avatar} alt={selectedRadiolog.name} /><AvatarFallback className="text-3xl">{getInitials(selectedRadiolog.name)}</AvatarFallback></Avatar>
                  <div>
                    <h3 className="font-semibold text-xl text-center">{selectedRadiolog.name}</h3>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">ID Radiolog:</span><span>{String(selectedRadiolog.id)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Usia:</span><span>{selectedRadiolog.age} tahun</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Jenis Kelamin:</span><span>{selectedRadiolog.gender}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Telepon:</span><span>{selectedRadiolog.phone}</span></div>
                </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Radiolog Modal */}
       {editingRadiolog && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Edit Data Radiolog: {editingRadiolog.name}</DialogTitle>
                <DialogDescription>Perbarui informasi radiolog di bawah ini.</DialogDescription>
              </DialogHeader>
               <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2 space-y-2"><Label htmlFor="name">Nama Lengkap</Label><Input id="name" value={formData.name} onChange={handleInputChange}/></div>
                <div className="space-y-2"><Label htmlFor="age">Usia</Label><Input id="age" type="number" value={formData.age} onChange={handleInputChange}/></div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                   <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                       <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2"><Label htmlFor="phone">Nomor Telepon</Label><Input id="phone" value={formData.phone} onChange={handleInputChange}/></div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeEditModal}>Batal</Button>
                <Button onClick={handleUpdate}>Simpan Perubahan</Button>
              </div>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}