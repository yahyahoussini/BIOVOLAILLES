import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Package, Sparkles, Search, QrCode, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { ParticleBurst, useParticleBurst } from "@/components/ParticleBurst";
import { BatchCertificate } from "@/components/BatchCertificate";
import { useSoundEffect, SoundToggle } from "@/components/trace/SoundEffect";
import QRCode from "qrcode";

function generateBatchRef(): string {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(1000 + Math.random() * 9000));
  return `BVU-${year}-${seq}`;
}

const PackagingBatches = () => {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [flocks, setFlocks] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ flock_id: "", quantity_eggs: "", grade: "" });
  const { particles, triggerBurst } = useParticleBurst();
  const { enabled: soundEnabled, toggle: toggleSound, play: playSound } = useSoundEffect();

  // Filters
  const [search, setSearch] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterCooperative, setFilterCooperative] = useState("all");

  // Certificate dialog
  const [certBatch, setCertBatch] = useState<any>(null);
  const [certOpen, setCertOpen] = useState(false);

  const canCreate = hasRole("super_admin") || hasRole("conditioning_operator");

  const fetchData = async () => {
    const { data: rows } = await supabase
      .from("packaging_batch")
      .select("*, flock(breed, cooperative(name))")
      .order("created_at", { ascending: false });
    if (rows) setData(rows);
  };

  const fetchFlocks = async () => {
    const { data: rows } = await supabase.from("flock").select("id, breed, cooperative(name)");
    if (rows) setFlocks(rows);
  };

  useEffect(() => { fetchData(); fetchFlocks(); }, []);

  // Derived filter lists
  const cooperatives = useMemo(() => {
    const names = new Set(data.map((p) => p.flock?.cooperative?.name).filter(Boolean));
    return Array.from(names) as string[];
  }, [data]);

  const grades = useMemo(() => {
    const gs = new Set(data.map((p) => p.grade).filter(Boolean));
    return Array.from(gs) as string[];
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((p) => {
      const matchSearch = !search || p.batch_ref?.toLowerCase().includes(search.toLowerCase())
        || p.flock?.cooperative?.name?.toLowerCase().includes(search.toLowerCase())
        || p.flock?.breed?.toLowerCase().includes(search.toLowerCase());
      const matchGrade = filterGrade === "all" || p.grade === filterGrade;
      const matchCoop = filterCooperative === "all" || p.flock?.cooperative?.name === filterCooperative;
      return matchSearch && matchGrade && matchCoop;
    });
  }, [data, search, filterGrade, filterCooperative]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const batchRef = generateBatchRef();
    const traceUrl = `${window.location.origin}/trace/${batchRef}`;

    // Generate QR data URL to store
    let qrUrl = "";
    try {
      qrUrl = await QRCode.toDataURL(traceUrl, { width: 300, errorCorrectionLevel: "H" });
    } catch { /* fallback: empty */ }

    const { data: inserted, error } = await supabase.from("packaging_batch").insert({
      flock_id: form.flock_id,
      quantity_eggs: parseInt(form.quantity_eggs) || 0,
      grade: form.grade || null,
      batch_ref: batchRef,
      qr_code_url: traceUrl,
    }).select("*, flock(breed, cooperative(name))").single();

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      triggerBurst();
      playSound();
      toast({ title: "✨ Lot créé avec succès", description: `Réf: ${batchRef}` });
      setForm({ flock_id: "", quantity_eggs: "", grade: "" });
      setOpen(false);
      fetchData();
      // Show certificate immediately
      if (inserted) {
        setCertBatch(inserted);
        setCertOpen(true);
      }
    }
  };

  const openCertificate = (batch: any) => {
    setCertBatch(batch);
    setCertOpen(true);
  };

  return (
    <div className="space-y-6">
      <ParticleBurst particles={particles} />
      <BatchCertificate open={certOpen} onOpenChange={setCertOpen} batch={certBatch} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2 text-foreground">
            <Package className="h-6 w-6 text-gold" /> Lots conditionnement
          </h1>
          <p className="text-muted-foreground">Conditionnement des œufs avec QR de traçabilité</p>
        </div>
        <div className="flex items-center gap-2">
          <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
        {canCreate && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-gold text-primary-foreground font-semibold hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" /> Nouveau lot
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-gold">
              <DialogHeader>
                <DialogTitle className="font-display flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold" /> Nouveau lot conditionnement
                </DialogTitle>
              </DialogHeader>
              <p className="text-xs text-muted-foreground -mt-2 mb-2">
                La référence <span className="text-gold font-mono">BVU-{new Date().getFullYear()}-XXXX</span> sera générée automatiquement
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Lot d'élevage *</Label>
                  <Select value={form.flock_id} onValueChange={(v) => setForm({ ...form, flock_id: v })}>
                    <SelectTrigger className="bg-secondary/50 border-border"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {flocks.map((f: any) => (
                        <SelectItem key={f.id} value={f.id}>{f.breed} — {f.cooperative?.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantité œufs *</Label>
                  <Input type="number" value={form.quantity_eggs} onChange={(e) => setForm({ ...form, quantity_eggs: e.target.value })} required className="bg-secondary/50 border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="A, B, C..." className="bg-secondary/50 border-border" />
                </div>
                <Button type="submit" className="w-full gradient-gold text-primary-foreground font-semibold">
                  <Sparkles className="h-4 w-4 mr-2" /> Créer & Générer QR
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par réf, coopérative, race..."
            className="pl-9 bg-secondary/30 border-border"
          />
        </div>
        <Select value={filterCooperative} onValueChange={setFilterCooperative}>
          <SelectTrigger className="w-full sm:w-44 bg-secondary/30 border-border">
            <SelectValue placeholder="Coopérative" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes coopératives</SelectItem>
            {cooperatives.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterGrade} onValueChange={setFilterGrade}>
          <SelectTrigger className="w-full sm:w-32 bg-secondary/30 border-border">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous grades</SelectItem>
            {grades.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} lot{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
        className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gold hover:bg-transparent">
              <TableHead className="text-gold-light">Réf. lot</TableHead>
              <TableHead className="text-gold-light hidden sm:table-cell">Coopérative</TableHead>
              <TableHead className="text-gold-light hidden md:table-cell">Race</TableHead>
              <TableHead className="text-gold-light">Œufs</TableHead>
              <TableHead className="text-gold-light hidden md:table-cell">Grade</TableHead>
              <TableHead className="text-gold-light hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-gold-light w-20">QR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-12">Aucun lot trouvé</TableCell></TableRow>
            ) : filtered.map((p) => (
              <TableRow key={p.id} className="border-border/50 hover:bg-secondary/30 transition-colors">
                <TableCell className="font-mono text-gold font-medium">{p.batch_ref}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{p.flock?.cooperative?.name || "—"}</TableCell>
                <TableCell className="hidden md:table-cell">{p.flock?.breed || "—"}</TableCell>
                <TableCell className="font-semibold">{p.quantity_eggs}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {p.grade ? <span className="text-xs px-2 py-0.5 rounded-md bg-emerald/20 text-emerald-light">{p.grade}</span> : "—"}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{p.package_date}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openCertificate(p)}
                    className="text-gold hover:text-gold hover:bg-gold/10"
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default PackagingBatches;
