import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Building2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { TiltCard } from "@/components/TiltCard";

interface Cooperative {
  id: string;
  name: string;
  location: string | null;
  gps_lat: number | null;
  gps_lng: number | null;
  manager_name: string | null;
  certification_number: string | null;
  created_at: string;
}

const cardContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const cardItem = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Cooperatives = () => {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<Cooperative[]>([]);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [form, setForm] = useState({ name: "", location: "", manager_name: "", certification_number: "" });

  const canCreate = hasRole("super_admin");

  const fetchData = async () => {
    const { data: rows } = await supabase.from("cooperative").select("*").order("created_at", { ascending: false });
    if (rows) setData(rows as Cooperative[]);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("cooperative").insert({
      name: form.name,
      location: form.location || null,
      manager_name: form.manager_name || null,
      certification_number: form.certification_number || null,
    });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Coopérative ajoutée" });
      setForm({ name: "", location: "", manager_name: "", certification_number: "" });
      setOpen(false);
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2 text-foreground">
            <Building2 className="h-6 w-6 text-gold" /> Coopératives
          </h1>
          <p className="text-muted-foreground">Gestion des coopératives partenaires</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-secondary/50 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === "cards" ? "gradient-gold text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Cartes
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === "table" ? "gradient-gold text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Tableau
            </button>
          </div>
          {canCreate && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-gold text-primary-foreground font-semibold hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" /> Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-gold">
                <DialogHeader><DialogTitle className="font-display">Nouvelle coopérative</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nom *</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Localisation</Label>
                    <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom du gérant</Label>
                    <Input value={form.manager_name} onChange={(e) => setForm({ ...form, manager_name: e.target.value })} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>N° certification</Label>
                    <Input value={form.certification_number} onChange={(e) => setForm({ ...form, certification_number: e.target.value })} className="bg-secondary/50 border-border" />
                  </div>
                  <Button type="submit" className="w-full gradient-gold text-primary-foreground font-semibold">Créer</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </motion.div>

      {/* Cards view with tilt effect */}
      {viewMode === "cards" && (
        <motion.div variants={cardContainer} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-12 glass-card rounded-xl">Aucune coopérative enregistrée</div>
          ) : data.map((c) => (
            <motion.div key={c.id} variants={cardItem}>
              <TiltCard className="glass-card glass-card-hover rounded-xl p-5 cursor-default h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="gradient-gold p-2 rounded-lg">
                    <Building2 className="h-4 w-4 text-primary-foreground" />
                  </div>
                  {c.certification_number && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald/20 text-emerald-light font-mono">
                      {c.certification_number}
                    </span>
                  )}
                </div>
                <h3 className="font-display font-semibold text-foreground text-lg mb-1">{c.name}</h3>
                {c.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gold" /> {c.location}
                  </p>
                )}
                {c.manager_name && (
                  <p className="text-xs text-muted-foreground mt-2">Gérant: <span className="text-foreground/80">{c.manager_name}</span></p>
                )}
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Table view */}
      {viewMode === "table" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
          className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gold hover:bg-transparent">
                <TableHead className="text-gold-light">Nom</TableHead>
                <TableHead className="text-gold-light">Localisation</TableHead>
                <TableHead className="text-gold-light">Gérant</TableHead>
                <TableHead className="text-gold-light">Certification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-12">Aucune coopérative</TableCell></TableRow>
              ) : data.map((c) => (
                <TableRow key={c.id} className="border-border/50 hover:bg-secondary/30 transition-colors">
                  <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">{c.location || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{c.manager_name || "—"}</TableCell>
                  <TableCell>
                    {c.certification_number ? (
                      <span className="text-xs px-2 py-0.5 rounded-md bg-emerald/20 text-emerald-light font-mono">{c.certification_number}</span>
                    ) : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </div>
  );
};

export default Cooperatives;
