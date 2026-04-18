"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
     Plus, 
     Search, 
     Loader2, 
     Edit, 
     Trash2, 
     Package,
     AlertCircle
} from "lucide-react";
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PharmacyItemsPage() {
     const [items, setItems] = useState<any[]>([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState("");
     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
     const [submitting, setSubmitting] = useState(false);

     const [formData, setFormData] = useState({
          code: "",
          name: "",
          category: "",
          unit: "",
          purchasePrice: "",
          sellingPrice: "",
          stock: "0",
          minStock: "10"
     });

     const fetchItems = async () => {
          setLoading(true);
          try {
               const res = await fetch("/api/medicines");
               if (res.ok) {
                    const data = await res.json();
                    setItems(data);
               }
          } catch (e) {
               console.error("Failed to fetch medicines:", e);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchItems();
     }, []);

     const handleSubmit = async () => {
          if (!formData.code || !formData.name || !formData.category || !formData.unit) {
               alert("Mohon isi semua field wajib.");
               return;
          }

          setSubmitting(true);
          try {
               const res = await fetch("/api/medicines", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                         ...formData,
                         purchasePrice: parseFloat(formData.purchasePrice),
                         sellingPrice: parseFloat(formData.sellingPrice),
                         stock: parseInt(formData.stock),
                         minStock: parseInt(formData.minStock)
                    })
               });

               if (res.ok) {
                    setIsAddModalOpen(false);
                    fetchItems();
                    setFormData({
                         code: "",
                         name: "",
                         category: "",
                         unit: "",
                         purchasePrice: "",
                         sellingPrice: "",
                         stock: "0",
                         minStock: "10"
                    });
               } else {
                    const err = await res.json();
                    alert(`Gagal: ${err.error || "Terjadi kesalahan"}`);
               }
          } catch (e) {
               console.error("Submit error:", e);
               alert("Terjadi kesalahan sistem.");
          } finally {
               setSubmitting(false);
          }
     };

     const filteredItems = items.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code.toLowerCase().includes(searchTerm.toLowerCase())
     );

     return (
          <div className="space-y-6">
               <div className="flex justify-between items-center">
                    <div>
                         <h1 className="text-3xl font-bold text-[#125eab]">Data Barang (Obat)</h1>
                         <p className="text-slate-500">Manajemen inventaris obat dan alat kesehatan.</p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)} className="bg-[#125eab] hover:bg-blue-700 shadow-md transition-all hover:scale-105">
                         <Plus className="w-4 h-4 mr-2" /> Tambah Barang
                    </Button>
               </div>

               <Card className="border-none shadow-lg overflow-hidden">
                    <CardContent className="p-0">
                         <div className="p-4 bg-slate-50 border-b flex items-center gap-4">
                              <div className="relative flex-1 max-w-sm">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                   <Input 
                                        placeholder="Cari nama atau kode obat..." 
                                        className="pl-10 bg-white border-slate-200" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                   />
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                   <Package className="w-4 h-4" />
                                   <span>Total: {items.length} Item</span>
                              </div>
                         </div>
                         <div className="overflow-x-auto">
                              <Table>
                                   <TableHeader className="bg-slate-50/50">
                                        <TableRow>
                                             <TableHead className="font-semibold">Kode</TableHead>
                                             <TableHead className="font-semibold">Nama Barang</TableHead>
                                             <TableHead className="font-semibold">Kategori</TableHead>
                                             <TableHead className="font-semibold">Stok</TableHead>
                                             <TableHead className="font-semibold">Satuan</TableHead>
                                             <TableHead className="font-semibold">Harga Jual</TableHead>
                                             <TableHead className="text-right font-semibold">Aksi</TableHead>
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        {loading ? (
                                             <TableRow>
                                                  <TableCell colSpan={7} className="text-center py-12">
                                                       <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#125eab] opacity-50" />
                                                       <p className="mt-2 text-slate-400">Memuat data barang...</p>
                                                  </TableCell>
                                             </TableRow>
                                        ) : filteredItems.length === 0 ? (
                                             <TableRow>
                                                  <TableCell colSpan={7} className="text-center py-12">
                                                       <div className="flex flex-col items-center gap-2 text-slate-400">
                                                            <AlertCircle className="w-10 h-10 opacity-20" />
                                                            <p>Data barang tidak ditemukan</p>
                                                       </div>
                                                  </TableCell>
                                             </TableRow>
                                        ) : (
                                             filteredItems.map((item) => (
                                                  <TableRow key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                                       <TableCell className="font-mono text-xs font-bold text-slate-500">{item.code}</TableCell>
                                                       <TableCell className="font-medium">{item.name}</TableCell>
                                                       <TableCell>
                                                            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                                                                 {item.category}
                                                            </span>
                                                       </TableCell>
                                                       <TableCell>
                                                            <span className={`font-bold ${item.stock <= (item.minStock || 5) ? 'text-red-500' : 'text-slate-700'}`}>
                                                                 {item.stock}
                                                            </span>
                                                       </TableCell>
                                                       <TableCell className="text-slate-500">{item.unit}</TableCell>
                                                       <TableCell className="font-semibold text-[#125eab]">
                                                            Rp {item.sellingPrice.toLocaleString('id-ID')}
                                                       </TableCell>
                                                       <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                 <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                                                      <Edit className="w-4 h-4" />
                                                                 </Button>
                                                                 <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                                                                      <Trash2 className="w-4 h-4" />
                                                                 </Button>
                                                            </div>
                                                       </TableCell>
                                                  </TableRow>
                                             ))
                                        )}
                                   </TableBody>
                              </Table>
                         </div>
                    </CardContent>
               </Card>

               <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                         <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-[#125eab]">Tambah Barang Baru</DialogTitle>
                              <DialogDescription>
                                   Masukkan informasi detail obat atau alat kesehatan baru.
                              </DialogDescription>
                         </DialogHeader>
                         <div className="grid grid-cols-2 gap-4 py-4">
                              <div className="space-y-2 col-span-1">
                                   <Label htmlFor="code">Kode Barang</Label>
                                   <Input id="code" placeholder="OBT-XXXX" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} />
                              </div>
                              <div className="space-y-2 col-span-1">
                                   <Label htmlFor="category">Kategori</Label>
                                   <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                                        <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="Obat Bebas">Obat Bebas</SelectItem>
                                             <SelectItem value="Obat Keras">Obat Keras</SelectItem>
                                             <SelectItem value="Alat Kesehatan">Alat Kesehatan</SelectItem>
                                             <SelectItem value="Suplemen">Suplemen</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div className="space-y-2 col-span-2">
                                   <Label htmlFor="name">Nama Barang</Label>
                                   <Input id="name" placeholder="Nama obat/barang" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                              </div>
                              <div className="space-y-2 col-span-1">
                                   <Label htmlFor="unit">Satuan</Label>
                                   <Select value={formData.unit} onValueChange={(v) => setFormData({...formData, unit: v})}>
                                        <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="Tablet">Tablet</SelectItem>
                                             <SelectItem value="Kapsul">Kapsul</SelectItem>
                                             <SelectItem value="Botol">Botol</SelectItem>
                                             <SelectItem value="Tube">Tube</SelectItem>
                                             <SelectItem value="Pcs">Pcs</SelectItem>
                                             <SelectItem value="Box">Box</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                              <div className="space-y-2 col-span-1">
                                   <Label htmlFor="stock">Stok Awal</Label>
                                   <Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                              </div>
                              <div className="space-y-2 col-span-1">
                                   <Label htmlFor="purchasePrice">Harga Beli</Label>
                                   <Input id="purchasePrice" type="number" placeholder="0" value={formData.purchasePrice} onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})} />
                              </div>
                              <div className="space-y-2 col-span-1">
                                   <Label htmlFor="sellingPrice">Harga Jual</Label>
                                   <Input id="sellingPrice" type="number" placeholder="0" value={formData.sellingPrice} onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})} />
                              </div>
                         </div>
                         <div className="flex justify-end gap-3 pt-4 border-t">
                              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
                              <Button onClick={handleSubmit} disabled={submitting} className="bg-[#125eab] hover:bg-blue-700 min-w-[120px]">
                                   {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                   Simpan Barang
                              </Button>
                         </div>
                    </DialogContent>
               </Dialog>
          </div>
     );
}
