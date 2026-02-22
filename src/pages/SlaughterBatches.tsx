import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Scissors } from "lucide-react";
import { motion } from "framer-motion";

const SlaughterBatches = () => {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [flocks, setFlocks] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ flock_id: "", quantity_birds: "", total_kg: "", batch_ref: "" });

  const canCreate = hasRole("super_admin") || hasRole("abattoir_operator");

  const fetchData = async () => {
    const { data: rows } = await supabase.from("slaughter_batch").select("*, flock(breed, cooperative(name))").order("created_at", { ascending: false });
    if (rows) setData(rows);
  };

  const fetchFlocks = async () => {
    const { data: rows } = await supabase.from("flock").select("id, breed, cooperative(name)");
    if (rows) setFlocks(rows);
  };

  useEffect(() => { fetchData(); fetchFlocks(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("slaughter_batch").insert({
      flock_id: form.flock_id,
      quantity_birds: parseInt(form.quantity_birds) || 0,
      total_kg: parseFloat(form.total_kg) || 0,
      batch_ref: form.batch_ref,
    });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Lot ajouté" });
      setForm({ flock_id: "", quantity_birds: "", total_kg: "", batch_ref: "" });
      setOpen(false);
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2 text-foreground">
            <Scissors className="h-6 w-6 text-destructive" /> Lots abattage
          </h1>
          <p className="text-muted-foreground">Suivi des abattages</p>
        </div>
        {canCreate && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-gold text-primary-foreground font-semibold hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" /> Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-gold">
              <DialogHeader><DialogTitle className="font-display">Nouveau lot abattage</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Lot d'élevage *</Label>
                  <Select value={form.flock_id} onValueChange={(v) => setForm({ ...form, flock_id: v })}>
                    <SelectTrigger className="bg-secondary/50 border-border"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {flocks.map((f: any) => <SelectItem key={f.id} value={f.id}>{f.breed} — {f.cooperative?.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nb volailles *</Label>
                    <Input type="number" value={form.quantity_birds} onChange={(e) => setForm({ ...form, quantity_birds: e.target.value })} required className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Poids total (kg) *</Label>
                    <Input type="number" step="0.1" value={form.total_kg} onChange={(e) => setForm({ ...form, total_kg: e.target.value })} required className="bg-secondary/50 border-border" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Réf. lot *</Label>
                  <Input value={form.batch_ref} onChange={(e) => setForm({ ...form, batch_ref: e.target.value })} required className="bg-secondary/50 border-border" />
                </div>
                <Button type="submit" className="w-full gradient-gold text-primary-foreground font-semibold">Créer</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
        className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gold hover:bg-transparent">
              <TableHead className="text-gold-light">Réf. lot</TableHead>
              <TableHead className="text-gold-light hidden sm:table-cell">Coopérative</TableHead>
              <TableHead className="text-gold-light">Race</TableHead>
              <TableHead className="text-gold-light">Volailles</TableHead>
              <TableHead className="text-gold-light hidden md:table-cell">Poids (kg)</TableHead>
              <TableHead className="text-gold-light hidden sm:table-cell">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">Aucun lot enregistré</TableCell></TableRow>
            ) : data.map((s) => (
              <TableRow key={s.id} className="border-border/50 hover:bg-secondary/30 transition-colors">
                <TableCell className="font-mono text-gold font-medium">{s.batch_ref}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{s.flock?.cooperative?.name || "—"}</TableCell>
                <TableCell>{s.flock?.breed || "—"}</TableCell>
                <TableCell className="font-semibold">{s.quantity_birds}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{s.total_kg} kg</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{s.slaughter_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default SlaughterBatches;
