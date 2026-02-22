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
import { Plus, Bird } from "lucide-react";
import { motion } from "framer-motion";

const Flocks = () => {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [coops, setCoops] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ cooperative_id: "", breed: "", quantity_hens: "", quantity_males: "", feed_type: "" });

  const canCreate = hasRole("super_admin") || hasRole("cooperative_manager");

  const fetchData = async () => {
    const { data: rows } = await supabase.from("flock").select("*, cooperative(name)").order("created_at", { ascending: false });
    if (rows) setData(rows);
  };

  const fetchCoops = async () => {
    const { data: rows } = await supabase.from("cooperative").select("id, name");
    if (rows) setCoops(rows);
  };

  useEffect(() => { fetchData(); fetchCoops(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("flock").insert({
      cooperative_id: form.cooperative_id,
      breed: form.breed,
      quantity_hens: parseInt(form.quantity_hens) || 0,
      quantity_males: parseInt(form.quantity_males) || 0,
      feed_type: form.feed_type || null,
    });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Lot ajouté" });
      setForm({ cooperative_id: "", breed: "", quantity_hens: "", quantity_males: "", feed_type: "" });
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
            <Bird className="h-6 w-6 text-emerald-light" /> Lots d'élevage
          </h1>
          <p className="text-muted-foreground">Suivi des troupeaux</p>
        </div>
        {canCreate && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-gold text-primary-foreground font-semibold hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" /> Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-gold">
              <DialogHeader><DialogTitle className="font-display">Nouveau lot d'élevage</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Coopérative *</Label>
                  <Select value={form.cooperative_id} onValueChange={(v) => setForm({ ...form, cooperative_id: v })}>
                    <SelectTrigger className="bg-secondary/50 border-border"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>{coops.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Race *</Label>
                  <Input value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} required className="bg-secondary/50 border-border" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Poules</Label>
                    <Input type="number" value={form.quantity_hens} onChange={(e) => setForm({ ...form, quantity_hens: e.target.value })} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Coqs</Label>
                    <Input type="number" value={form.quantity_males} onChange={(e) => setForm({ ...form, quantity_males: e.target.value })} className="bg-secondary/50 border-border" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Type d'alimentation</Label>
                  <Input value={form.feed_type} onChange={(e) => setForm({ ...form, feed_type: e.target.value })} className="bg-secondary/50 border-border" />
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
              <TableHead className="text-gold-light">Coopérative</TableHead>
              <TableHead className="text-gold-light">Race</TableHead>
              <TableHead className="text-gold-light">Poules</TableHead>
              <TableHead className="text-gold-light">Coqs</TableHead>
              <TableHead className="text-gold-light hidden md:table-cell">Alimentation</TableHead>
              <TableHead className="text-gold-light hidden sm:table-cell">Date arrivée</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">Aucun lot enregistré</TableCell></TableRow>
            ) : data.map((f) => (
              <TableRow key={f.id} className="border-border/50 hover:bg-secondary/30 transition-colors">
                <TableCell className="font-medium text-foreground">{f.cooperative?.name || "—"}</TableCell>
                <TableCell className="text-gold-light">{f.breed}</TableCell>
                <TableCell>{f.quantity_hens}</TableCell>
                <TableCell>{f.quantity_males}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{f.feed_type || "—"}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{f.arrival_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default Flocks;
