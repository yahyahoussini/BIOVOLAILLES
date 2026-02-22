import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageTransition } from "@/components/PageTransition";
import { BiovolaillesLoader } from "@/components/BiovolaillesLoader";
import { Menu } from "lucide-react";

const AppLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <BiovolaillesLoader />;
  if (!user) return <Navigate to="/auth" replace />;

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
