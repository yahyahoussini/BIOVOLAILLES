import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Users, ShieldCheck, Search, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

type AppRole = "super_admin" | "cooperative_manager" | "hatchery_tech" | "conditioning_operator" | "abattoir_operator";

interface UserRow {
    id: string;
    email: string;
    full_name: string;
    role: string;
    cooperative_id: string | null;
    approved: boolean;
    created_at: string;
}

const ROLE_LABELS: Record<string, string> = {
    super_admin: "Super Admin",
    cooperative_manager: "Gérant Coop.",
    hatchery_tech: "Tech. Couvoir",
    conditioning_operator: "Op. Conditionn.",
    abattoir_operator: "Op. Abattoir",
};

const ALL_ROLES: AppRole[] = [
    "super_admin",
    "cooperative_manager",
    "hatchery_tech",
    "conditioning_operator",
    "abattoir_operator",
];

const UserManagement = () => {
    const { hasRole, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [users, setUsers] = useState<UserRow[]>([]);
    const [coops, setCoops] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [updating, setUpdating] = useState<Record<string, boolean>>({});

    const isSuperAdmin = hasRole("super_admin");

    const fetchUsers = async () => {
        const { data, error } = await supabase.rpc("get_all_users_admin");
        if (error) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
        } else if (data) {
            setUsers(data as UserRow[]);
        }
        setLoading(false);
    };

    const fetchCoops = async () => {
        const { data } = await supabase.from("cooperative").select("id, name").order("name");
        if (data) setCoops(data);
    };

    useEffect(() => {
        if (isSuperAdmin) {
            fetchUsers();
            fetchCoops();
        }
    }, [isSuperAdmin]);

    const filtered = useMemo(() => {
        if (!search) return users;
        const q = search.toLowerCase();
        return users.filter(
            (u) =>
                u.email.toLowerCase().includes(q) ||
                u.full_name.toLowerCase().includes(q) ||
                (ROLE_LABELS[u.role] || "").toLowerCase().includes(q)
        );
    }, [users, search]);

    const handleApproval = async (userId: string, approved: boolean) => {
        setUpdating((prev) => ({ ...prev, [userId]: true }));
        const { error } = await supabase.rpc("approve_user_admin", {
            target_user_id: userId,
            is_approved: approved,
        });
        if (error) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
        } else {
            toast({ title: approved ? "✅ Compte approuvé" : "❌ Compte désactivé" });
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, approved } : u))
            );
        }
        setUpdating((prev) => ({ ...prev, [userId]: false }));
    };

    const handleRoleChange = async (userId: string, newRole: AppRole) => {
        setUpdating((prev) => ({ ...prev, [userId]: true }));
        const { error } = await supabase.rpc("set_user_role_admin", {
            target_user_id: userId,
            new_role: newRole,
        });
        if (error) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Rôle mis à jour", description: ROLE_LABELS[newRole] });
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
            );
        }
        setUpdating((prev) => ({ ...prev, [userId]: false }));
    };

    const handleCoopChange = async (userId: string, coopId: string) => {
        setUpdating((prev) => ({ ...prev, [userId]: true }));
        const { error } = await supabase.rpc("set_user_cooperative_admin", {
            target_user_id: userId,
            new_coop_id: coopId,
        });
        if (error) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Coopérative assignée" });
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, cooperative_id: coopId } : u))
            );
        }
        setUpdating((prev) => ({ ...prev, [userId]: false }));
    };

    if (authLoading) return null;
    if (!isSuperAdmin) return <Navigate to="/" replace />;

    const pendingCount = users.filter((u) => !u.approved).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold font-display flex items-center gap-2 text-foreground">
                        <Users className="h-6 w-6 text-gold" /> Gestion des utilisateurs
                    </h1>
                    <p className="text-muted-foreground">
                        Approuver les comptes et attribuer les rôles
                    </p>
                </div>
                {pendingCount > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warning/10 border border-warning/30">
                        <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                        <span className="text-sm font-semibold text-warning">
                            {pendingCount} en attente
                        </span>
                    </div>
                )}
            </motion.div>

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher par email, nom ou rôle..."
                        className="pl-9 bg-secondary/30 border-border"
                    />
                </div>
            </motion.div>

            {/* Count */}
            <p className="text-xs text-muted-foreground">
                {filtered.length} utilisateur{filtered.length !== 1 ? "s" : ""}
            </p>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="glass-card rounded-xl overflow-hidden"
            >
                <Table>
                    <TableHeader>
                        <TableRow className="border-gold hover:bg-transparent">
                            <TableHead className="text-gold-light">Statut</TableHead>
                            <TableHead className="text-gold-light">Email</TableHead>
                            <TableHead className="text-gold-light hidden md:table-cell">Nom</TableHead>
                            <TableHead className="text-gold-light">Rôle</TableHead>
                            <TableHead className="text-gold-light hidden lg:table-cell">Coopérative</TableHead>
                            <TableHead className="text-gold-light hidden sm:table-cell">Inscription</TableHead>
                            <TableHead className="text-gold-light">Approuver</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                                    Chargement…
                                </TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                                    Aucun utilisateur trouvé
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((u) => (
                                <TableRow
                                    key={u.id}
                                    className={`border-border/50 transition-colors ${!u.approved ? "bg-warning/5" : "hover:bg-secondary/30"
                                        }`}
                                >
                                    {/* Status icon */}
                                    <TableCell>
                                        {u.approved ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-light" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-warning" />
                                        )}
                                    </TableCell>

                                    {/* Email */}
                                    <TableCell className="font-medium text-foreground text-sm">
                                        {u.email}
                                    </TableCell>

                                    {/* Name */}
                                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                                        {u.full_name || "—"}
                                    </TableCell>

                                    {/* Role dropdown */}
                                    <TableCell>
                                        <Select
                                            value={u.role || ""}
                                            onValueChange={(v) => handleRoleChange(u.id, v as AppRole)}
                                            disabled={!!updating[u.id]}
                                        >
                                            <SelectTrigger className="w-[150px] h-8 text-xs bg-secondary/30 border-border">
                                                <SelectValue placeholder="Aucun rôle" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ALL_ROLES.map((r) => (
                                                    <SelectItem key={r} value={r} className="text-xs">
                                                        {ROLE_LABELS[r]}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>

                                    {/* Cooperative dropdown */}
                                    <TableCell className="hidden lg:table-cell">
                                        <Select
                                            value={u.cooperative_id || "none"}
                                            onValueChange={(v) => handleCoopChange(u.id, v === "none" ? "" : v)}
                                            disabled={!!updating[u.id]}
                                        >
                                            <SelectTrigger className="w-[140px] h-8 text-xs bg-secondary/30 border-border">
                                                <SelectValue placeholder="Aucune" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none" className="text-xs">Aucune</SelectItem>
                                                {coops.map((c) => (
                                                    <SelectItem key={c.id} value={c.id} className="text-xs">
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>

                                    {/* Date */}
                                    <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">
                                        {u.created_at
                                            ? new Date(u.created_at).toLocaleDateString("fr-FR", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })
                                            : "—"}
                                    </TableCell>

                                    {/* Approve toggle */}
                                    <TableCell>
                                        <Switch
                                            checked={u.approved}
                                            onCheckedChange={(checked) => handleApproval(u.id, checked)}
                                            disabled={!!updating[u.id]}
                                            className="data-[state=checked]:bg-emerald"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </motion.div>
        </div>
    );
};

export default UserManagement;
