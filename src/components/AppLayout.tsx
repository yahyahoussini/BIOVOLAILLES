import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageTransition } from "@/components/PageTransition";
import { BiovolaillesLoader } from "@/components/BiovolaillesLoader";
import { Menu, Clock, Egg } from "lucide-react";
import { motion } from "framer-motion";

const AppLayout = () => {
  const { user, loading, approved, hasRole } = useAuth();

  if (loading) return <BiovolaillesLoader />;
  if (!user) return <Navigate to="/auth" replace />;

  // Unapproved non-admin users see a waiting screen
  if (!approved && !hasRole("super_admin")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="gradient-gold p-5 rounded-3xl inline-flex glow-gold"
          >
            <Egg className="h-10 w-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Compte en attente
          </h1>
          <div className="flex items-center justify-center gap-2 text-warning">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-semibold">En attente d'approbation</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Votre compte a bien été créé. Un administrateur doit l'approuver avant que vous puissiez accéder au système de traçabilité.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Contactez votre responsable pour accélérer le processus.
          </p>
          <button
            onClick={() => { window.location.reload(); }}
            className="text-gold underline text-sm hover:text-gold-light transition-colors"
          >
            Rafraîchir le statut
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <header className="flex items-center gap-3 border-b border-gold px-6 py-3 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger>
              <Menu className="h-5 w-5 text-muted-foreground hover:text-gold transition-colors" />
            </SidebarTrigger>
            <div className="h-4 w-px bg-border" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              Biovolailles Union Trace
            </span>
          </header>
          <div className="p-6 lg:p-8">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
