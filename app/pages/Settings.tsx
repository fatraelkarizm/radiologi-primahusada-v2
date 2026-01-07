import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pengaturan</h1>
          <p className="text-muted-foreground">
            Kelola preferensi akun dan pengaturan sistem Anda.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Halaman Pengaturan</CardTitle>
          <CardDescription>
            Fitur pengaturan akan ditambahkan di sini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <SettingsIcon className="w-12 h-12 mx-auto mb-2" />
              <p>Fitur sedang dalam pengembangan.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}